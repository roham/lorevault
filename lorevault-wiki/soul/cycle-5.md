# Soul Cycle 5 — Vision B — Research: Set-Collector (The Chase)
Phase: 1
Version: v8.76 (no code changes — research cycle)

## Frigga Research Summary

### Key Findings

**1. Pokemon TCG Pocket Gap Treatment: Silhouette with Frost**
- Undiscovered cards: dark charcoal silhouette (`#1a1a2e` to `#2d2d44`) with blue-purple tint
- Card slot is the CORRECT SIZE — the binder doesn't collapse around the gap
- Card name hidden. Rarity pips visible but grayed to ~30% opacity
- Persistent header shows `47/226` — the ratio never leaves peripheral vision
- Critical: the empty geometry IS the desire. "This specific shape is missing."

**2. Physical Album Completion Anxiety**
- Panini sticker albums have PRINTED BORDERS in empty slots — a thin rectangle showing exactly where the sticker belongs
- Pages with 3 of 9 stickers create "asymmetric completion pressure" — eye bounces between filled (shiny) and gaps (flat)
- Topps binders: empty pockets have inward shadow, making them look RECESSED — filled = flush, empty = hollow
- Physical genius: you can feel the weight difference between full and half-empty binder

**3. Targeted Desire > Generic Desire (Named Gaps)**
- "I need THIS card" drives far higher engagement than "I need any card"
- The mechanism: generic collecting ends when inventory pressure ends. Named desire persists because it has a named object.
- Named gaps create IDENTITY: "I'm the person who doesn't have Charizard yet"
- This creates obsession: named gap → search → near-miss → return visit → named gap again
- Generic collecting has no near-miss. You don't "almost get any card."

**4. Pull Rate Transparency Paradox**
- Exact percentages DECREASE session excitement but INCREASE long-term engagement
- Optimal pattern: show rarity VISUALLY (gems, star count) without exact percentages
- MTG foils: visually distinct (prismatic refraction) but no pack says "1 in 67"
- The signal should be SENSORY, not statistical

**5. Gap Colors That Pull vs. Placeholder Colors**
- Dark navy-charcoal: `#1c1c2a` to `#242436` — reads as "waiting," as depth
- Border: `rgba(255,255,255,0.12)` — barely visible white edge
- Interior: faint inward blue shadow `box-shadow: inset 0 0 12px rgba(80,80,180,0.15)`
- Gray (#888) reads as "placeholder" — WRONG. Dark blue-black reads as "a hole to fill" — RIGHT
- Pure black reads as broken/disabled. Navy reads as depth.

## Design Implications for Prototype B
1. Binder MUST show empty slots at correct card dimensions, not collapsed
2. Missing cards show as silhouettes with name HIDDEN but rarity VISIBLE (pips or border glow)
3. One specific rare card highlighted as "THE chase card" — named, with visible rarity signal
4. Completion count always visible: `4/20 collected`
5. Gap colors: dark navy `#1c1c2a` with faint blue inward glow
6. Pull rates shown as visual rarity tiers (border color/glow), NOT percentages
7. After every pack: progress bar animates, new cards animate into their binder slots

## Existing Data Audit
- `Card` interface has: scarcity, parallel, price, listed, serialNumber, maxSerial
- `BinderCard.tsx` exists — performance-optimized card renderer
- `SetProgress.tsx` exists — per-set completion tracking
- `SETS` data has 6 sets with 20 cards each = 120 total cards
- `store.ts` has set progress computation ready

## The One Question
Does Vision B's research support a strong emotional core? **Yes.** The "visible gap with a named card" is one of the most proven emotional mechanics in collectibles history. The risk is that it's well-understood but also well-replicated — the execution (the FEEL of the gap, the quality of the binder) must be exceptional.

## Risk
The risk is commodification. "See what you're missing, open packs" is what EVERY collectible app does. The differentiator must be in the FEEL — the tactile quality of the binder, the visceral moment of a near-miss, the specific visual treatment of the gap.
