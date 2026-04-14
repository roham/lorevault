'use client';

import { Achievement, AchievementRarity, AchievementCategory } from '@/data/types';
import { getOwnedCards, getEarnedAchievements, earnAchievement, getGameStats, getStreak, getCollectorLevel, getAgingTiers, getOriginBadge, getCardMeta, getUnlockedLoreNodes } from '@/lib/store';
import { getSecretNodes } from '@/data/lore-graph';

// ---------------------------------------------------------------------------
// Achievement definitions — 33 achievements across 5 categories
// ---------------------------------------------------------------------------
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-pull',
    name: 'First Pull',
    description: 'Open your first pack',
    icon: '1',
    rarity: 'common',
    category: 'discovery',
    mockPercent: 95,
  },
  {
    id: 'set-starter',
    name: 'Set Starter',
    description: 'Own cards from 3 different sets',
    icon: '3',
    rarity: 'common',
    category: 'collection',
    mockPercent: 82,
  },
  {
    id: 'battle-tested',
    name: 'Battle Tested',
    description: 'Win 5 card battles',
    icon: 'W',
    rarity: 'uncommon',
    category: 'battle',
    mockPercent: 45,
  },
  {
    id: 'quiz-whiz',
    name: 'Quiz Whiz',
    description: 'Get a trivia streak of 5',
    icon: '?',
    rarity: 'uncommon',
    category: 'battle',
    mockPercent: 38,
  },
  {
    id: 'whale',
    name: 'Whale',
    description: 'Own 100+ cards',
    icon: 'W',
    rarity: 'rare',
    category: 'collection',
    mockPercent: 12,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete an entire set',
    icon: 'C',
    rarity: 'epic',
    category: 'collection',
    mockPercent: 5,
  },
  {
    id: 'day-one',
    name: 'Day One',
    description: 'Collected during first 24 hours',
    icon: 'D',
    rarity: 'rare',
    category: 'special',
    mockPercent: 15,
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day login streak',
    icon: '7',
    rarity: 'uncommon',
    category: 'dedication',
    mockPercent: 28,
  },
  {
    id: 'rare-finder',
    name: 'Rare Finder',
    description: 'Pull a Rare card from a pack',
    icon: 'R',
    rarity: 'common',
    category: 'discovery',
    mockPercent: 78,
  },
  {
    id: 'epic-moment',
    name: 'Epic Moment',
    description: 'Pull an Epic card from a pack',
    icon: 'E',
    rarity: 'uncommon',
    category: 'discovery',
    mockPercent: 35,
  },
  {
    id: 'legendary-pull',
    name: 'Legendary Pull',
    description: 'Pull a Legendary card',
    icon: 'L',
    rarity: 'rare',
    category: 'discovery',
    mockPercent: 8,
  },
  {
    id: 'gold-touch',
    name: 'Gold Touch',
    description: 'Own 5 Gold parallel cards',
    icon: 'G',
    rarity: 'uncommon',
    category: 'collection',
    mockPercent: 22,
  },
  {
    id: 'holographic-hunter',
    name: 'Holographic Hunter',
    description: 'Own a Holographic card',
    icon: 'H',
    rarity: 'rare',
    category: 'collection',
    mockPercent: 18,
  },
  {
    id: 'obsidian-collector',
    name: 'Obsidian Collector',
    description: 'Own an Obsidian card',
    icon: 'O',
    rarity: 'epic',
    category: 'collection',
    mockPercent: 3,
  },
  {
    id: 'deck-builder',
    name: 'Deck Builder',
    description: 'Save your first battle deck',
    icon: 'B',
    rarity: 'common',
    category: 'battle',
    mockPercent: 60,
  },
  {
    id: 'ten-wins',
    name: 'Gladiator',
    description: 'Win 10 card battles',
    icon: 'X',
    rarity: 'uncommon',
    category: 'battle',
    mockPercent: 25,
  },
  {
    id: 'trivia-master',
    name: 'Trivia Master',
    description: 'Score perfect in a trivia round',
    icon: 'T',
    rarity: 'rare',
    category: 'battle',
    mockPercent: 10,
  },
  {
    id: 'level-10',
    name: 'Rising Collector',
    description: 'Reach collector level 10',
    icon: '10',
    rarity: 'uncommon',
    category: 'dedication',
    mockPercent: 30,
  },
  {
    id: 'level-25',
    name: 'Enthusiast',
    description: 'Reach collector level 25',
    icon: '25',
    rarity: 'rare',
    category: 'dedication',
    mockPercent: 8,
  },
  {
    id: 'all-sets',
    name: 'World Traveler',
    description: 'Own at least one card from every set',
    icon: 'A',
    rarity: 'uncommon',
    category: 'collection',
    mockPercent: 42,
  },
  {
    id: 'fifty-wins',
    name: 'War Hero',
    description: 'Win 50 card battles',
    icon: '50',
    rarity: 'rare',
    category: 'battle',
    mockPercent: 6,
  },
  {
    id: 'pack-rat',
    name: 'Pack Rat',
    description: 'Own 30+ unique cards',
    icon: 'P',
    rarity: 'uncommon',
    category: 'collection',
    mockPercent: 32,
  },
  {
    id: 'hoarder',
    name: 'Hoarder',
    description: 'Own 50+ cards',
    icon: 'H',
    rarity: 'uncommon',
    category: 'collection',
    mockPercent: 20,
  },
  {
    id: 'full-mythology',
    name: 'Mythology Scholar',
    description: 'Own cards from both Olympus and Asgard',
    icon: 'M',
    rarity: 'uncommon',
    category: 'collection',
    mockPercent: 35,
  },
  {
    id: 'silver-lining',
    name: 'Silver Lining',
    description: 'Own 3 Silver parallel cards',
    icon: 'S',
    rarity: 'common',
    category: 'collection',
    mockPercent: 55,
  },
  {
    id: 'five-legendaries',
    name: 'Dragon Hoard',
    description: 'Own 5 Legendary cards',
    icon: 'D',
    rarity: 'epic',
    category: 'collection',
    mockPercent: 4,
  },
  {
    id: 'genesis-collector',
    name: 'Genesis Collector',
    description: 'Own a card with the Genesis origin badge',
    icon: 'G',
    rarity: 'rare',
    category: 'special',
    mockPercent: 15,
  },
  {
    id: 'battle-worn-card',
    name: 'Scarred Veteran',
    description: 'Own a card with the Battle-Worn aging tier',
    icon: 'V',
    rarity: 'rare',
    category: 'special',
    mockPercent: 9,
  },
  // Lore Codex achievements
  {
    id: 'lore-seeker',
    name: 'Lore Seeker',
    description: 'Unlock your first Codex node',
    icon: 'L',
    rarity: 'common',
    category: 'discovery',
    mockPercent: 60,
  },
  {
    id: 'lore-scholar',
    name: 'Lore Scholar',
    description: 'Unlock 10 Codex nodes',
    icon: 'S',
    rarity: 'uncommon',
    category: 'discovery',
    mockPercent: 25,
  },
  {
    id: 'lore-master',
    name: 'Lore Master',
    description: 'Unlock 30 Codex nodes',
    icon: 'M',
    rarity: 'epic',
    category: 'discovery',
    mockPercent: 5,
  },
  {
    id: 'secret-thread',
    name: 'Secret Thread',
    description: 'Discover a secret cross-set lore thread',
    icon: '?',
    rarity: 'rare',
    category: 'special',
    mockPercent: 8,
  },
  {
    id: 'codex-complete',
    name: 'Grand Archivist',
    description: 'Unlock every node in the Lore Codex',
    icon: 'A',
    rarity: 'legendary',
    category: 'special',
    mockPercent: 1,
  },
];

