import { NextResponse } from "next/server";
import { guard, jsonError, readJson } from "@/lib/http";
import { clientIp } from "@/lib/rateLimit";
import { SessionRequestSchema } from "@/lib/schemas";
import { issueSession, turnstileEnabled, verifyTurnstile } from "@/lib/session";
import { verifySolution } from "@/lib/pow";

export const runtime = "nodejs";

/** Starts an assessment session: honeypot + Turnstile check, then a signed cookie. */
export async function POST(req: Request) {
  const limited = await guard(req, "session", { requireSession: false });
  if (limited) return limited;

  const parsed = SessionRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("bad_request", "Invalid request.", 400);

  // Honeypot: real visitors never see or fill this field.
  if (parsed.data.website) return jsonError("bad_request", "Invalid request.", 400);

  // Turnstile if it's configured, otherwise the self-hosted proof-of-work challenge.
  if (turnstileEnabled()) {
    const ok = await verifyTurnstile(parsed.data.turnstile_token, clientIp(req));
    if (!ok) return jsonError("bad_request", "Verification failed. Please try again.", 400, true);
  } else {
    const pow = parsed.data.pow;
    if (!pow || !verifySolution(pow)) {
      return jsonError("bad_request", "Verification failed. Please try again.", 400, true);
    }
  }

  await issueSession();
  return NextResponse.json({ ok: true });
}
