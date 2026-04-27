# LoreVault Participation Architecture — Synthesis V1
**Synthesized from:** 9 research dossiers (5 ecosystem + 4 crypto)
**Date:** 2026-04-27
**Author:** Opus Synthesis Agent

---

## §1 The Core Constraint

The platform must work for passive collectors on day one. Participation is upside, never a tax. This sentence is the load-bearing constraint of the entire architecture, and almost every other design choice in this document is downstream of it.

The research confirms this constraint with unusual unanimity. SCP Foundation's growth engine is passive-first access — anonymous web readers, no account required, zero friction to consume the [SCP wiki](https://scp-wiki.wikidot.com/). The 9,800+ articles and 6,300+ Tales accumulated over two decades because the gate was permanently open at the read-layer; participation grew on top of that floor, never replaced it. RWBY's collapse provides the inverse evidence — when Rooster Teeth migrated content behind paywalls and FIRST membership, the community erosion was measurable and irreversible. Homestuck's [70:20:10 participation pyramid](https://en.wikipedia.org/wiki/Homestuck) — 70% passive, 20% light engagement, 10% serious creators — held only because the bottom 70% never had to do anything. NFT projects that inverted this ratio (Jenkins the Valet, GRIPNR) extinguished. Top Shot's 1.6M users on Flow are a direct demonstration that a passive collecting product can work at scale on the same infrastructure LoreVault sits on, with credit-card checkout, email auth, and zero crypto literacy required.

What this means concretely for LoreVault's UX:

