import type { Metadata } from "next";
import Link from "next/link";
import { Questionnaire } from "@/components/pilot/Questionnaire";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: { absolute: "Apply for the AI Employee Pilot · Unhired" },
  description: "Apply for one of 5 free AI Employee pilot spots for Edmonton businesses.",
  alternates: { canonical: "/pilot/apply" },
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return (
    <div className="relative isolate min-h-[100svh] overflow-hidden bg-ink">
      <GridBackground dark />
      <GlowOrbs
        orbs={[
          { color: "coral", className: "-top-32 -left-32 size-[460px]" },
          { color: "violet", className: "bottom-[-10%] -right-40 size-[560px]", slow: true },
        ]}
        intensity={1.4}
      />
      <header className="absolute inset-x-0 top-0 z-40 px-5 pt-5 sm:px-8">
        <Link href="/pilot" aria-label="Back to the pilot page" className="inline-block">
          <Logo className="h-6" dark />
        </Link>
      </header>
      <Questionnaire />
    </div>
  );
}
