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
    const questions = sanitize(out.questions, answers.map((a) => a.id)).slice(0, max);
    const needsMore = round === 1 ? true : out.needs_more_info && questions.length > 0;

    return NextResponse.json({ needs_more_info: needsMore, questions: needsMore ? questions : [] });
  } catch (err) {
    console.error("[questions] failed", err);
    const retryable = err instanceof AiError ? err.retryable : true;
    return jsonError("ai_error", "We couldn't prepare your questions.", 502, retryable);
  }
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
