# LoreVault — Game & Economy Design v1

**Status**: Design spec, not yet implemented.
**Reference model**: NBA Top Shot's set/tier/parallel system, adapted for public-domain-character digital collectibles.
**Date**: 2026-04-24

## 1. Core Atoms

A LoreVault card is uniquely identified by:

```
Card = (Series, Universe, Set, Moment, Tier, Parallel, Serial)
```

- **Series** — time-bounded drop cycle (Series 1, Series 2, …). Series 1 runs ~12 months.
- **Universe** — one of 5 permanent canons. Universes don't expire.
- **Set** — a narrative arc or themed collection within a Universe (e.g., "221B", "The Hounds of Baskerville"). A Set has fixed composition and goes out of print after its mint window.
- **Moment** — a specific character × scene (e.g., Holmes at the Reichenbach Falls). Tier is a property of the Moment.
- **Tier** — Common / Rare / Legendary / Ultimate. Four rarity levels.
- **Parallel** — cross-cutting art-treatment variant. Any Moment can (optionally) exist as a Parallel.
- **Serial** — the numbered mint within the (Moment × Tier × Parallel) pool.

## 2. Universes (5 — permanent)

Every Universe has a fixed canonical character pool. Universes are the "team/league" equivalent of Top Shot.

| Universe | Canon | Tone |
|---|---|---|
| **Baker Street** | Conan Doyle — Holmes & Watson | Deduction, fog, gaslight, mystery |
| **Enchanted Kingdom** | Grimm / Perrault / Andersen | Fairy tale, pre-Disney darkness |
| **Wonderland** | Carroll — Alice | Nonsense, dream-logic |
| **Gothic Horror** | Stoker / Shelley / Leroux / Stevenson | Revenant, transformation, dread |
| **Greek Myth** | Hesiod / Homer / Ovid | Mythic, divine, fated |

Each Universe has a distinct **base-art register** (same Moment art is filtered through universe aesthetic DNA — gaslight sepia for Baker Street, deep-jewel chiaroscuro for Gothic, rose-gold dawn for Greek Myth, etc).

## 3. Tier System (4)

Borrowing Top Shot's Ultimate-ceiling ladder but collapsed to 4 tiers (drop "Fandom" — we're not gated by a players' association, we own the canon).

| Tier | Mint / Moment | Moments per Set | % of Set Supply | Pack pull rate | Notes |
|---|---|---|---|---|---|
| **Common** | 15,000 | 12 | 75% | ~70% / pack slot | Everyday scenes, supporting characters, lived-in moments. Accessible entry point. |
| **Rare** | 2,500 | 5 | 21% | ~25% / pack slot | Strong secondary moments. Iconic gestures, distinctive scenes. |
| **Legendary** | 250 | 2 | 3.5% | ~4% / pack slot | Second-tier iconic. The moments fans remember by name. |
| **Ultimate** | 25 | 1 | 0.5% | ~1% / pack slot | THE defining moment of the arc — one per Set. "Holmes at Reichenbach." "The bite of the apple." "Frankenstein's first breath." |

**Total supply per Set**: 12×15,000 + 5×2,500 + 2×250 + 25 = **193,025 base cards**
(Before parallels. With parallels, supply grows — see §4.)

**Per-Set economics (illustrative, Common pack @ $9):**
- Average pack contents: 3 Common + 0.7 Rare expected value
- Pack opens per Set until Ultimate appears: ~19,000
- Ultimate-chase audience: power users hunting 25-mint scarcity

## 4. Parallels (5 — cross-cutting)

**THE CORE INNOVATION vs Top Shot**: parallels aren't foil treatments, they're distinct art variants — the same Moment seen through a different artistic lens.

Each Parallel has its own visual signature that cuts across all Sets and Universes. A collector can "hunt the ARCANA" across every set like Top Shot collectors hunt Cool Cats or Metallic Gold LE.

Supply is much tighter than base. Each Parallel is only minted for **Rare+ Moments** (not Common — keeps the Parallel chase premium).

| Parallel | Visual signature | Mint / Moment (Rare) | Mint / Moment (Legendary) | Mint / Moment (Ultimate) |
|---|---|---|---|---|
| **ARCANA** ★ | Sacred-geometry mandala / alchemical sigils glowing behind the character's head; golden occult filigree; cosmic aurora | 500 | 50 | 5 |
| **AETHER** | Aurora-cosmic backdrop, nebulae, divine particulate, god-rays — the Mythic mode | 250 | 25 | 3 |
| **WITNESS** | Photoreal time-travel — documentary cinema realism of the historical setting, Deakins/Lubezki register | 100 | 10 | 2 |
| **NEON** | Modern/cyber reimagining — character relocated to near-future urban-gothic, synthwave palette | 50 | 5 | 1 |
| **ONE-OFF** | Unique commissioned variant — completely different art, often alternate Moment framing | — | — | **1** |

