# LoreVault — Game & Economy Design v2

**Status**: Design spec, not yet implemented.
**Reference model**: NBA Top Shot's set/tier/parallel system, adapted for public-domain-character digital collectibles.
**Supersedes**: GAME-ECONOMY-DESIGN-V1.md
**Date**: 2026-04-27
**Change summary**: Replaces the "Universe" dimension with "Pane" (cosmological variant), introduces multi-Pane Standard Pack composition, adds Pane Pack and Thread Pack product types, and defines the Lampblack Residue cross-Pane collecting mechanic.

---

## 1. Core Atoms

A LoreVault card is uniquely identified by three orthogonal attributes plus administrative fields:

```
Card = (Series, Set, Pane, Moment, Tier, Parallel, Serial)
```

- **Series** — time-bounded drop cycle (Series 1, Series 2, …). Series 1 runs ~12 months.
- **Set** — a narrative arc or themed collection (e.g., "The Long Night", "The Wild Hunt"). A Set has fixed composition and goes out of print after its mint window. Sets are thematic, not IP-based.
- **Pane** — cosmological variant. Every figure that exists in LoreVault exists within one or more Panes. A Pane is a self-consistent mythological worldview — a cosmology in which certain figures reign, certain laws hold, and certain stories are told. See §2.
- **Moment** — a specific figure × scene within a Pane (e.g., the Wild Hunt at full gallop in the Pane "Wild-Hunt-Eternal"). Tier is a property of the Moment.
- **Tier** — Surface / Echo / Deep (see §3). Three rarity levels with internal grades.
- **Parallel** — cross-cutting art-treatment variant. Any Moment can (optionally) exist as a Parallel. Unchanged from v1 — see §4.
- **Serial** — the numbered mint within the (Moment × Tier × Parallel) pool.

**Key change from v1**: "Universe" has been replaced by two distinct concepts. "Set" remains the thematic collection (what v1 called "Set" within a Universe). "Pane" replaces the old "Universe" concept but is cosmological rather than IP-canon-based — a Pane is a mythological frame, not a character franchise. A single Set can and typically does contain cards from multiple Panes (see §2 and §6).

---

## 2. Panes (Cosmological Variants)

A Pane is a complete cosmological worldview — a mythos with its own pantheon, its own laws, and its own version of figures that may also appear in other Panes. Panes are permanent and do not expire.

**Key distinction from v1 Universes**: In v1, a Universe owned its characters exclusively (Holmes was Baker Street's; Dracula was Gothic Horror's). In v2, a figure can exist across multiple Panes, each time rendered through that Pane's cosmological lens. Odin appears in "Wild-Hunt-Eternal" as the storm-rider leading the hunt; the same archetype-handle "Odin" appears in "Sinterklaas-Reigns" as a gift-bringer riding the sky. Same root figure, different Pane, different art treatment, different Moment framing. This cross-Pane recurrence is not a contradiction — it is a design feature called **Lampblack Residue** (see §7).

**Example Panes (Series 1):**

| Pane | Cosmological frame | Tone | Example figures |
|---|---|---|---|
| **Wild-Hunt-Eternal** | The Hunt never ends; the sky is always a battlefield; death is a rider, not a door | Elemental, relentless, storm-dark | Odin as hunt-master, Herne, the Morrigan, Cernunnos |
| **Sinterklaas-Reigns** | Midwinter gift-law governs the world; the Bishop and his retinue are cosmic arbiters of merit | Ceremonial, ambivalent mercy, deep-winter | Sinterklaas, Zwarte Piet figures, the White Mare |
| **Old-Ones-Persist** | The boundary between the living and dead is a negotiated treaty, perpetually renegotiated | Liminal, bureaucratic-dark, funerary-formal | Persephone, Anubis, the Ferryman, Hel |
| **Lattice-Standard** | The bright half of the year is sovereign; the Court of Light holds dominion; sacrifice is festive | Exultant, sacrificial-bright, flower-crowned | The May King, Brigid, Lugh, the Green Man |
| **Titans-Held** | The world runs on dream-logic; figures shift; no single form is final | Mercurial, oneiric, shape-unstable | Morpheus, Coyote, Loki, the Sandman-type |

