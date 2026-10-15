import "server-only";
import { followUpConfig, formatMoney, guarantee } from "@/config";
import type { StoredReport } from "./schemas";
import { pathInfo } from "./tiers";

/**
 * The four follow-ups Brandon sends after the report, written in his voice.
 * Rules: content/WRITING.md (no em dashes, no AI sentence shapes), "AI Employee"
 * capitalised, never a build price. These are sales emails to people who opted in,
 * so the "inform, don't sell" article rules don't apply; the style rules do.
 */

export type FollowUpInput = {
  firstName: string;
  business: string;
  report: StoredReport;
  reportUrl: string;
};

type Draft = { subject: string; paragraphs: string[] };

/** Lowercase the first letter so a task reads naturally mid-sentence ("Answer the phone" -> "answer the phone"). */
function lower(s: string) {
  const t = s.trim().replace(/\.$/, "");
  return /^[A-Z][a-z]/.test(t) ? t[0].toLowerCase() + t.slice(1) : t;
}

function biggest(tasks: StoredReport["tasks"], keep: (s: StoredReport["tasks"][number]["status"]) => boolean) {
  return [...tasks].filter((t) => keep(t.status)).sort((a, b) => (b.share_percent ?? 0) - (a.share_percent ?? 0))[0];
}

function first({ firstName, business, report: r }: FollowUpInput): Draft {
  const top = biggest(r.tasks, (s) => s !== "human");
  const kept = biggest(r.tasks, (s) => s === "human");
  return {
    subject: `Your ${r.role_title} report`,
    paragraphs: [
      `Hi ${firstName},`,
      `I'm Brandon, I run Unhired. I'm following up on the report you ran for the ${r.role_title} role at ${business}. It puts about ${r.coverage_percent}% of the job within reach of an AI Employee${top ? `, and the biggest piece of that is to ${lower(top.task)}` : ""}.`,
      ...(kept
        ? [`It also kept one part with a person: ${lower(kept.task)}. I agree with that call, and it's what I'd want to talk through before anything gets built.`]
        : []),
      `If you're still planning to hire for this role, I'm happy to go through the report with you on a 30-minute call and tell you straight whether I'd build it. You can pick a time here: ${followUpConfig.bookingUrl}`,
      `Or reply to this email. It comes to me.`,
      `Brandon`,
    ],
  };
}

function second({ firstName, business, report: r }: FollowUpInput): Draft {
  const mode = pathInfo[r.verdict_tier].guarantee;
  const salary = r.cost_comparison?.human_annual_cost_input ?? null;
  const pct = guarantee.salarySavingsPercent;

  if (mode === "full") {
    const example = salary
      ? `You told the assessment the role would cost about ${formatMoney(salary)} a year, so the most an AI Employee could cost ${business} is ${formatMoney(salary * (1 - pct / 100))} a year.`
      : `Take whatever salary you'd post for the role, cut it in half, and that's the most the AI Employee can cost.`;
    return {
      subject: `What an AI Employee for the ${r.role_title} role costs`,
      paragraphs: [
        `Hi ${firstName},`,
        `After the report, most people want to know what it would cost.`,
        `There's no build fee. You pay monthly, like a salary, and we guarantee the AI Employee costs at least ${pct}% less than what you'd pay a person in the role. ${example}`,
        `That price covers the whole job. We build it, train it on how ${business} does things, and maintain it after it goes live. When a tool you use changes or customers start asking something new, keeping it working is our problem.`,
        salary
          ? `If you want the actual monthly number for ${business}, reply and I'll work it out for you.`
          : `If you want the actual monthly number for ${business}, reply with the salary you had in mind and I'll work it out.`,
        `Brandon`,
      ],
    };
  }

  return {
    subject: `What the ${r.role_title} role would look like with an AI Employee`,
    paragraphs: [
      `Hi ${firstName},`,
      `Your report found that the ${r.role_title} role still needs a person for part of the week, so I wouldn't tell you to skip the hire.`,
      mode === "hours"
        ? `What I'd look at is a smaller hire. A part-time person covers the parts that need judgment or a face, and an AI Employee covers the rest, including evenings and weekends. You pay a monthly fee for the AI Employee and there's no build fee.`
        : `What I'd look at is taking the admin off whoever you hire, so they spend their time on the parts only a person can do. You pay a monthly fee for the AI Employee and there's no build fee.`,
      `We build it, train it on how ${business} works, and maintain it after it goes live. The price depends on how much of the week it covers, so I'd want 30 minutes with you before quoting anything: ${followUpConfig.bookingUrl}`,
      `Or reply here with how many hours a week you were planning to hire for, and I'll tell you how I'd split it.`,
      `Brandon`,
    ],
  };
}

