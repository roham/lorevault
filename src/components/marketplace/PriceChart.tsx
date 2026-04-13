'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { PricePoint } from '@/lib/marketData';

interface PriceChartProps {
  data30d: PricePoint[];
  data90d: PricePoint[];
  currentPrice: number;
  height?: number;
}

type TimeRange = '7d' | '30d' | '90d';

export default function PriceChart({ data30d, data90d, currentPrice, height = 80 }: PriceChartProps) {
  const [range, setRange] = useState<TimeRange>('30d');

  const getData = () => {
    switch (range) {
      case '7d': return data30d.slice(-7);
      case '30d': return data30d;
      case '90d': return data90d;
    }
  };

  const data = getData();
  const prices = data.map(d => d.price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const spread = max - min || 1;
  const isUp = data[data.length - 1]?.price >= data[0]?.price;

  // SVG path for the area chart
  const w = 100; // viewBox width percentage
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((d.price - min) / spread) * (height - 8) - 4,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${w} ${height} L 0 ${height} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={`chartGrad-${isUp ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#chartGrad-${isUp ? 'up' : 'down'})`} />
        <path d={linePath} fill="none" stroke={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex items-center gap-1 mt-2">
        {(['7d', '30d', '90d'] as TimeRange[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              range === r ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
