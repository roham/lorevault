'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import PriceChart from '@/components/marketplace/PriceChart';
import { ALL_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';
import { getOwnedCardIds, addOwnedCards, getBattleRecords, getCardMeta, getAgingTiers, type AgingTiers } from '@/lib/store';
import CardJourney from '@/components/CardJourney';
import { CardEvent } from '@/data/types';
import {
  getCardMarketData,
  isWatchlisted,
  addToWatchlist,
  removeFromWatchlist,
} from '@/lib/marketData';
import {
  StatKey, STAT_LABELS, STAT_ICONS, STAT_COLORS,
  getCharacterStats, getEffectiveStat,
} from '@/data/stats';

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isOwned, setIsOwned] = useState(false);
  const [watched, setWatched] = useState(false);
  const [bought, setBought] = useState(false);
  const [cardBattleStats, setCardBattleStats] = useState<{ wins: number; total: number }>({ wins: 0, total: 0 });
  const [agingTiers, setAgingTiers] = useState<AgingTiers | null>(null);
  const [cardHistory, setCardHistory] = useState<{ history: CardEvent[]; acquiredAt: string } | null>(null);

  const card = ALL_CARDS.find(c => c.id === id);
  const marketData = card ? getCardMarketData(card.id) : null;

  useEffect(() => {
    if (card) {
      setIsOwned(new Set(getOwnedCardIds()).has(card.id));
      setWatched(isWatchlisted(card.id));

      // Calculate per-card battle record
      const records = getBattleRecords();
      let wins = 0;
      let total = 0;
      for (const record of records) {
        for (const round of record.rounds) {
          if (round.playerCardId === card.id) {
            total++;
            if (round.playerWon) wins++;
          }
        }
      }
      setCardBattleStats({ wins, total });
      setAgingTiers(getAgingTiers(card.id));
      const meta = getCardMeta();
      const m = meta[card.id];
      if (m?.history) {
        setCardHistory({ history: m.history, acquiredAt: m.acquiredAt });
      }
    }
  }, [card]);

  const toggleWatch = useCallback(() => {
    if (!card) return;
    if (watched) {
      removeFromWatchlist(card.id);
      setWatched(false);
    } else {
      addToWatchlist(card.id);
      setWatched(true);
    }
  }, [card, watched]);

  const handleBuy = useCallback(() => {
    if (!card) return;
    addOwnedCards([card.id]);
    setIsOwned(true);
    setBought(true);
    setTimeout(() => setBought(false), 2000);
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
    <div className="min-h-screen pb-24">
      {/* Back button */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button onClick={() => window.history.back()} className="text-sm text-muted hover:text-foreground flex items-center gap-1">
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleWatch}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              watched ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' : 'bg-surface border border-border text-muted hover:text-foreground'
            }`}
          >
            {watched ? '★ Watching' : '☆ Watch'}
          </button>
          <Link
            href="/marketplace"
            className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-muted hover:text-foreground"
          >
            Marketplace
          </Link>
        </div>
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
            {agingTiers?.battle === 'pristine' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: '#e0e7ff', background: '#e0e7ff15', border: '1px solid #e0e7ff25' }}>✦ Pristine</span>
            )}
            {agingTiers?.battle === 'seasoned' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: '#d4a76a', background: '#d4a76a15', border: '1px solid #d4a76a25' }}>⚔ Seasoned</span>
            )}
            {agingTiers?.battle === 'battle-worn' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: '#c0855c', background: '#c0855c15', border: '1px solid #c0855c25' }}>⚔ Battle-Worn</span>
            )}
            {agingTiers?.battle === 'veteran' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: '#b8860b', background: '#b8860b15', border: '1px solid #b8860b25' }}>🏛 Veteran</span>
            )}
            {agingTiers?.time === 'bonded' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: '#ffb43c', background: '#ffb43c15', border: '1px solid #ffb43c25' }}>♥ Bonded</span>
            )}
            {agingTiers?.time === 'ancient' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ color: '#d4a030', background: '#d4a03015', border: '1px solid #d4a03025' }}>⏳ Ancient</span>
            )}
          </div>

          {/* Price + Market Data section */}
          <div className="p-4 rounded-2xl bg-surface border border-border mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Current Price</div>
                <div className="text-2xl font-bold text-green-400">
                  ${marketData ? marketData.currentPrice.toFixed(2) : card.price.toFixed(2)}
                </div>
              </div>
              {marketData && (
                <div className="flex items-center gap-4">
                  {renderTrend(marketData.change24h, '24h')}
                  {renderTrend(marketData.change7d, '7d')}
                  {renderTrend(marketData.change30d, '30d')}
                </div>
              )}
            </div>

            {/* Market stats row */}
            {marketData && (
              <div className="grid grid-cols-4 gap-2 mb-4 p-3 rounded-xl bg-background/50">
                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-foreground">${marketData.floorPrice.toFixed(2)}</div>
                  <div className="text-[9px] text-muted">Floor</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-foreground">${marketData.avgPrice7d.toFixed(2)}</div>
                  <div className="text-[9px] text-muted">7d Avg</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-foreground">{marketData.volume7d}</div>
                  <div className="text-[9px] text-muted">7d Vol</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-foreground">{marketData.totalListings}</div>
                  <div className="text-[9px] text-muted">Listed</div>
                </div>
              </div>
            )}

            {/* Price chart */}
            {marketData && (
              <div className="mb-4">
                <PriceChart
                  data30d={marketData.priceHistory30d}
                  data90d={marketData.priceHistory90d}
                  currentPrice={marketData.currentPrice}
                  height={100}
                />
              </div>
            )}

            {/* All-time range */}
            {marketData && (
              <div className="flex items-center justify-between px-1 mb-4">
                <div className="text-[10px] text-muted">
                  ATL: <span className="font-mono text-red-400">${marketData.lowAllTime.toFixed(2)}</span>
                </div>
                <div className="flex-1 mx-3 h-1 rounded-full bg-background relative">
                  <div
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{
                      left: '0%',
                      width: `${Math.min(((marketData.currentPrice - marketData.lowAllTime) / (marketData.highAllTime - marketData.lowAllTime)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="text-[10px] text-muted">
                  ATH: <span className="font-mono text-green-400">${marketData.highAllTime.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Buy/Own actions */}
            {bought ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center"
              >
                <span className="text-green-400 font-bold text-sm">Added to your collection!</span>
              </motion.div>
            ) : isOwned ? (
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">
                  List for Sale
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">
                  Offer Trade
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBuy}
                  className="flex-1 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors"
                >
                  Buy — ${marketData ? marketData.currentPrice.toFixed(2) : card.price.toFixed(2)}
                </motion.button>
                <button className="flex-1 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">
                  Make Offer
                </button>
              </div>
            )}
          </div>

          {/* Battle Stats */}
          {(() => {
            const baseStats = getCharacterStats(card.character);
            const stats: StatKey[] = ['power', 'intelligence', 'mystery', 'legend', 'charm'];
            return (
              <div className="p-4 rounded-2xl bg-surface border border-border mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[10px] text-muted uppercase tracking-wider">Battle Stats</div>
                  {cardBattleStats.total > 0 && (
                    <div className="text-[10px] text-muted">
                      <span className="text-green-400 font-bold">{cardBattleStats.wins}</span>
                      {' '}wins / {cardBattleStats.total} battles
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {stats.map(stat => {
                    const value = getEffectiveStat(baseStats, stat, card.scarcity, card.parallel);
                    return (
                      <div key={stat} className="flex items-center gap-2">
                        <span className="text-sm w-5">{STAT_ICONS[stat]}</span>
                        <span className="text-[10px] font-medium text-muted w-20">{STAT_LABELS[stat]}</span>
                        <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: STAT_COLORS[stat] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold w-6 text-right" style={{ color: STAT_COLORS[stat] }}>
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {isOwned && (
                  <Link
                    href="/games/battle"
                    className="block mt-3 text-center py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
                  >
                    ⚔️ Take to Battle
                  </Link>
                )}
              </div>
            );
          })()}

          {/* Card Journey — provenance timeline */}
          {isOwned && cardHistory && (
            <CardJourney history={cardHistory.history} acquiredAt={cardHistory.acquiredAt} />
          )}

          {/* Lore text */}
          <div className="p-4 rounded-2xl bg-surface/50 border border-border/50 mb-6">
            <div className="text-[10px] text-muted uppercase tracking-wider mb-2">From the Source</div>
            <p className="text-sm text-foreground/70 italic leading-relaxed">{card.loreText}</p>
          </div>

          {/* Related cards */}
          {relatedCards.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Other {card.character} Cards</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
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
