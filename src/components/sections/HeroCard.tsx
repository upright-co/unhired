"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarCheck, MessageSquareText, PhoneIncoming, Sparkles } from "lucide-react";
import { hero } from "@/content/copy";
import { formatAiHirePrice } from "@/config";
import { StatusDot } from "@/components/ui/Decor";

const feedIcons = [PhoneIncoming, CalendarCheck, MessageSquareText, Sparkles];
const VISIBLE = 3;

/** The floating "AI Receptionist" card plus the struck-through job posting behind it. */
export function HeroCard() {
  const reduce = useReducedMotion();
  const feed = hero.card.feed;
  // Monotonic tick so React keys stay stable across loop wrap-around.
  const [tick, setTick] = useState(VISIBLE - 1);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      if (!document.hidden) setTick((n) => n + 1);
    }, 2600);
    return () => clearInterval(t);
  }, [reduce]);

  // Newest item on top; relative times stay fixed per slot so the feed reads naturally.
  const slots = Array.from({ length: VISIBLE }, (_, i) => {
    const n = tick - i;
    const idx = n % feed.length;
    return { key: n, idx, text: feed[idx].text, time: feed[i].time };
  });

  const stats = [...hero.card.stats, { label: "Salary", value: `${formatAiHirePrice()}/mo` }];

  return (
    <div className="relative mx-auto w-full max-w-[460px] pt-10 pb-6 sm:pt-6">
      {/* Faded, closed job posting behind the card */}
      <div
        aria-hidden
        className="absolute -top-2 -left-3 w-[78%] -rotate-6 rounded-3xl border border-ink/10 bg-white/50 p-5 opacity-80 blur-[0.3px] sm:-left-10"
      >
        <p className="label-mono text-muted">Job posting</p>
        <p className="mt-2 font-display text-lg font-semibold text-ink/60 line-through decoration-coral decoration-2">
          {hero.jobPost.title}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-ink/45">
          {hero.jobPost.lines.map((l) => (
            <li key={l} className="line-through decoration-ink/30">
              {l}
            </li>
          ))}
        </ul>
        <span className="absolute top-4 right-4 rotate-12 rounded-md border-2 border-coral-deep px-2 py-0.5 font-mono text-xs font-bold tracking-widest text-coral-deep">
          {hero.jobPost.stamp}
        </span>
      </div>

      {/* The AI hire */}
      <div className="relative animate-float">
        <div className="glass-strong relative overflow-hidden rounded-[28px] p-5 sm:p-6">
          <div className="scanline" aria-hidden />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="bg-signal grid size-12 place-items-center rounded-2xl text-white shadow-[0_8px_20px_-8px_rgba(148,82,242,0.8)]">
                <PhoneIncoming className="size-5" aria-hidden />
              </span>
              <div>
                <p className="label-mono text-muted">{hero.card.label}</p>
                <p className="font-display text-xl font-semibold tracking-tight">{hero.card.role}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-signal-green/10 px-3 py-1 text-xs font-semibold text-green-deep">
              <StatusDot />
              {hero.card.status}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-ink/5 bg-white/60 p-2">
            <p className="label-mono px-2 pt-1 pb-2 text-muted">Live activity</p>
            <ul className="relative h-[156px] overflow-hidden" aria-live="off">
              <AnimatePresence initial={false}>
                {slots.map((s, i) => {
                  const I = feedIcons[s.idx % feedIcons.length];
                  return (
                    <motion.li
                      key={s.key}
                      layout
                      initial={{ opacity: 0, y: -16, scale: 0.98 }}
                      animate={{ opacity: 1 - i * 0.22, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="mb-1.5 flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 shadow-[0_2px_10px_-6px_rgba(14,11,31,0.25)]"
                    >
                      <I className="size-4 shrink-0 text-violet-deep" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{s.text}</span>
                      <span className="font-mono text-[0.7rem] text-muted">{s.time}</span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink/5 bg-white/70 px-3 py-2.5">
                <dt className="label-mono text-[0.62rem] text-muted">{s.label}</dt>
                <dd className="mt-0.5 font-display text-lg font-semibold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
