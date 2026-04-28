# Atlas Platform Spec — LoreVault Inheritance Map

**Run-tag:** `LV-MLP / Track A / Stage A.1`
**Date:** 2026-04-28
**Author:** Track-A scribe (LV-MLP orchestration)
**Function:** Inventory the Dapper Atlas platform primitives that LoreVault inherits, builds on top of, or negotiates around. Every primitive carries an explicit verdict — **Inherits** (use as-is), **Builds** (LoreVault constructs the layer), or **Negotiates** (a custom request to the Atlas team). The verdict is doctrine-bound to the LoreVault canon: cosmological-variant Panes, contraband economy, iceberg 2:1:8, Pierre-Menard cross-Pane variants, the participation-tier ladder.

This document is upstream of the Real GDD's § 14 "Atlas Integration Story" — every verdict here transfers there with the rationale rewritten in essay register.

---

## What "Atlas" is, in two paragraphs

Dapper Atlas is the platform substrate that powers NBA Top Shot, NFL ALL DAY, UFC Strike, Disney Pinnacle, and the new generation of Dapper-published collectible products. Its load-bearing primitives are: a custodial wallet with no seed-phrase requirement (Dapper Wallet), fiat on-ramps (Apple Pay, credit card, Dapper Balance, optionally USDC); a pack-mechanics service that handles drop scheduling, supply caps, queue management, and per-pack randomization; the Flow blockchain as the underlying ledger with Cadence as the smart-contract language; a secondary marketplace with listings, offers, royalties, and platform fees; user identity with KYC for high-value purchases; and a content-delivery layer for Moment imagery and video.

Atlas was extracted from Top Shot's first-generation infrastructure between 2022 and 2025 and now serves as the shared production substrate for any first-party Dapper collectible product. LoreVault is one such product. It does not need to rebuild the wallet, the on-ramps, the chain, the marketplace primitives, or the KYC layer. What it does need to build is everything that makes LoreVault a literary engine instead of a sports-collectible engine: Pane attribution, the Lampblack hierarchy, the iceberg-slow reveal, the contraband economy, the Pierre-Menard variant display, and the participation tier ladder. The verdict matrix below names which side of that line each primitive falls on.

---

## Primitive 1 — Custodial Wallet (Dapper Wallet)

**What it is.** Dapper Wallet is a custodial Flow wallet that abstracts away crypto-literacy. The user signs in with email and a password (and optional two-factor); the private keys for their Flow account are managed by Dapper. The user never sees a seed phrase, never installs a browser extension, and never pays gas in the interactive sense (gas is sponsored or absorbed by the platform). The wallet supports the FCL (Flow Client Library) auth flow, which means any Dapper-built dApp can request the user's wallet without the user managing their own keys.

**Why it matters for LoreVault.** Two-thirds of LoreVault's target audience — the Dracula Daily reader, the BookTok refugee, the Pratchett-discoverer — has no crypto-literacy and no appetite for acquiring any. The custodial wallet is what makes LoreVault a literary product instead of a niche crypto product. If the first interaction required a MetaMask install, we would lose 90% of the cohort at the door.

**LoreVault verdict: Inherits.** LoreVault uses Dapper Wallet as its identity primitive. The user creates an account with email plus password; under the hood, a Flow wallet is provisioned for them. The cards they collect are Cadence-issued NFTs in that wallet, but the user-facing surface never names the chain, the wallet, or the token standard. The LoreVault account is the wallet, and the wallet is the account.

---

## Primitive 2 — Fiat On-Ramps (Apple Pay, Credit Card, Dapper Balance)

**What it is.** Atlas provides three fiat purchase paths for primary and secondary marketplace transactions: Apple Pay (single-tap on iOS, single-tap on macOS Safari with Touch ID), credit card (full Stripe-style PCI-compliant flow with stored payment methods), and Dapper Balance (a stored-USD balance that the user can top up via ACH or wire and spend with no per-transaction fee). USDC is supported on the secondary marketplace for users who arrive crypto-native, but the median collector pays in USD via Apple Pay.

