'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { STORY_WORLDS, StoryNode, StoryWorld, getUnlockedChapters } from '@/data/story-maps';
import { getOwnedCards } from '@/lib/store';

export default function ChapterRevealPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const chapterId = resolvedParams.id;
  const [chapter, setChapter] = useState<StoryNode | null>(null);
  const [world, setWorld] = useState<StoryWorld | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showText, setShowText] = useState(false);
  const [nextChapter, setNextChapter] = useState<StoryNode | null>(null);

  useEffect(() => {
    // Find the chapter across all worlds
    for (const w of STORY_WORLDS) {
      const ch = w.chapters.find(c => c.id === chapterId);
      if (ch) {
        setChapter(ch);
        setWorld(w);

        // Check if unlocked
        const owned = getOwnedCards();
        const chars = new Set(owned.map(c => c.character));
        const unlocked = getUnlockedChapters(w, chars);
        setIsUnlocked(unlocked.has(ch.id));

        // Find next chapter
        const nextIdx = w.chapters.findIndex(c => c.id === chapterId) + 1;
        if (nextIdx < w.chapters.length) {
          setNextChapter(w.chapters[nextIdx]);
        }

        break;
      }
    }
  }, [chapterId]);

  // Trigger text reveal after atmosphere establishes
  useEffect(() => {
    if (chapter && isUnlocked) {
      const timer = setTimeout(() => setShowText(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [chapter, isUnlocked]);

  if (!chapter || !world) return null;

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="type-subheading text-muted mb-2">{chapter.title}</h2>
        <p className="text-xs text-muted/50 mb-2">{chapter.teaser}</p>
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          {chapter.requiredCharacters.map(char => (
            <span key={char} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-muted/40">
              {char}
            </span>
          ))}
        </div>
        <Link
          href="/prototype/story/pack"
          className="text-xs font-medium"
          style={{ color: world.accentColor }}
        >
          Open packs to unlock this chapter
        </Link>
      </div>
    );
  }

  // Split text into sentences for staggered reveal
  const sentences = chapter.text.match(/[^.!?]+[.!?]+/g) || [chapter.text];

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `linear-gradient(180deg, ${world.gradientFrom} 0%, ${world.gradientTo} 30%, #0a0b14 70%)`,
      }}
    >
      {/* Atmosphere — gradient overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${world.accentColor}08, transparent 70%)`,
        }}
      />

      {/* Content — centered, maximum 375px readable width */}
      <div
        className="relative z-10 px-6 pt-16 max-w-[375px] mx-auto"
        style={{ paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Chapter header — fades in first */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="text-[10px] font-mono tracking-wider" style={{ color: `${world.accentColor}80` }}>
            CHAPTER {chapter.chapter}
          </span>
          <h1 className="type-heading text-foreground mt-2 mb-3">{chapter.title}</h1>
          <div className="text-3xl">{chapter.icon}</div>
        </motion.div>

        {/* Narrative text — sentence by sentence, staggered reveal */}
        {showText && (
          <div className="space-y-4">
            {sentences.map((sentence, i) => (
              <motion.p
                key={i}
                className="text-sm text-muted/80 leading-[1.8]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.8, // 0.8s between sentences
                  ease: 'easeOut',
                }}
              >
                {sentence.trim()}
              </motion.p>
            ))}

            {/* Chapter complete marker */}
            <motion.div
              className="text-center pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: sentences.length * 0.8 + 0.5 }}
            >
              <div
                className="w-8 h-px mx-auto mb-6"
                style={{ background: `${world.accentColor}30` }}
              />

              {/* Next chapter tease */}
              {nextChapter && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sentences.length * 0.8 + 1.2 }}
                >
                  <p className="text-[10px] text-muted/40 mb-2">Next chapter</p>
                  <div
                    className="inline-block px-4 py-2 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span className="text-xs text-muted/60">
                      🔒 {nextChapter.title}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted/30 mt-2 italic">
                    {nextChapter.teaser}
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-8">
                <Link
                  href="/prototype/story/pack"
                  className="py-3 rounded-xl text-sm font-bold text-center"
                  style={{
                    background: `${world.accentColor}15`,
                    border: `1px solid ${world.accentColor}25`,
                    color: world.accentColor,
                  }}
                >
                  Open packs for the next chapter
                </Link>
                <Link
                  href="/prototype/story"
                  className="py-3 rounded-xl text-sm text-muted/60 text-center"
                >
                  Back to story map
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
