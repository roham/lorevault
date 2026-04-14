#!/usr/bin/env node
/**
 * Card art generator using fal.ai FLUX
 * Usage: node scripts/generate-card-art.mjs [--batch N] [--set SET_SLUG] [--start N] [--force]
 *
 * Generates per-card art (parallel + scarcity affect visual style).
 * Saves to public/cards/{setSlug}-{character}-{moment}-{scarcity}-{parallel}.webp
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Load .env.local
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  }
}

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error('FAL_KEY not set'); process.exit(1); }

const args = process.argv.slice(2);
const getArg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const BATCH = parseInt(getArg('--batch') || '10');
const SET_FILTER = getArg('--set');
const START = parseInt(getArg('--start') || '0');
const FORCE = args.includes('--force');

const OUT_DIR = join(process.cwd(), 'public', 'cards');
mkdirSync(OUT_DIR, { recursive: true });

const SET_AESTHETICS = {
  'baker-street': 'Victorian London, fog and gaslight, muted blues and warm amber, detective noir atmosphere',
  'enchanted-kingdom': 'Dark fairy tale, Brothers Grimm, enchanted forest, deep purples and midnight greens, magical realism',
  'wonderland': 'Surreal wonderland, psychedelic yet dark, impossible geometry, vivid teal and violet, dreamlike',
  'gothic-horror': 'Gothic horror, castle ruins and mist, crimson and deep shadow, Victorian horror, candlelight',
  'olympus': 'Ancient Greek mythology, marble and gold, epic scale, divine light, Mediterranean storm',
  'asgard': 'Norse mythology, frost and storm, glacial blues and steel grey, runic magic, Viking age grandeur, Bifrost light piercing storm clouds',
};

// Scarcity affects drama/intensity of the image itself
const SCARCITY_PROMPTS = {
  common: 'Simple composition, soft lighting, understated, calm mood, muted palette',
  uncommon: 'Enhanced lighting, subtle magical aura, slightly more dynamic pose',
  rare: 'Dramatic volumetric lighting, mystical energy, dynamic composition, rich colors',
  epic: 'Intense magical energy, ethereal glow, cinematic composition, purple and violet accents, powerful atmosphere',
  legendary: 'Maximum dramatic impact, golden divine radiance, god rays, legendary aura, most powerful and impressive version of this character, epic scale',
};

// Parallel affects the color palette and material feel of the image
const PARALLEL_PROMPTS = {
  base: 'Standard color palette, clean rendering, natural tones',
  silver: 'Cool silvery moonlight tones, steel blue and pale grey palette, metallic sheen on surfaces, winter moonlight atmosphere, cooler temperature',
  gold: 'Warm golden hour lighting, rich amber and honey tones, golden light catching on every surface, luxurious warm palette, sunset glow',
  holographic: 'Prismatic iridescent lighting, rainbow color shifts, crystalline refractions, multiple light sources in different colors, dreamlike chromatic aberration, pink-cyan-violet spectrum',
  obsidian: 'Ultra-dark void atmosphere, deep shadows consuming the edges, minimal light from a single source, character emerging from pure darkness, indigo and deep violet only, mysterious and ominous',
};

function buildPrompt(card) {
  const set = SET_AESTHETICS[card.setSlug] || 'dark fantasy';
  const scarcity = SCARCITY_PROMPTS[card.scarcity] || '';
  const parallel = PARALLEL_PROMPTS[card.parallel] || '';

  return `Portrait of ${card.character} — "${card.moment}". ${set}. Digital collectible trading card art, dark premium aesthetic, painterly style. Single character focus, upper body or full figure. Rich textures, atmospheric depth. ${scarcity}. ${parallel}. No text, no borders, no frames, no UI elements, no watermarks.`;
}

function toArtId(card) {
  const base = `${card.setSlug}-${card.character}-${card.moment}`.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  // Only append parallel/scarcity suffix for non-base variants
  if (card.parallel === 'base' && card.scarcity === 'common') return base;
  return `${base}-${card.scarcity}-${card.parallel}`;
}

// Parse ALL 200 cards from the generation logic
function parseAllCards() {
  const cardsPath = join(process.cwd(), 'src', 'data', 'cards.ts');
  const content = readFileSync(cardsPath, 'utf-8');

  // Extract character data per set
  const cards = [];
  let currentSet = '';

  const setCharacters = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const setMatch = /^\s*'([a-z-]+)':\s*\[/.exec(line);
    if (setMatch) currentSet = setMatch[1];

    const charMatch = /character:\s*'([^']+)',\s*moment:\s*'([^']+)'/.exec(line);
    if (charMatch && currentSet) {
      if (!setCharacters[currentSet]) setCharacters[currentSet] = [];
      setCharacters[currentSet].push({ character: charMatch[1], moment: charMatch[2] });
    }
  }

  // Reproduce the deterministic card generation (same seeded random as cards.ts)
  let seed = 42;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  for (const [setSlug, chars] of Object.entries(setCharacters)) {
    for (const char of chars) {
      // Match exact rand() call order from cards.ts generateCards():
      rand(); // 1: commonSerial
      rand(); // 2: common card listed flag (inline in object literal)
      cards.push({ ...char, setSlug, scarcity: 'common', parallel: 'base' });

      // Higher variant
      const roll = rand(); // 3: scarcity roll
      const scarcity = roll < 0.4 ? 'uncommon' : roll < 0.7 ? 'rare' : roll < 0.9 ? 'epic' : 'legendary';
      const pRoll = rand(); // 4: parallel roll
      const parallel = pRoll < 0.5 ? 'base' : pRoll < 0.7 ? 'silver' : pRoll < 0.85 ? 'gold' : pRoll < 0.95 ? 'holographic' : 'obsidian';
      rand(); // 5: higher variant serial
      rand(); // 6: higher variant listed flag
      cards.push({ ...char, setSlug, scarcity, parallel });
    }
  }

  return cards;
}

async function generateImage(prompt) {
  const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: { 'Authorization': `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      image_size: { width: 512, height: 720 },
      num_images: 1,
      num_inference_steps: 4,
      enable_safety_checker: false,
    }),
  });
  if (!response.ok) throw new Error(`fal.ai ${response.status}: ${await response.text()}`);
  return await response.json();
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outputPath, buffer);
  return buffer.length;
}

async function main() {
  console.log('Parsing all 200 cards...');
  const allCards = parseAllCards();
  let cards = SET_FILTER ? allCards.filter(c => c.setSlug === SET_FILTER) : allCards;

  if (!FORCE) {
    cards = cards.filter(c => !existsSync(join(OUT_DIR, `${toArtId(c)}.webp`)));
  }

  cards = cards.slice(START, START + BATCH);
  console.log(`Generating ${cards.length} images (batch=${BATCH}, total cards=${allCards.length}, remaining=${cards.length})`);

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const artId = toArtId(card);
    const outPath = join(OUT_DIR, `${artId}.webp`);

    const label = card.parallel === 'base' && card.scarcity === 'common'
      ? `${card.character} (common/base)`
      : `${card.character} (${card.scarcity}/${card.parallel})`;
    console.log(`\n[${i + 1}/${cards.length}] ${label} — "${card.moment}" (${card.setSlug})`);

    try {
      const result = await generateImage(buildPrompt(card));
      const imageUrl = result.images?.[0]?.url;
      if (!imageUrl) { console.error('  No image URL'); continue; }
      const size = await downloadImage(imageUrl, outPath);
      console.log(`  Saved: ${artId}.webp (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  }
  console.log('\nDone.');
}

main().catch(console.error);
