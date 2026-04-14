// Public Domain Baseball — Game Records + XP System
// Persistence layer for game history and character progression.
// All data stored in localStorage with 'pdb-' prefix.

import { GameState, PlayLogEntry, GameSummary } from './types';

// ===== Types =====

export interface GameRecord {
  id: string;
  date: string;              // ISO date
  result: 'win' | 'loss';
  finalScore: { away: number; home: number };
  innings: number;
  mvp: { character: string; hits: number; rbis: number };
  keyPlays: string[];        // descriptions of scoring plays
  playerTeamName: string;
  aiTeamName: string;
  totalAtBats: number;
}

export interface CharacterXP {
  cardId: string;
  character: string;
  totalXP: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  totalHits: number;
  totalRBIs: number;
  homeRuns: number;
  mvpAwards: number;
}

export interface XPBreakdown {
  cardId: string;
  character: string;
  base: number;       // 50 win, 25 loss
  hrBonus: number;    // 20 per HR
  tripleBonus: number; // 10 per triple
  rbiBonus: number;   // 5 per RBI
  mvpBonus: number;   // 50 if MVP
  total: number;
}

// ===== Constants =====

const GAME_HISTORY_KEY = 'pdb-game-history';
const CHARACTER_XP_KEY = 'pdb-character-xp';
const MAX_GAME_HISTORY = 20;

const XP_WIN = 50;
const XP_LOSS = 25;
const XP_HR = 20;
const XP_TRIPLE = 10;
const XP_RBI = 5;
const XP_MVP = 50;

// ===== Game History =====

export function getGameHistory(): GameRecord[] {
  try {
    return JSON.parse(localStorage.getItem(GAME_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveGameRecord(
  game: GameState,
  summary: GameSummary,
  playerTeamName: string,
  aiTeamName: string,
): GameRecord {
  const record: GameRecord = {
    id: game.id,
    date: new Date().toISOString(),
    result: summary.winner === 'home' ? 'win' : 'loss',
    finalScore: summary.finalScore,
    innings: summary.totalInnings,
    mvp: summary.mvp,
    keyPlays: summary.keyPlays.map(p => p.description),
    playerTeamName,
    aiTeamName,
    totalAtBats: game.log.length,
  };

  const history = getGameHistory();
  history.unshift(record); // newest first
  if (history.length > MAX_GAME_HISTORY) {
    history.length = MAX_GAME_HISTORY;
  }
  localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(history));

  return record;
}

// ===== Character XP =====

export function getCharacterXP(): Map<string, CharacterXP> {
  try {
    const data: CharacterXP[] = JSON.parse(localStorage.getItem(CHARACTER_XP_KEY) || '[]');
    const map = new Map<string, CharacterXP>();
    for (const entry of data) {
      map.set(entry.cardId, entry);
    }
    return map;
  } catch {
    return new Map();
  }
}

function saveCharacterXP(xpMap: Map<string, CharacterXP>): void {
  localStorage.setItem(CHARACTER_XP_KEY, JSON.stringify(Array.from(xpMap.values())));
}

/**
 * Calculate and award XP to all participating characters.
 * Returns breakdown for display on game over screen.
 */
export function awardGameXP(
  game: GameState,
  summary: GameSummary,
): XPBreakdown[] {
  const isWin = summary.winner === 'home';
  const baseXP = isWin ? XP_WIN : XP_LOSS;

  // Gather per-character stats from log
  const charStats = new Map<string, {
    cardId: string;
    character: string;
    hits: number;
    rbis: number;
    homeRuns: number;
    triples: number;
  }>();

  // Add all player (home) roster characters
  for (const slot of game.homeRoster.hitters) {
    charStats.set(slot.cardId, {
      cardId: slot.cardId,
      character: '', // filled from log or registry
      hits: 0, rbis: 0, homeRuns: 0, triples: 0,
    });
  }

  // Process log for home team batters
  for (const entry of game.log) {
    if (entry.half !== 'bottom') continue; // player is home team

    // Find the card ID for this batter from roster
    const slot = game.homeRoster.hitters.find(h => {
      const s = charStats.get(h.cardId);
      return s !== undefined;
    });

    // Match by batter name in log
    for (const [cardId, stats] of charStats) {
      if (stats.character === '' && entry.batter) {
        // We'll set character name from any log entry
      }
    }

    // Simpler: iterate all and match by name
    let matched = false;
    for (const [cardId, stats] of charStats) {
      if (stats.character === entry.batter || stats.character === '') {
        if (stats.character === '') stats.character = entry.batter;
        if (stats.character !== entry.batter) continue;

        const isHit = ['single', 'double', 'triple', 'homerun'].includes(entry.outcome);
        if (isHit) stats.hits++;
        stats.rbis += entry.runsScored;
        if (entry.outcome === 'homerun') stats.homeRuns++;
        if (entry.outcome === 'triple') stats.triples++;
        matched = true;
        break;
      }
    }
  }

  // Calculate XP breakdown for each character
  const breakdowns: XPBreakdown[] = [];
  const xpMap = getCharacterXP();

  for (const [cardId, stats] of charStats) {
    const isMVP = stats.character === summary.mvp.character;
    const hrBonus = stats.homeRuns * XP_HR;
    const tripleBonus = stats.triples * XP_TRIPLE;
    const rbiBonus = stats.rbis * XP_RBI;
    const mvpBonus = isMVP ? XP_MVP : 0;
    const total = baseXP + hrBonus + tripleBonus + rbiBonus + mvpBonus;

    breakdowns.push({
      cardId,
      character: stats.character || 'Unknown',
      base: baseXP,
      hrBonus,
      tripleBonus,
      rbiBonus,
      mvpBonus,
      total,
    });

    // Update persistent XP
    const existing = xpMap.get(cardId) || {
      cardId,
      character: stats.character,
      totalXP: 0,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      totalHits: 0,
      totalRBIs: 0,
      homeRuns: 0,
      mvpAwards: 0,
    };

    existing.totalXP += total;
    existing.gamesPlayed++;
    if (isWin) existing.wins++; else existing.losses++;
    existing.totalHits += stats.hits;
    existing.totalRBIs += stats.rbis;
    existing.homeRuns += stats.homeRuns;
    if (isMVP) existing.mvpAwards++;
    if (!existing.character) existing.character = stats.character;

    xpMap.set(cardId, existing);
  }

  saveCharacterXP(xpMap);

  // Sort by XP earned descending
  breakdowns.sort((a, b) => b.total - a.total);

  return breakdowns;
}

// ===== Stats Helpers =====

export function getWinLossRecord(): { wins: number; losses: number } {
  const history = getGameHistory();
  return {
    wins: history.filter(g => g.result === 'win').length,
    losses: history.filter(g => g.result === 'loss').length,
  };
}

export function getTopCharacters(limit: number = 5): CharacterXP[] {
  const xpMap = getCharacterXP();
  return Array.from(xpMap.values())
    .sort((a, b) => b.totalXP - a.totalXP)
    .slice(0, limit);
}
