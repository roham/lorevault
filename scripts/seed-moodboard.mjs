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
const CONCURRENCY = parseInt(args.concurrency ?? '5', 10);
const RATE_LIMIT_PER_MIN = parseInt(args.rpm ?? '5', 10); // gpt-image-1 tier-1 = 5/min
const MAX_RETRIES = parseInt(args.retries ?? '4', 10);
const FORCE = args.force === 'true' || args.force === '1';
const PROMPT_VERSION = 2; // bump when prompt template changes materially

const OUT_DIR = path.resolve(process.cwd(), 'public/moodboard-art');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

// Each character includes a rich SCENE description — cinematic specifics the
// prompt weaves into the composition so the art reads as a captured moment,
// not a generic portrait.
const CHARACTERS = [
  { set: 'baker-street', slug: 'sherlock-holmes', character: 'Sherlock Holmes', moment: 'At 221B Baker Street, mid-deduction',
    scene: 'pipe smoke coiling up into kerosene backlight, magnifying glass angled across a bloodied scarf on the table, fog pressing against the leaded glass window, violin and pistol visible in shadow, tight hawkish profile',
    origin: 'Arthur Conan Doyle 1887' },
  { set: 'baker-street', slug: 'moriarty', character: 'Professor Moriarty', moment: 'The Napoleon of Crime in his lair',
    scene: 'gaunt reptilian head tilted forward over a chessboard of London, web of crimson threads connecting crime scenes behind him, single green banker-lamp illumination, predatory stillness',
    origin: 'Arthur Conan Doyle 1893' },
  { set: 'baker-street', slug: 'irene-adler', character: 'Irene Adler', moment: 'The Woman, in disguise at dawn',
    scene: 'men\'s evening dress and opera cloak half-turned away, a photograph held between gloved fingers, the first pale light through a Belgravia window, half-smile of triumph',
    origin: 'Arthur Conan Doyle 1891' },
  { set: 'baker-street', slug: 'the-hound', character: 'The Hound of the Baskervilles', moment: 'On the moor at midnight',
    scene: 'enormous coal-black hound mid-charge across phosphorescent moorland mist, jaws dripping green fire, tor stones silhouetted against a blood-moon, terror given shape',
    origin: 'Arthur Conan Doyle 1902' },
  { set: 'enchanted-kingdom', slug: 'snow-white', character: 'Snow White', moment: 'The apple in her hand',
    scene: 'young princess cradling a poisoned red apple, enchanted forest closing around her, seven tiny lanterns distant among black trees, a single bluebird landing on her wrist, fairy-tale dread',
    origin: 'Brothers Grimm 1812' },
  { set: 'enchanted-kingdom', slug: 'evil-queen', character: 'The Evil Queen', moment: 'Before the scrying mirror',
    scene: 'regal silhouette in a black crown and blood-jewel collar, skeletal hand reaching toward a mirror of liquid silver showing a distant face, ravens perched on the mirror frame, candlelit obsidian chamber',
    origin: 'Brothers Grimm 1812' },
  { set: 'enchanted-kingdom', slug: 'red-riding-hood', character: 'Little Red Riding Hood', moment: 'Deep in the dark forest',
    scene: 'crimson cloak a single bright shape against a cathedral of black trees, yellow wolf eyes materializing among the trunks, breadcrumbs scattered, basket held close, defiance in her stance',
    origin: 'Charles Perrault 1697' },
  { set: 'enchanted-kingdom', slug: 'rumpelstiltskin', character: 'Rumpelstiltskin', moment: 'Spinning straw into gold at midnight',
    scene: 'bent imp figure at a spinning wheel trailing molten gold thread, fireplace throwing jagged shadows, piles of spun gold around bare feet, wild grin of an unholy bargain',
    origin: 'Brothers Grimm 1812' },
  { set: 'wonderland', slug: 'alice', character: 'Alice', moment: 'Falling through the rabbit hole',
    scene: 'blue pinafore trailing upward as she plummets, falling clocks and teacups and oil portraits around her, tunnel walls flaring with impossible colors, wide astonished eyes',
    origin: 'Lewis Carroll 1865' },
  { set: 'wonderland', slug: 'cheshire-cat', character: 'The Cheshire Cat', moment: 'Fading to a grin in the moonlit forest',
    scene: 'stripes of purple and teal dissolving into bioluminescent air, only the impossible Cheshire grin fully resolved, mushroom canopy below, riddle made visible',
    origin: 'Lewis Carroll 1865' },
  { set: 'wonderland', slug: 'mad-hatter', character: 'The Mad Hatter', moment: 'At the eternal tea party',
    scene: 'wild-haired hatter mid-laugh at a long broken table, mismatched cups levitating, the March Hare and a dormouse in teapot, pocket watch smeared with butter, sky impossibly green',
    origin: 'Lewis Carroll 1865' },
  { set: 'wonderland', slug: 'queen-of-hearts', character: 'The Queen of Hearts', moment: 'Mid-verdict — off with their heads!',
    scene: 'wrathful crowned monarch thundering forward, card-soldier guards fleeing, rose garden behind her painted red and dripping, croquet mallet raised, royal fury',
    origin: 'Lewis Carroll 1865' },
  { set: 'gothic-horror', slug: 'dracula', character: 'Count Dracula', moment: 'Enthroned in the Transylvanian catacomb',
    scene: 'tall gaunt aristocrat on a throne of black iron, bats wheeling through crypt light, crimson velvet and candle wax, blood-haze on his high collar, moon through the ruined rose window',
    origin: 'Bram Stoker 1897' },
  { set: 'gothic-horror', slug: 'frankenstein-monster', character: "Frankenstein's Monster", moment: 'The moment of awakening',
    scene: 'stitched giant on the slab as electricity arcs from Tesla coils, lightning cracking the attic window, first conscious eyes opening, laboratory glassware shattering around him',
    origin: 'Mary Shelley 1818' },
  { set: 'gothic-horror', slug: 'jekyll', character: 'Dr. Jekyll', moment: 'The transformation caught mid-change',
    scene: 'split-figure — dignified Victorian doctor on one side dissolving into feral Hyde on the other, bubbling green elixir dropped and shattering, moonlight through a laboratory skylight, horror dawning',
    origin: 'R.L. Stevenson 1886' },
  { set: 'gothic-horror', slug: 'phantom', character: 'The Phantom of the Opera', moment: 'At the underground organ',
    scene: 'masked figure pounding a massive pipe organ on a stone island in black water, candelabras and chandelier hooks, scored manuscript pages scattered, rose petals on the keys, gothic obsession',
    origin: 'Gaston Leroux 1910' },
  { set: 'greek-myth', slug: 'prometheus', character: 'Prometheus', moment: 'Stealing fire from Olympus',
    scene: 'titan descending the clouds clutching a living ember in a fennel stalk, golden firelight across his chest, Zeus\'s eagle screaming in the distance, humanity watching from below',
    origin: 'Hesiod c.700 BCE' },
  { set: 'greek-myth', slug: 'medusa', character: 'Medusa', moment: 'At the center of her stone garden',
    scene: 'serpent-hair alive and coiling in all directions, marble warriors frozen mid-scream encircling her, a single gold tear on her cheek, basalt cavern lit by oil lamps, tragic sovereignty',
    origin: 'Hesiod c.700 BCE' },
  { set: 'greek-myth', slug: 'zeus', character: 'Zeus', moment: 'Wielding the thunderbolt on Olympus',
    scene: 'god-king mid-throw of a forking lightning bolt, marble pillars cracking behind him, eagles circling, storm clouds parting to reveal infinite blue, olive crown blazing',
    origin: 'Hesiod c.700 BCE' },
  { set: 'greek-myth', slug: 'athena', character: 'Athena', moment: 'Wisdom and war, owl on shoulder',
    scene: 'gray-eyed goddess in crested Corinthian helm and gleaming aegis, golden owl perched on her shoulder, spear planted, Acropolis silhouette behind her at dawn, calm lethality',
    origin: 'Hesiod c.700 BCE' },
];

