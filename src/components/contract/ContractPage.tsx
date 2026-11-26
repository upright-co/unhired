"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Bot,
  BrainCircuit,
  Calendar,
  CalendarCheck,
  ChartColumn,
  Check,
  CodeXml,
  Database,
  Eye,
  FileCheck,
  KeyRound,
  Lock,
  Mail,
  Map as MapIcon,
  Play,
  Plus,
  Receipt,
  RefreshCw,
  Rocket,
  ScanSearch,
  Search,
  Users,
  Wallet,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  contractApp,
  contractBenefits,
  contractCompare,
  contractFaq,
  contractFinal,
  contractHero,
  contractPrice,
  contractPrivacy,
  contractSpeed,
  contractSteps,
  contractTestimonials,
  contractTools,
} from "@/content/contract";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Eyebrow, Reveal } from "@/components/ui/Section";
import { VideoFrame } from "@/components/pilot/VideoFrame";
import { trackEvent } from "@/lib/analytics";
import { TOOL_LOGOS } from "./toolLogos";
import { CostCompare, SpeedRace } from "./Animated";

const ease = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<string, LucideIcon> = {
  database: Database,
  key: KeyRound,
  lock: Lock,
  brain: BrainCircuit,
  eye: Eye,
  file: FileCheck,
  users: Users,
  search: Search,
  map: MapIcon,
  code: CodeXml,
  bot: Bot,
  wallet: Wallet,
  activity: Activity,
  calendar: CalendarCheck,
  chart: ChartColumn,
  book: BookOpen,
  receipt: Receipt,
  refresh: RefreshCw,
};

const SPEED_ICONS = [ScanSearch, Wrench, Rocket];

/** Every "book" button scrolls to the calendar embedded at the bottom of the page. */
function BookButton({ where, label = "Book a call", className = "" }: { where: string; label?: string; className?: string }) {
  return (
    <a href="#book" onClick={() => trackEvent("cta_clicked", { cta: `contract_${where}` })} className={`btn btn-primary px-8 py-4 text-base ${className}`}>
      <Calendar className="size-4" aria-hidden /> {label} <ArrowRight className="size-4" aria-hidden />
    </a>
  );
}

function EmailLink({ where }: { where: string }) {
  return (
    <a
      href={`mailto:${contractApp.email}?subject=${encodeURIComponent("AI automation on retainer")}`}
      onClick={() => trackEvent("cta_clicked", { cta: `contract_email_${where}` })}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
    >
      <Mail className="size-4" aria-hidden /> Email us
    </a>
  );
}

function SectionTitle({ id, eyebrow, children }: { id: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
        {children}
      </h2>
    </Reveal>
  );
}

function DarkPanel({ children, className = "", orbs }: { children: React.ReactNode; className?: string; orbs: Parameters<typeof GlowOrbs>[0]["orbs"] }) {
  return (
    <div className={`relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink text-white ${className}`}>
      <GridBackground dark />
      <GlowOrbs orbs={orbs} intensity={1.4} />
      {children}
    </div>
  );
}

export function ContractPage() {
  return (
    <main id="main">
      <Hero />
      <Compare />
      <Speed />
      <Steps />
      <Privacy />
      <Benefits />
      <Testimonials />
      <Price />
      <CostCompare />
      <Faq />
      <Book />
    </main>
  );
}