**Why it matters for LoreVault.** The friction between "I want this card" and "I own this card" is the conversion battleground. Apple Pay collapses that friction to a single tap. The contraband economy and the pack-drop ritual both rely on the conversion happening *fast enough that the desire and the possession are the same gesture*. A 20-second on-ramp would kill the FOMO mechanic; a one-tap on-ramp lets the FOMO mechanic do its work.

**LoreVault verdict: Inherits.** LoreVault uses Apple Pay as the primary purchase rail on iOS, credit card as the secondary rail on web, and Dapper Balance as the rail for high-frequency collectors who maintain a topped-up balance. No custom payment integration. The pack-purchase button reads "Open the Pane — \$9 with Apple Pay" and the next screen is the pack-rip animation.

---

## Primitive 3 — Flow Blockchain + Cadence Smart Contracts

**What it is.** Flow is a layer-1 blockchain designed by Dapper specifically for high-throughput consumer collectibles. Its smart-contract language, Cadence, is resource-oriented: an NFT in Cadence is not a key-value entry in a contract registry but a first-class linear-typed resource that can only exist in one account at a time. This eliminates a class of double-spend and re-entrancy bugs that plague EVM chains. Flow supports sub-second transaction finality at retail commerce scale (Top Shot has cleared >\$1B in lifetime sales on the chain).

**Why it matters for LoreVault.** Every LoreVault card is a Cadence resource. The provenance ledger — "this card passed through seven collectors before arriving here" — is a Cadence query, not a database lookup. The Pierre-Menard variant economy depends on cards being *the same Cadence resource* with different metadata, which Cadence supports natively via shared collection contracts with per-edition metadata fields.

**LoreVault verdict: Inherits.** LoreVault writes Cadence contracts for the LoreVault collection (one parent contract per Series; per-Pane child contracts for metadata namespacing) but does not run its own chain, sequencer, or settlement layer. The chain is invisible to the user. The Cadence contracts are visible only to the LoreVault production team, the on-chain auditors, and the secondary marketplace.

---

## Primitive 4 — Pack Mechanics Service

**What it is.** Atlas provides a pack-drop service that handles: drop scheduling (a pack goes live at a precise UTC timestamp), supply caps (a drop is hard-capped at N packs), queue management (when N collectors hit the buy button at T+0, the queue serializes them deterministically and assigns serials in queue order), per-pack randomization (the pack contents are revealed only after purchase, with the rarity distribution deterministic by drop spec), and sell-out handling (the queue closes the moment the last pack is allocated). This is the engine behind every Top Shot drop, every NFL ALL DAY drop, and the Disney Pinnacle drops.

**Why it matters for LoreVault.** The drop is the moment of first possession. Atlas handles the queue, the supply cap, the randomization, and the failure cases (network drop, payment failure, queue timeout). LoreVault adds the *ritual* on top — the iceberg-slow reveal, the silhouette-glance flash, the Lampblack-hierarchy frame — but the underlying allocation engine is Atlas's. We do not rebuild it.

**LoreVault verdict: Inherits + Negotiates.** LoreVault uses the Atlas pack service for drop scheduling, queue management, and supply-cap enforcement. It *negotiates* with the Atlas team for two custom hooks: (a) per-pack reveal pacing (Top Shot reveals all Moments in a pack in sub-1s; LoreVault wants the reveal to slow down on Legendary, with a 2-3 second pause before the card flips, because the Mirrlees iceberg-slow reveal is a load-bearing emotional beat); (b) silhouette-precedence (the silhouette renders before the full card art at the 0.4-second glance, then dissolves into full card; this requires a two-stage asset pipeline at reveal time).

---

## Primitive 5 — Secondary Marketplace (Listings, Offers, Royalties)

