"use client";

import type { Question, Report, VerdictTier } from "@/lib/schemas";
import { getProofOfWork, type Solution } from "./pow";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean,
    public readonly status: number,
  ) {
    super(message);
  }
}

type SessionProvider = () => Promise<string | null>;
let getTurnstileToken: SessionProvider = async () => null;
let sessionReady = false;

/** Assessment registers how to get a fresh Turnstile token (null when Turnstile is disabled). */
export function setTokenProvider(fn: SessionProvider) {
  getTurnstileToken = fn;
}

let powPromise: Promise<Solution | null> | null = null;

/**
 * Starts solving the proof-of-work challenge early (on mount), so it is already
 * done by the time the visitor finishes step 1 and never costs them a wait.
 */
export function primeProofOfWork() {
  if (!powPromise) powPromise = getProofOfWork();
}

export async function startSession(honeypot: string) {
  // Turnstile token if the widget is configured, otherwise the proof-of-work challenge.
  const token = await getTurnstileToken();
  const send = async (pow: Solution | null) =>
    raw("/api/assessment/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ turnstile_token: token, pow, website: honeypot }),
    });

  if (token) {
    await send(null);
    sessionReady = true;
    return;
  }

  primeProofOfWork();
  try {
    await send(await powPromise);
  } catch (err) {
    // A challenge expires after 10 minutes; solve a fresh one and retry once.
    if (err instanceof ApiError && err.status === 400) {
      powPromise = getProofOfWork();
      await send(await powPromise);
    } else {
      throw err;
    }
  }
  sessionReady = true;
}

async function raw<T>(url: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, credentials: "same-origin" });
  } catch {
    throw new ApiError("Network error. Check your connection and try again.", "network", true, 0);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const e = data?.error;
    throw new ApiError(
      e?.message || "Something went wrong.",
      e?.code || "server_error",
      e?.retryable ?? res.status >= 500,
      res.status,
    );
  }
  return data as T;
}

/** Calls an assessment endpoint; if the session expired, starts a new one and retries once. */
async function call<T>(url: string, init: RequestInit): Promise<T> {
  if (!sessionReady) await startSession("");
  try {
    return await raw<T>(url, init);
  } catch (err) {
    if (err instanceof ApiError && err.code === "session_required") {
      await startSession("");
      return raw<T>(url, init);
    }
    throw err;
  }
}

const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export type RoleContextBody = {
  role_title: string;
  industry: string;
  team_size: string;
  description: string;
};
export type AnswerBody = { id: string; question: string; answer: string };

export function fetchQuestions(ctx: RoleContextBody, round: 1 | 2, answers: AnswerBody[]) {
  return call<{ needs_more_info: boolean; questions: Question[] }>(
    "/api/assessment/questions",
    json({ ...ctx, round, answers }),
  );
}

export type DraftResult = {
  id: string;
  coverage_percent: number;
  verdict_tier: VerdictTier;
  role_title: string;
  task_count: number;
};

export function generateReport(
  ctx: RoleContextBody,
  answers: AnswerBody[],
  budget: { amount: number; period: "annual" | "hourly" } | null,
) {
  return call<DraftResult>("/api/assessment/report", json({ ...ctx, answers, budget }));
}

export type SubmitResult = { id: string; url: string; report: Report };

export function submitContact(body: Record<string, unknown>) {
  return call<SubmitResult>("/api/assessment/submit", json(body));
}

export function extractFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  return call<{ text: string; truncated: boolean; words: number; filename: string }>(
    "/api/assessment/extract",
    { method: "POST", body: form },
  );
}
