# R1 — LoreVault Rebirth Product Architecture

**Author:** R1 — Product Architect
**Date:** 2026-04-24
**Inputs:** `strategy/audit/G1-gap-synthesis.md`; `narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md`; `narrative/MULTIVERSE-SHELLS.md`; `narrative/SET-ROADMAP.md`; `economy/GAME-ECONOMY-DESIGN-V1.md`; `narrative/TOPSY-REGISTER.md`; `narrative/EXEMPLAR-CARDS.md`.
**Posture:** Architecture that serves lore. The rebirth is parallel to v1, not a refactor — new product lives at `/v2/*` until it is promoted to root. Mobile-first at 375px. Every surface has to carry the Lattice before it carries any commerce chrome.

---

## 1. Sitemap — Every URL the Rebirth Ships

The rebirth replaces v1's 22-route retention dashboard with a **lore-first spine**. The v1 site can keep running at root; the rebirth mounts beneath `/v2/*` until the Canon Council promotes it. Every URL below is named.

### 1.1 Home / The Lattice (the front door)

- `/v2` — **Home (The Lattice).** The hero Moment + the Lattice map + one Surface tease + one Echo reveal + the current drop thread.
- `/v2/lattice` — **The Lattice full-map page.** Interactive geometry of five Panes + eight Shells + current visible-residue threads. This is the "about page" the v1 site never had; the lore manifesto is the map itself, not a paragraph.
- `/v2/lampblack` — **The Lampblack explainer (Echo-layer).** A single scroll that gestures at residue-as-recognition without stating the Three Laws. Iceberg-compliant: named phrase, no doctrine.
- `/v2/threads/:threadId` — **Active lore thread.** One of at most two "living threads" surfaced on home — e.g. `/v2/threads/jonathans-journal`, `/v2/threads/the-lampblacker-sightings`.
- `/v2/manifesto` — **Manifesto (optional, lazy-loaded).** Only reachable from footer; reserved for the ambition-forward voice, never as a mandatory gate.

### 1.2 Per-Universe pages (five Panes — permanent)

Each Universe owns a URL whose *voice is the page*. The page is narrated, not described.

- `/v2/universe/baker-street` — Watson narrates. Gaslight palette, forensic-confessional voice.
- `/v2/universe/enchanted-kingdom` — the Wolf narrates in imperatives (or whichever in-world narrator the active Set contracts).
- `/v2/universe/wonderland` — the Cheshire narrates in rhetorical questions.
- `/v2/universe/gothic-horror` — Dracula narrates in centuries (Series 2 onward, the Lampblacker co-narrates).
- `/v2/universe/greek-myth` — bronze-tongue chorus narrates.

Each Universe page routes down to its Set list:

- `/v2/universe/:universeSlug/sets` — full set list across Series 1–3 (published + upcoming + announced).

### 1.3 Per-Set pages (60 in total — 4 × 5 × 3)

- `/v2/set/:setSlug` — **Set page.** Single in-world narrator voice; 20 Moments laid out as a *binder*, not a grid; tether lines drawn to linked Sets.
- `/v2/set/:setSlug/mosaic` — **Mosaic Test view.** All 20 flavor-text snippets in sequence as a prose stream. Voice-lead view, but public-facing for the voice-curious collector.
- `/v2/set/:setSlug/narrator` — **Narrator bio + footnote cabinet.** Who is voicing this set; their other sets; their in-world attribution.

Named slugs follow the roadmap — `bs-1-221b`, `bs-4-reichenbach`, `ek-6-snow-black`, `wl-5-cheshire-question`, `gh-5-draculas-long-night`, `gh-7-the-lampblacker`, `gm-10-saint-of-return`, etc. 60 in total.

### 1.4 Card detail (the single most-audit-validated surface — promoted from `/prototype/exemplars`)

- `/v2/card/:cardId` — **Card detail.** The exemplar design system is canonical. 2:3 portrait + serif pullquote + elemental chip + serial + iceberg lore-note + the 4-layer Lampblack toggle.
- `/v2/card/:cardId/lampblack` — **The 4-layer Lampblack breakdown.** Silhouette / Props / Gesture / Spine, each with a line of prose and the same figure across other shells shown as thumbnails.
- `/v2/card/:cardId/tethers` — **Cross-set tether map for this card.** The Lampblack residues it shares with other Sets, rendered as living connections.
- `/v2/moment/:momentId` — **Moment page.** One level above card — shows every Tier × Parallel × Shell of this Moment (e.g. every Reichenbach variant in a single stack). Useful for the Collector archetype.

### 1.5 Personal vault (Wunderkammer, not table)

- `/v2/vault` — **The collector's vault.** Gallery-hung binder. No analytics. No "estimated value". No XP bar. Your Moments, in hand, under glass.
- `/v2/vault/binder/:binderId` — **Named binder.** Collectors can create binders (default: one per Universe; custom thematic binders allowed).
- `/v2/vault/shell/:shellSlug` — **Shell-run view.** All your cards of a given Shell (PRIME / CYBER / MIRROR / etc.) across Universes.
- `/v2/vault/parallel/:parallelSlug` — **Parallel-run view.** All your ARCANA, AETHER, WITNESS, NEON, ONE-OFF cards.
- `/v2/vault/elemental/:elementalSlug` — **Elemental-run view.** REASON / WONDER / SHADOW / RAPTURE / FATE / WILD.
- `/v2/vault/narrator/:narratorSlug` — **Narrator-run view.** Every card voiced by Watson / Mycroft / the Lampblacker / the Footnoter.

