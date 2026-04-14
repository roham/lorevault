// Public Domain Baseball — AI Opponent
// Generates enemy lineups from the card pool with themed team templates.
// AI steal decisions based on game state and difficulty.
// No UI coupling. Pure functions.

import { Roster, FieldPosition, MAX_ROSTER_COST, HitterStats, BaseState } from './types';
import { BASEBALL_CARDS, getAllHitters, getAllPitchers } from '@/data/baseball-stats';

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

// ===== Themed Team Templates =====

export interface AITeamTemplate {
  name: string;
  tagline: string;         // flavor line for pregame screen
  setPrefix: string;       // card ID prefix to prefer (e.g., 'bb-' for all, set-specific for themed)
  pitcherId: string;       // pre-assigned pitcher
  preferredHitters: string[]; // ordered list of preferred hitter IDs
  difficulty: Difficulty;
  playstyle: 'power' | 'speed' | 'balanced' | 'contact';
}

export const AI_TEAM_TEMPLATES: AITeamTemplate[] = [
  // ===== ROOKIE TEMPLATES =====
  {
    name: 'The Wonderland Wanderers',
    tagline: 'Chaotic. Unpredictable. Mostly confused.',
    setPrefix: 'bb-the-',
    pitcherId: 'bb-the-caterpillar',
    preferredHitters: [
      'bb-the-mad-hatter', 'bb-the-queen-of-hearts', 'bb-the-knave-of-hearts',
      'bb-the-march-hare', 'bb-the-king-of-hearts', 'bb-the-mock-turtle',
      'bb-tweedledee-tweedledum', 'bb-the-duchess', 'bb-the-dormouse',
    ],
    difficulty: 'rookie',
    playstyle: 'balanced',
  },
  {
    name: 'The Fairy Tale Misfits',
    tagline: 'Once upon a time, they tried to play baseball.',
    setPrefix: 'bb-',
    pitcherId: 'bb-rumpelstiltskin',
    preferredHitters: [
      'bb-hansel', 'bb-gretel', 'bb-red-riding-hood', 'bb-sleeping-beauty',
      'bb-the-frog-prince', 'bb-the-seven-dwarfs', 'bb-beauty',
      'bb-snow-white', 'bb-rapunzel',
    ],
    difficulty: 'rookie',
    playstyle: 'contact',
  },
  {
    name: 'Minor Monsters',
    tagline: 'B-list horrors from the bargain bin.',
    setPrefix: 'bb-',
    pitcherId: 'bb-dr-moreau',
    preferredHitters: [
      'bb-renfield', 'bb-lucy-westenra', 'bb-mina-harker', 'bb-dr-jekyll',
      'bb-quasimodo', 'bb-the-invisible-man', 'bb-the-time-traveller',
      'bb-dorian-gray', 'bb-captain-nemo',
    ],
    difficulty: 'rookie',
    playstyle: 'speed',
  },

  // ===== VETERAN TEMPLATES =====
  {
    name: 'The Enchanted Nine',
    tagline: 'Speed kills. These fairy tales run.',
    setPrefix: 'bb-',
    pitcherId: 'bb-the-pied-piper',
    preferredHitters: [
      'bb-puss-in-boots', 'bb-cinderella', 'bb-jack', 'bb-the-beast',
      'bb-the-huntsman', 'bb-snow-white', 'bb-beauty', 'bb-red-riding-hood',
      'bb-gretel',
    ],
    difficulty: 'veteran',
    playstyle: 'speed',
  },
  {
    name: 'The Gothic Horrors',
    tagline: 'Darkness rises. Power swings.',
    setPrefix: 'bb-',
    pitcherId: 'bb-the-phantom',
    preferredHitters: [
      'bb-count-dracula', 'bb-mr-hyde', 'bb-the-headless-horseman',
      'bb-van-helsing', 'bb-dorian-gray', 'bb-captain-nemo',
      'bb-the-time-traveller', 'bb-dr-jekyll', 'bb-mina-harker',
    ],
    difficulty: 'veteran',
    playstyle: 'power',
  },
  {
    name: 'The Baker Street Nine',
    tagline: 'Elementary. Every at-bat is deduced.',
    setPrefix: 'bb-',
    pitcherId: 'bb-professor-moriarty',
    preferredHitters: [
      'bb-sherlock-holmes', 'bb-irene-adler', 'bb-dr-watson',
      'bb-the-hound', 'bb-inspector-lestrade', 'bb-sebastian-moran',
      'bb-the-baker-street-irregulars', 'bb-the-dancing-men', 'bb-mrs-hudson',
    ],
    difficulty: 'veteran',
    playstyle: 'contact',
  },
  {
    name: 'The Mad Court',
    tagline: 'Off with their heads. Off with their runs.',
    setPrefix: 'bb-',
    pitcherId: 'bb-the-caterpillar',
    preferredHitters: [
      'bb-alice', 'bb-the-cheshire-cat', 'bb-the-jabberwock',
      'bb-the-queen-of-hearts', 'bb-the-mad-hatter', 'bb-the-white-rabbit',
      'bb-the-knave-of-hearts', 'bb-the-march-hare', 'bb-the-king-of-hearts',
    ],
    difficulty: 'veteran',
    playstyle: 'balanced',
  },

  // ===== LEGEND TEMPLATES =====
  {
    name: 'The Olympians',
    tagline: 'Gods don\'t lose. Gods destroy.',
    setPrefix: 'bb-',
    pitcherId: 'bb-zeus',
    preferredHitters: [
      'bb-hercules', 'bb-ares', 'bb-hades', 'bb-poseidon',
      'bb-prometheus', 'bb-icarus', 'bb-orpheus', 'bb-pandora',
      'bb-helen-of-troy',
    ],
    difficulty: 'legend',
    playstyle: 'power',
  },
  {
    name: 'Asgard\'s Chosen',
    tagline: 'The All-Father sends his finest to war.',
    setPrefix: 'bb-',
    pitcherId: 'bb-hel',
    preferredHitters: [
      'bb-thor', 'bb-loki', 'bb-heimdall', 'bb-tyr',
      'bb-sif', 'bb-fenrir', 'bb-surtr', 'bb-idun',
      'bb-huginn-muninn',
    ],
    difficulty: 'legend',
    playstyle: 'balanced',
  },
  {
    name: 'The Mythic All-Stars',
    tagline: 'The best of every world. No mercy.',
    setPrefix: 'bb-',
    pitcherId: 'bb-professor-moriarty',
    preferredHitters: [
      'bb-count-dracula', 'bb-achilles', 'bb-alice', 'bb-sherlock-holmes',
      'bb-the-headless-horseman', 'bb-puss-in-boots', 'bb-odin',
      'bb-the-jabberwock', 'bb-the-cheshire-cat',
    ],
    difficulty: 'legend',
    playstyle: 'power',
  },
];

