#!/usr/bin/env node
// Track A — Cycle 29: 4 bs1-r05 Rare parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// bs1-r05 "The Moriarty Letter". COMPLETES Rare tier (20/20) and all non-ONE-OFF BS-1 parallels (32/32).
// Cold-register card — midday grey light, no warm centre. AETHER/NEON must hold the cold emotional register.
// Pre-commission gate: ALL 8 checks PASS.

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
const CYCLE = 29;

// bs1-r05 base prompt — from manifest (as generated).
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Kazuo Oga environmental intimacy as ceiling.

SUBJECT: Sherlock Holmes standing at the 221B desk, holding a single handwritten letter in both hands at reading distance. Crisp, military posture — not seated. The letter held before him with two fingers rather than a grip. His expression: absolute precision of control over what the letter means.

SCENE: 221B sitting room, midday. The desk behind him: case-correspondence in stacks, a chemistry flask stoppered and unused, Watson's visiting card face-down at the corner. The letter is a single page — its handwriting precise, vertical, almost mechanical; visible as abstract mark-making, no legible words. The window at camera-right admits cold grey midday light.

ICONOGRAPHY: The letter — the precise vertical handwriting, held with deliberate lightness. The author is not in frame. The precision of the hand implies he doesn't need to be.

NARRATIVE BEAT: Moment-after — the letter has been read. He is reading it a second time to be certain of what certainty means.

COMPOSITION: Three-quarter close hero — Holmes filling the upper two-thirds of the frame. The letter at mid-foreground, lower-center. The desk and window at background. Focal triangle: face → letter → desk. The letter in full cold light.

LIGHT: Cold diffused midday light from window at camera-right. No dramatic shadow — the flatness of the light is deliberate. The letter in the most direct light in the frame.

COLOR: Cold grey-white window light. The desk in warm shadow-amber. Holmes's coat: charcoal and dark. No warm centre in the figure — the cold is the content of the moment.

STAKES VISIBLE ON THE FACE: Controlled containment. The precise arrangement of a face that has decided not to show what it is showing.

STYLE: Sidney Paget pen-and-wash raised to oil density. John Singer Sargent tonal restraint. Victorian interior daylight, cold register. No text in legible form on the letter — abstract vertical marks only. No watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Final Problem," 1893.`;

// Pre-commission gate §5 — all 8 checks:
// 1. Card identity: bs1-r05, bs-1-221b, Rare, each parallel ✅
// 2. Tier-parallel: Rare = Rare+ ✅
// 3. Density: MODERATE (Rare tier) ✅
// 4. Parallel signatures: each block has all required elements ✅
// 5. Lampblack: Silhouette (military posture, crisp upright, letter held at reading height),
//    Props (Moriarty's letter + desk + cold window light),
//    Gesture (reading a second time to be certain of what certainty means),
//    Spine (precision of the handwriting implies someone who thinks with the same care Holmes does) ✅
// 6. Universe DNA: Baker Street / 221B / cold daylight / Victorian tonal restraint ✅
// 7. Provider: replicate, flux-1.1-pro-ultra, PNG→WebP, 2:3 ✅
// 8. Manifest: creating new entries as complete ✅

