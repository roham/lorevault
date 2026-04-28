# LoreVault MLP — Spec (Stage C.1)

**Run-tag:** `LV-MLP TRACK-C`
**Date:** 2026-04-28
**Source canon:** `_doctrine.json` (GDD V2), Universe Research Bundle (2026-04-25), GAME-LOOP-PROGRESSION-SPEC, Master-Synthesis Parts 1–3.
**Frigga dossier status:** not yet landed at poll time. Boundary synthesized from doctrine + prior research per the orchestration plan's fallback clause. Re-verify against `frigga-dossier.md` §9 once it lands.

## Definition

**MLP = sharp, lovable minimum collecting experience.** Not feature soup. Not "everything dimmed by half." A clean, rich, lovable minimum that delivers the seven load-bearing collecting acts. Every other experience surface is deferred — but ARCHITECTED into the navigation as visible-but-locked, so collectors know the rabbit hole goes deeper.

## The seven MLP features (locked)

### Feature 1 — Pack opening + reveal ritual

**Why it's load-bearing.** The pack-open is the fundamental collecting act. Every other feature in the MLP reduces to "you have cards in your wallet." Without the pack-open, there is no collection, no set, no marketplace, no challenge, no game.

**User story.** A new collector, on their first visit, taps a sealed pack from the Pane they chose. The pack opens with a paced reveal — wax cracks, paper splits, three cards fan out one at a time. The third card is a guaranteed Rare+ pull from the chosen Pane. The collector reads the surface flavor; the silhouette-glance promise lands; one card is *theirs*.

**Atlas integration point.** On account creation (or guest session), a starter pack is provisioned to a Dapper-custodial wallet. No crypto knowledge required. The pack is on-chain; the open is a transaction signed by the custody layer; the cards land in the wallet under the user's account. Pack metadata: pane_id, rarity_distribution, edition_size.

**Success metric.** ≥85% of new sessions complete the pack-open within 90 seconds of arrival on `/v3/mlp/start`.

**Emotional beat.** The first card feels like *yours* within three minutes. The reveal is paced enough that the rare card lands as an event, not an inventory-add.

### Feature 2 — Taste onboarding (Pane selection)

**Why it's load-bearing.** Netflix-shape personalization from one signal. Doctrine §4 calls for "single recognition" not a quiz. Pane choice on screen 1 is the only signal we need — every subsequent surface (vault, sets, drops, challenges, market) inherits the chosen Pane as default filter.

**User story.** Visitor lands on `/v3/mlp`, sees three Panes (axiom + silhouette card per Pane). Taps one. Five-screen onboarding starts; pack is sealed in screen 2; opened in screen 3; iceberg revealed in screen 4; set tracker shown in screen 5. Five-screen ceiling enforced.

**Atlas integration point.** Pane choice persisted to user profile (Dapper user object); becomes the default filter on every subsequent route until the collector explicitly changes it.

**Success metric.** ≥80% of visitors who tap a Pane on screen 1 reach screen 5; ≤5% drop between any two screens.

**Emotional beat.** The personalization happens before the explanation. The collector feels the game is ABOUT something before reading a word of copy.

### Feature 3 — Set completion tracker

**Why it's load-bearing.** The set tracker is what makes a collection a *project* not a pile. Without "you have 1 of 12," a card is an artifact; with it, a card is a step.

**User story.** Collector lands on `/v3/mlp/sets`. Sees their started set: "Lud-Border Starter — 1 of 12." Progress bar fills the Pane color. The 11 missing cards show as silhouettes with floor-prices. CTA: "Get missing card" → marketplace listing for the cheapest available.

**Atlas integration point.** Reads on-chain holdings via Dapper custodial wallet. Reads marketplace floor-price via Atlas secondary market API. Joins the two locally to compute "completion cost."

**Success metric.** ≥40% of collectors who complete onboarding visit `/v3/mlp/sets` within 24 hours.

**Emotional beat.** Completion is always one step away. The set tracker turns scarcity into momentum.

