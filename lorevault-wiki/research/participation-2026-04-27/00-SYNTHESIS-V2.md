# LoreVault Participation Architecture — Synthesis V2
**Synthesized from:** 9 research dossiers + 4 gap analyses
**Date:** 2026-04-27
**Author:** Opus Synthesis Agent (V2)
**Changes from V1:** (1) cold-start design — the Seeded Hub, Lore Curator role, Tier-0-to-Hub bridges, and revised S3 metrics; (2) hostile-actor depth — adversarial reading pass, tiered staking, deferred fast-track for first-time contributors, wallet-cluster detection, public bug bounty; (3) Scribe Path — a parallel non-tokenized participation track for crypto-refusenik contributors with attribution-escrow Authorship NFTs and fiat bounties; (4) fan-better-than-team — the Resident Author track, AI-disclosure policy, retcon protocol, and blind-audition Council deliberation.

---

## §1 The Core Constraint

The platform must work for passive collectors on day one. Participation is upside, never a tax. This sentence is the load-bearing constraint of the entire architecture, and almost every other design choice in this document is downstream of it.

The research confirms this constraint with unusual unanimity. SCP Foundation's growth engine is passive-first access — anonymous web readers, no account required, zero friction to consume the [SCP wiki](https://scp-wiki.wikidot.com/). The 9,800+ articles and 6,300+ Tales accumulated over two decades because the gate was permanently open at the read-layer; participation grew on top of that floor, never replaced it. RWBY's collapse provides the inverse evidence — when Rooster Teeth migrated content behind paywalls and FIRST membership, the community erosion was measurable and irreversible. Homestuck's [70:20:10 participation pyramid](https://en.wikipedia.org/wiki/Homestuck) — 70% passive, 20% light engagement, 10% serious creators — held only because the bottom 70% never had to do anything. NFT projects that inverted this ratio (Jenkins the Valet, GRIPNR) extinguished. Top Shot's 1.6M users on Flow are direct demonstration that a passive collecting product can work at scale on the same infrastructure LoreVault sits on, with credit-card checkout, email auth, and zero crypto literacy required.

V2 deepens the constraint in two directions. First, **non-coercion at the participation gate, not just the collector gate.** A user who wants to write fan-canon must not be required to hold a token, learn a wallet, or interact with crypto infrastructure of any kind. The custodial-Flow-account answer of V1 solves this for collectors but leaves the writer-class — historically the most prolific cohort on every fan-canon platform — partially excluded. V2 introduces the Scribe Path (§3) as a parallel non-tokenized track for that population. Second, **non-coercion across the cold-start period.** Tier-0 holders in Series 1 and Series 2 are the only users that exist; the architecture must not punish them with an empty Hub or a participation-tax in S3. V2 therefore designs the platform to feel complete-and-alive at every phase, including phases where organic participation is near zero (§7).

