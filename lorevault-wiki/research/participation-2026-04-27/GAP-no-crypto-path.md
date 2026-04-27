# GAP: The Non-Crypto Participation Path

**Gap statement:** V1 addresses non-crypto-native users by giving them custodial Flow accounts opened with email and credit card. This is correct for the *collector* path. But V1 does not adequately address the *participant* path for users who want to contribute lore, write theories, or join the Canon Council process but who refuse to interact with any wallet, custodial or otherwise — users for whom "you have a Flow account, you just don't see it" is still crypto-adjacent enough to be a deal-breaker. V1 implicitly assumes that the custodial wallet is invisible enough that this user population is empty. Empirical data from Top Shot, Pinnacle, and the broader Flow consumer cohort suggests it is not.

## Why this matters

Three reasons:

1. **The most prolific fan-canon contributors historically have not been crypto-native.** SCP's top contributor cohort, the Homestuck creator-fans, the AO3 high-output author class, and the early Wikipedia editor class are all populations that arrived through writing or art, not through tokenization. Many actively prefer non-tokenized environments because tokenization is associated (correctly or not) with content-as-investment dynamics that they find aesthetically and ethically opposed to fan-creative practice. Excluding this cohort excludes the talent backbone of every successful fan-canon ecosystem.

2. **The V1 token economy makes crypto-refusal a structural exclusion.** Submission requires staking LORE. Receiving Authorship NFTs requires having a wallet. Voting on Featured Shelf requires holding a Pane card NFT. Each of these is achievable via custodial Flow account, but each is also achievable in a parallel non-tokenized form, and the architectural choice to make tokens load-bearing was made implicitly, not deliberately. Unmaking it for the participation layer (while keeping it for the collector layer) is a viable design.