/**
 * Get available templates for a difficulty tier.
 */
export function getTemplatesForDifficulty(difficulty: Difficulty): AITeamTemplate[] {
  return AI_TEAM_TEMPLATES.filter(t => t.difficulty === difficulty);
}

/**
 * Generate an AI opponent lineup from a themed template.
 *
 * - Rookie: uses rookie templates, suboptimal positioning
 * - Veteran: uses veteran templates, balanced
 * - Legend: uses legend templates, optimized batting order
 */
export function generateAILineup(
  difficulty: Difficulty,
  playerCardIds: Set<string>,
  seed?: number,
): Roster {
  const rand = seededRand(seed ?? Date.now());

  // Pick a template for this difficulty
  const templates = getTemplatesForDifficulty(difficulty);
  const template = templates[Math.floor(rand() * templates.length)];

  return generateFromTemplate(template, playerCardIds, rand, difficulty);
}

/**
 * Generate a lineup from a specific template.
 */
export function generateFromTemplate(
  template: AITeamTemplate,
  playerCardIds: Set<string>,
  rand: () => number,
  difficulty: Difficulty,
): Roster {
  // Validate pitcher exists and isn't taken
  let pitcherId = template.pitcherId;
  if (playerCardIds.has(pitcherId)) {
    const allPitchers = getAllPitchers().filter(p => !playerCardIds.has(p.id));
    if (allPitchers.length > 0) {
      pitcherId = allPitchers[Math.floor(rand() * allPitchers.length)].id;
    }
  }

  const pitcherCard = BASEBALL_CARDS.find(c => c.id === pitcherId);
  const pitcherCost = pitcherCard?.stats.pointCost ?? 0;

  // Try preferred hitters first
  const picked: string[] = [];
  let cost = pitcherCost;

  for (const hId of template.preferredHitters) {
    if (picked.length >= 9) break;
    if (playerCardIds.has(hId)) continue;
    const card = BASEBALL_CARDS.find(c => c.id === hId);
    if (!card || card.stats.type !== 'hitter') continue;
    if (cost + card.stats.pointCost <= MAX_ROSTER_COST) {
      picked.push(hId);
      cost += card.stats.pointCost;
    }
  }

  // Fill remaining from pool if template didn't provide enough
  if (picked.length < 9) {
    const available = getAllHitters()
      .filter(c => !playerCardIds.has(c.id) && !picked.includes(c.id))
      .sort((a, b) => {
        // For legend: pick by raw value; for rookie: random
        if (difficulty === 'legend') {
          const aS = a.stats as HitterStats;
          const bS = b.stats as HitterStats;
          return (bS.onBase * 2 + bS.power + bS.speed * 0.5) - (aS.onBase * 2 + aS.power + aS.speed * 0.5);
        }
        return rand() - 0.5;
      });

    for (const card of available) {
      if (picked.length >= 9) break;
      if (cost + card.stats.pointCost <= MAX_ROSTER_COST) {
        picked.push(card.id);
        cost += card.stats.pointCost;
      }
    }
  }

  // Still short? Force-fill with cheapest available
  while (picked.length < 9) {
    const cheapest = getAllHitters()
      .filter(c => !picked.includes(c.id))
      .sort((a, b) => a.stats.pointCost - b.stats.pointCost)[0];
    if (!cheapest) break;
    picked.push(cheapest.id);
    cost += cheapest.stats.pointCost;
  }

  // Assign positions — Legend optimizes defense, Rookie randomizes
  const sortedForPositions = difficulty === 'legend'
    ? assignOptimalPositions(picked, rand)
    : assignRandomPositions(picked, rand);

  // Set batting order — Legend puts best OB at top
  const orderedHitters = difficulty === 'legend'
    ? optimizeBattingOrder(sortedForPositions)
    : difficulty === 'veteran'
      ? decentBattingOrder(sortedForPositions, rand)
      : shuffleBattingOrder(sortedForPositions, rand);

  return {
    name: template.name,
    hitters: orderedHitters,
    pitcher: pitcherId,
    totalCost: cost,
  };
}

