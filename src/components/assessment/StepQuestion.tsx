"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { assessmentCopy } from "@/content/assessment";
import type { Question } from "@/lib/schemas";
import { BackButton, StepHeading } from "./parts";

export type AnswerValue = string | string[] | number | null;

export function isAnswered(q: Question, v: AnswerValue | undefined) {
  if (q.type === "short_text") return true; // optional
  if (q.type === "multi_select") return Array.isArray(v) && v.length > 0;
  return v !== null && v !== undefined && v !== "";
}

export function answerToText(q: Question, v: AnswerValue | undefined): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join(", ");
  if (q.type === "scale" && typeof v === "number") {
    const l = q.scale_labels;
    return l ? `${v}/5 (1 = ${l.min}, 5 = ${l.max})` : `${v}/5`;
  }
  return String(v).trim();
}

export function StepQuestion({
  question: q,
  index,
  total,
  value,
  onChange,
  onNext,
  onBack,
}: {
  question: Question;
  index: number;
  total: number;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const c = assessmentCopy.questions;
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answered = isAnswered(q, value);

  // Guard against auto-advance + a manual Next click both firing.
  const done = useRef(false);
  const go = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    if (done.current) return;
    done.current = true;
    onNext();
  };
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  return (
    <div>
      <p className="label-mono mb-3 text-violet-deep">
        Question {index + 1} of {total}
      </p>
      <StepHeading id="assessment-step-heading" title={q.prompt} sub={q.help ?? undefined} />

      {q.type === "single_select" && (
        <div role="radiogroup" aria-labelledby="assessment-step-heading" className="grid gap-2 sm:grid-cols-2">
          {q.options!.map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={value === o}
              className="chip flex min-h-[52px] items-center justify-between gap-3 rounded-2xl px-4 text-left"
              onClick={() => {
                onChange(o);
                // Auto-advance for a conversational feel
                if (advanceTimer.current) clearTimeout(advanceTimer.current);
                advanceTimer.current = setTimeout(go, 320);
              }}
            >
              <span>{o}</span>
              {value === o && <Check className="size-4 shrink-0" aria-hidden />}
            </button>
          ))}
        </div>
      )}

      {q.type === "multi_select" && (
        <>
          <p className="-mt-4 mb-4 text-sm text-muted">Pick all that apply.</p>
          <div role="group" aria-labelledby="assessment-step-heading" className="grid gap-2 sm:grid-cols-2">
            {q.options!.map((o) => {
              const arr = Array.isArray(value) ? value : [];
              const on = arr.includes(o);
              return (
                <button
                  key={o}
                  type="button"
                  aria-pressed={on}
                  className="chip flex min-h-[52px] items-center justify-between gap-3 rounded-2xl px-4 text-left"
                  onClick={() => onChange(on ? arr.filter((x) => x !== o) : [...arr, o])}
                >
                  <span>{o}</span>
                  {on && <Check className="size-4 shrink-0" aria-hidden />}
                </button>
              );
            })}
          </div>
        </>
      )}

      {q.type === "scale" && (
        <div>
          <div role="radiogroup" aria-labelledby="assessment-step-heading" className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={value === n}
                aria-label={`${n}${n === 1 ? ` — ${q.scale_labels?.min}` : n === 5 ? ` — ${q.scale_labels?.max}` : ""}`}
                className="chip h-14 rounded-2xl font-display text-xl"
                onClick={() => {
                  onChange(n);
                  if (advanceTimer.current) clearTimeout(advanceTimer.current);
                  advanceTimer.current = setTimeout(go, 360);
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted">
            <span>{q.scale_labels?.min}</span>
            <span className="text-right">{q.scale_labels?.max}</span>
          </div>
        </div>
      )}

      {q.type === "short_text" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go();
          }}
        >
          <label htmlFor={`q-${q.id}`} className="sr-only">
            {q.prompt}
          </label>
          <input
            id={`q-${q.id}`}
            className="field text-lg"
            value={typeof value === "string" ? value : ""}
            maxLength={500}
            placeholder="Type your answer (optional)"
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </form>
      )}

      <div className="mt-9 flex items-center justify-between">
        <BackButton onClick={onBack} label={c.back} />
        <button type="button" onClick={go} disabled={!answered} className="btn btn-primary px-7 py-3.5">
          {q.type === "short_text" && !value ? "Skip" : c.next} <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
