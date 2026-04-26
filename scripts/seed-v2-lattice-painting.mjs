#!/usr/bin/env node
// FLUX-based generator for the Lattice oil-painting hero.
// Per Phase 5 §2.2 commission template.
//
// Output: public/v2/lattice-painting.webp

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const PROVIDER = (process.env.FLUX_PROVIDER || 'replicate').toLowerCase();
const OUT = path.resolve(process.cwd(), 'public/v2');

const PROMPT = `A 2:3 painted illustration in oil-on-canvas register of a multiverse cosmology — five colored Panes connected by faint glowing tethers. William Blake meets Paul Klee meets a Hubble image. Pre-Raphaelite jewel-tones. Five interlocking stone doorway-arches arranged in pentagram geometry, each arch containing a different threshold-environment: a gas-lit London street with fog (Pane 1, tobacco-amber and oxblood); an umber pomegranate-orchard at dusk (Pane 2, foxglove-violet and oxblood); an impossible-perspective hedge-maze with a half-dissolved Cheshire grin (Pane 3, ivory and Tenniel-engraving line); Carpathian peaks at storm with the Demeter-wreck silhouette below (Pane 4, ash-grey and Whitby-cliff-grey); an Egyptian columned hall in jackal-shadow with a single olive-branch (Pane 5, terracotta and bronze). Center of pentagram is empty dark space — a sixth Pane implied but unseen. Lampblack-residue drifting between arches, same drift-vector across all five — the Lattice as living glass. NO figures. NO text. NO central focal point — eye must move between arches. 2:3 vertical aspect, mobile-portrait readable. NEGATIVE: digital-painting render, Disney-style, MCU-style, Marvel-1602 register, video-game UI, fantasy-illustration mass-market, Frazetta, Vallejo, generic-pulp-paperback, no center figure, no visible logo or text, no CGI gloss.`;

async function genReplicate() {
  const KEY = process.env.REPLICATE_API_TOKEN;
  if (!KEY) throw new Error('REPLICATE_API_TOKEN missing');
  const submit = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'wait' },
      body: JSON.stringify({
        input: {
          prompt: PROMPT,
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

async function genBFL() {
  const KEY = process.env.BFL_API_KEY;
  if (!KEY) throw new Error('BFL_API_KEY missing');
  const submit = await fetch('https://api.bfl.ai/v1/flux-pro-1.1-ultra', {
    method: 'POST',
    headers: { 'x-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: PROMPT,
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

const t0 = Date.now();
console.log(`generating Lattice painting via FLUX provider=${PROVIDER}`);
const fn = GEN[PROVIDER];
if (!fn) throw new Error(`unknown FLUX_PROVIDER: ${PROVIDER}`);
const buf = await fn();
const webp = await sharp(buf).webp({ quality: 90 }).toBuffer();
await fs.mkdir(OUT, { recursive: true });
await fs.writeFile(path.join(OUT, 'lattice-painting.webp'), webp);
console.log(`OK lattice-painting (${(webp.length / 1024).toFixed(0)}KB) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
