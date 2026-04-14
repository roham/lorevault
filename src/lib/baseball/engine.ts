// Public Domain Baseball — Game Engine
// Pure functions. No UI. No side effects. No randomness source built-in.
// All random values are passed as arguments for testability.

import {
  GameState,
  BaseState,
  BaseRunner,
  AtBatOutcome,
  PlayLogEntry,
  HalfInning,
  Roster,
  HitterStats,
  PitcherStats,
  SpeedRating,
  getSpeedRating,
  StealAttempt,
  GameSummary,
  LineupSlot,
  BaseballCard,
} from './types';
import { generateHitterChart, generatePitcherChart, resolveChart } from './charts';
import { evolveHitterChart } from './evolution';

// ===== Dice =====

/** Roll a d20. Returns 1-20. */
export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

// ===== Control Roll =====

/**
 * Resolve who controls the at-bat.
 * If roll ≤ pitcher's Control → pitcher controls.
 * If roll > pitcher's Control → hitter controls.
 */
export function resolveControlRoll(
  roll: number,
  pitcherControl: number
): 'pitcher' | 'hitter' {
  return roll <= pitcherControl ? 'pitcher' : 'hitter';
}

// ===== At-Bat Resolution =====

/**
 * Resolve a complete at-bat.
 * Returns the outcome and a play-by-play description.
 */
export function resolveAtBat(
  controlRoll: number,
  outcomeRoll: number,
  hitterStats: HitterStats,
  pitcherStats: PitcherStats,
  batterName: string,
  pitcherName: string,
  hitterEvolutionTier?: number,
): { outcome: AtBatOutcome; controlResult: 'pitcher' | 'hitter'; description: string } {
  const controlResult = resolveControlRoll(controlRoll, pitcherStats.control);

  let outcome: AtBatOutcome;
  if (controlResult === 'pitcher') {
    const chart = generatePitcherChart(pitcherStats);
    outcome = resolveChart(chart, outcomeRoll);
  } else {
    let chart = generateHitterChart(hitterStats);
    if (hitterEvolutionTier && hitterEvolutionTier > 0) {
      chart = evolveHitterChart(chart, hitterEvolutionTier);
    }
    outcome = resolveChart(chart, outcomeRoll);
  }

  const description = describeOutcome(outcome, batterName, pitcherName, controlResult);

  return { outcome, controlResult, description };
}

function describeOutcome(
  outcome: AtBatOutcome,
  batter: string,
  pitcher: string,
  control: 'pitcher' | 'hitter'
): string {
  const prefix = control === 'pitcher'
    ? `${pitcher} dominates —`
    : `${batter} takes control —`;

  switch (outcome) {
    case 'strikeout': return `${prefix} ${batter} strikes out swinging!`;
    case 'groundout': return `${prefix} ${batter} grounds out.`;
    case 'groundout_dp': return `${prefix} ${batter} hits into a potential double play!`;
    case 'flyout': return `${prefix} ${batter} flies out.`;
    case 'walk': return `${prefix} ${batter} draws a walk.`;
    case 'single': return `${prefix} ${batter} lines a single!`;
    case 'double': return `${prefix} ${batter} crushes a double into the gap!`;
    case 'triple': return `${prefix} ${batter} blazes a triple!`;
    case 'homerun': return `${prefix} ${batter} CRUSHES a home run! Gone!`;
  }
}

// ===== Runner Advancement =====

/**
 * Advance runners based on at-bat outcome.
 * Returns updated bases and runs scored.
 */
