import { NextResponse } from "next/server";
import { assessmentConfig } from "@/config";
import { AiError, structuredCall } from "@/lib/claude";
import { guard, jsonError, readJson } from "@/lib/http";
import { checkGlobalCap } from "@/lib/rateLimit";
import { mockEnabled, mockReport } from "@/lib/mock";
import { REPORT_SYSTEM, reportUserPrompt } from "@/lib/prompts";
import { ReportRequestSchema, ReportSchema, type Report } from "@/lib/schemas";
import { createDraft } from "@/lib/store";
import { annualFromBudget, coverageFromTasks, tierFromCoverage } from "@/lib/tiers";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Generates the report and saves it as a draft. Only the headline (coverage + tier) goes back
 * to the browser; the full report is released after the email step (/api/assessment/submit).
 */
export async function POST(req: Request) {
  const blocked = await guard(req, "report");
  if (blocked) return blocked;

  const cap = await checkGlobalCap("reports", assessmentConfig.dailyReportCap, 24 * 60 * 60 * 1000);
  if (!cap.ok) {
    console.warn("[report] daily site-wide cap reached");
    return jsonError("rate_limited", "We're at capacity for today. Please try again tomorrow.", 429);
  }

  const parsed = ReportRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError("bad_request", "Invalid request.", 400);
  const { answers, budget, ...ctx } = parsed.data;
  const annual = annualFromBudget(budget);

  let report: Report;
  try {
    report = mockEnabled()
      ? await mockReport(ctx.role_title)
      : await structuredCall({
          system: REPORT_SYSTEM,
          user: reportUserPrompt(ctx, answers, annual),
          schema: ReportSchema,
          maxTokens: 16000,
          effort: "medium",
        });
  } catch (err) {
    console.error("[report] generation failed", err);
    const retryable = err instanceof AiError ? err.retryable : true;
    return jsonError("ai_error", "We couldn't finish your report.", 502, retryable);
  }

  // Numbers the site owns: coverage is computed from the task table, the tier always matches the
  // gauge, and the cost input only comes from the user.
  normalizeShares(report.tasks);
  report.coverage_percent = Math.max(
    0,
    Math.min(100, coverageFromTasks(report.tasks) ?? Math.round(report.coverage_percent)),
  );
  report.verdict_tier = tierFromCoverage(report.coverage_percent);
  report.cost_comparison.human_annual_cost_input = annual;
  report.confidence = capConfidence(report.confidence, ctx.description, answers);

  try {
    const id = await createDraft({
      role_title: ctx.role_title,
      industry: ctx.industry,
      team_size: ctx.team_size,
      description: ctx.description,
      answers: { answers, budget },
      report,
      coverage_percent: report.coverage_percent,
    });
    return NextResponse.json({
      id,
      coverage_percent: report.coverage_percent,
      verdict_tier: report.verdict_tier,
      role_title: report.role_title,
      task_count: report.tasks.length,
    });
  } catch (err) {
    console.error("[report] save failed", err);
    return jsonError("server_error", "We couldn't save your report.", 500, true);
  }
}

/** Scale task shares to add up to 100 (give or take rounding); the model's estimates rarely do. */
function normalizeShares(tasks: Report["tasks"]) {
  const total = tasks.reduce((n, t) => n + t.share_percent, 0);
  if (total <= 0) return;
  for (const t of tasks) t.share_percent = Math.max(1, Math.round((t.share_percent / total) * 100));
}

/**
 * Confidence can't be higher than the detail the owner gave us. A short description with
 * mostly skipped answers is at best "medium", whatever the model says.
 */
function capConfidence(
  confidence: Report["confidence"],
  description: string,
  answers: { answer: string }[],
): Report["confidence"] {
  const words = description.split(/\s+/).filter(Boolean).length;
  const answered = answers.filter((a) => a.answer.trim()).length;
  const thin = (words < 60 ? 1 : 0) + (answered < 4 ? 1 : 0);
  if (thin === 2) return "low";
  if (thin === 1 && confidence === "high") return "medium";
  return confidence;
}
