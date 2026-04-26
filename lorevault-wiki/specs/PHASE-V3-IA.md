# PHASE V3 — Information Architecture Spec

**Date:** 2026-04-26
**Status:** Decisions, not options. Production-binding for `/v3/*` surfaces.
**Audience:** Engineering (Next.js 16 app-router, Tailwind v4, Framer Motion, lucide-react), Design, QA.
**Companions:** GDD-V1.mdx §2.6 + §6.6 + §7.5; PHASE-04-CARD-FRAME-LAYOUT-SPEC.md (chassis); PHASE-05-GAME-LOOP-PROGRESSION-SPEC.md (game loop); strategy/NORTH-STAR.md (audience archetypes); v2 surfaces in `src/app/v2/`.
**Mobile-first:** 375 × 812 baseline. Desktop is a superset of the mobile floor plan.

This spec is the binding map of `/v3/*`. Every surface implementer reads from here. Section 5 cross-surface contracts, plus Section 1's `NavItem`, are exported from `src/lib/v3/types.ts` — implementers MUST import from that contract file rather than redefine.

The four primary archetypes from NORTH-STAR §2 (gambler-completionist, Pratchett-discoverer, taste-collector, lore-hunter) all enter through the same four-tab floor plan. The IA does not branch by archetype; the *content* surfaced inside the tabs branches.

---

## Section 1 — Bottom-Tab Navigation

The product navigates on **four** tabs. No more. The tab-bar is a floor plan, not a menu (per GDD §2.6). Market, Explore, Discover, Search, and Feed are **banned from the tab-bar** for the duration of Series 1; the marketplace is reachable only from gap-taps in the sticker-book and from card-detail buy-flow.

### 1.1 The four tabs

| Order | Label | Icon (lucide-react) | Route | Tab match-paths |
|---|---|---|---|---|
| 1 | Home | `Home` | `/v3` | `/v3`, `/v3/gdd`, `/v3/drops`, `/v3/drop/*`, `/v3/storefront`, `/v3/storefront/*` |
| 2 | Collection | `BookOpen` | `/v3/collection` | `/v3/collection`, `/v3/collection/*`, `/v3/card/*` |
| 3 | Open | `Package` | `/v3/welcome` (first visit) **or** `/v3/pack/latest` (returning users) | `/v3/welcome`, `/v3/welcome/*`, `/v3/pack/*` |
| 4 | Profile | `User` | `/v3/profile` | `/v3/profile`, `/v3/buy/*`, `/v3/marketplace`, `/v3/marketplace/*` |

The Open tab's destination is computed at render-time from the user's onboarding flag:

```ts
const openHref = user.hasCompletedOnboarding
  ? `/v3/pack/latest`
  : `/v3/welcome`;
```

`/v3/pack/latest` is a server redirect to the user's most-recently-rip-eligible pack (the Open tab is the ritual entry point, not a list view).

The Profile tab's `matchPaths` includes `/v3/buy/*` and `/v3/marketplace/*` because those routes are **secondary navigation** reached from inside Collection (gap-tap) or inside Profile (chase progress). A buy-flow does not get its own tab — that would make the product feel like a trading desk, which GDD §2.6 explicitly forbids.

### 1.2 Active / inactive states

