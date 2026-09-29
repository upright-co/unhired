"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { costChart } from "@/content/copy";
import { formatMoney, guarantee } from "@/config";
import { Reveal } from "@/components/ui/Section";

/**
 * Savings calculator. Every number on screen is the visitor's own input or the
 * published guarantee applied to it. Nothing is invented.
 */
export function CostChart() {
  const [wage, setWage] = useState(48000);
  const pct = guarantee.salarySavingsPercent;
  const max = 120000;
  const aiMax = Math.round((wage * (100 - pct)) / 100);
  const saved = wage - aiMax;
  const humanPct = Math.round((wage / max) * 100);
  const aiPct = Math.round((aiMax / max) * 100);

  return (
    <Reveal className="mt-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <p className="label-mono text-violet-deep">{costChart.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{costChart.title}</h3>
          <p className="mt-3 text-muted">{costChart.sub}</p>

          <div className="mt-7">
            <label htmlFor="wage" className="mb-2 flex items-baseline justify-between text-sm font-semibold">
              {costChart.sliderLabel}
              <span className="font-display text-lg tabular-nums">{formatMoney(wage)}</span>
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
          <p className="mt-6 text-sm leading-relaxed text-muted">{costChart.footnote}</p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="font-semibold">{costChart.humanLabel}</span>
              <span className="font-display text-xl font-semibold tabular-nums sm:text-2xl">{formatMoney(wage)}</span>
            </div>
            <div className="h-11 overflow-hidden rounded-xl bg-ink/[0.06]">
              <motion.div
                className="h-full rounded-xl bg-ink/70"
                initial={false}
                animate={{ width: `${humanPct}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="mt-1.5 text-sm text-muted">{costChart.humanSub}</p>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="font-semibold">{costChart.aiLabel}</span>
              <span className="font-display text-xl font-semibold tabular-nums sm:text-2xl">
                ≤ {formatMoney(aiMax)}
              </span>
            </div>
            <div className="h-11 overflow-hidden rounded-xl bg-ink/[0.06]">
              <motion.div
                className="bg-signal h-full rounded-xl shadow-[0_8px_24px_-10px_rgba(148,82,242,0.9)]"
                initial={false}
                animate={{ width: `${aiPct}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="mt-1.5 text-sm text-muted">{costChart.aiSub}</p>
          </div>

          <div className="flex items-baseline justify-between gap-3 border-t border-ink/10 pt-5">
            <span className="font-semibold">{costChart.savedLabel}</span>
            <span className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
              <span className="text-signal">{formatMoney(saved)}</span>
              <span className="ml-1 text-base font-medium text-muted">/ year</span>
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
