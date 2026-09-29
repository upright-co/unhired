"use client";

import { motion } from "framer-motion";
import { whatIsAiEmployee as copy } from "@/content/copy";
import { Icon } from "@/components/ui/Icon";
import { StatusDot } from "@/components/ui/Decor";
import { Eyebrow, Reveal } from "@/components/ui/Section";

/**
 * Radial diagram: the AI Employee at the hub, and the five things that make it
 * an employee rather than a chat window arranged around it like an org chart
 * folded into a circle. Positions are percentages of a square, so it scales.
 */
const RADIUS = 38;
const positions = copy.diagram.nodes.map((_, i, all) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / all.length;
  return { x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) };
});

function RadialDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      {/* Connectors + orbit ring */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="spoke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F65663" />
            <stop offset="1" stopColor="#9452F2" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="url(#spoke)"
          strokeWidth="0.35"
          strokeDasharray="1.2 2.2"
          opacity="0.5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50% 50%" }}
        />
        {positions.map((p, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="50"
            x2={p.x}
            y2={p.y}
            stroke="url(#spoke)"
            strokeWidth="0.45"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>

      {/* Hub */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex w-[42%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="bg-signal grid size-[4.5rem] place-items-center rounded-full font-display text-2xl font-bold text-white shadow-[0_18px_40px_-14px_rgba(148,82,242,0.9)] ring-4 ring-white sm:size-20 sm:text-3xl">
          AI
        </span>
        <p className="label-mono mt-3 text-[0.6rem] text-muted sm:text-[0.65rem]">{copy.diagram.center}</p>
        <p className="font-display text-base font-semibold tracking-tight sm:text-lg">{copy.diagram.centerSub}</p>
        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-signal-green/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-green-deep">
          <StatusDot /> {copy.diagram.status}
        </span>
      </motion.div>

      {/* Spokes */}
      {copy.diagram.nodes.map((n, i) => {
        const p = positions[i];
        return (
          <motion.div
            key={n.label}
            className="absolute flex w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="grid size-11 place-items-center rounded-full bg-white text-violet-deep shadow-[0_10px_30px_-12px_rgba(94,44,180,0.45)] ring-1 ring-violet/20 sm:size-12">
              <Icon name={n.icon} className="size-5" />
            </span>
            <span className="mt-2 text-[0.8rem] leading-tight font-semibold sm:text-sm">{n.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function WhatIsAiEmployee() {
  return (
    <section id="what-is" aria-labelledby="what-is-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
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

          {/* Legend for the diagram: what each spoke means, as plain lines. */}
          <dl className="mt-8 space-y-3 border-l-2 border-violet/20 pl-5">
            {copy.diagram.nodes.map((n) => (
              <div key={n.label} className="grid gap-x-3 gap-y-0.5 sm:grid-cols-[auto_1fr] sm:items-baseline">
                <dt className="flex items-center gap-2 font-semibold">
                  <Icon name={n.icon} className="size-4 text-violet-deep" />
                  {n.label}
                </dt>
                <dd className="text-[0.95rem] leading-snug text-muted">{n.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <RadialDiagram />
        </Reveal>
      </div>
    </section>
  );
}
