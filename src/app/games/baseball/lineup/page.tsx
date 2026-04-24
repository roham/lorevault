'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BASEBALL_CARDS,
  getAllHitters,
  getAllPitchers,
} from '@/data/baseball-stats';
import { BaseballCard, FieldPosition, HitterStats, PitcherStats } from '@/lib/baseball/types';

// ===== Types =====

type SetFilter = 'all' | 'baker-street' | 'enchanted' | 'wonderland' | 'gothic' | 'olympus' | 'asgard';
type RoleFilter = 'all' | 'hitters' | 'pitchers';
type SortMode = 'cost-desc' | 'cost-asc' | 'name';

interface LineupSlots {
  C: string | null;
  '1B': string | null;
  '2B': string | null;
  SS: string | null;
  '3B': string | null;
  LF: string | null;
  CF: string | null;
  RF: string | null;
}

interface SavedLineup {
  name: string;
  hitters: { cardId: string; position: FieldPosition; order: number }[];
  pitcherId: string;
  totalCost: number;
  createdAt: number;
}

const POSITIONS: FieldPosition[] = ['C', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF'];

const SET_FILTERS: { value: SetFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'baker-street', label: 'Baker St.' },
  { value: 'enchanted', label: 'Enchanted' },
  { value: 'wonderland', label: 'Wonderland' },
  { value: 'gothic', label: 'Gothic' },
  { value: 'olympus', label: 'Olympus' },
  { value: 'asgard', label: 'Asgard' },
];

const SET_ID_MAP: Record<string, SetFilter> = {
  'bb-sherlock-holmes': 'baker-street', 'bb-dr-watson': 'baker-street',
  'bb-professor-moriarty': 'baker-street', 'bb-irene-adler': 'baker-street',
  'bb-mrs-hudson': 'baker-street', 'bb-inspector-lestrade': 'baker-street',
  'bb-the-hound': 'baker-street', 'bb-mycroft-holmes': 'baker-street',
  'bb-sebastian-moran': 'baker-street', 'bb-the-red-headed-league': 'baker-street',
  'bb-the-dancing-men': 'baker-street', 'bb-the-baker-street-irregulars': 'baker-street',
  'bb-snow-white': 'enchanted', 'bb-the-evil-queen': 'enchanted',
  'bb-the-huntsman': 'enchanted', 'bb-rapunzel': 'enchanted',
  'bb-cinderella': 'enchanted', 'bb-red-riding-hood': 'enchanted',
  'bb-hansel': 'enchanted', 'bb-gretel': 'enchanted',
  'bb-the-frog-prince': 'enchanted', 'bb-rumpelstiltskin': 'enchanted',
  'bb-sleeping-beauty': 'enchanted', 'bb-the-seven-dwarfs': 'enchanted',
  'bb-the-pied-piper': 'enchanted', 'bb-beauty': 'enchanted',
  'bb-the-beast': 'enchanted', 'bb-jack': 'enchanted',
  'bb-puss-in-boots': 'enchanted', 'bb-bluebeard': 'enchanted',
  'bb-alice': 'wonderland', 'bb-the-cheshire-cat': 'wonderland',
  'bb-the-mad-hatter': 'wonderland', 'bb-the-queen-of-hearts': 'wonderland',
  'bb-the-white-rabbit': 'wonderland', 'bb-the-caterpillar': 'wonderland',
  'bb-tweedledee-tweedledum': 'wonderland', 'bb-the-march-hare': 'wonderland',
  'bb-the-dormouse': 'wonderland', 'bb-the-jabberwock': 'wonderland',
  'bb-the-knave-of-hearts': 'wonderland', 'bb-the-mock-turtle': 'wonderland',
  'bb-the-duchess': 'wonderland', 'bb-the-king-of-hearts': 'wonderland',
  'bb-count-dracula': 'gothic', 'bb-frankensteins-monster': 'gothic',
  'bb-dr-jekyll': 'gothic', 'bb-mr-hyde': 'gothic',
  'bb-the-phantom': 'gothic', 'bb-dorian-gray': 'gothic',
  'bb-the-invisible-man': 'gothic', 'bb-victor-frankenstein': 'gothic',
  'bb-mina-harker': 'gothic', 'bb-van-helsing': 'gothic',
  'bb-the-headless-horseman': 'gothic', 'bb-dr-moreau': 'gothic',
  'bb-the-time-traveller': 'gothic', 'bb-captain-nemo': 'gothic',
  'bb-quasimodo': 'gothic', 'bb-renfield': 'gothic',
  'bb-lucy-westenra': 'gothic', 'bb-dracula-pitcher': 'gothic',
  'bb-odysseus': 'olympus', 'bb-achilles': 'olympus',
  'bb-medusa': 'olympus', 'bb-perseus': 'olympus',
  'bb-athena': 'olympus', 'bb-zeus': 'olympus',
  'bb-poseidon': 'olympus', 'bb-hades': 'olympus',
  'bb-hercules': 'olympus', 'bb-helen-of-troy': 'olympus',
  'bb-icarus': 'olympus', 'bb-prometheus': 'olympus',
  'bb-orpheus': 'olympus', 'bb-circe': 'olympus',
  'bb-the-minotaur': 'olympus', 'bb-ares': 'olympus',
  'bb-apollo': 'olympus', 'bb-pandora': 'olympus',
  'bb-odin': 'asgard', 'bb-thor': 'asgard',
  'bb-loki': 'asgard', 'bb-freya': 'asgard',
  'bb-fenrir': 'asgard', 'bb-heimdall': 'asgard',
  'bb-baldur': 'asgard', 'bb-hel': 'asgard',
  'bb-jormungandr': 'asgard', 'bb-tyr': 'asgard',
  'bb-sigurd': 'asgard', 'bb-brynhildr': 'asgard',
  'bb-ragnar': 'asgard', 'bb-the-norns': 'asgard',
  'bb-huginn-muninn': 'asgard', 'bb-sif': 'asgard',
  'bb-idun': 'asgard', 'bb-skadi': 'asgard',
  'bb-surtr': 'asgard',
};

