#!/usr/bin/env node
// Track A — Cycle 28: 4 bs1-r04 Rare parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// bs1-r04 "The Case Map". Top-down composition; Holmes at center of paper circle. Rare (16/20 after).
// Base prompt has "ARCANA geometry" as flavor for the overhead perspective — not literal sacred geometry.
// ARCANA parallel makes the mandala explicit on top of the deduction circle.
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
const CYCLE = 28;

// bs1-r04 base prompt — from manifest (as generated).
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Alex Ross photo-real-mythic posture + Moebius spatial mapping as ceiling.

SUBJECT: Sherlock Holmes seated on the floor of 221B. Papers radiate from him in a full circle — case documents, hand-drawn maps, coded telegrams, newspaper clippings pinned with tacks to the floor. Holmes at the center of the circle, long legs crossed, bent forward over a particular document, magnifying glass at work. In shirtsleeves, waistcoat, hair slightly disordered. Completely absorbed.

SCENE: The 221B sitting room, cleared — the furniture pushed to the walls. The circular spread of documents occupies the center of the floor. Holmes at the center of the circle, the papers forming a complete ring: a map of London with pencil-marked routes, a decoded cipher in his own hand, three newspaper pages with circled passages, a chemical analysis chart. The armchairs pushed back at the frame edges. The window at upper right — night, fog pressed against the glass. A single lamp on the floor beside Holmes illuminating the circle of papers.

ICONOGRAPHY: The papers in a perfect circle — Holmes creating the geometry of deduction physically. The lamp brought to the floor — descended to the level of the evidence. The disordered hair — the deduction at full-depth intensity.

NARRATIVE BEAT: The apex of the analytical process — Holmes inside the problem, the problem laid out around him like a cartography of consequence.

COMPOSITION: Top-down perspective, high angle, as if from the ceiling. Holmes at the center, the papers radiating outward like the spokes of a wheel. The armchairs at the very edges of the frame. The lamp beside Holmes creating a warm pool of light at the center.

LIGHT: The lamp on the floor — warm amber pool at the center. The circle of papers partially in lamplight, partially in shadow. The fog-grey window at upper frame. The center the brightest point.

