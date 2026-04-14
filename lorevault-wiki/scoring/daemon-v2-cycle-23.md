# Daemon v2 — Cycle 23
Phase: 2
Date: 2026-04-14
Version: v8.66

## What Was Built
- **LoreVault XP integration**: Baseball games now award global Collector XP that feeds into the collector level/tier progression and battle pass.
  - Win: +40 Collector XP
  - Loss: +15 Collector XP
- **New XPSource types**: `baseball_win` (40 XP) and `baseball_loss` (15 XP) added to the `XPSource` union type and `XP_VALUES` record.
- **Game over XP display**: The XP breakdown section now shows two rows — "Baseball XP" (per-character XP) and "Collector XP" (+40/+15 global XP).
- **`addCollectorXP` call**: Game over handler calls `addCollectorXP(0, source)` which auto-looks up the value from `XP_VALUES`, adds to collector XP, pass XP, and monthly XP.

Files changed:
- `src/data/types.ts` — Added `baseball_win` and `baseball_loss` to `XPSource`, added values to `XP_VALUES`
- `src/app/games/baseball/play/page.tsx` — Import `addCollectorXP`, call on game over, dual XP display

## Scores (post-Cycle-23 estimate)
- Engine completeness: 9/10
- UI quality: 9/10
- Strategic depth: 7.5/10
- Visual polish: 7.5/10
- Fun factor: 9/10 (playing baseball directly levels up your collector profile)
- Integration depth: 9/10 (XP + achievements + records + feed)

## Key Decisions
1. Used the existing `addCollectorXP(0, source)` pattern where passing 0 for amount triggers auto-lookup from XP_VALUES — consistent with how battle and trivia XP work
2. Baseball wins award more than battle wins (40 vs 30) because baseball games take longer and have more engagement
3. Losses still award XP (15) to encourage trying harder difficulties
4. Both baseball-specific XP (per-character) and global collector XP are shown in the game over screen, so players see both progression systems

## Next Target
Cycle 24: Daily challenges — "Win 2 baseball games today for +100 bonus XP"

## Deploy URL
Pending
