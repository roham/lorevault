#!/usr/bin/env node
// High-volume art-pool generator. Mixes FLUX (Replicate) + OpenAI gpt-image-1.
// Each image tagged with provider. CEO votes yes/no/other-with-comment at /prototype/art-pool.
// Daemon reads votes (especially "other" comments) to refine future prompts.
//
// Usage:
//   node scripts/seed-art-pool.mjs [--count=100] [--flux-ratio=0.7] [--seed=]
//
// Env: REPLICATE_API_TOKEN + OPENAI_API_KEY

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const REPLICATE = process.env.REPLICATE_API_TOKEN;
const OPENAI = process.env.OPENAI_API_KEY;
if (!REPLICATE) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }
if (!OPENAI) { console.error('OPENAI_API_KEY missing'); process.exit(1); }

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  }),
);
const COUNT = parseInt(args.count ?? '100', 10);
const FLUX_RATIO = parseFloat(args['flux-ratio'] ?? '0.7');
const SEED = parseInt(args.seed ?? String(Math.floor(Math.random() * 1e9)), 10);

const OUT = path.resolve(process.cwd(), 'public/prototype-art/pool');
const MANIFEST = path.join(OUT, 'manifest.json');

// ---- canon ----
const CHARACTERS = [
  { set: 'baker-street', slug: 'sherlock-holmes', character: 'Sherlock Holmes', moments: [
    'mid-deduction at 221B, fingertips at temple, briar pipe at the mantel',
    'studying a clue under magnifying glass at a fog-wet crime scene',
    'at the violin by the window in lamplight',
  ]},
  { set: 'baker-street', slug: 'moriarty', character: 'Professor Moriarty', moments: [
    'reptilian-headed at his desk, web of crime-pinned crimson string behind him',
    'at the chessboard in green banker-lamp light',
  ]},
  { set: 'baker-street', slug: 'irene-adler', character: 'Irene Adler', moments: [
    'in opera-cloak at first light holding a photograph like a drawn pistol',
    'at the dressing-table with letters and a half-smile of triumph',
  ]},
  { set: 'baker-street', slug: 'the-hound', character: 'The Hound of the Baskervilles', moments: [
    'spectral hound charging across phosphorescent moor under blood-moon',
    'eyes-only in the fog with tor stones',
  ]},
  { set: 'enchanted-kingdom', slug: 'snow-white', character: 'Snow White', moments: [
    'cradling a poisoned red apple at the cottage threshold, bluebird on her wrist',
    'in the glass coffin with seven lanterns distant',
  ]},
  { set: 'enchanted-kingdom', slug: 'evil-queen', character: 'The Evil Queen', moments: [
    'before a mirror of liquid silver, ravens at the frame',
    'as the crone with the apple in a moonlit forest',
  ]},
  { set: 'enchanted-kingdom', slug: 'red-riding-hood', character: 'Red Riding Hood', moments: [
    'the crimson cloak alone in a cathedral of black trees with wolf-eyes resolving',
    'at the cottage threshold with the basket and the wolf in shadow',
  ]},
  { set: 'enchanted-kingdom', slug: 'rumpelstiltskin', character: 'Rumpelstiltskin', moments: [
    'spinning straw into molten gold at midnight by firelight',
    'in the throne hall demanding the child',
  ]},
  { set: 'wonderland', slug: 'alice', character: 'Alice', moments: [
    'falling through the rabbit hole among floating clocks and teacups',
    'at the impossible tea-party table with the Hatter and Hare',
    'before the door with the DRINK ME bottle, a key on the table',
  ]},
  { set: 'wonderland', slug: 'cheshire-cat', character: 'The Cheshire Cat', moments: [
    'fading on a moonlit branch with only the grin fully resolved',
    'as a fully-rendered painting on a mushroom canopy',
  ]},
  { set: 'wonderland', slug: 'mad-hatter', character: 'The Mad Hatter', moments: [
    'mid-riddle at the eternal tea party, mismatched cups levitating',
    'crowning the March Hare in confetti, dormouse in teapot',
  ]},
  { set: 'wonderland', slug: 'queen-of-hearts', character: 'The Queen of Hearts', moments: [
    'mid-verdict, card-soldiers fleeing, rose garden dripping red paint',
    'on the throne reviewing painted-red roses',
  ]},
  { set: 'gothic-horror', slug: 'dracula', character: 'Count Dracula', moments: [
    'enthroned in a Transylvanian catacomb, bats wheeling in crypt light',
    'at the ruined rose window of the cathedral at moonrise',
  ]},
  { set: 'gothic-horror', slug: 'frankenstein-monster', character: "Frankenstein's Monster", moments: [
    'first conscious moment as Tesla coils arc and lightning cracks the skylight',
    'reading a book by candlelight in a snowbound cabin',
  ]},
  { set: 'gothic-horror', slug: 'jekyll', character: 'Dr. Jekyll', moments: [
    'split-figure mid-transformation, dignified doctor on one half dissolving into Hyde',
    'before the mirror at the moment of recognition',
  ]},
  { set: 'gothic-horror', slug: 'phantom', character: 'The Phantom of the Opera', moments: [
    'masked at a monumental pipe organ on a stone island in black water',
    'on the underground boat lit by a single candelabrum',
  ]},
  { set: 'greek-myth', slug: 'prometheus', character: 'Prometheus', moments: [
    'descending from storm-clouds with a living ember in a fennel stalk',
    'chained to the Caucasus rock as the eagle approaches',
  ]},
  { set: 'greek-myth', slug: 'medusa', character: 'Medusa', moments: [
    'amid her stone-statue garden, a single golden tear on her cheek',
    'as the Caravaggio severed-head reflection in Perseus shield',
  ]},
  { set: 'greek-myth', slug: 'zeus', character: 'Zeus', moments: [
    'mid-throw of the forking lightning bolt on Olympus',
    'enthroned beside Hera, eagle at his feet',
  ]},
  { set: 'greek-myth', slug: 'athena', character: 'Athena', moments: [
    'on the Acropolis at dawn with golden owl on shoulder',
    'in full panoply with aegis and spear before the Parthenon',
  ]},
];

