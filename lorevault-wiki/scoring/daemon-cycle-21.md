# Daemon Cycle 21 — DIRECTIVE-011 Scoring

## Directive: Live Pulse Feed + Collector Reactions
- **Commit**: 31ad47a
- **Version**: v8.31
- **Date**: 2026-04-14

## Acceptance Criteria Check

- [x] Pulse engine with seeded PRNG (hashCode + Park-Miller LCG)
- [x] 5 reaction types: Fire / Jealous / Respect / Want / GG
- [x] Phantom reactions 3-12 per event from seeded hash
- [x] Player activity extraction from CardMeta history
- [x] FOMO counter: deterministic daily counts + player pull increments
- [x] User reaction persistence in localStorage (toggle logic)
- [x] Persistent ticker fixed at bottom-[72px] above nav
- [x] Auto-rotation every 4s, pauses when drawer open
- [x] AnimatePresence slide transitions on ticker events
- [x] PulseDrawer half-sheet (max-h 60vh, spring animation)
- [x] Reaction bar with micro-burst animation
- [x] FOMO counter chip in ticker bar
- [x] Backdrop overlay when drawer open
- [x] FOMO section on Home page (3 stat boxes)
- [x] "Your Activity" section on Profile page
- [x] LivePulse injected in layout.tsx, main padding adjusted

## Dimension Scores

| # | Dimension | Before | After | Δ | Rationale |
|---|-----------|--------|-------|---|-----------|
| 1 | Scarcity Gradient | 9 | 9 | 0 | Pulse highlights legendaries but mechanics unchanged |
| 2 | Visual Polish | 9 | 9 | 0 | Clean ticker, tight micro-burst animation |
| 3 | Social Proof | 8 | 9 | +1 | Live ticker, phantom names, reactions, FOMO counter |
| 4 | Narrative Depth | 9 | 9 | 0 | Generic phantom names, no new lore |
| 5 | Temporal Weight | 8 | 8 | 0 | Static timestamps, no real temporal dynamism |
| 6 | Loss Aversion | 8 | 9 | +1 | FOMO counter + daily-reset urgency + "others pulling" anxiety |
| 7 | Utility Loop | 8 | 8 | 0 | Reactions cosmetic only, no reward loop |
| 8 | Instance Identity | 9 | 9 | 0 | No new per-card identity |
| 9 | Discovery Thrill | 9 | 9 | 0 | Deterministic feed, no novelty |
| 10 | Completion Drive | 9 | 9 | 0 | No new collection axis |

## Total: 93/100 (was 91, +2)

Social Proof: 8→9 (+1). Loss Aversion: 8→9 (+1).

## Issues Found

1. **Ticker z-index race** (High): Click during backdrop animation can toggle drawer twice. Fix: pointer-events-none on ticker when drawer open.
2. **Static timestamps decay** (Medium): "2m ago" never advances in-session.
3. **Profile reactions read-only** (Medium): Your Activity shows counts but no interaction, inconsistent with drawer.
4. **Splice interleaving compression** (Low): Player events cluster near top instead of evenly spacing.
5. **Park-Miller degenerate seed** (Low): seed=2147483647 produces 0 permanently.
