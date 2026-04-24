'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SETS } from '@/data/sets';
import { ALL_CARDS } from '@/data/cards';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { getOwnedCards, getPackCredits, generatePack, addOwnedCards, usePackCredit } from '@/lib/store';
import { getCardArtPath, getCardBasePath } from '@/lib/card-image';

/** Get first 3 unique character cards from a set for hero art */
function getSetHeroCards(setSlug: string): Card[] {
  const seen = new Set<string>();
  const heroes: Card[] = [];
  for (const c of ALL_CARDS) {
    if (c.setSlug === setSlug && !seen.has(c.character)) {
      seen.add(c.character);
      heroes.push(c);
      if (heroes.length >= 3) break;
    }
  }
  return heroes;
}

/** Card art with fallback */
function ChaseCardArt({ card }: { card: Card }) {
  const artPath = getCardArtPath(card);
  const basePath = getCardBasePath(card);
  const [src, setSrc] = useState(artPath);
  const [hasArt, setHasArt] = useState(true);
  if (!hasArt) return null;
  return (
    <img
      src={src}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => {
        if (src !== basePath) setSrc(basePath);
        else setHasArt(false);
      }}
      loading="lazy"
      draggable={false}
    />
  );
}

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
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);

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

  // Chase card — rarest missing character in this set (the card you WANT)
  const chaseCard = useMemo(() => {
    if (!selectedSetSlug) return null;
    const rank: Record<string, number> = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
    return ALL_CARDS
      .filter(c => c.setSlug === selectedSetSlug && !ownedCharacters.has(c.character))
      .sort((a, b) => (rank[b.scarcity] || 0) - (rank[a.scarcity] || 0))[0] || null;
  }, [selectedSetSlug, ownedCharacters]);

  // ═══════════════════════════════════════════
  // PHASE 1: Intro — the hook
  // ═══════════════════════════════════════════
  if (phase === 'intro') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #0f1a2e 0%, #080c18 50%, #000000 100%)' }}
      >
        {/* Floating ambient card art */}
        {(() => {
          const heroes = getSetHeroCards('asgard');
          return heroes.map((card, i) => (
            <motion.div
              key={card.id}
              className="absolute w-[110px] aspect-[5/7] rounded-xl overflow-hidden pointer-events-none"
              style={{
                opacity: 0.06,
                filter: 'blur(2px)',
                left: `${15 + i * 28}%`,
                top: `${30 + Math.abs(i - 1) * 12}%`,
                transform: `rotate(${(i - 1) * 10}deg)`,
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChaseCardArt card={card} />
            </motion.div>
          ));
        })()}

        <motion.div
          className="text-center relative z-10"
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
        style={{
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          background: 'radial-gradient(ellipse at 50% 20%, #0f1a2e 0%, #080c18 40%, #000000 100%)',
        }}
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
                {/* Hero card art background */}
                {(() => {
                  const heroes = getSetHeroCards(set.slug);
                  return heroes.map((hero, hi) => (
                    <motion.div
                      key={hero.id}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        opacity: hi === 0 ? 0.25 : 0.12,
                        transform: `rotate(${(hi - 1) * 8}deg) scale(${1.1 + hi * 0.05})`,
                      }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3 + hi * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ChaseCardArt card={hero} />
                    </motion.div>
                  ));
                })()}
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                <div className="relative z-10 text-xs font-semibold text-foreground truncate">{set.name}</div>
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
    const isFinishing = totalInSet > 0 && ownedInSet >= totalInSet * 0.9 && ownedInSet < totalInSet;
    const missingCards = setCards.filter(c => !ownedCharacters.has(c.character));

    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          background: '#050810',
        }}
      >
        {/* Atmospheric fog layers — set-specific */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${selectedSet.gradientFrom}18, transparent 70%)`, filter: 'blur(80px)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: `radial-gradient(circle, ${selectedSet.gradientTo}12, transparent 70%)`, filter: 'blur(60px)' }} />
          <div className="absolute top-1/2 left-0 -translate-x-1/4 w-[300px] h-[300px] rounded-full"
            style={{ background: `radial-gradient(circle, ${selectedSet.gradientFrom}10, transparent 70%)`, filter: 'blur(70px)' }} />
        </div>
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
        {/* Noise texture — kills flat-app feel */}
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }} />
        {/* Ambient particles */}
        {Array.from({ length: 6 }).map((_, i) => {
          const size = 2 + (i % 3);
          const left = 15 + ((i * 37 + 13) % 70);
          const startTop = 15 + ((i * 53 + 7) % 70);
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{ width: size, height: size, background: selectedSet.gradientFrom, left: `${left}%`, top: `${startTop}%` }}
              animate={{ y: [0, -(25 + (i % 4) * 12)], opacity: [0, 0.4, 0] }}
              transition={{ duration: 5 + (i % 3), repeat: Infinity, delay: (i * 0.8) % 4, ease: 'easeInOut' }}
            />
          );
        })}

        {/* Hero Banner — dramatic set identity (260px for atmosphere) */}
        <div className="relative z-10 overflow-hidden" style={{ height: '260px' }}>
          {/* Sharp hero art — not blurred, with gradient fade */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              style={{ opacity: 0.55, filter: 'saturate(1.4)' }}
              initial={{ scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.55 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            >
              <ChaseCardArt card={getSetHeroCards(selectedSet.slug)[0]} />
            </motion.div>
            {/* Bottom fade to void */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(to bottom, transparent 15%, ${selectedSet.gradientFrom}30 40%, rgba(5,8,16,0.95) 85%, #050810 100%)`
            }} />
            {/* Top darken for status bar */}
            <div className="absolute top-0 left-0 right-0 h-16" style={{
              background: 'linear-gradient(to bottom, rgba(5,8,16,0.7), transparent)'
            }} />
            {/* Inner shadow for depth */}
            <div className="absolute inset-0" style={{
              boxShadow: 'inset 0 -40px 60px -20px rgba(5,8,16,0.9), inset 0 0 80px rgba(0,0,0,0.3)'
            }} />
          </div>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} />
          {/* Back button */}
          <button
            onClick={() => {
              localStorage.removeItem('lorevault_chase_set');
              setSelectedSetSlug(null);
              setPhase('select-set');
            }}
            className="absolute top-3 left-3 text-[10px] text-white/40 flex items-center gap-1 z-10 py-1.5 px-2 rounded-lg"
            style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Sets
          </button>
          {/* Hero content — display-size set name + prominent stats */}
          <div className="relative h-full flex flex-col justify-end px-5 pb-4">
            <motion.h2
              className="text-2xl font-bold text-foreground tracking-tight leading-tight"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {selectedSet.name}
            </motion.h2>
            <motion.div
              className="flex items-baseline gap-2 mt-1.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <span className="text-4xl font-bold text-white font-mono leading-none">{ownedInSet}</span>
              <span className="text-lg text-white/20 font-mono">/ {totalInSet}</span>
              {totalInSet > 0 && (
                <span className="text-xs font-medium ml-1" style={{
                  color: ownedInSet === totalInSet ? '#22c55e' : `${selectedSet.gradientTo}90`
                }}>
                  {Math.round((ownedInSet / totalInSet) * 100)}%
                </span>
              )}
            </motion.div>
            {/* Segmented progress — each pip = one card */}
            <motion.div
              className="flex gap-[3px] mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {setCards.map((card, idx) => (
                <motion.div
                  key={card.character}
                  className="h-2 flex-1 rounded-full"
                  style={{
                    background: ownedCharacters.has(card.character)
                      ? selectedSet.gradientTo
                      : 'rgba(255,255,255,0.06)',
                    boxShadow: ownedCharacters.has(card.character)
                      ? `0 0 6px ${selectedSet.gradientTo}40`
                      : 'none',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.025 }}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Content below hero */}
        <div className="relative z-10 px-3 pt-3">

        {/* Chase Card — full-width emotional anchor */}
        {chaseCard && !isFinishing && (
          <motion.div
            className="mb-5 rounded-xl relative overflow-hidden cursor-pointer"
            style={{
              background: 'rgba(8, 10, 20, 0.9)',
              border: `1px solid ${SCARCITY_CONFIG[chaseCard.scarcity].color}18`,
              boxShadow: `0 0 40px ${SCARCITY_CONFIG[chaseCard.scarcity].color}08, 0 4px 20px rgba(0,0,0,0.4)`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => packs > 0 ? setPhase('pack-ready') : undefined}
          >
            {/* Rarity glow behind card */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[200px] h-[200px] rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${SCARCITY_CONFIG[chaseCard.scarcity].color}15, transparent 70%)`, filter: 'blur(40px)' }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="flex flex-col items-center py-5 px-4 relative">
              {/* Label */}
              <div className="text-[9px] tracking-[0.25em] font-medium mb-3" style={{ color: `${SCARCITY_CONFIG[chaseCard.scarcity].color}70` }}>YOUR CHASE</div>
              {/* Large ghost card — the thing you want */}
              <div
                className="w-[120px] h-[168px] rounded-xl relative overflow-hidden mb-4"
                style={{
                  background: `linear-gradient(145deg, ${chaseCard.gradientFrom}20, ${chaseCard.gradientTo}12)`,
                  border: `2px solid ${SCARCITY_CONFIG[chaseCard.scarcity].color}20`,
                  boxShadow: `inset 0 0 30px ${SCARCITY_CONFIG[chaseCard.scarcity].color}10, 0 0 30px ${SCARCITY_CONFIG[chaseCard.scarcity].color}06, 0 8px 32px rgba(0,0,0,0.5)`,
                }}
              >
                {/* Ghost art — visible but frosted, unreachable */}
                <div className="absolute inset-0 opacity-[0.15]" style={{ filter: 'blur(0.5px)' }}>
                  <ChaseCardArt card={chaseCard} />
                </div>
                {/* Pulsing frosted overlay */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 40%, ${SCARCITY_CONFIG[chaseCard.scarcity].color}08, transparent 70%)` }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Traveling shimmer — slow, deliberate */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(105deg, transparent 30%, ${SCARCITY_CONFIG[chaseCard.scarcity].color}08 50%, transparent 70%)` }}
                  animate={{ x: [-120, 120] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                {/* Lock icon — centered, prominent */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={SCARCITY_CONFIG[chaseCard.scarcity].color} strokeWidth="1.5" opacity={0.3}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                {/* Scarcity bar at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: `${SCARCITY_CONFIG[chaseCard.scarcity].color}40` }} />
              </div>
              {/* Chase card info — centered below card */}
              <div className="text-center">
                <div className="text-sm font-semibold text-foreground/90">{chaseCard.character}</div>
                <div className="text-[11px] italic text-muted/35 mt-0.5">{chaseCard.moment}</div>
                <div className="flex items-center justify-center gap-1.5 mt-2.5">
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: SCARCITY_CONFIG[chaseCard.scarcity].color, boxShadow: `0 0 6px ${SCARCITY_CONFIG[chaseCard.scarcity].color}60` }}
                    animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[10px] font-medium" style={{ color: SCARCITY_CONFIG[chaseCard.scarcity].color }}>
                    {SCARCITY_CONFIG[chaseCard.scarcity].label}
                  </span>
                </div>
                {/* Inline CTA — drives action from desire */}
                {packs > 0 && (
                  <motion.div
                    className="mt-3 text-[10px] font-medium tracking-wide"
                    style={{ color: `${SCARCITY_CONFIG[chaseCard.scarcity].color}80` }}
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    Tap to open a pack
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* FINISHING MODE — full-focus on remaining gaps */}
        {isFinishing && (
          <motion.div
            className="mb-5 p-4 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${selectedSet.gradientFrom}40, ${selectedSet.gradientTo}20)`,
              border: `1px solid ${selectedSet.gradientTo}40`,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-[10px] font-bold tracking-wider text-amber-400/80 mb-2">
              ALMOST THERE
            </div>
            <p className="text-xs text-foreground/80 mb-3">
              {missingCards.length} {missingCards.length === 1 ? 'card' : 'cards'} left to complete the set
            </p>
            <div className="flex gap-3">
              {missingCards.map(card => (
                <div key={card.character} className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-[67px] rounded-lg overflow-hidden relative"
                    style={{
                      background: 'rgba(12, 12, 22, 0.9)',
                      border: '1.5px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.08)',
                    }}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <ChaseCardArt card={card} />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ border: '1px solid rgba(245, 158, 11, 0.15)' }}
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-[9px] text-amber-400/60 text-center max-w-[56px] truncate">
                    {card.character}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Binder grid — 3 columns, premium card display */}
        {(() => {
          // Completion ratio drives empty slot warmth
          const completionRatio = totalInSet > 0 ? ownedInSet / totalInSet : 0;
          // Warmth intensifies as you get closer to completion
          const emptyGlowIntensity = completionRatio < 0.3 ? 0.08 : completionRatio < 0.6 ? 0.15 : completionRatio < 0.85 ? 0.25 : 0.4;
          const emptyPulse = completionRatio >= 0.6; // Slots start breathing when >60% complete

          return (
            <div className="grid grid-cols-3 gap-3">
              {setCards.map((card, i) => {
                const isOwned = ownedCharacters.has(card.character);
                const scarcityColor = SCARCITY_CONFIG[card.scarcity].color;

                return (
                  <motion.div
                    key={card.character}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="relative"
                  >
                    <button
                      className="w-full text-left"
                      onClick={() => isOwned ? setInspectedCard(card) : undefined}
                    >
                      <div
                        className="aspect-[5/7] rounded-lg overflow-hidden relative"
                        style={{
                          background: isOwned
                            ? `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`
                            : 'rgba(10, 10, 20, 0.85)',
                          border: isOwned
                            ? `1.5px solid ${scarcityColor}50`
                            : `1.5px solid ${scarcityColor}${completionRatio > 0.6 ? '18' : '0a'}`,
                          boxShadow: isOwned
                            ? `0 4px 16px rgba(0,0,0,0.5), 0 0 12px ${scarcityColor}20`
                            : `inset 0 0 20px ${scarcityColor}${Math.round(emptyGlowIntensity * 255).toString(16).padStart(2, '0')}`,
                        }}
                      >
                        {isOwned ? (
                          <>
                            {/* Owned card — full art with shine */}
                            <ChaseCardArt card={card} />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }} />
                            {/* Top-edge highlight — physical lift simulation */}
                            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'rgba(255,255,255,0.12)' }} />
                            {/* Scarcity bar */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-[2px]"
                              style={{ background: scarcityColor, boxShadow: `0 0 8px ${scarcityColor}40` }}
                            />
                          </>
                        ) : (
                          <>
                            {/* Empty slot — ghost silhouette, glowing not dark */}
                            <div className="absolute inset-0 opacity-[0.08]">
                              <ChaseCardArt card={card} />
                            </div>
                            {/* Warm inner glow — intensity adapts to completion */}
                            <motion.div
                              className="absolute inset-0 rounded-lg pointer-events-none"
                              style={{
                                boxShadow: `inset 0 0 20px 6px ${scarcityColor}${Math.round(emptyGlowIntensity * 255).toString(16).padStart(2, '0')}`,
                                background: `radial-gradient(ellipse at 50% 40%, ${scarcityColor}06, transparent 70%)`,
                              }}
                              animate={emptyPulse ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0.6 }}
                              transition={emptyPulse ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 } : {}}
                            />
                            {/* Rarity dot + card number */}
                            <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${scarcityColor}35` }} />
                              <span className="text-[7px] font-mono" style={{ color: `${scarcityColor}30` }}>#{i + 1}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </button>

                    {/* Character name — always visible */}
                    <div
                      className="text-[10px] text-center mt-1.5 truncate leading-tight px-0.5"
                      style={{
                        color: isOwned ? 'var(--color-foreground)' : scarcityColor,
                        opacity: isOwned ? 0.85 : 0.3,
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
          );
        })()}

        {/* Card inspection overlay */}
        <AnimatePresence>
          {inspectedCard && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-8"
              style={{ background: 'rgba(0,0,0,0.8)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedCard(null)}
            >
              <motion.div
                className="w-full max-w-[240px]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Large card */}
                <div
                  className="aspect-[5/7] rounded-xl overflow-hidden relative mb-4"
                  style={{
                    background: `linear-gradient(145deg, ${inspectedCard.gradientFrom}, ${inspectedCard.gradientTo})`,
                    border: `2px solid ${SCARCITY_CONFIG[inspectedCard.scarcity].color}`,
                    boxShadow: `0 0 40px ${SCARCITY_CONFIG[inspectedCard.scarcity].color}25`,
                  }}
                >
                  <ChaseCardArt card={inspectedCard} />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)' }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                  >
                    <div className="text-sm font-semibold text-white/90 truncate">{inspectedCard.character}</div>
                    <div className="text-[10px] text-white/50">{inspectedCard.moment}</div>
                  </div>
                </div>
                {/* Card details */}
                <div className="text-center">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: SCARCITY_CONFIG[inspectedCard.scarcity].color }}
                  >
                    {inspectedCard.scarcity} {inspectedCard.parallel !== 'base' ? `/ ${inspectedCard.parallel}` : ''}
                  </span>
                  <p className="text-[11px] text-muted/60 mt-2 italic leading-relaxed">
                    {inspectedCard.loreText.replace(/^"|"$/g, '')}
                  </p>
                  <button
                    onClick={() => setInspectedCard(null)}
                    className="mt-4 text-[10px] text-muted/40 py-2 px-4"
                  >
                    Tap to close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Fixed bottom CTA — open packs */}
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pt-3 z-20"
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
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${selectedSet.gradientFrom}60 0%, #080c18 50%, #000000 100%)` }}
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
          {/* Pack art — fanned hero cards with breathing animation */}
          <motion.div
            className="relative w-44 h-56 mb-4"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {getSetHeroCards(selectedSet.slug).map((hero, hi) => (
              <div
                key={hero.id}
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{
                  transform: `rotate(${(hi - 1) * 10}deg) translateY(${hi * -4}px)`,
                  zIndex: 3 - hi,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                <ChaseCardArt card={hero} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            ))}
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${selectedSet.gradientFrom}40 0%, #080c18 50%, #000000 100%)` }}
      >
        <motion.div
          className="relative w-44 h-56 rounded-xl overflow-hidden"
          animate={{
            scale: [1, 1.3, 0.8, 1.4, 1],
            rotate: [0, 8, -8, 4, 0],
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ boxShadow: `0 0 60px ${selectedSet.gradientFrom}80` }}
        >
          {(() => {
            const hero = getSetHeroCards(selectedSet.slug)[0];
            return hero ? (
              <>
                <ChaseCardArt card={hero} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            ) : null;
          })()}
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
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #0f1020 0%, #080c18 50%, #000000 100%)' }}
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

        {/* Rarity pre-signal — colored bloom behind card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`glow-${card.id}`}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
          >
            <div
              className="w-64 h-64 rounded-full"
              style={{
                background: `radial-gradient(circle, ${scarcityConfig.color}30, transparent 70%)`,
                filter: 'blur(30px)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.7, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Card visual — full art with shimmer */}
            <div
              className="relative w-52 aspect-[5/7] rounded-xl overflow-hidden mb-4"
              style={{
                background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                border: `2px solid ${scarcityConfig.color}`,
                boxShadow: `0 0 60px ${scarcityConfig.color}30, 0 8px 32px rgba(0,0,0,0.5)`,
              }}
            >
              <ChaseCardArt card={card} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)' }} />
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)' }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ delay: 0.5, duration: 0.7, ease: 'easeInOut' }}
              />
              <div
                className="absolute bottom-2 left-2 right-2 text-center py-1 rounded-lg"
                style={{ background: `${scarcityConfig.color}20`, backdropFilter: 'blur(4px)' }}
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
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
                className="px-4 py-2 rounded-full text-center"
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0.15)',
                }}
              >
                <span className="text-[11px] font-bold text-green-400 tracking-wider">NEW FOR YOUR SET</span>
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
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          background: 'radial-gradient(ellipse at 50% 40%, #0f1020 0%, #080c18 50%, #000000 100%)',
        }}
      >
        {/* Celebration burst for new cards */}
        {newCount > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 1.5, delay: 0.1 }}
            style={{ background: 'radial-gradient(circle at 50% 50%, #22c55e30, transparent 70%)' }}
          />
        )}

        <motion.div
          className="text-center w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* New cards celebration */}
          {newCount > 0 ? (
            <motion.div
              className="mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
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
                  <ChaseCardArt card={card} />
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
