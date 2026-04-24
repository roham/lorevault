# Daemon Build Cycle 19 — Provenance Deepening
Date: 2026-04-14
Directive: DIRECTIVE-009
Commit: c9e3820

## What Was Built
**DIRECTIVE-009: Provenance Deepening**

Files added/changed:
- `src/lib/legacy.ts` — New module: seeded PRNG, `generateValueHistory()` (90-day sparkline data), `computeLegacyScore()` (4-dimension composite with tiers), `getLegacyTierConfig()` helper
- `src/components/CardJourney.tsx` — Added `computeLineageStamps()` function and lineage stamp rendering (pill badges above event timeline)
- `src/app/card/[id]/page.tsx` — Integrated value history sparkline section, legacy score section with animated bar breakdown, imports from `legacy.ts`

Key features:
- **Value History Sparkline**: 90-day SVG area chart on every card detail page (owned or not). Uses seeded PRNG from card ID for deterministic curves. Scarcity-based pricing: legendaries base $500 trending +0.8%/day, commons base $3 trending -0.2%/day. Population multiplier (fewer minted = higher base). Green/red color coding with percentage change indicator. Volatility scales with scarcity (legendaries ±5%, commons ±15%).
- **Lineage Stamps**: 5 milestone markers computed from card history: First Battle, 5th Victory, 10 Events Logged, 7 Days Held, 30 Days Veteran. Spring-animated pill badges with distinct icons and colors, displayed above the event timeline in CardJourney. Sorted most-recent-first.
- **Legacy Score**: 4-dimension composite (max 100): Age (0-30, 1pt/day), Battles (0-30, logarithmic via log2), Lineage (0-20, event type diversity + event count), Rarity (0-20, scarcity base + population bonus). Four tiers: Pristine (0+) → Storied (25+) → Legendary Legacy (55+) → Mythic Legacy (80+). Animated bar breakdown on card detail page. Owned cards only.
- **Bug fix**: Codex locked node click handler was dead code (D008 reviewer catch — not visible in D009 diff but noted).

