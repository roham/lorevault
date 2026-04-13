'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { Card, Scarcity, SCARCITY_CONFIG } from '@/data/types';
import { SETS } from '@/data/sets';
import { getOwnedCards } from '@/lib/store';
import {
  AutoCollection,
  getAutoCollections,
  SortOption,
  SORT_OPTIONS,
  sortCards,
  FilterPreset,
  getFilterPresets,
  saveFilterPreset,
  deleteFilterPreset,
} from '@/lib/smart-collections';

// ---------------------------------------------------------------------------
// Auto-Collection Row
// ---------------------------------------------------------------------------
function CollectionRow({ collection, expanded, onToggle }: {
  collection: AutoCollection;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left p-4 rounded-xl bg-surface border border-border hover:border-border/60 transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{collection.icon}</span>
          <div>
            <h3 className="text-sm font-bold group-hover:text-accent transition-colors">{collection.name}</h3>
            <p className="text-[10px] text-muted">{collection.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted font-mono">{collection.cards.length} cards</span>
          <motion.svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            animate={{ rotate: expanded ? 180 : 0 }}
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted" />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 flex flex-wrap gap-4">
              {collection.cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link href={`/card/${card.id}`}>
                    <CardItem card={card} size="md" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Smart View — sorted/filtered view with preset management
// ---------------------------------------------------------------------------
function SmartView({ ownedCards }: { ownedCards: Card[] }) {
  const [sortBy, setSortBy] = useState<SortOption>('scarcity');
  const [filterSet, setFilterSet] = useState('all');
  const [filterScarcity, setFilterScarcity] = useState('all');
  const [filterParallel, setFilterParallel] = useState('all');
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    setPresets(getFilterPresets());
  }, []);

  const filtered = useMemo(() => {
    let cards = [...ownedCards];
    if (filterSet !== 'all') cards = cards.filter(c => c.setSlug === filterSet);
    if (filterScarcity !== 'all') cards = cards.filter(c => c.scarcity === filterScarcity);
    if (filterParallel !== 'all') cards = cards.filter(c => c.parallel === filterParallel);
    return sortCards(cards, sortBy);
  }, [ownedCards, filterSet, filterScarcity, filterParallel, sortBy]);

  function handleSavePreset() {
    if (!presetName.trim()) return;
    const preset = saveFilterPreset({
      name: presetName.trim(),
      filterSet,
      filterScarcity,
      filterParallel,
      sortBy,
    });
    setPresets([...presets, preset]);
    setPresetName('');
    setShowSavePreset(false);
  }

  function handleLoadPreset(preset: FilterPreset) {
    setFilterSet(preset.filterSet);
    setFilterScarcity(preset.filterScarcity);
    setFilterParallel(preset.filterParallel);
    setSortBy(preset.sortBy);
  }

  function handleDeletePreset(id: string) {
    deleteFilterPreset(id);
    setPresets(presets.filter(p => p.id !== id));
  }

  return (
    <div>
      {/* Presets */}
      {presets.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-4 pb-2 no-scrollbar">
          {presets.map(p => (
            <div key={p.id} className="flex-shrink-0 relative group">
              <button
                onClick={() => handleLoadPreset(p)}
                className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium border border-accent/20 hover:bg-accent/20 transition-colors"
              >
                {p.name}
              </button>
              <button
                onClick={() => handleDeletePreset(p.id)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500/80 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>Sort: {o.label}</option>
          ))}
        </select>

        <select
          value={filterSet}
          onChange={(e) => setFilterSet(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
        >
          <option value="all">All Sets</option>
          {SETS.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>

        <select
          value={filterScarcity}
          onChange={(e) => setFilterScarcity(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
        >
          <option value="all">All Scarcities</option>
          {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as Scarcity[]).map(s => (
            <option key={s} value={s}>{SCARCITY_CONFIG[s].label}</option>
          ))}
        </select>

        <select
          value={filterParallel}
          onChange={(e) => setFilterParallel(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
        >
          <option value="all">All Parallels</option>
          <option value="base">Base</option>
          <option value="silver">Silver Frame</option>
          <option value="gold">Gold Frame</option>
          <option value="holographic">Holographic</option>
          <option value="obsidian">Obsidian</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted">{filtered.length} cards</span>
          {showSavePreset ? (
            <div className="flex gap-1">
              <input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                placeholder="Preset name..."
                className="px-2 py-1 rounded text-xs bg-surface border border-accent/30 text-foreground outline-none w-28"
                autoFocus
              />
              <button onClick={handleSavePreset} className="px-2 py-1 rounded bg-accent text-white text-xs">Save</button>
              <button onClick={() => setShowSavePreset(false)} className="px-2 py-1 rounded bg-surface text-muted text-xs border border-border">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setShowSavePreset(true)}
              className="px-3 py-1.5 rounded-lg bg-surface text-muted text-xs border border-border hover:text-foreground hover:border-border/60 transition-colors"
            >
              Save View
            </button>
          )}
        </div>
      </div>

      {/* Card grid */}
      <div className="flex flex-wrap gap-4">
        {filtered.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(i * 0.02, 0.3) }}
          >
            <Link href={`/card/${card.id}`}>
              <CardItem card={card} size="md" />
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted text-sm">
          No cards match your filters
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Smart Organization Page
// ---------------------------------------------------------------------------
export default function SmartOrganizationPage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'browse'>('auto');
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);

  useEffect(() => {
    setOwnedCards(getOwnedCards());
    setLoaded(true);
  }, []);

  const autoCollections = useMemo(() => getAutoCollections(ownedCards), [ownedCards]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/collection" className="text-muted hover:text-foreground transition-colors text-sm">
          Collection
        </Link>
        <span className="text-muted/30">/</span>
        <h1 className="text-2xl font-bold">Smart Organization</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('auto')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'auto'
              ? 'bg-accent text-white shadow-lg shadow-accent/20'
              : 'bg-surface text-muted border border-border'
          }`}
        >
          Auto-Collections
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'browse'
              ? 'bg-accent text-white shadow-lg shadow-accent/20'
              : 'bg-surface text-muted border border-border'
          }`}
        >
          Browse & Sort
        </button>
      </div>

      {/* Content */}
      {activeTab === 'auto' && (
        <div>
          {autoCollections.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📦</span>
              <p className="text-muted">Open more packs to unlock smart collections</p>
            </div>
          )}
          {autoCollections.map(col => (
            <CollectionRow
              key={col.id}
              collection={col}
              expanded={expandedCollection === col.id}
              onToggle={() => setExpandedCollection(expandedCollection === col.id ? null : col.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'browse' && (
        <SmartView ownedCards={ownedCards} />
      )}
    </div>
  );
}
