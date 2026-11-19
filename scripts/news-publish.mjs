/**
 * Publishes the articles behind one day of Brandon's personal posts to unhired.io/news.
 *   node scripts/news-publish.mjs content/personal-posts/<date>.json
 * For every post with an `article`, writes content/news/<slug>.md and copies the post image to
 * public/news/<slug>.png (run scripts/post-image.mjs first). Posts with `link` instead (AI Employee
 * posts that point at a /blog article) are skipped. Prints the files to git add.
 *
 * article: { "title", "description", "body": ["paragraph", "## Heading", "- bullet\n- bullet", ...],
 *            "sources": [{ "label": "Government of Alberta: ...", "url": "https://..." }] }
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const day = JSON.parse(readFileSync(process.argv[2], "utf8"));
const TOPIC = { alberta: "Alberta", ai_news: "AI news", ai_employee: "AI Employee" };
const q = (s) => JSON.stringify(String(s));
mkdirSync(path.join(root, "content/news"), { recursive: true });
mkdirSync(path.join(root, "public/news"), { recursive: true });

const files = [];
for (const p of day.posts) {
  if (!p.article) {
    if (!p.link) throw new Error(`${p.slug}: needs an article or a link`);
    continue;
  }
  const a = p.article;
  for (const k of ["title", "description", "body", "sources"]) if (!a[k]?.length) throw new Error(`${p.slug}: article.${k} is missing`);
  const words = a.body.join(" ").split(/\s+/).length;
  if (words < 250) throw new Error(`${p.slug}: article is ${words} words; write at least 250`);
  const md = path.join(root, "content/news", `${p.slug}.md`);
  if (existsSync(md) && !readFileSync(md, "utf8").includes(`published: ${day.date}`)) throw new Error(`${p.slug}: content/news/${p.slug}.md already exists from another day; pick a new slug`);
  const png = path.join(root, "brand/personal-posts", day.date, `${p.slug}.png`);
  const hasImage = existsSync(png);
  if (hasImage) copyFileSync(png, path.join(root, "public/news", `${p.slug}.png`));
  writeFileSync(md, `---
title: ${q(a.title)}
description: ${q(a.description)}
published: ${day.date}
topic: ${q(TOPIC[p.pillar] ?? "AI news")}
${hasImage ? `image: "/news/${p.slug}.png"\n` : ""}sources:
${a.sources.map((s) => `  - label: ${q(s.label)}\n    url: ${q(s.url)}`).join("\n")}
---

${a.body.join("\n\n")}
`);
  files.push(`content/news/${p.slug}.md`, ...(hasImage ? [`public/news/${p.slug}.png`] : []));
}
console.log(files.join("\n"));
