'use client';

// Onboarding state machine
// Tracks where the user is in their journey and controls progressive feature disclosure

export interface OnboardingState {
  hasVisited: boolean;
  hasOpenedFirstPack: boolean;
  hasSeenCollectionReveal: boolean;
  hasSetupShowcase: boolean;
  totalPacksOpened: number;
  challengesUnlocked: boolean;  // true after 15 cards
  marketplaceHinted: boolean;   // true after first challenge attempt
}

const ONBOARDING_KEY = 'lorevault_onboarding';

const DEFAULT_STATE: OnboardingState = {
  hasVisited: false,
  hasOpenedFirstPack: false,
  hasSeenCollectionReveal: false,
  hasSetupShowcase: false,
  totalPacksOpened: 0,
  challengesUnlocked: false,
  marketplaceHinted: false,
};

export function getOnboardingState(): OnboardingState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    return stored ? { ...DEFAULT_STATE, ...JSON.parse(stored) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function updateOnboarding(updates: Partial<OnboardingState>) {
  if (typeof window === 'undefined') return;
  const current = getOnboardingState();
  const next = { ...current, ...updates };
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next));
  return next;
}

export function isNewUser(): boolean {
  return !getOnboardingState().hasVisited;
}

export function shouldShowWelcome(): boolean {
  const state = getOnboardingState();
  return !state.hasOpenedFirstPack;
}

export function shouldShowCollectionReveal(): boolean {
  const state = getOnboardingState();
  return state.hasOpenedFirstPack && !state.hasSeenCollectionReveal;
}

export function areChallengesUnlocked(): boolean {
  return getOnboardingState().challengesUnlocked;
}

// Call after each pack opening to check unlock thresholds
export function checkUnlocks(totalCards: number) {
  const state = getOnboardingState();
  const updates: Partial<OnboardingState> = {};

  if (totalCards >= 15 && !state.challengesUnlocked) {
    updates.challengesUnlocked = true;
  }

  if (Object.keys(updates).length > 0) {
    updateOnboarding(updates);
  }
}
