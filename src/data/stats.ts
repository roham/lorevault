// Battle stats for all characters
// Stats: Power (physical strength/combat), Intelligence, Mystery (stealth/cunning), Legend (fame/influence), Charm (charisma)
// All 1-99. No character best at everything — every character has tradeoffs.

export interface BattleStats {
  power: number;
  intelligence: number;
  mystery: number;
  legend: number;
  charm: number;
}

export type StatKey = keyof BattleStats;

export const STAT_LABELS: Record<StatKey, string> = {
  power: 'Power',
  intelligence: 'Intelligence',
  mystery: 'Mystery',
  legend: 'Legend',
  charm: 'Charm',
};

export const STAT_ICONS: Record<StatKey, string> = {
  power: '💪',
  intelligence: '🧠',
  mystery: '🔮',
  legend: '⭐',
  charm: '💎',
};

export const STAT_COLORS: Record<StatKey, string> = {
  power: '#ef4444',
  intelligence: '#3b82f6',
  mystery: '#a855f7',
  legend: '#f59e0b',
  charm: '#ec4899',
};

// CHARACTER_STATS keyed by character name (matches card.character)
export const CHARACTER_STATS: Record<string, BattleStats> = {
  // ===== Baker Street Files =====
  'Sherlock Holmes': { power: 45, intelligence: 99, mystery: 85, legend: 95, charm: 60 },
  'Dr. Watson': { power: 65, intelligence: 72, mystery: 40, legend: 70, charm: 82 },
  'Professor Moriarty': { power: 35, intelligence: 97, mystery: 92, legend: 85, charm: 30 },
  'Irene Adler': { power: 25, intelligence: 88, mystery: 90, legend: 65, charm: 95 },
  'Mrs. Hudson': { power: 15, intelligence: 55, mystery: 30, legend: 40, charm: 78 },
  'Inspector Lestrade': { power: 60, intelligence: 52, mystery: 35, legend: 50, charm: 45 },
  'The Hound': { power: 88, intelligence: 10, mystery: 75, legend: 55, charm: 5 },
  'Mycroft Holmes': { power: 20, intelligence: 98, mystery: 70, legend: 60, charm: 35 },
  'Sebastian Moran': { power: 80, intelligence: 55, mystery: 78, legend: 40, charm: 20 },
  'The Red-Headed League': { power: 10, intelligence: 30, mystery: 65, legend: 25, charm: 55 },
  'The Dancing Men': { power: 5, intelligence: 45, mystery: 88, legend: 20, charm: 15 },
  'The Baker Street Irregulars': { power: 30, intelligence: 40, mystery: 80, legend: 30, charm: 70 },

  // ===== The Enchanted Kingdom =====
  'Snow White': { power: 20, intelligence: 50, mystery: 45, legend: 90, charm: 97 },
  'The Evil Queen': { power: 55, intelligence: 85, mystery: 88, legend: 80, charm: 40 },
  'The Huntsman': { power: 75, intelligence: 40, mystery: 50, legend: 35, charm: 55 },
  'Rapunzel': { power: 15, intelligence: 55, mystery: 60, legend: 70, charm: 85 },
  'Cinderella': { power: 12, intelligence: 50, mystery: 35, legend: 88, charm: 92 },
  'Red Riding Hood': { power: 25, intelligence: 45, mystery: 55, legend: 75, charm: 80 },
  'Hansel': { power: 40, intelligence: 60, mystery: 45, legend: 50, charm: 55 },
  'Gretel': { power: 35, intelligence: 70, mystery: 50, legend: 50, charm: 60 },
  'The Frog Prince': { power: 30, intelligence: 45, mystery: 70, legend: 55, charm: 75 },
  'Rumpelstiltskin': { power: 40, intelligence: 82, mystery: 95, legend: 60, charm: 15 },
  'Sleeping Beauty': { power: 8, intelligence: 35, mystery: 72, legend: 82, charm: 90 },
  'The Seven Dwarfs': { power: 70, intelligence: 50, mystery: 40, legend: 65, charm: 75 },
  'The Pied Piper': { power: 10, intelligence: 65, mystery: 85, legend: 70, charm: 88 },
  'Beauty': { power: 18, intelligence: 70, mystery: 40, legend: 75, charm: 98 },
  'The Beast': { power: 95, intelligence: 60, mystery: 55, legend: 72, charm: 25 },
  'Jack': { power: 50, intelligence: 45, mystery: 40, legend: 65, charm: 72 },
  'Puss in Boots': { power: 55, intelligence: 78, mystery: 82, legend: 55, charm: 90 },
  'Bluebeard': { power: 72, intelligence: 60, mystery: 92, legend: 45, charm: 35 },

  // ===== Wonderland Descending =====
  'Alice': { power: 20, intelligence: 75, mystery: 50, legend: 85, charm: 88 },
  'The Cheshire Cat': { power: 10, intelligence: 80, mystery: 99, legend: 78, charm: 70 },
  'The Mad Hatter': { power: 15, intelligence: 65, mystery: 80, legend: 72, charm: 85 },
  'The Queen of Hearts': { power: 70, intelligence: 40, mystery: 45, legend: 82, charm: 30 },
  'The White Rabbit': { power: 12, intelligence: 55, mystery: 60, legend: 65, charm: 72 },
  'The Caterpillar': { power: 5, intelligence: 90, mystery: 85, legend: 50, charm: 40 },
  'Tweedledee & Tweedledum': { power: 35, intelligence: 25, mystery: 30, legend: 45, charm: 65 },
  'The March Hare': { power: 20, intelligence: 35, mystery: 55, legend: 40, charm: 60 },
  'The Dormouse': { power: 5, intelligence: 30, mystery: 50, legend: 20, charm: 55 },
  'The Jabberwock': { power: 97, intelligence: 15, mystery: 70, legend: 60, charm: 5 },
  'The Knave of Hearts': { power: 45, intelligence: 35, mystery: 55, legend: 35, charm: 50 },
  'The Mock Turtle': { power: 20, intelligence: 50, mystery: 45, legend: 30, charm: 65 },
  'The Duchess': { power: 30, intelligence: 40, mystery: 35, legend: 38, charm: 42 },
  'The King of Hearts': { power: 25, intelligence: 30, mystery: 20, legend: 55, charm: 40 },

  // ===== The Castle of Otranto (Gothic Horror) =====
  'Count Dracula': { power: 92, intelligence: 88, mystery: 95, legend: 99, charm: 85 },
  "Frankenstein's Monster": { power: 99, intelligence: 55, mystery: 60, legend: 90, charm: 10 },
  'Dr. Jekyll': { power: 30, intelligence: 92, mystery: 80, legend: 70, charm: 65 },
  'Mr. Hyde': { power: 85, intelligence: 40, mystery: 75, legend: 65, charm: 8 },
  'The Phantom': { power: 50, intelligence: 82, mystery: 92, legend: 80, charm: 55 },
  'Dorian Gray': { power: 30, intelligence: 72, mystery: 78, legend: 75, charm: 99 },
  'The Invisible Man': { power: 45, intelligence: 85, mystery: 98, legend: 55, charm: 15 },
  'Victor Frankenstein': { power: 22, intelligence: 95, mystery: 65, legend: 72, charm: 40 },
  'Mina Harker': { power: 35, intelligence: 70, mystery: 55, legend: 50, charm: 75 },
  'Van Helsing': { power: 72, intelligence: 85, mystery: 60, legend: 68, charm: 55 },
  'The Headless Horseman': { power: 82, intelligence: 12, mystery: 90, legend: 62, charm: 5 },
  'Dr. Moreau': { power: 28, intelligence: 90, mystery: 82, legend: 50, charm: 20 },
  'The Time Traveller': { power: 25, intelligence: 93, mystery: 75, legend: 58, charm: 50 },
  'Captain Nemo': { power: 60, intelligence: 92, mystery: 88, legend: 65, charm: 45 },
  'Quasimodo': { power: 85, intelligence: 35, mystery: 40, legend: 72, charm: 20 },
  'Renfield': { power: 40, intelligence: 30, mystery: 65, legend: 25, charm: 10 },
  'Lucy Westenra': { power: 55, intelligence: 45, mystery: 60, legend: 40, charm: 82 },

  // ===== Olympus Rising =====
  'Odysseus': { power: 70, intelligence: 95, mystery: 72, legend: 92, charm: 80 },
  'Achilles': { power: 98, intelligence: 55, mystery: 30, legend: 97, charm: 60 },
  'Medusa': { power: 75, intelligence: 50, mystery: 92, legend: 82, charm: 12 },
  'Perseus': { power: 82, intelligence: 65, mystery: 50, legend: 85, charm: 70 },
  'Athena': { power: 80, intelligence: 98, mystery: 60, legend: 90, charm: 72 },
  'Zeus': { power: 99, intelligence: 70, mystery: 50, legend: 98, charm: 75 },
  'Poseidon': { power: 95, intelligence: 60, mystery: 65, legend: 88, charm: 55 },
  'Hades': { power: 90, intelligence: 80, mystery: 92, legend: 85, charm: 30 },
  'Hercules': { power: 99, intelligence: 40, mystery: 20, legend: 95, charm: 70 },
  'Helen of Troy': { power: 8, intelligence: 60, mystery: 45, legend: 95, charm: 99 },
  'Icarus': { power: 35, intelligence: 40, mystery: 55, legend: 78, charm: 65 },
  'Prometheus': { power: 60, intelligence: 92, mystery: 70, legend: 88, charm: 45 },
  'Orpheus': { power: 15, intelligence: 65, mystery: 80, legend: 75, charm: 95 },
  'Circe': { power: 55, intelligence: 88, mystery: 95, legend: 70, charm: 82 },
  'The Minotaur': { power: 96, intelligence: 15, mystery: 60, legend: 72, charm: 5 },
  'Ares': { power: 97, intelligence: 30, mystery: 25, legend: 80, charm: 35 },
  'Apollo': { power: 70, intelligence: 82, mystery: 55, legend: 85, charm: 92 },
  'Pandora': { power: 10, intelligence: 55, mystery: 90, legend: 80, charm: 75 },
};

// Get stats for a character, with fallback
export function getCharacterStats(characterName: string): BattleStats {
  return CHARACTER_STATS[characterName] ?? {
    power: 50,
    intelligence: 50,
    mystery: 50,
    legend: 50,
    charm: 50,
  };
}

// Scarcity bonus: rarer cards get stat bonuses
export function getScarcityBonus(scarcity: string): number {
  switch (scarcity) {
    case 'legendary': return 8;
    case 'epic': return 5;
    case 'rare': return 3;
    case 'uncommon': return 1;
    default: return 0;
  }
}

// Parallel bonus: special parallels get a small edge
export function getParallelBonus(parallel: string): number {
  switch (parallel) {
    case 'obsidian': return 5;
    case 'holographic': return 3;
    case 'gold': return 2;
    case 'silver': return 1;
    default: return 0;
  }
}

// Effective stat = base stat + scarcity bonus + parallel bonus (capped at 99)
export function getEffectiveStat(
  baseStats: BattleStats,
  stat: StatKey,
  scarcity: string,
  parallel: string
): number {
  const base = baseStats[stat];
  const bonus = getScarcityBonus(scarcity) + getParallelBonus(parallel);
  return Math.min(99, base + bonus);
}
