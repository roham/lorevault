// Public Domain Baseball — Draft Engine
// Snake-draft state machine: player and AI take turns picking from a shared pool.
// Pure functions, no UI coupling.

import { BaseballCard, HitterStats, FieldPosition, Roster, MAX_ROSTER_COST } from './types';
import { BASEBALL_CARDS, getAllHitters, getAllPitchers } from '@/data/baseball-stats';
import type { Difficulty } from './ai';

// ===== Types =====

export type DraftTurn = 'player' | 'ai';

export interface DraftPick {
  cardId: string;
  pickNumber: number;    // 1-20
  team: DraftTurn;
}

export interface DraftState {
  pool: BaseballCard[];          // available cards (not yet picked)
  playerPicks: string[];         // card IDs picked by player (order = pick order)
  aiPicks: string[];             // card IDs picked by AI
  playerCost: number;            // running total point cost
  aiCost: number;
  pickHistory: DraftPick[];      // ordered history of all picks
  currentTurn: DraftTurn;
  pickNumber: number;            // 1-20 (total picks across both teams)
  totalPicks: 20;                // always 20 (10 per team)
  difficulty: Difficulty;
  phase: 'drafting' | 'complete';
}

// ===== Snake Draft Order =====
// Pattern for 10 picks per team (20 total):
// Pick 1: Player, Pick 2-3: AI, Pick 4-5: Player, Pick 6-7: AI,
// Pick 8-9: Player, Pick 10-11: AI, Pick 12-13: Player, Pick 14-15: AI,
// Pick 16-17: Player, Pick 18-19: AI, Pick 20: Player

function getPickTeam(pickNumber: number): DraftTurn {
  // Snake draft: Player=1, AI=2-3, Player=4-5, AI=6-7... Player=20
  if (pickNumber === 1 || pickNumber === 20) return 'player';
  // For picks 2-19: group into pairs. Odd pairs (2-3, 6-7, 10-11...) = AI
  const pairIndex = Math.ceil((pickNumber - 1) / 2);
  return pairIndex % 2 === 1 ? 'ai' : 'player';
}

/**
 * Get the full snake draft order (for display).
 */
export function getDraftOrder(): DraftTurn[] {
  return Array.from({ length: 20 }, (_, i) => getPickTeam(i + 1));
}

// ===== Draft Initialization =====

export function startDraft(difficulty: Difficulty): DraftState {
  return {
    pool: [...BASEBALL_CARDS], // all cards available
    playerPicks: [],
    aiPicks: [],
    playerCost: 0,
    aiCost: 0,
    pickHistory: [],
    currentTurn: 'player', // player picks first
    pickNumber: 1,
    totalPicks: 20,
    difficulty,
    phase: 'drafting',
  };
}

// ===== Player Pick =====

export interface PickResult {
  state: DraftState;
  valid: boolean;
  error?: string;
}

export function playerPick(state: DraftState, cardId: string): PickResult {
  if (state.phase !== 'drafting') {
    return { state, valid: false, error: 'Draft is complete' };
  }
  if (state.currentTurn !== 'player') {
    return { state, valid: false, error: "Not player's turn" };
  }

  const card = state.pool.find(c => c.id === cardId);
  if (!card) {
    return { state, valid: false, error: 'Card not in pool' };
  }

  // Check point cap
  if (state.playerCost + card.stats.pointCost > MAX_ROSTER_COST) {
    return { state, valid: false, error: `Exceeds ${MAX_ROSTER_COST}-point cap` };
  }

  // Check if this is a pitcher pick (last pick = pick 10 for this team)
  const isPitcherPick = state.playerPicks.length === 9;
  if (isPitcherPick && card.stats.type !== 'pitcher') {
    return { state, valid: false, error: 'Final pick must be a pitcher' };
  }
  if (!isPitcherPick && card.stats.type === 'pitcher') {
    // Allow picking a pitcher early only if there are enough hitters left
    // Actually, let's keep it simple: pitcher must be last pick
    return { state, valid: false, error: 'Pitcher must be your last pick (pick 10)' };
  }

  return { state: applyPick(state, cardId, 'player'), valid: true };
}

// ===== AI Pick =====

export function aiPick(state: DraftState): DraftState {
  if (state.phase !== 'drafting' || state.currentTurn !== 'ai') {
    return state;
  }

  const isPitcherPick = state.aiPicks.length === 9;
  const availablePool = state.pool.filter(c => {
    // Must fit under cap
    if (state.aiCost + c.stats.pointCost > MAX_ROSTER_COST) return false;
    // Pitcher pick must be pitcher, hitter pick must be hitter
    if (isPitcherPick) return c.stats.type === 'pitcher';
    return c.stats.type === 'hitter';
  });

  if (availablePool.length === 0) {
    // Fallback: pick cheapest available of correct type
    const fallback = state.pool
      .filter(c => isPitcherPick ? c.stats.type === 'pitcher' : c.stats.type === 'hitter')
      .sort((a, b) => a.stats.pointCost - b.stats.pointCost)[0];
    if (fallback) return applyPick(state, fallback.id, 'ai');
    return state;
  }

  const selected = selectAIPick(availablePool, state, isPitcherPick);
  return applyPick(state, selected.id, 'ai');
}

