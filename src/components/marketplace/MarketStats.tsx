'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ALL_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG } from '@/data/types';
import { getCardMarketData, getRecentSales } from '@/lib/marketData';

export default function MarketStats() {
  const stats = useMemo(() => {
    const totalListings = ALL_CARDS.filter(c => c.listed).length;
    const totalVolume = ALL_CARDS.reduce((sum, c) => {
      const data = getCardMarketData(c.id);
      return sum + (data?.volume7d || 0);
    }, 0);
    const totalMarketCap = ALL_CARDS.reduce((sum, c) => {
      const data = getCardMarketData(c.id);
      return sum + (data?.currentPrice || c.price);
    }, 0);
    const recentSales = getRecentSales(10);
    const avgSalePrice = recentSales.length > 0
      ? recentSales.reduce((sum, s) => sum + s.price, 0) / recentSales.length
      : 0;

    const movers = ALL_CARDS.map(c => ({
      card: c,
      change: getCardMarketData(c.id)?.change24h || 0,
      price: getCardMarketData(c.id)?.currentPrice || c.price,
    })).sort((a, b) => b.change - a.change);

    return {
      totalListings,
      totalVolume,
      totalMarketCap,
      avgSalePrice,
      topGainer: movers[0],
      topLoser: movers[movers.length - 1],
    };
  }, []);

  return (
    <div className="mb-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        {[
          { label: 'Listings', value: stats.totalListings.toString(), color: 'text-foreground' },
          { label: '7d Volume', value: stats.totalVolume.toLocaleString(), color: 'text-accent' },
          { label: 'Market Cap', value: `$${(stats.totalMarketCap / 1000).toFixed(1)}K`, color: 'text-green-400' },
          { label: 'Avg Sale', value: `$${stats.avgSalePrice.toFixed(2)}`, color: 'text-foreground' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-2.5 rounded-xl bg-surface border border-border"
          >
            <div className="text-[9px] text-muted uppercase tracking-wider mb-0.5">{stat.label}</div>
            <div className={`text-base font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Top movers bar */}
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface/50 border border-border/50">
        <span className="text-[9px] text-muted uppercase tracking-wider shrink-0">Movers</span>
        {stats.topGainer && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{stats.topGainer.card.symbol}</span>
            <span className="text-[10px] font-semibold text-foreground truncate max-w-[80px]">{stats.topGainer.card.character}</span>
            <span className="text-[9px] font-mono font-bold uppercase" style={{ color: SCARCITY_CONFIG[stats.topGainer.card.scarcity].color }}>
              {SCARCITY_CONFIG[stats.topGainer.card.scarcity].label[0]}
            </span>
            <span className="text-[10px] font-mono font-bold text-green-400">+{stats.topGainer.change.toFixed(1)}%</span>
          </div>
        )}
        <div className="w-px h-3 bg-border/50 shrink-0" />
        {stats.topLoser && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs">{stats.topLoser.card.symbol}</span>
            <span className="text-[10px] font-semibold text-foreground truncate max-w-[80px]">{stats.topLoser.card.character}</span>
            <span className="text-[9px] font-mono font-bold uppercase" style={{ color: SCARCITY_CONFIG[stats.topLoser.card.scarcity].color }}>
              {SCARCITY_CONFIG[stats.topLoser.card.scarcity].label[0]}
            </span>
            <span className="text-[10px] font-mono font-bold text-red-400">{stats.topLoser.change.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
