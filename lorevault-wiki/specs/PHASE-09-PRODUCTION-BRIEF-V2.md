# LoreVault Series-1 Production Brief — V2

**Date:** 2026-04-27
**Status:** STRENGTHEN-AND-SHIP. Decisions, not options.
**Supersedes:** PHASE-09-PRODUCTION-BRIEF.md (2026-04-26)
**Audience:** Engineering, Ops, Marketing, Finance, Council, CEO desk.
**Companion to:** Synthesis Parts 1–3 · Bibles 01–05 · Manifests 01–05 (incl. Liberation Drop) · Phase-04 Card Frame Spec · Phase-05 Game Loop Spec · Reviews V1 + V2 · sets-v2/SET-LONG-NIGHT.md · sets-v2/SET-WILD-HUNT.md · sets-v2/SET-OLD-ONES-PERSIST.md

**What changed in this version:** The organizational model has been updated from IP-Universe Buckets to a Pane/Set cosmological-variant model. The five locked Universes (Baker Street, Enchanted Kingdom, Wonderland, Gothic Horror, Greek Myth) are replaced by five named Panes (cosmological variants) as the primary structural axis. Sets are thematic collections that cut orthogonally across all Panes. Cards carry three orthogonal attributes: Pane + Set + Parallel. All production-flow sections updated accordingly. All other decisions and commitments from V1 are preserved unchanged.

---

# 1. Executive Summary

**The product.** LoreVault is a mobile-first digital collectible house built on the public domain. Series 1 ships five cosmological-variant Panes — *the Lattice* — held together by an original house-doctrine called *Lampblack* (the residue figures leave on each other across Panes). Each card is a Moment from public-domain canon, rendered in the pre-derivative illustrator register (Paget, Rackham, Tenniel, Holst, Bouguereau) and refused at every modern derivative lock (Cumberbatch, Disney, Burton, Lugosi-pre-2027, Marvel-Thor, Lore Olympus). Engagement is reader-shaped: daily epistolary Journal, weekly Lampblack Tally, monthly live Set drop, quarterly Council Audit. No streak chrome, no value-overlay, no "claim today's card." Chassis: Next.js 16 + Tailwind v4 + Vercel + Flow custodial-invisible. FLUX commissions the art; the Council locks every Set.

**Card structure (three orthogonal attributes):**
- **Pane** — cosmological variant (which parallel world). Five Panes in Series 1; see §2A.
- **Set** — thematic collection (which subject-matter cluster). Five Sets in Series 1; see §2B.
- **Parallel** — production variant (ARCANA / AETHER / WITNESS / NEON-CYBER / 1/1 ONE-OFF per Bible §9 caps).

A card sits at the intersection of one Pane, one Set, and one Parallel designation. These three axes are independent: a given Moment can appear across multiple Panes within the same Set, and the same Pane can contribute cards to multiple Sets.

**Series 1 scope.** 5 Sets × 20 Moments = **100 base-PRIME Moments**. Plus parallels (ARCANA / AETHER / WITNESS / NEON-CYBER / 1/1 ONE-OFF) per Bible §9 caps. Plus 4-card Lattice metaset ("The Lattice Itself"). Plus 15-card Liberation Drop layering 1 January 2027. **~120+ total commissioned assets Series 1 + Liberation** (baseline; parallel commissions add to render budget per §5).

**Series 1 launch:** **Saturday May 2 2026, 1pm ET.** 12-month arc closes February 2027, with the **2027 Liberation Drop** at 00:01 GMT 1 January 2027 as the press-anchored mid-Series cultural beat.

**North-Star tagline:** *The Lattice and the Lampblack.* One-line marketing positioning: **"LoreVault has no Universes Beyond — the canon IS the world."** Front-and-center on lorevault.com from May 2 forward. This is the structural moat MTG cannot replicate (their crossovers are licensed-IP guests; ours are constitutive of cosmology).

