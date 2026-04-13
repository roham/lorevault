'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { CHALLENGES } from '@/data/challenges';
import { getOwnedCards, getPackCredits, getXP, getStreak, getShowcaseIds, getOwnedCardIds } from '@/lib/store';
import { shouldShowWelcome } from '@/lib/onboarding';
import { Card } from '@/data/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [showcaseCards, setShowcaseCards] = useState<Card[]>([]);
  const [packs, setPacks] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Redirect new users to welcome
    if (shouldShowWelcome()) {
      router.replace('/welcome');
      return;
    }

    const owned = getOwnedCards();
    setOwnedCards(owned);
    setPacks(getPackCredits());
    setXp(getXP());
    setStreak(getStreak());

    const sIds = getShowcaseIds();
    setShowcaseCards(sIds.map(id => owned.find(c => c.id === id)).filter(Boolean) as Card[]);
    setReady(true);
  }, [router]);

  const featuredCards = SETS.map(set => {
    const setCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
    return setCards.find(c => c.scarcity === 'legendary') || setCards.find(c => c.scarcity === 'epic') || setCards[0];
  }).filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Hero — Pack Opening CTA */}
      <section className="relative px-4 pt-8 pb-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

        <div className="relative">
          {/* Greeting + Stats Row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">Welcome back</h1>
              <p className="text-xs text-muted">{ownedCards.length} cards collected</p>
            </div>
            <div className="flex items-center gap-3">
              {streak > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <span className="text-xs">🔥</span>
                  <span className="text-xs font-bold text-orange-400">{streak}</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10 border border-accent/20">
                <span className="text-xs">⭐</span>
                <span className="text-xs font-bold text-accent">{xp}</span>
              </div>
            </div>
          </div>

          {/* Big Pack CTA */}
          <Link href="/packs">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-2xl p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, #1a103a 0%, #2d1b69 50%, #16213e 100%)',
              }}
            >
              {/* Animated shimmer */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 card-shimmer" />
              </div>

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
                    {packs > 0 ? `${packs} Pack${packs > 1 ? 's' : ''} Available` : 'Earn More Packs'}
                  </p>
                  <h2 className="text-2xl font-bold text-white mb-1">Open Packs</h2>
                  <p className="text-sm text-white/50">
                    Pull cards, chase rarities, build your legend.
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.05, 1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl"
                >
                  🎁
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Your Showcase (if cards exist) */}
      {showcaseCards.length > 0 && (
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Your Showcase</h2>
            <Link href="/collection" className="text-xs text-accent">Edit</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {showcaseCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <CardItem card={card} size="sm" />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Play Games CTA */}
      <section className="px-4 mb-8">
        <Link href="/games">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-2xl p-5 border border-red-500/20"
            style={{
              background: 'linear-gradient(135deg, #1a0a0a 0%, #2d0a1b 50%, #12141f 100%)',
            }}
          >
            <div className="absolute inset-0 opacity-15">
              <div className="absolute inset-0 card-shimmer" />
            </div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs text-red-400 font-medium uppercase tracking-wider mb-1">Card Games</p>
                <h2 className="text-xl font-bold text-white mb-0.5">Play</h2>
                <p className="text-sm text-white/50">Battle, trivia, and earn XP.</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-4xl"
              >
                ⚔️
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* Active Missions */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Active Missions</h2>
          <Link href="/challenges" className="text-xs text-accent">See All</Link>
        </div>
        <div className="space-y-2">
          {CHALLENGES.slice(0, 3).map((challenge, i) => {
            const pct = Math.round((challenge.progress / challenge.total) * 100);
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href="/challenges"
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-lg flex-shrink-0">
                    {challenge.type === 'set-completion' ? '📚' : challenge.type === 'scarcity-chase' ? '💎' : challenge.type === 'daily' ? '📅' : '🎭'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{challenge.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-background overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                        />
                      </div>
                      <span className="text-[10px] text-muted font-mono w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Discover Sets */}
      <section className="px-4 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Discover</h2>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {SETS.map((set, i) => (
            <motion.div
              key={set.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex-shrink-0"
            >
              <Link
                href={`/sets`}
                className="block w-36 rounded-xl overflow-hidden border border-border hover:border-accent/30 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${set.gradientFrom}, ${set.gradientTo})`,
                }}
              >
                <div className="p-4 text-center">
                  <span className="text-3xl block mb-2">{set.icon}</span>
                  <div className="text-xs font-semibold truncate">{set.name}</div>
                  <div className="text-[10px] text-muted">{set.cardCount} cards</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Cards */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Featured</h2>
          <Link href="/marketplace" className="text-xs text-accent">Marketplace</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {featuredCards.slice(0, 5).map((card, i) => (
            <motion.div
              key={card!.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Link href={`/card/${card!.id}`}>
                <CardItem card={card!} size="sm" showPrice />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 mb-8">
        <div className="grid grid-cols-3 gap-2">
          {[
            { href: '/marketplace', label: 'Market', icon: '🏪', desc: 'Buy & sell' },
            { href: '/trade', label: 'Trade', icon: '🔄', desc: 'Swap cards' },
            { href: '/leaderboard', label: 'Ranks', icon: '📊', desc: 'Leaderboard' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors text-center"
            >
              <span className="text-xl block mb-1">{item.icon}</span>
              <div className="text-xs font-semibold">{item.label}</div>
              <div className="text-[9px] text-muted">{item.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
