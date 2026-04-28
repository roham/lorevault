#!/usr/bin/env node
// lorevault/scripts/render-lorevault.mjs
// LoreVault MLP — Collectible Asset Render Pipeline (Track-D)
// Run: node scripts/render-lorevault.mjs [options]
//
// Options:
//   --force              Re-render even if PNG exists
//   --dry-run            Print plan without calling APIs
//   --pane=<pane>        Filter to one pane
//   --card=<card_id>     Filter to one card id
//   --no-wait            Do not poll for manifest, use test manifest if missing
//   --max-cards=<n>      Cap number of cards processed (debug)
//   --variants=a,b,c     Subset of {silhouette,hero,gesture}
//   --prefer=<openai|flux>  Force a model preference for all variants

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------- CLI ----------------
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');
const NO_WAIT = args.includes('--no-wait');
const PANE_FILTER = args.find(a => a.startsWith('--pane='))?.split('=')[1];
const CARD_FILTER = args.find(a => a.startsWith('--card='))?.split('=')[1];
const MAX_CARDS = parseInt(args.find(a => a.startsWith('--max-cards='))?.split('=')[1] || '0', 10);
const VARIANTS_ARG = args.find(a => a.startsWith('--variants='))?.split('=')[1];
const PREFER = args.find(a => a.startsWith('--prefer='))?.split('=')[1]; // 'openai' | 'flux'
const VARIANTS = (VARIANTS_ARG ? VARIANTS_ARG.split(',') : ['silhouette', 'hero', 'gesture'])
  .map(v => v.trim()).filter(Boolean);

// ---------------- Paths ----------------
const LOREVAULT_ROOT = join(__dirname, '..');
const MANIFEST_PATH = join(LOREVAULT_ROOT, 'src/app/v3/moodboard/_manifest.json');
const CARDS_DIR = join(LOREVAULT_ROOT, 'public/v3/cards');
const INDEX_PATH = join(CARDS_DIR, '_index.json');
const ERRORS_PATH = join(CARDS_DIR, '_render-errors.jsonl');
const STATUS_PATH = join(CARDS_DIR, '_status.json');

// ---------------- Credentials ----------------
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

// ---------------- Pane visual contracts ----------------
const PANE_VISUAL_CONTRACTS = {
  'lud-border':
    'warm Art Nouveau civic interior, honey-amber light, beautiful architecture with one element faintly wrong, no visible character faces, Mirrlees aesthetic',
  'old-ones-persist':
    'infinite recursive institutional hallway, cold bureaucratic light, Borges-grade architectural repetition, dread implied through geometry not content',
  'sinterklaas-reigns':
    'cold paper light, winter civic space, monochromatic except one warm detail, ledger-witnessing stillness',
  'true-names-persist':
    'deep sea-green palette, earned ancient precision, negative space weighted, oceanic depth implied, minimal props, Le Guin aesthetic',
  'holmes-canonical-london':
    'Victorian gaslit interior, amber-grey palette, confident precise line, observation-implied, no dramatic poses, Doyle aesthetic',
};

const NEGATIVE_PROMPT =
  'no swords, no glowing weapons, no fantasy-default tropes, no stock mythic imagery, no anime aesthetics, no logo overlays, no visible text in image, no lens flare, no dramatic fire effects, no generic fantasy art, no purple magical energy';

// ---------------- IO helpers ----------------
function ensureDir(p) { mkdirSync(p, { recursive: true }); }

function loadIndex() {
  if (existsSync(INDEX_PATH)) {
    try { return JSON.parse(readFileSync(INDEX_PATH, 'utf-8')); } catch { return []; }
  }
  return [];
}

function saveIndex(index) {
  ensureDir(CARDS_DIR);
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
}

function logError(cardId, variant, error, prompt) {
  ensureDir(CARDS_DIR);
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(), cardId, variant, error, prompt,
  }) + '\n';
  appendFileSync(ERRORS_PATH, entry);
}

function writeStatus(obj) {
  ensureDir(CARDS_DIR);
  writeFileSync(STATUS_PATH, JSON.stringify(obj, null, 2));
}

