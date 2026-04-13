'use client';

import { Card, BattleRecord, TriviaRecord, GameStats, SavedDeck, CollectorLevel, XPSource, XP_VALUES, getLevelFromXP, getXPForLevel, getTierForLevel, EarnedAchievement } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';
import { recordMonthlyXP } from '@/lib/vip';

// Local storage keys
const KEYS = {
  ownedCardIds: 'lorevault_owned',
  showcaseIds: 'lorevault_showcase',
  packCredits: 'lorevault_packs',
  xp: 'lorevault_xp',
  streak: 'lorevault_streak',
  lastVisit: 'lorevault_last_visit',
  battleRecords: 'lorevault_battles',
  triviaRecords: 'lorevault_trivia',
  gameStats: 'lorevault_game_stats',
  savedDecks: 'lorevault_decks',
  achievements: 'lorevault_achievements',
  seasonProgress: 'lorevault_season_progress',
  dailyMissions: 'lorevault_daily_missions',
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked
  }
}

// Start with a small starter collection (5 common cards from different sets)
function getDefaultOwnedIds(): string[] {
  const starters = ALL_CARDS.filter(c => c.scarcity === 'common' && c.parallel === 'base');
  // One from each set
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const card of starters) {
    if (!seen.has(card.setSlug) && ids.length < 5) {
      seen.add(card.setSlug);
      ids.push(card.id);
    }
  }
  return ids;
}

export function getOwnedCardIds(): string[] {
  return getItem<string[]>(KEYS.ownedCardIds, getDefaultOwnedIds());
}

export function getOwnedCards(): Card[] {
  const ids = new Set(getOwnedCardIds());
  return ALL_CARDS.filter(c => ids.has(c.id));
}

export function addOwnedCards(cardIds: string[]) {
  const current = getOwnedCardIds();
  const merged = [...new Set([...current, ...cardIds])];
  setItem(KEYS.ownedCardIds, merged);
  return merged;
}

export function getShowcaseIds(): string[] {
  return getItem<string[]>(KEYS.showcaseIds, []);
}

export function setShowcaseIds(ids: string[]) {
  setItem(KEYS.showcaseIds, ids);
}

export function getPackCredits(): number {
  return getItem<number>(KEYS.packCredits, 3); // Start with 3 free packs
}

export function usePackCredit(): boolean {
  const credits = getPackCredits();
  if (credits <= 0) return false;
  setItem(KEYS.packCredits, credits - 1);
  return true;
}

export function addPackCredits(count: number) {
  setItem(KEYS.packCredits, getPackCredits() + count);
}

export function getXP(): number {
  return getItem<number>(KEYS.xp, 0);
}

export function addXP(amount: number) {
  setItem(KEYS.xp, getXP() + amount);
}

export function getStreak(): number {
  return getItem<number>(KEYS.streak, 0);
}

export function resetAll() {
  if (typeof window === 'undefined') return;
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('lorevault_onboarding');
  localStorage.removeItem('lorevault_vip_monthly');
}

export function recordVisit() {
  const lastVisit = getItem<string>(KEYS.lastVisit, '');
  const today = new Date().toISOString().split('T')[0];

  if (lastVisit === today) return; // Already visited today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastVisit === yesterday) {
    // Streak continues
    setItem(KEYS.streak, getStreak() + 1);
  } else if (lastVisit !== today) {
    // Streak broken (or first visit)
    setItem(KEYS.streak, 1);
  }
  setItem(KEYS.lastVisit, today);
}

// Generate a RIGGED first pack — guarantees at least 1 Rare+ for the magic moment
export function generateFirstPack(): Card[] {
  // Pick from varied sets for variety
  const rarePool = ALL_CARDS.filter(c => c.scarcity === 'rare' || c.scarcity === 'epic');
  const uncommonPool = ALL_CARDS.filter(c => c.scarcity === 'uncommon');
  const commonPool = ALL_CARDS.filter(c => c.scarcity === 'common');

  const drawn: Card[] = [];
  const usedIds = new Set<string>();
  const usedSets = new Set<string>();

  // Card 5 (last revealed): Guaranteed Rare or Epic from a random set
  const rareCard = rarePool[Math.floor(Math.random() * rarePool.length)];
  drawn.push(rareCard);
  usedIds.add(rareCard.id);
  usedSets.add(rareCard.setSlug);

  // Card 4: Uncommon from a different set
  const uc = uncommonPool.filter(c => !usedIds.has(c.id) && !usedSets.has(c.setSlug));
  const uncommonCard = uc.length > 0 ? uc[Math.floor(Math.random() * uc.length)] : uncommonPool.find(c => !usedIds.has(c.id))!;
  drawn.push(uncommonCard);
  usedIds.add(uncommonCard.id);
  usedSets.add(uncommonCard.setSlug);

  // Cards 1-3: Commons from different sets
  for (let i = 0; i < 3; i++) {
    const available = commonPool.filter(c => !usedIds.has(c.id) && !usedSets.has(c.setSlug));
    const fallback = commonPool.filter(c => !usedIds.has(c.id));
    const pool = available.length > 0 ? available : fallback;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    drawn.push(pick);
    usedIds.add(pick.id);
    usedSets.add(pick.setSlug);
  }

  // Sort: commons first, rarest last (dramatic reveal order)
  const scarcityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  drawn.sort((a, b) => scarcityOrder[a.scarcity] - scarcityOrder[b.scarcity]);

  return drawn;
}

