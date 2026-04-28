# NBA Top Shot Mechanics Canon — LoreVault Adoption Map

**Run-tag:** `LV-MLP / Track A / Stage A.2`
**Date:** 2026-04-28
**Author:** Track-A scribe
**Function:** Document the load-bearing mechanics of NBA Top Shot at the level of specifics — supply bands, reveal timing, fee structure, quest templates, leaderboard semantics — and issue an explicit verdict per mechanic for LoreVault: **Adopt** (carry over directly), **Adapt** (carry the bone, change the muscle), or **Reject** (the mechanic is wrong for a literary engine and we deliberately depart). Each verdict is doctrine-bound: the rationale must connect to the cosmological-variant-Pane / Lampblack / iceberg / contraband / participation-tier canon.

This document is upstream of the Real GDD's §§ 4-9 (Rarity, Pack Mechanics, Marketplace, Progression, Challenges) — every verdict here transfers there with the rationale rewritten in essay register.

---

## Mechanic 1 — Pack Mechanics: Wave Drops, Rarity Tiers, FOMO

**How Top Shot does it.** Drops are scheduled wave-style: one or two large drops per week, one large monthly tentpole, plus weekly and daily rotating-storefront packs. Pack tiers map to rarity bands with public mint counts:

- **Common** — edition sizes 12,000–60,000 (per Moment within a Common pack)
- **Fandom** — edition sizes 4,000–12,000 (a tier between Common and Rare introduced in 2022)
- **Rare** — edition sizes 999–4,000
- **Legendary** — edition sizes 49–199
- **Ultimate** — edition sizes 1–25 (rarely shipped; reserved for tentpole moments)

FOMO is engineered through a four-state cadence the storefront loop calls SNKRS-style: Mystery (drop is announced, art is teased, no purchase yet), Revealed (countdown live, "Reserve your spot" with embedded countdown in CTA), Live (purchase queue is open, queue position visible, supply ticker counting down), Ripped (sold out, "GOT'EM" pulsing gold for buyers, "Sold out · next drop in Xd" forward-momentum copy for non-buyers). Pack price ranges \$9 (Standard) to \$229 (Premium) to \$999+ (Case-level whale tier).

**LoreVault verdict: Adapt.** The wave-drop cadence and four-state machine are correct — the Mystery→Revealed→Live→Ripped sequence creates the ritual of first possession, which is the moment the Lampblack hierarchy becomes visible to the collector. We adopt the four-state machine wholesale. We adapt the rarity bands to fit the LoreVault rarity grammar:

- **Common** — edition sizes 5,000–15,000 (LoreVault doesn't need 60,000-edition Commons because the collection's literary register can't support that scale)
- **Rare** — edition sizes 500–2,000
- **Legendary** — edition sizes 50–199
- **Contraband-Rare** — edition sizes 1–25 (the structural-contraband cards of each Pane)
- **Pierre-Menard Unique** — edition sizes 1-of-1 per Pane variant (the same card text shipped across N Panes, one of each, making N total unique Pierre-Menard editions)

The release ritual serves the Lampblack hierarchy by creating the first-encounter moment with the silhouette before the full card resolves — Top Shot's reveal lands in sub-1s; LoreVault's reveal pauses on Legendary and Contraband-Rare for 2-3 seconds with the silhouette held first, the iceberg-slow Mirrlees beat we negotiated with Atlas in primitive 4.

---

## Mechanic 2 — Set / Series / Run Hierarchy

**How Top Shot does it.** Series is the seasonal envelope (Series 1 = 2020-21, Series 2 = 2021-22, Series 3 = 2022-23, etc.). Within a Series, Sets are thematic releases — Base Set, Metallic Gold LE, Throwdowns, Holo MMXX, Hustle and Show, Run It Back. Within a Set, Runs are supply-band buckets: Common Run = the high-edition cards in a Set, Rare Run = the mid-edition cards, Legendary Run = the lowest-edition cards. Serial numbers are publicly visible; #1, #jersey-number (#23 for a LeBron, #30 for a Curry), and #999 (last serial in a 999-edition Rare) carry premium prestige independent of the card itself. The "low-mint" market — buyers chasing #1-50 of any Rare or Legendary — is a parallel economy operating on top of the rarity-tier economy.

**LoreVault verdict: Adapt.** The Series → Set → Run hierarchy is correct as a publishing rhythm. We adapt it to the cosmological-variant-Pane substrate:

- **Series** is a 6-month publishing arc with 3-5 active Panes (one Tentpole, two Adjacent, one Foil, optionally one Wildcard). This is the doctrine's mapping from § 7 of the OPUS-THIRD-VOICE: "3 to 5 Panes per Series."
- **Set** is a complete card list within a Pane — 12-30 cards depending on Pane archetype. A Pane has 3-5 Sets across its life, drip-fed over 12-24 months.
- **Run** is a supply-band bucket within a Set: Common Run, Rare Run, Legendary Run, Contraband-Rare Run.
- **Serial** is publicly visible in the same way Top Shot's serials are. Low-mint prestige (#1, #7, #N where N matches a Pane-significant number) carries premium.

The departure: a Top Shot Set is "thematic" (Throwdowns = dunks, Hustle and Show = effort plays); a LoreVault Set is *Pane-grammatical*. The Lud-Border-Pane "Customs House" Set = cards about the border-bureaucracy of contraband. The Lud-Border-Pane "Faerie-Fruit" Set = cards about the contraband itself. The Set is a thematic angle on the Pane's grammar, not a topic-cluster.

---

## Mechanic 3 — Marketplace UX (Listings, Offers, Floor, Smashable Floor)

**How Top Shot does it.** A Moment listing has an ask price (in USD); the marketplace surfaces the floor (lowest current ask), the last-sale price, the 24h volume, and a price-history chart. Offers are bids any buyer can place on any Moment in the system; the seller can accept, counter, or reject. The "Smashable Floor" is informal terminology — a buyer who wants instant ownership hits the lowest current ask (smashes the floor); the floor card is liquid because it is the unambiguously cheapest path to set completion. Floor cards are bought/sold rapidly by completion-grinders and arbitrage flippers.

**How fees work.** Total take rate is 5% of the secondary sale price. Split: 2.5% Dapper platform fee, 2.5% to the IP-rights-holder (NBA + Players Association). This is below most NFT marketplace take rates (OpenSea charges 2.5% platform + variable creator royalty; Magic Eden similar). Royalties are enforced at the contract level on Top Shot — every secondary sale routes through the official marketplace and pays the royalty. There is no royalty-skipping path because the cards are non-transferable outside the official marketplace (a deliberate, controversial choice that protects the royalty stream and the platform's cut).

**LoreVault verdict: Adopt + Adapt.** The marketplace primitives (listing, offer, floor, last-sale, Smashable Floor) are correct — they are how a digital collectible product breathes. We adopt them. We adapt three things:

- **Pane-attribution as a first-class filter.** The marketplace must let a buyer browse "all Lud-Border cards" or "all Holmes cards across active Panes" with one click — not buried in a tag tooltip. The Pierre-Menard cross-Pane discovery experience requires Pane to be a primary axis of navigation.
- **Translation-scar rendering on cross-Pane variants.** When a buyer is browsing Holmes-gesture cards, the listing thumbnail shows a small palette diff or punctuation-scar badge that signals "this is the same gesture in a different Pane." The translation-cost is visible in the listing chrome, not just in the detail page.
- **Contraband-rare market badging.** The structural-contraband cards of each Pane carry a small visual marker on the listing thumbnail (a fairy-fruit glyph for Lud-Border, an unwritten-sentence glyph for Sinterklaas-Reigns). These cards command a premium on the secondary because they carry the cosmological leak; the badge signals the semantic load to a buyer who hasn't read the deep-iceberg text.

The fee structure (5% total take rate) is adopted with the IP-rights-holder split going to one of two destinations: (a) for fully original LoreVault Panes, the 2.5% IP share goes to the LoreVault treasury, with a portion ringfenced for the Tier-3+ contributor pool per the participation-architecture doctrine; (b) for any Pane that licenses third-party content (a possibility for late-stage Series), the 2.5% goes to the licensor.

---

## Mechanic 4 — Quests (Daily / Weekly / Seasonal Tasks)

**How Top Shot does it.** The quest engine issues daily and weekly tasks. Examples: "Buy a Moment from the Lakers set," "Open 3 packs this week," "List a Common Moment for sale," "Complete the Throwdowns Set," "Pull a Legendary in the next pack." Reward types include XP (a leaderboard score), pack credits (redeemable in the storefront), and exclusive Moments (issued to quest completers only). Quest cadence is daily reset + weekly reset + occasional seasonal challenge windows. The quest module is a return-visit primitive: the storefront LEARNINGS file documents that quests + Battle Pass produced a +8.0 cycle delta because they convert browsing into intent ("you are 4 ranks from a Rare Airdrop").

**LoreVault verdict: Adapt.** The quest engine is correct as a return-visit primitive. We adopt the cadence (daily + weekly + seasonal) and the reward types (XP, pack credits, exclusive cards). We adapt the *task vocabulary* to fit the LoreVault grammar:

- **Daily challenge:** "Buy any card from any active Pane." Reward: 1 pack credit + XP.
- **Weekly challenge:** "Complete any Set of 3+ cards within a Pane." Reward: a Rare pack drawn from a different active Pane (cross-Pane traversal incentive).
- **Seasonal challenge:** "Collect the contraband card from each active Pane in this Series." Reward: a limited Legendary commemorative card.
- **Set-completion challenge:** "Collect every card in a named Set." Reward: a set-completion badge + an exclusive Pane-attributed card.
- **Cross-Pane challenge:** "Collect one Holmes card from three different Pane attributions." This is the Pierre-Menard challenge and it is doctrine-load-bearing — the reward is a Pierre-Menard recognition badge plus the Pierre-Menard variant-walkthrough unlock on the user's profile.
- **Contraband-hunt challenge:** "Find the contraband in every active Pane." Reward: a contraband-hunter badge plus an exclusive Contraband-Rare card.
- **Lampblack challenge:** "Collect all 7 Lampblack-hierarchy positions represented in a single Pane." This is the doctrine-deepest challenge and unlocks the deepest-iceberg layer for that Pane on the user's account.

The challenges route the collector through the doctrine. They are not gamification glued onto a collecting product; they are how the doctrine teaches itself.

---

## Mechanic 5 — Predictions / Picks (Collectibles as Game Tokens)

**How Top Shot does it.** Top Shot Predictions is a feature where collectors stake Moments on real-world game outcomes. Example: stake a Lakers Moment on "the Lakers will win tonight"; if correct, the Moment earns a "winner" overlay and an XP boost; if incorrect, no penalty (or a small XP debit, depending on configuration). The mechanic converts collectibles into game tokens — the cards do double-duty as collection objects and as betting chips. The implementation is mechanically simple (low-complexity engineering); the integration with collecting behavior is high (you already have the Moments).

**LoreVault verdict: Adapt — and this is the MLP pick for "games with collectibles."** Predictions adapt directly to the cosmological-variant-Pane substrate. The narrative event becomes a *cross-Pane axiom-conflict*: two Panes are placed in narrative opposition for a week (Old-Ones-Persist vs Sinterklaas-Reigns: "does cosmic horror or moral ledger survive the eclipse?"); collectors stake their Pane's cards on the outcome; the winning Pane's cards gain a *narrative-scar* marker, a small permanent overlay in the card frame indicating they survived the conflict; the losing Pane's cards remain unchanged (no penalty, the doctrinal claim is that no Pane is destroyed by another — they cohabitate incommensurably).

Why this is the MLP pick: lowest build complexity (the engine is the existing pack-stake-resolve loop), direct integration with collecting behavior (you already own the cards), creates narrative stakes around Pane identity (winning the conflict means your Pane's cosmology held under pressure), drives secondary market for the winning Pane (narrative-scar cards become collectible in their own right). All four properties fit the literary-engine doctrine cleanly.

---

## Mechanic 6 — Spotlight (Featured Moment / Curator Role)

**How Top Shot does it.** Spotlight is a curated feature surface — a single Moment elevated to feature-status with an editorial framing (often a press-release-style write-up of the player, the play, or the historical context). Spotlight mixes editorial curation with algorithmic surfacing (recently-traded, newly-listed, low-mint sales). The role of the Spotlight curator is held by Top Shot editorial.

**LoreVault verdict: Adapt.** A Spotlight surface is correct as a discovery primitive but the curator vocabulary is wrong. LoreVault's Spotlight is the **Footnoter's Letter** — a weekly editorial write-up by the Footnoter persona (a Pratchett-grade narrator, Discworld-bibliography register, defined in the V1 wiki) elevating one card per week. The card is chosen because it metabolizes a buried-weight thread, not because it is rare or expensive. The Spotlight slot is the editorial layer of the literary engine, not the merchandising layer.

---

## Mechanic 7 — Showcases + Profile Page

**How Top Shot does it.** A Showcase is a user-curated public profile displaying N selected Moments (typically 5-20) with a layout (grid, single-feature, set-themed). Followers, recent-activity ledger, and badge displays appear on the same page. Showcases drive social proof — "this collector owns the rare X" — and are the most-shared social surface on the platform. The follower mechanic is one-directional (user A follows user B's collection); follows trigger a feed entry on B's transactions.

**LoreVault verdict: Adopt + Adapt.** The Showcase primitive is correct. We adopt the layout primitives (grid, single-feature, Set-themed). We adapt three things:

- **Pane-organization mode.** A Showcase can be organized by Pane (cards grouped by their Pane-attribution) or free-form. The Pane-organization mode is the default for a literary collector.
- **Contributor-credit row.** Tier-3+ contributors who have flavor-lines accepted into canon see a row on their Showcase listing the cards their lines appear on. This is the literary-product surface for contributor-as-creator.
- **Provenance ledger as narrative.** The recent-activity feed reads not as a transaction list but as a provenance ledger: "This card passed through seven collectors before arriving here. The first owner kept it for 14 minutes. The fourth owner held it for nine months."

The follower mechanic is adopted directly.

---

## Mechanic 8 — Leaderboards (What They Measure)

**How Top Shot does it.** The Top Shot leaderboard ranks collectors on Cadence Score (an internal scoring formula combining rarity weight × serial-prestige × set-completion bonus × portfolio-value-weighted factors). It is updated daily. Top-ranked collectors get a public profile flag and occasional editorial mention. The cadence is the day; the prizes are mostly social proof rather than direct economic reward.

**LoreVault verdict: Reject — and rebuild.** The Top Shot leaderboard is portfolio-value-weighted. For a literary engine, that is the wrong objective function. A LoreVault collector who buys the cheapest path to set completion should *not* outrank a collector who has hunted the contraband across three Panes. The leaderboard semantics must reflect the doctrine, not the dollar value.

LoreVault's leaderboards (plural — multiple semantically-distinct rankings, not one ranking):

- **Pane Mastery** — per Pane: % completion of the Pane's card list, ranked. The collector who has 11 of 12 Lud-Border cards ranks higher than the collector who has 11 of 60 Common-pack-yield cards.
- **Contraband Hunter** — % of active-Pane contraband cards collected, ranked.
- **Pierre-Menard Recognizer** — number of Pierre-Menard variant-triplets completed, ranked.
- **Lampblack Reader** — for Tier-2+ users only: number of buried-iceberg layers unlocked across owned cards, ranked.
- **Contributor Rank** — for Tier-3+ users only: number of canon-accepted flavor lines, ranked.

The departure from Top Shot is doctrine-load-bearing: a leaderboard that rewards portfolio value pulls collectors toward dollar-maximization; a leaderboard that rewards Pane-mastery and contraband-hunting pulls collectors toward the doctrine. The product gets the behavior the leaderboard rewards. This is one of the few mechanics where LoreVault must explicitly depart from Top Shot, not adapt around the edges.

---

## Mechanic 9 — Wallet Onboarding (Custodial Flow + Apple Pay)

**How Top Shot does it.** Email + password account creation. Dapper Wallet provisioned silently on the backend. Apple Pay or credit-card on-ramp at first purchase. KYC required only at high-value secondary transactions. Total time from "I want a pack" to "pack opened" is under 90 seconds for a first-time iOS user.

**LoreVault verdict: Adopt.** This is exactly the right onboarding cadence for a literary-collectible product. The five-screen onboarding ceiling depends on the no-seed-phrase no-MetaMask no-KYC entry path. We do not deviate. The custodial wallet is what makes LoreVault a literary product instead of a niche crypto product.

The single LoreVault adaptation is on what *content* fills the five screens — see § 12 of the Real GDD for the screen-by-screen.

---

## Mechanic 10 — Secondary Fee Structure (Royalty / Platform Fee / Total Take Rate)

**How Top Shot does it.** Total take rate on secondary: 5%. Split: 2.5% Dapper platform, 2.5% IP-rights-holder. Royalty enforced at contract level (no royalty-skipping path because the cards do not transfer outside the official marketplace). Primary pack revenue split: ~5-10% goes to the IP-rights-holder, the remainder is Dapper revenue (covers production, art, platform, and margin).

**LoreVault verdict: Adopt with one adaptation.** Total take rate of 5% on secondary is the right number — high enough to fund a contributor pool and IP costs, low enough that flippers and arbitrageurs continue to provide liquidity. The Top Shot fee structure is well-calibrated to retail-collectible behavior; we should not invent our own number.

The one adaptation: the "IP-rights-holder" share. For fully original LoreVault Panes (no third-party licensed content), the 2.5% IP share is allocated as: 1.5% to LoreVault treasury (covers art, prose, platform engineering), 1.0% to the **Contributor Pool** — a ringfenced fund that pays Tier-3+ canon contributors when their flavor lines or contraband proposals are accepted into canon. The Contributor Pool is a doctrine-load-bearing primitive: it is the economic engine of the participation-architecture's Tier 3 and Tier 4. Without it, contribution is unpaid emotional labor; with it, contribution is a real path to revenue share.

For any Pane that licenses third-party content (a Sherlock-licensed Pane in a hypothetical late-Series collaboration), the standard 2.5% IP share goes to the licensor and the contributor pool is funded only from the LoreVault-original Panes.

---

## Verdict matrix — summary

| # | Mechanic | Verdict | Rationale (one sentence) |
|---|---|---|---|
| 1 | Pack mechanics + rarity tiers + FOMO | **Adapt** | Adopt the four-state machine; adapt edition sizes to literary scale; add Contraband-Rare and Pierre-Menard Unique tiers |
| 2 | Set / Series / Run hierarchy | **Adapt** | Adopt the publishing rhythm; map to Pane-grammatical Sets instead of topic-cluster Sets |
| 3 | Marketplace UX (listings / offers / floor) | **Adopt + Adapt** | Adopt all primitives; add Pane-attribution filter, translation-scar rendering, contraband badging |
| 4 | Quests | **Adapt** | Adopt the cadence and reward types; rewrite the task vocabulary in doctrine grammar (Pane-completion, contraband-hunt, Pierre-Menard) |
| 5 | Predictions / Picks | **Adapt — MLP pick for games-with-collectibles** | Adapt to cross-Pane axiom-conflict events; narrative-scar marker on winning Pane's cards |
| 6 | Spotlight | **Adapt** | Replace editorial curation with the Footnoter's Letter weekly write-up |
| 7 | Showcases + profile | **Adopt + Adapt** | Adopt layout primitives; add Pane-organization mode, contributor-credit row, provenance-as-narrative |
| 8 | Leaderboards | **Reject — rebuild** | Top Shot's portfolio-value semantics are wrong for a literary engine; build Pane-Mastery, Contraband-Hunter, Pierre-Menard, Lampblack-Reader, Contributor leaderboards |
| 9 | Wallet onboarding (custodial + Apple Pay) | **Adopt** | The five-screen ceiling depends on this path; do not deviate |
| 10 | Secondary fee structure | **Adopt + Adapt** | Adopt 5% total take; adapt the IP-rights-holder split to fund a Contributor Pool for original Panes |

**Net pattern:** Adopt 4, Adapt 5, Reject + rebuild 1. The ratio is correct: Top Shot is the right substrate for the *commercial* layer (drops, marketplace, fees, wallet) and the wrong substrate for the *literary* layer (leaderboard semantics, quest vocabulary, spotlight curation). LoreVault inherits commerce, builds literature.

---

## What this means for the Real GDD

Every mechanic verdict feeds into a specific GDD section:

- §§ 4 and 6 (Rarity, Pack Mechanics) carry forward Mechanic 1 (Adapt) and the Contraband-Rare + Pierre-Menard Unique tiers.
- § 5 (Sets, Series, Panes) carries forward Mechanic 2 (Adapt) — Series → Pane → Set → Run hierarchy.
- § 7 (Marketplace) carries forward Mechanic 3 + Mechanic 10 — listing/offer/floor primitives, Pane-attribution filter, Smashable Floor, fee structure, contributor pool.
- § 8 (Progression) carries forward Mechanic 8 (Reject + rebuild) — five LoreVault-specific leaderboards.
- § 9 (Challenges) carries forward Mechanic 4 (Adapt) — daily/weekly/seasonal tasks in doctrine vocabulary.
- § 10 (Games with Collectibles) carries forward Mechanic 5 (Adapt) — Predictions as the cross-Pane axiom-conflict event, the MLP pick.
- § 11 (Social Surface) carries forward Mechanic 6 (Spotlight as Footnoter's Letter) and Mechanic 7 (Showcases with contributor-credit row).
- § 12 (Onboarding) carries forward Mechanic 9 (Adopt) — custodial wallet, Apple Pay, no-friction first-pack purchase.

Every mechanic has a home. No mechanic is dropped on the floor. No mechanic is adopted unconditionally without a doctrine-bound rationale.