3. **Regulatory and jurisdictional realities.** Some jurisdictions (US states with restrictive interpretations of token offerings, EU member states with MiCA compliance gaps for utility tokens, China's blanket NFT/token restrictions, and several others) make it legally impossible or commercially imprudent for residents to interact with token-staking systems. A LoreVault that requires LORE staking to participate is a LoreVault that excludes contributors from those jurisdictions. The collector flow handles this via fiat purchases of custodial-held NFTs; the contributor flow as currently specified does not.

## Analysis

The non-crypto-refusenik user population is heterogeneous. Three subtypes:

**(a) The Aesthetic Refusenik.** Believes tokenization is corrosive to fan-creative culture. Will not engage with any wallet, even custodial. Will participate in fan-canon if and only if the participation surface is structurally similar to AO3, SCP, or Wikipedia. Population estimate: 5-15% of the potentially-active fan-canon contributor pool.

**(b) The Practical Refusenik.** Has no philosophical objection but does not want to learn what a Flow account is, fears tax-reporting complications from receiving "tokens," does not want to deal with anything that could be perceived as financial. Will engage if the participation surface is presented as "writing on a website." Population estimate: 20-40% of the contributor pool.

**(c) The Jurisdictional Refusenik.** Cannot legally or practically interact with the token system. Will engage only if the participation surface routes around it. Population estimate: 5-10% of the global pool, concentrated in specific geographies.

Together, this is potentially 30-60% of the contributor pool that V1's token-coupled participation flow under-serves. This is not a tail-case. This is the bulk of the fan-canon writer class for which LoreVault is competing with AO3 and SCP.

## Design recommendations

A "Scribe Path" parallel participation track. Five components.

### 1. Email-account participation tier

Create an account type — the **Scribe Account** — that is fundamentally non-tokenized. A Scribe Account is opened with email + password (no custodial wallet provisioned by default, no token balance, no NFT inventory). The Scribe can:

- Read the Hub.
- Post Margin Notes on cards (visible alongside NFT-holder notes; sybil-defended via email verification + posting rate limits + the kinds of soft sybil checks AO3 uses, e.g., invitation-token onboarding for the Scribe class once the platform is past S3).
- Submit fan-canon entries through the Contraband Submission interface.
- Receive editorial feedback on submissions.
- Be canon-promoted.

The Scribe cannot:

- Hold Pane cards.
- Hold LORE tokens.
- Vote on Featured Shelf upvotes (this requires NFT-holding for sybil reasons).
- Hold an Authorship NFT directly... but see (2) below.

### 2. The "Attribution Escrow" mechanism

When a Scribe submits, an Authorship NFT is minted to a platform-held escrow wallet, with the Scribe Account ID inscribed in the metadata as the canonical author. Two consequences:

- **The Scribe gets full attribution** on the Hub, in card metadata if promoted, and in all on-chain records. Their byline reads as author-of-record. The on-chain provenance is a verifiable claim that this email-account-holder authored this work.
- **The Scribe can claim the Authorship NFT later** by graduating to a wallet (custodial or self-custodial) at any time. The platform provides a one-click "claim my authorship NFTs" flow that transfers all escrow-held NFTs to the now-provisioned wallet. The Scribe loses nothing by deferring; they simply hold the option.

This is the [AO3 pseudonym-and-claim](https://archiveofourown.org/) pattern fused with on-chain attribution. Authorship is real and immutable from the moment of submission; possession is deferrable.

### 3. Fiat-bounty alternative to LORE rewards

Canon-promoted Scribe contributions earn a **fiat bounty** (paid via direct deposit, PayPal, or comparable) instead of LORE tokens. The bounty is sized to be roughly equivalent to the LORE grant at then-current market price. The platform Treasury budgets a Scribe-Bounty line that runs in parallel to the LORE distribution, sized at ~10-20% of the contribution-reward budget.

This is structurally cleaner than "we'll give you LORE that you can sell" because:
- The Scribe never holds the token (jurisdictional safety).
- The platform never has to explain to a tax-uncomfortable user how to receive and dispose of a token.
- The economic equivalence is preserved (fiat ≈ LORE-at-market).
- The fiat-bounty path never threatens to undercut the LORE economy because Scribe contributions are gated and tracked separately.

### 4. The "Quill" recognition system

Scribes cannot receive Marginalia badges (because badges are NFTs) but should not therefore be excluded from reputation-tracking. Add: a **Quill** counter — a non-NFT, account-attached reputation score that increments analogously to Marginalia I/II/III based on the same criteria. The Quill score is displayed on the Scribe profile. Council eligibility considers Quill counts equivalent to Marginalia counts for Scribe-class candidates. If a Scribe later graduates to a wallet, their Quill counter mints as Marginalia NFTs retroactively.

### 5. Council representation for Scribes

The Council's contributor seats (V1: 2 seats elected by Authorship-NFT-holders) cannot exclude Scribes from being elected — but the V1 election mechanism (one-account-one-vote among Authorship-NFT-holders) does exclude them as voters. Recommend: split the contributor-elected seats into one elected by Authorship-NFT-holders and one elected by all qualifying contributors (Authorship-NFT-holders + Scribe accounts with sufficient Quill counts), with one-account-one-vote across both classes. This ensures that the Scribe cohort, if it grows to be a meaningful portion of contributors, has structural representation.

## What this changes about V1

Three concrete changes to the V1 architecture:

**Tier model** (V1 §2): The 5-tier model is preserved, but each of T2-T4 admits a Scribe sub-class. Tier-3 Scribes submit through the Contraband interface, receive Attribution Escrow NFTs, and are eligible for canon promotion. Tier-4 Scribes have Canon Marks held in escrow with eventual claim option.

**Token economy** (V1 §3): The submission-staking requirement does not apply to Scribes (Scribes have no LORE wallet). The platform Treasury covers an equivalent friction-cost via a per-submission cooldown — Scribes can submit at most N times per 30-day window, scaling with Quill score, replacing the economic stake with a temporal stake. The faucet remains for wallet-holders.

**Council** (V1 §4): Contributor-elected seats split as described above. Council bylaws explicitly prohibit any quality-of-deliberation differential between Scribe submissions and wallet-holder submissions. The Council reviews work, not the wallet status of the author.

## Why this matters for the binding constraint

V1's binding constraint reads: "Platform must not require participation at gate." The Scribe Path extends this: **platform must not require token holding at the participation gate either.** Tier-0 collectors don't need participation. Tier-3 contributors don't need tokens. Both halves of the user base are gated only on the action they are actually trying to take — buy a card, write a story — and not on the cryptographic infrastructure underneath. This is the deepest reading of the V1 constraint, and the Scribe Path is what implements it.

The Scribe Path also has a beneficial side-effect: it gives LoreVault a defensible answer to the recurring "this is just an NFT cash-grab" critique. A platform where the highest-quality contributors are demonstrably non-tokenized, where canon promotion cannot be bought through any token mechanism, and where the writing layer is structurally independent of the speculation layer, is a platform that has actually solved the participation-versus-financialization tension that NounsDAO, Friend.tech, and a generation of token-gated fan platforms failed to solve.
