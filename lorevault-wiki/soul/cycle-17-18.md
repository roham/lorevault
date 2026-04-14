# Soul Cycles 17-18 — Score Vision B + Vision C Initial Build

Phase: 3-4
Version: v8.86

## Cycle 17: Odin-Soul Scores Vision B

**Total: 39/70** — Just below Vision A's 40/70. Essentially tied.

### Scores

| Dimension | Score | Key Evidence |
|---|---|---|
| Single-Verb Clarity | 6/10 | "Complete" is the verb but never stated as such. Binder gaps do more work than any copy. CTA says "Open Pack" not "Chase the missing card." |
| First-Minute Emotion | 5/10 | 2s dead time in intro, no pack available for new users = disabled CTA = no path to emotion. Set selection shows 6 "0/X" sets with no differentiation. |
| Progressive Disclosure | 5/10 | All 6 sets shown with equal weight, no "start here." Binder dumps 20 slots at once. Finishing mode is well-gated (90%+). |
| Attention Hierarchy | 6/10 | Each phase has clear dominant element. Finishing mode competes with main grid. Rarity bloom is transient. |
| Aha-Moment Velocity | 4/10 | WEAKEST. The "sticker going into the album" moment doesn't exist. Binder just silently updates. New user may have 0 packs = no aha path. |
| Feature-to-Emotion Ratio | 7/10 | STRONGEST. Nearly every feature serves completion hunger. Cross-set cards labeled, progress animates, finishing mode is pure focus. Only duplicate handling breaks the emotion. |
| Mobile-First Coherence | 6/10 | Safe areas, 4-col grid fits 375px, fixed CTA. But set grid requires scroll with no affordance. Lore text in overlay has no line clamp. |

### Key Fix Recommendations
1. **Aha-Moment (4→6+)**: After pack summary, animate binder return — scroll to new card's position, pulse slot from empty→owned over 1s, particle burst, progress bar increment.
2. **First-Minute (5→6)**: Auto-grant 1 pack on first set selection. Guarantee aha within 60 seconds.
3. **Single-Verb (6→7)**: CTA should say "Open pack to chase X missing" not generic "Open Pack."
4. **Duplicates**: Show "Trade fodder — 3 dupes = 1 targeted pull" even as a grayed future-feature hint.

## Cycle 18: Vision C Initial Build + Frigga Research

### Vision C Prototype: "Play to Collect"
Built full quick-battle system at `/prototype/play`:
- **Intro**: "Your cards. Your stats. Your battle." → "Play. Win. Collect."
- **Pre-battle**: See your 3 best cards, AI has 3 face-down cards. Pick one to play.
- **Battle**: Cards face off. Player picks one of 5 stats (Power, Intelligence, Mystery, Legend, Charm). Higher stat wins round.
- **Round result**: Both cards revealed with stat comparison, score updated. Best of 3 rounds.
- **Battle result**: Victory = earn AI's best card. Defeat = retry. Shows reward card with scarcity.
- **Value reveal ("found money" moment)**: After 3+ wins, shows "Your wins are worth something" with total $ value. Each earned card listed with market price. "Keep playing, keep earning" CTA.

### Frigga-Soul Research: Vision C Key Findings
1. **Quick-play pattern**: 90-second target. Marvel Snap uses simultaneous turns. Small decks (20 vs 60). Our Top Trumps stat-comparison approach is correctly quick.
2. **Card rewards**: Hybrid architecture — deterministic progress (play 3 matches → guaranteed pack) with random ceiling inside. Never pure RNG.
3. **Auto-battle satisfaction**: Satisfaction comes from PRE-BATTLE agency, not watching. "Did my strategy work?" > "will my number win?" SPD/LCK stats create non-determinism.
4. **"Found money" moment**: Requires 3 co-occurring signals: visual distinction (animation), tradability cue (price), social proof (ownership count). All three at moment of reveal.

### Design Decisions
- **Top Trumps mechanic**: Simple enough for instant understanding, deep enough for stat-picking strategy. Each character has trade-offs (Sherlock: 99 Intelligence but 45 Power). Choosing the right stat IS the game.
- **3-round best-of**: Quick resolution. 3 rounds × (pick card + pick stat + result) = ~30-45 seconds per match.
- **Value reveal gate**: Hidden until 3+ wins. The "wait... your wins are worth something" delay creates the "found money" surprise. If shown immediately, it would feel like a sales pitch.
- **Staggered reveal**: "Wait..." at 0.3s, headline at 0.8s, total value at 1.3s, card list at 1.6s. The pacing builds from curiosity to revelation.

## Score Comparison

| Dimension | Vision A | Vision B | Vision C (pre-score) |
|---|---|---|---|
| Single-Verb Clarity | 5 | 6 | ? |
| First-Minute Emotion | 6 | 5 | ? |
| Progressive Disclosure | 7 | 5 | ? |
| Attention Hierarchy | 5 | 6 | ? |
| Aha-Moment Velocity | 4 | 4 | ? |
| Feature-to-Emotion Ratio | 6 | 7 | ? |
| Mobile-First Coherence | 7 | 6 | ? |
| **Total** | **40** | **39** | **?** |

## Next
Cycle 19-20: Vision C refinement (battle pacing, reward flow, value reveal polish).
Cycle 21: Score Vision C.
Cycles 22-24: Vision C polish.
Cycles 25-30: Convergence.
