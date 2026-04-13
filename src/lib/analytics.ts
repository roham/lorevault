'use client';

import { Card, Scarcity, SCARCITY_CONFIG } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { getCardMarketData, CardMarketData } from '@/lib/marketData';

// ===== Portfolio Performance =====

export interface PortfolioSnapshot {
  totalValue: number;
  change24h: number;
  change24hPct: number;
  change7d: number;
  change7dPct: number;
  change30d: number;
  change30dPct: number;
  cardCount: number;
  avgCardValue: number;
  highestValue: Card | null;
  lowestValue: Card | null;
}

export function getPortfolioSnapshot(ownedIds: string[]): PortfolioSnapshot {
  const owned = new Set(ownedIds);
  let totalValue = 0;
  let prevValue24h = 0;
  let prevValue7d = 0;
  let prevValue30d = 0;
  let highCard: { card: Card; price: number } | null = null;
  let lowCard: { card: Card; price: number } | null = null;

  for (const card of ALL_CARDS) {
    if (!owned.has(card.id)) continue;
    const data = getCardMarketData(card.id);
    if (!data) continue;

    const cur = data.currentPrice;
    totalValue += cur;
    prevValue24h += cur / (1 + data.change24h / 100);
    prevValue7d += cur / (1 + data.change7d / 100);
    prevValue30d += cur / (1 + data.change30d / 100);

    if (!highCard || cur > highCard.price) highCard = { card, price: cur };
    if (!lowCard || cur < lowCard.price) lowCard = { card, price: cur };
  }

  const count = ownedIds.length;

  return {
    totalValue: round(totalValue),
    change24h: round(totalValue - prevValue24h),
    change24hPct: round(prevValue24h > 0 ? ((totalValue - prevValue24h) / prevValue24h) * 100 : 0),
    change7d: round(totalValue - prevValue7d),
    change7dPct: round(prevValue7d > 0 ? ((totalValue - prevValue7d) / prevValue7d) * 100 : 0),
    change30d: round(totalValue - prevValue30d),
    change30dPct: round(prevValue30d > 0 ? ((totalValue - prevValue30d) / prevValue30d) * 100 : 0),
    cardCount: count,
    avgCardValue: round(count > 0 ? totalValue / count : 0),
    highestValue: highCard?.card || null,
    lowestValue: lowCard?.card || null,
  };
}

// ===== Performance Attribution =====

export interface SetPerformance {
  setSlug: string;
  setName: string;
  setIcon: string;
  valueChange7d: number;
  pctOfGains: number;
  cardCount: number;
  topMover: { card: Card; change: number } | null;
}

export function getPerformanceAttribution(ownedIds: string[]): SetPerformance[] {
  const owned = new Set(ownedIds);
  const setChanges: Record<string, { change: number; count: number; topMover: { card: Card; change: number } | null }> = {};
  let totalChange = 0;

  for (const card of ALL_CARDS) {
    if (!owned.has(card.id)) continue;
    const data = getCardMarketData(card.id);
    if (!data) continue;

    const change7d = data.currentPrice - (data.currentPrice / (1 + data.change7d / 100));
    if (!setChanges[card.setSlug]) {
      setChanges[card.setSlug] = { change: 0, count: 0, topMover: null };
    }
    setChanges[card.setSlug].change += change7d;
    setChanges[card.setSlug].count++;
    totalChange += change7d;

    const abs = Math.abs(change7d);
    if (!setChanges[card.setSlug].topMover || abs > Math.abs(setChanges[card.setSlug].topMover!.change)) {
      setChanges[card.setSlug].topMover = { card, change: change7d };
    }
  }

  return SETS.map(s => {
    const entry = setChanges[s.slug] || { change: 0, count: 0, topMover: null };
    return {
      setSlug: s.slug,
      setName: s.name,
      setIcon: s.icon,
      valueChange7d: round(entry.change),
      pctOfGains: totalChange !== 0 ? round((entry.change / Math.abs(totalChange)) * 100) : 0,
      cardCount: entry.count,
      topMover: entry.topMover,
    };
  }).sort((a, b) => b.valueChange7d - a.valueChange7d);
}

// ===== Diversification Analysis =====

export interface DiversificationData {
  setSlug: string;
  setName: string;
  setIcon: string;
  valuePct: number;
  cardPct: number;
  totalValue: number;
}

