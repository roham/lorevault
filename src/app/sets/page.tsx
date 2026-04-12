'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { SCARCITY_CONFIG, Scarcity } from '@/data/types';

export default function SetsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold mb-1">Card Sets</h1>
      <p className="text-sm text-muted mb-8">Explore all 5 sets featuring iconic public domain characters.</p>

      <div className="space-y-8">
        {SETS.map((set, si) => {
          const setCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
          const ownedCards = setCards.filter(() => false); // Dynamic — use store in client
          const uniqueOwned = new Set(ownedCards.map(c => c.character)).size;
          const completion = Math.round((uniqueOwned / set.cardCount) * 100);

          // Pick one card per scarcity to show
          const previewCards = (['legendary', 'epic', 'rare', 'uncommon', 'common'] as Scarcity[])
            .map(s => setCards.find(c => c.scarcity === s))
            .filter(Boolean)
            .slice(0, 5);

          return (
            <motion.div
              key={set.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-border overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${set.gradientFrom}66, ${set.gradientTo}33)`,
              }}
            >
              {/* Set header */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">{set.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{set.name}</h2>
                    <p className="text-sm text-muted">{set.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-accent">{completion}%</div>
                    <div className="text-xs text-muted">{uniqueOwned}/{set.cardCount} unique</div>
                  </div>
                </div>

                {/* Completion bar */}
                <div className="relative h-2 rounded-full bg-black/30 overflow-hidden mb-4">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ delay: 0.5 + si * 0.1, duration: 0.8 }}
                  />
                </div>

                {/* Scarcity breakdown */}
                <div className="flex gap-3 mb-4">
                  {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as Scarcity[]).map(scarcity => {
                    const total = setCards.filter(c => c.scarcity === scarcity).length;
                    const owned = ownedCards.filter(c => c.scarcity === scarcity).length;
                    return (
                      <div key={scarcity} className="text-center">
                        <div className="text-xs font-mono font-bold" style={{ color: SCARCITY_CONFIG[scarcity].color }}>
                          {owned}/{total}
                        </div>
                        <div className="text-[9px] text-muted capitalize">{scarcity}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card preview row */}
              <div className="px-6 pb-6">
                <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {previewCards.map((card, i) => (
                    <motion.div
                      key={card!.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                    >
                      <Link href={`/card/${card!.id}`}>
                        <CardItem card={card!} size="sm" showPrice />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Browse set link */}
              <div className="px-6 pb-4">
                <Link
                  href={`/collection?set=${set.slug}`}
                  className="text-xs text-accent hover:underline"
                >
                  Browse full set →
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
