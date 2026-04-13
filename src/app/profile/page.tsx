'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import SeasonTrack from '@/components/SeasonTrack';
import { ALL_CARDS } from '@/data/cards';
import { PROFILE } from '@/data/profile';
import { SCARCITY_CONFIG, Scarcity, Card, getTierForLevel } from '@/data/types';
import { SETS } from '@/data/sets';
import { getOwnedCards, getShowcaseIds, getXP, getStreak, getPackCredits, resetAll, addPackCredits, getCollectorLevel, getEarnedAchievements } from '@/lib/store';
import { getShowcases, getActiveShowcaseId, SHOWCASE_THEMES, ShowcaseTheme } from '@/lib/showcase-store';
import { ACHIEVEMENTS, getAchievementRarityColor } from '@/lib/achievements';

const TIER_COLORS: Record<string, string> = {
  Newcomer: '#6b7094',
  Collector: '#22c55e',
  Enthusiast: '#3b82f6',
  Connoisseur: '#a855f7',
  Elite: '#f59e0b',
  Legendary: '#ef4444',
};

export default function ProfilePage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [showcaseCards, setShowcaseCards] = useState<Card[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [packs, setPacks] = useState(0);
  const [activeShowcaseTheme, setActiveShowcaseTheme] = useState<ShowcaseTheme>('dark-glass');
  const [collectorLevel, setCollectorLevel] = useState({ level: 1, tier: 'Newcomer' as string, progressPercent: 0, currentXP: 0, xpForNextLevel: 100, xpForCurrentLevel: 0 });
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const owned = getOwnedCards();
    setOwnedCards(owned);

    const showcases = getShowcases();
    const activeId = getActiveShowcaseId();
    const activeShowcase = showcases.find(s => s.id === activeId) || showcases[0];
    if (activeShowcase) {
      setShowcaseCards(
        activeShowcase.slots
          .map(s => owned.find(c => c.id === s.cardId))
          .filter(Boolean) as Card[]
      );
      setActiveShowcaseTheme(activeShowcase.theme);
    } else {
      const sIds = getShowcaseIds();
      setShowcaseCards(sIds.map(id => owned.find(c => c.id === id)).filter(Boolean) as Card[]);
    }

    setXp(getXP());
    setStreak(getStreak());
    setPacks(getPackCredits());
    setCollectorLevel(getCollectorLevel());
    setEarnedIds(new Set(getEarnedAchievements().map(a => a.achievementId)));
  }, []);

  const tierColor = TIER_COLORS[collectorLevel.tier] || '#818cf8';

  const setStats = SETS.map(set => {
    const owned = new Set(ownedCards.filter(c => c.setSlug === set.slug).map(c => c.character)).size;
    return { ...set, owned, total: set.cardCount };
  });

  const scarcityDist = ownedCards.reduce((acc, c) => {
    acc[c.scarcity] = (acc[c.scarcity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = ownedCards.reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Collector Level Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl mb-6"
        style={{
          background: `linear-gradient(135deg, rgba(18,20,31,0.95), ${tierColor}08)`,
          border: `1px solid ${tierColor}20`,
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          {/* Level badge */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-mono flex-shrink-0"
            style={{
              background: `${tierColor}15`,
              border: `2px solid ${tierColor}40`,
              color: tierColor,
              boxShadow: `0 0 20px ${tierColor}10`,
            }}
          >
            {collectorLevel.level}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-bold">{PROFILE.username}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{ color: tierColor, background: `${tierColor}15`, border: `1px solid ${tierColor}20` }}
              >
                {collectorLevel.tier}
              </span>
              <span className="text-xs text-muted">Since {new Date(PROFILE.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted font-mono">
              {collectorLevel.currentXP.toLocaleString()} XP
            </span>
            <span className="text-[10px] text-muted font-mono">
              {collectorLevel.xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-border/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${tierColor}, ${tierColor}cc)` }}
              initial={{ width: 0 }}
              animate={{ width: `${collectorLevel.progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {[
            { label: 'Cards', value: ownedCards.length },
            { label: 'Value', value: `$${totalValue.toFixed(0)}` },
            { label: 'Streak', value: `${streak}d` },
            { label: 'Packs', value: packs },
            { label: 'Badges', value: earnedIds.size },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-xl bg-background/40">
              <div className="text-base font-bold font-mono">{stat.value}</div>
              <div className="text-[9px] text-muted uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Season Track — hero section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <SeasonTrack />
      </motion.section>

      {/* Showcase */}
      {showcaseCards.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Showcase</span>
            <Link href="/collection/showcase" className="text-xs text-accent hover:text-accent/80 transition-colors">
              Edit
            </Link>
          </div>
          <div
            className="p-6 rounded-2xl overflow-hidden relative"
            style={{
              background: SHOWCASE_THEMES[activeShowcaseTheme].bg,
              border: `1px solid ${SHOWCASE_THEMES[activeShowcaseTheme].border}`,
            }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }} />
            <div className="flex gap-4 overflow-x-auto pb-2 relative z-10 no-scrollbar">
              {showcaseCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex-shrink-0"
                >
                  <CardItem card={card} size="lg" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Achievements</span>
          <span className="text-xs text-muted">{earnedIds.size}/{ACHIEVEMENTS.length}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((achievement, i) => {
            const isEarned = earnedIds.has(achievement.id);
            const color = getAchievementRarityColor(achievement.rarity);
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`p-3 rounded-xl text-center transition-all ${
                  isEarned ? 'bg-surface border border-border' : 'bg-surface/30 border border-border/30 opacity-40'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold"
                  style={{
                    background: isEarned ? `${color}20` : 'rgba(31,34,55,0.3)',
                    color: isEarned ? color : '#3a3d5c',
                    border: `1px solid ${isEarned ? color + '30' : 'rgba(31,34,55,0.2)'}`,
                  }}
                >
                  {isEarned ? achievement.icon : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  )}
                </div>
                <div className="text-xs font-semibold truncate">{achievement.name}</div>
                <div className="text-[9px] text-muted mt-0.5 truncate">{achievement.description}</div>
                {isEarned && (
                  <div
                    className="text-[8px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded inline-block"
                    style={{ color, background: `${color}10` }}
                  >
                    {achievement.mockPercent}% earned
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Set Completion */}
      <section className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-4 block">Set Completion</span>
        <div className="space-y-3">
          {setStats.map((set, i) => {
            const pct = set.total > 0 ? Math.round((set.owned / set.total) * 100) : 0;
            return (
              <motion.div
                key={set.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl bg-surface border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{set.icon}</span>
                    <span className="font-semibold text-sm">{set.name}</span>
                  </div>
                  <span className="text-xs text-muted font-mono">{set.owned}/{set.total}</span>
                </div>
                <div className="relative h-2 rounded-full bg-background overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Scarcity Distribution */}
      <section className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-4 block">Scarcity Distribution</span>
        <div className="grid grid-cols-5 gap-3">
          {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as Scarcity[]).map((scarcity) => (
            <div
              key={scarcity}
              className="p-3 rounded-xl text-center"
              style={{
                background: `${SCARCITY_CONFIG[scarcity].color}10`,
                border: `1px solid ${SCARCITY_CONFIG[scarcity].color}30`,
              }}
            >
              <div className="text-xl font-bold font-mono" style={{ color: SCARCITY_CONFIG[scarcity].color }}>
                {scarcityDist[scarcity] || 0}
              </div>
              <div className="text-[10px] text-muted capitalize">{scarcity}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Debug / Testing */}
      <section className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted/30 mb-4 block">Testing Controls</span>
        <div className="flex gap-3">
          <button
            onClick={() => { addPackCredits(5); window.location.reload(); }}
            className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 hover:bg-green-500/20"
          >
            +5 Pack Credits
          </button>
          <button
            onClick={() => { resetAll(); window.location.reload(); }}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20"
          >
            Reset Everything
          </button>
        </div>
        <p className="text-[10px] text-muted/30 mt-2">For demo purposes. Resets localStorage and starts fresh.</p>
      </section>
    </div>
  );
}
