"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    __turnstileLoading?: Promise<void>;
  }
}

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export type TurnstileHandle = {
  /** Resolves with a fresh, unused token (or null if Turnstile isn't configured). */
  getToken: () => Promise<string | null>;
};

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (window.__turnstileLoading) return window.__turnstileLoading;
  window.__turnstileLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(s);
  });
  return window.__turnstileLoading;
}

/**
 * Cloudflare Turnstile in "interaction-only" mode: invisible unless Cloudflare needs the
 * visitor to click. Tokens are single-use, so each getToken() consumes the current one
 * and resets the widget for next time.
 */
export const Turnstile = forwardRef<TurnstileHandle>(function Turnstile(_, ref) {
  const el = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const waiters = useRef<((t: string) => void)[]>([]);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !el.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(el.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          theme: "light",
          callback: (t: string) => {
            const w = waiters.current.shift();
            if (w) w(t);
            else token.current = t;
          },
          "expired-callback": () => {
            token.current = null;
          },
        });
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getToken: () => {
      if (!TURNSTILE_SITE_KEY) return Promise.resolve(null);
      if (token.current) {
        const t = token.current;
        token.current = null;
        // Prepare the next token in the background.
        setTimeout(() => window.turnstile?.reset(widgetId.current ?? undefined), 0);
        return Promise.resolve(t);
      }
      return new Promise<string | null>((resolve) => {
        const timer = setTimeout(() => resolve(null), 30_000);
        waiters.current.push((t) => {
          clearTimeout(timer);
          setTimeout(() => window.turnstile?.reset(widgetId.current ?? undefined), 0);
          resolve(t);
        });
      });
    },
  }));

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={el} className="mt-4 flex justify-center empty:hidden" />;
});
