# Cycle 20 — Track A (bs1-u01 Ultimate Parallel Art)
**Started:** 2026-04-26T02:00:00Z
**Ended:** 2026-04-26T02:18:00Z
**Track-selection rule matched:** Rule 3 (eligible track not run in 5+ cycles). Track A last ran cycle 14 (6 cycles ago). BS-1 Ultimate parallels were the highest-priority pending items per §8 of ART-DIRECTION-COMMISSIONING-DOCTRINE.md.
**Frigga consulted this cycle:** no — frigga:brief skill not available in this session
**Odin consulted this cycle:** no — odin:odin skill not available in this session

## WHAT

Track A cycle 20: 4 bs1-u01 Ultimate parallel variants + manifest parallel field correction.

**Step 0 — Manifest parallel field correction (§3 of doctrine):**
All 20 base art manifest entries had incorrect `"parallel"` values (ARCANA or WITNESS). Corrected all 20 to `"parallel": "BASE"` via node script. This is a data fix, not a regeneration. Pre-dates any parallel generation.

**Step 1 — Pre-commission gate §5 (all 8 checks for each variant):**
- Card identity: bs1-u01, bs-1-221b, Ultimate, ARCANA/AETHER/WITNESS/NEON ✅
- Tier-parallel compatibility: Ultimate = Rare+ ✅ for all parallels
- Density class: MAXIMALIST (Ultimate tier) ✅
- Parallel signature audit: each variant's block has all 4 required elements ✅
- Lampblack: Silhouette (tall gaunt hawkish Holmes + squared Watson), Props (handshake + notebook), Gesture (first deduction moment-after), Spine (solves via observation / chronicles) ✅
- Universe DNA: Baker Street gaslight/Victorian/Paget/Sargent ✅
- Provider: replicate, FLUX 1.1 Pro Ultra, PNG→WebP, 2:3 ✅
- Manifest state: entries created as new pending → now complete ✅

**Step 2 — Generation results:**

| Variant | Parallel | Size | Time | Status |
|---|---|---|---|---|
| bs1-u01-arcana | ARCANA | 130KB | 9.9s | ✅ |
| bs1-u01-aether | AETHER | 231KB | 12.5s | ✅ |
| bs1-u01-witness | WITNESS | 321KB | 13.1s | ✅ |
| bs1-u01-neon | NEON | 277KB | 10.0s | ✅ |

All 4 succeeded. All ≤500KB. $0.16 total.

**Files created:**
- `public/prototype-art/bs-1-221b/bs1-u01-arcana/v1.webp`
- `public/prototype-art/bs-1-221b/bs1-u01-aether/v1.webp`
- `public/prototype-art/bs-1-221b/bs1-u01-witness/v1.webp`
- `public/prototype-art/bs-1-221b/bs1-u01-neon/v1.webp`
- `scripts/gen-bs1-cycle20.mjs`

**Files updated:**
- `public/prototype-art/manifest.json` — 20→24 entries; all 20 BASE entries parallel field corrected
- `lorevault-wiki/taste/ART-DIRECTION-COMMISSIONING-DOCTRINE.md` — §7 Ultimate parallel status updated to complete; summary updated
- `lorevault-wiki/strategy/YARDSTICK-STATE.md` — cycle 20 row added

## WHY

Ultimate parallels are the highest-rarity items in the BS-1 commissioning manifest and earn the highest priority per §8. The bs1-u01 Ultimate is the iconic first meeting of Holmes and Watson — the Spine event that every collector will want in all variants. These 4 pieces complete the bs1-u01 product (the ONE-OFF is council-blocked; the 4 non-ONE-OFF parallels are now done).

The WITNESS variant is particularly important: it demonstrates the doctrine's core argument — that the same scene can be mythologized (ARCANA/AETHER) or de-mythologized (WITNESS) as a product line, with the WITNESS parallel serving collectors who want maximum photo-real documentation rather than artistic mythologizing. The NEON variant demonstrates the Lampblack survival principle: the handshake is unchanged despite 2040s context.

The manifest field correction was load-bearing: without it, any system reading the manifest would incorrectly classify base-card art as parallel variants. This produces downstream errors in pack selection logic, rarity display, and parallel surface routing.

## PROOF

- `public/prototype-art/bs-1-221b/bs1-u01-{arcana,aether,witness,neon}/v1.webp` — 4 files
- `public/prototype-art/manifest.json` — 24 entries; all 20 BASE entries corrected
- `scripts/gen-bs1-cycle20.mjs` — generation script with full pre-commission gate commentary
- `lorevault-wiki/taste/ART-DIRECTION-COMMISSIONING-DOCTRINE.md` — §7 Ultimate parallels: 4/4 ✅
- $0.16 spend (4 × $0.04 FLUX 1.1 Pro Ultra)
- Build: NOT triggered (art assets + wiki only; no Next.js code changes)

## NEXT

Cycle 21 → Track D. Last 4 cycles: 18 (D), 19 (E), 20 (A), 21 eligible.

Y3 Deep is BELOW FLOOR (8 implied vs 16 floor). Track D ran cycle 18 (3 cycles ago) — eligible by Rule 3. The next Track D targets: more Deep threads across BS-1 (have 4 within-BS1 + 1 within-GH1 + 1 cross-Pane; need 8 more to reach floor). Approach: now that the 4 Ultimate parallel variants exist, there are new cross-parallel Deep threads to register (Base vs ARCANA vs WITNESS — the same Spine event across visual registers).

Alternative: Track A again (28 remaining parallel pieces for Legendary and Rare). Rule 4 does not override Rule 3 here — Track D is more overdue by yardstick deficit. Track D cycle 21.
