"use client";

import { motion } from "framer-motion";
import { whatIsAiEmployee as copy } from "@/content/copy";
import { Icon } from "@/components/ui/Icon";
import { StatusDot } from "@/components/ui/Decor";
import { Eyebrow, Reveal } from "@/components/ui/Section";

/**
 * Diagram: the AI hire at the centre, with the things that make it an employee
 * rather than a chat window attached around it.
 */
function EmployeeDiagram() {
  return (
    <div className="glass rounded-[28px] p-5 sm:p-7">
      {/* The hire */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-violet/20">
        <div aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-signal grid size-11 place-items-center rounded-2xl font-display text-lg font-bold text-white">
              AI
            </span>
            <div>
              <p className="label-mono text-muted">{copy.diagram.center}</p>
              <p className="font-display text-lg font-semibold tracking-tight">{copy.diagram.centerSub}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-signal-green/10 px-3 py-1 text-xs font-semibold text-green-deep">
            <StatusDot /> On shift
          </span>
        </div>
      </div>

      {/* Connector */}
      <div aria-hidden className="relative mx-auto h-6 w-px">
        <span className="bg-signal absolute inset-0 opacity-40" />
      </div>

      {/* What it's made of */}
      <ul className="space-y-2">
        {copy.diagram.nodes.map((n, i) => (
          <motion.li
            key={n.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-ink/5"
          >
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-coral/15 to-violet/20 text-violet-deep">
              <Icon name={n.icon} className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{n.label}</span>
              <span className="block text-sm leading-snug text-muted">{n.detail}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function WhatIsAiEmployee() {
  return (
    <section id="what-is" aria-labelledby="what-is-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2
            id="what-is-title"
            className="mt-4 text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] sm:text-5xl sm:tracking-[-2px]"
          >
            {copy.title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            {copy.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <EmployeeDiagram />
        </Reveal>
      </div>
    </section>
  );
}
