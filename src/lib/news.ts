import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Marked } from "marked";

/**
 * AI Updates: short, plain-English articles behind Brandon's daily personal posts
 * (content/personal-posts/README.md). Markdown files in /content/news; the filename is the slug.
 * They inform and never sell; the only offer is the author box at the bottom of the page.
 */

const NEWS_DIR = path.join(process.cwd(), "content", "news");

export type NewsSource = { label: string; url: string };
export type NewsMeta = {
  slug: string;
  title: string;
  description: string;
  published: string;
  /** "Alberta", "AI news" or "AI Employee": shown as the eyebrow. */
  topic: string;
  /** Hero image under /public, e.g. /news/<slug>.png (the post's own image). */
  image?: string;
  sources: NewsSource[];
  readingMinutes: number;
};
export type NewsArticle = NewsMeta & { html: string };

function readFile(slug: string) {
  const raw = fs.readFileSync(path.join(NEWS_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const toDate = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
  const meta: NewsMeta = {
    slug,
    title: data.title,
    description: data.description,
    published: toDate(data.published),
    topic: data.topic ?? "AI news",
    image: data.image,
    sources: data.sources ?? [],
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 230)),
  };
  return { meta, content };
}

function slugs(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllNews(): NewsMeta[] {
  return slugs()
    .map((s) => readFile(s).meta)
    .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug));
}

export function getNews(slug: string): NewsArticle | null {
  if (!slugs().includes(slug)) return null;
  const { meta, content } = readFile(slug);
  return { ...meta, html: new Marked({ gfm: true }).parse(content) as string };
}
