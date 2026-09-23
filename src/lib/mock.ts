import "server-only";
import type { QuestionsOutput, Report } from "./schemas";

/**
 * Dev-only canned AI responses so the whole flow can be clicked through without an API key.
 * Enabled with ASSESSMENT_MOCK=1, and never in production.
 */
export function mockEnabled() {
  return process.env.ASSESSMENT_MOCK === "1" && process.env.NODE_ENV !== "production";
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockQuestions(round: 1 | 2): Promise<QuestionsOutput> {
  await wait(1500);
  if (round === 2) {
    return {
      needs_more_info: true,
      questions: [
        {
          id: "estimate_visits",
          type: "single_select",
          prompt: "Does this person ever go on site, e.g. for estimates or walk-throughs?",
          help: null,
          options: ["Never", "Occasionally", "Weekly", "Most days"],
          scale_labels: null,
          dimension: "physical",
        },
      ],
    };
  }
  return {
    needs_more_info: false,
    questions: [
      {
        id: "channels",
        type: "multi_select",
        prompt: "How do customers reach you today?",
        help: "Pick every channel this person would handle.",
        options: ["Phone calls", "Text messages", "Email", "Website form", "Walk-ins", "Facebook / Instagram"],
        scale_labels: null,
        dimension: "channels",
      },
      {
        id: "call_volume",
        type: "single_select",
        prompt: "Roughly how many calls and messages come in on a busy day?",
        help: null,
        options: ["Under 10", "10–30", "30–75", "75+"],
        scale_labels: null,
        dimension: "volume",
      },
      {
        id: "systems",
        type: "multi_select",
        prompt: "Which tools would they use?",
        help: null,
        options: ["ServiceTitan", "Jobber", "Housecall Pro", "Google Calendar", "QuickBooks", "Spreadsheets"],
        scale_labels: null,
        dimension: "systems",
      },
      {
        id: "judgment",
        type: "scale",
        prompt: "How often do they make judgment calls without checking with you?",
        help: null,
        options: null,
        scale_labels: { min: "Almost never", max: "All day" },
        dimension: "judgment",
      },
      {
        id: "after_hours",
        type: "single_select",
        prompt: "What happens to calls after 5 pm today?",
        help: null,
        options: ["Voicemail", "Owner's cell", "Answering service", "They're missed"],
        scale_labels: null,
        dimension: "after_hours",
      },
      {
        id: "good_performance",
        type: "short_text",
        prompt: "What does a great month look like for this role?",
        help: null,
        options: null,
        scale_labels: null,
        dimension: "performance",
      },
    ],
  };
}

export async function mockReport(role: string): Promise<Report> {
  await wait(3000);
  return {
    role_title: role,
    coverage_percent: 74,
    verdict_tier: "mostly_ai",
    summary:
      "An AI hire can take over most of this role: answering every call and text, booking jobs and keeping customers updated. The judgment calls and in-person moments stay with your office manager.",
    tasks: [
      { task: "Answer inbound calls and texts", status: "ai_full", reason: "Scripted intake with clear questions; works at any volume, day or night.", human_owner_suggestion: null },
      { task: "Qualify leads and capture job details", status: "ai_full", reason: "Follows your intake checklist every time and logs it straight to the CRM.", human_owner_suggestion: null },
      { task: "Book and reschedule appointments", status: "ai_full", reason: "Reads live calendar availability and applies your booking rules.", human_owner_suggestion: null },
      { task: "Send confirmations and reminders", status: "ai_full", reason: "Fully automatable by text and email.", human_owner_suggestion: null },
      { task: "Follow up on open estimates", status: "ai_with_review", reason: "AI drafts and sends follow-ups; pricing questions go to a person.", human_owner_suggestion: "Office manager" },
      { task: "Handle billing questions", status: "ai_with_review", reason: "AI answers balance questions; disputes and refunds need approval.", human_owner_suggestion: "Owner" },
      { task: "Calm down upset customers", status: "human", reason: "Relationship-critical and sometimes needs a goodwill decision.", human_owner_suggestion: "Office manager" },
      { task: "Greet walk-in customers", status: "human", reason: "In-person work.", human_owner_suggestion: "Whoever is in the office" },
    ],
    day_in_the_life:
      "At 6:40 am your AI receptionist picks up a no-heat call, captures the address and system details, and books the first open slot at 8:00. By 9, it has confirmed the day's six appointments by text and moved one reschedule without anyone lifting a finger.\n\nThrough the day it answers every call on the first ring, qualifies new leads, and chases three estimates from last week. When a customer disputes an invoice, it summarizes the issue and hands it to your office manager.\n\nAt 9:15 pm, a homeowner fills out your web form. The AI replies within a minute and books them for Thursday morning.",
    human_handoff_plan:
      "Your office manager owns anything involving money decisions, upset customers and walk-ins. The AI hire flags these in a shared inbox with a summary and suggested reply, so nothing starts from scratch. The owner steps in only for refunds above your set limit. Your team no longer answers routine calls, books jobs or sends reminders.",
    cost_comparison: { human_annual_cost_input: null, notes: "Compare against the full cost of the role, and remember the AI hire covers most, not all, of the work." },
    tools_needed: ["Business phone line with call forwarding", "Google Calendar", "Jobber", "SMS number"],
    risks: [
      "Complex pricing questions still need a person.",
      "Your booking rules must be written down clearly before launch.",
      "Some callers prefer a human; offer an easy transfer.",
    ],
    confidence: "medium",
  };
}
