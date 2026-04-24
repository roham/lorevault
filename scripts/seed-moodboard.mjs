#!/usr/bin/env node
// Fast batched seeder for /moodboard. Runs gpt-image-1 with configurable concurrency,
// converts to WebP via sharp, appends to public/moodboard-art/manifest.json.
//
// Usage:
//   node scripts/seed-moodboard.mjs [--count=50] [--concurrency=10]
//
// Env: OPENAI_API_KEY required.

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY not set');
  process.exit(1);
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  }),
);
const COUNT = parseInt(args.count ?? '50', 10);
const CONCURRENCY = parseInt(args.concurrency ?? '5', 10);
const RATE_LIMIT_PER_MIN = parseInt(args.rpm ?? '5', 10); // gpt-image-1 tier-1 = 5/min
const MAX_RETRIES = parseInt(args.retries ?? '4', 10);
const FORCE = args.force === 'true' || args.force === '1';
const PROMPT_VERSION = 3; // v3: MTG-floor + cinematic-ceiling + canon-devotee iconography

const OUT_DIR = path.resolve(process.cwd(), 'public/moodboard-art');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

// v3 character entries encode FIVE prompt-critical fields:
// - scene: environmental staging (Oga-style biographical detail)
// - iconography: the one anchor object that devotees will instantly clock
// - beat: the narrative beat framing (moment-of-decision / aftermath / held-breath / portent / dyad)
// - composition: the compositional archetype (hero-contrapposto / off-frame-eyeline / scale-contrast / etc)
// - offFrame: what sits just beyond the image implied by eye-line or shadow
const CHARACTERS = [
  { set: 'baker-street', slug: 'sherlock-holmes', character: 'Sherlock Holmes', moment: '221B Baker Street, the moment before a case breaks',
    scene: 'tobacco-stained wallpaper with bullet-pocked "V.R." patriot cipher, Persian slipper of loose shag tobacco on the hearth, chemistry flasks half-full, London fog pressing against the leaded window, a single kerosene lamp carving him out of gaslight',
    iconography: 'the Paget deerstalker cap and Inverness cape — the Sidney Paget silhouette devotees immediately read',
    beat: 'held breath — eyes already past the visitor at the door, three deductions ahead',
    composition: 'three-quarter hawkish hero in classical contrapposto, shallow focus on his face, apartment details in Moebius receding-density rendering',
    offFrame: 'Watson\'s service-revolver shadow falling into the scene from the right',
    origin: 'Arthur Conan Doyle 1887, visual canon Sidney Paget 1891' },
  { set: 'baker-street', slug: 'moriarty', character: 'Professor Moriarty', moment: 'The Napoleon of Crime at his desk',
    scene: 'gaslight-green banker\'s lamp carving the reptilian skull out of deep shadow, wall of pinned London crimes behind him connected by crimson thread, a chess problem half-solved on the desk, a gold pocket-watch open and facing away',
    iconography: 'the oscillating head and the singular spider-web of threads — predatory intellect made spatial',
    beat: 'moment-of-aftermath — the crime is already done; the viewer is the next',
    composition: 'negative-space dread with the figure small against a wall of evidence, A24-style eerie composition',
    offFrame: 'his gaze fixed past the viewer at a future we aren\'t yet aware of',
    origin: 'Arthur Conan Doyle 1893, visual canon Sidney Paget' },
  { set: 'baker-street', slug: 'irene-adler', character: 'Irene Adler', moment: 'The Woman, at first light after the game is won',
    scene: 'men\'s evening dress and opera cloak half-shed, a photograph held between gloved fingers like a drawn pistol, first pale Belgravia dawn through tall windows, champagne flute abandoned, a faint smile that is not a smile',
    iconography: 'the photograph — small, precise, decisive — Bass-symbol the entire plot',
    beat: 'moment-of-triumph held in stillness',
    composition: 'held-breath portrait with Alex Ross photo-real figure in mythic-still posture',
    offFrame: 'the viewer\'s (Holmes\'s) defeat implied by her half-turn',
    origin: 'Arthur Conan Doyle 1891, visual canon Sidney Paget' },
  { set: 'baker-street', slug: 'the-hound', character: 'The Hound of the Baskervilles', moment: 'Across the moor at the witching hour',
    scene: 'enormous coal-black hound frozen mid-charge across phosphorescent moorland mist, jaws dripping spectral green fire (phosphorus trickery), tor stones silhouetted against a blood-moon, primordial terror given geometry',
    iconography: 'the spectral green fire on the jaws — the one element that tips supernatural into almost-real',
    beat: 'moment-of-decision — the instant the viewer must flee or stand',
    composition: 'scale contrast — tiny observer implied in foreground, hound enormous in midground, moor stretching to infinity',
    offFrame: 'the boot-prints of a man running, leading off-frame left',
    origin: 'Arthur Conan Doyle 1902, visual canon Sidney Paget' },
  { set: 'enchanted-kingdom', slug: 'snow-white', character: 'Snow White', moment: 'The instant before the bite',
    scene: 'young princess alone at the cottage threshold, poisoned red apple cradled in both hands like a sacrament, enchanted forest leaning in around her, seven tiny lanterns glimmering distant among the black trees, a single bluebird on her wrist watching the apple',
    iconography: 'the poisoned red apple — the one iconic object that carries the whole fable',
    beat: 'moment-of-decision held on the instant of choice',
    composition: 'Kay Nielsen swooping-line composition with negative-space dread; the forest is a cathedral',
    offFrame: 'the Evil Queen\'s disguised silhouette implied in the doorway behind her',
    origin: 'Brothers Grimm 1812, visual canon Kay Nielsen 1925 + Arthur Rackham' },
  { set: 'enchanted-kingdom', slug: 'evil-queen', character: 'The Evil Queen', moment: 'Before the scrying mirror — the verdict',
    scene: 'regal silhouette in black iron crown and jeweled collar, skeletal hand outstretched toward a mirror of liquid silver that is just beginning to show a distant face, ravens perched around the mirror\'s frame, candlelit obsidian chamber, embroidered sigils across the floor',
    iconography: 'the liquid-silver mirror with a barely-resolved rival face — the Bass-symbol for vanity and murder',
    beat: 'portent — the moment the mirror\'s answer turns in her stomach',
    composition: 'chiaroscuro silhouette — she is shape, the mirror is light',
    offFrame: 'the huntsman\'s axe propped just out of frame, instruction not yet given',
    origin: 'Brothers Grimm 1812, visual canon Kay Nielsen' },
  { set: 'enchanted-kingdom', slug: 'red-riding-hood', character: 'Little Red Riding Hood', moment: 'Alone in the deep wood',
    scene: 'a child of seven in crimson wool cloak — the single bright shape in a cathedral of vertical black trees — pale yellow wolf-eyes resolving among the trunks at three separate distances, scattered breadcrumbs, basket clutched, not yet afraid',
    iconography: 'the crimson cloak — one shape, one color, the whole story',
    beat: 'portent — wolf-eyes just visible, she hasn\'t noticed yet',
    composition: 'negative-space dread, A24-scale — subject tiny, forest vast, Kay Nielsen verticals',
    offFrame: 'a grandmother\'s cottage implied by a thread of chimney smoke at the horizon',
    origin: 'Charles Perrault 1697, visual canon Gustave Doré 1862 + Kay Nielsen' },
  { set: 'enchanted-kingdom', slug: 'rumpelstiltskin', character: 'Rumpelstiltskin', moment: 'At the spinning wheel, midnight bargain',
    scene: 'bent imp-figure at a spinning wheel drawing molten gold thread between knotted hands, fireplace throwing jagged Nosferatu shadows up a stone wall, piles of already-spun gold coiled around bare feet, a name written half-legibly in dust where his boot will soon scuff it away',
    iconography: 'the spinning wheel spilling gold — and his half-seen name in the dust',
    beat: 'held breath — the thread one turn from completion',
    composition: 'German expressionist silhouette + Dürer-density background',
    offFrame: 'the queen\'s young child implied by a cradle\'s shadow on the left wall',
    origin: 'Brothers Grimm 1812, visual canon Arthur Rackham + Kay Nielsen' },
  { set: 'wonderland', slug: 'alice', character: 'Alice', moment: 'Falling through the rabbit hole',
    scene: 'blue pinafore trailing upward as she plummets through an impossible tunnel, cupboards of glass jars and oil portraits receding into vanishing perspective, a pocket watch, a teacup, a falling pair of spectacles, tunnel walls flaring with dream-logic color',
    iconography: 'the blue pinafore and white apron — the Tenniel-canonical Alice silhouette',
    beat: 'moment-of-decision suspended — gravity without consent',
    composition: 'receding-density (Moebius) tunnel with scale contrast; Alice sharp, objects loose, depth infinite',
    offFrame: 'the White Rabbit\'s waistcoat implied by a streak of white beneath her',
    origin: 'Lewis Carroll 1865, visual canon John Tenniel 1865' },
  { set: 'wonderland', slug: 'cheshire-cat', character: 'The Cheshire Cat', moment: 'Fading on the branch',
    scene: 'stripes of bruised purple and phosphor teal dissolving into bioluminescent moonlit air, only the impossible grin fully resolved, mushroom canopy beneath, Tenniel-style cross-hatched bark forming a perfect oak branch',
    iconography: 'the grin alone — Bass-symbol of the nonsense-truth of Wonderland',
    beat: 'aftermath — the cat is already leaving',
    composition: 'Saul Bass icon-reduction with Tenniel line accents',
    offFrame: 'Alice\'s upturned face implied by a sliver of pinafore blue at bottom',
    origin: 'Lewis Carroll 1865, visual canon John Tenniel' },
  { set: 'wonderland', slug: 'mad-hatter', character: 'The Mad Hatter', moment: 'Mid-riddle at the tea party',
    scene: 'wild-haired hatter paused mid-sentence at a long broken table, mismatched cups levitating from tea-pouring, March Hare to one side, dormouse emerging from a teapot, pocket watch smeared with butter, sky impossibly chartreuse-green',
    iconography: 'the top hat with the "10/6" price ticket still tucked in the band',
    beat: 'held breath — the riddle not yet answered',
    composition: 'relational triangle — Hatter, March Hare, and the teapot-dormouse — Pixar-style',
    offFrame: 'the teapot\'s steam drifting off-right toward Alice we can\'t see',
    origin: 'Lewis Carroll 1865, visual canon John Tenniel' },
  { set: 'wonderland', slug: 'queen-of-hearts', character: 'The Queen of Hearts', moment: 'Mid-verdict',
    scene: 'wrathful crowned monarch thundering forward, card-soldier guards ducking out of her path, rose garden behind her dripping fresh red paint over white, croquet mallet raised, royal rage at the scale of small-kingdom',
    iconography: 'the heart-embroidered cloak and playing-card guards — the Tenniel-canonical Wonderland uniform',
    beat: 'moment-of-action — shouted already',
    composition: 'Frank Miller chiaroscuro silhouette — queen as pure shape, guards as paper-thin cutouts',
    offFrame: 'the King\'s tiny nervous gesture implied by a small shadow beside her',
    origin: 'Lewis Carroll 1865, visual canon John Tenniel' },
  { set: 'gothic-horror', slug: 'dracula', character: 'Count Dracula', moment: 'Enthroned at midnight mass',
    scene: 'tall aristocrat on a throne of black iron ringed by candelabras, bats wheeling through crypt light, crimson velvet and wax pooling, moon through the ruined rose window behind him, Byzantine icons dim in recesses, a single gold ring on his pale hand',
    iconography: 'the towering shadow cast against the wall — larger than the man, already predatory',
    beat: 'held breath — the visitor just entered',
    composition: 'Coppola-1992 shadow-as-character composition; Alex Ross photo-real figure in mythic-still posture',
    offFrame: 'the three brides implied by three additional shadows behind the throne',
    origin: 'Bram Stoker 1897, visual canon Coppola 1992 + F. W. Murnau 1922' },
  { set: 'gothic-horror', slug: 'frankenstein-monster', character: "Frankenstein's Monster", moment: 'The first breath',
    scene: 'stitched giant rising from the slab as electricity arcs across copper Tesla coils, lightning cracking the attic skylight, first conscious eyes opening to a world he did not ask for, laboratory glass shattering around him, Victor Frankenstein collapsed to his knees in shadow',
    iconography: 'the stitched hand rising toward the light — creation\'s own hand reaching back at its maker',
    beat: 'moment-of-awakening — the one instant before self-awareness',
    composition: 'relational triangle — monster, creator, and the elemental light between them (Pixar rule applied)',
    offFrame: 'the journal page flying off the desk in the storm',
    origin: 'Mary Shelley 1818, visual canon Nino Frank + Whale 1931 + Bernie Wrightson' },
  { set: 'gothic-horror', slug: 'jekyll', character: 'Dr. Jekyll becoming Mr. Hyde', moment: 'Transformation mid-change',
    scene: 'split-figure: dignified Victorian doctor on one half, feral Hyde on the other, bubbling green elixir dropped and shattering on the floor, moonlight carving the transition through a laboratory skylight, reflected image in shattered glass multiplying the split',
    iconography: 'the shattered glass beaker — the single object that IS the story',
    beat: 'moment-mid-transformation — held between identities',
    composition: 'multiple time beats — past self, present split, future self in mirror fragments',
    offFrame: 'Utterson\'s knock at the door implied by the cast shadow of a hand',
    origin: 'R. L. Stevenson 1886, visual canon Mervyn Peake + John Barrymore 1920 film stills' },
  { set: 'gothic-horror', slug: 'phantom', character: 'The Phantom of the Opera', moment: 'At the underground organ',
    scene: 'masked figure at a monumental pipe organ on a stone island in black subterranean water, candelabras spilling wax, chandelier hooks above, scored manuscript pages floating on the water, single red rose on the keyboard',
    iconography: 'the white half-mask — Bass-symbol of the unshown face',
    beat: 'held breath — one chord struck, sustained, not released',
    composition: 'negative-space dread in the cavernous chamber, subject carved by Caravaggio tenebrism',
    offFrame: 'Christine\'s white ballet slipper implied on the boat at the water\'s edge',
    origin: 'Gaston Leroux 1910, visual canon Lon Chaney 1925 silent film' },
  { set: 'greek-myth', slug: 'prometheus', character: 'Prometheus', moment: 'The instant the fire changes hands',
    scene: 'titan descending from storm-clouds clutching a living ember in a fennel stalk, golden firelight spilling across his chest, Zeus\'s eagle already screaming at distance in pursuit, huddled mortals watching from below with faces upturned like a Renaissance altarpiece',
    iconography: 'the ember in the fennel stalk — the one object = the whole myth (Bass)',
    beat: 'moment-of-decision — the gift about to be given',
    composition: 'Waterhouse pre-Raphaelite reverent melancholy; relational triangle (titan, mortals, eagle)',
    offFrame: 'the Caucasus chain implied in the distance — his future punishment telegraphed',
    origin: 'Hesiod c.700 BCE, visual canon John Singer Sargent + Waterhouse' },
  { set: 'greek-myth', slug: 'medusa', character: 'Medusa', moment: 'Amid her garden of stone',
    scene: 'serpent-hair alive and turning in multiple directions at once, marble warriors frozen mid-scream encircling her throne, a single gold tear on her cheek, basalt cavern lit by oil lamps, olive branches cast into shadow',
    iconography: 'the single golden tear — the detail that transmutes monster into tragedy',
    beat: 'aftermath held as stillness',
    composition: 'Waterhouse reverent melancholy; scale contrast with frozen warriors at periphery',
    offFrame: 'Perseus\'s reflective shield implied by a distant glint at cave mouth',
    origin: 'Hesiod c.700 BCE, visual canon Caravaggio 1597 + Waterhouse' },
  { set: 'greek-myth', slug: 'zeus', character: 'Zeus', moment: 'Mid-throw on Olympus',
    scene: 'god-king frozen in the throwing posture of a forking lightning bolt, marble pillars cracking with the force, eagles circling overhead, storm clouds parting to reveal infinite blue, olive crown blazing, muscles of the Parthenon caryatids rendered in fresh light',
    iconography: 'the forking lightning bolt — Bass-symbol of divine authority',
    beat: 'held breath — the bolt cocked, not yet released',
    composition: 'classical contrapposto (the Theros move), Alex Ross photo-real figure in mythic posture',
    offFrame: 'his target implied by the direction of the bolt',
    origin: 'Hesiod c.700 BCE, visual canon Phidias + Bouguereau' },
  { set: 'greek-myth', slug: 'athena', character: 'Athena', moment: 'Dawn on the Acropolis',
    scene: 'gray-eyed goddess in crested Corinthian helm and gleaming aegis, golden owl perched on her shoulder in perfect stillness, spear planted beside her, Acropolis columns silhouetted in rose-gold dawn behind, olive trees catching first light',
    iconography: 'the owl — single companion, single perfect detail, the whole goddess',
    beat: 'held breath — before the word of counsel',
    composition: 'Waterhouse reverent melancholy; calm lethality',
    offFrame: 'the city of Athens waking at the feet of the temple — implied by a thread of smoke',
    origin: 'Hesiod c.700 BCE, visual canon Phidias Athena Parthenos + Waterhouse' },
];

