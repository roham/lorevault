// Public Domain Baseball — AI Opponent
// Generates enemy lineups from the card pool.
// No UI coupling. Pure functions.

import { Roster, FieldPosition, MAX_ROSTER_COST } from './types';
import { BASEBALL_CARDS, getAllHitters, getAllPitchers } from '@/data/baseball-stats';
import { HitterStats } from './types';

const POSITIONS: FieldPosition[] = ['C', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF'];

// Seeded random for deterministic AI lineups
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export type Difficulty = 'rookie' | 'veteran' | 'legend';

/**
 * Generate an AI opponent lineup.
 *
 * - Rookie: random picks, often suboptimal
 * - Veteran: balanced team, respects budget
 * - Legend: optimized, picks highest value cards not in player's lineup
 */
export function generateAILineup(
  difficulty: Difficulty,
  playerCardIds: Set<string>,
  seed?: number,
): Roster {
  const rand = seededRand(seed ?? Date.now());

  // Get available cards (not used by player)
  const availableHitters = getAllHitters().filter(c => !playerCardIds.has(c.id));
  const availablePitchers = getAllPitchers().filter(c => !playerCardIds.has(c.id));

  if (availableHitters.length < 9 || availablePitchers.length < 1) {
    // Fallback: allow overlap with player
    return generateAILineup(difficulty, new Set(), seed);
  }

  let pitcher: string;
  let hitterIds: string[];

  switch (difficulty) {
    case 'rookie':
      ({ pitcher, hitterIds } = pickRookie(availableHitters, availablePitchers, rand));
      break;
    case 'veteran':
      ({ pitcher, hitterIds } = pickVeteran(availableHitters, availablePitchers, rand));
      break;
    case 'legend':
      ({ pitcher, hitterIds } = pickLegend(availableHitters, availablePitchers, rand));
      break;
  }

  // Assign positions and batting order
  const hitters = hitterIds.map((cardId, i) => ({
    cardId,
    position: POSITIONS[i],
    battingOrder: i + 1,
  }));

  const totalCost = hitterIds.reduce((sum, id) => {
    const card = BASEBALL_CARDS.find(c => c.id === id);
    return sum + (card?.stats.pointCost ?? 0);
  }, 0) + (BASEBALL_CARDS.find(c => c.id === pitcher)?.stats.pointCost ?? 0);

  const names: Record<Difficulty, string[]> = {
    rookie: ['Minor Leaguers', 'The Rookies', 'Farm Team', 'Training Squad'],
    veteran: ['The Contenders', 'All-Stars', 'Veteran Club', 'The Regulars'],
    legend: ['Hall of Famers', 'Dream Team', 'The Legends', 'Mythic Nine'],
  };

  return {
    name: names[difficulty][Math.floor(rand() * names[difficulty].length)],
    hitters,
    pitcher,
    totalCost,
  };
}

function pickRookie(
  hitters: typeof BASEBALL_CARDS,
  pitchers: typeof BASEBALL_CARDS,
  rand: () => number,
) {
  // Random picks with some budget awareness
  const shuffled = [...hitters].sort(() => rand() - 0.5);
  const picked: string[] = [];
  let cost = 0;

  // Random pitcher (prefer cheaper)
  const sortedP = [...pitchers].sort((a, b) => a.stats.pointCost - b.stats.pointCost);
  const pitcherIdx = Math.floor(rand() * Math.min(5, sortedP.length));
  const pitcher = sortedP[pitcherIdx].id;
  cost += sortedP[pitcherIdx].stats.pointCost;

  for (const card of shuffled) {
    if (picked.length >= 9) break;
    if (cost + card.stats.pointCost <= MAX_ROSTER_COST) {
      picked.push(card.id);
      cost += card.stats.pointCost;
    }
  }

  // Fill remaining with cheapest available
  while (picked.length < 9) {
    const cheapest = shuffled.find(c => !picked.includes(c.id));
    if (!cheapest) break;
    picked.push(cheapest.id);
  }

  return { pitcher, hitterIds: picked.slice(0, 9) };
}

function pickVeteran(
  hitters: typeof BASEBALL_CARDS,
  pitchers: typeof BASEBALL_CARDS,
  rand: () => number,
) {
  // Balanced: pick a mid-range pitcher, fill hitters by efficiency
  const sortedP = [...pitchers].sort((a, b) => {
    const aScore = Math.abs(a.stats.pointCost - 22);
    const bScore = Math.abs(b.stats.pointCost - 22);
    return aScore - bScore;
  });
  const pitcher = sortedP[Math.floor(rand() * Math.min(3, sortedP.length))].id;
  const pCost = BASEBALL_CARDS.find(c => c.id === pitcher)?.stats.pointCost ?? 0;

  // Sort hitters by value/cost ratio with some randomness
  const scored = hitters.map(c => {
    const s = c.stats as HitterStats;
    const value = s.onBase * 1.5 + s.power * 0.5 + (s.speed - 10) * 0.3 + s.defense;
    return { id: c.id, cost: s.pointCost, score: value / Math.max(1, s.pointCost) + rand() * 0.3 };
  }).sort((a, b) => b.score - a.score);

  const picked: string[] = [];
  let cost = pCost;

  for (const h of scored) {
    if (picked.length >= 9) break;
    if (cost + h.cost <= MAX_ROSTER_COST) {
      picked.push(h.id);
      cost += h.cost;
    }
  }

  while (picked.length < 9) {
    const fill = scored.find(h => !picked.includes(h.id));
    if (!fill) break;
    picked.push(fill.id);
  }

  return { pitcher, hitterIds: picked.slice(0, 9) };
}

function pickLegend(
  hitters: typeof BASEBALL_CARDS,
  pitchers: typeof BASEBALL_CARDS,
  rand: () => number,
) {
  // Optimized: best pitcher, then best hitters that fit
  const sortedP = [...pitchers].sort((a, b) => b.stats.pointCost - a.stats.pointCost);
  const pitcher = sortedP[0].id;
  const pCost = sortedP[0].stats.pointCost;

  // Sort hitters by raw stat total
  const scored = hitters.map(c => {
    const s = c.stats as HitterStats;
    const rawValue = s.onBase * 2 + s.power + s.speed * 0.5 + s.defense * 2;
    return { id: c.id, cost: s.pointCost, score: rawValue + rand() * 2 };
  }).sort((a, b) => b.score - a.score);

  const picked: string[] = [];
  let cost = pCost;

  for (const h of scored) {
    if (picked.length >= 9) break;
    if (cost + h.cost <= MAX_ROSTER_COST) {
      picked.push(h.id);
      cost += h.cost;
    }
  }

  while (picked.length < 9) {
    const fill = scored.find(h => !picked.includes(h.id));
    if (!fill) break;
    picked.push(fill.id);
  }

  return { pitcher, hitterIds: picked.slice(0, 9) };
}
