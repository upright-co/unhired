import { z } from "zod";
import { industries, teamSizes } from "@/content/assessment";

/* ------------------------------------------------------------------ */
/* Claude output schemas                                               */
/* ------------------------------------------------------------------ */

export const questionTypes = ["single_select", "multi_select", "scale", "short_text"] as const;

export const QuestionSchema = z.object({
  id: z.string().describe("Short snake_case id, unique within this set"),
  type: z.enum(questionTypes),
  prompt: z.string().describe("The question, written plainly, max ~20 words"),
  help: z.string().nullable().describe("Optional one-line hint shown under the question"),
  options: z
    .array(z.string())
    .nullable()
    .describe("3–7 short options for single_select / multi_select; null otherwise"),
  scale_labels: z
    .object({ min: z.string(), max: z.string() })
    .nullable()
    .describe("Labels for the 1 and 5 ends of a scale question; null otherwise"),
  dimension: z.enum([
    "channels",
    "volume",
    "systems",
    "judgment",
    "physical",
    "compliance",
    "after_hours",
    "performance",
    "other",
  ]),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionsOutputSchema = z.object({
  needs_more_info: z.boolean(),
  questions: z.array(QuestionSchema),
});
export type QuestionsOutput = z.infer<typeof QuestionsOutputSchema>;

export const verdictTiers = [
  "fully_unhireable",
  "mostly_ai",
  "ai_assisted",
  "keep_human_add_ai",
] as const;
export type VerdictTier = (typeof verdictTiers)[number];

export const taskStatuses = ["ai_full", "ai_with_review", "human"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export const ReportSchema = z.object({
  role_title: z.string(),
  coverage_percent: z.number().int().min(0).max(100),
  verdict_tier: z.enum(verdictTiers),
  summary: z.string(),
  tasks: z
    .array(
      z.object({
        task: z.string(),
        status: z.enum(taskStatuses),
        reason: z.string(),
        human_owner_suggestion: z.string().nullable(),
      }),
    )
    .min(1),
  day_in_the_life: z.string(),
  human_handoff_plan: z.string(),
  cost_comparison: z.object({
    human_annual_cost_input: z.number().nullable(),
    notes: z.string(),
  }),
  tools_needed: z.array(z.string()),
  risks: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
});
export type Report = z.infer<typeof ReportSchema>;

/* ------------------------------------------------------------------ */
/* Request bodies                                                      */
/* ------------------------------------------------------------------ */

const text = (max: number) => z.string().trim().max(max);

export const RoleContextSchema = z.object({
  role_title: text(120).min(2),
  industry: z.enum(industries),
  team_size: z.enum(teamSizes),
  description: text(15000).min(20),
});
export type RoleContext = z.infer<typeof RoleContextSchema>;

export const AnswerSchema = z.object({
  id: text(80),
  question: text(400),
  answer: text(1500),
});
export type Answer = z.infer<typeof AnswerSchema>;

export const BudgetSchema = z
  .object({
    amount: z.number().positive().max(10_000_000),
    period: z.enum(["annual", "hourly"]),
  })
  .nullable();
export type Budget = z.infer<typeof BudgetSchema>;

export const QuestionsRequestSchema = RoleContextSchema.extend({
  round: z.union([z.literal(1), z.literal(2)]),
  answers: z.array(AnswerSchema).max(12).default([]),
});

export const ReportRequestSchema = RoleContextSchema.extend({
  answers: z.array(AnswerSchema).max(12),
  budget: BudgetSchema,
});

export const SubmitRequestSchema = z.object({
  id: z.string().uuid(),
  first_name: text(80).min(1),
  email: z.string().trim().toLowerCase().email().max(200),
  business: text(160).min(1),
  phone: text(40).optional().default(""),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(""), // honeypot
  utm_source: text(200).nullable().optional(),
  utm_medium: text(200).nullable().optional(),
  utm_campaign: text(200).nullable().optional(),
});
export type SubmitRequest = z.infer<typeof SubmitRequestSchema>;

export const PowSolutionSchema = z.object({
  salt: z.string().max(64),
  exp: z.number().int(),
  difficulty: z.number().int().min(0).max(32),
  sig: z.string().max(128),
  nonce: z.number().int().min(0),
});

export const SessionRequestSchema = z.object({
  /** Proof-of-work solution (self-hosted bot protection). */
  pow: PowSolutionSchema.nullable().optional(),
  /** Optional: only used if Turnstile keys are configured. */
  turnstile_token: z.string().max(4096).nullable().optional(),
  website: z.string().max(200).optional().default(""), // honeypot
});
