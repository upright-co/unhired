import { Check } from "lucide-react";
import { solution } from "@/content/copy";
import { Icon } from "@/components/ui/Icon";
import { Reveal, SectionHeading } from "@/components/ui/Section";

export function Solution() {
  return (
    <section id="solution" aria-labelledby="solution-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="solution-title" eyebrow={solution.eyebrow} title={solution.title} sub={solution.sub} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solution.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(i % 4) * 0.06}
              className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/80 p-6 ring-1 ring-violet/15 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
            >
              <span aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
              <span className="bg-signal grid size-11 shrink-0 place-items-center rounded-2xl text-white shadow-[0_10px_24px_-12px_rgba(148,82,242,0.9)]">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-5 flex items-start gap-2 text-lg leading-snug font-semibold tracking-tight">
                <Check className="mt-1 size-4 shrink-0 text-green-deep" aria-hidden />
                {item.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
