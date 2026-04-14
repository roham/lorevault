'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SavedLineup {
  name: string;
  hitters: { cardId: string; position: string; order: number }[];
  pitcherId: string;
  totalCost: number;
  createdAt: number;
}

function getSavedLineups(): SavedLineup[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('pdb-lineups') || '[]');
  } catch { return []; }
}

export default function BaseballHub() {
  const [lineups, setLineups] = useState<SavedLineup[]>([]);

  useEffect(() => {
    setLineups(getSavedLineups());
  }, []);

  return (
    <div className="min-h-screen px-4 pt-8 pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <Link href="/games" className="text-xs text-muted hover:text-accent transition-colors">
            &larr; Games
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-1">Public Domain Baseball</h1>
        <p className="text-xs text-muted mb-8">MLB Showdown-inspired d20 baseball with literary legends</p>
      </motion.div>

      {/* Main Actions */}
      <div className="space-y-3 mb-8">
        {/* Build Lineup */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/games/baseball/lineup">
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <div className="p-5" style={{ background: 'linear-gradient(135deg, #0a1a2e 0%, #12141f 100%)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    &#9918;
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-0.5">Build Lineup</h3>
                    <p className="text-xs text-muted">
                      Draft 9 hitters + 1 pitcher. 150-point cap. Assign positions and batting order.
                    </p>
                  </div>
                  <div className="text-muted text-xl group-hover:text-blue-400 transition-colors">&rarr;</div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Play Game — coming soon */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border opacity-50">
            <div className="p-5" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #12141f 100%)' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                  &#127922;
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-0.5">Play Ball</h3>
                  <p className="text-xs text-muted">
                    Step up to the plate. Roll the d20. Coming in Cycle 13.
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted font-bold uppercase">
                  Soon
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Saved Lineups */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
        Your Lineups {lineups.length > 0 && `(${lineups.length})`}
      </h2>

      {lineups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl border border-dashed border-border text-center"
        >
          <p className="text-sm text-muted mb-3">No lineups yet. Build your first team!</p>
          <Link
            href="/games/baseball/lineup"
            className="text-xs text-accent hover:underline font-semibold"
          >
            Start Drafting &rarr;
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {lineups.map((lineup, i) => (
            <motion.div
              key={lineup.createdAt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-4 rounded-xl bg-surface border border-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">{lineup.name}</h3>
                  <p className="text-[10px] text-muted">
                    {lineup.hitters.length}/9 hitters &middot; {lineup.totalCost}/150 pts
                  </p>
                </div>
                <span className="text-xs text-muted font-mono">
                  {new Date(lineup.createdAt).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* How to Play */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">How It Works</h2>
        <div className="space-y-2">
          {[
            { step: '1', text: 'Build a team: 9 hitters + 1 pitcher, under 150 points' },
            { step: '2', text: 'Roll a d20 to see who controls the at-bat — pitcher or hitter' },
            { step: '3', text: 'Roll again on the controlling player\'s hit chart for the outcome' },
            { step: '4', text: 'Singles, doubles, home runs, steals — play 3 or 9 innings' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/50">
              <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0">
                {item.step}
              </span>
              <p className="text-xs text-muted leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
