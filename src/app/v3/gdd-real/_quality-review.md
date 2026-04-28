# Real GDD — Quality Review

**Run:** `LV-MLP / Track A / Stage A.5`
**Date:** 2026-04-28
**Reviewer posture:** Hostile read. The reviewer is an experienced digital-collectibles operator (Top Shot vintage 2020-2023, NFL ALL DAY launch, two Disney Pinnacle planning cycles) plus a literary critic with priors aligned to OPUS-THIRD-VOICE (Mirrlees, Borges, Le Guin, Pratchett, Marlon James, Wecker, Crowley). They read the document the way a hostile critic reads a debut novel — looking for the seam where the writing reveals it has not done its homework.

The five hostile-read tests, applied per the orchestration prompt:

1. **Core-loop legibility test.** Is the core loop legible to a brand-new reader?
2. **Economy consistency test.** Is the economy internally consistent? Do the edition sizes, royalty percentages, and treasury mechanics form a coherent system, or are they vibes?
3. **Pierre-Menard market test.** Does the Pierre-Menard high-rarity story actually work in market terms? Why would a collector pay more for the same text in a different Pane lighting?
4. **Games-commitment test.** Does the Games-with-Collectibles section commit to ONE game and actually explain HOW it works?
5. **Onboarding-specificity test.** Does the Onboarding section give specific screen-by-screen content, or does it hand-wave "a great onboarding experience"?

---

## Test 1 — Core-loop legibility

**Section under review:** § 2 Core Loop.

**Hostile read.** A new reader needs to understand the loop in under five minutes. § 2 leads with a directed-graph diagram (Visitor → Hook → First Pack → First Card → First Set → First Challenge → First Contraband → First Trade → First Game → Return Visit) and then explains every transition in prose. The diagram is rendered as a code block; the diagram-then-prose pattern is conventional GDD craft. Each transition has its own H3 paragraph. The closing paragraph explains why the eight transitions are the right ones, with cites to digital-collectibles literature.

**Failure modes checked.**
- Does the loop have unexplained nodes? No — every node has a paragraph.
- Are the transitions hand-waved? No — each transition is named with the product-surface or behavioral-nudge that produces it.
- Is the loop circular (returns to the start)? Yes — Return Visit feeds back to First Pack with a daily new-card hook in § 13.
- Could a reader explain the loop in their own words after reading? Yes — the first sentence of each transition paragraph is the legible-vibe summary.

**Verdict: PASS.** A new reader can take the loop in five minutes and explain the diagram from memory after one read. The loop is legible.

**Optional fix considered:** Add a one-sentence "what changes between visits" frame to make the compounding behavior explicit. Decision: not needed; § 13 (Retention) carries that load-bearing job, and the cross-reference is implicit.

---

## Test 2 — Economy consistency

**Section under review:** § 3 Economy & Monetization, with cross-checks against § 4 (Rarity), § 7 (Marketplace), § 14 (Atlas).

**Hostile read.** § 3 commits to numbers: 30% platform / 70% treasury split on primary; 5% total take rate on secondary with 2.5% platform + 2.5% creator royalty (1% LoreVault + 1.5% Contributor Pool); pack price ladder at $9 / $15 / $39 / $399; sustainability math at $200K/month primary and 5x secondary on month four.

**Internal consistency checks.**
- Primary 30/70 split + secondary 5% take = same fee structure as Top Shot. ✓
- Edition sizes (Common 5k-15k, Rare 500-2k, Legendary 50-199, Contraband-Rare 1-25, Pierre-Menard Unique 1-of-1) → at the Common end, a $9 Standard Pack with five cards predominantly Common contributes ~$9/(5 cards × ~10K editions) ≈ negligible per-card primary revenue. The economy depends on volume of pack purchases, not per-card mint count. This matches Top Shot's actual economy. ✓
- Contributor Pool = 1.5% of secondary + (5%? 1.5%?) of primary on original Panes. The text says "1.5% to the Contributor Pool" from secondary and references a "five percent of every primary sale on original Panes" in the glossary entry for Contributor Pool. **Discrepancy flagged**: § 3 does not explicitly state a primary-side contribution to the pool; it routes 70% to treasury and ringfences a portion. The glossary's "five percent of every primary sale" is more specific.

**Resolution.** Re-read § 3 carefully:

> "The remaining seventy percent goes to LoreVault treasury, which funds production (art, prose, engineering) and a five percent ringfence to the Contributor Pool."

