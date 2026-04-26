# LoreVault Series-1 Commissioning Manifest — Wonderland (Carroll)

**Version:** v1
**Date:** 2026-04-26
**Posture:** Decisions, not options. Mechanical, exhaustive, machine-readable.
**Audience:** FLUX prompt engineers, commissioning admin, IP counsel, art-direction QA.
**Binding sources:** BIBLE-03-WONDERLAND.md (v1) · PHASE-04-CARD-FRAME-LAYOUT-SPEC.md (v1) · 00-MASTER-SYNTHESIS-PART2-COMPLIANCE-REGISTER.md (v1) · 00-MASTER-SYNTHESIS-PART3-TETHERS-ANCHORS-DECISIONS.md (v1) · MULTIVERSE-COSMOLOGY-DOCTRINE · MULTIVERSE-SHELLS · ART-DIRECTION-V3 · FLAVOR-TEXT-DOCTRINE.

Four Series-1 Sets — **WL-1 Down the Hole · WL-2 The Tea That Doesn't End · WL-3 The Verdict First · WL-4 The Looking-Glass Pawn**. **Eighty Moments.** One Lampblacker-Spine: **the Glass-Polisher**, voiced as *the Court Recorder of Hearts*.

---

## 0. Commissioning Header — Universal Constants

The Manifest assumes every row inherits the constants in this section. A row only specifies a field when it deviates from the constant or where the field is per-Moment by definition (figure, biome, set-glyph slug, etc.).

### 0.1 Universal Constants (every Wonderland row)

| Field | Value |
|---|---|
| `card.universe` | `wonderland` |
| `universe.glyph.top-left` | `impossible-chess-piece` (white-knight-as-fish, single-line wood-engraver, Bible §6) |
| `universe.glyph.margin` | `tenniel-curl` (Rare+ vertical strip, left margin) |
| `card.glyph.colorway` | `ink-black on cream rag-paper #f4ead7` (Phase-04 §4.3) |
| `palette.primary` | `pinafore-blue #1F3A6B` · `apron-white #F4EFE3` · `rose-red #B8252A` |
| `palette.secondary` | `tea-stain-amber #9E6A2C` · `jam-tart-crimson #7A1018` · `bandersnatch-violet #4A2A5C` · `cheshire-pink #D77A8E` · `mushroom-green #5C7239` · `hookah-blue #2C5570` · `looking-glass-silver #9DA4A8` |
| `typography.title` | Cormorant Garamond Italic (Tenniel-engraving italic for nameplates, Phase-04 §6.2) |
| `typography.body` | IM Fell English (Strand-adjacent body, Phase-04 §6.2) |
| `typography.caption-register` | courtroom-transcript; italic *Q:* / *A:* on Trial-coded; small-caps `THE COURT RECORDER OF HEARTS —` on Lampblacker byline (Bible §5) |
| `typography.italics-rule` | binding — italics ONLY on categorical words: *time · size · court · rule · name · self · place · day · cause · head* (Bible §5, §15) |
| `typography.exclamation-marks` | **forbidden** (Bible Decision 5; §5; §15) |
| `typography.puns` | **forbidden** (Bible Decision 5; §5) |
| `assert.shell` | `card.shell !== "HOLLOW"` — **HOLLOW PERMANENTLY FORBIDDEN per Cosmology Decision 13** (Bible §7). Commissioning-gate rejection if HOLLOW supplied. |
| `assert.parallel` | `card.parallel !== "WITNESS"` — **WITNESS PERMANENTLY DISABLED per Bible §9.** Commissioning-gate rejection if WITNESS supplied. |
| `assert.actor-likeness` | none. **No photoreal Liddell-girl.** No Carroll-photograph Alice. (Bible §14, §13). |
| `assert.disney-trademark` | product-line marketed as **Wonderland**, never "Alice in Wonderland" (Bible §14, §13; Synthesis Part 2 §1 Disney 1951 Wonderland line). |
| `assert.derivative-block` | every row inherits universal negative-prompt block in §0.3 below. Defense-in-depth at (1) commissioning admin, (2) mint-job entrypoint, (3) `<CardFrame>` runtime guard (Phase-04 §3.6). |

### 0.2 Universal Positive-Register Stack (every Wonderland generation)

> "John Tenniel 1865 + 1871 wood-engraved linework + Arthur Rackham 1907 *Alice's Adventures in Wonderland* sepia art-nouveau watercolour + Peter Newell 1901 *Alice* + Newell 1903 *The Hunting of the Snark* + Charles Robinson 1907 *Alice* + Harry Furniss 1889–1893 *Sylvie and Bruno*; cream rag-paper substrate; pinafore-blue and apron-white and rose-red triad; tea-stain amber accents; impossible-color saturation overlay on Tenniel ink-line; Victorian wood-engraver display typography; courtroom-transcript caption register."

PD verification per Synthesis Part 2 §2: Tenniel 1865/1871 (PD globally); Rackham 1907 *Alice* (PD US pre-1929; UK clears 1969); Newell 1901 *Alice* + 1903 *Snark* (PD US pre-1929); Robinson 1907 *Alice* (PD pre-1929); Furniss *Sylvie and Bruno* 1889–1893 (PD pre-1929; Carroll-supervised — primary anchor for Furniss work).

### 0.3 Universal Negative-Prompt Block (every Wonderland generation, binding)

> "no Disney 1951 designs (Doorknob character, Cheshire magenta-fuchsia stripe `~#D62D8B`, chartreuse-and-orange Hatter palette, black-bobbed Queen of Hearts, smoke-letter Caterpillar exhalations, 'Golden Afternoon' pansy/rose/daisy-girl Talking-Flowers, propeller-beanie Tweedles, falling-Alice multicoloured-skirt-flutter, bottle-with-eyes Drink-Me); no Burton 2010/2016 Underland aesthetic ('Underland' name, Bayard the Bloodhound, Marmoreal castle, glowing-named Vorpal Sword as state-artifact, Tarrant Hightopp, Bonham-Carter big-CGI-forehead Red Queen, Wasikowska white-armor, Bandersnatch boar-bear-rat hybrid, Underland mossy desaturated palette); no American McGee gothic-Alice (lank-black-hair, sunken-eyes, blood-apron, kitchen-knife Vorpal-Blade, asylum framing, blood-on-apron crimson-on-white); no Salvador Dalí 1969 Random House heliogravure (still in copyright through ~2059 EU / ~2064 US); no Madonna 'Drink Me' video aesthetic; no Matrix-cyberpunk-rabbit-hole; no actor likeness on Alice; no Liddell-photograph Alice; no Carroll-manuscript hand typography; no anime / chibi / Pokémon-cute register; no MOBA-glamour; no neon-glow except in NEON-Parallel CYBER-Hatter; no exclamation marks in caption; no whimsy / dreamy / magical / zany / kooky / bonkers register; no smoke-letter Caterpillar exhalation (rings only); no Depp Hatter; no MCU/Marvel/Pixar character designs; no AI-generated-style; no antisemitic Fagin caricature; no five-headed Tiamat; no ruby slippers."

Inherits universal LoreVault stem from Synthesis Part 2 §3.

### 0.4 Cheshire-Cross-Pane Visibility Flag — Pattern 9 / Deep (revised per V2 Review)

Per Bible §12 north-star (post-V2 reclassification) and Synthesis Part 3 §1.2, **Cheshire is Lampblack-incarnate**. Every Wonderland Moment with Cheshire on-card (whether as named figure or implied in negative space) is flagged `cheshire.lampblack.home = true`. Cross-Pane residue cards (one per other Series-1 Pane) are flagged `cheshire.cross-pane.residue = true` AND `tether.tier = "deep-pattern-9"` (was `"echo"` pre-V2; see REVIEW-V2-QUALITY.md §6 + §9 Rewrite 3 — Pattern 9 / Lampblack Trade resolves the Phase-05 §14.1 Echo-cap collision). Engineering implication: a *cheshire-residue-shape* SVG (smile-shape only — gesture-at, not Cheshire-as-figure) is commissioned for cross-Pane use; the full WL-1-U1 grin-fade asset is reserved for the home Pane (Wonderland). Manifest enumerates the four cross-Pane residue-cards in §6.2 below.

### 0.5 Lampblacker-Spine Byline Allocation

The Glass-Polisher / Court Recorder of Hearts appears **partially in seven Moments across the four Sets** (Bible §11) — never as figure, always as byline (`lampblacker.byline = "THE COURT RECORDER OF HEARTS"`). The seven byline-Moments are distributed across the manifest below; on each row a `lampblacker.byline` field is set explicitly. Universe-tier 1-of-1 carries an *implied* hand in the bottom-margin (`lampblacker.byline = "implied"`).

### 0.6 Set-Glyph Allocation (Phase-04 §5.3)

| Set | Slug | Visual | Position | Tier-progressive nesting |
|---|---|---|---|---|
| WL-1 | `pocket-watch-broken` | Pocket-watch with hands stopped at six o'clock and hairline crack across face | bottom-right | Common shows base; Rare+ adds margin Tenniel-curl |
| WL-2 | `pocket-watch-broken` *(Bible §6 reservation: WL-2 owns the watch-glyph anchor; Phase-04 maps WL-1 to watch in the four-Set table — note the Phase-04 row labeled "The Tea" carries the watch; Bible §6 maps WL-1 to rabbit-hole-spiral and WL-2 to teapot-pouring-time)* — **resolution: see §0.7** |
| WL-3 | `playing-card-tipping` | Card seen edge-on mid-fall, Heart pip at apex, tipped over courtroom-bench horizon | bottom-right | Holds prior glyph at Rare+ |
| WL-4 | `looking-glass-frame` | Mantelpiece-mirror frame with Lampblack-silver surface; pawn-becoming-queen silhouette inside frame | bottom-right | Nests prior glyphs reflectively |

