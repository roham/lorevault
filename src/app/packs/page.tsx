'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { SETS } from '@/data/sets';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { generatePack, generateFirstPack, getPackCredits, usePackCredit, addOwnedCards, addXP, getOwnedCardIds, revealCard } from '@/lib/store';
import { getOnboardingState, updateOnboarding, checkUnlocks } from '@/lib/onboarding';
import { checkAchievements, getAchievementById } from '@/lib/achievements';
import AchievementCelebration from '@/components/AchievementCelebration';
import { Achievement } from '@/data/types';
import { useSearchParams } from 'next/navigation';
import { isSeasonActive, getSeasonTimeRemaining, CURRENT_SEASON } from '@/lib/seasonal-vault';
import { SEASONAL_CARDS } from '@/data/seasonal-cards';

function SeasonBanner() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    setActive(isSeasonActive());
    setTime(getSeasonTimeRemaining());
    const interval = setInterval(() => {
      setTime(getSeasonTimeRemaining());
      setActive(isSeasonActive());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-2xl overflow-hidden relative"
      style={{
        background: active
          ? `linear-gradient(135deg, ${CURRENT_SEASON.gradientFrom}20, ${CURRENT_SEASON.gradientTo}20)`
          : 'linear-gradient(135deg, rgba(107,112,148,0.1), rgba(107,112,148,0.05))',
        border: active ? `1px solid ${CURRENT_SEASON.gradientFrom}30` : '1px solid rgba(107,112,148,0.2)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{active ? CURRENT_SEASON.icon : '🔒'}</span>
          <div>
            <div className="text-xs font-bold" style={{ color: active ? '#f97316' : '#6b7094' }}>
              {CURRENT_SEASON.subtitle}
            </div>
            <div className="text-[10px] text-muted">
              {active ? '3 exclusive legendaries — only available this season' : 'Season ended — vault sealed'}
            </div>
          </div>
        </div>
        {active && time.total > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-[10px] font-bold font-mono text-red-400">
              {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
            </span>
          </div>
        )}
      </div>

      {/* Seasonal card preview */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {SEASONAL_CARDS.map((card) => (
          <div key={card.id} className="relative shrink-0">
            <CardItem card={card} size="sm" interactive={false} />
            {!active && (
              <div className="absolute inset-0 rounded-xl bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-lg">🔒</span>
                  <div className="text-[8px] font-bold text-muted mt-0.5">VAULT SEALED</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {active && (
        <Link href="/forge" className="mt-3 block text-center text-[10px] text-orange-400 hover:text-orange-300 font-bold">
          Forge cards at seasonal discount (2 instead of 3) →
        </Link>
      )}
    </motion.div>
  );
}

function PacksContent() {
  const searchParams = useSearchParams();
  const isFirstPack = searchParams.get('first') === 'true';

  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [currentReveal, setCurrentReveal] = useState(-1);
  const [isOpening, setIsOpening] = useState(false);
  const [packCredits, setPackCreditsState] = useState(3);
  const [newCards, setNewCards] = useState<Set<string>>(new Set());
  const [duplicates, setDuplicates] = useState<Set<string>>(new Set());
  const [anticipationPhase, setAnticipationPhase] = useState(false);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [revealedInSession, setRevealedInSession] = useState<Set<string>>(new Set());
  const [revealingCardId, setRevealingCardId] = useState<string | null>(null);
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [achievementsChecked, setAchievementsChecked] = useState(false);

  useEffect(() => {
    setPackCreditsState(getPackCredits());
    // Auto-open first pack if coming from welcome screen
    if (isFirstPack && !getOnboardingState().hasOpenedFirstPack) {
      setIsGuidedMode(true);
      openPack('mixed', true);
    }
  }, [isFirstPack]);

  const openPack = useCallback((setSlug: string, rigged: boolean = false) => {
    if (!usePackCredit()) return;
    setPackCreditsState(prev => prev - 1);
    setSelectedSet(setSlug);
    setAnticipationPhase(true);
    setIsOpening(true);
    setCurrentReveal(-1);

    const ownedBefore = new Set(getOwnedCardIds());
    const cards = rigged ? generateFirstPack() : generatePack(setSlug);
    setRevealedCards(cards);

    const newOnes = new Set<string>();
    const dupes = new Set<string>();
    for (const card of cards) {
      if (ownedBefore.has(card.id)) dupes.add(card.id);
      else newOnes.add(card.id);
    }
    setNewCards(newOnes);
    setDuplicates(dupes);
    const newOwnedIds = addOwnedCards(cards.map(c => c.id));
    addXP(50 + cards.filter(c => c.scarcity !== 'common').length * 25);

    // Update onboarding
    updateOnboarding({
      hasOpenedFirstPack: true,
      totalPacksOpened: (getOnboardingState().totalPacksOpened || 0) + 1,
    });
    checkUnlocks(newOwnedIds.length);

    // Anticipation phase: 2.5 seconds of build-up
    setTimeout(() => {
      setAnticipationPhase(false);
      setCurrentReveal(0);
    }, 2500);
  }, []);

  const revealNext = useCallback(() => {
    if (currentReveal < revealedCards.length - 1) {
      setCurrentReveal(prev => prev + 1);
    }
  }, [currentReveal, revealedCards.length]);

  const handleCardTap = useCallback((card: Card) => {
    if (revealedInSession.has(card.id) || revealingCardId) return;
    setRevealingCardId(card.id);
    // Phase 1 (0-500ms): Ring expansion + scale pulse (visual only via motion state)
    // Phase 2 (500ms): Flash + reveal — flip forceRevealed, persist to localStorage
    setTimeout(() => {
      revealCard(card.id);
      setRevealedInSession(prev => new Set([...prev, card.id]));
    }, 500);
    // Phase 3 (1200ms): Clear revealing state (particles still visible but completing)
    setTimeout(() => {
      setRevealingCardId(null);
    }, 1200);
  }, [revealedInSession, revealingCardId]);

  const resetPack = useCallback(() => {
    setRevealedCards([]);
    setCurrentReveal(-1);
    setIsOpening(false);
    setAnticipationPhase(false);
    setNewCards(new Set());
    setDuplicates(new Set());
    setRevealedInSession(new Set());
    setRevealingCardId(null);
    setAchievementsChecked(false);
    setCelebrationQueue([]);
    setShowCelebration(false);
  }, []);

  const currentCardRevealed = revealedCards[currentReveal] ? revealedInSession.has(revealedCards[currentReveal].id) : false;
  const allRevealed = currentReveal >= revealedCards.length - 1 && revealedCards.length > 0 && currentCardRevealed;

  // Check achievements when pack is fully revealed
  useEffect(() => {
    if (allRevealed && !achievementsChecked) {
      setAchievementsChecked(true);
      const newIds = checkAchievements();
      if (newIds.length > 0) {
        const achievements = newIds
          .map(id => getAchievementById(id))
          .filter(Boolean) as Achievement[];
        setCelebrationQueue(achievements);
        // Small delay so user sees the "pack complete" state first
        setTimeout(() => setShowCelebration(true), 800);
      }
    }
  }, [allRevealed, achievementsChecked]);

  // Full-screen pack opening experience
  if (isOpening) {
    const currentCard = revealedCards[currentReveal];
    const bestCard = revealedCards.length > 0
      ? revealedCards.reduce((best, c) => {
          const order = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
          return order[c.scarcity] > order[best.scarcity] ? c : best;
        })
      : null;

    return (
      <div className="fixed inset-0 z-40 bg-background flex flex-col">
        {/* Anticipation Phase */}
        <AnimatePresence>
          {anticipationPhase && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              {/* Pulsing background */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.1) 0%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.2) 0%, transparent 70%)',
                    'radial-gradient(circle at 50% 50%, rgba(129,140,248,0.1) 0%, transparent 70%)',
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              />

              {/* Pack */}
              <motion.div
                animate={{
                  rotate: [0, -2, 2, -3, 3, -1, 1, 0],
                  scale: [1, 1.02, 1, 1.04, 1, 1.06, 1, 1.08],
                }}
                transition={{ duration: 2.5, ease: 'easeIn' }}
                className="relative"
              >
                {/* Glow behind pack */}
                <motion.div
                  className="absolute inset-0 -m-8 rounded-3xl"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    background: 'radial-gradient(circle, rgba(129,140,248,0.3), transparent)',
                    filter: 'blur(20px)',
                  }}
                />
                <div className="w-56 h-72 rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-accent/20 via-purple-600/20 to-accent/20 flex flex-col items-center justify-center shadow-2xl shadow-accent/20">
                  <motion.span
                    className="text-7xl mb-2"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    📦
                  </motion.span>
                  <span className="text-sm text-white/60 font-medium">
                    {SETS.find(s => s.slug === selectedSet)?.name || 'Mixed Pack'}
                  </span>
                </div>
              </motion.div>

              <motion.p
                className="mt-8 text-muted text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Opening...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Reveal Phase */}
        {!anticipationPhase && currentReveal >= 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            {/* Scarcity background color wash */}
            {currentCard && (
              <motion.div
                key={`bg-${currentReveal}`}
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: `radial-gradient(ellipse at 50% 40%, ${SCARCITY_CONFIG[currentCard.scarcity].color}15, transparent 70%)`,
                }}
              />
            )}

            {/* Card count — dots hide rarity until revealed */}
            <div className="absolute top-6 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2">
                {revealedCards.map((card, idx) => {
                  const dotRevealed = revealedInSession.has(card.id);
                  return (
                    <motion.div
                      key={idx}
                      className="w-3 h-3 rounded-full transition-all"
                      animate={{
                        scale: idx === currentReveal ? 1.3 : 1,
                        opacity: idx <= currentReveal ? 1 : 0.3,
                      }}
                      style={{
                        background: idx < currentReveal || (idx === currentReveal && dotRevealed)
                          ? SCARCITY_CONFIG[card.scarcity].color
                          : idx <= currentReveal ? '#4a4e6a' : '#1f2237',
                        boxShadow: idx === currentReveal && dotRevealed
                          ? `0 0 8px ${SCARCITY_CONFIG[card.scarcity].color}` : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* The card — sealed reveal flow */}
            <AnimatePresence mode="wait">
              {currentCard && (
                <motion.div
                  key={currentReveal}
                  initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                  animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0, x: -200 }}
                  transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                  className={`relative ${
                    revealedInSession.has(currentCard.id) ? (
                      currentCard.scarcity === 'legendary' ? 'glow-legendary' :
                      currentCard.scarcity === 'epic' ? 'glow-epic' :
                      currentCard.scarcity === 'rare' ? 'glow-rare' : ''
                    ) : ''
                  } rounded-xl cursor-pointer`}
                  onClick={() => handleCardTap(currentCard)}
                >
                  {/* Rarity gate ring — expanding glow on tap (Honkai pattern) */}
                  {revealingCardId === currentCard.id && (
                    <motion.div
                      className="absolute inset-0 z-30 pointer-events-none rounded-xl"
                      initial={{ opacity: 0.9, scale: 0.85 }}
                      animate={{ opacity: 0, scale: 1.6 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      style={{
                        border: `3px solid ${SCARCITY_CONFIG[currentCard.scarcity].color}`,
                        boxShadow: `0 0 40px ${SCARCITY_CONFIG[currentCard.scarcity].color}80, inset 0 0 40px ${SCARCITY_CONFIG[currentCard.scarcity].color}30`,
                      }}
                    />
                  )}

                  {/* Scale pulse wrapper during reveal */}
                  <motion.div
                    animate={revealingCardId === currentCard.id
                      ? { scale: [1, 1.08, 0.97, 1.04, 1] }
                      : { scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <CardItem
                      card={currentCard}
                      size="lg"
                      interactive={false}
                      forceRevealed={revealedInSession.has(currentCard.id)}
                    />
                  </motion.div>

                  {/* Reveal flash — bright burst covers the seal-break moment */}
                  {revealedInSession.has(currentCard.id) && (
                    <motion.div
                      className="absolute inset-0 z-30 pointer-events-none rounded-xl"
                      initial={{ opacity: 0.95 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${SCARCITY_CONFIG[currentCard.scarcity].color}aa, ${SCARCITY_CONFIG[currentCard.scarcity].color}40, transparent)`,
                      }}
                    />
                  )}

                  {/* Radial burst for epic/legendary — fires on REVEAL, not arrive */}
                  {revealedInSession.has(currentCard.id) && (currentCard.scarcity === 'epic' || currentCard.scarcity === 'legendary') && (
                    <motion.div
                      initial={{ opacity: 1, scale: 0.5 }}
                      animate={{ opacity: 0, scale: 5 }}
                      transition={{ duration: 1.5 }}
                      className="absolute inset-0 z-20 pointer-events-none rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${SCARCITY_CONFIG[currentCard.scarcity].color}50, transparent)`,
                        left: '50%', top: '50%', width: '100%', height: '100%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  )}

                  {/* Particles — fire on REVEAL, count scales with rarity */}
                  {revealedInSession.has(currentCard.id) && currentCard.scarcity !== 'common' && currentCard.scarcity !== 'uncommon' && (
                    <>
                      {Array.from({ length: currentCard.scarcity === 'legendary' ? 24 : currentCard.scarcity === 'epic' ? 16 : 8 }).map((_, pi) => (
                        <motion.div
                          key={pi}
                          initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                          animate={{
                            opacity: 0,
                            y: -100 - Math.random() * 100,
                            x: (Math.random() - 0.5) * 200,
                            scale: 0,
                          }}
                          transition={{ duration: 1.5 + Math.random(), delay: pi * 0.03 }}
                          className="absolute z-30 pointer-events-none"
                          style={{
                            left: `${10 + Math.random() * 80}%`,
                            bottom: `${10 + Math.random() * 40}%`,
                            width: 3 + Math.random() * 5,
                            height: 3 + Math.random() * 5,
                            borderRadius: '50%',
                            background: SCARCITY_CONFIG[currentCard.scarcity].color,
                            boxShadow: `0 0 8px ${SCARCITY_CONFIG[currentCard.scarcity].color}`,
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card info — sealed: tap prompt / revealed: character details */}
            {currentCard && (
              <motion.div
                key={`info-${currentReveal}-${revealedInSession.has(currentCard.id) ? 'r' : 's'}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-center"
              >
                {!revealedInSession.has(currentCard.id) ? (
                  /* Sealed state — pulse "Tap to reveal" */
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="text-base text-white/60 font-medium">Tap to reveal</p>
                  </motion.div>
                ) : (
                  /* Revealed state — character info with entrance animation */
                  <>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-lg font-bold"
                    >
                      {currentCard.character}
                    </motion.p>
                    <p className="text-sm text-muted">{currentCard.moment}</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm font-bold" style={{ color: SCARCITY_CONFIG[currentCard.scarcity].color }}>
                        {SCARCITY_CONFIG[currentCard.scarcity].label}
                      </span>
                      {currentCard.parallel !== 'base' && (
                        <span className="text-xs text-muted capitalize">• {currentCard.parallel}</span>
                      )}
                      {currentCard.scarcity !== 'common' && (
                        <span className="text-xs text-muted font-mono">#{currentCard.serialNumber}/{currentCard.maxSerial}</span>
                      )}
                    </div>

                    {/* Guided tutorial text (first pack only) — shows after reveal */}
                    {isGuidedMode && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs text-accent/80 mt-2 max-w-xs mx-auto italic"
                      >
                        {currentReveal === 0 && 'Your first card. Every card captures a legendary moment from the world\'s greatest stories.'}
                        {currentReveal === 1 && 'Each card belongs to a themed set. Complete sets to earn exclusive rewards.'}
                        {currentReveal === 2 && currentCard.scarcity !== 'common' && `A ${SCARCITY_CONFIG[currentCard.scarcity].label} card! Only ${currentCard.maxSerial} of these exist.`}
                        {currentReveal === 2 && currentCard.scarcity === 'common' && 'Common cards are the foundation. Collect them all to complete your sets.'}
                        {currentReveal === 3 && 'Cards come in parallels — Silver, Gold, Holographic, and the ultra-rare Obsidian.'}
                        {currentReveal === 4 && 'Your collection has begun. 2 more packs are waiting.'}
                      </motion.p>
                    )}

                    {!isGuidedMode && (
                      <motion.p
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`text-xs mt-1 font-bold ${
                          newCards.has(currentCard.id) ? 'text-green-400' : 'text-yellow-400/70'
                        }`}
                      >
                        {newCards.has(currentCard.id) ? 'NEW CARD!' : 'Already in collection'}
                      </motion.p>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Action buttons — gated on reveal state */}
            <div className="mt-8 flex items-center gap-3">
              {!allRevealed ? (
                <AnimatePresence>
                  {currentCardRevealed && currentReveal < revealedCards.length - 1 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={revealNext}
                      className="px-10 py-3.5 rounded-2xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/20"
                    >
                      Next Card
                    </motion.button>
                  )}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-center mb-2">
                    <p className="text-xs text-muted">Pack complete!</p>
                    <p className="text-sm text-green-400 font-medium">
                      {newCards.size} new • {duplicates.size} dupes • +{50 + revealedCards.filter(c => c.scarcity !== 'common').length * 25} XP
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {isGuidedMode ? (
                      <Link
                        href="/collection"
                        onClick={() => updateOnboarding({ hasSeenCollectionReveal: false })}
                        className="px-8 py-3 rounded-2xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/20"
                      >
                        See Your Collection →
                      </Link>
                    ) : (
                      <>
                        {packCredits > 0 && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={resetPack}
                            className="px-6 py-3 rounded-2xl bg-accent text-white font-bold text-sm"
                          >
                            Open Another ({packCredits})
                          </motion.button>
                        )}
                        <Link
                          href="/collection"
                          className="px-6 py-3 rounded-2xl bg-surface border border-border text-foreground font-semibold text-sm"
                        >
                          View Collection
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* All cards summary (bottom strip) */}
            {allRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 mb-20"
              >
                <div className="flex justify-center gap-2">
                  {revealedCards.map((card, idx) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative"
                    >
                      <CardItem card={card} size="sm" interactive={false} forceRevealed={true} />
                      <div className={`absolute -top-1 -right-1 px-1 py-0.5 rounded text-[7px] font-bold ${
                        newCards.has(card.id) ? 'bg-green-500 text-white' : 'bg-yellow-500/80 text-white'
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

        {/* Achievement celebration */}
        <AchievementCelebration
          visible={showCelebration && celebrationQueue.length > 0}
          achievement={celebrationQueue[0] ?? null}
          onDone={() => {
            if (celebrationQueue.length <= 1) {
              setShowCelebration(false);
              setCelebrationQueue([]);
            } else {
              setCelebrationQueue(prev => prev.slice(1));
            }
          }}
        />
      </div>
    );
  }

  // Pack Selection Screen
  return (
    <div className="px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-2">
        <h1 className="type-heading">Open Packs</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
          <span className="text-sm">🎁</span>
          <span className="text-sm font-bold text-accent">{packCredits}</span>
        </div>
      </div>
      <p className="text-xs text-muted mb-4">5 cards per pack. Guaranteed 1 Uncommon+. Cards added permanently.</p>

      {/* Season Countdown + Exclusive Cards */}
      <SeasonBanner />

      {packCredits <= 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-surface border border-border text-center">
          <span className="text-3xl block mb-2">📭</span>
          <p className="text-sm font-medium mb-1">No packs available</p>
          <p className="text-xs text-muted mb-3">Complete challenges or trade to earn more.</p>
          <Link href="/challenges" className="text-xs text-accent font-medium">View Challenges →</Link>
        </div>
      )}

      <div className="space-y-3">
        {/* Mixed pack — highlighted */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => openPack('mixed')}
          disabled={packCredits <= 0}
          className={`w-full p-5 rounded-2xl text-left transition-all ${
            packCredits > 0
              ? 'bg-gradient-to-r from-accent/15 via-purple-500/15 to-accent/15 border-2 border-accent/30'
              : 'bg-surface border border-border opacity-50'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🎲</span>
            <div className="flex-1">
              <h3 className="font-bold text-base">Mixed Pack</h3>
              <p className="text-xs text-muted">All sets. Higher rare chance.</p>
            </div>
            <span className="text-xs text-accent font-bold">1 credit</span>
          </div>
        </motion.button>

        {SETS.map((set, i) => (
          <motion.button
            key={set.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openPack(set.slug)}
            disabled={packCredits <= 0}
            className={`w-full p-4 rounded-2xl text-left transition-all ${
              packCredits > 0
                ? 'border border-border hover:border-accent/30'
                : 'border border-border opacity-50'
            }`}
            style={{
              background: packCredits > 0 ? `linear-gradient(135deg, ${set.gradientFrom}66, ${set.gradientTo}33)` : undefined,
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{set.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{set.name}</h3>
                <p className="text-xs text-muted line-clamp-1">{set.description}</p>
              </div>
              <span className="text-xs text-muted font-mono">1 credit</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function PacksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PacksContent />
    </Suspense>
  );
}
