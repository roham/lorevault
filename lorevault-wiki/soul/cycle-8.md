# Soul Cycle 8 — Vision A — Story-Linked Pack Opening
Phase: 2
Version: v8.78

## What Changed
### Added
- `src/app/prototype/story/pack/page.tsx` — Story-linked pack opening with 4 phases:
  1. **Ready**: World-branded pack with icon, "{worldName} Pack", pack count
  2. **Opening**: Brief anticipation animation (0.8s world icon pulse)
  3. **Reveal**: One card at a time. Each card shows: gradient art + symbol, character name, moment, lore quote, AND which story chapter this card is a key to ("Key to: The Trojan War")
  4. **Summary**: Cards pulled (mini thumbnails), chapter unlock celebration, story progress bar with animation, "Read the new chapter" / "Open another pack" CTAs

### Modified
- `src/app/prototype/story/page.tsx` — "Open packs" CTA now links to `/prototype/story/pack`

### Design Decisions
- Pack generates from the selected world's SET SLUG — all cards are from your story
- Each revealed card shows which chapter it's a KEY to — the "locked door" pattern made concrete
- Narrative snippet (lore quote) appears 0.3s after card settles, below the card — text never overlaps the visual
- Chapter unlock detection: compares owned characters before vs after pack opening
- Summary celebrates unlocked chapters with accent-colored heading
- Progress bar animates from before-count to after-count

## Frigga Insight Applied
Pack opening ritual research:
- **Pre-signal rarity before reveal**: Genshin's gold/purple color bloom happens 0.8s before the character is visible. Pokemon TCG Pocket glows amber before flip. The ANTICIPATION window is the peak emotion, not the reveal.
- **Vary pacing across 5-card sequence**: Uniform pacing feels mechanical. Cards 1-3 faster, card 5 should be the ritual.
- **Narrative text after motion settles**: Eye can't process motion and text simultaneously. Text fades in 0.3s after card completes, rising from below.
- **Dwell time 0.8-1.2s minimum**: Under 0.8s feels skippable. Over 1.5s feels punishing. After rares, extend to 2.0-2.5s.

## The One Question
Does this pack opening serve the ONE emotion (curiosity → revelation)? **Yes.** Every card reveal connects to the story map. You don't just "get a card" — you get a key to a chapter. The lore quote and the "Key to" badge make collection feel like discovery. The summary celebrates story progress, not pack count.

## What's Missing
- Rarity pre-signal (glow before reveal) — not yet implemented, would elevate the 7→8 transition
- Variable pacing across 5 cards — currently uniform timing
- Sound design (can't do in a web prototype easily)

## Next
Cycle 9: Story node unlocking + chapter reveal — the moment when collecting enough cards triggers a narrative chapter animation.
