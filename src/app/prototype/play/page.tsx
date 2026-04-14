'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { StatKey, STAT_LABELS, STAT_ICONS, STAT_COLORS, getCharacterStats, getEffectiveStat } from '@/data/stats';
import { getOwnedCards, addOwnedCards, getPackCredits } from '@/lib/store';

type Phase = 'intro' | 'pre-battle' | 'battle' | 'round-result' | 'battle-result' | 'collection';

interface BattleState {
  playerCards: Card[];
  aiCards: Card[];
  currentRound: number; // 0-2
  playerScore: number;
  aiScore: number;
  playerPick: Card | null;
  aiPick: Card | null;
  selectedStat: StatKey | null;
  roundWinner: 'player' | 'ai' | null;
  availableStats: StatKey[]; // 3 random stats per round
}

const STATS: StatKey[] = ['power', 'intelligence', 'mystery', 'legend', 'charm'];

function pickRandomStats(count: number): StatKey[] {
  const shuffled = [...STATS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getCardStat(card: Card, stat: StatKey): number {
  const base = getCharacterStats(card.character);
  return getEffectiveStat(base, stat, card.scarcity, card.parallel);
}

function pickAICards(exclude: Set<string>): Card[] {
  const pool = ALL_CARDS.filter(c => !exclude.has(c.id));
  // Prefer cards from sets the player is progressing in (has 1+ cards)
  const playerSets = new Set<string>();
  for (const id of exclude) {
    const card = ALL_CARDS.find(c => c.id === id);
    if (card) playerSets.add(card.setSlug);
  }
  // Sort: cards from player's active sets first, then shuffle within tiers
  const prioritized = pool.sort((a, b) => {
    const aActive = playerSets.has(a.setSlug) ? 0 : 1;
    const bActive = playerSets.has(b.setSlug) ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    return Math.random() - 0.5;
  });
  // Pick 3 unique characters
  const seen = new Set<string>();
  const picks: Card[] = [];
  for (const card of prioritized) {
    if (!seen.has(card.character) && picks.length < 3) {
      seen.add(card.character);
      picks.push(card);
    }
  }
  return picks;
}

export default function PlayPrototype() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [wins, setWins] = useState(0);
  const [earnedCards, setEarnedCards] = useState<Card[]>([]);


  useEffect(() => {
    const owned = getOwnedCards();
    setOwnedIds(new Set(owned.map(c => c.id)));
    // Load win count from localStorage
    const savedWins = parseInt(localStorage.getItem('lorevault_play_wins') || '0');
    setWins(savedWins);
  }, []);

  // Get player's best cards (highest total stats)
  const playerDeck = useMemo(() => {
    const owned = ALL_CARDS.filter(c => ownedIds.has(c.id));
    if (owned.length < 3) {
      // Give starter cards if they don't have 3
      const starters = ALL_CARDS.filter(c => c.scarcity === 'common').slice(0, 3);
      return starters;
    }
    return owned
      .map(card => ({
        card,
        total: STATS.reduce((sum, s) => sum + getCardStat(card, s), 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map(c => c.card);
  }, [ownedIds]);

  const startBattle = useCallback(() => {
    const aiCards = pickAICards(ownedIds);
    setBattle({
      playerCards: [...playerDeck],
      aiCards,
      currentRound: 0,
      playerScore: 0,
      aiScore: 0,
      playerPick: null,
      aiPick: null,
      selectedStat: null,
      roundWinner: null,
      availableStats: pickRandomStats(3),
    });
    setPhase('pre-battle');
  }, [playerDeck, ownedIds]);

  const selectCard = useCallback((card: Card) => {
    if (!battle) return;
    // AI picks randomly from remaining
    const aiRemaining = battle.aiCards.filter(
      c => !battle.playerCards.slice(0, battle.currentRound).includes(c) // simplified
    );
    const aiPick = battle.aiCards[battle.currentRound]; // sequential for simplicity

    setBattle(prev => prev ? { ...prev, playerPick: card, aiPick } : null);
    setPhase('battle');
  }, [battle]);

  const selectStat = useCallback((stat: StatKey) => {
    if (!battle || !battle.playerPick || !battle.aiPick) return;
    const playerVal = getCardStat(battle.playerPick, stat);
    const aiVal = getCardStat(battle.aiPick, stat);
    const winner = playerVal >= aiVal ? 'player' : 'ai';

    setBattle(prev => prev ? {
      ...prev,
      selectedStat: stat,
      roundWinner: winner,
      playerScore: prev.playerScore + (winner === 'player' ? 1 : 0),
      aiScore: prev.aiScore + (winner === 'ai' ? 1 : 0),
    } : null);
    setPhase('round-result');
  }, [battle]);

  const nextRound = useCallback(() => {
    if (!battle) return;
    const newRound = battle.currentRound + 1;

    if (newRound >= 3 || battle.playerScore >= 2 || battle.aiScore >= 2) {
      // Battle over
      const won = battle.playerScore + (battle.roundWinner === 'player' ? 0 : 0) >= 2;
      // Check actual scores after this round
      const finalPlayerScore = battle.playerScore;
      const finalAiScore = battle.aiScore;
      const playerWon = finalPlayerScore >= 2;

      if (playerWon) {
        // Reward: earn the AI's best card
        const reward = battle.aiCards[0];
        addOwnedCards([reward.id]);
        setOwnedIds(prev => new Set([...prev, reward.id]));
        setEarnedCards(prev => [...prev, reward]);
        const newWins = wins + 1;
        setWins(newWins);
        localStorage.setItem('lorevault_play_wins', String(newWins));
      }
      setPhase('battle-result');
    } else {
      setBattle(prev => prev ? {
        ...prev,
        currentRound: newRound,
        playerPick: null,
        aiPick: null,
        selectedStat: null,
        roundWinner: null,
        availableStats: pickRandomStats(3),
      } : null);
      setPhase('pre-battle');
    }
  }, [battle, wins]);

  // ═══════════════════════════════════════════
  // INTRO — the hook
  // ═══════════════════════════════════════════
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <motion.p
            className="text-sm text-muted/70 tracking-wide mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your cards. Your stats. Your battle.
          </motion.p>
          <motion.h1
            className="type-display text-foreground mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Play.
            <br />
            Win.
            <br />
            Collect.
          </motion.h1>
          <motion.button
            onClick={startBattle}
            className="text-sm font-bold tracking-wide py-3 px-8 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #ef444430, #ef444415)',
              border: '1.5px solid #ef444440',
              color: '#ef4444',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            whileTap={{ scale: 0.95 }}
          >
            Battle
          </motion.button>

          {/* Win counter */}
          {wins > 0 && (
            <motion.p
              className="mt-4 text-[10px] text-muted/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {wins} {wins === 1 ? 'victory' : 'victories'} &middot; {earnedCards.length} cards earned
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  if (!battle) return null;

  // ═══════════════════════════════════════════
  // PRE-BATTLE — pick your card
  // ═══════════════════════════════════════════
  if (phase === 'pre-battle') {
    const usedIndices = new Set<number>();
    // Mark used cards from previous rounds
    const availableCards = battle.playerCards.filter((_, i) => i >= battle.currentRound || i === battle.currentRound);

    return (
      <div
        className="min-h-screen px-4 pt-4 flex flex-col"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Round indicator */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-mono text-muted/50">
            Round {battle.currentRound + 1} of 3
          </span>
          <div className="flex justify-center gap-2 mt-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-6 h-1 rounded-full"
                style={{
                  background: i < battle.currentRound ? '#22c55e'
                    : i === battle.currentRound ? '#ef4444'
                    : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-2 text-[10px]">
            <span style={{ color: '#22c55e' }}>You: {battle.playerScore}</span>
            <span style={{ color: '#ef4444' }}>AI: {battle.aiScore}</span>
          </div>
        </div>

        {/* AI's cards — face down */}
        <div className="flex justify-center gap-2 mb-6">
          {battle.aiCards.map((_, i) => (
            <div
              key={i}
              className="w-14 h-[78px] rounded-lg flex items-center justify-center"
              style={{
                background: i < battle.currentRound
                  ? 'rgba(255,255,255,0.02)'
                  : 'linear-gradient(145deg, #1a1a2e, #0a0b14)',
                border: i < battle.currentRound
                  ? '1px solid rgba(255,255,255,0.03)'
                  : '1px solid rgba(255,255,255,0.08)',
                opacity: i < battle.currentRound ? 0.3 : 1,
              }}
            >
              {i >= battle.currentRound && <span className="text-lg opacity-30">?</span>}
            </div>
          ))}
        </div>

        <div className="text-center text-[10px] text-muted/40 mb-3">VS</div>

        {/* Your cards — pick one */}
        <div className="text-center mb-3">
          <span className="text-[10px] text-muted/50">Choose your fighter</span>
        </div>

        <div className="flex justify-center gap-3 flex-1 items-center">
          {battle.playerCards.map((card, i) => {
            const used = i < battle.currentRound;
            const stats = getCharacterStats(card.character);

            return (
              <motion.button
                key={card.id}
                disabled={used}
                onClick={() => !used && selectCard(card)}
                className="relative"
                whileTap={!used ? { scale: 0.95 } : undefined}
                style={{ opacity: used ? 0.25 : 1 }}
              >
                <div
                  className="w-[100px] aspect-[5/7] rounded-xl overflow-hidden relative"
                  style={{
                    background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                    border: `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}40`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl" style={{ opacity: 0.6 }}>{card.symbol}</span>
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.5) 100%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-black/50">
                    <div className="text-[9px] text-white/80 truncate font-medium">{card.character}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // BATTLE — pick a stat
  // ═══════════════════════════════════════════
  if (phase === 'battle' && battle.playerPick && battle.aiPick) {
    return (
      <div
        className="min-h-screen px-4 pt-4 flex flex-col"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Round header */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-mono text-muted/50">
            Round {battle.currentRound + 1} &mdash; Choose a stat
          </span>
        </div>

        {/* Cards face-off — compact thumbnails during stat pick */}
        <div className="flex items-center justify-center gap-6 mb-5">
          {/* Player card thumbnail */}
          <div className="text-center">
            <div
              className="w-[60px] aspect-[5/7] rounded-lg overflow-hidden relative mb-1"
              style={{
                background: `linear-gradient(145deg, ${battle.playerPick.gradientFrom}, ${battle.playerPick.gradientTo})`,
                border: `1.5px solid ${SCARCITY_CONFIG[battle.playerPick.scarcity].color}`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl" style={{ opacity: 0.6 }}>{battle.playerPick.symbol}</span>
              </div>
            </div>
            <span className="text-[8px] text-foreground/70 truncate block w-[60px]">{battle.playerPick.character}</span>
          </div>

          <span className="text-sm text-muted/30 font-bold">VS</span>

          {/* AI card — face down thumbnail */}
          <div className="text-center">
            <div
              className="w-[60px] aspect-[5/7] rounded-lg overflow-hidden relative mb-1 flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #1a1a2e, #0a0b14)',
                border: '1.5px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-lg opacity-30">?</span>
            </div>
            <span className="text-[8px] text-muted/40">???</span>
          </div>
        </div>

        {/* Stat picker — 3 random stats per round */}
        {(() => {
          const statVals = battle.availableStats.map(s => getCardStat(battle.playerPick!, s));
          const bestIdx = statVals.indexOf(Math.max(...statVals));
          return (
            <div className="space-y-2.5 max-w-xs mx-auto w-full">
              {battle.availableStats.map((stat, i) => {
                const val = statVals[i];
                const isBest = i === bestIdx;
                return (
                  <motion.button
                    key={stat}
                    onClick={() => selectStat(stat)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl"
                    style={{
                      background: isBest ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                      border: isBest
                        ? `1px solid ${STAT_COLORS[stat]}30`
                        : '1px solid rgba(255,255,255,0.06)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <span className="text-lg">{STAT_ICONS[stat]}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-foreground/70">{STAT_LABELS[stat]}</span>
                        <span
                          className="text-sm font-bold font-mono"
                          style={{ color: STAT_COLORS[stat] }}
                        >
                          {val}
                        </span>
                      </div>
                      {/* Stat bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: STAT_COLORS[stat] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          );
        })()}
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // ROUND RESULT — who won this round
  // ═══════════════════════════════════════════
  if (phase === 'round-result' && battle.playerPick && battle.aiPick && battle.selectedStat) {
    const playerVal = getCardStat(battle.playerPick, battle.selectedStat);
    const aiVal = getCardStat(battle.aiPick, battle.selectedStat);
    const won = battle.roundWinner === 'player';

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        onClick={nextRound}
        role="button"
        tabIndex={0}
      >
        {/* Background color flash on result */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ background: won ? '#22c55e' : '#ef4444' }}
        />

        {/* Cards revealed side by side */}
        <div className="flex items-start gap-4 mb-6">
          {/* Player card with stat */}
          <div className="text-center">
            <div
              className="w-[100px] aspect-[5/7] rounded-xl overflow-hidden relative mb-2"
              style={{
                background: `linear-gradient(145deg, ${battle.playerPick.gradientFrom}, ${battle.playerPick.gradientTo})`,
                border: `2px solid ${won ? '#22c55e' : '#ef4444'}`,
                boxShadow: won ? '0 0 20px rgba(34,197,94,0.2)' : 'none',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl" style={{ opacity: 0.6 }}>{battle.playerPick.symbol}</span>
              </div>
            </div>
            <div className="text-[10px] text-foreground/70 mb-1">{battle.playerPick.character}</div>
            <motion.div
              className="text-lg font-bold font-mono"
              style={{ color: STAT_COLORS[battle.selectedStat] }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              {playerVal}
            </motion.div>
          </div>

          <div className="pt-16 text-muted/40 text-lg font-bold">VS</div>

          {/* AI card revealed — dramatic flip */}
          <div className="text-center">
            <motion.div
              className="w-[100px] aspect-[5/7] rounded-xl overflow-hidden relative mb-2"
              style={{
                background: `linear-gradient(145deg, ${battle.aiPick.gradientFrom}, ${battle.aiPick.gradientTo})`,
                border: `2px solid ${!won ? '#22c55e' : '#ef4444'}`,
                boxShadow: !won ? '0 0 20px rgba(34,197,94,0.2)' : 'none',
              }}
              initial={{ rotateY: 90, scale: 0.9 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl" style={{ opacity: 0.6 }}>{battle.aiPick.symbol}</span>
              </div>
            </motion.div>
            <div className="text-[10px] text-foreground/70 mb-1">{battle.aiPick.character}</div>
            {/* AI stat revealed with suspense delay */}
            <motion.div
              className="text-lg font-bold font-mono"
              style={{ color: STAT_COLORS[battle.selectedStat] }}
              initial={{ opacity: 0, scale: 1.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {aiVal}
            </motion.div>
          </div>
        </div>

        {/* Result — delayed for suspense */}
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="flex items-center gap-2 justify-center mb-1">
            <span className="text-lg">{STAT_ICONS[battle.selectedStat]}</span>
            <span className="text-xs text-muted">{STAT_LABELS[battle.selectedStat]}</span>
          </div>
          <h3
            className="type-subheading"
            style={{ color: won ? '#22c55e' : '#ef4444' }}
          >
            {won ? 'You win this round!' : 'AI wins this round'}
          </h3>
        </motion.div>

        {/* Score */}
        <motion.div
          className="flex gap-6 text-sm font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <span style={{ color: '#22c55e' }}>You: {battle.playerScore}</span>
          <span style={{ color: '#ef4444' }}>AI: {battle.aiScore}</span>
        </motion.div>

        {/* Tap hint */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.3] }}
          transition={{ delay: 1.2, duration: 1.5 }}
        >
          <span className="text-[10px] text-muted/30">
            {battle.playerScore >= 2 || battle.aiScore >= 2
              ? 'Tap to see results'
              : 'Tap for next round'}
          </span>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // BATTLE RESULT — win or lose
  // ═══════════════════════════════════════════
  if (phase === 'battle-result') {
    const won = battle.playerScore >= 2;
    const reward = won ? battle.aiCards[0] : null;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <motion.div
          className="text-center w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h2
            className="type-heading mb-2"
            style={{ color: won ? '#22c55e' : '#ef4444' }}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {won ? 'Victory!' : 'Defeat'}
          </motion.h2>
          <p className="text-xs text-muted mb-6">
            {won
              ? `${battle.playerScore}-${battle.aiScore} — You earned a card!`
              : `${battle.playerScore}-${battle.aiScore} — Better luck next time`}
          </p>

          {/* Reward card */}
          {reward && (
            <motion.div
              className="flex flex-col items-center mb-6"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="w-36 aspect-[5/7] rounded-xl overflow-hidden relative mb-3"
                style={{
                  background: `linear-gradient(145deg, ${reward.gradientFrom}, ${reward.gradientTo})`,
                  border: `2px solid ${SCARCITY_CONFIG[reward.scarcity].color}`,
                  boxShadow: `0 0 30px ${SCARCITY_CONFIG[reward.scarcity].color}20`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl" style={{ opacity: 0.6 }}>{reward.symbol}</span>
                </div>
                <div
                  className="absolute bottom-2 left-2 right-2 text-center py-1 rounded-lg"
                  style={{ background: `${SCARCITY_CONFIG[reward.scarcity].color}20` }}
                >
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: SCARCITY_CONFIG[reward.scarcity].color }}
                  >
                    {reward.scarcity}
                  </span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{reward.character}</h3>
              <p className="text-[10px] text-muted italic">{reward.moment}</p>

              {/* Three Aha signals in under 3s: rarity + set + gap-fill */}
              {(() => {
                const set = SETS.find(s => s.slug === reward.setSlug);
                const setCards = ALL_CARDS.filter(c => c.setSlug === reward.setSlug);
                const ownedInSet = setCards.filter(c => ownedIds.has(c.id)).length;
                // Check if this is a duplicate (appears more than once in earnedCards)
                const timesEarned = earnedCards.filter(c => c.id === reward.id).length;
                const isNew = timesEarned <= 1;
                if (!set) return null;
                return (
                  <motion.div
                    className="mt-3 flex flex-col items-center"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {/* Gap-fill signal */}
                    {isNew && (
                      <motion.span
                        className="text-[9px] font-bold uppercase tracking-widest mb-2 px-3 py-0.5 rounded-full"
                        style={{
                          color: '#22c55e',
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                      >
                        New card!
                      </motion.span>
                    )}
                    {/* Set membership + progress */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm">{set.icon}</span>
                      <span className="text-[10px] text-foreground/60">{set.name}</span>
                    </div>
                    {/* Mini progress bar with animated fill */}
                    <div className="w-40 h-1.5 rounded-full bg-white/5 overflow-hidden mb-1">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${set.gradientFrom}, ${SCARCITY_CONFIG[reward.scarcity].color})` }}
                        initial={{ width: `${(Math.max(0, ownedInSet - 1) / setCards.length) * 100}%` }}
                        animate={{ width: `${(ownedInSet / setCards.length) * 100}%` }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[9px] text-foreground/30 font-mono">
                      {ownedInSet}/{setCards.length} collected
                    </span>
                  </motion.div>
                );
              })()}
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={startBattle}
              className="py-3 rounded-xl text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #ef444420, #ef444410)',
                border: '1px solid #ef444430',
                color: '#ef4444',
              }}
            >
              Battle again
            </button>

            {/* Collection CTA — appears after earning cards */}
            {earnedCards.length >= 2 && (
              <button
                onClick={() => setPhase('collection')}
                className="py-3 rounded-xl text-sm font-medium text-foreground/50"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                View your trophies ({earnedCards.length})
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // COLLECTION — mini-binder grouped by set
  // ═══════════════════════════════════════════
  if (phase === 'collection') {
    // Group all owned cards by set (not just earned — total collection)
    const setProgress = SETS.map(set => {
      const setCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
      const owned = setCards.filter(c => ownedIds.has(c.id));
      return { set, total: setCards.length, owned: owned.length, cards: owned };
    }).filter(s => s.owned > 0);

    return (
      <div
        className="min-h-screen flex flex-col px-5 pt-6"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <motion.div
          className="w-full max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center mb-5">
            <h2 className="type-heading text-foreground mb-1">Your Collection</h2>
            <p className="text-[10px] text-muted/50">
              {wins} {wins === 1 ? 'victory' : 'victories'} &middot; {earnedCards.length} cards earned in battle
            </p>
          </div>

          {/* Set-grouped binder */}
          <div className="space-y-5 mb-8">
            {setProgress.map(({ set, total, owned, cards }, si) => (
              <motion.div
                key={set.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.1 }}
              >
                {/* Set header with progress */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{set.icon}</span>
                  <span className="text-[11px] text-foreground/70 flex-1">{set.name}</span>
                  <span className="text-[10px] font-mono text-foreground/40">{owned}/{total}</span>
                </div>
                {/* Set progress bar */}
                <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden mb-2.5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(owned / total) * 100}%`,
                      background: `linear-gradient(90deg, ${set.gradientFrom}, ${set.gradientTo})`,
                    }}
                  />
                </div>
                {/* Card thumbnails in this set */}
                <div className="grid grid-cols-5 gap-1.5">
                  {cards.slice(0, 10).map((card, ci) => (
                    <div
                      key={card.id}
                      className="aspect-[5/7] rounded-lg overflow-hidden relative"
                      style={{
                        background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                        border: `1px solid ${SCARCITY_CONFIG[card.scarcity].color}30`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm" style={{ opacity: 0.5 }}>{card.symbol}</span>
                      </div>
                    </div>
                  ))}
                  {owned > 10 && (
                    <div className="aspect-[5/7] rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
                    >
                      <span className="text-[9px] text-foreground/30">+{owned - 10}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={startBattle}
            className="w-full py-3 rounded-xl text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #ef444420, #ef444410)',
              border: '1px solid #ef444430',
              color: '#ef4444',
            }}
          >
            Keep battling
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
}
