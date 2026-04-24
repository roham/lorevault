# Soul Cycle 14 — Vision B — Binder Refinement

Phase: 3
Version: v8.84

## What Changed
### Modified
- `src/app/prototype/chase/page.tsx` — Binder refinement:
  - **Finishing mode**: At 90%+ completion, a prominent "ALMOST THERE" card appears above the grid showing only the 1-3 remaining gaps as larger silhouettes with amber pulsing borders and character names
  - **Card inspection overlay**: Tap any owned card to see a large-format view with gradient art, character name, moment, scarcity/parallel label, and lore text quote. Modal overlay with blur background, tap-to-dismiss
  - **10px minimum labels**: Character name labels increased from 8px to 10px per Odin-Soul accessibility feedback
  - **Button wrapping**: Binder grid slots wrapped in `<button>` elements for proper tap handling (owned cards open inspection, empty slots are inert)

### Design Decisions
- **Finishing mode at 90%**: The Goal Gradient Effect (Frigga research) says motivation peaks when the end is visible. At 18/20 cards, the binder switches to a focused "ALMOST THERE" view showing only the 1-3 missing cards as larger, emphasized silhouettes with amber accent. This creates urgency without the user needing to scan the full grid.
- **Amber accent for finishing mode**: Amber/gold (not the set's color) signals "rare opportunity" and creates visual distinction from the regular binder. The pulsing border is subtle — 0.3→0.8→0.3 opacity over 2s.
- **Card inspection = reward browsing**: Tapping an owned card is a completionist reward — you admire what you have. The modal shows full card details including lore text, which is hidden in the binder grid. This creates a secondary loop: collect → browse → appreciate → want more.
- **Button semantics**: Empty slots are inert (no onClick handler) but could later be wired to "find this card" marketplace actions.

## Frigga Insight Applied
From Vision B research:
- **Goal Gradient Effect at 90%+**: "Motivation PEAKS. Switch to FINISHING mode with full-screen focus on remaining gaps." Implemented as the "ALMOST THERE" card.
- **Named absence is the near-miss trigger**: "You know what you almost have." The finishing mode shows character names alongside the silhouettes — named, not anonymous.
- **10px minimum for legibility**: Odin-Soul flagged 8px labels as below WCAG minimum. Fixed to 10px.

## The One Question
Does the finishing mode serve the ONE emotion (desire for completion)? **Yes.** At 18/20, seeing two named gaps in amber focus is more motivating than scanning a full grid of 20 slots. The finishing mode IS the emotional peak of the collection loop — the moment where "I'm so close" converts to "I need one more pack."

## What's Missing
- Empty slot tap → "find this card" marketplace bridge
- Rarity pre-signal in pack opening (glow before flip)
- Set completion celebration (confetti/animation when 20/20)
- Cross-set progress summary

## Next
Cycle 15: Vision B mobile polish — safe areas, touch targets, scroll behavior.
