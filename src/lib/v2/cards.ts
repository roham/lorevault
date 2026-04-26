/**
 * V2 sample cards — the 5 marquee 1/1 ONE-OFFs, one per Universe.
 *
 * These are the vertical-slice cards that show the new chassis from Phase 4 + 5.
 * All five are Ultimate-tier, 1/1 ONE-OFF parallel. Per Phase 4 §3.5 the frame is
 * the asset itself — TierFrame + ParallelOverlay collapse to a bespoke full-bleed image.
 */

import type { Tier, Parallel } from './parallels-eligibility';

export type Universe =
  | 'baker-street'
  | 'enchanted-kingdom'
  | 'wonderland'
  | 'gothic-horror'
  | 'greek-myth';

export type Shell = 'PRIME' | 'CYBER' | 'MODERN' | 'AETHER' | 'HOLLOW' | 'MIRROR' | 'DREAM' | 'SAINT';

export interface CouncilLayers {
  silhouette: string;
  props: string;
  gesture: string;
  spine: string;
}

export interface V2Card {
  cardId: string;
  figureName: string;
  universe: Universe;
  universeLabel: string;
  universeRole: string;
  setLabel: string; // "BS-4" / "EK-1" / etc.
  setName: string;
  tier: Tier;
  parallel: Parallel;
  shell: Shell;
  baseArtVariant: 'base' | 'parallel';
  serial: string; // "1 / 1" for ONE-OFFs
  setGlyphSlug: string;
  heroArtUrl: string;
  pullquote: string;
  pullquoteAttribution?: string;
  loreNote: string;
  council: CouncilLayers;
  // Tethers and owner trail are stubbed to empty / null for the slice.
  tethers: never[];
  owner: null;
  ownerHistory: never[];
}

const UNIVERSE_LABEL: Record<Universe, string> = {
  'baker-street': 'Baker Street',
  'enchanted-kingdom': 'Enchanted Kingdom',
  wonderland: 'Wonderland',
  'gothic-horror': 'Gothic Horror',
  'greek-myth': 'Greek Myth',
};

// Cosmological role per Aesthetic Bible §1.
const UNIVERSE_ROLE: Record<Universe, string> = {
  'baker-street': 'Argument',
  'enchanted-kingdom': 'Inheritance',
  wonderland: 'Categorical Failure',
  'gothic-horror': 'Transformation',
  'greek-myth': 'Fate',
};

// Universe glyph (16-32px stamp, top-left of the chassis).
// Per Phase 4 §4 we'd ship inline ≤2KB SVGs — for the slice we use a single character anchor.
export const UNIVERSE_GLYPH: Record<Universe, string> = {
  'baker-street': '221',
  'enchanted-kingdom': '⚘', // flower
  wonderland: '♛', // black queen
  'gothic-horror': '⚓', // anchor (Demeter-wreck)
  'greek-myth': 'Ω', // omega
};

