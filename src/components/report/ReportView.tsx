"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Copy, Printer, RotateCcw, ShieldAlert, Plug, UserRound, Sun, Moon, Clock } from "lucide-react";
import { formatMoney, guarantee, links, siteConfig } from "@/config";
import type { StoredReport, TaskStatus } from "@/lib/schemas";
import { pathInfo, statusInfo, tierInfo, WEEK_HOURS } from "@/lib/tiers";
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
  report: StoredReport;
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
  const path = pathInfo[r.verdict_tier];
  const aiHours = Math.round((r.coverage_percent / 100) * WEEK_HOURS);
  const hasShares = r.tasks.some((t) => t.share_percent != null);

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
          {hasShares && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted">
              <Clock className="size-4 text-violet-deep" aria-hidden />
              About <strong className="font-semibold text-ink">{aiHours} of every {WEEK_HOURS} hours</strong> of this
              job would be handled by your AI Employee.
            </p>
          )}
          {r.missing_info && r.missing_info.length > 0 && (
            <p className="mt-2 text-sm text-muted">
              <span className="font-medium text-ink">To sharpen this estimate, tell us:</span>{" "}
              {r.missing_info.join("; ")}.
            </p>
          )}
        </div>
      </section>

      {/* Recommendation */}
      {r.recommendation && (
        <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-8 print-avoid-break">
          <div aria-hidden className="absolute -top-16 -right-10 size-56 rounded-full bg-violet opacity-40 blur-[70px]" />
          <div className="relative grid gap-4 md:grid-cols-[minmax(0,240px)_1fr] md:gap-10">
            <div>
              <p className="label-mono text-white/60">Our recommendation</p>
              <p className="mt-2 font-display text-2xl leading-tight font-semibold tracking-[-0.02em]">{path.label}</p>
            </div>
            <p className="leading-relaxed text-white/85">{r.recommendation}</p>
          </div>
        </section>
      )}

      {r.value_highlights && r.value_highlights.length > 0 && (
        <ReportSection eyebrow="What it changes" title="What this would fix for you.">
          <ul className="divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
            {r.value_highlights.map((v, i) => (
              <li key={i} className="flex gap-4 py-4 leading-relaxed">
                <span className="bg-signal mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white">
                  <Check className="size-3.5" aria-hidden />
                </span>
                {v}
              </li>
            ))}
          </ul>
        </ReportSection>
      )}

      {/* 3. Task breakdown */}
      <ReportSection eyebrow="Task breakdown" title="Every part of the job, sorted.">
        <div className="glass overflow-hidden rounded-3xl">
          <table className="hidden w-full text-left md:table">
            <thead className="border-b border-ink/10 bg-white/50">
              <tr>
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Task</th>
                {hasShares && <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Time</th>}
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Status</th>
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Why</th>
                <th scope="col" className="label-mono px-5 py-3 font-medium text-muted">Human owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06]">
              {r.tasks.map((t, i) => (
                <tr key={i} className="align-top print-avoid-break">
                  <td className="px-5 py-4 font-semibold">{t.task}</td>
                  {hasShares && (
                    <td className="px-5 py-4">
                      <ShareBar share={t.share_percent} />
                    </td>
                  )}
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
                {t.share_percent != null && (
                  <div className="mt-2">
                    <ShareBar share={t.share_percent} />
                  </div>
                )}
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
        <ReportSection eyebrow="A day on the job" title="What your AI Employee would do in a day." flush>
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

      {r.getting_started && r.getting_started.length > 0 && (
        <ReportSection eyebrow="Getting started" title="What it takes to put this AI Employee on shift.">
          <ol className="space-y-0">
            {r.getting_started.map((step, i) => (
              <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {i < r.getting_started!.length - 1 && (
                  <span aria-hidden className="absolute top-8 bottom-0 left-[15px] w-px bg-ink/10" />
                )}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white font-display text-sm font-semibold text-violet-deep ring-1 ring-violet/25">
                  {i + 1}
                </span>
                <p className="pt-1 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </ReportSection>
      )}

      {/* 9. Next step */}
      <section className="relative mt-12 overflow-hidden rounded-[32px] bg-ink p-8 text-white sm:p-12 print-avoid-break">
        <div aria-hidden className="absolute -top-20 -right-10 size-72 rounded-full bg-violet opacity-40 blur-[80px]" />
        <div aria-hidden className="absolute -bottom-24 -left-10 size-72 rounded-full bg-coral opacity-30 blur-[80px]" />
        <div className="relative">
          <p className="label-mono text-white/70">Recommended next step</p>
          <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Let&apos;s put your {r.role_title} AI Employee on shift.
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
                Book a call to build your AI Employee <ArrowRight className="size-4" aria-hidden />
              </a>
            ) : (
              <a
                href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`AI Employee for our ${r.role_title} role`)}`}
                onClick={() => trackEvent("cta_clicked", { cta: "report_email", report_id: id })}
                className="btn btn-primary px-7 py-4"
              >
                Email us to build your AI Employee <ArrowRight className="size-4" aria-hidden />
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

function ShareBar({ share }: { share?: number }) {
  if (share == null) return <span className="text-muted">—</span>;
  return (
    <span className="flex min-w-[96px] items-center gap-2" title={`About ${share}% of the working week`}>
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-ink/[0.07]">
        <span className="bg-signal block h-full rounded-full" style={{ width: `${Math.min(100, share * 2)}%` }} />
      </span>
      <span className="text-xs font-medium text-muted tabular-nums">~{share}%</span>
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

function CostComparison({ r }: { r: StoredReport }) {
  const mode = pathInfo[r.verdict_tier].guarantee;
  const annual = r.cost_comparison.human_annual_cost_input;
  const aiHours = Math.round((r.coverage_percent / 100) * WEEK_HOURS);
  const personHours = WEEK_HOURS - aiHours;
  const notes = r.cost_comparison.notes && (
    <p className="mt-4 text-sm leading-relaxed text-muted">{r.cost_comparison.notes}</p>
  );

  // The salary guarantee only applies where the AI Employee can replace the hire. Below that,
  // show the hours it takes off instead of promising savings against a full-time salary.
  if (mode !== "full") {
    return (
      <div className="glass rounded-3xl p-6 sm:p-8 print-avoid-break">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/80 p-5 ring-1 ring-ink/5">
            <p className="label-mono text-muted">{mode === "hours" ? "A person, part-time" : "The person you hire"}</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
              ~{personHours}
              <span className="text-base font-medium text-muted"> hrs/week</span>
            </p>
            <p className="text-sm text-muted">
              {mode === "hours"
                ? "The parts of the job that need a person"
                : "This role still needs someone for most of the week"}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-white/80 p-5 ring-1 ring-violet/25">
            <div aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
            <p className="label-mono text-violet-deep">AI Employee</p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
              ~{aiHours}
              <span className="text-base font-medium text-muted"> hrs/week</span>
            </p>
            <p className="text-sm text-muted">
              {mode === "hours" ? "Taken off the role, every week" : "Of admin taken off their plate"}
            </p>
          </div>
        </div>
        <p className="mt-5 rounded-2xl bg-mist px-5 py-4 text-sm">
          {mode === "hours" ? (
            <>
              Instead of a full-time hire, you could hire for about <strong className="font-semibold">{personHours} hours a
              week</strong> and let an AI Employee cover the rest, around the clock. We&apos;ll price it on a call once
              the scope is clear.
            </>
          ) : (
            <>
              This role needs a person. An AI Employee can still take about{" "}
              <strong className="font-semibold">{aiHours} hours a week</strong> of admin off whoever does it, so they
              spend their time on the work only they can do.
            </>
          )}
        </p>
        {notes}
      </div>
    );
  }

  // Billed monthly like a salary, guaranteed to cost at most this share of the role's salary.
  const savedPct = guarantee.salarySavingsPercent;
  const aiMaxAnnual = annual != null ? annual * (1 - savedPct / 100) : null;
  const minSaved = annual != null && aiMaxAnnual != null ? annual - aiMaxAnnual : null;

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
            <li>+ Benefits, payroll taxes and insurance (about 30% of total pay costs in the US, per the BLS)</li>
            <li>+ Recruiting and onboarding time</li>
            <li>+ Coverage for sick days and vacation</li>
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-white/80 p-5 ring-1 ring-violet/25">
          <div aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
          <p className="label-mono text-violet-deep">AI Employee</p>
          {aiMaxAnnual != null ? (
            <>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
                <span className="text-base font-medium text-muted">at most </span>
                {formatMoney(aiMaxAnnual / 12)}
                <span className="text-base font-medium text-muted">/mo</span>
              </p>
              <p className="text-sm text-muted">
                Guaranteed · no more than {formatMoney(aiMaxAnnual)}/yr, half the salary
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
                {savedPct}%+
                <span className="text-base font-medium text-muted"> of the salary saved</span>
              </p>
              <p className="text-sm text-muted">Guaranteed · billed monthly, like a salary</p>
            </>
          )}
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            <li className="flex gap-2"><Check className="mt-0.5 size-3.5 text-green-deep" aria-hidden /> No recruiting fees or payroll taxes</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-3.5 text-green-deep" aria-hidden /> Works 24/7, no sick days</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-3.5 text-green-deep" aria-hidden /> Covers ~{r.coverage_percent}% of the role</li>
          </ul>
        </div>
      </div>

      <p className="mt-5 rounded-2xl bg-mist px-5 py-4 text-sm">
        {minSaved != null ? (
          <>
            We guarantee you save{" "}
            <strong className="font-semibold">at least {formatMoney(minSaved)}/yr</strong> on base pay alone, before taxes,
            benefits and overhead.
          </>
        ) : (
          <>
            We guarantee the AI Employee costs <strong className="font-semibold">at most half</strong> of what you&apos;d
            pay a person for this role, billed monthly so it fits your labor budget.
          </>
        )}{" "}
        {r.coverage_percent >= 80
          ? `It covers ~${r.coverage_percent}% of the role, with a person checking in on the edge cases.`
          : `It covers ~${r.coverage_percent}% of the role; the remaining ~${personHours} hrs/week stay with your current team.`}
      </p>
      {notes}
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
