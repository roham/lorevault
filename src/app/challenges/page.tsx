'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CHALLENGES } from '@/data/challenges';
import { SCARCITY_CONFIG } from '@/data/types';
import { getStreak, getXP } from '@/lib/store';
import { areChallengesUnlocked } from '@/lib/onboarding';

const TYPE_COLORS: Record<string, string> = {
  'set-completion': '#3b82f6',
  'scarcity-chase': '#a855f7',
  'thematic': '#f59e0b',
  'daily': '#22c55e',
  'weekly': '#06b6d4',
  'seasonal': '#ec4899',
};

export default function ChallengesPage() {
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [unlocked, setUnlocked] = useState(true);

  useEffect(() => {
    setStreak(getStreak());
    setXp(getXP());
    setUnlocked(areChallengesUnlocked());
  }, []);

  const activeChallenges = CHALLENGES.filter(c => c.active);

  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-24">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="text-5xl block mb-4">🔒</span>
          <h1 className="text-xl font-bold mb-2">Missions Locked</h1>
          <p className="text-sm text-muted max-w-xs mx-auto mb-6">
            Collect 15 cards to unlock missions. Open more packs to grow your collection!
          </p>
          <Link
            href="/packs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-bold text-sm"
          >
            🎁 Open Packs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Header with streak */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="type-heading">Missions</h1>
          <p className="text-xs text-muted">{activeChallenges.length} active</p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <motion.span
                className="text-sm"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔥
              </motion.span>
              <span className="text-sm font-bold text-orange-400">{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-bold text-accent">{xp}</span>
          </div>
        </div>
      </div>

      {/* Streak tracker */}
      <div className="p-4 rounded-2xl bg-surface border border-border mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Daily Streak</span>
          <span className="text-xs text-orange-400 font-medium">
            {streak >= 7 ? '2x XP Active!' : `${7 - streak} days to 2x XP`}
          </span>
        </div>
        <div className="flex gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const completed = i < Math.min(streak, 7);
            const isCurrent = i === Math.min(streak, 6);
            return (
              <div key={`${day}-${i}`} className="flex-1 text-center">
                <div
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                    completed
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : isCurrent
                        ? 'bg-accent/20 text-accent border border-accent/30'
                        : 'bg-background text-muted/30 border border-border/30'
                  }`}
                >
                  {completed ? '✓' : isCurrent ? '!' : '·'}
                </div>
                <span className="text-[9px] text-muted/50">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission cards */}
      <div className="space-y-3">
        {activeChallenges.map((challenge, i) => {
          const pct = Math.round((challenge.progress / challenge.total) * 100);
          const typeColor = TYPE_COLORS[challenge.type] || '#818cf8';

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="p-4 rounded-2xl bg-surface border border-border"
            >
              {/* Mission header */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${typeColor}12`, border: `1px solid ${typeColor}25` }}
                >
                  {challenge.type === 'set-completion' ? '📚' : challenge.type === 'scarcity-chase' ? '💎' : challenge.type === 'daily' ? '📅' : challenge.type === 'weekly' ? '📆' : challenge.type === 'seasonal' ? '🌟' : '🎭'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold mb-0.5">{challenge.name}</h3>
                  <p className="text-xs text-muted line-clamp-1">{challenge.description}</p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize flex-shrink-0"
                  style={{ color: typeColor, background: `${typeColor}12` }}
                >
                  {challenge.type.replace(/-/g, ' ')}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted">{challenge.progress}/{challenge.total}</span>
                  <span className="text-[10px] font-bold" style={{ color: typeColor }}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: typeColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5 mb-3">
                {challenge.requirements.map((req, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 ${
                      req.met ? 'bg-green-500/20 text-green-400' : 'bg-background text-muted/40'
                    }`}>
                      {req.met ? '✓' : '○'}
                    </span>
                    <span className={`flex-1 ${req.met ? 'text-muted line-through' : 'text-foreground/70'}`}>
                      {req.description}
                    </span>
                    {!req.met && (challenge.type === 'set-completion' || challenge.type === 'thematic' || challenge.type === 'scarcity-chase') && (
                      <Link href="/packs" className="text-accent text-[10px] font-semibold flex-shrink-0">
                        Find →
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Reward preview */}
              <div className="p-2.5 rounded-xl bg-background/50 flex items-center gap-2">
                <span className="text-sm">🎁</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium">{challenge.reward.name}</span>
                  {challenge.reward.scarcity && (
                    <span
                      className="text-[9px] ml-1.5 px-1.5 py-0.5 rounded font-mono"
                      style={{ color: SCARCITY_CONFIG[challenge.reward.scarcity].color, background: `${SCARCITY_CONFIG[challenge.reward.scarcity].color}12` }}
                    >
                      {SCARCITY_CONFIG[challenge.reward.scarcity].label}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
