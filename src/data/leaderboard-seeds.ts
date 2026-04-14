// Deterministic phantom collectors for leaderboard population
// These simulate a living collector community

export interface PhantomCollector {
  id: string;
  username: string;
  totalCards: number;
  rareCards: number;  // epic + legendary count
  oldestCardDays: number;
  achievementCount: number;
  rank: 'bronze' | 'silver' | 'gold' | 'mythic';
  codexPercent: number;
  lastActive: number; // days ago
  pinnedBadges: string[];
}

// Seeded random for deterministic generation
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

const USERNAMES = [
  'VaultKeeper', 'MythHunter', 'LoreSeeker', 'CardShark', 'PackRipper',
  'LegendChaser', 'SerialKing', 'GoldTouch', 'OdinsEye', 'FrostGiant',
  'ObsidianHand', 'GenesisOne', 'VeteranPull', 'HoloHunter', 'SetMaster',
  'NorseWolf', 'TitanGrip', 'AncientOne', 'PristineKeep', 'CrownHolder',
  'LuckySeven', 'DeepLore', 'RuneReader', 'ValkyrieRide', 'ThunderClap',
  'SerpentCoil', 'MistFinder', 'FireForge', 'IceVault', 'DawnBreaker',
];

const BADGE_POOL = [
  'first-pull', 'set-starter', 'whale', 'battle-tested', 'quiz-whiz',
  'streak-master', 'rare-finder', 'legendary-pull', 'completionist',
  'gold-touch', 'ten-wins', 'level-10', 'all-sets', 'pack-rat',
];

function getRank(cards: number, rares: number, achievements: number): PhantomCollector['rank'] {
  const score = cards * 1 + rares * 10 + achievements * 5;
  if (score >= 800) return 'mythic';
  if (score >= 400) return 'gold';
  if (score >= 150) return 'silver';
  return 'bronze';
}

export function generatePhantomCollectors(): PhantomCollector[] {
  const collectors: PhantomCollector[] = [];
  const rand = seeded(42424242);

  for (let i = 0; i < 30; i++) {
    const totalCards = Math.floor(rand() * 180) + 20;
    const rareCards = Math.floor(totalCards * (0.05 + rand() * 0.15));
    const oldestCardDays = Math.floor(rand() * 90) + 7;
    const achievementCount = Math.floor(rand() * 22) + 3;
    const codexPercent = Math.floor(rand() * 70) + 10;
    const lastActive = Math.floor(rand() * 14);

    const badges: string[] = [];
    for (let b = 0; b < 3; b++) {
      const badge = pick(BADGE_POOL, rand);
      if (!badges.includes(badge)) badges.push(badge);
    }

    collectors.push({
      id: `phantom-${i}`,
      username: USERNAMES[i],
      totalCards,
      rareCards,
      oldestCardDays,
      achievementCount,
      rank: getRank(totalCards, rareCards, achievementCount),
      codexPercent,
      lastActive,
      pinnedBadges: badges,
    });
  }

  return collectors;
}

// Rank configuration
export const RANK_CONFIG = {
  bronze: { label: 'Bronze Collector', color: '#cd7f32', icon: '🥉', threshold: 0 },
  silver: { label: 'Silver Collector', color: '#c0c0c0', icon: '🥈', threshold: 150 },
  gold: { label: 'Gold Collector', color: '#ffd700', icon: '🥇', threshold: 400 },
  mythic: { label: 'Mythic Collector', color: '#a855f7', icon: '👑', threshold: 800 },
} as const;

export type CollectorRank = keyof typeof RANK_CONFIG;

export function getCollectorRank(totalCards: number, rareCards: number, achievementCount: number): CollectorRank {
  const score = totalCards * 1 + rareCards * 10 + achievementCount * 5;
  if (score >= 800) return 'mythic';
  if (score >= 400) return 'gold';
  if (score >= 150) return 'silver';
  return 'bronze';
}
