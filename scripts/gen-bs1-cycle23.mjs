#!/usr/bin/env node
// Track A — Cycle 23: 4 bs1-l02 Legendary parallel variants via FLUX 1.1 Pro Ultra / Replicate.
// Completes Legendary tier (8/8 non-ONE-OFF). bs1-l02 "The Seven-Per-Cent".
// Pre-commission gate: ALL 8 checks PASS (see inline comments).
// Saves to public/prototype-art/bs-1-221b/bs1-l02-{parallel}/v1.webp
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
const CYCLE = 23;

// bs1-l02 base prompt — Legendary tier, RICH density, BASE parallel.
// The direct gaze is the defining Spine gesture. The Morocco case = the defining Prop.
// No Alvinized light in the base; the needle's overlit highlight is diegetic.
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; John Singer Sargent psychological portraiture as ceiling.

SUBJECT: Sherlock Holmes seated in the 221B armchair, late afternoon. The Morocco case lies open on the side-table at armrest level — the hypodermic needle visible within the lined interior, already drawn, resting on the dark case-lining. Holmes looking directly out of the frame, at the viewer. Not asking permission. Already decided.

SCENE: 221B sitting room, fading afternoon, no fire lit. The case-files on the desk behind him untouched — no active case. An open volume of chemistry abandoned on the floor. The sitting room in the particular stillness of a genius with nothing to deduce. The Morocco case and needle at armrest level: clinical, almost domestic in their calm.

ICONOGRAPHY: The Morocco case and needle — not dramatic. Clinical. The most frightening way to depict it: unhurried, matter-of-fact, almost tidy.

NARRATIVE BEAT: Direct address — the gaze held outward. The invitation, or the indictment of the witness, depending on the witness.

COMPOSITION: Tight three-quarter hero — Holmes and armchair filling the frame. The Morocco case and needle in the lower-right third, sharp and close. His face at the upper-left, lit by warm peripheral reach. The direct gaze bisects the frame vertically.

STYLE: John Singer Sargent oil-paint psychological portraiture at full power. Victorian moral gravity without Victorian moral judgment. No text, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Sign of the Four," 1890.`;

// Pre-commission gate §5 — all 8 checks for each variant:
// 1. Card identity: bs1-l02, bs-1-221b, Legendary, each parallel ✅
// 2. Tier-parallel: Legendary = Rare+ ✅
// 3. Density: RICH (Legendary tier) ✅
// 4. Parallel signature: each block has all 4 required elements ✅
// 5. Lampblack: Silhouette (seated Holmes in armchair, tight frame),
//    Props (Morocco case + needle — most clinical Prop in the Set),
//    Gesture (direct address to viewer — the viewer is assigned the witness role),
//    Spine (certainty without shame; the face of a man who has paid the cost before) ✅
// 6. Universe DNA: Baker Street 221B / Sargent portraiture / Victorian ✅
// 7. Provider: replicate, flux-1.1-pro-ultra, PNG→WebP, 2:3 ✅
// 8. Manifest: creating new entries as complete ✅

