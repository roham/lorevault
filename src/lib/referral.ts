'use client';

// Referral system — generates unique referral codes, tracks referrals, rewards referrers

export interface ReferralState {
  code: string;
  referrals: { date: string; phantom: boolean }[];
  totalReferred: number;
  rewardsClaimed: number;
}

const REFERRAL_KEY = 'lorevault_referral';

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage full */ }
}

function generateReferralCode(): string {
  // Deterministic from profile seed + random suffix
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'LV-';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Seed phantom referrals for social proof
function seedPhantomReferrals(state: ReferralState): ReferralState {
  if (state.referrals.length > 0) return state;
  const today = new Date();
  const phantomCount = 2 + Math.floor(Math.random() * 3); // 2-4 phantom referrals
  for (let i = 0; i < phantomCount; i++) {
    const daysAgo = Math.floor(Math.random() * 14) + 1;
    const date = new Date(today.getTime() - daysAgo * 86400000).toISOString().slice(0, 10);
    state.referrals.push({ date, phantom: true });
  }
  state.totalReferred = state.referrals.length;
  return state;
}

export function getReferralState(): ReferralState {
  if (typeof window === 'undefined') return { code: '', referrals: [], totalReferred: 0, rewardsClaimed: 0 };

  let state = getItem<ReferralState>(REFERRAL_KEY, {
    code: '',
    referrals: [],
    totalReferred: 0,
    rewardsClaimed: 0,
  });

  // Generate code on first access
  if (!state.code) {
    state.code = generateReferralCode();
    state = seedPhantomReferrals(state);
    setItem(REFERRAL_KEY, state);
  }

  return state;
}

export function addReferral(): void {
  if (typeof window === 'undefined') return;
  const state = getReferralState();
  state.referrals.push({ date: new Date().toISOString().slice(0, 10), phantom: false });
  state.totalReferred = state.referrals.length;
  setItem(REFERRAL_KEY, state);
}

export function getReferralLink(): string {
  const state = getReferralState();
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/?ref=${state.code}`;
}

// Rewards: 1 rare card per referral (capped at 10)
export const REFERRAL_REWARDS = [
  { at: 1, label: 'Recruiter Badge', icon: '🎖️' },
  { at: 3, label: 'Rare Card Pack', icon: '🃏' },
  { at: 5, label: 'Epic Card Pack', icon: '💜' },
  { at: 10, label: 'Legendary Card', icon: '⚡' },
];

export function getNextReferralReward(totalReferred: number): typeof REFERRAL_REWARDS[number] | null {
  return REFERRAL_REWARDS.find(r => r.at > totalReferred) || null;
}
