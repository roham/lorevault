# LoreVault Card Frame & Layout Production Spec v1

**Date:** 2026-04-26
**Audience:** Engineering (Next.js 16 + Tailwind v4 + Framer Motion + Lottie); Art Direction; QA.
**Posture:** Decisions, not options. Production-binding for `/v2/card/:cardId` (canonical route per R1).
**Companions:** Synthesis Parts 1–3; Economy V1; EXEMPLAR-CARDS; Cosmology (8 Shells); R1-architecture; Art-Direction V3; Bibles 01–05.
**Mobile-first:** 375 × 812 baseline (iPhone 13/14/15). Desktop is superset, never starting point. The 5 EXEMPLAR-CARDS are CANONICAL — chassis renders all five losslessly, then generalizes.

---

# 1. Card-Detail Page Anatomy (mobile-first 375px)

Element-stack top to bottom of `/v2/card/:cardId`. Every element has a fixed semantic role and a single source-of-truth field. No discretionary alternates.

## 1.1 Top-bar — `<TopBar>` (375 × 56px, sticky)
- Layout (L→R): back-arrow (24×24, 16px L pad) · figure-name (truncate) · universe-glyph (24×24) · tier-chip (auto-width, 12px, 4px R pad).
- Fields: `card.figureName`, `card.universe`, `card.tier`.
- Behavior: back-arrow calls `router.back()`; universe-glyph deep-links to `/v2/vault/shell/:shellSlug` filtered to universe; tier-chip is **inert** (information only).

## 1.2 Hero art-block — `<HeroArt>` (375 × 563px, 2:3 full-bleed)
- No page-level frame-border — the Frame System (§2 + §3) is INSIDE the asset.
- Field: `card.heroArtUrl` (FLUX PNG, 1500×2250 native, Next/Image `priority`).
- Loading state: Lampblack-haze placeholder (8KB blurhash). The haze IS the load state and doubles as pack-open intermediate (§9).

## 1.3 Pullquote — `<Pullquote>` (375 × ~120px)
- 24px H padding; serif italic 22/30; attribution on new line, 14px small-caps non-italic muted ("— Watson, *A Study in Scarlet*").
- Fields: `card.pullquote`, `card.pullquoteAttribution` (optional).
- Voice preserved per-Pane (Watson-as-Doyle, Mina-as-Stoker) per Synthesis Part 3 §5.

## 1.4 Lore-note — `<LoreNote>` (375 × ~80px)
- 24px H padding; per-Universe serif (§6); 4px tier-color left-rule (Common amber → Ultimate Lampblack-cosmic).
- Field: `card.loreNote`.
- Doctrine: Echo-tier reveal — iceberg-pulled, never explanatory. Per EXEMPLAR #1: *"The initial cane Watson carried home was lost in transit from Portsmouth; its finder has never returned it."*

