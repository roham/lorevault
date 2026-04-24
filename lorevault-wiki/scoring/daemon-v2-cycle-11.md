# Daemon v2 — Cycle 11
Phase: 2
Date: 2026-04-14
Version: v8.54

## What Was Built
- `src/data/baseball-stats.ts` — Complete baseball stat mapping for all 99 LoreVault characters
- 84 hitters + 15 pitchers across 6 sets
- Dracula dual-card: hitter (Count Dracula) + pitcher variant (Dracula)
- Helper functions: `getBaseballCard`, `getAllHitters`, `getAllPitchers`, `buildCardRegistry`
- Point cost calculators: `calculateHitterCost`, `calculatePitcherCost`

## Frigga Research Summary
MLB Showdown stat balancing insights applied:
- Point cost formula: `(OB-6)*1.5 + Power*0.4 + (Speed-10)*0.5 + Defense*0.8` for hitters
- Distribution targets: 12 elite / 30 good / 40 average / 17 budget — we landed at 17/43/33/6
- Keep 30-point tier to 3 max → only The Norns at 30, Moriarty at 28
- Ensure 25% Speed A for steal viability → achieved 23%
- Avoid pitcher scarcity/redundancy — 15 pitchers with clear tier separation (9 ace, 6 crafty)

## Scores (from Odin — evaluating cycles 9-10 engine)
- Engine completeness: 8/10
- Strategic depth: 7/10
- Fun factor: 8/10
- UI quality: N/A (no UI yet)
- Visual polish: N/A (no UI yet)

### Cycle 11 specific scores (self-assessed)
- Character coverage: 10/10 — all 99 characters mapped
- Thematic fidelity: 9/10 — Hercules slugs, Alice contacts, Zeus pitches aces
- Balance quality: 8/10 — 150-cap teams require real tradeoffs (all-star=212)
- Pitcher depth: 8/10 — every set has 2-3 pitchers for themed teams
- Data structure: 9/10 — clean types, registry builder, cost calculators

## Key Decisions
1. **Separate bb-* IDs instead of matching card-N IDs**: Baseball cards are per-character, not per-card-instance. One set of stats for "Sherlock Holmes" regardless of which collection card variant.
2. **No back-end pitchers (Control 1-2)**: Control 1-2 wins the control roll only 5-10% of the time = nearly useless. Minimum viable pitcher is Control 3.
3. **Dracula gets both a hitter and pitcher card**: Thematically the count dominates in both roles. Only character with dual role.
4. **The Norns are the most expensive card (30pts)**: Weavers of fate = Control 6, Fielding 4. Choosing them as your pitcher means severe budget constraints for hitters.

## Stat Distribution
| Tier | Cost Range | Count |
|------|-----------|-------|
| Elite | 20-30 | 17 |
| Good | 14-19 | 43 |
| Average | 8-13 | 33 |
| Budget | 1-7 | 6 |

Speed: 23% A / 51% B / 26% C
Pitchers: 9 Ace (Control 5-6) / 6 Crafty (Control 3-4)

## Next Target
Cycle 12: Lineup builder UI — `src/app/games/baseball/page.tsx` + `src/app/games/baseball/lineup/page.tsx`
- Drag-and-drop roster construction using @dnd-kit
- 150-point cap with live counter
- Position assignment + batting order
- Auto-fill button for casual players
- Save lineups to localStorage

## Deploy URL
https://lorevault-site-8irtjsi1b-ros-projects-9a9bb0c9.vercel.app
