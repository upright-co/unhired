/**
 * Renders the images for a long-form article (cover + inline infographics) with headless Chrome.
 * No API or image-generation credits.
 *   node scripts/article-images.mjs <slug>
 * Reads content/images/<slug>.json and writes public/blog/<slug>/<NN>-<name>.jpg (1.5x), served at
 * https://unhired.io/blog/<slug>/<file>. Reference them in the post body as ![alt](/blog/<slug>/<file>).
 *
 * Spec: { "images": [ { "type": "...", "name": "file-name", ...fields }, ... ] }
 *   cover     1920x1080 cover (LinkedIn article cover). eyebrow, title, highlight, sub, avatar, series
 *   posting   a job posting, recreated with the company name and address blacked out.
 *             title, salary, chips[], posted, duties[], qualifications, location, note
 *   breakdown each duty mapped to what the AI Employee does, with its authority level.
 *             title, rows: [[duty, what it does, "alone"|"reports"|"asks"], ...]
 *   timeline  a day on shift. title, avatar, role, roleSub, rows: [[time, event, flag?], ...]  (flag: "you")
 *   cost      yearly cost bars. title, rows: [[label, amount, note?], ...], source, highlight (row index)
 *   flow      a top-to-bottom process. title, steps: [[name, detail], ...]
 *   stats     2-4 big numbers. title, items: [[number, label], ...], source
 *   quote     a pull quote. text, by
 *   table     any comparison. title, head: [..], rows: [[..], ..], source
 * In titles and quote text, wrap words in *asterisks* for the gradient highlight.
 * Avatars: brand/avatars/<name>.png (ai-receptionist, ai-bookkeeper, ai-executive-assistant, ai-sales-rep,
 * ai-customer-support).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slug = process.argv[2] ?? "";
if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("usage: node scripts/article-images.mjs <slug>");
const spec = JSON.parse(readFileSync(path.join(root, "content/images", `${slug}.json`), "utf8"));
const outDir = path.join(root, "public/blog", slug);
const buildDir = mkdtempSync(path.join(os.tmpdir(), `article-images-${slug}-`));
mkdirSync(outDir, { recursive: true });

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const logo = `file://${root}/brand/posts/logo-ondark.png`;
const avatarUrl = (name) => {
  if (!name) return null;
  const p = `${root}/brand/avatars/${name}.png`;
  if (!existsSync(p)) throw new Error(`No avatar brand/avatars/${name}.png`);
  return `file://${p}`;
};
const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">`;

const BASE = `*{margin:0;padding:0;box-sizing:border-box}
body{background:#09070F;color:#fff;font-family:'DM Sans',sans-serif}
.b{position:relative;overflow:hidden;background:#09070F}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,#000 20%,transparent 100%)}
.g1,.g2{position:absolute;border-radius:50%}
.g1{width:640px;height:640px;background:#F65663;filter:blur(170px);opacity:.24;left:-220px;bottom:-200px}
.g2{width:700px;height:700px;background:#9452F2;filter:blur(180px);opacity:.36;right:-260px;top:-180px}
.in{position:relative;padding:64px 72px 56px}
.eyebrow{font:500 17px 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.6);display:flex;align-items:center;gap:14px}
.eyebrow i{display:block;width:30px;height:2px;background:linear-gradient(90deg,#F65663,#9452F2)}
h2{margin-top:16px;font:700 46px/1.1 'Sora',sans-serif;letter-spacing:-1.6px}
.gr{background:linear-gradient(90deg,#F65663,#B07CFF);-webkit-background-clip:text;color:transparent}
.foot{display:flex;align-items:center;justify-content:space-between;margin-top:44px;padding-top:26px;border-top:1px solid rgba(255,255,255,.1)}
.foot img{height:30px}.foot p{font:500 17px 'DM Sans';color:rgba(255,255,255,.5)}`;

const foot = (src) => `<div class="foot"><img src="${logo}"><p>${esc(src ?? "unhired.io")}</p></div>`;
const head = (eyebrow, title) =>
  `${eyebrow ? `<div class="eyebrow"><i></i>${esc(eyebrow)}</div>` : ""}<h2>${title}</h2>`;
// "Plain words *gradient words*" -> gradient span around the starred part.
const hl = (s = "") => esc(s).replace(/\*(.+?)\*/g, '<span class="gr">$1</span>');