// 5 cross-cutting "parallels" — the lens applied to each character × moment.
// Each parallel has its own art register. The pool is randomly distributed across them.
const PARALLELS = [
  { slug: 'painterly', label: 'Painterly Epic',
    desc: 'Masterwork oil painting in the tradition of Frank Frazetta + Drew Struzan + Alex Ross. Dramatic three-quarter hero composition, multi-source chiaroscuro, jewel-tone palette, museum-grade impasto brushwork, extreme detail density at every edge of the frame.' },
  { slug: 'arcana', label: 'ARCANA — sacred-geometry mandala',
    desc: 'Sacred-geometry mandala glowing behind the figure\'s head, gold-leaf filigree, alchemical sigils at the cardinal points. Saturated jewel-tone color, ornamental tarot-plate density, the figure as icon at the center of a cosmological diagram. Painterly-ornate, ritual register.' },
  { slug: 'aether', label: 'AETHER — cosmic-mythic',
    desc: 'Aurora-cosmic backdrop, divine particulate, god-rays, sacred geometry diagrams floating in light, glyphs etched in the air. The figure rendered at mythic scale against nebulae and cosmological diagrams. Alex Ross gravitas + Tarot symbolism + Dune cinematic grandeur.' },
  { slug: 'witness', label: 'WITNESS — photoreal time-travel',
    desc: 'Cinematic photorealism as if captured by a present-day master cinematographer time-traveled with modern camera gear. Roger Deakins lighting + Emmanuel Lubezki naturalism. Period setting with full modern-film realism: skin pores, fabric weave, dust in the air, volumetric haze, anamorphic lens flares. Documentary register elevated to theatrical cinema.' },
  { slug: 'neon', label: 'NEON — cyber-reimagined',
    desc: 'The figure relocated to NOW or near-future with the canonical Spine intact. Cyberpunk neon-noir palette, magenta and cyan against deep black, rain-slick mirrored surfaces, holographic atmosphere, Blade Runner 2049 + Syd Mead grandeur. Modern materials, urban/tech textures, but the mythic weight kept.' },
];

const NEGATIVE_INSTRUCTIONS = `Composition: cinematic three-quarter hero shot, portrait orientation, strong focal point, dramatic directional lighting with rim light defining silhouette, volumetric atmosphere with visible particulates. No text, no letters, no watermark, no logo, no signature, no card frame, no border. Public-domain character.`;

function buildPrompt(c, moment, parallel) {
  return [
    `Premium collectible trading-card artwork — masterwork-quality, museum-grade.`,
    `Subject: ${c.character} — ${moment}.`,
    `Lens: ${parallel.desc}`,
    NEGATIVE_INSTRUCTIONS,
  ].join(' ');
}

// ---- Seedable RNG ----
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickCells(count, rng) {
  const cells = [];
  for (const c of CHARACTERS) for (const moment of c.moments) for (const p of PARALLELS) {
    cells.push({ c, moment, parallel: p });
  }
  // shuffle
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return cells.slice(0, count);
}

// ---- Provider clients ----
async function genFlux(prompt) {
  const submit = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json', Prefer: 'wait' },
    body: JSON.stringify({ input: { prompt, aspect_ratio: '2:3', output_format: 'png', safety_tolerance: 5, raw: false } }),
  });
  if (!submit.ok) throw new Error(`flux ${submit.status}: ${(await submit.text()).slice(0,200)}`);
  const j = await submit.json();
  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error('flux: no output');
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

class RateLimiter {
  constructor(max, win) { this.max = max; this.win = win; this.s = []; }
  async acquire() {
    while (true) {
      const now = Date.now();
      this.s = this.s.filter((t) => now - t < this.win);
      if (this.s.length < this.max) { this.s.push(now); return; }
      await new Promise((r) => setTimeout(r, this.win - (now - this.s[0]) + 200));
    }
  }
}
const openaiLimiter = new RateLimiter(5, 60_000);

