"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { costChart } from "@/content/copy";
import { formatMoney, pricing } from "@/config";
import { Reveal } from "@/components/ui/Section";

/**
 * Cost comparison driven by a slider, so every number on screen is either the
 * visitor's own input or our published starting price. Nothing is invented.
 */
export function CostChart() {
  const [wage, setWage] = useState(48000);
  const ai = pricing.aiHireStartingAt;
  const max = 90000;
  const humanPct = Math.round((wage / max) * 100);
  const aiPct = ai ? Math.max(2.5, Math.round((ai / max) * 100)) : 4;

  return (
    <Reveal className="glass mt-6 rounded-[28px] p-6 sm:p-9">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-mono text-violet-deep">{costChart.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{costChart.title}</h3>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-muted">{costChart.sub}</p>

      <div className="mt-7 max-w-md">
        <label htmlFor="wage" className="mb-2 block text-sm font-semibold">
          {costChart.sliderLabel}
        </label>
        <input
          id="wage"
          type="range"
          min={25000}
          max={max}
          step={1000}
          value={wage}
          onChange={(e) => setWage(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-[#9452F2]"
        />
      </div>

      <div className="mt-9 space-y-6">
        {/* Human */}
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="font-semibold">{costChart.humanLabel}</span>
            <span className="font-display text-xl font-semibold tabular-nums sm:text-2xl">{formatMoney(wage)}</span>
          </div>
          <div className="h-10 overflow-hidden rounded-xl bg-ink/[0.06]">
            <motion.div
              className="h-full rounded-xl bg-ink/70"
              initial={false}
              animate={{ width: `${humanPct}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-1.5 text-sm text-muted">{costChart.humanSub}</p>
        </div>

        {/* AI */}
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="font-semibold">{costChart.aiLabel}</span>
            <span className="font-display text-xl font-semibold tabular-nums sm:text-2xl">
              {ai ? `from ${formatMoney(ai)}` : pricing.placeholder}
            </span>
          </div>
          <div className="h-10 overflow-hidden rounded-xl bg-ink/[0.06]">
            <motion.div
              className="bg-signal h-full rounded-xl shadow-[0_8px_24px_-10px_rgba(148,82,242,0.9)]"
              initial={false}
              animate={{ width: `${aiPct}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-1.5 text-sm text-muted">{costChart.aiSub}</p>
        </div>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-muted">{costChart.footnote}</p>
    </Reveal>
  );
}
