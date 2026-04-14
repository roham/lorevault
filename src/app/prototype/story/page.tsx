'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { STORY_WORLDS, StoryWorld, getUnlockedChapters, getNextLockedChapter } from '@/data/story-maps';
import { ALL_CARDS } from '@/data/cards';
import { getOwnedCards } from '@/lib/store';

type Phase = 'intro' | 'select-world' | 'story-map';

export default function StoryPrototype() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedWorld, setSelectedWorld] = useState<StoryWorld | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ownedCharacters, setOwnedCharacters] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check if user already selected a world (localStorage)
    const savedWorld = localStorage.getItem('lorevault_story_world');
    if (savedWorld) {
      const world = STORY_WORLDS.find(w => w.id === savedWorld);
      if (world) {
        setSelectedWorld(world);
        setPhase('story-map');
      }
    }

    // Get owned characters for unlock checking
    const owned = getOwnedCards();
    setOwnedCharacters(new Set(owned.map(c => c.character)));
  }, []);

  // ═══════════════════════════════════════════
  // PHASE 1: Intro — one line, one emotion
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
            Every card has a story.
          </motion.p>
          <motion.h1
            className="type-display text-foreground mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            What world
            <br />
            calls to you?
          </motion.h1>
          <motion.button
            onClick={() => setPhase('select-world')}
            className="text-xs text-accent font-medium tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
            whileTap={{ scale: 0.95 }}
          >
            Choose your path
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PHASE 2: World selection — full-bleed, swipeable
  // ═══════════════════════════════════════════
  if (phase === 'select-world') {
    const world = STORY_WORLDS[activeIndex];

    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={world.id}
            className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-8"
            style={{
              background: `linear-gradient(180deg, ${world.gradientFrom} 0%, ${world.gradientTo} 40%, #0a0b14 100%)`,
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {/* World icon — large, breathing */}
            <motion.div
              className="text-7xl mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {world.icon}
            </motion.div>

            {/* World name + tagline */}
            <h2 className="type-heading text-foreground mb-2 text-center">{world.name}</h2>
            <p className="text-xs text-muted text-center mb-2">{world.tagline}</p>
            <p className="text-[10px] text-muted/50 text-center mb-8">
              8 chapters &middot; {world.chapters.reduce((sum, ch) => sum + ch.requiredCharacters.length, 0)} cards to collect
            </p>

            {/* Select button */}
            <motion.button
              onClick={() => {
                localStorage.setItem('lorevault_story_world', world.id);
                setSelectedWorld(world);
                setPhase('story-map');
              }}
              className="w-full max-w-xs py-4 rounded-2xl text-sm font-bold tracking-wide"
              style={{
                background: `linear-gradient(135deg, ${world.accentColor}30, ${world.accentColor}15)`,
                border: `1.5px solid ${world.accentColor}40`,
                color: world.accentColor,
              }}
              whileTap={{ scale: 0.97 }}
            >
              Enter {world.name}
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {STORY_WORLDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === activeIndex ? STORY_WORLDS[activeIndex].accentColor : 'rgba(255,255,255,0.15)',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Swipe hint */}
        <div className="absolute top-20 left-0 right-0 text-center">
          <span className="text-[10px] text-muted/30 tracking-wider">SWIPE TO EXPLORE</span>
        </div>

        {/* Edge bleeds — subtle preview of neighbors */}
        {activeIndex > 0 && (
          <button
            onClick={() => setActiveIndex(activeIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-20 flex items-center justify-center"
            style={{ opacity: 0.3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {activeIndex < STORY_WORLDS.length - 1 && (
          <button
            onClick={() => setActiveIndex(activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-20 flex items-center justify-center"
            style={{ opacity: 0.3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // PHASE 3: Story map — the locked-door experience
  // ═══════════════════════════════════════════
  if (phase === 'story-map' && selectedWorld) {
    const unlocked = getUnlockedChapters(selectedWorld, ownedCharacters);
    const unlockedCount = unlocked.size;
    const totalCount = selectedWorld.chapters.length;
    const nextLocked = getNextLockedChapter(selectedWorld, ownedCharacters);

    return (
      <div className="min-h-screen px-4 py-6">
        {/* Header — progress */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="type-subheading text-foreground">{selectedWorld.name}</h2>
            <p className="text-[10px] text-muted mt-0.5">
              Chapter {unlockedCount} of {totalCount}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-border/30 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: selectedWorld.accentColor }}
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[10px] font-mono" style={{ color: selectedWorld.accentColor }}>
              {unlockedCount}/{totalCount}
            </span>
          </div>
        </div>

        {/* Story nodes — vertical timeline */}
        <div className="space-y-3 max-w-md mx-auto">
          {selectedWorld.chapters.map((chapter, i) => {
            const isUnlocked = unlocked.has(chapter.id);
            const isNext = nextLocked?.id === chapter.id;

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <StoryNodeCard
                  chapter={chapter}
                  isUnlocked={isUnlocked}
                  isNext={isNext}
                  accentColor={selectedWorld.accentColor}
                  worldGradientFrom={selectedWorld.gradientFrom}
                  ownedCharacters={ownedCharacters}
                  setSlug={selectedWorld.setSlug}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Open packs CTA — only if there are locked chapters */}
        {unlockedCount < totalCount && (
          <motion.div
            className="mt-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => {
                window.location.href = '/prototype/story/pack';
              }}
              className="w-full py-4 rounded-2xl text-sm font-bold tracking-wide text-center"
              style={{
                background: `linear-gradient(135deg, ${selectedWorld.accentColor}20, ${selectedWorld.accentColor}10)`,
                border: `1.5px solid ${selectedWorld.accentColor}30`,
                color: selectedWorld.accentColor,
              }}
            >
              Open packs to unlock the next chapter
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════
// Story Node Card — locked door with visible title + card silhouettes
// ═══════════════════════════════════════════
function StoryNodeCard({
  chapter,
  isUnlocked,
  isNext,
  accentColor,
  worldGradientFrom,
  ownedCharacters,
  setSlug,
}: {
  chapter: import('@/data/story-maps').StoryNode;
  isUnlocked: boolean;
  isNext: boolean;
  accentColor: string;
  worldGradientFrom: string;
  ownedCharacters: Set<string>;
  setSlug: string;
}) {
  const Wrapper = isUnlocked
    ? ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
        <Link href={`/prototype/story/chapter/${chapter.id}`} {...props}>{children}</Link>
      )
    : ({ children, ...props }: { children: React.ReactNode; className?: string }) => (
        <div {...props}>{children}</div>
      );

  // For "next locked" chapter: look up card data for each required character
  const ownedCount = chapter.requiredCharacters.filter(c => ownedCharacters.has(c)).length;
  const totalRequired = chapter.requiredCharacters.length;

  return (
    <Wrapper className="w-full block text-left">
      <div
        className="p-4 rounded-xl transition-all"
        style={{
          background: isUnlocked
            ? `linear-gradient(135deg, ${worldGradientFrom}, ${accentColor}08)`
            : isNext
              ? 'rgba(28, 28, 42, 0.8)'
              : 'rgba(20, 20, 30, 0.4)',
          border: isUnlocked
            ? `1px solid ${accentColor}30`
            : isNext
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(255,255,255,0.03)',
          opacity: !isUnlocked && !isNext ? 0.4 : 1,
        }}
      >
        {/* Chapter header */}
        <div className="flex items-center gap-3">
          {/* Icon or lock */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background: isUnlocked ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
            }}
          >
            {isUnlocked ? chapter.icon : '🔒'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-muted/60 font-mono mb-0.5">
              Chapter {chapter.chapter}
            </div>
            <div
              className="text-sm font-semibold truncate"
              style={{ color: isUnlocked ? 'var(--color-foreground)' : 'var(--color-muted)' }}
            >
              {chapter.title}
            </div>
          </div>

          {/* Read indicator (unlocked) or key counter (next locked) */}
          {isUnlocked ? (
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={accentColor} strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          ) : isNext ? (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                background: ownedCount > 0 ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
                color: ownedCount > 0 ? accentColor : 'var(--color-muted)',
              }}
            >
              {ownedCount}/{totalRequired}
            </span>
          ) : null}
        </div>

        {/* Next locked chapter: teaser + card silhouettes */}
        {!isUnlocked && isNext && (
          <div className="mt-3 ml-[52px]">
            <p className="text-[11px] text-muted/50 italic mb-3">{chapter.teaser}</p>

            {/* Card silhouettes — mini cards showing owned vs missing */}
            <div className="flex gap-2">
              {chapter.requiredCharacters.map(charName => {
                const isOwned = ownedCharacters.has(charName);
                // Look up card for this character's symbol + gradients
                const cardData = ALL_CARDS.find(c => c.character === charName && c.setSlug === setSlug);
                const symbol = cardData?.symbol || '?';
                const gradFrom = cardData?.gradientFrom || '#1a1a2e';
                const gradTo = cardData?.gradientTo || '#0a0b14';

                return (
                  <div key={charName} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-11 rounded-md flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: isOwned
                          ? `linear-gradient(145deg, ${gradFrom}, ${gradTo})`
                          : 'rgba(15, 15, 25, 0.8)',
                        border: isOwned
                          ? `1.5px solid ${accentColor}50`
                          : '1.5px solid rgba(255,255,255,0.06)',
                        boxShadow: isOwned ? `0 0 8px ${accentColor}15` : 'none',
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{
                          opacity: isOwned ? 0.8 : 0.15,
                          filter: isOwned ? 'none' : 'grayscale(1)',
                        }}
                      >
                        {symbol}
                      </span>
                      {/* Checkmark overlay for owned */}
                      {isOwned && (
                        <div
                          className="absolute -bottom-px -right-px w-3.5 h-3.5 rounded-tl-md flex items-center justify-center"
                          style={{ background: accentColor }}
                        >
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span
                      className="text-[8px] max-w-[40px] text-center truncate leading-tight"
                      style={{
                        color: isOwned ? accentColor : 'var(--color-muted)',
                        opacity: isOwned ? 0.8 : 0.35,
                      }}
                    >
                      {charName.split(' ').pop()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress hint */}
            {ownedCount > 0 && ownedCount < totalRequired && (
              <p className="text-[10px] mt-2" style={{ color: `${accentColor}80` }}>
                {totalRequired - ownedCount} more {totalRequired - ownedCount === 1 ? 'card' : 'cards'} to unlock
              </p>
            )}
          </div>
        )}

        {/* Distant locked chapters: just show character count */}
        {!isUnlocked && !isNext && (
          <div className="mt-1 ml-[52px]">
            <span className="text-[9px] text-muted/25">
              {totalRequired} {totalRequired === 1 ? 'card' : 'cards'} needed
            </span>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
