'use client';

export type VipTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface VipTierConfig {
  name: VipTier;
  color: string;
  minXP: number;
  maxXP: number; // Infinity for Diamond
  packsPerWeek: number;
  rebatePercent: number;
  earlyAccessMinutes: number;
  benefits: string[];
}

export const VIP_TIERS: VipTierConfig[] = [
  {
    name: 'Bronze',
    color: '#CD7F32',
    minXP: 0,
    maxXP: 499,
    packsPerWeek: 1,
    rebatePercent: 0,
    earlyAccessMinutes: 0,
    benefits: ['1 free pack/week', 'Base rewards'],
  },
  {
    name: 'Silver',
    color: '#C0C0C0',
    minXP: 500,
    maxXP: 1499,
    packsPerWeek: 2,
    rebatePercent: 5,
    earlyAccessMinutes: 15,
    benefits: ['2 free packs/week', '5% marketplace rebate', '15 min early access'],
  },
  {
    name: 'Gold',
    color: '#FFD700',
    minXP: 1500,
    maxXP: 3999,
    packsPerWeek: 3,
    rebatePercent: 10,
    earlyAccessMinutes: 30,
    benefits: ['3 free packs/week', '10% rebate', '30 min early access', 'Gold card frame'],
  },
  {
    name: 'Platinum',
    color: '#E5E4E2',
    minXP: 4000,
    maxXP: 9999,
    packsPerWeek: 5,
    rebatePercent: 15,
    earlyAccessMinutes: 60,
    benefits: ['5 free packs/week', '15% rebate', '1 hour early access', 'Exclusive showcase theme', 'Priority support'],
  },
  {
    name: 'Diamond',
    color: '#B9F2FF',
    minXP: 10000,
    maxXP: Infinity,
    packsPerWeek: 7,
    rebatePercent: 20,
    earlyAccessMinutes: 120,
    benefits: ['Daily free pack', '20% rebate', 'First access to all drops', 'Obsidian parallel variants', 'Diamond profile badge'],
  },
];

interface MonthlyData {
  month: string;
  xp: number;
  packsOpened: number;
  rebateTotal: number;
}

const VIP_KEY = 'lorevault_vip_monthly';

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7); // "2026-04"
}

function getMonthlyData(): MonthlyData {
  if (typeof window === 'undefined') return { month: getCurrentMonth(), xp: 0, packsOpened: 0, rebateTotal: 0 };
  try {
    const stored = localStorage.getItem(VIP_KEY);
    if (stored) {
      const data = JSON.parse(stored) as MonthlyData;
      if (data.month === getCurrentMonth()) return data;
    }
  } catch { /* ignore */ }
  return { month: getCurrentMonth(), xp: 0, packsOpened: 0, rebateTotal: 0 };
}

function saveMonthlyData(data: MonthlyData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VIP_KEY, JSON.stringify(data));
  } catch { /* storage full */ }
}

function getTierForXP(monthlyXP: number): VipTierConfig {
  for (let i = VIP_TIERS.length - 1; i >= 0; i--) {
    if (monthlyXP >= VIP_TIERS[i].minXP) return VIP_TIERS[i];
  }
  return VIP_TIERS[0];
}

export interface VipState {
  tier: VipTierConfig;
  monthlyXP: number;
  xpToNextTier: number;
  nextTierName: string | null;
  progressToNextTier: number; // 0-100
  benefits: string[];
  packsPerWeek: number;
  rebatePercent: number;
  earlyAccessMinutes: number;
  monthlyEarnings: { packsOpened: number; rebateTotal: number; xpEarned: number };
  maintainWarning: string | null; // "Earn X more XP to keep [tier]"
}

export function getVipState(): VipState {
  const data = getMonthlyData();
  const tier = getTierForXP(data.xp);
  const tierIndex = VIP_TIERS.indexOf(tier);
  const nextTier = tierIndex < VIP_TIERS.length - 1 ? VIP_TIERS[tierIndex + 1] : null;

  const xpToNextTier = nextTier ? nextTier.minXP - data.xp : 0;
  const progressToNextTier = nextTier
    ? Math.min(100, ((data.xp - tier.minXP) / (nextTier.minXP - tier.minXP)) * 100)
    : 100;

  // Warning: if in the last 7 days of the month and XP might drop
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();
  const maintainWarning = tierIndex > 0 && daysLeft <= 7 && data.xp < tier.minXP + 100
    ? `Earn ${tier.minXP + 100 - data.xp} more XP to secure ${tier.name}`
    : null;

  return {
    tier,
    monthlyXP: data.xp,
    xpToNextTier,
    nextTierName: nextTier?.name ?? null,
    progressToNextTier,
    benefits: tier.benefits,
    packsPerWeek: tier.packsPerWeek,
    rebatePercent: tier.rebatePercent,
    earlyAccessMinutes: tier.earlyAccessMinutes,
    monthlyEarnings: { packsOpened: data.packsOpened, rebateTotal: data.rebateTotal, xpEarned: data.xp },
    maintainWarning,
  };
}

export function recordMonthlyXP(amount: number) {
  const data = getMonthlyData();
  data.xp += amount;
  saveMonthlyData(data);
}

export function recordMonthlyPackOpen() {
  const data = getMonthlyData();
  data.packsOpened += 1;
  saveMonthlyData(data);
}

export function clearVipMonthly() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(VIP_KEY);
}
