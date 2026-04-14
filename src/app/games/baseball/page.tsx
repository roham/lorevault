'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getGameHistory, getWinLossRecord, getTopCharacters, type CharacterXP } from '@/lib/baseball/records';

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
  const [record, setRecord] = useState({ wins: 0, losses: 0 });
  const [recentGames, setRecentGames] = useState<ReturnType<typeof getGameHistory>>([]);
  const [topChars, setTopChars] = useState<CharacterXP[]>([]);

  useEffect(() => {
    setLineups(getSavedLineups());
    setRecord(getWinLossRecord());
    setRecentGames(getGameHistory().slice(0, 5));
    setTopChars(getTopCharacters(3));
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
        <div className="flex items-center gap-3 mb-8">
          <p className="text-xs text-muted">MLB Showdown-inspired d20 baseball with literary legends</p>
          {(record.wins > 0 || record.losses > 0) && (
            <span className="text-[10px] font-bold text-muted/60 bg-surface px-2 py-0.5 rounded-full border border-border/30">
              {record.wins}W-{record.losses}L
            </span>
          )}
        </div>
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

        {/* Play Game */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link href="/games/baseball/play">
            <div className="relative overflow-hidden rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all group">
              <div className="p-5" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #12141f 100%)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                    &#127922;
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-0.5">Play Ball</h3>
                    <p className="text-xs text-muted">
                      3-inning quick match. Choose difficulty: Rookie, Veteran, or Legend.
                    </p>
                  </div>
                  <div className="text-muted text-xl group-hover:text-red-400 transition-colors">&rarr;</div>
                </div>
              </div>
            </div>
          </Link>
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

      {/* Recent Games */}
      {recentGames.length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Recent Games
          </h2>
          <div className="space-y-2">
            {recentGames.map((game, i) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className={`p-3 rounded-xl bg-surface border ${
                  game.result === 'win' ? 'border-green-500/15' : 'border-red-500/15'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      game.result === 'win' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {game.result === 'win' ? 'W' : 'L'}
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {game.finalScore.away}—{game.finalScore.home}
                    </span>
                    <span className="text-[10px] text-muted/40">vs {game.aiTeamName}</span>
                  </div>
                  <div className="text-right">
                    {game.mvp.character && (
                      <span className="text-[10px] text-amber-400/50">MVP: {game.mvp.character}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Top Characters */}
      {topChars.length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Top Characters
          </h2>
          <div className="space-y-2">
            {topChars.map((char, i) => (
              <motion.div
                key={char.cardId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="p-3 rounded-xl bg-surface border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-400 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-sm font-bold">{char.character}</span>
                      <div className="flex items-center gap-2 text-[10px] text-muted">
                        <span>{char.gamesPlayed}G</span>
                        <span>{char.totalHits}H</span>
                        <span>{char.homeRuns}HR</span>
                        <span>{char.totalRBIs}RBI</span>
                        {char.mvpAwards > 0 && (
                          <span className="text-amber-400">{char.mvpAwards} MVP</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-accent tabular-nums">{char.totalXP} XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* How to Play Guide */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">How to Play</h2>
        <div className="space-y-2">
          {[
            { step: '1', label: 'Draft', text: 'Pick 9 hitters + 1 pitcher under the 150-point salary cap. Higher OB (on-base) and speed cost more.' },
            { step: '2', label: 'Control Roll', text: 'Each at-bat starts with a d20 roll. Roll above the pitcher\'s Control number → hitter controls. Below → pitcher controls.' },
            { step: '3', label: 'Outcome Roll', text: 'Roll again on the controlling player\'s hit chart. Charts map d20 ranges to outcomes — singles, doubles, home runs, outs, strikeouts.' },
            { step: '4', label: 'Runners', text: 'Runners advance on hits. Fast runners (speed A/B) can attempt steals. Doubles and triples clear the bases.' },
            { step: '5', label: 'Steal', text: 'With a runner on base, attempt a steal — d20 vs catcher\'s arm. Fast runners succeed more often. Get thrown out and it\'s an extra out.' },
            { step: '6', label: 'Win', text: 'Play 3 innings (quick game). Score more runs than the AI. Each character earns XP — MVPs earn bonus XP.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3 p-3 rounded-xl bg-surface/50 border border-border/50">
              <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0">
                {item.step}
              </span>
              <div>
                <span className="text-xs font-bold text-foreground">{item.label}</span>
                <p className="text-xs text-muted leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Difficulty tiers */}
        <div className="mt-4 p-4 rounded-xl bg-surface/50 border border-border/50">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Difficulty Tiers</h3>
          <div className="space-y-1.5">
            {[
              { tier: 'Rookie', color: 'text-green-400', desc: 'Random batting order, rare steals, no taunts' },
              { tier: 'Veteran', color: 'text-amber-400', desc: 'Situational steals, optimized lineup, dry trash talk' },
              { tier: 'Legend', color: 'text-red-400', desc: 'Aggressive steals, optimal defense, sharp taunts' },
            ].map((d) => (
              <div key={d.tier} className="flex items-start gap-2">
                <span className={`text-[10px] font-black ${d.color} w-14 flex-shrink-0`}>{d.tier}</span>
                <span className="text-[10px] text-muted">{d.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
