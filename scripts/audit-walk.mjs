import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const BASE = 'https://lorevault-site.vercel.app';
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/moodboard?k=' + process.env.MOODBOARD_TOKEN, name: 'moodboard' },
  { path: '/collection', name: 'collection' },
];
const SHOTS_DIR = '/opt/taste-daemon/repo/lorevault-wiki/taste/cycle-logs/cycle-3-screenshots';
mkdirSync(SHOTS_DIR, { recursive: true });

const findings = [];

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
  deviceScaleFactor: 2,
});

for (const route of ROUTES) {
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));

  const url = BASE + route.path;
  let status = 0, loadMs = 0;

  try {
    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    loadMs = Date.now() - t0;
    status = resp?.status() ?? 0;
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SHOTS_DIR}/${route.name}-initial.png`, fullPage: false });
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SHOTS_DIR}/${route.name}-scrolled.png`, fullPage: false });

    const h1 = await page.locator('h1').first().textContent({ timeout: 3000 }).catch(() => null);
    const navLinks = await page.locator('nav a').count().catch(() => 0);
    const images = await page.locator('img').count().catch(() => 0);

    findings.push({ route: route.path.split('?')[0], name: route.name, status, loadMs, consoleErrors, h1, navLinks, images,
      verdict: consoleErrors.length === 0 && status < 400 ? 5 : (status >= 400 ? 1 : 3) });
  } catch (e) {
    findings.push({ route: route.path, name: route.name, status: 0, loadMs: 0, consoleErrors: [e.message], verdict: 1 });
  }
  await page.close();
}

await browser.close();
writeFileSync('/tmp/audit-findings.json', JSON.stringify(findings, null, 2));
console.log(JSON.stringify(findings, null, 2));
