# LoreVault MLP — Information Architecture (Stage C.2)

**Run-tag:** `LV-MLP TRACK-C STAGE-2`
**Date:** 2026-04-28
**Mobile-first viewport:** 375px. All thumb-zone CTAs at bottom of screen. Desktop is a superset; mobile is the primary design surface.

## Route map

```
/v3/mlp                       The Hook (visitor surface)
/v3/mlp/start                 Onboarding (5 screens, state-driven)
/v3/mlp/vault                 Collection (the wall)
/v3/mlp/sets                  Set completion dashboard
/v3/mlp/drops                 Drop calendar + countdown
/v3/mlp/market                Secondary marketplace
/v3/mlp/challenges            Daily / weekly / seasonal challenges
/v3/mlp/progress              Tier ladder + Pane mastery
/v3/mlp/play                  Pane Prediction game
/v3/mlp/u/[handle]            Public collector profile
```

## Navigation pattern

A bottom-tab navigation surfaces five primary destinations once the user is past `/v3/mlp/start`: **Vault · Sets · Drops · Market · Play**. Challenges, progress, and profile live in a top-right user menu (avatar tap). The hook page (`/v3/mlp`) and onboarding (`/v3/mlp/start`) hide the bottom-tab nav entirely — they own the full viewport.

Routes outside the primary five (challenges, progress, profile) are reachable via a top-right user-menu sheet on every primary route, so they're never more than two taps away.

## Route specs (one paragraph each, mobile-first, 375px)

### `/v3/mlp` — The Hook

