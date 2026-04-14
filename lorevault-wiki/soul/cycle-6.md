# Soul Cycle 6 — Vision C — Research: Game-First Collecting
Phase: 1
Version: v8.76 (no code changes — research cycle)

## Frigga Research Summary

### Key Findings

**1. Pokemon TCG Pocket: Two-Stage Value Realization**
- Stage 1 (Days 1-7): Cards feel like gameplay tokens — you open packs, build decks, win battles
- Stage 2 (The trigger): Pull a full-art rare. Different sound, different animation, game PAUSES to signal "this one is different"
- Value realization comes from SOCIAL SIGNAL: a friend wants it, or you see it flexed in an opponent's deck
- "Envy recognition" converts "pretty card" to "scarce card" — not a price tag, but witnessed desire
- Trading system launched MONTHS after the game — players built emotional attachment first

**2. Clash Royale: The Upgrade Wall**
- Never separates "fun to play" from "rare/valuable" — they're the same feeling
- Value realization happens at the UPGRADE WALL: you're losing because your legendary is under-leveled
- "I want this card because it's fun" becomes "I need 10 more copies" — frustration-driven marketplace instinct
- The shift is never explicit — it's a FRICTION REVEAL

**3. Marvel Snap: Collection-Through-Progression**
- Series 1-3 cards earned through pure gameplay progression (~100 hours free)
- Marketplace (Token Shop) appears around Collection Level 500 — after you've already internalized card value
- By the time the shop appears, you already have a "most wanted" card
- FOMO bridge: Spotlight Caches (weekly rotating rare cards) convert desire into urgency

**4. "Found Money Asymmetry" — The CS:GO Model**
- Items you FIND feel more valuable than items you BUY at the same price
- Zero buyer's remorse, only windfall — "wait, this is worth money?" hits hardest with zero financial intent
- A friend tells you your knife skin is worth $200. You didn't buy it. You GOT it.
- This is a form of lottery win psychology

**5. Overcoming "Digital Items Are Disposable"**
- Named ownership: "This card is in YOUR collection" — persistent, searchable inventory
- Scarcity signals that persist: rarity tier, foil, edition number always visible
- Social proof surfaces naturally: seeing your rare used/copied/asked about
- Non-duplicating drops: if you own it, you don't get another → implies fixed identity
- BIGGEST ENEMY: energy/lives mental model (items that expire). Any expiry mechanic poisons collectible psychology

**6. Marketplace Timing: 7-14 Days**
- Expose marketplace after player has formed a "most wanted" item — not before
- Before desire = storefront feeling. After desire = destination feeling.
- The player should arrive at the marketplace already knowing what they want

## Design Implications for Prototype C
1. First screen: ONE BUTTON — "Play?" — zero onboarding
2. Tutorial battle uses pre-built starter deck (no deck-building cognitive load)
3. Win → pack reward. Cards highlighted for GAMEPLAY STATS (not lore, not rarity)
4. The strategic gap: opponent has a card you DON'T. You lose because of it. The moment collecting clicks.
5. Value reveal is SOCIAL, not price-tagged: "Your Hercules card was used by 3 opponents today"
6. Marketplace hidden for first 5+ games. It appears when the player already knows what they want.
7. No expiry mechanics. No energy system. Cards are permanent.

## Existing Data Audit
- `BattleCard.tsx` — full battle card with stat display, animations, result states
- `StatReveal.tsx` — stat comparison animation
- `games/battle/page.tsx` — complete battle system with deck select, difficulty, AI opponent
- `store.ts` — battle records, saved decks, game stats
- `ai.ts` — AI opponent with difficulty levels and stat selection logic
- `stats.ts` — 5-stat system (power, intelligence, mystery, legend, charm)

## The One Question
Does Vision C's research support a strong emotional core? **Yes, but it's the highest-risk vision.** The hook is clear (play → win → earn → discover value), but the timing must be precise. Too early on value = storefront. Too late = they never discover it. The "found money asymmetry" is the most powerful psychology of the three visions, but it requires the longest runway.

## Risk
Two risks:
1. The game must be genuinely FUN in its own right — not a thin skin over pack-opening. If the battle system is "choose a stat, compare numbers," it's not enough.
2. The "digital items are worthless" assumption is strong. Overcoming it requires persistent ownership signals and social proof, which are hard to fake in a prototype.
