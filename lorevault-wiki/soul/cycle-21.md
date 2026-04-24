# Soul Cycle 21 — Score Vision C

Phase: 4
Version: v8.87

## Odin-Soul Scores Vision C

**Total: 46/70** — 6 points above Vision A (40), 7 above Vision B (39). Clear winner.

### Scores

| Dimension | Score | Key Evidence |
|---|---|---|
| Single-Verb Clarity | 7/10 | "You battle cards." Intro says "Play. Win. Collect." but "battle" is the only interactive verb. Docked from 8 because value-reveal introduces "earn money" as second verb. |
| First-Minute Emotion | 6/10 | Anticipation builds well through staggered intro, but takes 2s before Battle button. Pre-battle is functional not visceral — no sound, no shake, no haptic. Emotion present but thin. |
| Progressive Disclosure | 8/10 | STRONGEST. First load: one button. Then 3 card choices. Then 5 stats. Then result. Value reveal gated behind 3+ wins. Clean progressive layering. |
| Attention Hierarchy | 6/10 | Each screen has clear primary action, BUT stat picker is 5 equally-weighted buttons — a democracy, not a hierarchy. Round indicator + score + cards compete above it. |
| Aha-Moment Velocity | 7/10 | "I pick a stat, higher wins" arrives under 60 seconds. Top Trumps is universally understood. Financial aha delayed 3+ wins (deliberate). Scored for primary aha. |
| Feature-to-Emotion Ratio | 5/10 | WEAKEST. Core emotion is competitive thrill (pick → win → earn). But value-reveal introduces financial greed ($, market prices, social proof). Two emotions competing — neither fully amplified. |
| Mobile-First Coherence | 7/10 | Cards are 100px/thumb-tappable. Stat buttons full-width 48px+. Safe area insets respected. But 5 stat buttons may push below fold on iPhone SE. |

### Key Fix Recommendations
1. **Feature-to-Emotion (5→7)**: Move ALL monetary value display OUT of the battle flow into a separate "Collection" view. Dollar signs in a game loop are contaminant — kills competitive thrill without fully delivering financial excitement.
2. **Attention Hierarchy (6→7+)**: Reduce stat picker from 5 to 3 random stats per round. Fewer choices = more consequential decisions = better tempo.
3. **First-Minute Emotion (6→7)**: Cut intro to 1.2s total. Add screen shake + color flash on round result. Make AI card reveal bigger and slower — it's the climax of each round.
4. **Aha-Moment (7→8)**: Add 0.8s suspense gap between revealing AI's stat and announcing winner. Turns "I get it" into "I FEEL it."
5. **Progressive Disclosure (8→9)**: Gate stat bars behind first round — show names/numbers but not bars until player has experienced one round.
6. **Single-Verb (7→8)**: Remove all dollar signs from the battle loop entirely.
7. **Mobile (7→8)**: Shrink card face-off to 60px thumbnails in stat-picking mode. All 5 stat buttons (or 3) above fold on 375x667.

## Score Comparison

| Dimension | Vision A | Vision B | Vision C |
|---|---|---|---|
| Single-Verb Clarity | 5 | 6 | **7** |
| First-Minute Emotion | 6 | 5 | **6** |
| Progressive Disclosure | 7 | 5 | **8** |
| Attention Hierarchy | 5 | 6 | **6** |
| Aha-Moment Velocity | 4 | 4 | **7** |
| Feature-to-Emotion Ratio | 6 | **7** | 5 |
| Mobile-First Coherence | 7 | 6 | **7** |
| **Total** | **40** | **39** | **46** |

## Key Insight
Vision C's structural advantage: Top Trumps is universally understood (high Aha-Moment) and the progressive disclosure is genuinely well-gated (best across all visions). The critical flaw is trying to be both a battle game AND a financial instrument. The "found money" reveal is a clever growth hack but grafting it onto the battle loop dilutes both emotions.

**Highest-leverage single fix**: Separate competitive thrill from financial discovery. Battle loop = pure game. Collection view = where value lives.

## Next
Cycles 22-24: Fix Feature-to-Emotion (weakest at 5). Remove $ from battle flow, add Collection view, reduce stat picker to 3.