export function advanceRunners(
  bases: BaseState,
  outcome: AtBatOutcome,
  batterSpeed: SpeedRating,
  batterCardId: string,
): { bases: BaseState; runsScored: number } {
  const batter: BaseRunner = { cardId: batterCardId, speedRating: batterSpeed };
  let runsScored = 0;

  switch (outcome) {
    case 'strikeout':
    case 'flyout':
      // Sac fly: runner on 3rd scores on flyout with < 2 outs (handled by caller checking outs)
      return { bases, runsScored: 0 };

    case 'groundout':
      // Runner on 3rd can score on groundout
      if (bases.third) {
        runsScored++;
        return {
          bases: { first: null, second: bases.second, third: null },
          runsScored,
        };
      }
      return { bases, runsScored: 0 };

    case 'groundout_dp':
      // Double play: runner on 1st is out, batter is out
      // Other runners hold (runner on 3rd can score)
      if (bases.first) {
        if (bases.third) runsScored++;
        return {
          bases: { first: null, second: bases.second, third: null },
          runsScored,
        };
      }
      // No runner on first — just a normal groundout
      if (bases.third) {
        runsScored++;
        return {
          bases: { first: null, second: bases.second, third: null },
          runsScored,
        };
      }
      return { bases, runsScored: 0 };

    case 'walk':
      // Force advancement: only runners directly "pushed"
      if (bases.first) {
        if (bases.second) {
          if (bases.third) runsScored++; // bases loaded walk
          return {
            bases: { first: batter, second: bases.first, third: bases.second },
            runsScored,
          };
        }
        return {
          bases: { first: batter, second: bases.first, third: bases.third },
          runsScored,
        };
      }
      return {
        bases: { first: batter, second: bases.second, third: bases.third },
        runsScored,
      };

    case 'single':
      // Runners advance 1 base. Speed A runner on 2nd scores.
      if (bases.third) runsScored++;
      if (bases.second) {
        if (bases.second.speedRating === 'A') {
          runsScored++;
          return {
            bases: { first: batter, second: null, third: bases.first || null },
            runsScored,
          };
        }
        return {
          bases: { first: batter, second: null, third: bases.second },
          runsScored,
        };
      }
      return {
        bases: { first: batter, second: bases.first || null, third: null },
        runsScored,
      };

    case 'double':
      // Runners on 2nd and 3rd score. Runner on 1st: Speed A scores, B goes to 3rd.
      if (bases.third) runsScored++;
      if (bases.second) runsScored++;
      if (bases.first) {
        if (bases.first.speedRating === 'A') {
          runsScored++;
          return { bases: { first: null, second: batter, third: null }, runsScored };
        }
        return { bases: { first: null, second: batter, third: bases.first }, runsScored };
      }
      return { bases: { first: null, second: batter, third: null }, runsScored };

    case 'triple':
      // All runners score. Batter on 3rd.
      if (bases.third) runsScored++;
      if (bases.second) runsScored++;
      if (bases.first) runsScored++;
      return { bases: { first: null, second: null, third: batter }, runsScored };

    case 'homerun':
      // Everyone scores including batter.
      if (bases.third) runsScored++;
      if (bases.second) runsScored++;
      if (bases.first) runsScored++;
      runsScored++; // batter scores
      return { bases: { first: null, second: null, third: null }, runsScored };
  }
}

// ===== Steal Mechanic =====

/**
 * Attempt a steal.
 * Threshold = runner's speed - catcher's defense
 * Roll ≤ threshold → safe, else out.
 */
export function resolveSteal(
  roll: number,
  runnerSpeed: number,
  catcherDefense: number,
  runnerName: string,
  fromBase: 'first' | 'second',
): StealAttempt {
  const threshold = runnerSpeed - catcherDefense;
  const success = roll <= threshold;
  return {
    runner: runnerName,
    fromBase,
    roll,
    threshold,
    success,
  };
}

/**
 * Apply steal result to base state.
 */
export function applySteal(
  bases: BaseState,
  fromBase: 'first' | 'second',
  success: boolean,
): BaseState {
  if (fromBase === 'first') {
    if (success) {
      return { ...bases, first: null, second: bases.first };
    }
    return { ...bases, first: null }; // caught stealing
  }
  if (fromBase === 'second') {
    if (success) {
      return { ...bases, second: null, third: bases.second };
    }
    return { ...bases, second: null }; // caught stealing
  }
  return bases;
}

// ===== Sac Fly =====

/**
 * Check and apply sacrifice fly.
 * Runner on 3rd scores on flyout if < 2 outs.
 */
export function applySacFly(
  bases: BaseState,
  outs: number,
): { bases: BaseState; runsScored: number } {
  if (bases.third && outs < 2) {
    return {
      bases: { ...bases, third: null },
      runsScored: 1,
    };
  }
  return { bases, runsScored: 0 };
}

// ===== Double Play Resolution =====

/**
 * Resolve double play attempt.
 * Roll ≤ fielder defense at relevant position → double play.
 */
export function resolveDoublePlay(
  roll: number,
  fielderDefense: number,
): boolean {
  return roll <= fielderDefense;
}

// ===== Game State Helpers =====

