# YARDSTICK-STATE — LoreVault Rebirth Daemon

**Updated by:** rebirth-daemon every cycle (step h).
**Source:** NORTH-STAR.md §3. Measurements are proxies labeled as such where the quarterly panel has not yet run.

---

## Measurement Table

| Cycle | Timestamp | Y1 Art | Y2 Flavor | Y3 Lore | Y4 IA | Y5 Ops | Y6 Audience | Y7 Thrilled | Delta | Notes |
|-------|-----------|--------|-----------|---------|-------|--------|-------------|-------------|-------|-------|
| 1 | 2026-04-25T04:04:21Z | 0% | 0% | 0/0 Echo+Deep | 0% | 0 Sets/mo | 0% / 0 opens | 0% | INIT | Cold-start baseline. All below floor. |
| 2 | 2026-04-25T19:44:04Z | 20% (4/20) | 0% | 0/0 Echo+Deep | 0% | 0 Sets/mo | 0% / 0 opens | 0% | Y1+0.20 | Track A: 4 BS-1 FLUX renders shipped (bs1-c01, bs1-c02, bs1-r01, bs1-u01). FLUX 1.1 Pro Ultra / Replicate. All ≤500KB. Manifest initialized. |
| 3 | 2026-04-25T20:03:36Z | 40% (8/20) | 0% | 0/0 Echo+Deep | 0% | 0 Sets/mo | 0% / 0 opens | 0% | Y1+0.20 | Track A: 4 more BS-1 renders (bs1-c03, bs1-c04, bs1-c05, bs1-l01). Odin skill unavailable — logged, deferred to next session. 8/20 BS-1 Moments rendered. |
| 4 | 2026-04-25T20:19:16Z | 60% (12/20) | 0% | 0/0 Echo+Deep | 0% | 0 Sets/mo | 0% / 0 opens | 0% | Y1+0.20 | Track A: 4 more renders (bs1-c06, bs1-c07, bs1-c08, bs1-r02). Frigga skill also unavailable — logged. 12/20 BS-1 Moments rendered. |
| 5 | 2026-04-25T20:34:06Z | 60% (12/20) | 40% (8/20, 100% Mosaic proxy) | 8 Echo implied | 0% | 0 Sets/mo | 0% / 0 opens | 0% | Y2+0.40 | Track B: 8 BS-1 flavor texts + lore-notes drafted. Baker Street voice. All 8 cards 3/3 Mosaic proxy pass. 8 Echo elements authored. voice-feed/cycle-5.md. |
| 6 | 2026-04-25T20:49:06Z | 60% (12/20) | 40% (8/20) | 8 Echo implied | proxy (build) | 0 Sets/mo | 0% / 0 opens | 0% | Y4 unlock | Track C: /v2 route shell shipped. src/app/v2/page.tsx live. Watson's Arrival image, "The glass catches light" voice, one door. v1 chrome excluded for /v2. Build GREEN, /v2 in build output. |
| 7 | 2026-04-25T21:04:08Z | 60% (12/20) | 40% (8/20) | 3 Echo authored | proxy (build) | 0 Sets/mo | 0% / 0 opens | 0% | Y3 +3 Echo | Track D: 3 Jonathan's Journal installments drafted (May 3-5). Gothic Horror epistolary register. Footnoter placeholder. Spine-events annotated. |
| 8 | 2026-04-25T21:20:34Z | 60% (12/20) | 40% (8/20) | 3 Echo authored | proxy (build) | 0 Sets/mo | 0% / 0 opens | 0% | Y5 R2 start | Track E: /v2/today live — daily card surface, 8-card rotation, UTC day index, connection() dynamic. /v2 home teaser + link. Build GREEN. R2 §1 Beat B minimum-viable shipped. |
| 9 | 2026-04-25T21:44:45Z | 80% (16/20) | 40% (8/20) | 3 Echo authored | proxy (build) | 0 Sets/mo | 0% / 0 opens | 0% | Y1 floor hit | Track A: 4 FLUX renders (bs1-c09 "The Telegram" 436KB, bs1-c10 "The Baker Street Irregulars" 165KB, bs1-r03 "The Photograph" 213KB, bs1-r04 "The Case Map" 470KB). Y1 floor 80% achieved. FLUX 1.1 Pro Ultra / Replicate, all FLUX-only, all ≤500KB. Manifest 16 entries. Frigga/Odin skills unavailable (frigga:brief, odin:odin not in session available-skills list) — both overdue, noted for next session with skill access. |

---

## Current Measurements (Cycle 9 — Track A: 4 FLUX Renders, Y1 Floor Achieved)

### Yardstick 1 — ART
- **Measurement:** 80% (16 of 20 BS-1 Moments rendered at FLUX 1.1 Pro Ultra)
- **Target:** 100% of in-flight-Set Moments rendered
- **Floor:** 80% (16 of 20) by 7 days before drop
- **Status:** AT FLOOR — 16/20 rendered. 4 remaining: c11, c12, r05, l02.
- **Proxy:** count-based (quarterly blind panel not yet scheduled)

