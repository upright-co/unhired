"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/content/copy";
import { GlowOrbs, GridBackground, StatusDot } from "@/components/ui/Decor";
import { trackEvent } from "@/lib/analytics";
import { HeroCard } from "./HeroCard";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
      <GridBackground />
      <GlowOrbs
        orbs={[
          { color: "coral", className: "-top-24 -left-24 size-[420px]" },
          { color: "violet", className: "top-20 -right-32 size-[520px]", slow: true },
          { color: "violet", className: "bottom-0 left-1/3 size-[300px] opacity-20" },
        ]}
        fade
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 text-sm font-medium text-muted"
          >
            <StatusDot />
            {hero.pill}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="mt-6 text-[2.9rem] leading-[1.02] font-bold tracking-[-0.045em] sm:text-7xl sm:tracking-[-3px] lg:text-[5.2rem]"
          >
            {hero.headlineBefore} <span className="text-shimmer">{hero.headlineHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#assessment"
              onClick={() => trackEvent("cta_clicked", { cta: "hero_primary" })}
              className="btn btn-primary px-7 py-4 text-base"
            >
              {hero.primaryCta} <ArrowRight className="size-4" aria-hidden />
            </a>
            <a
              href="#how-it-works"
              onClick={() => trackEvent("cta_clicked", { cta: "hero_secondary" })}
              className="btn btn-secondary px-7 py-4 text-base"
            >
              {hero.secondaryCta}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          <HeroCard />
        </motion.div>
      </div>
    </section>
  );
}
