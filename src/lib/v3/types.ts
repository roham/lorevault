/**
 * V3 cross-surface contracts — Phase V3 IA Spec §5 + §1.6.
 *
 * This file is the single source of truth for the data shapes that flow
 * between v3 surfaces. All implementers MUST import from this file rather
 * than redefine. Renaming a field is a doctrine update.
 *
 * Companion spec: lorevault-wiki/specs/PHASE-V3-IA.md.
 *
 * NOTE on `LucideIcon`: lucide-react is not yet installed in this repo. Once
 * `npm install lucide-react` lands, swap the local fallback below for:
 *
 *   import type { LucideIcon } from 'lucide-react';
 *
 * The structural fallback is shape-compatible with lucide-react's
 * `LucideIcon` (a `ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>`),
 * so the swap is import-only — call sites do not change.
 */

import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

// --- Shared type aliases ---------------------------------------------------

export type CardTier = 'common' | 'rare' | 'legendary' | 'ultimate';
export type PackTier = 'sample' | 'standard' | 'curated' | 'premium' | 'apex';
export type Universe = 'baker-street' | 'enchanted-kingdom' | 'wonderland' | 'gothic-horror' | 'greek-myth';
export type ParallelType = 'arcana' | 'aether' | 'witness' | 'neon' | 'one-off';

// --- Local LucideIcon fallback (drop when lucide-react is installed) -------

interface LucideProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type LucideIcon = ForwardRefExoticComponent<
  LucideProps & RefAttributes<SVGSVGElement>
>;

// --- §1.6 NavItem ----------------------------------------------------------

export interface NavItem {
  label: string;
  icon: LucideIcon;
  /** Static href — used as fallback when `hrefResolver` is absent or not applicable. */
  href: string;
  /** Dynamic href override. The Open tab uses `({ isOnboarded }) => isOnboarded ? '/v3/pack/latest' : '/v3/welcome'`. All other tabs use static `href`. */
  hrefResolver?: (ctx: { isOnboarded: boolean }) => string;
  /**
   * Active-state matching. An exact path matches verbatim; a path ending in
   * `/*` matches any sub-path under the prefix. The active tab is the FIRST
   * NavItem in the canonical list whose `matchPaths` matches the current
   * pathname — order is left-to-right priority.
   */
  matchPaths?: string[];
}

// --- §5.1 Sticker-book → Buy-flow ------------------------------------------

export interface StickerGapContext {
  cardId: string;
  setId: string;
  setName: string;
  /** 1..20 — the card's index inside its 20-Moment Set */
  positionInSet: number;
  /** count of gaps in this Set, including this one */
  missingCount: number;
  tier: CardTier;
  universe: Universe;
}

// --- §5.2 Pack-rip → Collection --------------------------------------------

export interface PackRevealResult {
  packId: string;
  cardIds: string[];
  /** subset of `cardIds` that the user did not previously own */
  newToCollection: string[];
  /**
   * Driven by the highest-rarity card in `cardIds`:
   *   Common → 'standard', Rare → 'shimmer',
   *   Legendary → 'glow',  Ultimate → 'flash'.
   */
  animationTrigger: 'standard' | 'shimmer' | 'glow' | 'flash';
  /** one toast string per card; e.g. "Sherlock Holmes — Baker Street RARE" */
  toastMessages: string[];
}

// --- §5.3 Collection → Profile ---------------------------------------------

export interface CollectionSummary {
  totalOwned: number;
  setProgress: { setId: string; owned: number; total: number }[];
  parallelProgress: { parallel: ParallelType; owned: number; totalEligible: number }[];
  serialSets: { targetSerial: number; owned: number; total: number }[];
  /** setIds where owned === total */
  completedSets: string[];
}

// --- §5.4 Drop countdown → Home --------------------------------------------

export interface DropCountdownState {
  dropId: string;
  dropName: string;
  /** ISO timestamp */
  scheduledAt: string;
  status: 'upcoming' | 'live' | 'ended';
  /** null when status === 'ended' */
  secondsRemaining: number | null;
  /** ISO timestamp; null when status is 'upcoming' (end time not yet confirmed) */
  dropEndsAt: string | null;
  /** one flavor-text line in the Pane's Lampblacker-Spine voice */
  narratorTeaser: string;
}

// --- §5.6 Onboarding state contract ----------------------------------------

export type OnboardingState =
  | 'IDLE'
  | 'WELCOME'
  | 'PICK_PANE'
  | 'CONFIRM_PACK'
  | 'RIPPING'
  | 'COLLECTION_REVEAL'
  | 'COMPLETE';

export interface OnboardingContext {
  state: OnboardingState;
  selectedUniverse: Universe | null;
  selectedPackId: string | null;
  /** server-issued during CONFIRM_PACK; the rigged Rare from the chosen Pane */
  riggedRareCardId: string | null;
}

// --- §5.7 Pack-rip state contract ------------------------------------------

export type PackRipState =
  | 'IDLE'
  | 'ANTICIPATION'
  | 'NARRATOR_INTRO'        // Apex only: voiced narration title card
  | 'TEAR'
  | 'CARD_EMERGE'
  | 'CURATOR_OVERLAY'       // Curated only: Lampblacker-Spine 2-line text overlay
  | 'COUNCIL_CAPTION'       // Premium only: Council seat 1 text-overlay on Legendary
  | 'SHARE_PACK_CTA'        // Premium only: auto-generated share screenshot CTA
  | 'SETTLE'
  | 'COUNCIL_CONFIRMATION'  // Apex only: live Council confirmation
  | 'APEX_SETTLE'           // Apex only: Lampblack-cosmic-cascade settle
  | 'ADDED_TO_COLLECTION';

export interface PackRipContext {
  state: PackRipState;
  /** Drives per-tier state sequence (durations, overlay states) per §4.2 */
  packTier: PackTier;
  reveal: PackRevealResult | null;
  /** 0..reveal.cardIds.length-1 during CARD_EMERGE */
  cardEmergeIndex: number;
}

// --- §5.8 Buy-flow state contract ------------------------------------------

export type BuyFlowState =
  | 'ENTERING'
  | 'LOAD_LISTINGS'
  | 'SHOW_DECISION'
  | 'BUY_LISTING'
  | 'CHASE_PACK'
  | 'DISMISS';

export interface BuyFlowListing {
  listingId: string;
  serial: number;
  priceUsd: number;
  sellerDisplayName: string;
}

export interface BuyFlowChasePack {
  packId: string;
  packName: string;
  packTier: PackTier;
  priceUsd: number;
  /** server-computed: expected number of this pack to open to pull `gap.cardId` */
  expectedOpenCount: number;
}

export interface BuyFlowContext {
  state: BuyFlowState;
  gap: StickerGapContext;
  listings: BuyFlowListing[];
  chasePacks: BuyFlowChasePack[];
}
