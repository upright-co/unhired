import { after, NextResponse } from "next/server";
import { assessmentConfig, siteConfig } from "@/config";
import { emailConfigured, sendReportEmail, upsertContact } from "@/lib/email";
import { reportEmail } from "@/lib/emailTemplate";
import { guard, jsonError, readJson } from "@/lib/http";
import { SubmitRequestSchema } from "@/lib/schemas";
import { completeAssessment, getAssessment, markDelivery, type AssessmentRow } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Email gate: stores contact + CASL consent, releases the full report,
 * then emails the report link and syncs the contact to the list in the background.
 */
export async function POST(req: Request) {
  const blocked = await guard(req, "submit");
  if (blocked) return blocked;

  const parsed = SubmitRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return jsonError("bad_request", "Please check your details and confirm the consent box.", 400);
  }
  const body = parsed.data;
  if (body.website) return jsonError("bad_request", "Invalid request.", 400); // honeypot

  const existing = await getAssessment(body.id).catch(() => null);
  if (!existing) return jsonError("not_found", "We couldn't find that report. Please retake the assessment.", 404);

  // Idempotent: a double-submit returns the same report without re-sending email.
  if (existing.status === "completed") {
    return NextResponse.json(payload(existing));
  }

  let row: AssessmentRow;
  try {
    row = await completeAssessment(body.id, {
      email: body.email,
      first_name: body.first_name,
      business: body.business,
      phone: body.phone || null,
      consent_text: assessmentConfig.consentText,
      consent_at: new Date().toISOString(),
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
    });
  } catch (err) {
    console.error("[submit] save failed", err);
    return jsonError("server_error", "We couldn't save your details.", 500, true);
  }

  after(() => deliver(row));

  return NextResponse.json(payload(row));
}

function payload(row: AssessmentRow) {
  return { id: row.id, url: reportUrl(row.id), report: row.report };
}

function reportUrl(id: string) {
  return `${siteConfig.url.replace(/\/$/, "")}/report/${id}`;
}

async function deliver(row: AssessmentRow) {
  if (!emailConfigured()) {
    console.warn("[submit] Resend not configured: skipping email + list sync for", row.id);
    return;
  }
  const email = reportEmail({ firstName: row.first_name!, report: row.report, reportUrl: reportUrl(row.id) });
  const [sent, synced] = await Promise.allSettled([
    sendReportEmail({
      toEmail: row.email!,
      toName: row.first_name!,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
    upsertContact({
      email: row.email!,
      firstName: row.first_name!,
      business: row.business!,
      industry: row.industry,
      role: row.role_title,
      coverage: row.coverage_percent,
      teamSize: row.team_size,
    }),
  ]);
  const now = new Date().toISOString();
  if (sent.status === "rejected") console.error("[submit] email failed", sent.reason);
  if (synced.status === "rejected") console.error("[submit] contact sync failed", synced.reason);
  await markDelivery(row.id, {
    ...(sent.status === "fulfilled" ? { email_sent_at: now } : {}),
    ...(synced.status === "fulfilled" ? { list_synced_at: now } : {}),
  });
}
