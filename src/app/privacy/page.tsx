import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config";
import { privacy } from "@/content/privacy";
import { Footer } from "@/components/sections/Footer";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Unhired collects, why, who processes it, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <header className="px-4 pt-5 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" aria-label="Unhired home">
            <Logo className="h-7" />
          </Link>
          <Link href="/assessment" className="btn btn-secondary px-4 py-2.5 text-sm">
            Take Assessment
          </Link>
        </div>
      </header>

      <main className="px-4 py-14 sm:px-6">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Privacy policy</h1>
          <p className="label-mono mt-4 text-muted">Last updated: {privacy.lastUpdated}</p>

          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted">
            {privacy.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {privacy.sections.map((s) => (
            <section key={s.heading} className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{s.heading}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {s.list && (
                <ul className="mt-4 space-y-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-muted">
                      <span aria-hidden className="bg-signal mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="glass mt-12 rounded-3xl p-6">
            <h2 className="text-xl font-semibold tracking-tight text-ink">Contact us</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Questions, access requests or deletion requests:{" "}
              <a
                className="font-medium text-violet-deep underline underline-offset-4"
                href={`mailto:${siteConfig.contactEmail}`}
              >
                {siteConfig.contactEmail}
              </a>
            </p>
          </section>
        </article>
      </main>

      <Footer minimal />
    </>
  );
}
