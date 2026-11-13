"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, Play, Plus, X } from "lucide-react";
import { pilotConfig } from "@/config";
import {
  pilotAbout,
  pilotFaq,
  pilotFinal,
  pilotFit,
  pilotHero,
  pilotProof,
  pilotRisk,
  pilotSteps,
  pilotWhy,
} from "@/content/pilot";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Logo } from "@/components/ui/Logo";
import { Eyebrow, Reveal, SectionHeading } from "@/components/ui/Section";
import { trackEvent } from "@/lib/analytics";
import { VideoFrame } from "./VideoFrame";

const ease = [0.22, 1, 0.36, 1] as const;

function ApplyButton({ where, className = "", label = pilotHero.cta }: { where: string; className?: string; label?: string }) {
  return (
    <Link
      href="/pilot/apply"
      onClick={() => trackEvent("cta_clicked", { cta: `pilot_${where}` })}
      className={`btn btn-primary px-8 py-4 text-base ${className}`}
    >
      {label} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

/** Big section heading used on the dark cards and the "Why it's free" card (no dash, larger than an eyebrow). */
function CardHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-signal font-display text-2xl font-bold tracking-tight sm:text-3xl">{children}</p>;
}

export function PilotPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Steps />
        <Why />
        <Fit />
        <Risk />
        <About />
        <Faq />
        <Apply />
      </main>
    </>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-ink/80 py-2 pr-2 pl-5 backdrop-blur-xl">
        <a href="#top" aria-label="Back to top">
          <Logo className="h-6" dark />
        </a>
        <Link
          href="/pilot/apply"
          onClick={() => trackEvent("cta_clicked", { cta: "pilot_header" })}
          className="btn btn-primary px-5 py-2.5 text-sm"
        >
          Apply
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink pt-32 pb-20 text-white sm:pt-40 sm:pb-28">
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <p className="font-display text-xl font-bold tracking-tight text-white sm:text-3xl">
            <span className="text-signal">{pilotHero.kicker}</span>
          </p>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="mx-auto mt-5 max-w-4xl text-[2.35rem] leading-[1.06] font-bold tracking-[-0.04em] sm:text-6xl sm:tracking-[-2.5px]"
        >
          {pilotHero.headlineBefore} <span className="text-shimmer-light whitespace-nowrap">{pilotHero.headlineHighlight}</span>
          {/^[.,!?]/.test(pilotHero.headlineAfter) ? "" : " "}
          {pilotHero.headlineAfter}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          {pilotHero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          {pilotConfig.videoUrl ? (
            <VideoFrame url={pilotConfig.videoUrl} poster={pilotConfig.videoPoster} title={pilotHero.videoTitle} />
          ) : (
            <VideoPlaceholder />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <ApplyButton where="hero" />
          <p className="text-sm text-white/60">{pilotHero.ctaNote}</p>
        </motion.div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-left text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
          {pilotProof.map((p) => (
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

function Steps() {
  return (
    <section aria-labelledby="steps-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <SectionHeading id="steps-title" eyebrow={pilotSteps.eyebrow} title={pilotSteps.title} sub={pilotSteps.sub} />
        <ol className="relative mt-16">
          <span aria-hidden className="bg-signal absolute top-2 bottom-2 left-[19px] w-px opacity-40 sm:left-1/2" />
          {pilotSteps.steps.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <Reveal as="li" key={s.title} delay={0.05 * i} className="relative grid grid-cols-[40px_1fr] gap-5 pb-12 last:pb-0 sm:grid-cols-[1fr_40px_1fr] sm:gap-8">
                <div className={`hidden sm:block ${right ? "" : "text-right"}`}>
                  {!right && <StepBody s={s} align="right" />}
                </div>
                <span className="bg-signal relative z-10 grid size-10 place-items-center rounded-full font-display text-sm font-bold text-white shadow-[var(--shadow-glow)] sm:row-start-1 sm:col-start-2">
                  {i + 1}
                </span>
                <div className="sm:hidden">
                  <StepBody s={s} align="left" />
                </div>
                <div className="hidden sm:block">{right && <StepBody s={s} align="left" />}</div>
              </Reveal>
            );
          })}
        </ol>
        <Reveal className="mt-16 text-center">
          <ApplyButton where="steps" />
        </Reveal>
      </div>
    </section>
  );
}

function StepBody({ s, align }: { s: (typeof pilotSteps.steps)[number]; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "sm:text-right" : ""}>
      <p className="label-mono text-violet-deep">{s.when}</p>
      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
    </div>
  );
}

/** Shown until pilotConfig.videoUrl is set. */
function VideoPlaceholder() {
  return (
    <div className="relative grid aspect-video place-items-center overflow-hidden rounded-[26px] border border-white/15 bg-white/[0.04] shadow-[0_40px_90px_-30px_rgba(40,14,90,0.7)] backdrop-blur-sm">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,82,242,0.25),transparent_65%)]" />
      <div className="relative flex flex-col items-center gap-4">
        <span className="bg-signal grid size-20 place-items-center rounded-full shadow-[var(--shadow-glow)] sm:size-24">
          <Play className="ml-1 size-8 fill-white text-white sm:size-10" aria-hidden />
        </span>
        <span className="label-mono text-white/60">{pilotHero.videoPlaceholder}</span>
      </div>
    </div>
  );
}

