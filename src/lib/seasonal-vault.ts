'use client';

// Seasonal Vault — Time-limited seasons with exclusive cards and forge mechanics
// Season state persisted in localStorage with start date on first visit

const SEASON_KEY = 'lorevault_season';
const FORGE_HISTORY_KEY = 'lorevault_forge_history';

export interface SeasonConfig {
  id: string;
  name: string;
  subtitle: string;
  durationDays: number;
  exclusiveCardIds: string[];
  forgeDiscount: boolean; // 2 cards instead of 3 during active season
  icon: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface SeasonState {
  seasonId: string;
  startDate: string; // ISO date of first visit
}

export interface ForgeHistoryEntry {
  id: string;
  inputCardIds: string[];
  outputCardId: string;
  date: string;
  seasonal: boolean;
}

// ===== Season Configuration =====
export const CURRENT_SEASON: SeasonConfig = {
  id: 'ragnarok-s1',
  name: 'Ragnarok',
  subtitle: 'Season 1: Twilight of the Gods',
  durationDays: 30,
  exclusiveCardIds: ['seasonal-ragnarok-odin', 'seasonal-fenrir-unbound', 'seasonal-twilight-valkyrie'],
  forgeDiscount: true,
  icon: '🔥',
  gradientFrom: '#dc2626',
  gradientTo: '#f97316',
};

// ===== Season State =====
export function getSeasonState(): SeasonState {
  if (typeof window === 'undefined') {
    return { seasonId: CURRENT_SEASON.id, startDate: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(SEASON_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  // First visit — start season now
  const state: SeasonState = {
    seasonId: CURRENT_SEASON.id,
    startDate: new Date().toISOString(),
  };
  localStorage.setItem(SEASON_KEY, JSON.stringify(state));
  return state;
}

export function getSeasonEndDate(): Date {
  const state = getSeasonState();
  const start = new Date(state.startDate);
  return new Date(start.getTime() + CURRENT_SEASON.durationDays * 24 * 60 * 60 * 1000);
}

export function isSeasonActive(): boolean {
  if (typeof window === 'undefined') return true; // Assume active during SSR
  return new Date() < getSeasonEndDate();
}

export function getSeasonTimeRemaining(): { days: number; hours: number; minutes: number; seconds: number; total: number } {
  const end = getSeasonEndDate();
  const total = Math.max(0, end.getTime() - Date.now());
  const days = Math.floor(total / (24 * 60 * 60 * 1000));
  const hours = Math.floor((total % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((total % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((total % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds, total };
}

// ===== Forge Mechanics =====
import { Scarcity } from '@/data/types';

const SCARCITY_ORDER: Scarcity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export function getNextRarity(current: Scarcity): Scarcity | null {
  const idx = SCARCITY_ORDER.indexOf(current);
  if (idx < 0 || idx >= SCARCITY_ORDER.length - 1) return null;
  return SCARCITY_ORDER[idx + 1];
}

export function getForgeCost(): number {
  return isSeasonActive() && CURRENT_SEASON.forgeDiscount ? 2 : 3;
}

export function canForge(cardIds: string[], cards: { id: string; scarcity: Scarcity }[]): { valid: boolean; reason?: string } {
  const cost = getForgeCost();
  if (cardIds.length !== cost) return { valid: false, reason: `Select exactly ${cost} cards` };

  const selected = cards.filter(c => cardIds.includes(c.id));
  if (selected.length !== cost) return { valid: false, reason: 'Selected cards not found' };

  const scarcities = new Set(selected.map(c => c.scarcity));
  if (scarcities.size > 1) return { valid: false, reason: 'All cards must be the same rarity' };

  const scarcity = selected[0].scarcity;
  if (scarcity === 'legendary') return { valid: false, reason: 'Cannot forge beyond Legendary' };

  return { valid: true };
}

// ===== Forge History =====
export function getForgeHistory(): ForgeHistoryEntry[] {
  try {
    const raw = localStorage.getItem(FORGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addForgeEntry(entry: ForgeHistoryEntry): void {
  const history = getForgeHistory();
  history.push(entry);
  localStorage.setItem(FORGE_HISTORY_KEY, JSON.stringify(history));
}
