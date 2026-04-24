#!/usr/bin/env node
/**
 * Art-Seed generator — cycle 1
 * Generates 50 moodboard images across 6 sets × diverse styles.
 * Converts PNG→WebP, appends to manifest + spend ledger.
 */
import OpenAI from 'openai';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MANIFEST_PATH = path.join(REPO, 'public/moodboard-art/manifest.json');
const LEDGER_PATH = path.join(REPO, '.taste-daemon/spend-ledger.jsonl');
const DAILY_CAP = parseFloat(process.env.TASTE_DAEMON_DAILY_CAP_USD || '25');
const CYCLE = 1;

const STYLE_DESCRIPTIONS = {
  'victorian-engraving':    'Victorian steel engraving, crosshatch, sepia ink, Gustave Doré lineage',
  'noir-poster-30s':        '1930s noir movie poster, silver-halide grain, hard shadows',
  'baroque-oil':            'Baroque oil painting, Caravaggio chiaroscuro, rich shadow',
  'art-nouveau':            'Art Nouveau ornamental, Alphonse Mucha lineage, flowing lines',
  'tarot-baroque':          'Tarot card illustration, Pamela Colman Smith color plates, gold foil accents',
  'sumi-e':                 'Japanese ink wash, sumi-e, single bold subject on white',
  'chiaroscuro-woodcut':    'High-contrast woodcut, Albrecht Dürer lineage, stark black and white',
  'cel-anime-modern':       'Modern cel-shaded anime, flat color, crisp hard edges',
  'pixel-16bit':            '16-bit pixel art, limited 32-color palette, dithering',
  'stained-glass':          'Stained glass panel, leaded lines, jewel tones, medieval',
  'botanical-illustration': 'Victorian botanical plate, precise watercolor wash',
  'german-expressionist':   'German expressionist woodblock, jagged shapes, high contrast, stark',
  'moebius-comic':          '1970s French comic, Jean Giraud Moebius style, clean geometric line',
  'deco-travel-poster':     'Art Deco travel poster, bold geometry, flat color, streamlined',
  'silent-film-still':      'Silent-film still, soft grain, high-key theatrical lighting, 1920s',
  'golden-age-illustration':'Arthur Rackham / Edmund Dulac golden-age illustration, watercolor and ink',
  'pulp-scifi':             '1950s pulp sci-fi magazine cover, gouache, saturated primaries',
  'risograph-duotone':      'Risograph 2-color print, imperfect ink registration, paper texture',
  'scrimshaw':              'Scrimshaw whalebone etching, ivory ground, nautical linework',
};

const PUBLIC_DOMAIN_ORIGINS = {
  'baker-street':       'Sir Arthur Conan Doyle 1887–1927',
  'enchanted-kingdom':  'Grimm Brothers 1812 / Perrault 1697 folklore',
  'wonderland':         'Lewis Carroll 1865 / John Tenniel illustrations',
  'gothic-horror':      'Stoker 1897 / Shelley 1818 / Stevenson 1886 / Gaston Leroux 1909',
  'olympus':            'Homer 8th c. BCE / Ovid Metamorphoses 8 CE',
  'asgard':             'Prose Edda Snorri Sturluson c.1220 / Völuspá 10th c.',
};

