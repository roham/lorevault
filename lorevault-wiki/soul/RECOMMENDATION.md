# LoreVault Soul Recommendation

## The One Sentence

**LoreVault is the app where you battle cards to build your collection.**

---

## The Winner: C+B Hybrid — 51/70

After 30 cycles, three radically different visions, and honest scoring against 7 soul dimensions, the C+B hybrid emerged as the clear winner. Not because it scored highest on any single dimension, but because it scored 7+ on every dimension — no fatal weakness, no dimension below the "do not ship" threshold.

| Dimension | Score |
|---|:---:|
| Single-Verb Clarity | 7 |
| First-Minute Emotion | 7 |
| Progressive Disclosure | 8 |
| Attention Hierarchy | 7 |
| Aha-Moment Velocity | 8 |
| Feature-to-Emotion Ratio | 7 |
| Mobile-First Coherence | 7 |
| **Total** | **51** |

### Why It Won

**One verb**: Battle. The user picks a card, picks a stat, higher number wins. Top Trumps is universally understood — Aha under 60 seconds.

**One scoreboard**: The binder. Cards earned from battle fill set-completion grids. The binder is visible AFTER the battle, never during. It's a passive scoreboard that adds meaning to winning without creating a second game.

**One emotion**: Competitive acquisition. "I won that card. It fills a gap in my set. I want the one I'm missing." Every feature amplifies this. Nothing contradicts it.

### The Architecture

```
Battle (primary loop, under 90s)
  → Win = earn opponent's best card
  → Card lands with triple signal:
    1. Rarity badge (scarcity)
    2. Set icon + progress bar (completion)
    3. "New card!" badge if first-time (gap-fill)
  → 1.5 seconds, three Aha signals

Binder (passive scoreboard, post-battle only)
  → Cards grouped by set
  → Progress bars per set
  → Visible gaps = desire for next battle
  → Never interrupts game loop
```

### What Gets Permanently Deleted

These features existed in the 50+ feature product and serve no vision:

- Card DNA / mutation overlays
- Ghost cards / spectral reveals
- Prestige system
- Forge / crafting
- Chronicle / timeline
- Hall of Fame
- Tournament brackets
- Seasonal vaults
- FOMO banners / morning toasts
- Smart collections / comparison tools
- Baseball / trivia games
- Analytics page
- Social challenges / leaderboards (Season 1)
- Dollar values in game loop
- 16-section home page

**These are not deferred. They are dead.**

### What Ships in Season 1

1. **Battle loop**: Card selection (3 from deck) → stat picking (3 random per round) → best-of-3 → reward card with triple signal
2. **Binder**: Set-completion grids with visible gaps, progress bars, "New!" badges
3. **Pack opening**: As secondary card acquisition (purchased or earned via daily play)
4. **Deck builder**: Drag cards into 5 slots, power rating shown
5. **Stripped home**: One screen. "Battle" button. Win counter. That's it.

Five features. One emotion. One verb.

### What Ships in Season 2

**Story chapters** (from Vision A) — gated by binder completion thresholds. The collector behavior trained in Season 1 now *unlocks* narrative access. Story is a reward for collection depth, not a parallel product.

The critical framing: story arrives as depth, not correction. "The game you played in Season 1 is the same game — now there's more to discover."

**Marketplace** (from Vision B) — surfaces only cards you're missing. "Complete your set" is the CTA, not "browse 200 cards." Commerce is a gap-filler, not a browsing destination.

---

## Why Not the Others

### Vision A: "Discover the Story" — 40/70
- **Aha-Moment at 4/10 is structural**, not fixable with polish. The "cards are story keys" mechanic requires too much inference. Users don't understand the connection until step 7.
- **Production cost is prohibitive** for Season 1. Written narrative, per-chapter art, localization — content bottleneck before product-market fit is proven.
- **Best role**: Season 2 retention layer. Story chapters gated by binder completion. Proven players earn narrative depth.

### Vision B: "Chase the Set" — 39/70
- **Aha-Moment at 4/10 is the same structural weakness.** The binder updates silently — no "sticker into album" moment. The most important collecting beat doesn't exist.
- **Differentiation risk is high.** The Panini/Pokemon binder pattern is 50+ years old. Every digital collectible app does this. Execution must be exceptional to stand out, and Vision B's execution wasn't.
- **Best role**: Passive scoreboard on top of a different primary loop. Which is exactly what the C+B hybrid does.

