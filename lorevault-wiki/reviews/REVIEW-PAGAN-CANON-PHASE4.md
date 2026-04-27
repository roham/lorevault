# REVIEW — PAGAN-CANON PHASE 4 DOCTRINE REWRITES

**Date:** 2026-04-27
**Reviewer:** Quality Gate, Phase 4 Bundle
**Scope:** Four Phase 4 doctrine rewrites against the Phase 2 master architectural document (`MULTIVERSE-COSMOLOGY-DOCTRINE-V2.md`).
**Documents reviewed:**
1. `narrative/SET-ROADMAP-V2.md`
2. `economy/GAME-ECONOMY-DESIGN-V2.md`
3. `specs/PHASE-04-CARD-FRAME-SPEC-V2.md`
4. `specs/PHASE-09-PRODUCTION-BRIEF-V2.md`

---

## 1. Internal Consistency

### 1.1 Pane naming — SET-ROADMAP-V2 vs. MULTIVERSE-COSMOLOGY-DOCTRINE-V2

**STATUS: Consistent on the five Series 1 Panes; divergent on Series 2/3 Pane labels.**

The five Series 1 Panes match the doctrine exactly: Lattice-Standard, Titans-Held, Old-Ones-Persist, Sinterklaas-Reigns, Wild-Hunt-Eternal. Roadmap §2 labels and tone registers map cleanly onto Doctrine §2 Panes 1–5.

Divergence in Series 2/3:
- The Doctrine catalog enumerates **30** named Panes (§2, Panes 1–15 in full, 16–30 short form). The Roadmap caps the Series 1–3 buildout at **20** Panes.
- The Roadmap's Series 3 catalog includes a Pane called **"Gilgamesh-Unkilled" (GU)** which has **no entry in the Doctrine §2 catalog** (the Doctrine never names this Pane). It is referenced repeatedly in Roadmap S3-1, S3-9, and the Pane-spread table (§8) and given a one-line axiom in §2, but it is absent from the master.
- The Roadmap omits or silently drops several Doctrine Panes: **Kongo-Norse (16), Pangu-Ymir (17), Apkallu-Athenian (18), Manichaean-Bleeding-World (19) [actually present], Sleeping-Kings (20), Sun-Wukong-Loki (21), Holmes-Mythos (23), Zoroastrian-Victory (25), Dionysian-Permanent (26), Three-Norns-Wrong (28), Last-Oracle (30)**. Some of these (Sleeping-Kings, Sun-Wukong-Loki) appear thematically inside Sets but not as named Panes.
- The Roadmap names **Manichaean-Bleeding-World** as a Series 2 Pane; the Doctrine has it at slot 19 in the short-form Series 2-expansion list. Consistent.
- The Roadmap names **Aztec-Sun-Held** as a Series 2 Pane; the Doctrine has it at slot 12 in the long-form list. Consistent.

**Action:** Either (a) add Gilgamesh-Unkilled as a named Pane to the Doctrine §2 catalog with a full short-form entry, or (b) excise GU from the Roadmap. The Roadmap's omissions of other Doctrine Panes are defensible (they are deferred past Series 3) but should be footnoted.

### 1.2 Card-attribute model — GAME-ECONOMY-DESIGN-V2 vs. Doctrine

**STATUS: Consistent.**

Doctrine §4.1–4.2 specifies card identity as the intersection of (Pane × Set × Parallel). Economy §1 defines `Card = (Series, Set, Pane, Moment, Tier, Parallel, Serial)` — three orthogonal axes (Pane, Set, Parallel) plus administrative fields (Series, Moment, Tier, Serial). Tier is correctly identified as a property of the Moment, not a fourth axis. This matches the Doctrine.

The Economy correctly names the five Parallels (ARCANA / AETHER / WITNESS / NEON / 1/1) and preserves them unchanged from V1, as the Doctrine §1.7 promised.

One minor naming tension: the Economy names its five example Panes as **Wild-Hunt-Eternal, Sinterklaas-Reigns, Underworld-Accord, Summer-Court, Dreaming-Threshold**. Three of these (Underworld-Accord, Summer-Court, Dreaming-Threshold) **do not exist in the Doctrine §2 catalog**. The Doctrine's five Series 1 Panes are Lattice-Standard, Titans-Held, Old-Ones-Persist, Sinterklaas-Reigns, Wild-Hunt-Eternal.

