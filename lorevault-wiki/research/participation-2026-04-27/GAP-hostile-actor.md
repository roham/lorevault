# GAP: The Hostile Actor and Coordinated Adversarial Submission

**Gap statement:** V1 treats hostile content as a Trust & Safety problem solvable by a moderation team operating under published policy. This handles the lone bad actor — the racist short story, the doxxing attempt, the obvious shock submission — but does not handle the harder adversarial cases: (a) coordinated submission campaigns by an organized group attempting to inject ideology at scale, (b) "valid-looking" submissions whose harm is structural rather than surface, (c) hostile actors using LORE economics or off-chain coordination to game the upvote/Featured Shelf system, and (d) the post-launch attacker who buys 5,000 Pane cards to acquire submission slots. The submission-staking defense in V1 is calibrated against spam, not against motivated, capitalized adversaries.

## Why this matters

Three reasons elevate this from "edge case" to "load-bearing":

1. **Open submission systems attract attackers.** Wikipedia's experience with [coordinated paid-editing rings](https://en.wikipedia.org/wiki/Conflict-of-interest_editing_on_Wikipedia), Reddit's history with state-actor influence operations, SCP's own experience with the 4chan-coordinated brigading of the "SCP-2000" era, Wikia's experience with extremist micro-wikis, and the recent (2024-2026) wave of LLM-assisted lore-injection attacks on fan wikis all demonstrate that open-submission systems with any cultural capital attract organized adversaries. LoreVault, by virtue of being a literary-mythological IP with active themes around cosmology, borders, and contraband, is a target rich in symbolic terrain for ideologically-motivated actors.

2. **LoreVault's stake is higher than SCP's.** SCP can absorb a bad article — it gets deleted, the wiki moves on. LoreVault's submissions are minted as Authorship NFTs. They are immutable. A canon-promoted submission affects card metadata that ships to 50,000+ collectors and becomes part of the official IP. The blast radius of a successful adversarial promotion is permanent.

3. **The defenses V1 names are individually defeatable.** Submission staking? Buy more LORE. Per-wallet rate limits? Use 50 wallets. One-account-one-vote upvotes? Buy 50 cheap Pane cards across 50 wallets. NFT-holding sybil defense? Pre-buy at S1 launch at $5/card, sit on them, attack at S3. Each defense in isolation is a speed bump. The architecture needs depth.

## Analysis

The adversarial threat-model has four distinct attack surfaces:

### Threat 1: Surface-harmful content (the easy case)

Examples: racist fiction, doxxing, harassment of named contributors, sexually-explicit content involving minors, copyright infringement, malware in linked files. V1's Trust & Safety team handles this case adequately. The on-chain Authorship NFT survives moderation as record (good — prevents silent erasure), the content is delisted from the Hub, the contributor's wallet is flagged. This is solved.

### Threat 2: Structurally-harmful content (the hard case)

Examples: a submission that conforms to the Pane's existing axioms, passes the contraband-and-cost framing, reads as competent fiction, but encodes an ideological reading that subtly aligns the cosmology with extremist symbology. The 4chan-coordinated SCP submissions of 2014-2017 used this pattern — entries that read as legitimate horror fiction on first pass, second-pass revealing antisemitic dog-whistles or alt-right symbolism. The Council reviewing on V1's published rubric (lore-coherence, literary quality, attribution clarity, contraband legitimacy, cross-Pane compatibility) has no explicit checkbox for "is this ideological injection?" because the rubric was designed for editorial quality, not adversarial defense.

### Threat 3: Economic and coordination attacks

Examples:
- An organized group buys 1,000 LORE tokens and 50 cheap Pane cards across 50 wallets, then submits 50 coordinated entries advancing a unified narrative agenda, upvoting each others' work to game the Featured Shelf.
- A group buys $50K of pre-S3 Pane cards specifically to acquire NFT-gated submission rights, then weaponizes the rate limit by using their full quota every cycle.
- A group accumulates Marginalia badges via legitimate posting in S2, then in S3 uses badge-weighted social trust to brigade the Hub upvote system.
- A whale offers off-chain payment to Tier-2+ users for upvotes (vote-buying despite the on-chain unbuyability of votes).

V1's per-wallet caps and badge-not-balance governance partially defend against these. But the rate limits are per-wallet, not per-actor, and sybil resistance via NFT-holding is defeated by capital. A $200K adversarial budget defeats every per-wallet defense in V1.

### Threat 4: AI-assisted submission floods

