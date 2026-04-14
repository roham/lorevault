'use client';

import { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  GameState,
  Roster,
  FieldPosition,
  HitterStats,
  PitcherStats,
  PlayLogEntry,
  AtBatOutcome,
  getSpeedRating,
} from '@/lib/baseball/types';
import {
  createGame,
  rollD20,
  resolveControlRoll,
  resolveAtBat,
  getBattingTeam,
  getCurrentBatter,
  getCurrentPitcher,
  advanceRunners,
  applySacFly,
  resolveDoublePlay,
  advanceInning,
  advanceBattingOrder,
  checkGameOver,
  generateGameSummary,
} from '@/lib/baseball/engine';
import { BASEBALL_CARDS, buildCardRegistry } from '@/data/baseball-stats';
import { generateAILineup } from '@/lib/baseball/ai';
import { CardRegistry } from '@/lib/baseball/game';
import { DiceRoller } from '@/components/baseball/DiceRoller';
import { OutcomeReveal } from '@/components/baseball/OutcomeReveal';
import { ParticleBurst } from '@/components/baseball/ParticleBurst';
import { ScreenShake } from '@/components/baseball/ScreenShake';

// ===== Animation Phase State Machine =====

type AnimPhase =
  | 'idle'              // waiting for player to roll
  | 'control-rolling'   // dice are spinning for control roll
  | 'control-landed'    // control roll landed, showing who controls
  | 'outcome-rolling'   // dice spinning for outcome roll
  | 'outcome-landed'    // outcome resolved, showing dramatic reveal
  | 'half-inning'       // half-inning transition screen
  | 'game-over';        // game finished

interface BoardState {
  game: GameState | null;
  animPhase: AnimPhase;
  // Roll data for current at-bat
  controlRollValue: number | null;
  controlResult: 'pitcher' | 'hitter' | null;
  outcomeRollValue: number | null;
  currentOutcome: AtBatOutcome | null;
  currentBatterName: string;
  currentPitcherName: string;
  currentRunsScored: number;
  currentDescription: string;
  // Registry + rosters
  cards: CardRegistry;
  playerRoster: Roster | null;
  aiRoster: Roster | null;
  // Shake trigger (increments to re-trigger)
  shakeTrigger: number;
  // Particle burst
  particleBurst: boolean;
}

type BoardAction =
  | { type: 'INIT_GAME'; game: GameState; playerRoster: Roster; aiRoster: Roster; cards: CardRegistry }
  | { type: 'START_CONTROL_ROLL'; value: number; result: 'pitcher' | 'hitter'; batterName: string; pitcherName: string }
  | { type: 'CONTROL_LANDED' }
  | { type: 'START_OUTCOME_ROLL'; value: number }
  | { type: 'OUTCOME_LANDED'; game: GameState; outcome: AtBatOutcome; runsScored: number; description: string; isHalfInningOver: boolean; isGameOver: boolean }
  | { type: 'RETURN_IDLE' }
  | { type: 'HALF_INNING_DONE' };

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        game: action.game,
        animPhase: 'idle',
        playerRoster: action.playerRoster,
        aiRoster: action.aiRoster,
        cards: action.cards,
        controlRollValue: null,
        controlResult: null,
        outcomeRollValue: null,
        currentOutcome: null,
        currentBatterName: '',
        currentPitcherName: '',
        currentRunsScored: 0,
        currentDescription: '',
        shakeTrigger: 0,
        particleBurst: false,
      };

    case 'START_CONTROL_ROLL':
      return {
        ...state,
        animPhase: 'control-rolling',
        controlRollValue: action.value,
        controlResult: action.result,
        currentBatterName: action.batterName,
        currentPitcherName: action.pitcherName,
        outcomeRollValue: null,
        currentOutcome: null,
        currentRunsScored: 0,
        currentDescription: '',
        particleBurst: false,
      };

    case 'CONTROL_LANDED':
      return { ...state, animPhase: 'control-landed' };

    case 'START_OUTCOME_ROLL':
      return {
        ...state,
        animPhase: 'outcome-rolling',
        outcomeRollValue: action.value,
      };

    case 'OUTCOME_LANDED': {
      const isEpic = action.outcome === 'homerun';
      const isBig = ['strikeout', 'triple', 'groundout_dp'].includes(action.outcome);
      return {
        ...state,
        game: action.game,
        animPhase: action.isGameOver ? 'game-over' : action.isHalfInningOver ? 'half-inning' : 'outcome-landed',
        currentOutcome: action.outcome,
        currentRunsScored: action.runsScored,
        currentDescription: action.description,
        shakeTrigger: isEpic || isBig ? state.shakeTrigger + 1 : state.shakeTrigger,
        particleBurst: isEpic,
      };
    }

    case 'RETURN_IDLE':
      return {
        ...state,
        animPhase: 'idle',
        controlRollValue: null,
        controlResult: null,
        outcomeRollValue: null,
        currentOutcome: null,
        particleBurst: false,
      };

    case 'HALF_INNING_DONE':
      return {
        ...state,
        animPhase: 'idle',
        controlRollValue: null,
        controlResult: null,
        outcomeRollValue: null,
        currentOutcome: null,
        particleBurst: false,
      };

    default:
      return state;
  }
}

