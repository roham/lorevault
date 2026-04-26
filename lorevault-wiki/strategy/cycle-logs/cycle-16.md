# Cycle 16 — Track G (CEO Directive: Art Direction & Commissioning Doctrine)
**Started:** 2026-04-26T00:31:00Z
**Ended:** 2026-04-26T00:37:25Z
**Track-selection rule matched:** Rule 3 (Council directive in last 24h → execute). HANDOVER.md pushed by human with verbatim CEO directive: "Do not generate any new card art until an Art Direction Review document exists and has gated the commissioning."
**Frigga consulted this cycle:** no — frigga:brief skill not available in this session (last cycle: -10; 26+ cycles overdue)
**Odin consulted this cycle:** no — odin:odin skill not available in this session (last cycle: -100; 116+ cycles overdue)

## WHAT

Produced `lorevault-wiki/taste/ART-DIRECTION-COMMISSIONING-DOCTRINE.md` — the Art Direction & Commissioning Doctrine that gates all future Track A image commissioning.

**Doctrine covers:**

1. **The Problem** — ARCANA overprevalence: the sacred-geometry mandala aesthetic was leaking into base art and Common-tier cards because it had been noted favorably. Prevention: ARCANA is a PARALLEL, not a house style. Its power depends on scarcity.

2. **Tier-Density Rubric (§1)** — Four density classes:
   - Common (PLAIN): single subject, immediate environment, no parallel-register elements, one anchor object, no Alvinized light
   - Rare (MODERATE): one distinctive compositional element, atmospheric environment, one Alvinized light permitted, two iconographic layers
   - Legendary (RICH): full environmental storytelling, multiple Alvinized sources, three iconographic layers, Struzan/Ross register
   - Ultimate (MAXIMALIST): all compositional techniques deployed, full Alvinized treatment on the central gesture, three-timescale legibility

3. **Parallel Reservation Rules (§2)** — Five parallels, each exclusively reserved:
   - BASE: painterly-epic, no parallel signatures, all tiers
   - ARCANA (Rare+): mandala + sigils + filigree + universe-toned aurora. FORBIDDEN on Common, non-ARCANA parallels, base art.
   - AETHER (Rare+): nebulae + divine particulate + god-rays + cosmic scale. Reserved.
   - WITNESS (Rare+): photoreal documentary, Deakins/Lubezki, practical light only. Reserved.
   - NEON (Rare+): cyber/synthwave, 2040s, Lampblack survives shell change. Reserved.
   - ONE-OFF (Legendary/Ultimate): Council review required; daemon does not auto-generate.

4. **Manifest Parallel Field Correction (§3)** — All 20 BS-1 base art manifest entries have incorrect parallel values (set during v6 MODE taxonomy era). Correct to `"parallel": "BASE"` next Track A cycle.

5. **ARCANA Overprevalence Audit (§4)** — Reviewed all 20 existing BS-1 base art prompts. Three borderline cases identified:
   - bs1-c05: shadow detail is fine (narrative hidden detail, not sigil)
   - bs1-r01: "mandala" word in prompt is borderline; visual review required before ARCANA parallel commission
   - bs1-r04: "ARCANA geometry" is flavor text for a compositional choice; not a visual parallel treatment

6. **Pre-Commission Gate (§5)** — 8-point checklist that Track A MUST pass before every image commission:
   - Card identity confirmed
   - Tier-Parallel compatibility (Rare+ required for non-BASE parallel)
   - Art-density class assigned
   - Parallel signature audit (FORBIDDEN list scan for base art; REQUIRED list check for parallel)
   - Lampblack check (Silhouette/Props/Gesture/Spine all addressed in prompt)
   - Universe visual DNA confirmed
   - Provider/technical spec confirmed
   - Manifest state updated

7. **FLUX Prompt Templates (§6)** — Tier density modifier blocks + parallel signature blocks for use in Track A prompt construction.

8. **BS-1 Commissioning Manifest (§7)** — Complete table:
   - 20/20 base art: COMPLETE (all manifest parallel fields to be corrected to BASE)
   - 20 Rare parallels: 5 Moments × 4 Parallels = pending
   - 10 Legendary parallels: 2 Moments × 5 (including ONE-OFFs blocked) = 8 pending + 2 council-blocked
   - 5 Ultimate parallels: 1 Moment × 5 (including ONE-OFF blocked) = 4 pending + 1 council-blocked
   - Total remaining: 32 pending + 3 council-blocked
   - Per-parallel prompt template notes for each card included

9. **Track A Gate Enforcement (§8)** — Priority order: Ultimate parallels first, Legendary second, Rare third. Max 4 cards per Track A cycle.

10. **Series-1 Roadmap Scope (§9)** — 380 additional base art pieces + parallels for 19 remaining Sets to be planned in future cycles.

## WHY

Rule 3 (Council directive) matched: HANDOVER.md contains a verbatim CEO directive to produce this doctrine before any further image generation. Track G is the correct track. The prior Track C plan (card detail page) was the correct call under Rule 8 (weakest yardstick) but Rule 3 takes precedence.

The doctrine prevents a real and named failure mode: the ARCANA parallel losing its chase value because the mandala aesthetic was being applied too broadly. Parallel hunt value (the collector hunting ARCANA across all Sets) is one of the core economic mechanics per GAME-ECONOMY-DESIGN-V1.md §4. If ARCANA is everywhere, there is nothing to hunt.

The pre-commission checklist formalizes what was informal: every image commission now has a documented decision record. This is the "Art Director review step" the CEO requested.

## PROOF

- `lorevault-wiki/taste/ART-DIRECTION-COMMISSIONING-DOCTRINE.md` — created, 10 sections
- `lorevault-wiki/strategy/YARDSTICK-STATE.md` — cycle 16 row added
- No build required (wiki-only changes)
- No spend ($0 this cycle — no image generation)

## NEXT

Cycle 17 → Track C. Rule 8 (weakest yardstick → default) with Track G now satisfied. Last 4 cycles: 13(E), 14(A), 15(B), 16(G). Eligible: C, D, F, H.

Track C target: `/v2/card/:id` — the card detail page. This is the Day-1 funnel hook per R2 §5:
- User taps a Universe tile from /lattice, lands on /card/:id
- Surface: card image + flavor text + lore-note (Echo element highlighted)
- CTA: "Subscribe to Jonathan's Journal, free, daily"
- Trust contract line visible
- This is the ONLY Day-1 conversion surface that matters before Jonathan's Journal launches May 3 (7 days away)

Read the Next.js docs before writing any code: `node_modules/next/dist/docs/`
