"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { contractCost, contractSpeed } from "@/content/contract";
import { Eyebrow, Reveal } from "@/components/ui/Section";

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
 * total, so moving the slider resizes the retainer against it.
 */
export function CostCompare() {
  const c = contractCost;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [salary, setSalary] = useState(c.defaultSalary);
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setIntro(false), 3800);
    return () => clearTimeout(id);
  }, [inView]);

  const lines = c.extras.map((x) => ({ ...x, amount: salary * x.share }));
  const hire = salary + lines.reduce((s, l) => s + l.amount, 0);
  // One scale for both columns, sized so the hire's column fills the chart with room for its label above it.
  const domain = hire / 0.8;
  const pct = (n: number) => `${(n / domain) * 100}%`;
  const saved = hire - c.retainerYear;

  const hireShown = useTween(hire, inView, 1.4);
  const savedShown = useTween(saved, inView && !intro, 1);
  const leave = salary * c.paidLeaveShare;

  /** Intro timings run once; after that every change animates straight away. */
  const t = (delay: number, duration = 0.8) => (intro ? { delay, duration, ease } : { duration: 0.45, ease });
  const go = inView;

  return (
    <section aria-labelledby="cost-title" className="px-4 py-14 sm:px-6 sm:py-20">
      <div ref={ref} className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14">
        <div>
          <Reveal>
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 id="cost-title" className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-[2.4rem] sm:leading-[1.1]">
              {c.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{c.body}</p>
          </Reveal>

          <Reveal className="mt-8 rounded-[22px] border border-ink/[0.08] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(40,14,90,0.45)]">
            <label htmlFor="salary" className="flex items-baseline justify-between gap-4">
              <span className="label-mono text-muted">{c.sliderLabel}</span>
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
              className="mt-4 w-full cursor-pointer accent-[#9452F2]"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>{money(c.min)}</span>
              <span>{money(c.max)}</span>
            </div>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={go ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: intro ? 3.1 : 0, duration: 0.6, ease }}
            className="relative mt-6 overflow-hidden rounded-[22px] bg-ink p-6 text-white"
          >
            <span aria-hidden className="absolute -top-16 -right-10 size-48 rounded-full bg-violet/40 blur-3xl" />
            <p className="label-mono relative text-white/60">What you keep each year</p>
            <p className="relative mt-2 font-display text-5xl leading-none font-bold tracking-[-0.03em]">
              <span className="text-shimmer-light">{money(savedShown)}</span>
            </p>
            <p className="relative mt-3 text-sm text-white/70">
              The hire costs {(hire / c.retainerYear).toFixed(1)} times as much as our retainer.
            </p>
          </motion.div>
        </div>

        <Reveal className="rounded-[28px] border border-ink/[0.08] bg-white p-5 shadow-[0_30px_60px_-40px_rgba(40,14,90,0.45)] sm:p-8">
          <div className="relative grid h-[360px] grid-cols-2 gap-5 sm:h-[440px] sm:gap-8">
            {/* The retainer's height carried across, so the gap is plain to see. */}
            <motion.span
              aria-hidden
              className="absolute right-0 left-0 z-10 border-t-2 border-dashed border-violet/50"
              style={{ transformOrigin: "right" }}
              initial={{ scaleX: 0, bottom: pct(c.retainerYear) }}
              animate={go ? { scaleX: 1, bottom: pct(c.retainerYear) } : {}}
              transition={{ delay: intro ? 2.9 : 0, duration: 0.7, ease }}
            />

            {/* Full-time hire */}
            <div className="relative flex h-full flex-col justify-end">
              <motion.p
                className="mb-2 text-center font-display text-lg font-bold tracking-tight sm:text-xl"
                initial={{ opacity: 0 }}
                animate={go ? { opacity: 1 } : {}}
                transition={{ delay: intro ? 0.5 : 0, duration: 0.5 }}
              >
                {money(hireShown)}
                <span className="block text-xs font-medium text-muted">a year</span>
              </motion.p>
              {[...lines].reverse().map((l, i) => (
                <motion.div
                  key={l.key}
                  title={`${l.label}: ${money(l.amount)}`}
                  className="mb-[2px] rounded-[6px]"
                  style={{ backgroundColor: l.color }}
                  initial={{ height: 0, opacity: 0, y: -40 }}
                  animate={go ? { height: pct(l.amount), opacity: 1, y: 0 } : {}}
                  transition={t(1.1 + (lines.length - 1 - i) * 0.32, 0.55)}
                />
              ))}
              <motion.div
                className="relative overflow-hidden rounded-t-[14px] rounded-b-[4px] bg-ink/[0.12]"
                initial={{ height: 0 }}
                animate={go ? { height: pct(salary) } : {}}
                transition={t(0.2, 0.9)}
              >
                <motion.div
                  className="absolute inset-x-0 top-0 border-b border-ink/10 bg-[repeating-linear-gradient(135deg,rgba(14,11,31,0.10)_0_6px,transparent_6px_12px)]"
                  animate={{ height: `${(leave / salary) * 100}%` }}
                  transition={{ duration: 0.45 }}
                />
                <div className="absolute inset-x-0 bottom-4 text-center font-display text-sm font-semibold text-ink/70 sm:text-base">Salary</div>
              </motion.div>
            </div>

            {/* Unhired */}
            <div className="relative flex h-full flex-col justify-end">
              <motion.p
                className="mb-2 text-center font-display text-lg font-bold tracking-tight text-violet-deep sm:text-xl"
                initial={{ opacity: 0 }}
                animate={go ? { opacity: 1 } : {}}
                transition={{ delay: intro ? 2.6 : 0, duration: 0.5 }}
              >
                {money(c.retainerYear)}
                <span className="block text-xs font-medium text-muted">a year</span>
              </motion.p>
              <motion.div
                className="bg-signal rounded-t-[14px] rounded-b-[4px] shadow-[var(--shadow-glow)]"
                initial={{ height: 0 }}
                animate={go ? { height: pct(c.retainerYear) } : {}}
                transition={t(2.3, 0.8)}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-5 border-t border-ink/[0.08] pt-3 text-center sm:gap-8">
            <p className="font-display font-semibold">{c.hireLabel}</p>
            <p className="font-display font-semibold text-violet-deep">
              {c.usLabel}
              <span className="block text-xs font-normal text-muted">{c.usNote}</span>
            </p>
          </div>

          <ul className="mt-6 space-y-2 border-t border-ink/[0.08] pt-5 text-sm">
            <li className="flex items-center gap-3">
              <span aria-hidden className="size-3 shrink-0 rounded-[3px] bg-ink/[0.12]" />
              <span className="flex-1 text-ink/80">Salary</span>
              <span className="font-semibold tabular-nums">{money(salary)}</span>
            </li>
            <li className="flex items-center gap-3 pl-6 text-muted">
              <span aria-hidden className="size-3 shrink-0 rounded-[3px] bg-[repeating-linear-gradient(135deg,rgba(14,11,31,0.25)_0_2px,transparent_2px_4px)]" />
              <span className="flex-1">of which paid while on vacation and leave</span>
              <span className="tabular-nums">{money(leave)}</span>
            </li>
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span aria-hidden className="size-3 shrink-0 rounded-[3px]" style={{ backgroundColor: l.color }} />
                <span className="flex-1 text-ink/80">{l.label}</span>
                <span className="font-semibold tabular-nums">+{money(l.amount)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[11px] leading-relaxed text-muted">{c.sources}</p>
        </Reveal>
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