// Style descriptions are aimed at peak collectible-card art — premium mythic-rare TCG,
// holographic, cinematic. Each description forces density of detail, dramatic lighting,
// and a hero-shot composition.
const STYLES = [
  // Powerhouse painterly — the Frazetta/Struzan/Amano lineage
  { slug: 'frazetta-painterly', style: 'Frazetta painterly fantasy', desc: 'Frank Frazetta oil-on-board fantasy painting — heroic anatomy, volumetric amber-and-crimson lighting, dynamic diagonal composition, impasto brushwork, epic mood, museum fantasy masterwork' },
  { slug: 'struzan-poster', style: 'Drew Struzan theatrical', desc: 'Drew Struzan theatrical movie poster — cinematic hero-shot, airbrush-meets-pencil realism, golden rim light and deep negative space, supporting scene elements orbiting the subject, 1980s blockbuster grandeur' },
  { slug: 'alex-ross-realism', style: 'Alex Ross hyper-realist', desc: 'Alex Ross gouache hyper-realism — photoreal figure study, dramatic low-angle hero framing, sculptural lighting, saturated color against muted sky, iconic comic-cover gravitas' },
  { slug: 'amano-ethereal', style: 'Yoshitaka Amano ethereal', desc: 'Yoshitaka Amano ethereal watercolor — translucent washes, elongated figures, metallic gold leaf accents, negative space bloom, dreamlike fantasy royalty, Final Fantasy concept-art splendor' },
  { slug: 'mtg-mythic', style: 'Premium mythic card art', desc: 'Premium mythic-rare TCG art — lush painterly fantasy, dramatic action in a detailed environment, cinematic rim light, chromatic saturation, atmospheric effects, premium collectible-card composition' },
  { slug: 'beksinski-surreal', style: 'Beksiński dark surrealism', desc: 'Zdzisław Beksiński dark surrealism — otherworldly decay, ochre and blood palette, architectural dread, painterly textures, unsettling sublime' },
  { slug: 'ghibli-painted', style: 'Studio Ghibli painted', desc: 'Studio Ghibli painted background — Kazuo Oga-style atmospheric perspective, soft gouache, luminous natural light, hand-painted environmental richness, humane awe' },
  { slug: 'mucha-maximal', style: 'Mucha maximal Art Nouveau', desc: 'Alphonse Mucha maximalist Art Nouveau — ornamental gilded frame integrated into the composition, flowing hair as decorative border, halo of botanical filigree, jewel-tone flat color against gold leaf, stained-glass pattern backdrop' },
  // Refined historical — pushed toward their most dramatic expressions
  { slug: 'baroque-oil', style: 'Baroque oil chiaroscuro', desc: 'Caravaggio tenebrism oil painting — single dramatic directional light source out of deep black, jewel-tone velvet and gold, visible impasto, theatrical religious-painting gravitas, museum old-master finish' },
  { slug: 'dore-etching', style: 'Gustave Doré engraving', desc: 'Gustave Doré steel engraving — infinite fine crosshatch depth, apocalyptic chiaroscuro, Inferno-level dramatic density, sepia monochrome, sublime Victorian fantasy illustration' },
  { slug: 'tarot-baroque', style: 'Baroque tarot card', desc: 'Baroque tarot card illustration in the Rider-Waite-Smith lineage pushed to maximum — ornate gold-foil frame integrated into the art, symbolic iconography encoded in the composition, jewel-tone flat color plates, medieval illumination density' },
  { slug: 'stained-glass', style: 'Cathedral stained glass', desc: 'Cathedral stained-glass panel at maximum density — heavy black leaded lines defining every contour, saturated jewel-tone glass (ruby, sapphire, emerald), backlit cathedral luminosity, ornamental tracery border' },
  { slug: 'german-expressionist', style: 'Expressionist woodblock', desc: 'German expressionist woodblock print in the Kirchner/Nolde lineage — jagged gouged lines, stark psychological intensity, bold chromatic accents against monochrome chaos, Caligari-era cinema atmosphere' },
  { slug: 'moebius-comic', style: 'Moebius comic panel', desc: 'Jean Giraud "Moebius" comic art — clean confident linework, flat washed alien color, surreal architectural detail, 1970s Métal Hurlant grandeur, dreamlike hero composition' },
  { slug: 'golden-age-illustration', style: 'Golden Age storybook', desc: 'Golden Age of Illustration — Arthur Rackham and Edmund Dulac combined, watercolor and ink, gnarled detailed trees and delicate figures, borderline gilt frame, Edwardian fantasy book-plate quality' },
  { slug: 'deco-travel-poster', style: 'Art Deco hero poster', desc: 'Art Deco theatrical poster — bold geometric shapes, stylized silhouette at heroic scale, ziggurat-era sunburst behind subject, gold leaf and three-color saturated palette, 1930s monumental graphic design' },
  { slug: 'cyberpunk-noir', style: 'Cyberpunk neon epic', desc: 'Cyberpunk neon-noir with epic scale — magenta/cyan chromatic lighting against deep black, rain-slick mirrored surfaces, holographic atmosphere, Syd Mead meets Blade Runner 2049 futurist grandeur' },
  { slug: 'victorian-engraving', style: 'Victorian steel engraving', desc: 'Victorian steel-plate engraving at maximum density — infinite crosshatch and stipple, sepia monochrome, 1880s Harper\'s frontispiece-quality period detail, dramatic theatrical lighting' },
  { slug: 'noir-poster-30s', style: '1930s noir poster', desc: '1930s theatrical noir movie poster — silver halide grain, hard chiaroscuro, smoke and rain, limited palette of charcoal, blood and cream, dramatic typography-free hero composition' },
  { slug: 'silent-film-still', style: 'Expressionist silent-film still', desc: 'German expressionist silent-film still — Caligari / Metropolis / Nosferatu lineage, black-and-white with soft halation grain, theatrical extreme lighting, painted-set architectural drama' },
  { slug: 'pulp-scifi', style: '1950s pulp cover', desc: '1950s pulp science-fiction magazine cover — gouache paint, saturated primary palette, dynamic low-angle hero pose, retro-futurist grandeur, pulp-heroic energy' },
  { slug: 'cel-anime-modern', style: 'Cinematic anime cel', desc: 'Cinematic anime key-art — detailed Makoto Shinkai / Production I.G lineage, volumetric god-ray lighting, painted sky with particle bloom, crisp cel-shaded figure against atmospheric depth' },
  { slug: 'chiaroscuro-woodcut', style: 'Dürer woodcut density', desc: 'Albrecht Dürer woodcut at maximum density — stark black on cream, heavy hatching defining every form, medieval detail in clothing and environment, apocalyptic gravitas' },
  { slug: 'sumi-e', style: 'Akira Kurosawa sumi-e', desc: 'Cinematic sumi-e ink painting — Kurosawa framing meets Sesshu Toyo mastery, bold sweeping brushstrokes with explosive density at focal point, silver-leaf background hints, dramatic negative space with a single vivid chromatic accent' },
  // Canon-devotee line styles — for fans of the originary Victorian/Edwardian illustration tradition
  { slug: 'paget-linework', style: 'Sidney Paget ink illustration', desc: 'Sidney Paget 1891 Strand Magazine ink and wash — fine hatched line, gaslit fog, precise Victorian architectural and costume detail, two-figure silhouette compositions, the canonical visual register devoted Sherlockians expect' },
  { slug: 'tenniel-ink', style: 'John Tenniel wood-engraving', desc: 'John Tenniel 1865 wood-engraving — precise cross-hatched line, no paint, blue-pinafore canonical Alice, the White-Rabbit waistcoat-and-watch register, the definitive illustration tradition of the Carroll canon' },
];

