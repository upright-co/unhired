"use client";

import { motion } from "framer-motion";
import { PhoneMissed } from "lucide-react";
import { problem } from "@/content/copy";
import { Reveal, SectionHeading } from "@/components/ui/Section";

/**
 * The hiring journey as a timeline. Horizontal on large screens with the
 * milestones alternating above and below the line, a vertical spine on small
 * ones. No cards: the line and the markers carry the structure.
 */
function HiringTimeline() {
  const items = problem.timeline;
  return (
    <div className="mt-14">
      {/* Large screens */}
      <div className="relative hidden lg:block">
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2"
          style={{ background: "linear-gradient(90deg, rgba(14,11,31,0.12), #F65663 60%, #9452F2)" }}
        />
        <ol className="relative grid grid-cols-5">
          {items.map((m, i) => {
            const above = i % 2 === 0;
            return (
              <li key={m.title} className="grid min-h-[300px] grid-rows-[1fr_auto_1fr] px-3">
                <Reveal delay={i * 0.1} className={`flex flex-col justify-end pb-6 text-center ${above ? "" : "invisible"}`}>
                  <Milestone m={m} />
                </Reveal>
                <div className="flex items-center justify-center">
                  <Marker index={i} />
                </div>
                <Reveal delay={i * 0.1} className={`pt-6 text-center ${above ? "invisible" : ""}`}>
                  <Milestone m={m} />
                </Reveal>
              </li>
            );
          })}
        </ol>
        <Reveal className="mt-2 flex items-center justify-end gap-2 text-sm font-medium text-coral-deep">
          <PhoneMissed className="size-4" aria-hidden />
          The whole time, the phone keeps ringing.
        </Reveal>
      </div>

      {/* Small screens */}
      <ol className="relative space-y-8 border-l-2 border-ink/10 pl-8 lg:hidden">
        {items.map((m, i) => (
          <Reveal as="li" key={m.title} delay={i * 0.06} className="relative">
            <span className="absolute -left-[2.45rem] top-0.5">
              <Marker index={i} />
            </span>
            <Milestone m={m} align="left" />
          </Reveal>
        ))}
        <li className="relative flex items-center gap-2 text-sm font-medium text-coral-deep">
          <span className="absolute -left-[2.2rem] top-0.5 grid size-6 place-items-center rounded-full bg-coral/10">
            <PhoneMissed className="size-3.5" aria-hidden />
          </span>
          The whole time, the phone keeps ringing.
        </li>
      </ol>
    </div>
  );
}

function Marker({ index }: { index: number }) {
  const last = index === problem.timeline.length - 1;
  return (
    <motion.span
      className={`relative grid size-9 place-items-center rounded-full font-display text-sm font-bold text-white ring-4 ring-mist ${
        last ? "bg-coral" : "bg-ink"
      }`}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay: index * 0.1 }}
    >
      {index + 1}
    </motion.span>
  );
}

function Milestone({ m, align = "center" }: { m: (typeof problem.timeline)[number]; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[220px]" : ""}>
      <p className="label-mono text-violet-deep">{m.when}</p>
      <h3 className="mt-1.5 text-base leading-snug font-semibold tracking-tight">{m.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.body}</p>
    </div>
  );
}

/** Stack: salary is the wide base, and every extra cost is a layer piled on top. */
const isBaseOf = (i: number) => i === 0;
function CostStack() {
  const items = problem.costStack.items;
  const n = items.length;
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{problem.costStack.title}</h3>
      <ol className="mt-6 flex flex-col-reverse gap-1.5" aria-label="What sits on top of a salary">
        {items.map((label, i) => {
          // Salary is the wide base; every extra sits on top as a narrower layer.
          const width = isBaseOf(i) ? 100 : 72 - ((i - 1) / (n - 2)) * 44;
          const isBase = isBaseOf(i);
          return (
            <motion.li
              key={label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <span
                aria-hidden
                className={`h-7 shrink-0 rounded-md ${isBase ? "bg-ink" : ""}`}
                style={{
                  width: `${width * 0.42}%`,
                  background: isBase ? undefined : `rgba(148, 82, 242, ${0.18 + (i / n) * 0.55})`,
                }}
              />
              <span className={`text-[0.95rem] ${isBase ? "font-semibold" : "text-muted"}`}>{label}</span>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="problem-title" eyebrow={problem.eyebrow} title={problem.title} sub={problem.sub} />

        <HiringTimeline />

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <CostStack />
          </Reveal>
          <Reveal delay={0.1} className="text-center lg:text-left">
            <p className="font-display text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              <span className="text-signal">{problem.tagline}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
