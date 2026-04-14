# Daemon v2 — Cycle 10
Phase: 2
Date: 2026-04-14
Version: v8.53

## What Was Built
- `src/lib/baseball/game.ts` — Full game loop state machine:
  - `playAtBat(state, cards, attemptSteal?)` — core game step
    - Pre-at-bat steal attempts with catcher defense check
    - Control roll: d20 vs pitcher's Control stat
    - Outcome roll: looked up on controlling player's chart
    - Runner advancement with Speed-based extra bases
    - Sac fly: flyout + runner on 3rd + < 2 outs → auto-score
    - Double play: groundout_dp + runner on 1st → SS defense × 3 check
    - Walk-off detection in bottom of final inning
    - Detailed play-by-play descriptions
  - `simulateGame(state, cards)` — AI vs AI full game simulation (max 200 at-bats safety)
  - `getGameSummary(state)` — MVP (hits × 2 + RBIs × 3), key plays
  - `CardRegistry` type alias for Map<string, BaseballCard>

## Scores (Phase 2 — Engine)
- Engine completeness: 5/10 (core mechanics done, needs character data)
- UI quality: 0/10 (no UI yet)
- Strategic depth: 6/10 (control roll + steal + DP + sac fly)
- Visual polish: 0/10 (no visuals yet)
- Fun factor: N/A (can't play yet)

## Key Decisions
- All game state transitions return new state objects (immutable pattern for React)
- Double play odds: fielder defense × 3 vs d20 (gives realistic ~15-30% chance)
- Caught stealing counts as an out and can end half-inning
- MVP formula weighs RBIs 3× more than hits — rewards clutch hitting
- Safety valve: simulateGame caps at 200 at-bats to prevent infinite loops

## Next Target
Cycle 11: Character stats for all 100 LoreVault characters (baseball-stats.ts)

## Deploy URL
https://lorevault-site-7rdwdlpbk-ros-projects-9a9bb0c9.vercel.app
