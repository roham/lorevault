'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, SCARCITY_CONFIG, Parallel, PARALLEL_CONFIG } from '@/data/types';
import { getOwnedCards, getOwnedCardIds } from '@/lib/store';
import { getCardMarketData } from '@/lib/marketData';
import {
  getPortfolioSnapshot,
  getPerformanceAttribution,
  getDiversificationData,
  getCompletionVelocity,
  getPriceHeatmap,
  getDuplicateAnalysis,
  getTradeRecommendations,
  getPortfolioTimeSeries,
  PortfolioTimePoint,
  HeatmapCell,
} from '@/lib/analytics';

// ===== Time Range Toggle =====
type TimeRange = '7d' | '30d' | '90d' | 'all';

function TimeRangeToggle({ value, onChange }: { value: TimeRange; onChange: (r: TimeRange) => void }) {
  return (
    <div className="flex items-center gap-0.5 bg-border/20 rounded-lg p-0.5">
      {(['7d', '30d', '90d'] as TimeRange[]).map(r => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
            value === r ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
          }`}
        >
          {r.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ===== Portfolio Line Chart =====
function PortfolioChart({ data, height = 120 }: { data: PortfolioTimePoint[]; height?: number }) {
  if (data.length === 0) return null;
  const values = data.map(d => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = max - min || 1;
  const w = 100;
  const isUp = values[values.length - 1] >= values[0];

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((d.value - min) / spread) * (height - 12) - 6,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${w} ${height} L 0 ${height} Z`;

  // Grid lines
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount }, (_, i) => {
    const y = ((i + 1) / (gridCount + 1)) * height;
    const val = max - ((i + 1) / (gridCount + 1)) * spread;
    return { y, val };
  });

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} stopOpacity="0.2" />
            <stop offset="100%" stopColor={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <line key={i} x1={0} y1={g.y} x2={w} y2={g.y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
        ))}
        <path d={areaPath} fill="url(#portfolioGrad)" />
        <path d={linePath} fill="none" stroke={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        {/* Current price dot */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="2" fill={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} />
      </svg>
      {/* Y-axis labels */}
      <div className="absolute top-0 right-0 bottom-0 flex flex-col justify-between py-1 pointer-events-none">
        <span className="text-[9px] font-mono text-muted/40">${Math.round(max)}</span>
        <span className="text-[9px] font-mono text-muted/40">${Math.round(min)}</span>
      </div>
    </div>
  );
}

