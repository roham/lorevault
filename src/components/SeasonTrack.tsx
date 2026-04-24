'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { SeasonReward } from '@/data/types';
import { getSeasonTier, getDailyMissions } from '@/lib/store';

// ---------------------------------------------------------------------------
// Season 1 — 30 tiers
// ---------------------------------------------------------------------------
const SEASON_REWARDS: SeasonReward[] = [
  { type: 'badge', name: 'Season Initiate', description: 'Began Season 1', icon: 'S' },
  { type: 'xp_boost', name: 'XP Surge', description: '+50 bonus XP', icon: '+' },
  { type: 'badge', name: 'Myth Seeker', description: 'Unlocked at Tier 3', icon: 'M' },
  { type: 'pack', name: 'Bonus Pack', description: 'One free pack', icon: 'P' },
  { type: 'showcase_theme', name: 'Midnight Aura', description: 'Showcase theme', icon: 'T' },
  { type: 'xp_boost', name: 'XP Burst', description: '+100 bonus XP', icon: '+' },
  { type: 'badge', name: 'Legend Hunter', description: 'Tier 7 badge', icon: 'L' },
  { type: 'card_frame', name: 'Bronze Frame', description: 'Card border style', icon: 'F' },
  { type: 'pack', name: 'Premium Pack', description: 'Guaranteed Rare+', icon: 'P' },
  { type: 'title', name: 'Myth Walker', description: 'Profile title', icon: 'W' },
  { type: 'xp_boost', name: 'XP Storm', description: '+150 bonus XP', icon: '+' },
  { type: 'badge', name: 'Lore Keeper', description: 'Tier 12 badge', icon: 'K' },
  { type: 'showcase_theme', name: 'Golden Dawn', description: 'Showcase theme', icon: 'T' },
  { type: 'card_frame', name: 'Silver Frame', description: 'Card border style', icon: 'F' },
  { type: 'pack', name: 'Epic Pack', description: 'Guaranteed Epic+', icon: 'P' },
  { type: 'title', name: 'Chronicle Master', description: 'Profile title', icon: 'C' },
  { type: 'xp_boost', name: 'XP Tsunami', description: '+200 bonus XP', icon: '+' },
  { type: 'badge', name: 'Sage', description: 'Tier 18 badge', icon: 'S' },
  { type: 'card_frame', name: 'Gold Frame', description: 'Card border style', icon: 'F' },
  { type: 'showcase_theme', name: 'Obsidian Night', description: 'Showcase theme', icon: 'T' },
  { type: 'pack', name: 'Legendary Pack', description: 'Guaranteed Legendary', icon: 'P' },
  { type: 'badge', name: 'Oracle', description: 'Tier 22 badge', icon: 'O' },
  { type: 'title', name: 'Fable Weaver', description: 'Profile title', icon: 'W' },
  { type: 'xp_boost', name: 'XP Cataclysm', description: '+300 bonus XP', icon: '+' },
  { type: 'card_frame', name: 'Holographic Frame', description: 'Card border style', icon: 'F' },
  { type: 'badge', name: 'Archivist', description: 'Tier 26 badge', icon: 'A' },
  { type: 'showcase_theme', name: 'Celestial Void', description: 'Showcase theme', icon: 'T' },
  { type: 'pack', name: 'Mythic Pack', description: 'Exclusive cards', icon: 'P' },
  { type: 'title', name: 'Age of Myths Champion', description: 'Season 1 title', icon: 'C' },
  { type: 'badge', name: 'Mythic Legend', description: 'Season 1 completion', icon: 'X' },
];

function getRewardTypeColor(type: SeasonReward['type']): string {
  switch (type) {
    case 'badge': return '#818cf8';
    case 'xp_boost': return '#22c55e';
    case 'showcase_theme': return '#a855f7';
    case 'card_frame': return '#f59e0b';
    case 'pack': return '#ec4899';
    case 'title': return '#06b6d4';
  }
}