const SEED_TARGETS = [
  // baker-street (7)
  { character:'Sherlock Holmes',      characterSlug:'sherlock-holmes',       set:'baker-street', moment:'At 221B Baker Street',         styleSlug:'victorian-engraving' },
  { character:'Sherlock Holmes',      characterSlug:'sherlock-holmes',       set:'baker-street', moment:'The Pipe and the Problem',      styleSlug:'noir-poster-30s' },
  { character:'Professor Moriarty',   characterSlug:'professor-moriarty',    set:'baker-street', moment:'The Napoleon of Crime',         styleSlug:'baroque-oil' },
  { character:'Irene Adler',          characterSlug:'irene-adler',           set:'baker-street', moment:'The Woman',                    styleSlug:'art-nouveau' },
  { character:'Dr. Watson',           characterSlug:'dr-watson',             set:'baker-street', moment:'The Faithful Companion',       styleSlug:'noir-poster-30s' },
  { character:'The Hound',            characterSlug:'the-hound',             set:'baker-street', moment:'On the Moor',                  styleSlug:'chiaroscuro-woodcut' },
  { character:'Sherlock Holmes',      characterSlug:'sherlock-holmes',       set:'baker-street', moment:'The Reichenbach Falls',        styleSlug:'tarot-baroque' },

  // enchanted-kingdom (7)
  { character:'Snow White',           characterSlug:'snow-white',            set:'enchanted-kingdom', moment:'The Poisoned Apple',           styleSlug:'botanical-illustration' },
  { character:'The Evil Queen',       characterSlug:'the-evil-queen',        set:'enchanted-kingdom', moment:'Before the Magic Mirror',      styleSlug:'deco-travel-poster' },
  { character:'Rumpelstiltskin',      characterSlug:'rumpelstiltskin',       set:'enchanted-kingdom', moment:'Spinning Gold',                styleSlug:'sumi-e' },
  { character:'Red Riding Hood',      characterSlug:'red-riding-hood',       set:'enchanted-kingdom', moment:'The Dark Forest Path',         styleSlug:'stained-glass' },
  { character:'The Beast',            characterSlug:'the-beast',             set:'enchanted-kingdom', moment:'In the Cursed Castle',         styleSlug:'baroque-oil' },
  { character:'Cinderella',           characterSlug:'cinderella',            set:'enchanted-kingdom', moment:'The Glass Slipper',            styleSlug:'art-nouveau' },
  { character:'Sleeping Beauty',      characterSlug:'sleeping-beauty',       set:'enchanted-kingdom', moment:"The Spindle's Prick",          styleSlug:'botanical-illustration' },

  // wonderland (7)
  { character:'Alice',                characterSlug:'alice',                 set:'wonderland', moment:'Falling Down the Rabbit Hole',  styleSlug:'golden-age-illustration' },
  { character:'The Cheshire Cat',     characterSlug:'the-cheshire-cat',      set:'wonderland', moment:'Fading to a Grin',              styleSlug:'cel-anime-modern' },
  { character:'The Mad Hatter',       characterSlug:'the-mad-hatter',        set:'wonderland', moment:'The Eternal Tea Party',         styleSlug:'tarot-baroque' },
  { character:'The Queen of Hearts',  characterSlug:'the-queen-of-hearts',   set:'wonderland', moment:'Off With Their Heads!',         styleSlug:'stained-glass' },
  { character:'Alice',                characterSlug:'alice',                 set:'wonderland', moment:'Drink Me',                      styleSlug:'risograph-duotone' },
  { character:'The White Rabbit',     characterSlug:'the-white-rabbit',      set:'wonderland', moment:'Late for an Important Date',    styleSlug:'scrimshaw' },
  { character:'Alice',                characterSlug:'alice',                 set:'wonderland', moment:'Waking Up',                    styleSlug:'tarot-baroque' },

  // gothic-horror (12)
  { character:'Count Dracula',        characterSlug:'count-dracula',         set:'gothic-horror', moment:'The Castle at Night',          styleSlug:'chiaroscuro-woodcut' },
  { character:"Frankenstein's Monster", characterSlug:'frankensteins-monster', set:'gothic-horror', moment:'Birth in the Laboratory',    styleSlug:'german-expressionist' },
  { character:'The Phantom',          characterSlug:'the-phantom',           set:'gothic-horror', moment:'Behind the Mask',              styleSlug:'silent-film-still' },
  { character:'Dorian Gray',          characterSlug:'dorian-gray',           set:'gothic-horror', moment:'The Portrait Ages',            styleSlug:'tarot-baroque' },
  { character:'Dr. Jekyll',           characterSlug:'dr-jekyll',             set:'gothic-horror', moment:'The Transformation',           styleSlug:'pixel-16bit' },
  { character:'Mr. Hyde',             characterSlug:'mr-hyde',               set:'gothic-horror', moment:'The Night Prowl',              styleSlug:'noir-poster-30s' },
  { character:'Van Helsing',          characterSlug:'van-helsing',           set:'gothic-horror', moment:'The Vampire Hunter',           styleSlug:'pulp-scifi' },
  { character:'Mina Harker',          characterSlug:'mina-harker',           set:'gothic-horror', moment:'The Bite Marks',               styleSlug:'art-nouveau' },
  { character:'Count Dracula',        characterSlug:'count-dracula',         set:'gothic-horror', moment:'The Three Brides',             styleSlug:'baroque-oil' },
  { character:"Frankenstein's Monster", characterSlug:'frankensteins-monster', set:'gothic-horror', moment:'The Creature Reads',        styleSlug:'silent-film-still' },
  { character:'Quasimodo',            characterSlug:'quasimodo',             set:'gothic-horror', moment:'The Bell Tower',               styleSlug:'german-expressionist' },
  { character:'Lucy Westenra',        characterSlug:'lucy-westenra',         set:'gothic-horror', moment:'The Sleepwalker',              styleSlug:'art-nouveau' },

  // olympus (10)
  { character:'Zeus',                 characterSlug:'zeus',                  set:'olympus', moment:'Wielding the Thunderbolt',      styleSlug:'baroque-oil' },
  { character:'Athena',               characterSlug:'athena',                set:'olympus', moment:'In Battle Armor',               styleSlug:'victorian-engraving' },
  { character:'Medusa',               characterSlug:'medusa',                set:'olympus', moment:'The Petrifying Gaze',           styleSlug:'art-nouveau' },
  { character:'Prometheus',           characterSlug:'prometheus',            set:'olympus', moment:'Stealing Fire',                 styleSlug:'chiaroscuro-woodcut' },
  { character:'Odysseus',             characterSlug:'odysseus',              set:'olympus', moment:'Resisting the Sirens',          styleSlug:'baroque-oil' },
  { character:'Achilles',             characterSlug:'achilles',              set:'olympus', moment:'At the Gates of Troy',          styleSlug:'deco-travel-poster' },
  { character:'Medusa',               characterSlug:'medusa',                set:'olympus', moment:'The Petrifying Gaze',           styleSlug:'tarot-baroque' },
  { character:'Perseus',              characterSlug:'perseus',               set:'olympus', moment:'With the Head of Medusa',       styleSlug:'pulp-scifi' },
  { character:'Orpheus',              characterSlug:'orpheus',               set:'olympus', moment:'In the Underworld',             styleSlug:'stained-glass' },
  { character:'Prometheus',           characterSlug:'prometheus',            set:'olympus', moment:'Stealing Fire',                 styleSlug:'risograph-duotone' },

  // asgard (7)
  { character:'Odin',                 characterSlug:'odin',                  set:'asgard', moment:'Hanging on Yggdrasil',          styleSlug:'german-expressionist' },
  { character:'Thor',                 characterSlug:'thor',                  set:'asgard', moment:'Battle with the Midgard Serpent', styleSlug:'moebius-comic' },
  { character:'Loki',                 characterSlug:'loki',                  set:'asgard', moment:'Bound Beneath the Mountain',    styleSlug:'noir-poster-30s' },
  { character:'Freya',                characterSlug:'freya',                 set:'asgard', moment:'Weeping Tears of Gold',         styleSlug:'golden-age-illustration' },
  { character:'Heimdall',             characterSlug:'heimdall',              set:'asgard', moment:'Sounding the Gjallarhorn',      styleSlug:'sumi-e' },
  { character:'Fenrir',               characterSlug:'fenrir',                set:'asgard', moment:'The Breaking of Gleipnir',      styleSlug:'german-expressionist' },
  { character:'Hel',                  characterSlug:'hel',                   set:'asgard', moment:'Ruling Niflheim',               styleSlug:'chiaroscuro-woodcut' },
];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildPrompt(target) {
  const origin = PUBLIC_DOMAIN_ORIGINS[target.set];
  const styleDesc = STYLE_DESCRIPTIONS[target.styleSlug];
  return (
    `Editorial portrait illustration of ${target.character} — ${target.moment}. ` +
    `Style: ${styleDesc}. ` +
    `Composition: single figure, portrait crop, rich tonal depth, no text or letters, ` +
    `no watermark, no frame. Public-domain source (${origin}). ` +
    `Collectible card aesthetic.`
  );
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return { version: 1, generatedAt: null, model: null, totalImages: 0, totalCostUsd: 0, items: [] };
  }
}

