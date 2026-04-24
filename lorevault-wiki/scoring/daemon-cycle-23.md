# Daemon Cycle 23 — DIRECTIVE-013 Scoring

## Directive: Ghost Cards + Hidden Pull Mechanics + Mutation Overlay
- **Commit**: 1957c96 (initial), hotfix in D014 commit
- **Version**: v8.33
- **Date**: 2026-04-14

## Acceptance Criteria Check

- [x] 6 ghost cards in GHOST_CARDS array, not in ALL_CARDS
- [x] isGhostCard() / getGhostCardById() helpers
- [x] getPacksOpened() / incrementPacksOpened() persisted
- [x] checkGhostConditions() with 6 distinct triggers
- [x] 15% RNG gate per condition
- [x] Ghost injected into pack (replaces drawn[0])
- [x] Ghost sorted last in pack reveal
- [x] ghost-pulse keyframe + .ghost-sealed-border CSS
- [x] ghost-reveal-flash keyframe defined
- [x] Ghost sealed overlay in CardItemStatic (with isSealed gate)
- [x] Ghost sealed overlay in CardItemInteractive (fixed: added isSealed gate)
- [x] getMutationState() awakened/ascended tiers
- [x] mutation-halo / mutation-halo-gold keyframes
- [x] Mutation class on both card component wrappers
- [x] ghost-finder achievement with hidden: true
- [x] Profile page renders ??? for hidden unearned achievements
- [x] hidden?: boolean on Achievement type
- [x] Ghost ownership persists via getOwnedCards() (fixed: added GHOST_CARDS to lookup)
- [ ] ghost-reveal-flash CSS class defined but never applied in code

## Dimension Scores

| # | Dimension | Before | After | Δ | Rationale |
|---|-----------|--------|-------|---|-----------|
| 1 | Scarcity Gradient | 9 | 10 | +1 | Ghost cards are a genuine phantom tier above legendary — zero supply disclosure, hidden existence, no marketplace listing |
| 2 | Visual Polish | 10 | 10 | 0 | Ghost-pulse and mutation-halo animations are clean |
| 3 | Social Proof | 9 | 9 | 0 | No new social surfaces |
| 4 | Narrative Depth | 9 | 9 | 0 | Ghost card lore text is strong but no new codex integration |
| 5 | Temporal Weight | 9 | 9 | 0 | Mutation state rewards long-term holding but requires real calendar time |
| 6 | Loss Aversion | 9 | 9 | 0 | Ghost injection replaces drawn[0] — subtle sacrifice mechanic |
| 7 | Utility Loop | 9 | 9 | 0 | Ghost cards have no unique utility mechanics |
| 8 | Instance Identity | 9 | 9 | 0 | Mutation halo adds identity layer but unreachable in testing timeframe |
| 9 | Discovery Thrill | 9 | 10 | +1 | 6 distinct hidden conditions with different trigger logic is exactly the multi-axis discovery design this dimension targets |
| 10 | Completion Drive | 9 | 9 | 0 | Hidden achievement adds chase target |

## Total: 97/100 (was 95, +2)

Scarcity Gradient 9→10, Discovery Thrill 9→10.

## Issues Found (Pre-Fix)

1. **CRITICAL (FIXED)**: `getOwnedCards()` filtered only `ALL_CARDS` — ghost cards silently orphaned. Fix: merged GHOST_CARDS into lookup.
2. **CRITICAL (FIXED)**: `CardItemInteractive` ghost overlay missing `isSealed` gate — permanently rendered. Fix: added `&& isSealed` condition.
3. **High (FIXED)**: `ghost-mirror-sherlock` strict equality `=== 5` caused permanent lock-out. Fix: changed to `>= 5`.
4. **Medium**: `ghost-reveal-flash` CSS class defined but never applied in any component.
5. **Low**: `getGhostCardById()` exported but never used.
