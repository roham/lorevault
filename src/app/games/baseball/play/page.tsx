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
  getSpeedRating,
} from '@/lib/baseball/types';
import {
  createGame,
  rollD20,
  resolveControlRoll,
  getBattingTeam,
  getCurrentBatter,
  getCurrentPitcher,
  generateGameSummary,
} from '@/lib/baseball/engine';
import { playAtBat, CardRegistry } from '@/lib/baseball/game';
import { BASEBALL_CARDS, buildCardRegistry } from '@/data/baseball-stats';
import { generateAILineup } from '@/lib/baseball/ai';

// ===== Board State Machine =====

type BoardPhase =
  | 'loading'
  | 'idle'
  | 'control-roll'
  | 'pause'
  | 'outcome-roll'
  | 'resolving'
  | 'half-inning'
  | 'game-over';

interface BoardState {
  game: GameState | null;
  phase: BoardPhase;
  controlRollValue: number | null;
  controlResult: 'pitcher' | 'hitter' | null;
  lastLog: PlayLogEntry | null;
  cards: CardRegistry;
  playerRoster: Roster | null;
  aiRoster: Roster | null;
}

type BoardAction =
  | { type: 'INIT_GAME'; game: GameState; playerRoster: Roster; aiRoster: Roster; cards: CardRegistry }
  | { type: 'CONTROL_ROLL'; value: number; result: 'pitcher' | 'hitter' }
  | { type: 'PAUSE' }
  | { type: 'OUTCOME_RESOLVED'; game: GameState; logEntry: PlayLogEntry; isHalfInningOver: boolean; isGameOver: boolean }
  | { type: 'HALF_INNING_DONE' }
  | { type: 'IDLE' };

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'INIT_GAME':
      return {
        ...state,
        game: action.game,
        phase: 'idle',
        playerRoster: action.playerRoster,
        aiRoster: action.aiRoster,
        cards: action.cards,
        controlRollValue: null,
        controlResult: null,
        lastLog: null,
      };
    case 'CONTROL_ROLL':
      return {
        ...state,
        phase: 'control-roll',
        controlRollValue: action.value,
        controlResult: action.result,
      };
    case 'PAUSE':
      return { ...state, phase: 'pause' };
    case 'OUTCOME_RESOLVED':
      return {
        ...state,
        game: action.game,
        lastLog: action.logEntry,
        phase: action.isGameOver ? 'game-over' : action.isHalfInningOver ? 'half-inning' : 'resolving',
      };
    case 'HALF_INNING_DONE':
      return { ...state, phase: 'idle', lastLog: null, controlRollValue: null, controlResult: null };
    case 'IDLE':
      return { ...state, phase: 'idle', lastLog: null, controlRollValue: null, controlResult: null };
    default:
      return state;
  }
}

const initialState: BoardState = {
  game: null,
  phase: 'loading',
  controlRollValue: null,
  controlResult: null,
  lastLog: null,
  cards: new Map(),
  playerRoster: null,
  aiRoster: null,
};

// ===== Diamond SVG =====

