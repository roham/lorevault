'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ALL_CARDS } from '@/data/cards';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { getCardMarketData, CardMarketData } from '@/lib/marketData';

// ===== Types =====
type MoversTab = 'gainers' | 'losers' | 'volume' | 'whale' | 'floor';

interface CardWithMarket {
  card: Card;
  data: CardMarketData;
}

// ===== Seeded random for deterministic whale data =====
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ===== Sparkline =====
function MiniSparkline({ cardId }: { cardId: string }) {
  const data = getCardMarketData(cardId);
  if (!data) return null;
  const pts = data.priceHistory30d.slice(-7);
  const prices = pts.map(p => p.price);
  const pMax = Math.max(...prices);
  const pMin = Math.min(...prices);
  const spread = pMax - pMin || 1;
  const isUp = pts[pts.length - 1].price >= pts[0].price;
  const path = pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${(j / (pts.length - 1)) * 50} ${16 - ((p.price - pMin) / spread) * 12 - 2}`).join(' ');
  return (
    <svg viewBox="0 0 50 16" className="w-[50px] h-4 flex-shrink-0" preserveAspectRatio="none">
      <path d={path} fill="none" stroke={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ===== Market Overview Header =====
function MarketOverview() {
  const allData = useMemo(() => {
    return ALL_CARDS.map(c => ({ card: c, data: getCardMarketData(c.id)! })).filter(x => x.data);
  }, []);

  const totalMarketCap = useMemo(() =>
    allData.reduce((sum, { card, data }) => sum + data.currentPrice * card.maxSerial, 0),
  [allData]);

  const volume24h = useMemo(() =>
    allData.reduce((sum, { data }) => sum + data.volume24h, 0),
  [allData]);

  const totalListed = useMemo(() =>
    allData.reduce((sum, { data }) => sum + data.totalListings, 0),
  [allData]);

  const totalSupply = useMemo(() =>
    ALL_CARDS.reduce((sum, c) => sum + c.maxSerial, 0),
  []);

  const avgChange = useMemo(() => {
    const changes = allData.map(({ data }) => data.change24h);
    return changes.reduce((a, b) => a + b, 0) / changes.length;
  }, [allData]);

  const sentiment = avgChange > 1.5 ? 'Bullish' : avgChange < -1.5 ? 'Bearish' : 'Neutral';
  const sentimentColor = sentiment === 'Bullish' ? 'text-green-400' : sentiment === 'Bearish' ? 'text-red-400' : 'text-yellow-400';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/10 rounded-xl overflow-hidden mb-4">
      {[
        { label: 'Market Cap', value: `$${(totalMarketCap / 1000).toFixed(0)}K` },
        { label: '24h Volume', value: `${volume24h} trades` },
        { label: 'Listed / Supply', value: `${((totalListed / totalSupply) * 100).toFixed(1)}%` },
        { label: 'Sentiment', value: sentiment, className: sentimentColor },
      ].map(stat => (
        <div key={stat.label} className="bg-surface px-3 py-2.5 text-center">
          <div className={`text-xs font-mono font-bold ${stat.className || 'text-foreground'}`}>{stat.value}</div>
          <div className="text-[8px] text-muted mt-0.5 uppercase tracking-wider">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// ===== Mover Row =====
function MoverRow({
  card,
  data,
  rank,
  mode,
  maxVolume,
}: {
  card: Card;
  data: CardMarketData;
  rank: number;
  mode: MoversTab;
  maxVolume?: number;
}) {
  const isGainer = mode === 'gainers' || data.change24h >= 0;

  return (
    <Link href={`/card/${card.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rank * 0.03 }}
        className={`flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.02] transition-colors border-b border-border/10 last:border-b-0 ${
          mode === 'losers' ? 'bg-red-500/[0.02]' : ''
        }`}
      >
        {/* Rank */}
        <span className="w-5 text-[10px] font-mono text-muted/40 text-right flex-shrink-0">{rank + 1}</span>

        {/* Card thumbnail */}
        <div
          className="w-8 h-11 rounded flex-shrink-0 flex items-center justify-center text-sm"
          style={{
            background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
            border: `1px solid ${SCARCITY_CONFIG[card.scarcity].color}40`,
          }}
        >
          {card.symbol}
        </div>

        {/* Name + scarcity */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium truncate">{card.character}</div>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[8px] font-bold uppercase"
              style={{ color: SCARCITY_CONFIG[card.scarcity].color }}
            >
              {card.scarcity}
            </span>
            <span className="text-[8px] text-muted truncate">{card.moment}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0 mr-1">
          <div className="text-[11px] font-mono font-bold">${data.currentPrice.toFixed(2)}</div>
          <div className={`text-[9px] font-mono font-bold ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(1)}%
          </div>
        </div>

        {/* Volume bar (only in volume tab) */}
        {mode === 'volume' && maxVolume && (
          <div className="w-16 flex-shrink-0">
            <div className="h-2 rounded-full bg-border/15 overflow-hidden mb-0.5">
              <div
                className="h-full rounded-full bg-accent/40"
                style={{ width: `${(data.volume24h / maxVolume) * 100}%` }}
              />
            </div>
            <div className="text-[8px] font-mono text-muted text-center">{data.volume24h} trades</div>
          </div>
        )}

        {/* Sparkline (non-volume tabs) */}
        {mode !== 'volume' && <MiniSparkline cardId={card.id} />}
      </motion.div>
    </Link>
  );
}

// ===== Whale Activity =====
function WhaleActivity() {
  const rand = useMemo(() => seededRandom(9999), []);
  const WHALE_NAMES = ['OceanVault', 'MythCollector', 'CryptoKing', 'DeepBlue', 'VaultHunter', 'LegendSeeker', 'NightOwl'];

  const events = useMemo(() => {
    const evts: { icon: string; text: string; time: string; amount: string }[] = [];
    for (let i = 0; i < 12; i++) {
      const card = ALL_CARDS[Math.floor(rand() * ALL_CARDS.length)];
      const data = getCardMarketData(card.id);
      if (!data) continue;
      const whale = WHALE_NAMES[Math.floor(rand() * WHALE_NAMES.length)];
      const qty = Math.floor(rand() * 5) + 2;
      const totalCost = data.currentPrice * qty;
      const hoursAgo = Math.floor(rand() * 24);

      if (rand() > 0.4) {
        evts.push({
          icon: '🐋',
          text: `${whale} bought ${qty}x ${card.character} ${card.scarcity}`,
          time: hoursAgo === 0 ? 'Just now' : `${hoursAgo}h ago`,
          amount: `$${totalCost.toFixed(2)}`,
        });
      } else {
        const set = card.set;
        evts.push({
          icon: '🏆',
          text: `${whale} completed the ${set} set`,
          time: `${hoursAgo}h ago`,
          amount: '',
        });
      }
    }
    return evts;
  }, [rand]);

  return (
    <div className="space-y-0">
      {events.map((evt, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-start gap-2.5 px-3 py-2.5 border-b border-border/10 last:border-b-0 hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-sm flex-shrink-0 mt-0.5">{evt.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-foreground/80">{evt.text}</div>
            <div className="text-[9px] text-muted mt-0.5">{evt.time}</div>
          </div>
          {evt.amount && (
            <span className="text-[11px] font-mono font-bold text-green-400 flex-shrink-0">{evt.amount}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ===== Floor Watch =====
function FloorWatch() {
  const floorDrops = useMemo(() => {
    return ALL_CARDS
      .map(card => {
        const data = getCardMarketData(card.id);
        if (!data) return null;
        const priceDrop = ((data.avgPrice30d - data.currentPrice) / data.avgPrice30d) * 100;
        return { card, data, priceDrop };
      })
      .filter((x): x is { card: Card; data: CardMarketData; priceDrop: number } => x !== null && x.priceDrop > 3)
      .sort((a, b) => b.priceDrop - a.priceDrop)
      .slice(0, 10);
  }, []);

  return (
    <div className="space-y-0">
      {floorDrops.map((item, i) => (
        <Link key={item.card.id} href={`/card/${item.card.id}`}>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-2.5 px-3 py-2 border-b border-border/10 last:border-b-0 hover:bg-white/[0.02] transition-colors"
          >
            <span className="w-5 text-[10px] font-mono text-muted/40 text-right flex-shrink-0">{i + 1}</span>
            <div
              className="w-8 h-11 rounded flex-shrink-0 flex items-center justify-center text-sm"
              style={{
                background: `linear-gradient(145deg, ${item.card.gradientFrom}, ${item.card.gradientTo})`,
                border: `1px solid ${SCARCITY_CONFIG[item.card.scarcity].color}40`,
              }}
            >
              {item.card.symbol}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium truncate">{item.card.character}</div>
              <div className="text-[8px] text-muted">{item.card.moment}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[11px] font-mono font-bold">${item.data.currentPrice.toFixed(2)}</div>
              <div className="text-[9px] text-muted line-through">${item.data.avgPrice30d.toFixed(2)}</div>
            </div>
            <div className="text-right flex-shrink-0 w-12">
              <span className="text-[10px] font-mono font-bold text-green-400">
                -{item.priceDrop.toFixed(0)}%
              </span>
              <div className="text-[8px] text-yellow-400/70">Below avg</div>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

// ===== Main Movers Component =====
export default function MarketMovers() {
  const [tab, setTab] = useState<MoversTab>('gainers');

  // Precompute all card market data
  const allCardData = useMemo((): CardWithMarket[] => {
    return ALL_CARDS
      .map(c => ({ card: c, data: getCardMarketData(c.id)! }))
      .filter(x => x.data);
  }, []);

  const gainers = useMemo(() =>
    [...allCardData].sort((a, b) => b.data.change24h - a.data.change24h).slice(0, 10),
  [allCardData]);

  const losers = useMemo(() =>
    [...allCardData].sort((a, b) => a.data.change24h - b.data.change24h).slice(0, 10),
  [allCardData]);

  const volumeLeaders = useMemo(() =>
    [...allCardData].sort((a, b) => b.data.volume24h - a.data.volume24h).slice(0, 10),
  [allCardData]);

  const maxVolume = useMemo(() =>
    volumeLeaders.length > 0 ? volumeLeaders[0].data.volume24h : 1,
  [volumeLeaders]);

  const tabs: { key: MoversTab; label: string; count?: number }[] = [
    { key: 'gainers', label: 'Gainers', count: gainers.length },
    { key: 'losers', label: 'Losers', count: losers.length },
    { key: 'volume', label: 'Volume' },
    { key: 'whale', label: 'Whales' },
    { key: 'floor', label: 'Deals' },
  ];

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      {/* Market Overview */}
      <div className="p-4 pb-2">
        <MarketOverview />
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-[108px] z-30 bg-surface border-b border-border/30">
        <div className="flex items-center gap-0 overflow-x-auto px-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-3 py-2.5 text-[11px] font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                tab === t.key ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`ml-1 text-[9px] ${tab === t.key ? 'text-accent/50' : 'text-muted/40'}`}>{t.count}</span>
              )}
              {tab === t.key && (
                <motion.div
                  layoutId="movers-tab"
                  className="absolute bottom-0 left-1 right-1 h-0.5 bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {tab === 'gainers' && (
          <motion.div key="gainers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {gainers.map((item, i) => (
              <MoverRow key={item.card.id} card={item.card} data={item.data} rank={i} mode="gainers" />
            ))}
          </motion.div>
        )}

        {tab === 'losers' && (
          <motion.div key="losers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {losers.map((item, i) => (
              <MoverRow key={item.card.id} card={item.card} data={item.data} rank={i} mode="losers" />
            ))}
          </motion.div>
        )}

        {tab === 'volume' && (
          <motion.div key="volume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {volumeLeaders.map((item, i) => (
              <MoverRow key={item.card.id} card={item.card} data={item.data} rank={i} mode="volume" maxVolume={maxVolume} />
            ))}
          </motion.div>
        )}

        {tab === 'whale' && (
          <motion.div key="whale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WhaleActivity />
          </motion.div>
        )}

        {tab === 'floor' && (
          <motion.div key="floor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FloorWatch />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
