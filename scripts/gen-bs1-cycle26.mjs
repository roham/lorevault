#!/usr/bin/env node
// Track A — Cycle 26: 4 bs1-r02 Rare parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// bs1-r02 "The Street Deduction". Rare tier (5/20 after this cycle).
// No firearms in base prompt — NEON uses combined Victorian base + NEON block (no filter risk).
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
const CYCLE = 26;

// bs1-r02 base prompt — from manifest (as generated).
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Alex Ross photo-real-mythic + Struzan theatrical composition as ceiling.

SUBJECT: Sherlock Holmes at the first-floor window of 221B, observing Baker Street below. He stands three-quarters profile, back slightly to us, pipe held loosely at his side (not drawn). One hand on the window frame. His gaze is down and slightly left, focused on a point in the street below that we cannot see. The angular gaunt silhouette is unmistakable against the grey London daylight through the glass.

SCENE: The 221B sitting room from inside, the window as the frame's dominant element. Through the fog-hazed glass, Baker Street visible below in grey morning light: a hansom cab, a figure in a brown coat (the subject of the deduction), the cobblestones wet. Holmes stands at the window, elevated, observing. The room behind him: the chemical bench visible at frame-left, the mantelpiece at frame-right.

ICONOGRAPHY: The window — the lens Holmes uses to practice. The fog on the glass — partly obscuring the street. His pipe held at his side instead of being smoked — the deduction running, not the boredom.

NARRATIVE BEAT: Held breath — Holmes mid-deduction, before speaking. The figure on the street below not yet aware they are being read like a case file.

COMPOSITION: Holmes large in the left foreground, angled toward the window. The window occupies the right two-thirds of frame. Baker Street through the glass recedes into misty depth. The figure-in-brown-coat visible small in the street at lower-right third.

LIGHT: Flat grey London daylight through the fog-glass. A warm lamp behind Holmes from the room — giving him a faint warm edge-light against the grey window.

