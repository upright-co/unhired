"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronsLeftRight } from "lucide-react";
import { costChart } from "@/content/copy";
import { formatMoney, guarantee } from "@/config";
import { Reveal } from "@/components/ui/Section";

const MAX = 120000;
const MIN = 20000;
const STEP = 1000;

const clamp = (v: number) => Math.min(MAX, Math.max(MIN, Math.round(v / STEP) * STEP));

/**
 * Savings calculator. The "Human hire" bar is the control: drag its handle (or
 * use the arrow keys on it) to set the salary. Every number on screen is the
 * visitor's own input or the published guarantee applied to it.
 */
export function CostChart() {
  const [wage, setWage] = useState(48000);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = guarantee.salarySavingsPercent;
  const aiMax = Math.round((wage * (100 - pct)) / 100);
  const saved = wage - aiMax;
  // Both bars share one scale (0 to MAX) so the AI bar is visibly half the human one.
  const humanPct = (wage / MAX) * 100;
  const aiPct = (aiMax / MAX) * 100;

  const setFromPointer = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setWage(clamp(ratio * MAX));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setTouched(true);
    setFromPointer(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) setFromPointer(e.clientX);
  };
  const endDrag = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: STEP,
      ArrowUp: STEP,
      ArrowLeft: -STEP,
      ArrowDown: -STEP,
      PageUp: STEP * 10,
      PageDown: -STEP * 10,
    };
    if (e.key in moves) {
      e.preventDefault();
      setTouched(true);
      setWage((w) => clamp(w + moves[e.key]));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setTouched(true);
      setWage(e.key === "Home" ? MIN : MAX);
    }
  };

  return (
    <Reveal className="mt-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <p className="label-mono text-violet-deep">{costChart.eyebrow}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{costChart.title}</h3>
          <p className="mt-3 text-muted">{costChart.sub}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted">{costChart.footnote}</p>
        </div>

        <div className="space-y-6">
          {/* Human hire: the draggable bar */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="font-semibold">{costChart.humanLabel}</span>
              <span className="font-display text-xl font-semibold tabular-nums sm:text-2xl">{formatMoney(wage)}</span>
            </div>
            <div
              ref={trackRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className={`relative h-11 touch-none rounded-xl bg-ink/[0.06] select-none ${
                dragging ? "cursor-grabbing" : "cursor-pointer"
              }`}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-xl bg-ink/70"
                initial={false}
                animate={{ width: `${humanPct}%` }}
                transition={dragging ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Handle */}
              <motion.div
                role="slider"
                tabIndex={0}
                aria-label={costChart.sliderLabel}
                aria-valuemin={MIN}
                aria-valuemax={MAX}
                aria-valuenow={wage}
                aria-valuetext={`${formatMoney(wage)} a year`}
                onKeyDown={onKeyDown}
                className={`absolute top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_6px_18px_-4px_rgba(14,11,31,0.45)] ring-1 ring-ink/10 outline-none focus-visible:ring-4 focus-visible:ring-violet/40 ${
                  dragging ? "cursor-grabbing scale-110" : "cursor-grab"
                } transition-transform`}
                initial={false}
                animate={{ left: `${humanPct}%` }}
                transition={dragging ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChevronsLeftRight className="size-4" strokeWidth={2.5} aria-hidden />
                {!touched && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 animate-ping rounded-full ring-2 ring-violet/50"
                  />
                )}
              </motion.div>
            </div>
            <p className="mt-1.5 text-sm text-muted">
              <span className="font-medium text-violet-deep">{costChart.dragHint}.</span> {costChart.humanSub}
            </p>
          </div>

          {/* AI Employee: follows the human bar */}
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="font-semibold">{costChart.aiLabel}</span>
              <span className="font-display text-xl font-semibold tabular-nums sm:text-2xl">≤ {formatMoney(aiMax)}</span>
            </div>
            <div className="h-11 overflow-hidden rounded-xl bg-ink/[0.06]">
              <motion.div
                className="bg-signal h-full rounded-xl shadow-[0_8px_24px_-10px_rgba(148,82,242,0.9)]"
                initial={false}
                animate={{ width: `${aiPct}%` }}
                transition={dragging ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
