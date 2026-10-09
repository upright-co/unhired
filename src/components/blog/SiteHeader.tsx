import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

/** Header for pages outside the one-page home (blog, posts). The home Nav uses in-page anchors. */
export function SiteHeader() {
  return (
    <header className="no-print px-4 pt-5 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" aria-label="Unhired home" className="rounded-md">
          <Logo className="h-7" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/blog"
            className="rounded-full px-3 py-2 text-[0.94rem] font-medium text-muted transition-colors hover:bg-white/70 hover:text-ink"
          >
            Blog
          </Link>
          <Link href="/assessment" className="btn btn-primary px-4 py-2.5 text-sm sm:px-5">
            Take Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