### Feature 4 — Drop countdown + drop page

**Why it's load-bearing.** Cadence creates return visits. The drop countdown is the daily hook for non-challenge users — it is the metronome of the product.

**User story.** Collector lands on `/v3/mlp/drops`. Sees a countdown timer to next drop ("Old-Ones-Persist — Conflict 1 Drop"). Sees the Pane the drop belongs to, pack count, rarity distribution, price. Toggles "Remind me." Below the upcoming drop: recent drops with sold-out badge and floor-price callout.

**Atlas integration point.** Drop metadata pulled from Atlas drop registry. Push notification toggle writes to Dapper user notification preferences.

**Success metric.** ≥30% of collectors toggle "Remind me" on their first visit to `/drops`.

**Emotional beat.** The cadence creates the anticipation. The collector knows there will be something to come back for.

### Feature 5 — Secondary marketplace (listings-only)

**Why it's load-bearing.** Without a secondary market, collection is a closed system with no second-order meaning. Provenance, floor-finding, set-completion-by-purchase, contraband arbitrage — all of these REQUIRE a secondary market. Atlas-native means we don't build the matching engine; we build the UX over Atlas's primitive.

**User story.** Collector lands on `/v3/mlp/market`. Browses by Pane / Set / Rarity. Each listing: card silhouette, serial, asking price, floor indicator (above/at/below). Contraband-rare row at top labeled "The Forbidden." Filter pill set: "Own / Need for set / Contraband / Pierre-Menard variants." Tap a listing → listing detail → buy button (Atlas escrow flow).

**Atlas integration point.** Atlas marketplace API for listings, floor-prices, transaction history. Buy flow opens Atlas-hosted purchase modal (does not handle funds in our app).

**Success metric.** ≥20% of collectors who reach `/sets` proceed to a corresponding `/market` listing within 7 days.

**Emotional beat.** The secondary market is where the *story* of the collection continues after the pack. Provenance is visible.

**Explicitly scoped:** listings-only in MLP. Bids/offers deferred to V2.

### Feature 6 — Daily / weekly / seasonal challenges

**Why it's load-bearing.** Challenges are what turn "I bought a pack" into "I have a reason to come back tomorrow." The drop countdown is the metronome for non-challenge users; challenges are the metronome for active users.

**User story.** Collector lands on `/v3/mlp/challenges`. Sees three tiers:
- **Daily** (resets at 00:00 UTC): one action, one reward.
- **Weekly** (resets Monday 00:00 UTC): "Complete a set" → pack credit; "Stake one card in Pane Prediction" → narrative scar guarantee.
- **Seasonal** (Series 1 long-arc): "Hold all four contraband cards in any Pane" → exclusive contraband-relic card.

Each challenge has a progress bar, the reward, and a "What does this give me?" expansion.

**Atlas integration point.** Challenge completion triggers on-chain reward distribution via the Dapper escrow account. Pack credits are non-fungible tokens redeemable at `/drops`.

**Success metric.** D7 retention ≥35% among collectors who engage one challenge in their first session.

**Emotional beat.** There's always something to do tomorrow. The challenge board is the always-on reason to return.

### Feature 7 — Pane Prediction (game with collectibles)

**Why it's load-bearing.** This is the minimum viable play surface. Without a play surface, the collection is just a wall — beautiful, but inert. Pane Prediction is the LOWEST build complexity (no real-time mechanics, no head-to-head matchmaking, no leaderboards) AND the HIGHEST integration with LoreVault's lore identity (the prediction event IS a narrative beat — Conflict 1: Old-Ones-Persist vs. Lud-Border).

**User story.** Weekly narrative event. Two Panes are announced as in cosmological conflict. Collectors who hold cards from either Pane can stake one card on the outcome. If their Pane wins (community vote + a controlled-randomness narrative reveal), the staked card receives a permanent on-chain metadata mark — a *narrative scar* — recording its participation. The scar is the collectible artifact of having played.

