#!/usr/bin/env node
// Track A — Cycle 3: 4 more BS-1 "221B" PRIME Moments via FLUX 1.1 Pro Ultra / Replicate.
// Already rendered (Cycle 2): bs1-c01, bs1-c02, bs1-r01, bs1-u01
// This cycle renders: bs1-c03, bs1-c04, bs1-c05, bs1-l01

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
const CYCLE_N = 3;

const MOMENTS = [
  {
    id: 'bs1-c03',
    name: "Watson's Notebook",
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Watson',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga environmental intimacy + Drew Struzan compositional weight as ceiling.

SUBJECT: Dr. John Watson at his writing desk in 221B, night, 1882. Military bearing even seated — the squared shoulders of a man who straightens when he writes. Left hand pressed flat on an open notebook, pen in the right, mid-sentence. The notebook page half-filled with his familiar hand — not legible, but clearly case-notes.

SCENE: Watson's corner of the 221B sitting room. A small writing desk at the window. The window behind him shows London fog pressing against the glass, gas-lamp haloes visible through the murk. To his right: a cup of cold tea, a service revolver in its holster hung on the chair-back. Above the desk on the wall: a faded map of Afghanistan with a pencil circle around Kandahar.

ICONOGRAPHY: The open notebook — the Spine of Watson, the chronicler's physical instrument. The Afghanistan map — the wound carried. The cold tea — the hours spent in this chair.

NARRATIVE BEAT: The moment of composition — Watson working out how to say what he witnessed. Not transcription; interpretation.

COMPOSITION: Medium close-up, three-quarter view, desk at lower center. Window with fog behind Watson. The Afghanistan map at upper right — a secondary hidden detail a second look rewards.

LIGHT: Single oil lamp on the desk, warm amber. The fog outside accepts a little of the gaslight through the window — a cold halo behind Watson's head. The notebook page catches the lamp as the brightest element.

COLOR: Warm desk-lamp amber, oxblood chair, fog-grey exterior, the map a faded sepia. The notebook's white page as the singular brightness.

STAKES VISIBLE ON THE FACE: Concentration and private satisfaction — the man who loves his work without showing it publicly.

OFF-FRAME IMPLICATION: Watson's eye-line aimed slightly right and up — Holmes is across the room, doing something Watson is not currently writing about.

STYLE: John Singer Sargent oil density, Sidney Paget compositional grammar. Victorian realism, no pastiche. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
  },
  {
    id: 'bs1-c04',
    name: "Mrs Hudson on the Stairs",
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'WITNESS',
    elemental: 'REASON',
    character: 'Mrs Hudson',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Kazuo Oga quiet domestic intimacy as ceiling.

SUBJECT: Mrs Hudson, landlady of 221B Baker Street, ascending the stairs with a tea tray, mid-1880s. Small, sturdy, late-fifties, white cap and apron over dark dress. The tea tray carried two-handed, cups rattling slightly from the shouting that has been coming from upstairs. Her face: patient, long-suffering, the permanent near-sigh of a woman who has seen everything and continues to feed it.

SCENE: The famous staircase of 221B — seventeen steps, dark banister, the gaslight bracket at the first landing. From above, the sounds of a violin played very badly on purpose. Below, the street-door still swings slightly open, a cab visible through it. Mrs Hudson is at the fourth step, tray level, looking up with resigned pragmatism.

ICONOGRAPHY: The tea tray — Mrs Hudson's Lampblack, the domestic management that holds 221B together. The barely-swinging street-door below — the outside world, already excluded. The violin-noise implied from above (the tray's slight steam suggests the tea is still fresh, so she left the moment she heard the first bow-scrape).

NARRATIVE BEAT: The moment-during — Mrs Hudson doing what she has always done, because that is who she is, regardless of what is being done upstairs.

COMPOSITION: Low-angle view from the foot of the stairs looking up, Mrs Hudson mid-stair in center frame. The banister diagonal cuts the frame from lower-left to upper-right. The street-door below at extreme lower-left. The upstairs landing recedes above her into shadow.

LIGHT: The gaslight bracket at the first landing casts warm amber down the staircase. A cool grey from the street-door below. Mrs Hudson lit from above — warmth from the place she's going, cold from the world she's left.

COLOR: Dark banister, oxblood runner on the stairs, warm gaslight amber, Mrs Hudson's white cap the brightest point in the composition.

STAKES VISIBLE ON THE FACE: Patience as a permanent condition. Not martyrdom — not resentment — just the steadiness of someone who decided long ago that this was the house she would keep.

OFF-FRAME IMPLICATION: The violin above (implied by the tray's timing) — Holmes, offstage, unaware that the world continues to need feeding.

STYLE: Kazuo Oga domestic intimacy raised to Sargent oil density. Victorian staircase realism. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
  },
  {
    id: 'bs1-c05',
    name: "The Chemistry Bench",
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'ARCANA',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Alex Ross photo-real-mythic posture + Kazuo Oga environmental storytelling as ceiling.

SUBJECT: Sherlock Holmes at the 221B chemistry bench, 1882. Tall, gaunt, angular — hunched slightly over a retort, magnifying lens in the left hand, pipette in the right. The deerstalker is off — he is in shirtsleeves and waistcoat, the sleeves pushed to the elbow, acid stains on the cuffs. Eyes level with the glass apparatus, wholly absorbed.

SCENE: The chemistry corner of 221B sitting room — a bench along the far wall, crowded with glassware, spirit burners, chemical jars, a skull (bookend), and stacked case-files. The experiment in progress: a dark liquid in a retort, a second flask receiving a distillate that glows faintly green at the meniscus. Pipette in Holmes's hand directs a single drop.

ICONOGRAPHY: The single falling drop — the most precise gesture in the canon of exactitude. The acid-stained cuffs — the evidence of previous experiments, the cost of knowledge. The faintly glowing distillate — the ARCANA note: something in this experiment exceeds the strictly chemical.

NARRATIVE BEAT: Held breath — the drop suspended between pipette and flask. All of Holmes's intelligence compressed into this one half-second.

COMPOSITION: Three-quarter close-up. Holmes occupies the left two-thirds, bent forward, both hands visible with their instruments. The bench apparatus creates a horizontal band of visual complexity in the mid-frame. The glowing flask at center-right is the single light source for the composition's warm note.

LIGHT: The spirit burner below the retort (warm orange-red). The faintly glowing distillate (cool green). A gas wall-sconce far behind (dim). The glowing flask casts Holmes's shadow onto the wall behind him — and the shadow's silhouette is subtly wrong: where Holmes's sleeve is pushed back, the shadow shows a cuff, buttoned.

COLOR: Warm laboratory amber, acid-green chemistry glass, shadow-blue wall behind. The skull bookend white at the edge of frame.

STAKES VISIBLE ON THE FACE: Absolute absorption — the detective made entirely of attention. Nothing else exists.

OFF-FRAME IMPLICATION: The shadow with its buttoned cuff. Something in this frame is not entirely explained.

STYLE: Alex Ross photo-real posture, the shadow detail as the single ARCANA layer without breaking naturalistic register. Victorian chemistry realism at maximum density. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
  },
  {
    id: 'bs1-l01',
    name: "The Violin at Midnight",
    tier: 'Legendary',
    shell: 'PRIME',
    parallel: 'ARCANA',
    elemental: 'REASON',
    character: 'Sherlock Holmes',
    prompt: `Masterwork collectible card art — cinematic, narrative, devotee-grade. Register: MTG mythic-rare as floor; Drew Struzan theatrical grandeur + Alex Ross photo-real-mythic posture as ceiling. This is a Legendary card — elevated density, singular iconic gravity.

SUBJECT: Sherlock Holmes at 2am in the 221B sitting room, violin under chin, playing. Not badly — this is the private music, the music no one else hears. Tall, gaunt, hawkish profile. The bow drawn across in a long note, his eyes closed, the angular jaw at rest. The fingers on the strings are precise where the rest of him is loose — the one technical part of the performance grounding the emotional one.

SCENE: The sitting room at 2am. The gas lamps are low. The fire is down to embers — a dull red pool at the hearth. No Watson: the armchair is empty, a blanket on it, the outline of where Watson slept and was not woken. Holmes stands near the window; through the fog-heavy glass, the gas lamps on Baker Street are orange haloes. The violin sound (implied) is the one thing in the city still moving.

ICONOGRAPHY: The violin — the second Spine instrument alongside the pipe, the part of Holmes that processes what the intellect cannot yet name. The empty armchair with the blanket — Watson asleep elsewhere, present in his absence. The orange fog-halo gas lamps through the window — the city held at bay.

NARRATIVE BEAT: The moment-during — Holmes processing the day's case through music. Not performance; not practice; not boredom. Something between memory and deduction, which has no name in the vocabulary of investigation.

COMPOSITION: Drew Struzan orbital — Holmes centered, near full-height, violin mid-frame. The empty armchair in the lower-right third. The fog-window at upper-left, the gas lamps creating an accidental halo geometry behind Holmes's head.

LIGHT: "Alvinized" — a warm gold nimbus around Holmes that has no source in the room. The embers at lower-right create a low warm note. The fog-lamp halos create a secondary cold ring at the window. Holmes stands inside his own light, as if the music generates it.

COLOR: Deep shadow-blue sitting room, ember-red hearth, fog-orange gas-lamp halos, the Alvinized gold on Holmes. The violin's wood a warm amber in the false light.

STAKES VISIBLE ON THE FACE: Whatever passes through Holmes when he plays — the rare face that is not the detective's face. Present in a room, for once, without solving it.

OFF-FRAME IMPLICATION: The gas lamps outside — London waiting, the next case already moving in the fog, unaware it is being anticipated.

STYLE: Drew Struzan orbital composition at full Legendary density. Alex Ross photo-real posture for Holmes himself. The Alvinized gold light as the single non-naturalistic register. No text, no letters, no watermarks, no borders. PUBLIC-DOMAIN SOURCE: Arthur Conan Doyle, Sherlock Holmes canon, 1887–1927.`,
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
        input: { prompt, aspect_ratio: '2:3', output_format: 'png', safety_tolerance: 5, raw: false },
      }),
    }
  );
  if (!submit.ok) throw new Error(`replicate ${submit.status}: ${await submit.text()}`);
  const j = await submit.json();
  if (j.status === 'starting' || j.status === 'processing') {
    const pollUrl = j.urls?.get;
    if (!pollUrl) throw new Error(`no poll url, status=${j.status}`);
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const poll = await fetch(pollUrl, { headers: { Authorization: `Bearer ${KEY}` } });
      const p = await poll.json();
      if (p.status === 'succeeded') {
        const url = Array.isArray(p.output) ? p.output[0] : p.output;
        return { buf: Buffer.from(await (await fetch(url)).arrayBuffer()), seed: p.id };
      }
      if (p.status === 'failed' || p.status === 'canceled') throw new Error(`poll ${p.status}`);
    }
    throw new Error('poll timeout');
  }
  const url = Array.isArray(j.output) ? j.output[0] : j.output;
  if (!url) throw new Error(`no output url: ${JSON.stringify(j).slice(0, 300)}`);
  return { buf: Buffer.from(await (await fetch(url)).arrayBuffer()), seed: j.id };
}

