#!/usr/bin/env node
// Track A — Cycle 22: 4 bs1-l01 Legendary parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// Priority per §8: Ultimate complete → Legendary next. bs1-l01 "The Violin at Midnight".
// Pre-commission gate: ALL 8 checks PASS (see inline comments).
// Saves to public/prototype-art/bs-1-221b/bs1-l01-{parallel}/v1.webp
// Appends new entries to public/prototype-art/manifest.json.
// Appends to /opt/rebirth-daemon/spend-ledger.jsonl.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KEY = process.env.REPLICATE_API_TOKEN;
if (!KEY) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }

const REPO = path.resolve(process.cwd());
const ART_BASE = path.join(REPO, 'public/prototype-art/bs-1-221b');
const MANIFEST_PATH = path.join(REPO, 'public/prototype-art/manifest.json');
const LEDGER = '/opt/rebirth-daemon/spend-ledger.jsonl';
const COST_PER_RENDER = 0.04;
const CYCLE = 22;

// bs1-l01 base prompt — Legendary tier, RICH density, BASE parallel.
// The Alvinized gold nimbus around Holmes is the single non-naturalistic base-art element.
// It is NOT a mandala; it is Alvinized light permitted on Legendary base art.
// ARCANA parallel will explicitly transform this into a sacred-geometry mandala.
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Drew Struzan theatrical grandeur + Alex Ross photo-real-mythic posture as ceiling. This is a Legendary card — elevated density, singular iconic gravity.

SUBJECT: Sherlock Holmes at 2am in the 221B sitting room, violin under chin, playing. Not badly — this is the private music, the music no one else hears. Tall, gaunt, hawkish profile. The bow drawn across in a long note, his eyes closed, the angular jaw at rest. The fingers on the strings are precise where the rest of him is loose — the one technical part of the performance grounding the emotional one.

SCENE: The sitting room at 2am. The gas lamps are low. The fire is down to embers — a dull red pool at the hearth. No Watson: the armchair is empty, a blanket on it, the outline of where Watson slept and was not woken. Holmes stands near the window; through the fog-heavy glass, the gas lamps on Baker Street are orange haloes. The violin sound (implied) is the one thing in the city still moving.

ICONOGRAPHY: The violin — the second Spine instrument alongside the pipe, the part of Holmes that processes what the intellect cannot yet name. The empty armchair with the blanket — Watson asleep elsewhere, present in his absence. The orange fog-halo gas lamps through the window — the city held at bay.

NARRATIVE BEAT: The moment-during — Holmes processing the day's case through music. Not performance; not practice; not boredom. Something between memory and deduction, which has no name in the vocabulary of investigation.

COMPOSITION: Drew Struzan orbital — Holmes centered, near full-height, violin mid-frame. The empty armchair in the lower-right third. The fog-window at upper-left, the gas lamps creating an accidental halo geometry behind Holmes's head.

