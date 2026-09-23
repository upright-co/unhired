"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { assessmentCopy } from "@/content/assessment";
import type { Question } from "@/lib/schemas";
import { trackEvent } from "@/lib/analytics";
import { getUtm } from "@/lib/utm";
import { ReportView } from "@/components/report/ReportView";
import {
  ApiError,
  fetchQuestions,
  generateReport,
  primeProofOfWork,
  setTokenProvider,
  startSession,
  submitContact,
  type AnswerBody,
  type DraftResult,
  type RoleContextBody,
  type SubmitResult,
} from "./api";
import { ErrorPanel, LoadingPanel, ProgressBar, StepFrame } from "./parts";
import { StepBudget, parseBudget, type BudgetState } from "./StepBudget";
import { StepGate, type ContactState } from "./StepGate";
import { StepJob, jobText, type JobState } from "./StepJob";
import { StepQuestion, answerToText, type AnswerValue } from "./StepQuestion";
import { StepRole, type RoleState } from "./StepRole";
import { Turnstile, type TurnstileHandle } from "./Turnstile";

type Step =
  | { kind: "role" }
  | { kind: "job" }
  | { kind: "question"; index: number }
  | { kind: "budget" }
  | { kind: "loading"; lines: string[] }
  | { kind: "error"; message: string; retry?: () => void; back?: () => void }
  | { kind: "gate" }
  | { kind: "report" };

export const PREFILL_EVENT = "unhired:prefill-role";