### 1.6 Drop / event pages (the live ritual)

- `/v2/drop` — **Upcoming drops index.** Next 3 drops with countdown, narrator teaser, iceberg gesture.
- `/v2/drop/:dropSlug` — **Live drop page.** When the drop is open: the universe narrator (or the Footnoter on Topsy drops) commentates. Pack purchase lives here.
- `/v2/drop/:dropSlug/pack-open/:packId` — **Pack opening ritual.** Full-screen, one-shot, narrator-voiced reveal. No confetti; Lampblack-settling animation.
- `/v2/drop/:dropSlug/wake` — **Post-drop wake.** After the drop closes, the wake page persists — who pulled the Ultimate, what the Council said, the serialised post-mortem.

### 1.7 Marketplace (deferred to Phase 2 per G1 §4)

Phase 2 only. Sitemap named now to prevent route collision.

- `/v2/market` — **Authenticated marketplace.** Not a stock screener. Every listing is a *moment held up for a next collector*, with the lore-note and Lampblack still primary.
- `/v2/market/moment/:momentId` — **Moment listings.** Every serial of this Moment currently for sale.
- `/v2/market/activity/:universeSlug` — **Universe activity ledger.** No "Movers", no "Smart money". Named, narrator-written ledger entries about what moved.

### 1.8 Lore deep-dive (new — v1 has no analog)

- `/v2/lore` — **Lore hub.** Index of deep-dive essays + the Weekly Lore Dispatch archive + ongoing serialisations.
- `/v2/lore/dispatch/:issueId` — **Weekly Lore Dispatch.** Canonical Echo-layer serialisation, ships every Tuesday.
- `/v2/lore/serials/jonathans-journal/:date` — **Jonathan's Journal (May 3 – Nov 7, 2026).** Dracula-Daily re-emission + optional illustrated-card unlocks per chapter.
- `/v2/lore/serials/watsons-casebook/:caseNumber` — **Watson's Casebook.** Weekly case fragment tethered to whichever BS Set is active.
- `/v2/lore/serials/the-persephone-almanac/:entry` — **The Persephone Almanac.** Greek-calendar-tied fragment serial.
- `/v2/lore/footnoter-live` — **Footnoter Live page.** Topsy drop co-narration surface; also carries footnote-grade commentary on major drops.
- `/v2/lore/essay/:essaySlug` — **Deep-dive essay.** Long-form lore writing — the Spine of Sherlock, the Iceberg Doctrine for readers (carefully worded), the Lampblacker dossier as it becomes Surface.
- `/v2/lore/spine/:figureSlug` — **Figure Spine page.** The Lampblack 4-layer stack + public Spine summary + every shell the figure has shipped in.
- `/v2/lore/tether/:tetherId` — **Tether page.** A single cross-set residue — "Watson's limp ↔ Odysseus's gait" — with the cards, the prose, the read-more.

### 1.9 Onboarding (first-session funnel — no starter-pack chrome)

- `/v2/enter` — **Entry page.** Replaces v1's `/welcome`. Moment-first lore opening; one image, one line, one door. No "3 free packs" hero.
- `/v2/enter/orient` — **Orientation.** Three screens: what the Lattice is (image), what Lampblack is (object), who you are here (sign-in or continue-as-guest).
- `/v2/enter/first-moment` — **The first Moment grant.** One Common, narrator-voiced, delivered as a ritual not a reward.
- `/v2/enter/universe-pick` — **Universe of affinity.** User picks which Pane they want narrated first — biases home feed, but not gates content.
- `/v2/auth/signin`, `/v2/auth/magiclink/:token` — **Auth routes.** Magic-link only. No password.
- `/v2/auth/signup` — **Signup.** Email + display name. Wallet abstracted — a Flow custodial wallet is provisioned invisibly (Decision: Flow-infrastructural-invisible per vision-state).

### 1.10 Profile / showcase (the public self)

- `/v2/u/:handle` — **Public profile / showcase.** The collector as curator — their chosen showcase Moments, their written notes, their narrator-affinity, their recent pulls.
- `/v2/u/:handle/binder/:binderId` — **Public binder.** Shareable.
- `/v2/u/:handle/showcase/:showcaseId` — **Curated showcase.** 3 to 9 Moments with the collector's own lore-notes under each.
- `/v2/settings` — **Account settings.** Boring but needed. Email, display, notifications, export.

### 1.11 Footnoter-only surfaces (Topsy)