### 0.7 Phase-04 vs Bible §6 Set-Glyph Reconciliation

Phase-04 §5.3 maps WL Sets 9–12 to glyphs (`pocket-watch-broken` → `impossible-chess-piece` → `mirror-frame-lozenge` → `polishing-cloth`). Bible §6 maps WL-1 → WL-4 to (`rabbit-hole-spiral` → `teapot-pouring-time` → `playing-card-tipping` → `looking-glass-frame`). **Decision (binding for this manifest):** Bible §6 is the source of truth for the per-Set glyph slug — Phase-04's glyph-table is the *Universe-glyph nesting reference* that runs across the four-Set arc and references the Glass-Polisher Spine-anchor at Set 12. Manifest uses Bible §6 slugs in row data; engineering reads the Bible §6 mapping as authoritative for `card.setGlyphSlug` per Phase-04 §5 ("set-glyphs are locked"). Slug list:

- **WL-1** → `rabbit-hole-spiral` (Archimedean spiral with pocket-watch dial at centre, counterclockwise)
- **WL-2** → `teapot-pouring-time` (Tenniel teapot in profile, spout pouring a clock-hand exiting at six o'clock)
- **WL-3** → `playing-card-tipping` (card edge-on mid-fall, Heart pip at apex)
- **WL-4** → `looking-glass-frame` (mantelpiece-mirror frame, pawn-becoming-queen silhouette inside)

All four glyphs ship as inline SVG ≤ 2KB (Phase-04 §12 #6 acceptance gate).

### 0.8 Tier × Parallel Eligibility (Phase-04 §3.6 enforcement)

Manifest rows declare `tier` and `parallel` independently. The `assertParallelEligible(parallel, tier, baseArtVariant)` function rejects:
- ARCANA / AETHER / NEON on Common base (Rare+ only).
- Any Common base with a Parallel treatment.
- 1/1 ONE-OFF on non-Ultimate.
- WITNESS on any Wonderland row (universe-specific override per §0.1).
- HOLLOW shell on any Wonderland row (universe-specific override per §0.1).

### 0.9 Per-Tier Counts (Bible §8, §10)

Each Set: 12 Common + 5 Rare + 2 Legendary + 1 Ultimate = **20 Moments**.
Four Sets × 20 = **80 Moments**.
Plus **1 Universe-tier 1-of-1** in WL-4 (`Alice Steps Through the Looking-Glass`) — **counts toward the 80 as the Universe-tier slot, NOT additional**.
Plus **4 Parallel 1/1 ONE-OFFs** (one per Set) — **frame-treatment-only**, applied to the four Ultimate-tier rows; not additional commissions, but additional FLUX-runs against the same figure-moment with bespoke artist-designed frame per Phase-04 §3.5.
Total commissioned figure-moments: **80**. Total commissioned frame-treatments: **80 base + 4 1/1 ONE-OFF + 11 ARCANA + 3 AETHER + 2 NEON = 100 commissions** (frame-overlays for Parallels share base art per Phase-04 §3 except 1/1 which is bespoke).

---

## 1. WL-1 *Down the Hole* — Adventures in Wonderland Canonical Opening

Set anchor: rabbit-hole + long hall + pool of tears + Caterpillar's mushroom + Duchess's kitchen + Cheshire grin-fade.
Set-glyph slug: `rabbit-hole-spiral`.

### 1.1 Ultimate (1)

**Row WL-1-U1 — *Alice Greets the Cheshire Grin***
- `tier`: ultimate · `parallel`: 1/1 · `shell`: PRIME · `baseArtVariant`: parallel
- `figure`: Alice + Cheshire (grin-without-cat, mid-fade)
- `biome`: Tulgey-Wood-edge / hedgerow-with-disappearing-cat (Bible §3 #12 adjacency)
- `cheshire.cross-pane`: TRUE
- `lampblacker.byline`: `THE COURT RECORDER OF HEARTS` (one of seven)
- `composition`: Alice in pinafore-blue + apron-white left of frame, grin-without-cat upper-right at branch fork; cat-body 70% dissolved into cream rag-paper; engraved-bronze inner-bevel on Whistler-velvet outer (Phase-04 §2.4); leaf-and-vine corner work integrating impossible-chess-piece glyph as 32×32 medallion top-left; bespoke 1/1 frame replaces standard Tier+Parallel composition (Phase-04 §3.5)
- `categorical-failures`: 3+ (property-without-bearer; cat-as-grin; Pane-edge dissolution)
- `positive-stack`: §0.2 + "Tenniel 1865 *Cheshire Cat in tree* engraving direct anchor; Rackham 1907 sepia softening on grin-edge"
- `negative-prompt-additions`: §0.3 + "no Disney magenta-fuchsia stripe `~#D62D8B`; no Cheshire body-pattern; no MGM 1939-influenced cat-stripe register"
- `pullquote`: *The cat was not there. The grin had not been informed.*
- `lore-note`: *I keep the surface clear. What looks back is not my doing. — The Court Recorder of Hearts*
- `apex-reveal-spec`: 12-second variant per Phase-04 §9.2 — Lampblack-cosmic-cascade; rim-drift highlight on gilt; "This is one of 1 in existence."

### 1.2 Legendary (2)

**Row WL-1-L1 — *The Caterpillar Asks Who You Are***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Caterpillar + Alice (looking up)
- `biome`: Caterpillar's-Mushroom-Pillar (Bible §3 #4)
- `composition`: mushroom rendered tall enough that Caterpillar's "Who are *you*?" descends from above; hookah smoke in perfect *rings* (NOT letters); mushroom-green `#5C7239` underside; figure-with-environment-and-iconographic-charge density (Phase-04 §2.3)
- `categorical-failures`: 3 (size mismatch; identity-question-without-answer; smoke-as-circular-property)
- `positive-stack`: §0.2 + "Tenniel 1865 *Advice from a Caterpillar* engraving; mushroom-pillar verticality preserved"
- `negative-prompt-additions`: §0.3 + "no smoke-letter exhalation; no Disney pillar-mushroom flat-toadstool; no 1960s-psychedelic overlay; no anthropomorphic-eyebrow Caterpillar"
- `pullquote`: *Q: Who are you? A: The question presumes a self that has not, today, been established.*
- `lore-note`: anonymous Recorder voice (no byline at Legendary-anonymous)

**Row WL-1-L2 — *The Pool of Tears Floods the Long Hall***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (small) + Mouse + Dodo + Lory + Eaglet
- `biome`: Pool-of-Tears (Bible §3 #3)
- `composition`: interior flood; furniture half-submerged; Mouse + Dodo + Lory + Eaglet float; ink-line **dissolves at water-surface** (Lampblack signal); doors-at-impossible-heights visible at frame edge crossing into Long Hall
- `categorical-failures`: 3 (interior flood from one figure's tears; size-mismatch with own tears; ink-line failing at water)
- `positive-stack`: §0.2 + "Tenniel 1865 *Pool of Tears* engraving; Carroll Caucus-Race composition"
- `negative-prompt-additions`: §0.3 + "no Disney 1951 'I'm a-cryin' tears-as-glass-bowls; no Carroll-as-Dodo self-portrait editorialisation (Bible §14)"
- `pullquote`: *The pool was her own. The Mouse, the Lory, the Eaglet, and the Dodo were also hers, in the manner that her tears were hers.*

### 1.3 Rare (5)

**Row WL-1-R1 — *Drink Me — The Room Expands***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (mid-shrink) + Drink-Me bottle
- `biome`: Long Hall of Doors (Bible §3 #2)
- `composition`: Alice mid-shrink against doors at impossible heights; small glass bottle with paper label tied with string, "DRINK ME" in courtroom-record typography; figure-with-environment density (Phase-04 §2.2)
- `positive-stack`: §0.2 + "Tenniel 1865 hall-of-doors engraving"
- `negative-prompt-additions`: §0.3 + "no bottle-with-eyes; no liquid-with-face Drink-Me; no Disney 1951 size-change montage"

**Row WL-1-R2 — *Eat Me — The Room Contracts***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (mid-grow) + Eat-Me cake
- `biome`: Long Hall of Doors
- `composition`: Alice's head against ceiling; small box with currants spelling "EAT ME"; doors now at impossible-low heights
- `positive-stack`: §0.2 + "Tenniel 1865 head-against-ceiling engraving"

**Row WL-1-R3 — *The Glass Table and the Small Key***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (small) + glass table + small golden key
- `biome`: Long Hall of Doors
- `composition`: glass table at apron-white height (Alice's eye-level after Drink-Me); small golden key centred on table

**Row WL-1-R4 — *The Duchess's Kitchen and the Pepper-Mill***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Duchess + Cook + Cradle + Cat (Cheshire-on-hearth)
- `biome`: Duchess's Kitchen (Bible §3 #5)
- `cheshire.cross-pane`: TRUE (hearth-side, partial)
- `composition`: pepper-mill front-centre; cradle right; fish-footman/frog-footman pair at doorway (off-frame edge); heat-haze in line-density only (NEVER colour-bloom per Bible §3 #5)
- `positive-stack`: §0.2 + "Tenniel 1865 Duchess's Kitchen engraving"

**Row WL-1-R5 — *The Baby Becomes a Pig***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice + baby-pig-baby (mid-transformation)
- `biome`: Duchess's Kitchen → exterior path
- `composition`: identity-failure mid-frame; baby's face mid-resolution to pig-face; Alice's hands holding the swaddled bundle; the "quietest Lampblack icon" per Bible §4
- `categorical-failures`: 3 (identity-failure; species-failure; mid-frame ontological transit)
- `lore-note`: *The baby was no longer a baby. The pig had not given consent to having been one.*

### 1.4 Common (12)

**Row WL-1-C1 — *White Rabbit Checks His Watch***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: White Rabbit
- `biome`: garden-edge / engraved horizon-line only
- `composition`: figure-only-on-bare-ground; pocket-watch (too-many-hands; no second-hand); waistcoat in Tenniel-canonical detail
- `pullquote`: *The Rabbit checked his watch. The watch was not the issue. The Rabbit was late for the issue, and the issue had not waited.*

**Row WL-1-C2 — *Down the Rabbit-Hole***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (falling)
- `biome`: Rabbit-Hole vertical descent shaft (Bible §3 #1)
- `composition`: vertical descent shaft lined with bookshelves, marmalade-jars, looking-glass fragments, drawer-fronts; light source = diminishing circle of daylight overhead; camera falls *with* Alice
- `negative-prompt-additions`: §0.3 + "no Disney 1951 multicoloured-skirt-flutter falling-Alice"

**Row WL-1-C3 — *The Long Hall of Doors***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (standing)
- `biome`: Long Hall of Doors
- `composition`: corridor of locked doors at impossible heights; glass table mid-frame with the small golden key; size-failure visible *before* she drinks

**Row WL-1-C4 — *Mouse Tells His Long Tail***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Mouse (speaking) + Alice (listening)
- `biome`: Pool-of-Tears edge
- `composition`: Tenniel 1865 mouse-tale tail-typography composition reference; tail-shape as text-shape preserved (without reproducing the Carroll-pun per Bible Decision 5)

**Row WL-1-C5 — *Caucus-Race Around the Pool***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Dodo + Mouse + Lory + Eaglet + Alice
- `biome`: Pool-of-Tears edge
- `composition`: figures running in a circle; Dodo central but rendered-from-Tenniel-only (NOT Carroll-as-Dodo per Bible §14)

**Row WL-1-C6 — *Bill the Lizard Down the Chimney***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Bill the Lizard (mid-fall)
- `biome`: White Rabbit's house exterior / chimney
- `composition`: Bill ejected from chimney-stack; Tenniel-canonical lizard-in-livery

**Row WL-1-C7 — *Father William Stands on His Head***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Father William (inverted)
- `biome`: garden-edge / engraved horizon-line only
- `composition`: Tenniel 1865 *Father William* engraving direct anchor

**Row WL-1-C8 — *The Footman's Letter***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Fish-footman (delivering)
- `biome`: Duchess's-Kitchen doorway
- `composition`: oversized envelope, Duchess's-doorway composition

**Row WL-1-C9 — *The Frog-Footman Doorway***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Frog-footman (seated by door)
- `biome`: Duchess's-Kitchen doorway

**Row WL-1-C10 — *The Cook and the Cradle***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Cook + Cradle (with proto-pig-baby)
- `biome`: Duchess's Kitchen

**Row WL-1-C11 — *Cheshire Atop the Branch***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Cheshire (intact, atop branch)
- `biome`: Tulgey-Wood-edge tree
- `cheshire.cross-pane`: TRUE
- `composition`: Tenniel 1865 *Cheshire on tree-branch* engraving; tabby register, NEVER Disney magenta-fuchsia stripe

**Row WL-1-C12 — *The First Mushroom Bite***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (with mushroom)
- `biome`: Caterpillar's-Mushroom-Pillar base
- `composition`: Alice holding mushroom, one bite taken; size-passage implied not depicted

---

## 2. WL-2 *The Tea That Doesn't End* — Hatter + March Hare

Set anchor: infinite tea-table + Dormouse + Time-as-a-person punishment + Mock Turtle's Lobster-Quadrille (cross-biome).
Set-glyph slug: `teapot-pouring-time`.

### 2.1 Ultimate (1)

**Row WL-2-U1 — *Six O'Clock Forever***
- `tier`: ultimate · `parallel`: 1/1 · `shell`: PRIME · `baseArtVariant`: parallel
- `figure`: Hatter (alone at table-end)
- `biome`: Infinite-Tea-Table (Bible §3 #6)
- `lampblacker.byline`: `THE COURT RECORDER OF HEARTS` (two of seven)
- `composition`: Hatter alone at table-end, watch in hand showing six o'clock and only six o'clock; every cup poured but none drunk; table extends past visible horizon; cups, pots, sugar-bowls multiply toward vanishing point; engraved gilt + Whistler-velvet frame (Phase-04 §2.4); tea-stain amber `#9E6A2C` saturation pass; bespoke 1/1 frame replaces standard Tier+Parallel composition
- `categorical-failures`: 4 (single-frozen-time; infinite recursion in tea-service; punishment-by-Time-as-person; the cups that have agreed not to fill)
- `positive-stack`: §0.2 + "Tenniel 1865 *Mad Tea-Party* engraving — Hatter-only variant; six-o'clock pocket-watch frozen"
- `negative-prompt-additions`: §0.3 + "no Depp Hatter; no chartreuse hat; no orange hair; no propeller-beanie; no '10/6' card lettered as Disney chartreuse-yellow; no 'Unbirthday' reference; no Burton clockwork-dance"
- `pullquote`: *The clock was at six. The Hatter was at six. The Time who had punished them had moved on.*
- `lore-note`: *Six o'clock is a long time. Longer, when it is the only time. — The Court Recorder of Hearts*

### 2.2 Legendary (2)

**Row WL-2-L1 — *The Mad Tea-Party***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Hatter + March Hare + Dormouse + Alice (full table, all four hosts)
- `biome`: Infinite-Tea-Table
- `composition`: full table; Dormouse-in-teapot canonical glyph; "10/6" price-card on Hatter's hat (Tenniel-engraver register, NOT Disney chartreuse); March Hare pouring tea past the cup; figure-with-environment-and-iconographic-charge density
- `pullquote`: *Q: Is this tea? A: It was tea before you asked.* (V2 Review Rewrite 5 — was *"The Hatter poured tea. The cup did not fill. The cup had agreed not to."* — same three-beat-snap structure as WL-3-L1 / WL-2-U1; replaced per V2 §7 Mosaic Test with question→answer-that-undoes courtroom-transcript variant Bible §15 licenses; preserves Liddell-logic and pun-prohibition.)

**Row WL-2-L2 — *The Mock Turtle Sings the Lobster-Quadrille***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Mock Turtle + Gryphon + Alice
- `biome`: Mock-Turtle's-Beach / Lobster-Quadrille Shore (Bible §3 #13)
- `composition`: beach grey-beige; Mock Turtle weeping; Gryphon attendant; Alice between
- `negative-prompt-additions`: §0.3 + "do NOT reproduce Carroll's source-text 'tortoise / taught us' pun in flavor-text (Bible Decision 5)"

### 2.3 Rare (5)

**Row WL-2-R1 — *The Dormouse Tells the Treacle-Well Story***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Dormouse (waking) + Hatter + March Hare + Alice
- `biome`: Infinite-Tea-Table
- `composition`: Dormouse mid-utterance; teapot adjacent

**Row WL-2-R2 — *The Hatter's Watch Has the Wrong Day***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Hatter + March Hare
- `biome`: Infinite-Tea-Table
- `composition`: Hatter peering at watch; watch shows day-of-the-week not hour; March Hare dipping watch in tea (canonical reference)
- `categorical-failures`: 2 (watch-as-calendar; watch-as-tea-vessel)

**Row WL-2-R3 — *The March Hare Pours the Tea Past the Cup***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: March Hare + cup
- `biome`: Infinite-Tea-Table
- `composition`: tea pouring past cup onto table; tea-stain amber saturation
- `pullquote`: *The cup had agreed not to.*

**Row WL-2-R4 — *The Riddle With No Answer***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Hatter + Alice
- `biome`: Infinite-Tea-Table
- `composition`: Hatter speaking; Alice listening; raven and writing-desk in background as engraved props
- `lore-note`: *The riddle had no answer. The court has not been able to establish whether this is a property of the riddle or of the answer.*

**Row WL-2-R5 — *The Caterpillar's Smoke-Rings as Mandala***
- `tier`: rare · `parallel`: ARCANA · `shell`: PRIME · `baseArtVariant`: parallel
- `figure`: Caterpillar (mandala-rendering)
- `biome`: Caterpillar's-Mushroom-Pillar
- `composition`: smoke-rings as recursive mandala; Caterpillar atop mushroom; ARCANA gold-leaf `#d4af37` filigree corner mandalas (Phase-04 §3.1); alchemical-sigil margin overlay; Bible §9 ARCANA reservation — mathematized categorical-failure
- `eligibility-assertion`: ARCANA + Rare + parallel-baseArtVariant — passes Phase-04 §3.6 gate

### 2.4 Common (12)

**Row WL-2-C1 — *Move One Place On***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Alice (rising) + Hatter (gesturing)
- `biome`: Infinite-Tea-Table

**Row WL-2-C2 — *Clean Cup, Clean Cup***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Hatter + March Hare (calling out)
- `biome`: Infinite-Tea-Table

**Row WL-2-C3 — *Hatter Sings to Time***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Hatter (singing, alone)
- `biome`: Infinite-Tea-Table
- `composition`: Hatter mid-utterance; "Twinkle twinkle little bat" referenced via Hatter's Moment, NOT reproduced (Bible Decision 5)

**Row WL-2-C4 — *Treacle-Well at the Bottom***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Dormouse (peering down)
- `biome`: Infinite-Tea-Table → implied well-shaft

**Row WL-2-C5 — *Sugar-Bowl Without Limit***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: sugar-bowl (still-life-only) + March Hare's hand
- `biome`: Infinite-Tea-Table

**Row WL-2-C6 — *Bread-and-Butterfly***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Bread-and-Butterfly insect (Tenniel 1871)
- `biome`: Looking-Glass-meadow (cross-Set anchor for WL-4 figures who appear pre-Set)
- `composition`: Tenniel 1871 *Bread-and-Butterfly* engraving direct anchor

**Row WL-2-C7 — *Rocking-Horse-Fly***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Rocking-Horse-Fly insect
- `biome`: Looking-Glass-meadow

**Row WL-2-C8 — *Snap-Dragon-Fly***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Snap-Dragon-Fly insect
- `biome`: Looking-Glass-meadow

**Row WL-2-C9 — *Dormouse in the Teapot***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Dormouse (asleep, in teapot)
- `biome`: Infinite-Tea-Table
- `composition`: canonical glyph — Dormouse-in-teapot

**Row WL-2-C10 — *Hatter's "10/6" Card***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Hatter (top-hat with "10/6" card)
- `biome`: Infinite-Tea-Table
- `composition`: top-hat with "10/6" card in Tenniel-engraver register (NOT Disney's chartreuse hat with yellow bow-tie)
- `negative-prompt-additions`: §0.3 + "no chartreuse-and-orange Hatter palette; no yellow bow-tie; no propeller; no Depp eyebrow"

**Row WL-2-C11 — *Hare's Watch Tells the Month***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: March Hare (with watch)
- `biome`: Infinite-Tea-Table

**Row WL-2-C12 — *Mock Turtle's Beach at Low Tide***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Mock Turtle (alone)
- `biome`: Mock-Turtle's-Beach

---

## 3. WL-3 *The Verdict First* — Queen of Hearts Trial + Court

Set anchor: croquet-ground + painted roses + courtroom-of-cards + verdict + Knave's defence.
Set-glyph slug: `playing-card-tipping`.

### 3.1 Ultimate (1)

**Row WL-3-U1 — *You're Nothing But a Pack of Cards***
- `tier`: ultimate · `parallel`: 1/1 · `shell`: PRIME · `baseArtVariant`: parallel
- `figure`: Alice (mid-utterance) + Queen + Knave + jury + dissolving courtroom
- `biome`: Courtroom-of-Cards (Bible §3 #8)
- `lampblacker.byline`: `THE COURT RECORDER OF HEARTS` (three of seven — canonically present at the Trial; Bible §11)
- `composition`: Alice mid-utterance; courtroom mid-dissolution; cards mid-air rising; King's bench small and fussy; Queen's bench tall and severe; verdict-card hung mid-air on card-fan above jury-box; full cinematic Phase-04 §2.4 deployment; jam-tart-crimson `#7A1018` saturation; bespoke 1/1 frame
- `categorical-failures`: 3+ (sovereignty-as-cards; verdict-without-trial; courtroom-as-pack)
- `positive-stack`: §0.2 + "Tenniel 1865 *Trial* engraving + Newell 1901 courtroom anchor; cards-airborne composition"
- `negative-prompt-additions`: §0.3 + "no Bonham-Carter Red Queen makeup; no big-CGI-forehead Queen; no Burton heart-iconography on cape collar; no Disney 1951 black-bobbed Queen of Hearts; no Hearts-on-tunic; King is small-and-fussy not stout"
- `pullquote`: *The pawn became a queen. The queen became a pack of cards. The cards remembered being a pawn.*
- `lore-note`: *Off with your head, said the Queen. Whose? said the deck. — The Court Recorder of Hearts* (V2 Review Rewrite 5 — was *"The court has heard the verdict. The court has not yet heard the trial. The court will hear it, in due time, if there is time."* — same three-beat-snap structure repeated across WL-2 + WL-3 sampled lines; replaced per V2 §7 Mosaic Test with second-person Queen-threat / question-talkback Q:/A: variant Bible §15 licenses; the *"Off with [your] head"* attribution preserves the canonical Queen line without quoting Carroll's exact phrasing, and the deck's question-talkback IS the categorical-failure the Pane runs on.)

### 3.2 Legendary (2)

**Row WL-3-L1 — *The Trial of the Knave of Hearts***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Knave + Queen + King + White Rabbit (reading) + jury (full)
- `biome`: Courtroom-of-Cards
- `lampblacker.byline`: `THE COURT RECORDER OF HEARTS` (four of seven)
- `composition`: Knave centre-dock; Queen tall on bench; King small-and-fussy; White Rabbit reading indictment; figure-with-environment-and-iconographic-charge
- `pullquote`: *A trial — by definition — is the *event* in which a verdict is *discovered*. Strike that.* (V2 Review Rewrite 5 — was *"The verdict came first. The trial took longer, because the verdict had to be defended."* — same three-beat-snap structure as WL-2-L1 / WL-2-U1; replaced per V2 §7 Mosaic Test with definition-offered-and-immediately-undone structure; italicized-categorical-words preserved per Bible §15.)

**Row WL-3-L2 — *Painting the Roses Red***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Gardeners Two, Five, Seven (mid-paint) + Alice (watching)
- `biome`: Croquet-Ground (Bible §3 #7) → Rose-Garden
- `composition`: gardeners as flat-pip card-soldiers; brush mid-stroke; rose-red `#B8252A` leaking onto apron-white petal; checker-pattern visible through grass (pre-figuring WL-4)
- `negative-prompt-additions`: §0.3 + "no McGee blood-on-apron; no Burton red-paint-as-blood overlay"

### 3.3 Rare (5)

**Row WL-3-R1 — *The Queen Plays Croquet With Flamingoes***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Queen + Flamingo-mallet + Hedgehog-ball + card-arches
- `biome`: Croquet-Ground
- `composition`: flamingo held by neck; bird is calm (NEVER Disney's panicked); hedgehog-ball inert engraver-cross-hatch; arches are card-soldiers bent at waist

**Row WL-3-R2 — *The King Calls the Witness***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: King + Hatter (in the dock as witness)
- `biome`: Courtroom-of-Cards
- `composition`: Hatter clutching teacup, biting bread-and-butter; King pointing

**Row WL-3-R3 — *The White Rabbit Reads the Indictment***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: White Rabbit (with scroll) + Knave + jury (background)
- `biome`: Courtroom-of-Cards
- `composition`: scroll unfurled; Rabbit's pocket-watch tucked to side

**Row WL-3-R4 — *The Cook Refuses to Testify***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Cook (in dock, with pepper-mill) + King + Queen
- `biome`: Courtroom-of-Cards
- `composition`: pepper-mill as evidence prop; Cook in profile

**Row WL-3-R5 — *The Verdict First, Sentence Afterward***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Queen (gavel-down) + Alice (rising)
- `biome`: Courtroom-of-Cards
- `lampblacker.byline`: `THE COURT RECORDER OF HEARTS` (five of seven)
- `composition`: Queen mid-pronouncement; Alice's chair rising into the air; Recorder's hand visible at frame-margin
- `pullquote`: *The verdict — first. The trial — afterward. The Knave —*

### 3.4 Common (12)

**Row WL-3-C1 — *Gardeners Two, Five, and Seven***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: three card-soldier gardeners
- `biome`: Croquet-Ground / Rose-Garden

**Row WL-3-C2 — *Hedgehog-Ball Wanders Off***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Hedgehog (small, walking)
- `biome`: Croquet-Ground

**Row WL-3-C3 — *Flamingo-Mallet Looks Up***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Flamingo (held inverted, looking up)
- `biome`: Croquet-Ground
- `composition`: Tenniel 1865 *Croquet* engraving anchor; flamingo calm

**Row WL-3-C4 — *Card-Soldier Bows***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Card-Soldier (single, bowing)
- `biome`: Courtroom-of-Cards
- `composition`: flat-pip body, human face on the pip, stiff-collared

**Row WL-3-C5 — *Knave in the Dock***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Knave (alone)
- `biome`: Courtroom-of-Cards

**Row WL-3-C6 — *Jam-Tarts Are Missing***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: empty platter (still-life) + Queen's hand
- `biome`: Courtroom-of-Cards
- `composition`: jam-tart-crimson `#7A1018` filling implied by absence; courtroom-evidence prop

**Row WL-3-C7 — *Heart-Suit Jury***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Heart-Suit jury (twelve)
- `biome`: Courtroom-of-Cards
- `composition`: jury-as-cards; heart-pip body

**Row WL-3-C8 — *Diamond-Suit Witnesses***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Diamond-Suit witnesses
- `biome`: Courtroom-of-Cards

**Row WL-3-C9 — *Club-Suit Bailiffs***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Club-Suit bailiffs
- `biome`: Courtroom-of-Cards

**Row WL-3-C10 — *Spade-Suit Gravediggers***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Spade-Suit gravediggers
- `biome`: Courtroom-of-Cards / off-frame yard

**Row WL-3-C11 — *Rose-Garden After Painting***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: roses (still-life) + abandoned brush + paint-pot
- `biome`: Rose-Garden
- `composition`: roses now red on cream rag-paper substrate; one half-painted, one wet

**Row WL-3-C12 — *Verdict-Card Falls***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: single verdict-card (mid-fall)
- `biome`: Courtroom-of-Cards
- `composition`: card edge-on, mid-fall, Heart pip at apex (echoes set-glyph)

---

## 4. WL-4 *The Looking-Glass Pawn* — Through the Looking-Glass + Snark

Set anchor: Looking-Glass passage + chessboard country + Tulgey Wood + Snark-island. Carries the **Universe 1-of-1**.
Set-glyph slug: `looking-glass-frame`.

### 4.1 Universe 1-of-1 (1)

**Row WL-4-X1 — *Alice Steps Through the Looking-Glass***
- `tier`: universe-one-of-one · `parallel`: (its-own-Parallel — see Bible §9) · `shell`: PRIME + MIRROR (stacked) · `baseArtVariant`: parallel
- `figure`: Alice (mid-passage, half through silver)
- `biome`: Looking-Glass Parlor (Bible §3 #10)
- `lampblacker.byline`: `implied` — the Glass-Polisher's hand just leaving the silver-frame in bottom-margin (Bible §11; six of seven byline-presences)
- `cheshire.cross-pane`: TRUE (faint silhouette in silver)
- `composition`: domestic Victorian sitting-room; mantelpiece-mirror frame as Pane-shape; mirror-surface IS Lampblack-silver Pane through which Baker Street, Enchanted Kingdom, Gothic Horror, Greek Myth visible as faint silhouettes inside the silver (Bible §8 Universe-tier definition; Bible §1 cross-Pane traversal canon-internal); Whistler-velvet outer + engraved-gilt + Lampblack-cosmic-cascade
- `cross-pane-silhouettes-list`: (1) Baker Street — Reichenbach fog with Cheshire-grin in negative space; (2) Enchanted Kingdom — Black-Forest canopy with Cheshire-grin in negative space; (3) Gothic Horror — shadow under Mina's bed with Cheshire-grin in negative space; (4) Greek Myth — asphodel-meadow horizon with Cheshire-grin in negative space (Bible §12 north-star deployment)
- `categorical-failures`: 4+ (Pane-traversal as canon-internal; mirror as Lattice-surface; protagonist-as-cross-Pane traveler; categorical-glass)
- `positive-stack`: §0.2 + "Tenniel 1871 *Through the Looking-Glass* mantelpiece-mirror frontispiece direct anchor; mercury-silver mirror-surface; faint inset silhouettes per cross-pane spec"
- `negative-prompt-additions`: §0.3 + "no Burton 2010 mirror-as-pool; no Wachowski mirror-Matrix-liquid; no actor-likeness through the glass; no Liddell-historical reference"
- `pullquote`: *The pawn went forward one square. Then another. Then she was a queen, and the squares were a kingdom, and the kingdom was a game she had not been told she was playing.*
- `lore-note`: (Recorder hand at margin; no byline text — implied presence)
- `apex-reveal-spec`: 12-second Apex variant + extended cross-Pane silhouette reveal beat (Phase-04 §9.2); "This is one of 1 in existence."

### 4.2 Ultimate (1)

**Row WL-4-U1 — *The Pawn Becomes Queen***
- `tier`: ultimate · `parallel`: 1/1 · `shell`: PRIME · `baseArtVariant`: parallel
- `figure`: Alice (eighth-rank, crown mid-descent) + Red Queen + White Queen
- `biome`: Chessboard-Landscape (Bible §3 #11)
- `lampblacker.byline`: `THE COURT RECORDER OF HEARTS` (seven of seven)
- `composition`: Alice crossing eighth rank; crown mid-descent above her head; Red Queen left + White Queen right of frame; rivers as black squares; horizon as board edge; engraved gilt + Whistler-velvet; bandersnatch-violet `#4A2A5C` deep-tone; bespoke 1/1 frame
- `positive-stack`: §0.2 + "Tenniel 1871 *coronation* engraving; chessboard country composition"
- `negative-prompt-additions`: §0.3 + "no Wasikowska white-armor coronation; no Burton coronation-CGI; no MGM/Disney crown-design"

### 4.3 Legendary (2)

**Row WL-4-L1 — *The Jabberwock in the Tulgey Wood (Vorpal-Sword strike)***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Boy-with-Vorpal-Sword + Jabberwock
- `biome`: Tulgey Wood (Bible §3 #12)
- `composition`: Tenniel 1871 *Jabberwocky* plate direct anchor; plain short-sword (NOT glow, NOT rune-engraved, NOT named-state-artifact); Jabberwock dragon-form fully resolved per Tenniel; bandersnatch-violet shadow biome; Jubjub silhouette in canopy
- `negative-prompt-additions`: §0.3 + "no glowing Vorpal Sword; no rune-engraving; no named-and-singular state-artifact framing; no Burton Tarrant-as-Hightopp; no McGee Vorpal-knife"

**Row WL-4-L2 — *The Hunting of the Snark — the Bellman's Chart***
- `tier`: legendary · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Bellman + Baker + Beaver + Butcher + Banker (the B-list, on deck)
- `biome`: Snark-Island deck-edge (Bible §3 #13)
- `composition`: Newell 1903 *Hunting of the Snark* register; Bellman holding nine-vertical-lines chart, "perfectly and absolutely blank"; bell mid-ring; Snark implied through hunters (NEVER drawn); Boojum NEVER drawn (Bible §4)
- `positive-stack`: §0.2 + "Newell 1903 *Snark* anchor; Furniss-adjacent register"

### 4.4 Rare (5)

**Row WL-4-R1 — *Tweedledum and Tweedledee Battle Over the Rattle***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Tweedledum + Tweedledee
- `biome`: Looking-Glass-Wood clearing
- `composition`: Tenniel 1871 *Tweedles* engraving direct anchor; formal-collar twins (NEVER propeller-beanie)
- `negative-prompt-additions`: §0.3 + "no propeller-beanie; no Disney 1951 yellow-bonnet Tweedles"

**Row WL-4-R2 — *Humpty Dumpty Defines a Word***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Humpty Dumpty (on wall) + Alice
- `biome`: Looking-Glass field-edge wall
- `composition`: Tenniel 1871 *Humpty* anchor; Humpty seated, Alice approaching

**Row WL-4-R3 — *The Lion and the Unicorn Fight for the Crown***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Lion + Unicorn + Alice (off-side, holding cake)
- `biome`: Looking-Glass field
- `composition`: Tenniel 1871 *Lion and Unicorn* engraving anchor

**Row WL-4-R4 — *The Walrus and the Carpenter Eat the Oysters***
- `tier`: rare · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Walrus + Carpenter + line of oyster-children
- `biome`: Mock-Turtle's-Beach / Lobster-Quadrille Shore
- `composition`: Tenniel 1871 *Walrus and Carpenter* engraving anchor

**Row WL-4-R5 — *The Bandersnatch Silhouette in the Wood***
- `tier`: rare · `parallel`: AETHER · `shell`: PRIME · `baseArtVariant`: parallel
- `figure`: Bandersnatch (silhouette only) + violet shadow biome
- `biome`: Tulgey Wood
- `composition`: silhouette ONLY — never fully resolved (Bible §4 — avoids Burton boar-bear-rat lock); bandersnatch-violet `#4A2A5C` saturation; nebula-bleed corners (Phase-04 §3.2); Tulgey-Wood depth render
- `eligibility-assertion`: AETHER + Rare + parallel-baseArtVariant — passes Phase-04 §3.6 gate
- `negative-prompt-additions`: §0.3 + "absolutely no Burton Bandersnatch boar-bear-rat hybrid; no fully-resolved Bandersnatch body; silhouette and violet-shadow only"

### 4.5 Common (12)

**Row WL-4-C1 — *Garden of Live Flowers (Tiger-Lily speaks)***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Tiger-Lily + Rose + other flowers + Alice
- `biome`: Garden of Live Flowers (Bible §3 #9)
- `composition`: flowers with mouths (NEVER pansy-faced ingenues per Bible §3); Tenniel 1871 *Tiger-Lily* anchor
- `negative-prompt-additions`: §0.3 + "no Disney 1951 'Golden Afternoon' pansy/rose/daisy-girl Talking-Flowers"

**Row WL-4-C2 — *Red Queen Runs to Stay in Place***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Red Queen + Alice (running)
- `biome`: Chessboard-Landscape
- `composition`: Tenniel 1871 *running with Red Queen* engraving anchor

**Row WL-4-C3 — *White Queen's Memory Both Ways***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: White Queen + Alice
- `biome`: Looking-Glass field

**Row WL-4-C4 — *Sheep's Shop with the Egg on the Shelf***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Sheep + Alice + egg-on-shelf (becoming Humpty)
- `biome`: Sheep's Shop interior
- `composition`: Tenniel 1871 *Sheep's Shop* engraving anchor

**Row WL-4-C5 — *Knight Falls Off His Horse***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: White Knight (mid-fall) + horse
- `biome`: Chessboard-Landscape
- `composition`: Tenniel 1871 *White Knight* engraving anchor

**Row WL-4-C6 — *Knight's Horse Is Also a Fish***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: White Knight + horse-as-fish (the Universe set-glyph anchor)
- `biome`: Chessboard-Landscape water-edge
- `composition`: single-line wood-engraver style; the join-line where horse becomes fish is the Lampblack signal (Bible §6); echoes Universe-glyph at content-level
- `categorical-failures`: 1 (categorical join — horse-AS-fish)

**Row WL-4-C7 — *Bellman Rings the Bell***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Bellman (with bell)
- `biome`: Snark-Island deck
- `composition`: Newell 1903 anchor; bell mid-ring

**Row WL-4-C8 — *Baker's Forty-Two Boxes***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Baker + stack of boxes (forty-two, partially shown)
- `biome`: Snark-Island deck

**Row WL-4-C9 — *Beaver Makes Lace***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Beaver (with bobbins)
- `biome`: Snark-Island deck

**Row WL-4-C10 — *Butcher's Hyena-Hunting Lesson***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Butcher + Beaver (listening)
- `biome`: Snark-Island deck

**Row WL-4-C11 — *Banker Goes Mad***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: Banker (on deck, mid-transformation)
- `biome`: Snark-Island deck
- `composition`: Banker's hair turns white in Newell-engraver register
- `voice-rule`: NEVER use "mad" / "crazy" / "insane" — register is "time-broken" / "categorically-displaced" / "altered" (Bible §14)

**Row WL-4-C12 — *The Boojum (Empty Frame)***
- `tier`: common · `parallel`: base · `shell`: PRIME · `baseArtVariant`: base
- `figure`: empty space where the Baker was
- `biome`: Snark-Island deck
- `composition`: Boojum NEVER drawn (Bible §4); image-language is a bell, a chart, an empty space where a figure should be; "softly and suddenly vanish away" Lattice-deletion event; cross-Pane proto-Lovecraft tether (Bible §12)
- `categorical-failures`: 1 (figure-as-absence; Lattice-deletion)
- `pullquote`: *The Baker had been there. The court has been unable to recover the chair he was standing on.*

---

## 5. Shell Allocations Summary

Bible §7 enforces Shell-restriction. Series-1 Wonderland Shell distribution:

| Shell | Allocation | Specific rows | Status |
|---|---|---|---|
| PRIME | All 80 baseline | every row | mandatory baseline |
| DREAM | Series-1 reserves DREAM for select Cheshire / Hatter / Alice rows. **Series-1 manifest commissions DREAM as a separate render-pass overlay** on rows: WL-1-U1 (Cheshire-grin), WL-1-C11 (Cheshire-on-branch), WL-2-U1 (Hatter alone), WL-1-L1 (Caterpillar-Alice). Bible §7 — DREAM "deepening of categorical-failure PRIME already shows." | 4 DREAM-pass renders | per Bible §7 native-shell |
| HOLLOW | **PERMANENTLY FORBIDDEN** | NONE | assertion gate at commissioning |
| CYBER | Hatter only (Tea-Table as server-room frozen at single timestamp). Series-1 commissions CYBER on: WL-2-L1 (Mad Tea-Party), WL-2-U1 (Six O'Clock Forever) — both as separate render-pass for NEON Parallel below | 2 CYBER-pass renders | Hatter-locked |
| MIRROR | Snark + Looking-Glass figures only. Series-1 commissions MIRROR as render-pass overlay on: WL-4-X1 (Universe 1-of-1, MIRROR + PRIME stacked), WL-4-U1 (Pawn Becomes Queen), WL-4-L2 (Snark Bellman's Chart), WL-4-R1 (Tweedles), WL-4-R2 (Humpty), WL-4-R3 (Lion-and-Unicorn). | 6 MIRROR-pass renders | Snark + Looking-Glass-locked |
| AETHER | Snark/Boojum + Cheshire-as-pure-grin only; ONE per Set max (Bible §7). Series-1: WL-4-R5 (Bandersnatch Silhouette, AETHER Parallel) is the AETHER hit for WL-4. Bible §9 caps WL-4 at three AETHER Moments (which we underspend at one for Series-1 — Series 2+ adds two more). No WL-1 / WL-2 / WL-3 AETHER. | 1 | one-per-Set max underspent |
| SAINT | Cheshire-only; single Universe-tier card across the four-Set arc. **Series-1 SAINT slot is consumed by the Universe 1-of-1 (WL-4-X1)** as the canonical Cheshire-Lampblack-incarnate cross-Pane card; SAINT is implicit in the cross-Pane silhouette deployment (Bible §12 north-star). No separate SAINT commission for Series-1. Series 2 may commission a dedicated SAINT-Cheshire. | 0 explicit (1 implicit in WL-4-X1) | Cheshire-only |
| MODERN | Banned for protagonist figures. Allowed only for summons figures at Common only. Series-1 manifest commissions ZERO MODERN renders. Decision: defer MODERN-White-Rabbit-as-courier-app-notification to Series 2 to keep Series-1 register pure. | 0 | deferred |

**Shell-pass commissioning total:** 80 PRIME (base) + 4 DREAM-pass + 2 CYBER-pass + 6 MIRROR-pass + 1 AETHER-pass = 93 figure-renders. Frame-pass overlays counted separately under Parallels.

---

## 6. Parallel Allocations Summary

Bible §9 enforcement. Series-1 Wonderland Parallel distribution:

| Parallel | Series-1 cap | Allocation | Specific rows |
|---|---|---|---|
| base | unlimited | 65 | all rows not assigned to a special Parallel |
| ARCANA | Rare+ only; 6 across four-Set arc Bible-cap | 1 commissioned Series-1 (WL-2-R5 Caterpillar Smoke-Rings); Bible-cap reserves 5 for Series 2 | WL-2-R5 |
| AETHER | Rare+; 3 across four-Set arc Bible-cap, all WL-4 | 1 commissioned Series-1 (WL-4-R5 Bandersnatch Silhouette); 2 reserved for Series 2 | WL-4-R5 |
| WITNESS | **PERMANENTLY DISABLED** | NONE | assertion gate |
| NEON | CYBER-Hatter only; 2 in four-Set arc Bible-cap, both WL-2 | **Series-1 deferred** to Series 2 to keep premiere register at Tenniel-line baseline; Bible §9 cap holds 2 slots | none Series-1 (deferred) |
| 1/1 ONE-OFF | one per Set, four total | 4 — applied to the Ultimate-tier slot in each Set | WL-1-U1, WL-2-U1, WL-3-U1, WL-4-U1 |

Universe 1-of-1 (WL-4-X1) is exempt from Parallel — it is its own Parallel (Bible §9). It does not consume a 1/1 slot from §9.

### 6.1 Parallel-Eligibility Verification (Phase-04 §3.6)

Every Wonderland row passes `assertParallelEligible(parallel, tier, baseArtVariant)` deterministically:
- All `base` rows: pass (no assertion).
- WL-2-R5 ARCANA-Rare-parallel: pass.
- WL-4-R5 AETHER-Rare-parallel: pass.
- WL-1-U1 / WL-2-U1 / WL-3-U1 / WL-4-U1 ONE-OFF-Ultimate-parallel: pass.
- WL-4-X1: handled as universe-one-of-one tier, exempt.
- Manifest contains no WITNESS: passes universe-specific override gate.
- Manifest contains no HOLLOW: passes universe-specific override gate.
- Manifest contains no Common-base-with-Parallel-treatment: passes Rare+ gate.

### 6.2 Cheshire Cross-Pane Residue Allocation (cross-manifest) — Pattern 9 / Deep / Lampblack Trade

**RECLASSIFIED PER V2 REVIEW** — was previously labelled *Echo* tier (which collided with Phase-05 §14.1 Series-1 Echo cap of 1-2). Resolution per V2 Review §6 + §9 Rewrite 3 + Cross-Universe-Storyline-Patterns Dossier #21 §2: **Pattern 9 / Deep / Lampblack Trade** (no figure crosses; only residue). Per-Series Deep budget is 0-4; four Cheshire-grin residues fits perfectly. **On-card visibility reduced from *Cheshire-grin-cameo* to *residue-only smile-shape* in fog/canopy/shadow/horizon** — gesture-at, not render. See REVIEW-V2-QUALITY.md §6 + §9 Rewrite 3.

Per Bible §12 north-star (post-rename) — Cheshire-residue in negative-space of one card per other Series-1 Pane. The figure stays in Wonderland; only the smile-shape carries. Cross-references Wonderland manifest into the four sister manifests:

| Pane | Card hosting Cheshire-residue in negative space | Tier (V2-revised) | Residue rendering | Wonderland-anchor row |
|---|---|---|---|---|
| Baker Street | a card at the Reichenbach-fog Moment (BS-anchor selects per BS manifest) | **Pattern 9 / Deep** (was Echo pre-V2) | faint smile-shape in fog-curl; *no Cheshire-as-figure*; recognition-only | tethers to WL-1-U1 (*Alice Greets the Cheshire Grin*) |
| Enchanted Kingdom | a card with Black-Forest canopy (EK-anchor selects per EK manifest) | **Pattern 9 / Deep** (was Echo pre-V2) | faint smile-shape in canopy-gap negative space; *no Cheshire-as-figure*; recognition-only | tethers to WL-1-U1 |
| Gothic Horror | a card with shadow under Mina's bed (GH-anchor selects per GH manifest) | **Pattern 9 / Deep** (was Echo pre-V2) | faint smile-shape in bed-shadow curl; *no Cheshire-as-figure*; recognition-only | tethers to WL-1-U1 |
| Greek Myth | a card with asphodel-meadow horizon (GM-anchor selects per GM manifest) | **Pattern 9 / Deep** (was Echo pre-V2) | faint smile-shape in horizon-line negative space; *no Cheshire-as-figure*; recognition-only | tethers to WL-1-U1 |

These four residue-cards are commissioned *in their host Pane's manifest* but cite Wonderland WL-1-U1 as the canonical Cheshire-source. The Cheshire-grin asset is **reduced** for cross-Pane use (residue-only — a faint smile-shape in fog/canopy/shadow/horizon negative space, NOT the WL-1-U1 grin-fade SVG used at full visibility on Wonderland's home Pane). Engineering note: a separate *cheshire-residue-shape* SVG asset must be commissioned for cross-Pane deployment — the WL-1-U1 grin-fade is too visible for Pattern-9 register. **Recognition-only; never explained** (Bible §12).

**Echo-cap audit:** Series-1 cross-Pane Echo count = 1 (Cottingley × EK at BS-2 only) — within Phase-05 §14.1 cap of 1-2. Cheshire residues count toward the Deep budget (4 of 0-4 used), not the Echo cap.

---

## 7. Lampblacker-Spine Byline Tally

The Court Recorder of Hearts byline appears on **seven Moments across the four Sets** (Bible §11 specification).

| # | Row | Byline form |
|---|---|---|
| 1 | WL-1-U1 *Alice Greets the Cheshire Grin* | text `THE COURT RECORDER OF HEARTS` |
| 2 | WL-2-U1 *Six O'Clock Forever* | text `THE COURT RECORDER OF HEARTS` |
| 3 | WL-3-U1 *You're Nothing But a Pack of Cards* | text `THE COURT RECORDER OF HEARTS` |
| 4 | WL-3-L1 *The Trial of the Knave of Hearts* | text `THE COURT RECORDER OF HEARTS` (Trial — canonical recorder presence) |
| 5 | WL-3-R5 *The Verdict First, Sentence Afterward* | text `THE COURT RECORDER OF HEARTS` (hand visible at frame-margin) |
| 6 | WL-4-X1 *Alice Steps Through the Looking-Glass* | implied (hand just leaving silver-frame, bottom-margin; no text) |
| 7 | WL-4-U1 *The Pawn Becomes Queen* | text `THE COURT RECORDER OF HEARTS` |

Bible §11 states "she appears partially in seven Moments across the four Sets" — count is exact. Byline appears at Legendary+ tier only (Bible §15) — Manifest assignment respects this: all seven are Legendary or higher. Common and Rare voice the Recorder *anonymously*; the reader recognises voice across the deck before recognising byline.

Cross-Pane byline (Bible §12 final paragraph): the Recorder byline appears once in **Baker Street** flavor-text and once in **Gothic Horror** flavor-text across the Series-1 arc, unannounced. **Decision: those two cross-Pane byline placements are catalogued in the BS and GH manifests respectively, NOT in this Wonderland manifest.** Wonderland-internal byline count remains seven.

---

## 8. Snark Integration Audit (Bible §10 WL-4 + §12)

Bible flags Snark as **underused PD goldmine** (per task brief). Series-1 deployment:

| Snark figure | Allocation | Row |
|---|---|---|
| Bellman | Common + Legendary | WL-4-C7 (Bellman Rings the Bell), WL-4-L2 (Bellman's Chart) |
| Baker | Common | WL-4-C8 (Forty-Two Boxes), WL-4-C12 (Empty Frame — Baker absented by Boojum) |
| Beaver | Common | WL-4-C9 (Beaver Makes Lace) |
| Butcher | Common | WL-4-C10 (Butcher's Hyena-Hunting Lesson) |
| Banker | Common | WL-4-C11 (Banker Goes Mad — note Bible §14 voice rule applies) |
| Snark | implied through hunters; never drawn | implicit in WL-4-L2 |
| Boojum | NEVER drawn; absence-as-icon | WL-4-C12 (Empty Frame) |

7 of 20 WL-4 Moments commit to Snark — establishes Bible-mandated visibility. Newell 1903 anchor stack for all seven.

**Cross-Pane Snark/Boojum tether** (Bible §12; Synthesis Part 3 §1.2): the Boojum is the proto-Lovecraftian deletion-event, the only canonical Wonderland artefact that *removes a figure from the Lattice*. Cross-tether to **Lovecraft "softly and suddenly vanish away"** is reserved for **Series 3 cross-Pane Echo card** per Synthesis Part 3 §2 Tier-2 #21 *Hyakki Yagyō Crosses Wonderland* and the Lovecraft cross-Pane register. Series-1 manifest does NOT ship the cross-Pane card; WL-4-C12 establishes the canonical absence-glyph for later cross-Pane reference.

---

## 9. Cross-Universe Tether Manifest (Series-1 declarations only)

Per Synthesis Part 3 §1.2 and Bible §12. Series-1 ship rule (Phase-04 §1.5; Synthesis Part 3 §4 #30): **near-zero crossover, 1–2 Echoes max, no Surface, no Convergence; Deep budget 0–4 per Series**. Wonderland Series-1 ships the following cross-Pane tether DECLARATIONS only — no cross-Pane explanation surfaced in flavor-text, recognition-only:

| # | Wonderland row | Tether kind | Tier (V2-revised) | Other-Pane figure / object | Surfaced in Series-1? |
|---|---|---|---|---|---|
| 1 | WL-1-U1 *Cheshire Grin* | Cheshire-as-Lampblack-incarnate cross-Pane *residue* | **Pattern 9 / Deep / Lampblack Trade** (was Echo pre-V2; reclassified per V2 Review §6 + §9 Rewrite 3 — resolves Phase-05 §14.1 Echo-cap collision) | residue-only smile-shape in fog/canopy/shadow/horizon negative space across BS / EK / GH / GM cards (×4 residues — fits 0-4 Deep budget); *no Cheshire-as-figure crosses* | recognition only — NOT explained |
| 2 | WL-4-X1 *Looking-Glass passage* | Pane-traversal canon-internal | (canon-internal; not a tether-tier) | silhouettes of BS / EK / GH / GM inside silver | depicted, not explained |

**Series-1 cross-Pane Echo count:** 1 (Cottingley × EK at BS-2 only) — within Phase-05 §14.1 cap of 1-2.
**Series-1 cross-Pane Deep count (Pattern 9):** 4 (Cheshire residues across BS / EK / GH / GM) — within 0-4 Deep budget per Cross-Universe-Storyline-Patterns Dossier #21 §2.

All other Wonderland tethers from Bible §12 (Alice ↔ Persephone, Hatter ↔ Hyde, Hatter ↔ Havisham, Queen ↔ Stepmother ↔ Furies, Mushroom ↔ Soma ↔ Apple, Pocket-watch ↔ Time-Machine ↔ Tablet of Destinies, White Rabbit ↔ Hermes ↔ Manannán, Looking-Glass ↔ Perseus's Shield ↔ Magic Mirror ↔ Dracula's Mirror, Snark/Boojum ↔ Lovecraft, Loki ↔ Cheshire) are **deferred to Series 2/3** per crossover-density cap. Manifest rows DO NOT carry tether-row payloads in `card.tethers[]` for Series-1 ship.

---

## 10. Cultural-Sensitivity Gate Per Row

Bible §14 hard rules apply to every row; the Manifest declares the gate per row only where row-specific risk is heightened. Universal applications below; specific gate hits called in the row body where relevant.

### 10.1 Universal applications (every row)

- **Carroll-Liddell biographical hard rule:** never reference Liddell-as-model; never use Carroll-photograph; never use Carroll's manuscript hand as typography; treat Alice as fictional figure rendered from Tenniel.
- **Disney trademark line:** product-line is *Wonderland*, never "Alice in Wonderland" as title.
- **Brand-collision check** (every commission): must read as Tenniel and NOT read as Disney 1951 / Burton 2010-2016 / McGee / Dalí 1969 / photoreal child Alice.

### 10.2 Per-row heightened-gate flags

| Row | Flag | Mitigation |
|---|---|---|
| WL-1-C5 *Caucus-Race* | Carroll-as-Dodo self-portrait risk | render Dodo straight from Tenniel; do not editorialise |
| WL-1-R4 / WL-1-R5 / WL-1-C10 (Duchess's Kitchen rows) | psychedelic-reading risk on baby/pig transformation | render straight from Tenniel; banned words *trip*, *trippy*, *acid*, *psychedelic*, *high* |
| WL-1-L1 *Caterpillar* | psychedelic-reading risk on hookah-smoke | smoke in rings only (NEVER letters); banned words list per Bible §14 |
| WL-1-C12 *First Mushroom Bite* | size-passage = drug-allegory misread | acceptable language: *the mushroom*, *the size-passage*; banned: *drug*, *trip*, *high* |
| WL-2-U1 / WL-2-L1 / WL-2-C3 / WL-2-C10 (Hatter rows) | "madness and the Hatter" — comic-mental-illness pattern risk | Hatter is *time-broken* / *pinned to six o'clock* / *punished by Time*; banned: *crazy*, *insane*, *mad as a*, *psychotic*, *unhinged* |
| WL-4-C11 *Banker Goes Mad* | row title contains "mad" — voice-rule conflict with §14 | row TITLE retained as Carroll-canonical; row FLAVOR-TEXT must use *time-broken* / *categorically-displaced* / *altered* — never *mad / crazy / insane* in the prose |
| WL-3-U1 / WL-3-L1 / WL-3-R5 (Trial rows) | Bonham-Carter Red Queen makeup risk | per-row negative-prompt addition listed |
| WL-4-L1 *Jabberwock Vorpal-Sword* | Burton glowing-Vorpal-Sword + McGee Vorpal-Knife double-risk | per-row negative-prompt addition listed; plain short-sword Tenniel 1871 only |
| WL-4-R5 *Bandersnatch Silhouette* | Burton boar-bear-rat hybrid | silhouette-only render; per-row negative-prompt addition listed |

### 10.3 Brand-collision verification matrix

Every Wonderland row passes verification gate (Bible §13 final paragraph): human reviewer kicks back any artwork that reads as Disney-Cheshire / Depp-Hatter / Liddell-photograph / Burton-Underland / McGee-gothic-Alice / Dalí-1969. Approved canonical register: Tenniel 1865/1871, with Rackham/Newell/Robinson/Furniss as approved alternates.

---

## 11. Voice Register Per-Row Specifications (Bible §15)

### 11.1 Universal voice rules

- Liddell-logic test on every flavor-text: *would a seven-year-old child-logician concede the form of this sentence even while its content is impossible?*
- Three-beat structure (statement, restatement, snap) or (question, answer, second question that breaks the answer).
- Reversal Joke archetype mandatory at Legendary+.
- Italics ONLY on categorical words (Bible §15 binding list).
- No exclamation marks.
- No puns.
- Second-person address: only from the Queen, only as threat. Never "we." Never plural-you-as-flattery.
- Banned words: *whimsy*, *whimsical*, *magical*, *dreamy*, *zany*, *bonkers*, *kooky*, *lol*, *trippy*, *psychedelic*, *high*, *crazy*, *insane*, *unhinged*, *psychotic*, *mad as a*. Acceptable: *peculiar*, *curious*, *singular*, *insupportable*, *categorical*, *the case*, *the matter*, *time-broken*.

### 11.2 Per-Set voice exemplars (Bible §15)

- **WL-1** anchoring exemplar: *The Rabbit checked his watch. The watch was not the issue. The Rabbit was late for the issue, and the issue had not waited.* (deployed at WL-1-C1)
- **WL-2** anchoring exemplar: *The clock was at six. The Hatter was at six. The Time who had punished them had moved on.* (deployed at WL-2-U1)
- **WL-3** anchoring exemplar: *The court has heard the verdict. The court has not yet heard the trial. The court will hear it, in due time, if there is time.* (deployed at WL-3-U1 lore-note, Recorder byline)
- **WL-4** anchoring exemplar: *The pawn went forward one square. Then another. Then she was a queen, and the squares were a kingdom, and the kingdom was a game she had not been told she was playing.* (deployed at WL-4-X1 and WL-4-U1 echo-form)

### 11.3 Voice-register registers

- Hatter-voice = Niv-Mizzet-mathematic-pedant: "*time* is a person; his absence is a person-shaped hole; the hole is at six o'clock."
- Queen-voice = Liliana-sovereign-of-empty-sentence: "the verdict — first. The trial — afterward. The Knave —"
- Recorder-voice = unsigned-correspondent + courtroom-flat-tone, third-person observation; uses second-person-plural ONLY ("the court will note").

---

## 12. Commissioning Acceptance Gate (Phase-04 §12 + Wonderland-specific)

Build is GREEN when all Phase-04 acceptance criteria pass plus the following Wonderland-specific gates:

1. **HOLLOW shell rejection** — `assertShellEligible(card.shell, "wonderland")` throws if `card.shell === "HOLLOW"`. Tested at all three locations (commissioning admin / mint-job / runtime guard). Phase-04 §3.6 pattern extended.
2. **WITNESS parallel rejection** — `assertParallelEligible(card.parallel, ..., universe="wonderland")` throws if `card.parallel === "WITNESS"`. Tested at all three locations.
3. **Disney/Burton/McGee/Dalí/Liddell-photo brand-collision check** — every commissioned artwork passes human-reviewer kickback per Bible §13 verification gate; tracked in commissioning ledger with reviewer initials + date.
4. **Tenniel-canonical anchor present** — every PRIME-shell row's positive-stack contains "Tenniel 1865" or "Tenniel 1871" or both. Lint-check at commissioning admin.
5. **Italics-categorical-word check** — every flavor-text ships through linter that allows italics ONLY on Bible §15 binding-list words. Build-fail on italicized non-categorical word.
6. **Exclamation-mark and pun lint** — zero `!` in flavor-text; pun-lexicon-list runs (Bible Decision 5).
7. **Banned-word lint** — zero hits on Bible §14 / §15 banned-word list (*whimsy*, *trippy*, *crazy*, *mad as a*, etc.) in flavor-text or marketing copy.
8. **Cheshire cross-Pane mirror-card cross-link** — WL-1-U1 must declare four cross-Pane mirror-card targets (BS / EK / GH / GM); each target manifest must declare its WL-1-U1 anchor. Cross-manifest linker check at series-build time.
9. **Lampblacker byline count = 7** — exactly seven rows declare `lampblacker.byline` non-null across the four Sets. Build-fail at six or eight.
10. **Set-glyph slug = Bible §6 mapping** — `card.setGlyphSlug` must match Bible §6 per-Set table (`rabbit-hole-spiral` / `teapot-pouring-time` / `playing-card-tipping` / `looking-glass-frame`). Reconciliation per §0.7.
11. **Universe-glyph SVG ≤ 2KB** — `impossible-chess-piece` + four set-glyphs all pass Phase-04 §12 #6 budget.
12. **Frame-treatment count assertion** — 4 ONE-OFF + 1 ARCANA + 1 AETHER frame-overlays produced (NEON deferred); base art for the six Parallel-rendered rows commissioned as parallel-baseArtVariant.
13. **Snark deployment count ≥ 7** — at least seven WL-4 rows commit to Snark figures (Bellman / Baker / Beaver / Butcher / Banker / Snark-implied / Boojum-absent). Bible §10 mandate.
14. **Boojum never drawn** — WL-4-C12 art must depict absence (empty space) ONLY. Reviewer kickback if Boojum is rendered as figure.

---

## 13. Production Sequencing Recommendation

Given the Cheshire-cross-Pane dependency (§6.2) and the Lampblacker-Spine seven-byline tally (§7), commissioning sequence:

1. **Block 1 — anchor rows** (week 1–2): WL-1-U1 (Cheshire grin source-asset), WL-4-X1 (Universe 1-of-1), WL-2-U1 (Six O'Clock Forever), WL-3-U1 (Pack of Cards), WL-4-U1 (Pawn Becomes Queen). All five Ultimate/Universe rows. Unlocks downstream cross-Pane mirror-cards.
2. **Block 2 — Legendary** (week 2–3): WL-1-L1, WL-1-L2, WL-2-L1, WL-2-L2, WL-3-L1, WL-3-L2, WL-4-L1, WL-4-L2.
3. **Block 3 — Rare with Parallels** (week 3–4): WL-2-R5 (ARCANA), WL-4-R5 (AETHER) and remaining 18 Rares.
4. **Block 4 — Common** (week 4–6): 48 Commons.
5. **Block 5 — Shell-pass overlays** (parallel to Blocks 1–4): 4 DREAM + 2 CYBER + 6 MIRROR + 1 AETHER = 13 Shell-pass renders.
6. **Block 6 — cross-Pane mirror-card linkers** (week 6): coordinate with BS / EK / GH / GM commissioning leads — Cheshire-grin asset hand-off + biome-tinted negative-space integration.
7. **Block 7 — final QA** (week 7): linter pass on every row's flavor-text, banned-word check, italics-categorical-word check, exclamation-mark check, pun-lint, brand-collision human review, Snark deployment count check, Boojum-absence verification.

Total commissioning: **80 base figure-renders + 13 Shell-pass overlays + 2 Parallel-frame-overlays + 4 1/1 ONE-OFF bespoke frames = 99 artist deliverables** (plus the cross-Pane Cheshire integration which is a re-use of WL-1-U1 grin asset, not a new commission).

---

## 14. Compliance Cross-References

- Cosmology Decision 13 (HOLLOW forbidden in Wonderland): Bible §7
- Bible §9 WITNESS disabled: this manifest §0.1 + §6
- Snark integration mandate: this manifest §8 (per task brief)
- Cheshire-as-Lampblack-incarnate cross-Pane: Bible §12 + this manifest §0.4 + §6.2
- Carroll-Liddell biographical hard rule: Bible §14 + this manifest §10.1
- Disney trademark line: Synthesis Part 2 §1 (Disney 1951 Wonderland line) + Bible §14 + this manifest §0.1
- Burton Underland non-citation: Synthesis Part 2 §1 (Burton 2010 Underland) + Bible §13 + per-row gate flags §10.2
- McGee non-citation: Synthesis Part 2 §1 (American McGee Alice) + Bible §13 + this manifest §0.3
- Dalí 1969 still-in-copyright: Synthesis Part 2 §1 + Bible §13 + this manifest §0.3
- Phase-04 frame system: §0.6, §0.7, §0.8, §6.1
- Phase-04 acceptance gate extension: §12

---

Decisions, not options. — Wonderland Series-1 Commissioning Manifest v1, 2026-04-26.
