'use client';

import { Card, CardEvent, BattleRecord, TriviaRecord, GameStats, SavedDeck, CollectorLevel, XPSource, XP_VALUES, getLevelFromXP, getXPForLevel, getTierForLevel, EarnedAchievement } from '@/data/types';
import { ALL_CARDS, GHOST_CARDS, isGhostCard } from '@/data/cards';
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
  return [...ALL_CARDS, ...GHOST_CARDS].filter(c => ids.has(c.id));
}

export function addOwnedCards(cardIds: string[]) {
  const current = getOwnedCardIds();
  const merged = [...new Set([...current, ...cardIds])];
  setItem(KEYS.ownedCardIds, merged);
  // Initialize collectibility metadata for new cards
  const meta = getCardMeta();
  const now = new Date().toISOString();
  for (const id of cardIds) {
    if (!meta[id]) {
      meta[id] = {
        sealed: true,
        acquiredAt: now,
        battleCount: 0,
        tradeCount: 0,
        history: [{ type: 'pulled', date: now }],
      };
    }
  }
  setItem('lorevault_card_meta', meta);
  return merged;
}

export function removeOwnedCards(cardIds: string[]): string[] {
  const current = getOwnedCardIds();
  const toRemove = new Set(cardIds);
  const remaining = current.filter(id => !toRemove.has(id));
  setItem(KEYS.ownedCardIds, remaining);
  return remaining;
}

// Card collectibility metadata (sealed state, history, aging)
type CardMeta = Record<string, {
  sealed: boolean;
  acquiredAt: string;
  battleCount: number;
  tradeCount: number;
  history: CardEvent[];
}>;

export function getCardMeta(): CardMeta {
  return getItem<CardMeta>('lorevault_card_meta', {});
}

export function revealCard(cardId: string): void {
  const meta = getCardMeta();
  if (meta[cardId]) {
    meta[cardId].sealed = false;
    meta[cardId].history.push({ type: 'revealed', date: new Date().toISOString() });
    setItem('lorevault_card_meta', meta);
  }
}

export function recordBattle(cardId: string, won: boolean): void {
  const meta = getCardMeta();
  if (meta[cardId]) {
    meta[cardId].battleCount++;
    meta[cardId].history.push({
      type: won ? 'battle_win' : 'battle_loss',
      date: new Date().toISOString(),
    });
    setItem('lorevault_card_meta', meta);
  }
}

export function getCardAge(cardId: string): number {
  const meta = getCardMeta();
  if (!meta[cardId]?.acquiredAt) return 0;
  return Math.floor((Date.now() - new Date(meta[cardId].acquiredAt).getTime()) / 86400000);
}

export type AgingBattleTier = 'pristine' | 'seasoned' | 'battle-worn' | 'veteran';
export type AgingTimeTier = 'bonded' | 'ancient';

export interface AgingTiers {
  battle: AgingBattleTier | null;
  time: AgingTimeTier | null;
}

export function getAgingTiers(cardId: string): AgingTiers {
  const meta = getCardMeta();
  const m = meta[cardId];
  if (!m) return { battle: null, time: null };

  const ageDays = m.acquiredAt
    ? Math.floor((Date.now() - new Date(m.acquiredAt).getTime()) / 86400000)
    : 0;
  const battles = m.battleCount ?? 0;
  const trades = (m.history?.filter((e: { type: string }) => e.type === 'traded') ?? []).length;

  let battle: AgingBattleTier | null = null;
  if (battles >= 100 && ageDays >= 60) battle = 'veteran';
  else if (battles >= 50) battle = 'battle-worn';
  else if (battles >= 10) battle = 'seasoned';
  else if (battles === 0 && trades === 0 && ageDays < 7) battle = 'pristine';

  let time: AgingTimeTier | null = null;
  if (ageDays >= 90) time = 'ancient';
  else if (ageDays >= 30) time = 'bonded';

  return { battle, time };
}

export interface OriginBadge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export function getOriginBadge(cardId: string): OriginBadge | null {
  const meta = getCardMeta();
  const m = meta[cardId];
  if (!m) return null;

  // Compute first-ever acquisition timestamp across all cards
  const allDates = Object.values(meta)
    .map(c => c.acquiredAt)
    .filter(Boolean)
    .sort();
  const firstEverDate = allDates[0];

  // Genesis: card was pulled in the very first pack opening (within 60s of first-ever card)
  if (firstEverDate && m.acquiredAt) {
    const diff = Math.abs(new Date(m.acquiredAt).getTime() - new Date(firstEverDate).getTime());
    if (diff < 60000) {
      return { id: 'genesis', label: 'Genesis', icon: '✦', color: '#ffd700' };
    }
  }

  // OG: among the first 10 cards ever acquired
  if (m.acquiredAt && allDates.indexOf(m.acquiredAt) < 10) {
    return { id: 'og', label: 'OG', icon: '⚡', color: '#f59e0b' };
  }

  // Veteran: aging tier veteran
  const tiers = getAgingTiers(cardId);
  if (tiers.battle === 'veteran') {
    return { id: 'veteran', label: 'Veteran', icon: '🏛', color: '#b8860b' };
  }

  // Pristine: aging tier pristine
  if (tiers.battle === 'pristine') {
    return { id: 'pristine', label: 'Pristine', icon: '✦', color: '#e0e7ff' };
  }

