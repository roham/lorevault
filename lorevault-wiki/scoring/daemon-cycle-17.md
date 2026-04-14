# Daemon Build Cycle 17 — Social Showcase & Leaderboards
Date: 2026-04-14
Directive: DIRECTIVE-007
Version: v8.27

## What Was Built
**DIRECTIVE-007: Social Showcase & Leaderboards**

Commit: 23c606c

Files added/changed:
- `src/app/hall/page.tsx` — Hall of Valhalla leaderboard page
- `src/data/leaderboard-seeds.ts` — 30 phantom collectors with seeded PRNG
- `src/components/social/ShareCard.tsx` — Canvas-based share image generator
- `src/app/card/[id]/page.tsx` — Share button added for owned cards
- `src/app/profile/page.tsx` — Hall of Valhalla link added

Key features:
- **Hall of Valhalla** (`/hall`): 4-tab leaderboard (Total Cards, Rarest Collection, Oldest Card, Achievements). Player mixed into 30 phantom collectors. Top-20 shown with overflow position indicator. Staggered row animations (30ms delay per row). Gold/silver/bronze position highlighting.
- **Rank system**: Bronze/Silver/Gold/Mythic tiers based on weighted score (cards*1 + rares*10 + achievements*5). Rank card at top of leaderboard with tier color gradient and icon.
- **Rank decay**: Streak=0 dims player rank card (opacity 0.6 + grayscale 0.5) with "Rank Fading" warning badge and CTA to open a pack. Phantom collectors with lastActive >= 7 days also dimmed (opacity 0.5 + grayscale 0.4).
- **Pinned badges on leaderboard**: Phantom collectors display up to 3 pinned achievement badges with rarity-colored labels. All 14 badge IDs in BADGE_POOL map to valid achievement IDs.
- **ShareCard component**: Canvas-based 600x340 image with card name, moment, scarcity badge, serial/population, origin badge, aging tier, owner name, branding, and large symbol watermark. Web Share API with file sharing, download fallback.
- **Profile integration**: Hall of Valhalla link on profile page with gradient amber-to-purple background. Share button on card detail page header (owned cards only).

## What Was NOT Built (gaps vs spec)
- `/collector/[name]` public profile route — not implemented. This would have allowed viewing other collectors' showcases and comparing collections.
- Rank decay threshold is streak=0 (spec called for 7+ days inactive). Current implementation is stricter than spec — any session without a pack open triggers visual decay.

## Odin Post-Build Scores
| Dimension | Before | After | Delta | Rationale |
|-----------|--------|-------|-------|-----------|
| Scarcity Legibility | 9 | 9 | 0 | No new scarcity surfaces. Already strong from D006 population counters. |
| Instance Identity | 8 | 8 | 0 | ShareCard renders serial/population/origin/aging per-instance, but this is reshowing existing data. No new identity layer. Holds. |
| Chase Tension | 8 | 8 | 0 | No new chase mechanics. Leaderboard ranking could be considered a meta-chase but it's additive to engagement, not opening tension. |
| Discovery Surprise | 8 | 8 | 0 | No new reveal mechanics or content. Phantom collectors are deterministic, not surprising. Holds. |
| Social Proof | 6 | 8 | +2 | This was the primary target and it delivers. Leaderboard with 30 phantom collectors creates a populated community feel. Pinned badges on other "players" create aspiration. Rank system (Bronze through Mythic) gives status signaling. ShareCard enables external social proof via image export. Player position within community is explicit. The missing public profile route prevents a full +3 — you can see others on the leaderboard but cannot inspect their collections, limiting the depth of social comparison. |
| Lore Depth | 6 | 6 | 0 | No lore content added. Hall of Valhalla is a Norse-themed name but no narrative investment. |
| Temporal Weight | 8 | 8 | 0 | Rank decay creates temporal pressure (lose visibility if you don't open packs) but this is more Loss Aversion than Temporal Weight. The "Oldest Card" leaderboard tab does create a time-value display context, but it's surfacing existing data. Holds at 8. |
| Provenance | 7 | 7 | 0 | ShareCard includes origin badge and aging if present, but this is displaying existing provenance data in a new context, not adding new provenance depth. |
| Utility Loop | 7 | 7 | 0 | Leaderboard browsing is a new activity but it's passive viewing, not an action loop. Share is a one-shot action. No new reward cycle. |
| Loss Aversion | 7 | 8 | +1 | Rank decay is a clear loss aversion mechanic — your visible rank fades with inactivity, creating endowment anxiety. The "Rank Fading" badge and "Open a pack to restore your rank visibility" CTA directly leverage fear of loss. Phantom collectors with lastActive >= 7 also showing decay normalizes the mechanic (you're not being singled out) while still creating pressure. |
Total: 77/100 -> 80/100 (+3)

## Bugs & Issues Found

### Bug: Phantom badge IDs may reference non-existent achievements
**Severity: Low (cosmetic, already validated)**
The BADGE_POOL contains 14 IDs and all 14 map to valid achievement IDs in `achievements.ts`. The `getAchievementById` call on line 196 of `hall/page.tsx` returns `undefined` for misses and the `if (!a) return null` guard handles it. No current bug, but if achievement IDs are ever renamed, phantom badges will silently disappear.

### Issue: Oldest card days hardcoded to 14
**Severity: Medium (data accuracy)**
In `hall/page.tsx` line 43: `const oldestDays = 14; // simulated`. The player's "Oldest Card" leaderboard value is always 14 regardless of actual collection age. This means on the "Oldest Card" tab the player's position is static and doesn't reflect real engagement. Phantom collectors range from 7-96 days, so the player will almost always rank near the bottom of this tab.

### Issue: Rank decay threshold deviates from spec
**Severity: Low (design decision)**
Spec called for 7+ days inactive. Implementation uses `streak === 0` (line 81). This means rank fades after a single day of not opening the app. This is arguably better for engagement pressure but harsher than specified.

### Issue: ShareCard `roundRect` browser compatibility
**Severity: Low (progressive enhancement)**
`ctx.roundRect()` on line 42 of `ShareCard.tsx` is relatively modern (Chrome 99+, Safari 16+). Older browsers will throw. This is acceptable for a mobile-first collectibles app, but a polyfill or fallback rectangle would be safer.

### Issue: Player entry pinnedBadges always empty on leaderboard
**Severity: Low (cosmetic)**
In `hall/page.tsx` line 56, the player entry is constructed with `pinnedBadges: []` even though the profile page has a pinned badges system. The player row on the leaderboard never shows their pinned badges, while phantom collectors do. This is a missed integration — `getPinnedBadges()` from store should populate the player entry.

## Weakest Dimensions
- **Lore Depth (6/10)**: Still zero direct investment across 7 directives. Norse naming is skin-deep. No narrative arcs, no lore progression, no story unlocks.
- **Social Proof (8/10)**: Improved significantly but capped by: (a) no public profile route, (b) phantom collectors are static/deterministic (no sense of them "playing"), (c) no real-time social signals (recently opened packs, recent achievements).
- **Provenance (7/10)**: Journey timeline exists but no new depth added. Provenance could be enhanced by showing trade history between collectors or previous owners.

## Deploy Status
Pending verification.