STYLE: Alex Ross photo-real posture for Holmes at center. Moebius overhead cartographic perspective for the papers. Victorian interior raised to analytical sublime. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`;

// Pre-commission gate §5 — all 8 checks:
// 1. Card identity: bs1-r04, bs-1-221b, Rare, each parallel ✅
// 2. Tier-parallel: Rare = Rare+ ✅
// 3. Density: MODERATE (Rare tier) ✅
// 4. Parallel signatures: each block has all required elements ✅
// 5. Lampblack: Silhouette (crossed legs, bent forward, angular shoulder-line from above),
//    Props (magnifying glass + circle of papers + floor lamp),
//    Gesture (apex analysis — the man has become the problem),
//    Spine (deduction as cartography; Holmes inside the problem) ✅
// 6. Universe DNA: Baker Street / 221B / gaslight-amber / tobacco / Victorian ✅
// 7. Provider: replicate, flux-1.1-pro-ultra, PNG→WebP, 2:3 ✅
// 8. Manifest: creating new entries as complete ✅

const VARIANTS = [
  {
    id: 'bs1-r04-arcana',
    parallel: 'ARCANA',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate. One distinctive compositional element elevates above Common.

PARALLEL: ARCANA. Sacred-geometry variant at RARE scale.
ARCANA ELEMENTS — ALL REQUIRED (Rare scale: mandala modest, sigils legible but not dominant):
1. Sacred-geometry mandala overlaid on the paper circle — the circular arrangement of documents IS the mandala structure. Gold radial geometry traces the gaps between papers, connecting them as a mandala's radial arms. The deduction circle and the mandala share the same geometric center (Holmes). The mandala is modest at Rare scale — it emerges from the composition without overwhelming it.
2. The individual papers' edges begin to show sigil geometry — where the handwriting reaches the document margins, it becomes alchemical glyph sequences glowing gold at Rare scale. The center documents (where Holmes focuses with the magnifying glass) are still legible; the outer ring of papers shows the sigil transformation.
3. The lamp's light expands to include a secondary gold source: the mandala's center emits gold radiance up from the floor, as if the geometry itself is luminant.
4. Golden occult filigree at the composition's frame edge — tracing the pushed-back armchairs and floor edges.
5. Universe-toned cosmic aurora: gaslight-gold aurora through the fog-pressed window at upper frame.
LIGHT: The floor lamp's amber pool unchanged. The mandala center adds gold uplight from below. The aurora through the window adds gold to the upper frame. Three warm light sources — practical, geometric, and cosmic — all gold.`,
  },
  {
    id: 'bs1-r04-aether',
    parallel: 'AETHER',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cosmic scale.

PARALLEL: AETHER. Mythic-cosmic variant at RARE scale.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the floor and 221B room fall away; the papers float in gold-amber cosmic nebula around Holmes — Baker Street-toned cosmos. The circular arrangement of documents becomes a star-chart formation, the papers now glowing at their edges like star-charts, each one a node in a vast analytical constellation.
2. Divine particulate: gold luminous motes drift from the paper surfaces outward into the cosmic space — the deduction radiating significance into the cosmos.
3. God-rays of cosmic non-diegetic origin: light descends from the cosmos above, converging on Holmes at the center — he is the convergence point of the analytical cosmos.
4. Scale expansion: Holmes and his papers are intimate-scale against a vast gold-amber cosmos. Viewed from above: the figure at the center of an analytical universe, the problem laid out not on a floor but among the stars.
The Spine survives: the crossed legs, the angular shoulder-line bent over the document, the magnifying glass at work. Holmes inside the problem; the problem is now cosmic scale.
LIGHT: Cosmic god-rays converging on Holmes from above. Divine particulate from the paper surfaces. The floor lamp is now a point of domestic amber in the center of the cosmic space — the only warm-source element, marking the human scale.`,
  },
  {
    id: 'bs1-r04-witness',
    parallel: 'WITNESS',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate in texture; zero mythologizing.

PARALLEL: WITNESS. Photoreal documentary variant at RARE density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins cinematography register. Top-down documentary photography — as if from a high vantage in the room (not supernaturally from the ceiling; a camera mounted at the highest accessible point).
2. Period-accurate material texture: the floor (Victorian wooden boards or worn carpet — the cleared center showing the actual wear patterns of foot traffic), the individual papers (each at a different paper stock — folded letters, newspaper, telegrams, hand-drawn maps; each with its own surface, age, ink type), Holmes's shirtsleeves and waistcoat (the sweat-damp of hours of concentration, the wear at the elbows from this precise posture), the magnifying glass (the exact brass-and-glass object at work, angled in his hand).
3. The oil lamp on the floor: practical physics — the exact cone of illumination produced by an oil lamp at floor level, the shadows thrown by paper edges, the slight soot trace above the flame.
4. NO Alvinized light, NO parallel-register elements. Watson's boots at frame edge: exactly as they would be — leather, worn, still.
The papers: forensic documentation of an actual evidence array. Every document legible at this scale as a physical object.
STYLE: Maximum photorealism. Deakins overhead documentary. Evidence.`,
  },
  {
    id: 'bs1-r04-neon',
    parallel: 'NEON',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cyber-modern scale.

PARALLEL: NEON. Cyber-modern reimagining at RARE scale.
NEON ELEMENTS — ALL REQUIRED:
1. Character and setting relocated to a 2040s high-floor apartment: Holmes seated on the floor, same posture — long legs crossed, bent forward, completely absorbed. The papers have become holographic data projections floating at floor level, radiating outward from Holmes in the same circle: London AR city-map with overlaid route-marks, decoded cipher streams in cyan text, news-feed extracts with circled passages in magenta, chemical analysis holographic chart.
2. Synthwave palette: the holographic projections cast hot pink, electric cyan, neon violet light upward and outward from the floor. Holmes is lit from below and all sides by the multicolor holo-glow. City neon from the window above adds uplight from outside.
3. Top-down perspective preserved: the overhead angle is unchanged. The holographic circle from above looks like a neon mandala — not sacred geometry, but the same radial logic in synthetic light.
4. Lampblack preservation:
   — The magnifying glass: in Holmes's hand, angled over a holographic projection — an 1880s optical instrument examining a 2040s data display. This is the Spine: the instrument of examination does not change even when the medium does.
   — AR visor deployed — half-extended over one eye (he is actively analyzing; not the passive-observation posture where the visor rests at the forehead).
   — Hair slightly disordered, shirtsleeves (dark 2040s equivalent), waistcoat (retained anachronism). The posture identical.
5. The "Watson's boots at frame edge" element: a pair of 2040s boots at the extreme frame edge, unchanged in their watching function.
LIGHT: Holographic projections as primary source — multicolor neon from the floor circle. City neon through the high window. The warm 2040s desk lamp brought to the floor: one amber element in the neon sea.`,
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

  console.log(`\n▶ rendering ${variant.id} (bs1-r04 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
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
    name: 'The Case Map',
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
  console.log(`\n✅ Track A Cycle 28 complete:`);
  console.log(`   ${newEntries.length} renders (bs1-r04 Rare parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);
  console.log(`   Rare tier: ${12 + newEntries.length}/20 done`);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
