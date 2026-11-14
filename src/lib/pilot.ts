import "server-only";
import { Resend } from "resend";
import { z } from "zod";
import { followUpConfig, pilotConfig } from "@/config";
import { pilotQuiz } from "@/content/pilot";
import { emailConfigured, sendLeadAlert } from "./email";
import { describeFirstTouch } from "./source";
import { getSupabase } from "./store";

/**
 * Edmonton pilot applications (/pilot): validation, fit score, storage and the two emails
 * (alert to Brandon, confirmation to the applicant).
 */

const o = pilotQuiz.options;
const short = (max = 200) => z.string().trim().min(1).max(max);
const optional = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || null);
const oneOf = (options: readonly string[]) => z.string().refine((v) => options.includes(v));

export const PilotApplicationSchema = z.object({
  business: short(),
  website: optional(),
  industry: short(),
  team_size: oneOf(o.teamSize),
  revenue: oneOf(o.revenue),
  area: oneOf(o.area),
  hiring: oneOf(o.hiring),
  role: short(),
  why_choose: short(4000),
  budget: oneOf(o.budget),
  time_drain: optional(2000),
  owner_present: oneOf(o.ownerPresent),
  first_name: short(80),
  last_name: short(80),
  title: optional(120),
  email: z.string().trim().toLowerCase().pipe(z.email()).pipe(z.string().max(200)),
  phone: z.string().trim().min(7).max(40),
  utm_source: z.string().max(200).nullish(),
  utm_medium: z.string().max(200).nullish(),
  utm_campaign: z.string().max(200).nullish(),
  referrer: z.string().max(200).nullish(),
  landing_path: z.string().max(200).nullish(),
  /** Honeypot: real people never see this field. */
  company_url: z.string().optional(),
});
export type PilotApplication = z.infer<typeof PilotApplicationSchema>;

export type PilotRow = Omit<PilotApplication, "company_url"> & { id: string; created_at: string; fit_score: number };

/**
 * 0 to 10, so Brandon can sort applications. Hiring now is the strongest signal: that open
 * role is what the pilot replaces. Revenue, team size and the 2027 budget show the business
 * can afford to keep it after the free month.
 */
export function fitScore(
  a: Pick<PilotApplication, "hiring" | "team_size" | "revenue" | "budget" | "owner_present" | "area">,
) {
  let score = 0;
  const [postedJob, planning] = o.hiring;
  if (a.hiring === postedJob) score += 2;
  else if (a.hiring === planning) score += 1;
  if (a.team_size !== o.teamSize[0]) score += 2; // 5 or more people
  const rev = o.revenue.indexOf(a.revenue); // 0 = under $250K ... 5 = $10M+
  if (rev >= 3) score += 2; // $1M+
  else if (rev === 2) score += 1; // $500K to $1M
  const budget = o.budget.indexOf(a.budget); // 0 = under $500 ... 4 = $5,000+, 5 = not sure
  if (budget === 3 || budget === 4) score += 2; // $2,500+
  else if (budget === 2) score += 1; // $1,000 to $2,500
  if (a.owner_present === o.ownerPresent[0]) score += 1;
  if (a.area !== o.area[o.area.length - 1]) score += 1;
  return score;
}

// Dev-only fallback when Supabase isn't configured.
const g = globalThis as unknown as { __unhiredPilot?: PilotRow[] };
const mem: PilotRow[] = (g.__unhiredPilot ??= []);