Single screen. Establishes "collectible game with literary teeth" in 0.4 seconds. Three Pane tiles (teasers, not the full gallery — that's the moodboard). An axiom. A pack. CTA: "Choose your world." Mobile: thumb-reachable CTA button at bottom of screen (above the iOS home-indicator). Load-bearing emotional beat: the collector feels the game is ABOUT something before they read a single word of copy. The axiom does the work; copy is dialed to a minimum (one line above the CTA: "Collect the worlds between worlds."). No nav, no chrome, no footer — the hook owns the viewport. The three Pane tiles are 80px tall on mobile, horizontally arranged with a soft horizontal swipe (snap to next on mobile). Each tile shows: Pane name in the Pane's color, axiom-fragment in 0.85rem italic, one silhouette card slot. Tap a tile → routes to `/v3/mlp/start?pane=<id>` with pane preselected. Direct CTA at bottom: "Choose your world →" → routes to `/v3/mlp/start` (no preselection — onboarding screen 1 will ask). Background: dark textured CSS gradient (Pane-rotating subtle accent every 8s for the active Pane).

### `/v3/mlp/start` — Onboarding (5 screens, state-driven)

Five-screen ceiling enforced. Implementation: single-page component with `useState<1|2|3|4|5>(1)` for screen index. No routing between screens. **Screen 1** (Pane choice): "Which world calls you?" Three Pane cards stacked vertically on mobile (3-up on desktop). Each card: PaneAxiomBlock + one silhouette card preview + thumb-tappable area covering the whole card. **Screen 2** (Pack reveal): "Your first pack from [PaneName]." Sealed Pack component centered, Pane-colored gradient. "Open it →" button at bottom (thumb zone). **Screen 3** (Pack opening): Pack component transitions to opening state (CSS transform — pack cracks down the middle, paper splits). Three cards revealed one at a time on tap. After all 3 revealed, the rarest card glows and a "What is this card?" CTA appears at the bottom. **Screen 4** (Card depth): Rarest card displayed at full-height, followed below by IcebergViewer showing surface beats. Prompt: "Reach deeper" → reveals echo. "Find the weight" → reveals one deep facet (3 of 8 in the buried-weight set). Then "Begin your set →" button. **Screen 5** (Set hook): ProgressIndicator showing "1 of 12 cards in the [PaneName] Starter Set." Two more cards from the same set visible as silhouettes labeled "Missing." Two CTAs: "Find them in the market →" → `/v3/mlp/market?set=<id>`, and "Explore your collection →" → `/v3/mlp/vault`. Atlas integration: on screen 1 Pane-tap, a guest session is provisioned with a custodial wallet via Dapper SSO. The starter pack is provisioned to that wallet on screen 2 entry. Reveal on screen 3 fires the open-transaction. Load-bearing emotional beat: the first card feels like *yours* within three minutes. **HARD RULE:** five screens, not six.

### `/v3/mlp/vault` — Collection (the wall)

The collector's wall. Three views (segmented control at top, thumb-reachable from a one-handed grip): **By Pane** (tiles, the default), **By Set** (progress bars), **By Iceberg depth** (how many buried weights revealed). Each tile in the By Pane view is a card slot: silhouette-glance face, name, rarity band, serial. Tap → card detail (modal sheet on mobile, slides up from bottom). Bottom-tab nav present. Atlas integration: reads on-chain holdings via Dapper custodial wallet API. Empty-state (zero cards): redirects to `/v3/mlp/start`. Load-bearing emotional beat: the collection is a *project* with visible progress, not a pile of artifacts.

### `/v3/mlp/sets` — Set Completion

The completion dashboard. List of started sets, each as a swipeable card (mobile) or grid tile (desktop). Per set: Pane attribution pill, set name, ProgressIndicator (N of M with Pane-colored bar), missing-cards row (silhouettes with floor prices below each), a single CTA "Get cheapest missing →" → `/v3/mlp/market` filtered to that set's cheapest missing card. Sort options at top: "Most complete," "Cheapest to complete," "Newest." Atlas integration: marketplace floor-price fetched per missing card from Atlas secondary market API. Load-bearing emotional beat: completion is always one step away.

### `/v3/mlp/drops` — Drop Calendar

Upcoming + recent drops. Hero: full-width countdown timer for next drop ("Old-Ones-Persist · Conflict 1 Drop" — clock counts down DD:HH:MM:SS in monospace, Pane color accent). Below: drop detail panel — which Pane, how many packs, rarity bands, price per pack. "Remind me" toggle (writes to user notification preferences). Below the upcoming drop: recent drops as a vertical list — each row shows pack art thumbnail, drop name, sold-out badge (if applicable), floor-price callout ("Floor: $42 · trending +12%"). Atlas integration: drop registry + secondary floor query. Load-bearing emotional beat: the cadence creates the anticipation.

### `/v3/mlp/market` — Secondary Marketplace

Atlas-native secondary market. Top: filter pill row (horizontal scroll on mobile) — **All / Owned / Need for set / Contraband / Pierre-Menard variants** — and a Pane filter (default to user's chosen Pane). Featured row at top labeled "The Forbidden" (contraband-rare cards). Below: listings list, each row showing card silhouette (sm), serial number, asking price, floor indicator chip (above / at / below floor in green/grey/red). Tap a listing → listing detail modal sheet → buy CTA opens Atlas-hosted purchase flow. Atlas integration: marketplace listings API. Mobile: long-press a listing to surface a quick-buy gesture (V2 bid placeholder shown as locked). Load-bearing emotional beat: the secondary market is where the *story* of the collection continues after the pack.

### `/v3/mlp/challenges` — Challenge Board

Three sections, vertically stacked: **Daily** (1-2 cards), **Weekly** (1-3 cards), **Seasonal** (1 card, the contraband-hunt). Each card: title, one-line description, progress bar, reward badge ("+1 pack credit," "+narrative scar guarantee," "+contraband-relic card"). Tap a card → expansion showing the steps required to complete and a "What does this give me?" explanation. Mobile: each challenge is full-width, vertically stacked. Atlas integration: challenge completion writes a reward token to the user's wallet via the Dapper escrow account. Load-bearing emotional beat: there's always something to do tomorrow.

### `/v3/mlp/progress` — Tier ladder + Mastery

Top: TierBadge (current tier, large) with tier name ("Tier 1 · Collector"). Below: tier ladder rendered as five vertical rows, current tier highlighted in Pane color, locked tiers (2-4) greyed with "Unlocks in Series 2" subtext. Below the ladder: Pane mastery panel — for each Pane, a horizontal mastery bar (% of cards collected) with serial count "47 of 112." Below that: Series mastery (Series 1 progress bar). Mobile: vertical scroll, mastery bars are full-width. Load-bearing emotional beat: you can see exactly how deep the rabbit hole goes.

### `/v3/mlp/play` — Pane Prediction

The weekly narrative event. Hero panel: current event announcement — "**Conflict 1: The Boundary Leaks.** Old-Ones-Persist vs. Lud-Border. Stakes close in DD:HH:MM:SS." Below: two large Pane tiles, side-by-side on desktop, stacked on mobile (Old-Ones-Persist on top, Lud-Border below). Each tile shows: Pane axiom, current stake count ("17 cards staked"), and a "Stake on this Pane" button. Tap a Pane → expands to a card-selector showing the user's cards from that Pane. Tap a card → confirm modal: "Stake [Card Name] on Old-Ones-Persist? If your Pane wins, this card earns the Conflict 1 scar. The card returns to your vault either way." Confirm → smart-contract interaction → card moved to escrow, visible in vault as "Staked in Conflict 1." Below the fold: past conflicts archive — "Conflict 0: Old-Ones-Persist claimed the transit. 847 cards bear the scar. Read the resolution →." Atlas integration: stake = smart contract call (escrow); resolution = on-chain metadata update (scar). Load-bearing emotional beat: for the first time, your collection is a *hand* you can play.

### `/v3/mlp/u/[handle]` — Profile

The collector's public face. Top: handle, avatar (silhouette of the collector's most-staked card, generated from card metadata), TierBadge, joined-date. Below: Pane mastery badges row — one badge per Pane the collector has cards in, mastery % shown. Below: "Showcase" row — five featured cards (card-owner curates these in V2; for MLP, defaults to the rarest five by rarity band). Below: stat block in a 2×2 grid — Cards owned · Sets completed · Conflicts staked · Contraband held. Below: public ledger — last 10 transactions (pack opens, secondary buys, conflict stakes), each with a timestamp and transaction hash link. Mobile: showcase is horizontally swipeable. Load-bearing emotional beat: the profile is a story of what you care about, not a balance sheet.

## Cross-route data shape (mock contract)

Used by all components in Stage C.3-4. Locked to allow live Atlas swap-in.

```ts
interface Card {
  id: string;                    // 'lud-001' style
  name: string;
  pane: 'lud-border' | 'old-ones-persist' | 'sinterklaas-reigns';
  paneDisplayName: string;
  flavorLine: string;
  silhouetteUrl: string | null;  // null → render Pane-color placeholder
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'contraband';
  serial: number;
  editionSize: number;
  contrabandRelation: 'carries' | 'refuses' | 'mediates' | 'exposes' | null;
  setId: string;
  scars: { conflictId: string; outcome: 'won' | 'lost'; }[];
  iceberg: {
    surface: string[];           // 2 beats
    echo: string;                // 1 beat
    deep: string[];              // 8 facets
  };
  lampblack: {
    gesture: string;
    cosmologicalRelation: string;
    wound: string;
    forbiddenAct: string;
    role: string;
    silhouette: string;
    prop: string;
  };
}

interface Pane {
  id: string;
  displayName: string;
  axiom: string;
  register: string;
  color: string;                 // hex
  contraband: string;            // 'a fruit grown across the border'
}

interface SetProgress {
  setId: string;
  setName: string;
  pane: Pane;
  owned: number;
  total: number;
  missingCards: { id: string; floorPrice: number | null }[];
}

interface Drop {
  id: string;
  name: string;
  pane: Pane;
  scheduledAt: string;           // ISO
  packCount: number;
  pricePerPack: number;          // USD
  rarityBands: { rarity: string; pct: number }[];
  status: 'upcoming' | 'live' | 'sold-out';
}

interface Listing {
  id: string;
  card: Card;
  askingPrice: number;
  floorPrice: number;            // for the same card
  seller: string;                // handle
  listedAt: string;
}

interface Challenge {
  id: string;
  cadence: 'daily' | 'weekly' | 'seasonal';
  title: string;
  description: string;
  progress: { current: number; total: number };
  reward: string;
}

interface Tier { num: 0|1|2|3|4; name: string; locked: boolean; }
interface ConflictEvent {
  id: string;
  panes: [Pane, Pane];
  description: string;
  stakesCloseAt: string;
  stakeCount: { [paneId: string]: number };
  status: 'open' | 'resolved';
  outcome: { winner: Pane; scarsAwarded: number } | null;
}
```

## Mobile-first design rules

1. All primary CTAs in the bottom 25% of the viewport (thumb zone for one-handed grip).
2. No more than 2 taps from any primary route to any other primary route.
3. No hover states (mobile has no hover); replace with tap-to-toggle or swipe-to-reveal.
4. Card silhouette images are 1:1.4 (standard collectible card aspect); stay readable at 80px wide.
5. Bottom-tab nav is 56px tall, persistent on primary routes, hidden on `/mlp` and `/mlp/start`.
6. Modal sheets (card detail, listing detail, stake confirm) slide up from bottom; dismiss with downswipe or tap-outside.
7. Type scale: 0.65rem (meta-labels), 0.85rem (body small), 1rem (body), 1.2rem (H3), 1.55rem (H2), clamp(1.8rem, 4vw, 2.5rem) (H1).
8. Pane color used for accent ONLY; default text is on `--color-surface-void` (`#0a0907`).
