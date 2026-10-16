/**
 * Builds the publish kit for a blog post: one page with everything needed to republish it on
 * Medium, LinkedIn (as a newsletter article) and Substack, plus the company page caption.
 *   node scripts/publish-kit.mjs <slug>
 * Output: public/kits/<slug>.html (for people) and <slug>.json (for the draft automation), served at
 * https://unhired.io/kits/<slug>.html (noindex, and
 * /kits/ is disallowed in robots.ts). Reads the post's optional `syndication` frontmatter:
 *   cover, linkedin_title, substack_subtitle, tags[], share_text, page_caption
 *
 * unhired.io is always the original. Medium's importer sets the canonical link back to it; LinkedIn
 * and Substack can't, so the kit says to wait SYNDICATE_AFTER_DAYS (Google indexes ours first) and
 * every copy opens or closes with a link to the original.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

const SITE = "https://unhired.io";
const SYNDICATE_AFTER_DAYS = 3;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slug = process.argv[2] ?? "";
if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("usage: node scripts/publish-kit.mjs <slug>");
const { data: fm, content } = matter(readFileSync(path.join(root, "content/blog", `${slug}.md`), "utf8"));
const syn = fm.syndication ?? {};
const url = `${SITE}/blog/${slug}`;
const pub = fm.published instanceof Date ? fm.published.toISOString().slice(0, 10) : String(fm.published);
const after = new Date(`${pub}T12:00:00Z`);
after.setUTCDate(after.getUTCDate() + SYNDICATE_AFTER_DAYS);
const afterStr = after.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (u) => (u?.startsWith("/") ? SITE + u : u);
// Same text on every platform, with site links made absolute.
const body = content
  // The site's Take Assessment box is the only promotion and stays on unhired.io; copies leave it out.
  .replace(/^<!--\s*cta\s*-->\s*$/gm, "")
  .replace(/\]\((\/[^)]*)\)/g, (_, u) => `](${SITE}${u})`);
const md = new Marked({ gfm: true });
const html = (s) => md.parse(s);
const hasTable = /^\|.+\|\s*$/m.test(content);

// Split at images so LinkedIn (which can't paste images) gets text blocks and images in order.
const parts = [];
const re = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/gm;
let last = 0, m;
while ((m = re.exec(body))) {
  parts.push({ text: body.slice(last, m.index) });
  parts.push({ img: m[2], alt: m[1] });
  last = re.lastIndex;
}
parts.push({ text: body.slice(last) });

const origin = `<p><em>This article was first published on <a href="${url}">unhired.io</a>.</em></p>`;
const takeaways = (fm.takeaways ?? []).length ? `<h2>Key takeaways</h2><ul>${fm.takeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";

let n = 0;
const step = () => `<span class="n">${++n}</span>`;
const copyBlock = (label, inner, extra = "") => `<div class="blk"><div class="bar">${step()}${label}${extra}<button data-copy>Copy</button></div><div class="body">${inner}</div></div>`;
const imgBlock = (src, alt) => `<div class="blk"><div class="bar">${step()}Add image<a class="dl" href="${esc(abs(src))}" download>Download</a></div><img src="${esc(abs(src))}" alt="${esc(alt)}"><p class="alt">Alt text: ${esc(alt)}</p></div>`;
const field = (label, value) => `<div class="blk"><div class="bar">${label}<button data-copy>Copy</button></div><div class="body pre">${esc(value ?? "")}</div></div>`;

const linkedin = (() => {
  n = 0;
  // Cover and title first, so the step numbers run in the order Brandon works.
  const cover = syn.cover ? imgBlock(syn.cover, fm.title).replace("Add image", "Cover image") : "";
  const title = copyBlock("Title", `<p>${esc(syn.linkedin_title ?? fm.title)}</p>`);
  const blocks = parts.map((p) => {
    if (p.img) return imgBlock(p.img, p.alt);
    return p.text.trim() ? copyBlock("Paste text", html(p.text.trim())) : "";
  });
  return [
    cover,
    title,
    ...blocks,
    copyBlock("Last block", origin),
  ].join("\n");
})();

const substackHtml = `${origin}${html(body)}`;

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Publish kit · ${esc(fm.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;background:#f4f2f7;color:#1d1b22;font:16px/1.6 'DM Sans',-apple-system,sans-serif}
.w{max-width:860px;margin:0 auto;padding:36px 16px 120px}
.back{display:inline-block;margin:0 0 14px;padding:8px 16px;border-radius:999px;background:#fff;border:1px solid #ddd6e8;color:#1d1b22;font:600 14px inherit;text-decoration:none}.back:hover{background:#faf8fc}
.top{background:#09070F;color:#fff;border-radius:22px;padding:28px;background-image:radial-gradient(circle at 90% 0,rgba(148,82,242,.45),transparent 55%),radial-gradient(circle at 0 100%,rgba(246,86,99,.3),transparent 50%)}
.top small{font:500 12px monospace;letter-spacing:.14em;text-transform:uppercase;opacity:.6}
.top h1{font:700 26px/1.2 'Sora';margin:8px 0 12px;letter-spacing:-.5px}
.top a{color:#D4BBFF}.when{margin-top:12px;font-weight:600;color:#86EFAC}
nav{display:flex;gap:8px;margin:22px 0 18px;flex-wrap:wrap;position:sticky;top:0;padding:10px 0;background:#f4f2f7;z-index:2}
nav button{border:1px solid #ddd6e8;background:#fff;border-radius:999px;padding:9px 18px;font:600 14px inherit;cursor:pointer}
nav button.on{background:#1d1b22;color:#fff;border-color:#1d1b22}
.tab{display:none}.tab.on{display:block}
.how{background:#fff;border:1px solid #e4e0ea;border-radius:16px;padding:18px 20px 18px 40px;margin:0 0 18px}
.how li{margin:4px 0}
.blk{background:#fff;border:1px solid #e4e0ea;border-radius:16px;margin:0 0 14px;overflow:hidden}
.bar{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#faf8fc;border-bottom:1px solid #eee9f3;font-weight:600;font-size:14px}
.n{display:grid;place-items:center;min-width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#F65663,#9452F2);color:#fff;font-size:12px}
.bar button,.bar .dl,.big{margin-left:auto;border:0;border-radius:8px;padding:7px 14px;background:#1d1b22;color:#fff;font:600 13px inherit;cursor:pointer;text-decoration:none}
.bar button.ok,.big.ok{background:#16a34a}
.body{padding:4px 20px 12px}.body.pre{white-space:pre-wrap;padding:14px 20px}
.blk img{display:block;width:100%}.alt{margin:0;padding:8px 14px;font-size:13px;color:#6b6676}
.big{display:inline-block;margin:0 8px 8px 0;padding:11px 18px;font-size:14px}
.warn{background:#fff7e6;border:1px solid #f5d48a;border-radius:12px;padding:12px 16px;margin:0 0 16px;font-size:14px}
h2,h3{line-height:1.25}a{color:#5b21b6}
</style></head><body><div class="w">
<a class="back" href="https://portal.unhired.io/content">← Back to Content</a>
<div class="top"><small>Publish kit</small><h1>${esc(fm.title)}</h1>
Original: <a href="${url}">${url.replace("https://", "")}</a>
<div class="when">Republish on or after ${afterStr}, so Google indexes unhired.io first.</div></div>
<nav><button data-tab="medium" class="on">Medium</button><button data-tab="linkedin">LinkedIn article</button><button data-tab="substack">Substack</button><button data-tab="pages">Company page + Facebook</button></nav>

<section class="tab on" id="medium">
<ol class="how">
<li>Open <a href="https://medium.com/p/import" target="_blank">medium.com/p/import</a> (signed in to Medium).</li>
<li>Paste the article link and click <b>Import</b>. Medium copies the text and images and marks unhired.io as the original, so Google credits our site.</li>
<li>Check the draft, add the tags below, then <b>Publish</b>.</li>
</ol>
<button class="big" data-text="${esc(url)}">Copy article link</button>
<button class="big" data-text="${esc((syn.tags ?? []).join(", "))}">Copy tags</button>
<p>Tags: ${esc((syn.tags ?? []).join(" · ") || "AI, Small Business, Future Of Work, Automation, Artificial Intelligence")}</p>
</section>

<section class="tab" id="linkedin">
<ol class="how">
<li>On LinkedIn: <b>Write article</b>, and choose the <b>The AI Employee</b> newsletter.</li>
<li>Download the cover and upload it, then paste the title.</li>
<li>Work down the page: <b>Copy</b> each text block and paste it, and for each image click <b>Download</b> and add it with the image button.</li>
<li>Click <b>Next</b>, paste the share text at the bottom of this tab, and publish.</li>
</ol>
${hasTable ? `<div class="warn">This post has a table. LinkedIn can't show tables, so skip it or replace it with an image.</div>` : ""}
${linkedin}
${field("Share text (shown in the feed with the article)", syn.share_text ?? `${fm.description}\n\nFull article below 👇`)}
</section>

<section class="tab" id="substack">
<ol class="how">
<li>In Substack: <b>New post</b>.</li>
<li>Paste the title and subtitle.</li>
<li>Click <b>Copy whole post</b> and paste it into the body. Images come with it; if any don't, download them from the LinkedIn tab and drag them in.</li>
<li>Publish (and send it by email if you want subscribers to get it).</li>
</ol>
${hasTable ? `<div class="warn">This post has a table. Substack can't show tables, so check how it pasted.</div>` : ""}
${field("Title", fm.title)}
${field("Subtitle", syn.substack_subtitle ?? fm.description)}
<div class="blk"><div class="bar">Body<button data-copy>Copy whole post</button></div><div class="body">${takeaways}${substackHtml}</div></div>
</section>

<section class="tab" id="pages">
<ol class="how">
<li><b>Unhired LinkedIn page:</b> after your LinkedIn article is live, copy the caption below, add your article's LinkedIn link at the end, and post it from the page. The link sends readers to your newsletter, which builds your following.</li>
<li><b>Facebook page:</b> post the caption with the unhired.io link.</li>
</ol>
${field("LinkedIn page caption (add your LinkedIn article link at the end)", syn.page_caption ?? fm.description)}
${field("Facebook caption", `${syn.page_caption ?? fm.description}\n\n${url}`)}
</section>
</div>
<script>
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("nav button,.tab").forEach(x=>x.classList.remove("on"));
  b.classList.add("on");document.getElementById(b.dataset.tab).classList.add("on");
});
const done=b=>{const t=b.textContent;b.textContent="Copied";b.classList.add("ok");setTimeout(()=>{b.textContent=t;b.classList.remove("ok")},1500)};
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{
  const el=b.closest(".blk").querySelector(".body");
  try{await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([el.innerHTML],{type:"text/html"}),"text/plain":new Blob([el.innerText],{type:"text/plain"})})])}
  catch{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);document.execCommand("copy");s.removeAllRanges()}
  done(b);
});
document.querySelectorAll("[data-text]").forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(b.dataset.text);done(b)});
</script></body></html>`;

mkdirSync(path.join(root, "public/kits"), { recursive: true });
const out = path.join(root, "public/kits", `${slug}.html`);
writeFileSync(out, page);

// The same content as data, for the browser automation that saves drafts on each platform
// (it fetches https://unhired.io/kits/<slug>.json and pastes the HTML into each editor).
// LinkedIn gets the body with the "first published" line at the end; Substack gets it at the top
// after the takeaways. Images stay as absolute unhired.io URLs.
const bodyHtml = html(body);
writeFileSync(
  path.join(root, "public/kits", `${slug}.json`),
  JSON.stringify(
    {
      slug,
      url,
      published: pub,
      republish_after: after.toISOString().slice(0, 10),
      title: fm.title,
      linkedin_title: syn.linkedin_title ?? fm.title,
      substack_subtitle: syn.substack_subtitle ?? fm.description,
      tags: syn.tags ?? [],
      cover: syn.cover ? abs(syn.cover) : null,
      images: parts.filter((p) => p.img).map((p) => ({ src: abs(p.img), alt: p.alt })),
      share_text: syn.share_text ?? null,
      // The Unhired LinkedIn page links to Brandon's LinkedIn article (to grow his following);
      // Facebook links to unhired.io. The portal adds the LinkedIn link once it's saved.
      page_caption: syn.page_caption ?? fm.description,
      facebook_caption: `${syn.page_caption ?? fm.description}\n\n${url}`,
      substack_html: `${takeaways}${origin}${bodyHtml}`,
      linkedin_html: `${bodyHtml}${origin}`,
    },
    null,
    1,
  ),
);
console.log(`${out}\n${SITE}/kits/${slug}.html`);
