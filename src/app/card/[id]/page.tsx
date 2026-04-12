'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';
import { getOwnedCardIds, addOwnedCards } from '@/lib/store';

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isOwned, setIsOwned] = useState(false);

  const card = ALL_CARDS.find(c => c.id === id);

  useEffect(() => {
    if (card) {
      setIsOwned(new Set(getOwnedCardIds()).has(card.id));
    }
  }, [card]);

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <span className="text-4xl mb-3">🔍</span>
        <h1 className="text-lg font-bold mb-2">Card Not Found</h1>
        <Link href="/collection" className="text-sm text-accent">← Back to Collection</Link>
      </div>
    );
  }

  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const parallelConfig = PARALLEL_CONFIG[card.parallel];
  const relatedCards = ALL_CARDS.filter(c => c.character === card.character && c.id !== card.id).slice(0, 6);

  // Mock price history
  const priceHistory = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: card.price * (0.7 + Math.random() * 0.6),
  }));
  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));

  return (
    <div className="min-h-screen pb-24">
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        <button onClick={() => window.history.back()} className="text-sm text-muted hover:text-foreground flex items-center gap-1">
          ← Back
        </button>
      </div>

      {/* Card — large, centered */}
      <div className="flex justify-center px-4 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <CardItem card={card} size="lg" />
        </motion.div>
      </div>

      {/* Card info */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Name + ownership */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h1 className="text-xl font-bold">{card.character}</h1>
              <p className="text-sm text-muted">{card.moment}</p>
            </div>
            {isOwned && (
              <span className="px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                ✓ Owned
              </span>
            )}
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: scarcityConfig.color, background: `${scarcityConfig.color}15`, border: `1px solid ${scarcityConfig.color}25` }}>
              {scarcityConfig.label}
            </span>
            {card.parallel !== 'base' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface border border-border capitalize">
                {parallelConfig.label}
              </span>
            )}
            {card.scarcity !== 'common' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-surface border border-border">
                #{card.serialNumber}/{card.maxSerial}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg text-xs bg-surface border border-border">
              {card.set}
            </span>
          </div>

          {/* Price section */}
          <div className="p-4 rounded-2xl bg-surface border border-border mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Price</div>
                <div className="text-2xl font-bold text-green-400">${card.price.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted uppercase tracking-wider">30d Range</div>
                <div className="text-xs font-mono text-muted">${minPrice.toFixed(2)} – ${maxPrice.toFixed(2)}</div>
              </div>
            </div>

            {/* Mini chart */}
            <div className="h-12 flex items-end gap-[1px] mb-2">
              {priceHistory.map((p, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${Math.max(((p.price - minPrice) / (maxPrice - minPrice)) * 100, 4)}%`,
                    background: p.price >= card.price ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.4)',
                    opacity: 0.5 + (i / priceHistory.length) * 0.5,
                  }}
                />
              ))}
            </div>

            {/* Buy/Own actions */}
            {isOwned ? (
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover">
                  List for Sale
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover">
                  Offer Trade
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90">
                  Buy — ${card.price.toFixed(2)}
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover">
                  Make Offer
                </button>
              </div>
            )}
          </div>

          {/* Lore text */}
          <div className="p-4 rounded-2xl bg-surface/50 border border-border/50 mb-6">
            <div className="text-[10px] text-muted uppercase tracking-wider mb-2">From the Source</div>
            <p className="text-sm text-foreground/70 italic leading-relaxed">{card.loreText}</p>
          </div>

          {/* Related cards */}
          {relatedCards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Other {card.character} Cards</h2>
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                {relatedCards.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <Link href={`/card/${c.id}`}>
                      <CardItem card={c} size="sm" showPrice />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