export const CARDS: V2Card[] = [
  {
    cardId: 'bs-last-bow',
    figureName: 'The Last Bow',
    universe: 'baker-street',
    universeLabel: UNIVERSE_LABEL['baker-street'],
    universeRole: UNIVERSE_ROLE['baker-street'],
    setLabel: 'BS-4',
    setName: 'Reichenbach — The Argument Closes',
    tier: 'ultimate',
    parallel: 'one-off',
    shell: 'PRIME',
    baseArtVariant: 'parallel',
    serial: '1 / 1',
    setGlyphSlug: 'footnote-mark',
    heroArtUrl: '/v2/cards/bs-last-bow.webp',
    pullquote:
      'I have never loved any country before this one. I shall keep my bees here.',
    pullquoteAttribution: '— Holmes, Sussex Down, 1914',
    loreNote:
      'The lens that begins to fog is the same lens that solved the Hound. He kept it until the brass rim was fogged, and then he kept it after.',
    council: {
      silhouette:
        'A man on a chalk down, three-quarters back, beekeeper veil pushed off — the figure who once faced the camera now faces the sea.',
      props:
        'A magnifying lens with a fogged brass rim; a bee on the brass; the watch in the waistcoat pocket gone gold-amber.',
      gesture:
        'The lens tilted thirty degrees in the hand — the angle of a man no longer in a hurry to read.',
      spine:
        'The Argument closes. The Method outlives the case. Lampblack here is the residue of having been right for too long.',
    },
    tethers: [],
    owner: null,
    ownerHistory: [],
  },
  {
    cardId: 'ek-footnoter-reveals',
    figureName: 'The Footnoter Reveals Themselves',
    universe: 'enchanted-kingdom',
    universeLabel: UNIVERSE_LABEL['enchanted-kingdom'],
    universeRole: UNIVERSE_ROLE['enchanted-kingdom'],
    setLabel: 'EK-1',
    setName: 'Snow Black',
    tier: 'ultimate',
    parallel: 'one-off',
    shell: 'PRIME',
    baseArtVariant: 'parallel',
    serial: '1 / 1',
    setGlyphSlug: 'bitten-apple',
    heroArtUrl: '/v2/cards/ek-footnoter-reveals.webp',
    pullquote:
      'I am the one who knew. I am the one who wrote her down. I am the one who made the Pane remember it the way it actually went.',
    pullquoteAttribution: '— the Footnoter, m.s.',
    loreNote:
      'Every prop in this Set — the apple, the mirror, the bone-comb, the stay-lace, the hunting-knife, the deer-heart — appears in the page above the Footnoter’s hand. The dagger in the corner is the same as the dagger in their signature.',
    council: {
      silhouette:
        'An ink-stained hand entering the page from below, holding a quill — the Footnoter’s only visible form is the hand and the shadow.',
      props:
        'The quill (gold-leaf nib); the page itself, every Snow-Black prop sketched as marginalia inside it; the dagger †.',
      gesture:
        'The hand poised above the apple — about to make a margin note that will outlive the Pane.',
      spine:
        'Topsy-mode fourth-wall break: the marginal voice steps into the frame. The Footnoter is the Lampblacker-Spine of EK; this is the page where Topsy is announced as the architect.',
    },
    tethers: [],
    owner: null,
    ownerHistory: [],
  },
  {
    cardId: 'wl-alice-through-glass',
    figureName: 'Alice Steps Through the Looking-Glass',
    universe: 'wonderland',
    universeLabel: UNIVERSE_LABEL['wonderland'],
    universeRole: UNIVERSE_ROLE['wonderland'],
    setLabel: 'WL-4',
    setName: 'The Looking-Glass Pawn',
    tier: 'ultimate',
    parallel: 'one-off',
    shell: 'MIRROR',
    baseArtVariant: 'parallel',
    serial: '1 / 1',
    setGlyphSlug: 'looking-glass-frame',
    heroArtUrl: '/v2/cards/wl-alice-through-glass.webp',
    pullquote:
      'The pawn went forward one square. Then another. Then she was a queen, and the squares were a kingdom, and the kingdom was a game she had not been told she was playing.',
    pullquoteAttribution: '— the Court Recorder of Hearts',
    loreNote:
      'In the silver, four other Panes are visible at the same instant: a Reichenbach-fog with a Cheshire grin in negative space; a Black-Forest canopy; the shadow under Mina’s bed; an asphodel-meadow horizon. The Glass-Polisher’s hand is just leaving the silver-frame in the bottom-margin.',
    council: {
      silhouette:
        'A girl half through a mantelpiece-mirror — the Pane shape literalised. The mirror is not silver; it is Lampblack-silver, a Lattice surface.',
      props:
        'The mantelpiece. The mercury-silver mirror surface. A polishing-cloth tucked into the lower frame.',
      gesture:
        'A foot already on the other side, a hand still on this one — the moment a categorical failure is in progress.',
      spine:
        'Wonderland is the Pane of categorical failure. Alice is the figure who walks through categories that should be solid. The Glass-Polisher is the Lampblacker-Spine; the mirror is their job.',
    },
    tethers: [],
    owner: null,
    ownerHistory: [],
  },
  {
    cardId: 'gh-ledger-keeper-opens',
    figureName: 'The Ledger-Keeper Opens the Ledger',
    universe: 'gothic-horror',
    universeLabel: UNIVERSE_LABEL['gothic-horror'],
    universeRole: UNIVERSE_ROLE['gothic-horror'],
    setLabel: 'GH-4',
    setName: 'The Two Doctors',
    tier: 'ultimate',
    parallel: 'one-off',
    shell: 'PRIME',
    baseArtVariant: 'parallel',
    serial: '1 / 1',
    setGlyphSlug: 'bound-folio-ribbon',
    heroArtUrl: '/v2/cards/gh-ledger-keeper-opens.webp',
    pullquote:
      'I came up from the wreck of the Demeter. I have been writing it down ever since. The ledger has thirteen Spines now, and one date pending.',
    pullquoteAttribution: '— Asha Caedmon, Whitby Abbey, 31 December 1926',
    loreNote:
      'The final entry on the open page reads: “1 January 1927 — the cliff turns. I wait.” The cliff has not turned yet. She is still waiting.',
    council: {
      silhouette:
        'A woman at a desk in an abbey-ruin, ink-stained fingertips, Whitby-cliff-grey shawl. The 199 steps descend behind her into rain.',
      props:
        'The open ledger; thirteen Spine-entries visible (Dracula, Demeter Captain, Frankenstein’s Creature, Walton, Erik, Daroga, Jekyll, Hyde, Lanyon, Mina, Van Helsing, Mircalla Karnstein, Lucy, Renfield); a candle-amber lantern.',
      gesture:
        'The hand poised above the page — the Lampblacker-Spine writing thirteen lives into a single archive.',
      spine:
        'Asha Caedmon is the Lampblacker-Spine of Gothic Horror. She is the cross-Pane archivist. This is the card where she stops being a footnote and becomes the page.',
    },
    tethers: [],
    owner: null,
    ownerHistory: [],
  },
  {
    cardId: 'gm-sixth-seed',
    figureName: 'The Sixth Seed',
    universe: 'greek-myth',
    universeLabel: UNIVERSE_LABEL['greek-myth'],
    universeRole: UNIVERSE_ROLE['greek-myth'],
    setLabel: 'GM-1',
    setName: 'The Third Spring',
    tier: 'ultimate',
    parallel: 'one-off',
    shell: 'PRIME',
    baseArtVariant: 'parallel',
    serial: '1 / 1',
    setGlyphSlug: 'pomegranate-seed-six',
    heroArtUrl: '/v2/cards/gm-sixth-seed.webp',
    pullquote:
      'And the seed was already eaten when the seed was offered. The third spring is the spring with two winters in it. Demeter counts. Melaina carries what is counted.',
    pullquoteAttribution: '— the chorus, registered',
    loreNote:
      'Six seeds in the palm. The seventh exists outside the glyph; the seventh remains unspoken. Persephone never smiles in this Pane. Hades is never sad.',
    council: {
      silhouette:
        'A frontal hieratic figure, divided at the sternum: winter on one side, spring on the other — the Bouguereau marble register reskinned to cosmic scale.',
      props:
        'Six pomegranate seeds in the open palm; asphodel-rim; a polished threshold-stone catching reflection.',
      gesture:
        'Hades’s fingers indenting her thigh — the Bernini *Rape of Proserpina* marble fact, neither erotic nor abstract.',
      spine:
        'Greek Myth is the Pane of Fate. Persephone is the figure who learns the rules by violating them. Melaina is the Lampblacker-Spine — the Pythia’s Apprentice who carries what is counted.',
    },
    tethers: [],
    owner: null,
    ownerHistory: [],
  },
];

export function getCard(cardId: string): V2Card | null {
  return CARDS.find((c) => c.cardId === cardId) ?? null;
}

export function listCards(): V2Card[] {
  return CARDS;
}
