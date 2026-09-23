"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { hero } from "@/content/copy";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { trackEvent } from "@/lib/analytics";
import { JobBoard } from "./JobBoard";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 lg:pb-28">
      <GridBackground />
      <GlowOrbs
        orbs={[
          { color: "coral", className: "-top-24 -left-24 size-[420px]" },
          { color: "violet", className: "top-20 -right-32 size-[520px]", slow: true },
          { color: "violet", className: "bottom-0 left-1/3 size-[300px] opacity-20" },
        ]}
        fade
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_minmax(0,1.05fr)]">
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-[2.9rem] leading-[1.02] font-bold tracking-[-0.045em] sm:text-6xl sm:tracking-[-2.5px] lg:text-[4.4rem]"
          >
            {hero.headlineBefore} <span className="text-shimmer">{hero.headlineHighlight}</span>{" "}
            {hero.headlineAfter}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="mt-9"
          >
            <Link
              href="/assessment"
              onClick={() => trackEvent("cta_clicked", { cta: "hero_primary" })}
              className="btn btn-primary px-8 py-4 text-base"
            >
              {hero.primaryCta} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          <JobBoard />
        </motion.div>
      </div>
    </section>
  );
}
