"use client";

import { ArrowRight } from "lucide-react";
import { finalCta } from "@/content/copy";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Section";
import { trackEvent } from "@/lib/analytics";

export function FinalCta() {
  const words = finalCta.title.split(" ");
  const last = words.pop();
  return (
    <section aria-labelledby="final-title" className="px-3 py-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-24 text-center text-white sm:py-32">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "coral", className: "-top-20 left-[10%] size-[360px]" },
            { color: "violet", className: "-bottom-24 right-[5%] size-[420px]", slow: true },
          ]}
          intensity={1.6}
        />
        <Reveal className="relative">
          <h2
            id="final-title"
            className="mx-auto max-w-3xl text-[2.6rem] leading-[1.03] font-bold tracking-[-0.045em] sm:text-7xl sm:tracking-[-3px]"
          >
            {words.join(" ")} <span className="text-shimmer">{last}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">{finalCta.sub}</p>
          <a
            href="#assessment"
            onClick={() => trackEvent("cta_clicked", { cta: "final_cta" })}
            className="btn btn-primary mt-10 px-8 py-4 text-base"
          >
            {finalCta.cta} <ArrowRight className="size-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
