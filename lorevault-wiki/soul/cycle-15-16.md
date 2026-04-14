# Soul Cycles 15-16 — Vision B — Mobile Polish + Pack Flow Refinement

Phase: 3
Version: v8.85

## What Changed
### Cycle 15: Mobile Polish
Vision B was built with mobile-first patterns from the start (safe-area padding on binder/summary/fixed CTA, 44px+ touch targets, 375px-optimized 4-column grid). Verified:
- Set selection: 2x3 grid at 375px = each card ~167px wide, comfortable
- Binder: 4 columns at 375px = ~82px per card slot, legible symbols and names
- Card inspection overlay: max-w-[240px] card with proper padding
- All CTA buttons: py-3+ (44px+ touch targets)
- Safe area: env(safe-area-inset-bottom) on binder, summary, and fixed CTA bar

### Cycle 16: Pack Flow Refinement — Rarity Pre-Signal
- **Rarity-colored glow bloom**: Before each card flips in during reveal, a colored radial gradient bloom (matching scarcity color) fades in and out behind the card area over 0.6s. The bloom peaks at 0.3s (30% opacity) then fades. The card itself begins its flip animation 0.15s after the bloom starts — so the user sees the color BEFORE the card. This is the "pre-signal rarity before reveal" pattern from Frigga's pack opening research.
- Epic/legendary cards get a more visible bloom (30% opacity × scarcity color) vs common cards (30% opacity × grey = barely visible). The visual difference IS the anticipation cue.

### Design Decisions
- **0.15s delay on card reveal**: The card's spring animation now starts 0.15s after the bloom begins. This creates a window where the user SEES the glow color but NOT the card — the pure anticipation moment.
- **Blur(30px) on bloom**: Heavy blur creates a soft, ambient glow rather than a hard circle. Feels like light rather than UI.
- **No explicit rarity text pre-signal**: The color alone communicates rarity to trained users. First-time users won't know the color system, but will learn it within 2-3 packs.

## Frigga Insight Applied
From pack opening ritual research:
- **"Pre-signal rarity before reveal: The ANTICIPATION window is the peak emotion, not the reveal."** Genshin's gold/purple color bloom happens 0.8s before the character is visible. Our bloom happens 0.15s before card — tighter because our total animation is shorter, but the principle holds: color before content.

## The One Question
Does the rarity pre-signal serve the ONE emotion (desire for completion)? **Yes, indirectly.** The pre-signal converts "random card flip" into "anticipation event." When the glow is the color of a rare card, the user feels a rush. When the rare card turns out to be for their set (NEW FOR YOUR SET badge), the dopamine compounds. Anticipation + completion = the emotional core of set-chasing.

## Next
Cycle 17: Score Vision B (dispatch Odin-Soul).
