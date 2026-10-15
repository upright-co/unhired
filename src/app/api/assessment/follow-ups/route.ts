import { NextResponse } from "next/server";
import { runFollowUps } from "@/lib/followUps";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily follow-up run, triggered by Vercel Cron (vercel.json). When CRON_SECRET is set,
 * Vercel sends it as a bearer token and anything else is refused. Without it the route
 * still can't over-send: it only sends what's due, and claims each step before sending.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const stats = await runFollowUps();
    return NextResponse.json({ ok: true, ...stats });
  } catch (err) {
    console.error("[follow-ups]", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
