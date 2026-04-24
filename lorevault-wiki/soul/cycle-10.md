# Soul Cycle 10 — Vision A — Progress Display + Card Silhouettes

Phase: 2
Version: v8.80

## What Changed
### Modified
- `src/app/prototype/story/page.tsx` — StoryNodeCard enhanced with card silhouettes and collection progress:
  - **Card silhouettes**: Next locked chapter shows mini card shapes (5:7 ratio, 32x44px) for each required character
  - **Owned vs missing**: Owned cards show gradient background + symbol + accent-colored checkmark badge. Missing cards are dark silhouettes with greyed-out symbol (15% opacity, grayscale)
  - **Character labels**: Short name (last word) under each silhouette, accent-colored if owned, muted if missing
  - **Key counter badge**: Top-right of next-locked chapter header shows "2/3" pill with accent color
  - **Progress hint**: "1 more card to unlock" text below silhouettes when partially collected
  - **Distant chapters**: Show "N cards needed" in muted text instead of full silhouettes (progressive disclosure)
  - Card data lookup: Uses ALL_CARDS to find symbol + gradients for each required character

### Design Decisions
- **Silhouettes, not text pills**: The old design showed character names as plain text pills. Card silhouettes create the visual language of collection — you SEE the cards you need, not just read names. The dark silhouette with faint symbol is the "gap psychology" pattern: you can see what COULD be there.
- **Checkmark badge on owned**: Small accent-colored checkmark in bottom-right corner of owned card silhouettes. Borrowed from achievement UI patterns — satisfying micro-confirmation.
- **Last word for labels**: "Helen of Troy" becomes "Troy", "The Minotaur" becomes "Minotaur". Fits 40px width without truncation in most cases.
- **Progressive disclosure for distant chapters**: Only the next-locked chapter gets full silhouettes. Distant locked chapters just show "N cards needed" — prevents information overload on the story map.
- **Key counter in header**: The "2/3" badge gives at-a-glance progress without needing to count silhouettes.

## Frigga Insight Applied
From collection progress psychology research:
- **Visual gaps drive acquisition more than text**: Seeing an empty card slot is more motivating than reading "You need Medusa". The silhouette shape + faded symbol creates a concrete "hole" in the collection.
- **Partial progress is more motivating than zero progress**: The endowed progress effect (Nunes & Dreze, 2006) — showing 2/3 collected is dramatically more motivating than showing 0/3. The key counter badge makes partial progress immediately visible.
- **Small checkmarks satisfy the "completionist brain"**: Each owned card's checkmark is a micro-reward that accumulates. The pattern borrowed from achievement systems and to-do apps.

## The One Question
Does the progress display serve the ONE emotion (curiosity → revelation)? **Yes.** The card silhouettes make the gap between "where you are" and "the next chapter" visceral and visual. You don't just know you need cards — you SEE the empty slots. The owned checkmarks provide momentum. The "1 more card to unlock" hint creates urgency. Every element drives toward opening the next pack.

## What's Missing
- Animated fill when a new card is collected (silhouette → lit up transition)
- Haptic-style pulse on the key counter when it increments
- Card silhouette tap to see which packs contain that character

## Next
Cycle 11: Mobile polish — 375px viewport optimization, thumb navigation, safe areas, scroll behavior.
