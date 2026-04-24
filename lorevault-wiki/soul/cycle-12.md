# Soul Cycle 12 — Vision A — Odin-Soul Scoring

Phase: 2
Version: v8.82

## Odin-Soul Evaluation Results

**Total: 40/70** — Above the 35/70 "no face found" threshold, but weaknesses identified.

### Scores

| Dimension | Score | Key Evidence |
|---|---|---|
| Single-Verb Clarity | 5/10 | Intro says "Every card has a story" but never names the core verb "collect." "Choose your path" is navigation, not the core action. |
| First-Minute Emotion | 6/10 | Atmospheric (breathing icons, staggered fades) but slow — 5-6 taps before first emotional payoff (card reveal). First 30s is text animation + world selection. |
| Progressive Disclosure | 7/10 | STRONGEST. Only 2 visible actions on story map (read chapter / open packs). Locked chapters properly dimmed. Card silhouettes for next-chapter only. |
| Attention Hierarchy | 5/10 | Story map is 8 roughly-equal cards. "Next locked" chapter has 6 info elements competing. Progress bar is tiny (w-20 h-1.5). |
| Aha-Moment Velocity | 4/10 | WEAKEST. 7-step journey before user understands "collect cards → unlock chapters." Mechanic never explicitly communicated. Card-to-chapter connection relies on inference. |
| Feature-to-Emotion Ratio | 6/10 | 4-5 features serve curiosity, but pack summary introduces gambler dopamine that conflicts. Lore text feels disconnected from chapter narrative. |
| Mobile-First Coherence | 7/10 | Safe areas, env() padding, 44px touch targets. "SWIPE TO EXPLORE" promises gesture that doesn't exist (click-only arrows). |

### Recommended Fixes (Priority Order)

1. **Aha-Moment Velocity (4→7)**: After world selection, auto-open a "welcome pack" — 5 cards from the set. On pack summary, animate earned cards flying into a mini story map showing which chapter slots they fill. User understands the mechanic in 30 seconds.

2. **Attention Hierarchy (5→7)**: Make "next locked" chapter card 2-3x the visual size of others. Add pulsing accent border. Reduce unlocked chapters to minimal "checkmark + title" rows.

3. **Single-Verb Clarity (5→7)**: Replace intro copy: "Collect cards. Unlock the myth." CTA: "Start collecting." Name the verb.

4. **First-Minute Emotion (6→7)**: Skip story map on first visit. World selection → welcome pack → chapter unlock celebration → then story map. The emotional payoff must happen within 30s.

5. **Feature-to-Emotion Ratio (6→7)**: Remove "open another pack" from summary when a chapter was unlocked. Only CTA: "Read the chapter now." Every post-pack moment funnels to story.

6. **Mobile-First Coherence (7→8)**: Implement actual swipe gesture on world selection using framer-motion drag. Increase silhouette labels from 8px to 10px.

## Cycle 13 Actions
These fixes target the Vision A scoring weaknesses and will be addressed alongside Vision B development. However, per daemon protocol, the focus now shifts to Vision B (Cycles 13-18). Vision A fixes will be applied during Convergence (Cycles 25-30) using these scores as a roadmap.

## Frigga-Soul Research: Vision B Key Findings
(From background research agent)

1. **Binder grid**: 3 cards per row on mobile is the standard (PTCGP, Topps BUNT). Named numbered placeholders, not art silhouettes. PTCGP reveals card identity on tap.
2. **Near-miss**: PTCGP uses card-flip suspense, not silhouette-frost. But silhouette-with-frost IS the right design — show shape + rarity frame + blur art + reveal name. Named absence is the trigger.
3. **Set completion**: Goal Gradient Effect — motivation PEAKS at 90%. The "last 10% wall" is supply scarcity, not motivation loss. At 90%+, switch to "FINISHING" mode with full-screen focus on remaining gaps.
4. **Trading bridge**: Empty slot → tap → "3 players have this card" should be one screen. Wishlist auto-populated from binder gaps. Never make user re-enter needs.

## Next
Cycle 13: Vision B — Set selection + binder grid (core "named gap" experience).
