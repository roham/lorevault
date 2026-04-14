# Soul Cycles 19-20 — Vision C — Refinement + Mobile Polish

Phase: 4
Version: v8.87

## What Changed
### Modified
- `src/app/prototype/play/page.tsx` — Vision C refinements:
  - **Visual stat bars**: Stat picker now shows animated bars (width = stat%) alongside values. Bars fill from 0 to value over 0.5s with staggered delays. Makes stat comparison visual, not just numerical.
  - **Staggered stat entrance**: Each stat button fades in with 60ms stagger, creating a "stats loading" feel.
  - **Social proof on value reveal**: After 3+ wins, reward card shows "X players own this card" count (simulated) alongside market price. The 3 co-occurring signals: visual distinction (scarcity border glow), tradability cue (market price), social proof (ownership count).
  - **Safe area padding**: Battle result and value reveal screens have env(safe-area-inset-bottom) padding.

### Design Decisions
- **Stat bars > numbers**: A value of "85" means nothing to a new player. An 85%-wide red bar next to a stat labeled "Power" communicates instantly. The bars also make stat-picking strategic — you see which stats are high at a glance.
- **Social proof as scarcity signal**: "28 players own this card" creates two emotions: (1) "this is rare" and (2) "I'm one of the few." Both amplify the "found money" moment. The count is simulated (12-52 range) but represents the intended design.
- **Staggered entrance**: The 60ms stagger on stat buttons creates a "loading" feel that makes the battle phase feel dynamic rather than static. Borrowed from fighting game character select screens.

## Frigga Insight Applied
From Vision C research:
- **"The revelation requires three co-occurring signals"**: Visual distinction (scarcity color glow on reward card), tradability cue (market price), social proof (ownership count). All three now present on the battle-result reward card.
- **"Satisfaction comes from pre-battle agency"**: The stat bars give the player visual information to make strategic choices. "Did my strategy work?" is more engaging than "will my number win?"

## The One Question
Does Vision C serve the ONE emotion (fun → surprise discovery)? **Yes, with caveats.** The battle is quick and the stat-picking is genuinely strategic. The "found money" moment hits all three psychological signals. The caveat: the battle itself is still stat-comparison, not a visual spectacle. The 20-30 second battle animation target from Frigga's research is not yet implemented — rounds resolve instantly on tap. A battle "replay" animation would push this from adequate to compelling.

## What's Missing
- Battle round animation (stat bars clash, damage numbers, turn order)
- Sound design (card play sfx, stat comparison sfx, victory sfx)
- Guaranteed reward track ("Play 3 matches → guaranteed pack")
- Win streak bonuses

## Next
Cycle 21: Score Vision C (dispatch Odin-Soul).
