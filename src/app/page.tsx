'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { CHALLENGES } from '@/data/challenges';

export default function Home() {
  const featuredCards = SETS.map(set => {
    const setCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
    return setCards.find(c => c.scarcity === 'legendary') || setCards.find(c => c.scarcity === 'epic') || setCards[0];
  }).filter(Boolean);

  const recentListings = ALL_CARDS.filter(c => c.listed).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-12 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            Collect the <span className="text-accent">Legends</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-8">
            Premium digital collectible cards featuring the greatest characters from literature, mythology, and folklore.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/packs"
              className="px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              Open a Pack
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3 bg-surface hover:bg-surface-hover text-foreground rounded-xl font-semibold text-sm border border-border transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', icon: '🎁', title: 'Open Packs', desc: 'Use pack credits to open themed packs. Each contains 5 cards with guaranteed rare or better.', href: '/packs' },
            { step: '2', icon: '📦', title: 'Build Your Collection', desc: 'Cards are saved permanently. Chase legendary parallels and low serial numbers.', href: '/collection' },
            { step: '3', icon: '🏆', title: 'Complete Challenges', desc: 'Earn XP, badges, and exclusive rewards by completing set and thematic challenges.', href: '/challenges' },
            { step: '4', icon: '✨', title: 'Show Off', desc: 'Curate your showcase, climb leaderboards, and trade with other collectors.', href: '/profile' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            >
              <Link
                href={item.href}
                className="block p-5 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-all text-center group h-full"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-xs text-accent font-mono mb-1">Step {item.step}</div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors">{item.title}</h3>
                <p className="text-xs text-muted">{item.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Cards Carousel */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Featured Cards</h2>
          <Link href="/marketplace" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {featuredCards.map((card, i) => (
            <motion.div
              key={card!.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="snap-start"
            >
              <CardItem card={card!} size="md" showPrice />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sets Grid */}
      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">Explore Sets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SETS.map((set, i) => (
            <motion.div
              key={set.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                href={`/collection?set=${set.slug}`}
                className="block p-5 rounded-xl border border-border hover:border-accent/30 transition-all group"
                style={{
                  background: `linear-gradient(135deg, ${set.gradientFrom}88, ${set.gradientTo}44)`,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{set.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{set.name}</h3>
                    <p className="text-xs text-muted">{set.cardCount} cards</p>
                  </div>
                </div>
                <p className="text-sm text-muted/80 line-clamp-2">{set.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Active Challenges Preview */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Active Challenges</h2>
          <Link href="/challenges" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CHALLENGES.slice(0, 4).map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                href="/challenges"
                className="block p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{challenge.name}</h3>
                  <span className="text-xs text-muted capitalize px-2 py-0.5 rounded-full bg-background">
                    {challenge.type.replace(/-/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-muted mb-3">{challenge.description}</p>
                <div className="relative h-2 rounded-full bg-background overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted">{challenge.progress}/{challenge.total}</span>
                  <span className="text-[10px] text-accent font-medium">
                    {Math.round((challenge.progress / challenge.total) * 100)}%
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Marketplace Activity */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Listings</h2>
          <Link href="/marketplace" className="text-sm text-accent hover:underline">View all</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {recentListings.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="snap-start"
            >
              <CardItem card={card} size="sm" showPrice />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Cards', value: ALL_CARDS.length.toString(), icon: '🃏' },
            { label: 'Sets', value: SETS.length.toString(), icon: '📚' },
            { label: 'Your Collection', value: '—', icon: '📦' },
            { label: 'Active Challenges', value: CHALLENGES.filter(c => c.active).length.toString(), icon: '🏆' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
              className="p-4 rounded-xl border border-border bg-surface text-center"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-2xl font-bold text-accent">{stat.value}</div>
              <div className="text-xs text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
