"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Copy, Printer, RotateCcw, ShieldAlert, Plug, UserRound, Sun, Moon } from "lucide-react";
import { formatAiHirePrice, formatMoney, links, pricing, siteConfig } from "@/config";
import type { Report, TaskStatus } from "@/lib/schemas";
import { statusInfo, tierInfo } from "@/lib/tiers";
import { trackEvent } from "@/lib/analytics";
import { CoverageGauge } from "@/components/ui/CoverageGauge";
import { Logo } from "@/components/ui/Logo";
import { StatusDot } from "@/components/ui/Decor";

const statusStyle: Record<TaskStatus, string> = {
  ai_full: "bg-signal text-white",
  ai_with_review: "bg-violet/12 text-violet-deep ring-1 ring-violet/25",
  human: "bg-ink/[0.06] text-ink ring-1 ring-ink/10",
};

export function ReportView({
  id,
  report: r,
  shareUrl,
  business,
  embedded = false,
  onRestart,
}: {
  id: string;
  report: Report;
  shareUrl: string;
  business?: string | null;
  embedded?: boolean;
  onRestart?: () => void;
}) {
  const tier = tierInfo[r.verdict_tier];
  const counts = (["ai_full", "ai_with_review", "human"] as const).map((s) => ({
    s,
    n: r.tasks.filter((t) => t.status === s).length,
  }));
  const humanTasks = r.tasks.filter((t) => t.status !== "ai_full");

  useEffect(() => {
    trackEvent("report_viewed", { report_id: id, coverage: r.coverage_percent, embedded });
  }, [id, r.coverage_percent, embedded]);

  return (
    <article className="text-ink" aria-labelledby="report-title">
      {/* Header */}
      <header className="flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="print-only mb-6">
            <Logo className="h-8" />
          </div>
          <p className="label-mono text-violet-deep">AI Employee Opportunity Report</p>
          <h2 id="report-title" className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            {r.role_title}
          </h2>
          <p className="mt-1 text-muted">
            {business ? `Prepared for ${business}` : "Prepared by Unhired"}
          </p>
        </div>
        <ReportActions shareUrl={shareUrl} onRestart={onRestart} />
      </header>

      {/* 1–2. Verdict */}
      <section className="grid items-center gap-8 py-10 md:grid-cols-[auto_1fr] md:gap-14 print-avoid-break">
        <CoverageGauge value={r.coverage_percent} size={280} label="of this role" />
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold shadow-sm ring-1 ring-ink/5">
            <span className="text-signal">{tier.label}</span>
          </p>
          <h3 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.035em] sm:text-[2.6rem]">
            AI can handle ~{r.coverage_percent}% of this role.
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-muted">{r.summary}</p>
          <p className="mt-3 text-sm text-muted">{tier.blurb}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {counts.map(({ s, n }) => (
              <span key={s} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${statusStyle[s]}`}>
                <span className="font-display">{n}</span> {statusInfo[s].label}
              </span>
            ))}
            <span className="label-mono inline-flex items-center rounded-full px-3 py-1.5 text-muted ring-1 ring-ink/10">
              Confidence: {r.confidence}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Task breakdown */}
      <ReportSection eyebrow="Task breakdown" title="Every part of the job, sorted.">
        <div className="glass overflow-hidden rounded-3xl">
          <table className="hidden w-full text-left md:table">
            <thead className="border-b border-ink/10 bg-white/50">
              <tr>
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Task</th>
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Status</th>
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Why</th>
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Human owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06]">
              {r.tasks.map((t, i) => (
                <tr key={i} className="align-top print-avoid-break">
                  <td className="px-5 py-4 font-semibold">{t.task}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={t.status} />
                  </td>
                  <td className="px-5 py-4 text-sm leading-relaxed text-muted">{t.reason}</td>
                  <td className="px-5 py-4 text-sm">{t.human_owner_suggestion ?? <span className="text-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-ink/[0.06] md:hidden">
            {r.tasks.map((t, i) => (
              <li key={i} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{t.task}</p>
                  <StatusPill status={t.status} compact />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.reason}</p>
                {t.human_owner_suggestion && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm">
                    <UserRound className="size-3.5 text-violet-deep" aria-hidden /> {t.human_owner_suggestion}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </ReportSection>

      {/* 4–5. Day in the life + handoff */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection eyebrow="A day on the job" title="What your AI hire would do in a day." flush>
          <div className="glass relative h-full overflow-hidden rounded-3xl p-6 print-avoid-break">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-signal-green/10 px-3 py-1 text-xs font-semibold text-green-deep">
              <StatusDot /> On shift · 24/7
            </p>
            <div className="mb-3 flex items-center gap-2 text-muted" aria-hidden>
              <Sun className="size-4" /> <span className="bg-signal h-px flex-1 opacity-40" /> <Moon className="size-4" />
            </div>
            <Prose text={r.day_in_the_life} />
          </div>
        </ReportSection>

        <ReportSection eyebrow="What stays with your team" title="The human side of the plan." flush>
          <div className="glass h-full rounded-3xl p-6 print-avoid-break">
            <Prose text={r.human_handoff_plan} />
            {humanTasks.length > 0 && (
              <ul className="mt-5 space-y-2">
                {humanTasks.map((t, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm">
                    <span className="font-medium">{t.task}</span>
                    <span className="shrink-0 text-right text-muted">
                      {t.human_owner_suggestion ?? "Your team"}
                      <span className="block text-xs">{statusInfo[t.status].short}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ReportSection>
      </div>

      {/* 6. Cost comparison */}
      <ReportSection eyebrow="Cost comparison" title="What this role costs, both ways.">
        <CostComparison r={r} />
      </ReportSection>

      {/* 7–8. Tools + risks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection eyebrow="Tools & integrations" title="What we'd connect." flush>
          <div className="glass h-full rounded-3xl p-6">
            {r.tools_needed.length ? (
              <ul className="flex flex-wrap gap-2">
                {r.tools_needed.map((t) => (
                  <li key={t} className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium ring-1 ring-ink/10">
                    <Plug className="size-3.5 text-violet-deep" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">We&apos;ll confirm your tools on a call.</p>
            )}
          </div>
        </ReportSection>
        <ReportSection eyebrow="Risks & considerations" title="The honest limits." flush>
          <div className="glass h-full rounded-3xl p-6">
            <ul className="space-y-3">
              {r.risks.map((risk, i) => (
                <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-coral-deep" aria-hidden />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </ReportSection>
      </div>

      {/* 9. Next step */}
      <section className="relative mt-12 overflow-hidden rounded-[32px] bg-ink p-8 text-white sm:p-12 print-avoid-break">
        <div aria-hidden className="absolute -top-20 -right-10 size-72 rounded-full bg-violet opacity-40 blur-[80px]" />
        <div aria-hidden className="absolute -bottom-24 -left-10 size-72 rounded-full bg-coral opacity-30 blur-[80px]" />
        <div className="relative">
          <p className="label-mono text-white/70">Recommended next step</p>
          <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Let&apos;s put your {r.role_title} AI hire on shift.
          </h3>
          <p className="mt-3 max-w-xl text-white/75">
            On a short call we&apos;ll walk through this report, confirm your tools and map out onboarding.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {links.bookCall ? (
              <a
                href={links.bookCall}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("cta_clicked", { cta: "report_book_call", report_id: id })}
                className="btn btn-primary px-7 py-4"
              >
                Book a call to build your AI hire <ArrowRight className="size-4" aria-hidden />
              </a>
            ) : (
              <a
                href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`AI hire for our ${r.role_title} role`)}`}
                onClick={() => trackEvent("cta_clicked", { cta: "report_email", report_id: id })}
                className="btn btn-primary px-7 py-4"
              >
                Email us to build your AI hire <ArrowRight className="size-4" aria-hidden />
              </a>
            )}
            {links.challenge && (
              <a
                href={links.challenge}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("cta_clicked", { cta: "report_challenge", report_id: id })}
                className="btn border border-white/25 bg-white/10 px-7 py-4 text-white hover:bg-white/15"
              >
                Join the Unhired Challenge
              </a>
            )}
          </div>
          <p className="print-only mt-6 text-sm text-white/80">{shareUrl}</p>
        </div>
      </section>
    </article>
  );
}