Each Pane has a distinct **base-art register** applied to its Moments: Wild-Hunt-Eternal uses storm-grey and bone-white; Sinterklaas-Reigns uses deep crimson and candlelight gold; Old-Ones-Persist uses verdigris and funeral linen; Lattice-Standard uses saturated emerald and gilded daylight; Titans-Held uses iridescent ink-wash and shifting geometry.

**Pane count**: Series 1 launches with 5 Panes. New Panes may be added in future Series but never retired — a collector's Pane cards remain valid cross-Pane connectors indefinitely.

---

## 3. Tier System

Three tiers with two or three grades each. The Iceberg Doctrine governs supply: **1 : 2 : 4** ratio of Deep : Echo : Surface cards by count of distinct Moments.

| Tier | Grade | Mint / Moment | Moments per Set | % of Set Supply | Pack pull rate | Notes |
|---|---|---|---|---|---|---|
| **Surface** | — | 15,000 | 12 | 75% | ~70% / pack slot | Everyday scenes, supporting figures, lived-in moments. Accessible entry point. |
| **Echo** | I | 2,500 | 4 | ~18% | ~22% / pack slot | Strong secondary moments. Iconic gestures, distinctive scenes. |
| **Echo** | II | 2,500 | 1 | ~3% | ~3% / pack slot | The moment that defines a figure's role in the Pane. |
| **Deep** | I | 250 | 2 | ~2% | ~4% / pack slot | Second-tier transcendent. Moments fans remember by name. |
| **Deep** | II | 50 | 1 | ~0.4% | ~1% / pack slot | Apex of the Set. One per Set: "The Hunt Crests the Ridge." "The Gifts Are Weighed." |

**Note on v1 mapping**: v1's Common → Surface; v1's Rare → Echo I/II; v1's Legendary → Deep I; v1's Ultimate → Deep II. The Iceberg Doctrine (1:2:4 Surface:Echo:Deep) is unchanged in spirit; grades within Echo and Deep add granularity without changing the supply ratios materially.

**Total supply per Set**: 12×15,000 + 5×2,500 + 2×250 + 1×50 = **193,050 base cards** (before parallels).

**Iceberg doctrine visibility rule**: Deep II cards ("the apex") must never be described to players by their drop-rate number. They are described only as "exceptionally rare." The 1:2:4 ratio of Moment counts (not supply) is the structural anchor: 12 Surface Moments, roughly 5 Echo Moments, roughly 3 Deep Moments per Set.

---

## 4. Parallels (5 — cross-cutting, unchanged)

**THE CORE INNOVATION vs Top Shot**: parallels aren't foil treatments, they're distinct art variants — the same Moment seen through a different artistic lens.

Each Parallel has its own visual signature that cuts across all Sets and Panes. A collector can "hunt the ARCANA" across every Set like Top Shot collectors hunt Cool Cats or Metallic Gold LE.

Supply is much tighter than base. Each Parallel is only minted for **Echo+ Moments** (not Surface — keeps the Parallel chase premium).

| Parallel | Visual signature | Mint / Moment (Echo I) | Mint / Moment (Echo II) | Mint / Moment (Deep I) | Mint / Moment (Deep II) |
|---|---|---|---|---|---|
| **ARCANA** ★ | Sacred-geometry mandala / alchemical sigils glowing behind the figure's head; golden occult filigree; cosmic aurora | 500 | 500 | 50 | 5 |
| **AETHER** | Aurora-cosmic backdrop, nebulae, divine particulate, god-rays — the Mythic mode | 250 | 250 | 25 | 3 |
| **WITNESS** | Photoreal time-travel — documentary cinema realism of the mythological setting, Deakins/Lubezki register | 100 | 100 | 10 | 2 |
| **NEON** | Modern/cyber reimagining — figure relocated to near-future urban-gothic, synthwave palette | 50 | 50 | 5 | 1 |
| **1/1** | Unique commissioned variant — completely different art, often alternate Moment framing | — | — | — | **1** |

★ = lead parallel for Series 1 launch.

**Pack odds for parallels**: 1 in every ~40 Standard Packs contains ONE parallel card (any Parallel × any Echo+ Moment). Distribution within that is weighted: ARCANA 50% / AETHER 25% / WITNESS 15% / NEON 10%. 1/1 variants are NOT in packs — they drop as separate curated offerings.

