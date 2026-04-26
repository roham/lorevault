# Cycle 25 — Track A (bs1-r01 Rare Parallels × 4)
**Started:** 2026-04-26T04:05:00Z
**Ended:** 2026-04-26T04:25:00Z
**Track-selection rule matched:** Rule 2 (Track A — Rare parallels are next pending Y1 work). Cycle 24 ran Track D; eligible tracks include A. Rare parallels begin at bs1-r01 per §8 card-order priority.
**Frigga consulted this cycle:** no — frigga:brief skill not available in this session
**Odin consulted this cycle:** no — odin:odin skill not available in this session

## WHAT

Track A cycle 25: bs1-r01 "V.R. in the Plaster" — 4 Rare-tier parallel variants via FLUX 1.1 Pro Ultra / Replicate. All 8 pre-commission gate checks passed for each variant before generation. Rare tier: 4/20 complete.

**Variants generated:**

1. **bs1-r01-arcana** — ARCANA parallel. Modest-scale mandala (Rare density, per §2 rubric: "modest, glowing gold"), alchemical sigils made explicit in wallpaper pattern around bullet-holes, gaslight-gold aurora through window. The base art's "accidental geometry" is now fully revealed. 144KB. 10.7s.

2. **bs1-r01-aether** — AETHER parallel. The 221B sitting-room wall falls away to a gold-amber cosmic nebula; the "V.R." bullet-holes open into the cosmos; divine gold particulate drifts from the holes; cosmic god-rays through the opened wall. Holmes stands before the letters, small against what the shooting has opened. 534KB at q85 → 304KB at q70 (AETHER q70 fallback pattern, consistent with bs1-l02-aether at 657KB→379KB).

3. **bs1-r01-witness** — WITNESS parallel. Forensic photorealism — Roger Deakins cinematography register. Every material at photographic resolution: plaster dust, service revolver blued-steel surface, fresh bullet-hole spatter pattern, aged wallpaper tear pattern. No Alvinized light. Documentary camera angle. 241KB. 10.2s.

4. **bs1-r01-neon** — NEON parallel. **Required standalone 2040s prompt** — the combined Victorian-base + NEON block (3,486 chars) consistently triggers NSFW detection at safety_tolerance 5 (error: "NSFW content detected"). Root cause: the base prompt's explicit revolver/shooting language combined with the NEON block's "analogue of the lowered revolver with gun-smoke" and "cracked-glass damage pattern — like bullet-holes" creates a combined signal that exceeds the filter threshold. Fix: wrote a standalone 2040s-recontextualized base prompt for the NEON variant that establishes Holmes directly in the 2040s setting (precision laser tool, smart-glass panel, city neon) without Victorian-era gun language. Test probes confirmed the condensed and full 2040s versions pass the filter. 322KB. 12.2s.

**NEON prompt doctrine note:** For any Rare card where the base art involves explicit Victorian firearms (revolver, rifle, shots fired), the NEON parallel should use a standalone 2040s-recontextualized base prompt rather than combining the Victorian base with the NEON block. The NEON setting transposition is total enough that the Victorian base adds no useful compositional information and risks filter collision.

## WHY

Rare parallels are the next Y1 parallel coverage gap (16/32 complete after cycles 20–23; 20/32 pending, all Rare). Track A continues at 4 variants/cycle per §8 rate-limit. bs1-r01 is card-order first among Rare Moments. The §4 ARCANA audit from cycle 24 was resolved: the base prompt's "accidental geometry" language is naturalistic (not literal sacred geometry), so the ARCANA parallel's explicit mandala is a clear visual upgrade regardless of base art output.

## PROOF

- `public/prototype-art/bs-1-221b/bs1-r01-arcana/v1.webp` — 144KB ✓
- `public/prototype-art/bs-1-221b/bs1-r01-aether/v1.webp` — 304KB (q70) ✓
- `public/prototype-art/bs-1-221b/bs1-r01-witness/v1.webp` — 241KB ✓
- `public/prototype-art/bs-1-221b/bs1-r01-neon/v1.webp` — 322KB ✓
- `public/prototype-art/manifest.json` — 36 total entries
- `lorevault-wiki/taste/ART-DIRECTION-COMMISSIONING-DOCTRINE.md` — §7 bs1-r01 rows 4/4 complete; Rare 4/20; total remaining 31 (28 pending / 3 council-blocked)
- `lorevault-wiki/strategy/YARDSTICK-STATE.md` — cycle 25 row added
- `/opt/rebirth-daemon/spend-ledger.jsonl` — 4 entries at $0.04 = $0.16
- Build: NOT triggered (art + wiki only; no src/ changes)
- Total spend this cycle: $0.16

## NEXT

Cycle 26 → Track A. bs1-r02 "The Street Deduction" × 4 parallels (ARCANA, AETHER, WITNESS, NEON). Rare tier will be 8/20 after cycle 26.
Note for NEON: bs1-r02 subject is Holmes at a Baker Street window observing the street — no explicit firearms in the base prompt. Victorian base + NEON block should not trigger the filter. If it does, apply the standalone-2040s-base pattern documented above.
