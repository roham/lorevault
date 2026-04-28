# LoreVault GDD V2 — Changelog

**V1 ship:** 2026-04-26 — `src/app/v3/gdd/page.tsx` (preserved as historical record)
**V2 ship:** 2026-04-27 — `src/app/v3/gdd-v2/page.tsx` (authoritative)
**Doctrine source:** `kaaos-knowledge/answers/lorevault-second-opinions/2026-04-27/OPUS-THIRD-VOICE.md`
**Branch:** `gdd-v2-rewrite`

GDD V2 supersedes GDD V1 entirely. The V1 page remains live for historical traceability and is no longer the authoritative source. The ten architectural diffs and three new sections below are the public-facing summary of what moved.

---

## Ten Architectural Diffs

### Diff 01 — Five Universes → Infinite Substrate
- **V1:** Five named Universes treated as filing-cabinet shelving (Doyle / Old-Ones / Sinterklaas / Norse-Skin / Solomon-Codex).
- **V2:** Infinite substrate of cosmological-variant Panes. Three to five active per Series with archetype shape: 1 Tentpole, 2 Adjacent, 1 Foil, 0–1 Wildcard. Two Series per year. Six to ten Panes activated per year. Thirty to fifty in substrate over five years. Three Panes max in active live-ops at any time.
- **Anchor:** Calvino, *Invisible Cities* (Venice as underlying substrate).
- **Section:** § 3 Infinite Substrate.

### Diff 02 — Universes-as-IP-Buckets → Cosmological-Variant Panes
- **V1:** Universes mapped to license-bucket shelves. Cards belonged to the Doyle bucket, the Cthulhu bucket, etc.
- **V2:** Panes are cosmological variants — the same world experienced under a different metaphysical pressure. Multi-pantheon coexistence within each. Cards carry Pane attribution, never IP-bucket attribution.
- **Anchor:** Borges, *Tlön, Uqbar, Orbis Tertius* (idealism derived to grammar and material).
- **Section:** § 4 Cosmological-Variant Panes.

### Diff 03 — Top-Down Cosmology → Bottom-Up Contraband
- **V1:** Cosmology framed top-down through "the Lattice and the Lampblack" as governing axioms.
- **V2:** Each Pane requires a contraband — a specific, named, civic, smuggleable thing (a fruit, a verb, a color, a name) that the world's law forbids and that is nevertheless eaten, said, mixed, pronounced, pulled across the border. The cosmology emerges as the leak's source. The rare card economy rides on the contraband.
- **Anchor:** Mirrlees, *Lud-in-the-Mist* (forbidden fruit, missing word, banned color).
- **Section:** § 5 Contraband.

### Diff 04 — One Verb per Pane → 3–5 Element Rule-Grammar
- **V1:** One mechanical thesis per Pane, expressed as a single verb.
- **V2:** Three-to-five-element rule-grammar per Pane, recitable from memory by every designer. Stated in pane-grammar JSON form as the system prompt for the live-ops generation pipeline. Sinterklaas-Reigns example: `[moral-ledger, gift-as-trap, witnessing, reckoning, surveillance]`.
- **Anchor:** Le Guin, *Earthsea* (true-names + balance + the unmade); Pratchett, Witches (headology + borders + names + what you can and cannot afford to take seriously).
- **Section:** § 6 Pane Rule-Grammar.

### Diff 05 — Iceberg 1:2:4 → Iceberg 2:1:8
- **V1:** Worldbuilding ratio 1 surface : 2 echo : 4 deep, inherited from novelistic worldbuilding.
- **V2:** Recalibrated to 2 surface : 1 echo : 8 deep. Surface over-weighted because cards travel alone. One buried weight per Pane. The eight deep parts are not eight mysteries — they are eight facets of one weight. Cards that add parallel mysteries are cut at stage seven of the pipeline.
- **Anchor:** Mirrlees, *Lud-in-the-Mist* (Faerie as one buried weight); Le Guin, Earthsea (the Unmade); Tolkien comparison (Silmarillion ~1:5:30 — opposite extreme, wrong for cards).
- **Section:** § 7 Iceberg 2:1:8.

### Diff 06 — Lampblack Prop-First → Gesture-First Hierarchy
- **V1:** Lampblack residue ordered prop-first (pipe → wound → gesture).
- **V2:** Reordered: Gesture > Cosmological-relation > Wound > Forbidden-act > Role > Silhouette > Prop. Two of the top three appear in every cross-Pane variant. Props used at most every other variant.
- **Anchor:** Crowley, *Little, Big* (same gesture, different cosmological pressures); Borges, *Pierre Menard*.
- **Section:** § 8 The Lampblack Hierarchy.