// ---------------------------------------------------------------------------
// Achievement checking — returns newly earned achievement IDs
// ---------------------------------------------------------------------------
export function checkAchievements(): string[] {
  const newlyEarned: string[] = [];
  const owned = getOwnedCards();
  const stats = getGameStats();
  const streak = getStreak();
  const level = getCollectorLevel();
  const earned = new Set(getEarnedAchievements().map(a => a.achievementId));

  // Helper
  function tryEarn(id: string, condition: boolean) {
    if (!earned.has(id) && condition) {
      if (earnAchievement(id)) {
        newlyEarned.push(id);
      }
    }
  }

  // Check each
  tryEarn('first-pull', owned.length > 5); // starter cards don't count
  tryEarn('day-one', (() => {
    const meta = getCardMeta();
    const allDates = Object.values(meta).map(c => c.acquiredAt).filter(Boolean).sort();
    if (allDates.length < 2) return false;
    const first = new Date(allDates[0]).getTime();
    const latest = new Date(allDates[allDates.length - 1]).getTime();
    return (latest - first) < 86400000 && owned.length > 10;
  })());
  tryEarn('set-starter', new Set(owned.map(c => c.setSlug)).size >= 3);
  tryEarn('battle-tested', stats.battlesWon >= 5);
  tryEarn('quiz-whiz', stats.longestTriviaStreak >= 5);
  tryEarn('whale', owned.length >= 100);
  tryEarn('streak-master', streak >= 7);
  tryEarn('rare-finder', owned.some(c => c.scarcity === 'rare'));
  tryEarn('epic-moment', owned.some(c => c.scarcity === 'epic'));
  tryEarn('legendary-pull', owned.some(c => c.scarcity === 'legendary'));
  tryEarn('gold-touch', owned.filter(c => c.parallel === 'gold').length >= 5);
  tryEarn('holographic-hunter', owned.some(c => c.parallel === 'holographic'));
  tryEarn('obsidian-collector', owned.some(c => c.parallel === 'obsidian'));
  tryEarn('deck-builder', stats.battlesPlayed > 0);
  tryEarn('ten-wins', stats.battlesWon >= 10);
  tryEarn('trivia-master', stats.triviaHighScore >= 10);
  tryEarn('level-10', level.level >= 10);
  tryEarn('level-25', level.level >= 25);
  tryEarn('all-sets', new Set(owned.map(c => c.setSlug)).size >= 6);

  // Completionist — check each set
  const setsBySlug: Record<string, Set<string>> = {};
  for (const c of owned) {
    if (!setsBySlug[c.setSlug]) setsBySlug[c.setSlug] = new Set();
    setsBySlug[c.setSlug].add(c.character);
  }
  const anyComplete = Object.entries(setsBySlug).some(([slug, chars]) => {
    return chars.size >= 20; // each set has 20 characters
  });
  tryEarn('completionist', anyComplete);

  // New achievements
  tryEarn('fifty-wins', stats.battlesWon >= 50);
  tryEarn('pack-rat', owned.length >= 30); // ~6 packs worth of unique cards
  tryEarn('hoarder', owned.length >= 50);
  const slugs = new Set(owned.map(c => c.setSlug));
  tryEarn('full-mythology', slugs.has('olympus') && slugs.has('asgard'));
  tryEarn('silver-lining', owned.filter(c => c.parallel === 'silver').length >= 3);
  tryEarn('five-legendaries', owned.filter(c => c.scarcity === 'legendary').length >= 5);
  tryEarn('genesis-collector', owned.some(c => getOriginBadge(c.id)?.id === 'genesis'));
  tryEarn('battle-worn-card', owned.some(c => {
    const t = getAgingTiers(c.id);
    return t.battle === 'battle-worn' || t.battle === 'veteran';
  }));

  // Lore Codex
  const unlockedLore = getUnlockedLoreNodes();
  const secretNodes = getSecretNodes();
  tryEarn('lore-seeker', unlockedLore.length >= 1);
  tryEarn('lore-scholar', unlockedLore.length >= 10);
  tryEarn('lore-master', unlockedLore.length >= 30);
  tryEarn('secret-thread', secretNodes.some(n => unlockedLore.includes(n.id)));
  tryEarn('codex-complete', unlockedLore.length >= 48);

  return newlyEarned;
}

export const ACHIEVEMENT_CATEGORIES: { id: AchievementCategory; label: string; icon: string }[] = [
  { id: 'collection', label: 'Collection', icon: '📦' },
  { id: 'battle', label: 'Battle', icon: '⚔️' },
  { id: 'discovery', label: 'Discovery', icon: '🔍' },
  { id: 'dedication', label: 'Dedication', icon: '🔥' },
  { id: 'special', label: 'Special', icon: '✨' },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common': return '#6b7094';
    case 'uncommon': return '#22c55e';
    case 'rare': return '#3b82f6';
    case 'epic': return '#a855f7';
    case 'legendary': return '#f59e0b';
  }
}
