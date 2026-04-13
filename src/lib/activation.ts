'use client';

// ===== Activation State Machine =====
// Turns first-time visitors into engaged collectors through progressive feature disclosure.

export interface ActivationState {
  // Milestone tracking
  hasOpenedFirstPack: boolean;
  hasSeenCollection: boolean;
  hasDraggedCard: boolean;
  hasVisitedMarketplace: boolean;
  hasPlayedBattle: boolean;
  hasPlayedTrivia: boolean;
  hasSetPriceAlert: boolean;
  hasViewedAnalytics: boolean;
  hasCreatedShowcase: boolean;
  totalCardsOwned: number;
  setsStarted: number;

  // Tooltip tracking (each shows once)
  tooltipsShown: Record<string, boolean>;

  // Feature unlock tracking
  featuresUnlocked: string[];

  // Unlock celebration queue
  pendingUnlockCelebrations: string[];
}

const ACTIVATION_KEY = 'lorevault_activation';

const DEFAULT_STATE: ActivationState = {
  hasOpenedFirstPack: false,
  hasSeenCollection: false,
  hasDraggedCard: false,
  hasVisitedMarketplace: false,
  hasPlayedBattle: false,
  hasPlayedTrivia: false,
  hasSetPriceAlert: false,
  hasViewedAnalytics: false,
  hasCreatedShowcase: false,
  totalCardsOwned: 0,
  setsStarted: 0,
  tooltipsShown: {},
  featuresUnlocked: ['home', 'packs', 'collection'],
  pendingUnlockCelebrations: [],
};

// ===== Feature Unlock Thresholds =====
export const FEATURE_THRESHOLDS: Record<string, { cards: number; label: string; icon: string; description: string }> = {
  marketplace:      { cards: 10, label: 'Marketplace',       icon: '🏪', description: 'Buy and sell cards on the open market' },
  'set-completion': { cards: 10, label: 'Set Completion',    icon: '📚', description: 'Track your progress across all sets' },
  challenges:       { cards: 15, label: 'Challenges',        icon: '🏆', description: 'Complete challenges for XP and rewards' },
  battle:           { cards: 15, label: 'Card Battle',       icon: '⚔️', description: 'Pit your cards against AI opponents' },
  'smart-collections': { cards: 25, label: 'Smart Collections', icon: '🧠', description: 'AI-powered card organization' },
  trivia:           { cards: 25, label: 'Lore Trivia',       icon: '🧩', description: 'Test your knowledge of literary lore' },
  analytics:        { cards: 50, label: 'Analytics',         icon: '📊', description: 'Deep portfolio analytics and insights' },
  showcase:         { cards: 50, label: 'Showcase Builder',  icon: '🖼️', description: 'Build and share curated card displays' },
};

// Always-available features
const ALWAYS_AVAILABLE = ['home', 'packs', 'collection'];

// ===== Tooltip Definitions =====
export const TOOLTIP_DEFS: Record<string, { text: string; trigger: string }> = {
  'collection-drag':    { text: 'Drag cards to rearrange your collection', trigger: 'first-collection-visit' },
  'collection-filter':  { text: 'Filter by set to see what you\'re missing', trigger: '10-cards-collection' },
  'marketplace-need':   { text: 'Cards you need are highlighted with a badge', trigger: 'first-marketplace-visit' },
  'card-price-alert':   { text: 'Set a price alert to track value changes', trigger: 'first-card-detail' },
  'games-battle':       { text: 'Battle using cards from YOUR collection', trigger: 'first-games-visit' },
  'analytics-hint':     { text: 'Check your analytics to see collection value', trigger: '5-packs-opened' },
};

// ===== State Management =====

export function getActivationState(): ActivationState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem(ACTIVATION_KEY);
    return stored ? { ...DEFAULT_STATE, ...JSON.parse(stored) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveActivationState(state: ActivationState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVATION_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked
  }
}

