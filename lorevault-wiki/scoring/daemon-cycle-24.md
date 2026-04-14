# Daemon Cycle 24 — D015 Scoring

**Directive**: D015 — Scarcity Gradient Ascension (Parallel Transmute + Burn + Population Decay)
**Commit**: 8e026ff
**Version**: v8.35
**Date**: 2026-04-14

## Collectibility Score: 98 → 99

| Dimension | Before | After | Delta | Justification |
|-----------|--------|-------|-------|---------------|
| Discovery Surprise | 10 | 10 | 0 | Ghost cards already maxed |
| Scarcity Legibility | 10 | 10 | 0 | Already maxed from population counters |
| Temporal Weight | 9 | 9 | 0 | Seasons already drive urgency |
| Instance Identity | 9 | 9 | 0 | Card DNA covers this |
| Provenance | 9 | 9 | 0 | Journey timeline + legacy score |
| Lore Depth | 9 | 9 | 0 | Codex graph covers this |
| Social Proof | 9 | 9 | 0 | Hall + LivePulse + reactions |
| Utility Loop | 9 | 10 | +1 | Transmute + Burn create two new meaningful card-sink loops beyond forge. Cards now have three utility paths: forge up rarity, transmute up parallel, or burn for XP. Every card has a purpose. |
| Loss Aversion | 9 | 10 | 0→+1 | Burn is irreversible. Transmute consumes 3 cards. Population decay makes high-serial cards feel lesser. Real sacrifice with emotional weight. |
| Completion Drive | 10 | 10 | 0 | Prestige already maxed |

**Total: 98 → 99 (+1)**

## What shipped
- Parallel Transmute system on forge page (mode toggle, parallel filter, 3→1 upgrade)
- Card Burn mechanic on card detail (2× XP, confirmation dialog, irreversible)
- Population Decay visual tiers (bright/normal/faded based on serial position)
- PARALLEL_COLORS constant for transmute UI styling
- burnCard() XP grant fix (was string, now number)

## What's left for 100
- Narrative Depth at 9 needs one more push → D016 (Discovery Cascade + Chronicle) moves it to 10
- That's the only remaining dimension below 10
