#!/usr/bin/env node
// Track A render script — Cycle 9. Four new BS-1 cards to reach Y1 floor (16/20).
// Provider: Replicate / FLUX 1.1 Pro Ultra. Aspect: 2:3. Quality: 85 WebP.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KEY = process.env.REPLICATE_API_TOKEN;
if (!KEY) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }

const REPO = path.resolve(process.cwd());
const MANIFEST_PATH = path.join(REPO, 'public/prototype-art/manifest.json');
const LEDGER_PATH = '/opt/rebirth-daemon/spend-ledger.jsonl';

const CARDS = [
  {
    id: 'bs1-c09',
    version: 'v1',
    setId: 'bs-1-221b',
    character: 'Holmes + Watson',
    name: 'The Telegram',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga domestic tension + Struzan relational dyad as ceiling.

SUBJECT: 221B Baker Street sitting room, late morning, 1883. A telegram has just arrived. Watson holds it open, having read it first — his face still carrying the surprise. Holmes, already on his feet, is reaching for his coat from the hook beside the mantelpiece, the telegram's contents not yet told to him but understood — he has deduced it from Watson's expression.

SCENE: The 221B sitting room from a medium-wide angle. The telegram in Watson's hand is small, the message-paper curled slightly from the messenger's delivery. Holmes at the left of frame, back half-turned, the coat already in one hand — the coat-sleeve halfway on. Watson at right, the telegram extended slightly toward Holmes, eyes on Holmes's profile. The mantelpiece behind them: service revolver, Persian slipper, chemistry vials. Morning grey London light from the window.

ICONOGRAPHY: The telegram curled in Watson's hand — cases arrive like this, suddenly. Holmes's coat half-on — he acts before he is told. Watson's expression of suspended question.

NARRATIVE BEAT: The moment between arrival and departure — the case not yet spoken, Holmes already in motion.

COMPOSITION: Relational dyad. Watson right-of-center, Holmes left, coat half-on, both facing slightly inward. The telegram creating a subtle diagonal from Watson's hand toward Holmes. The mantelpiece behind them as familiar anchor.

LIGHT: Grey morning window light from upper-left. Warm oil lamp on the writing desk at frame-right still burning. Both figures lit by the overlap of cool and warm.

COLOR: Tobacco-amber sitting room. Grey window light. Holmes's dark coat. Watson's morning-dress brown wool. The telegram's white paper the brightest element.

STAKES VISIBLE ON THE FACE: Watson — surprise becoming curiosity. Holmes — certainty in motion.

OFF-FRAME IMPLICATION: The doorway below frame — in thirty seconds they will be descending the stairs.

STYLE: Kazuo Oga domestic tension, Struzan relational dyad, Sargent oil density. Victorian interior realism. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
  },
  {
    id: 'bs1-c10',
    version: 'v1',
    setId: 'bs-1-221b',
    character: 'Sherlock Holmes',
    name: 'The Baker Street Irregulars',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga crowd-intimacy + Sidney Paget compositional grammar as ceiling.

SUBJECT: Sherlock Holmes at the front door of 221B, 1882, dispatching the Baker Street Irregulars. Holmes stands in the doorway, tall and angular, bent slightly forward — crouching to the level of Wiggins, the lead Irregular, a sharp-faced London street boy of twelve or thirteen. Holmes has a coin extended between two fingers. Four or five other Irregulars behind Wiggins: various ages 9–14, ragged wool coats, mis-matched boots, watching Holmes with the professional attention of experienced agents.

SCENE: The doorstep of 221B from outside — Baker Street cobblestones, foggy morning. The house number "221B" visible on the door frame at upper-left but not the focal point. The street behind the Irregulars recedes into London fog. Holmes's deerstalker visible — he is going out immediately after this dispatch. Mrs Hudson's face barely visible in an upper window, watching.

ICONOGRAPHY: The coin extended between Holmes's fingers — payment before mission. Wiggins's answering nod — this is a professional relationship. The fog behind the Irregulars — London as the problem-space they inhabit.

NARRATIVE BEAT: Dispatch — the intelligence network being activated. Holmes as commander of the smallest, least-likely army in the city.

COMPOSITION: Holmes large at left, bent forward, framed by the doorway arch. Wiggins at center, facing Holmes. The other Irregulars as a small crowd behind Wiggins, receding into the right frame. Mrs Hudson's window at upper-right.

LIGHT: Cold fog-diffuse morning light. Warm gaslight from within the doorway behind Holmes — backlit doorway, Holmes's face in shadow, the coin in his fingers catching the gas-light from behind.

COLOR: Cold fog-grey London morning. Holmes's dark silhouette against warm door-light. The Irregulars in their various earthy greys and browns. The coin the single gold element.

STAKES VISIBLE ON THE FACE: Holmes — efficient command. Wiggins — professional readiness.

OFF-FRAME IMPLICATION: Wherever the Irregulars are going — the city is about to be searched.

STYLE: Sidney Paget's compositional grammar at Sargent oil density. Victorian street realism. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "A Study in Scarlet," 1887; "The Sign of the Four," 1890.`,
  },
  {
    id: 'bs1-r03',
    version: 'v1',
    setId: 'bs-1-221b',
    character: 'Irene Adler (absent trace)',
    name: 'The Photograph',
    tier: 'Rare',
    shell: 'PRIME',
    parallel: 'ARCANA',
    elemental: 'REASON',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga object-biography + Alex Ross photo-real-mythic as ceiling. This is a Rare absent-character-trace composition.

SUBJECT: A cabinet photograph, propped against the chemistry flask on the 221B mantelpiece. The photograph shows a young woman of striking presence — dark eyes, dark hair, slight smile — in formal 1880s dress, three-quarter portrait format. The card art is the mantelpiece composition: the photograph prominent at center, the room's other contents (briar pipe resting at the left edge, service revolver cloth at right, the Persian slipper visible at frame-right edge) as context. Holmes himself is not present — but a magnifying glass has been placed directly in front of the photograph, slightly aside, as if it has been examined.

SCENE: The 221B mantelpiece as still-life. The photograph — occupying the frame's center, propped upright against the retort stand — is the subject. Late-night, single lamp burning. The magnifying glass at an angle in front of the photograph. Faint tobacco haze in the air catching the lamp-light.

ICONOGRAPHY: The photograph — the one object Holmes kept from a case he did not solve to his own satisfaction. The magnifying glass placed in front of it — the evidence still being examined. The pipe laid aside — the examination interrupted or suspended.

NARRATIVE BEAT: Absent examination — Holmes has been studying the photograph again and left the room. The magnifying glass before the face says he was looking for something.

COMPOSITION: Still-life, centered. The photograph at center-frame, the cabinet photograph format creating a portrait-within-portrait. The magnifying glass angled slightly to reveal the face without obscuring it. The mantelpiece objects in periphery — familiar context.

LIGHT: Single oil lamp at lower-right, warm amber. The photograph's surface catching the lamplight as the brightest element. The tobacco haze visible as a diffuse amber column in the lamp-beam. Deep shadow at the upper frame.

COLOR: Tobacco-amber and oxblood. The photograph itself slightly sepia — the only warm brown. The magnifying glass frame silver in the lamplight.

STAKES VISIBLE ON THE FACE: The woman in the photograph — a slight smile that knows something. The photograph has been here a long time.

OFF-FRAME IMPLICATION: Holmes's chair, off-frame right, still has the impression of his sitting in it. The pipe still warm.

STYLE: Kazuo Oga object-biography, Alex Ross photo-real posture for the photograph's subject. The ARCANA parallel register: the magnifying glass placed before the photograph creates an accidental optical system — if you looked through it at the right angle, the face in the photograph would be larger. Victorian still-life at MTG Rare density. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "A Scandal in Bohemia," 1891.`,
  },
  {
    id: 'bs1-r04',
    version: 'v1',
    setId: 'bs-1-221b',
    character: 'Sherlock Holmes',
    name: 'The Case Map',
    tier: 'Rare',
    shell: 'PRIME',
    parallel: 'ARCANA',
    elemental: 'REASON',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Alex Ross photo-real-mythic posture + Moebius spatial mapping as ceiling.

SUBJECT: Sherlock Holmes seated on the floor of 221B, 1884. Papers radiate from him in a full circle — case documents, hand-drawn maps, coded telegrams, newspaper clippings pinned with tacks to the floor. Holmes at the center of the circle, long legs crossed, bent forward over a particular document, magnifying glass at work. In shirtsleeves, waistcoat, hair slightly disordered. Completely absorbed.

SCENE: The 221B sitting room, cleared — the furniture pushed to the walls. The circular spread of documents occupies the center of the floor. Holmes at the center of the circle, clockwise from him: a map of London with pencil-marked routes, a decoded cipher in his own hand, three newspaper pages with circled passages, a chemical analysis chart. The armchairs pushed back at the frame edges. The window at upper right — night, fog pressed against the glass. A single lamp on the floor beside Holmes (brought down from the table) illuminating the circle of papers.

ICONOGRAPHY: The papers in a perfect circle — Holmes creating the geometry of deduction physically, not just mentally. The lamp brought to the floor — he has descended to the level of the evidence. The disordered hair — the deduction at full-depth intensity.

NARRATIVE BEAT: The apex of the analytical process — Holmes inside the problem, the problem laid out around him like a cartography of consequence.

COMPOSITION: Top-down perspective, high angle, as if from the ceiling. Holmes at the center, the papers radiating outward like the spokes of a wheel or a rose window. The armchairs at the very edges of the frame, distant witnesses. The lamp beside Holmes creating a warm pool of light at the center.

LIGHT: The lamp on the floor — warm amber pool at the center. The circle of papers partially in lamplight, partially in shadow. The window fog-grey at upper frame-right. The center of the composition the brightest point.

COLOR: The warm lamp amber at center. The papers — pale, varied, slightly off-white with tobacco-amber stain. Holmes's shirtsleeves white at the center of the amber pool. Deep shadow at the frame edges.

STAKES VISIBLE ON THE FACE: Seen from above — the back of Holmes's head bent over the document, the angular shoulder-line. The face not visible, which is the point: the man has become the problem.

OFF-FRAME IMPLICATION: Watson's boots visible at the extreme frame-edge — he is in his armchair, watching, not interrupting.

STYLE: Alex Ross photo-real posture for Holmes at center. Moebius overhead cartographic perspective for the papers and composition. The top-down angle as the single non-naturalistic register — a ARCANA geometry of deduction laid bare. Victorian interior raised to analytical sublime. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
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
  if (!submit.ok) {
    const txt = await submit.text();
    throw new Error(`replicate submit ${submit.status}: ${txt}`);
  }
  const j = await submit.json();
  // If 'wait' is honored, output is immediately available. If not, poll.
  if (j.output) {
    const url = Array.isArray(j.output) ? j.output[0] : j.output;
    const img = await fetch(url);
    return { buf: Buffer.from(await img.arrayBuffer()), seed: j.id };
  }
  // Poll fallback
  const pollUrl = j.urls?.get || `https://api.replicate.com/v1/predictions/${j.id}`;
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${KEY}`, Accept: 'application/json' },
    });
    const p = await poll.json();
    if (p.status === 'succeeded') {
      const url = Array.isArray(p.output) ? p.output[0] : p.output;
      const img = await fetch(url);
      return { buf: Buffer.from(await img.arrayBuffer()), seed: p.id };
    }
    if (p.status === 'failed' || p.status === 'canceled') {
      throw new Error(`replicate ${p.status}: ${JSON.stringify(p.error)}`);
    }
    console.log(`  polling ${p.id} — status: ${p.status} (attempt ${i + 1})`);
  }
  throw new Error('replicate poll timeout after 4.5 min');
}

async function renderCard(card) {
  const outDir = path.join(REPO, 'public/prototype-art/bs-1-221b', card.id);
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, `${card.version}.webp`);

  console.log(`\n→ Rendering ${card.id} "${card.name}"…`);
  const t0 = Date.now();
  const { buf, seed } = await genReplicate(card.prompt);
  const webp = await sharp(buf).webp({ quality: 85 }).toBuffer();
  await fs.writeFile(outPath, webp);
  const sizeKb = Math.round(webp.length / 1024);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`  ✓ ${card.id} — ${sizeKb} KB — ${elapsed}s — seed: ${seed}`);

  if (sizeKb > 500) {
    console.warn(`  ⚠ ${card.id} is ${sizeKb}KB > 500KB limit — re-compressing to quality 75`);
    const recomp = await sharp(buf).webp({ quality: 75 }).toBuffer();
    await fs.writeFile(outPath, recomp);
    const newKb = Math.round(recomp.length / 1024);
    console.log(`  ✓ recompressed to ${newKb}KB`);
    return { card, seed, sizeKb: newKb, path: `public/prototype-art/bs-1-221b/${card.id}/${card.version}.webp` };
  }

  return { card, seed, sizeKb, path: `public/prototype-art/bs-1-221b/${card.id}/${card.version}.webp` };
}

async function main() {
  const results = [];
  for (const card of CARDS) {
    const result = await renderCard(card);
    results.push(result);
  }

  // Update manifest.json
  const manifestRaw = await fs.readFile(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const now = new Date().toISOString();

  for (const { card, seed, sizeKb, path: filePath } of results) {
    manifest.push({
      id: `${card.id}-${card.version}`,
      setId: card.setId,
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
      seed,
      costUsd: 0.04,
      generatedAt: now,
      path: filePath,
      sizeKb,
    });
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ manifest.json updated — ${manifest.length} total entries`);

  // Append to spend ledger
  const ledgerEntries = results.map(({ card }) =>
    JSON.stringify({
      ts: now,
      provider: 'replicate',
      model: 'black-forest-labs/flux-1.1-pro-ultra',
      cardId: card.id,
      costUsd: 0.04,
      cycleN: 9,
    })
  ).join('\n') + '\n';
  await fs.appendFile(LEDGER_PATH, ledgerEntries);
  console.log(`✓ spend-ledger.jsonl updated (+${results.length} entries @ $0.04 each)`);

  console.log(`\n=== Cycle 9 Track A complete: ${results.length} renders ===`);
  results.forEach(({ card, sizeKb }) => console.log(`  ${card.id} "${card.name}" — ${sizeKb}KB`));
}

main().catch((err) => { console.error(err); process.exit(1); });
