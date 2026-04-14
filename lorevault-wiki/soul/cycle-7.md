# Soul Cycle 7 — Vision A — Story Map Data + World Selection
Phase: 2
Version: v8.77

## What Changed
### Added
- `src/data/story-maps.ts` — 3 story worlds (Olympus/Greek, Enchanted Kingdom/Fairy Tale, Baker Street/Victorian), each with 8 narrative chapters, character-gated unlocks, teasers for locked nodes
- `src/app/prototype/story/page.tsx` — Complete 3-phase flow:
  1. **Intro**: "Every card has a story. What world calls to you?" — atmospheric, timed text reveal
  2. **World selection**: Full-bleed panels, breathing icon, world gradient, swipeable navigation
  3. **Story map**: Vertical chapter timeline with locked doors (visible title + teaser + required characters), unlocked chapters with expandable narrative content, progress bar

### Design Decisions
- World selection is confirmed by the gift, not a dialog — entering a world saves to localStorage
- Locked chapters show the TITLE (not hidden) and a TEASER (one line of mystery) — the glimpsed-but-unreachable pattern from Frigga research
- Required characters shown as small pills on "next" locked chapter — naming the specific keys
- Unlocked chapters expand on tap to reveal full narrative text
- Progress: "Chapter X of 8" + accent-colored progress bar
- CTA: "Open packs to unlock the next chapter" at bottom

## Frigga Insight Applied
World selection research:
- **3 is the canonical choice count** — 2 feels like a coin flip, 4 causes comparison fatigue
- **Full-bleed panels > cards > tiles** — each world should fill the viewport when focused
- **Breathing icon** — the world is alive before you choose it (3-second scale animation loop)
- **Irreversibility through ceremony, not lockout** — the 2.5-second selection animation creates commitment
- **"The selection is confirmed by the gift, not a dialog"** — entering the world gives you something immediately

## The One Question
Does this prototype make someone feel curiosity? **Starting to.** The intro text creates atmosphere. The locked chapters show visible doors with visible keys. The story map makes progress legible. But the experience is still missing the RITUAL — the moment when a card unlocks a chapter and the narrative reveals. That's Cycle 8-9.

## Next
Cycle 8: Story-linked pack opening — cards reveal WITH narrative snippets, animate into story map positions.
