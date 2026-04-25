# NORTH-STAR — LoreVault

**Status:** Canonical vision. The first document anyone joining LoreVault reads.
**Date:** 2026-04-24
**Maintained by:** the Canon Council.

---

## 1. The Pitch

LoreVault is an illustrated trading-card multiverse built from public-domain literature — Sherlock and Dracula and Alice and Persephone and the Wolf at the door — held together by one cosmological idea: **every figure exists across many possible worlds, and what proves they are the same figure is the residue left behind when those worlds brush against each other.** We call the geometry *the Lattice*. We call the residue *Lampblack*. We ship one Set a month, twenty Moments per Set, painted at MTG-mythic density and written at Pratchett caliber. Each card is an object, not a row in a marketplace.

It is for collectors who like Pokémon's pull drama, Magic's flavor discipline, Dracula Daily's serialized re-emission, and the small private feeling of recognising a deerstalker's shadow in a portrait of an emperor four centuries removed. It is what Top Shot would be if Top Shot had a literary register, a doctrine, and a Council that could veto the founder. It is what Magic could be if Magic's bible permitted Pratchett. It is what Wicked is, repeatable, monthly, on glass instead of stage. It is the home an authenticated literary canon has not had on-chain. We are building it parallel to the v1 site, not iterating, because the v1 site is a Top Shot clone with literary names painted on; the rebirth is a different product underneath, and you cannot refactor your way from one to the other.

---

## 2. The Audience

Eight sub-archetypes ground the four primary lenses. Per A4 §5: a 240,000-subscriber Dracula Daily diaspora, a 110,000-work Sherlockian fan canon on AO3, a Discworld graphic-novel wave shipping in 2026, an MCU-pre-taught multiverse audience awaiting *Avengers: Doomsday* in December, and the gambler-collector cohort still moving $8.6M a week through Courtyard for tokenized Pokémon. Four entry points map to four primary archetypes.

**The gambler-completionist (entry: the drop).** 30–50, owns Top Shot and at least one Courtyard card, will spend $5,000 in a single drop if scarcity is credible and the secondary has a bid. *"Authenticated scarcity, pull drama, IP gravity"* — A4 §1's three-thread survival rule. They enter on Day 0 of a drop, watch the live narrator commentary, buy the Apex pack, hunt the Parallel ladder. The card detail page has to read as an *object* before it reads as an asset. We give them the depth-of-spend ladder ($0 / $9 / $49 / $199 / $999) the economy spec describes; we never give them a stock screener.

**The Pratchett-discoverer (entry: the Footnoter).** 18–28, came to Discworld through the 2026 Puffin graphic novels or the BBC adaptation. They land on a Topsy entry — *"Snow Black asked the apothecary whether the apple was free-range"* — and stay because the voice is sincere about its joke. They do not arrive looking for a card; they arrive looking for a sentence. The Footnoter is the door.

**The taste-collector (entry: the exemplar card).** 28–45, designer or gallerist or architecture-Twitter, post-PFP refugee looking for *"lore without jpg-shame."* A4 §5 archetype 5. Buys for the object; reads the lore later. They land on `/v2/card/:id` and the painted FLUX render at 2:3, the serif pullquote, the Lampblack smudge in the corner, the elemental serif at the lower-right is sufficient. The Vault is their Wunderkammer; the Showcase page is their portfolio.

**The lore-hunter (entry: serialized re-emission).** 22–35, BookTok-and-Tumblr native, joined Dracula Daily for the memes and stayed for the community; the Multiverse Lorehead (A4 §5 archetype 6) overlaps. They subscribe to *Jonathan's Journal* on May 3, then *Watson's Casebook*, then *The Persephone Almanac*. They read tether pages. They post theories on the Canon Theory Wall. They notice that a cane in BS-1 is the same cane in GM-3 a month before the Footnoter confirms it. They are the funnel and the brand at once: cheap to acquire, slow to monetize, structurally permanent.