function assignRandomPositions(
  hitterIds: string[],
  rand: () => number,
): { cardId: string; position: FieldPosition }[] {
  const shuffledPositions = [...POSITIONS].sort(() => rand() - 0.5);
  return hitterIds.slice(0, 9).map((cardId, i) => ({
    cardId,
    position: shuffledPositions[i],
  }));
}

function assignOptimalPositions(
  hitterIds: string[],
  rand: () => number,
): { cardId: string; position: FieldPosition }[] {
  // Sort by defense desc, assign best defenders to premium positions
  const cards = hitterIds.map(id => ({
    id,
    defense: (BASEBALL_CARDS.find(c => c.id === id)?.stats as HitterStats)?.defense ?? 1,
  })).sort((a, b) => b.defense - a.defense);

  // Priority: C gets highest defense, then SS, 2B, 3B, CF, rest
  const priorityPositions: FieldPosition[] = ['C', 'SS', '2B', '3B', 'CF', 'LF', 'RF', '1B'];
  const remaining = [...priorityPositions];

  return cards.slice(0, 9).map(card => {
    const pos = remaining.shift() || POSITIONS[Math.floor(rand() * POSITIONS.length)];
    return { cardId: card.id, position: pos };
  });
}

function optimizeBattingOrder(
  slots: { cardId: string; position: FieldPosition }[],
): { cardId: string; position: FieldPosition; battingOrder: number }[] {
  // Sort: highest OB first (leadoff), power in 3-4 spots, speed in 1-2
  const withStats = slots.map(s => {
    const card = BASEBALL_CARDS.find(c => c.id === s.cardId);
    const stats = card?.stats as HitterStats;
    return { ...s, ob: stats?.onBase ?? 8, power: stats?.power ?? 5, speed: stats?.speed ?? 12 };
  });

  // Leadoff: best OB + speed
  withStats.sort((a, b) => (b.ob + b.speed * 0.3) - (a.ob + a.speed * 0.3));

  return withStats.map((s, i) => ({ cardId: s.cardId, position: s.position, battingOrder: i + 1 }));
}

function decentBattingOrder(
  slots: { cardId: string; position: FieldPosition }[],
  rand: () => number,
): { cardId: string; position: FieldPosition; battingOrder: number }[] {
  // Decent but not perfect — sort by OB with some noise
  const withStats = slots.map(s => {
    const card = BASEBALL_CARDS.find(c => c.id === s.cardId);
    const stats = card?.stats as HitterStats;
    return { ...s, score: (stats?.onBase ?? 8) + rand() * 3 };
  });
  withStats.sort((a, b) => b.score - a.score);
  return withStats.map((s, i) => ({ cardId: s.cardId, position: s.position, battingOrder: i + 1 }));
}

function shuffleBattingOrder(
  slots: { cardId: string; position: FieldPosition }[],
  rand: () => number,
): { cardId: string; position: FieldPosition; battingOrder: number }[] {
  const shuffled = [...slots].sort(() => rand() - 0.5);
  return shuffled.map((s, i) => ({ cardId: s.cardId, position: s.position, battingOrder: i + 1 }));
}