// ---------------------------------------------------------------------------
// Compact Season Track Preview (for home page)
// ---------------------------------------------------------------------------
export function SeasonTrackPreview() {
  const [currentTier, setCurrentTier] = useState(0);

  useEffect(() => {
    setCurrentTier(getSeasonTier());
  }, []);

  const nextReward = SEASON_REWARDS[currentTier] || SEASON_REWARDS[SEASON_REWARDS.length - 1];
  const progress = currentTier / 30;

  return (
    <div className="p-4 rounded-xl bg-surface border border-border">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Season 1</span>
          <div className="text-sm font-bold text-foreground">Age of Myths</div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold font-mono text-accent">{currentTier}</span>
          <span className="text-xs text-muted">/30</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-border/30 overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent via-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Next reward */}
      <div className="flex items-center gap-2 mt-1">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
          style={{
            background: `${getRewardTypeColor(nextReward.type)}20`,
            color: getRewardTypeColor(nextReward.type),
          }}
        >
          {nextReward.icon}
        </div>
        <div>
          <span className="text-[10px] text-muted">Next: </span>
          <span className="text-xs font-semibold">{nextReward.name}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full Season Track (for profile page)
// ---------------------------------------------------------------------------
export default function SeasonTrack() {
  const [currentTier, setCurrentTier] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const missions = getDailyMissions();

  useEffect(() => {
    setCurrentTier(getSeasonTier());
  }, []);

  // Auto-scroll to current tier
  useEffect(() => {
    if (scrollRef.current && currentTier > 0) {
      const tierWidth = 80;
      scrollRef.current.scrollLeft = Math.max(0, currentTier * tierWidth - 120);
    }
  }, [currentTier]);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d0f1a 0%, #1a103a 40%, #12141f 100%)',
        border: '1px solid rgba(129,140,248,0.1)',
      }}
    >
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-accent/60">Season 1</span>
            <h2 className="text-lg font-bold">Age of Myths</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-accent">{currentTier}</div>
            <div className="text-[10px] text-muted">/ 30 tiers</div>
          </div>
        </div>
      </div>

      {/* Scrollable tier track */}
      <div ref={scrollRef} className="overflow-x-auto no-scrollbar pb-4 px-5">
        <div className="flex items-end gap-1" style={{ width: `${SEASON_REWARDS.length * 80}px` }}>
          {SEASON_REWARDS.map((reward, i) => {
            const unlocked = i < currentTier;
            const isCurrent = i === currentTier;
            const color = getRewardTypeColor(reward.type);

            return (
              <div key={i} className="flex flex-col items-center" style={{ width: 76 }}>
                {/* Reward node */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    unlocked
                      ? 'shadow-lg'
                      : isCurrent
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                      : 'opacity-30'
                  }`}
                  style={{
                    background: unlocked
                      ? `linear-gradient(135deg, ${color}40, ${color}20)`
                      : isCurrent
                      ? `linear-gradient(135deg, ${color}30, ${color}10)`
                      : 'rgba(31,34,55,0.3)',
                    border: `1px solid ${unlocked ? color + '40' : isCurrent ? color + '30' : 'rgba(31,34,55,0.2)'}`,
                    color: unlocked || isCurrent ? color : '#3a3d5c',
                  }}
                >
                  {reward.icon}
                  {unlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </motion.div>

                {/* Tier number */}
                <div className={`text-[9px] font-mono mt-1.5 ${
                  unlocked ? 'text-foreground/60' : isCurrent ? 'text-accent' : 'text-muted/30'
                }`}>
                  {i + 1}
                </div>

                {/* Reward name */}
                <div className={`text-[8px] text-center leading-tight mt-0.5 max-w-[70px] truncate ${
                  unlocked ? 'text-foreground/40' : isCurrent ? 'text-foreground/60' : 'text-transparent'
                }`}>
                  {reward.name}
                </div>

                {/* Connector line */}
                {i < SEASON_REWARDS.length - 1 && (
                  <div className="absolute" style={{
                    top: '50%',
                    left: '100%',
                    width: 4,
                    height: 2,
                    background: unlocked ? color + '40' : 'rgba(31,34,55,0.2)',
                    transform: 'translateY(-50%)',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily missions */}
      <div className="px-5 pb-5">
        <div className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2">Daily Missions</div>
        <div className="space-y-2">
          {missions.map((mission) => (
            <div key={mission.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/40 border border-border/30">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                mission.completed ? 'bg-green-500/20 text-green-400' : 'bg-accent/10 text-accent'
              }`}>
                {mission.completed ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>{mission.progress}/{mission.target}</span>
                )}
              </div>
              <div className="flex-1">
                <div className={`text-xs font-medium ${mission.completed ? 'text-muted line-through' : ''}`}>
                  {mission.description}
                </div>
                <div className="text-[10px] text-muted">{mission.reward}</div>
              </div>
              {!mission.completed && (
                <div className="w-12 h-1.5 rounded-full bg-border/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
