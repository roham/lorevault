# Daemon v2 — Cycle 20
Phase: 2
Date: 2026-04-14
Version: v8.63

## What Was Built
- **9-inning mode toggle**: Pregame screen now has a segmented control (3 Innings "Quick" / 9 Innings "Full") above difficulty selection. Defaults to 3. Selection is passed through to `createGame()`.
- **Box score table**: Game over screen now shows a per-character batting line for the player's team — AB, H, HR, RBI, BB columns. Computed from game log by filtering `half === 'bottom'` entries. Sorted by most productive (H+BB). Color-coded: HR in amber, RBI in blue, zeros dimmed.
- **9-inning scoreboard badge**: When playing a 9-inning game, a blue "9 INN" badge appears next to the difficulty badge in the scoreboard header.
- **Game Over label**: Shows "Game Over — Full Game" for 9-inning games.
- **Hub description update**: Baseball hub "Play Ball" card updated to say "3 or 9 innings" instead of just "3-inning quick match".

Files changed:
- `src/app/games/baseball/play/page.tsx` — `selectedInnings` state, pregame toggle, `handleSelectDifficulty` accepts innings param, `gameLength` in BoardState, box score table in game over, 9-inning badge, game over label
- `src/app/games/baseball/page.tsx` — Updated "Play Ball" description

## Scores (post-Cycle-20 estimate)
- Engine completeness: 9/10 (9-inning mode was already supported, now exposed to UI)
- UI quality: 9/10 (box score, mode toggle, badges)
- Strategic depth: 7.5/10
- Visual polish: 7/10
- Fun factor: 8/10 (full games feel meaningfully different from quick games)

## Key Decisions
1. Used `useState` for `selectedInnings` rather than adding it to the reducer — it's a pregame-only UI concern, not game state
2. Box score computes from existing `game.log` rather than tracking stats in a separate data structure — avoids new state
3. Engine already supported `innings: 3 | 9` on `GameState` and `createGame` — this cycle just exposed the parameter through the UI
4. Segmented control uses Tailwind classes (no additional dependencies) for a clean toggle between modes
5. 9-inning badge only shows for 9-inning games — 3-inning is the default, no badge needed

## Next Target
Cycle 21: Achievement integration — in-game achievements triggered by gameplay events

## Deploy URL
Pending — Vercel deployment blocked by permission gate
