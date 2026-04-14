export type Scarcity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Parallel = 'base' | 'silver' | 'gold' | 'holographic' | 'obsidian';

export interface CardEvent {
  type: 'pulled' | 'revealed' | 'battle_win' | 'battle_loss' | 'showcased' | 'traded';
  date: string;
  detail?: string;
}

export interface Card {
  id: string;
  name: string;
  character: string;
  set: string;
  setSlug: string;
  moment: string;
  scarcity: Scarcity;
  parallel: Parallel;
  serialNumber: number;
  maxSerial: number;
  loreText: string;
  price: number;
  listed: boolean;
  owned: boolean;
  gradientFrom: string;
  gradientTo: string;
  symbol: string;
  // Collectibility fields
  sealed?: boolean;         // true = character hidden, only scarcity glow visible
  acquiredAt?: string;      // ISO date when this card was first obtained
  battleCount?: number;     // total battles this card participated in
  tradeCount?: number;      // times this card changed hands
  pullContext?: string;     // "First Hour" | "Milestone Pull" | etc.
  history?: CardEvent[];    // living provenance chain
}

export interface CardSet {
  name: string;
  slug: string;
  description: string;
  cardCount: number;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'set-completion' | 'scarcity-chase' | 'thematic' | 'daily' | 'weekly' | 'seasonal';
  requirements: ChallengeRequirement[];
  reward: ChallengeReward;
  progress: number;
  total: number;
  expiresAt?: string;
  active: boolean;
}

export interface ChallengeRequirement {
  description: string;
  met: boolean;
}

export interface ChallengeReward {
  type: 'card' | 'badge' | 'title' | 'xp' | 'pack';
  name: string;
  description: string;
  scarcity?: Scarcity;
}

export interface CollectorProfile {
  username: string;
  collectorScore: number;
  totalCards: number;
  uniqueSets: number;
  legendaryCount: number;
  showcaseCards: string[]; // card IDs
  badges: Badge[];
  joinedDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

// ===== Game Types =====

export interface BattleRecord {
  id: string;
  date: string;
  playerDeck: string[]; // card IDs
  opponentDeck: string[]; // card names (AI doesn't use real cards)
  rounds: BattleRound[];
  playerWins: number;
  opponentWins: number;
  won: boolean;
  xpEarned: number;
}

export interface BattleRound {
  roundNumber: number;
  stat: 'power' | 'intelligence' | 'mystery' | 'legend' | 'charm';
  playerCardId: string;
  playerValue: number;
  opponentCharacter: string;
  opponentValue: number;
  playerWon: boolean;
}

export interface TriviaRecord {
  id: string;
  date: string;
  score: number;
  total: number;
  streak: number;
  xpEarned: number;
  timeMs: number;
}

export interface GameStats {
  battlesPlayed: number;
  battlesWon: number;
  triviaPlayed: number;
  triviaHighScore: number;
  totalGameXP: number;
  longestBattleStreak: number;
  longestTriviaStreak: number;
}

export interface SavedDeck {
  id: string;
  name: string;
  cardIds: string[];
  createdAt: string;
}

export const SCARCITY_CONFIG: Record<Scarcity, { label: string; color: string; maxSerial: number; bgClass: string }> = {
  common: { label: 'Common', color: '#6b7094', maxSerial: 9999, bgClass: 'bg-common' },
  uncommon: { label: 'Uncommon', color: '#22c55e', maxSerial: 1000, bgClass: 'bg-uncommon' },
  rare: { label: 'Rare', color: '#3b82f6', maxSerial: 250, bgClass: 'bg-rare' },
  epic: { label: 'Epic', color: '#a855f7', maxSerial: 50, bgClass: 'bg-epic' },
  legendary: { label: 'Legendary', color: '#f59e0b', maxSerial: 10, bgClass: 'bg-legendary' },
};

export const PARALLEL_CONFIG: Record<Parallel, { label: string; effect: string }> = {
  base: { label: 'Base', effect: 'none' },
  silver: { label: 'Silver Frame', effect: 'shimmer' },
  gold: { label: 'Gold Frame', effect: 'glow' },
  holographic: { label: 'Holographic', effect: 'holographic' },
  obsidian: { label: 'Obsidian', effect: 'obsidian' },
};

// ===== Collector Level System =====

export type XPSource =
  | 'pack_open'
  | 'card_acquired'
  | 'set_progress'
  | 'battle_win'
  | 'trivia_correct'
  | 'daily_login'
  | 'streak_bonus'
  | 'achievement';

export const XP_VALUES: Record<XPSource, number> = {
  pack_open: 25,
  card_acquired: 10,
  set_progress: 50,
  battle_win: 30,
  trivia_correct: 5,
  daily_login: 15,
  streak_bonus: 5,
  achievement: 0, // variable, set at grant time
};

export type CollectorTier = 'Newcomer' | 'Collector' | 'Enthusiast' | 'Connoisseur' | 'Elite' | 'Legendary';

export interface CollectorLevel {
  level: number;
  tier: CollectorTier;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export function getTierForLevel(level: number): CollectorTier {
  if (level <= 5) return 'Newcomer';
  if (level <= 15) return 'Collector';
  if (level <= 25) return 'Enthusiast';
  if (level <= 35) return 'Connoisseur';
  if (level <= 45) return 'Elite';
  return 'Legendary';
}

export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  // XP = 100 * N * (N-1) / 2 — accelerating curve
  return 100 * level * (level - 1) / 2;
}

export function getLevelFromXP(xp: number): number {
  // Inverse of XP formula: solve 100*L*(L-1)/2 = xp for L
  // 50*L^2 - 50*L - xp = 0 => L = (50 + sqrt(2500 + 200*xp)) / 100
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
    if (level >= 50) break;
  }
  return level;
}

// ===== Season / Battle Pass =====

export interface SeasonTier {
  tier: number;
  reward: SeasonReward;
  xpRequired: number;
  unlocked: boolean;
}

export interface SeasonReward {
  type: 'badge' | 'xp_boost' | 'showcase_theme' | 'card_frame' | 'pack' | 'title';
  name: string;
  description: string;
  icon: string;
}

// ===== Achievement System =====

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type AchievementCategory = 'collection' | 'battle' | 'discovery' | 'dedication' | 'special';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  mockPercent: number; // % of collectors who earn it
}

export interface EarnedAchievement {
  achievementId: string;
  earnedAt: string;
}
