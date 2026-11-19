import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/blog";
import { getAllNews } from "@/lib/news";
import { SiteHeader } from "@/components/blog/SiteHeader";
import { Footer } from "@/components/sections/Footer";
import { Eyebrow } from "@/components/ui/Section";

const title = "AI Updates for Alberta";
const description =
  "What is happening with AI, in plain English, for people who live and run businesses in Alberta. Written every day by Brandon Upright.";

export const metadata: Metadata = {
  title: { absolute: "AI Updates for Alberta · Brandon Upright" },
  description,
  alternates: { canonical: "/news" },
  openGraph: { type: "website", url: "/news", title, description },
};

export default function NewsIndex() {
  const posts = getAllNews();
  return (
    <>
      <SiteHeader plain />
      <main id="main" className="px-4 sm:px-6">
        <header className="mx-auto max-w-4xl pt-14 pb-8 sm:pt-20">
          <Eyebrow>AI Updates</Eyebrow>
          <h1 className="mt-4 text-[2.4rem] leading-[1.05] font-bold tracking-[-0.04em] sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        </header>
        <ul className="mx-auto max-w-4xl divide-y divide-ink/10 border-t border-ink/10 pb-10">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/news/${p.slug}`} className="group flex items-center gap-5 py-5">
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" loading="lazy" className="h-[100px] w-[80px] shrink-0 rounded-lg object-cover" />
                )}
                <span>
                  <span className="label-mono text-muted">
                    {p.topic} · {formatDate(p.published)}
                  </span>
                  <span className="mt-1 block font-display text-xl font-semibold tracking-tight group-hover:text-violet-deep sm:text-2xl">{p.title}</span>
                  <span className="mt-1 block text-muted">{p.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer minimal />
    </>
  );
}
