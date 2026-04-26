#!/usr/bin/env node
// FLUX-based generator for the 5 V2 marquee 1/1 ONE-OFF cards.
// Reuses the seed-exemplars-flux.mjs pattern.
//
// Usage:
//   FLUX_PROVIDER=replicate REPLICATE_API_TOKEN=... node scripts/seed-v2-marquees-flux.mjs
//
// Output: public/v2/cards/{slug}.webp

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PROVIDER = (process.env.FLUX_PROVIDER || 'replicate').toLowerCase();
const OUT = path.resolve(process.cwd(), 'public/v2/cards');

// 5 marquee 1/1 ONE-OFF cards — one per Universe.
// Prompts distilled from MANIFEST cells (BS Cell 100, EK-1 #20, WL-4-X1, GH-4 #20, GM-1 #20).
const CARDS = [
  {
    slug: 'bs-last-bow',
    prompt: `Hand-rendered illustration in 19th-century print register extending to 1914. Bespoke 1/1 commission — Sidney Paget cross-hatched ink-line + Frederic Dorr Steele Collier's color + Frank Wiles 1914-15 Strand cinematic framing, Drew Struzan poster-gravity + Caspar David Friedrich Rückenfigur on the down + Jeremy Jarvis card-art finish — all simultaneously at ceiling. Sussex Down 1914, chalk-down deduction-sharp-white + Persian-slipper-amber low evening sunlight + fog-blue distant sea + tobacco-stain-brown + Reichenbach-black + sparing gold-amber on a pocket watch. Sherlock Holmes alone at his Sussex bee-cottage; beekeeper's veil pushed back behind his head; lined face, eyes alert-and-tired, white hair at temples; a single bee landing on the brass rim of a magnifying lens that has begun to fog over (the Method's gentle obsolescence — load-bearing image of the entire Universe); the lens tilted 30 degrees in his hand. Sea distant fog-blue. Friedrich Rückenfigur — figure facing slightly away, three-quarters back. The only depicted moment of Holmes after the case is over. Painterly-not-photographic resolution. Faint Hamlet shadow-line watermark at frame margin.`,
  },
  {
    slug: 'ek-footnoter-reveals',
    prompt: `Maximum Rackham 1909 + Nielsen 1925 Hansel-and-Gretel gatefold tipped-in-plate density. The Footnoter's ink-stained hand entering the page-margin from below holding a quill. The page above the hand showing a cottage interior with Snow-Black, the Stepmother, seven dwarves, a bitten apple, a wall-mirror, a bone-comb, a stay-lace, all rendered as marginal sketches in iron-black ink. The Footnoter's face implied only as a shadow at the frame's bottom-edge. Foxglove-violet ground + gold-leaf accents on quill-tip and the apple's leaf + pewter-white margin-paper. Multi-plane depth, Pre-Raphaelite Burne-Jones-twilight cross-bleed. Iron-black + ash-grey + apple-oxblood + candle-amber palette. Signed Mode-2 marginalia in ballad-margin italic at lower-right. Lampblack-twig + bitten-apple + ghost-dagger set-glyph. Pratchett-grade Topsy fourth-wall break. NOT Disney Snow White color triad; NOT named-dwarf grief tableau; NOT animated-tear effect.`,
  },
  {
    slug: 'wl-alice-through-glass',
    prompt: `Tenniel 1871 Through the Looking-Glass mantelpiece-mirror frontispiece direct anchor. Domestic Victorian sitting-room. Mantelpiece mirror with mercury-silver mirror-surface that IS a Pane through which faint silhouettes are visible: Reichenbach-fog with a Cheshire grin in negative space; Black-Forest canopy with a Cheshire grin in negative space; the shadow under Mina's bed with a Cheshire grin in negative space; an asphodel-meadow horizon with a Cheshire grin in negative space. Alice mid-passage, half through the silver. Whistler-velvet outer + engraved-gilt + Lampblack-cosmic-cascade. The Glass-Polisher's hand just leaving the silver-frame at bottom-margin. Painterly mid-Victorian engraving register. Bandersnatch-violet deep-tone. NOT Burton 2010 mirror-as-pool; NOT Wachowski mirror-Matrix-liquid; no actor-likeness through the glass.`,
  },
  {
    slug: 'gh-ledger-keeper-opens',
    prompt: `Goya Sleep of Reason + Friedrich Wanderer Above the Sea of Fog + Doré Inferno + Theodor von Holst 1831 + Beardsley + Harry Clarke 1919 + Fuseli reference-stack at maximum density. Asha Caedmon (mid-thirties, ink-stained fingertips, Whitby-cliff-Grey shawl) at her desk in the abbey-ruin at Whitby; rain on the cliff-glass; the open ledger showing entries for every Spine in the Pane (Dracula, Demeter Captain, Frankenstein's Creature, Walton, Erik, Daroga, Jekyll, Hyde, Lanyon, Mina, Van Helsing, Mircalla Karnstein, Lucy, Renfield) and a final entry that reads "1 January 1927 — the cliff turns. I wait." Whitby panorama through the window (199 steps, North Sea spray). Candle-amber lantern + Whitby-cliff-grey + Geneva-glacier-blue distant-sea. The card is a painting. Broken-mirror-shard glyph carries forward in the rain-on-cliff-glass reflection. Asylum-Ledger Clinical typography on the ledger-page. NOT Branagh 1994 / Coppola 1992 / Hammer-Carmilla register; NOT actor-likeness.`,
  },
  {
    slug: 'gm-sixth-seed',
    prompt: `Bouguereau 1879 + Waterhouse + Burne-Jones Perseus cycle + Bernini 1621-25 marble photo-real reference-stack. Persephone (kore-into-queen) holding the seed she has not yet eaten; six pomegranate seeds in her open palm; Hades's fingers indenting her thigh in the Bernini Rape-of-Proserpina marble register (NOT erotic — load-bearing physical fact). Asphodel-rim. Demeter's silhouette outside the frame. Composite biome — meadow-into-throne-chamber visible at picture-plane. Bespoke 1/1 frame: engraved gilt + Whistler-velvet + Lampblack-cosmic-cascade. Pomegranate-red the only literal warm-red. Ash-white, ochre-gold, deep-space-violet. Hieratic frontal-icon composition. Persephone never smiles. Hades is never sad. NOT Lore Olympus webtoon-pink Persephone or blue-CEO Hades; NOT romance-aestheticization; NOT Marvel Olympian-as-Wall-Street-superhero; NOT actor-likeness.`,
  },
];

