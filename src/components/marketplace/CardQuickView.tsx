'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import PriceChart from '@/components/marketplace/PriceChart';
import { Card, SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';
import { CardMarketData, addPriceAlert, getPriceAlerts, removePriceAlert } from '@/lib/marketData';

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
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertDirection, setAlertDirection] = useState<'below' | 'above'>('below');
  const [alertSet, setAlertSet] = useState(false);

  const existingAlert = getPriceAlerts().find(a => a.cardId === card.id);

  const handleSetAlert = () => {
    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) return;
    addPriceAlert(card.id, price, alertDirection);
    setAlertSet(true);
    setShowAlertForm(false);
    setTimeout(() => setAlertSet(false), 2000);
  };

  const handleRemoveAlert = () => {
    removePriceAlert(card.id);
    setAlertSet(false);
  };

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border/30 px-4 py-3 flex items-center justify-between z-10">
          <button onClick={onClose} className="text-muted hover:text-foreground text-sm">x Close</button>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatch}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isWatched ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' : 'bg-surface border border-border text-muted hover:text-foreground'}`}
            >
              {isWatched ? '★ Watching' : '☆ Watch'}
            </button>
            <Link href={`/card/${card.id}`} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-muted hover:text-foreground">
              Full Page →
            </Link>
          </div>
        </div>

        {/* Card preview */}
        <div className="flex justify-center px-4 py-5">
          <CardItem card={card} size="lg" />
        </div>

        <div className="px-4 pb-6">
          {/* Name */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-lg font-bold">{card.character}</h2>
              <p className="text-sm text-muted">{card.moment}</p>
            </div>
            {isOwned && (
              <span className="px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">Owned</span>
            )}
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ color: scarcityConfig.color, background: `${scarcityConfig.color}15`, border: `1px solid ${scarcityConfig.color}25` }}>
              {scarcityConfig.label}
            </span>
            {card.parallel !== 'base' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface border border-border capitalize">{PARALLEL_CONFIG[card.parallel].label}</span>
            )}
            {card.scarcity !== 'common' && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface border border-border">#{card.serialNumber}/{card.maxSerial}</span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] bg-surface border border-border">{card.set}</span>
          </div>

          {/* Price block */}
          {marketData && (
            <div className="p-4 rounded-xl bg-surface border border-border mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[9px] text-muted uppercase tracking-wider">Price</div>
                  <div className="text-xl font-bold text-green-400 font-mono">${marketData.currentPrice.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3">
                  {renderTrend(marketData.change24h, '24h')}
                  {renderTrend(marketData.change7d, '7d')}
                  {renderTrend(marketData.change30d, '30d')}
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

              {/* ATH/ATL range */}
              <div className="flex items-center justify-between px-1 mb-3">
                <div className="text-[9px] text-muted">ATL: <span className="font-mono text-red-400">${marketData.lowAllTime.toFixed(2)}</span></div>
                <div className="flex-1 mx-2 h-1 rounded-full bg-background relative">
                  <div className="absolute top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${Math.min(((marketData.currentPrice - marketData.lowAllTime) / (marketData.highAllTime - marketData.lowAllTime)) * 100, 100)}%` }} />
                </div>
                <div className="text-[9px] text-muted">ATH: <span className="font-mono text-green-400">${marketData.highAllTime.toFixed(2)}</span></div>
              </div>

              {/* Chart */}
              <PriceChart data30d={marketData.priceHistory30d} data90d={marketData.priceHistory90d} currentPrice={marketData.currentPrice} height={80} />
            </div>
          )}

          {/* Price alert */}
          <div className="mb-4">
            {alertSet ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-center">
                <span className="text-accent text-xs font-bold">Price alert set!</span>
              </motion.div>
            ) : existingAlert ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                <div>
                  <div className="text-[10px] text-muted uppercase tracking-wider">Price Alert Active</div>
                  <div className="text-sm font-mono font-bold text-accent">
                    {existingAlert.direction === 'below' ? '↓' : '↑'} ${existingAlert.targetPrice.toFixed(2)}
                  </div>
                </div>
                <button onClick={handleRemoveAlert} className="text-[10px] text-red-400 hover:text-red-300 font-medium">Remove</button>
              </div>
            ) : showAlertForm ? (
              <div className="p-3 rounded-xl bg-surface border border-border space-y-2">
                <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">Set Price Alert</div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setAlertDirection('below')}
                      className={`px-2.5 py-1 text-[10px] font-semibold ${alertDirection === 'below' ? 'bg-green-500/80 text-white' : 'bg-surface text-muted'}`}
                    >↓ Below</button>
                    <button
                      onClick={() => setAlertDirection('above')}
                      className={`px-2.5 py-1 text-[10px] font-semibold ${alertDirection === 'above' ? 'bg-red-500/80 text-white' : 'bg-surface text-muted'}`}
                    >↑ Above</button>
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-xs">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={alertPrice}
                      onChange={(e) => setAlertPrice(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSetAlert(); }}
                      placeholder={marketData ? (marketData.currentPrice * 0.9).toFixed(2) : '0.00'}
                      className="w-full pl-6 pr-2 py-1 rounded-lg bg-background border border-border text-sm text-foreground font-mono focus:outline-none focus:border-accent/50"
                      autoFocus
                    />
                  </div>
                  <button onClick={handleSetAlert} className="px-3 py-1 rounded-lg bg-accent text-white text-xs font-bold">Set</button>
                </div>
                <button onClick={() => setShowAlertForm(false)} className="text-[10px] text-muted hover:text-foreground">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => { setShowAlertForm(true); setAlertPrice(marketData ? (marketData.currentPrice * 0.9).toFixed(2) : ''); }}
                className="w-full py-2 rounded-xl bg-surface border border-border text-xs text-muted hover:text-foreground hover:bg-surface-hover transition-colors font-medium"
              >
                🔔 Set Price Alert
              </button>
            )}
          </div>

          {/* Buy/action buttons */}
          <div className="flex gap-2">
            {isOwned ? (
              <>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">List for Sale</button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">Offer Trade</button>
              </>
            ) : (
              <>
                <motion.button whileTap={{ scale: 0.95 }} onClick={onBuy} className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors">
                  Buy — ${marketData?.currentPrice.toFixed(2) || card.price.toFixed(2)}
                </motion.button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">Make Offer</button>
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