function seededShuffle(arr, seed) {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickPairs(count) {
  // First pass: at least one of every STYLE. Pair each style with a random character.
  const shuffledChars = seededShuffle(CHARACTERS, 7);
  const firstPass = STYLES.map((s, i) => [shuffledChars[i % shuffledChars.length], s]);
  // Second pass: fill the rest by seeded-shuffling all remaining (char, style) pairs.
  const used = new Set(firstPass.map(([c, s]) => `${c.slug}::${s.slug}`));
  const all = [];
  for (const c of CHARACTERS) for (const s of STYLES) {
    if (!used.has(`${c.slug}::${s.slug}`)) all.push([c, s]);
  }
  const fill = seededShuffle(all, 42).slice(0, Math.max(0, count - firstPass.length));
  return [...firstPass, ...fill].slice(0, count);
}

// v3 prompt template.
// Baseline: MTG mythic-rare floor. Ceiling: Drew Struzan + Kazuo Oga + Alex Ross.
// Structure borrows WotC's 7-field discipline (Setting/Intent/Location/Action/Focus/Mood)
// and adds cinematic vocabulary (narrative beat, composition archetype, off-frame
// implication, iconographic symbol, Alvinized light).
function buildPrompt(c, s) {
  return [
    `Masterwork collectible trading-card art — cinematic, narrative, devotee-grade.`,
    `Register: Magic: The Gathering mythic-rare as floor; Drew Struzan theatrical composition + Kazuo Oga environmental intimacy + Alex Ross photo-real-mythic posture as ceiling.`,
    `SUBJECT: ${c.character} — ${c.moment}.`,
    `SCENE: ${c.scene}.`,
    `ICONOGRAPHY (the single anchor object that IS the story, Saul Bass symbol-wound): ${c.iconography}.`,
    `NARRATIVE BEAT: ${c.beat}.`,
    `COMPOSITION: ${c.composition}.`,
    `OFF-FRAME IMPLICATION: ${c.offFrame}.`,
    `LIGHT: single dramatic directional source, "Alvinized" (one mythologizing light quality absent from the literal source text).`,
    `COLOR: emotional palette — color temperature encodes the stakes, not a faction.`,
    `STAKES VISIBLE ON THE FACE: the specific emotion the moment demands — read it on the character.`,
    `STYLE: ${s.desc}.`,
    `FORBIDDEN: text, letters, watermark, logo, signature, frame, border, Marvel-action yelling. Stillness over spectacle; the art-market beloved are quiet (Guay, Oga, Rackham) not shouty.`,
    `PUBLIC-DOMAIN SOURCE: ${c.origin}.`,
  ].join(' ');
}

// Token-bucket rate limiter: max N starts per rolling window.
class RateLimiter {
  constructor(maxPerWindow, windowMs) {
    this.max = maxPerWindow;
    this.win = windowMs;
    this.stamps = [];
  }
  async acquire() {
    while (true) {
      const now = Date.now();
      this.stamps = this.stamps.filter((t) => now - t < this.win);
      if (this.stamps.length < this.max) {
        this.stamps.push(now);
        return;
      }
      const wait = this.win - (now - this.stamps[0]) + 200;
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}
const limiter = new RateLimiter(RATE_LIMIT_PER_MIN, 60_000);

function parseRetryAfterSeconds(text) {
  const m = text.match(/try again in (\d+)s/i);
  return m ? parseInt(m[1], 10) + 1 : 15;
}

async function generate(c, s) {
  const prompt = buildPrompt(c, s);
  let lastErr = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    await limiter.acquire();
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1536',
        quality: 'high',
        n: 1,
      }),
    });
    if (res.ok) { const j = await res.json(); return await processImage(c, s, prompt, j); }
    const body = await res.text();
    if (res.status === 429) {
      const wait = parseRetryAfterSeconds(body);
      process.stdout.write(`  · 429 ${c.slug}×${s.slug}, waiting ${wait}s (attempt ${attempt + 1}/${MAX_RETRIES + 1})\n`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      lastErr = new Error(`429 after ${MAX_RETRIES} retries: ${body.slice(0, 200)}`);
      continue;
    }
    if (res.status === 400 && /moderation_blocked/.test(body)) {
      throw new Error(`moderation_blocked (permanent skip): ${body.slice(0, 200)}`);
    }
    throw new Error(`${res.status} ${body.slice(0, 400)}`);
  }
  throw lastErr ?? new Error('max retries exceeded');
}

