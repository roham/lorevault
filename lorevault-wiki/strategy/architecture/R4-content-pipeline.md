# R4 — Content Pipeline: From "We Want Sherlock at Reichenbach" to Live on Production

**Author:** R4 — Content Pipeline Designer
**Date:** 2026-04-24
**Companions:** `G1-gap-synthesis.md`, `SET-ROADMAP.md` (60 Sets / 36 months), `research/R6-brand-mgmt.md` (TPC + WotC + LFSG), `MULTIVERSE-SHELLS.md` (Lampblack 4-layer stack + Council rejection examples), `FLAVOR-TEXT-DOCTRINE.md` (Mosaic Test, 5+1 voices), `TOPSY-REGISTER.md` (Footnoter, Decisions 16–20).
**Thesis:** AI-multiply a small team into Pokémon-scale output without sacrificing the Mosaic Test. The pipeline turns agent fluency — which by default produces 10× more contradictions than humans can audit — into a governed line where the Council reviews *decisions*, not drafts. FLUX 1.1 Pro Ultra via Replicate is the binding image substrate end-to-end; the legacy `gpt-image-1` substrate is retired.

---

## 1. Canon Council — Operational Structure

Per Decision 10 and R6 §1's TPC-not-WotC lesson, the Council is the *smallest* body that can defend the bible against AI-scale production. Four voting seats with override authority over the founder, from drop one. The four-seat structure is necessary because the Voice Lead role splits at drop one between the four-Universe register editor (agent-assisted) and the Footnoter (hand-written, Topsy-only) — one human cannot do both at the volumes the property requires (see §7).

**Seats (4 voting + 1 floating).**

- **Seat 1 — Chief Worldbuilder (Canon Lead).** Owns the Spine ledger, the 8-shell taxonomy, the Iceberg Doctrine 1:2:4 ratio, the cross-Set tether map. Veto on any card that violates the 4-layer Lampblack stack or a figure's Shell × Character matrix entry. Single-person kill switch on Set locks. 1.0 FTE.
- **Seat 2a — Voice Lead (Editor-in-Chief of flavor text + lore for the four non-Topsy registers).** Owns `FLAVOR-TEXT-DOCTRINE.md` for Baker Street, Enchanted Kingdom, Wonderland, Gothic Horror, and Greek Myth. Owns the four-Universe register bible and the per-Set narrator-voice contracts. Per Decision 14: *rewrite authority on any flavor text up to 24h before Set lock; founder has none*. Agent-assisted — agents draft, Voice Lead edits to bible. 1.0 FTE.
- **Seat 2b — Footnoter (sole hand-writer of all Topsy prose).** Owns the Topsy Footnoter voice end-to-end — every Footnoter flavor text, every Footnoter lore note, the weekly Footnoter Marginalia, the Mirror-Wednesday installments. Hand-written; no agent draft ever ships. The Pratchett-grade register cannot survive writer-rotation, so this seat is the single non-AI-multiplied role on the team (see §7). 1.0 FTE.
- **Seat 3 — Art Director (FLUX Director).** Owns the visual DNA per Universe (Paget / Tenniel / Nielsen / Coppola / Waterhouse → v4 successor register), the taste-model corpus, the moodboard-survey feed, and every FLUX prompt in the `seed-exemplars-flux.mjs` expanded catalog. Veto on any render that fails the taste-loop pre-test or diverges from the five exemplar north-star cards. 1.0 FTE.
- **Seat 4 — CEO (floating, non-voting-by-default).** Present at weekly ritual. Overridable by Seats 1, 2a, 2b, and 3 unanimous. Per Decision 10, the founder *cannot* be the canon authority. CEO votes only on Iceberg ratio breaches and Topsy admission (Decision 16: the 15–25% Topsy band).

