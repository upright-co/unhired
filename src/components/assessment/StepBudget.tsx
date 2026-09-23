"use client";

import { ArrowRight } from "lucide-react";
import { formatMoney } from "@/config";
import { assessmentCopy } from "@/content/assessment";
import { HOURS_PER_YEAR } from "@/lib/tiers";
import { BackButton, StepHeading } from "./parts";

export type BudgetState = { amount: string; period: "annual" | "hourly" };

export function parseBudget(b: BudgetState): { amount: number; period: "annual" | "hourly" } | null {
  const n = Number(b.amount.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return { amount: n, period: b.period };
}

export function StepBudget({
  value,
  onChange,
  onNext,
  onSkip,
  onBack,
}: {
  value: BudgetState;
  onChange: (v: BudgetState) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  const c = assessmentCopy.questions.budget;
  const parsed = parseBudget(value);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (parsed) onNext();
      }}
    >
      <p className="label-mono mb-3 text-violet-deep">Last one</p>
      <StepHeading id="assessment-step-heading" title={c.prompt} sub={c.help} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg text-muted">$</span>
          <label htmlFor="a-budget" className="sr-only">
            Amount
          </label>
          <input
            id="a-budget"
            inputMode="decimal"
            className="field pl-9 text-lg"
            placeholder={value.period === "annual" ? "45,000" : "22"}
            value={value.amount}
            maxLength={12}
            onChange={(e) => onChange({ ...value, amount: e.target.value })}
          />
        </div>
        <div role="radiogroup" aria-label="Pay period" className="inline-flex rounded-full bg-ink/[0.05] p-1">
          {(["annual", "hourly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={value.period === p}
              onClick={() => onChange({ ...value, period: p })}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm font-semibold ${
                value.period === p ? "bg-white shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {p === "annual" ? c.annual : c.hourly}
            </button>
          ))}
        </div>
      </div>
      {parsed?.period === "hourly" && (
        <p className="mt-2 text-sm text-muted">
          ≈ {formatMoney(parsed.amount * HOURS_PER_YEAR)} per year at 40 hrs/week
        </p>
      )}

      <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
        <BackButton onClick={onBack} />
        <div className="flex gap-2">
          <button type="button" onClick={onSkip} className="btn btn-secondary px-5 py-3.5">
            {c.skip}
          </button>
          <button type="submit" disabled={!parsed} className="btn btn-primary px-7 py-3.5">
            Build my report <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );
}
