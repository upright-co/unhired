import "server-only";
import { Resend } from "resend";
import { assessmentConfig, followUpConfig, siteConfig } from "@/config";

/**
 * Email + list provider: Resend.
 *
 * - Report delivery: transactional send (Free plan: 3,000/mo, 100/day)
 * - List building: contacts with custom properties (Free plan: 1,000 contacts,
 *   unlimited broadcast sending) — the weekly newsletter goes out as a Broadcast.
 *   Run scripts/setup-resend.mjs once to create the properties, segment and topic.
 *
 * Everything the provider stores is also in Supabase, so switching providers
 * only means rewriting this file.
 */

let client: Resend | null = null;
function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  if (!client) client = new Resend(key);
  return client;
}

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

function from() {
  const address = process.env.RESEND_FROM_EMAIL;
  if (!address) throw new Error("RESEND_FROM_EMAIL is not set");
  const name = process.env.RESEND_FROM_NAME || "Unhired";
  return `${name} <${address}>`;
}

/** One-click unsubscribe headers (RFC 8058), so Gmail and Outlook show their own unsubscribe button. */
function unsubscribeHeaders(unsubscribeUrl: string) {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${siteConfig.contactEmail}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

export async function sendReportEmail(m: {
  toEmail: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
}) {
  const { error } = await getClient().emails.send({
    from: from(),
    to: [m.toEmail],
    subject: m.subject,
    html: m.html,
    text: m.text,
    replyTo: siteConfig.contactEmail.includes("@") ? siteConfig.contactEmail : undefined,
    // One-click unsubscribe target for the marketing consent given at the email gate.
    headers: unsubscribeHeaders(m.unsubscribeUrl),
  });
  if (error) throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
}

/** A follow-up from Brandon. Sent from contactEmail (forwards to him), so a reply lands in his inbox. */
export async function sendFollowUpEmail(m: {
  toEmail: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
  step: number;
}) {
  const { error } = await getClient().emails.send({
    from: `${followUpConfig.senderName} <${siteConfig.contactEmail}>`,
    to: [m.toEmail],
    subject: m.subject,
    html: m.html,
    text: m.text,
    replyTo: siteConfig.contactEmail,
    headers: unsubscribeHeaders(m.unsubscribeUrl),
    tags: [
      { name: "kind", value: "assessment_follow_up" },
      { name: "step", value: String(m.step + 1) },
    ],
  });
  if (error) throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
}

/** Internal alert to Brandon. Reply-To is the lead, so hitting Reply writes to them. */
export async function sendLeadAlert(m: { subject: string; html: string; text: string; replyTo: string }) {
  const { error } = await getClient().emails.send({
    from: from(),
    to: [followUpConfig.alertTo],
    subject: m.subject,
    html: m.html,
    text: m.text,
    replyTo: m.replyTo,
    tags: [{ name: "kind", value: "lead_alert" }],
  });
  if (error) throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
}

/**
 * True if the address unsubscribed through Resend (a newsletter footer link, for example).
 * A missing contact counts as subscribed: the assessment row holds the consent.
 */
export async function contactUnsubscribed(email: string): Promise<boolean> {
  const { data, error } = await getClient().contacts.get({ email });
  if (error) {
    if (error.name === "not_found") return false;
    throw new Error(`Resend contact lookup failed: ${error.name}: ${error.message}`);
  }
  return Boolean(data?.unsubscribed);
}

/** Unsubscribes the address from everything Unhired sends through Resend. */
export async function unsubscribeContact(email: string) {
  const { error } = await getClient().contacts.update({ email, unsubscribed: true });
  if (error && error.name !== "not_found") {
    throw new Error(`Resend unsubscribe failed: ${error.name}: ${error.message}`);
  }
}

/**
 * Adds the lead to the contact list with the assessment data as custom properties,
 * so the list can be segmented by coverage score, industry or role later.
 * Property values must be strings.
 */
export async function upsertContact(c: {
  email: string;
  firstName: string;
  business: string;
  industry: string;
  role: string;
  coverage: number;
  teamSize: string;
}) {
  // Property types are declared in Resend (see scripts/setup-resend.mjs):
  // ai_coverage_score is a number, the rest are strings.
  const properties: Record<string, string | number> = {
    business: c.business,
    industry: c.industry,
    role: c.role,
    ai_coverage_score: c.coverage,
    team_size: c.teamSize,
    source: assessmentConfig.marketing.tag,
  };

  const segmentId = process.env.RESEND_SEGMENT_ID;
  const topicId = process.env.RESEND_TOPIC_ID;

  const { error } = await getClient().contacts.create({
    email: c.email,
    firstName: c.firstName,
    unsubscribed: false,
    properties,
    ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    // They ticked the consent box at the email gate, so opt them into the newsletter topic.
    ...(topicId ? { topics: [{ id: topicId, subscription: "opt_in" as const }] } : {}),
  });

  if (!error) return;

  // Already on the list: update their details instead of failing.
  const { error: updateError } = await getClient().contacts.update({
    email: c.email,
    firstName: c.firstName,
    properties,
  });
  if (updateError) {
    throw new Error(
      `Resend contact failed: create=${error.name}: ${error.message}; update=${updateError.name}: ${updateError.message}`,
    );
  }
}
