'use client';

import { useState, useEffect, useReducer, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  resolveSteal,
  applySteal,
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
import { generateAILineup, getAIStealDecision, getAITaunt, Difficulty, AI_TEAM_TEMPLATES, getTemplatesForDifficulty } from '@/lib/baseball/ai';
import { CardRegistry } from '@/lib/baseball/game';
import { DiceRoller } from '@/components/baseball/DiceRoller';
import { OutcomeReveal } from '@/components/baseball/OutcomeReveal';
import { ParticleBurst } from '@/components/baseball/ParticleBurst';
import { ScreenShake } from '@/components/baseball/ScreenShake';
import { StealReveal } from '@/components/baseball/StealReveal';
import { saveGameRecord, awardGameXP, XPBreakdown, getCharacterXP } from '@/lib/baseball/records';
import { getEvolutionTier, getEvolutionInfo, EVOLUTION_TIERS } from '@/lib/baseball/evolution';
import { checkAchievements } from '@/lib/achievements';
import { earnAchievement, addCollectorXP, progressDailyMission } from '@/lib/store';
import BaseballShareCard from '@/components/baseball/BaseballShareCard';
import { getStadiumTheme, type StadiumTheme, type CrowdReactionType } from '@/lib/baseball/stadium-themes';
import { CrowdReaction } from '@/components/baseball/CrowdReaction';

// ===== Animation Phase State Machine =====

type AnimPhase =
  | 'pregame'           // difficulty selection before game starts
  | 'idle'
  | 'control-rolling'
  | 'control-landed'
  | 'outcome-rolling'
  | 'outcome-landed'
  | 'steal-rolling'      // dice spinning for steal attempt
  | 'steal-result'       // showing steal safe/out result
  | 'half-inning'
  | 'game-over';

interface StealData {
  runnerName: string;
  fromBase: 'first' | 'second';
  rollValue: number;
  threshold: number;
  runnerSpeed: number;
  catcherDefense: number;
  success: boolean;
}

interface BoardState {
  game: GameState | null;
  animPhase: AnimPhase;
  controlRollValue: number | null;
  controlResult: 'pitcher' | 'hitter' | null;
  outcomeRollValue: number | null;
  currentOutcome: AtBatOutcome | null;
  currentBatterName: string;
  currentPitcherName: string;
  currentRunsScored: number;
  currentDescription: string;
  // Steal data
  stealData: StealData | null;
  // Registry + rosters
  cards: CardRegistry;
  playerRoster: Roster | null;
  aiRoster: Roster | null;
  shakeTrigger: number;
  particleBurst: boolean;
  // XP breakdown (set on game over)
  xpBreakdown: XPBreakdown[];
  // Difficulty + cards registry for pregame
  difficulty: Difficulty | null;
  gameLength: 3 | 9;
  preCards: CardRegistry; // cards loaded at pregame, before game init
  prePlayerRoster: Roster | null;
  // Stadium theme
  stadiumTheme: StadiumTheme | null;
  // Crowd reaction
  crowdReaction: CrowdReactionType | null;
  // Evolution tiers per card (only player hitters)
  cardEvolutions: Map<string, number>;
}

type BoardAction =
  | { type: 'PREGAME_READY'; cards: CardRegistry; playerRoster: Roster }
  | { type: 'SELECT_DIFFICULTY'; difficulty: Difficulty; gameLength: 3 | 9; game: GameState; playerRoster: Roster; aiRoster: Roster; cards: CardRegistry }
  | { type: 'INIT_GAME'; game: GameState; playerRoster: Roster; aiRoster: Roster; cards: CardRegistry }
  | { type: 'START_CONTROL_ROLL'; value: number; result: 'pitcher' | 'hitter'; batterName: string; pitcherName: string }
  | { type: 'CONTROL_LANDED' }
  | { type: 'START_OUTCOME_ROLL'; value: number }
  | { type: 'OUTCOME_LANDED'; game: GameState; outcome: AtBatOutcome; runsScored: number; description: string; isHalfInningOver: boolean; isGameOver: boolean }
  | { type: 'START_STEAL_ROLL'; stealData: StealData }
  | { type: 'STEAL_DICE_LANDED' }
  | { type: 'STEAL_RESOLVED'; game: GameState; isHalfInningOver: boolean; isGameOver: boolean }
  | { type: 'SET_XP'; xpBreakdown: XPBreakdown[] }
  | { type: 'RETURN_IDLE' }
  | { type: 'HALF_INNING_DONE' }
  | { type: 'SET_CROWD'; crowdReaction: CrowdReactionType | null };

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'PREGAME_READY':
      return {
        ...state,
        animPhase: 'pregame',
        preCards: action.cards,
        prePlayerRoster: action.playerRoster,
      };

    case 'SELECT_DIFFICULTY':
      return {
        ...state,
        game: action.game,
        animPhase: 'idle',
        difficulty: action.difficulty,
        gameLength: action.gameLength,
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
        stealData: null,
        shakeTrigger: 0,
        particleBurst: false,
        xpBreakdown: [],
        stadiumTheme: getStadiumTheme(action.aiRoster.name),
        crowdReaction: null,
        cardEvolutions: buildEvolutionMap(action.playerRoster),
      };

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
        stealData: null,
        shakeTrigger: 0,
        particleBurst: false,
        xpBreakdown: [],
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
        stealData: null,
        particleBurst: false,
      };

    case 'CONTROL_LANDED':
      return { ...state, animPhase: 'control-landed' };

    case 'START_OUTCOME_ROLL':
      return { ...state, animPhase: 'outcome-rolling', outcomeRollValue: action.value };

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

    case 'START_STEAL_ROLL':
      return {
        ...state,
        animPhase: 'steal-rolling',
        stealData: action.stealData,
        particleBurst: false,
      };

    case 'STEAL_DICE_LANDED':
      return { ...state, animPhase: 'steal-result' };

    case 'STEAL_RESOLVED':
      return {
        ...state,
        game: action.game,
        animPhase: action.isGameOver ? 'game-over' : action.isHalfInningOver ? 'half-inning' : 'steal-result',
        shakeTrigger: state.stealData && !state.stealData.success ? state.shakeTrigger + 1 : state.shakeTrigger,
      };

    case 'SET_XP':
      return { ...state, xpBreakdown: action.xpBreakdown };

    case 'RETURN_IDLE':
      return {
        ...state,
        animPhase: 'idle',
        controlRollValue: null,
        controlResult: null,
        outcomeRollValue: null,
        currentOutcome: null,
        stealData: null,
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
        stealData: null,
        particleBurst: false,
      };

    case 'SET_CROWD':
      return { ...state, crowdReaction: action.crowdReaction };

    default:
      return state;
  }
}

// ===== Outcome Icons for Play Log =====

const OUTCOME_ICON: Record<string, { symbol: string; color: string }> = {
  homerun:      { symbol: '\u25C8', color: 'text-amber-400' },     // ◈
  triple:       { symbol: '\u25C7', color: 'text-green-400' },     // ◇
  double:       { symbol: '\u25C6', color: 'text-blue-400' },      // ◆
  single:       { symbol: '\u00B7', color: 'text-white/60' },      // ·
  walk:         { symbol: 'BB', color: 'text-teal-400' },
  strikeout:    { symbol: 'K', color: 'text-red-400' },
  flyout:       { symbol: 'F', color: 'text-muted/40' },
  groundout:    { symbol: 'G', color: 'text-muted/40' },
  groundout_dp: { symbol: 'DP', color: 'text-red-400' },
};

