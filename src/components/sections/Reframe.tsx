"use client";

import { motion } from "framer-motion";
import { reframe } from "@/content/copy";
import { Eyebrow, Reveal } from "@/components/ui/Section";

export function Reframe() {
  return (
    <section aria-labelledby="reframe-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>{reframe.eyebrow}</Eyebrow>
          <h2
            id="reframe-title"
            className="mt-4 text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] sm:text-5xl sm:tracking-[-2px]"
          >
            {reframe.title}
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
            {reframe.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="glass rounded-[28px] p-6 sm:p-8">
            <div className="rounded-2xl border border-dashed border-ink/15 bg-white/40 p-5">
              <p className="label-mono text-muted">Wrong question</p>
              <p className="mt-2 font-display text-xl font-semibold text-ink/45 line-through decoration-coral decoration-2 sm:text-2xl">
                {reframe.wrongQuestion}
              </p>
            </div>
            <div className="relative mt-3 overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_30px_-18px_rgba(94,44,180,0.5)] ring-1 ring-violet/20">
              <div aria-hidden className="bg-signal absolute inset-y-0 left-0 w-1" />
              <p className="label-mono text-violet-deep">Right question</p>
              <p className="mt-2 font-display text-xl font-semibold sm:text-2xl">{reframe.rightQuestion}</p>
            </div>
            <p className="label-mono mt-6 text-muted">If the answer is mostly…</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {reframe.verbs.map((v, i) => (
                <motion.li
                  key={v}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                  className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium ring-1 ring-ink/10"
                >
                  {v}
                </motion.li>
              ))}
            </ul>
            <p className="mt-5 font-display text-lg font-semibold">
              …an <span className="text-signal">AI hire</span> can do it.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
