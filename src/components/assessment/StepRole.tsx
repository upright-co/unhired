"use client";

import { ArrowRight } from "lucide-react";
import { assessmentCopy, industries, teamSizes } from "@/content/assessment";
import { FieldLabel, Honeypot, StepHeading } from "./parts";

export type RoleState = { role: string; industry: string; teamSize: string };

export function StepRole({
  value,
  onChange,
  onNext,
  busy,
  honeypot,
  setHoneypot,
}: {
  value: RoleState;
  onChange: (v: RoleState) => void;
  onNext: () => void;
  busy: boolean;
  honeypot: string;
  setHoneypot: (v: string) => void;
}) {
  const c = assessmentCopy.role;
  const valid = value.role.trim().length >= 2 && value.industry && value.teamSize;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && !busy) onNext();
      }}
      className="relative"
    >
      <StepHeading id="assessment-step-heading" title={c.heading} sub={c.sub} />
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <div className="space-y-6">
        <div>
          <FieldLabel htmlFor="a-role">{c.roleLabel}</FieldLabel>
          <input
            id="a-role"
            className="field text-lg"
            placeholder={c.rolePlaceholder}
            value={value.role}
            maxLength={120}
            autoComplete="organization-title"
            onChange={(e) => onChange({ ...value, role: e.target.value })}
            required
          />
        </div>

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold">{c.industryLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <button
                key={i}
                type="button"
                className="chip"
                aria-pressed={value.industry === i}
                onClick={() => onChange({ ...value, industry: i })}
              >
                {i}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 block text-sm font-semibold">{c.teamSizeLabel}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {teamSizes.map((t) => (
              <button
                key={t}
                type="button"
                className="chip"
                aria-pressed={value.teamSize === t}
                onClick={() => onChange({ ...value, teamSize: t })}
              >
                {t}
                <span className="sr-only"> people</span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-9 flex justify-end">
        <button type="submit" disabled={!valid || busy} className="btn btn-primary px-7 py-3.5">
          {busy ? "Starting…" : c.next} <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
