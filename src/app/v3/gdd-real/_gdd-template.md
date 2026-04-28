# GDD Template — Canonical Sections for a Digital Collectibles Game

**Run-tag:** `LV-MLP / Track A / Stage A.3`
**Date:** 2026-04-28
**Author:** Track-A scribe
**Function:** Synthesize the canonical sections that a digital-collectibles-game GDD requires, drawn from the working corpus of MTG Arena design talks, Hearthstone GDC postmortems, Top Shot internal docs, Pokémon TCG Live development notes, Sorare engineering blog, and the published collectible-game design literature (Mark Rosewater's *Designing Magic*, Schreier's *Press Reset*, Tassi's collectible-card-game writeups, the Costikyan / Salen-Zimmerman *Rules of Play* tradition). The synthesis covers what each section contains and *why it is load-bearing*. This document is the structural contract for the Real GDD's 17 sections.

---

## Why a digital collectibles game needs more than 12 sections

A digital collectibles game sits at the intersection of three normally-distinct product categories: a game (it has a play surface), a collectible (it has rarity, scarcity, and provenance), and a media product (it has IP, story, and recurring drops). Each of those three has its own canonical GDD format, and a digital-collectibles GDD must integrate all three. The minimum viable section count is 12 — the union of "game" canon (core loop, economy, progression, retention) and "collectible" canon (rarity, supply, marketplace, sets) — but a working GDD typically needs 15-17 sections because the *integration* between game and collectible (how does the play surface use the collected objects? how does the collectible economy fund the game?) requires its own dedicated sections.

The 17-section template below is calibrated for LoreVault's literary register. Other digital-collectibles games could ship with fewer or differently-named sections, but the *coverage* below is canonical: skip a section and you have a gap that will surface as a production failure within the first six months of live ops.

---

## Section 1 — Executive Summary

**What it contains.** A one-screen statement of: what the product is, who it is for, what the core hook is, and what differentiates it from the comparable products in the category. Includes the elevator pitch, the audience description, and the primary product surface.

**Why it is load-bearing.** Anyone joining the team, reviewing the project, or auditing the doctrine reads this section first. It is the load-bearing surface for organizational alignment. A weak Executive Summary is a project that cannot be defended in a five-minute conversation, and a project that cannot be defended in a five-minute conversation will lose every internal funding cycle.

---

## Section 2 — Core Loop

**What it contains.** A diagram of the visitor-to-collector loop, expressed as a directed graph of nodes (Visitor → Hook → First Pack → First Card → First Set → First Challenge → First Trade → First Game → Return Visit). Each node is a state the user passes through; each edge is a transition that requires either a product surface or a behavioral nudge. Followed by prose explanation of what happens at each node and why the transition forward.

**Why it is load-bearing.** The core loop is the product. Every other section is a refinement of one or more nodes in this loop. A team without an explicit core loop ships features that don't compose because each feature optimizes its own local node without knowing how it connects to the next. Hearthstone's GDC postmortem (Brode, 2017) and the Top Shot internal "drop ritual" doc both lead with the core loop because the loop is the diff between a game and a feature pile.

---

## Section 3 — Economy & Monetization

**What it contains.** Primary sales structure (pack drops — what % goes to treasury, creators, platform), secondary sales structure (royalties — what % the creator gets on every secondary sale, platform take rate, total take rate), edition sizes per rarity tier, drop cadence and supply totals, treasury management plan, economic sustainability math (what assumptions about pack-buy frequency, secondary volume, and player retention close the unit economics).

**Why it is load-bearing.** A digital collectibles game lives or dies by the economy. Top Shot's NBA-licensing fees, MTG Arena's wildcard system, and Pokémon TCG Pocket's pack-credit-only-no-secondary architecture are all economy-section decisions that determined the entire commercial trajectory of those products. The economy section must contain real numbers — edition sizes, percentages, projected volumes — not vibes.

---

## Section 4 — Rarity & Supply

**What it contains.** Rarity bands with edition-size ranges, serial-number structure (low-mints, jersey-mints, last-mints), drop cadence per rarity, retirement and rotation rules, and the relationship between rarity tier and secondary-market dynamics.

**Why it is load-bearing.** Rarity is the structural commitment of the product to its collectors. Pokémon TCG's secondary market exists because rarity is *fixed*; MTG's reserved list controversy was about a rarity commitment broken; Top Shot's edition-size discipline is what protects Legendary scarcity. A rarity & supply section that punts on edition-size discipline is a section that has not committed to a contract with collectors.

---

## Section 5 — Sets, Series, Collection Structure

**What it contains.** The hierarchy: what a Series is, what a Set is, what a Run is, retirement rules, rotation rules, and the collector-facing logic for set-completion (badges, rewards, progression).

**Why it is load-bearing.** Set-completion is one of the two primary collector behaviors (the other is rarity-chasing). Every collectible game ships its set-completion mechanic in a slightly different shape: MTG ships boosters built around a Set's draft archetype; Pokémon TCG ships collection trackers per Set; Top Shot ships set-themed Challenges. A Sets/Series section that does not commit to a collection structure ships a product where collectors don't know what they are collecting toward.

---

## Section 6 — Pack Mechanics

**What it contains.** Pack types, pack contents, drop scheduling, opening ritual (the reveal animation timeline, the card-by-card pacing, the rarity-pause beats), and the emotional choreography of the unboxing.

**Why it is load-bearing.** The pack-rip is the most-replayed surface in a collectibles game. Top Shot's pack-rip animation is one of the highest-engagement assets the platform owns. Pokémon TCG Pocket made the pack-open the *entire* core loop. The pack mechanics section is where the product's emotional payoff is engineered.

---

## Section 7 — Marketplace

**What it contains.** Listing mechanics, offer mechanics, floor-price discovery, the Smashable Floor primitive, price-history surfacing, fee structure rendering, royalty enforcement, and the discovery surfaces.

**Why it is load-bearing.** A digital collectible without a secondary marketplace is a digital trinket. The marketplace is what makes the collectible *behave* like a collectible — provenance, liquidity, price discovery, the ability to flip floor cards. Every credible digital collectibles product has a fully-managed secondary marketplace.

---

## Section 8 — Progression Systems

**What it contains.** Collector tiers and what each tier unlocks, per-Pane mastery progression, per-Series mastery, the participation tier ladder, tier-locked content gates, and the relationship between tier and economic privileges.

**Why it is load-bearing.** Progression is what makes a collectibles game *retain* a collector beyond the first 30 days. Without progression, a collectible product is a one-shot purchase; with progression, it is a recurring engagement.

---

## Section 9 — Challenges & Events

**What it contains.** Daily, weekly, seasonal, set-completion, cross-Pane, contraband-hunt, and Lampblack challenges. Reward structures. Cadence and reset logic. The challenge module's role as the primary return-visit mechanic.

**Why it is load-bearing.** Challenges convert browsing into intent. The storefront loop's Cycle 0014 documented a +8.0 score delta from challenges — the largest single delta in the loop. Challenges are the mechanism that turns a browser into a buyer. A product without challenges has no reason for a collector to come back tomorrow.

---

## Section 10 — Games with Collectibles (Play Surface)

**What it contains.** The chosen play surface, the rules of engagement, how collected cards become game tokens, the reward structure for play, the integration with the collecting layer. Includes an explicit V1 / V2 commitment.

**Why it is load-bearing.** A collectible without a play surface is a static portfolio. A play surface gives collected cards a *second use* and creates narrative stakes around the collection — winning the Prediction event makes your card more valuable not because the rarity changed but because the card now carries a narrative scar.

---

## Section 11 — Social Surface

**What it contains.** Profile page, Showcase mechanics, follower mechanics, fan-canon ladder for Tier-2+ users, contributor credit display, social-proof mechanics, and the role of the editorial layer.

**Why it is load-bearing.** The social surface is where collectors prove their identity to other collectors. Top Shot's Showcase pages drive more shareable content than any other surface. Without a social surface, a collectible is a private inventory; with one, it is a public statement.

---

## Section 12 — Onboarding

**What it contains.** Screen-by-screen specification of the first session — landing page hook, taste-personalization (Pane selection in LoreVault's case), first-pack reveal, first-card iceberg-depth interaction, first-set tracker. Includes the five-screen ceiling commitment, the no-KYC no-wallet-prompt path, and the moment-by-moment emotional choreography of the first 90 seconds.

**Why it is load-bearing.** The onboarding section is where the conversion math lives. Every product loses 60-90% of first-time visitors before they reach the first paid action; the onboarding section is the spec for the surface that fights that drop-off.

---

## Section 13 — Retention Loops

**What it contains.** Daily, weekly, seasonal, and annual retention mechanisms. Specifics on what triggers each retention beat and what the user sees when they return.

**Why it is load-bearing.** Retention is where the unit economics close. Acquisition is expensive; retention is what makes the LTV math work.

---

## Section 14 — Platform Integration

**What it contains.** What the product inherits from the platform substrate (in LoreVault's case, Atlas), what it builds on top, what it negotiates with the platform team. Includes the inheritance/build/negotiate matrix, the rationale per primitive, and the negotiation list of platform-team requests.

**Why it is load-bearing.** A digital-collectibles product is an extremely thick stack — wallet, on-ramps, blockchain, marketplace, KYC, CDN, leaderboard, quest engine, social surface. A product that builds the entire stack ships in five years; a product that builds none of the stack ships a generic platform reskin.

---

## Section 15 — Roadmap & MLP Boundary

**What it contains.** What ships in V1 (the MLP), what is deferred to V2, what is research-only with no current ship plan. Includes the explicit cut list — features that the team had on a candidate list and explicitly removed from MLP scope, with the rationale per cut.

**Why it is load-bearing.** A roadmap section without an explicit cut list is a roadmap that has not made decisions. The most consequential MLP failure mode is *trying to ship V2 in V1 timelines* — the team builds 20 features at 60% quality instead of 7 features at 95% quality, and the launch reads as half-baked.

---

## Section 16 — Glossary

**What it contains.** Definitions for every product-specific term: Pane, Pack, Drop, Series, Set, Run, Serial, Low-Mint, Smashable Floor, Lampblack, Iceberg-2:1:8, Contraband, Translation-Cost, Apocrypha, Tier 0-4, Pierre-Menard, Tentpole Pane, Adjacent Pane, Foil Pane, Wildcard Pane, Prediction, Footnoter, Mosaic Test, Footnote Test, Prose-Signature Test.

**Why it is load-bearing.** Every team that joins the project, every contractor who writes a flavor line, every external auditor, and every fan-canon contributor needs a single canonical source for what each term means.

---

## Section 17 — Cross-Reference to the Lore Doctrine

**What it contains.** An index mapping each GDD section to the corresponding Lore Doctrine section.

**Why it is load-bearing.** The Lore Doctrine and the GDD are two halves of the same decision. The doctrine is the *what*; the GDD is the *how*. A team that reads only the doctrine ships a beautiful brief that doesn't run; a team that reads only the GDD ships a Top Shot reskin.

---

## Coverage check against external collectibles-GDD literature

| External GDD section | LoreVault GDD § | Coverage |
|---|---|---|
| Vision / executive summary | § 1 | Direct |
| Game pillars / design tenets | § 1 + § 17 | Distributed |
| Core gameplay loop | § 2 | Direct |
| Economy / monetization | § 3 | Direct |
| Card rarity & supply | § 4 | Direct |
| Set / collection structure | § 5 | Direct |
| Pack & booster mechanics | § 6 | Direct |
| Marketplace / trading | § 7 | Direct |
| Progression / leveling | § 8 | Direct |
| Quests / events | § 9 | Direct |
| Game modes / play surface | § 10 | Direct |
| Social / community | § 11 | Direct |
| Onboarding / FTUE | § 12 | Direct |
| Retention / live ops | § 13 | Direct |
| Tech / platform integration | § 14 | Direct |
| Roadmap / scope | § 15 | Direct |
| Glossary | § 16 | Direct |
| (LoreVault-specific) | § 17 | Cross-reference layer |

**Coverage rate:** 100% on external canon, plus a LoreVault-specific 17th section for the Lore Doctrine cross-reference.