STYLE: Alex Ross photo-real posture for Holmes. Atmospheric perspective for the street through the window. Victorian realism at maximum density. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`;

// Pre-commission gate §5 — all 8 checks for each variant:
// 1. Card identity: bs1-r02, bs-1-221b, Rare, each parallel ✅
// 2. Tier-parallel: Rare = Rare+ ✅
// 3. Density: MODERATE (Rare tier) ✅
// 4. Parallel signatures: each block has all required elements ✅
// 5. Lampblack: Silhouette (tall gaunt, three-quarter profile, pipe at side),
//    Props (pipe + fog-window + figure-in-brown-coat),
//    Gesture (held breath mid-deduction),
//    Spine (machine-at-work reading a problem that doesn't know it's a problem) ✅
// 6. Universe DNA: Baker Street / 221B / gaslight / fog / Victorian ✅
// 7. Provider: replicate, flux-1.1-pro-ultra, PNG→WebP, 2:3 ✅
// 8. Manifest: creating new entries as complete ✅

const VARIANTS = [
  {
    id: 'bs1-r02-arcana',
    parallel: 'ARCANA',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate. One distinctive compositional element elevates above Common.

PARALLEL: ARCANA. Sacred-geometry variant at RARE scale.
ARCANA ELEMENTS — ALL REQUIRED (Rare scale: mandala modest, sigils legible but not dominant):
1. Sacred-geometry mandala behind Holmes's head — Rare scale: modest, glowing gold, present but not filling the sky. The mandala hovers in the warm interior space between Holmes and the room's lamp.
2. The figure-in-brown-coat on the street below has a faint radial geometric outline around them — a matching sacred geometry signature at street level, smaller than the mandala. As if Holmes's deduction mechanism above casts its pattern down onto the subject below. The mandala above and the geometry below share the same radial axis in the composition.
3. Alchemical sigils worked into the window-frame woodwork — the carved decorative elements of the Victorian window frame are revealed as sigil geometry, glowing gold, at Rare scale: legible but not dominant.
4. Golden occult filigree at the composition's frame edge — subtle at Rare scale, tracing the window frame's outer edge.
5. Universe-toned cosmic aurora: gaslight-gold aurora through the fog-hazed window glass (modest at Rare scale — present as a gold-toned luminance beyond the fog, not a full aurora).
LIGHT: The mandala adds a secondary gold light source behind Holmes. The warm lamp behind him unchanged. The figure below has the faint gold geometric outline as its only light modification. The flat grey street light unchanged.`,
  },
  {
    id: 'bs1-r02-aether',
    parallel: 'AETHER',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cosmic scale.

PARALLEL: AETHER. Mythic-cosmic variant at RARE scale.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the London fog through the window transforms to a gold-amber cosmic nebula — Baker Street-toned cosmos. The fog-glass becomes the threshold between the domestic interior and infinite space. The cobblestones below dissolve into the nebula; the figure-in-brown-coat is tiny against the vast cosmos.
2. Divine particulate: gold luminous motes drift from the window into the room, as if the cosmos is leaking in through the fog-threshold. The particulate replaces the fog condensation on the glass.
3. God-rays of cosmic non-diegetic origin: light descends from the cosmos through the window onto Holmes from above. Holmes is lit from two sources — the warm domestic lamp behind him and the gold cosmic rays through the glass.
4. Scale expansion: the figure-in-brown-coat below is intimate-scale against a vast gold-amber cosmos. Holmes stands at the threshold — the room behind him intact, domestic, warm; the view through the window is the cosmos, and the subject of his deduction is a figure standing in that cosmos, unknowing.
The Spine survives: the angular gaunt silhouette, the pipe at side, the held breath. Holmes has looked out the window and the cosmos is looking back through it.
LIGHT: Cosmic god-rays through the window. Divine particulate from the fog-threshold. The warm lamp behind Holmes unchanged — the two light sources (domestic lamp, cosmic rays) mark the threshold between room and cosmos.`,
  },
  {
    id: 'bs1-r02-witness',
    parallel: 'WITNESS',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate in texture; zero mythologizing.

PARALLEL: WITNESS. Photoreal documentary variant at RARE density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins cinematography register. Every material at photographic resolution.
2. Period-accurate material texture: the window glass (condensation patterns on the inner surface, the precise distortion of Victorian plate glass on the view outside), the fog outside (actual weather physics — particulate density, how gaslight halos form in genuine London fog), Holmes's dark coat (every thread, the exact drape of Victorian wool on a tall man), the pipe (worn meerschaum, the patina of a pipe used for years, not a prop), the window frame (Victorian painted wood, the exact texture of paint over wood grain, the wear at the hand-contact point where Holmes places his hand).
3. Cinema vérité composition: naturalistic blocking — this is how Holmes would actually stand at a window in 1890s London. The camera is in the room, slightly behind Holmes at eye level, slightly to the left. We see his three-quarter back and the window. Documentary angle.
4. NO Alvinized light, NO parallel-register elements: the flat grey London daylight through the fog-glass. The warm lamp behind Holmes (practical, single-source). No mandala, no sigils, no cosmic elements. The fog is fog — physics, not atmosphere.
The figure in the street below: forensic accuracy. A person in a brown coat on wet cobblestones in 1890s London. This is how they actually look.
STYLE: Maximum photorealism. Deakins documentary intimacy. Evidence.`,
  },
  {
    id: 'bs1-r02-neon',
    parallel: 'NEON',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cyber-modern scale.

PARALLEL: NEON. Cyber-modern reimagining at RARE scale.
NEON ELEMENTS — ALL REQUIRED:
1. Character relocated to a near-future setting (2040s): the 221B sitting room is a high-floor smart-glass tower apartment. Holmes stands at the full-height smart-glass window wall, observing the city below. The fog of Baker Street has become the sea of 2040s London city lights — neon grid, hot pink and cyan.
2. Synthwave palette: hot pink, electric cyan, neon violet — the city neon from below casts upward light on Holmes. The smart-glass window has analytical overlays: the subject below highlighted in a cyan geometric target ring, biometric data cascading at the window edge (readable but not dominant at Rare scale).
3. AR visor DEPLOYED: Holmes's AR visor is active — unlike other NEON cards where it rests on his forehead, here it is deployed over his eyes, because this is the moment of active observation. The pipe at his side is unchanged (1880s pipe in 2040s setting — the anachronism Spine).
4. Lampblack preservation:
   — Holmes: tall, gaunt, hawkish profile unchanged. Three-quarter back to us, one hand on the smart-glass frame. Pipe at side.
   — The gesture: held breath mid-deduction. The 2040s city below is as legible to Holmes as Baker Street was.
   — The subject below: the "figure in a brown coat" becomes a tracked subject on the city street, highlighted in cyan. The anachronism Spine: Holmes is using 2040s technology but the deductive gesture is 1880s.
LIGHT: City neon through the smart-glass — hot pink and cyan uplight from below. The smart-glass analytical overlay adds faint cyan at the window edge. The warm desk lamp behind Holmes from the apartment interior — same geometry as the original lamp, warm against the cool neon city.`,
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

  console.log(`\n▶ rendering ${variant.id} (bs1-r02 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
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
    name: 'The Street Deduction',
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
  console.log(`\n✅ Track A Cycle 26 complete:`);
  console.log(`   ${newEntries.length} renders (bs1-r02 Rare parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);
  console.log(`   Rare tier: ${4 + newEntries.length}/20 done`);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
