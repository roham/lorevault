#!/usr/bin/env node
// Generates the 5 exemplar card images at public/prototype-art/exemplars/.
// Single-shot generator; the prompts are hardcoded from EXEMPLAR-CARDS.md.
// Cost: ~$0.85 (5 × gpt-image-1 high quality 1024x1536).

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('OPENAI_API_KEY missing'); process.exit(1); }

const OUT = path.resolve(process.cwd(), 'public/prototype-art/exemplars');

const CARDS = [
  {
    slug: '1-watson-deduction',
    prompt: `Painterly-epic register, "Watson chronicling, 1881" — the sitting room at 221B Baker Street at the precise moment Watson realises Holmes has read his entire military history off the angle of his cane. Foreground: Dr. John Watson, mid-thirties, gold-cased pocket watch on its chain, tweed waistcoat, sitting forward in a leather wing-chair, his left hand involuntarily on his left thigh — the Afghanistan limp made visible by posture, never by caption. Cane resting against the chair. Mid-ground: Sherlock Holmes in profile, briar pipe in his right hand at rest on the mantelpiece beside a service revolver, ash on the marble, his fingertips of the left hand touched at his temple in the canonical contemplative pose, deerstalker on the hat-stand throwing a lamp-shadow on the wallpaper that reads more deerstalker than the cap itself does. Background: gas-lamp at half-light, fog at the window, the bookshelf with case-files in oxblood. Composition: classical two-figure portrait, Watson three-quarter to camera, Holmes profile. Lighting: single warm gas-lamp source from camera-left, deep shadow on stage-right, the period of Doyle exactly. Palette: tobacco-amber, oxblood, gold-cased glints, deep shadow in the corners. Mood: domestic stillness one breath before a deduction lands. No modern objects in frame. No text overlays. Painterly with photographic grounding — the way Sargent painted a study, not a posed portrait.`,
  },
  {
    slug: '2-snow-black-neon',
    prompt: `NEON-parallel treatment — synthwave palette, modern-reimagined register, but the figure and Spine are gender-and-role inverted Snow White. Subject: a young man, mid-twenties, ebony skin in cool dusk tones, snow-white hair (cropped, modern), blood-red lips. He is offered, and is taking, a half-bitten apple from a gloved hand entering frame from camera-left. The apple is photoreal-rendered with a precise bite-edge. The setting is a near-future apothecary lit in magenta and cyan: chrome surfaces, an open vitrine that reads as a hospital cryotube where a glass coffin would be in the source tale. A queen's crown is visible as a reflection on a chrome counter — slightly crooked. Composition: three-quarter portrait, the apple on the diagonal entering frame, the cryotube in soft focus rear. Lighting: NEON parallel signature — magenta key from camera-right, cyan rim from camera-left, deep black core shadow. Palette: dusk-violet skin, ivory-white hair, blood-crimson lips, magenta atmospheric, cyan rim, chrome highlights, the apple's red the only warm tone. Synthwave grain, light scan-lines barely visible. Not retro-1980s — this is 2050s urban Grimm. Painterly under the synthwave palette, not pure CGI.`,
  },
  {
    slug: '3-cheshire-arcana',
    prompt: `ARCANA-parallel treatment — sacred-geometry mandala, gold-leaf filigree behind the figure's head, alchemical sigils glowing at the cardinal points. Subject: the Cheshire Cat in DREAM register — half-erased, half-present, the grin fully rendered but the cat's body fading at the periphery into watercolor pigment that has not yet decided whether to be a body or a stain. The grin: violet-pink, sharp, holding even where the cat is not. The eyes: yellow, half-lidded, knowing. A violet-pink-magenta stripe running the visible flank like a wound that healed into pattern. The tail loops once around a hovering teacup that should not be there. Behind the head: a full ARCANA mandala — sacred-geometry rosette built of stylized cat-pupil shapes (vertical slits arranged into a twelve-fold star), gold-leaf filigree edging, two faint Latinate sigils. Composition: centered portrait, mandala filling the upper two-thirds, the body dispersing in the lower third. Lighting: ARCANA-parallel signature — backlight from the mandala (gold), key fill from camera-front (violet-tinted), the body itself self-illuminating at low intensity. Palette: violet, magenta, gold-leaf, ivory, with negative space the colour of un-mixed ink. Painterly-ornate, the cat as icon and dissolution at once. The grin must read as the last thing left in the room.`,
  },
  {
    slug: '4-dracula-witness',
    prompt: `WITNESS-parallel treatment — Deakins/Lubezki photoreal documentary register, as if drone-captured at dusk by a journalist who survived past the grid going down. Subject: Count Dracula in HOLLOW register, alone in a ruined London where the electricity has been off for an unspecified duration. He is at the foot of a half-collapsed clocktower, evening-dressed but the suit is two decades worn and dust-grey at the cuffs. He is using the back of a long fingernail to add a single new vertical scratch to a tally already crossed several thousand times across the broken plaster of the tower wall — the count of nights. The collar-line at his throat catches the day's last warm light, the only warm tone in the otherwise drained palette. His shadow falls behind him along the rubble and does not match his posture — the shadow is turned slightly to look at the camera; the man himself is not. Background: a London skyline gone dark, no lit windows, fog and ash, the dome of St Paul's broken on the southern horizon. Composition: three-quarter long shot, Dracula occupying the lower-left third, the clocktower diagonal cutting the frame, the wall-tally visible at mid-height. Lighting: WITNESS-parallel signature — natural ambient dusk, no key light, photoreal grain, anamorphic lens flares only where the dying sun catches the collar. Palette: ash-grey, slate, dust-cream, the warm collar-light a single ember. Atmosphere: documentary, not theatrical.`,
  },
  {
    slug: '5-persephone-saint-aether',
    prompt: `AETHER-parallel treatment — aurora-cosmic backdrop, divine particulate, god-rays, the mythic mode at full saturation. SAINT register: Persephone-as-icon, the patron of return, after fans have prayed to her for two thousand years. Subject: Persephone, full-figure, frontal, hieratic in posture (the iconographic register of an Orthodox saint frescoed onto an apse, but cosmic-scale). She stands on a polished threshold-stone, vertical division at her sternum: her left half painted in winter register (ash-pale skin, dark robe, frost-rim at the hem, breath visible), her right half in spring register (sun-warm skin, ochre robe, wheat-stalks woven into the hair, no breath). In her left palm, six pomegranate seeds — three eaten visible at the lips, three offered toward the viewer. Behind her head: a halo not of gold but of cosmic dust, AETHER-parallel signature — aurora curtains, nebulae, divine particulate spiraling. Flanking the halo, two faint silhouette-symbols rendered as iconographic attributes — one at upper-left a Persephone descending with pomegranate-in-hand silhouette, one at upper-right a Persephone winter-eternalised silhouette alone in ash. Both symbols only, neither a live figure; both rendered in dark smoke-pigment on the gold. Composition: vertical icon, Persephone centred, mandorla of nebulae, threshold-stone at her feet catching the faint reflection of the viewer's own gaze. Lighting: AETHER-parallel god-rays, aurora-key, the seeds the only literal warm-red in the entire painting. Palette: ash-white, ochre-gold, pomegranate-red, deep-space violet, gold-dust particulate. Painterly-iconographic, Byzantine grammar reskinned to cosmic scale.`,
  },
];

