'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, SCARCITY_CONFIG, BattleRound } from '@/data/types';
import { getOwnedCards, saveBattleRecord, addPackCredits } from '@/lib/store';
import { ALL_CARDS } from '@/data/cards';
import {
  StatKey, STAT_LABELS, STAT_ICONS, STAT_COLORS,
  getCharacterStats, getEffectiveStat,
} from '@/data/stats';
import { Difficulty, seededRandom, aiPickCard, aiChooseStat } from '@/lib/ai';
import BattleCard from '@/components/games/BattleCard';

type Phase =
  | 'deck-select'
  | 'difficulty-select'
  | 'ready'
  | 'stat-select'
  | 'reveal'
  | 'round-result'
  | 'game-over';

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; desc: string; icon: string; color: string }> = {
  easy: { label: 'Novice', desc: 'Random picks, forgiving', icon: '🟢', color: '#22c55e' },
  medium: { label: 'Warrior', desc: 'Smart stat picks', icon: '🟡', color: '#f59e0b' },
  hard: { label: 'Legend', desc: 'Counter-picks your deck', icon: '🔴', color: '#ef4444' },
};

const XP_TABLE: Record<Difficulty, { win: number; perRound: number; lose: number }> = {
  easy: { win: 30, perRound: 5, lose: 5 },
  medium: { win: 50, perRound: 10, lose: 10 },
  hard: { win: 80, perRound: 15, lose: 15 },
};

