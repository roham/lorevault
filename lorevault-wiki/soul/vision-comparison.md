# Vision Comparison — Side-by-Side Scoring

## Final Scores

| Dimension | A: Story (Cy12) | B: Chase (Cy17) | C: Play (Cy21) | C+B Hybrid (Cy27) |
|---|:---:|:---:|:---:|:---:|
| Single-Verb Clarity | 5 | 6 | 7 | **7** |
| First-Minute Emotion | 6 | 5 | 6 | **7** |
| Progressive Disclosure | 7 | 5 | 8 | **8** |
| Attention Hierarchy | 5 | 6 | 6 | **7** |
| Aha-Moment Velocity | 4 | 4 | 7 | **8** |
| Feature-to-Emotion Ratio | 6 | 7 | 5 | **7** |
| Mobile-First Coherence | 7 | 6 | 7 | **7** |
| **Total** | **40** | **39** | **46** | **51** |

---

## Vision A: "Discover the Story" — 40/70

**One verb**: Discover
**Core emotion**: Curiosity → anticipation → narrative reward
**Route**: `/prototype/story`

### Strengths
- **Progressive Disclosure (7)**: Only 2 visible actions on story map. Locked chapters properly dimmed. Card silhouettes tease without overwhelming.
- **Mobile-First (7)**: Safe areas, env() padding, 44px touch targets. Solid mobile foundation.
- **Unique positioning**: No major digital collectible app uses story progression as the core collecting mechanic. Defensible.

### Fatal Weaknesses
- **Aha-Moment (4)**: User needs 7 steps before understanding "collect cards → unlock chapters." The mechanic is never explicitly communicated — relies on inference.
- **Attention Hierarchy (5)**: Story map shows 8 roughly-equal cards. "Next locked" chapter has 6 competing info elements.

### Production Cost: HIGH
Requires written narrative content, per-chapter art, localization. Content production is the bottleneck, not engineering.

### Verdict
The most unique vision but the hardest to execute. Story as collecting driver is unproven at scale. The 7-step Aha gap is structural — fixing it requires fundamentally different onboarding, not polish. Best suited as a Season 2 retention layer on top of a simpler acquisition loop.

---

## Vision B: "Chase the Set" — 39/70

**One verb**: Complete
**Core emotion**: Completion hunger → satisfaction
**Route**: `/prototype/chase`

### Strengths
- **Feature-to-Emotion (7)**: Nearly every element serves completion hunger. Cross-set labels, progress animations, finishing mode — tight emotional cohesion.
- **Attention Hierarchy (6)**: Each phase has a clear dominant element.

### Fatal Weaknesses
- **Aha-Moment (4)**: The "sticker going into the album" moment doesn't exist. Binder updates silently. No visceral feedback on the collecting action.
- **First-Minute Emotion (5)**: 2s dead time in intro. New users may have 0 packs — disabled CTA with no path to emotion.
- **Progressive Disclosure (5)**: All 6 sets shown with equal weight, no "start here." Binder dumps 20 slots at once.

### Production Cost: LOW
Binder UI is data-driven. No content production pipeline.

### Verdict
The most proven pattern (Panini/Pokemon binders are 50+ years old) but the hardest to differentiate. Execution quality IS the moat, and Vision B's execution fell short on the moment that matters most — the sticker-into-album feel. The binder mechanic works brilliantly as a passive scoreboard, poorly as the primary game.

---

## Vision C: "Play to Collect" — 46/70

**One verb**: Battle
**Core emotion**: Competitive thrill → surprise discovery
**Route**: `/prototype/play`

### Strengths
- **Progressive Disclosure (8)**: STRONGEST across all visions. First load: one button. Then 3 card choices. Then 3 stats. Then result. Clean progressive layering.
- **Aha-Moment (7)**: "I pick a stat, higher wins" arrives under 60 seconds. Top Trumps is universally understood.
- **Single-Verb (7)**: "You battle cards." One interactive verb.

### Weaknesses (pre-iteration)
- **Feature-to-Emotion (5)**: Battle thrill and financial greed competed. Dollar values in the game loop diluted both emotions. (Fixed in Cycles 22-24 by removing all $ from battle flow.)

### Production Cost: LOW
Battle mechanics are data-driven. Card stats already exist.

### Verdict
Highest ceiling, strongest structural foundation. The Top Trumps mechanic provides instant understanding (high Aha) and clean progressive disclosure. The critical insight from Cycles 22-24: the game loop must be emotionally pure. Financial discovery belongs in a separate surface, not embedded in gameplay.

---

## C+B Hybrid: "Battle to Build Your Collection" — 51/70

**Architecture**: Battle earns cards → cards fill binder sets → completing sets unlocks status.
**One verb**: Battle (binder is passive scoreboard, not second game)
**Route**: `/prototype/play` (with set-completion layer)

### What It Preserves
- **From C**: Quick-battle loop (under 90s), stat-picking strategy, competitive thrill, progressive disclosure
- **From B**: Set-completion scoreboard, visible progress, named gaps, completion hunger as secondary motivation

### What It Cuts
- All dollar values and marketplace framing (deferred to commerce layer)
- Story-chapter system (deferred to Season 2)
- Full 5-stat display (reduced to 3 random per round for tempo)

### Why It Works
The key insight: **set-completion is a passive scoreboard, not a second verb.** The binder fills regardless of how cards are acquired. Filling a slot triggers the same emotional register as winning a battle — acquisition pride. This is the Pokemon TCG Pocket pattern: pack opening AND wonder pick both feed the same dex.

The constraint that makes it work: **the binder is visible AFTER the battle, never DURING.** The game loop stays pure. Set progress on the battle-result screen is a micro-signal (2-3 seconds of visibility), not a navigation destination.

### Score Trajectory

| Dimension | C only (Cy21) | C+B Hybrid (Cy27) | Delta |
|---|:---:|:---:|:---:|
| Single-Verb Clarity | 7 | 7 | — |
| First-Minute Emotion | 6 | 7 | +1 |
| Progressive Disclosure | 8 | 8 | — |
| Attention Hierarchy | 6 | 7 | +1 |
| Aha-Moment Velocity | 7 | 8 | +1 |
| Feature-to-Emotion Ratio | 5 | 7 | +2 |
| Mobile-First Coherence | 7 | 7 | — |
| **Total** | **46** | **51** | **+5** |

The +5 gain came from two sources:
1. **Removing $ from battle flow** (+2 Feature-to-Emotion): Purified the core emotion from "competitive thrill + financial greed" to "competitive thrill + completion pride"
2. **Triple reward signal** (+1 Aha-Moment): Card rarity + set membership + gap-fill status all communicated in 1.5 seconds on the battle-result screen

---

## Cross-Vision Insights

### The Universal Pattern
All three visions confirmed the same anti-pattern in the current product: **LoreVault shows everything on day one and nothing is emotionally front-loaded.** The current home page has 16 sections. Every prototype that scored above 40 got there by hiding 80%+ of features.

### Dimension Weights
Not all dimensions contribute equally to retention:
- **Progressive Disclosure** and **Aha-Moment Velocity** predict D30 retention most strongly (Frigga research, Cycle 6)
- Vision C leads on both. The hybrid preserves both advantages.

### The Acquisition → Retention → Monetization Stack
- **Vision C acquires**: Game-first funnel captures users who'd never download a "collectible" app
- **Vision A retains**: Story chapters give long-term reason to return (Season 2)
- **Vision B monetizes**: Set-completion creates targeted desire for specific cards (marketplace)

The hybrid stacks C (acquire) + B (monetize), with A deferred to Season 2 for retention depth.
