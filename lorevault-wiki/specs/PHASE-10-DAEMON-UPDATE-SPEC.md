# LoreVault REBIRTH-DAEMON v2 — Update Spec

**Date:** 2026-04-26
**Audience:** Daemon engineering team (kaaos-daemon VM `/opt/rebirth-daemon/`).
**Posture:** Engineering-grade. Production-binding. The daemon reads this and operates from it for cycles 8+.
**Source-of-truth inputs:** REBIRTH-DAEMON-PROMPT.md v1 (current production); 00-INDEX.md; 00-MASTER-SYNTHESIS-PART2-COMPLIANCE-REGISTER.md; 00-MASTER-SYNTHESIS-PART3-TETHERS-ANCHORS-DECISIONS.md; 5 BIBLE files (BS / EK / Wonderland / Gothic / Greek); 8 MANIFEST files (BS, EK Parts 1-2, Wonderland, Gothic Parts 1-3 incl. Liberation Drop, Greek); PHASE-04-CARD-FRAME-LAYOUT-SPEC §3.6; PHASE-05-GAME-LOOP-PROGRESSION-SPEC.

This document is the **delta spec** — diff-able instructions to apply to the v1 prompt to produce v2. Sections below map 1:1 to the v1 sections being modified. Where v1 said *"Track A picks the next Set in production and generates whatever is needed,"* v2 says *"Track A reads the manifest, executes cell-rows in order, and validates each one before commissioning."* The daemon stops improvising and starts executing.

---

# 1. Summary of Changes — v1 → v2

## 1.1 What's added

