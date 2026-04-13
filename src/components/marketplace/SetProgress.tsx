'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { SCARCITY_CONFIG } from '@/data/types';

interface SetProgressProps {
  ownedCardIds: string[];
  onSetClick?: (setSlug: string) => void;
}

export default function SetProgress({ ownedCardIds, onSetClick }: SetProgressProps) {
  const owned = useMemo(() => new Set(ownedCardIds), [ownedCardIds]);

  const setData = useMemo(() => {
    return SETS.map(set => {
      const setCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
      const ownedInSet = setCards.filter(c => owned.has(c.id));
      const uniqueCharactersOwned = new Set(ownedInSet.map(c => c.character)).size;
      const totalCharacters = new Set(setCards.map(c => c.character)).size;
      const pct = Math.round((uniqueCharactersOwned / totalCharacters) * 100);
      const missing = setCards.filter(c => !owned.has(c.id) && c.listed).length;
      const cheapestMissing = setCards
        .filter(c => !owned.has(c.id) && c.listed)
        .sort((a, b) => a.price - b.price)[0];

      return {
        ...set,
        ownedCount: ownedInSet.length,
        totalCount: setCards.length,
        uniqueOwned: uniqueCharactersOwned,
        uniqueTotal: totalCharacters,
        pct,
        missingListings: missing,
        cheapestMissing,
      };
    });
  }, [owned]);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
          <span className="text-accent">📊</span> Your Set Progress
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {setData.map((set, i) => (
          <motion.div
            key={set.slug}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSetClick?.(set.slug)}
            className="p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{set.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate group-hover:text-accent transition-colors">{set.name}</div>
                <div className="text-[10px] text-muted">
                  {set.uniqueOwned}/{set.uniqueTotal} characters
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${set.pct === 100 ? 'text-green-400' : set.pct > 50 ? 'text-accent' : 'text-foreground'}`}>
                  {set.pct}%
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-background overflow-hidden mb-1.5">
              <motion.div
                className={`h-full rounded-full ${set.pct === 100 ? 'bg-green-400' : 'bg-accent'}`}
                initial={{ width: 0 }}
                animate={{ width: `${set.pct}%` }}
                transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            {/* Cheapest missing card */}
            {set.cheapestMissing && set.pct < 100 && (
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted">{set.missingListings} cards available</span>
                <span className="text-[9px] text-green-400 font-mono">
                  from ${set.cheapestMissing.price.toFixed(2)}
                </span>
              </div>
            )}
            {set.pct === 100 && (
              <div className="text-center text-[10px] text-green-400 font-bold">Set Complete!</div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
