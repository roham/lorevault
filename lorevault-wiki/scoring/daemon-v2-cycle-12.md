# Daemon v2 — Cycle 12
Phase: 2
Date: 2026-04-14
Version: v8.55

## What Was Built
- `src/app/games/baseball/page.tsx` — Baseball hub page with saved lineups, how-to-play
- `src/app/games/baseball/lineup/page.tsx` — Full lineup builder:
  - Card pool: all 99 cards, filterable by set (6 sets) and role (hitter/pitcher), sortable by cost/name
  - Position slots: 9 hitter positions (C/1B/2B/SS/3B/LF/CF/RF) + 1 pitcher
  - Budget meter: animated bar, green/yellow/red states, shake on over-budget
  - Batting order: numbered list with reorder-up controls
  - Auto-fill: greedy efficiency algorithm, assigns mid-range pitcher + best value hitters
  - localStorage save (max 10 lineups)
  - Tap-to-assign flow: tap slot → card pool filters to matching type → tap card to assign
- Updated `src/app/games/page.tsx` — Added Baseball as featured game mode with "New" badge

## Frigga Research Summary
Key UX decisions applied from Frigga's research:
- Tap-to-assign > drag-to-slot for mobile (fat fingers, small targets)
- Desktop gets split-panel layout (pool left, lineup right sticky)
- Budget counter at top of lineup panel, not floating
- Over-budget: warm red + shake animation, never blocks placement
- Auto-fill respects manually placed cards (greedy around locked slots)

## Odin Cycle 11 Scores
- Character coverage: 9/10
- Thematic fidelity: 10/10
- Balance quality: 8/10
- Data structure: 10/10
- Total: 37/40

## Cycle 12 Self-Assessment
- UI completeness: 8/10 — all core flows work, no drag-and-drop yet (tap-to-assign is primary)
- Mobile responsiveness: 8/10 — 2-col card grid, single-column lineup, sticky header
- Budget UX: 9/10 — animated bar with color states, disabled cards over budget
- Auto-fill quality: 7/10 — greedy algorithm works but doesn't optimize for position-stat matching
- Polish: 7/10 — functional but visual card items could be richer

## Key Decisions
1. **Tap-to-assign instead of @dnd-kit drag**: Frigga research showed drag-to-slot fails on mobile. The lineup builder uses tap → select flow. Drag-and-drop can be added as enhancement later.
2. **Quick-assign shortcut**: Tapping a card without selecting a slot first assigns it to the first empty slot. Speeds up casual building.
3. **No @tanstack/virtual for 99 cards**: 99 items doesn't warrant virtualization overhead. Straightforward grid.
4. **SET_ID_MAP for set filtering**: Static map from card ID prefix to set. Fast, deterministic, no regex.

## Next Target
Cycle 13: Game board UI — the diamond. Visual baseball diamond, scoreboard, current at-bat display, roll button, play-by-play log.

## Deploy URL
https://lorevault-site-nh3ohov6n-ros-projects-9a9bb0c9.vercel.app