**What it is.** Atlas runs a fully managed secondary marketplace. Sellers list cards at an ask price (in USD); buyers either hit the ask (instant buy at floor) or place an offer (a bid the seller can accept, counter, or reject). The marketplace tracks floor price (lowest current ask per card), volume (24h, 7d, 30d), and last-sale price. Total take rate on Top Shot is 5% (split: 2.5% Dapper platform, 2.5% to NBA + Players Association as the IP rights holder). On NFL ALL DAY, the total is 5% with the split going to Dapper + the NFL.

**Why it matters for LoreVault.** Secondary liquidity is the long-game economic engine. Primary drops are the spike; secondary is the sustained heart-rate. The Smashable Floor primitive (a buyer can hit the lowest current ask to instantly own a card) is the mechanic that lets a Tier-1 collector complete a set in one session. The Pierre-Menard high-rarity cross-Pane variant economy requires the marketplace to render Pane-attribution clearly so a buyer can browse "all Holmes-gesture variants across active Panes" and see them as a triptych, not as three unrelated listings.

**LoreVault verdict: Inherits + Negotiates.** LoreVault uses the Atlas marketplace primitives (listing, offer, floor, royalty) with the standard 5% take rate split (LoreVault treasury 2.5%, IP-rights-holder share 2.5% for any third-party-licensed Pane content; for fully original LoreVault Panes the full 5% goes to LoreVault treasury, of which a portion is set aside for the Tier-3+ contributor pool per the participation architecture). It *negotiates* with the Atlas team for: (a) Pane-attribution as a first-class filter in the marketplace UI (not just a metadata tag in a tooltip); (b) translation-scar rendering in the marketplace card frame for cross-Pane variants — a visible diff between two Holmes cards in different Panes shown in the listing thumbnail; (c) contraband-rare badging — a small visual marker on cards that hold the structural-contraband role of a Pane, surfaced in the marketplace and reflected in the floor-price discovery UI.

---

## Primitive 6 — Leaderboards + Showcase

**What it is.** Atlas provides a leaderboard service used by Top Shot for the Cadence Score / Collector Score system: cards in a collection are valued by an internal scoring formula (rarity weight × serial-number prestige × set-completion bonus), the score is tallied per collector, and collectors are ranked publicly. Showcases are user-curated displays of N selected Moments rendered as a public profile page. Top Shot uses these heavily; ALL DAY uses them less.

**Why it matters for LoreVault.** Leaderboards are a known retention primitive — they convert a passive collection into a positional asset. The risk for LoreVault is that a literal port of the Top Shot leaderboard would push collectors toward portfolio-value-maximization (buy the cheapest path to set completion) and away from the literary-engagement loop (read the iceberg, find the contraband, contribute flavor lines). The literary product wants different leaderboard semantics: not portfolio dollar value but Pane-mastery completeness, contraband-hunting completeness, and contributor-tier rank.

**LoreVault verdict: Builds.** LoreVault constructs its own leaderboard semantics on top of the raw collection-data the Atlas service exposes. The "leaderboard" displayed to the user is not a dollar-value rank; it is a Pane-mastery rank ("you have collected 7 of 12 Lud-Border cards, ranking 142nd in Lud-Border mastery"), a contraband-hunter rank ("you have collected 3 of 5 active Pane contraband cards, ranking 87th"), and a contributor rank for Tier-3+ users ("4 of your flavor lines are in canon, ranking 19th in Lud-Border voice contribution"). The Atlas leaderboard service is used as the underlying tally mechanism; the surfaces and semantics are LoreVault's.

---

## Primitive 7 — User Identity + KYC

**What it is.** Atlas handles user identity (email, password, two-factor) and KYC for high-value transactions (purchases above the Travel-Rule threshold, currently \$1000/transaction in the US). KYC verification is performed by a third-party provider and the verified-status flag is propagated back to the wallet. Below the KYC threshold, a user can transact with email-only identity. Above it, full KYC (government ID, proof of address) is required before the transaction clears.

