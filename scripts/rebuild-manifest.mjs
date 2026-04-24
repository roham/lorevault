#!/usr/bin/env node
// Recovery tool: scan public/moodboard-art/**/*.webp, reconstruct manifest.json
// with promptVersion tagged from file mtime (files newer than cutoff = latest version).
// Preserves existing manifest metadata where it overlaps.

import fs from 'node:fs/promises';
import path from 'node:path';

const ART_DIR = path.resolve(process.cwd(), 'public/moodboard-art');
const MANIFEST = path.join(ART_DIR, 'manifest.json');

// NOTE: keep these inline and in sync with seed-moodboard.mjs — this is a recovery utility.
// Only the slugs matter for matching; full metadata is looked up by seed script on next run.
// Dynamically read PROMPT_VERSION from seed-moodboard.mjs so these stay in sync.
const seedSrc = await fs.readFile(path.join(path.dirname(path.resolve('./scripts/rebuild-manifest.mjs')), 'seed-moodboard.mjs'), 'utf8').catch(() => '');
const versionMatch = seedSrc.match(/const PROMPT_VERSION\s*=\s*(\d+)/);
const PROMPT_VERSION = versionMatch ? parseInt(versionMatch[1], 10) : 1;
// Files modified after this instant are treated as current-version regen output.
// Default: last 90 minutes.
const V5_CUTOFF = Date.now() - (parseInt(process.argv[2] || '90', 10) * 60_000);

// Read existing manifest for metadata we can reuse
let existing = { items: [] };
try { existing = JSON.parse(await fs.readFile(MANIFEST, 'utf8')); } catch {}
const byId = new Map(existing.items.map(i => [i.id, i]));

// Scan every webp
const items = [];
const chars = await fs.readdir(ART_DIR, { withFileTypes: true });
for (const charDir of chars) {
  if (!charDir.isDirectory()) continue;
  const characterSlug = charDir.name;
  const charPath = path.join(ART_DIR, characterSlug);
  const files = await fs.readdir(charPath);
  for (const fname of files) {
    if (!fname.endsWith('.webp')) continue;
    // filename: `<styleSlug>-<variant>.webp`
    const m = fname.match(/^(.+)-(\d+)\.webp$/);
    if (!m) continue;
    const [, styleSlug, variantStr] = m;
    const id = `${characterSlug}-${styleSlug}-${variantStr}`;
    const full = path.join(charPath, fname);
    const stat = await fs.stat(full);
    const prior = byId.get(id);
    const isV5 = stat.mtimeMs >= V5_CUTOFF;
    items.push({
      id,
      characterSlug,
      character: prior?.character ?? characterSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      set: prior?.set,
      moment: prior?.moment,
      style: prior?.style ?? styleSlug,
      styleSlug,
      variant: parseInt(variantStr, 10),
      path: `/moodboard-art/${characterSlug}/${fname}`,
      prompt: prior?.prompt,
      promptVersion: isV5 ? PROMPT_VERSION : (prior?.promptVersion ?? 1),
      model: prior?.model ?? 'gpt-image-1',
      costUsd: prior?.costUsd ?? 0.17,
      generatedAt: new Date(stat.mtimeMs).toISOString(),
      bytes: stat.size,
    });
  }
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  model: 'gpt-image-1',
  totalImages: items.length,
  totalCostUsd: +items.reduce((a, b) => a + (b.costUsd || 0), 0).toFixed(2),
  items,
};
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

const v5 = items.filter(i => i.promptVersion === PROMPT_VERSION).length;
console.log(`rebuilt manifest: ${items.length} total, ${v5} v${PROMPT_VERSION}`);