function saveManifest(m) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(m, null, 2));
}

function appendLedger(entry) {
  fs.appendFileSync(LEDGER_PATH, JSON.stringify(entry) + '\n');
}

function todaySpend() {
  if (!fs.existsSync(LEDGER_PATH)) return 0;
  const today = new Date().toISOString().slice(0, 10);
  return fs.readFileSync(LEDGER_PATH, 'utf8')
    .split('\n').filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(e => e && e.ok && e.at && e.at.startsWith(today))
    .reduce((s, e) => s + (e.costUsd || 0), 0);
}

async function generateOne(target, variant, existingIds) {
  const id = `${slugify(target.character)}-${target.styleSlug}-${variant}`;
  if (existingIds.has(id)) {
    console.log(`  SKIP ${id} — already in manifest`);
    return null;
  }

  const prompt = buildPrompt(target);
  const outDir = path.join(REPO, 'public/moodboard-art', target.characterSlug);
  fs.mkdirSync(outDir, { recursive: true });
  const webpPath = path.join(outDir, `${target.styleSlug}-${variant}.webp`);
  const relativePath = `/moodboard-art/${target.characterSlug}/${target.styleSlug}-${variant}.webp`;

  const at = new Date().toISOString();
  let model = 'gpt-image-1';
  let costUsd = 0.17;
  let ok = false;

  try {
    let imgBuffer;

    // Try gpt-image-1 first (returns b64_json by default)
    try {
      const resp = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        n: 1,
        size: '1024x1536',
        quality: 'high',
      });
      const b64 = resp.data[0].b64_json;
      imgBuffer = Buffer.from(b64, 'base64');
    } catch (e1) {
      if (e1.status === 404 || (e1.message && e1.message.includes('model'))) {
        // Fall back to dall-e-3
        model = 'dall-e-3';
        costUsd = 0.08;
        const resp = await openai.images.generate({
          model: 'dall-e-3',
          prompt: prompt.slice(0, 4000),
          n: 1,
          size: '1024x1792',
          quality: 'hd',
          response_format: 'b64_json',
        });
        const b64 = resp.data[0].b64_json;
        imgBuffer = Buffer.from(b64, 'base64');
      } else {
        throw e1;
      }
    }

    // Convert to WebP ≤200KB
    await sharp(imgBuffer)
      .webp({ quality: 85 })
      .toFile(webpPath);

    // Check size, reduce quality if over 200KB
    const stat = fs.statSync(webpPath);
    if (stat.size > 200 * 1024) {
      await sharp(imgBuffer).webp({ quality: 70 }).toFile(webpPath);
    }

    ok = true;
    console.log(`  OK  ${id}  model=${model}  cost=$${costUsd}  size=${Math.round(fs.statSync(webpPath).size/1024)}KB`);

    const entry = {
      id, character: target.character, characterSlug: target.characterSlug,
      set: target.set, moment: target.moment,
      style: STYLE_DESCRIPTIONS[target.styleSlug].split(',')[0],
      styleSlug: target.styleSlug, variant,
      path: relativePath, prompt, model, costUsd, generatedAt: at,
    };
    appendLedger({ at, model, itemId: id, costUsd, ok: true, cycle: CYCLE });
    return entry;
  } catch (err) {
    console.error(`  FAIL ${id}:`, err.message || err);
    appendLedger({ at, model, itemId: id, costUsd: 0, ok: false, cycle: CYCLE, error: String(err.message || err) });
    return null;
  }
}

