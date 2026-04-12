'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { SETS } from '@/data/sets';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { generatePack, getPackCredits, usePackCredit, addOwnedCards, addXP, getOwnedCardIds } from '@/lib/store';

export default function PacksPage() {
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [currentReveal, setCurrentReveal] = useState(-1);
  const [isOpening, setIsOpening] = useState(false);
  const [packCredits, setPackCreditsState] = useState(3);
  const [newCards, setNewCards] = useState<Set<string>>(new Set());
  const [duplicates, setDuplicates] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPackCreditsState(getPackCredits());
  }, []);

  const openPack = useCallback((setSlug: string) => {
    if (!usePackCredit()) return;
    setPackCreditsState(prev => prev - 1);

    setIsOpening(true);
    setCurrentReveal(-1);

    const ownedBefore = new Set(getOwnedCardIds());
    const cards = generatePack(setSlug);
    setRevealedCards(cards);

    // Track which are new vs duplicates
    const newOnes = new Set<string>();
    const dupes = new Set<string>();
    for (const card of cards) {
      if (ownedBefore.has(card.id)) {
        dupes.add(card.id);
      } else {
        newOnes.add(card.id);
      }
    }
    setNewCards(newOnes);
    setDuplicates(dupes);

    // Add to collection
    addOwnedCards(cards.map(c => c.id));
    addXP(50 + cards.filter(c => c.scarcity !== 'common').length * 25);

    setTimeout(() => setCurrentReveal(0), 1200);
  }, []);

  const revealNext = useCallback(() => {
    if (currentReveal < revealedCards.length - 1) {
      setCurrentReveal(prev => prev + 1);
    }
  }, [currentReveal, revealedCards.length]);

  const revealAll = useCallback(() => {
    setCurrentReveal(revealedCards.length - 1);
  }, [revealedCards.length]);

  const resetPack = useCallback(() => {
    setRevealedCards([]);
    setCurrentReveal(-1);
    setIsOpening(false);
    setNewCards(new Set());
    setDuplicates(new Set());
  }, []);

  const allRevealed = currentReveal >= revealedCards.length - 1 && revealedCards.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Open Packs</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
          <span className="text-sm">🎁</span>
          <span className="text-sm font-bold text-accent">{packCredits}</span>
          <span className="text-xs text-muted">packs remaining</span>
        </div>
      </div>
      <p className="text-sm text-muted mb-8">Each pack contains 5 cards with at least 1 Uncommon or better. Cards are added to your collection permanently.</p>

      {!isOpening ? (
        /* Pack Selection */
        <>
          {packCredits <= 0 && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
              <p className="text-sm text-yellow-400 font-medium">No pack credits remaining.</p>
              <p className="text-xs text-muted mt-1">Complete challenges to earn more packs, or visit the marketplace to buy individual cards.</p>
              <div className="flex justify-center gap-3 mt-3">
                <Link href="/challenges" className="text-xs text-accent hover:underline">View Challenges</Link>
                <Link href="/marketplace" className="text-xs text-accent hover:underline">Browse Marketplace</Link>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mixed pack */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openPack('mixed')}
              disabled={packCredits <= 0}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                packCredits > 0
                  ? 'border-accent/30 bg-gradient-to-br from-accent/10 to-purple-500/10 hover:border-accent/50'
                  : 'border-border opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-4xl mb-3 block">🎲</span>
              <h3 className="font-bold text-lg mb-1">Mixed Pack</h3>
              <p className="text-sm text-muted mb-3">Cards from all sets. Higher chance of rare parallels.</p>
              <div className="flex items-center justify-between">
                <span className="text-accent font-semibold">1 credit</span>
                <span className="text-xs text-muted">5 cards</span>
              </div>
            </motion.button>

            {SETS.map((set, i) => (
              <motion.button
                key={set.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openPack(set.slug)}
                disabled={packCredits <= 0}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  packCredits > 0
                    ? 'border-border hover:border-accent/30'
                    : 'border-border opacity-50 cursor-not-allowed'
                }`}
                style={{
                  background: packCredits > 0 ? `linear-gradient(135deg, ${set.gradientFrom}88, ${set.gradientTo}44)` : undefined,
                }}
              >
                <span className="text-4xl mb-3 block">{set.icon}</span>
                <h3 className="font-bold text-lg mb-1">{set.name}</h3>
                <p className="text-sm text-muted mb-3 line-clamp-2">{set.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-accent font-semibold">1 credit</span>
                  <span className="text-xs text-muted">5 cards</span>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        /* Pack Opening Experience */
        <div className="flex flex-col items-center">
          {currentReveal === -1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{
                  rotate: [0, -3, 3, -3, 0],
                  scale: [1, 1.08, 1, 1.08, 1],
                }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-48 h-64 rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center mb-6"
              >
                <motion.span
                  className="text-6xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  📦
                </motion.span>
              </motion.div>
              <p className="text-muted text-sm animate-pulse">Opening pack...</p>
            </motion.div>
          )}

          {currentReveal >= 0 && (
            <div className="w-full">
              <div className="flex flex-col items-center mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReveal}
                    initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                    animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 18, duration: 0.8 }}
                    className={`mb-4 relative ${
                      revealedCards[currentReveal]?.scarcity === 'legendary' ? 'glow-legendary' :
                      revealedCards[currentReveal]?.scarcity === 'epic' ? 'glow-epic' :
                      revealedCards[currentReveal]?.scarcity === 'rare' ? 'glow-rare' : ''
                    } rounded-xl`}
                  >
                    {revealedCards[currentReveal] && (
                      <>
                        {(revealedCards[currentReveal].scarcity === 'epic' || revealedCards[currentReveal].scarcity === 'legendary') && (
                          <motion.div
                            initial={{ opacity: 0.9, scale: 0.5 }}
                            animate={{ opacity: 0, scale: 4 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{
                              background: `radial-gradient(circle, ${SCARCITY_CONFIG[revealedCards[currentReveal].scarcity].color}60, transparent)`,
                              borderRadius: '50%',
                              left: '50%', top: '50%',
                              width: '200%', height: '200%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        )}
                        {revealedCards[currentReveal].scarcity === 'legendary' && (
                          <>
                            {Array.from({ length: 8 }).map((_, pi) => (
                              <motion.div
                                key={pi}
                                initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                                animate={{
                                  opacity: 0,
                                  y: -100 - Math.random() * 60,
                                  x: (Math.random() - 0.5) * 120,
                                  scale: 0,
                                }}
                                transition={{ duration: 1.5 + Math.random() * 0.5, delay: 0.2 + pi * 0.08 }}
                                className="absolute z-30 pointer-events-none"
                                style={{
                                  left: `${20 + Math.random() * 60}%`,
                                  bottom: `${10 + Math.random() * 30}%`,
                                  width: 4 + Math.random() * 4,
                                  height: 4 + Math.random() * 4,
                                  borderRadius: '50%',
                                  background: '#f59e0b',
                                  boxShadow: '0 0 6px #f59e0b',
                                }}
                              />
                            ))}
                          </>
                        )}
                        <CardItem card={revealedCards[currentReveal]} size="lg" />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {revealedCards[currentReveal] && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                    <p className="text-lg font-bold">{revealedCards[currentReveal].character}</p>
                    <p className="text-sm text-muted">{revealedCards[currentReveal].moment}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: SCARCITY_CONFIG[revealedCards[currentReveal].scarcity].color }}>
                      {SCARCITY_CONFIG[revealedCards[currentReveal].scarcity].label}
                      {revealedCards[currentReveal].parallel !== 'base' && ` • ${revealedCards[currentReveal].parallel}`}
                    </p>
                    {/* New or duplicate indicator */}
                    <p className={`text-xs mt-1 font-medium ${
                      newCards.has(revealedCards[currentReveal].id) ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {newCards.has(revealedCards[currentReveal].id) ? '✨ NEW' : '↻ Already owned'}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {revealedCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="w-2.5 h-2.5 rounded-full transition-all"
                    style={{
                      background: idx <= currentReveal ? SCARCITY_CONFIG[card.scarcity].color : '#1f2237',
                      boxShadow: idx === currentReveal ? `0 0 6px ${SCARCITY_CONFIG[card.scarcity].color}` : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                {!allRevealed ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={revealNext}
                      className="px-8 py-3 rounded-xl bg-accent text-white font-semibold text-sm"
                    >
                      Reveal Next ({currentReveal + 1}/{revealedCards.length})
                    </motion.button>
                    <button
                      onClick={revealAll}
                      className="px-4 py-3 rounded-xl bg-surface border border-border text-muted text-xs font-medium hover:text-foreground"
                    >
                      Reveal All
                    </button>
                  </>
                ) : (
                  <>
                    {packCredits > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetPack}
                        className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm"
                      >
                        Open Another ({packCredits} left)
                      </motion.button>
                    )}
                    <Link
                      href="/collection"
                      className="px-6 py-3 rounded-xl bg-surface border border-border text-foreground font-semibold text-sm hover:bg-surface-hover"
                    >
                      View Collection
                    </Link>
                  </>
                )}
              </div>

              {/* All revealed summary */}
              {allRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-sm text-muted">Your Pack</h3>
                    <p className="text-xs text-green-400">
                      {newCards.size} new • {duplicates.size} duplicates • +{50 + revealedCards.filter(c => c.scarcity !== 'common').length * 25} XP
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {revealedCards.map((card, idx) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative"
                      >
                        <Link href={`/card/${card.id}`}>
                          <CardItem card={card} size="sm" />
                        </Link>
                        <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          newCards.has(card.id) ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-white'
                        }`}>
                          {newCards.has(card.id) ? 'NEW' : 'DUP'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