function Why() {
  return (
    <section aria-labelledby="why-title" className="px-4 py-10 sm:px-6 sm:py-16">
      <Reveal className="relative mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-ink/[0.06] bg-white px-6 py-12 shadow-[var(--shadow-glass)] sm:px-14 sm:py-16">
        <span aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
        <h2 id="why-title" className="text-signal font-display text-[2.2rem] leading-[1.05] font-bold tracking-[-0.035em] sm:text-5xl">
          {pilotWhy.heading}
        </h2>
        <p className="mt-4 font-display text-[1.45rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[1.75rem]">
          {pilotWhy.title}
        </p>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-[1.05rem]">
          {pilotWhy.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pilotAbout.image} alt="" className="size-12 rounded-full object-cover ring-2 ring-white" />
          <div>
            <p className="font-display text-xl font-semibold italic tracking-tight">{pilotWhy.signoff}</p>
            <p className="text-sm text-muted">{pilotAbout.role}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Fit() {
  return (
    <section aria-labelledby="fit-title" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="fit-title" eyebrow={pilotFit.eyebrow} title={pilotFit.title} />
        <div className="mt-14 grid gap-10 md:grid-cols-[1.25fr_1fr] md:gap-0 md:divide-x md:divide-ink/10">
          <Reveal className="md:pr-12">
            <h3 className="font-display text-xl font-semibold tracking-tight">{pilotFit.yesTitle}</h3>
            <ul className="mt-5 space-y-4">
              {pilotFit.yes.map((y) => (
                <li key={y} className="flex gap-3 text-lg leading-snug">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-green-deep/10">
                    <Check className="size-3.5 text-green-deep" strokeWidth={3} aria-hidden />
                  </span>
                  {y}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="md:pl-12">
            <h3 className="font-display text-xl font-semibold tracking-tight text-muted">{pilotFit.noTitle}</h3>
            <ul className="mt-5 space-y-4">
              {pilotFit.no.map((n) => (
                <li key={n} className="flex gap-3 text-lg leading-snug text-muted">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ink/[0.06]">
                    <X className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Risk() {
  return (
    <section aria-labelledby="risk-title" className="px-3 py-6 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-20 text-white sm:px-12 sm:py-24">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "coral", className: "-top-24 left-[5%] size-[360px]" },
            { color: "violet", className: "-bottom-24 right-[5%] size-[420px]", slow: true },
          ]}
          intensity={1.4}
        />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <CardHeading>{pilotRisk.heading}</CardHeading>
          <h2 id="risk-title" className="mt-4 text-[2rem] leading-[1.08] font-bold tracking-[-0.035em] sm:text-5xl sm:tracking-[-2px]">
            {pilotRisk.title}
          </h2>
        </Reveal>
        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
          {pilotRisk.items.map((it, i) => (
            <Reveal key={it.title} delay={0.06 * i} className="lg:px-7 lg:first:pl-0 lg:last:pr-0">
              <span className="text-signal font-display text-sm font-bold">0{i + 1}</span>
              <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{it.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="relative mt-14 text-center">
          <ApplyButton where="risk" />
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section aria-labelledby="about-title" className="px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="bg-signal shrink-0 rounded-full p-1 shadow-[var(--shadow-glow)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pilotAbout.image} alt={pilotAbout.name} className="size-36 rounded-full border-4 border-white object-cover" />
        </div>
        <div>
          <Eyebrow>{pilotAbout.eyebrow}</Eyebrow>
          <h2 id="about-title" className="mt-3 font-display text-3xl font-semibold tracking-tight">
            {pilotAbout.name}
            <span className="ml-2 text-base font-medium text-muted">{pilotAbout.role}</span>
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted">{pilotAbout.body}</p>
        </div>
      </Reveal>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <section aria-labelledby="pfaq-title" className="px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="pfaq-title" eyebrow={pilotFaq.eyebrow} title={pilotFaq.title} />
        <ul className="mt-12 divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
          {pilotFaq.items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <h3>
                  <button
                    id={`${base}-q${i}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-1 py-5 text-left font-display text-lg font-semibold tracking-tight sm:px-2"
                  >
                    {f.q}
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "bg-signal rotate-45 text-white" : "bg-ink/[0.06]"
                      }`}
                    >
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${base}-a${i}`}
                      role="region"
                      aria-labelledby={`${base}-q${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <div className="space-y-3 px-1 pb-6 leading-relaxed text-muted sm:px-2 sm:pr-16">
                        {f.a.split("\n\n").map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Apply() {
  return (
    <section aria-labelledby="apply-title" className="px-3 pb-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-24 text-center text-white sm:py-32">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "coral", className: "-top-20 left-[10%] size-[380px]" },
            { color: "violet", className: "-bottom-24 right-[5%] size-[460px]", slow: true },
          ]}
          intensity={1.6}
        />
        <Reveal className="relative">
          <h2 id="apply-title" className="mx-auto max-w-3xl text-[2.4rem] leading-[1.04] font-bold tracking-[-0.045em] sm:text-6xl sm:tracking-[-2.5px]">
            {pilotFinal.title} <span className="text-shimmer">{pilotFinal.highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{pilotFinal.sub}</p>
          <ApplyButton where="final" className="mt-10" />
        </Reveal>
      </div>
    </section>
  );
}
