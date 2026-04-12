'use client';

import { Card } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';

// Local storage keys
const KEYS = {
  ownedCardIds: 'lorevault_owned',
  showcaseIds: 'lorevault_showcase',
  packCredits: 'lorevault_packs',
  xp: 'lorevault_xp',
  streak: 'lorevault_streak',
  lastVisit: 'lorevault_last_visit',
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked
  }
}

// Start with a small starter collection (5 common cards from different sets)
function getDefaultOwnedIds(): string[] {
  const starters = ALL_CARDS.filter(c => c.scarcity === 'common' && c.parallel === 'base');
  // One from each set
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const card of starters) {
    if (!seen.has(card.setSlug) && ids.length < 5) {
      seen.add(card.setSlug);
      ids.push(card.id);
    }
  }
  return ids;
}

export function getOwnedCardIds(): string[] {
  return getItem<string[]>(KEYS.ownedCardIds, getDefaultOwnedIds());
}

export function getOwnedCards(): Card[] {
  const ids = new Set(getOwnedCardIds());
  return ALL_CARDS.filter(c => ids.has(c.id));
}

export function addOwnedCards(cardIds: string[]) {
  const current = getOwnedCardIds();
  const merged = [...new Set([...current, ...cardIds])];
  setItem(KEYS.ownedCardIds, merged);
  return merged;
}

export function getShowcaseIds(): string[] {
  return getItem<string[]>(KEYS.showcaseIds, []);
}

export function setShowcaseIds(ids: string[]) {
  setItem(KEYS.showcaseIds, ids);
}

export function getPackCredits(): number {
  return getItem<number>(KEYS.packCredits, 3); // Start with 3 free packs
}

export function usePackCredit(): boolean {
  const credits = getPackCredits();
  if (credits <= 0) return false;
  setItem(KEYS.packCredits, credits - 1);
  return true;
}

export function addPackCredits(count: number) {
  setItem(KEYS.packCredits, getPackCredits() + count);
}

export function getXP(): number {
  return getItem<number>(KEYS.xp, 0);
}

export function addXP(amount: number) {
  setItem(KEYS.xp, getXP() + amount);
}

export function getStreak(): number {
  return getItem<number>(KEYS.streak, 0);
}

export function recordVisit() {
  const lastVisit = getItem<string>(KEYS.lastVisit, '');
  const today = new Date().toISOString().split('T')[0];

  if (lastVisit === today) return; // Already visited today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastVisit === yesterday) {
    // Streak continues
    setItem(KEYS.streak, getStreak() + 1);
  } else if (lastVisit !== today) {
    // Streak broken (or first visit)
    setItem(KEYS.streak, 1);
  }
  setItem(KEYS.lastVisit, today);
}

// Generate a pack of cards (weighted by scarcity)
export function generatePack(setSlug?: string): Card[] {
  const pool = setSlug && setSlug !== 'mixed'
    ? ALL_CARDS.filter(c => c.setSlug === setSlug)
    : ALL_CARDS;

  // Weight: common 50%, uncommon 25%, rare 15%, epic 8%, legendary 2%
  const weighted: Card[] = [];
  for (const card of pool) {
    const copies = card.scarcity === 'common' ? 50
      : card.scarcity === 'uncommon' ? 25
      : card.scarcity === 'rare' ? 15
      : card.scarcity === 'epic' ? 8
      : 2;
    for (let i = 0; i < copies; i++) weighted.push(card);
  }

  // Draw 5 unique cards (guarantee at least 1 uncommon+)
  const drawn: Card[] = [];
  const usedIds = new Set<string>();

  // First card: guaranteed uncommon or better
  const betterPool = weighted.filter(c => c.scarcity !== 'common');
  const guaranteed = betterPool[Math.floor(Math.random() * betterPool.length)];
  drawn.push(guaranteed);
  usedIds.add(guaranteed.id);

  // Remaining 4 cards
  while (drawn.length < 5) {
    const pick = weighted[Math.floor(Math.random() * weighted.length)];
    if (!usedIds.has(pick.id)) {
      drawn.push(pick);
      usedIds.add(pick.id);
    }
  }

  // Sort: rarest last (for dramatic reveal)
  const scarcityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  drawn.sort((a, b) => scarcityOrder[a.scarcity] - scarcityOrder[b.scarcity]);

  return drawn;
}