This says: of the 70% that goes to treasury, 5% (i.e., 5% of treasury, which is 5% × 70% = 3.5% of gross primary) is ringfenced to the Contributor Pool. The glossary is slightly ambiguous on whether "five percent of every primary sale" is gross or treasury-portion. **Failure mode**: a reader could interpret the glossary as 5% gross, while § 3's wording suggests 5% of the 70% treasury. The two are different numbers (5% vs 3.5%).

**Fix.** Clarify in the glossary that the primary-side contribution is "five percent of the LoreVault treasury take from primary sales" (i.e., 3.5% of gross). This is consistent with § 3 and avoids the ambiguity. **Applied as glossary edit below.**

**Verdict: PARTIAL → PASS after fix.** The economy is internally consistent once the Contributor Pool sourcing is clarified to specify "treasury take" rather than "primary sale." The fix is one sentence in the glossary entry for Contributor Pool.

---

## Test 3 — Pierre-Menard market mechanic

**Section under review:** § 3 Economy (Pierre-Menard high-rarity), § 4 Rarity (Pierre-Menard Unique tier), § 7 Marketplace (translation-scar rendering), § 9 Challenges (Pierre-Menard challenge), § 17 Cross-reference (reframe-07).

**Hostile read.** The mechanic claims that two cards with identical text but different Pane attribution should command different secondary prices, with the rarer-Pane variant commanding a premium. § 3 grounds this in Borges's *Pierre Menard, Author of the Quixote* — Menard's text is richer than Cervantes's because the same words mean different things in a different time. The Holmes "refusal-to-admit-ignorance" example is named: heroic in Baker-Street, monstrous in Old-Ones-Persist, sinful in Sinterklaas-Reigns.

**Hostile-read questions.**
- Why would a market actually pay a premium for cosmological pressure as opposed to scarcity?
- The argument is doctrinal but is it economic?

**Defense in the document.** § 7 (Marketplace) commits to translation-scar rendering — when a buyer browses a Pierre-Menard variant, the marketplace UI surfaces the cross-Pane sibling-card relationship in the listing thumbnail. The buyer sees the triptych. This matters because a market only prices what it can see; if the variants render as three unrelated database entries, no premium is discoverable. The mechanic depends on the UI to make the cosmological pressure legible at the moment of purchase.

§ 3 commits to a specific concrete outcome: "the Holmes 'refusal to admit ignorance' line on a Baker-Street Pane card is heroic. The same line on an Old-Ones-Persist Pane card is monstrous. The same line on a Sinterklaas-Reigns Pane card is sinful." The buyer who pays the premium for the Old-Ones-Persist variant is paying for the cosmological inversion the variant carries. The argument is that the same text means different things in different cosmological lighting, and the market routes signal through pricing the way it does for any semantically-loaded scarce object.

**Hostile counter.** "But this only works if collectors can read the doctrine. Most collectors won't." This is a real failure mode. The defense is the architecture: the silhouette-glance layer (95/5 rule) delivers the vibe to the median collector who never reads the wiki, and the deep-iceberg layer rewards the elite who do. The Pierre-Menard premium is a concentrated phenomenon at the high-rarity edge of the market — Legendary and above — where the buyers are by self-selection the literary-engaged. The mass market is not pricing Pierre-Menard cards; the literary-elite secondary is.

**Verdict: PASS.** The mechanic is economically defensible because (a) the marketplace UI makes the cosmological pressure visible, (b) the price discovery happens at the high-rarity end where the literary-elite buyers are, and (c) the Borges argument is the doctrinal grounding. A skeptical Top-Shot operator would still raise an eyebrow at the premium; the doctrine accepts that risk because the alternative is treating cards as interchangeable database entries, which collapses the cosmological-variant model.

---

## Test 4 — Games-commitment

**Section under review:** § 10 Games with Collectibles.

**Hostile read.** § 10 commits to ONE game for MLP — Predictions — and explains the mechanic in detail across five paragraphs (the conflict mechanic, the staking, the resolution, the market behavior, the rationale). It also documents the four other candidates (Sorare-style fantasy, MTG draft, Pokémon battle, Tarot-narrative) with explicit defer-or-research-only rationale per candidate.

**Hostile-read checks.**
- Is the game explained at the level of "a developer could implement it"? Yes — the Footnoter publishes the conflict announcement Tuesday noon UTC, the staking window opens immediately and runs through Sunday midnight UTC, the conflict resolves Monday morning, the narrative-scar overlay lands as a per-card flag in the Cadence contract.
- Is the doctrine fit explicit? Yes — the cross-Pane axiom-conflict directly maps to the doctrine's diff-07 (incommensurable cohabitation).
- Is the build cost explicit? Yes — "the engine is the existing pack-stake-resolve loop, plus a per-card overlay flag in the Cadence contract."
- Is the market consequence explicit? Yes — narrative-scarred cards command a premium on the secondary; the Prediction event is a primary-economic-engine for narrative-scarred secondary cards.