/** Create initial game state. */
export function createGame(
  awayRoster: Roster,
  homeRoster: Roster,
  innings: 3 | 9 = 3,
): GameState {
  return {
    id: `game-${Date.now()}`,
    innings,
    inning: { inning: 1, half: 'top', outs: 0 },
    bases: { first: null, second: null, third: null },
    score: { away: 0, home: 0 },
    battingOrderIndex: { away: 0, home: 0 },
    awayRoster,
    homeRoster,
    isGameOver: false,
    log: [],
  };
}

/** Check if the game is over. */
export function checkGameOver(state: GameState): boolean {
  const { inning, score, innings } = state;

  // Game ends after bottom of last inning (or top if home is ahead)
  if (inning.inning > innings) return true;

  // Walk-off: bottom of last inning, home team takes the lead
  if (inning.inning === innings && inning.half === 'bottom' && score.home > score.away) {
    return true;
  }

  // Home team ahead going into bottom of last — no need to play
  if (inning.inning === innings && inning.half === 'bottom' && score.home > score.away) {
    return true;
  }

  return false;
}

/** Advance to next half-inning. */
export function advanceInning(state: GameState): GameState {
  const { inning, innings, score } = state;

  let nextHalf: HalfInning;
  let nextInning: number;

  if (inning.half === 'top') {
    nextHalf = 'bottom';
    nextInning = inning.inning;
  } else {
    nextHalf = 'top';
    nextInning = inning.inning + 1;
  }

  // Check if game should end
  // Skip bottom of last if home is ahead after top
  if (nextHalf === 'bottom' && nextInning === innings + 1) {
    return { ...state, isGameOver: true };
  }
  if (inning.half === 'top' && inning.inning === innings && score.home > score.away) {
    // Home team ahead — skip bottom, game over
    return { ...state, isGameOver: true };
  }

  return {
    ...state,
    inning: { inning: nextInning, half: nextHalf, outs: 0 },
    bases: { first: null, second: null, third: null },
  };
}

/** Get current batting team. */
export function getBattingTeam(state: GameState): 'away' | 'home' {
  return state.inning.half === 'top' ? 'away' : 'home';
}

/** Get current batter's lineup slot. */
export function getCurrentBatter(state: GameState): LineupSlot {
  const team = getBattingTeam(state);
  const roster = team === 'away' ? state.awayRoster : state.homeRoster;
  const orderIdx = state.battingOrderIndex[team];
  return roster.hitters[orderIdx % roster.hitters.length];
}

/** Get the pitching team's pitcher card ID. */
export function getCurrentPitcher(state: GameState): string {
  const team = getBattingTeam(state);
  return team === 'away' ? state.homeRoster.pitcher : state.awayRoster.pitcher;
}

/** Advance batting order after an at-bat. */
export function advanceBattingOrder(state: GameState): GameState {
  const team = getBattingTeam(state);
  return {
    ...state,
    battingOrderIndex: {
      ...state.battingOrderIndex,
      [team]: (state.battingOrderIndex[team] + 1) % 9,
    },
  };
}

// ===== Game Summary =====

export function generateGameSummary(state: GameState): GameSummary {
  const winner = state.score.away > state.score.home ? 'away' : 'home';

  // Find MVP: player with most hits + RBIs
  const playerStats = new Map<string, { hits: number; rbis: number }>();
  for (const entry of state.log) {
    const isHit = ['single', 'double', 'triple', 'homerun'].includes(entry.outcome);
    if (!playerStats.has(entry.batter)) {
      playerStats.set(entry.batter, { hits: 0, rbis: 0 });
    }
    const ps = playerStats.get(entry.batter)!;
    if (isHit) ps.hits++;
    ps.rbis += entry.runsScored;
  }

  let mvpName = '';
  let mvpScore = -1;
  for (const [name, stats] of playerStats) {
    const score = stats.hits * 2 + stats.rbis * 3;
    if (score > mvpScore) {
      mvpScore = score;
      mvpName = name;
    }
  }
  const mvpStats = playerStats.get(mvpName) || { hits: 0, rbis: 0 };

  // Key plays: home runs and scoring plays
  const keyPlays = state.log.filter(e =>
    e.outcome === 'homerun' || e.runsScored > 0
  ).slice(-5);

  return {
    winner,
    finalScore: state.score,
    totalInnings: state.inning.inning,
    mvp: { character: mvpName, hits: mvpStats.hits, rbis: mvpStats.rbis },
    keyPlays,
  };
}
