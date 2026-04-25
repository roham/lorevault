#!/usr/bin/env node
// Track A — Cycle 2: generate 4 BS-1 "221B" PRIME Moments via FLUX 1.1 Pro Ultra / Replicate.
// Provider: Replicate (REPLICATE_API_TOKEN). Aspect: 2:3. Output: WebP ≤500 KB.
// Saves to public/prototype-art/bs-1-221b/<card-id>/v1.webp
// Updates public/prototype-art/manifest.json with FLUX provenance.
// Appends to /opt/rebirth-daemon/spend-ledger.jsonl.

import fs from 'node:fs/promises';
import path from 'node:path';
import { createWriteStream } from 'node:fs';
import sharp from 'sharp';

const KEY = process.env.REPLICATE_API_TOKEN;
if (!KEY) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }

const REPO = path.resolve(process.cwd());
const ART_BASE = path.join(REPO, 'public/prototype-art/bs-1-221b');
const MANIFEST_PATH = path.join(REPO, 'public/prototype-art/manifest.json');
const LEDGER = '/opt/rebirth-daemon/spend-ledger.jsonl';
const COST_PER_RENDER = 0.04;

// BS-1 "221B" — Series 1 Month 1 — Watson-narrated — All PRIME shell
// Lampblack layers (MULTIVERSE-SHELLS.md):
//   Holmes: SILHOUETTE=tall gaunt hawkish; PROPS=pipe+magnifying tool; GESTURE=forward-lean mid-deduction fingertips-at-temple; SPINE=solves unsolvable via observation
//   Watson: SILHOUETTE=squared mil-bearing Afghanistan limp; PROPS=notebook+service revolver; GESTURE=chronicler half-step-behind pen-to-page; SPINE=witness who outlives the genius