★ = lead parallel for Series 1 launch (this is the look you're voting YES on).

**Pack odds for parallels**: 1 in every ~40 packs contains ONE parallel card (any Parallel × any Rare+ Moment). Distribution within that is weighted: ARCANA 50% / AETHER 25% / WITNESS 15% / NEON 10%. ONE-OFFs are NOT in packs — they drop as separate curated offerings.

## 5. Sets Within a Universe (Series 1)

Each Universe gets **4 Sets in Series 1**, dropped monthly in staggered cadence so at any time some sets are in-print and some are collectible-complete.

**Example — Baker Street (Conan Doyle):**

| Set # | Name | Arc | Ultimate Moment |
|---|---|---|---|
| BS-1 | **221B** | Domestic origins — the investigative life | Holmes returns from Afghanistan deduction ("You have been in Afghanistan, I perceive.") |
| BS-2 | **The Cases** | Mid-canon iconic cases | The Hound charging across the moor |
| BS-3 | **Moriarty** | The Napoleon-of-Crime arc | Moriarty at his chessboard of London |
| BS-4 | **Reichenbach** | The fall and the return | Holmes at the falls |

**Set structure**: 20 Moments per Set = 12C + 5R + 2L + 1U. Same pattern across every Universe for consistency.

**Series 1 scope**: 5 Universes × 4 Sets × 20 Moments = **400 Moments total**.

**With parallels (Rare+ only)**:
- Rare: 5/Set × 20 Sets = 100 Rare Moments × 5 Parallels = 500 parallel instances
- Legendary: 2/Set × 20 Sets = 40 Legendary Moments × 5 Parallels = 200 parallel instances
- Ultimate: 1/Set × 20 Sets = 20 Ultimate Moments × 5 Parallels = 100 parallel instances

Total unique (Moment × Tier × Parallel) catalog entries for Series 1: **400 base + 800 parallel = 1,200 distinct art pieces.**

Generation cost at $0.17/image (gpt-image-1): **~$204** for the full Series 1 art catalog, generated over time (not night-one).

## 6. Pack Structure

Closely modeled on Top Shot pack tiers — calibrated to LoreVault's tier/parallel supply.

| Pack | Price | Size | Guarantees | Rare+ Parallel odds |
|---|---|---|---|---|
| **Sample** | Free | 1 Common | New-user reactivation | 0% |
| **Standard** | $9 | 3 Moments | Weighted-random Common heavy | ~2% |
| **Curated** | $49 | 5 Moments | ≥1 Rare | ~8% |
| **Premium** | $199 | 6 Moments | ≥1 Legendary | ~30% |
| **Apex** | $999 | 7 Moments | ≥1 Legendary + 1 guaranteed Parallel + 10% Ultimate shot | Guaranteed |

**Free pack cadence**: every active user gets 1 Sample pack / week. This is the Connector/lapsed-reactivation lever.

## 7. Growth-Loop Checks (CEO Doctrine Filters)

Running this system through the doctrine:

### ✅ 1. Grow L/XL segment?
Apex packs at $999 + ONE-OFFs as separate offerings create a high-end spend surface. Parallels give whales a chase target beyond base sets. **YES.**

### ✅ 2. Reactivate lapsed?
Free Sample packs weekly + a "Welcome Back" Starter drop of common-tier art = no-cost re-entry. **YES.**

### ✅ 3. Depth of spend $10 → $10K?
- $0 entry (Sample) → $9 Standard → $49 Curated → $199 Premium → $999 Apex → 4-6 figure secondary market on Legendary/Ultimate/ONE-OFF. **YES.**

### ✅ 4. Four archetypes?
- **Collector**: Set completion + parallel hunts + Ultimate chase.
- **Gamer**: Daily pack opens + Legendary pull moments. (Plus battle/challenge integration, §9.)
- **Speculator**: Marketplace with Rare+/parallels as liquid assets.
- **Connector**: Free Sample packs + shareable Ultimate reveals + showcase profiles.
**YES.**

### ⚠️ 5. Makes outsiders curious?
Public-domain IP is a double-edged sword. "Sherlock NFTs" could read as "just another X NFT." The **art quality + parallel hunts** must be the curiosity-hook (screenshots on Twitter that stop scrolls). v6 art direction is doing that — the ARCANA-style sacred-geometry look you shared is genuinely striking. **YES, conditional on art continuing to punch above weight.**

### ✅ 6. Whales visible?
Ultimate pulls and ONE-OFF drops are shareable-on-socials moments. Showcase profiles. **YES.**

### ✅ 7. Free entry point?
Free Sample pack weekly. **YES.**

### ⚠️ 8. Cheap to test first?
Full catalog = $204 art-gen + frontend build. But the v6 seeder + taste daemon already exist. We can build ONE Set (20 moments × 5 parallels = 120 images = $20) as a prototype Set and validate pack mechanics before full Series 1. **48-hour-experiment path: one Set, 100 test packs, see if the pack-open loop feels right.**

## 8. How the v6 MODES Map to This System

The six modes I built in `scripts/seed-moodboard.mjs` were a dead-end framing (they were trying to be both rarity and art-lens). Correct mapping:

| v6 MODE | Becomes |
|---|---|
| `painterly-epic` | **Base art** for all tiers (Common/Rare/Legendary/Ultimate). The "authentic" look. |
| `ornate-ritual` | **ARCANA parallel** — sacred-geometry mandala, gold-leaf filigree. |
| `mythic-cosmic` | **AETHER parallel** — aurora, nebulae, divine particulate. |
| `witness-photoreal` | **WITNESS parallel** — photoreal time-travel realism. |
| `modern-reimagined` | **NEON parallel** — cyber reimagining. |
| `dream-psychedelic` | Could be absorbed into ARCANA (the psychedelic overlap is high). Or promoted to a 6th parallel later. |

ONE-OFF is not a mode — it's commissioned bespoke art, one at a time, likely generated with higher-quality manual iteration.

## 9. Games + Loops (Future, Series 1.5+)

Not blocking launch, but design for:
- **Battle/Trivia** (already in repo) — Legendary+ cards confer multipliers.
- **Set-completion missions** — badge + XP for completing a Set of Rare+.
- **Parallel-completion meta** — complete a parallel run across all 20 Sets of Series 1 = "ARCANA Master" badge + exclusive drop.
- **Daily moment reveal** — a new Common drops daily for free; creates daily hook.

## 10. Immediate Plan (Next 48 hours)

Instead of finishing Series 1 catalog, validate the ECONOMY FRAME with one Set.

### Set: Baker Street BS-4 "Reichenbach" — prototype
- 20 moments (12C/5R/2L/1U) — already have Sherlock, Moriarty, Irene, Hound from v6 regen
- Need 16 more moments within the Reichenbach arc (Watson's grief, Mycroft's intervention, the empty Baker Street rooms, etc.)
- Generate base art + ARCANA parallel for Rare+ tier only (5+2+1 = 8 moments × 2 treatments = 16 images = $2.72)
- Ship a static `/sets/reichenbach` preview page with tier/parallel chips
- NO pack mechanics yet — just the catalog visualization

### What this tests
- Does a tier-structured Set feel like a cohesive collectible?
- Does ARCANA read as a distinct, desirable variant?
- Does the "one Ultimate per Set" convention create the "I must have this" response?

### Decision point after
If yes → expand to all 5 Universes × 1 Set each (5 Sets) as Series 1 Drop 1. If no → iterate the Set-internal structure.

## 11. Open Questions for CEO

1. **Series 1 scope**: Ship with 1 Set × 5 Universes (5 total) or 2 Sets × 2 Universes (4 total, deeper per universe)?
2. **Mint-count economics**: are the illustrative numbers (15K Common / 2.5K Rare / 250 Legendary / 25 Ultimate) too generous vs Top Shot? Top Shot common runs 20-60K for moments but heavily split across sets. Our smaller initial audience means tighter is fine.
3. **Parallels at Common tier?** Current spec: Parallels only Rare+. Opening them to Common adds supply but dilutes the chase. Recommend: keep Rare+ only.
4. **ONE-OFF distribution**: auction? bid-timed drop? bundled with Apex pack reveals as a small chance?
5. **Series 2 concept** — do we introduce new Universes (Norse myth? Arthurian? 1001 Nights?) or deepen the 5 existing?

---

## Summary

**The design in one paragraph:** LoreVault ships 5 permanent Universes of public-domain canon. Each Universe gets 4 themed Sets per Series. Each Set contains 20 Moments split across 4 rarity tiers (Common/Rare/Legendary/Ultimate). Any Rare+ Moment can appear in one of 4 cross-cutting Parallels (ARCANA / AETHER / WITNESS / NEON) that carry their own art treatment across the entire catalog — so collectors can hunt a parallel run independent of Sets. Ultra-rare ONE-OFF variants exist as curated auction drops. Pack tiers ($0 / $9 / $49 / $199 / $999) create depth-of-spend from free-reactivation through whale-chase.

**The art insight:** the v6 "ornate-ritual" mode — the sacred-geometry mandala glowing behind the character's head you just approved — becomes the ARCANA parallel. That IS the cross-cutting visual signature. It was mislabeled as a "style mode" when it's structurally a "chase variant."
