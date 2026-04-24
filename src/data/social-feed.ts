// Social feed — system-generated events that drive FOMO, competition, and engagement
// These are SHORT items (1-2 lines) unlike editorial FeedEntries (full articles)

export type SocialFeedType = 'pull' | 'milestone' | 'mover' | 'leaderboard' | 'challenge' | 'whale';

export interface SocialFeedItem {
  id: string;
  type: SocialFeedType;
  text: string;
  subtext?: string;
  accent: string;
  icon: string;
  timestamp: string; // relative: "2m ago", "1h ago"
  link?: string;
}

export const SOCIAL_FEED_CONFIG: Record<SocialFeedType, { label: string; color: string }> = {
  pull: { label: 'Pull', color: '#f59e0b' },
  milestone: { label: 'Milestone', color: '#22c55e' },
  mover: { label: 'Market', color: '#ef4444' },
  leaderboard: { label: 'Rank', color: '#818cf8' },
  challenge: { label: 'Challenge', color: '#a855f7' },
  whale: { label: 'Whale', color: '#3b82f6' },
};

// Mock social feed — in production, these would be real-time events
export const SOCIAL_FEED: SocialFeedItem[] = [
  {
    id: 'sf-1',
    type: 'pull',
    text: 'NeonPhoenix pulled a Legendary Medusa',
    subtext: 'Olympus Rising \u00B7 Obsidian Parallel',
    accent: '#f59e0b',
    icon: '\u{1F525}',
    timestamp: '2m ago',
    link: '/packs',
  },
  {
    id: 'sf-2',
    type: 'mover',
    text: 'Sherlock Holmes +34% in 24h',
    subtext: 'Baker Street Files \u00B7 12 sales today',
    accent: '#22c55e',
    icon: '\u{1F4C8}',
    timestamp: '15m ago',
    link: '/marketplace',
  },
  {
    id: 'sf-3',
    type: 'milestone',
    text: 'ShadowKing completed Enchanted Kingdom',
    subtext: '1 of 23 collectors with full set',
    accent: '#a855f7',
    icon: '\u{1F3C6}',
    timestamp: '1h ago',
  },
  {
    id: 'sf-4',
    type: 'pull',
    text: 'CryptoCollector99 pulled Epic Zeus',
    subtext: 'Gold Parallel \u00B7 Serial #003/50',
    accent: '#ffd700',
    icon: '\u26A1',
    timestamp: '1h ago',
    link: '/packs',
  },
  {
    id: 'sf-5',
    type: 'whale',
    text: 'Top 10 collectors bought 47 Baker Street cards this week',
    subtext: 'Smart money is accumulating',
    accent: '#3b82f6',
    icon: '\u{1F40B}',
    timestamp: '3h ago',
    link: '/marketplace',
  },
  {
    id: 'sf-6',
    type: 'mover',
    text: 'Dracula "The Eternal Night" hit new floor: $89',
    subtext: 'Gothic Horror \u00B7 Down 12% \u2014 buying opportunity?',
    accent: '#ef4444',
    icon: '\u{1F4C9}',
    timestamp: '4h ago',
    link: '/marketplace',
  },
  {
    id: 'sf-7',
    type: 'challenge',
    text: 'Weekend Challenge: Build a 5-card Mythic deck',
    subtext: 'Top 50 win exclusive card frames \u00B7 Ends Sunday',
    accent: '#a855f7',
    icon: '\u{1F3AF}',
    timestamp: '5h ago',
    link: '/challenges',
  },
  {
    id: 'sf-8',
    type: 'milestone',
    text: 'VaultKeeper reached Level 25 \u2014 Elite tier',
    subtext: 'Top 3% of all collectors',
    accent: '#f59e0b',
    icon: '\u2B50',
    timestamp: '6h ago',
  },
  {
    id: 'sf-9',
    type: 'pull',
    text: 'MythHunter pulled 2 Legendaries in one pack',
    subtext: 'Poseidon + Rumpelstiltskin \u00B7 0.01% odds',
    accent: '#ff6ec7',
    icon: '\u{1F4A5}',
    timestamp: '8h ago',
    link: '/packs',
  },
  {
    id: 'sf-10',
    type: 'leaderboard',
    text: 'You\u2019re #127 in Olympus Rising collectors',
    subtext: '3 cards from top 100 \u2014 keep going',
    accent: '#818cf8',
    icon: '\u{1F4CA}',
    timestamp: 'now',
  },
];
