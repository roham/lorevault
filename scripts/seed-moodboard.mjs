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
const PROMPT_VERSION = 6; // v6: MODES not styles — photoreal-time-travel, mythic-cosmic, cyber-reimagined, dream-psychedelic, painterly-epic, ornate-ritual

const OUT_DIR = path.resolve(process.cwd(), 'public/moodboard-art');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

// v4 character entries: tight, safety-neutral prose that preserves cinematic direction
// without triggering OpenAI's moderation heuristics. Each entry stays under ~35 words
// per field, avoids words that flag on combat/injury/children-in-peril patterns.
const CHARACTERS = [
  { set: 'baker-street', slug: 'sherlock-holmes', character: 'Sherlock Holmes', moment: 'at 221B Baker Street, deep in thought',
    scene: 'a Victorian study of pipe smoke and oil lamplight, violin and chemistry flasks, fog at the leaded window',
    iconography: 'the Sidney Paget deerstalker cap and Inverness cape',
    composition: 'cinematic three-quarter hero portrait, classical contrapposto, painterly',
    origin: 'Arthur Conan Doyle, 1887' },
  { set: 'baker-street', slug: 'moriarty', character: 'Professor Moriarty', moment: 'at his study desk, mind orchestrating London',
    scene: 'a green banker\'s lamp carving a scholar from deep shadow, a map of the city behind him, chess pieces before him',
    iconography: 'the wall of notes joined by a single thread of crimson string',
    composition: 'A24 negative-space framing, tenebrism, figure small against the wall',
    origin: 'Arthur Conan Doyle, 1893' },
  { set: 'baker-street', slug: 'irene-adler', character: 'Irene Adler', moment: 'at dawn, after a triumph',
    scene: 'an opulent Belgravia drawing room at first light, opera cloak half-shed, tall windows with silk curtains',
    iconography: 'a single photograph held between gloved fingers',
    composition: 'held-breath portrait with Alex Ross photo-real figure in a mythic still pose',
    origin: 'Arthur Conan Doyle, 1891' },
  { set: 'baker-street', slug: 'the-hound', character: 'The Hound of the Baskervilles', moment: 'racing across the moor at midnight',
    scene: 'an immense black hound bounding across glowing moorland mist, tor stones under a great pale moon',
    iconography: 'the eerie green luminescence around its head (phosphorus legend)',
    composition: 'dramatic scale contrast — the hound vast, the moor stretching to the horizon',
    origin: 'Arthur Conan Doyle, 1902' },
  { set: 'enchanted-kingdom', slug: 'snow-white', character: 'Snow White', moment: 'at the cottage threshold, in quiet contemplation',
    scene: 'a fairytale clearing at dusk, lanterns distant among tall dark trees, a bluebird on her wrist',
    iconography: 'a single shining red apple cradled in her hands',
    composition: 'Kay Nielsen swooping-line composition, cathedral-scale forest, negative-space atmosphere',
    origin: 'Brothers Grimm, 1812' },
  { set: 'enchanted-kingdom', slug: 'evil-queen', character: 'The Evil Queen', moment: 'before the enchanted mirror',
    scene: 'an obsidian chamber with embroidered sigils on the floor, ravens perched on the ornate frame',
    iconography: 'a mirror of liquid silver just beginning to show a distant face',
    composition: 'chiaroscuro — she is silhouette, the mirror is the only light',
    origin: 'Brothers Grimm, 1812' },
  { set: 'enchanted-kingdom', slug: 'red-riding-hood', character: 'Red Riding Hood', moment: 'in the deep woodland',
    scene: 'a towering forest of tall dark trees, autumn leaves, a basket held close, soft shafts of late-day light',
    iconography: 'the vivid crimson hooded cloak — the single bright shape in the scene',
    composition: 'atmospheric scale — figure small within a cathedral of verticals, Kay Nielsen style',
    origin: 'Charles Perrault, 1697' },
  { set: 'enchanted-kingdom', slug: 'rumpelstiltskin', character: 'Rumpelstiltskin', moment: 'spinning straw into gold by firelight',
    scene: 'a stone cottage at midnight, firelight casting long expressionist shadows, piles of spun gold coiled at his feet',
    iconography: 'the ancient spinning wheel trailing molten gold thread',
    composition: 'German-expressionist silhouette, Dürer-density background, dramatic directional light',
    origin: 'Brothers Grimm, 1812' },
  { set: 'wonderland', slug: 'alice', character: 'Alice', moment: 'falling through the rabbit hole',
    scene: 'an impossible tunnel of floating clocks, teacups, oil portraits and cupboards receding into dreamy perspective',
    iconography: 'the blue pinafore and white apron — Tenniel\'s canonical Alice',
    composition: 'Moebius receding-density tunnel, Alice sharp in foreground, depth infinite',
    origin: 'Lewis Carroll, 1865' },
  { set: 'wonderland', slug: 'cheshire-cat', character: 'The Cheshire Cat', moment: 'fading on a moonlit branch',
    scene: 'a mushroom canopy at night, stripes of purple and phosphor teal dissolving into luminous air',
    iconography: 'the impossible Cheshire grin, fully resolved while the body dissolves',
    composition: 'Saul Bass icon-reduction with Tenniel cross-hatched bark accents',
    origin: 'Lewis Carroll, 1865' },
  { set: 'wonderland', slug: 'mad-hatter', character: 'The Mad Hatter', moment: 'mid-riddle at the tea party',
    scene: 'a long absurdist garden table, mismatched teacups levitating, March Hare beside him, dormouse peering from a teapot, chartreuse sky',
    iconography: 'the tall top hat with the "10/6" price ticket tucked in the band',
    composition: 'Pixar-style relational triangle — Hatter, Hare, teapot-mouse',
    origin: 'Lewis Carroll, 1865' },
  { set: 'wonderland', slug: 'queen-of-hearts', character: 'The Queen of Hearts', moment: 'in full regal command',
    scene: 'a rose garden where half the blooms are painted red, card-soldier guards bowing low, a crown tilted with authority',
    iconography: 'the heart-embroidered cloak and playing-card guards — Tenniel canonical Wonderland',
    composition: 'Frank-Miller chiaroscuro silhouette — queen as pure shape, guards paper-thin',
    origin: 'Lewis Carroll, 1865' },
  { set: 'gothic-horror', slug: 'dracula', character: 'Count Dracula', moment: 'enthroned in his castle hall',
    scene: 'a vast Gothic hall of candelabras, crimson velvet, and Byzantine icons, a great rose window in the far wall',
    iconography: 'the towering shadow cast across the stone wall, grander than the figure itself',
    composition: 'Coppola-1992 shadow-as-character staging, Alex Ross photo-real figure, mythic-still posture',
    origin: 'Bram Stoker, 1897' },
  { set: 'gothic-horror', slug: 'frankenstein-monster', character: "Frankenstein's Monster", moment: 'the first moment of consciousness',
    scene: 'a Victorian laboratory of copper coils and spiraling glass, a storm cracking the attic skylight, the inventor in shadow at the edge',
    iconography: 'a seamed hand rising toward the electric light',
    composition: 'Pixar relational-triangle — creation, creator, and the elemental light between them',
    origin: 'Mary Shelley, 1818' },
  { set: 'gothic-horror', slug: 'jekyll', character: 'Dr. Jekyll', moment: 'mid-transformation, the duality visible',
    scene: 'a Victorian laboratory under a shattered skylight, a dropped glass vial glowing faintly green on the floor',
    iconography: 'his own face split between two expressions in a broken mirror',
    composition: 'multiple time beats — past self, present split, future self echoing across mirror fragments',
    origin: 'R. L. Stevenson, 1886' },
  { set: 'gothic-horror', slug: 'phantom', character: 'The Phantom of the Opera', moment: 'at the underground organ',
    scene: 'a cavernous chamber on a stone island in still black water, candelabras and chandelier hooks, floating manuscript pages',
    iconography: 'the white half-mask — the unshown face, Saul Bass symbol',
    composition: 'A24 negative-space dread, Caravaggio tenebrism carving the figure',
    origin: 'Gaston Leroux, 1910' },
  { set: 'greek-myth', slug: 'prometheus', character: 'Prometheus', moment: 'bearing the flame to humanity',
    scene: 'a titan descending from storm-clouds with a living ember in a fennel stalk, golden firelight across his chest, mortals upturned faces below',
    iconography: 'the ember in the fennel stalk — the entire myth in one object',
    composition: 'Waterhouse pre-Raphaelite reverent melancholy, relational triangle (titan, mortals, distant eagle)',
    origin: 'Hesiod, c.700 BCE' },
  { set: 'greek-myth', slug: 'medusa', character: 'Medusa', moment: 'alone in her basalt garden',
    scene: 'a stone cavern lit by oil lamps, marble statues of long-ago warriors at the periphery, olive branches in shadow',
    iconography: 'a single golden tear on her cheek — the detail that transmutes the myth to tragedy',
    composition: 'Waterhouse reverent melancholy, scale contrast with frozen statues at the edges',
    origin: 'Hesiod, c.700 BCE' },
  { set: 'greek-myth', slug: 'zeus', character: 'Zeus', moment: 'on Olympus, wielding the thunderbolt',
    scene: 'marble pillars cracking, eagles circling overhead, storm clouds parting to infinite blue, an olive crown catching sunlight',
    iconography: 'the forking lightning bolt poised in his hand',
    composition: 'classical contrapposto (the Theros move), Alex Ross photo-real figure, mythic posture',
    origin: 'Hesiod, c.700 BCE' },
  { set: 'greek-myth', slug: 'athena', character: 'Athena', moment: 'dawn on the Acropolis',
    scene: 'rose-gold first light behind Acropolis columns, olive trees catching the sun, a spear planted beside her',
    iconography: 'the golden owl perched on her shoulder in perfect stillness',
    composition: 'Waterhouse reverent melancholy, calm authority, hero three-quarter pose',
    origin: 'Hesiod, c.700 BCE' },
];