1. **Manifest-bound Track A.** Track A no longer generates prompts from Bible-skim. It reads `MANIFEST-XX-XX.md` cell-rows (the row-per-cell production format established in MANIFEST-01 through MANIFEST-05) and executes the next un-commissioned row in order. The `[POSITIVE]` and `[NEGATIVE]` blocks plus `Iconography:` line of each row are the FLUX prompt body, verbatim. Improvisation is removed.
2. **`assertParallelEligible()` validator gate.** Inline-callable TS validator from PHASE-04 §3.6 is invoked pre-commission on every cell-row that carries a Parallel. Failure logs and skips the row, alerts the Council, never commissions invalid art. This is the machine-enforced answer to the CEO's named ARCANA-overprevalence concern.
3. **Lampblack-Spine arc state tracking.** Per-Universe arc state for the 5 Lampblacker-Spines (Hester Quill / Charcoal-Burner's Daughter / The Glass-Polisher / Asha Caedmon / Melaina) lives in `/opt/rebirth-daemon/state/spine-state.json`. The daemon enforces arc-order — a Spine's Mythic-1/1 reveal cell cannot commission before her seeded-cipher and named-introduction cells have shipped.
4. **4-seat Council confirmation moments.** Apex-pack mid-stream cells and every Set-Lock cell (the last cell in a Set, including all four Spine-anchor Sets and the Liberation Drop) require Council electronic sign-off before commit. Non-Apex non-Set-Lock cells auto-pass.
5. **Yardstick 7 social-emission tracking.** Y7 (Thrilled) added to scoring. Beta-cohort 7-day window of card-image / quote-screenshot / Lampblack-thread-theory posts is measured via Brand24 + Vercel `og:image` scrape. Track A art and Track B copy both feed Y7 fitness.
6. **Cultural-sensitivity advisor-panel routing.** Cells flagged in the manifest's Council-flag column (SWANA / Shinto / NI / Hudson Valley Indigenous / Roma + Jewish / Iraqi cultural-heritage / Egyptian / Coptic) auto-pause and post advisor-review request to a dedicated Slack channel. The daemon waits for sign-off before commissioning.

## 1.2 What's preserved

- **The 12-step cycle protocol** (PULL → STATE → AUDIT → CONSULT → SELECT TRACK → EXECUTE → VERIFY → SCORE → COMMIT → DEPLOY → REFLECT → SLEEP). v2 inserts two new steps (§4 below) for a 14-step cycle.
- **Frigga every 8 cycles + Odin every 24** with all existing breach triggers.
- **Heartbeat + STOP file** semantics. External Pantheon monitor unchanged.
- **Build-red → fix priority.** ≥3 red on same file → Track F only; ≥5 red → STOP + GitHub issue.
- **All 8 Tracks A-H, the 8-rule deterministic Track Selection ordering, and the file-ownership map.**
- **Hard ban on openai imports / gpt-image-1 / seed-moodboard.mjs.** FLUX-only via Replicate.

---

# 2. The New Track A — Manifest-Bound Commissioning

## 2.1 Old behavior (v1)

Track A's trigger was *"in-flight Set has <20 FLUX renders OR a gpt-image-1 card needs replacement OR YARDSTICK-1 below floor."* Once triggered, Track A picked an under-rendered Moment from the in-flight Set and generated a FLUX prompt from a per-Universe template-stub. The prompt body was assembled at runtime from Bible §13/§14 fragments.

## 2.2 New behavior (v2)

Track A reads the manifest for the in-flight Set, finds the next un-commissioned cell-row, copies the row's `[POSITIVE]`+`[NEGATIVE]` blocks verbatim into the FLUX call, and ships the resulting WebP to the cell's deterministic asset path. No string improvisation. No Bible re-skim. The manifest IS the prompt.

## 2.3 Cell-selection algorithm (pseudocode)

```ts
// /opt/rebirth-daemon/src/track-a/select-cell.ts

import { state } from '../state/state.json';
import { spineState } from '../state/spine-state.json';
import { assertParallelEligible } from '../validators/parallel-eligibility';
import { spineArcCheck } from '../validators/spine-arc';
import { liberationCronCheck } from '../validators/liberation-cron';
import { culturalAdvisorCheck } from '../validators/cultural-advisor';

async function selectNextCell(): Promise<CellRow | null> {
  const setId = state.inFlightSet;                       // e.g. "BS-1"
  const manifest = await readManifest(setId);            // parses MANIFEST-XX-XX.md
  const allCells = manifest.cells;                       // ordered cell-rows from §A then §B
  const commissionedSet = await readCommissionedAssets();// reads public/prototype-art/<setId>/

  for (const cell of allCells) {
    if (commissionedSet.has(cell.cardId)) continue;      // already shipped

    // Gate 1: Parallel eligibility (PHASE-04 §3.6)
    try {
      assertParallelEligible(cell.parallel, cell.tier, cell.baseArtVariant);
    } catch (e) {
      log.warn(`SKIP ${cell.cardId}: parallel-eligibility ${e.message}`);
      alertCouncil('parallel-eligibility-fail', cell, e.message);
      continue;
    }

    // Gate 2: Liberation Drop time-lock (§8 below)
    if (!liberationCronCheck(cell)) {
      log.info(`DEFER ${cell.cardId}: Liberation Drop time-locked until 2027-01-01T00:01Z`);
      continue;
    }

    // Gate 3: Lampblack-Spine arc-order (§5 below)
    if (!spineArcCheck(cell, spineState)) {
      log.info(`DEFER ${cell.cardId}: spine-arc prerequisite not yet shipped`);
      continue;
    }

    // Gate 4: Cultural-advisor flag (§7 below)
    const advisor = culturalAdvisorCheck(cell);
    if (advisor.required && !advisor.signoff) {
      await postAdvisorReviewRequest(cell, advisor.panel);
      log.info(`PAUSE ${cell.cardId}: awaiting ${advisor.panel} sign-off`);
      continue;
    }

    return cell;                                         // first row that clears all four gates
  }

  return null;                                           // Set complete; promote next Set
}
```

If `selectNextCell()` returns `null`, the in-flight Set has no commissionable rows in this cycle. The daemon promotes `state.inFlightSet` to the next Set in the Series-1 ladder (BS-1 → BS-2 → BS-3 → BS-4 → EK-1 → ... → GH-4 → ... → GR-4) per the manifest-of-manifests order, writes the cycle log, and SLEEPs.

## 2.4 FLUX call construction

Once a cell-row is selected, the FLUX call is constructed mechanically:

```ts
const fluxCall = {
  model: 'black-forest-labs/flux-1.1-pro-ultra',
  aspect_ratio: '2:3',
  prompt: cell.fluxPromptBody.positive,                  // verbatim from manifest
  negative_prompt: cell.fluxPromptBody.negative,         // verbatim from manifest
  output_format: 'webp',
  output_quality: 92,
};
const asset = await replicate.run(fluxCall);
const path = `public/prototype-art/${cell.universe}/${cell.setId}/${cell.cardId}/v${cycle}.webp`;
await writeWebP(asset, path, { maxBytes: 500 * 1024 });
```

The asset path is deterministic from the cell-row. No human in the loop. The next cycle's AUDIT step inventories `public/prototype-art/` to know what is shipped.

---

# 3. The Validator Gate — `assertParallelEligible()`

The validator from PHASE-04 §3.6 is now inline-callable from the daemon. Source of truth is `src/lib/parallels/eligibility.ts` in the LoreVault repo; the daemon imports it via `import { assertParallelEligible } from '@/lib/parallels/eligibility'` so the **same** function gates both runtime card-render and pre-commission daemon flow.

## 3.1 Required checks (extended for Series 1)

```ts
export function assertParallelEligible(
  parallel: Parallel,
  tier: Tier,
  baseArtVariant: BaseArtVariant,
  ctx: { universe: Universe; shell: Shell; sourceMaterial?: string }
): true {
  // ARCANA, AETHER, WITNESS, NEON: Rare+ only with parallel-specific FLUX commission
  const rarePlus: Tier[] = ['rare', 'legendary', 'ultimate'];

  if (parallel === 'arcana' && !rarePlus.includes(tier))
    throw new Error('ARCANA: tier must be Rare/Legendary/Ultimate');
  if (parallel === 'arcana' && baseArtVariant !== 'parallel')
    throw new Error('ARCANA: requires parallel-specific FLUX commission');

  if (parallel === 'aether') {
    if (!['legendary', 'ultimate'].includes(tier))
      throw new Error('AETHER: tier must be Legendary or Ultimate');
    if (!figureHasCosmicScaleSpine(ctx)) // BIBLE-bound predicate (e.g. Snow Queen yes; Watson no)
      throw new Error('AETHER: figure lacks cosmic-scale Spine; non-eligible');
  }

  if (parallel === 'witness') {
    if (!rarePlus.includes(tier))
      throw new Error('WITNESS: tier must be Rare+');
    if (ctx.shell !== 'PRIME')
      log.warn('WITNESS preferred on PRIME shell; non-PRIME requires Council review');
  }

  if (parallel === 'neon' && ctx.shell !== 'CYBER')
    throw new Error('NEON: requires CYBER shell');

  // Per-Universe shell forbiddens (Cosmology Decisions 13 + EK)
  if (ctx.universe === 'baker-street' && ctx.shell === 'DREAM')
    throw new Error('DREAM shell FORBIDDEN for Baker Street (Cosmology Decision 13)');
  if (ctx.universe === 'wonderland' && ctx.shell === 'HOLLOW')
    throw new Error('HOLLOW shell FORBIDDEN for Wonderland (Cosmology Decision 13)');

  // 1/1 ONE-OFF cap: max 1 per Set per Series
  if (parallel === 'one-off') {
    if (tier !== 'ultimate') throw new Error('1/1 ONE-OFF: Ultimate-tier only');
    const setOneOffs = countOneOffsInSet(ctx);
    if (setOneOffs >= 1) throw new Error('1/1 ONE-OFF: cap of 1 per Set per Series exceeded');
  }

  // Source-material exclusions (Compliance Register Part 2)
  if (ctx.universe === 'enchanted-kingdom' &&
      (ctx.sourceMaterial === 'KHM-110' || ctx.sourceMaterial === 'KHM-7'))
    throw new Error('EK: KHM-110 + KHM-7 source material EXCLUDED for antisemitism');

  // Andamanese / Tonga caricature flag for BS Sign-of-the-Four cells
  if (ctx.universe === 'baker-street' && ctx.sourceMaterial === 'sign-of-the-four')
    requireNegativePromptContains(['Andamanese caricature', 'Tonga caricature']);

  return true;
}
```

The function throws on failure; the daemon catches, logs, alerts Council, and skips the cell. Three call-sites (PHASE-04 §3.6's defense-in-depth: commissioning admin form, mint-job entrypoint, runtime guard) plus the daemon = four call-sites total. Every cell that ever touches FLUX passes through this validator.

---

# 4. Cycle Protocol — 12-step → 14-step

The two new steps land between SELECT TRACK and EXECUTE, and between SCORE and COMMIT.

| Step | v1 → v2 | Behavior |
|---|---|---|
| a. PULL | unchanged | git fetch, pull, read NORTH-STAR + recent cycle logs |
| b. STATE | extended | also read `spine-state.json`; write heartbeat |
| c. AUDIT | unchanged | inventory shipped commits; build probe; yardstick measurement (now 7) |
| d. CONSULT | unchanged | Frigga every 8 / Odin every 24; pivot triggers |
| e. SELECT TRACK | unchanged | 8-rule deterministic ordering |
| **f. VALIDATE_MANIFEST_ROW** | **NEW** | If Track A: call `selectNextCell()` (§2.3). All four gates fired. If null, log + sleep. |
| g. EXECUTE | extended | Run chosen track. For Track A, FLUX call uses verbatim cell-row prompt. 11-min time-box. |
| h. VERIFY | unchanged | npm install, npm run build. Red → buildRedStreak++. |
| i. SCORE | extended | Update YARDSTICK-STATE.md (Y1-Y7). Y7 social-emission tracking added. |
| **j. COUNCIL_CONFIRM** | **NEW** | If commissioned cell is Apex-pack mid-stream OR Set-Lock (last cell of any Set, all 5 Spine-anchor Sets, Liberation Drop): block commit pending Council electronic sign-off. Otherwise auto-pass. |
| k. COMMIT | unchanged | git add, commit message format, tag, push |
| l. DEPLOY | unchanged | npx vercel --prod if src/public/config touched |
| m. REFLECT | extended (§9) | Cycle log includes ALTERNATIVE block + structured Frigga pivotSignal field |
| n. SLEEP | unchanged | sleep ${REBIRTH_DAEMON_CYCLE_SLEEP_SEC:-900}; cycle++ |

### 4.1 COUNCIL_CONFIRM details

Set-Lock cells (the figure-anchor Mythic-1/1 of each Set + all five Spine-anchor reveal cells + every Liberation-Drop cell) post to `#lorevault-council` Slack with the cell-row, the FLUX render, and a `[APPROVE / HOLD / REVISE]` interaction block. The daemon polls for sign-off every 60s up to a 24-hour timeout; on timeout it writes the cycle log with `councilStatus: 'timeout'` and skips commit. Non-Set-Lock Apex-pack cells (Apex pulls per Economy V1 §6) require a single Council seat (rotating duty roster) to one-tap approve within 6 hours; absent that, auto-skip-and-defer.

Apex-pack mid-stream = any Ultimate-tier render that hasn't been Council-eyeballed in the last 7 days, regardless of Set position. Tracked in `state.json.lastApexCouncilCheck`.

---

# 5. Lampblack-Spine Arc State Tracking

Per-Universe arc state for the 5 Lampblacker-Spines:

| Universe | Spine | Series-1 arc shape |
|---|---|---|
| Baker Street | **Hester Quill** | BS-1 absent → BS-2 cipher initials in margin → BS-3 Spencerian hand visible at frame-edge → BS-4 named in *The Footnote at the Margin* + *Hester Quill Speaks* |
| Enchanted Kingdom | **Charcoal-Burner's Daughter** | EK-1 byline-only → EK-2 byline + cottage-floor cameo → EK-3 figure visible at kiln-wall → EK-4 named (Mythic-1/1) |
| Wonderland | **The Glass-Polisher** | W-1 absent → W-2 polishing-cloth artifact → W-3 figure-back-only → W-4 named (Mythic-1/1) |
| Gothic Horror | **Asha Caedmon** | GH-1 ledger-margin only → GH-2 hand-at-frame-edge → GH-3 cameo (annotation) → GH-4 named cells #17/18/19/20 + Liberation-Drop retro-loop |
| Greek Myth | **Melaina** | GR-1 absent → GR-2 oracle-translator role → GR-3 figure visible → GR-4 named (Mythic-1/1) |

State file `/opt/rebirth-daemon/state/spine-state.json`:

```json
{
  "baker-street": {
    "spine": "Hester Quill",
    "arc": [
      { "stage": "absent",            "set": "BS-1", "shipped": true,  "shippedAt": "2026-04-15T..." },
      { "stage": "cipher-initials",   "set": "BS-2", "shipped": true,  "shippedAt": "2026-04-22T..." },
      { "stage": "spencerian-hand",   "set": "BS-3", "shipped": false, "shippedAt": null },
      { "stage": "named-introduction","set": "BS-4", "shipped": false, "shippedAt": null },
      { "stage": "mythic-1-of-1",     "set": "BS-4", "shipped": false, "shippedAt": null }
    ],
    "crossPaneCameos": []
  },
  "enchanted-kingdom": { ... },
  "wonderland": { ... },
  "gothic-horror": {
    "spine": "Asha Caedmon",
    "arc": [...],
    "crossPaneCameos": [
      { "universe": "greek-myth",      "cardId": "asha-mouth-of-hades",       "deferredTo": "S2" },
      { "universe": "american-gothic", "cardId": "asha-receives-tell-tale",   "deferredTo": "S2" },
      { "universe": "lovecraft",       "cardId": "asha-closes-innsmouth",     "deferredTo": "S3" }
    ]
  },
  "greek-myth": { ... }
}
```

The `spineArcCheck()` validator refuses any cell whose stage requires a prior stage that hasn't shipped — e.g. Hester Quill's *Mythic-1-of-1* cell cannot commission until *named-introduction* has shipped, which itself cannot commission until *spencerian-hand*, etc. Cross-Pane cameos (per BIBLE-04 §11 — Asha cross-tethers Greek/American-Gothic/Lovecraft) are tracked separately and only commission once the Spine has reached *named-introduction* in her home Universe.

---

# 6. The 7 Yardsticks — Y7 Added

The seventh Yardstick (THRILLED) is added to v1's six. v1 already lists Y7 as "% activated users posting unprompted social emission within 30 days; target ≥15%; floor 5%" — v2 makes it production-measurable and per-cycle scored.

## 6.1 Y7 measurement pipeline

- **Source 1 (Brand24):** weekly query for `lorevault.cards` + `Lampblack` + the 5 Spine names (Hester Quill, Charcoal-Burner's Daughter, Glass-Polisher, Asha Caedmon, Melaina) + per-Set glyph hashtags. Daemon hits the Brand24 API at AUDIT step.
- **Source 2 (Vercel `og:image` scrape):** count of beta-cohort users whose card-detail pages show `share-card-rendered=true` in the og-image-stamper logs in the last 7 days. Pre-analytics; the og-image fetch IS the share-event.
- **Source 3 (X / Bluesky search):** rate-limited daily query for Lampblack-thread-theory keywords + card-image alt-text patterns from the canonical export (`Watson stands at the corner of Marylebone Road...`).

**Score:** `Y7 = (uniqueEmittingUsers / activatedUsersDay30Cohort) over 7-day rolling window`. Target ≥15% Q2 / floor 5%.

## 6.2 How Track A art and Track B copy feed Y7

- Every Track A cell-row's pullquote (manifest §`Pullquote:`) is emitted to a per-Universe quote-bank consumed by the og-image-stamper. The og-image is what users screenshot — improving Track A art improves the og-image legibility.
- Every Track B copy-pass pulls from the Mosaic Scorer panel; the daemon writes the Mosaic 2-of-3-pass quote-strings into `data/quote-bank/{universe}.json`. Brand24 watches for those strings appearing in user posts.

If Y7 < 5% for 3 consecutive cycles, Y7 becomes primary focus per Track Selection Rule auto-escalation; Track B and Track E (engagement) deprioritize over Track A art-density and Track G (Council pull-line A/B test).

---

# 7. Cultural-Sensitivity Advisor-Panel Routing

The manifest's Council-flag column (`Cultural-flag:` in cell-rows that carry one) enumerates the panel required for sign-off. Mapping:

| Flag | Panel | Manifest cells |
|---|---|---|
| `swana-arabian` | SWANA cultural-advisory | Series-3 Arabian Nights cells (held) |
| `shinto-yokai` | Shinto + Japanese folklorist + Japan-IP triad | Series-3 Yokai cells (deferred — see BIBLE notes) |
| `hudson-valley-indigenous` | Indigenous Hudson Valley reviewer | Series-2/3 American Gothic Sleepy Hollow cells |
| `ni-cultural` | Northern-Ireland cultural reviewer | Series-2 Cú Chulainn cells |
| `roma-jewish` | Roma + Jewish reviewers | EK + Dickens Fagin cells |
| `iraqi-cultural-heritage` | Iraqi cultural-heritage panel | Series-3 Mesopotamian cells |
| `egyptian-coptic` | Egyptian / Coptic reviewer | Series-2 Egyptian cells |

Daemon behavior on a flagged cell:

```ts
if (cell.culturalFlag) {
  const signoffKey = `cultural-signoff:${cell.cardId}`;
  const existing = await readSignoff(signoffKey);
  if (!existing) {
    await slack.post(`#lorevault-cultural-${cell.culturalFlag}`, {
      text: `Cell ${cell.cardId} pending ${cell.culturalFlag} panel review`,
      attachments: [renderCellSummary(cell)],
      actions: [{ type: 'button', text: 'APPROVE', value: signoffKey }]
    });
    log.info(`PAUSE ${cell.cardId}: awaiting ${cell.culturalFlag} sign-off`);
    return null;  // skip this cell, try next
  }
}
```

The daemon does not block the cycle on advisor wait — it simply skips the flagged cell and selects the next eligible one. Sign-off persists in `/opt/rebirth-daemon/state/cultural-signoffs.json` and is sticky (a cell once approved stays approved unless explicitly revoked).

---

# 8. The 2027 Liberation Drop Cron

Time-locked. The daemon must NOT commission Liberation Drop cells (LD-01 through LD-15, per MANIFEST-04-PART3) until **Jan 1 2027 00:01 GMT**. Cron-condition:

```ts
function liberationCronCheck(cell: CellRow): boolean {
  const isLiberation = cell.cardId.startsWith('LD-') ||
                       cell.drop === 'liberation-2027-cliff-turns';
  if (!isLiberation) return true;

  const cliff = new Date('2027-01-01T00:01:00Z');
  if (Date.now() < cliff.getTime()) {
    log.refuse(`Liberation Drop cell ${cell.cardId} time-locked until 2027 PD cliff`);
    return false;
  }
  return true;
}
```

The pre-2027 retroactive Asha-reveal (MANIFEST-04-PART3 Appendix-A — *On the Cliff That Turned*) is **wiki-essay-only, no card-art changes**. The daemon flags Appendix-A's content for Wiki Track (Track G) instead of Track A. The four pre-2027 mainline GH cards (GH-1..GH-4) carry Asha's ledger margin-trace already; on Jan 1 2027 the wiki-essay reveals those entries had always been present (the *reading* changes, not the art). Track A is no-op for Liberation Drop until 00:01 GMT 2027-01-01.

At cliff-cross, the daemon's first cycle on or after that timestamp begins commissioning LD-01 through LD-15 in manifest order. The Lugosi/Karloff/Pierce-makeup/Strickfaden 2027-PD opt-ins activate only on Liberation cells (mainline GH cards remain Stoker/Shelley/Holst-register canonical).

---

# 9. Cycle Logs — REFLECT v2

Per V2 audit recommendation, REFLECT now writes:

```markdown
## ALTERNATIVE
Track {T'} considered and rejected because {reason}. Specifically:
- Track {T'} would have advanced {yardstick}.
- It was not chosen because {rule index from §4 of v1 prompt}.
- If {state-condition} flips, Track {T'} becomes primary at cycle {N+1}.
```

This makes Odin's 96-cycle deep-review tractable — the trajectory-reconstruction from cycle logs alone can recover the daemon's reasoning.

## 9.1 Frigga structured-output contract

Frigga's response is now JSON not free-text. The daemon never string-matches "shifting / collapsed / launching against" — it reads `pivotSignal: true|false`:

```json
{
  "cycle": 47,
  "question": "Is the Top Shot whale audience open to LoreVault's first Lampblack drop?",
  "pivotSignal": false,
  "summary": "...",
  "evidence": [...],
  "confidenceScore": 0.72
}
```

If `pivotSignal === true`, daemon writes `friggaPivotFlag: true` to state.json and forces Odin invocation next cycle. Frigga skill (`frigga:brief`) is updated to emit this contract — coordinate with Frigga skill maintainer when shipping v2.

---

# 10. Spend Cap Update

| Cap | Value | Notes |
|---|---|---|
| Anthropic daily | **$30** | Unchanged from v1. >80% defers Frigga/Odin; >95% Track F only. |
| Replicate daily (FLUX) | **$15** | Unchanged. Series-1 baseline ~$30 across full run (~$24 + iteration budget). |
| Council Slack-pings | ~$0.50/cell flagged | New line item. Bot posting to `#lorevault-council` + `#lorevault-cultural-*` channels. |
| Total daily target | ~5 cells/day | Sustains 1 Set/month (20 cells/Set × 12 Sets/year ≈ 240 cells/year ≈ 5 cells working day). |

A typical day: 5 Track A cells × $0.04 = $0.20 FLUX + ~$2.50 Council pings + Frigga/Odin ~$1.50 = ~$4/day. Well under all caps. The daemon's economic posture is *throughput-bounded by Council attention, not by spend*.

---

# 11. Failure Modes the v2 Daemon Pre-empts

| Failure mode | v1 outcome | v2 prevention |
|---|---|---|
| ARCANA-overprevalence (CEO's named example) | Daemon over-commissioned Common-base ARCANA cells | `assertParallelEligible()` at SELECT_CELL gate refuses Common-base + ARCANA |
| Lampblack-Spine arc out-of-order (e.g. Hester Quill Mythic before her named-introduction) | Daemon could ship Spine reveal before seed | `spineArcCheck()` against `spine-state.json` blocks |
| Cultural-sensitivity miss (Andamanese caricature, KHM-110, Romani-coded Asha) | Daemon could ship without panel review | Council-flag column + advisor-panel-routing pause |
| Pre-2027 Liberation Drop accidental ship | LD cells could leak into pre-cliff cycles | `liberationCronCheck()` refuses until 2027-01-01T00:01Z |
| DREAM shell on Baker Street (Cosmology Decision 13) | Validator would catch only at runtime | Pre-commission validator blocks at FLUX gate |
| HOLLOW shell on Wonderland (Cosmology Decision 13) | Same | Same |
| Frigga pivot-signal missed via string-match drift | "shifting" / "collapsed" wording variation could miss pivot | Structured `pivotSignal: bool` field |
| Apex-pack ships without Council eyeballs | v1 had no Apex-specific gate | COUNCIL_CONFIRM step + `lastApexCouncilCheck` state |

---

# 12. Deployment Steps (Section-A operational plan)

Execute in order on `kaaos-daemon` VM:

1. **SCP the updated REBIRTH-DAEMON-PROMPT.md to the VM:**
   ```
   scp REBIRTH-DAEMON-PROMPT.md kaaos-daemon:/opt/rebirth-daemon/repo/
   ```
   (or via `gcloud compute scp` with IAP tunnel per the daemon-SSH memory.)

2. **Stop the running daemon:**
   ```
   gcloud compute ssh --tunnel-through-iap kaaos-daemon --project dl-kaaos --zone us-central1-a -- 'touch /opt/rebirth-daemon/STOP'
   ```
   Wait for daemon to write `status: stopped` to heartbeat.txt (≤15 min).

3. **Pull repo update on VM:**
   ```
   ssh kaaos-daemon 'cd /opt/rebirth-daemon/repo && git pull --rebase'
   ```

4. **Initialize new state files:**
   ```
   ssh kaaos-daemon 'mkdir -p /opt/rebirth-daemon/state && \
     [ -f /opt/rebirth-daemon/state/spine-state.json ] || \
     cp /opt/rebirth-daemon/repo/state-templates/spine-state.json /opt/rebirth-daemon/state/'
   ```

5. **Restart tmux session:**
   ```
   ssh kaaos-daemon 'rm /opt/rebirth-daemon/STOP && \
     tmux new-session -d -s rebirth-daemon "/opt/pantheon/safeguard.sh /opt/rebirth-daemon/run.sh"'
   ```

6. **Watch first cycle:**
   ```
   ssh kaaos-daemon 'tmux attach -t rebirth-daemon'
   ```
   Verify in cycle-log: `selectNextCell()` resolved to a real cell-row; `assertParallelEligible()` passed; Council confirmation either posted (Set-Lock) or auto-passed (mid-Set); FLUX call used verbatim manifest prompt (cycle-log PROOF section should cite manifest §X cell N).

7. **First-cycle smoke acceptance:** within first 3 cycles after restart, daemon should ship at least one new cell-row commissioned from manifest, write `spine-state.json` arc-stage update if applicable, and produce a cycle-log with the new ALTERNATIVE block. If any of these are absent, tail the daemon log, fix forward, redeploy.

---

Daemon update specced. Track A bound to commissioning manifests. — Phase 10, 2026-04-26.
