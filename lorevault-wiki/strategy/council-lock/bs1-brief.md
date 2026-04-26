# BS-1 Council-Lock Brief — "The Argument Pane"

**Prepared by:** rebirth-daemon (cycle 45)
**Date:** 2026-04-26
**Motion:** Ship Baker Street Series 1 on **Saturday 2 May 2026 at 1pm ET**
**Authority required:** Odin-level approval per Decision 1 + Canon Council Seat 1 confirmation
**Status:** READY FOR ODIN REVIEW — submit when `odin:odin` skill available

---

## 1. The Motion

LoreVault ships its first Set. Baker Street · Series 1 · *The Argument Pane* — 20 Moments, Watson-narrated, FLUX-rendered, fully flavored, iceberg-loaded, surfaces live, Day-1 funnel navigable end-to-end. Drop date: Saturday 2 May 2026, 1pm ET (Top Shot collector-time inheritance per Phase 9 §1).

This brief documents the set's readiness across all 7 yardsticks, lists the outstanding items that ship in Phase 2, and requests Council lock-confirmation.

---

## 2. Set Inventory

**20 Moments — Baker Street · BS-1 · PRIME shell**

| Tier | Count | IDs |
|------|-------|-----|
| Ultimate | 1 | bs1-u01 "You Have Been in Afghanistan, I Perceive" |
| Legendary | 2 | bs1-l01 "The Violin at Midnight", bs1-l02 "The Seven-Per-Cent" |
| Rare | 5 | bs1-r01 "V.R. in the Plaster", bs1-r02 "The Street Deduction", bs1-r03 "The Photograph", bs1-r04 "The Case Map", bs1-r05 "The Moriarty Letter" |
| Common | 12 | bs1-c01 "Watson's Arrival" through bs1-c12 "The Gaslight Vigil" |

**Parallels — 32 texts (4 per Rare card × 5 Rares + 4 per Legendary × 2 + 4 for Ultimate = 32 total)**
- ARCANA, AETHER, WITNESS, NEON per eligible card
- All 32 parallel texts authored, Mosaic proxy PASS

**Art — 52 assets total**
- 20 base Moments: FLUX 1.1 Pro Ultra via Replicate, all ≤500KB, all 2:3 aspect ratio
- 32 parallel variants: FLUX 1.1 Pro Ultra, all ≤500KB, all NSFW-clean
- Manifest: `public/prototype-art/bs-1-221b/`

**Flavor text — 52 texts (20 base + 32 parallel)**
- All 20 base cards: Baker Street register, 100% daemon Mosaic proxy PASS
- All 32 parallels: ARCANA / AETHER / WITNESS / NEON register-specific, 100% proxy PASS
- Voice sources: `lorevault-wiki/strategy/voice-feed/cycle-5.md` through `cycle-38.md`

---

## 3. Seven-Yardstick Readiness Report

### Y1 — ART: ✅ AT TARGET
- 20/20 base Moments rendered (FLUX 1.1 Pro Ultra)
- 32/32 parallel variants rendered
- All ≤500KB, all 2:3, all NSFW-clean
- 4 parallel tiers visible in the set grid: Ultimate glow, Legendary double-border, Rare halo, Common flat

### Y2 — FLAVOR (Mosaic): ✅ AT TARGET
- 20/20 base cards: flavor text + lore-note, 100% proxy PASS
- 32/32 parallels: register-specific flavor, 100% proxy PASS
- Baker Street Watson-chronicling register confirmed across all 20 base cards
- Baseline was 44% (prior corpus); current 100% proxy — gap closed

### Y3 — LORE (Iceberg): ✅ ABOVE TARGET
- **BS-1 Echo:** 16 named elements (E-BS1-001..016) — AT TARGET (12 required)
- **GH-1 Echo:** 41 named elements (E-GH1-001..041) — 3.4× target
- **Deep threads:** 26 identified (D-BS1-001..016, D-GH1-001..004, D-CROSS-001..007) — ABOVE TARGET (24 required)
- Iceberg registry: `lorevault-wiki/strategy/iceberg-registry/series-1.md`
- Jonathan's Journal: 47 installments (May 3–June 16 gap fill + June 17 canonical) — buffer complete through Series 1 GH-1 drop (Oct 3)

### Y4 — IA (90-second test): ✅ PROXY ABOVE FLOOR
- 8 named /v2 routes live, 25 SSG card detail paths
- Day-1 funnel: `/v2` → `/v2/open` → `/v2/pack/reveal` → `/v2/card/[id]` → `/v2/set/bs1` — fully navigable
- `/v2/lattice` gives the full cosmology in 90 seconds (5 Panes, 8 Shells, Lampblack explained)
- The word "Lampblack" is earned at 87 seconds per Phase 9 §3 — confirmed by the /v2/welcome 90-second tour
- Prolific respondent test not yet run (quarterly panel) — proxy ABOVE FLOOR (50%)

### Y5 — OPERATIONAL: ⚠️ BELOW FLOOR — this brief is the unlock
- 0 Sets shipped (floor = 1/month); this motion is the floor-clearing event
- R2 loop: Beat A (Journal) + Beat B (Today) + Beat C (Sample Pack) all live
- All 8 /v2 routes + 25 card paths live and building clean
- **Unlock condition: Odin approval → BS-1 council-locked → Y5 floor cleared on May 2**

