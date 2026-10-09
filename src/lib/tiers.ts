import type { TaskStatus, VerdictTier } from "./schemas";

export const tierInfo: Record<VerdictTier, { label: string; blurb: string }> = {
  fully_unhireable: {
    label: "Fully Unhire-able",
    blurb: "An AI Employee can run nearly all of this role, with a person checking in on the edge cases.",
  },
  mostly_ai: {
    label: "Mostly AI",
    blurb: "An AI Employee can take over most of this role. A few responsibilities stay with your team.",
  },
  ai_assisted: {
    label: "AI-Assisted",
    blurb: "An AI Employee can take a big chunk of the workload off whoever does this job.",
  },
  keep_human_add_ai: {
    label: "Keep the Human, Add AI",
    blurb: "This role needs a person, but AI can handle the admin around it.",
  },
};

/**
 * What the report recommends doing about the hire, by tier. The cost section follows the same
 * split: the salary guarantee is shown only where the AI Employee can actually replace the hire.
 */
export const pathInfo: Record<VerdictTier, { label: string; guarantee: "full" | "hours" | "none" }> = {
  fully_unhireable: { label: "Skip the hire", guarantee: "full" },
  mostly_ai: { label: "Skip the full-time hire", guarantee: "full" },
  ai_assisted: { label: "Hire part-time and add an AI Employee", guarantee: "hours" },
  keep_human_add_ai: { label: "Hire the person. Add AI for the admin", guarantee: "none" },
};

/** Hours in the full-time week the report's hour figures are based on. */
export const WEEK_HOURS = 40;

/** Status weights for coverage: AI-only work counts fully, reviewed work counts 60%, human work 0. */
const STATUS_WEIGHT: Record<TaskStatus, number> = { ai_full: 1, ai_with_review: 0.6, human: 0 };

/**
 * Coverage computed from the task breakdown, so the headline number always matches the table.
 * Returns null when the tasks carry no time shares (reports saved before shares existed).
 */
export function coverageFromTasks(tasks: { status: TaskStatus; share_percent?: number }[]): number | null {
  const total = tasks.reduce((n, t) => n + (t.share_percent ?? 0), 0);
  if (total <= 0) return null;
  const covered = tasks.reduce((n, t) => n + (t.share_percent ?? 0) * STATUS_WEIGHT[t.status], 0);
  return Math.round((covered / total) * 100);
}

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
