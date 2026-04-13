export interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
}

export const GUIDE_SECTIONS: GuideSection[] = [
  { id: 'collecting', title: 'How Collecting Works', subtitle: 'Packs, scarcity, parallels & serial numbers', icon: '\u{1F4E6}', accent: '#818cf8' },
  { id: 'vip', title: 'VIP Program', subtitle: 'Bronze through Diamond tier benefits', icon: '\u{1F451}', accent: '#ffd700' },
  { id: 'rewards', title: 'Rewards & Progression', subtitle: 'XP, levels, battle pass & daily missions', icon: '\u26A1', accent: '#22c55e' },
  { id: 'marketplace', title: 'Marketplace Guide', subtitle: 'Prices, trends, floor price & timing', icon: '\u{1F4B0}', accent: '#3b82f6' },
  { id: 'battle', title: 'Battle & Trivia', subtitle: 'Rules, stats & strategy', icon: '\u2694\uFE0F', accent: '#ef4444' },
  { id: 'sets', title: 'Set Completion', subtitle: 'Why sets matter & completion rewards', icon: '\u{1F4DA}', accent: '#a855f7' },
  { id: 'parallels', title: 'Parallels & Rarity', subtitle: 'Base through Obsidian visual guide', icon: '\u2728', accent: '#ff6ec7' },
];