A passive collector in Series 1 must be able to (a) buy a pack of Pane cards through a credit card or Apple Pay flow indistinguishable from buying [Disney Pinnacle](https://disneypinnacle.com/) or Top Shot, (b) view their collection in a clean gallery interface that requires no understanding of axioms, contraband, or cosmological variants, (c) trade cards on a peer-to-peer marketplace with USD pricing, (d) miss every Discord drop, every theory thread, every fan-canon submission, and still feel that they own a complete and meaningful product. The flavor-text on each card must be self-contained — readable as standalone literary fragment, not as a fetch-quest pointer to a wiki entry. The art and the card metadata must do the entire job of making the object feel valuable. If the passive collector ever feels that their card is a partial product whose meaning lives elsewhere, the constraint has been violated.

There is a second, more subtle requirement that the research surfaces: the passive collector must not be punished by participation features. NounsDAO's $27M fork cascade is the cautionary tale here — when participation mechanics (governance, treasury) became coupled to NFT value, holders who didn't participate were structurally diluted by holders who did. LoreVault's participation rewards must be additive to participants, never subtractive from non-participants. The Engaged-Reader who finds a hidden lore breadcrumb earns a cosmetic badge; the Passive Collector who never sees the breadcrumb still owns the same card with the same floor price. The two paths must be parallel, not zero-sum.

Third: Disney Pinnacle's free monthly capsule and Top Shot's free moments at onboarding establish the template — passive-first onboarding means giving something away before asking for anything. LoreVault's day-one experience for an unconverted visitor should include a free "Apprentice Pane" card that is real, on-chain, tradable, and complete-in-itself. Not a tutorial token. A real card.

The constraint, restated as a design rule: **anything that requires a Discord account, a wallet seed phrase, a wiki edit, a theory post, or any action beyond "buy and hold" must be optional, additive, and invisible to the collector who declines it.**

---

## §2 Participation Tier Architecture

LoreVault uses a five-tier participation model. Tiers are not gates — a user in Tier 0 is not "below" a user in Tier 4; they are running a different (and equally legitimate) loop on the same product. Tier transitions are voluntary, reversible, and do not affect the underlying NFT ownership rights of any tier.

### Tier 0 — Passive Collector

**Mechanic:** Buy packs, own cards, trade cards. Nothing else required.

**What they have:** A wallet (custodial Flow account, opened with email + credit card, no seed phrase ever exposed unless requested). A collection gallery. A marketplace. A floor price. The full literary text of every card they own, rendered as readable flavor — not as wiki-stub. Card art at archival resolution. A transaction history. Read access to the public-canon Pane summaries (one paragraph per Pane, baked into the card metadata, not fetched from external CMS).

**What the product looks like to them:** Indistinguishable from Top Shot or Disney Pinnacle in shape. A series drops, they buy a pack, they get cards, they hold or trade. They never see the word "contraband." They never visit the wiki. The Canon Council does not exist for them. They are 95% of Series 1 by design and ~70% of Series 4 by design (Homestuck pyramid, validated).

**Structural feature for upgrade:** None. Tier 0 is a terminal, fully-supported state. Upgrade is opt-in pull, never push. The only signal that more exists is a single unobtrusive "Lore" tab in the gallery, which a Tier-0 user can ignore forever.

### Tier 1 — Engaged Reader

**Mechanic:** Reads the flavor-text deeply, follows the official Pane drops on social, may follow a Discord channel in read-only mode. Does not post.

**Soft incentive for upgrade from T0:** Hidden lore breadcrumbs. Each card carries a small literary fragment that, when read across the full Pane set, forms a larger narrative — an axiom-trail. The Engaged Reader who notices the trail unlocks a free cosmetic — an alternate card-frame ("Reader's Sigil") that visually marks their copy of the card without affecting its market value or rarity. This is the [Pokémon Go medal](https://pokemongo.fandom.com/wiki/Medal) pattern: cosmetic recognition for paying attention, with zero impact on the collectible's tradable value.

**What they have:** Everything T0 has, plus the Reader's Sigil overlay on cards where they triggered it, plus a personal "lorebook" view that aggregates the flavor-text across their collection into a continuous reading experience. The lorebook is a UX feature, not a token.

### Tier 2 — Theory-Crafter

**Mechanic:** Posts theories in Discord or on the LoreVault forum. Annotates cards with public-facing notes ("Margin Notes" — a per-card annotation feature visible to other users). Joins the Theory Channel.

**Structural reward:** A non-transferable Contribution NFT badge ("Marginalia") minted to their wallet on first published Margin Note. The badge accrues — Marginalia I, II, III — based on the count of their notes that get upvoted (not token-weighted; one-account-one-vote, with sybil defense via existing NFT holdings). The badge does not grant governance, does not grant token, does not grant economic rights. It is reputation, kept on-chain so it survives any platform shutdown. Top theory-crafters per Series get an invitation (not an obligation) to the Tier-3 contributor program.

**What they have:** Everything T1 has, plus Margin Notes on their cards, plus the Marginalia badge series, plus a public profile page showing their badges.

### Tier 3 — Contributor

**Mechanic:** Submits fan-canon entries via the Contraband Submission interface (see §5). Submissions can be: (a) short fiction set in an existing Pane, (b) art for an existing card or proposed card, (c) a theory-essay, (d) a fully-specified alternate-Pane proposal, (e) an "axiom extension" — a small mechanical/cosmological detail that resolves an ambiguity in an existing Pane.

**Structural reward:** Three things, in this order:

1. **Authorship NFT.** Every submission, accepted or not, mints a non-transferable Authorship NFT to the contributor. This is the attribution-debt defense (Homestuck failure mode). The submission and its author are bound on-chain, immutably, the moment the submission is made — before any editorial review. If the submission is later promoted to canon, no one can erase or reassign authorship. If the submission is rejected, the Authorship NFT remains as a personal archival record.

2. **LORE token grant.** Accepted submissions earn LORE tokens (see §3). Token amount is not auction-based, not token-weighted-vote-based — it's a fixed grant scaled by submission category (short fiction: X LORE; axiom extension: 3X LORE; full Pane proposal: 10X LORE), set by Canon Council bylaws and adjustable only via constitutional amendment.

3. **Fan-Canon Hub publication.** Accepted submissions are published to the LoreVault Fan-Canon Hub (see §4) — distinct from core canon, but indexed, searchable, citable, and on-chain-archived. This mirrors SCP's "Canon Hub" mini-canons system, which lets fan-clusters build internally-consistent micro-worlds inside the larger frame without forcing every contribution to compete for core-canon status.

**What they have:** Everything T2 has, plus Authorship NFTs for each submission, plus LORE tokens, plus a Fan-Canon Hub byline, plus eligibility for the Tier-4 promotion path.

### Tier 4 — Canon-Promoted Contributor

**Mechanic:** A subset of Tier-3 work is promoted by the Canon Council into core canon. Promotions are rare, deliberate, and structurally constrained — secondary character names, minor axiom-extensions, set-themes, occasionally a full Pane (no more than one fan-promoted Pane per Series, ever).

**Reward + status:**
1. **A "Canon Mark" NFT** — non-transferable, distinct visual, listed on the contributor's profile. Permanent.
2. **A royalty share** on the specific cards or Series elements derived from their contribution. This is structurally similar to Bored Ape's per-character commercial rights, but inverted: instead of the holder getting commercial rights to their character, the *contributor* gets a perpetual on-chain royalty stream (small — 1-3% of secondary-market royalties on the affected cards) for work they produced. The royalty is paid via Flow's royalty-enforcement primitives, not by company API.
3. **A seat on the Canon Council nomination pool.** Tier-4 contributors are eligible (not entitled) to be nominated for Council seats in future cycles. This is a deliberate slow drip — the Council must accumulate fan-promoted seats over time, never become majority-fan in one cycle.
4. **Public attribution on every card derived from their contribution.** The card metadata permanently lists the contributor by their chosen handle and links to their submission archive.

**What they have:** Everything T3 has, plus Canon Mark, plus royalty stream, plus Council eligibility, plus permanent metadata attribution on derived cards.

The five tiers are not a funnel. They are a menu. A user can sit in T0 forever; a user can jump from T0 to T3 without passing through T1 and T2; a user can drop from T3 back to T0 by simply not submitting. The Authorship NFTs and Canon Marks already earned remain in their wallet regardless. Disengagement does not cost the user their archive.

---

## §3 Token-Economy Design (fungible + non-fungible)

The economy has two fully-separated layers: a fungible token (LORE) for participation incentives and platform sinks, and a non-fungible reputation/attribution layer (Authorship NFTs, Marginalia badges, Canon Marks) for governance signal and historical record. The two layers must not be convertible. Buying LORE must never grant governance weight; earning a Canon Mark must never produce LORE windfall. This separation is the central anti-capture defense and the explicit response to the Steemit/Hive failure mode (stake-weighted curation → vote-buying → hostile takeover).

### Fungible token: LORE

**Name:** LORE.

**Supply:** Fixed cap of 1,000,000,000 LORE. No inflation. No founder-controlled mint key. The mint authority is locked at deploy and exhausts according to a schedule baked into the [Cadence smart contract](https://cadence-lang.org/) on Flow.

**Distribution mechanism (over a 10-year emission curve):**
- 40% — Contribution rewards (paid out to Tier-3+ contributors via §2 mechanics, on a per-Series budget set by Canon Council bylaws).
- 20% — Passive-collector airdrops, distributed proportionally to NFT holdings on snapshot dates, with a cap to prevent whale capture (no single wallet receives more than 0.1% of any single airdrop event regardless of holdings).
- 15% — Treasury, controlled by Canon Council with multi-sig and a 30-day timelock on all spends above a threshold.
- 15% — Team and investors, vested over 4 years with a 1-year cliff.
- 10% — Liquidity provisioning and market-making reserve.

The 40% contribution-reward pool is the heart of the system; the 20% passive-airdrop pool is the structural promise that holders are not subsidizing contributors at their own expense.

**Sink mechanism (utility burn):**
- Submission staking: every Tier-3 submission requires staking a small LORE amount (refunded if accepted, burned if rejected for spam/quality, retained-pending-review otherwise). This is a quality filter, not a paywall — the stake is small enough that any genuine contributor can afford it (subsidized for first-time contributors via a faucet — see §3 onramps), large enough that bot/spam submission is uneconomic.
- Pane proposal escrow: full-Pane proposals require a larger LORE stake, escrowed for the duration of the review window.
- Margin Note pinning: a Tier-2 user can spend LORE to pin one of their notes to a card-page they own. The LORE is burned on pin.
- Cosmetic frame upgrades: alternate frames, signature animations, and other purely-cosmetic NFT modifications are LORE-priced and the LORE is burned.
- Canon Council nomination fee: nominating someone (including yourself) for the Council costs LORE, burned.

The sinks are calibrated so that during normal operation the platform burns LORE at approximately the rate emissions release it. This is an explicit design goal, not a market hope. If the burn-rate falls behind, sinks get added; emissions are not increased.

**What LORE is NOT:** Not a security. Not a vote. Not a profit-share. Not redeemable for cash from the platform. Not a stand-in for engagement-score. Not a price-oracle for NFTs. The bonding curve, if any, runs on a peripheral DEX, never as the marketplace's pricing mechanism (per the curation-markets dossier, the bonding curve must run below the NFT marketplace, not as its oracle).

### Non-fungible participation badges

These are the governance-signal layer. They are earned, not bought. They are non-transferable (soulbound). They are minted to the contributor's wallet and stay there permanently. Three families:

1. **Marginalia (I-X):** Tier-2 reputation, awarded for upvoted Margin Notes.
2. **Authorship NFTs:** Tier-3 attribution, one per submission, regardless of acceptance.
3. **Canon Marks:** Tier-4 promotion, one per canon-promoted contribution.

Governance weight is computed from these badges, not from LORE balance. The Canon Council's nomination/election process uses Authorship-and-Canon-Mark counts as eligibility filters, never LORE balance. A whale can buy 5% of total LORE supply tomorrow and have zero additional governance influence.

### Anti-capture: how do we prevent whales from monopolizing canonical-contribution status?

Four overlapping defenses:

1. **Governance is keyed to non-transferable badges, not transferable tokens.** A whale cannot buy Canon Marks. They are minted only on canon promotion, and promotion is decided by the Canon Council, not by token-holder vote.

2. **Submission slots are rate-limited per wallet.** A given wallet can submit at most N short fictions, M art pieces, K axiom extensions per Series. A whale cannot flood the contribution queue.

3. **Per-wallet airdrop caps.** No single wallet ever receives more than 0.1% of any LORE airdrop event regardless of NFT holdings. This neutralizes the buy-everything-pre-snapshot attack.

4. **Canon Council seat caps.** No more than 30% of Council seats can be held by Tier-4 contributors at any time, and no more than 2 seats per real-person identity (verified via off-chain attestation, not strictly enforced on-chain but enforced via Council bylaw and member oath).

### Anti-pay-to-play: how do we ensure the contribution gate is QUALITY not WEALTH?

Five mechanisms:

1. **Submission staking is small and refundable.** The stake is calibrated to filter spam, not to filter income.

2. **First-time-contributor faucet.** Any wallet that holds at least one Pane card and has never submitted before gets a one-time free LORE grant sufficient for their first three submissions. A user can become a Tier-3 contributor with zero LORE outlay beyond the cost of a single card.

3. **Engagement score is blind to purchase price.** Per the Top Shot failure-mode dossier — the score that matters for Council eligibility, contributor reputation, and badge accrual measures *what people do* (hold duration, set diversity, challenge completion, lore contribution count, peer-upvote count), never *what they spent*. A holder of a single common card who writes brilliant Margin Notes outranks a whale who holds the entire set and has never posted.

4. **Curation is editorial, not market-priced.** Canon promotion decisions are made by the Canon Council on quality criteria, with documented deliberation. There is no auction for canon. There is no token-weighted vote for canon. The TCR (token-curated registry) model failed for subjective quality and is explicitly rejected here.

5. **Quality criteria are published and stable.** The Council publishes its review rubric and edits to the rubric require constitutional amendment. A contributor knows what the bar is before submitting; the bar does not move based on who is submitting.

### Onramps for non-crypto-native users (custodial Flow accounts)

Flow's existing onboarding (Dapper Wallet, [Niftory](https://niftory.com/), email-auth, credit-card checkout, USD pricing) is the baseline. LoreVault inherits all of it. A new user signs up with email + Apple Pay, gets a custodial Flow account, buys their first pack, owns real on-chain NFTs, never sees a seed phrase. Self-custody is available for users who want it (one-click export of the wallet to a self-custodial Flow address). The default is custodial; the upgrade is voluntary.

For Tier-3+ contributors, a "graduate to self-custody" prompt appears once they've earned their first Authorship NFT — framing self-custody as a contributor-grade feature, not a prerequisite.

### Off-ramps and exits

A user must be able to disengage without losing their archive. Three guarantees:

1. **NFTs remain on-chain regardless of platform state.** All Pane cards, Authorship NFTs, Marginalia badges, and Canon Marks are stored on Flow with metadata pinned to [IPFS](https://ipfs.tech/) and content hashes recorded on-chain. If LoreVault the company disappears, the NFTs persist and can be displayed by any compliant Flow wallet or third-party gallery.

2. **A user can export their full archive.** A "download my archive" function produces a signed bundle containing all Margin Notes, all submissions (accepted or rejected), all Authorship NFT references, and a manifest. The bundle is platform-independent and can be re-uploaded to a successor platform or self-hosted indefinitely.

3. **A user can revoke their LoreVault account without burning their NFTs.** Account deletion deactivates the platform login but does not affect on-chain assets. The custodial wallet can be transitioned to self-custody at any time, including after account deletion.

The design rule: **the platform is a viewer over the archive, not the archive itself.** RWBY's collapse demonstrated that when the community owns nothing, corporate failure is community extinction. LoreVault holders own their archive on-chain.

---

## §4 Curation + Quality Control

The curation system has three layers, ordered from broad to narrow:

### Layer 1: Open Fan-Canon Hub (no editorial review)

Any Tier-3 submission, after staking the small LORE fee, is auto-published to the Fan-Canon Hub immediately. The Hub is searchable, indexed, on-chain-archived, and labeled clearly as fan-canon (NOT core-canon). This is the SCP-Foundation model: low gate, high volume, format-enforced quality. The "format" in LoreVault's case is the submission template — submissions must conform to a structured schema (see §5) that enforces the contraband framing and forces the contributor to declare which Pane they're operating within, what axiom they're proposing, and what existing canon they're touching.

The Hub is the participation surface for 99% of contributors. Core canon is the exception, not the goal.

### Layer 2: Community curation (Marginalia upvotes, Hub featured-shelf)

Hub entries accumulate Marginalia upvotes from any Tier-2+ user. Highly-upvoted entries are promoted to a "Featured Shelf" — visible on the Hub homepage, likely to be read by Council members during canon review. Upvoting is one-account-one-vote (sybil-defended via NFT-holding requirement), not token-weighted. Vote-buying is structurally impossible because votes cannot be transferred and the LORE token has no governance weight.

The Featured Shelf is not a promotion to canon. It's a visibility boost.

### Layer 3: Canon Council review (final gate to core canon)

The Canon Council is the editorial committee, modeled on the doctrine. Composition:
- 7 seats total (odd number, deliberately small).
- 4 seats: founding editorial team (LoreVault staff, lore architects, art directors).
- 2 seats: Tier-4 contributors elected from the contributor pool by Authorship-NFT-holders (one-account-one-vote).
- 1 seat: rotating community seat, drawn by lottery from Tier-2+ holders for a 6-month term.

Term length: 2 years for staff seats, 1 year for contributor seats, 6 months for the lottery seat. Staggered terms — never more than half the Council turns over in a single cycle.

Step-by-step process when a fan submits a contribution intended for canon promotion:

1. **Submission.** Contributor opens the Contraband Submission interface, selects category (short fiction, art, theory, axiom-extension, full Pane proposal), selects target Pane, fills out the structured template (see §5), stakes the required LORE.

2. **Auto-publication to Hub.** Within minutes, the submission is live on the Fan-Canon Hub with an Authorship NFT minted to the contributor.

3. **Open community window (30 days).** Tier-2+ users can read, upvote, and post Margin Notes referencing the submission.

4. **Council shortlist.** At the end of each Series cycle (6 months), the Council reviews the Featured Shelf (top-upvoted submissions) and any Council-member-nominated submissions. Shortlist size: 20-50 submissions per cycle.

5. **Council deliberation.** Each shortlisted submission is reviewed against a published rubric: (a) lore-coherence (does it conform to the Pane's existing axioms or extend them rationally?), (b) literary quality (writing, art, conceptual depth), (c) attribution clarity (is it the contributor's original work, properly clearing any external references?), (d) contraband legitimacy (does it bring genuine new contraband across the border, or is it a rehash?), (e) cross-Pane compatibility (does it create contradictions with existing canon in other Panes?).

6. **Vote.** Council members vote yes/no/defer on each submission. Promotion requires a 5-of-7 supermajority (deliberately high). A "defer" vote returns the submission to the Hub with feedback for possible resubmission next cycle.

7. **Promotion.** Promoted submissions are minted as Canon Marks to the contributor, royalty terms attached, public canon documents updated, contributor's profile receives the Canon Mark badge, derived cards (if any) are issued in the next pack drop with metadata attribution.

8. **Public deliberation log.** Council deliberations are summarized and published — not full transcripts, but a per-decision rationale paragraph. This is the [Wikipedia AfD](https://en.wikipedia.org/wiki/Wikipedia:Articles_for_deletion) transparency model. Contributors who were rejected know why; the community can audit Council decisions for capture or bias.

The 5-of-7 supermajority is deliberately high to make canon promotion conservative. The volume of fan-canon should remain in the Hub, where it lives indexed and citable but distinct from core. The doctrine's commitment to "no more than one fan-promoted Pane per Series, ever" is enforced as a Council bylaw, amendable only by constitutional amendment.

---

## §5 The "Contraband Across the Border" Mechanic

This is the heart of the design and the explicit answer to the third-voice critique. The doctrine teaches that every Pane has a buried weight — a contraband — a hidden axiom that defines what crosses between worlds. Fan participation, in the doctrine's own framing, is fans bringing their own contraband across the border. The submission interface must make this metaphor literal — make the act of contributing feel like smuggling, not form-filling.

### The Contraband Submission Interface

The submission UI is structured as a four-step "border crossing." The language is deliberate; the cosmology is deliberate; the mechanics are deliberate.

**Step 1: Declare your origin.**
The contributor selects which Pane they're operating from (or "outside-Pane" for cross-cutting work). This grounds the submission in the existing cosmological substrate.

**Step 2: Declare your contraband.**
A structured field titled "What contraband are you bringing across?" The contributor must write a one-sentence declaration of the specific axiom, character, object, or event they are proposing to introduce. This is not optional. This is the load-bearing field. It forces the contributor to articulate, before they write a word of fiction, what they are *adding* to the world. This is the SCP "containment template" mechanism translated to LoreVault's metaphor.

The declaration field is structured: contributor selects a category (axiom-extension, character, object, event, place, ritual) and writes the one-sentence statement. Examples:
- "An axiom that in this Pane, mirrors record but never reflect."
- "A secondary character — the cartographer who maps borders that don't yet exist."
- "An object — the Lantern of Forgotten Names, which illuminates only what has been deliberately erased."

The declaration becomes the title-card of the submission and is the indexed, searchable, on-chain-archived primary metadata.

**Step 3: Declare the customs cost.**
A structured field titled "What does this cost the world to admit?" The contributor must articulate the constraint or trade-off the contraband imposes on the existing canon. This is the doctrine's "buried weight" requirement. Contraband that costs nothing is not contraband — it's decoration. This field forces the contributor into the doctrine's philosophical frame and produces submissions that are *coherent with the cosmological model* by construction, not by editorial enforcement.

**Step 4: The crossing.**
The contributor writes the actual submission — short fiction, theory, art description, full Pane spec. The text is freeform but the prior three structured fields provide the editorial spine. The interface presents this step with explicit "border crossing" framing — an animated transition, language about "stepping across the threshold," a final review step where the contributor confirms the contraband and the cost before staking LORE and submitting.

### "Off-canon" submission vs. "canon-proposal"

Every submission is, at first, off-canon. There is no "canon-proposal" submission type. There is only submission-to-Hub, and from the Hub, the Council may promote. This is deliberate: it removes the social pressure of "submitting for canon" and lets every contribution stand on its own as Hub literature. A submission can become canon, but it does not have to want to be canon to be valuable.

A contributor who explicitly does *not* want their work considered for canon promotion can mark the submission "Off-Canon Permanent." This is preserved as on-chain metadata. The Council will not review such submissions for promotion. This protects contributors who want to write in the world without the burden of canon-aspiration.

A contributor whose submission is rejected for canon but remains in the Hub is in the same state as a contributor who never aspired to canon. There is no rejected-bin. The Hub is the destination, with canon as an occasional secondary outcome.

### Proposing a whole new Pane

Full-Pane proposals are a special category with three differences:

1. **Higher LORE stake.** Roughly 10x the standard submission stake.
2. **Mandatory pre-submission consultation.** The contributor must post a "Pane Sketch" to a dedicated Discord/forum channel and receive at least 5 community responses (any tier) before the formal submission can be filed. This is rough-consensus pre-vetting; it filters obvious incoherence early and binds the contributor to the community's existing cosmological constraints.
3. **Extended Council review window.** Pane proposals are reviewed over 2 cycles (12 months) rather than 1, with the contributor able to revise based on Council feedback between cycles.

Full-Pane proposals that succeed become "shadow Panes" in the doctrine's terminology — possible Panes that may or may not be activated in a future Series. The contributor has produced canon-eligible material; whether it ever gets a card-pack drop is a separate Council decision tied to the Series roadmap.

### Why this works

The contraband framing accomplishes three things at once:
1. **Quality filter without gatekeeping.** The structured declaration fields force coherence on contributors before any reviewer sees the work. Most low-quality submissions self-eliminate at Step 2 or Step 3 because the contributor cannot articulate genuine contraband or genuine cost.
2. **Doctrine alignment.** Every submission, accepted or rejected, is a contribution that engages the doctrine's central metaphor. The platform produces lore by its existence, not by editorial selection.
3. **Smuggling, not form-filling.** The metaphor is participatory and mythic, not bureaucratic. Contributors feel like they are doing something dangerous and worthwhile, not filling out a Google Form. This is the affective register that the SCP containment-template hits and that the [DM's Guild](https://www.dmsguild.com/) submission flow misses entirely.

---

## §6 Failure-Mode Pre-Emption

Each failure mode observed in research, paired with the specific structural defense LoreVault implements.

### 1. Authorial withdrawal / founder dependency

**Observed in:** Homestuck (Hussie's withdrawal catastrophe), early SCP (founder turnover handled badly initially).

**Defense:** The Canon Council's structure assumes founder absence. No single seat — including the founding-editor seats — can promote canon alone (5-of-7 supermajority). The deliberation rubric is published and amendable only by constitutional process. The Hub is auto-publishing, requires no founder approval, and would continue to operate if every founding-editor seat went vacant. The contraband interface is software, not editorial labor. A 12-month founder-absent operation is a non-event for Tier-0 through Tier-3 users.

### 2. Attribution debt (uncredited contributor work)

**Observed in:** Homestuck (the attribution scandal that ended the project), RWBY Fan Forge disputes.

**Defense:** Every submission, on the moment of staking, mints an Authorship NFT to the contributor's wallet. Attribution is bound to the work *before* any editorial review. No staff member, no Council, no future platform owner can erase or reassign authorship without forking the chain. Card metadata for canon-promoted contributions includes permanent contributor handles. The royalty stream for Tier-4 contributors is enforced by Flow's royalty primitives. There is no "we'll credit you later" surface anywhere in the platform.

### 3. Corporate capture / IP ownership risk

**Observed in:** RWBY (community owned nothing when RT collapsed), DM's Guild exploitation clause.

**Defense:** Holders own their Pane cards on-chain with Flow's standard NFT primitives. Per-card commercial rights are granted at mint, encoded in the metadata, and constitutionally protected against unilateral relicensing — the platform's terms of service include an explicit, irrevocable grant to holders for their card's depicted character/object/scene, modeled on Bored Ape's commercial-rights template. The Authorship NFT and Canon Mark systems give contributors an on-chain attribution record that survives any company shutdown. The Hub archive is pinned to IPFS with content hashes on-chain. If LoreVault Corp dies, the cards, the contributor records, and the lore archive all survive. This is the third-voice critique's "on-chain records are the only infrastructure that survives corporate failure" implemented as law.

### 4. Trademark squatting (Russian SCP scenario)

**Observed in:** SCP Foundation's $140K trademark fight against a $1,400 hostile registration.

**Defense:** Defensive trademark registration in all major jurisdictions (US, EU, UK, Japan, China, Russia, Brazil, Korea, Australia, India) for "LoreVault" and the Pane-series names *before* the corresponding Series ships. A standing legal budget for trademark defense, written into the Treasury allocation. A Foundation-style nonprofit entity holds the trademarks separately from LoreVault Corp — the IP cannot be sold off or compromised by acquisition of the operating company.

### 5. Platform dependency (Reddit RCP shutdown scenario)

**Observed in:** Reddit Community Points killed overnight in 2023; Top Shot reward changes.

**Defense:** The reward signal — Authorship NFTs, Marginalia badges, Canon Marks — is on-chain Flow data, not LoreVault company API. The LORE token is on-chain. The contribution archive is on IPFS. The platform UI is a viewer over this data; replacing LoreVault.com with a third-party viewer is a known, supported migration path. The platform commits, in its constitutional documents, to publish a complete data-portability spec and to maintain it as a public protocol — the API surface is part of the product, not an internal implementation detail subject to silent change.

### 6. Whale capture / plutocratic governance

**Observed in:** Steemit/Hive (stake-weighted curation captured), Friend.tech collapse.

**Defense:** Governance weight is keyed exclusively to non-transferable badges, never to LORE balance or NFT count. Per-wallet airdrop caps (0.1% of any single event). Per-wallet submission rate limits. Council seat caps (no more than 30% Tier-4-held, no more than 2 seats per real-person identity). Contributor election uses one-account-one-vote among Authorship-NFT-holders, with sybil defense via NFT holding requirement plus an off-chain identity attestation for elected seats.

### 7. Speculation spiral / pay-to-play degradation

**Observed in:** GRIPNR ($2.5M raised, one NFT sale), Jenkins the Valet, NounsDAO fork cascade.

**Defense:** Participation is never required for NFT value. Tier-0 holders are first-class users with full collectible value; participation rewards are additive cosmetic/reputational, never deflate Tier-0 holdings. LORE is structurally separated from collectible NFT value — there is no LORE/NFT bonding curve that lets speculation in one inflate the other. The platform's marketing language is collectible-first, participation-second. The first ad campaign for Series 1 says nothing about contribution mechanics.

### 8. Curation bottleneck / Canon Council capture

**Observed in:** RWBY Fan Forge bottleneck and disputes; DM's Guild editorial captures.

**Defense:** Multiple, parallel curation surfaces (Hub for fan-canon, Featured Shelf for community curation, Canon Council for core promotion). Canon promotion is the rare exception, not the goal — Hub publication is the actual destination for the volume of contributions. Council deliberations are publicly summarized for audit. Council seats are term-limited and staggered. The lottery seat injects unpredictable membership. Constitutional amendments require supermajority of Council *and* a supermajority of Authorship-NFT-holders voting one-account-one-vote.

### 9. Bad-actor injection (hostile/harmful content)

**Observed in:** Every open-submission system; SCP's experience with hostile content.

**Defense:** Submission staking provides a small economic friction against spam. The Hub is moderated for explicitly-defined categories of harmful content (illegal material, doxxing, harassment) by a Trust & Safety team operating under published policy, separate from Canon Council. Moderation actions are appealable to the Council. The on-chain Authorship NFT for a moderated-out submission is *not* burned — it remains as record that the submission existed and was moderated, with the moderation reason logged. This prevents Trust & Safety from being weaponized to erase contributors silently.

### 10. Fan-base fragmentation / schism

**Observed in:** Beyond Canon (Homestuck) failure; SCP's various branch-wikis.

**Defense:** The Hub's "Canon Hub" mini-canon model (per SCP's successful template) lets sub-communities build internally-consistent micro-worlds inside the larger LoreVault frame without forcing every contribution to compete for global core-canon status. A schism within LoreVault is structurally encouraged to take the form of a new mini-canon on the Hub, not a fork of the platform. The platform's IP grants and on-chain records make literal forks of the cosmology possible — anyone can take their NFTs and lore archive elsewhere — but the platform's Hub design is calibrated to make staying internally more attractive than leaving. The constitutional commitment to fan-canon hubs is the pressure-release valve.

---

## §7 Phased Rollout

The rollout is deliberately sequential. Each phase enables a tier of participation infrastructure and is gated on metrics from the prior phase. The principle is: **never enable a participation tier the platform isn't ready to support at quality.** A failed Tier-3 launch (contribution flood with no curation capacity) would damage the Hub's reputation more than a delayed launch would.

### Series 1 (Months 0-6): Passive-First Foundation

**Enabled:**
- Pane card minting (3-5 active Panes).
- Pack purchase via credit card / Apple Pay / Flow wallet.
- Custodial Flow account onboarding.
- Marketplace with USD pricing.
- Card gallery with embedded flavor-text and lore-tab.
- Free "Apprentice Pane" card on signup.
- Static, official-only Pane summaries (no fan-canon Hub yet).
- Discord channel (read-only for new accounts; light moderation).
- Trademark filings completed in 9 jurisdictions before pack drop.

**Not enabled:** LORE token, fan submissions, Canon Council, Tier-3+ infrastructure.

**Tier distribution target:** 95% Tier-0, 5% Tier-1.

**Metrics gating advancement:**
- 50,000+ unique wallets holding at least one Pane card.
- $5M+ secondary marketplace volume in 6 months.
- <1% support-ticket rate per active wallet (UX healthy).
- Discord population large enough to seed an initial contributor pool — ~10K members.
- Trademarks granted or pending in all filed jurisdictions.

### Series 2 (Months 6-12): Reader Layer + Marginalia

**Enabled (in addition to Series 1):**
- Margin Notes feature on cards.
- Marginalia badge minting (Tier-2 reputation).
- Theory channels in Discord with posting rights for verified holders.
- Reader's Sigil cosmetic for breadcrumb-trail completion.
- Personal lorebook view.
- Public profile pages with badge displays.

**Not enabled:** LORE token, fan-canon submissions, Canon Council.

**Tier distribution target:** 80% T0, 18% T1, 2% T2.

**Metrics gating advancement:**
- 1,000+ active Tier-2 users (defined as 3+ upvoted Margin Notes in the period).
- Margin Note upvote-to-post ratio above 30% (community is engaging, not just posting).
- No major moderation incidents.
- Sentiment/quality assessment from an editorial review.

### Series 3 (Months 12-18): LORE Token + Fan-Canon Hub

**Enabled (in addition):**
- LORE token launch on Flow.
- Initial holder airdrop (capped per wallet).
- Contribution Submission interface (the "border crossing" UI).
- Authorship NFT minting on submission.
- Fan-Canon Hub (auto-publishing, browsing, voting).
- First-time-contributor LORE faucet.
- Community-upvote-driven Featured Shelf.
- Canon Council seated (founding 4 staff + 1 lottery; 2 contributor seats reserved for Series 4).

**Not enabled:** Canon promotion (no work is canon-promoted in Series 3). The Council reads, deliberates internally, but does not promote. This is a deliberate "warm-up cycle" — the Council reads the Hub, calibrates the rubric, publishes its first deliberation summaries, but no Canon Marks are minted.

**Tier distribution target:** 70% T0, 22% T1, 6% T2, 2% T3.

**Metrics gating advancement:**
- 500+ Tier-3 submissions in the cycle.
- Submission rejection rate (spam moderation) below 10%.
- Hub-traffic-to-submission ratio above 50:1 (read-write ratio healthy, per SCP norms).
- Council deliberation rubric published and stable for 90 days.
- LORE burn-rate within 20% of emission rate.

### Series 4+ (Months 18+): Full Canon Promotion

**Enabled (in addition):**
- First Canon Council promotion vote.
- Canon Mark NFTs minted.
- Royalty streams to canon-promoted contributors.
- 2 Tier-4 contributor seats elected to the Council.
- Full constitutional process for amendments.
- Fan-promoted content begins appearing in Series-card metadata.

**Tier distribution target (steady-state):** 70% T0, 18% T1, 8% T2, 3% T3, ~0.1-0.5% T4.

**Ongoing metrics:**
- ~1 fan-promoted Pane per Series (cap, not target).
- Canon Mark count grows by 5-15 per cycle.
- Hub volume continues compounding.
- Tier-distribution stable within ±5% of targets.
- LORE burn-rate stable.
- No major capture events.

---

## §8 The Test for Whether This Works

Per the third-voice critique: "will fans bring their own contraband across the border?"

This is the central question. The synthesis above is a guess at the architecture; the test is whether participation actually emerges. Four measurable proxies, with thresholds:

### Proxy 1: Hub submission volume

**Metric:** Number of Tier-3 submissions per Series cycle, after Series 3 (when the Hub is open).

**Threshold for "working":** 500+ submissions in Series 3 (the first open cycle); 2,000+ submissions per cycle by Series 5; 5,000+ per cycle by Series 8. This roughly tracks SCP's two-decade ramp compressed by a factor of 3-5 due to LoreVault's pre-existing collector audience.

**Threshold for "failing":** Fewer than 200 submissions in Series 3, or sub-100 net-new contributors per cycle. If the Hub is sparse, contraband isn't crossing — the platform is producing collectors, not a fan-canon ecosystem.

### Proxy 2: Read-to-write ratio

**Metric:** Ratio of Hub page-views to Hub submissions.

**Threshold for "working":** 50:1 to 200:1 (per SCP norms). High enough that submissions are read by actual humans, not just submitters reading their own work.

**Threshold for "failing":** Below 20:1 (the Hub is a parking lot for contributors who don't read each other) or above 1,000:1 (the Hub is a museum, not a participation surface).

### Proxy 3: Cross-contributor engagement

**Metric:** Average number of Margin Notes per submission referencing or building on other submissions.

**Threshold for "working":** Average of 2+ cross-references per Hub entry by Series 4 — meaning contributors are reading each other's work and building a connected web of fan-canon, not parallel monologues.

**Threshold for "failing":** Sub-0.5 average; contributors are isolated.

### Proxy 4: Contraband adoption into core canon

**Metric:** Number of canon-promoted contributions per Series, and the percentage of new core-canon material that originated as fan submissions.

**Threshold for "working":** 5-15 Canon Marks per Series by Series 5; 10-20% of new core-canon material in any given Series originates as fan-promoted contributions by Series 6.

**Threshold for "failing":** Zero promotions for two consecutive cycles after Series 4 (the Council is over-conservative or the Hub quality is too low — diagnose) or all promotions concentrated in <5 contributors (capture is occurring — diagnose).

### Tertiary signals

- Tier-distribution conforms to roughly the 70:20:10 pyramid by Series 4-5.
- LORE burn rate within 20% of emission rate, stable.
- No single wallet holds more than 2% of LORE supply (excluding Treasury).
- No single contributor holds more than 10% of all Authorship NFTs in any single Series.
- Discord/forum sentiment trends: regular review by an external community-research function.
- External fan-criticism / parody / unauthorized derivative-work emerges (a paradoxical positive signal — the world is alive enough to be played with).

### The single most important indicator

If, by Series 5, there exists a meaningful body of fan-canon Hub material that is read, cited, and built upon *by other fans* — independent of whether it is canon-promoted — the architecture is working. The point is not to mass-produce canon. The point is to produce a participatory cosmology in which fans bring their own contraband across the border.

The Canon Council's job is to be a slow, careful, occasional adopter of the best of that contraband into core. The Hub's job is to host the rest, with permanent attribution, on-chain archival, and structural respect for the work — whether or not it is ever promoted.

Decisions, not options. — Participation Architecture v1, 2026-04-27.
