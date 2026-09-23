import { problem } from "@/content/copy";
import { IconTile } from "@/components/ui/Icon";
import { Reveal, SectionHeading } from "@/components/ui/Section";

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="problem-title" eyebrow={problem.eyebrow} title={problem.title} sub={problem.sub} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problem.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 4) * 0.06} className="glass flex flex-col rounded-3xl p-6">
              <IconTile name={item.icon} />
              <h3 className="mt-5 text-lg leading-snug font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{item.body}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 text-center">
          <p className="font-display text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            <span className="text-signal">{problem.tagline}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
