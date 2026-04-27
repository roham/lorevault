# LoreVault Participation Architecture — Synthesis V3
**Synthesized from:** 9 research dossiers + 4 gap analyses + Phase 5B review  
**Date:** 2026-04-27  
**Author:** Opus Synthesis Agent (V3)  
**Patches from V2:** (1) Token economy numbers + instability governance; (2) Contraband state machine + Authorship NFT schema; (3) Pane-structure load-bearing governance

---

## §1 The Core Constraint

The platform must work for passive collectors on day one. Participation is upside, never a tax. This sentence is the load-bearing constraint of the entire architecture, and almost every other design choice in this document is downstream of it.

The research confirms this constraint with unusual unanimity. SCP Foundation's growth engine is passive-first access — anonymous web readers, no account required, zero friction to consume the [SCP wiki](https://scp-wiki.wikidot.com/). The 9,800+ articles and 6,300+ Tales accumulated over two decades because the gate was permanently open at the read-layer; participation grew on top of that floor, never replaced it. RWBY's collapse provides the inverse evidence — when Rooster Teeth migrated content behind paywalls and FIRST membership, the community erosion was measurable and irreversible. Homestuck's [70:20:10 participation pyramid](https://en.wikipedia.org/wiki/Homestuck) — 70% passive, 20% light engagement, 10% serious creators — held only because the bottom 70% never had to do anything. NFT projects that inverted this ratio (Jenkins the Valet, GRIPNR) extinguished. Top Shot's 1.6M users on Flow are direct demonstration that a passive collecting product can work at scale on the same infrastructure LoreVault sits on, with credit-card checkout, email auth, and zero crypto literacy required.

V3 holds the V2 deepening of the constraint in two directions. First, **non-coercion at the participation gate, not just the collector gate.** A user who wants to write fan-canon must not be required to hold a token, learn a wallet, or interact with crypto infrastructure of any kind. The custodial-Flow-account answer of V1 solves this for collectors but leaves the writer-class — historically the most prolific cohort on every fan-canon platform — partially excluded. The Scribe Path (§3) is a parallel non-tokenized track for that population. Second, **non-coercion across the cold-start period.** Tier-0 holders in Series 1 and Series 2 are the only users that exist; the architecture must not punish them with an empty Hub or a participation-tax in S3. The platform must feel complete-and-alive at every phase, including phases where organic participation is near zero (§7).

