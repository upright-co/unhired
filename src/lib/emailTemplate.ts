import "server-only";
import { links, siteConfig } from "@/config";
import type { Report } from "./schemas";
import { statusInfo, tierInfo } from "./tiers";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Report email: inline styles only (email clients ignore <style> and web fonts). */
export function reportEmail(opts: { firstName: string; report: Report; reportUrl: string }) {
  const { firstName, report: r, reportUrl } = opts;
  const tier = tierInfo[r.verdict_tier];
  const counts = {
    ai_full: r.tasks.filter((t) => t.status === "ai_full").length,
    ai_with_review: r.tasks.filter((t) => t.status === "ai_with_review").length,
    human: r.tasks.filter((t) => t.status === "human").length,
  };
  const topTasks = r.tasks.filter((t) => t.status !== "human").slice(0, 5);

  const subject = `Your AI Employee Opportunity Report: AI can handle ~${r.coverage_percent}% of the ${r.role_title} role`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F7F6FB;font-family:Helvetica,Arial,sans-serif;color:#0E0B1F;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6FB;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #ECEAF4;">
  <tr><td style="height:6px;background:linear-gradient(90deg,#F65663,#9452F2);background-color:#9452F2;"></td></tr>
  <tr><td style="padding:32px 32px 8px;">
    <div style="font-size:26px;font-weight:700;letter-spacing:-1px;"><span style="color:#F65663;">un</span><span style="color:#0E0B1F;">hired</span></div>
    <p style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#4A4560;margin:24px 0 6px;">AI Employee Opportunity Report</p>
    <h1 style="font-size:28px;line-height:1.15;margin:0 0 8px;letter-spacing:-0.5px;">AI can handle ~${r.coverage_percent}% of this role.</h1>
    <p style="margin:0 0 4px;font-size:15px;color:#4A4560;">${esc(r.role_title)} · <strong style="color:#6D2FD0;">${esc(tier.label)}</strong></p>
  </td></tr>
  <tr><td style="padding:16px 32px 0;font-size:16px;line-height:1.6;color:#0E0B1F;">
    <p style="margin:0 0 16px;">Hi ${esc(firstName)},</p>
    <p style="margin:0 0 16px;">${esc(r.summary)}</p>
  </td></tr>
  <tr><td style="padding:0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 0;">
      <tr>
        <td style="background:#F7F6FB;border-radius:12px;padding:14px;text-align:center;width:33%;"><div style="font-size:22px;font-weight:700;">${counts.ai_full}</div><div style="font-size:12px;color:#4A4560;">${statusInfo.ai_full.label}</div></td>
        <td style="width:8px;"></td>
        <td style="background:#F7F6FB;border-radius:12px;padding:14px;text-align:center;width:33%;"><div style="font-size:22px;font-weight:700;">${counts.ai_with_review}</div><div style="font-size:12px;color:#4A4560;">${statusInfo.ai_with_review.label}</div></td>
        <td style="width:8px;"></td>
        <td style="background:#F7F6FB;border-radius:12px;padding:14px;text-align:center;width:33%;"><div style="font-size:22px;font-weight:700;">${counts.human}</div><div style="font-size:12px;color:#4A4560;">${statusInfo.human.label}</div></td>
      </tr>
    </table>
  </td></tr>
  ${
    topTasks.length
      ? `<tr><td style="padding:24px 32px 0;">
    <p style="font-weight:700;margin:0 0 8px;font-size:15px;">What your AI hire could take over</p>
    <ul style="margin:0;padding-left:20px;font-size:15px;line-height:1.7;color:#0E0B1F;">
      ${topTasks.map((t) => `<li>${esc(t.task)}</li>`).join("")}
    </ul>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:28px 32px 8px;" align="center">
    <a href="${esc(reportUrl)}" style="display:inline-block;background:#9452F2;background-image:linear-gradient(90deg,#F65663,#9452F2);color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:999px;">View your full report</a>
  </td></tr>
  <tr><td style="padding:8px 32px 28px;" align="center">
    <a href="${esc(links.bookCall ?? `mailto:${siteConfig.contactEmail}`)}" style="color:#6D2FD0;font-size:14px;font-weight:600;">${
      links.bookCall ? "Book a call to build your AI hire →" : "Reply to this email to build your AI hire →"
    }</a>
  </td></tr>
  <tr><td style="padding:20px 32px 28px;border-top:1px solid #ECEAF4;font-size:12px;line-height:1.6;color:#4A4560;">
    You're receiving this because you took the AI Hire Assessment at Unhired and asked for your report.
    You'll also get occasional tips from Unhired. You can unsubscribe anytime — just reply with "unsubscribe" or use the link in any of our newsletters.
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Your AI Employee Opportunity Report is ready.`,
    `AI can handle ~${r.coverage_percent}% of the ${r.role_title} role (${tier.label}).`,
    ``,
    r.summary,
    ``,
    `View your full report: ${reportUrl}`,
    links.bookCall
      ? `Book a call to build your AI hire: ${links.bookCall}`
      : `Reply to this email to build your AI hire.`,
    ``,
    `— Unhired`,
  ].join("\n");

  return { subject, html, text };
}