export async function savePilotApplication(a: PilotApplication): Promise<PilotRow> {
  const { company_url: _honeypot, ...fields } = a;
  const record = { ...fields, fit_score: fitScore(a) };
  const db = getSupabase();
  if (db) {
    const { data, error } = await db.from("pilot_applications").insert(record).select("*").single();
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return data as PilotRow;
  }
  console.warn("[pilot] Supabase env vars missing: keeping the application in memory.");
  const row: PilotRow = { ...record, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  mem.push(row);
  return row;
}

export async function markPilotDelivery(id: string, patch: { alerted_at?: string; confirmed_at?: string }) {
  const db = getSupabase();
  if (!db || Object.keys(patch).length === 0) return;
  const { error } = await db.from("pilot_applications").update(patch).eq("id", id);
  if (error) console.error("[pilot] delivery update failed", error.message);
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function answerLines(r: PilotRow): Array<[string, string]> {
  return [
    ["Business", r.business],
    ["What they do", r.industry],
    ["Team size", r.team_size],
    ["Annual revenue", r.revenue],
    ["Area", r.area],
    ["Hiring", r.hiring],
    ["Role / biggest job", r.role],
    ["Why pick them", r.why_choose],
    ["2027 monthly AI budget", r.budget],
    ["Owner at the visit", r.owner_present],
    ["Name", `${r.first_name} ${r.last_name}${r.title ? `, ${r.title}` : ""}`],
    ["Email", r.email],
    ["Phone", r.phone],
  ];
}

function table(lines: Array<[string, string]>) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 16px;">
${lines
  .map(([k, v]) => {
    const cell =
      k === "Phone"
        ? `<a href="tel:${esc(v.replace(/[^\d+]/g, ""))}">${esc(v)}</a>`
        : k === "Email"
          ? `<a href="mailto:${esc(v)}">${esc(v)}</a>`
          : esc(v);
    return `<tr><td style="padding:3px 16px 3px 0;color:#7A7590;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:3px 0;white-space:pre-wrap;">${cell}</td></tr>`;
  })
  .join("\n")}
</table>`;
}

const wrap = (inner: string) =>
  `<!doctype html><html><body style="margin:0;padding:20px 16px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#0E0B1F;"><div style="max-width:560px;">${inner}</div></body></html>`;

/** Alert to Brandon with the fit score up front. Reply-To is the applicant. */
export async function alertPilotApplication(r: PilotRow) {
  const source = describeFirstTouch({
    utm_source: r.utm_source ?? null,
    utm_medium: r.utm_medium ?? null,
    utm_campaign: r.utm_campaign ?? null,
    referrer: r.referrer ?? null,
    landing_path: r.landing_path ?? null,
  });
  const lines = [...answerLines(r), ["Came from", source] as [string, string]];
  const subject = `Pilot application (fit ${r.fit_score}/10): ${r.business}, ${r.role}`;
  const text = [
    `${r.first_name} ${r.last_name} at ${r.business} applied for a pilot spot. Fit score ${r.fit_score}/10.`,
    "",
    ...lines.map(([k, v]) => `${k}: ${v}`),
    "",
    "Hit Reply to write to them directly.",
  ].join("\n");
  const html = wrap(
    `<p style="margin:0 0 14px;"><strong>${esc(r.first_name)} ${esc(r.last_name)} at ${esc(r.business)}</strong> applied for a pilot spot.</p>
<p style="margin:0 0 16px;"><span style="display:inline-block;background:#9452F2;color:#fff;font-weight:700;padding:6px 14px;border-radius:999px;">Fit ${r.fit_score}/10</span></p>
${table(lines)}
<p style="margin:0;">Hit Reply to write to them directly.</p>`,
  );
  await sendLeadAlert({ subject, html, text, replyTo: r.email });
}

/** Receipt to the applicant from Brandon, with a copy of their answers. Transactional: no marketing. */
/** Brandon's Gmail signature (brand/email-signature/brandon.html), so API sends match his own emails. */
const SIGNATURE_HTML = `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#0e0b1f;">
<tr>
<td valign="middle" style="padding:0 18px 0 0;"><img src="https://unhired.io/email/brandon-headshot.png" width="92" height="92" alt="Brandon Upright" style="display:block;width:92px;height:92px;border:0;"></td>
<td valign="middle" style="padding:0 0 0 18px;border-left:2px solid #9452f2;">
<div style="font-size:17px;line-height:22px;font-weight:bold;color:#0e0b1f;margin:0;">Brandon Upright</div>
<div style="font-size:13px;line-height:18px;color:#4a4560;margin:0 0 10px;">Founder, Unhired</div>
<div style="font-size:13px;line-height:20px;margin:0;"><a href="mailto:brandon@getunhired.com" style="color:#0e0b1f;text-decoration:none;">brandon@getunhired.com</a></div>
<div style="font-size:13px;line-height:20px;margin:0 0 12px;"><a href="https://unhired.io" style="color:#9452f2;text-decoration:none;font-weight:bold;">unhired.io</a><span style="color:#c9c4d8;">&nbsp;|&nbsp;</span><a href="https://www.linkedin.com/in/brandon-upright/" style="color:#9452f2;text-decoration:none;font-weight:bold;">LinkedIn</a></div>
<a href="https://unhired.io" style="text-decoration:none;"><img src="https://unhired.io/email/unhired-logo.png" width="96" height="24" alt="Unhired" style="display:block;width:96px;height:auto;border:0;"></a>
</td>
</tr>
</table>`;
const SIGNATURE_TEXT = "Brandon Upright\nFounder, Unhired\nbrandon@getunhired.com\nunhired.io";

/**
 * The introduction PDF attached to every confirmation (source: brand/proposals/pilot-overview).
 * Read from disk when the file is bundled; otherwise Resend fetches it from the live site.
 */
async function introAttachment() {
  const { filename, path: publicPath } = pilotConfig.attachment;
  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const content = await readFile(join(process.cwd(), "public", publicPath));
    return { filename, content };
  } catch {
    return { filename, path: `https://unhired.io/${publicPath}` };
  }
}