### Diff 07 — Jurisdictional Pantheons → Incommensurable Cohabitation
- **V1:** Multi-pantheon model framed jurisdictionally — pantheons compete over metaphysical rights (death / oath / sacrifice / calendar) like a court.
- **V2:** Incommensurable cohabitation. Different mythic systems share the same ground while operating on incompatible logics. Prose warps locally near each pantheon (sentence rhythms code-switch). Translation cost rendered as flavor scar (palette change, punctuation loss, name redaction, underlying older script), not balance number.
- **Anchor:** Marlon James, *Black Leopard, Red Wolf* (incommensurability, code-switching); Wecker, *The Golem and the Jinni* (per-card density, restraint to 3–5 pantheons per Pane).
- **Section:** § 9 Incommensurable Cohabitation.

### Diff 08 — Four-Test Gate → Six-Test Gate
- **V1:** Four-test gate: Recognition / Necessity / Consequence / Voice-Inevitability.
- **V2:** Plus Footnote Test (Clarke) and Prose-Signature Test (Valente). Six tests total. The two added tests are generative, not gating — they check for the presence of life, not the absence of failure.
- **Anchor:** Clarke, *Jonathan Strange & Mr Norrell*, *Piranesi* (footnote as worldbuilding artifact); Valente, *Deathless*, *In the Night Garden* (sentence rhythm carries cosmology).
- **Section:** § 10 The Six-Test Tweak Gate.

### Diff 09 — No Participation → Five-Tier Architecture
- **V1:** No participation architecture. Product was an authored object.
- **V2:** Five-tier ladder (Tier 0 reader-at-the-window through Tier 4 named-contributor with downstream secondary revenue share). Series 1 ships participation-disabled with the ladder visible. Tiers open across Series 2–4.
- **Anchor:** SCP Foundation / Homestuck / RWBY / Worm — the actual competitive frame.
- **Section:** § 13 Participation Architecture.

### Diff 10 — One-Shot Card Creation → Eight-Stage Pipeline
- **V1:** Card creation as one-shot brief.
- **V2:** Eight-stage pipeline. Stochastic stages 2 / 3 / 4 / 5 (figure / axiom / flavor / art). Deterministic stages 1 / 6 / 7 / 8 (grammar-lock / six-test gate / iceberg audit / release cut). The deterministic frame is where the cosmology is defended; the stochastic block is where life lives.
- **Section:** § 12 The Eight-Stage Pipeline.

---

## Three New Sections

- **§ 2 The 95/5 Rule.** Architecture must deliver mythic-invariant satisfaction at 0.4-second silhouette-glance for 95% of collectors and reward the interpretive 5% with the buried weight. First-class section.
- **§ 6 Pane Rule-Grammar as Machine-Readable Spec.** Includes a complete pane-grammar JSON example for Sinterklaas-Reigns. The grammar IS the system prompt for the 2027-vintage AI ops generation pipeline.
- **§ 13 Participation Architecture.** Five tiers with concrete behaviors, not policy abstractions.

---

## Load-Bearing Reframings (Opus, 2026-04-27)

- "The rule is not 'make it different.' The rule is: make the difference reveal the world." (Verbatim at GDD V2 hero.)
- "Pane-as-pitch-deck is the failure mode, not Pane-inflation. Heresy without leak is theology. Cards live at the leak." (§ 5)
- "If your axiom doesn't tell the cards what time of day it is, what people fear in the third hour after midnight, what verbs are used for 'to die' — it is a logline, not a cosmology." (§ 4)
- "Coexistence is INCOMMENSURABLE COHABITATION, not jurisdictional." (§ 9)
- "Hire prose stylists, not lore writers. Pay them more than the artists." (§ 10)
- "Lampblack is the darkening of the gesture under a new cosmology. At high rarity, ship literally identical card text varying only by Pane attribution. This will horrify a normal CCG designer. It is correct." (§ 8, § 11)

---

## Files Touched

- `src/app/v3/gdd-v2/page.tsx` — main page
- `src/app/v3/gdd-v2/_doctrine.json` — doctrine source (already shipped)
- `src/app/v3/gdd-v2/_illustrations.json` — illustration briefs
- `src/app/v3/gdd-v2/_spec-review.md` — spec checklist
- `src/app/v3/gdd-v2/_quality-review.md` — quality review
- `src/app/v3/gdd-v2/_changelog.md` — this file
- `src/components/gdd-v2/shared.tsx` — palette, atoms, CardExample, CodeBlock, IllustrationPlaceholder, TierRow
- `src/components/gdd-v2/GDDv2Content.tsx` — content composer
- `src/components/gdd-v2/sections/01-opening.tsx` through `15-glossary.tsx` — fifteen sections

---

Decisions, not options.
