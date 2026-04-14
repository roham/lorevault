'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { StatKey, STAT_LABELS, STAT_ICONS, STAT_COLORS, getCharacterStats, getEffectiveStat } from '@/data/stats';
import { getOwnedCards, addOwnedCards } from '@/lib/store';
import { getCardArtPath, getCardBasePath } from '@/lib/card-image';

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

/** Card art image with fallback chain: variant → base → gradient only */
function CardArtImg({ card }: { card: Card }) {
  const artPath = getCardArtPath(card);
  const basePath = getCardBasePath(card);
  const [src, setSrc] = useState(artPath);
  const [hasArt, setHasArt] = useState(true);
  if (!hasArt) return null;
  return (
    <img
      src={src}
      alt={card.character}
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => {
        if (src !== basePath) setSrc(basePath);
        else setHasArt(false);
      }}
      loading="lazy"
      draggable={false}
    />
  );
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
    // Pick 3 showcase cards for the background
    const showcaseCards = playerDeck.slice(0, 3);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
        {/* Atmospheric background — radial gradient */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1028 0%, #080c18 50%, #000000 100%)' }} />

        {/* Floating card art behind text — fanned arrangement */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {showcaseCards.map((card, i) => (
            <motion.div
              key={card.id}
              className="absolute w-[140px] aspect-[5/7] rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                border: `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}20`,
                left: `${(i - 1) * 60 - 70}px`,
                top: `${Math.abs(i - 1) * 15 - 100}px`,
                transform: `rotate(${(i - 1) * 8}deg)`,
                opacity: 0.15,
                filter: 'blur(1px)',
              }}
              animate={{
                y: [0, -8, 0],
                rotate: [(i - 1) * 8, (i - 1) * 8 + 2, (i - 1) * 8],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <CardArtImg card={card} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center relative z-10"
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
            Battle to build your collection.
          </motion.p>
          <motion.h1
            className="type-display text-foreground mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Battle.
            <br />
            Win.
            <br />
            Collect.
          </motion.h1>
          <motion.button
            onClick={startBattle}
            className="text-sm font-bold tracking-wide py-4 px-10 rounded-xl"
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
        style={{
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          background: 'radial-gradient(ellipse at 50% 30%, #1a1028 0%, #080c18 50%, #000000 100%)',
        }}
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
                  className="w-[110px] aspect-[5/7] rounded-xl overflow-hidden relative"
                  style={{
                    background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})`,
                    border: `1.5px solid ${SCARCITY_CONFIG[card.scarcity].color}50`,
                    boxShadow: `0 4px 24px ${card.gradientFrom}60, 0 0 12px ${SCARCITY_CONFIG[card.scarcity].color}15`,
                  }}
                >
                  <CardArtImg card={card} />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 40%, transparent 60%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
                    <div className="text-[9px] text-white/90 truncate font-semibold drop-shadow-lg">{card.character}</div>
                    <div className="text-[8px] truncate drop-shadow" style={{ color: SCARCITY_CONFIG[card.scarcity].color }}>
                      {SCARCITY_CONFIG[card.scarcity].label}
                    </div>
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
        style={{
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          background: 'radial-gradient(ellipse at 50% 30%, #1a1028 0%, #080c18 50%, #000000 100%)',
        }}
      >
        {/* Round header */}
        <div className="text-center mb-4">
          <span className="text-[10px] font-mono text-muted/50">
            Round {battle.currentRound + 1} &mdash; Choose a stat
          </span>
        </div>

        {/* Cards face-off — your card vs mystery */}
        <div className="flex items-center justify-center gap-4 mb-5">
          {/* Player card — art visible */}
          <div className="text-center">
            <div
              className="w-[80px] aspect-[5/7] rounded-lg overflow-hidden relative mb-1"
              style={{
                background: `linear-gradient(145deg, ${battle.playerPick.gradientFrom}, ${battle.playerPick.gradientTo})`,
                border: `1.5px solid ${SCARCITY_CONFIG[battle.playerPick.scarcity].color}`,
                boxShadow: `0 2px 16px ${SCARCITY_CONFIG[battle.playerPick.scarcity].color}20`,
              }}
            >
              <CardArtImg card={battle.playerPick} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
            </div>
            <span className="text-[8px] text-foreground/70 truncate block w-[80px]">{battle.playerPick.character}</span>
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-red-500/30 to-transparent" />
            <span className="text-[10px] font-bold text-red-400/60 tracking-wider">VS</span>
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-red-500/30 to-transparent" />
          </div>

          {/* AI card — face down with glow */}
          <div className="text-center">
            <div
              className="w-[80px] aspect-[5/7] rounded-lg overflow-hidden relative mb-1 flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #12132a, #080918)',
                border: '1.5px solid rgba(255,255,255,0.06)',
                boxShadow: '0 2px 16px rgba(239,68,68,0.08)',
              }}
            >
              <motion.span
                className="text-2xl opacity-20"
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 2, repeat: Infinity }}
              >?</motion.span>
            </div>
            <span className="text-[8px] text-muted/40">Unknown</span>
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
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a1028 0%, #080c18 50%, #000000 100%)' }}
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

        {/* Cards revealed side by side — with art */}
        <div className="flex items-start gap-3 mb-6">
          {/* Player card with stat */}
          <motion.div
            className="text-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="w-[120px] aspect-[5/7] rounded-xl overflow-hidden relative mb-2"
              style={{
                background: `linear-gradient(145deg, ${battle.playerPick.gradientFrom}, ${battle.playerPick.gradientTo})`,
                border: `2px solid ${won ? '#22c55e' : 'rgba(239,68,68,0.4)'}`,
                boxShadow: won ? '0 0 30px rgba(34,197,94,0.25)' : 'none',
              }}
            >
              <CardArtImg card={battle.playerPick} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div className="absolute bottom-1.5 left-0 right-0 text-center">
                <span className="text-[9px] text-white/80 font-medium drop-shadow-lg">{battle.playerPick.character}</span>
              </div>
            </div>
            <motion.div
              className="text-xl font-bold font-mono"
              style={{ color: STAT_COLORS[battle.selectedStat] }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {playerVal}
            </motion.div>
          </motion.div>

          {/* VS divider */}
          <div className="pt-12 flex flex-col items-center gap-1">
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <span className="text-[10px] font-bold text-muted/30 tracking-wider">VS</span>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          {/* AI card revealed — dramatic flip with art */}
          <motion.div
            className="text-center"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <motion.div
              className="w-[120px] aspect-[5/7] rounded-xl overflow-hidden relative mb-2"
              style={{
                background: `linear-gradient(145deg, ${battle.aiPick.gradientFrom}, ${battle.aiPick.gradientTo})`,
                border: `2px solid ${!won ? '#22c55e' : 'rgba(239,68,68,0.4)'}`,
                boxShadow: !won ? '0 0 30px rgba(34,197,94,0.25)' : 'none',
              }}
              initial={{ rotateY: 90, scale: 0.9 }}
              animate={{ rotateY: 0, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 120, delay: 0.3 }}
            >
              <CardArtImg card={battle.aiPick} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div className="absolute bottom-1.5 left-0 right-0 text-center">
                <span className="text-[9px] text-white/80 font-medium drop-shadow-lg">{battle.aiPick.character}</span>
              </div>
            </motion.div>
            {/* AI stat revealed with suspense delay */}
            <motion.div
              className="text-xl font-bold font-mono"
              style={{ color: STAT_COLORS[battle.selectedStat] }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              {aiVal}
            </motion.div>
          </motion.div>
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
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          background: 'radial-gradient(ellipse at 50% 40%, #1a1028 0%, #080c18 50%, #000000 100%)',
        }}
      >
        {/* Victory glow burst */}
        {won && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ background: 'radial-gradient(circle at 50% 50%, #22c55e40, transparent 70%)' }}
          />
        )}

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
              <motion.div
                className="w-48 aspect-[5/7] rounded-xl overflow-hidden relative mb-3"
                style={{
                  background: `linear-gradient(145deg, ${reward.gradientFrom}, ${reward.gradientTo})`,
                  border: `2px solid ${SCARCITY_CONFIG[reward.scarcity].color}`,
                  boxShadow: `0 0 60px ${SCARCITY_CONFIG[reward.scarcity].color}35, 0 8px 32px rgba(0,0,0,0.5)`,
                }}
                initial={{ rotateY: 90, scale: 0.6 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 100 }}
              >
                <CardArtImg card={reward} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 30%, transparent 60%)' }} />
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)' }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ delay: 0.9, duration: 0.8, ease: 'easeInOut' }}
                />
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
              </motion.div>
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
                      <CardArtImg card={card} />
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
