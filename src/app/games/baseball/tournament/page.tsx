'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Difficulty } from '@/lib/baseball/ai';

// ===== Tournament Types =====

interface TournamentTeam {
  name: string;
  difficulty: Difficulty;
  seed: number;
  tagline: string;
}

interface TournamentMatch {
  id: string;
  round: 'semi' | 'final';
  team: TournamentTeam;
  result: 'win' | 'loss' | null;
  score: { away: number; home: number } | null;
}

interface TournamentState {
  id: string;
  bracket: TournamentMatch[];
  currentMatchIndex: number;
  completed: boolean;
  startedAt: number;
}

// ===== Constants =====

const TOURNAMENT_KEY = 'pdb-tournament';

const BRACKET_TEAMS: TournamentTeam[][] = [
  // Bracket 1: Mythological Gauntlet
  [
    { name: 'Fairy Tale Misfits', difficulty: 'rookie', seed: 4, tagline: 'A warm-up for what\'s ahead' },
    { name: 'Enchanted Nine', difficulty: 'veteran', seed: 3, tagline: 'They play with magic on their side' },
    { name: 'The Olympians', difficulty: 'legend', seed: 2, tagline: 'Gods don\'t go quietly' },
  ],
  // Bracket 2: Literary Ladder
  [
    { name: 'Minor Monsters', difficulty: 'rookie', seed: 4, tagline: 'Bumbling but eager' },
    { name: 'Baker Street Nine', difficulty: 'veteran', seed: 3, tagline: 'They\'ve deduced your lineup' },
    { name: 'Asgard\'s Chosen', difficulty: 'legend', seed: 2, tagline: 'Ragnarok comes for your lineup' },
  ],
  // Bracket 3: Horror Gauntlet
  [
    { name: 'Wonderland Wanderers', difficulty: 'rookie', seed: 4, tagline: 'Through the looking glass' },
    { name: 'Gothic Horrors', difficulty: 'veteran', seed: 3, tagline: 'They play in the shadows' },
    { name: 'The Mythic All-Stars', difficulty: 'legend', seed: 2, tagline: 'The best of every world' },
  ],
];

// ===== Helpers =====

