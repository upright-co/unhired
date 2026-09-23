import { companies } from "@/content/companies";
import { companiesSection } from "@/content/copy";
import { Reveal, SectionHeading } from "@/components/ui/Section";

export function Companies() {
  // Entries still carrying [bracketed] placeholders are hidden, so the section
  // simply doesn't render until real companies are added to content/companies.ts.
  const live = companies.filter((c) => !c.name.includes("["));
  if (!live.length) return null;

  return (
    <section id="companies" aria-labelledby="companies-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="companies-title"
          eyebrow={companiesSection.eyebrow}
          title={companiesSection.title}
          sub={companiesSection.sub}
        />

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {live.map((c, i) => (
            <Reveal
              as="li"
              key={`${c.name}-${i}`}
              delay={(i % 3) * 0.08}
              className="glass flex flex-col overflow-hidden rounded-3xl"
            >
              {/* Banner: 16:9. Drop real images in /public/companies and set `banner`. */}
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-coral/20 via-violet/15 to-violet/30">
                {c.banner ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.banner} alt={`${c.name} — ${c.roleBuilt}`} className="size-full object-cover" />
                ) : (
                  <div className="grid size-full place-items-center">
                    <span className="label-mono rounded-full bg-white/80 px-3 py-1.5 text-muted">
                      Banner image
                    </span>
                  </div>
                )}
                <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-deep backdrop-blur">
                  {c.roleBuilt}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{c.name}</h3>
                  <span className="label-mono shrink-0 text-muted">{c.industry}</span>
                </div>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">{c.description}</p>
                {c.result && (
                  <p className="mt-5 border-t border-ink/10 pt-4 font-display text-2xl font-semibold tracking-tight">
                    <span className="text-signal">{c.result}</span>
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
