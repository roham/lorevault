#!/usr/bin/env node
// Track A — Cycle 27: 4 bs1-r03 Rare parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// bs1-r03 "The Photograph" (Irene Adler cabinet photo still-life). Rare tier (12/20 after).
// Absent-character-trace composition — Holmes off-frame; photograph is the subject.
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
const CYCLE = 27;

// bs1-r03 base prompt — from manifest (as generated).
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga object-biography + Alex Ross photo-real-mythic as ceiling. This is a Rare absent-character-trace composition.

SUBJECT: A cabinet photograph, propped against the chemistry flask on the 221B mantelpiece. The photograph shows a young woman of striking presence — dark eyes, dark hair, slight smile — in formal 1880s dress, three-quarter portrait format. The card art is the mantelpiece composition: the photograph prominent at center, the room's other contents (briar pipe resting at the left edge, service revolver cloth at right, the Persian slipper visible at frame-right edge) as context. Holmes himself is not present — but a magnifying glass has been placed directly in front of the photograph, slightly aside, as if it has been examined.

SCENE: The 221B mantelpiece as still-life. The photograph — occupying the frame's center, propped upright against the retort stand — is the subject. Late-night, single lamp burning. The magnifying glass at an angle in front of the photograph. Faint tobacco haze in the air catching the lamp-light.

ICONOGRAPHY: The photograph — the one object Holmes kept from a case he did not solve to his own satisfaction. The magnifying glass placed in front of it — the evidence still being examined. The pipe laid aside — the examination interrupted or suspended.

NARRATIVE BEAT: Absent examination — Holmes has been studying the photograph again and left the room. The magnifying glass before the face says he was looking for something.

COMPOSITION: Still-life, centered. The photograph at center-frame, the cabinet photograph format creating a portrait-within-portrait. The magnifying glass angled slightly to reveal the face without obscuring it. The mantelpiece objects in periphery — familiar context.

LIGHT: Single oil lamp at lower-right, warm amber. The photograph's surface catching the lamplight as the brightest element. The tobacco haze visible as a diffuse amber column in the lamp-beam. Deep shadow at the upper frame.

STYLE: Kazuo Oga object-biography, Alex Ross photo-real posture for the photograph's subject. Victorian still-life at MTG Rare density. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "A Scandal in Bohemia," 1891.`;

// Pre-commission gate §5 — all 8 checks:
// 1. Card identity: bs1-r03, bs-1-221b, Rare, each parallel ✅
// 2. Tier-parallel: Rare = Rare+ ✅
// 3. Density: MODERATE (Rare tier) ✅
// 4. Parallel signatures: each block has all required elements ✅
// 5. Lampblack: Silhouette (absent-trace — photograph + magnifying glass = the trace),
//    Props (cabinet photograph + magnifying glass + pipe + lamp),
//    Gesture (absent examination — Holmes left, glass still angled),
//    Spine (the woman he could not solve; the glass still in front of her face) ✅
// 6. Universe DNA: Baker Street / 221B / gaslight-amber / tobacco / Victorian still-life ✅
// 7. Provider: replicate, flux-1.1-pro-ultra, PNG→WebP, 2:3 ✅
// 8. Manifest: creating new entries as complete ✅

