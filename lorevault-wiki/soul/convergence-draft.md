# Soul Convergence Report — Draft

## The Question
LoreVault started with 50+ features and zero opinions. After 30 cycles, which product face emerges?

## Three Visions Tested

### Vision A: "Discover the Story" (Story-First)
- **One verb**: Discover
- **Core emotion**: Curiosity → anticipation → narrative reward
- **Score**: 40/70 (Cycle 12)
- **Strengths**: Progressive disclosure (7), Mobile-first (7)
- **Fatal weakness**: Aha-Moment (4) — user needs 7 steps to understand the mechanic
- **Production cost**: HIGH — requires written content, art per chapter, localization

### Vision B: "Chase the Set" (Set-Collector)
- **One verb**: Complete
- **Core emotion**: Completion hunger → satisfaction
- **Score**: 39/70 (Cycle 17)
- **Strengths**: Feature-to-emotion ratio (7) — almost every element serves completion
- **Fatal weakness**: Aha-Moment (4) — binder updates silently, no "sticker into album" moment
- **Production cost**: LOW — binder UI is data-driven, no content production

### Vision C: "Play to Collect" (Game-First)
- **One verb**: Battle
- **Core emotion**: Competitive thrill → surprise discovery
- **Score**: 46/70 (Cycle 21, pre-iteration)
- **Strengths**: Progressive disclosure (8), Aha-Moment (7), Single-Verb (7)
- **Fatal weakness**: Feature-to-emotion (5) — mixed battle thrill with financial greed
- **Production cost**: LOW — battle mechanics are data-driven

## The Hybrid: C→B (Battle fills Sets)

**Architecture**: Battle to earn cards → cards fill binder sets → completing sets unlocks status.
**One verb**: Battle (binder is passive scoreboard, not second game)
**Score**: 51/70 (Cycle 27)

### What the Hybrid Preserves
- From C: Quick-battle loop (under 90s), stat-picking strategy, competitive thrill
- From B: Set-completion scoreboard, visible progress, named gaps
- The "sticker into album" moment that was missing from both B and C individually

### What the Hybrid Cuts
- All dollar values and marketplace framing (moved to future commerce layer)
- Story-chapter system (deferred to Season 2 — highest production overhead)
- Full 5-stat display (reduced to 3 random per round for tempo)

## Frigga Research: Key Findings

1. **Second verbs succeed when instrumental**: Battle produces collection rewards (Clash Royale pattern)
2. **Pokemon TCG Pocket pattern**: Launched one verb, proved retention, surfaced second mechanic to retained users
3. **Dimension weights aren't equal**: Progressive Disclosure and Aha-Moment predict D30 retention most strongly
4. **Vision C acquires, Vision A retains, Vision B monetizes** — the hybrid needs all three business moments

## Score Trajectory

| Vision | Cycle | Score | Delta |
|---|---|---|---|
| A: Story | 12 | 40/70 | — |
| B: Chase | 17 | 39/70 | — |
| C: Play | 21 | 46/70 | +6 vs A |
| C+B: Hybrid | 27 | 51/70 | +11 vs A, +5 vs C |

## Recommendation

**Ship the C+B Hybrid.** Score crossed the 50 threshold. No dimension below 7. See `RECOMMENDATION.md` for full ship plan.

**LoreVault is the app where you battle cards to build your collection.**

## What Comes Next

1. **Season 1**: Ship C+B hybrid. Battle + binder + packs + deck builder. Delete everything else.
2. **Polish**: Target 60+ soul score through remaining fixes (deck shuffle animation, visible tap-to-continue, 44px touch targets, scroll indicators).
3. **Season 1.5**: Bridge event — one story chapter as a battle event. Tests retention lift.
4. **Season 2**: Story chapters gated by binder completion. Marketplace as gap-filler.
