import "server-only";
import { Resend } from "resend";
import { assessmentConfig, siteConfig } from "@/config";

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

export async function sendReportEmail(m: {
  toEmail: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
}) {
  const { error } = await getClient().emails.send({
    from: from(),
    to: [m.toEmail],
    subject: m.subject,
    html: m.html,
    text: m.text,
    replyTo: siteConfig.contactEmail.includes("@") ? siteConfig.contactEmail : undefined,
    headers: {
      // One-click unsubscribe target for the marketing consent given at the email gate.
      "List-Unsubscribe": `<mailto:${process.env.RESEND_FROM_EMAIL}?subject=unsubscribe>`,
    },
  });
  if (error) throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
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