// Style descriptions are aimed at peak collectible-card art — Magic: The Gathering
// mythic-rare, Pokemon holographic, NBA Top Shot cinematic. Each description forces
// density of detail, dramatic lighting, and a hero-shot composition.
const STYLES = [
  // Powerhouse painterly — the Frazetta/Struzan/Amano lineage
  { slug: 'frazetta-painterly', style: 'Frazetta painterly fantasy', desc: 'Frank Frazetta oil-on-board fantasy painting — heroic anatomy, volumetric amber-and-crimson lighting, dynamic diagonal composition, impasto brushwork, epic mood, museum fantasy masterwork' },
  { slug: 'struzan-poster', style: 'Drew Struzan theatrical', desc: 'Drew Struzan theatrical movie poster — cinematic hero-shot, airbrush-meets-pencil realism, golden rim light and deep negative space, supporting scene elements orbiting the subject, 1980s blockbuster grandeur' },
  { slug: 'alex-ross-realism', style: 'Alex Ross hyper-realist', desc: 'Alex Ross gouache hyper-realism — photoreal figure study, dramatic low-angle hero framing, sculptural lighting, saturated color against muted sky, iconic comic-cover gravitas' },
  { slug: 'amano-ethereal', style: 'Yoshitaka Amano ethereal', desc: 'Yoshitaka Amano ethereal watercolor — translucent washes, elongated figures, metallic gold leaf accents, negative space bloom, dreamlike fantasy royalty, Final Fantasy concept-art splendor' },
  { slug: 'mtg-mythic', style: 'Magic: The Gathering mythic', desc: 'Magic: The Gathering mythic-rare card art — lush painterly fantasy, dramatic action in a detailed environment, cinematic rim light, chromatic saturation, mana-infused atmospheric effects, premium TCG composition' },
  { slug: 'beksinski-surreal', style: 'Beksiński dark surrealism', desc: 'Zdzisław Beksiński dark surrealism — otherworldly decay, ochre and blood palette, architectural dread, painterly textures, unsettling sublime' },
  { slug: 'ghibli-painted', style: 'Studio Ghibli painted', desc: 'Studio Ghibli painted background — Kazuo Oga-style atmospheric perspective, soft gouache, luminous natural light, hand-painted environmental richness, humane awe' },
  { slug: 'mucha-maximal', style: 'Mucha maximal Art Nouveau', desc: 'Alphonse Mucha maximalist Art Nouveau — ornamental gilded frame integrated into the composition, flowing hair as decorative border, halo of botanical filigree, jewel-tone flat color against gold leaf, stained-glass pattern backdrop' },
  // Refined historical — pushed toward their most dramatic expressions
  { slug: 'baroque-oil', style: 'Baroque oil chiaroscuro', desc: 'Caravaggio tenebrism oil painting — single dramatic directional light source out of deep black, jewel-tone velvet and gold, visible impasto, theatrical religious-painting gravitas, museum old-master finish' },
  { slug: 'dore-etching', style: 'Gustave Doré engraving', desc: 'Gustave Doré steel engraving — infinite fine crosshatch depth, apocalyptic chiaroscuro, Inferno-level dramatic density, sepia monochrome, sublime Victorian fantasy illustration' },
  { slug: 'tarot-baroque', style: 'Baroque tarot card', desc: 'Baroque tarot card illustration in the Rider-Waite-Smith lineage pushed to maximum — ornate gold-foil frame integrated into the art, symbolic iconography encoded in the composition, jewel-tone flat color plates, medieval illumination density' },
  { slug: 'stained-glass', style: 'Cathedral stained glass', desc: 'Cathedral stained-glass panel at maximum density — heavy black leaded lines defining every contour, saturated jewel-tone glass (ruby, sapphire, emerald), backlit cathedral luminosity, ornamental tracery border' },
  { slug: 'german-expressionist', style: 'Expressionist woodblock', desc: 'German expressionist woodblock print in the Kirchner/Nolde lineage — jagged gouged lines, stark psychological intensity, bold chromatic accents against monochrome chaos, Caligari-era cinema atmosphere' },
  { slug: 'moebius-comic', style: 'Moebius comic panel', desc: 'Jean Giraud "Moebius" comic art — clean confident linework, flat washed alien color, surreal architectural detail, 1970s Métal Hurlant grandeur, dreamlike hero composition' },
  { slug: 'golden-age-illustration', style: 'Golden Age storybook', desc: 'Golden Age of Illustration — Arthur Rackham and Edmund Dulac combined, watercolor and ink, gnarled detailed trees and delicate figures, borderline gilt frame, Edwardian fantasy book-plate quality' },
  { slug: 'deco-travel-poster', style: 'Art Deco hero poster', desc: 'Art Deco theatrical poster — bold geometric shapes, stylized silhouette at heroic scale, ziggurat-era sunburst behind subject, gold leaf and three-color saturated palette, 1930s monumental graphic design' },
  { slug: 'cyberpunk-noir', style: 'Cyberpunk neon epic', desc: 'Cyberpunk neon-noir with epic scale — magenta/cyan chromatic lighting against deep black, rain-slick mirrored surfaces, holographic atmosphere, Syd Mead meets Blade Runner 2049 futurist grandeur' },
  { slug: 'victorian-engraving', style: 'Victorian steel engraving', desc: 'Victorian steel-plate engraving at maximum density — infinite crosshatch and stipple, sepia monochrome, 1880s Harper\'s frontispiece-quality period detail, dramatic theatrical lighting' },
  { slug: 'noir-poster-30s', style: '1930s noir poster', desc: '1930s theatrical noir movie poster — silver halide grain, hard chiaroscuro, smoke and rain, limited palette of charcoal, blood and cream, dramatic typography-free hero composition' },
  { slug: 'silent-film-still', style: 'Expressionist silent-film still', desc: 'German expressionist silent-film still — Caligari / Metropolis / Nosferatu lineage, black-and-white with soft halation grain, theatrical extreme lighting, painted-set architectural drama' },
  { slug: 'pulp-scifi', style: '1950s pulp cover', desc: '1950s pulp science-fiction magazine cover — gouache paint, saturated primary palette, dynamic low-angle hero pose, retro-futurist grandeur, pulp-heroic energy' },
  { slug: 'cel-anime-modern', style: 'Cinematic anime cel', desc: 'Cinematic anime key-art — detailed Makoto Shinkai / Production I.G lineage, volumetric god-ray lighting, painted sky with particle bloom, crisp cel-shaded figure against atmospheric depth' },
  { slug: 'chiaroscuro-woodcut', style: 'Dürer woodcut density', desc: 'Albrecht Dürer woodcut at maximum density — stark black on cream, heavy hatching defining every form, medieval detail in clothing and environment, apocalyptic gravitas' },
  { slug: 'sumi-e', style: 'Akira Kurosawa sumi-e', desc: 'Cinematic sumi-e ink painting — Kurosawa framing meets Sesshu Toyo mastery, bold sweeping brushstrokes with explosive density at focal point, silver-leaf background hints, dramatic negative space with a single vivid chromatic accent' },
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
    `Epic collectible trading-card art — premium mythic-rare quality, museum-worthy.`,
    `Subject: ${c.character} — ${c.moment}.`,
    `Scene: ${c.scene}.`,
    `Style: ${s.desc}.`,
    `Composition: cinematic three-quarter hero shot in portrait orientation,`,
    `dramatic directional light with strong rim/back light defining silhouette,`,
    `volumetric atmosphere, environmental depth with foreground and background layers,`,
    `extreme detail density — every surface textured, every fold articulated.`,
    `Emotional register: awe, power, iconic presence.`,
    `Technical: no text, no letters, no watermark, no logo, no signature.`,
    `Public-domain source: ${c.origin}.`,
  ].join(' ');
}

