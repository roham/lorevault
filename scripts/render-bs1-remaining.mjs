#!/usr/bin/env node
// Renders the 4 remaining BS-1 Moments via FLUX 1.1 Pro Ultra on Replicate.
// Cards: bs1-c11, bs1-c12, bs1-r05, bs1-l02
// Usage: REPLICATE_API_TOKEN=... node scripts/render-bs1-remaining.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KEY = process.env.REPLICATE_API_TOKEN;
if (!KEY) throw new Error('REPLICATE_API_TOKEN missing');

const REPO = path.resolve(process.cwd());
const ART_BASE = path.join(REPO, 'public/prototype-art/bs-1-221b');
const MANIFEST_PATH = path.join(REPO, 'public/prototype-art/manifest.json');
const LEDGER_PATH = '/opt/rebirth-daemon/spend-ledger.jsonl';
const COST_PER_RENDER = 0.04;

const CARDS = [
  {
    id: 'bs1-c11',
    name: 'The Coded Message',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Kazuo Oga environmental intimacy as ceiling.

SUBJECT: Sherlock Holmes in the 221B sitting room, 1885. Gaunt, angular, coat-off, waistcoat and shirt-sleeves. Seated deep in a leather armchair. A grid of handwritten cipher-symbols covers multiple sheets of paper spread across his lap and the floor around him, like a radial pattern of clues. Pen raised in the right hand, not yet touching paper — the key just found.

SCENE: 221B sitting room, late afternoon. The chemistry bench at mid-ground, unlit. A single candle on the armrest-table burns low, nearly spent. Cipher papers colonise the carpet in overlapping sheets. One cipher page is pinned to the mantelpiece with a tobacco pipe — visible at upper mid-frame. The rest of the room in shadow.

ICONOGRAPHY: The dense handwritten cipher — symbol-grid that looks like a foreign alphabet and isn't. The pen poised above the revelation.

NARRATIVE BEAT: Moment-of-decision — the pen raised at the instant before certainty becomes ink. The fraction of a second when the answer is still only in his mind.

COMPOSITION: Figure in armchair, three-quarter view from slightly above and to the right. Cipher papers radiate outward from the chair like spokes. The mantelpiece page at upper-mid provides a secondary focal point. Classical inverted-pyramid composition — head at apex, papers at base.

LIGHT: Single candle at armrest, warm amber. The papers in his lap warm-lit from below. The room beyond in deep shadow. One faint cool note from a window off-frame at upper-left.

COLOR: Tobacco-amber and candlelight gold. Oxblood armchair. The cipher papers cream-white — the brightest elements in the frame. Deep shadow at periphery.

STAKES VISIBLE ON THE FACE: Recognition — the fraction of a second before certainty arrives. Not triumph; the clinical satisfaction of the mechanism completing.

OFF-FRAME IMPLICATION: The pen aimed at the cipher paper. What he writes will close the case. The answer already inhabits his face before the pen moves.

STYLE: Sidney Paget linework raised to John Singer Sargent oil-paint density. Victorian interior realism with Struzan compositional weight. No text on in-frame papers — abstract symbol-shapes only. No modern objects. No watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Adventure of the Dancing Men," 1903.`,
  },
  {
    id: 'bs1-c12',
    name: 'The Gaslight Vigil',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Kazuo Oga environmental intimacy as ceiling.

SUBJECT: Sherlock Holmes standing at the 221B first-floor window, 3AM. Greatcoat still on — just returned, or about to leave; the coat carries the cold from outside. One hand resting on the window-frame, the other in the coat pocket. Seen from inside the room: face in three-quarter profile, looking down at Baker Street below.

SCENE: 221B sitting room at 3AM. The fire reduced to deep-red embers. The oil lamp on the mantelpiece at lowest wick. The sash window open two inches — London November fog pressing at the gap, a visible grey tongue. Through the panes: the hazy gaslight aureole of a single lamp-post. Baker Street empty. No traffic. No pedestrian.

ICONOGRAPHY: The fog at the two-inch window-gap — a visible, pressing presence, not merely weather. The single gaslight aureole through the rain-blurred glass.

NARRATIVE BEAT: Portent — the suspended moment before the thing that is coming arrives. Not yet dread; the threshold before dread.

COMPOSITION: Full figure at window, upper two-thirds of frame. The window panes and gaslight aureole at mid-ground behind the figure. The ember-glow at lower-left anchors the only warm note. Figure in dark silhouette against the cold grey-white exterior — the classic Caspar David Friedrich back-to-the-viewer pose.

LIGHT: Cold exterior gaslight through rain-blurred glass as the primary key. Ember-glow from lower-left as a warm fill that barely reaches. Two lights crossing at the figure's coat-back.

COLOR: Fog-grey and gaslight-amber exterior. Charcoal-dark coat. Ember-red at the lower periphery — the only warm-red note.

STAKES VISIBLE ON THE FACE: Partial profile only — one eye, the angular jaw, the set of the lip. The shoulders carry the vigil: not tense, not relaxed — the posture of controlled patience, which reads as controlled dread.

OFF-FRAME IMPLICATION: The eye-line goes down to Baker Street below. Something in the street below the viewer's line of sight. Something not yet arrived that will be.

STYLE: John Singer Sargent oil-paint atmospheric depth. Sidney Paget silhouette grammar. Victorian nocturne, smoke-and-gaslight register. Quiet outsells spectacle. No text, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "A Study in Scarlet," 1887.`,
  },
  {
    id: 'bs1-r05',
    name: 'The Moriarty Letter',
    tier: 'Rare',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Kazuo Oga environmental intimacy as ceiling.

SUBJECT: Sherlock Holmes standing at the 221B desk, holding a single handwritten letter in both hands at reading distance. Crisp, military posture — not seated. The letter held before him with two fingers rather than a grip. His expression: absolute precision of control over what the letter means.

SCENE: 221B sitting room, midday. The desk behind him: case-correspondence in stacks, a chemistry flask stoppered and unused, Watson's visiting card face-down at the corner. The letter is a single page — its handwriting precise, vertical, almost mechanical; visible as abstract mark-making, no legible words. The window at camera-right admits cold grey midday light.

ICONOGRAPHY: The letter — the precise vertical handwriting, held with deliberate lightness. The author is not in frame. The precision of the hand implies he doesn't need to be.

NARRATIVE BEAT: Moment-after — the letter has been read. He is reading it a second time to be certain of what certainty means.

COMPOSITION: Three-quarter close hero — Holmes filling the upper two-thirds of the frame. The letter at mid-foreground, lower-center. The desk and window at background. Focal triangle: face → letter → desk. The letter in full cold light.

LIGHT: Cold diffused midday light from window at camera-right. No dramatic shadow — the flatness of the light is deliberate. The letter in the most direct light in the frame, slightly overlit against the ambient.

COLOR: Cold grey-white window light. The desk in warm shadow-amber. Holmes's coat: charcoal and dark. No warm centre in the figure — the cold is the content of the moment.

STAKES VISIBLE ON THE FACE: Controlled containment. The precise arrangement of a face that has decided not to show what it is showing. Not fear; the face of a man filing away what fear would be.

OFF-FRAME IMPLICATION: The letter's author does not appear. The precision of the handwriting visible as abstract marks implies someone who writes with the same care Holmes thinks with.

STYLE: Sidney Paget pen-and-wash raised to oil density. John Singer Sargent tonal restraint. Victorian interior daylight, cold register. No text in legible form on the letter — abstract vertical marks only. No watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Final Problem," 1893.`,
  },
  {
    id: 'bs1-l02',
    name: 'The Seven-Per-Cent',
    tier: 'Legendary',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'SHADOW',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: Magic: The Gathering mythic-rare as floor; John Singer Sargent psychological portraiture as ceiling.

SUBJECT: Sherlock Holmes seated in the 221B armchair, late afternoon. The Morocco case lies open on the side-table at armrest level — the hypodermic needle visible within the lined interior, already drawn, resting on the dark case-lining. Holmes looking directly out of the frame, at the viewer. Not asking permission. Already decided.

SCENE: 221B sitting room, fading afternoon, no fire lit. The case-files on the desk behind him untouched — no active case. An open volume of chemistry abandoned on the floor. The sitting room in the particular stillness of a genius with nothing to deduce. The Morocco case and needle at armrest level: clinical, almost domestic in their calm.

ICONOGRAPHY: The Morocco case and needle — not dramatic. Clinical. The most frightening way to depict it: unhurried, matter-of-fact, almost tidy.

NARRATIVE BEAT: Direct address — the gaze held outward. The invitation, or the indictment of the witness, depending on the witness. He has been watched doing this before.

COMPOSITION: Tight three-quarter hero — Holmes and armchair filling the frame. The Morocco case and needle in the lower-right third, sharp and close. His face at the upper-left, lit by the lamp's warm peripheral reach. The direct gaze bisects the frame vertically.

LIGHT: Warm oil lamp at camera-left, barely reaching. The Morocco case receives colder, slightly more direct light — just overlit against the warm ambient, making the needle the single brightest linear element in the frame.

COLOR: Tobacco-amber ambient. The Morocco case lining: dark bottle-green, almost black. The needle catches lamplight as a single bright linear highlight. His coat and waistcoat: charcoal. His face in warm half-light.

STAKES VISIBLE ON THE FACE: Not shame. Not defiance. Simple certainty. The face of a man who has calculated the cost and paid it many times and intends to pay it now.

OFF-FRAME IMPLICATION: The direct gaze assigns the role of witness to whoever looks at the card. Watson, or whoever walks in. The composition makes the viewer complicit in the moment.

STYLE: John Singer Sargent oil-paint psychological portraiture at full power. Less Paget silhouette — this is closer to Sargent's directness, the intimacy that makes you look away first. Victorian moral gravity without Victorian moral judgment. No text, no watermarks, no borders.

PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Sign of the Four," 1890.`,
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
  if (!submit.ok) throw new Error(`replicate ${submit.status}: ${await submit.text()}`);
  const j = await submit.json();

  // If not done yet (polling needed)
  if (j.status && j.status !== 'succeeded' && j.status !== 'failed') {
    const pollUrl = j.urls?.get;
    if (!pollUrl) throw new Error(`replicate: no poll url in ${JSON.stringify(j).slice(0, 200)}`);
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const poll = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${KEY}` },
      });
      const p = await poll.json();
      if (p.status === 'succeeded') {
        const url = Array.isArray(p.output) ? p.output[0] : p.output;
        if (!url) throw new Error(`replicate: no output after poll`);
        const img = await fetch(url);
        return Buffer.from(await img.arrayBuffer());
      }
      if (p.status === 'failed') throw new Error(`replicate failed: ${JSON.stringify(p).slice(0, 200)}`);
    }
    throw new Error('replicate poll timeout');
  }

  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error(`replicate: no output in ${JSON.stringify(j).slice(0, 300)}`);
  const img = await fetch(url);
  return Buffer.from(await img.arrayBuffer());
}

async function renderCard(card) {
  console.log(`  rendering ${card.id} (${card.name}) via Replicate…`);
  const t0 = Date.now();

  const pngBuf = await genReplicate(card.prompt);
  const webpBuf = await sharp(pngBuf).webp({ quality: 85 }).toBuffer();

  const sizeKb = Math.round(webpBuf.length / 1024);
  if (sizeKb > 500) {
    console.warn(`    WARNING: ${card.id} is ${sizeKb}KB (>500KB limit); re-compressing at q70`);
    const rebuf = await sharp(pngBuf).webp({ quality: 70 }).toBuffer();
    const reKb = Math.round(rebuf.length / 1024);
    console.log(`    re-compressed to ${reKb}KB`);
    return { card, webpBuf: rebuf, sizeKb: reKb, elapsed: Date.now() - t0 };
  }

  console.log(`    ${card.id}: ${sizeKb}KB in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return { card, webpBuf, sizeKb, elapsed: Date.now() - t0 };
}

async function saveCard({ card, webpBuf, sizeKb }) {
  const dir = path.join(ART_BASE, card.id);
  await fs.mkdir(dir, { recursive: true });
  const fpath = path.join(dir, 'v1.webp');
  await fs.writeFile(fpath, webpBuf);
  console.log(`    saved to ${fpath.replace(REPO + '/', '')}`);
  return fpath;
}

async function updateManifest(card, sizeKb) {
  const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(raw);
  const entry = {
    id: `${card.id}-v1`,
    setId: 'bs-1-221b',
    character: card.character,
    name: card.name,
    tier: card.tier,
    shell: card.shell,
    parallel: card.parallel,
    elemental: card.elemental,
    prompt: card.prompt,
    provider: 'replicate',
    model: 'black-forest-labs/flux-1.1-pro-ultra',
    aspect: '2:3',
    costUsd: COST_PER_RENDER,
    generatedAt: new Date().toISOString(),
    path: `public/prototype-art/bs-1-221b/${card.id}/v1.webp`,
    sizeKb,
  };
  manifest.push(entry);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`    manifest updated (${manifest.length} total entries)`);
}

async function appendLedger(card) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    provider: 'replicate',
    model: 'black-forest-labs/flux-1.1-pro-ultra',
    cardId: card.id,
    setId: 'bs-1-221b',
    costUsd: COST_PER_RENDER,
  }) + '\n';
  await fs.appendFile(LEDGER_PATH, line);
}

// Render sequentially to avoid rate limits
console.log(`\nRendering ${CARDS.length} BS-1 cards via FLUX 1.1 Pro Ultra (Replicate)\n`);
let totalCost = 0;
for (const card of CARDS) {
  try {
    const result = await renderCard(card);
    await saveCard(result);
    await updateManifest(card, result.sizeKb);
    await appendLedger(card);
    totalCost += COST_PER_RENDER;
    console.log(`  ✓ ${card.id} complete\n`);
  } catch (err) {
    console.error(`  ✗ ${card.id} FAILED: ${err.message}`);
    process.exitCode = 1;
  }
}

console.log(`\nTotal cost: $${totalCost.toFixed(2)}`);
console.log(`Done. Check public/prototype-art/bs-1-221b/ for outputs.`);
