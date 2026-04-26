# Cycle 44 — Track C (BS-1 card detail: 404 fix + bs1-adapter)
**Started:** 2026-04-26T21:15:00Z
**Ended:** 2026-04-26T21:35:00Z
**Track-selection rule matched:** Rule #4 — Y5 (OPS) below floor; critical bug fix blocking Day-1 funnel
**Frigga consulted this cycle:** no
**Odin consulted this cycle:** no

## WHAT

Bug fix: `/v2/card/[id]` previously generated static params only for the 5 marquee V2Cards (lib/v2/cards.ts). The set page (/v2/set/bs1) and today page (/v2/today) both link to LATTICE_CARDS IDs (bs1-c01..bs1-c12, bs1-r01..r05, bs1-l01..l02, bs1-u01). All 20 of those links returned 404.

**Fix:**

1. **`src/lib/v2/bs1-adapter.ts`** (new) — Converts LATTICE_CARDS entries to full V2Card objects. Tier conversion (titlecase → lowercase), mint serial labels per tier, shell passthrough, stubbed council layers (tier-appropriate generic Baker Street stubs, CouncilToggle is collapsed by default). `adaptLatticeCard()`, `getLatticeCardAsV2()`, `listLatticeCardsAsV2()` exports.

2. **`src/app/v2/card/[id]/page.tsx`** (update) — `generateStaticParams` now returns 25 paths (5 V2Cards + 20 BS-1 base cards, deduplicated). `getCard(id) ?? getLatticeCardAsV2(id)` fallback pattern. All 25 paths use the same `CardDetailPage` chassis.

## BUILD

GREEN. `/v2/card/[id]`: 3 shown + [+22 more paths] = 25 total SSG paths. No errors.

## WHY

The Day-1 funnel shipped in cycles 42–43 (set page + reveal page) was broken by this bug — every card click from the set page went to 404. The fix closes the funnel and makes every BS-1 card fully inspectable via the card detail page with pull quote, lore note, metadata chips, and council toggle.

## PROOF

- Build output: [+22 more paths] — 25 total paths confirmed
- 0 errors, 0 warnings
- No spend ($0)

## ALTERNATIVE — Track D considered and rejected

Buffer complete through June 17; no urgency. This was a critical blocking bug.

## NEXT

Cycle 45: Y5 remediation continues. Set page links to /v2/set/bs1. Today page links to /v2/card/[id] ✓. Funnel now fully functional. Next priority: frigga:brief if skill available, or Track G (BS-1 Council-lock brief to accelerate Odin approval).
