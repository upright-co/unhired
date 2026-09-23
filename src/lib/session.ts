import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Bot protection: the visitor passes Cloudflare Turnstile once when starting the assessment,
 * and gets a short-lived signed cookie. Every AI endpoint requires that cookie.
 */

export const SESSION_COOKIE = "uh_as";
const TTL_SEC = 2 * 60 * 60;

function secret(): Buffer {
  const s = process.env.SESSION_SECRET;
  if (s) return Buffer.from(s);
  // Fallback: derive a key from another server secret so dev works without extra config.
  const base = process.env.ANTHROPIC_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-only";
  return createHash("sha256").update(`unhired-session:${base}`).digest();
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function issueSession() {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const payload = `${exp}.${randomBytes(9).toString("base64url")}`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/assessment",
    maxAge: TTL_SEC,
  });
}

export async function hasValidSession(): Promise<boolean> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return false;
  const i = raw.lastIndexOf(".");
  if (i < 0) return false;
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const exp = Number(payload.split(".")[0]);
  return Number.isFinite(exp) && exp > Date.now() / 1000;
}

export function turnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string | null | undefined, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY not set: bot protection is OFF.");
    }
    return true;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: secretKey, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch (err) {
    console.error("[turnstile] verify failed", err);
    return false;
  }
}
