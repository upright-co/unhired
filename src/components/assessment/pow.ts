"use client";

/**
 * Solves the server's proof-of-work challenge in a Web Worker, so the UI never
 * freezes. Falls back to solving on the main thread if Workers are unavailable.
 */

export type Challenge = { salt: string; exp: number; difficulty: number; sig: string };
export type Solution = Challenge & { nonce: number };

const WORKER_SRC = `
self.onmessage = async (e) => {
  const { salt, difficulty } = e.data;
  const enc = new TextEncoder();
  const zeroBytes = difficulty >> 3;
  const restBits = difficulty & 7;
  const mask = restBits ? (0xff << (8 - restBits)) & 0xff : 0;
  for (let nonce = 0; nonce < 50000000; nonce++) {
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(salt + ":" + nonce));
    const view = new Uint8Array(buf);
    let ok = true;
    for (let i = 0; i < zeroBytes; i++) { if (view[i] !== 0) { ok = false; break; } }
    if (ok && mask && (view[zeroBytes] & mask) !== 0) ok = false;
    if (ok) { self.postMessage({ nonce }); return; }
  }
  self.postMessage({ error: "no solution" });
};
`;

export async function solve(challenge: Challenge, timeoutMs = 20000): Promise<Solution | null> {
  try {
    const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: "application/javascript" }));
    const worker = new Worker(url);
    const nonce = await new Promise<number | null>((resolve) => {
      const timer = setTimeout(() => resolve(null), timeoutMs);
      worker.onmessage = (e: MessageEvent<{ nonce?: number; error?: string }>) => {
        clearTimeout(timer);
        resolve(typeof e.data.nonce === "number" ? e.data.nonce : null);
      };
      worker.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };
      worker.postMessage({ salt: challenge.salt, difficulty: challenge.difficulty });
    });
    worker.terminate();
    URL.revokeObjectURL(url);
    return nonce === null ? null : { ...challenge, nonce };
  } catch {
    return solveOnMainThread(challenge, timeoutMs);
  }
}

async function solveOnMainThread(challenge: Challenge, timeoutMs: number): Promise<Solution | null> {
  const enc = new TextEncoder();
  const zeroBytes = challenge.difficulty >> 3;
  const restBits = challenge.difficulty & 7;
  const mask = restBits ? (0xff << (8 - restBits)) & 0xff : 0;
  const deadline = Date.now() + timeoutMs;
  for (let nonce = 0; nonce < 50_000_000; nonce++) {
    if ((nonce & 1023) === 0 && Date.now() > deadline) return null;
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(`${challenge.salt}:${nonce}`));
    const view = new Uint8Array(buf);
    let ok = true;
    for (let i = 0; i < zeroBytes; i++) {
      if (view[i] !== 0) {
        ok = false;
        break;
      }
    }
    if (ok && mask && (view[zeroBytes] & mask) !== 0) ok = false;
    if (ok) return { ...challenge, nonce };
  }
  return null;
}

export async function fetchChallenge(): Promise<Challenge | null> {
  try {
    const res = await fetch("/api/assessment/challenge", { credentials: "same-origin" });
    if (!res.ok) return null;
    return (await res.json()) as Challenge;
  } catch {
    return null;
  }
}

/** Fetch + solve. Returns null if anything fails; the server decides what to do about that. */
export async function getProofOfWork(): Promise<Solution | null> {
  const challenge = await fetchChallenge();
  if (!challenge) return null;
  return solve(challenge);
}