const T = {
  cover: {
    w: 1920, h: 1080,
    css: `.b{width:1920px;height:1080px}
.g1{width:900px;height:900px;left:-200px;bottom:-420px;opacity:.3}.g2{width:1000px;height:1000px;right:-200px;top:-260px;opacity:.45}
.c{position:absolute;left:120px;top:0;bottom:0;width:920px;display:flex;flex-direction:column;justify-content:center}
.c .eyebrow{font-size:22px}
h1{margin-top:28px;font:700 88px/1.03 'Sora';letter-spacing:-3.2px}
.sub{margin-top:30px;font:400 31px/1.45 'DM Sans';color:rgba(255,255,255,.74);max-width:860px}
.series{position:absolute;left:120px;bottom:84px;display:flex;align-items:center;gap:24px}
.series img{height:44px}.series span{font:500 22px 'DM Sans';color:rgba(255,255,255,.55);padding-left:24px;border-left:1px solid rgba(255,255,255,.2)}
.av{position:absolute;right:-30px;bottom:0;height:940px;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 16%);mask-image:linear-gradient(to bottom,transparent 0,#000 16%)}
.halo{position:absolute;right:120px;top:220px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(176,124,255,.28),transparent 70%)}`,
    html: (s) => `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div>
${s.avatar ? `<div class="halo"></div><img class="av" src="${avatarUrl(s.avatar)}">` : ""}
<div class="c"><div class="eyebrow"><i></i>${esc(s.eyebrow)}</div><h1>${hl(s.title)}</h1>${s.sub ? `<p class="sub">${esc(s.sub)}</p>` : ""}</div>
<div class="series"><img src="${logo}"><span>${esc(s.series ?? "")}</span></div></div>`,
  },

  posting: {
    w: 1200,
    css: `.b{width:1200px}
.card{margin-top:36px;background:#fff;color:#2d2d2d;border-radius:24px;padding:52px 56px;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;box-shadow:0 40px 100px -40px rgba(0,0,0,.9)}
.tag{display:inline-block;background:#e8f0fe;color:#1a4fbf;font-weight:700;font-size:19px;padding:8px 18px;border-radius:999px;margin-bottom:22px}
.card h3{font-size:52px;line-height:1.08;letter-spacing:-1px}
.co{display:flex;align-items:center;gap:14px;margin-top:18px;font-size:25px;color:#595959}
.bar{display:inline-block;height:28px;background:#111;border-radius:4px}
.chips{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap}
.chip{background:#f3f2f1;font-size:21px;font-weight:600;padding:10px 20px;border-radius:12px}
.chip.pay{background:#e4f4ea;color:#0f6b38}
.card hr{border:none;border-top:2px solid #e4e2e0;margin:36px 0}
.card h4{font-size:29px;margin-bottom:16px}
.card ul{list-style:none}
.card li{font-size:24px;line-height:1.4;padding:9px 0 9px 30px;position:relative}
.card li::before{content:"•";position:absolute;left:4px;color:#2557a7;font-weight:800}
.card p{font-size:23px;line-height:1.5;color:#4b4b4b}
.note{margin-top:22px;font:500 18px 'DM Sans';color:rgba(255,255,255,.5)}`,
    html: (s) => {
      const chips = [s.salary && `<div class="chip pay">${esc(s.salary)}</div>`, ...(s.chips ?? []).map((c) => `<div class="chip">${esc(c)}</div>`)].filter(Boolean).join("");
      return `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
${head(s.eyebrow ?? "The job posting", hl(s.heading ?? "The role they're *hiring for*"))}
<div class="card"><div class="tag">${esc(s.posted ?? "Posted this week")}</div><h3>${esc(s.title)}</h3>
<div class="co"><span class="bar" style="width:290px"></span><span>·</span><span class="bar" style="width:250px"></span><span>${esc(s.location ?? "")}</span></div>
<div class="chips">${chips}</div>
<hr><h4>Key responsibilities</h4><ul>${(s.duties ?? []).map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
${s.qualifications ? `<hr><h4>Qualifications</h4><p>${esc(s.qualifications)}</p>` : ""}</div>
<p class="note">${esc(s.note ?? "Real posting from Indeed. Company name and address removed.")}</p>
${foot()}</div></div>`;
    },
  },

  breakdown: {
    w: 1200,
    css: `.b{width:1200px}
.t{margin-top:38px;border-top:1px solid rgba(255,255,255,.12)}
.h,.r{display:grid;grid-template-columns:56px 360px 1fr 170px;gap:24px;align-items:start}
.h{padding:18px 0;font:500 15px 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);border-bottom:1px solid rgba(255,255,255,.12)}
.r{padding:26px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.n{font:500 20px 'JetBrains Mono',monospace;padding-top:3px}
.d{font:600 23px/1.35 'Sora';letter-spacing:-.4px;color:rgba(255,255,255,.9)}
.a{font:400 21px/1.5 'DM Sans';color:rgba(255,255,255,.72)}
.p{justify-self:start;padding:7px 14px;border-radius:999px;font:600 16px 'DM Sans';white-space:nowrap}
.p.alone{background:rgba(34,197,94,.14);border:1px solid rgba(110,231,160,.35);color:#86EFAC}
.p.reports{background:rgba(176,124,255,.14);border:1px solid rgba(176,124,255,.4);color:#D4BBFF}
.p.asks{background:rgba(246,86,99,.14);border:1px solid rgba(246,86,99,.4);color:#FDA4AC}
.key{display:flex;gap:28px;margin-top:22px;font:400 17px 'DM Sans';color:rgba(255,255,255,.55)}
.key b{font-weight:600;color:rgba(255,255,255,.8)}`,
    html: (s) => {
      const label = { alone: "Does it alone", reports: "Does it, reports", asks: "Asks you first" };
      return `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
${head(s.eyebrow ?? "Task by task", hl(s.title))}
<div class="t"><div class="h"><span></span><span>The duty</span><span>What the AI Employee does</span><span>Authority</span></div>
${s.rows.map(([d, a, p], i) => `<div class="r"><span class="n gr">${String(i + 1).padStart(2, "0")}</span><span class="d">${esc(d)}</span><span class="a">${esc(a)}</span><span class="p ${p}">${label[p] ?? esc(p)}</span></div>`).join("")}</div>
<div class="key"><span><b>Does it alone:</b> routine, reversible work</span><span><b>Reports:</b> acts, then tells you</span><span><b>Asks first:</b> money, people, anything final</span></div>
${foot(s.source)}</div></div>`;
    },
  },

  timeline: {
    w: 1200,
    css: `.b{width:1200px}
.who{display:flex;align-items:center;gap:20px;margin-top:34px}
.who img{width:76px;height:76px;border-radius:20px;object-fit:cover;object-position:top;background:linear-gradient(135deg,rgba(246,86,99,.35),rgba(148,82,242,.35))}
.who b{display:block;font:600 26px 'Sora';letter-spacing:-.6px}.who span{font:400 19px 'DM Sans';color:rgba(255,255,255,.55)}
.on{margin-left:auto;display:flex;align-items:center;gap:10px;padding:9px 16px;border-radius:999px;background:rgba(34,197,94,.14);border:1px solid rgba(110,231,160,.35);color:#86EFAC;font:600 17px 'DM Sans'}
.on i{width:9px;height:9px;border-radius:50%;background:#22C55E}
.log{position:relative;margin-top:30px;padding-left:40px}
.log::before{content:"";position:absolute;left:9px;top:12px;bottom:12px;width:2px;background:linear-gradient(#F65663,#9452F2)}
.e{position:relative;display:grid;grid-template-columns:130px 1fr;gap:20px;padding:16px 0}
.e::before{content:"";position:absolute;left:-38px;top:24px;width:16px;height:16px;border-radius:50%;background:#09070F;border:3px solid #B07CFF}
.tm{font:500 20px 'JetBrains Mono',monospace;color:rgba(255,255,255,.55);padding-top:2px}
.ev{font:400 22px/1.5 'DM Sans';color:rgba(255,255,255,.85)}
.you{display:inline-block;margin-left:10px;padding:3px 10px;border-radius:999px;background:rgba(246,86,99,.16);border:1px solid rgba(246,86,99,.45);color:#FDA4AC;font:600 15px 'DM Sans';vertical-align:2px}`,
    html: (s) => `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
${head(s.eyebrow ?? "A day on shift", hl(s.title))}
<div class="who">${s.avatar ? `<img src="${avatarUrl(s.avatar)}">` : ""}<div><b>${esc(s.role)}</b><span>${esc(s.roleSub ?? "")}</span></div><div class="on"><i></i>On shift</div></div>
<div class="log">${s.rows.map(([t, e, f]) => `<div class="e"><span class="tm">${esc(t)}</span><span class="ev">${esc(e)}${f === "you" ? '<span class="you">Needs you</span>' : ""}</span></div>`).join("")}</div>
${foot(s.source)}</div></div>`,
  },

  cost: {
    w: 1200,
    css: `.b{width:1200px}
.bars{margin-top:44px;display:flex;flex-direction:column;gap:34px}
.lb{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}
.lb b{font:600 25px 'Sora';letter-spacing:-.5px}.lb span{font:700 30px 'Sora';letter-spacing:-.8px}
.tr{height:46px;border-radius:12px;background:rgba(255,255,255,.06);overflow:hidden}
.fl{height:100%;border-radius:12px;background:rgba(255,255,255,.28)}
.hi .fl{background:linear-gradient(90deg,#F65663,#9452F2)}.hi .lb span{background:linear-gradient(90deg,#F65663,#B07CFF);-webkit-background-clip:text;color:transparent}
.nt{margin-top:10px;font:400 18px/1.45 'DM Sans';color:rgba(255,255,255,.55)}`,
    html: (s) => {
      const max = Math.max(...s.rows.map((r) => r[1]));
      return `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
${head(s.eyebrow ?? "The cost", hl(s.title))}
<div class="bars">${s.rows.map(([l, v, n], i) => `<div class="${i === s.highlight ? "hi" : ""}"><div class="lb"><b>${esc(l)}</b><span>${s.prefix ?? "$"}${Math.round(v).toLocaleString("en-US")}${esc(s.suffix ?? "")}</span></div><div class="tr"><div class="fl" style="width:${(v / max) * 100}%"></div></div>${n ? `<p class="nt">${esc(n)}</p>` : ""}</div>`).join("")}</div>
${foot(s.source)}</div></div>`;
    },
  },

  flow: {
    w: 1200,
    css: `.b{width:1200px}
.st{margin-top:46px;display:grid;gap:0}
.s{display:grid;grid-template-columns:64px 1fr;gap:26px;position:relative;padding-bottom:30px}
.s:not(:last-child)::after{content:"";position:absolute;left:31px;top:64px;bottom:0;width:2px;background:linear-gradient(rgba(176,124,255,.7),rgba(176,124,255,.15))}
.k{width:64px;height:64px;border-radius:18px;display:grid;place-items:center;font:600 22px 'JetBrains Mono',monospace;background:linear-gradient(135deg,rgba(246,86,99,.3),rgba(148,82,242,.3));border:1px solid rgba(255,255,255,.18)}
.s b{display:block;font:600 27px 'Sora';letter-spacing:-.6px;padding-top:4px}
.s p{margin-top:8px;font:400 21px/1.5 'DM Sans';color:rgba(255,255,255,.7);max-width:900px}`,
    html: (s) => `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
${head(s.eyebrow ?? "How it works", hl(s.title))}
<div class="st">${s.steps.map(([n, d], i) => `<div class="s"><span class="k">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(n)}</b><p>${esc(d)}</p></div></div>`).join("")}</div>
${foot(s.source)}</div></div>`,
  },

  stats: {
    w: 1200,
    css: `.b{width:1200px}
.sx{margin-top:40px;display:flex;border-top:1px solid rgba(255,255,255,.12);border-bottom:1px solid rgba(255,255,255,.12)}
.it{flex:1;padding:38px 30px 34px}.it+.it{border-left:1px solid rgba(255,255,255,.12)}
.it b{display:block;font:700 70px/1 'Sora';letter-spacing:-3px}
.it span{display:block;margin-top:16px;font:400 20px/1.45 'DM Sans';color:rgba(255,255,255,.7)}`,
    html: (s) => `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
${head(s.eyebrow, hl(s.title))}
<div class="sx">${s.items.map(([n, l]) => `<div class="it"><b class="gr">${esc(n)}</b><span>${esc(l)}</span></div>`).join("")}</div>
${foot(s.source)}</div></div>`,
  },

  table: {
    w: 1200,
    css: `.b{width:1200px}
.tb{margin-top:38px;width:100%;border-collapse:collapse}
.tb th{padding:16px 18px 16px 0;text-align:left;font:500 15px 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);border-bottom:1px solid rgba(255,255,255,.14)}
.tb td{padding:22px 18px 22px 0;vertical-align:top;font:400 21px/1.45 'DM Sans';color:rgba(255,255,255,.72);border-bottom:1px solid rgba(255,255,255,.08)}
.tb td:first-child{font:600 22px/1.35 'Sora';letter-spacing:-.3px;color:#fff;width:26%}
.tb tr:last-child td{border-bottom:0}`,
    html: (s) => `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
${head(s.eyebrow, hl(s.title))}
<table class="tb"><thead><tr>${s.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
<tbody>${s.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>
${foot(s.source)}</div></div>`,
  },

  quote: {
    w: 1200,
    css: `.b{width:1200px}.in{padding:90px 96px 64px}
.mk{font:700 140px/0.6 'Sora';height:70px}
blockquote{margin-top:10px;font:600 50px/1.22 'Sora';letter-spacing:-1.6px}
.by{margin-top:34px;font:500 19px 'JetBrains Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55)}`,
    html: (s) => `<div class="b"><div class="grid"></div><div class="g1"></div><div class="g2"></div><div class="in">
<div class="mk gr">“</div><blockquote>${hl(s.text)}</blockquote>${s.by ? `<div class="by">${esc(s.by)}</div>` : ""}
${foot()}</div></div>`,
  },
};