// ---------------- Manifest loader ----------------
async function waitForManifest() {
  const maxAttempts = NO_WAIT ? 1 : 30;
  for (let i = 0; i < maxAttempts; i++) {
    if (existsSync(MANIFEST_PATH)) {
      try {
        const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
        if (Array.isArray(manifest) && manifest.length > 0) {
          console.log(`[manifest] loaded ${manifest.length} cards from ${MANIFEST_PATH}`);
          return { source: 'track-b', cards: manifest };
        }
        console.log('[manifest] file present but empty/non-array, waiting...');
      } catch (e) {
        console.log(`[manifest] file present but invalid JSON: ${e.message}, waiting...`);
      }
    }
    if (NO_WAIT) break;
    console.log(`[manifest] waiting ... attempt ${i + 1}/${maxAttempts}`);
    await new Promise(r => setTimeout(r, 60000));
  }
  console.log('[manifest] not available — using built-in test manifest');
  return { source: 'test-fallback', cards: createTestManifest() };
}

function createTestManifest() {
  // Wave-1 + Wave-2 (Pierre-Menard triptych) test cards.
  const PM_SUBJECT =
    'A figure at a threshold, refusing to cross without understanding what they already know. The figure is a silhouette, no visible face. Architectural threshold prominent.';
  return [
    // ---------- Wave 1 ----------
    {
      id: 'lud-border-001', pane: 'lud-border', name: 'The Customs Ledger',
      render_briefs: {
        silhouette: 'A civic building entrance at dusk, Art Nouveau gate, honey-amber light filtering through, warm gold tones, architectural silhouette, no people visible',
        hero: 'Inside a civic customs hall, warm amber light through high windows, Art Nouveau ironwork, a single figure in silhouette at a counter, warm honey-gold palette, no face visible',
        gesture_detail: 'A hand completing a form on parchment, close detail, warm amber light on paper, ink and pen tip, honey-gold tones, bureaucratic precision, no face',
      },
    },
    {
      id: 'lud-border-002', pane: 'lud-border', name: 'The Honey-Light Threshold',
      render_briefs: {
        silhouette: 'An Art Nouveau threshold, ornate ironwork casting amber shadows on tile, no figures, warm honey light from beyond',
        hero: 'A wide civic vestibule, Art Nouveau pillars, two seated figures in silhouette waiting, honey-amber light from a single tall window, faintly wrong proportions in one column',
        gesture_detail: 'A close-up of an embossed brass civic seal being pressed onto a document, honey-gold light, fine engraved detail, warm tones',
      },
    },
    {
      id: 'old-ones-persist-001', pane: 'old-ones-persist', name: 'The Catalogue Entry',
      render_briefs: {
        silhouette: 'An infinite library hallway, cold institutional light, recursive shelving extending to horizon, Borges aesthetic, architectural horror in geometry, no figures',
        hero: 'Looking down an infinite library corridor, cold fluorescent light, identical shelves, a distant figure cataloguing in silhouette, dread in the repetition',
        gesture_detail: 'A hand placing a book in an infinite shelf, cold light, precise movement, infinite identical shelves behind extending into darkness',
      },
    },
    {
      id: 'old-ones-persist-002', pane: 'old-ones-persist', name: 'The Form, Stamped Forever',
      render_briefs: {
        silhouette: 'Endless ranks of identical desks under cold light, vanishing point geometry, no figures, paper stacks, Borgesian repetition',
        hero: 'A single bureaucrat in silhouette stamping a document, surrounded by identical empty desks vanishing into cold light, no face shown',
        gesture_detail: 'A close-up of a rubber stamp pressing ink on a form, cold institutional fluorescent light, sharp shadow, paper grain visible',
      },
    },
    {
      id: 'sinterklaas-reigns-001', pane: 'sinterklaas-reigns', name: 'The Witnessing Ledger',
      render_briefs: {
        silhouette: 'A winter civic chamber, cold paper-white light, a single open ledger on a tall desk, monochrome except one warm honey detail',
        hero: 'A winter hall, cold paper light from clerestory windows, an open ledger on a long oak table, snow-flakes on the sill, one warm candle as the lone color note',
        gesture_detail: 'A hand turning a ledger page, ink and quill nearby, cold winter light, monochrome except one warm gold buckle, paper texture visible',
      },
    },
    {
      id: 'true-names-persist-001', pane: 'true-names-persist', name: 'The Naming Stone',
      render_briefs: {
        silhouette: 'A weathered standing stone at sea cliff edge, deep sea-green palette, oceanic depth, minimal composition, ancient precision',
        hero: 'A figure in silhouette before a name-carved standing stone, deep sea-green light, weighted negative space, distant ocean, Le Guin aesthetic',
        gesture_detail: 'A hand tracing carved letters on weathered stone, sea-green tones, salt and lichen on stone surface, fine carved detail',
      },
    },
    {
      id: 'holmes-canonical-london-001', pane: 'holmes-canonical-london', name: 'The Observed Detail',
      render_briefs: {
        silhouette: 'A Victorian gaslit street at fog-dusk, gas lamps glowing amber-grey, wrought iron rail, no figures, confident precise line',
        hero: 'A Victorian study interior, gas lamp on desk, amber-grey palette, a single figure in silhouette examining a document, no dramatic pose',
        gesture_detail: 'A hand holding a magnifying lens over a small object on a desk, gas-lit amber light, precise observation, fine detail',
      },
    },
    // ---------- Wave 2: Pierre-Menard triptych — same subject, different pane ----------
    {
      id: 'pm-threshold-lud', pane: 'lud-border', name: 'Pierre-Menard: Threshold (Lud)', pierre_menard: true,
      render_briefs: {
        silhouette: PM_SUBJECT + ' Silhouette only, framed by an Art Nouveau honey-amber threshold.',
        hero: PM_SUBJECT + ' Pane lighting: warm Art Nouveau civic interior, honey-amber light, Mirrlees aesthetic.',
        gesture_detail: 'Close-up of the same figure\'s hand resting on the threshold edge — honey-amber light, ornate Art Nouveau ironwork, no face.',
      },
    },
    {
      id: 'pm-threshold-old-ones', pane: 'old-ones-persist', name: 'Pierre-Menard: Threshold (Old-Ones)', pierre_menard: true,
      render_briefs: {
        silhouette: PM_SUBJECT + ' Silhouette only, framed by an infinite recursive bureaucratic threshold.',
        hero: PM_SUBJECT + ' Pane lighting: cold infinite institutional hallway, recursive shelving, Borges aesthetic.',
        gesture_detail: 'Close-up of the same figure\'s hand resting on the threshold edge — cold institutional fluorescent light, identical surfaces extending behind, no face.',
      },
    },
    {
      id: 'pm-threshold-sinterklaas', pane: 'sinterklaas-reigns', name: 'Pierre-Menard: Threshold (Sinterklaas)', pierre_menard: true,
      render_briefs: {
        silhouette: PM_SUBJECT + ' Silhouette only, framed by a cold winter civic threshold, paper-white light.',
        hero: PM_SUBJECT + ' Pane lighting: cold paper light, winter civic space, monochrome except one warm detail.',
        gesture_detail: 'Close-up of the same figure\'s hand resting on the threshold edge — cold winter paper-white light, ledger and quill on a sill, one warm gold buckle, no face.',
      },
    },
  ];
}

