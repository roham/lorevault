'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { generatePhantomCollectors, getCollectorRank, RANK_CONFIG, type PhantomCollector, type CollectorRank } from '@/data/leaderboard-seeds';
import { getOwnedCards, getStreak, getEarnedAchievements, getCollectorLevel, getCodexCompletionPercent, getPrestigeState } from '@/lib/store';
import { ACHIEVEMENTS, getAchievementRarityColor, getAchievementById } from '@/lib/achievements';
import { PROFILE } from '@/data/profile';

type LeaderboardTab = 'cards' | 'rare' | 'age' | 'badges' | 'codex' | 'prestige';

interface LeaderboardEntry {
  id: string;
  username: string;
  value: number;
  rank: CollectorRank;
  isPlayer: boolean;
  lastActive: number;
  pinnedBadges: string[];
}

const TAB_CONFIG: { id: LeaderboardTab; label: string; icon: string; unit: string }[] = [
  { id: 'cards', label: 'Total Cards', icon: '📦', unit: 'cards' },
  { id: 'rare', label: 'Rarest Collection', icon: '💎', unit: 'rare+' },
  { id: 'age', label: 'Oldest Card', icon: '⏳', unit: 'days' },
  { id: 'badges', label: 'Achievements', icon: '🏆', unit: 'badges' },
  { id: 'codex', label: 'Lore Codex', icon: '📖', unit: '%' },
  { id: 'prestige', label: 'Prestige', icon: '👑', unit: 'level' },
];

export default function HallPage() {
  const [tab, setTab] = useState<LeaderboardTab>('cards');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerRank, setPlayerRank] = useState<CollectorRank>('bronze');
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    const owned = getOwnedCards();
    const earned = getEarnedAchievements();
    const streak = getStreak();
    setStreakDays(streak);

    const rareCount = owned.filter(c => c.scarcity === 'epic' || c.scarcity === 'legendary').length;
    const oldestDays = 14; // simulated
    const pRank = getCollectorRank(owned.length, rareCount, earned.length);
    setPlayerRank(pRank);

    const codexPct = getCodexCompletionPercent();
    const prestige = getPrestigeState();
    const phantoms = generatePhantomCollectors();
    const playerEntry: LeaderboardEntry = {
      id: 'player',
      username: PROFILE.username,
      value: 0,
      rank: pRank,
      isPlayer: true,
      lastActive: 0,
      pinnedBadges: [],
    };

    // Build entries based on active tab
    const buildEntries = (t: LeaderboardTab): LeaderboardEntry[] => {
      const pEntries = phantoms.map(p => ({
        id: p.id,
        username: p.username,
        value: t === 'cards' ? p.totalCards : t === 'rare' ? p.rareCards : t === 'age' ? p.oldestCardDays : t === 'codex' ? p.codexPercent : t === 'prestige' ? (p.achievementCount > 25 ? Math.floor(p.achievementCount / 5) : 0) : p.achievementCount,
        rank: p.rank,
        isPlayer: false,
        lastActive: p.lastActive,
        pinnedBadges: p.pinnedBadges,
      }));

      const pVal = t === 'cards' ? owned.length : t === 'rare' ? rareCount : t === 'age' ? oldestDays : t === 'codex' ? codexPct : t === 'prestige' ? (prestige.unlocked ? prestige.level : 0) : earned.length;
      const all = [...pEntries, { ...playerEntry, value: pVal }];
      all.sort((a, b) => b.value - a.value);
      return all;
    };

    setEntries(buildEntries(tab));
  }, [tab]);

  const rankConfig = RANK_CONFIG[playerRank];
  const playerPosition = entries.findIndex(e => e.isPlayer) + 1;
  const isDimmed = streakDays === 0; // rank decay visual

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="type-heading">Hall of Valhalla</h1>
          <p className="text-xs text-muted">Compete with the greatest collectors</p>
        </div>
        <Link href="/profile" className="text-xs text-muted hover:text-foreground">
          ← Profile
        </Link>
      </div>

      {/* Player rank card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl mb-6"
        style={{
          background: `linear-gradient(135deg, ${rankConfig.color}08, ${rankConfig.color}15)`,
          border: `1px solid ${rankConfig.color}25`,
          opacity: isDimmed ? 0.6 : 1,
          filter: isDimmed ? 'grayscale(0.5)' : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${rankConfig.color}15`, border: `1.5px solid ${rankConfig.color}30` }}
          >
            {rankConfig.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: rankConfig.color }}>{rankConfig.label}</span>
              {isDimmed && (
                <span className="text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Rank Fading</span>
              )}
            </div>
            <div className="text-xs text-muted">
              {playerPosition > 0 ? `#${playerPosition} of ${entries.length}` : 'Ranking...'}
              {' '}on {TAB_CONFIG.find(t => t.id === tab)?.label}
            </div>
          </div>
        </div>
        {isDimmed && (
          <div className="mt-2 text-[10px] text-amber-400/80">
            Open a pack to restore your rank visibility
          </div>
        )}
      </motion.div>

      {/* Tab switcher */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
        {TAB_CONFIG.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              tab === t.id
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'bg-surface/40 text-muted border border-border/30 hover:text-foreground'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="rounded-xl bg-surface border border-border overflow-hidden divide-y divide-border/30">
        {entries.slice(0, 20).map((entry, idx) => {
          const rCfg = RANK_CONFIG[entry.rank];
          const isInactive = entry.lastActive >= 7;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`flex items-center gap-3 px-3 py-2.5 ${entry.isPlayer ? 'bg-accent/5' : ''}`}
              style={{ opacity: isInactive ? 0.5 : 1, filter: isInactive ? 'grayscale(0.4)' : 'none' }}
            >
              {/* Position */}
              <span className={`w-6 text-center font-mono font-bold text-sm ${
                idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-muted'
              }`}>
                {idx + 1}
              </span>

              {/* Rank badge */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                style={{ background: `${rCfg.color}15`, border: `1px solid ${rCfg.color}25` }}
              >
                {rCfg.icon}
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {tab === 'prestige' && entry.value > 0 && <span className="text-[10px]">👑</span>}
                  <span className={`text-xs font-semibold truncate ${entry.isPlayer ? 'text-accent' : 'text-foreground'}`}>
                    {entry.username}
                  </span>
                  {entry.isPlayer && (
                    <span className="text-[8px] bg-accent/20 text-accent px-1 py-0.5 rounded font-bold">YOU</span>
                  )}
                </div>
                {entry.pinnedBadges.length > 0 && (
                  <div className="flex gap-1 mt-0.5">
                    {entry.pinnedBadges.slice(0, 3).map(bid => {
                      const a = getAchievementById(bid);
                      if (!a) return null;
                      return (
                        <span key={bid} className="text-[7px] px-1 py-0.5 rounded" style={{
                          color: getAchievementRarityColor(a.rarity),
                          background: `${getAchievementRarityColor(a.rarity)}10`,
                        }}>
                          {a.icon} {a.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="text-right">
                <div className="text-sm font-bold font-mono">{entry.value.toLocaleString()}</div>
                <div className="text-[8px] text-muted">{TAB_CONFIG.find(t => t.id === tab)?.unit}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show player position if outside top 20 */}
      {playerPosition > 20 && (
        <div className="mt-3 p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
          <span className="text-xs text-muted">Your position: </span>
          <span className="text-sm font-bold text-accent">#{playerPosition}</span>
        </div>
      )}
    </div>
  );
}