**Four audience archetypes served (V2 Quality Review §3), each with named Series-1 thrill-card:**
- **Sherlockian Completist (50+):** *Seventeen Steps* (LN-1 Ultimate 1/1, Lattice-Standard Pane) — Watson's POV ascending the staircase, Paget composition no one has executed.
- **Dracula-Daily Diaspora (27, Tumblr-native):** *The Ledger-Keeper Opens the Ledger* (LN-4 #20 Mythic 1/1) — Asha's century-folded entry "1 January 1927 — the cliff turns. I wait." Highest-Y7 emission among non-Sherlockians.
- **Gambler-Collector (37, $5K+/drop):** *The Mirror Held* (OOP-4 1/1, Old-Ones-Persist Pane) — Caravaggio shield + Burne-Jones + Bernini + red-figure pottery; 4-stack art-anchors against `mintCount=1`.
- **Pratchett-Discoverer (23):** *The Footnoter Reveals Themselves* (WH-1 Ultimate 1/1, Lattice-Standard Pane) — fourth-wall-break in Vogel/Rackham woodcut register.

---

# 2A. The Five Panes — Series 1 Visual Registers

Each Pane is a cosmological variant: a named what-if axiom that defines the rules of a parallel world. The Pane visual register is a mandatory art direction element that must be specified in every commission brief before Set thematic content is layered in. See §4 for the full art direction pipeline.

| Pane | What-If Axiom | Background Tint | Era / Register | Notes |
|------|--------------|-----------------|----------------|-------|
| **Lattice-Standard** | The default register; all pantheons coexist in a modern-register 1880s–1920s world | Amber / gas-light gold | 1880s–1920s; pre-derivative illustrator register throughout | The documentary Pane — the old figures persist alongside gas-lamps and steamships; their power not diminished, only better documented |
| **Titans-Held** | The Olympian succession was blocked; Cronus's children remain swallowed; the figures who would have inherited the world exist only as potentials | Bronze / basalt gray | Ancient, raw; pre-Olympian weight; proto-divine scale | No Zeus, no Athena, no Apollo; the world is sorted by older hands or not yet fully sorted |
| **Old-Ones-Persist** | The primordial generation never lost; Tiamat rests, El sits at the rivers, Nun waits at the edge of the created world | Lapis / deep ochre | Deep time; unhurried; pre-succession stasis | Not a world in ruin — the victors' theology erased; primordials are not malevolent in the way later myths needed them to be |
| **Sinterklaas-Reigns** | The gift-bringer tradition has cosmological weight; the Long Night figures are constitutional, not folkloric | Canal-black / lantern-gold | Dutch master chiaroscuro; 17th-century domestic darkness | White horse claimed by both Hunt and gift-bringer; the tension is unresolved and unresolvable |
| **Wild-Hunt-Eternal** | The Hunt rides every night; the leader rotates by moon-phase and season; no night is safe; the hounds know every road | Slate / bone white | Motion-blur; permanent chase; no dormant season | In other Panes the Hunt has dates; here it has no off-season; the hounds can be heard near running water at any hour |

**Pane Background Tint is a mandatory commission element.** Every art brief must open with the Pane tint specification before any other art direction is supplied. See §4 for the two-axis briefing structure.

---

# 2B. The Five Sets — Series 1 Ship Plan

Each Set is a thematic collection of 20 Moments cutting across all five Panes. Sets are dropped monthly on the first Saturday at 1pm ET. Three Sets have complete worked examples at `lorevault-wiki/sets-v2/`; these serve as the production brief for Series 1 Drops 1–3.

| # | Drop Date | Set | Set Code | Moments | Status | Cultural Beat |
|---|-----------|-----|----------|---------|--------|---------------|
| 1 | May 2 2026 | **Long Night** | LN | 20 | Fully spec'd — `sets-v2/SET-LONG-NIGHT.md` | Series 1 launch |
| 2 | June 6 2026 | **Wild Hunt** | WH | 20 | Fully spec'd — `sets-v2/SET-WILD-HUNT.md` | |
| 3 | July 4 2026 | **Old Ones Persist** | OOP | 20 | Fully spec'd — `sets-v2/SET-OLD-ONES-PERSIST.md` | Adjacent to Nolan *Odyssey* Jul 17 |
| 4 | Aug 1 2026 | **Dying and the Rising** | DR | 20 | In development | Mid-Series Council Audit (Q2 Day-1 ≥25%) |
| 5 | Sept 5 2026 | **Trickster Roads** | TR | 20 | In development | |
| — | Jan 1 2027 00:01 GMT | **Liberation Drop (15 cards)** | LD | 15 | Pre-built Q3–Q4 2026 | Universal *Dracula* + *Frankenstein* 1931 PD cliff; LD-14 *The Cliff Turns* Mythic 1/1; press to TIME/*Verge*/*Wired* |

**Series 1 total:** 5 Sets × 20 Moments = **100 base-PRIME Moments**, plus parallels and the 4-card Lattice metaset and 15-card Liberation Drop.

**Drops 1–3 (Long Night, Wild Hunt, Old Ones Persist) are production-ready.** Their set files contain fully spec'd Moments with Pane assignments, tier designations (I/II/III), Lampblack Residue handles, art direction anchors, Pratchett Tweaks, and flavor text. Council voice-lead review is the only remaining gate before FLUX commission queue opens for these three.

**Drops 4–5 (Dying and the Rising, Trickster Roads) require Set spec completion** before Cultural Review Gate (§4A) can open. Council Seat 1 owns the premise; Seat 3 owns the cultural-sensitivity advisory for each.

**Series Close — April 30 2027.** Binder closes; "Series Patron" badges (≥3 of 5 Sets complete); **Series 2 teaser on the Lattice center-node** — the sixth node, previously empty, gains a faint silhouette for the first time. **May 2027 — Series 2 announcement.**

---

# 3. The Product Experience (mobile-first 375px)

**Onboarding 90-second test.** Black screen → "ONE OF FIVE PANES. SOMEWHERE ELSE, HE IS SAYING IT AGAIN." → 4-figure rotation: Watson / Lattice-Standard (3-6s) → Persephone / Old-Ones-Persist (6-9s) → Cheshire / Lattice-Standard (9-12s) → **Anubis** (12-30s, the cross-Pane judge). User taps any figure; that becomes the Pane of entry. **Rigged Sample-pack opens at 30s with guaranteed Rare+ Moment.** Card lands in binder slot with 11 empty siblings glowing softly. At 60s camera pulls back: the binder is one slot in the **Lattice-painting**. Fifth empty node waits. Single CTA: "Send me the Journal." The word **Lampblack** is earned at 87 seconds — never used before.

**Lattice-map oil-painting hero.** Single 2:3 oil-painted illustration in academic-realist register (Bouguereau / Alma-Tadema mid-tones). Five interlocking stone doorway-arches in pentagram geometry; sixth Pane implied at empty center. Each arch carries its Pane's visual register (amber gas-light / bronze-basalt / lapis-ochre / canal-black lantern-gold / slate bone-white). Ink-soot residue drifting at 0.5fps. **Commissioned, not UI-rendered.** Renders at 375px full screen-width. Tap any arch → 250ms zoom-into. Pinch-zoom disabled. Lives at lorevault.com home + Journal email header + binder cover.

**Card-detail surface (`/v2/card/:cardId`).** Replaces v1 13-module retention dashboard. Stack: TopBar (sticky 56px) · HeroArt (375×563 full-bleed) · Pullquote (serif italic, voice-preserved per Pane) · LoreNote (4px tier-color rule, iceberg-pulled never explanatory) · TetherRow (omitted Series 1 default; 1-2 Echoes total) · MetadataChips (serial · tier · **Pane** · **Set** · parallel) · CouncilToggle (collapsed default; 4-Layer Council on tap: Silhouette · Props · Gesture · Spine) · OwnerTrail (display-name only). Burn/share/list deferred to Phase 6+.

Note on MetadataChips: V1 listed `shell` in this position. V2 replaces `shell` with `Pane` and `Set` as the two primary organizational chips, reflecting the new three-axis card model. Schema change required before Phase-6 freeze; see §12 Decision 2.

**Pack-open ritual.**
- **Sample ($0):** 4s, 1 Common, no narrator, ticket consumed.
- **Standard ($9):** 8s, 3 Moments, sequential reveal with Lampblack-residue trails, narrator murmur ("*there*") at 4s.
- **Curated ($49):** 12s, 5 Moments, ≥1 Rare; the **only** tier where the Lampblacker-Spine speaks (2-line text overlay).
- **Premium ($199):** 18s, 6 Moments, ≥1 Legendary; Council seat 1 confirmation; auto-share-screenshot.
- **Apex ($999):** 30s narrator-voiced, ≥1 Legendary + 1 Parallel, 10% Ultimate, 1% Mythic chase. Live-stream eligible. Council voice-overlay confirmation mid-stream — **highest social-emission Y7 trigger**. Caps at 100 per Series.

**Loops.**
- **Daily:** Jonathan's Journal email + push (200-600 words, voice-rotated by day); Lattice "today's active arch" with displayed card-of-the-day; **reading-pact ticket** earned by any of three reading actions. Tickets cap at 5; **never expire**. Replaces streak chrome.
- **Weekly:** **Sunday Lampblack Tally** (1500-2500 words; 3 Echo-tier reveals + cross-tether map + qualitative binder summary + Council preview). **Mirror Wednesday** (~1500 words: Footnoter editorial + Topsy commentary; hand-written by Seat 2b).
- **Monthly:** Set Drop, first Saturday 1pm ET; T-24h pre-roll narrator commentary by Lampblacker-Spine; 60-min live event with Council confirmation moments; Wake-page persists. Council Q&A last Wednesday on Discord; published Sunday in the Tally.
- **Seasonal:** quarterly Council Audit (Aug + Nov 2026); Liberation Drop (Jan 1 2027); Series Close (April 2027).

**Vault binder.** Pokémon-Trainer-Badge metaphor — gallery-hung, not database. Per-Set badges: Common Reader (painted bookmark) · Rare Reader (embossed seal) · Legendary Reader (gold-leaf ribbon) · Apex Reader (wax-seal in **Pane color** on cover — see Pane visual register table in §2A for the five Pane colors). The binder *is* the gallery; the Lattice-painting *is* its cover.

**Banned chrome (enforced):** no 5-4-3-2-1 countdown on packs · no rarity sound-bumper (sound *quieter* the rarer the card; Lampblack is silence) · no value-estimate overlay · no streak push or 7-day flame · no "claim today's card" (displayed, not given) · no "Subscribe to Premium" inside the daily Journal · no exclamation marks in caption, no whimsy/dreamy/magical register · no actor likeness on any card · no wallet addresses on customer surfaces.

---

# 4. Art Direction Pipeline — Two-Axis Briefing

**Overview.** Every commission brief in Series 1 carries two mandatory axes before any other art direction is written:
1. **Axis 1 — Pane Visual Register** (background tint, era, chiaroscuro treatment)
2. **Axis 2 — Set Thematic Context** (subject-matter cluster, Lampblack Residue handle, figure-specific iconography)

Old briefs were Universe-specific. New briefs are Pane-specific for background tint and atmospheric register, then Set-specific for thematic content and figure identity. A brief that specifies only one axis is incomplete and cannot enter the FLUX queue.

**Brief template structure (mandatory order):**

```
PANE: [name]
PANE BACKGROUND TINT: [color spec from §2A]
PANE ERA / REGISTER: [era descriptor from §2A]

SET: [name]
SET THEMATIC CONTEXT: [1-sentence premise anchored to this Set's premise doc]
LAMPBLACK RESIDUE HANDLE: [the cross-Pane recognition element for this figure]

FIGURE: [figure name, Pratchett Tweak if applicable]
TIER: I / II / III
ART DIRECTION: [full art direction block per existing FLUX prompt conventions]
BANNED VOCAB / VISUAL LOCKS: [from §10 IP risk register + Pane-specific exclusions]
```

The **Pane Background Tint** is a new mandatory element introduced in V2. It was absent from V1 briefs. No brief is approved for FLUX queue without it.

**Amber/gas-light gold** (Lattice-Standard) is the default register for figures whose mythological tradition does not otherwise specify a Pane assignment. When a figure has no explicit Pane in the Set spec, it defaults to Lattice-Standard with a note in the brief flagging the assignment as default.

**Cross-Pane figure briefing rule.** When a figure appears in multiple Panes within the same Set, or across multiple Sets, **all variants must be briefed simultaneously.** The artist must receive the full cross-Pane commission in a single brief package so that the Lampblack Residue (the cross-Pane recognition handle) is visually coherent across all variants. **Staggered briefing of cross-Pane figures is not permitted.** Variants briefed at different times to different artists will produce incoherent Lampblack Residue and cannot be corrected after mint without a retcon — which is prohibited (Decision 40, §9).

This rule applies even when only one Pane variant is scheduled for a given drop. If the figure will appear in a later Pane, that later-Pane brief must be produced (even if not commissioned) before the first variant enters the FLUX queue, so the Lampblack Residue specification is locked.

---

# 4A. Cultural Review Gate

**This gate BLOCKS production start.** No card enters the FLUX commission queue until all three stages of the Cultural Review Gate are complete for the Set containing that card. The gate operates at the Set level, not the card level.

**Three-stage Cultural Review Gate:**

**Stage 1 — Internal Cultural Review (LoreVault team).**
Council Seat 3 (Compliance + Cultural Reviewer) leads. Seat 1 (Lattice Architect) and Seat 4 (Iceberg Auditor) review alongside. Output: internal clearance memo with per-card flags for any figure carrying living-tradition, right-of-publicity, or cultural-appropriation risk. Zwarte Piet / blackface exclusions, Coca-Cola Santa visual language exclusions, and living indigenous ceremonial tradition exclusions are hard-coded at this stage.

**Stage 2 — External Advisor Review (assigned per-tradition).**
Named cultural advisors (from the roster in §10) review the Set spec. Each advisor reviews only the figures within their assigned tradition. Advisor assignment is documented in the Set spec file. Output: per-advisor written sign-off or objection. Objections must be resolved before Stage 3 can open; resolution path determined by Seat 3 + CEO.

**Stage 3 — Community Sign-Off (for living traditions only).**
Required for any figure drawn from a living religious or cultural tradition. Living tradition is defined as: a tradition with active practitioners who hold ritual authority over the figure's meaning. Norse and Greek figures from historical record do not require Stage 3. Figures from living traditions (e.g., any syncretic or actively practiced tradition) require documented community consultation at this stage. Output: community consultation record. If community consultation is not achievable on timeline, the figure is deferred to a later Set or removed.

**Output of all three stages: signed Cultural Review Certificate per Set.** The Certificate is filed in the Set spec directory alongside the Set file. The FLUX queue operator checks for the Certificate before accepting any commission for a card in that Set. A Set with no Certificate — or a Certificate marked incomplete — is not eligible for production start.

**Certificate format:** Set name · Date · Stage 1 sign-off (Seat 3, Seat 1, Seat 4) · Stage 2 sign-offs (per-advisor, tradition noted) · Stage 3 disposition (N/A or consultation record reference) · Final clearance sign-off (Seat 3 + CEO).

**Drops 1–3 (Long Night, Wild Hunt, Old Ones Persist):** Cultural-sensitivity advisory notes are documented in each Set file (sets-v2/). Seat 3 must formally open Stage 1 review against those notes. Near Eastern, Levantine, Egyptian, Kuba/Congolese, and Norse consultant requirements for Old Ones Persist are flagged in that Set's file; Stages 2–3 cannot begin until those advisors are named. See §10 for the named-advisor retainer status.

---

# 5. Engineering Scope

**Stack:** Next.js 16 + Tailwind v4 + Framer Motion + Lottie + Vercel + Flow custodial-invisible (no wallet UX). Mobile-first 375 × 812 baseline; desktop is superset.

**Component file map (replaces v1 34KB god-component, per Phase-04 §1):** `<TopBar>` · `<HeroArt>` · `<Pullquote>` · `<LoreNote>` · `<TetherRow>` · `<MetadataChips>` · `<CouncilToggle>` · `<OwnerTrail>`. Each is single semantic role + one source-of-truth field. No discretionary alternates.

**Card schema V2 — three-axis model.** MetadataChips must surface Pane, Set, and Parallel as three distinct chips. The previous `shell` field is deprecated in favor of `pane` (cosmological variant name) + `set` (thematic collection name). **Schema freeze required before Phase-6 commission start.** See §12 Decision 2.

**`assertParallelEligible()` — ARCANA reservation rule machine-enforced at 3 layers:**
- **L1 — Manifest row-level Validate field.** Every Set manifest cell has a `Validate:` predicate. Daemon short-circuits on a single-row predicate.
- **L2 — Bible §9 caps loaded as JSON config** (per-Set ARCANA ≤ N, AETHER ≤ N, NEON ≤ N, 1/1 = 1 per Set).
- **L3 — Council seat 4 (Iceberg Auditor) sign-off** at Set-Lock. Public audit doc ships on wiki each quarterly milestone.

**PWA from day 1.** Offline reads, install-to-home-screen, push native to daily Journal. No app-store dependency for v1.

**REBIRTH-DAEMON Track A.** Per V2 §8 Hardness Test: **~85% of daemon input resolves from inheritance** (Tier, Pane, Set, Parallel, Biome, Figures, Voice mode, prompt stems, Iconography, Set-glyph, Typography, Banned vocab). Remaining ~15% is exactly the work the 4-seat Council staffs. Track A can run FLUX commissioning tonight, ship 4 candidate plates tomorrow, stage for Council Set-Lock by EOD.

**4-seat Council tooling.** Set-Lock pipeline (seats 1+4 sign every Set pre-mint); Mosaic Test gate (cross-Pane voice-register audit); Iceberg cell-flag table per Series; FLUX queue with 4-candidate-rounds budget for ONE-OFFs (V2 Rewrite 5); **Cultural Review Certificate check** (new gate — queue operator confirms Certificate on file before accepting commissions for a Set).

---

# 6. Content Production

**FLUX render budget.** 100 base-PRIME Moments × $0.04 = **$4.00** Series 1 baseline. Plus parallels per Bible §9 caps (estimate ~20 parallel variants) × $0.04 = ~$0.80. Plus 15 Liberation × $0.04 = $0.60. Plus 4-card Lattice metaset ≈ $0.16. **Baseline ≈ $5.56.** Iteration budget for ONE-OFFs (1/1 per Set × 5 Sets = 5 Mythics + 4-card metaset) at 4-candidate rounds = +~$0.72. **Series 1 commission line ≈ $6–8, round to $8–12 with overhead.**

Note: V1 budget was calculated on ~509 cells across five Universes. V2 scope is 100 base Moments across five Sets; budget scales down accordingly. If parallel production expands beyond §9 caps, re-run this calculation before commission queue opens.

**Voice corpus.** Each Set carries its own voice register specification (documented in the Set spec file). Long Night and Wild Hunt use Enchanted Kingdom adjacent / folk-tale register; Old Ones Persist uses Greek Myth primary / Enchanted Kingdom secondary. Dying and the Rising and Trickster Roads voice registers to be specified by Council Seat 2a before Set spec is locked. Estimated written lines per Set: ~30 flavor lines + ~16 lore-notes = ~46 lines/Set × 5 Sets = **~230 written lines Series 1 base.** Journal, Tally, and Mirror Wednesday volumes unchanged from V1 (~210K words/year long-form).

**7 FTE content team — 4-seat Council + 3 specialists** (per V2 Rewrite 4 split, production-binding):
- **Seat 1 — Lattice Architect:** cosmology; Iceberg enforcement; live-event confirmation moments; Pane axiom consistency across Sets.
- **Seat 2a — Voice Lead, 4 Sets:** Long Night, Wild Hunt, Dying and the Rising, Trickster Roads (S1). AI-draft + human-edit for Journal; ~150 words/day human-touched.
- **Seat 2b — Footnoter, Lattice-Standard voice only:** 1 voice. **Hand-writes every word.** ~1500 words/week. The Pratchett-grade voice V2 audit named "the single best prose in the wiki." **Never AI-drafted.**
- **Seat 3 — Compliance + Cultural Reviewer:** Owns Cultural Review Gate (§4A); named-advisor retainer management; living-tradition Stage 3 coordination.
- **Seat 4 — Iceberg Auditor:** 1:2:4 Surface:Echo:Deep ratio (8 Echo + 16 Deep per 20-Moment Set minimum); 7% crossover ceiling per Set post-S1.
- **3 specialists:** Writer (Journal/Tally copyedit) · Art Director (FLUX prompt + Pane tint hex matching) · Engineer (Next.js + Track A + mint-config).

Seat-2 split is the V2 Rewrite 4 fix. Seat 2b scope note: in V1, Seat 2b was scoped to Topsy/Footnoter voice within the Enchanted Kingdom Universe. In V2, Seat 2b holds the Lattice-Standard Pane voice specifically — the register that carries the documentary-frame prose across all Sets. The Topsy-cap-at-10% concern from V1 does not apply under the new model since Set membership, not Universe membership, determines voice scope.

---

# 7. Lampblacker-Spine Roster (the 5 original anchor characters)

Per Synthesis Part 3 §3 + V2 Rewrite 11. Public-domain figures alone don't sustain emotional gravity — too pre-loaded, too distributed across rival media. Each Pane needs an original load-bearing center visible across Sets. **All five commissioned simultaneously for Series 2** (no staggering — staggered Spines create uneven Pane gravity).

In V2, Lampblacker-Spines are anchored to Panes, not Universes. The five Spines from V1 are reassigned accordingly:

| Pane | Lampblacker Spine | Spine Line |
|------|-------------------|------------|
| **Lattice-Standard** | **The Footnote** (BIBLE-01 §11; cross-Pane Lampblacker substrate; appears at LN-1 Common 9 + Rare 14) | *"Every case has a margin. I am what is written there."* |
| **Sinterklaas-Reigns** | **The Charcoal-Burner's Daughter** (BIBLE-02 §11; signs `— the C.-B.'s daughter, by the kiln-wall`) | *"What the wolf walks past, I have already drawn."* |
| **Wild-Hunt-Eternal** | **The Glass-Polisher / Court Recorder of Hearts** (BIBLE-03 §11; the figure who cleans the Looking-Glass and is the only one who knows it's two-way) | *"I keep the surface clear. What looks back is not my doing."* |
| **Old-Ones-Persist** | **Asha Caedmon, the Ledger-Keeper of Whitby** (BIBLE-04 §11; pulled from the *Demeter* wreck as a child; archives across all primordial and transitional figures in this Pane) | *"I came up from the wreck of the Demeter. I have been writing it down ever since."* |
| **Titans-Held** | **The Pythia's Apprentice** (BIBLE-05 §11; chosen over The Oracle's Translator — the Apprentice has a future, the Translator only a present) | *"She breathes the smoke. I learn what to carry. The supplicant hears her; is also hearing me."* |

**V2 Rewrite outstanding:** **Footnote and Apprentice are working-titles, not proper nouns.** Must receive proper nouns before Series 2 — the cross-Pane Lampblacker-Index needs five names that read as a *roster*, not an *index entry list*. Asha + Charcoal-Burner's Daughter at *thrilled*; Glass-Polisher *thrilled* if dual-naming gets disciplined; Footnote + Apprentice currently *load-bearing concepts*. Council seat 2b owns the pass; **due before Phase 6 commission start**.

**Cross-Pane arcs (S2-3 commissioning bank).** Asha as cross-Pane archivist persists from V1: *A Letter from Whitby Arrives at 221B* (LN-1 Common WITNESS, Lattice-Standard Pane) · *The Cartographer Trades Pages with the Ledger-Keeper* (WH-1 Rare echo, Sinterklaas-Reigns Pane) · *A Ledger-Page Falls Through the Looking-Glass* (WH-1 single Echo, Wild-Hunt-Eternal Pane; burnt-corner page, Asha-artefact-only) · *Asha at the Mouth of Hades* (OOP S2) · *The Ledger-Keeper Closes the Innsmouth Volume* (OOP S3). Cheshire-grin-as-residue Pattern 9 / Lampblack Trade (per V2 §6 resolution: no figure crosses, only residue) fits within Deep budget without breaching Echo cap. Witness-cluster cross-Pane Lampblacker-Index = single Mythic card, one per Series.

**Cross-Pane figure briefing rule applies to all Spine figures.** Asha's Lattice-Standard, Old-Ones-Persist, and any Titans-Held appearances within a given Set must be briefed simultaneously. See §4 for the simultaneous-briefing requirement.

---

# 8. Series 2–4 Pipeline (the runway)

**Series 2 — May 2027 → April 2028 — three Pane additions + one Borrowed-Pane.**
- **Norse — "Iron and Ash"** (Volsung mini-cycle: Sigurd/Fafnir/Brynhildr/Andvaranaut). Anti-Marvel defense via Hylestad + Ramsund stones. Mjolnir = SHORT-haft cruciform Lolland, never long-handle.
- **Egyptian — "The Tomb-Painting Pane"** (Anubis judgment / Isis-Osiris cycle / Eye of Horus). Ship **before 2027 PD-wash of 1932 *Mummy*** contaminates the Imhotep visual market.
- **Dickensian — "London Pane / A Christmas Carol — Three Ghosts"** (twin Victorian-London to Lattice-Standard; serial-part-monthly drop format mimics 1836-1870 publishing rhythm; rides perpetual *Christmas Carol* annual cycle).
- **Borrowed-Pane — "Warlord of Barsoom"** (single Pulp John Carter slot, St. John pre-1929 illustrations; tests Borrowed-Pane mechanic + ERB-Inc. TM-mitigation A/B).

**Series 3 — May 2028 → April 2029 — Conan-PD-Cliff Series.**
- **American Gothic — "The Tell-Tale Hour"** (Raven / Usher / Ichabod / Hester / Tell-Tale narrator). Ships **paired with Lattice-Standard second-wave** for the **Dupin × Holmes Method-Lineage beat** — single richest cross-Pane spine in the corpus.
- **Mesopotamian — "Older than Homer"** (Gilgamesh-Enkidu + Inanna's Descent). Cleanest minefield in roster; rides Mosul Museum reopening; donate to Smithsonian Iraqi Cultural Heritage Initiative at launch.
- **Pulp Heroes (full Pane) — "Phoenix on the Sword"** (Conan PD Jan 1 2028). Conan anchor + Solomon Kane Gothic-bridge + Tarzan/John Carter Burroughs spine + Doc Savage lazy-rollout.
- **Optional 4 — Lovecraft — "At the Mountains"** (already PD via non-renewal; LaValle/Ruff doctrine; racism reckoning explicit).

**Series 4+ — May 2029 onward.** Arthurian (Beardsley + Burne-Jones) · Wizard of Oz (Silver-Shoes-not-Ruby; pre-built "Ruby Slippers Reclaimed" for Jan 1 2035 MGM cliff) · Verne/Wells (Nemo rendered authentically South Asian per Verne 1874) · Arabian Nights (SWANA-panel-gated; Carré + Mughal-miniature) · Slavic Folktale (Bilibin-anchored; held to 2029+ to clear Witcher capture) · Celtic-Irish (Ulster Cycle; NI reviewer on Cú Chulainn).

**Yokai DEFER** per Shinto living-religion gating — 5 cultural-advisor gates required pre-launch. If cleared, S4/5; if not, defer indefinitely.

**Shakespearean META-Universe (cross-cutting from S1).** Hamlet-shadow under Lattice-Standard Holmes figures; Klytemnestra-shadow under Gothic figures in Old-Ones-Persist; Three Witches under Long Night Stepmother figures; Prospero under Wild-Hunt-Eternal and Sinterklaas-Reigns trickster figures. Special "Shakespearean tether" card type baked into S1 schema. **Cannot defer past S1 lock — changes card schema.**

---

# 9. PD Cliff Calendar (production-binding dates)

Each cliff requires a Q-2-prior pre-build so press is **shipped, not pitched**.

| Date | Cliff | LoreVault impact |
|------|-------|-----------------|
| **Jan 1 2027** | Universal *Dracula* 1931 (Lugosi widow's-peak) + *Frankenstein* 1931 (Karloff flat-skull) → US PD | **Liberation Drop ships** — 15 cards; LD-14 Mythic 1/1; press distribution TIME / Verge / Wired |
| **Jan 1 2027** | Walter Gibson *The Living Shadow* 1931 → US PD | The Shadow as Series-2 Borrowed-Pane teaser ("The Shadow Knows" single-Moment) |
| **Jan 1 2028** | Robert E. Howard *Phoenix on the Sword* (Conan debut) → US PD | **Pulp Heroes Pane opens** — Series 3 anchor Set; biggest single-cliff marketing beat in the four-year roadmap |
| **Jan 1 2028** | ERB *Pirates of Venus* + 1932 pulp-magazine covers → US PD | Burroughs Venus-cycle + visual canvas widens |
| **Jan 1 2029** | Lester Dent *The Man of Bronze* (Doc Savage debut) → US PD | "Doc Savage Drop" — staged extension Set within Series 3 or 4 |
| **Jan 1 2031** | *Bride of Frankenstein* 1935 → US PD | "The Bride" Drop — single Legendary card |
| **Jan 1 2032** | *Mountains of Madness* / *Innsmouth* / *Shadow Out of Time* → 95-year clock (belt-and-suspenders confirmation) | Internal counsel sign-off cleanup only |
| **Jan 1 2035** | MGM *The Wizard of Oz* 1939 → US PD | **"Ruby Slippers Reclaimed"** expansion — pre-built 2034; Series ~9 anchor |
| **Jan 1 2037** | *Wolf Man* 1941 → US PD | "The Wolf Returns" Drop |

**Per-illustrator life+70 cliffs already cleared and usable:** Bilibin (Russian PD 2013, Berne-treated worldwide), Paget (d. 1908), Steele (d. 1944), Tenniel (d. 1914 — pre-1928 publication makes US-PD unconditional), Rackham (d. 1939), Dulac (d. 1953), Nielsen (d. 1957). **Frazetta locked until ~2080 — never draw on Frazetta-Conan register.**

---

# 10. The "LoreVault has no Universes Beyond" Marketing Positioning

**Front-and-center home-page hero from May 2 2026 onward.** Differentiator vs MTG Universes Beyond (modal IP) and the structural moat MTG cannot replicate (their crossovers are licensed-IP guests; ours are constitutive of cosmology).

**Operationalization (Dossier 21 §3/§10, Phase-05 §14.1):**
- S1 ships **0 Surface crossovers**, **1-2 Echoes max** (Long Night Sinterklaas × Wild Hunt white-horse residue; Lampblack Trade only). All S1 cross-Pane cards classified as **Pattern 9 / Lampblack Trade** (residue only, no figure crossing).
- S1 ships **0 Convergence-Cathedrals.** **First Convergence at S3 finale** (max-impact-when-first; mirror-cluster candidate).
- S2 returns to full **1:2:4 Iceberg ratio** with cross-Pane Surfaces unlocked.
- **7% crossover density ceiling per Set** post-S1.
- **2 cross-Pane Moments per Legendary figure per Series max** (prevents Hercules-Xena drift).
- **No retcons. Ever.** Chain-permanence is the LoreVault NFT-native discipline; DC violated 5 times in 40 years; we don't.

Home-page hero copy: *"LoreVault has no Universes Beyond. The canon IS the world. Five Panes. The Lampblack moves between them."* Below the Lattice-painting, single CTA: *"Send me the Journal."*

---

# 11. Risk Register + Mitigations

**IP-Legal (outside counsel before Series 2 ship):**
- **Conan Doyle Estate TM-vs-copyright.** Klinger 2014 + Case-Book PD 1/1/2023; Estate retains SHERLOCK HOLMES word-marks. **Outside-counsel opinion letter pre-launch in hand.** Clearance on "SHERLOCK HOLMES" vs "LONG NIGHT" and "LATTICE-STANDARD" titles in brief.
- **Universal Monsters TM survives PD cliff.** **CA §3344.1 right-of-publicity guard:** silhouette-not-actor-face. Lugosi/Karloff-coded design only, never literal likeness.
- **Disney Aladdin (most-defended TM in library).** Series 3 timing for Arabian Nights; Carré pre-1928 + Dulac + Mughal-miniature register; SWANA panel.
- **Disney Wonderland.** Doorknob, Cheshire stripe, Burton Underland, named-Vorpal-Sword locked. Tenniel 1865/1871 only.
- **Disney EK figures.** Aurora/Belle/Ariel/Elsa silhouettes + apple/spindle/glass-slipper/mirror-frame banned. Rackham/Nielsen/Jüttner/Dulac PD only.
- **Marvel/Disney Thor.** Mjolnir = SHORT-haft cruciform Lolland; Loki = rust-and-charcoal; Asgard = Iron-Age timber longhall. Applies to Titans-Held Pane and any Norse figures in Long Night / Wild Hunt Sets.
- **Conan Properties / ERB Inc + Frazetta Estate triple-shield.** Every challenger has settled. **CEO/GC trial-or-settle posture decision required pre-S3.**
- **Howard's racist letters — Pulp Heroes.** Penguin-Classics-critical-edition rigor, or defer entirely. **CEO/GC decision required pre-S3.**

**Cultural-advisor panels (named-and-retained — Stage 2 of Cultural Review Gate):**
- SWANA (Arabian, S3)
- Shinto + folklorist + Japan-IP (Yokai, ship-gate)
- Iraqi cultural-heritage donation (Mesopotamian S3 — Mosul Museum / Smithsonian / WMF Iraq)
- NI (Cú Chulainn, S4)
- Indigenous Hudson Valley (American Gothic, S3)
- Roma + Jewish (Long Night Set — Sinterklaas-Reigns Pane figures; Dickens Fagin S2)
- Egyptian/Coptic + decolonization (Egyptian, S2)
- Near Eastern / Levantine / Kuba-Congolese / Norse (Old Ones Persist Set — required before Stage 2 can open for Drop 3)

**5 V2-named rewrites status:** mobile-first 375px **applied** · Lattice-painting (Option C) **applied** · Day-1 stepped target 15→25→35% **applied** · Footnoter bottleneck (4-seat Council split) **applied** · Y7 measurement **applied** (§12).

**3 V1 gap-closures (in flight, not ship-blocking):** BIBLE-03 §15 Mode-1/2/3 label · per-row Validate field on Set manifests · Iceberg-audit cell-flag enumeration table.

**Founder-override authority preserved per Decision 10.** Council operates on consensus; CEO holds tie-break and override on Council-Hot decisions. This is the **anti-DC-reboot discipline made public** (Decision 40 — no retcons ever).

---

# 12. Yardstick 7 "Thrilled" Operationalization

**Targets.** Q2 target **≥15%** of weekly active users emit at least one screenshot or social share. **Floor 5%** below which Y7 fails and Council seat 4 escalates to CEO.

**Measurement.** Weekly Brand24 + Tagboard search on `LoreVault` mentions across Twitter/X, TikTok, Tumblr, Reddit, Discord. Pre-analytics proxy: unique-Twitter-image-shares from Vercel `og:image` referer logs; Apex/Premium auto-share-cards instrumented separately. Daemon Track A scores commission rounds for screenshot-density; Track B scores pack-mechanics for live-stream-eligibility (Council-confirmation-moment yield).

**Stepped Day-1 Journal subscribe (V2 Rewrite 3):** Q1 ≥15% · Q2 ≥25% · Q3 ≥35% · Q4 ≥35% sustained. If Q1 < 15%, ship Q2 variant early. If Q1 ≥ 25%, do NOT relax the test — measure Y7 instead.

---

# 13. The Decision Forks (Council/CEO call needed pre-launch)

**1. 4-seat Council member naming (CEO + 3) — required by Phase-6 commission start.** Seat 1 (Lattice Architect) and Seat 2b (Footnoter, Lattice-Standard voice) are highest-stakes hires. Seat 3 = Laura Abreu universal (confirmed). Seat 2a (Voice Lead, 4 Sets) and Seat 4 (Iceberg Auditor) need names. Founder-override per Decision 10 (CEO = implicit 5th seat).

**2. Card schema V2 freeze — CEO call, required before Phase-6.** MetadataChips must reflect the three-axis model (Pane + Set + Parallel). The `shell` field from V1 is deprecated. Schema change also required for Shakespearean tether card type (Decision 29). **Both schema changes must be frozen in the same Phase-6 lock.** CEO sign-off required.

**3. Series 2 Pane selection final lock.** **Recommendation: Norse + Egyptian + Dickensian** (Synthesis §4 Decision 28). Plus Borrowed-Pane Pulp test (Warlord of Barsoom). American Gothic deferred to S3 to ship paired with Lattice-Standard second-wave for the Method-Lineage beat.

**4. Cultural-advisor panel retainers — Stage 2 readiness.** Laura Abreu confirmed as Seat 3. Named external advisors required for Old Ones Persist Drop 3 Stage 2 (Near Eastern / Levantine / Kuba-Congolese / Norse). **CEO approves slot funding before Stage 2 can open for Drop 3.**

**5. Founder voice in canon (Decision 14 — reaffirm).** **Founder voices the company; the Council voices the Lattice.** CEO does not appear in flavor text, lore-notes, or Set-drop narration. CEO appears in: home-page positioning, press releases, the doctrine essay published Dec 18 2026 alongside *Avengers: Doomsday*. **Reaffirmation required in the May-2 launch press packet.**

**6. Drops 4–5 Set spec initiation — Seat 1 + Seat 2a, required by T-60.** Dying and the Rising and Trickster Roads premises and first 10 Moments must be specified by T-60 (early March 2026) to allow Cultural Review Gate Stage 1 to open in time for August and September drops. If Seat 1 is not named by T-90, CEO escalates directly.

---

# Bundle Status + Ship Recommendation + 30-60-90 Pre-Launch Checklist

**Bundle status:** **STRENGTHEN-AND-SHIP.** V1 (Completeness) and V2 (Quality) verdicts converge. Bundle is structurally complete (V1) and aesthetically singing (V2). Three V1 gap-closures and five V2 Rewrites are either applied or in flight; none are ship-blocking. The four audience archetypes are all served with named thrill-cards. Aesthetic-totalism is delivering. Daemon Track A is hard-shippable.

**Recommended ship date:** **Series 1 launch Saturday May 2 2026, 1pm ET.**

**30-60-90 day pre-launch checklist (working backward from May 2 2026):**

**T-90 (early Feb 2026):** Council seats 1, 2a, 2b, 4 named and onboarded (seat 3 = Laura Abreu confirmed) · Lattice-painting commission awarded · Outside-counsel Conan Doyle opinion letter commissioned · 3 V1 gap-closures landed · Drop 1 (Long Night) Cultural Review Gate Stage 1 opened by Seat 3 · Drop 1 FLUX brief template prepared with Pane tint specs confirmed · 5 Lampblacker-Spine proper-noun naming pass landed (Footnote + Apprentice get proper nouns) · Near Eastern / Levantine / Kuba-Congolese / Norse advisors identified for Drop 3 Stage 2.

**T-60 (early Mar 2026):** Lattice-painting locked by Council Set-Lock · Drop 1 Cultural Review Certificate signed (all 3 stages) · Drop 1 FLUX commission queue opens — simultaneous brief packages for any cross-Pane figures · Jonathan's Journal staging live; 30-day editorial calendar May 3→June 2 locked · Pack-economy ($0/$9/$49/$199/$999) staging live with rigged-onboarding · Conan Doyle opinion letter received · Wiki deployment staged with Set files for Drops 1–3 · Drops 4–5 (Dying and the Rising, Trickster Roads) premises and first 10 Moments spec'd by Seat 1 + Seat 2a · Card schema V2 frozen (Pane + Set + Parallel chips; Shakespearean tether type; `shell` deprecated) — CEO sign-off.

**T-30 (early Apr 2026):** Drop 1 mint config locked; Founder's-Edition ($199, first 1,000) and Apex ($999, capped 100) waitlists open · Drop 2 Cultural Review Gate Stage 1 complete · Drop 2 FLUX brief packages in queue · 90-second onboarding instrumented; Day-1 stepped-target measurement live · Y7 Brand24 + Tagboard + og:image instrumentation live · May 2 launch press packet built + Q3-Q4 Liberation Drop press kit pre-built (TIME / Verge / Wired) · Drop 1 Council Set-Lock complete; mint authorized · Series 2 Pane selection (Norse + Egyptian + Dickensian) confirmed; S2 Lampblacker-Spine commissioning unlocks T+30.

**T-0 — Saturday May 2 2026, 1pm ET:** Drop 1 *Long Night* — first Set drops. Lattice-painting hero live. Jonathan's Journal Day 1 sends. 90-second onboarding live. Founder's-Edition + Apex live-streaming on Lattice home page. **CEO desk publishes the doctrine essay:** *"LoreVault has no Universes Beyond — the canon IS the world."*

---

Production brief V2 delivered. — Phase 9, 2026-04-27.