**Failure modes checked.** Does the section commit to one game without leaking ambiguity? Yes — "Predictions ship in V1." Does it document the alternatives so a reviewer doesn't ask "did you consider X"? Yes — all four alternatives are walked.

**Verdict: PASS.** The Games section commits to one game and explains how it works at implementation-detail granularity. A developer could ship this from § 10 + § 14 (Atlas integration for the per-card overlay).

---

## Test 5 — Onboarding-specificity

**Section under review:** § 12 Onboarding.

**Hostile read.** § 12 commits to a five-screen ceiling and walks each screen in detail. Screen 1 (Hook): three Panes shown, axioms in restrained small caps, painted silhouette cards bled to tile edges, no logo, no nav, no testimonial band, "Choose a Pane" CTA pinned to bottom. Screen 2 (Taste): Pane page expanded with axiom in large serif, two further cards at full art with flavor lines, Pane-specific sentence-rhythm in chrome, "Open the [Pane Name] Starter Pack — \$9 with Apple Pay" CTA. Screen 3 (First Pack): Apple Pay tap → \$9 → pack-rip animation; Dapper Wallet provisioned silently behind the first purchase. Screen 4 (Iceberg): first card surface line + Echo line + first deep-iceberg facet, with the deeper layers gated to Tier 2. Screen 5 (Set): Set Tracker rendering "1 of 12 in the Lud-Border Customs House Starter Set," eleven missing cards as silhouette tiles with two listed at floor for one-tap purchase, Daily Challenge half-completed widget surfacing.

**Failure modes checked.**
- Is each screen specified with concrete content (axioms, prices, CTAs)? Yes — each screen lists at least three concrete elements.
- Is the no-friction path explicit? Yes — "no tutorial overlay, no pop-up, no wallet prompt, no seed-phrase, no KYC."
- Is the literary-product personality visible in the onboarding copy? Yes — "the cane in the corner of the frame is not the one Watson carried home" appears as the Pratchett-grade pull-quote in italic grey on Screen 1.
- Could a designer mock this in Figma from § 12 alone? Yes — every screen is described at content-and-layout granularity.

**Verdict: PASS.** Onboarding is specific. A designer could mock the five screens; an engineer could implement the conversion funnel; a copywriter could write the strings.

---

## Hostile-read summary

| Test | Verdict | Notes |
|---|---|---|
| 1. Core-loop legibility | PASS | Diagram + prose, every transition named, vibe summary in first sentence per paragraph |
| 2. Economy consistency | PARTIAL → PASS after fix | Contributor Pool sourcing ambiguous in glossary; fix applied below |
| 3. Pierre-Menard market | PASS | Doctrinal grounding (Borges), market mechanism (translation-scar UI), concentration at high-rarity tier |
| 4. Games commitment | PASS | Predictions specified at implementation granularity; alternatives walked with defer rationale |
| 5. Onboarding specificity | PASS | Five screens specified at content-and-layout granularity |

---

## Fix applied

The Glossary entry for **Contributor Pool** is updated to clarify the primary-side contribution sourcing:

**Before:**
> The ringfenced fund — one and a half percent of every secondary sale plus five percent of every primary sale on original Panes — that pays Tier-3+ canon contributors when their flavor lines or contraband proposals are accepted into canon.

**After:**
> The ringfenced fund — one and a half percent of every secondary sale plus five percent of LoreVault's treasury take from primary sales on original Panes — that pays Tier-3+ canon contributors when their flavor lines or contraband proposals are accepted into canon.

The fix is applied to `src/components/gdd-real/sections/16-glossary.tsx` in the same commit as this review.

---

## Final quality verdict

After the one fix to the Contributor Pool sourcing, the Real GDD passes all five hostile-read tests at substance level. The doctrine is operationalized; the economy is consistent; the Pierre-Menard mechanic is economically defensible; the games commitment is explicit; the onboarding is specific.

**Quality Review: PASS.**

The Real GDD is ready for handoff to Track-B (mood-board portal, which depends on this GDD's Pane / contraband / Pierre-Menard primitives) and Track-C (MLP product, which depends on this GDD's core loop / onboarding / Atlas-negotiation primitives).
