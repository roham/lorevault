#!/usr/bin/env node
// FLUX-based regenerator for the 5 exemplar card images.
// Provider-agnostic: supports bfl.ml direct, fal.ai, and Replicate.
// Pick provider via FLUX_PROVIDER env var (default: bfl).
//
// Required env per provider:
//   bfl       — BFL_API_KEY (from api.bfl.ml)
//   fal       — FAL_KEY (from fal.ai)
//   replicate — REPLICATE_API_TOKEN (from replicate.com)
//
// Usage:
//   FLUX_PROVIDER=bfl BFL_API_KEY=... node scripts/seed-exemplars-flux.mjs
//
// Output: public/prototype-art/exemplars/{slug}.webp (overwrites the gpt-image-1 versions)

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PROVIDER = (process.env.FLUX_PROVIDER || 'bfl').toLowerCase();
const OUT = path.resolve(process.cwd(), 'public/prototype-art/exemplars');

// FLUX-tuned prompts: shorter, more visual, less prose-y than gpt-image-1 prompts.
// FLUX 1.1 Pro Ultra responds best to dense visual nouns + style anchor + scene direction.
const CARDS = [
  {
    slug: '1-watson-deduction',
    prompt: `Watson and Holmes at 221B Baker Street, 1881, oil painting in the manner of John Singer Sargent. Foreground Dr. Watson in a leather wing-chair, mid-thirties, tweed waistcoat, gold pocket-watch, hand resting on his Afghanistan-wounded thigh. Mid-ground Sherlock Holmes in profile at the mantelpiece, briar pipe at rest beside a service revolver, fingertips at his temple in the canonical thinking pose. Deerstalker on the hat-stand casting a lamp-shadow on oxblood wallpaper. Single warm gas-lamp source from camera-left, deep stage-right shadow. Tobacco-amber and oxblood palette. Painterly with photographic grounding. Late-Victorian domestic interior, fog at the window, books in oxblood. The split-second before a deduction lands. No modern objects.`,
  },
  {
    slug: '2-snow-black-neon',
    prompt: `Editorial portrait, ebony-skinned young man with cropped snow-white hair and blood-red lips, mid-twenties, accepting a half-bitten apple from a gloved hand entering frame from camera-left. Photoreal apple with a precise bite-edge. Near-future apothecary setting: chrome surfaces, cyan and magenta lighting, an open vitrine reading as a hospital cryotube. A queen's crown reflected on a chrome counter, slightly crooked. Synthwave palette — magenta key from camera-right, cyan rim from camera-left, deep black core shadows. The apple's red is the only warm tone. 2050s urban Grimm aesthetic, painterly under the synth-palette. Cinematic, three-quarter portrait, the apple on the diagonal. Light scan-lines barely visible. Not retro 80s.`,
  },
  {
    slug: '3-cheshire-arcana',
    prompt: `The Cheshire Cat dissolving into watercolor pigment, half-erased half-present. The grin sharp violet-pink, fully rendered; the body fading at the periphery. Yellow half-lidded eyes. A violet-pink-magenta stripe runs the visible flank. The tail loops around a hovering teacup at lower-right. Behind the cat's head a sacred-geometry mandala in gold-leaf filigree — twelve-fold rosette built of vertical cat-pupil shapes, two faint Latin sigils at cardinal points. Centered portrait, mandala filling upper two-thirds, body dispersing in lower third. Backlight from the mandala (gold), key fill from front (violet-tinted), self-illuminating cat at low intensity. Violet, magenta, gold-leaf, ivory. Painterly-ornate, the grin reading as the last thing left in the room.`,
  },
  {
    slug: '4-dracula-witness',
    prompt: `Photoreal documentary-cinema, Roger Deakins lighting at dusk. Count Dracula at the foot of a half-collapsed clocktower in a ruined post-electricity London. Tall, evening-dressed, suit two decades worn, dust-grey at the cuffs. Adding a vertical scratch with the back of a long fingernail to a tally crossed several thousand times across broken plaster. The collar at his throat catches the day's last warm light — the only warm tone. His shadow falls behind him along the rubble and does not match his posture; the shadow turned slightly to look at the camera, the man not. London skyline gone dark, no lit windows, fog and ash, broken dome of St Paul's on the southern horizon. Three-quarter long shot, Dracula in lower-left third, clocktower diagonal cuts the frame. Natural ambient dusk, no key light, photoreal grain, anamorphic lens flares only at the collar. Ash-grey, slate, dust-cream. Documentary register, not theatrical.`,
  },
  {
    slug: '5-persephone-saint-aether',
    prompt: `Persephone as a Byzantine icon at cosmic scale, frontal hieratic posture. Vertical division at the sternum: left half winter — ash-pale skin, dark robe, frost-rim at the hem, breath visible — right half spring — sun-warm skin, ochre robe, wheat-stalks woven in the hair, no breath. In her left palm six pomegranate seeds, three eaten visible at the lips, three offered toward the viewer. Standing on a polished threshold-stone catching the viewer's reflection. Halo of cosmic dust — aurora curtains, nebulae, divine particulate spiraling. Two faint silhouette-symbols flank the halo in dark smoke-pigment on gold: upper-left a descending Persephone with pomegranate, upper-right a winter-eternalised Persephone alone in ash. Vertical icon composition, mandorla of nebulae. God-rays, aurora-key lighting. The seeds the only literal warm-red. Ash-white, ochre-gold, pomegranate-red, deep-space violet, gold-dust particulate. Byzantine grammar reskinned to cosmic scale.`,
  },
];