### Yardstick 2 — FLAVOR (Mosaic Test pass rate)
- **Measurement:** 40% of BS-1 cards have flavor text + lore-note (8/20). Mosaic proxy pass rate: 100% (8/8 Baker Street register confirmed by daemon proxy evaluation).
- **Baseline from REVIEW-quality.md:** 44% on prior corpus
- **Target:** ≥80% Mosaic Scorer pass; ≥80% contractor-panel survives
- **Floor:** 60% Mosaic Scorer pass
- **Status:** BELOW FLOOR on card-coverage (40% < target 100%), ABOVE FLOOR on pass rate (100% proxy vs 60% floor). Need 12 more cards' flavor text to reach full coverage.
- **Proxy:** daemon proxy evaluation (not contractor panel — that schedules quarterly). Baker Street voice confirmed across all 8.
- **Authored this cycle:** bs1-u01, bs1-c01, bs1-c02, bs1-r01, bs1-c03, bs1-r02, bs1-l01, bs1-c06. See `voice-feed/cycle-5.md`.

### Yardstick 3 — LORE (Iceberg compliance)
- **Measurement:** 0 Echo + 0 Deep (per Series 1)
- **Target:** 12 Echo + 24 Deep per Series
- **Floor:** 8 Echo + 16 Deep by Month 6 of Series
- **Status:** BELOW FLOOR — no iceberg elements authored yet
- **Proxy:** count-based; weekly LLM panel test not yet running

### Yardstick 4 — IA (90-second test)
- **Measurement:** proxy-unmeasured (Playwright walk not yet run against deployed /v2; build confirms route exists and prerendered static)
- **Target:** ≥70% of Prolific respondents give coherent in-own-words answer
- **Floor:** ≥50%
- **Status:** BELOW FLOOR — /v2 now exists (src/app/v2/page.tsx, static prerender), but Playwright walk + Prolific test not yet run
- **Surface shipped:** `/v2` — hero image (Watson's Arrival), "The glass catches light" voice, one door ("Enter the Lattice" → /prototype/exemplars). No v1 chrome. No marketplace tile. No countdown.
- **Proxy:** next cycle runs Playwright walk (Track F) against deployed /v2 to assess legibility

### Yardstick 5 — OPERATIONAL
- **Measurement:** 0 Sets shipped in trailing 30 days; R2 daily loop: 1/3 Beat elements initialized (Beat B: Today on the Lattice)
- **Target:** 1 Set per month sustained; 2 per month steady state
- **Floor:** 1 Set per month for 3 consecutive months
- **Status:** BELOW FLOOR — Series 1 M1 not yet shipped; R2 loop initializing
- **Note:** Beat B (Today on the Lattice) shipped cycle 8 — /v2/today live, 8-card daily rotation. Beat A (Jonathan's Journal) launches May 3. Beat C (Sample tickets) not yet built.

### Yardstick 6 — AUDIENCE
- **Measurement:** 0% Week-4 return; 0 paid pack opens; Day-1 Journal sub rate: 0%
- **Target:** ≥40% Week-4 return; 100+ paid opens; 15% Day-1 Journal sub at launch
- **Floor (moving):** 30% Week-4 return; Day-1 floor is 15% at Series 1 launch month
- **Status:** BELOW FLOOR — no beta cohort exists yet; Jonathan's Journal not yet launched
- **Note:** Jonathan's Journal launches May 3 2026 (8 days from today)

### Yardstick 7 — THRILLED
- **Measurement:** 0% (no beta cohort activated; no social mentions attributable to v2)
- **Target:** ≥15% of activated users emit quote-screenshot/card-image/theory post within 30 days
- **Floor:** 5%
- **Status:** BELOW FLOOR — cold start; Brand24/Tagboard scrape not yet wired
- **Proxy:** og:image referer count in Vercel logs (0 detected for /v2; /v2 doesn't exist yet)

---

## Weakest Yardstick (for Track Selection Rule §4 #8)

All non-ART yardsticks are at 0% / cold-start. Y1 (ART) now at 20% (ratio: (4-0)/(20-0) = 0.20 / but floor is 16, so against floor: 4/16 = 0.25).

Y4 (IA) remains the critical path blocker — ratio undefined (0% vs 50% floor; no /v2 surface). Y2, Y3, Y5, Y6, Y7 all undefined/0.

Weakest yardstick by floor-ratio: Y4 (IA) at 0/50% floor. **Track C (SURFACE) is the next priority — /v2 route shell needed to unlock Y4 measurement.** Y1 advancing: 12/20 renders (60%), 4 more needed to hit floor (16/20). Floor achievable Cycle 5. Y1 floor cross is imminent — Cycle 5 should be Track C to advance the actually-blocking Y4 gap.

---

## Remediation Plans

**All yardsticks below floor — ramp in progress.** Updated remediation:
- Y1 (ART): 4/20 rendered (Cycle 2). Continue Track A each cycle until 20 renders complete. Floor (16/20) achievable by Cycle 6.
- Y4 (IA): Cycle 5 ships `/v2` route shell → Cycles 6–12 build R1 surfaces → Y4 becomes measurable. **Blocking all other yardstick measurements.**
- Y2 (FLAVOR): After Track A art coverage ≥50%, begin Track B flavor texts. Mosaic Scorer test unlocks.
- Y3 (LORE): Cycle 29+ drafts iceberg elements per card → Y3 rises.
- Y5 (OPERATIONAL): Set BS-1 Council-lock at cycle 30 → Y5 measurable.
- Y6/Y7 (AUDIENCE/THRILLED): Post-launch with paid pack opens; Jonathan's Journal starts May 3 2026.
