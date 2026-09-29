"use client";

import { motion } from "framer-motion";
import { guarantee } from "@/content/copy";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow, Reveal } from "@/components/ui/Section";

/** Two bars: what a person costs, and the ceiling the guarantee puts on the AI Employee. */
function GuaranteeBars() {
  const pct = guarantee.percent;
  const labels = guarantee.chartLabels;
  return (
    <div className="space-y-7">
      <div>
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-white/70">{labels.human}</span>
          <span className="font-display font-semibold text-white">100%</span>
        </div>
        <div className="h-12 rounded-xl bg-white/10">
          <motion.div
            className="h-full rounded-xl bg-white/25"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-white/70">{labels.ai}</span>
          <span className="font-display font-semibold text-white">≤ {100 - pct}%</span>
        </div>
        <div className="relative h-12 rounded-xl bg-white/10">
          <motion.div
            className="bg-signal h-full rounded-xl shadow-[0_10px_30px_-10px_rgba(246,86,99,0.8)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${100 - pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Bracket over the saved half */}
          <motion.div
            className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center justify-center border-l border-dashed border-white/40 pl-3 text-center"
            style={{ width: `${pct}%` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <span className="text-xs font-semibold text-white sm:text-sm">
              {labels.saved} <span className="text-shimmer whitespace-nowrap">{pct}%+</span>
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function Guarantee() {
  return (
    <section id="guarantee" aria-labelledby="guarantee-title" className="px-3 py-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-16 text-white sm:px-12 sm:py-24">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "violet", className: "-top-32 -right-24 size-[460px]", slow: true },
            { color: "coral", className: "-bottom-32 -left-20 size-[380px]" },
          ]}
          intensity={1.3}
        />

        <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <Eyebrow dark>{guarantee.eyebrow}</Eyebrow>
            <p className="mt-6 font-display text-[6rem] leading-none font-bold tracking-[-0.06em] sm:text-[8rem]">
              <span className="text-shimmer">{guarantee.percent}%</span>
            </p>
            <h2
              id="guarantee-title"
              className="mt-4 text-[1.9rem] leading-[1.1] font-semibold tracking-[-0.035em] sm:text-4xl sm:tracking-[-1.5px]"
            >
              {guarantee.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">{guarantee.sub}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <GuaranteeBars />
          </Reveal>
        </div>

        {/* We build it, we train it, we maintain it: one row, divided by rules, no boxes. */}
        <div className="relative mt-16 border-t border-white/10 pt-12 sm:mt-20">
          <Reveal>
            <h3 className="text-center font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {guarantee.promisesTitle}
            </h3>
          </Reveal>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
            {guarantee.promises.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.1} className="md:px-8 first:md:pl-0 last:md:pr-0">
                <div className="flex items-center gap-3">
                  <span className="bg-signal grid size-11 shrink-0 place-items-center rounded-full text-white">
                    <Icon name={p.icon} />
                  </span>
                  <span className="label-mono text-white/50">0{i + 1}</span>
                </div>
                <h4 className="mt-4 text-xl font-semibold tracking-tight">{p.title}</h4>
                <p className="mt-2 leading-relaxed text-white/70">{p.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