Concretely, a passive collector in Series 1 must be able to (a) buy a pack of Pane cards through a credit-card or Apple Pay flow indistinguishable from buying [Disney Pinnacle](https://disneypinnacle.com/) or Top Shot, (b) view their collection in a clean gallery interface that requires no understanding of axioms, contraband, or cosmological variants, (c) trade cards on a peer-to-peer marketplace with USD pricing, (d) miss every Discord drop, every theory thread, every fan-canon submission, and still feel they own a complete and meaningful product. The flavor-text on each card is self-contained — readable as standalone literary fragment, not as a fetch-quest pointer to a wiki entry. The art and the card metadata do the entire job of making the object feel valuable.

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

**Structural feature for upgrade:** None as obligation, but two as discoverable affordances introduced post-S2: a one-click "read the lore behind this card" link in the gallery that surfaces Hub entries referencing the card's Pane, and an opt-in monthly "Hub Highlights" email featuring 3-5 Curator-selected entries. The lore-link itself opens a "quiet-read" panel that does not surface upvote/comment UI — the social layer is only revealed if the user clicks into the Hub proper. Both opt-in, both ignorable. Discovery without coercion.

### Tier 0.5 — Silent Reader (instrumentation, not UI)

A measurement category, not a feature. Users (logged-in or anonymous) who read Hub pages without voting, posting, or submitting. Tier 0.5 daily-active count is the leading indicator of cold-start health. A Hub with 10 submissions and 500 daily Tier-0.5 readers will eventually grow contributors. A Hub with 100 submissions and 10 Tier-0.5 readers is dying. The dashboard tracks this explicitly; rollout gates depend on it (§7).

### Tier 1 — Engaged Reader

**Mechanic:** Reads flavor-text deeply, follows official Pane drops on social, may follow a Discord channel in read-only mode. Does not post.

**Soft incentive for upgrade from T0:** Hidden lore breadcrumbs. Each card carries a small literary fragment that, when read across the full Pane set, forms a larger narrative — an axiom-trail. The Engaged Reader who notices the trail unlocks a free cosmetic — an alternate card-frame ("Reader's Sigil") that visually marks their copy of the card without affecting its market value or rarity. This is the [Pokémon Go medal](https://pokemongo.fandom.com/wiki/Medal) pattern: cosmetic recognition for paying attention, with zero impact on the collectible's tradable value.

The free Reader's Sigil is visually distinct from any LORE-burned cosmetic frame. This is a deliberate design rule: free engagement-cosmetics and paid sink-cosmetics live in different visual registers (Sigils are subtle overlays; LORE frames are full-card stylings) so that the Tier-0 collector is never confronted with a "fancier-looking same card" they could only have obtained by burning tokens.

**What they have:** Everything T0 has, plus the Reader's Sigil overlay on cards where they triggered it, plus a personal "lorebook" view that aggregates flavor-text across their collection into a continuous reading experience.

### Tier 2 — Theory-Crafter

**Mechanic:** Posts theories in Discord or on the LoreVault forum. Annotates cards with public-facing notes ("Margin Notes" — a per-card annotation feature visible to other users). Joins the Theory Channel.

**Structural reward:** A non-transferable Contribution NFT badge ("Marginalia") minted to their wallet on first published Margin Note. The badge accrues — Marginalia I, II, III — based on the count of their notes that get upvoted (one-account-one-vote, sybil defense via existing NFT holdings). The badge does not grant governance, does not grant token, does not grant economic rights. It is reputation, kept on-chain so it survives any platform shutdown. Top theory-crafters per Series get an invitation (not an obligation) to the Tier-3 contributor program.

**Scribe sub-class:** A T2 Scribe (email account, no wallet) earns a parallel **Quill** counter that increments on the same criteria. Quill is account-attached, not on-chain. If the Scribe later graduates to a wallet, accumulated Quill mints retroactively as Marginalia NFTs. Council eligibility treats Quill counts as equivalent to Marginalia counts for the Scribe-elected contributor seat (§4).

### Tier 3 — Contributor

**Mechanic:** Submits fan-canon entries via the Contraband Submission interface (§5). Submissions can be: (a) short fiction set in an existing Pane, (b) art for an existing card or proposed card, (c) a theory-essay, (d) a fully-specified alternate-Pane proposal, (e) an "axiom extension" — a small mechanical/cosmological detail that resolves an ambiguity in an existing Pane, (f) a **cross-Pane contraband submission** — a submission whose contraband proposes a movement, exchange, or connection between two existing Panes (see §3.5 for the elevated reward structure).

**Structural reward, three things in this order:**

1. **Authorship NFT.** Every submission, accepted or not, mints a non-transferable Authorship NFT to the contributor's wallet (or to the Attribution Escrow with the Scribe Account ID inscribed, for Scribes). This is the attribution-debt defense (Homestuck failure mode). The submission and its author are bound on-chain immutably the moment the submission is made — before any editorial review. If the submission is later promoted to canon, no one can erase or reassign authorship. If the submission is rejected, the Authorship NFT remains as personal archival record. The full schema is in §5.2.

2. **LORE token grant** (wallet-holder contributors) **or fiat bounty** (Scribe contributors). Accepted submissions earn rewards. Token amount is a fixed grant scaled by submission category, set by Canon Council bylaws, with USD-floor adjustment quarterly (see §3 for actual numbers). The fiat bounty for Scribes is sized to be roughly equivalent to the LORE grant at then-current market price.

3. **Fan-Canon Hub publication.** Accepted submissions are published to the LoreVault Fan-Canon Hub (§4) — distinct from core canon, but indexed, searchable, citable, and on-chain-archived. This mirrors SCP's "Canon Hub" mini-canons system, which lets fan-clusters build internally-consistent micro-worlds inside the larger frame without forcing every contribution to compete for core-canon status.

### Tier 4 — Canon-Promoted Contributor

**Mechanic:** A subset of Tier-3 work is promoted by the Canon Council into core canon. Promotions are rare, deliberate, and structurally constrained — secondary character names, minor axiom-extensions, set-themes, occasionally a full Pane (default cap: 1 fan-promoted Pane per Series; raisable to 2 per Series by the same 5-of-8 Council supermajority that promotes any individual work; >2 per Series requires constitutional amendment).

**Reward + status:**
1. **A "Canon Mark" NFT** — non-transferable, distinct visual, listed on contributor's profile. Permanent. (Held in Attribution Escrow for Scribes, claimable on graduation to wallet.)
2. **A royalty share** on the specific cards or Series elements derived from their contribution. The royalty rate is set at promotion time by the Council from a fixed two-tier table: 1.5% (default) or 3.0% (reserved for fully-specified Pane proposals and cross-Pane contraband promotions). Enforced via Flow's royalty-enforcement primitives, not by company API. Scribes receive royalty as quarterly fiat distribution from the Treasury, with annual 1099/equivalent tax forms generated automatically.
3. **A seat on the Canon Council nomination pool.** Tier-4 contributors are eligible (not entitled) to be nominated for Council seats in future cycles.
4. **Public attribution on every card derived from their contribution.** Card metadata permanently lists the contributor by their chosen handle and links to their submission archive.

### Tier 4R — Resident Author (the meritocratic-uncomfortable promotion)

A contributor with 3+ Canon Marks is eligible for elevation to **Resident Author** status. Resident Authors receive a salary or retainer from the LoreVault Treasury (~$60-120K/yr equivalent, paid in fiat or LORE per recipient preference), are commissioned for explicit Pane work with full credit and full Tier-4 royalty, and are placed on an automatic Council nomination track with the expectation of rotating onto the Council within 1-2 cycles. The designation is offered, not imposed; refusal is structurally protected and does not reduce the contributor's existing Tier-4 status.

The Resident Author track is the architecture's pre-committed answer to the case where a fan contributor's work is consistently better than staff output. The Homestuck failure mode (talent absorption without compensation) and the RWBY Fan Forge failure mode (talent rejection through gatekeeping) are both designed against. The contributor stays a contributor with their own attribution and royalty streams; the platform gains a top-tier creative on equal economic terms.

The five tiers plus the R-track are a menu, not a funnel. A user can sit in T0 forever; a user can jump from T0 to T3 without passing through T1 and T2; a user can drop from T3 back to T0 by simply not submitting. Authorship NFTs and Canon Marks already earned remain regardless. Disengagement does not cost the user their archive.

---

## §3 Token-Economy Design (fungible + non-fungible + fiat-parallel)

The economy has three fully-separated layers: a fungible token (LORE) for participation incentives and platform sinks, a non-fungible reputation/attribution layer (Authorship NFTs, Marginalia badges, Canon Marks) for governance signal and historical record, and a parallel fiat-bounty layer (Scribe Path) that delivers contribution rewards without token holding. The three layers are not convertible. Buying LORE must never grant governance weight; earning a Canon Mark must never produce LORE windfall; receiving fiat must never grant LORE. This separation is the central anti-capture defense and the explicit response to the Steemit/Hive failure mode (stake-weighted curation → vote-buying → hostile takeover).

### 3.1 Fungible token: LORE

**Name:** LORE.

**Supply:** Fixed cap of 1,000,000,000 LORE. No inflation. No founder-controlled mint key. Mint authority is locked at deploy and exhausts according to a schedule baked into the [Cadence smart contract](https://cadence-lang.org/) on Flow.

**Initial reference price (S3 launch target):** 1 LORE = $0.10 USD. This is a pricing assumption, not a peg — used to size grants and stakes at launch. All grant amounts below are USD-denominated floors with a LORE-quantity adjustment performed quarterly by the Council (see §3.4).

**Distribution mechanism (10-year emission curve):**
- 30% — Contribution rewards (Tier-3+ wallet-holder contributions per §2). 300M LORE.
- 8% — Scribe-Bounty Treasury line, paid as fiat to Scribe-class contributors. 80M LORE-equivalent (held as LORE in treasury, sold to fund fiat bounties, with a 5% per-month sell cap to avoid market-flooding). Increased from V2's 5% to address the per-capita asymmetry identified in Phase 5B review.
- 17% — Passive-collector airdrops, distributed proportionally to NFT holdings on snapshot dates, capped (no single wallet receives more than 0.1% of any single airdrop event regardless of holdings). 170M LORE.
- 12% — Treasury, controlled by Canon Council with multi-sig and a 30-day timelock on all spends above 1M LORE. 120M LORE.
- 15% — Team and investors, vested per the schedule in §3.5 below. 150M LORE.
- 10% — Liquidity provisioning and market-making reserve. 100M LORE.
- 8% — Stability reserve (the inflation-governor and deflation-relief-valve pool, see §3.4). 80M LORE.

The 30%+8% contribution-reward total is the heart of the system; the 17% passive-airdrop pool is the structural promise that holders are not subsidizing contributors at their own expense.

### 3.2 Base LORE grants (USD-denominated floors, LORE-quantity adjusted quarterly)

All grant amounts are USD-denominated floors. The Council publishes the LORE-quantity equivalent at the start of each quarter based on the trailing-30-day VWAP (volume-weighted average price) of LORE on the primary DEX. If the VWAP moves more than 25% from the last quarterly reset, an emergency mid-quarter adjustment is triggered.

**Tier-3 Contribution grants (Hub publication, paid on Hub auto-publication after Adversarial Reading Pass clears):**
- Short fiction (category a): **50 LORE** ($5 USD floor at S3-reference price).
- Art submission (category b): **75 LORE** ($7.50 USD floor).
- Theory-essay (category c): **30 LORE** ($3 USD floor).
- Axiom extension (category e): **150 LORE** ($15 USD floor).
- Cross-Pane contraband submission (category f): **2x base for the submission's primary category** — see §3.5 for the doctrine reasoning.

**Featured Shelf selection bonus** (paid on promotion to Featured Shelf): **+100 LORE** ($10 USD floor).

**Canon Mark grant** (paid on canon promotion, in addition to Hub publication grant): **1,000 LORE** ($100 USD floor) for individual canon promotions; **5,000 LORE** ($500 USD floor) for fan-promoted Pane elevation; **2,000 LORE** ($200 USD floor) for cross-Pane contraband canon promotions.

**Axiom Declaration grant** (paid on a new-Pane proposal being promoted to active Pane status; see §6.4): **500 LORE** ($50 USD floor) at proposal acceptance plus the standard Pane-elevation grant of 5,000 LORE if and when the Pane is activated.

**Scribe-equivalent fiat bounties** are sized at **the same USD floors**, paid quarterly via the Scribe-Bounty Treasury. This closes the V2 per-capita-asymmetry hole: a Scribe earning a short-fiction bounty receives $5 USD-equivalent in platform credits or direct fiat, the same floor as the LORE grant. The 8% Scribe-Bounty Treasury allocation (vs 30% wallet-contribution allocation) is sized to cover up to 27% of total contribution volume going through the Scribe Path, which matches the Proxy 5 stretch target (20-40% Scribe-population) at the upper-mid range. If Scribe participation exceeds 30% sustained, a constitutional amendment can shift up to 4% from the 17% airdrop pool to the Scribe-Bounty allocation.

### 3.3 Submission staking (sink mechanic — actual numbers)

**Tiered submission staking** for Tier-3 submissions:
- **First-time contributor faucet:** 100 LORE granted free for first three submissions. Faucet eligibility requires holding at least one Pane card and zero prior submissions. Refunded if accepted, burned if rejected for spam, retained-pending-review otherwise — same as paid stake.
- **Submissions 1-10 within a 12-month rolling window: 50 LORE base stake** ($5 floor).
- **Submissions 11+ within the 12-month rolling window:** stake doubles each subsequent submission: 100, 200, 400, 800. **Hard cap: 800 LORE per submission** ($80 floor) — this prevents a runaway curve from making prolific contributors economically infeasible while still imposing flooding cost. After 12 months of cooldown the counter resets.
- **Pane proposal escrow:** 500 LORE staked, escrowed for the 12-month review window. Pane proposals require 3+ prior canon-promoted contributions (closes buy-your-way-to-a-Pane attack).
- **Cross-Pane contraband submission stake:** 1.5x the standard stake (75 LORE base) — slightly elevated friction for elevated reward.

**All stakes are refunded on Hub publication if the submission clears the Adversarial Reading Pass and is not flagged for Trust & Safety review.** This means the 50-800 LORE stake is operational friction, not a cost — a contributor in good standing pays no net LORE for ordinary submission. Stakes are burned on confirmed spam-rejection and held on contested-review for up to 60 days.

### 3.4 Sink-mechanic prices (the burn rate calibration)

**Margin Note pinning (Tier-2 sink):** 5 LORE per pin ($0.50 floor). A note can be pinned to one card-page; pin lasts for the duration of the contributor's account.

**Cosmetic frame upgrades (Tier-0+ sink, pure aesthetic):**
- Standard alternate frame: 25 LORE ($2.50 floor).
- Animated frame: 100 LORE ($10 floor).
- Series-Signature frame (limited to one per contributor per Series): 500 LORE ($50 floor).

**Council nomination fee:** 250 LORE ($25 floor), burned. Refunded only if the nominee accepts and is elected.

**Hub-entry pinning to a Pane sub-Hub (Tier-3+ sink):** 50 LORE ($5 floor) — pin lasts 30 days.

**Sink calibration math (steady-state target).** At S5 steady-state with 4,000 organic submissions/year and 30% Featured-Shelf promotion rate, the contribution-reward emission is approximately 350K LORE/year for short fiction, 450K LORE/year for axiom extensions, 200K LORE/year for art, plus ~10M LORE/year for canon promotions, ~3M LORE/year for new-Pane promotions, ~5M LORE/year for Featured Shelf bonuses — call it 19M LORE/year. The 30% wallet-contribution pool of 300M LORE is sized to last ~16 years at this rate, with the steeper years being S7-S10 when staff/investor unlock has fully released and contribution-reward emission becomes the dominant supply pressure.

For sinks to match: at $25/cosmetic-frame and $0.50/pin, 19M LORE/year burn requires roughly 38,000 frame purchases or 3.8M pins per year, plus nomination-fee and pin-to-Pane-sub-Hub burn. A platform with 50K active T0+ users by S5 needs ~76 frame purchases per active user per year, which is unrealistic on cosmetics alone. **Therefore the architecture commits to a structural sink the V2 document did not name: a quarterly LORE-burn redistribution to airdropped holders.** 25% of stake-burn revenue is auto-burned, 50% is distributed pro-rata to active holders as airdrop-reduction (the airdrop draws from sink-burn first, supply-emission second, slowing supply-emission), and 25% flows to the Stability Reserve.

### 3.4 Stability mechanisms (autonomous inflation governor + deflation relief valve)

These mechanisms address the five instability scenarios identified in Phase 5B review (a-e).

**(a) Autonomous inflation governor.** If trailing-3-month Tier-3 organic-submission count drops below the rolling-12-month-average by more than 30%, the contribution-reward emission for that 3-month period auto-burns 50% of unspent grant capacity from the Stability Reserve. This is mechanical, not governance-by-discretion. It removes the V2 hand-wave on the inflation case. Implementation: a smart-contract function that reads on-chain submission count and burns the configured fraction. Audited and locked at deploy.

**(b) Deflation relief valve.** If LORE/USD price (30-day VWAP) rises more than 3x over a 90-day window, a 6-month emission rate increase of 20% is triggered, drawn from the 8% Stability Reserve. This addresses the V2 missing case where sinks burn faster than emissions and submission-staking becomes unaffordable in real terms. The emission increase is paid into the contribution-reward pool, not the team/investor pool — it goes to contributors, who are the population most squeezed by deflation. Capped at three triggerings over the 10-year emission curve.

**(c) Scribe-allocation fix.** Already addressed in §3.1 — Scribe-Bounty allocation raised from V2's 5% to 8%, sized to match the Proxy 5 mid-range population target. Constitutional amendment can shift up to 4% from the airdrop pool to the Scribe-Bounty pool if Scribe-population exceeds 30% sustained. This closes the per-capita asymmetry hole.

**(d) Team/investor unlock schedule** (sequenced after ecosystem emission):
- 18-month investor cliff from S3 launch — first investor unlock is at S6 launch.
- 36-month linear vesting after the cliff — investors fully vested at S12 (year 6 from S3 launch).
- Team cliff: 12 months from S3 launch.
- Team linear vesting: 48 months after cliff.
- The 15% team/investor pool unlocks slower than V2's "4 years with 1-year cliff" — the redesign sequences team/investor unlock *after* the ecosystem has accumulated material contribution-reward emission, removing the V2 stress-window in years 5-7 where team unlock completed before contribution emission peaked.

**(e) USD-denominated floors with quarterly LORE-quantity adjustment.** Already addressed in §3.2 — every grant amount is published as a USD floor, with the LORE quantity recalibrated quarterly based on trailing-30-day VWAP. If the LORE/USD price doubles, the LORE quantity per grant halves. This decouples contributor real-dollar compensation from LORE volatility. The mid-quarter emergency adjustment (>25% move) prevents prolonged windows of mis-calibrated grants.

### 3.5 What LORE is NOT

Not a security. Not a vote. Not a profit-share. Not redeemable for cash from the platform. Not a stand-in for engagement-score. Not a price-oracle for NFTs. The bonding curve, if any, runs on a peripheral DEX, never as the marketplace's pricing mechanism (per the curation-markets dossier).

### 3.6 Non-fungible participation badges

The governance-signal layer. Earned, not bought. Non-transferable (soulbound). Minted to the contributor's wallet (or Attribution Escrow for Scribes) and stay there permanently. Three families:

1. **Marginalia (I-X):** Tier-2 reputation, awarded for upvoted Margin Notes.
2. **Authorship NFTs:** Tier-3 attribution, one per submission, regardless of acceptance. Disclosed-AI submissions in category (iv) or (v) are tagged in metadata accordingly. Full schema in §5.2.
3. **Canon Marks:** Tier-4 promotion, one per canon-promoted contribution.

Governance weight is computed from these badges, not from LORE balance. The Canon Council's nomination/election process uses Authorship-and-Canon-Mark counts (and Quill counts for Scribe-class candidates) as eligibility filters, never LORE balance. A whale can buy 5% of total LORE supply tomorrow and have zero additional governance influence.

### 3.7 The Scribe Path (parallel non-tokenized participation)

For users who refuse wallets — the Aesthetic Refusenik, the Practical Refusenik, the Jurisdictional Refusenik — the Scribe Account.

A Scribe Account is opened with email + password. No custodial wallet is provisioned by default. No token balance. No NFT inventory visible to the Scribe.

**A Scribe can:** read the Hub; post Margin Notes (visible alongside NFT-holder notes; sybil-defended via email verification, posting rate limits, and invitation-token onboarding once the platform is past S3); submit fan-canon through the Contraband interface; receive editorial feedback; be canon-promoted; vote in the Scribe-elected contributor Council seat (§4); upvote on a parallel Quill-weighted shadow-shelf that influences the Lore Curator's Featured Shelf nominations (the Curator considers both the NFT-gated upvote totals and the Scribe shadow-shelf totals when nominating).

**A Scribe cannot:** hold Pane cards, hold LORE, vote directly on the NFT-gated Featured Shelf upvote system, or vote in the wallet-elected contributor Council seat.

**Attribution Escrow.** When a Scribe submits, an Authorship NFT is minted to a platform-held escrow wallet, with the Scribe Account ID inscribed in metadata as canonical author. The Scribe gets full attribution on the Hub, in card metadata if promoted, and in all on-chain records. The Scribe can claim the Authorship NFT later by graduating to a wallet at any time; a one-click "claim my authorship NFTs" flow transfers all escrow-held NFTs to the now-provisioned wallet.

**Submission staking for Scribes.** Replaced by a temporal stake. Scribes can submit at most **N submissions per 30-day window**, where N is computed from their Quill score: **N = 1 + floor(Quill / 5)**, capped at 8 per window. So a brand-new Scribe (Quill 0) can submit 1 piece per 30 days; a Quill-15 Scribe can submit 4 per window; a top-tier Quill-35+ Scribe submits 8.

**Rewards.** Canon-promoted Scribe contributions earn fiat bounties (PayPal, direct deposit, [Wise](https://wise.com/) for cross-border, or platform credits for jurisdictions where wire/PayPal are unavailable) sized to the same USD floors as LORE grants. Funded from the 8% Scribe-Bounty Treasury allocation. Tier-4 Scribes receive royalty as quarterly fiat distribution with annual tax-form generation.

### 3.8 Anti-capture: how do we prevent whales from monopolizing canonical-contribution status?

Five overlapping defenses (V2-level, retained):

1. **Governance is keyed to non-transferable badges, not transferable tokens.**
2. **Submission slots are rate-limited per wallet** with the tiered staking curve.
3. **Per-wallet airdrop caps (0.1% of any LORE airdrop event).**
4. **Council seat caps (no more than 30% Tier-4-held, no more than 2 seats per real-person identity).**
5. **Wallet-cluster detection** — explicitly framed as a deterrent layer, not the load-bearing defense. The load-bearing defense at the elected-seat level is identity attestation; honest acknowledgment per Phase 5B review. The cost-curve for capture is on the order of $500K-$1M and 12+ months of sustained adversarial work; this is the documented threat model, not a hardened-against-arbitrary-attacker claim.

**Additional V3 defense:** Marginalia accumulation, contributor-seat voting eligibility, and Featured Shelf appearances are now **gated on the same 12-month observation window** as canon promotion for first-time wallets. A 50-wallet sleeper cluster cannot accumulate voting weight during the observation period; their votes don't count until the wallets cross the 12-month-and-three-clean-submissions threshold. This was a specific Phase 5B-identified hole.

### 3.9 Anti-pay-to-play: how do we ensure the contribution gate is QUALITY not WEALTH?

Six mechanisms (numbers now specific):

1. **Submission staking is small (50 LORE base, $5 floor), refundable on Hub publication, and tiered to penalize flooding, not first-timers.**
2. **First-time-contributor faucet — 100 LORE for first three submissions, no purchase required.**
3. **The Scribe Path** removes the wallet requirement entirely. A Scribe can become a Tier-3 contributor with zero token interaction.
4. **Engagement score is blind to purchase price.** Score reflects upvoted output, never spend.
5. **Curation is editorial, not market-priced.**
6. **Quality criteria are published and stable.**

### 3.10 Onramps + off-ramps

Three onramps (custodial Flow account, Scribe Account, graduate-to-self-custody). Four off-ramp guarantees: NFTs persist on Flow if LoreVault Corp disappears; "download my archive" produces a signed bundle; account deletion does not affect on-chain assets; Scribe escrow assets are claimable forever via the LoreVault Foundation (separate nonprofit holding escrow keys). The platform is a viewer over the archive, not the archive itself.

---

## §4 Curation + Quality Control

The curation system has four layers, ordered from broad to narrow.

### Layer 1: Open Fan-Canon Hub (no editorial review)

Any Tier-3 submission, after staking the small LORE fee (or temporal-stake for Scribes), is auto-published to the Fan-Canon Hub immediately. The Hub is searchable, indexed, on-chain-archived, and labeled clearly as fan-canon (NOT core-canon). This is the SCP-Foundation model: low gate, high volume, format-enforced quality.

**Hub structure: Pane sub-Hubs.** The Hub's index page is divided into Pane-specific sub-Hubs, one per active Pane. Submissions tagged to Pane X appear in Pane X's sub-Hub before they appear in the general Hub. Cross-Pane submissions appear in both originating Panes' sub-Hubs *and* in a special "Cross-Pane" sub-Hub. This makes Pane structure load-bearing in curation: a contributor working in a single Pane sees the conversation specific to that Pane, not a homogenized firehose. (See §6 for the multi-pantheon governance treatment.)

### Layer 2: Adversarial Reading Pass (defensive screen)

A small specialist function within Trust & Safety performs a structured scan on every Featured Shelf entry before it reaches the Council, and on flagged Hub entries on demand. The scan looks for:

- Known extremist symbology and dog-whistles.
- Brigade patterns: consistent ideological framing across submissions from the same wallet or wallet-cluster.
- Encoded extra-textual content (acrostics, hidden references, structural payloads).
- Disclosed-AI category (iv) or (v) submissions (flagged for stricter Council scrutiny).

The pass is documented in constitutional documents. False positives are appealable. Output is one input to Council deliberation, never an auto-reject.

### Layer 3: Community curation (Marginalia upvotes, Featured Shelf, Lore Curator)

**Featured Shelf threshold (now specified):** A submission is auto-promoted to the Featured Shelf when it crosses one of the following:
- **Top 5% of submissions in trailing 30-day window by Marginalia-weighted upvotes** (calibrated weekly), OR
- **Manual nomination by the Lore Curator**, OR
- **Manual nomination by 2+ Canon Council members**, OR
- **30+ Marginalia-weighted upvotes within 14 days of publication** (the absolute-floor fast-track for unambiguous community signal).

Marginalia weighting: a Marginalia-I user's upvote = 1.0; Marginalia-II = 1.2; Marginalia-X = 2.5 (logarithmic curve). Quill upvotes contribute to a parallel Scribe shadow-shelf which the Lore Curator considers in nominations.

**The Lore Curator role.** A paid editorial-scout staff role for the first 18-24 months. The role becomes vestigial as upvote volume grows.

### Layer 4: Canon Council review (final gate to core canon)

**Composition (8 seats):**
- 4 seats: founding editorial team (LoreVault staff, lore architects, art directors).
- 1 seat: Tier-4 contributor elected by Authorship-NFT-holders (one-account-one-vote among NFT-holders past the observation window).
- 1 seat: Tier-4 contributor elected by qualifying Scribes (Quill-score-gated).
- 1 seat: rotating community seat, drawn by lottery from Tier-2+ holders for a 6-month term.
- 1 seat: rotating Resident-Author seat once the Resident Author program activates (S5+).

**Term length:** 2 years staff, 1 year contributor seats, 6 months lottery, 1 year Resident-Author. Staggered.

**Promotion threshold:** 5-of-8 simple majority for canon promotion. Pane-specific canon promotions get a 1.5x weight modifier on the relevant Pane-Steward's vote (see §6). Retcon supermajority: 6-of-8.

**Council deadlock resolution (V3 addition).** A 4-yes/4-no/0-defer split returns the submission to the Hub with "Pending Council Review" badge preserved and the next regular cycle's review automatic. A 4-4-0 split *cannot* default to promotion. A 3-yes/3-no/2-defer split similarly defers. The Council chair (rotating annually among the 4 staff seats) does not break ties — ties default to Hub-return. This closes the V2 unspecified-deadlock case.

**Step-by-step process** for canon-aspiring submissions follows the formal state machine specified in §5.1.

### AI-assisted submission policy

Disclose-and-evaluate, not detect-and-reject. Five disclosure categories: (i) no AI use, (ii) AI ideation, (iii) AI drafting with substantial human revision, (iv) AI substantial generation with light human editing, (v) primarily AI-generated. Categories (i)-(iii) reviewed identically; (iv) under stricter scrutiny; (v) excluded from canon promotion but admitted to Hub with explicit (v)-tag. Undisclosed AI use grounds for canon-status revocation.

### Bug bounty for adversarial submissions

$500-$2,000 per substantiated catch of structural-harm content that passed initial review. [HackerOne security-bounty model](https://www.hackerone.com/) applied to lore moderation.

---

## §5 The "Contraband Across the Border" Mechanic

This is the heart of the design and the explicit answer to the third-voice critique. The doctrine teaches that every Pane has a buried weight — a contraband — a hidden axiom that defines what crosses between worlds. Fan participation, in the doctrine's own framing, is fans bringing their own contraband across the border. The submission interface must make this metaphor literal — make the act of contributing feel like smuggling, not form-filling.

### The Contraband Submission Interface

The submission UI is structured as a five-step "border crossing."

**Step 1: Declare your origin.** The contributor selects which Pane they're operating from (or "outside-Pane" for cross-cutting work, or "two-Panes" for cross-Pane contraband per §6.3). This grounds the submission in the existing cosmological substrate.

**Step 2: Declare your contraband.** A structured field titled "What contraband are you bringing across?" Required, load-bearing, indexed as primary metadata. Category dropdown (axiom-extension, character, object, event, place, ritual, **inter-Pane-crossing**). One-sentence statement.

**Step 3: Declare the customs cost.** "What does this cost the world to admit?" The doctrine's "buried weight" requirement.

**Step 4: Declare your tools.** AI-disclosure field (categories i-v).

**Step 5: The crossing.** The actual submission. Final review, stake LORE (or accept Scribe cooldown), submit.

### 5.1 Curation State Machine (the Phase 5B patch)

V2 specified the form. V3 specifies the lifecycle. Every submission progresses through this state machine; states are recorded as on-chain metadata updates to the Authorship NFT (see §5.2).

**State 0: Draft** (off-chain, contributor's local form state).
- *Triggered by:* contributor opens submission interface.
- *Exit:* contributor clicks "Submit" on Step 5; LORE stake (or Scribe cooldown commitment) deposited.
- *Time limit:* none.

**State 1: Submitted** (Authorship NFT minted, content pinned to IPFS, on-chain submission event recorded).
- *On-chain event:* `LoreVault.AuthorshipNFTMinted(submissionId, submitter, paneId, contentHash, stakeAmount)`.
- *Triggered by:* successful stake deposit.
- *Exit:* automated Adversarial Reading Pass scan completes (typical: 10 minutes; max 4 hours).
- *Time limit:* 4 hours; if Pass fails to complete, submission auto-promotes to Pending Review with a `pass-incomplete` flag.

**State 2: Pending Review** (Adversarial Reading Pass cleared OR pass-incomplete flagged for Trust & Safety).
- *On-chain event:* `LoreVault.SubmissionStateUpdated(submissionId, "Pending Review", timestamp)`.
- *Triggered by:* Adversarial Reading Pass completion.
- *Auto-publishes to Hub* simultaneously — Pending Review and Hub-published are concurrent states for clean-pass submissions; for flagged submissions, Hub publication is held until Trust & Safety clears.
- *Time limit:* Trust & Safety has 7 days to act on flagged submissions; after 7 days unresolved, default is Hub publication with a "T&S review pending" overlay.

**State 3: Hub-Published** (live on the relevant Pane sub-Hub and general Hub).
- *On-chain event:* `LoreVault.HubPublished(submissionId, paneId, publishTimestamp)`.
- *Stake refund event:* simultaneously, `LoreVault.StakeRefunded(submitter, stakeAmount)` for clean passes.
- *Visible UI changes:* card on sub-Hub shows submission title-card, contraband declaration, contributor handle, submission date, AI-disclosure tag, current state badge.
- *Open community window:* 30 days during which Tier-2+ users (and Scribes) can read, upvote, and post Margin Notes.
- *Exit paths:* (a) crosses Featured Shelf threshold → State 4; (b) 30-day window closes without crossing threshold → State 7 (Hub-Resident); (c) contributor flags as "Off-Canon Permanent" at any time → State 7.

**State 4: Featured Shelf** (community-promoted to higher-visibility surface).
- *On-chain event:* `LoreVault.FeaturedShelfPromoted(submissionId, promotionMechanism, timestamp)` where `promotionMechanism` is one of `top-5pct | curator-nominated | council-nominated | floor-fasttrack`.
- *Featured Shelf bonus paid:* +100 LORE grant or fiat-equivalent.
- *Adversarial Reading Pass second-look* (deeper scan, since Featured Shelf entries reach Council attention).
- *Time limit:* a submission stays on the Featured Shelf for the duration of the Series cycle it was promoted in; rolls into the Council shortlist at end-of-cycle.
- *Exit:* end of Series cycle → State 5.

**State 5: Council Shortlist** (Council reviewing for canon promotion).
- *On-chain event:* `LoreVault.CouncilShortlisted(submissionId, cycleId, timestamp)`.
- *Pane-Steward first-read:* the relevant Pane-Steward (see §6.1) has 14 days for first-read responsibility; their notes are added to the Council deliberation packet.
- *Time limit:* Council has 21 days from end of Pane-Steward first-read to vote.
- *If no quorum at end of 21 days:* auto-returns to Hub with "Pending Council Review" badge preserved and the submission rolls into the next cycle's shortlist automatically. This closes the V2-unspecified Hub-to-Council migration timeout case.
- *Exit:* Council vote → State 6 (Canon Promoted), State 7 (Hub-Resident with Pending Council Review badge), or State 8 (Returned to Hub with feedback).

**State 6: Canon Promoted** (5-of-8 Council vote affirmative).
- *On-chain events:* `LoreVault.CanonMarkMinted(submitter, submissionId, promotionVoteHash)`, `LoreVault.RoyaltyAssigned(submissionId, royaltyRate, royaltyRecipient)`, `LoreVault.CanonGrantPaid(submitter, amount)`.
- *Locks to specific version hash* — see §5.2 on edit-after-publication.
- *Permanent state.* Demotion possible only via constitutional process (revoke-canon protocol).

**State 7: Hub-Resident** (default end-state for non-promoted submissions).
- *Permanent.* The submission lives on the Hub indefinitely, indexed and citable.
- *Pending Council Review badge* persists if shortlisted-but-not-yet-voted, until the Council cycle resolves.

**State 8: Returned to Hub with Feedback** (Council vote: defer, or accept-with-patch awaiting contributor revision).
- *On-chain event:* `LoreVault.SubmissionDeferred(submissionId, councilFeedbackHash, timestamp)`.
- *Time limit:* contributor has 90 days to submit a revision; revision creates a new version (v2) with its own content hash but retains the same submission lineage — see §5.2.
- *If no revision in 90 days:* defaults to State 7 (Hub-Resident).

### 5.2 Authorship NFT Metadata Schema

The Authorship NFT is the load-bearing attribution primitive. V2 said "metadata-tagged" without specifying the schema. V3 specifies it.

**On-chain fields (Cadence resource fields, all immutable except `currentState` and the version-extension array):**

```
resource AuthorshipNFT {
  // Identity & lineage (immutable after mint)
  let submissionId: UInt64                 // monotonic platform-wide
  let submitter: Address                   // wallet OR Foundation escrow address
  let scribeAccountId: String?             // populated only for Scribe-escrow NFTs
  let submissionTimestamp: UFix64          // block timestamp at mint

  // Submission classification (immutable after mint)
  let paneId: UInt32                       // primary Pane tag (or 0 = outside-Pane)
  let secondaryPaneId: UInt32?             // populated only for cross-Pane (category f)
  let submissionType: UInt8                // enum: a=short-fiction, b=art, c=theory,
                                           //       d=alt-Pane, e=axiom-ext, f=cross-Pane
  let aiDisclosure: UInt8                  // enum: i,ii,iii,iv,v
  let contrabandDeclarationHash: [UInt8;32]// SHA-256 of Step-2 statement
  let customsCostHash: [UInt8;32]          // SHA-256 of Step-3 statement

  // Economic record (immutable after mint)
  let loreStakeAmount: UFix64              // 0 for Scribe NFTs
  let temporalStakeUsed: Bool              // true for Scribe NFTs

  // Versioning (append-only after mint)
  let v1ContentHash: [UInt8;32]            // SHA-256 of submission body at mint
  var versionExtensions: [VersionExtension]// list of {versionNumber, contentHash, timestamp}

  // State machine (mutable, append-only state log)
  var currentState: UInt8                  // enum 0-8 per §5.1
  var stateHistory: [StateTransition]      // append-only log of (state, timestamp, txHash)

  // Promotion record (mutable, populated only on canon promotion)
  var canonPromotionDate: UFix64?
  var canonVersionLockHash: [UInt8;32]?    // version hash locked at promotion
  var royaltyRate: UFix64?                 // 0.015 or 0.030 per §2 Tier-4 spec
  var canonVoteHash: [UInt8;32]?           // hash of Council vote record

  // Moderation record (mutable, populated only if violation logged)
  var moderationOverlayHash: [UInt8;32]?   // SHA-256 of moderation finding doc
}
```

**Off-chain mirror.** The IPFS-pinned submission body is content-addressed by `v1ContentHash`. Subsequent versions pin new content; the on-chain `versionExtensions` array stores the new hashes. The platform UI resolves the appropriate version when displaying.

**Resolution of the edit-after-publication collision.** V2 left this contradiction open — an "immutable" Authorship NFT for editable content is incoherent. V3 resolves it explicitly:

- The Authorship NFT is minted with `v1ContentHash` set to the SHA-256 of the original submission body. This is permanent. *The original is the original; it cannot be erased.*
- A contributor may edit their submission after publication by submitting a new version. This appends `{versionNumber: N, contentHash: hash, timestamp: t}` to `versionExtensions` on the same Authorship NFT. The original v1 hash remains on-chain and the original v1 content remains pinned to IPFS.
- The Hub UI displays the latest version by default with a "version history" link showing all prior versions and their hashes; readers can view any prior version.
- If the submission is shortlisted by the Council, the `currentState` advances to State 5 and edits become **frozen** for the duration of Council review (90-day window). Any edit-attempt during freeze is rejected at the platform level.
- On canon promotion, the Council's vote specifies which version hash is being promoted (default: the latest at the moment of vote). That hash is written to `canonVersionLockHash` and becomes immutable. Subsequent edits remain possible (the Hub continues to display latest), but **canon points to the locked version** — what was promoted is what canon shows, regardless of later contributor edits.
- This is the immutability model: **authorship is immutable, the original-version content is immutable, and the canon-promoted-version content is immutable.** Subsequent versions are amendments visible alongside, never overwrites.

This resolves Phase 5B's "immutable NFT for editable content is a contradiction" objection.

### 5.3 "Off-canon" submission vs. "canon-proposal"

Every submission is, at first, off-canon. There is no "canon-proposal" submission type. There is only submission-to-Hub, and from the Hub, the Council may promote. A contributor who explicitly does *not* want their work considered for canon can mark the submission "Off-Canon Permanent" — preserved as on-chain metadata; Council will not review.

### 5.4 Why this works

The contraband framing accomplishes three things at once:
1. **Quality filter without gatekeeping.** Structured declaration fields force coherence.
2. **Doctrine alignment.** Every submission engages the doctrine's central metaphor.
3. **Smuggling, not form-filling.** Participatory and mythic, not bureaucratic.

---

## §6 Multi-Pantheon Pane Governance (the load-bearing patch)

V2 treated all Panes as homogeneous from a curation standpoint. V3 makes the multi-pantheon Pane structure load-bearing — it produces specific, named governance decisions that no rebrand to a generic collectible-with-fan-content platform could absorb.

The doctrine teaches that LoreVault's cosmology is not a single universe but a multi-Pane structure where each Pane has its own buried weight, its own contraband rules, its own internal coherence. Different Panes can be in tension, contradiction, or mutual unawareness without breaking canon. This is structurally distinct from Top Shot Moments (one NBA, one ruleset), Disney Pinnacle (one IP universe, one canon authority), or sports-card story-extensions (one sport, one season). LoreVault's governance must reflect this structure or it is not LoreVault's governance.

### 6.1 Pane-Steward role

Each active Pane has exactly one **Pane-Steward** — a Canon Council member or designated Council delegate who has **first-read responsibility** for submissions tagged to that Pane.

**Selection:** Pane-Stewards are appointed at the start of each Series by majority Council vote from among Council members and qualifying Tier-4 contributors. A Council member can hold at most one Stewardship at a time. A Stewardship can be delegated to a Tier-4 non-Council contributor with the Council's confirmation. Stewards rotate every Series — no Steward holds the same Pane two consecutive Series, ensuring no Pane becomes the personal canon of one editor.

**Responsibilities:**
- First-read every submission tagged to the Steward's Pane during the State 5 (Council Shortlist) phase. The Steward has 14 days for first-read; their notes feed the Council deliberation packet.
- Maintain the Pane's canon-coherence document (a living public document specifying the Pane's axioms, accepted contraband, customs-cost commitments, and explicit open questions).
- Nominate Featured Shelf candidates from their Pane's sub-Hub (one input alongside Curator nominations and community upvotes).
- Co-approve cross-Pane contraband submissions (see §6.3).

**Voting weight modifier:** A Pane-Steward's vote on a Pane-specific canon proposal carries **1.5x weight** in the 5-of-8 calculation. So if the Steward votes yes, that counts as 1.5 yes-votes; if no, 1.5 no-votes. Other Council members' votes count as 1.0. This means a 4-vote majority among non-Stewards can be tipped by a Steward dissent (3.5 yes / 4.5 no / 0 defer = no-promotion). This makes the Pane-Steward role *meaningfully load-bearing* in canon decisions for their Pane, without giving them unilateral authority. The 1.5x modifier applies only on Pane-specific proposals, never on platform-level constitutional matters.

### 6.2 Pane-specific sub-Hubs

The Hub architecture mirrors the Pane structure. Implementation already noted in §4 Layer 1, restated here for §6 coherence:

- Each active Pane has a dedicated sub-Hub (`hub.lorevault.com/pane/<paneId>/`).
- Submissions tagged to Pane X appear in Pane X's sub-Hub before they appear in the general Hub.
- Cross-Pane submissions (category f) appear in both originating Panes' sub-Hubs and in the special `hub.lorevault.com/cross-pane/` index.
- Each sub-Hub has its own Featured Shelf calibration (top 5% within that Pane's submissions, not across all Panes).
- Each sub-Hub displays the Pane's canon-coherence document (maintained by the Pane-Steward) at the top of the index — the contributor knows the Pane's accepted axioms before submitting.

This produces a real architectural difference: a contributor working in Pane A sees Pane A's conversation, Pane A's axioms, Pane A's Steward's acceptance criteria. A contributor working across two Panes sees both, plus the cross-Pane index. The "homogenized firehose" failure mode — where every contributor competes for attention against every other contributor across all Panes — is structurally avoided.

### 6.3 Inter-Pane contraband-flow rules

A submission whose declared contraband proposes a movement, exchange, or connection **between two existing Panes** (not just within one Pane) is the highest-value contribution type — it directly engages the doctrine's "border between worlds" framing. V3 designates this category f and applies elevated structural rules.

**Submission requirements:**
- Step 1 origin field allows "two-Panes" as a selection; contributor names both Panes.
- Step 2 contraband declaration must explicitly name what crosses (axiom, character, object, event) and the direction(s) of crossing (one-way, two-way, asymmetric).
- Step 3 customs cost must articulate the cost paid in *both* affected Panes — what each Pane gives up to admit the connection.

**Co-approval requirement:** Cross-Pane contraband submissions in State 5 (Council Shortlist) require **both relevant Pane-Stewards to co-approve** before the Council vote. If either Steward declines, the submission returns to Hub-Resident state. If both approve, the Council vote proceeds with the standard 5-of-8 threshold.

**Reward structure:** Cross-Pane contraband submissions earn **2x the LORE grant** of the equivalent same-Pane submission category (per §3.2). Canon-promoted cross-Pane contributions earn the elevated **2,000 LORE Canon Mark grant** (vs 1,000 LORE for standard) and qualify for the 3.0% royalty tier.

**Why elevated:** Cross-Pane contraband is the doctrine-purest form of contribution — it is the literal act of bringing contraband across a border. The platform's central metaphor is not "fans contribute to a Pane"; it is "fans bring their own contraband across the border between Panes." V3 makes this structurally rewarded, not just metaphorically gestured at.

### 6.4 New Pane proposals (distinguished from within-Pane submissions)

V2 grouped full-Pane proposals with regular submissions and applied a higher stake. V3 distinguishes them with their own queue, requirements, and reward structure.

**Requirements (all four must be met before Council shortlisting):**

(a) **Axiom Declaration.** The contributor submits a structured "Axiom Declaration" — the what-if premise of the proposed Pane. This is a longer form than the standard contraband declaration: it specifies the proposed Pane's buried weight, its three primary axioms, its customs-cost relative to the existing Pane structure, and a 1,000-3,000-word foundational fiction excerpt demonstrating the Pane's voice. The Axiom Declaration is the proposal's title-card; it is indexed and citable independent of whether the proposal succeeds.

(b) **At least 3 supporting submissions** to the proposed Pane already published as Hub-Resident submissions, by **3 distinct contributors** (the proposer can be one of them; the other two must be independent). This demonstrates the proposed Pane has organic interest beyond the proposer.

(c) **Pane-Steward nomination to Council.** A current Pane-Steward (any Pane) must nominate the proposal to the Council shortlist. This is the same structural primitive as Featured Shelf Council-nomination, applied to the new-Pane-proposal queue. Without a Pane-Steward sponsor, the proposal lives on the Hub indefinitely as an unactivated Axiom Declaration but does not enter Council review.

(d) **6-of-8 Council supermajority** for activation. New-Pane activation is a higher-stakes decision than individual canon promotion; it adjusts the platform's cosmological substrate, not just its contents. The 6-of-8 threshold matches the retcon supermajority — both are "structural changes to canon," not ordinary canon admissions.

**LORE rewards for new-Pane proposals:**
- **Axiom Declaration grant:** 500 LORE ($50 USD floor) paid on Hub publication of the Declaration, regardless of eventual outcome.
- **Activation grant:** 5,000 LORE ($500 USD floor) paid on activation (6-of-8 vote affirmative).
- **Standard royalty:** 3.0% royalty tier on all cards drawn from the activated Pane.
- **Pane-Stewardship priority:** the proposer is the default first Pane-Steward of the activated Pane (subject to confirmation by the standard Steward selection vote).

**Stake:** 500 LORE escrowed for the duration of the proposal review (12-month maximum), refunded on either activation or rejection, burned only on confirmed-spam rejection.

**Queue structure:** New-Pane proposals have a dedicated Council queue separate from the main canon-promotion shortlist. Council reviews the new-Pane queue once per Series cycle (every 6 months) rather than every cycle, to give organic supporting-submission accumulation time.

### 6.5 Shadow Pane archive

The doctrine speaks of "thousands of shadow Panes possible" — Panes that exist as latent possibility without being actively materialized in card-pack drops. V3 makes the Shadow Pane archive a real, structural feature.

**Definition:** Submissions tagged to a *proposed-but-not-yet-activated* Pane go into the **Shadow Pane archive** at `hub.lorevault.com/shadow/<proposedPaneId>/`. Shadow Pane sub-Hubs are publicly readable, searchable, and indexed. Submissions there receive their own Authorship NFTs (with the proposed Pane ID written to the metadata `paneId` field, flagged as "shadow" in a sub-flag).

**Functions:**
- **Pre-Pane gathering surface.** Contributors who want to write toward an unactivated Pane have a place to do so. The 3-supporting-submissions requirement for new-Pane proposal activation is met by Shadow Pane submissions.
- **Doctrine alignment.** "Thousands of shadow Panes possible" stops being marketing language and starts being a real surface area of the platform — anyone can propose an Axiom Declaration, anyone can write toward it, the Council activates only the rare ones, but the *unactivated* ones are not deleted, dismissed, or hidden. They live in the archive as evidence the cosmology is larger than the activated subset.
- **Reactivation pipeline.** A Shadow Pane can be re-proposed for activation in any future Series cycle. An archive Pane that accumulates 10+ supporting submissions over multiple Series may be re-evaluated by the Council without a fresh Axiom Declaration — its existing Declaration suffices, the higher supporting-submission count substitutes for the original 3-minimum.
- **No Council activation required for Shadow Pane existence.** This is the load-bearing point. The Hub does not gatekeep cosmological proposals at the level of "exists or doesn't exist"; it only gatekeeps at the level of "activated for cards or not."

This pattern — public proposal, public archive, gated activation — is structurally distinct from any single-canon collectible-fan-content platform. It only makes sense in a multi-pantheon cosmological structure where the central design question is *which subset of latent worlds materializes into cards*, not *what is the canon of the one universe*.

### 6.6 Why §6 is genuinely LoreVault-specific

A reader could not lift §6 into Top Shot's architecture — Top Shot has one NBA, one ruleset, one season at a time. A reader could not lift §6 into Disney Pinnacle — Disney has one master IP authority and a single canon spine. A reader could not lift §6 into a sports-card story-extensions platform — there is no inter-sport contraband-flow.

The Pane-Steward role, the 1.5x Pane-vote weighting, the cross-Pane co-approval requirement, the 2x cross-Pane reward, the Axiom Declaration primitive, the Shadow Pane archive, and the new-Pane proposal queue with its own threshold and cycle — these structures only cohere on a platform whose central cosmological claim is multi-pantheon-with-permeable-borders. They are LoreVault's governance because they are LoreVault's doctrine reified.

---

## §7 Failure-Mode Pre-Emption

Each failure mode observed in research, paired with the specific structural defense LoreVault implements.

### 1. Authorial withdrawal / founder dependency
**Defense:** Council assumes founder absence. No single seat (including founding-editor seats) can promote canon alone. Hub auto-publishes; Resident Author program seeds successor creators by S5. Founder-absent operation is non-event for T0-T3 users. **V3 addition:** if all 4 founding-editor seats vacate before the Resident-Author program activates (S5+), the operational continuity plan is: lottery seats expand to 3 (filled from Tier-2+ holders), contributor seats remain elected, and the Council can operate at 5-of-5 supermajority pending recruitment.

### 2. Attribution debt
**Defense:** Authorship NFT minted at staking, schema-specified per §5.2, before any review, immutable on the v1 hash. No "we'll credit you later" surface anywhere.

### 3. Corporate capture / IP ownership
**Defense:** Holders own on-chain. Authorship NFTs and Canon Marks survive any company shutdown. Hub on IPFS. Scribe Attribution-Escrow held by LoreVault Foundation (separate nonprofit). Trademarks held by Foundation, not Corp.

### 4. Trademark squatting
**Defense:** 9-jurisdiction defensive registration before each Series ships. Standing legal budget. Foundation holds trademarks.

### 5. Platform dependency
**Defense:** Reward signals on-chain, Hub on IPFS, public data-portability spec.

### 6. Whale capture
**Defense:** Governance keyed to non-transferable badges. Per-wallet caps. Council seat caps. Wallet-cluster detection (deterrent layer). Identity attestation (load-bearing layer, honestly named). 12-month observation window now extended to Marginalia accumulation and contributor-seat voting eligibility (V3 fix to V2 sleeper-cluster gap).

### 7. Speculation spiral
**Defense:** Participation never required for NFT value. LORE structurally separated from collectible NFT value. Scribe Path further separates participation from token economy. Marketing language collectible-first. **V3 addition:** the constitutional protections include a marketing-language clause — first ad campaign of every Series must be evaluated by the Council against the "collectible-first, participation-second" rule, with veto power.

### 8. Curation bottleneck / Canon Council capture
**Defense:** Multiple parallel curation surfaces. Term limits, staggered. Lottery seat. Council deliberations summarized publicly. Pane-promotion cap raisable. Pane-Steward rotation every Series prevents Pane-level personal-canon entrenchment.

### 9. Bad-actor injection
**Defense:** Tiered staking (50-800 LORE, sized to make flooding economically painful at $5-$80 per submission); Adversarial Reading Pass on Featured Shelf entries; wallet-cluster detection; first-time-contributor 12-month observation window now extended to voting weight; Trust & Safety publishing policy; bug bounty $500-$2,000 per substantiated catch.

### 10. Fan-base fragmentation / schism
**Defense:** Hub's Canon Hub mini-canon model. Schisms structurally encouraged to take the form of new Panes or new mini-canons inside the larger frame. **V3 elaboration:** the Shadow Pane archive (§6.5) is the explicit structural answer — a contributor whose vision diverges from current canon can propose a Shadow Pane, gather 3+ supporting submissions, and either pursue activation or simply maintain the parallel archive. Forking the platform becomes less attractive than forking *within* the platform.

### 11. Cold-start emptiness
**Defense:** Seeded Hub launches S3 with 200-500 staff-and-commissioned-contributor entries, dated honestly, disclosed in constitutional documents. Lore Curator role for first 18-24 months. Tier-0-to-Hub bridges. Warm-up canon-promotion exception in S3 (1-3 promotions of seeded fan-writers' work).

### 12. AI-generation displacement
**Defense:** Disclose-and-evaluate policy with five categories. Category (v) excluded from canon, admitted to Hub with explicit tag. Undisclosed AI use grounds for canon-status revocation. Authorship NFT schema includes `aiDisclosure` field per §5.2.

### 13. Council deadlock (V3 addition)
**Defense:** 4-yes/4-no/0-defer split returns submission to Hub-Resident state with Pending Council Review badge preserved. Ties default to Hub-return, never to promotion. No tie-breaker chair. Submission rolls to next cycle's shortlist automatically.

### 14. Token-economy instability (V3 addition, addressing Phase 5B-identified five scenarios)
**Defense:** Per §3.4 — autonomous inflation governor (auto-burns 50% of unspent grant capacity if submission count drops 30% below 12-month average), deflation relief valve (20% emission rate increase if LORE/USD rises 3x in 90 days, capped at three triggerings over 10 years), Scribe-allocation rebalanced to 8% with constitutional shift-up-to-4% mechanism, team/investor unlock sequenced after ecosystem emission (18-month investor cliff from S3, 36-month vesting; 12-month team cliff, 48-month vesting), all grants USD-denominated with quarterly LORE-quantity recalibration.

---

## §8 Phased Rollout

The rollout is deliberately sequential. Each phase enables a tier of participation infrastructure and is gated on metrics from the prior phase.

### Series 1 (Months 0-6): Passive-First Foundation

**Enabled:** Pane card minting (3-5 active Panes); pack purchase via credit card / Apple Pay / Flow wallet; custodial Flow account onboarding; marketplace with USD pricing; card gallery with embedded flavor-text; free Apprentice Pane on signup; static official-only Pane summaries; Scribe Account registration enabled (read-only); read-only Discord; trademark filings completed in 9 jurisdictions; lore-team begins seed-content production.

**Not enabled:** LORE token, fan submissions, Canon Council, Tier-3+ infrastructure, Pane-Stewards (Stewards activate at S3 with the Hub).

**Tier distribution target:** 95% T0, 5% T1.

**Metrics gating advancement:** 50,000+ unique wallets/Scribe-Accounts; $5M+ secondary marketplace volume; <1% support-ticket rate; ~10K Discord members; trademarks granted or pending.

### Series 2 (Months 6-12): Reader Layer + Marginalia + Seed Recruitment

**Enabled (in addition):** Margin Notes; Marginalia badge minting; Quill counter; Theory channels; Reader's Sigil cosmetic; personal lorebook view; public profile pages; commissioned fan-writer cohort recruitment; Lore Curator role hired.

**Not enabled:** LORE token, fan-canon submissions, Canon Council, Pane-Stewards.

**Tier distribution target:** 80% T0, 18% T1, 2% T2.

**Metrics gating advancement:** 1,000+ active Tier-2 users; Margin Note upvote-to-post ratio above 30%; no major moderation incidents; seed-content corpus of 200-500 staged; 10-20 commissioned fan-writers contracted.

### Series 3 (Months 12-18): LORE Token + Seeded Hub + Warm-up Canon + Pane-Steward activation

**Enabled (in addition):** LORE token launch on Flow at $0.10 reference price; initial holder airdrop (capped); Contraband Submission interface with all five steps including AI-disclosure; Authorship NFT minting per §5.2 schema; Attribution Escrow for Scribes; Fan-Canon Hub launches with 200-500 seeded entries dated honestly; Pane sub-Hubs activated; **Pane-Stewards appointed (one per active Pane)**; first-time-contributor LORE faucet (100 LORE, three submissions); community-upvote-driven Featured Shelf with thresholds per §4 Layer 3; Lore Curator scouting; Adversarial Reading Pass operational; wallet-cluster detection operational; Canon Council seated (4 staff + 1 lottery; 2 contributor seats reserved for S4; Resident-Author seat reserved for S5); warm-up canon promotion (1-3 promotions of seeded fan-writer work); state-machine on-chain events live per §5.1; Shadow Pane archive enabled.

**Not enabled:** Full open canon promotion (warm-up only); Resident Author program; retcon protocol; new-Pane proposal queue (activates S4 to give Shadow Pane archive time to accumulate Axiom Declarations).

**Tier distribution target:** 70% T0, 22% T1, 6% T2, 2% T3.

**Metrics gating advancement:** Organic submissions 100+, fail-threshold 25; Hub Tier-0.5 daily-active 1,000+ by month 3, 5,000+ by month 6; cross-references avg 0.5 per organic entry by end of S3; submission rejection rate <10%; Hub-traffic-to-organic-submission ratio above 50:1; Council deliberation rubric stable for 90 days; LORE burn-rate within 20% of emission rate (Stability Reserve mechanisms operational); Adversarial Reading Pass false-positive rate <5% on appeal.

### Series 4 (Months 18-24): Full Canon Promotion + Scribe Council Seat + New-Pane Proposal Queue

**Enabled (in addition):** First open Canon Council promotion vote; Canon Mark NFTs at scale; royalty streams; 1 Tier-4 contributor seat elected by NFT-holders; 1 Tier-4 contributor seat elected by qualifying Scribes; full constitutional process for amendments; fan-promoted content in Series-card metadata; bug bounty program live; **new-Pane proposal queue operational** (Council reviews once per cycle, 6-of-8 supermajority for activation); cross-Pane contraband category (f) live with 2x rewards.

**Not yet enabled:** Resident Author program; retcon protocol.

**Tier distribution target:** 70% T0, 18% T1, 8% T2, 3% T3, ~0.1-0.5% T4.

**Metrics gating advancement:** 500+ organic submissions in cycle; Canon Mark count 5-15; cross-reference avg 1.0+ per organic entry; no major capture events; first new-Pane activation (or first deliberate non-activation with Shadow archive evidence).

### Series 5+ (Months 24+): Resident Author + Retcon

**Enabled (in addition):** Resident Author program activates; Resident-Author Council seat enabled; retcon protocol activates (6-of-8 supermajority, 60-day public comment); Pane-promotion cap may be raised to 2 per Series.

**Tier distribution target (steady-state):** 70% T0, 18% T1, 8% T2, 3% T3, ~0.1-0.5% T4, 3-5 Resident Authors.

**Ongoing metrics:** ~1-2 fan-promoted Panes per Series; Canon Mark count grows by 5-15 per cycle; Hub volume continues compounding; Tier-distribution stable within ±5% of targets; LORE burn-rate stable; Resident Author cohort grows by 1-2 per year; Stability Reserve triggerings tracked (target: 0-1 per year, 0 ideal).

---

## §8 The Test for Whether This Works

Per the third-voice critique: "will fans bring their own contraband across the border?"

This is the central question. The architecture above is a guess; the test is whether participation actually emerges. V3 measures along five proxies plus tertiary signals.

### Proxy 1: Hub submission volume (organic, not seeded)

**Threshold for "working":** 100+ organic submissions in S3 (including warm-up cycle); 500+ in S4; 2,000+ per cycle by S5; 5,000+ per cycle by S8. Calibrated against SCP's two-decade ramp compressed by a factor of 2-4 (V3 narrows V2's "3-5x" claim — Phase 5B noted the assumption was hand-waved; the honest range reflects that LoreVault's collector audience is not necessarily a writer audience).

**Threshold for "failing":** Fewer than 25 organic submissions in S3, or sub-100 in S4.

### Proxy 2: Read-to-write ratio

**Threshold for "working":** 50:1 to 200:1 (per SCP norms). S3-specific: 1,000+ Tier-0.5 daily-active by month 3, 5,000+ by month 6.

**Threshold for "failing":** Below 20:1 or above 1,000:1.

### Proxy 3: Cross-contributor engagement

**Threshold for "working":** 0.5 per organic entry by end of S3, 1.0 by S4, 2.0+ by S5.

**Threshold for "failing":** Sub-0.3 average at S5.

### Proxy 4: Contraband adoption into core canon

**Threshold for "working":** 1-3 warm-up promotions in S3; 5-15 Canon Marks per Series by S5; 10-20% of new core-canon material originating as fan-promoted contributions by S6 (denominator: core-canon material produced by staff per cycle, published in the constitutional staff-output disclosure quarterly); Resident-Author cohort of 3-5 by S6; **at least 1 cross-Pane contraband canon promotion by S6** (the doctrine-purest contribution type should be producing canon by then).

**Threshold for "failing":** Zero promotions for two consecutive cycles after S4; all promotions concentrated in <5 contributors; Resident-Author cohort fails by S6; zero cross-Pane contraband promotions through S7 (suggests the cross-Pane category is decorative, not load-bearing).

### Proxy 5: Scribe-class participation

**Threshold for "working":** 20-40% of T3 active contributors are Scribes by S5; 15-30% of canon-promoted work originates from Scribes; Scribe-elected Council seat filled every cycle from S4. **V3 adds early-cycle indicators:** by S3 month 6, Scribe-Account registrations 10%+ of total participation accounts; by S4 month 6, organic Scribe submissions 5%+ of organic submission total. These early indicators close the V2 hole where Scribe-Path failure would not be detectable until S5.

**Threshold for "failing":** Sub-5% Scribe representation by S5; Scribe-elected seat unfilled twice; S3-S4 early indicators below half-target.

### Proxy 6: Pane-structure load-bearing-ness (V3 addition)

**Threshold for "working":** By S6, at least one Shadow Pane has accumulated 10+ supporting submissions; at least one new-Pane proposal has been activated by Council vote (or at least three have been deliberately non-activated with public Council reasoning showing the new-Pane queue is live and used); cross-Pane contraband submissions are 5-15% of organic Tier-3 submissions; Pane-Steward rotation has occurred for every active Pane (no Pane-Steward holds the same Pane two consecutive Series); the 1.5x Pane-vote weighting has been the deciding factor in at least one Council vote (positive or negative — demonstrating it is a real lever, not ceremonial).

**Threshold for "failing":** Zero Shadow Pane activations or principled non-activations by S6 (the new-Pane queue is unused); cross-Pane submissions sub-1% (the 2x reward is failing to motivate); same Pane-Steward holding the same Pane multiple Series (rotation is failing); the 1.5x weighting never affects an outcome (Stewards are rubber-stamps).

### Tertiary signals

- Tier-distribution conforms to roughly 70:20:10 by S4-S5.
- LORE burn rate within 20% of emission rate; Stability Reserve triggerings 0-1 per year.
- No single wallet holds more than 2% of LORE supply (excluding Treasury).
- No single contributor holds more than 10% of all Authorship NFTs in any single Series.
- Adversarial Reading Pass detection rate stable; bug-bounty catches per cycle 0-3.
- Wallet-cluster detection identifies 0-2 clusters per cycle in canon-eligible material.
- AI disclosure distribution roughly matches population norms.
- External fan-criticism / parody / unauthorized derivative-work emerges (paradoxical positive signal).
- Resident Author retention: 80%+ acceptance, 80%+ 2-year retention.
- Council 4-4 deadlocks: 0-2 per cycle (more than 2 indicates Council is structurally split, diagnose).

### The single most important indicator

If, by Series 5, there exists a meaningful body of fan-canon Hub material that is read, cited, and built upon by other fans — independent of whether it is canon-promoted — and if at least one Resident Author has emerged from the contributor cohort, *and* if the Pane structure is producing real curatorial differentiation (active Pane-Stewards, populated Shadow Pane archive, at least some cross-Pane contraband flow), the architecture is working.

The point is not to mass-produce canon. The point is to produce a participatory cosmology in which fans bring their own contraband across the border. The Canon Council's job is to be a slow, careful, occasional adopter of the best of that contraband into core. The Hub's job is to host the rest, with permanent attribution, on-chain archival, and structural respect for the work — whether or not it is ever promoted. The Pane-Steward's job is to maintain the cosmological coherence of each Pane while admitting genuine outside contraband. The Resident Author track's job is to ensure that when fan contraband is genuinely better than staff contraband, the platform can absorb that meritocratic pressure without either consuming the contributor (Homestuck failure) or rejecting them (RWBY failure).

The architecture answers the third voice's question with structural commitments rather than hopes. Cold-start is designed for, not assumed away. Hostile actors are designed against, not handled by reactive moderation. The crypto-refusenik writer-class is designed in, not assumed absent. The fan-better-than-team scenario is designed for as a success case. AI-generated submissions are addressed by policy. The token economy has actual numbers, autonomous stability mechanisms, and acknowledged adversary cost-curves. The contraband mechanic has a full state machine, an Authorship NFT schema, and an explicit immutability model. The multi-pantheon Pane structure is load-bearing in governance, not decorative — Pane-Stewards hold real veto power, cross-Pane contraband is structurally rewarded, Shadow Panes are a real archive, new-Pane proposals have their own queue and threshold.

The contraband crosses the border because the border is structured to admit it, the audience is seeded to receive it, the attribution is bound to it the moment it crosses, the compensation is delivered without forcing the contributor through cryptography they don't want, the canon is open enough to accept it when it deserves to be accepted, and the cosmology is deep enough — multi-pantheon, permeable, with thousands of shadow Panes possible — that there is always somewhere new for contraband to cross to.

Decisions, not options. — Participation Architecture v1, 2026-04-27.
