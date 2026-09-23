"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { assessmentConfig, siteConfig } from "@/config";
import { assessmentCopy } from "@/content/assessment";
import { CoverageGauge } from "@/components/ui/CoverageGauge";
import { tierInfo } from "@/lib/tiers";
import type { DraftResult } from "./api";
import { FieldLabel, Honeypot } from "./parts";

export type ContactState = {
  firstName: string;
  email: string;
  business: string;
  phone: string;
  consent: boolean;
  honeypot: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function StepGate({
  draft,
  value,
  onChange,
  onSubmit,
  busy,
  error,
}: {
  draft: DraftResult;
  value: ContactState;
  onChange: (v: ContactState) => void;
  onSubmit: () => void;
  busy: boolean;
  error: string | null;
}) {
  const c = assessmentCopy.teaser;
  const valid =
    value.firstName.trim() && EMAIL_RE.test(value.email.trim()) && value.business.trim() && value.consent;
  const set = (k: keyof ContactState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: k === "consent" ? e.target.checked : e.target.value });

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
      <div className="text-center">
        <CoverageGauge value={draft.coverage_percent} size={250} label="of this role" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold shadow-sm">
            <span className="text-signal">{tierInfo[draft.verdict_tier].label}</span>
          </p>
          <p className="mt-3 text-sm text-muted">
            {draft.role_title} · {draft.task_count} tasks analyzed
          </p>
        </motion.div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid && !busy) onSubmit();
        }}
        className="relative"
        noValidate
      >
        <h3
          id="assessment-step-heading"
          tabIndex={-1}
          className="text-2xl font-semibold tracking-[-0.03em] outline-none sm:text-[2rem]"
        >
          {c.ready}
        </h3>
        <p className="mt-1 mb-6 text-muted">{c.sub}</p>
        <Honeypot value={value.honeypot} onChange={(v) => onChange({ ...value, honeypot: v })} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="g-first">{c.firstName}</FieldLabel>
            <input id="g-first" className="field" autoComplete="given-name" required value={value.firstName} onChange={set("firstName")} maxLength={80} />
          </div>
          <div>
            <FieldLabel htmlFor="g-business">{c.business}</FieldLabel>
            <input id="g-business" className="field" autoComplete="organization" required value={value.business} onChange={set("business")} maxLength={160} />
          </div>
          <div>
            <FieldLabel htmlFor="g-email">{c.email}</FieldLabel>
            <input id="g-email" type="email" className="field" autoComplete="email" required value={value.email} onChange={set("email")} maxLength={200} />
          </div>
          <div>
            <FieldLabel htmlFor="g-phone">{c.phone}</FieldLabel>
            <input id="g-phone" type="tel" className="field" autoComplete="tel" value={value.phone} onChange={set("phone")} maxLength={40} />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[#9452F2]"
            checked={value.consent}
            onChange={set("consent")}
            required
          />
          <span>
            {assessmentConfig.consentText}{" "}
            <a href={siteConfig.privacyPolicyUrl} className="font-medium text-violet-deep underline" target="_blank" rel="noreferrer">
              Privacy policy
            </a>
          </span>
        </label>

        {error && (
          <p className="mt-4 text-sm font-medium text-coral-deep" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={!valid || busy} className="btn btn-primary mt-6 w-full px-7 py-4 text-base">
          {busy ? "Sending…" : c.submit} <ArrowRight className="size-4" aria-hidden />
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Lock className="size-3" aria-hidden /> {c.privacy}
        </p>
      </form>
    </div>
  );
}
