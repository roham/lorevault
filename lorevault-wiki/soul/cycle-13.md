# Soul Cycle 13 — Vision B — Set Selection + Binder Grid + Pack Opening

Phase: 3
Version: v8.83

## What Changed
### Modified
- `src/app/prototype/chase/page.tsx` — Full Vision B prototype replacing placeholder:
  - **Intro**: "Every set tells you what's missing. Can you complete it?" → "Choose a set"
  - **Set selection**: 2x3 grid of set "covers" with icon, name, owned/total count, progress bar, completion badge
  - **Binder grid**: 4-column grid showing all 20 characters in a set
    - Owned cards: gradient background + symbol + scarcity color bottom bar
    - Empty slots: dark background + faded greyscale symbol (8% opacity) + dashed border + corner accents
    - Character name always visible under each slot (owned = bright, missing = faded)
  - **Pack ready**: Breathing set icon, "Tap to open" prompt
  - **Pack opening**: Burst animation (0.8s icon pulse)
  - **Pack reveal**: One card at a time with "NEW FOR YOUR SET" badge (green), "Already in collection" (muted), "From another set" (dimmed)
  - **Pack summary**: New card count, mini card row with green + badges, set completion progress bar (animates from before→after), "X more to complete the set"
  - **Fixed bottom CTA**: "Open Pack (N left)" pinned to bottom of binder with gradient fade

### Design Decisions
- **4 columns on mobile**: At 375px with 12px padding and 8px gaps, each card is ~78px wide × ~109px tall. This is smaller than Frigga's recommended 3-per-row, but 20 cards at 3-per-row = 7 rows = too much scrolling. 4 columns = 5 rows, all visible above the fold on most phones. Trade-off: slightly smaller cards for instant set comprehension.
- **Named gaps**: Character name always visible under every slot — owned or empty. The research says "named gaps create identity." You don't just see an empty slot, you see "Medusa — empty."
- **Dashed border + corner accents on empty slots**: The empty slot has dashed 1.5px border and four corner accent lines, creating the "binder holds the shape" feeling. The printed border on an empty Panini slot, digitized.
- **NEW FOR YOUR SET badge**: Green badge on card reveal when the card fills a gap. This is the "set completion dopamine" moment — more powerful than generic "new card."
- **Fixed bottom CTA**: Pack opening button is always accessible during binder browsing. No navigating away to open packs.
- **Set slug filtering**: generatePack(setSlug) generates from the selected set, so most cards will be from your active set. Cross-set cards labeled "From another set."

## Frigga Insight Applied
From Vision B research:
- **Named numbered placeholders**: PTCGP shows card number, community apps show 3-per-row. Adapted to 4-col with always-visible character names.
- **Near-miss as named absence**: "Silhouette-with-frost" treatment not shipped by PTCGP but is the RIGHT design. Our faded symbol + name creates the named absence.
- **Goal Gradient Effect**: Progress bar on binder animates to current %. At 90%+, should switch to "FINISHING" mode (not yet implemented).

## The One Question
Does this binder serve the ONE emotion (desire for completion)? **Yes.** The 4-column grid is designed for instant set comprehension — you see owned and missing at a glance. Every empty slot has a name. The progress bar quantifies the gap. The "NEW FOR YOUR SET" badge creates the completion micro-dopamine. The fixed bottom CTA makes the next pack opening one tap away.

## What's Missing
- "FINISHING" mode at 90%+ completion (full-screen focus on remaining gaps)
- Tap-to-inspect on owned cards (show full card detail)
- Near-miss treatment in pack opening (rarity pre-signal)
- Trading/marketplace bridge (empty slot → "3 players have this")
- 3-column option for larger displays

## Next
Cycle 14: Binder refinement — apply Frigga research on near-miss treatment, finishing mode, and binder inspection.