function getCardSet(card: BaseballCard): SetFilter {
  return SET_ID_MAP[card.id] || 'all';
}

function getSpeedLabel(speed: number): string {
  if (speed >= 17) return 'A';
  if (speed >= 13) return 'B';
  return 'C';
}

// ===== Auto-Fill Algorithm =====

function autoFillLineup(
  existingSlots: LineupSlots,
  existingPitcher: string | null,
  usedIds: Set<string>,
): { slots: LineupSlots; pitcher: string | null; battingOrder: string[] } {
  const slots = { ...existingSlots };
  let pitcher = existingPitcher;
  const used = new Set(usedIds);
  let totalCost = 0;

  // Calculate existing cost
  for (const pos of POSITIONS) {
    const id = slots[pos];
    if (id) {
      const card = BASEBALL_CARDS.find(c => c.id === id);
      if (card) totalCost += card.stats.pointCost;
    }
  }
  if (pitcher) {
    const pCard = BASEBALL_CARDS.find(c => c.id === pitcher);
    if (pCard) totalCost += pCard.stats.pointCost;
  }

  // Fill pitcher first if empty
  if (!pitcher) {
    const pitchers = getAllPitchers()
      .filter(c => !used.has(c.id))
      .sort((a, b) => {
        const aCost = a.stats.pointCost;
        const bCost = b.stats.pointCost;
        // Prefer mid-range pitcher (18-22 cost)
        const aScore = Math.abs(aCost - 20);
        const bScore = Math.abs(bCost - 20);
        return aScore - bScore;
      });
    if (pitchers.length > 0) {
      pitcher = pitchers[0].id;
      totalCost += pitchers[0].stats.pointCost;
      used.add(pitchers[0].id);
    }
  }

  // Fill empty hitter slots — greedy by efficiency (stat value / cost)
  const hitters = getAllHitters()
    .filter(c => !used.has(c.id))
    .map(c => {
      const s = c.stats as HitterStats;
      const value = s.onBase + s.power * 0.5 + (s.speed - 10) * 0.3 + s.defense;
      return { card: c, efficiency: value / Math.max(1, s.pointCost) };
    })
    .sort((a, b) => b.efficiency - a.efficiency);

  for (const pos of POSITIONS) {
    if (slots[pos]) continue;
    const remaining = 150 - totalCost;
    const pick = hitters.find(h => !used.has(h.card.id) && h.card.stats.pointCost <= remaining);
    if (pick) {
      slots[pos] = pick.card.id;
      totalCost += pick.card.stats.pointCost;
      used.add(pick.card.id);
    }
  }

  // Build batting order from filled slots
  const battingOrder = POSITIONS
    .map(pos => slots[pos])
    .filter((id): id is string => id !== null);

  return { slots, pitcher, battingOrder };
}