### Vision C alone: 46/70
- **Feature-to-Emotion at 5/10 was the gap.** Battle thrill and financial greed competed. Dollar values in the game loop diluted both emotions.
- Fixed by (a) removing all $ from battle flow, and (b) adding set-completion as the secondary emotion. This became the hybrid.

---

## Evidence Base

### Frigga Research: Key Findings Across 30 Cycles

1. **Pokemon TCG Pocket launched hybrid** (game + collection) but collection carried Season 1 while battle matured underneath. Our inverse: battle carries Season 1, collection (binder) is the passive scoreboard.

2. **Identity split doesn't happen when the identity on offer is "winner."** Hearthstone players who opened packs and built decks absorbed both behaviors into "competitive deck-builder." The fracture happens only when game and collection surfaces use different success signals. The C+B hybrid has a one-way valve: battle → cards → binder fills. The binder never asks you to stop battling.

3. **Three products where game IS acquisition**: Slay the Spire (winning combat = adding cards to deck), Fortnite Ch1 (eliminations = materials = building = winning), MTG Arena launch (drafting = winning = earning packs = building collection). In all three, players self-identify as players, not collectors. Collecting is invisible infrastructure.

4. **Delay complexity, front-load the emotional hook.** Every successful vision in our testing followed this pattern. The current LoreVault does the opposite — everything visible on day one, nothing emotionally front-loaded.

5. **The "found money" moment requires 7-14 days of pure gameplay** before marketplace exposure. You can't shortcut the emotional runway. This is why $ was removed from the battle loop — premature value framing kills the game-first identity.

### Score Trajectory (the learning curve)

| Vision | Cycle | Score | Key Lesson |
|---|---|---|---|
| A: Story | 12 | 40 | Aha-Moment can't be inferred — it must be shown |
| B: Chase | 17 | 39 | Silent binder updates kill the collecting emotion |
| C: Play | 21 | 46 | Two competing emotions are worse than one strong one |
| C+B Hybrid | 27 | 51 | Passive scoreboard adds meaning without adding verbs |

---

## The Remaining Gap: 51 → 60+

The hybrid scored 7 on every dimension. To reach 8+ on any dimension, these specific fixes were identified (Cycle 27-28):

| Fix | Target Dimension | Expected Impact |
|---|---|---|
| Deck shuffle animation on intro-to-prebattle transition | First-Minute Emotion → 8 | Visceral game-start moment |
| Visible "tap to continue" button on round results | Aha-Moment → 9 | Remove hidden interaction pattern |
| 44px minimum touch targets enforced on all elements | Mobile → 8 | Accessibility compliance |
| Scroll indicator on collection view | Mobile → 8 | Content below fold is discoverable |
| One-time tooltip on first set-progress reveal | Aha-Moment → 9 | Explicit "your cards fill sets" connection |

These are polish, not architecture. The soul is found. The remaining work is sanding.

---

## Ship Plan

### Season 1: "Battle to Build Your Collection"
- Ship the C+B hybrid prototype as the product
- Home = one button: Battle
- Five features: battle, binder, packs, deck builder, stripped home
- Delete everything else
- Target: 60+ soul score through polish cycles

### Season 1.5: Bridge Event
- One story chapter released as a battle event (narrative context, verb is still battle)
- Players experience lore without leaving gamer identity
- Tests whether story increases retention without redefining the product

### Season 2: "Discover the Story"
- Story chapters gated by binder completion thresholds
- Collector behavior trained in Season 1 now unlocks narrative
- Marketplace as gap-filler: surfaces only missing cards
- Story is depth, not correction

---

## The Face

LoreVault started with 50+ features and no face. After 30 cycles of building, scoring, subtracting, and honest evaluation:

**The face is a battle.**

Not a dashboard. Not a marketplace. Not a story. Not a binder. A battle.

You open the app. You tap "Battle." You pick a card. You pick a stat. You win or you lose. If you win, a card lands in your collection with a satisfying triple signal — rarity, set progress, gap-fill. You glance at your binder. One more slot filled. One more gap calling. You tap "Battle again."

That's the product. Everything else is earned.