export function Assessment() {
  const copy = assessmentCopy;
  const [step, setStep] = useState<Step>({ kind: "role" });
  const stepRef = useRef<Step>(step);
  stepRef.current = step;
  const [role, setRole] = useState<RoleState>({ role: "", industry: "", teamSize: "" });
  const [job, setJob] = useState<JobState>({ mode: "describe", description: "", upload: null });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [round2Done, setRound2Done] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const answersRef = useRef<Record<string, AnswerValue>>({});
  const [budget, setBudget] = useState<BudgetState>({ amount: "", period: "annual" });
  const [draft, setDraft] = useState<DraftResult | null>(null);
  const [contact, setContact] = useState<ContactState>({
    firstName: "",
    email: "",
    business: "",
    phone: "",
    consent: false,
    honeypot: "",
  });
  const [roleHoneypot, setRoleHoneypot] = useState("");
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gateError, setGateError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const turnstile = useRef<TurnstileHandle>(null);
  const container = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    setTokenProvider(() => turnstile.current?.getToken() ?? Promise.resolve(null));
    // Solve the bot-protection challenge in the background while they fill in step 1.
    primeProofOfWork();
  }, []);

  // "Unhire this role" links elsewhere on the page prefill the role title.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      if (stepRef.current.kind === "role") setRole((r) => ({ ...r, role: title }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  // Move focus to the new step's heading for keyboard and screen-reader users.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      const h = container.current?.querySelector<HTMLElement>("#assessment-step-heading");
      h?.focus({ preventScroll: true });
      const top = container.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) container.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 380);
    return () => clearTimeout(t);
  }, [step]);

  const ctx = useCallback(
    (): RoleContextBody => ({
      role_title: role.role.trim(),
      industry: role.industry,
      team_size: role.teamSize,
      description: jobText(job),
    }),
    [role, job],
  );

  const answerList = useCallback(
    (qs: Question[]): AnswerBody[] =>
      qs.map((q) => ({ id: q.id, question: q.prompt, answer: answerToText(q, answersRef.current[q.id]) })),
    [],
  );

  const errorMessage = (err: unknown) => {
    if (err instanceof ApiError && err.code === "rate_limited") return copy.errors.rateLimited;
    return copy.errors.generic;
  };

  /* ---------------- step transitions ---------------- */

  async function onRoleNext() {
    setStarting(true);
    try {
      if (!started.current) {
        await startSession(roleHoneypot);
        started.current = true;
        trackEvent("assessment_started", { role: role.role, industry: role.industry });
      }
      trackEvent("step_completed", { step: "role" });
      setStep({ kind: "job" });
    } catch (err) {
      setStep({ kind: "error", message: errorMessage(err), retry: () => setStep({ kind: "role" }) });
    } finally {
      setStarting(false);
    }
  }

  async function loadRound1() {
    trackEvent("step_completed", { step: "job", mode: job.mode });
    setStep({ kind: "loading", lines: copy.loading.questions });
    try {
      const res = await fetchQuestions(ctx(), 1, []);
      setQuestions(res.questions);
      setRound2Done(false);
      if (res.questions.length) setStep({ kind: "question", index: 0 });
      else setStep({ kind: "budget" });
    } catch (err) {
      setStep({
        kind: "error",
        message: errorMessage(err),
        retry: loadRound1,
        back: () => setStep({ kind: "job" }),
      });
    }
  }

  async function loadRound2(currentQs: Question[]) {
    setStep({ kind: "loading", lines: copy.loading.followup });
    try {
      const res = await fetchQuestions(ctx(), 2, answerList(currentQs));
      setRound2Done(true);
      if (res.needs_more_info && res.questions.length) {
        const next = [...currentQs, ...res.questions];
        setQuestions(next);
        setStep({ kind: "question", index: currentQs.length });
      } else {
        setStep({ kind: "budget" });
      }
    } catch {
      // Follow-ups are optional: move on rather than blocking the visitor.
      setRound2Done(true);
      setStep({ kind: "budget" });
    }
  }

  function onQuestionNext(index: number) {
    trackEvent("step_completed", { step: `question_${index + 1}`, question_id: questions[index]?.id });
    if (index + 1 < questions.length) {
      setStep({ kind: "question", index: index + 1 });
    } else if (!round2Done) {
      loadRound2(questions);
    } else {
      setStep({ kind: "budget" });
    }
  }

  function onQuestionBack(index: number) {
    if (index > 0) setStep({ kind: "question", index: index - 1 });
    else setStep({ kind: "job" });
  }

  async function buildReport(withBudget: boolean) {
    trackEvent("step_completed", { step: "budget", provided: withBudget });
    setStep({ kind: "loading", lines: copy.loading.report });
    try {
      const res = await generateReport(ctx(), answerList(questions), withBudget ? parseBudget(budget) : null);
      setDraft(res);
      setStep({ kind: "gate" });
    } catch (err) {
      setStep({
        kind: "error",
        message: errorMessage(err),
        retry: () => buildReport(withBudget),
        back: () => setStep({ kind: "budget" }),
      });
    }
  }

  async function onSubmitContact() {
    if (!draft) return;
    setSubmitting(true);
    setGateError(null);
    try {
      const res = await submitContact({
        id: draft.id,
        first_name: contact.firstName.trim(),
        email: contact.email.trim(),
        business: contact.business.trim(),
        phone: contact.phone.trim(),
        consent: contact.consent,
        website: contact.honeypot,
        ...getUtm(),
      });
      trackEvent("email_submitted", {
        role: role.role,
        industry: role.industry,
        coverage: draft.coverage_percent,
      });
      setResult(res);
      setStep({ kind: "report" });
    } catch (err) {
      setGateError(err instanceof ApiError && err.status === 400 ? err.message : errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  function setAnswer(id: string, v: AnswerValue) {
    answersRef.current = { ...answersRef.current, [id]: v };
    setAnswers(answersRef.current);
  }

  function restart() {
    answersRef.current = {};
    setAnswers({});
    setQuestions([]);
    setRound2Done(false);
    setDraft(null);
    setResult(null);
    setBudget({ amount: "", period: "annual" });
    setJob({ mode: "describe", description: "", upload: null });
    setStep({ kind: "role" });
  }

  /* ---------------- progress ---------------- */

  const progress = (() => {
    switch (step.kind) {
      case "role":
        return { v: 0.06, i: 0 };
      case "job":
        return { v: 0.22, i: 1 };
      case "question":
        return { v: 0.34 + 0.42 * (step.index / Math.max(1, questions.length)), i: 2 };
      case "budget":
        return { v: 0.8, i: 2 };
      case "gate":
        return { v: 0.92, i: 3 };
      case "report":
        return { v: 1, i: 3 };
      default:
        return null;
    }
  })();
  const lastProgress = useRef({ v: 0.06, i: 0 });
  if (progress) lastProgress.current = progress;

  /* ---------------- render ---------------- */

  if (step.kind === "report" && result) {
    return (
      <div ref={container}>
        <ReportView
          id={result.id}
          report={result.report}
          shareUrl={result.url}
          business={contact.business}
          embedded
          onRestart={restart}
        />
      </div>
    );
  }

  const stepKey =
    step.kind === "question" ? `q-${step.index}` : step.kind === "loading" ? `loading-${step.lines[0]}` : step.kind;

  return (
    <div ref={container} className="relative">
      <ProgressBar value={lastProgress.current.v} steps={copy.steps} activeIndex={lastProgress.current.i} />

      <StepFrame stepKey={stepKey}>
        {step.kind === "role" && (
          <StepRole
            value={role}
            onChange={setRole}
            onNext={onRoleNext}
            busy={starting}
            honeypot={roleHoneypot}
            setHoneypot={setRoleHoneypot}
          />
        )}
        {step.kind === "job" && (
          <StepJob value={job} onChange={setJob} onNext={loadRound1} onBack={() => setStep({ kind: "role" })} />
        )}
        {step.kind === "question" && questions[step.index] && (
          <StepQuestion
            question={questions[step.index]}
            index={step.index}
            total={questions.length}
            value={answers[questions[step.index].id]}
            onChange={(v) => setAnswer(questions[step.index].id, v)}
            onNext={() => onQuestionNext(step.index)}
            onBack={() => onQuestionBack(step.index)}
          />
        )}
        {step.kind === "budget" && (
          <StepBudget
            value={budget}
            onChange={setBudget}
            onNext={() => buildReport(true)}
            onSkip={() => buildReport(false)}
            onBack={() =>
              questions.length ? setStep({ kind: "question", index: questions.length - 1 }) : setStep({ kind: "job" })
            }
          />
        )}
        {step.kind === "loading" && <LoadingPanel lines={step.lines} />}
        {step.kind === "error" && (
          <ErrorPanel message={step.message} onRetry={step.retry} retryLabel={copy.errors.retry} onBack={step.back} />
        )}
        {step.kind === "gate" && draft && (
          <StepGate
            draft={draft}
            value={contact}
            onChange={setContact}
            onSubmit={onSubmitContact}
            busy={submitting}
            error={gateError}
          />
        )}
      </StepFrame>

      <Turnstile ref={turnstile} />
    </div>
  );
}