function selectAIPick(
  pool: BaseballCard[],
  state: DraftState,
  isPitcherPick: boolean,
): BaseballCard {
  const rand = () => Math.random();

  switch (state.difficulty) {
    case 'rookie':
      // Random pick
      return pool[Math.floor(rand() * pool.length)];

    case 'veteran': {
      // Pick best available by value score with some noise
      const scored = pool.map(c => ({
        card: c,
        score: getCardValue(c) + (rand() * 4 - 2), // +/- 2 noise
      }));
      scored.sort((a, b) => b.score - a.score);
      return scored[0].card;
    }

    case 'legend': {
      // Counter-draft: pick what would most hurt the player
      // Prioritize high-OB hitters and strong pitchers
      if (isPitcherPick) {
        // Pick highest control pitcher
        const pitchers = pool.filter(c => c.stats.type === 'pitcher');
        pitchers.sort((a, b) => {
          const aCtl = (a.stats as { control: number }).control;
          const bCtl = (b.stats as { control: number }).control;
          return bCtl - aCtl;
        });
        return pitchers[0] || pool[0];
      }

      // For hitters: pick the best available that the player would want
      const scored = pool.map(c => ({
        card: c,
        score: getCardValue(c) * 1.2, // overvalue good cards
      }));
      scored.sort((a, b) => b.score - a.score);
      // Pick from top 3 to avoid being too predictable
      const topN = scored.slice(0, Math.min(3, scored.length));
      return topN[Math.floor(rand() * topN.length)].card;
    }
  }
}

function getCardValue(card: BaseballCard): number {
  if (card.stats.type === 'pitcher') {
    return card.stats.control * 3 + card.stats.fielding;
  }
  const s = card.stats as HitterStats;
  return s.onBase * 2 + s.power * 0.8 + (s.speed - 10) * 0.5 + s.defense * 0.6;
}

// ===== Apply Pick (shared logic) =====

function applyPick(state: DraftState, cardId: string, team: DraftTurn): DraftState {
  const card = state.pool.find(c => c.id === cardId)!;
  const newPool = state.pool.filter(c => c.id !== cardId);

  const newPlayerPicks = team === 'player'
    ? [...state.playerPicks, cardId]
    : state.playerPicks;
  const newAiPicks = team === 'ai'
    ? [...state.aiPicks, cardId]
    : state.aiPicks;
  const newPlayerCost = team === 'player'
    ? state.playerCost + card.stats.pointCost
    : state.playerCost;
  const newAiCost = team === 'ai'
    ? state.aiCost + card.stats.pointCost
    : state.aiCost;

  const newPickNumber = state.pickNumber + 1;
  const isComplete = newPlayerPicks.length === 10 && newAiPicks.length === 10;

  return {
    ...state,
    pool: newPool,
    playerPicks: newPlayerPicks,
    aiPicks: newAiPicks,
    playerCost: newPlayerCost,
    aiCost: newAiCost,
    pickHistory: [
      ...state.pickHistory,
      { cardId, pickNumber: state.pickNumber, team },
    ],
    pickNumber: newPickNumber,
    currentTurn: isComplete ? state.currentTurn : getPickTeam(newPickNumber),
    phase: isComplete ? 'complete' : 'drafting',
  };
}

// ===== Build Roster from Draft Picks =====

const POSITIONS: FieldPosition[] = ['C', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF'];

/**
 * Convert draft picks into a Roster for the game engine.
 * Auto-assigns defensive positions by defense rating.
 * Batting order by OB (best OB bats first).
 */
export function buildRosterFromDraft(
  picks: string[],
  teamName: string,
): Roster {
  // Last pick is pitcher
  const pitcherId = picks[picks.length - 1];
  const hitterIds = picks.slice(0, 9);

  // Sort hitters by defense for position assignment
  const hitters = hitterIds.map(id => {
    const card = BASEBALL_CARDS.find(c => c.id === id)!;
    const stats = card.stats as HitterStats;
    return { id, defense: stats.defense, ob: stats.onBase, cost: stats.pointCost };
  });

  // Assign positions: highest defense gets premium positions
  const byDefense = [...hitters].sort((a, b) => b.defense - a.defense);
  const positionAssignment: { cardId: string; position: FieldPosition }[] = [];
  const positionPool = [...POSITIONS];

  for (const h of byDefense) {
    const pos = positionPool.shift()!;
    positionAssignment.push({ cardId: h.id, position: pos });
  }

  // Batting order: sort by OB (best OB bats first)
  const byOB = [...positionAssignment].sort((a, b) => {
    const aCard = BASEBALL_CARDS.find(c => c.id === a.cardId)!;
    const bCard = BASEBALL_CARDS.find(c => c.id === b.cardId)!;
    const aOB = (aCard.stats as HitterStats).onBase;
    const bOB = (bCard.stats as HitterStats).onBase;
    return bOB - aOB;
  });

  const totalCost = picks.reduce((sum, id) => {
    const card = BASEBALL_CARDS.find(c => c.id === id)!;
    return sum + card.stats.pointCost;
  }, 0);

  return {
    name: teamName,
    hitters: byOB.map((h, i) => ({
      cardId: h.cardId,
      position: h.position,
      battingOrder: i + 1,
    })),
    pitcher: pitcherId,
    totalCost,
  };
}

/**
 * Check if the pool can still provide valid picks for a team.
 */
export function canTeamStillDraft(
  state: DraftState,
  team: DraftTurn,
): boolean {
  const currentCost = team === 'player' ? state.playerCost : state.aiCost;
  const currentPicks = team === 'player' ? state.playerPicks.length : state.aiPicks.length;
  const isPitcherPick = currentPicks === 9;

  return state.pool.some(c => {
    if (currentCost + c.stats.pointCost > MAX_ROSTER_COST) return false;
    if (isPitcherPick) return c.stats.type === 'pitcher';
    return c.stats.type === 'hitter';
  });
}
