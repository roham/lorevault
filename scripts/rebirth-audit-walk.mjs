// Rebirth-daemon audit walk — cycle-N baseline
// Usage: node scripts/rebirth-audit-walk.mjs <cycleN> [screenshotsDir]
import { chromium } from '/home/ro/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const cycleN = process.argv[2] ?? '1';
const BASE = 'https://lorevault-site.vercel.app';
const SHOTS_DIR = process.argv[3] ??
  `lorevault-wiki/strategy/audit/screenshots-cycle-${cycleN}`;

mkdirSync(SHOTS_DIR, { recursive: true });

const ROUTES = [
  { path: '/', name: 'home-v1' },
  { path: '/prototype/exemplars', name: 'prototype-exemplars' },
  { path: '/prototype', name: 'prototype-root' },
  { path: '/v2', name: 'v2-root' },
];

const VIEWPORTS = [
  { width: 375, height: 812, label: 'mobile' },
  { width: 1440, height: 900, label: 'desktop' },
];

const findings = [];
const browser = await chromium.launch({ args: ['--no-sandbox'] });

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    userAgent: vp.width <= 375
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
      : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    deviceScaleFactor: vp.width <= 375 ? 2 : 1,
  });

  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => consoleErrors.push(err.message));

    const url = BASE + route.path;
    let status = 0, loadMs = 0, h1 = null, navLinks = 0, images = 0;

    try {
      const t0 = Date.now();
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      loadMs = Date.now() - t0;
      status = resp?.status() ?? 0;
      await page.waitForTimeout(1000);

      const shotPath = join(SHOTS_DIR, `${route.name}-${vp.label}-initial.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      h1 = await page.locator('h1').first().textContent({ timeout: 2000 }).catch(() => null);
      navLinks = await page.locator('nav a').count().catch(() => 0);
      images = await page.locator('img').count().catch(() => 0);

    } catch (e) {
      consoleErrors.push(e.message);
    }

    const verdict = consoleErrors.length === 0 && status > 0 && status < 400 ? 5
      : status >= 400 ? 1 : 3;

    findings.push({
      route: route.path, name: `${route.name}-${vp.label}`,
      status, loadMs, consoleErrors, h1, navLinks, images, verdict,
    });
    await page.close();
  }
  await ctx.close();
}

await browser.close();

const outPath = join(SHOTS_DIR, 'findings.json');
writeFileSync(outPath, JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings, null, 2));