**Pane-Parallel interaction**: A Parallel's visual signature overrides the Pane's base-art register partially. ARCANA's sacred geometry is applied on top of each Pane's color palette (so an ARCANA card from Wild-Hunt-Eternal uses storm-grey geometry; from Sinterklaas-Reigns uses crimson-and-gold geometry). The Parallel is visually dominant; the Pane's palette tints it. This means the same Parallel "hunt" has five distinct visual flavors, one per Pane.

---

## 5. Sets (Thematic Collections)

A Set is a narrative arc or themed collection. Unlike v1 Sets (which lived inside a single Universe), v2 Sets span multiple Panes by design — the Set's theme is the unifying element, and Panes are the cosmological lenses through which figures within that theme are seen.

**Example — Series 1 Sets:**

| Set ID | Name | Thematic arc | Panes represented | Deep II Moment (apex) |
|---|---|---|---|---|
| S1-01 | **The Long Night** | The darkest night of the year; figures of cold and threshold | Wild-Hunt-Eternal, Sinterklaas-Reigns, Old-Ones-Persist | The Hunt crosses the zenith |
| S1-02 | **The Wild Hunt** | The return of light; sacrifice and renewal | Lattice-Standard, Wild-Hunt-Eternal | The May King burns |
| S1-03 | **The Old Ones Persist** | The dead speak; the living listen; boundaries dissolve | Old-Ones-Persist, Titans-Held | Persephone names the price |
| S1-04 | **The Trickster Roads** | Shape-shifters negotiate the terms of reality | Titans-Held, Lattice-Standard, Sinterklaas-Reigns | Loki seals the bargain |

**Set structure**: 20 Moments per Set = 12 Surface + 4 Echo I + 1 Echo II + 2 Deep I + 1 Deep II. Same pattern across every Set for consistency.

**Series 1 scope**: 4 Sets × 20 Moments = **80 Moments total** in Series 1 base.

Cross-Set and cross-Pane distribution of Moments is intentional: a figure like Odin may appear in S1-01 (Wild-Hunt-Eternal lens) and again in S1-04 (Titans-Held lens as the god of cunning). These are different cards with different Moment IDs, different art, and different Tier assignments. They are linked by **Lampblack Residue** (§7).

**With parallels (Echo+ only)**:
- Echo I: 4/Set × 4 Sets = 16 Echo I Moments × 5 Parallels = 80 parallel instances
- Echo II: 1/Set × 4 Sets = 4 Echo II Moments × 5 Parallels = 20 parallel instances
- Deep I: 2/Set × 4 Sets = 8 Deep I Moments × 5 Parallels = 40 parallel instances
- Deep II: 1/Set × 4 Sets = 4 Deep II Moments × 5 Parallels = 20 parallel instances

**Total unique (Moment × Tier × Parallel) catalog entries for Series 1**: 80 base + 160 parallel = **240 distinct art pieces**.

---

## 6. Pack Structure

Three standard pack types carried over from v1 plus two new Pane-specific formats.

### 6.1 Standard Pack (existing — updated composition rules)

| Pack | Price | Size | Guarantees | Rare+ Parallel odds |
|---|---|---|---|---|
| **Sample** | Free | 1 Surface | New-user / reactivation | 0% |
| **Standard** | $9 | 8 cards | ≥1 Echo or Deep; **2–3 Panes represented** | ~2.5% |
| **Curated** | $49 | 5 Moments | ≥1 Echo II or Deep; ≥2 Panes | ~8% |
| **Premium** | $199 | 6 Moments | ≥1 Deep I; ≥2 Panes | ~30% |
| **Apex** | $999 | 7 Moments | ≥1 Deep I + 1 guaranteed Parallel + 10% Deep II shot; ≥2 Panes | Guaranteed |

**Standard Pack multi-Pane rule (critical design constraint)**:

Every Standard Pack must contain cards from **at least 2 Panes** and no more than **3 Panes**. This is not a soft preference — it is a hard composition constraint enforced at pack-generation time.

