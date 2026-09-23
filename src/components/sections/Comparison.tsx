import { Check, Minus, X } from "lucide-react";
import { comparison } from "@/content/copy";
import { formatAiHirePrice } from "@/config";
import { Reveal, SectionHeading } from "@/components/ui/Section";
import { CostChart } from "./CostChart";

type Verdict = "yes" | "no" | "partial";

function Mark({ v, compact = false }: { v: Verdict; compact?: boolean }) {
  const size = compact ? "size-4" : "size-6";
  const icon = compact ? "size-2.5" : "size-3.5";
  if (v === "yes")
    return (
      <span className={`bg-signal grid ${size} shrink-0 place-items-center rounded-full text-white`}>
        <Check className={icon} strokeWidth={3} aria-hidden />
        <span className="sr-only">Yes</span>
      </span>
    );
  if (v === "no")
    return (
      <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-ink/[0.08] text-ink/70`}>
        <X className={icon} strokeWidth={3} aria-hidden />
        <span className="sr-only">No</span>
      </span>
    );
  return (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-violet/15 text-violet-deep`}>
      <Minus className={icon} strokeWidth={3} aria-hidden />
      <span className="sr-only">Partly</span>
    </span>
  );
}

const fill = (s: string) => s.replace("__PRICE__", formatAiHirePrice());

export function Comparison() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="compare-title" eyebrow={comparison.eyebrow} title={comparison.title} sub={comparison.sub} />

        <Reveal className="glass mt-14 overflow-hidden rounded-[28px]">
          <table className="hidden w-full border-collapse text-left md:table">
            <caption className="sr-only">Human hire compared with AI hire</caption>
            <thead>
              <tr className="border-b border-ink/10">
                <th scope="col" className="w-[30%] p-5">
                  <span className="sr-only">Criteria</span>
                </th>
                <th scope="col" className="p-5 font-display text-lg font-semibold">
                  {comparison.columns.human}
                </th>
                <th scope="col" className="relative bg-white/60 p-5 font-display text-lg font-semibold">
                  <span aria-hidden className="bg-signal absolute inset-x-0 top-0 h-1" />
                  <span className="text-signal">{comparison.columns.ai}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.label} className="border-b border-ink/[0.06] last:border-0">
                  <th
                    scope="row"
                    className="p-5 text-[0.95rem] font-semibold"
                  >
                    {row.label}
                  </th>
                  <td className="p-5 align-top">
                    <div className="flex items-start gap-2.5">
                      <Mark v={row.human.verdict} />
                      <span className="text-sm leading-snug text-muted">{fill(row.human.note)}</span>
                    </div>
                  </td>
                  <td className="bg-white/60 p-5 align-top">
                    <div className="flex items-start gap-2.5">
                      <Mark v={row.ai.verdict} />
                      <span className="text-sm leading-snug">{fill(row.ai.note)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: two tinted blocks per row, so the contrast is still side-by-side */}
          <ul className="divide-y divide-ink/[0.06] md:hidden">
            {comparison.rows.map((row) => (
              <li key={row.label} className="p-4">
                <p className="mb-3 text-[0.95rem] font-semibold">{row.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-ink/[0.04] p-3">
                    <p className="label-mono mb-2 flex items-center gap-1.5 text-[0.6rem] text-muted">
                      <Mark v={row.human.verdict} compact /> {comparison.columns.human}
                    </p>
                    <p className="text-[0.8rem] leading-snug text-muted">{fill(row.human.note)}</p>
                  </div>
                  <div className="rounded-2xl bg-violet/[0.07] p-3 ring-1 ring-violet/15">
                    <p className="label-mono mb-2 flex items-center gap-1.5 text-[0.6rem] text-violet-deep">
                      <Mark v={row.ai.verdict} compact /> {comparison.columns.ai}
                    </p>
                    <p className="text-[0.8rem] leading-snug text-ink/85">{fill(row.ai.note)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <CostChart />
      </div>
    </section>
  );
}