/** Receipt to the applicant from Brandon's own address, with his signature and the intro PDF. Transactional. */
export async function confirmPilotApplication(r: PilotRow) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const subject = `Got your pilot application, ${r.first_name}`;
  const body1 = `Thanks for applying! My team and I will review your application within the next 48 hours. If ${r.business} is a fit, the next step will be to schedule a follow up call so we can answer any of your questions and arrange a time for me to come to your business.`;
  const body2 = "In the meantime, I've attached a short introduction to Unhired: who we are, some of the AI Employees we've built for clients, and why an AI Employee is there to support your team, not replace it.";
  const body3 = "Here's what you sent, in case you want to check it:";
  const lines = answerLines(r).filter(([k]) => k !== "Email" && k !== "Phone");
  const footer = `Unhired · ${followUpConfig.mailingAddress.replace(/^Unhired,\s*/, "")}`;
  const text = [
    `Hi ${r.first_name},`,
    "",
    body1,
    "",
    body2,
    "",
    body3,
    "",
    ...lines.map(([k, v]) => `${k}: ${v}`),
    "",
    "If anything changes, just reply to this email.",
    "",
    SIGNATURE_TEXT,
    "",
    footer,
  ].join("\n");
  const html = wrap(
    `<p style="margin:0 0 14px;">Hi ${esc(r.first_name)},</p>
<p style="margin:0 0 14px;">${esc(body1)}</p>
<p style="margin:0 0 14px;">${esc(body2)}</p>
<p style="margin:0 0 10px;">${esc(body3)}</p>
${table(lines)}
<p style="margin:0 0 22px;">If anything changes, just reply to this email.</p>
${SIGNATURE_HTML}
<p style="margin:22px 0 0;color:#9A96AC;font-size:11px;">${esc(footer)}</p>`,
  );
  const { error } = await new Resend(key).emails.send({
    from: `${pilotConfig.sender.name} <${pilotConfig.sender.email}>`,
    to: [r.email],
    subject,
    html,
    text,
    replyTo: pilotConfig.sender.email,
    attachments: [await introAttachment()],
    tags: [{ name: "kind", value: "pilot_confirmation" }],
  });
  if (error) throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
}

export { emailConfigured };
