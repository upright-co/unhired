import { assessmentSection } from "@/content/copy";
import { GlowOrbs } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/Section";
import { Assessment } from "@/components/assessment/Assessment";

export function AssessmentSection() {
  return (
    <section id="assessment" aria-labelledby="assessment-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <GlowOrbs
        orbs={[
          { color: "coral", className: "top-40 -left-40 size-[420px]" },
          { color: "violet", className: "bottom-0 -right-40 size-[480px]", slow: true },
        ]}
        intensity={0.9}
      />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          id="assessment-title"
          eyebrow={assessmentSection.eyebrow}
          title={assessmentSection.title}
          sub={assessmentSection.sub}
        />
        <div className="glass-strong relative mt-12 rounded-[32px] p-5 sm:p-10 lg:p-12">
          <Assessment />
        </div>
      </div>
    </section>
  );
}
