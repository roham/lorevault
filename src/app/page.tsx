'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { SeasonTrackPreview } from '@/components/SeasonTrack';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { CHALLENGES } from '@/data/challenges';
import { Card, getTierForLevel } from '@/data/types';
import { getOwnedCards, getPackCredits, getXP, getStreak, getShowcaseIds, getOwnedCardIds, getCollectorLevel, getDailyMissions } from '@/lib/store';
import { shouldShowWelcome } from '@/lib/onboarding';
import { useRouter } from 'next/navigation';
import { getVipState } from '@/lib/vip';

const TIER_COLORS: Record<string, string> = {
  Newcomer: '#6b7094',
  Collector: '#22c55e',
  Enthusiast: '#3b82f6',
  Connoisseur: '#a855f7',
  Elite: '#f59e0b',
  Legendary: '#ef4444',
};

// Mock trending data
const TRENDING = [
  { name: 'Sherlock Holmes', moment: 'Reichenbach Falls', price: 47.50, change: +12.3 },
  { name: 'Count Dracula', moment: 'The Eternal Night', price: 89.00, change: +8.7 },
  { name: 'Zeus', moment: 'Lightning Crown', price: 62.00, change: -3.2 },
  { name: 'Alice', moment: 'Rabbit Hole', price: 31.00, change: +5.1 },
];

