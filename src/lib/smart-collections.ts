'use client';

import { Card, Scarcity } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';

// ---------------------------------------------------------------------------
// Auto-Collections — computed views from owned cards
// ---------------------------------------------------------------------------

export interface AutoCollection {
  id: string;
  name: string;
  icon: string;
  description: string;
  cards: Card[];
}

const SCARCITY_ORDER: Record<Scarcity, number> = {
  legendary: 0,
  epic: 1,
  rare: 2,
  uncommon: 3,
  common: 4,
};

export function getAutoCollections(ownedCards: Card[]): AutoCollection[] {
  const collections: AutoCollection[] = [];

  // Recently Pulled (last 20 by index — simulates acquisition order)
  // Since we don't track acquisition date, use the card's position in the owned array
  const recentlyPulled = ownedCards.slice(-20).reverse();
  if (recentlyPulled.length > 0) {
    collections.push({
      id: 'recently-pulled',
      name: 'Recently Pulled',
      icon: '🆕',
      description: `Your ${recentlyPulled.length} most recent acquisitions`,
      cards: recentlyPulled,
    });
  }

  // Rarest (top 10 by scarcity, then serial number)
  const rarest = [...ownedCards]
    .sort((a, b) => {
      const sDiff = SCARCITY_ORDER[a.scarcity] - SCARCITY_ORDER[b.scarcity];
      if (sDiff !== 0) return sDiff;
      return a.serialNumber - b.serialNumber; // lower serial = rarer
    })
    .slice(0, 10);
  if (rarest.length > 0) {
    collections.push({
      id: 'rarest',
      name: 'Rarest Pulls',
      icon: '💎',
      description: 'Your top 10 most valuable cards by scarcity',
      cards: rarest,
    });
  }

  // Almost Complete Sets (>50% completion)
  const almostComplete: Card[] = [];
  for (const set of SETS) {
    const allSetChars = new Set(
      ALL_CARDS.filter(c => c.setSlug === set.slug).map(c => `${c.character}:${c.moment}`)
    );
    const ownedSetChars = new Set(
      ownedCards.filter(c => c.setSlug === set.slug).map(c => `${c.character}:${c.moment}`)
    );
    const pct = allSetChars.size > 0 ? ownedSetChars.size / allSetChars.size : 0;
    if (pct > 0.5 && pct < 1) {
      const setCards = ownedCards.filter(c => c.setSlug === set.slug);
      almostComplete.push(...setCards);
    }
  }
  if (almostComplete.length > 0) {
    collections.push({
      id: 'almost-complete',
      name: 'Almost Complete',
      icon: '🏁',
      description: 'Cards from sets you\'re more than halfway to completing',
      cards: almostComplete,
    });
  }

  // Parallels Only — non-base cards
  const parallels = ownedCards.filter(c => c.parallel !== 'base');
  if (parallels.length > 0) {
    collections.push({
      id: 'parallels',
      name: 'Parallel Collection',
      icon: '✨',
      description: `${parallels.length} special parallel cards`,
      cards: parallels.sort((a, b) => SCARCITY_ORDER[a.scarcity] - SCARCITY_ORDER[b.scarcity]),
    });
  }

  // High Value (price > $50)
  const highValue = ownedCards.filter(c => c.price >= 50).sort((a, b) => b.price - a.price);
  if (highValue.length > 0) {
    collections.push({
      id: 'high-value',
      name: 'High Value',
      icon: '💰',
      description: `${highValue.length} cards worth $50+`,
      cards: highValue,
    });
  }

  return collections;
}

// ---------------------------------------------------------------------------
// Sort functions
// ---------------------------------------------------------------------------

export type SortOption = 'scarcity' | 'serial' | 'date' | 'set' | 'character' | 'price' | 'parallel';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'scarcity', label: 'Scarcity' },
  { value: 'price', label: 'Price (High → Low)' },
  { value: 'serial', label: 'Serial Number' },
  { value: 'character', label: 'Character A-Z' },
  { value: 'set', label: 'Set' },
  { value: 'parallel', label: 'Parallel Type' },
  { value: 'date', label: 'Date Acquired' },
];

const PARALLEL_ORDER: Record<string, number> = {
  obsidian: 0,
  holographic: 1,
  gold: 2,
  silver: 3,
  base: 4,
};

export function sortCards(cards: Card[], sortBy: SortOption): Card[] {
  const sorted = [...cards];
  switch (sortBy) {
    case 'scarcity':
      sorted.sort((a, b) => SCARCITY_ORDER[a.scarcity] - SCARCITY_ORDER[b.scarcity]);
      break;
    case 'price':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'serial':
      sorted.sort((a, b) => a.serialNumber - b.serialNumber);
      break;
    case 'character':
      sorted.sort((a, b) => a.character.localeCompare(b.character));
      break;
    case 'set':
      sorted.sort((a, b) => a.set.localeCompare(b.set) || SCARCITY_ORDER[a.scarcity] - SCARCITY_ORDER[b.scarcity]);
      break;
    case 'parallel':
      sorted.sort((a, b) => (PARALLEL_ORDER[a.parallel] || 4) - (PARALLEL_ORDER[b.parallel] || 4));
      break;
    case 'date':
      // Reverse order (last acquired first)
      sorted.reverse();
      break;
  }
  return sorted;
}

// ---------------------------------------------------------------------------
// Filter Presets — saved filter+sort combos
// ---------------------------------------------------------------------------

export interface FilterPreset {
  id: string;
  name: string;
  filterSet: string;
  filterScarcity: string;
  filterParallel: string;
  sortBy: SortOption;
}

const PRESETS_KEY = 'lorevault_filter_presets';

export function getFilterPresets(): FilterPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(PRESETS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFilterPreset(preset: Omit<FilterPreset, 'id'>): FilterPreset {
  const presets = getFilterPresets();
  const newPreset: FilterPreset = {
    ...preset,
    id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  presets.push(newPreset);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  return newPreset;
}

export function deleteFilterPreset(id: string) {
  const presets = getFilterPresets().filter(p => p.id !== id);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}
