'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BaseballCard, HitterStats, PitcherStats } from '@/lib/baseball/types';
import { BASEBALL_CARDS } from '@/data/baseball-stats';
import {
  DraftState,
  DraftTurn,
  startDraft,
  playerPick,
  aiPick,
  getDraftOrder,
  buildRosterFromDraft,
} from '@/lib/baseball/draft';
import type { Difficulty } from '@/lib/baseball/ai';

// ===== Draft Card Component =====

function DraftCard({
  card,
  disabled,
  taken,
  takenBy,
  isPitcherPick,
  onPick,
  animating,
}: {
  card: BaseballCard;
  disabled: boolean;
  taken: boolean;
  takenBy?: DraftTurn;
  isPitcherPick: boolean;
  onPick: (id: string) => void;
  animating?: boolean;
}) {
  const isPitcher = card.stats.type === 'pitcher';
  const stats = card.stats;

  // Only show hitters during hitter picks, pitchers during pitcher pick
  if (isPitcherPick && !isPitcher) return null;
  if (!isPitcherPick && isPitcher) return null;

  return (
    <motion.button
      className={`relative text-left p-3 rounded-xl border transition-all ${
        taken
          ? 'opacity-30 pointer-events-none border-border/10 bg-surface/20'
          : animating
            ? 'border-red-500/40 bg-red-500/5 scale-105'
            : disabled
              ? 'opacity-50 pointer-events-none border-border/20 bg-surface/30'
              : 'border-border/30 bg-surface hover:border-accent/40 hover:bg-surface-hover cursor-pointer active:scale-[0.97]'
      }`}
      onClick={() => !disabled && !taken && onPick(card.id)}
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Taken overlay */}
      {taken && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
            takenBy === 'player' ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-400'
          }`}>
            {takenBy === 'player' ? 'YOURS' : 'AI'}
          </span>
        </div>
      )}

      {/* Pitcher badge */}
      {isPitcher && (
        <span className="absolute top-1.5 right-1.5 text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
          P
        </span>
      )}

      <h4 className="text-[11px] font-bold truncate pr-6">{card.character}</h4>

      <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-muted">
        {isPitcher ? (
          <>
            <span>CTL <span className="text-white font-bold">{(stats as PitcherStats).control}</span></span>
            <span>FLD <span className="text-white font-bold">{(stats as PitcherStats).fielding}</span></span>
          </>
        ) : (
          <>
            <span>OB <span className="text-white font-bold">{(stats as HitterStats).onBase}</span></span>
            <span>PWR <span className="text-white font-bold">{(stats as HitterStats).power}</span></span>
            <span>SPD <span className="text-white font-bold">{(stats as HitterStats).speed}</span></span>
            <span>DEF <span className="text-white font-bold">{(stats as HitterStats).defense}</span></span>
          </>
        )}
      </div>

      <div className="mt-1 text-[9px] text-muted/50">
        Cost: <span className="text-white font-bold">{stats.pointCost}</span>
      </div>
    </motion.button>
  );
}

// ===== Draft Progress Bar =====

function DraftProgressBar({
  pickNumber,
  pickHistory,
}: {
  pickNumber: number;
  pickHistory: { team: DraftTurn }[];
}) {
  const order = getDraftOrder();

  return (
    <div className="flex items-center gap-0.5 px-1">
      {order.map((team, i) => {
        const pick = pickHistory[i];
        const isCurrent = i + 1 === pickNumber;
        const isPast = i + 1 < pickNumber;
        return (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-all ${
              isPast && pick
                ? pick.team === 'player'
                  ? 'bg-accent'
                  : 'bg-red-500'
                : isCurrent
                  ? team === 'player'
                    ? 'bg-accent/50 animate-pulse'
                    : 'bg-red-500/50 animate-pulse'
                  : team === 'player'
                    ? 'bg-accent/10'
                    : 'bg-red-500/10'
            }`}
            title={`Pick ${i + 1}: ${team}`}
          />
        );
      })}
    </div>
  );
}

// ===== Roster Preview =====

