# Real GDD — Spec Review

**Run:** `LV-MLP / Track A / Stage A.5`
**Date:** 2026-04-28
**Reviewer posture:** Spec-checklist pass. Each item asks: is this present, in which file, and does it pass on substance, not just on label?

Verdict format per row: `PASS` / `FAIL` / `PARTIAL` followed by file path and citation.

---

## Section presence

| § | Title | File | Verdict |
|---|---|---|---|
| 01 | Executive Summary | `src/components/gdd-real/sections/01-executive-summary.tsx` | PASS |
| 02 | Core Loop | `src/components/gdd-real/sections/02-core-loop.tsx` | PASS |
| 03 | Economy & Monetization | `src/components/gdd-real/sections/03-economy.tsx` | PASS |
| 04 | Rarity & Supply | `src/components/gdd-real/sections/04-rarity-supply.tsx` | PASS |
| 05 | Sets, Series, Panes | `src/components/gdd-real/sections/05-sets-series-panes.tsx` | PASS |
| 06 | Pack Mechanics | `src/components/gdd-real/sections/06-pack-mechanics.tsx` | PASS |
| 07 | Marketplace | `src/components/gdd-real/sections/07-marketplace.tsx` | PASS |
| 08 | Progression Systems | `src/components/gdd-real/sections/08-progression.tsx` | PASS |
| 09 | Challenges & Events | `src/components/gdd-real/sections/09-challenges.tsx` | PASS |
| 10 | Games with Collectibles | `src/components/gdd-real/sections/10-games.tsx` | PASS |
| 11 | Social Surface | `src/components/gdd-real/sections/11-social-surface.tsx` | PASS |
| 12 | Onboarding | `src/components/gdd-real/sections/12-onboarding.tsx` | PASS |
| 13 | Retention Loops | `src/components/gdd-real/sections/13-retention.tsx` | PASS |
| 14 | Atlas Integration Story | `src/components/gdd-real/sections/14-atlas-integration.tsx` | PASS |
| 15 | Roadmap & MLP Boundary | `src/components/gdd-real/sections/15-roadmap.tsx` | PASS |
| 16 | Glossary | `src/components/gdd-real/sections/16-glossary.tsx` | PASS |
| 17 | Cross-Reference to the Lore Doctrine | `src/components/gdd-real/sections/17-cross-reference.tsx` | PASS |

All 17 sections present in `src/components/gdd-real/sections/`. Composed in numerical order in `src/components/gdd-real/GDDRealContent.tsx`. Routed in `src/app/v3/gdd-real/page.tsx`.

---

## Atlas spec → § 14 transfer

Every primitive named in `_atlas-spec.md` (the 10-primitive matrix) is referenced in § 14 (Atlas Integration Story) with its verdict transferred. Spot-check:

| Atlas primitive | § 14 reference | Verdict |
|---|---|---|
| Custodial wallet (Dapper Wallet) | "The Dapper Wallet is inherited directly. The visitor never sees a seed phrase…" | PASS |
| Fiat on-ramps (Apple Pay / CC / Balance) | "Apple Pay and credit-card on-ramps are inherited directly…" | PASS |
| Flow blockchain + Cadence | "Flow blockchain and Cadence smart contracts are inherited directly. Every LoreVault card is a Cadence resource…" | PASS |
| Pack mechanics service | "Per-pack reveal pacing hook" in negotiation list | PASS |
| Secondary marketplace | "Pane attribution as a first-class marketplace facet" + "translation-scar rendering" + "contraband badging" in negotiation list | PASS |
| Leaderboards | "Custom leaderboard semantics support" in negotiation list | PASS |
| User identity + KYC | "KYC is inherited directly, triggered only at the Travel-Rule threshold or at Tier-3 contributor onboarding" | PASS |
| CDN | "The CDN is inherited directly. The asset pipeline … is Track-D's job; delivery and edge-caching are Atlas's." | PASS |
| Quest engine | (Adapted vocabulary referenced in § 9 Challenges; Atlas substrate explicit in § 14) | PARTIAL → Acceptable. The quest engine inheritance is implicit in § 14 ("the platform-substrate operational layer") and the LoreVault-built vocabulary is fully explicit in § 9. The two-section split is intentional. |
| Showcase / profile | (Adapted display referenced in § 11 Social Surface; Atlas substrate in § 14) | PARTIAL → Acceptable for same reason. § 11 carries the surface details. |

**Verdict: PASS.** All Atlas primitives transferred. Two are split across § 14 (substrate inheritance) and §§ 9 / 11 (LoreVault adaptation), which is correct architectural separation.

---

## Top Shot mechanics canon → GDD section transfer

Every mechanic from `_topshot-mechanics-canon.md` (the 10-mechanic matrix) is transferred to its mapped GDD section.

