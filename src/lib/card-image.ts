/**
 * Card image path resolution — shared across prototypes.
 * Matches the same slug convention used in CardItem and BinderCard.
 */

/** Generate the base slug for a card (setSlug-character-moment, kebab-cased). */
export function getCardBaseSlug(card: { setSlug: string; character: string; moment: string }): string {
  return `${card.setSlug}-${card.character}-${card.moment}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
}

/** Get the variant-specific image path (with scarcity+parallel suffix). */
export function getCardArtPath(card: {
  setSlug: string;
  character: string;
  moment: string;
  scarcity: string;
  parallel: string;
}): string {
  const base = getCardBaseSlug(card);
  const id = (card.parallel === 'base' && card.scarcity === 'common')
    ? base
    : `${base}-${card.scarcity}-${card.parallel}`;
  return `/cards/${id}.webp`;
}

/** Get the base image path (no scarcity/parallel — always exists). */
export function getCardBasePath(card: { setSlug: string; character: string; moment: string }): string {
  return `/cards/${getCardBaseSlug(card)}.webp`;
}
