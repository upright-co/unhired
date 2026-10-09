/**
 * Sanity-checks blog posts before publishing: frontmatter fields, slugs in `related`,
 * a link to the pillar post, and no duplicate keywords.
 *   node scripts/check-blog.mjs            (all posts)
 *   node scripts/check-blog.mjs <slug>     (one post, still checked against the rest)
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../content/blog");
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
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: ${only ?? `${posts.length} posts`}`);