## Odin Post-Build Scores
| Dimension | Before | After | Delta | Rationale |
|-----------|--------|-------|-------|-----------|
| Scarcity Legibility | 9 | 9 | 0 | Value sparklines implicitly communicate scarcity through price differentials (legendaries at $500 base vs. commons at $3), but scarcity was already well-surfaced through color, labels, serial chips, and population counters. This adds a price dimension to scarcity legibility but not a new surface. Holds. |
| Instance Identity | 8 | 9 | +1 | Legacy Score is the first mechanic that makes two identical cards (same character, same scarcity) genuinely different based on their individual history. A Legendary Thor held for 30 days with 15 battles has a different Legacy Score than a fresh pull. The value sparkline uses the card ID as PRNG seed, giving each instance a unique price curve. Lineage stamps reflect per-instance milestones. Together, these three features mean each card now has a biographical fingerprint — age, battle record, milestone achievements, and a unique value trajectory. This is a meaningful step toward per-instance identity. |
| Chase Tension | 9 | 9 | 0 | No new chase mechanics. Legacy Score creates engagement with owned cards but does not create new acquisition tension. Value sparklines showing legendaries trending up might psychologically encourage purchasing, but this is ambient, not a structured chase mechanic. Holds. |
| Discovery Surprise | 9 | 9 | 0 | Lineage stamps are a pleasant surprise when they first appear, but they are deterministic milestones visible in advance (First Battle, 5th Victory, etc.) — not emergent discoveries. No new hidden content or unexpected reveals. Holds. |
| Social Proof | 8 | 8 | 0 | Legacy Score and value history are private to the card detail page. No leaderboard integration, no "highest Legacy Score" ranking, no sharing of Legacy tier. Holds. |
| Lore Depth | 9 | 9 | 0 | No new lore content. The Legacy Score system is mechanical, not narrative. Holds. |
| Temporal Weight | 8 | 9 | +1 | This is the most significant temporal improvement since the aging system. Legacy Score's Age dimension (1pt/day, max 30) creates a 30-day progression clock on every owned card. The tier progression (Pristine → Storied → Legendary Legacy → Mythic Legacy) makes time passage visible and rewarding. Lineage stamps add temporal milestones: "7 Days Held" and "30 Days — Veteran" are explicit time-gated achievements. The value sparkline creates a visual sense of a card's price moving through time — even though it's generated, the 90-day chart communicates temporal depth. Cards now feel like they have a temporal biography: how long held, what milestones reached at what points, what tier achieved. Time is no longer just an aging patina — it's a scored, tiered, visually tracked dimension. |
| Provenance | 7 | 9 | +2 | This was the primary target and it delivers well. Before D009, provenance was limited to the CardJourney event timeline and origin badges — a chronological log with no synthesis or scoring. Now: (1) **Legacy Score** synthesizes provenance into a single composite number with transparent 4-bar breakdown. A card's "story" is now quantified — age, battles, event diversity, rarity. (2) **Value History Sparkline** gives every card a visual financial provenance — a 90-day price trajectory that communicates market context and scarcity economics. (3) **Lineage Stamps** crystallize key provenance moments into milestone markers: the first battle, the fifth win, the 10th event — provenance highlights extracted from the raw timeline. Together these transform provenance from a raw event log into a multi-layered identity system: narrative (timeline), quantitative (Legacy Score), financial (sparkline), and milestone-based (stamps). A collector can now glance at a card and understand its full biography. Withholding the final point to 10: there is still no trade history / previous-owner provenance (how many hands has this card passed through?), no provenance comparison between cards, and no "certificate of provenance" exportable artifact. |
| Utility Loop | 8 | 8 | 0 | Legacy Score incentivizes holding and battling cards (you gain score from both), but this is passive accumulation, not an active utility loop. There's no action the player takes specifically to improve their Legacy Score beyond things they were already doing. No new engagement mechanic. Holds. |
| Loss Aversion | 8 | 9 | +1 | The value sparkline showing legendaries trending upward (+0.8%/day) creates a direct "this card is appreciating" signal. Selling a legendary that the chart shows climbing means forfeiting future value — classic loss aversion. The Legacy Score compounds this: a card with high Legacy Score (high age, many battles) would lose all that accumulated biographical value if traded. You can't transfer Legacy Score. A "Mythic Legacy" card that took 30+ days to build represents invested time that would be destroyed by selling. Lineage stamps reinforce this — a card with "30 Days — Veteran" and "5th Victory" stamps feels more personally invested than a fresh pull. The combination of visible appreciation (sparkline) + accumulated biography (Legacy Score + stamps) creates meaningful separation anxiety. |

**Total: 86/100 -> 90/100 (+4)**

## Score Movement Summary
- **Provenance: 7 -> 9 (+2)** — Primary target hit. Raw event timeline upgraded to a multi-layered provenance system: quantitative scoring (Legacy Score), financial trajectory (sparkline), and milestone extraction (lineage stamps). Cards now have synthesized biographical identity, not just a log.
- **Instance Identity: 8 -> 9 (+1)** — Legacy Score differentiates individual card instances based on their unique history. Two cards of the same character/scarcity now have measurably different identities.
- **Temporal Weight: 8 -> 9 (+1)** — Legacy Score's age dimension (1pt/day for 30 days) and lineage stamps (7-day, 30-day milestones) make time passage a scored, tiered, visible dimension.
- **Loss Aversion: 8 -> 9 (+1)** — Upward-trending sparklines on rare cards + non-transferable Legacy Score + accumulated stamps create genuine separation cost.

## Bugs & Issues Found

### Bug: Legacy Score Recomputes on Every Render Due to useEffect Dependency
**Severity: Medium (performance)**
In `card/[id]/page.tsx` line 73, the `useEffect` dependency array includes `isOwned`, which is set by `setIsOwned` inside the same effect. On first load: `isOwned` starts false, the effect runs, sets `isOwned` to true (if card is owned), which triggers the effect again. On the second run, `computeLegacyScore` executes (since `isOwned` is now true). This means the entire effect body runs twice for owned cards — including `generateValueHistory`, `getPopulationData`, `getBattleRecords`, etc. Not a correctness bug (the second run produces the right state), but it doubles initialization work for owned cards.

