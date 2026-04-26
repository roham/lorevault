import { LATTICE_CARDS } from '@/lib/lattice-cards';
import type { LatticeCard } from '@/lib/lattice-cards';
import type { V2Card, Universe, Shell } from '@/lib/v2/cards';
import type { Tier } from '@/lib/v2/parallels-eligibility';

function tierToV2(tier: string): Tier {
  return tier.toLowerCase() as Tier;
}

function mintSerial(tier: string): string {
  switch (tier) {
    case 'Common':    return 'Common · 15,000 ed.';
    case 'Rare':      return 'Rare · 2,500 ed.';
    case 'Legendary': return 'Legendary · 250 ed.';
    case 'Ultimate':  return 'Ultimate · 25 ed.';
    default:          return tier;
  }
}

const COUNCIL_STUBS: Record<string, V2Card['council']> = {
  Common: {
    silhouette:
      'A figure from the 221B rooms — outline-legible at 16px. The Lampblack silhouette survives every shell-translation.',
    props:
      'The objects in frame carry residue from adjacent cases. Each prop has a history the card does not explain.',
    gesture:
      'The Moment captures a decision in progress — the body saying what the voice has not yet said.',
    spine:
      'Baker Street · PRIME · Argument. The Method is the Spine; the Method outlives the case.',
  },
  Rare: {
    silhouette:
      'A Rare Moment — higher visual complexity, second Lampblack layer visible in the outline.',
    props:
      'The props in this frame appear in multiple published accounts. Their combination here is unique to this Moment.',
    gesture:
      'The Rare gesture holds two implications simultaneously. One is the Mosaic Test pass; one is the lore thread.',
    spine:
      'Baker Street · PRIME · Argument — Rare tier. The case behind this Moment is referenced but not named.',
  },
  Legendary: {
    silhouette:
      'The Legendary silhouette is the most cited figure from the Baker Street Pane. Recognisable across all eight shells.',
    props:
      'Legendary props are the objects Watson inventoried but could not explain. Their presence here is the Lampblack.',
    gesture:
      'The Legendary gesture is the moment between knowing and saying. Holmes holds it for exactly four seconds.',
    spine:
      'Baker Street · PRIME · Argument — Legendary tier. The Violin and the Seven-Per-Cent anchor this tier.',
  },
  Ultimate: {
    silhouette:
      'The partnership opened here. Nothing before this existed; nothing after forgets it.',
    props:
      'The mud on the boot is the wrong Kandahar mud. Holmes noted it and did not say so. That is the Ultimate prop.',
    gesture:
      'The handshake was still warm. The four seconds of deduction are the Ultimate gesture.',
    spine:
      'Baker Street · PRIME · Argument — Ultimate tier. The partnership is the Spine; the first deduction is the Lampblack seed.',
  },
};

export function adaptLatticeCard(c: LatticeCard): V2Card {
  return {
    cardId: c.id,
    figureName: c.name,
    universe: 'baker-street' as Universe,
    universeLabel: 'Baker Street',
    universeRole: 'Argument',
    setLabel: 'BS-1',
    setName: 'The Argument Pane',
    tier: tierToV2(c.tier),
    parallel: 'base',
    shell: c.shell as Shell,
    baseArtVariant: 'base',
    serial: mintSerial(c.tier),
    setGlyphSlug: '221b',
    heroArtUrl: c.imagePath,
    pullquote: c.flavor,
    pullquoteAttribution: c.flavorAttrib || undefined,
    loreNote: c.echo,
    council: COUNCIL_STUBS[c.tier] ?? COUNCIL_STUBS.Common,
    tethers: [],
    owner: null,
    ownerHistory: [],
  };
}

export function getLatticeCardAsV2(cardId: string): V2Card | null {
  const c = LATTICE_CARDS.find((lc) => lc.id === cardId);
  return c ? adaptLatticeCard(c) : null;
}

export function listLatticeCardsAsV2(): V2Card[] {
  return LATTICE_CARDS.map(adaptLatticeCard);
}
