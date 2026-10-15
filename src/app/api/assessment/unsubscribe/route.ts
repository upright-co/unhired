import { NextResponse } from "next/server";
import { emailConfigured, unsubscribeContact } from "@/lib/email";
import { validStopToken } from "@/lib/followUps";
import { getAssessment, stopFollowUps } from "@/lib/store";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST only, so link scanners that open every URL in an email can't unsubscribe anyone.
 * - Mail clients' one-click button posts here with ?id= (RFC 8058).
 * - The /unsubscribe/[id] page posts its form here.
 * - With a valid `stop` token (Brandon's alert link) it only ends the follow-ups.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const form = await req.formData().catch(() => null);
  const id = String(form?.get("id") ?? url.searchParams.get("id") ?? "");
  const stop = String(form?.get("stop") ?? url.searchParams.get("stop") ?? "");
  const fromPage = form?.get("page") === "1";
  if (!UUID_RE.test(id)) return NextResponse.json({ ok: false }, { status: 400 });

  const row = await getAssessment(id).catch(() => null);
  if (!row || !row.email) return NextResponse.json({ ok: false }, { status: 404 });

  const brandon = stop !== "" && validStopToken(id, stop);
  try {
    if (brandon) {
      await stopFollowUps(id, "stopped_by_brandon");
    } else {
      await stopFollowUps(id, "unsubscribed");
      if (emailConfigured()) await unsubscribeContact(row.email);
    }
  } catch (err) {
    console.error("[unsubscribe] failed", id, err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (!fromPage) return NextResponse.json({ ok: true });
  const done = new URL(`/unsubscribe/${id}`, req.url);
  done.searchParams.set("done", brandon ? "stopped" : "unsubscribed");
  return NextResponse.redirect(done, 303);
}