This is a substantive inconsistency. The Economy was likely drafted against an earlier Pane list (or against the Roadmap's Series 1 list filtered through a different lens). The Roadmap and the Production Brief both align to the Doctrine's five. The Economy is the outlier.

**Action — REQUIRED before ship:** Update Economy §2 example Panes to Lattice-Standard, Titans-Held, Old-Ones-Persist, Sinterklaas-Reigns, Wild-Hunt-Eternal. The Sets table in §5 (S1-01 through S1-04) likewise references Underworld-Accord, Summer-Court, and Dreaming-Threshold; those must be retired or remapped onto canonical Panes. The Pane-color base-art register table also needs the canonical five.

### 1.3 PHASE-04-CARD-FRAME-SPEC-V2 — Pane Chip and Lampblack Residue Tether Row

**STATUS: Faithful to the Doctrine; production-grade.**

- Pane Chip (§13) implements the Doctrine §4.3 "Pane chip" requirement with hex-bound CSS tokens, a 5-Pane abbreviation system (LS / TH / OP / SR / WH) that maps 1:1 to the Doctrine's five Series 1 Panes, dimensional scaling per tier, and contrast-tested text colors.
- Lampblack Residue Tether Row (§14) implements the Doctrine §4.3 "Lampblack Residue tether" — an in-line cross-Pane figure-variant reference. The implementation is restrained (max 2 lines, transparent background, dashed-rule iconography), matches the Doctrine's framing of Lampblack as a *recognition contract* rather than a heavy chrome element, and includes a proper data shape (`PaneVariant[]` capped at 2), graceful empty-state behavior, character-budget truncation, and tap navigation.
- The Pane Background Tint (§15) extends the Pane Chip mechanic with a multiply-blend overlay using production-binding hex values — this is more than the Doctrine specified, but is consistent with it.

The five Pane abbreviations and colors in §13.4 and §15.3 align with the Doctrine's tonal-signature descriptions:
- Lattice-Standard amber/gas-light → matches Doctrine §2 Pane 1 "gas-lit amber, Victorian city, sepia and lamp-yellow."
- Titans-Held bronze/basalt → matches Doctrine §2 Pane 2 "bronze-age amber and basalt."
- Old-Ones-Persist lapis → matches Doctrine §2 Pane 3 "deep lapis and ochre, Levantine limestone."
- Sinterklaas-Reigns canal-black/lantern-gold → matches Doctrine §2 Pane 4 "Dutch master chiaroscuro, canal-black and lantern-gold."
- Wild-Hunt-Eternal slate/bone-white → matches Doctrine §2 Pane 5 "motion-blur, slate and bone."

Frame Spec is a clean implementation. No rework required.

### 1.4 PHASE-09-PRODUCTION-BRIEF-V2 — 3-Stage Cultural Review Gate

**STATUS: Correctly specified and operationalized.**

§4A names three stages that map exactly to the Doctrine §6.4 Per-Pane Cultural Review Certificate:
1. **Stage 1 — Internal Cultural Review** (Doctrine: "Internal cultural review"). Brief assigns Council Seat 3 lead with Seats 1 and 4 alongside; outputs a clearance memo with per-card flags. Match.
2. **Stage 2 — External Advisor Review** (Doctrine: "External advisor review"). Brief specifies named advisors per tradition, per-advisor sign-off or objection, blocking on objection until resolution. Match.
3. **Stage 3 — Community Sign-Off** (Doctrine: "Community sign-off"). Brief gates this stage on the figure being from a "living tradition" with active practitioners holding ritual authority — and correctly scopes it down (Norse/Greek historical record exempted; living traditions required to consult). Match.

The Brief adds operational rigor the Doctrine left implicit: a signed Cultural Review Certificate per Set, filed alongside the Set spec; a queue-operator checkpoint that refuses commissions for any Set without a Certificate; certificate format with named sign-off slots. This is a strict superset of the Doctrine and is correct.

**One alignment issue:** the Doctrine §6.4 explicitly states sign-off is "per-figure or per-scene, not per-Pane in aggregate." The Brief operates the gate at the **Set** level, not the figure level (§4A: "The gate operates at the Set level, not the card level"). This is not an inconsistency — a Set's Certificate can document per-figure sign-offs while gating at the Set boundary — but the Brief should add one sentence to §4A clarifying that the Certificate's interior content is per-figure even when its gate is per-Set, to preserve the Doctrine's explicit anti-aggregation rule.

---

## 2. Completeness Check

### 2.1 MULTIVERSE-COSMOLOGY-DOCTRINE-V2 — six required sections

**STATUS: Complete. All §1–§6 present.**

- §1 The New Frame (with subsections 1.1–1.7) — present.
- §2 The What-If Axiom Catalog — 30 Named Panes — present, 1–15 long form, 16–30 short form.
- §3 Pratchett-Grade Tweak Doctrine (with subsections 3.1–3.6) — present.
- §4 Set / Pack / Pane Re-Architecture — present.
- §5 Bible Reconceptualization — present.
- §6 Cultural-Sensitivity Discipline — present, three-tier model with per-Pane Certificate gate.

### 2.2 SET-ROADMAP-V2 — 3 Series × 10 Sets

**STATUS: Complete.**

- Series 1: 10 Sets (S1-1 through S1-10, including the three already-written reference Sets and the seven new Sets). Present in §4.1.
- Series 2: 10 Sets (S2-1 through S2-10). Present in §4.2.
- Series 3: 10 Sets (S3-1 through S3-10). Present in §4.3.
- Drop calendar covers all 30 Sets across 34 active drop months. Present in §5.
- Total: 600 Moments, ~3,000 distinct art pieces with parallels. Stated.

### 2.3 GAME-ECONOMY-DESIGN-V2 — Pane Pack and Thread Pack

**STATUS: Complete.**

- §6.2 Pane Pack: $14, 6 cards, single-Pane caller-selected, mechanics fully specified (binding selection, completion-nudge UI, parallel-odds parity with Standard).
- §6.3 Thread Pack: $29, 6 cards, archetype-handle-based cross-Pane composition, ≥3 Panes guaranteed, design-team curated (not algorithmic), example given ("The Odin Thread").
- Standard Pack updated with hard 2–3 Pane composition rule and pack-generation algorithm (§6.1).
- Lampblack Residue mechanic specified end-to-end across §7 (definition, Residue set completion tiers, card-detail UI states, pack-open animation).

### 2.4 PHASE-04-CARD-FRAME-SPEC-V2 — hex colors / CSS tokens for Pane Background Tint

**STATUS: Complete with production-binding hex.**

§15.3 specifies the full Pane color system:
- Light-tint hex per Pane: `#e8c870` (LS), `#7a6040` (TH), `#3040a0` (OP), `#101020` (SR), `#484850` (WH).
- Dark chip hex per Pane: `#7a5a1a` (LS), `#4a3a28` (TH), `#1a2a5a` (OP), `#0f0f1a` (SR), `#2a2a30` (WH).
- Default overlay opacity per Pane (0.10 to 0.18 range).
- Sinterklaas-Reigns special radial-gradient lantern-glow treatment (with second `#d09820` 0.08-opacity radial layer).
- Wild-Hunt-Eternal special bone-white horizon-rim treatment (linear-gradient layer).

§15.5 codifies all values as CSS custom properties in `tokens.css`:
- `--color-pane-{ls,th,op,sr,wh}` (light tint)
- `--color-pane-{ls,th,op,sr,wh}-dark` (chip background)
- `--color-lampblack-tether` and `--color-lampblack-tether-emphasis`

Acceptance gate §12 #7 enforces chip scannability at thumbnail size with ≥4.5:1 text-on-chip-background contrast.

### 2.5 PHASE-09-PRODUCTION-BRIEF-V2 — 5 Series 1 Panes with visual registers

**STATUS: Complete.**

§2A names all five Series 1 Panes with what-if axiom, background tint, era/register, and notes:
- Lattice-Standard — amber / gas-light gold; 1880s–1920s; pre-derivative illustrator register.
- Titans-Held — bronze / basalt gray; ancient, raw, pre-Olympian weight.
- Old-Ones-Persist — lapis / deep ochre; deep time, unhurried, pre-succession stasis.
- Sinterklaas-Reigns — canal-black / lantern-gold; Dutch master chiaroscuro, 17th-century domestic darkness.
- Wild-Hunt-Eternal — slate / bone white; motion-blur, permanent chase, no dormant season.

§4 then enforces Pane Background Tint as a mandatory, ordering-bound element of every commission brief (axis 1 before axis 2; brief incomplete without it). §10 marketing positioning ("Five Panes. The Lampblack moves between them") echoes the same five.

---

## 3. Founder's Load-Bearing Requirements

### 3.1 Multi-pantheon coexistence in the same Pane

**STATUS: Strongly supported in the Doctrine and Production Brief; weakly demonstrated in the Economy.**

The Doctrine §1.2–1.3 makes this the central architectural commitment. Pane 1 (Lattice-Standard) is explicitly the demonstration: "Zeus on Olympus. Odin in Asgard. Vishnu and Shiva both present in their full Hindu cosmology. Holmes-variant walks Victorian streets where Hermes delivers telegrams." The Production Brief §2A reproduces this register ("the documentary Pane — the old figures persist alongside gas-lamps and steamships"). The Set Roadmap S1-1 through S1-10 implicitly assumes it (Sets that span all five Series 1 Panes inherit the Lattice-Standard cast at minimum).

The Economy weakens this. Its example Panes (Underworld-Accord, Summer-Court, Dreaming-Threshold) feel like single-theme zones rather than full cosmologies — "Underworld-Accord" reads more like a setting than a what-if axiom, and the example figures (Persephone, Anubis, Hel for one Pane; May King, Brigid, Lugh for another) imply theme-bucketing rather than full-pantheon coexistence. This is the IP-bucket failure mode in disguise.

**Action:** Bring Economy in line with the canonical five Panes per §1.2 above. Once the example Panes match the Doctrine, multi-pantheon coexistence is automatically supported.

### 3.2 Cosmological-variant Panes (NOT IP-buckets)

**STATUS: Doctrine and Production Brief replace the IP-bucket model fully. Economy partially regresses; Frame Spec is clean.**

The Doctrine §1.1 explicitly diagnoses V1 as the IP-bucket failure ("V1 organized LoreVault as five Universes, each functioning as an IP-bucket"). §1.3 replaces it with the what-if-axiom model. §4.1 hardens the new vocabulary.

The Production Brief §1 leads with "five cosmological-variant Panes" and the marketing line "LoreVault has no Universes Beyond — the canon IS the world." §2A's axiom column anchors each Pane in a what-if. No IP-bucket residue.

The Set Roadmap §1 ("What a Pane Is") explicitly disclaims the IP-bucket model and defines Panes as divergent cosmological answers. Clean.

The Frame Spec assumes the new model and operationalizes it (Pane Chip + Tint + Residue Row). Clean.

The Economy regresses partially. While §2 says "Pane replaces the old Universe concept but is cosmological rather than IP-canon-based," the example Panes themselves (Underworld-Accord, Summer-Court, Dreaming-Threshold) read as thematic zones — a softer form of bucket. Same fix as 3.1: replace the example Panes with the canonical five.

### 3.3 Pratchett-grade tweak doctrine

**STATUS: Documented clearly and actionably in the Doctrine. Implicit but unstated in the Frame Spec, Economy, and Production Brief.**

Doctrine §3 is the actionable specification:
- §3.1 The 0.5-second test (with hesitate-recognize-notice operational gate, with positive and negative examples).
- §3.2 Name-shift rules (syllable-shift, consonant-shift, inflection-language-shift; positive and negative tests).
- §3.3 Combined figures (with named ceiling: 3–5 per Pane).
- §3.4 Shifted-axis archetypes (with examples).
- §3.5 Cross-pantheon scene mash-ups (with examples).
- §3.6 The "doesn't quite fit" test (recognize source + notice difference).

This is implementable. A design reviewer can apply the gate without ambiguity.

The Production Brief references "Pratchett Tweak" as a brief-template field (§4) but does not restate the operational gate. The Frame Spec and Economy do not reference it. Given that the Doctrine is the master architectural document and the others are downstream, this is acceptable — but the Brief in particular should add a one-paragraph reference to Doctrine §3 in §4 ("Art Direction Pipeline") so brief authors do not need to re-derive the gate.

### 3.4 Cultural sensitivity gates

**STATUS: Living traditions are properly protected.**

Doctrine §6 specifies a three-tier model:
- **Tier 1 EXCLUDED:** Indigenous American (tribal sovereignty), Aboriginal Australian (AIATSIS), African diaspora living religions (Vodou / Santería / Candomblé / Lucumí / Palo) — all excluded from Series 1 with twelve-month minimum consultation before any mint.
- **Tier 2 ADVISOR + SIGN-OFF:** Hindu major figures (Brahmin council *and* Dalit/Bahujan sign-off both required); Yazidi (Peacock-Angel-as-Satan framing forbidden); Hawaiian, Maori, Parsi/Zoroastrian.
- **Tier 3 PROCEED WITH CARE:** Greek/Roman Hellenismos, Heathenry (with explicit white-nationalist guard), Mithraic/Gnostic/Orphic.

The Production Brief operationalizes Doctrine §6 via §4A (3-stage Cultural Review Gate) and §11 (named-advisor panel slate, including Roma+Jewish for Sinterklaas-Reigns Long Night, Near Eastern + Levantine + Kuba-Congolese + Norse for Old-Ones-Persist Drop 3, SWANA for Arabian, NI for Cú Chulainn, Indigenous Hudson Valley for American Gothic, Egyptian/Coptic+decolonization for Egyptian, Shinto for Yokai-deferred).

The Roadmap §6 Cultural Pre-Load Requirements adds production-binding deadlines:
- West African / Akan diaspora (Anansi, Eshu-Elegba, Ogun, Osain, Yoruba ori, AF Pane).
- North American Indigenous (Coyote, Spider Grandmother) — explicit tribal-nation consultation precondition.
- Mesoamerican (Quetzalcoatl, Mictlantecuhtli, Itzamna, Ixchel, AS Pane).
- Inuit / circumpolar (Sedna).
- Tibetan Buddhist (Bardo figures).
- Hindu living-tradition tonal review (Kalki, Rama in SD Pane, Saraswati in SD Pane).
- Pre-Vedic / Indus Valley (Pashupati, PV Pane).

**One observation worth flagging (not a defect):** the Roadmap S1-5 (Trickster Roads) lists Coyote among trickster figures with consultation-track gating. The Doctrine §6.1 places Indigenous American traditions in Tier 1 EXCLUDED ("No Series 1 mint. Engagement with any specific nation requires that nation's sovereign tribal government, not an academic advisor."). The Roadmap implies a consultation track may unblock Coyote for Series 1; the Doctrine says Tier 1 is excluded from Series 1 unconditionally. **This is a policy contradiction** and needs a CEO/Council resolution before Drop 5 (Trickster Roads, M5).

The Roadmap §6 also lists Spider Grandmother (Hopi/Navajo) for S1-8 with a tribal-consultation deadline of M6. Same Tier 1 conflict. **Resolve before M6.**

### 3.5 Lampblack Residue — implementable detail

**STATUS: Fully implementable across the doctrine and downstream specs.**

Doctrine specifies:
- §1.5 The conceptual contract (recognition handle that persists across Pane variants — costume, absence, or symbolic equivalent).
- §4.3 The card-detail surface ("Lampblack Residue tether — a line identifying cross-Pane variants of the same figure").
- Each Pane in §2 includes a "Lampblack residue" anchor list (deerstalker, missing eye, sickle-at-belt, white beard at river-source, etc.).

Economy §7 implements:
- §7.1 Definition with `archetype-handle` data field (kebab-case canonical identifier; one-handle-per-figure-per-tradition-cluster rule).
- §7.2 Three-tier completion (Kindled, Bound, Complete) with display achievements (no new mint, no supply change).
- §7.3 Card-detail-page UI states (un-owned greyed-silhouette, Kindled, Bound/Complete).
- §7.4 Pack-open animation tied to Lampblack discovery (smoke-particle slide-together animation, opt-out-by-default).

Frame Spec implements:
- §14 Lampblack Residue Tether Row with full data shape, typography, character budget, tap-behavior, empty-state, separator, and CSS tokens.
- §1.8 stack-position and §7 mobile-layout integration.
- §8 tablet/desktop reflow rules.
- §12 Acceptance Criteria #8 (DOM-level row presence/absence assertions).

Production Brief §7 reinforces Lampblack as a cross-Pane figure-briefing rule (cross-Pane variants must be briefed simultaneously to the same artist; staggered briefing is prohibited because retcons are prohibited).

Implementation gates are present at three levels: data model (Economy archetype-handle registry), UI surface (Frame Spec Tether Row + Pane Chip), production discipline (Production Brief simultaneous-briefing rule). This is sufficient for engineering and content production to begin.

---

## 4. Verdict

### MULTIVERSE-COSMOLOGY-DOCTRINE-V2 — **SHIP**
All six required sections present, internally coherent, founder requirements all addressed. The 30-Pane catalog (15 long-form, 15 short-form) provides ample runway for Series 1–3 plus reserves. The Pratchett-grade tweak doctrine is operationally testable. The cultural-sensitivity tier model is enforceable.

### SET-ROADMAP-V2 — **STRENGTHEN-AND-SHIP**
Complete on the 3 Series × 10 Sets requirement and aligned to the Doctrine on the five Series 1 Panes. Two named additions required:
1. Resolve the **Gilgamesh-Unkilled** Pane: either add a short-form §2 entry to the Doctrine catalog, or remove GU from the Roadmap (it appears in S3-1, S3-9, and §8 Pane-spread table).
2. Resolve the **Indigenous American Tier 1 conflict**: Doctrine §6.1 excludes Indigenous American traditions from Series 1 unconditionally; Roadmap §6 lists Coyote (S1-5, M5) and Spider Grandmother (S1-8, M6) with tribal-consultation deadlines that imply they could ship in Series 1. CEO/Council must reconcile before T-90 (Coyote consultation deadline is M3 per Roadmap).

### GAME-ECONOMY-DESIGN-V2 — **STRENGTHEN-AND-SHIP**
Complete on Pane Pack and Thread Pack specifications. Lampblack Residue mechanic is fully implementable. The card-attribute model (Pane × Set × Parallel) is correctly orthogonalized. **One required rework before ship:**
1. Replace the example Panes in §2 (Wild-Hunt-Eternal, Sinterklaas-Reigns, **Underworld-Accord, Summer-Court, Dreaming-Threshold**) with the Doctrine's canonical five (Lattice-Standard, Titans-Held, Old-Ones-Persist, Sinterklaas-Reigns, Wild-Hunt-Eternal). Cascading updates required to §2 example-figures table, §2 base-art-register descriptions, §4 Pane-Parallel interaction examples, §5 Sets table (S1-01 through S1-04 currently reference the wrong Pane names), §6.1 pack composition examples, §7.1 archetype-handle examples ("Sinterklaas" / "Odin" example chain works; "wotan-gift-bringer" handle works), and §10 v6 MODES interaction note. The Lampblack-Residue mechanism, Thread Pack design, and tier/parallel system all survive the rename intact.

### PHASE-04-CARD-FRAME-SPEC-V2 — **SHIP**
Faithful Pane Chip implementation, faithful Lampblack Residue Tether Row implementation, complete CSS-token specification with production-binding hex values for the Pane Background Tint, full mobile-first layout integration, eight acceptance criteria including chip-scannability and DOM-level row-presence assertions. Single-purpose ≤200-LOC components. Engineering hand-off is unblocked.

### PHASE-09-PRODUCTION-BRIEF-V2 — **STRENGTHEN-AND-SHIP**
3-stage Cultural Review Gate is correctly specified per Doctrine §6.4. Five Series 1 Panes with visual registers are named in §2A. Brief template (§4) enforces Pane-axis-before-Set-axis order, simultaneous cross-Pane figure briefing, and Cultural Review Certificate gating before FLUX queue admission. **Three named additions:**
1. Add a one-sentence clarification to §4A that the Cultural Review Certificate documents per-figure sign-offs even when its gate operates per-Set, to preserve Doctrine §6.4's explicit anti-aggregation rule.
2. Add a one-paragraph reference in §4 (Art Direction Pipeline) to Doctrine §3 (Pratchett-grade tweak) so brief authors apply the 0.5-second test consistently.
3. Resolve the Indigenous American Tier 1 conflict (same as Roadmap fix above) — confirm whether Drop 5 (Trickster Roads, Sept 5 2026) ships Coyote or defers.

---

## Overall Verdict — **STRENGTHEN-AND-SHIP**

The Phase 4 doctrine rewrite is structurally complete, internally coherent on the load-bearing architectural moves (cosmological-variant Panes, Pratchett-grade tweak, Lampblack Residue, three-stage Cultural Review Gate), and operationally implementable from the Frame Spec down. The Doctrine itself ships clean. The other three documents each have named, surgical gaps — one significant (Economy's example Panes still carry IP-bucket residue and must be retired), two policy-level (Indigenous American Tier 1 vs. Roadmap consultation-track contradiction; missing Gilgamesh-Unkilled Pane in Doctrine catalog), and a handful of small clarifications. None of these gaps require re-architecting the model; all are local edits or single-document policy resolutions executable within a sprint. Once those are landed, the bundle is shippable as the Phase 2-binding architecture for Series 1 launch on May 2 2026.
