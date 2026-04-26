#!/usr/bin/env node
// Track A — Cycle 25: 4 bs1-r01 Rare parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// Starts Rare tier (20 pieces total; 4/cycle = 5 cycles). bs1-r01 "V.R. in the Plaster".
// §4 audit: base prompt says "not literal" for mandala geometry; treat as naturalistic base art.
// ARCANA parallel adds explicit mandala — clear upgrade regardless of base art result.
// Saves to public/prototype-art/bs-1-221b/bs1-r01-{parallel}/v1.webp
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
const CYCLE = 25;

// bs1-r01 base prompt — Rare tier, MODERATE density, BASE parallel.
// The "accidental geometry" around V.R. bullet-holes is a base-art naturalistic detail.
// ARCANA parallel will explicitly add sacred-geometry mandala — this is the upgrade.
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Alex Ross photo-real-mythic posture as ceiling.

SUBJECT: Sherlock Holmes at 221B Baker Street, the moment-after. He has just shot "V.R." — Victoria Regina — into the sitting-room wall. He stands with the service revolver lowered at his side, barrel still trailing a thin thread of blue smoke. Tall, gaunt, angular — hawkish profile in three-quarter view. Shirtsleeves, waistcoat loose, briar pipe clenched at the jaw's corner.

SCENE: The 221B sitting room. The plaster wall at center-frame: "V.R." in fresh bullet-holes, each hole a dark star. The room: tobacco haze, chemistry equipment on the sideboard, stacked case-files. One lamp lit.

ICONOGRAPHY: The "V.R." in the plaster — boredom-as-genius. The lowered revolver with its smoke-thread — precision-that-exceeds-its-occasion.

NARRATIVE BEAT: Moment-after — the shots already fired, the boredom not yet lifted. Holmes looking at the letters with the same expression he would use examining a crime scene.

COMPOSITION: Holmes at left two-thirds, three-quarter view. The "V.R." wall occupies the right third, full height. Diptych — man and mark, artist and medium.

LIGHT: Single lamp at left, warm amber. The blue gun-smoke catches the lamplight as the only cool element.

STYLE: Alex Ross photo-real posture at MTG mythic-rare density. Victorian realism. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Adventure of the Musgrave Ritual," 1893.`;

// Pre-commission gate §5 — all 8 checks for each variant:
// 1. Card identity: bs1-r01, bs-1-221b, Rare, each parallel ✅
// 2. Tier-parallel: Rare = Rare+ ✅
// 3. Density: MODERATE (Rare tier) ✅
// 4. Parallel signatures: each block has all 4 required elements ✅
// 5. Lampblack: Silhouette (tall gaunt hawkish, revolver lowered),
//    Props (service revolver + "V.R." in plaster),
//    Gesture (moment-after, boredom-not-yet-lifted),
//    Spine (precision-that-exceeds-its-occasion) ✅
// 6. Universe DNA: Baker Street 221B/gaslight/tobacco-amber/Paget/Ross ✅
// 7. Provider: replicate, flux-1.1-pro-ultra, PNG→WebP, 2:3 ✅
// 8. Manifest: creating new entries as complete ✅