Rationale for this constraint:
1. **Immediate encounter with coexistence**: every new collector, on their first pack, sees that multiple cosmologies share the same product. There is no mono-Pane on-ramp.
2. **Lampblack discovery surface**: if a collector pulls card A (Odin in Wild-Hunt-Eternal) and card B (Odin in Sinterklaas-Reigns) in the same pack, the Lampblack Residue link is surfaced immediately in the pack-open UI. This is a design moment — the "wait, they're the same figure?" reveal.
3. **Pane isolation prevention**: a collector cannot complete a Pane's Surface tier by pulling only Standard Packs from one Pane. Standard Packs are cosmologically mixed by design. Mono-Pane completion requires Pane Packs (§6.2).

**Pack composition algorithm (Standard, 8 cards)**:

```
Step 1: Select Pane count — roll for 2 (70%) or 3 (30%) Panes.
Step 2: Select Panes — weighted random from active Panes in the current Set.
        (Weights may be tuned per promotional period; default: equal weight.)
Step 3: Allocate card slots across selected Panes proportionally.
        2-Pane pack: 5 cards from Pane A, 3 cards from Pane B (or 4/4).
        3-Pane pack: 3 cards from Pane A, 3 from Pane B, 2 from Pane C.
Step 4: Apply tier-pull logic per slot as normal (Surface-heavy weighting).
Step 5: Verify guaranteed minimums (≥1 Echo or Deep across the pack).
        If guarantee not met, upgrade the lowest-tier slot to Echo I (forced).
Step 6: Apply Lampblack Residue check — if two cards share an archetype-handle
        across different Panes, flag the pack for enhanced reveal animation (§7.3).
```

**Free pack cadence**: every active user gets 1 Sample pack / week. Reactivation lever unchanged.

### 6.2 Pane Pack (new)

A focused pack for collectors who want to complete a specific Pane's figures.

| Pack | Price | Size | Guarantees | Pane constraint |
|---|---|---|---|---|
| **Pane Pack** | $14 | 6 cards | ≥1 Echo; all 6 cards from same Pane | Single Pane, caller-selected |

**Mechanics**:
- The collector selects which Pane they want before purchase. The selection is binding.
- All 6 cards come from the chosen Pane, drawn from the currently active Set(s).
- Parallel odds are identical to Standard Pack (~2.5% per card).
- The Pane Pack is the only way to guarantee Pane-specific Surface completion without receiving cross-Pane cards. It costs slightly more per card than Standard ($14 / 6 = $2.33/card vs $9 / 8 = $1.13/card) to reflect the collector focus premium.
- Pane Packs are available for all Panes as long as the Pane has an active Set in print. When a Set goes out of print, Pane Packs for that Pane's cards in that Set are discontinued.

**UI note for implementation**: the Pane Pack purchase flow must show the collector which Moments they are still missing from the selected Pane before they buy. This "completion nudge" is the primary conversion driver for Pane Packs.

### 6.3 Thread Pack (new)

A pack that follows one **Lampblack Residue** across 3 or more Panes.

| Pack | Price | Size | Guarantees | Pane constraint |
|---|---|---|---|---|
| **Thread Pack** | $29 | 6 cards | ≥1 Echo; ≥1 card per Pane in thread (min 3 Panes) | Multi-Pane, thread-specific |

**Mechanics**:
- Each Thread Pack is built around one **archetype-handle** — a named cross-Pane figure (e.g., "The Odin Thread", "The Wild-King Thread", "The Ferryman Thread").
- The pack contains one card from each Pane in which that archetype-handle appears (minimum 3 Panes, maximum 5).
- Remaining card slots (if thread has fewer than 6 distinct Pane appearances) are filled with Surface cards from the same Panes using proximity-matching (thematically adjacent figures).
- Thread Packs are curated by the design team and released on a schedule — they are not algorithmically generated on demand. A Thread Pack is released when a given archetype-handle has at least 3 distinct Pane appearances in print.
- The Thread Pack is explicitly designed to seed Lampblack Residue discovery: a collector who purchases "The Odin Thread" receives one Odin-variant from each of 3 Panes, and those three cards are pre-linked in the Residue system on first open (§7).
- Thread Packs have no Parallel guarantee, but inherit standard pack parallel odds (~2.5% per card).

