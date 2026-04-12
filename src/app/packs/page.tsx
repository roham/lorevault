'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, SCARCITY_CONFIG } from '@/data/types';

function getRandomCards(count: number): Card[] {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function PacksPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [currentReveal, setCurrentReveal] = useState(-1);
  const [isOpening, setIsOpening] = useState(false);

  const openPack = useCallback((setSlug: string) => {
    setSelectedPack(setSlug);
    setIsOpening(true);
    setCurrentReveal(-1);

    // Generate random cards from this set (or all if 'mixed')
    const pool = setSlug === 'mixed' ? ALL_CARDS : ALL_CARDS.filter(c => c.setSlug === setSlug);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const cards = shuffled.slice(0, 5);
    setRevealedCards(cards);

    // Start reveal sequence after animation
    setTimeout(() => {
      setCurrentReveal(0);
    }, 1000);
  }, []);

  const revealNext = useCallback(() => {
    if (currentReveal < revealedCards.length - 1) {
      setCurrentReveal(prev => prev + 1);
    }
  }, [currentReveal, revealedCards.length]);

  const resetPack = useCallback(() => {
    setSelectedPack(null);
    setRevealedCards([]);
    setCurrentReveal(-1);
    setIsOpening(false);
  }, []);

  const allRevealed = currentReveal >= revealedCards.length - 1 && revealedCards.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold mb-1">Open Packs</h1>
      <p className="text-sm text-muted mb-8">Each pack contains 5 cards with guaranteed at least 1 Uncommon or better.</p>

      {!isOpening ? (
        /* Pack Selection */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mixed pack */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openPack('mixed')}
            className="p-6 rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-purple-500/10 text-left transition-all hover:border-accent/50"
          >
            <span className="text-4xl mb-3 block">🎲</span>
            <h3 className="font-bold text-lg mb-1">Mixed Pack</h3>
            <p className="text-sm text-muted mb-3">Cards from all sets. Higher chance of rare parallels.</p>
            <div className="text-accent font-semibold">$4.99</div>
          </motion.button>

          {/* Set-specific packs */}
          {SETS.map((set, i) => (
            <motion.button
              key={set.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openPack(set.slug)}
              className="p-6 rounded-2xl border border-border text-left transition-all hover:border-accent/30"
              style={{
                background: `linear-gradient(135deg, ${set.gradientFrom}88, ${set.gradientTo}44)`,
              }}
            >
              <span className="text-4xl mb-3 block">{set.icon}</span>
              <h3 className="font-bold text-lg mb-1">{set.name}</h3>
              <p className="text-sm text-muted mb-3 line-clamp-2">{set.description}</p>
              <div className="text-accent font-semibold">$2.99</div>
            </motion.button>
          ))}
        </div>
      ) : (
        /* Pack Opening Experience */
        <div className="flex flex-col items-center">
          {/* Pack opening animation */}
          {currentReveal === -1 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{
                  rotate: [0, -3, 3, -3, 0],
                  scale: [1, 1.05, 1, 1.05, 1],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-48 h-64 rounded-2xl border-2 border-accent bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center mb-6"
              >
                <span className="text-6xl">📦</span>
              </motion.div>
              <p className="text-muted text-sm animate-pulse">Opening pack...</p>
            </motion.div>
          )}

          {/* Card reveal area */}
          {currentReveal >= 0 && (
            <div className="w-full">
              {/* Current card reveal */}
              <div className="flex flex-col items-center mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentReveal}
                    initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                    animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 18,
                      duration: 0.8,
                    }}
                    className={`mb-4 relative ${
                      revealedCards[currentReveal]?.scarcity === 'legendary' ? 'glow-legendary' :
                      revealedCards[currentReveal]?.scarcity === 'epic' ? 'glow-epic' :
                      revealedCards[currentReveal]?.scarcity === 'rare' ? 'glow-rare' : ''
                    } rounded-xl`}
                  >
                    {revealedCards[currentReveal] && (
                      <>
                        {/* Scarcity flash burst */}
                        {(revealedCards[currentReveal].scarcity === 'epic' || revealedCards[currentReveal].scarcity === 'legendary') && (
                          <motion.div
                            initial={{ opacity: 0.9, scale: 0.5 }}
                            animate={{ opacity: 0, scale: 4 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{
                              background: `radial-gradient(circle, ${SCARCITY_CONFIG[revealedCards[currentReveal].scarcity].color}60, ${SCARCITY_CONFIG[revealedCards[currentReveal].scarcity].color}20, transparent)`,
                              borderRadius: '50%',
                              transform: 'translate(-50%, -50%)',
                              left: '50%',
                              top: '50%',
                              width: '200%',
                              height: '200%',
                            }}
                          />
                        )}
                        {/* Floating particles for legendary */}
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
                                transition={{ duration: 1.5 + Math.random() * 0.5, delay: 0.2 + pi * 0.08, ease: 'easeOut' }}
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

                {/* Card info */}
                {revealedCards[currentReveal] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <p className="text-lg font-bold">{revealedCards[currentReveal].character}</p>
                    <p className="text-sm text-muted">{revealedCards[currentReveal].moment}</p>
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: SCARCITY_CONFIG[revealedCards[currentReveal].scarcity].color }}
                    >
                      {SCARCITY_CONFIG[revealedCards[currentReveal].scarcity].label}
                      {revealedCards[currentReveal].parallel !== 'base' && ` • ${revealedCards[currentReveal].parallel}`}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Card counter */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {revealedCards.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx <= currentReveal ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-4">
                {!allRevealed ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={revealNext}
                    className="px-8 py-3 rounded-xl bg-accent text-white font-semibold text-sm"
                  >
                    Reveal Next ({currentReveal + 1}/{revealedCards.length})
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetPack}
                      className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm"
                    >
                      Open Another Pack
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetPack}
                      className="px-6 py-3 rounded-xl bg-surface border border-border text-foreground font-semibold text-sm"
                    >
                      View Collection
                    </motion.button>
                  </>
                )}
              </div>

              {/* All revealed cards summary */}
              {allRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <h3 className="text-center text-sm text-muted mb-4">Your Pack</h3>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {revealedCards.map((card, idx) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <CardItem card={card} size="sm" />
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
