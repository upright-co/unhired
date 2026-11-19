import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config";
import { formatDate } from "@/lib/blog";
import { getAllNews, getNews } from "@/lib/news";
import { SiteHeader } from "@/components/blog/SiteHeader";
import { JsonLd } from "@/components/blog/JsonLd";
import { AuthorCall } from "@/components/blog/AuthorCall";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Section";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllNews().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = getNews((await params).slug);
  if (!post) return {};
  const url = `/news/${post.slug}`;
  const images = post.image ? [{ url: post.image, width: 1080, height: 1350, alt: post.title }] : undefined;
  return {
    title: { absolute: `${post.title} · Brandon Upright` },
    description: post.description,
    alternates: { canonical: url },
    authors: [{ name: "Brandon Upright" }],
    openGraph: { type: "article", url, title: post.title, description: post.description, publishedTime: post.published, images },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: post.image ? [post.image] : undefined },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<Params> }) {
  const post = getNews((await params).slug);
  if (!post) notFound();
  const base = siteConfig.url.replace(/\/$/, "");
  const url = `${base}/news/${post.slug}`;
  const more = getAllNews()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 4);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.title,
          description: post.description,
          mainEntityOfPage: url,
          url,
          ...(post.image ? { image: `${base}${post.image}` } : {}),
          datePublished: post.published,
          author: { "@type": "Person", name: "Brandon Upright" },
          publisher: { "@id": `${base}/#organization` },
        }}
      />
      <SiteHeader plain />

      <main id="main" className="px-4 sm:px-6">
        <article className="mx-auto max-w-[720px] pt-10 pb-8 sm:pt-14">
          <nav aria-label="Breadcrumb" className="label-mono flex items-center gap-1.5 text-muted">
            <Link href="/news" className="hover:text-ink">
              AI Updates
            </Link>
            <ChevronRight aria-hidden className="size-3.5" />
            <span>{post.topic}</span>
          </nav>
          <div className="mt-6">
            <Eyebrow>{post.topic}</Eyebrow>
          </div>
          <h1 className="mt-4 text-[2.1rem] leading-[1.08] font-bold tracking-[-0.035em] sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
          <p className="label-mono mt-5 border-t border-ink/10 pt-4 text-muted">
            Brandon Upright · <time dateTime={post.published}>{formatDate(post.published)}</time> · {post.readingMinutes} min read
          </p>

          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image} alt={post.title} width={1080} height={1350} className="mx-auto mt-8 w-full max-w-[460px] rounded-2xl" />
          )}

          <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />

          {post.sources.length > 0 && (
            <section aria-labelledby="sources" className="mt-12 border-t border-ink/10 pt-6">
              <h2 id="sources" className="label-mono text-muted">
                Sources
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener nofollow" className="font-medium text-violet-deep hover:underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <AuthorCall />

          {more.length > 0 && (
            <section aria-labelledby="more" className="mt-14 border-t border-ink/10 pt-8">
              <h2 id="more" className="label-mono text-muted">
                More AI updates
              </h2>
              <ul className="mt-3 divide-y divide-ink/10">
                {more.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/news/${m.slug}`} className="block py-4 font-display text-lg font-semibold tracking-tight hover:text-violet-deep">
                      {m.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>

      <Footer minimal />
    </>
  );
}