async function genOpenai(prompt) {
  await openaiLimiter.acquire();
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1024x1536', quality: 'high', n: 1 }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) {
      const m = body.match(/try again in (\d+)s/i);
      const wait = (m ? parseInt(m[1], 10) : 15) + 1;
      await new Promise((r) => setTimeout(r, wait * 1000));
      return genOpenai(prompt);
    }
    throw new Error(`openai ${res.status}: ${body.slice(0,200)}`);
  }
  const j = await res.json();
  return Buffer.from(j.data[0].b64_json, 'base64');
}

async function genCell(cell, provider, idx) {
  const prompt = buildPrompt(cell.c, cell.moment, cell.parallel);
  const t0 = Date.now();
  let buf;
  try {
    buf = provider === 'flux' ? await genFlux(prompt) : await genOpenai(prompt);
  } catch (e) {
    return { ok: false, idx, error: String(e), cell, provider };
  }
  const webp = await sharp(buf).webp({ quality: 90 }).toBuffer();
  const dir = path.join(OUT, cell.c.slug);
  await fs.mkdir(dir, { recursive: true });
  // Stable id: use first 8 chars of sha-like over cell+provider+idx
  const id = `${cell.c.slug}-${cell.parallel.slug}-${provider}-${idx.toString(36)}`;
  const fname = `${cell.parallel.slug}-${provider}-${idx.toString(36)}.webp`;
  await fs.writeFile(path.join(dir, fname), webp);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[${dt}s] ${provider} ${cell.c.slug} × ${cell.parallel.slug} (${(webp.length / 1024).toFixed(0)}KB)`);
  return {
    ok: true, idx, provider,
    item: {
      id,
      character: cell.c.character,
      characterSlug: cell.c.slug,
      set: cell.c.set,
      moment: cell.moment,
      parallel: cell.parallel.label,
      parallelSlug: cell.parallel.slug,
      provider, // 'flux' or 'openai'
      providerLabel: provider === 'flux' ? 'FLUX 1.1 Pro Ultra' : 'OpenAI gpt-image-1',
      path: `/prototype-art/pool/${cell.c.slug}/${fname}`,
      prompt,
      bytes: webp.length,
      generatedAt: new Date().toISOString(),
      costUsd: provider === 'flux' ? 0.04 : 0.17,
    },
  };
}

// ---- Main ----
const rng = mulberry32(SEED);
const cells = pickCells(COUNT, rng);
const fluxCount = Math.round(COUNT * FLUX_RATIO);
const cellWithProvider = cells.map((cell, i) => ({ cell, provider: i < fluxCount ? 'flux' : 'openai', idx: i }));

console.log(`art-pool seed: count=${COUNT}, flux=${fluxCount}, openai=${COUNT - fluxCount}, seed=${SEED}`);
const t0 = Date.now();

// FLUX in parallel-ish (Replicate handles concurrent), OpenAI rate-limited internally
const FLUX_CONCURRENCY = 8;
const fluxWork = cellWithProvider.filter((c) => c.provider === 'flux');
const openaiWork = cellWithProvider.filter((c) => c.provider === 'openai');

let fluxCursor = 0;
async function fluxWorker() {
  while (true) {
    const my = fluxCursor++;
    if (my >= fluxWork.length) return;
    const w = fluxWork[my];
    const r = await genCell(w.cell, w.provider, w.idx);
    fluxResults.push(r);
  }
}
const fluxResults = [];
const fluxWorkers = Array.from({ length: FLUX_CONCURRENCY }, () => fluxWorker());

const openaiResults = await Promise.all(openaiWork.map((w) => genCell(w.cell, w.provider, w.idx)));
await Promise.all(fluxWorkers);

const allResults = [...fluxResults, ...openaiResults];
const items = allResults.filter((r) => r.ok).map((r) => r.item);
const errors = allResults.filter((r) => !r.ok).map((r) => ({ provider: r.provider, char: r.cell.c.slug, parallel: r.cell.parallel.slug, error: r.error }));

// Merge with existing manifest
let existing = { version: 1, items: [] };
try { existing = JSON.parse(await fs.readFile(MANIFEST, 'utf8')); } catch {}
const seen = new Set(existing.items.map((i) => i.id));
const merged = [...existing.items, ...items.filter((i) => !seen.has(i.id))];
const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  totalImages: merged.length,
  totalCostUsd: +merged.reduce((a, b) => a + (b.costUsd || 0), 0).toFixed(2),
  items: merged,
};
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

const totalSec = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`\ndone in ${totalSec}s — ${items.length} new (${items.filter(i => i.provider === 'flux').length} flux, ${items.filter(i => i.provider === 'openai').length} openai), ${errors.length} errors. manifest total ${merged.length}.`);
if (errors.length) console.log(JSON.stringify(errors, null, 2).slice(0, 1500));
