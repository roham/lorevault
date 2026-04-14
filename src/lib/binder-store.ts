'use client';

// Binder organization storage — pages, card ordering, page names

export interface BinderPage {
  id: string;
  name: string;
  cardIds: string[]; // ordered card IDs, max 6 per page
}

export interface BinderState {
  pages: BinderPage[];
  version: number;
}

const BINDER_KEY = 'lorevault_binder';

function generateId(): string {
  return `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getBinderState(): BinderState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(BINDER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveBinderState(state: BinderState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BINDER_KEY, JSON.stringify(state));
  } catch {
    // Storage full
  }
}

// Debounced save — accumulates writes, flushes after 400ms idle.
// Use during drag operations to avoid blocking the main thread.
let _pendingSave: BinderState | null = null;
let _saveTimer: ReturnType<typeof setTimeout> | null = null;

export function debouncedSaveBinderState(state: BinderState) {
  _pendingSave = state;
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    if (_pendingSave) {
      saveBinderState(_pendingSave);
      _pendingSave = null;
    }
    _saveTimer = null;
  }, 400);
}

export function flushBinderSave() {
  if (_saveTimer) clearTimeout(_saveTimer);
  if (_pendingSave) {
    saveBinderState(_pendingSave);
    _pendingSave = null;
  }
  _saveTimer = null;
}

export function initBinderFromCards(cardIds: string[]): BinderState {
  // Chunk cards into pages of 6
  const pages: BinderPage[] = [];
  for (let i = 0; i < cardIds.length; i += 6) {
    const chunk = cardIds.slice(i, i + 6);
    pages.push({
      id: generateId(),
      name: `Page ${pages.length + 1}`,
      cardIds: chunk,
    });
  }
  // Always have at least 1 page
  if (pages.length === 0) {
    pages.push({ id: generateId(), name: 'Page 1', cardIds: [] });
  }
  const state: BinderState = { pages, version: 1 };
  saveBinderState(state);
  return state;
}

export function addBinderPage(state: BinderState, name?: string): BinderState {
  const newPage: BinderPage = {
    id: generateId(),
    name: name || `Page ${state.pages.length + 1}`,
    cardIds: [],
  };
  const next = { ...state, pages: [...state.pages, newPage] };
  saveBinderState(next);
  return next;
}

export function renameBinderPage(state: BinderState, pageId: string, name: string): BinderState {
  const next = {
    ...state,
    pages: state.pages.map(p => p.id === pageId ? { ...p, name } : p),
  };
  saveBinderState(next);
  return next;
}

export function removeBinderPage(state: BinderState, pageId: string): BinderState {
  // Move cards from deleted page to unassigned
  const next = {
    ...state,
    pages: state.pages.filter(p => p.id !== pageId),
  };
  if (next.pages.length === 0) {
    next.pages.push({ id: generateId(), name: 'Page 1', cardIds: [] });
  }
  saveBinderState(next);
  return next;
}

export function moveCardWithinPage(
  state: BinderState,
  pageId: string,
  fromIndex: number,
  toIndex: number
): BinderState {
  const page = state.pages.find(p => p.id === pageId);
  if (!page) return state;
  const ids = [...page.cardIds];
  const [moved] = ids.splice(fromIndex, 1);
  ids.splice(toIndex, 0, moved);
  const next = {
    ...state,
    pages: state.pages.map(p => p.id === pageId ? { ...p, cardIds: ids } : p),
  };
  saveBinderState(next);
  return next;
}

export function moveCardBetweenPages(
  state: BinderState,
  cardId: string,
  fromPageId: string,
  toPageId: string,
  toIndex?: number
): BinderState {
  const fromPage = state.pages.find(p => p.id === fromPageId);
  const toPage = state.pages.find(p => p.id === toPageId);
  if (!fromPage || !toPage) return state;
  if (toPage.cardIds.length >= 6) return state; // Page full

  const fromIds = fromPage.cardIds.filter(id => id !== cardId);
  const toIds = [...toPage.cardIds];
  const insertAt = toIndex !== undefined ? toIndex : toIds.length;
  toIds.splice(insertAt, 0, cardId);

  const next = {
    ...state,
    pages: state.pages.map(p => {
      if (p.id === fromPageId) return { ...p, cardIds: fromIds };
      if (p.id === toPageId) return { ...p, cardIds: toIds };
      return p;
    }),
  };
  saveBinderState(next);
  return next;
}

export function addCardToBinder(state: BinderState, cardId: string): BinderState {
  // Check if card is already in any page
  for (const page of state.pages) {
    if (page.cardIds.includes(cardId)) return state;
  }
  // Find first page with space
  const pageWithSpace = state.pages.find(p => p.cardIds.length < 6);
  if (pageWithSpace) {
    const next = {
      ...state,
      pages: state.pages.map(p =>
        p.id === pageWithSpace.id ? { ...p, cardIds: [...p.cardIds, cardId] } : p
      ),
    };
    saveBinderState(next);
    return next;
  }
  // All pages full — add new page
  const newPage: BinderPage = {
    id: generateId(),
    name: `Page ${state.pages.length + 1}`,
    cardIds: [cardId],
  };
  const next = { ...state, pages: [...state.pages, newPage] };
  saveBinderState(next);
  return next;
}

export function syncBinderWithOwned(state: BinderState, ownedIds: string[]): BinderState {
  const ownedSet = new Set(ownedIds);
  const assignedIds = new Set<string>();

  // Remove cards no longer owned
  const cleanedPages = state.pages.map(p => ({
    ...p,
    cardIds: p.cardIds.filter(id => {
      if (ownedSet.has(id)) {
        assignedIds.add(id);
        return true;
      }
      return false;
    }),
  }));

  // Add any owned cards not yet in binder
  const unassigned = ownedIds.filter(id => !assignedIds.has(id));
  let pages = cleanedPages;

  for (const cardId of unassigned) {
    const pageWithSpace = pages.find(p => p.cardIds.length < 6);
    if (pageWithSpace) {
      pages = pages.map(p =>
        p.id === pageWithSpace.id ? { ...p, cardIds: [...p.cardIds, cardId] } : p
      );
    } else {
      pages = [...pages, {
        id: generateId(),
        name: `Page ${pages.length + 1}`,
        cardIds: [cardId],
      }];
    }
  }

  const next = { ...state, pages };
  saveBinderState(next);
  return next;
}
