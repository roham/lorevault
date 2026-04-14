# Daemon Build Cycle 14 — Card Provenance: Journey Timeline + Origin Badges
Date: 2026-04-14
Directive: DIRECTIVE-004
Version: v8.24

## Frigga Research Summary
- **NBA Top Shot**: Full ownership chain with timestamps, serial in context "#47/10,000", "Owned Since" date. Creates narrative arc per collectible.
- **Pokemon TCG "First Edition"**: Small stamp on card face creates instant provenance legibility at thumbnail scale. Two-tier market (1st Ed vs Unlimited).
- **PSA/BGS Grading**: Certificate frame wraps card metadata in authoritative layout. Population reports ("PSA 10: 47 exist") make scarcity concrete.
- **NFT Provenance (OpenSea)**: Activity feed with event type icons, timestamps, price history correlation. Rarity rank within collection.
- **Key insight**: Provenance is not about having more data — it's about framing existing data to create narrative, identity, and authority. LoreVault's `history[]` is an invisible provenance chain. Making it visible is the gap.

## Odin Pre-Build Scores
| Dimension | Score | Evidence |
|-----------|-------|----------|
| Scarcity Legibility | 8 | Glow, borders, sealed overlay. |
| Instance Identity | 6 | Aging tiers differentiate same-card instances. |
| Chase Tension | 8 | Sealed/reveal, Norse chase targets, feed copy. |
| Discovery Surprise | 9 | Multi-phase reveal, 6 sets, deep-cut characters. |
| Social Proof | 4 | No sharing, leaderboards, or ownership counts. |
| Lore Depth | 5 | Norse loreText from primary Eddic sources. |
| Temporal Weight | 7 | Aging tiers (pristine→veteran), bonded/ancient glow. |
| Provenance | 2 | history[] tracks events. No UI surfaces it. |
| Utility Loop | 6 | Battle, trivia, missions + aging progression incentive. |
| Loss Aversion | 5 | Aging creates endowment effect. |
Total: 60/100

## What Was Built
**DIRECTIVE-004: Card provenance — Journey Timeline + Origin Badges**

Files changed: `src/lib/store.ts`, `src/components/CardItem.tsx`, `src/components/CardJourney.tsx` (new), `src/app/card/[id]/page.tsx`.

Key changes:
- **CardJourney.tsx**: New component. Vertical timeline rendering `history[]` events with 6 distinct event types (pulled ⭐, revealed 👁, battle_win ⚔, battle_loss 🛡, showcased 🏆, traded 🔄). Each has unique icon, color, label. Header shows "N events · Dd held". Top 5 visible, expand button for more. Staggered framer-motion entrance.
- **getOriginBadge(cardId)**: Priority-ranked badge system: Genesis (first pack, gold ✦) > OG (first 10 cards, amber ⚡) > Veteran (aging tier, dark gold 🏛) > Pristine (mint condition, ice ✦). Returns highest qualifying badge.
- **Origin Badge overlay**: Rendered on both CardItemStatic and CardItemInteractive. Top-left corner, z-[16], rounded pill with backdrop-blur. Icon only at sm/md, icon + label at lg/xl. Hidden when sealed.
- **Card detail integration**: CardJourney rendered between Battle Stats and Lore text for owned cards with history.

## Odin Post-Build Scores
| Dimension | Before | After | Delta |
|-----------|--------|-------|-------|
| Scarcity Legibility | 8 | 8 | 0 |
| Instance Identity | 6 | 8 | +2 |
| Chase Tension | 8 | 8 | 0 |
| Discovery Surprise | 9 | 9 | 0 |
| Social Proof | 4 | 5 | +1 |
| Lore Depth | 5 | 6 | +1 |
| Temporal Weight | 7 | 8 | +1 |
| Provenance | 2 | 7 | +5 |
| Utility Loop | 6 | 6 | 0 |
| Loss Aversion | 5 | 6 | +1 |
Total: 60/100 → 71/100 (+11)

## Reviewer Notes
- Acceptance criteria fully met (4/4)
- Origin badge overlay (top-1.5, left-1.5) overlaps with set badge (top-2, left-2) in CardItemInteractive — should reconcile before adding more overlay elements
- OG badge computation uses `allDates.indexOf(m.acquiredAt)` which could miss ties (same-timestamp cards from same pack). Should use sorted-position accounting for ties.
- Journey Timeline well-scoped: top-5 with expand, staggered animation, relative timestamps, "Nd held" header
- DIRECTIVE-004 is the largest single-dimension jump so far (Provenance 2→7)

## Weakest Dimension
Social Proof (5/10). Origin Badges and Journey Timeline are private — only the card owner sees them. "Genesis" means nothing if you can't show it off. DIRECTIVE-005 (achievement badges + collector profile) is correctly queued to address this. Until a shareable profile or public showcase exists, Social Proof remains the ceiling.

## Cross-Product Signal
**Origin Badge priority system** (Genesis > OG > Veteran > Pristine) maps directly to Top Shot's "First Mint" and "TSD Debut" badges. Deterministic computation from acquisition metadata, no new storage schema, priority-ranked display. When LoreVault moves on-chain, `getOriginBadge()` becomes a view function reading contract state with zero refactoring of the display layer.

## Deploy URL
https://lorevault-site-ma3li03q9-ros-projects-9a9bb0c9.vercel.app
