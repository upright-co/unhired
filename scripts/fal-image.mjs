/**
 * Makes a photo for one of Brandon's personal posts with Fal.ai (pay per image, about $0.15 each).
 * Use it only when the story has no usable photo of its own (content/personal-posts/README.md).
 *
 *   node --env-file=/Users/user/Documents/unhired-portal/.env.local scripts/fal-image.mjs \
 *     --out brand/personal-posts/<date>/gen/<slug>.png --prompt "Photorealistic photo of ..."
 *   add  --edit <image url or local file>   to change an existing photo instead of making a new one
 *        (e.g. a source photo, plus "put the Alberta Legislature in the background")
 *
 * Then point the post's image spec at it:  "photoFile": "<absolute path>", "credit": "AI-generated image"
 * Needs FAL_KEY. Output is 3:2 to fit the top of the post card.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : null;
};
const out = arg("out");
const prompt = arg("prompt");
const edit = arg("edit");
if (!out || !prompt) throw new Error('usage: fal-image.mjs --out <file.png> --prompt "..." [--edit <url|file>]');
if (!process.env.FAL_KEY) throw new Error("FAL_KEY is not set (it lives in unhired-portal/.env.local)");

const STYLE = " Photorealistic, shot on a full-frame camera, natural light, documentary news-photo look. No text, no captions, no logos, no watermarks.";
const body = { prompt: prompt + STYLE, aspect_ratio: arg("aspect") ?? "3:2", resolution: arg("resolution") ?? "1K", num_images: 1, output_format: "png" };
let model = "fal-ai/nano-banana-pro";
if (edit) {
  model += "/edit";
  body.image_urls = [/^https?:\/\//.test(edit)
    ? edit
    : `data:image/${edit.endsWith(".png") ? "png" : "jpeg"};base64,${readFileSync(edit).toString("base64")}`];
}

let res;
for (let attempt = 1; attempt <= 3; attempt++) {
  res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: { Authorization: `Key ${process.env.FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(180000),
  });
  if (res.ok || !(res.headers.get("x-fal-needs-retry") === "1" || res.status === 429 || res.status >= 500)) break;
  await new Promise((r) => setTimeout(r, 5000 * attempt));
}
if (!res.ok) {
  console.error(`Fal error ${res.status}: ${(await res.text()).slice(0, 400)}`);
  process.exit(1);
}
const url = (await res.json()).images?.[0]?.url;
if (!url) throw new Error("Fal returned no image");
const img = await fetch(url, { signal: AbortSignal.timeout(60000) });
mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
writeFileSync(out, Buffer.from(await img.arrayBuffer()));
console.log(`saved ${out}`);