const VARIANTS = [
  {
    id: 'bs1-r01-arcana',
    parallel: 'ARCANA',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate. One distinctive compositional element elevates above Common. The parallel treatment is the elevated element.

PARALLEL: ARCANA. This is the sacred-geometry variant at RARE scale.
ARCANA ELEMENTS — ALL REQUIRED (Rare scale: mandala modest, sigils legible but not dominant):
1. Sacred-geometry mandala behind Holmes's head — Rare scale: modest, glowing gold, the bullet-holes in "V.R." echo the mandala's radial geometry as if Holmes aimed by the mandala's pattern. The mandala and the "V.R." share the same geometric center in the composition.
2. Alchemical sigils worked into the wallpaper pattern around the bullet-holes — the pattern that in the base art is "accidental geometry" is now made explicit: geometric glyph-patterns glowing gold, as if the wallpaper always had these sigils and the bullet-holes revealed them.
3. Golden occult filigree at the composition's frame edge — subtle at Rare scale, tracing the wall's chair-rail and skirting.
4. Universe-toned cosmic aurora: gaslight-gold aurora through the 221B window (partially visible at frame edge). Modest at Rare scale — present but not dominant; the base composition still reads beneath the parallel treatment.
LIGHT: The mandala adds a secondary gold light source above Holmes. The amber lamp at left unchanged. The "V.R." bullet-holes are now lit from within by the revealed sigil geometry. Blue gun-smoke unchanged.`,
  },
  {
    id: 'bs1-r01-aether',
    parallel: 'AETHER',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cosmic scale.

PARALLEL: AETHER. This is the mythic-cosmic variant at RARE scale.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the 221B sitting room wall behind the "V.R." falls away to a gold-amber cosmic nebula — Baker Street-toned. The bullet-holes in the plaster open into the cosmos; the "V.R." letters hang against the nebula. The lamp at left remains; the nebula is the room's back wall.
2. Divine particulate: gold luminous motes drift from the bullet-holes into the cosmic space — as if the shooting released something into the cosmos. The gun-smoke threads dissolve into the motes.
3. God-rays of cosmic non-diegetic origin: light descends from the cosmos through the opened wall onto Holmes and the revolver from above.
4. Scale expansion: the "V.R." letters are intimate-scale against a vast gold-amber cosmos. Holmes stands before them, small against what the shooting has opened. The cosmic expansion is visible only through the wall that his shots have opened — the room is intact; only the back wall has become cosmos.
The Spine survives: the hawkish profile, the lowered revolver, the gun-smoke, the faint distaste on the face. Holmes has shot a hole in the wall and the cosmos is on the other side.
LIGHT: Cosmic god-rays through the opened wall. Divine particulate from the bullet-holes. The lamp at left unchanged — the two light sources (domestic lamp, cosmic rays) mark the threshold.`,
  },
  {
    id: 'bs1-r01-witness',
    parallel: 'WITNESS',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate in texture; zero mythologizing.

PARALLEL: WITNESS. This is the photoreal documentary variant at RARE density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins cinematography register. Every material at photographic resolution.
2. Period-accurate material texture: the plaster wall (every crack around the bullet-holes, fresh plaster dust still settling), the "V.R." pattern in the wall (the specific spatter of a service revolver at this range and angle), Holmes's shirtsleeves (every thread, sweat-damp from the effort of precision), the service revolver (blued-steel surface, every scratch, the thin blue smoke from the barrel at exact temperature and density for post-discharge), the 221B wallpaper (its specific pattern, its age, the way bullet-holes tear through aged paper and plaster differently than through new).
3. Cinema vérité composition: naturalistic blocking — this is how Holmes would actually stand after shooting into a wall. No theatrical Struzan framing. The camera is in the room, slightly off to the side, at eye level. Documentary angle.
4. NO Alvinized light, NO parallel-register elements: the lamp is the only light source, exactly as it would actually be. The bullet-holes in "V.R." are naturalistic plaster damage — no geometry, no sigils. The gun-smoke is physics, not atmosphere.
The "V.R." letters: forensic photography of the actual pattern of a service revolver fired by an expert marksman into a plaster wall at 221B. This actually happened.
STYLE: Maximum photorealism. Deakins documentary intimacy. Evidence.`,
  },
  {
    id: 'bs1-r01-neon',
    parallel: 'NEON',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cyber-modern scale.

PARALLEL: NEON. This is the cyber-modern reimagining at RARE scale.
NEON ELEMENTS — ALL REQUIRED:
1. Character relocated to a near-future setting (2040s): the 221B sitting room is a high-floor apartment. The plaster wall is now a smart-glass panel — a reactive display surface. Holmes has inscribed "V.R." into it with a precision tool (not a revolver; a cutting tool or high-precision laser).
2. Synthwave palette: hot pink, electric cyan, neon violet — the smart-glass panel glows with the inscribed letters; the neon from the 2040s London city below comes through the window and casts upward light on Holmes.
3. Modern/cyber architecture: the smart-glass wall panel with "V.R." inscribed in laser-cut geometry, each letter surrounded by the panel's cracked-glass damage pattern — like bullet-holes but for a smart-surface. The chemistry equipment on the sideboard is a 2040s analytical chemistry setup with holographic readout displays.
4. Lampblack preservation:
   — Holmes: tall, gaunt, hawkish profile unchanged. The precision tool held at the side, still warm (analogue of the lowered revolver with gun-smoke). The AR visor at rest on his forehead — not deployed; he was not observing, he was acting.
   — The gesture: moment-after. The letters inscribed. The boredom not yet lifted. Holmes looking at the inscription with the same expression he would use examining evidence.
   — "V.R." on the panel: Victoria Regina still, in a 2040s setting that has no Queen Victoria — the inscription is the anachronism, and the anachronism is the Spine. Holmes has inscribed an 1880s oath into a 2040s surface.
LIGHT: City neon through the window — hot pink and cyan uplight. The inscribed "V.R." letters glow where the smart-glass panel was damaged. The warm lamp at left replaced by a warm desk lamp at low brightness.`,
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

  console.log(`\n▶ rendering ${variant.id} (bs1-r01 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
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
    name: 'V.R. in the Plaster',
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
  console.log(`\n✅ Track A Cycle 25 complete:`);
  console.log(`   ${newEntries.length} renders (bs1-r01 Rare parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);
  console.log(`   Rare tier: 4/20 done`);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
