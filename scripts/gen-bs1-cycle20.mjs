#!/usr/bin/env node
// Track A — Cycle 20: 4 bs1-u01 parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// Priority: Ultimate parallels first (§8 of ART-DIRECTION-COMMISSIONING-DOCTRINE.md).
// Pre-commission gate: ALL 8 checks PASS for each variant (see inline comments).
// Saves to public/prototype-art/bs-1-221b/bs1-u01-{parallel}/v1.webp
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
const CYCLE = 20;

// bs1-u01 base prompt — confirmed BASE parallel, MAXIMALIST density.
// Used as the foundation; each parallel block is appended below.
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan orbital composition + Alex Ross photo-real-mythic posture as ceiling. This is an Ultimate card — apex density and emotional charge.

SUBJECT: The first meeting. 221B Baker Street, 1881. Sherlock Holmes has just shaken Watson's hand and is already mid-deduction — eyes fixed on Watson's face, head slightly inclined, fingertips just released from Watson's right hand. Tall, gaunt, hawkish: the angular shoulder, the forward-lean of mid-deduction. Watson stands opposite — squared military bearing, the Afghanistan limp in the stance (weight left, right hip forward), brown wool coat with the white dust of Kandahar still in the creases. Watson's face shows the shock of the first deduction: the open expression of a man who was just read like a document.

SCENE: The chemical laboratory at St Bartholomew's Hospital where they first met — not 221B yet. Laboratory benches, chemical apparatus, a smell of acid caught in the painting (acid-stained wood, copper tubing, glass retorts). Morning light through tall sash windows, cold white London daylight. A second figure, Stamford, fading into background at far left, already becoming irrelevant.

ICONOGRAPHY: Holmes's hand still half-extended after the handshake, the deduction already happening in the fingers' last contact. Watson's notebook half-visible in his coat pocket — the chronicle about to begin.

NARRATIVE BEAT: The held instant of the first deduction. The split-second after "You have been in Afghanistan, I perceive" but before Watson has answered. The universe that existed before this meeting is ending.

COMPOSITION: Drew Struzan orbital — Holmes centered at mid-frame, Watson in three-quarter view at right, Stamford soft-focus at far left. The handshake position creates a diagonal axis across the lower third. Holmes's gaze as a vector arrow to Watson's face. The laboratory frames the encounter as a scene of evidence.

STYLE: Alex Ross photo-real mythic posture at maximum density. Drew Struzan orbital composition. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "A Study in Scarlet," 1887, Chapter 2: "The Science of Deduction."`;

// PARALLEL VARIANTS — Pre-commission gate §5 passes for all four:
// Tier=Ultimate (Rare+) ✅  |  ARCANA/AETHER/WITNESS/NEON each have all 4 required elements ✅
// Lampblack: Silhouette (tall gaunt hawkish Holmes + squared Watson) ✅
//   Props (handshake + notebook) ✅  |  Gesture (first deduction moment-after) ✅
//   Spine (solves via observation; Watson chronicles) ✅
// Universe DNA: Baker Street gaslight/Victorian/Paget/Sargent ✅
// Provider: replicate, Model: flux-1.1-pro-ultra, Aspect: 2:3 ✅

const VARIANTS = [
  {
    id: 'bs1-u01-arcana',
    parallel: 'ARCANA',
    // Gate check 4: ARCANA block has all 4 required elements (mandala, sigils, filigree, aurora) ✅
    parallelBlock: `
DENSITY CLASS: Ultimate — Maximalist. THE defining image of the arc. Full compositional techniques deployed. Full Alvinized treatment. No parallel-register elements except those in the ARCANA block below.

PARALLEL: ARCANA. This is the sacred-geometry variant at ULTIMATE scale.
ARCANA ELEMENTS — ALL REQUIRED:
1. Sacred-geometry mandala at Ultimate scale: the mandala IS the sky. The laboratory's sash windows become framed by the mandala geometry — the sacred geometry fills the upper two-thirds of the frame. The figures stand inside it as if it was always here.
2. Alchemical sigils integrated into the laboratory floor and apparatus: the acid-stained wooden bench becomes a sigil grid; the copper tubing traces geometric glyph-patterns; the glass retorts are held in alchemical armatures. Glowing gold, unmistakable.
3. Golden occult filigree grown from the laboratory's brass fittings — it frames the composition from the physical architecture of the room.
4. Universe-toned cosmic aurora: gaslight-gold aurora replaces the cold London daylight through the sash windows. The aurora and the mandala together form the Ultimate's sky.
The non-diegetic gold column on the handshake is now NESTED inside the mandala geometry. The handshake is surrounded by sacred-geometry radiance.
LIGHT: Cold laboratory base-tone; the gold light on the handshake now sourced from the mandala above, not from nowhere — the mandala is the source.`,
  },
  {
    id: 'bs1-u01-aether',
    parallel: 'AETHER',
    // Gate check 4: AETHER block has all 4 required elements (aurora-cosmic, divine particulate, god-rays, scale expansion) ✅
    parallelBlock: `
DENSITY CLASS: Ultimate — Maximalist. THE defining image of the arc at cosmic scale.