The collector lands on `/v3/mlp/play`. Sees "Conflict 1: Old-Ones-Persist vs. Lud-Border. The boundary leaks. Which way?" Two Pane tiles, each showing card-count staked. The collector taps a Pane, then chooses ONE of their cards from that Pane to stake. Confirms. Comes back at end-of-week to learn outcome. If their Pane won, their card now bears Conflict 1 scar metadata, visible in their vault.

**Atlas integration point.** Stake = smart contract interaction (card transferred to escrow for the duration of the conflict). Outcome resolution updates card metadata on-chain. Scar is queryable as part of the card's history.

**Success metric.** ≥25% of weekly active collectors stake at least one card per conflict.

**Emotional beat.** For the first time, the collection is a *hand* you can play. The card you staked has a story to tell about Conflict 1, even if you lost.

## Explicitly rejected for MLP

| Feature | Reason for deferral | Earliest re-eval |
|---|---|---|
| Fan participation / Tier 2+ contribution | Doctrine §13: Series 1 ships participation-disabled. Ladder VISIBLE in `/progress`, but tiers 2-4 greyed-out. | Series 2 |
| Full leaderboards | Needs substantial collector base to be meaningful. | V2 |
| Open secondary offer system (bids) | Marketplace v1 is listings-only; bids/offers add UX complexity without demand-side proof. | V2 |
| Cross-Pane challenges | Requires 3+ Panes active to be meaningful. Series 1 ships Lud-Border + Old-Ones-Persist + Sinterklaas-Reigns; cross-Pane challenges deferred to after first conflict cycle. | V2 |
| Tarot narrative draws | Promising candidate but adds a second play surface without proof Pane Prediction works. | V2 |
| Profile social following / notifications | Profiles are READ-ONLY in MLP. Following / notifications are V2. | V2 |
| Voice-Lead daily Journal subscription | The email infrastructure is a separate Track. MLP surfaces a "Send me the Journal" CTA on the hook page; subscription handler is a V2 wire-up. | V2 |
| Lattice-painting interactive map | The painting itself is a Track-D render dependency. The MLP hook uses three Pane tiles instead. | V2 |
| Lampblack-tether visualization | Cross-card narrative threading. Powerful but requires per-card tether metadata schema. | V2 |
| Card-of-the-day rotation per Pane | MLP picks one default Pane (Lud-Border) for the hook; rotation deferred. | V2 |

## Doctrine-anchored UI vocabulary

| Term | Definition |
|---|---|
| **Pane** | A cosmological-variant world. Not "universe," not "deck," not "world." |
| **Card** | A single collectible. Not "Moment" (V1 term, deprecated for MLP). Cards have a Pane attribution. |
| **Set** | A finite group of cards within one Pane. |
| **Series** | A 12-month arc spanning Panes. |
| **Drop** | A timed pack release. |
| **Stake** | Material commitment of a card to Pane Prediction. NOT "vote with" or "bet" (per voice rules). |
| **Scar** | Permanent on-chain metadata mark earned by staking a card in a Conflict. |
| **Contraband** | The forbidden thing of a Pane. |
| **Iceberg** | The 2:1:8 reveal layers. Surface / Echo / Deep. |
| **Lampblack** | Hierarchy: Gesture > Cosmological-relation > Wound > Forbidden-act > Role > Silhouette > Prop. |
| **Pierre-Menard variants** | Identical card text across Panes; meaning differs by attribution. |
| **Tier** | The participation ladder. 0 Observer, 1 Collector, 2-4 locked. |

## MLP scope envelope

The MLP at `/v3/mlp` is a 10-route, mobile-first product surface that takes a stranger from "what is this" to "I have started a collection in a Pane I chose, and I know how to come back tomorrow" in under five minutes. It uses mock Atlas integrations (typed shapes, real-data shape) and is wired for live Atlas API swap-in. The MLP ships with three Panes active (Lud-Border, Old-Ones-Persist, Sinterklaas-Reigns) and one weekly conflict (Conflict 1) live. Everything else is architected-but-locked.