**Example Thread Pack — "The Odin Thread" (S1):**
- Card 1: Odin as Hunt-Master — Wild-Hunt-Eternal, Surface tier
- Card 2: Sinterklaas (Odin-derived bishop figure) — Sinterklaas-Reigns, Echo I tier
- Card 3: The Wanderer at the Threshold — Titans-Held, Surface tier
- Cards 4–6: proximity fill (associated figures: Huginn/Muninn, the gallows tree, the grey horse)

---

## 7. Lampblack Residue

Lampblack Residue is the cross-Pane collecting mechanic. It is named for the phenomenon of carbon-black soot that travels between candles and settles on unrelated surfaces — evidence of invisible connection.

### 7.1 Definition

A **Lampblack match** occurs when:
- Two or more cards a collector owns share the same **archetype-handle** AND
- Those cards come from **different Panes**

An **archetype-handle** is a canonical identifier assigned to a cross-Pane figure at the data level. It is NOT the card's display name (which varies by Pane — "Sinterklaas" and "Odin" are different display names but may share archetype-handle `wotan-gift-bringer`). Archetype-handles are set by the design team and stored in the card metadata.

**Archetype-handle rules**:
- One archetype-handle per root figure per tradition cluster. Handle names use kebab-case and reference the mythological root (`wild-hunt-rider`, `underworld-ferryman`, `trickster-shapeshifter`).
- A card may carry at most one archetype-handle. If a figure is genuinely unique to one Pane with no cross-Pane echo, it carries no archetype-handle and participates in no Residue sets.
- The design team maintains the archetype-handle registry. Handles are not shown to collectors by their internal name — only through the Residue display system.

### 7.2 Residue Set Completion

A **Residue set** is complete when a collector owns 3 or more cards sharing the same archetype-handle across different Panes.

| Residue depth | Requirement | Collector achievement |
|---|---|---|
| **Residue Kindled** | 2 cards, same archetype-handle, 2 different Panes | UI notification: "A connection stirs." Residue line drawn on card detail pages. |
| **Residue Bound** | 3 cards, same archetype-handle, 3 different Panes | Badge awarded: "[Figure] Bound" (e.g., "Wanderer Bound"). Card detail pages show full Residue map. |
| **Residue Complete** | Cards from all Panes in which the archetype-handle appears | Badge awarded: "[Figure] Complete" (e.g., "Wanderer Complete"). Exclusive cosmetic: Residue glow treatment added to all matching cards in the collector's display. No new mint, no supply change — purely a display achievement. |

**Tier independence**: Residue matching is tier-agnostic. A Surface card and a Deep II card from different Panes with the same archetype-handle count equally toward a Residue set. This ensures the Residue mechanic is accessible — a new collector can start building a Residue set with Surface cards from Standard Packs without needing rare pulls.

**Parallel independence**: Parallel variants count toward Residue sets. Owning the ARCANA version of a card counts the same as owning the base version for Residue purposes. However, the Residue glow cosmetic (Complete reward) is applied to all versions of the matching cards the collector owns — so a collector who also owns an AETHER parallel of a matched card sees the glow on both.

### 7.3 Residue Display on Card Detail Pages

Every card detail page must display the following Residue section when the card carries an archetype-handle:

**When the collector does NOT yet own a matching card from another Pane:**
```
─── LAMPBLACK RESIDUE ──────────────────────────
This figure echoes across Panes.
Find their other forms to kindle the connection.
[Greyed-out silhouettes, one per Pane where handle exists]
────────────────────────────────────────────────
```

**When the collector owns ≥1 matching card (Residue Kindled):**
```
─── LAMPBLACK RESIDUE ──────────────────────────
Connected across [N] Panes
[Pane name]: [Card display name] — [thumbnail] ✓ In your collection
[Pane name]: [Card display name] — [thumbnail] ✗ Not yet collected
────────────────────────────────────────────────
```
The display name shown is the card's own display name within its Pane (not the internal archetype-handle).

**When Residue Bound or Complete:**
The Residue section renders with the full map expanded by default, all matched cards shown with tier badges, and a "Residue [status]" banner. The Residue glow cosmetic is visible in the card image itself.

