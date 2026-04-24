# Soul Cycle 9 — Vision A — Story Node Unlocking + Chapter Reveal

Phase: 2
Version: v8.79

## What Changed
### Added
- `src/app/prototype/story/chapter/[id]/page.tsx` — Full chapter reveal page:
  - Atmospheric gradient background (world gradientFrom → gradientTo → dark)
  - Radial glow accent overlay for depth
  - Chapter header: mono "CHAPTER N" label, heading title, icon
  - Staggered sentence reveal: text split by sentence, each fades in 0.8s apart
  - Next chapter tease: locked title + teaser shown after text completes
  - CTAs: "Open packs for the next chapter" / "Back to story map"
  - Unlock check: redirects to locked state if characters not collected
  - Locked state: shows teaser, required characters, and link to pack opening

### Modified
- `src/app/prototype/story/page.tsx` — StoryNodeCard refactored:
  - Unlocked chapters now navigate to `/prototype/story/chapter/{id}` via Link
  - Removed old inline expansion (AnimatePresence + expanded state)
  - Conditional Wrapper pattern: Link for unlocked, div for locked
  - Cleaned dead imports (ALL_CARDS, getOwnedCardIds)
  - Read indicator chevron (no rotation) signals "tap to read"

### Design Decisions
- **Navigate, don't expand**: Unlocked chapters open a full-screen narrative page instead of expanding inline. The story map stays clean — it's a navigation tool, not a reading surface. Inline expansion competed with the locked-door pattern visually.
- **Sentence-by-sentence reveal**: Text is split by sentence boundaries and staggered at 0.8s intervals. This pacing matches a "campfire storytelling" cadence — not a wall of text dump.
- **Atmospheric gradient**: Each chapter page inherits its world's color palette. The gradient runs from world color at top to dark at bottom, creating a "reading into the night" feel.
- **Next chapter tease at bottom**: After finishing a chapter, you see the locked next chapter — the "desire created by the glimpsed-but-unreachable" pattern carried forward from the story map.

## Frigga Insight Applied
From narrative pacing research:
- **Staggered text reveal creates reading rhythm**: Dumping all text at once invites skimming. Sentence-by-sentence creates anticipation for the next beat, similar to visual novel pacing.
- **0.8s per sentence is the sweet spot**: Under 0.5s feels rushed, over 1.2s feels sluggish. 0.8s matches natural reading pace + absorption time.
- **Atmospheric background > illustrations**: When you can't do full illustrations, color atmosphere + typography creates mood more effectively than placeholder art.

## The One Question
Does the chapter reveal serve the ONE emotion (curiosity → revelation)? **Yes.** The locked story map creates curiosity. Collecting cards creates anticipation. The chapter reveal IS the revelation — atmospheric, paced, narrative. And immediately after, the next locked chapter re-ignites curiosity. The loop closes.

## What's Missing
- Scroll-triggered animation (sentences reveal on scroll instead of timer) — would make long chapters more natural
- Reading progress persistence (mark chapters as "read")
- Ambient sound/music cues (web prototype limitation)

## Next
Cycle 10: Progress display + next-chapter tease — "Chapter 1 of 8" with silhouetted cards for the next chapter's requirements.
