"use client";

import { useEffect, useRef, useState } from "react";

/** Detects images that failed before hydration (when React's onError never fires). */
function useImageFailed() {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  return { ref, failed, setFailed };
}

/**
 * Renders /public/unhired-logo.png. Until that file exists (or if it fails to load),
 * falls back to a text wordmark in the same style.
 */
export function Logo({ className = "h-7", dark = false }: { className?: string; dark?: boolean }) {
  const { ref, failed, setFailed } = useImageFailed();

  if (failed || dark) {
    return (
      <span
        className={`font-display text-[1.6rem] leading-none font-bold tracking-[-0.04em] ${className}`}
        aria-label="Unhired"
      >
        <span className="text-signal">un</span>
        <span className={dark ? "text-white" : "text-ink"}>hired</span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src="/unhired-logo.png"
      alt="Unhired"
      className={`w-auto ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

export function Mark({ className = "size-8" }: { className?: string }) {
  const { ref, failed, setFailed } = useImageFailed();
  if (failed) {
    return (
      <span
        aria-hidden
        className={`bg-signal inline-grid place-items-center rounded-xl font-display font-bold text-white ${className}`}
      >
        u
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src="/unhired-mark.png" alt="" aria-hidden className={className} onError={() => setFailed(true)} />
  );
}