**Implementation note**: the Residue section is rendered client-side against the collector's inventory. No new backend data model is required beyond: (a) archetype-handle field on card records, and (b) a collector-level achievement store for Residue state per handle. The "greyed-out silhouettes" for undiscovered Pane appearances are populated from the archetype-handle registry; they reveal the Pane name but not the card's display name until the collector owns at least one card from that Pane (any card — Residue or not). This prevents spoiling figure names in Panes the collector hasn't encountered.

### 7.4 Lampblack Residue in the Pack-Open UI

When a Standard Pack or Thread Pack is opened and two or more cards in the pack share an archetype-handle across different Panes:

- After the standard card-reveal sequence completes, a secondary animation fires: the matching cards slide together, a black-smoke particle effect connects them (Lampblack), and the text "[Figure display name] appears across [N] Panes — Residue kindled" is displayed.
- If the pack-open completes a Residue set (Bound or Complete), the animation is extended with the full Residue glow effect and badge award.
- This animation is skippable but opt-out (on by default). It is the primary organic discovery moment for the Lampblack mechanic.

---

## 8. Collection Completion Model

In v1, "completing a Set" was the primary collecting goal. In v2, there are three distinct completion goals, each with different scope and difficulty.

### 8.1 Completing a Set

**Definition**: owning at least one card of every Moment in the Set, at any tier, from any Pane represented in that Set.

This is the broadest completion goal. Because a Set spans 2–4 Panes and 20 Moments, Set completion requires cross-Pane collecting. It cannot be achieved by pulling only Pane Packs from a single Pane.

Achievement: **"[Set Name] Collector"** badge.

### 8.2 Completing a Pane within a Set

**Definition**: owning at least one card of every Moment from a specific Pane's contribution to a specific Set.

Because Moments within a Set are distributed across 2–4 Panes, a Pane's share of a Set is typically 5–10 Moments (not all 20). This is a more focused goal achievable via Pane Packs.

Achievement: **"[Pane Name] — [Set Name]"** badge.

### 8.3 Completing a Pane (all Sets)

**Definition**: owning at least one card from every Moment attributed to a specific Pane across all currently-in-print Sets.

This is the deepest single-Pane collecting goal. It spans all Sets in which the Pane participates and requires a combination of Standard Packs and Pane Packs over time.

Achievement: **"[Pane Name] Lorekeeper"** badge + exclusive: the collector's showcase profile gains the Pane's banner art as a background.

### 8.4 Parallel Completion (cross-cutting, unchanged)

Completing a Parallel run (owning every card in a specific Parallel across all Moments where it was minted) remains a meta-goal independent of Set or Pane completion. This is the hardest and most prestigious collecting goal.

Achievement: **"[Parallel Name] Master"** badge (e.g., "ARCANA Master") + exclusive drop reserved for the first collector to complete each Parallel run.

---

## 9. Growth-Loop Checks (CEO Doctrine Filters)

### ✅ 1. Grow L/XL segment?
Apex packs at $999 + 1/1 variants as curated drops create a high-end spend surface. Parallels give whales a chase target beyond base Sets. Lampblack Residue Complete achievements add a prestige layer visible in collector profiles. **YES.**

### ✅ 2. Reactivate lapsed?
Free Sample packs weekly + a "Welcome Back" Starter drop of Surface-tier art = no-cost re-entry. Lampblack Residue notifications ("your collection is one card away from Residue Bound on [Figure]") are a targeted reactivation message format. **YES.**

### ✅ 3. Depth of spend $10 → $10K?
- $0 entry (Sample) → $9 Standard → $14 Pane Pack → $29 Thread Pack → $49 Curated → $199 Premium → $999 Apex → 4–6 figure secondary market on Deep II / 1/1. **YES, with two new mid-range entry points.**

### ✅ 4. Four archetypes?
- **Collector**: Set completion + Pane completion + Residue completion + Parallel hunts.
- **Gamer**: Daily pack opens + Deep pull moments + Residue reveal animations.
- **Speculator**: Marketplace with Echo+/parallels as liquid assets. Residue Complete cards gain cosmetic premium (glow) that displays in showcases — secondary market visibility.
- **Connector**: Free Sample packs + shareable Deep II reveals + Residue kindling animations shareable on socials.
**YES.**