// ----- Provider clients -----

async function genBFL(card) {
  const KEY = process.env.BFL_API_KEY;
  if (!KEY) throw new Error('BFL_API_KEY missing');
  // FLUX 1.1 Pro Ultra via api.bfl.ai (Black Forest Labs)
  // Submit -> poll for result.
  const submit = await fetch('https://api.bfl.ai/v1/flux-pro-1.1-ultra', {
    method: 'POST',
    headers: { 'x-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: card.prompt,
      aspect_ratio: '2:3',
      output_format: 'png',
      safety_tolerance: 5,
      raw: false,
    }),
  });
  if (!submit.ok) throw new Error(`bfl submit ${submit.status}: ${await submit.text()}`);
  const { id, polling_url } = await submit.json();
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(polling_url || `https://api.bfl.ai/v1/get_result?id=${id}`, {
      headers: { 'x-key': KEY, accept: 'application/json' },
    });
    const j = await poll.json();
    if (j.status === 'Ready') {
      const img = await fetch(j.result.sample);
      return Buffer.from(await img.arrayBuffer());
    }
    if (j.status === 'Error' || j.status === 'Content Moderated') {
      throw new Error(`bfl ${j.status}: ${JSON.stringify(j)}`);
    }
  }
  throw new Error('bfl poll timeout');
}

async function genFal(card) {
  const KEY = process.env.FAL_KEY;
  if (!KEY) throw new Error('FAL_KEY missing');
  const res = await fetch('https://fal.run/fal-ai/flux-pro/v1.1-ultra', {
    method: 'POST',
    headers: { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: card.prompt,
      aspect_ratio: '2:3',
      output_format: 'png',
      enable_safety_checker: true,
    }),
  });
  if (!res.ok) throw new Error(`fal ${res.status}: ${await res.text()}`);
  const j = await res.json();
  const url = j.images?.[0]?.url;
  if (!url) throw new Error(`fal: no image url in ${JSON.stringify(j).slice(0, 300)}`);
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

async function genReplicate(card) {
  const KEY = process.env.REPLICATE_API_TOKEN;
  if (!KEY) throw new Error('REPLICATE_API_TOKEN missing');
  const submit = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'wait' },
    body: JSON.stringify({
      input: {
        prompt: card.prompt,
        aspect_ratio: '2:3',
        output_format: 'png',
        safety_tolerance: 5,
        raw: false,
      },
    }),
  });
  if (!submit.ok) throw new Error(`replicate ${submit.status}: ${await submit.text()}`);
  const j = await submit.json();
  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error(`replicate: no output in ${JSON.stringify(j).slice(0, 300)}`);
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

const GEN = { bfl: genBFL, fal: genFal, replicate: genReplicate };

async function gen(card) {
  const fn = GEN[PROVIDER];
  if (!fn) throw new Error(`unknown FLUX_PROVIDER: ${PROVIDER}`);
  const buf = await fn(card);
  const webp = await sharp(buf).webp({ quality: 90 }).toBuffer();
  await fs.mkdir(OUT, { recursive: true });
  const fpath = path.join(OUT, `${card.slug}.webp`);
  await fs.writeFile(fpath, webp);
  console.log(`✓ ${card.slug} (${(webp.length / 1024).toFixed(0)}KB) via ${PROVIDER}`);
}

console.log(`generating ${CARDS.length} exemplars via FLUX provider=${PROVIDER}`);
const t0 = Date.now();
const results = await Promise.allSettled(CARDS.map(gen));
const fails = results.filter((r) => r.status === 'rejected');
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s — ok ${results.length - fails.length}/${results.length}`);
if (fails.length) {
  console.error('failures:');
  fails.forEach((f, i) => console.error(`  ${i}: ${f.reason}`));
  process.exit(1);
}
