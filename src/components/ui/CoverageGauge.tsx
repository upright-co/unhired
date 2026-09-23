"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

/**
 * Semicircle gauge that counts up to `value` (0–100) when scrolled into view.
 */
export function CoverageGauge({
  value,
  size = 260,
  label = "of this role",
  dark = false,
}: {
  value: number;
  size?: number;
  label?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  const gradId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  const stroke = 16;
  const r = 100 - stroke / 2;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - shown / 100);

  return (
    <div
      ref={ref}
      className="relative mx-auto"
      style={{ width: size, height: size * 0.62 }}
      role="img"
      aria-label={`AI can handle about ${Math.round(value)}% ${label}`}
    >
      <svg viewBox="0 0 200 124" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`g-${gradId}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#F65663" />
            <stop offset="100%" stopColor="#9452F2" />
          </linearGradient>
          <filter id={`glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={`M ${stroke / 2} 100 A ${r} ${r} 0 0 1 ${200 - stroke / 2} 100`}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.12)" : "rgba(14,11,31,0.08)"}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} 100 A ${r} ${r} 0 0 1 ${200 - stroke / 2} 100`}
          fill="none"
          stroke={`url(#g-${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#glow-${gradId})`}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span
          className={`font-display leading-none font-bold tracking-[-0.05em] tabular-nums ${dark ? "text-white" : "text-ink"}`}
          style={{ fontSize: size * 0.24 }}
        >
          {Math.round(shown)}
          <span className="text-signal">%</span>
        </span>
        <span className={`label-mono mt-2 ${dark ? "text-white/70" : "text-muted"}`}>{label}</span>
      </div>
    </div>
  );
}
