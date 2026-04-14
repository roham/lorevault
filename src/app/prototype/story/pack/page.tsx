'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { generatePack, addOwnedCards, getPackCredits, usePackCredit, getOwnedCards } from '@/lib/store';
import { STORY_WORLDS, getUnlockedChapters } from '@/data/story-maps';

type Phase = 'ready' | 'opening' | 'reveal' | 'summary';

const RARITY_PARTICLES: Record<string, { count: number; color: string }> = {
  common: { count: 0, color: '#6b7094' },
  uncommon: { count: 3, color: '#22c55e' },
  rare: { count: 6, color: '#3b82f6' },
  epic: { count: 10, color: '#a855f7' },
  legendary: { count: 15, color: '#f59e0b' },
};

export default function StoryPackPage() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [worldId, setWorldId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [packs, setPacks] = useState(0);
  const [chaptersUnlockedBefore, setChaptersUnlockedBefore] = useState(0);
  const [chaptersUnlockedAfter, setChaptersUnlockedAfter] = useState(0);
  const [newlyUnlockedChapters, setNewlyUnlockedChapters] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lorevault_story_world');
    if (!saved) {
      window.location.href = '/prototype/story';
      return;
    }
    setWorldId(saved);
    setPacks(getPackCredits());

    // Count chapters unlocked before opening
    const world = STORY_WORLDS.find(w => w.id === saved);
    if (world) {
      const owned = getOwnedCards();
      const chars = new Set(owned.map(c => c.character));
      setChaptersUnlockedBefore(getUnlockedChapters(world, chars).size);
    }
  }, []);

  const world = STORY_WORLDS.find(w => w.id === worldId);

  const openPack = useCallback(() => {
    if (!world) return;

    // Generate pack from story world's set
    const pack = generatePack(world.setSlug);
    const newCardIds = pack.map(c => c.id);
    addOwnedCards(newCardIds);
    usePackCredit();
    setPacks(prev => Math.max(0, prev - 1));
    setCards(pack);
    setCurrentCardIndex(0);
    setPhase('opening');

    // Check for newly unlocked chapters
    const allOwned = getOwnedCards();
    const chars = new Set(allOwned.map(c => c.character));
    const unlockedNow = getUnlockedChapters(world, chars);
    setChaptersUnlockedAfter(unlockedNow.size);

    const newChapters = world.chapters
      .filter(ch => unlockedNow.has(ch.id))
      .filter(ch => {
        // Was this chapter locked before?
        const beforeChars = new Set(allOwned.filter(c => !newCardIds.includes(c.id)).map(c => c.character));
        const beforeUnlocked = getUnlockedChapters(world, beforeChars);
        return !beforeUnlocked.has(ch.id);
      });
    setNewlyUnlockedChapters(newChapters.map(ch => ch.title));

    // Start the reveal sequence after a beat
    setTimeout(() => setPhase('reveal'), 800);
  }, [world]);

  const advanceCard = useCallback(() => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setPhase('summary');
    }
  }, [currentCardIndex, cards.length]);

  if (!world) return null;

  // ═══════════════════════════════════════════
  // READY — "Open a pack" with world context
  // ═══════════════════════════════════════════
  if (phase === 'ready') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-4">{world.icon}</div>
          <h2 className="type-subheading text-foreground mb-2">{world.name} Pack</h2>
          <p className="text-xs text-muted mb-1">5 cards from this world&apos;s story</p>
          <p className="text-[10px] text-muted/50 mb-8">{packs} pack{packs !== 1 ? 's' : ''} available</p>

          {packs > 0 ? (
            <motion.button
              onClick={openPack}
              className="py-4 px-10 rounded-2xl text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${world.accentColor}30, ${world.accentColor}15)`,
                border: `1.5px solid ${world.accentColor}40`,
                color: world.accentColor,
              }}
              whileTap={{ scale: 0.95 }}
            >
              Open Pack
            </motion.button>
          ) : (
            <p className="text-xs text-muted/50">No packs available</p>
          )}

          <Link href="/prototype/story" className="block mt-6 py-2 text-[10px] text-muted/40">
            Back to story map
          </Link>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // OPENING — brief anticipation animation
  // ═══════════════════════════════════════════
  if (phase === 'opening') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{
            scale: [1, 1.2, 0.8, 1.3, 1],
            rotate: [0, 5, -5, 3, 0],
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {world.icon}
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // REVEAL — one card at a time with narrative snippet
  // ═══════════════════════════════════════════
  if (phase === 'reveal' && cards.length > 0) {
    const card = cards[currentCardIndex];
    const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
    const particles = RARITY_PARTICLES[card.scarcity];

    // Find which chapter this card's character is needed for
    const relatedChapter = world.chapters.find(ch =>
      ch.requiredCharacters.includes(card.character)
    );

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        onClick={advanceCard}
        role="button"
        tabIndex={0}
      >
        {/* Card counter */}
        <div className="absolute top-16 left-0 right-0 text-center">
          <span className="text-[10px] text-muted/30 font-mono">
            {currentCardIndex + 1} / {cards.length}
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
            {/* Card visual — simplified */}
            <div
              className="relative w-48 aspect-[5/7] rounded-xl overflow-hidden mb-6"
              style={{
                border: `2px solid ${scarcityConfig.color}`,
                boxShadow: `0 0 30px ${scarcityConfig.color}20`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                }}
              />
              {/* Card symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-60">{card.symbol}</span>
              </div>
              {/* Rarity badge */}
              <div
                className="absolute bottom-2 left-2 right-2 text-center py-1 rounded-lg"
                style={{ background: `${scarcityConfig.color}20` }}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: scarcityConfig.color }}>
                  {card.scarcity}
                </span>
              </div>
            </div>

            {/* Character name */}
            <h3 className="type-subheading text-foreground text-center mb-1">
              {card.character}
            </h3>
            <p className="text-xs text-muted text-center mb-4 italic">
              {card.moment}
            </p>

            {/* Narrative snippet — the lore quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xs"
            >
              <p className="text-[11px] text-muted/60 text-center leading-relaxed italic">
                &ldquo;{card.loreText.replace(/^"|"$/g, '')}&rdquo;
              </p>
            </motion.div>

            {/* Story connection — which chapter this card unlocks */}
            {relatedChapter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 px-3 py-2 rounded-lg text-center"
                style={{
                  background: `${world.accentColor}10`,
                  border: `1px solid ${world.accentColor}20`,
                }}
              >
                <span className="text-[9px] text-muted/50">Key to</span>
                <div className="text-[11px] font-semibold" style={{ color: world.accentColor }}>
                  {relatedChapter.icon} {relatedChapter.title}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Tap to continue */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] text-muted/30">
            {currentCardIndex < cards.length - 1 ? 'Tap for next card' : 'Tap to see results'}
          </span>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // SUMMARY — what you got + chapter unlocks
  // ═══════════════════════════════════════════
  if (phase === 'summary') {
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
          {/* Chapter unlock celebration */}
          {newlyUnlockedChapters.length > 0 && (
            <motion.div
              className="mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl mb-2">{world.icon}</div>
              <h3 className="type-subheading mb-2" style={{ color: world.accentColor }}>
                Chapter{newlyUnlockedChapters.length > 1 ? 's' : ''} Unlocked!
              </h3>
              {newlyUnlockedChapters.map((title, i) => (
                <div key={i} className="text-xs text-foreground/80 mb-1">{title}</div>
              ))}
            </motion.div>
          )}

          {/* Cards pulled */}
          <div className="mb-6">
            <span className="text-[10px] text-muted/50 block mb-3">Cards pulled</span>
            <div className="flex justify-center gap-2">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="w-10 h-14 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                    border: `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}`,
                  }}
                >
                  <span className="text-sm">{card.symbol}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Story progress */}
          <div className="mb-8 p-3 rounded-xl bg-surface/30 border border-border/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted">Story progress</span>
              <span className="text-[10px] font-mono" style={{ color: world.accentColor }}>
                {chaptersUnlockedAfter}/{world.chapters.length}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border/30 mt-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: world.accentColor }}
                initial={{ width: `${(chaptersUnlockedBefore / world.chapters.length) * 100}%` }}
                animate={{ width: `${(chaptersUnlockedAfter / world.chapters.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {packs > 0 && (
              <button
                onClick={() => {
                  setCards([]);
                  setPhase('ready');
                }}
                className="py-3 rounded-xl text-sm font-bold"
                style={{
                  background: `${world.accentColor}20`,
                  border: `1px solid ${world.accentColor}30`,
                  color: world.accentColor,
                }}
              >
                Open another pack ({packs} left)
              </button>
            )}
            <Link
              href="/prototype/story"
              className="py-3 rounded-xl text-sm font-medium text-center text-muted border border-border/30"
            >
              {newlyUnlockedChapters.length > 0 ? 'Read the new chapter' : 'Back to story map'}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