export function getDiversificationData(ownedIds: string[]): DiversificationData[] {
  const owned = new Set(ownedIds);
  const setValues: Record<string, { value: number; count: number }> = {};
  let totalValue = 0;
  let totalCount = 0;

  for (const card of ALL_CARDS) {
    if (!owned.has(card.id)) continue;
    const data = getCardMarketData(card.id);
    if (!data) continue;

    if (!setValues[card.setSlug]) setValues[card.setSlug] = { value: 0, count: 0 };
    setValues[card.setSlug].value += data.currentPrice;
    setValues[card.setSlug].count++;
    totalValue += data.currentPrice;
    totalCount++;
  }

  return SETS.map(s => {
    const entry = setValues[s.slug] || { value: 0, count: 0 };
    return {
      setSlug: s.slug,
      setName: s.name,
      setIcon: s.icon,
      valuePct: totalValue > 0 ? round((entry.value / totalValue) * 100) : 0,
      cardPct: totalCount > 0 ? round((entry.count / totalCount) * 100) : 0,
      totalValue: round(entry.value),
    };
  }).filter(d => d.totalValue > 0);
}

// ===== Completion Velocity =====

export interface CompletionVelocity {
  setSlug: string;
  setName: string;
  setIcon: string;
  owned: number;
  total: number;
  pct: number;
  estimatedDaysToComplete: number | null;
  costToComplete: number;
  cheapestMissing: { card: Card; price: number } | null;
  missingCount: number;
}

export function getCompletionVelocity(ownedIds: string[]): CompletionVelocity[] {
  const owned = new Set(ownedIds);

  return SETS.map(s => {
    const setCards = ALL_CARDS.filter(c => c.setSlug === s.slug);
    const ownedInSet = setCards.filter(c => owned.has(c.id));
    const missing = setCards.filter(c => !owned.has(c.id));
    const missingListed = missing.filter(c => c.listed).sort((a, b) => a.price - b.price);
    const costToComplete = missingListed.reduce((sum, c) => {
      const data = getCardMarketData(c.id);
      return sum + (data?.currentPrice || c.price);
    }, 0);

    // Estimate pace: assume 1 card per 2 days on average (rough mock)
    const pace = 0.5; // cards/day
    const estimatedDays = missing.length > 0 ? Math.ceil(missing.length / pace) : null;

    return {
      setSlug: s.slug,
      setName: s.name,
      setIcon: s.icon,
      owned: ownedInSet.length,
      total: setCards.length,
      pct: Math.round((ownedInSet.length / setCards.length) * 100),
      estimatedDaysToComplete: estimatedDays,
      costToComplete: round(costToComplete),
      cheapestMissing: missingListed[0] ? { card: missingListed[0], price: round(getCardMarketData(missingListed[0].id)?.currentPrice || missingListed[0].price) } : null,
      missingCount: missing.length,
    };
  }).filter(v => v.owned > 0)
    .sort((a, b) => b.pct - a.pct);
}

// ===== Price Heatmap =====

export interface HeatmapCell {
  card: Card;
  currentPrice: number;
  change7d: number;
  volatility: 'HIGH' | 'LOW' | 'STABLE';
  belowAvg: boolean; // below 30d moving average
}

export function getPriceHeatmap(ownedIds: string[]): HeatmapCell[] {
  const owned = new Set(ownedIds);

  return ALL_CARDS
    .filter(c => owned.has(c.id))
    .map(card => {
      const data = getCardMarketData(card.id);
      if (!data) return null;

      // Volatility: based on price history variance
      const prices = data.priceHistory30d.map(p => p.price);
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      const variance = prices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / prices.length;
      const cv = avg > 0 ? Math.sqrt(variance) / avg : 0; // coefficient of variation

      const volatility: 'HIGH' | 'LOW' | 'STABLE' = cv > 0.15 ? 'HIGH' : cv > 0.06 ? 'STABLE' : 'LOW';
      const belowAvg = data.currentPrice < data.avgPrice30d;

      return {
        card,
        currentPrice: round(data.currentPrice),
        change7d: round(data.change7d),
        volatility,
        belowAvg,
      };
    })
    .filter((c): c is HeatmapCell => c !== null)
    .sort((a, b) => b.change7d - a.change7d);
}