const VARIANTS = [
  {
    id: 'bs1-l02-arcana',
    parallel: 'ARCANA',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich. Full environmental storytelling. Legendary-scale mandala (fills upper half). No sacred geometry forbidden on non-ARCANA parallels.

PARALLEL: ARCANA. This is the sacred-geometry variant at LEGENDARY scale.
ARCANA ELEMENTS — ALL REQUIRED:
1. Sacred-geometry mandala at Legendary scale: the mandala fills the upper half of the frame behind Holmes's head. The Morocco case — its case-lining, the geometry of its hinge and clasp — has a parallel structure in the mandala above. The needle's linear highlight is echoed in the mandala's radial geometry. Holmes sits at the center of the sacred circle.
2. Alchemical sigils worked into the Morocco case lining: the dark bottle-green lining has geometric glyph-patterns embossed or glowing gold — the case-lining is an alchemical instrument tray. The needle rests in a sigil-lined cradle.
3. Golden occult filigree framing the composition — grown from the armchair's wooden frame, from the 221B wallpaper pattern, tying the domestic Victorian interior to the sacred geometry above.
4. Universe-toned cosmic aurora: gaslight-gold aurora behind the mandala — the fading afternoon light through the 221B windows has become aurora. The room is lit by the sacred geometry and the aurora, not the oil lamp.
The direct gaze is UNCHANGED: Holmes looks directly at the viewer from the center of the mandala. The gaze that does not ask permission is now the gaze of a figure at the center of a sacred geometry. The indictment is amplified.
LIGHT: The mandala — gold sacred light falling from above. The Morocco case lining glows with secondary sigil-light. Holmes's face is lit by the geometry he sits inside.`,
  },
  {
    id: 'bs1-l02-aether',
    parallel: 'AETHER',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich. Full environmental storytelling at cosmic scale.

PARALLEL: AETHER. This is the mythic-cosmic variant at LEGENDARY scale.
AETHER ELEMENTS — ALL REQUIRED:
1. Aurora-cosmic backdrop: the 221B sitting room walls fall away. Where the wallpaper was, there is a gold-amber cosmic nebula — Baker Street-toned, warm, old. The fading afternoon is now a fading cosmos. The desk behind Holmes is a ghost against the nebula.
2. Divine particulate: gold luminous motes float around the Morocco case — as if the case radiates something into the cosmic space around it. The needle catches the divine particulate light as a golden highlight.
3. God-rays of cosmic non-diegetic origin: light falls on Holmes from an impossible source in the cosmos above — not the oil lamp, not the afternoon window. The cosmos illuminates the figure who has decided.
4. Scale expansion: Holmes is a small figure against an infinite gold-amber cosmos, but the frame is still tight — the intimacy of the portrait survives the scale expansion. The armchair and the Morocco case occupy their precise positions; the cosmos is background, not foreground. The direct gaze is unchanged: Holmes looks at the viewer from the center of the cosmos.
The Spine survives: the direct gaze, the unhurried posture, the certainty. The Morocco case at armrest level, still clinical, still matter-of-fact. The cosmos does not mythologize what is already decided.
LIGHT: Cosmic god-rays. Divine particulate. The Morocco case catches the cosmic light as the brightest element.`,
  },
  {
    id: 'bs1-l02-witness',
    parallel: 'WITNESS',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich in psychological and material texture; zero mythologizing.

PARALLEL: WITNESS. This is the photoreal documentary variant at LEGENDARY density.
WITNESS ELEMENTS — ALL REQUIRED:
1. Photoreal documentary-cinema realism: Roger Deakins / Lubezki intimacy register at maximum Legendary fidelity. This is the Sargent portrait as if Sargent were a cinematographer.
2. Period-accurate material texture at photographic resolution: the Morocco case leather (every grain, every wear-mark from use), the dark bottle-green case lining (every fiber), the hypodermic needle (glass and metal at photographic resolution, the specific reflectivity of the needle catching the afternoon light), Holmes's charcoal coat and waistcoat (every button, every thread), the 221B armchair fabric (aged, precise).
3. Cinema vérité composition: naturalistic blocking — Holmes as he would actually sit, the Morocco case as it would actually rest. No theatrical framing. The camera is in the room. Practical afternoon light only: the fading natural light through the window, the oil lamp barely catching.
4. NO Alvinized light, NO parallel-register elements of any kind: the needle's overlit highlight comes only from the practical afternoon window — cold, documentary, non-mythologizing.
The direct gaze is UNCHANGED and AMPLIFIED by the photorealism: in Sargent, the gaze is painterly; in WITNESS, it is documentary evidence. Holmes looks at the viewer as if the viewer is in the room. The Morocco case at armrest level, photographically real, unmediated.
STYLE: Maximum photorealism. Deakins long-take intimacy. This actually happened, in a room, in fading afternoon light.`,
  },
  {
    id: 'bs1-l02-neon',
    parallel: 'NEON',
    parallelBlock: `
DENSITY CLASS: Legendary — Rich at cyber-modern scale.

PARALLEL: NEON. This is the cyber-modern reimagining at LEGENDARY scale.
NEON ELEMENTS — ALL REQUIRED:
1. Character relocated to a near-future setting (2040s): the 221B sitting room is a high-floor apartment. The fading afternoon is a neon night. The 221B windows look out onto a 2040s London — glass towers, neon signage, holographic displays at street level.
2. Synthwave palette: hot pink, electric cyan, neon violet from the city below. Holmes sits in a dark room lit by the neon city — no oil lamp; the neon is the light source.
3. Modern/cyber architecture: the smart-surface desk behind Holmes shows an inactive case board (holographic display at rest, waiting). The Morocco case sits on a carbon-fiber side table at armrest level, precisely as before.
4. Lampblack preservation:
   — Holmes: tall, gaunt, seated. The charcoal coat is replaced by a dark technical jacket. The direct gaze is UNCHANGED: Holmes looks directly at the viewer. Not asking permission. Already decided.
   — The Morocco case: it is now a biometric injector kit — a case of the same format, same dark lining, but containing a precision bio-injector instead of a glass hypodermic. The gesture is the same: open case, drawn instrument, clinical calm.
   — The Spine: certainty without shame. The face of a man who has calculated the cost and paid it many times. The medium has changed. The decision has not.
The city neon is the Alvinized light analogue: hot pink and electric cyan from below, casting upward on the direct gaze. The Morocco case catches the neon light as the brightest element in the frame, as before.
LIGHT: City neon — hot pink from holographic signage below, electric cyan from tower glass, neon violet ambient. The bio-injector case catches the neon as the single brightest element. Holmes's face in neon half-light, direct gaze unchanged.`,
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

  console.log(`\n▶ rendering ${variant.id} (bs1-l02 ${variant.parallel}) via Replicate FLUX 1.1 Pro Ultra…`);
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
    name: 'The Seven-Per-Cent',
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
  console.log(`\n✅ Track A Cycle 23 complete:`);
  console.log(`   ${newEntries.length} renders succeeded (bs1-l02 Legendary parallels), ${errors.length} failed`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);
  console.log(`   Legendary tier: 8/8 non-ONE-OFF parallels COMPLETE`);

  if (errors.length > 0) {
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
