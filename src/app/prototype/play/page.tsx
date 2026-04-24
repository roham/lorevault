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
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{ background: '#050810' }}
      >
        {/* Atmospheric layers — faction fog */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.07), transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Round indicator */}
        <div className="text-center pt-5 relative z-10">
          <span className="text-[9px] font-mono text-muted/30 tracking-[0.2em]">ROUND {battle.currentRound + 1}</span>
          <div className="flex justify-center gap-2 mt-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-6 h-1 rounded-full"
                style={{
                  background: i < battle.currentRound ? '#22c55e'
                    : i === battle.currentRound ? '#ef4444'
                    : 'rgba(255,255,255,0.08)',
                }} />
            ))}
          </div>
          <div className="flex justify-center gap-5 mt-1.5 text-[9px] font-mono">
            <span style={{ color: '#22c55e' }}>{battle.playerScore}</span>
            <span className="text-muted/15">&bull;</span>
            <span style={{ color: '#ef4444' }}>{battle.aiScore}</span>
          </div>
        </div>

        {/* Arena — vertical axis of opposition */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6 relative z-10">
          {/* AI card — top, face-down, menacing conic border */}
          <motion.div
            className="text-center"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="w-[140px] aspect-[5/7] rounded-xl relative mx-auto"
              style={{ boxShadow: '0 0 40px rgba(220,38,38,0.12), 0 8px 32px rgba(0,0,0,0.5)' }}>
              <motion.div
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{ padding: '2px', background: 'conic-gradient(from 0deg, transparent 0%, rgba(220,38,38,0.3) 25%, transparent 50%, rgba(220,38,38,0.15) 75%, transparent 100%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-full h-full rounded-[10px] bg-[#0a0b18] flex items-center justify-center">
                  <motion.span className="text-3xl text-white/10"
                    animate={{ opacity: [0.06, 0.18, 0.06], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2.5, repeat: Infinity }}>?</motion.span>
                </div>
              </motion.div>
            </div>
            <span className="text-[8px] text-red-400/25 mt-1.5 block tracking-[0.15em]">CHALLENGER</span>
          </motion.div>

          {/* VS glow — pulsing energy */}
          <motion.div className="relative w-16 h-5 flex items-center justify-center"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent 70%)' }} />
            <span className="text-[8px] font-bold text-amber-500/25 tracking-[0.3em]">VS</span>
          </motion.div>

          {/* Player card — bottom, larger, glowing */}
          <motion.div
            className="text-center"
            initial={{ y: 40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="w-[140px] aspect-[5/7] rounded-xl overflow-hidden relative mx-auto"
              style={{
                background: `linear-gradient(145deg, ${battle.playerPick.gradientFrom}, ${battle.playerPick.gradientTo})`,
                border: `2px solid ${SCARCITY_CONFIG[battle.playerPick.scarcity].color}`,
                boxShadow: `0 0 40px ${SCARCITY_CONFIG[battle.playerPick.scarcity].color}30, 0 8px 32px rgba(0,0,0,0.5)`,
                filter: 'brightness(1.1) saturate(1.15)',
              }}>
              <CardArtImg card={battle.playerPick} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 45%)' }} />
              <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2">
                <div className="text-[10px] text-white/90 font-semibold truncate drop-shadow-lg">{battle.playerPick.character}</div>
                <div className="text-[8px] truncate drop-shadow" style={{ color: SCARCITY_CONFIG[battle.playerPick.scarcity].color }}>
                  {SCARCITY_CONFIG[battle.playerPick.scarcity].label}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stat picker — compact pills anchored to bottom */}
        <div className="px-4 relative z-10" style={{ paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}>
          <motion.div className="text-center mb-2.5"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <span className="text-[8px] text-muted/25 tracking-[0.2em]">CHOOSE YOUR STAT</span>
          </motion.div>
          {(() => {
            const statVals = battle.availableStats.map(s => getCardStat(battle.playerPick!, s));
            const bestIdx = statVals.indexOf(Math.max(...statVals));
            return (
              <div className="flex gap-2 justify-center">
                {battle.availableStats.map((stat, i) => {
                  const val = statVals[i];
                  const isBest = i === bestIdx;
                  return (
                    <motion.button
                      key={stat}
                      onClick={() => selectStat(stat)}
                      className="flex-1 max-w-[110px] flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl"
                      style={{
                        background: isBest ? `${STAT_COLORS[stat]}10` : 'rgba(255,255,255,0.02)',
                        border: isBest ? `1px solid ${STAT_COLORS[stat]}25` : '1px solid rgba(255,255,255,0.04)',
                        boxShadow: isBest ? `0 0 20px ${STAT_COLORS[stat]}08` : 'none',
                      }}
                      whileTap={{ scale: 0.93 }}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className="text-lg font-bold font-mono" style={{ color: STAT_COLORS[stat] }}>{val}</span>
                      <span className="text-[9px] text-foreground/40 tracking-wide">{STAT_LABELS[stat]}</span>
                      <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ background: STAT_COLORS[stat] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            );
          })()}
        </div>
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
    const margin = Math.abs(playerVal - aiVal);
    // Counterfactual: which available stat would have won for the player?
    const counterfactualStat = !won ? battle.availableStats.find(s => {
      if (s === battle.selectedStat) return false;
      const pv = getCardStat(battle.playerPick!, s);
      const av = getCardStat(battle.aiPick!, s);
      return pv > av;
    }) : null;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: '#050810' }}
        onClick={nextRound}
        role="button"
        tabIndex={0}
      >
        {/* Atmospheric layers — match arena */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.05), transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05), transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />

        {/* Heartbeat pulse during tension hold */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.04), transparent 50%)' }}
          animate={{ scale: [1, 1.04, 1, 1.04, 1], opacity: [0, 0.6, 0, 0.6, 0] }}
          transition={{ duration: 1.6, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' }}
        />

        {/* Impact flash — at reveal moment (1.2s), not on mount */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.5, 0] }}
          transition={{ duration: 1.5, times: [0, 0.78, 0.83, 1] }}
          style={{ background: won ? '#22c55e' : '#ef4444' }}
        />

        {/* Victory glow — holds, doesn't fade */}
        {won && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            style={{ background: 'radial-gradient(circle at 50% 40%, #22c55e50, transparent 60%)' }}
          />
        )}

        {/* Win particles — bigger, multicolored, timed after impact slam */}
        {won && Array.from({ length: 25 }).map((_, i) => {
          const angle = (i / 25) * 360 + Math.random() * 15;
          const rad = (angle * Math.PI) / 180;
          const dist = 100 + Math.random() * 80;
          const colors = ['#ffd54f', '#22c55e', '#a78bfa', '#ffffff'];
          const size = 2 + Math.random() * 3;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full pointer-events-none z-10"
              style={{
                background: colors[i % colors.length],
                width: `${size}px`,
                height: `${size}px`,
                left: '50%',
                top: '40%',
              }}
              initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
              animate={{
                x: Math.cos(rad) * dist,
                y: Math.sin(rad) * dist - 30,
                opacity: 0,
                scale: 0.15,
              }}
              transition={{ duration: 0.9, delay: 1.25 + i * 0.012, ease: 'easeOut' }}
            />
          );
        })}

        {/* Cards — vertical axis, screen shake on reveal */}
        <motion.div
          className="flex flex-col items-center gap-2 mb-4 relative z-10"
          animate={{ x: [0, 0, 0, -5, 6, -4, 3, -1, 0], y: [0, 0, 0, 3, -4, 2, -2, 1, 0] }}
          transition={{ duration: 0.25, delay: 1.15, ease: 'easeOut' }}
        >
          {/* Player card + stat */}
          <motion.div className="text-center"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <div className="w-[200px] aspect-[5/7] rounded-xl overflow-hidden relative mx-auto mb-2"
              style={{
                background: `linear-gradient(145deg, ${battle.playerPick.gradientFrom}, ${battle.playerPick.gradientTo})`,
                border: `2px solid ${won ? '#22c55e' : 'rgba(239,68,68,0.3)'}`,
                boxShadow: won
                  ? '0 0 40px rgba(34,197,94,0.3), inset 0 -4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                  : 'inset 0 -4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
                transform: 'perspective(800px) rotateX(2deg)',
              }}>
              <CardArtImg card={battle.playerPick} />
              {/* Shine overlay for card depth */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)', mixBlendMode: 'overlay' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div className="absolute bottom-1.5 left-0 right-0 text-center">
                <span className="text-[10px] text-white/85 font-semibold drop-shadow-lg">{battle.playerPick.character}</span>
              </div>
            </div>
            {/* Player stat — appears first, bigger */}
            <motion.div
              className="font-bold font-mono"
              style={{ color: STAT_COLORS[battle.selectedStat], fontSize: won ? '32px' : '22px' }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: won ? [1, 1.3, 1.05] : 1, opacity: won ? 1 : 0.5 }}
              transition={{ delay: 0.3, duration: won ? 0.4 : 0.2 }}
            >
              {playerVal}
            </motion.div>
          </motion.div>

          {/* Stat label between cards */}
          <motion.div className="flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="w-8 h-px bg-white/10" />
            <span className="text-[9px] text-muted/40 tracking-wide">{STAT_LABELS[battle.selectedStat]}</span>
            <div className="w-8 h-px bg-white/10" />
          </motion.div>

          {/* AI card — dramatic delayed slam reveal */}
          <motion.div className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}>
            <motion.div
              className="w-[200px] aspect-[5/7] rounded-xl overflow-hidden relative mx-auto mb-2"
              style={{
                background: `linear-gradient(145deg, ${battle.aiPick.gradientFrom}, ${battle.aiPick.gradientTo})`,
                border: `2px solid ${!won ? '#22c55e' : 'rgba(239,68,68,0.3)'}`,
                boxShadow: !won
                  ? '0 0 40px rgba(34,197,94,0.3), inset 0 -4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                  : 'inset 0 -4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)',
                transform: 'perspective(800px) rotateX(-2deg)',
              }}
              initial={{ rotateY: 90, scale: 0.7 }}
              animate={{ rotateY: 0, scale: [0.7, 1.08, 1] }}
              transition={{ delay: 1.2, duration: 0.35, type: 'spring', stiffness: 150, damping: 12 }}
            >
              <CardArtImg card={battle.aiPick} />
              {/* Shine overlay for card depth */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)', mixBlendMode: 'overlay' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              <div className="absolute bottom-1.5 left-0 right-0 text-center">
                <span className="text-[10px] text-white/85 font-semibold drop-shadow-lg">{battle.aiPick.character}</span>
              </div>
            </motion.div>
            {/* AI stat — slams in after card settles */}
            <motion.div
              className="font-bold font-mono"
              style={{ color: STAT_COLORS[battle.selectedStat], fontSize: !won ? '32px' : '22px' }}
              initial={{ opacity: 0, scale: 2.2 }}
              animate={{ scale: !won ? [1, 1.3, 1.05] : 1, opacity: !won ? 1 : 0.5 }}
              transition={{ delay: 1.6, duration: 0.3 }}
            >
              {aiVal}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Result text — appears after both stats visible */}
        <motion.div
          className="text-center mb-3 relative z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.9, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <h3 className="type-subheading"
            style={{ color: won ? '#22c55e' : '#ef4444' }}>
            {won ? 'You win this round!' : 'AI wins this round'}
          </h3>
          {/* Near-miss margin */}
          <motion.p
            className="text-[11px] mt-1 font-mono"
            style={{ color: won ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
          >
            {won ? `Won by ${margin}` : `Lost by ${margin}`}
          </motion.p>
          {/* Counterfactual on loss — what WOULD have won */}
          {!won && counterfactualStat && (
            <motion.p
              className="text-[10px] mt-1 text-muted/40 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
            >
              {STAT_LABELS[counterfactualStat]} would have won
            </motion.p>
          )}
        </motion.div>

        {/* Score */}
        <motion.div className="flex gap-6 text-sm font-mono relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          <span style={{ color: '#22c55e' }}>You: {battle.playerScore}</span>
          <span style={{ color: '#ef4444' }}>AI: {battle.aiScore}</span>
        </motion.div>

        {/* Tap hint */}
        <motion.div className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 2.6 }}>
          <span className="text-[11px] text-muted/30">
            {battle.playerScore >= 2 || battle.aiScore >= 2 ? 'Tap to see results' : 'Tap for next round'}
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