// Token-bucket rate limiter: max N starts per rolling window.
class RateLimiter {
  constructor(maxPerWindow, windowMs) {
    this.max = maxPerWindow;
    this.win = windowMs;
    this.stamps = [];
  }
  async acquire() {
    while (true) {
      const now = Date.now();
      this.stamps = this.stamps.filter((t) => now - t < this.win);
      if (this.stamps.length < this.max) {
        this.stamps.push(now);
        return;
      }
      const wait = this.win - (now - this.stamps[0]) + 200;
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}
const limiter = new RateLimiter(RATE_LIMIT_PER_MIN, 60_000);

function parseRetryAfterSeconds(text) {
  const m = text.match(/try again in (\d+)s/i);
  return m ? parseInt(m[1], 10) + 1 : 15;
}

async function generate(c, s) {
  const prompt = buildPrompt(c, s);
  let lastErr = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    await limiter.acquire();
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
    if (res.ok) { const j = await res.json(); return await processImage(c, s, prompt, j); }
    const body = await res.text();
    if (res.status === 429) {
      const wait = parseRetryAfterSeconds(body);
      process.stdout.write(`  · 429 ${c.slug}×${s.slug}, waiting ${wait}s (attempt ${attempt + 1}/${MAX_RETRIES + 1})\n`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      lastErr = new Error(`429 after ${MAX_RETRIES} retries: ${body.slice(0, 200)}`);
      continue;
    }
    if (res.status === 400 && /moderation_blocked/.test(body)) {
      throw new Error(`moderation_blocked (permanent skip): ${body.slice(0, 200)}`);
    }
    throw new Error(`${res.status} ${body.slice(0, 400)}`);
  }
  throw lastErr ?? new Error('max retries exceeded');
}

async function processImage(c, s, prompt, j) {
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
    promptVersion: PROMPT_VERSION,
    model: 'gpt-image-1',
    costUsd: 0.17,
    generatedAt: new Date().toISOString(),
    bytes: webp.length,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let existing = { version: 1, items: [] };
  try { existing = JSON.parse(await fs.readFile(MANIFEST, 'utf8')); } catch {}
  // If --force: regenerate even if the ID exists (for prompt-template upgrades).
  // Otherwise: skip IDs we already have at the current PROMPT_VERSION.
  const upToDateIds = new Set(
    existing.items
      .filter((i) => (i.promptVersion ?? 1) >= PROMPT_VERSION)
      .map((i) => i.id),
  );
  const pairs = pickPairs(COUNT);
  const todo = FORCE
    ? pairs
    : pairs.filter(([c, s]) => !upToDateIds.has(`${c.slug}-${s.slug}-1`));
  console.log(
    `target ${pairs.length}, up-to-date at v${PROMPT_VERSION}: ${pairs.length - todo.length}, generating ${todo.length} ` +
    `@ concurrency=${CONCURRENCY}, rate=${RATE_LIMIT_PER_MIN}/min${FORCE ? ' [FORCE]' : ''}`,
  );
  const startTs = Date.now();
  const items = [];
  const errors = [];
  let cursor = 0;
  async function worker(_id) {
    while (true) {
      const my = cursor++;
      if (my >= todo.length) return;
      const [c, s] = todo[my];
      try {
        const item = await generate(c, s);
        items.push(item);
        process.stdout.write(`✓ [${my + 1}/${todo.length}] ${c.character} × ${s.style} (${(item.bytes / 1024).toFixed(0)}KB)\n`);
      } catch (e) {
        errors.push({ char: c.slug, style: s.slug, error: String(e) });
        process.stdout.write(`✗ [${my + 1}/${todo.length}] ${c.character} × ${s.style}: ${String(e).slice(0, 200)}\n`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  // Prefer NEW items over existing when IDs collide (force-regen path).
  // Also drop items whose style was removed from the current palette.
  const newIds = new Set(items.map((i) => i.id));
  const liveStyleSlugs = new Set(STYLES.map((s) => s.slug));
  const merged = [
    ...existing.items.filter((i) => !newIds.has(i.id) && liveStyleSlugs.has(i.styleSlug)),
    ...items,
  ];
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
