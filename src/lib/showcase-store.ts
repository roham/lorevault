'use client';

// Showcase storage — multiple named showcases with bento grid layouts

export type ShowcaseCardSize = '1x1' | '2x1' | '2x2';

export interface ShowcaseSlot {
  cardId: string;
  size: ShowcaseCardSize;
}

export interface Showcase {
  id: string;
  name: string;
  theme: ShowcaseTheme;
  slots: ShowcaseSlot[];
  createdAt: number;
}

export type ShowcaseTheme = 'dark-glass' | 'deep-purple' | 'midnight-blue' | 'obsidian';

export const SHOWCASE_THEMES: Record<ShowcaseTheme, { label: string; bg: string; border: string; accent: string }> = {
  'dark-glass': {
    label: 'Dark Glass',
    bg: 'linear-gradient(145deg, rgba(18,20,31,0.95), rgba(10,11,20,0.98))',
    border: 'rgba(255,255,255,0.06)',
    accent: '#818cf8',
  },
  'deep-purple': {
    label: 'Deep Purple',
    bg: 'linear-gradient(145deg, rgba(30,10,50,0.95), rgba(15,5,30,0.98))',
    border: 'rgba(168,85,247,0.15)',
    accent: '#a855f7',
  },
  'midnight-blue': {
    label: 'Midnight Blue',
    bg: 'linear-gradient(145deg, rgba(10,15,40,0.95), rgba(5,8,25,0.98))',
    border: 'rgba(59,130,246,0.12)',
    accent: '#3b82f6',
  },
  'obsidian': {
    label: 'Obsidian',
    bg: 'linear-gradient(145deg, rgba(8,8,12,0.98), rgba(15,15,25,0.95))',
    border: 'rgba(99,102,241,0.1)',
    accent: '#6366f1',
  },
};

const SHOWCASES_KEY = 'lorevault_showcases';
const ACTIVE_SHOWCASE_KEY = 'lorevault_active_showcase';

function generateId(): string {
  return `showcase-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getShowcases(): Showcase[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SHOWCASES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveShowcases(showcases: Showcase[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SHOWCASES_KEY, JSON.stringify(showcases));
  } catch {
    // full
  }
}

export function getActiveShowcaseId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_SHOWCASE_KEY);
}

export function setActiveShowcaseId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_SHOWCASE_KEY, id);
}

export function createShowcase(name: string, theme: ShowcaseTheme = 'dark-glass'): Showcase {
  const showcase: Showcase = {
    id: generateId(),
    name,
    theme,
    slots: [],
    createdAt: Date.now(),
  };
  const all = getShowcases();
  all.push(showcase);
  saveShowcases(all);
  return showcase;
}

export function updateShowcase(id: string, updates: Partial<Omit<Showcase, 'id' | 'createdAt'>>): Showcase | null {
  const all = getShowcases();
  const idx = all.findIndex(s => s.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  saveShowcases(all);
  return all[idx];
}

export function deleteShowcase(id: string) {
  const all = getShowcases().filter(s => s.id !== id);
  saveShowcases(all);
  if (getActiveShowcaseId() === id && all.length > 0) {
    setActiveShowcaseId(all[0].id);
  }
}

export function addCardToShowcase(showcaseId: string, cardId: string, size: ShowcaseCardSize = '1x1'): Showcase | null {
  const all = getShowcases();
  const showcase = all.find(s => s.id === showcaseId);
  if (!showcase) return null;
  if (showcase.slots.find(s => s.cardId === cardId)) return showcase; // already present
  if (showcase.slots.length >= 12) return showcase; // max 12 slots
  showcase.slots.push({ cardId, size });
  saveShowcases(all);
  return showcase;
}

export function removeCardFromShowcase(showcaseId: string, cardId: string): Showcase | null {
  const all = getShowcases();
  const showcase = all.find(s => s.id === showcaseId);
  if (!showcase) return null;
  showcase.slots = showcase.slots.filter(s => s.cardId !== cardId);
  saveShowcases(all);
  return showcase;
}

export function resizeCardInShowcase(showcaseId: string, cardId: string, size: ShowcaseCardSize): Showcase | null {
  const all = getShowcases();
  const showcase = all.find(s => s.id === showcaseId);
  if (!showcase) return null;
  const slot = showcase.slots.find(s => s.cardId === cardId);
  if (!slot) return null;
  slot.size = size;
  saveShowcases(all);
  return showcase;
}

export function reorderShowcaseSlots(showcaseId: string, slots: ShowcaseSlot[]): Showcase | null {
  const all = getShowcases();
  const showcase = all.find(s => s.id === showcaseId);
  if (!showcase) return null;
  showcase.slots = slots;
  saveShowcases(all);
  return showcase;
}
