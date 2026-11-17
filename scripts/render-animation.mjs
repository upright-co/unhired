// Renders an animated HTML graphic to MP4, frame by frame.
// The page must expose window.render(t) (pure function of time in seconds) and window.ready (Promise).
//
//   node scripts/render-animation.mjs brand/animated/ai-employee-team.html [--seconds 20] [--fps 30] [--frames 0,5,12]
//
// --frames writes PNG stills at those times instead of a video (for checking layout).
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const args = process.argv.slice(2);
const file = path.resolve(args[0]);
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
let seconds = opt('--seconds', null);
const fps = Number(opt('--fps', 30));
const stills = opt('--frames', null);
const out = opt('--out', file.replace(/\.html$/, '.mp4'));

const candidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium'),
];
const executablePath = candidates.find(existsSync);

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto('file://' + file + '?capture');
await page.evaluate(() => window.ready);
// Loop length: --seconds, else the page's window.DURATION, else 20.
seconds = Number(seconds ?? (await page.evaluate(() => window.DURATION)) ?? 20);

if (stills) {
  for (const t of stills.split(',').map(Number)) {
    await page.evaluate((t) => window.render(t), t);
    const p = file.replace(/\.html$/, `-t${t}.png`);
    await page.screenshot({ path: p });
    console.log(p);
  }
  await browser.close();
  process.exit(0);
}

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });

const total = Math.round(seconds * fps);
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.render(t), f / fps);
  const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (f % fps === 0) process.stdout.write(`\r${f}/${total}`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log('\n' + out);
