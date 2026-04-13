'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { getRecentSales, RecentSale, getCardMarketData } from '@/lib/marketData';
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

export default function SalesTicker() {
  const [sales, setSales] = useState<RecentSale[]>([]);
  const [visible, setVisible] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSales(getRecentSales(20));
  }, []);

  useEffect(() => {
    if (sales.length === 0) return;
    intervalRef.current = setInterval(() => {
      setVisible(v => (v + 1) % sales.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sales.length]);

  if (sales.length === 0) return null;

  const sale = sales[visible];
  const scarcityColor = SCARCITY_CONFIG[sale.card.scarcity].color;

  return (
    <div className="relative overflow-hidden h-8 flex items-center">
      <motion.div
        key={visible}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 text-xs w-full"
      >
        <span className="text-muted shrink-0">{sale.card.symbol}</span>
        <span className="font-medium text-foreground truncate">
          {sale.card.character}
        </span>
        <span className="font-mono font-bold text-green-400 shrink-0">
          ${sale.price.toFixed(2)}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider shrink-0" style={{ color: scarcityColor }}>
          {SCARCITY_CONFIG[sale.card.scarcity].label}
        </span>
        <span className="text-muted text-[10px] shrink-0 ml-auto">
          {timeAgo(sale.soldAt)}
        </span>
      </motion.div>
    </div>
  );
}
