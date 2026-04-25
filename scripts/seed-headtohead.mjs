#!/usr/bin/env node
// Head-to-head exemplar generator.
// Same prompt → both providers in parallel.
// Output: public/prototype-art/headtohead/{slug}-flux.webp and {slug}-openai.webp
//
// Cost: 5 prompts × 2 providers = 10 images = ~$1.05
//   FLUX 1.1 Pro Ultra: $0.04/image
//   OpenAI gpt-image-1 high 1024x1536: $0.17/image
//
// Env required:
//   REPLICATE_API_TOKEN
//   OPENAI_API_KEY

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const REPLICATE = process.env.REPLICATE_API_TOKEN;
const OPENAI = process.env.OPENAI_API_KEY;
if (!REPLICATE) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }
if (!OPENAI) { console.error('OPENAI_API_KEY missing'); process.exit(1); }

const OUT = path.resolve(process.cwd(), 'public/prototype-art/headtohead');

// SAME prompts the existing FLUX exemplars used. Fair head-to-head.
const CARDS = [
  {
    slug: '1-watson-deduction',
    label: 'Watson at 221B',
    prompt: `Watson and Holmes at 221B Baker Street, 1881, oil painting in the manner of John Singer Sargent. Foreground Dr. Watson in a leather wing-chair, mid-thirties, tweed waistcoat, gold pocket-watch, hand resting on his Afghanistan-wounded thigh. Mid-ground Sherlock Holmes in profile at the mantelpiece, briar pipe at rest beside a service revolver, fingertips at his temple in the canonical thinking pose. Deerstalker on the hat-stand casting a lamp-shadow on oxblood wallpaper. Single warm gas-lamp source from camera-left, deep stage-right shadow. Tobacco-amber and oxblood palette. Painterly with photographic grounding. Late-Victorian domestic interior, fog at the window, books in oxblood. The split-second before a deduction lands. No modern objects.`,
  },
  {
    slug: '2-snow-black-neon',
    label: 'Snow Black, NEON',
    prompt: `Editorial portrait, ebony-skinned young man with cropped snow-white hair and blood-red lips, mid-twenties, accepting a half-bitten apple from a gloved hand entering frame from camera-left. Photoreal apple with a precise bite-edge. Near-future apothecary setting: chrome surfaces, cyan and magenta lighting, an open vitrine reading as a hospital cryotube. A queen's crown reflected on a chrome counter, slightly crooked. Synthwave palette — magenta key from camera-right, cyan rim from camera-left, deep black core shadows. The apple's red is the only warm tone. 2050s urban Grimm aesthetic, painterly under the synth-palette. Cinematic, three-quarter portrait, the apple on the diagonal. Light scan-lines barely visible. Not retro 80s.`,
  },
  {
    slug: '3-cheshire-arcana',
    label: 'Cheshire, ARCANA',
    prompt: `The Cheshire Cat dissolving into watercolor pigment, half-erased half-present. The grin sharp violet-pink, fully rendered; the body fading at the periphery. Yellow half-lidded eyes. A violet-pink-magenta stripe runs the visible flank. The tail loops around a hovering teacup at lower-right. Behind the cat's head a sacred-geometry mandala in gold-leaf filigree — twelve-fold rosette built of vertical cat-pupil shapes, two faint Latin sigils at cardinal points. Centered portrait, mandala filling upper two-thirds, body dispersing in lower third. Backlight from the mandala (gold), key fill from front (violet-tinted), self-illuminating cat at low intensity. Violet, magenta, gold-leaf, ivory. Painterly-ornate, the grin reading as the last thing left in the room.`,
  },
  {
    slug: '4-dracula-witness',
    label: 'Dracula, WITNESS',
    prompt: `Photoreal documentary-cinema, Roger Deakins lighting at dusk. Count Dracula at the foot of a half-collapsed clocktower in a ruined post-electricity London. Tall, evening-dressed, suit two decades worn, dust-grey at the cuffs. Adding a vertical scratch with the back of a long fingernail to a tally crossed several thousand times across broken plaster. The collar at his throat catches the day's last warm light — the only warm tone. His shadow falls behind him along the rubble and does not match his posture; the shadow turned slightly to look at the camera, the man not. London skyline gone dark, no lit windows, fog and ash, broken dome of St Paul's on the southern horizon. Three-quarter long shot, Dracula in lower-left third, clocktower diagonal cuts the frame. Natural ambient dusk, no key light, photoreal grain, anamorphic lens flares only at the collar. Ash-grey, slate, dust-cream. Documentary register, not theatrical.`,
  },
  {
    slug: '5-persephone-saint-aether',
    label: 'Persephone, SAINT × AETHER',
    prompt: `Persephone as a Byzantine icon at cosmic scale, frontal hieratic posture. Vertical division at the sternum: left half winter — ash-pale skin, dark robe, frost-rim at the hem, breath visible — right half spring — sun-warm skin, ochre robe, wheat-stalks woven in the hair, no breath. In her left palm six pomegranate seeds, three eaten visible at the lips, three offered toward the viewer. Standing on a polished threshold-stone catching the viewer's reflection. Halo of cosmic dust — aurora curtains, nebulae, divine particulate spiraling. Two faint silhouette-symbols flank the halo in dark smoke-pigment on gold: upper-left a descending Persephone with pomegranate, upper-right a winter-eternalised Persephone alone in ash. Vertical icon composition, mandorla of nebulae. God-rays, aurora-key lighting. The seeds the only literal warm-red. Ash-white, ochre-gold, pomegranate-red, deep-space violet, gold-dust particulate. Byzantine grammar reskinned to cosmic scale.`,
  },
];