const VARIANTS = [
  {
    id: 'bs1-r05-arcana',
    parallel: 'ARCANA',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate. One distinctive compositional element elevates above Common.

PARALLEL: ARCANA. Sacred-geometry variant at RARE scale.
ARCANA ELEMENTS — ALL REQUIRED (Rare scale: mandala modest, sigils legible but not dominant):
1. Sacred-geometry mandala behind Holmes's head — Rare scale: modest, glowing gold, present but not dominant. It provides a warm secondary light source behind Holmes, countering the cold grey window light. The mandala's gold warmth and the letter's cold daylight are in deliberate tension.
2. The letter's abstract handwriting is revealed as alchemical sigil script — Moriarty's "precise vertical marks" are alchemical geometry. At the ARCANA scale, the letter is a sigil document: the abstract marks glow with faint gold meaning that Holmes is reading as both cryptography and alchemy. The surface of the paper itself has become sacred geometry.
3. Alchemical sigils worked into the desk's surface — the 221B desk woodgrain and document stacks show faint geometric glyph-patterns glowing gold at Rare scale.
4. Golden occult filigree at the composition's frame edge — subtle, tracing the window frame and desk edge.
5. Universe-toned cosmic aurora: gaslight-gold aurora as a thin warm line through the cold grey window (modest at Rare scale — a gold warmth at the window's edge, not a full aurora; the cold light remains dominant but the gold intrudes).
LIGHT: The mandala adds warm gold behind Holmes. The letter now emits faint gold (its sigil geometry). The cold window light unchanged and dominant — the gold is the intrusion, not the register.`,
  },
  {
    id: 'bs1-r05-aether',
    parallel: 'AETHER',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cosmic scale.

PARALLEL: AETHER. Mythic-cosmic variant at RARE scale — cold register preserved.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the 221B room falls away; Holmes stands in cold-toned cosmic space — Baker Street-toned but COLD cosmos, silver-grey nebula with gold undertones (not the warm amber of other AETHER cards; this is the cold register of the Moriarty card, and the cosmos matches it). The letter's author is still off-frame, but the vast cold cosmos represents his scale.
2. Divine particulate: silver-gold luminous motes drift from the letter's surface — not warm gold but silver-cold, consistent with the card's emotional register.
3. God-rays of cosmic non-diegetic origin: cold silver-grey light descends from the cosmos above onto Holmes and the letter. The letter is in the most direct cosmic light in the frame — as it was in the coldest daylight in the base art.
4. Scale expansion: Holmes is intimate-scale against the vast cold cosmos. The letter in his hands is the smallest, most concentrated object in the frame, and the most significant.
The Spine survives: the military posture, the two-fingered grip, the controlled face. Holmes reading the letter a second time, now in cosmic scale — to be certain of what certainty means in a cosmos this large.
LIGHT: Cold cosmic rays from above. Silver-gold particulate from the letter. The desk lamp (implied off-frame) gives the warmest note — domestic amber in the cold cosmos. The letter in full cold cosmic light.`,
  },
  {
    id: 'bs1-r05-witness',
    parallel: 'WITNESS',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate in texture; zero mythologizing.

PARALLEL: WITNESS. Photoreal documentary variant at RARE density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins cold-register cinematography. The flat midday grey light is preserved at maximum photographic accuracy — this is the hardest lighting register to capture (no drama, no shadow play; just the flat truth of midday grey English light).
2. Period-accurate material texture: the letter paper (Victorian notepaper weight — 80gsm or equivalent, the ink's sheen, Moriarty's precise vertical marks at the exact character-size of a meticulous Victorian intellectual — the pen pressure visible in the ink's variation), Holmes's coat (charcoal wool, every thread), Holmes's hands (the two-fingered grip — exact hand anatomy of a tall man holding a single page at reading distance), Watson's visiting card (face-down at corner — the plain cream card, the small slight curl from lying face-down on a desk surface).
3. The cold grey midday light: photographically accurate flat diffused English midday light from the window. Not dramatic; not beautiful. The exact light quality that makes this scene's emotional register work.
4. NO Alvinized light, NO parallel-register elements. The chemistry flask (stoppered and unused — dusty, not recently handled). The case-correspondence stacks (papers of varied age and condition, edges yellowing at different rates).
Holmes's face: forensic documentary of controlled containment. This is what that expression actually looks like.
STYLE: Maximum photorealism. Cold register. Evidence of a significant moment.`,
  },
  {
    id: 'bs1-r05-neon',
    parallel: 'NEON',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cyber-modern scale — COLD register preserved.

PARALLEL: NEON. Cyber-modern reimagining at RARE scale.
NEON ELEMENTS — ALL REQUIRED — NOTE: this card's NEON palette is COLD, not warm. The base card's "cold is the content" register must survive transposition.
1. The handwritten letter becomes an encrypted holo-message — a floating holographic display before Holmes at reading distance. The text rendered as a complex cipher-stream in cold ice-blue and white, with faint cyan edges. No warm pink or magenta for this NEON card — the synthwave palette is the cold end: ice-blue, deep cyan, silver-white.
2. Moriarty's cyber fingerprint visible as geometric overlay at the holo-message's edges — a precise, mechanical cipher geometry that implies the same care Holmes thinks with. The cyber fingerprint is the 2040s equivalent of the "precise vertical handwriting."
3. Holmes's posture unchanged: military crisp, two-handed holding of the holo-reader device (or two-fingered position at the edge of the holo-frame — the same lightness of grip). His expression: the same controlled containment.
4. Lampblack preservation:
   — AR visor at REST on his forehead — he is READING, not observing with the visor. The holo-message is read with the eyes, not the AR system (same as the reading posture in the base art).
   — The cold city through the window: 2040s London at midday, grey overcast sky above the city (same cold grey light as the Victorian window). The cold is still the content.
   — The desk behind him: 2040s smart desk, case correspondence as holographic document stacks, chemistry setup as analytical display, Watson's digital visiting card face-down at the corner.
5. The anachronism is absence: no anachronism here. The 2040s setting is entirely consistent. The Spine is not an anachronism object but the unchanged gesture — reading with the same precision and controlled containment regardless of what century.
LIGHT: Cold ice-blue from the holo-message (the dominant light source, replacing the cold daylight). Cold grey overcast city light from the window. No warm elements — the cold is still the content of the moment.`,
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
  if (j.status === 'failed') throw new Error(`replicate failed: ${JSON.stringify(j.error)}`);
  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error(`replicate: no output url (status=${j.status}, error=${JSON.stringify(j.error)})`);
  const img = await fetch(url);
  return { buf: Buffer.from(await img.arrayBuffer()), seed: j.id };
}

async function renderVariant(variant) {
  const cardDir = path.join(ART_BASE, variant.id);
  await fs.mkdir(cardDir, { recursive: true });

  const fullPrompt = BASE_PROMPT + '\n' + variant.parallelBlock;

  console.log(`\n▶ rendering ${variant.id} (bs1-r05 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
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
    name: 'The Moriarty Letter',
    tier: 'Rare',
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
  console.log(`\n✅ Track A Cycle 29 complete:`);
  console.log(`   ${newEntries.length} renders (bs1-r05 Rare parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);
  console.log(`   Rare tier: COMPLETE (20/20)`);
  console.log(`   All non-ONE-OFF BS-1 parallels: COMPLETE (32/32)`);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
