import { after, NextResponse } from "next/server";
import { guard, jsonError, readJson } from "@/lib/http";
import {
  alertPilotApplication,
  confirmPilotApplication,
  emailConfigured,
  markPilotDelivery,
  PilotApplicationSchema,
  savePilotApplication,
  type PilotRow,
} from "@/lib/pilot";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Pilot application from /pilot: save it, then email Brandon and the applicant in the background. */
export async function POST(req: Request) {
  const blocked = await guard(req, "apply", { requireSession: false });
  if (blocked) return blocked;

  const parsed = PilotApplicationSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return jsonError("bad_request", "Please check the highlighted fields.", 400);
  }
  // Honeypot: pretend it worked so bots don't retry.
  if (parsed.data.company_url) return NextResponse.json({ ok: true });

  let row: PilotRow;
  try {
    row = await savePilotApplication(parsed.data);
  } catch (err) {
    console.error("[pilot] save failed", err);
    return jsonError("server_error", "We couldn't save your application.", 500, true);
  }

  after(() => deliver(row));
  return NextResponse.json({ ok: true });
}

async function deliver(row: PilotRow) {
  if (!emailConfigured()) {
    console.warn("[pilot] Resend not configured: skipping emails for", row.id);
    return;
  }
  const [alerted, confirmed] = await Promise.allSettled([alertPilotApplication(row), confirmPilotApplication(row)]);
  if (alerted.status === "rejected") console.error("[pilot] alert failed", alerted.reason);
  if (confirmed.status === "rejected") console.error("[pilot] confirmation failed", confirmed.reason);
  const now = new Date().toISOString();
  await markPilotDelivery(row.id, {
    ...(alerted.status === "fulfilled" ? { alerted_at: now } : {}),
    ...(confirmed.status === "fulfilled" ? { confirmed_at: now } : {}),
  });
}
