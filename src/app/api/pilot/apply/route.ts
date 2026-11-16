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
import { sendMetaLead, type LeadContext } from "@/lib/metaCapi";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Pilot application from /pilot: save it, then email Brandon and the applicant in the background. */
export async function POST(req: Request) {
  const blocked = await guard(req, "apply", { requireSession: false });
  if (blocked) return blocked;

  const body = await readJson(req);
  const parsed = PilotApplicationSchema.safeParse(body);
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

  const lead = leadContext(req, body, row);
  after(() => deliver(row));
  after(() => sendMetaLead(lead).catch((err) => console.error("[pilot] Meta CAPI failed", err)));
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

/** Browser details Meta uses to match the server Lead to the ad click (and to the pixel's Lead). */
function leadContext(req: Request, body: unknown, row: PilotRow): LeadContext {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const str = (x: unknown) => (typeof x === "string" && x.length > 0 && x.length <= 200 ? x : null);
  const cookies = Object.fromEntries(
    (req.headers.get("cookie") ?? "").split(";").map((c) => {
      const [k, ...rest] = c.trim().split("=");
      return [k, rest.join("=")];
    }),
  );
  return {
    eventId: str(b.event_id),
    email: row.email,
    phone: row.phone,
    firstName: row.first_name,
    lastName: row.last_name,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    userAgent: req.headers.get("user-agent"),
    fbp: str(cookies._fbp),
    fbc: str(cookies._fbc),
    sourceUrl: req.headers.get("referer"),
  };
}
