"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { contractCost, contractSpeed } from "@/content/contract";
import { Eyebrow, Reveal } from "@/components/ui/Section";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";

const ease = [0.22, 1, 0.36, 1] as const;
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/** Counts a number up (or across to a new value) instead of jumping to it. */
function useTween(value: number, run: boolean, duration = 1.1) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(from.current, value, {
      duration,
      ease,
      onUpdate: (v) => {
        from.current = v;
        setShown(v);
      },
    });
    return () => c.stop();
  }, [value, run, duration]);
  return shown;
}

/* -------------------------------------------------------------- cost chart -- */

/**
 * The hire's yearly cost stacked to scale beside the retainer, as in the video's cost scene: the salary rises, the costs on
 * top of it drop in one by one, then the retainer rises next to it. Both columns share one scale, which follows the hire's
 * total, so moving the slider resizes the retainer against it. Visual only: no line-by-line breakdown (Brandon, 2026-11-26).
 */
export function CostCompare() {
  const c = contractCost;
  const ref = useRef<HTMLDivElement>(null);
  // Starts when the chart itself is on screen, so on a phone it plays where the visitor is looking.
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [salary, setSalary] = useState(c.defaultSalary);
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setIntro(false), 3800);
    return () => clearTimeout(id);
  }, [inView]);

  const lines = c.extras.map((x) => ({ ...x, amount: salary * x.share }));
  const extrasTotal = lines.reduce((s, l) => s + l.amount, 0);
  const hire = salary + extrasTotal;
  // One scale for both columns, sized so the hire's column fills the chart with room for its label above it.
  const domain = hire / 0.82;
  const pct = (n: number) => `${(n / domain) * 100}%`;
  const saved = hire - c.retainerYear;
  const leave = salary * c.paidLeaveShare;

  const hireShown = useTween(hire, inView, 1.4);
  const extrasShown = useTween(extrasTotal, inView, 1.4);
  const savedShown = useTween(saved, inView && !intro, 1);

  /** Intro timings run once; after that every change animates straight away. */
  const t = (delay: number, duration = 0.8) => (intro ? { delay, duration, ease } : { duration: 0.45, ease });
  const fade = (delay: number) => ({ initial: { opacity: 0, y: 8 }, animate: inView ? { opacity: 1, y: 0 } : {}, transition: { delay: intro ? delay : 0, duration: 0.5, ease } });
  const go = inView;
  const salaryTop = salary / domain;

  return (
    <section aria-labelledby="cost-title" className="px-3 py-10 sm:px-5">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-ink px-6 py-14 text-white sm:px-12 sm:py-16">
        <GridBackground dark />
        <GlowOrbs
          orbs={[
            { color: "coral", className: "-top-24 right-[30%] size-[380px]" },
            { color: "violet", className: "-bottom-28 -right-20 size-[460px]", slow: true },
          ]}
          intensity={1.3}
        />
        <div className="relative mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:grid-rows-[auto_1fr] md:gap-x-14 md:gap-y-0">
          <div className="md:col-start-1 md:row-start-1">
            <Reveal>
              <Eyebrow dark>{c.eyebrow}</Eyebrow>
              <h2 id="cost-title" className="mt-4 text-[1.9rem] leading-[1.1] font-bold tracking-[-0.03em] sm:text-[2.4rem]">
                {c.title}
              </h2>
              <p className="mt-5 leading-relaxed text-white/70">{c.body}</p>
            </Reveal>

            <div className="mt-8">
              <label htmlFor="salary" className="flex items-baseline justify-between gap-4">
                <span className="label-mono text-white/55">{c.sliderLabel}</span>
                <span className="font-display text-2xl font-bold tracking-tight">{money(salary)}</span>
              </label>
              <input
                id="salary"
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={salary}
                onChange={(e) => {
                  setIntro(false);
                  setSalary(Number(e.target.value));
                }}
                className="mt-4 w-full cursor-pointer accent-[#C7A6FF]"
              />
              <div className="mt-1 flex justify-between text-xs text-white/45">
                <span>{money(c.min)}</span>
                <span>{money(c.max)}</span>
              </div>
            </div>

          </div>

          <div ref={ref} className="flex min-h-[420px] flex-col sm:min-h-[480px] md:col-start-2 md:row-span-2 md:row-start-1">
            <div className="relative grid flex-1 grid-cols-2 gap-6 sm:gap-12">
              {/* The retainer's height carried across, so the gap is plain to see. */}
              <motion.span
                aria-hidden
                className="absolute right-0 left-0 z-10 border-t-2 border-dashed border-white/35"
                style={{ transformOrigin: "right" }}
                initial={{ scaleX: 0, bottom: pct(c.retainerYear) }}
                animate={go ? { scaleX: 1, bottom: pct(c.retainerYear) } : {}}
                transition={{ delay: intro ? 2.9 : 0, duration: 0.7, ease }}
              />

              {/* Full-time hire */}
              <div className="relative flex h-full flex-col justify-end">
                <motion.p {...fade(0.5)} className="mb-3 text-center font-display text-xl font-bold tracking-tight sm:text-2xl">
                  {money(hireShown)}
                  <span className="block text-xs font-medium text-white/50">a year</span>
                </motion.p>

                {/* What the employer pays on top of the salary, bracketed and labelled beside the column. */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute left-full z-10 ml-2 flex items-center gap-2 sm:ml-3"
                  initial={{ opacity: 0, x: -8, bottom: pct(salary), height: pct(extrasTotal) }}
                  animate={go ? { opacity: 1, x: 0, bottom: pct(salary), height: pct(extrasTotal) } : {}}
                  transition={{ delay: intro ? 2.3 : 0, duration: 0.5, ease }}
                >
                  <span className="h-full w-2 shrink-0 rounded-r-md border-y-2 border-r-2 border-[#F87A84]" />
                  <span className="w-max max-w-[120px] text-[11px] leading-tight text-white/70 sm:max-w-[170px] sm:text-xs">
                    <span className="block font-display text-sm font-bold text-[#FCC0C4] sm:text-base">+{money(extrasShown)}</span>
                    benefits, insurance and taxes
                  </span>
                </motion.div>

                {[...lines].reverse().map((l, i) => (
                  <motion.div
                    key={l.key}
                    title={l.label}
                    className="mb-[3px] rounded-[7px]"
                    style={{ backgroundColor: l.color, boxShadow: `0 0 24px -6px ${l.color}` }}
                    initial={{ height: 0, opacity: 0, y: -60 }}
                    animate={go ? { height: pct(l.amount), opacity: 1, y: 0 } : {}}
                    transition={intro ? { delay: 1.1 + (lines.length - 1 - i) * 0.3, duration: 0.6, ease: [0.3, 1.35, 0.6, 1] } : { duration: 0.45, ease }}
                  />
                ))}
                <motion.div
                  className="relative overflow-hidden rounded-t-[16px] rounded-b-[6px] border border-white/15 bg-white/[0.12]"
                  initial={{ height: 0 }}
                  animate={go ? { height: pct(salary) } : {}}
                  transition={t(0.2, 0.9)}
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 flex items-center justify-center border-b border-white/15 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.13)_0_6px,transparent_6px_12px)]"
                    animate={{ height: `${(leave / salary) * 100}%` }}
                    transition={{ duration: 0.45 }}
                  >
                    <span className="px-2 text-center text-[10px] leading-tight font-semibold text-white/70 sm:text-xs">Paid while on vacation</span>
                  </motion.div>
                  <div className="absolute inset-x-0 bottom-5 text-center">
                    <p className="font-display text-sm font-semibold text-white/80 sm:text-base">Salary</p>
                    <p className="text-xs text-white/50 sm:text-sm">{money(salary)}</p>
                  </div>
                </motion.div>
              </div>

              {/* Unhired */}
              <div className="relative flex h-full flex-col justify-end">
                <motion.div
                  className="bg-signal relative grid place-items-center overflow-hidden rounded-t-[16px] rounded-b-[6px] shadow-[0_0_60px_-10px_rgba(148,82,242,0.9)]"
                  initial={{ height: 0 }}
                  animate={go ? { height: pct(c.retainerYear) } : {}}
                  transition={t(2.3, 0.8)}
                >
                  <motion.span {...fade(2.9)} className="text-center font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {money(c.retainerYear)}
                    <span className="block text-xs font-medium text-white/80">a year</span>
                  </motion.span>
                </motion.div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-6 border-t border-white/15 pt-4 text-center sm:gap-12">
              <p className="font-display font-semibold text-white/80">{c.hireLabel}</p>
              <p className="font-display font-semibold">
                {c.usLabel}
                <span className="block text-xs font-normal text-white/55">{c.usNote}</span>
              </p>
            </div>
          </div>
          <motion.div {...fade(3.1)} className="border-t border-white/10 pt-7 md:col-start-1 md:row-start-2 md:mt-10 md:self-end">
            <p className="label-mono text-white/55">What you keep each year</p>
            <p className="mt-3 font-display text-6xl leading-none font-bold tracking-[-0.04em] sm:text-7xl">
              <span className="text-shimmer-light">{money(savedShown)}</span>
            </p>
            <p className="mt-4 text-white/70">
              The hire costs <span className="font-semibold text-white">{(hire / c.retainerYear).toFixed(1)}x</span> as much as our retainer.
            </p>
          </motion.div>
        </div>
        <p className="relative mx-auto mt-12 max-w-5xl border-t border-white/10 pt-5 text-[11px] leading-relaxed text-white/40">{c.sources}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- race -- */

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const OURS = { at: 0.35, dur: 2.6 };
/** The new hire stops halfway, still learning the systems, which is where the caption says they are. */
const HIRE = { at: 0.5, dur: 7, to: 0.5 };

