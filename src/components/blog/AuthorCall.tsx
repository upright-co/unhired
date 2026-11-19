import { links } from "@/config";
import { authors } from "@/content/authors";

/**
 * "About the author" with the one offer an article is allowed to make: a call with Brandon.
 * Articles inform and never sell, so this box at the very end is where a reader can take a next step.
 */
export function AuthorCall() {
  const a = authors.brandon;
  return (
    <section aria-label="About the author" className="mt-14 rounded-3xl glass p-6 sm:p-8">
      <p className="label-mono text-muted">About the author</p>
      <div className="mt-4 flex gap-4">
        <span aria-hidden className="bg-signal grid size-12 shrink-0 place-items-center rounded-full font-display font-semibold text-white">
          B
        </span>
        <div>
          <p className="font-semibold text-ink">{a.name}</p>
          <p className="mt-1.5 leading-relaxed text-muted">
            Brandon lives in Edmonton and has spent the last four years building AI systems for businesses. He writes about AI every day for
            people in Alberta who want to know what it means for their work and their business.
          </p>
          {a.links.length > 0 && (
            <p className="mt-2 flex gap-4 text-sm">
              {a.links.map((l) => (
                <a key={l.href} href={l.href} rel="me noopener" className="font-medium text-violet-deep hover:underline">
                  {l.label}
                </a>
              ))}
            </p>
          )}
        </div>
      </div>
      {links.articleCall && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
          <p className="max-w-md font-display text-lg font-semibold tracking-tight text-ink">
            Your AI Game Plan: a free 20-minute call with Brandon to see where AI fits in your business.
          </p>
          <a href={links.articleCall} target="_blank" rel="noopener" className="btn btn-primary px-6 py-3 text-sm">
            Book your AI Game Plan
          </a>
        </div>
      )}
    </section>
  );
}
