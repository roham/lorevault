'use client';

import { Card, Scarcity, Parallel, SCARCITY_CONFIG } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';

// ===== SEEDED RANDOM for deterministic market data =====
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ===== TYPES =====
export interface PricePoint {
  day: number;
  price: number;
  volume: number;
}

export interface MarketListing {
  cardId: string;
  seller: string;
  askPrice: number;
  listedAt: string; // ISO date
}

export interface RecentSale {
  cardId: string;
  buyer: string;
  seller: string;
  price: number;
  soldAt: string; // ISO date
  card: Card;
}

export interface FloorPrice {
  character: string;
  scarcity: Scarcity;
  floor: number;
  change24h: number;
  volume7d: number;
  listings: number;
}

export interface CardMarketData {
  cardId: string;
  currentPrice: number;
  floorPrice: number;
  avgPrice7d: number;
  avgPrice30d: number;
  change24h: number;
  change7d: number;
  change30d: number;
  volume24h: number;
  volume7d: number;
  totalSales: number;
  totalListings: number;
  priceHistory30d: PricePoint[];
  priceHistory90d: PricePoint[];
  lastSale: number;
  lastSaleDate: string;
  highAllTime: number;
  lowAllTime: number;
}

export interface WatchlistItem {
  cardId: string;
  addedAt: string;
  targetPrice?: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: MarketFilters;
  createdAt: string;
}

export interface MarketFilters {
  query: string;
  sets: string[];
  scarcities: Scarcity[];
  parallels: Parallel[];
  priceMin: number | null;
  priceMax: number | null;
  serialMin: number | null;
  serialMax: number | null;
  status: 'all' | 'listed' | 'sold';
  sortBy: 'price-asc' | 'price-desc' | 'recent' | 'popular' | 'ending' | 'serial-asc' | 'serial-desc';
}

export const DEFAULT_FILTERS: MarketFilters = {
  query: '',
  sets: [],
  scarcities: [],
  parallels: [],
  priceMin: null,
  priceMax: null,
  serialMin: null,
  serialMax: null,
  status: 'all',
  sortBy: 'popular',
};

// ===== MOCK SELLER NAMES =====
const SELLERS = [
  'CryptoCollector99', 'LegendsVault', 'RareFinds', 'MintCondition',
  'ShadowTrader', 'VaultMaster', 'CardShark', 'LoreHunter',
  'EpicPulls', 'OGCollector', 'WhaleWatch', 'DiamondHands',
  'SetChaser', 'SerialSniper', 'GoldRush', 'ObsidianKing',
];

// ===== GENERATE MARKET DATA =====
const marketDataCache = new Map<string, CardMarketData>();
const rand = seededRandom(1337);