const VARIANTS = [
  {
    id: 'bs1-r03-arcana',
    parallel: 'ARCANA',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate. One distinctive compositional element elevates above Common.

PARALLEL: ARCANA. Sacred-geometry variant at RARE scale.
ARCANA ELEMENTS — ALL REQUIRED (Rare scale: mandala modest, sigils legible but not dominant):
1. Sacred-geometry mandala appears within the cabinet photograph itself — behind the woman's face, as if the photograph's emulsion has revealed a mandala in the shadows. The mandala is modest at Rare scale: a gold radial geometry centered on her face, present but not overwhelming. Her slight smile is unchanged beneath it.
2. The magnifying glass lens reveals the geometry: viewed through the lens at the composition's angle, the mandala behind the woman's face is visible and complete — as if the magnifying glass is the instrument of its revelation. The "accidental optical system" noted in the base art is now made explicit.
3. Alchemical sigils worked into the mantelpiece wallpaper behind the photograph — the Victorian floral pattern is revealed as glyph geometry, glowing gold, at Rare scale: subtle, legible on close inspection.
4. Golden occult filigree at the composition's frame edge — tracing the mantelpiece's wood grain and the photograph's border.
5. Universe-toned cosmic aurora: gaslight-gold light emanates from within the photograph itself at the mandala's center — modest at Rare scale, a gold luminance, not a full aurora.
LIGHT: The mandala adds a secondary gold light source within the photograph. The oil lamp at lower-right unchanged. The photograph surface is the brightest element, now also emanating the mandala's gold.`,
  },
  {
    id: 'bs1-r03-aether',
    parallel: 'AETHER',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cosmic scale.

PARALLEL: AETHER. Mythic-cosmic variant at RARE scale.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the mantelpiece and the 221B room fall away; the cabinet photograph hovers in gold-amber cosmic space — Baker Street-toned nebula. The photograph is an intimate object suspended in the cosmos. The other mantelpiece objects (pipe, magnifying glass) float in the nebula at its edges.
2. Divine particulate: gold luminous motes drift from the photograph's surface outward into the cosmic space — as if the woman's image is releasing particles of significance into the cosmos.
3. God-rays of cosmic non-diegetic origin: light descends from above the cosmic space onto the photograph, the face in the photograph lit from two directions — the cosmic rays from above and the lamp-gold implied from below.
4. Scale expansion: the cabinet photograph is intimate-scale against a vast gold-amber cosmos. The magnifying glass floats before it in the cosmic space at its original angle — the examination suspended in infinity.
The woman's slight smile is unchanged against the cosmos. Whatever she knew, she knew it here too.
LIGHT: Cosmic god-rays onto the photograph. Divine particulate emanating from the surface. The oil lamp's amber is the warm light source implied at the lower edge, the cosmos the cold-gold source from above.`,
  },
  {
    id: 'bs1-r03-witness',
    parallel: 'WITNESS',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate in texture; zero mythologizing.

PARALLEL: WITNESS. Photoreal documentary variant at RARE density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins cinematography register. Every material at photographic resolution.
2. Period-accurate material texture: the cabinet photograph's paper (silver-gelatin printing process, 1880s — the slight foxing at the border, the sepia toning, the precise tonal range of period photography), the magnifying glass lens (scratches and fingerprints from repeated examination, the brass frame worn at the grip), the mantelpiece marble (every vein), the oil lamp flame (actual flame physics at this fuel load, the exact amber wavelength), the tobacco haze (actual particulate density in still night air).
3. Cinema vérité composition: the camera is at mantelpiece height, slightly to the left, looking slightly up at the photograph. This is how a forensic photographer would document the scene. The magnifying glass is at its exact resting angle — physical object, not a prop.
4. NO Alvinized light, NO parallel-register elements: the single oil lamp is the only source. The woman's face in the photograph is lit only by the lamp-amber, exactly as it would be on a 1890s mantelpiece at night. The magnifying glass lens shows the slight distortion of actual optics.
The woman's face in the photograph: forensic accuracy to 1880s cabinet photography conventions. This is an actual photograph examined on an actual mantelpiece.
STYLE: Maximum photorealism. Evidence.`,
  },
  {
    id: 'bs1-r03-neon',
    parallel: 'NEON',
    parallelBlock: `
DENSITY CLASS: Rare — Moderate at cyber-modern scale.

PARALLEL: NEON. Cyber-modern reimagining at RARE scale.
NEON ELEMENTS — ALL REQUIRED:
1. The cabinet photograph has become a holographic portrait display — a standing holographic pane on the smart-glass mantelpiece shelf, showing the woman's face in cyan and magenta light. The portrait format is identical: dark eyes, dark hair, slight smile, three-quarter view. The holographic substrate shows faint scan-line texture.
2. Synthwave palette: hot pink, electric cyan, neon violet — the holographic portrait illuminates the mantelpiece from within, casting cyan uplight onto the objects around it.
3. THE ANACHRONISM SPINE — the magnifying glass: the 1880s magnifying glass remains before the holographic portrait, at its same angle, as if Holmes used it to examine the holo-display. An 1880s optical instrument applied to a 2040s holographic image. This is the Spine: the deductive gesture does not change even when the medium does. The magnifying glass is the anachronism.
4. Secondary anachronisms: the briar pipe at the left edge — unchanged. The mantelpiece itself is 2040s smart-glass shelf, but the objects on it are period-incongruous.
5. Lampblack preservation: the absent examination is identical — Holmes left the room, the magnifying glass remains positioned before the face, the pipe is laid aside. The gesture is the same. Only the woman's image has changed medium.
LIGHT: Holographic portrait provides the primary light source (cyan and magenta). The desk lamp at lower right (2040s equivalent) provides warm amber fill. The two light sources mark the temporal threshold: warm amber (1880s domestic) and cool cyan (2040s holographic).`,
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

  console.log(`\n▶ rendering ${variant.id} (bs1-r03 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
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
    character: 'Irene Adler (Sherlock Holmes)',
    name: 'The Photograph',
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
  console.log(`\n✅ Track A Cycle 27 complete:`);
  console.log(`   ${newEntries.length} renders (bs1-r03 Rare parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);
  console.log(`   Rare tier: ${8 + newEntries.length}/20 done`);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