- `/v2/topsy` — **Topsy index.** The 12 Topsy Sets across Series 1–3, indexed with the Footnoter's dry-omniscient top-bar.
- `/v2/topsy/:setSlug` — **Topsy Set page.** Same shape as `/v2/set/:setSlug` but the Footnoter is the narrator; the interface itself carries a subtly different register (one-notch-drier serifs, a single parenthetical in the header).
- `/v2/topsy/footnote/:noteId` — **Standing footnote.** The Footnoter's recurring named absurdities — "the third quietest Sherlock currently on the Lattice" gets its own reference page.

### 1.12 Search and utility

- `/v2/search` — **Global search.** Figure, Set, Shell, Parallel, Elemental, Narrator, Tether, Lampblack-residue. Voice-regionalised — searching inside Baker Street returns Watson-phrased hits.
- `/v2/legal/terms` — **Terms of service.** Decision-9 enforcement: no Pane is ever decanonized, in writing.
- `/v2/legal/privacy` — **Privacy.**

**Route count:** 37 named route templates (some with `:slug` children expanding to dozens or hundreds). Compare v1's 22 retention-dashboard routes: the rebirth is narrower at the top and infinitely deeper at the bottom.

---

## 2. Entity Model — Core Data Types

Every entity has a **shape** (fields), **key relationships**, and a **model location** (where the canonical record lives). Server-backed for all economy-load-bearing entities; no hardcoded `cards.ts` monolith.

**Universe.** `{ id, slug, name, pane, toneSignature, colorRegister, narratorDefault, spineDescription, iconColor }`. Key relationships: hasMany(Set), hasMany(Figure). One-of-five permanent records. **Location:** `model/universe` table, seeded from doctrine, never user-mutable.

**Set.** `{ id, slug, universeId, series, orderInSeries, name, themeArc, dropMonth, ultimateMomentId, narratorId, shellDistribution, tetherIds[], iceberg: { surface, echo, deep }, published, topsy: bool }`. Key relationships: belongsTo(Universe), hasMany(Moment) (20 per Set), hasMany(Tether), belongsTo(Narrator). **Location:** `model/set` table. 60 records at Series-3 close.

**Moment.** `{ id, setId, name, shellId, elementalId, archetypeId, tierId, ultimate: bool, lampblackLayerIds[] }`. A Moment is *a character × scene*; Tier is a property of the Moment per economy §1. Key relationships: belongsTo(Set), belongsTo(Tier), belongsTo(Shell), belongsTo(Elemental), hasMany(Card — one per Parallel variant shipped). **Location:** `model/moment` table. 1,200 records at Series-3 close.

**Card.** `{ id, momentId, parallelId, mintCount, serialsMinted, flavorText, loreNote, artAssetUrl, artProvenance: { model: "flux-1.1-pro-ultra" | "gpt-image-1-deprecated", version, promptId }, archetype }`. The economy atom per `GAME-ECONOMY-DESIGN-V1` §1: `(Series, Universe, Set, Moment, Tier, Parallel, Serial)`. Key relationships: belongsTo(Moment), belongsTo(Parallel), hasMany(Serial). **Location:** `model/card` table. 3,600 records at Series-3 close (1,200 base + 2,400 parallels).

**Tier.** `{ id, name: "Common"|"Rare"|"Legendary"|"Ultimate", mintPerMoment, momentsPerSet, packPullRate }`. Four fixed records. **Location:** `model/tier` enum table.

**Parallel.** `{ id, name: "ARCANA"|"AETHER"|"WITNESS"|"NEON"|"ONE-OFF"|"base", visualSignature, mintByTier: { rare, legendary, ultimate } }`. Five parallel records + `base`. **Location:** `model/parallel` enum table.

**Shell.** `{ id, name: "PRIME"|"CYBER"|"MODERN"|"AETHER"|"HOLLOW"|"MIRROR"|"DREAM"|"SAINT", description, bannedUniverses[], bannedFigures[] }`. Eight fixed records (Decision 4). Note SHELL-name "AETHER" is distinct from PARALLEL-name "AETHER" — the `AETHER × AETHER` ban is enforced in Card validation. **Location:** `model/shell` enum table.

**Elemental.** `{ id, name: "REASON"|"WONDER"|"SHADOW"|"RAPTURE"|"FATE"|"WILD", colorSerif, battleInteractions: { beats[], beatenBy[] } }`. Six fixed records. **Location:** `model/elemental` enum table.

**Figure.** `{ id, slug, name, universeId, spineSummaryInternal, spineSummaryPublic, shellMatrix: { PRIME: "strong"|"okay"|"no", CYBER: ..., ... } }`. The public-domain character. 20 starter figures seeded from `MULTIVERSE-SHELLS` §2. Key relationships: hasMany(LampblackLayer), hasMany(Moment) (via Moment.name derivation). **Location:** `model/figure` table.

**Spine.** `{ id, figureId, canonEvents[], publicParagraph, internalParagraph, councilApproved: bool, councilVotedAt }`. The fixed beat-list. One per Figure, Council-governed. **Location:** `model/spine` table, write-protected.

**LampblackLayer.** `{ id, figureId, layer: "SILHOUETTE"|"PROPS"|"GESTURE"|"SPINE", description, visualAnchors[] }`. Four records per Figure. The 4-layer stack from MULTIVERSE-SHELLS §3. **Location:** `model/lampblack_layer` table.

