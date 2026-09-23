import { Quote } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { testimonialsSection } from "@/content/copy";
import { Reveal, SectionHeading } from "@/components/ui/Section";

export function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section aria-labelledby="results-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="results-title"
          eyebrow={testimonialsSection.eyebrow}
          title={testimonialsSection.title}
          sub={testimonialsSection.sub}
        />
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className="glass flex flex-col rounded-3xl p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {t.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt="" className="size-11 rounded-2xl object-cover ring-1 ring-ink/10" />
                  ) : (
                    <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-coral/20 to-violet/25 font-display font-semibold text-violet-deep">
                      {t.business.replace(/[^A-Za-z]/g, "").charAt(0) || "U"}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{t.business}</p>
                    <p className="text-sm text-muted">{t.industry}</p>
                  </div>
                </div>
              </div>
              <p className="label-mono mt-5 inline-flex self-start rounded-full bg-white px-3 py-1 text-muted ring-1 ring-ink/10">
                Unhired: {t.roleUnhired}
              </p>
              <blockquote className="mt-5 flex-1">
                <Quote className="size-5 text-violet/60" aria-hidden />
                <p className="mt-2 leading-relaxed">{t.quote}</p>
                {t.person && <footer className="mt-3 text-sm text-muted">— {t.person}</footer>}
              </blockquote>
              <div className="mt-6 border-t border-ink/10 pt-5">
                <p className="font-display text-3xl font-semibold tracking-tight">
                  <span className="text-signal">{t.metric.value}</span>
                </p>
                <p className="text-sm text-muted">{t.metric.label}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
