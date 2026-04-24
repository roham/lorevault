# Daemon Build Cycle 16 — Population Counters + Serial Number Enhancement
Date: 2026-04-14
Directive: DIRECTIVE-006
Version: v8.26

## Frigga Research Summary
- **NBA Top Shot**: `#serial / edition_size` in bold monospace. Low serials (#1-10) get gold badge overlay. Population visible as "X listings / Y minted." Denominator makes numerator feel special.
- **PSA Population Reports**: "PSA 10: Pop 47" in red bold when under 100. Relative comparison between grades creates scarcity perception.
- **CS:GO Float/Pattern**: Float value to 14 decimals. Sub-0.01 floats command 10-100x premium. Micro-differentiation within same tier.
- **Funko Pop**: "Limited to 1,000 Pieces" sticker. Explicit hard cap stated upfront.
- **Key insight**: Never show population alone. Always relative — serial vs pop, this grade vs other grades. Scarcity is felt through contrast.

## Odin Pre-Build Scores
| Dimension | Score | Evidence |
|-----------|-------|----------|
| Scarcity Legibility | 8 | Glow, borders, aging, sealed overlay. |
| Instance Identity | 8 | Aging tiers, origin badges, serial numbers. |
| Chase Tension | 8 | Sealed/reveal, Norse chase targets, feed copy. |
| Discovery Surprise | 9 | Multi-phase reveal, 6 sets, deep-cut characters. |
| Social Proof | 6 | Badges private, mockPercent implied community. |
| Lore Depth | 6 | Norse Eddic lore, card flavor text. |
| Temporal Weight | 8 | Aging tiers, bonded/ancient glow. |
| Provenance | 7 | Journey Timeline, origin badges. |
| Utility Loop | 7 | Battle, trivia, missions, achievements. |
| Loss Aversion | 7 | Aging endowment, badge investment. |
Total: 74/100

## What Was Built
**DIRECTIVE-006: Population counters + serial number enhancement**

Files changed: `src/lib/store.ts`, `src/components/CardItem.tsx`, `src/app/card/[id]/page.tsx`.

Key changes:
- **getPopulationData()**: Deterministic population from `hashCode(cardId)`. Ranges: Legendary 10-49, Epic 50-199, Rare 200-999, Uncommon 1K-3K, Common 5K-10K. Parallel divisors (base÷1, silver÷2, gold÷4, holo÷8, obsidian÷20). currentOwners = 60-90% of totalMinted. Serial tiers: genesis (#1), low (#2-10), mid (top 10%), standard.
- **Population counter on card detail**: "X Minted · Y Collectors" with divider. Serial tier labels. Dot visualization for legendaries (≤50): highlighted dot for user's serial with glow.
- **Enhanced serial badges**: Color-coded by tier (genesis=gold, low=amber, mid=silver). ✦/★ prefixes. Applied to both CardItemStatic and CardItemInteractive.
- **Rarity labels enhanced**: "Legendary · 15 Exist" on detail, "Legendary · 15" on tiles at lg/xl sizes.

## Odin Post-Build Scores
| Dimension | Before | After | Delta |
|-----------|--------|-------|-------|
| Scarcity Legibility | 8 | 9 | +1 |
| Instance Identity | 8 | 9 | +1 |
| Chase Tension | 8 | 8 | 0 |
| Discovery Surprise | 9 | 9 | 0 |
| Social Proof | 6 | 7 | +1 |
| Lore Depth | 6 | 6 | 0 |
| Temporal Weight | 8 | 8 | 0 |
| Provenance | 7 | 7 | 0 |
| Utility Loop | 7 | 7 | 0 |
| Loss Aversion | 7 | 7 | 0 |
Total: 74/100 → 77/100 (+3)

## Reviewer Notes
- Acceptance criteria fully met (5/5)
- Common/Uncommon population range overlap (3000-4999) — FIXED: uncommon now 1000-2999, common 5000-9999
- "Silver Serial" label confused with silver parallel type — FIXED: renamed to "Early Serial"
- Dot visualization threshold (≤50) is redundant with legendary range — cosmetic, not a bug

## Weakest Dimension
Lore Depth (6/10) and Social Proof (7/10). Lore Depth has had zero direct investment across 6 directives. Social Proof improved but remains simulated. Next wave must address these.

## Deploy URL
https://lorevault-site-12zrb4cod-ros-projects-9a9bb0c9.vercel.app
