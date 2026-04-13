'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
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
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { Card, Scarcity, SCARCITY_CONFIG } from '@/data/types';
import { getOwnedCards } from '@/lib/store';
import {
  BinderState,
  BinderPage,
  getBinderState,
  initBinderFromCards,
  saveBinderState,
  syncBinderWithOwned,
  addBinderPage,
  renameBinderPage,
} from '@/lib/binder-store';

// ---------------------------------------------------------------------------
// Sortable card slot inside a binder page
// ---------------------------------------------------------------------------
function SortableBinderCard({
  card,
  isDraggingThis,
}: {
  card: Card;
  isDraggingThis: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative touch-manipulation"
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 1.06 }}
      layout
    >
      <CardItem card={card} size="lg" interactive={false} />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Empty slot placeholder (for Zeigarnik effect or empty binder slots)
// ---------------------------------------------------------------------------
function EmptySlot({ index, isMissing, card }: { index: number; isMissing?: boolean; card?: Card }) {
  if (isMissing && card) {
    return (
      <Link href={`/card/${card.id}`}>
        <div className="w-[260px] h-[364px] rounded-xl border-2 border-dashed border-border/30 flex flex-col items-center justify-center bg-surface/20 hover:bg-surface/40 transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          <span className="text-5xl opacity-15 group-hover:opacity-30 transition-opacity">
            {card.symbol}
          </span>
          <span className="text-[10px] text-muted/30 mt-2 group-hover:text-muted/60 text-center px-3 truncate max-w-full">
            {card.character}
          </span>
          <span className="text-[9px] text-accent/0 group-hover:text-accent/80 mt-1.5 transition-colors font-semibold">
            Find this card
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="w-[260px] h-[364px] rounded-xl border-2 border-dashed border-border/20 flex items-center justify-center bg-surface/10">
      <span className="text-border/30 text-sm font-mono">{index + 1}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editable page title
// ---------------------------------------------------------------------------
function EditableTitle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft.trim()) onChange(draft.trim());
          else setDraft(value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setEditing(false);
            if (draft.trim()) onChange(draft.trim());
          }
          if (e.key === 'Escape') {
            setEditing(false);
            setDraft(value);
          }
        }}
        className="bg-transparent border-b border-accent/50 text-foreground text-sm font-semibold outline-none px-1 py-0.5 w-48"
        maxLength={40}
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="text-sm font-semibold text-foreground hover:text-accent transition-colors flex items-center gap-1.5 group"
    >
      {value}
      <span className="text-muted/0 group-hover:text-muted/60 text-[10px] transition-colors">
        (edit)
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Binder Collection Page
// ---------------------------------------------------------------------------
export default function CollectionPage() {
  // Data loading
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [binder, setBinder] = useState<BinderState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [filterSet, setFilterSet] = useState<string>('all');
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [dragOverPageIndex, setDragOverPageIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    const owned = getOwnedCards();
    setOwnedCards(owned);

    const ownedIds = owned.map(c => c.id);
    let state = getBinderState();
    if (!state) {
      state = initBinderFromCards(ownedIds);
    } else {
      state = syncBinderWithOwned(state, ownedIds);
    }
    setBinder(state);
    setLoaded(true);
  }, []);

  // Sensors — more distance needed to distinguish from taps
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  // Card lookup
  const cardMap = useMemo(() => {
    const map = new Map<string, Card>();
    for (const c of ownedCards) map.set(c.id, c);
    return map;
  }, [ownedCards]);

  // Missing cards for Zeigarnik (when filtering by set)
  const missingCards = useMemo(() => {
    if (filterSet === 'all') return [];
    const ownedIds = new Set(ownedCards.map(c => c.id));
    return ALL_CARDS.filter(c => c.setSlug === filterSet && !ownedIds.has(c.id));
  }, [filterSet, ownedCards]);

  // Filtered pages — when a set filter is active, create virtual pages from filtered cards
  const displayPages = useMemo(() => {
    if (!binder) return [];
    if (filterSet === 'all') return binder.pages;

    // Collect cards matching filter across all pages (maintain binder ordering)
    const filteredIds: string[] = [];
    for (const page of binder.pages) {
      for (const cid of page.cardIds) {
        const card = cardMap.get(cid);
        if (card && card.setSlug === filterSet) {
          filteredIds.push(cid);
        }
      }
    }

    // Add missing cards as "ghost" entries
    const allIds = [...filteredIds, ...missingCards.map(c => `missing:${c.id}`)];

    // Chunk into pages of 6
    const pages: BinderPage[] = [];
    for (let i = 0; i < allIds.length; i += 6) {
      pages.push({
        id: `virtual-${i}`,
        name: SETS.find(s => s.slug === filterSet)?.name || 'Filtered',
        cardIds: allIds.slice(i, i + 6),
      });
    }
    if (pages.length === 0) {
      pages.push({ id: 'virtual-empty', name: 'Empty', cardIds: [] });
    }
    return pages;
  }, [binder, filterSet, cardMap, missingCards]);

  // Clamp page index
  useEffect(() => {
    if (currentPageIndex >= displayPages.length) {
      setCurrentPageIndex(Math.max(0, displayPages.length - 1));
    }
  }, [displayPages.length, currentPageIndex]);

  const currentPage = displayPages[currentPageIndex] || null;
  const isFiltered = filterSet !== 'all';

  // Navigation
  const goToPage = useCallback((idx: number) => {
    setCurrentPageIndex(Math.max(0, Math.min(idx, displayPages.length - 1)));
  }, [displayPages.length]);

  const prevPage = useCallback(() => goToPage(currentPageIndex - 1), [goToPage, currentPageIndex]);
  const nextPage = useCallback(() => goToPage(currentPageIndex + 1), [goToPage, currentPageIndex]);

  // Swipe gestures
  const handleDragEnd_swipe = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 80;
      if (info.offset.x < -threshold && currentPageIndex < displayPages.length - 1) {
        nextPage();
      } else if (info.offset.x > threshold && currentPageIndex > 0) {
        prevPage();
      }
    },
    [currentPageIndex, displayPages.length, nextPage, prevPage]
  );

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevPage, nextPage]);

  // DnD handlers — only active when NOT filtered
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event: DragOverEvent) {
    // Check if dragging near page dots (edge of screen)
    if (!event.active.rect.current.translated) return;
    const x = event.active.rect.current.translated.left;
    const containerWidth = containerRef.current?.offsetWidth || 1000;
    if (x < 60 && currentPageIndex > 0) {
      setDragOverPageIndex(currentPageIndex - 1);
    } else if (x > containerWidth - 60 && currentPageIndex < displayPages.length - 1) {
      setDragOverPageIndex(currentPageIndex + 1);
    } else {
      setDragOverPageIndex(null);
    }
  }

  function handleDragEndDnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!binder || isFiltered) return;

    // If we dragged to an edge page indicator, move card between pages
    if (dragOverPageIndex !== null && dragOverPageIndex !== currentPageIndex) {
      const fromPage = binder.pages[currentPageIndex];
      const toPage = binder.pages[dragOverPageIndex];
      if (fromPage && toPage && toPage.cardIds.length < 6) {
        const cardId = active.id as string;
        const newFromIds = fromPage.cardIds.filter(id => id !== cardId);
        const newToIds = [...toPage.cardIds, cardId];
        const newPages = binder.pages.map(p => {
          if (p.id === fromPage.id) return { ...p, cardIds: newFromIds };
          if (p.id === toPage.id) return { ...p, cardIds: newToIds };
          return p;
        });
        const next = { ...binder, pages: newPages };
        saveBinderState(next);
        setBinder(next);
        setDragOverPageIndex(null);
        // Jump to that page
        setCurrentPageIndex(dragOverPageIndex);
        return;
      }
    }
    setDragOverPageIndex(null);

    if (!over || active.id === over.id) return;

    // Reorder within page
    const page = binder.pages[currentPageIndex];
    if (!page) return;
    const oldIdx = page.cardIds.indexOf(active.id as string);
    const newIdx = page.cardIds.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;

    const newIds = arrayMove(page.cardIds, oldIdx, newIdx);
    const newPages = binder.pages.map(p =>
      p.id === page.id ? { ...p, cardIds: newIds } : p
    );
    const next = { ...binder, pages: newPages };
    saveBinderState(next);
    setBinder(next);
  }

  // Page management
  function handleAddPage() {
    if (!binder) return;
    const next = addBinderPage(binder, `My Collection ${binder.pages.length + 1}`);
    setBinder(next);
    setCurrentPageIndex(next.pages.length - 1);
  }

  function handleRenamePage(pageId: string, name: string) {
    if (!binder) return;
    const next = renameBinderPage(binder, pageId, name);
    setBinder(next);
  }

  // Active card for overlay
  const activeCard = activeId ? cardMap.get(activeId as string) : null;

  // Stats
  const scarcityCounts = ownedCards.reduce((acc, c) => {
    acc[c.scarcity] = (acc[c.scarcity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = ownedCards.reduce((sum, c) => sum + c.price, 0);
  const setCompletion = SETS.map(s => ({
    ...s,
    owned: new Set(ownedCards.filter(c => c.setSlug === s.slug).map(c => c.character)).size,
  }));

  if (!loaded || !binder) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">My Collection</h1>
          <p className="text-sm text-muted">
            {ownedCards.length} cards &middot; {binder.pages.length} pages &middot; ${totalValue.toFixed(0)} value
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as Scarcity[]).map(s => {
            const count = scarcityCounts[s] || 0;
            if (!count) return null;
            return (
              <div
                key={s}
                className="px-2 py-1 rounded-lg text-xs font-mono"
                style={{
                  color: SCARCITY_CONFIG[s].color,
                  background: `${SCARCITY_CONFIG[s].color}15`,
                }}
              >
                {count} {SCARCITY_CONFIG[s].label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Set filter tabs */}
      <section className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => { setFilterSet('all'); setCurrentPageIndex(0); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterSet === 'all'
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'bg-surface text-muted hover:text-foreground border border-border hover:border-border/60'
            }`}
          >
            All Pages ({ownedCards.length})
          </button>
          {SETS.map(s => {
            const count = ownedCards.filter(c => c.setSlug === s.slug).length;
            const comp = setCompletion.find(sc => sc.slug === s.slug);
            const pct = comp ? Math.round((comp.owned / comp.cardCount) * 100) : 0;
            return (
              <button
                key={s.slug}
                onClick={() => { setFilterSet(s.slug); setCurrentPageIndex(0); }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  filterSet === s.slug
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-surface text-muted hover:text-foreground border border-border hover:border-border/60'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
                <span className="opacity-60">{count}/{s.cardCount}</span>
                <span className="text-[9px] opacity-50">{pct}%</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Binder */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEndDnd}
      >
        {/* Page title + nav */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={prevPage}
              disabled={currentPageIndex === 0}
              className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground hover:bg-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {currentPage && !isFiltered && (
              <EditableTitle
                value={currentPage.name}
                onChange={(name) => handleRenamePage(currentPage.id, name)}
              />
            )}
            {currentPage && isFiltered && (
              <span className="text-sm font-semibold text-foreground">
                {SETS.find(s => s.slug === filterSet)?.icon} {SETS.find(s => s.slug === filterSet)?.name}
              </span>
            )}

            <button
              onClick={nextPage}
              disabled={currentPageIndex >= displayPages.length - 1}
              className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground hover:bg-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted font-mono">
              {currentPageIndex + 1} / {displayPages.length}
            </span>
            {!isFiltered && (
              <button
                onClick={handleAddPage}
                className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors border border-accent/20"
              >
                + New Page
              </button>
            )}
          </div>
        </div>

        {/* The binder page */}
        <div className="relative overflow-hidden">
          {/* Edge indicators for cross-page drag */}
          {activeId && currentPageIndex > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dragOverPageIndex === currentPageIndex - 1 ? 0.8 : 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-14 z-20 bg-gradient-to-r from-accent/30 to-transparent rounded-l-2xl flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          )}
          {activeId && currentPageIndex < displayPages.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dragOverPageIndex === currentPageIndex + 1 ? 0.8 : 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-14 z-20 bg-gradient-to-l from-accent/30 to-transparent rounded-r-2xl flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          )}

          {/* Swipeable binder page area */}
          <motion.div
            key={currentPageIndex}
            drag={!activeId ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd_swipe}
            className="touch-pan-y"
          >
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-surface/80 to-surface/40 border border-border/40 min-h-[440px] backdrop-blur-sm relative">
              {/* Binder texture overlay */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              }} />

              {/* Binder ring holes decoration */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-16 opacity-20">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-3 h-8 rounded-full border-2 border-border/60" />
                ))}
              </div>

              {currentPage && (
                <SortableContext
                  items={currentPage.cardIds.filter(id => !id.startsWith('missing:'))}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center ml-4">
                    {/* Render actual cards */}
                    {currentPage.cardIds.map((cid, i) => {
                      if (cid.startsWith('missing:')) {
                        const realId = cid.replace('missing:', '');
                        const card = ALL_CARDS.find(c => c.id === realId);
                        return (
                          <motion.div
                            key={cid}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <EmptySlot index={i} isMissing card={card} />
                          </motion.div>
                        );
                      }
                      const card = cardMap.get(cid);
                      if (!card) return <EmptySlot key={cid} index={i} />;
                      return (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                        >
                          {isFiltered ? (
                            <Link href={`/card/${card.id}`}>
                              <CardItem card={card} size="lg" interactive={false} />
                            </Link>
                          ) : (
                            <SortableBinderCard
                              card={card}
                              isDraggingThis={activeId === card.id}
                            />
                          )}
                        </motion.div>
                      );
                    })}

                    {/* Fill empty slots to maintain grid */}
                    {Array.from({ length: Math.max(0, 6 - currentPage.cardIds.length) }).map((_, i) => (
                      <motion.div
                        key={`empty-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (currentPage.cardIds.length + i) * 0.05 }}
                      >
                        <EmptySlot index={currentPage.cardIds.length + i} />
                      </motion.div>
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </motion.div>
        </div>

        {/* DragOverlay for smooth card following cursor */}
        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeCard && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05, rotate: 2 }}
              className="drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
            >
              <CardItem card={activeCard} size="lg" interactive={false} />
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Page indicator dots */}
      <div className="flex items-center justify-center gap-2 mt-6 mb-4">
        {displayPages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => goToPage(i)}
            className={`transition-all rounded-full ${
              i === currentPageIndex
                ? 'w-8 h-2.5 bg-accent shadow-lg shadow-accent/30'
                : 'w-2.5 h-2.5 bg-border/50 hover:bg-border'
            }`}
          />
        ))}
      </div>

      {/* Quick set completion strip */}
      <section className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {setCompletion.map(s => {
          const pct = Math.round((s.owned / s.cardCount) * 100);
          return (
            <button
              key={s.slug}
              onClick={() => { setFilterSet(s.slug); setCurrentPageIndex(0); }}
              className={`p-3 rounded-xl border transition-all ${
                filterSet === s.slug
                  ? 'bg-accent/10 border-accent/30'
                  : 'bg-surface border-border hover:border-border/60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs font-semibold truncate">{s.name.split(' ').slice(0, 2).join(' ')}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: pct === 100
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : pct > 50
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : 'linear-gradient(90deg, #818cf8, #a78bfa)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted">{s.owned}/{s.cardCount}</span>
                <span className="text-[10px] font-bold" style={{
                  color: pct === 100 ? '#f59e0b' : pct > 50 ? '#22c55e' : '#818cf8',
                }}>
                  {pct}%
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Empty state */}
      {ownedCards.length === 0 && (
        <div className="flex flex-col items-center justify-center h-60 text-center mt-8">
          <span className="text-4xl mb-3">📦</span>
          <h3 className="text-lg font-semibold mb-1">Your collection is empty</h3>
          <p className="text-sm text-muted mb-4">Open packs to start building your collection of legendary characters.</p>
          <Link
            href="/packs"
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors"
          >
            Open Your First Pack
          </Link>
        </div>
      )}
    </div>
  );
}
