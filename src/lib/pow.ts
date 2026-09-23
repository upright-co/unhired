import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { assessmentConfig } from "@/config";

/**
 * Self-hosted proof-of-work challenge. No third-party account, no visitor friction
 * beyond a fraction of a second of CPU.
 *
 * The server hands out a signed, expiring salt. The browser finds a nonce where
 * sha256(`${salt}:${nonce}`) starts with `difficulty` zero bits, which costs real
 * CPU per attempt. Verifying is a single hash, so a flood of assessment requests
 * costs the attacker far more than it costs us.
 */

const TTL_SEC = 10 * 60;

function key(): Buffer {
  const s = process.env.SESSION_SECRET;
  if (s) return Buffer.from(s);
  const base = process.env.ANTHROPIC_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-only";
  return createHash("sha256").update(`unhired-pow:${base}`).digest();
}

function sign(payload: string) {
  return createHmac("sha256", key()).update(payload).digest("base64url");
}

export type Challenge = { salt: string; exp: number; difficulty: number; sig: string };

export function issueChallenge(): Challenge {
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC;
  const salt = randomBytes(16).toString("base64url");
  const difficulty = assessmentConfig.powDifficulty;
  return { salt, exp, difficulty, sig: sign(`${salt}.${exp}.${difficulty}`) };
}

/** Counts leading zero bits of the hash of `${salt}:${nonce}`. */
function leadingZeroBits(salt: string, nonce: number): number {
  const digest = createHash("sha256").update(`${salt}:${nonce}`).digest();
  let bits = 0;
  for (const byte of digest) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    bits += Math.clz32(byte) - 24;
    break;
  }
  return bits;
}

export function verifySolution(s: {
  salt: string;
  exp: number;
  difficulty: number;
  sig: string;
  nonce: number;
}): boolean {
  if (!Number.isInteger(s.nonce) || s.nonce < 0) return false;
  if (s.difficulty < assessmentConfig.powDifficulty) return false;
  if (!Number.isFinite(s.exp) || s.exp < Date.now() / 1000) return false;

  const expected = sign(`${s.salt}.${s.exp}.${s.difficulty}`);
  const a = Buffer.from(s.sig ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  return leadingZeroBits(s.salt, s.nonce) >= s.difficulty;
}