### ⚠️ 5. Makes outsiders curious?
The Pane model adds a mythology dimension that rewards discovery — "I didn't know Sinterklaas was an Odin-echo" is a curiosity-hook beyond art quality. The Lampblack Residue reveal animation is a shareable social moment distinct from the standard pack-open. **YES, conditional on Residue animations being genuinely striking and the archetype-handle connections being genuinely interesting (design team responsibility).**

### ✅ 6. Whales visible?
Deep II pulls, 1/1 drops, Residue Complete badge + glow in showcase profiles, and Pane Lorekeeper banners are all visible on collector profiles. **YES.**

### ✅ 7. Free entry point?
Free Sample pack weekly. **YES.**

### ⚠️ 8. Cheap to test first?
The Pane model increases art requirements (each Pane has a distinct base-art register, so the same Moment in two Panes is two distinct images). Series 1 scope at 80 Moments base + 160 parallels = 240 images at ~$0.17/image ≈ **$41** for full catalog. Prototype path: one Set (20 Moments × 2 Panes = 40 base images + ARCANA parallels for Echo+ = ~56 images total = ~$9.50) as a single prototype Set validating both Pane art registers and the Residue reveal animation. **48-hour prototype path intact, slightly higher image cost than v1 due to Pane multiplication.**

---

## 10. How the v6 MODES Map to This System (Updated)

The six modes map to Parallels as before, but now also interact with Pane base-art registers.

| v6 MODE | Role in v2 |
|---|---|
| `painterly-epic` | **Base art** for all tiers in all Panes — then tinted/filtered through each Pane's color register post-generation. |
| `ornate-ritual` | **ARCANA parallel** — sacred-geometry mandala, gold-leaf filigree, tinted with Pane palette. |
| `mythic-cosmic` | **AETHER parallel** — aurora, nebulae, divine particulate, tinted with Pane palette. |
| `witness-photoreal` | **WITNESS parallel** — photoreal time-travel realism, Pane setting informs historical/natural context. |
| `modern-reimagined` | **NEON parallel** — cyber reimagining, Pane tone informs the future-city aesthetic (e.g., Wild-Hunt-Eternal NEON = storm-drone chase; Sinterklaas-Reigns NEON = surveillance-state gift logistics). |
| `dream-psychedelic` | Reserved for Titans-Held Pane base-art register — not a cross-cutting parallel, but the Pane's native visual language. May be promoted to a 6th Parallel in a future Series. |

1/1 is not a mode — it is commissioned bespoke art, one at a time.

**Pane-register implementation**: Pane color registers are applied as post-processing filter presets on top of `painterly-epic` base renders. This keeps generation cost at approximately 1× per Moment (one base render per Pane the Moment appears in) rather than requiring fully distinct prompts per Pane for base art.

---

## 11. Games + Loops (Future, Series 1.5+)

Not blocking launch, but design for:
- **Battle/Trivia** — Deep+ cards confer multipliers (unchanged).
- **Set-completion missions** — badge + XP for completing a Set of Echo+.
- **Parallel-completion meta** — complete a Parallel run across all Sets of Series 1 = "[Parallel] Master" badge + exclusive drop.
- **Pane-completion missions** — "Lorekeeper" arc: complete all cards in one Pane across all Sets = Pane Lorekeeper badge + banner (§8.3).
- **Residue missions** — "Bind [Figure]": complete a Residue set for a specific archetype-handle = Residue Bound badge + Residue glow cosmetic. These can be surfaced as limited-time challenges to drive Thread Pack sales.
- **Daily moment reveal** — a new Surface card drops daily for free; creates daily hook. (Unchanged.)

---

## 12. Immediate Plan (Next Steps)

Validate the Pane model with one prototype Set before full Series 1 scope.

### Prototype Set: "The Long Night" S1-01 — two Panes only

