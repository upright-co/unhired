/**
 * Renders the image for one of Brandon's personal posts (Facebook, LinkedIn, X): a plain
 * "update" card built to stop the scroll. 1080x1350, headless Chrome, no paid image tools.
 *   node scripts/post-image.mjs <day.json> [slug]     (one slug, or every post in the file)
 * Output: brand/personal-posts/<date>/<slug>.png
 *
 * Each post in day.json has an `image` spec:
 * {
 *   "label": "ALBERTA AI UPDATE",                      // the small tag above the headline
 *   "headline": "Alberta wants AI data centres *600 metres* from homes",   // *...* = yellow
 *   "layout": "photo" | "stat" | "list",
 *   "photoUrl": "https://...jpg",                      // photo: the story's own picture, downloaded (needs credit)
 *   "photo": "robot-desk-a.png", "pos": "50% 30%",     // photo: or a file in brand/ads/photos
 *   "credit": "Photo: ...",                            // photo: optional credit, top right
 *   "circle": true,                                    // photo: red hand-drawn circle + arrow
 *   "stat": "12,000", "statLabel": "extra MRI scans",  // stat: the huge number and its label
 *   "rows": ["Answers every call", "Books the visit"], // list: 3-5 short lines
 *   "theme": "navy" | "black" | "red" | "green" | "violet"
 * }
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const day = JSON.parse(readFileSync(process.argv[2], "utf8"));
const only = process.argv[3];
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const outDir = path.join(root, "brand/personal-posts", day.date);
mkdirSync(path.join(outDir, "html"), { recursive: true });

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hl = (s) => esc(s).replace(/\*([^*]+)\*/g, "<b>$1</b>");
const THEMES = {
  navy: { bg: "#0b1220", tag: "#2f6bff", hi: "#ffd60a" },
  black: { bg: "#0a0a0a", tag: "#e3150f", hi: "#ffd60a" },
  red: { bg: "#1a0606", tag: "#e3150f", hi: "#ffffff" },
  green: { bg: "#06170f", tag: "#16a34a", hi: "#ffd60a" },
  violet: { bg: "#120a24", tag: "#8b5cf6", hi: "#ffd60a" },
};