  return null;
}

export function isCardSealed(cardId: string): boolean {
  const meta = getCardMeta();
  return meta[cardId]?.sealed ?? false;
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
  addPassXP(xpToAdd);
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

// ===== Population Data =====

export interface PopulationData {
  totalMinted: number;
  currentOwners: number;
  serialTier: 'genesis' | 'low' | 'mid' | 'standard';
}

// Seeded hash for deterministic per-card population
function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const POP_RANGES: Record<string, [number, number]> = {
  legendary: [10, 49],
  epic: [50, 199],
  rare: [200, 999],
  uncommon: [1000, 2999],
  common: [5000, 9999],
};

const PARALLEL_DIVISORS: Record<string, number> = {
  base: 1,
  silver: 2,
  gold: 4,
  holographic: 8,
  obsidian: 20,
};

export function getPopulationData(card: { id: string; scarcity: string; parallel: string; serialNumber: number }): PopulationData {
  const [min, max] = POP_RANGES[card.scarcity] || [1000, 5000];
  const divisor = PARALLEL_DIVISORS[card.parallel] || 1;
  const seed = hashCode(card.id);
  const range = max - min;
  const basePop = min + (seed % range);
  const totalMinted = Math.max(Math.floor(basePop / divisor), card.scarcity === 'legendary' ? 5 : 10);

  // currentOwners: 60-90% of totalMinted, seeded
  const ownerPct = 0.6 + ((seed % 31) / 100);
  const currentOwners = Math.max(1, Math.floor(totalMinted * ownerPct));

  // Serial tier based on position relative to population
  let serialTier: PopulationData['serialTier'] = 'standard';
  if (card.serialNumber === 1) serialTier = 'genesis';
  else if (card.serialNumber <= 10) serialTier = 'low';
  else if (card.serialNumber <= Math.floor(totalMinted * 0.1)) serialTier = 'mid';

  return { totalMinted, currentOwners, serialTier };
}

// ===== Pinned Badges =====

const PINNED_BADGES_KEY = 'lorevault_pinned_badges';

export function getPinnedBadges(): string[] {
  return getItem<string[]>(PINNED_BADGES_KEY, []);
}

export function setPinnedBadges(badgeIds: string[]) {
  setItem(PINNED_BADGES_KEY, badgeIds.slice(0, 3));
}

export function togglePinnedBadge(badgeId: string): string[] {
  const current = getPinnedBadges();
  if (current.includes(badgeId)) {
    const updated = current.filter(id => id !== badgeId);
    setPinnedBadges(updated);
    return updated;
  }
  if (current.length >= 3) return current; // max 3
  const updated = [...current, badgeId];
  setPinnedBadges(updated);
  return updated;
}

// ===== Pack Counter =====
const PACKS_OPENED_KEY = 'lorevault_packs_opened';

export function getPacksOpened(): number {
  return getItem<number>(PACKS_OPENED_KEY, 0);
}

function incrementPacksOpened(): number {
  const count = getPacksOpened() + 1;
  setItem(PACKS_OPENED_KEY, count);
  return count;
}

// ===== Ghost Card Pull Conditions =====
import { getForgeHistory } from '@/lib/seasonal-vault';

function checkGhostConditions(): Card | null {
  const owned = getOwnedCards();
  const ownedIds = new Set(owned.map(c => c.id));
  const ownedLegendaries = owned.filter(c => c.scarcity === 'legendary').length;
  const packsOpened = getPacksOpened();
  const streak = getStreak();

  // Map of ghost card → condition
  const conditions: [string, boolean][] = [
    // Ghost 0: 13th pack opened
    ['ghost-void-odin', packsOpened === 13],
    // Ghost 1: owning 5+ legendaries
    ['ghost-mirror-sherlock', ownedLegendaries >= 5],
    // Ghost 2: pulling on day-of-week matching set hash
    ['ghost-crimson-dracula', (() => {
      const dayHash = Math.abs('gothic-horror'.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)) % 7;
      return new Date().getDay() === dayHash;
    })()],
    // Ghost 3: 7-day login streak
    ['ghost-inverse-zeus', streak >= 7],
    // Ghost 4: owning all 20 characters from a single set
    ['ghost-forgotten-alice', (() => {
      const setCharCounts: Record<string, Set<string>> = {};
      for (const c of owned) {
        if (!setCharCounts[c.setSlug]) setCharCounts[c.setSlug] = new Set();
        setCharCounts[c.setSlug].add(c.character);
      }
      return Object.values(setCharCounts).some(chars => chars.size >= 20);
    })()],
    // Ghost 5: 3rd forge completed
    ['ghost-true-queen', getForgeHistory().length >= 3],
  ];

  // Check each condition — if met AND card not owned AND 15% roll
  for (const [ghostId, condMet] of conditions) {
    if (condMet && !ownedIds.has(ghostId) && Math.random() < 0.15) {
      return GHOST_CARDS.find(c => c.id === ghostId) || null;
    }
  }

  return null;
}

