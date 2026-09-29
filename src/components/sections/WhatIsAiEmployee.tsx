"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { whatIsAiEmployee as copy } from "@/content/copy";
import { Icon } from "@/components/ui/Icon";
import { StatusDot } from "@/components/ui/Decor";
import { Eyebrow, Reveal } from "@/components/ui/Section";

const ease = [0.22, 1, 0.36, 1] as const;

/** One labelled line in the employee file. */
function Row({ label, index, children }: { label: string; index: number; children: React.ReactNode }) {
  return (
    <motion.div
      className="grid gap-2 border-t border-ink/[0.07] px-5 py-4 sm:grid-cols-[7.4rem_minmax(0,1fr)] sm:gap-4 sm:px-7"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.08, ease }}
    >
      <dt className="label-mono pt-0.5 text-[0.65rem] text-muted">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </motion.div>
  );
}

/**
 * An AI Employee shown the way a real employee shows up in HR software: a
 * profile with a title, responsibilities, the tools it uses, what it knows,
 * and a log of what it did. Every field maps to what makes it an employee
 * rather than a chat window.
 */
function EmployeeFile() {
  const p = copy.profile;
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[48px] bg-gradient-to-br from-coral/25 via-violet/20 to-transparent opacity-70 blur-3xl"
      />
      {/* A second file behind it, for depth */}
      <div aria-hidden className="absolute inset-x-8 -bottom-3 top-8 rounded-[28px] bg-white/70 ring-1 ring-ink/[0.05]" />

      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-40px_rgba(94,44,180,0.45)] ring-1 ring-ink/[0.06]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6">
          <p className="label-mono text-[0.65rem] text-muted">{p.label}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-green/10 px-2.5 py-1 text-xs font-semibold text-green-deep">
            <StatusDot /> {p.status}
          </span>
        </div>
        <div className="flex items-center gap-4 px-5 pt-4 pb-5 sm:px-7 sm:pb-6">
          <Image
            src={p.avatar}
            alt={p.avatarAlt}
            width={144}
            height={144}
            className="size-[4.5rem] shrink-0 rounded-2xl object-cover shadow-[0_14px_30px_-14px_rgba(148,82,242,0.7)] ring-1 ring-violet/15 sm:size-20"
          />
          <div className="min-w-0">
            <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{p.name}</p>
            <p className="text-sm text-muted">{p.subtitle}</p>
          </div>
        </div>

        <dl>
          <Row label={p.role.label} index={0}>
            <p className="font-semibold">{p.role.value}</p>
            <p className="text-sm text-muted">{p.role.detail}</p>
          </Row>

          <Row label={p.responsibilities.label} index={1}>
            <ul className="space-y-1.5">
              {p.responsibilities.items.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[0.95rem]">
                  <Check className="mt-1 size-3.5 shrink-0 text-green-deep" strokeWidth={3} aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </Row>

          <Row label={p.tools.label} index={2}>
            <ul className="flex flex-wrap gap-1.5">
              {p.tools.items.map((t) => (
                <li
                  key={t.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-sm font-medium ring-1 ring-ink/[0.06]"
                >
                  <Icon name={t.icon} className="size-3.5 text-violet-deep" />
                  {t.label}
                </li>
              ))}
            </ul>
          </Row>

          <Row label={p.knowledge.label} index={3}>
            <ul className="space-y-1 text-[0.95rem]">
              {p.knowledge.items.map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <span aria-hidden className="bg-signal size-1.5 shrink-0 rounded-full" />
                  {k}
                </li>
              ))}
            </ul>
          </Row>

          <Row label={p.accountability.label} index={4}>
            <ul className="space-y-2">
              {p.accountability.log.map((e) => (
                <li key={e.time} className="grid grid-cols-[4.2rem_minmax(0,1fr)] items-baseline gap-2 text-sm">
                  <span className="label-mono text-[0.65rem] text-muted tabular-nums">{e.time}</span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {e.text}
                    {e.flag && (
                      <span className="inline-flex rounded-full bg-coral/10 px-2 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap text-coral-deep">
                        {p.accountability.flagLabel}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Row>
        </dl>

        {/* Footer */}
        <div className="flex items-center gap-2.5 border-t border-ink/[0.07] bg-mist/80 px-5 py-4 text-sm font-semibold sm:px-7">
          <span className="bg-signal grid size-5 shrink-0 place-items-center rounded-full text-white">
            <Check className="size-3" strokeWidth={3} aria-hidden />
          </span>
          {p.footer}
        </div>
      </div>
    </div>
  );
}

export function WhatIsAiEmployee() {
  return (
    <section id="what-is" aria-labelledby="what-is-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2
            id="what-is-title"
            className="mt-4 text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] sm:text-5xl sm:tracking-[-2px]"
          >
            {copy.title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            {copy.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <EmployeeFile />
        </Reveal>
      </div>
    </section>
  );
}
