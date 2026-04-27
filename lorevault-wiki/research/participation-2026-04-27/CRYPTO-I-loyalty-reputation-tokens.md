# Crypto I: Loyalty + Reputation Tokens (Non-Monetary or Dual)
**Prepared for:** LoreVault Token-Economy + Participation Architecture  
**Date:** 2026-04-27  
**Analyst:** Research Agent I  

---

## Table of Contents

1. [Primitive Overview](#1-primitive-overview)
2. [Mechanism Design](#2-mechanism-design)
3. [Successful Deployments](#3-successful-deployments)
4. [Failed Deployments](#4-failed-deployments)
5. [Anti-Capture Mechanisms](#5-anti-capture-mechanisms)
6. [Onramps for Non-Crypto Users](#6-onramps-for-non-crypto-users)
7. [Composability with NFT Collectibles](#7-composability-with-nft-collectibles)
8. [Recommendations for LoreVault](#8-recommendations-for-lorevault)

---

## 1. Primitive Overview

### What It Is

A **loyalty and reputation token** is a programmable credential that encodes a user's history of engagement, contribution, or collection within a platform — without (necessarily) creating a freely tradeable financial instrument. At the narrowest end, these are familiar: airline frequent-flyer miles, Starbucks Stars, Reddit Karma. At the broadest end, they shade into governance tokens and economic rents. The design space between those poles is where crypto-native product builders have been experimenting since roughly 2020.

The underlying insight, formalized in Vitalik Buterin, E. Glen Weyl, and Puja Ohlhaver's May 2022 paper [Decentralized Society: Finding Web3's Soul](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763), is that NFTs as currently deployed are almost entirely **financial** objects — they encode what you can afford, not who you are. Soulbound Tokens (SBTs), in their framing, are non-transferable credentials that encode accomplishments, affiliations, and reputation. They cannot be bought. They cannot be sold. Their value is in what they unlock or signal, not in secondary-market price discovery.

The design primitive sits on a spectrum:

| Type | Transferable | Financial Value | Primary Purpose |
|---|---|---|---|
| Pure engagement point (off-chain) | No | No | Behavior reward, gate access |
| Soulbound on-chain credential | No | Indirect (access) | Identity, reputation |
| Reputation-weighted NFT | Sometimes | Market price + utility | Collection + status |
| Dual-token (earn + governance) | Yes (earn); sometimes No (gov) | Yes (earn token) | Economy + governance |

### Who Pioneered It

The precursor architecture is Dapper Labs' [NBA Top Shot](https://nbatopshot.com/) Collector Score system, launched May 2021, which was the first large-scale attempt to encode a **collector reputation** on a consumer blockchain product to gate access to scarce drops. It is instructive precisely because it failed in its stated goal (more below).

The non-financial strand was pioneered in public-goods funding contexts: [Gitcoin Passport](https://go.gitcoin.co/passport) (now [Human Passport](https://human.tech)) launched in 2022 as an off-chain credential aggregator to protect quadratic funding from Sybil attacks. [BrightID](https://www.brightid.org/) independently developed social-graph verification around 2018-2019, targeting the same Sybil problem.

In the licensed collectibles context, [Disney Pinnacle](https://disneypinnacle.com/) (launched late 2023 by Dapper Labs on Flow blockchain) represents the current state of the art for mainstream-audience reputation-adjacent systems: engagement through challenges, trivia, and collection-set completion, with the blockchain almost entirely hidden from the user.

### Current State of the Art (2026)

As of April 2026, the dominant pattern is **layered engagement**: a free-to-participate off-chain engagement layer (points, achievements, streaks) sits above an on-chain asset layer (NFTs). Off-chain actions earn off-chain points; enough off-chain engagement unlocks on-chain benefits (exclusive drops, early access, cosmetic upgrades on the NFT itself). The on-chain layer remains the durable asset record; the off-chain layer is the behavioral layer.

The key unresolved tension: systems that make reputation tokens **tradeable** inevitably see them financialized and gamed. Systems that keep them non-tradeable struggle to give holders a reason to care. The 2024-2026 design consensus is: make the points non-tradeable, make what they unlock genuinely desirable but not financially extractable, and ensure passive participation is free of friction.

---

## 2. Mechanism Design

### The Two-Layer Architecture

Nearly all functioning systems separate:

1. **The engagement layer** — tracks behavior (purchases, challenges completed, content submitted, social actions, time-weighted holding). Usually off-chain or cheaply on-chain. Not tradeable. Not sellable.

2. **The asset layer** — the underlying collectible NFTs, which are tradeable and carry market value. The reputation system modulates access to this layer but is not coextensive with it.

The engagement layer feeds into the asset layer through one or more gates:

- **Pack/drop access gates**: high-reputation users get first access to new drops (NBA Top Shot model)
- **Exclusive cosmetic unlocks**: engagement points unlock visual variants on owned NFTs
- **Challenge completion rewards**: completing a set of on-chain actions mints a unique reward NFT
- **Voting/governance weight**: reputation score amplifies governance participation (rare in consumer collectibles, common in DeFi)

### Points Calculation Patterns

**Volume × recency weighting**: Each collectible is assigned a base score, with more recent series worth less (to prevent old-guard lock-in) or more (to reward recent spending). NBA Top Shot's original Collector Score gave Series 1 Commons 25 points each and Series 3 Commons only 2 points — a 12.5x decay. This created a two-tier collector class between those who bought in during 2020-2021 and those who arrived later.

**Spend-based scoring**: NBA Top Shot's replacement Top Shot Score uses a simpler model: purchase price × 10 = points. A $50 Moment gives 500 points. This is transparent but directly equates reputation with spending power, which is the definition of pay-to-play.

**Action-based scoring**: The more sophisticated design. Points accumulate from discrete actions: completing a set, holding a Moment through a challenge period, owning moments from diverse series/teams, completing trivia or social challenges. Disney Pinnacle uses trivia events and set completion to drive engagement, with prizes for winners (themed backgrounds, exclusive pin variants).

**Time-weighted holding**: Emerging pattern as of 2025. veNFT-inspired systems (e.g., Cambria's [Renown](https://gam3s.gg/news/cambria-introduces-renown/)) multiply score by hold duration — the longer you hold, the more reputation you accumulate per asset. This rewards conviction and discourages flip-and-exit behavior. Critical for LoreVault's anti-flip goals.

**Composite identity score**: Gitcoin Passport's Unique Humanity Score aggregates stamps from Twitter, GitHub, ENS, Discord, Proof of Humanity, BrightID, and others. Each stamp carries a weight; the composite score must exceed a threshold (typically 20) to participate in quadratic funding rounds. No single identity provider is sufficient; you must demonstrate humanity across multiple independent domains.

### The Threshold and Gate Structure

Reputation systems typically implement one of three gate patterns:

- **Hard gate**: score must exceed threshold X to participate. Binary. Exclusionary for newcomers.
- **Soft gate / priority queue**: score determines position in queue. Everyone may eventually participate; high scorers go first. Softer but still creates a two-speed system.
- **Multiplier gate**: everyone participates; higher scorers receive better odds, more rewards, or amplified output. The least exclusionary pattern.

For a product like LoreVault — where passive collectors must work day-one — only the **multiplier gate** is acceptable for core access. Hard and soft gates should be reserved exclusively for bonus tiers.

### Anti-Gaming Mechanics at Protocol Level

Protocol-level anti-gaming requires:

1. **Cooling periods**: reputation scores cannot be purchased and immediately redeemed; hold duration is required.
2. **Score floors and ceilings**: a single very large purchase cannot dominate; per-wallet or per-asset caps prevent whale monopolization of the reputation leaderboard.
3. **Diversity requirements**: challenge completion bonuses require owning assets from multiple sets/series, not just volume of a single asset type.
4. **Off-platform identity binding**: cross-referencing wallet against Gitcoin Passport stamps, BrightID verification, or email+phone to limit Sybil farming.

---

## 3. Successful Deployments

### Case Study 1: Disney Pinnacle on Flow (Dapper Labs, 2023–present)

**What it is**: Disney Pinnacle is a digital pin-collecting experience built on the Flow blockchain, operated by Dapper Labs as a licensed Disney product. Launched on iOS in late 2023, it covers characters from Disney, Pixar, and Star Wars. Full details at [dapperlabs.com](https://www.dapperlabs.com/newsroom/dapper-labs-announces-disney-pinnacle).

**Why it matters for LoreVault**: This is architecturally the closest existing product. Multi-IP licensed collectibles, Flow blockchain, Dapper custodial wallet, mainstream consumer audience, explicit design goal to hide the blockchain from casual users.

**Engagement mechanics**: The platform's engagement layer is deliberately light on financialization. The primary loop is: collect pins → complete themed sets → trade with other collectors → participate in trivia events for exclusive cosmetic rewards (pinbook backgrounds, Silver Sparkle and Golden variants of pins). Trading windows are deliberately constrained to certain weekends, reducing secondary-market speculative volume. There is no named "reputation score" — engagement is rewarded through collection completeness and challenge completion, not through an explicit points ledger.

**The Disney+ Perks integration (2025–2026)**: The most significant loyalty design decision. Disney+ subscribers receive one free Open Edition Mystery Capsule per month through at least May 2026, plus $10 in Dapper credit. With Disney+ at approximately 150 million subscribers globally, this is the largest crypto-adjacent loyalty distribution ever attempted. The key design insight: **the engagement reward (a free monthly capsule) is accessible to every subscriber, requires no crypto knowledge, requires no existing collection, and creates no pay-to-play requirement**. It is purely upside.

**Metrics**: Early access generated 480,000 pins sold with $400,000+ in trading volume. The pin-edition structure creates controlled scarcity: Open Edition (170 tokens), Silver Sparkle (95 tokens), Golden (45 tokens), Digital Display (20–25 tokens) — a four-tier rarity within each themed release.

**Architecture lesson**: Off-chain engagement (trivia, set completion tracking) gates on-chain exclusive variants. Users who complete a trivia challenge receive a cosmetically distinct version of an existing pin — not a separate financial instrument. The reward is identity/status, not extracted cash value.

**Non-crypto onramp**: Users pay in USD via credit card, Apple Pay, or Google Pay. Social login via Google or Apple ID. The blockchain is invisible. As [DappRadar noted](https://dappradar.com/blog/disney-pinnacle-all-about-the-new-nft-platform-on-flow), "most users won't even know the blockchain is involved."

**Limitations**: No public on-chain engagement score is visible to users. The engagement layer is largely opaque. No public metrics on what percentage of free-capsule claimers become paying collectors. No user-controlled wallet export (custodial model locks users into Dapper ecosystem).

---

### Case Study 2: Gitcoin Passport / Human Passport (2022–present)

**What it is**: An open-source Sybil-resistance protocol that aggregates off-chain identity stamps into a composite Unique Humanity Score. Full documentation at [Human Passport](https://passport.human.tech/).

**Why it matters**: The most rigorous publicly deployed reputation system that is explicitly non-financial. The score encodes who you are across platforms, not what you can afford.

**The stamp system**: Users collect "stamps" — verifiable credentials from independent identity providers:
- Social: Twitter, Google, Discord, LinkedIn
- Crypto-native: ENS, Ethereum transactions, Gitcoin grants history
- Identity: BrightID, Proof of Humanity, Holonym
- Professional: GitHub, GitPOAP

Each stamp carries a point weight; the aggregate Unique Humanity Score must exceed 20 for "best defense against Sybils and bots" according to the protocol. No single stamp is sufficient — diversity of verification is required. This means a well-resourced attacker would need to compromise a real human's Twitter, GitHub, and ENS simultaneously, making Sybil attacks economically unfeasible at scale.

**Quadratic funding integration**: In Gitcoin Grants rounds, a higher Passport score amplifies the matching weight of your donation. A $1 donation from a high-score wallet moves more matching funds than a $1 donation from an unverified wallet. This rewards genuine community members without creating a financial extraction mechanism — the score unlocks access to public goods funding, not personal profit.

**Scale**: As of the December 2024 rebrand to Human Passport (acquired by [Holonym Foundation](https://thedefiant.io/news/press-releases/holonym-foundation-acquires-gitcoin-passport-to-onboard-its-2m-users-to-create-worlds-largest-proof-of-humanity-solution)), the system had 2.2 million users and 120 partner integrations.

**2025 ML upgrade**: Human Passport added a machine-learning Sybil Detection Model that analyzes wallet behavior in real time, moving beyond purely credential-based scoring to behavioral pattern analysis. This is the state of the art in Sybil resistance.

**Key design principle**: The score has no secondary market. You cannot buy it. You cannot sell it. You can only accumulate it by demonstrating genuine human activity across multiple independent platforms. The value it unlocks (matching weight in public goods funding, access to protocol features) is real but non-extractable.

---

### Case Study 3: Sorare Fantasy Football NFT Rewards (2019–present)

**What it is**: A licensed fantasy football game where users manage teams of real player cards (NFTs) and earn rewards based on real-world match performance. Cards are graded Limited (1,000/player/season), Rare (100), Super Rare (10), and Unique (1). Details at [Sorare.com](https://sorare.com/help/a/22755242807709/what-are-the-different-types-of-cards-what-can-i-do-with-them-common-vs-limited-rare-super-rare-unique).

**Why it matters**: Sorare demonstrates the most sophisticated model of **active engagement rewarded above passive holding**, in a licensed IP framework that directly parallels LoreVault's multi-IP approach.

**Scoring mechanics**: Player cards earn 0–100 points per real-world match, composed of a Decisive Score (goals, assists) and an All-Around Score (passes, possessions). Teams of five are scored weekly; tournament rankings determine prize distribution. The card-scarcity tier affects the points multiplier — Unique cards earn higher point bonuses than Limited cards for the same player performance.

**Active vs. passive design**: Passive holding of a card gives you zero weekly rewards. You must actively select a team lineup every game week. Entry-level tournaments can be played with free Common cards; higher-tier tournaments require Limited/Rare/Super Rare ownership. This creates a natural pay-to-compete-more gradient without a pay-to-exist requirement.

**Revenue and scale**: Sorare raised $680 million in Series B funding at a $4.3 billion valuation in September 2021. Licensed agreements span MLB (2022), NBA/NBPA (2022), Premier League (2023), La Liga, and many others. The 2024-25 season offers more than $15 million in prizes, with three competition tiers (Champion, Challenger, Contender) giving players of all card levels a meaningful track to compete in.

**The free Common card entry**: Every new player can join with free Common cards that are not NFTs and have no secondary market value. This is the "passive collector works day-1" architecture in action — you can experience the full scoring mechanic before committing to an NFT purchase.

**Regulatory risk flag**: In September 2024, the UK Gambling Commission charged Sorare with providing gambling facilities without an operating licence under the [Gambling Act 2005](https://www.gamblingcommission.gov.uk/news/article/consumer-information-notice-sorare-com-prosecution). Sorare pleaded not guilty; trial is set for June 15, 2026 at Birmingham Magistrates' Court. The core dispute: whether cash card-trade rewards based on real-world outcomes constitute gambling. This is the single most important regulatory warning signal for LoreVault — any design that links reputation rewards to real-money prizes based on lore/content outcomes could face the same classification.

---

## 4. Failed Deployments

### Failure Case 1: NBA Top Shot Collector Score and the Price-Reputation Collapse (2021–2022)

**What it was**: NBA Top Shot launched the Collector Score in May 2021 to determine pack-drop eligibility — a reputation system encoding how many Moments a collector held, weighted by Moment rarity and series. Points gates gave high-score collectors priority access to exclusive drops. Full analysis at [The Ringer](https://www.theringer.com/2025/02/26/features/nba-top-shot-crypto-moments-bust-nfl-all-day-dapper-labs).

**The peak**: February 2021 — $47.88 million in daily trading volume; a LeBron James dunk (one of 49 minted) sold for $208,000 on February 23rd. Over $224 million in total monthly sales with 80,000+ unique buyers.

**How the reputation system broke down**:

First, the score was perversely incentivized. The original Collector Score made "100 Common Moments together more valuable than a single Legendary" — rewarding volume of cheap assets over quality holding. Speculators discovered they could game queue access by bulk-buying low-tier Moments rather than collecting authentically.

Second, when demand was high, Dapper Labs flooded supply to reduce queue wait times. When the platform launched in early 2021, there were approximately 13 new Moments per buyer. By November 2023, that ratio was 63-to-1. Supply dilution decimated the financial value of existing holdings, which degraded the reputation of locked-in high-score collectors who had paid real money for assets now worth a fraction.

Third, the reputation-to-finance coupling meant that when market prices collapsed, collector scores translated into locked-in losses. Harrison Barnes' portfolio fell 94% from $412,212 to a ~$25,000 unrealized value. Tyrese Haliburton lost over $56,000 (89% decline). The score had implicitly promised that high-reputation = financial protection; in practice, it locked holders into positions they could not exit without admitting catastrophic loss.

**The Buyback manipulation**: Dapper Labs ran a `NBATopShotBuyback` account that inflated advertised prices, misrepresenting the real secondary market clearing price to new buyers.

**The replacement (Top Shot Score, 2022)**: The successor system calculates score as purchase price × 10, updating daily against a marketplace average sales price. Simpler, but still directly equates reputation with spending. The [SEC investigated Dapper Labs](https://fortune.com/crypto/2024/04/11/sec-dapper-labs-investigation-case-closed-september-2023-roham-gharegozlou/) (case closed September 2023 with no charges), but the regulatory overhang damaged user trust.

**Root cause of failure**: The Collector Score was **dual-purpose but incoherent**. It tried to be both a reputational signal (genuine fan engagement) and a financial gating mechanism (spend more to get more). Those two goals are in tension. When asset prices fell, the "genuine fan" signal became indistinguishable from "bag-holder who paid peak prices." A reputation system that measures financial exposure as a proxy for engagement will always corrupt when prices move.

**Lessons for LoreVault**: (a) Never use asset purchase price as a direct reputation input. (b) Never gate core access behind reputation scores. (c) Time-weight and diversity-weight the score so that buying 100 copies of one cheap asset cannot game drop access the same way building a diverse collection does.

---

### Failure Case 2: Axie Infinity SLP Economy and Scholar Program Collapse (2021–2022)

**What it was**: Axie Infinity built a play-to-earn economy in which Smooth Love Potion (SLP) tokens were earned through gameplay (battles, quests) and spent on breeding new Axie NFTs. At peak, 2.7 million daily active users were earning SLP, with approximately 40% of the player base from the Philippines. The [Scholar program](https://bitpinas.com/learn-how-to-guides/axie-infinity-scholarship-guide-english-version/) was an informal arrangement where asset-rich "managers" rented Axies to asset-poor "scholars" who split earnings, sometimes 75/25 in favor of the manager.

**The SLP death spiral**: SLP peaked near $0.4191 on May 1, 2021. By February 3, 2022, it had collapsed to $0.0094 — a 97.8% decline. The mechanism: SLP had an uncapped supply. Every new player minted new SLP through gameplay. The only SLP sink was breeding new Axies, which required SLP as an input. As player numbers grew, SLP supply grew faster than demand for breeding, driving price toward zero. Sky Mavis (the developer) acknowledged the inflation was "not sustainable" in February 2022 and [slashed SLP emissions](https://www.coindesk.com/tech/2022/02/08/axie-infinity-reduces-slp-emissions-to-prevent-collapse/), but by then the spiral was irreversible.

**The Scholar program as Sybil surface**: The scholarship model was celebrated as a crypto-native UBI for developing economies, but it was structurally a Sybil factory. A single manager could run dozens of "scholar" accounts, each appearing as a distinct user to the protocol. When SLP price collapsed, scholars who had been earning what seemed like $10–55/day were suddenly earning $0.15–1.41/day. Filipino workers who had borrowed money to buy into the ecosystem (entry cost: ~$400+ for three Axies) were left with debt and no income.

**The Ronin Bridge hack (March 23, 2022)**: Hackers (attributed to North Korea's Lazarus Group) exploited the Ronin-Ethereum bridge, stealing 173,600 ETH and 25.5 million USDC — approximately $625 million, the [largest DeFi breach by dollar value](https://www.coindesk.com/tech/2022/03/29/axie-infinitys-ronin-network-suffers-625m-exploit) as of that date. Sky Mavis did not detect the breach for six days. The hack compounded the SLP collapse, destroying trust in the entire ecosystem.

**AXS governance token**: AXS fell 99%+ from its February 2022 all-time high, with the token effectively worthless for many scholarship participants.

**Root causes of failure**:
1. **Unbounded emission without sink**: SLP had unlimited supply and insufficient destruction mechanisms. Every engagement token system must answer: what destroys the token? If the answer is "nothing meaningful," the token price trends toward zero.
2. **Scholarship as Sybil attack**: Delegated play creates fake user counts, inflated engagement metrics, and distributed risk onto the least economically resilient participants.
3. **Financial engagement collapsed when token price collapsed**: When the game was profitable, people played. When it wasn't, they stopped. True engagement is not price-correlated.

**The STEPN parallel (2022)**: STEPN (move-to-earn) replicated the same error. Its GST governance token peaked at $9.03 in April 2022 and collapsed 99% in two months as supply outpaced demand. At peak, daily earnings of 3–4 GST were worth ~$37; by June 2022, the same activity yielded $0.72. Break-even ROI extended from 16 days to 144+ days, destroying the participation incentive.

**Lessons for LoreVault**: (a) Do not create emission tokens tied to engagement without robust destruction mechanisms. (b) The Scholar model — delegated account participation — is a Sybil and extraction attack waiting to happen. (c) When financial upside collapses, so does all engagement built on top of that upside. Design engagement that survives price-neutral conditions.

---

### Failure Case 3: NBA Top Shot's NBATopShotBuyback Price Manipulation

This failure deserves separate treatment because it is a **reputational failure** distinct from the mechanism failure above.

Dapper Labs operated a `NBATopShotBuyback` account that purchased Moments on the secondary market, creating the appearance of price support and liquidity. This inflated the listed sale prices that prospective buyers used to evaluate their purchases. When the buyback program wound down (likely due to financial pressure following the broader crypto winter), prices found their real market level — substantially lower than what the buyback-supported price had suggested.

From a reputation-system standpoint: any mechanism that artificially inflates the apparent value of the assets underpinning a reputation score is doubly harmful. It misleads users about both the financial value of their collection and the authentic demand for the platform. For LoreVault, this means: never use platform-controlled secondary-market purchasing to support prices, and never link reputation scores to asset prices that can be manipulated.

---

## 5. Anti-Capture Mechanisms

The core adversaries in a reputation system for a crypto-collectibles platform are:

| Adversary | Attack Vector | Effect |
|---|---|---|
| **Whale** | Buy massive volume to dominate reputation leaderboard | Locks out authentic small collectors from exclusive drops |
| **Wash trader** | Self-deal to inflate purchase price without actual cost | Inflates score without genuine engagement |
| **Sybil farmer** | Create many wallets, distribute cheap assets across them | Farms score across fake identities |
| **Pay-to-play extractor** | Convert reputation-gated drops into pure financial returns | Turns engagement system into financial speculation instrument |

### Anti-Whale Mechanisms

**Score caps per asset type**: Limit the maximum score contribution from any single asset or from any single set. If holding 500 copies of one Common pin gives the same score as holding 50 copies of 10 different pins, whales lose the ability to monopolize score with bulk same-asset purchases.

**Diversity bonuses**: NBA Top Shot's Series Team Bonus (50% score boost for owning at least one Moment from each player on a team in a series) and Full Team Bonus were examples of this. The design forces breadth of collection rather than depth in a single asset.

**Time-weight decay for new purchases**: A whale purchasing 10,000 items on day one should not immediately dominate the reputation leaderboard. A hold-duration multiplier (e.g., score credited at 25% upon purchase, ramping to 100% after 90 days) blunts wallet-stuffing as a strategy.

**Wallet-level caps**: Hard ceiling on total score contribution per wallet, above which additional purchases add zero reputation. This is blunt but effective.

### Anti-Wash-Trading Mechanisms

NBA Top Shot's Top Shot Score explicitly addresses wash trading: "Wash trading violates the Code of Conduct and risks account freezes, score erasures and off-boarding." It also displays a warning when a purchase exceeds five times the marketplace average sales price, and requires manual review for such transactions.

More robust approaches:

**Same-wallet trading exclusion**: Transactions where buyer and seller wallet addresses are linked (by on-chain graph analysis) are excluded from score calculation.

**Price-agnostic scoring**: If score does not depend on purchase price at all — only on the fact of ownership, diversity, and duration — wash trading provides no score benefit.

**BrightID / Human Passport integration**: Requiring wallet linkage to a verified human identity credential means Sybil farmers cannot generate new wallets to reset score accumulation.

### Anti-Sybil Mechanisms

**Gitcoin Passport / Human Passport**: The stamp model requires a composite score of verified credentials across Twitter, GitHub, ENS, Discord, Proof of Humanity, and BrightID. A threshold score of 20 is recommended. The ML-based Sybil Detection Model (launched 2025) adds behavioral pattern analysis. No single credential is sufficient; an attacker must compromise a real human's entire digital identity footprint.

**BrightID social graph verification**: BrightID uses a web-of-trust model — you are verified by attending in-person or video "connection parties" with existing verified members. The GroupSybilRank and Aura algorithms analyze the social graph for Sybil clusters. Approximately 70,000+ sponsored public verifications as of 2025, integrated with 15 apps including Gitcoin, Aragon, and Giveth. Key limitation: in-person connection requirement creates onboarding friction and limits scale; graph-based detection struggles with small, isolated Sybil clusters.

**Email + phone binding**: Lower-tech but effective for most consumer platforms. Dapper's custodial wallet ties each account to an email and optionally phone number. One-account-per-email creates a soft Sybil barrier.

**Engagement velocity analysis**: Reputation points accrued at implausible velocity (e.g., a wallet completing every challenge within seconds of launch) can be flagged for manual review. Genuine users exhibit variance in engagement timing.

### Anti-Pay-to-Play Mechanisms

The most important mechanism here is **design-level**: never make reputation tokens the gate to core participation. Reputation should be the gate to bonus/upside, never to day-one access. Disney Pinnacle's model is instructive — a free capsule for every Disney+ subscriber is not gated on any existing collection. Sorare's free Common cards allow every new user to experience the full scoring mechanic without purchase.

For LoreVault: the free-tier experience must be meaningfully good. If passive collectors without any engagement score feel like second-class citizens, the system has failed. The reputation layer should feel like finding Easter eggs, not paying a cover charge.

---

## 6. Onramps for Non-Crypto Users

This is the design space where Dapper Labs has done the most sophisticated work, and where LoreVault has the strongest tailwind by building on the same infrastructure.

### The Dapper Custodial Model

Dapper Wallet is a **managed custodial wallet** — the private keys are held by Dapper, not the user. The user experiences the product as an app with a social login. [Accepted payment methods](https://support.meetdapper.com/hc/en-us/articles/360047162273-Accepted-Payment-Methods) include:

- Credit or debit card (Visa, Mastercard)
- Apple Pay
- Google Pay
- PayPal
- Bank wire

Zero cryptocurrency required at any point. The user never sees a seed phrase, a gas fee, or a wallet address. In NBA Top Shot's peak era, millions of mainstream sports fans transacted on a blockchain without knowing it.

The tradeoff: custodial wallets mean the user does not truly control their assets. If Dapper Labs shuts down or denies access, the user cannot unilaterally recover their NFTs to a self-custody wallet. This is the lock-in risk discussed in Section 8.

### Account Creation Friction

Disney Pinnacle and NBA Top Shot allow account creation via:

- Google sign-in
- Apple ID sign-in
- Email + password

No MetaMask. No browser extension. No gas fee. No seed phrase backup required to get started. This matches the UX expectation of a mobile app-store consumer.

### Fiat-Only Operation

For most users on both platforms, USD is the only currency they ever interact with. Purchases are priced in USD; Dapper Credit (the internal balance) is dollar-denominated. The Flow token (FLOW) is used for network transaction fees behind the scenes, invisibly.

This is non-trivially hard to replicate on Ethereum mainnet (gas fees) or many other chains, which is why Flow's architecture — with Dapper Labs as the fee payer for custodial wallets — is genuinely advantageous for LoreVault's target audience.

### Progressive Disclosure Model

The best non-crypto onramp is not hiding the blockchain — it is disclosing it progressively:

1. **Day 1**: User signs up with Google, gets a free pin/collectible, has fun exploring a collection. Zero blockchain language.
2. **Day 30**: User sees that their collection "lives on the Flow blockchain" and they "own" it. Curiosity piqued.
3. **Day 90+**: Power user explores self-custody options, secondary market, Flow wallet export. Optional, never required.

Disney Pinnacle's [Digital Pins 101](https://disneypinnacle.com/blog/trivia-101) documentation explicitly explains the blockchain layer for curious users without front-loading it in the onboarding flow.

### The Disney+ Distribution Model as Template

The Disney+ Perks integration — monthly free capsule for every subscriber — is the most powerful non-crypto onramp ever deployed in this space. It converts an existing subscription relationship into a collectible engagement loop. The user is not being asked to join a crypto platform; they are being offered a bonus from a service they already pay for.

For LoreVault: the equivalent would be integrating with an existing community membership, subscriber base, Patreon, or Kickstarter backer list. Turn existing loyalty relationships into the first-collectible onramp. Do not require anyone to "join a blockchain platform" — require only that they claim what is already theirs.

---

## 7. Composability with NFT Collectibles

Composability in this context means: how does the reputation/loyalty layer **attach to, enhance, or interact with** the underlying NFT collectibles without making the reputation layer itself a tradeable financial instrument?

### Pattern 1: Reputation-Gated Cosmetic Variants

The cleanest composability pattern. Completing a challenge or reaching a reputation threshold unlocks a **cosmetically distinct version** of an existing collectible — a foil variant, a color palette change, an animated frame, an audio enhancement. The underlying NFT is the same asset; the cosmetic layer is the reputation reward. The variant is soulbound (non-transferable), or if transferred, it reverts to the base cosmetic.

Disney Pinnacle uses this: trivia competition winners get exclusive pinbook backgrounds and Silver Sparkle / Golden / Digital Display variant pins. The base pin is tradeable; the variant awarded for engagement is the reputational signal.

### Pattern 2: Challenge-Completion Reward NFTs

Completing a specific set of actions (collect one pin from each Disney Princess, complete a Star Wars set) mints a unique challenge-reward NFT. NBA Top Shot's challenge system worked this way: collect required Moments, submit for the challenge, receive a unique reward Moment as the proof of completion.

This is a hybrid: the reward NFT has market value (it is tradeable), but its provenance is reputational (you can see on-chain that it was earned, not purchased). The distinction between earned and purchased is visible in the token's metadata.

**LoreVault application**: Completing a "Canon Trivia" challenge or submitting an accepted lore contribution could mint a unique "Contributor Badge" NFT that is tradeable but visibly carries the earned provenance. The badge derives value from authenticity (it cannot be bought, only earned) — which is the opposite of the Top Shot model where everything could be bought.

### Pattern 3: On-Chain Metadata Enhancement

NFTs can be designed so that reputation events update the NFT's on-chain metadata. An NFT held continuously for one year gains an "Anniversary" trait. An NFT held by someone who completed 10 challenges gains a "Veteran" trait. These traits are visible in secondary market listings, giving buyers information about the NFT's provenance and the authenticity of the holder.

Flow's resource-oriented Cadence smart contract language handles mutable NFT metadata natively, making this technically straightforward on LoreVault's target chain.

### Pattern 4: Soulbound Companion Tokens

A transferable NFT collectible has a non-transferable soulbound companion token attached to the same wallet. The companion accumulates reputation for that specific collectible — hold duration, challenges completed, community contributions made while holding. When the NFT is sold, the companion token stays with the original holder. The buyer gets the asset; the seller retains the reputation history.

This is the most sophisticated pattern and currently rare in production. It solves the "buy reputation" problem cleanly: the only way to accumulate reputation attached to a specific asset is to hold it and engage. The transferred asset arrives at its new wallet with zero reputation history; the sold NFT does not carry a reputation "bonus" that the buyer is paying for.

### Pattern 5: Composite Score → Pack Access (The NBA Top Shot Model)

This is the pattern to avoid replicating. Using a composite score to gate access to new drops means that any defect in the score calculation is directly financial — it determines who gets to buy a potentially valuable asset at primary market price. Score gaming becomes economically rational because the prize is financial, not cosmetic. The result is an arms race between score-optimization tactics and platform attempts to patch them.

If LoreVault uses reputation to gate drop access at all, it should be:
- **Probabilistic, not deterministic** (higher score = better odds, not guaranteed access)
- **Bounded** (minimum floor for everyone; reputation improves but does not exclude)
- **Non-financial** (the exclusive drop must be a non-financial reward: cosmetic variant, early viewing, contributor credit — not a financial asset available to flip)

### Sorare's Composability Model

Sorare's most relevant lesson is the **free Common card as the composability floor**. Common cards have no NFT status, no secondary market, no financial value — but they participate in the same scoring engine as the Unique cards. A manager using only free Commons sees the same points mechanics, the same competition structure, the same feedback loop. The NFT layer (Limited through Unique) is the upside available to those who choose to invest; it is not the entry ticket.

For LoreVault: the free/Common tier of participation must be meaningfully engaging. Reading lore, rating contributions, completing trivia, submitting annotations — these should all work without any NFT holding. NFT ownership is the upside layer, not the participation gate.

---

## 8. Recommendations for LoreVault

### Design Recommendations

**Rec 1: Two-layer architecture — engagement (off-chain) over assets (on-chain)**

Build an explicit off-chain engagement layer called something thematic (a "Lore Score," "Chronicle Rank," or similar) that tracks behavior independently of wallet holdings. Actions that earn Lore Score:
- Completing reading challenges (verified by on-platform behavior, not self-report)
- Submitting canon contributions that pass community review
- Completing multi-IP crossover trivia or annotation challenges
- Holding a collectible continuously for 30/60/90/365 days (time-weighted)
- Making accepted trades with other collectors (traded, not sold — distinguishes community behavior from exit behavior)

This score is not tradeable, not sellable, and has no secondary market price. It is a behavior record.

**Rec 2: Passive collectors must have full product access on day one**

Zero reputation score = zero disadvantage for accessing the core product. New users can browse, read, collect, and trade the entire LoreVault catalog. Reputation is upside, not entry. Free or low-cost entry-tier collectibles should exist and be genuinely useful/beautiful — not degraded "taster" versions of the real product.

Reference: Disney Pinnacle's free monthly capsule for Disney+ subscribers; Sorare's free Common cards that play in real tournaments.

**Rec 3: Reputation gates should unlock cosmetic/prestige rewards only**

If Lore Score gates anything at all, it must gate:
- Cosmetic variants of owned collectibles (foil frames, animated editions, illustrated backs)
- Early viewing access to new set reveals (not early purchase — just early viewing)
- Contributor credits in canon lore documents ("This entry was verified by [wallet]")
- Exclusive non-tradeable display frames/pinbook-equivalent UI customizations
- Priority placement in queue for limited drops (probabilistic, not deterministic — higher score = better odds, everyone gets a ticket)

Lore Score must **never** gate:
- Access to the base catalog
- Ability to trade on the secondary market
- Ability to read the lore content
- Ability to submit contributions

**Rec 4: Time-weighted holding as the primary reputation signal**

The cleanest signal of genuine engagement vs. financial speculation is hold duration. A wallet that has held a LoreVault collectible for 12 months is nearly certainly not a bot. Build hold-duration into the Lore Score at the asset level: each collectible accumulates "provenance points" for its current holder at a rate that grows over time. This rewards conviction without requiring any additional action from the passive collector.

Implementation: daily or weekly point accrual per held asset, tiered by asset rarity but capped per asset to prevent whale domination. A holder of 500 copies of one Common card should not outscore a holder of 50 cards from 50 different sets.

**Rec 5: Diversity bonuses over volume bonuses**

Score should reward breadth of IP collection (own collectibles from 3 different mythologies = bonus), set completion (own all members of a pantheon = bonus), and series diversity (own from at least 3 different LoreVault series = bonus). This rewards authentic multi-IP literary engagement — which is the product identity — over financial accumulation of a single popular asset.

**Rec 6: Identity binding with minimal friction**

Require wallet linkage to a human identity signal early in the onboarding flow, but make it lightweight:
- Email + phone number (soft Sybil barrier, Dapper already does this)
- Optional: Gitcoin/Human Passport stamp integration for users who want enhanced privileges (e.g., governance participation, contributor voting)
- Do not require BrightID (in-person connection parties are too high friction for a mainstream literary audience)

**Rec 7: Make the blockchain layer visible but optional**

Follow Disney Pinnacle's progressive disclosure model. Day-1 UX: it's a beautiful collectible literary platform. Day-30 nudge: "Did you know your collection lives permanently on the Flow blockchain?" Day-90+ option: "Ready to take self-custody?" The blockchain is a feature, not a requirement.

**Rec 8: Cadence-native mutable metadata for provenance tracking**

Use Flow/Cadence's resource model to encode provenance metadata directly on each collectible. Each NFT should carry on-chain: date of first mint, original holder, hold-duration tracker, list of challenges completed while held by current wallet. This metadata survives transfer — the buyer can see the full provenance history — but the reputation score itself stays with the original wallet, not with the token. Buyers buy the art and the lore; they do not buy accumulated reputation.

**Rec 9: Contributor reputation as a distinct credential layer**

For lore submissions, annotation, and creative contributions: mint non-transferable contributor credentials (soulbound NFTs in Cadence) for accepted work. These are visible on the contributor's public profile, carry no financial value, and cannot be bought. They are the "GitHub commit history" of the LoreVault literary community. Contributors who accumulate contributor credentials could be eligible for canon governance participation — the right to vote on lore disputes, flag inaccurate submissions, or propose canonical expansions.

This directly addresses the "genuine creative contribution" goal without creating a financial instrument.

**Rec 10: Model the destruction mechanism before launching any point system**

If any LoreVault reputation point has any conversion path to financial value — even indirectly — establish the destruction mechanism first. What removes points from circulation? Options: spending points to unlock cosmetic upgrades (consume and destroy), time-decay (points expire after 12 months of inactivity), or challenge-entry fees (burn points to enter competitions for non-financial prizes). Without a functioning sink, any finite-supply engagement point trends toward either inflation or hoarding. Design the sink first, the emission second.

---

### Anti-Recommendations (What Not to Do)

**Anti-rec 1: Do not use purchase price as a reputation input**

NBA Top Shot's Top Shot Score (purchase price × 10) directly equates wealth with reputation. This is the definition of pay-to-play. LoreVault's reputation system must be blind to purchase price. Score what people do with their collection (engage, hold, complete, contribute), not what they paid for it.

**Anti-rec 2: Do not create a scholar / delegation model**

Axie Infinity's scholarship model was a Sybil factory and a mechanism for distributing downside risk onto the least economically resilient participants. If LoreVault introduces any mechanism where one wallet's engagement earns reputation for another wallet, it creates an immediate Sybil surface and a potential exploitation vector. Reputation must accrue only to the wallet doing the engaging.

**Anti-rec 3: Do not create emission tokens tied to engagement without a robust destruction mechanism**

SLP, GST, and every play-to-earn engagement token that failed shared one trait: uncapped emission with insufficient destruction. If LoreVault contemplates any form of earnable in-platform currency (for cosmetic purchases, challenge entries, etc.), it must be: (a) non-tradeable on external markets, (b) scoped entirely within the platform, and (c) backed by a meaningful destruction mechanism that absorbs supply faster than it is emitted at scale.

**Anti-rec 4: Do not hard-gate any primary-market drop access behind reputation score**

Reputation score as the only path to accessing a new drop is a pay-to-play tax by another name — because reputation is accumulated through holding assets (which requires purchase). A probabilistic advantage for high-reputation collectors is acceptable; a hard gate is not. Every LoreVault user should have some meaningful nonzero probability of accessing every standard drop.

**Anti-rec 5: Do not use reputation score to gate reading or browsing the lore**

The literary content is the product. Gating it behind reputation — or behind any collectible holding — would be a catastrophic UX error for a literary platform. The lore should be freely readable. Owning a collectible is a way of participating in and supporting the lore; it is not the price of admission to reading it.

**Anti-rec 6: Do not link reputation to real-money prizes based on lore/content outcomes**

The Sorare UKGC prosecution is the clearest regulatory warning signal: when cash prizes depend on real-world outcomes and users have financial skin in the game through card purchases, regulators may classify the product as gambling. LoreVault's creative/literary context gives it more distance from this risk than fantasy sports, but any design where: (a) users pay to participate, (b) outcomes depend on external events (e.g., which fictional franchise becomes canon), and (c) cash prizes are awarded — should be reviewed by gambling law counsel before launch.

**Anti-rec 7: Do not run a platform-controlled secondary market buyback program**

NBA Top Shot's `NBATopShotBuyback` account manipulated secondary market prices and damaged long-term user trust when it wound down. If LoreVault needs to support secondary market liquidity, do so through transparent mechanisms (liquidity pools, disclosed market-making agreements) — never through a hidden company account that creates a false price floor.

**Anti-rec 8: Do not build an exit-hostile custody model without warning users**

The Dapper custodial model is excellent for onboarding but hostile to long-term user sovereignty. Users should be clearly informed that their assets live in a custodial wallet, what self-custody options exist, and what happens to their assets if the platform shuts down. Providing a self-custody export path — even if most users never use it — is an ethical requirement for a product promising digital ownership.

---

## Summary of Key Sources

- [NBA Top Shot Blog: Collector Score introduction](https://blog.nbatopshot.com/posts/collector-score)
- [NBA Top Shot Blog: Top Shot Score replacing Collector Score](https://blog.nbatopshot.com/posts/introducing-top-shot-score)
- [The Ringer: Rise and Fall of NBA Top Shot (February 2025)](https://www.theringer.com/2025/02/26/features/nba-top-shot-crypto-moments-bust-nfl-all-day-dapper-labs)
- [Dapper Labs: Disney Pinnacle announcement](https://www.dapperlabs.com/newsroom/dapper-labs-announces-disney-pinnacle)
- [Disney Pinnacle: Digital Pins 101](https://disneypinnacle.com/blog/trivia-101)
- [Disney Pinnacle: Disney+ Perks](https://promo.disneypinnacle.com/disney-plus-perks)
- [BlockchainGamerBiz: Disney Pinnacle + Disney+ loyalty integration](https://www.blockchaingamer.biz/news/38955/disney-loyalty-program-combines-dapper-labs-disney-pinnacle-nft-collectibles/)
- [Coindesk: Axie Infinity Ronin Network $625M exploit](https://www.coindesk.com/tech/2022/03/29/axie-infinitys-ronin-network-suffers-625m-exploit)
- [Coindesk: Axie Infinity SLP emission reduction](https://www.coindesk.com/tech/2022/02/08/axie-infinity-reduces-slp-emissions-to-prevent-collapse)
- [Time: Filipino gamers and Axie debt](https://time.com/6199385/axie-infinity-crypto-game-philippines-debt/)
- [Sorare Wikipedia](https://en.wikipedia.org/wiki/Sorare)
- [Sorare: Card types explained](https://sorare.com/help/a/22755242807709/what-are-the-different-types-of-cards-what-can-i-do-with-them-common-vs-limited-rare-super-rare-unique)
- [UK Gambling Commission: Sorare prosecution](https://www.gamblingcommission.gov.uk/news/article/consumer-information-notice-sorare-com-prosecution)
- [SBCNews: Sorare pleads not guilty](https://sbcnews.co.uk/sportsbook/2024/10/04/sorare-pleads-not-guilty-in-ukgc-illegal-gambling-case/)
- [Human Passport (formerly Gitcoin Passport)](https://passport.human.tech/)
- [Holonym acquires Gitcoin Passport](https://thedefiant.io/news/press-releases/holonym-foundation-acquires-gitcoin-passport-to-onboard-its-2m-users-to-create-worlds-largest-proof-of-humanity-solution)
- [Gitcoin Passport: Sybil resistance in quadratic funding 2024](https://gitcoin.co/research/quadratic-funding-sybil-resistance)
- [BrightID](https://www.brightid.org/)
- [Vitalik Buterin et al: Decentralized Society (SBT paper)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763)
- [CryptoSlate: STEPN GST token collapse](https://cryptoslate.com/is-move-to-earn-dead-stepns-gst-token-tumbles-98-in-2-months/)
- [Dapper accepted payment methods](https://support.meetdapper.com/hc/en-us/articles/360047162273-Accepted-Payment-Methods)
- [DappRadar: Disney Pinnacle overview](https://dappradar.com/blog/disney-pinnacle-all-about-the-new-nft-platform-on-flow)
- [Cambria Renown: veNFT-inspired reputation](https://gam3s.gg/news/cambria-introduces-renown/)
- [Fortune: SEC investigation into Dapper Labs](https://fortune.com/crypto/2024/04/11/sec-dapper-labs-investigation-case-closed-september-2023-roham-gharegozlou/)
- [Clutchpoints: LeBron James $208K NBA Top Shot sale](https://clutchpoints.com/lakers-news-epic-lebron-james-nba-top-shot-sells-for-record-breaking-208000)
