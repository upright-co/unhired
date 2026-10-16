import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { followUpConfig, siteConfig } from "@/config";
import { contactUnsubscribed, emailConfigured, sendFollowUpEmail, sendLeadAlert } from "./email";
import { renderFollowUp } from "./followUpEmails";
import { describeFirstTouch } from "./source";
import { claimFollowUp, followUpCandidates, releaseFollowUp, stopFollowUps, type AssessmentRow } from "./store";
import { tierInfo } from "./tiers";

const DAY_MS = 86_400_000;

function site() {
  return siteConfig.url.replace(/\/$/, "");
}

export function reportUrl(id: string) {
  return `${site()}/report/${id}`;
}

/** The report id is already an unguessable secret (it opens the report), so it's enough to unsubscribe. */
export function unsubscribeUrl(id: string) {
  return `${site()}/unsubscribe/${id}`;
}

/* ------------------------------------------------------------------ */
/* Brandon's "stop the follow-ups" link: signed, so a lead can't use it */
/* ------------------------------------------------------------------ */

function secret(): Buffer {
  const s = process.env.SESSION_SECRET;
  if (s) return Buffer.from(s);
  const base = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.ANTHROPIC_API_KEY || "dev-only";
  return createHash("sha256").update(`unhired-follow-ups:${base}`).digest();
}

export function stopToken(id: string) {
  return createHmac("sha256", secret()).update(`stop-follow-ups:${id}`).digest("base64url").slice(0, 32);
}

export function validStopToken(id: string, token: string) {
  const want = Buffer.from(stopToken(id));
  const got = Buffer.from(token);
  return want.length === got.length && timingSafeEqual(want, got);
}

export function stopUrl(id: string) {
  return `${unsubscribeUrl(id)}?stop=${stopToken(id)}`;
}

/* ------------------------------------------------------------------ */
/* New-lead alert                                                      */
/* ------------------------------------------------------------------ */

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function scheduleLine(consentAt: string) {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-CA", { timeZone: "America/Edmonton", weekday: "short", month: "short", day: "numeric" });
  const start = new Date(consentAt).getTime();
  return followUpConfig.days.map((d) => fmt(new Date(start + d * DAY_MS))).join(", ");
}

