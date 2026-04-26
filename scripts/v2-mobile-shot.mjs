import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve(process.cwd(), 'lorevault-wiki/reviews/screenshots');
await fs.mkdir(OUT, { recursive: true });

const PAGES = [
  { url: 'http://localhost:3128/v2', file: 'v2-home-375.png' },
  { url: 'http://localhost:3128/v2/welcome', file: 'v2-welcome-375.png' },
  { url: 'http://localhost:3128/v2/card/bs-last-bow', file: 'card-bs-last-bow-375.png' },
  { url: 'http://localhost:3128/v2/card/ek-footnoter-reveals', file: 'card-ek-footnoter-375.png' },
  { url: 'http://localhost:3128/v2/card/wl-alice-through-glass', file: 'card-wl-alice-375.png' },
  { url: 'http://localhost:3128/v2/card/gh-ledger-keeper-opens', file: 'card-gh-ledger-keeper-375.png' },
  { url: 'http://localhost:3128/v2/card/gm-sixth-seed', file: 'card-gm-sixth-seed-375.png' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

const results = [];
for (const { url, file } of PAGES) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(1500);
  const fpath = path.join(OUT, file);
  await page.screenshot({ path: fpath, fullPage: true });
  // horizontal scroll check
  const overflow = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  results.push({ url, file: fpath, sw: overflow.sw, cw: overflow.cw, hScroll: overflow.sw > overflow.cw });
  console.log(`shot ${url} -> ${file} (sw=${overflow.sw} cw=${overflow.cw} hScroll=${overflow.sw > overflow.cw})`);
}
await browser.close();

const fail = results.filter((r) => r.hScroll);
console.log(`mobile screenshot gate: ${results.length - fail.length}/${results.length} pass; ${fail.length} pages with horizontal scroll`);
if (fail.length) {
  console.error('horizontal-scroll on:');
  for (const f of fail) console.error(`  ${f.url} (sw=${f.sw} cw=${f.cw})`);
  process.exit(1);
}