**Why four seats, not three.** A three-seat Council with a single Voice Lead committed to ~86,000 words of hand-written Footnoter prose over 36 months *while simultaneously editing the other four Universe registers* is structural magic, not an operational plan — the Voice Lead burns out and the Pratchett-cosplay anti-pattern (NORTH-STAR §11 anti-pattern 2) re-enters as agent draft ships under the seat's name. Splitting into 2a + 2b at drop one preserves the doctrinally-locked 20% Topsy ratio (Decision 16) without overloading one human. Cost: one additional FTE. ROI: the moat actually surviving 36 months.

**Cadence (locked weekly ritual; quarterly deep review).**

- **Monday 10:00 — Council Stand-up (30 min).** Triage the week's card queue. Fast approve / kick-to-revision / reject. Queue is populated by the agent pipeline (see §2) with every card pre-scored against the Mosaic Test, the Lampblack 4-layer stack, and the taste-model. Council reviews exceptions and divergences, not every card.
- **Wednesday 14:00 — Set-Lock Review (90 min).** Any Set due to lock in the next 14 days is walked card-by-card. This is where the Voice Lead exercises the 24-hour-pre-lock rewrite. This is where the Art Director's FLUX batch gets promoted to canonical or sent back.
- **Friday 16:00 — Drop Retro + Iceberg Audit-in-Motion (60 min).** Review the Set dropped that week. Scan Echo/Deep performance (what collectors noticed, what they didn't). Log to `TASTE-MODEL.md`. Flag any residue that escaped containment.
- **Quarterly — Iceberg Compliance Audit (half-day, every 13 weeks = every Series).** Per G1 §3.4 and SET-ROADMAP §6, the 1:2:4 ratio is re-audited per Series. Any quarter that breaches is failed and Sets hold until correction. Per Decision 7.

**The six gates the Council owns.**

1. **Character Admission** — adding a new PD figure to the Shell × Character matrix. Requires Spine doc + 4-layer Lampblack stack + one FLUX exemplar.
2. **Shell Override** — shipping a "No" or "Okay" matrix cell (e.g., Watson-AETHER). Requires a justification doc.
3. **Iceberg Ratio** — any Set breaching 20% Surface budget or <2× Echo-to-Surface is held.
4. **Lampblack 4-Layer Pass** — mechanically enforced in agents, human-reviewed at Set Lock.
5. **Mosaic Test** — per flavor doctrine §5 and A5 Bar 2: 18 of 20 cards Pane-identifiable from prose alone. Blind panel of 3–5 non-narrative staff before drop.
6. **Topsy Admission** — per Decision 16: unanimous Council on the inversion + Footnoter voice sample + one sincere sentence. No auto-approve.

**Authority concentrated, production distributed** — the R6 §1 Pokémon Company structure transplanted at 1/10 scale.

---

## 2. Card-Creation Pipeline — From Brief to Production

Worked example: *"We want a card of Sherlock at Reichenbach."* Nine steps. Each has a named owner (human or agent) and a named tool. This is the pipeline that runs hundreds of times per Set.

**Step 1 — Set Lead files the Card Brief.** Canon Lead or delegated writer files `card-brief.md`: figure (Sherlock), Shell (PRIME), Parallel (ARCANA), Set ID (BS-4), Tier (Ultimate), Moment ("Holmes at the falls"), narrator (Watson), tether (BS-3 Moriarty chessboard; WL-12 future touchpoint), Spine-event-index (BS.Spine.06 — falls-and-returns), and Echo elements that must land in-frame (the cane in the corner; Moriarty's chessboard pattern on the rock below). ~10 min.

**Step 2 — Brief Validator agent runs.** Claude Code on kaaos-daemon validates the Shell × Character matrix (Sherlock-PRIME = Strong → pass), the (Shell × Parallel) non-redundancy rule, the Spine-event-index, and the locked 4-layer Lampblack stack. Rejects before any generation spend. ~30 sec.

**Step 3 — FLUX Prompt Composer agent drafts.** Agent reads the 4-layer Lampblack entry, the art-direction v4 register for Baker Street (Paget-engraving shifted to oil-painted atmosphere), the Parallel (ARCANA — alchemical-sigil composition), the Moment, and the Echo load. Emits a FLUX prompt in binding house style (2:3 portrait, depicted-scene-not-figure-on-gradient per G1 §3.1). Prompt versioned. ~15 sec.

**Step 4 — Taste-loop pre-test.** Prompt runs through the taste-model cosine classifier trained on the `/moodboard` corpus (90% win on mythic-cosmic, 0% on victorian-engraving). Predicted-reject → auto-revise once; still-reject → surface to Art Director before any FLUX spend. Pre-test kill switch (see §5). ~5 sec.

**Step 5 — FLUX 1.1 Pro Ultra batch generation.** `seed-exemplars-flux.mjs` fires via Replicate API, 4 parallel renders per prompt (2:3 portrait, 2048×3072, ultra tier). Renders saved to `public/prototype-art/<set-id>/<card-id>/v<N>/` with full provenance in manifest.json (FLUX version, prompt hash, seed, timestamp). Zero legacy-substrate references. ~90 sec/batch, ~$0.24/card at 4 candidates.

**Step 6 — Art Director selects.** Reviews the 4-render batch in the moodboard harness. Selects one, prompts a revision (loop to Step 3), or kicks all four. Decision logged to `TASTE-MODEL.md`. ~3 min/card.

**Step 7 — Flavor-text composer agent drafts.** Voice-Register agent (prompted with `FLAVOR-TEXT-DOCTRINE.md`, the five register examples, the A1–A12 archetype list, Mosaic Test criteria) drafts 3 candidates: one mode-1 attributed, one mode-2 unattributed, one mode-3 artifact. 8–30 words, median 18. No puns, no quips, no fourth-wall. ~45 sec.

**Step 8 — Mosaic Test auto-scoring + Lore-note composer.** Mosaic Scorer agent masks the art, presents candidates to a held-out LLM panel (Claude, Gemini, a third model, blind), asks which Pane. 2 of 3 → pass; below → flag Voice Lead. Lore-Note composer drafts the 1–2 sentence iceberg pull (*"The cane in the corner of the frame is not the one Watson carried home"*) — Echo-only, never Surface-reveal. ~60 sec.

**Step 9 — Council Set-Lock review + ship.** At the Wednesday 14:00 Set-Lock Review, Council walks the Set. Voice Lead exercises rewrite authority up to 24h pre-lock. Art Director signs the render. Canon Lead signs Lampblack. On unanimous (or 2-of-3 with founder abstention), metadata commits to production catalog (server-backed per G1 §3.5), assets promote to CDN, card enters draw pool. ~10 min human/card at Set-Lock; ~4 min agent/card overall.

**Total per card: ~15–20 min human attention, ~4 min agent work, ~$0.30 FLUX spend.** A 20-Moment Set costs ~6 human-hours across Seats 1, 2a, and 3 (Seat 2b's hours fall on Topsy Sets only) and ~$6 in generation.

---

## 3. Set-Creation Pipeline — 30–100 Cards in 4–6 Weeks

A Set in SET-ROADMAP is 20 Moments (12C / 5R / 2L / 1U). With Parallels on Rare+ (per economy spec), total distinct art pieces per Set ≈ 40–60 when the Parallels are rendered. Average working window: **4 weeks build, 2 weeks lock-and-ship**, dropping on the month specified in the M1–M36 calendar.

**Gantt (one Set, weekly grain):**

```
WEEK 1  SET KICKOFF
  [Mon]  Council kicks Set: Set Lead files Set Brief (20 Moments, narrator, tether, Ultimate)
  [Tue]  Spine audit — each Moment mapped to a Spine event; Echo load assigned (12 Echo / 24 Deep per Series granularity, per G1 §3.4)
  [Wed]  Art Director drafts the Set's visual palette — 3 FLUX test renders for the Universe's visual register in this Set
  [Thu]  Voice Lead writes the Set's voice sample — two "anchor" flavor texts the register-check agent uses as prompt exemplars for the Set
  [Fri]  Set kickoff council stand-up approves palette + voice sample + Spine audit. Set is green-lit.

WEEK 2  CARDS 1–10 GENERATED
  [M-F]  10 Commons run through Steps 1–8 of the card pipeline.
         ~2 hours/day of Art Director attention, ~1 hour/day of Voice Lead attention.
         Nightly: Mosaic Scorer runs on the day's output; any card below 2-of-3 panel → revision queue next morning.

WEEK 3  CARDS 11–20 + PARALLELS
  [M-F]  2 remaining Commons + 5 Rares + 2 Legendaries + 1 Ultimate generated.
         Parallels (ARCANA / AETHER / WITNESS / NEON / 1/1) composed for Rare+ tier per economy spec.
         Total new renders this week: ~25–35.

WEEK 4  ICEBERG AUDIT + MOSAIC TEST + INTERNAL PLAY
  [Mon-Tue]  Iceberg audit: Surface count verified below budget; Echo count ≥2× Surface; Deep references ≥4× Surface. Council sign.
  [Wed]  Full-Set blind Mosaic Test on 3–5 non-narrative staff. Pass bar: 18 of 20 cards Pane-identifiable from prose alone.
  [Thu]  Tether check: cross-Set residues (Moriarty's chessboard → Court of Hearts floor, etc.) verified in-frame.
  [Fri]  Week-4 Council Set-Lock review. Kick-to-revision if any gate fails.

WEEK 5  LOCK + REVISION LOOP
  [M-W]  Any gate failures from Week 4 re-run. Voice Lead exercises 24h pre-lock rewrite. Art Director can swap 1 render max without re-starting the Iceberg audit.
  [Thu]  Final Council lock. Metadata commits to production catalog.
  [Fri]  Assets promoted to CDN. Pack configuration (mint counts per tier, Parallel ladder) loaded. Drop scheduled.

WEEK 6  SHIP + LORE DISPATCH
  [Mon]  Drop day — per SET-ROADMAP M-x calendar.
  [Tue]  Weekly Lore Dispatch email lands for Set subscribers (see §4).
  [Fri]  Drop Retro at Friday Council. What landed, what didn't, Echo performance.
```

Series 1 ships 20 Sets across 12 months (SET-ROADMAP §5), so 2–3 Sets run in flight simultaneously. Steps 2–8 are overnight agent work on kaaos-daemon; human time concentrates at Step 1 (brief), Step 6 (art selection), Step 7 review, and Step 9 (Set-Lock).

**Kill switches.** Any Council seat can pull a Set up to 48h pre-drop. The slot fills with a pre-approved sandbox drop (R6 Lesson 3 — sandbox absorbs overflow, never the spine). Per R6 §2 (Pokémon Sword/Shield), cadence rigidity is the failure mode, not the success mode.

---

## 4. Lore-Layer Pipeline — Long-Form That the Iceberg Pulls Toward

The card is the Surface. The lore layer is where Echo and Deep live — and per A4 §2 and G1 Move 4, a Dracula-Daily-analogue serialized email is the funnel wedge. Two pipelines run in parallel: the **Footnoter Daemon** (card-level Echo surfacing) and the **Newsletter Pipeline** (serialized Echo + Deep). **Both.**

**Footnoter Daemon.** Background process on kaaos-daemon. Input: every card that ships. Output: a weekly marginalia digest — the Footnoter's (Topsy Sets) or the universe-native narrator's (non-Topsy) commentary. Not a recap. A *residue note* per card: "The cane Watson did not carry home in BS-1 is the cane the Wolf passed over in EK-3. No one has said this. No one is going to." Voice Lead reviews every Friday at Drop Retro; publishes as free weekly web post Sunday 08:00. ~12 posts/Set, ~240/year, 300–600 words each. Agent-drafted, Voice-Lead-edited — except Topsy Marginalia, which is Voice-Lead-written end-to-end (see §7).

**Newsletter Pipeline — *Jonathan's Journal* and the serialization family.** Per G1 Move 4 and A4 §7 opp-1. Four serials rotate:

- **Jonathan's Journal** (May 3 – Nov 7) — Dracula's 1897 epistolary re-emitted on canonical dates. Surface-layer for GH-1.
- **Watson's Casebook** (rolling, fortnightly) — unpublished Holmes fragments, aligned to the BS Set calendar. Mix of mode-1 (attributed Watson) and mode-3 (cab receipts, telegrams).
- **The Persephone Almanac** (solstice/equinox cadence) — bronze-tongue chorus fragments, 12 entries/year.
- **The Footnoter's Marginalia** (Topsy weeks) — the weekly posts above, emailed.

**Newsletter agent.** A Claude Code agent on kaaos-daemon ingests source text (public-domain novel for *Jonathan's Journal*; Voice-Lead originals for the others), renders per-date entries in the Universe's voice register, cross-links to shipped cards, queues the send. Voice Lead approves the week at Monday stand-up. Plain SMTP via Postmark or Resend; no CRM chrome.

**Monetization tether.** Per G1 Move 4: illustrated card unlocks per chapter. When the May 25 *Jonathan's Journal* entry (Lucy's first bite) lands, a gated Common-tier Moment from GH-1 opens for $9. Optional. Never interrupts the read. The serialization *is* the funnel; the card *is* the paywall.

---

## 5. Taste-Loop Integration — How the Moodboard Feeds the Pipeline

Per G1 §3.7 and A3 §6. The moodboard is currently conflated survey + generation harness (A1 §6 debt-3). Split it. Two surfaces, one daemon.

**Surface 1 — `/moodboard` survey.** Continuous taste capture. The CEO and Council-seats rate every new render (pass / fail / context note) as they land. Optional open-participation panel (3–5 non-narrative staff on rotation) adds noise-robust signal. The survey writes to `TASTE-MODEL.md` via the moodboard-kv lib (A1 §7 strength-7). Sample rate target: 50–100 rated renders per week.

**Surface 2 — `/generation` harness.** FLUX prompting playground for Art Director exploration. Outputs tagged as experimental, never promoted to canonical without full pipeline passage.

**The daemon loop — the pipeline's feedback mechanism.**

1. **Continuous ingest.** New ratings from `/moodboard` flow into `TASTE-MODEL.md` hourly.
2. **Weekly model refresh.** Every Sunday 22:00, the taste-model classifier re-trains (embeddings-based cosine similarity on 200+ recent ratings). New model snapshot versioned.
3. **Pre-test injection.** Step 4 of the card pipeline (above) calls the latest taste-model snapshot. Every FLUX prompt scored *before* generation. Prompts predicted-reject at >80% confidence are auto-revised once; still-rejected prompts flagged to the Art Director.
4. **Monthly drift report.** Agent emits a drift report to Council: which registers are winning, which are losing, what the taste-gradient is shifting toward. Council uses this to update the art-direction v4 doc.

**Pre-test failure — what happens.** Three tiers of failure response:

- **Soft fail (60–80% predicted-reject confidence):** prompt auto-revised by the FLUX Prompt Composer agent, re-scored, proceeds if threshold cleared.
- **Hard fail (>80% predicted-reject):** prompt surfaced to Art Director in the morning queue. Art Director either accepts (forces through — logs the override to train next model cycle) or revises manually.
- **Repeated hard fail on same character/Shell cell:** this is the *signal the Shell × Character matrix needs review*. Council escalates. If a Shell consistently loses, downgrade the cell from Strong to Okay in the next matrix refresh.

**Kill switch on a card — the full escalation path.**

1. Any agent step fails (Brief Validator, Mosaic Scorer, taste pre-test) → card returns to the Art Director or Voice Lead automatically.
2. Art Director or Voice Lead pulls a card at Council Set-Lock Review → card is held, Set continues without it (if below budget) or is pushed a week (if at budget).
3. Canon Lead or CEO invokes emergency kill post-lock → card is rolled back from CDN within 2h; drop continues with one less Moment in rotation. This has never been tested in production; the pipeline is designed so it shouldn't be needed.

The taste-loop is the *continuous governance* layer that prevents AI fluency from eroding the bible over 36 months. Without it, the doctrine is a static PDF; with it, the bible *learns* as the audience converges.

---

## 6. AI-Augmented Production Output — The Monthly Target

The credible monthly output, given a 3-person Council + 2 writers + 1 art director + 1 ops engineer (7 FTE) on the described pipeline:

**Cards/month.**
- **Sustained steady-state:** 40–60 *unique Moments* per month (enough to ship 2 Sets/month at 20 Moments each per SET-ROADMAP §5 cadence).
- **With Parallels:** 100–150 *distinct art pieces* per month (Rare+ Moments get 1–3 Parallels each).
- **Total catalog over 36 months:** 1,200 Moments × ~3 Parallels avg on Rare+ = **~3,600 distinct renders**, matching the SET-ROADMAP §5 target.

**Lore-words/month.**
- **Flavor text:** 60 Moments × 18 words median = ~1,100 words/month.
- **Lore notes:** 60 × 30 words = ~1,800 words/month.
- **Footnoter weekly posts:** 4 × 500 = ~2,000 words/month.
- **Newsletter serializations:** Jonathan's Journal ~1,500 words/week × 4 = ~6,000; Watson's Casebook ~1,500/fortnight × 2 = ~3,000; Persephone Almanac ~800/month; Marginalia already counted.
- **Total shipped lore-words/month:** **~15,000** on steady state. **~180,000/year.** That is roughly a novel a year of original public-facing lore, on top of the card corpus, on a 7-FTE team.

**Drops/month.**
- **Canonical drops:** 1.7/month average (20 Sets/year in Series 1 per SET-ROADMAP).
- **Sandbox drops (non-canon — R6 Lesson 3 safety valve):** up to 1/month additional, Council-rated as adjacent. Holiday editions, partner collabs, Topsy one-offs outside the 20% allocation. Never advance the spine.

**Comparison to incumbents:**

| Franchise | Cards/year | Lore-words/year | Team size | Per-FTE output |
|---|---|---|---|---|
| **Pokémon TCG** | ~1,200 (4 expansions × ~300 cards) | Low — flavor is Pokédex, not arc-driven | Creatures Inc. + TPC oversight, ~150 FTE | ~8 cards/FTE/year |
| **Magic: The Gathering** | ~1,200 (4 Premier × ~280) | ~200–400K (web fiction + flavor) | WotC Creative Studio ~50 FTE | ~24 cards/FTE/year, ~5K words/FTE/year |
| **Marvel Phase 5–6** | N/A (films) | N/A | Studio parliament 5–8 + production teams | N/A |
| **LoreVault Year 1** | ~500 Moments + ~1,200 Parallels = ~1,700 renders | ~180K lore-words | 7 FTE | **~240 renders/FTE/year, ~25K words/FTE/year** |

**Where we sit:** Per-FTE production is ~10× Pokémon's card density and ~5× MTG's word density — the AI multiplier. *Total* output is ~70% of one MTG expansion-year on a team 1/7 WotC's Creative Studio. The binding constraint is not generation; it is **Council review bandwidth**. Steady state caps at ~60 Moments/month because that is what the four voting seats (1, 2a, 2b, 3) can defend at Set-Lock without skipping Mosaic — Seat 2b's bandwidth concentrates on Topsy Sets, where its hand-written prose is non-fungible. Scaling past requires an additional voting seat — planned for Series 2 mid-point.

**AI-augmented, not AI-only.** Every card has human judgment at four points (Steps 1, 6, 7, 9); every Set has it at the weekly ritual, Iceberg audit, and Mosaic panel. Agents *produce volume*; humans *enforce the bible*.

---

## 7. Topsy Production Exception — The Footnoter Must Speak With One Voice

Topsy Sets do not go through the standard card-creation pipeline at Step 7 (flavor-text composer). Per TOPSY-REGISTER Decision 17 and the CEO's *"did you make this up?"* test (A5 §4), the Footnoter's voice is the moat — and the moat requires **a single human voice-writer** for every Footnoter line across the entire 36-month catalog. No agent-drafted Footnoter prose ships.

**The rule.** **Seat 2b (the Footnoter)** is the *sole* writer of every Footnoter flavor text and every Footnoter lore note, for every Topsy Set, for the life of the property. The role exists as its own Council seat precisely because the volume — ~14,400 words of Footnoter flavor + lore over 36 months on Topsy Sets, plus ~72,000 words of Footnoter Marginalia — cannot survive being a side gig to the four-Universe Voice Lead role (Seat 2a). Splitting Seat 2 into 2a (Voice Lead, agent-assisted, four registers) and 2b (Footnoter, hand-written, Topsy-only) is what makes the 20% Topsy band (Decision 16) sustainable for 36 months without burnout. If Seat 2b rotates out, the incoming seat does a 90-day apprenticeship on sample-Set Footnoter writing, reviewed by the outgoing Footnoter, before any live Set ships in the new hand. This is the Pratchett lesson — the Footnoter's dry-omniscient-intermittently-sentimental register cannot survive writer-rotation, because the voice is the joke and the sincerity is the reveal.

**How the pipeline adapts for Topsy.**

- **Step 1 (Brief):** the brief includes the Topsy axis-flip (per TOPSY-REGISTER table — e.g., *"Sherlock's deductive uniqueness becomes deductive ubiquity"*) and the one-sincere-sentence-target per Decision 19.
- **Step 2 (Validator):** additionally checks Decision 18 (no PRIME), Decision 16 (within the 15–25% band), and Decision 20 (Set name telegraphs joke without explaining).
- **Steps 3–6 (Art):** proceed normally. Topsy art uses the +ARCANA-as-bureaucratic-mandala or WITNESS-for-satire registers per doctrine.
- **Step 7 (Flavor text):** **agent drafts nothing.** Seat 2b (the Footnoter) writes every Footnoter line by hand. The agent's job is to *fact-check against the bible* (Lampblack layers intact, one-sincere-sentence present, no internet-meme cadence, no "lol" energy) and *surface violations*. Never to draft.
- **Step 8 (Mosaic Scorer):** replaced with the **Topsy Voice Test** — a blind LLM panel is asked "Is this in the Footnoter's voice, or is it a generic attempt at Pratchett?" Pass bar: 3 of 3 panelists vote Footnoter. If any panelist fails, Seat 2b rewrites.
- **Step 9 (Council):** all four voting seats unanimous required (no abstention substitutes for a vote). The CEO's *"did you make this up?"* test is the final human gate.

**Cost trade-off.** Topsy production at scale — ~14,400 words of flavor + lore over 36 months across 12 Topsy Sets, plus ~72,000 words of weekly Footnoter Marginalia — is roughly a novel-and-a-half of Pratchett-grade prose by one hand. That is full-time work; it is not a 35%-time side gig to running four Universe registers. Seat 2b absorbs that load; Seat 2a (Voice Lead) absorbs the four non-Topsy register editing across the same 36 months without burnout risk. Every other seat AI-multiplies; Seat 2b does not — that is the moat. The moat costs one additional human salary versus a three-seat Council; the ROI is Magic-level volume with a register Magic's bible forbids, sustained for the life of the property.

---

## Verification

All 7 sections present. Card pipeline = 9-step list + gantt-style Set pipeline = 6-week table. Council operating cadence: Mon/Wed/Fri weekly + quarterly Iceberg audit. Production targets quantified: 40–60 Moments/month, ~15K lore-words/month, 1.7 canonical drops/month, with Pokémon + MTG comparison table. FLUX/Replicate canonical end-to-end; legacy substrate retired. Human override points: Steps 1, 6, 7, 9 of card pipeline; Weeks 4–5 of Set pipeline; three-tier taste-loop response; unanimous Council on Topsy.

*— R4, Content Pipeline Designer, 2026-04-24*