| Top Shot mechanic | Verdict | GDD section | Transfer present? |
|---|---|---|---|
| 1. Pack mechanics + rarity tiers + FOMO | Adapt | §§ 4, 6 | PASS — § 4 documents the LoreVault rarity bands; § 6 documents the four-state drop machine and iceberg-slow Legendary reveal |
| 2. Set / Series / Run hierarchy | Adapt | § 5 | PASS — § 5 documents the Tentpole-Adjacent-Foil-Wildcard archetype mix and Pane-grammatical Set definition |
| 3. Marketplace UX | Adopt + Adapt | § 7 | PASS — § 7 documents listing, offer, floor, Smashable Floor, Pane-attribution facet, translation-scar, contraband badging |
| 4. Quests | Adapt | § 9 | PASS — § 9 documents daily, weekly (Wednesday anchor), seasonal, set-completion, cross-Pane, contraband-hunt, Lampblack challenges |
| 5. Predictions / Picks | Adapt — MLP pick | § 10 | PASS — § 10 names Predictions as the MLP pick and documents the cross-Pane axiom-conflict mechanic with narrative-scar overlay |
| 6. Spotlight | Adapt | § 11 | PASS — § 11 documents the Footnoter's Letter as the editorial Spotlight surface |
| 7. Showcases + profile | Adopt + Adapt | § 11 | PASS — § 11 documents Pane-organization mode, contributor-credit row, provenance-as-narrative |
| 8. Leaderboards | Reject — rebuild | § 8 | PASS — § 8 documents the five LoreVault leaderboards (Pane-Mastery, Contraband-Hunter, Pierre-Menard, Lampblack-Reader, Contributor) and the rejection rationale |
| 9. Wallet onboarding | Adopt | § 12 | PASS — § 12 documents the no-seed-phrase no-wallet-prompt path; § 14 names Dapper Wallet inheritance |
| 10. Secondary fee structure | Adopt + Adapt | §§ 3, 7 | PASS — § 3 documents the 5% take with Contributor Pool; § 7 documents the on-display fee rendering at listing time |

**Verdict: PASS.** All 10 mechanics transferred to their mapped sections.

---

## MLP boundary explicit in § 15

§ 15 (Roadmap & MLP Boundary) contains:
- **V1 ships** — seven primitives named explicitly: pack drops + opening ritual, set completion tracker, secondary marketplace, daily/weekly challenges, progression tier 0-1, Pane taste onboarding, Prediction game. Plus profile + Showcase, Footnoter's Letter.
- **V2 defers** — five+1 features named: Tier 2-4 participation, Pierre-Menard dedicated demo, cross-Pane challenges, Tarot-narrative game, full leaderboard service, seasonal mastery pass, open fan submissions.
- **Research-only** — three candidates explicitly cut: full fantasy-game integration, deck-building battle game, mobile native app.

Each cut carries a doctrine-bound rationale. **Verdict: PASS.**

---

## Glossary completeness

§ 16 defines: Pane, Pack, Drop, Series, Set, Run, Serial, Low-Mint, Smashable Floor, Lampblack, Iceberg-2:1:8, Contraband, Translation-Cost, Apocrypha, Tier 0-4, Pierre-Menard, Tentpole Pane, Adjacent Pane, Foil Pane, Wildcard Pane, Prediction, Footnoter, Mosaic Test, Footnote Test, Prose-Signature Test, Contributor Pool, Narrative-Scar.

Spot-check: every term used in §§ 1-15 with capitalization or italics indicating product-specific vocabulary appears in § 16. **Verdict: PASS.**

---

## Cross-reference (§ 17) — every section mapped

Spot-check: each of §§ 1-16 is referenced in § 17 with at least one doctrine-source citation (diff-NN, new-NN, or reframe-NN).

- § 1 → diff-01, new-01, new-03 ✓
- § 2 → diff-01, new-01 ✓
- § 3 → diff-03, diff-10, reframe-07 ✓
- § 4 → diff-05, diff-03, OPUS § 7 ✓
- § 5 → diff-01, diff-02, diff-04 ✓
- § 6 → diff-06, new-01, diff-05 (Mirrlees) ✓
- § 7 → diff-03, diff-07, reframe-07 ✓
- § 8 → new-03, diff-09 ✓
- § 9 → diff-09, new-03, diff-03 ✓
- § 10 → new-03, diff-07 ✓
- § 11 → new-03, reframe-05 ✓
- § 12 → new-01, diff-05 ✓
- § 13 → diff-09, diff-07, diff-10 ✓
- § 14 → operationalizes doctrine for Atlas ✓
- § 15 → diff-09, diff-10 ✓
- § 16 → aggregates ✓

**Verdict: PASS.**

---

## Component / file checklist

| Item | Verdict | Location |
|---|---|---|
| `shared.tsx` re-exports gdd-v2 atoms | PASS | `src/components/gdd-real/shared.tsx` |
| `GDDRealContent.tsx` composer (imports + renders 17 sections in order) | PASS | `src/components/gdd-real/GDDRealContent.tsx` |
| `page.tsx` with metadata, hero, banner, TOC, footer | PASS | `src/app/v3/gdd-real/page.tsx` |
| `LAST_UPDATED = '2026-04-28'` | PASS | `src/app/v3/gdd-real/page.tsx` line 13 |
| TOC has all 17 entries | PASS | `src/app/v3/gdd-real/page.tsx` SECTIONS array |
| Cross-link to /v3/gdd-v2 in header + banner + footer | PASS | `src/app/v3/gdd-real/page.tsx` |
| `_atlas-spec.md` | PASS | `src/app/v3/gdd-real/_atlas-spec.md` |
| `_topshot-mechanics-canon.md` | PASS | `src/app/v3/gdd-real/_topshot-mechanics-canon.md` |
| `_gdd-template.md` | PASS | `src/app/v3/gdd-real/_gdd-template.md` |
| `_spec-review.md` | PASS | this file |
| `_quality-review.md` | PASS | `src/app/v3/gdd-real/_quality-review.md` |

---

## Verdict — Spec Review

All 17 sections present and on substance. Atlas spec primitives transferred to § 14 with explicit verdicts; all 10 Top Shot mechanics transferred to their mapped GDD sections; MLP boundary explicit in § 15 with V1/V2/research-only cut list; glossary covers every product-specific term used in §§ 1-15; cross-reference index in § 17 maps every GDD section to its doctrinal source.

**Spec Review: PASS.**