function VideoPlaceholder() {
  return (
    <div className="relative grid aspect-video place-items-center overflow-hidden rounded-[26px] border border-white/15 bg-[radial-gradient(ellipse_at_center,rgba(148,82,242,0.35),rgba(10,8,20,0.95)_70%)] shadow-[0_40px_90px_-30px_rgba(40,14,90,0.7)]">
      <div className="flex flex-col items-center gap-4">
        <span className="bg-signal grid size-16 place-items-center rounded-full shadow-[var(--shadow-glow)]">
          <Play className="ml-1 size-7 text-white" fill="currentColor" aria-hidden />
        </span>
        <p className="label-mono text-white/70">Video coming soon</p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink pt-14 pb-16 text-white sm:pt-20 sm:pb-24">
      <GridBackground dark />
      <GlowOrbs
        orbs={[
          { color: "coral", className: "-top-24 -left-24 size-[460px]" },
          { color: "violet", className: "top-32 -right-40 size-[560px]", slow: true },
          { color: "violet", className: "bottom-[-10%] left-1/4 size-[380px]" },
        ]}
        intensity={1.5}
      />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-4xl text-[2.25rem] leading-[1.06] font-bold tracking-[-0.04em] sm:text-6xl sm:tracking-[-2.5px]"
        >
          {contractHero.headlineBefore}
          <br />
          <span className="text-shimmer-light">{contractHero.headlineHighlight}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.08 }}
          className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          {contractHero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.16 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          {contractApp.video ? <VideoFrame url={contractApp.video} poster={contractApp.poster || null} title={contractHero.videoTitle} /> : <VideoPlaceholder />}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.26 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <BookButton where="hero" />
          <EmailLink where="hero" />
        </motion.div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-left text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
          {contractHero.facts.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span className="bg-signal mt-0.5 grid size-4 shrink-0 place-items-center rounded-full">
                <Check className="size-2.5 text-white" strokeWidth={4} aria-hidden />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- compare -- */

function HireMark() {
  return (
    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink/[0.06]">
      <X className="size-3 text-ink/40" strokeWidth={3} aria-hidden />
    </span>
  );
}

function UsMark() {
  return (
    <span className="bg-signal mt-0.5 grid size-5 shrink-0 place-items-center rounded-full shadow-[var(--shadow-glow)]">
      <Check className="size-3 text-white" strokeWidth={4} aria-hidden />
    </span>
  );
}

function Compare() {
  const c = contractCompare;
  const last = c.rows.length + 1;
  return (
    <section aria-labelledby="compare-title" className="px-4 pt-20 pb-14 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="compare-title" eyebrow={c.eyebrow}>
          {c.title}
        </SectionTitle>

        {/* Desktop: the Unhired column is one raised dark panel running the full height of the table. */}
        <Reveal className="mt-12 hidden md:block">
          <div className="grid grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)_minmax(0,1.15fr)]" style={{ gridTemplateRows: `repeat(${last}, auto)` }}>
            <div
              aria-hidden
              className="relative -my-4 overflow-hidden rounded-[28px] bg-ink shadow-[0_40px_80px_-30px_rgba(64,20,140,0.65)]"
              style={{ gridColumn: 3, gridRow: `1 / ${last + 1}` }}
            >
              <span className="bg-signal absolute inset-x-0 top-0 h-1.5" />
              <span className="absolute -top-24 -right-16 size-64 rounded-full bg-violet/40 blur-3xl" />
              <span className="absolute -bottom-24 -left-16 size-56 rounded-full bg-coral/25 blur-3xl" />
            </div>

            <div style={{ gridColumn: 2, gridRow: 1 }} className="flex items-end px-6 pb-4 font-display text-lg font-semibold text-ink/45">
              {c.cols[0]}
            </div>
            <div style={{ gridColumn: 3, gridRow: 1 }} className="relative px-7 pt-6 pb-4">
              <p className="label-mono text-[10px] text-white/50">Recommended</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">{c.cols[1]}</p>
            </div>

            {c.rows.map((r, i) => (
              <div key={r.k} className="contents">
                <div style={{ gridColumn: 1, gridRow: i + 2 }} className="border-t border-ink/[0.08] py-6 pr-6 font-display text-[1.05rem] leading-snug font-semibold tracking-tight">
                  {r.k}
                </div>
                <div style={{ gridColumn: 2, gridRow: i + 2 }} className="flex gap-3 border-t border-ink/[0.08] px-6 py-6 leading-relaxed text-muted">
                  <HireMark />
                  {r.hire}
                </div>
                <div style={{ gridColumn: 3, gridRow: i + 2 }} className="relative mx-0 flex gap-3 border-t border-white/10 px-7 py-6 leading-relaxed text-white/90">
                  <UsMark />
                  {r.us}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile: one card per row, the two answers stacked. */}
        <div className="mt-10 space-y-4 md:hidden">
          {c.rows.map((r) => (
            <Reveal key={r.k} className="overflow-hidden rounded-[22px] border border-ink/[0.08] bg-white shadow-[0_24px_50px_-36px_rgba(40,14,90,0.45)]">
              <p className="px-5 pt-5 pb-3 font-display text-lg font-semibold tracking-tight">{r.k}</p>
              <div className="flex gap-3 px-5 pb-4 text-[0.95rem] leading-relaxed text-muted">
                <HireMark />
                <div>
                  <span className="label-mono block text-[10px] text-ink/40">{c.cols[0]}</span>
                  {r.hire}
                </div>
              </div>
              <div className="relative flex gap-3 overflow-hidden bg-ink px-5 py-4 text-[0.95rem] leading-relaxed text-white/90">
                <span aria-hidden className="absolute -top-16 -right-10 size-40 rounded-full bg-violet/40 blur-3xl" />
                <UsMark />
                <div className="relative">
                  <span className="label-mono block text-[10px] text-white/55">{c.cols[1]}</span>
                  {r.us}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ speed -- */

function Speed() {
  const s = contractSpeed;
  return (
    <section aria-labelledby="speed-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="speed-title" eyebrow={s.eyebrow}>
          {s.title}
        </SectionTitle>
        <Reveal>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{s.body}</p>
        </Reveal>

        <ol className="relative mt-12 grid gap-5 md:grid-cols-3">
          <span aria-hidden className="bg-signal absolute top-[52px] right-[16%] left-[16%] hidden h-0.5 opacity-40 md:block" />
          {s.items.map((it, i) => {
            const Icon = SPEED_ICONS[i] ?? Rocket;
            return (
              <Reveal
                as="li"
                key={it.t}
                delay={0.08 * i}
                className="group relative rounded-[26px] border border-ink/[0.08] bg-white p-7 shadow-[0_30px_60px_-42px_rgba(40,14,90,0.45)] transition-shadow hover:shadow-[0_36px_70px_-36px_rgba(64,20,140,0.5)]"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-signal relative grid size-14 place-items-center rounded-2xl text-white shadow-[var(--shadow-glow)]">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span className="font-display text-5xl font-bold tracking-tight text-ink/[0.07]">0{i + 1}</span>
                </div>
                <p className="label-mono mt-6 text-violet-deep">{it.t}</p>
                <h3 className="mt-2 font-display text-xl leading-snug font-semibold tracking-tight">{it.h}</h3>
                <p className="mt-3 leading-relaxed text-muted">{it.b}</p>
              </Reveal>
            );
          })}
        </ol>

        <SpeedRace />
      </div>
    </section>
  );
}

function Steps() {
  const s = contractSteps;
  return (
    <section aria-labelledby="steps-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="steps-title" eyebrow={s.eyebrow}>
          {s.title}
        </SectionTitle>
        <ol className="relative mt-12 space-y-0">
          <span aria-hidden className="bg-signal absolute top-4 bottom-4 left-[19px] w-0.5 opacity-40" />
          {s.steps.map((st, i) => (
            <Reveal as="li" key={st.t} delay={0.04 * i} className="relative grid gap-3 pb-10 pl-16 last:pb-0 md:grid-cols-[1fr_280px] md:gap-10">
              <span className="bg-signal absolute top-0 left-0 grid size-10 place-items-center rounded-full font-display text-sm font-bold text-white shadow-[var(--shadow-glow)]">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight">{st.t}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{st.b}</p>
              </div>
              <p className="self-start rounded-2xl border border-violet/20 bg-violet/[0.05] px-4 py-3 text-sm leading-snug">
                <span className="label-mono block text-[10px] text-violet-deep">You get</span>
                {st.get}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- privacy -- */

function Privacy() {
  const s = contractPrivacy;
  return (
    <section aria-labelledby="privacy-title" className="px-3 py-10 sm:px-5">
      <DarkPanel
        className="px-6 py-16 sm:px-12 sm:py-20"
        orbs={[
          { color: "violet", className: "-top-24 right-[10%] size-[380px]" },
          { color: "coral", className: "-bottom-24 left-[5%] size-[360px]", slow: true },
        ]}
      >
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow dark>{s.eyebrow}</Eyebrow>
            <h2 id="privacy-title" className="mt-4 max-w-3xl text-[1.9rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[2.6rem]">
              {s.title}
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/75">{s.body}</p>
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {s.points.map((p, i) => {
              const Icon = ICONS[p.icon] ?? Lock;
              return (
                <Reveal as="li" key={p.t} delay={0.04 * i} className="bg-ink/95 p-6 sm:p-7">
                  <span className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/[0.06]">
                    <Icon className="size-5 text-[#C7A6FF]" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{p.t}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-white/65">{p.b}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </DarkPanel>
    </section>
  );
}

/* --------------------------------------------------------------- benefits -- */

function Benefits() {
  const b = contractBenefits;
  const t = contractTools;
  return (
    <section aria-labelledby="benefits-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="benefits-title" eyebrow={b.eyebrow}>
          {b.title}
        </SectionTitle>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-ink/[0.08] bg-ink/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {b.items.map((it, i) => {
            const Icon = ICONS[it.icon] ?? Check;
            return (
              <Reveal as="li" key={it.t} delay={0.03 * (i % 4)} className="group bg-white p-6 transition-colors hover:bg-[#FBFAFE]">
                <span className="grid size-11 place-items-center rounded-xl bg-violet/[0.08] transition-colors group-hover:bg-violet/[0.14]">
                  <Icon className="size-5 text-violet-deep" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-[1.05rem] leading-snug font-semibold tracking-tight">{it.t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{it.b}</p>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-16">
          <p className="label-mono text-muted">{t.label}</p>
          <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-ink/[0.08] bg-ink/[0.08] sm:grid-cols-4 md:grid-cols-7">
            {t.tools.map((k) => {
              const logo = TOOL_LOGOS[k];
              return (
                <li key={k} className="flex items-center gap-3 bg-white px-4 py-4 sm:flex-col sm:justify-center sm:gap-3 sm:px-3 sm:py-6 sm:text-center">
                  <svg viewBox="0 0 24 24" role="img" aria-label={logo.name} className="size-7 shrink-0" fill={logo.color}>
                    <path d={logo.d} />
                  </svg>
                  <span className="text-sm leading-tight font-medium text-ink/80">{logo.name}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="label-mono text-muted">{t.certsLabel}</p>
            <ul className="mt-4 space-y-2.5">
              {t.certs.map((c) => (
                <li key={c} className="flex gap-2.5 text-ink/85">
                  <Check className="mt-1 size-4 shrink-0 text-violet-deep" strokeWidth={3} aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="label-mono text-muted">Who we work with</p>
            <p className="mt-4 leading-relaxed text-ink/80">{t.people}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- testimonials -- */

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Testimonials() {
  const t = contractTestimonials;
  return (
    <section aria-labelledby="testimonials-title" className="px-4 pt-6 pb-14 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="testimonials-title" eyebrow={t.eyebrow}>
          {t.title}
        </SectionTitle>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.items.map((it, i) => (
            <Reveal
              as="li"
              key={it.name}
              delay={0.05 * (i % 3)}
              className="relative flex flex-col overflow-hidden rounded-[26px] border border-ink/[0.08] bg-white p-7 shadow-[0_30px_60px_-44px_rgba(40,14,90,0.45)]"
            >
              <span aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1 opacity-80" />
              <p className="font-display text-4xl leading-none font-bold tracking-[-0.03em]">
                <span className="text-signal">{it.stat}</span>
              </p>
              <p className="label-mono mt-2 text-[10px] text-muted">{it.label}</p>
              <blockquote className="mt-5 flex-1 border-t border-ink/[0.08] pt-5 leading-relaxed text-ink/85">&ldquo;{it.quote}&rdquo;</blockquote>
              <div className="mt-6 flex items-center gap-3">
                {"photo" in it && it.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.photo} alt={it.name} width={40} height={40} loading="lazy" className="size-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="bg-signal grid size-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-white">{initials(it.name)}</span>
                )}
                <span className="leading-tight">
                  <span className="block font-display font-semibold">{it.name}</span>
                  {it.company && <span className="block text-sm text-muted">{it.company}</span>}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ price -- */

function Price() {
  const p = contractPrice;
  return (
    <section aria-labelledby="price-title" className="px-3 py-10 sm:px-5">
      <DarkPanel
        className="px-6 py-16 sm:px-12 sm:py-20"
        orbs={[
          { color: "coral", className: "-top-24 left-[5%] size-[360px]" },
          { color: "violet", className: "-bottom-24 right-[5%] size-[420px]", slow: true },
        ]}
      >
        <div className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
          <Reveal>
            <p className="font-display text-7xl leading-none font-bold tracking-[-0.04em] sm:text-8xl">
              <span className="text-shimmer-light">{p.price}</span>
            </p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{p.per}</p>
            <ul className="mt-6 space-y-2.5">
              {p.terms.map((term) => (
                <li key={term} className="flex items-center gap-2.5 text-lg text-white/90">
                  <span className="bg-signal grid size-5 shrink-0 place-items-center rounded-full">
                    <Check className="size-3 text-white" strokeWidth={4} aria-hidden />
                  </span>
                  {term}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">{p.compare}</p>
            <div className="mt-8">
              <BookButton where="price" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="price-title" className="text-[1.9rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-4xl">
              {p.title}
            </h2>
            <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
              {p.included.map((it) => (
                <li key={it.t} className="flex gap-3">
                  <span className="bg-signal mt-1 grid size-5 shrink-0 place-items-center rounded-full">
                    <Check className="size-3 text-white" strokeWidth={4} aria-hidden />
                  </span>
                  <p className="leading-relaxed text-white/75">
                    <span className="font-semibold text-white">{it.t}.</span> {it.b}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <p className="relative mx-auto mt-12 max-w-5xl border-t border-white/10 pt-5 text-xs leading-relaxed text-white/50">{p.smallPrint}</p>
      </DarkPanel>
    </section>
  );
}

function Faq() {
  const f = contractFaq;
  return (
    <section aria-labelledby="faq-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <SectionTitle id="faq-title" eyebrow={f.eyebrow}>
          {f.title}
        </SectionTitle>
        <Reveal className="divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
          {f.items.map((it) => (
            <details key={it.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                {it.q}
                <Plus className="size-5 shrink-0 text-violet-deep transition-transform group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-3 pr-10 leading-relaxed text-muted">{it.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- book -- */

type CalApi = ((...args: unknown[]) => void) & { ns: Record<string, (...args: unknown[]) => void>; q?: unknown[]; loaded?: boolean };
declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/** Cal.com's inline embed: their loader snippet, then one namespaced inline calendar that sizes itself to the content. */
function CalInline() {
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    /* eslint-disable */
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    /* eslint-enable */
    const Cal = window.Cal!;
    Cal("init", "contract", { origin: "https://cal.com" });
    Cal.ns.contract("inline", { elementOrSelector: "#cal-contract", calLink: contractApp.calLink, config: { layout: "month_view", theme: "light" } });
    Cal.ns.contract("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view", cssVarsPerTheme: { light: { "cal-brand": "#9452F2" } } });
    Cal.ns.contract("on", { action: "bookingSuccessful", callback: () => trackEvent("call_booked", { source: "contract" }) });
  }, []);
  return <div id="cal-contract" className="min-h-[620px] w-full overflow-auto" />;
}

function Book() {
  return (
    <section id="book" aria-labelledby="book-title" className="scroll-mt-6 px-3 pb-10 sm:px-5">
      <DarkPanel
        className="px-4 pt-16 pb-6 sm:px-10 sm:pt-20 sm:pb-10"
        orbs={[
          { color: "coral", className: "-top-20 left-[10%] size-[380px]" },
          { color: "violet", className: "-bottom-24 right-[5%] size-[460px]", slow: true },
        ]}
      >
        <Reveal className="relative text-center">
          <div className="bg-signal mx-auto w-fit rounded-full p-1 shadow-[var(--shadow-glow)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={contractApp.photo} alt="Brandon Upright" className="size-20 rounded-full border-4 border-ink object-cover" />
          </div>
          <h2 id="book-title" className="mx-auto mt-8 max-w-4xl text-[2.3rem] leading-[1.06] font-bold tracking-[-0.04em] sm:text-6xl sm:tracking-[-2px]">
            {contractFinal.lead}
            <br />
            {contractFinal.title} <span className="text-shimmer">{contractFinal.highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{contractFinal.sub}</p>
        </Reveal>
        <div className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-[26px] bg-white p-2 text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] sm:p-4">
          <CalInline />
        </div>
        <p className="relative mt-6 text-center text-sm text-white/60">
          Prefer email?{" "}
          <a href={`mailto:${contractApp.email}`} onClick={() => trackEvent("cta_clicked", { cta: "contract_email_book" })} className="font-semibold text-white underline-offset-4 hover:underline">
            {contractApp.email}
          </a>
        </p>
      </DarkPanel>
    </section>
  );
}
