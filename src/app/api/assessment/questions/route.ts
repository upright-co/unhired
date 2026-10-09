import { NextResponse } from "next/server";
import { AiError, structuredCall } from "@/lib/claude";
import { guard, jsonError, readJson } from "@/lib/http";
import { mockEnabled, mockQuestions } from "@/lib/mock";
import { QUESTIONS_SYSTEM, questionsUserPrompt } from "@/lib/prompts";
import { QuestionsOutputSchema, QuestionsRequestSchema, type Question } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Returns 4–6 adaptive follow-up questions (round 1), or up to 3 clarifying questions (round 2). */
export async function POST(req: Request) {
  const blocked = await guard(req, "questions");
  if (blocked) return blocked;

  const parsed = QuestionsRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("bad_request", "Invalid request.", 400);
  const { round, answers, ...ctx } = parsed.data;

  try {
    const out = mockEnabled()
      ? await mockQuestions(round)
      : await structuredCall({
          system: QUESTIONS_SYSTEM,
          user: questionsUserPrompt(ctx, round, answers),
          schema: QuestionsOutputSchema,
          maxTokens: 8000,
          effort: "low",
        });

    const max = round === 1 ? 6 : 3;
    const asked = answers.map((a) => a.question);
    const questions = sanitize(out.questions, answers.map((a) => a.id))
      .filter((q) => !asked.some((prev) => similar(prev, q.prompt)))
      .slice(0, max);
    const needsMore = round === 1 ? true : out.needs_more_info && questions.length > 0;

    return NextResponse.json({ needs_more_info: needsMore, questions: needsMore ? questions : [] });
  } catch (err) {
    console.error("[questions] failed", err);
    const retryable = err instanceof AiError ? err.retryable : true;
    return jsonError("ai_error", "We couldn't prepare your questions.", 502, retryable);
  }
}

const STOP = new Set(
  "a an and are as at be do does for how in is it of on or that the this to what when which who with you your".split(" "),
);

function words(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

/**
 * True when two questions ask the same thing in different words. The model is told not to
 * repeat itself in round 2, but a skipped question sometimes comes back rephrased.
 */
function similar(a: string, b: string): boolean {
  const wa = words(a);
  const wb = words(b);
  if (!wa.size || !wb.size) return false;
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  return shared / Math.min(wa.size, wb.size) >= 0.6;
}

/** Drop malformed questions and make ids unique so the UI never renders a broken step. */
function sanitize(qs: Question[], usedIds: string[]): Question[] {
  const seen = new Set(usedIds);
  const out: Question[] = [];
  for (const q of qs) {
    const isSelect = q.type === "single_select" || q.type === "multi_select";
    const options = isSelect ? (q.options ?? []).map((o) => o.trim()).filter(Boolean).slice(0, 8) : null;
    if (isSelect && (!options || options.length < 2)) continue;
    if (!q.prompt.trim()) continue;
    let id = q.id.replace(/[^a-z0-9_]/gi, "_").toLowerCase() || "q";
    while (seen.has(id)) id = `${id}_2`;
    seen.add(id);
    out.push({
      ...q,
      id,
      options,
      scale_labels: q.type === "scale" ? (q.scale_labels ?? { min: "Not at all", max: "Constantly" }) : null,
    });
  }
  return out;
}