**Fix**: Split the ownership check into a separate effect, or compute `isOwned` from `getOwnedCardIds()` directly inside the effect without calling `setIsOwned` as a dependency trigger.

### Bug: Value Sparkline Shows for Non-Owned Cards Without Context
**Severity: Low-Medium (design/UX)**
`generateValueHistory(card)` runs unconditionally at line 63, and the sparkline renders for all cards (line 442: `valueHistory.length > 0`). This means browsing a card you don't own shows an "Estimated Value History" chart with a specific dollar value and trend percentage. For a demo/prototype this is fine, but it presents generated financial data without any disclaimer. The Legacy Score is correctly gated to owned cards only (line 491: `isOwned && legacyData`), but the sparkline is not. Consider either: (a) gating sparkline to owned cards too, or (b) adding a "Simulated" label.

### Issue: Legacy Score Age Calculation Uses `Date.now()` — Not Stable Across Server/Client
**Severity: Low (SSR edge case)**
`computeLegacyScore` at line 111 uses `Date.now()` to calculate age days. Since this module is marked `'use client'`, this runs client-side only, but if Next.js ever pre-renders this path, the server and client would compute different age values, causing a hydration mismatch. Currently safe because the function is only called inside a `useEffect`, but worth noting.

### Issue: Lineage Stamp "5th Victory" Milestone Has No Corresponding "First Victory"
**Severity: Low (design gap)**
`computeLineageStamps` has "First Battle" (win or loss) and "5th Victory" (5 wins), but there's no "First Victory" stamp. A player who loses their first battle and then wins their second gets "First Battle" for the loss but no stamp for the first win. The jump from "First Battle" to "5th Victory" leaves a milestone gap for 1-4 wins. Consider adding "First Victory" (first win specifically) as a stamp.

### Issue: Legacy Score `lineageScore` Double-Counts Event Type Diversity
**Severity: Low (balance)**
In `legacy.ts` line 122: `lineageScore = Math.min(20, eventTypes.size * 4 + Math.min(8, Math.floor(events.length / 3)))`. With 6 possible event types (`pulled`, `revealed`, `battle_win`, `battle_loss`, `showcased`, `traded`), `eventTypes.size * 4` can reach 24, already exceeding the cap of 20 without the count bonus. This means the `events.length / 3` bonus is unreachable for cards with 5+ event types. The formula effectively caps at event type diversity alone, making raw event count meaningless for well-traveled cards. This may be intentional (diversity matters more than volume), but the code suggests both were meant to contribute.

### Issue: Sparkline `linearGradient` ID Collision
**Severity: Low (edge case)**
The sparkline SVG uses a hardcoded gradient ID `id="valueGrad"` (line 470). If multiple sparklines were ever rendered on the same page (e.g., in a card comparison view or a list of cards with inline sparklines), all would reference the same gradient definition, and only the first one's color would apply. Currently safe because only one sparkline exists per card detail page, but fragile for future reuse.

## Weakest Dimensions After D009
- **Social Proof (8/10)**: No new social features in 9 directives beyond the original leaderboard and share card. Legacy Score and sparklines are private — no public profiles, no "compare my card vs yours," no community activity feed.
- **Utility Loop (8/10)**: Cards still don't mechanically interact with systems in novel ways. Legacy Score incentivizes existing behavior (holding, battling) rather than creating new loops. No crafting, staking, burn, or fusion mechanics.
- **Lore Depth (9/10)**: Strong but static. No seasonal lore, no player-contributed content, no evolving narratives.

## Recommendations for Next Directive
1. **Social Proof (8 -> 9/10)**: Public collector profiles with Legacy Score leaderboard, "card comparison" between collectors, real-time activity feed ("X just unlocked Mythic Legacy on their Thor").
2. **Utility Loop (8 -> 9/10)**: Card fusion/crafting (combine 3 commons to mint 1 rare), staking for daily rewards, or burn-for-exclusive mechanics — something that creates a decision loop beyond "hold and play."
3. **Provenance (9 -> 10)**: Trade chain / previous-owner history, exportable provenance certificate, provenance comparison view.

## Deploy Status
Pending verification.
