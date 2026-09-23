"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faqs } from "@/content/faq";
import { faqSection } from "@/content/copy";
import { formatAiHirePrice } from "@/config";
import { SectionHeading } from "@/components/ui/Section";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="faq-title" eyebrow={faqSection.eyebrow} title={faqSection.title} />
        <ul className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const btnId = `${base}-q${i}`;
            const panelId = `${base}-a${i}`;
            return (
              <li key={f.q} className="glass overflow-hidden rounded-3xl">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-lg font-semibold tracking-tight"
                  >
                    {f.q}
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                        isOpen ? "bg-signal rotate-45 text-white" : "bg-ink/[0.06]"
                      }`}
                    >
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="space-y-3 px-6 pb-6 leading-relaxed text-muted">
                        {f.a
                          .replace("[PRICE]", formatAiHirePrice())
                          .split("\n\n")
                          .map((para) => (
                            <p key={para}>{para}</p>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
