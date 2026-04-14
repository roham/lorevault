export type FeedType = 'drop' | 'strategy' | 'spotlight' | 'season' | 'feature' | 'market';

export interface FeedEntry {
  id: string;
  slug: string;
  type: FeedType;
  title: string;
  subtitle: string;
  body: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  ctaLabel: string;
  ctaLink: string;
  date: string;
  pinned?: boolean;
  artPath?: string; // card art image to use as background
}

export const FEED_TYPE_CONFIG: Record<FeedType, { label: string; color: string }> = {
  drop: { label: 'New Drop', color: '#f59e0b' },
  strategy: { label: 'Strategy', color: '#22c55e' },
  spotlight: { label: 'Spotlight', color: '#3b82f6' },
  season: { label: 'Season', color: '#a855f7' },
  feature: { label: 'Feature', color: '#818cf8' },
  market: { label: 'Market', color: '#ef4444' },
};

export const FEED_CONTENT: FeedEntry[] = [
  {
    id: 'olympus-guide',
    slug: 'olympus-rising-full-set-guide',
    type: 'drop',
    title: 'Olympus Rising: The Full Set Guide',
    subtitle: 'Every card ranked by pull rate and market value',
    body: `Zeus "Lightning Crown" is the chase card of the entire collection. At a 0.8% legendary pull rate, it commands the highest floor price of any single moment in LoreVault.\n\nBut the real story is depth. Olympus has the most balanced scarcity distribution of any set \u2014 20 characters spanning gods, heroes, and monsters. Athena "Battle Cry" and Ares "Blood Shield" are the two highest-value epics, trading at 3x their scarcity class average.\n\nThe sleeper pick: Icarus "Wax Wings" uncommon. It completes three different thematic collections and has the lowest supply of any Olympus uncommon due to early pack distribution.\n\nCompletion reward: 500 XP + exclusive "Olympian" badge + bonus legendary pack.`,
    gradientFrom: '#2e2a0a',
    gradientTo: '#69601b',
    icon: '\u26A1',
    ctaLabel: 'View Set',
    ctaLink: '/collection/sets',
    date: '2026-04-13',
    pinned: true,
    artPath: '/cards/olympus-zeus-wielding-the-thunderbolt.webp',
  },
  {
    id: 'baker-street-floor',
    slug: 'floor-price-strategy-baker-street',
    type: 'strategy',
    title: 'Floor Price Strategy: When to Buy Baker Street',
    subtitle: 'Historical patterns say accumulate now',
    body: `Baker Street Files floor prices dropped 18% since the Enchanted Kingdom release split collector attention. This is a pattern: set floors dip when new drops pull demand, then recover within 2-3 drops as completionists return.\n\nThe play: Lestrade and Watson commons are trading below mint cost. Irene Adler rare has the widest spread between floor and recent sales \u2014 a 22% gap suggesting the floor is artificially low.\n\nHistorical precedent: Wonderland Descending saw the same pattern. Floor dropped 15% after Gothic Horror launch, recovered fully within 6 weeks. Baker Street has stronger fundamentals (highest completion rate of any set).\n\nRisk: if a new set launches before recovery, the floor could test lower. Size positions accordingly.`,
    gradientFrom: '#1a1a2e',
    gradientTo: '#16213e',
    icon: '\u{1F50D}',
    ctaLabel: 'See Prices',
    ctaLink: '/marketplace',
    date: '2026-04-12',
    artPath: '/cards/baker-street-sherlock-holmes-at-221b-baker-street.webp',
  },
  {
    id: 'cheshire-cat',
    slug: 'character-spotlight-cheshire-cat',
    type: 'spotlight',
    title: 'Character Spotlight: The Cheshire Cat',
    subtitle: 'Three moments, three moods \u2014 the most traded Wonderland card',
    body: `"Fading to a Grin" is the #1 most-traded card in the Wonderland Descending set. Something about the disappearing act resonates \u2014 collectors chase the Holographic parallel specifically because the prismatic effect makes the grin shimmer.\n\nThe Cheshire Cat has three moments: "Fading to a Grin" (the chase), "Treetop Riddle" (the sleeper), and "Purple Haze" (the common workhorse). Together they form one of the few 3-moment character collections in LoreVault.\n\nCollector insight: Treetop Riddle has the lowest supply of any Wonderland rare. The character\u2019s popularity drives demand across all three moments, but Treetop is where supply is thinnest.`,
    gradientFrom: '#0a2e1a',
    gradientTo: '#1b6940',
    icon: '\u{1F408}',
    ctaLabel: 'View Cards',
    ctaLink: '/marketplace',
    date: '2026-04-11',
    artPath: '/cards/wonderland-the-cheshire-cat-fading-to-a-grin.webp',
  },
  {
    id: 'season-1-guide',
    slug: 'season-1-age-of-myths-progress-guide',
    type: 'season',
    title: 'Season 1: Age of Myths Progress Guide',
    subtitle: 'Optimal daily loop and tier rewards breakdown',
    body: `The Season 1 battle pass has 30 tiers. Free track gives XP boosts and basic card frames. Premium track gates the exclusive Obsidian showcase theme at tier 25 and a guaranteed legendary pack at tier 30.\n\nThe optimal daily loop: open your free pack (+25 XP), win 2 battles (+60 XP), complete the daily challenge (+40-70 XP), answer 5 trivia questions (+25 XP). That\u2019s ~150-180 XP/day, enough to hit tier 30 in 20 days.\n\nKey milestone: Tier 15 unlocks the "Mythic Frame" card border. Tier 20 unlocks the seasonal profile badge. Tier 25 is the Obsidian showcase theme \u2014 the most sought-after cosmetic this season.`,
    gradientFrom: '#1a103a',
    gradientTo: '#2d1b69',
    icon: '\u{1F3C6}',
    ctaLabel: 'View Progress',
    ctaLink: '/profile',
    date: '2026-04-10',
    artPath: '/cards/olympus-athena-in-battle-armor.webp',
  },
  {
    id: 'gothic-horror-sleeper',
    slug: 'gothic-horror-sleeper-collection',
    type: 'strategy',
    title: 'Gothic Horror: The Sleeper Collection',
    subtitle: 'Lowest completion rate, highest upside',
    body: `Castle of Otranto has the lowest completion rate of any set at 8%. Most collectors stopped after pulling Dracula and moved on. That\u2019s the opportunity.\n\nDracula "The Eternal Night" trades at 2x the next-highest gothic card. But the set\u2019s real value is in the mid-tier: Frankenstein parallels are underpriced relative to equivalent scarcity in other sets, and the Phantom of the Opera legendary has the thinnest market of any legendary in the game.\n\nCompletion strategy: 12 of 20 characters can be acquired below $5 each. The expensive gaps are Dracula (legendary), Phantom (legendary), and Jekyll & Hyde (epic). Total estimated completion cost: ~$85.`,
    gradientFrom: '#2e0a0a',
    gradientTo: '#691b1b',
    icon: '\u{1F987}',
    ctaLabel: 'See Prices',
    ctaLink: '/marketplace',
    date: '2026-04-09',
    artPath: '/cards/gothic-horror-count-dracula-the-castle-at-night.webp',
  },
  {
    id: 'parallels-explainer',
    slug: 'how-parallels-work-obsidian',
    type: 'feature',
    title: 'How Parallels Work (and Why Obsidian Matters)',
    subtitle: 'Base through Obsidian \u2014 pull odds and stat bonuses',
    body: `Every card in LoreVault exists in five parallel variants: Base, Silver, Gold, Holographic, and Obsidian. Higher parallels are rarer pulls and grant stat bonuses in battle.\n\nBase: standard edition, no bonus. Silver: +1 to all stats, subtle shimmer frame. Gold: +2 to all stats, warm glow. Holographic: +3 to all stats, rainbow prismatic effect. Obsidian: +5 to all stats, void-black with iridescent edges.\n\nObsidian cards do not appear in standard packs. They\u2019re exclusive to premium season rewards, VIP Diamond tier drops, and set completion bonuses. A Legendary Obsidian is the rarest possible card \u2014 +13 to every stat (scarcity +8, parallel +5).\n\nThe flex factor: Obsidian cards in your showcase signal that you\u2019re either a top-tier collector or a season completionist. Either way, respect.`,
    gradientFrom: '#0a0a1a',
    gradientTo: '#1a1a3e',
    icon: '\u2728',
    ctaLabel: 'Read Guide',
    ctaLink: '/guide#parallels',
    date: '2026-04-08',
    artPath: '/cards/olympus-medusa-the-petrifying-gaze.webp',
  },
  {
    id: 'enchanted-kingdom',
    slug: 'enchanted-kingdom-complete-breakdown',
    type: 'drop',
    title: 'The Enchanted Kingdom: Complete Breakdown',
    subtitle: '20 Grimm characters, 3 Snow White moments, 1 chase card',
    body: `The Enchanted Kingdom is the largest set in LoreVault with 20 unique characters spanning a dozen classic fairy tales. Snow White leads with 3 moments (the most of any character): "Poisoned Apple," "Mirror Mirror," and "Glass Coffin."\n\nThe chase card: Rumpelstiltskin "Spinning Gold" legendary. It\u2019s the set\u2019s lowest-supply legendary and the centerpiece of most Enchanted Kingdom showcases.\n\nSleeper value: the Evil Queen "Poisoned Apple" epic has the highest trade volume of any epic in the game. Serial #1 sold for the highest single-card price in LoreVault history.\n\nCompletion tip: start with the common/uncommon tier. 14 of 20 characters have commons under $3. The expensive half is the royalty \u2014 queens, kings, and Rumpelstiltskin command premium prices.`,
    gradientFrom: '#1a0a2e',
    gradientTo: '#2d1b69',
    icon: '\u{1F451}',
    ctaLabel: 'View Set',
    ctaLink: '/collection/sets',
    date: '2026-04-07',
    artPath: '/cards/enchanted-kingdom-snow-white-the-poisoned-apple.webp',
  },
];
