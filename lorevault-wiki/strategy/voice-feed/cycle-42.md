# Voice Feed — Cycle 42 Track C
**Date:** 2026-04-26
**Track:** C — Surface (Y5 remediation)
**Surface shipped:** `/v2/set/[id]` — Set landing page, BS-1 "The Argument Pane"
**Route:** Static SSG — `/v2/set/bs1` prerendered
**Y5 movement:** +1 launch-ready surface for BS-1 May 2 drop

---

## What was built

New route `src/app/v2/set/[id]/page.tsx` — the Set landing page for Baker Street Series 1.

**Set identity block:** Universe · Series label, set name "The Argument Pane", tagline, drop date (2 May 2026 · 1pm ET) in tier-ultimate gold.

**Rarity distribution chips:** inline badges showing tier × count (Ultimate × 1, Legendary × 2, Rare × 5, Common × 12) — confirms to the visitor that the set is already 100% rendered and described.

**Card grid by tier (Ultimate → Common):** 2-column grid per tier. Each card uses the canonical tier-frame CSS class (tier-frame-ultimate, tier-frame-legendary, tier-frame-rare, tier-frame-common) from v2-tokens.css. All cards link to `/v2/card/[id]`. Data from LATTICE_CARDS (the canonical 20-card BS-1 source).

**Pack pricing table:** 5 pack tiers per Phase 9 spec: Sample ($0, live link to /v2/open), Standard ($9), Curated ($49), Premium ($199), Apex ($999). Purchase flow rows show as muted/inactive; note "live at Series 1 launch · 2 May 2026." Sample row is fully live and linked.

**Home page link added:** `src/app/v2/page.tsx` updated — "First Drop · 2 May 2026 / Baker Street · BS-1 · The Argument Pane →" CTA block inserted between the Pane nav and the Marquees section. Hover shows tier-ultimate amber arrow.

## Design decisions

- Used CSS variable tokens throughout (`var(--color-v2-ground)`, `var(--color-tier-*)` etc.) for consistency with the Phase 4 design system, not hardcoded hex values.
- Tier-frame CSS classes applied directly to card image containers — the tier-frame glows distinguish Ultimate/Legendary from Rare/Common in the grid at a glance.
- Pack pricing shows all 5 tiers even though only Sample is live — gives the visitor a complete picture of what drops on May 2.

## Build result

GREEN. `/v2/set/bs1` in build output as SSG. 0 errors, 0 warnings.