PARALLEL: AETHER. This is the mythic-cosmic variant at ULTIMATE scale.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the St Bartholomew's laboratory walls fall away entirely. Nebulae, galactic drift, cosmic dust in Baker Street tones — gold and amber, warm and vast. The universe that existed before this meeting is ending, and the ending is visible as a galactic panorama.
2. Divine particulate: gold luminous motes rise from the handshake as if the first meeting releases energy into the cosmos. The motes trail upward into the nebula.
3. God-rays of cosmic non-diegetic origin: light descends from an impossible source in the cosmos above — not the laboratory window, not a lamp — the cosmos itself illuminates the handshake from above.
4. Scale expansion: Holmes and Watson are intimate figures against an infinite gold-amber cosmos. The laboratory bench is a faint ghost at their feet. Stamford has faded to a silhouette at the cosmic edge. The handshake is the only solid thing in the frame.
The Spine of both figures survives the scale: Holmes's gaunt hawkish profile unmistakable at any size; Watson's military bearing unchanged against the cosmos.
LIGHT: Cosmic scale — the impossible light falls from the nebula above. The handshake still glows but with cosmic origin, not a laboratory column.`,
  },
  {
    id: 'bs1-u01-witness',
    parallel: 'WITNESS',
    // Gate check 4: WITNESS block has all 4 required elements (photoreal, period texture, vérité, no Alvinized) ✅
    parallelBlock: `
DENSITY CLASS: Ultimate — Maximalist in narrative density and texture — no mythologizing overlays.

PARALLEL: WITNESS. This is the photoreal documentary variant at ULTIMATE density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins / Emmanuel Lubezki cinematography register at maximum fidelity. Every material photographically real.
2. Period-accurate material texture at photographic resolution: the acid-stained laboratory bench (every grain), the brass copper tubing (every verdigris mark), Watson's worn brown wool coat (every thread of the Kandahar dust still in the creases), Holmes's waistcoat (every button, every worn edge), the glass retorts (every reflection of the cold window light).
3. Cinema vérité composition: naturalistic blocking, no theatrical Struzan framing — the camera was here and caught them. Practical window light only — cold London morning through the tall sash windows, grey-white daylight falling across the handshake.
4. NO Alvinized light: the non-diegetic gold column on the handshake is ABSENT. The handshake is lit only by the cold practical window light, exactly as a camera present at this moment would have recorded it.
The emotional weight is carried entirely by facial expression and body language. Holmes's certainty. Watson's open shock. The faces say everything. The light says nothing mythological.
STYLE: Maximum photorealism. Every pore, every worn edge. This actually happened.`,
  },
  {
    id: 'bs1-u01-neon',
    parallel: 'NEON',
    // Gate check 4: NEON block has all 4 required elements (2040s setting, synthwave palette, cyber architecture, Lampblack preservation) ✅
    parallelBlock: `
DENSITY CLASS: Ultimate — Maximalist. THE defining image at cyber-modern scale.

PARALLEL: NEON. This is the cyber-modern reimagining at ULTIMATE scale.
NEON ELEMENTS — ALL REQUIRED:
1. Character relocated to a near-future setting (2040s): St Bartholomew's is now a tech-clinical research and diagnostic hub — glass and steel, holographic laboratory displays, biometric readout panels, sterile smart-surfaces.
2. Synthwave palette: hot pink, electric cyan, neon violet, electric green — the laboratory is alive with diagnostic color. The holographic displays cast cyan and pink light across both figures.
3. Modern/cyber architecture: holographic patient-data displays visible beyond the handshake, neon-lit research bays, glass partition walls with projected lab data, a city of near-future London visible through the tinted window behind.
4. Lampblack preservation:
   — Holmes: AR visor, atomizer at the jawline (the pipe is gone; the instrument of thought-gathering remains). Tall, gaunt, hawkish profile unchanged. The forward-lean of mid-deduction unchanged. The deduction registers as a biometric readout scrolling on his AR visor display — Watson's service record, injury pattern, deployment zone, gait analysis — all visible to the viewer on the visor's projected display.
   — Watson: military-grade prosthetic support at the hip instead of a cane (the Afghanistan limp remains; the aid has changed). The notebook is a haptic tablet half-visible in the coat pocket. The squared military bearing unchanged. Brown synthetic-wool coat, worn at the edges.
   — The handshake: still the handshake. Skin on skin. No gloves. No haptic interface. The Spine survived the shell change.
The Spine: Holmes reads Watson. The medium has changed. The reading has not.
LIGHT: Synthwave ambient — cyan from the holographic displays, hot pink from the diagnostic panels, a neon-violet wash from the city beyond. The handshake is the one warm-skin point in a neon frame.`,
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
      const poll = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${KEY}` },
      });
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

  console.log(`\n▶ rendering ${variant.id} (bs1-u01 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
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
    character: 'Sherlock Holmes + Watson',
    name: "You Have Been in Afghanistan, I Perceive",
    tier: 'Ultimate',
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
      ts: entry.generatedAt,
      provider: 'replicate',
      model: 'black-forest-labs/flux-1.1-pro-ultra',
      cardId: variant.id,
      costUsd: COST_PER_RENDER,
      cycleN: CYCLE,
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
  } catch {
    manifest = [];
  }
  manifest.push(...newEntries);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  const totalCost = newEntries.length * COST_PER_RENDER;
  console.log(`\n✅ Track A Cycle 20 complete:`);
  console.log(`   ${newEntries.length} renders succeeded (bs1-u01 Ultimate parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);

  if (errors.length > 0) {
    console.error('\nFailed renders:');
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
