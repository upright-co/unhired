/**
 * Sanity-checks blog posts before publishing: frontmatter fields, slugs in `related`,
 * a link to the pillar post, no duplicate keywords, and everything needed to republish the post on
 * LinkedIn, Medium and Substack (syndication block, cover image, publish kit, no Markdown tables).
 *   node scripts/check-blog.mjs            (all posts)
 *   node scripts/check-blog.mjs <slug>     (one post, still checked against the rest)
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dir = path.join(root, "content/blog");
const files = readdirSync(dir).filter((f) => f.endsWith(".md") && f !== "README.md" && f !== "BACKLOG.md");
const posts = files.map((f) => ({ slug: f.replace(/\.md$/, ""), ...matter(readFileSync(path.join(dir, f), "utf8")) }));
const slugs = new Set(posts.map((p) => p.slug));
const only = process.argv[2];
const errors = [];

for (const p of posts) {
  if (only && p.slug !== only) continue;
  const d = p.data, e = (m) => errors.push(`${p.slug}: ${m}`);
  if (!/^[a-z0-9-]+$/.test(p.slug)) e("slug must be kebab-case");
  for (const k of ["title", "description", "keyword", "published"]) if (!d[k]) e(`missing ${k}`);
  const pub = d.published instanceof Date ? d.published.toISOString().slice(0, 10) : String(d.published ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pub)) e("published must be YYYY-MM-DD");
  if (d.description && (d.description.length < 110 || d.description.length > 210)) e(`description is ${d.description.length} chars (aim 150-160)`);
  for (const r of d.related ?? []) if (!slugs.has(r)) e(`related slug not found: ${r}`);
  for (const f of d.faq ?? []) if (!f.q || !f.a) e("faq entries need q and a");
  if (p.slug !== "what-is-an-ai-employee" && !p.content.includes("/blog/what-is-an-ai-employee")) e("must link to the pillar /blog/what-is-an-ai-employee");
  if (!p.content.includes("<!-- cta -->")) e("needs at least one <!-- cta -->");
  if (p.content.split(/\s+/).length < 900) e("body is under 900 words");
  const dup = posts.find((o) => o.slug !== p.slug && String(o.data.keyword).toLowerCase() === String(d.keyword).toLowerCase());
  if (dup) e(`keyword duplicates ${dup.slug}`);
  if (/—/.test(p.content)) e("contains em dashes; rewrite those sentences");
  // Every article on the site is republished on LinkedIn, Medium and Substack (SEO), so every post,
  // comparisons included, needs its syndication block, a cover and a built kit.
  const syn = d.syndication ?? {};
  for (const k of ["cover", "linkedin_title", "substack_subtitle", "tags", "share_text", "page_caption"]) if (!syn[k]) e(`syndication.${k} missing (see content/blog/README.md)`);
  if (syn.cover && !existsSync(path.join(root, "public", syn.cover))) e(`cover image not found: public${syn.cover} (run scripts/article-images.mjs)`);
  if (!existsSync(path.join(root, "public/kits", `${p.slug}.json`))) e(`no publish kit (run node scripts/publish-kit.mjs ${p.slug})`);
  if (/^\|.+\|\s*$/m.test(p.content)) e("Markdown table: LinkedIn, Medium and Substack can't show tables; use a table image");
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: ${only ?? `${posts.length} posts`}`);
