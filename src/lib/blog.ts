import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Marked } from "marked";
import { authors, type Author } from "@/content/authors";

/**
 * Blog posts are Markdown files in /content/blog. The filename is the URL slug.
 * Frontmatter fields are documented in content/blog/README.md.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type FaqEntry = { q: string; a: string };

export type PostMeta = {
  slug: string;
  title: string;
  /** <title> tag. Falls back to `title`. */
  seoTitle: string;
  description: string;
  /** The search term this post is written to rank for. */
  keyword: string;
  category: string;
  published: string;
  updated: string;
  author: Author;
  /** One-sentence definition shown in a highlighted box under the intro (featured-snippet bait). */
  definition?: { term: string; text: string };
  takeaways: string[];
  faq: FaqEntry[];
  related: string[];
  /** Pillar posts are featured at the top of /blog. */
  pillar: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
  toc: { id: string; text: string }[];
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** The TOC is rendered as React text, so undo the escaping marked applied for HTML. */
function decodeEntities(text: string): string {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

const CTA_HTML = `<aside class="article-cta">
  <p class="article-cta-eyebrow">Free · About 3 minutes</p>
  <p class="article-cta-title">Find out what an AI Employee could take off your plate.</p>
  <p class="article-cta-body">Tell us the role you're about to hire for. The AI Employee Assessment breaks the job down task by task and shows what you'd save.</p>
  <a class="btn btn-primary article-cta-btn" href="/assessment">Take Assessment</a>
</aside>`;

function render(markdown: string) {
  const toc: { id: string; text: string }[] = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2) toc.push({ id, text: decodeEntities(text.replace(/<[^>]+>/g, "")) });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      table(token) {
        // Wrap tables so they scroll sideways on phones instead of breaking the layout.
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="article-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  const html = (marked.parse(markdown) as string).replace(/<!--\s*cta\s*-->/g, CTA_HTML);
  return { html, toc };
}

function readFile(slug: string) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const author = authors[data.author as keyof typeof authors] ?? authors.unhired;
  const toDate = (d: unknown) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
  const meta: PostMeta = {
    slug,
    title: data.title,
    seoTitle: data.seoTitle ?? data.title,
    description: data.description,
    keyword: data.keyword ?? "",
    category: data.category ?? "Guides",
    published: toDate(data.published),
    updated: toDate(data.updated ?? data.published),
    author,
    definition: data.definition,
    takeaways: data.takeaways ?? [],
    faq: data.faq ?? [],
    related: data.related ?? [],
    pillar: Boolean(data.pillar),
    readingMinutes: Math.max(1, Math.round(words / 230)),
  };
  return { meta, content, draft: Boolean(data.draft) };
}

function slugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(/\.md$/, ""));
}

/** Drafts are visible in `next dev` so they can be previewed, and hidden in production builds. */
const showDrafts = process.env.NODE_ENV !== "production";

export function getAllPosts(): PostMeta[] {
  return slugs()
    .map(readFile)
    .filter((p) => showDrafts || !p.draft)
    .map((p) => p.meta)
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getPost(slug: string): Post | null {
  if (!slugs().includes(slug)) return null;
  const { meta, content, draft } = readFile(slug);
  if (draft && !showDrafts) return null;
  return { ...meta, ...render(content) };
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
