# LoreVault: Participation Architecture — Implementation Spec
**Version:** 1.0  
**Based on:** Synthesis V3 (2026-04-27)  
**Date:** 2026-04-27  
**Author:** Implementation Architect  
**Status:** Draft — For Engineering Review  

---

## 0. Preamble (orientation, not scope)

This document translates the V3 synthesis into engineering-actionable specifications. It assumes familiarity with [Cadence](https://cadence-lang.org/), the [Flow NFT standard](https://github.com/onflow/flow-nft), the [Flow Fungible Token standard](https://github.com/onflow/flow-ft), and the existing Dapper Labs custodial-account stack used by [Top Shot](https://nbatopshot.com/) and [Disney Pinnacle](https://disneypinnacle.com/).

Series 1 ships participation-DISABLED. Every contract specified below is either deployed in Series 1 in a dormant/paused state (so that addresses are stable and migrations are unnecessary) or deployed at the Series boundary that activates its functionality. The §7 rollout grid names which.

The two user classes are first-class throughout: a custodial Flow account opened with email plus credit card is the default, and a Scribe Account is a wallet-free identity backed by the LoreVault Foundation's Attribution Escrow. No surface in this spec ever forces a Scribe to provision a wallet. Wallet graduation is a one-click escrow-claim, not a re-enrollment.

---

## 1. Token Contract Architecture (Flow Cadence)

Seven contracts comprise the on-chain core. All are deployed to the LoreVault platform account on Flow mainnet at the start of Series 3 (the participation-enabling phase), except `PaneRegistry` which deploys at Series 1 in read-only mode. All contracts emit events sufficient for an off-chain indexer (Dapper-style GraphQL over a Postgres mirror) to drive the Hub UI without any direct-Cadence reads on the hot path.

### 1.1 `LoreToken` — fungible token (FT standard)

**Purpose.** The LORE fungible token. Drives contribution rewards, submission stakes, sink-mechanic burns, and quarterly USD-peg recalibration. Conforms to the [Flow FungibleToken standard](https://github.com/onflow/flow-ft) so it interops with existing DEX and wallet infrastructure on Flow.

**Key resources.**
- `Vault: @FungibleToken.Vault` — standard balance resource, held by every wallet that has been initialized for LORE.
- `Minter: @LoreToken.Minter` — restricted-capability resource. Owned exclusively by `LoreGovernor`. The `LoreToken` contract has no public mint function; minting flows only through `LoreGovernor.emitGrant(...)`.
- `Burner: @LoreToken.Burner` — restricted-capability resource. Owned by `SubmissionCurator`, `LoreGovernor`, and a public Sink contract for cosmetic/pin burns.

**Capabilities exposed.**
- `/public/loreReceiver` — standard `FungibleToken.Receiver` capability. Anyone can deposit LORE.
- `/public/loreBalance` — standard `FungibleToken.Balance` capability. Anyone can read.
- Private `/storage/loreVault` — owner-only withdrawal.

**Events.** `TokensMinted(amount, recipient, grantType)`, `TokensBurned(amount, source, burnReason)`, `TokensWithdrawn(amount, from)`, `TokensDeposited(amount, to)`. The `grantType` and `burnReason` enums are the load-bearing fields for the indexer's economic dashboard.

**Access control.** Mint authority locked at deploy: the `Minter` resource is created once in `init()`, transferred to `LoreGovernor`, and the constructor function is sealed. There is no admin key, no upgrade path, no founder-controlled mint. Total supply cap of 1,000,000,000 LORE is enforced as a hard constant in `LoreGovernor.emitGrant`.

```cadence
pub contract LoreToken: FungibleToken {
    pub var totalSupply: UFix64
    pub let SUPPLY_CAP: UFix64 // 1_000_000_000.0

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance { /* standard */ }
    pub resource Minter { pub fun mintTokens(amount: UFix64, recipient: &{FungibleToken.Receiver}, grantType: UInt8) { /* enforces SUPPLY_CAP */ } }
    pub resource Burner { pub fun burnTokens(from: @Vault, burnReason: UInt8) { /* decrements totalSupply */ } }

    init() {
        self.totalSupply = 0.0
        self.SUPPLY_CAP = 1_000_000_000.0
        // Mint Minter, transfer to LoreGovernor address. No retained admin reference.
    }
}
```

### 1.2 `AuthorshipNFT` — submission attribution NFT (NFT standard)

**Purpose.** One Authorship NFT minted at submission time per the V3 §5.2 schema. Serves as the immutable attribution record for every Tier-3 submission, regardless of canon outcome. Conforms to the [Flow NFT standard](https://github.com/onflow/flow-nft) so collections render in any standards-aware wallet.

**Key resources.**
- `NFT: @AuthorshipNFT.NFT` — owns the full §5.2 schema. Non-transferable in practice via a withdraw-disabled `Collection` (technically the standard requires `withdraw`, so the resource has it but the `Collection.withdraw` reverts unless called by `ScribeEscrow` during graduation, or by a holder with the `archiveTransfer` capability — set up only for the historical-archive transferability the V3 doc allows).
- `Collection: @AuthorshipNFT.Collection` — per-account holding resource, with the standard `deposit`, `getIDs`, `borrowNFT` interfaces plus a guarded `withdraw`.

**Schema (mirrors V3 §5.2 exactly).** See pseudo-code below; the `versionExtensions` and `stateHistory` arrays are append-only via internal contract functions, never directly mutable from a transaction.

**Capabilities exposed.**
- `/public/authorshipCollection` — read-only `getIDs` and `borrowAuthorship` for UI rendering.
- Private `/storage/authorshipCollection` — owner-only.
- A privileged `/private/authorshipMutator` capability published only to `SubmissionCurator` enables state-machine transitions and version appends.

**Events.** `AuthorshipNFTMinted(submissionId, submitter, paneId, contentHash, stakeAmount, scribeAccountId?)`, `SubmissionStateUpdated(submissionId, newState, timestamp, txHash)`, `VersionAppended(submissionId, versionNumber, contentHash)`, `CanonVersionLocked(submissionId, lockedVersionHash)`, `ModerationOverlaySet(submissionId, overlayHash)`.

**Access control.** Mint authority restricted to `SubmissionCurator`. State-machine writes restricted to `SubmissionCurator`. Version appends restricted to the original `submitter` address (or the `ScribeEscrow` address with `scribeAccountId` matching) and reverted while `currentState == 5` (Council Shortlist freeze). Canon-promotion fields written only by `SubmissionCurator` after a verified `LoreGovernor.recordCouncilVote` call.

```cadence
pub contract AuthorshipNFT: NonFungibleToken {
    pub resource NFT: NonFungibleToken.INFT {
        pub let submissionId: UInt64
        pub let submitter: Address
        pub let scribeAccountId: String? // populated only for Scribe-escrow NFTs
        pub let submissionTimestamp: UFix64
        pub let paneId: UInt32
        pub let secondaryPaneId: UInt32?
        pub let submissionType: UInt8 // a..f
        pub let aiDisclosure: UInt8 // i..v
        pub let contrabandDeclarationHash: [UInt8; 32]
        pub let customsCostHash: [UInt8; 32]
        pub let loreStakeAmount: UFix64
        pub let temporalStakeUsed: Bool
        pub let v1ContentHash: [UInt8; 32]
        access(contract) var versionExtensions: [VersionExtension]
        access(contract) var currentState: UInt8
        access(contract) var stateHistory: [StateTransition]
        access(contract) var canonPromotionDate: UFix64?
        access(contract) var canonVersionLockHash: [UInt8; 32]?
        access(contract) var royaltyRate: UFix64?
        access(contract) var canonVoteHash: [UInt8; 32]?
        access(contract) var moderationOverlayHash: [UInt8; 32]?
    }
    // Collection with guarded withdraw.
    // Only SubmissionCurator can mutate state; only ScribeEscrow can transfer on graduation.
}
```

### 1.3 `ContributionBadge` — soulbound Marginalia + Canon Mark

**Purpose.** Holds the Tier-2 Marginalia (I–X) badges, Tier-4 Canon Marks, Pane-Steward badges, Scribe Quill mirror NFTs, and Cross-Pane Conduit badges. All fully soulbound: `Collection.withdraw` reverts unconditionally. Even archive-transfer is disabled here (these are pure reputation; if the user wants their record portable, they export the signed metadata bundle via §6.5).

**Key resources.**
- `Badge: @ContributionBadge.Badge` — generic resource discriminated by `badgeType` and `tier` fields.
- `Collection: @ContributionBadge.Collection` — withdraw-locked.

**Capabilities exposed.**
- `/public/badges` — read-only `getIDs`, `borrowBadge`. Used by every governance-weight calculation (Marginalia upvote weights, Council eligibility filters).

**Events.** `BadgeMinted(badgeType, tier, recipient, sourceEvent)`, `MarginaliaUpgraded(holder, fromTier, toTier)`, `CanonMarkMinted(holder, submissionId, royaltyRate)`, `PaneStewardBadgeAssigned(holder, paneId, seriesId, expiresAt)`, `PaneStewardBadgeRevoked(holder, paneId, reason)`.

**Access control.** Mint authority for Marginalia restricted to `SubmissionCurator` (triggered by upvote-threshold crossings tracked off-chain and posted on-chain by the indexer service via a privileged capability). Canon Mark mint restricted to `SubmissionCurator` triggered by Council promotion. Pane-Steward badge mint and revoke restricted to `LoreGovernor`. Quill mirror NFTs minted only via the `ScribeEscrow.graduate` flow.

### 1.4 `PaneRegistry` — active Pane registry, Shadow Panes, Steward assignments

**Purpose.** The single source of truth for which Panes are active, which are Shadow, and which Pane-Steward holds first-read responsibility for each. Drives the Hub URL routing in §2 and the cross-Pane co-approval enforcement in `SubmissionCurator`.

**Key resources / fields.**
- `paneRecords: {UInt32: PaneRecord}` — keyed by `paneId`. Each `PaneRecord` carries `name`, `status` (active | shadow | archived), `axiomDeclarationHash`, `coherenceDocCID` (IPFS), `currentStewardAddress`, `stewardSeriesId`, `activatedAtSeries`, `supportingSubmissionCount`.
- `shadowPanes: [UInt32]` — index for fast filtering.
- `stewardHistory: {UInt32: [StewardTerm]}` — enforces "no Steward holds the same Pane two consecutive Series."

**Capabilities exposed.**
- `/public/paneReader` — `getActivePanes()`, `getShadowPanes()`, `getPaneRecord(paneId)`, `getCurrentSteward(paneId)`.
- Privileged write capabilities held by `LoreGovernor` only: `proposeNewPane`, `activatePane`, `assignSteward`, `rotateSteward`, `archivePane`.

**Events.** `PaneActivated(paneId, axiomDeclarationHash, activatedBySeriesId)`, `PaneArchived(paneId, reason)`, `PaneStewardAssigned(paneId, stewardAddress, seriesId)`, `ShadowPaneRegistered(paneId, proposerAddress, axiomDeclarationHash)`, `SupportingSubmissionRecorded(paneId, submissionId)`.

**Access control.** Read-public, write-restricted to `LoreGovernor`. The "no consecutive Steward terms on the same Pane" rule is enforced at the contract level by checking `stewardHistory[paneId]` against the proposed `stewardAddress` for the immediately preceding `seriesId`.

### 1.5 `SubmissionCurator` — submission state machine

**Purpose.** Implements the V3 §5.1 nine-state state machine (States 0–8). Owns the `Minter` capability for `AuthorshipNFT`, the privileged write capability for `ContributionBadge` (Marginalia and Canon Mark mints), and a withdraw capability on the LoreVault stake-escrow `Vault`. Every state transition emits an event the indexer keys notifications off.

**Key resources.**
- `StakeEscrow: @LoreToken.Vault` — receives staked LORE on submission, refunds on Hub publication, burns on confirmed-spam rejection.
- `SubmissionRecords: {UInt64: SubmissionMeta}` — off-chain-queryable mirror of NFT state (for batch indexer reads).

**Key transitions and triggers.**
- `submit(submissionPayload, stake)` → mints AuthorshipNFT, sets state `1: Submitted`, escrows stake, emits `AuthorshipNFTMinted`.
- `completeAdversarialPass(submissionId, passResult)` → state `2: Pending Review` or `3: Hub-Published` depending on flag. Caller: privileged `TrustAndSafetyCap` held by the off-chain Adversarial Reading Pass service.
- `publishToHub(submissionId)` → state `3`, refunds stake, emits `HubPublished` and `StakeRefunded`.
- `promoteFeaturedShelf(submissionId, mechanism)` → state `4`, pays Featured Shelf bonus via `LoreGovernor.emitGrant`.
- `councilShortlist(submissionId, cycleId)` → state `5`, freezes version edits.
- `recordCouncilVote(submissionId, voteRecord)` → state `6` (Canon Promoted), `7` (Hub-Resident), or `8` (Returned with Feedback). Caller: `LoreGovernor`.
- `submitRevision(submissionId, newContentHash)` → appends to `versionExtensions`. Reverts if `currentState == 5`.

**Time-limit enforcement.** The contract stores `stateEnteredAt` per submission; a public `tickTimeouts(submissionIds[])` function (callable by anyone, gas paid by caller) enforces the timeouts in V3 §5.1 (4-hour Adversarial Pass, 7-day T&S, 30-day Hub window, 21-day Council vote, 90-day revision window). Indexer invokes hourly; permissionless caller fallback prevents stuck submissions.

**Events.** Every event named in V3 §5.1 is emitted: `AuthorshipNFTMinted`, `SubmissionStateUpdated`, `HubPublished`, `StakeRefunded`, `FeaturedShelfPromoted`, `CouncilShortlisted`, `CanonMarkMinted`, `RoyaltyAssigned`, `CanonGrantPaid`, `SubmissionDeferred`.

### 1.6 `LoreGovernor` — inflation governor + deflation valve + USD-peg

**Purpose.** The autonomous economic-stability layer per V3 §3.4. Holds the `LoreToken.Minter` resource. Exposes grant emission, sink-burn redistribution, quarterly USD-peg recalibration, and the (a)–(e) instability mechanisms.

**Key resources / fields.**
- `Minter: @LoreToken.Minter` — the only mint authority on the platform.
- `StabilityReserve: @LoreToken.Vault` — the 8% (80M LORE) stability pool.
- `QuarterlyVWAP: UFix64` — last recorded 30-day VWAP, written by privileged oracle capability.
- `submissionCount30d: UInt64`, `submissionCount12mAvg: UInt64` — for inflation-governor trigger.
- `LastDeflationTriggers: [UFix64]` — capped at three over the 10-year emission curve.

**Capabilities exposed.**
- `emitGrant(grantType, recipient, usdFloor)` — converts USD floor to LORE via current quarterly recalibration, mints from `Minter`, deposits to recipient `loreReceiver`. Restricted to `SubmissionCurator`.
- `recordCouncilVote(submissionId, votes[])` — validates vote against composition rules in `PaneRegistry` (1.5x Pane-Steward weighting), forwards result to `SubmissionCurator`.
- `triggerInflationGovernor()` — public, idempotent per quarter. Reads on-chain submission counts, burns 50% of unspent grant capacity if trigger condition met.
- `triggerDeflationValve()` — public, idempotent per 90-day window. Reads `QuarterlyVWAP`, releases 20% emission rate increase from `StabilityReserve` if trigger met.
- `recalibrateQuarter(newVWAP)` — privileged, called by oracle capability at quarter boundaries.

**Events.** `GrantEmitted(grantType, recipient, loreAmount, usdFloor, vwapUsed)`, `InflationGovernorTriggered(submissionCount, threshold, burnedAmount)`, `DeflationValveTriggered(vwapMultiple, emissionIncrease)`, `QuarterlyRecalibration(quarter, newVWAP, prevVWAP, midQuarterEmergency)`, `CouncilVoteRecorded(submissionId, yesWeighted, noWeighted, deferWeighted, decision)`.

**Access control.** Mint authority is sole-held; no other contract can call `Minter.mintTokens`. Oracle write restricted to a `priceOracle` capability assigned at deploy to a multisig oracle service. Constitutional amendments (Scribe-pool reallocation, supply-cap-related parameters) require a `LoreGovernor.constitutionalAmendment(...)` call gated on a 6-of-8 Council vote plus a 30-day timelock.

### 1.7 `ScribeEscrow` — Attribution Escrow for Scribe Path

**Purpose.** Holds `AuthorshipNFT` and `ContributionBadge` resources on behalf of Scribe-Account holders who have not provisioned a wallet. Implements the one-click `graduate` flow that transfers all escrowed assets to a newly provisioned wallet. Operated by the LoreVault Foundation (separate nonprofit per V3 §3.10), so escrow assets persist even if LoreVault Corp shuts down.

**Key resources.**
- `escrowCollection: @AuthorshipNFT.Collection` — holds NFTs awaiting graduation.
- `escrowBadges: @ContributionBadge.Collection` — holds Quill-mirror badges and Canon Marks for not-yet-graduated Scribes.
- `scribeMap: {String: ScribeEscrowRecord}` — keys are off-chain `scribeAccountId` strings issued by the Foundation auth service. Record contains `nftIds`, `badgeIds`, `quillScore`, `pendingFiatBountyUSD`, `graduationStatus`.

**Capabilities exposed.**
- `mintForScribe(submissionPayload)` — privileged, called by `SubmissionCurator` when a Scribe submits. Mints `AuthorshipNFT` to escrow with `scribeAccountId` populated and `submitter` set to the Foundation address.
- `incrementQuill(scribeAccountId, delta)` — privileged, called by indexer service tracking upvotes.
- `graduate(scribeAccountId, recipientWallet, attestation)` — verifies a signed attestation from the Foundation auth service binding `scribeAccountId` to `recipientWallet`, transfers all escrow holdings, retroactively mints Marginalia NFTs equivalent to `quillScore`. Public callable, but the attestation is single-use.
- `recordFiatBounty(scribeAccountId, usdAmount)` — privileged, audit log only; actual fiat disbursement is off-chain via PayPal / [Wise](https://wise.com/) / direct deposit.

**Events.** `ScribeAuthorshipMinted(submissionId, scribeAccountId, paneId)`, `QuillIncremented(scribeAccountId, newScore)`, `ScribeGraduated(scribeAccountId, recipientWallet, nftCount, badgeCount)`, `ScribeFiatBountyRecorded(scribeAccountId, usdAmount, payoutChannel)`.

**Access control.** Foundation-controlled multisig holds the privileged write capabilities. The Foundation cannot mint LORE (that's `LoreGovernor` exclusive). The Foundation cannot read or modify Scribe content beyond Authorship metadata. The Foundation has a constitutional duty to honor any graduation request indefinitely; the contract has no expiry on escrow.

---

## 2. Off-Canon Submission UI Surface

The submission interface lives under the `/v3` surface tree, rooted at `/hub`. The route hierarchy is:

| Route | Purpose | Access |
|-------|---------|--------|
| `/hub` | Top-level Hub index, all Panes' Featured Shelves, global search | Public read; logged-in for upvote/Margin Note |
| `/hub/pane/<paneId>` | Pane sub-Hub: Pane's coherence doc, Featured Shelf, recent submissions, Steward profile | Public read |
| `/hub/pane/<paneId>/submit` | The 5-step Contraband Submission flow scoped to that Pane | T3-eligible (wallet or Scribe) |
| `/hub/cross-pane` | Cross-Pane contraband index (category f submissions) | Public read |
| `/hub/shadow/<paneId>` | Shadow Pane archive — proposed-but-not-activated Panes | Public read; submission allowed |
| `/hub/submission/<submissionId>` | Permalink for an individual submission, all versions, Margin Notes, vote tallies | Public read |
| `/hub/council` | Council Shortlist queue (admin-only) | Council seat holders only |
| `/hub/scribe/onboard` | Scribe Account registration (email-only) | Public |
| `/hub/scribe/graduate` | One-click wallet provisioning + escrow claim | Logged-in Scribes |

Server-side rendering for everything below `/hub`; the surface is fully crawlable for SEO-indexed Hub content (passive readers reach the Hub via search engines, not via wallet-gated SPA navigation). Logged-out users see read-only views; logged-in users gain Margin-Note and upvote affordances.

### 2.1 Five-step Contraband Submission flow

The flow is a single React route at `/hub/pane/<paneId>/submit` that progresses through 5 stepper panels. Each panel persists draft state to the contributor's local `IndexedDB` (the V3 §5.1 State 0: Draft is purely off-chain). Only Step 5 commit triggers an on-chain transaction.

**Step 1 — Declare your origin.**
- Field: `originPane` — radio with three modes: "Single Pane" (with searchable Pane picker pre-filled from URL), "Two Panes" (cross-Pane category f, second Pane picker appears), "Outside-Pane" (paneId = 0).
- Validation: the picker only lists Panes with `status == active` from `PaneRegistry`. Shadow-Pane submissions are made from `/hub/shadow/<paneId>/submit` which is a separate route (§2.4) so shadow-targeting is always explicit.
- On-chain action: none yet. Stored in draft.

**Step 2 — Declare your contraband.**
- Fields: `submissionType` (dropdown: a-short-fiction, b-art, c-theory, d-alt-Pane, e-axiom-extension, f-cross-Pane). `contrabandDeclaration` (single-sentence text, 280 char hard limit). `category` sub-tag (axiom-extension | character | object | event | place | ritual | inter-Pane-crossing) — only enabled for type d/e/f.
- Validation: declaration cannot be empty; type d requires `originPane == single` plus a separate Axiom Declaration document upload (see §6.4 Axiom Declaration grant); type f requires `originPane == two-panes` and the inter-Pane-crossing sub-tag.
- On-chain action: none.

**Step 3 — Declare the customs cost.**
- Field: `customsCost` (free-form text, 100–1000 chars). What does this contraband cost the world to admit?
- Validation: 100-char floor enforces non-trivial answers; the doctrine's "buried weight" requirement means an empty cost is rejected.
- On-chain action: none.

**Step 4 — Declare your tools.**
- Field: `aiDisclosure` (radio, categories i–v). Required.
- UI affordance: each category has explanatory hover-text quoting V3 §4. Category v carries an inline warning that the submission will be Hub-admitted but is excluded from canon promotion.
- On-chain action: none.

**Step 5 — The crossing.**
- Fields: `bodyContent` (rich-text editor or image uploader depending on submissionType), `title`, `offCanonPermanentFlag` (optional checkbox per V3 §5.3).
- For wallet contributors: a stake summary panel computes the LORE stake from `submissionCount12m` (per V3 §3.3 tiered curve) and shows a "Stake X LORE" button; first-time-contributor faucet auto-applies if eligible.
- For Scribes: the panel shows the temporal cooldown (`N = 1 + floor(Quill / 5)`) and remaining submissions-this-window; if quota is exhausted, the submit button is disabled with the next-available date.
- On-chain action triggered by submit: indexer pins body content to IPFS (returning `v1ContentHash`), then `SubmissionCurator.submit` is called via the wallet's signing flow (or via the Foundation's `mintForScribe` for Scribes). On success, redirects to `/hub/submission/<submissionId>` showing State 1: Submitted.

### 2.2 Featured Shelf

The Featured Shelf surfaces on the Hub index (`/hub`) and on each Pane sub-Hub (`/hub/pane/<paneId>`). Per V3 §4 Layer 3 the four promotion mechanisms are: top-5% rolling 30-day, Curator nomination, 2+ Council nomination, 30+ Marginalia-weighted upvote fast-track.

**UI structure.** A horizontal carousel above the standard Hub feed showing 5–8 Featured cards at a time, each badged with its promotion mechanism (small icon and tooltip). Clicking a card opens its `/hub/submission/<submissionId>` permalink.

**Sort/filter options.** Default sort: Marginalia-weighted-upvote score within current cycle. Alternative sorts: most recent promotion, Pane filter (sub-Hub view auto-applies its Pane filter), submissionType filter. The Marginalia weighting (V3 §4 Layer 3 — 1.0 for Marginalia-I, 1.2 for II, ... 2.5 for X, logarithmic) is computed off-chain by the indexer and refreshed nightly; on-chain we record raw upvote events and the indexer applies weights.

**Marginalia-weighted ranking display.** Each Featured card shows a "weight: X.Y / votes: N" label so contributors and readers can see the weighting transparently. A "show me how this is calculated" link expands an inline explainer.

**Quill shadow-shelf overlay.** A toggle in the Pane sub-Hub view labeled "Show Scribe shadow-shelf" reveals the parallel Quill-weighted ranking — submissions that the Scribe community has elevated, separate from the wallet-holder Featured Shelf. The Lore Curator's daily review explicitly considers both.

### 2.3 Council Shortlist queue (admin-only)

Routes under `/hub/council` (see §5 for the full Council tooling spec). Linked from the public Featured Shelf only by a small "promoted to Council Shortlist on YYYY-MM-DD" badge on individual submission permalinks; the queue itself is not browsable by non-Council users.

### 2.4 Scribe Path parallel flow

**Onboarding at `/hub/scribe/onboard`.** Email + password + invitation token (post-S3). No wallet provisioning. The Foundation's auth service issues a `scribeAccountId`; the user's session cookie binds to it.

**Submission at `/hub/pane/<paneId>/submit`.** Identical UI to the wallet flow, except Step 5 shows the temporal-cooldown summary instead of LORE stake. On submit, the request goes to a Foundation backend service that signs a `mintForScribe` transaction (the Foundation's privileged capability). The Scribe never sees Cadence.

**Margin Notes and upvotes.** Available in read paths. Sybil defense via email verification + posting rate limits + (post-S3) invitation-token onboarding.

**Attribution Escrow.** Every accepted submission's Authorship NFT is held in `ScribeEscrow.escrowCollection`. The Scribe's profile page at `/hub/scribe/<scribeId>` shows their authorship inventory as if they owned it — visually identical to a wallet-holder's profile, with a small "held in Foundation escrow" indicator.

**Fiat-bounty claim.** Quarterly bounty payouts trigger a notification to the Scribe's email with a "claim" link to a Stripe-equivalent fiat-disbursement flow (PayPal, Wise, or platform credit, per V3 §3.7). On-chain `recordFiatBounty` event is fired for audit; actual money movement is off-chain.

**Graduation at `/hub/scribe/graduate`.** A single button "Provision a wallet and claim my archive." Behind the scenes: a custodial Flow account is created via the Dapper onboarding flow (same path Top Shot uses), the Foundation auth service signs a graduation attestation, `ScribeEscrow.graduate` transfers all escrow holdings, and Quill score is retroactively minted as Marginalia NFTs. The user lands on their new wallet's profile with their full historical archive intact.

---

## 3. Curation Queue Mechanics

The state machine in V3 §5.1 is implemented on `AuthorshipNFT.currentState` and `stateHistory`. This section enumerates the transitions, triggers, events, time limits, and timeout behavior.

### 3.1 State machine transitions

| From → To | Trigger | Caller | On-chain event | Time limit | Timeout behavior |
|---|---|---|---|---|---|
| 0 Draft → 1 Submitted | Step 5 commit | Contributor wallet (or Foundation for Scribes) | `AuthorshipNFTMinted` | None (off-chain draft) | — |
| 1 Submitted → 2 Pending Review | Adversarial Reading Pass complete | T&S service capability | `SubmissionStateUpdated("Pending Review")` | 4 hours | Auto-promote with `pass-incomplete` flag, T&S follow-up async |
| 2 Pending Review → 3 Hub-Published | Pass clean OR T&S 7-day window expires | Automated tick or T&S | `HubPublished`, `StakeRefunded` | 7 days for flagged | Default to Hub publish with T&S-pending overlay |
| 3 Hub-Published → 4 Featured Shelf | Top-5% / Curator / 2+ Council / 30+ upvote fast-track | Indexer privileged capability OR Curator OR Council | `FeaturedShelfPromoted(mechanism)` | None on State 3 itself | After 30-day open community window, defaults to State 7 if no Featured promotion |
| 4 Featured Shelf → 5 Council Shortlist | End of Series cycle | Automated cycle-tick | `CouncilShortlisted` | Series cycle | Auto-rolls at cycle boundary |
| 5 Council Shortlist → 6 Canon Promoted | 5-of-8 weighted Council vote yes | `LoreGovernor.recordCouncilVote` | `CanonMarkMinted`, `RoyaltyAssigned`, `CanonGrantPaid` | 14 days Steward + 21 days Council | If no quorum after 21 days, auto-roll to next cycle's shortlist |
| 5 Council Shortlist → 7 Hub-Resident | Council vote no, OR cycle timeout, OR 4-4 deadlock | `LoreGovernor.recordCouncilVote` or tick | `SubmissionStateUpdated("Hub-Resident")`, "Pending Council Review" badge preserved | — | — |
| 5 Council Shortlist → 8 Returned with Feedback | Council vote defer | `LoreGovernor.recordCouncilVote` | `SubmissionDeferred` | 90 days | If no revision in 90 days, defaults to State 7 |
| 8 Returned with Feedback → 5 Council Shortlist | Contributor submits revision | Contributor | `VersionAppended`, `CouncilShortlisted` | — | — |

### 3.2 Council vote mechanics

**Quorum.** 5 of 8 seats present. The cycle-tick caller cannot force a vote without quorum; the submission auto-rolls to next cycle.

**Pane-Steward 1.5x weighting.** On Pane-specific proposals, the relevant Steward's vote is multiplied by 1.5 in the tally. Implementation: `LoreGovernor.recordCouncilVote(submissionId, votes[])` accepts a list of `(seat, voteType)` entries; the tally function looks up the submission's `paneId` in `PaneRegistry`, identifies the Steward seat (if any), and applies the 1.5 multiplier. Cross-Pane submissions: both Stewards' votes are weighted 1.5 (and both must have signed off in State 5 already, per §3.4 below). Constitutional matters: weighting is suppressed (always 1.0).

**Decision threshold.** `yesWeighted >= 5.0` and `yesWeighted > noWeighted` → State 6 Canon Promoted. `noWeighted > yesWeighted` and `deferWeighted < majority` → State 7 Hub-Resident. `deferWeighted >= 2` plus split tally → State 8 Returned with Feedback.

**Deadlock (4-4-0).** Falls into "no decision" branch: returns to Hub-Resident with `Pending Council Review` badge preserved, auto-rolls into next cycle's shortlist. The tie-breaker chair is explicitly disabled — `LoreGovernor` rejects any vote payload claiming a tie-break.

### 3.3 Adversarial Reading Pass

**Who conducts it.** A small specialist function within Trust & Safety, equipped with a structured rubric and a privileged Cadence capability (`TrustAndSafetyCap`) that can call `SubmissionCurator.completeAdversarialPass`. The team is 1–2 people through S4, scaling with submission volume.

**When.** Two passes:
1. State 1 → State 2 transition: scan-on-submission, automated heuristics + human spot-check, target 10-minute median latency, 4-hour hard ceiling.
2. State 4 deeper second-look: when a submission promotes to Featured Shelf, a deeper rubric-driven review since the work is now on a path to Council attention.

**What it checks.** Per V3 §4 Layer 2: known extremist symbology and dog-whistles, brigade patterns (consistent ideological framing across same-wallet/cluster submissions), encoded extra-textual content (acrostics, hidden references, structural payloads), AI-disclosure category iv/v flagging.

**How it's recorded.** The pass produces a `passResult` payload (clean | flagged | structural-harm) plus a `findingsHash` (SHA-256 of the off-chain rubric output). On-chain `SubmissionStateUpdated` carries the result; for flagged submissions, `ModerationOverlaySet(submissionId, overlayHash)` writes a moderation note onto the Authorship NFT. False-positive appeals route through a separate appeal queue in the Council tooling (§5).

### 3.4 Cross-Pane co-approval enforcement

For category f submissions in State 5, the contract refuses to accept a `recordCouncilVote` until both Pane-Stewards have called a `coApproveSteward(submissionId)` privileged function. The state-machine event log shows both `StewardCoApproval` events before the vote is admitted. If either Steward declines (calling `declineSteward`), the submission immediately returns to State 7 Hub-Resident.

---

## 4. Status-NFT Badge Design

All badges live in `ContributionBadge` except `AuthorshipNFT` which is its own contract per §1.2. Visual specs are mockups for art direction; on-chain attributes are the load-bearing source of truth.

### 4.1 Reader's Sigil (T1 onboarding)

**Visual concept.** A subtle decorative overlay — a small rune in one corner of the card frame, rendered as a layered SVG. Visually distinct from any LORE-burned cosmetic frame (Sigils are subtle overlays; LORE frames are full-card stylings — V3 §2 T1 design rule).

**On-chain attributes.** `badgeType: ReadersSigil`, `paneId: UInt32`, `cardId: UInt64`, `triggeredAt: UFix64`, `triggerMechanism: UInt8` (lore-trail-completion).

**How earned.** Free. Awarded automatically when a Tier-1 user reads the full lore-trail across a Pane's complete card set (read events tracked off-chain in the indexer, on-chain mint triggered when the trail is provably completed).

**What it grants.** Aesthetic only. The Sigil overlays on the user's copy of the card in their gallery view. No market-value impact, no governance weight, no token grant.

**Transferability.** Soulbound. The Sigil ties to the user, not the card; if the card is sold, the new holder does not see the Sigil.

### 4.2 Marginalia (T2)

**Visual concept.** A typographic emblem styled as a margin annotation mark, with Roman numeral I–X tier indicator. Rendered inline next to the user's handle on Margin Note posts.

**On-chain attributes.** `badgeType: Marginalia`, `tier: UInt8` (1–10), `noteCount: UInt32`, `weightedUpvoteScore: UFix64`, `firstMintedAt: UFix64`, `lastUpgradedAt: UFix64`.

**How earned.** First Margin Note that gets one upvote → Marginalia I. Tier upgrades trigger at logarithmic upvote-count thresholds (calibrated by the indexer; the contract accepts an `upgradeMarginalia(holder, newTier)` call from the indexer's privileged capability).

**What it grants.** Upvote weight (1.0 at I, 1.2 at II, ..., 2.5 at X — V3 §4 Layer 3). Eligibility filters for the contributor-elected Council seat (T2+). Eligibility for the rotating lottery seat. No token, no royalty, no canon authority.

**Transferability.** Soulbound.

### 4.3 Authorship NFT (T3, see §1.2 above)

**Visual concept.** A signed-and-sealed manuscript card. Displays submission metadata, contraband declaration, customs cost, current state badge, version history.

**On-chain attributes.** Full schema in §1.2 / V3 §5.2.

**How earned.** Minted at submission stake, before any review. One per submission, regardless of acceptance.

**What it grants.** Permanent attribution. Eligibility for the contributor-elected Council seat (counted toward T3+ filter). Royalty on canon-promoted derivative works. Surfaces on the contributor's profile and archive bundle.

**Transferability.** Limited — the NFT is transferable only as historical-archive record (per V3 §2 Tier-3 spec: "non-transferable... but transferable as archive record"). Implementation: `Collection.withdraw` is enabled but emits a `ArchiveTransferRecorded` event, and the Council can flag a transfer as illegitimate (e.g., attempted attribution-resale) for moderation overlay. In practice the UI does not surface a transfer affordance; the capability exists for archival migrations only.

### 4.4 Canon Mark (T4)

**Visual concept.** A wax-seal motif overlaid on a miniature of the canon-promoted card. Distinct from Authorship NFT's manuscript styling.

**On-chain attributes.** `badgeType: CanonMark`, `submissionId: UInt64`, `paneId: UInt32`, `royaltyRate: UFix64`, `promotedAt: UFix64`, `voteHash: [UInt8;32]`.

**How earned.** 5-of-8 Council vote affirmative on canon promotion (or 6-of-8 for new-Pane activation, retcon).

**What it grants.** Royalty stream (1.5% or 3.0%, V3 §2 Tier-4 spec). Public attribution on derived cards. Council nomination-pool eligibility. Resident Author track eligibility at 3+ Marks.

**Transferability.** Soulbound.

### 4.5 Pane-Steward Badge

**Visual concept.** A signet-ring motif keyed to the Pane's color signature.

**On-chain attributes.** `badgeType: PaneSteward`, `paneId: UInt32`, `seriesId: UInt32`, `assignedAt: UFix64`, `expiresAt: UFix64`.

**How earned.** Council appointment per V3 §6.1.

**What it grants.** First-read responsibility for the Pane's submissions; 1.5x vote weight on Pane-specific Council votes; co-approval authority for cross-Pane submissions; Pane-coherence document maintenance authority.

**Transferability.** Soulbound, temporary (one Series; rotation enforced by `PaneRegistry`).

### 4.6 Scribe Quill

**Visual concept.** A simple feather-quill icon, no tier indicator (Quill is a count, not a tiered badge). Rendered on Scribe profile pages and inline on Margin Notes.

**On-chain attributes.** Pre-graduation: tracked in `ScribeEscrow.scribeMap[scribeAccountId].quillScore`, no NFT minted. Post-graduation: minted as `Marginalia` NFTs at the equivalent tier (Quill 5 → Marginalia I, Quill 10 → II, etc.).

**How earned.** Same criteria as Marginalia — upvoted Margin Notes posted by Scribes. Upvote count tracked in the indexer; `incrementQuill` called via Foundation capability.

**What it grants.** Eligibility for the Scribe-elected contributor Council seat. Upvote weight on the Quill shadow-shelf (parallel to Marginalia weighting). On graduation, retroactively grants full Marginalia tier-equivalents.

**Transferability.** Soulbound. Pre-graduation, exists only as Foundation-held score; post-graduation, Marginalia rules apply.

### 4.7 Cross-Pane Conduit Badge (T4 variant)

**Visual concept.** A bridge motif spanning two Pane signets.

**On-chain attributes.** `badgeType: CrossPaneConduit`, `submissionId: UInt64`, `paneId: UInt32`, `secondaryPaneId: UInt32`, `royaltyRate: UFix64` (3.0% by default), `promotedAt: UFix64`.

**How earned.** Canon promotion of a category-f cross-Pane submission. Minted alongside the standard Canon Mark; the contributor receives both.

**What it grants.** Same rights as Canon Mark, plus a "Cross-Pane Conduit" badge displayed on profile and archive. The badge is the visible record of the doctrine-purest contribution type per V3 §6.3.

**Transferability.** Soulbound.

---

## 5. Council Tooling (Admin UI)

A separate Next.js admin app at `admin.lorevault.com`, gated by Council seat ownership (verified via Cadence script reading `PaneRegistry.councilSeats` and the user's authentication wallet). The app reads from the indexer for hot paths and writes via the user's wallet signing.

### 5.1 Submission review queue

A table view of all submissions in States 4 (Featured Shelf), 5 (Council Shortlist), and 8 (Returned with Feedback). Columns: title, submitter handle (or "blind" indicator), Pane, submissionType, AI disclosure category, days-in-state, Adversarial Pass result, Steward sign-off status (for cross-Pane submissions).

Click into any row reveals: full submission body (latest version with version-history picker), contraband + customs-cost declarations, Adversarial Pass findings, Margin Note thread summary, weighted-upvote tally, Pane-Steward notes panel.

State-machine controls: vote buttons (yes / no / defer) with weighted-tally preview, "Cycle-roll to next" button, "Return to Hub with Feedback" with a feedback-text panel that gets pinned to IPFS and hashed to `councilFeedbackHash`.

### 5.2 Blind deliberation mode

A toggle at the top of the queue. When ON: submitter handle, wallet address, prior submission count, prior canon-promotion count, and Marginalia/Quill scores are hidden. The submission renders with author fields redacted. Vote-recording is permitted in blind mode; the system records the vote against the submission, then reveals authorship after the entire shortlist for the cycle has been voted. Blind mode is the default for canon-promotion votes.

### 5.3 Pane-Steward first-read flow

A separate view at `/admin/steward/<paneId>` for the user holding the active Pane-Steward Badge. Shows: all submissions in State 5 tagged to this Pane, days-remaining-in-first-read-window per submission. The Steward writes notes (free text + structured rubric — coherence, contraband-clarity, customs-cost-honesty, doctrine-alignment), and when ready clicks "Sign off" which posts a `StewardFirstReadComplete` event to the Council deliberation packet.

For cross-Pane submissions, a second Steward sees the same submission in their queue, and both must call `coApproveSteward` (or `declineSteward`) before the submission is admitted to the Council vote.

### 5.4 Vote recording with weighted tallies

The vote-recording UI shows a live tally as Council members cast votes:
- Weighted yes / no / defer counts
- Steward seat highlighted with 1.5x indicator if applicable
- Quorum-met status
- Decision-threshold preview (e.g., "Currently 4.5 yes / 3.0 no — needs 5.0 weighted yes for promotion")

Vote payloads are signed individually; the final `recordCouncilVote` transaction batches all signed votes for atomicity.

### 5.5 New-Pane proposal queue

A separate route at `/admin/panes/proposals` showing the new-Pane proposal pipeline (V3 §6.4). Columns: proposal title, proposer, Axiom Declaration link, supporting-submission count, Pane-Steward-sponsor (if any), days-since-proposal.

Council reviews this queue once per Series cycle (every 6 months — distinct from the normal cycle review cadence). Activation requires 6-of-8 supermajority, recorded the same way as canon promotions but with a higher threshold check in `LoreGovernor.recordCouncilVote(proposalType: NewPane)`.

### 5.6 Moderation tools

**Adversarial flagging.** A queue at `/admin/moderation/flagged` of submissions where the Adversarial Reading Pass returned `flagged` or `structural-harm`. Council and T&S can review, override (set `passResult` to clean), or escalate.

**Stake-burn trigger.** For confirmed-spam rejections, a "Burn stake" button calls `SubmissionCurator.burnStake(submissionId, reason)`. Two-Council-member sign-off required before the burn executes; the contract enforces this via a multi-step commit pattern.

**Bug-bounty intake.** A separate `/admin/moderation/bounty` route lets the team record substantiated catches per V3 §4: $500–$2,000 paid per finding, recorded on-chain via a `BugBountyAwarded` event for transparency.

### 5.7 Analytics

A dashboard at `/admin/analytics`:
- Submission volume by Pane (sub-Hub level), trailing 30 days and 90 days
- Acceptance rate (canon-promoted / shortlisted) per Pane, per cycle
- Time-in-state distribution per state, with timeout-frequency tracking
- Scribe vs wallet-holder ratios: submission volume, acceptance rate, promotion rate, Council-seat election turnout
- Tier-0.5 daily-active reader counts (the cold-start health indicator from V3 §2)
- LORE economic dashboard: emission rate, burn rate, Stability Reserve balance, last-quarter VWAP recalibration, inflation/deflation trigger history
- Wallet-cluster detection results: clusters identified per cycle, action taken
- Adversarial Pass detection rate and false-positive rate (from appeal outcomes)

---

## 6. Public Archive: Off-Canon vs Canon

The archive's central design promise: a user always knows the canonical status of any content they're reading, without having to look it up.

### 6.1 URL structure and visual design language

**Canonical content (core canon).** Lives at `/canon/...` paths — `/canon/pane/<paneId>/`, `/canon/card/<cardId>/`, `/canon/character/<characterId>/`. Visual design: archival serif typography, parchment-tone background, gold-foil accent for the canonical-status badge, `<head>` `<meta name="canonical-status" content="canon" />`.

**Hub content (off-canon, Hub-Resident or Featured Shelf).** Lives at `/hub/...` paths. Visual design: contemporary sans-serif, off-white background, blue accent, badge "Hub-Resident: fan-canon, not core canon."

**Shadow Pane content.** Lives at `/hub/shadow/<paneId>/...`. Visual design: the Hub design language with an additional muted-tone overlay and an explicit "Shadow Pane Archive: this Pane has not been activated" banner at the top of each page.

The visual contrast is deliberate and consistent — at a glance, a reader knows what register the content is in.

### 6.2 Canonical-status tag

**On-chain field.** `AuthorshipNFT.currentState` and `AuthorshipNFT.canonPromotionDate` together define the status. State 6 with a non-null `canonPromotionDate` and `canonVersionLockHash` → "Canon-Promoted." Any other state (3, 4, 5, 7, 8) with State-3+ progression → "Hub-Resident." Submissions tagged to shadow-Panes carry `paneId` matching a `PaneRegistry.shadowPanes` entry → "Shadow."

**UI badge.** A standardized `<CanonStatusBadge />` React component, used everywhere a submission card appears. Three variants: Canon (gold), Hub (blue), Shadow (muted). On hover, displays the State label, promotion date if applicable, and a link to the on-chain transaction proving the status.

**Search filter.** The Hub search bar has a default toggle "Canon-only / Hub / All" with All as default. The `/canon/...` site search is naturally canon-scoped.

### 6.3 Canon vs Hub on the same page

When a Canon-promoted submission's source page is reached via `/canon/...`, the page shows the locked `canonVersionLockHash` content with the canonical-status badge prominent. Below the body, a section "This content originated as a fan submission" links to the `/hub/submission/<submissionId>` permalink, where the contributor's full version history is browsable. This is the "cross-reference linking" requirement from V3.

When a Hub submission references canon content (via inline citation or @-link), the citation renders with the Canon badge inline so the reader knows they are crossing into canonical territory. Hub-to-Hub references render with the Hub badge.

### 6.4 Cross-reference linking

Every canon page has a "Sources" section listing the fan submissions that influenced it (by Authorship NFT submissionId). Every Hub submission has a "Cited in canon" backlink section that auto-populates when canon material references it. The indexer maintains a bidirectional reference graph; backlinks update on canon-promotion events.

For derived cards, the card metadata permanently lists the contributor handle and a link to their submission archive (V3 §2 Tier-4 spec).

### 6.5 Export and portability

**"Download my archive" feature.** At `/profile/<handle>/export`, a one-click flow generates a signed bundle:
- All Authorship NFTs the user owns or had escrowed (with full metadata + IPFS pins of every version).
- All Margin Notes authored.
- All ContributionBadges (Marginalia tier history, Canon Marks, Cross-Pane Conduits, Pane-Steward badges with terms).
- A Foundation-signed manifest binding the bundle to the user's identity (wallet address or Scribe Account ID).
- An IPFS CAR file of all referenced content.
- For canon-promoted work, the full canonical version-locked content.

**Off-platform durability.** The Authorship NFTs persist on Flow if LoreVault Corp shuts down (V3 §3.10). Hub content is pinned to IPFS by the LoreVault Foundation indefinitely; the Foundation's bylaws commit to maintaining the pinning service. Scribe escrow holdings remain claimable forever via the Foundation's graduation mechanism.

**Account deletion.** Deletes the user's platform-side profile (handle, email, off-chain preferences) but does not touch on-chain assets. The user can re-claim by re-authenticating to the wallet.

---

## 7. Phased Rollout Dates

Series 1 launches now (2026-04-27); each subsequent Series ships at 6-month intervals.

### Series 1 — 2026-04-27 to 2026-10-27 (Months 0–6): Passive-First Foundation

**Participation features enabled.** None for fan participation. Pack purchase via credit card / Apple Pay / Flow wallet; custodial Flow accounts; marketplace with USD pricing; card gallery with embedded flavor-text; free Apprentice Pane on signup; static official Pane summaries; Scribe Account registration enabled in read-only mode (so the auth surface exists for cold-start measurement); read-only Discord; lore-team seed-content production begins.

**Contracts deployed.** `PaneRegistry` (read-only, holding Series 1 active Panes). No `LoreToken`, no `AuthorshipNFT`, no `SubmissionCurator`, no `LoreGovernor`, no `ContributionBadge`, no `ScribeEscrow`. The participation contract suite is not yet on-chain — this is deliberate, since deploying a dormant `LoreToken` could create speculative pressure inconsistent with the V3 §1 "participation never required for NFT value" rule.

**Admin tooling needed.** Pack-drop scheduler; marketplace-moderation queue; trademark-filing tracker (9-jurisdiction defensive registration per V3 §7 failure-mode 4); Tier-0.5 reader analytics (passive-reader instrumentation).

**Metrics gating advancement to S2.** 50,000+ unique wallets/Scribe-Accounts; $5M+ secondary marketplace volume; <1% support-ticket rate; ~10K Discord members; trademarks granted or pending.

### Series 2 — 2026-10-27 to 2027-04-27 (Months 6–12): Reader Layer + Marginalia + Seed Recruitment

**Participation features enabled (additional).** Margin Notes; Marginalia badge minting (NOTE: Marginalia is on-chain at S2 even though canon submissions aren't yet — the badge is the soft-incentive bridge from T1 to T2, and the badge's social value depends on it being on-chain from the start); Quill counter (off-chain in S2; on-chain via `ScribeEscrow` arrives at S3); Theory channels; Reader's Sigil cosmetic; personal lorebook view; public profile pages; commissioned fan-writer cohort recruitment; Lore Curator hired.

**Contracts deployed.** `ContributionBadge` deploys (Marginalia and Reader's Sigil only; Canon Mark / Pane-Steward / Cross-Pane Conduit code present but functions paused). `LoreToken` STILL not deployed.

**Admin tooling needed.** Margin Note moderation queue; Marginalia tier-upgrade auditor; commissioned-writer contract management; Lore Curator workspace (note-taking and shortlist drafting; no Featured Shelf yet).

**Metrics gating advancement to S3.** 1,000+ active Tier-2 users; Margin Note upvote-to-post ratio above 30%; no major moderation incidents; seed-content corpus of 200–500 staged; 10–20 commissioned fan-writers contracted.

### Series 3 — 2027-04-27 to 2027-10-27 (Months 12–18): LORE Token + Seeded Hub + Warm-up Canon + Pane-Stewards

**Participation features enabled (additional).** LORE token launches at $0.10 reference price; initial holder airdrop (capped at 0.1% per wallet); Contraband Submission interface live with all 5 steps including AI disclosure; Authorship NFT minting per §1.2; Attribution Escrow active for Scribes; Fan-Canon Hub launches with 200–500 honestly-dated seeded entries; Pane sub-Hubs activated; Pane-Stewards appointed; first-time-contributor faucet (100 LORE, three submissions); Featured Shelf with all four promotion mechanisms; Lore Curator scouting; Adversarial Reading Pass operational; wallet-cluster detection operational; Canon Council seated (4 staff + 1 lottery seat; 2 contributor seats reserved for S4; Resident Author seat reserved for S5); warm-up canon promotion (1–3 promotions of seeded fan-writer work); state-machine on-chain events live; Shadow Pane archive enabled.

**Contracts deployed.** `LoreToken`, `AuthorshipNFT`, `SubmissionCurator`, `LoreGovernor`, `ScribeEscrow` all deploy at S3 launch. `PaneRegistry` upgrades from read-only to full Steward-assignment functionality. `ContributionBadge` Canon Mark + Pane-Steward functions activate.

**Admin tooling needed.** Full Council admin app at `admin.lorevault.com`; submission review queue; blind deliberation mode; Pane-Steward first-read views; Adversarial Pass workspace; new-Pane-proposal queue (UI exists, queue activated S4); economic dashboard (LORE emission, burn rate, Stability Reserve, VWAP).

**Metrics gating advancement to S4.** Organic submissions 100+, fail-threshold 25; Hub Tier-0.5 daily-active 1,000+ by month 3, 5,000+ by month 6; cross-references avg 0.5 per organic entry by end of S3; submission rejection rate <10%; Hub-traffic-to-organic-submission ratio above 50:1; Council deliberation rubric stable for 90 days; LORE burn-rate within 20% of emission rate; Adversarial Reading Pass false-positive rate <5% on appeal.

### Series 4 — 2027-10-27 to 2028-04-27 (Months 18–24): Full Canon Promotion + Scribe Council Seat + New-Pane Queue

**Participation features enabled (additional).** First open Canon Council promotion vote (warm-up exception ends); Canon Mark NFTs at scale; royalty streams via Flow's royalty-enforcement primitives; 1 Tier-4 contributor seat elected by NFT-holders; 1 Tier-4 contributor seat elected by qualifying Scribes; full constitutional amendment process; fan-promoted content in Series-card metadata; bug bounty program live; new-Pane proposal queue operational (Council reviews once per cycle, 6-of-8 supermajority for activation); cross-Pane contraband category f live with 2x rewards.

**Contracts deployed.** No new contracts. `LoreGovernor.constitutionalAmendment` activates. `PaneRegistry.activatePane` (the gated 6-of-8 path) activates.

**Admin tooling needed.** Constitutional-amendment workflow UI; election infrastructure for the two contributor seats (NFT-holder and Scribe); new-Pane proposal review tooling; bug-bounty intake UI; royalty-distribution dashboard.

**Metrics gating advancement to S5.** 500+ organic submissions in cycle; Canon Mark count 5–15; cross-reference avg 1.0+ per organic entry; no major capture events; first new-Pane activation (or first deliberate non-activation with Shadow archive evidence justifying the choice).

### Series 5 — 2028-04-27 onward (Months 24+): Resident Author + Retcon

**Participation features enabled (additional).** Resident Author program activates with the Council seat reserved for it; retcon protocol activates (6-of-8 supermajority + 60-day public comment); Pane-promotion cap may be raised to 2 per Series by 5-of-8 vote; Stability Reserve mechanisms have a full year of operating data and any tuning happens via constitutional amendment.

**Contracts deployed.** No new contracts. `LoreGovernor.retconProtocol` activates. Resident Author payroll runs off-chain via the Foundation, with on-chain `ResidentAuthorEngaged(holder, retainerUSD, term)` audit events.

**Admin tooling needed.** Resident Author engagement workflow; retcon protocol UI (with the 60-day public comment thread); long-cycle analytics (year-over-year tier-distribution drift, LORE burn-rate stability, Stability Reserve trigger history).

**Ongoing metrics.** ~1–2 fan-promoted Panes per Series; Canon Mark count grows by 5–15 per cycle; Hub volume continues compounding; Tier-distribution stable within ±5% of 70:18:8:3:0.1–0.5 targets; LORE burn-rate stable; Resident Author cohort grows by 1–2 per year; Stability Reserve triggerings 0–1 per year.

---

## Appendix: Indexer + Off-Chain Service Inventory

For reference; these are not Cadence contracts but are required for the system to function.

- **Cadence event indexer.** Streams every event from the seven contracts into a Postgres mirror. Drives the Hub UI. Latency target: 5 seconds from chain event to indexer-served read.
- **IPFS pinning service.** Pins submission bodies, version snapshots, Council deliberation packets, Foundation-signed export bundles. Operated by the LoreVault Foundation.
- **Adversarial Reading Pass service.** Holds the `TrustAndSafetyCap` capability. Runs the rubric on every State-1 → State-2 transition and on State-4 second-look reviews.
- **VWAP oracle.** Reads the LORE/USD trailing-30-day VWAP from the primary DEX, calls `LoreGovernor.recalibrateQuarter` at quarter boundaries.
- **Cycle-tick scheduler.** Calls `SubmissionCurator.tickTimeouts` hourly and the Series-cycle boundary `cycleRoll` daily.
- **Foundation auth + Scribe service.** Issues `scribeAccountId`s, signs `mintForScribe` transactions, signs graduation attestations.
- **Fiat disbursement integration.** Stripe / PayPal / Wise for Scribe bounties and Resident Author retainers. Audit log on-chain via `ScribeFiatBountyRecorded`.
- **Wallet-cluster detection.** Off-chain heuristic service (graph-analysis on transaction history, submission-content fingerprinting, behavioral correlation). Deterrent layer per V3 §3.8.

---

*End of spec. Engineering review requested before sprint-zero kickoff.*
