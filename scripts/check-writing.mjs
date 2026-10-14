/**
 * Flags AI-sounding writing before it's published (rules: content/WRITING.md).
 *   node scripts/check-writing.mjs <file.md> [more files]
 * Checks the body plus prose frontmatter (title, description, takeaways, faq, share_text, page_caption).
 * Errors exit 1; warnings print but pass.
 */
import { readFileSync, existsSync } from "node:fs";
import matter from "gray-matter";

const WORDS = [
  "leverag(e|es|ed|ing)", "utiliz(e|es|ed|ing|ation)", "delv(e|es|ed|ing)", "tapestry", "landscape", "realm",
  "paradigm", "synerg(y|ies|istic)", "seamless(ly)?", "robust", "streamlin(e|es|ed|ing)", "empower(s|ed|ing)?",
  "facilitat(e|es|ed|ing)", "foster(s|ed|ing)?", "holistic", "transformative", "game[- ]changer", "unlock(s|ed|ing)?",
  "harness(es|ed|ing)?", "embark(s|ed|ing)?", "underscor(e|es|ed|ing)", "testament", "pivotal", "ever-evolving",
  "invaluable", "commendable", "nestled", "vibrant", "plethora", "myriad", "meticulous(ly)?", "cutting-edge",
  "revolutioni[sz](e|es|ed|ing)", "supercharg(e|es|ed|ing)", "elevat(e|es|ing) your", "actionable insights",
  "moreover", "furthermore", "additionally", "consequently", "nevertheless", "nonetheless", "notably",
  "importantly", "interestingly", "notwithstanding",
];
const PHRASES = [
  "it['’]?s worth noting", "it is worth noting", "worth mentioning", "that being said", "having said that",
  "in conclusion", "in summary", "to sum up", "at the end of the day", "the bottom line", "either way",
  "here['’]s the (thing|kicker|deal|catch|truth|twist|secret)", "here['’]s where it gets", "here['’]s what most",
  "let['’]s (dive|delve|break|unpack|explore)", "imagine a world", "picture this", "think of it (as|like)",
  "serves as", "stands as", "in today['’]s", "fast-paced", "it['’]?s important to (note|remember|consider)",
  "surprised me", "where it gets interesting", "a testament to", "plays a (key|crucial|vital) role",
  "despite (these|its|their) challenges", "changes everything", "as an ai",
];
const SHAPES = [
  [/\bnot (just|only|merely|simply)\b[^.!?]{1,80}?\bbut\b/i, "fake reframe: 'not just X, but Y'"],
  [/\b(it|this|that|they)(['’]s not|['’]re not| is not| isn['’]t| aren['’]t)\b[^.!?]{1,80}[.;]\s+(it|this|that|they)(['’]s|['’]re| is| are)\b/i, "fake reframe: 'it isn't X. It's Y.'"],
  [/\bisn['’]t\b[^.!?]{0,60}\.\s+it(['’]s| is)\b/i, "fake reframe: 'isn't X. It's Y.'"],
  [/\b(it|this|that)['’]s not\b[^.!?]{1,60},\s*it['’]s\b/i, "fake reframe: 'it's not X, it's Y'"],
  [/\b(it|that|this|they) (isn['’]t|is not|aren['’]t|are not|doesn['’]t|don['’]t)\.(\s|$)/i, "fake reframe: 'People assume X. It isn't.'"],
  [/\bthe (question|point|problem|issue|answer|real story) (isn['’]t|is not)\b/i, "fake reframe: 'the question isn't X'"],
  [/\bnot because\b[^.!?]{1,80}\bbut because\b/i, "fake reframe: 'not because X, but because Y'"],
  [/\bNot [^.!?]{1,30}\.\s+Not [^.!?]{1,30}\./, "countdown: 'Not X. Not Y. Z.'"],
  [/(?:^|[.!?]\s+)(?:(?:And |But )?(?:the|your|my|our|what['’]s the) [a-z'’ ]{1,25})\?\s+[A-Z][^?]{0,60}[.!]/i, "self-answered question: 'The result? X.'"],
  [/[—]|\s--\s/, "em dash"],
  [/→|⇒|⟶/, "unicode arrow in prose"],
];
// Articles inform; they never pitch Unhired (WRITING.md section 0). The company-page caption may name
// Unhired and say "we", so only the hard sales lines apply to it.
const SELL = [
  [/\bUnhired\b/, "names Unhired"],
  [/\bhow (we|I)['’]d (build|set|train|run)\b/i, "'how we'd build' framing"],
  [/\bwe(['’]d|['’]ll| would| will| can)? (build|built|set (it|one|them) up|train|maintain|price|offer|bill|replace|recommend|guarantee)\b/i, "'we build/maintain/price' pitch"],
  [/\bour (free|clients?|team|service|pricing|assessment|AI Employees?)\b/i, "'our ...' pitch"],
];
const SALES = [
  [/\bguarantee/i, "guarantee in an article"],
  [/most you['’]d pay|what you['’]d save|nothing up front|never (have to )?touch (it|the AI)|clients? we build|replace the role, not the person|book a (call|demo)|contact us|get in touch|sign up (now|today)/i, "sales line"],
];
const SOFT = [
  [/,\s+(highlighting|underscoring|reflecting|showcasing|emphasi[sz]ing|signaling|signalling|demonstrating|contributing to)\b/i, "'-ing' add-on that says nothing"],
  [/\b(seamlessly|effectively|efficiently|consistently|quietly|deeply|fundamentally|truly|remarkably|arguably|undoubtedly|certainly|incredibly)\b/i, "empty adverb"],
  [/\b(however|thus|hence|indeed|accordingly)\b/i, "stiff transition"],
  [/\bhere['’]s (how|what|why)\b/i, "'here's what/how' setup"],
  [/\b(innovative|dynamic|exciting|thought-provoking|exemplary|utmost|vital|crucial|keen)\b/i, "stock adjective"],
];

const sentences = (t) => t.split(/(?<=[.!?])\s+(?=[A-Z"“(])/).map((s) => s.trim()).filter(Boolean);
const wc = (t) => (t.match(/\b[\w'’$%.,-]+\b/g) ?? []).length;

let failed = false;
for (const file of process.argv.slice(2)) {
  const raw = readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const bodyStart = raw.split("\n").findIndex((l, i) => i > 0 && l.trim() === "---") + 1;
  // Prose lines with their real line numbers; skip code, images, HTML comments and URLs.
  const lines = [];
  let code = false;
  content.split("\n").forEach((l, i) => {
    if (/^```/.test(l)) code = !code;
    if (code || /^!\[|^<!--|^\s*$|^```/.test(l)) return;
    lines.push({ n: bodyStart + i + 1, raw: l, t: l.replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+/g, "") });
  });
  for (const k of ["title", "description", "share_text", "page_caption", "body", "caption"]) {
    if (typeof data[k] === "string") data[k].split("\n").forEach((t) => t.trim() && lines.push({ n: `fm.${k}`, t }));
  }
  for (const [k, v] of Object.entries(data.syndication ?? {})) {
    if (typeof v === "string" && k !== "cover") v.split("\n").forEach((t) => t.trim() && lines.push({ n: `fm.syndication.${k}`, t }));
  }
  for (const t of data.takeaways ?? []) lines.push({ n: "fm.takeaways", t });
  for (const f of data.faq ?? []) lines.push({ n: "fm.faq", t: `${f.q} ${f.a}` });

  const errs = [], warns = [];
  const words = new RegExp(`\\b(${WORDS.join("|")})\\b`, "i");
  const phrases = new RegExp(`(${PHRASES.join("|")})`, "i");
  for (const { n, t, raw } of lines) {
    const plain = t.replace(/\*\*|__|\*|_|`/g, "");
    let m;
    if ((m = plain.match(words))) errs.push([n, `AI word "${m[0]}"`, plain]);
    if ((m = plain.match(phrases))) errs.push([n, `AI phrase "${m[0]}"`, plain]);
    for (const [re, why] of SHAPES) if (re.test(plain)) errs.push([n, why, plain]);
    for (const [re, why] of SOFT) if ((m = plain.match(re))) warns.push([n, `${why} "${m[0]}"`, plain]);
    // The one allowed assessment pointer may name Unhired ("such as the one offered by Unhired").
    const pointer = /\]\((https:\/\/unhired\.io)?\/assessment\)/.test(raw ?? "");
    for (const [re, why] of [...(n === "fm.syndication.page_caption" ? [] : SELL), ...SALES]) {
      if (pointer && why === "names Unhired") continue;
      if ((m = plain.match(re))) errs.push([n, `selling: ${why} "${m[0]}"`, plain]);
    }
    if (n !== "fm.syndication.page_caption" && (m = plain.match(/\b([Ww]e|[Ww]e['’](ve|re|d|ll)|[Oo]ur|us)\b/))) warns.push([n, `"${m[0]}" in an article: make sure it isn't about Unhired`, plain]);
  }
  const pointers = (content.match(/\]\((https:\/\/unhired\.io)?\/assessment\)/g) ?? []).length;
  if (pointers > 1) errs.push(["-", `selling: ${pointers} links to the assessment; one subtle mention per article`, ""]);
  // Image alt text and the article's infographic spec get the same selling check.
  const alts = [...content.matchAll(/^!\[([^\]]*)\]/gm)].map((x) => ({ n: "image alt", t: x[1] }));
  const specPath = file.replace(/content\/blog\/([^/]+)\.md$/, "content/images/$1.json");
  const specText = specPath !== file && existsSync(specPath) ? JSON.stringify(JSON.parse(readFileSync(specPath, "utf8"))) : "";
  const specStrings = specText ? [...specText.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => ({ n: "image spec", t: x[1] })) : [];
  for (const { n, t } of [...alts, ...specStrings]) {
    for (const [re, why] of [...SELL, ...SALES]) {
      const m = t.match(re);
      if (m && !(n === "image spec" && /unhired\.io/i.test(t) && why === "names Unhired")) errs.push([n, `selling: ${why} "${m[0]}"`, t]);
    }
  }

  // Bold-label bullets: 3+ list items in a row that open with bold.
  let run = 0;
  for (const { n, t } of lines) {
    run = /^\s*([-*]|\d+\.)\s+\*\*/.test(t) ? run + 1 : 0;
    if (run === 3) errs.push([n, "list items all start with a bold label", t]);
  }

  const prose = lines.filter((l) => typeof l.n === "number" && !/^#/.test(l.t)).map((l) => l.t.replace(/\*\*/g, "")).join("\n");
  const ss = sentences(prose.replace(/\n+/g, " "));
  const total = wc(prose);
  // Runs of fragments, and the same opening three times in a row.
  for (let i = 0; i + 2 < ss.length; i++) {
    if ([0, 1, 2].every((j) => wc(ss[i + j]) <= 4)) { warns.push(["-", "three fragments in a row", ss.slice(i, i + 3).join(" ")]); i += 2; }
    const open = (s) => s.split(/\s+/).slice(0, 2).join(" ").toLowerCase();
    if (open(ss[i]) === open(ss[i + 1]) && open(ss[i]) === open(ss[i + 2])) warns.push(["-", `three sentences open with "${open(ss[i])}"`, ss[i]]);
  }
  const triads = (prose.match(/\b[\w'’-]+(?: [\w'’-]+){0,3}, [\w'’-]+(?: [\w'’-]+){0,3},? (?:and|or) [\w'’-]+/g) ?? []).length;
  if (total > 300 && triads > total / 200) warns.push(["-", `${triads} lists of three in ${total} words; vary them`, ""]);
  const bold = (content.match(/\*\*[^*]+\*\*/g) ?? []).length;
  if (bold > Math.max(3, total / 150)) warns.push(["-", `${bold} bold phrases in ${total} words; keep it to one or two per section`, ""]);
  const lens = ss.map(wc);
  if (lens.length > 15) {
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);
    if (sd < 5) warns.push(["-", `sentence lengths barely vary (avg ${mean.toFixed(0)}, sd ${sd.toFixed(1)} words)`, ""]);
  }

  const clip = (s) => (s.length > 110 ? `${s.slice(0, 107)}...` : s);
  console.log(`\n${file}  (${total} words)`);
  for (const [n, why, t] of errs) console.log(`  ERROR ${n}: ${why}${t ? `\n        ${clip(t)}` : ""}`);
  for (const [n, why, t] of warns) console.log(`  warn  ${n}: ${why}${t ? `\n        ${clip(t)}` : ""}`);
  if (!errs.length && !warns.length) console.log("  clean");
  if (errs.length) failed = true;
}
process.exit(failed ? 1 : 0);