// Generate a pack of cards (weighted by scarcity)
export function generatePack(setSlug?: string): Card[] {
  // Increment pack counter
  incrementPacksOpened();

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

  // Ghost card injection — silently check hidden conditions
  const ghostCard = checkGhostConditions();
  if (ghostCard) {
    // Replace the least-rare card (first in the array before sort)
    drawn[0] = ghostCard;
  }

  // Sort: rarest last (for dramatic reveal), ghost cards always last
  const scarcityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  drawn.sort((a, b) => {
    const aGhost = isGhostCard(a.id) ? 1 : 0;
    const bGhost = isGhostCard(b.id) ? 1 : 0;
    if (aGhost !== bGhost) return aGhost - bGhost;
    return scarcityOrder[a.scarcity] - scarcityOrder[b.scarcity];
  });

  return drawn;
}

// ===== Lore Codex =====

import { LORE_GRAPH, LoreNode } from '@/data/lore-graph';

export function getUnlockedLoreNodes(): string[] {
  const owned = getOwnedCards();
  const ownedCharacters = new Set(owned.map(c => c.character));

  return LORE_GRAPH
    .filter(node => node.requiredCharacters.every(ch => ownedCharacters.has(ch)))
    .map(node => node.id);
}

export function isLoreNodeUnlocked(nodeId: string): boolean {
  const node = LORE_GRAPH.find(n => n.id === nodeId);
  if (!node) return false;
  const owned = getOwnedCards();
  const ownedCharacters = new Set(owned.map(c => c.character));
  return node.requiredCharacters.every(ch => ownedCharacters.has(ch));
}

export function getCodexCompletionPercent(): number {
  const unlocked = getUnlockedLoreNodes();
  return Math.round((unlocked.length / LORE_GRAPH.length) * 100);
}

export function getLoreNodesForCard(character: string): LoreNode[] {
  return LORE_GRAPH.filter(node => node.requiredCharacters.includes(character));
}

// Cascade: nodes adjacent to any unlocked node become "hinted" (visible silhouette + requirements)
export function getHintedLoreNodes(): string[] {
  if (typeof window === 'undefined') return [];
  const unlocked = new Set(getUnlockedLoreNodes());
  const hinted = new Set<string>();

  for (const node of LORE_GRAPH) {
    if (unlocked.has(node.id)) {
      // All connections of an unlocked node become hinted
      for (const connId of node.connections) {
        if (!unlocked.has(connId)) {
          hinted.add(connId);
        }
      }
    }
  }

  return Array.from(hinted);
}

// Track newly unlocked lore nodes and fire events
export function checkLoreUnlocks(): string[] {
  if (typeof window === 'undefined') return [];
  const current = getUnlockedLoreNodes();
  const prevKey = 'lorevault_lore_unlocked';
  // Seed with current on first write to avoid false "new unlock" events for existing collection
  const prev: string[] = getItem(prevKey, current);
  const newUnlocks = current.filter(id => !prev.includes(id));

  if (newUnlocks.length > 0) {
    setItem(prevKey, current);
    for (const nodeId of newUnlocks) {
      const node = LORE_GRAPH.find(n => n.id === nodeId);
      if (node) {
        window.dispatchEvent(new CustomEvent('lore-unlock', { detail: { nodeId, title: node.title, secret: !!node.secret } }));
      }
    }
  } else if (!localStorage.getItem(prevKey)) {
    // First visit — persist baseline so future unlocks are detected correctly
    setItem(prevKey, current);
  }

  return newUnlocks;
}

// ===== Collector Prestige =====

export interface PrestigeState {
  unlocked: boolean;
  level: number;
  unlockedAt: string | null;
  challengesCompleted: string[];
}

const PRESTIGE_KEY = 'lorevault_prestige';

export function getPrestigeState(): PrestigeState {
  return getItem<PrestigeState>(PRESTIGE_KEY, {
    unlocked: false,
    level: 0,
    unlockedAt: null,
    challengesCompleted: [],
  });
}

function setPrestigeState(state: PrestigeState): void {
  setItem(PRESTIGE_KEY, state);
}