async function genReplicate(card) {
  const KEY = process.env.REPLICATE_API_TOKEN;
  if (!KEY) throw new Error('REPLICATE_API_TOKEN missing');
  const submit = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions',
    {
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
    }
  );
  if (!submit.ok) throw new Error(`replicate ${submit.status}: ${await submit.text()}`);
  const j = await submit.json();
  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error(`replicate: no output in ${JSON.stringify(j).slice(0, 300)}`);
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

async function genBFL(card) {
  const KEY = process.env.BFL_API_KEY;
  if (!KEY) throw new Error('BFL_API_KEY missing');
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

const GEN = { replicate: genReplicate, bfl: genBFL };

async function gen(card) {
  const fn = GEN[PROVIDER];
  if (!fn) throw new Error(`unknown FLUX_PROVIDER: ${PROVIDER}`);
  const buf = await fn(card);
  const webp = await sharp(buf).webp({ quality: 90 }).toBuffer();
  await fs.mkdir(OUT, { recursive: true });
  const fpath = path.join(OUT, `${card.slug}.webp`);
  await fs.writeFile(fpath, webp);
  console.log(`OK ${card.slug} (${(webp.length / 1024).toFixed(0)}KB) via ${PROVIDER}`);
}

console.log(`generating ${CARDS.length} v2 marquee cards via FLUX provider=${PROVIDER}`);
const t0 = Date.now();
const results = await Promise.allSettled(CARDS.map(gen));
const fails = results.filter((r) => r.status === 'rejected');
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s — ok ${results.length - fails.length}/${results.length}`);
if (fails.length) {
  console.error('failures:');
  fails.forEach((f, i) => console.error(`  ${i}: ${f.reason}`));
  process.exit(1);
}
