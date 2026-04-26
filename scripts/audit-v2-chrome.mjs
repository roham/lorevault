#!/usr/bin/env node
// V2 surface chrome audit per Phase 4 paragraph 10.
// Fails the gate if any forbidden string appears in v2 source files.

import fs from 'node:fs/promises';
import path from 'node:path';

const BANNED = [
  { rx: /\bCharm\s*\d+\b/i, label: 'battle-stat: Charm N' },
  { rx: /\bPower\s*\d+\b/i, label: 'battle-stat: Power N' },
  { rx: /\bIntelligence\s*\d+\b/i, label: 'battle-stat: Intelligence N' },
  { rx: /\bMystery\s*\d+\b/i, label: 'battle-stat: Mystery N' },
  { rx: /\bLegend\s*\d+\b/i, label: 'battle-stat: Legend N' },
  { rx: /Estimated Value/i, label: 'estimated-value strip' },
  { rx: /\bComfy\b/i, label: 'Comfy sub-tab' },
  { rx: /\bBulk\b/i, label: 'Bulk sub-tab' },
  { rx: /\bMovers\b/i, label: 'Movers ticker' },
  { rx: /Smart money/i, label: 'smart-money pill' },
  { rx: /Burn for XP/i, label: 'burn-for-XP CTA' },
  { rx: /Legacy Score/i, label: 'legacy-score' },
  { rx: /Pristine\s*\d/i, label: 'Pristine N grader chrome' },
  { rx: /traded \d+ times today/i, label: 'live-stats ticker' },
  { rx: /streak/i, label: 'streak counter' },
  { rx: /forge.*discount/i, label: 'forge seasonal discount' },
];

const ROOTS = ['src/app/v2', 'src/components/v2', 'src/lib/v2'];

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (/\.(tsx?|css|md)$/.test(e.name)) yield full;
  }
}

let scanned = 0;
const hits = [];
for (const root of ROOTS) {
  try {
    for await (const file of walk(root)) {
      scanned += 1;
      const text = await fs.readFile(file, 'utf8');
      for (const ban of BANNED) {
        const m = ban.rx.exec(text);
        if (m) hits.push({ file, label: ban.label, match: m[0] });
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

console.log(`v2 chrome audit: ${scanned} files scanned; ${hits.length} hits`);
if (hits.length) {
  for (const h of hits) console.error(`  HIT  ${h.file}: ${h.label} (${h.match})`);
  process.exit(1);
}
console.log('OK -- no banned-chrome strings present in v2 surfaces.');