**Why it matters for LoreVault.** The five-screen onboarding ceiling depends on no-KYC entry. A first-pack purchase at \$9 is well below any threshold, so the user goes from landing page to opened-pack in five screens with no government ID prompt. The KYC layer kicks in only when the user moves into Tier-2+ behavior (high-value secondary purchases, contributor payouts). At that point the friction is acceptable because the user has already crossed the engagement threshold.

**LoreVault verdict: Inherits.** LoreVault uses the Atlas identity layer wholesale. Email + password for entry; two-factor on first marketplace transaction; KYC triggered automatically at the Travel-Rule threshold or at Tier-3 contributor onboarding (whichever comes first).

---

## Primitive 8 — Content Delivery Network

**What it is.** Atlas runs a CDN for collectible imagery and video. Top Shot's Moments (highlight clips at 1080p, ~5-15MB each) are served from this CDN with regional edge caching. The CDN supports per-request resizing (cdn-cgi/image proxy) for thumbnails, hero crops, and silhouette renders.

**Why it matters for LoreVault.** LoreVault's hero asset is not a video clip — it is a FLUX-Pro 1.1 painted card render at 2:3 aspect, plus a silhouette render at the same aspect (the silhouette-glance is the 0.4-second first-encounter asset per the 95/5 rule). The card detail page also surfaces a gesture-detail close-up. So three assets per card: silhouette, hero, gesture-detail. With ~120 cards across 5 active Panes in Series 1, that is ~360 assets. The CDN handles delivery and resizing.

**LoreVault verdict: Inherits.** LoreVault uses the Atlas CDN for asset delivery with no custom layer. The asset pipeline (FLUX render → manifest → CDN upload) is Track-D's job; the delivery is Atlas's.

---

## Primitive 9 — Quests / Daily Challenge Engine

**What it is.** Atlas provides a quest service that issues daily and weekly tasks to users, tracks task completion, and grants rewards (XP, pack credits, exclusive cards). Top Shot uses this for "Buy a Moment from the Lakers set" / "Open 3 packs this week" / "List a Common Moment for sale." The reward layer is tightly coupled to the storefront — completed quests grant pack credits redeemable in the rotating storefront.

**Why it matters for LoreVault.** The challenge layer is a return-visit primitive. LoreVault wants challenges that route the collector through Pane-mastery, contraband-hunting, and Lampblack-hierarchy completion — semantically different from Top Shot's team-and-set-based quests. The underlying mechanism (issue task, track completion, grant reward) is the same; the *surface vocabulary* is different.

**LoreVault verdict: Inherits + Builds.** LoreVault uses the Atlas quest engine as the task-tracking substrate but defines its own task templates and reward types. Task templates: Pane-completion ("collect 3 cards from the Lud-Border Set"), contraband-hunt ("find the contraband card in any active Pane"), Pierre-Menard ("collect Holmes from three different Pane attributions"), Lampblack-mastery ("collect all 7 Lampblack-hierarchy positions in a single Pane"). Reward types: pack credits (Atlas-native), exclusive Common cards (LoreVault-issued), Pane-mastery badges (LoreVault-displayed only).

---

## Primitive 10 — Showcase / Profile Page

**What it is.** Atlas provides a public-profile primitive: a user-curated Showcase displays N selected cards from the collection, with a follower-count, a recent-activity ledger (last 10 transactions), and a follow-button. Top Shot's Showcase pages are the most-shared social surface on the platform.

**Why it matters for LoreVault.** The Showcase is the wall — a curator-self-portrait built from cards. For a literary product, the Showcase is also the contributor-credit surface: a Tier-3 collector whose flavor-lines are in canon should see their canon credits surfaced on their Showcase, not buried in a sub-tab.

**LoreVault verdict: Inherits + Builds.** Atlas provides the underlying display primitive; LoreVault adds a contributor-credit row and a Pane-mastery badge row to the surface. Custom UI, shared backend.

