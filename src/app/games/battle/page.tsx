'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, SCARCITY_CONFIG, BattleRound } from '@/data/types';
import { getOwnedCards, saveBattleRecord, addPackCredits } from '@/lib/store';
import { ALL_CARDS } from '@/data/cards';
import {
  StatKey, STAT_LABELS, STAT_ICONS, STAT_COLORS,
  getCharacterStats, getEffectiveStat, getScarcityBonus, getParallelBonus,
} from '@/data/stats';
import BattleCard from '@/components/games/BattleCard';

type Phase = 'deck-select' | 'battle' | 'stat-select' | 'reveal' | 'result' | 'game-over';

// Seeded random for AI decisions
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// AI picks a card from its pool optimized for the stat it thinks is best
function aiPickCard(pool: Card[], roundSeed: number): { card: Card; preferredStat: StatKey } {
  const rand = seededRandom(roundSeed);
  const stats: StatKey[] = ['power', 'intelligence', 'mystery', 'legend', 'charm'];

  // Evaluate each card's best stat
  let bestCard = pool[0];
  let bestStat: StatKey = 'power';
  let bestValue = 0;

  for (const card of pool) {
    const baseStats = getCharacterStats(card.character);
    for (const stat of stats) {
      const val = getEffectiveStat(baseStats, stat, card.scarcity, card.parallel);
      if (val > bestValue || (val === bestValue && rand() > 0.5)) {
        bestValue = val;
        bestCard = card;
        bestStat = stat;
      }
    }
  }

  // 30% chance AI picks randomly instead (makes it beatable)
  if (rand() < 0.3) {
    const randomIdx = Math.floor(rand() * pool.length);
    bestCard = pool[randomIdx];
    bestStat = stats[Math.floor(rand() * stats.length)];
  }

  return { card: bestCard, preferredStat: bestStat };
}