const initialState: BoardState = {
  game: null,
  animPhase: 'idle',
  controlRollValue: null,
  controlResult: null,
  outcomeRollValue: null,
  currentOutcome: null,
  currentBatterName: '',
  currentPitcherName: '',
  currentRunsScored: 0,
  currentDescription: '',
  cards: new Map(),
  playerRoster: null,
  aiRoster: null,
  shakeTrigger: 0,
  particleBurst: false,
};

// ===== Diamond SVG =====

function Diamond({ bases }: { bases: { first: boolean; second: boolean; third: boolean } }) {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto">
      {/* Base paths */}
      <line x1="100" y1="170" x2="160" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <line x1="160" y1="110" x2="100" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <line x1="100" y1="50" x2="40" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <line x1="40" y1="110" x2="100" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

      {/* Home plate */}
      <polygon points="100,170 94,162 100,156 106,162" fill="rgba(255,255,255,0.25)" />

      {/* Infield grass */}
      <polygon points="100,170 160,110 100,50 40,110" fill="rgba(34,197,94,0.03)" />

      {/* First base */}
      <rect x="153" y="103" width="14" height="14" rx="2" fill={bases.first ? '#f59e0b' : 'transparent'} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" transform="rotate(45, 160, 110)" />
      {bases.first && <circle cx="160" cy="110" r="12" fill="#f59e0b" opacity="0.25"><animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite" /></circle>}

      {/* Second base */}
      <rect x="93" y="43" width="14" height="14" rx="2" fill={bases.second ? '#f59e0b' : 'transparent'} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" transform="rotate(45, 100, 50)" />
      {bases.second && <circle cx="100" cy="50" r="12" fill="#f59e0b" opacity="0.25"><animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite" /></circle>}

      {/* Third base */}
      <rect x="33" y="103" width="14" height="14" rx="2" fill={bases.third ? '#f59e0b' : 'transparent'} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" transform="rotate(45, 40, 110)" />
      {bases.third && <circle cx="40" cy="110" r="12" fill="#f59e0b" opacity="0.25"><animate attributeName="r" values="12;16;12" dur="1.5s" repeatCount="indefinite" /></circle>}
    </svg>
  );
}

// ===== Out Dots =====

function OutDots({ outs }: { outs: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      <span className="text-[9px] text-muted/40 mr-0.5">OUT</span>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
            i < outs
              ? 'bg-red-500 border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.4)]'
              : 'bg-transparent border-white/15'
          }`}
        />
      ))}
    </div>
  );
}

// ===== Card Display =====

function PlayerCard({
  cardId,
  label,
  cards,
  highlighted,
}: {
  cardId: string | null;
  label: string;
  cards: CardRegistry;
  highlighted?: boolean;
}) {
  const card = cardId ? cards.get(cardId) : null;
  if (!card) return (
    <div className="flex-1 p-3 rounded-xl bg-surface/30 border border-border/20">
      <span className="text-[10px] text-muted/30">{label}</span>
    </div>
  );

  const stats = card.stats;
  const isPitcher = stats.type === 'pitcher';

  return (
    <motion.div
      className={`flex-1 p-3 rounded-xl border transition-colors duration-300 ${
        highlighted
          ? 'bg-surface border-amber-500/30 shadow-[0_0_12px_rgba(251,191,36,0.1)]'
          : 'bg-surface border-border/40'
      }`}
      animate={highlighted ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <span className="text-[10px] text-muted/50 uppercase tracking-wider">{label}</span>
      <h3 className="text-sm font-bold truncate mt-0.5">{card.character}</h3>
      <div className="flex gap-2 mt-1.5 text-[10px] text-muted">
        {isPitcher ? (
          <>
            <span>CTL <span className="text-white font-bold">{(stats as PitcherStats).control}</span></span>
            <span>FLD <span className="text-white font-bold">{(stats as PitcherStats).fielding}</span></span>
          </>
        ) : (
          <>
            <span>OB <span className="text-white font-bold">{(stats as HitterStats).onBase}</span></span>
            <span>PWR <span className="text-white font-bold">{(stats as HitterStats).power}</span></span>
            <span>SPD <span className="text-white font-bold">{(stats as HitterStats).speed}</span></span>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ===== Control Roll Display =====

function ControlRollDisplay({
  result,
  pitcherName,
  batterName,
}: {
  result: 'pitcher' | 'hitter';
  pitcherName: string;
  batterName: string;
}) {
  const isPitcher = result === 'pitcher';
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
        isPitcher
          ? 'bg-red-500/10 border-red-500/20'
          : 'bg-green-500/10 border-green-500/20'
      }`}>
        <span className={`text-xs font-bold ${isPitcher ? 'text-red-400' : 'text-green-400'}`}>
          {isPitcher ? pitcherName : batterName}
        </span>
        <span className="text-[10px] text-muted/50">controls the at-bat</span>
      </div>
    </motion.div>
  );
}