// ===== Performance Bar =====
function AttributionBar({
  data,
}: {
  data: { label: string; value: number; icon: string }[];
}) {
  const absMax = Math.max(...data.map(d => Math.abs(d.value)), 0.01);

  return (
    <div className="space-y-2.5">
      {data.map((item) => {
        const isPos = item.value >= 0;
        const widthPct = Math.min((Math.abs(item.value) / absMax) * 100, 100);
        return (
          <div key={item.label} className="group">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{item.icon}</span>
              <span className="text-[11px] text-muted flex-1 truncate">{item.label}</span>
              <span className={`text-[11px] font-mono font-bold ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                {isPos ? '+' : ''}{item.value > 0 ? '$' : '-$'}{Math.abs(item.value).toFixed(2)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-border/15 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${isPos ? 'bg-green-500/60' : 'bg-red-500/60'}`}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== Radar Chart =====
function DiversificationRadar({
  data,
}: {
  data: { label: string; value: number; icon: string }[];
}) {
  const n = data.length;
  if (n === 0) return null;
  const cx = 110;
  const cy = 110;
  const R = 85;
  const levels = 4;

  const circles = Array.from({ length: levels }, (_, i) => {
    const r = R * ((i + 1) / levels);
    return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />;
  });

  const axes = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const lx = cx + (R + 18) * Math.cos(angle);
    const ly = cy + (R + 18) * Math.sin(angle);
    return (
      <g key={d.label}>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-muted text-[8px]">
          {d.icon}
        </text>
      </g>
    );
  });

  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const pct = Math.min(d.value / 100, 1);
    const r = R * pct;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[220px] mx-auto">
      {circles}
      {axes}
      <motion.polygon
        points={`${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy}`}
        animate={{ points }}
        transition={{ duration: 1, ease: 'easeOut' }}
        fill="rgba(129, 140, 248, 0.12)"
        stroke="#818cf8"
        strokeWidth="1.5"
      />
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const pct = Math.min(d.value / 100, 1);
        const r = R * pct;
        return (
          <motion.circle
            key={d.label}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={2.5}
            fill="#818cf8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}

// ===== Sparkline =====
function Sparkline({ cardId, width = 60, height = 20 }: { cardId: string; width?: number; height?: number }) {
  const data = getCardMarketData(cardId);
  if (!data) return null;
  const pts = data.priceHistory30d.slice(-7);
  const prices = pts.map(p => p.price);
  const pMax = Math.max(...prices);
  const pMin = Math.min(...prices);
  const spread = pMax - pMin || 1;
  const isUp = pts[pts.length - 1].price >= pts[0].price;
  const path = pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${(j / (pts.length - 1)) * width} ${height - ((p.price - pMin) / spread) * (height - 4) - 2}`).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0" style={{ width, height }} preserveAspectRatio="none">
      <path d={path} fill="none" stroke={isUp ? 'rgb(34,197,94)' : 'rgb(239,68,68)'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ===== Volatility Badge =====
function VolatilityBadge({ level }: { level: 'HIGH' | 'LOW' | 'STABLE' }) {
  const config = {
    HIGH: { color: 'text-red-400 bg-red-500/10', label: 'HIGH' },
    STABLE: { color: 'text-yellow-400 bg-yellow-500/10', label: 'STABLE' },
    LOW: { color: 'text-green-400 bg-green-500/10', label: 'LOW' },
  };
  const c = config[level];
  return <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${c.color}`}>{c.label}</span>;
}

// ===== Section Separator =====
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted">{children}</h3>
      <div className="flex-1 h-px bg-border/20" />
    </div>
  );
}

// ===== Main Analytics Page =====
export default function AnalyticsPage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [expandedSet, setExpandedSet] = useState<string | null>(null);
  const [heatmapSort, setHeatmapSort] = useState<'change' | 'value' | 'volatility'>('change');

  useEffect(() => {
    const ids = getOwnedCardIds();
    setOwnedIds(ids);
    setOwnedCards(getOwnedCards());
    setLoaded(true);
  }, []);

  // Compute all analytics data
  const snapshot = useMemo(() => loaded ? getPortfolioSnapshot(ownedIds) : null, [ownedIds, loaded]);
  const attribution = useMemo(() => loaded ? getPerformanceAttribution(ownedIds) : [], [ownedIds, loaded]);
  const diversification = useMemo(() => loaded ? getDiversificationData(ownedIds) : [], [ownedIds, loaded]);
  const velocity = useMemo(() => loaded ? getCompletionVelocity(ownedIds) : [], [ownedIds, loaded]);
  const heatmap = useMemo(() => loaded ? getPriceHeatmap(ownedIds) : [], [ownedIds, loaded]);
  const duplicates = useMemo(() => loaded ? getDuplicateAnalysis(ownedIds) : [], [ownedIds, loaded]);
  const trades = useMemo(() => loaded ? getTradeRecommendations(ownedIds) : [], [ownedIds, loaded]);

  const chartDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const timeSeries = useMemo(() => loaded ? getPortfolioTimeSeries(ownedIds, chartDays) : [], [ownedIds, chartDays, loaded]);

  const sortedHeatmap = useMemo(() => {
    if (heatmapSort === 'value') return [...heatmap].sort((a, b) => b.currentPrice - a.currentPrice);
    if (heatmapSort === 'volatility') {
      const order = { HIGH: 0, STABLE: 1, LOW: 2 };
      return [...heatmap].sort((a, b) => order[a.volatility] - order[b.volatility]);
    }
    return heatmap; // already sorted by change7d
  }, [heatmap, heatmapSort]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!snapshot) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link href="/collection" className="text-muted hover:text-foreground transition-colors text-sm">
          Collection
        </Link>
        <span className="text-muted/30">/</span>
        <h1 className="text-lg font-bold">Analytics</h1>
      </div>

      {/* ===== PANEL 1: Portfolio Value Hero ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-surface border border-border overflow-hidden mb-6"
      >
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="text-muted text-[10px] uppercase tracking-wider mb-1">Portfolio Value</div>
              <div className="text-3xl font-bold font-mono tracking-tight">${snapshot.totalValue.toFixed(2)}</div>
            </div>
            <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
          </div>

          <div className="flex items-center gap-4 mt-2 mb-3">
            <div className={`flex items-center gap-1 ${snapshot.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-xs font-mono font-bold">
                {snapshot.change24h >= 0 ? '+' : ''}{snapshot.change24h.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono opacity-70">
                ({snapshot.change24hPct >= 0 ? '+' : ''}{snapshot.change24hPct.toFixed(1)}%)
              </span>
              <span className="text-[9px] text-muted ml-1">24h</span>
            </div>
            <div className={`flex items-center gap-1 ${snapshot.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <span className="text-xs font-mono font-bold">
                {snapshot.change7d >= 0 ? '+' : ''}{snapshot.change7d.toFixed(2)}
              </span>
              <span className="text-[9px] text-muted ml-1">7d</span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-2 pb-3">
          <PortfolioChart data={timeSeries} height={140} />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 border-t border-border/30">
          {[
            { label: 'Cards', value: snapshot.cardCount.toString() },
            { label: 'Avg Value', value: `$${snapshot.avgCardValue.toFixed(2)}` },
            { label: '30d Change', value: `${snapshot.change30dPct >= 0 ? '+' : ''}${snapshot.change30dPct.toFixed(1)}%` },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-3 text-center border-r border-border/15 last:border-r-0">
              <div className="text-xs font-mono font-bold text-foreground">{stat.value}</div>
              <div className="text-[9px] text-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ===== PANEL 2: Performance Attribution ===== */}
      <SectionTitle>Performance Attribution (7d)</SectionTitle>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-surface border border-border p-5 mb-6"
      >
        <AttributionBar
          data={attribution.map(a => ({
            label: a.setName,
            value: a.valueChange7d,
            icon: a.setIcon,
          }))}
        />

        {/* Expandable detail */}
        {attribution.filter(a => a.topMover).length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/20">
            <div className="text-[10px] text-muted uppercase tracking-wider mb-2">Top Movers by Set</div>
            <div className="space-y-2">
              {attribution.filter(a => a.topMover).slice(0, 3).map(a => (
                <div key={a.setSlug} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-border/20 flex items-center justify-center text-sm">
                    {a.setIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium truncate">{a.topMover!.card.character}</div>
                    <div className="text-[9px] text-muted truncate">{a.topMover!.card.moment}</div>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${a.topMover!.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {a.topMover!.change >= 0 ? '+' : ''}{a.topMover!.change.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ===== Two Column: Diversification + Completion Velocity ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* PANEL 3A: Diversification Radar */}
        <div>
          <SectionTitle>Diversification</SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-surface border border-border p-5"
          >
            <DiversificationRadar
              data={diversification.map(d => ({
                label: d.setName,
                value: d.valuePct,
                icon: d.setIcon,
              }))}
            />
            <div className="mt-4 space-y-2">
              {diversification.map(d => (
                <div key={d.setSlug} className="flex items-center gap-2">
                  <span className="text-sm">{d.setIcon}</span>
                  <span className="text-[11px] text-muted flex-1 truncate">{d.setName}</span>
                  <span className="text-[11px] font-mono text-foreground">{d.valuePct}%</span>
                  <span className="text-[9px] font-mono text-muted">${d.totalValue.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* PANEL 3B: Completion Velocity */}
        <div>
          <SectionTitle>Completion Velocity</SectionTitle>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-surface border border-border p-5"
          >
            <div className="space-y-4">
              {velocity.map(v => (
                <div key={v.setSlug} className="group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm">{v.setIcon}</span>
                    <span className="text-[11px] font-medium flex-1 truncate">{v.setName}</span>
                    <span className="text-[11px] font-mono font-bold text-accent">{v.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/20 overflow-hidden mb-1.5">
                    <motion.div
                      className="h-full rounded-full bg-accent/50"
                      initial={{ width: 0 }}
                      animate={{ width: `${v.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[9px] text-muted">
                    <span>{v.owned}/{v.total} cards</span>
                    {v.estimatedDaysToComplete && (
                      <span>~{v.estimatedDaysToComplete}d to complete</span>
                    )}
                    <span className="ml-auto font-mono">${v.costToComplete.toFixed(0)} to finish</span>
                  </div>
                  {v.cheapestMissing && (
                    <div className="mt-1.5 flex items-center gap-2 text-[9px]">
                      <span className="text-muted">Cheapest missing:</span>
                      <Link href={`/card/${v.cheapestMissing.card.id}`} className="text-accent hover:underline">
                        {v.cheapestMissing.card.character}
                      </Link>
                      <span className="font-mono text-green-400">${v.cheapestMissing.price.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== PANEL 4: Market Intelligence — Price Heatmap ===== */}
      <SectionTitle>Market Intelligence</SectionTitle>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-surface border border-border overflow-hidden mb-6"
      >
        {/* Sort tabs */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-2">
          <span className="text-[10px] text-muted uppercase tracking-wider mr-2">Sort</span>
          {(['change', 'value', 'volatility'] as const).map(s => (
            <button
              key={s}
              onClick={() => setHeatmapSort(s)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                heatmapSort === s ? 'bg-accent/15 text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {s === 'change' ? '7d Change' : s === 'value' ? 'Value' : 'Volatility'}
            </button>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border/10 p-px">
          {sortedHeatmap.slice(0, 20).map((cell) => {
            const intensity = Math.min(Math.abs(cell.change7d) / 15, 1);
            const bgColor = cell.change7d >= 0
              ? `rgba(34, 197, 94, ${0.05 + intensity * 0.15})`
              : `rgba(239, 68, 68, ${0.05 + intensity * 0.15})`;

            return (
              <Link
                key={cell.card.id}
                href={`/card/${cell.card.id}`}
                className="block p-3 hover:bg-white/[0.03] transition-colors"
                style={{ backgroundColor: bgColor }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">{cell.card.symbol}</span>
                  <VolatilityBadge level={cell.volatility} />
                </div>
                <div className="text-[10px] font-medium truncate">{cell.card.character}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] font-mono font-bold">${cell.currentPrice.toFixed(2)}</span>
                  <span className={`text-[9px] font-mono font-bold ${cell.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {cell.change7d >= 0 ? '+' : ''}{cell.change7d.toFixed(1)}%
                  </span>
                </div>
                {cell.belowAvg && (
                  <div className="mt-1 text-[8px] text-yellow-400/80 font-medium">Below 30d avg</div>
                )}
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ===== PANEL 5: Duplicate & Trade Optimizer ===== */}
      <SectionTitle>Trade Optimizer</SectionTitle>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-surface border border-border p-5 mb-6"
      >
        {duplicates.length === 0 ? (
          <div className="text-center py-8 text-muted text-sm">
            No tradeable duplicates yet. Keep collecting!
          </div>
        ) : (
          <>
            {/* Duplicate list */}
            <div className="text-[10px] text-muted uppercase tracking-wider mb-3">Tradeable Duplicates ({duplicates.length})</div>
            <div className="space-y-2 mb-4">
              {duplicates.slice(0, 6).map((d) => (
                <div key={d.card.id} className="flex items-center gap-3">
                  <span className="text-lg">{d.card.symbol}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium truncate">{d.card.character}</div>
                    <div className="text-[9px] text-muted truncate">{d.card.moment}</div>
                  </div>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{
                      color: SCARCITY_CONFIG[d.card.scarcity].color,
                      background: `${SCARCITY_CONFIG[d.card.scarcity].color}15`,
                    }}
                  >
                    {d.card.scarcity}
                  </span>
                  <span className="text-[11px] font-mono text-green-400">${d.unitValue.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Trade recommendations */}
            {trades.length > 0 && (
              <>
                <div className="border-t border-border/20 pt-4 mt-4">
                  <div className="text-[10px] text-muted uppercase tracking-wider mb-3">Smart Trades</div>
                  <div className="space-y-4">
                    {trades.map((trade, i) => (
                      <div key={i} className="p-3 rounded-xl bg-background/50 border border-border/20">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-bold uppercase">Opportunity</span>
                        </div>
                        <div className="text-[11px] text-foreground/80 mb-2">
                          Sell {trade.sell.map(s => `${s.count}x ${s.card.character} ${s.card.scarcity}`).join(', ')}
                          {' '}(${trade.sell.reduce((sum, s) => sum + s.revenue, 0).toFixed(2)})
                        </div>
                        <div className="text-[11px] text-foreground/80 mb-1">
                          Buy {trade.buy[0].card.character} {trade.buy[0].card.scarcity} (${trade.buy[0].cost.toFixed(2)})
                        </div>
                        <div className="text-[9px] text-muted">{trade.buy[0].reason}</div>
                        <div className={`text-[10px] font-mono font-bold mt-1 ${trade.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          Net: {trade.netProfit >= 0 ? '+' : ''}${trade.netProfit.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </motion.div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
