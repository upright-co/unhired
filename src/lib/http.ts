import "server-only";
import { NextResponse } from "next/server";
import { assessmentConfig } from "@/config";
import { checkRateLimit } from "./rateLimit";
import { hasValidSession } from "./session";

export type ErrorCode =
  | "bad_request"
  | "rate_limited"
  | "session_required"
  | "not_found"
  | "ai_error"
  | "server_error";

export function jsonError(code: ErrorCode, message: string, status: number, retryable = false) {
  return NextResponse.json({ error: { code, message, retryable } }, { status });
}

/**
 * Shared guard for assessment endpoints: session cookie + per-IP rate limit.
 * Returns an error response, or null if the request may proceed.
 */
export async function guard(
  req: Request,
  bucket: keyof typeof assessmentConfig.rateLimits,
  { requireSession = true } = {},
): Promise<NextResponse | null> {
  if (requireSession && !(await hasValidSession())) {
    return jsonError("session_required", "Please restart the assessment.", 401, true);
  }
  const rl = await checkRateLimit(req, bucket, assessmentConfig.rateLimits[bucket]);
  if (!rl.ok) {
    const res = jsonError("rate_limited", "Too many requests. Please try again later.", 429);
    res.headers.set("Retry-After", String(rl.retryAfterSec));
    return res;
  }
  return null;
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
