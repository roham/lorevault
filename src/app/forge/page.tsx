'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { Card, Scarcity, SCARCITY_CONFIG } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';
import { getOwnedCards, addOwnedCards, getCardMeta } from '@/lib/store';
import {
  getForgeCost,
  canForge,
  getNextRarity,
  isSeasonActive,
  getSeasonTimeRemaining,
  CURRENT_SEASON,
  addForgeEntry,
  getForgeHistory,
} from '@/lib/seasonal-vault';

const SCARCITY_ORDER: Scarcity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

function CountdownChip() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    setTime(getSeasonTimeRemaining());
    const interval = setInterval(() => setTime(getSeasonTimeRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (time.total <= 0) return null;

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono"
      style={{
        background: `linear-gradient(135deg, ${CURRENT_SEASON.gradientFrom}20, ${CURRENT_SEASON.gradientTo}20)`,
        border: `1px solid ${CURRENT_SEASON.gradientFrom}30`,
      }}
    >
      <span>{CURRENT_SEASON.icon}</span>
      <span className="text-orange-400 font-bold">
        {time.days}d {time.hours}h {time.minutes}m
      </span>
      <span className="text-muted text-[10px]">forge discount</span>
    </div>
  );
}

export default function ForgePage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterRarity, setFilterRarity] = useState<Scarcity>('common');
  const [forging, setForging] = useState(false);
  const [forgedCard, setForgedCard] = useState<Card | null>(null);
  const [history, setHistory] = useState<ReturnType<typeof getForgeHistory>>([]);
  const [seasonActive, setSeasonActive] = useState(false);
  const [forgeCost, setForgeCost] = useState(3);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOwnedCards(getOwnedCards());
    setHistory(getForgeHistory());
    setSeasonActive(isSeasonActive());
    setForgeCost(getForgeCost());
    setReady(true);
  }, []);

  // Cards available for forging (filter by selected rarity, exclude legendary)
  const forgeableCards = useMemo(() => {
    return ownedCards.filter(c => c.scarcity === filterRarity && c.scarcity !== 'legendary');
  }, [ownedCards, filterRarity]);

  const toggleCard = (cardId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(cardId)) return prev.filter(id => id !== cardId);
      if (prev.length >= forgeCost) return prev;
      return [...prev, cardId];
    });
  };

  const forgeValidation = useMemo(() => {
    return canForge(selectedIds, ownedCards);
  }, [selectedIds, ownedCards]);

  const nextRarity = getNextRarity(filterRarity);

  const executeForge = async () => {
    if (!forgeValidation.valid || !nextRarity) return;

    setForging(true);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Pick the output card: find a card of the next rarity in a matching set
    const inputCards = ownedCards.filter(c => selectedIds.includes(c.id));
    const inputSet = inputCards[0]?.setSlug;

    // Find candidate output from ALL_CARDS
    const candidates = ALL_CARDS.filter(
      c => c.scarcity === nextRarity && c.setSlug === inputSet && !ownedCards.some(o => o.id === c.id)
    );
    const outputCard = candidates[0] || ALL_CARDS.find(
      c => c.scarcity === nextRarity && !ownedCards.some(o => o.id === c.id)
    );

    if (!outputCard) {
      setForging(false);
      return;
    }

    // Add forged card to collection
    addOwnedCards([outputCard.id]);

    // Record forge event in card meta history
    const meta = getCardMeta();
    if (meta[outputCard.id]) {
      meta[outputCard.id].history.push({
        type: 'pulled' as const,
        date: new Date().toISOString(),
        detail: 'forged',
      });
    }

    // Remove consumed cards from owned (mark in history)
    const currentIds = JSON.parse(localStorage.getItem('lorevault_owned_card_ids') || '[]') as string[];
    const remaining = currentIds.filter((id: string) => !selectedIds.includes(id));
    localStorage.setItem('lorevault_owned_card_ids', JSON.stringify(remaining));

    // Add forge history
    for (const id of selectedIds) {
      if (meta[id]) {
        meta[id].history.push({
          type: 'traded' as const,
          date: new Date().toISOString(),
          detail: 'sacrificed_for_forge',
        });
      }
    }
    localStorage.setItem('lorevault_card_meta', JSON.stringify(meta));

    addForgeEntry({
      id: `forge-${Date.now()}`,
      inputCardIds: selectedIds,
      outputCardId: outputCard.id,
      date: new Date().toISOString(),
      seasonal: seasonActive,
    });

    setForgedCard(outputCard);
    setForging(false);
    setSelectedIds([]);
    setOwnedCards(getOwnedCards());
    setHistory(getForgeHistory());
  };

  if (!ready) return null;

  // Forge complete screen
  if (forgedCard) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <CardItem card={forgedCard} size="xl" interactive={false} forceRevealed />
        </motion.div>

        {/* Glow effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 2, 2.5] }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${SCARCITY_CONFIG[forgedCard.scarcity].color}30, transparent 60%)`,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="text-[10px] uppercase tracking-widest text-accent mb-1">Forged</div>
          <h2 className="text-xl font-bold">{forgedCard.character}</h2>
          <p className="text-sm text-muted">{forgedCard.moment}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span
              className="text-sm font-bold"
              style={{ color: SCARCITY_CONFIG[forgedCard.scarcity].color }}
            >
              {SCARCITY_CONFIG[forgedCard.scarcity].label}
            </span>
            <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold">FORGED</span>
          </div>
        </motion.div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setForgedCard(null)}
            className="px-6 py-3 rounded-2xl bg-accent text-white font-semibold text-sm"
          >
            Forge Again
          </button>
          <Link
            href="/collection"
            className="px-6 py-3 rounded-2xl bg-surface border border-border text-foreground font-semibold text-sm"
          >
            View Collection
          </Link>
        </div>
      </div>
    );
  }

  // Forge animation screen
  if (forging) {
    const inputCards = ownedCards.filter(c => selectedIds.includes(c.id));
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {inputCards.map((card, i) => {
            const angle = (i / inputCards.length) * 360;
            const rad = (angle * Math.PI) / 180;
            return (
              <motion.div
                key={card.id}
                className="absolute"
                initial={{
                  x: Math.cos(rad) * 80,
                  y: Math.sin(rad) * 80,
                  opacity: 1,
                  scale: 0.6,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                  scale: 0,
                  rotate: 360,
                }}
                transition={{ duration: 1.5, ease: 'easeIn' }}
              >
                <CardItem card={card} size="sm" interactive={false} forceRevealed />
              </motion.div>
            );
          })}

          {/* Central flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 3, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, times: [0, 0.6, 1] }}
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: `radial-gradient(circle, ${nextRarity ? SCARCITY_CONFIG[nextRarity].color : '#fff'}80, transparent)`,
            }}
          />
        </div>

        <motion.p
          className="mt-4 text-muted text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Forging...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="type-heading">Forge</h1>
          <p className="text-xs text-muted">Combine cards to forge higher rarities</p>
        </div>
        <Link href="/collection" className="text-xs text-muted hover:text-foreground">
          ← Collection
        </Link>
      </div>

      {/* Season discount banner */}
      {seasonActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${CURRENT_SEASON.gradientFrom}15, ${CURRENT_SEASON.gradientTo}15)`,
            border: `1px solid ${CURRENT_SEASON.gradientFrom}25`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{CURRENT_SEASON.icon}</span>
              <div>
                <div className="text-xs font-bold text-orange-400">{CURRENT_SEASON.subtitle}</div>
                <div className="text-[10px] text-muted">Forge with 2 cards instead of 3!</div>
              </div>
            </div>
            <CountdownChip />
          </div>
        </motion.div>
      )}

      {/* Forge formula */}
      <div className="p-4 rounded-xl bg-surface/60 border border-border/30 mb-4">
        <div className="flex items-center justify-center gap-3 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{forgeCost}</div>
            <div className="text-[9px] text-muted uppercase tracking-wider">
              {filterRarity !== 'legendary' ? SCARCITY_CONFIG[filterRarity].label : '—'}
            </div>
          </div>
          <span className="text-xl text-muted">→</span>
          <div>
            <div className="text-2xl font-bold font-mono" style={{ color: nextRarity ? SCARCITY_CONFIG[nextRarity].color : '#6b7094' }}>
              1
            </div>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: nextRarity ? SCARCITY_CONFIG[nextRarity].color : '#6b7094' }}>
              {nextRarity ? SCARCITY_CONFIG[nextRarity].label : '—'}
            </div>
          </div>
        </div>
        <div className="text-center mt-2 text-[10px] text-muted">
          Input cards are consumed. Forged card inherits the highest Legacy Score.
        </div>
      </div>

      {/* Rarity filter tabs */}
      <div className="flex gap-1.5 mb-4">
        {SCARCITY_ORDER.filter(s => s !== 'legendary').map(s => {
          const count = ownedCards.filter(c => c.scarcity === s).length;
          return (
            <button
              key={s}
              onClick={() => { setFilterRarity(s); setSelectedIds([]); }}
              className={`flex-1 px-2 py-2 rounded-lg text-[10px] font-semibold transition-colors ${
                filterRarity === s
                  ? 'border-2'
                  : 'bg-surface/40 border border-border/30 text-muted'
              }`}
              style={filterRarity === s ? {
                backgroundColor: `${SCARCITY_CONFIG[s].color}15`,
                borderColor: `${SCARCITY_CONFIG[s].color}40`,
                color: SCARCITY_CONFIG[s].color,
              } : undefined}
            >
              {SCARCITY_CONFIG[s].label}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Selection status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-muted">
          Selected: <span className="text-foreground font-bold">{selectedIds.length}/{forgeCost}</span>
        </span>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setSelectedIds([])}
            className="text-[10px] text-red-400 hover:text-red-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Card grid */}
      {forgeableCards.length === 0 ? (
        <div className="p-8 rounded-xl bg-surface/30 border border-border/20 text-center">
          <span className="text-3xl block mb-2">🔨</span>
          <p className="text-sm text-muted">No {SCARCITY_CONFIG[filterRarity].label} cards to forge</p>
          <p className="text-xs text-muted/60 mt-1">Open more packs to find cards</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {forgeableCards.map((card) => {
            const isSelected = selectedIds.includes(card.id);
            return (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCard(card.id)}
                className={`relative rounded-xl p-1 transition-all ${
                  isSelected
                    ? 'ring-2 ring-accent bg-accent/10'
                    : 'hover:bg-surface/40'
                }`}
              >
                <CardItem card={card} size="sm" interactive={false} forceRevealed />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
                  >
                    <span className="text-[10px] text-white font-bold">
                      {selectedIds.indexOf(card.id) + 1}
                    </span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Forge button */}
      <motion.button
        whileTap={forgeValidation.valid ? { scale: 0.96 } : undefined}
        onClick={executeForge}
        disabled={!forgeValidation.valid}
        className={`w-full p-4 rounded-2xl font-bold text-sm transition-all ${
          forgeValidation.valid
            ? 'bg-gradient-to-r from-accent to-purple-500 text-white shadow-lg shadow-accent/20'
            : 'bg-surface/40 text-muted border border-border/30'
        }`}
      >
        {forgeValidation.valid
          ? `Forge ${forgeCost} ${SCARCITY_CONFIG[filterRarity].label} → 1 ${nextRarity ? SCARCITY_CONFIG[nextRarity].label : ''}`
          : forgeValidation.reason || `Select ${forgeCost} cards of the same rarity`
        }
      </motion.button>

      {/* Forge history */}
      {history.length > 0 && (
        <section className="mt-8">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3 block">Forge History</span>
          <div className="space-y-2">
            {history.slice(-5).reverse().map(entry => {
              const output = ALL_CARDS.find(c => c.id === entry.outputCardId);
              return (
                <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface/40 border border-border/20">
                  <span className="text-lg">🔨</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground/90">
                      Forged {output?.character || 'Unknown'}
                    </div>
                    <div className="text-[10px] text-muted">
                      {entry.inputCardIds.length} cards → 1{' '}
                      <span style={{ color: output ? SCARCITY_CONFIG[output.scarcity].color : undefined }}>
                        {output ? SCARCITY_CONFIG[output.scarcity].label : ''}
                      </span>
                      {entry.seasonal && <span className="text-orange-400 ml-1">(seasonal discount)</span>}
                    </div>
                  </div>
                  <span className="text-[9px] text-muted/50">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
