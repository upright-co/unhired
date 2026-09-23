import "server-only";
import { createHash } from "crypto";
import { getSupabase } from "./store";

/**
 * Sliding one-hour rate limit per IP + endpoint.
 * Backed by Supabase (works across serverless instances); falls back to in-memory in dev.
 * IPs are hashed before storage.
 */

const WINDOW_MS = 60 * 60 * 1000;
const g = globalThis as unknown as { __unhiredRl?: Map<string, number[]> };
const mem: Map<string, number[]> = (g.__unhiredRl ??= new Map());

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function hashKey(ip: string, bucket: string) {
  const salt = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "unhired";
  return `${bucket}:${createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)}`;
}

export async function checkRateLimit(
  req: Request,
  bucket: string,
  limit: number,
  windowMs: number = WINDOW_MS,
): Promise<{ ok: boolean; retryAfterSec: number }> {
  const key = hashKey(clientIp(req), bucket);
  return countAndInsert(key, limit, windowMs);
}

/**
 * Site-wide cap, not per IP: a hard ceiling on how many reports can be generated
 * per day so a bad actor (or a viral day) can't run up an unbounded AI bill.
 */
export async function checkGlobalCap(
  bucket: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfterSec: number }> {
  return countAndInsert(`global:${bucket}`, limit, windowMs);
}

async function countAndInsert(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfterSec: number }> {
  const since = new Date(Date.now() - windowMs).toISOString();
  const db = getSupabase();

  if (db) {
    try {
      const { count, error } = await db
        .from("rate_limit_hits")
        .select("id", { count: "exact", head: true })
        .eq("key", key)
        .gte("created_at", since);
      if (error) throw error;
      if ((count ?? 0) >= limit) return { ok: false, retryAfterSec: Math.min(15 * 60, windowMs / 1000) };
      await db.from("rate_limit_hits").insert({ key });
      // Opportunistic cleanup of old rows (~1% of requests)
      if (Math.random() < 0.01) {
        await db
          .from("rate_limit_hits")
          .delete()
          .lt("created_at", new Date(Date.now() - 7 * 24 * WINDOW_MS).toISOString());
      }
      return { ok: true, retryAfterSec: 0 };
    } catch (err) {
      // Fail open on rate-limit storage errors; Turnstile + session still protect the endpoint.
      console.error("[rateLimit] storage error, allowing request", err);
      return { ok: true, retryAfterSec: 0 };
    }
  }

  const now = Date.now();
  const hits = (mem.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    mem.set(key, hits);
    return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  mem.set(key, hits);
  return { ok: true, retryAfterSec: 0 };
}
