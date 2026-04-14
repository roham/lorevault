'use client';

import { useState, useMemo, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
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
  TouchSensor,
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
import BinderCard, { DragGhostCard } from '@/components/BinderCard';
import CollectionPills, { CollectionTab } from '@/components/collection/CollectionPills';
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
  debouncedSaveBinderState,
  syncBinderWithOwned,
  addBinderPage,
  renameBinderPage,
} from '@/lib/binder-store';

// Lazy-load sub-sections
const ShowcaseSection = lazy(() => import('./showcase/page'));
const SetsSection = lazy(() => import('./sets/page'));
const SmartSection = lazy(() => import('./smart/page'));
const AnalyticsSection = lazy(() => import('./analytics/page'));

// Page transition variants — x only for GPU-composited animation
const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 120 : -120,
    opacity: 0,
  }),
};

// ---------------------------------------------------------------------------
// Sortable card slot inside a binder page
// ---------------------------------------------------------------------------
function SortableBinderCard({ card }: { card: Card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    scale: isDragging ? '0.95' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative touch-manipulation cursor-grab active:cursor-grabbing sortable-binder-card"
    >
      <BinderCard card={card} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty slot
// ---------------------------------------------------------------------------
function EmptySlot({ index, isMissing, card }: { index: number; isMissing?: boolean; card?: Card }) {
  if (isMissing && card) {
    return (
      <Link href="/packs">
        <div className="w-[260px] h-[364px] rounded-xl flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden transition-all hover:scale-[1.02]"
          style={{
            background: `linear-gradient(145deg, ${card.gradientFrom}30, ${card.gradientTo}15)`,
            border: '1px solid rgba(255,255,255,0.04)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            contain: 'layout style paint',
          }}
        >
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }} />
          <span
            className="text-[56px] font-bold leading-none relative z-10 opacity-[0.08] group-hover:opacity-[0.15] transition-opacity"
            style={{ fontFamily: 'Georgia, serif', color: '#fff' }}
          >
            {card.character[0]}
          </span>
          <span className="text-4xl -mt-2 relative z-10 opacity-[0.08] group-hover:opacity-20 transition-opacity drop-shadow-lg">
            {card.symbol}
          </span>
          <span className="text-[10px] text-white/15 group-hover:text-white/40 mt-3 relative z-10 text-center px-4 truncate max-w-full transition-colors font-medium">
            {card.character}
          </span>
          <span className="text-[10px] text-accent/0 group-hover:text-accent font-semibold mt-2 relative z-10 transition-all group-hover:translate-y-0 translate-y-1">
            Find this card
          </span>
          <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/60 flex items-center justify-center opacity-20 group-hover:opacity-50 transition-opacity z-10 border border-white/5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="w-[260px] h-[364px] rounded-xl flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(18,20,31,0.3), rgba(10,11,20,0.2))',
        border: '1px dashed rgba(31, 34, 55, 0.25)',
        contain: 'layout style paint',
      }}
    >
      <div className="absolute inset-0 rounded-xl" style={{
        background: 'radial-gradient(ellipse at 50% 30%, rgba(129,140,248,0.02) 0%, transparent 70%)',
      }} />
      <span className="text-white/[0.06] text-lg font-mono">{index + 1}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editable page title
// ---------------------------------------------------------------------------
function EditableTitle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
        onBlur={() => { setEditing(false); if (draft.trim()) onChange(draft.trim()); else setDraft(value); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') { setEditing(false); if (draft.trim()) onChange(draft.trim()); }
          if (e.key === 'Escape') { setEditing(false); setDraft(value); }
        }}
        className="bg-surface/50 backdrop-blur-sm border border-accent/30 text-foreground text-base font-bold outline-none px-3 py-1.5 rounded-lg w-56"
        maxLength={40}
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="text-base font-bold text-foreground hover:text-accent transition-colors flex items-center gap-2 group px-1"
    >
      {value}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/0 group-hover:text-muted/50 transition-colors">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Loading spinner
// ---------------------------------------------------------------------------
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-60">
      <motion.div
        className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Unified Collection Page
// ---------------------------------------------------------------------------
export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState<CollectionTab>('binder');
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [binder, setBinder] = useState<BinderState | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [filterSet, setFilterSet] = useState<string>('all');
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [dragOverPageIndex, setDragOverPageIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const cardMap = useMemo(() => {
    const map = new Map<string, Card>();
    for (const c of ownedCards) map.set(c.id, c);
    return map;
  }, [ownedCards]);

  const missingCards = useMemo(() => {
    if (filterSet === 'all') return [];
    const ownedIds = new Set(ownedCards.map(c => c.id));
    return ALL_CARDS.filter(c => c.setSlug === filterSet && !ownedIds.has(c.id));
  }, [filterSet, ownedCards]);

  const displayPages = useMemo(() => {
    if (!binder) return [];
    if (filterSet === 'all') return binder.pages;
    const filteredIds: string[] = [];
    for (const page of binder.pages) {
      for (const cid of page.cardIds) {
        const card = cardMap.get(cid);
        if (card && card.setSlug === filterSet) filteredIds.push(cid);
      }
    }
    const allIds = [...filteredIds, ...missingCards.map(c => `missing:${c.id}`)];
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

  useEffect(() => {
    if (currentPageIndex >= displayPages.length) {
      setCurrentPageIndex(Math.max(0, displayPages.length - 1));
    }
  }, [displayPages.length, currentPageIndex]);

  const currentPage = displayPages[currentPageIndex] || null;
  const isFiltered = filterSet !== 'all';

  const goToPage = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, displayPages.length - 1));
    setDirection(clamped > currentPageIndex ? 1 : -1);
    setCurrentPageIndex(clamped);
  }, [displayPages.length, currentPageIndex]);

  const prevPage = useCallback(() => goToPage(currentPageIndex - 1), [goToPage, currentPageIndex]);
  const nextPage = useCallback(() => goToPage(currentPageIndex + 1), [goToPage, currentPageIndex]);

  const handleDragEnd_swipe = useCallback(
    (_: unknown, info: PanInfo) => {
      const threshold = 40;
      const velocity = 200;
      if ((info.offset.x < -threshold || info.velocity.x < -velocity) && currentPageIndex < displayPages.length - 1) {
        nextPage();
      } else if ((info.offset.x > threshold || info.velocity.x > velocity) && currentPageIndex > 0) {
        prevPage();
      }
    },
    [currentPageIndex, displayPages.length, nextPage, prevPage]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevPage, nextPage]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
    // Haptic feedback on drag start (mobile)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    if (!event.active.rect.current.translated) return;
    const x = event.active.rect.current.translated.left;
    const containerWidth = containerRef.current?.offsetWidth || 1000;
    if (x < 80 && currentPageIndex > 0) setDragOverPageIndex(currentPageIndex - 1);
    else if (x > containerWidth - 80 && currentPageIndex < displayPages.length - 1) setDragOverPageIndex(currentPageIndex + 1);
    else setDragOverPageIndex(null);
  }

  function handleDragEndDnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!binder || isFiltered) return;
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
        debouncedSaveBinderState(next);
        setBinder(next);
        setDragOverPageIndex(null);
        setDirection(dragOverPageIndex > currentPageIndex ? 1 : -1);
        setCurrentPageIndex(dragOverPageIndex);
        return;
      }
    }
    setDragOverPageIndex(null);
    if (!over || active.id === over.id) return;
    const page = binder.pages[currentPageIndex];
    if (!page) return;
    const oldIdx = page.cardIds.indexOf(active.id as string);
    const newIdx = page.cardIds.indexOf(over.id as string);
    if (oldIdx === -1 || newIdx === -1) return;
    const newIds = arrayMove(page.cardIds, oldIdx, newIdx);
    const newPages = binder.pages.map(p => p.id === page.id ? { ...p, cardIds: newIds } : p);
    const next = { ...binder, pages: newPages };
    debouncedSaveBinderState(next);
    setBinder(next);
  }

  function handleAddPage() {
    if (!binder) return;
    const next = addBinderPage(binder, `My Collection ${binder.pages.length + 1}`);
    setBinder(next);
    setDirection(1);
    setCurrentPageIndex(next.pages.length - 1);
  }

  function handleRenamePage(pageId: string, name: string) {
    if (!binder) return;
    setBinder(renameBinderPage(binder, pageId, name));
  }

  const activeCard = activeId ? cardMap.get(activeId as string) : null;

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
        <motion.div
          className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Collection</h1>
            <p className="text-xs sm:text-sm text-muted">
              {ownedCards.length} cards &middot; ${totalValue.toFixed(0)} value
            </p>
          </div>
        </div>

        {/* Pill tabs — horizontal navigation */}
        <CollectionPills active={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      {activeTab === 'binder' && (
        <>
          {/* Scarcity badges */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as Scarcity[]).map(s => {
              const count = scarcityCounts[s] || 0;
              if (!count) return null;
              return (
                <div
                  key={s}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono backdrop-blur-sm"
                  style={{
                    color: SCARCITY_CONFIG[s].color,
                    background: `${SCARCITY_CONFIG[s].color}12`,
                    border: `1px solid ${SCARCITY_CONFIG[s].color}15`,
                  }}
                >
                  {count} {SCARCITY_CONFIG[s].label}
                </div>
              );
            })}
          </div>

          {/* Set filter */}
          <section className="mb-5">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-3 px-3">
              <button
                onClick={() => { setFilterSet('all'); setCurrentPageIndex(0); setDirection(0); }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  filterSet === 'all'
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'bg-surface/80 backdrop-blur-sm text-muted hover:text-foreground border border-border'
                }`}
              >
                All ({ownedCards.length})
              </button>
              {SETS.map(s => {
                const count = ownedCards.filter(c => c.setSlug === s.slug).length;
                const comp = setCompletion.find(sc => sc.slug === s.slug);
                const pct = comp ? Math.round((comp.owned / comp.cardCount) * 100) : 0;
                return (
                  <button
                    key={s.slug}
                    onClick={() => { setFilterSet(s.slug); setCurrentPageIndex(0); setDirection(0); }}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      filterSet === s.slug
                        ? 'bg-accent text-white shadow-lg shadow-accent/25'
                        : 'bg-surface/80 backdrop-blur-sm text-muted hover:text-foreground border border-border'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="hidden sm:inline">{s.name}</span>
                    <span className="sm:hidden">{s.name.split(' ')[0]}</span>
                    <span className="opacity-50 text-[9px]">{pct}%</span>
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={prevPage} disabled={currentPageIndex === 0}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-surface-hover disabled:opacity-15 disabled:cursor-not-allowed transition-all active:scale-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {currentPage && !isFiltered && (
                  <EditableTitle value={currentPage.name} onChange={(name) => handleRenamePage(currentPage.id, name)} />
                )}
                {currentPage && isFiltered && (
                  <span className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <span>{SETS.find(s => s.slug === filterSet)?.icon}</span>
                    <span className="hidden sm:inline">{SETS.find(s => s.slug === filterSet)?.name}</span>
                  </span>
                )}
                <button onClick={nextPage} disabled={currentPageIndex >= displayPages.length - 1}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-surface-hover disabled:opacity-15 disabled:cursor-not-allowed transition-all active:scale-90">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs text-muted font-mono tabular-nums">{currentPageIndex + 1}/{displayPages.length}</span>
                {!isFiltered && (
                  <button onClick={handleAddPage}
                    className="px-2.5 py-1.5 rounded-lg bg-accent/10 text-accent text-[10px] sm:text-xs font-semibold hover:bg-accent/20 transition-colors border border-accent/20 active:scale-95">
                    + Page
                  </button>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl" style={{ overscrollBehavior: 'none' }}>
              <AnimatePresence>
                {activeId && currentPageIndex > 0 && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: dragOverPageIndex === currentPageIndex - 1 ? 1 : 0.4, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="absolute left-0 top-0 bottom-0 w-16 z-20 flex items-center justify-center"
                    style={{ background: 'linear-gradient(to right, rgba(129,140,248,0.25), transparent)' }}>
                    <motion.svg width="20" height="20" viewBox="0 0 16 16" fill="none" animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <path d="M10 12L6 8L10 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </motion.div>
                )}
                {activeId && currentPageIndex < displayPages.length - 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: dragOverPageIndex === currentPageIndex + 1 ? 1 : 0.4, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="absolute right-0 top-0 bottom-0 w-16 z-20 flex items-center justify-center"
                    style={{ background: 'linear-gradient(to left, rgba(129,140,248,0.25), transparent)' }}>
                    <motion.svg width="20" height="20" viewBox="0 0 16 16" fill="none" animate={{ x: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={currentPageIndex}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ type: 'tween', duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  drag={!activeId ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd_swipe}
                  className="touch-pan-y"
                  style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}
                >
                  <div className="p-4 sm:p-6 lg:p-8 rounded-2xl min-h-[420px] sm:min-h-[480px] relative"
                    style={{
                      background: 'linear-gradient(165deg, rgba(18,20,31,0.95) 0%, rgba(12,13,22,0.98) 50%, rgba(18,20,31,0.92) 100%)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      boxShadow: '0 4px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
                    }}>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                      background: 'radial-gradient(ellipse at 50% -20%, rgba(129,140,248,0.04) 0%, transparent 50%)',
                    }} />
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.025]" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    }} />
                    <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex flex-col gap-12 sm:gap-16 opacity-15">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2.5 sm:w-3 h-6 sm:h-8 rounded-full border-2 border-white/15" />
                      ))}
                    </div>
                    {currentPage && (
                      <SortableContext items={currentPage.cardIds.filter(id => !id.startsWith('missing:'))} strategy={rectSortingStrategy}>
                        <div className={`grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 justify-items-center ml-3 sm:ml-5 ${activeId ? 'binder-grid-dragging' : ''}`} style={{ contain: 'layout style' }}>
                          {currentPage.cardIds.map((cid, i) => {
                            if (cid.startsWith('missing:')) {
                              const realId = cid.replace('missing:', '');
                              const card = ALL_CARDS.find(c => c.id === realId);
                              return (
                                <motion.div key={cid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.2, ease: 'easeOut' }}>
                                  <EmptySlot index={i} isMissing card={card} />
                                </motion.div>
                              );
                            }
                            const card = cardMap.get(cid);
                            if (!card) return <EmptySlot key={cid} index={i} />;
                            return (
                              <motion.div key={card.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.2, ease: 'easeOut' }}>
                                {isFiltered ? (
                                  <Link href={`/card/${card.id}`}><CardItem card={card} size="lg" interactive={true} /></Link>
                                ) : (
                                  <SortableBinderCard card={card} />
                                )}
                              </motion.div>
                            );
                          })}
                          {Array.from({ length: Math.max(0, 6 - currentPage.cardIds.length) }).map((_, i) => (
                            <motion.div key={`empty-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (currentPage.cardIds.length + i) * 0.04, duration: 0.15 }}>
                              <EmptySlot index={currentPage.cardIds.length + i} />
                            </motion.div>
                          ))}
                        </div>
                      </SortableContext>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <DragOverlay dropAnimation={null}>
              {activeCard && <DragGhostCard card={activeCard} />}
            </DragOverlay>
          </DndContext>

          {/* Page dots */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-5 mb-4">
            {displayPages.map((page, i) => (
              <motion.button
                key={page.id}
                onClick={() => goToPage(i)}
                className="rounded-full transition-all"
                animate={{ width: i === currentPageIndex ? 28 : 8, height: 8, backgroundColor: i === currentPageIndex ? '#818cf8' : 'rgba(31,34,55,0.6)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{ boxShadow: i === currentPageIndex ? '0 0 12px rgba(129,140,248,0.35)' : 'none' }}
              />
            ))}
          </div>

          {/* Set completion strip */}
          <section className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {setCompletion.map((s, i) => {
              const pct = Math.round((s.owned / s.cardCount) * 100);
              return (
                <motion.button
                  key={s.slug}
                  onClick={() => { setFilterSet(s.slug); setCurrentPageIndex(0); setDirection(0); }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className={`p-3 rounded-xl border transition-all active:scale-95 ${
                    filterSet === s.slug ? 'bg-accent/10 border-accent/30 shadow-lg shadow-accent/5' : 'bg-surface/60 backdrop-blur-sm border-border/50 hover:border-border'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-base sm:text-lg">{s.icon}</span>
                    <span className="text-[10px] sm:text-xs font-semibold truncate">{s.name.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border/20 overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{
                        background: pct === 100 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : pct > 50 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #818cf8, #a78bfa)',
                      }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] sm:text-[10px] text-muted">{s.owned}/{s.cardCount}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold" style={{ color: pct === 100 ? '#f59e0b' : pct > 50 ? '#22c55e' : '#818cf8' }}>{pct}%</span>
                  </div>
                </motion.button>
              );
            })}
          </section>

          {ownedCards.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-60 text-center mt-8">
              <span className="text-5xl mb-4">&#x1F4E6;</span>
              <h3 className="text-lg font-bold mb-1">Your collection is empty</h3>
              <p className="text-sm text-muted mb-5">Open packs to start building your collection of legendary characters.</p>
              <Link href="/packs" className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-all active:scale-95 shadow-lg shadow-accent/20">
                Open Your First Pack
              </Link>
            </motion.div>
          )}
        </>
      )}

      {activeTab === 'showcase' && (
        <Suspense fallback={<LoadingSpinner />}>
          <ShowcaseSection />
        </Suspense>
      )}

      {activeTab === 'sets' && (
        <Suspense fallback={<LoadingSpinner />}>
          <SetsSection />
        </Suspense>
      )}

      {activeTab === 'smart' && (
        <Suspense fallback={<LoadingSpinner />}>
          <SmartSection />
        </Suspense>
      )}

      {activeTab === 'analytics' && (
        <Suspense fallback={<LoadingSpinner />}>
          <AnalyticsSection />
        </Suspense>
      )}
    </div>
  );
}