async function main() {
  const manifest = loadManifest();
  const existingIds = new Set(manifest.items.map(i => i.id));
  let spend = todaySpend();
  console.log(`Art-Seed cycle ${CYCLE} — today spend so far $${spend.toFixed(2)} / cap $${DAILY_CAP}`);
  console.log(`Manifest: ${manifest.items.length} items. Target: 50.`);

  // Count variants per character×style to assign variant numbers
  const variantCounters = {};
  for (const item of manifest.items) {
    const key = `${item.characterSlug}-${item.styleSlug}`;
    variantCounters[key] = Math.max(variantCounters[key] || 0, item.variant || 1);
  }

  let generated = 0;
  let totalCost = 0;

  for (const target of SEED_TARGETS) {
    if (manifest.items.length + generated >= 50) {
      console.log('Reached 50 items, stopping.');
      break;
    }
    if (spend + totalCost >= DAILY_CAP) {
      console.log(`Daily cap $${DAILY_CAP} reached. Stopping.`);
      break;
    }
    if (spend + totalCost >= 5.0) {
      console.log('Per-cycle $5 cap reached. Stopping.');
      break;
    }

    const key = `${target.characterSlug}-${target.styleSlug}`;
    const variant = (variantCounters[key] || 0) + 1;
    variantCounters[key] = variant;

    const entry = await generateOne(target, variant, existingIds);
    if (entry) {
      manifest.items.push(entry);
      manifest.totalImages = manifest.items.length;
      manifest.totalCostUsd = (manifest.totalCostUsd || 0) + entry.costUsd;
      manifest.generatedAt = new Date().toISOString();
      manifest.model = entry.model;
      saveManifest(manifest);
      existingIds.add(entry.id);
      totalCost += entry.costUsd;
      generated++;
    }
  }

  console.log(`\nDone. Generated ${generated} images. Cycle cost: $${totalCost.toFixed(2)}`);
  console.log(`Manifest now has ${manifest.items.length} items.`);

  // Write summary for cycle log
  fs.writeFileSync(
    path.join(REPO, '.taste-daemon/last-art-seed-result.json'),
    JSON.stringify({ generated, totalCost, manifestItems: manifest.items.length, at: new Date().toISOString() }, null, 2)
  );
}

main().catch(e => { console.error(e); process.exit(1); });