### Y6 — AUDIENCE: ⚠️ BELOW FLOOR
- 0% Week-4 return (no beta cohort yet)
- 0 paid opens (no purchase flow yet)
- Jonathan's Journal email infra not yet stood up (Customer.io/Klaviyo — see Outstanding §4.2)
- **Unlock condition: May 2 launch + Journal email Day-1 send**

### Y7 — THRILLED: ⚠️ BELOW FLOOR
- 0% (no activated cohort)
- og:image + card art on /v2/card/[id] pages — share infrastructure present
- **Unlock condition: beta cohort activation post-launch + Brand24/Vercel referer scrape wired**

---

## 4. Outstanding Items — What Ships in Phase 2

The following are NOT blockers for the May 2 drop. They are Phase 2 items that unlock after the council-lock.

### 4.1 Payments + Ownership (Critical Phase 2, pre-revenue)
- Flow custodial-invisible wallet integration — not built
- Paid pack purchase flow (Standard $9 / Curated $49 / Premium $199 / Apex $999) — not built
- Binder ownership screen — not built
- Council Seat 1 confirmation on Premium/Apex packs — not built
- **Impact:** Only Sample pack (free, reading-days earned) ships at launch. Standard+ packs are shown in the set page pricing table as "launching 2 May 2026" but purchase is not yet wired.

### 4.2 Email Infrastructure (Critical Phase 2, pre-Journal Day-1)
- Customer.io or Klaviyo infra for Jonathan's Journal daily send — not stood up
- Journal subscribers captured via /v2/journal KV store (email + timestamp) — capture is live; send pipeline is not
- **Impact:** Journal Day-1 email can't go out on May 3 without this

### 4.3 Prolific IA Test (Y4 validation)
- Proxy only; formal Prolific test not yet run
- **Impact:** Y4 remains proxy until scheduled

### 4.4 Brand24 / Social scrape (Y7)
- og:image referer log not yet wired to a monitoring surface
- **Impact:** Y7 measurement remains 0% until activated post-launch

### 4.5 Lampblacker's Spine
- Asha Caedmon (GH Spine) has arc placement; Hester Quill (BS Spine) named but not published as a card or wiki page
- Per HANDOVER.md §9 Rewrite 3 — outstanding from V2 narrative review
- **Impact:** Load-bearing for Series 2 planning; not a BS-1 drop blocker

### 4.6 V2 Rewrites still pending (from HANDOVER.md §9)
- Rewrite 2: Lampblack as active force (1 paragraph in cosmology §1)
- Rewrite 3: Lampblacker's Spine publication
- Rewrite 4: first flavor-text sample replacement
- Rewrite 5: Wonderland mode-2 philosophical register (entangled with Topsy)
- **Impact:** Voice doctrine completeness; not a BS-1 drop blocker

---

## 5. Council Decision Points

The following require explicit Council acknowledgment at lock time:

**Decision A: Confirm set name** — "Baker Street · BS-1 · The Argument Pane"
- "The Argument Pane" per Phase 9 §2 calendar. Confirmed.

**Decision B: Confirm drop date and time** — 2 May 2026, 1pm ET
- Top Shot collector-time inheritance per Phase 9 §1. Confirmed.

**Decision C: Confirm Sample-only launch**
- Phase 1 ships Sample pack (free, reading-days). Standard+ packs ship in Phase 2 when Flow wallet integration is live. Collector sees pricing table on /v2/set/bs1 but purchase is inactive.
- This is a "no purchase on Day 1" decision. It trades revenue for product integrity — no broken CTA on launch day.

**Decision D: Parallel flavor texts** — are all 32 parallel texts Council-approved?
- All 32 authored by daemon, Mosaic proxy PASS. Voice Lead review (HANDOVER §9 status field = "DRAFT — Voice Lead review required at Friday Drop Retro") not yet formally completed by a human Council member.
- **Flag for Odin:** parallel flavor texts may need human Voice Lead spot-check before publishing.

**Decision E: Iceberg Quarterly Audit gate** — Decision 16 from NORTH-STAR.md
- Decision 16: ≥12 Echo + ≥24 Deep per Series before ship. Current: BS-1 16 Echo + 16 Deep (counting only BS-1 threads) OR Series 1 total 57 Echo + 26 Deep.
- The Gate passes if "per Series" means all of Series 1. It may fail if "per Set" interpretation applies (BS-1 standalone has 16 Deep but 7 directly involve only BS-1 cards; the other 9 require GH-1 or cross-Pane cards not yet live).
- **Flag for Odin:** Clarify interpretation of Decision 16 before lock.

---

## 6. Daemon Recommendation

**SHIP on 2 May 2026** with the following conditions:

1. Council confirms "per Series" interpretation of Decision 16 (57 Echo / 26 Deep passes comfortably)
2. Voice Lead human spot-check completes on ≥5 parallel flavor texts before Day-1 publish
3. Set page pricing table clearly shows Standard+ as "launching soon" (not "coming soon" — see Phase 5 banned-chrome: no countdown)
4. Journal email infra standing order: Customer.io/Klaviyo must be live before May 3 Day-1 Journal send

The ship should proceed. BS-1 is the most content-complete and doctrine-faithful Set LoreVault has ever prepared. Delaying for Phase 2 items (wallet/payments) while the editorial product is ready would cost the May 3 Journal Day-1 send window. Y5 clears on May 2. Y6 and Y7 unlock in the 30 days following with the Journal cohort.

---

*This brief was prepared autonomously by the rebirth-daemon. It requires human Council review (Odin + Canon Lead + Voice Lead) before lock is confirmed. The daemon has no authority to self-lock a Set; this brief is a request, not a declaration.*