The Sherlockian Completist, the Dracula-Daily Diaspora, the Romantasy Aesthete, the Multiverse Lorehead, and the Canon-Gamer (A4 archetypes 1, 3, 4, 6, 8) are subdivisions of these four — they enter through the same four doors with different first reads. The Reading Room (London for Series 1, Edinburgh for Series 2) gives the Completist a phygital anchor; the Set-completion badge case gives the Canon-Gamer their grail; the bone-rhyme register gives the Romantasy Aesthete the prose density of a sprayed-edge first edition. Every archetype's first session ends with five cards in hand and one Footnoter letter waiting.

---

## 3. The Bar — Six Specific Yardsticks

These are the gates the Council enforces. Each is measurable. A Series that misses any one is a Series that does not ship until it doesn't.

**Yardstick 1 — Art.** Every render is FLUX 1.1 Pro Ultra (`seed-exemplars-flux.mjs` expanded; `gpt-image-1` retired entirely). Painterly density and dramatic-lighting-and-iconography metrics meet or exceed an MTG mythic-rare reference set, blind-rated by a 5-person panel of MTG-collectors-not-on-staff against a stratified sample (50 LoreVault cards, 50 MTG mythics from Wilds of Eldraine forward). Pass bar: ≥60% of LoreVault renders preferred head-to-head. The five exemplars in `public/prototype-art/exemplars/` are the locked floor; nothing below them ships. Single-artifact iconicity (A5 §3 Unsaid 5) is a hard requirement: every card carries one Lampblack-strong object describable in one sentence.

**Yardstick 2 — Flavor.** *Mark-Rosewater-survives-edit-pass for ≥80% of texts.* Current V2 baseline is 44% (`REVIEW-quality.md`); this is the most concrete known craft gap. Operationalized as: each Set's 20 flavor texts are run blind through a panel of 3 MTG-flavor-trained editors (paid contractors, never staff). They mark *would survive*, *would rewrite*, *would reject*. ≥80% *would survive* per Set is the gate. The Mosaic Test (FLAVOR-TEXT-DOCTRINE §5) sits underneath: 18 of 20 cards Pane-identifiable from prose alone by a non-narrative-staff blind panel.

**Yardstick 3 — Lore.** Every card carries iceberg-pull. The 1:2:4 ratio (Cosmology Decision 7) is enforced at card-level granularity per V2 Rewrite 4 — minimum 12 Echo elements + 24 Deep references per Series, named, screenshotted, audited quarterly by the Council. The card-level test: a non-collector reading the lore-note on a single card should be able to identify one *unexplained* element in frame and one *implied second story* outside frame. If they cannot, the card is held.

**Yardstick 4 — IA.** *The lattice legible within 90 seconds of first visit.* Per R3, a hostile first-time visitor — thumb on back gesture, 28 years old, BookTok refugee — must encounter three Moments, one repeated structural pattern (figure × multiple panes), and one named noun (*Lampblack*) by t=45. By t=90 they must be able to answer "what is this?" in one sentence in their own words. Tested with five-second tests on Prolific against a 50-respondent sample per quarter; pass bar is ≥70% giving a coherent answer in respondent-own-words.

**Yardstick 5 — Operational.** *One Set per month, sustained, AI-augmented, Canon Council gating.* 20 Moments × 12 months = 240 Moments per Series, ~720 distinct renders with Parallels. R4's pipeline: 7 FTE, ~$0.30 FLUX cost per card, ~15-20 minutes of human attention per card, four Council-gated review points (Brief, Art Direction, Voice, Set-Lock). The Council's bandwidth is the binding constraint — three seats can defend ~60 Moments/month at Set-Lock without skipping the Mosaic Test. Two Sets per month is the steady state; one Set per month is the floor; zero Sets per month is failure.

**Yardstick 6 — Audience.** *100+ paid pack opens in beta cohort with ≥40% return-rate at week 4.* The Day-30 retention of *Jonathan's Journal* subscribers — the closest analogue to Dracula Daily's organic re-open rate at smaller scale — is the bellwether. ≥40% Week-4 return on the beta cohort proves the cadence holds; below 30% the cadence is wrong; below 20% the product is wrong. Paid pack opens > 100 in beta is a low bar; what matters is the curve, not the level. We are looking for a habit, not a transaction.

These six are the Series 1 gate. Pass all six and Series 2 commissioning unlocks. Fail any one and Series 1 holds until the gap closes.

---

## 4. The Cosmology, in One Page

