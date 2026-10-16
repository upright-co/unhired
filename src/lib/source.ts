/**
 * Turns a lead's first-touch data into one channel name for reports and alerts.
 * A UTM tag wins; otherwise the referring site decides. The portal has a copy of
 * this file (unhired-portal/src/lib/source.ts); keep the two in step.
 */

export type FirstTouch = {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  referrer?: string | null;
  landing_path?: string | null;
};

const UTM_NAMES: Record<string, string> = {
  linkedin: "LinkedIn",
  linkedin_page: "LinkedIn (company page)",
  medium: "Medium",
  substack: "Substack",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  google: "Google",
  email: "Email",
};

const REFERRERS: Array<[RegExp, string]> = [
  [/(^|\.)google\.[a-z.]+$/, "Google search"],
  [/(^|\.)(bing\.com|duckduckgo\.com|search\.yahoo\.com|ecosia\.org|search\.brave\.com)$/, "Other search"],
  [/(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/, "AI assistants"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "LinkedIn"],
  [/(^|\.)medium\.com$/, "Medium"],
  [/(^|\.)substack\.com$/, "Substack"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, "X"],
  [/(^|\.)reddit\.com$/, "Reddit"],
];

/** "LinkedIn", "Google search", "Direct or unknown", ... */
export function channelOf(t: FirstTouch): string {
  const utm = t.utm_source?.trim().toLowerCase();
  if (utm) return UTM_NAMES[utm] ?? utm;
  const host = t.referrer?.trim().toLowerCase();
  if (host) {
    // Gemini lives on a google.com subdomain, so check AI assistants before Google search.
    const ai = REFERRERS.find(([re, name]) => name === "AI assistants" && re.test(host));
    if (ai) return ai[1];
    return REFERRERS.find(([re]) => re.test(host))?.[1] ?? host.replace(/^www\./, "");
  }
  return "Direct or unknown";
}

/** One line for an alert: "LinkedIn, landed on /blog/ai-receptionist (campaign ai-receptionist)". */
export function describeFirstTouch(t: FirstTouch): string {
  const parts = [channelOf(t)];
  if (t.utm_medium) parts[0] += ` / ${t.utm_medium}`;
  if (t.landing_path && t.landing_path !== "/") parts.push(`landed on ${t.landing_path}`);
  if (t.utm_campaign) parts.push(`campaign ${t.utm_campaign}`);
  return parts.join(", ");
}
