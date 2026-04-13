'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import PriceChart from '@/components/marketplace/PriceChart';
import { Card, SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';
import { CardMarketData } from '@/lib/marketData';

interface CardQuickViewProps {
  card: Card;
  marketData: CardMarketData | null;
  isOwned: boolean;
  isWatched: boolean;
  onClose: () => void;
  onToggleWatch: () => void;
  onBuy: () => void;
}

export default function CardQuickView({
  card,
  marketData,
  isOwned,
  isWatched,
  onClose,
  onToggleWatch,
  onBuy,
}: CardQuickViewProps) {
  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];

  const renderTrend = (change: number, label: string) => {
    const isUp = change > 0;
    const color = Math.abs(change) < 0.5 ? 'text-muted' : isUp ? 'text-green-400' : 'text-red-400';
    return (
      <div className="text-center">
        <div className={`text-sm font-mono font-bold ${color}`}>
          {Math.abs(change) < 0.5 ? '--' : `${isUp ? '+' : ''}${change.toFixed(1)}%`}
        </div>
        <div className="text-[9px] text-muted uppercase">{label}</div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border/30 px-4 py-3 flex items-center justify-between z-10">
          <button onClick={onClose} className="text-muted hover:text-foreground text-sm">
            x Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatch}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isWatched
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                  : 'bg-surface border border-border text-muted hover:text-foreground'
              }`}
            >
              {isWatched ? '★ Watching' : '☆ Watch'}
            </button>
            <Link
              href={`/card/${card.id}`}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-muted hover:text-foreground"
            >
              Full Page →
            </Link>
          </div>
        </div>

        {/* Card preview */}
        <div className="flex justify-center px-4 py-6">
          <CardItem card={card} size="lg" />
        </div>

        {/* Info */}
        <div className="px-4 pb-6">
          {/* Name */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-lg font-bold">{card.character}</h2>
              <p className="text-sm text-muted">{card.moment}</p>
            </div>
            {isOwned && (
              <span className="px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                Owned
              </span>
            )}
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{
                color: scarcityConfig.color,
                background: `${scarcityConfig.color}15`,
                border: `1px solid ${scarcityConfig.color}25`,
              }}
            >
              {scarcityConfig.label}
            </span>
            {card.parallel !== 'base' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface border border-border capitalize">
                {PARALLEL_CONFIG[card.parallel].label}
              </span>
            )}
            {card.scarcity !== 'common' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface border border-border">
                #{card.serialNumber}/{card.maxSerial}
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] bg-surface border border-border">
              {card.set}
            </span>
          </div>

          {/* Price block */}
          {marketData && (
            <div className="p-4 rounded-xl bg-surface border border-border mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">Price</div>
                  <div className="text-xl font-bold text-green-400">
                    ${marketData.currentPrice.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {renderTrend(marketData.change24h, '24h')}
                  {renderTrend(marketData.change7d, '7d')}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-2 mb-3 p-2.5 rounded-lg bg-background/50 text-center">
                <div>
                  <div className="text-[11px] font-mono font-bold">${marketData.floorPrice.toFixed(2)}</div>
                  <div className="text-[8px] text-muted uppercase">Floor</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold">${marketData.avgPrice7d.toFixed(2)}</div>
                  <div className="text-[8px] text-muted uppercase">7d Avg</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold">{marketData.volume7d}</div>
                  <div className="text-[8px] text-muted uppercase">7d Vol</div>
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold">{marketData.totalListings}</div>
                  <div className="text-[8px] text-muted uppercase">Listed</div>
                </div>
              </div>

              {/* Chart */}
              <PriceChart
                data30d={marketData.priceHistory30d}
                data90d={marketData.priceHistory90d}
                currentPrice={marketData.currentPrice}
                height={80}
              />
            </div>
          )}

          {/* Buy/action buttons */}
          <div className="flex gap-2">
            {isOwned ? (
              <>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">
                  List for Sale
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">
                  Offer Trade
                </button>
              </>
            ) : (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onBuy}
                  className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors"
                >
                  Buy — ${marketData?.currentPrice.toFixed(2) || card.price.toFixed(2)}
                </motion.button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">
                  Make Offer
                </button>
              </>
            )}
          </div>

          {/* Lore */}
          <div className="mt-4 p-3 rounded-xl bg-surface/50 border border-border/50">
            <p className="text-xs text-foreground/60 italic leading-relaxed">{card.loreText}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