There is a multiverse called **the Lattice**. Every story humans have told that survived into the public domain — Sherlock Holmes, Alice, Dracula, the Wolf at Grandmother's door, Persephone descending — is a single, fragile *Pane* in that Lattice. The character you know is a *figure* caught mid-gesture inside one Pane. The same figure exists in other Panes — wearing different chassis, frozen in different gestures — but is always recognisably *itself*.

The thing that links Panes is **Lampblack**. Lampblack is the residue burned off when one Pane brushes against another. A drop of Lampblack on a Pane is what lets a Victorian Sherlock recognise a robot Sherlock as kin and not as costume. It is the Lattice's only physics. We will not invent a second.

Three laws govern. *The Spine* — every figure has a non-negotiable beat-list they must enact in every shell, or they stop being that figure (Sherlock: deduces, falls, returns, refuses domesticity). *The Lampblack* — cross-Pane recognition is communicated through visible residue: a recurring symbol, prop, line, or scar that survives translation (Watson's Afghanistan limp; Alice's blue ribbon). *Panes Touch, They Do Not Merge* — there is no Earth-Prime, no canonical Sherlock; each shell is equally real. The Laws are felt, not stated, until at least Year 3.

Eight **shells** are locked across Series 1–6 (PRIME, CYBER, MODERN, AETHER, HOLLOW, MIRROR, DREAM, SAINT — the version of the figure being depicted). Five **Parallels** cut across all of them as art treatments (ARCANA, AETHER-Parallel, WITNESS, NEON, ONE-OFF). Six **elementals** cut across all of them as values registers (REASON, WONDER, SHADOW, RAPTURE, FATE, WILD). Shells are the chassis; Parallels are the lighting; Elementals are the temperament. A Sherlock-CYBER × ARCANA × REASON is distinct from a Sherlock-CYBER × WITNESS × REASON. Every card carries all three plus its Universe, Set, Tier, and Serial.

Lampblack is rendered as a four-layer stack — **silhouette, props, gesture, Spine** — that must hold conjunctively, not disjunctively. An octopus with a blue ribbon is not Alice. A bodyless data-cloud with a deerstalker overhead is not Sherlock. A still-life of an apple on a plinth is not Snow White. Drop one layer and the card fails Council review.

The cosmology reveals on a **1:2:4 iceberg ratio** — for every unit of Surface (named and explained), two units of Echo (visible and unexplained), four units of Deep (gestured at, never shown). The Iceberg is the rate-limiter that prevents Lattice-soup. A Council-gated quarterly audit enforces it.

A meta-figure called **the Topsy register** runs through 20% of Sets — a Pratchett-grade satirical mode, MIRROR or DREAM shell only, voiced by an un-depicted narrator named *the Footnoter*. Topsy is the moat. Magic's bible disallows it. We do not.

That is the cosmology. Two nouns, three laws, eight shells, five Parallels, six elementals, four Lampblack layers, one ratio, one Footnoter, one Council. Everything else descends from it.

---

## 5. The Five Universes

**Baker Street — *the Pane of Argument*.** Gaslight, fog, the click of a pocket-watch, paper turning in lamplight. Cold deduction with a warmth at the hearth. The Lattice's prosecuting attorney — the Pane where reality is interrogated and forced to confess. When a card from another Universe needs to be tested against logic, a Baker Street figure does the testing. Holmes is the Lattice's standing scepticism; Watson is the witness whose presence makes the genius bearable. *Forensic-confessional voice* (Yawgmoth-and-Karn-adjacent). Blue-and-white moral register. Mode-3 (artifact) at 25% — case files, telegrams, Watson's notebook clippings. The voice in which the Lattice argues with itself.

**Enchanted Kingdom — *the Pane of Inheritance*.** Forest at dusk, woodsmoke, iron-bound chests, the specific cruelty of stepmothers and wolves. Pre-Disney darkness. The Pane through which generational consequence flows; if a figure in another Universe is paying a debt their grandmother incurred, Enchanted Kingdom is where the ledger is kept. Snow White's apple, Cinderella's ash, Hansel's crumbs — all are Lampblack-rich because they survive across centuries. *Bone-rhyme voice* — wolves in imperatives, witches in conditionals, stepmothers in third-person passive. Black-and-green register. Mode-3 at 50% — woodcut inscriptions, marginalia, recipes. The Universe most fluent in sympathetic-villain reframing; this is where Wicked happens, twelve times.