// v6 reconceives STYLES as MODES — not illustration traditions but rendering LENSES
// that can be applied to any character. User directive: not historically accurate,
// photorealistic time-travel; not reverent, wilder; not period-illustrated, lived-in.
// Six modes = six ways to see the same subject.
const STYLES = [
  { slug: 'witness-photoreal',
    style: 'The Witness — photoreal time-travel',
    desc: 'Cinematic photorealism as if captured by a present-day master cinematographer who time-traveled with modern camera gear. Roger Deakins cinematography + Emmanuel Lubezki naturalism. Accurate period setting rendered with full modern-film realism: skin pores, fabric weave, dust in the air, volumetric haze, soft natural or practical lighting, documentary observational framing elevated to theatrical cinema. Not illustration. Not painting. Photograph-grade realism, dramatic and lived-in.' },
  { slug: 'mythic-cosmic',
    style: 'The Mythic — god-tier cosmic scale',
    desc: 'The character at mythic scale, rendered against a cosmic backdrop. Aurora and nebulae, sacred geometry diagrams floating in the air, glyphs etched into light, cosmological diagrams overlaid, divine particulate, god-rays from above. Alex Ross iconic gravitas + Tarot plate symbolism + Greek pediment composition + Dune-cinematic grandeur. Scale absolute: the figure is monumental, the universe responds to them.' },
  { slug: 'modern-reimagined',
    style: 'The Modern — speculative/cyber reimagining',
    desc: 'The character relocated to NOW or a near-future. Cyber-Prometheus trailing fiber-optic fire across a neon skyline. Urban-gothic Dracula on a rain-slick 2026 rooftop with skyline glow. Holmes with augmented-reality evidence overlay. Alice in a maximalist bioluminescent virtual tunnel. Contemporary materials, clothing touches, tech, urban textures — but the mythic weight of the original is kept. Blade Runner 2049 + A24 speculative fiction + modern editorial photography.' },
  { slug: 'dream-psychedelic',
    style: 'The Dream — psychedelic spiritual revelation',
    desc: 'Pure vision. Surreal, dreamlike, spiritually-charged — the character rendered as a mandala of meaning. Visible aura fields, sacred-geometry frames, kaleidoscopic fractal color, impossible physics, glyphs floating, mystical light rays. Alex Grey transcendental + Moebius liminal + Studio Ghibli spirits + Rumi visionary + Hilma af Klint occult diagrammatic. Reality softened into revelation.' },
  { slug: 'painterly-epic',
    style: 'The Painterly — maximalist oil-painting epic',
    desc: 'Masterwork oil painting at extreme density and scale. Frank Frazetta scale-and-drama + Alex Ross photoreal gravitas + Boris Vallejo fantasy grandeur + Drew Struzan theatrical composition. Museum-grade painterly finish, heroic posing, jewel-tone palette, every inch textured, impasto brushwork, cinematic hero-shot composition. Magic: The Gathering mythic-rare elevated past its ceiling.' },
  { slug: 'ornate-ritual',
    style: 'The Ornate — sacred density ritual',
    desc: 'Ornamental maximum. Iconographic overload: sacred geometry integrated into the composition, gold-leaf filigree, illuminated-manuscript density, tarot frame + Byzantine icon + Mucha botanical border + stained-glass rosette + Klimt gold pattern. The frame IS part of the art. Symbolic objects orbit the figure. Every edge of the canvas is alive with meaning.' },
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

// v6 uses MODES (new slugs); old style-level blocks no longer apply.
// Will re-populate as we learn which char×mode combos trip moderation.
const KNOWN_BLOCKED = new Set([]);

// How many variants per (character, mode) cell. 3 means 3 renders per cell
// (different compositional interpretations). Each variant is a distinct image.
const VARIANTS_PER_CELL = parseInt(args.variants ?? '3', 10);

// Variant composition-tweaks — each variant biases the image toward a
// different compositional archetype so the user can compare.
const VARIANT_DIRECTIVES = [
  'Composition: intimate close-up hero portrait — face and iconography dominant, environment softly out of focus behind.',
  'Composition: wide cinematic establishing shot — the figure embedded in an expansive, richly-detailed environment with deep atmospheric layers.',
  'Composition: iconic symmetric hero — the character centered and monumental, with symbolic objects arrayed around them, pure mythic presence.',
  'Composition: dynamic three-quarter action beat — the figure mid-gesture, diagonal energy, rich environmental storytelling.',
];

// v6: pick (character, mode, variant) triples. Default coverage: every
// character × every mode × VARIANTS_PER_CELL variants. Cheapest path is to
// iterate CHARACTERS × STYLES × VARIANTS up to the count cap.
function pickTriples(count) {
  const shuffledChars = seededShuffle(CHARACTERS, 7);
  const all = [];
  // Pass 1: one of every (char, mode, variant=1) — guarantees breadth
  for (const c of shuffledChars) {
    for (const s of STYLES) {
      if (!KNOWN_BLOCKED.has(`${c.slug}::${s.slug}`)) {
        all.push([c, s, 1]);
      }
    }
  }
  // Pass 2: remaining variants 2..N
  for (let v = 2; v <= VARIANTS_PER_CELL; v++) {
    for (const c of shuffledChars) {
      for (const s of STYLES) {
        if (!KNOWN_BLOCKED.has(`${c.slug}::${s.slug}`)) {
          all.push([c, s, v]);
        }
      }
    }
  }
  return all.slice(0, count);
}

// v6 prompt — MODE-driven. The character is the subject; the mode is the lens.
// Not historically-accurate illustration — think "time-traveler with modern camera"
// or "mythic-cosmic reimagining." Variants differ by compositional archetype.
function buildPrompt(c, s, variant = 1) {
  const variantDirective = VARIANT_DIRECTIVES[(variant - 1) % VARIANT_DIRECTIVES.length];
  return [
    `Premium collectible trading-card artwork — maximalist, epic, cinematic, and unforgettable.`,
    `MODE (the lens): ${s.desc}`,
    `SUBJECT: ${c.character} — ${c.moment}.`,
    `SETTING: ${c.scene}`,
    `HERO DETAIL: ${c.iconography}`,
    variantDirective,
    `Dramatic multi-source lighting with strong rim light and volumetric atmosphere. Rich jewel-tone color, extreme detail density, particulate atmosphere (dust, embers, light rays, haze). Every edge of the frame alive. Background cleanly resolved — not muddy — so the setting reads as an immersive world, not backdrop.`,
    `Mood: awe, wonder, mythic gravitas, revelation. Wilder than tasteful — push toward the extraordinary.`,
    `Portrait orientation, 2:3 trading-card aspect.`,
    `No text, letters, watermark, logo, signature, frame, or border.`,
    `Public-domain character from ${c.origin}.`,
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

async function generate(c, s, variant = 1) {
  const prompt = buildPrompt(c, s, variant);
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
    if (res.ok) { const j = await res.json(); return await processImage(c, s, prompt, j, variant); }
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

async function processImage(c, s, prompt, j, variant = 1) {
  const b64 = j.data?.[0]?.b64_json;
  if (!b64) throw new Error(`no b64_json in response: ${JSON.stringify(j).slice(0, 200)}`);
  const png = Buffer.from(b64, 'base64');
  const webp = await sharp(png).webp({ quality: 85 }).toBuffer();
  const dir = path.join(OUT_DIR, c.slug);
  await fs.mkdir(dir, { recursive: true });
  const fname = `${s.slug}-${variant}.webp`;
  await fs.writeFile(path.join(dir, fname), webp);
  return {
    id: `${c.slug}-${s.slug}-${variant}`,
    character: c.character,
    characterSlug: c.slug,
    set: c.set,
    moment: c.moment,
    style: s.style,
    styleSlug: s.slug,
    variant,
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
  // If --force: regenerate even if the ID exists.
  // Otherwise: skip (character, style, variant) triples already at current PROMPT_VERSION.
  const upToDateIds = new Set(
    existing.items
      .filter((i) => (i.promptVersion ?? 1) >= PROMPT_VERSION)
      .map((i) => i.id),
  );
  const triples = pickTriples(COUNT);
  const todo = FORCE
    ? triples
    : triples.filter(([c, s, v]) => !upToDateIds.has(`${c.slug}-${s.slug}-${v}`));
  console.log(
    `target ${triples.length} triples (${VARIANTS_PER_CELL} variants/cell), up-to-date at v${PROMPT_VERSION}: ${triples.length - todo.length}, generating ${todo.length} ` +
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
      const [c, s, v] = todo[my];
      try {
        const item = await generate(c, s, v);
        items.push(item);
        process.stdout.write(`✓ [${my + 1}/${todo.length}] ${c.character} × ${s.style} v${v} (${(item.bytes / 1024).toFixed(0)}KB)\n`);
      } catch (e) {
        errors.push({ char: c.slug, style: s.slug, variant: v, error: String(e) });
        process.stdout.write(`✗ [${my + 1}/${todo.length}] ${c.character} × ${s.style} v${v}: ${String(e).slice(0, 200)}\n`);
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
