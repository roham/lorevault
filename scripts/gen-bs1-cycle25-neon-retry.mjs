#!/usr/bin/env node
// Cycle 25 NEON retry — bs1-r01-neon only. First run returned no output url.

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

// NEON uses a standalone prompt (not the Victorian base) — the base prompt's combined
// gun/revolver language + NEON block triggers NSFW detection at safety_tolerance 5.
// NEON is a full-setting reimagining; the 2040s scene establishes its own Lampblack.
const BASE_PROMPT = `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Alex Ross photo-real-mythic posture as ceiling.

SUBJECT: Sherlock Holmes in a 2040s London high-floor apartment — the moment-after. He has just inscribed "V.R." — Victoria Regina — into a smart-glass wall panel using a high-precision laser tool. He stands with the tool lowered at his side, the tip still faintly glowing from the heat of use. Tall, gaunt, angular — hawkish profile in three-quarter view. Dark coat, shirtsleeves. Briar pipe clenched at the jaw's corner.

SCENE: The 2040s apartment interior. The smart-glass wall panel at center-frame: "V.R." in laser-inscribed geometry, each letter surrounded by cracked-glass damage radiating from the inscription. The room: analytical chemistry equipment on the sideboard (holographic readout displays), stacked case-files, one warm desk lamp lit. City neon through the floor-to-ceiling windows.

ICONOGRAPHY: The "V.R." in the smart-glass — boredom-as-genius. The lowered precision tool, tip still warm — precision-that-exceeds-its-occasion. An 1880s oath inscribed into a 2040s surface: the anachronism is the Spine.

NARRATIVE BEAT: Moment-after — the inscription complete, the boredom not yet lifted. Holmes looking at the letters with the same expression he would use examining evidence.

COMPOSITION: Holmes at left two-thirds, three-quarter view. The "V.R." smart-glass panel occupies the right third, full height. Diptych — man and mark, artist and medium.

LIGHT: Warm desk lamp at left. City neon through the window — hot pink and cyan uplight from below. The inscribed "V.R." letters glow where the smart-glass panel was damaged.

STYLE: Alex Ross photo-real posture at MTG mythic-rare density. Synthwave palette: hot pink, electric cyan, neon violet. Cyber-modern realism. No text, no letters, no watermarks, no borders.`;

const NEON_BLOCK = `
DENSITY CLASS: Rare — Moderate at cyber-modern scale.

PARALLEL: NEON reinforcement — ensure ALL elements present:
1. Synthwave palette dominant: hot pink, electric cyan, neon violet. Smart-glass panel glows where inscribed.
2. 2040s cyber architecture: smart-glass display wall, holographic analytical chemistry displays on sideboard.
3. AR visor at rest on Holmes's forehead — not deployed; he was not observing, he was acting.
4. The inscribed "V.R." letters glow from within the cracked-glass damage. City neon from below casts colored uplight.
5. Holmes: tall, gaunt, hawkish. Precision tool lowered at side, tip still faintly warm. Briar pipe unchanged.
6. The anachronism is the Spine: Victoria Regina inscribed into a 2040s surface that has no Queen Victoria.`;

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

async function main() {
  const variantId = 'bs1-r01-neon';
  const cardDir = path.join(ART_BASE, variantId);
  await fs.mkdir(cardDir, { recursive: true });

  const fullPrompt = BASE_PROMPT + '\n' + NEON_BLOCK;

  console.log(`\n▶ rendering ${variantId} (bs1-r01 NEON) via Replicate FLUX 1.1 Pro Ultra…`);
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
  console.log(`  ✓ ${variantId} — ${(webp.length / 1024).toFixed(0)}KB — ${elapsed}s`);

  const generatedAt = new Date().toISOString();
  const entry = {
    id: `${variantId}-v1`,
    setId: 'bs-1-221b',
    character: 'Sherlock Holmes',
    name: 'V.R. in the Plaster',
    tier: 'Rare',
    shell: 'PRIME',
    parallel: 'NEON',
    elemental: 'REASON',
    prompt: fullPrompt,
    provider: 'replicate',
    model: 'black-forest-labs/flux-1.1-pro-ultra',
    aspect: '2:3',
    seed: seed || null,
    costUsd: COST_PER_RENDER,
    generatedAt,
    path: `public/prototype-art/bs-1-221b/${variantId}/v1.webp`,
    sizeKb: Math.round(webp.length / 1024),
  };

  await fs.appendFile(
    LEDGER,
    JSON.stringify({
      ts: generatedAt, provider: 'replicate',
      model: 'black-forest-labs/flux-1.1-pro-ultra',
      cardId: variantId, costUsd: COST_PER_RENDER, cycleN: CYCLE,
    }) + '\n'
  );

  const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(raw);
  manifest.push(entry);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`\n✅ bs1-r01-neon retry complete: ${(webp.length / 1024).toFixed(0)}KB`);
  console.log(`   Manifest: ${manifest.length} total entries`);
  console.log(`   Rare tier: 4/20 done`);
}

main().catch(e => { console.error(e); process.exit(1); });
