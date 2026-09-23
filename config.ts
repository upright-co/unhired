/**
 * Site-wide settings: prices, links and limits.
 * Edit this file (and the files in /content) to change the site without touching components.
 */

export const siteConfig = {
  name: "Unhired",
  tagline: "AI employees for growing businesses.",
  description:
    "Before you post the job, see if AI can do it. Unhired builds AI employees that answer, book, follow up and handle the admin — trained on how your business runs.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: "hello@unhired.io",
  privacyPolicyUrl: "/privacy",
};

export const pricing = {
  /**
   * Minimum price to build an AI employee. Quoted as a starting price with no
   * time period ("from $1,295"), since scope drives the real number.
   * Set to null to show the "[PRICE]" placeholder everywhere instead.
   */
  aiHireStartingAt: 1295 as number | null,
  currency: "USD",
  placeholder: "[PRICE]",
};

/**
 * Price is quoted as a starting price with no time period attached, e.g. "$1,295".
 * If you ever introduce a recurring fee, add it here and to the comparison row.
 */
export function formatAiHirePrice(): string {
  if (pricing.aiHireStartingAt == null) return pricing.placeholder;
  return formatMoney(pricing.aiHireStartingAt);
}

/** Long form for prose, e.g. "from $1,295". */
export function formatAiHirePriceLong(): string {
  if (pricing.aiHireStartingAt == null) return pricing.placeholder;
  return `from ${formatMoney(pricing.aiHireStartingAt)}`;
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export const links = {
  /** Primary CTA at the end of every report. Set to null to hide the button. */
  bookCall: null as string | null,
  /** Secondary CTA at the end of every report. Set to null to hide the button. */
  challenge: null as string | null,
};

export const assessmentConfig = {
  /** Minimum words required in the "Describe the job" tab. */
  minDescriptionWords: 50,
  /** Upload limits. */
  maxUploadBytes: 5 * 1024 * 1024,
  acceptedUploadExtensions: [".pdf", ".docx", ".txt"],
  /** Extracted job-description text is capped at this many characters. */
  maxDescriptionChars: 15000,
  /**
   * Proof-of-work difficulty in leading zero bits. Every visitor solves one challenge
   * before starting, solved in a background worker while they fill in step 1 — so it
   * costs the visitor nothing. ~18 is roughly half a second of CPU per attempt.
   * Raise it if you ever see scripted abuse, lower it if slow phones struggle.
   */
  powDifficulty: 18,
  /**
   * Hard ceiling on report generations per day across the whole site, so a bad day
   * can't run up an unbounded Anthropic bill. Raise it as real traffic grows.
   */
  dailyReportCap: 200,
  /** Requests per IP per hour, per endpoint. One assessment uses up to 2 question calls. */
  rateLimits: {
    // Sessions are cheap and several people can share one office/household IP.
    session: 40,
    extract: 10,
    questions: 20,
    report: 10,
    submit: 10,
  },
  /** Anthropic model used for all assessment calls. */
  model: "claude-sonnet-5",
  /** Exact consent wording stored with every submission (CASL express consent). */
  consentText:
    "Email me my report and occasional tips from Unhired. Unsubscribe anytime.",
  marketing: {
    /** Stored on each Resend contact as the `source` property. */
    tag: "assessment_completed",
  },
};
