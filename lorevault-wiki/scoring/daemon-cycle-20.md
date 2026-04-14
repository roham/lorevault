# Daemon Cycle 20 — DIRECTIVE-010 Scoring

## Directive: Card DNA — Procedural Visual Identity
- **Commit**: c279330
- **Version**: v8.30
- **Date**: 2026-04-14

## Acceptance Criteria Check

- [x] `src/lib/card-dna.ts` exists with seeded PRNG (`hashCode` + `seeded` LCG)
- [x] 12 background patterns defined (`BACKGROUND_PATTERNS`, confirmed count)
- [x] 8 border motifs defined (`BORDER_MOTIFS`, confirmed count)
- [x] 6 particle types defined (`PARTICLES`, confirmed count)
- [x] 20 watermark glyphs defined (`WATERMARK_GLYPHS`, confirmed count)
- [x] 6 card-back variants defined (`CARD_BACK_VARIANTS`, confirmed count)
- [x] Seed combines `cardId` + `serialNumber` (`hashCode(cardId) + serialNumber * 31`)
- [x] `DNAOverlay` component renders background pattern SVG at 4% opacity
- [x] Hue-shift blend applied via CSS filter + mix-blend-mode layer
- [x] Border gradient overlay applied
- [x] Watermark glyph rendered (lg/xl sizes only)
- [x] `DNAOverlay` applied to `CardItemStatic` and `CardItemInteractive`
- [x] `DNAOverlay` skipped on `size === 'sm'`
- [x] DNA trait strip in `card/[id]/page.tsx` showing Background / Border / Particle labels
- [x] Watermark icon displayed in trait strip
- [ ] Card-back variant surfaced in UI — `cardBack` computed but never rendered

## Dimension Scores

| # | Dimension | Before | After | Δ | Rationale |
|---|-----------|--------|-------|---|-----------|
| 1 | Scarcity Gradient | 9 | 9 | 0 | DNA is scarcity-agnostic — no change to rarity mechanics |
| 2 | Visual Polish | 9 | 9 | 0 | DNAOverlay adds texture but at very low opacity; holds at 9 |
| 3 | Social Proof | 8 | 8 | 0 | DNA traits visible only to card owner, no social surface |
| 4 | Narrative Depth | 9 | 9 | 0 | Thematic trait names (Runes, Nebula, Aurora) are lore-consistent |
| 5 | Temporal Weight | 8 | 8 | 0 | DNA is static from creation — no temporal dimension |
| 6 | Loss Aversion | 8 | 8 | 0 | Subtly increases attachment but too ambient to move needle |
| 7 | Utility Loop | 8 | 8 | 0 | DNA is passive display, no engagement action |
| 8 | Instance Identity | 8 | 9 | +1 | 576+ visual combinations from seeded genome. Detail page DNA strip. |
| 9 | Discovery Thrill | 9 | 9 | 0 | DNA assigned deterministically, no reveal moment |
| 10 | Completion Drive | 9 | 9 | 0 | No new collection axis for DNA traits yet |

## Total: 91/100 (was 90)

Instance Identity: 8 → 9 (+1). All other dimensions hold.

## Issues Found

1. **SVG pattern ID collision** (High): `DNAOverlay` uses `id={dna-bg-${dna.background.id}}` — only 12 unique IDs. Multi-card views get duplicate DOM IDs, browsers resolve to first match. Fix: use card ID or `useId()` in pattern ID.
2. **Hue-shift blend layer no-op** (Medium): Empty div with `mix-blend-mode: color` at 15% opacity produces no visible effect. Needs explicit background color.
3. **`cardBack` trait dead code** (Medium): Computed but never rendered. Six card-back variants exist in data but absent from UI and CSS vars.
4. **`getDNATraitString` imported but unused** (Low): Dead import in card detail page.
5. **Watermark 3% opacity below perceptible threshold** (Low): Raise to 6-8% for ghost watermark to register.
