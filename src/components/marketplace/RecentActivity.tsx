'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getRecentSales, getCardMarketData, RecentSale } from '@/lib/marketData';
import { SCARCITY_CONFIG } from '@/data/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentActivity() {
  const sales = useMemo(() => getRecentSales(12), []);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
          <span className="text-green-400">💰</span> Recent Sales
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {sales.map((sale, i) => {
          const scarcityColor = SCARCITY_CONFIG[sale.card.scarcity].color;
          const data = getCardMarketData(sale.cardId);
          const priceDiff = data ? ((sale.price - data.avgPrice7d) / data.avgPrice7d) * 100 : 0;
          const isGoodDeal = priceDiff < -5;
          const isAboveAvg = priceDiff > 5;

          return (
            <motion.div
              key={`${sale.cardId}-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/card/${sale.cardId}`}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors group"
              >
                {/* Mini card art */}
                <div
                  className="w-9 h-12 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${sale.card.gradientFrom}, ${sale.card.gradientTo})`,
                    border: `1.5px solid ${scarcityColor}`,
                  }}
                >
                  <span className="text-sm">{sale.card.symbol}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                    {sale.card.character}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase" style={{ color: scarcityColor }}>
                      {SCARCITY_CONFIG[sale.card.scarcity].label}
                    </span>
                    {sale.card.parallel !== 'base' && (
                      <span className="text-[9px] text-muted">{sale.card.parallel}</span>
                    )}
                  </div>
                </div>

                {/* Price + time */}
                <div className="text-right shrink-0">
                  <div className="text-[11px] font-bold font-mono text-green-400">${sale.price.toFixed(2)}</div>
                  <div className="flex items-center gap-1 justify-end">
                    {isGoodDeal && (
                      <span className="text-[8px] px-1 rounded bg-green-500/10 text-green-400 font-bold">DEAL</span>
                    )}
                    {isAboveAvg && (
                      <span className="text-[8px] px-1 rounded bg-red-500/10 text-red-400 font-bold">HIGH</span>
                    )}
                    <span className="text-[9px] text-muted">{timeAgo(sale.soldAt)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
