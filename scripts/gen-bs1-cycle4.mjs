#!/usr/bin/env node
// Track A — Cycle 4: bs1-c06, bs1-c07, bs1-c08, bs1-r02

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const KEY = process.env.REPLICATE_API_TOKEN;
if (!KEY) { console.error('REPLICATE_API_TOKEN missing'); process.exit(1); }

const REPO = path.resolve(process.cwd());
const ART_BASE = path.join(REPO, 'public/prototype-art/bs-1-221b');
const MANIFEST_PATH = path.join(REPO, 'public/prototype-art/manifest.json');
const LEDGER = '/opt/rebirth-daemon/spend-ledger.jsonl';
const COST = 0.04;
const CYCLE_N = 4;

const MOMENTS = [
  {
    id: 'bs1-c06',
    name: 'The Persian Slipper',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga object-as-biography + Struzan compositional gravity as ceiling.

SUBJECT: The Persian slipper hanging from the mantelpiece bracket at 221B. The slipper itself is the subject — it is heavy with tobacco, the toe curled back with use. The mantelpiece surface behind it: stacked case-papers, a chemistry flask, the service revolver on its cloth. No figure — this is an absent-character-trace composition.

SCENE: The 221B mantelpiece in close detail. The Persian slipper occupies the upper third of frame, hanging from its worn loop. Below it on the marble mantel surface: a tobacco pouch beside it, a briar pipe resting with its bowl down, an old case-paper with a few words visible as illegible handwriting (not words — just the density of writing). The grate below glowing with low embers. Fog at the window in the far background.

ICONOGRAPHY: The Persian slipper — the Lampblack prop that makes no logical sense except as Holmes's prop. Tobacco is kept in it because keeping tobacco in a slipper is the kind of thing Holmes does, and the object has absorbed the habit until the habit and the object are the same.

NARRATIVE BEAT: Absent-character trace — Holmes off-frame, but the room is saturated with him. The slipper is here; he will return to it.

COMPOSITION: Object study, close-mid shot. The slipper hanging at upper center, the mantelpiece surface as a still-life below it. The embering grate at lower third, glowing red. The fog-window a soft grey in the far background.

LIGHT: Low embers from the grate (warm red-orange from below). A single oil lamp off-frame left (warm amber sidelight). The slipper lit from two warm sources — intimate still-life lighting.

COLOR: Oxblood leather slipper, tobacco-amber pigment, ember-red grate, deep mantelpiece shadows. The only cool element: the fog at the window, barely visible.

STAKES VISIBLE ON THE FACE: No face — the slipper carries what a face would carry. The worn loop says this has been here for years.

OFF-FRAME IMPLICATION: The hanging loop is oriented as if Holmes has just stepped out — the slipper still swaying slightly.

STYLE: Kazuo Oga still-life intimacy at Sargent oil density. Victorian object painting. No figures. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, "The Adventure of the Musgrave Ritual," 1893.`,
  },
  {
    id: 'bs1-c07',
    name: 'The First Client',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes + Watson',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Drew Struzan relational dyad + Sargent oil density as ceiling.

SUBJECT: Holmes and Watson receiving a client in the sitting room of 221B. Holmes stands, center-left, already mid-assessment — the forward-lean of mid-deduction, head slightly inclined, eyes on the client (off-frame, lower-left). Watson stands a half-step behind and to Holmes's right — the chronicler's position. Watson's notebook is open.

SCENE: The 221B sitting room, afternoon, grey London light through the window behind them. The client's chair is visible at lower-left, empty (the client is there but we are behind them, looking at Holmes and Watson). Holmes: tall, lean, angular in profile. Watson: squared, steadier, notebook half-raised. The oxblood wallpaper behind them. Mrs Hudson's retreating figure barely visible at the doorway at upper-right — she has just shown the client in and is leaving.

ICONOGRAPHY: Holmes's inclined head and the forward lean — the deduction beginning. Watson's open notebook — the chronicle about to begin. Mrs Hudson's retreating presence — the house, managing itself.

NARRATIVE BEAT: Moment-of-decision — the instant after the client has begun to speak, before Holmes has spoken. Holmes already knows.

COMPOSITION: Two-figure relational dyad — Holmes center-left, Watson slightly right and behind. The client's chair creating the triangle's third anchor at lower-left. Mrs Hudson at far upper-right completing the domestic frame.

LIGHT: Grey London window light from behind Holmes and Watson. A warm oil lamp to their right. Both figures lit from the lamp's left, the window's grey behind them.

COLOR: Grey afternoon light, oxblood wallpaper, Holmes's dark coat, Watson's brown wool. The open notebook-page white as the brightest element.

STAKES VISIBLE ON THE FACE: Holmes — absolute attention. Watson — attentive readiness. Both entirely present.

OFF-FRAME IMPLICATION: The client, addressed but never shown — the case existing off-frame, which is where cases always begin.

STYLE: Drew Struzan relational dyad composition, Sargent oil density. Victorian interior realism. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
  },
  {
    id: 'bs1-c08',
    name: "The Disguise Wardrobe",
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga environmental storytelling as ceiling.

SUBJECT: The open wardrobe in Holmes's room at 221B — a cabinet of disguises. The wardrobe is open, doors wide. On pegs and hooks: a costermonger's coat, a sailor's jacket, a clergyman's collar and black coat, a laborer's worn cloth cap, theatrical whiskers and mustaches on a small shelf, a wig on a stand. Holmes is not present — but a disguise has just been removed: one peg is empty, still swinging, and a single theatrical wig hair lies on the floor below it.

SCENE: The wardrobe as its own subject — the cabinet of identities. The bedroom behind it is dim, the window curtained, a gas lamp just lit. The disguise items have the texture of long use: the costermonger's coat is stained at the collar, the theatrical whiskers show their wire frames. On a shelf inside the wardrobe, three glass bottles labeled with what they are not (they are labeled with chemical symbols, not names).

ICONOGRAPHY: The empty swinging peg — Holmes has just departed in disguise. The single wig hair on the floor — the trace. The chemical bottles labeled obscurely — Holmes's encryption of his own methods.

NARRATIVE BEAT: Absent-character trace (the wig hair, the swinging peg). Holmes gone; the disguise in the world.

COMPOSITION: Wardrobe-as-altar composition — doors fully open, the contents displayed as an inventory. The empty peg at center. The floor below showing the single hair.

LIGHT: Dim bedroom behind, gas lamp just lit — low warm amber. The wardrobe interior slightly cooler, its contents in half-shadow. The swinging peg catches the lamp.

COLOR: Dark wardrobe wood, the varied tones of the disguise garments (grey, black, brown, faded blue). The theatrical whiskers white-blonde against the dark interior.

STAKES VISIBLE ON THE FACE: No face — the wardrobe speaks. The absence of one disguise is the action.

OFF-FRAME IMPLICATION: Holmes somewhere in London, unrecognizable.

STYLE: Kazuo Oga object-storytelling, Victorian interior realism at Sargent density. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
  },
  {
    id: 'bs1-r02',
    name: 'The Street Deduction',
    tier: 'Rare',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Alex Ross photo-real-mythic + Struzan theatrical composition as ceiling.

SUBJECT: Sherlock Holmes at the first-floor window of 221B, observing Baker Street below. He stands three-quarters profile, back slightly to us, pipe held loosely at his side (not drawn). One hand on the window frame. His gaze is down and slightly left, focused on a point in the street below that we cannot see. The angular gaunt silhouette is unmistakable against the grey London daylight through the glass.

SCENE: The 221B sitting room from inside, the window as the frame's dominant element. Through the fog-hazed glass, Baker Street visible below in grey morning light: a hansom cab, a figure in a brown coat (the subject of the deduction), the cobblestones wet. Holmes stands at the window, elevated, observing. The room behind him: the chemical bench visible at frame-left, the mantelpiece at frame-right with its bullet-hole "V.R." barely visible.

ICONOGRAPHY: The window — the lens Holmes uses to practice. The fog on the glass — partly obscuring the street, which means Holmes is deducing through imperfect information. His pipe held at his side instead of being smoked — the deduction running, not the boredom.

NARRATIVE BEAT: Held breath — Holmes mid-deduction, before speaking. The figure on the street below not yet aware they are being read like a case file.

COMPOSITION: Holmes large in the left foreground, angled toward the window. The window occupies the right two-thirds of frame. Baker Street through the glass recedes into misty depth. The figure-in-brown-coat visible small in the street at lower-right third.

LIGHT: Flat grey London daylight through the fog-glass. A warm lamp behind Holmes from the room — giving him a faint warm edge-light against the grey window.

COLOR: Grey fog-London through glass, Holmes's dark coat, the warm edge-light. The figure-in-brown-coat at street level is the only brown-warm element in the street's grey.

STAKES VISIBLE ON THE FACE: In profile — absolute focus. The machine at work on a problem that doesn't know it's a problem yet.

OFF-FRAME IMPLICATION: The figure below, unwitting subject of the deduction. Watson presumably somewhere in the room, listening to whatever Holmes is about to say.

STYLE: Alex Ross photo-real posture for Holmes. Atmospheric perspective (Moebius rule) for the street through the window. Victorian realism at maximum density. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
  },
];

async function genReplicate(prompt) {
  const r = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'wait' },
    body: JSON.stringify({ input: { prompt, aspect_ratio: '2:3', output_format: 'png', safety_tolerance: 5, raw: false } }),
  });
  if (!r.ok) throw new Error(`${r.status}: ${await r.text()}`);
  const j = await r.json();
  let url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url && (j.urls?.get)) {
    for (let i = 0; i < 60; i++) {
      await new Promise(x => setTimeout(x, 3000));
      const p = await (await fetch(j.urls.get, { headers: { Authorization: `Bearer ${KEY}` } })).json();
      if (p.status === 'succeeded') { url = Array.isArray(p.output) ? p.output[0] : p.output; break; }
      if (p.status === 'failed' || p.status === 'canceled') throw new Error(`poll ${p.status}`);
    }
  }
  if (!url) throw new Error(`no url: ${JSON.stringify(j).slice(0,300)}`);
  return { buf: Buffer.from(await (await fetch(url)).arrayBuffer()), seed: j.id };
}

const entries = [], errors = [];
for (const m of MOMENTS) {
  try {
    const dir = path.join(ART_BASE, m.id);
    await fs.mkdir(dir, { recursive: true });
    console.log(`▶ ${m.id} (${m.name})…`);
    const t0 = Date.now();
    const { buf, seed } = await genReplicate(m.prompt);
    let webp = await sharp(buf).webp({ quality: 85 }).toBuffer();
    if (webp.length > 500 * 1024) webp = await sharp(buf).webp({ quality: 70 }).toBuffer();
    await fs.writeFile(path.join(dir, 'v1.webp'), webp);
    const kb = Math.round(webp.length / 1024);
    console.log(`  ✓ ${kb}KB — ${((Date.now()-t0)/1000).toFixed(1)}s`);
    await fs.appendFile(LEDGER, JSON.stringify({ ts: new Date().toISOString(), provider: 'replicate', model: 'black-forest-labs/flux-1.1-pro-ultra', cardId: m.id, costUsd: COST, cycleN: CYCLE_N }) + '\n');
    entries.push({ id: `${m.id}-v1`, setId: 'bs-1-221b', character: m.character, name: m.name, tier: m.tier, shell: m.shell, parallel: m.parallel, elemental: m.elemental, prompt: m.prompt, provider: 'replicate', model: 'black-forest-labs/flux-1.1-pro-ultra', aspect: '2:3', seed: seed||null, costUsd: COST, generatedAt: new Date().toISOString(), path: `public/prototype-art/bs-1-221b/${m.id}/v1.webp`, sizeKb: kb });
  } catch(e) { console.error(`  ✗ ${m.id}: ${e.message}`); errors.push(m.id); }
}
if (entries.length) {
  let manifest = [];
  try { manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8')); } catch {}
  manifest.push(...entries);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}
console.log(`\n✅ Cycle 4: ${entries.length} ok, ${errors.length} failed — $${(entries.length*COST).toFixed(2)}`);
if (errors.length) { process.exit(2); }
