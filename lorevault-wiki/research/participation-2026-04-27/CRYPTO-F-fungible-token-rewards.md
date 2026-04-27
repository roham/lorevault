# Crypto F: Fungible Token Reward Systems
**Prepared for:** LoreVault Token-Economy + Participation Architecture  
**Date:** 2026-04-27  
**Analyst:** Research Agent F  

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

A fungible token reward system is a protocol layer that mints or distributes a homogeneous, interchangeable digital asset in response to user behaviors. Unlike NFTs, which are unique, each unit of a fungible reward token is identical to every other unit. This homogeneity is the feature, not a bug: it makes reward tokens liquid, priceable, and composable with DeFi rails.

The core design question is always the same: *what behavior does minting reward?* The answer bifurcates the entire design space.

- **Contribution-mining** rewards acts of creation — writing, curating, publishing, world-building. The minter's output must exist before the reward is triggered.
- **Gameplay-mining** (sometimes called engagement-mining) rewards interactions — collecting, voting, attending, completing challenges. The reward triggers on a verified action, whether or not the action produces anything.
- **Attention-mining** rewards verified viewing — the user's eyeball-time on content is monetized and a fraction redistributed. No output required; presence is the signal.

These are not morally distinct categories; they are mechanically distinct with radically different Sybil surfaces and quality-signal fidelity.

### Who Pioneered This

The intellectual lineage runs through several threads:

- **Steemit (2016)** — Daniel Larimer and Ned Scott built the first large-scale contribution-mining system on a purpose-built Delegated Proof-of-Stake chain. STEEM tokens were minted into a "reward pool" and distributed to authors and curators based on stake-weighted upvotes. At peak in early 2018, STEEM's market cap exceeded $1.7 billion.
- **Basic Attention Token / Brave (2017)** — Brendan Eich launched the first attention-mining primitive with BAT, an ERC-20 token on Ethereum. Brave browser intercepted ad revenue and routed 70% back to users as BAT. The concept of "verified attention" as a mintable event was new.
- **Reddit Community Points (2020)** — Reddit operationalized contribution-mining at social-media scale, using existing Karma as the mining signal and Ethereum (later Arbitrum Nova) as the settlement layer. This was the first experiment to answer whether a top-20 internet property could bolt a token layer onto an existing community without requiring crypto knowledge.
- **Mirror.xyz WRITE (2021)** — the first scarcity-gated *access* token, where the token was not a reward but a key to publish. This inverted the model: you don't earn tokens by contributing; you burn tokens to gain contributor status.

### Current State of the Art (2026)

By April 2026, the primitive has matured through several generations:

1. **First-gen (2016–2019):** raw stake-weighted minting, catastrophically gameable (Steemit vote-buying bots).
2. **Second-gen (2020–2022):** platform-mediated distribution with off-chain contribution signals (Reddit Karma → on-chain MOON), reducing Sybil surface but creating platform dependency.
3. **Third-gen (2023–2024):** composable social-token ecosystems with on-chain social graphs (Lens Protocol, Farcaster/DEGEN), where the contribution signal itself is on-chain — a post is an NFT, a collect is a transaction.
4. **Fourth-gen (emerging 2025–2026):** account-abstraction-native systems with embedded wallets, gasless transactions, and fiat on-ramps baked in, making the token layer invisible to non-crypto users while remaining fully composable to crypto-native participants.

The core unsolved problem remains: **no system has simultaneously achieved quality-signal fidelity, Sybil resistance, and mainstream adoption.** The systems that get mainstream adoption abstract away the token (losing composability). The systems that preserve composability remain crypto-native niches.

---

## 2. Mechanism Design

### The Reward Pool Model (Steemit/Hive)

The foundational architecture: a fixed daily or per-block quantity of new tokens is issued into a "reward pool." Participants compete to earn shares of the pool through voting. Votes are weighted by *stake* (how many tokens a voter has locked up as Hive Power or equivalent). The author of a post earns 50% of its vote-accumulated value; curators split the other 50% proportionally to their voting weight and timing.

The key insight is that this is a **zero-sum competition** within the reward pool. More tokens going to one post means fewer for others. This creates genuine curation incentive — a large stakeholder who correctly identifies high-value content early earns more than one who votes late or votes for low-value content.

The key failure mode: large stakeholders can self-vote or form vote-buying cartels to capture disproportionate pool shares without creating any value. Hive addressed this with downvote mechanisms and community moderation, but the fundamental asymmetry between large and small stakeholders was never resolved.

### The Karma-Proxy Model (Reddit Community Points)

Reddit's design avoided on-chain governance entirely by using existing, off-chain Karma as the distribution signal. Each month (the "distribution round"), Reddit computed each user's net Karma contribution in a subreddit over the period. Tokens (MOON, BRICK, DONUT) were minted proportionally and deposited into users' Vault wallets.

This produces a **cleaner quality signal** because Karma accrual is itself a community-voted process that predates the token. Gaming Karma is harder than gaming on-chain votes because Reddit's Karma system has its own spam filters, vote manipulation detection, and a large human moderator layer.

The failure mode was structural, not mechanical: the entire reward system was contingent on Reddit Inc.'s willingness to run the distribution oracle. When Reddit discontinued the program in October 2023 citing scalability and regulatory burden, every token became worthless as a participation reward, even though the tokens themselves continued to trade on DEXs.

### The Access-Token Model (Mirror.xyz WRITE)

Mirror inverted the reward model entirely. The WRITE token was not earned by contributing — it was *burned* to publish. Access to the platform required holding and burning WRITE. New WRITE tokens were auctioned weekly (the WRITE Race) — community members voted on who should receive one of the ten weekly slots. Voting power was proportional to WRITE holdings (1 WRITE = 1,000 points per vote).

This model creates **scarcity of contributor status**, not scarcity of reward. It shifts the token's function from incentive to identity. The failure mode is plutocracy: voting power tracks token holdings, which tracks who got in early or who has money. Mirror quietly removed the WRITE requirement in October 2021 when they opened the platform to all Ethereum wallet holders — a tacit acknowledgment that access-gating via token had not produced the quality curation the model promised.