## 1.5 Tether row — `<TetherRow>` (375 × 60px, horizontal scroll)
- Hidden when `card.tethers.length === 0`. Label "CONNECTS TO..." 12px small-caps; mini-cards 48×48 + 1-line truncated name; 8px gaps; 16px L/R pad.
- Field: `card.tethers[] { cardId, figureName, thumbUrl, tetherKind }` where kind ∈ `twin-soul | echo-object | biome | event` (Synthesis Part 3 §1).
- Tap → `/v2/card/:cardId/tethers`.
- **Series-1 ship rule:** crossover density near-zero (1–2 Echoes max, Synthesis Part 3 §4 #30). Most Series-1 cards have empty tethers; row is omitted gracefully.

## 1.6 Metadata-chip-row — `<MetadataChips>` (375 × 56px)
- 5 chips in canonical order: `serial · tier · shell · parallel · set`. 12px font, 8px H pad, 32px tall, 16px radius. Mono face (JetBrains Mono) for `serial` only ("#247 / 15,000"); others in Universe nameplate face. 8px gaps.
- Fields: `card.serial`, `card.tier`, `card.shell` (8 enums per Cosmology), `card.parallel` (base or 5 per Economy), `card.setGlyphSlug`.
- Tap chip → corresponding `/v2/vault/<facet>/<slug>`.

## 1.7 Council toggle — `<CouncilToggle>` (collapsed 375 × 40px / expanded ~280px)
- Collapsed: "Show the 4-Layer Council ▾". Expanded: 4 labeled rows — Silhouette · Props · Gesture · Spine — ~64px each, with shell-color left-rule (PRIME=ink, CYBER=neon-cyan, MODERN=urban-grey, AETHER=nebula-violet, HOLLOW=ash-grey, MIRROR=mercury, DREAM=watercolor-rose, SAINT=gold-leaf).
- Field: `card.council { silhouette, props, gesture, spine }`.
- "View full Council ↗" inside expanded body → `/v2/card/:cardId/lampblack` (R1 route).
- Default: **collapsed**. The figure-moment leads; the Council is iceberg-second-look.

## 1.8 Owner trail — `<OwnerTrail>` (375 × ~80px when minted)
- Omitted entirely when unminted. Label "Held by" 12px small-caps; current avatar 32×32 + display-name 14px; history scroll of 24×24 avatars (most recent two opaque, rest 50%), max 8 + "+N more" chip.
- Fields: `card.owner` (nullable), `card.ownerHistory[]`.
- Display-name only — no wallet addresses on customer surfaces.

## 1.9 Burn / share / list — DEFERRED TO PHASE 6+
- 375 × 60px reserved, hidden behind feature-flag `actionsEnabled=false`. R1 sitemap explicitly has no burn/forge routes; share will use kept-from-v1 `<ShareCard>` wired Phase 6. Banned-chrome (§10) reinforces.

---

# 2. Frame System v1 — the 4 Tier Frames

Tier frame is the BASE layer; reads at-a-glance from 375px scroll preview. Progression is monotonic: Common = plain ledger-paper → Ultimate = engraved gilt + Whistler-velvet. Composes with Parallel (§3) above and reserves coordinates for Universe iconography (§4) and Set glyph (§5).

## 2.1 COMMON — Ledger-Paper
- Border 0px (frameless full-bleed); internal 12px margin reserved for art only.
- Frame color `transparent`; single 1px hairline at bottom in `--color-tier-common` `#9c7b3a` (muted-amber).
- Corner decoration: **none**. Only Universe stamp top-left (16×16, §4) + Set glyph bottom-right (12×12, §5).
- Shadow: `box-shadow: 0 1px 0 0 rgba(0,0,0,0.08)` — flat ledger-paper.
- Tier-typography: chip in Universe nameplate face, weight 500, 11px, no background.
- Material: plain ledger-paper, cream `#f4ead7` if visible.
- Art-density: figure-only-on-bare-ground; one figure, one prop, one light source. Per EXEMPLAR #1: "Single gas-lamp lighting, tobacco-amber and oxblood."

## 2.2 RARE — Linen
- Border 2px solid, inset 8px (visible as hairline double-rule).
- Color `--color-tier-rare` `#b08838` (warm-gold, restrained).
- Corner decoration: **minimal-corner-mark** — 12×12 filigree tick at all four interior corners.
- Shadow: outer glow `0 0 12px rgba(176,136,56,0.22)`.
- Chip: nameplate face, weight 600, 12px, 1px hairline border same color.
- Material: linen weave (2% diagonal-cross noise overlay inside frame).
- Art-density: figure-with-environment. Per EXEMPLAR #2: cryotube + chrome-crown reflection — figure plus single environmental signifier.

## 2.3 LEGENDARY — Silk + Engraved Bronze
- Border 4px solid + 1px inner-bevel (5px effective).
- Color `--color-tier-legendary` `#e8d8a8` outer, `#7a5a2a` engraved-bronze inner-bevel.
- Corner decoration: **mid-flourish** — 24×24 Beardsley-line corner ornaments. Universe stamp (§4) integrates into corner, not overlays.
- Shadow: hard outer glow `0 0 18px rgba(232,216,168,0.40)` + 1px inset top-edge highlight (engraved-bronze rim).
- Chip: nameplate face, weight 700, 13px, 1px solid bronze border + inset shadow (engraved feel).
- Material: silk + engraved bronze (subtle moiré 3% opacity on band; bronze on corners + bevel).
- Art-density: figure-with-environment-and-iconographic-charge. Per EXEMPLAR #4: collapsed clocktower + tally-wall + shadow-mismatch.

## 2.4 ULTIMATE — Engraved Gilt + Whistler-Velvet
- Border 6px solid + 2px inner-bevel + 1px outermost hairline (9px effective).
- Color `--color-tier-ultimate` `#f5e6b8` (gilt) outer, `#3a2818` (Whistler-velvet) inner-bevel, `#0a0a0c` (Lampblack) outermost.
- Corner decoration: **full-ornate-leafing** — ~48×48 Beardsley/Burne-Jones leaf-and-vine corner work. Universe iconography integrated as 32×32 medallion top-left.
- Shadow: Lampblack-cosmic-cascade `0 0 32px rgba(245,230,184,0.55)` + 2-second drift highlight on gilt rim (CSS keyframes, respects `prefers-reduced-motion`). **Always-on glow** signals Apex pull at 1-second glance.
- Chip: full nameplate 56×16, engraved-gilt fill + Whistler-velvet inset, weight 700, 14px small-caps.
- Material: engraved gilt on Whistler-velvet (Whistler *Nocturne* palette: deep-blue-black + gilt).
- Art-density: FULL CINEMATIC. Per EXEMPLAR #5: Persephone-as-icon + vertical seasonal division + six pomegranate seeds + flanking shell-silhouettes + threshold-stone — every iconographic anchor present.

---

# 3. Frame System v2 — the 5 Parallel Treatments

Parallels are ON TOP of the Tier frame. Frame-level only — they do not modify the underlying art crop (baked at FLUX commission). The 5 Parallels per Economy: **ARCANA · AETHER · WITNESS · NEON · 1/1 ONE-OFF**.

## 3.1 ARCANA — Sacred Geometry
- Four corner mandalas (32×32 Rare → 64×64 Ultimate); alchemical-sigil margin overlay (4px L+R repeating-glyph strip, gold-leaf 30% opacity).
- Color: gold-leaf `#d4af37` on sigil strip + mandala against 2% outer-glow halo.
- Eligibility: **Rare+ only**. Per EXEMPLAR #3: "Sacred-geometry mandala halo with alchemical sigils; gold-leaf filigree."

## 3.2 AETHER — Aurora Cosmic
- Aurora-cosmic-particulate frame edge (4s drift, respects `prefers-reduced-motion`); nebula-bleed at four corners (radial violet-to-magenta, 24% opacity).
- Color: nebula-violet `#5a3a8a` → magenta `#c44a8a`.
- Eligibility: **Rare+ only**. Per EXEMPLAR #5: "Aurora-cosmic halo with divine particulate."

## 3.3 WITNESS — Archival Document
- 2px inner-inset edge with paper-aged sepia `#3a3028` 18% opacity + scanned-photo grain 1.5%; period-stamp registration mark bottom-right margin (12×12 circular ink-stamp, e.g. "WHITBY · 1897").
- Color: sepia + ink-black; no glow.
- Eligibility: **Rare+ only**. Per EXEMPLAR #4: "Photoreal dusk, ash-grey palette, documentary atmosphere."

## 3.4 NEON — Synthwave Cyber
- Synthwave-grid bottom-edge (perspective-receding pink/cyan, 16px tall, 2s pan, respects `prefers-reduced-motion`); cyber-tear-corner top-right (jagged glitch-cut suggesting frame rupture).
- Color: magenta `#ff2e88` + cyan `#22d3ee`.
- Eligibility: **Rare+ only**. Per EXEMPLAR #2: "Synthwave magenta-cyan lighting."

## 3.5 1/1 ONE-OFF — The Frame Is the Card
- **Bespoke per commission.** No template. Doctrine: *"this card has no frame; it is the frame."* Art full-bleed; Tier frame underneath replaced by artist-designed custom border.
- Eligibility: **Ultimate-tier only**, mint = 1.
- Engineering: `<CardFrame customFrameUrl=...>` replaces `<TierFrame>` + `<ParallelOverlay>` with a single full-bleed PNG-with-alpha. No procedural treatment applied.

## 3.6 ARCANA / Parallel Reservation Rule — Machine-Enforced

ARCANA, AETHER, WITNESS, NEON all Rare+. Common base art under any Parallel treatment is forbidden. Enforced at commissioning gate:

```ts
// src/lib/parallels/eligibility.ts
type Tier = 'common' | 'rare' | 'legendary' | 'ultimate';
type Parallel = 'base' | 'arcana' | 'aether' | 'witness' | 'neon' | 'one-off';
type BaseArtVariant = 'base' | 'parallel'; // FLUX has commissioned a parallel-specific render

export function assertParallelEligible(
  parallel: Parallel,
  tier: Tier,
  baseArtVariant: BaseArtVariant
): true {
  if (parallel === 'base') return true;

  if (parallel === 'one-off') {
    if (tier !== 'ultimate') {
      throw new Error('1/1 ONE-OFF is Ultimate-tier only.');
    }
    return true;
  }

  // ARCANA / AETHER / WITNESS / NEON
  const rarePlus: Tier[] = ['rare', 'legendary', 'ultimate'];
  if (!rarePlus.includes(tier)) {
    throw new Error(
      `${parallel.toUpperCase()} parallels are Rare+ only. Common-base art with ${parallel} treatment is REJECTED at commissioning gate.`
    );
  }

  if (baseArtVariant !== 'parallel') {
    throw new Error(
      `${parallel.toUpperCase()} requires a parallel-specific FLUX commission. baseArtVariant must be 'parallel'.`
    );
  }

  return true;
}
```

Called from THREE locations (defense-in-depth): (1) commissioning admin form submit (server-side, refuses moment-config row); (2) card-mint job entrypoint (server-side, refuses invalid triple); (3) `<CardFrame>` runtime guard (client-side dev-only, throws in dev / no-op in prod).

Tested via `src/lib/parallels/__tests__/eligibility.test.ts` — every (Tier × Parallel × BaseArtVariant) cross-product asserted. Acceptance gate §12 #2 fails build until passing.

---

# 4. Universe Iconography in Frame

Per ART-DIRECTION-V3: *one precise object becomes character shorthand.* Universe iconography is **secondary** shorthand (figure-moment is primary).

Stamp slot: **top-left corner**, 16×16 (Common) / 24×24 (Rare/Legendary) / 32×32 (Ultimate, integrated into corner leafing).

## 4.1 Baker Street — 221 + V.R.
- Top-left: "221" door-knocker numeral in Paget cross-hatched ink-line.
- Margin: "V.R." monogram (Victoria Regina, the bullet-pocked wall) bottom-left, 12×12 muted.
- Reference: BIBLE-01; PD register Sidney Paget 1891–1915 + Frederic Dorr Steele.
- Color: ink-black on cream `#f4ead7`.

## 4.2 Enchanted Kingdom — Twig + Apple-or-Spindle
- Top-left: 16×16 gnarled-twig knot (Rackham 1909 woodcut register).
- Margin: apple-with-bite OR spindle (figure-config picks ONE — Snow White → apple, Briar Rose → spindle), 12×12 bottom-right.
- Reference: BIBLE-02; PD Rackham 1909 + Nielsen 1914 + Jüttner 1905 + Dulac 1911.
- Color: lampblack ink on cream. Never Disney chromatic.

## 4.3 Wonderland — Impossible-Chess + Tenniel-Curl
- Top-left: 16×16 impossible-perspective chess-square (one square folded back into itself).
- Margin: Tenniel-curl scene-break tendril, 12×60 vertical strip on left margin at Rare+.
- Reference: BIBLE-03; PD Tenniel 1865 + Rackham 1907 + Charles Robinson 1907.
- Color: ink-black wood-engraving. Never Disney magenta-Cheshire-stripe.

## 4.4 Gothic Horror — Demeter Wheel + Mirror-Shard
- Top-left: 16×16 *Demeter* ship's-wheel bound in rope (the wreck that brings Dracula to Whitby).
- Margin: broken-mirror-shard 12×12 bottom-right with single hairline crack (the mirror that fails to reflect).
- Reference: BIBLE-04; PD Theodor von Holst 1831 + Fuseli + Caspar David Friedrich + Harry Clarke 1919.
- Color: ash-grey on lampblack — *Demeter*-wreck palette.

## 4.5 Greek Myth — Olive-Branch + Libation-Bowl
- Top-left: 16×16 olive-branch sprig (three leaves + one olive — Athena gift / Olympian truce).
- Margin: red-figure libation-bowl (shallow phiale viewed from above, three pomegranate seeds when Persephone/Hades-adjacent), 12×12 bottom-right.
- Reference: BIBLE-05; PD Waterhouse + Burne-Jones + Bouguereau + Caravaggio + classical statuary + red-figure vase painting.
- Color: terracotta-on-black (red-figure register) or bronze-on-cream.

Engineering: `<UniverseIcon universe={card.universe} slot="top-left" tier={card.tier} />` resolves to inline SVG ≤ 2KB per stamp (gate §12 #6). 5 SVGs at `src/components/UniverseIcon/glyphs/{universe}.svg`.

---

# 5. Set-Glyph System — 20 Series-1 Set Glyphs

Per Master Synthesis Part 3 §5, set-glyphs are locked. Series 1 = 5 Universes × 4 Sets each = 20 glyphs. Each Set glyph appears at the **bottom-right** corner of the card (12×12 on Common, 16×16 on Rare/Legendary, 24×24 on Ultimate).

Where a Set's glyph appears nested in a later Set's glyph, the engineering is a single SVG that contains both layers with the latter Set's glyph rendered around / circling the former — making the glyph progression itself an iceberg-pull.

## 5.1 Baker Street (4 Sets)

| # | Set | Glyph name | Visual description | Position | Cross-Set relationship |
|---|---|---|---|---|---|
| 1 | The Cases | **Magnifying-Lens-Iris** | Circle-within-circle iris with single hairline crosshair; the lens of deduction. | Bottom-right corner. | Appears nested inside Set 2's glyph as the iris-of-the-eye. |
| 2 | The Adversaries | **Reichenbach-Spire-Eye** | Pyramidal-spire silhouette with the magnifying-iris (Set 1) at its peak. | Bottom-right corner. | Nests Set 1; appears as silhouette-only inside Set 3. |
| 3 | The Method-Lineage | **Dupin-Card** | A folded calling-card with the Reichenbach spire (Set 2) faintly watermarked behind. | Bottom-right corner. | Nests Set 2; ties to American Gothic (cross-Universe Tier-1 Moment "Dupin Sends a Card"). |
| 4 | The Footnote (Spine-anchor) | **Footnote-Mark** | A single asterisk-and-rule marginalia mark; the Lampblacker Spine of BS (per Master Synthesis Part 3 §3). | Bottom-right corner; doubles as a margin-bottom rule on Ultimate. | All three prior Sets' glyphs visible as minute marginalia inside the Footnote-Mark on Legendary+. |

## 5.2 Enchanted Kingdom (4 Sets)

| # | Set | Glyph name | Visual description | Position | Cross-Set relationship |
|---|---|---|---|---|---|
| 5 | The Curses | **Bitten-Apple** | Apple silhouette with a bite-shaped negative-space; bite-edge geometry matches EK-2 card-figure (per EXEMPLAR-CARD #2). | Bottom-right corner. | Appears nested as the offering-in-hand of Set 6. |
| 6 | The Forest | **Gnarled-Twig-Knot** | Single Rackham-twig knot with two leaves; one leaf bears a tiny apple (Set 5) at Rare+. | Bottom-right corner. | Nests Set 5. |
| 7 | The Maps | **Cartographer's-Compass** | Three-petal compass-rose drawn in woodcut line; one petal points to the Twig-Knot (Set 6). | Bottom-right corner. | Nests Set 6 directionally. |
| 8 | The Cartographer (Spine-anchor) | **Hand-Drawn-Map-Margin** | The torn corner of a map showing all three prior Sets' glyphs as map-markers at scale. | Bottom-right; expands to a 32×32 medallion on Ultimate. | All three nested. |

## 5.3 Wonderland (4 Sets)

| # | Set | Glyph name | Visual description | Position | Cross-Set relationship |
|---|---|---|---|---|---|
| 9 | The Tea | **Pocket-Watch-Broken** | Pocket-watch with hands stopped at six-o-clock and a hairline crack across the face. | Bottom-right corner. | Appears as the timepiece-in-hand of Set 10. |
| 10 | The Court | **Impossible-Chess-Piece** | A queen-and-pawn-fused silhouette that reads as both depending on viewer angle. | Bottom-right corner. | Holds Set 9 in left hand at Rare+. |
| 11 | The Looking-Glass | **Mirror-Frame-Lozenge** | Octagonal mirror-frame with the chess-piece (Set 10) ghosted in the reflection; a single Tenniel-curl flares from one corner. | Bottom-right corner. | Nests Set 10 reflectively. |
| 12 | The Glass-Polisher (Spine-anchor) | **Polishing-Cloth** | A folded cloth corner-tucked into the Mirror-Frame (Set 11), with one polishing streak across the glass. | Bottom-right corner. | Nests Set 11. |

## 5.4 Gothic Horror (4 Sets)

| # | Set | Glyph name | Visual description | Position | Cross-Set relationship |
|---|---|---|---|---|---|
| 13 | The Wreck | **Demeter-Wheel-Bound** | Ship's-wheel bound with frayed rope; one spoke is a broken-mirror-shard (echoes Set 14). | Bottom-right corner. | Cross-references Set 14 element. |
| 14 | The Mirror | **Broken-Mirror-Shard** | Triangular mirror-fragment with a single hairline crack; reflects no figure (the mirror that fails to reflect Dracula). | Bottom-right corner. | Embedded as a spoke of Set 13. |
| 15 | The Census | **Tally-Wall-Mark** | Five-tally-bundle on a stone wall; one tally is rendered with a fingernail-not-his-own per EXEMPLAR-CARD #4 lore-note. | Bottom-right corner. | The tally-marks at scale form the rope-pattern of Set 13. |
| 16 | The Ledger-Keeper of Whitby (Spine-anchor) | **Bound-Folio-Ribbon** | A leather-bound folio with a black silk ribbon-marker; the ribbon's tail forms a hairline crack (echoes Set 14). | Bottom-right; expands to a margin-medallion on Ultimate. | All three prior Sets' glyphs visible as folio-tab markers on Legendary+. |

## 5.5 Greek Myth (4 Sets)

| # | Set | Glyph name | Visual description | Position | Cross-Set relationship |
|---|---|---|---|---|---|
| 17 | The Descent | **Pomegranate-Seed-Six** | Six pomegranate seeds in a half-circle; one seed is unspoken (per EXEMPLAR-CARD #5 lore-note "the seventh seed remains unspoken" — note: Persephone holds six, the seventh exists outside the glyph). | Bottom-right corner. | Tethers to Mesopotamian Inanna's-Descent in Series 2+. |
| 18 | The Oracle | **Pythia-Veil-Smoke** | A diaphanous veil with smoke-curl rising; the veil-edge is the pomegranate-seed silhouette (Set 17). | Bottom-right corner. | Nests Set 17. |
| 19 | The Judgment | **Olive-Branch-Scale** | An olive-branch held as a balance-pan; one pan holds a feather (Egyptian Ma'at cross-tether), the other a pomegranate seed. | Bottom-right corner. | Cross-tethers to Egyptian Universe (Series 2+). |
| 20 | The Oracle's Translator (Spine-anchor) | **Carried-Word-Scroll** | A small scroll-fragment with smoke-curl trailing; three glyph-marks (Sets 17–19) visible on the scroll. | Bottom-right; expands to medallion on Ultimate. | All three prior Sets nested as scroll-marks. |

**Engineering:** `<SetGlyph slug={card.setGlyphSlug} tier={card.tier} />` resolves to one inline SVG ≤ 2KB. 20 SVGs total for Series 1, all at `src/components/SetGlyph/glyphs/{slug}.svg`. The nesting relationships are encoded as separate SVG `<g>` groups within each parent glyph and toggled visible at the appropriate Tier (Common shows base only; Rare+ progressively reveals nested predecessors).

---

# 6. Typography Spec

The typographic language is **per-Universe distinguished** but composed from a small shared family for shipping efficiency. All faces selected are free-or-licensable for commercial use; system-font fallback chains specified for graceful degradation.

## 6.1 Shared Faces (across all 5 Universes)

- **Pullquote face (italic serif):** Cormorant Garamond Italic, weights 400/500. Fallback: `Georgia, 'Times New Roman', serif`.
- **Body / lore-note face (default):** Source Serif 4, weights 400/600. Fallback: `Georgia, serif`. Per-Universe override below.
- **Mono / metadata face:** JetBrains Mono, weights 400/500. Fallback: `'SF Mono', Menlo, Consolas, monospace`. Used only for `serial`.
- **Universal sans (UI chrome — top-bar, council-toggle button, share/burn placeholder, navigation):** Inter, weights 500/600. Fallback: `system-ui, -apple-system, sans-serif`.

## 6.2 Per-Universe Distinguishing Rules

| Universe | Title face / Nameplate | Body / lore-note face | Distinguishing rule |
|---|---|---|---|
| Baker Street | **IM Fell English SC** (Watson-casebook 17th-c serif, small-caps for nameplates) | Source Serif 4 | Watson-casebook serif throughout — typewriter-and-foolscap voice. |
| Enchanted Kingdom | **UnifrakturMaguntia** (Fraktur-adjacent for chapter-marks; nameplate uses a softened Fraktur — never blackletter-aggressive) | Crimson Text | Fraktur-adjacent ONLY in nameplate / set-titles; body in Crimson for legibility. The chapter-of-Grimms register. |
| Wonderland | **Cormorant Garamond Italic** (Tenniel-engraving italic for nameplates) | IM Fell English (echoes Tenniel's *Strand*-adjacent typesetting) | Italic-serif throughout; the printed-mid-Victorian voice that Carroll wrote inside. |
| Gothic Horror | **Old Standard TT** (epistolary-fragment serif — the typewriter-and-letter register of Mina's casebook and Stoker's diary-of-many-hands) | Old Standard TT | Single face throughout — the all-epistolary feel; the lore-note feels pulled from a journal. |
| Greek Myth | **Cinzel** (Hesiod-stele inscription-caps; small-caps available for set-marks) | Cormorant Garamond | Inscription-caps in nameplate / Set-marks; body in Cormorant for stele-as-page feel. |

## 6.3 Variable-Font Strategy

Variable fonts where available (Cormorant, Inter, Cinzel, IM Fell). Old Standard TT + UnifrakturMaguntia ship static. All `@font-face` declarations use `font-display: swap` — system-fonts render layout immediately; web-fonts swap in. Gate §12 #5 enforces graceful degradation.

---

# 7. Mobile-First Layout (375 × 812)

The canonical Card-detail page on iPhone 13/14/15. Pixel-grid below; ASCII wireframe shows scroll-position. Total above-meaningful-fold height: 1119px (the page scrolls; the hero + pullquote land in the first viewport, the rest reveals on scroll).

```
┌─────────────────────────────────────┐  y=0
│ ←  Watson         [BS][Common]      │  TopBar 56px
├─────────────────────────────────────┤  y=56
│                                     │
│                                     │
│                                     │
│                                     │
│         [HeroArt 375×563]           │  HeroArt 563px
│   2:3 portrait, full-bleed,         │
│   tier-frame baked into asset       │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤  y=619
│  "You have been in Afghanistan,     │
│   I perceive."                      │  Pullquote ~120px
│  — Watson, A Study in Scarlet       │
├─────────────────────────────────────┤  y=739
│ │ The initial cane Watson carried   │
│ │ home was lost in transit from     │  LoreNote ~80px
│ │ Portsmouth; its finder has        │
│ │ never returned it.                │
├─────────────────────────────────────┤  y=819
│ CONNECTS TO...                      │  TetherRow 60px
│ [▮][▮][▮][▮][▮]→ scroll            │  (when applicable)
├─────────────────────────────────────┤  y=879
│ [#247/15K][Common][PRIME][base][▮] │  MetadataChips 56px
├─────────────────────────────────────┤  y=935
│ Show the 4-Layer Council ▾          │  CouncilToggle 40px collapsed
├─────────────────────────────────────┤  y=975
│ Held by @sherlockian.eth            │  OwnerTrail 80px (when minted)
│ [○][○][○][○] +12                    │
├─────────────────────────────────────┤  y=1055
│ [Burn] [Share] [List]   (DEFERRED)  │  Actions placeholder 60px
└─────────────────────────────────────┘  y=1115
                                          (+4px bottom margin)
```

Empty `tethers` omits `<TetherRow>` (shift up 60px); unminted omits `<OwnerTrail>` (shift up 80px). `<main>` is `min-height: 100vh; height: auto`.

Above-the-fold at y=0 (812 viewport): TopBar (56) + most of HeroArt (563 → 619). Pullquote begins at y=619, below the fold — **intentional**: figure leads, words follow on scroll.

---

# 8. Desktop / Tablet Superset

At ≥768px (tablet) the layout reflows into a two-column grid. At ≥1280px (desktop) it becomes a four-column grid with the Council always-expanded.

## 8.1 Tablet (768 ≤ width < 1280)

Two-column grid: left-column locks the hero, right-column stacks everything else.

- **Left column:** HeroArt capped at 540 × 810 (2:3 maintained); 32px page padding. Sticky on scroll until the right-column's last element (Council) bottom passes the hero's bottom.
- **Right column:** Pullquote · LoreNote · TetherRow · MetadataChips · CouncilToggle (collapsed by default) · OwnerTrail. Each retains mobile heights but max-width 640.
- **TopBar:** spans full-width; remains 56px.

## 8.2 Desktop (≥1280)

Four-column grid: hero on left (cols 1–2), narrative on middle (col 3), Council always-expanded on right (col 4).

- **Col 1–2 (640px wide):** HeroArt at 540 × 810 (centered with 50px gutters).
- **Col 3 (~360px wide):** Pullquote · LoreNote · TetherRow (vertical here, not horizontal) · MetadataChips · OwnerTrail. The TetherRow on desktop becomes a vertical list of mini-cards (since the horizontal-scroll affordance is mobile-native).
- **Col 4 (~280px wide):** CouncilToggle is REPLACED by a static `<CouncilPanel>` — Silhouette · Props · Gesture · Spine each 64px tall, always visible. Per R1, this also exposes a "Cross-shell thumbnails" sub-panel showing the same figure across all 8 Shells (those that exist for this figure) — links to `/v2/card/:cardId/lampblack`.

## 8.3 Reflow Implementation

CSS Grid + named template areas. Tailwind v4 (`grid-cols-1 md:grid-cols-2 xl:grid-cols-4`) + `@container` queries for right-column recompose. No JS-driven layout — pure CSS.

---

# 9. Lampblack-Settle Pack-Open Animation

8-second ritual. 60fps target on iPhone 13+. `<PackOpenRitual>` uses Framer Motion for state transitions + Lottie for dust-mote drift and lampblack-haze settle (Loki team hand-tunes the Lottie).

## 9.1 The 8-Second Pack-Open Ritual (every Common / Rare / Legendary pull)

| Time | Phase | Visual | Audio | Haptic |
|---|---|---|---|---|
| 0.0–1.0s | Anticipation | Black canvas; dust motes drift in slowly from edges (Lottie particle drift, 6–10 motes on screen at once); single small spotlight at center forms. | **Single cello pluck** (per V2 audit) at 0.3s. | None. |
| 1.0–3.0s | Pack envelope unfurl | Parchment-tear animation — the pack envelope tears down its center seam in a 2-second easing curve; the inside is lampblack-cosmic-haze. | Parchment-tear sound at 1.0s; sustained low cello drone. | Single light tap at 1.0s (start of tear). |
| 3.0–4.5s | Card emerges (face-down, lampblack-haze settles) | The card rises out of the torn envelope, face-down; lampblack-haze (low-frequency black-grey gradient particles) settles AROUND the card edges — the card itself is still obscured. | Cello drone holds; subtle paper-rustle layer. | None. |
| 4.5–6.0s | Card flips to face-up | The card flips on its Y-axis with a 1.5-second arc; at 5.25s (mid-flip) the cello-drone resolves to a single sustained note. | Cello note resolves at 5.25s. | Light tap at 4.5s (start of flip); medium tap at 6.0s (face-up landed). |
| 6.0–7.0s | Tier-glow ignites | The tier-specific glow ignites around the card frame: **Common** dim-amber `0 0 12px rgba(176,136,56,0.30)` · **Rare** warm-gold `0 0 18px rgba(232,216,168,0.45)` · **Legendary** white-pulse `0 0 24px rgba(255,253,240,0.65)` with 0.5s pulse · **Ultimate** full Lampblack-cosmic-cascade (see §9.2). | Tier-specific stinger: Common = soft chime; Rare = bell; Legendary = bell + sustained string. | Medium tap at 6.0s; for Legendary, an additional double-tap at 6.5s. |
| 7.0–8.0s | Card settles into vault-position | The card reduces to its vault-thumbnail size and translates to its slot in the binder layout; subtle 14px sans-serif text fades in below: *"Added to your binder."* | Cello drone fades to silence at 8.0s. | None. |

## 9.2 The 12-Second Apex Variant (Ultimate pulls only)

Per GAME-ECONOMY-DESIGN-V1 §6 Apex spec.

- **0.0–6.0s:** Identical to base ritual through "Card flips face-up."
- **6.0–8.0s (extended ignition):** Full Lampblack-cosmic-cascade — entire screen fills with cosmic-particulate radiating from card edges; gilt-and-Whistler-velvet rim catches slow drift-highlight. Cello + sustained string + tympani-roll layered.
- **8.0–10.0s (full-screen reveal):** Card scales to 90% viewport; background dims to deep-Lampblack; pullquote fades in below in 32px serif italic; lore-note fades in 1.0s after.
- **10.0–11.0s:** Card scales back, translates to vault-position; pullquote + lore-note fade out.
- **11.0–12.0s:** *"Added to your binder."* + 12px small-caps *"This is one of 25 in existence."* Cello fades.

## 9.3 Reduced-Motion + Assets

`prefers-reduced-motion: reduce`: phases collapse to 200ms cross-fades; total 1.5s (Common-Legendary) / 2.5s (Ultimate); audio + haptics still trigger; "Added to your binder" appears at end.

Assets: Lottie `pack-open-ritual.json` ≤ 80KB gzipped; audio AAC 96kbps mono (cello pluck + drone + tier stingers as separate layered files); haptics via `navigator.vibrate()` (non-iOS) + Taptic Engine via Capacitor (iOS native shell, Phase 6+; Series 1 ships PWA).

---

# 10. Banned Chrome — the Rebirth's Negative-Space

Per G1 audit DISCARD list, items below are **explicitly absent** from `/v2/card/:cardId`. Acceptance gate §12 #4 fails the build if any appear in a Card-detail snapshot test.

1. **Battle stats** (Power / Intelligence / Mystery / Legend / Charm — Holmes is not Charm-60). 4-Layer Council replaces this.
2. **Burn-for-XP destructive CTA.** No XP path. Future forge ties to Lampblack-tether discovery, not stat-grind.
3. **Legacy Score** (Pristine 2 etc.). Top-Shot grader-jargon — every card is canonical-condition.
4. **30/90-day price chart.** No price on card-detail. Trading lives on a dedicated view (not Series 1).
5. **Comparable-floor-price strip.** No floor-comp ribbon.
6. **Need / Own / Comfy / Bulk sub-tabs.** Vault routes per R1 are Universe / Shell / Parallel / Elemental / Narrator — collector-curation, not trader-positioning.
7. **"Estimated Value History −69.6%"** / any red-trend-line.
8. **Live-stats row / movers-strip.** No "traded 4 times today" ticker.
9. **Weekly +XP Legend Challenges chrome.** Loki Playbook v3.0 excludes XP-grind from LoreVault.
10. **"Smart money is accumulating" pill.** Trader-pump rhetoric.
11. **Daily-streak gambler chrome.** No streak counter, no "log in 7 days for X."
12. **Prestige / FOMO countdown timer.** Drop pages have countdowns; the card itself does not.
13. **Forge seasonal discount.** No "30% off forge fees" promo.

The page is what it is BECAUSE of what it refuses to be.

---

# 11. Component File Map (engineering hand-off)

Next.js 16 App Router + Tailwind v4 + Framer Motion + Lottie. The v1 `CardItem.tsx` (34KB god-component, 8 unrelated concerns per G1 §4) is **DISCARDED** and replaced.

```
src/
  app/
    (vault)/
      v2/
        card/
          [cardId]/
            page.tsx                  # Server component; fetches card data; renders <CardDetailPage>
            lampblack/
              page.tsx                # Full Council route per R1
            tethers/
              page.tsx                # Full tethers route per R1
  components/
    card-detail/
      CardDetailPage.tsx              # Composition root; lays out elements per §1
      TopBar.tsx                      # 56px sticky bar (§1.1)
      HeroArt.tsx                     # 2:3 image with Lampblack-haze placeholder (§1.2)
      Pullquote.tsx                   # serif-italic + attribution (§1.3)
      LoreNote.tsx                    # tier-color left-rule + body (§1.4)
      TetherRow.tsx                   # horizontal-scroll mini-cards (§1.5)
      MetadataChips.tsx               # 5 chips, canonical order (§1.6)
      CouncilToggle.tsx               # collapsed/expanded 4-layer council (§1.7)
      OwnerTrail.tsx                  # current + history (§1.8)
      ActionsPlaceholder.tsx          # feature-flagged off Series 1 (§1.9)
    frame/
      CardFrame.tsx                   # Tier × Parallel composition root (§2 + §3)
      TierFrame.tsx                   # 4 Tier variants (§2)
      ParallelOverlay.tsx             # 5 Parallel treatments (§3)
      UniverseIcon.tsx                # corner stamp, 5 inline SVGs (§4)
      SetGlyph.tsx                    # bottom-right glyph, 20 inline SVGs (§5)
    ritual/
      PackOpenRitual.tsx              # Framer Motion + Lottie 8s ritual (§9)
      ApexReveal.tsx                  # 12s Ultimate-tier extension (§9.2)
  lib/
    parallels/
      eligibility.ts                  # assertParallelEligible() (§3.6)
      __tests__/eligibility.test.ts   # full cross-product tests
    audio/
      pack-open-stingers.ts           # tier-specific stinger map
    haptics/
      pack-open-haptics.ts            # navigator.vibrate + iOS Taptic abstraction
  styles/
    tokens.css                        # CSS custom properties:
                                      #   --color-tier-common / -rare / -legendary / -ultimate
                                      #   --color-shell-prime ... -saint
                                      #   --color-parallel-arcana ... -neon
                                      #   --font-baker-street, etc.
```

Each replacement is single-purpose, single-concern, ≤ 200 LOC. 8 concerns → 8 separate components.

---

# 12. Acceptance Criteria

Build is GREEN when all six pass.

1. **Tier and Parallel legible at 375 viewport in <1s glance.** Manual QA on iPhone 13, default ambient light, 20 cards (5 tiers × 4 parallels). Tier reads without studying the chip; Parallel reads without studying corner mandalas.
2. **ARCANA reservation rule machine-enforced.** `src/lib/parallels/eligibility.ts` ships with unit tests covering every (Tier × Parallel × BaseArtVariant) cross-product.
3. **Pack-open ritual 60fps on iPhone 13+.** Lighthouse + DevTools FPS overlay on real device; ≥ 58fps avg across 8s base; ≥ 55fps avg across 12s Apex. Reduced-motion path tested separately.
4. **No banned-chrome present.** Snapshot tests at `src/components/card-detail/__tests__/CardDetailPage.test.tsx` assert no §10 strings/roles in rendered DOM.
5. **Typography degrades gracefully.** With Chrome `Network` panel "Block all fonts", page renders legibly via system-fallback chain in §6.
6. **Universe + Set glyph SVGs ≤ 2KB.** Build-time `scripts/check-svg-budget.ts` enforces ≤ 2048 bytes for every file in `src/components/{UniverseIcon,SetGlyph}/glyphs/*.svg`. Fails at 2049.

---

Decisions, not options. — LoreVault Card Frame & Layout Spec v1, 2026-04-26.
