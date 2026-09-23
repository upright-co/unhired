import { howItWorks } from "@/content/copy";
import { Reveal, SectionHeading } from "@/components/ui/Section";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        <ol className="relative mt-14 grid gap-4 md:grid-cols-3">
          <span
            aria-hidden
            className="bg-signal absolute top-[52px] right-[16%] left-[16%] hidden h-px opacity-40 md:block"
          />
          {howItWorks.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="glass relative rounded-3xl p-7">
              <span className="bg-signal relative grid size-12 place-items-center rounded-2xl font-mono text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(148,82,242,0.8)]">
                0{i + 1}
              </span>
              <h3 className="mt-6 text-xl leading-snug font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
