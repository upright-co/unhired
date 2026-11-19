"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Download, Mail } from "lucide-react";
import {
  ccAiJobs,
  ccApp,
  ccCerts,
  ccFinal,
  ccHero,
  ccHospitalityJobs,
  ccIdeas,
  ccMatch,
  ccOffer,
  ccSummary,
  ccTools,
  type Job,
} from "@/content/cactus-club";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Eyebrow, Reveal } from "@/components/ui/Section";
import { VideoFrame } from "@/components/pilot/VideoFrame";
import { trackEvent } from "@/lib/analytics";

const ease = [0.22, 1, 0.36, 1] as const;

function EmailButton({ where, className = "" }: { where: string; className?: string }) {
  return (
    <a
      href={`mailto:${ccApp.email}?subject=${encodeURIComponent("AI & Workflow Automation Analyst")}`}
      onClick={() => trackEvent("cta_clicked", { cta: `cactus_${where}` })}
      className={`btn btn-primary px-8 py-4 text-base ${className}`}
    >
      <Mail className="size-4" aria-hidden /> Email me <ArrowRight className="size-4" aria-hidden />
    </a>
  );
}

function PdfLink({ href, label, dark = false }: { href: string; label: string; dark?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
        dark ? "border-white/20 text-white/90 hover:bg-white/10" : "border-ink/15 text-ink hover:bg-ink/[0.04]"
      }`}
    >
      <Download className="size-4" aria-hidden /> {label}
    </a>
  );
}

export function ApplicationPage() {
  return (
    <main id="main">
      <Hero />
      <Summary />
      <Match />
      <Experience />
      <Ideas />
      <Offer />
      <Skills />
      <Final />
    </main>
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
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="label-mono text-white/70"
        >
          {ccHero.kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="mx-auto mt-5 max-w-4xl text-[2.25rem] leading-[1.06] font-bold tracking-[-0.04em] sm:text-6xl sm:tracking-[-2.5px]"
        >
          {ccHero.headlineBefore} <br className="hidden sm:block" />
          <span className="text-shimmer-light">{ccHero.headlineHighlight}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl"
        >
          {ccHero.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <VideoFrame url={ccApp.video} poster={ccApp.poster} title={ccHero.videoTitle} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <EmailButton where="hero" />
          <PdfLink href={ccApp.resumePdf} label="Resume (PDF)" dark />
          <PdfLink href={ccApp.letterPdf} label="Cover letter (PDF)" dark />
        </motion.div>

        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-left text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
          {ccHero.facts.map((p) => (
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

function Summary() {
  return (
    <section aria-labelledby="who-title" className="px-4 pt-20 pb-10 sm:px-6 sm:pt-28">
      <Reveal className="mx-auto flex max-w-4xl flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
        <div className="bg-signal shrink-0 self-center rounded-full p-1 shadow-[var(--shadow-glow)] sm:self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ccApp.photo} alt={ccSummary.name} className="size-32 rounded-full border-4 border-white object-cover sm:size-40" />
        </div>
        <div>
          <Eyebrow>Resume</Eyebrow>
          <h2 id="who-title" className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {ccSummary.name}
          </h2>
          <p className="mt-2 text-lg font-medium text-muted">{ccSummary.role} · 14 years hospitality · 5 years AI</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {ccSummary.contact.map((c) => (
              <li key={c.label}>
                <span className="font-semibold">{c.label}</span>{" "}
                <a href={c.href} className="text-violet-deep underline-offset-4 hover:underline">
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg leading-relaxed text-ink/85">{ccSummary.body}</p>
        </div>
      </Reveal>
    </section>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <h2 id={id} className="flex items-center gap-4 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        <span aria-hidden className="bg-signal h-1 w-8 shrink-0 rounded-full" />
        {children}
      </h2>
    </Reveal>
  );
}

function Match() {
  return (
    <section aria-labelledby="match-title" className="px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <SectionTitle id="match-title">{ccMatch.eyebrow}</SectionTitle>
        <dl className="mt-8 divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
          {ccMatch.rows.map((r, i) => (
            <Reveal key={r.k} delay={0.04 * i} className="grid gap-2 py-6 sm:grid-cols-[230px_1fr] sm:gap-10">
              <dt>
                <p className="font-display text-lg font-semibold tracking-tight">{r.k}</p>
                <p className="mt-1 text-sm text-muted">{r.tag}</p>
              </dt>
              <dd className="leading-relaxed text-ink/85">{r.v}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <ol className="relative mt-8 space-y-10 border-l border-ink/10 pl-7 sm:pl-9">
      {jobs.map((j, i) => (
        <Reveal as="li" key={j.title + j.when} delay={0.05 * i} className="relative">
          <span aria-hidden className="bg-signal absolute top-2 -left-[35px] size-3 rounded-full ring-4 ring-mist sm:-left-[43px]" />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-xl font-semibold tracking-tight">
              {j.title}
              {j.where && <span className="text-violet-deep"> · {j.where}</span>}
            </h3>
            <span className="label-mono text-muted">{j.when}</span>
          </div>
          {j.sub && <p className="mt-1 text-muted">{j.sub}</p>}
          {j.points.length > 0 && (
            <ul className="mt-3 space-y-2">
              {j.points.map((p) => (
                <li key={p} className="flex gap-3 leading-relaxed text-ink/85">
                  <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-violet" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </ol>
  );
}

function Experience() {
  return (
    <section aria-labelledby="exp-title" className="px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-4xl gap-16">
        <div>
          <SectionTitle id="exp-title">AI and automation experience</SectionTitle>
          <JobList jobs={ccAiJobs} />
        </div>
        <div>
          <SectionTitle id="hosp-title">Hospitality experience</SectionTitle>
          <JobList jobs={ccHospitalityJobs} />
        </div>
      </div>
    </section>
  );
}

function Ideas() {
  return (
    <section aria-labelledby="ideas-title" className="px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <SectionTitle id="ideas-title">{ccIdeas.eyebrow}</SectionTitle>
        <ol className="mt-8 grid gap-x-12 sm:grid-cols-2">
          {ccIdeas.items.map((it, i) => (
            <Reveal as="li" key={it.t} delay={0.04 * (i % 2)} className="flex gap-4 border-t border-ink/[0.08] py-6">
              <span className="text-signal font-display text-sm font-bold">0{i + 1}</span>
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">{it.t}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{it.b}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal>
          <p className="mt-4 border-t border-ink/[0.08] pt-5 text-sm leading-relaxed text-muted italic">{ccIdeas.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Offer() {
  return (
    <section aria-labelledby="offer-title" className="px-3 py-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-16 text-white sm:px-12 sm:py-20">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "coral", className: "-top-24 left-[5%] size-[360px]" },
            { color: "violet", className: "-bottom-24 right-[5%] size-[420px]", slow: true },
          ]}
          intensity={1.4}
        />
        <div className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <Reveal>
            <Eyebrow dark>{ccOffer.eyebrow}</Eyebrow>
            <p className="mt-6 font-display text-7xl leading-none font-bold tracking-[-0.04em] sm:text-8xl">
              <span className="text-shimmer-light">{ccOffer.price}</span>
            </p>
            <p className="mt-3 font-display text-2xl font-semibold tracking-tight">
              {ccOffer.per} <span className="text-base font-normal text-white/60 italic">({ccOffer.fine})</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{ccOffer.compare}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="offer-title" className="text-[1.9rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-4xl">
              {ccOffer.title}
            </h2>
            <p className="mt-5 leading-relaxed text-white/75">{ccOffer.body}</p>
            <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
              {ccOffer.points.map((p) => (
                <li key={p.t} className="flex gap-3">
                  <span className="bg-signal mt-1 grid size-5 shrink-0 place-items-center rounded-full">
                    <Check className="size-3 text-white" strokeWidth={4} aria-hidden />
                  </span>
                  <p className="leading-relaxed text-white/75">
                    <span className="font-semibold text-white">{p.t}.</span> {p.b}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section aria-labelledby="certs-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-4xl gap-14 md:grid-cols-2 md:gap-12">
        <div>
          <SectionTitle id="certs-title">Certifications</SectionTitle>
          <dl className="mt-8 divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
            {ccCerts.map((c) => (
              <div key={c.k} className="grid grid-cols-[140px_1fr] gap-4 py-3.5">
                <dt className="font-semibold">{c.k}</dt>
                <dd className="text-muted">{c.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <SectionTitle id="tools-title">Tools I build with</SectionTitle>
          <Reveal>
            <ul className="mt-8 flex flex-wrap gap-2">
              {ccTools.map((t) => (
                <li key={t} className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-medium">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
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
          <h2 id="final-title" className="text-[2.6rem] leading-[1.04] font-bold tracking-[-0.045em] sm:text-7xl sm:tracking-[-2.5px]">
            {ccFinal.title} <span className="text-shimmer">{ccFinal.highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{ccFinal.sub}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <EmailButton where="final" />
            <PdfLink href={ccApp.resumePdf} label="Resume (PDF)" dark />
          </div>
          <p className="mt-6 text-sm text-white/60">{ccApp.email}</p>
        </Reveal>
      </div>
    </section>
  );
}
