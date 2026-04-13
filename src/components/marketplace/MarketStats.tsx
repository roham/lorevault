'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ALL_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG, Scarcity } from '@/data/types';
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

    // Find top movers
    const movers = ALL_CARDS.map(c => ({
      card: c,
      change: getCardMarketData(c.id)?.change24h || 0,
    })).sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

    return {
      totalListings,
      totalVolume,
      totalMarketCap,
      avgSalePrice,
      topGainer: movers.find(m => m.change > 0),
      topLoser: movers.find(m => m.change < 0),
    };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="p-3 rounded-xl bg-surface border border-border"
      >
        <div className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Listings</div>
        <div className="text-lg font-bold text-foreground">{stats.totalListings}</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-3 rounded-xl bg-surface border border-border"
      >
        <div className="text-[10px] text-muted uppercase tracking-wider mb-0.5">7d Volume</div>
        <div className="text-lg font-bold text-accent">{stats.totalVolume.toLocaleString()}</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-3 rounded-xl bg-surface border border-border"
      >
        <div className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Market Cap</div>
        <div className="text-lg font-bold text-green-400">${(stats.totalMarketCap / 1000).toFixed(1)}K</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-3 rounded-xl bg-surface border border-border"
      >
        <div className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Avg Sale</div>
        <div className="text-lg font-bold text-foreground">${stats.avgSalePrice.toFixed(2)}</div>
      </motion.div>
    </div>
  );
}
