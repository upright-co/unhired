"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Activity, Bot, Check, Clock, User } from "lucide-react";
import { contractMap } from "@/content/contract";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * An example process map that builds up and is taken over by AI, one stage per step of "How it works":
 * 0 Audit lists the tasks, 1 Map links them and marks the slow ones, 2 Build hands the AI tasks to AI Employees,
 * 3 Train checks them off, 4 Launch sends work through it, 5 Maintain adds monitoring.
 * On desktop the page passes the step being read; on phones (no `stage`) it plays through the stages on its own.
 */
export function ProcessMap({ stage: driven }: { stage?: number }) {
  const m = contractMap;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [auto, setAuto] = useState(0);
  const autoplay = driven === undefined;

  useEffect(() => {
    if (!autoplay || !inView) return;
    const id = setInterval(() => setAuto((s) => (s + 1) % m.stages.length), 2600);
    return () => clearInterval(id);
  }, [autoplay, inView, m.stages.length]);

  const stage = inView ? (autoplay ? auto : (driven ?? 0)) : -1;
  const status = m.stages[Math.max(0, stage)];

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[28px] bg-ink p-5 text-white shadow-[0_40px_80px_-40px_rgba(64,20,140,0.7)] sm:p-6">
      <span aria-hidden className="absolute -top-24 -right-16 size-64 rounded-full bg-violet/35 blur-3xl" />
      <span aria-hidden className="absolute -bottom-24 -left-16 size-56 rounded-full bg-coral/20 blur-3xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="label-mono text-[10px] text-white/50">Example process map</p>
          <p className="mt-1 font-display text-base font-semibold">{m.title}</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={status.badge}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
              stage >= 4 ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/75"
            }`}
          >
            {stage >= 4 && <span className="size-1.5 animate-pulse rounded-full bg-emerald-300" />}
            {status.badge}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative mt-5">
        {/* The rail linking every task; work travels down it once the map is live. */}
        <motion.span
          aria-hidden
          className="absolute top-[18px] bottom-[18px] left-[17px] w-0.5 origin-top bg-white/20"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8, ease }}
        />
        {stage >= 4 && (
          <motion.span
            aria-hidden
            className="absolute left-[12px] size-3 rounded-full bg-white shadow-[0_0_14px_4px_rgba(199,166,255,0.9)]"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: ["2%", "96%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
          />
        )}

        <ol className="relative space-y-2">
          {m.tasks.map((task, i) => {
            const shown = stage >= 0;
            const ai = task.ai && stage >= 2;
            return (
              <motion.li
                key={task.t}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -12 }}
                animate={shown ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.12 * i, duration: 0.4, ease }}
              >
                <span
                  className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                    ai ? "bg-signal border-transparent shadow-[var(--shadow-glow)]" : "border-white/15 bg-[#1b1730]"
                  }`}
                >
                  {ai ? <Bot className="size-4 text-white" aria-hidden /> : <User className="size-4 text-white/60" aria-hidden />}
                </span>
                <div
                  className={`flex min-h-[42px] flex-1 items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-colors duration-500 ${
                    ai ? "border-violet/50 bg-violet/[0.12]" : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <span className={`text-[13px] leading-snug sm:text-sm ${ai ? "text-white" : "text-white/75"}`}>{task.t}</span>
                  <AnimatePresence mode="wait">
                    {stage >= 2 ? (
                      <motion.span
                        key={task.ai ? "ai" : "team"}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 * i }}
                        className={`inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold ${task.ai ? "text-[#C7A6FF]" : "text-white/55"}`}
                      >
                        {task.ai ? (
                          <>
                            {stage >= 3 && <Check className="size-3.5 text-emerald-300" strokeWidth={3} aria-hidden />}
                            AI
                          </>
                        ) : (
                          "Your team"
                        )}
                      </motion.span>
                    ) : stage >= 1 && task.slow ? (
                      <motion.span
                        key="slow"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                        className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#F87A84]"
                      >
                        <Clock className="size-3.5" aria-hidden /> Slow
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="relative mt-5 flex min-h-[40px] items-center gap-3 border-t border-white/10 pt-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={status.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex-1 text-sm text-white/70"
          >
            <span className="font-semibold text-white">{status.step}.</span> {status.caption}
          </motion.p>
        </AnimatePresence>
        {stage >= 5 && (
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-400/15">
            <Activity className="size-4 text-emerald-300" aria-hidden />
          </motion.span>
        )}
      </div>
    </div>
  );
}
