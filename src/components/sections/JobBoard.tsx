"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { hero } from "@/content/copy";

/**
 * Carousel of job postings that step one-by-one into focus. As each posting
 * lands, a "Filled By AI" stamp slams onto it — postings ahead of the focus are
 * clean, postings behind it stay stamped.
 *
 * The postings are deliberately abstract wireframes: no real job site's layout
 * or branding, and no text to read but the role title.
 */

const STEP_MS = 3200;
/** Slots around the focused card. */
const SLOTS = [-2, -1, 0, 1, 2] as const;

function slotStyle(offset: number, cardW: number, gap: number) {
  const distance = Math.abs(offset);
  return {
    x: offset * (cardW + gap),
    scale: distance === 0 ? 1 : distance === 1 ? 0.92 : 0.85,
    opacity: distance === 0 ? 1 : distance === 1 ? 0.6 : 0.28,
    zIndex: 10 - distance,
  };
}

/** Worn rubber stamp: double ring, stars, angled ribbon. */
function Stamp({ slam }: { slam: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 grid place-items-center pt-[14%]"
      initial={false}
      animate={slam ? { opacity: 1, scale: 1, rotate: -9 } : { opacity: 0, scale: 1.9, rotate: -24 }}
      transition={
        slam ? { type: "spring", stiffness: 520, damping: 17, mass: 0.7, delay: 0.3 } : { duration: 0.15 }
      }
    >
      <svg viewBox="0 0 260 260" className="w-[62%]" aria-hidden>
        <defs>
          <filter id="stamp-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
          </filter>
        </defs>
        <g filter="url(#stamp-rough)" opacity="0.95">
          <g fill="none" stroke="#F65663">
            <circle cx="130" cy="130" r="112" strokeWidth="9" />
            <circle cx="130" cy="130" r="94" strokeWidth="3" />
          </g>
          {[-40, 0, 40].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 130 130)`}>
              <path
                d="M130 214 l5.4 11 12.2 1.8 -8.8 8.6 2.1 12.1 -10.9-5.7 -10.9 5.7 2.1-12.1 -8.8-8.6 12.2-1.8z"
                fill="#F65663"
              />
            </g>
          ))}
          <g transform="rotate(-8 130 130)">
            <rect x="2" y="101" width="256" height="58" rx="5" fill="#F65663" />
            <text
              x="130"
              y="141"
              textAnchor="middle"
              fill="#fff"
              fontSize="36"
              fontWeight="800"
              letterSpacing="1.5"
              fontFamily="var(--font-sora), sans-serif"
            >
              FILLED BY AI
            </text>
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

/** Abstract wireframe of a job posting. */
function PostingCard({ title, cardW }: { title: string; cardW: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_18px_50px_-24px_rgba(14,11,31,0.45)]"
      style={{ width: cardW }}
    >
      <p className="mb-3 truncate text-center font-display text-[1.05rem] font-bold tracking-tight">
        Hiring: {title}
      </p>

      <div className="flex items-center gap-2.5 rounded-lg bg-[#2557a7] px-3 py-2.5">
        <span className="size-6 shrink-0 rounded-full bg-white/95" />
        <span className="flex-1 space-y-1.5">
          <span className="block h-1.5 w-full rounded-full bg-white/85" />
          <span className="block h-1.5 w-2/3 rounded-full bg-white/60" />
        </span>
      </div>

      <div className="mt-3 flex gap-2.5">
        <span className="h-[104px] w-9 shrink-0 rounded-lg bg-[#2557a7]/15" />
        <span className="flex-1 space-y-2 pt-1">
          <span className="block h-1.5 w-full rounded-full bg-ink/70" />
          <span className="block h-1.5 w-[88%] rounded-full bg-ink/45" />
          <span className="block h-1.5 w-[94%] rounded-full bg-ink/45" />
          <span className="block h-1.5 w-[70%] rounded-full bg-ink/45" />
          <span className="mt-2 block h-9 w-[78%] rounded-md border border-ink/20" />
        </span>
        <span className="h-[104px] w-9 shrink-0 rounded-lg bg-[#2557a7]/15" />
      </div>
    </div>
  );
}

export function JobBoard() {
  const reduce = useReducedMotion();
  const roles = hero.postings;
  const [index, setIndex] = useState(0);
  const [cardW, setCardW] = useState(300);
  const gap = 22;

  useEffect(() => {
    const measure = () => setCardW(window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 280 : 320);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      if (!document.hidden) setIndex((n) => n + 1);
    }, STEP_MS);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <div
      className="relative h-[292px] w-full min-w-0 sm:h-[312px] lg:w-[calc(100%+16rem)]"
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 15%, #000 62%, transparent 94%)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 15%, #000 62%, transparent 94%)",
      }}
      aria-label="Job postings being filled by AI"
    >
      <div className="absolute top-1/2 left-1/2 size-0">
        <AnimatePresence initial={false}>
          {SLOTS.map((offset) => {
            const n = index + offset;
            const role = roles[((n % roles.length) + roles.length) % roles.length];
            const s = slotStyle(offset, cardW, gap);
            return (
              <motion.div
                key={n}
                className="absolute top-0 left-0"
                style={{ zIndex: s.zIndex }}
                initial={{ opacity: 0, x: s.x, scale: s.scale, y: "-50%" }}
                animate={{ opacity: s.opacity, x: s.x, scale: s.scale, y: "-50%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative -translate-x-1/2">
                  <PostingCard title={role.title} cardW={cardW} />
                  {/* Stamped as it lands in focus, and stays stamped behind it. */}
                  <Stamp slam={offset <= 0} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
