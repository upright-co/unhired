import { links } from "@/config";

/**
 * The one offer an article is allowed to make: the AI Business Diagnosis call.
 * Articles inform and never sell, so this box at the very end is where a reader can take a next step.
 */
export function AuthorCall() {
  if (!links.articleCall) return null;
  return (
    <section aria-label="Book a call" className="mt-14 rounded-3xl glass p-6 sm:p-8">
      <p className="max-w-xl font-display text-lg font-semibold tracking-tight text-ink">
        Your AI Business Diagnosis: a free 20-minute call with our team to see where AI fits in your business.
      </p>
      <a href={links.articleCall} target="_blank" rel="noopener" className="btn btn-primary mt-5 inline-flex px-6 py-3 text-sm">
        Book your AI Business Diagnosis
      </a>
    </section>
  );
}
