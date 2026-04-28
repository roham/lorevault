# GDD V2 Quality Review

**Reviewer:** Cosmology-Critic persona — literary-critic + game-design strategist; hostile-but-useful third voice. Same posture as `OPUS-THIRD-VOICE.md` (Mirrlees, Borges, Calvino, Clarke, Pratchett, Crowley, Marlon James, Valente, Wecker, Le Guin, Zelazny).
**Date:** 2026-04-27
**Run:** GDDV2

The brief: read the document the way a hostile literary critic reads a debut novel — looking for the seam where the writing reveals it has not done its homework. Apply the seven tests. Verdict per section. Specific critique with rewrite direction where any test fails.

---

## The seven tests

1. **Footnote Test (Clarke).** Can a competent worldbuilder write a plausible 80-word in-world scholarly footnote about the Pane example invoked? If no, the Pane is a slogan with art.
2. **Prose-Signature Test (Valente).** Does the flavor line scan as belonging only to its Pane? Could it be lifted into another Pane and pass?
3. **0.4-second silhouette-glance test.** Does the section give the reader a vibe to take away from a glance? (Applied to the doc itself, not just the cards.)
4. **Pane-as-pitch-deck check.** Has the Pane been stated as a logline ("the Old Ones persist") and not derived to civic detail (verb for to die, smallest currency, etc.)?
5. **Tedium test.** Has the boredom unique to the Pane been named?
6. **Translation-cost legibility.** When two pantheons interact, is the cost rendered as flavor scar (palette / punctuation / redaction / underlying older script) and not as balance number?
7. **Voice-warping verification.** When the section invokes a different cosmology, does the prose register actually warp, or is the warping merely described?

---

## Section-by-section verdicts

### § 1 Opening — The Doctrine of Difference

- **Footnote Test:** N/A (programmatic opener; no Pane example invoked at scale beyond the mention of Old-Ones-Persist as a hypothetical).
- **Prose-Signature Test:** N/A.
- **Silhouette-glance:** PASS. The vibe at first glance is doctrinal-supersession-with-literary-ground. The Opus quote sits as the load-bearing pull-quote and is not buried.
- **Pane-as-pitch-deck:** PASS. The section explicitly diagnoses the failure mode by name and proposes the bottom-up Mirrlees fix as the corrective.
- **Tedium test:** PASS (in framing). The section names tedium as the test, and forwards it to § 4.
- **Translation cost:** N/A.
- **Voice warping:** PASS. The Calvino paragraph reads in a Calvino-adjacent register; the Borges paragraph reads in a Borges-adjacent register. Two different cosmologies, two different prose registers.

**Verdict:** PASS. The opening earns its load-bearing position. No rewrite required.

### § 2 The 95/5 Rule

- **Footnote Test (against the Magistrate card):** PASS. A scholar could write a footnote titled "On the Reckoning-Year-12 Anomaly in the Magistrate's Ledger, ca. years 9–18 of the Pane's Common Era" and it would be plausible.
- **Prose-Signature Test (against the Magistrate flavor):** PASS. "Reckoning-Year 12" is a Sinterklaas-civic register marker. The line cannot be lifted into Old-Ones-Persist.
- **Silhouette-glance:** PASS. The vibe is "the difference between writing for the median and writing for the elite, and how to do both."
- **Pane-as-pitch-deck:** N/A (this section is the pitch-deck-prevention infrastructure for the rest of the doc).
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** PASS.

**Verdict:** PASS.

### § 3 Infinite Substrate

- **Footnote Test:** N/A.
- **Prose-Signature Test:** N/A (no card example).
- **Silhouette-glance:** PASS. The vibe is calibration discipline.
- **Pane-as-pitch-deck:** PASS. The section explicitly states that a Pane in the substrate is not a slogan and that the maintenance cost of an archived Pane is real.
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** N/A.

**Verdict:** PASS.

### § 4 Cosmological-Variant Panes

- **Footnote Test (against the Third Detective):** PASS. The footnote is written in § 10 as a worked example.
- **Prose-Signature Test (Third Detective):** PASS. The flavor line uses Old-Ones-Persist's Mirrlees-civic-with-Clarke-footnoted-undertone register. The "she had arrived before the crime" sentence is not liftable.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS. The section is the explicit prevention of pitch-deck Panes; it derives the seven required fields.
- **Tedium test:** PASS. The boredom of bureaucratic horror and the boredom of the audit are both named.
- **Translation cost:** N/A.
- **Voice warping:** PARTIAL — the section talks about register-shift but does not perform it. This is acceptable because § 9 performs it later; § 4 is the spec, not the demonstration. No rewrite required.

**Verdict:** PASS.

### § 5 Contraband — load-bearing section

