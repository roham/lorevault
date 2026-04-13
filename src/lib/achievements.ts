'use client';

import { Achievement, AchievementRarity } from '@/data/types';
import { getOwnedCards, getEarnedAchievements, earnAchievement, getGameStats, getStreak, getCollectorLevel } from '@/lib/store';

// ---------------------------------------------------------------------------
// Achievement definitions — 20 achievements
// ---------------------------------------------------------------------------
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-pull',
    name: 'First Pull',
    description: 'Open your first pack',
    icon: '1',
    rarity: 'common',
    mockPercent: 95,
  },
  {
    id: 'set-starter',
    name: 'Set Starter',
    description: 'Own cards from 3 different sets',
    icon: '3',
    rarity: 'common',
    mockPercent: 82,
  },
  {
    id: 'battle-tested',
    name: 'Battle Tested',
    description: 'Win 5 card battles',
    icon: 'W',
    rarity: 'uncommon',
    mockPercent: 45,
  },
  {
    id: 'quiz-whiz',
    name: 'Quiz Whiz',
    description: 'Get a trivia streak of 5',
    icon: '?',
    rarity: 'uncommon',
    mockPercent: 38,
  },
  {
    id: 'whale',
    name: 'Whale',
    description: 'Own 100+ cards',
    icon: 'W',
    rarity: 'rare',
    mockPercent: 12,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Complete an entire set',
    icon: 'C',
    rarity: 'epic',
    mockPercent: 5,
  },
  {
    id: 'day-one',
    name: 'Day One',
    description: 'Collected during first 24 hours',
    icon: 'D',
    rarity: 'rare',
    mockPercent: 15,
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day login streak',
    icon: '7',
    rarity: 'uncommon',
    mockPercent: 28,
  },
  {
    id: 'rare-finder',
    name: 'Rare Finder',
    description: 'Pull a Rare card from a pack',
    icon: 'R',
    rarity: 'common',
    mockPercent: 78,
  },
  {
    id: 'epic-moment',
    name: 'Epic Moment',
    description: 'Pull an Epic card from a pack',
    icon: 'E',
    rarity: 'uncommon',
    mockPercent: 35,
  },
  {
    id: 'legendary-pull',
    name: 'Legendary Pull',
    description: 'Pull a Legendary card',
    icon: 'L',
    rarity: 'rare',
    mockPercent: 8,
  },
  {
    id: 'gold-touch',
    name: 'Gold Touch',
    description: 'Own 5 Gold parallel cards',
    icon: 'G',
    rarity: 'uncommon',
    mockPercent: 22,
  },
  {
    id: 'holographic-hunter',
    name: 'Holographic Hunter',
    description: 'Own a Holographic card',
    icon: 'H',
    rarity: 'rare',
    mockPercent: 18,
  },
  {
    id: 'obsidian-collector',
    name: 'Obsidian Collector',
    description: 'Own an Obsidian card',
    icon: 'O',
    rarity: 'epic',
    mockPercent: 3,
  },
  {
    id: 'deck-builder',
    name: 'Deck Builder',
    description: 'Save your first battle deck',
    icon: 'B',
    rarity: 'common',
    mockPercent: 60,
  },
  {
    id: 'ten-wins',
    name: 'Gladiator',
    description: 'Win 10 card battles',
    icon: 'X',
    rarity: 'uncommon',
    mockPercent: 25,
  },
  {
    id: 'trivia-master',
    name: 'Trivia Master',
    description: 'Score perfect in a trivia round',
    icon: 'T',
    rarity: 'rare',
    mockPercent: 10,
  },
  {
    id: 'level-10',
    name: 'Rising Collector',
    description: 'Reach collector level 10',
    icon: '10',
    rarity: 'uncommon',
    mockPercent: 30,
  },
  {
    id: 'level-25',
    name: 'Enthusiast',
    description: 'Reach collector level 25',
    icon: '25',
    rarity: 'rare',
    mockPercent: 8,
  },
  {
    id: 'all-sets',
    name: 'World Traveler',
    description: 'Own at least one card from every set',
    icon: 'A',
    rarity: 'uncommon',
    mockPercent: 42,
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
  tryEarn('all-sets', new Set(owned.map(c => c.setSlug)).size >= 5);

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

  return newlyEarned;
}

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