export function updateActivation(updates: Partial<ActivationState>): ActivationState {
  const current = getActivationState();
  const next = { ...current, ...updates };
  saveActivationState(next);
  return next;
}

// ===== Feature Unlock Logic =====

export function checkFeatureUnlocks(totalCards: number, completedSets: number): string[] {
  const state = getActivationState();
  const newUnlocks: string[] = [];

  for (const [feature, threshold] of Object.entries(FEATURE_THRESHOLDS)) {
    if (!state.featuresUnlocked.includes(feature) && totalCards >= threshold.cards) {
      newUnlocks.push(feature);
    }
  }

  // Battle Pass unlocks at first complete set
  if (completedSets > 0 && !state.featuresUnlocked.includes('battle-pass')) {
    newUnlocks.push('battle-pass');
  }

  if (newUnlocks.length > 0) {
    const updated = {
      ...state,
      totalCardsOwned: totalCards,
      setsStarted: completedSets,
      featuresUnlocked: [...state.featuresUnlocked, ...newUnlocks],
      pendingUnlockCelebrations: [...state.pendingUnlockCelebrations, ...newUnlocks],
    };
    saveActivationState(updated);
  }

  return newUnlocks;
}

export function isFeatureUnlocked(feature: string): boolean {
  if (ALWAYS_AVAILABLE.includes(feature)) return true;
  return getActivationState().featuresUnlocked.includes(feature);
}

export function getCardsNeededForFeature(feature: string, totalCards: number): number {
  const threshold = FEATURE_THRESHOLDS[feature];
  if (!threshold) return 0;
  return Math.max(0, threshold.cards - totalCards);
}

// ===== Tooltip Logic =====

export function shouldShowTooltip(tooltipId: string): boolean {
  const state = getActivationState();
  return !state.tooltipsShown[tooltipId];
}

export function markTooltipShown(tooltipId: string) {
  const state = getActivationState();
  const updated = {
    ...state,
    tooltipsShown: { ...state.tooltipsShown, [tooltipId]: true },
  };
  saveActivationState(updated);
}

// ===== Milestone Tracking =====

export function markMilestone(milestone: keyof Pick<ActivationState,
  'hasOpenedFirstPack' | 'hasSeenCollection' | 'hasDraggedCard' |
  'hasVisitedMarketplace' | 'hasPlayedBattle' | 'hasPlayedTrivia' |
  'hasSetPriceAlert' | 'hasViewedAnalytics' | 'hasCreatedShowcase'
>) {
  updateActivation({ [milestone]: true });
}

// ===== Celebration Queue =====

export function popNextCelebration(): string | null {
  const state = getActivationState();
  if (state.pendingUnlockCelebrations.length === 0) return null;
  const [next, ...rest] = state.pendingUnlockCelebrations;
  saveActivationState({ ...state, pendingUnlockCelebrations: rest });
  return next;
}

// ===== Computed Helpers =====

export function getActivationProgress(): {
  milestonesCompleted: number;
  totalMilestones: number;
  featuresUnlocked: number;
  totalFeatures: number;
  percent: number;
} {
  const state = getActivationState();
  const milestones = [
    state.hasOpenedFirstPack,
    state.hasSeenCollection,
    state.hasDraggedCard,
    state.hasVisitedMarketplace,
    state.hasPlayedBattle,
    state.hasPlayedTrivia,
    state.hasSetPriceAlert,
    state.hasViewedAnalytics,
    state.hasCreatedShowcase,
  ];
  const milestonesCompleted = milestones.filter(Boolean).length;
  const totalMilestones = milestones.length;
  const featuresUnlocked = state.featuresUnlocked.length;
  const totalFeatures = Object.keys(FEATURE_THRESHOLDS).length + ALWAYS_AVAILABLE.length;
  const percent = Math.round(((milestonesCompleted + featuresUnlocked) / (totalMilestones + totalFeatures)) * 100);

  return { milestonesCompleted, totalMilestones, featuresUnlocked, totalFeatures, percent };
}
