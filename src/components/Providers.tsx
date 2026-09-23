"use client";

import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    captureUtm();
  }, []);

  // reducedMotion="user" makes every Framer Motion animation respect prefers-reduced-motion.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