export default function BattlePage() {
  const [phase, setPhase] = useState<Phase>('deck-select');
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
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
  const [gameSeed] = useState(() => Date.now());
  const aiPoolRef = useRef<Card[]>([]);

  useEffect(() => {
    setOwnedCards(getOwnedCards());
  }, []);

  // Build AI deck from full card pool (excluding player's specific cards)
  const buildAiDeck = useCallback((playerCards: Card[]) => {
    const rand = seededRandom(gameSeed);
    const playerIds = new Set(playerCards.map(c => c.id));

    // AI uses all characters but picks different card variants
    const available = ALL_CARDS.filter(c => !playerIds.has(c.id));
    const shuffled = [...available].sort(() => rand() - 0.5);

    // Pick 5 cards, try for variety
    const deck: Card[] = [];
    const usedCharacters = new Set<string>();
    for (const card of shuffled) {
      if (!usedCharacters.has(card.character) && deck.length < 5) {
        deck.push(card);
        usedCharacters.add(card.character);
      }
    }
    // Fill remaining if needed
    for (const card of shuffled) {
      if (deck.length >= 5) break;
      if (!deck.find(d => d.id === card.id)) {
        deck.push(card);
      }
    }

    return deck.slice(0, 5);
  }, [gameSeed]);

  // Auto-select deck if player has <= 5 cards
  const startBattle = useCallback((selectedCards: Card[]) => {
    const aiCards = buildAiDeck(selectedCards);
    setPlayerDeck(selectedCards);
    setAiDeck(aiCards);
    aiPoolRef.current = [...aiCards];
    setCurrentRound(1);
    setPhase('battle');

    // Set first cards
    setPlayerCard(selectedCards[0]);
    const aiPick = aiPickCard(aiCards, gameSeed + 1);
    setAiCard(aiPick.card);
    setPhase('stat-select');
  }, [buildAiDeck, gameSeed]);

  // Handle stat selection
  const handleStatSelect = useCallback((stat: StatKey) => {
    if (!playerCard || !aiCard || selectedStat) return;
    setSelectedStat(stat);
    setPhase('reveal');

    const playerStats = getCharacterStats(playerCard.character);
    const aiStats = getCharacterStats(aiCard.character);
    const playerValue = getEffectiveStat(playerStats, stat, playerCard.scarcity, playerCard.parallel);
    const aiValue = getEffectiveStat(aiStats, stat, aiCard.scarcity, aiCard.parallel);

    const playerWon = playerValue >= aiValue; // Ties go to player

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

    // After reveal animation, move to next round or game over
    setTimeout(() => {
      if (newPlayerScore >= 3 || newAiScore >= 3 || currentRound >= 5) {
        // Game over
        const won = newPlayerScore > newAiScore;
        const xp = won ? 50 + newPlayerScore * 10 : 10 + newPlayerScore * 5;
        setXpEarned(xp);
        setGameResult(won ? 'win' : 'lose');
        setPhase('game-over');

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

        // Win reward: pack credit
        if (won) {
          addPackCredits(1);
        }
      } else {
        // Next round
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setSelectedStat(null);
        setRoundResult(null);

        // Remove used cards from pools
        const remainingPlayer = playerDeck.filter(c => c.id !== playerCard.id);
        const remainingAi = aiPoolRef.current.filter(c => c.id !== aiCard.id);
        aiPoolRef.current = remainingAi;

        setPlayerCard(remainingPlayer[0] || null);
        if (remainingAi.length > 0) {
          const pick = aiPickCard(remainingAi, gameSeed + nextRound);
          setAiCard(pick.card);
        }
        setPhase('stat-select');
      }
    }, 2000);
  }, [playerCard, aiCard, selectedStat, currentRound, playerScore, aiScore, playerDeck, aiDeck, rounds, gameSeed]);

  // Deck selection UI
  if (phase === 'deck-select') {
    const hasEnoughCards = ownedCards.length >= 3;

    if (!hasEnoughCards) {
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

    // Auto-select up to 5 cards, prefer higher scarcity
    const sortedOwned = [...ownedCards].sort((a, b) => {
      const order = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
      return order[b.scarcity] - order[a.scarcity];
    });
    const autoSelected = sortedOwned.slice(0, 5);

    return (
      <div className="min-h-screen px-4 pt-8 pb-24">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/games" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted">
              <span className="text-sm">&larr;</span>
            </Link>
            <div>
              <h1 className="text-lg font-bold">Card Battle</h1>
              <p className="text-xs text-muted">Best of 5 — pick your stat, beat the AI</p>
            </div>
          </div>

          {/* Your deck preview */}
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-3">Your Deck ({autoSelected.length} cards)</h2>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {autoSelected.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex-shrink-0 w-28 rounded-lg overflow-hidden border-2"
                  style={{ borderColor: SCARCITY_CONFIG[card.scarcity].color }}
                >
                  <div
                    className="h-24 flex flex-col items-center justify-center relative"
                    style={{ background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})` }}
                  >
                    <span className="text-2xl">{card.symbol}</span>
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/80">
                      <div className="text-[9px] font-semibold text-white truncate">{card.character}</div>
                      <div className="text-[7px] font-mono uppercase" style={{ color: SCARCITY_CONFIG[card.scarcity].color }}>
                        {SCARCITY_CONFIG[card.scarcity].label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Start button */}
          <motion.button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => startBattle(autoSelected)}
          >
            ⚔️ Start Battle
          </motion.button>

          <p className="text-center text-xs text-muted mt-3">
            Win to earn XP and pack credits. Rarer cards get stat bonuses.
          </p>
        </motion.div>
      </div>
    );
  }

  // Game Over screen
  if (phase === 'game-over') {
    return (
      <div className="min-h-screen px-4 pt-8 pb-24 flex flex-col items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* Result */}
          <motion.div
            className="text-7xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: gameResult === 'win' ? [0, 10, -10, 0] : [0, -5, 5, 0] }}
            transition={{ duration: 0.6 }}
          >
            {gameResult === 'win' ? '🏆' : '💀'}
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">
            {gameResult === 'win' ? 'Victory!' : 'Defeated'}
          </h1>
          <p className="text-lg text-muted mb-1">{playerScore} — {aiScore}</p>

          {/* XP earned */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span>⭐</span>
            <span className="font-bold text-accent">+{xpEarned} XP</span>
          </motion.div>

          {gameResult === 'win' && (
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 ml-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span>🎁</span>
              <span className="font-bold text-green-400">+1 Pack</span>
            </motion.div>
          )}

          {/* Round recap */}
          <div className="mt-6 mb-8 space-y-2 max-w-sm mx-auto">
            {rounds.map((round, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="text-sm w-5">{STAT_ICONS[round.stat]}</span>
                <span className="text-xs text-muted flex-1">{STAT_LABELS[round.stat]}</span>
                <span className={`text-sm font-mono font-bold ${round.playerWon ? 'text-green-400' : 'text-red-400'}`}>
                  {round.playerValue}
                </span>
                <span className="text-xs text-muted">vs</span>
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
              Battle Again
            </motion.button>
            <Link href="/games" className="px-6 py-3 rounded-xl bg-surface border border-border text-sm font-medium">
              Back to Games
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Battle screen (stat-select + reveal)
  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Score bar */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/games" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-muted text-sm">
          &larr;
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{playerScore}</div>
            <div className="text-[9px] text-muted uppercase">You</div>
          </div>
          <div className="text-sm text-muted font-medium">
            Round {currentRound}/5
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{aiScore}</div>
            <div className="text-[9px] text-muted uppercase">AI</div>
          </div>
        </div>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Round progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map(r => (
          <div
            key={r}
            className="w-3 h-3 rounded-full border"
            style={{
              borderColor: r <= currentRound ? '#818cf8' : '#1f2237',
              backgroundColor: rounds[r - 1]
                ? rounds[r - 1].playerWon ? '#22c55e' : '#ef4444'
                : r === currentRound ? '#818cf820' : 'transparent',
            }}
          />
        ))}
      </div>

      {/* Instruction */}
      <AnimatePresence mode="wait">
        {phase === 'stat-select' && (
          <motion.p
            key="select"
            className="text-center text-sm text-accent font-medium mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Choose your stat to attack!
          </motion.p>
        )}
        {phase === 'reveal' && roundResult && (
          <motion.p
            key="result"
            className="text-center text-lg font-bold mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ color: roundResult === 'win' ? '#22c55e' : '#ef4444' }}
          >
            {roundResult === 'win' ? 'You Win This Round!' : 'AI Wins This Round!'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* VS layout */}
      <div className="flex items-start justify-center gap-3">
        {/* Player card */}
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

        {/* VS divider */}
        <div className="flex flex-col items-center justify-center pt-16">
          <motion.div
            className="text-xl font-bold text-muted"
            animate={{ scale: phase === 'reveal' ? [1, 1.3, 1] : 1 }}
          >
            VS
          </motion.div>
        </div>

        {/* AI card */}
        {aiCard && (
          <BattleCard
            card={aiCard}
            isPlayer={false}
            isActive={false}
            showStats={phase === 'reveal' || !!selectedStat}
            revealedStat={selectedStat}
            result={roundResult ? (roundResult === 'win' ? 'lose' : 'win') : null}
          />
        )}
      </div>

      {/* Stat comparison reveal */}
      <AnimatePresence>
        {phase === 'reveal' && selectedStat && playerCard && aiCard && (
          <motion.div
            className="mt-6 px-4 py-3 rounded-xl bg-surface border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-xs text-muted mb-1">{playerCard.character}</div>
                <div
                  className="text-3xl font-bold font-mono"
                  style={{ color: roundResult === 'win' ? '#22c55e' : '#ef4444' }}
                >
                  {getEffectiveStat(getCharacterStats(playerCard.character), selectedStat, playerCard.scarcity, playerCard.parallel)}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl">{STAT_ICONS[selectedStat]}</span>
                <span className="text-[10px] font-bold uppercase mt-0.5" style={{ color: STAT_COLORS[selectedStat] }}>
                  {STAT_LABELS[selectedStat]}
                </span>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted mb-1">{aiCard.character}</div>
                <div
                  className="text-3xl font-bold font-mono"
                  style={{ color: roundResult === 'lose' ? '#22c55e' : '#ef4444' }}
                >
                  {getEffectiveStat(getCharacterStats(aiCard.character), selectedStat, aiCard.scarcity, aiCard.parallel)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
