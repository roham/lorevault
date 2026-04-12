'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, SCARCITY_CONFIG } from '@/data/types';

export default function MarketplacePage() {
  const [filterSet, setFilterSet] = useState<string>('all');
  const [filterScarcity, setFilterScarcity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-low');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const listings = useMemo(() => {
    let cards = ALL_CARDS.filter(c => c.listed);

    if (filterSet !== 'all') cards = cards.filter(c => c.setSlug === filterSet);
    if (filterScarcity !== 'all') cards = cards.filter(c => c.scarcity === filterScarcity);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.character.toLowerCase().includes(q) ||
        c.set.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-low':
        cards.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        cards.sort((a, b) => b.price - a.price);
        break;
      case 'scarcity':
        const order: Record<Scarcity, number> = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        cards.sort((a, b) => order[a.scarcity] - order[b.scarcity]);
        break;
      case 'serial':
        cards.sort((a, b) => a.serialNumber - b.serialNumber);
        break;
      case 'recent':
      default:
        break;
    }

    return cards;
  }, [filterSet, filterScarcity, sortBy, searchQuery]);

  const stats = {
    totalListings: listings.length,
    lowestPrice: listings.length ? Math.min(...listings.map(c => c.price)) : 0,
    highestPrice: listings.length ? Math.max(...listings.map(c => c.price)) : 0,
    avgPrice: listings.length ? listings.reduce((sum, c) => sum + c.price, 0) / listings.length : 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-sm text-muted">{stats.totalListings} active listings</p>
        </div>
        <div className="flex gap-4 text-xs text-muted">
          <div>Low: <span className="text-green-400 font-mono">${stats.lowestPrice.toFixed(2)}</span></div>
          <div>Avg: <span className="text-accent font-mono">${stats.avgPrice.toFixed(2)}</span></div>
          <div>High: <span className="text-legendary font-mono">${stats.highestPrice.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search marketplace..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent/50 w-56"
        />

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
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
        >
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="scarcity">Scarcity: Rarest First</option>
          <option value="serial">Serial: Lowest First</option>
          <option value="recent">Recently Listed</option>
        </select>
      </div>

      {/* Listings Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {listings.map((card, i) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.4) }}
              className="relative group"
            >
              <CardItem card={card} size="sm" showPrice onClick={() => setSelectedCard(card)} />
              {/* Quick buy button */}
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-2 left-2 right-2 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                Buy ${card.price.toFixed(2)}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {listings.length === 0 && (
        <div className="flex items-center justify-center h-40 text-muted text-sm">
          No listings match your filters
        </div>
      )}

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface rounded-2xl border border-border p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <CardItem card={selectedCard} size="lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold mb-1">{selectedCard.character}</h2>
                  <p className="text-sm text-muted mb-2">{selectedCard.moment}</p>
                  <p className="text-xs text-muted/70 mb-4">{selectedCard.set}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Scarcity</span>
                      <span style={{ color: SCARCITY_CONFIG[selectedCard.scarcity].color }} className="font-semibold">
                        {SCARCITY_CONFIG[selectedCard.scarcity].label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Parallel</span>
                      <span className="capitalize">{selectedCard.parallel === 'base' ? 'Base' : selectedCard.parallel}</span>
                    </div>
                    {selectedCard.scarcity !== 'common' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">Serial</span>
                        <span className="font-mono">#{selectedCard.serialNumber}/{selectedCard.maxSerial}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Price</span>
                      <span className="text-green-400 font-bold text-lg">${selectedCard.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted/60 italic mb-4 line-clamp-3">{selectedCard.loreText}</p>

                  <button className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors">
                    Buy Now — ${selectedCard.price.toFixed(2)}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
