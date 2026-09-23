"use client";

import Link from "next/link";
import { ArrowRight, Check, Mail } from "lucide-react";
import { howItWorks } from "@/content/copy";
import { formatAiHirePrice } from "@/config";
import { StatusDot } from "@/components/ui/Decor";
import { Reveal, SectionHeading } from "@/components/ui/Section";
import { trackEvent } from "@/lib/analytics";

/** Small, specific illustration per step — a preview of what actually happens. */
function StepArt({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/[0.07]">
        <p className="label-mono text-muted">Question 2 of 6</p>
        <p className="mt-2 text-sm font-semibold">How do customers reach you?</p>
        <div className="mt-3 space-y-1.5">
          {["Phone calls", "Text messages", "Website form"].map((o, i) => (
            <div
              key={o}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${
                i < 2 ? "bg-signal text-white" : "bg-ink/[0.05] text-ink/70"
              }`}
            >
              {o}
              {i < 2 && <Check className="size-3" aria-hidden />}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/[0.07]">
        <div className="flex items-center gap-2 border-b border-ink/[0.07] pb-2">
          <Mail className="size-3.5 text-violet-deep" aria-hidden />
          <p className="label-mono truncate text-muted">AI Opportunity Report</p>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <span className="font-display text-4xl leading-none font-bold tracking-[-0.04em]">
            74<span className="text-signal">%</span>
          </span>
          <span className="pb-1 text-xs leading-tight text-muted">
            of this role
            <br />
            AI can handle
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
          <span className="bg-signal block h-full w-[74%] rounded-full" />
        </div>
        <div className="mt-3 space-y-1">
          {["Answer inbound calls", "Book appointments", "Chase open estimates"].map((t) => (
            <p key={t} className="flex items-center gap-1.5 text-[0.7rem] text-ink/70">
              <Check className="size-3 shrink-0 text-green-deep" aria-hidden />
              {t}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/[0.07]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-signal grid size-9 place-items-center rounded-xl font-display text-sm font-bold text-white">
            AI
          </span>
          <div className="min-w-0">
            <p className="label-mono text-muted">Your newest hire</p>
            <p className="truncate text-sm font-semibold">AI Receptionist</p>
          </div>
        </div>
        <StatusDot />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          { l: "Hours", v: "24/7" },
          { l: "Sick days", v: "0" },
          { l: "Starts at", v: formatAiHirePrice() },
        ].map((s) => (
          <div key={s.l} className="rounded-lg bg-mist px-2 py-1.5 text-center">
            <p className="label-mono text-[0.55rem] text-muted">{s.l}</p>
            <p className="font-display text-sm font-semibold">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {howItWorks.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="glass flex flex-col rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <span className="label-mono grid size-8 shrink-0 place-items-center rounded-full bg-ink text-[0.7rem] text-white">
                  {i + 1}
                </span>
                <span aria-hidden className="bg-signal h-px flex-1 opacity-30" />
              </div>
              <h3 className="mt-5 text-lg leading-snug font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 mb-6 flex-1 text-[0.95rem] leading-relaxed text-muted">{s.body}</p>
              <StepArt index={i} />
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12 text-center">
          <Link
            href="/assessment"
            onClick={() => trackEvent("cta_clicked", { cta: "how_it_works" })}
            className="btn btn-primary px-8 py-4 text-base"
          >
            {howItWorks.cta} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