- **Scope**: 20 Moments total — 10 from Wild-Hunt-Eternal, 10 from Sinterklaas-Reigns (12C/5E1/1E2/2D1 split across both Panes)
- **Art**: generate base-art `painterly-epic` renders for all 20 Moments, then apply Wild-Hunt (storm-grey) and Sinterklaas (crimson-gold) color registers. Generate ARCANA parallels for Echo+ only (8 Moments × 2 Pane registers = 16 ARCANA images). Total: ~36 images = ~$6.
- **Archetype-handle seeding**: assign archetype-handles to Moments where the same figure appears in both Panes (Odin/Sinterklaas is the obvious primary test case). This validates the Residue data model before full catalog.
- **Pack mechanics test**: ship a Standard Pack simulator showing multi-Pane composition (2-Pane packs from the prototype Set). No live purchasing required.
- **Residue UI test**: ship a static card detail page showing Residue Kindled state for a collector who "owns" both Odin-handle cards (mock data).

### What this tests
- Do two Pane art registers feel visually distinct but coherently part of the same product?
- Does the Standard Pack's multi-Pane composition feel surprising/interesting rather than confusing?
- Does the Residue reveal ("this figure appears in another Pane") produce the "wait, really?" response?
- Is the Pane Pack purchase flow legible (do collectors understand what they're buying)?

### Decision point after
If yes on all four → expand to full Series 1 (4 Sets × 5 Panes as applicable). If no on art registers → iterate Pane color palettes. If no on Residue → reassess archetype-handle clarity in the UI copy.

---

## 13. Open Questions for CEO

1. **Pane count at launch**: 5 Panes specified above — is this the right launch set, or should Series 1 start with 3 Panes and add 2 more mid-Series to create drop events?
2. **Thread Pack curation cadence**: Thread Packs require design-team curation (archetype-handle must have ≥3 Pane appearances). In Series 1 with 4 Sets, the number of qualifying handles may be small. Recommend: launch 2–3 Thread Packs at Series 1 start (Odin Thread, Ferryman Thread, Trickster Thread) and add more as Sets expand.
3. **Residue glow cosmetic scope**: the Residue Complete glow is applied to all matching cards in the collector's display. Is this applied retroactively to already-minted cards, or only to cards acquired after the Residue Complete achievement? Recommend: retroactive — it is a display-layer change, not a new mint, so retroactive application costs nothing and rewards collectors who've been building toward it.
4. **Archetype-handle public registry**: should collectors be able to see the full list of archetype-handles and which Panes each appears in (a "Residue Atlas"), or should discovery remain organic through pack-opens and card detail pages? Recommend: organic discovery with a post-completion Atlas unlock — the Atlas is revealed to the collector once they achieve at least one Residue Bound.
5. **Series 2 Pane expansion**: do we add new Panes in Series 2 (Aztec Calendar-Keepers? Slavic Nawia cosmology?), or deepen the 5 existing Panes with new Sets? Both can coexist — new Panes in Series 2 can immediately create new Residue connections with existing archetype-handles.
6. **1/1 distribution**: auction? bid-timed drop? bundled with Apex pack reveals as a small chance? (Carried over from v1 — still open.)

---

## Summary

**The design in one paragraph:** LoreVault ships 5 permanent Panes — cosmological worldviews, each with its own pantheon and visual register. Figures that exist across multiple Panes (Odin as hunt-master, Odin as gift-bringer) carry an archetype-handle that links them through the Lampblack Residue system. Every Standard Pack contains cards from 2–3 Panes (never mono-Pane), so every collector immediately encounters cross-cosmology coexistence. Collectors who want focused Pane completion buy Pane Packs; collectors chasing a specific figure's cross-Pane appearances buy Thread Packs. The Lampblack Residue mechanic rewards collecting 3+ variants of the same figure across different Panes with display achievements and a cosmetic glow. Tier structure (Surface / Echo / Deep with the 1:2:4 Iceberg Doctrine), Parallels (ARCANA / AETHER / WITNESS / NEON / 1/1), and pack pricing ($0 / $9 / $14 / $29 / $49 / $199 / $999) carry through unchanged in structure, with Pane multiplying the art catalog and the collecting surface area.

**The Pane insight:** the cross-Pane figure recurrence (Lampblack Residue) is not a continuity error or a lore inconsistency — it is the product's mythology thesis: the same archetypes travel across cosmologies, leaving traces of each other behind. Collectors who discover this are not confused; they are initiated.
