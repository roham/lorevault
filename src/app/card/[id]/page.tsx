'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';
import { getOwnedCardIds } from '@/lib/store';

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [isOwned, setIsOwned] = useState(false);

  useEffect(() => {
    const owned = new Set(getOwnedCardIds());
    setIsOwned(owned.has(id));
  }, []);
  const { id } = use(params);
  const card = ALL_CARDS.find(c => c.id === id);

  if (!card) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
        <Link href="/collection" className="text-accent hover:underline">Back to Collection</Link>
      </div>
    );
  }

  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const parallelConfig = PARALLEL_CONFIG[card.parallel];

  // Find other cards from same character
  const relatedCards = ALL_CARDS.filter(c => c.character === card.character && c.id !== card.id).slice(0, 4);

  // Find other listings of same card (simulate different serials)
  const otherListings = ALL_CARDS
    .filter(c => c.character === card.character && c.moment === card.moment && c.listed && c.id !== card.id)
    .slice(0, 5);

  // Mock price history
  const priceHistory = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: card.price * (0.7 + Math.random() * 0.6),
  }));

  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/collection" className="hover:text-accent">Collection</Link>
        <span>/</span>
        <Link href={`/collection?set=${card.setSlug}`} className="hover:text-accent">{card.set}</Link>
        <span>/</span>
        <span className="text-foreground">{card.character}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Card display */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-center"
        >
          <CardItem card={card} size="lg" />
        </motion.div>

        {/* Card info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold mb-1">{card.character}</h1>
          <p className="text-lg text-muted mb-1">{card.moment}</p>
          <p className="text-sm text-muted/60 mb-4">{card.set}</p>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-surface border border-border">
              <div className="text-xs text-muted mb-1">Scarcity</div>
              <div className="font-semibold" style={{ color: scarcityConfig.color }}>
                {scarcityConfig.label}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-surface border border-border">
              <div className="text-xs text-muted mb-1">Parallel</div>
              <div className="font-semibold capitalize">{parallelConfig.label}</div>
            </div>
            {card.scarcity !== 'common' && (
              <div className="p-3 rounded-lg bg-surface border border-border">
                <div className="text-xs text-muted mb-1">Serial Number</div>
                <div className="font-semibold font-mono">#{card.serialNumber} / {card.maxSerial}</div>
              </div>
            )}
            <div className="p-3 rounded-lg bg-surface border border-border">
              <div className="text-xs text-muted mb-1">Set</div>
              <div className="font-semibold">{card.set}</div>
            </div>
          </div>

          {/* Price */}
          <div className="p-4 rounded-xl bg-surface border border-border mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted">Current Price</div>
                <div className="text-3xl font-bold text-green-400">${card.price.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">30d Range</div>
                <div className="text-sm font-mono text-muted">
                  ${minPrice.toFixed(2)} — ${maxPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Mini chart */}
            <div className="h-16 flex items-end gap-[2px]">
              {priceHistory.map((p, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-colors hover:opacity-80"
                  style={{
                    height: `${((p.price - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    minHeight: '4px',
                    background: p.price >= card.price ? '#22c55e' : '#ef4444',
                    opacity: 0.6 + (i / priceHistory.length) * 0.4,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted">
              <span>30d ago</span>
              <span>Today</span>
            </div>
          </div>

          {/* Buy/Own indicator */}
          {isOwned ? (
            <div className="w-full py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-sm text-center mb-3">
              ✓ You own this card
            </div>
          ) : (
            <>
              <button className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors mb-3">
                Buy Now — ${card.price.toFixed(2)}
              </button>
              <button className="w-full py-3 rounded-xl bg-surface border border-border text-foreground font-semibold text-sm hover:bg-surface-hover transition-colors">
                Make an Offer
              </button>
            </>
          )}

          {/* Lore */}
          <div className="mt-6 p-4 rounded-xl bg-surface/50 border border-border/50">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-2">From the Source</h3>
            <p className="text-sm text-foreground/70 italic leading-relaxed">{card.loreText}</p>
          </div>
        </motion.div>
      </div>

      {/* Related cards */}
      {relatedCards.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-4">More {card.character} Cards</h2>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {relatedCards.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/card/${c.id}`}>
                  <CardItem card={c} size="sm" showPrice />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