// ---------------- OpenAI gpt-image-2 ----------------
async function renderWithOpenAI(prompt, size = '1024x1024') {
  if (!OPENAI_KEY) return { ok: false, reason: 'no_openai_key' };
  const fullPrompt =
    `${prompt}. Style: masterwork digital illustration, painterly, high detail. ${NEGATIVE_PROMPT}.`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-2',
          prompt: fullPrompt,
          n: 1,
          size,
          // gpt-image-2 returns b64 by default; do NOT pass response_format (unsupported)
        }),
      });

      if (response.status === 429) {
        const wait = attempt * 30000;
        console.log(`    [openai] 429 rate limit, waiting ${wait / 1000}s...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }

      const data = await response.json();
      if (data?.data?.[0]?.b64_json) {
        return { ok: true, buffer: Buffer.from(data.data[0].b64_json, 'base64'), model: 'gpt-image-2', size };
      }
      if (data?.data?.[0]?.url) {
        // Fallback: fetch URL
        const imgRes = await fetch(data.data[0].url);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        return { ok: true, buffer: buf, model: 'gpt-image-2', size };
      }
      const errMsg = data?.error?.message || JSON.stringify(data).slice(0, 300);
      console.error(`    [openai] attempt ${attempt} error: ${errMsg}`);
      await new Promise(r => setTimeout(r, attempt * 2000));
    } catch (e) {
      console.error(`    [openai] attempt ${attempt} threw: ${e.message}`);
      await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
  return { ok: false, reason: 'openai_3x_failed' };
}

// ---------------- Replicate FLUX 1.1-pro ----------------
async function renderWithFLUX(prompt) {
  if (!REPLICATE_TOKEN) return { ok: false, reason: 'no_replicate_token' };
  const fullPrompt = `${prompt}. Masterwork digital illustration. High detail, painterly.`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const createRes = await fetch(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${REPLICATE_TOKEN}`,
            'Content-Type': 'application/json',
            'Prefer': 'wait=60',
          },
          body: JSON.stringify({
            input: { prompt: fullPrompt, aspect_ratio: '1:1', output_format: 'png', safety_tolerance: 5 },
          }),
        }
      );

      const prediction = await createRes.json();
      if (!prediction.id) {
        console.error(`    [flux] create failed: ${prediction.detail || prediction.error || JSON.stringify(prediction).slice(0,200)}`);
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }

      // If wait=60 already gave us output, use it.
      let status = prediction;
      if (status.status !== 'succeeded' && status.status !== 'failed') {
        const pollUrl = `https://api.replicate.com/v1/predictions/${prediction.id}`;
        for (let poll = 0; poll < 60; poll++) {
          await new Promise(r => setTimeout(r, 5000));
          const pollRes = await fetch(pollUrl, {
            headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` },
          });
          status = await pollRes.json();
          if (status.status === 'succeeded' || status.status === 'failed' || status.status === 'canceled') break;
        }
      }

      if (status.status === 'succeeded') {
        const url = Array.isArray(status.output) ? status.output[0] : status.output;
        if (!url) {
          console.error(`    [flux] succeeded but no output url`);
          continue;
        }
        const imgRes = await fetch(url);
        const buf = Buffer.from(await imgRes.arrayBuffer());
        return { ok: true, buffer: buf, model: 'flux-1.1-pro' };
      }
      console.error(`    [flux] attempt ${attempt} status=${status.status} err=${status.error || ''}`);
    } catch (e) {
      console.error(`    [flux] attempt ${attempt} threw: ${e.message}`);
      await new Promise(r => setTimeout(r, attempt * 3000));
    }
  }
  return { ok: false, reason: 'flux_3x_failed' };
}

// ---------------- Render one variant ----------------
async function renderVariant(card, variant, index) {
  const cardId = card.id;
  const pane = card.pane;
  const outputDir = join(CARDS_DIR, pane, cardId);
  const outputPath = join(outputDir, `${variant}.png`);

  // Idempotency: skip if file exists, has reasonable size, and we are not forcing.
  if (!FORCE && existsSync(outputPath)) {
    try {
      const sz = statSync(outputPath).size;
      if (sz > 50000) {
        console.log(`  - ${cardId}/${variant} exists (${Math.round(sz/1024)}KB), skip`);
        return 'skipped';
      }
    } catch {}
  }

  if (DRY_RUN) {
    console.log(`  [dry-run] ${cardId}/${variant}`);
    return 'dry';
  }

  const briefKey = variant === 'gesture' ? 'gesture_detail' : variant;
  const renderBrief = card.render_briefs?.[briefKey];
  if (!renderBrief) {
    console.log(`  ! ${cardId}/${variant} no render_brief.${briefKey}`);
    return 'no_brief';
  }

  const paneContract = PANE_VISUAL_CONTRACTS[pane] || '';
  const fullPrompt = `${renderBrief}. Pane visual contract: ${paneContract}.`;

  console.log(`  > ${cardId}/${variant} ...`);

  // Model selection:
  //   --prefer=openai  → always openai first
  //   --prefer=flux    → always flux first
  //   default          → flux for gesture (fine detail), openai for silhouette/hero
  let primary = 'openai';
  if (PREFER === 'flux') primary = 'flux';
  else if (PREFER === 'openai') primary = 'openai';
  else if (variant === 'gesture' && REPLICATE_TOKEN) primary = 'flux';

  let result;
  if (primary === 'flux') {
    result = await renderWithFLUX(fullPrompt);
    if (!result.ok && OPENAI_KEY) {
      console.log(`    [fallback] flux failed (${result.reason}), trying openai`);
      result = await renderWithOpenAI(fullPrompt);
    }
  } else {
    result = await renderWithOpenAI(fullPrompt);
    if (!result.ok && REPLICATE_TOKEN) {
      console.log(`    [fallback] openai failed (${result.reason}), trying flux`);
      result = await renderWithFLUX(fullPrompt);
    }
  }

  const indexEntry = {
    card_id: cardId,
    pane,
    variant,
    model: result.ok ? result.model : (result.reason || 'unknown'),
    prompt: fullPrompt,
    timestamp: new Date().toISOString(),
    file_path: `public/v3/cards/${pane}/${cardId}/${variant}.png`,
    status: 'failed',
    file_size_bytes: 0,
  };

  if (result.ok && result.buffer && result.buffer.length > 50000) {
    ensureDir(outputDir);
    writeFileSync(outputPath, result.buffer);
    indexEntry.status = 'complete';
    indexEntry.file_size_bytes = result.buffer.length;
    console.log(`    OK ${cardId}/${variant} (${Math.round(result.buffer.length/1024)}KB) via ${result.model}`);
  } else if (result.ok && result.buffer) {
    console.log(`    SMALL ${cardId}/${variant} (${result.buffer.length}B) — likely error image`);
    logError(cardId, variant, `image too small (${result.buffer.length}B), likely solid-color error`, fullPrompt);
  } else {
    console.log(`    FAIL ${cardId}/${variant} (${result.reason})`);
    logError(cardId, variant, `all render attempts failed: ${result.reason}`, fullPrompt);
  }

  // Update index in place (by card_id+variant)
  const i = index.findIndex(e => e.card_id === cardId && e.variant === variant);
  if (i >= 0) index[i] = indexEntry; else index.push(indexEntry);
  saveIndex(index);
  return indexEntry.status;
}

// ---------------- Main ----------------
async function main() {
  console.log('=== LoreVault Render Pipeline ===');
  console.log(`OpenAI:    ${OPENAI_KEY ? 'available' : 'MISSING'}`);
  console.log(`Replicate: ${REPLICATE_TOKEN ? 'available' : 'MISSING'}`);
  console.log(`Force=${FORCE} DryRun=${DRY_RUN} NoWait=${NO_WAIT} Variants=${VARIANTS.join(',')}`);
  if (PANE_FILTER) console.log(`Pane filter: ${PANE_FILTER}`);
  if (CARD_FILTER) console.log(`Card filter: ${CARD_FILTER}`);
  if (PREFER) console.log(`Prefer: ${PREFER}`);

  ensureDir(CARDS_DIR);
  const { source, cards } = await waitForManifest();
  console.log(`[manifest source] ${source}`);
  const index = loadIndex();

  let filtered = cards;
  if (PANE_FILTER) filtered = filtered.filter(c => c.pane === PANE_FILTER);
  if (CARD_FILTER) filtered = filtered.filter(c => c.id === CARD_FILTER);
  if (MAX_CARDS > 0) filtered = filtered.slice(0, MAX_CARDS);

  console.log(`[plan] ${filtered.length} cards × ${VARIANTS.length} variants = ${filtered.length * VARIANTS.length} renders`);

  const stats = { complete: 0, failed: 0, skipped: 0, dry: 0, no_brief: 0 };

  for (const card of filtered) {
    console.log(`\n[card] ${card.id} (${card.pane}) — ${card.name || ''}`);
    for (const variant of VARIANTS) {
      const r = await renderVariant(card, variant, index);
      stats[r] = (stats[r] || 0) + 1;
      writeStatus({
        timestamp: new Date().toISOString(),
        manifest_source: source,
        progress: stats,
        last: { card: card.id, variant, result: r },
      });
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Complete:  ${stats.complete}`);
  console.log(`Failed:    ${stats.failed}`);
  console.log(`Skipped:   ${stats.skipped}`);
  console.log(`Dry:       ${stats.dry}`);
  console.log(`No-brief:  ${stats.no_brief}`);
  console.log(`Index:     ${INDEX_PATH}`);
  console.log(`Errors:    ${ERRORS_PATH}`);

  writeStatus({
    timestamp: new Date().toISOString(),
    manifest_source: source,
    progress: stats,
    done: true,
  });
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