| State | Icon | Color | Label |
|---|---|---|---|
| Active | filled (`fill="currentColor"`) | Universe-accent (resolves from active route's universe; defaults to `--bs-gaslight-sepia` `#C9A26B` for non-universe routes) | visible, weight 600 |
| Inactive | outline (default lucide stroke) | `--text-muted` `#9C9388` | visible, weight 500 |

Transition: **150ms ease-in-out** on `opacity` + `color`. Both icon and label cross-fade together.

Labels are **always visible** — never icon-only. Icon-only requires the collector to have already memorised the map (per GDD §2.6); the four-tab bar is the map.

### 1.3 Safe-area + sizing (mobile)

- Touch target: **44px minimum** per Apple HIG (GDD §7.5).
- Bar height: 56px content + `env(safe-area-inset-bottom, 0)` padding.
- CSS:
  ```css
  .v3-tabbar {
    position: fixed;
    inset: auto 0 0 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
    background: var(--surface-card);
    border-top: 1px solid rgba(156, 147, 136, 0.12);
    z-index: 50;
  }
  ```
- Content scrolls **above** the tab-bar; the bar never overlaps content (GDD §7.5).
- No horizontal scroll anywhere.

### 1.4 Desktop behavior — left sidebar at `lg:` (≥1024px)

At the Tailwind `lg:` breakpoint (`min-width: 1024px`), the bottom tab-bar collapses to a left sidebar:

- Width: **240px**, fixed left.
- Items: same four, same order, vertical stack.
- Each item: 48px tall, icon (24×24) + label, 16px H pad.
- The label sits to the right of the icon, never below.
- Active state: same color/fill rules as mobile, plus a 2px vertical accent bar on the left edge of the active item.
- Bottom-tab-bar is `hidden` at `lg:`; sidebar is `hidden` below `lg:`.

### 1.5 Accessibility

- Container: `<nav role="tablist" aria-label="Primary">`.
- Each tab: `<a role="tab" aria-selected={active} aria-label={label}>` (rendered as `<a>` so middle-click and right-click open in new tab; `role="tab"` overrides the default link semantics for screen-reader navigation).
- Focus-visible: 2px outline in Universe-accent, offset 2px.
- Keyboard: `Tab` cycles through; `ArrowLeft` / `ArrowRight` (mobile) and `ArrowUp` / `ArrowDown` (desktop) navigate between tabs.
- Reduced motion: 150ms transitions are dropped to instant when `prefers-reduced-motion: reduce`.

### 1.6 TypeScript interface

Implementers consume `NavItem` from `src/lib/v3/types.ts`:

```typescript
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string; // static fallback
  hrefResolver?: (ctx: { isOnboarded: boolean }) => string; // dynamic override
  matchPaths?: string[]; // for active state matching; supports leading-prefix and `/*` suffix
}
```

The Open tab uses `hrefResolver: ({ isOnboarded }) => isOnboarded ? '/v3/pack/latest' : '/v3/welcome'`. All other tabs use static `href`.

The four canonical items, in order, are:

```typescript
import { Home, BookOpen, Package, User } from 'lucide-react';
import type { NavItem } from '@/lib/v3/types';

export const V3_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', icon: Home, href: '/v3', matchPaths: ['/v3', '/v3/gdd', '/v3/drops', '/v3/drop/*', '/v3/storefront', '/v3/storefront/*'] },
  { label: 'Collection', icon: BookOpen, href: '/v3/collection', matchPaths: ['/v3/collection', '/v3/collection/*', '/v3/card/*'] },
  { label: 'Open', icon: Package, href: '/v3/welcome', matchPaths: ['/v3/welcome', '/v3/welcome/*', '/v3/pack/*'] },
  { label: 'Profile', icon: User, href: '/v3/profile', matchPaths: ['/v3/profile', '/v3/buy/*', '/v3/marketplace', '/v3/marketplace/*'] },
] as const;
```

`matchPaths` matching: an exact path matches verbatim; a path ending in `/*` matches any sub-path under the prefix. The active tab is the **first** item in `V3_NAV_ITEMS` whose `matchPaths` matches the current pathname. (Order matters — the four tabs are listed in left-to-right priority.)

---

## Section 2 — Full Surface Tree at `/v3/*`

Every route under `/v3/*` is enumerated below. The tree is the binding map; new routes require a doctrine update before they ship.

### 2.1 Home tab routes

| Path | Component | Type | Tab | Purpose | Key data deps |
|---|---|---|---|---|---|
| `/v3` | `V3HomePage` | SSG | Home | Hero drop card (active Set's marquee Moment, full-art) + storefront refresh countdown + recently activated collectors feed (no $ amounts, no P&L). | Active drop manifest, storefront refresh schedule, last-N activations stream |
| `/v3/gdd` | `GDDPage` | Static | Home | Phase-1 Game Design Document (mdx render of `lorevault-wiki/gdd/GDD-V1.mdx`); hero entry point for the taste-collector and lore-hunter archetypes. | mdx file (build-time import) |
| `/v3/drops` | `DropsPage` | SSG | Home | Confirmed-drops calendar + 2027 Liberation Drop countdown. | Drop schedule manifest |
| `/v3/drop/[id]` | `DropEventPage` | SSG | Home | Specific drop event: narrator commentary, live-event placeholder, countdown, post-drop secondary link. | Drop record by id |
| `/v3/storefront` | `StorefrontPage` | Dynamic | Home | Full rotating storefront: daily + weekly + monthly stacked, with countdowns. | Storefront state (daily/weekly/monthly), server clock |
| `/v3/storefront/daily` | `DailyStorefrontPage` | Dynamic | Home | Daily rotation slate + countdown to noon-ET refresh. | Daily slate, noon-ET refresh time |
| `/v3/storefront/weekly` | `WeeklyStorefrontPage` | Dynamic | Home | Weekly rotation + countdown to Tuesday noon ET. | Weekly slate, Tuesday-noon ET timer |
| `/v3/storefront/monthly` | `MonthlyStorefrontPage` | Dynamic | Home | Monthly mega-drop + first-Saturday countdown. | Monthly mega-drop record, first-Saturday timer |

### 2.2 Collection tab routes

| Path | Component | Type | Tab | Purpose | Key data deps |
|---|---|---|---|---|---|
| `/v3/collection` | `CollectionPage` | Dynamic (per-user) | Collection | Sticker-book default view: current Set progress as fraction `12 of 20` over a 2-col (mobile) / 3-col (tablet) grid; owned cards full-art, missing cards grey silhouettes. | User collection state, active Set, Set's 20-Moment manifest |
| `/v3/collection/[set-id]` | `SetCollectionPage` | Dynamic | Collection | Per-Set sticker-book — same grid mechanics, scoped to one Set. Tap a silhouette → `/v3/buy/[id]` with `StickerGapContext`. | User collection state, Set manifest by id |
| `/v3/collection/parallels` | `ParallelsPage` | Dynamic | Collection | Parallel-completion meta-tracker across all Sets: ARCANA / AETHER / WITNESS / NEON / ONE-OFF progress per Universe. | User collection state, parallel-eligibility table |
| `/v3/collection/serials` | `SerialsPage` | Dynamic | Collection | Serial-number-set pursuit tracker (e.g. "all #247s", "all sub-100s"). User flags target serials; UI shows owned vs. missing. | User collection state, user's serial-pursuit flags |

> **Route priority note:** `/v3/collection/parallels` and `/v3/collection/serials` are static routes that take priority over `/v3/collection/[set-id]` — in Next.js App Router, static segments beat dynamic segments at the same level. No special configuration needed.
| `/v3/card/[id]` | `CardDetailPage` | SSG (per card-id) | Collection | Card detail preserving the Phase-04 chassis exactly: TopBar, HeroArt (2:3 full-bleed), Pullquote, LoreNote, TetherRow (when non-empty), MetadataChips, CouncilToggle, OwnerTrail. | Card record by id, owner state, tether records |

### 2.3 Open (Pack) tab routes

| Path | Component | Type | Tab | Purpose | Key data deps |
|---|---|---|---|---|---|
| `/v3/welcome` | `WelcomePage` | Static | Open | First-visit pack-picker landing: 5 panes, each with Lampblacker-Spine lore tease (Hester Quill, Charcoal-Burner's Daughter, Court Recorder of Hearts, Asha Caedmon, Melaina). The Lattice-painting reveal lives here per GDD §6.6. | Static manifest of 5 panes + 5 lore-tease lines |
| `/v3/welcome/pick` | `PackPickerPage` | Static | Open | Pack-selection grid (5 packs across the 5 Panes; tap to confirm). | Same 5-pane manifest |
| `/v3/pack/[id]/preview` | `PackPreviewPage` | SSG (per pack-id) | Open | Pack detail before purchase: Set name, Pane, tier-floor, what's inside (without odds disclosure for the rigged onboarding pack), CTA. | Pack manifest by id |
| `/v3/pack/[id]/reveal` | `PackRevealPage` | Dynamic (client-only, no SSR) | Open | Pack-rip ritual — full-screen at every breakpoint, no modal, no sidebar (GDD §7.5). Consumes `PackRevealResult`; emits per-card animation triggers. | Server-issued reveal payload (pack-id, card-ids, animation-trigger) |

`/v3/pack/[id]/reveal` is rendered as a client component with `dynamic = 'force-dynamic'` — the rip ritual must not pre-render server-side because the cards are not deterministic until the rip is signed.

### 2.4 Profile tab routes

| Path | Component | Type | Tab | Purpose | Key data deps |
|---|---|---|---|---|---|
| `/v3/profile` | `ProfilePage` | Dynamic | Profile | Collector showcase (gallery of highest-rarity pulls) + parallel-completion progress + serial-set pursuit + cross-Set Echo tally. The taste-collector's portfolio surface. | `CollectionSummary` (see §5.3) |
| `/v3/buy/[id]` | `ChaseOrBuyPage` | Dynamic | Profile | Arrives from gap-tap with `StickerGapContext`. Shows 3 lowest-ask listings + 3 same-Set chase packs + expected-pull-count math ("at this pack's odds, expect ~12 packs to pull this card"). | `StickerGapContext`, listings query, pack-odds table |
| `/v3/marketplace` | `MarketplacePage` | Dynamic | Profile | Faceted search: Universe × Set × Tier × Parallel × serial range. Single-column at 375px; 2-col at 768px. | Listings index |
| `/v3/marketplace/[set-id]` | `SetMarketplacePage` | Dynamic | Profile | Per-Set marketplace view (faceted to one Set; Set's 20-Moment grid populated with ask-prices). | Listings filtered by set-id |

### 2.5 Routes explicitly NOT in `/v3/*`

These are out of scope for `/v3` and must not be added without a doctrine update:

- `/v3/feed`, `/v3/explore`, `/v3/discover`, `/v3/search` — banned per GDD §2.6.
- `/v3/wallet`, `/v3/transfer`, `/v3/cashout` — out of scope for Series 1; payment flow is deferred (Phase 6+).
- `/v3/admin/*`, `/v3/moderate/*` — admin lives on a separate origin.
- `/v3/api/*` — API routes go under `/api/v3/*`, not `/v3/api/*` (Next 16 app-router convention).

---

## Section 3 — Design System Tokens (`tailwind.config.ts` extension)

The v3 token set extends — never replaces — the v2 token set already established in `src/components/v2/v2-tokens.css`. CSS custom properties remain the source of truth for tier/shell/parallel/Universe palettes (GDD §7.5.1); the Tailwind extension below is the JS-side mirror for class-name authoring.

### 3.1 Colors

```typescript
// Per-tier
'tier-common':    '#9C7B3A', // ledger-amber
'tier-rare':      '#B08838', // warm-gold
'tier-legendary': '#E8D8A8', // gilt outer
'tier-ultimate':  '#F5E6B8', // engraved gilt

// Per-Universe accent (the active-tab color resolves from these)
'bs-sepia':  '#C9A26B', // Baker Street — gaslight sepia
'bs-amber':  '#B5651D', // Baker Street — Persian-slipper amber
'ek-green':  '#2C3A23', // Enchanted Kingdom — forest green
'wl-blue':   '#1F3A6B', // Wonderland — pinafore blue
'gh-tar':    '#0A0908', // Gothic Horror — ship-tar
'gm-gold':   '#C8922A', // Greek Myth — Olympian gold

// Surface
'surface-void':     '#0A0907',
'surface-card':     '#12110F',
'surface-elevated': '#1A1814',

// Text
'text-primary': '#F4EFE3',
'text-muted':   '#9C9388',
// text-accent is Universe-dependent; resolved at render via `data-universe` attribute
// + a `text-accent: var(--universe-accent)` declaration in v3-tokens.css.
```

### 3.2 Typography

```typescript
fontFamily: {
  pullquote: ['var(--font-pullquote)', 'Cormorant Garamond', 'serif'], // italic at use site
  sidenote:  ['var(--font-baker-street)', 'IM Fell English SC', 'serif'],
  body:      ['var(--font-v2-ui)', 'Inter', 'system-ui', 'sans-serif'],
  mono:      ['var(--font-v2-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
}
```

The `pullquote` family is the chassis-canonical Cormorant Garamond Italic per Phase-04 §1.3. The `sidenote` family is IM Fell English SC, used for small-caps attribution lines, narrator murmurs, and the Lampblack-Spine signatures. `body` is Inter (the v2 UI face); `mono` is JetBrains Mono (used only on the `serial` chip per Phase-04 §1.6 and on serial-pursuit grids).

### 3.3 Spacing — safe-area utility

```typescript
spacing: {
  'safe-bottom': 'env(safe-area-inset-bottom, 0)',
  'safe-top':    'env(safe-area-inset-top, 0)', // included for symmetry; iOS notch
}
```

Usage: `<nav class="pb-safe-bottom">…</nav>`.

### 3.4 Motion timing

```typescript
transitionDuration: {
  snap:    '150ms',  // tab-bar state, hover, focus
  ritual:  '2000ms', // pack-rip TEAR phase
},
transitionTimingFunction: {
  ritual: 'cubic-bezier(0.16, 1, 0.3, 1)', // out-expo; the wax-seal-cracks-then-settles curve
},
```

Reduced-motion compliance: every `duration-ritual` site MUST gate behind `motion-safe:` (Tailwind v4's media variant) or wrap a `prefers-reduced-motion` query. The pack-rip ritual collapses to a 200ms cross-fade when reduced-motion is set.

### 3.5 CSS-first token file (Tailwind v4)

Create this file at `src/app/v3/v3-tokens.css` and import it in `src/app/v3/layout.tsx`.

```css
/* src/app/v3/v3-tokens.css */
@layer base {
  :root {
    /* Surface */
    --color-surface-void: #0a0907;
    --color-surface-card: #12110F;
    --color-surface-elevated: #1A1814;

    /* Text */
    --color-text-primary: #F4EFE3;
    --color-text-muted: #9C9388;

    /* Tiers */
    --color-tier-common: #9C7B3A;
    --color-tier-rare: #6B8FA8;
    --color-tier-legendary: #C9A26B;
    --color-tier-ultimate: #8B1A1A;

    /* Baker Street */
    --color-bs-sepia: #C9A26B;
    --color-bs-amber: #B5651D;
    --color-bs-fog: #6B8FA8;

    /* Enchanted Kingdom */
    --color-ek-green: #2C3A23;
    --color-ek-foxglove: #553A6B;

    /* Wonderland */
    --color-wl-blue: #1F3A6B;
    --color-wl-rose: #B8252A;
    --color-wl-cheshire: #D77A8E;

    /* Gothic Horror */
    --color-gh-tar: #0A0908;
    --color-gh-ivory: #E8DEC8;

    /* Greek Myth */
    --color-gm-gold: #C8922A;
    --color-gm-wine: #3B1F4B;
    --color-gm-pomegranate: #9B2335;

    /* Universe accent (set by data-universe attribute) */
    --color-universe-accent: var(--color-bs-sepia); /* default Baker Street */

    /* Motion */
    --duration-snap: 150ms;
    --duration-ritual: 2000ms;
    --ease-ritual: cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Universe accent overrides per data-universe */
  [data-universe="baker-street"] { --color-universe-accent: var(--color-bs-sepia); }
  [data-universe="enchanted-kingdom"] { --color-universe-accent: var(--color-ek-green); }
  [data-universe="wonderland"] { --color-universe-accent: var(--color-wl-blue); }
  [data-universe="gothic-horror"] { --color-universe-accent: var(--color-gh-ivory); }
  [data-universe="greek-myth"] { --color-universe-accent: var(--color-gm-gold); }
}
```

---

## Section 4 — State Machines

Four flows have explicit, testable state machines. Implementers MUST treat the named states as the protocol — UI, telemetry, and tests all key off these names.

### 4.1 Onboarding state — 4-step wizard

**Surface:** `/v3/welcome` → `/v3/welcome/pick` → `/v3/pack/[id]/preview` → `/v3/pack/[id]/reveal` → `/v3/collection`.

```
IDLE → WELCOME → PICK_PANE → CONFIRM_PACK → RIPPING → COLLECTION_REVEAL → COMPLETE
```

| State | UI shown | Transitions | Exit condition |
|---|---|---|---|
| `IDLE` | none — the wizard hasn't started | `→ WELCOME` on first `/v3/welcome` mount | route mounted |
| `WELCOME` | Lattice-painting reveal (per GDD §6.6 + Phase-05 §1.1 12-30s); the four-figure rotation; "Pick the pack that calls to you" prompt; CTA "Begin" | `→ PICK_PANE` on tap | user taps Begin |
| `PICK_PANE` | 5 panes selectable as a horizontal row. Each pane: character thumbnail, Universe-accent backdrop, **one** Lampblacker-Spine lore-tease line (Hester Quill / Charcoal-Burner's Daughter / Court Recorder of Hearts / Asha Caedmon / Melaina). No odds, no pull-rates, no "most popular" badge. | `→ CONFIRM_PACK` on tap | user taps a pane |
| `CONFIRM_PACK` | Shows selected pack art, tier price ($9), Universe accent, and "Open pack" CTA. No disclosure of the rigged-Rare guarantee — the guarantee is revealed after the rip, per GDD §6.6: "The disclosure after is the gift; the disclosure before would make it a transaction." | `→ RIPPING` on Confirm tap; `→ PICK_PANE` on Back | user taps Confirm |
| `RIPPING` | full-screen pack-rip ritual (see §4.2) | `→ COLLECTION_REVEAL` when ritual completes | RippingState resolves to `ADDED_TO_COLLECTION` |
| `COLLECTION_REVEAL` | Sticker-book renders for the chosen Set with **1 of 20** filled and **19 grey silhouettes** waiting (per GDD §6.6). Toast: "1 of 20 — 19 grey silhouettes await." Disclosure line appears here, signed by the Pane's Lampblacker-Spine: **"A Rare was waiting for you."** This is where the guarantee is revealed — after the rip, never before. | `→ COMPLETE` on tap-anywhere or on 4-second auto-advance | tap or timeout |
| `COMPLETE` | wizard hidden; tab-bar visible; user is on `/v3/collection` with the rigged Rare landed | terminal | n/a |

State persistence: store the wizard's current state on the user record (`onboardingState`) so a refresh during PICK_PANE or CONFIRM_PACK resumes from the same step. RIPPING through COLLECTION_REVEAL run client-side only — a refresh during RIPPING short-circuits to COLLECTION_REVEAL because the cards are already minted server-side.

### 4.2 Pack-rip state

**Surface:** `/v3/pack/[id]/reveal`. Client-only, no SSR.

State machine transitions are driven by `PackRipContext.packTier`. Each tier runs a distinct sequence with its own durations; the state names are the protocol — telemetry and tests key off these exact names.

#### Per-tier state sequences

| Tier | Price | Cards | Total | State sequence |
|---|---|---|---|---|
| **Sample** | $0 | 1 card | 4s | `ANTICIPATION`(1s) → `TEAR`(1s) → `CARD_EMERGE`(1 card, 1s) → `ADDED_TO_COLLECTION` |
| **Standard** | $9 | 3 cards | 8s | `ANTICIPATION`(1s) → `TEAR`(2s) → `CARD_EMERGE`(3 cards × 600ms stagger) → `SETTLE`(800ms) → `ADDED_TO_COLLECTION` |
| **Curated** | $49 | 5 cards | 12s | `ANTICIPATION`(1.5s) → `TEAR`(2s) → `CARD_EMERGE`(5 cards × 600ms stagger) → `CURATOR_OVERLAY`(Lampblacker-Spine 2-line text, 2s) → `SETTLE`(800ms) → `ADDED_TO_COLLECTION` |
| **Premium** | $199 | 6 cards | 18s | `ANTICIPATION`(2s) → `TEAR`(3s) → `CARD_EMERGE`(6 cards × 700ms stagger) → `COUNCIL_CAPTION`(Council seat 1 commentary, 2s) → `SHARE_PACK_CTA`(3s) → `ADDED_TO_COLLECTION` |
| **Apex** | $999 | 7 cards | 30s | `ANTICIPATION`(3s) → `NARRATOR_INTRO`(5s, voiced narration) → `TEAR`(4s) → `CARD_EMERGE`(7 cards × 800ms stagger) → `COUNCIL_CONFIRMATION`(live confirmation, 8s) → `APEX_SETTLE`(2s) → `ADDED_TO_COLLECTION` |

#### State reference

| State | Visuals | Audio | Exit condition |
|---|---|---|---|
| `ANTICIPATION` | dark screen; pack shakes ±2px on x-axis at 80ms intervals; faint Lampblack-haze radial behind the pack | sound-cue placeholder: held cello note (Bb 55Hz) | timer (duration per tier) |
| `NARRATOR_INTRO` | *(Apex only)* Lampblacker-Spine narration title card — Pane character name fades in, voiced narration begins | voiced narration (Apex-tier pre-recorded per Pane) | timer (5s) |
| `TEAR` | wax-seal cracks (sprite or Framer-Motion path); cards fly from center on cubic-bezier(0.16, 1, 0.3, 1) | sound-cue placeholder: wet wax-snap | timer (duration per tier) |
| `CARD_EMERGE` | each card emerges sequentially (stagger interval per tier). Scarcity-dependent effects: RARE+ = shimmer (1.2s gold shimmer sweep); LEGENDARY = glow (1.8s outer glow + slow-pan); ULTIMATE = full-screen flash (250ms white-flash then settle). These effects apply to CARD_EMERGE for all tiers. | per-card narrator murmur ("there") on Rare+ only | last card emerged |
| `CURATOR_OVERLAY` | *(Curated only)* Lampblacker-Spine 2-line text overlay on highest-rarity card. E.g. "The Cottingley plate — I copied this from Doyle's letter, before the Estate's lawyers came. — Hester Quill, December 1923." | silent | timer (2s) |
| `COUNCIL_CAPTION` | *(Premium only)* Council seat 1 text-overlay on the Legendary: surfaces tether-data verifiable on the wiki. | silent | timer (2s) |
| `SHARE_PACK_CTA` | *(Premium only)* "Share this pull" CTA with auto-generated screenshot for social emission. | silent | timer (3s) or user taps Share |
| `SETTLE` | all cards land in row; flavor-text fades in; subtle Lampblack-residue particles drift across the row | silent | timer (800ms) |
| `COUNCIL_CONFIRMATION` | *(Apex only)* Council seat 1 or seat 4 voices live confirmation mid-stream. | voiced Council confirmation | timer (8s) |
| `APEX_SETTLE` | *(Apex only)* Lampblack-cosmic-cascade radiates from the highest-rarity card; broken-mirror-shard glyph reflecting all five Panes. | silent | timer (2s) |
| `ADDED_TO_COLLECTION` | toast per new-to-collection card: "Added to your binder — *Sherlock Holmes — Baker Street RARE*" stacks bottom-up; CTA "View binder" → `/v3/collection`; CTA "Open another" → `/v3/welcome/pick` | silent | tap or auto-advance after 6s |

Animation trigger comes from `PackRevealResult.animationTrigger` (Section 5.2). The reveal page MUST NOT compute the trigger itself — the server signs the reveal payload so the rarity is committed before the client renders.

`prefers-reduced-motion`: the entire ritual collapses to a 200ms cross-fade per card and skips ANTICIPATION, NARRATOR_INTRO, and TEAR. The ADDED_TO_COLLECTION toast still renders.

### 4.3 Buy-flow state

**Surface:** `/v3/buy/[id]`. Entered from `/v3/collection/[set-id]` on grey-silhouette tap.

```
ENTERING(cardId, context) → LOAD_LISTINGS → SHOW_DECISION → [BUY_LISTING | CHASE_PACK | DISMISS]
```

| State | UI shown | Transitions | Exit condition |
|---|---|---|---|
| `ENTERING` | route is mounting; receives `cardId` + `StickerGapContext` (see §5.1) via search-params or in-memory store | `→ LOAD_LISTINGS` immediately | mounted |
| `LOAD_LISTINGS` | skeleton: 3 placeholder listing rows + 3 placeholder pack rows | `→ SHOW_DECISION` when both queries resolve | listings + chase-packs both loaded |
| `SHOW_DECISION` | header: "*<Card name>* — gap *<7 of 20>* in *<Set name>*". Three lowest-ask listings with serial + price + seller. Three same-Set chase packs with tier + price + expected-pull-count math (e.g. "expect ~12 packs to pull this card"). Two CTAs per listing ("Buy"), two per pack ("Open"). Dismiss / Back as a top-bar action. | `→ BUY_LISTING` / `→ CHASE_PACK` / `→ DISMISS` on tap | user choice |

**Banned on `/v3/buy/*` and `/v3/marketplace/*`:** P&L indicators of any kind (profit/loss calculations, percentage-change labels, trend lines), "Estimated Value" forecasts or charts, Smart-money / Comfy / Bulk / Movers labels, recommended-buy badges or scoring, portfolio-value aggregation, 7-day volume, market cap, average-sale trend charts. What IS allowed: the current ask price (a single number), listing date, seller display name, and a scarcity reminder ('4 of 25 listed'). The object precedes the asset.

| `BUY_LISTING` | navigates to payment flow (Phase 6+, **out of scope for this build**); for v3 implementers, this is a feature-flagged button (`actionsEnabled=false`) showing "Payment flow ships in Phase 6". | terminal for v3 | n/a |
| `CHASE_PACK` | navigates to `/v3/pack/[chase-pack-id]/preview` with the chosen pack | terminal | route nav |
| `DISMISS` | navigates back to the originating sticker-book (`router.back()`) | terminal | route nav |

Expected-pull-count math: derived from per-Tier pack-slot-rate and per-card mint-count per GDD §5/§6 (Common 70% slot × 12 of 12 Commons in a Set, Rare 25% × 5 of 5, Legendary 4% × 2 of 2, Ultimate 1% × 1 of 1). The math is a server-computed constant per (pack, card) pair — the buy-flow displays it; it does not recompute.

### 4.4 Drop-countdown state

**Surface:** `/v3/drops`, `/v3/drop/[id]`, plus an embedded countdown component on `/v3` (Home).

```
[UPCOMING | LIVE | ENDED]
```

| State | UI shown | Transitions | Exit condition |
|---|---|---|---|
| `UPCOMING` | countdown timer (`days:hours:minutes:seconds`) ticking once per second; narrator commentary line in `pullquote` font; "Notify me" CTA | `→ LIVE` when `Date.now() >= scheduledAt` | clock |
| `LIVE` | "Drop is live" pill (pulsing Universe-accent); "Buy now" CTA → `/v3/storefront/[drop-id]`; live narrator commentary stream (placeholder for Series-1: static text; Series-2 wires the live channel) | `→ ENDED` on `dropEndsAt` (drops carry an explicit end timestamp; default = 24h after `scheduledAt` for daily, 7d for weekly, 14d for monthly) | clock |
| `ENDED` | "Ended" pill (muted grey); secondary-market link → `/v3/marketplace/[set-id]`; final pull stats ("X cards minted, Y Mythics pulled") | terminal | n/a |

State derives from server time (`Date.now()` is **never** trusted on client) — the countdown component fetches `secondsRemaining` from the server on mount and a timer drives the UI between syncs. Re-sync every 60s to absorb client-clock drift.

---

## Section 5 — Cross-Surface Contracts

These eight interfaces are exported from `src/lib/v3/types.ts`. Surfaces communicate **only** through these shapes. Renaming a field is a doctrine update.

### 5.1 Sticker-book → Buy-flow

```typescript
export interface StickerGapContext {
  cardId: string;
  setId: string;
  setName: string;
  positionInSet: number;     // 1..20
  missingCount: number;      // gaps in this Set, including this one
  tier: 'common' | 'rare' | 'legendary' | 'ultimate';
  universe:
    | 'baker-street'
    | 'enchanted-kingdom'
    | 'wonderland'
    | 'gothic-horror'
    | 'greek-myth';
}
```

**Producer:** `SetCollectionPage` on grey-silhouette tap. **Consumer:** `ChaseOrBuyPage`. **Transport:** in-memory store (Zustand or React Context) passed via `router.push` query params for refresh-survival; the query-params encoding is `?gap=<base64-json>`.

### 5.2 Pack-rip → Collection

```typescript
export interface PackRevealResult {
  packId: string;
  cardIds: string[];
  newToCollection: string[];                                   // subset of cardIds the user didn't already own
  animationTrigger: 'standard' | 'shimmer' | 'glow' | 'flash'; // driven by highest-rarity card in cardIds
  toastMessages: string[];                                     // one per card; e.g. "Sherlock Holmes — Baker Street RARE"
}
```

**Producer:** server endpoint `POST /api/v3/pack/[id]/rip` (signs a reveal payload). **Consumer:** `PackRevealPage`. **Transport:** signed JSON returned from POST; the server is the only authority on which cards a rip yields.

`animationTrigger` mapping: highest-tier-among `cardIds` ∈ {Common→`standard`, Rare→`shimmer`, Legendary→`glow`, Ultimate→`flash`}.

### 5.3 Collection → Profile

```typescript
export interface CollectionSummary {
  totalOwned: number;
  setProgress: { setId: string; owned: number; total: number }[];
  parallelProgress: { parallel: string; owned: number; totalEligible: number }[];
  serialSets: { targetSerial: number; owned: number; total: number }[];
  completedSets: string[]; // setIds where owned === total
}
```

**Producer:** server query `GET /api/v3/me/collection-summary`. **Consumer:** `ProfilePage` (showcase + parallel-completion + serial-pursuit), and the home-page recently-activated feed when shown for the current user. **Transport:** GET response, cached at the edge for 60s per-user.

`parallel` values: `'arcana' | 'aether' | 'witness' | 'neon' | 'one-off'`. `targetSerial` is the integer the user is pursuing (e.g. 247).

### 5.4 Drop countdown → Home

```typescript
export interface DropCountdownState {
  dropId: string;
  dropName: string;
  scheduledAt: string;             // ISO timestamp
  status: 'upcoming' | 'live' | 'ended';
  secondsRemaining: number | null; // null when status === 'ended'
  narratorTeaser: string;          // 1 flavor-text line in Lampblacker-Spine voice
}
```

**Producer:** server query `GET /api/v3/drops/active` (returns `DropCountdownState[]`). **Consumer:** `V3HomePage`'s countdown ribbon, `DropsPage`, `DropEventPage`. **Transport:** GET response with 60s edge-cache; the consumer-side timer ticks between syncs.

`narratorTeaser` is one line in the Pane's Lampblacker-Spine register (per GDD §9 + §6.6) — never explanatory, always voice-first.

### 5.5 NavItem (re-export from §1.6)

```typescript
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string; // static fallback
  hrefResolver?: (ctx: { isOnboarded: boolean }) => string; // dynamic override
  matchPaths?: string[];
}
```

### 5.6 Onboarding state contract

```typescript
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
  selectedUniverse: StickerGapContext['universe'] | null;
  selectedPackId: string | null;
  riggedRareCardId: string | null; // server-issued during CONFIRM_PACK
}
```

**Producer / consumer:** the wizard reducer (server-persisted on user record at every state transition).

### 5.7 Pack-rip state contract

```typescript
export type PackRipState =
  | 'IDLE'
  | 'ANTICIPATION'
  | 'TEAR'
  | 'CARD_EMERGE'
  | 'SETTLE'
  | 'ADDED_TO_COLLECTION';

export interface PackRipContext {
  state: PackRipState;
  reveal: PackRevealResult | null;
  cardEmergeIndex: number; // 0..reveal.cardIds.length-1 during CARD_EMERGE
}
```

### 5.8 Buy-flow state contract

```typescript
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
  packTier: 'sample' | 'standard' | 'curated' | 'premium' | 'apex';
  priceUsd: number;
  expectedOpenCount: number; // server-computed; how many of this pack to expect to pull `cardId`
}

export interface BuyFlowContext {
  state: BuyFlowState;
  gap: StickerGapContext;
  listings: BuyFlowListing[];
  chasePacks: BuyFlowChasePack[];
}
```

---

## Conformance — what every implementer must do

1. Import all interfaces from `@/lib/v3/types`. Do not redefine.
2. Treat the four-tab map (§1) as the floor plan; do not add a fifth tab.
3. Use the `matchPaths` rule for active-tab calculation (§1.6) — first match wins, in left-to-right order.
4. The pack-rip surface (§4.2) is the only client-only surface in `/v3/*`. Every other route either SSGs (card detail, drops calendar, GDD, welcome) or runs as a per-user dynamic route.
5. The state machines in §4 are the protocol. Telemetry events fire on state transitions, named identically.
6. The `tailwind.config.ts` extension in §3.5 is the canonical token set; mirror into Tailwind v4's CSS-first config or into the legacy JS config, but do not diverge.
7. Reduced-motion is a hard requirement, not a polish item. The ritual MUST collapse gracefully.

The IA is not the product. The product is the figures and their Lampblack. The IA is the floor plan that lets a collector find them.