async function genReplicate(card) {
  const submit = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${REPLICATE}`, 'Content-Type': 'application/json', Prefer: 'wait' },
    body: JSON.stringify({
      input: { prompt: card.prompt, aspect_ratio: '2:3', output_format: 'png', safety_tolerance: 5, raw: false },
    }),
  });
  if (!submit.ok) throw new Error(`replicate ${submit.status}: ${await submit.text()}`);
  const j = await submit.json();
  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error(`replicate: no output`);
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

async function genOpenAI(card) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-image-1', prompt: card.prompt, size: '1024x1536', quality: 'high', n: 1 }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) {
      const m = body.match(/try again in (\d+)s/i);
      const wait = (m ? parseInt(m[1], 10) : 15) + 1;
      console.log(`openai 429 — waiting ${wait}s for ${card.slug}`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      return genOpenAI(card);
    }
    throw new Error(`openai ${res.status}: ${body.slice(0, 200)}`);
  }
  const j = await res.json();
  return Buffer.from(j.data[0].b64_json, 'base64');
}

async function saveWebp(buf, slug, provider) {
  const webp = await sharp(buf).webp({ quality: 90 }).toBuffer();
  await fs.mkdir(OUT, { recursive: true });
  const fpath = path.join(OUT, `${slug}-${provider}.webp`);
  await fs.writeFile(fpath, webp);
  return { fpath, bytes: webp.length };
}

async function genPair(card) {
  const t0 = Date.now();
  const [fluxResult, openaiResult] = await Promise.allSettled([
    genReplicate(card).then((b) => saveWebp(b, card.slug, 'flux')),
    genOpenAI(card).then((b) => saveWebp(b, card.slug, 'openai')),
  ]);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  const fluxOk = fluxResult.status === 'fulfilled';
  const openaiOk = openaiResult.status === 'fulfilled';
  console.log(`[${dt}s] ${card.slug} — flux ${fluxOk ? '✓' : `✗ ${fluxResult.reason}`} / openai ${openaiOk ? '✓' : `✗ ${openaiResult.reason}`}`);
  return { card, fluxOk, openaiOk, fluxBytes: fluxOk ? fluxResult.value.bytes : 0, openaiBytes: openaiOk ? openaiResult.value.bytes : 0 };
}

console.log(`generating ${CARDS.length} pairs (${CARDS.length * 2} images total)`);
const t0 = Date.now();
const results = await Promise.all(CARDS.map(genPair));
const totalSec = ((Date.now() - t0) / 1000).toFixed(1);

// Manifest for the head-to-head page
const manifest = {
  generatedAt: new Date().toISOString(),
  pairs: results.filter((r) => r.fluxOk && r.openaiOk).map((r) => ({
    id: r.card.slug,
    label: r.card.label,
    prompt: r.card.prompt,
    flux: { path: `/prototype-art/headtohead/${r.card.slug}-flux.webp`, bytes: r.fluxBytes, provider: 'replicate-flux-1.1-pro-ultra' },
    openai: { path: `/prototype-art/headtohead/${r.card.slug}-openai.webp`, bytes: r.openaiBytes, provider: 'openai-gpt-image-1' },
  })),
  failures: results.filter((r) => !r.fluxOk || !r.openaiOk).map((r) => ({ id: r.card.slug, fluxOk: r.fluxOk, openaiOk: r.openaiOk })),
};
await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`done in ${totalSec}s — ${manifest.pairs.length} complete pairs, ${manifest.failures.length} failures`);
