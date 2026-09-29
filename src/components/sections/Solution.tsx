"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { solution } from "@/content/copy";
import { StatusDot } from "@/components/ui/Decor";
import { Reveal, SectionHeading } from "@/components/ui/Section";

/** A day on shift, drawn as a log: time on the left, a spine, the event on the right. */
function ShiftLog() {
  return (
    <div>
      <p className="label-mono flex items-center gap-2 text-violet-deep">
        <StatusDot /> {solution.shiftTitle}
      </p>
      <ol className="relative mt-6">
        <span aria-hidden className="bg-signal absolute top-2 bottom-2 left-[5.4rem] w-0.5 opacity-40 sm:left-[6.2rem]" />
        {solution.shift.map((s, i) => (
          <motion.li
            key={s.time}
            className="relative grid grid-cols-[4.6rem_auto_1fr] items-start gap-x-3 py-3 sm:grid-cols-[5.4rem_auto_1fr]"
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-mono pt-1 text-right text-[0.65rem] text-muted tabular-nums sm:text-xs">{s.time}</span>
            <span className="relative mt-1.5 grid size-4 place-items-center">
              <span className="bg-signal size-2.5 rounded-full ring-4 ring-mist" />
            </span>
            <span className="text-[0.95rem] leading-relaxed">{s.event}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function Solution() {
  return (
    <section id="solution" aria-labelledby="solution-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="solution-title" eyebrow={solution.eyebrow} title={solution.title} sub={solution.sub} />

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <ShiftLog />
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="divide-y divide-ink/[0.07]">
              {solution.benefits.map((b) => {
                const [first, ...rest] = b.split(". ");
                const lead = first.replace(/\.$/, "");
                return (
                  <li key={b} className="flex items-start gap-3 py-3.5">
                    <span className="bg-signal mt-1 grid size-5 shrink-0 place-items-center rounded-full text-white">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    <p className="leading-relaxed">
                      <span className="font-semibold">{lead}.</span>
                      {rest.length > 0 && <span className="text-muted"> {rest.join(". ")}</span>}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
