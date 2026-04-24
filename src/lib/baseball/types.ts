// Public Domain Baseball — Type Definitions
// Pure data types for the game engine. No UI coupling.

// ===== Player Stats =====

export type SpeedRating = 'A' | 'B' | 'C';

export interface HitterStats {
  type: 'hitter';
  onBase: number;       // 6-15 — likelihood of reaching base
  power: number;        // 0-20 — extra-base hit probability
  speed: number;        // 10-20 — steal success, scoring from 1st
  defense: number;      // +1 to +5 — fielding ability
  pointCost: number;    // 1-30 — roster cap value
}

export interface PitcherStats {
  type: 'pitcher';
  control: number;      // 1-6 — roll 1 threshold
  fielding: number;     // 1-5 — pitcher's own defensive ability
  pointCost: number;    // 1-30 — roster cap value
}

export type PlayerStats = HitterStats | PitcherStats;

export type FieldPosition = 'C' | '1B' | '2B' | 'SS' | '3B' | 'LF' | 'CF' | 'RF';

export interface BaseballCard {
  id: string;             // references LoreVault card ID
  character: string;      // character name
  stats: PlayerStats;
}

// ===== Roster / Lineup =====

export interface LineupSlot {
  cardId: string;
  position: FieldPosition;
  battingOrder: number;   // 1-9
}

export interface Roster {
  name: string;
  hitters: LineupSlot[];  // 9 hitters with positions
  pitcher: string;        // card ID of pitcher
  totalCost: number;
}

export const MAX_ROSTER_COST = 150;
export const ROSTER_SIZE = 9; // hitters
export const CARDS_PER_PAGE = 6; // for binder grid

// ===== Hit Charts =====

export type AtBatOutcome =
  | 'strikeout'
  | 'groundout'
  | 'flyout'
  | 'walk'
  | 'single'
  | 'double'
  | 'triple'
  | 'homerun'
  | 'groundout_dp'; // groundout with double play potential

export interface HitChart {
  // Maps d20 roll (1-20) to outcome
  results: AtBatOutcome[];  // index 0 = roll 1, index 19 = roll 20
}

// ===== Game State =====

export type BaseRunner = {
  cardId: string;
  speedRating: SpeedRating;
};

export interface BaseState {
  first: BaseRunner | null;
  second: BaseRunner | null;
  third: BaseRunner | null;
}

export type HalfInning = 'top' | 'bottom';

export interface InningState {
  inning: number;          // 1-based
  half: HalfInning;
  outs: number;            // 0-2 (3 = half-inning over)
}

export interface GameState {
  id: string;
  innings: 3 | 9;         // game length
  inning: InningState;
  bases: BaseState;
  score: { away: number; home: number };
  battingOrderIndex: { away: number; home: number }; // 0-8
  awayRoster: Roster;
  homeRoster: Roster;
  isGameOver: boolean;
  log: PlayLogEntry[];
}

// ===== Play Log =====

export interface PlayLogEntry {
  inning: number;
  half: HalfInning;
  batter: string;          // character name
  pitcher: string;         // character name
  controlRoll: number;     // 1-20
  controlResult: 'pitcher' | 'hitter';
  outcomeRoll: number;     // 1-20
  outcome: AtBatOutcome;
  runsScored: number;
  description: string;     // human-readable play-by-play
}

export interface StealAttempt {
  runner: string;           // character name
  fromBase: 'first' | 'second';
  roll: number;
  threshold: number;        // speed - catcher defense
  success: boolean;
}

export interface GameSummary {
  winner: 'away' | 'home';
  finalScore: { away: number; home: number };
  totalInnings: number;
  mvp: { character: string; hits: number; rbis: number };
  keyPlays: PlayLogEntry[];
}

// ===== Utility =====

export function getSpeedRating(speed: number): SpeedRating {
  if (speed >= 17) return 'A';
  if (speed >= 13) return 'B';
  return 'C';
}
