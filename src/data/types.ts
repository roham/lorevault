export type Scarcity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type Parallel = 'base' | 'silver' | 'gold' | 'holographic' | 'obsidian';

export interface Card {
  id: string;
  name: string;
  character: string;
  set: string;
  setSlug: string;
  moment: string;
  scarcity: Scarcity;
  parallel: Parallel;
  serialNumber: number;
  maxSerial: number;
  loreText: string;
  price: number;
  listed: boolean;
  owned: boolean;
  gradientFrom: string;
  gradientTo: string;
  symbol: string;
}

export interface CardSet {
  name: string;
  slug: string;
  description: string;
  cardCount: number;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'set-completion' | 'scarcity-chase' | 'thematic' | 'daily' | 'weekly' | 'seasonal';
  requirements: ChallengeRequirement[];
  reward: ChallengeReward;
  progress: number;
  total: number;
  expiresAt?: string;
  active: boolean;
}

export interface ChallengeRequirement {
  description: string;
  met: boolean;
}

export interface ChallengeReward {
  type: 'card' | 'badge' | 'title' | 'xp' | 'pack';
  name: string;
  description: string;
  scarcity?: Scarcity;
}

export interface CollectorProfile {
  username: string;
  collectorScore: number;
  totalCards: number;
  uniqueSets: number;
  legendaryCount: number;
  showcaseCards: string[]; // card IDs
  badges: Badge[];
  joinedDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export const SCARCITY_CONFIG: Record<Scarcity, { label: string; color: string; maxSerial: number; bgClass: string }> = {
  common: { label: 'Common', color: '#6b7094', maxSerial: 9999, bgClass: 'bg-common' },
  uncommon: { label: 'Uncommon', color: '#22c55e', maxSerial: 1000, bgClass: 'bg-uncommon' },
  rare: { label: 'Rare', color: '#3b82f6', maxSerial: 250, bgClass: 'bg-rare' },
  epic: { label: 'Epic', color: '#a855f7', maxSerial: 50, bgClass: 'bg-epic' },
  legendary: { label: 'Legendary', color: '#f59e0b', maxSerial: 10, bgClass: 'bg-legendary' },
};

export const PARALLEL_CONFIG: Record<Parallel, { label: string; effect: string }> = {
  base: { label: 'Base', effect: 'none' },
  silver: { label: 'Silver Frame', effect: 'shimmer' },
  gold: { label: 'Gold Frame', effect: 'glow' },
  holographic: { label: 'Holographic', effect: 'holographic' },
  obsidian: { label: 'Obsidian', effect: 'obsidian' },
};
