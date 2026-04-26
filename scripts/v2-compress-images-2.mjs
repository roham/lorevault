import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

// Smaller hero at 800w for faster LCP. Cards stay at 1200w (we display detail at 375 max).
async function compress(rel, opts) {
  const p = path.resolve(rel);
  const before = (await fs.stat(p)).size;
  const buf = await sharp(p).resize(opts).webp({ quality: 78, effort: 6 }).toBuffer();
  await fs.writeFile(p, buf);
  console.log(`${rel}: ${(before/1024).toFixed(0)}KB -> ${(buf.length/1024).toFixed(0)}KB`);
}

await compress('public/v2/lattice-painting.webp', { width: 900, withoutEnlargement: true });
for (const f of [
  'bs-last-bow', 'ek-footnoter-reveals', 'gh-ledger-keeper-opens', 'gm-sixth-seed', 'wl-alice-through-glass',
]) {
  await compress(`public/v2/cards/${f}.webp`, { width: 1000, withoutEnlargement: true });
}