function third({ firstName, report: r }: FollowUpInput): Draft {
  const steps = (r.getting_started ?? []).slice(0, 4);
  return {
    subject: `The first month with an AI Employee`,
    paragraphs: [
      `Hi ${firstName},`,
      `An AI Employee doesn't get full authority on day one. For the first few weeks, anything that leaves the business, like a booking confirmation or a reply to a customer, waits for someone on your team to approve it. We read every correction and retrain it. Once it gets those right, it handles them on its own and only flags the exceptions.`,
      ...(steps.length
        ? [
            `For the ${r.role_title} role, your report listed what it would need to get started:`,
            steps.map((s) => `- ${s.trim()}`).join("\n"),
            `Most of that is access to tools you already use, plus an hour or two with whoever does the job now so we can learn how they handle the odd cases.`,
          ]
        : [
            `Getting started is mostly access to tools you already use, plus an hour or two with whoever does the job now so we can learn how they handle the odd cases.`,
          ]),
      `If you'd like to get it going, reply and I'll send the short list of what we need from you.`,
      `Brandon`,
    ],
  };
}

function fourth({ firstName, report: r, reportUrl }: FollowUpInput): Draft {
  return {
    subject: `Should I close the file on the ${r.role_title} role?`,
    paragraphs: [
      `Hi ${firstName},`,
      `I haven't heard back, so I'll take it the timing isn't right and stop following up about your ${r.role_title} report.`,
      `If you post the job later or want a second opinion on it, reply to this email and it'll come straight to me. Your report stays here: ${reportUrl}`,
      `Brandon`,
    ],
  };
}

/** Index 0 is the first follow-up. */
export const followUpDrafts = [first, second, third, fourth];

/* ------------------------------------------------------------------ */
/* Rendering: a plain, personal email, not a newsletter                */
/* ------------------------------------------------------------------ */

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function linkify(escaped: string) {
  return escaped.replace(/https?:\/\/[^\s<]+[^\s<.,)]/g, (url) => `<a href="${url}" style="color:#6D2FD0;">${url}</a>`);
}

export function renderFollowUp(step: number, input: FollowUpInput, unsubscribeUrl: string) {
  const draft = followUpDrafts[step](input);
  const footer = `You're getting this because you asked for your AI Employee report at unhired.io and agreed to hear from us. ${followUpConfig.mailingAddress}.`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px 16px;background:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#0E0B1F;">
<div style="max-width:560px;">
${draft.paragraphs
  .map((p) =>
    p.startsWith("- ")
      ? `<ul style="margin:0 0 14px;padding-left:20px;">${p
          .split("\n")
          .map((li) => `<li>${linkify(esc(li.replace(/^- /, "")))}</li>`)
          .join("")}</ul>`
      : `<p style="margin:0 0 14px;">${linkify(esc(p))}</p>`,
  )
  .join("\n")}
<p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#7A7590;">${esc(footer)} <a href="${esc(unsubscribeUrl)}" style="color:#7A7590;">Unsubscribe</a></p>
</div>
</body></html>`;

  const text = `${draft.paragraphs.join("\n\n")}\n\n--\n${footer}\nUnsubscribe: ${unsubscribeUrl}\n`;
  return { subject: draft.subject, html, text };
}