async function renderMoment(moment) {
  const cardDir = path.join(ART_BASE, moment.id);
  await fs.mkdir(cardDir, { recursive: true });
  console.log(`\n▶ ${moment.id} (${moment.name})…`);
  const t0 = Date.now();
  const { buf, seed } = await genReplicate(moment.prompt);
  const webp = await sharp(buf).webp({ quality: 85 }).toBuffer();
  const kb = (webp.length / 1024).toFixed(0);
  const finalBuf = webp.length > 500 * 1024
    ? await sharp(buf).webp({ quality: 70 }).toBuffer()
    : webp;
  await fs.writeFile(path.join(cardDir, 'v1.webp'), finalBuf);
  console.log(`  ✓ ${kb}KB — ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await fs.appendFile(LEDGER, JSON.stringify({ ts: new Date().toISOString(), provider: 'replicate', model: 'black-forest-labs/flux-1.1-pro-ultra', cardId: moment.id, costUsd: COST_PER_RENDER, cycleN: CYCLE_N }) + '\n');
  return { id: `${moment.id}-v1`, setId: 'bs-1-221b', character: moment.character, name: moment.name, tier: moment.tier, shell: moment.shell, parallel: moment.parallel, elemental: moment.elemental, prompt: moment.prompt, provider: 'replicate', model: 'black-forest-labs/flux-1.1-pro-ultra', aspect: '2:3', seed: seed || null, costUsd: COST_PER_RENDER, generatedAt: new Date().toISOString(), path: `public/prototype-art/bs-1-221b/${moment.id}/v1.webp`, sizeKb: parseInt(kb, 10) };
}

const newEntries = [], errors = [];
for (const m of MOMENTS) {
  try { newEntries.push(await renderMoment(m)); }
  catch (e) { console.error(`  ✗ ${m.id}: ${e.message}`); errors.push({ id: m.id, error: e.message }); }
}
if (newEntries.length) {
  let manifest = [];
  try { manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8')); } catch {}
  manifest.push(...newEntries);
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}
console.log(`\n✅ Cycle 3: ${newEntries.length} ok, ${errors.length} failed — $${(newEntries.length * COST_PER_RENDER).toFixed(2)}`);
if (errors.length) { errors.forEach(e => console.error(`  - ${e.id}: ${e.error}`)); process.exit(2); }