const run = (args) => execFileSync(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

spec.images.forEach((img, i) => {
  const t = T[img.type];
  if (!t) throw new Error(`Unknown image type "${img.type}"`);
  const name = `${String(i + 1).padStart(2, "0")}-${img.name ?? img.type}`;
  const file = path.join(buildDir, `${name}.html`);
  // Measure the rendered height first (fixed-height templates skip this), then screenshot at that size.
  const measure = `<script>addEventListener("load",()=>setTimeout(()=>{document.title="H"+Math.ceil(document.querySelector(".b").getBoundingClientRect().height)},300))</script>`;
  writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}\n${t.css}</style></head><body>${t.html(img)}${measure}</body></html>`);
  let h = t.h;
  if (!h) {
    const dom = run([`--window-size=${t.w},4000`, "--virtual-time-budget=6000", "--dump-dom", `file://${file}`]);
    h = Number(/<title>H(\d+)<\/title>/.exec(dom)?.[1]);
    if (!h) throw new Error(`Could not measure ${name}`);
  }
  // Screenshot as PNG, then save a JPEG: about a fifth of the size, which keeps blog pages fast.
  const png = path.join(buildDir, `${name}.png`);
  const out = path.join(outDir, `${name}.jpg`);
  run([`--window-size=${t.w},${h}`, "--force-device-scale-factor=1.5", "--virtual-time-budget=6000", `--screenshot=${png}`, `file://${file}`]);
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "78", png, "--out", out], { stdio: "ignore" });
  console.log(`${out}  ${t.w * 1.5}x${h * 1.5}`);
});
