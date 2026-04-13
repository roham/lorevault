#!/usr/bin/env node
/**
 * Card art generator using fal.ai FLUX
 * Usage: FAL_KEY=xxx node scripts/generate-card-art.mjs [--batch N] [--set SET_SLUG] [--start N]
 *
 * Generates 512x720 (5:7) card art images and saves to public/cards/{id}.webp
 * Skips cards that already have art unless --force is passed.
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Load .env.local
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  }
}

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) { console.error('FAL_KEY not set'); process.exit(1); }

// Parse args
const args = process.argv.slice(2);
const getArg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const BATCH = parseInt(getArg('--batch') || '5');
const SET_FILTER = getArg('--set');
const START = parseInt(getArg('--start') || '0');
const FORCE = args.includes('--force');

const OUT_DIR = join(process.cwd(), 'public', 'cards');
mkdirSync(OUT_DIR, { recursive: true });

// Set aesthetics
const SET_AESTHETICS = {
  'baker-street': 'Victorian London, fog and gaslight, muted blues and warm amber, Sherlock Holmes era, detective noir',
  'enchanted-kingdom': 'Dark fairy tale, Brothers Grimm, enchanted forest, deep purples and midnight greens, magical realism',
  'wonderland': 'Surreal wonderland, Alice in Wonderland, psychedelic yet dark, impossible geometry, vivid teal and violet',
  'gothic-horror': 'Gothic horror, Dracula and Frankenstein era, castle ruins, crimson and shadow, Victorian horror',
  'olympus': 'Ancient Greek mythology, marble and gold, epic scale, divine light, Mediterranean sky and storm',
};

const SCARCITY_VIBES = {
  common: '',
  uncommon: 'slightly enhanced lighting, subtle magical aura',
  rare: 'dramatic volumetric lighting, mystical blue energy',
  epic: 'intense purple magical energy, ethereal glow, cinematic composition',
  legendary: 'golden divine radiance, legendary aura, god rays, maximum drama and visual impact',
};

function buildPrompt(card) {
  const setAesthetic = SET_AESTHETICS[card.setSlug] || 'dark fantasy';
  const scarcityVibe = SCARCITY_VIBES[card.scarcity] || '';
  return `Portrait of ${card.character} — "${card.moment}". ${setAesthetic}. Digital collectible trading card art, dark premium aesthetic, painterly style with dramatic lighting. Single character focus, upper body or full figure, facing viewer. Rich textures, atmospheric depth. ${scarcityVibe}. No text, no borders, no frames, no UI elements.`;
}

function parseCards() {
  const cardsPath = join(process.cwd(), 'src', 'data', 'cards.ts');
  const content = readFileSync(cardsPath, 'utf-8');
  const charMap = new Map();
  let currentSet = 'baker-street';

  for (const line of content.split('\n')) {
    for (const setSlug of Object.keys(SET_AESTHETICS)) {
      if (line.includes(`'${setSlug}'`)) currentSet = setSlug;
    }
    const cm = /character:\s*'([^']+)',\s*moment:\s*'([^']+)'/.exec(line);
    if (cm) {
      const key = `${cm[1]}___${cm[2]}___${currentSet}`;
      if (!charMap.has(key)) {
        charMap.set(key, { character: cm[1], moment: cm[2], setSlug: currentSet });
      }
    }
  }
  return Array.from(charMap.values());
}

function toId(character, moment, setSlug) {
  return `${setSlug}-${character.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${moment.toLowerCase().replace(/[^a-z0-9]/g, '-')}`.replace(/-+/g, '-');
}

async function generateImage(prompt) {
  const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: { width: 512, height: 720 },
      num_images: 1,
      num_inference_steps: 4,
      enable_safety_checker: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`fal.ai ${response.status}: ${err}`);
  }
  return await response.json();
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(outputPath, buffer);
  return buffer.length;
}

async function main() {
  console.log('Parsing card data...');
  const allChars = parseCards();
  let chars = SET_FILTER ? allChars.filter(c => c.setSlug === SET_FILTER) : allChars;

  if (!FORCE) {
    chars = chars.filter(c => {
      const path = join(OUT_DIR, `${toId(c.character, c.moment, c.setSlug)}.webp`);
      return !existsSync(path);
    });
  }

  chars = chars.slice(START, START + BATCH);
  console.log(`Generating ${chars.length} images (batch=${BATCH}, start=${START}, total available=${allChars.length})`);

  for (let i = 0; i < chars.length; i++) {
    const card = chars[i];
    const id = toId(card.character, card.moment, card.setSlug);
    const outPath = join(OUT_DIR, `${id}.webp`);

    console.log(`\n[${i + 1}/${chars.length}] ${card.character} — "${card.moment}" (${card.setSlug})`);

    try {
      const result = await generateImage(buildPrompt({ ...card, scarcity: 'rare' }));
      const imageUrl = result.images?.[0]?.url;
      if (!imageUrl) { console.error('  No image URL'); continue; }

      const size = await downloadImage(imageUrl, outPath);
      console.log(`  Saved: ${id}.webp (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  }
  console.log('\nDone.');
}

main().catch(console.error);