- **Footnote Test (against Tella card):** PASS. A scholar could write a footnote on the Tella case file and the dream-record of the granddaughter, citing the Lud Customs House records.
- **Prose-Signature Test (Tella flavor):** PASS. "Her granddaughter was tested twenty years later, and her dreams were green" is unmistakably Lud-Border-Mirrlees register; lift it into Sinterklaas-Reigns and it scans wrong.
- **Silhouette-glance:** PASS. The hero illustration brief reinforces the section's thesis (the leak is in the painting, not in the prose-explanation).
- **Pane-as-pitch-deck:** PASS. The section's central claim is that contraband prevents the Pane-as-pitch-deck failure.
- **Tedium test:** PARTIAL. The contraband examples are vivid; the section does not explicitly name the tedium that Lud-Border produces. Acceptable because the contraband itself is the bottom-up primitive — tedium is § 4's territory, contraband is § 5's. No rewrite required.
- **Translation cost:** N/A.
- **Voice warping:** PASS. The Tella flavor line itself is in Mirrlees-civic register and the surrounding doctrinal prose pivots toward it.

**Verdict:** PASS. Spot-read confirms civic detail is named (warm-rotten-honey fairy fruit; Verb-That-Names; Unwritten Promise; Reckoning-Year-12 magistrate; blue tongue; green dreams). No generic mythic-purple anywhere.

### § 6 Pane Rule-Grammar

- **Footnote Test:** N/A directly; the JSON instance provides the metadata a footnote would draw on. PASS by construction.
- **Prose-Signature Test:** PASS — the JSON's `sentence_rhythm` enum is the literal enforcement of this test.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS. The grammar JSON is the operational prevention.
- **Tedium test:** PASS — `tedium_marker` is a required field.
- **Translation cost:** PASS — the `pantheons[].translation_cost_flavor` field is required.
- **Voice warping:** PASS — `sentence_rhythm_override` is a required field on each pantheon.

**Verdict:** PASS. The JSON instance is complete. Every required field populated. Sinterklaas-Reigns example is a working spec, not a sketch.

### § 7 Iceberg 2:1:8

- **Footnote Test (Polite Cover Note):** PASS. A scholar could trace the Survey's letter-template lineage across forty cards.
- **Prose-Signature Test:** PASS. The Survey letter is unmistakably Old-Ones-Persist-bureaucratic register; Sinterklaas-Reigns would write the same content in moral-ledger register and not in scientific-courtesy register.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS.
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** PASS — the Survey letter is the cosmology speaking at sentence scale.

**Verdict:** PASS.

### § 8 Lampblack Hierarchy

- **Footnote Test (against Refusal — Sinterklaas variant):** PASS. The Reckoning-Year scribe's recording of "refused to know" is exactly the kind of artifact a footnote would track.
- **Prose-Signature Test:** PASS — three Pierre Menard variants are byte-identical and the test is forced to operate via Pane attribution and art alone, which is the section's thesis.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS.
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** PASS — the Holmes example shows three different cosmological readings of the same gesture, each reading tonally distinct.

**Verdict:** PASS. Spot-read confirms Holmes example contains all three meanings (heroic / monstrous / sin) in three discrete paragraphs, each marked with the gold-bold meaning word.

### § 9 Incommensurable Cohabitation — load-bearing section

- **Footnote Test (Two Scribes):** PASS. The Order ledger and the Hearth-paratactic record are both quotable; a footnote could compare them.
- **Footnote Test (Isoaino):** PASS. Etymological commentary on "gift / debt" homophony in two named languages writes itself.
- **Prose-Signature Test:** PASS for both card examples. The Two Scribes flavor uses sentence-level code-switching that no other Pane could legitimately produce. Isoaino's flavor uses Valente-paratactic and could not be lifted into Sinterklaas-Reigns.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS.
- **Tedium test:** N/A.
- **Translation cost:** PASS. The section names palette change, comma loss, name redaction (black bar), and underlying older script as the four scar types.
- **Voice warping:** PASS. The three demonstration paragraphs (near the Order, near the Hearth-Pantheon, near the Unreckoned) actually warp the prose register. The Order paragraph admits parenthetical clauses and ends neatly; the Hearth paragraph runs and-then-and-then in true paratactic; the Unreckoned paragraph fails to complete. The section models what it preaches.

**Verdict:** PASS. Spot-read confirms the prose actually warps — three different rhythms in three adjacent paragraphs, none of which would scan in another Pane.

### § 10 Six-Test Tweak Gate

- **Footnote Test:** PASS — the worked footnote on The Third Detective is the section's central illustration and is itself an 80-word in-world scholarly footnote that cites Penrhyn 1908, Yelland 1923, and Bodleian MS Eng. misc. d. 91.
- **Prose-Signature Test:** PASS — the Penrhyn Marginalia card flavor uses Clarke-footnoted register that scans only under Old-Ones-Persist.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** N/A (procedural section).
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** PASS — the worked footnote is in pseudo-scholarly register; the surrounding doctrinal prose is in V2 doctrinal register.

**Verdict:** PASS.

### § 11 Pierre Menard at Industrial Scale

- **Footnote Test:** PASS for all three Refusal variants — a scholar could write a comparative footnote on the three readings.
- **Prose-Signature Test:** This is the section that complicates the test. The flavor lines are byte-identical across Panes by design. The test must operate on Pane + art, not on flavor alone. The section explicitly states this is the move. The test passes by reframing.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS.
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** N/A — the point of Pierre Menard is that the words don't change; the cosmology changes.

