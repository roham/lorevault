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
const PROMPT_VERSION = 5; // v5: density + ornate detail restored, safety-neutral language preserved

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

// Style descriptions are aimed at peak collectible-card art — premium mythic-rare TCG,
// holographic, cinematic. Each description forces density of detail, dramatic lighting,
// and a hero-shot composition.
const STYLES = [
  // Powerhouse painterly — the Frazetta/Struzan/Amano lineage
  { slug: 'frazetta-painterly', style: 'Frazetta painterly fantasy', desc: 'Frank Frazetta oil-on-board fantasy painting — heroic anatomy, volumetric amber-and-crimson lighting, dynamic diagonal composition, impasto brushwork, epic mood, museum fantasy masterwork' },
  { slug: 'struzan-poster', style: 'Drew Struzan theatrical', desc: 'Drew Struzan theatrical movie poster — cinematic hero-shot, airbrush-meets-pencil realism, golden rim light and deep negative space, supporting scene elements orbiting the subject, 1980s blockbuster grandeur' },
  { slug: 'alex-ross-realism', style: 'Alex Ross hyper-realist', desc: 'Alex Ross gouache hyper-realism — photoreal figure study, dramatic low-angle hero framing, sculptural lighting, saturated color against muted sky, iconic comic-cover gravitas' },
  { slug: 'amano-ethereal', style: 'Yoshitaka Amano ethereal', desc: 'Yoshitaka Amano ethereal watercolor — translucent washes, elongated figures, metallic gold leaf accents, negative space bloom, dreamlike fantasy royalty, Final Fantasy concept-art splendor' },
  { slug: 'mtg-mythic', style: 'Premium mythic card art', desc: 'Premium mythic-rare TCG art — lush painterly fantasy, dramatic action in a detailed environment, cinematic rim light, chromatic saturation, atmospheric effects, premium collectible-card composition' },
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
  // Canon-devotee line styles — for fans of the originary Victorian/Edwardian illustration tradition
  { slug: 'paget-linework', style: 'Sidney Paget ink illustration', desc: 'Sidney Paget 1891 Strand Magazine ink and wash — fine hatched line, gaslit fog, precise Victorian architectural and costume detail, two-figure silhouette compositions, the canonical visual register devoted Sherlockians expect' },
  { slug: 'tenniel-ink', style: 'John Tenniel wood-engraving', desc: 'John Tenniel 1865 wood-engraving — precise cross-hatched line, no paint, blue-pinafore canonical Alice, the White-Rabbit waistcoat-and-watch register, the definitive illustration tradition of the Carroll canon' },
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

// Combos that have moderation-blocked across v2/v3/v4 runs. Permanently skip
// to avoid wasting API calls. Hard-coded here so they don't pollute the pool.
const KNOWN_BLOCKED = new Set([
  'medusa::alex-ross-realism',
  'dracula::struzan-poster',
  'frankenstein-monster::amano-ethereal',
  'frankenstein-monster::baroque-oil',
  'evil-queen::frazetta-painterly',
  'evil-queen::sumi-e',
  'snow-white::risograph-duotone', // legacy, style removed
  'snow-white::pulp-scifi',
  'the-hound::frazetta-painterly',
]);

function pickPairs(count) {
  // First pass: at least one of every STYLE. Pair each style with a random character.
  const shuffledChars = seededShuffle(CHARACTERS, 7);
  const firstPass = STYLES.map((s, i) => [shuffledChars[i % shuffledChars.length], s])
    .filter(([c, s]) => !KNOWN_BLOCKED.has(`${c.slug}::${s.slug}`));
  // Second pass: fill the rest by seeded-shuffling all remaining (char, style) pairs.
  const used = new Set(firstPass.map(([c, s]) => `${c.slug}::${s.slug}`));
  const all = [];
  for (const c of CHARACTERS) for (const s of STYLES) {
    const key = `${c.slug}::${s.slug}`;
    if (!used.has(key) && !KNOWN_BLOCKED.has(key)) all.push([c, s]);
  }
  const fill = seededShuffle(all, 42).slice(0, Math.max(0, count - firstPass.length));
  return [...firstPass, ...fill].slice(0, count);
}

// v5 prompt — leads with explicit craft/density/ornament vocabulary. Safe language
// (no violence words) but prose is longer and every clause insists on painterly
// richness: oil painting finish, extreme detail density at every edge, multi-source
// lighting, ornate surface work, jewel-tone saturation.
function buildPrompt(c, s) {
  return [
    `Masterwork oil painting for a premium collectible trading card — museum-grade painterly finish with extreme detail density at every edge of the composition, in the tradition of Magic: The Gathering mythic-rare elevated toward the cinematic grandeur of Drew Struzan theatrical posters and the painterly depth of Frank Frazetta and Alex Ross.`,
    `${c.character}, ${c.moment}.`,
    `Setting, richly layered across four depth planes: ${c.scene}. Foreground objects rendered in razor-sharp detail with visible brushwork; midground staged with atmospheric depth; background dissolving into painterly haze and luminous distance; ornamental filigree or environmental motifs echoing at every edge of the frame.`,
    `Hero anchor: ${c.iconography} — painted with jewel-like precision and treated as the compositional symbol.`,
    `Composition: ${c.composition}. Strong cinematic framing with purposeful negative space; the figure feels monumental yet embedded in a textured world.`,
    `Lighting: multi-source chiaroscuro — a dominant directional key light carving the figure, a cool fill from a secondary source (moonlight, lantern, firelight, stained-glass window), and a rim light defining silhouette against the background. Volumetric atmosphere with visible particulates — dust, mist, falling embers, candle smoke.`,
    `Color: jewel-tone saturation with deep velvet shadows and a limited but luxurious palette; luminous focal highlights catching gilt, glass, flame, or water.`,
    `Surface: impasto oil-paint texture with gilt-illumination detail, museum-quality rendering, film-still cinematic quality, rich painterly brushwork throughout — every fabric fold, every texture, every surface articulated.`,
    `Mood: contemplative, dignified, mythic — stillness carries the drama, not action.`,
    `Style register: ${s.desc}.`,
    `Portrait orientation, 2:3 trading-card aspect ratio composition.`,
    `No text, no letters, no words, no watermark, no card frame, no border.`,
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
