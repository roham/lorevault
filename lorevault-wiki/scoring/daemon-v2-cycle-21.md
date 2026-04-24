# Daemon v2 — Cycle 21
Phase: 2
Date: 2026-04-14
Version: v8.64

## What Was Built
- **6 baseball achievements** added to the existing achievement system:
  - `Play Ball!` (common) — Play your first baseball game
  - `Opening Day` (common) — Win your first baseball game
  - `Pennant Race` (uncommon) — Win 5 baseball games
  - `Legend Slayer` (rare) — Beat a Legend difficulty team
  - `Iron Man` (uncommon) — Win a full 9-inning game
  - `Shutout` (rare) — Win without allowing any runs
- **Difficulty tracking in game records**: `GameRecord.difficulty` field added (optional for backwards compatibility with existing saves)
- **Achievement checking on game over**: `checkAchievements()` called after saving game record. `legend-slayer` also checked directly from game context since difficulty data wasn't previously in records.
- **`saveGameRecord` updated** to accept and persist difficulty parameter

Files changed:
- `src/lib/achievements.ts` — 6 new achievement definitions, baseball achievement checks, import baseball records
- `src/lib/baseball/records.ts` — `difficulty` field on `GameRecord`, `saveGameRecord` accepts difficulty param
- `src/app/games/baseball/play/page.tsx` — imports `checkAchievements` + `earnAchievement`, calls them on game over, passes difficulty to `saveGameRecord`

## Scores (post-Cycle-21 estimate)
- Engine completeness: 9/10
- UI quality: 9/10
- Strategic depth: 7.5/10
- Visual polish: 7/10
- Fun factor: 8.5/10 (achievements add replay motivation)
- Achievement integration: 9/10 (plugs into existing system seamlessly)

## Key Decisions
1. Used existing `battle` category for baseball achievements — no need to add a new category to the type system
2. Made `difficulty` optional on `GameRecord` for backwards compatibility with existing localStorage data
3. `legend-slayer` is checked both from game history (for catch-up) and directly in the game over handler (for immediate trigger)
4. Achievement totals: 39 achievements now (33 original + 6 baseball), keeping the system from feeling sparse but not overwhelming
5. All achievements use the same `earnAchievement` + `checkAchievements` pipeline — no special baseball-only path needed

## Next Target
Cycle 22: Share game results — post-game share card with score, MVP, and key stats

## Deploy URL
Pending — Vercel deployment blocked by permission gate
