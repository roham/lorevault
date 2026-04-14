// Public Domain Baseball — Game Loop
// State machine that drives a full baseball game through at-bats.
// Uses the engine functions for mechanics. No UI coupling.

import {
  GameState,
  PlayLogEntry,
  BaseballCard,
  HitterStats,
  PitcherStats,
  StealAttempt,
  GameSummary,
  getSpeedRating,
} from './types';
import {
  rollD20,
  resolveAtBat,
  advanceRunners,
  applySacFly,
  resolveSteal,
  applySteal,
  resolveDoublePlay,
  createGame,
  checkGameOver,
  advanceInning,
  getBattingTeam,
  getCurrentBatter,
  getCurrentPitcher,
  advanceBattingOrder,
  generateGameSummary,
} from './engine';

// ===== Card Registry =====
// The game loop needs to look up card stats by ID.
// Pass a Map<cardId, BaseballCard> to all game functions.

export type CardRegistry = Map<string, BaseballCard>;

// ===== Play Next At-Bat =====

export interface AtBatResult {
  state: GameState;
  logEntry: PlayLogEntry;
  stealAttempt?: StealAttempt;
  isHalfInningOver: boolean;
  isGameOver: boolean;
}

/**
 * Execute one at-bat in the game.
 * This is the core game loop step — call this repeatedly to play a full game.
 *
 * cardEvolutions: optional Map<cardId, evolutionTier> for evolved hit charts.
 * Only player hitters accumulate XP, so only their charts get modified.
 *
 * Returns the updated state, the play log entry, and flags.
 */
