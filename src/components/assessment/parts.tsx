"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

export function ProgressBar({ value, steps, activeIndex }: { value: number; steps: string[]; activeIndex: number }) {
  return (
    <div className="mb-8">
      <div
        className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        aria-label="Assessment progress"
      >
        <motion.div
          className="bg-signal h-full rounded-full"
          initial={false}
          animate={{ width: `${Math.max(4, value * 100)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ol className="mt-3 hidden justify-between sm:flex">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`label-mono text-[0.66rem] ${i <= activeIndex ? "text-violet-deep" : "text-muted/70"}`}
            aria-current={i === activeIndex ? "step" : undefined}
          >
            {String(i + 1).padStart(2, "0")} · {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Slide transition between steps. */
export function StepFrame({ stepKey, children }: { stepKey: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function StepHeading({ title, sub, id }: { title: string; sub?: string; id?: string }) {
  return (
    <div className="mb-7">
      <h3
        id={id}
        tabIndex={-1}
        className="text-2xl leading-tight font-semibold tracking-[-0.03em] outline-none sm:text-[2rem]"
      >
        {title}
      </h3>
      {sub && <p className="mt-2 text-muted">{sub}</p>}
    </div>
  );
}

export function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted hover:bg-white hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden /> {label}
    </button>
  );
}

/** On-brand loading state with rotating status lines. */
export function LoadingPanel({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    if (lines.length < 2) return;
    const t = setInterval(() => setI((n) => Math.min(n + 1, lines.length - 1)), 3200);
    return () => clearInterval(t);
  }, [lines]);

  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
      <div className="relative size-24">
        <motion.span
          className="bg-signal absolute inset-0 rounded-full opacity-30 blur-xl"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#F65663", borderRightColor: "#9452F2" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute inset-[26px] rounded-full bg-white shadow-inner" />
        <span className="status-dot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="mt-7 h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={lines[i]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-display text-lg font-semibold tracking-tight"
          >
            {lines[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="label-mono mt-2 text-muted">This can take up to a minute</p>
    </div>
  );
}

export function ErrorPanel({
  message,
  onRetry,
  retryLabel,
  onBack,
}: {
  message: string;
  onRetry?: () => void;
  retryLabel: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center" role="alert">
      <span className="grid size-14 place-items-center rounded-2xl bg-coral/10 font-display text-2xl font-bold text-coral-deep">
        !
      </span>
      <p className="mt-5 max-w-md text-lg font-medium">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onBack && <BackButton onClick={onBack} />}
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-primary px-6 py-3">
            <RotateCcw className="size-4" aria-hidden /> {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">
      {children}
    </label>
  );
}

/** Hidden field bots fill in and humans never see. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
