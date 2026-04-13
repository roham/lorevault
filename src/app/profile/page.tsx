'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { PROFILE } from '@/data/profile';
import { SCARCITY_CONFIG, Scarcity, Card } from '@/data/types';
import { SETS } from '@/data/sets';
import { getOwnedCards, getShowcaseIds, getXP, getStreak, getPackCredits, resetAll, addPackCredits } from '@/lib/store';
import { getShowcases, getActiveShowcaseId, SHOWCASE_THEMES, ShowcaseTheme } from '@/lib/showcase-store';

export default function ProfilePage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [showcaseCards, setShowcaseCards] = useState<Card[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [packs, setPacks] = useState(0);

  const [activeShowcaseTheme, setActiveShowcaseTheme] = useState<ShowcaseTheme>('dark-glass');

  useEffect(() => {
    const owned = getOwnedCards();
    setOwnedCards(owned);

    // Try new showcase store first, fall back to legacy
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
  }, []);

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
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-surface border border-border mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-2xl">
            📜
          </div>
          <div>
            <h1 className="text-xl font-bold">{PROFILE.username}</h1>
            <p className="text-sm text-muted">Collector since {new Date(PROFILE.joinedDate).toLocaleDateString()}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold text-accent">{xp.toLocaleString()}</div>
            <div className="text-xs text-muted">Collector XP</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Cards', value: ownedCards.length, icon: '🃏' },
            { label: 'Value', value: `$${totalValue.toFixed(0)}`, icon: '💰' },
            { label: 'Streak', value: `${streak}d`, icon: '🔥' },
            { label: 'Packs', value: packs, icon: '🎁' },
            { label: 'Badges', value: PROFILE.badges.length, icon: '🏅' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-background">
              <span className="text-lg block mb-1">{stat.icon}</span>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Showcase Hero */}
      {showcaseCards.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>✨</span> Showcase
            </h2>
            <Link
              href="/collection/showcase"
              className="text-xs text-accent hover:text-accent/80 transition-colors"
            >
              Edit Showcase
            </Link>
          </div>
          <div
            className="p-6 rounded-2xl overflow-hidden relative"
            style={{
              background: SHOWCASE_THEMES[activeShowcaseTheme].bg,
              border: `1px solid ${SHOWCASE_THEMES[activeShowcaseTheme].border}`,
            }}
          >
            {/* Noise texture */}
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

      {/* Badges */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROFILE.badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl bg-surface border border-border text-center"
            >
              <span className="text-3xl block mb-2">{badge.icon}</span>
              <div className="text-sm font-semibold">{badge.name}</div>
              <div className="text-[10px] text-muted mt-1">{badge.description}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Set Completion */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">Set Completion</h2>
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
                  <span className="text-xs text-muted">{set.owned}/{set.total}</span>
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
        <h2 className="text-lg font-bold mb-4">Scarcity Distribution</h2>
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
              <div className="text-xl font-bold" style={{ color: SCARCITY_CONFIG[scarcity].color }}>
                {scarcityDist[scarcity] || 0}
              </div>
              <div className="text-[10px] text-muted capitalize">{scarcity}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Debug / Testing */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-muted/50">Testing Controls</h2>
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
