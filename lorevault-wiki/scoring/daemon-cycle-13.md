# Daemon Build Cycle 13 — Card Aging Visual Effects
Date: 2026-04-14
Directive: DIRECTIVE-003
Version: v8.23

## Frigga Research Summary
- **Hearthstone**: Golden cards use animated shimmer overlay + saturate/brightness boost. Binary (golden or not), but the visual vocabulary of "enhanced frame + glow + animation" communicates investment.
- **Pokemon TCG PSA grading**: Corner whitening is the #1 legibility signal. Gloss loss (contrast reduction), saturation fade, and edge fraying communicate handling. Digital translation via radial gradients at corners + filter chain.
- **NBA Top Shot**: Serial-based visual differentiation. No usage-based aging — missed opportunity. Early mint gets prestige frame.
- **FIFA Ultimate Team**: Games-played counter visible but no progressive visual wear. Industry has defaulted to numbers over visual encoding — LoreVault's gap to exploit.
- **CSS technique stack**: `filter` (sepia, brightness, contrast, saturate) for overall tone shift. `::before` radial gradients for corner whitening/vignette. `::after` for glow overlays. `mix-blend-mode: multiply` for edge wear. Keyframe animations for pristine sheen and bonded pulse.

## Odin Pre-Build Scores
| Dimension | Score | Evidence |
|-----------|-------|----------|
| Scarcity Legibility | 8 | Glow classes, border width by tier, sealed overlay. |
| Instance Identity | 3 | Serial number at 7px. No visual differentiation between same-card instances. |
| Chase Tension | 8 | Sealed/reveal, Norse chase targets, feed copy seeds desire. |
| Discovery Surprise | 9 | Multi-phase reveal, 6 sets, Norse deep-cut characters. |
| Social Proof | 3 | "NEW CARD" / "Already in collection" only. |
| Lore Depth | 5 | Norse loreText from primary Eddic sources. |
| Temporal Weight | 1 | getCardAge() + acquiredAt exist. Nothing visual reads them. |
| Provenance | 1 | history array tracks events. No UI surfaces it. |
| Utility Loop | 5 | Battle, trivia, missions, XP, season pass. |
| Loss Aversion | 3 | Duplicate detection cosmetic. |
Total: 46/100

## What Was Built
**DIRECTIVE-003: Card aging visual effects**

Files changed: `src/lib/store.ts`, `src/components/CardItem.tsx`, `src/app/globals.css`, `src/app/card/[id]/page.tsx`.

Key changes:
- `getAgingTiers(cardId)` — computes composable two-axis aging from card metadata
- Battle axis: pristine (0 battles, 0 trades, <7 days) → seasoned (10+) → battle-worn (50+) → veteran (100+ battles AND 60+ days)
- Time axis: bonded (30+ days) → ancient (90+ days)
- CSS filter composition via `getAgingFilter()` — sepia, brightness, contrast, saturate
- `<AgingOverlays>` component renders overlay divs inside overflow-hidden container:
  - Pristine: animated light sweep (4s infinite)
  - Battle-worn: radial vignette darkening, multiply blend
  - Veteran: deep vignette + inner border scar
  - Bonded: warm amber inner glow pulse (6s infinite)
  - Ancient: deep amber patina glow (8s infinite)
- Both CardItemStatic and CardItemInteractive render aging effects
- Card detail page shows aging tier badges (✦ Pristine, ⚔ Seasoned, ⚔ Battle-Worn, 🏛 Veteran, ♥ Bonded, ⏳ Ancient)

## Odin Post-Build Scores
| Dimension | Before | After | Delta |
|-----------|--------|-------|-------|
| Scarcity Legibility | 8 | 8 | 0 |
| Instance Identity | 3 | 6 | +3 |
| Chase Tension | 8 | 8 | 0 |
| Discovery Surprise | 9 | 9 | 0 |
| Social Proof | 3 | 4 | +1 |
| Lore Depth | 5 | 5 | 0 |
| Temporal Weight | 1 | 7 | +6 |
| Provenance | 1 | 2 | +1 |
| Utility Loop | 5 | 6 | +1 |
| Loss Aversion | 3 | 5 | +2 |
Total: 46/100 → 60/100 (+14)

## Reviewer Notes
- Acceptance criteria fully met
- `agingTiers` computed in `useState` initializer — stale on same-session re-navigation without remount (acceptable for demo, would need `useSyncExternalStore` for production)
- Seasoned tier only gets filter (no overlay) — extremely subtle, may not be perceivable
- Three infinite CSS animations on collection grid could compound on low-end devices — monitor
- Future: aging tooltip on hover ("Battle-Worn: 53 battles, 42 days held") would push Temporal Weight to 8
- Future: provenance timeline on card detail (render history array) would push Provenance from 2 to 5+
- Future: aging tier progression bar ("23/50 battles to Battle-Worn") would push Utility Loop to 7+
- Future: "Pristine" as explicit collector achievement creates play-vs-preserve tension

## Weakest Dimension
Provenance (2/10). The `CardMeta.history` array stores a rich event chain (pulled, revealed, battle_win, battle_loss, showcased, traded) but none of it is shown to the user. No ownership timeline, no "First Owner" badge, no pull-context display. Data layer is ready; presentation layer is absent. Lowest-hanging fruit for the next directive.

## Cross-Product Signal
**Composable two-axis aging (battle × time)** maps to Top Shot's Moment grading gap. Top Shot moments gain value from game significance but have no visual wear layer. The **pristine tier** is particularly interesting — it rewards non-use, creating collector tension between "play with it" and "keep it mint" that mirrors physical card culture (PSA 10 vs. played condition). No existing NFT marketplace offers this differentiation axis.

## Deploy URL
https://lorevault-site-p5ilufky6-ros-projects-9a9bb0c9.vercel.app