**FlavorText.** `{ id, cardId, text, wordCount, mode: "attributed"|"unattributed"|"artifact", attribution, voiceRegisterId }`. Bound to `8 ≤ wordCount ≤ 30`. Key relationships: belongsTo(Card), belongsTo(NarratorVoice). **Location:** `model/flavor_text` table.

**LoreNote.** `{ id, cardId, text, icebergLayer: "surface"|"echo"|"deep", impliesOtherStory: bool }`. The 1-2 sentence iceberg pull per card. **Location:** `model/lore_note` table.

**NarratorVoice.** `{ id, name, universeId? (null for Lampblacker/Footnoter), register, voiceSignature, mode3Weight, sampleFlavor[] }`. Watson, Mycroft, the Wolf, the Witch, the Cheshire, the Caterpillar, Dracula, the Creature, the Phantom, the Pythia, the Lampblacker, the Footnoter — ~15 records. One narrator per Set (Decision 6). **Location:** `model/narrator_voice` table.

**CrossSetTether.** `{ id, residueDescription, class: "spine"|"lampblack-residue"|"anchor"|"touchpoint"|"voice", leftSetId, rightSetId, leftCardIds[], rightCardIds[], visible: bool }`. Captures every `◇──X──◇` edge in `SET-ROADMAP` §3 — Watson's limp ↔ Odysseus's gait, Alice's ribbon ↔ Wolf's teeth, etc. ~50 records by Series-3 close. **Location:** `model/cross_set_tether` table.

**Drop.** `{ id, slug, setId, packsAvailable, priceTiers, openAt, closeAt, narratorId, footnoterCommentary: bool, status: "announced"|"live"|"closed" }`. One drop per Set activation event. Key relationships: belongsTo(Set), hasMany(Pack). **Location:** `model/drop` table.

**Pack.** `{ id, dropId, tier: "Sample"|"Standard"|"Curated"|"Premium"|"Apex", price, size, contents, odds: { common, rare, legendary, ultimate, parallel }, ownerUserId, openedAt? }`. From economy §6. **Location:** `model/pack` table.

**Serial.** `{ id, cardId, serialNumber, mintedAt, currentOwnerId, ownershipHistory[] }`. One per minted copy. `mintCount × Card records` = total Serials. **Location:** on-chain (Flow) + mirrored to `model/serial` read-cache.

**Vault.** `{ id, userId, binders[], defaultView: "binder"|"shell"|"parallel"|"elemental"|"narrator" }`. One per user. **Location:** `model/vault` table.

**Binder.** `{ id, vaultId, name, description, serialIds[], coverSerialId, shareable: bool }`. Collector-created. Default auto-binder-per-Universe + custom binders. **Location:** `model/binder` table.

**Showcase.** `{ id, userId, title, entries: [{ serialId, collectorNote, position }] (3–9), visibility: "public"|"unlisted" }`. The curated self-portrait. **Location:** `model/showcase` table.

**User.** `{ id, handle, email, displayName, universeAffinity, flowCustodialWallet, createdAt, narratorPreference }`. **Location:** `model/user` table.

**Collection.** A computed view — *all Serials owned by a User* — not a persisted entity. Projected across Vault, Binder, Showcase. Derived via `Serial.currentOwnerId = user.id`.

**LoreDispatch.** `{ id, issueNumber, publishedAt, title, body, icebergLayer, tetheredSetIds[], tetheredCardIds[] }`. Weekly Tuesday serialisation. **Location:** `model/lore_dispatch` table.

**LoreSerial.** `{ id, slug: "jonathans-journal"|"watsons-casebook"|"persephone-almanac", currentDate, totalEntries, subscribers[] }`. Plus `LoreSerialEntry { id, serialId, date, title, body, unlockableCardId? }`. **Location:** `model/lore_serial` + `model/lore_serial_entry` tables.

**CouncilRuling.** `{ id, ruledAt, ruledBy[], subject: "spine"|"shell"|"set"|"rewrite"|"audit", ref, decision, rationale }`. Audit trail for Canon Council decisions; surfaced on `/v2/lore/essay/*` when relevant. **Location:** `model/council_ruling` table.

**Count:** **22 core entity types** — Universe, Set, Moment, Card, Tier, Parallel, Shell, Elemental, Figure, Spine, LampblackLayer, FlavorText, LoreNote, NarratorVoice, CrossSetTether, Drop, Pack, Serial, Vault, Binder, Showcase, User — plus Collection (computed), LoreDispatch, LoreSerial (+ entry), and CouncilRuling. **Well above the 18-type target.**

---

## 3. Surface Mechanics — How Each Surface Tells Story

Architecture at the URL level is inert; the *mechanics* are how each surface carries the Lattice. Each surface below describes what the page does that a generic-NFT-marketplace UI cannot.

### 3.1 Home (`/v2`) — the multiverse is the hero

