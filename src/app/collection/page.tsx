'use client';

import { useState, useMemo } from 'react';
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
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CardItem from '@/components/CardItem';
import { OWNED_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, Parallel, SCARCITY_CONFIG } from '@/data/types';

function SortableShowcaseCard({ card, onRemove }: { card: Card; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group">
      <CardItem card={card} size="md" />
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(card.id); }}
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        x
      </button>
    </div>
  );
}

export default function CollectionPage() {
  const [showcaseIds, setShowcaseIds] = useState<string[]>(() => {
    const owned = OWNED_CARDS;
    // Pick some interesting starter cards for showcase
    const starters = owned.filter(c => c.scarcity === 'legendary' || c.scarcity === 'epic').slice(0, 6);
    return starters.map(c => c.id);
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filterSet, setFilterSet] = useState<string>('all');
  const [filterScarcity, setFilterScarcity] = useState<string>('all');
  const [filterParallel, setFilterParallel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('scarcity');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewSize, setViewSize] = useState<'sm' | 'md'>('sm');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const showcaseCards = useMemo(() => {
    return showcaseIds
      .map(id => OWNED_CARDS.find(c => c.id === id))
      .filter(Boolean) as Card[];
  }, [showcaseIds]);

  const filteredCards = useMemo(() => {
    let cards = OWNED_CARDS.filter(c => !showcaseIds.includes(c.id));

    if (filterSet !== 'all') cards = cards.filter(c => c.setSlug === filterSet);
    if (filterScarcity !== 'all') cards = cards.filter(c => c.scarcity === filterScarcity);
    if (filterParallel !== 'all') cards = cards.filter(c => c.parallel === filterParallel);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.character.toLowerCase().includes(q) ||
        c.set.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'scarcity':
        const order: Record<Scarcity, number> = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        cards.sort((a, b) => order[a.scarcity] - order[b.scarcity]);
        break;
      case 'name':
        cards.sort((a, b) => a.character.localeCompare(b.character));
        break;
      case 'set':
        cards.sort((a, b) => a.set.localeCompare(b.set));
        break;
      case 'serial':
        cards.sort((a, b) => a.serialNumber - b.serialNumber);
        break;
      case 'price':
        cards.sort((a, b) => b.price - a.price);
        break;
    }

    return cards;
  }, [filterSet, filterScarcity, filterParallel, sortBy, searchQuery, showcaseIds]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // If dragging within showcase, reorder
    if (showcaseIds.includes(active.id as string) && showcaseIds.includes(over.id as string)) {
      const oldIndex = showcaseIds.indexOf(active.id as string);
      const newIndex = showcaseIds.indexOf(over.id as string);
      const newIds = [...showcaseIds];
      newIds.splice(oldIndex, 1);
      newIds.splice(newIndex, 0, active.id as string);
      setShowcaseIds(newIds);
    }
  }

  function addToShowcase(cardId: string) {
    if (showcaseIds.length < 8 && !showcaseIds.includes(cardId)) {
      setShowcaseIds([...showcaseIds, cardId]);
    }
  }

  function removeFromShowcase(cardId: string) {
    setShowcaseIds(showcaseIds.filter(id => id !== cardId));
  }

  const activeCard = activeId ? OWNED_CARDS.find(c => c.id === activeId) : null;

  // Stats
  const scarcityCounts = OWNED_CARDS.reduce((acc, c) => {
    acc[c.scarcity] = (acc[c.scarcity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Collection</h1>
          <p className="text-sm text-muted">{OWNED_CARDS.length} cards collected</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(scarcityCounts).map(([scarcity, count]) => (
            <div
              key={scarcity}
              className="px-2 py-1 rounded-lg text-xs font-mono"
              style={{
                color: SCARCITY_CONFIG[scarcity as Scarcity].color,
                background: `${SCARCITY_CONFIG[scarcity as Scarcity].color}15`,
              }}
            >
              {count} {SCARCITY_CONFIG[scarcity as Scarcity].label}
            </div>
          ))}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Showcase Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>✨</span> My Showcase
              <span className="text-xs text-muted font-normal">({showcaseCards.length}/8 slots)</span>
            </h2>
            <p className="text-xs text-muted">Drag cards to rearrange your showcase</p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-dashed border-accent/20 bg-accent/5 min-h-[320px]">
            <SortableContext items={showcaseIds} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap gap-4 justify-center">
                {showcaseCards.map((card) => (
                  <SortableShowcaseCard
                    key={card.id}
                    card={card}
                    onRemove={removeFromShowcase}
                  />
                ))}
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 8 - showcaseCards.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-[200px] h-[280px] rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-muted/40 gap-2"
                  >
                    <span className="text-3xl">+</span>
                    <span className="text-xs">Slot {showcaseCards.length + i + 1}</span>
                  </div>
                ))}
              </div>
            </SortableContext>
          </div>
        </section>

        <DragOverlay>
          {activeCard && <CardItem card={activeCard} size="md" />}
        </DragOverlay>
      </DndContext>

      {/* Set tabs */}
      <section className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setFilterSet('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterSet === 'all' ? 'bg-accent text-white' : 'bg-surface text-muted hover:text-foreground border border-border'
            }`}
          >
            All Sets ({OWNED_CARDS.length})
          </button>
          {SETS.map(s => {
            const count = OWNED_CARDS.filter(c => c.setSlug === s.slug).length;
            return (
              <button
                key={s.slug}
                onClick={() => setFilterSet(s.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  filterSet === s.slug ? 'bg-accent text-white' : 'bg-surface text-muted hover:text-foreground border border-border'
                }`}
              >
                <span>{s.icon}</span> {s.name} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <section className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-accent/50 w-48"
          />

          <select
            value={filterSet}
            onChange={(e) => setFilterSet(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
          >
            <option value="all">All Sets</option>
            {SETS.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>

          <select
            value={filterScarcity}
            onChange={(e) => setFilterScarcity(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
          >
            <option value="all">All Scarcities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>

          <select
            value={filterParallel}
            onChange={(e) => setFilterParallel(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
          >
            <option value="all">All Parallels</option>
            <option value="base">Base</option>
            <option value="silver">Silver Frame</option>
            <option value="gold">Gold Frame</option>
            <option value="holographic">Holographic</option>
            <option value="obsidian">Obsidian</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
          >
            <option value="scarcity">Sort: Scarcity</option>
            <option value="name">Sort: Name</option>
            <option value="set">Sort: Set</option>
            <option value="serial">Sort: Serial #</option>
            <option value="price">Sort: Price</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setViewSize('sm')}
                className={`px-2 py-1.5 text-xs ${viewSize === 'sm' ? 'bg-accent text-white' : 'bg-surface text-muted'}`}
              >
                Small
              </button>
              <button
                onClick={() => setViewSize('md')}
                className={`px-2 py-1.5 text-xs ${viewSize === 'md' ? 'bg-accent text-white' : 'bg-surface text-muted'}`}
              >
                Large
              </button>
            </div>
            <span className="text-xs text-muted">{filteredCards.length} cards</span>
          </div>
        </div>
      </section>

      {/* Card Grid */}
      <section>
        <AnimatePresence mode="popLayout">
          <div className="flex flex-wrap gap-4">
            {filteredCards.map((card, i) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
              >
                <div
                  onClick={() => addToShowcase(card.id)}
                  className={showcaseIds.length < 8 ? 'cursor-pointer' : ''}
                >
                  <CardItem card={card} size={viewSize} />
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredCards.length === 0 && (
          <div className="flex items-center justify-center h-40 text-muted text-sm">
            No cards match your filters
          </div>
        )}
      </section>
    </div>
  );
}