export function playAtBat(
  state: GameState,
  cards: CardRegistry,
  attemptSteal?: { fromBase: 'first' | 'second' },
  cardEvolutions?: Map<string, number>,
): AtBatResult {
  if (state.isGameOver) {
    throw new Error('Game is already over');
  }

  let currentState = { ...state };
  let stealAttempt: StealAttempt | undefined;

  // ===== Optional Steal Attempt (before at-bat) =====
  if (attemptSteal) {
    const runner = attemptSteal.fromBase === 'first'
      ? currentState.bases.first
      : currentState.bases.second;

    if (runner) {
      const runnerCard = cards.get(runner.cardId);
      // Get catcher's defense
      const battingTeam = getBattingTeam(currentState);
      const fieldingRoster = battingTeam === 'away' ? currentState.homeRoster : currentState.awayRoster;
      const catcher = fieldingRoster.hitters.find(h => h.position === 'C');
      const catcherCard = catcher ? cards.get(catcher.cardId) : null;
      const catcherDefense = catcherCard && catcherCard.stats.type === 'hitter'
        ? catcherCard.stats.defense : 3;

      if (runnerCard && runnerCard.stats.type === 'hitter') {
        const stealRoll = rollD20();
        stealAttempt = resolveSteal(
          stealRoll,
          runnerCard.stats.speed,
          catcherDefense,
          runnerCard.character,
          attemptSteal.fromBase,
        );

        currentState = {
          ...currentState,
          bases: applySteal(currentState.bases, attemptSteal.fromBase, stealAttempt.success),
        };

        if (!stealAttempt.success) {
          currentState = {
            ...currentState,
            inning: { ...currentState.inning, outs: currentState.inning.outs + 1 },
          };

          // Check if half-inning is over after caught stealing
          if (currentState.inning.outs >= 3) {
            const advanced = advanceInning(currentState);
            return {
              state: advanced,
              logEntry: {
                inning: state.inning.inning,
                half: state.inning.half,
                batter: '',
                pitcher: '',
                controlRoll: 0,
                controlResult: 'pitcher',
                outcomeRoll: 0,
                outcome: 'strikeout', // placeholder
                runsScored: 0,
                description: `${runnerCard.character} caught stealing ${attemptSteal.fromBase === 'first' ? 'second' : 'third'}! Inning over.`,
              },
              stealAttempt,
              isHalfInningOver: true,
              isGameOver: advanced.isGameOver,
            };
          }
        }
      }
    }
  }

  // ===== Get Current Batter and Pitcher =====
  const batterSlot = getCurrentBatter(currentState);
  const pitcherId = getCurrentPitcher(currentState);
  const batterCard = cards.get(batterSlot.cardId);
  const pitcherCard = cards.get(pitcherId);

  if (!batterCard || !pitcherCard) {
    throw new Error(`Missing card: batter=${batterSlot.cardId} pitcher=${pitcherId}`);
  }
  if (batterCard.stats.type !== 'hitter' || pitcherCard.stats.type !== 'pitcher') {
    throw new Error('Invalid card types for at-bat');
  }

  const hitterStats = batterCard.stats as HitterStats;
  const pitcherStats = pitcherCard.stats as PitcherStats;

  // ===== Roll Dice =====
  const controlRoll = rollD20();
  const outcomeRoll = rollD20();

  // ===== Resolve At-Bat =====
  const hitterEvoTier = cardEvolutions?.get(batterSlot.cardId) ?? 0;
  const { outcome, controlResult, description } = resolveAtBat(
    controlRoll,
    outcomeRoll,
    hitterStats,
    pitcherStats,
    batterCard.character,
    pitcherCard.character,
    hitterEvoTier,
  );

  // ===== Is it an out? =====
  const isOut = ['strikeout', 'groundout', 'flyout', 'groundout_dp'].includes(outcome);

  // ===== Handle outs =====
  let newOuts = currentState.inning.outs;
  let runsScored = 0;
  let newBases = currentState.bases;

  if (isOut) {
    newOuts++;

    // Sac fly check (flyout with runner on 3rd, < 2 outs)
    if (outcome === 'flyout') {
      const sacResult = applySacFly(newBases, currentState.inning.outs);
      runsScored += sacResult.runsScored;
      newBases = sacResult.bases;
    }

    // Double play check
    if (outcome === 'groundout_dp' && newBases.first) {
      // Get fielder defense at SS (typical DP pivot)
      const battingTeam = getBattingTeam(currentState);
      const fieldingRoster = battingTeam === 'away' ? currentState.homeRoster : currentState.awayRoster;
      const ssSlot = fieldingRoster.hitters.find(h => h.position === 'SS');
      const ssCard = ssSlot ? cards.get(ssSlot.cardId) : null;
      const ssDefense = ssCard && ssCard.stats.type === 'hitter' ? ssCard.stats.defense : 3;

      const dpRoll = rollD20();
      if (resolveDoublePlay(dpRoll, ssDefense * 3)) { // defense * 3 for reasonable DP odds
        newOuts++; // second out
        if (newBases.third) runsScored++; // runner on 3rd can score on DP
        newBases = { first: null, second: newBases.second, third: null };
      } else {
        // Failed DP — just the groundout
        const groundResult = advanceRunners(newBases, 'groundout', getSpeedRating(hitterStats.speed), batterSlot.cardId);
        runsScored += groundResult.runsScored;
        newBases = groundResult.bases;
      }
    }
  } else {
    // Hit or walk — advance runners
    const result = advanceRunners(
      newBases,
      outcome,
      getSpeedRating(hitterStats.speed),
      batterSlot.cardId,
    );
    runsScored += result.runsScored;
    newBases = result.bases;
  }

  // ===== Update Score =====
  const battingTeam = getBattingTeam(currentState);
  const newScore = { ...currentState.score };
  newScore[battingTeam === 'away' ? 'away' : 'home'] += runsScored;

  // ===== Create Log Entry =====
  const logEntry: PlayLogEntry = {
    inning: currentState.inning.inning,
    half: currentState.inning.half,
    batter: batterCard.character,
    pitcher: pitcherCard.character,
    controlRoll,
    controlResult,
    outcomeRoll,
    outcome,
    runsScored,
    description: runsScored > 0
      ? `${description} ${runsScored} run${runsScored > 1 ? 's' : ''} score!`
      : description,
  };

  // ===== Build New State =====
  let newState: GameState = {
    ...currentState,
    inning: { ...currentState.inning, outs: newOuts },
    bases: newBases,
    score: newScore,
    log: [...currentState.log, logEntry],
  };

  // Advance batting order
  newState = advanceBattingOrder(newState);

  // Check if half-inning is over
  let isHalfInningOver = false;
  if (newOuts >= 3) {
    isHalfInningOver = true;
    newState = advanceInning(newState);
  }

  // Check walk-off
  if (!newState.isGameOver) {
    newState = { ...newState, isGameOver: checkGameOver(newState) };
  }

  return {
    state: newState,
    logEntry,
    stealAttempt,
    isHalfInningOver,
    isGameOver: newState.isGameOver,
  };
}

// ===== Simulate Full Game =====

/**
 * Play a full game automatically (for testing / AI vs AI).
 * Returns the final state.
 */
export function simulateGame(
  state: GameState,
  cards: CardRegistry,
): GameState {
  let current = state;
  let safety = 0;
  const maxAtBats = 200; // prevent infinite loops

  while (!current.isGameOver && safety < maxAtBats) {
    const result = playAtBat(current, cards);
    current = result.state;
    safety++;
  }

  return current;
}

/**
 * Get game summary after a completed game.
 */
export function getGameSummary(state: GameState): GameSummary {
  return generateGameSummary(state);
}