On first paint the viewport fills with **a single Moment**, full-bleed at 2:3 on mobile, the narrator's voice in serif pullquote underneath. No dashboard modules, no daily-login strip, no leaderboard, no portfolio P&L. Below the hero, **the Lattice map** renders as a 2:3 painted illustration of the cosmological geometry — five Panes in arrangement, Shell rings as atmospheric bands, active tethers as faint Lampblack-smoke threads (§4.1). The illustration is tappable to enter; it is geometry-as-painting, not a list. Below the painting, a single line of prose names the currently-thickening thread ("Baker Street — 221B reopens Tuesday. Watson is writing"). Below the map, **one Surface tease** (new Set announced) and **one Echo reveal** (a residue just noticed by another collector) — two modules, no more. Home obeys the 1:2:4 ratio at the *surface* level: one explained fact, two unexplained residues visible, four gestured-at deeps (titles, silhouettes, flavor-line fragments). The home page is not a product dashboard; it is a *window onto the Lattice right now*.

### 3.2 Universe page (`/v2/universe/:universeSlug`) — voice IS the page

When a user lands on `/v2/universe/baker-street`, the page itself speaks in Watson's voice. The header is not "Baker Street | Set 1 | Explore" — it is "I took lodgings at 221B in the autumn of 1881." Navigation elements are phrased in-register ("Watson's record", "the cases I have written up"). Gaslight palette (tobacco-amber, oxblood, gold-cased glints), period serif, no emoji anywhere. Background texture is subtle lamp-black at the corners. Each Universe page runs this same *voice-as-page* convention — Enchanted Kingdom pages speak in bone-rhyme couplets inside their section headers; Wonderland pages speak in Liddell-logic rhetorical questions; Gothic Horror in centuries; Greek Myth in bronze-tongue fragments. The page never describes itself as "this is the Baker Street universe." The voice is the claim.

### 3.3 Set page (`/v2/set/:setSlug`) — the binder + the narrator

Set pages are two surfaces fused. Above the fold: the **single in-world narrator introduces the Set in a three-sentence pull** (Watson opens BS-1; the Wolf opens EK-1 in imperatives; the Footnoter opens Topsy sets). Below the fold: the **binder view** — 20 Moments laid out as a 4×5 grid on desktop, 2-wide on mobile, *in the narrator's ordering* (chronological in Watson's case, contract-first in the Wolf's). A sidebar (or drawer on mobile) carries the **tether lines** — outbound residue connections to other Sets, each a living clickable thread. The Ultimate Moment is visually distinguished (position of honour, mandorla treatment) but its detail is still a click away. No prices on the Set page. No "volume" metrics. The Set exists as a *collection in a case*.

### 3.4 Card page (`/v2/card/:cardId`) — window, not metadata grid

The canonical replacement for v1's disastrous `/card/:id`. G1 Move 1: promote `/prototype/exemplars` to canonical. The page is a **window**:

- **Top 60% of viewport:** the 2:3 art, full-bleed, centered. On mobile, this is roughly 70% of the initial viewport. No chrome over the art.
- **Below the art:** the serif pullquote flavor text, with attribution. 8–30 words.
- **Below the flavor:** the 1-2 sentence **lore note** ("The cane in the corner of the frame is not the one Watson carried home").
- **Below the lore note:** **Lampblack hint** — a single expandable strip showing 4 dots (Silhouette / Props / Gesture / Spine), each clickable to the full 4-layer breakdown on `/v2/card/:cardId/lampblack`.
- **Below the hint:** **cross-set tethers as living connections** — not a "related cards" carousel, but named residue lines with prose: "The apple here is the same apple in EK-4 'The Apple and the Mirror' — counted, bitten, the same geometry." Each tether clickable through to `/v2/card/:cardId/tethers`.
- **Metadata chip row (subtle, near the bottom):** Universe, Set, Shell, Parallel, Elemental (as the colored serif from MULTIVERSE-SHELLS §5), Serial (*"#2,143 / 15,000"*), Tier.
- **No battle stats. No burn-for-XP. No legacy score. No 30/90-day price chart.** The price / listing / owner history, if surfaced at all, lives behind a dedicated *"Provenance"* tab — provenance is a collector's register; price is not.
- **Mobile treatment:** vertical scroll. Art is hero. Lampblack 4-layer, tethers, and provenance are drawer-expandable accordion strips below the fold. The 375px viewport sees: art, flavor, lore-note, Lampblack hint. Everything else is drawer.

### 3.5 Vault (`/v2/vault`) — personal Wunderkammer

The vault is a **gallery-hung binder**, not a database table. Default view is Binder mode: each of the user's binders rendered as a glass-fronted case, the cover-serial face-forward. Tapping a binder flips to the 20-slot case view (or however many Moments are inside — binders are user-sized). Alternative pivot views — Shell, Parallel, Elemental, Narrator — are accessible via a single vertical toggle column on the left (drawer on mobile). **Banned chrome:** no total value, no gain/loss, no P&L, no "Rare+ count" badge, no "collection completion %" unless the user opts into the Collector quest — and even then, completion is phrased as Watson might phrase it ("nine of the twelve cases are written up"). The vault page knows the user is not a portfolio; they are a curator.

