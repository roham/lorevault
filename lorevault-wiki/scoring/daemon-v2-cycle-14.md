# Daemon v2 — Cycle 14
Phase: 2
Date: 2026-04-14
Version: v8.57

## What Was Built
- `src/components/baseball/DiceRoller.tsx` — Slot-machine style d20 animation with exponential slowdown (14 ticks, 55ms base + 12ms/tick deceleration), 3D rotation wobble via Framer Motion, value-based color coding on landing (gold for 16+, green for 11+, red for ≤5), landing flash radial gradient
- `src/components/baseball/OutcomeReveal.tsx` — Spring-physics outcome card with per-outcome configuration (9 outcome types), escalating spring stiffness by intensity (subtle→medium→big→epic), glyph badges (HR/K/1B/2B/3B/BB/GO/FO/DP), staggered entry animations for glyph, label, description
- `src/components/baseball/ParticleBurst.tsx` — 20-particle gold explosion for home runs, Framer Motion spring trajectories with randomized angles and distances, auto-cleanup via opacity/scale fade
- `src/components/baseball/ScreenShake.tsx` — CSS keyframe shake at 3 intensities using translate3d for GPU compositing, will-change management (set before, clear after), single-injection style element
- `src/app/games/baseball/play/page.tsx` — Complete rewrite of animation state machine: 7 phases (idle → control-rolling → control-landed → outcome-rolling → outcome-landed → half-inning → game-over), two-phase dice reveal sequence, inline at-bat resolution (moved from playAtBat() for animation control), roll button gold pulse, player card highlighting

## Frigga Research Summary
Key patterns applied:
- Exponential interval slowdown for dice tumble (60 + i*8ms per tick) — gives natural deceleration
- translate3d for all shake animations to force GPU compositing
- will-change: transform set before animation, cleared after via animationend listener
- Spring physics on particle burst (stiffness 100-160, damping 12) for organic deceleration
- AnimatePresence mode="wait" for clean phase transitions

## Scores (Odin assessment of pre-Cycle 14 state + my estimate post-build)
| Dimension | Pre-C14 | Post-C14 (est.) |
|-----------|---------|-----------------|
| Engine completeness | 8 | 8 |
| UI quality | 5 | 7 |
| Strategic depth | 7 | 7 |
| Visual polish | 5 | 7 |
| Fun factor | 4 | 6 |

## Key Decisions
1. **Inline at-bat resolution** — Moved game resolution logic from `playAtBat()` into the play page to enable animation phases between control roll and outcome roll. The engine's pure functions are still used; only the orchestration changed.
2. **Single dice display** — Odin spec suggested two dice side-by-side; chose single die for two sequential rolls instead. More dramatic to have one die spin → land → control reveal → second spin → land → outcome. Two dice dilutes focus.
3. **Pending resolution ref** — Used `useRef` to stash resolution data between the control roll landing callback and outcome roll landing callback. Avoids closure staleness in the setTimeout chain.
4. **Separated components** — Created `src/components/baseball/` directory for reusable game animation components rather than inlining everything in the play page.

## Next Target
Cycle 15 — Steal mechanic UI + defensive plays. Add "Attempt Steal" button when runners on base, visual steal animation, double play visual sequence, tag-up on fly outs.

## Deploy URL
https://lorevault-site-9bozr46ub-ros-projects-9a9bb0c9.vercel.app