// ===== Duplicate & Trade Optimizer =====

export interface DuplicateEntry {
  card: Card;
  count: number;
  tradeableCount: number;
  unitValue: number;
  totalTradeValue: number;
}

export interface TradeRecommendation {
  sell: { card: Card; count: number; revenue: number }[];
  buy: { card: Card; cost: number; reason: string }[];
  netProfit: number;
}

export function getDuplicateAnalysis(ownedIds: string[]): DuplicateEntry[] {
  // In a real system, you'd have quantity per card. Here we mock duplicates
  // by counting characters — if you own 2+ of same character, extras are "duplicates"
  const charCards: Record<string, Card[]> = {};
  const owned = new Set(ownedIds);

  for (const card of ALL_CARDS) {
    if (!owned.has(card.id)) continue;
    if (!charCards[card.character]) charCards[card.character] = [];
    charCards[card.character].push(card);
  }

  const duplicates: DuplicateEntry[] = [];
  for (const [, cards] of Object.entries(charCards)) {
    if (cards.length <= 1) continue;
    // Keep the rarest, rest are tradeable
    const sorted = [...cards].sort((a, b) => b.price - a.price);
    for (let i = 1; i < sorted.length; i++) {
      const data = getCardMarketData(sorted[i].id);
      const price = data?.currentPrice || sorted[i].price;
      duplicates.push({
        card: sorted[i],
        count: 1,
        tradeableCount: 1,
        unitValue: round(price),
        totalTradeValue: round(price),
      });
    }
  }

  return duplicates.sort((a, b) => b.totalTradeValue - a.totalTradeValue);
}

export function getTradeRecommendations(ownedIds: string[]): TradeRecommendation[] {
  const dupes = getDuplicateAnalysis(ownedIds);
  if (dupes.length === 0) return [];

  const owned = new Set(ownedIds);
  const velocity = getCompletionVelocity(ownedIds);
  const recommendations: TradeRecommendation[] = [];

  // For each set close to completion, find if selling duplicates covers the gap
  for (const set of velocity) {
    if (set.pct >= 100 || !set.cheapestMissing) continue;
    if (set.pct < 30) continue; // Only recommend for sets > 30% complete

    const missing = ALL_CARDS
      .filter(c => c.setSlug === set.setSlug && !owned.has(c.id) && c.listed)
      .sort((a, b) => a.price - b.price);

    if (missing.length === 0) continue;

    const target = missing[0];
    const targetData = getCardMarketData(target.id);
    const targetCost = targetData?.currentPrice || target.price;

    // Find cheapest duplicates that cover the cost
    let revenue = 0;
    const sellPlan: { card: Card; count: number; revenue: number }[] = [];
    for (const dupe of dupes) {
      if (revenue >= targetCost) break;
      sellPlan.push({ card: dupe.card, count: 1, revenue: dupe.unitValue });
      revenue += dupe.unitValue;
    }

    if (revenue > 0 && sellPlan.length <= 4) {
      recommendations.push({
        sell: sellPlan,
        buy: [{ card: target, cost: round(targetCost), reason: `Complete ${set.setName} (${set.pct}%)` }],
        netProfit: round(revenue - targetCost),
      });
    }
  }

  return recommendations.slice(0, 3);
}

// ===== Portfolio Value Time Series (mock) =====

export interface PortfolioTimePoint {
  day: number;
  value: number;
}

export function getPortfolioTimeSeries(ownedIds: string[], days: number): PortfolioTimePoint[] {
  const owned = new Set(ownedIds);
  const points: PortfolioTimePoint[] = [];

  for (let d = 0; d < days; d++) {
    let totalValue = 0;
    for (const card of ALL_CARDS) {
      if (!owned.has(card.id)) continue;
      const data = getCardMarketData(card.id);
      if (!data) continue;

      // Use price history to reconstruct portfolio value at day d
      const historyIdx = days <= 30
        ? Math.min(d, data.priceHistory30d.length - 1)
        : Math.min(d, data.priceHistory90d.length - 1);
      const history = days <= 30 ? data.priceHistory30d : data.priceHistory90d;
      totalValue += history[historyIdx]?.price || data.currentPrice;
    }
    points.push({ day: d + 1, value: round(totalValue) });
  }

  return points;
}

// ===== Helpers =====

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
