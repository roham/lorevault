# Daemon Build Cycle 11 — Sealed/Reveal UX
Date: 2026-04-14
Directive: DIRECTIVE-001
Version: v8.21

## Frigga Research Summary
- **Pokemon TCG Pocket**: 3-keyframe flip with midpoint translateZ lift (750ms). Card physically rises before rotating. Documented dopamine response from kinetic feedback alone.
- **Honkai Star Rail**: Rarity-coded color gate — door glows blue/purple/gold 1-2s BEFORE reveal. Players learn to read color before art appears. 10-second total animation with three-act escalation.
- **Marvel Snap**: Dark substrate, card as "visual hierarchy apex." On acquisition: dim to near-black, card scales to 1.2x, gold/white particle spray. Half-tone texture at 5% opacity.
- **Web standard**: perspective:100em, preserve-3d, backface-visibility:hidden. Three keyframe states: flat → edge-on+lifted → face-up. Linear timing, 750ms.

## Odin Pre-Build Scores
| Dimension | Score | Evidence |
|-----------|-------|----------|
| Scarcity Legibility | 7 | Glow classes, border width by tier, color-coded serials, corner accents. Sealed overlay hides tier at max anticipation. |
| Instance Identity | 2 | Serial number rendered at 7px. No "this is card #47" moment. |
| Chase Tension | 4 | Sort rarest last, 2.5s anticipation shake. But cards reveal fully visible — no deferred gratification. |
| Discovery Surprise | 5 | Burst for epic/legendary, particles for legendary, scarcity color wash. But fires on card arrive, not identity reveal. |
| Social Proof | 3 | "NEW CARD" / "Already in collection" only social signal. No ownership counts. |
| Lore Depth | 3 | loreText exists on back face. Never surfaces in pack opening. |
| Temporal Weight | 1 | getCardAge() implemented, acquiredAt stamped. Nothing in UI reads it. |
| Provenance | 1 | history array tracks events. revealCard() never called. No UI for chain. |
| Utility Loop | 5 | Battle, trivia, daily missions, XP, season pass wired. Disconnected from sealed state. |
| Loss Aversion | 2 | Duplicate detection cosmetic. No burn/trade/upgrade path for dupes. |
Total: 33/100

## What Was Built
**DIRECTIVE-001: Complete sealed/reveal UX**

Two files changed: `src/components/CardItem.tsx` + `src/app/packs/page.tsx`.

Key changes:
- `forceRevealed` prop on CardItemStatic overrides localStorage sealed check
- Card art always rendered (blurred hint behind frosted glass when sealed)
- Sealed overlay scales with card size (lg/xl get larger elements)
- Pack opening: cards arrive sealed, user taps each to reveal
- Multi-phase reveal animation: rarity gate ring (0.7s), scale pulse ([1, 1.08, 0.97, 1.04, 1]), flash burst, scarcity-colored particles (rare:8, epic:16, legendary:24)
- Card count dots hide rarity color until revealed
- Glow classes apply only after reveal
- "Next Card" button gated on reveal completion, enters with animation
- Info block: sealed shows pulsing "Tap to reveal", revealed shows character details with scale entrance
- Summary strip uses forceRevealed={true}
- revealCard() now called — 'revealed' event stamped in provenance history

## Odin Post-Build Scores
| Dimension | Before | After | Delta |
|-----------|--------|-------|-------|
| Scarcity Legibility | 7 | 8 | +1 |
| Instance Identity | 2 | 3 | +1 |
| Chase Tension | 4 | 7 | +3 |
| Discovery Surprise | 5 | 8 | +3 |
| Social Proof | 3 | 3 | 0 |
| Lore Depth | 3 | 3 | 0 |
| Temporal Weight | 1 | 1 | 0 |
| Provenance | 1 | 1 | 0 |
| Utility Loop | 5 | 5 | 0 |
| Loss Aversion | 2 | 3 | +1 |
Total: 33/100 → 43/100 (+10)

## Reviewer Notes
- Acceptance criteria fully met
- Math.random() in particle render path — cosmetic jitter risk on re-render, not blocking
- Reveal flash could re-trigger on hypothetical back-navigation (not reachable in current flow)
- Guided tutorial text could use tense adjustment for post-reveal context
- Future: add navigator.vibrate(50) for haptic feedback on mobile
- Future: useEffect cleanup for setTimeout on unmount

## Weakest Dimension
Provenance (1/100). Every card is anonymous — no mint timestamp displayed, no original-owner chain, no "was this the 1st mint or the 10,000th?" For financial gambler-collectors, provenance IS the value thesis. The reveal animation creates discovery moments but nothing answers "whose hands has this been in?" Both Provenance and Temporal Weight are addressable in a single data layer + UI change.

## Cross-Product Signal
**Rarity gate ring pattern** (expanding colored border on tap, 0.7s ease-out) is portable to NBA Top Shot and any Dapper product with multi-card reveal. It solves the "what just happened" moment of seal-break without obscuring art. The ring expands away from the card as art appears. More information-rich than a single flash at same moment cost.

**Dots-hide-rarity pattern** keeps late-pack tension alive. Prevents the failure mode where dot colors telegraph the legendary before the user taps.

## Deploy URL
https://lorevault-site-dd13jji93-ros-projects-9a9bb0c9.vercel.app
