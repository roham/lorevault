#!/usr/bin/env node
// Fast batched seeder for /moodboard. Runs gpt-image-1 with configurable concurrency,
// converts to WebP via sharp, appends to public/moodboard-art/manifest.json.
//
// Usage:
//   node scripts/seed-moodboard.mjs [--count=50] [--concurrency=10]
//
// Env: OPENAI_API_KEY required.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY not set');
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  }),
);
const COUNT = parseInt(args.count ?? '50', 10);
const CONCURRENCY = parseInt(args.concurrency ?? '10', 10);

const OUT_DIR = path.resolve(process.cwd(), 'public/moodboard-art');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

const CHARACTERS = [
  { set: 'baker-street', slug: 'sherlock-holmes', character: 'Sherlock Holmes', moment: 'At 221B Baker Street', origin: 'Arthur Conan Doyle 1887' },
  { set: 'baker-street', slug: 'moriarty', character: 'Professor Moriarty', moment: 'The Napoleon of Crime', origin: 'Arthur Conan Doyle 1893' },
  { set: 'baker-street', slug: 'irene-adler', character: 'Irene Adler', moment: 'The Woman', origin: 'Arthur Conan Doyle 1891' },
  { set: 'baker-street', slug: 'the-hound', character: 'The Hound of the Baskervilles', moment: 'On the Moor', origin: 'Arthur Conan Doyle 1902' },
  { set: 'enchanted-kingdom', slug: 'snow-white', character: 'Snow White', moment: 'The Poisoned Apple', origin: 'Brothers Grimm 1812' },
  { set: 'enchanted-kingdom', slug: 'evil-queen', character: 'The Evil Queen', moment: 'Before the Magic Mirror', origin: 'Brothers Grimm 1812' },
  { set: 'enchanted-kingdom', slug: 'red-riding-hood', character: 'Little Red Riding Hood', moment: 'The Dark Forest Path', origin: 'Charles Perrault 1697' },
  { set: 'enchanted-kingdom', slug: 'rumpelstiltskin', character: 'Rumpelstiltskin', moment: 'Spinning Gold', origin: 'Brothers Grimm 1812' },
  { set: 'wonderland', slug: 'alice', character: 'Alice', moment: 'Falling Down the Rabbit Hole', origin: 'Lewis Carroll 1865' },
  { set: 'wonderland', slug: 'cheshire-cat', character: 'The Cheshire Cat', moment: 'Fading to a Grin', origin: 'Lewis Carroll 1865' },
  { set: 'wonderland', slug: 'mad-hatter', character: 'The Mad Hatter', moment: 'The Eternal Tea Party', origin: 'Lewis Carroll 1865' },
  { set: 'wonderland', slug: 'queen-of-hearts', character: 'The Queen of Hearts', moment: 'Off With Their Heads', origin: 'Lewis Carroll 1865' },
  { set: 'gothic-horror', slug: 'dracula', character: 'Count Dracula', moment: 'The Castle at Night', origin: 'Bram Stoker 1897' },
  { set: 'gothic-horror', slug: 'frankenstein-monster', character: "Frankenstein's Monster", moment: 'Birth in the Laboratory', origin: 'Mary Shelley 1818' },
  { set: 'gothic-horror', slug: 'jekyll', character: 'Dr. Jekyll', moment: 'The Transformation', origin: 'R.L. Stevenson 1886' },
  { set: 'gothic-horror', slug: 'phantom', character: 'The Phantom of the Opera', moment: 'Behind the Mask', origin: 'Gaston Leroux 1910' },
  { set: 'greek-myth', slug: 'prometheus', character: 'Prometheus', moment: 'Stealing Fire from Olympus', origin: 'Hesiod c.700 BCE' },
  { set: 'greek-myth', slug: 'medusa', character: 'Medusa', moment: 'The Serpent-Haired Gorgon', origin: 'Hesiod c.700 BCE' },
  { set: 'greek-myth', slug: 'zeus', character: 'Zeus', moment: 'King of Olympus with Thunderbolt', origin: 'Hesiod c.700 BCE' },
  { set: 'greek-myth', slug: 'athena', character: 'Athena', moment: 'Wisdom and War, with Owl', origin: 'Hesiod c.700 BCE' },
];