STYLE: Drew Struzan orbital composition at full Legendary density. Alex Ross photo-real posture for Holmes himself. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`;

// Pre-commission gate §5 — all 8 checks for each variant:
// 1. Card identity: bs1-l01, bs-1-221b, Legendary, each parallel ✅
// 2. Tier-parallel: Legendary = Rare+ ✅
// 3. Density: RICH (Legendary tier) ✅
// 4. Parallel signature: each block has all 4 required elements ✅
// 5. Lampblack: Silhouette (tall gaunt hawkish), Props (violin + empty armchair),
//    Gesture (playing at 2AM, processing through music), Spine (violin as deduction instrument) ✅
// 6. Universe DNA: Baker Street gaslight/fog/221B/Paget/Sargent register ✅
// 7. Provider: replicate, flux-1.1-pro-ultra, PNG→WebP, 2:3 ✅
// 8. Manifest: creating new entries as complete ✅

const VARIANTS = [
  {
    id: 'bs1-l01-arcana',
    parallel: 'ARCANA',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich. Full environmental storytelling. Multiple Alvinized sources permitted. Three iconographic layers. Complexity from narrative density.

PARALLEL: ARCANA. This is the sacred-geometry variant at LEGENDARY scale.
ARCANA ELEMENTS — ALL REQUIRED:
1. Sacred-geometry mandala at Legendary scale: the mandala fills the upper half of the frame. The gas-lamp halo geometry that already exists in the base art — the orange fog-halo behind Holmes's head — explicitly becomes a sacred-geometry mandala. The transformation is complete: what was Alvinized light is now acknowledged sacred geometry. The mandala is gold and amber, universe-toned to Baker Street.
2. Alchemical sigils worked into the violin body: the f-holes of the violin are flanked by geometric glyph-patterns, glowing gold, as if the instrument was made for this room and this moment. Secondary sigils appear faintly in the 221B wallpaper pattern behind Holmes.
3. Golden occult filigree framing the composition — grown from the gas-lamp brackets, from the mantelpiece edge, from the window frame. The room's Victorian brass architecture has become alchemical architecture.
4. Universe-toned cosmic aurora: gaslight-gold aurora visible through the fog-window — the London fog outside has a warm gold cast from the aurora, as if the city night is answering the mandala above Holmes's head.
The Alvinized gold nimbus around Holmes is now inside the mandala geometry — Holmes plays at the center of the sacred circle. The empty armchair is in shadow below the mandala. The violin bow's motion traces the geometry.
LIGHT: The mandala is the primary light source — gold sacred geometry. The embers at hearth: secondary warm note. The aurora through the window: tertiary cool-warm gold. Holmes plays at the center of all three.`,
  },
  {
    id: 'bs1-l01-aether',
    parallel: 'AETHER',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich. Full environmental storytelling at cosmic scale.

PARALLEL: AETHER. This is the mythic-cosmic variant at LEGENDARY scale.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the 221B sitting room walls fall away. Where the wallpaper was, there is now a gold-amber cosmic nebula — Baker Street-toned, warm, old. The fog-window has opened to the cosmos. The embers have become star-points at the lower frame.
2. Divine particulate: gold luminous motes rise from the violin bow with each stroke — as if the music is producing light, releasing particles into the nebula behind Holmes. The motes trail upward and dissolve into the cosmic background.
3. God-rays of cosmic non-diegetic origin: light falls on Holmes from an impossible source in the cosmos above — not the gas lamp, not the embers — the cosmos itself illuminates the figure playing at the center of it.
4. Scale expansion: Holmes is a small figure against an infinite gold-amber cosmos. The violin is intimate; the cosmos is vast. The empty armchair is a ghost below, barely visible. The city of London is implied but unreachable — the music has carried Holmes past it.
The Spine survives: the hawkish profile, the precise fingers on the strings, the closed eyes. Holmes is recognizable at cosmic scale. The music he is playing is between memory and deduction — at cosmic scale, the question is: what is the cosmos deducing?
LIGHT: Cosmic — god-rays from the nebula above. The divine particulate adds secondary scattered light. Holmes plays inside the light he generates.`,
  },
  {
    id: 'bs1-l01-witness',
    parallel: 'WITNESS',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich in texture and composition, zero mythologizing.

PARALLEL: WITNESS. This is the photoreal documentary variant at LEGENDARY density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins cinematography register at maximum Legendary fidelity. Every material at photographic resolution.
2. Period-accurate material texture: the violin's wood grain (every crack and wear-mark from decades of playing), the horsehair bow (individual hairs visible in the lamp-light), Holmes's waistcoat and shirtsleeves (every thread, every worn edge at 2AM after a case), the 221B armchair's fabric (the depression where Watson sleeps), the window condensation from the fog outside (water-droplets on the cold glass), the embers at the hearth (each coal individually visible).
3. Cinema vérité composition: naturalistic blocking — Holmes as he would actually stand at 2AM in the sitting room, not a theatrical pose but the private, un-watched stance of a man playing for himself. The camera is present in the room. The shot is documentary.
4. NO Alvinized light: the gold nimbus around Holmes is ABSENT. Holmes is lit only by the low gas lamps, the dying embers, and the faint orange glow through the fog-window. The room is dark, as it would actually be at 2AM. The figure is partially silhouetted. The violin's wood catches the ember-light.
The emotional weight is carried entirely by the figure's posture and the darkness of the room. The empty armchair is real. The fog outside is real. The music is happening in a dark room, and no one is watching.
STYLE: Maximum photorealism. Deakins long-take intimacy. This actually happened, at 2AM, and a camera was there.`,
  },
  {
    id: 'bs1-l01-neon',
    parallel: 'NEON',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich at cyber-modern scale.

PARALLEL: NEON. This is the cyber-modern reimagining at LEGENDARY scale.
NEON ELEMENTS — ALL REQUIRED:
1. Character relocated to a near-future setting (2040s): the 221B sitting room is a high-floor apartment in a neon-lit London tower — glass wall at the back, the 2040s city spread below, neon and holographic signage visible through the floor-to-ceiling window.
2. Synthwave palette: hot pink, electric cyan, neon violet, electric green from the city below casting upward through the glass wall. Holmes stands in a room lit entirely by the city's neon — no gas lamps; the city is the light source.
3. Modern/cyber architecture: the neon tower apartment, the glass wall, holographic ambient displays at low brightness showing a city-map with an active case marker (off to the side, not Holmes's focus). A smart-surface armchair at lower right — it has Watson's mug on it, still warm.
4. Lampblack preservation:
   — Holmes: tall, gaunt, hawkish profile unchanged. He is playing a live-looper — a glass-and-carbon-fiber instrument that responds to the bow with a faint electric glow where the strings are bowed. The Spine instrument: still a string instrument; still played in the dark; still the thing that processes what the intellect cannot name.
   — The Gesture: eyes closed, bow drawn in a long stroke, the precise fingers unchanged. The music is still between memory and deduction. The instrument has changed; the act has not.
   — The empty chair: Watson's mug on the smart-surface armchair. Watson is elsewhere in the apartment, asleep. The witness is still absent but implied.
The city neon is the Alvinized light analogue — the impossible light falling on Holmes from the synthwave city below, pink and cyan and violet on the hawkish profile.
LIGHT: The city through the glass wall — neon hot-pink uplight, electric cyan from holographic signage, violet ambient. Holmes plays in a dark room lit by the city he is about to solve.`,
  },
];

async function genReplicate(prompt) {
  const submit = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'wait',
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: '2:3',
          output_format: 'png',
          safety_tolerance: 5,
          raw: false,
        },
      }),
    }
  );
  if (!submit.ok) {
    const text = await submit.text();
    throw new Error(`replicate ${submit.status}: ${text}`);
  }
  const j = await submit.json();
  if (j.status === 'starting' || j.status === 'processing') {
    const pollUrl = j.urls?.get;
    if (!pollUrl) throw new Error(`replicate: no poll url, status=${j.status}`);
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const poll = await fetch(pollUrl, { headers: { Authorization: `Bearer ${KEY}` } });
      const p = await poll.json();
      if (p.status === 'succeeded') {
        const url = Array.isArray(p.output) ? p.output[0] : p.output;
        const img = await fetch(url);
        return { buf: Buffer.from(await img.arrayBuffer()), seed: p.id };
      }
      if (p.status === 'failed' || p.status === 'canceled') {
        throw new Error(`replicate poll ${p.status}: ${JSON.stringify(p.error)}`);
      }
    }
    throw new Error('replicate poll timeout');
  }
  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error(`replicate: no output url in ${JSON.stringify(j).slice(0, 400)}`);
  const img = await fetch(url);
  return { buf: Buffer.from(await img.arrayBuffer()), seed: j.id };
}

async function renderVariant(variant) {
  const cardDir = path.join(ART_BASE, variant.id);
  await fs.mkdir(cardDir, { recursive: true });

  const fullPrompt = BASE_PROMPT + '\n' + variant.parallelBlock;

  console.log(`\n▶ rendering ${variant.id} (bs1-l01 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
  const t0 = Date.now();
  const { buf, seed } = await genReplicate(fullPrompt);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  let webp = await sharp(buf).webp({ quality: 85 }).toBuffer();
  const kb = (webp.length / 1024).toFixed(0);

  if (webp.length > 500 * 1024) {
    webp = await sharp(buf).webp({ quality: 70 }).toBuffer();
    console.log(`  ⚠ ${kb}KB > 500KB, re-encoding at q70: ${(webp.length / 1024).toFixed(0)}KB`);
  }

  await fs.writeFile(path.join(cardDir, 'v1.webp'), webp);
  console.log(`  ✓ ${variant.id} — ${(webp.length / 1024).toFixed(0)}KB — ${elapsed}s`);

  const entry = {
    id: `${variant.id}-v1`,
    setId: 'bs-1-221b',
    character: 'Sherlock Holmes',
    name: 'The Violin at Midnight',
    tier: 'Legendary',
    shell: 'PRIME',
    parallel: variant.parallel,
    elemental: 'REASON',
    prompt: fullPrompt,
    provider: 'replicate',
    model: 'black-forest-labs/flux-1.1-pro-ultra',
    aspect: '2:3',
    seed: seed || null,
    costUsd: COST_PER_RENDER,
    generatedAt: new Date().toISOString(),
    path: `public/prototype-art/bs-1-221b/${variant.id}/v1.webp`,
    sizeKb: Math.round(webp.length / 1024),
  };

  await fs.appendFile(
    LEDGER,
    JSON.stringify({
      ts: entry.generatedAt, provider: 'replicate',
      model: 'black-forest-labs/flux-1.1-pro-ultra',
      cardId: variant.id, costUsd: COST_PER_RENDER, cycleN: CYCLE,
    }) + '\n'
  );

  return entry;
}

async function main() {
  const newEntries = [];
  const errors = [];

  for (const variant of VARIANTS) {
    try {
      const entry = await renderVariant(variant);
      newEntries.push(entry);
    } catch (err) {
      console.error(`  ✗ ${variant.id}: ${err.message}`);
      errors.push({ id: variant.id, error: err.message });
    }
  }

  if (newEntries.length === 0) {
    console.error('\nNo renders succeeded. Aborting manifest update.');
    process.exit(1);
  }

  let manifest = [];
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(raw);
  } catch { manifest = []; }
  manifest.push(...newEntries);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  const totalCost = newEntries.length * COST_PER_RENDER;
  console.log(`\n✅ Track A Cycle 22 complete:`);
  console.log(`   ${newEntries.length} renders succeeded (bs1-l01 Legendary parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
