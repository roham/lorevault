# Daemon v2 — Cycle 15
Phase: 2
Date: 2026-04-14
Version: v8.58

## What Was Built
- `src/components/baseball/StealReveal.tsx` — Spring-physics steal result card showing SB (stolen base) or CS (caught stealing) glyph, runner name, and full SPD vs DEF breakdown with threshold and actual roll
- Enhanced `src/app/games/baseball/play/page.tsx`:
  - 2 new animation phases: `steal-rolling`, `steal-result`
  - 3 new actions: `START_STEAL_ROLL`, `STEAL_DICE_LANDED`, `STEAL_RESOLVED`
  - Contextual "Steal 2nd" / "Steal 3rd" buttons appear next to Roll button when runner on base during player batting, with threshold shown inline
  - Steal dice animation (purple-themed DiceRoller) with "needs ≤{threshold}" subtitle
  - SVG Diamond enhanced with animated runner dots (SVG animate elements) showing movement along base paths for steal attempts — success moves to next base, failure freezes mid-path and fades
  - Steal applies engine's resolveSteal + applySteal, caught stealing adds out + can trigger half-inning
  - Screen shake on caught stealing

## Frigga Research Summary
Key patterns applied:
- SVG `<animate>` elements for runner movement along base paths (cx/cy interpolation from→to with fill="freeze")
- Contextual steal button with inline threshold display — player sees odds before committing
- StealReveal reuses spring-physics pattern from OutcomeReveal (spring stiffness 350, damping 22)
- Auto-advance after steal result (2000ms to idle, or half-inning if 3rd out)

## Scores
| Dimension | Pre-C15 (Odin) | Post-C15 (est.) |
|-----------|----------------|-----------------|
| Engine completeness | 8 | 8 |
| UI quality | 7 | 7.5 |
| Strategic depth | 5 | 7 |
| Visual polish | 7 | 7.5 |
| Fun factor | 7 | 7.5 |

Strategic depth jumps from 5→7 because steal decisions are now the first moment of real player agency beyond rolling dice.

## Key Decisions
1. **Inline steal buttons over modal prompt** — Odin spec suggested a modal overlay for steal decisions. Chose inline buttons next to the Roll button instead — less disruptive, faster decision flow, no timer needed. Player can choose steal OR roll in one glance.
2. **Steal threshold shown inline** — Button says "Steal 2nd ≤12" so the player immediately knows their odds. Informed risk decisions are more fun than blind gambles.
3. **Runner animation via SVG animate** — Used native SVG `<animate>` elements rather than Framer Motion for runner movement. SVG animate is more performant for in-SVG animations and doesn't require additional React renders.
4. **Steal only to unoccupied base** — Steal buttons only appear when the target base is empty (can't steal into an occupied base). Simplifies UX.

## Next Target
Cycle 16 — Full 3-inning playable game polish: game flow from lineup → play → game over → replay, XP rewards, game record saved to localStorage.

## Deploy URL
https://lorevault-site-r1s3f2y9s-ros-projects-9a9bb0c9.vercel.app