export default function Home() {
  const router = useRouter();
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [packs, setPacks] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ready, setReady] = useState(false);
  const [collectorLevel, setCollectorLevel] = useState({ level: 1, tier: 'Newcomer' as string, progressPercent: 0, currentXP: 0, xpForNextLevel: 100, xpForCurrentLevel: 0 });
  const [dailyMission, setDailyMission] = useState<{ description: string; progress: number; target: number; reward: string } | null>(null);
  const [vipTier, setVipTier] = useState<{ name: string; color: string }>({ name: 'Bronze', color: '#CD7F32' });

  useEffect(() => {
    if (shouldShowWelcome()) {
      router.replace('/welcome');
      return;
    }

    const owned = getOwnedCards();
    setOwnedCards(owned);
    setPacks(getPackCredits());
    setStreak(getStreak());
    setCollectorLevel(getCollectorLevel());

    const vs = getVipState();
    setVipTier({ name: vs.tier.name, color: vs.tier.color });
    const missions = getDailyMissions();
    const incomplete = missions.find(m => !m.completed);
    if (incomplete) setDailyMission(incomplete);
    else if (missions.length > 0) setDailyMission(missions[0]);

    setReady(true);
  }, [router]);

  const tierColor = TIER_COLORS[collectorLevel.tier] || '#818cf8';

  // Featured card: pick the best card from a random set
  const featuredCard = ALL_CARDS.find(c => c.scarcity === 'legendary' && c.setSlug === 'olympus')
    || ALL_CARDS.find(c => c.scarcity === 'legendary')
    || ALL_CARDS[0];

  // Featured horizontal scroll — one standout card per set
  const featuredCards = SETS.map(set => {
    const setCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
    return setCards.find(c => c.scarcity === 'legendary') || setCards.find(c => c.scarcity === 'epic') || setCards[0];
  }).filter(Boolean);

  if (!ready) return null;

  return (
    <div className="min-h-screen">
      {/* ========== HERO — Asymmetric Layout ========== */}
      <section className="relative px-4 pt-4 pb-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(135deg, ${tierColor}08 0%, transparent 40%, rgba(129,140,248,0.03) 100%)`,
        }} />

        <div className="relative flex gap-4 items-start max-w-lg mx-auto">
          {/* Left: Featured card — large, angled */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -3 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            className="flex-shrink-0 relative"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <div className="relative">
              <CardItem card={featuredCard!} size="lg" interactive={false} />
              {/* Glow behind card */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20" style={{
                background: `linear-gradient(135deg, ${featuredCard!.gradientFrom}, ${featuredCard!.gradientTo})`,
                transform: 'scale(1.3)',
              }} />
            </div>
          </motion.div>

          {/* Right: Level + Stats + CTA stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-1 pt-2 min-w-0"
          >
            {/* Collector Level */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold font-mono"
                  style={{
                    background: `${tierColor}15`,
                    border: `1.5px solid ${tierColor}40`,
                    color: tierColor,
                  }}
                >
                  {collectorLevel.level}
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">{collectorLevel.tier}</div>
                  <div className="text-[10px] text-muted font-mono">{collectorLevel.currentXP.toLocaleString()} XP</div>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: tierColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${collectorLevel.progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            {/* Streak + Cards + VIP */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                style={{ backgroundColor: `${vipTier.color}10`, border: `1px solid ${vipTier.color}25` }}
              >
                <span className="text-[10px] font-bold font-mono" style={{ color: vipTier.color }}>{vipTier.name}</span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[10px] font-bold font-mono text-orange-400">{streak}d streak</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface border border-border">
                <span className="text-[10px] font-mono text-muted">{ownedCards.length} cards</span>
              </div>
            </div>

            {/* Open Packs CTA — primary action */}
            <Link href="/packs">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden rounded-xl p-4 mb-3"
                style={{
                  background: 'linear-gradient(135deg, #1a103a 0%, #2d1b69 50%, #16213e 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 card-shimmer" />
                </div>
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-accent/70 mb-0.5">
                    {packs > 0 ? `${packs} Pack${packs > 1 ? 's' : ''} Ready` : 'Earn More Packs'}
                  </div>
                  <div className="text-lg font-bold text-white tracking-tight">Open Packs</div>
                  <div className="text-[11px] text-white/40 mt-0.5">Pull cards. Chase rarities.</div>
                </div>
              </motion.div>
            </Link>

            {/* Season progress mini */}
            <div className="text-[10px] text-muted font-mono">
              Season 1 &middot; Age of Myths
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== DAILY CHALLENGE ========== */}
      {dailyMission && (
        <section className="px-4 mb-6">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2 block">Daily Challenge</span>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-surface border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">{dailyMission.description}</div>
              <span className="text-[10px] font-mono text-accent">{dailyMission.reward}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(dailyMission.progress / dailyMission.target) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
              <span className="text-xs font-mono text-muted">{dailyMission.progress}/{dailyMission.target}</span>
            </div>
          </motion.div>
        </section>
      )}

      {/* ========== FEATURED CARDS — Large horizontal scroll ========== */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Featured</span>
          <Link href="/marketplace" className="text-[11px] text-accent hover:text-accent/80 transition-colors">
            Marketplace
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4">
          {featuredCards.slice(0, 4).map((card, i) => (
            <motion.div
              key={card!.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex-shrink-0"
            >
              <Link href={`/card/${card!.id}`}>
                <CardItem card={card!} size="lg" showPrice />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== TRENDING / MARKET PULSE ========== */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Market Pulse</span>
          <Link href="/marketplace" className="text-[11px] text-accent hover:text-accent/80 transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TRENDING.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
            >
              <Link href="/marketplace">
                <div className="p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors">
                  <div className="text-xs font-semibold truncate">{item.name}</div>
                  <div className="text-[9px] text-muted truncate mb-1.5">{item.moment}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-mono">${item.price.toFixed(0)}</span>
                    <span className={`text-[10px] font-mono font-semibold ${
                      item.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== SEASON TRACK PREVIEW ========== */}
      <section className="px-4 mb-6">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2 block">Season Progress</span>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/profile">
            <SeasonTrackPreview />
          </Link>
        </motion.div>
      </section>

      {/* ========== COLLECTION SNAPSHOT ========== */}
      {ownedCards.length > 0 && (
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Your Collection</span>
            <Link href="/collection" className="text-[11px] text-accent hover:text-accent/80 transition-colors">
              View All
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {ownedCards.slice(-6).reverse().map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex-shrink-0"
              >
                <Link href={`/card/${card.id}`}>
                  <CardItem card={card} size="md" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
