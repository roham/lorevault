'use client';

import { Card } from '@/data/types';
import {
  StatKey,
  getCharacterStats,
  getEffectiveStat,
} from '@/data/stats';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Seeded random for consistency
export function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const ALL_STATS: StatKey[] = ['power', 'intelligence', 'mystery', 'legend', 'charm'];

/**
 * AI stat selection — smarter at higher difficulty.
 *
 * Easy: 60% random, 40% picks best stat from its card.
 * Medium: 30% random, 70% picks best stat from its card.
 * Hard: 10% random, 50% picks best stat, 40% counter-picks
 *   (avoids stats where opponent's card is known to be strong).
 */
export function aiChooseStat(
  aiCard: Card,
  playerCard: Card | null,
  difficulty: Difficulty,
  roundSeed: number,
): StatKey {
  const rand = seededRandom(roundSeed);

  const aiBase = getCharacterStats(aiCard.character);
  const aiValues = ALL_STATS.map(s => ({
    stat: s,
    value: getEffectiveStat(aiBase, s, aiCard.scarcity, aiCard.parallel),
  }));
  aiValues.sort((a, b) => b.value - a.value);

  const randomStat = ALL_STATS[Math.floor(rand() * ALL_STATS.length)];

  if (difficulty === 'easy') {
    return rand() < 0.6 ? randomStat : aiValues[0].stat;
  }

  if (difficulty === 'medium') {
    return rand() < 0.3 ? randomStat : aiValues[0].stat;
  }

  // Hard: counter-pick if we can see the player card
  if (playerCard) {
    const playerBase = getCharacterStats(playerCard.character);
    // Find stats where AI has an edge
    const edges = ALL_STATS.map(s => {
      const aiVal = getEffectiveStat(aiBase, s, aiCard.scarcity, aiCard.parallel);
      const plVal = getEffectiveStat(playerBase, s, playerCard.scarcity, playerCard.parallel);
      return { stat: s, margin: aiVal - plVal };
    }).sort((a, b) => b.margin - a.margin);

    const r = rand();
    if (r < 0.1) return randomStat;
    if (r < 0.5) return aiValues[0].stat;
    // Counter-pick: stat with biggest AI advantage
    return edges[0].stat;
  }

  return rand() < 0.1 ? randomStat : aiValues[0].stat;
}

/**
 * AI picks the best card from its remaining pool for a given round.
 *
 * Easy: random pick.
 * Medium: picks the card with the single highest stat overall.
 * Hard: picks the card best matched against the player's current card
 *   (maximizes number of stats where AI wins).
 */
export function aiPickCard(
  pool: Card[],
  playerCard: Card | null,
  difficulty: Difficulty,
  roundSeed: number,
): Card {
  if (pool.length <= 1) return pool[0];
  const rand = seededRandom(roundSeed);

  if (difficulty === 'easy') {
    return pool[Math.floor(rand() * pool.length)];
  }

  if (difficulty === 'medium') {
    let best = pool[0];
    let bestMax = 0;
    for (const card of pool) {
      const base = getCharacterStats(card.character);
      for (const s of ALL_STATS) {
        const v = getEffectiveStat(base, s, card.scarcity, card.parallel);
        if (v > bestMax) {
          bestMax = v;
          best = card;
        }
      }
    }
    return best;
  }

  // Hard: counter-pick the player
  if (playerCard) {
    const playerBase = getCharacterStats(playerCard.character);
    let best = pool[0];
    let bestScore = -Infinity;
    for (const card of pool) {
      const base = getCharacterStats(card.character);
      let score = 0;
      for (const s of ALL_STATS) {
        const aiVal = getEffectiveStat(base, s, card.scarcity, card.parallel);
        const plVal = getEffectiveStat(playerBase, s, playerCard.scarcity, playerCard.parallel);
        score += aiVal - plVal;
      }
      if (score > bestScore) {
        bestScore = score;
        best = card;
      }
    }
    return best;
  }

  // Fallback: pick highest total
  let best = pool[0];
  let bestTotal = 0;
  for (const card of pool) {
    const base = getCharacterStats(card.character);
    const total = ALL_STATS.reduce(
      (sum, s) => sum + getEffectiveStat(base, s, card.scarcity, card.parallel),
      0,
    );
    if (total > bestTotal) {
      bestTotal = total;
      best = card;
    }
  }
  return best;
}