const initialState: BoardState = {
  game: null,
  animPhase: 'pregame',
  controlRollValue: null,
  controlResult: null,
  outcomeRollValue: null,
  currentOutcome: null,
  currentBatterName: '',
  currentPitcherName: '',
  currentRunsScored: 0,
  currentDescription: '',
  stealData: null,
  cards: new Map(),
  playerRoster: null,
  aiRoster: null,
  shakeTrigger: 0,
  particleBurst: false,
  xpBreakdown: [],
  difficulty: null,
  gameLength: 3,
  preCards: new Map(),
  prePlayerRoster: null,
  stadiumTheme: null,
  crowdReaction: null,
  cardEvolutions: new Map(),
};

// ===== Build evolution map from XP data =====

function buildEvolutionMap(roster: Roster): Map<string, number> {
  const xpData = getCharacterXP();
  const evoMap = new Map<string, number>();
  for (const slot of roster.hitters) {
    const charXP = xpData.get(slot.cardId);
    if (charXP && charXP.totalXP > 0) {
      const tier = getEvolutionTier(charXP.totalXP);
      if (tier > 0) evoMap.set(slot.cardId, tier);
    }
  }
  return evoMap;
}

// ===== Diamond SVG with animated runners =====

function Diamond({
  bases,
  stealAnim,
  recentScore,
  theme,
}: {
  bases: { first: boolean; second: boolean; third: boolean };
  stealAnim?: { from: 'first' | 'second'; success: boolean } | null;
  recentScore?: boolean;
  theme?: StadiumTheme | null;
}) {
  const coords = {
    home: { x: 100, y: 170 },
    first: { x: 160, y: 110 },
    second: { x: 100, y: 50 },
    third: { x: 40, y: 110 },
  };

  const hasRunners = bases.first || bases.second || bases.third;
  const baseColor = theme?.baseGlow || '#f59e0b';
  const runnerColor = theme?.runnerGlow || '#f59e0b';
  const pathGlowColor = theme?.basePath || 'rgba(251,191,36,0.12)';

  return (
    <svg viewBox="0 0 200 200" className="w-44 h-44 mx-auto">
      <defs>
        {/* Glow filter for active bases */}
        <filter id="base-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Soft ambient glow for runners */}
        <filter id="runner-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Field grass gradient */}
        <radialGradient id="field-grass" cx="50%" cy="55%" r="45%">
          <stop offset="0%" stopColor="#1a3a1a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0d2210" stopOpacity="0.02" />
        </radialGradient>
        {/* Dirt infield gradient */}
        <radialGradient id="mound-dirt" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor="#6b4226" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3d2410" stopOpacity="0.03" />
        </radialGradient>
        {/* Score celebration glow */}
        <radialGradient id="score-glow" cx="50%" cy="85%" r="40%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outfield arc — subtle atmosphere */}
      <ellipse cx="100" cy="110" rx="90" ry="70" fill="url(#field-grass)" />

      {/* Dirt infield */}
      <polygon points="100,170 160,110 100,50 40,110" fill="url(#mound-dirt)" />

      {/* Pitcher's mound */}
      <ellipse cx="100" cy="115" rx="8" ry="5" fill="rgba(107,66,38,0.15)" />
      <ellipse cx="100" cy="114" rx="4" ry="2" fill="rgba(255,255,255,0.06)" />

      {/* Base paths — glow when runners are on (theme-driven) */}
      <line x1="100" y1="170" x2="160" y2="110" stroke={bases.first || hasRunners ? pathGlowColor : 'rgba(255,255,255,0.06)'} strokeWidth="2" />
      <line x1="160" y1="110" x2="100" y2="50" stroke={bases.second ? pathGlowColor : 'rgba(255,255,255,0.06)'} strokeWidth="2" />
      <line x1="100" y1="50" x2="40" y2="110" stroke={bases.third ? pathGlowColor : 'rgba(255,255,255,0.06)'} strokeWidth="2" />
      <line x1="40" y1="110" x2="100" y2="170" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />

      {/* Home plate — pentagon shape */}
      <polygon points="100,172 94,164 94,158 106,158 106,164" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

      {/* Score celebration pulse at home plate */}
      {recentScore && (
        <circle cx="100" cy="168" r="20" fill="url(#score-glow)">
          <animate attributeName="r" values="10;25;10" dur="1s" repeatCount="3" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="3" />
        </circle>
      )}

      {/* Base diamonds — enhanced with glow when occupied (theme-driven) */}
      {[
        { x: 160, y: 110, occupied: bases.first, label: '1B' },
        { x: 100, y: 50, occupied: bases.second, label: '2B' },
        { x: 40, y: 110, occupied: bases.third, label: '3B' },
      ].map(base => (
        <g key={base.label}>
          <rect
            x={base.x - 7} y={base.y - 7} width="14" height="14" rx="2"
            fill={base.occupied ? baseColor : 'rgba(255,255,255,0.03)'}
            stroke={base.occupied ? `${baseColor}80` : 'rgba(255,255,255,0.12)'}
            strokeWidth={base.occupied ? 2 : 1}
            transform={`rotate(45, ${base.x}, ${base.y})`}
            filter={base.occupied ? 'url(#base-glow)' : undefined}
          />
        </g>
      ))}

      {/* Runner dots with animated glow (theme-driven) */}
      {bases.first && !stealAnim && (
        <g filter="url(#runner-glow)">
          <circle cx="160" cy="110" r="5" fill={runnerColor} />
          <circle cx="160" cy="110" r="9" fill={runnerColor} opacity="0.15">
            <animate attributeName="r" values="9;13;9" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {bases.second && (
        <g filter="url(#runner-glow)">
          <circle cx="100" cy="50" r="5" fill={runnerColor} />
          <circle cx="100" cy="50" r="9" fill={runnerColor} opacity="0.15">
            <animate attributeName="r" values="9;13;9" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {bases.third && (
        <g filter="url(#runner-glow)">
          <circle cx="40" cy="110" r="5" fill={runnerColor} />
          <circle cx="40" cy="110" r="9" fill={runnerColor} opacity="0.15">
            <animate attributeName="r" values="9;13;9" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Steal animations */}
      {stealAnim && stealAnim.from === 'first' && (
        <circle r="5" fill={stealAnim.success ? '#a855f7' : '#ef4444'} filter="url(#runner-glow)">
          <animate attributeName="cx" from={String(coords.first.x)} to={stealAnim.success ? String(coords.second.x) : String((coords.first.x + coords.second.x) / 2)} dur={stealAnim.success ? '0.5s' : '0.3s'} fill="freeze" />
          <animate attributeName="cy" from={String(coords.first.y)} to={stealAnim.success ? String(coords.second.y) : String((coords.first.y + coords.second.y) / 2)} dur={stealAnim.success ? '0.5s' : '0.3s'} fill="freeze" />
          {!stealAnim.success && <animate attributeName="opacity" values="1;1;0" dur="0.8s" begin="0.3s" fill="freeze" />}
        </circle>
      )}
      {stealAnim && stealAnim.from === 'second' && (
        <circle r="5" fill={stealAnim.success ? '#a855f7' : '#ef4444'} filter="url(#runner-glow)">
          <animate attributeName="cx" from={String(coords.second.x)} to={stealAnim.success ? String(coords.third.x) : String((coords.second.x + coords.third.x) / 2)} dur={stealAnim.success ? '0.5s' : '0.3s'} fill="freeze" />
          <animate attributeName="cy" from={String(coords.second.y)} to={stealAnim.success ? String(coords.third.y) : String((coords.second.y + coords.third.y) / 2)} dur={stealAnim.success ? '0.5s' : '0.3s'} fill="freeze" />
          {!stealAnim.success && <animate attributeName="opacity" values="1;1;0" dur="0.8s" begin="0.3s" fill="freeze" />}
        </circle>
      )}
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

// ===== ESPN-style Line Score =====

function LineScore({
  game,
  awayName,
  homeName,
}: {
  game: GameState;
  awayName: string;
  homeName: string;
}) {
  // Build inning-by-inning score from game log
  const inningScores: { away: number; home: number }[] = [];
  for (let i = 1; i <= game.innings; i++) {
    const awayRuns = game.log
      .filter(e => e.inning === i && e.half === 'top')
      .reduce((sum, e) => sum + e.runsScored, 0);
    const homeRuns = game.log
      .filter(e => e.inning === i && e.half === 'bottom')
      .reduce((sum, e) => sum + e.runsScored, 0);
    inningScores.push({ away: awayRuns, home: homeRuns });
  }

  const totalHits = {
    away: game.log.filter(e => e.half === 'top' && ['single', 'double', 'triple', 'homerun'].includes(e.outcome)).length,
    home: game.log.filter(e => e.half === 'bottom' && ['single', 'double', 'triple', 'homerun'].includes(e.outcome)).length,
  };

  const currentInning = game.inning.inning;

  return (
    <div className="mx-auto max-w-[300px] mt-1 px-4">
      <div className="rounded-lg bg-surface/30 border border-border/15 overflow-hidden">
        <table className="w-full text-center" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="border-b border-border/10">
              <th className="text-left px-2 py-1 w-16 text-[8px] text-muted/30 font-normal" />
              {inningScores.map((_, i) => (
                <th
                  key={i}
                  className={`px-1.5 py-1 text-[8px] font-bold tabular-nums ${
                    i + 1 === currentInning ? 'text-amber-400/70' : 'text-muted/25'
                  }`}
                >
                  {i + 1}
                </th>
              ))}
              <th className="px-1.5 py-1 text-[8px] font-bold text-muted/40 border-l border-border/10">R</th>
              <th className="px-1.5 py-1 text-[8px] font-bold text-muted/40">H</th>
            </tr>
          </thead>
          <tbody>
            {/* Away team */}
            <tr className="border-b border-border/10">
              <td className="text-left px-2 py-1 text-[9px] text-muted/50 font-bold truncate max-w-[64px]">
                {awayName.split(' ').pop()}
              </td>
              {inningScores.map((score, i) => {
                const isCurrentAway = i + 1 === currentInning && game.inning.half === 'top';
                const isPast = i + 1 < currentInning || (i + 1 === currentInning && game.inning.half === 'bottom');
                return (
                  <td key={i} className={`px-1.5 py-1 text-[10px] tabular-nums ${
                    isCurrentAway ? 'text-amber-400 font-bold' : isPast ? 'text-muted/50' : 'text-muted/15'
                  }`}>
                    {isPast || isCurrentAway ? score.away : '-'}
                  </td>
                );
              })}
              <td className="px-1.5 py-1 text-[10px] font-bold tabular-nums text-white/70 border-l border-border/10">{game.score.away}</td>
              <td className="px-1.5 py-1 text-[10px] tabular-nums text-muted/40">{totalHits.away}</td>
            </tr>
            {/* Home team */}
            <tr>
              <td className="text-left px-2 py-1 text-[9px] text-muted/50 font-bold truncate max-w-[64px]">
                {homeName.split(' ').pop()}
              </td>
              {inningScores.map((score, i) => {
                const isCurrentHome = i + 1 === currentInning && game.inning.half === 'bottom';
                const isPast = i + 1 < currentInning;
                return (
                  <td key={i} className={`px-1.5 py-1 text-[10px] tabular-nums ${
                    isCurrentHome ? 'text-amber-400 font-bold' : isPast ? 'text-muted/50' : 'text-muted/15'
                  }`}>
                    {isPast || isCurrentHome ? score.home : '-'}
                  </td>
                );
              })}
              <td className="px-1.5 py-1 text-[10px] font-bold tabular-nums text-white/70 border-l border-border/10">{game.score.home}</td>
              <td className="px-1.5 py-1 text-[10px] tabular-nums text-muted/40">{totalHits.home}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== Card Display =====

function PlayerCard({
  cardId,
  label,
  cards,
  highlighted,
  evolutionTier,
}: {
  cardId: string | null;
  label: string;
  cards: CardRegistry;
  highlighted?: boolean;
  evolutionTier?: number;
}) {
  const card = cardId ? cards.get(cardId) : null;
  if (!card) return (
    <div className="flex-1 p-3 rounded-xl bg-surface/30 border border-border/20">
      <span className="text-[10px] text-muted/30">{label}</span>
    </div>
  );

  const stats = card.stats;
  const isPitcher = stats.type === 'pitcher';
  const evoTier = evolutionTier && evolutionTier > 0 ? EVOLUTION_TIERS[evolutionTier] : null;

  return (
    <motion.div
      className={`flex-1 p-3 rounded-xl border transition-colors duration-300 ${
        highlighted
          ? 'bg-surface border-amber-500/30 shadow-[0_0_12px_rgba(251,191,36,0.1)]'
          : 'bg-surface border-border/40'
      }`}
      style={evoTier && !highlighted ? {
        borderColor: `${evoTier.borderColor}40`,
        boxShadow: `0 0 8px ${evoTier.glowColor}`,
      } : undefined}
      animate={highlighted ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted/50 uppercase tracking-wider">{label}</span>
        {evoTier && (
          <span
            className="text-[7px] font-black tracking-wider px-1.5 py-0.5 rounded-full"
            style={{ color: evoTier.borderColor, backgroundColor: `${evoTier.borderColor}15`, border: `1px solid ${evoTier.borderColor}30` }}
          >
            {evoTier.label}
          </span>
        )}
      </div>
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

function PlayPageInner() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [selectedInnings, setSelectedInnings] = useState<3 | 9>(3);
  const [showShare, setShowShare] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize pregame on mount — load cards + player roster, defer AI until difficulty chosen
  // If ?drafted=true, load draft rosters and skip pregame
  useEffect(() => {
    const cards = buildCardRegistry();
    const isDrafted = searchParams.get('drafted') === 'true';

    if (isDrafted) {
      // Load drafted rosters from localStorage
      try {
        const playerRoster: Roster = JSON.parse(localStorage.getItem('pdb-draft-player') || 'null');
        const aiRoster: Roster = JSON.parse(localStorage.getItem('pdb-draft-ai') || 'null');
        const draftDifficulty = (localStorage.getItem('pdb-draft-difficulty') || 'veteran') as Difficulty;
        if (playerRoster && aiRoster) {
          const game = createGame(aiRoster, playerRoster, 3);
          dispatch({ type: 'SELECT_DIFFICULTY', difficulty: draftDifficulty, gameLength: 3, game, playerRoster, aiRoster, cards });
          return;
        }
      } catch { /* fall through to normal flow */ }
    }

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

    dispatch({ type: 'PREGAME_READY', cards, playerRoster });
  }, [searchParams]);

  // Handle difficulty selection — generates AI lineup and starts game
  const handleSelectDifficulty = useCallback((difficulty: Difficulty, innings: 3 | 9 = 3) => {
    if (!state.prePlayerRoster || state.preCards.size === 0) return;
    const playerRoster = state.prePlayerRoster;
    const cards = state.preCards;

    const playerIds = new Set([
      ...playerRoster.hitters.map(h => h.cardId),
      playerRoster.pitcher,
    ]);
    const aiRoster = generateAILineup(difficulty, playerIds, Date.now());
    const game = createGame(aiRoster, playerRoster, innings);
    dispatch({ type: 'SELECT_DIFFICULTY', difficulty, gameLength: innings, game, playerRoster, aiRoster, cards });
  }, [state.prePlayerRoster, state.preCards]);

  // Cleanup timers
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Scroll log on new entries
  useEffect(() => {
    if (state.currentOutcome && logRef.current) logRef.current.scrollTop = 0;
  }, [state.currentOutcome]);

  // Save game record + award XP on game over
  const gameRecordSaved = useRef(false);
  useEffect(() => {
    if (state.animPhase === 'game-over' && state.game && !gameRecordSaved.current) {
      gameRecordSaved.current = true;
      const gameSummary = generateGameSummary(state.game);
      saveGameRecord(
        state.game,
        gameSummary,
        state.playerRoster?.name || 'Your Team',
        state.aiRoster?.name || 'AI Team',
        state.difficulty || undefined,
      );
      const xp = awardGameXP(state.game, gameSummary);
      dispatch({ type: 'SET_XP', xpBreakdown: xp });

      // Award global LoreVault XP
      const isWin = gameSummary.winner === 'home';
      addCollectorXP(0, isWin ? 'baseball_win' : 'baseball_loss');

      // Progress daily mission
      if (isWin) {
        progressDailyMission('win-baseball');
      }

      // Check achievements after saving record
      checkAchievements();
      // legend-slayer: check directly since it needs current game context
      if (state.difficulty === 'legend' && isWin) {
        earnAchievement('legend-slayer');
      }
    }
  }, [state.animPhase, state.game, state.playerRoster, state.aiRoster, state.difficulty]);

  // ===== AI Steal Decision =====
  // When AI is batting and state is idle, check if AI wants to steal
  const aiStealChecked = useRef<string>(''); // track last game state to avoid double-trigger
  useEffect(() => {
    if (state.animPhase !== 'idle' || !state.game || !state.difficulty) return;
    const game = state.game;
    const isAIBatting = getBattingTeam(game) === 'away';
    if (!isAIBatting) return;

    // Dedup: only check once per unique game log length
    const stateKey = `${game.log.length}-${game.inning.inning}-${game.inning.half}`;
    if (aiStealChecked.current === stateKey) return;
    aiStealChecked.current = stateKey;

    // AI steal decision
    const scoreDiff = game.score.away - game.score.home; // positive = AI leading
    const rand = () => Math.random();
    const decision = getAIStealDecision(
      game.bases,
      game.inning.outs,
      game.inning.inning,
      game.innings,
      scoreDiff,
      state.difficulty,
      rand,
    );

    if (decision) {
      // Trigger steal after a short delay (AI "thinking")
      timerRef.current = setTimeout(() => {
        const runner = decision.fromBase === 'first' ? game.bases.first : game.bases.second;
        if (!runner) return;
        const runnerCard = state.cards.get(runner.cardId);
        if (!runnerCard || runnerCard.stats.type !== 'hitter') return;

        const fieldingRoster = game.homeRoster; // player fields when AI bats
        const catcherSlot = fieldingRoster.hitters.find(h => h.position === 'C');
        const catcherCard = catcherSlot ? state.cards.get(catcherSlot.cardId) : null;
        const catcherDefense = catcherCard && catcherCard.stats.type === 'hitter'
          ? (catcherCard.stats as HitterStats).defense : 3;

        const runnerSpeed = (runnerCard.stats as HitterStats).speed;
        const threshold = runnerSpeed - catcherDefense;
        const roll = rollD20();
        const stealResult = resolveSteal(roll, runnerSpeed, catcherDefense, runnerCard.character, decision.fromBase);

        dispatch({
          type: 'START_STEAL_ROLL',
          stealData: {
            runnerName: runnerCard.character,
            fromBase: decision.fromBase,
            rollValue: roll,
            threshold,
            runnerSpeed,
            catcherDefense,
            success: stealResult.success,
          },
        });
      }, 600);
    }
  }, [state.animPhase, state.game, state.difficulty, state.cards]);

  // ===== Evolution map ref (stable for stale closures) =====
  const cardEvolutionsRef = useRef<Map<string, number>>(state.cardEvolutions);
  cardEvolutionsRef.current = state.cardEvolutions;

  // ===== Pending resolution ref =====
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

  // ===== Resolve at-bat (after control dice land) =====
  const resolveFullAtBat = useCallback((
    game: GameState,
    cards: CardRegistry,
    controlRoll: number,
  ) => {
    const batterSlot = getCurrentBatter(game);
    const pitcherId = getCurrentPitcher(game);
    const batterCard = cards.get(batterSlot.cardId);
    const pitcherCard = cards.get(pitcherId);
    if (!batterCard || !pitcherCard) return;
    if (batterCard.stats.type !== 'hitter' || pitcherCard.stats.type !== 'pitcher') return;

    const outcomeRoll = rollD20();
    dispatch({ type: 'START_OUTCOME_ROLL', value: outcomeRoll });

    pendingResolution.current = {
      game, cards, controlRoll, outcomeRoll,
      hitterStats: batterCard.stats as HitterStats,
      pitcherStats: pitcherCard.stats as PitcherStats,
      batterCard, pitcherCard, batterSlot,
    };
  }, []);

  // ===== Handle control dice landing =====
  const onControlDiceLand = useCallback(() => {
    dispatch({ type: 'CONTROL_LANDED' });
    timerRef.current = setTimeout(() => {
      if (state.game && state.controlRollValue !== null) {
        resolveFullAtBat(state.game, state.cards, state.controlRollValue);
      }
    }, 800);
  }, [state.game, state.controlRollValue, state.cards, resolveFullAtBat]);

  // ===== Handle outcome dice landing =====
  const onOutcomeDiceLand = useCallback(() => {
    const data = pendingResolution.current;
    if (!data) return;
    const { game, cards, controlRoll, outcomeRoll, hitterStats, pitcherStats, batterCard, pitcherCard, batterSlot } = data;

    const hitterEvoTier = cardEvolutionsRef.current.get(batterSlot.cardId) ?? 0;
    const { outcome, controlResult, description } = resolveAtBat(
      controlRoll, outcomeRoll, hitterStats, pitcherStats,
      batterCard.character, pitcherCard.character,
      hitterEvoTier,
    );

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

    let desc = runsScored > 0
      ? `${description} ${runsScored} run${runsScored > 1 ? 's' : ''} score!`
      : description;

    // AI taunt injection
    if (state.difficulty) {
      const isAIBatting = battingTeam === 'away';
      let tauntCtx: 'hr' | 'strikeout' | null = null;
      if (isAIBatting && outcome === 'homerun') tauntCtx = 'hr';
      if (!isAIBatting && outcome === 'strikeout') tauntCtx = 'strikeout';
      if (tauntCtx) {
        const taunt = getAITaunt(state.difficulty, tauntCtx, () => Math.random());
        if (taunt) desc = `${desc} "${taunt}"`;
      }
    }

    const logEntry: PlayLogEntry = {
      inning: game.inning.inning, half: game.inning.half,
      batter: batterCard.character, pitcher: pitcherCard.character,
      controlRoll, controlResult, outcomeRoll, outcome, runsScored,
      description: desc,
    };

    let newState: GameState = {
      ...game,
      inning: { ...game.inning, outs: newOuts },
      bases: newBases, score: newScore, log: [...game.log, logEntry],
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
      type: 'OUTCOME_LANDED', game: newState, outcome, runsScored,
      description: logEntry.description, isHalfInningOver, isGameOver: newState.isGameOver,
    });
    pendingResolution.current = null;

    // Trigger crowd reaction based on outcome
    const isPlayerBat = battingTeam === 'home';
    let crowd: CrowdReactionType | null = null;
    if (outcome === 'homerun') crowd = 'homerun';
    else if (outcome === 'strikeout') crowd = isPlayerBat ? 'strikeout_bad' : 'strikeout_good';
    else if (outcome === 'groundout_dp') crowd = 'double_play';
    else if (outcome === 'triple') crowd = 'triple';
    else if ((outcome === 'double' || outcome === 'single') && runsScored >= 2) crowd = 'big_hit';
    // Walk-off detection
    if (newState.isGameOver && isPlayerBat && runsScored > 0) crowd = 'walk_off';
    if (crowd) dispatch({ type: 'SET_CROWD', crowdReaction: crowd });

    if (!newState.isGameOver && !isHalfInningOver) {
      timerRef.current = setTimeout(() => dispatch({ type: 'RETURN_IDLE' }), 2000);
    }
  }, []);

  // ===== Handle Roll button =====
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
      type: 'START_CONTROL_ROLL', value: controlRollValue, result: controlResult,
      batterName: batterCard.character, pitcherName: pitcherCard.character,
    });
  }, [state.game, state.animPhase, state.cards]);

  // ===== Handle Steal button =====
  const handleSteal = useCallback((fromBase: 'first' | 'second') => {
    if (!state.game || state.animPhase !== 'idle') return;
    const game = state.game;

    const runner = fromBase === 'first' ? game.bases.first : game.bases.second;
    if (!runner) return;

    const runnerCard = state.cards.get(runner.cardId);
    if (!runnerCard || runnerCard.stats.type !== 'hitter') return;

    // Get catcher defense
    const battingTeam = getBattingTeam(game);
    const fieldingRoster = battingTeam === 'away' ? game.homeRoster : game.awayRoster;
    const catcherSlot = fieldingRoster.hitters.find(h => h.position === 'C');
    const catcherCard = catcherSlot ? state.cards.get(catcherSlot.cardId) : null;
    const catcherDefense = catcherCard && catcherCard.stats.type === 'hitter'
      ? (catcherCard.stats as HitterStats).defense : 3;

    const runnerSpeed = (runnerCard.stats as HitterStats).speed;
    const threshold = runnerSpeed - catcherDefense;
    const roll = rollD20();
    const success = roll <= threshold;

    const stealResult = resolveSteal(roll, runnerSpeed, catcherDefense, runnerCard.character, fromBase);

    dispatch({
      type: 'START_STEAL_ROLL',
      stealData: {
        runnerName: runnerCard.character,
        fromBase,
        rollValue: roll,
        threshold,
        runnerSpeed,
        catcherDefense,
        success: stealResult.success,
      },
    });
  }, [state.game, state.animPhase, state.cards]);

  // ===== Handle steal dice landing =====
  const onStealDiceLand = useCallback(() => {
    dispatch({ type: 'STEAL_DICE_LANDED' });

    // Apply steal result after a brief reveal
    timerRef.current = setTimeout(() => {
      if (!state.game || !state.stealData) return;
      const { fromBase, success } = state.stealData;

      let newState = {
        ...state.game,
        bases: applySteal(state.game.bases, fromBase, success),
      };

      let isHalfInningOver = false;
      if (!success) {
        const newOuts = state.game.inning.outs + 1;
        newState = { ...newState, inning: { ...newState.inning, outs: newOuts } };
        if (newOuts >= 3) {
          isHalfInningOver = true;
          newState = advanceInning(newState);
        }
      }

      if (!newState.isGameOver) {
        newState = { ...newState, isGameOver: checkGameOver(newState) };
      }

      // Add to log
      const desc = success
        ? `${state.stealData.runnerName} steals ${fromBase === 'first' ? 'second' : 'third'}!`
        : `${state.stealData.runnerName} caught stealing ${fromBase === 'first' ? 'second' : 'third'}!`;

      const logEntry: PlayLogEntry = {
        inning: state.game.inning.inning,
        half: state.game.inning.half,
        batter: state.stealData.runnerName,
        pitcher: '',
        controlRoll: 0,
        controlResult: 'pitcher',
        outcomeRoll: state.stealData.rollValue,
        outcome: success ? 'single' : 'strikeout', // placeholder for log
        runsScored: 0,
        description: desc,
      };

      newState = { ...newState, log: [...newState.log, logEntry] };

      dispatch({
        type: 'STEAL_RESOLVED', game: newState,
        isHalfInningOver, isGameOver: newState.isGameOver,
      });

      // Trigger crowd reaction for steal
      dispatch({
        type: 'SET_CROWD',
        crowdReaction: success ? 'steal_success' : 'steal_caught',
      });

      // Auto-advance back to idle
      if (!newState.isGameOver && !isHalfInningOver) {
        timerRef.current = setTimeout(() => dispatch({ type: 'RETURN_IDLE' }), 2000);
      }
    }, 1200);
  }, [state.game, state.stealData]);

  // ===== Compute steal availability =====
  const getStealOptions = useCallback((): { first: boolean; second: boolean } => {
    if (!state.game || state.animPhase !== 'idle') return { first: false, second: false };
    const game = state.game;
    const isPlayerBatting = getBattingTeam(game) === 'home';
    if (!isPlayerBatting) return { first: false, second: false };
    return {
      first: game.bases.first !== null && game.bases.second === null,  // can't steal into occupied base
      second: game.bases.second !== null && game.bases.third === null,
    };
  }, [state.game, state.animPhase]);

  const getStealThreshold = useCallback((fromBase: 'first' | 'second'): { threshold: number; runnerName: string; speed: number; defense: number } | null => {
    if (!state.game) return null;
    const game = state.game;
    const runner = fromBase === 'first' ? game.bases.first : game.bases.second;
    if (!runner) return null;
    const runnerCard = state.cards.get(runner.cardId);
    if (!runnerCard || runnerCard.stats.type !== 'hitter') return null;

    const battingTeam = getBattingTeam(game);
    const fieldingRoster = battingTeam === 'away' ? game.homeRoster : game.awayRoster;
    const catcherSlot = fieldingRoster.hitters.find(h => h.position === 'C');
    const catcherCard = catcherSlot ? state.cards.get(catcherSlot.cardId) : null;
    const catcherDefense = catcherCard && catcherCard.stats.type === 'hitter'
      ? (catcherCard.stats as HitterStats).defense : 3;

    const speed = (runnerCard.stats as HitterStats).speed;
    return { threshold: speed - catcherDefense, runnerName: runnerCard.character, speed, defense: catcherDefense };
  }, [state.game, state.cards]);

  // ===== Render =====

  // Pregame difficulty selection
  if (state.animPhase === 'pregame') {
    const difficultyOptions: { key: Difficulty; label: string; tagline: string; color: string; borderColor: string; bgGrad: string }[] = [
      {
        key: 'rookie',
        label: 'Rookie',
        tagline: 'Suboptimal lineups. No steals. A warm-up.',
        color: 'text-green-400',
        borderColor: 'border-green-500/30 hover:border-green-500/60',
        bgGrad: 'linear-gradient(135deg, #0a1f0a 0%, #12141f 100%)',
      },
      {
        key: 'veteran',
        label: 'Veteran',
        tagline: 'Balanced teams. Smart steals. Solid competition.',
        color: 'text-amber-400',
        borderColor: 'border-amber-500/30 hover:border-amber-500/60',
        bgGrad: 'linear-gradient(135deg, #1f1a0a 0%, #12141f 100%)',
      },
      {
        key: 'legend',
        label: 'Legend',
        tagline: 'Optimized rosters. Aggressive steals. No mercy.',
        color: 'text-red-400',
        borderColor: 'border-red-500/30 hover:border-red-500/60',
        bgGrad: 'linear-gradient(135deg, #1f0a0a 0%, #12141f 100%)',
      },
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-black mb-2">Choose Your Opponent</h1>
          <p className="text-xs text-muted/50">Select difficulty to begin</p>
        </motion.div>

        {/* Game Length Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="w-full max-w-sm mb-4"
        >
          <div className="flex items-center rounded-xl bg-surface/50 border border-border/30 p-1">
            <button
              onClick={() => setSelectedInnings(3)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedInnings === 3
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-muted/40 hover:text-muted/60 border border-transparent'
              }`}
            >
              3 Innings <span className="text-[10px] font-normal opacity-60">Quick</span>
            </button>
            <button
              onClick={() => setSelectedInnings(9)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedInnings === 9
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'text-muted/40 hover:text-muted/60 border border-transparent'
              }`}
            >
              9 Innings <span className="text-[10px] font-normal opacity-60">Full</span>
            </button>
          </div>
        </motion.div>

        <div className="w-full max-w-sm space-y-3">
          {difficultyOptions.map((opt, i) => (
            <motion.button
              key={opt.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => handleSelectDifficulty(opt.key, selectedInnings)}
              className={`w-full text-left rounded-2xl border transition-all cursor-pointer ${opt.borderColor}`}
              style={{ background: opt.bgGrad }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-lg font-black ${opt.color}`}>{opt.label}</h3>
                  <span className="text-muted/20 text-lg">&rarr;</span>
                </div>
                <p className="text-xs text-muted/50">{opt.tagline}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link href="/games/baseball" className="text-xs text-muted/30 hover:text-muted transition-colors">
            &larr; Back to Baseball Hub
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!state.game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.p className="text-muted text-sm" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
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

  const showControlResult = state.animPhase === 'control-landed';
  const showOutcome = state.animPhase === 'outcome-landed';
  const showStealResult = state.animPhase === 'steal-result';
  const stealOptions = getStealOptions();
  const canSteal = stealOptions.first || stealOptions.second;

  const shakeIntensity = state.currentOutcome === 'homerun' ? 'heavy' as const
    : ['strikeout', 'groundout_dp', 'triple'].includes(state.currentOutcome || '') ? 'medium' as const
    : 'light' as const;

  // Steal animation for diamond
  const stealAnim = (state.animPhase === 'steal-rolling' || state.animPhase === 'steal-result') && state.stealData
    ? { from: state.stealData.fromBase, success: state.stealData.success }
    : null;

  const theme = state.stadiumTheme;

  return (
    <ScreenShake trigger={state.shakeTrigger > 0} intensity={shakeIntensity}>
      <div
        className="min-h-screen flex flex-col relative"
        style={{ background: theme?.bgGradient || 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.03) 0%, transparent 50%)' }}
      >
        {/* Stadium vignette overlay — theme-driven */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 50%, ${theme?.vignetteColor || 'rgba(0,0,0,0.6)'} 100%)` }}
        />

        {/* Stadium ambient animation layer */}
        {theme?.ambientAnimClass && (
          <div
            className={`pointer-events-none fixed inset-0 z-0 ${theme.ambientAnimClass}`}
          />
        )}

        {/* Particle burst for home runs */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <ParticleBurst active={state.particleBurst} count={20} color="gold" />
        </div>

        {/* Crowd Reaction overlay */}
        <CrowdReaction
          type={state.crowdReaction}
          accentColor={theme?.crowdColor || '#f59e0b'}
          onDismiss={() => dispatch({ type: 'SET_CROWD', crowdReaction: null })}
        />

        {/* Scoreboard Strip — theme-driven */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/20 relative z-10" style={{ background: theme?.scoreboardBg || 'rgba(10,14,20,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-muted/60">
              {game.inning.half === 'top' ? 'TOP' : 'BOT'} {game.inning.inning}
            </span>
            {state.difficulty && (
              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                state.difficulty === 'legend' ? 'bg-red-500/10 text-red-400' :
                state.difficulty === 'veteran' ? 'bg-amber-500/10 text-amber-400' :
                'bg-green-500/10 text-green-400'
              }`}>
                {state.difficulty}
              </span>
            )}
            {state.gameLength === 9 && (
              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                9 INN
              </span>
            )}
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

        {/* Stadium name strip */}
        {theme && theme.id !== 'default' && (
          <div className="text-center py-1 relative z-10" style={{ background: `linear-gradient(90deg, transparent, ${theme.crowdColor}08, transparent)` }}>
            <span className="text-[8px] tracking-[0.15em] uppercase font-bold" style={{ color: `${theme.crowdColor}50` }}>
              {theme.stadiumName}
            </span>
          </div>
        )}

        {/* Batter vs Pitcher Cards */}
        <div className="flex gap-2 px-4 pt-3">
          <PlayerCard
            cardId={batterSlot.cardId}
            label={isPlayerBatting ? 'Your batter' : 'AI batter'}
            cards={state.cards}
            highlighted={state.controlResult === 'hitter' && (showControlResult || showOutcome)}
            evolutionTier={state.cardEvolutions.get(batterSlot.cardId)}
          />
          <PlayerCard
            cardId={pitcherId}
            label={isPlayerBatting ? 'AI pitcher' : 'Your pitcher'}
            cards={state.cards}
            highlighted={state.controlResult === 'pitcher' && (showControlResult || showOutcome)}
          />
        </div>

        {/* Diamond + Line Score */}
        <div className="py-2 relative">
          <Diamond
            bases={{
              first: game.bases.first !== null,
              second: game.bases.second !== null,
              third: game.bases.third !== null,
            }}
            stealAnim={stealAnim}
            recentScore={state.currentRunsScored > 0 && showOutcome}
            theme={theme}
          />
          {/* Inning-by-inning line score */}
          <LineScore game={game} awayName={state.aiRoster?.name || 'Away'} homeName={state.playerRoster?.name || 'Home'} />
        </div>

        {/* ===== Dice + Reveal Zone ===== */}
        <div className="px-4 min-h-[140px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {/* Control Roll Phase */}
            {(state.animPhase === 'control-rolling' || state.animPhase === 'control-landed') && state.controlRollValue !== null && (
              <motion.div key="control-phase" className="flex flex-col items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <DiceRoller
                  value={state.controlRollValue}
                  isRolling={state.animPhase === 'control-rolling'}
                  label="d20"
                  accentColor={state.controlResult === 'pitcher' ? 'text-red-400' : 'text-green-400'}
                  size="md"
                  onLandComplete={onControlDiceLand}
                />
                <AnimatePresence>
                  {showControlResult && state.controlResult && (
                    <ControlRollDisplay result={state.controlResult} pitcherName={state.currentPitcherName} batterName={state.currentBatterName} />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Outcome Roll Phase */}
            {state.animPhase === 'outcome-rolling' && state.outcomeRollValue !== null && (
              <motion.div key="outcome-phase" className="flex flex-col items-center gap-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <DiceRoller value={state.outcomeRollValue} isRolling={true} label="Outcome" accentColor="text-amber-400" size="md" onLandComplete={onOutcomeDiceLand} />
                <span className="text-[10px] text-muted/40">{state.controlResult === 'pitcher' ? 'Pitcher chart...' : 'Hitter chart...'}</span>
              </motion.div>
            )}

            {/* Outcome Reveal */}
            {showOutcome && state.currentOutcome && (
              <motion.div key="outcome-reveal" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OutcomeReveal outcome={state.currentOutcome} batterName={state.currentBatterName} runsScored={state.currentRunsScored} description={state.currentDescription} visible={true} />
              </motion.div>
            )}

            {/* Steal Roll Phase */}
            {state.animPhase === 'steal-rolling' && state.stealData && (
              <motion.div key="steal-roll" className="flex flex-col items-center gap-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <DiceRoller
                  value={state.stealData.rollValue}
                  isRolling={true}
                  label="Steal"
                  accentColor="text-purple-400"
                  size="md"
                  onLandComplete={onStealDiceLand}
                />
                <span className="text-[10px] text-muted/40">
                  {state.stealData.runnerName} needs ≤{state.stealData.threshold}
                </span>
              </motion.div>
            )}

            {/* Steal Result */}
            {showStealResult && state.stealData && (
              <motion.div key="steal-result" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <StealReveal
                  visible={true}
                  runnerName={state.stealData.runnerName}
                  fromBase={state.stealData.fromBase}
                  roll={state.stealData.rollValue}
                  threshold={state.stealData.threshold}
                  runnerSpeed={state.stealData.runnerSpeed}
                  catcherDefense={state.stealData.catcherDefense}
                  success={state.stealData.success}
                />
              </motion.div>
            )}

            {/* Idle state */}
            {state.animPhase === 'idle' && (
              <motion.p key="idle-prompt" className="text-[10px] text-muted/25" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {game.log.length === 0 ? 'Tap Roll to play ball!' : 'Next at-bat ready'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Play-by-play Log */}
        <div ref={logRef} className="flex-1 px-4 overflow-y-auto max-h-36 mb-2">
          {[...game.log].reverse().map((entry, i) => {
            const icon = OUTCOME_ICON[entry.outcome] || { symbol: '', color: 'text-muted/30' };
            const isHit = ['single', 'double', 'triple', 'homerun'].includes(entry.outcome);
            return (
              <div key={`${entry.inning}-${entry.half}-${i}`} className="flex items-start gap-1.5 py-1.5 border-b border-white/5 last:border-0">
                <span className="text-[9px] font-mono text-muted/25 shrink-0 pt-px w-5">
                  {entry.half === 'top' ? 'T' : 'B'}{entry.inning}
                </span>
                {icon.symbol && (
                  <span className={`text-[10px] font-bold shrink-0 w-5 text-center ${icon.color}`}>{icon.symbol}</span>
                )}
                <p className="text-[10px] text-muted/55 leading-tight flex-1">
                  {isHit && <span className="opacity-30 mr-0.5" title="Bat crack">{'\uD83C\uDFCF'}</span>}
                  {entry.description}
                </p>
                {entry.runsScored > 0 && (
                  <span className="text-amber-400/70 text-[10px] font-bold shrink-0 ml-auto">+{entry.runsScored}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Half-Inning Banner */}
        <AnimatePresence>
          {state.animPhase === 'half-inning' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center" onClick={() => dispatch({ type: 'HALF_INNING_DONE' })}>
              <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="text-center">
                <p className="text-muted/40 text-[10px] uppercase tracking-[0.2em] mb-2">End of</p>
                <p className="text-3xl font-black mb-5">{game.inning.half === 'top' ? 'Top' : 'Bottom'} {game.inning.inning}</p>
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
                <motion.p className="text-[10px] text-muted/30" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }}>Tap to continue</motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over */}
        <AnimatePresence>
          {state.animPhase === 'game-over' && summary && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/90 overflow-y-auto">
              <div className="min-h-screen flex items-center justify-center px-4 py-8">
                <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }} className="w-full max-w-sm">
                  {/* Score + Result */}
                  <div className="text-center mb-6">
                    <p className="text-[10px] text-muted/40 uppercase tracking-[0.2em] mb-3">Game Over {game.innings === 9 ? '— Full Game' : ''}</p>
                    <p className="text-5xl font-black mb-2 tabular-nums">{game.score.away} — {game.score.home}</p>
                    <motion.p className={`text-sm font-black ${summary.winner === 'home' ? 'text-green-400' : 'text-red-400'}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}>
                      {summary.winner === 'home' ? 'YOU WIN!' : 'YOU LOSE'}
                    </motion.p>
                  </div>

                  {/* MVP Card */}
                  {summary.mvp.character && (
                    <motion.div className="p-4 rounded-2xl bg-surface border border-amber-500/20 mb-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                      <p className="text-[10px] text-amber-400/50 uppercase tracking-widest">MVP</p>
                      <p className="text-base font-black mt-0.5">{summary.mvp.character}</p>
                      <p className="text-[11px] text-muted/50 mt-1">{summary.mvp.hits} hits, {summary.mvp.rbis} RBIs</p>
                    </motion.div>
                  )}

                  {/* Box Score */}
                  {game.log.length > 0 && (() => {
                    // Compute per-batter stats from log
                    const batters = new Map<string, { ab: number; h: number; hr: number; rbi: number; bb: number }>();
                    for (const entry of game.log) {
                      if (entry.half !== 'bottom') continue; // player is home
                      if (!entry.batter) continue;
                      const s = batters.get(entry.batter) || { ab: 0, h: 0, hr: 0, rbi: 0, bb: 0 };
                      if (entry.outcome === 'walk') { s.bb++; }
                      else { s.ab++; }
                      if (['single', 'double', 'triple', 'homerun'].includes(entry.outcome)) s.h++;
                      if (entry.outcome === 'homerun') s.hr++;
                      s.rbi += entry.runsScored;
                      batters.set(entry.batter, s);
                    }
                    if (batters.size === 0) return null;
                    const rows = Array.from(batters.entries()).sort((a, b) => (b[1].h + b[1].bb) - (a[1].h + a[1].bb));
                    return (
                      <motion.div
                        className="rounded-2xl bg-surface/50 border border-border/30 mb-4 overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                      >
                        <div className="px-4 py-2 border-b border-border/20">
                          <p className="text-[10px] text-muted/50 uppercase tracking-widest">Box Score</p>
                        </div>
                        <table className="w-full text-[10px]">
                          <thead>
                            <tr className="text-muted/30 border-b border-border/10">
                              <th className="text-left px-4 py-1 font-bold">Player</th>
                              <th className="text-center px-1 py-1 font-bold">AB</th>
                              <th className="text-center px-1 py-1 font-bold">H</th>
                              <th className="text-center px-1 py-1 font-bold">HR</th>
                              <th className="text-center px-1 py-1 font-bold">RBI</th>
                              <th className="text-center px-1 py-1 font-bold">BB</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map(([name, s]) => (
                              <tr key={name} className="border-b border-border/5 last:border-0">
                                <td className="px-4 py-1.5 font-bold text-[11px] truncate max-w-[120px]">{name}</td>
                                <td className="text-center px-1 py-1.5 tabular-nums text-muted/50">{s.ab}</td>
                                <td className="text-center px-1 py-1.5 tabular-nums font-bold">{s.h}</td>
                                <td className={`text-center px-1 py-1.5 tabular-nums ${s.hr > 0 ? 'text-amber-400 font-bold' : 'text-muted/30'}`}>{s.hr}</td>
                                <td className={`text-center px-1 py-1.5 tabular-nums ${s.rbi > 0 ? 'text-blue-400 font-bold' : 'text-muted/30'}`}>{s.rbi}</td>
                                <td className="text-center px-1 py-1.5 tabular-nums text-muted/30">{s.bb}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    );
                  })()}

                  {/* XP Breakdown */}
                  {state.xpBreakdown.length > 0 && (
                    <motion.div
                      className="rounded-2xl bg-surface/50 border border-border/30 mb-4 overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="px-4 py-2 border-b border-border/20">
                        <p className="text-[10px] text-muted/50 uppercase tracking-widest">XP Earned</p>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {state.xpBreakdown.filter(xp => xp.character && xp.character !== 'Unknown').slice(0, 9).map((xp, i) => (
                          <motion.div
                            key={xp.cardId || i}
                            className={`flex items-center justify-between px-4 py-2 border-b border-border/10 last:border-0 ${
                              xp.mvpBonus > 0 ? 'bg-amber-500/5' : ''
                            }`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.05 }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[11px] font-bold truncate">{xp.character}</span>
                              {xp.mvpBonus > 0 && <span className="text-[8px] text-amber-400 font-bold">MVP</span>}
                              {(() => {
                                const evoTier = state.cardEvolutions.get(xp.cardId);
                                if (!evoTier || evoTier <= 0) return null;
                                const tier = EVOLUTION_TIERS[evoTier];
                                return (
                                  <span
                                    className="text-[7px] font-black tracking-wider"
                                    style={{ color: tier.borderColor }}
                                  >
                                    {tier.label}
                                  </span>
                                );
                              })()}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted/50 shrink-0">
                              {xp.hrBonus > 0 && <span className="text-amber-400">+{xp.hrBonus}HR</span>}
                              {xp.tripleBonus > 0 && <span className="text-green-400">+{xp.tripleBonus}3B</span>}
                              {xp.rbiBonus > 0 && <span className="text-blue-400">+{xp.rbiBonus}RBI</span>}
                              <span className="text-white font-bold ml-1">+{xp.total}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-border/20 flex justify-between">
                        <span className="text-[10px] text-muted/40">Baseball XP</span>
                        <span className="text-[11px] font-black text-amber-400">
                          +{state.xpBreakdown.reduce((sum, xp) => sum + xp.total, 0)} XP
                        </span>
                      </div>
                      <div className="px-4 py-1.5 border-t border-border/10 flex justify-between">
                        <span className="text-[10px] text-muted/40">Collector XP</span>
                        <span className="text-[10px] font-bold text-accent">
                          +{summary && summary.winner === 'home' ? 40 : 15} XP
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Key Plays */}
                  {summary.keyPlays.length > 0 && (
                    <motion.div
                      className="rounded-2xl bg-surface/30 border border-border/20 mb-6 p-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <p className="text-[10px] text-muted/40 uppercase tracking-widest mb-2">Key Plays</p>
                      {summary.keyPlays.slice(0, 5).map((play, i) => (
                        <p key={i} className="text-[10px] text-muted/50 py-0.5">
                          <span className="font-mono text-muted/30">{play.half === 'top' ? 'T' : 'B'}{play.inning}</span>
                          {' '}{play.description}
                        </p>
                      ))}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/games/baseball/play" className="block w-full py-3.5 rounded-xl bg-accent text-bg text-sm font-bold hover:bg-accent/90 transition-colors text-center" onClick={() => window.location.reload()}>
                        Play Again
                      </Link>
                      <button
                        onClick={() => setShowShare(true)}
                        className="w-full py-3.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-sm font-bold hover:bg-blue-500/25 transition-colors"
                      >
                        Share
                      </button>
                    </div>
                    <Link href="/games/baseball/lineup" className="block w-full py-3 rounded-xl bg-surface border border-border/30 text-sm font-bold text-muted hover:text-white transition-colors text-center">
                      Edit Lineup
                    </Link>
                    <Link href="/games/baseball" className="block text-xs text-muted/40 hover:text-white transition-colors py-2 text-center">
                      Back to Baseball Hub
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Card Modal */}
        {showShare && game && summary && (
          <BaseballShareCard
            game={game}
            summary={summary}
            difficulty={state.difficulty || 'rookie'}
            playerTeam={state.playerRoster?.name || 'Your Team'}
            aiTeam={state.aiRoster?.name || 'AI Team'}
            onClose={() => setShowShare(false)}
          />
        )}

        {/* ===== Action Buttons ===== */}
        <div className="sticky bottom-0 p-4 bg-bg/90 backdrop-blur-sm border-t border-border/20">
          {state.animPhase === 'game-over' ? null : (
            <div className="flex gap-2">
              {/* Steal Buttons — contextual */}
              <AnimatePresence>
                {canSteal && state.animPhase === 'idle' && (
                  <motion.div
                    className="flex flex-col gap-1.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {stealOptions.first && (() => {
                      const info = getStealThreshold('first');
                      return (
                        <button
                          onClick={() => handleSteal('first')}
                          className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-bold hover:bg-purple-500/20 transition-colors cursor-pointer"
                        >
                          Steal 2nd
                          {info && <span className="text-[9px] text-purple-400/50 ml-1">≤{info.threshold}</span>}
                        </button>
                      );
                    })()}
                    {stealOptions.second && (() => {
                      const info = getStealThreshold('second');
                      return (
                        <button
                          onClick={() => handleSteal('second')}
                          className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-bold hover:bg-purple-500/20 transition-colors cursor-pointer"
                        >
                          Steal 3rd
                          {info && <span className="text-[9px] text-purple-400/50 ml-1">≤{info.threshold}</span>}
                        </button>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Roll Button */}
              <motion.button
                onClick={handleRoll}
                disabled={state.animPhase !== 'idle'}
                className={`flex-1 py-4 rounded-xl text-base font-black tracking-wider transition-all ${
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
            </div>
          )}
        </div>
      </div>
    </ScreenShake>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <motion.p className="text-muted text-sm" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
          Loading game...
        </motion.p>
      </div>
    }>
      <PlayPageInner />
    </Suspense>
  );
}