### The Daily Allowance Tip Model (Farcaster/DEGEN)

DEGEN operates on a different axis. Users receive a *daily allowance* of DEGEN tip-credits (not actual tokens, initially) based on their ratio of reactions received to casts made — a proxy for average post quality. They spend allowances by replying with a number and "$DEGEN" to any cast. The system tracks these and distributes actual DEGEN tokens to recipients in periodic batches.

The allowance mechanism creates a **soft Sybil barrier**: you can only tip as much as your engagement score permits, and engagement scores require genuine social graph participation. New accounts have tiny allowances. Bot farms distributing tips to each other would need to build genuine follower graphs first, which has real opportunity cost.

The failure mode is allowance-farming: users optimize posts for maximum reaction count rather than quality. The DEGEN ecosystem observed a wave of low-effort "engagement bait" posts after the system became widely known.

### The Bonding Curve Model (Friend.tech)

Friend.tech used a quadratic bonding curve on *access keys* to individual creators. Each key was a fungible token (in the set of keys for that creator). Price on the curve was $P = k \cdot S^2$ where S is the outstanding supply. Buying keys increased price for all subsequent buyers; selling decreased it.

The mechanism design insight: **the creator's social capital is made liquid and priceable in real-time.** Early fans of a creator who becomes popular realize genuine financial gains. This is a powerful attention-to-capital conversion primitive.

The failure mode was also the feature: every social relationship became a financial speculation. Users weren't joining communities — they were trading positions. When speculation cooled, the speculative premium collapsed and the community evaporated with it.

### The Attention-Mining Model (BAT)

Brave's BAT system works at the browser level. Brave replaces third-party ad tracking with local ad matching. Users opt into Brave Ads (0–10 per hour, user-controlled). Advertisers pay in BAT. Brave retains 30%; 70% flows to the user's Rewards wallet in BAT. Publishers can register as verified creators and receive BAT when users tip them or set up automatic monthly contribution splits.

The mechanism is clean from an advertising-economics perspective. The failure mode for LoreVault's purposes: **attention to ads is not the same as attention to content.** The signal being mined is "user viewed an ad," not "user engaged with community content." BAT rewards are decoupled from quality contribution entirely. A BAT-rich user is an engaged Brave user, not a valuable community participant.

---

## 3. Successful Deployments

### 3.1 Hive Blockchain — Contribution-Mining at Protocol Level

**Background:** When the Steem community forked away from Justin Sun's hostile takeover in March 2020, they created Hive — a clean-slate deployment of the same architecture without the Steemit Inc. pre-mine that had enabled the takeover. All STEEM holders received equivalent HIVE, except Steemit Inc. wallets (approximately 20% of supply), which were excluded by community consensus.

**Mechanics:** Hive mints new tokens on schedule, distributed as: 65% to content producers and curators (split 50/50 between authors and curators); 15% to Hive Power stakers; 10% to witnesses (block producers); 10% to the Decentralized Hive Fund (DHF) for ecosystem grants. Curation windows run 7 days. Each post's rewards are finalized at the end of its window based on accumulated stake-weighted votes.

**What worked:** The fork itself was a successful demonstration of community sovereignty over plutocratic capture. By excluding the hostile actor's stake at the protocol level, the community established that governance legitimacy is rooted in *earned* stake, not purchased stake. Hive also pioneered RC (Resource Credits) as a Sybil barrier — every action costs RC, which are tied to staked HIVE. This made spam attacks expensive.

**Metrics:** By 2022, Hive hosted over 1,500 daily active applications across gaming, blogging, and social. The DHF has distributed millions of dollars in development grants through on-chain governance. The ecosystem sustained itself through the 2022 bear market (HIVE dropped 82.79% from $1.51 to $0.26) without collapsing — a meaningful stress test that the speculation-dependent models failed catastrophically.

**Lesson for LoreVault:** Protocol-level isolation of malicious stake (the "Hive exclusion" principle) is a replicable governance mechanism. When a bad actor acquires dominant stake, a fork that excludes their position is a community-executable nuclear option. This has relevance for how LoreVault should think about concentration limits.