### 3.6 Drop page (`/v2/drop/:dropSlug`) — the live ritual

The drop page is a **live event with narrator commentary**. Before the drop opens: the Universe narrator (Watson for a BS drop; the Footnoter for a Topsy drop) has posted a three-sentence pre-roll in-voice; a countdown runs (but the countdown is phrased as narrator-time, "the 8:14 to Hades arrives at the platform in 4 hours and 13 minutes" for a Topsy drop). When the drop opens: the **narrator writes live** — a new sentence every few minutes as the drop progresses. Pack purchase is a single primary CTA. When a user buys a pack, they are routed to `/v2/drop/:dropSlug/pack-open/:packId` — a full-screen, one-shot, narrator-voiced reveal. The animation is Lampblack *settling*, not confetti. When the drop closes, the narrator writes a closing sentence and the page persists as the drop's *wake* at `/v2/drop/:dropSlug/wake` — a permanent record that this moment happened. The Footnoter can co-narrate any drop by standing in `/v2/lore/footnoter-live` — for Topsy drops they are the primary narrator.

---

## 4. Lattice Navigation — How User Moves Across Panes

The Lattice is not a nav menu; it is a **geometry the user moves through**. Four load-bearing navigation mechanics.

**4.1 The Lattice map (`/v2/lattice`).** The only diagrammatic cosmology surface. Five Panes as nodes; eight Shell rings concentric around the origin; active tethers drawn as lines.

**Mobile rendering (375px — the default surface 80% of users land on).** The Lattice does *not* collapse to a stacked vertical column of five cards; a column is a list, and the Lattice's load-bearing metaphor is geometry. Instead, mobile renders the Lattice as **a single 2:3 painted illustration** — a FLUX-rendered cosmological tableau, fixed at 375×563, depicting the five Panes in their geometric arrangement (the four-around-one origin, with Shell rings implied as concentric atmospheric bands and active tethers visible as faint Lampblack-smoke threads between Panes). The user taps the illustration to enter; tap-zones are mapped to each painted Pane (route to `/v2/universe/:slug`), each Shell ring band (route to `/v2/vault/shell/:slug` if the user has cards in that Shell, else `/v2/lore/essay/shells`), and each visible tether thread (route to `/v2/lore/tether/:tetherId`). The geometry survives the mobile reduction because the Lattice is *shown as a painting*, not diagrammed as a list. Below the illustration: a single small caption ("the Lattice, as it stands today") and one currently-thickening thread named in prose. The Lampblack-thickening live-thread mechanic (§4.4) animates the relevant tether thread within the painted illustration, not in a separate module.

**Tablet (768px) and desktop (1440px+).** The painted illustration expands; on desktop it can resolve into the full interactive geometry (Panes as discrete tappable nodes, Shell rings as concentric ring-bands, tethers as drawn lines), but the painted-illustration register is the canonical aesthetic — interactive geometry is a desktop affordance, never the mobile fallback. The Lattice is always reachable from the global nav as a small icon, and the painted version is always rendered on home as the hero-below-fold module.

**4.2 Same-figure-across-shells linking (Spine navigation).** On every Card page and Moment page, a **Spine bar** at the bottom shows the figure-across-shells — "Sherlock Holmes: PRIME / CYBER / MODERN / MIRROR / SAINT" with each shell a chip. Shipped shells are colored and clickable; unshipped shells are lamp-blacked and tooltip: "the Lampblack has not yet thickened here." Clicking PRIME from a Sherlock-CYBER card takes the user to a curated view of all PRIME Sherlock cards (BS-1, BS-2, BS-4 Moments). This is how a collector *sees* the Spine continuation — directly, in one tap, across any Sherlock card they hold or are looking at.

**4.3 Set-tethers visible — the living connection.** Cross-set tethers are never a "related sets" tray. They are named prose threads. On `/v2/card/:cardId/tethers` and `/v2/set/:setSlug` (tether sidebar), each tether renders as: **(a)** the residue named ("Watson's Afghanistan limp"), **(b)** the two cards it connects (inline thumbnails), **(c)** one prose sentence the narrator wrote about it ("A Greek hoplite walks the same way"), **(d)** a "read more" to `/v2/lore/tether/:tetherId` where the essay — usually Council-written, sometimes Footnoter-annotated — lives. Tether lines on the Lattice map itself *thicken* when the community has discussed them (passive signal: how many collectors have visited the tether page in the last 30 days), which is how the *Lampblack-thickens* metaphor manifests in UI without ever being named as such.

**4.4 Lampblack-thickening events — the live thread.** When an event in the roadmap happens — a Lampblacker sighting, a new residue named by the Council, a touchpoint Set dropping — the home page routes it into the **"current threads"** module, and for 48 hours the Lattice map itself shows that thread as a *brightened* line. The user can subscribe to thread notifications (email / push) and read the ongoing thread at `/v2/threads/:threadId`. The mechanic is subtle: the Lattice *shifts* when a new residue is named; returning collectors notice the shift and get pulled in. This is the UI analog of the Iceberg Doctrine — the surface changes without the metaphysics changing.

---