Concretely, a passive collector in Series 1 must be able to (a) buy a pack of Pane cards through a credit-card or Apple Pay flow indistinguishable from buying [Disney Pinnacle](https://disneypinnacle.com/) or Top Shot, (b) view their collection in a clean gallery interface that requires no understanding of axioms, contraband, or cosmological variants, (c) trade cards on a peer-to-peer marketplace with USD pricing, (d) miss every Discord drop, every theory thread, every fan-canon submission, and still feel they own a complete and meaningful product. The flavor-text on each card is self-contained — readable as standalone literary fragment, not as a fetch-quest pointer to a wiki entry. The art and the card metadata do the entire job of making the object feel valuable. If the passive collector ever feels their card is a partial product whose meaning lives elsewhere, the constraint has been violated.

There is a second, more subtle requirement: the passive collector must not be punished by participation features. NounsDAO's $27M fork cascade is the cautionary tale — when participation mechanics (governance, treasury) became coupled to NFT value, holders who didn't participate were structurally diluted by holders who did. LoreVault's participation rewards must be additive to participants, never subtractive from non-participants. The Engaged-Reader who finds a hidden lore breadcrumb earns a cosmetic badge; the Passive Collector who never sees the breadcrumb still owns the same card with the same floor price. The two paths must be parallel, not zero-sum.

Third: Disney Pinnacle's free monthly capsule and Top Shot's free moments at onboarding establish the template — passive-first onboarding means giving something away before asking for anything. LoreVault's day-one experience for an unconverted visitor includes a free "Apprentice Pane" card that is real, on-chain, tradable, and complete-in-itself. Not a tutorial token. A real card.

The constraint, restated as a design rule: **anything that requires a Discord account, a wallet seed phrase, a wiki edit, a theory post, an LLM disclosure, or any action beyond "buy and hold" must be optional, additive, and invisible to the collector who declines it. And anything that requires a token, a stake, or a wallet must have a parallel non-tokenized path for the writer who declines it.**

---

## §2 Participation Tier Architecture

LoreVault uses a five-tier participation model with a parallel Scribe sub-class. Tiers are not gates — a user in Tier 0 is not "below" a user in Tier 4; they are running a different (and equally legitimate) loop on the same product. Tier transitions are voluntary, reversible, and do not affect the underlying NFT ownership rights of any tier. The Scribe sub-class is a wallet-free shadow of T2-T4 for users who participate without tokenization.

### Tier 0 — Passive Collector

**Mechanic:** Buy packs, own cards, trade cards. Nothing else required.

**What they have:** A wallet (custodial Flow account, opened with email + credit card, no seed phrase ever exposed unless requested). A collection gallery. A marketplace. A floor price. The full literary text of every card they own, rendered as readable flavor — not as wiki-stub. Card art at archival resolution. A transaction history. Read access to public-canon Pane summaries (one paragraph per Pane, baked into the card metadata, not fetched from external CMS).

**What the product looks like to them:** Indistinguishable from Top Shot or Disney Pinnacle in shape. A series drops, they buy a pack, they get cards, they hold or trade. They never see the word "contraband." They never visit the Hub. The Canon Council does not exist for them. They are 95% of Series 1 by design and ~70% of Series 4 by design.

**Structural feature for upgrade:** None as obligation, but two as discoverable affordances introduced post-S2: a one-click "read the lore behind this card" link in the gallery that surfaces Hub entries referencing the card's Pane, and an opt-in monthly "Hub Highlights" email featuring 3-5 Curator-selected entries. Both opt-in, both ignorable. Discovery without coercion.

### Tier 0.5 — Silent Reader (instrumentation, not UI)

A measurement category, not a feature. Users (logged-in or anonymous) who read Hub pages without voting, posting, or submitting. Tier 0.5 daily-active count is the leading indicator of cold-start health. A Hub with 10 submissions and 500 daily Tier-0.5 readers will eventually grow contributors. A Hub with 100 submissions and 10 Tier-0.5 readers is dying. The dashboard tracks this explicitly; rollout gates depend on it (§7).

### Tier 1 — Engaged Reader

**Mechanic:** Reads flavor-text deeply, follows official Pane drops on social, may follow a Discord channel in read-only mode. Does not post.

**Soft incentive for upgrade from T0:** Hidden lore breadcrumbs. Each card carries a small literary fragment that, when read across the full Pane set, forms a larger narrative — an axiom-trail. The Engaged Reader who notices the trail unlocks a free cosmetic — an alternate card-frame ("Reader's Sigil") that visually marks their copy of the card without affecting its market value or rarity. This is the [Pokémon Go medal](https://pokemongo.fandom.com/wiki/Medal) pattern: cosmetic recognition for paying attention, with zero impact on the collectible's tradable value.

**What they have:** Everything T0 has, plus the Reader's Sigil overlay on cards where they triggered it, plus a personal "lorebook" view that aggregates flavor-text across their collection into a continuous reading experience.

### Tier 2 — Theory-Crafter

**Mechanic:** Posts theories in Discord or on the LoreVault forum. Annotates cards with public-facing notes ("Margin Notes" — a per-card annotation feature visible to other users). Joins the Theory Channel.

**Structural reward:** A non-transferable Contribution NFT badge ("Marginalia") minted to their wallet on first published Margin Note. The badge accrues — Marginalia I, II, III — based on the count of their notes that get upvoted (one-account-one-vote, sybil defense via existing NFT holdings). The badge does not grant governance, does not grant token, does not grant economic rights. It is reputation, kept on-chain so it survives any platform shutdown. Top theory-crafters per Series get an invitation (not an obligation) to the Tier-3 contributor program.

**Scribe sub-class:** A T2 Scribe (email account, no wallet) earns a parallel **Quill** counter that increments on the same criteria. Quill is account-attached, not on-chain. If the Scribe later graduates to a wallet, accumulated Quill mints retroactively as Marginalia NFTs. Council eligibility treats Quill counts as equivalent to Marginalia counts for the Scribe-elected contributor seat (§4).

### Tier 3 — Contributor

**Mechanic:** Submits fan-canon entries via the Contraband Submission interface (§5). Submissions can be: (a) short fiction set in an existing Pane, (b) art for an existing card or proposed card, (c) a theory-essay, (d) a fully-specified alternate-Pane proposal, (e) an "axiom extension" — a small mechanical/cosmological detail that resolves an ambiguity in an existing Pane.

**Structural reward, three things in this order:**

1. **Authorship NFT.** Every submission, accepted or not, mints a non-transferable Authorship NFT to the contributor's wallet (or to the Attribution Escrow with the Scribe Account ID inscribed, for Scribes). This is the attribution-debt defense (Homestuck failure mode). The submission and its author are bound on-chain immutably the moment the submission is made — before any editorial review. If the submission is later promoted to canon, no one can erase or reassign authorship. If the submission is rejected, the Authorship NFT remains as personal archival record.

2. **LORE token grant** (wallet-holder contributors) **or fiat bounty** (Scribe contributors). Accepted submissions earn rewards. Token amount is not auction-based, not token-weighted-vote-based — it's a fixed grant scaled by submission category (short fiction: X LORE; axiom extension: 3X LORE; full Pane proposal: 10X LORE), set by Canon Council bylaws and adjustable only via constitutional amendment. The fiat bounty for Scribes is sized to be roughly equivalent to the LORE grant at then-current market price.

3. **Fan-Canon Hub publication.** Accepted submissions are published to the LoreVault Fan-Canon Hub (§4) — distinct from core canon, but indexed, searchable, citable, and on-chain-archived. This mirrors SCP's "Canon Hub" mini-canons system, which lets fan-clusters build internally-consistent micro-worlds inside the larger frame without forcing every contribution to compete for core-canon status.

### Tier 4 — Canon-Promoted Contributor

**Mechanic:** A subset of Tier-3 work is promoted by the Canon Council into core canon. Promotions are rare, deliberate, and structurally constrained — secondary character names, minor axiom-extensions, set-themes, occasionally a full Pane (default cap: 1 fan-promoted Pane per Series; raisable to 2 per Series by the same 5-of-7 Council supermajority that promotes any individual work; >2 per Series requires constitutional amendment).

**Reward + status:**
1. **A "Canon Mark" NFT** — non-transferable, distinct visual, listed on contributor's profile. Permanent. (Held in Attribution Escrow for Scribes, claimable on graduation to wallet.)
2. **A royalty share** on the specific cards or Series elements derived from their contribution. Structurally similar to Bored Ape's per-character commercial rights, but inverted: instead of the holder getting commercial rights, the *contributor* gets a perpetual on-chain royalty stream (1-3% of secondary-market royalties on the affected cards) for work they produced. Enforced via Flow's royalty-enforcement primitives, not by company API. Scribes receive royalty as fiat distribution from the Treasury, sized equivalently.
3. **A seat on the Canon Council nomination pool.** Tier-4 contributors are eligible (not entitled) to be nominated for Council seats in future cycles.
4. **Public attribution on every card derived from their contribution.** Card metadata permanently lists the contributor by their chosen handle and links to their submission archive.

### Tier 4R — Resident Author (the meritocratic-uncomfortable promotion)

A contributor with 3+ Canon Marks is eligible for elevation to **Resident Author** status. Resident Authors receive a salary or retainer from the LoreVault Treasury (~$60-120K/yr equivalent, paid in fiat or LORE per recipient preference), are commissioned for explicit Pane work with full credit and full Tier-4 royalty, and are placed on an automatic Council nomination track with the expectation of rotating onto the Council within 1-2 cycles. The designation is offered, not imposed; refusal is structurally protected and does not reduce the contributor's existing Tier-4 status.

The Resident Author track is the architecture's pre-committed answer to the case where a fan contributor's work is consistently better than staff output. The Homestuck failure mode (talent absorption without compensation) and the RWBY Fan Forge failure mode (talent rejection through gatekeeping) are both designed against. The contributor stays a contributor with their own attribution and royalty streams; the platform gains a top-tier creative on equal economic terms.

The five tiers plus the R-track are a menu, not a funnel. A user can sit in T0 forever; a user can jump from T0 to T3 without passing through T1 and T2; a user can drop from T3 back to T0 by simply not submitting. Authorship NFTs and Canon Marks already earned remain regardless. Disengagement does not cost the user their archive.

---

## §3 Token-Economy Design (fungible + non-fungible + fiat-parallel)

The economy has three fully-separated layers: a fungible token (LORE) for participation incentives and platform sinks, a non-fungible reputation/attribution layer (Authorship NFTs, Marginalia badges, Canon Marks) for governance signal and historical record, and a parallel fiat-bounty layer (Scribe Path) that delivers contribution rewards without token holding. The three layers are not convertible. Buying LORE must never grant governance weight; earning a Canon Mark must never produce LORE windfall; receiving fiat must never grant LORE. This separation is the central anti-capture defense and the explicit response to the Steemit/Hive failure mode (stake-weighted curation → vote-buying → hostile takeover).

### Fungible token: LORE

**Name:** LORE.

**Supply:** Fixed cap of 1,000,000,000 LORE. No inflation. No founder-controlled mint key. Mint authority is locked at deploy and exhausts according to a schedule baked into the [Cadence smart contract](https://cadence-lang.org/) on Flow.

**Distribution mechanism (10-year emission curve):**
- 38% — Contribution rewards (Tier-3+ wallet-holder contributions per §2).
- 5% — Scribe-Bounty Treasury line, paid as fiat to Scribe-class contributors.
- 20% — Passive-collector airdrops, distributed proportionally to NFT holdings on snapshot dates, capped (no single wallet receives more than 0.1% of any single airdrop event regardless of holdings).
- 12% — Treasury, controlled by Canon Council with multi-sig and a 30-day timelock on all spends above a threshold.
- 15% — Team and investors, vested over 4 years with a 1-year cliff.
- 10% — Liquidity provisioning and market-making reserve.

The 38%+5% contribution-reward total is the heart of the system; the 20% passive-airdrop pool is the structural promise that holders are not subsidizing contributors at their own expense.

**Sink mechanism (utility burn):**
- **Tiered submission staking:** every Tier-3 submission requires staking LORE, with the stake amount scaling adversarially. First-time contributor: stake fully subsidized by faucet. 2nd-10th submission within a 12-month rolling window: small base stake. 11th+ submission within the window: stake doubles with each subsequent submission. This preserves the genuine prolific contributor (whose accumulated rewards offset increasing stake) while making AI-assisted spam flooding economically painful. Refunded if accepted, burned if rejected for spam/quality, retained-pending-review otherwise.
- **Pane proposal escrow:** full-Pane proposals require 10x stake, escrowed for the duration of the review window. Pane proposals cannot be submitted by a wallet with fewer than 3 prior canon-promoted contributions (closes the buy-your-way-to-a-Pane attack).
- **Margin Note pinning:** a Tier-2 user can spend LORE to pin one of their notes to a card-page they own. Burned on pin.
- **Cosmetic frame upgrades:** alternate frames, signature animations, and other purely-cosmetic NFT modifications are LORE-priced and burned.
- **Canon Council nomination fee:** nominating someone (including yourself) for the Council costs LORE, burned.

The sinks are calibrated so that during normal operation the platform burns LORE at approximately the rate emissions release it. This is an explicit design goal, not a market hope. If burn-rate falls behind, sinks are added; emissions are not increased.

**What LORE is NOT:** Not a security. Not a vote. Not a profit-share. Not redeemable for cash from the platform. Not a stand-in for engagement-score. Not a price-oracle for NFTs. The bonding curve, if any, runs on a peripheral DEX, never as the marketplace's pricing mechanism (per the curation-markets dossier).

### Non-fungible participation badges

The governance-signal layer. Earned, not bought. Non-transferable (soulbound). Minted to the contributor's wallet (or Attribution Escrow for Scribes) and stay there permanently. Three families:

1. **Marginalia (I-X):** Tier-2 reputation, awarded for upvoted Margin Notes.
2. **Authorship NFTs:** Tier-3 attribution, one per submission, regardless of acceptance. Disclosed-AI submissions in category (iv) or (v) are tagged in metadata accordingly.
3. **Canon Marks:** Tier-4 promotion, one per canon-promoted contribution.

Governance weight is computed from these badges, not from LORE balance. The Canon Council's nomination/election process uses Authorship-and-Canon-Mark counts (and Quill counts for Scribe-class candidates) as eligibility filters, never LORE balance. A whale can buy 5% of total LORE supply tomorrow and have zero additional governance influence.

### The Scribe Path (parallel non-tokenized participation)

For users who refuse wallets — the Aesthetic Refusenik, the Practical Refusenik, the Jurisdictional Refusenik — V2 provides the Scribe Account.

A Scribe Account is opened with email + password. No custodial wallet is provisioned by default. No token balance. No NFT inventory visible to the Scribe.

**A Scribe can:** read the Hub; post Margin Notes (visible alongside NFT-holder notes; sybil-defended via email verification, posting rate limits, and invitation-token onboarding once the platform is past S3); submit fan-canon through the Contraband interface; receive editorial feedback; be canon-promoted; vote in the Scribe-elected contributor Council seat (§4).

**A Scribe cannot:** hold Pane cards, hold LORE, vote on the Featured Shelf upvote system (NFT-gated for sybil resistance), or vote in the wallet-elected contributor Council seat.

**Attribution Escrow.** When a Scribe submits, an Authorship NFT is minted to a platform-held escrow wallet, with the Scribe Account ID inscribed in metadata as canonical author. The Scribe gets full attribution on the Hub, in card metadata if promoted, and in all on-chain records. The Scribe can claim the Authorship NFT later by graduating to a wallet at any time; a one-click "claim my authorship NFTs" flow transfers all escrow-held NFTs to the now-provisioned wallet. Authorship is real and immutable from the moment of submission; possession is deferrable.

**Submission staking for Scribes.** Replaced by a temporal stake. Scribes can submit at most N times per 30-day window, scaling with Quill score. The economic friction of LORE staking becomes a temporal friction; spam resistance is preserved without requiring tokens.

**Rewards.** Canon-promoted Scribe contributions earn fiat bounties (PayPal, direct deposit, or comparable) sized to be roughly equivalent to the equivalent LORE grant at then-current market price. Funded from the 5% Scribe-Bounty Treasury allocation. Tier-4 Scribes receive royalty as fiat distribution.

### Anti-capture: how do we prevent whales from monopolizing canonical-contribution status?

Five overlapping defenses:

1. **Governance is keyed to non-transferable badges, not transferable tokens.** A whale cannot buy Canon Marks. They are minted only on canon promotion, decided by the Canon Council, not by token-holder vote.

2. **Submission slots are rate-limited per wallet** with the tiered staking curve (above) on top.

3. **Per-wallet airdrop caps.** No single wallet ever receives more than 0.1% of any LORE airdrop event regardless of NFT holdings.

4. **Council seat caps.** No more than 30% of Council seats can be held by Tier-4 contributors at any time, and no more than 2 seats per real-person identity (verified via off-chain attestation, enforced via Council bylaw and member oath).

5. **Wallet-cluster detection.** Off-chain analytics flag wallet clusters with shared funding sources or correlated submission timing. Detected clusters are visible to the Council during deliberation. The flag does not auto-reject; it informs judgment. Methodology documented; specific algorithms not public (deterrence requires some opacity).

### Anti-pay-to-play: how do we ensure the contribution gate is QUALITY not WEALTH?

Six mechanisms:

1. **Submission staking is small, refundable, and tiered to penalize flooding, not first-timers.**
2. **First-time-contributor faucet.** Any wallet with at least one Pane card and no prior submissions gets a one-time free LORE grant for first three submissions.
3. **The Scribe Path** removes the wallet requirement entirely from the participation flow. A Scribe can become a Tier-3 contributor with zero token interaction.
4. **Engagement score is blind to purchase price.** Per the Top Shot failure-mode dossier — the score that matters for Council eligibility, contributor reputation, and badge accrual measures *what people do*, never *what they spent*.
5. **Curation is editorial, not market-priced.** Canon promotion decisions are made by the Canon Council on quality criteria, with documented deliberation. There is no auction for canon. There is no token-weighted vote for canon. The TCR (token-curated registry) model failed for subjective quality and is explicitly rejected.
6. **Quality criteria are published and stable.** The Council publishes its review rubric and edits to the rubric require constitutional amendment.

### Onramps for non-crypto-native users

Three onramps for three populations:

- **Custodial Flow accounts** (Top Shot template): email + Apple Pay, custodial Flow account, real on-chain NFTs, never see a seed phrase. Default for collectors. Self-custody available via one-click export.
- **Scribe Accounts** (AO3 template): email + password, no wallet, full participation in writing-class activities. Default for crypto-refusenik contributors.
- **Graduate to self-custody** prompt for Tier-3+ wallet contributors and Scribes claiming their escrow NFTs — framed as a contributor-grade feature, not a prerequisite.

### Off-ramps and exits

A user must be able to disengage without losing their archive. Four guarantees:

1. **NFTs remain on-chain regardless of platform state.** All Pane cards, Authorship NFTs, Marginalia badges, and Canon Marks are stored on Flow with metadata pinned to [IPFS](https://ipfs.tech/) and content hashes recorded on-chain. If LoreVault Corp disappears, the NFTs persist and can be displayed by any compliant Flow wallet or third-party gallery.
2. **A user can export their full archive.** A "download my archive" function produces a signed bundle containing all Margin Notes, all submissions (accepted or rejected), all Authorship NFT references, and a manifest. Platform-independent.
3. **A user can revoke their LoreVault account without burning their NFTs.** Account deletion deactivates platform login but does not affect on-chain assets. Custodial wallets can be transitioned to self-custody at any time, including after account deletion.
4. **Scribes can claim their escrow assets at any time** by provisioning a wallet, even after closing the Scribe account.

The design rule: **the platform is a viewer over the archive, not the archive itself.** RWBY's collapse demonstrated that when the community owns nothing, corporate failure is community extinction. LoreVault holders own their archive on-chain; LoreVault Scribes hold a deferred-claim option that is itself enforceable.

---

## §4 Curation + Quality Control

The curation system has four layers, ordered from broad to narrow. V2 adds the Adversarial Reading Pass and the Lore Curator role to V1's three-layer structure.

### Layer 1: Open Fan-Canon Hub (no editorial review)

Any Tier-3 submission, after staking the small LORE fee (or temporal-stake for Scribes), is auto-published to the Fan-Canon Hub immediately. The Hub is searchable, indexed, on-chain-archived, and labeled clearly as fan-canon (NOT core-canon). This is the SCP-Foundation model: low gate, high volume, format-enforced quality. The "format" is the submission template — submissions must conform to the structured schema (§5) that enforces the contraband framing.

The Hub is the participation surface for 99% of contributors. Core canon is the exception, not the goal.

### Layer 2: Adversarial Reading Pass (defensive screen)

A small specialist function within Trust & Safety performs a structured scan on every Featured Shelf entry before it reaches the Council, and on flagged Hub entries on demand. The scan looks for:

- Known extremist symbology and dog-whistles (numerological patterns, alt-right symbology, ideological framing markers).
- Brigade patterns: consistent ideological framing across submissions from the same wallet or a wallet-cluster.
- Encoded extra-textual content (acrostics, hidden references, structural payloads).
- Disclosed-AI category (iv) or (v) submissions (flagged for stricter Council scrutiny).

The pass is documented in constitutional documents (deterrence value). False positives are appealable. The Adversarial Reading Pass output is one input to Council deliberation, never an auto-reject. This is the explicit answer to the structurally-harmful-content threat that V1's spam-filter approach did not handle.

### Layer 3: Community curation (Marginalia upvotes, Featured Shelf, Lore Curator)

Hub entries accumulate Marginalia upvotes from any Tier-2+ user (and Scribe equivalents tracked via Quill). Highly-upvoted entries are promoted to a "Featured Shelf" — visible on the Hub homepage, likely to be read by Council members during canon review. Upvoting is one-account-one-vote (sybil-defended via NFT-holding requirement), not token-weighted.

**The Lore Curator role.** A paid editorial-scout staff role whose job is to read the Hub daily and surface promising submissions to the Featured Shelf during the first 18-24 months of Hub operation. This is the [Sundance programmer model](https://en.wikipedia.org/wiki/Sundance_Film_Festival) — a human filter that elevates work the algorithmic upvote system would miss in low-volume cold-start conditions. The Curator's selections are flagged as such; they do not override community upvotes but augment them. The role becomes vestigial as upvote volume grows.

### Layer 4: Canon Council review (final gate to core canon)

The Canon Council is the editorial committee. Composition:
- **8 seats total** (changed from V1's 7 to admit the Scribe-elected seat).
- 4 seats: founding editorial team (LoreVault staff, lore architects, art directors).
- 1 seat: Tier-4 contributor elected by Authorship-NFT-holders.
- 1 seat: Tier-4 contributor elected by qualifying Scribes (Quill-score-gated, one-account-one-vote).
- 1 seat: rotating community seat, drawn by lottery from Tier-2+ holders for a 6-month term.
- 1 seat: rotating Resident-Author seat once the Resident Author program activates (S5+).

**Term length:** 2 years for staff seats, 1 year for contributor seats, 6 months for the lottery seat, 1 year for the Resident-Author seat. Staggered terms — never more than half the Council turns over in a single cycle.

**Promotion threshold:** 5-of-8 simple majority for canon promotion (changed from V1's 5-of-7 to preserve roughly equivalent supermajority strictness). A 5-of-8 vote is 62.5%; deliberate, conservative, but not impossible.

**Step-by-step process for canon-aspiring submissions:**

1. **Submission.** Contributor opens the Contraband Submission interface, selects category, target Pane, fills out the structured template (§5), discloses any AI assistance, stakes LORE (or accepts temporal-stake cooldown, for Scribes).

2. **Auto-publication to Hub.** Within minutes, the submission is live on the Fan-Canon Hub with an Authorship NFT minted to the contributor (or Attribution Escrow).

3. **Open community window (30 days).** Tier-2+ users (and Scribes) can read, upvote, and post Margin Notes referencing the submission.

4. **First-time contributor observation window.** Submissions from contributors with no prior canon promotions or Featured Shelf appearances are placed on a separate fast-track that requires a minimum of 2 cycles (12 months) of observation before canon promotion is possible. Returning trusted contributors are not subject to the observation window.

5. **Adversarial Reading Pass** on Featured Shelf entries.

6. **Council shortlist.** At end of each Series cycle, Council reviews the Featured Shelf, Curator nominations, and Council-member nominations. Shortlist size: 20-50 submissions per cycle.

7. **Blind Council deliberation.** Each shortlisted submission is reviewed against the published rubric: (a) lore-coherence, (b) literary quality, (c) attribution clarity, (d) contraband legitimacy, (e) cross-Pane compatibility, (f) **encoded-content check** (is there extra-textual ideological payload?). The deliberation interface displays no information about whether the submitter is staff, Resident Author, or Tier-3 first-timer until after the vote is recorded. This is the [orchestral blind-audition pattern](https://en.wikipedia.org/wiki/Blind_audition).

8. **Vote.** Council members vote yes/no/defer on each submission. Promotion requires 5-of-8. A "defer" vote returns the submission to the Hub with feedback for possible resubmission next cycle.

9. **Promotion or retcon.** Promoted submissions are minted as Canon Marks (or Attribution-Escrowed Canon Marks for Scribes), royalty terms attached, public canon documents updated. If a submission would be canon-eligible but contradicts prior canon, the Council has three options instead of two: reject, accept-with-patch (contributor revises), or **accept-with-retcon** — a 6-of-8 supermajority decision that explicitly amends prior canon to admit the new contraband, triggering a 60-day public comment period and a written response to filed objections.

10. **Public deliberation log.** Council deliberations are summarized — per-decision rationale paragraph. This is the [Wikipedia AfD](https://en.wikipedia.org/wiki/Wikipedia:Articles_for_deletion) transparency model. Contributors who were rejected know why; the community can audit Council decisions for capture or bias.

The 5-of-8 majority is conservative. The volume of fan-canon should remain in the Hub, where it lives indexed and citable but distinct from core. The default cap of 1 fan-promoted Pane per Series is bylaw-default, raisable to 2 by Council supermajority with published justification, beyond which constitutional amendment is required. The retcon path admits the rare case where canon must update to admit superior fan contraband — bylaw-default zero per Series, 6-of-8 supermajority required.

### AI-assisted submission policy

Adopted: **disclose-and-evaluate**, not detect-and-reject.

- The submission interface includes a required disclosure field with five categories: (i) no AI use, (ii) AI used for ideation, (iii) AI used for drafting with substantial human revision, (iv) AI used for substantial generation with light human editing, (v) primarily AI-generated.
- Categories (i)-(iii) are reviewed identically by the Council. Category (iv) is reviewed under stricter scrutiny — the Council must affirm the human creative contribution is the load-bearing element. Category (v) is rejected from canon promotion but admitted to the Hub with explicit (v)-tag visible to readers.
- Undisclosed AI use, if discovered, is grounds for revocation of canon-promoted status (using the same constitutional process used for un-promoting any canon entry). The Authorship NFT is not burned but is overlay-tagged with the violation.
- Authorship NFTs for category (iv) and (v) submissions are tagged accordingly in metadata.

### Bug bounty for adversarial submissions

The platform publishes a bounty (in fiat and LORE) for credible reports of structural-harm submissions that passed initial review. $500-$2,000 per substantiated catch. The community is incentivized to second-pass-read its own Hub. This is the [HackerOne security-bounty model](https://www.hackerone.com/) applied to lore moderation.

---

## §5 The "Contraband Across the Border" Mechanic

This is the heart of the design and the explicit answer to the third-voice critique. The doctrine teaches that every Pane has a buried weight — a contraband — a hidden axiom that defines what crosses between worlds. Fan participation, in the doctrine's own framing, is fans bringing their own contraband across the border. The submission interface must make this metaphor literal — make the act of contributing feel like smuggling, not form-filling.

### The Contraband Submission Interface

The submission UI is structured as a five-step "border crossing" (V1 had four; V2 adds the AI-disclosure step). The language is deliberate; the cosmology is deliberate; the mechanics are deliberate.

**Step 1: Declare your origin.** The contributor selects which Pane they're operating from (or "outside-Pane" for cross-cutting work). This grounds the submission in the existing cosmological substrate.

**Step 2: Declare your contraband.** A structured field titled "What contraband are you bringing across?" The contributor must write a one-sentence declaration of the specific axiom, character, object, or event they are proposing to introduce. This is not optional. This is the load-bearing field. It forces the contributor to articulate, before they write a word of fiction, what they are *adding* to the world. This is the SCP "containment template" mechanism translated to LoreVault's metaphor.

The declaration field is structured: contributor selects a category (axiom-extension, character, object, event, place, ritual) and writes the one-sentence statement. Examples:
- "An axiom that in this Pane, mirrors record but never reflect."
- "A secondary character — the cartographer who maps borders that don't yet exist."
- "An object — the Lantern of Forgotten Names, which illuminates only what has been deliberately erased."

The declaration becomes the title-card of the submission and is the indexed, searchable, on-chain-archived primary metadata.

**Step 3: Declare the customs cost.** A structured field titled "What does this cost the world to admit?" The contributor must articulate the constraint or trade-off the contraband imposes on the existing canon. This is the doctrine's "buried weight" requirement. Contraband that costs nothing is not contraband — it's decoration.

**Step 4: Declare your tools.** The AI-disclosure field. Contributor selects from the five categories and writes a brief free-text description of how AI was or was not used. The disclosure is a required input but is not a bar to submission — categories (i)-(v) are all submittable. Only the Council's posture on each category differs (§4).

**Step 5: The crossing.** The contributor writes the actual submission — short fiction, theory, art description, full Pane spec. The text is freeform but the prior four structured fields provide the editorial spine. The interface presents this step with explicit "border crossing" framing — an animated transition, language about "stepping across the threshold," a final review where the contributor confirms contraband, cost, and disclosure before staking LORE (or accepting Scribe cooldown) and submitting.

### "Off-canon" submission vs. "canon-proposal"

Every submission is, at first, off-canon. There is no "canon-proposal" submission type. There is only submission-to-Hub, and from the Hub, the Council may promote. This removes the social pressure of "submitting for canon" and lets every contribution stand on its own as Hub literature.

A contributor who explicitly does *not* want their work considered for canon promotion can mark the submission "Off-Canon Permanent." This is preserved as on-chain metadata. The Council will not review such submissions for promotion. This protects contributors who want to write in the world without the burden of canon-aspiration.

### Proposing a whole new Pane

Full-Pane proposals are a special category with four differences:

1. **Higher LORE stake.** Roughly 10x the standard submission stake (or proportional cooldown for Scribes).
2. **Trust gate:** Pane proposals can only be submitted by wallets/Scribes with at least 3 prior canon-promoted contributions. This closes the buy-your-way-to-a-Pane attack and ensures Pane proposals come from contributors with a track record.
3. **Mandatory pre-submission consultation.** The contributor must post a "Pane Sketch" to a dedicated Discord/forum channel and receive at least 5 community responses before formal submission. Rough-consensus pre-vetting.
4. **Extended Council review window.** Pane proposals are reviewed over 2 cycles (12 months), with the contributor able to revise based on Council feedback.

Full-Pane proposals that succeed become "shadow Panes" in the doctrine's terminology — possible Panes that may or may not be activated in a future Series. The contributor has produced canon-eligible material; whether it ever gets a card-pack drop is a separate Council decision tied to the Series roadmap.

### Why this works

The contraband framing accomplishes three things at once:
1. **Quality filter without gatekeeping.** Structured declaration fields force coherence on contributors before any reviewer sees the work. Most low-quality submissions self-eliminate at Step 2 or Step 3.
2. **Doctrine alignment.** Every submission, accepted or rejected, engages the doctrine's central metaphor. The platform produces lore by its existence, not by editorial selection.
3. **Smuggling, not form-filling.** The metaphor is participatory and mythic, not bureaucratic. Contributors feel like they are doing something dangerous and worthwhile, not filling out a Google Form. This is the affective register that the SCP containment-template hits and that the [DM's Guild](https://www.dmsguild.com/) submission flow misses entirely.

---

## §6 Failure-Mode Pre-Emption

Each failure mode observed in research, paired with the specific structural defense LoreVault implements. V2 strengthens five of V1's ten defenses and adds two new ones.

### 1. Authorial withdrawal / founder dependency

**Observed in:** Homestuck (Hussie's withdrawal catastrophe), early SCP (founder turnover handled badly initially).

**Defense:** The Canon Council's structure assumes founder absence. No single seat — including the founding-editor seats — can promote canon alone (5-of-8 majority required). The deliberation rubric is published and amendable only by constitutional process. The Hub is auto-publishing, requires no founder approval, and continues to operate if every founding-editor seat goes vacant. The Resident Author program ensures successor creators are already structurally embedded by S5. A 12-month founder-absent operation is a non-event for Tier-0 through Tier-3 users.

### 2. Attribution debt (uncredited contributor work)

**Observed in:** Homestuck (the attribution scandal that ended the project), RWBY Fan Forge disputes.

**Defense:** Every submission, on the moment of staking, mints an Authorship NFT to the contributor's wallet (or to Attribution Escrow with Scribe Account ID inscribed). Attribution is bound to the work *before* any editorial review. No staff member, no Council, no future platform owner can erase or reassign authorship. Card metadata for canon-promoted contributions includes permanent contributor handles. The royalty stream for Tier-4 contributors is enforced by Flow's royalty primitives. Resident Authors retain their attribution and royalty streams even if they ascend to Council positions. There is no "we'll credit you later" surface anywhere in the platform.

### 3. Corporate capture / IP ownership risk

**Observed in:** RWBY (community owned nothing when RT collapsed), DM's Guild exploitation clause.

**Defense:** Holders own their Pane cards on-chain with Flow's standard NFT primitives. Per-card commercial rights are granted at mint, encoded in the metadata, constitutionally protected against unilateral relicensing. The Authorship NFT and Canon Mark systems give contributors an on-chain attribution record that survives any company shutdown. The Hub archive is pinned to IPFS with content hashes on-chain. Scribes' Attribution-Escrow assets are claimable forever by the Scribe Account ID, even if LoreVault Corp shuts down (the escrow wallet is held by the LoreVault Foundation, a separate nonprofit). If LoreVault Corp dies, cards, contributor records, Scribe escrows, and the lore archive all survive.

### 4. Trademark squatting (Russian SCP scenario)

**Observed in:** SCP Foundation's $140K trademark fight against a $1,400 hostile registration.

**Defense:** Defensive trademark registration in 9 major jurisdictions (US, EU, UK, Japan, China, Russia, Brazil, Korea, Australia, India) for "LoreVault" and Pane-series names *before* the corresponding Series ships. Standing legal budget for trademark defense in the Treasury allocation. A Foundation-style nonprofit holds the trademarks separately from LoreVault Corp.

### 5. Platform dependency (Reddit RCP shutdown scenario)

**Observed in:** Reddit Community Points killed overnight in 2023; Top Shot reward changes.

**Defense:** Reward signals — Authorship NFTs, Marginalia badges, Canon Marks — are on-chain Flow data, not LoreVault company API. LORE is on-chain. Hub archives are on IPFS. The platform UI is a viewer over this data; replacing LoreVault.com with a third-party viewer is a known, supported migration path. The platform commits to publishing a complete data-portability spec and maintaining it as a public protocol.

### 6. Whale capture / plutocratic governance

**Observed in:** Steemit/Hive (stake-weighted curation captured), Friend.tech collapse.

**Defense:** Governance weight is keyed exclusively to non-transferable badges, never to LORE balance or NFT count. Per-wallet airdrop caps. Per-wallet submission rate limits with adversarial-tiered staking. Council seat caps. Wallet-cluster detection flags coordinated activity for Council review. Contributor election uses one-account-one-vote among Authorship-NFT-holders (and qualifying Scribes for the Scribe seat), with sybil defense via NFT-holding (or Quill-score) plus an off-chain identity attestation for elected seats.

### 7. Speculation spiral / pay-to-play degradation

**Observed in:** GRIPNR ($2.5M raised, one NFT sale), Jenkins the Valet, NounsDAO fork cascade.

**Defense:** Participation is never required for NFT value. Tier-0 holders are first-class users with full collectible value; participation rewards are additive cosmetic/reputational, never deflate Tier-0 holdings. LORE is structurally separated from collectible NFT value — there is no LORE/NFT bonding curve. The Scribe Path further separates participation from the token economy entirely. The platform's marketing language is collectible-first, participation-second. The first ad campaign for Series 1 says nothing about contribution mechanics.

### 8. Curation bottleneck / Canon Council capture

**Observed in:** RWBY Fan Forge bottleneck and disputes; DM's Guild editorial captures.

**Defense:** Multiple, parallel curation surfaces (Hub for fan-canon, Featured Shelf for community curation, Lore Curator for editorial scouting, Canon Council for core promotion). Canon promotion is the rare exception, not the goal. Council deliberations are publicly summarized for audit. Council seats are term-limited and staggered. The lottery seat injects unpredictable membership. Constitutional amendments require supermajority of Council *and* a supermajority of Authorship-NFT-holders + Scribe Account holders voting one-account-one-vote. The Pane-promotion cap is bylaw-default, raisable, ensuring the Council does not become a structural bottleneck against meritocratic outperformance.

### 9. Bad-actor injection (hostile/harmful content)

**Observed in:** Every open-submission system; SCP's experience with hostile content.

**Defense, V2 expanded:**
- Submission staking (LORE for wallets, temporal cooldown for Scribes) provides economic/temporal friction against spam.
- Tiered staking curve makes coordinated flooding economically painful (11th+ submission within 12 months: stake doubles each time).
- Adversarial Reading Pass scans every Featured Shelf entry and flagged Hub entries for encoded ideological payloads, dog-whistles, brigade patterns.
- Wallet-cluster detection surfaces coordinated activity to Council deliberation.
- First-time-contributor observation window (2 cycles minimum before canon promotion) creates a 6-month detection runway for slow-burn attacks.
- The Hub is moderated for explicitly-defined categories of harmful content by a Trust & Safety team operating under published policy, separate from Canon Council. Moderation actions are appealable to the Council. The on-chain Authorship NFT for a moderated-out submission is *not* burned — it remains as record with a moderation overlay NFT logging the violation.
- Public bug bounty for substantiated catches of structural-harm submissions that passed initial review.
- Disclosed-AI category (v) submissions are excluded from canon promotion.

### 10. Fan-base fragmentation / schism

**Observed in:** Beyond Canon (Homestuck) failure; SCP's various branch-wikis.

**Defense:** The Hub's "Canon Hub" mini-canon model lets sub-communities build internally-consistent micro-worlds inside the larger LoreVault frame. A schism within LoreVault is structurally encouraged to take the form of a new mini-canon on the Hub, not a fork of the platform. The platform's IP grants and on-chain records make literal forks of the cosmology possible — anyone can take their NFTs and lore archive elsewhere — but the Hub design is calibrated to make staying internally more attractive than leaving.

### 11. Cold-start emptiness (V2 addition)

**Observed in:** Disney Fan Forge clones, the [Fandom wiki graveyard](https://community.fandom.com/), every new fan-content platform that launched without seed content.

**Defense:** The Seeded Hub launches S3 with 200-500 staff-and-commissioned-contributor entries, dated honestly to look as if accumulated naturally over prior cycles. Disclosed in constitutional documents. Funded by a one-time Treasury allocation for commissioned fan-writer cohort (10-20 writers, paid in fiat + LORE). Plus Tier-0-to-Hub bridges (the "read the lore behind your card" link, opt-in Hub Highlights email, ambiguity-planting flavor-text on cards). Plus the Lore Curator role for the first 18-24 months. Plus the warm-up canon-promotion exception in S3 (1-3 promotions of seeded fan-writers' work, providing visible evidence that the canon path is real before organic Tier-3 contributors arrive in S4).

### 12. AI-generation displacement (V2 addition)

**Observed in:** AO3's ongoing AI policy debate, Wikipedia's draft policies on LLM-edited content, the SCP wiki's 2024-2025 contentious AI-generated articles vote.

**Defense:** Disclose-and-evaluate policy with required AI-disclosure field at submission. Five disclosure categories with differentiated Council scrutiny. Category (v) primarily-AI-generated submissions admitted to Hub with explicit tag, excluded from canon promotion. Undisclosed AI use grounds for canon-status revocation. Authorship NFTs metadata-tagged accordingly. The platform takes a position rather than letting one accumulate by default.

---

## §7 Phased Rollout

The rollout is deliberately sequential. Each phase enables a tier of participation infrastructure and is gated on metrics from the prior phase. The principle: **never enable a participation tier the platform isn't ready to support at quality.** A failed Tier-3 launch (contribution flood with no curation capacity, or contribution desert with no audience) would damage the Hub's reputation more than a delayed launch.

### Series 1 (Months 0-6): Passive-First Foundation

**Enabled:**
- Pane card minting (3-5 active Panes).
- Pack purchase via credit card / Apple Pay / Flow wallet.
- Custodial Flow account onboarding.
- Marketplace with USD pricing.
- Card gallery with embedded flavor-text and lore-tab.
- Free "Apprentice Pane" card on signup.
- Static, official-only Pane summaries (no fan-canon Hub yet).
- Scribe Account registration enabled (read-only access to whatever exists).
- Discord channel (read-only for new accounts; light moderation).
- Trademark filings completed in 9 jurisdictions before pack drop.
- Lore-team begins seed-content production (private, for S3 launch).

**Not enabled:** LORE token, fan submissions, Canon Council, Tier-3+ infrastructure.

**Tier distribution target:** 95% Tier-0, 5% Tier-1.

**Metrics gating advancement:**
- 50,000+ unique wallets/Scribe-Accounts holding at least one Pane card or registered.
- $5M+ secondary marketplace volume in 6 months.
- <1% support-ticket rate per active wallet (UX healthy).
- Discord population large enough to seed an initial contributor pool — ~10K members.
- Trademarks granted or pending in all filed jurisdictions.

### Series 2 (Months 6-12): Reader Layer + Marginalia + Seed Recruitment

**Enabled (in addition):**
- Margin Notes feature on cards (and Scribe-class equivalents).
- Marginalia badge minting (Tier-2 reputation) and Quill counter (Scribe Tier-2 equivalent).
- Theory channels in Discord with posting rights for verified holders.
- Reader's Sigil cosmetic for breadcrumb-trail completion.
- Personal lorebook view.
- Public profile pages with badge displays.
- Commissioned fan-writer cohort recruitment for the Seeded Hub launch.
- Lore Curator role hired and onboarded.

**Not enabled:** LORE token, fan-canon submissions, Canon Council.

**Tier distribution target:** 80% T0, 18% T1, 2% T2.

**Metrics gating advancement:**
- 1,000+ active Tier-2 users (3+ upvoted Margin Notes in the period, Marginalia or Quill).
- Margin Note upvote-to-post ratio above 30%.
- No major moderation incidents.
- Sentiment/quality assessment from an editorial review.
- Seed-content corpus of 200-500 entries staged and staff-reviewed.
- 10-20 commissioned fan-writers identified, contracted, and producing.

### Series 3 (Months 12-18): LORE Token + Seeded Hub + Warm-up Canon

**Enabled (in addition):**
- LORE token launch on Flow.
- Initial holder airdrop (capped per wallet).
- Contribution Submission interface (the "border crossing" UI with five steps).
- Authorship NFT minting on submission, Attribution Escrow for Scribes.
- Fan-Canon Hub **launches with 200-500 seeded entries already published**, dated honestly, attributed to staff and the commissioned cohort.
- First-time-contributor LORE faucet.
- Community-upvote-driven Featured Shelf.
- Lore Curator actively scouting Hub for Featured Shelf nominations.
- Adversarial Reading Pass operational on Featured Shelf entries.
- Wallet-cluster detection operational.
- Canon Council seated (founding 4 staff + 1 lottery; 2 contributor seats reserved for S4; Resident-Author seat reserved for S5).
- **Warm-up canon promotion: 1-3 promotions of seeded fan-writer work**, providing visible evidence that the canon path is real before organic Tier-3 contributors arrive.

**Not enabled:** Full open canon promotion (warm-up only); Resident Author program; retcon protocol.

**Tier distribution target:** 70% T0, 22% T1, 6% T2, 2% T3 (organic + seeded combined).

**Metrics gating advancement:**
- **Organic submissions** (non-seeded, non-commissioned): 100+, fail-threshold 25.
- **Hub Tier-0.5 daily-active readers**: 1,000+ by S3 month 3, 5,000+ by S3 month 6.
- **Cross-references**: average 0.5 per organic entry by end of S3.
- Submission rejection rate (spam moderation) below 10%.
- Hub-traffic-to-organic-submission ratio above 50:1.
- Council deliberation rubric published and stable for 90 days.
- LORE burn-rate within 20% of emission rate.
- Adversarial Reading Pass false-positive rate below 5% on appeal.

### Series 4 (Months 18-24): Full Canon Promotion + Scribe Council Seat

**Enabled (in addition):**
- First open Canon Council promotion vote (not limited to seeded cohort).
- Canon Mark NFTs minted at scale.
- Royalty streams to canon-promoted contributors.
- 1 Tier-4 contributor seat elected by Authorship-NFT-holders.
- 1 Tier-4 contributor seat elected by qualifying Scribes (Quill-score-gated).
- Full constitutional process for amendments.
- Fan-promoted content appears in Series-card metadata.
- Bug bounty program live.

**Not yet enabled:** Resident Author program; retcon protocol.

**Tier distribution target:** 70% T0, 18% T1, 8% T2, 3% T3, ~0.1-0.5% T4.

**Metrics gating advancement:**
- 500+ organic submissions in the cycle.
- Canon Mark count: 5-15 in the cycle.
- Cross-reference average 1.0+ per organic entry.
- No major capture events.

### Series 5+ (Months 24+): Resident Author + Retcon

**Enabled (in addition):**
- Resident Author program activates. 3+ Canon Mark holders are eligible for elevation. Resident-Author Council seat enabled.
- Retcon protocol activates. The Council may, by 6-of-8 supermajority, accept-with-retcon for Pane proposals that contradict prior canon, with 60-day public comment.
- Pane-promotion cap may be raised to 2 per Series by Council supermajority with published justification.

**Tier distribution target (steady-state):** 70% T0, 18% T1, 8% T2, 3% T3, ~0.1-0.5% T4, ~3-5 Resident Authors.

**Ongoing metrics:**
- ~1-2 fan-promoted Panes per Series (default cap 1, raisable to 2).
- Canon Mark count grows by 5-15 per cycle.
- Hub volume continues compounding.
- Tier-distribution stable within ±5% of targets.
- LORE burn-rate stable.
- Resident Author cohort grows by 1-2 per year.

---

## §8 The Test for Whether This Works

Per the third-voice critique: "will fans bring their own contraband across the border?"

This is the central question. The synthesis above is a guess at the architecture; the test is whether participation actually emerges. V2 measures the test along five proxies, each with explicit thresholds, plus one tertiary signal-set.

### Proxy 1: Hub submission volume (organic, not seeded)

**Metric:** Number of *organic* Tier-3 submissions per Series cycle, after Series 3 (when the Hub is open). Seeded and commissioned-cohort entries are tracked separately and do not count toward this metric.

**Threshold for "working":** 100+ organic submissions in S3 (including the warm-up cycle); 500+ in S4; 2,000+ per cycle by S5; 5,000+ per cycle by S8. This roughly tracks SCP's two-decade ramp compressed by a factor of 3-5 due to LoreVault's pre-existing collector audience and the Seeded Hub providing audience-presence.

**Threshold for "failing":** Fewer than 25 organic submissions in S3, or sub-100 organic submissions in S4. If the Hub is sparse despite seeding, contraband isn't crossing — the architecture is producing collectors only.

### Proxy 2: Read-to-write ratio

**Metric:** Ratio of Hub page-views (Tier-0.5 daily-active reading) to Hub submissions.

**Threshold for "working":** 50:1 to 200:1 (per SCP norms). High enough that submissions are read by actual humans, not just submitters reading their own work. **The S3-specific threshold is more lenient: 1,000+ Tier-0.5 daily-active by month 3, 5,000+ by month 6, scaling with Hub volume thereafter.**

**Threshold for "failing":** Below 20:1 (the Hub is a parking lot for contributors who don't read each other) or above 1,000:1 (the Hub is a museum, not a participation surface).

### Proxy 3: Cross-contributor engagement

**Metric:** Average number of Margin Notes per submission referencing or building on other submissions.

**Threshold for "working":** 0.5 per organic entry by end of S3, 1.0 by S4, 2.0+ per Hub entry by S5 — meaning contributors are reading each other's work and building a connected web of fan-canon.

**Threshold for "failing":** Sub-0.3 average at S5; contributors are isolated.

### Proxy 4: Contraband adoption into core canon

**Metric:** Number of canon-promoted contributions per Series, percentage of new core-canon material that originated as fan submissions, and Resident-Author cohort size.

**Threshold for "working":** 1-3 warm-up promotions in S3 (seeded cohort); 5-15 Canon Marks per Series by S5; 10-20% of new core-canon material originating as fan-promoted contributions by S6; Resident-Author cohort of 3-5 by S6.

**Threshold for "failing":** Zero promotions for two consecutive cycles after S4 (Council over-conservative or Hub quality too low — diagnose), or all promotions concentrated in <5 contributors (capture is occurring — diagnose), or Resident-Author cohort fails to materialize by S6 (the meritocratic-uncomfortable case isn't being handled — diagnose).

### Proxy 5: Scribe-class participation

**Metric:** Percentage of Tier-3 active contributors who participate via Scribe Account (no wallet) and percentage of canon-promoted work originating from Scribes.

**Threshold for "working":** 20-40% of Tier-3 active contributors are Scribes by S5; 15-30% of canon-promoted work originates from Scribes; Scribe-elected Council seat is filled in every cycle from S4 onward.

**Threshold for "failing":** Sub-5% Scribe representation in active Tier-3 by S5 (the Scribe Path isn't reaching the writer-class for which it was built — diagnose); Scribe-elected seat goes unfilled twice (the Scribe community is too small to populate it — review whether the path is structured correctly).

### Tertiary signals

- Tier-distribution conforms to roughly the 70:20:10 pyramid by Series 4-5.
- LORE burn rate within 20% of emission rate, stable.
- No single wallet holds more than 2% of LORE supply (excluding Treasury).
- No single contributor holds more than 10% of all Authorship NFTs in any single Series.
- Adversarial Reading Pass detection rate stable; bug-bounty catches per cycle in the 0-3 range (zero is suspicious, more than 3 indicates the pass is missing things).
- Wallet-cluster detection identifies 0-2 clusters per cycle in canon-eligible material.
- AI disclosure field is used honestly: distribution roughly matches population norms (most submissions disclose category (i)-(iii); category (v) submissions self-tag and remain in Hub).
- Discord/forum sentiment trends: regular review by an external community-research function.
- External fan-criticism / parody / unauthorized derivative-work emerges (a paradoxical positive signal — the world is alive enough to be played with).
- Resident Author cohort retention: at least 80% of Resident Authors offered the designation accept it; at least 80% of those who accept remain active for 2+ years.

### The single most important indicator

If, by Series 5, there exists a meaningful body of fan-canon Hub material that is read, cited, and built upon *by other fans* — independent of whether it is canon-promoted — and if at least one Resident Author has emerged from the contributor cohort, the architecture is working.

The point is not to mass-produce canon. The point is to produce a participatory cosmology in which fans bring their own contraband across the border. The Canon Council's job is to be a slow, careful, occasional adopter of the best of that contraband into core. The Hub's job is to host the rest, with permanent attribution, on-chain archival, and structural respect for the work — whether or not it is ever promoted. The Resident Author track's job is to ensure that when fan contraband is genuinely better than staff contraband, the platform can absorb that meritocratic pressure without either consuming the contributor (Homestuck failure) or rejecting them (RWBY failure).

The architecture answers the third voice's question with structural commitments rather than hopes. Cold-start is designed for, not assumed away. Hostile actors are designed against, not handled by reactive moderation. The crypto-refusenik writer-class is designed in, not assumed absent. The fan-better-than-team scenario is designed for as a success case, not handled as an exception. AI-generated submissions are addressed by policy, not detected reactively. Each of these is a pre-commitment by the platform to behave a particular way before the situation arises.

The contraband crosses the border because the border is structured to admit it, the audience is seeded to receive it, the attribution is bound to it the moment it crosses, the compensation is delivered without forcing the contributor through cryptography they don't want, and the canon is open enough to accept it when it deserves to be accepted.

Decisions, not options. — Participation Architecture v1, 2026-04-27.
