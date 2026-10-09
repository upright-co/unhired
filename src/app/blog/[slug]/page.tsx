import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { SiteHeader } from "@/components/blog/SiteHeader";
import { JsonLd } from "@/components/blog/JsonLd";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Section";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: { absolute: post.seoTitle },
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: post.author.name }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [post.author.name],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const base = siteConfig.url.replace(/\/$/, "");
  const url = `${base}/blog/${post.slug}`;
  const all = getAllPosts();
  const related = post.related
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      mainEntityOfPage: url,
      url,
      image: `${url}/opengraph-image`,
      datePublished: post.published,
      dateModified: post.updated,
      keywords: post.keyword,
      author: {
        "@type": post.author.name.startsWith("The ") ? "Organization" : "Person",
        name: post.author.name,
        jobTitle: post.author.role,
        ...(post.author.links.length ? { sameAs: post.author.links.map((l) => l.href) } : {}),
      },
      publisher: { "@id": `${base}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    ...(post.faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
    ...(post.definition
      ? [
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: post.definition.term,
            description: post.definition.text,
            url,
          },
        ]
      : []),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <SiteHeader />

      <main id="main" className="px-4 sm:px-6">
        {/* Title block */}
        <header className="relative mx-auto max-w-6xl pt-12 pb-10 sm:pt-16">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
          <nav aria-label="Breadcrumb" className="label-mono flex items-center gap-1.5 text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <ChevronRight aria-hidden className="size-3.5" />
            <Link href="/blog" className="hover:text-ink">
              Blog
            </Link>
          </nav>
          <div className="mt-8 max-w-4xl">
            <Eyebrow>{post.category}</Eyebrow>
            <h1 className="mt-4 text-[2.4rem] leading-[1.05] font-bold tracking-[-0.04em] sm:text-6xl sm:tracking-[-2.5px]">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">{post.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink/10 pt-5 text-sm">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="bg-signal grid size-10 place-items-center rounded-full font-display text-sm font-semibold text-white"
                >
                  {post.author.name.replace(/^The /, "").charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{post.author.name}</span>
                  <span className="text-muted">{post.author.role}</span>
                </span>
              </div>
              <dl className="label-mono flex flex-wrap gap-x-6 gap-y-1 text-muted">
                <div className="flex gap-1.5">
                  <dt>{post.updated !== post.published ? "Updated" : "Published"}</dt>
                  <dd>
                    <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                  </dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="sr-only">Reading time</dt>
                  <dd>{post.readingMinutes} min read</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 pb-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
          <article className="min-w-0 max-w-[720px]">
            {post.definition && (
              <div className="definition-box">
                <p className="label-mono text-violet-deep">Definition</p>
                <p className="mt-2 text-lg leading-relaxed text-ink">
                  <dfn className="font-semibold not-italic">{post.definition.term}</dfn>{" "}
                  {post.definition.text}
                </p>
              </div>
            )}

            {post.takeaways.length > 0 && (
              <section aria-labelledby="takeaways" className="mt-8 border-l-2 border-violet/40 pl-6">
                <h2 id="takeaways" className="label-mono text-muted">
                  Key takeaways
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {post.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 leading-relaxed text-ink">
                      <span aria-hidden className="bg-signal mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="article-body mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.faq.length > 0 && (
              <section aria-labelledby="faq" className="mt-16">
                <h2 id="faq" className="text-3xl font-semibold tracking-[-0.03em]">
                  Frequently asked questions
                </h2>
                <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                  {post.faq.map((f) => (
                    <details key={f.q} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-semibold">
                        {f.q}
                        <span
                          aria-hidden
                          className="mt-1 text-violet-deep transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <section aria-label="About the author" className="mt-14 flex gap-4 rounded-3xl glass p-6">
              <span
                aria-hidden
                className="bg-signal grid size-12 shrink-0 place-items-center rounded-full font-display font-semibold text-white"
              >
                {post.author.name.replace(/^The /, "").charAt(0)}
              </span>
              <div>
                <p className="font-semibold text-ink">
                  {post.author.name} <span className="font-normal text-muted">· {post.author.role}</span>
                </p>
                <p className="mt-1.5 leading-relaxed text-muted">{post.author.bio}</p>
                {post.author.links.length > 0 && (
                  <p className="mt-2 flex gap-4 text-sm">
                    {post.author.links.map((l) => (
                      <a key={l.href} href={l.href} rel="me noopener" className="font-medium text-violet-deep hover:underline">
                        {l.label}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </section>
          </article>

          {/* On this page */}
          {post.toc.length > 2 && (
            <aside className="hidden lg:block">
              <nav aria-label="On this page" className="sticky top-8">
                <p className="label-mono text-muted">On this page</p>
                <ol className="mt-4 space-y-2.5 border-l border-ink/10">
                  {post.toc.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="-ml-px block border-l border-transparent pl-4 text-sm leading-snug text-muted hover:border-violet hover:text-ink"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
                <Link href="/assessment" className="btn btn-primary mt-8 w-full px-4 py-3 text-sm">
                  Take Assessment
                </Link>
              </nav>
            </aside>
          )}
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mx-auto max-w-6xl border-t border-ink/10 pt-12">
            <h2 id="related" className="label-mono text-muted">
              Keep reading
            </h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group flex items-center justify-between gap-6 py-5"
                  >
                    <span>
                      <span className="block font-display text-xl font-semibold tracking-tight group-hover:text-violet-deep sm:text-2xl">
                        {r.title}
                      </span>
                      <span className="mt-1 block text-muted">{r.description}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-5 shrink-0 text-violet-deep transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-center text-white sm:px-12">
          <div aria-hidden className="bg-grid-dark pointer-events-none absolute inset-0" />
          <div
            aria-hidden
            className="bg-signal pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Your next hire is an <span className="text-signal">AI Employee</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
              Find out how much of the role it can handle, and what you'd save, before you post the job.
            </p>
            <Link href="/assessment" className="btn btn-primary mt-8 px-7 py-3.5">
              Take Assessment
            </Link>
          </div>
        </section>
      </main>

      <Footer minimal />
    </>
  );
}
