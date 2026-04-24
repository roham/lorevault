'use client';

import { Card, SCARCITY_CONFIG } from '@/data/types';
import { getCardMeta, getPopulationData, getAgingTiers, type PopulationData, type AgingTiers } from '@/lib/store';

// ===== Seeded random for deterministic curves =====
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ===== Value History Sparkline =====

export interface ValuePoint {
  day: number;
  value: number;
}

const SCARCITY_BASE: Record<string, number> = {
  legendary: 500,
  epic: 120,
  rare: 40,
  uncommon: 12,
  common: 3,
};

const SCARCITY_TREND: Record<string, number> = {
  legendary: 0.008,   // trending up
  epic: 0.004,
  rare: 0.001,
  uncommon: -0.001,    // slight decline
  common: -0.002,
};

export function generateValueHistory(card: Card, days: number = 90): ValuePoint[] {
  const rand = seeded(hashCode(card.id) + 7777);
  const base = SCARCITY_BASE[card.scarcity] || 3;
  const trend = SCARCITY_TREND[card.scarcity] || 0;
  const popData = getPopulationData(card);

  // Population scarcity multiplier: fewer minted = higher base
  const popMultiplier = Math.max(0.5, Math.min(3, 500 / popData.totalMinted));

  const points: ValuePoint[] = [];
  let value = base * popMultiplier;

  for (let d = 0; d < days; d++) {
    // Daily noise: ±5-15% depending on scarcity
    const volatility = card.scarcity === 'legendary' ? 0.05 : card.scarcity === 'common' ? 0.15 : 0.08;
    const noise = (rand() - 0.5) * 2 * volatility;

    // Apply trend + noise
    value = value * (1 + trend + noise);

    // Clamp to reasonable bounds
    value = Math.max(base * popMultiplier * 0.3, value);

    points.push({
      day: d,
      value: Math.round(value * 100) / 100,
    });
  }

  return points;
}

// ===== Legacy Score =====

export interface LegacyData {
  score: number;
  tier: 'pristine' | 'storied' | 'legendary' | 'mythic';
  breakdown: {
    age: number;       // 0-30 points from days held
    battles: number;   // 0-30 points from battle count
    lineage: number;   // 0-20 points from event count
    rarity: number;    // 0-20 points from scarcity + population
  };
}

const LEGACY_TIERS = [
  { name: 'pristine' as const, threshold: 0, color: '#c0c0c0', label: 'Pristine' },
  { name: 'storied' as const, threshold: 25, color: '#3b82f6', label: 'Storied' },
  { name: 'legendary' as const, threshold: 55, color: '#f59e0b', label: 'Legendary Legacy' },
  { name: 'mythic' as const, threshold: 80, color: '#a855f7', label: 'Mythic Legacy' },
];

export function getLegacyTierConfig(tier: LegacyData['tier']) {
  return LEGACY_TIERS.find(t => t.name === tier)!;
}

export function computeLegacyScore(cardId: string, card: Card): LegacyData {
  const meta = getCardMeta();
  const cardMeta = meta[cardId];
  const popData = getPopulationData(card);

  // Age score: 0-30 points. 1 point per day held, maxes at 30
  let ageDays = 0;
  if (cardMeta?.acquiredAt) {
    ageDays = Math.floor((Date.now() - new Date(cardMeta.acquiredAt).getTime()) / 86400000);
  }
  const ageScore = Math.min(30, ageDays);

  // Battle score: 0-30 points. Logarithmic — first battles matter most
  const battleCount = cardMeta?.battleCount || 0;
  const battleScore = Math.min(30, Math.round(Math.log2(battleCount + 1) * 5));

  // Lineage score: 0-20 points. 2 points per event type seen
  const events = cardMeta?.history || [];
  const eventTypes = new Set(events.map((e: { type: string }) => e.type));
  const lineageScore = Math.min(20, eventTypes.size * 4 + Math.min(8, Math.floor(events.length / 3)));

  // Rarity score: 0-20 points. Based on scarcity + population scarcity
  const scarcityPoints: Record<string, number> = {
    legendary: 16, epic: 12, rare: 8, uncommon: 4, common: 2,
  };
  const popBonus = Math.min(4, Math.round(4 * (1 - popData.totalMinted / 10000)));
  const rarityScore = (scarcityPoints[card.scarcity] || 2) + Math.max(0, popBonus);

  const total = ageScore + battleScore + lineageScore + rarityScore;

  let tier: LegacyData['tier'] = 'pristine';
  for (const t of LEGACY_TIERS) {
    if (total >= t.threshold) tier = t.name;
  }

  return {
    score: total,
    tier,
    breakdown: {
      age: ageScore,
      battles: battleScore,
      lineage: lineageScore,
      rarity: rarityScore,
    },
  };
}
