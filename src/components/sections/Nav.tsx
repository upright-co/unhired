"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav } from "@/content/copy";
import { Logo } from "@/components/ui/Logo";
import { trackEvent } from "@/lib/analytics";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Main"
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pr-2 pl-5 transition-all duration-300 ${
          scrolled || open ? "glass-strong" : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex items-center rounded-md" aria-label="Unhired home">
          <Logo className="h-7" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[0.94rem] font-medium text-muted transition-colors hover:bg-white/70 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/assessment"
            onClick={() => trackEvent("cta_clicked", { cta: "nav_take_assessment" })}
            className="btn btn-primary px-4 py-2.5 text-sm sm:px-5"
          >
            {nav.cta}
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-ink hover:bg-white/70 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="glass-strong mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-medium hover:bg-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
