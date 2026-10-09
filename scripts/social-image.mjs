/**
 * Renders a branded 4:5 social image (LinkedIn + Facebook) from a small JSON spec,
 * with headless Chrome. No API or image-generation credits.
 *   node scripts/social-image.mjs <spec.json>
 * Output: public/social/<slug>.png (2160x2700), served at https://unhired.io/social/<slug>.png
 *
 * Spec:
 * {
 *   "slug": "ai-receptionist",                 // same as the blog post slug
 *   "eyebrow": "AI Employee roles",
 *   "title": "What an",                         // plain part of the headline
 *   "highlight": "AI Receptionist does",        // gradient part (goes after title)
 *   "sub": "One short line under the headline.",
 *   "layout": "list" | "compare",
 *   "avatar": "ai-receptionist",                // optional: brand/avatars/<name>.png
 *   "cardLabel": "Employee file",               // list: small label in the card header
 *   "cardTitle": "AI Receptionist",             // list: card header title (header hidden if absent)
 *   "badge": "On shift",                        // list: optional pill on the right of the header
 *   "rows": [["Answers calls", "Every call, 24/7, in your words"], ...],   // list: 3-7 rows
 *   "left": "Hiring a person", "right": "AI Employee",                     // compare: column heads
 *   "compare": [["Starts", "4-8 weeks", "In days"], ...]                     // compare: 3-6 rows
 * }
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const spec = JSON.parse(readFileSync(process.argv[2], "utf8"));
if (!/^[a-z0-9-]+$/.test(spec.slug ?? "")) throw new Error("spec.slug must be a kebab-case slug");

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const avatar = spec.avatar ? `file://${root}/brand/avatars/${spec.avatar}.png` : null;
if (avatar && !existsSync(avatar.slice(7))) throw new Error(`No avatar brand/avatars/${spec.avatar}.png`);
const logo = `file://${root}/brand/posts/logo-ondark.png`;

const css = `*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden}
.b{position:relative;width:1080px;height:1350px;overflow:hidden;background:#09070F;color:#fff;font-family:'DM Sans',sans-serif}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.04) 1px,transparent 1px);background-size:54px 54px;-webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 55%,#000 20%,transparent 100%)}
.g1{position:absolute;width:700px;height:700px;border-radius:50%;background:#F65663;filter:blur(170px);opacity:.28;left:-200px;top:520px}
.g2{position:absolute;width:760px;height:760px;border-radius:50%;background:#9452F2;filter:blur(180px);opacity:.42;right:-260px;top:80px}
.wrap{position:absolute;left:80px;right:80px;top:84px;bottom:150px;display:flex;flex-direction:column}
.eyebrow{font:500 20px 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.6);display:flex;align-items:center;gap:14px}
.eyebrow i{display:block;width:34px;height:2px;background:linear-gradient(90deg,#F65663,#9452F2)}
h1{margin-top:22px;font:700 76px/1.03 'Sora',sans-serif;letter-spacing:-3px}
h1 span{background:linear-gradient(90deg,#F65663,#B07CFF);-webkit-background-clip:text;color:transparent}
.sub{margin-top:22px;font:400 27px/1.45 'DM Sans';color:rgba(255,255,255,.74);max-width:880px}
.card{margin:auto 0;border-radius:36px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 100px -40px rgba(0,0,0,.8);overflow:hidden}
.top{display:flex;align-items:center;gap:22px;padding:28px 36px;border-bottom:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03)}
.av{width:84px;height:84px;border-radius:22px;object-fit:cover;object-position:top;background:linear-gradient(135deg,rgba(246,86,99,.35),rgba(148,82,242,.35))}
.lbl{font:500 15px 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55)}
.nm{margin-top:4px;font:600 32px 'Sora';letter-spacing:-1px}
.status{margin-left:auto;display:flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;background:rgba(34,197,94,.14);border:1px solid rgba(110,231,160,.35);color:#86EFAC;font:600 19px 'DM Sans'}
.status i{width:10px;height:10px;border-radius:50%;background:#22C55E;box-shadow:0 0 0 5px rgba(34,197,94,.2)}
.row{display:grid;grid-template-columns:64px 300px 1fr;align-items:center;gap:8px;padding:ROWPADpx 36px;border-bottom:1px solid rgba(255,255,255,.08)}
.row:last-child,.r:last-child{border-bottom:0}
.n{font:500 22px 'JetBrains Mono',monospace;background:linear-gradient(90deg,#F65663,#B07CFF);-webkit-background-clip:text;color:transparent}
.k{font:600 28px/1.25 'Sora';letter-spacing:-.6px}
.v{font:400 23px/1.4 'DM Sans';color:rgba(255,255,255,.72)}
.cols{display:grid;grid-template-columns:220px 1fr 1fr;align-items:center;gap:0 18px;padding:ROWPADpx 36px}
.hdr{border-bottom:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);padding:26px 36px}
.hdr .ag{font:600 27px 'Sora';color:rgba(255,255,255,.5);letter-spacing:-.6px}
.hdr .em{display:flex;align-items:center;gap:16px;font:600 27px 'Sora';letter-spacing:-.6px}
.hdr .em img{width:60px;height:60px;border-radius:16px;object-fit:cover;object-position:top;background:linear-gradient(135deg,rgba(246,86,99,.35),rgba(148,82,242,.35))}
.hdr .em span{background:linear-gradient(90deg,#F65663,#B07CFF);-webkit-background-clip:text;color:transparent}
.r{border-bottom:1px solid rgba(255,255,255,.08)}
.r .k{font-size:25px}.r .a{font:400 22px/1.35 'DM Sans';color:rgba(255,255,255,.5)}.r .e{font:500 22px/1.35 'DM Sans'}
.foot{position:absolute;left:80px;right:80px;bottom:66px;display:flex;align-items:center;justify-content:space-between}
.foot img{height:40px}.foot p{font:500 22px 'DM Sans';color:rgba(255,255,255,.6)}`;

let card;
if (spec.layout === "compare") {
  const rows = spec.compare ?? [];
  if (rows.length < 3 || rows.length > 6) throw new Error("compare needs 3-6 rows");
  card = `<div class="card"><div class="cols hdr"><span></span><span class="ag">${esc(spec.left)}</span><span class="em">${avatar ? `<img src="${avatar}">` : ""}<span>${esc(spec.right)}</span></span></div>
${rows.map(([k, a, e]) => `<div class="cols r"><span class="k">${esc(k)}</span><span class="a">${esc(a)}</span><span class="e">${esc(e)}</span></div>`).join("\n")}</div>`;
} else {
  const rows = spec.rows ?? [];
  if (rows.length < 3 || rows.length > 7) throw new Error("list needs 3-7 rows");
  const head = spec.cardTitle
    ? `<div class="top">${avatar ? `<img class="av" src="${avatar}">` : ""}<div>${spec.cardLabel ? `<div class="lbl">${esc(spec.cardLabel)}</div>` : ""}<div class="nm">${esc(spec.cardTitle)}</div></div>${spec.badge ? `<div class="status"><i></i>${esc(spec.badge)}</div>` : ""}</div>`
    : "";
  card = `<div class="card">${head}
${rows.map(([k, v], i) => `<div class="row"><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join("\n")}</div>`;
}
const n = (spec.rows ?? spec.compare ?? []).length;
const rowPad = n >= 7 ? 22 : n === 6 ? 26 : 32;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">
<style>${css.replaceAll("ROWPAD", rowPad)}</style></head><body><div class="b">
<div class="grid"></div><div class="g1"></div><div class="g2"></div>
<div class="wrap">
 <div class="eyebrow"><i></i>${esc(spec.eyebrow)}</div>
 <h1>${esc(spec.title)} <span>${esc(spec.highlight)}</span></h1>
 ${spec.sub ? `<p class="sub">${esc(spec.sub)}</p>` : ""}
 ${card}
</div>
<div class="foot"><img src="${logo}"><p>Full guide: unhired.io/blog</p></div>
</div></body></html>`;

const tmp = path.join(root, "brand/posts", `${spec.slug}.html`);
writeFileSync(tmp, html);
mkdirSync(path.join(root, "public/social"), { recursive: true });
const out = path.join(root, "public/social", `${spec.slug}.png`);
const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--window-size=1080,1350", "--virtual-time-budget=6000", `--screenshot=${out}`, `file://${tmp}`], { stdio: "ignore" });
console.log(out);