Sources: [Steem Community Hard Fork Launches Hive Network](https://cointelegraph.com/news/steem-community-resists-takeover-hard-fork-launches-hive-network), [Hive Whitepaper](https://hive.io/whitepaper.pdf)

### 3.2 Farcaster / DEGEN — Third-Generation Social Token

**Background:** DEGEN launched in January 2024 as an ERC-20 on Base, airdropped to the Degen channel community on Farcaster — a group of crypto-native builders and early Warpcast users. The token was not a product of a corporate decision; it emerged from the community itself and was retroactively adopted as an ecosystem currency.

**Mechanics:** Users receive daily DEGEN tip allowances sized by their reaction-to-cast ratio (a quality proxy). They tip by typing amounts in replies. The system aggregates tips and delivers actual DEGEN to recipients. Frames — Farcaster's mini-app protocol — created interactive participation loops that earned DEGEN, from mini-games to quizzes to creative challenges. This made participation *playful and varied* rather than narrowly defined.

**Metrics:** DEGEN reached an all-time high of approximately $0.065 on March 31, 2024 at peak Farcaster growth. Farcaster itself reached over 48,000 daily unique users in early 2024. Under the DEGEN tip economy, over 16,000 unique tippers were active against roughly 44,000 daily unique casters — a tip-participation rate of ~36%, exceptionally high for any token economy. The Farcaster ecosystem grew from roughly 20,000 weekly active users in early 2023 to over 100,000 by mid-2024.

**What worked:** The allowance-based tipping created a genuine **peer-to-peer quality signal**. Good content attracted more tips from more wallets; spam attracted none. The Frames integration meant participation tokens (DEGEN) had a natural discovery mechanic — you encountered tippable moments while using the platform normally. The token was not a gate or a tax; it was a bonus for good behavior.

**Lesson for LoreVault:** The daily allowance model maps well onto a literary community. A "lore contributor allowance" sized by recent engagement quality creates a Sybil-resistant tip surface without requiring admin intervention. Frames-equivalent mini-app loops (lore quizzes, map interactions, character challenge completions) create varied entry points for earning participation credit.

Sources: [Degen Token on Farcaster — Matcha Blog](https://blog.matcha.xyz/article/degen-token-on-farcaster), [Farcaster DEGEN Airdrop Guide — Decrypt](https://decrypt.co/215921/farcaster-degen-meme-coin-airdrop-how-farm)

### 3.3 Lens Protocol — On-Chain Social Graph with Composable Collect Mechanic

**Background:** Lens Protocol, launched by Aave's team in 2022 on Polygon, embedded the social graph itself into NFTs. A Lens Profile is an NFT. A Follow is a token action. A Post is a struct that can be collected — the collect mechanic mints an NFT for the collector and can trigger payment to the creator.

**What worked:** The collect mechanic created a **contribution signal that is also a market action.** When a collector pays to collect a post, they are simultaneously (a) signaling quality, (b) compensating the creator, and (c) creating a tradeable asset. This three-in-one action is uniquely powerful: it doesn't require a separate voting or tipping step. The Lens V2 upgrade (November 2023) added tipping on "smart posts" and multisig-managed profiles, expanding governance surface.

**Metrics:** In Lens Protocol's first year, the platform recorded over 3.8 million collects, with $342,897 in total earnings from paid collects (5.7% of total collects were paid). By August 2024, Lens had over 500,000 users and 22,000+ daily active users. By early 2026, the protocol counted 650,000 total accounts and 45,000 weekly active users. The BONSAI token, built by MadFi on Lens in March 2024 using a novel DN-404 architecture (every 100,000 BONSAI = 1 BONSAI NFT), reached a $100 million valuation and raised $1M in ecosystem funding — demonstrating that community tokens built on top of social graphs can develop real capitalization.

**Lesson for LoreVault:** The collect mechanic is the right primitive for a literary-collectible product. A LoreVault story entry or world-building artifact that can be "collected" simultaneously rewards the creator, signals community quality, and creates an asset the collector owns. Lens demonstrates that when the NFT *is* the social action, you get composability for free.

Sources: [State of Lens Protocol 2023 Annual Report — Milk Road](https://milkroad.com/daily/state-of-lens-protocol-2023-annual-onchain-report/), [BONSAI Token Raises $1M — Crypto Times](https://www.cryptotimes.io/2024/04/06/bonsai-token-raises-1m-targets-lens-protocol-integration/), [Lens Protocol V2 Launch — CoinDesk](https://www.coindesk.com/tech/2023/11/13/lens-aaves-decentralized-social-media-platform-launches-major-upgrade-on-polygon)

---

## 4. Failed Deployments

### 4.1 Reddit Community Points — Platform Dependency as Single Point of Failure

**Background:** Reddit launched Community Points in 2020, beginning with MOON (r/CryptoCurrency) and BRICK (r/FortNiteBR), with DONUT (r/ethtrader) running as an independent predecessor since 2019. Points were earned monthly based on Karma contributions. Users managed tokens through the Vault feature in the Reddit mobile app. The program migrated from Ethereum to Arbitrum Nova in August 2022 to reduce gas costs.

**The Donut Precedent:** r/EthTrader's DONUT experiment revealed the governance-capture failure mode early. DONUTs were used for weighted voting on community governance decisions. However, anyone could simply buy DONUTs on the open market and acquire voting power without any contribution history. The bridge was closed after this vulnerability was confirmed — but the lesson was not absorbed by the broader program design.

**The Shutdown:** On October 17, 2023, Reddit announced it would wind down the entire Community Points program, citing three factors: (1) "no path to scale" the system broadly across the platform; (2) regulatory environment making the legal burden too high; (3) resourcing cost unjustifiable relative to the opportunity. The announcement came without warning to token holders. MOON dropped 85% within hours. BRICK dropped 67%. Reddit moderators were reportedly informed one hour before the public announcement, and several were later removed on suspicion of selling MOON in that window — effectively insider trading on a protocol shutdown.

**What this reveals:** The fundamental design flaw of Reddit Community Points was that every token's value derived entirely from Reddit Inc.'s continued willingness to run the distribution oracle. The tokens were ERC-20 on a public chain — they couldn't be *deleted*. But their utility as rewards was 100% platform-controlled. This is the classic **platform-dependent token trap**: the token is decentralized at the asset layer but centralized at the reward layer. Users holding MOON were holding a wager on Reddit's corporate strategy, not a stake in a protocol.

A secondary failure: Reddit distributed tokens via Karma scores computed entirely by Reddit's algorithms, which Reddit could modify unilaterally. The contribution signal was therefore not just platform-dependent — it was a black box.

**Lesson for LoreVault:** Any reward distribution oracle that runs on a company server is a liability. LoreVault must either (a) put the contribution signal on-chain (so it can be verified independently), or (b) make the token useful for things beyond platform participation, so a platform decision doesn't zero out token holder value. The Reddit shutdown is the clearest possible demonstration of why "we'll add blockchain to our existing product" is not a web3 product.

Sources: [Reddit Kills Community Points — TechCrunch](https://techcrunch.com/2023/10/17/reddit-is-phasing-out-community-points-blockchain-rewards/), [Reddit Shuts Down Unscalable Community Points — CoinGeek](https://coingeek.com/reddit-shuts-down-unscalable-blockchain-based-community-points/), [Reddit Mods Removed for Insider Trading — CryptoSlate](https://cryptoslate.com/reddit-mods-removed-for-suspicion-of-insider-trading-during-moons-shutdown/)

### 4.2 Steemit — Stake-Weighted Voting Creates Capture-by-Design

**Background:** Steemit launched in 2016 as the first contribution-mining social network at scale. STEEM was earned by authors (posting) and curators (voting). Voting power was proportional to "Steem Power" (staked STEEM). The design intended for large stakeholders to be sophisticated curators who surface quality content.

**What actually happened:** By 2017–2018, three distinct exploits dominated the system. First, **self-voting**: large accounts simply upvoted their own posts at maximum weight, extracting a disproportionate share of the reward pool without creating any value. After Hard Fork 19 increased self-vote rewards, this became the dominant extractive strategy. Second, **vote-buying bots**: services like @randowhale, @booster, and WhaleShares allowed anyone to pay STEEM to receive algorithmic upvotes from large accounts. The return was roughly 1:1 — you spent STEEM, got slightly more STEEM in author rewards — making it economically rational for any poster to use the bots rather than rely on organic curation. Third, **automated curation trails**: large accounts programmatically copied the votes of other large accounts, creating curation cartels where voting power clustered without individual judgment.

The result: Steemit's trending feed became a pay-to-play list. Organic quality content was systematically outcompeted by well-funded vote-bought posts. The community's attempt to fight back — using downvotes to reduce inflated posts — was socially costly and widely resisted.

**The Takeover:** In February 2020, Justin Sun purchased Steemit Inc., inheriting control of a roughly 20% pre-mine (the "Steemit ninja-mined stake" from launch). When community witnesses soft-forked to limit Sun's influence, Sun coordinated with Binance, Huobi, and Poloniex to mobilize 42 million STEEM held as customer deposits to vote in replacement witnesses — a direct attack using exchange custody assets as governance weapons. This was the first major hostile takeover of a live blockchain governance system. The community forked to create Hive by March 20, 2020, excluding Steemit wallets from the new chain.

**Lesson for LoreVault:** Stake-weighted voting without strong downvote mechanics and concentration limits creates capture-by-default. The Steemit failure is specifically about allowing *purchase* of curation power. If LoreVault uses any stake-weighted mechanism, it must (a) have concentration caps, (b) give equivalent downvote power to smaller stakeholders (flat downvote, weighted upvote), and (c) never allow exchange-custodied tokens to participate in governance.

Sources: [Steem Versus Hive: Testing Blockchain Governance — Harvard Business School](https://www.hbs.edu/faculty/Pages/item.aspx?num=61580), [Steem Hard Forks Over Justin Sun Power Grab — CoinDesk](https://www.coindesk.com/markets/2020/03/20/steem-hard-forks-today-over-fears-of-justin-sun-power-grab/)

### 4.3 Friend.tech — When Social Capital Becomes Pure Speculation

**Background:** Friend.tech launched on Base on August 10, 2023. Users bought "keys" (initially called "shares") in specific creators using a quadratic bonding curve. Holding a key granted access to the creator's private chat room. All trading occurred on-chain with a 5% fee split: 2.5% to the protocol, 2.5% to the creator.

**Launch metrics:** Explosive. In 12 days: ~100,000 users, 36,300 ETH (~$62.2M) inflows, over 1 million transactions. By October 2, 2023, TVL peaked at $52 million. Daily fees exceeded $1 million in September 2023.

**The collapse:** The bonding curve meant prices rose with each buy and fell with each sell. As user acquisition slowed in late September 2023, early buyers began selling, triggering price falls that triggered more selling. TVL fell from $52M to $4.5M (91% decline) by November 2023. Daily active users dropped to fewer than 100 by mid-2024. Annual fee revenue went from $180M annualized in fall 2023 to $60,000 annualized by 2024 — a 99.97% decline.

**The v2 disaster:** In May 2024, Friend.tech launched v2 with the FRIEND governance token. The launch was marked by: technical failures in airdrop claiming; the FRIEND token crashing from $169 to below $2 within hours (98% collapse); user interface bugs preventing access to the new "Clubs" feature. By September 2024, the team transferred admin rights to a null address, effectively abandoning the protocol. Creators had walked off with approximately $44 million in protocol fees during the active period.

**What broke and why:** Friend.tech conflated **social community membership** with **financial speculation** in the same primitive. The bonding curve made every social relationship a trading position. Users were not building communities — they were flipping access tokens. When the speculation cycle ended, there was no residual community value, because the community had never been built in the first place. The chat rooms that keys unlocked were nearly empty even at peak — the product's real activity was trading keys, not engaging in the chats behind them.

**Lesson for LoreVault:** Binding participation tokens to bonding curves on individual creators is a category error for a community-building product. The financial incentive will always dominate the social incentive, and when speculation ends, the community has nothing. Contribution rewards must be decoupled from secondary-market price speculation. The reward for contributing should be non-speculative value: access, reputation, governance weight — not a financial position that collapses when speculation cools.

Sources: [The Rise and Fall of FriendTech — CryptoPragmatist](https://cryptopragmatist.com/p/rise-fall-friendtech-cautionary-tale-web3-developers), [Friend.tech Creators Walk Off with $44M — DL News](https://www.dlnews.com/articles/defi/friend-tech-shuts-down-after-revenue-and-users-plummet/), [Friend.tech Token Crash 98% — Bloomberg](https://www.bloomberg.com/news/articles/2024-05-03/crypto-s-social-media-friend-tech-saw-token-value-crashed-98)

---

## 5. Anti-Capture Mechanisms

### The Threat Surface

Four attack vectors are common across fungible token reward systems, each requiring a distinct defense:

1. **Whale capture** — a small number of large token holders dominate reward distribution and governance, crowding out small participants.
2. **Wash trading** — an actor trades between their own wallets to generate fake volume, game leaderboards, or inflate on-chain activity metrics.
3. **Sybil attack** — an actor creates multiple fake identities (wallets, accounts) to claim disproportionate airdrop shares or voting power.
4. **Pay-to-play degradation** — financial resources, rather than contribution quality, become the dominant factor in who earns rewards.

### Defense Mechanisms

**Resource Credits / Action Pricing (Hive model)**

Every on-chain action costs Resource Credits (RC), which are non-transferable and tied to staked HIVE. New accounts start with minimal RC. This creates a real cost to Sybil attacks: each fake identity must acquire, stake, and burn HIVE-equivalent value to perform any actions. At scale, a Sybil farm trying to game the reward pool would need to stake more HIVE than the expected reward — breaking the economic rationality of the attack.

**Allowance-Based Tipping (DEGEN model)**

Daily tip allowances sized by engagement quality (reactions received / posts made) create a Sybil surface where new accounts have near-zero tipping power. A bot farm cannot self-tip at scale because each bot account needs genuine followers and engagement history to build allowance. The cost of building fake social graphs is high relative to the tipping reward.

**Proof-of-Humanity / Soulbound Tokens**

Several systems now integrate [Worldcoin](https://worldcoin.org/) iris scans or [Gitcoin Passport](https://passport.gitcoin.co/) score thresholds to bind rewards to verified unique humans. Soulbound tokens (SBTs) — non-transferable identity credentials — allow a system to say "this wallet belongs to a verified unique person" without requiring real-name KYC. The tradeoff is privacy cost and friction; not all users will complete biometric verification.

**Downvote Symmetry**

Hive's insight: if upvotes are stake-weighted, downvotes must be too — but with a broader distribution so small holders can collectively resist whale manipulation. Post-HF21, Hive gave users a separate downvote mana pool (25% of upvote mana) that regenerates independently, lowering the cost of downvoting and enabling community policing without self-sacrifice.

**Contribution Ledger Latency**

Reddit's Karma-proxy model had one anti-Sybil advantage: Karma accrual is slow. You cannot Sybil your way to a high Karma score in a week; it requires sustained community-accepted contribution over months. Any LoreVault system that uses contribution history as a weight (rather than instantaneous balance) gains this temporal Sybil barrier for free.

**Concentration Limits in Governance**

The Steemit failure and the Friend.tech secondary failure both involved unrestricted stake concentration. Any governance mechanism that allows unlimited concentration is an invitation for hostile takeover. Hard caps on individual governance weight (e.g., no single address may represent more than 1% of total governance power, regardless of token balance) are the standard mitigation. These can coexist with freely transferable financial tokens: you separate the *financial token* from the *governance credential*.

**On-Chain Social Graph Requirements**

Lens Protocol's collect mechanic has an inherent Sybil barrier: to collect a post, you need a Lens Profile, which costs a small gas fee. The profile is an NFT with a real creation cost. Wash-trading collects between owned wallets costs real money and doesn't improve the quality-signal metric (since the signal is *who* collected, not *how many* collects). A Sybil attacker would need to fund hundreds of distinct profile wallets — economically irrational for most reward scenarios.

**Quality-Signal Fidelity by Model**

| Model | Quality Signal | Sybil Surface | Capture Risk |
|---|---|---|---|
| Contribution-mining (Hive/Steem) | Stake-weighted vote | Vote cartels, self-voting | Very high without downvote |
| Karma-proxy (Reddit) | Off-chain Karma | Low (multi-month history) | Platform dependency |
| Access-token (Mirror WRITE) | Weekly community vote | Plutocratic (token-weighted) | High (buy your way in) |
| Allowance-tip (DEGEN) | Reaction:cast ratio | Moderate (engagement bait) | Low |
| Bonding-curve (Friend.tech) | Pure price discovery | Very high (speculation cycles) | Total (speculators, not community) |
| Collect mechanic (Lens) | Collect action + payment | Low (real cost per action) | Low |
| Attention-mining (BAT) | Ad view verification | Low (browser-enforced) | None (no community signal) |

The pattern: **quality-signal fidelity and Sybil resistance are inversely correlated with financialization of the reward itself.** When the reward token is itself a speculative asset, the dominant behavior becomes speculation, not the intended contribution.

---

## 6. Onramps for Non-Crypto Users

This is the critical design constraint for LoreVault: **passive collectors must work day-1; participation is upside, never a tax.**

### The Problem

Every fungible token reward system discussed in this dossier has a crypto-native assumption embedded in its original design. Steemit assumed users would manage STEEM wallets. Reddit Community Points required the Reddit Vault app and a seed phrase. Lens Protocol requires a Web3 wallet and gas on Polygon. Even DEGEN tipping requires a Farcaster account connected to a Base wallet.

None of these are zero-friction for a mainstream user who has never held cryptocurrency.

### What Dapper/Flow Got Right

NBA Top Shot — the closest existing product to LoreVault's model — solved this problem with a two-layer architecture: the Dapper custodial wallet (credit card funded, zero crypto knowledge required) stacked on top of Flow's underlying blockchain. Users buy Moments with Visa. Their Dapper account holds the NFTs. If they want to go deeper, they export to a self-custody wallet. If they don't, they never see a seed phrase.

Dapper launched FUSD (a USD-backed stablecoin on Flow) in June 2021 to create an in-ecosystem unit of account that collectors comfortable with dollars could use without touching FLOW tokens. The Ticketmaster NFT partnership produced 2.5 million active Flow users within six months — nearly all of whom never bought FLOW on an exchange.

The key principle: **abstract the token layer; expose the collectible layer.** Mainstream users understand "I own this card." They don't need to understand "I hold 50 LORE tokens accruing from my contribution activity."

### The Embedded Wallet Generation (2024–2026)

By 2024, the infrastructure matured dramatically. Embedded wallets (MetaMask's embeddable SDK, Dynamic.xyz, Privy, Alchemy's Account Kit) allow platforms to provision a Web3 wallet silently during social login — the user signs in with Google, a wallet is created behind the scenes using Multi-Party Computation (MPC) key splitting, and the user never sees a seed phrase or gas fee.

Gasless transactions (account abstraction via ERC-4337 on EVM chains; native resource credit sponsorship on Flow) allow the platform to sponsor all transaction costs for new users. Apps using embedded wallets report 40%+ month-over-month retention improvements over mandatory wallet-connection flows.

For LoreVault on Flow specifically: Flow's native account model (resource-based ownership rather than address-based) is architecturally superior for custodial-to-self-custody migration. A user's Dapper account and their own Flow wallet share the same on-chain resource structure — migration is a permission change, not a data migration.

### The Separation Principle

The non-crypto onramp requirement implies a **separation of interfaces:**

- **Collector interface** (primary): no wallet required, fiat checkout, no token vocabulary. A user buys a LoreVault artifact with a credit card, owns it, can view it, can trade it on a marketplace. No mention of "LORE tokens" or "contribution rewards."
- **Participant interface** (opt-in): wallet connection, token receipt, tip economy, governance votes. A user who wants to engage with the token layer opts into it explicitly.

The Mirror.xyz example is instructive in reverse: when Mirror opened the platform to all wallet-holders in October 2021 (removing the WRITE gate), they discovered that most writers just wanted to publish. The token-gated phase had served self-selecting crypto users; the broader creative community didn't want or need it. LoreVault should design with the same discovery: the majority of users will never touch the fungible token layer, and that's not a failure condition — it's the intended baseline.

### Practical Non-Crypto UX Stack for Flow

| Layer | Tool | Function |
|---|---|---|
| Identity | Email/social login | Sign up without crypto |
| Custody | Dapper wallet (custodial) | Hold NFTs and reward tokens without seed phrase |
| Fiat on-ramp | Credit/debit card via Dapper | Buy artifacts in USD |
| Gas abstraction | Flow native (no user gas) | No ETH/FLOW needed for transactions |
| Upgrade path | Blocto or self-custody Flow wallet | Advanced users export to full self-custody |
| Token receipt | Silent wallet crediting | LORE tokens appear in wallet without user action |

---

## 7. Composability with NFT Collectibles

### The Dual-Layer Product Architecture

A Top-Shot-style or Sorare-style NFT product has a natural dual-layer architecture that a fungible participation token can slot into without disrupting:

- **NFT layer (scarce, unique, tradeable):** the primary collectible. In LoreVault's context: lore artifacts, mythological character cards, world-building documents, illustrated scenes. Each is a unique or edition-limited NFT. Value derives from rarity, provenance, and community significance.
- **Fungible layer (liquid, divisible, earnable):** the participation token (call it LORE or equivalent). Value derives from utility within the ecosystem: access to exclusive drops, governance weight, tipping currency, staking for rewards.

These two layers compose along several axes:

**Staking NFTs for Token Yield**

Holders of rare NFTs can stake them to earn a stream of fungible tokens. This model (used by Sorare with $SO5 ticket tokens, and by various gaming NFT projects) creates a holding incentive that reduces secondary market sell pressure. For LoreVault: holding a "Tier 1 Pantheon Artifact" might yield 10 LORE/day; a common artifact yields 1 LORE/day. This rewards passive collectors who simply hold without requiring any participation.

**Spending Tokens to Upgrade NFTs**

Fungible tokens can be burned to evolve, customize, or unlock metadata on NFTs. This creates a genuine token sink — a mechanism for reducing circulating supply — while tying the token's utility directly to the collectible product. A LoreVault user who accumulates LORE through participation can burn it to unlock a new chapter annotation layer on their artifact, or to name a character in the lore, or to commission an illustrated variant.

**NFTs as Contribution Credentials**

The Lens Protocol model: the social action (collect, post, tip) is itself an NFT. In LoreVault, every lore entry a contributor submits could mint a "Contribution NFT" — non-transferable (soulbound) or limited-transferable. This serves as a verifiable contribution record. Contribution NFTs accumulate and can serve as the quality signal for future reward distribution, without requiring any token holdings to start contributing.

**Token-Gated Access to Premium Collections**

Holding a minimum LORE balance (or staking a minimum) unlocks access to premium drops, early mint windows, or exclusive storylines. This rewards active participants over passive holders without *requiring* participation of passive holders. The key design rule: **token-gating must always be opt-in upside, never a tax on the base product.** A collector who holds no LORE can still buy public drops. The LORE-holder just gets earlier or cheaper access.

**The Sorare Model Relevance**

Sorare distributes $SO5 tickets to users who enter weekly fantasy competitions. Tickets are fungible; cards (NFTs) are not. The tickets are earned through gameplay and spent on entering higher-stakes competitions. This creates a circular economy where the NFT (the rare player card) is the primary asset, and the fungible token is the participation fuel. Apply to LoreVault: the lore artifact NFT is the primary asset; LORE tokens are the participation fuel for lore competitions, canon votes, and community challenges.

**Flow-Specific Composability**

Flow's [Cadence smart contract language](https://flow.com/post/flow-blockchain-fungible-tokens-guide) uses resource-oriented programming — digital assets are stored as resources in user accounts, not in contract-managed mappings. This means NFTs and fungible tokens are genuinely co-located in the same account storage model. Composing them — staking an NFT to earn fungible tokens, burning tokens to modify an NFT — is architecturally native to Flow in a way it is not on EVM chains, where the token and NFT standards (ERC-20 and ERC-721) must communicate through wrappers.

Flow's [FungibleToken](https://flow.com/post/flow-blockchain-fungible-tokens-guide) standard and FlowNFT standard share the same resource primitive, which means a single Cadence contract can hold logic for both. This reduces attack surface and simplifies auditing.

---

## 8. Recommendations for LoreVault

### Specific Recommendations (Do This)

**R1. Use Contribution NFTs as the Primary Quality Signal, Not Token Balance**

Do not make reward distribution proportional to token holdings. This is the Steemit failure. Instead: mint a non-transferable "Contribution Record NFT" every time a user makes a verified contribution (submits lore, wins a canon vote, has an artifact collected). The distribution of fungible LORE tokens is weighted by *Contribution NFT count and recency*, not LORE balance. This breaks the plutocratic loop: you cannot buy your way to greater contribution rewards; you must contribute.

**R2. Adopt the Allowance-Based Tip Economy (DEGEN Model)**

Give each contributor a daily LORE tip allowance sized by their Contribution NFT score. They tip other contributors by making a specific on-chain or app-layer action (analogous to DEGEN's "$DEGEN N" reply). New accounts start with minimal allowances. This creates a Sybil barrier that scales with time and genuine contribution, without requiring any identity verification. The tip history becomes a quality signal for algorithmic curation: artifacts that attract many tips from high-allowance contributors rise in visibility.

**R3. Build the Fiat / Custodial Path as the Default (Dapper Model)**

All first-time LoreVault users enter through a fiat-native, custodial path. Credit card purchase of artifacts. No seed phrase. No gas fee. No token vocabulary. LORE tokens earned through contribution accrue silently to the custodial wallet. Users who want to access the token are offered an upgrade path to self-custody, but it is never required. The measure of success: a user who has never heard of blockchain should be able to buy, hold, and enjoy a LoreVault artifact without ever encountering a gas fee, a wallet popup, or the word "token."

**R4. Separate Financial Token from Governance Credential**

Issue LORE as a freely transferable financial token. Issue a *non-transferable* Governance Power token derived from Contribution NFT history. Governance weight derives from the non-transferable credential, not LORE balance. This means governance cannot be purchased by whales buying LORE on secondary markets. The LORE token retains its financial properties (liquid, tradeable, composable with DeFi) without those properties corrupting governance. This is the design lesson from the Donut governance-capture vulnerability in r/ethtrader.

**R5. Build Hard Concentration Limits Into the Reward Contract**

At the smart contract level, cap the maximum LORE a single address can receive in any distribution round at X% of total round issuance (e.g., 1–2%). This is a protocol-level anti-whale mechanism that cannot be overridden by any admin. It reduces the return on investment of Sybil farms (which would need many addresses, each earning 1%, to replicate what one uncapped address could earn). More importantly, it ensures that early large contributors do not crowd out new contributors as the platform scales.

**R6. Implement NFT Staking Yield for Passive Collectors**

For users who will never participate in lore creation but want to hold artifacts: offer a LORE staking yield on artifact holdings. Rarer artifacts yield more. This gives passive collectors meaningful upside from the token economy without requiring them to interact with it. It also creates a token-sink mechanism where earned LORE is redistributed from the staking rewards pool (pre-seeded at launch, replenished by platform revenue over time). This directly satisfies the design constraint: "passive collectors must work day-1; participation is upside, never a tax."

**R7. Create a Lore-Specific Contribution Taxonomy**

Not all contributions are equal, and the reward system must reflect lore-specific quality signals. Define a contribution taxonomy with different LORE weight multipliers:

- **Canon submissions** (lore entries accepted into official canon): highest multiplier (e.g., 10x)
- **Community-endorsed lore** (earns >N tips from verified contributors): medium multiplier (e.g., 3x)
- **Collected artifacts** (other users pay to collect your artifact): proportional to collect fee paid
- **Curation actions** (tipping, voting, organizing challenges): baseline multiplier (1x)

This taxonomy means the quality signal is granular and protocol-legible, not dependent on a single upvote count.

### Specific Anti-Recommendations (Do Not Do This)

**AR1. Do Not Use a Bonding Curve on Creator or Contributor Access**

The Friend.tech failure is definitive. Bonding curves on social capital convert community membership into a financial speculation. When the speculation cools, the community is gone. LoreVault contributors should never have their "access" to participation priced on a curve. Participation must be open (with quality gates, not financial gates).

**AR2. Do Not Run the Reward Oracle on a Company Server**

The Reddit Community Points shutdown is the clearest possible demonstration of the failure mode. If LoreVault's LORE distribution requires a LoreVault Inc. server to compute and sign each round's distribution, then every token holder is exposed to a unilateral corporate decision. The contribution signal must be on-chain or derived from on-chain data (NFT mints, collect actions, tip transactions) — not from a proprietary algorithm that can be changed or shut down without notice.

**AR3. Do Not Use Stake-Weighted Voting for Content Curation**

Steemit's catastrophic vote-buying ecosystem should be treated as a permanently closed design space for content-facing products. Any system where voting power is proportional to token balance will eventually be captured by vote-buying cartels. If LoreVault uses token-weighted governance at all, it should be restricted to structural decisions (protocol upgrades, treasury allocation) — not content quality decisions. Content quality should be determined by contribution-weighted peer review, not financial stake.

**AR4. Do Not Build Platform Dependency Into the Token's Core Utility**

LORE tokens must have utility that exists independently of LoreVault Inc.'s continued operation. At minimum: LORE should be spendable on artifact upgrades through a smart contract that LoreVault Inc. cannot freeze. The token should be tradeable on DEXs without platform permission. The NFT artifacts should be viewable and tradeable on standard Flow marketplaces (Flowverse, etc.) regardless of LoreVault's app status. Utility that depends on a running API is not on-chain utility.

**AR5. Do Not Use Pure Attention-Mining (BAT Model) as the Contribution Signal**

Rewarding users for viewing content — the BAT model — does not produce quality signal in a literary community. It produces signal about who views the most content, which is not the same as who contributes the most value. A prolific reader who views 1,000 lore entries without creating anything is valuable, but they are not the same kind of valuable as a contributor who writes a piece that 1,000 people collect. Do not conflate these roles in the reward structure. Attention can be *one input* (e.g., "read-to-earn" bonuses), but it cannot be the *primary input*.

**AR6. Do Not Gate Base Product Access Behind Token Holdings**

The product principle is stated plainly: participation is upside, never a tax. Operationally: no feature of the core collectible product (buying artifacts, viewing lore, trading on marketplace) should require LORE token holdings. Token-gating is permissible only for *additional* privileges: early access windows, governance votes, exclusive challenge entry. The moment LORE becomes required to use the product, it becomes a toll booth — and the platform degrades into pay-to-play, the most corrosive outcome for creative communities.

**AR7. Do Not Launch Without Token Velocity Controls**

Every contribution-mining system that launched without velocity controls (limits on how fast tokens can be sold post-earning) saw immediate sell pressure that cratered token price, which demoralized new contributors, which reduced contribution quality, which cratered token price further. Implement a short vesting schedule for newly minted LORE (e.g., earned tokens vest linearly over 90 days). This is not a lock-up that prevents participation; it is a stability mechanism that keeps the token economy from front-running itself into collapse during the critical early growth phase.

---

## Key Failure Taxonomy Summary

| System | Failure Mode | Root Cause |
|---|---|---|
| Steemit | Vote-buying cartels, self-voting | Stake-weighted curation without downvote parity |
| Reddit Community Points | Platform shutdown zeroed value | Reward oracle owned by platform, not protocol |
| Friend.tech | Speculation collapse, community evaporation | Conflated social membership with financial speculation |
| Mirror WRITE Race | Plutocratic access (bought votes) | Token balance determined voting power |
| Donut (r/ethtrader) | Governance capture via market purchase | Financial tokens used for governance without separation |
| BAT | No community quality signal | Attention-mining doesn't measure contribution value |

---

*Dossier prepared by Research Agent F. All statistics sourced from publicly available data as of April 2026. Specific figures for token prices, user counts, and TVL reflect data from the cited sources and are subject to the volatility inherent in crypto markets.*

---

### Primary Sources Referenced

- [Reddit Kills Community Points — TechCrunch](https://techcrunch.com/2023/10/17/reddit-is-phasing-out-community-points-blockchain-rewards/)
- [Reddit Shuts Down Unscalable Community Points — CoinGeek](https://coingeek.com/reddit-shuts-down-unscalable-blockchain-based-community-points/)
- [Reddit to Discontinue Community Points — Unchained Crypto](https://unchainedcrypto.com/reddit-to-discontinue-community-points-citing-scalability-and-regulatory-issues-sparking-community-backlash/)
- [Reddit Mods Removed for Insider Trading Suspicion — CryptoSlate](https://cryptoslate.com/reddit-mods-removed-for-suspicion-of-insider-trading-during-moons-shutdown/)
- [Community Points Collapse Analysis — Forkast](https://forkast.news/what-caused-reddit-community-points-collapse/)
- [Steem Versus Hive: Testing Blockchain Governance — Harvard Business School](https://www.hbs.edu/faculty/Pages/item.aspx?num=61580)
- [Steem Community Resists Takeover, Launches Hive — CoinTelegraph](https://cointelegraph.com/news/steem-community-resists-takeover-hard-fork-launches-hive-network)
- [Steem Hard Forks Over Justin Sun Power Grab — CoinDesk](https://www.coindesk.com/markets/2020/03/20/steem-hard-forks-today-over-fears-of-justin-sun-power-grab/)
- [Hive Whitepaper](https://hive.io/whitepaper.pdf)
- [Mirror.xyz WRITE Token GitHub](https://github.com/mirror-xyz/write-token)
- [Mirror WRITE Race — dev.mirror.xyz](https://dev.mirror.xyz/vZxxUIeGMQK9NNLcrT0eDYZ6wXhXVr6vTQzztj1DaEA)
- [Mirror.xyz Review — ConsenSys](https://consensys.io/blog/mirror-xyz-review-how-to-use-metamask-to-compete-in-the-write-race)
- [Lens Protocol — Zerion Overview](https://zerion.io/blog/lens-protocol/)
- [State of Lens Protocol 2023 Annual Report — Milk Road](https://milkroad.com/daily/state-of-lens-protocol-2023-annual-onchain-report/)
- [Lens Protocol V2 Launch — CoinDesk](https://www.coindesk.com/tech/2023/11/13/lens-aaves-decentralized-social-media-platform-launches-major-upgrade-on-polygon)
- [BONSAI Token Raises $1M — Crypto Times](https://www.cryptotimes.io/2024/04/06/bonsai-token-raises-1m-targets-lens-protocol-integration/)
- [Lens Memecoins and BONSAI — CryptoSlate](https://cryptoslate.com/lens-memecoins-are-built-different-why-bonsai-surged-10x-becoming-genuine-community-token/)
- [The Rise and Fall of FriendTech — CryptoPragmatist](https://cryptopragmatist.com/p/rise-fall-friendtech-cautionary-tale-web3-developers)
- [Friend.tech TVL Collapse — MEXC News](https://www.mexc.com/news/85321)
- [Friend.tech Creators Walk Off with $44M — DL News](https://www.dlnews.com/articles/defi/friend-tech-shuts-down-after-revenue-and-users-plummet/)
- [Friend.tech Token Crashes 98% — Bloomberg](https://www.bloomberg.com/news/articles/2024-05-03/crypto-s-social-media-friend-tech-saw-token-value-crashed-98)
- [Friend.tech Community in Uproar at V2 Launch — Decrypt](https://decrypt.co/229273/friend-tech-community-in-uproar-amid-token-and-v2-launch)
- [Degen Token on Farcaster — Matcha Blog](https://blog.matcha.xyz/article/degen-token-on-farcaster)
- [Farcaster DEGEN Airdrop Guide — Decrypt](https://decrypt.co/215921/farcaster-degen-meme-coin-airdrop-how-farm)
- [Can Frames and DEGEN Support DeSoc — CoinLive](https://www.coinlive.com/news/can-frames-and-degen-airdrop-farcaster-support-the-hope-of)
- [What is Degen — tastycrypto](https://www.tastycrypto.com/blog/degen/)
- [Brave Browser Statistics 2025 — Sci-Tech-Today](https://www.sci-tech-today.com/stats/brave-browser-statistics-updated/)
- [Basic Attention Token — basicattentiontoken.org](https://basicattentiontoken.org/)
- [What Is BAT — Bitstamp](https://www.bitstamp.net/learn/cryptocurrency-guide/what-is-basic-attention-token-bat/)
- [EthTrader Donut Experiment — U.Today](https://u.today/the-ethtrader-donut-experiment-reddits-community-governance-on-ethereum)
- [Sybil Attacks in Crypto — formo.so](https://formo.so/blog/what-are-sybil-attacks-in-crypto-and-how-to-prevent-them)
- [Token Airdrops Targeted by Sybil Attacks — CoinTelegraph](https://cointelegraph.com/news/token-airdrops-targeted-farm-accounts-sybil-attacks)
- [Flow Blockchain Fungible Tokens Guide — Flow](https://flow.com/post/flow-blockchain-fungible-tokens-guide)
- [What is Flow Blockchain — DappRadar](https://dappradar.com/blog/introducing-the-flow-blockchain-home-of-nba-top-shot)
- [NBA Top Shot on Flow — Gemini Cryptopedia](https://www.gemini.com/cryptopedia/nba-topshot-nft-flow-blockchain-nba-moments)
- [Embedded Wallets with Social Login — Dynamic.xyz](https://www.dynamic.xyz/blog/embedded-wallets-with-social-login-the-standard-for-web3-onboarding)
- [Farcaster Battle with Lens Protocol — BlockEden](https://blockeden.xyz/blog/2026/01/15/decentralized-socialfi-farcaster-lens-protocol-web3-social-graph/)
