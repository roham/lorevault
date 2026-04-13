'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { Card } from '@/data/types';
import { getOwnedCards } from '@/lib/store';
import {
  Showcase,
  ShowcaseSlot,
  ShowcaseTheme,
  ShowcaseCardSize,
  SHOWCASE_THEMES,
  getShowcases,
  createShowcase,
  updateShowcase,
  deleteShowcase,
  setActiveShowcaseId,
  getActiveShowcaseId,
} from '@/lib/showcase-store';

// ---------------------------------------------------------------------------
// Size mapping for bento grid
// ---------------------------------------------------------------------------
const BENTO_SIZE_MAP: Record<ShowcaseCardSize, { cols: string; cardSize: 'md' | 'lg' | 'xl' }> = {
  '1x1': { cols: 'col-span-1 row-span-1', cardSize: 'md' },
  '2x1': { cols: 'col-span-2 row-span-1', cardSize: 'lg' },
  '2x2': { cols: 'col-span-2 row-span-2', cardSize: 'xl' },
};

// ---------------------------------------------------------------------------
// Sortable showcase card
// ---------------------------------------------------------------------------
function SortableShowcaseCard({
  slot,
  card,
  onResize,
  onRemove,
}: {
  slot: ShowcaseSlot;
  card: Card;
  onResize: (cardId: string, size: ShowcaseCardSize) => void;
  onRemove: (cardId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.cardId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const bento = BENTO_SIZE_MAP[slot.size];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${bento.cols} relative group`}
      layout
    >
      <div className="flex items-center justify-center h-full">
        <CardItem card={card} size={bento.cardSize} interactive={false} />
      </div>
      {/* Controls overlay */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {/* Resize buttons */}
        {(['1x1', '2x1', '2x2'] as ShowcaseCardSize[]).map(sz => (
          <button
            key={sz}
            onClick={(e) => { e.stopPropagation(); onResize(slot.cardId, sz); }}
            className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-colors ${
              slot.size === sz
                ? 'bg-accent text-white'
                : 'bg-black/60 text-white/60 hover:bg-black/80'
            }`}
          >
            {sz}
          </button>
        ))}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(slot.cardId); }}
          className="w-5 h-5 rounded bg-red-500/80 text-white text-[10px] flex items-center justify-center hover:bg-red-500"
        >
          x
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Theme selector
// ---------------------------------------------------------------------------
function ThemeSelector({
  current,
  onChange,
}: {
  current: ShowcaseTheme;
  onChange: (t: ShowcaseTheme) => void;
}) {
  return (
    <div className="flex gap-2">
      {(Object.keys(SHOWCASE_THEMES) as ShowcaseTheme[]).map(t => {
        const theme = SHOWCASE_THEMES[t];
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              current === t
                ? 'ring-2 ring-offset-2 ring-offset-background'
                : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              color: theme.accent,
              ...(current === t ? { ringColor: theme.accent } : {}),
            }}
          >
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Showcase Builder
// ---------------------------------------------------------------------------
export default function ShowcasePage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedShowcase, setSelectedShowcase] = useState<string | null>(null);
  const [showCardPicker, setShowCardPicker] = useState(false);
  const [dragId, setDragId] = useState<UniqueIdentifier | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Load
  useEffect(() => {
    setOwnedCards(getOwnedCards());
    const all = getShowcases();
    setShowcases(all);
    const active = getActiveShowcaseId();
    if (active && all.find(s => s.id === active)) {
      setSelectedShowcase(active);
    } else if (all.length > 0) {
      setSelectedShowcase(all[0].id);
    }
  }, []);

  const cardMap = useMemo(() => {
    const map = new Map<string, Card>();
    for (const c of ownedCards) map.set(c.id, c);
    return map;
  }, [ownedCards]);

  const current = showcases.find(s => s.id === selectedShowcase) || null;

  // Cards not in current showcase
  const availableCards = useMemo(() => {
    if (!current) return ownedCards;
    const usedIds = new Set(current.slots.map(s => s.cardId));
    return ownedCards.filter(c => !usedIds.has(c.id));
  }, [ownedCards, current]);

  // Actions
  function handleCreate() {
    const sc = createShowcase(`Showcase ${showcases.length + 1}`);
    const all = getShowcases();
    setShowcases(all);
    setSelectedShowcase(sc.id);
    setActiveShowcaseId(sc.id);
  }

  function handleDelete(id: string) {
    deleteShowcase(id);
    const all = getShowcases();
    setShowcases(all);
    setSelectedShowcase(all.length > 0 ? all[0].id : null);
  }

  function handleSelectShowcase(id: string) {
    setSelectedShowcase(id);
    setActiveShowcaseId(id);
  }

  function handleThemeChange(theme: ShowcaseTheme) {
    if (!current) return;
    updateShowcase(current.id, { theme });
    setShowcases(getShowcases());
  }

  function handleAddCard(cardId: string) {
    if (!current) return;
    const updated = current.slots.length < 12;
    if (!updated) return;
    const newSlots = [...current.slots, { cardId, size: '1x1' as ShowcaseCardSize }];
    updateShowcase(current.id, { slots: newSlots });
    setShowcases(getShowcases());
  }

  function handleRemoveCard(cardId: string) {
    if (!current) return;
    const newSlots = current.slots.filter(s => s.cardId !== cardId);
    updateShowcase(current.id, { slots: newSlots });
    setShowcases(getShowcases());
  }

  function handleResize(cardId: string, size: ShowcaseCardSize) {
    if (!current) return;
    const newSlots = current.slots.map(s =>
      s.cardId === cardId ? { ...s, size } : s
    );
    updateShowcase(current.id, { slots: newSlots });
    setShowcases(getShowcases());
  }

  function handleDragStart(event: DragStartEvent) {
    setDragId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    setDragId(null);
    if (!current || !event.over || event.active.id === event.over.id) return;
    const oldIdx = current.slots.findIndex(s => s.cardId === event.active.id);
    const newIdx = current.slots.findIndex(s => s.cardId === (event.over?.id));
    if (oldIdx === -1 || newIdx === -1) return;
    const newSlots = arrayMove(current.slots, oldIdx, newIdx);
    updateShowcase(current.id, { slots: newSlots });
    setShowcases(getShowcases());
  }

  function handleStartRename(id: string, currentName: string) {
    setEditingName(id);
    setNameInput(currentName);
    setTimeout(() => nameInputRef.current?.focus(), 50);
  }

  function handleFinishRename() {
    if (editingName && nameInput.trim()) {
      updateShowcase(editingName, { name: nameInput.trim() });
      setShowcases(getShowcases());
    }
    setEditingName(null);
  }

  function handleSetAsProfileHero() {
    if (!current) return;
    setActiveShowcaseId(current.id);
    // Also store in legacy showcase IDs for backward compat with profile page
    const ids = current.slots.map(s => s.cardId);
    localStorage.setItem('lorevault_showcase', JSON.stringify(ids));
  }

  const dragCard = dragId ? cardMap.get(dragId as string) : null;
  const theme = current ? SHOWCASE_THEMES[current.theme] : SHOWCASE_THEMES['dark-glass'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/collection" className="text-muted hover:text-foreground transition-colors text-sm">
              Collection
            </Link>
            <span className="text-muted/30">/</span>
            <h1 className="text-2xl font-bold">Showcase Builder</h1>
          </div>
          <p className="text-sm text-muted">Build and customize showcases to display your best cards</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
        >
          + New Showcase
        </button>
      </div>

      {/* Showcase tabs */}
      {showcases.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {showcases.map(sc => (
            <div key={sc.id} className="flex-shrink-0 relative group">
              {editingName === sc.id ? (
                <input
                  ref={nameInputRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={handleFinishRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFinishRename();
                    if (e.key === 'Escape') setEditingName(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-surface border border-accent/50 text-sm text-foreground outline-none w-40"
                />
              ) : (
                <button
                  onClick={() => handleSelectShowcase(sc.id)}
                  onDoubleClick={() => handleStartRename(sc.id, sc.name)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    selectedShowcase === sc.id
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'bg-surface text-muted border border-border hover:border-border/60'
                  }`}
                >
                  {sc.name}
                  <span className="ml-2 text-[10px] opacity-60">({sc.slots.length})</span>
                </button>
              )}
              {selectedShowcase === sc.id && showcases.length > 1 && (
                <button
                  onClick={() => handleDelete(sc.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/80 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No showcases */}
      {showcases.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <span className="text-4xl mb-3">✨</span>
          <h3 className="text-lg font-semibold mb-1">No showcases yet</h3>
          <p className="text-sm text-muted mb-4">Create your first showcase to display your best cards.</p>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm"
          >
            Create Showcase
          </button>
        </div>
      )}

      {/* Active showcase builder */}
      {current && (
        <>
          {/* Theme selector */}
          <div className="flex items-center justify-between mb-4">
            <ThemeSelector current={current.theme} onChange={handleThemeChange} />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCardPicker(!showCardPicker)}
                className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors border border-accent/20"
              >
                {showCardPicker ? 'Done Adding' : '+ Add Cards'}
              </button>
              <button
                onClick={handleSetAsProfileHero}
                className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors border border-green-500/20"
              >
                Set as Profile Hero
              </button>
            </div>
          </div>

          {/* The showcase display */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div
              className="p-6 sm:p-8 rounded-2xl min-h-[400px] relative overflow-hidden"
              style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
              }}
            >
              {/* Noise texture */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              }} />

              {/* Glassmorphism inner glow */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                background: `radial-gradient(ellipse at 50% 0%, ${theme.accent}08 0%, transparent 50%)`,
              }} />

              {current.slots.length === 0 ? (
                <div className="flex items-center justify-center h-80 text-center">
                  <div>
                    <span className="text-3xl block mb-2 opacity-30">+</span>
                    <p className="text-sm text-muted/50">Add cards to your showcase</p>
                    <button
                      onClick={() => setShowCardPicker(true)}
                      className="mt-3 px-4 py-2 rounded-lg bg-white/5 text-foreground/60 text-xs hover:bg-white/10 transition-colors"
                    >
                      Browse Cards
                    </button>
                  </div>
                </div>
              ) : (
                <SortableContext
                  items={current.slots.map(s => s.cardId)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto relative z-10">
                    {current.slots.map((slot) => {
                      const card = cardMap.get(slot.cardId);
                      if (!card) return null;
                      return (
                        <SortableShowcaseCard
                          key={slot.cardId}
                          slot={slot}
                          card={card}
                          onResize={handleResize}
                          onRemove={handleRemoveCard}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              )}
            </div>

            <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
              {dragCard && (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
                >
                  <CardItem card={dragCard} size="lg" interactive={false} />
                </motion.div>
              )}
            </DragOverlay>
          </DndContext>

          {/* Card picker */}
          <AnimatePresence>
            {showCardPicker && (
              <motion.section
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-6 rounded-2xl bg-surface border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Your Cards ({availableCards.length} available)</h3>
                    <span className="text-xs text-muted">{current.slots.length}/12 slots used</span>
                  </div>
                  <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto">
                    {availableCards.map((card) => (
                      <motion.div
                        key={card.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAddCard(card.id)}
                        className="cursor-pointer relative group"
                      >
                        <CardItem card={card} size="sm" interactive={false} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-xl transition-colors">
                          <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity font-bold">+</span>
                        </div>
                      </motion.div>
                    ))}
                    {availableCards.length === 0 && (
                      <p className="text-sm text-muted py-4">All cards are in this showcase, or you need to open more packs.</p>
                    )}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