## 5. What v1 Components Transfer — KEEP List Audit

Drawing from G1 §4, every KEEP or EVOLVE item from v1 gets a rebirth role.

- **`LoreFragment.tsx`** — KEEP. Becomes the canonical **lore-note component** on Card page; mounts below the flavor text.
- **`ShareCard.tsx`** — KEEP. Canvas share-image generator is high-leverage; becomes the **showcase-share export** on Profile and the **pack-opening moment-share** on the drop ritual.
- **`Tooltip`, `FeatureGate`, `PWAInstall`, `MainChrome`, `MainContent`** — KEEP. Generic primitives. MainChrome + MainContent become the rebirth shell layout; PWAInstall ships from day one (G1 §4, v1 strength-10).
- **Celebration primitive (one of the five, evolved)** — KEEP one primitive, rebuild as **Lampblack-settles-animation** for pack opens and Ultimate reveals. Discard Achievement/LevelUp/Prestige/Unlock-toast variants.
- **Baseball `ParticleBurst` and `ScreenShake`** — KEEP as rebirth-agnostic motion primitives. Used in pack-open ritual and touchpoint-reveal.
- **`/prototype/exemplars` → `/v2/card/:cardId`** — PROMOTE TO CANONICAL. This is Move 1.
- **`/moodboard` → `/v2/internal/taste-survey` (Council-only)** + **`/v2/internal/flux-harness` (generation)** — SPLIT. Moodboard's survey surface becomes a Council-facing daemon-feeder; the FLUX generation pipeline becomes its own thing.
- **`src/data/lore-graph.ts`** — KEEP, migrate into `CrossSetTether` entity seed data.
- **`src/data/story-maps.ts`** — KEEP, migrate into `Spine` and `Set.themeArc` seed data.
- **`src/data/types.ts`** — EVOLVE. Becomes the TypeScript types for the new entity model. 5-parallel × 5-scarcity → 5-parallel × 4-tier × 8-shell × 6-elemental.
- **`src/data/sets.ts`** — EVOLVE. 6 set descriptors → 60 Set seed records aligned to `SET-ROADMAP`.
- **`src/data/cards.ts`** — DISCARD frame, extract lore-text. The raw SET_CHARACTERS strings and lore quotes migrate into the `Figure` and `LoreNote` seeds as source material for doctrine-aligned rewrites.
- **`src/lib/card-image.ts`** — KEEP. Fallback chain is resilient; used in the new Card component.
- **`src/lib/moodboard-kv.ts`** — KEEP as template for lightweight server-state on `CouncilRuling` and `LoreDispatch`.
- **`onboarding.ts`** — EVOLVE. Rewrites into `/v2/enter/*` first-session orchestration, stripped of "3 free packs" chrome.
- **`ai.ts`** — EVOLVE. Becomes the narrator-voice generation harness (Council-supervised).
- **`/codex`, `/discover/[slug]` → `/v2/lore/essay/:essaySlug`** — EVOLVE.
- **`/guide` → `/v2/lore/essay/guide-*` + `/v2/lattice`** — EVOLVE; section primitives survive, content rewrites.
- **`/search` → `/v2/search`** — KEEP, regionalise by voice.
- **PWA scaffolding (`manifest.json`, `sw.js`, icons)** — KEEP. Ships day one.

