import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const FILES = [
  'public/v2/lattice-painting.webp',
  'public/v2/cards/bs-last-bow.webp',
  'public/v2/cards/ek-footnoter-reveals.webp',
  'public/v2/cards/gh-ledger-keeper-opens.webp',
  'public/v2/cards/gm-sixth-seed.webp',
  'public/v2/cards/wl-alice-through-glass.webp',
];

for (const rel of FILES) {
  const p = path.resolve(rel);
  const before = (await fs.stat(p)).size;
  // Card art canonical: 1500 wide for 2:3 portrait at 2x DPR on 750px-wide hero block.
  // Compress to webp quality 80 + max 1200 wide.
  const buf = await sharp(p)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toBuffer();
  await fs.writeFile(p, buf);
  const after = buf.length;
  console.log(`${rel}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
}