async function processImage(c, s, prompt, j) {
  const b64 = j.data?.[0]?.b64_json;
  if (!b64) throw new Error(`no b64_json in response: ${JSON.stringify(j).slice(0, 200)}`);
  const png = Buffer.from(b64, 'base64');
  const webp = await sharp(png).webp({ quality: 85 }).toBuffer();
  const dir = path.join(OUT_DIR, c.slug);
  await fs.mkdir(dir, { recursive: true });
  const fname = `${s.slug}-1.webp`;
  await fs.writeFile(path.join(dir, fname), webp);
  return {
    id: `${c.slug}-${s.slug}-1`,
    character: c.character,
    characterSlug: c.slug,
    set: c.set,
    moment: c.moment,
    style: s.style,
    styleSlug: s.slug,
    variant: 1,
    path: `/moodboard-art/${c.slug}/${fname}`,
    prompt,
    promptVersion: PROMPT_VERSION,
    model: 'gpt-image-1',
    costUsd: 0.17,
    generatedAt: new Date().toISOString(),
    bytes: webp.length,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let existing = { version: 1, items: [] };
  try { existing = JSON.parse(await fs.readFile(MANIFEST, 'utf8')); } catch {}
  // If --force: regenerate even if the ID exists (for prompt-template upgrades).
  // Otherwise: skip IDs we already have at the current PROMPT_VERSION.
  const upToDateIds = new Set(
    existing.items
      .filter((i) => (i.promptVersion ?? 1) >= PROMPT_VERSION)
      .map((i) => i.id),
  );
  const pairs = pickPairs(COUNT);
  const todo = FORCE
    ? pairs
    : pairs.filter(([c, s]) => !upToDateIds.has(`${c.slug}-${s.slug}-1`));
  console.log(
    `target ${pairs.length}, up-to-date at v${PROMPT_VERSION}: ${pairs.length - todo.length}, generating ${todo.length} ` +
    `@ concurrency=${CONCURRENCY}, rate=${RATE_LIMIT_PER_MIN}/min${FORCE ? ' [FORCE]' : ''}`,
  );
  const startTs = Date.now();
  const items = [];
  const errors = [];
  let cursor = 0;
  async function worker(_id) {
    while (true) {
      const my = cursor++;
      if (my >= todo.length) return;
      const [c, s] = todo[my];
      try {
        const item = await generate(c, s);
        items.push(item);
        process.stdout.write(`✓ [${my + 1}/${todo.length}] ${c.character} × ${s.style} (${(item.bytes / 1024).toFixed(0)}KB)\n`);
      } catch (e) {
        errors.push({ char: c.slug, style: s.slug, error: String(e) });
        process.stdout.write(`✗ [${my + 1}/${todo.length}] ${c.character} × ${s.style}: ${String(e).slice(0, 200)}\n`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  // Prefer NEW items over existing when IDs collide (force-regen path).
  // Also drop items whose style was removed from the current palette.
  const newIds = new Set(items.map((i) => i.id));
  const liveStyleSlugs = new Set(STYLES.map((s) => s.slug));
  const merged = [
    ...existing.items.filter((i) => !newIds.has(i.id) && liveStyleSlugs.has(i.styleSlug)),
    ...items,
  ];
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    model: 'gpt-image-1',
    totalImages: merged.length,
    totalCostUsd: +merged.reduce((a, b) => a + (b.costUsd || 0), 0).toFixed(2),
    items: merged,
  };
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  const elapsed = ((Date.now() - startTs) / 1000).toFixed(1);
  console.log(`\ndone: ${items.length} new, ${errors.length} errors, ${elapsed}s, manifest total=${merged.length}`);
  if (errors.length) console.log(JSON.stringify(errors, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