function Diamond({ bases }: { bases: { first: boolean; second: boolean; third: boolean } }) {
  return (
    <svg viewBox="0 0 200 200" className="w-44 h-44 mx-auto">
      {/* Base paths */}
      <line x1="100" y1="170" x2="160" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <line x1="160" y1="110" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <line x1="100" y1="50" x2="40" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <line x1="40" y1="110" x2="100" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

      {/* Home plate */}
      <polygon points="100,170 94,162 100,156 106,162" fill="rgba(255,255,255,0.3)" />

      {/* First base */}
      <circle cx="160" cy="110" r="10" fill={bases.first ? '#f59e0b' : 'transparent'} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {bases.first && <circle cx="160" cy="110" r="10" fill="#f59e0b" opacity="0.4"><animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" /></circle>}

      {/* Second base */}
      <circle cx="100" cy="50" r="10" fill={bases.second ? '#f59e0b' : 'transparent'} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {bases.second && <circle cx="100" cy="50" r="10" fill="#f59e0b" opacity="0.4"><animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" /></circle>}

      {/* Third base */}
      <circle cx="40" cy="110" r="10" fill={bases.third ? '#f59e0b' : 'transparent'} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {bases.third && <circle cx="40" cy="110" r="10" fill="#f59e0b" opacity="0.4"><animate attributeName="r" values="10;14;10" dur="1.5s" repeatCount="indefinite" /></circle>}

      {/* Infield grass hint */}
      <polygon points="100,170 160,110 100,50 40,110" fill="rgba(34,197,94,0.03)" />
    </svg>
  );
}

// ===== Out Dots =====

function OutDots({ outs }: { outs: number }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full border transition-colors ${
            i < outs
              ? 'bg-red-500 border-red-400'
              : 'bg-transparent border-white/20'
          }`}
        />
      ))}
    </div>
  );
}

// ===== Card Display =====

function PlayerCard({ cardId, label, cards }: { cardId: string | null; label: string; cards: CardRegistry }) {
  const card = cardId ? cards.get(cardId) : null;
  if (!card) return (
    <div className="flex-1 p-3 rounded-xl bg-surface/50 border border-border/30">
      <span className="text-[10px] text-muted/40">{label}</span>
    </div>
  );

  const stats = card.stats;
  const isPitcher = stats.type === 'pitcher';

  return (
    <div className="flex-1 p-3 rounded-xl bg-surface border border-border">
      <span className="text-[10px] text-muted uppercase tracking-wider">{label}</span>
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
    </div>
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

    // Load player lineup from localStorage or generate one
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
        // Auto-generate a player lineup
        const ai = generateAILineup('veteran', new Set());
        playerRoster = { ...ai, name: 'Your Team' };
      }
    } catch {
      const ai = generateAILineup('veteran', new Set());
      playerRoster = { ...ai, name: 'Your Team' };
    }

    // Generate AI opponent
    const playerIds = new Set([
      ...playerRoster.hitters.map(h => h.cardId),
      playerRoster.pitcher,
    ]);
    const aiRoster = generateAILineup('veteran', playerIds, 12345);

    // Create game: player is home team
    const game = createGame(aiRoster, playerRoster, 3);

    dispatch({ type: 'INIT_GAME', game, playerRoster, aiRoster, cards });
  }, []);

  // Handle roll sequence
  const handleRoll = useCallback(() => {
    if (!state.game || state.phase !== 'idle') return;

    const game = state.game;
    const pitcherId = getCurrentPitcher(game);
    const pitcherCard = state.cards.get(pitcherId);
    if (!pitcherCard || pitcherCard.stats.type !== 'pitcher') return;

    // Step 1: Control roll
    const controlRollValue = rollD20();
    const controlResult = resolveControlRoll(controlRollValue, (pitcherCard.stats as PitcherStats).control);

    dispatch({ type: 'CONTROL_ROLL', value: controlRollValue, result: controlResult });

    // Step 2: Pause for drama (900ms)
    timerRef.current = setTimeout(() => {
      dispatch({ type: 'PAUSE' });

      // Step 3: Resolve at-bat (600ms after pause)
      timerRef.current = setTimeout(() => {
        const result = playAtBat(game, state.cards);

        dispatch({
          type: 'OUTCOME_RESOLVED',
          game: result.state,
          logEntry: result.logEntry,
          isHalfInningOver: result.isHalfInningOver,
          isGameOver: result.isGameOver,
        });

        // Step 4: Auto-advance after showing result (1400ms)
        timerRef.current = setTimeout(() => {
          if (result.isGameOver) {
            // Stay on game-over
          } else if (result.isHalfInningOver) {
            // Stay on half-inning screen until tap
          } else {
            dispatch({ type: 'IDLE' });
          }
        }, 1400);
      }, 600);
    }, 900);
  }, [state.game, state.phase, state.cards]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Scroll log to top on new entry
  useEffect(() => {
    if (state.lastLog && logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [state.lastLog]);

  if (!state.game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">Loading game...</p>
      </div>
    );
  }

  const game = state.game;
  const battingTeam = getBattingTeam(game);
  const batterSlot = getCurrentBatter(game);
  const pitcherId = getCurrentPitcher(game);
  const isPlayerBatting = battingTeam === 'home';
  const summary = game.isGameOver ? generateGameSummary(game) : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Scoreboard Strip */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-surface/50">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase text-muted">
            {game.inning.half === 'top' ? 'TOP' : 'BOT'} {game.inning.inning}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-[9px] text-muted uppercase block">{state.aiRoster?.name || 'Away'}</span>
            <span className="text-lg font-bold">{game.score.away}</span>
          </div>
          <span className="text-muted/40 text-xs">vs</span>
          <div className="text-center">
            <span className="text-[9px] text-muted uppercase block">{state.playerRoster?.name || 'Home'}</span>
            <span className="text-lg font-bold">{game.score.home}</span>
          </div>
        </div>
        <OutDots outs={game.inning.outs} />
      </div>

      {/* Batter vs Pitcher Cards */}
      <div className="flex gap-2 px-4 pt-4">
        <PlayerCard
          cardId={batterSlot.cardId}
          label={isPlayerBatting ? 'Your batter' : 'AI batter'}
          cards={state.cards}
        />
        <PlayerCard
          cardId={pitcherId}
          label={isPlayerBatting ? 'AI pitcher' : 'Your pitcher'}
          cards={state.cards}
        />
      </div>

      {/* Diamond */}
      <div className="py-4">
        <Diamond
          bases={{
            first: game.bases.first !== null,
            second: game.bases.second !== null,
            third: game.bases.third !== null,
          }}
        />
      </div>

      {/* Outcome Overlay */}
      <AnimatePresence>
        {state.phase === 'control-roll' && state.controlRollValue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center px-4 pb-2"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-surface border border-border">
              <span className="text-2xl font-bold font-mono">{state.controlRollValue}</span>
              <span className="text-xs text-muted">
                {state.controlResult === 'pitcher' ? 'Pitcher controls...' : 'Hitter controls...'}
              </span>
            </div>
          </motion.div>
        )}

        {(state.phase === 'resolving' || state.phase === 'half-inning' || state.phase === 'game-over') && state.lastLog && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center px-4 pb-2"
          >
            <div className={`inline-block px-4 py-2 rounded-xl border ${
              state.lastLog.outcome === 'homerun'
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : ['single', 'double', 'triple'].includes(state.lastLog.outcome)
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : state.lastLog.outcome === 'walk'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              <span className="text-xs font-bold uppercase">{state.lastLog.outcome.replace('_', ' ')}</span>
              {state.lastLog.runsScored > 0 && (
                <span className="ml-2 text-[10px]">+{state.lastLog.runsScored} run{state.lastLog.runsScored > 1 ? 's' : ''}</span>
              )}
            </div>
            <p className="text-xs text-muted mt-1">{state.lastLog.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play-by-play Log */}
      <div
        ref={logRef}
        className="flex-1 px-4 overflow-y-auto max-h-32 mb-2"
      >
        {[...game.log].reverse().map((entry, i) => (
          <div key={i} className="py-1 border-b border-border/10 last:border-0">
            <p className="text-[10px] text-muted/60">
              <span className="font-mono text-muted/40">{entry.half === 'top' ? 'T' : 'B'}{entry.inning}</span>
              {' '}{entry.description}
            </p>
          </div>
        ))}
        {game.log.length === 0 && (
          <p className="text-[10px] text-muted/30 text-center py-4">Tap Roll to play ball!</p>
        )}
      </div>

      {/* Half-Inning Banner */}
      <AnimatePresence>
        {state.phase === 'half-inning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={() => dispatch({ type: 'HALF_INNING_DONE' })}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <p className="text-muted text-xs uppercase tracking-widest mb-2">End of</p>
              <p className="text-3xl font-bold mb-4">
                {game.inning.half === 'top' ? 'Top' : 'Bottom'} {game.inning.inning}
              </p>
              <div className="flex items-center gap-6 justify-center mb-6">
                <div>
                  <span className="text-xs text-muted block">{state.aiRoster?.name}</span>
                  <span className="text-2xl font-bold">{game.score.away}</span>
                </div>
                <span className="text-muted/40">—</span>
                <div>
                  <span className="text-xs text-muted block">{state.playerRoster?.name}</span>
                  <span className="text-2xl font-bold">{game.score.home}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted/40 animate-pulse">Tap to continue</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over */}
      <AnimatePresence>
        {state.phase === 'game-over' && summary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm text-center"
            >
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Game Over</p>
              <p className="text-4xl font-bold mb-1">
                {game.score.away} — {game.score.home}
              </p>
              <p className={`text-sm font-bold mb-6 ${
                summary.winner === 'home' ? 'text-green-400' : 'text-red-400'
              }`}>
                {summary.winner === 'home' ? 'You Win!' : 'You Lose'}
              </p>

              {summary.mvp.character && (
                <div className="p-3 rounded-xl bg-surface border border-border mb-4">
                  <p className="text-[10px] text-yellow-400/60 uppercase">MVP</p>
                  <p className="text-sm font-bold">{summary.mvp.character}</p>
                  <p className="text-[10px] text-muted">{summary.mvp.hits} hits, {summary.mvp.rbis} RBIs</p>
                </div>
              )}

              <div className="space-y-2">
                <Link
                  href="/games/baseball/play"
                  className="block w-full py-3 rounded-xl bg-accent text-bg text-sm font-bold hover:bg-accent/90 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Play Again
                </Link>
                <Link
                  href="/games/baseball"
                  className="block text-xs text-muted hover:text-white transition-colors py-2"
                >
                  Back to Baseball Hub
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll Button */}
      <div className="sticky bottom-0 p-4 bg-bg/90 backdrop-blur-sm border-t border-border/30">
        {state.phase === 'game-over' ? null : (
          <button
            onClick={handleRoll}
            disabled={state.phase !== 'idle'}
            className={`w-full py-4 rounded-xl text-base font-bold transition-all ${
              state.phase === 'idle'
                ? 'bg-accent text-bg hover:bg-accent/90 active:scale-[0.98] cursor-pointer'
                : 'bg-surface text-muted/30 border border-border cursor-not-allowed'
            }`}
          >
            {state.phase === 'idle'
              ? 'Roll'
              : state.phase === 'control-roll'
              ? 'Rolling...'
              : state.phase === 'pause'
              ? 'Determining outcome...'
              : 'Resolving...'}
          </button>
        )}
      </div>
    </div>
  );
}