function Lane({ label, steps, p, hero, done }: { label: string; steps: string[]; p: number; hero?: boolean; done: number }) {
  const badge = (
    <span
      className="bg-signal grid size-9 shrink-0 place-items-center rounded-full shadow-[var(--shadow-glow)]"
      style={{ transform: `scale(${done})`, opacity: done ? 1 : 0, transition: "transform .45s cubic-bezier(.3,1.5,.6,1), opacity .2s" }}
    >
      <Check className="size-5 text-white" strokeWidth={3.5} aria-hidden />
    </span>
  );
  return (
    <div className="grid gap-2.5 sm:grid-cols-[110px_minmax(0,1fr)_40px] sm:items-center sm:gap-4">
      <div className="flex h-9 items-center justify-between">
        <p className={`label-mono ${hero ? "text-white" : "text-white/50"}`}>{label}</p>
        {hero && <div className="sm:hidden">{badge}</div>}
      </div>
      <div
        className="relative h-14 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05]"
        style={{ boxShadow: hero && done ? `0 0 ${46 * done}px rgba(148,82,242,${0.55 * done})` : "none", transition: "box-shadow .5s" }}
      >
        <div className={`absolute inset-y-0 left-0 rounded-2xl ${hero ? "bg-signal" : "bg-white/[0.16]"}`} style={{ width: `${p * 100}%` }} />
        <ol className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => {
            const reached = p >= (i + 0.5) / steps.length;
            return (
              <li
                key={s}
                className={`flex items-center justify-center px-1 text-center text-[11px] leading-tight font-semibold transition-colors duration-300 sm:text-sm ${i ? "border-l border-white/10" : ""} ${
                  reached ? "text-white" : "text-white/40"
                }`}
              >
                {s}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="hidden sm:block">{hero && badge}</div>
    </div>
  );
}

/**
 * The two-lane race from the video: our lane fills and reaches "Live" while the new hire's lane is still on its first steps.
 * One clock drives both lanes; it starts when the box scrolls into view and can be replayed.
 */
export function SpeedRace() {
  const s = contractSpeed;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const sec = (now - start) / 1000;
      setT(sec);
      if (sec < HIRE.at + HIRE.dur + 0.2) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, run]);

  const ours = smooth(clamp((t - OURS.at) / OURS.dur));
  const hire = HIRE.to * clamp((t - HIRE.at) / HIRE.dur);
  const done = ours >= 1 ? 1 : 0;
  const [hireTrack, usTrack] = [s.tracks.find((x) => x.tone === "muted")!, s.tracks.find((x) => x.tone === "signal")!];

  return (
    <Reveal className="mt-10 rounded-[28px] bg-ink p-6 text-white sm:p-10">
      <div ref={ref} className="space-y-5">
        <Lane label={usTrack.label} steps={usTrack.steps} p={ours} hero done={done} />
        <Lane label={hireTrack.label} steps={hireTrack.steps} p={hire} done={0} />
      </div>
      <p
        className="mt-6 font-display text-lg font-semibold tracking-tight sm:text-xl"
        style={{ opacity: done, transform: `translateY(${(1 - done) * 8}px)`, transition: "opacity .5s .2s, transform .5s .2s" }}
      >
        {s.raceDone}
      </p>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
        <p className="text-xs text-white/50">{s.trackNote}</p>
        <button
          type="button"
          onClick={() => {
            setT(0);
            setRun((r) => r + 1);
          }}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors hover:text-white"
        >
          <RotateCcw className="size-3.5" aria-hidden /> Replay
        </button>
      </div>
    </Reveal>
  );
}
