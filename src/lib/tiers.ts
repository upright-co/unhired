import type { TaskStatus, VerdictTier } from "./schemas";

export const tierInfo: Record<VerdictTier, { label: string; blurb: string }> = {
  fully_unhireable: {
    label: "Fully Unhire-able",
    blurb: "An AI hire can run nearly all of this role, with a person checking in on the edge cases.",
  },
  mostly_ai: {
    label: "Mostly AI",
    blurb: "An AI hire can take over most of this role. A few responsibilities stay with your team.",
  },
  ai_assisted: {
    label: "AI-Assisted",
    blurb: "An AI hire can take a big chunk of the workload off whoever does this job.",
  },
  keep_human_add_ai: {
    label: "Keep the Human, Add AI",
    blurb: "This role needs a person, but AI can handle the admin around it.",
  },
};

/** Tier thresholds: 80%+, 60–79%, 35–59%, <35%. Computed in code so it always matches the gauge. */
export function tierFromCoverage(pct: number): VerdictTier {
  if (pct >= 80) return "fully_unhireable";
  if (pct >= 60) return "mostly_ai";
  if (pct >= 35) return "ai_assisted";
  return "keep_human_add_ai";
}

export const statusInfo: Record<TaskStatus, { label: string; short: string }> = {
  ai_full: { label: "AI handles it fully", short: "AI" },
  ai_with_review: { label: "AI with human review", short: "AI + review" },
  human: { label: "Stays with a human", short: "Human" },
};

export const HOURS_PER_YEAR = 2080; // 40 hrs × 52 weeks

export function annualFromBudget(b: { amount: number; period: "annual" | "hourly" } | null) {
  if (!b) return null;
  return Math.round(b.period === "hourly" ? b.amount * HOURS_PER_YEAR : b.amount);
}
