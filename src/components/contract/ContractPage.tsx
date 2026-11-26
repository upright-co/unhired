"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Check, Mail, Play, Plus } from "lucide-react";
import {
  contractApp,
  contractCompare,
  contractFaq,
  contractFinal,
  contractHero,
  contractPrice,
  contractProof,
  contractSafety,
  contractSpeed,
  contractSteps,
} from "@/content/contract";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Eyebrow, Reveal } from "@/components/ui/Section";
import { VideoFrame } from "@/components/pilot/VideoFrame";
import { trackEvent } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

function BookButton({ where, label = "Book a call", className = "" }: { where: string; label?: string; className?: string }) {
  return (
    <a
      href={contractApp.bookingUrl}
      target="_blank"
      rel="noopener"
      onClick={() => trackEvent("cta_clicked", { cta: `contract_${where}` })}
      className={`btn btn-primary px-8 py-4 text-base ${className}`}
    >
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
      <Mail className="size-4" aria-hidden /> Email me
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

export function ContractPage() {
  return (
    <main id="main">
      <Hero />
      <Compare />
      <Speed />
      <Steps />
      <Safety />
      <Proof />
      <Price />
      <Faq />
      <Final />
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
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="label-mono text-white/70">
          {contractHero.kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="mx-auto mt-5 max-w-4xl text-[2.25rem] leading-[1.06] font-bold tracking-[-0.04em] sm:text-6xl sm:tracking-[-2.5px]"
        >
          {contractHero.headlineBefore} <br className="hidden sm:block" />
          <span className="text-shimmer-light">{contractHero.headlineHighlight}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          {contractHero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          {contractApp.video ? (
            <VideoFrame url={contractApp.video} poster={contractApp.poster || null} title={contractHero.videoTitle} />
          ) : (
            <VideoPlaceholder />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
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

function Compare() {
  const c = contractCompare;
  return (
    <section aria-labelledby="compare-title" className="px-4 pt-20 pb-14 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="compare-title" eyebrow={c.eyebrow}>
          {c.title}
        </SectionTitle>
        <Reveal className="mt-10 overflow-hidden rounded-[28px] border border-ink/[0.08] bg-white shadow-[0_30px_60px_-40px_rgba(40,14,90,0.35)]">
          <div className="hidden grid-cols-[200px_1fr_1fr] border-b border-ink/[0.08] text-sm font-semibold sm:grid">
            <div className="px-6 py-4" />
            <div className="px-6 py-4 text-muted">{c.cols[0]}</div>
            <div className="relative bg-violet/[0.06] px-6 py-4 text-violet-deep">
              <span aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
              {c.cols[1]}
            </div>
          </div>
          <dl>
            {c.rows.map((r, i) => (
              <div key={r.k} className={`grid gap-1 sm:grid-cols-[200px_1fr_1fr] sm:gap-0 ${i ? "border-t border-ink/[0.08]" : ""}`}>
                <dt className="px-6 pt-5 font-display font-semibold tracking-tight sm:py-5">{r.k}</dt>
                <dd className="px-6 text-muted sm:py-5">
                  <span className="label-mono mr-2 text-[10px] sm:hidden">{c.cols[0]}:</span>
                  {r.hire}
                </dd>
                <dd className="bg-violet/[0.04] flex gap-2.5 px-6 pt-1 pb-5 text-ink/90 sm:py-5">
                  <Check className="mt-1 size-4 shrink-0 text-violet-deep" strokeWidth={3} aria-hidden />
                  <span>
                    <span className="label-mono mr-2 text-[10px] text-violet-deep sm:hidden">Unhired:</span>
                    {r.us}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function Speed() {
  const s = contractSpeed;
  return (
    <section aria-labelledby="speed-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="speed-title" eyebrow={s.eyebrow}>
          {s.title}
        </SectionTitle>
        <Reveal>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{s.body}</p>
        </Reveal>

        <Reveal className="mt-10 space-y-5 rounded-[28px] bg-ink p-6 text-white sm:p-10">
          {s.tracks.map((t) => (
            <div key={t.label} className="grid items-center gap-3 sm:grid-cols-[120px_1fr]">
              <p className={`label-mono ${t.tone === "signal" ? "text-white" : "text-white/50"}`}>{t.label}</p>
              <ol className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {t.steps.map((step, i) => (
                  <li key={step} className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                        t.tone === "signal" ? "bg-signal text-white shadow-[var(--shadow-glow)]" : "border border-white/15 text-white/60"
                      }`}
                    >
                      {step}
                    </span>
                    {i < t.steps.length - 1 && <ArrowRight className={`size-3.5 shrink-0 ${t.tone === "signal" ? "text-white/80" : "text-white/30"}`} aria-hidden />}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <p className="border-t border-white/10 pt-4 text-xs text-white/50">{s.trackNote}</p>
        </Reveal>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {s.items.map((it, i) => (
            <Reveal as="li" key={it.t} delay={0.06 * i} className="border-t-2 border-ink pt-5">
              <span className="text-signal font-display text-5xl font-bold">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">{it.t}</h3>
              <p className="mt-2 leading-relaxed text-muted">{it.b}</p>
            </Reveal>
          ))}
        </ol>
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

function Safety() {
  const s = contractSafety;
  return (
    <section aria-labelledby="safety-title" className="px-3 py-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-16 text-white sm:px-12 sm:py-20">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "violet", className: "-top-24 right-[10%] size-[380px]" },
            { color: "coral", className: "-bottom-24 left-[5%] size-[360px]", slow: true },
          ]}
          intensity={1.3}
        />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow dark>{s.eyebrow}</Eyebrow>
            <h2 id="safety-title" className="mt-4 max-w-3xl text-[1.9rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[2.6rem]">
              {s.title}
            </h2>
          </Reveal>
          <dl className="mt-12 grid divide-y divide-white/10 border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {s.points.map((p, i) => (
              <Reveal key={p.unit} delay={0.06 * i} className="py-8 md:px-8 md:first:pl-0">
                <dt className="font-display text-6xl leading-none font-bold tracking-[-0.04em]">
                  <span className="text-shimmer-light">{p.stat}</span>
                  <span className="ml-2 text-lg font-semibold tracking-tight text-white/80">{p.unit}</span>
                </dt>
                <dd className="mt-3 leading-relaxed text-white/70">{p.b}</dd>
              </Reveal>
            ))}
          </dl>
          <Reveal>
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-white/75">{s.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Proof() {
  const p = contractProof;
  return (
    <section aria-labelledby="proof-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionTitle id="proof-title" eyebrow={p.eyebrow}>
          {p.title}
        </SectionTitle>
        <dl className="mt-10 divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
          {p.items.map((r, i) => (
            <Reveal key={r.k} delay={0.04 * i} className="grid gap-2 py-6 sm:grid-cols-[240px_1fr] sm:gap-10">
              <dt className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight">
                <span aria-hidden className="bg-signal h-1 w-6 shrink-0 rounded-full" />
                {r.k}
              </dt>
              <dd className="leading-relaxed text-ink/85">{r.v}</dd>
            </Reveal>
          ))}
        </dl>
        <div className="mt-12 grid gap-12 md:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="label-mono text-muted">Tools we build with</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.tools.map((t) => (
                <li key={t} className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-medium">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="label-mono text-muted">Brandon&apos;s certifications</p>
            <ul className="mt-4 space-y-2.5">
              {p.certs.map((c) => (
                <li key={c} className="flex gap-2.5 text-ink/85">
                  <Check className="mt-1 size-4 shrink-0 text-violet-deep" strokeWidth={3} aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-muted">{p.people}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Price() {
  const p = contractPrice;
  return (
    <section aria-labelledby="price-title" className="px-3 py-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-16 text-white sm:px-12 sm:py-20">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "coral", className: "-top-24 left-[5%] size-[360px]" },
            { color: "violet", className: "-bottom-24 right-[5%] size-[420px]", slow: true },
          ]}
          intensity={1.4}
        />
        <div className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
          <Reveal>
            <Eyebrow dark>{p.eyebrow}</Eyebrow>
            <p className="mt-6 font-display text-7xl leading-none font-bold tracking-[-0.04em] sm:text-8xl">
              <span className="text-shimmer-light">{p.price}</span>
            </p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight">
              {p.per} <span className="text-base font-normal text-white/60">{p.fine}</span>
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">{p.compare}</p>
            <div className="mt-8">
              <BookButton where="price" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="price-title" className="text-[1.9rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-4xl">
              {p.title}
            </h2>
            <p className="mt-5 leading-relaxed text-white/75">{p.body}</p>
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
      </div>
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

function Final() {
  return (
    <section aria-labelledby="final-title" className="px-3 pb-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-20 text-center text-white sm:py-28">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "coral", className: "-top-20 left-[10%] size-[380px]" },
            { color: "violet", className: "-bottom-24 right-[5%] size-[460px]", slow: true },
          ]}
          intensity={1.6}
        />
        <Reveal className="relative">
          <div className="bg-signal mx-auto w-fit rounded-full p-1 shadow-[var(--shadow-glow)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={contractApp.photo} alt="Brandon Upright" className="size-20 rounded-full border-4 border-ink object-cover" />
          </div>
          <h2 id="final-title" className="mt-8 text-[2.6rem] leading-[1.04] font-bold tracking-[-0.045em] sm:text-7xl sm:tracking-[-2.5px]">
            {contractFinal.title} <span className="text-shimmer">{contractFinal.highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{contractFinal.sub}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <BookButton where="final" label={contractFinal.cta} />
            <EmailLink where="final" />
          </div>
          <p className="mt-6 text-sm text-white/60">Brandon Upright, Founder · {contractApp.email}</p>
        </Reveal>
      </div>
    </section>
  );
}