/** Emails Brandon the moment someone gets their report. Throws on failure; the caller logs it. */
export async function alertNewLead(row: AssessmentRow) {
  const r = row.report;
  const source = describeFirstTouch(row);
  const salary = r.cost_comparison?.human_annual_cost_input;
  const lines: Array<[string, string]> = [
    ["Name", row.first_name ?? ""],
    ["Business", row.business ?? ""],
    ["Email", row.email ?? ""],
    ["Phone", row.phone || "not given"],
    ["Role", r.role_title],
    ["Industry", row.industry ?? ""],
    ["Team size", row.team_size ?? ""],
    ["Result", `~${r.coverage_percent}% AI coverage, ${tierInfo[r.verdict_tier].label}`],
    ...(salary ? [["Salary they entered", `$${Math.round(salary).toLocaleString("en-US")} a year`] as [string, string]] : []),
    ["Came from", source],
  ];

  const subject = `New assessment: ${row.first_name} at ${row.business}, ${r.role_title} (${r.coverage_percent}%)`;
  const report = reportUrl(row.id);
  const stop = stopUrl(row.id);
  const schedule = scheduleLine(row.consent_at ?? row.created_at);

  const text = [
    `${row.first_name} at ${row.business} just got their report.`,
    "",
    ...lines.map(([k, v]) => `${k}: ${v}`),
    "",
    `Report: ${report}`,
    "",
    `Hit Reply to write to them directly.`,
    `Follow-ups from you go out ${schedule}. If you start talking to them, stop the rest: ${stop}`,
  ].join("\n");

  const tel = row.phone ? `<a href="tel:${esc(row.phone.replace(/[^\d+]/g, ""))}">${esc(row.phone)}</a>` : "not given";
  const html = `<!doctype html><html><body style="margin:0;padding:20px 16px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#0E0B1F;">
<div style="max-width:560px;">
<p style="margin:0 0 14px;"><strong>${esc(row.first_name ?? "")} at ${esc(row.business ?? "")}</strong> just got their report.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 16px;">
${lines
  .map(
    ([k, v]) =>
      `<tr><td style="padding:3px 16px 3px 0;color:#7A7590;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:3px 0;">${
        k === "Phone" ? tel : k === "Email" ? `<a href="mailto:${esc(v)}">${esc(v)}</a>` : esc(v)
      }</td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:0 0 16px;"><a href="${esc(report)}" style="display:inline-block;background:#9452F2;color:#ffffff;text-decoration:none;font-weight:700;padding:10px 18px;border-radius:999px;">Open their report</a></p>
<p style="margin:0 0 8px;">Hit Reply to write to them directly.</p>
<p style="margin:0;color:#4A4560;font-size:14px;">Follow-ups from you go out ${esc(schedule)}. If you start talking to them, <a href="${esc(stop)}">stop the rest</a>.</p>
</div></body></html>`;

  await sendLeadAlert({ subject, html, text, replyTo: row.email! });
}

/* ------------------------------------------------------------------ */
/* Daily follow-up run                                                 */
/* ------------------------------------------------------------------ */

export type FollowUpRunStats = {
  candidates: number;
  sent: number;
  notDue: number;
  unsubscribed: number;
  superseded: number;
  failed: number;
  sends: Array<{ id: string; step: number }>;
};

/**
 * Sends every follow-up that's due, at most one per lead per run. Safe to call
 * more than once a day: a step is claimed before it's sent, and the next step
 * is never due on the same day as the last one.
 */
export async function runFollowUps(now = new Date()): Promise<FollowUpRunStats> {
  const stats: FollowUpRunStats = { candidates: 0, sent: 0, notDue: 0, unsubscribed: 0, superseded: 0, failed: 0, sends: [] };
  if (!emailConfigured()) throw new Error("Resend is not configured");

  const days = followUpConfig.days;
  const rows = await followUpCandidates({ since: followUpConfig.startAfter, maxStep: days.length, limit: 500 });
  stats.candidates = rows.length;

  // Someone who ran the assessment twice only hears about the newest report.
  const newest = new Map<string, AssessmentRow>();
  for (const row of rows) {
    const key = row.email!.toLowerCase();
    const seen = newest.get(key);
    if (!seen || row.consent_at! > seen.consent_at!) newest.set(key, row);
  }

  for (const row of rows) {
    if (stats.sent >= followUpConfig.maxPerRun) break;
    if (newest.get(row.email!.toLowerCase()) !== row) {
      await stopFollowUps(row.id, "superseded").catch((err) => console.error("[follow-ups] supersede failed", row.id, err));
      stats.superseded++;
      continue;
    }

    const step = row.follow_up_step ?? 0;
    const dueAt = new Date(row.consent_at!).getTime() + days[step] * DAY_MS;
    const lastAt = row.follow_up_sent_at ? new Date(row.follow_up_sent_at).getTime() : 0;
    // Due, and never two in a row: catching up after downtime still spaces them a day apart.
    if (dueAt > now.getTime() || now.getTime() - lastAt < 0.9 * DAY_MS) {
      stats.notDue++;
      continue;
    }

    try {
      if (await contactUnsubscribed(row.email!)) {
        await stopFollowUps(row.id, "unsubscribed");
        stats.unsubscribed++;
        continue;
      }
      if (!(await claimFollowUp(row.id, step))) continue; // another run sent it
      const email = renderFollowUp(
        step,
        { firstName: row.first_name!, business: row.business!, report: row.report, reportUrl: reportUrl(row.id) },
        unsubscribeUrl(row.id),
      );
      try {
        await sendFollowUpEmail({ toEmail: row.email!, ...email, unsubscribeUrl: unsubscribeUrl(row.id), step });
      } catch (err) {
        await releaseFollowUp(row.id, step, row.follow_up_sent_at ?? null);
        throw err;
      }
      stats.sent++;
      stats.sends.push({ id: row.id, step: step + 1 });
    } catch (err) {
      stats.failed++;
      console.error("[follow-ups] failed for", row.id, err);
    }
  }

  return stats;
}
