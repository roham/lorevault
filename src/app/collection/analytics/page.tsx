'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, SCARCITY_CONFIG, Parallel, PARALLEL_CONFIG } from '@/data/types';
import { getOwnedCards } from '@/lib/store';

// ---------------------------------------------------------------------------
// Bar chart component
// ---------------------------------------------------------------------------
function BarChart({
  data,
  maxValue,
}: {
  data: { label: string; value: number; color: string; icon?: string }[];
  maxValue: number;
}) {
  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={item.label} className="flex items-center gap-3">
          {item.icon && <span className="text-lg w-6 text-center">{item.icon}</span>}
          <div className="w-20 text-xs text-muted truncate">{item.label}</div>
          <div className="flex-1 h-6 rounded-lg bg-border/20 overflow-hidden relative">
            <motion.div
              className="h-full rounded-lg"
              style={{ background: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            />
            <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-mono text-foreground/60">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radar chart (pure CSS/SVG)
// ---------------------------------------------------------------------------
function RadarChart({
  data,
}: {
  data: { label: string; value: number; max: number; color: string; icon: string }[];
}) {
  const n = data.length;
  const cx = 120;
  const cy = 120;
  const R = 90;
  const levels = 4;

  // Grid circles
  const circles = Array.from({ length: levels }, (_, i) => {
    const r = R * ((i + 1) / levels);
    return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
  });

  // Axis lines + labels
  const axes = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const lx = cx + (R + 20) * Math.cos(angle);
    const ly = cy + (R + 20) * Math.sin(angle);
    return (
      <g key={d.label}>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-muted text-[9px]">
          {d.icon}
        </text>
      </g>
    );
  });

  // Data polygon
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const pct = d.max > 0 ? d.value / d.max : 0;
    const r = R * Math.min(pct, 1);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[280px] mx-auto">
      {circles}
      {axes}
      <motion.polygon
        points={`${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy} ${cx},${cy}`}
        animate={{ points }}
        transition={{ duration: 1, ease: 'easeOut' }}
        fill="rgba(129, 140, 248, 0.15)"
        stroke="#818cf8"
        strokeWidth="2"
      />
      {/* Data points */}
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const pct = d.max > 0 ? d.value / d.max : 0;
        const r = R * Math.min(pct, 1);
        return (
          <motion.circle
            key={d.label}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={3}
            fill="#818cf8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Collection Strength Score
// ---------------------------------------------------------------------------
function computeStrengthScore(ownedCards: Card[]): {
  score: number;
  diversity: number;
  completion: number;
  rarity: number;
  breadth: number;
} {
  // Diversity: unique characters / total characters
  const totalChars = new Set(ALL_CARDS.map(c => c.character)).size;
  const ownedChars = new Set(ownedCards.map(c => c.character)).size;
  const diversity = totalChars > 0 ? ownedChars / totalChars : 0;

  // Completion: average set completion
  const setCompletions = SETS.map(s => {
    const allChars = new Set(ALL_CARDS.filter(c => c.setSlug === s.slug).map(c => `${c.character}:${c.moment}`));
    const ownedCharsInSet = new Set(ownedCards.filter(c => c.setSlug === s.slug).map(c => `${c.character}:${c.moment}`));
    return allChars.size > 0 ? ownedCharsInSet.size / allChars.size : 0;
  });
  const completion = setCompletions.reduce((a, b) => a + b, 0) / Math.max(setCompletions.length, 1);

  // Rarity: weighted scarcity score (legendary=10, epic=6, rare=3, uncommon=1.5, common=0.5)
  const rarityWeights: Record<Scarcity, number> = { legendary: 10, epic: 6, rare: 3, uncommon: 1.5, common: 0.5 };
  const maxRarity = ALL_CARDS.reduce((sum, c) => sum + rarityWeights[c.scarcity], 0);
  const ownedRarity = ownedCards.reduce((sum, c) => sum + rarityWeights[c.scarcity], 0);
  const rarity = maxRarity > 0 ? ownedRarity / maxRarity : 0;

  // Breadth: how many sets represented
  const setsOwned = new Set(ownedCards.map(c => c.setSlug)).size;
  const breadth = SETS.length > 0 ? setsOwned / SETS.length : 0;

  const score = Math.round(
    (diversity * 25 + completion * 30 + rarity * 25 + breadth * 20) * 100
  ) / 100;

  return { score, diversity, completion, rarity, breadth };
}

// ---------------------------------------------------------------------------
// Main Analytics Page
// ---------------------------------------------------------------------------
export default function AnalyticsPage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOwnedCards(getOwnedCards());
    setLoaded(true);
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const scarcityDist: Record<string, number> = {};
    const parallelDist: Record<string, number> = {};
    const setDist: Record<string, number> = {};
    let totalValue = 0;

    for (const c of ownedCards) {
      scarcityDist[c.scarcity] = (scarcityDist[c.scarcity] || 0) + 1;
      parallelDist[c.parallel] = (parallelDist[c.parallel] || 0) + 1;
      setDist[c.setSlug] = (setDist[c.setSlug] || 0) + 1;
      totalValue += c.price;
    }

    const rarestCard = [...ownedCards].sort((a, b) => {
      const order: Record<Scarcity, number> = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
      const sDiff = order[a.scarcity] - order[b.scarcity];
      if (sDiff !== 0) return sDiff;
      return a.serialNumber - b.serialNumber;
    })[0] || null;

    const mostValuable = [...ownedCards].sort((a, b) => b.price - a.price)[0] || null;

    return { scarcityDist, parallelDist, setDist, totalValue, rarestCard, mostValuable };
  }, [ownedCards]);

  const strength = useMemo(() => computeStrengthScore(ownedCards), [ownedCards]);

  const setCompletion = useMemo(() => {
    return SETS.map(s => {
      const allChars = new Set(ALL_CARDS.filter(c => c.setSlug === s.slug).map(c => `${c.character}:${c.moment}`));
      const ownedChars = new Set(ownedCards.filter(c => c.setSlug === s.slug).map(c => `${c.character}:${c.moment}`));
      return {
        ...s,
        total: allChars.size,
        owned: ownedChars.size,
        pct: allChars.size > 0 ? Math.round((ownedChars.size / allChars.size) * 100) : 0,
      };
    });
  }, [ownedCards]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/collection" className="text-muted hover:text-foreground transition-colors text-sm">
          Collection
        </Link>
        <span className="text-muted/30">/</span>
        <h1 className="text-2xl font-bold">Collection Analytics</h1>
      </div>

      {/* Top-level stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Cards', value: ownedCards.length.toString(), icon: '🃏', color: '#818cf8' },
          { label: 'Total Value', value: `$${stats.totalValue.toFixed(0)}`, icon: '💰', color: '#22c55e' },
          { label: 'Unique Characters', value: new Set(ownedCards.map(c => c.character)).size.toString(), icon: '👤', color: '#a855f7' },
          { label: 'Strength Score', value: strength.score.toFixed(1), icon: '⚡', color: '#f59e0b' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl bg-surface border border-border text-center"
          >
            <span className="text-2xl block mb-2">{stat.icon}</span>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[10px] text-muted mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rarest Card */}
        {stats.rarestCard && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-surface via-surface to-accent/5 border border-border"
          >
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <span>💎</span> Rarest Card
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <Link href={`/card/${stats.rarestCard.id}`}>
                  <CardItem card={stats.rarestCard} size="lg" />
                </Link>
              </div>
              <div>
                <div className="text-lg font-bold mb-1">{stats.rarestCard.character}</div>
                <div className="text-xs text-muted mb-3">{stats.rarestCard.moment}</div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{
                      color: SCARCITY_CONFIG[stats.rarestCard.scarcity].color,
                      background: `${SCARCITY_CONFIG[stats.rarestCard.scarcity].color}20`,
                    }}
                  >
                    {stats.rarestCard.scarcity}
                  </span>
                  {stats.rarestCard.parallel !== 'base' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/70">
                      {PARALLEL_CONFIG[stats.rarestCard.parallel].label}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-muted">
                    #{stats.rarestCard.serialNumber}/{stats.rarestCard.maxSerial}
                  </span>
                </div>
                <div className="text-lg font-bold text-green-400 mt-2">${stats.rarestCard.price.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Collection Strength Radar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-surface border border-border"
        >
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
            <span>⚡</span> Collection Strength — {strength.score.toFixed(1)}/100
          </h3>
          <RadarChart
            data={[
              { label: 'Diversity', value: strength.diversity * 100, max: 100, color: '#818cf8', icon: '🌈' },
              { label: 'Completion', value: strength.completion * 100, max: 100, color: '#22c55e', icon: '✅' },
              { label: 'Rarity', value: strength.rarity * 100, max: 100, color: '#f59e0b', icon: '💎' },
              { label: 'Breadth', value: strength.breadth * 100, max: 100, color: '#a855f7', icon: '📊' },
              { label: 'Value', value: Math.min(stats.totalValue / 50, 100), max: 100, color: '#ec4899', icon: '💰' },
            ]}
          />
        </motion.div>
      </div>

      {/* Scarcity distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-surface border border-border mb-6"
      >
        <h3 className="text-sm font-bold mb-4">Scarcity Distribution</h3>
        <BarChart
          data={(['legendary', 'epic', 'rare', 'uncommon', 'common'] as Scarcity[]).map(s => ({
            label: SCARCITY_CONFIG[s].label,
            value: stats.scarcityDist[s] || 0,
            color: SCARCITY_CONFIG[s].color,
          }))}
          maxValue={Math.max(...Object.values(stats.scarcityDist), 1)}
        />
      </motion.div>

      {/* Set completion overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-surface border border-border mb-6"
      >
        <h3 className="text-sm font-bold mb-4">Set Completion Overview</h3>
        <BarChart
          data={setCompletion.map(s => ({
            label: s.name.split(' ').slice(0, 2).join(' '),
            value: s.pct,
            color: s.pct === 100 ? '#f59e0b' : s.pct > 50 ? '#22c55e' : '#818cf8',
            icon: s.icon,
          }))}
          maxValue={100}
        />
      </motion.div>

      {/* Parallel distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-surface border border-border"
      >
        <h3 className="text-sm font-bold mb-4">Parallel Distribution</h3>
        <BarChart
          data={(['base', 'silver', 'gold', 'holographic', 'obsidian'] as Parallel[]).map(p => ({
            label: PARALLEL_CONFIG[p].label,
            value: stats.parallelDist[p] || 0,
            color: p === 'gold' ? '#ffd700' : p === 'silver' ? '#c0c0c0' : p === 'holographic' ? '#ff6ec7' : p === 'obsidian' ? '#6366f1' : '#6b7094',
          }))}
          maxValue={Math.max(...Object.values(stats.parallelDist), 1)}
        />
      </motion.div>
    </div>
  );
}