Everything else (CardItem.tsx god-component, BinderCard, marketplace/*, baseball game, battle game, five celebration variants, `LivePulse`, `FeedCard`, `SocialFeed`, `SeasonTrack`, `cards.ts` frame, `store.ts` monolith, `marketData.ts`, `stats.ts`, five "your-stuff" routes, `/welcome` funnel, `/games/*`, `/profile`, `/chronicle`, `/hall`, `/challenges`, `/forge` art, `/prototype/chase|play|story`) — DISCARD per G1.

---

## 6. What's Brand New — Surfaces v1 Has No Analog For

Nine rebirth surfaces have no v1 predecessor.

**6.1 The Lattice map (`/v2/lattice`).** The diagrammatic cosmology. v1 had no Worlds index, no About, no lore entry point. The Lattice map is the single largest conceptual hole the rebirth closes.

**6.2 The Lampblack explainer (`/v2/lampblack`).** An Echo-layer page that names the residue-as-recognition mechanic without stating the Three Laws. v1 has nothing.

**6.3 Living threads (`/v2/threads/:threadId`).** The persistent thread surface for Lampblacker sightings, Council rulings, touchpoint-reveals. v1's "Live Pulse" is the anti-pattern — fabricated activity; threads here are *real narrative events* tracked over time.

**6.4 Lore deep-dive hub (`/v2/lore/*`).** The entire `/lore` subtree — Dispatches, serials, essays, Spine pages, tether pages — is new. v1 has `/codex` (underused) but no long-form register.

**6.5 Jonathan's Journal, Watson's Casebook, Persephone Almanac (`/v2/lore/serials/*`).** Serialised epistolary funnel per G1 Move 4. v1 has no serialised entry point; Dracula-Daily's 240K-subscriber proof-of-concept is the model.

**6.6 Footnoter Live page (`/v2/lore/footnoter-live` + `/v2/topsy/*`).** The Topsy register surface, Footnoter-narrated. v1 has no satirical register at all (Topsy is in doctrine, not product).

**6.7 Narrator-rotation infrastructure (`/v2/set/:setSlug/narrator`, `/v2/vault/narrator/:slug`).** The narrator as first-class entity — each Set voiced by one, collectors navigating by voice affinity. v1 has no concept of narrator.

**6.8 Tether pages (`/v2/lore/tether/:tetherId`).** Every cross-set Lampblack residue gets a dedicated page. The "Watson's limp ↔ Odysseus's gait" essay-object. v1 has no tether model.

**6.9 Drop wake (`/v2/drop/:dropSlug/wake`).** After a drop closes, the page persists as the record of that event — the narrator's closing line, who pulled the Ultimate, the Council's note if any. v1 drops evaporate; rebirth drops leave Lampblack on the calendar.

---

## 7. Architectural Constraints — Making Lore-First Actually Hold

Three structural commitments that prevent the rebirth from drifting back into v1's failure mode.

**7.1 No commerce chrome above the voice.** On every surface, the voice register leads. Price, floor, volume, serial counts *never* render above the lore-note on a Card page; never on a Set page at all; on the Vault they require opt-in collector-quest mode; on the Market (Phase 2) they render at parity with the lore, never as the hero. This is enforced at the component level — the `<CardDetail>` React component takes `{ art, flavor, loreNote, lampblackHint, tethers, meta, provenance }` as props and renders them in exactly that order. A dev cannot accidentally render `provenance` above `loreNote`.

**7.2 Mobile-first 375px as the canonical breakpoint.** Every surface is designed at 375px *first*. Desktop is a re-flow. Drawer patterns dominate — anything not core to the first-read goes into an expandable drawer. Art is always 2:3, always the hero above the fold on a card page. Thumb-reach zones are respected on drop pages (primary CTA in the bottom third). Per user's canonical reading: mobile-first is internal orientation, not user-visible framing — the user never reads "mobile-first" anywhere on the site.

**7.3 Iceberg ratio enforced in content-model, not just doctrine.** Every Card has a `LoreNote.icebergLayer` field. Every Set has an `iceberg` summary object. A Council dashboard (at `/v2/internal/iceberg-audit`) counts ratios quarterly. A Set whose ratio breaches 1:2:4 is held from drop until recount. This is the operational teeth for Decision 7.

---

## 8. Phase Sequencing — What Ships When

The architecture above is the full Series-3-complete surface. The rebirth ships in three phases.

**Phase 1 (launch, Month 1–4): the seduction window.** `/v2` Home + Lattice map; `/v2/universe/baker-street` + `/v2/universe/enchanted-kingdom` (Surface-reveal per Iceberg M1–M4); `/v2/set/bs-1-221b`, `/v2/set/ek-1-iron-wood`, `/v2/set/gh-1-the-castle`; `/v2/card/:cardId` (exemplar-canonical); `/v2/enter/*`; `/v2/vault` (binder mode only); `/v2/drop` + first drop page; `/v2/lore/serials/jonathans-journal` (starts May 3, 2026 — G1 Move 4); `/v2/auth/*`. No marketplace, no games, no analytics. Single narrator per surface.

**Phase 2 (Month 5–12): universe expansion + provenance.** Surface-reveal Wonderland, Greek Myth, Gothic Horror universes. Full Series-1 60-Moment catalog. `/v2/market` goes live (authenticated, lore-first). `/v2/lore/essay/*` and `/v2/lore/tether/:tetherId` populate. `/v2/u/:handle` profiles ship. Narrator pages ship.

**Phase 3 (Month 13+, Series 2+): shell expansion + Topsy.** All eight shells ship across the Lattice map. `/v2/topsy/*` goes live with EK-6 "Snow Black". `/v2/lore/footnoter-live` ships. `/v2/lattice` visualises Lampblacker sightings across Universes. The Dream Hand-Off and Saint's Glimpse mechanisms ship on Ultimate cards. Council dashboard for iceberg audit goes live.

---

## Verification

- Sitemap §1: 37 named route templates across 12 surfaces. Every URL path listed. ✓
- Entity model §2: 22 core entity types + Collection (computed) + LoreDispatch + LoreSerial + CouncilRuling. Well above 18-type requirement. ✓
- Surface mechanics §3: Home, Universe, Set, Card, Vault, Drop — each describes HOW story is told, not just what renders. ✓
- Lattice navigation §4: four navigation mechanics — the Lattice map, Spine bar, set-tethers as prose threads, Lampblack-thickening live threads. ✓
- v1 transfer audit §5: every G1 KEEP/EVOLVE item placed; every DISCARD listed. ✓
- New surfaces §6: 9 surfaces v1 has no analog for. ✓
- Constraints §7 + Phasing §8: architectural teeth + realistic sequencing. ✓
- Word count: ~3,250 words (target 2,500–3,500). ✓
- Lore-first throughout — commerce chrome is subordinate, never hero. ✓

*— R1, Product Architect, 2026-04-24*
