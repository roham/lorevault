'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SETS } from '@/data/sets';
import { ALL_CARDS } from '@/data/cards';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { getOwnedCards, getPackCredits, generatePack, addOwnedCards, usePackCredit } from '@/lib/store';

type Phase = 'intro' | 'select-set' | 'binder' | 'pack-ready' | 'pack-opening' | 'pack-reveal' | 'pack-summary';

export default function ChasePrototype() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedSetSlug, setSelectedSetSlug] = useState<string | null>(null);
  const [ownedCardIds, setOwnedCardIds] = useState<Set<string>>(new Set());
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [packCards, setPackCards] = useState<Card[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [newForSet, setNewForSet] = useState<string[]>([]);
  const [packs, setPacks] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('lorevault_chase_set');
    if (saved) {
      setSelectedSetSlug(saved);
      setPhase('binder');
    }
    const owned = getOwnedCards();
    setOwnedCardIds(new Set(owned.map(c => c.id)));
    setPacks(getPackCredits());
  }, []);

  // Get the selected set's data
  const selectedSet = SETS.find(s => s.slug === selectedSetSlug);

  // Get all cards in the selected set grouped by unique character
  const setCards = useMemo(() => {
    if (!selectedSetSlug) return [];
    // Get unique characters in order, pick the first card per character
    const seen = new Set<string>();
    const unique: Card[] = [];
    for (const card of ALL_CARDS) {
      if (card.setSlug === selectedSetSlug && !seen.has(card.character)) {
        seen.add(card.character);
        unique.push(card);
      }
    }
    return unique;
  }, [selectedSetSlug]);

  // Check which characters are owned (any card variant)
  const ownedCharacters = useMemo(() => {
    const owned = new Set<string>();
    for (const card of ALL_CARDS) {
      if (ownedCardIds.has(card.id)) {
        owned.add(card.character);
      }
    }
    return owned;
  }, [ownedCardIds]);

  // Set completion stats
  const ownedInSet = setCards.filter(c => ownedCharacters.has(c.character)).length;
  const totalInSet = setCards.length;

  // ═══════════════════════════════════════════
  // PHASE 1: Intro — the hook
  // ═══════════════════════════════════════════
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <motion.p
            className="text-sm text-muted/70 tracking-wide mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Every set tells you what&apos;s missing.
          </motion.p>
          <motion.h1
            className="type-display text-foreground mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            Can you
            <br />
            complete it?
          </motion.h1>
          <motion.button
            onClick={() => setPhase('select-set')}
            className="text-xs font-medium tracking-wide py-3 px-6"
            style={{ color: '#3b82f6' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
            whileTap={{ scale: 0.95 }}
          >
            Choose a set
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PHASE 2: Set selection — binder covers
  // ═══════════════════════════════════════════
  if (phase === 'select-set') {
    return (
      <div
        className="min-h-screen px-4 pt-4"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="type-subheading text-foreground mb-1">Choose Your Set</h2>
          <p className="text-[10px] text-muted/50">6 sets &middot; 120 cards total</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {SETS.map((set, i) => {
            // Count owned in this set
            const setUniqueCards = ALL_CARDS.filter(c => c.setSlug === set.slug)
              .reduce((acc, c) => { if (!acc.has(c.character)) acc.set(c.character, c); return acc; }, new Map<string, Card>());
            const ownedCount = [...setUniqueCards.keys()].filter(ch => ownedCharacters.has(ch)).length;
            const totalCount = setUniqueCards.size;

            return (
              <motion.button
                key={set.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  localStorage.setItem('lorevault_chase_set', set.slug);
                  setSelectedSetSlug(set.slug);
                  setPhase('binder');
                }}
                className="relative aspect-[4/5] rounded-xl overflow-hidden text-left p-4 flex flex-col justify-end"
                style={{
                  background: `linear-gradient(160deg, ${set.gradientFrom}, ${set.gradientTo})`,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Set icon */}
                <div className="text-3xl mb-2">{set.icon}</div>
                <div className="text-xs font-semibold text-foreground truncate">{set.name}</div>
                <div className="text-[10px] text-muted/60 mt-0.5">
                  {ownedCount}/{totalCount} collected
                </div>
                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-white/5 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${totalCount > 0 ? (ownedCount / totalCount) * 100 : 0}%`,
                      background: 'rgba(255,255,255,0.3)',
                    }}
                  />
                </div>
                {/* Completion badge */}
                {ownedCount === totalCount && totalCount > 0 && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500/80 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PHASE 3: Binder — the set grid
  // ═══════════════════════════════════════════
  if (phase === 'binder' && selectedSet) {
    return (
      <div
        className="min-h-screen px-3 pt-2"
        style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Binder header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedSet.icon}</span>
              <h2 className="text-sm font-semibold text-foreground">{selectedSet.name}</h2>
            </div>
            <p className="text-[10px] text-muted/50 mt-0.5 ml-7">
              {ownedInSet} of {totalInSet} collected
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('lorevault_chase_set');
              setSelectedSetSlug(null);
              setPhase('select-set');
            }}
            className="text-[10px] text-muted/40 py-2 px-3"
          >
            Change set
          </button>
        </div>

        {/* Progress bar — wide, accent */}
        <div className="w-full h-2 rounded-full bg-white/5 mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${selectedSet.gradientFrom}, ${selectedSet.gradientTo}, rgba(255,255,255,0.3))` }}
            initial={{ width: 0 }}
            animate={{ width: `${totalInSet > 0 ? (ownedInSet / totalInSet) * 100 : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Binder grid — 4 columns on mobile */}
        <div className="grid grid-cols-4 gap-2">
          {setCards.map((card, i) => {
            const isOwned = ownedCharacters.has(card.character);

            return (
              <motion.div
                key={card.character}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="relative"
              >
                <div
                  className="aspect-[5/7] rounded-lg overflow-hidden relative"
                  style={{
                    background: isOwned
                      ? `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`
                      : 'rgba(15, 15, 25, 0.6)',
                    border: isOwned
                      ? `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}40`
                      : '1.5px dashed rgba(255,255,255,0.06)',
                  }}
                >
                  {isOwned ? (
                    <>
                      {/* Owned card — symbol + vignette */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl" style={{ opacity: 0.8 }}>{card.symbol}</span>
                      </div>
                      <div
                        className="absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.4) 100%)' }}
                      />
                      {/* Scarcity indicator */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: SCARCITY_CONFIG[card.scarcity].color }}
                      />
                    </>
                  ) : (
                    <>
                      {/* Empty slot — silhouette with faded symbol */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-2xl"
                          style={{ opacity: 0.08, filter: 'grayscale(1)' }}
                        >
                          {card.symbol}
                        </span>
                      </div>
                      {/* Dashed border corner accents */}
                      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/8 rounded-tl" />
                      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/8 rounded-tr" />
                      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/8 rounded-bl" />
                      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/8 rounded-br" />
                    </>
                  )}
                </div>

                {/* Character name — always visible */}
                <div
                  className="text-[8px] text-center mt-1 truncate leading-tight px-0.5"
                  style={{
                    color: isOwned ? 'var(--color-foreground)' : 'var(--color-muted)',
                    opacity: isOwned ? 0.8 : 0.25,
                  }}
                >
                  {card.character.length > 12
                    ? card.character.split(' ').slice(-1)[0]
                    : card.character}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fixed bottom CTA — open packs */}
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pt-3"
          style={{
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
            background: 'linear-gradient(to top, rgba(10,11,20,0.95) 60%, transparent)',
          }}
        >
          <button
            onClick={() => {
              if (packs > 0) setPhase('pack-ready');
            }}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-center"
            style={{
              background: packs > 0
                ? `linear-gradient(135deg, ${selectedSet.gradientFrom}, ${selectedSet.gradientTo})`
                : 'rgba(255,255,255,0.03)',
              border: packs > 0
                ? '1.5px solid rgba(255,255,255,0.15)'
                : '1.5px solid rgba(255,255,255,0.05)',
              color: packs > 0 ? 'rgba(255,255,255,0.9)' : 'var(--color-muted)',
              opacity: packs > 0 ? 1 : 0.5,
            }}
          >
            {packs > 0 ? `Open Pack (${packs} left)` : 'No packs available'}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PACK READY — anticipation beat
  // ═══════════════════════════════════════════
  if (phase === 'pack-ready' && selectedSet) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-8"
        onClick={() => {
          const pack = generatePack(selectedSet.slug);
          const newIds = pack.map(c => c.id);
          addOwnedCards(newIds);
          usePackCredit();
          setPacks(prev => Math.max(0, prev - 1));
          setPackCards(pack);
          setCurrentRevealIndex(0);

          // Track which are new for this set
          const newChars = pack.filter(c =>
            c.setSlug === selectedSet.slug && !ownedCharacters.has(c.character)
          ).map(c => c.character);
          setNewForSet(newChars);

          // Update owned
          setOwnedCardIds(prev => {
            const next = new Set(prev);
            newIds.forEach(id => next.add(id));
            return next;
          });

          setPhase('pack-opening');
          setTimeout(() => setPhase('pack-reveal'), 800);
        }}
        role="button"
        tabIndex={0}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {selectedSet.icon}
          </motion.div>
          <h2 className="type-subheading text-foreground mb-2">{selectedSet.name} Pack</h2>
          <p className="text-[10px] text-muted/40">Tap to open</p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PACK OPENING — burst animation
  // ═══════════════════════════════════════════
  if (phase === 'pack-opening' && selectedSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{
            scale: [1, 1.3, 0.8, 1.4, 1],
            rotate: [0, 8, -8, 4, 0],
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {selectedSet.icon}
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PACK REVEAL — one card at a time with set context
  // ═══════════════════════════════════════════
  if (phase === 'pack-reveal' && packCards.length > 0 && selectedSet) {
    const card = packCards[currentRevealIndex];
    const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
    const isNewForSet = newForSet.includes(card.character);
    const isFromThisSet = card.setSlug === selectedSet.slug;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        onClick={() => {
          if (currentRevealIndex < packCards.length - 1) {
            setCurrentRevealIndex(prev => prev + 1);
          } else {
            setPhase('pack-summary');
          }
        }}
        role="button"
        tabIndex={0}
      >
        {/* Card counter */}
        <div className="absolute top-16 left-0 right-0 text-center">
          <span className="text-[10px] text-muted/30 font-mono">
            {currentRevealIndex + 1} / {packCards.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.7, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Card visual */}
            <div
              className="relative w-48 aspect-[5/7] rounded-xl overflow-hidden mb-4"
              style={{
                border: `2px solid ${scarcityConfig.color}`,
                boxShadow: `0 0 30px ${scarcityConfig.color}20`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-60">{card.symbol}</span>
              </div>
              <div
                className="absolute bottom-2 left-2 right-2 text-center py-1 rounded-lg"
                style={{ background: `${scarcityConfig.color}20` }}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: scarcityConfig.color }}>
                  {card.scarcity}
                </span>
              </div>
            </div>

            {/* Character + moment */}
            <h3 className="type-subheading text-foreground text-center mb-1">{card.character}</h3>
            <p className="text-xs text-muted text-center italic mb-3">{card.moment}</p>

            {/* NEW badge + set context */}
            {isFromThisSet && isNewForSet && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-1.5 rounded-full text-center"
                style={{
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                }}
              >
                <span className="text-[10px] font-bold text-green-400">NEW FOR YOUR SET</span>
              </motion.div>
            )}

            {isFromThisSet && !isNewForSet && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] text-muted/40"
              >
                Already in collection
              </motion.div>
            )}

            {!isFromThisSet && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] text-muted/30 italic"
              >
                From another set
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Tap hint */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] text-muted/30">
            {currentRevealIndex < packCards.length - 1 ? 'Tap for next card' : 'Tap to see results'}
          </span>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PACK SUMMARY — set completion focus
  // ═══════════════════════════════════════════
  if (phase === 'pack-summary' && selectedSet) {
    const newCount = newForSet.length;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <motion.div
          className="text-center w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* New cards celebration */}
          {newCount > 0 ? (
            <motion.div
              className="mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="type-subheading text-green-400 mb-1">
                {newCount} New {newCount === 1 ? 'Card' : 'Cards'}!
              </h3>
              <p className="text-[10px] text-muted/50">
                {newForSet.join(', ')}
              </p>
            </motion.div>
          ) : (
            <div className="mb-6">
              <h3 className="type-subheading text-muted/60 mb-1">No new cards this time</h3>
              <p className="text-[10px] text-muted/30">Duplicates happen — keep going</p>
            </div>
          )}

          {/* Mini card row */}
          <div className="flex justify-center gap-2 mb-6">
            {packCards.map((card, i) => {
              const isNew = newForSet.includes(card.character) && card.setSlug === selectedSet.slug;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="w-10 h-14 rounded-lg flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                    border: `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}`,
                    opacity: card.setSlug === selectedSet.slug ? 1 : 0.4,
                  }}
                >
                  <span className="text-sm">{card.symbol}</span>
                  {isNew && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-[6px] text-white font-bold">+</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Set completion progress */}
          <div className="mb-8 p-3 rounded-xl bg-surface/30 border border-border/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted">{selectedSet.name}</span>
              <span className="text-[10px] font-mono text-foreground/70">
                {ownedInSet}/{totalInSet}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 mt-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${selectedSet.gradientFrom}, ${selectedSet.gradientTo}, rgba(255,255,255,0.3))` }}
                initial={{ width: `${totalInSet > 0 ? ((ownedInSet - newCount) / totalInSet) * 100 : 0}%` }}
                animate={{ width: `${totalInSet > 0 ? (ownedInSet / totalInSet) * 100 : 0}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            {ownedInSet < totalInSet && (
              <p className="text-[9px] text-muted/40 mt-1.5">
                {totalInSet - ownedInSet} more to complete the set
              </p>
            )}
            {ownedInSet === totalInSet && (
              <p className="text-[9px] text-green-400/80 mt-1.5 font-medium">
                Set complete!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {packs > 0 && (
              <button
                onClick={() => {
                  setPackCards([]);
                  setNewForSet([]);
                  setPhase('pack-ready');
                }}
                className="py-3 rounded-xl text-sm font-bold"
                style={{
                  background: `linear-gradient(135deg, ${selectedSet.gradientFrom}, ${selectedSet.gradientTo})`,
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                Open another pack ({packs} left)
              </button>
            )}
            <button
              onClick={() => setPhase('binder')}
              className="py-3 rounded-xl text-sm font-medium text-center text-muted border border-border/30"
            >
              Back to binder
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