function generatePriceHistory(card: Card, days: number): PricePoint[] {
  const r = seededRandom(hashCode(card.id) + days);
  const basePrice = card.price;
  const volatility = card.scarcity === 'legendary' ? 0.25 :
    card.scarcity === 'epic' ? 0.20 :
    card.scarcity === 'rare' ? 0.15 :
    card.scarcity === 'uncommon' ? 0.10 : 0.05;

  const points: PricePoint[] = [];
  let currentPrice = basePrice * (0.85 + r() * 0.3);

  for (let day = 0; day < days; day++) {
    const change = (r() - 0.48) * volatility; // slight upward bias
    currentPrice = Math.max(currentPrice * (1 + change), basePrice * 0.3);
    const volume = Math.floor(r() * 20 * (card.scarcity === 'legendary' ? 0.5 : card.scarcity === 'epic' ? 1 : card.scarcity === 'rare' ? 2 : 3));
    points.push({
      day: day + 1,
      price: Math.round(currentPrice * 100) / 100,
      volume: Math.max(volume, 0),
    });
  }

  return points;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCardMarketData(cardId: string): CardMarketData | null {
  if (marketDataCache.has(cardId)) return marketDataCache.get(cardId)!;

  const card = ALL_CARDS.find(c => c.id === cardId);
  if (!card) return null;

  const history30d = generatePriceHistory(card, 30);
  const history90d = generatePriceHistory(card, 90);

  const prices30d = history30d.map(p => p.price);
  const prices7d = history30d.slice(-7).map(p => p.price);
  const current = history30d[history30d.length - 1].price;
  const price7dAgo = history30d[Math.max(0, history30d.length - 8)]?.price || current;
  const price30dAgo = history30d[0]?.price || current;
  const price24hAgo = history30d[Math.max(0, history30d.length - 2)]?.price || current;

  const allPrices = history90d.map(p => p.price);

  const data: CardMarketData = {
    cardId,
    currentPrice: current,
    floorPrice: Math.min(...prices30d) * 0.95,
    avgPrice7d: prices7d.reduce((a, b) => a + b, 0) / prices7d.length,
    avgPrice30d: prices30d.reduce((a, b) => a + b, 0) / prices30d.length,
    change24h: ((current - price24hAgo) / price24hAgo) * 100,
    change7d: ((current - price7dAgo) / price7dAgo) * 100,
    change30d: ((current - price30dAgo) / price30dAgo) * 100,
    volume24h: history30d.slice(-1)[0]?.volume || 0,
    volume7d: history30d.slice(-7).reduce((a, b) => a + b.volume, 0),
    totalSales: history90d.reduce((a, b) => a + b.volume, 0),
    totalListings: Math.floor(hashCode(cardId) % 15) + 1,
    priceHistory30d: history30d,
    priceHistory90d: history90d,
    lastSale: current * (0.95 + (hashCode(cardId) % 10) / 100),
    lastSaleDate: new Date(Date.now() - (hashCode(cardId) % 48) * 3600000).toISOString(),
    highAllTime: Math.max(...allPrices) * 1.1,
    lowAllTime: Math.min(...allPrices) * 0.85,
  };

  marketDataCache.set(cardId, data);
  return data;
}

// ===== RECENT SALES FEED =====
let recentSalesCache: RecentSale[] | null = null;

export function getRecentSales(limit = 50): RecentSale[] {
  if (recentSalesCache) return recentSalesCache.slice(0, limit);

  const r = seededRandom(7777);
  const sales: RecentSale[] = [];
  const now = Date.now();

  for (let i = 0; i < 100; i++) {
    const card = ALL_CARDS[Math.floor(r() * ALL_CARDS.length)];
    const marketData = getCardMarketData(card.id);
    if (!marketData) continue;

    const price = marketData.currentPrice * (0.9 + r() * 0.2);
    sales.push({
      cardId: card.id,
      buyer: SELLERS[Math.floor(r() * SELLERS.length)],
      seller: SELLERS[Math.floor(r() * SELLERS.length)],
      price: Math.round(price * 100) / 100,
      soldAt: new Date(now - i * 180000 - Math.floor(r() * 120000)).toISOString(),
      card,
    });
  }

  recentSalesCache = sales;
  return sales.slice(0, limit);
}

// ===== FLOOR PRICES =====
let floorPricesCache: FloorPrice[] | null = null;

export function getFloorPrices(): FloorPrice[] {
  if (floorPricesCache) return floorPricesCache;

  const r = seededRandom(4242);
  const floors: FloorPrice[] = [];
  const characters = [...new Set(ALL_CARDS.map(c => c.character))];

  for (const character of characters) {
    const charCards = ALL_CARDS.filter(c => c.character === character);
    const scarcities = [...new Set(charCards.map(c => c.scarcity))];

    for (const scarcity of scarcities) {
      const scarcityCards = charCards.filter(c => c.scarcity === scarcity);
      const prices = scarcityCards.map(c => c.price);
      const floor = Math.min(...prices);

      floors.push({
        character,
        scarcity,
        floor: Math.round(floor * 100) / 100,
        change24h: Math.round((r() - 0.45) * 20 * 100) / 100,
        volume7d: Math.floor(r() * 50),
        listings: Math.floor(r() * 10) + 1,
      });
    }
  }

  floorPricesCache = floors.sort((a, b) => b.volume7d - a.volume7d);
  return floorPricesCache;
}

// ===== TRENDING CARDS =====
export function getTrendingCards(limit = 20): Array<Card & { trend: number; volume: number }> {
  return ALL_CARDS
    .map(card => {
      const data = getCardMarketData(card.id);
      return {
        ...card,
        trend: data?.change24h || 0,
        volume: data?.volume7d || 0,
      };
    })
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
}

// ===== WATCHLIST =====
const WATCHLIST_KEY = 'lorevault_watchlist';

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(cardId: string, targetPrice?: number) {
  const list = getWatchlist();
  if (list.some(w => w.cardId === cardId)) return list;
  const updated = [...list, { cardId, addedAt: new Date().toISOString(), targetPrice }];
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromWatchlist(cardId: string) {
  const list = getWatchlist().filter(w => w.cardId !== cardId);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  return list;
}

export function isWatchlisted(cardId: string): boolean {
  return getWatchlist().some(w => w.cardId === cardId);
}

// ===== SAVED SEARCHES =====
const SAVED_SEARCHES_KEY = 'lorevault_saved_searches';

export function getSavedSearches(): SavedSearch[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveSearch(name: string, filters: MarketFilters): SavedSearch[] {
  const searches = getSavedSearches();
  const newSearch: SavedSearch = {
    id: `search-${Date.now()}`,
    name,
    filters,
    createdAt: new Date().toISOString(),
  };
  const updated = [newSearch, ...searches].slice(0, 10);
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteSavedSearch(id: string): SavedSearch[] {
  const updated = getSavedSearches().filter(s => s.id !== id);
  localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
  return updated;
}

// ===== RECENT SEARCHES =====
const RECENT_SEARCHES_KEY = 'lorevault_recent_searches';

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string) {
  if (!query.trim()) return;
  const recent = getRecentSearches().filter(s => s !== query);
  const updated = [query, ...recent].slice(0, 8);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

// ===== FUZZY MATCH =====
function fuzzyMatch(text: string, pattern: string): number {
  // Returns a relevance score 0-1. 1 = exact, 0 = no match.
  text = text.toLowerCase();
  pattern = pattern.toLowerCase();
  if (text.includes(pattern)) return 1;
  // Check if all chars appear in order (fuzzy)
  let ti = 0;
  let pi = 0;
  let matched = 0;
  while (ti < text.length && pi < pattern.length) {
    if (text[ti] === pattern[pi]) { matched++; pi++; }
    ti++;
  }
  if (pi < pattern.length) return 0; // Not all chars found
  return matched / Math.max(text.length, pattern.length) * 0.7; // Partial score
}

export function scoreCard(card: Card, terms: string[]): number {
  const fields = [
    { text: card.character, weight: 3 },
    { text: card.moment, weight: 2 },
    { text: card.set, weight: 1.5 },
    { text: card.scarcity, weight: 1 },
    { text: card.parallel, weight: 1 },
  ];
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const field of fields) {
      const score = fuzzyMatch(field.text, term) * field.weight;
      if (score > best) best = score;
    }
    total += best;
  }
  return total;
}

// ===== SEARCH + FILTER ENGINE =====
export function searchMarketplace(cards: Card[], filters: MarketFilters): Card[] {
  let results = [...cards];

  // Text search with fuzzy matching
  if (filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    const terms = q.split(/\s+/);
    // Score and filter
    const scored = results
      .map(card => ({ card, score: scoreCard(card, terms) }))
      .filter(({ score }) => score > 0);
    // Sort by relevance if no explicit sort
    if (filters.sortBy === 'popular') {
      scored.sort((a, b) => b.score - a.score);
    }
    results = scored.map(s => s.card);
  }

  // Set filter
  if (filters.sets.length > 0) {
    results = results.filter(c => filters.sets.includes(c.setSlug));
  }

  // Scarcity filter
  if (filters.scarcities.length > 0) {
    results = results.filter(c => filters.scarcities.includes(c.scarcity));
  }

  // Parallel filter
  if (filters.parallels.length > 0) {
    results = results.filter(c => filters.parallels.includes(c.parallel));
  }

  // Price range
  if (filters.priceMin !== null) {
    results = results.filter(c => c.price >= filters.priceMin!);
  }
  if (filters.priceMax !== null) {
    results = results.filter(c => c.price <= filters.priceMax!);
  }

  // Serial range
  if (filters.serialMin !== null) {
    results = results.filter(c => c.serialNumber >= filters.serialMin!);
  }
  if (filters.serialMax !== null) {
    results = results.filter(c => c.serialNumber <= filters.serialMax!);
  }

  // Status
  if (filters.status === 'listed') {
    results = results.filter(c => c.listed);
  } else if (filters.status === 'sold') {
    results = results.filter(c => !c.listed);
  }

  // Sort
  switch (filters.sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'recent':
      results.sort((a, b) => {
        const aData = getCardMarketData(a.id);
        const bData = getCardMarketData(b.id);
        return new Date(bData?.lastSaleDate || 0).getTime() - new Date(aData?.lastSaleDate || 0).getTime();
      });
      break;
    case 'popular':
      results.sort((a, b) => {
        const aData = getCardMarketData(a.id);
        const bData = getCardMarketData(b.id);
        return (bData?.volume7d || 0) - (aData?.volume7d || 0);
      });
      break;
    case 'serial-asc':
      results.sort((a, b) => a.serialNumber - b.serialNumber);
      break;
    case 'serial-desc':
      results.sort((a, b) => b.serialNumber - a.serialNumber);
      break;
  }

  return results;
}

// ===== FACET COUNTS =====
export interface FacetCounts {
  sets: Record<string, number>;
  scarcities: Record<Scarcity, number>;
  parallels: Record<Parallel, number>;
  listed: number;
  sold: number;
  total: number;
}

export function getFacetCounts(cards: Card[], currentFilters: MarketFilters): FacetCounts {
  // Calculate counts based on all cards that match OTHER filters (not the facet being counted)
  const counts: FacetCounts = {
    sets: {},
    scarcities: {} as Record<Scarcity, number>,
    parallels: {} as Record<Parallel, number>,
    listed: 0,
    sold: 0,
    total: cards.length,
  };

  // Count using the filtered results
  const filtered = searchMarketplace(cards, { ...currentFilters, sets: [], scarcities: [], parallels: [] });

  for (const card of filtered) {
    counts.sets[card.setSlug] = (counts.sets[card.setSlug] || 0) + 1;
    counts.scarcities[card.scarcity] = (counts.scarcities[card.scarcity] || 0) + 1;
    counts.parallels[card.parallel] = (counts.parallels[card.parallel] || 0) + 1;
    if (card.listed) counts.listed++;
    else counts.sold++;
  }

  return counts;
}

// ===== AUTOCOMPLETE SUGGESTIONS =====
export function getAutocompleteSuggestions(query: string, limit = 8): Array<{ type: 'character' | 'set' | 'card'; label: string; sublabel?: string; card?: Card }> {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const suggestions: Array<{ type: 'character' | 'set' | 'card'; label: string; sublabel?: string; card?: Card }> = [];
  const seen = new Set<string>();

  // Match characters
  for (const card of ALL_CARDS) {
    if (card.character.toLowerCase().includes(q) && !seen.has(`char:${card.character}`)) {
      seen.add(`char:${card.character}`);
      suggestions.push({ type: 'character', label: card.character, sublabel: card.set });
    }
  }

  // Match sets
  for (const card of ALL_CARDS) {
    if (card.set.toLowerCase().includes(q) && !seen.has(`set:${card.set}`)) {
      seen.add(`set:${card.set}`);
      suggestions.push({ type: 'set', label: card.set });
    }
  }

  // Match specific cards
  for (const card of ALL_CARDS) {
    const searchable = `${card.character} ${card.scarcity} ${card.parallel} ${card.moment}`.toLowerCase();
    if (searchable.includes(q) && !seen.has(`card:${card.id}`)) {
      seen.add(`card:${card.id}`);
      suggestions.push({
        type: 'card',
        label: card.name,
        sublabel: `${SCARCITY_CONFIG[card.scarcity].label} ${card.parallel !== 'base' ? card.parallel : ''} — $${card.price.toFixed(2)}`.trim(),
        card,
      });
    }
  }

  return suggestions.slice(0, limit);
}

// ===== "COMPLETE YOUR SET" RECOMMENDATIONS =====
export function getCompletionRecommendations(ownedCardIds: string[], limit = 10): Array<Card & { reason: string }> {
  const owned = new Set(ownedCardIds);
  const ownedCards = ALL_CARDS.filter(c => owned.has(c.id));

  // Figure out which sets the user has started
  const setProgress: Record<string, { owned: number; total: number }> = {};
  for (const card of ownedCards) {
    if (!setProgress[card.setSlug]) {
      const total = ALL_CARDS.filter(c => c.setSlug === card.setSlug).length;
      setProgress[card.setSlug] = { owned: 0, total };
    }
    setProgress[card.setSlug].owned++;
  }

  // Get missing cards from started sets, prioritize sets closest to completion
  const recommendations: Array<Card & { reason: string }> = [];
  const sortedSets = Object.entries(setProgress)
    .sort((a, b) => (b[1].owned / b[1].total) - (a[1].owned / a[1].total));

  for (const [setSlug, progress] of sortedSets) {
    const missing = ALL_CARDS.filter(c => c.setSlug === setSlug && !owned.has(c.id) && c.listed);
    const pct = Math.round((progress.owned / progress.total) * 100);
    for (const card of missing.sort((a, b) => a.price - b.price)) {
      recommendations.push({
        ...card,
        reason: `${pct}% complete — ${progress.total - progress.owned} cards to go`,
      });
    }
  }

  return recommendations.slice(0, limit);
}

// ===== UNDERVALUED CARDS =====
export function getUndervaluedCards(limit = 10): Array<Card & { discount: number; avgPrice: number }> {
  return ALL_CARDS
    .map(card => {
      const data = getCardMarketData(card.id);
      if (!data) return null;
      const discount = ((data.avgPrice7d - data.currentPrice) / data.avgPrice7d) * 100;
      return { ...card, discount, avgPrice: data.avgPrice7d };
    })
    .filter((c): c is Card & { discount: number; avgPrice: number } => c !== null && c.discount > 5)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
}

// ===== PRICE ALERTS (mock) =====
const PRICE_ALERTS_KEY = 'lorevault_price_alerts';

export interface PriceAlert {
  cardId: string;
  targetPrice: number;
  direction: 'below' | 'above';
  createdAt: string;
  triggered: boolean;
}

export function getPriceAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(PRICE_ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addPriceAlert(cardId: string, targetPrice: number, direction: 'below' | 'above'): PriceAlert[] {
  const alerts = getPriceAlerts();
  const newAlert: PriceAlert = { cardId, targetPrice, direction, createdAt: new Date().toISOString(), triggered: false };
  const updated = [newAlert, ...alerts].slice(0, 20);
  localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(updated));
  return updated;
}

export function removePriceAlert(cardId: string): PriceAlert[] {
  const updated = getPriceAlerts().filter(a => a.cardId !== cardId);
  localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(updated));
  return updated;
}

// ===== PORTFOLIO VALUE =====
export function getPortfolioValue(ownedIds: string[]): { totalValue: number; change24h: number; cardCount: number } {
  const owned = new Set(ownedIds);
  let totalValue = 0;
  let totalPrev = 0;
  let count = 0;

  for (const card of ALL_CARDS) {
    if (!owned.has(card.id)) continue;
    const data = getCardMarketData(card.id);
    const current = data?.currentPrice || card.price;
    const prev = data ? current / (1 + data.change24h / 100) : current;
    totalValue += current;
    totalPrev += prev;
    count++;
  }

  const change = totalPrev > 0 ? ((totalValue - totalPrev) / totalPrev) * 100 : 0;
  return { totalValue, change24h: change, cardCount: count };
}

// ===== GAP-BASED SUGGESTIONS =====
export interface SetGap {
  setSlug: string;
  setName: string;
  setIcon: string;
  owned: number;
  total: number;
  pct: number;
  missingByScarcity: Record<string, number>;
  cheapestMissing: Card | null;
  costToComplete: number;
}

export function getSetGaps(ownedIds: string[]): SetGap[] {
  const owned = new Set(ownedIds);
  const setNames: Record<string, string> = {};
  const setIcons: Record<string, string> = {};

  for (const card of ALL_CARDS) {
    setNames[card.setSlug] = card.set;
    if (!setIcons[card.setSlug]) {
      setIcons[card.setSlug] = card.setSlug === 'baker-street' ? '🔍' : card.setSlug === 'enchanted-kingdom' ? '👑' : card.setSlug === 'wonderland' ? '🐇' : card.setSlug === 'gothic-horror' ? '🦇' : '⚡';
    }
  }

  const gaps: SetGap[] = [];
  const slugs = [...new Set(ALL_CARDS.map(c => c.setSlug))];

  for (const slug of slugs) {
    const setCards = ALL_CARDS.filter(c => c.setSlug === slug);
    const ownedInSet = setCards.filter(c => owned.has(c.id));
    if (ownedInSet.length === 0) continue; // Only show started sets

    const missing = setCards.filter(c => !owned.has(c.id));
    const missingByScarcity: Record<string, number> = {};
    for (const c of missing) {
      missingByScarcity[c.scarcity] = (missingByScarcity[c.scarcity] || 0) + 1;
    }

    const listedMissing = missing.filter(c => c.listed).sort((a, b) => a.price - b.price);
    const costToComplete = listedMissing.reduce((sum, c) => sum + c.price, 0);

    gaps.push({
      setSlug: slug,
      setName: setNames[slug],
      setIcon: setIcons[slug],
      owned: ownedInSet.length,
      total: setCards.length,
      pct: Math.round((ownedInSet.length / setCards.length) * 100),
      missingByScarcity,
      cheapestMissing: listedMissing[0] || null,
      costToComplete: Math.round(costToComplete * 100) / 100,
    });
  }

  return gaps.sort((a, b) => b.pct - a.pct);
}
