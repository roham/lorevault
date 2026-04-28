// LoreVault MLP — shared data types
// Mirrors the cross-route data shape contract in _ia-spec.md.
// All UI components consume these shapes; mock data + future Atlas integration
// both produce data conforming to these types.

export type PaneId = 'lud-border' | 'old-ones-persist' | 'sinterklaas-reigns';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'contraband';

export type ContrabandRelation =
  | 'carries'
  | 'refuses'
  | 'mediates'
  | 'exposes';

export interface Pane {
  id: PaneId;
  displayName: string;
  axiom: string;
  register: string;
  /** Hex color for accents and gradients. */
  color: string;
  contraband: string;
  /** One sentence describing what people fear in the third hour after midnight. */
  thirdHourFear?: string;
  /** The Pane-specific verb used when someone dies. */
  verbForToDie?: string;
}

export interface IcebergLayers {
  /** Two beats. Surface flavor — visible at glance. */
  surface: string[];
  /** One beat. The cross-card echo — revealed on first deeper tap. */
  echo: string;
  /** Eight facets. The buried weight, revealed progressively. */
  deep: string[];
}

export interface LampblackHierarchy {
  gesture: string;
  cosmologicalRelation: string;
  wound: string;
  forbiddenAct: string;
  role: string;
  silhouette: string;
  prop: string;
}

export interface CardScar {
  conflictId: string;
  conflictName: string;
  outcome: 'won' | 'lost';
}

export interface Card {
  id: string;
  name: string;
  pane: PaneId;
  paneDisplayName: string;
  flavorLine: string;
  silhouetteUrl: string | null;
  rarity: Rarity;
  serial: number;
  editionSize: number;
  contrabandRelation: ContrabandRelation | null;
  setId: string;
  scars: CardScar[];
  iceberg: IcebergLayers;
  lampblack: LampblackHierarchy;
}

export interface SetProgress {
  setId: string;
  setName: string;
  pane: Pane;
  owned: number;
  total: number;
  missingCards: { id: string; name: string; floorPrice: number | null }[];
}

export interface DropRarityBand {
  rarity: Rarity;
  pct: number;
}

export interface Drop {
  id: string;
  name: string;
  pane: Pane;
  scheduledAt: string;
  packCount: number;
  pricePerPack: number;
  rarityBands: DropRarityBand[];
  status: 'upcoming' | 'live' | 'sold-out';
  floorPriceAfterDrop?: number;
  trendingPct?: number;
}

export interface Listing {
  id: string;
  card: Card;
  askingPrice: number;
  floorPrice: number;
  seller: string;
  listedAt: string;
}

export interface Challenge {
  id: string;
  cadence: 'daily' | 'weekly' | 'seasonal';
  title: string;
  description: string;
  progress: { current: number; total: number };
  reward: string;
  rewardDetail?: string;
}

export interface Tier {
  num: 0 | 1 | 2 | 3 | 4;
  name: string;
  locked: boolean;
  unlockHint?: string;
}

export interface ConflictEvent {
  id: string;
  name: string;
  panes: [Pane, Pane];
  description: string;
  stakesCloseAt: string;
  stakeCount: Record<string, number>;
  status: 'open' | 'resolved';
  outcome: { winner: Pane; scarsAwarded: number } | null;
}

export interface CollectorProfile {
  handle: string;
  joinedAt: string;
  tier: Tier;
  paneMastery: { pane: Pane; owned: number; total: number }[];
  showcaseCardIds: string[];
  stats: {
    cardsOwned: number;
    setsCompleted: number;
    conflictsStaked: number;
    contrabandHeld: number;
  };
  recentLedger: {
    txHash: string;
    timestamp: string;
    kind: 'pack-open' | 'secondary-buy' | 'conflict-stake' | 'drop-purchase';
    note: string;
  }[];
}
