import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { assessmentSection } from "@/content/assessment";
import { Assessment } from "@/components/assessment/Assessment";
import { Footer } from "@/components/sections/Footer";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Logo } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: { absolute: "Free AI Employee Assessment: Can AI Do This Job? · Unhired" },
  description:
    "About to hire? Tell us the role and get a free task-by-task report of what an AI Employee could take on, and what you'd save. Takes about 3 minutes.",
  alternates: { canonical: "/assessment" },
  openGraph: {
    url: "/assessment",
    title: "Free AI Employee Assessment",
    description:
      "About to hire? Tell us the role and get a task-by-task report of what an AI Employee could take on, and what you'd save. Takes about 3 minutes.",
  },
};

export default function AssessmentPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <GridBackground />
      <GlowOrbs
        orbs={[
          { color: "coral", className: "-top-32 -left-32 size-[440px]" },
          { color: "violet", className: "top-40 -right-40 size-[520px]", slow: true },
        ]}
        fade
      />

      <header className="no-print relative z-10 px-4 pt-5 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" aria-label="Unhired home">
            <Logo className="h-7" />
          </Link>
          <Link href="/" className="btn btn-secondary px-4 py-2.5 text-sm">
            <ArrowLeft className="size-4" aria-hidden /> Back to site
          </Link>
        </div>
      </header>

      <main className="relative px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={assessmentSection.eyebrow}
            title={assessmentSection.title}
            sub={assessmentSection.sub}
          />
          <div className="glass-strong relative mt-12 rounded-[32px] p-5 sm:p-10 lg:p-12">
            <Assessment />
          </div>
        </div>
      </main>

      <Footer minimal />
    </div>
  );
}
