import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config";
import { formatDate, getAllPosts } from "@/lib/blog";
import { SiteHeader } from "@/components/blog/SiteHeader";
import { JsonLd } from "@/components/blog/JsonLd";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Section";

const title = "The AI Employee Blog";
const description =
  "Plain-English guides to AI Employees: what they are, what they cost, how they compare to AI agents and human hires, and which roles they can fill in your business.";

export const metadata: Metadata = {
  title: { absolute: "AI Employee Blog: Guides for Business Owners · Unhired" },
  description,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title, description, images: ["/opengraph-image.jpg"] },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.pillar) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);
  const base = siteConfig.url.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: title,
          description,
          url: `${base}/blog`,
          publisher: { "@id": `${base}/#organization` },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${base}/blog/${p.slug}`,
            datePublished: p.published,
          })),
        }}
      />
      <SiteHeader />

      <main id="main" className="px-4 sm:px-6">
        <header className="relative mx-auto max-w-6xl pt-14 pb-12 sm:pt-20">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
          <Eyebrow>The AI Employee Blog</Eyebrow>
          <h1 className="mt-4 max-w-4xl text-[2.6rem] leading-[1.04] font-bold tracking-[-0.04em] sm:text-7xl sm:tracking-[-3px]">
            Everything you need to know about <span className="text-signal">AI Employees</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{description}</p>
        </header>

        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-ink text-white md:grid-cols-[1.4fr_1fr]"
          >
            <div aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0" />
            <div
              aria-hidden
              className="bg-signal pointer-events-none absolute -right-24 -bottom-32 h-96 w-96 rounded-full opacity-45 blur-3xl"
            />
            <div className="relative p-8 sm:p-12">
              <p className="label-mono text-white/60">Start here · {featured.readingMinutes} min read</p>
              <h2 className="mt-4 text-3xl leading-[1.08] font-semibold tracking-[-0.035em] sm:text-5xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg text-white/75">{featured.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 font-semibold">
                Read the guide
                <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            <div className="relative hidden items-center justify-center p-8 md:flex">
              <Image
                src="/avatars/ai-receptionist.png"
                alt=""
                width={360}
                height={360}
                className="animate-float h-auto w-full max-w-[300px] rounded-[2rem] shadow-2xl ring-1 ring-white/20"
                priority
              />
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <section aria-labelledby="all-posts" className="mx-auto mt-16 max-w-6xl">
            <h2 id="all-posts" className="label-mono text-muted">
              All guides
            </h2>
            <ol className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
              {rest.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group grid gap-2 py-7 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center sm:gap-8"
                  >
                    <span className="label-mono text-muted">
                      <time dateTime={p.published}>{formatDate(p.published)}</time>
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-semibold tracking-tight group-hover:text-violet-deep">
                        {p.title}
                      </span>
                      <span className="mt-1.5 block leading-relaxed text-muted">{p.description}</span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="hidden size-5 text-violet-deep transition-transform group-hover:translate-x-1 sm:block"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <Footer minimal />
    </>
  );
}
