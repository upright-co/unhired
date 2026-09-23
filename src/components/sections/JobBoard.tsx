"use client";

import { Bookmark, MapPin, Search } from "lucide-react";
import { hero } from "@/content/copy";
import { StatusDot } from "@/components/ui/Decor";

/**
 * Faded, continuously scrolling wall of job postings with a solid
 * "Role filled by AI" badge on top.
 *
 * Deliberately a generic job-board look — familiar card layout and a neutral
 * blue UI — not an imitation of any real job site's branding.
 */
export function JobBoard() {
  // Duplicated so the marquee can loop seamlessly at -50%.
  const cards = [...hero.postings, ...hero.postings];

  return (
    <div className="relative w-full min-w-0">
      <div className="glass relative w-full overflow-hidden rounded-[28px] p-4 sm:p-5">
        {/* Generic job-site chrome */}
        <div aria-hidden className="mb-4 flex items-center gap-2 opacity-45">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2">
            <Search className="size-4 text-[#2557a7]" />
            <span className="text-sm text-muted">Receptionist</span>
          </div>
          <div className="hidden flex-1 items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 sm:flex">
            <MapPin className="size-4 text-[#2557a7]" />
            <span className="text-sm text-muted">Calgary, AB</span>
          </div>
          <span className="rounded-lg bg-[#2557a7] px-4 py-2 text-sm font-semibold text-white">Find jobs</span>
        </div>

        {/* Scrolling postings, faded back so the badge reads first */}
        <div
          aria-hidden
          className="relative h-[252px] overflow-hidden opacity-[0.38]"
          style={{
            maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
          }}
        >
          <div className="animate-marquee flex w-max gap-3">
            {cards.map((p, i) => (
              <article
                key={i}
                className="w-[230px] shrink-0 rounded-xl border border-ink/10 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="size-9 shrink-0 rounded-md bg-ink/10" />
                  <Bookmark className="size-4 text-[#2557a7]" />
                </div>
                <h3 className="mt-3 text-[0.95rem] leading-snug font-semibold text-[#2557a7]">{p.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{p.company}</p>
                <p className="text-sm text-muted">{p.location}</p>
                <p className="mt-2 text-sm font-medium text-ink/80">{p.salary}</p>
                <span className="mt-3 inline-block rounded bg-ink/[0.06] px-2 py-0.5 text-xs text-ink/70">
                  {p.type}
                </span>
                <span className="mt-3 block rounded-md bg-[#2557a7] py-1.5 text-center text-xs font-semibold text-white">
                  Apply now
                </span>
              </article>
            ))}
          </div>
        </div>

        {/* The point of the whole graphic */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="bg-signal inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_-12px_rgba(148,82,242,0.8)] sm:text-lg">
            <StatusDot className="!bg-white" />
            {hero.badge}
          </p>
        </div>
      </div>
    </div>
  );
}