function getTournamentState(): TournamentState | null {
  try {
    return JSON.parse(localStorage.getItem(TOURNAMENT_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveTournamentState(state: TournamentState) {
  localStorage.setItem(TOURNAMENT_KEY, JSON.stringify(state));
}

function generateTournament(): TournamentState {
  const bracketIndex = Math.floor(Math.random() * BRACKET_TEAMS.length);
  const teams = BRACKET_TEAMS[bracketIndex];

  const bracket: TournamentMatch[] = [
    { id: 'semi-1', round: 'semi', team: teams[0], result: null, score: null },
    { id: 'semi-2', round: 'semi', team: teams[1], result: null, score: null },
    { id: 'final', round: 'final', team: teams[2], result: null, score: null },
  ];

  return {
    id: `tourney-${Date.now()}`,
    bracket,
    currentMatchIndex: 0,
    completed: false,
    startedAt: Date.now(),
  };
}

// ===== Component =====

export default function TournamentPage() {
  const [tournament, setTournament] = useState<TournamentState | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTournament(getTournamentState());
    setLoaded(true);
  }, []);

  const startNewTournament = () => {
    const t = generateTournament();
    saveTournamentState(t);
    setTournament(t);
  };

  // Simulate recording a result (in real flow, play page would call back)
  // For now, this UI shows the bracket and links to play
  const recordResult = (matchIndex: number, result: 'win' | 'loss', score: { away: number; home: number }) => {
    if (!tournament) return;
    const updated = { ...tournament };
    updated.bracket = [...updated.bracket];
    updated.bracket[matchIndex] = {
      ...updated.bracket[matchIndex],
      result,
      score,
    };

    if (result === 'loss') {
      updated.completed = true;
    } else if (matchIndex < updated.bracket.length - 1) {
      updated.currentMatchIndex = matchIndex + 1;
    } else {
      updated.completed = true;
    }

    saveTournamentState(updated);
    setTournament(updated);
  };

  if (!loaded) {
    return <div className="min-h-screen flex items-center justify-center text-muted text-sm">Loading...</div>;
  }

  const ROUND_LABELS: Record<string, string> = { 'semi': 'Semifinal', 'final': 'Championship' };
  const DIFF_COLORS: Record<string, string> = {
    rookie: 'text-green-400',
    veteran: 'text-amber-400',
    legend: 'text-red-400',
  };
  const DIFF_BG: Record<string, string> = {
    rookie: 'bg-green-500/10 border-green-500/20',
    veteran: 'bg-amber-500/10 border-amber-500/20',
    legend: 'bg-red-500/10 border-red-500/20',
  };

  // No active tournament — show start screen
  if (!tournament || tournament.completed) {
    const lastTourney = tournament;
    const won = lastTourney?.bracket.every(m => m.result === 'win');

    return (
      <div className="min-h-screen px-4 pt-8 pb-24">
        <div className="flex items-center mb-2">
          <Link href="/games/baseball" className="text-xs text-muted hover:text-accent transition-colors">
            &larr; Baseball
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-12 mb-8">
          <h1 className="text-2xl font-black mb-2">Tournament</h1>
          <p className="text-xs text-muted/50">3-game gauntlet. Rookie → Veteran → Legend. One loss and you're out.</p>
        </motion.div>

        {/* Last result */}
        {lastTourney && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-4 rounded-2xl border mb-6 ${won ? 'border-amber-500/30 bg-amber-500/5' : 'border-red-500/20 bg-red-500/5'}`}
          >
            <p className={`text-sm font-black ${won ? 'text-amber-400' : 'text-red-400'}`}>
              {won ? 'CHAMPION!' : 'Eliminated'}
            </p>
            <div className="mt-2 space-y-1">
              {lastTourney.bracket.map((match) => (
                <div key={match.id} className="flex items-center gap-2 text-[10px]">
                  <span className={match.result === 'win' ? 'text-green-400 font-bold' : match.result === 'loss' ? 'text-red-400 font-bold' : 'text-muted/30'}>
                    {match.result === 'win' ? 'W' : match.result === 'loss' ? 'L' : '-'}
                  </span>
                  <span className="text-muted/50">{ROUND_LABELS[match.round]}</span>
                  <span className="text-muted/30">vs</span>
                  <span className="text-muted/70">{match.team.name}</span>
                  {match.score && (
                    <span className="text-muted/30 tabular-nums">{match.score.away}-{match.score.home}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bracket preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">The Gauntlet</h2>
          <div className="space-y-2">
            {['Semifinal 1: Rookie opponent', 'Semifinal 2: Veteran opponent', 'Championship: Legend opponent'].map((label, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-border/50">
                <span className={`w-6 h-6 rounded-full ${i === 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : i === 1 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} border flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                  {i + 1}
                </span>
                <p className="text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={startNewTournament}
          className="w-full py-4 rounded-2xl bg-accent text-bg text-sm font-bold hover:bg-accent/90 transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          Enter Tournament
        </motion.button>
      </div>
    );
  }

  // Active tournament — show bracket progress
  const currentMatch = tournament.bracket[tournament.currentMatchIndex];

  return (
    <div className="min-h-screen px-4 pt-8 pb-24">
      <div className="flex items-center mb-2">
        <Link href="/games/baseball" className="text-xs text-muted hover:text-accent transition-colors">
          &larr; Baseball
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-black mb-1">Tournament</h1>
        <p className="text-xs text-muted/50 mb-6">
          Game {tournament.currentMatchIndex + 1} of {tournament.bracket.length}
        </p>
      </motion.div>

      {/* Bracket visual */}
      <div className="space-y-2 mb-8">
        {tournament.bracket.map((match, i) => {
          const isCurrent = i === tournament.currentMatchIndex;
          const isPast = match.result !== null;
          const isFuture = !isPast && !isCurrent;

          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent ? `${DIFF_BG[match.team.difficulty]} border` :
                isPast ? (match.result === 'win' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5') :
                'border-border/20 bg-surface/30 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted/40 uppercase">{ROUND_LABELS[match.round]}</span>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${DIFF_COLORS[match.team.difficulty]}`}>
                    {match.team.difficulty}
                  </span>
                </div>
                {isPast && (
                  <span className={`text-xs font-black ${match.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                    {match.result === 'win' ? 'W' : 'L'} {match.score && `${match.score.away}-${match.score.home}`}
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-bold uppercase animate-pulse">
                    Next
                  </span>
                )}
              </div>
              <p className="text-sm font-bold">{match.team.name}</p>
              <p className="text-[10px] text-muted/40">{match.team.tagline}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Play current match */}
      {currentMatch && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link
            href={`/games/baseball/play?tournament=${tournament.id}&match=${tournament.currentMatchIndex}&difficulty=${currentMatch.team.difficulty}`}
            className="block w-full py-4 rounded-2xl bg-accent text-bg text-sm font-bold hover:bg-accent/90 transition-colors text-center"
          >
            Play {ROUND_LABELS[currentMatch.round]}: {currentMatch.team.name}
          </Link>
          <p className="text-[10px] text-muted/30 text-center mt-2">
            {currentMatch.team.difficulty === 'legend' ? 'The championship. Everything you\'ve built leads here.' :
             currentMatch.team.difficulty === 'veteran' ? 'The competition stiffens. Stay sharp.' :
             'Win to advance to the next round.'}
          </p>
        </motion.div>
      )}

      {/* Abandon tournament */}
      <div className="text-center mt-8">
        <button
          onClick={() => {
            const confirmed = window.confirm('Abandon this tournament? Progress will be lost.');
            if (confirmed) {
              localStorage.removeItem(TOURNAMENT_KEY);
              setTournament(null);
            }
          }}
          className="text-xs text-muted/20 hover:text-red-400 transition-colors"
        >
          Abandon Tournament
        </button>
      </div>
    </div>
  );
}
