# Cycle 17 — Track C (/v2/card/[id] — Day-1 Funnel Hook)
**Started:** 2026-04-26T00:52:25Z
**Ended:** 2026-04-26T01:07:00Z
**Track-selection rule matched:** Rule 8 (default → weakest yardstick among eligible tracks). Last 4 cycles: 13(E), 14(A), 15(B), 16(G). Eligible: C, D, F, H. Y4 (IA) is below Target but above Floor — Track C advances it. Jonathan's Journal launches May 3 (7 days) — Day-1 funnel must be live.
**Frigga consulted this cycle:** no — frigga:brief skill not available in this session
**Odin consulted this cycle:** no — odin:odin skill not available in this session

## WHAT

Shipped `/v2/card/[id]` — the card detail page as the Day-1 funnel hook per R2 §5 Hook Ladder.

**Files created/modified:**

1. **`src/lib/lattice-cards.ts`** — Shared module with all 20 BS-1 card definitions (type `LatticeCard`, array `LATTICE_CARDS`, helper `getCardById`). Cards extracted from the inline data in today/page.tsx.

2. **`src/app/v2/card/[id]/page.tsx`** — Dynamic route page. Uses Next.js 16 App Router conventions: `params: Promise<{ id: string }>`, `await params` in async server component. Implements `generateStaticParams()` to prerender all 20 cards as SSG. Features:
   - Card image (260px max, 2:3 aspect, `fill` + `sizes`)
   - Card name + set + tier + shell with `TIER_LABEL` map (Common, Rare ◆, Legendary ◆◆, Ultimate ◆◆◆)
   - Flavor text + attribution (border-l indent)
   - Echo element section in a framed box (`border border-[#1a1815]`) — the iceberg lore-note highlighted
   - Trust contract line: "You are reading iceberg lore that has never been publicly confirmed."
   - Journal subscription CTA reusing `SubscribeForm` component from `/v2/journal/`
   - "Today on the Lattice →" navigation link
   - `notFound()` for unknown IDs

3. **`src/app/v2/today/page.tsx`** — Added "Read the full iceberg →" link to `/v2/card/{card.id}` after the Lampblack Detail section. Creates the daily funnel: /v2/today → /v2/card/[id].

4. **`src/app/v2/page.tsx`** — Hero card image+caption wrapped in `Link href="/v2/card/bs1-c01"`. Added "Read the iceberg →" hover text on caption. Creates the home funnel: /v2 → /v2/card/bs1-c01.

**Build output**: `/v2/card/[id]` prerendered as SSG (●) for all 20 BS-1 paths. Build GREEN.

## WHY

R2 §5 Hook Ladder Day 1: "user taps a Universe tile from /lattice and lands on a Set teaser. Surface: /card/[id]... Ask: read the iceberg lore-note. Conversion: sees one Echo element highlighted; page offers 'subscribe to Jonathan's Journal, free, daily.' ~40% take it. This is our only Day-1 funnel target."

Jonathan's Journal launches May 3, 2026 — 7 days from today. The Day-1 conversion path must be live before the launch, because the launch traffic lands at /v2 (from email links, social posts, Dracula Daily cross-promotion). Without the card detail page, any user who taps the hero card hits a dead end.

Y4 (IA) advances: 5 /v2 routes now live. A visitor landing on /v2 can navigate to /v2/lattice, /v2/today, /v2/journal, or (via hero card) /v2/card/[id]. The Day-1 path is fully connected.

Trust contract line on the Echo element section fulfills R2 §6 Driver 6 (Trust Contract surfaced): "You are reading iceberg lore that has never been publicly confirmed." This is the first time the Trust Contract appears in the UI.

## PROOF

- `src/app/v2/card/[id]/page.tsx` — created, 20 SSG paths prerendered
- `src/lib/lattice-cards.ts` — created, 20-card BS-1 dataset
- `src/app/v2/today/page.tsx` — "Read the full iceberg →" link added
- `src/app/v2/page.tsx` — hero card linked to /v2/card/bs1-c01
- Build: GREEN (● SSG for all /v2/card/* paths)
- Routes live: 5 (/v2, /v2/today, /v2/lattice, /v2/journal, /v2/card/[id])
- No spend ($0 — no image generation)

## NEXT

Cycle 18 → Track D. Last 4 cycles: 14(A), 15(B), 16(G), 17(C). Eligible: D, E, F, H.

Y3 Deep is the weakest below-floor yardstick with an eligible track: 3 Deep threads implied vs 16 floor. Track D (CONTENT — long-form lore) addresses Y3 directly. Target: draft additional Jonathan's Journal installments (May 11-15, covering more GH-1 Gothic Horror episodes and adding BS-1 Deep thread annotations to the iceberg registry). This advances Y3 (more Deep threads) and pre-stages R2 Beat A content.

Alternative: Track E is eligible (not run since cycle 13). Beat B (Today on the Lattice) is live. Beat A (Jonathan's Journal landing) is live. Beat C (Sample tickets / earned pack counter) not yet built — Track E next run should address Beat C to advance Y5.

Rule 4 check at cycle 18: Y3 Deep BELOW FLOOR → Track D is correct by Rule 4 (remediate below-floor yardstick).
