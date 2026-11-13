"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import { pilotQuiz } from "@/content/pilot";
import { siteConfig } from "@/config";
import { trackEvent } from "@/lib/analytics";
import { getUtm } from "@/lib/utm";

type Values = {
  business: string;
  industry: string;
  team_size: string;
  revenue: string;
  area: string;
  hiring: string;
  role: string;
  why_choose: string;
  owner_present: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_url: string;
};

const EMPTY: Values = {
  business: "",
  industry: "",
  team_size: "",
  revenue: "",
  area: "",
  hiring: "",
  role: "",
  why_choose: "",
  owner_present: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company_url: "",
};

type Step =
  | { key: keyof Values; kind: "text" | "email" | "tel" | "long"; title: string; hint?: string; placeholder?: string }
  | { key: keyof Values; kind: "choice"; title: string; hint?: string; options: readonly string[] }
  | { key: "name"; kind: "name"; title: string };

const q = pilotQuiz.questions;
const o = pilotQuiz.options;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STEPS: Step[] = [
  { key: "business", kind: "text", ...q.business },
  { key: "industry", kind: "long", ...q.industry },
  { key: "team_size", kind: "choice", ...q.team_size, options: o.teamSize },
  { key: "revenue", kind: "choice", ...q.revenue, options: o.revenue },
  { key: "area", kind: "choice", ...q.area, options: o.area },
  { key: "hiring", kind: "choice", ...q.hiring, options: o.hiring },
  { key: "role", kind: "long", ...q.role },
  { key: "why_choose", kind: "long", ...q.why_choose },
  { key: "owner_present", kind: "choice", ...q.owner_present, options: o.ownerPresent },
  { key: "name", kind: "name", title: q.name.title },
  { key: "email", kind: "email", ...q.email },
  { key: "phone", kind: "tel", ...q.phone },
];

