# Soul Cycle 4 — Vision A — Research: Story-First Collecting
Phase: 1
Version: v8.76 (no code changes — research cycle)

## Frigga Research Summary

### Key Findings

**1. Genshin Impact's Story Gating: Hard Locks, Not Soft Suggestions**
- Character Story Quests require owning the character + a Story Key earned through play
- The lock is LITERAL: a padlock icon on the quest map next to quest names
- The UI shows the story exists before you can access it — the locked door is visible
- Limited-time banners run concurrent with story patches, so the narrative creates the pull desire

**2. Pokemon's Screen-to-Card Pipeline: "Witnessed Greatness" Transfer**
- Anime showed a character doing something memorable → card becomes a vessel for that emotional memory
- The card's value is set by the story, not by the card itself
- Cards launched AFTER the anime — desire was pre-loaded by narrative
- Social function: "Did you see what Pikachu did?" → the card continues the conversation

**3. Narrative Mobile Games: Withhold Then Deliver**
- Florence: 90-120 second chapters, single mechanic per chapter, used once then discarded
- Monument Valley: emotional beats at level transitions, not within levels
- Pattern: emotional pacing uses scarcity of repetition — beat lands because the prior 4-5 minutes withheld it
- Alto's Odyssey warning: environmental pacing without character creates pleasant affect, NOT attachment

**4. Cards as Keys vs. Cards as Objects: The Inflection Point**
- A collectible becomes an ACCESS CREDENTIAL when not having it creates a LEGIBLE ABSENCE
- A trading card you don't own is invisible. A story key you don't own produces a LOCKED DOOR you can see.
- "You are missing Chapter 7" lands differently than "you are missing card #247"

**5. Products Where Story IS the Collecting Mechanic**
- Genshin Impact Character Story Quests — literal padlock
- Infinity Blade III — weapon class gated story branches
- Shadowrun Dragonfall — cyberware unlocked dialogue branches

### The Core Pattern
**Desire is created by the glimpsed-but-unreachable, not by the unknown.**

The mechanism: show the chapter title, show the lock, name the specific card that opens it. The user can see the story waiting for them. The card is not a collectible — it's a key.

## Existing Data Audit
The existing `lore-graph.ts` already implements this pattern:
- 7 nodes per set with `requiredCharacters` (card ownership gates)
- `connections` between nodes (the story graph)
- Rich narrative text per node
- Sets that map to the 3 mythologies: Olympus (Greek), Baker Street (Victorian), Enchanted Kingdom (Fairy Tale)

**This is the strongest existing foundation of any vision.** The data layer is ready. The UX needs to make the locked doors visible and the unlocking ritual emotional.

## Design Implications for Prototype A
1. Story map shows ALL nodes — locked ones as silhouettes with visible titles
2. Each node shows which specific cards unlock it (by character name)
3. Unlocking a node is a RITUAL: animation, narrative reveal, emotional pacing
4. Pack opening should show how each card connects to the story map
5. The "next chapter" tease should show the locked node + named required cards

## The One Question
Does Vision A's research support a strong emotional core? **Yes — the strongest of the three.** The existing lore graph maps directly to the "story key" pattern. The emotional arc (curiosity → revelation → completion hunger → anticipation) has clear reference products.

## Risk
The risk is that "story" is slow. Pack opening must also trigger story progress immediately — not just "come back later to read." The reveal must happen AT the moment of collection.