// ===== Main Game Board =====

export default function PlayPage() {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize game on mount
  useEffect(() => {
    const cards = buildCardRegistry();

    let playerRoster: Roster;
    try {
      const saved = JSON.parse(localStorage.getItem('pdb-lineups') || '[]');
      if (saved.length > 0) {
        const latest = saved[saved.length - 1];
        playerRoster = {
          name: latest.name || 'My Team',
          hitters: latest.hitters.map((h: { cardId: string; position: string; order: number }) => ({
            cardId: h.cardId,
            position: h.position as FieldPosition,
            battingOrder: h.order,
          })),
          pitcher: latest.pitcherId,
          totalCost: latest.totalCost,
        };
      } else {
        const ai = generateAILineup('veteran', new Set());
        playerRoster = { ...ai, name: 'Your Team' };
      }
    } catch {
      const ai = generateAILineup('veteran', new Set());
      playerRoster = { ...ai, name: 'Your Team' };
    }

    const playerIds = new Set([
      ...playerRoster.hitters.map(h => h.cardId),
      playerRoster.pitcher,
    ]);
    const aiRoster = generateAILineup('veteran', playerIds, 12345);

    const game = createGame(aiRoster, playerRoster, 3);
    dispatch({ type: 'INIT_GAME', game, playerRoster, aiRoster, cards });
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Scroll log on new entries
  useEffect(() => {
    if (state.currentOutcome && logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [state.currentOutcome]);

  // ===== Full at-bat resolution (called after control roll dice land) =====
  const resolveFullAtBat = useCallback((
    game: GameState,
    cards: CardRegistry,
    controlRoll: number,
    controlResult: 'pitcher' | 'hitter',
  ) => {
    const batterSlot = getCurrentBatter(game);
    const pitcherId = getCurrentPitcher(game);
    const batterCard = cards.get(batterSlot.cardId);
    const pitcherCard = cards.get(pitcherId);

    if (!batterCard || !pitcherCard) return;
    if (batterCard.stats.type !== 'hitter' || pitcherCard.stats.type !== 'pitcher') return;

    const hitterStats = batterCard.stats as HitterStats;
    const pitcherStats = pitcherCard.stats as PitcherStats;

    // Roll outcome
    const outcomeRoll = rollD20();

    // Start outcome dice animation
    dispatch({ type: 'START_OUTCOME_ROLL', value: outcomeRoll });

    // The outcome dice will spin ~1s, then we resolve
    // (resolved in onOutcomeDiceLand callback)

    // Stash the resolution data so the callback can use it
    pendingResolution.current = {
      game, cards, controlRoll, outcomeRoll, hitterStats, pitcherStats,
      batterCard, pitcherCard, batterSlot,
    };
  }, []);

  // Pending resolution data (avoids closure issues)
  const pendingResolution = useRef<{
    game: GameState;
    cards: CardRegistry;
    controlRoll: number;
    outcomeRoll: number;
    hitterStats: HitterStats;
    pitcherStats: PitcherStats;
    batterCard: { character: string; stats: HitterStats | PitcherStats };
    pitcherCard: { character: string; stats: HitterStats | PitcherStats };
    batterSlot: { cardId: string; position: FieldPosition; battingOrder: number };
  } | null>(null);

  // ===== Handle control dice landing =====
  const onControlDiceLand = useCallback(() => {
    dispatch({ type: 'CONTROL_LANDED' });

    // Brief pause to show who controls, then start outcome roll
    timerRef.current = setTimeout(() => {
      if (state.game && state.controlRollValue !== null && state.controlResult !== null) {
        resolveFullAtBat(state.game, state.cards, state.controlRollValue, state.controlResult);
      }
    }, 800);
  }, [state.game, state.controlRollValue, state.controlResult, state.cards, resolveFullAtBat]);

  // ===== Handle outcome dice landing =====
  const onOutcomeDiceLand = useCallback(() => {
    const data = pendingResolution.current;
    if (!data) return;

    const { game, cards, controlRoll, outcomeRoll, hitterStats, pitcherStats, batterCard, pitcherCard, batterSlot } = data;

    // Resolve the at-bat
    const { outcome, controlResult, description } = resolveAtBat(
      controlRoll, outcomeRoll, hitterStats, pitcherStats,
      batterCard.character, pitcherCard.character,
    );

    // Process outcome
    const isOut = ['strikeout', 'groundout', 'flyout', 'groundout_dp'].includes(outcome);
    let newOuts = game.inning.outs;
    let runsScored = 0;
    let newBases = game.bases;

    if (isOut) {
      newOuts++;
      if (outcome === 'flyout') {
        const sacResult = applySacFly(newBases, game.inning.outs);
        runsScored += sacResult.runsScored;
        newBases = sacResult.bases;
      }
      if (outcome === 'groundout_dp' && newBases.first) {
        const battingTeam = getBattingTeam(game);
        const fieldingRoster = battingTeam === 'away' ? game.homeRoster : game.awayRoster;
        const ssSlot = fieldingRoster.hitters.find(h => h.position === 'SS');
        const ssCard = ssSlot ? cards.get(ssSlot.cardId) : null;
        const ssDefense = ssCard && ssCard.stats.type === 'hitter' ? ssCard.stats.defense : 3;
        const dpRoll = rollD20();
        if (resolveDoublePlay(dpRoll, ssDefense * 3)) {
          newOuts++;
          if (newBases.third) runsScored++;
          newBases = { first: null, second: newBases.second, third: null };
        } else {
          const groundResult = advanceRunners(newBases, 'groundout', getSpeedRating(hitterStats.speed), batterSlot.cardId);
          runsScored += groundResult.runsScored;
          newBases = groundResult.bases;
        }
      }
    } else {
      const result = advanceRunners(newBases, outcome, getSpeedRating(hitterStats.speed), batterSlot.cardId);
      runsScored += result.runsScored;
      newBases = result.bases;
    }

    const battingTeam = getBattingTeam(game);
    const newScore = { ...game.score };
    newScore[battingTeam === 'away' ? 'away' : 'home'] += runsScored;

    const logEntry: PlayLogEntry = {
      inning: game.inning.inning,
      half: game.inning.half,
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

    let newState: GameState = {
      ...game,
      inning: { ...game.inning, outs: newOuts },
      bases: newBases,
      score: newScore,
      log: [...game.log, logEntry],
    };
    newState = advanceBattingOrder(newState);

    let isHalfInningOver = false;
    if (newOuts >= 3) {
      isHalfInningOver = true;
      newState = advanceInning(newState);
    }
    if (!newState.isGameOver) {
      newState = { ...newState, isGameOver: checkGameOver(newState) };
    }

    dispatch({
      type: 'OUTCOME_LANDED',
      game: newState,
      outcome,
      runsScored,
      description: logEntry.description,
      isHalfInningOver,
      isGameOver: newState.isGameOver,
    });

    pendingResolution.current = null;

    // Auto-advance from outcome display after delay
    if (!newState.isGameOver && !isHalfInningOver) {
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'RETURN_IDLE' });
      }, 2000);
    }
  }, []);

  // ===== Handle Roll button press =====
  const handleRoll = useCallback(() => {
    if (!state.game || state.animPhase !== 'idle') return;

    const game = state.game;
    const batterSlot = getCurrentBatter(game);
    const pitcherId = getCurrentPitcher(game);
    const batterCard = state.cards.get(batterSlot.cardId);
    const pitcherCard = state.cards.get(pitcherId);

    if (!batterCard || !pitcherCard) return;
    if (pitcherCard.stats.type !== 'pitcher') return;

    const controlRollValue = rollD20();
    const controlResult = resolveControlRoll(controlRollValue, (pitcherCard.stats as PitcherStats).control);

    dispatch({
      type: 'START_CONTROL_ROLL',
      value: controlRollValue,
      result: controlResult,
      batterName: batterCard.character,
      pitcherName: pitcherCard.character,
    });
  }, [state.game, state.animPhase, state.cards]);

  // ===== Render =====

  if (!state.game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.p
          className="text-muted text-sm"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading game...
        </motion.p>
      </div>
    );
  }

  const game = state.game;
  const battingTeam = getBattingTeam(game);
  const batterSlot = getCurrentBatter(game);
  const pitcherId = getCurrentPitcher(game);
  const isPlayerBatting = battingTeam === 'home';
  const summary = game.isGameOver ? generateGameSummary(game) : null;

  const isRolling = state.animPhase === 'control-rolling' || state.animPhase === 'outcome-rolling';
  const showControlResult = state.animPhase === 'control-landed';
  const showOutcome = state.animPhase === 'outcome-landed';
  const shakeIntensity = state.currentOutcome === 'homerun' ? 'heavy' as const
    : ['strikeout', 'groundout_dp', 'triple'].includes(state.currentOutcome || '') ? 'medium' as const
    : 'light' as const;

  return (
    <ScreenShake trigger={state.shakeTrigger > 0} intensity={shakeIntensity}>
      <div className="min-h-screen flex flex-col relative">

        {/* Particle burst for home runs */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <ParticleBurst active={state.particleBurst} count={20} color="gold" />
        </div>

        {/* Scoreboard Strip */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/20 bg-surface/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-muted/60">
              {game.inning.half === 'top' ? 'TOP' : 'BOT'} {game.inning.inning}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-[9px] text-muted/50 uppercase block">{state.aiRoster?.name || 'Away'}</span>
              <span className="text-lg font-bold tabular-nums">{game.score.away}</span>
            </div>
            <span className="text-muted/20 text-xs">vs</span>
            <div className="text-center">
              <span className="text-[9px] text-muted/50 uppercase block">{state.playerRoster?.name || 'Home'}</span>
              <span className="text-lg font-bold tabular-nums">{game.score.home}</span>
            </div>
          </div>
          <OutDots outs={game.inning.outs} />
        </div>

        {/* Batter vs Pitcher Cards */}
        <div className="flex gap-2 px-4 pt-3">
          <PlayerCard
            cardId={batterSlot.cardId}
            label={isPlayerBatting ? 'Your batter' : 'AI batter'}
            cards={state.cards}
            highlighted={state.controlResult === 'hitter' && (showControlResult || showOutcome)}
          />
          <PlayerCard
            cardId={pitcherId}
            label={isPlayerBatting ? 'AI pitcher' : 'Your pitcher'}
            cards={state.cards}
            highlighted={state.controlResult === 'pitcher' && (showControlResult || showOutcome)}
          />
        </div>

        {/* Diamond */}
        <div className="py-3">
          <Diamond
            bases={{
              first: game.bases.first !== null,
              second: game.bases.second !== null,
              third: game.bases.third !== null,
            }}
          />
        </div>

        {/* ===== Dice + Reveal Zone ===== */}
        <div className="px-4 min-h-[140px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {/* Control Roll Phase — Two dice spinning */}
            {(state.animPhase === 'control-rolling' || state.animPhase === 'control-landed') && state.controlRollValue !== null && (
              <motion.div
                key="control-phase"
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-6">
                  <DiceRoller
                    value={state.controlRollValue}
                    isRolling={state.animPhase === 'control-rolling'}
                    label="d20"
                    accentColor={state.controlResult === 'pitcher' ? 'text-red-400' : 'text-green-400'}
                    size="md"
                    onLandComplete={onControlDiceLand}
                  />
                </div>

                {/* Control result label */}
                <AnimatePresence>
                  {showControlResult && state.controlResult && (
                    <ControlRollDisplay
                      result={state.controlResult}
                      pitcherName={state.currentPitcherName}
                      batterName={state.currentBatterName}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Outcome Roll Phase — Second die */}
            {(state.animPhase === 'outcome-rolling') && state.outcomeRollValue !== null && (
              <motion.div
                key="outcome-phase"
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DiceRoller
                  value={state.outcomeRollValue}
                  isRolling={true}
                  label="Outcome"
                  accentColor="text-amber-400"
                  size="md"
                  onLandComplete={onOutcomeDiceLand}
                />
                <span className="text-[10px] text-muted/40">
                  {state.controlResult === 'pitcher' ? 'Pitcher chart...' : 'Hitter chart...'}
                </span>
              </motion.div>
            )}

            {/* Outcome Reveal */}
            {showOutcome && state.currentOutcome && (
              <motion.div
                key="outcome-reveal"
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <OutcomeReveal
                  outcome={state.currentOutcome}
                  batterName={state.currentBatterName}
                  runsScored={state.currentRunsScored}
                  description={state.currentDescription}
                  visible={true}
                />
              </motion.div>
            )}

            {/* Idle state — prompt */}
            {state.animPhase === 'idle' && (
              <motion.p
                key="idle-prompt"
                className="text-[10px] text-muted/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {game.log.length === 0 ? 'Tap Roll to play ball!' : 'Next at-bat ready'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Play-by-play Log */}
        <div
          ref={logRef}
          className="flex-1 px-4 overflow-y-auto max-h-28 mb-2"
        >
          {[...game.log].reverse().map((entry, i) => (
            <div key={`${entry.inning}-${entry.half}-${i}`} className="py-1 border-b border-border/10 last:border-0">
              <p className="text-[10px] text-muted/50">
                <span className="font-mono text-muted/30">{entry.half === 'top' ? 'T' : 'B'}{entry.inning}</span>
                {' '}{entry.description}
                {entry.runsScored > 0 && (
                  <span className="text-amber-400/60 ml-1">+{entry.runsScored}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Half-Inning Banner */}
        <AnimatePresence>
          {state.animPhase === 'half-inning' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
              onClick={() => dispatch({ type: 'HALF_INNING_DONE' })}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="text-center"
              >
                <p className="text-muted/40 text-[10px] uppercase tracking-[0.2em] mb-2">End of</p>
                <p className="text-3xl font-black mb-5">
                  {game.inning.half === 'top' ? 'Top' : 'Bottom'} {game.inning.inning}
                </p>
                <div className="flex items-center gap-8 justify-center mb-8">
                  <div>
                    <span className="text-[10px] text-muted/40 block">{state.aiRoster?.name}</span>
                    <span className="text-3xl font-black tabular-nums">{game.score.away}</span>
                  </div>
                  <span className="text-muted/20 text-sm">—</span>
                  <div>
                    <span className="text-[10px] text-muted/40 block">{state.playerRoster?.name}</span>
                    <span className="text-3xl font-black tabular-nums">{game.score.home}</span>
                  </div>
                </div>
                <motion.p
                  className="text-[10px] text-muted/30"
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Tap to continue
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over */}
        <AnimatePresence>
          {state.animPhase === 'game-over' && summary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="w-full max-w-sm text-center"
              >
                <p className="text-[10px] text-muted/40 uppercase tracking-[0.2em] mb-3">Game Over</p>
                <p className="text-5xl font-black mb-2 tabular-nums">
                  {game.score.away} — {game.score.home}
                </p>
                <motion.p
                  className={`text-sm font-black mb-8 ${
                    summary.winner === 'home' ? 'text-green-400' : 'text-red-400'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
                >
                  {summary.winner === 'home' ? 'YOU WIN!' : 'YOU LOSE'}
                </motion.p>

                {summary.mvp.character && (
                  <motion.div
                    className="p-4 rounded-2xl bg-surface border border-amber-500/20 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-[10px] text-amber-400/50 uppercase tracking-widest">MVP</p>
                    <p className="text-base font-black mt-0.5">{summary.mvp.character}</p>
                    <p className="text-[11px] text-muted/50 mt-1">
                      {summary.mvp.hits} hits, {summary.mvp.rbis} RBIs
                    </p>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Link
                    href="/games/baseball/play"
                    className="block w-full py-3.5 rounded-xl bg-accent text-bg text-sm font-bold hover:bg-accent/90 transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Play Again
                  </Link>
                  <Link
                    href="/games/baseball"
                    className="block text-xs text-muted/40 hover:text-white transition-colors py-2"
                  >
                    Back to Baseball Hub
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roll Button */}
        <div className="sticky bottom-0 p-4 bg-bg/90 backdrop-blur-sm border-t border-border/20">
          {state.animPhase === 'game-over' ? null : (
            <motion.button
              onClick={handleRoll}
              disabled={state.animPhase !== 'idle'}
              className={`w-full py-4 rounded-xl text-base font-black tracking-wider transition-all ${
                state.animPhase === 'idle'
                  ? 'bg-accent text-bg cursor-pointer'
                  : 'bg-surface/50 text-muted/20 border border-border/20 cursor-not-allowed'
              }`}
              animate={
                state.animPhase === 'idle'
                  ? { boxShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 20px rgba(251,191,36,0.15)', '0 0 0px rgba(251,191,36,0)'] }
                  : {}
              }
              transition={
                state.animPhase === 'idle'
                  ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                  : {}
              }
              whileTap={state.animPhase === 'idle' ? { scale: 0.97 } : {}}
            >
              {state.animPhase === 'idle' ? 'ROLL' : ''}
            </motion.button>
          )}
        </div>
      </div>
    </ScreenShake>
  );
}