function html(spec) {
  const t = THEMES[spec.theme ?? "navy"];
  const layout = spec.layout ?? (spec.photo || spec.photoFile ? "photo" : spec.stat ? "stat" : "list");
  const words = spec.headline.replace(/\*/g, "").length;
  const size = spec.size ?? (words > 80 ? 68 : words > 60 ? 78 : words > 42 ? 88 : 100);
  let top = "";
  if (layout === "photo") {
    const file = spec.photoFile ?? path.join(root, "brand/ads/photos", spec.photo);
    if (!existsSync(file)) throw new Error(`No photo ${file}`);
    top = `<div class="ph" style="background-image:url(file://${file});background-position:${spec.pos ?? "50% 35%"}"></div>
    ${spec.credit ? `<div class="credit">${esc(spec.credit)}</div>` : ""}
    ${spec.circle ? `<svg class="mark" viewBox="0 0 1080 720"><ellipse cx="${spec.cx ?? 560}" cy="${spec.cy ?? 380}" rx="${spec.rx ?? 300}" ry="${spec.ry ?? 170}" fill="none" stroke="#ff1f1f" stroke-width="12" transform="rotate(-4 560 380)"/><path d="M${(spec.cx ?? 560) + 330} ${(spec.cy ?? 380) - 250} l-120 110 m6 -62 l-6 62 l62 -4" fill="none" stroke="#ff1f1f" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}`;
  } else if (layout === "stat") {
    top = `<div class="stat"><div class="num">${esc(spec.stat)}</div><div class="sl">${esc(spec.statLabel ?? "")}</div></div>`;
  } else {
    top = `<div class="list">${(spec.rows ?? []).map((r, i) => `<div class="li"><span>${i + 1}</span><p>${hl(r)}</p></div>`).join("")}</div>`;
  }
  return page(spec, t, layout, size, top);
}

function page(spec, t, layout, size, top) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;600;700;800;900&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden;background:${t.bg};-webkit-font-smoothing:antialiased;font-family:Inter,sans-serif;color:#fff}
.top{position:absolute;left:0;right:0;top:0;height:720px;overflow:hidden}
.ph{position:absolute;inset:0;background-size:cover}
.top.photo:after{content:"";position:absolute;left:0;right:0;bottom:0;height:200px;background:linear-gradient(180deg,transparent,${t.bg})}
.credit{position:absolute;top:22px;right:24px;background:rgba(0,0,0,.6);padding:8px 14px;border-radius:6px;font:600 20px Inter;z-index:2}
.mark{position:absolute;inset:0;width:1080px;height:720px;z-index:2}
.stat{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 60px 0}
.num{font:400 ${String(spec.stat ?? "").length > 6 ? 250 : 330}px/0.95 Anton;color:${t.hi};letter-spacing:-2px}
.sl{margin-top:22px;font:800 46px/1.15 Inter;text-transform:uppercase;letter-spacing:1px;text-align:center;color:rgba(255,255,255,.88)}
.list{position:absolute;left:64px;right:64px;top:70px;display:flex;flex-direction:column;gap:22px}
.li{display:flex;align-items:center;gap:26px;background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.12);border-radius:22px;padding:24px 30px}
.li span{flex:none;width:76px;height:76px;border-radius:50%;background:${t.tag};display:flex;align-items:center;justify-content:center;font:400 44px Anton}
.li p{font:700 40px/1.2 Inter}
.li b,.h b{color:${t.hi};font-weight:inherit}
.bot{position:absolute;left:60px;right:60px;top:716px;bottom:96px;display:flex;flex-direction:column;justify-content:center}
.tag{align-self:flex-start;background:${t.tag};color:#fff;font:800 32px/1 Inter;letter-spacing:1.5px;padding:14px 22px;border-radius:10px;text-transform:uppercase;margin-bottom:26px}
.h{font:900 ${size}px/1.06 Inter;letter-spacing:-2.5px}
.foot{position:absolute;left:60px;right:60px;bottom:40px;display:flex;justify-content:space-between;font:600 26px Inter;color:rgba(255,255,255,.62)}
</style></head><body>
<div class="top ${layout}">${top}</div>
<div class="bot"><div class="tag">${esc(spec.label)}</div><div class="h">${hl(spec.headline)}</div></div>
<div class="foot"><span>Brandon Upright</span><span>${esc(spec.foot ?? "Daily AI updates for Alberta")}</span></div>
</body></html>`;
}

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
for (const post of day.posts) {
  if (only && post.slug !== only) continue;
  // photoUrl: the story's own picture (find it with scripts/og-image.mjs). It needs a credit.
  if (post.image.photoUrl) {
    if (!post.image.credit) throw new Error(`${post.slug}: photoUrl needs a credit ("Photo: <source>")`);
    const r = await fetch(post.image.photoUrl, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
    const type = r.headers.get("content-type") ?? "";
    if (!r.ok || !type.startsWith("image/")) throw new Error(`${post.slug}: couldn't download the photo (${r.status} ${type})`);
    mkdirSync(path.join(outDir, "src"), { recursive: true });
    post.image.photoFile = path.join(outDir, "src", `${post.slug}.${type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg"}`);
    writeFileSync(post.image.photoFile, Buffer.from(await r.arrayBuffer()));
    post.image.layout = "photo";
  }
  const file = path.join(outDir, "html", `${post.slug}.html`);
  writeFileSync(file, html(post.image));
  execFileSync(chrome, ["--headless=new", "--hide-scrollbars", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=5000",
    "--window-size=1080,1350", `--screenshot=${path.join(outDir, `${post.slug}.png`)}`, `file://${file}`], { stdio: "ignore" });
  console.log("rendered", post.slug);
}