// ===== Card Pool Item =====

function CardPoolItem({
  card,
  isSelected,
  isDisabled,
  onTap,
}: {
  card: BaseballCard;
  isSelected: boolean;
  isDisabled: boolean;
  onTap: () => void;
}) {
  const stats = card.stats;
  const isPitcher = stats.type === 'pitcher';

  return (
    <button
      onClick={onTap}
      disabled={isDisabled}
      className={`w-full text-left rounded-xl border p-3 transition-all ${
        isSelected
          ? 'border-accent/40 bg-accent/5 opacity-50 cursor-not-allowed'
          : isDisabled
          ? 'border-border/30 bg-surface/30 opacity-30 cursor-not-allowed'
          : 'border-border hover:border-accent/30 bg-surface hover:bg-surface/80 cursor-pointer active:scale-[0.97]'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-bold truncate mr-2">{card.character}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
          isPitcher ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {isPitcher ? 'P' : 'H'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted">
        {isPitcher ? (
          <>
            <span>CTL <span className="text-white font-bold">{(stats as PitcherStats).control}</span></span>
            <span>FLD <span className="text-white font-bold">{(stats as PitcherStats).fielding}</span></span>
          </>
        ) : (
          <>
            <span>OB <span className="text-white font-bold">{(stats as HitterStats).onBase}</span></span>
            <span>PWR <span className="text-white font-bold">{(stats as HitterStats).power}</span></span>
            <span>SPD <span className={`font-bold ${
              (stats as HitterStats).speed >= 17 ? 'text-green-400' :
              (stats as HitterStats).speed >= 13 ? 'text-yellow-400' : 'text-muted'
            }`}>{getSpeedLabel((stats as HitterStats).speed)}</span></span>
            <span>DEF <span className="text-white font-bold">+{(stats as HitterStats).defense}</span></span>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-muted/60">{getCardSet(card).replace('-', ' ')}</span>
        <span className={`text-xs font-bold ${
          stats.pointCost >= 20 ? 'text-yellow-400' :
          stats.pointCost >= 14 ? 'text-white' : 'text-muted'
        }`}>
          {stats.pointCost} pts
        </span>
      </div>
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-accent text-lg">&#10003;</span>
        </div>
      )}
    </button>
  );
}

// ===== Position Slot =====

function PositionSlot({
  position,
  cardId,
  onRemove,
  onSelect,
}: {
  position: FieldPosition | 'P';
  cardId: string | null;
  onRemove: () => void;
  onSelect: () => void;
}) {
  const card = cardId ? BASEBALL_CARDS.find(c => c.id === cardId) : null;

  return (
    <div
      onClick={card ? undefined : onSelect}
      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
        card
          ? 'border-border bg-surface'
          : 'border-dashed border-border/40 bg-surface/20 cursor-pointer hover:border-accent/30'
      }`}
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
        position === 'P'
          ? 'bg-red-500/10 border border-red-500/20 text-red-400'
          : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
      }`}>
        {position}
      </span>
      {card ? (
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-xs font-bold truncate block">{card.character}</span>
            <span className="text-[10px] text-muted">{card.stats.pointCost} pts</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="w-6 h-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-[10px] hover:bg-red-500/20 transition-colors flex-shrink-0"
          >
            &#10005;
          </button>
        </div>
      ) : (
        <span className="text-[10px] text-muted/40">Tap to assign</span>
      )}
    </div>
  );
}

// ===== Main Page =====

export default function LineupBuilderPage() {
  // Filters
  const [setFilter, setSetFilter] = useState<SetFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('cost-desc');

  // Lineup state
  const [slots, setSlots] = useState<LineupSlots>({
    C: null, '1B': null, '2B': null, SS: null,
    '3B': null, LF: null, CF: null, RF: null,
  });
  const [pitcher, setPitcher] = useState<string | null>(null);
  const [battingOrder, setBattingOrder] = useState<string[]>([]);
  const [lineupName, setLineupName] = useState('');
  const [assigningPosition, setAssigningPosition] = useState<FieldPosition | 'P' | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Derived
  const usedCardIds = useMemo(() => {
    const ids = new Set<string>();
    for (const pos of POSITIONS) {
      if (slots[pos]) ids.add(slots[pos]!);
    }
    if (pitcher) ids.add(pitcher);
    return ids;
  }, [slots, pitcher]);

  const totalCost = useMemo(() => {
    let cost = 0;
    for (const pos of POSITIONS) {
      const id = slots[pos];
      if (id) {
        const card = BASEBALL_CARDS.find(c => c.id === id);
        if (card) cost += card.stats.pointCost;
      }
    }
    if (pitcher) {
      const pCard = BASEBALL_CARDS.find(c => c.id === pitcher);
      if (pCard) cost += pCard.stats.pointCost;
    }
    return cost;
  }, [slots, pitcher]);

  const remainingBudget = 150 - totalCost;
  const overBudget = totalCost > 150;
  const filledHitters = POSITIONS.filter(p => slots[p] !== null).length;
  const isComplete = filledHitters === 9 && pitcher !== null && battingOrder.length === 9;

  // Filtered + sorted card pool
  const filteredCards = useMemo(() => {
    let cards = [...BASEBALL_CARDS];

    // Set filter
    if (setFilter !== 'all') {
      cards = cards.filter(c => getCardSet(c) === setFilter);
    }

    // Role filter
    if (roleFilter === 'hitters') {
      cards = cards.filter(c => c.stats.type === 'hitter');
    } else if (roleFilter === 'pitchers') {
      cards = cards.filter(c => c.stats.type === 'pitcher');
    }

    // If assigning a position, filter by type
    if (assigningPosition === 'P') {
      cards = cards.filter(c => c.stats.type === 'pitcher');
    } else if (assigningPosition) {
      cards = cards.filter(c => c.stats.type === 'hitter');
    }

    // Sort
    switch (sortMode) {
      case 'cost-desc':
        cards.sort((a, b) => b.stats.pointCost - a.stats.pointCost);
        break;
      case 'cost-asc':
        cards.sort((a, b) => a.stats.pointCost - b.stats.pointCost);
        break;
      case 'name':
        cards.sort((a, b) => a.character.localeCompare(b.character));
        break;
    }

    return cards;
  }, [setFilter, roleFilter, sortMode, assigningPosition]);

  // Assign a card to a position
  const assignCard = useCallback((cardId: string) => {
    const card = BASEBALL_CARDS.find(c => c.id === cardId);
    if (!card) return;

    if (assigningPosition === 'P') {
      if (card.stats.type !== 'pitcher') return;
      setPitcher(cardId);
      setAssigningPosition(null);
    } else if (assigningPosition) {
      if (card.stats.type !== 'hitter') return;
      const newSlots = { ...slots };
      newSlots[assigningPosition] = cardId;
      setSlots(newSlots);
      // Add to batting order
      setBattingOrder(prev => {
        const without = prev.filter(id => id !== cardId);
        return [...without, cardId];
      });
      setAssigningPosition(null);
    }
  }, [assigningPosition, slots]);

  // Remove card from position
  const removeFromPosition = useCallback((position: FieldPosition | 'P') => {
    if (position === 'P') {
      setPitcher(null);
    } else {
      const cardId = slots[position];
      setSlots(prev => ({ ...prev, [position]: null }));
      if (cardId) {
        setBattingOrder(prev => prev.filter(id => id !== cardId));
      }
    }
  }, [slots]);

  // Auto-fill
  const handleAutoFill = useCallback(() => {
    const result = autoFillLineup(slots, pitcher, usedCardIds);
    setSlots(result.slots);
    setPitcher(result.pitcher);
    setBattingOrder(result.battingOrder);
  }, [slots, pitcher, usedCardIds]);

  // Save lineup
  const handleSave = useCallback(() => {
    const name = lineupName.trim() || 'My Lineup';
    const hitters = POSITIONS.map((pos, i) => ({
      cardId: slots[pos]!,
      position: pos,
      order: battingOrder.indexOf(slots[pos]!) + 1,
    })).filter(h => h.cardId);

    const lineup: SavedLineup = {
      name,
      hitters,
      pitcherId: pitcher!,
      totalCost,
      createdAt: Date.now(),
    };

    try {
      const existing: SavedLineup[] = JSON.parse(localStorage.getItem('pdb-lineups') || '[]');
      existing.push(lineup);
      if (existing.length > 10) existing.shift();
      localStorage.setItem('pdb-lineups', JSON.stringify(existing));
      setSaveMessage('Lineup saved!');
      setTimeout(() => setSaveMessage(null), 2000);
    } catch {
      setSaveMessage('Could not save — private browsing?');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  }, [lineupName, slots, pitcher, battingOrder, totalCost]);

  // Clear
  const handleClear = useCallback(() => {
    setSlots({ C: null, '1B': null, '2B': null, SS: null, '3B': null, LF: null, CF: null, RF: null });
    setPitcher(null);
    setBattingOrder([]);
    setAssigningPosition(null);
  }, []);

  // Move batting order
  const moveBatterUp = useCallback((index: number) => {
    if (index <= 0) return;
    setBattingOrder(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-bg/90 backdrop-blur-sm border-b border-border/30 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Link href="/games/baseball" className="text-xs text-muted hover:text-accent transition-colors">
            &larr; Baseball
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="text-[10px] px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleAutoFill}
              className="text-[10px] px-2 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors"
            >
              Auto-fill
            </button>
          </div>
        </div>

        {/* Budget Meter */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors ${
                  overBudget ? 'bg-red-500' :
                  totalCost > 130 ? 'bg-yellow-500' :
                  'bg-accent'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalCost / 150) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
          <motion.span
            className={`text-sm font-bold font-mono min-w-[70px] text-right ${
              overBudget ? 'text-red-400' : totalCost > 130 ? 'text-yellow-400' : 'text-white'
            }`}
            animate={overBudget ? { x: [0, -2, 2, -2, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            {totalCost}/150
          </motion.span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-0">
        {/* Left: Card Pool */}
        <div className="px-4 pt-4">
          {/* Assign mode banner */}
          <AnimatePresence>
            {assigningPosition && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3"
              >
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-between">
                  <span className="text-xs text-accent font-bold">
                    Select {assigningPosition === 'P' ? 'a pitcher' : `a hitter for ${assigningPosition}`}
                  </span>
                  <button
                    onClick={() => setAssigningPosition(null)}
                    className="text-[10px] text-muted hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {SET_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setSetFilter(f.value)}
                className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                  setFilter === f.value
                    ? 'border-accent/40 bg-accent/10 text-accent font-bold'
                    : 'border-border/40 text-muted hover:border-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {(['all', 'hitters', 'pitchers'] as RoleFilter[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`text-[10px] px-2 py-1 rounded-md border transition-all capitalize ${
                    roleFilter === r
                      ? 'border-accent/40 bg-accent/10 text-accent font-bold'
                      : 'border-border/40 text-muted hover:border-border'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="text-[10px] bg-surface border border-border rounded-md px-2 py-1 text-muted ml-auto"
            >
              <option value="cost-desc">Cost: High-Low</option>
              <option value="cost-asc">Cost: Low-High</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
            {filteredCards.map(card => (
              <CardPoolItem
                key={card.id}
                card={card}
                isSelected={usedCardIds.has(card.id)}
                isDisabled={
                  usedCardIds.has(card.id) ||
                  (!overBudget && card.stats.pointCost > remainingBudget && !usedCardIds.has(card.id))
                }
                onTap={() => {
                  if (usedCardIds.has(card.id)) return;
                  if (assigningPosition) {
                    assignCard(card.id);
                  } else {
                    // Quick assign: if pitcher and no pitcher yet, assign directly
                    if (card.stats.type === 'pitcher' && !pitcher) {
                      setPitcher(card.id);
                    } else if (card.stats.type === 'hitter') {
                      // Find first empty hitter slot
                      const emptyPos = POSITIONS.find(p => !slots[p]);
                      if (emptyPos) {
                        setSlots(prev => ({ ...prev, [emptyPos]: card.id }));
                        setBattingOrder(prev => [...prev, card.id]);
                      }
                    } else if (card.stats.type === 'pitcher') {
                      // Swap pitcher
                      setPitcher(card.id);
                    }
                  }
                }}
              />
            ))}
          </div>

          <p className="text-[10px] text-muted/40 text-center mb-4">
            {filteredCards.length} cards shown
          </p>
        </div>

        {/* Right: Lineup Panel */}
        <div className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:overflow-y-auto px-4 pt-4 lg:border-l lg:border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Your Lineup</h2>
            <span className="text-[10px] text-muted">{filledHitters}/9 hitters</span>
          </div>

          {/* Lineup Name */}
          <input
            type="text"
            value={lineupName}
            onChange={(e) => setLineupName(e.target.value)}
            placeholder="Team name..."
            className="w-full mb-3 px-3 py-2 rounded-lg bg-surface border border-border text-sm placeholder:text-muted/30 focus:border-accent/40 focus:outline-none transition-colors"
          />

          {/* Position Slots */}
          <div className="space-y-1.5 mb-4">
            {POSITIONS.map(pos => (
              <PositionSlot
                key={pos}
                position={pos}
                cardId={slots[pos]}
                onRemove={() => removeFromPosition(pos)}
                onSelect={() => setAssigningPosition(pos)}
              />
            ))}
            <div className="mt-2">
              <PositionSlot
                position="P"
                cardId={pitcher}
                onRemove={() => removeFromPosition('P')}
                onSelect={() => setAssigningPosition('P')}
              />
            </div>
          </div>

          {/* Batting Order */}
          {battingOrder.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Batting Order</h3>
              <div className="space-y-1">
                {battingOrder.map((cardId, i) => {
                  const card = BASEBALL_CARDS.find(c => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div key={cardId} className="flex items-center gap-2 p-1.5 rounded-md bg-surface/50 border border-border/30">
                      <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-xs truncate flex-1">{card.character}</span>
                      <button
                        onClick={() => moveBatterUp(i)}
                        disabled={i === 0}
                        className="text-[10px] text-muted hover:text-white disabled:opacity-20 transition-colors"
                      >
                        &#9650;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="space-y-2">
            <button
              onClick={handleSave}
              disabled={!isComplete || overBudget}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                isComplete && !overBudget
                  ? 'bg-accent text-bg hover:bg-accent/90 cursor-pointer'
                  : 'bg-surface text-muted/30 border border-border cursor-not-allowed'
              }`}
            >
              {overBudget
                ? 'Over Budget'
                : !isComplete
                ? `Fill all slots to save (${filledHitters}/9 H${pitcher ? ' + P' : ''})`
                : 'Save Lineup'
              }
            </button>

            <AnimatePresence>
              {saveMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-center text-accent"
                >
                  {saveMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
