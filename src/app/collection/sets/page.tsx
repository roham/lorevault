'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, SCARCITY_CONFIG } from '@/data/types';
import { getOwnedCards } from '@/lib/store';

// ---------------------------------------------------------------------------
// Confetti burst for 100% completion
// ---------------------------------------------------------------------------
function ConfettiBurst() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: -(Math.random() * 300 + 100),
    rotate: Math.random() * 720 - 360,
    scale: Math.random() * 0.8 + 0.4,
    color: ['#f59e0b', '#818cf8', '#a855f7', '#22c55e', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 6)],
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-sm"
          style={{ background: p.color }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: p.scale,
            rotate: p.rotate,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Set grid — every card position
// ---------------------------------------------------------------------------
function SetGrid({
  set,
  ownedCards,
  allSetCards,
  onCardClick,
}: {
  set: typeof SETS[0];
  ownedCards: Card[];
  allSetCards: Card[];
  onCardClick?: (card: Card) => void;
}) {
  const ownedIds = new Set(ownedCards.map(c => c.id));

  // Get unique characters and their base cards
  const characterCards = useMemo(() => {
    const seen = new Set<string>();
    const result: { card: Card; owned: boolean }[] = [];
    for (const card of allSetCards) {
      const key = `${card.character}:${card.moment}`;
      if (!seen.has(key)) {
        seen.add(key);
        // Check if the user owns ANY variant of this character+moment
        const ownedVariant = ownedCards.find(
          c => c.character === card.character && c.moment === card.moment && c.setSlug === set.slug
        );
        result.push({
          card: ownedVariant || card,
          owned: !!ownedVariant,
        });
      }
    }
    return result;
  }, [allSetCards, ownedCards, set.slug]);

  const ownedCount = characterCards.filter(c => c.owned).length;
  const totalCount = characterCards.length;
  const pct = totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0;
  const isComplete = pct === 100;

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{set.icon}</span>
          <div>
            <h3 className="text-lg font-bold">{set.name}</h3>
            <p className="text-xs text-muted">{set.description.slice(0, 80)}...</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{
            color: isComplete ? '#f59e0b' : pct > 50 ? '#22c55e' : '#818cf8',
          }}>
            {pct}%
          </div>
          <div className="text-[10px] text-muted">{ownedCount}/{totalCount} cards</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-border/30 overflow-hidden mb-5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: isComplete
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)'
              : pct > 50
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : 'linear-gradient(90deg, #818cf8, #a78bfa)',
            backgroundSize: isComplete ? '200% 100%' : undefined,
            animation: isComplete ? 'shimmer 2s infinite' : undefined,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {characterCards.map(({ card, owned }, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
          >
            {owned ? (
              <Link href={`/card/${card.id}`}>
                <CardItem card={card} size="md" interactive={true} />
              </Link>
            ) : (
              /* Missing card silhouette */
              <Link href="/packs">
                <div
                  className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden transition-all hover:border-accent/30"
                  style={{
                    width: 180,
                    height: 252,
                    borderColor: 'rgba(31, 34, 55, 0.4)',
                    background: `linear-gradient(145deg, ${card.gradientFrom}20, ${card.gradientTo}10)`,
                  }}
                >
                  {/* Dark silhouette */}
                  <div className="absolute inset-0 bg-black/60" />

                  {/* Character initial */}
                  <span
                    className="text-[50px] font-bold leading-none relative z-10 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ fontFamily: 'Georgia, serif', color: '#fff' }}
                  >
                    {card.character[0]}
                  </span>

                  {/* Symbol ghost */}
                  <span className="text-3xl -mt-1 relative z-10 opacity-10 group-hover:opacity-25 transition-opacity">
                    {card.symbol}
                  </span>

                  {/* Name */}
                  <span className="text-[10px] text-white/20 group-hover:text-white/40 mt-2 relative z-10 text-center px-3 truncate max-w-full transition-colors">
                    {card.character}
                  </span>

                  {/* CTA */}
                  <motion.span
                    className="text-[10px] text-accent/0 group-hover:text-accent/90 mt-1.5 relative z-10 transition-colors font-semibold"
                  >
                    Find this card
                  </motion.span>

                  {/* Lock icon */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity z-10">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* Completion celebration */}
      {isComplete && <ConfettiBurst />}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/20 text-center"
        >
          <span className="text-2xl block mb-1">🏆</span>
          <span className="text-sm font-bold text-yellow-400">Set Complete!</span>
          <span className="text-xs text-muted block mt-0.5">You own every card in {set.name}</span>
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Set Completion Page
// ---------------------------------------------------------------------------
export default function SetCompletionPage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOwnedCards(getOwnedCards());
    setLoaded(true);
  }, []);

  const setStats = useMemo(() => {
    return SETS.map(set => {
      const allSetCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
      // Count unique character+moment combos
      const allChars = new Set(allSetCards.map(c => `${c.character}:${c.moment}`));
      const ownedChars = new Set(
        ownedCards
          .filter(c => c.setSlug === set.slug)
          .map(c => `${c.character}:${c.moment}`)
      );
      return {
        set,
        total: allChars.size,
        owned: ownedChars.size,
        pct: allChars.size > 0 ? Math.round((ownedChars.size / allChars.size) * 100) : 0,
        allCards: allSetCards,
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

  const active = selectedSet ? setStats.find(s => s.set.slug === selectedSet) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/collection" className="text-muted hover:text-foreground transition-colors text-sm">
          Collection
        </Link>
        <span className="text-muted/30">/</span>
        <h1 className="text-2xl font-bold">Set Completion</h1>
      </div>

      {/* Set overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {setStats.map((s, i) => {
          const isComplete = s.pct === 100;
          const isSelected = selectedSet === s.set.slug;
          return (
            <motion.button
              key={s.set.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelectedSet(isSelected ? null : s.set.slug)}
              className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'ring-2 ring-accent shadow-lg shadow-accent/10'
                  : 'hover:shadow-lg'
              }`}
              style={{
                background: `linear-gradient(145deg, ${s.set.gradientFrom}, ${s.set.gradientTo})`,
                border: `1px solid ${isComplete ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {/* Glow for complete sets */}
              {isComplete && (
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.15) 0%, transparent 60%)',
                }} />
              )}

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="text-3xl block mb-2">{s.set.icon}</span>
                  <h3 className="text-base font-bold text-white">{s.set.name}</h3>
                  <p className="text-[10px] text-white/40 mt-0.5">{s.owned}/{s.total} characters</p>
                </div>
                <div className="text-right">
                  <div
                    className="text-3xl font-bold"
                    style={{
                      color: isComplete ? '#f59e0b' : s.pct > 50 ? '#22c55e' : '#818cf8',
                    }}
                  >
                    {s.pct}%
                  </div>
                  {isComplete && <span className="text-[10px] text-yellow-400">COMPLETE</span>}
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="w-full h-1.5 rounded-full bg-black/30 overflow-hidden mt-4 relative z-10">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: isComplete
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : s.pct > 50
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : 'linear-gradient(90deg, #818cf8, #a78bfa)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded set grid */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.section
            key={active.set.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl bg-surface border border-border"
          >
            <SetGrid
              set={active.set}
              ownedCards={ownedCards.filter(c => c.setSlug === active.set.slug)}
              allSetCards={active.allCards}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* No set selected prompt */}
      {!selectedSet && (
        <div className="text-center py-8 text-muted text-sm">
          Select a set above to see your collection progress
        </div>
      )}
    </div>
  );
}