// ===== Collector Level System =====

export function getCollectorLevel(): CollectorLevel {
  const xp = getXP();
  const level = getLevelFromXP(xp);
  const tier = getTierForLevel(level);
  const xpForCurrent = getXPForLevel(level);
  const xpForNext = getXPForLevel(level + 1);
  const progressPercent = xpForNext > xpForCurrent
    ? Math.min(100, Math.round(((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100))
    : 100;

  return {
    level,
    tier,
    currentXP: xp,
    xpForCurrentLevel: xpForCurrent,
    xpForNextLevel: xpForNext,
    progressPercent,
  };
}

export function getCollectorXP(): number {
  return getXP();
}

export function addCollectorXP(amount: number, source: XPSource): { previousLevel: number; newLevel: number; xpAdded: number } {
  const prevXP = getXP();
  const prevLevel = getLevelFromXP(prevXP);
  const xpToAdd = amount || XP_VALUES[source];
  addXP(xpToAdd);
  recordMonthlyXP(xpToAdd);
  const newXP = prevXP + xpToAdd;
  const newLevel = getLevelFromXP(newXP);
  return { previousLevel: prevLevel, newLevel, xpAdded: xpToAdd };
}

// ===== Achievement Storage =====

export function getEarnedAchievements(): EarnedAchievement[] {
  return getItem<EarnedAchievement[]>(KEYS.achievements, []);
}

export function earnAchievement(achievementId: string): boolean {
  const earned = getEarnedAchievements();
  if (earned.some(a => a.achievementId === achievementId)) return false;
  earned.push({ achievementId, earnedAt: new Date().toISOString() });
  setItem(KEYS.achievements, earned);
  return true;
}

export function hasAchievement(achievementId: string): boolean {
  return getEarnedAchievements().some(a => a.achievementId === achievementId);
}

// ===== Season / Battle Pass =====

export function getSeasonTier(): number {
  return getItem<number>(KEYS.seasonProgress, 0);
}

export function advanceSeasonTier(amount: number = 1): number {
  const current = getSeasonTier();
  const next = Math.min(current + amount, 30);
  setItem(KEYS.seasonProgress, next);
  return next;
}

// ===== Daily Missions =====

export interface DailyMission {
  id: string;
  description: string;
  target: number;
  progress: number;
  reward: string;
  completed: boolean;
}

export function getDailyMissions(): DailyMission[] {
  const stored = getItem<{ date: string; missions: DailyMission[] } | null>(KEYS.dailyMissions, null);
  const today = new Date().toISOString().split('T')[0];
  if (stored && stored.date === today) return stored.missions;

  // Generate fresh missions each day
  const missions: DailyMission[] = [
    { id: 'daily-packs', description: 'Open 2 packs', target: 2, progress: 0, reward: '+1 Season Tier', completed: false },
    { id: 'daily-battle', description: 'Win a card battle', target: 1, progress: 0, reward: '+1 Season Tier', completed: false },
    { id: 'daily-trivia', description: 'Score 3+ in trivia', target: 3, progress: 0, reward: '+1 Season Tier', completed: false },
  ];
  setItem(KEYS.dailyMissions, { date: today, missions });
  return missions;
}

export function updateDailyMission(missionId: string, progress: number) {
  const today = new Date().toISOString().split('T')[0];
  const stored = getItem<{ date: string; missions: DailyMission[] } | null>(KEYS.dailyMissions, null);
  if (!stored || stored.date !== today) return;
  const missions = stored.missions.map(m => {
    if (m.id === missionId) {
      const newProgress = Math.min(m.target, progress);
      return { ...m, progress: newProgress, completed: newProgress >= m.target };
    }
    return m;
  });
  setItem(KEYS.dailyMissions, { date: today, missions });
}

// ===== Game State =====

const DEFAULT_GAME_STATS: GameStats = {
  battlesPlayed: 0,
  battlesWon: 0,
  triviaPlayed: 0,
  triviaHighScore: 0,
  totalGameXP: 0,
  longestBattleStreak: 0,
  longestTriviaStreak: 0,
};

export function getGameStats(): GameStats {
  return getItem<GameStats>(KEYS.gameStats, DEFAULT_GAME_STATS);
}

export function getBattleRecords(): BattleRecord[] {
  return getItem<BattleRecord[]>(KEYS.battleRecords, []);
}

export function getTriviaRecords(): TriviaRecord[] {
  return getItem<TriviaRecord[]>(KEYS.triviaRecords, []);
}

export function saveBattleRecord(record: BattleRecord) {
  const records = getBattleRecords();
  records.unshift(record);
  // Keep last 50
  setItem(KEYS.battleRecords, records.slice(0, 50));

  // Update game stats
  const stats = getGameStats();
  stats.battlesPlayed++;
  if (record.won) stats.battlesWon++;
  stats.totalGameXP += record.xpEarned;

  // Track win streak
  const recentWins = records.filter(r => r.won).length;
  let currentStreak = 0;
  for (const r of records) {
    if (r.won) currentStreak++;
    else break;
  }
  if (currentStreak > stats.longestBattleStreak) {
    stats.longestBattleStreak = currentStreak;
  }

  setItem(KEYS.gameStats, stats);

  // Also add XP to main XP pool
  addXP(record.xpEarned);
}

export function saveTriviaRecord(record: TriviaRecord) {
  const records = getTriviaRecords();
  records.unshift(record);
  setItem(KEYS.triviaRecords, records.slice(0, 50));

  const stats = getGameStats();
  stats.triviaPlayed++;
  if (record.score > stats.triviaHighScore) {
    stats.triviaHighScore = record.score;
  }
  stats.totalGameXP += record.xpEarned;
  if (record.streak > stats.longestTriviaStreak) {
    stats.longestTriviaStreak = record.streak;
  }
  setItem(KEYS.gameStats, stats);

  addXP(record.xpEarned);
}

// ===== Saved Decks =====

export function getSavedDecks(): SavedDeck[] {
  return getItem<SavedDeck[]>(KEYS.savedDecks, []);
}

export function saveDeck(name: string, cardIds: string[]): SavedDeck {
  const decks = getSavedDecks();
  const deck: SavedDeck = {
    id: `deck-${Date.now()}`,
    name,
    cardIds,
    createdAt: new Date().toISOString(),
  };
  decks.push(deck);
  setItem(KEYS.savedDecks, decks);
  return deck;
}

export function deleteDeck(id: string) {
  const decks = getSavedDecks().filter(d => d.id !== id);
  setItem(KEYS.savedDecks, decks);
}

// Generate a pack of cards (weighted by scarcity)
export function generatePack(setSlug?: string): Card[] {
  const pool = setSlug && setSlug !== 'mixed'
    ? ALL_CARDS.filter(c => c.setSlug === setSlug)
    : ALL_CARDS;

  // Weight: common 50%, uncommon 25%, rare 15%, epic 8%, legendary 2%
  const weighted: Card[] = [];
  for (const card of pool) {
    const copies = card.scarcity === 'common' ? 50
      : card.scarcity === 'uncommon' ? 25
      : card.scarcity === 'rare' ? 15
      : card.scarcity === 'epic' ? 8
      : 2;
    for (let i = 0; i < copies; i++) weighted.push(card);
  }

  // Draw 5 unique cards (guarantee at least 1 uncommon+)
  const drawn: Card[] = [];
  const usedIds = new Set<string>();

  // First card: guaranteed uncommon or better
  const betterPool = weighted.filter(c => c.scarcity !== 'common');
  const guaranteed = betterPool[Math.floor(Math.random() * betterPool.length)];
  drawn.push(guaranteed);
  usedIds.add(guaranteed.id);

  // Remaining 4 cards
  while (drawn.length < 5) {
    const pick = weighted[Math.floor(Math.random() * weighted.length)];
    if (!usedIds.has(pick.id)) {
      drawn.push(pick);
      usedIds.add(pick.id);
    }
  }

  // Sort: rarest last (for dramatic reveal)
  const scarcityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  drawn.sort((a, b) => scarcityOrder[a.scarcity] - scarcityOrder[b.scarcity]);

  return drawn;
}