export default function BattlePage() {
  const [phase, setPhase] = useState<Phase>('deck-select');
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerDeck, setPlayerDeck] = useState<Card[]>([]);
  const [aiDeck, setAiDeck] = useState<Card[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [aiCard, setAiCard] = useState<Card | null>(null);
  const [selectedStat, setSelectedStat] = useState<StatKey | null>(null);
  const [rounds, setRounds] = useState<BattleRound[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [roundResult, setRoundResult] = useState<'win' | 'lose' | null>(null);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [closeCall, setCloseCall] = useState(false);
  const [gameSeed] = useState(() => Date.now());
  const aiPoolRef = useRef<Card[]>([]);
  const playerPoolRef = useRef<Card[]>([]);

  // Confetti particles for victory
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const owned = getOwnedCards();
    setOwnedCards(owned);

    // Auto-select top 5 cards by scarcity
    const sorted = [...owned].sort((a, b) => {
      const order = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
      return order[b.scarcity] - order[a.scarcity];
    });
    const autoIds = sorted.slice(0, Math.min(5, sorted.length)).map(c => c.id);
    setSelectedIds(new Set(autoIds));
  }, []);

  // Toggle card in/out of selected deck
  const toggleCard = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 5) {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Build AI deck from full card pool
  const buildAiDeck = useCallback((playerCards: Card[]) => {
    const rand = seededRandom(gameSeed);
    const playerIds = new Set(playerCards.map(c => c.id));
    const available = ALL_CARDS.filter(c => !playerIds.has(c.id));
    const shuffled = [...available].sort(() => rand() - 0.5);

    const deck: Card[] = [];
    const usedCharacters = new Set<string>();
    for (const card of shuffled) {
      if (!usedCharacters.has(card.character) && deck.length < 5) {
        deck.push(card);
        usedCharacters.add(card.character);
      }
    }
    for (const card of shuffled) {
      if (deck.length >= 5) break;
      if (!deck.find(d => d.id === card.id)) {
        deck.push(card);
      }
    }
    return deck.slice(0, 5);
  }, [gameSeed]);

  // Proceed from deck selection to difficulty
  const confirmDeck = useCallback(() => {
    const cards = ownedCards.filter(c => selectedIds.has(c.id));
    setPlayerDeck(cards);
    setPhase('difficulty-select');
  }, [ownedCards, selectedIds]);

  // Start battle after difficulty selected
  const startBattle = useCallback(() => {
    const aiCards = buildAiDeck(playerDeck);
    setAiDeck(aiCards);
    aiPoolRef.current = [...aiCards];
    playerPoolRef.current = [...playerDeck];
    setCurrentRound(1);
    setPhase('ready');

    // Brief "ready" flash, then reveal first cards
    setTimeout(() => {
      setPlayerCard(playerDeck[0]);
      const pick = aiPickCard(aiCards, playerDeck[0], difficulty, gameSeed + 1);
      setAiCard(pick);
      setPhase('stat-select');
    }, 800);
  }, [buildAiDeck, playerDeck, difficulty, gameSeed]);

  // Handle stat selection
  const handleStatSelect = useCallback((stat: StatKey) => {
    if (!playerCard || !aiCard || selectedStat) return;
    setSelectedStat(stat);
    setPhase('reveal');

    const playerStats = getCharacterStats(playerCard.character);
    const aiStats = getCharacterStats(aiCard.character);
    const playerValue = getEffectiveStat(playerStats, stat, playerCard.scarcity, playerCard.parallel);
    const aiValue = getEffectiveStat(aiStats, stat, aiCard.scarcity, aiCard.parallel);

    const playerWon = playerValue >= aiValue;
    const margin = Math.abs(playerValue - aiValue);

    // Close call: margin <= 5
    if (margin <= 5) {
      setCloseCall(true);
      setTimeout(() => setCloseCall(false), 1500);
    }

    // Screen shake on big win/loss (margin > 20)
    if (margin > 20) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    }

    const round: BattleRound = {
      roundNumber: currentRound,
      stat,
      playerCardId: playerCard.id,
      playerValue,
      opponentCharacter: aiCard.character,
      opponentValue: aiValue,
      playerWon,
    };

    setRounds(prev => [...prev, round]);
    setRoundResult(playerWon ? 'win' : 'lose');

    const newPlayerScore = playerScore + (playerWon ? 1 : 0);
    const newAiScore = aiScore + (playerWon ? 0 : 1);
    setPlayerScore(newPlayerScore);
    setAiScore(newAiScore);

    // After reveal, show round result briefly then advance
    setTimeout(() => {
      setPhase('round-result');
    }, 1200);

    setTimeout(() => {
      if (newPlayerScore >= 3 || newAiScore >= 3 || currentRound >= 5) {
        // Game over
        const won = newPlayerScore > newAiScore;
        const xpConfig = XP_TABLE[difficulty];
        const xp = won
          ? xpConfig.win + newPlayerScore * xpConfig.perRound
          : xpConfig.lose + newPlayerScore * xpConfig.perRound;
        setXpEarned(xp);
        setGameResult(won ? 'win' : 'lose');
        setPhase('game-over');

        // Confetti on win
        if (won) {
          const particles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ec4899', '#ef4444'][i % 6],
          }));
          setConfetti(particles);
        }

        saveBattleRecord({
          id: `battle-${Date.now()}`,
          date: new Date().toISOString(),
          playerDeck: playerDeck.map(c => c.id),
          opponentDeck: aiDeck.map(c => c.character),
          rounds: [...rounds, round],
          playerWins: newPlayerScore,
          opponentWins: newAiScore,
          won,
          xpEarned: xp,
        });

        if (won) addPackCredits(1);
      } else {
        // Next round
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setSelectedStat(null);
        setRoundResult(null);

        // Remove used cards
        const remainingPlayer = playerPoolRef.current.filter(c => c.id !== playerCard.id);
        const remainingAi = aiPoolRef.current.filter(c => c.id !== aiCard.id);
        playerPoolRef.current = remainingPlayer;
        aiPoolRef.current = remainingAi;

        const nextPlayerCard = remainingPlayer[0] || null;
        setPlayerCard(nextPlayerCard);
        if (remainingAi.length > 0) {
          const pick = aiPickCard(remainingAi, nextPlayerCard, difficulty, gameSeed + nextRound);
          setAiCard(pick);
        }
        setPhase('stat-select');
      }
    }, 2800);
  }, [playerCard, aiCard, selectedStat, currentRound, playerScore, aiScore, playerDeck, aiDeck, rounds, gameSeed, difficulty]);

  // ===== DECK SELECT =====
  if (phase === 'deck-select') {
    if (ownedCards.length < 3) {
      return (
        <div className="min-h-screen px-4 pt-8 pb-24 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-6xl mb-4 block">⚔️</span>
            <h1 className="text-xl font-bold mb-2">Not Enough Cards</h1>
            <p className="text-sm text-muted mb-6">You need at least 3 cards to battle. Open packs to build your collection.</p>
            <Link href="/packs" className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm">
              Open Packs
            </Link>
          </motion.div>
        </div>
      );
    }

    const sortedOwned = [...ownedCards].sort((a, b) => {
      const order = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
      return order[b.scarcity] - order[a.scarcity];
    });

    const canStart = selectedIds.size >= 3;

    return (
      <div className="min-h-screen px-4 pt-8 pb-24">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Link href="/games" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted">
              <span className="text-sm">&larr;</span>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Build Your Battle Deck</h1>
              <p className="text-xs text-muted">Select 3-5 cards from your collection</p>
            </div>
          </div>

          {/* Selection count */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  borderColor: i <= selectedIds.size ? '#818cf8' : '#1f2237',
                  backgroundColor: i <= selectedIds.size ? '#818cf820' : 'transparent',
                  color: i <= selectedIds.size ? '#818cf8' : '#6b7094',
                }}
              >
                {i <= selectedIds.size ? '✓' : i}
              </div>
            ))}
            <span className="text-xs text-muted ml-2">{selectedIds.size}/5 selected</span>
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {sortedOwned.map((card, i) => {
              const isSelected = selectedIds.has(card.id);
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative rounded-lg overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: isSelected ? '#818cf8' : SCARCITY_CONFIG[card.scarcity].color + '40',
                    boxShadow: isSelected ? '0 0 20px rgba(129,140,248,0.3)' : 'none',
                    opacity: !isSelected && selectedIds.size >= 5 ? 0.4 : 1,
                  }}
                  onClick={() => toggleCard(card.id)}
                >
                  <div
                    className="h-28 flex flex-col items-center justify-center relative"
                    style={{ background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})` }}
                  >
                    <span className="text-2xl">{card.symbol}</span>
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 bg-accent/20 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="text-2xl">✓</span>
                      </motion.div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/80">
                      <div className="text-[8px] font-semibold text-white truncate">{card.character}</div>
                      <div className="text-[7px] font-mono uppercase" style={{ color: SCARCITY_CONFIG[card.scarcity].color }}>
                        {SCARCITY_CONFIG[card.scarcity].label}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Start button */}
          <motion.button
            className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all"
            style={{
              background: canStart ? 'linear-gradient(135deg, #dc2626, #ea580c)' : '#1f2237',
              color: canStart ? 'white' : '#6b7094',
            }}
            whileHover={canStart ? { scale: 1.02 } : undefined}
            whileTap={canStart ? { scale: 0.97 } : undefined}
            onClick={canStart ? confirmDeck : undefined}
            disabled={!canStart}
          >
            {canStart ? `Battle with ${selectedIds.size} Cards` : `Select at least 3 cards`}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ===== DIFFICULTY SELECT =====
  if (phase === 'difficulty-select') {
    return (
      <div className="min-h-screen px-4 pt-8 pb-24 flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-2">Choose Difficulty</h1>
          <p className="text-sm text-muted text-center mb-6">Harder battles earn more XP</p>

          <div className="space-y-3 mb-8">
            {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG.easy][]).map(([key, config]) => (
              <motion.button
                key={key}
                className="w-full p-4 rounded-xl border-2 text-left transition-all"
                style={{
                  borderColor: difficulty === key ? config.color : '#1f2237',
                  backgroundColor: difficulty === key ? config.color + '10' : '#12141f',
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDifficulty(key)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <div className="font-bold" style={{ color: difficulty === key ? config.color : '#e8e9f0' }}>
                      {config.label}
                    </div>
                    <div className="text-xs text-muted">{config.desc}</div>
                  </div>
                  <div className="ml-auto text-xs text-muted font-mono">
                    +{XP_TABLE[key].win} XP
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={startBattle}
          >
            ⚔️ Fight!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ===== READY SCREEN =====
  if (phase === 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 2 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [2, 1, 1, 0.5] }}
          transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
        >
          <span className="text-6xl font-bold text-accent">Round 1</span>
        </motion.div>
      </div>
    );
  }

  // ===== GAME OVER =====
  if (phase === 'game-over') {
    return (
      <div className="min-h-screen px-4 pt-8 pb-24 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Confetti */}
        {confetti.map(p => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{ left: `${p.x}%`, top: '-10px', backgroundColor: p.color }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: [0, window?.innerHeight ? window.innerHeight + 100 : 900],
              opacity: [1, 1, 0.5, 0],
              rotate: [0, 360 * (p.id % 2 === 0 ? 1 : -1)],
              x: [0, (p.id % 2 === 0 ? 1 : -1) * 30 * Math.random()],
            }}
            transition={{
              duration: 2 + p.delay,
              delay: p.delay,
              ease: 'easeIn',
            }}
          />
        ))}

        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* Victory/Defeat icon */}
          <motion.div
            className="text-7xl mb-4"
            animate={
              gameResult === 'win'
                ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }
                : { scale: [1, 1.1, 1], y: [0, -10, 0] }
            }
            transition={{ duration: 0.8, repeat: gameResult === 'win' ? 2 : 0 }}
          >
            {gameResult === 'win' ? '🏆' : '💀'}
          </motion.div>

          <h1 className="text-3xl font-bold mb-1">
            {gameResult === 'win' ? 'Victory!' : 'Defeated'}
          </h1>
          <p className="text-muted text-sm mb-1">
            {DIFFICULTY_CONFIG[difficulty].icon} {DIFFICULTY_CONFIG[difficulty].label} difficulty
          </p>

          {/* Score */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{playerScore}</div>
              <div className="text-[10px] text-muted uppercase">You</div>
            </div>
            <div className="text-lg text-muted">—</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{aiScore}</div>
              <div className="text-[10px] text-muted uppercase">AI</div>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span>⭐</span>
              <span className="font-bold text-accent">+{xpEarned} XP</span>
            </motion.div>

            {gameResult === 'win' && (
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span>🎁</span>
                <span className="font-bold text-green-400">+1 Pack</span>
              </motion.div>
            )}
          </div>

          {/* Round recap */}
          <div className="mb-8 space-y-2 max-w-sm mx-auto">
            {rounds.map((round, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="text-[10px] text-muted font-mono w-4">R{round.roundNumber}</span>
                <span className="text-sm w-5">{STAT_ICONS[round.stat]}</span>
                <span className="text-xs text-muted flex-1">{STAT_LABELS[round.stat]}</span>
                <span className={`text-sm font-mono font-bold ${round.playerWon ? 'text-green-400' : 'text-red-400'}`}>
                  {round.playerValue}
                </span>
                <span className="text-[10px] text-muted">vs</span>
                <span className={`text-sm font-mono font-bold ${!round.playerWon ? 'text-green-400' : 'text-red-400'}`}>
                  {round.opponentValue}
                </span>
                <span className="text-sm">{round.playerWon ? '✓' : '✗'}</span>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-sm"
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
            >
              {gameResult === 'lose' ? 'Try Again' : 'Battle Again'}
            </motion.button>
            <Link href="/games" className="px-6 py-3 rounded-xl bg-surface border border-border text-sm font-medium flex items-center">
              Games Hub
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== BATTLE SCREEN =====
  const totalRounds = Math.min(5, playerDeck.length);

  return (
    <motion.div
      className="min-h-screen px-4 pt-6 pb-24"
      animate={screenShake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Close call pulse overlay */}
      <AnimatePresence>
        {closeCall && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.3) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Score bar */}
      <div className="flex items-center justify-between mb-3">
        <Link href="/games" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted text-sm">
          &larr;
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-green-400"
              key={`ps-${playerScore}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
            >
              {playerScore}
            </motion.div>
            <div className="text-[9px] text-muted uppercase">You</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-foreground">
              Round {currentRound}
            </div>
            <div className="text-[10px] text-muted">of {totalRounds}</div>
          </div>
          <div className="text-center">
            <motion.div
              className="text-2xl font-bold text-red-400"
              key={`as-${aiScore}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
            >
              {aiScore}
            </motion.div>
            <div className="text-[9px] text-muted uppercase">AI</div>
          </div>
        </div>
        <div className="px-2 py-1 rounded-md text-[10px] font-bold" style={{ backgroundColor: DIFFICULTY_CONFIG[difficulty].color + '20', color: DIFFICULTY_CONFIG[difficulty].color }}>
          {DIFFICULTY_CONFIG[difficulty].label}
        </div>
      </div>

      {/* Round progress */}
      <div className="flex justify-center gap-2 mb-5">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map(r => (
          <motion.div
            key={r}
            className="w-8 h-2 rounded-full"
            style={{
              backgroundColor: rounds[r - 1]
                ? rounds[r - 1].playerWon ? '#22c55e' : '#ef4444'
                : r === currentRound ? '#818cf840' : '#1f2237',
              border: r === currentRound ? '1px solid #818cf8' : '1px solid transparent',
            }}
            animate={r === currentRound ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Instruction / result banner */}
      <AnimatePresence mode="wait">
        {phase === 'stat-select' && (
          <motion.p
            key="select"
            className="text-center text-sm text-accent font-medium mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Choose your stat to attack!
          </motion.p>
        )}
        {(phase === 'reveal' || phase === 'round-result') && roundResult && (
          <motion.div
            key="result"
            className="text-center mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: roundResult === 'win' ? '#22c55e' : '#ef4444' }}
            >
              {roundResult === 'win' ? 'You Win This Round!' : 'AI Wins This Round!'}
            </span>
            {closeCall && (
              <motion.span
                className="block text-xs text-yellow-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Close call!
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* VS layout */}
      <div className="flex items-start justify-center gap-3">
        {playerCard && (
          <BattleCard
            card={playerCard}
            isPlayer
            isActive={phase === 'stat-select'}
            showStats
            selectedStat={selectedStat}
            result={roundResult ? (roundResult === 'win' ? 'win' : 'lose') : null}
            onSelectStat={phase === 'stat-select' ? handleStatSelect : undefined}
          />
        )}

        <div className="flex flex-col items-center justify-center pt-16">
          <motion.div
            className="text-xl font-bold text-muted"
            animate={phase === 'reveal' ? { scale: [1, 1.5, 1], rotate: [0, 10, -10, 0] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            VS
          </motion.div>
        </div>

        {aiCard && (
          <BattleCard
            card={aiCard}
            isPlayer={false}
            isActive={false}
            showStats={phase === 'reveal' || phase === 'round-result' || !!selectedStat}
            revealedStat={selectedStat}
            result={roundResult ? (roundResult === 'win' ? 'lose' : 'win') : null}
          />
        )}
      </div>

      {/* Stat comparison reveal */}
      <AnimatePresence>
        {(phase === 'reveal' || phase === 'round-result') && selectedStat && playerCard && aiCard && (
          <motion.div
            className="mt-6 px-4 py-3 rounded-xl bg-surface border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-xs text-muted mb-1">{playerCard.character}</div>
                <motion.div
                  className="text-3xl font-bold font-mono"
                  style={{ color: roundResult === 'win' ? '#22c55e' : '#ef4444' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.2 }}
                >
                  {getEffectiveStat(getCharacterStats(playerCard.character), selectedStat, playerCard.scarcity, playerCard.parallel)}
                </motion.div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl">{STAT_ICONS[selectedStat]}</span>
                <span className="text-[10px] font-bold uppercase mt-0.5" style={{ color: STAT_COLORS[selectedStat] }}>
                  {STAT_LABELS[selectedStat]}
                </span>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted mb-1">{aiCard.character}</div>
                <motion.div
                  className="text-3xl font-bold font-mono"
                  style={{ color: roundResult === 'lose' ? '#22c55e' : '#ef4444' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.4 }}
                >
                  {getEffectiveStat(getCharacterStats(aiCard.character), selectedStat, aiCard.scarcity, aiCard.parallel)}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