---

## Verdict matrix — summary

| # | Primitive | Verdict | Build cost on LoreVault side |
|---|---|---|---|
| 1 | Custodial wallet (Dapper Wallet) | **Inherits** | None — direct integration via FCL |
| 2 | Fiat on-ramps (Apple Pay / CC / Balance) | **Inherits** | None — standard SDK integration |
| 3 | Flow blockchain + Cadence | **Inherits** | Cadence contracts for LoreVault collection only |
| 4 | Pack mechanics service | **Inherits + Negotiates** | Custom reveal pacing hook + silhouette-precedence asset pipeline |
| 5 | Secondary marketplace | **Inherits + Negotiates** | Pane-attribution filter, translation-scar rendering, contraband badging |
| 6 | Leaderboards | **Builds** | Custom semantics — Pane-mastery, contraband-hunt, contributor rank |
| 7 | User identity + KYC | **Inherits** | None |
| 8 | Content delivery network | **Inherits** | Asset pipeline (Track D) |
| 9 | Quest / daily challenge engine | **Inherits + Builds** | Custom task templates and reward types |
| 10 | Showcase / profile | **Inherits + Builds** | Contributor-credit row, Pane-mastery row |

**Net inheritance:** ~75% of the platform stack is direct inheritance (wallet, on-ramps, chain, KYC, CDN). ~15% is inheritance with negotiated custom hooks (pack mechanics, marketplace). ~10% is full LoreVault build (leaderboard semantics, custom quest templates, showcase contributor surface). This is the correct ratio: a LoreVault that built more of the stack would be a smaller, slower, more brittle product; a LoreVault that built less would be a Top Shot reskin with literary names painted on, which is precisely the V1 trap the V2 doctrine was built to escape.

---

## What LoreVault still needs from the Atlas team (negotiation list)

1. **Per-pack reveal pacing hook.** The reveal animation timeline must be configurable per-rarity. Top Shot's default is a uniform fast reveal; LoreVault needs Legendary to slow and pause. Estimated: a single config field in the drop spec, exposed via the existing pack-mechanics admin surface.

2. **Silhouette-precedence asset pipeline.** The 0.4-second silhouette-glance is a load-bearing surface. The asset pipeline must support a two-stage reveal: silhouette renders first, full card crossfades in over 1.5 seconds. This requires the manifest to carry both `silhouette_url` and `hero_url` and the reveal client to honor the staging.

3. **Pane-attribution as a first-class marketplace facet.** Not a tooltip, not a hidden metadata field. A persistent left-rail filter and a card-frame badge. Cross-Pane Pierre-Menard variants render as a triptych in the discovery surface.

4. **Translation-scar rendering.** When two cards share gesture but differ in Pane, the marketplace card frame visibly diffs them — a small overlay marker in the corner, a subtle palette shift in the card-frame chrome, a translation-cost badge below the rarity. The marketplace API must expose the cross-Pane sibling-card relationship to render this.

5. **Contraband badging.** The cards that hold the structural-contraband role of a Pane carry a small visual marker (a Mirrlees-fairy-fruit glyph; a Lud-Border seal). The marketplace must render the badge alongside the rarity.

6. **Custom leaderboard semantics support.** The Atlas leaderboard service must accept a custom scoring formula at the product level. LoreVault's formula is not portfolio-dollar-weighted; it is Pane-mastery + contraband-hunt + contributor-rank weighted. Either the service supports pluggable formulas, or LoreVault runs its own tally job and writes scores back via the Atlas score-write API.

The negotiation list is small. None of it is architecturally novel for the Atlas team; all of it is doctrine-bound for LoreVault. The Atlas team's incremental cost is in the low single-digit engineer-weeks. The LoreVault doctrine's cost of *not* getting these is the difference between a literary engine and a Top Shot reskin.