function ReportSection({
  eyebrow,
  title,
  children,
  flush = false,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section className={flush ? "mt-12 flex flex-col" : "mt-12"}>
      <p className="label-mono text-violet-deep">{eyebrow}</p>
      <h3 className="mt-2 mb-5 text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
      <div className="flex-1">{children}</div>
    </section>
  );
}

function StatusPill({ status, compact = false }: { status: TaskStatus; compact?: boolean }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusStyle[status]}`}>
      {compact ? statusInfo[status].short : statusInfo[status].label}
    </span>
  );
}

function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-3 leading-relaxed">
      {text
        .split(/\n{2,}|\n/)
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </div>
  );
}

function CostComparison({ r }: { r: Report }) {
  const annual = r.cost_comparison.human_annual_cost_input;
  const aiMonthly = pricing.aiHireStartingAt;
  const aiAnnual = aiMonthly != null ? aiMonthly * 12 : null;
  const diff = annual != null && aiAnnual != null ? annual - aiAnnual : null;

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 print-avoid-break">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-ink/5">
          <p className="label-mono text-muted">Human hire</p>
          {annual != null ? (
            <>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
                {formatMoney(annual)}
                <span className="text-base font-medium text-muted">/yr</span>
              </p>
              <p className="text-sm text-muted">≈ {formatMoney(annual / 12)}/mo base pay (your estimate)</p>
            </>
          ) : (
            <>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink/40">$—</p>
              <p className="text-sm text-muted">You didn&apos;t share a salary estimate, so there&apos;s nothing to compare yet.</p>
            </>
          )}
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            <li>+ Payroll taxes, benefits & overhead: [STAT — source needed]</li>
            <li>+ Recruiting and onboarding time</li>
            <li>+ Coverage for sick days and vacation</li>
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white/80 p-5 ring-1 ring-violet/25">
          <div aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
          <p className="label-mono text-violet-deep">AI hire</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {formatAiHirePrice()}
            <span className="text-base font-medium text-muted">/mo</span>
          </p>
          <p className="text-sm text-muted">
            {aiAnnual != null
              ? `Starting price · ${formatMoney(aiAnnual)}/yr`
              : "Priced to the role"}
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            <li className="flex gap-2"><Check className="mt-0.5 size-3.5 text-green-deep" aria-hidden /> No recruiting fees or payroll taxes</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-3.5 text-green-deep" aria-hidden /> Works 24/7, no sick days</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-3.5 text-green-deep" aria-hidden /> Covers ~{r.coverage_percent}% of the role</li>
          </ul>
        </div>
      </div>

      {diff != null && (
        <p className="mt-5 rounded-2xl bg-mist px-5 py-4 text-sm">
          At the starting price, the difference on base pay alone is{" "}
          <strong className="font-semibold">
            {formatMoney(Math.abs(diff))}/yr {diff >= 0 ? "in favor of the AI hire" : "in favor of the human hire"}
          </strong>
          , before taxes, benefits and overhead. Your actual price depends on the scope of this role, and the AI hire
          covers ~{r.coverage_percent}% of it — the rest stays with your team.
        </p>
      )}
      {r.cost_comparison.notes && <p className="mt-4 text-sm leading-relaxed text-muted">{r.cost_comparison.notes}</p>}
    </div>
  );
}

function ReportActions({ shareUrl, onRestart }: { shareUrl: string; onRestart?: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        type="button"
        className="btn btn-secondary px-4 py-2.5 text-sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt("Copy your report link:", shareUrl);
          }
        }}
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        className="btn btn-secondary px-4 py-2.5 text-sm"
        onClick={() => {
          trackEvent("cta_clicked", { cta: "report_print" });
          window.print();
        }}
      >
        <Printer className="size-4" aria-hidden /> Print / save PDF
      </button>
      {onRestart && (
        <button type="button" className="btn btn-secondary px-4 py-2.5 text-sm" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden /> New assessment
        </button>
      )}
    </div>
  );
}
