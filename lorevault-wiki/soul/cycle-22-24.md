# Soul Cycles 22-24 — Vision C Iteration

Phase: 4
Version: v8.88

## Cycle 22: Fix Feature-to-Emotion (5→target 7)

**The surgery**: Removed ALL dollar values, market prices, and social proof counts from the battle flow. The "found money" value-reveal phase replaced with a pure "Battle Trophies" collection view.

### What Changed
- Removed `showValues` state and all commerce gating logic
- Battle-result reward card: removed `$X.XX on the market` and `N players own this card`
- Replaced with "Added to your collection" — pure competitive pride
- `value-reveal` phase → `collection` phase: 3-column trophy grid showing earned cards by scarcity
- "See your collection value" → "View your trophies (N)" — appears after 2+ earned cards
- "Keep playing, keep earning" → "Keep battling"

### Design Decision
Odin-Soul identified the core tension: the battle loop was trying to deliver competitive thrill AND financial greed simultaneously. The "found money" reveal was a clever growth hack, but grafting it onto the game loop diluted both emotions. Neither got full amplification.

**Resolution**: The battle loop is now a pure game. The financial discovery layer (commerce, marketplace, value) will live in a separate surface — not embedded in the game loop. This is the Pokemon TCG Pocket pattern: the immersive card experience comes first; the marketplace exists elsewhere.

## Cycle 23: Fix Attention Hierarchy (6→target 7+)

**The surgery**: Reduced stat picker from 5 equally-weighted buttons to 3 random stats per round. Shrank card face-off to 60px thumbnails during stat selection.

### What Changed
- Added `availableStats: StatKey[]` to BattleState — 3 random stats per round via `pickRandomStats(3)`
- New stats dealt each round (pickRandomStats called in both startBattle and nextRound)
- Card face-off shrunk from 100px to 60px thumbnails during stat picking — keeps all 3 stat buttons above the fold on 375x667
- Player's best available stat gets subtle visual emphasis (brighter background, colored border)
- Stat buttons spaced larger (py-3.5, space-y-2.5) — each choice feels more consequential
- Stat bars thicker (h-1 → h-1.5), text larger (10px → 11px labels, xs → sm values)

### Design Decision
Odin: "5 equally-weighted stat buttons is a democracy of choices, not a hierarchy." Reducing to 3 creates natural tension — your best stat may not be available this round. This adds strategic depth (do I play this card hoping Intelligence appears?) while reducing cognitive load per decision.

The "best stat" highlight creates a default without removing choice — the recommended path without forced compliance. This is the Duolingo "suggest" pattern.

## Cycle 24: Fix First-Minute Emotion (6→target 7)

**The surgery**: Faster intro, dramatic round results with suspense beat.

### What Changed
- **Intro timing cut in half**: Subtitle at 0.2s (was 0.5s), title at 0.5s (was 1.0s), Battle button at 1.0s (was 2.0s), win counter at 1.2s (was 2.2s). User can start battling in ~1 second vs ~2 seconds.
- **AI card reveal**: Slower and springier (0.6s spring with stiffness:120 vs 0.4s linear). The card flip is the round's emotional climax — it deserves a bigger moment.
- **AI stat suspense beat**: AI's stat number appears 0.5s after the card flip (was instant). Creates a "what did they get?" moment before the comparison.
- **Winner announcement delayed**: Result text appears at 0.8s (was 0.3s). The full sequence: card flips (0s) → AI stat reveals (0.5s) → winner declared (0.8s) → background flash (0.8s) → score updates (1.0s).
- **Background color flash**: Full-screen green/red radial flash pulses on result (0.15 opacity, 0.6s duration). Visceral feedback without being jarring.
- **Tap hint delayed**: Appears at 1.2s instead of immediately — lets the result land before prompting next action.

### Design Decision
Odin: "The emotion is present but thin — you feel it intellectually, not in your body." The fix is temporal, not visual. The suspense beat between "AI reveals stat" and "who won" creates anticipation even when the numbers are lopsided. The color flash provides subconscious emotional confirmation. These are fighting-game patterns: screen freeze on impact, color shift on KO.

## What Cycles 22-24 Target

| Dimension | Cycle 21 Score | Target | Fix Applied |
|---|---|---|---|
| Feature-to-Emotion | 5 | 7 | Remove all $ from battle (Cycle 22) |
| Attention Hierarchy | 6 | 7+ | 3 random stats, best-stat highlight (Cycle 23) |
| First-Minute Emotion | 6 | 7 | 1.0s intro, suspense beat, color flash (Cycle 24) |

## Next
Cycles 25-30: Convergence. Frigga research recommends C→B hybrid (battle earns cards → cards fill binder sets). Vision A deferred to Season 2.