export function checkPrestigeUnlock(): boolean {
  const prestige = getPrestigeState();
  if (prestige.unlocked) return false; // already unlocked

  const earned = getEarnedAchievements();
  // All non-prestige achievements earned (33 standard + ghost-finder = 34, excluding collector-prestige itself)
  const allEarned = earned.length >= 34;

  const codexPercent = getCodexCompletionPercent();
  const codexComplete = codexPercent >= 100;

  const owned = getOwnedCards();
  const setsBySlug: Record<string, Set<string>> = {};
  for (const c of owned) {
    if (!setsBySlug[c.setSlug]) setsBySlug[c.setSlug] = new Set();
    setsBySlug[c.setSlug].add(c.character);
  }
  const setsComplete = Object.values(setsBySlug).filter(chars => chars.size >= 20).length;

  if (allEarned && codexComplete && setsComplete >= 4) {
    setPrestigeState({
      unlocked: true,
      level: 1,
      unlockedAt: new Date().toISOString(),
      challengesCompleted: [],
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prestige-unlock'));
    }
    return true;
  }
  return false;
}

export type PrestigeChallenge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const PRESTIGE_CHALLENGES: PrestigeChallenge[] = [
  { id: 'forge-legendary', name: 'Master Forger', description: 'Forge a Legendary card', icon: '🔨' },
  { id: 'all-parallels', name: 'Parallel Collector', description: 'Own all 4 parallel types', icon: '◈' },
  { id: 'ancient-legendary', name: 'Timeless Legend', description: 'Own a Legendary card aged 60+ days', icon: '⏳' },
  { id: 'ghost-collector', name: 'Phantom Keeper', description: 'Own 3+ Ghost cards', icon: '◐' },
  { id: 'hall-apex', name: 'Apex Predator', description: 'Reach top 3 on any leaderboard', icon: '👑' },
  { id: 'max-legacy', name: 'Living Legend', description: 'Own a card with Legacy Score 90+', icon: '✦' },
];

export function checkPrestigeChallenges(): string[] {
  const prestige = getPrestigeState();
  if (!prestige.unlocked) return [];

  const newlyCompleted: string[] = [];
  const completed = new Set(prestige.challengesCompleted);
  const owned = getOwnedCards();

  function tryComplete(id: string, condition: boolean) {
    if (!completed.has(id) && condition) {
      newlyCompleted.push(id);
    }
  }

  // forge-legendary: check forge history for legendary output
  tryComplete('forge-legendary', (() => {
    try {
      const history = JSON.parse(localStorage.getItem('lorevault_forge_history') || '[]');
      return history.some((h: { outputCardId: string }) => {
        const card = [...ALL_CARDS, ...GHOST_CARDS].find(c => c.id === h.outputCardId);
        return card?.scarcity === 'legendary';
      });
    } catch { return false; }
  })());

  // all-parallels: own base + silver + gold + holographic or obsidian
  const parallels = new Set(owned.map(c => c.parallel));
  tryComplete('all-parallels', parallels.has('silver') && parallels.has('gold') && (parallels.has('holographic') || parallels.has('obsidian')));

  // ancient-legendary: legendary card aged 60+ days
  tryComplete('ancient-legendary', (() => {
    const meta = getCardMeta();
    return owned.some(c => {
      if (c.scarcity !== 'legendary') return false;
      const m = meta[c.id];
      if (!m?.acquiredAt) return false;
      const days = Math.floor((Date.now() - new Date(m.acquiredAt).getTime()) / 86400000);
      return days >= 60;
    });
  })());

  // ghost-collector: 3+ ghost cards
  tryComplete('ghost-collector', owned.filter(c => isGhostCard(c.id)).length >= 3);

  // hall-apex: top 3 leaderboard (check stored rank)
  tryComplete('hall-apex', (() => {
    try {
      const rank = JSON.parse(localStorage.getItem('lorevault_hall_rank') || '0');
      return rank > 0 && rank <= 3;
    } catch { return false; }
  })());

  // max-legacy: legacy score 90+
  tryComplete('max-legacy', (() => {
    const meta = getCardMeta();
    return owned.some(c => {
      const m = meta[c.id];
      if (!m) return false;
      const days = m.acquiredAt ? Math.floor((Date.now() - new Date(m.acquiredAt).getTime()) / 86400000) : 0;
      const legacy = Math.min(100, Math.floor((m.history?.length || 0) * 3 + days * 0.5 + (m.battleCount || 0) * 0.8));
      return legacy >= 90;
    });
  })());

  if (newlyCompleted.length > 0) {
    const updated = { ...prestige, challengesCompleted: [...prestige.challengesCompleted, ...newlyCompleted] };
    updated.level = 1 + updated.challengesCompleted.length;
    setPrestigeState(updated);
  }

  return newlyCompleted;
}

// ===== Parallel Transmute =====

const PARALLEL_ORDER = ['base', 'silver', 'gold', 'holographic', 'obsidian'] as const;

export function getNextParallel(current: string): string | null {
  const idx = PARALLEL_ORDER.indexOf(current as typeof PARALLEL_ORDER[number]);
  if (idx === -1 || idx >= PARALLEL_ORDER.length - 1) return null;
  return PARALLEL_ORDER[idx + 1];
}

export function canTransmute(cardIds: string[], owned: Card[]): { valid: boolean; reason?: string } {
  if (cardIds.length !== 3) return { valid: false, reason: 'Select 3 cards' };
  if (new Set(cardIds).size !== 3) return { valid: false, reason: 'Select 3 different cards' };
  const cards = cardIds.map(id => owned.find(c => c.id === id)).filter(Boolean) as Card[];
  if (cards.length !== 3) return { valid: false, reason: 'Cards not found' };

  const character = cards[0].character;
  const parallel = cards[0].parallel;
  const scarcity = cards[0].scarcity;
  if (!cards.every(c => c.character === character)) return { valid: false, reason: 'Must be same character' };
  if (!cards.every(c => c.parallel === parallel)) return { valid: false, reason: 'Must be same parallel' };
  if (!cards.every(c => c.scarcity === scarcity)) return { valid: false, reason: 'Must be same scarcity' };
  if (!getNextParallel(parallel)) return { valid: false, reason: 'Already max parallel' };

  return { valid: true };
}

export interface TransmuteEntry {
  id: string;
  inputCardIds: string[];
  outputCardId: string;
  date: string;
  fromParallel: string;
  toParallel: string;
}

export function getTransmuteHistory(): TransmuteEntry[] {
  return getItem<TransmuteEntry[]>('lorevault_transmute_history', []);
}

export function addTransmuteEntry(entry: TransmuteEntry): void {
  const history = getTransmuteHistory();
  history.unshift(entry);
  setItem('lorevault_transmute_history', history.slice(0, 20));
}

// ===== Card Burn =====

export interface BurnEntry {
  cardId: string;
  character: string;
  scarcity: string;
  xpGained: number;
  date: string;
}

export function getBurnHistory(): BurnEntry[] {
  return getItem<BurnEntry[]>('lorevault_burn_history', []);
}

export function burnCard(cardId: string): BurnEntry | null {
  const owned = getOwnedCards();
  const card = owned.find(c => c.id === cardId);
  if (!card) return null;

  // XP value: 2× normal pack pull XP based on scarcity
  const XP_BY_SCARCITY: Record<string, number> = {
    common: 20,
    uncommon: 50,
    rare: 100,
    epic: 200,
    legendary: 500,
  };
  const xpGained = (XP_BY_SCARCITY[card.scarcity] || 20) * 2;

  // Remove from collection
  removeOwnedCards([cardId]);

  // Record burn in card meta history
  const meta = getCardMeta();
  if (meta[cardId]) {
    meta[cardId].history.push({
      type: 'traded' as const,
      date: new Date().toISOString(),
      detail: 'burned',
    });
    setItem('lorevault_card_meta', meta);
  }

  // Grant XP
  addXP(xpGained);

  // Record burn
  const entry: BurnEntry = {
    cardId,
    character: card.character,
    scarcity: card.scarcity,
    xpGained,
    date: new Date().toISOString(),
  };
  const history = getBurnHistory();
  history.unshift(entry);
  setItem('lorevault_burn_history', history.slice(0, 50));

  return entry;
}

// ===== Population Decay Visual =====

export function getPopulationDecayTier(card: Card): 'bright' | 'normal' | 'faded' {
  const popData = getPopulationData(card);
  if (!popData || card.scarcity === 'common') return 'normal';

  const pct = card.serialNumber / popData.totalMinted;
  if (pct <= 0.25) return 'bright'; // Low serial — brighter
  if (pct >= 0.75) return 'faded'; // High serial — desaturated
  return 'normal';
}

// ===== Daily Free Pack =====

export function getDailyPackState(): { available: boolean; nextResetMs: number } {
  if (typeof window === 'undefined') return { available: false, nextResetMs: 0 };
  const lastClaim = getItem<string>('lorevault_daily_pack', '');
  const now = new Date();
  const todayUTC = now.toISOString().slice(0, 10);

  if (lastClaim === todayUTC) {
    // Already claimed today — compute ms until midnight UTC
    const tomorrow = new Date(todayUTC);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    return { available: false, nextResetMs: tomorrow.getTime() - now.getTime() };
  }

  return { available: true, nextResetMs: 0 };
}

export function claimDailyPack(): boolean {
  if (typeof window === 'undefined') return false;
  const todayUTC = new Date().toISOString().slice(0, 10);
  const lastClaim = getItem<string>('lorevault_daily_pack', '');
  if (lastClaim === todayUTC) return false;

  setItem('lorevault_daily_pack', todayUTC);
  return true;
}

// ===== Daily Mission Progress Helper =====

export function progressDailyMission(missionId: string, amount: number = 1) {
  // Map generic mission IDs to the existing daily mission IDs
  const idMap: Record<string, string> = {
    'open-pack': 'daily-packs',
    'win-battle': 'daily-battle',
    'play-trivia': 'daily-trivia',
  };
  const mapped = idMap[missionId] || missionId;
  const missions = getDailyMissions();
  const mission = missions.find(m => m.id === mapped);
  if (mission && !mission.completed) {
    updateDailyMission(mapped, mission.progress + amount);
  }
}

// ===== Login Calendar =====

export interface LoginCalendarState {
  weekStart: string; // ISO date of the Monday this week started
  days: boolean[]; // 7 booleans, index 0 = day 1
  currentDay: number; // 0-6, which day of the streak we're on
  claimedToday: boolean;
}

export const LOGIN_REWARDS: { day: number; label: string; icon: string; xp: number }[] = [
  { day: 1, label: '50 XP', icon: '✨', xp: 50 },
  { day: 2, label: '100 XP', icon: '⭐', xp: 100 },
  { day: 3, label: '200 XP', icon: '💫', xp: 200 },
  { day: 4, label: 'Rare Card', icon: '🃏', xp: 150 },
  { day: 5, label: '300 XP', icon: '🔥', xp: 300 },
  { day: 6, label: 'Badge', icon: '🏆', xp: 250 },
  { day: 7, label: 'Legendary Pack', icon: '👑', xp: 500 },
];

export function getLoginCalendar(): LoginCalendarState {
  if (typeof window === 'undefined') return { weekStart: '', days: Array(7).fill(false), currentDay: 0, claimedToday: false };
  // Ensure streak is current before reading it
  recordVisit();
  const todayUTC = new Date().toISOString().slice(0, 10);
  const streak = getStreak();
  let state = getItem<LoginCalendarState>('lorevault_login_calendar', {
    weekStart: todayUTC,
    days: Array(7).fill(false),
    currentDay: 0,
    claimedToday: false,
  });

  // If streak is 0 or reset, start fresh and persist
  if (streak === 0 || (streak === 1 && !state.claimedToday)) {
    state = { weekStart: todayUTC, days: Array(7).fill(false), currentDay: 0, claimedToday: false };
    setItem('lorevault_login_calendar', state);
  }

  // Check if already claimed today
  const lastClaimDate = getItem<string>('lorevault_login_calendar_date', '');
  if (lastClaimDate === todayUTC) {
    state.claimedToday = true;
  } else {
    state.claimedToday = false;
  }

  return state;
}

export function claimLoginDay(): { reward: typeof LOGIN_REWARDS[number]; newState: LoginCalendarState } | null {
  if (typeof window === 'undefined') return null;
  const todayUTC = new Date().toISOString().slice(0, 10);
  const lastClaimDate = getItem<string>('lorevault_login_calendar_date', '');
  if (lastClaimDate === todayUTC) return null; // Already claimed

  const state = getLoginCalendar();
  if (state.currentDay === 7) {
    // Reset calendar for next cycle
    state.days = Array(7).fill(false);
    state.currentDay = 0;
    state.weekStart = todayUTC;
  }

  const dayIndex = state.currentDay;
  state.days[dayIndex] = true;
  state.currentDay = dayIndex + 1;
  state.claimedToday = true;

  const reward = LOGIN_REWARDS[dayIndex];
  addXP(reward.xp);

  setItem('lorevault_login_calendar', state);
  setItem('lorevault_login_calendar_date', todayUTC);

  return { reward, newState: state };
}

// ===== Monthly Collector Pass =====

export interface CollectorPassTier {
  tier: number;
  xpRequired: number;
  freeReward: { label: string; icon: string };
  premiumReward?: { label: string; icon: string };
}

export const COLLECTOR_PASS_TIERS: CollectorPassTier[] = Array.from({ length: 30 }, (_, i) => {
  const tier = i + 1;
  const xpRequired = tier * 150; // 150, 300, 450, ... 4500
  const freeRewards = [
    { label: '25 XP', icon: '✨' }, { label: '50 XP', icon: '⭐' }, { label: 'Common Card', icon: '🃏' },
    { label: '75 XP', icon: '💫' }, { label: 'Uncommon Card', icon: '🎴' }, { label: '100 XP', icon: '🔥' },
    { label: '150 XP', icon: '💎' }, { label: 'Rare Card', icon: '🃏' }, { label: '200 XP', icon: '⚡' },
    { label: 'Pack Credit', icon: '📦' },
  ];
  const premiumRewards = [
    null, { label: 'Silver Parallel', icon: '🥈' }, null,
    { label: 'Gold Parallel', icon: '🥇' }, null, { label: 'Exclusive Badge', icon: '🏅' },
    null, null, { label: 'Holo Parallel', icon: '🌈' }, { label: 'Epic Card', icon: '💜' },
  ];
  return {
    tier,
    xpRequired,
    freeReward: freeRewards[(tier - 1) % 10],
    premiumReward: tier === 30
      ? { label: 'Legendary Card', icon: '👑' }
      : premiumRewards[(tier - 1) % 10] || undefined,
  };
});

export interface CollectorPassState {
  monthKey: string; // "2026-04"
  xpEarned: number;
  currentTier: number;
  claimedTiers: number[];
}

export function getCollectorPass(): CollectorPassState {
  if (typeof window === 'undefined') return { monthKey: '', xpEarned: 0, currentTier: 0, claimedTiers: [] };
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  let state = getItem<CollectorPassState>('lorevault_collector_pass', {
    monthKey,
    xpEarned: 0,
    currentTier: 0,
    claimedTiers: [],
  });

  // Monthly reset
  if (state.monthKey !== monthKey) {
    state = { monthKey, xpEarned: 0, currentTier: 0, claimedTiers: [] };
    setItem('lorevault_collector_pass', state);
  }

  // Derive current tier from total XP
  let tier = 0;
  let totalRequired = 0;
  for (const t of COLLECTOR_PASS_TIERS) {
    totalRequired += t.xpRequired;
    if (state.xpEarned >= totalRequired) tier = t.tier;
    else break;
  }
  if (state.currentTier !== tier) {
    state.currentTier = tier;
    setItem('lorevault_collector_pass', state);
  }

  return state;
}

export function addPassXP(amount: number) {
  if (typeof window === 'undefined') return;
  const state = getCollectorPass();
  state.xpEarned += amount;
  // Recalculate tier
  let tier = 0;
  let totalRequired = 0;
  for (const t of COLLECTOR_PASS_TIERS) {
    totalRequired += t.xpRequired;
    if (state.xpEarned >= totalRequired) tier = t.tier;
    else break;
  }
  state.currentTier = tier;
  setItem('lorevault_collector_pass', state);
}

export function claimPassTier(tier: number): boolean {
  if (typeof window === 'undefined') return false;
  const state = getCollectorPass();
  if (state.currentTier < tier || state.claimedTiers.includes(tier)) return false;
  state.claimedTiers.push(tier);
  setItem('lorevault_collector_pass', state);
  return true;
}

// ===== Weekly Challenges =====

export interface WeeklyChallenge {
  id: string;
  description: string;
  target: number;
  progress: number;
  reward: string;
  completed: boolean;
  icon: string;
}

const WEEKLY_CHALLENGE_POOL = [
  { id: 'win-5-battles', description: 'Win 5 battles', target: 5, reward: 'Bonus Pack', icon: '⚔️' },
  { id: 'collect-3-set', description: 'Collect 3 cards from one set', target: 3, reward: 'Rare Pack', icon: '📚' },
  { id: 'codex-50', description: 'Reach 50% codex completion', target: 50, reward: 'XP Boost', icon: '📖' },
  { id: 'open-10-packs', description: 'Open 10 packs', target: 10, reward: 'Epic Pack', icon: '📦' },
  { id: 'forge-3', description: 'Forge 3 cards', target: 3, reward: 'Gold Parallel', icon: '🔨' },
  { id: 'trivia-5000', description: 'Score 5000+ in trivia', target: 5000, reward: 'Badge', icon: '🧠' },
  { id: 'burn-5', description: 'Burn 5 cards', target: 5, reward: 'Legendary Pack', icon: '🔥' },
  { id: 'earn-500xp', description: 'Earn 500 XP', target: 500, reward: 'Bonus Pack', icon: '⭐' },
];

function getWeekKey(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

export function getWeeklyChallenges(): WeeklyChallenge[] {
  if (typeof window === 'undefined') return [];
  const weekKey = getWeekKey();
  const stateKey = 'lorevault_weekly_challenges';
  const stored = getItem<{ weekKey: string; challenges: WeeklyChallenge[] }>(stateKey, { weekKey: '', challenges: [] });

  if (stored.weekKey !== weekKey) {
    // Generate 3 challenges for this week from pool using week-seeded selection
    let seed = 0;
    for (let i = 0; i < weekKey.length; i++) seed = ((seed << 5) - seed + weekKey.charCodeAt(i)) | 0;
    const pool = [...WEEKLY_CHALLENGE_POOL];
    const selected: WeeklyChallenge[] = [];
    for (let i = 0; i < 3 && pool.length > 0; i++) {
      seed = (seed * 16807) % 2147483647;
      const idx = Math.abs(seed) % pool.length;
      const ch = pool.splice(idx, 1)[0];
      selected.push({ ...ch, progress: 0, completed: false });
    }
    const newState = { weekKey, challenges: selected };
    setItem(stateKey, newState);
    return selected;
  }

  return stored.challenges;
}

export function updateWeeklyChallenge(challengeId: string, progress: number) {
  if (typeof window === 'undefined') return;
  const weekKey = getWeekKey();
  const stateKey = 'lorevault_weekly_challenges';
  const stored = getItem<{ weekKey: string; challenges: WeeklyChallenge[] }>(stateKey, { weekKey, challenges: [] });
  if (stored.weekKey !== weekKey) return;
  const ch = stored.challenges.find(c => c.id === challengeId);
  if (ch) {
    ch.progress = Math.min(progress, ch.target);
    ch.completed = ch.progress >= ch.target;
    setItem(stateKey, stored);
  }
}

// ===== Collector Milestones =====

export interface CollectorMilestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  titlePrefix: string; // e.g., "Vault Keeper" prefix shown on profile
  check: () => boolean;
}

export function getCollectorMilestones(): { milestone: CollectorMilestone; earned: boolean }[] {
  if (typeof window === 'undefined') return [];

  const owned = getOwnedCards();
  const xp = getXP();
  const level = getCollectorLevel();
  const forgeHistory = getItem<unknown[]>('lorevault_forge_history', []);
  const burnHistory = getBurnHistory();
  const streak = getStreak();

  const milestones: CollectorMilestone[] = [
    { id: 'century', title: 'Century', description: 'Own 100 cards', icon: '💯', titlePrefix: 'Centurion', check: () => owned.length >= 100 },
    { id: 'vault-keeper', title: 'Vault Keeper', description: 'Own 200 cards', icon: '🏛️', titlePrefix: 'Vault Keeper', check: () => owned.length >= 200 },
    { id: 'xp-king', title: 'XP Sovereign', description: 'Reach Level 20', icon: '👑', titlePrefix: 'Sovereign', check: () => level.level >= 20 },
    { id: 'forge-master', title: 'Forge Master', description: 'Forge 10 cards', icon: '🔨', titlePrefix: 'Forge Master', check: () => forgeHistory.length >= 10 },
    { id: 'pyromaniac', title: 'Pyromaniac', description: 'Burn 10 cards', icon: '🔥', titlePrefix: 'Pyromaniac', check: () => burnHistory.length >= 10 },
    { id: 'dedicated', title: 'Dedicated', description: '14-day login streak', icon: '📅', titlePrefix: 'Dedicated', check: () => streak >= 14 },
    { id: 'legendary-hoarder', title: 'Legendary Hoarder', description: 'Own 10 Legendary cards', icon: '⚡', titlePrefix: 'Legendary', check: () => owned.filter(c => c.scarcity === 'legendary').length >= 10 },
    { id: 'set-collector', title: 'Set Collector', description: 'Complete 3 sets', icon: '📚', titlePrefix: 'Set Collector', check: () => {
      const sets = new Map<string, Set<string>>();
      for (const c of owned) {
        if (!sets.has(c.setSlug)) sets.set(c.setSlug, new Set());
        sets.get(c.setSlug)!.add(c.character);
      }
      let complete = 0;
      for (const chars of sets.values()) if (chars.size >= 15) complete++;
      return complete >= 3;
    }},
    { id: 'all-scarcity', title: 'Full Spectrum', description: 'Own every scarcity tier', icon: '🌈', titlePrefix: 'Prismatic', check: () => {
      const tiers = new Set(owned.map(c => c.scarcity));
      return tiers.size >= 5;
    }},
    { id: 'marathon', title: 'Marathon', description: '30-day login streak', icon: '🏃', titlePrefix: 'Marathon', check: () => streak >= 30 },
  ];

  return milestones.map(m => ({ milestone: m, earned: m.check() }));
}

export function getActiveTitlePrefix(): string {
  if (typeof window === 'undefined') return '';
  return getItem<string>('lorevault_title_prefix', '');
}

export function setActiveTitlePrefix(prefix: string) {
  if (typeof window === 'undefined') return;
  setItem('lorevault_title_prefix', prefix);
}

// ===== Featured Set Event (Weekly Rotation) =====

const SET_ROTATION = ['baker-street', 'enchanted-kingdom', 'wonderland', 'gothic-horror', 'olympus', 'asgard'];

export interface FeaturedSetEvent {
  setSlug: string;
  setName: string;
  setIcon: string;
  weekKey: string;
  xpMultiplier: number;
  endsAt: string; // ISO date of next Monday
}

export function getFeaturedSetEvent(): FeaturedSetEvent | null {
  if (typeof window === 'undefined') return null;
  const weekKey = getWeekKey();
  // Deterministic rotation: hash weekKey to pick set index
  let hash = 0;
  for (let i = 0; i < weekKey.length; i++) hash = ((hash << 5) - hash + weekKey.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % SET_ROTATION.length;
  const slug = SET_ROTATION[idx];

  // Calculate next Monday for countdown
  const now = new Date();
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  const setNames: Record<string, { name: string; icon: string }> = {
    'baker-street': { name: 'Baker Street Files', icon: '🔍' },
    'enchanted-kingdom': { name: 'The Enchanted Kingdom', icon: '👑' },
    'wonderland': { name: 'Wonderland Descending', icon: '🐇' },
    'gothic-horror': { name: 'The Castle of Otranto', icon: '🦇' },
    'olympus': { name: 'Olympus Rising', icon: '⚡' },
    'asgard': { name: 'Asgard Unleashed', icon: '❄️' },
  };

  const info = setNames[slug] || { name: slug, icon: '📦' };
  return {
    setSlug: slug,
    setName: info.name,
    setIcon: info.icon,
    weekKey,
    xpMultiplier: 2,
    endsAt: nextMonday.toISOString(),
  };
}

export function getEventBadges(): string[] {
  if (typeof window === 'undefined') return [];
  return getItem<string[]>('lorevault_event_badges', []);
}

export function earnEventBadge(weekKey: string, setSlug: string): boolean {
  if (typeof window === 'undefined') return false;
  const badges = getEventBadges();
  const badgeId = `${weekKey}-${setSlug}`;
  if (badges.includes(badgeId)) return false;
  badges.push(badgeId);
  setItem('lorevault_event_badges', badges);
  return true;
}

// ===== 7-Day Challenge Chain =====

export interface ChallengeChainDay {
  day: number; // 1-7
  description: string;
  icon: string;
  completed: boolean;
}

export interface ChallengeChainState {
  weekKey: string;
  days: ChallengeChainDay[];
  allComplete: boolean;
  rewardClaimed: boolean;
}

const CHAIN_DAYS: { description: string; icon: string }[] = [
  { description: 'Open 2 packs', icon: '📦' },
  { description: 'Win a battle', icon: '⚔️' },
  { description: 'Collect 3 new cards', icon: '🃏' },
  { description: 'Forge a card', icon: '🔨' },
  { description: 'Complete a trivia round', icon: '🧠' },
  { description: 'Earn 200 XP', icon: '⭐' },
  { description: 'Claim all daily rewards', icon: '🎁' },
];

export function getChallengeChain(): ChallengeChainState {
  if (typeof window === 'undefined') return { weekKey: '', days: [], allComplete: false, rewardClaimed: false };
  const weekKey = getWeekKey();
  const stored = getItem<ChallengeChainState>('lorevault_challenge_chain', {
    weekKey: '',
    days: [],
    allComplete: false,
    rewardClaimed: false,
  });

  if (stored.weekKey !== weekKey) {
    const fresh: ChallengeChainState = {
      weekKey,
      days: CHAIN_DAYS.map((d, i) => ({ day: i + 1, description: d.description, icon: d.icon, completed: false })),
      allComplete: false,
      rewardClaimed: false,
    };
    setItem('lorevault_challenge_chain', fresh);
    return fresh;
  }

  return stored;
}

export function completeChallengeChainDay(day: number): boolean {
  if (typeof window === 'undefined') return false;
  const state = getChallengeChain();
  const d = state.days.find(d => d.day === day);
  if (!d || d.completed) return false;
  // Can only complete current day (previous must be done)
  if (day > 1 && !state.days.find(d => d.day === day - 1)?.completed) return false;
  d.completed = true;
  state.allComplete = state.days.every(d => d.completed);
  setItem('lorevault_challenge_chain', state);
  return true;
}

export function claimChainReward(): boolean {
  if (typeof window === 'undefined') return false;
  const state = getChallengeChain();
  if (!state.allComplete || state.rewardClaimed) return false;
  state.rewardClaimed = true;
  setItem('lorevault_challenge_chain', state);
  addPackCredits(1);
  addXP(500);
  addPassXP(500);
  return true;
}