**Wonderland — *the Pane of Categorical Failure*.** Vivid impossible color, garden geometry that doesn't add up, sentences that loop. Carroll's logic-puzzle sub-stratum under nonsense surface. The Lattice's fault zone — the Pane where the categories of other Universes (size, time, cause, identity) stop holding. *Liddell-logic voice* — the Hatter Niv-Mizzet-adjacent (rhetorical question, never explains), Alice the Reversal Joke (three beats: expectation, expectation, snap), the Cheshire the figure who almost sees the Lattice and never says. Pure-Blue register. HOLLOW is structurally banned here (apocalypse implies coherent before-and-after; Wonderland denies coherent time). DREAM is its home shell.

**Gothic Horror — *the Pane of Transformation*.** Wet stone, candle-wax, breath in cold rooms, the specific anatomy of fear. Stoker, Shelley, Leroux, Stevenson — the literature of the body as betrayer. The Lattice's body horror archive — every figure who is not what they appear to be, every body that is also a confession. *Operatic-exhaustion voice* (Sorin-adjacent) — Dracula in centuries, the Creature in negations, Hyde in present-tense imperatives, the Phantom in incomplete sentences interrupted by music. Black register, with red-borderline at the operatic figures. HOLLOW is its native shell. Series 2 adds an original anchor — *the Lampblacker* — Council-voiced, walks between Panes leaving residue, never explained.

**Greek Myth — *the Pane of Fate*.** Bronze, wine-dark sea, stone polished by feet, the specific weight of inevitability. Hesiod, Homer, Ovid. The Pane that holds cosmic-scale debt — Atlas, Sisyphus, Prometheus, the Furies. Where Enchanted Kingdom holds three-generation debt, Greek Myth holds *forever*. *Bronze-tongue voice* — figures speak as if quoted by Hesiod three centuries after they died; the voice is already in citation. White-and-red register. Mode-3 at 50% — epic-fragment inscriptions, oracle pronouncements, prayer-tablet text. AETHER is native; MIRROR is structurally rare (Decision 12: the gender architecture of Greek myth is foundational; flipping it removes Lampblack rather than adding it).

---

## 6. The 8 Shells — One Sentence Each

**PRIME** — the figure in their canonical period, Spine fully present, no relocation; the mandatory baseline every figure must occupy.

**CYBER** — cyberpunk relocation; the figure in a near-future high-tech low-life chassis, where the deduction-engine, the transformation, the made-thing all gain new substrate without losing Spine.

**MODERN** — today's urban world; the figure in 2026 with phones, Ubers, jetlag, Slack — only legal where the threat-register translates and never as escalation-to-parody.

**AETHER** — mythic-cosmic register; the figure raised to god-tier scale, depicted against nebulae and divine particulate, only legal where the Spine can support cosmic weight.

**HOLLOW** — post-apocalyptic; the figure operating after a catastrophe, native to Gothic Horror, banned from Wonderland, the shell where survival is the Spine.

**MIRROR** — identity-inverted (gender-flipped, role-swapped, canonical-relationship-reversed) — only legal when the inversion is answered by a Spine event, never just a costume change.

**DREAM** — psychedelic-spiritual; the figure depicted in waking-dream register — Wonderland's home, banned from Sherlock (who refuses dream-logic by Spine).

**SAINT** — the figure mythologised to god-tier within their own canon; the version after fans have prayed to them for a century, the icon-on-the-wall, the patron of those who fell down holes.

---

## 7. The Year-One Arc

**Series 1 — *"The Glass Catches Light"* (Months 1–12).** The thesis is restraint. Every Universe ships its most recognisable figures first because Lampblack only resonates against canon people knew before they got here. The Lattice and Lampblack are *named* but never explained. The Three Laws are *felt*, not *stated*. The 1:2:4 ratio holds. By the close of Series 1, attentive collectors are theorising the Three Laws on their own; we never confirm them. Twenty Sets, 5 Universes × 4 Sets each, ~400 base Moments + Parallels.