class RateLimiter {
  constructor(max, win) { this.max = max; this.win = win; this.s = []; }
  async acquire() {
    while (true) {
      const now = Date.now();
      this.s = this.s.filter((t) => now - t < this.win);
      if (this.s.length < this.max) { this.s.push(now); return; }
      await new Promise((r) => setTimeout(r, this.win - (now - this.s[0]) + 200));
    }
  }
}
const limiter = new RateLimiter(5, 60_000);

async function gen(card) {
  await limiter.acquire();
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: card.prompt,
      size: '1024x1536',
      quality: 'high',
      n: 1,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) {
      const m = body.match(/try again in (\d+)s/i);
      const wait = (m ? parseInt(m[1], 10) : 15) + 1;
      console.log(`429 — waiting ${wait}s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      return gen(card);
    }
    throw new Error(`${res.status} ${body.slice(0, 300)}`);
  }
  const j = await res.json();
  const png = Buffer.from(j.data[0].b64_json, 'base64');
  const webp = await sharp(png).webp({ quality: 88 }).toBuffer();
  await fs.mkdir(OUT, { recursive: true });
  const fpath = path.join(OUT, `${card.slug}.webp`);
  await fs.writeFile(fpath, webp);
  console.log(`✓ ${card.slug} (${(webp.length / 1024).toFixed(0)}KB)`);
  return fpath;
}

console.log(`generating ${CARDS.length} exemplars at concurrency=5, rate=5/min`);
const t0 = Date.now();
await Promise.all(CARDS.map(gen));
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