Examples (post-2024 base rate): an attacker uses an LLM to generate 500 submissions per cycle that are individually plausible — they pass the contraband framing, articulate cost, conform to Pane axioms. Most are mediocre but some are good. The attacker's goal is not promotion of any specific entry but exhaustion of Council and Curator attention, plus statistical likelihood that one of 500 submissions slips through. This is the [DDoS-of-discernment](https://en.wikipedia.org/wiki/Denial-of-service_attack) attack. Submission staking is the defense, but if the per-submission stake is calibrated to be "small enough that any genuine contributor can afford it" (V1 §3), then it is also small enough that an attacker with $1,000 can submit 500 times.

## Design recommendations

Six layered defenses, each addressing a specific threat tier. None individually sufficient; together they raise attack cost above attacker willingness for almost all scenarios except nation-state.

### 1. Adversarial-design rubric extension for the Council

Add a sixth rubric criterion: **"Does this submission carry encoded extra-textual content?"** This is the explicit ideological-injection check. Council deliberation must include: scan the work for known extremist symbology, dog-whistles, numerological patterns (88, 1488, 14), consistent ideological framing across submissions from the same wallet, and brigade-pattern co-submissions. A small specialist function within the Trust & Safety team — an "Adversarial Reading Pass" — performs this scan on every Featured Shelf entry before Council review. The pass is documented; false positives are appealable; the existence of the pass is publicly disclosed in the constitutional documents (deterrence value).

### 2. Tiered submission staking

Replace V1's flat per-submission stake with a tier-and-history-aware curve:

- **First-time contributor:** stake fully subsidized by faucet (V1 baseline).
- **2nd-10th submission:** small stake (V1 baseline).
- **11th+ submission in any 12-month rolling window:** stake doubles with each subsequent submission within the window.

This preserves the genuine prolific contributor (who almost always has high acceptance and Featured Shelf rates, and whose "doubling stake" is offset by accumulated LORE rewards) while making AI-assisted flooding economically painful. A contributor on submission 50 in a year is paying ~2^40 times the base stake — anyone who can afford that has either the platform's full trust or has a budget that no fan-content platform should be defending against alone.

### 3. The Council's "deferred fast-track"

Submissions from contributors with no prior canon promotions or Featured Shelf appearances are reviewed in a separate batch from the proven-contributor batch, with a Council bylaw that no first-time-contributor work is canon-promoted in fewer than 2 cycles after first submission. This forces a 6-month observation window on every new contributor before their work can become canon, during which a coordinated brigade has to maintain its disguise across multiple submissions and not be detected by the Adversarial Reading Pass. This is the [Wikipedia autoconfirmed-user pattern](https://en.wikipedia.org/wiki/Wikipedia:User_access_levels) at the canon-promotion layer.

### 4. Wallet-cluster detection

Off-chain analytics identify wallet clusters that share funding sources, behavior patterns, or correlated submission timing. Detected clusters are flagged in the Council's deliberation interface (the Council sees: "this submission is from wallet 0xabc, which is part of an analytic cluster of 17 wallets active since 2026-04-01"). The cluster flag does not auto-reject; it informs Council judgment. Cluster detection methodology is documented but specific algorithms are not public (deterrence requires some opacity). This is the [Twitter coordinated inauthentic behavior](https://en.wikipedia.org/wiki/Inauthentic_behavior) detection model, applied to the Hub.

### 5. The "high-stakes Pane proposal" defense

Full-Pane proposals already require 10x stake (V1) and 12-month review (V1). Add: a Pane proposal cannot be submitted by a wallet with fewer than 3 prior canon-promoted contributions. This makes the most damaging attack surface — full-Pane injection — accessible only to contributors who have already earned the Council's trust through the slower path. It explicitly closes the "buy your way to a Pane proposal" route.

### 6. Public bug-bounty for adversarial submissions

The platform publishes a bounty (in fiat and LORE) for credible reports of structural-harm submissions that passed initial review. The community is incentivized to second-pass-read its own Hub. This is the [HackerOne security-bounty model](https://www.hackerone.com/) applied to lore moderation. A bounty of $500-$2,000 per substantiated catch is small platform spend and makes the cost-of-attack much higher because the attacker now competes against the entire community's incentive to expose them.

## What V1 must explicitly accept

No defense system is perfect. The architecture must accept that:

- Some adversarial submissions will be promoted before being caught.
- Authorship NFTs are immutable; a hostile contributor's record cannot be erased on-chain. Mitigation: a "moderation overlay" — an on-chain sibling NFT minted by the Trust & Safety wallet noting that the submission was determined to be in violation of policy. The overlay is queryable alongside the original. This is the [Wikipedia Office Action](https://en.wikipedia.org/wiki/Wikipedia:Office_actions) model with on-chain transparency.
- The Council will make mistakes. Constitutional process for un-promoting a canon entry exists, with a higher bar than promotion (6-of-7 supermajority + 30-day public notice + contributor appeal window).

The architecture's job is not to make adversarial attack impossible. It is to make it costly enough, slow enough, and detectable enough that the asymmetry favors defenders.