export function Questionnaire() {
  const [v, setV] = useState<Values>(EMPTY);
  // -1 = intro screen, STEPS.length = done
  const [i, setI] = useState(-1);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const step = i >= 0 && i < STEPS.length ? STEPS[i] : null;
  const fill = (s: string) =>
    s.replace("{business}", v.business.trim() || "your business").replace("{first}", v.first_name.trim() || "");

  useEffect(() => {
    // Focus the field on each new question (desktop keyboards; harmless on phones).
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 320);
    return () => clearTimeout(t);
  }, [i]);

  const valid = useMemo(() => {
    if (!step) return true;
    if (step.kind === "name") return Boolean(v.first_name.trim() && v.last_name.trim());
    const val = v[step.key].trim();
    if (!val) return false;
    if (step.kind === "email") return EMAIL_RE.test(val);
    if (step.kind === "tel") return val.replace(/\D/g, "").length >= 7;
    return true;
  }, [step, v]);

  function go(n: number) {
    setDir(n > i ? 1 : -1);
    setError(null);
    setI(n);
  }

  function next() {
    if (!step) return;
    if (!valid) {
      const empty = step.kind !== "name" && !v[step.key].trim();
      setError(
        step.kind === "email" && !empty
          ? pilotQuiz.errors.email
          : step.kind === "tel" && !empty
            ? pilotQuiz.errors.phone
            : pilotQuiz.errors.required,
      );
      return;
    }
    trackEvent("pilot_step_completed", { step: i + 1, question: step.key });
    if (i === STEPS.length - 1) void submit();
    else go(i + 1);
  }

  function choose(key: keyof Values, value: string) {
    setV((p) => ({ ...p, [key]: value }));
    setError(null);
    trackEvent("pilot_step_completed", { step: i + 1, question: key });
    // Short pause so the selection registers before moving on.
    setTimeout(() => go(i + 1), 260);
  }

  async function submit() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/pilot/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, ...getUtm() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackEvent("pilot_applied", { team_size: v.team_size, revenue: v.revenue, hiring: v.hiring });
      go(STEPS.length);
    } catch {
      setError(pilotQuiz.errors.generic);
    } finally {
      setSending(false);
    }
  }

  function onKey(e: React.KeyboardEvent, long = false) {
    if (e.key !== "Enter") return;
    if (long && !(e.metaKey || e.ctrlKey)) return; // Enter adds a new line in the long answer
    e.preventDefault();
    next();
  }

  const progress = i < 0 ? 0 : Math.min(1, i / STEPS.length);

  return (
    <div className="relative flex min-h-[100svh] flex-col">
      {/* Progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-white/10">
        <motion.div className="bg-signal h-full" animate={{ width: `${(i >= STEPS.length ? 1 : progress) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Company URL
          <input tabIndex={-1} autoComplete="off" value={v.company_url} onChange={(e) => setV((p) => ({ ...p, company_url: e.target.value }))} />
        </label>
      </div>

      <div className="flex flex-1 items-center px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={i}
              custom={dir}
              initial={{ opacity: 0, y: dir * 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dir * -28 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {i < 0 && (
                <div>
                  <p className="text-signal font-display text-lg font-bold tracking-tight sm:text-xl">{pilotQuiz.intro.kicker}</p>
                  <h1 className="mt-3 text-[2.4rem] leading-[1.05] font-bold tracking-[-0.04em] text-white sm:text-6xl">
                    {pilotQuiz.intro.title}
                  </h1>
                  <p className="mt-5 text-lg text-white/70">{pilotQuiz.intro.sub}</p>
                  <button type="button" onClick={() => go(0)} className="btn btn-primary mt-10 px-9 py-4 text-base">
                    {pilotQuiz.intro.start} <ArrowRight className="size-4" aria-hidden />
                  </button>
                </div>
              )}

              {step && (
                <div>
                  <p className="label-mono flex items-center gap-2 text-white/50">
                    <span className="text-signal font-bold">{i + 1}</span>
                    <span>/ {STEPS.length}</span>
                  </p>
                  <h1 className="mt-3 text-[1.9rem] leading-[1.15] font-semibold tracking-[-0.03em] text-white sm:text-[2.6rem]">
                    {fill(step.title)}
                  </h1>
                  {"hint" in step && step.hint && <p className="mt-3 text-white/60">{step.hint}</p>}

                  <div className="mt-8">
                    {step.kind === "choice" && (
                      <div role="radiogroup" aria-label={fill(step.title)} className="grid gap-2.5 sm:grid-cols-2">
                        {step.options.map((opt, n) => {
                          const on = v[step.key] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() => choose(step.key, opt)}
                              className={`group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-base font-medium transition-all ${
                                on
                                  ? "border-transparent bg-white text-ink shadow-[var(--shadow-glow)]"
                                  : "border-white/15 bg-white/[0.06] text-white hover:border-white/40 hover:bg-white/[0.1]"
                              }`}
                            >
                              <span
                                className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold ${
                                  on ? "bg-signal text-white" : "bg-white/10 text-white/70"
                                }`}
                              >
                                {on ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : String.fromCharCode(65 + n)}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {(step.kind === "text" || step.kind === "email" || step.kind === "tel") && (
                      <input
                        ref={(el) => {
                          inputRef.current = el;
                        }}
                        type={step.kind}
                        inputMode={step.kind === "tel" ? "tel" : step.kind === "email" ? "email" : undefined}
                        autoComplete={step.key === "business" ? "organization" : step.kind === "email" ? "email" : step.kind === "tel" ? "tel" : "off"}
                        aria-label={fill(step.title)}
                        placeholder={step.placeholder}
                        value={v[step.key]}
                        onChange={(e) => {
                          setV((p) => ({ ...p, [step.key]: e.target.value }));
                          setError(null);
                        }}
                        onKeyDown={(e) => onKey(e)}
                        className="w-full border-b-2 border-white/25 bg-transparent pb-3 text-2xl text-white placeholder:text-white/30 focus:border-violet focus:outline-none sm:text-3xl"
                      />
                    )}

                    {step.kind === "long" && (
                      <textarea
                        ref={(el) => {
                          inputRef.current = el;
                        }}
                        rows={5}
                        aria-label={fill(step.title)}
                        placeholder={step.placeholder}
                        value={v[step.key]}
                        onChange={(e) => {
                          setV((p) => ({ ...p, [step.key]: e.target.value }));
                          setError(null);
                        }}
                        onKeyDown={(e) => onKey(e, true)}
                        className="w-full resize-y rounded-2xl border border-white/20 bg-white/[0.06] p-4 text-lg text-white placeholder:text-white/30 focus:border-violet focus:outline-none"
                      />
                    )}

                    {step.kind === "name" && (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {(["first_name", "last_name"] as const).map((k, n) => (
                          <input
                            key={k}
                            ref={
                              n === 0
                                ? (el) => {
                                    inputRef.current = el;
                                  }
                                : undefined
                            }
                            autoComplete={n === 0 ? "given-name" : "family-name"}
                            aria-label={n === 0 ? q.name.first : q.name.last}
                            placeholder={n === 0 ? q.name.first : q.name.last}
                            value={v[k]}
                            onChange={(e) => {
                              setV((p) => ({ ...p, [k]: e.target.value }));
                              setError(null);
                            }}
                            onKeyDown={(e) => onKey(e)}
                            className="w-full border-b-2 border-white/25 bg-transparent pb-3 text-2xl text-white placeholder:text-white/30 focus:border-violet focus:outline-none sm:text-3xl"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {error && (
                    <p role="alert" className="mt-5 inline-block rounded-xl bg-coral/15 px-4 py-2.5 text-sm font-medium text-[#ff9aa3]">
                      {error}
                    </p>
                  )}

                  <div className="mt-8 flex items-center gap-4">
                    {step.kind !== "choice" && (
                      <button type="button" onClick={next} disabled={sending} className="btn btn-primary px-7 py-3.5 text-base">
                        {sending ? (
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                        ) : i === STEPS.length - 1 ? (
                          <>
                            {pilotQuiz.submit} <ArrowRight className="size-4" aria-hidden />
                          </>
                        ) : (
                          <>
                            {pilotQuiz.ok} <Check className="size-4" strokeWidth={3} aria-hidden />
                          </>
                        )}
                      </button>
                    )}
                    {step.kind !== "choice" && step.kind !== "long" && (
                      <span className="hidden text-sm text-white/40 sm:inline">{pilotQuiz.enterHint}</span>
                    )}
                  </div>

                  {i === STEPS.length - 1 && (
                    <p className="mt-6 text-xs text-white/45">
                      {pilotQuiz.privacy}{" "}
                      <a href={siteConfig.privacyPolicyUrl} className="underline hover:text-white">
                        Privacy policy
                      </a>
                    </p>
                  )}
                </div>
              )}

              {i >= STEPS.length && (
                <div className="text-center" role="status">
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="bg-signal mx-auto grid size-20 place-items-center rounded-full text-white shadow-[var(--shadow-glow)]"
                  >
                    <CheckCircle2 className="size-10" aria-hidden />
                  </motion.span>
                  <h1 className="mt-8 text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl">{pilotQuiz.successTitle}</h1>
                  <p className="mx-auto mt-4 max-w-md text-xl font-semibold text-white">{pilotQuiz.successLead}</p>
                  <p className="mx-auto mt-3 max-w-lg text-lg leading-relaxed text-white/70">{pilotQuiz.successBody}</p>
                  <Link href="/pilot" className="btn mt-10 border border-white/20 px-6 py-3 text-white hover:bg-white/10">
                    {pilotQuiz.backToPage}
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {step && i > 0 && (
        <button
          type="button"
          onClick={() => go(i - 1)}
          className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/80 backdrop-blur hover:bg-white/10"
        >
          <ArrowLeft className="size-4" aria-hidden /> {pilotQuiz.back}
        </button>
      )}
    </div>
  );
}