function RosterPreview({
  picks,
  label,
  accentColor,
  maxCost,
  currentCost,
}: {
  picks: string[];
  label: string;
  accentColor: string;
  maxCost: number;
  currentCost: number;
}) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[9px] font-bold uppercase tracking-wider ${accentColor}`}>
          {label}
        </span>
        <span className="text-[9px] text-muted/40 tabular-nums">
          {currentCost}/{maxCost}
        </span>
      </div>
      <div className="space-y-1">
        {Array.from({ length: 10 }, (_, i) => {
          const cardId = picks[i];
          const card = cardId ? BASEBALL_CARDS.find(c => c.id === cardId) : null;
          const isLast = i === 9;
          return (
            <motion.div
              key={i}
              className={`px-2 py-1 rounded-lg border text-[9px] ${
                card
                  ? `bg-surface border-border/30`
                  : `border-dashed border-border/15 ${isLast ? 'bg-purple-500/5' : 'bg-surface/20'}`
              }`}
              initial={card ? { opacity: 0, scale: 0.9 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {card ? (
                <div className="flex items-center justify-between">
                  <span className="font-bold truncate flex-1">{card.character}</span>
                  <span className="text-muted/40 ml-1 tabular-nums">{card.stats.pointCost}</span>
                </div>
              ) : (
                <span className="text-muted/20">{isLast ? 'Pitcher' : `Pick ${i + 1}`}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ===== Sort Options =====

type SortKey = 'ob' | 'power' | 'speed' | 'cost' | 'defense';

function sortCards(cards: BaseballCard[], key: SortKey): BaseballCard[] {
  return [...cards].sort((a, b) => {
    if (a.stats.type === 'pitcher' && b.stats.type === 'pitcher') {
      if (key === 'cost') return a.stats.pointCost - b.stats.pointCost;
      return (b.stats as PitcherStats).control - (a.stats as PitcherStats).control;
    }
    if (a.stats.type === 'pitcher') return 1;
    if (b.stats.type === 'pitcher') return -1;

    const aS = a.stats as HitterStats;
    const bS = b.stats as HitterStats;
    switch (key) {
      case 'ob': return bS.onBase - aS.onBase;
      case 'power': return bS.power - aS.power;
      case 'speed': return bS.speed - aS.speed;
      case 'defense': return bS.defense - aS.defense;
      case 'cost': return aS.pointCost - bS.pointCost;
    }
  });
}

// ===== Main Draft Page =====

export default function DraftPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<DraftState | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('ob');
  const [aiAnimatingId, setAiAnimatingId] = useState<string | null>(null);
  const [showRosters, setShowRosters] = useState(false);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup
  useEffect(() => {
    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, []);

  // Start draft when difficulty is selected
  const handleStartDraft = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    setDraft(startDraft(diff));
  }, []);

  // Player makes a pick
  const handlePlayerPick = useCallback((cardId: string) => {
    if (!draft || draft.currentTurn !== 'player') return;
    const result = playerPick(draft, cardId);
    if (!result.valid) return; // silently ignore invalid picks
    setDraft(result.state);
  }, [draft]);

  // AI takes its turn(s) after player picks
  useEffect(() => {
    if (!draft || draft.phase !== 'drafting' || draft.currentTurn !== 'ai') return;

    aiTimerRef.current = setTimeout(() => {
      // Show which card AI is about to pick
      const nextState = aiPick(draft);
      const lastAiPick = nextState.pickHistory[nextState.pickHistory.length - 1];
      if (lastAiPick) {
        setAiAnimatingId(lastAiPick.cardId);
        // After animation, apply the pick
        setTimeout(() => {
          setAiAnimatingId(null);
          setDraft(nextState);
        }, 600);
      } else {
        setDraft(nextState);
      }
    }, 500);
  }, [draft]);

  // Draft complete: build rosters and navigate to play
  useEffect(() => {
    if (!draft || draft.phase !== 'complete') return;

    const playerRoster = buildRosterFromDraft(draft.playerPicks, 'Draft Team');
    const aiRoster = buildRosterFromDraft(draft.aiPicks, 'AI Draft Team');

    // Save to localStorage
    localStorage.setItem('pdb-draft-player', JSON.stringify(playerRoster));
    localStorage.setItem('pdb-draft-ai', JSON.stringify(aiRoster));
    localStorage.setItem('pdb-draft-difficulty', draft.difficulty);

    // Navigate after a brief celebration moment
    setTimeout(() => {
      router.push('/games/baseball/play?drafted=true');
    }, 1500);
  }, [draft, router]);

  // ===== Difficulty Selection =====
  if (!difficulty || !draft) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-black mb-2">Snake Draft</h1>
          <p className="text-xs text-muted/50 max-w-xs mx-auto">
            Take turns picking from the shared pool. 10 picks each. Last pick = pitcher. 150-point cap.
          </p>
        </motion.div>

        <div className="w-full max-w-sm space-y-3">
          {([
            { key: 'rookie' as Difficulty, label: 'Rookie', tagline: 'AI picks randomly. Easy pickings.', color: 'text-green-400', border: 'border-green-500/30 hover:border-green-500/60', bg: 'linear-gradient(135deg, #0a1f0a 0%, #12141f 100%)' },
            { key: 'veteran' as Difficulty, label: 'Veteran', tagline: 'AI drafts by value. Strategic.', color: 'text-amber-400', border: 'border-amber-500/30 hover:border-amber-500/60', bg: 'linear-gradient(135deg, #1f1a0a 0%, #12141f 100%)' },
            { key: 'legend' as Difficulty, label: 'Legend', tagline: 'AI counter-drafts. Takes your targets.', color: 'text-red-400', border: 'border-red-500/30 hover:border-red-500/60', bg: 'linear-gradient(135deg, #1f0a0a 0%, #12141f 100%)' },
          ]).map((opt, i) => (
            <motion.button
              key={opt.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              onClick={() => handleStartDraft(opt.key)}
              className={`w-full text-left rounded-2xl border transition-all cursor-pointer ${opt.border}`}
              style={{ background: opt.bg }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-lg font-black ${opt.color}`}>{opt.label}</h3>
                  <span className="text-muted/20 text-lg">&rarr;</span>
                </div>
                <p className="text-xs text-muted/50">{opt.tagline}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
          <Link href="/games/baseball" className="text-xs text-muted/30 hover:text-muted transition-colors">
            &larr; Back to Baseball Hub
          </Link>
        </motion.div>
      </div>
    );
  }

  // ===== Draft Complete State =====
  if (draft.phase === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-3xl font-black mb-2">Draft Complete!</p>
          <p className="text-xs text-muted/50 mb-4">Building rosters and heading to the field...</p>
          <motion.div
            className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    );
  }

  // ===== Active Draft =====
  const isPlayerTurn = draft.currentTurn === 'player';
  const isPitcherPick = isPlayerTurn
    ? draft.playerPicks.length === 9
    : draft.aiPicks.length === 9;

  const takenIds = new Set([...draft.playerPicks, ...draft.aiPicks]);
  const sortedPool = sortCards(BASEBALL_CARDS, sortKey);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-border/20" style={{ background: 'rgba(10,14,20,0.9)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className={`text-xs font-black ${isPlayerTurn ? 'text-accent' : 'text-red-400'}`}>
              {isPlayerTurn ? 'YOUR PICK' : 'AI PICKING...'}
            </span>
            <span className="text-[10px] text-muted/40 ml-2">
              Pick {draft.pickNumber} of 20
            </span>
          </div>
          <button
            onClick={() => setShowRosters(!showRosters)}
            className="text-[10px] text-muted/50 hover:text-muted px-2 py-1 rounded-lg border border-border/20 transition-colors"
          >
            {showRosters ? 'Pool' : 'Rosters'}
          </button>
        </div>

        {/* Progress bar */}
        <DraftProgressBar
          pickNumber={draft.pickNumber}
          pickHistory={draft.pickHistory}
        />

        {/* Budget */}
        <div className="flex items-center justify-between mt-2 text-[9px]">
          <span className="text-muted/40">
            Budget: <span className="text-accent font-bold">{150 - draft.playerCost}</span> / 150 remaining
          </span>
          {isPitcherPick && isPlayerTurn && (
            <span className="text-purple-400 font-bold animate-pulse">PITCHER PICK</span>
          )}
        </div>

        {/* Sort filter */}
        {!showRosters && (
          <div className="flex gap-1 mt-2">
            {([
              { key: 'ob' as SortKey, label: 'OB' },
              { key: 'power' as SortKey, label: 'PWR' },
              { key: 'speed' as SortKey, label: 'SPD' },
              { key: 'defense' as SortKey, label: 'DEF' },
              { key: 'cost' as SortKey, label: 'Cost' },
            ]).map(s => (
              <button
                key={s.key}
                onClick={() => setSortKey(s.key)}
                className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-colors ${
                  sortKey === s.key
                    ? 'bg-accent/15 text-accent border border-accent/20'
                    : 'text-muted/30 hover:text-muted/50 border border-transparent'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          {showRosters ? (
            <motion.div
              key="rosters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-3 p-4"
            >
              <RosterPreview
                picks={draft.playerPicks}
                label="Your Team"
                accentColor="text-accent"
                maxCost={150}
                currentCost={draft.playerCost}
              />
              <RosterPreview
                picks={draft.aiPicks}
                label="AI Team"
                accentColor="text-red-400"
                maxCost={150}
                currentCost={draft.aiCost}
              />
            </motion.div>
          ) : (
            <motion.div
              key="pool"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-2 gap-2 p-4"
            >
              {sortedPool.map(card => {
                const isTaken = takenIds.has(card.id);
                const takenBy = draft.playerPicks.includes(card.id)
                  ? 'player' as DraftTurn
                  : draft.aiPicks.includes(card.id)
                    ? 'ai' as DraftTurn
                    : undefined;
                const wouldBustBudget = !isTaken && (draft.playerCost + card.stats.pointCost > 150);
                const disabled = !isPlayerTurn || wouldBustBudget;

                return (
                  <DraftCard
                    key={card.id}
                    card={card}
                    disabled={disabled}
                    taken={isTaken}
                    takenBy={takenBy}
                    isPitcherPick={isPitcherPick && isPlayerTurn}
                    onPick={handlePlayerPick}
                    animating={aiAnimatingId === card.id}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 p-3 bg-bg/90 backdrop-blur-sm border-t border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted/30">
              {draft.playerPicks.length}/10 yours
            </span>
            <span className="text-[9px] text-muted/30">
              {draft.aiPicks.length}/10 AI
            </span>
          </div>
          <Link href="/games/baseball" className="text-[10px] text-muted/30 hover:text-muted transition-colors">
            Abandon Draft
          </Link>
        </div>
      </div>
    </div>
  );
}