const MOMENTS = [
  {
    id: 'bs1-c01',
    slug: 'bs1-c01-watsons-arrival',
    name: "Watson's Arrival",
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Watson',
    narrativeBeat: 'moment-of-decision',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Kazuo Oga environmental intimacy as ceiling.

SUBJECT: Dr. John H. Watson on the threshold of 221B Baker Street, 1881, first arrival. Squared, military-bearing frame. Afghanistan limp visible — weight shifted left, cane at right hip. Brown wool coat, mud at the boots. Notebook held loosely in the left hand, half-open, pen tucked in the spine.

SCENE: The doorway of 221B from inside — Watson silhouetted against a London fog-white rectangle of street, Baker Street cobblestones visible behind him. Interior: oxblood wallpaper, a desk scattered with papers and a chemistry flask, a deerstalker hanging from a hook just inside. Warm gaslight from a wall sconce at camera-right illuminating the interior; the fog behind Watson is cold grey-white.

ICONOGRAPHY: The notebook in Watson's hand — the chronicle about to begin. The deerstalker on the hook in frame — Holmes present but off-frame.

NARRATIVE BEAT: The threshold moment — Watson one step inside, the decision already made. He is the witness arriving to witness.

COMPOSITION: Figure in doorway, lower-left third, silhouetted against cold exterior. Warm interior at right. The deerstalker hook at upper-right anchors the frame. Classical threshold composition — two worlds, one crossing.

LIGHT: Single cold daylight source from door exterior (grey-white fog). Single warm gaslight from interior wall sconce. Watson at the crossing point where cold meets warm.

COLOR: Tobacco-amber and oxblood interior. Fog-grey exterior. Warm-cool crossing encodes the threshold. Watson's wool coat a neutral bridge.

STAKES VISIBLE ON THE FACE: Resolve — the man who has decided to stop drifting. Not yet curiosity; not yet wonder. The steadiness before it begins.

OFF-FRAME IMPLICATION: The deerstalker on the hook tells you Holmes is upstairs. Watson's eyes angle slightly upward — the stairs off-frame, the genius waiting.

STYLE: Sidney Paget linework raised to John Singer Sargent oil-paint density. Victorian interior realism with Struzan compositional weight. No modern objects. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "A Study in Scarlet," 1887.`,
  },
  {
    id: 'bs1-c02',
    slug: 'bs1-c02-the-thinking-pose',
    name: 'The Thinking Pose',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    narrativeBeat: 'held-breath',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Kazuo Oga environmental intimacy as ceiling.

SUBJECT: Sherlock Holmes at the mantelpiece of 221B, 1881–1885. Tall, gaunt, hawkish profile — the angular shoulder line, the head set slightly forward. Briar pipe held in two fingers but not smoked, hanging loose. Fingertips of the right hand touching the right temple — the canonical thinking pose. Eyes half-closed, gaze off-frame, right.

SCENE: The sitting room at 221B, night. Mantelpiece at center: a service revolver laid on a cloth beside chemistry vials, a stack of case-correspondence, a Persian slipper. The wall above the mantelpiece carries a bullet-hole "V.R." in the plaster — barely visible in the lamp-shadow but there. Single oil lamp on the mantelpiece. Books to floor-level at left. Watson's armchair visible at lower-right, empty, a closed notebook on the cushion.

ICONOGRAPHY: The briar pipe — held loose, not drawn, not smoked. The near-invisible "V.R." in the plaster. The empty armchair — Watson absent but implied.

NARRATIVE BEAT: Held breath — the second before the deduction lands. Holmes suspended between question and answer, the lamp-light catching the angular jaw.

COMPOSITION: Three-quarter long shot, Holmes occupying left two-thirds of frame, mantelpiece a horizontal anchor. The empty armchair at lower-right creates negative space that implies the absent witness. The "V.R." bullet holes are mid-ground, slightly soft-focus — a secondary hidden detail.

LIGHT: Single warm oil lamp from the mantelpiece, low and close. Deep shadows on the right half of the composition. Tobacco haze catches the lamp-beam as a diffuse amber column.

COLOR: Tobacco-amber, oxblood, deep shadow. The chemistry vials introduce a single cool-blue note — the only non-warm element.

STAKES VISIBLE ON THE FACE: Perfect stillness. Not boredom. The face of a mechanism running.

OFF-FRAME IMPLICATION: The eye-line aimed at the window off-frame to the right. Whatever the case is, it's out there in the fog.

STYLE: John Singer Sargent oil-paint density with Sidney Paget compositional grammar. Victorian realism, no pastiche. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Musgrave Ritual" and "The Adventure of the Musgrave Ritual," 1893.`,
  },
  {
    id: 'bs1-r01',
    slug: 'bs1-r01-vr-in-the-plaster',
    name: 'V.R. in the Plaster',
    tier: 'Rare',
    shell: 'PRIME',
    parallel: 'ARCANA',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    narrativeBeat: 'moment-after',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Alex Ross photo-real-mythic posture as ceiling.

SUBJECT: Sherlock Holmes at 221B Baker Street, the moment-after. He has just shot "V.R." — Victoria Regina — into the sitting-room wall. He stands with the service revolver lowered at his side, barrel still trailing a thin thread of blue smoke. Tall, gaunt, angular — hawkish profile in three-quarter view. Shirtsleeves, waistcoat loose, briar pipe clenched at the jaw's corner.

SCENE: The 221B sitting room. The plaster wall at center-frame: "V.R." in fresh bullet-holes, each hole a dark star. A mandala of impact craters radiating from the letters — not literal, but the wallpaper pattern around the holes forms an accidental geometry, as if the shots were aimed by a mind that saw the pattern in the wall before it was made. The room otherwise: tobacco haze, chemistry equipment on the sideboard, stacked case-files. One lamp lit.

ICONOGRAPHY: The "V.R." in the plaster — the Lampblack of boredom-as-genius. The lowered revolver with its smoke-thread — the Spine gesture (precision-that-exceeds-its-occasion).

NARRATIVE BEAT: Moment-after — the shots already fired, the boredom not yet lifted. Holmes looking at the letters with the same expression he would use examining a crime scene.

COMPOSITION: Holmes at left two-thirds, three-quarter view. The "V.R." wall occupies the right third, full height. The composition creates a diptych — man and mark, artist and medium.

LIGHT: Single lamp at left, warm amber. The blue gun-smoke catches the lamplight as the only cool element. The bullet-holes are dark voids against the wallpaper — negative-space dread at domestic scale.

COLOR: Tobacco-amber, oxblood, smoke-blue. The "V.R." letters are the darkest points in the composition.

STAKES VISIBLE ON THE FACE: Not satisfaction. The faint distaste of a man whose mind ran faster than his entertainment.

OFF-FRAME IMPLICATION: Holmes's eyes are angled slightly to the left — Watson must be somewhere that way, watching.

STYLE: Alex Ross photo-real posture raised to MTG mythic-rare density. The mandala-geometry around the bullet-holes gestures at ARCANA Parallel without literalizing it. Victorian realism with a single non-naturalistic detail: the accidental geometry. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Adventure of the Musgrave Ritual," 1893; "The Adventure of the Yellow Face," 1893.`,
  },
  {
    id: 'bs1-u01',
    slug: 'bs1-u01-you-have-been-in-afghanistan',
    name: 'You Have Been in Afghanistan, I Perceive',
    tier: 'Ultimate',
    shell: 'PRIME',
    parallel: 'ARCANA',
    elemental: 'REASON',
    character: 'Sherlock Holmes + Watson',
    narrativeBeat: 'moment-of-decision',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan orbital composition + Alex Ross photo-real-mythic posture as ceiling. This is an Ultimate card — apex density and emotional charge.

SUBJECT: The first meeting. 221B Baker Street, 1881. Sherlock Holmes has just shaken Watson's hand and is already mid-deduction — eyes fixed on Watson's face, head slightly inclined, fingertips just released from Watson's right hand. Tall, gaunt, hawkish: the angular shoulder, the forward-lean of mid-deduction. Watson stands opposite — squared military bearing, the Afghanistan limp in the stance (weight left, right hip forward), brown wool coat with the white dust of Kandahar still in the creases. Watson's face shows the shock of the first deduction: the open expression of a man who was just read like a document.

SCENE: The chemical laboratory at St Bartholomew's Hospital where they first met — not 221B yet. Laboratory benches, chemical apparatus, a smell of acid caught in the painting (acid-stained wood, copper tubing, glass retorts). Morning light through tall sash windows, cold white London daylight. A second figure, Stamford, fading into background at far left, already becoming irrelevant.

ICONOGRAPHY: Holmes's hand still half-extended after the handshake, the deduction already happening in the fingers' last contact. Watson's notebook half-visible in his coat pocket — the chronicle about to begin.

NARRATIVE BEAT: The held instant of the first deduction. The split-second after "You have been in Afghanistan, I perceive" but before Watson has answered. The universe that existed before this meeting is ending.

COMPOSITION: Drew Struzan orbital — Holmes centered at mid-frame, Watson in three-quarter view at right, Stamford soft-focus at far left. The handshake position creates a diagonal axis across the lower third. Holmes's gaze as a vector arrow to Watson's face. The laboratory frames the encounter as a scene of evidence.

LIGHT: "Alvinized" — a single non-diegetic column of warm gold light falls on the handshake itself, sourced from nowhere in the laboratory. Cold window light for the room. The handshake is the only warm thing in the frame.

COLOR: Cold laboratory white, acid-yellow-green chemistry stains, the warm gold of the impossible light at the handshake. Watson's oxblood coat a warm anchor. The palette records the meeting as a chemical reaction — cold world, single warm catalyst.

STAKES VISIBLE ON THE FACE: Holmes: absolute certainty, the pleasure of a case so easy it's already solved. Watson: the open face of a man who didn't know he could be read — not quite frightened, not quite delighted. The first moment of the partnership.

OFF-FRAME IMPLICATION: The laboratory window behind Holmes looks out onto a cold London street — the city of cases, waiting.

STYLE: Alex Ross photo-real mythic posture at maximum density. Drew Struzan orbital composition. The non-diegetic light on the handshake is the single mythologizing gesture — everything else is hyperrealistic. No text, no letters, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "A Study in Scarlet," 1887, Chapter 2: "The Science of Deduction."`,
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
  // If still processing (Prefer: wait sometimes returns incomplete), poll.
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

async function renderMoment(moment) {
  const cardDir = path.join(ART_BASE, moment.id);
  await fs.mkdir(cardDir, { recursive: true });

  console.log(`\n▶ rendering ${moment.id} (${moment.name}) via Replicate FLUX 1.1 Pro Ultra…`);
  const t0 = Date.now();
  const { buf, seed } = await genReplicate(moment.prompt);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  // Convert to WebP quality 85, target ≤500 KB
  const webp = await sharp(buf).webp({ quality: 85 }).toBuffer();
  const kb = (webp.length / 1024).toFixed(0);

  if (webp.length > 500 * 1024) {
    // Re-encode at quality 70 if over limit
    const webp2 = await sharp(buf).webp({ quality: 70 }).toBuffer();
    console.log(`  ⚠ ${kb}KB > 500KB, re-encoding at q70: ${(webp2.length / 1024).toFixed(0)}KB`);
    await fs.writeFile(path.join(cardDir, 'v1.webp'), webp2);
  } else {
    await fs.writeFile(path.join(cardDir, 'v1.webp'), webp);
  }

  console.log(`  ✓ ${moment.id} — ${kb}KB — ${elapsed}s`);

  const entry = {
    id: `${moment.id}-v1`,
    setId: 'bs-1-221b',
    character: moment.character,
    name: moment.name,
    tier: moment.tier,
    shell: moment.shell,
    parallel: moment.parallel,
    elemental: moment.elemental,
    prompt: moment.prompt,
    provider: 'replicate',
    model: 'black-forest-labs/flux-1.1-pro-ultra',
    aspect: '2:3',
    seed: seed || null,
    costUsd: COST_PER_RENDER,
    generatedAt: new Date().toISOString(),
    path: `public/prototype-art/bs-1-221b/${moment.id}/v1.webp`,
    sizeKb: parseInt(kb, 10),
  };

  // Append to spend ledger
  const ledgerLine = JSON.stringify({
    ts: entry.generatedAt,
    provider: 'replicate',
    model: 'black-forest-labs/flux-1.1-pro-ultra',
    cardId: moment.id,
    costUsd: COST_PER_RENDER,
    cycleN: 2,
  }) + '\n';
  await fs.appendFile(LEDGER, ledgerLine);

  return entry;
}

async function main() {
  const newEntries = [];
  const errors = [];

  for (const moment of MOMENTS) {
    try {
      const entry = await renderMoment(moment);
      newEntries.push(entry);
    } catch (err) {
      console.error(`  ✗ ${moment.id}: ${err.message}`);
      errors.push({ id: moment.id, error: err.message });
    }
  }

  if (newEntries.length === 0) {
    console.error('\nNo renders succeeded. Aborting manifest update.');
    process.exit(1);
  }

  // Update manifest.json
  let manifest = [];
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(raw);
  } catch {
    // Fresh start
    manifest = [];
  }
  manifest.push(...newEntries);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`\n✅ Track A Cycle 2 complete:`);
  console.log(`   ${newEntries.length} renders succeeded, ${errors.length} failed`);
  console.log(`   Total cost: $${(newEntries.length * COST_PER_RENDER).toFixed(2)}`);
  console.log(`   Manifest: ${manifest.length} total entries`);

  if (errors.length > 0) {
    console.error('\nFailed renders:');
    errors.forEach((e) => console.error(`  - ${e.id}: ${e.error}`));
    process.exit(2);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