const STYLES = [
  { slug: 'victorian-engraving', style: 'Victorian steel engraving', desc: 'Victorian steel engraving, fine crosshatch line work, sepia monochrome, 1880s periodical aesthetic' },
  { slug: 'noir-poster-30s', style: '1930s noir poster', desc: '1930s noir movie poster, silver halide grain, hard chiaroscuro, smoky atmosphere, limited palette of charcoal and cream' },
  { slug: 'baroque-oil', style: 'Baroque oil painting', desc: 'Baroque oil painting, Caravaggio-style chiaroscuro, warm amber glow against velvet black, visible brushwork' },
  { slug: 'art-nouveau', style: 'Art Nouveau ornamental', desc: 'Art Nouveau ornamental, Alphonse Mucha lineage, flowing organic linework, muted gilt and pastel palette, decorative border motifs' },
  { slug: 'tarot-baroque', style: 'Tarot card baroque', desc: 'Tarot card illustration, Pamela Colman Smith lineage, flat color plates with gold foil accents, symbolic iconography' },
  { slug: 'sumi-e', style: 'Japanese ink wash', desc: 'Japanese sumi-e ink wash, minimal brush strokes, negative space, single subject on rice paper' },
  { slug: 'chiaroscuro-woodcut', style: 'High-contrast woodcut', desc: 'High-contrast woodcut, Albrecht Durer lineage, stark black on cream, heavy hatching, medieval woodblock texture' },
  { slug: 'cel-anime-modern', style: 'Modern cel-shaded anime', desc: 'Modern cel-shaded anime, flat color fills with hard edges, expressive character design, studio-quality animation cel' },
  { slug: 'pixel-16bit', style: '16-bit pixel art', desc: '16-bit pixel art, limited 32-color palette, dithering, SNES-era JRPG portrait aesthetic' },
  { slug: 'stained-glass', style: 'Stained glass panel', desc: 'Stained glass cathedral panel, heavy black leaded lines, jewel-tone glass, backlit luminosity' },
  { slug: 'botanical-illustration', style: 'Victorian botanical plate', desc: 'Victorian botanical illustration plate, delicate watercolor wash, fine ink outlines, natural history register' },
  { slug: 'german-expressionist', style: 'German expressionist woodblock', desc: 'German expressionist woodblock print, jagged angular lines, stark psychological intensity, limited monochrome' },
  { slug: 'moebius-comic', style: '1970s Moebius comic', desc: '1970s French comic art, Moebius lineage, clean precise linework, flat washed color, surreal atmosphere' },
  { slug: 'deco-travel-poster', style: 'Art Deco travel poster', desc: 'Art Deco travel poster, bold geometric forms, stylized silhouettes, restrained palette of two or three saturated colors' },
  { slug: 'silent-film-still', style: 'Silent film still', desc: 'Silent film still, black and white with soft grain, theatrical expressionist lighting, 1920s cinema quality' },
  { slug: 'golden-age-illustration', style: 'Golden Age illustration', desc: 'Golden Age storybook illustration, Arthur Rackham and Edmund Dulac lineage, watercolor and ink, delicate detail' },
  { slug: 'cyberpunk-noir', style: 'Cyberpunk neon noir', desc: 'Cyberpunk neon-noir, high contrast, synth-wave palette of magenta and cyan against deep black, rain-slick surfaces' },
  { slug: 'risograph-duotone', style: 'Risograph duotone print', desc: 'Risograph two-color print, imperfect layer registration, paper grain texture, fluorescent ink palette' },
  { slug: 'scrimshaw', style: 'Scrimshaw etching', desc: 'Scrimshaw whalebone etching, fine scribed lines on ivory ground, nautical Victorian aesthetic' },
  { slug: 'pulp-scifi', style: '1950s pulp sci-fi cover', desc: '1950s pulp science fiction magazine cover, gouache paint, saturated primary colors, dramatic action pose' },
];