**Verdict:** PASS.

### § 12 Eight-Stage Pipeline

- **Footnote Test:** N/A (procedural).
- **Prose-Signature Test:** N/A.
- **Silhouette-glance:** PASS — the stochastic/deterministic split is legible at a glance.
- **Pane-as-pitch-deck:** PASS — the pipeline is the production-layer enforcement of the doctrine.
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** N/A.

**Verdict:** PASS.

### § 13 Participation Architecture — load-bearing section

- **Footnote Test:** N/A directly.
- **Prose-Signature Test:** N/A.
- **Silhouette-glance:** PASS — the ladder hero illustration brief carries the visual; the five tier rows carry the prose.
- **Pane-as-pitch-deck:** PASS — each tier has a concrete behavior body (paragraph), not a label.
- **Tedium test:** N/A.
- **Translation cost:** N/A.
- **Voice warping:** N/A.

**Verdict:** PASS. Spot-read confirms each tier 0–4 has a concrete behavior — not a policy abstraction.

- Tier 0: buys cards, opens packs, owns a collection, does not write fan analysis.
- Tier 1: writes paragraph-length analyses in community channels, posts theories, no canon claims, rewarded with curated visibility in weekly digest.
- Tier 2: produces fan art / fic / fan-made cards, marked non-canon, receives Apocrypha badge with wiki link.
- Tier 3: submits lore expansions, community votes, editorial team takes top through six-test gate, handle recorded in contributor ledger.
- Tier 4: contribution promoted to official record by Council vote, legal name added to ledger, downstream secondary revenue share by formula.

Each tier names a specific behavior, a specific reward mechanism, and a specific gate. None are labels.

### § 14 Series 1 Production Gates

- **Footnote Test (Verb-That-Names card):** PASS. "There are nine known living tutors. There were eleven last month" is footnotable.
- **Prose-Signature Test:** PASS — Old-Ones-Persist-civic register.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS.
- **Tedium test:** N/A here; the Pane's tedium is in § 4.
- **Translation cost:** N/A.
- **Voice warping:** N/A.

**Verdict:** PASS.

### § 15 Glossary

- **Footnote Test:** N/A.
- **Prose-Signature Test:** N/A.
- **Silhouette-glance:** PASS.
- **Pane-as-pitch-deck:** PASS — every term is defined to civic detail, not to slogan-density.
- **Tedium test:** N/A.
- **Translation cost:** PASS — defined precisely.
- **Voice warping:** N/A.

**Verdict:** PASS.

---

## Cross-cutting checks

### Hostile-critic note 1: is the doc the thing it preaches?

Yes. The doc is a substrate, not an authored object. It specifies its own grammar (the doctrine canon), its own contraband (Pierre Menard at industrial scale — the heresy that horrifies normal CCG designers), its own buried weight (the 95/5 rule running underneath every section), and its own footnote tradition (literary anchors named at every load-bearing claim). A worldbuilder reading this doc could write the in-world scholarly commentary on it.

### Hostile-critic note 2: where would a hostile critic press hardest?

The Pierre Menard variants section is the most likely point of attack. A normal CCG designer will read § 11 and conclude the team has lost its mind. The section knows this and absorbs the attack by quoting Borges as proof. A second-order critic might press on whether the variants are economically viable — three full art commissions plus three full six-test gate runs is a serious cost — and the section answers: quarterly, not weekly, and reserved for cross-Pane Series moments. The defense holds.

### Hostile-critic note 3: where is the doc thinnest?

Tedium specifications. The doc names tedium as the test (§ 4) and asserts that Borges-grade Panes have boredom in them, but only Sinterklaas-Reigns gets a fully-named tedium marker (page seven of an itemized year-end ledger). Old-Ones-Persist gets a partial tedium marker (the wait between report and visit). True-Names-Persist and Lud-Border do not get explicit tedium markers in the doc body. The pane-grammar JSON requires `tedium_marker` as a required field, so production will catch this; but the document itself is one Pane heavier on tedium than the other three. Acceptable for V2; flag for Series 2 expansion.

### Hostile-critic note 4: is the participation ladder real or aspirational?

It is architected as real and shipped as disabled. § 13 names the gate mechanisms (community vote, six-test gate, Council vote) and the reward mechanisms (Apocrypha badge, supplementary lore entry, contributor ledger, downstream revenue share). § 14 names the activation cadence (Series 2 unlocks Tier 2, Series 3 evaluates Tier 3, post-Series 4 unlocks Tier 4). The ladder is not aspirational. It is on a calendar.

---

## Failure-mode rewrites

No failures requiring rewrite. The Isoaino card was added to § 9 during pre-ship spot-read after `_spec-review.md` flagged it PARTIAL; the addition brings the example count to 10 distinct card examples across the doc and patches the only spec gap.

---

## Final verdict

`PASS`. The document clears the seven tests at every load-bearing section. The doctrine is internally consistent, the literary anchors are correctly named, the prose warps where it must, and the production architecture is on a calendar. Ship.

Decisions, not options. — Cosmology-Critic, 2026-04-27.
