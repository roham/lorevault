'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CHALLENGES } from '@/data/challenges';
import { SCARCITY_CONFIG } from '@/data/types';

const TYPE_ICONS: Record<string, string> = {
  'set-completion': '📚',
  'scarcity-chase': '💎',
  'thematic': '🎭',
  'daily': '📅',
  'weekly': '📆',
  'seasonal': '🌟',
};

const TYPE_COLORS: Record<string, string> = {
  'set-completion': '#3b82f6',
  'scarcity-chase': '#a855f7',
  'thematic': '#f59e0b',
  'daily': '#22c55e',
  'weekly': '#06b6d4',
  'seasonal': '#ec4899',
};

export default function ChallengesPage() {
  const activeChallenges = CHALLENGES.filter(c => c.active);
  const totalProgress = activeChallenges.reduce((sum, c) => sum + c.progress, 0);
  const totalRequired = activeChallenges.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Challenges</h1>
        <p className="text-sm text-muted">{activeChallenges.length} active challenges</p>

        {/* Streak Tracker */}
        <div className="mt-4 p-4 rounded-xl bg-surface border border-border mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold">Daily Streak</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-orange-400">7 days</span>
              <span className="text-xs text-muted ml-1">Best: 14</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex-1 text-center">
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold mb-1 ${
                    i < 5
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : i === 5
                        ? 'bg-accent/20 text-accent border border-accent/30 animate-pulse'
                        : 'bg-background text-muted/40 border border-border/50'
                  }`}
                >
                  {i < 5 ? '✓' : i === 5 ? '!' : '○'}
                </div>
                <span className="text-[9px] text-muted">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted">
            Complete any challenge today to keep your streak! <span className="text-orange-400 font-medium">+2x XP at 7 days</span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="p-4 rounded-xl bg-surface border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-accent font-bold">
              {Math.round((totalProgress / totalRequired) * 100)}%
            </span>
          </div>
          <div className="relative h-3 rounded-full bg-background overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(totalProgress / totalRequired) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="space-y-4">
        {activeChallenges.map((challenge, i) => {
          const pct = Math.round((challenge.progress / challenge.total) * 100);
          const typeColor = TYPE_COLORS[challenge.type] || '#818cf8';

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="p-5 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Type icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${typeColor}15`, border: `1px solid ${typeColor}30` }}
                >
                  {TYPE_ICONS[challenge.type] || '🏆'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{challenge.name}</h3>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                      style={{ color: typeColor, background: `${typeColor}15` }}
                    >
                      {challenge.type.replace(/-/g, ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-muted mb-3">{challenge.description}</p>

                  {/* Requirements checklist */}
                  <div className="space-y-1.5 mb-3">
                    {challenge.requirements.map((req, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                          req.met
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-background text-muted'
                        }`}>
                          {req.met ? '✓' : '○'}
                        </span>
                        <span className={`flex-1 ${req.met ? 'text-foreground line-through opacity-60' : 'text-muted'}`}>
                          {req.description}
                        </span>
                        {!req.met && (challenge.type === 'set-completion' || challenge.type === 'thematic' || challenge.type === 'scarcity-chase') && (
                          <Link
                            href="/marketplace"
                            className="text-accent hover:underline flex-shrink-0 font-medium"
                          >
                            Find on Marketplace →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 rounded-full bg-background overflow-hidden mb-2">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: typeColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">
                      {challenge.progress}/{challenge.total}
                      {challenge.expiresAt && (
                        <span className="ml-2 text-muted/60">
                          Expires {new Date(challenge.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-medium" style={{ color: typeColor }}>
                      {pct}%
                    </span>
                  </div>

                  {/* Reward preview */}
                  <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">Reward:</span>
                      <span className="text-xs font-medium text-foreground">{challenge.reward.name}</span>
                      {challenge.reward.scarcity && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                          style={{
                            color: SCARCITY_CONFIG[challenge.reward.scarcity].color,
                            background: `${SCARCITY_CONFIG[challenge.reward.scarcity].color}15`,
                          }}
                        >
                          {SCARCITY_CONFIG[challenge.reward.scarcity].label}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted mt-1">{challenge.reward.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