function seededShuffle(arr, seed) {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickPairs(count) {
  // First pass: at least one of every STYLE. Pair each style with a random character.
  const shuffledChars = seededShuffle(CHARACTERS, 7);
  const firstPass = STYLES.map((s, i) => [shuffledChars[i % shuffledChars.length], s]);
  // Second pass: fill the rest by seeded-shuffling all remaining (char, style) pairs.
  const used = new Set(firstPass.map(([c, s]) => `${c.slug}::${s.slug}`));
  const all = [];
  for (const c of CHARACTERS) for (const s of STYLES) {
    if (!used.has(`${c.slug}::${s.slug}`)) all.push([c, s]);
  }
  const fill = seededShuffle(all, 42).slice(0, Math.max(0, count - firstPass.length));
  return [...firstPass, ...fill].slice(0, count);
}

function buildPrompt(c, s) {
  return [
    `Editorial portrait illustration of ${c.character} — ${c.moment}.`,
    `Style: ${s.desc}.`,
    `Composition: single figure in portrait crop, rich tonal depth, strong focal point.`,
    `No text, no letters, no watermark, no frame, no border.`,
    `Public-domain source: ${c.origin}.`,
    `Collectible trading-card artwork aesthetic.`,
  ].join(' ');
}

async function generate(c, s) {
  const prompt = buildPrompt(c, s);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1536',
      quality: 'high',
      n: 1,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${body.slice(0, 400)}`);
  }
  const j = await res.json();
  const b64 = j.data?.[0]?.b64_json;
  if (!b64) throw new Error(`no b64_json in response: ${JSON.stringify(j).slice(0, 200)}`);
  const png = Buffer.from(b64, 'base64');
  const webp = await sharp(png).webp({ quality: 85 }).toBuffer();
  const dir = path.join(OUT_DIR, c.slug);
  await fs.mkdir(dir, { recursive: true });
  const fname = `${s.slug}-1.webp`;
  await fs.writeFile(path.join(dir, fname), webp);
  return {
    id: `${c.slug}-${s.slug}-1`,
    character: c.character,
    characterSlug: c.slug,
    set: c.set,
    moment: c.moment,
    style: s.style,
    styleSlug: s.slug,
    variant: 1,
    path: `/moodboard-art/${c.slug}/${fname}`,
    prompt,
    model: 'gpt-image-1',
    costUsd: 0.17,
    generatedAt: new Date().toISOString(),
    bytes: webp.length,
  };
}

async function main() {
  const pairs = pickPairs(COUNT);
  console.log(`seeding ${pairs.length} images @ concurrency=${CONCURRENCY}`);
  const startTs = Date.now();
  const items = [];
  const errors = [];
  let cursor = 0;
  async function worker(id) {
    while (true) {
      const my = cursor++;
      if (my >= pairs.length) return;
      const [c, s] = pairs[my];
      try {
        const item = await generate(c, s);
        items.push(item);
        process.stdout.write(`✓ [${my + 1}/${pairs.length}] ${c.character} × ${s.style} (${(item.bytes / 1024).toFixed(0)}KB)\n`);
      } catch (e) {
        errors.push({ char: c.slug, style: s.slug, error: String(e) });
        process.stdout.write(`✗ [${my + 1}/${pairs.length}] ${c.character} × ${s.style}: ${String(e).slice(0, 200)}\n`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  await fs.mkdir(OUT_DIR, { recursive: true });
  let existing = { version: 1, items: [] };
  try { existing = JSON.parse(await fs.readFile(MANIFEST, 'utf8')); } catch {}
  const seen = new Set(existing.items.map((i) => i.id));
  const merged = [...existing.items, ...items.filter((i) => !seen.has(i.id))];
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    model: 'gpt-image-1',
    totalImages: merged.length,
    totalCostUsd: +merged.reduce((a, b) => a + (b.costUsd || 0), 0).toFixed(2),
    items: merged,
  };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  const elapsed = ((Date.now() - startTs) / 1000).toFixed(1);
  console.log(`\ndone: ${items.length} new, ${errors.length} errors, ${elapsed}s, manifest total=${merged.length}`);
  if (errors.length) console.log(JSON.stringify(errors, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
