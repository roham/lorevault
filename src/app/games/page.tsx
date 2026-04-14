'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getGameStats, getXP } from '@/lib/store';
import { GameStats } from '@/data/types';

const DEFAULT_STATS: GameStats = {
  battlesPlayed: 0,
  battlesWon: 0,
  triviaPlayed: 0,
  triviaHighScore: 0,
  totalGameXP: 0,
  longestBattleStreak: 0,
  longestTriviaStreak: 0,
};

// Daily challenge — changes each day based on date
function getDailyChallenge(): { title: string; desc: string; game: 'battle' | 'trivia'; bonus: number } {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const challenges = [
    { title: 'Battle Royale', desc: 'Win a battle on Hard difficulty', game: 'battle' as const, bonus: 50 },
    { title: 'Trivia Sprint', desc: 'Score 2000+ in trivia', game: 'trivia' as const, bonus: 40 },
    { title: 'Streak Builder', desc: 'Win 3 battles in a row', game: 'battle' as const, bonus: 60 },
    { title: 'Perfect Round', desc: 'Get 5 trivia answers right in a row', game: 'trivia' as const, bonus: 45 },
    { title: 'Underdog Victory', desc: 'Win a battle with all Common cards', game: 'battle' as const, bonus: 70 },
    { title: 'Speed Demon', desc: 'Answer 8+ trivia questions correctly', game: 'trivia' as const, bonus: 55 },
    { title: 'Domination', desc: 'Win a battle 3-0', game: 'battle' as const, bonus: 50 },
  ];
  return challenges[dayOfYear % challenges.length];
}

export default function GamesHub() {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setStats(getGameStats());
    setXp(getXP());
  }, []);

  const daily = getDailyChallenge();
  const winRate = stats.battlesPlayed > 0 ? Math.round((stats.battlesWon / stats.battlesPlayed) * 100) : 0;

  return (
    <div className="min-h-screen px-4 pt-8 pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="type-heading">Games</h1>
            <p className="text-xs text-muted">Battle, quiz, and earn XP</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
              <span className="text-sm">⭐</span>
              <span className="text-sm font-bold text-accent">{xp}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link href={daily.game === 'battle' ? '/games/battle' : '/games/trivia'}>
          <div className="relative overflow-hidden rounded-2xl p-5 mb-6 border border-yellow-500/20"
            style={{
              background: 'linear-gradient(135deg, #2d1b00 0%, #1a1400 50%, #12141f 100%)',
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <div className="w-full h-full rounded-full bg-yellow-500 blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-bold uppercase">
                  Daily Challenge
                </span>
                <span className="text-xs text-yellow-400/60 font-mono">+{daily.bonus} XP</span>
              </div>
              <h3 className="text-lg font-bold text-yellow-400 mb-1">{daily.title}</h3>
              <p className="text-sm text-muted">{daily.desc}</p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Game Modes */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Game Modes</h2>
      <div className="space-y-3 mb-8">
        {/* Baseball — Featured */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Link href="/games/baseball">
            <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-all group">
              <div
                className="p-5"
                style={{
                  background: 'linear-gradient(135deg, #0a1a2e 0%, #12141f 100%)',
                }}
              >
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase">
                    New
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl flex-shrink-0"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                  >
                    &#9918;
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-0.5">Public Domain Baseball</h3>
                    <p className="text-xs text-muted mb-2">
                      d20 dice baseball with literary legends. Build your lineup and play ball.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-blue-400/60">99 characters</span>
                      <span className="text-[10px] text-blue-400/60">MLB Showdown-inspired</span>
                    </div>
                  </div>
                  <div className="text-muted text-xl group-hover:text-blue-400 transition-colors">&rarr;</div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Battle */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link href="/games/battle">
            <div className="relative overflow-hidden rounded-2xl border border-border hover:border-red-500/30 transition-all group">
              <div
                className="p-5"
                style={{
                  background: 'linear-gradient(135deg, #1a0a0a 0%, #12141f 100%)',
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl flex-shrink-0"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                  >
                    ⚔️
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-0.5">Card Battle</h3>
                    <p className="text-xs text-muted mb-2">
                      Pick stats, beat the AI. Best of 5 rounds.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted">
                        <span className="text-green-400 font-bold">{stats.battlesWon}</span>W / <span className="text-red-400 font-bold">{stats.battlesPlayed - stats.battlesWon}</span>L
                      </span>
                      {stats.battlesPlayed > 0 && (
                        <span className="text-[10px] text-muted">
                          {winRate}% win rate
                        </span>
                      )}
                      {stats.longestBattleStreak > 0 && (
                        <span className="text-[10px] text-orange-400">
                          🔥 {stats.longestBattleStreak} best streak
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-muted text-xl group-hover:text-red-400 transition-colors">&rarr;</div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Trivia */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/games/trivia">
            <div className="relative overflow-hidden rounded-2xl border border-border hover:border-purple-500/30 transition-all group">
              <div
                className="p-5"
                style={{
                  background: 'linear-gradient(135deg, #0a0a1a 0%, #12141f 100%)',
                }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl flex-shrink-0"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                  >
                    🧠
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-0.5">Lore Trivia</h3>
                    <p className="text-xs text-muted mb-2">
                      10 questions. Build streaks. Beat the clock.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted">
                        <span className="text-accent font-bold">{stats.triviaPlayed}</span> games played
                      </span>
                      {stats.triviaHighScore > 0 && (
                        <span className="text-[10px] text-yellow-400">
                          ⭐ {stats.triviaHighScore.toLocaleString()} high score
                        </span>
                      )}
                      {stats.longestTriviaStreak > 0 && (
                        <span className="text-[10px] text-orange-400">
                          🔥 {stats.longestTriviaStreak} best streak
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-muted text-xl group-hover:text-purple-400 transition-colors">&rarr;</div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Records */}
      {(stats.battlesPlayed > 0 || stats.triviaPlayed > 0) && (
        <>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Your Records</h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            <motion.div
              className="p-4 rounded-xl bg-surface border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="text-2xl font-bold text-green-400">{stats.battlesWon}</div>
              <div className="text-[10px] text-muted">Battle Wins</div>
            </motion.div>
            <motion.div
              className="p-4 rounded-xl bg-surface border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-2xl font-bold text-yellow-400">{stats.triviaHighScore.toLocaleString()}</div>
              <div className="text-[10px] text-muted">Trivia High Score</div>
            </motion.div>
            <motion.div
              className="p-4 rounded-xl bg-surface border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="text-2xl font-bold text-accent">{stats.totalGameXP}</div>
              <div className="text-[10px] text-muted">Total Game XP</div>
            </motion.div>
            <motion.div
              className="p-4 rounded-xl bg-surface border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-2xl font-bold text-orange-400">
                {Math.max(stats.longestBattleStreak, stats.longestTriviaStreak)}
              </div>
              <div className="text-[10px] text-muted">Longest Streak</div>
            </motion.div>
          </div>
        </>
      )}

      {/* Link back home */}
      <div className="text-center">
        <Link href="/" className="text-xs text-accent hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
