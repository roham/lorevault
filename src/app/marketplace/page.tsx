'use client';

import { useState, useMemo, useEffect, useCallback, useRef, type RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardItem from '@/components/CardItem';
import FilterChips from '@/components/marketplace/FilterChips';
import SalesTicker from '@/components/marketplace/SalesTicker';
import MarketStats from '@/components/marketplace/MarketStats';
import FloorPriceTable from '@/components/marketplace/FloorPriceTable';
import RecentActivity from '@/components/marketplace/RecentActivity';
import CardQuickView from '@/components/marketplace/CardQuickView';
import MarketMovers from '@/components/marketplace/MarketMovers';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, Parallel, SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';
import {
  MarketFilters,
  DEFAULT_FILTERS,
  searchMarketplace,
  getFacetCounts,
  getCardMarketData,
  getAutocompleteSuggestions,
  addRecentSearch,
  getRecentSearches,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isWatchlisted,
  getTrendingCards,
  getCompletionRecommendations,
  getUndervaluedCards,
  getPortfolioValue,
  getSetGaps,
  getSavedSearches,
  saveSearch,
  deleteSavedSearch,
} from '@/lib/marketData';
import { getOwnedCardIds, addOwnedCards } from '@/lib/store';

type ViewMode = 'grid' | 'list' | 'table';
type MarketTab = 'browse' | 'watchlist' | 'floors' | 'movers';
type OwnershipFilter = 'all' | 'need' | 'own';

export default function MarketplacePage() {
  const [filters, setFilters] = useState<MarketFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return 'table';
    return 'grid';
  });
  const [activeTab, setActiveTab] = useState<MarketTab>('browse');
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [autocomplete, setAutocomplete] = useState<ReturnType<typeof getAutocompleteSuggestions>>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [quickViewCard, setQuickViewCard] = useState<Card | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [savedSearches, setSavedSearches] = useState<ReturnType<typeof getSavedSearches>>([]);
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('all');
  const [loaded, setLoaded] = useState(false);
  const [compact, setCompact] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    setWatchlist(getWatchlist().map(w => w.cardId));
    setSavedSearches(getSavedSearches());
    setOwnedIds(new Set(getOwnedCardIds()));
    setLoaded(true);
  }, []);

  const results = useMemo(() => {
    let filtered = searchMarketplace(ALL_CARDS, filters);
    if (ownershipFilter === 'need' && loaded) filtered = filtered.filter(c => !ownedIds.has(c.id));
    else if (ownershipFilter === 'own' && loaded) filtered = filtered.filter(c => ownedIds.has(c.id));
    return filtered;
  }, [filters, ownershipFilter, ownedIds, loaded]);

  // Progressive rendering — reset on filter change, load more on scroll
  useEffect(() => { setVisibleCount(24); }, [filters, ownershipFilter]);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount(v => Math.min(v + 24, results.length));
    }, { rootMargin: '200px' });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [results.length]);

  const facets = useMemo(() => getFacetCounts(ALL_CARDS, filters), [filters]);
  const trending = useMemo(() => getTrendingCards(8), []);
  const completionRecs = useMemo(() => loaded ? getCompletionRecommendations(Array.from(ownedIds), 8) : [], [ownedIds, loaded]);
  const undervalued = useMemo(() => getUndervaluedCards(8), []);
  const portfolio = useMemo(() => loaded ? getPortfolioValue(Array.from(ownedIds)) : null, [ownedIds, loaded]);
  const setGaps = useMemo(() => loaded ? getSetGaps(Array.from(ownedIds)) : [], [ownedIds, loaded]);

  const handleSearchChange = useCallback((value: string) => {
    setFilters(f => ({ ...f, query: value }));
    setAutocomplete(value.trim() ? getAutocompleteSuggestions(value) : []);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (filters.query.trim()) { addRecentSearch(filters.query.trim()); setRecentSearches(getRecentSearches()); }
    setSearchFocused(false);
    setAutocomplete([]);
  }, [filters.query]);

  const handleSuggestionClick = useCallback((s: ReturnType<typeof getAutocompleteSuggestions>[0]) => {
    if (s.type === 'character') setFilters(f => ({ ...f, query: s.label }));
    else if (s.type === 'set') { const set = SETS.find(x => x.name === s.label); if (set) setFilters(f => ({ ...f, sets: [set.slug] })); }
    else if (s.card) setQuickViewCard(s.card);
    addRecentSearch(s.label); setRecentSearches(getRecentSearches()); setSearchFocused(false); setAutocomplete([]);
  }, []);

  const toggleWatchlist = useCallback((cardId: string) => {
    if (isWatchlisted(cardId)) { removeFromWatchlist(cardId); setWatchlist(w => w.filter(id => id !== cardId)); }
    else { addToWatchlist(cardId); setWatchlist(w => [...w, cardId]); }
  }, []);

  const toggleBulkSelect = useCallback((cardId: string) => {
    setBulkSelected(prev => { const next = new Set(prev); if (next.has(cardId)) next.delete(cardId); else next.add(cardId); return next; });
  }, []);

  const handleBuyCard = useCallback((card: Card) => {
    addOwnedCards([card.id]); setOwnedIds(prev => new Set([...prev, card.id]));
  }, []);

  const handleBuyBulk = useCallback(() => {
    const ids = Array.from(bulkSelected);
    addOwnedCards(ids);
    setOwnedIds(prev => new Set([...prev, ...ids]));
    setBulkSelected(new Set());
    setBulkMode(false);
  }, [bulkSelected]);

  const handleBuyAllWatchlist = useCallback(() => {
    const ids = watchlist.filter(id => !ownedIds.has(id));
    if (ids.length === 0) return;
    addOwnedCards(ids);
    setOwnedIds(prev => new Set([...prev, ...ids]));
  }, [watchlist, ownedIds]);

  const handleSaveSearch = useCallback(() => {
    if (!saveSearchName.trim()) return;
    setSavedSearches(saveSearch(saveSearchName.trim(), filters)); setShowSaveSearch(false); setSaveSearchName('');
  }, [saveSearchName, filters]);

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.sets.length > 0) c++; if (filters.scarcities.length > 0) c++; if (filters.parallels.length > 0) c++;
    if (filters.priceMin !== null || filters.priceMax !== null) c++; if (filters.serialMin !== null || filters.serialMax !== null) c++;
    if (filters.status !== 'all') c++; return c;
  }, [filters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInput = document.activeElement?.tagName === 'INPUT';
      if (e.key === '/' && !searchFocused && !isInput) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === '?' && !isInput) { e.preventDefault(); setShowShortcuts(prev => !prev); }
      if (e.key === 'Escape') { setSearchFocused(false); setQuickViewCard(null); setShowShortcuts(false); searchRef.current?.blur(); setFocusedIdx(-1); }
      // J/K navigation through results
      if (!isInput && !quickViewCard && activeTab === 'browse') {
        if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(prev => Math.min(prev + 1, results.length - 1)); }
        if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(prev => Math.max(prev - 1, 0)); }
        if (e.key === 'Enter' && focusedIdx >= 0 && focusedIdx < results.length) { e.preventDefault(); setQuickViewCard(results[focusedIdx]); }
        if (e.key === 'w' && focusedIdx >= 0 && focusedIdx < results.length) { e.preventDefault(); toggleWatchlist(results[focusedIdx].id); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchFocused, quickViewCard, activeTab, results, focusedIdx, toggleWatchlist]);

  const isSearchActive = !!(filters.query.trim() || filters.sets.length || filters.scarcities.length || filters.parallels.length);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const terms = query.toLowerCase().trim().split(/\s+/);
    let result = text;
    for (const term of terms) {
      const idx = result.toLowerCase().indexOf(term);
      if (idx >= 0) {
        result = result.slice(0, idx) + '**' + result.slice(idx, idx + term.length) + '**' + result.slice(idx + term.length);
      }
    }
    // Convert **text** to JSX-friendly format
    const parts = result.split(/\*\*(.*?)\*\*/);
    if (parts.length === 1) return text;
    return parts.map((part, i) => i % 2 === 1 ? <span key={i} className="text-accent font-bold">{part}</span> : part);
  };

  const renderTrend = (change: number) => {
    if (Math.abs(change) < 0.5) return <span className="text-muted text-[10px]">--</span>;
    return <span className={`text-[10px] font-mono font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>;
  };

  const renderSparkline = (cardId: string) => {
    const data = getCardMarketData(cardId); if (!data) return null;
    const pts = data.priceHistory30d.slice(-7); const prices = pts.map(p => p.price);
    const pMax = Math.max(...prices); const pMin = Math.min(...prices); const spread = pMax - pMin || 1;
    const path = pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${(j / (pts.length - 1)) * 60} ${18 - ((p.price - pMin) / spread) * 14 - 2}`).join(' ');
    const isUp = pts[pts.length - 1].price >= pts[0].price;
    return <svg viewBox="0 0 60 20" className="w-16 h-5" preserveAspectRatio="none"><path d={path} fill="none" stroke={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} strokeWidth="1.5" strokeLinecap="round" /></svg>;
  };

  const renderOwnedBadge = (cardId: string) => {
    if (!loaded || !ownedIds.has(cardId)) return null;
    return <div className="absolute bottom-[70px] right-1.5 z-20"><span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 font-bold uppercase tracking-wider">Owned</span></div>;
  };

  return (
    <div className="min-h-screen pb-24">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <button onClick={() => window.history.back()} className="text-muted hover:text-foreground transition-colors text-sm">←</button>
              <h1 className="text-lg font-bold tracking-tight">Marketplace</h1>
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <SalesTicker />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-lg border border-border overflow-hidden">
                {([{ key: 'all' as OwnershipFilter, label: 'All' }, { key: 'need' as OwnershipFilter, label: 'Need' }, { key: 'own' as OwnershipFilter, label: 'Own' }]).map(({ key, label }) => (
                  <button key={key} onClick={() => setOwnershipFilter(key)} className={`px-2 py-1.5 text-[10px] font-semibold transition-colors ${ownershipFilter === key ? (key === 'need' ? 'bg-orange-500/80 text-white' : key === 'own' ? 'bg-green-500/80 text-white' : 'bg-accent text-white') : 'bg-surface text-muted hover:text-foreground'}`}>{label}</button>
                ))}
              </div>
              <button onClick={() => setCompact(!compact)} className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${compact ? 'bg-accent text-white' : 'bg-surface border border-border text-muted hover:text-foreground'}`} title="Compact mode">{compact ? 'Dense' : 'Comfy'}</button>
              <button onClick={() => { setBulkMode(!bulkMode); setBulkSelected(new Set()); }} className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${bulkMode ? 'bg-accent text-white' : 'bg-surface border border-border text-muted hover:text-foreground'}`}>{bulkMode ? `${bulkSelected.size} sel` : 'Bulk'}</button>
              <div className="flex rounded-lg border border-border overflow-hidden">
                {([{ mode: 'grid' as ViewMode, icon: '▦' }, { mode: 'list' as ViewMode, icon: '☰' }, { mode: 'table' as ViewMode, icon: '▤' }]).map(({ mode, icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)} className={`px-2.5 py-1.5 text-xs transition-colors ${viewMode === mode ? 'bg-accent text-white' : 'bg-surface text-muted hover:text-foreground'}`}>{icon}</button>
                ))}
              </div>
            </div>
          </div>
          {/* Search */}
          <div className="relative pb-2.5">
            <div className="relative">
              <input ref={searchRef} type="text" placeholder='Search "Sherlock Holmes Legendary Gold"... (press / to focus)' value={filters.query}
                onChange={(e) => handleSearchChange(e.target.value)} onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); if (e.key === 'Escape') { setSearchFocused(false); searchRef.current?.blur(); } }}
                className="w-full px-4 py-2 pl-9 rounded-xl bg-surface border border-border text-sm text-foreground placeholder-muted/60 focus:outline-none focus:border-accent/50 transition-colors font-mono" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs">🔍</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {filters.query && <button onClick={() => { handleSearchChange(''); searchRef.current?.focus(); }} className="text-muted hover:text-foreground text-xs">x</button>}
                {!searchFocused && !filters.query && (
                  <div className="flex items-center gap-1">
                    <kbd className="text-[9px] text-muted/40 font-mono border border-border/50 rounded px-1 py-0.5">/</kbd>
                    <button onClick={() => setShowShortcuts(true)} className="text-[9px] text-muted/30 font-mono border border-border/30 rounded px-1 py-0.5 hover:text-muted/60">?</button>
                  </div>
                )}
              </div>
            </div>
            <AnimatePresence>
              {searchFocused && (autocomplete.length > 0 || recentSearches.length > 0) && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-surface border border-border shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                  {autocomplete.length > 0 ? (
                    <div className="py-1">
                      {autocomplete.map((s, i) => (
                        <button key={`${s.type}-${s.label}-${i}`} onClick={() => handleSuggestionClick(s)} className="w-full px-4 py-2 flex items-center gap-3 hover:bg-surface-hover transition-colors text-left">
                          <span className="text-muted text-xs w-5 text-center">{s.type === 'character' ? '👤' : s.type === 'set' ? '📚' : '🃏'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{s.label}</div>
                            {s.sublabel && <div className="text-[10px] text-muted truncate">{s.sublabel}</div>}
                          </div>
                          {s.card && <div className="w-6 h-8 rounded flex-shrink-0 flex items-center justify-center text-[8px]" style={{ background: `linear-gradient(145deg, ${s.card.gradientFrom}, ${s.card.gradientTo})`, border: `1px solid ${SCARCITY_CONFIG[s.card.scarcity].color}40` }}>{s.card.symbol}</div>}
                          <span className="text-[9px] text-muted uppercase">{s.type}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 py-1 text-[10px] text-muted uppercase tracking-wider">Recent</div>
                      {recentSearches.map(q => (
                        <button key={q} onClick={() => { handleSearchChange(q); handleSearchSubmit(); }} className="w-full px-4 py-2 flex items-center gap-2 hover:bg-surface-hover transition-colors text-left">
                          <span className="text-muted text-xs">🕐</span><span className="text-sm">{q}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {searchFocused && <div className="fixed inset-0 z-30" onClick={() => setSearchFocused(false)} />}

      {/* Mobile sales ticker */}
      <div className="sm:hidden px-4 py-1.5 border-b border-border/20 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
        <SalesTicker />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
        <MarketStats />

        {/* Portfolio mini-widget */}
        {portfolio && portfolio.cardCount > 0 && (
          <div className="flex items-center gap-4 px-3 py-2 rounded-lg bg-surface/50 border border-border/50 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted uppercase tracking-wider">Your Portfolio</span>
              <span className="text-sm font-bold font-mono text-green-400">${portfolio.totalValue.toFixed(2)}</span>
              <span className={`text-[10px] font-mono font-bold ${portfolio.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolio.change24h >= 0 ? '+' : ''}{portfolio.change24h.toFixed(1)}%
              </span>
            </div>
            <div className="w-px h-4 bg-border/50" />
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {setGaps.map(gap => (
                <div key={gap.setSlug} className="flex items-center gap-1 shrink-0">
                  <span className="text-xs">{gap.setIcon}</span>
                  <div className="w-12 h-1.5 rounded-full bg-background overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${gap.pct}%` }} />
                  </div>
                  <span className="text-[9px] text-muted font-mono">{gap.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="flex items-center gap-0.5 mb-3 border-b border-border/30 pb-0">
          {([{ key: 'browse' as MarketTab, label: 'Browse', count: results.length }, { key: 'movers' as MarketTab, label: 'Movers' }, { key: 'watchlist' as MarketTab, label: 'Watchlist', count: watchlist.length }, { key: 'floors' as MarketTab, label: 'Floors' }]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative px-3 py-2 text-[11px] font-semibold transition-colors ${activeTab === tab.key ? 'text-accent' : 'text-muted hover:text-foreground'}`}>
              {tab.label}{tab.count !== undefined && tab.count > 0 && <span className={`ml-1 text-[9px] ${activeTab === tab.key ? 'text-accent/60' : 'text-muted/50'}`}>{tab.count}</span>}
              {activeTab === tab.key && <motion.div layoutId="market-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
            </button>
          ))}
        </div>

        {/* WATCHLIST TAB */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlist.length > 0 && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted">{watchlist.length} cards watched</span>
                <button onClick={handleBuyAllWatchlist} className="px-3 py-1.5 rounded-lg bg-accent text-white text-[10px] font-bold hover:bg-accent/90 transition-colors">Buy All Not Owned</button>
              </div>
            )}
            {watchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-center">
                <span className="text-4xl mb-3">★</span><h3 className="text-lg font-semibold mb-1">No watched cards</h3>
                <p className="text-sm text-muted mb-4">Star cards to track price changes.</p>
                <button onClick={() => setActiveTab('browse')} className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold">Browse Marketplace</button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {watchlist.map((cardId, i) => {
                  const card = ALL_CARDS.find(c => c.id === cardId); if (!card) return null;
                  const data = getCardMarketData(card.id);
                  return (
                    <motion.div key={cardId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors group cursor-pointer" onClick={() => setQuickViewCard(card)}>
                        <div className="w-11 h-[60px] rounded-lg overflow-hidden flex-shrink-0 relative" style={{ background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`, border: `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}` }}>
                          <div className="absolute inset-0 flex items-center justify-center text-base">{card.symbol}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{card.character}</div>
                          <div className="text-[10px] text-muted truncate">{card.moment}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-mono font-bold uppercase" style={{ color: SCARCITY_CONFIG[card.scarcity].color }}>{SCARCITY_CONFIG[card.scarcity].label}</span>
                            {card.parallel !== 'base' && <span className="text-[9px] text-muted">{PARALLEL_CONFIG[card.parallel].label}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-green-400 font-mono">${data?.currentPrice.toFixed(2) || card.price.toFixed(2)}</div>
                          {data && renderTrend(data.change24h)}
                        </div>
                        <div className="shrink-0">{renderSparkline(card.id)}</div>
                        <button onClick={(e) => { e.stopPropagation(); toggleWatchlist(card.id); }} className="text-yellow-400 text-sm shrink-0 hover:scale-110 transition-transform">★</button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* FLOOR PRICES TAB */}
        {activeTab === 'floors' && <FloorPriceTable onCharacterClick={(character) => { setFilters(f => ({ ...f, query: character })); setActiveTab('browse'); }} />}

        {/* MOVERS TAB */}
        {activeTab === 'movers' && <MarketMovers />}

        {/* BROWSE TAB */}
        {activeTab === 'browse' && (<>
          {/* Filter bar */}
          <div className="flex items-center gap-1.5 mb-2">
            <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${showFilters || activeFilterCount > 0 ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-surface border border-border text-muted hover:text-foreground'}`}>
              <span>Filters</span>{activeFilterCount > 0 && <span className="min-w-[14px] h-3.5 rounded-full bg-accent text-white text-[9px] flex items-center justify-center px-0.5">{activeFilterCount}</span>}
            </button>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {SETS.map(set => {
                const isActive = filters.sets.includes(set.slug); const count = facets.sets[set.slug] || 0;
                return <button key={set.slug} onClick={() => setFilters(f => ({ ...f, sets: isActive ? f.sets.filter(s => s !== set.slug) : [...f.sets, set.slug] }))} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-accent text-white' : 'bg-surface border border-border text-muted hover:text-foreground'}`}>
                  <span>{set.icon}</span><span className="hidden sm:inline">{set.name}</span><span className="text-[9px] opacity-60">{count}</span>
                </button>;
              })}
            </div>
            <select value={filters.sortBy} onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as MarketFilters['sortBy'] }))} className="ml-auto px-2 py-1.5 rounded-lg bg-surface border border-border text-[10px] text-foreground focus:outline-none focus:border-accent/50 shrink-0">
              <option value="popular">Popular</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="recent">Recent</option><option value="serial-asc">Serial ↑</option><option value="serial-desc">Serial ↓</option>
            </select>
          </div>
          <div className="mb-2"><FilterChips filters={filters} onChange={setFilters} /></div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mb-3">
                <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
                  <div>
                    <div className="text-[9px] text-muted uppercase tracking-wider mb-1.5 font-semibold">Scarcity</div>
                    <div className="flex flex-wrap gap-1">
                      {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as Scarcity[]).map(s => {
                        const isActive = filters.scarcities.includes(s); const count = facets.scarcities[s] || 0;
                        return <button key={s} onClick={() => setFilters(f => ({ ...f, scarcities: isActive ? f.scarcities.filter(x => x !== s) : [...f.scarcities, s] }))} className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${isActive ? 'text-white' : 'bg-surface-hover text-muted hover:text-foreground border border-border'}`} style={isActive ? { background: SCARCITY_CONFIG[s].color } : undefined}>{SCARCITY_CONFIG[s].label} ({count})</button>;
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted uppercase tracking-wider mb-1.5 font-semibold">Parallel</div>
                    <div className="flex flex-wrap gap-1">
                      {(['base', 'silver', 'gold', 'holographic', 'obsidian'] as Parallel[]).map(p => {
                        const isActive = filters.parallels.includes(p); const count = facets.parallels[p] || 0;
                        return <button key={p} onClick={() => setFilters(f => ({ ...f, parallels: isActive ? f.parallels.filter(x => x !== p) : [...f.parallels, p] }))} className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${isActive ? 'bg-accent text-white' : 'bg-surface-hover text-muted hover:text-foreground border border-border'}`}>{PARALLEL_CONFIG[p].label} ({count})</button>;
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted uppercase tracking-wider mb-1.5 font-semibold">Price Range</div>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" value={filters.priceMin ?? ''} onChange={(e) => setFilters(f => ({ ...f, priceMin: e.target.value ? Number(e.target.value) : null }))} className="w-20 px-2 py-1 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder-muted focus:outline-none focus:border-accent/50 font-mono" />
                      <span className="text-muted text-[10px]">—</span>
                      <input type="number" placeholder="Max" value={filters.priceMax ?? ''} onChange={(e) => setFilters(f => ({ ...f, priceMax: e.target.value ? Number(e.target.value) : null }))} className="w-20 px-2 py-1 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder-muted focus:outline-none focus:border-accent/50 font-mono" />
                      <div className="flex gap-1 ml-1">{[10, 50, 100, 500].map(p => <button key={p} onClick={() => setFilters(f => ({ ...f, priceMax: p }))} className="px-1.5 py-0.5 rounded text-[9px] bg-background border border-border text-muted hover:text-foreground font-mono">&lt;${p}</button>)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted uppercase tracking-wider mb-1.5 font-semibold">Serial Number</div>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" value={filters.serialMin ?? ''} onChange={(e) => setFilters(f => ({ ...f, serialMin: e.target.value ? Number(e.target.value) : null }))} className="w-20 px-2 py-1 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder-muted focus:outline-none focus:border-accent/50 font-mono" />
                      <span className="text-muted text-[10px]">—</span>
                      <input type="number" placeholder="Max" value={filters.serialMax ?? ''} onChange={(e) => setFilters(f => ({ ...f, serialMax: e.target.value ? Number(e.target.value) : null }))} className="w-20 px-2 py-1 rounded-lg bg-background border border-border text-[11px] text-foreground placeholder-muted focus:outline-none focus:border-accent/50 font-mono" />
                      <div className="flex gap-1 ml-1">{[10, 50, 100].map(s => <button key={s} onClick={() => setFilters(f => ({ ...f, serialMax: s }))} className="px-1.5 py-0.5 rounded text-[9px] bg-background border border-border text-muted hover:text-foreground font-mono">&lt;#{s}</button>)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-muted uppercase tracking-wider mb-1.5 font-semibold">Status</div>
                    <div className="flex gap-1">
                      {(['all', 'listed', 'sold'] as const).map(status => <button key={status} onClick={() => setFilters(f => ({ ...f, status }))} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors capitalize ${filters.status === status ? 'bg-accent text-white' : 'bg-surface-hover text-muted hover:text-foreground border border-border'}`}>{status === 'all' ? `All (${facets.total})` : status === 'listed' ? `Listed (${facets.listed})` : `Sold (${facets.sold})`}</button>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      {!showSaveSearch ? <button onClick={() => setShowSaveSearch(true)} className="text-[10px] text-accent hover:text-accent/80 font-semibold">+ Save search</button> : (
                        <div className="flex items-center gap-1.5">
                          <input type="text" placeholder="Name..." value={saveSearchName} onChange={(e) => setSaveSearchName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveSearch(); }} className="px-2 py-1 rounded-lg bg-background border border-border text-[10px] text-foreground placeholder-muted focus:outline-none focus:border-accent/50 w-28" autoFocus />
                          <button onClick={handleSaveSearch} className="text-[10px] text-accent font-semibold">Save</button>
                          <button onClick={() => setShowSaveSearch(false)} className="text-[10px] text-muted">x</button>
                        </div>
                      )}
                    </div>
                    {savedSearches.length > 0 && <div className="flex gap-1 overflow-x-auto">
                      {savedSearches.slice(0, 3).map(ss => <button key={ss.id} onClick={() => setFilters(ss.filters)} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-hover border border-border text-[9px] text-muted hover:text-foreground group"><span>📌</span><span>{ss.name}</span><span onClick={(e) => { e.stopPropagation(); setSavedSearches(deleteSavedSearch(ss.id)); }} className="text-muted/50 hover:text-red-400 ml-0.5 opacity-0 group-hover:opacity-100">x</span></button>)}
                    </div>}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recommendations when no search */}
          {!isSearchActive && (<>
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2"><span className="text-orange-400">🔥</span> Trending Now</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {trending.map((card, i) => { const data = getCardMarketData(card.id); return (
                  <motion.div key={card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex-shrink-0 relative cursor-pointer" onClick={() => setQuickViewCard(card)}>
                    <CardItem card={card} size="sm" showPrice interactive={false} />
                    {data && <div className="absolute top-1.5 left-7 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm z-10">{renderTrend(data.change24h)}</div>}
                    {renderOwnedBadge(card.id)}
                  </motion.div>
                ); })}
              </div>
            </section>
            {completionRecs.length > 0 && (
              <section className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2"><span className="text-accent">🧩</span> Cards You Need</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {completionRecs.map((card, i) => (
                    <motion.div key={card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex-shrink-0 relative cursor-pointer" onClick={() => setQuickViewCard(card)}>
                      <CardItem card={card} size="sm" showPrice interactive={false} />
                      <div className="absolute bottom-[68px] left-0 right-0 px-1"><div className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-center"><span className="text-[8px] text-accent font-medium">{card.reason}</span></div></div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            {/* Set Gaps */}
            {setGaps.length > 0 && (
              <section className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2"><span className="text-purple-400">📊</span> Collection Gaps</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {setGaps.filter(g => g.pct < 100).slice(0, 3).map((gap) => (
                    <div key={gap.setSlug} className="p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors cursor-pointer" onClick={() => { setFilters(f => ({ ...f, sets: [gap.setSlug] })); setOwnershipFilter('need'); }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">{gap.setIcon}</span>
                          <span className="text-xs font-semibold">{gap.setName}</span>
                        </div>
                        <span className="text-xs font-mono text-accent">{gap.owned}/{gap.total}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-background mb-2 overflow-hidden">
                        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${gap.pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {Object.entries(gap.missingByScarcity).map(([scarcity, count]) => (
                            <span key={scarcity} className="text-[8px] font-mono font-bold uppercase" style={{ color: SCARCITY_CONFIG[scarcity as keyof typeof SCARCITY_CONFIG]?.color }}>
                              {count}{scarcity[0]}
                            </span>
                          ))}
                        </div>
                        {gap.costToComplete > 0 && <span className="text-[9px] text-muted font-mono">${gap.costToComplete.toFixed(2)} to complete</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Undervalued */}
            {undervalued.length > 0 && (
              <section className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2"><span className="text-green-400">💰</span> Below Average Price</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {undervalued.map((card, i) => (
                    <motion.div key={card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex-shrink-0 relative cursor-pointer" onClick={() => setQuickViewCard(card)}>
                      <CardItem card={card} size="sm" showPrice interactive={false} />
                      <div className="absolute top-1.5 left-7 px-1.5 py-0.5 rounded bg-green-500/80 backdrop-blur-sm z-10">
                        <span className="text-[9px] font-mono font-bold text-white">-{card.discount.toFixed(0)}%</span>
                      </div>
                      {renderOwnedBadge(card.id)}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            <RecentActivity />
          </>)}

          {/* Results header */}
          {isSearchActive && (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted">{results.length} results</span>
                {ownershipFilter !== 'all' && <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${ownershipFilter === 'need' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>{ownershipFilter === 'need' ? 'Need only' : 'Owned only'}</span>}
              </div>
              {bulkMode && bulkSelected.size > 0 && <button onClick={handleBuyBulk} className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-colors">Buy {bulkSelected.size} cards</button>}
            </div>
          )}

          {/* GRID VIEW — LARGE CARDS */}
          {viewMode === 'grid' && (
            <div className={`flex flex-wrap card-grid-perf ${compact ? 'gap-2' : 'gap-4'} justify-center sm:justify-start`}>
              <AnimatePresence mode="popLayout">
                {results.slice(0, visibleCount).map((card, i) => {
                  const data = getCardMarketData(card.id); const watched = watchlist.includes(card.id); const inBulk = bulkSelected.has(card.id);
                  const owned = ownedIds.has(card.id);
                  const isHotDeal = data && data.currentPrice < data.floorPrice * 1.05;
                  const isFocused = focusedIdx === i;
                  return (
                    <motion.div key={card.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15, delay: Math.min(i * 0.012, 0.3) }} className={`relative group ${isFocused ? 'ring-2 ring-accent ring-offset-1 ring-offset-background rounded-xl' : ''}`}>
                      {bulkMode ? (
                        <div onClick={() => toggleBulkSelect(card.id)} className={`cursor-pointer rounded-xl transition-all ${inBulk ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}`}>
                          <CardItem card={card} size={compact ? 'md' : 'lg'} showPrice interactive={false} />
                          {inBulk && <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-accent text-white text-sm flex items-center justify-center z-10 font-bold">✓</div>}
                        </div>
                      ) : (
                        <div className="cursor-pointer" onClick={() => setQuickViewCard(card)}>
                          <CardItem card={card} size={compact ? 'md' : 'lg'} showPrice interactive={false} />
                          {/* Hover overlay with market data */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-3 pointer-events-none group-hover:pointer-events-auto">
                            <div className="flex items-end justify-between">
                              <div>
                                {data && <div className="flex items-center gap-1.5 mb-1">
                                  {renderTrend(data.change24h)}
                                  <span className="text-[9px] text-white/50 font-mono">vol {data.volume7d}</span>
                                </div>}
                                {data && <div className="flex items-center gap-2 text-[9px]">
                                  <span className="text-white/40">Floor <span className="text-white/70 font-mono">${data.floorPrice.toFixed(2)}</span></span>
                                  <span className="text-white/40">Avg <span className="text-white/70 font-mono">${data.avgPrice7d.toFixed(2)}</span></span>
                                </div>}
                              </div>
                              <div className="flex gap-1">
                                {!owned && <button onClick={(e) => { e.stopPropagation(); handleBuyCard(card); }} className="px-3 py-1.5 rounded-lg bg-accent text-white text-[10px] font-bold hover:bg-accent/90 transition-colors">Buy</button>}
                                <button onClick={(e) => { e.stopPropagation(); toggleWatchlist(card.id); }} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${watched ? 'bg-yellow-500/80 text-white' : 'bg-white/10 text-white/60 hover:text-yellow-400'}`}>{watched ? '★' : '☆'}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {renderOwnedBadge(card.id)}
                      {isHotDeal && !bulkMode && <div className="absolute top-2 left-2 z-20"><span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/90 text-white font-bold uppercase">Near Floor</span></div>}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="space-y-1.5">
              <AnimatePresence mode="popLayout">
                {results.slice(0, visibleCount).map((card, i) => {
                  const data = getCardMarketData(card.id); const watched = watchlist.includes(card.id); const owned = ownedIds.has(card.id);
                  return (
                    <motion.div key={card.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.12, delay: Math.min(i * 0.008, 0.15) }}>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors group cursor-pointer" onClick={() => setQuickViewCard(card)}>
                        {bulkMode && <div onClick={(e) => { e.stopPropagation(); toggleBulkSelect(card.id); }} className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[8px] shrink-0 ${bulkSelected.has(card.id) ? 'bg-accent border-accent text-white' : 'border-border'}`}>{bulkSelected.has(card.id) && '✓'}</div>}
                        <div className="w-11 h-[60px] rounded-lg overflow-hidden flex-shrink-0 relative" style={{ background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`, border: `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}` }}><div className="absolute inset-0 flex items-center justify-center text-base">{card.symbol}</div></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold truncate">{filters.query ? highlightMatch(card.character, filters.query) : card.character}</span>
                            {card.parallel !== 'base' && <span className="text-[8px] px-1 py-0.5 rounded bg-surface-hover text-muted">{PARALLEL_CONFIG[card.parallel].label}</span>}
                            {owned && <span className="text-[8px] px-1 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">OWNED</span>}
                          </div>
                          <div className="text-[10px] text-muted truncate">{card.moment}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-mono font-bold uppercase" style={{ color: SCARCITY_CONFIG[card.scarcity].color }}>{SCARCITY_CONFIG[card.scarcity].label}</span>
                            {card.scarcity !== 'common' && <span className="text-[9px] font-mono text-muted">#{card.serialNumber}/{card.maxSerial}</span>}
                            <span className="text-[9px] text-muted/50">{card.set}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-green-400 font-mono">${card.price.toFixed(2)}</div>
                          {data && renderTrend(data.change24h)}
                          {data && <div className="text-[9px] text-muted/50 font-mono">vol {data.volume7d}</div>}
                        </div>
                        <div className="shrink-0 hidden sm:block">{renderSparkline(card.id)}</div>
                        <button onClick={(e) => { e.stopPropagation(); toggleWatchlist(card.id); }} className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 transition-colors ${watched ? 'text-yellow-400' : 'text-muted/20 group-hover:text-muted'}`}>{watched ? '★' : '☆'}</button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-surface border-b border-border text-muted uppercase tracking-wider text-[9px]">
                    {bulkMode && <th className="px-2 py-2 text-left w-6"></th>}
                    <th className="w-1"></th>
                    <th className="px-2.5 py-2 text-left">Card</th>
                    <th className="px-2.5 py-2 text-left hidden lg:table-cell">Set</th>
                    <th className="px-2.5 py-2 text-left">Scarcity</th>
                    <th className="px-2.5 py-2 text-left hidden md:table-cell">Parallel</th>
                    <th className="px-2.5 py-2 text-right hidden sm:table-cell cursor-pointer hover:text-accent" onClick={() => setFilters(f => ({ ...f, sortBy: f.sortBy === 'serial-asc' ? 'serial-desc' : 'serial-asc' }))}>Serial {filters.sortBy === 'serial-asc' ? '↑' : filters.sortBy === 'serial-desc' ? '↓' : ''}</th>
                    <th className="px-2.5 py-2 text-right cursor-pointer hover:text-accent" onClick={() => setFilters(f => ({ ...f, sortBy: f.sortBy === 'price-asc' ? 'price-desc' : 'price-asc' }))}>Price {filters.sortBy === 'price-asc' ? '↑' : filters.sortBy === 'price-desc' ? '↓' : ''}</th>
                    <th className="px-2.5 py-2 text-right">24h</th>
                    <th className="px-2.5 py-2 text-center hidden sm:table-cell">7d</th>
                    <th className="px-2.5 py-2 text-right hidden md:table-cell cursor-pointer hover:text-accent" onClick={() => setFilters(f => ({ ...f, sortBy: 'popular' }))}>Vol {filters.sortBy === 'popular' ? '↓' : ''}</th>
                    <th className="px-2.5 py-2 text-center w-7">★</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((card, ri) => {
                    const data = getCardMarketData(card.id); const watched = watchlist.includes(card.id); const inBulk = bulkSelected.has(card.id); const owned = ownedIds.has(card.id);
                    const isFocused = focusedIdx === ri;
                    return (
                      <tr key={card.id} className={`border-b border-border/30 hover:bg-surface-hover transition-colors cursor-pointer ${inBulk ? 'bg-accent/5' : ''} ${isFocused ? 'bg-accent/10' : ''}`} onClick={() => { if (bulkMode) toggleBulkSelect(card.id); else setQuickViewCard(card); }}>
                        {bulkMode && <td className="px-2 py-1.5"><div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center text-[7px] ${inBulk ? 'bg-accent border-accent text-white' : 'border-border'}`}>{inBulk && '✓'}</div></td>}
                        <td className="w-1 p-0"><div className="w-1 h-full" style={{ background: SCARCITY_CONFIG[card.scarcity].color }} /></td>
                        <td className={compact ? 'px-2 py-1' : 'px-2.5 py-1.5'}>
                          <div className="flex items-center gap-2">
                            {!compact && <div className="w-6 h-8 rounded flex-shrink-0 flex items-center justify-center text-xs" style={{ background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`, border: `1px solid ${SCARCITY_CONFIG[card.scarcity].color}40` }}>{card.symbol}</div>}
                            <div className="min-w-0">
                              <div className="font-semibold text-foreground truncate flex items-center gap-1">{compact && <span className="text-xs">{card.symbol}</span>}{filters.query ? highlightMatch(card.character, filters.query) : card.character}{owned && <span className="text-[7px] px-1 rounded bg-green-500/10 text-green-400 font-bold">OWN</span>}</div>
                              {!compact && <div className="text-[9px] text-muted truncate">{card.moment}</div>}
                            </div>
                          </div>
                        </td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-muted hidden lg:table-cell`}>{card.set}</td>
                        <td className={compact ? 'px-2 py-1' : 'px-2.5 py-1.5'}><span className="font-mono font-bold uppercase" style={{ color: SCARCITY_CONFIG[card.scarcity].color }}>{compact ? SCARCITY_CONFIG[card.scarcity].label[0] : SCARCITY_CONFIG[card.scarcity].label}</span></td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-muted capitalize hidden md:table-cell`}>{card.parallel === 'base' ? '-' : compact ? card.parallel[0].toUpperCase() : PARALLEL_CONFIG[card.parallel].label}</td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-right font-mono text-muted hidden sm:table-cell`}>{card.scarcity !== 'common' ? `#${card.serialNumber}/${card.maxSerial}` : '-'}</td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-right font-mono font-bold text-green-400`}>${card.price.toFixed(2)}</td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-right`}>{data && renderTrend(data.change24h)}</td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-center hidden sm:table-cell`}>{renderSparkline(card.id)}</td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-right font-mono text-muted hidden md:table-cell`}>{data?.volume7d || 0}</td>
                        <td className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} text-center`}><button onClick={(e) => { e.stopPropagation(); toggleWatchlist(card.id); }} className={`text-sm ${watched ? 'text-yellow-400' : 'text-muted/20 hover:text-muted'}`}>{watched ? '★' : '☆'}</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Progressive loading sentinel */}
          {visibleCount < results.length && <div ref={sentinelRef} className="h-4 w-full" />}

          {results.length === 0 && isSearchActive && (
            <div className="flex flex-col items-center justify-center h-60 text-center">
              <span className="text-4xl mb-3">🔍</span><h3 className="text-lg font-semibold mb-1">No results</h3>
              <p className="text-sm text-muted mb-4">Try different filters or search terms.</p>
              <button onClick={() => { setFilters(DEFAULT_FILTERS); setOwnershipFilter('all'); }} className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold">Clear All</button>
            </div>
          )}
        </>)}
      </div>

      {/* QUICK VIEW DRAWER */}
      <AnimatePresence>
        {quickViewCard && (
          <CardQuickView
            card={quickViewCard}
            marketData={getCardMarketData(quickViewCard.id)}
            isOwned={ownedIds.has(quickViewCard.id)}
            isWatched={watchlist.includes(quickViewCard.id)}
            onClose={() => setQuickViewCard(null)}
            onToggleWatch={() => toggleWatchlist(quickViewCard.id)}
            onBuy={() => handleBuyCard(quickViewCard)}
          />
        )}
      </AnimatePresence>

      {/* KEYBOARD SHORTCUTS MODAL */}
      <AnimatePresence>
        {showShortcuts && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowShortcuts(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-surface border border-border rounded-2xl p-5 z-50 shadow-2xl"
            >
              <h3 className="text-sm font-bold mb-3">Keyboard Shortcuts</h3>
              <div className="space-y-2 text-xs">
                {[
                  { key: '/', desc: 'Focus search' },
                  { key: 'Esc', desc: 'Close panel / clear focus' },
                  { key: 'j / ↓', desc: 'Next card' },
                  { key: 'k / ↑', desc: 'Previous card' },
                  { key: 'Enter', desc: 'Open focused card' },
                  { key: 'w', desc: 'Toggle watchlist on focused card' },
                  { key: '?', desc: 'Toggle this panel' },
                ].map(({ key, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px] text-muted">{key}</kbd>
                    <span className="text-muted">{desc}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowShortcuts(false)} className="mt-4 w-full py-2 rounded-xl bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors">Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