// ===== AI Steal Decision Logic =====

export interface AIStealDecision {
  shouldSteal: boolean;
  fromBase: 'first' | 'second';
  runnerCardId: string;
}

/**
 * Decide whether the AI should attempt a steal.
 * Called when AI is batting and has runners on base.
 *
 * Returns null if no steal should be attempted.
 */
export function getAIStealDecision(
  bases: BaseState,
  outs: number,
  inning: number,
  totalInnings: 3 | 9,
  scoreDiff: number, // positive = AI leading
  difficulty: Difficulty,
  rand: () => number,
): AIStealDecision | null {
  // Never steal with 2 outs (too risky at any difficulty)
  if (outs >= 2) return null;

  // Check runner on first (steal 2nd)
  if (bases.first && !bases.second) {
    const should = evaluateSteal(
      bases.first.speedRating === 'A' ? 18 : bases.first.speedRating === 'B' ? 15 : 11,
      outs, inning, totalInnings, scoreDiff, difficulty, rand,
    );
    if (should) return { shouldSteal: true, fromBase: 'first', runnerCardId: bases.first.cardId };
  }

  // Check runner on second (steal 3rd) — only veteran+ and only if third is empty
  if (bases.second && !bases.third && difficulty !== 'rookie') {
    const should = evaluateSteal(
      bases.second.speedRating === 'A' ? 18 : bases.second.speedRating === 'B' ? 15 : 11,
      outs, inning, totalInnings, scoreDiff, difficulty, rand,
    );
    if (should) return { shouldSteal: true, fromBase: 'second', runnerCardId: bases.second.cardId };
  }

  return null;
}

function evaluateSteal(
  runnerSpeed: number,
  outs: number,
  inning: number,
  totalInnings: 3 | 9,
  scoreDiff: number,
  difficulty: Difficulty,
  rand: () => number,
): boolean {
  const isLateGame = inning >= totalInnings;

  switch (difficulty) {
    case 'rookie': {
      // Rookie: only steals with fast runners, rarely
      if (runnerSpeed < 16) return false;
      return rand() < 0.25; // 25% chance even with fast runner
    }

    case 'veteran': {
      // Veteran: steals if fast runner + close game
      if (runnerSpeed < 14) return false;
      if (Math.abs(scoreDiff) > 3) return false; // don't steal in blowouts
      const baseRate = runnerSpeed >= 17 ? 0.50 : 0.30;
      // More aggressive when trailing
      const situational = scoreDiff < 0 ? 0.15 : 0;
      return rand() < (baseRate + situational);
    }

    case 'legend': {
      // Legend: aggressive, situational master
      if (runnerSpeed < 13) return false;

      // Never steal when up by 4+
      if (scoreDiff >= 4) return false;

      // Always attempt with speed A runners when trailing in last inning
      if (isLateGame && scoreDiff < 0 && runnerSpeed >= 17) return rand() < 0.85;

      // 0 outs = more aggressive, 1 out = moderate
      const outMultiplier = outs === 0 ? 1.3 : 0.9;
      const baseRate = runnerSpeed >= 17 ? 0.55 : runnerSpeed >= 15 ? 0.40 : 0.20;
      const trailingBonus = scoreDiff < 0 ? 0.15 : 0;

      return rand() < (baseRate * outMultiplier + trailingBonus);
    }
  }
}

// ===== AI Taunts =====

type TauntContext = 'hr' | 'strikeout' | 'steal_success' | 'steal_caught';

const TAUNTS: Record<Difficulty, Partial<Record<TauntContext, string[]>>> = {
  rookie: {},
  veteran: {
    hr: ['Not bad.', 'Lucky swing.'],
    strikeout: ['Saw that coming.', 'Too easy.'],
  },
  legend: {
    hr: ['We don\'t miss.', 'Sit down.', 'That ball is gone.'],
    strikeout: ['Pathetic.', 'You\'re out of your league.', 'Swing and a prayer.'],
    steal_success: ['Too slow.', 'We own the basepaths.'],
    steal_caught: [], // Legend doesn't get caught
  },
};

/**
 * Get an optional AI taunt for the play log.
 * Returns null for rookie (they don't trash talk).
 */
export function getAITaunt(
  difficulty: Difficulty,
  context: TauntContext,
  rand: () => number,
): string | null {
  const pool = TAUNTS[difficulty]?.[context];
  if (!pool || pool.length === 0) return null;
  // Only taunt some of the time to avoid annoyance
  if (rand() > 0.4) return null;
  return pool[Math.floor(rand() * pool.length)];
}