**Month 1 — Surface ships.** BS-1 *221B* (Watson-narrated, 20 PRIME), EK-1 *The Iron Wood* (the Wolf in imperatives, 20 PRIME), GH-1 *The Castle* (Dracula in centuries, 20 PRIME), WL-1 *The Threshold* (Cheshire in rhetorical questions, 20 PRIME), GM-1 *The Descent* (Persephone, bronze-tongue, 20 PRIME). The site itself is 5 Universe pages, 5 Set pages, 100 Cards, the Lattice map, and the first *Jonathan's Journal* entry shipping May 3. No marketplace, no analytics, no games. *Jonathan's Journal* runs daily May 3 – November 7 in parallel — Stoker's 1897 epistolary novel re-emitted on canonical dates, illustrated, free, monetised via optional card unlocks per chapter. The Footnoter writes the first three onboarding letters. Auth is magic-link-only; the wallet is invisible Flow custodial.

**Month 6 — first cross-Universe Lampblack visible.** BS-3 (Moriarty's chessboard) and GM-2 (the Shield of Achilles) ship in adjacent months and the Lampblack Tally (Sunday newsletter, Footnoter-voiced) names the residue without explaining it. Watson's Afghanistan limp echoes in a Greek hoplite's gait. We do not confirm. The first Topsy Set (the Series-1 canary) ships somewhere in Q3 — likely an Enchanted-Kingdom MIRROR set near Halloween, voice-tested against the Snow Black exemplar.

**Month 10 — the apex.** BS-4 *Reichenbach* ships. The Ultimate Moment is *Holmes at the Falls*. The Wednesday Set-Lock Review for this Set is the bar-setting moment of the year — the Council either passes it or holds it; passing it is the proof the pipeline can ship a generational artifact at monthly cadence.

**Month 12 — Series 1 closes.** BS-12, EK-12, WL-12, GH-12, GM-12 — the lattice-touchpoint Sets — *do not* ship in Series 1. They sit in Series 3. Series 1 closes with a *first tether audit* (the Lampblack Tally promotes one Echo from Series 1 to Surface for Series 2) and a two-week silence. Then the Series 2 thesis lands.

**What is withheld — permanently or for years.** The origin of the Lattice (no creation myth, no first Pane). The number of Panes (finite but uncounted). The metaphysics of Lampblack itself (we say it is residue; we never say why contact produces it). The names of all Three Laws stated together (one is confirmed at Year 3 at earliest, the other two stay submerged forever). The Borrowed Pane is gestured at from Month 15 but does not get its own Set until Series 3+. *The Lampblacker* (Decision 11, GH-7) ships in Series 2, never in Series 1.

The withholding is not coyness. It is the rate-limiter. Every fact named narrows the Lattice; every visible-edge-of-the-unsaid enlarges it.

---

## 8. The Rebirth Posture

The rebirth is parallel to v1, not iterative. The v1 site at `lorevault-site.vercel.app` keeps running as artefact-of-decisions; the rebirth mounts at `/v2/*` until the Council promotes it to root. We do not refactor our way from Top-Shot-clone-with-literary-names into the Lattice; the gap is too wide on too many axes (G1 §3 enumerates four critical gaps at huge distance: Visual, Surface/IA, Voice/Copy, Audience-Experience).

**What we keep, per G1 §4.** `/prototype/exemplars` — promoted to canonical `/v2/card/:id`. The five FLUX exemplars in `public/prototype-art/exemplars/` are the locked visual standard; nothing below them ships. `LoreFragment.tsx` (only v1 component that speaks rebirth language). `ShareCard.tsx` (canvas share-image generator, becomes Showcase export). `lore-graph.ts` and `story-maps.ts` (lore-first data structures, migrate into the new entity model). `card-image.ts` (resilient fallback chain). `moodboard-kv.ts` (template for lightweight server-state). `seed-exemplars-flux.mjs` (binding image substrate, expanded to full character coverage). `rebuild-manifest.mjs` (manifest-from-filesystem recovery, schema-migrated to FLUX). The PWA scaffolding ships from day one. Set/world descriptions on the picker (a writer exists on this team; the product has buried them — promote the voice). The doctrine corpus in full: Cosmology, Shells, Set-Roadmap, Flavor-Text Doctrine, Topsy, Exemplars, Game-Economy, V2 Review.

**What we evolve.** The 5-parallel × 5-scarcity matrix migrates to 5-parallel × 4-tier × 8-shell × 6-elemental. The 6-set descriptors collapse to 5 Universes. `/welcome` becomes `/v2/enter` with the "3 free packs" hero replaced by a Moment-first lore opening. `/codex` and `/discover/[slug]` retrofit to current doctrine. `/moodboard` splits into a Council-facing taste-survey and a separate FLUX generation harness. `taste/ART-DIRECTION-V3.md` lifts its Canon-Specific Visual DNA section (Paget / Tenniel / Nielsen / Coppola / Waterhouse) into a v4 successor; the v6 MODES mapping is superseded by Parallels.

**What we discard.** The 13-module retention dashboard home. Battle Stats on Sherlock Holmes (and the entire `/games` tree — battle, trivia, dice-baseball). The Burn-for-XP destructive CTA. The "Estimated Value History −69.6%" red price chart. The Need/Own/Comfy/Bulk marketplace tabs and every trader-vernacular string. The 200-card hardcoded `cards.ts` catalog. The fabricated `marketData.ts`. The 60 KB / 1,780-line `store.ts` monolith. The 34 KB `CardItem.tsx` god-component owning eight unrelated concerns. The five near-identical confetti celebration components. `LivePulse`, `FeedCard`, `SocialFeed`, `SeasonTrack` — all fabricated activity chrome. `gpt-image-1` end-to-end. Emoji world-pickers. The contradictory Season-1 storyline. The "DNA chips never explained." Mute-everything.

**Why parallel-build, not iterate.** Because four of the seven gaps the audit identified are *critical at huge distance* (G1 §3 severity table) and three of them (Visual, Surface/IA, Voice/Copy) require structural rebuilds where every line of code touches every other line. Iterating would mean a hybrid product running two card design systems and three voice registers in the same session — exactly the v1 failure (A3 §7 seam 4, seam 11). Parallel-build means the rebirth ships clean and the v1 site teaches us, by absence, what we left behind. The cost of the parallel build is one quarter of duplicated infrastructure; the cost of the iterative build is structural compromise across thirty-six months.

---

## 9. The Three Decisions That Bind

Three non-negotiables. Everything else flexes.

**Decision One — The Canon Council overrides the founder.** Three seats — Chief Worldbuilder, Voice Lead, Art Director — empowered in writing from drop one to override the founder on canon questions. The founder is a non-voting fourth seat who can be overridden by unanimous Seats 1–3. The Council's only continuous job is gatekeeping the Spines, the 1:2:4 iceberg ratio, and the eight-shell taxonomy. This is the single highest-leverage operational decision in the property: decoupling the IP from the founder is what makes the Lattice survivable past one bad creative season, one regulatory crisis, or one founder departure. The Pokémon Company structure transplanted at one-tenth scale. Without this, every other constraint is founder-vetoable and therefore non-binding.

**Decision Two — No Pane is ever decanonized.** Star Wars Legends taught the lesson; we do not learn it twice. Every card sold remains canon to its own Pane forever. Future doctrinal change cannot retroactively reduce a collector's holdings. The Lattice may shift; the card does not. This is in the Terms of Service in plain English, and it appears as a one-line *Trust Contract* on every card detail page: *"This Pane is canon. The Lattice may shift; this card does not."* The collector's investment is structurally protected against future founder caprice. This is the single strongest collector-protection move in the deliverable.

**Decision Three — The 4-layer Lampblack is conjunctive.** Silhouette, Props, Gesture, Spine — all four must hold across every shell translation, never just any one. An octopus with a blue ribbon is not Alice; a hat-rack with a deerstalker is not Sherlock; a still-life of an apple is not Snow White. The Mosaic Test enforces voice; the 4-layer test enforces visual identity. A card that drops one layer fails Council review without exception. This is what prevents the Lattice from collapsing into prop-fetishism (where every card is a deerstalker on a different background) or shell-substitution (where any silhouette can be re-skinned into any character). Lampblack rigour is what makes the multiverse legible at thumbnail size.

These three are immovable. They bind the Council, the founder, the art pipeline, the voice pipeline, the legal contract, and the customer's relationship to their object. Everything in the rebirth descends from them; nothing in the rebirth contradicts them.

---

## 10. The Operating Heartbeat

The daemon's cycle, in one paragraph. Continuous taste capture flows from `/v2/internal/taste-survey` (the moodboard-survey surface, Council-rated daily) into `TASTE-MODEL.md`, refreshed weekly Sunday 22:00 by a cosine-similarity classifier trained on the rolling 200-rating window; the latest snapshot scores every FLUX prompt before generation in Step 4 of the card pipeline (G1 §3.7, R4 §5); soft-fail prompts auto-revise once, hard-fails surface to the Art Director, repeated hard-fails on the same Shell × Character cell trigger a Council escalation that downgrades the cell from Strong to Okay in the next matrix refresh. Generation runs overnight on kaaos-daemon, FLUX 1.1 Pro Ultra via Replicate, four parallel renders per prompt, ~$0.30 per card. Mosaic Scorer auto-runs every morning on the prior day's flavor texts; Brief Validator gates every new card before it costs a single render. Drift report ships monthly to the Council.

**Council cadence.** *Monday 10:00 — Stand-up (30 min)*: triage the queue, fast approve / kick / reject the exceptions the agents flagged; no full-card-by-card review — the agents do that. *Wednesday 14:00 — Set-Lock Review (90 min)*: any Set due to lock in 14 days is walked card-by-card; this is where the Voice Lead exercises the 24-hour-pre-lock rewrite and the Art Director signs the FLUX batch. *Friday 16:00 — Drop Retro + Iceberg Audit-in-Motion (60 min)*: review the Set dropped that week, scan Echo/Deep performance, log to TASTE-MODEL. *Quarterly (every 13 weeks = one Series) — Iceberg Compliance Audit (half-day)*: the 1:2:4 ratio is re-audited; any quarter that breaches is failed and Sets hold until correction.

**Feedback loops.** Three are continuous, three are interval. Continuous: Mosaic Scorer (auto, per card), taste-model classifier (auto, per prompt), Council triage queue (daily, agent-pre-scored). Interval: Set-Lock review (weekly), Drop Retro (weekly), Iceberg Audit (quarterly). Cross-loop: the Friday Drop Retro feeds the Sunday Lampblack Tally (Footnoter-voiced public newsletter); the Tally feeds community theorising on the Canon Theory Wall; the Theory Wall feeds the Council's quarterly Echo-promotion decision (which Echo from Series N gets Surface-promoted to Series N+1). The community is, by design, the slowest-frequency feedback loop in the system; the agents are the fastest.

**Kill switches.** Any Council seat can pull a card up to 48 hours pre-drop, no questions asked; the slot fills with a pre-approved sandbox card from the Council vault (R6 Lesson 3 — sandbox absorbs overflow, never the spine). Any seat can pull a Set up to 48 hours pre-drop; the Set holds a week. The CEO can invoke an emergency post-lock kill within 2 hours of deploy; this has never been tested in production and the pipeline is designed so it shouldn't be needed. The Mosaic Test is a hard gate: a Set scoring below 18-of-20 Pane-identifiable-from-prose-alone holds. A Set whose iceberg ratio breaches 1:2:4 holds. A Topsy Set that fails the *"did you make this up?"* CEO test holds. *Holding* is not failure; *not holding* a failed Set is failure.

**What "done" looks like.** A Set is done when (a) twenty Moments have shipped through the nine-step pipeline, (b) the Council has unanimously locked it on Wednesday Set-Lock Review, (c) the Mosaic Test passes 18-of-20, (d) the Iceberg audit shows ≥2× Echo and ≥4× Deep relative to Surface, (e) the FLUX manifest contains zero `gpt-image-1` provenance, (f) every card carries a four-layer Lampblack stack verified by the Brief Validator, (g) the narrator has written the drop's pre-roll cold-open, the Day-0 live commentary script, the Day +3 continuance, and the wake page. A Series is done when twenty Sets are done, the cross-Universe tethers from §3.4 are visible on the Lattice map, and the Council has voted to promote one Echo from the prior Series to Surface in the next. The property is done when no human writer is ever embarrassed by a flavor text that ships, and no collector can describe their card as a row.

---

## 11. The Anti-Vision — What This Is NOT

Six anti-patterns. Specific. Banned from the rebirth in the same way *gpt-image-1* is banned from the manifest.

**Anti-pattern 1 — NFT-marketplace-with-IP-skin.** The v1 site is the canonical example. A stock-screener with public-domain authors swapped for athletes — Listings / 7D Volume / Market Cap / Avg Sale tiles, Movers strips, portfolio P&L, Need/Own/Comfy/Bulk tabs (A3 §4). LoreVault is not that, structurally. The marketplace ships in Phase 2, post-auth, at parity-with-lore (never as hero), with the lore-note above the price on every listing. The word *floor* never appears on a card detail page. The phrase *Smart money* never appears anywhere.

**Anti-pattern 2 — Pratchett-cosplay.** Footnotes glued onto generic flavor text are not Pratchett. *"It is a peculiarity of the universe..."* opening every Topsy line is not Pratchett. Snark for snark's sake is not Pratchett. The Footnoter's voice is *dry, omniscient, intermittently sentimental in ways that catch the reader off-guard*; one sincere line per Set, sincere line lands harder than the jokes (Decision 19), Set name telegraphs joke without explaining (Decision 20: "Snow Black" passes; "Snow White But Funny" fails). The single-Voice-Lead-writes-every-Footnoter-line rule (R4 §7) is a moat cost, not a bug. Pratchett-cosplay is what happens when you let an LLM draft Pratchett unsupervised.

**Anti-pattern 3 — AI-slop-with-better-art.** Generation is volume; humans enforce the bible. Four human-judgment gates per card (Brief, Art Direction, Voice, Set-Lock). The Mosaic Test is a hard gate. The 4-layer Lampblack test is a hard gate. The Iceberg ratio is a hard gate. *AI-augmented, not AI-only* (R4 §6). A pipeline that lets a single Sherlock card ship without the temple-fingertip gesture is a pipeline that, at thirty-six-month scale, will produce 1,200 cards no collector remembers. The gating *is* the product.

**Anti-pattern 4 — Top-Shot-with-fairy-tales.** Battle Stats on Sherlock Holmes (Power 45 / Intelligence 59 / Mystery 85 / Legend 95 / Charm 60) is the canonical specimen — the moment any literary reader closes the tab. So is Burn-for-XP on a Common Common. So is Legacy Score: Pristine 2 on a 9,667-mint card. So is the daily-login strip, the streak counter, the season countdown ticking by the second, the FOMO Pulse. We are not Top Shot with public-domain authors. We are the literary register Top Shot doesn't have and structurally cannot acquire (its IP licensing forbids it; ours requires it).

**Anti-pattern 5 — *Once Upon a Time*-bloat.** Fifty crossovers in Season 4 because the writers ran out of pure stories. We do not bloat. The Iceberg Doctrine 1:2:4 is the rate-limiter. The eight-shell taxonomy is locked through Series 6 (Decision 4). New shells require unanimous Council approval *and* a shipped justification doc — including for the founder. The *Borrowed Pane* (Series 2+) absorbs every figure who would, under bloat pressure, be rushed into a permanent Universe; it is structurally non-canon, which is the feature. The 20% Topsy ratio (Decision 16) is enforced as a band, not a license — below 15% the register undersaturates, above 25% the joke overruns the sincere register and the corpus reads as parody.

**Anti-pattern 6 — Pottermore-grade expansion-by-decree.** A press-release that says "actually, Sherlock has always been left-handed." The community-converges-first rule (Decision 8: at most one Law per year, starting Year 3, on whichever Law the community has already named) forecloses this. We do not publish a Spine reference document. We do not publish a Lattice census. We do not publish the metaphysics of Lampblack. We let collectors name the residues — Watson's limp, Alice's ribbon — and we let those names propagate without confirmation. The brand is not a wiki. The Council's discipline is to *withhold the second sentence*.

A useful test for any proposed feature, line, or shipped artifact: does this read as one of the six? If yes, hold it. If unclear, hold it. The product's identity is built as much by what it refuses as by what it ships.

---

## 12. The Tagline

**Every figure you half-remember is a figure with a Spine. The Lampblack is what proves they are.**

---

*— LoreVault Canon Council, North Star, 2026-04-24*
