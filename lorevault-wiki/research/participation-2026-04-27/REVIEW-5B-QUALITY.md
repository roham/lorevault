# Review 5B — Quality Review of Synthesis V2 (Hostile Pass)

**Reviewer mandate:** hostile review. Find weaknesses. A false PASS is worse than a false FAIL.
**Target:** `00-SYNTHESIS-V2.md`
**Comparator:** `00-SYNTHESIS-V1.md`
**Date:** 2026-04-27

---

## Executive verdict

**Score: 78/100**
**Verdict: CONDITIONAL PASS**

V2 is a meaningful improvement on V1. The Scribe Path, the Seeded Hub, the Adversarial Reading Pass, the tiered staking curve, the Resident Author track, the AI-disclosure policy, and the retcon protocol are all real architectural decisions, not metaphors. V1 had three hand-waves (cold-start, hostile-actor depth, crypto-refusenik writers); V2 closes two of them substantively and the third partially.

But the document still leaks at the seams in places that matter for an implementation spec. Concretely: the LORE token has at least three numerical holes that would fail an economist's read-through, the contraband UX is described well at the metaphor and form-field level but nowhere at the curation-queue / state-machine level, the anti-capture story has one structural soft spot that a $500K adversary would walk through, and the document never quite earns its claim of being LoreVault-specific rather than generic-collectible-platform. None of these are fatal. All of them need V3 patches before this is an implementation spec.

The conditional-pass sections requiring strengthening are listed at the end.

---

## Per-criterion scoring

### 1. Specificity of decisions — 8/10

**Strengths.** Tier mechanics are concrete: Marginalia I-X awarded for upvoted Margin Notes (with one-account-one-vote), Authorship NFTs minted at submission (not at acceptance), Canon Marks only on 5-of-8 Council vote, Resident Author retainer at "$60-120K/yr equivalent." The Council composition is fully specified — 8 seats, role of each, term lengths, staggering, supermajority thresholds for normal promotion (5/8) and retcon (6/8). The phased rollout has specific gating metrics with numbers (50K wallets, $5M secondary volume, 1K T2 users, 100 organic submissions in S3 with a fail-threshold of 25). An engineer can build the Council module from this.

**Weaknesses that block implementation.**
- **The LORE grant amounts are abstract.** §2 gives "X LORE / 3X LORE / 10X LORE" without ever specifying X. Similarly the "small base stake," "stake doubles each subsequent submission," the cosmetic frame upgrade prices, and the Council nomination fee are all unspecified. An engineer reading this cannot build the tokenomics module — they have to invent the numbers. V1 had the same hole. V2 didn't fix it.
- **The Quill-counter and Scribe-quota math is unspecified.** "At most N submissions per 30-day window, scaling with Quill score" — N isn't specified, and the scaling function isn't specified. A Scribe with 10 Quill: how many submissions per month? Unanswered.
- **First-time-contributor faucet.** "One-time free LORE grant for first three submissions" — amount unspecified.
- **The royalty stream is hand-waved.** "1-3% of secondary-market royalties on the affected cards" — what determines 1 vs 3? Council bylaw? Per-promotion vote? If the latter, that's an additional governance surface that's not designed.

**Net.** The architecture is specified. The numbers are not. An engineer can build the shape; a tokenomist cannot calibrate the system. Score reflects that an implementation spec needs both.

### 2. Passive-first constraint — 9/10

This is the document's strongest section, and V2 strengthens it further. The §1 design rule is explicit and load-bearing. The "additive, never subtractive" phrasing for participation rewards is structurally honored throughout — Tier-0 gets airdrops, gets a free Apprentice Pane, gets the Hub Highlights opt-in, but is never required to engage. The 20% airdrop allocation is the structural promise. The card flavor-text is explicitly self-contained ("not as wiki-stub").

**Subtle taxes I looked for and did not find.**
- No FOMO mechanic (no expiring drops, no time-locked airdrops with penalty for non-claim).
- No "collector score" that decays on non-participation.
- No participation-gated features that affect floor price.
- No social pressure rendered in UI for the Tier-0 user.

**One mild concern.** The "Reader's Sigil" cosmetic is described as having "zero impact on market value or rarity" but cosmetic frames in §3 are explicitly purchasable with LORE-burn for "alternate frames." If those LORE-burned frames are visually distinguishable from the free Reader's Sigil, the Tier-0 collector who didn't engage will see Tier-2 collectors carrying obviously-fancier-looking copies of the same card. Whether that constitutes a "subtle tax" depends on visual design — the document doesn't say. Worth flagging but not penalizing heavily.

**The other concern: the Hub Highlights email is opt-in, but the "read the lore behind this card" link in the gallery is not described as opt-in.** A passive collector who clicks that link out of curiosity is dropped into the Hub's social layer. There is no "stay in the gallery, just show me the relevant entry quietly" mode described. Minor but real.

### 3. The Contraband Mechanic — 7/10

V2 adds Step 4 (AI disclosure) to V1's four-step border-crossing. The structured fields are real: contributor declares origin, contraband (with category dropdown and one-sentence statement), customs cost, AI tools, then writes the actual submission. This is genuine UX, not metaphor. The examples in §5 (mirrors-record-but-never-reflect, the cartographer of borders that don't yet exist, the Lantern of Forgotten Names) demonstrate that the form structure produces coherent submissions. The on-chain metadata flow is specified (the declaration becomes the title-card and primary metadata). The "Off-Canon Permanent" flag is a real on-chain state.

**Where the mechanic is metaphor, not UX.**

- **The curation queue state machine is unspecified.** A submission moves through: auto-publish → 30-day community window → potentially Featured Shelf → Adversarial Reading Pass → Council shortlist → blind deliberation → vote → promotion/defer/retcon. Fine. But what does a Hub entry's *page* look like during each state? When does the "Featured Shelf" badge appear in UI vs. metadata? Where is the Margin Notes thread shown? Where does the AI-disclosure tag display, and to whom? These are the screens an engineer needs to wireframe; the document gives them no specification.
- **No specification of submission editing.** Can a contributor edit a submission after publishing it but before Council review? V2 mentions "accept-with-patch (contributor revises)" as a Council option but does not specify the contributor-initiated edit flow. Important because it affects on-chain Authorship NFT immutability claims — an immutable NFT for content that can be edited is a contradiction.
- **No specification of the migration from Hub-only to Council-shortlisted.** Does the contributor opt in to Council consideration? Per V2, "every submission, accepted or not" mints an Authorship NFT, and "Off-Canon Permanent" is opt-out — so the default is canon-eligible. Then how does the Council shortlist arrive at 20-50 from a Hub of (target) 5,000 entries by S8? The specification of Featured Shelf upvote thresholds, Curator nominations, and Council-member nominations as filters is named but not numerated. What upvote count promotes to Featured Shelf? Unanswered.
- **No specification of metadata fields beyond the declaration.** The Authorship NFT carries "metadata" but the schema isn't given. For an attribution system that's the load-bearing defense against the Homestuck failure, this is a gap.

The contraband framing is real. The submission form is real. The UX of the rest of the contributor's journey through curation is metaphor + bullet list. An implementation spec needs the state machine.

### 4. Anti-capture robustness — 7/10

V2 adds three new defenses to V1: tiered staking, wallet-cluster detection, and the Adversarial Reading Pass. Combined with V1's existing five (badges-not-tokens, rate limits, airdrop caps, Council seat caps, identity attestation), the architecture is robust against common attacks.

**The $500K adversary stress test.**

A hostile actor with $500K can:
1. Buy ~$50-100K of NFTs across 100+ wallets (with funding-source variation to defeat naive wallet-cluster detection — fund through 5-10 mixers/exchanges over 3-6 months).
2. Hire 20-30 freelance writers ($10-30K) to produce genuinely-decent Hub submissions over 12+ months.
3. Run those submissions through 50+ wallets, each with a few NFTs, varying their submission cadence to defeat tiered staking (each wallet stays in the "first 10 submissions" zone).
4. Cross-upvote each other's submissions for Marginalia accumulation (one-account-one-vote, but each wallet is one account).
5. Wait the 12-month observation window, then push for canon promotion via the contributor-elected seat.

**What stops this in V2.**

- Wallet-cluster detection ("off-chain analytics flag wallet clusters with shared funding sources or correlated submission timing"). This is the load-bearing defense and it is hand-waved. The document explicitly says specific algorithms are not public. That's reasonable for deterrence but an implementation spec needs to know whether the detection is staffed (a person with a Chainalysis license and a quarterly review) or automated (rule engine), what the false-positive tolerance is, and what threshold triggers Council notification. None of this is specified. Crucially: an attacker with patience can defeat funding-source clustering by using personal-credit-card on-ramps for each wallet over 6+ months — they look like 50 independent retail buyers.
- Council seat caps (no more than 30% Tier-4-held, no more than 2 seats per real-person identity verified by off-chain attestation). Good. But the contributor-elected seat is one-account-one-vote among Authorship-NFT-holders — and a 50-wallet cluster has 50 votes. If the cluster's coordinated favored candidate is *also* the cluster's planted contributor with several Canon Marks, they capture the contributor seat.
- Identity attestation for elected Council members. This is the actual final defense. But "off-chain attestation, enforced via Council bylaw and member oath" is the weakest possible enforcement layer. If the attacker's planted contributor lies on the attestation, the only enforcement is "we will remove them from the Council if discovered." For a sophisticated attacker, that risk is acceptable.

The architecture is *robust*, in that capture requires sustained 12+ month investment and 20+ commissioned writers. It is not *certain*. The document oversells "wallet-cluster detection" as a load-bearing defense when it's actually a deterrent layer; the load-bearing defense is identity attestation, and that defense relies on member oaths. Score reflects that an honest reading of the threat model would say "we have raised the cost of capture to $500K-$1M and 12+ months, and this is acceptable" rather than implying the architecture is hardened against well-funded attackers.

**Specific gap.** The first-time-contributor observation window is "2 cycles (12 months) before canon promotion is possible." This is good. But Marginalia accumulation, contributor-seat voting eligibility, and Featured Shelf appearances are *not* gated on the observation window. A 50-wallet sleeper cluster can accumulate Marginalia and voting weight throughout the observation period and arrive at month 12 with a fully-charged voting bloc. The observation window only delays canon promotion; it does not delay capture.

### 5. Cold-start practicality — 9/10

This is V2's other strongest section, and the most substantive improvement over V1. V1 hand-waved cold-start; V2 designs for it explicitly.

The Seeded Hub launches S3 with 200-500 staff-and-commissioned-contributor entries dated honestly. The Lore Curator is a paid editorial-scout role hired for the first 18-24 months. The Tier-0-to-Hub bridges (the "read the lore behind your card" link, the opt-in Hub Highlights email, and ambiguity-planting flavor-text) are real recruitment mechanisms. The S3 metrics are revised to be lenient and Hub-traffic-focused (1K T0.5 by month 3, 5K by month 6, 100 organic submissions with a fail-threshold of 25 — much more achievable than V1's 500-submission gate). The warm-up canon-promotion exception (1-3 promotions of seeded fan-writer work in S3) provides visible evidence to organic contributors that the canon path is real.

**Strengths.**
- The "dated honestly" and "disclosed in constitutional documents" detail is the right call. Lying about when the seeded entries were written would erode trust if discovered; transparent staging preserves credibility.
- The commissioned cohort (10-20 fan-writers, fiat + LORE, hired during S2) is realistically scaled. Major fan-content platforms (Webtoon, Wattpad, AO3 spinoffs) have used similar seed strategies.
- The Lore Curator's rotation-out-as-volume-grows is the right design — it avoids permanent gatekeeping while solving the cold-start signal problem.
- The S3-month-6 5K-T0.5-DAU target is the right *kind* of metric. Tier-0.5 (read-only Hub traffic) is the leading indicator and the gate is calibrated to it.

**Minor weaknesses.**
- Budget for the seeding strategy is unspecified. 10-20 commissioned writers at industry rates is $200K-$1M, plus a Lore Curator salary, plus a one-time Treasury allocation. The Treasury is 12% of LORE supply — 120M LORE — but the dollar value of LORE is unspecified, so whether 12% covers an 18-24-month seeding budget is unknowable from the document.
- The "what if the seeded cohort is the only contributor body" failure mode is not pre-empted. If by S5 the Hub is still 90% seeded-cohort + commissioned content, the architecture has produced a paid lore-staff dressed as community participation. The Proxy 1 fail-threshold (sub-100 organic submissions in S4) catches this, but no diagnostic / pivot strategy is offered.
- "Discord population large enough to seed an initial contributor pool — ~10K members" by end of S1 is a hopeful number with no acquisition strategy. Top Shot got there. Disney Pinnacle did not. The document does not address what S1 marketing produces this Discord population.

Strong section overall. The honest "we may have to seed for 18+ months" framing is the right design posture.

### 6. Non-crypto accessibility — 8/10

V2's Scribe Path is a real architectural decision and a substantive improvement over V1. A writer with email-only can now: read the Hub, post Margin Notes (with sybil defenses), submit fan-canon, receive editorial feedback, be canon-promoted, and vote in the Scribe-elected Council seat. Authorship Escrow holds their on-chain record claimable on later wallet provisioning. Fiat bounties are funded from a 5% LORE-supply allocation.

**What works.**
- The Attribution Escrow is the right primitive. The Scribe gets attribution from the moment of submission; possession is deferred. Permanent identity, deferred custody. This is the strongest design in the section.
- Temporal staking for Scribes (N submissions per 30-day window, scaling with Quill) is an elegant substitute for LORE staking. The economic friction becomes a temporal friction without forcing crypto-engagement.
- The dedicated Scribe-elected Council seat ensures Scribes have governance representation that is not LORE-mediated.

**Gaps that prevent full accessibility.**

- **Scribes cannot vote on the Featured Shelf upvote system** (NFT-gated for sybil resistance, per §3). This is structurally significant: the Featured Shelf is the primary signal that drives Hub entries toward Council attention. Scribes can submit but cannot help promote each other's work. A Scribe-only ecosystem cannot organically achieve canon promotion without NFT-holder upvote support.
- **Scribes cannot pin Margin Notes** (LORE-burn mechanic). Minor, but it's a participation feature they're locked out of.
- **The 5% Scribe-Bounty Treasury is small.** 38% goes to wallet-holder contributions, 5% to Scribes. If the V2 stretch target is "20-40% of Tier-3 active contributors are Scribes by S5" (Proxy 5), then Scribes get ~12% per-capita of the contribution pool that wallet-holders get. This is a structural incentive against Scribe participation that contradicts the design intent. Either the bounty allocation should scale toward Scribe-population proportion, or the per-Scribe bounty is structurally smaller than per-wallet-holder rewards. The document does not address this tension.
- **Fiat bounty distribution mechanism.** "PayPal, direct deposit, or comparable" — for a Scribe in a jurisdiction PayPal doesn't serve, what's the fallback? Wire transfer adds friction and KYC. The Jurisdictional Refusenik case may not be served by the bounty mechanism even though they can write.
- **Royalty distribution as fiat to Tier-4 Scribes** is described but the mechanism is hand-waved. Quarterly checks? Direct deposit? Tax-form generation? For a perpetual royalty stream, the mechanism is operationally heavy and unspecified.

The Scribe Path is a real path, but it's not equal. A Scribe is a partial second-class participant whose participation is harder, smaller-rewarded, and less governance-empowered than a wallet-holder. That's defensible — the Scribe is choosing to refuse crypto — but it should be acknowledged. The document frames the Scribe Path as full participation in the writer-class. It is not.

### 7. Failure mode pre-emption — 8/10

Twelve failure modes addressed in §6, with V2 strengthening five and adding two (cold-start emptiness, AI-generation displacement). Most defenses are specific and structural, not generic.

**Strong defenses.**
- #2 attribution debt: Authorship NFT minted at staking, before review, immutable. Concrete and load-bearing.
- #3 corporate capture: holders own on-chain; contributor escrow held by separate Foundation; IPFS pinning for Hub. Specific.
- #4 trademark: 9-jurisdiction defensive registration, separate Foundation entity holds the marks. Specific.
- #5 platform dependency: data-portability spec as public protocol. Specific.
- #11 cold-start: covered in §5 above. Specific.
- #12 AI-generation: disclose-and-evaluate with five categories, undisclosed-AI as canon-revocation grounds. Specific.

**Generic / weak defenses.**
- #1 founder dependency: defense is "the system runs without the founders." The Resident Author program is named as the structural successor pipeline but the document does not specify what happens if the founder withdraws *during S1-S3*, before any Resident Authors exist and before the contributor seats are filled. The 12-month founder-absent claim is "non-event for T0-T3 users" — but for the *platform's editorial direction*, having only 1 lottery seat and 4 vacancies is not an operational state.
- #7 speculation spiral: defense is "marketing language is collectible-first." This is a cultural commitment, not a structural defense. If a future LoreVault marketing team decides to lead with "earn LORE for contributing!" the constitutional protections do not prevent it. The first-ad-campaign commitment for Series 1 is specific; the ongoing commitment is not.
- #9 bad-actor injection: improved over V1 with the Adversarial Reading Pass and bug bounty, but the underlying mechanism is "scan for known patterns + community-bounty on miss." Sophisticated adversarial content (steganographic ideological payloads, narrative-level dog-whistles that scan past keyword detection) would not be caught by a checklist scan. The defense is honest about being one input to Council deliberation, but the false-negative rate is unknowable from the document.
- #10 fan-base fragmentation: defense is "the Hub is more attractive than leaving." This is a hope, not a structure. SCP's branch-wikis demonstrate that fragmentation happens despite Hub design.

**One missing failure mode: Council deadlock.** The 5-of-8 supermajority on an even-numbered Council can produce stable 4-4 split states on contentious submissions. The document specifies "yes/no/defer" voting but does not specify what happens when 4 vote yes, 4 vote no, and 0 defer. Does the chair break? Default to no? Default to defer? Unspecified. For an even-numbered Council with a contributor-elected seat that may be ideologically distinct from staff, this is a real operational gap.

### 8. The measurable test — 7/10

V2 expands V1's four proxies to five (adding Scribe-class participation) plus an expanded tertiary-signal list and a single-most-important-indicator framing.

**Strengths.**
- Proxies are quantified. Thresholds are numeric.
- "Failing" thresholds are specified, not just "working" thresholds. This is rarer than it should be in design docs.
- The Tier-0.5 (read-only) metric as leading indicator is a sophisticated choice that maps to actual fan-platform behavior.
- Proxy 5 (Scribe participation) is a real measurable test of whether the Scribe Path achieves its design intent.

**Weaknesses.**
- **Threshold defensibility.** "100 organic submissions in S3, 500 in S4, 2,000 in S5, 5,000 in S8" is calibrated to "SCP's two-decade ramp compressed by a factor of 3-5." This is a hand-wave. SCP's compounding is well-documented but the compression-factor is asserted, not derived. A sober analyst would push back: why 3-5x and not 1-2x? LoreVault's pre-existing collector audience is not necessarily a writer audience — Top Shot's 1.6M users have produced approximately zero fan-canon submissions. The "compressed by 3-5x" assumption could be off by an order of magnitude.
- **Proxy 4 thresholds are loose.** "10-20% of new core-canon material originating as fan-promoted contributions by S6" — but core-canon material per cycle is also unspecified. If the Council promotes 5-15 fan submissions per cycle and the staff produces 30 new canon entries, then 5/(5+30) = 14% — within range. But if staff produces 100 new canon entries, the same 5-15 promotions becomes 5-13% — also in range. The metric is a ratio with one number unspecified.
- **No metric for the Adversarial Reading Pass effectiveness.** Bug-bounty catches per cycle (0-3 range) is the proxy, but a low number could mean either "the pass is excellent and few hostile submissions exist" or "the pass is missing things that aren't getting reported." The document acknowledges "zero is suspicious, more than 3 indicates the pass is missing things" — but does not specify the diagnostic action for either case.
- **No metric for false-positive rate on community moderation.** Trust & Safety can over-moderate; this is not measured.
- **Proxy 5 fails to specify what happens in Series 3-4 when the Scribe Path is brand new.** The threshold is "by S5" — but the leading-indicator metrics for S3-S4 Scribe adoption are missing. This delays detection of a Scribe Path failure by 6-12 months.

The measurement framework is adequate for steady-state observation. It is weaker for early-cycle diagnostics, and several thresholds rest on unstated assumptions (compression factors, ratios with unspecified denominators) that a hostile reviewer would push back on hard.

### 9. Token economy coherence — 6/10

This is the document's weakest section in V2 (and was the weakest in V1). The token mechanics are described at the right level of architectural detail, but the *numbers* don't cohere into a sustainable economy.

**The supply/demand gap.**

Supply: 1B LORE, 38% to wallet-contributor rewards over 10 years = 380M LORE for contributions. If Proxy 1 hits 5,000 organic submissions per cycle by S8 (2 cycles per year), that's 10,000/year, or ~70,000 across years 4-10. At 380M / 70K = 5,400 LORE per submission average. But submission categories vary 1x-10x in reward. So a typical short-fiction submission earns ~5,000 LORE, a Pane proposal ~50,000 LORE.

Sinks: submission staking (refunded if accepted), pinning fees, cosmetic upgrades, Council nomination fees. The document explicitly states "the sinks are calibrated so that during normal operation the platform burns LORE at approximately the rate emissions release it" — but no calibration math is shown. The sinks are mostly micro-transactions; the rewards are macro-grants. Burning back 380M LORE through pinning ($X per pin?) and cosmetic frames ($Y per frame?) requires either very high prices or very high volume.

The likely failure mode: sinks underburn, supply inflates relative to use, and the LORE/USD price collapses — at which point the "fixed grant scaled by category (X LORE)" produces shrinking real-dollar rewards for contributors, which violates the "fiat-equivalent bounty for Scribes" structural guarantee (the LORE-USD price drives the equivalence target, and a falling price means Scribes get more fiat than wallet-holders get LORE-USD-equivalent — or wallet-holders feel underpaid relative to Scribes).

The document acknowledges "if burn-rate falls behind, sinks are added; emissions are not increased" — but this is governance-by-discretion, not structural. Adding sinks requires building features whose use is voluntary. If the user base doesn't pin notes, no amount of pinning-feature tweaking burns LORE.

**The Scribe-bounty tension.**

5% to Scribes, 38% to wallet-holders. If Scribes are 20-40% of Tier-3 contributors (Proxy 5 target), per-Scribe rewards are roughly 1/8 to 1/4 of per-wallet-holder rewards. Either:
- Scribes are structurally underpaid for equivalent work (violates the "roughly equivalent to LORE grant at then-current market price" promise), or
- The Scribe path is implicitly designed to remain a small minority despite the Proxy-5 target, or
- Scribe-Bounty allocation needs to scale with Scribe population (mechanism unspecified).

This is a hole.

**The investor-vesting mismatch.**

15% to team and investors, vested over 4 years with 1-year cliff. Phase 1 LORE-token launch is S3 (months 12-18). So team/investor vesting begins at platform launch, runs through year 5. By year 5, all team/investor LORE is unlocked. After year 5, the only sources of new circulating LORE are contribution rewards and treasury spends. Combined with the 10-year emission curve for contribution rewards, this means years 5-10 see contribution-reward emission as the dominant supply source. The economy's stress test is years 5-7, when team unlock has finished but contribution-reward emissions are still significant — and there's no model of price stability during this transition.

**No discussion of LORE/USD volatility's effect on contributor incentives.**

A contributor earning "X LORE" for a short fiction is earning a variable USD amount. If LORE doubles, contribution becomes more attractive and submission volume should rise — but rewards are fixed (per the "adjustable only via constitutional amendment" rule). So volume rises but per-submission scrutiny capacity is fixed (Council shortlist 20-50 per cycle). Conversely, if LORE halves, contributors leave or shift to Scribe Path, and the wallet-holder contributor pool collapses without a structural correction.

**No deflation case.**

The document worries about inflation ("if burn-rate falls behind"). It does not consider the deflation case — sinks burn faster than emissions release. If cosmetic frames are popular, LORE supply could compress faster than emissions, driving price up, making submission staking more expensive in real terms, which throttles new contributors. The document explicitly says "emissions are not increased." So deflationary spiral has no relief valve.

**Overall.** The token mechanics are coherent at the architectural level (the three-layer separation is the right design). They are not coherent at the numerical level. An economist reviewing this document would identify three or four scenarios where the system is unstable and the document offers no structural correction.

### 10. LoreVault-specific differentiation — 6/10

This is the criterion the document fails most cleanly.

**Where the document is LoreVault-specific.**
- The contraband mechanic and its "border crossing" UX framing.
- The Pane structure as the cosmological substrate (declare-your-origin field).
- The "every Pane has a buried weight" doctrine alignment in §5.
- The "shadow Panes" terminology for Pane-proposal outcomes.
- The "doctrine teaches" framing in §5.
- The "Resident Author" name and tone (vs. generic "staff writer").
- References to "axioms," "cosmological substrate," and the doctrine as design source.

**Where the document is generic.**
- The five-tier participation model. Same architecture would work for any collectible-with-fan-content platform — Top Shot fan-fic, Disney Pinnacle fan-canon, sports-card story-extensions. T0/T1/T2/T3/T4 maps trivially.
- The Canon Council structure (8 seats, 2-year staff terms, 5-of-8 supermajority). Generic editorial committee design.
- The token economy (1B fixed cap, 38/20/12/15/10 split, sink mechanics). Could be any Flow-based content platform.
- All twelve failure-mode defenses except trademark-jurisdiction-list are generic. Authorial withdrawal, attribution debt, corporate capture, platform dependency, whale capture, speculation spiral, curation bottleneck, bad-actor injection, fragmentation, cold-start, AI-displacement — these are the failure modes of *every* fan-content platform. The defenses are also generic.
- The Scribe Path. Could be lifted unchanged into any platform's wallet-refusenik design.
- The phased rollout (S1 passive, S2 reader, S3 token, S4 canon). Could be any phased platform launch.

**The thought experiment.** Replace every instance of "Pane" with "Moment" (Top Shot), "LoreVault" with "Top Shot Stories," "contraband" with "highlight-prediction," "axiom" with "rule-clarification." The document still reads as coherent architecture. The doctrine-specific language in §5 would need rewriting; the rest would not.

**What's missing.** LoreVault is described as having multi-pantheon Pane structure. The document does not engage with multi-pantheon governance. Are different Panes governed by sub-Councils? Do contributors specialize in particular Panes? Is there a "Pane Steward" role? The Council promotes content into individual Panes but the architecture treats all Panes as homogeneous from a curation standpoint. This is the place where LoreVault's distinguishing structure should produce specific design decisions, and it doesn't.

**What's also missing.** The doctrine's specific cosmology (the "buried weight," the "border between worlds," the relationship between Panes) is referenced as a metaphor source in §5 but is not reflected in the *governance* structure. A platform whose central doctrine is about *what crosses between worlds* should have governance designs that reflect inter-Pane permeability — promotion across Panes, contraband-flow tracking between Panes, Pane-specific contraband rules. The Council promotes into "the affected cards" without distinguishing Pane-internal vs. Pane-crossing contributions.

If the prompt's challenge — "could this document be rebranded for any collectible platform?" — were applied honestly, the answer is: §1, §2, §3, §4, §6, §7 could be rebranded. §5 (contraband mechanic) is genuinely LoreVault-specific. §8 is partially specific. The architecture is 70% generic-collectible-platform, 30% LoreVault-doctrine-specific.

That's not necessarily bad — generic patterns work for a reason — but the document oversells its specificity to LoreVault.

---

## Summary table

| Criterion | Score |
|---|---|
| 1. Specificity of decisions | 8/10 |
| 2. Passive-first constraint | 9/10 |
| 3. The Contraband Mechanic | 7/10 |
| 4. Anti-capture robustness | 7/10 |
| 5. Cold-start practicality | 9/10 |
| 6. Non-crypto accessibility | 8/10 |
| 7. Failure mode pre-emption | 8/10 |
| 8. The measurable test | 7/10 |
| 9. Token economy coherence | 6/10 |
| 10. LoreVault-specific differentiation | 6/10 |
| **Total** | **78/100** |

**Verdict: CONDITIONAL PASS.**

---

## Top 3 specific weaknesses (must be addressed for V3)

### Weakness 1: Token economy numbers are absent and the system has at least three identified instability scenarios.

§3 specifies the token shape (1B fixed cap, 38/5/20/12/15/10 distribution split, three-layer separation) but does not specify:
- The base LORE grant amount (X) for any submission category.
- The submission-staking base amount or the doubling-curve constants.
- The cosmetic / pinning / nomination prices that drive the burn rate.
- The Scribe-Bounty per-submission amount as a function of LORE/USD price.

Identified instability scenarios not addressed:
- (a) inflation if sinks under-burn (acknowledged, mitigation is governance-by-discretion);
- (b) deflation if sinks over-burn (not acknowledged, no relief valve since emissions are fixed);
- (c) Scribe-vs-wallet-holder reward asymmetry given the 5% vs 38% allocations and the 20-40% Scribe-population target;
- (d) team/investor-unlock-vs-emission-curve transition stress in years 5-7;
- (e) LORE/USD volatility decoupling fixed-LORE rewards from real contributor compensation.

V3 fix: full tokenomics supplement with calibration math, sensitivity analysis on key parameters, and structural correction mechanisms for at least the Scribe-asymmetry and deflation cases.

### Weakness 2: The Contraband Mechanic is a submission UI without a curation state machine.

§5 specifies the five-step submission UI in concrete detail, with examples and field structure. Excellent at the front-end. But the document does not specify:
- The curation queue state machine (what states a submission moves through, who triggers each transition, what UI changes accompany each state).
- The Featured Shelf upvote threshold (what number of upvotes promotes from Hub to Featured Shelf).
- The metadata schema for the Authorship NFT.
- The contributor-edit flow after publication (which collides with the immutable-Authorship-NFT claim if not specified).
- The migration path from Hub-only to Council-shortlisted (opt-in or default).
- The visible-state changes during Adversarial Reading Pass / Council deliberation / blind voting.

An engineer cannot wireframe the curation flow from the document. V3 fix: state-machine diagram for submission lifecycle, metadata schema for Authorship NFTs, and specification of the contributor-edit policy.

### Weakness 3: The architecture is 70% generic-collectible-platform and the multi-pantheon Pane structure is not load-bearing in governance.

§2 / §3 / §4 / §6 / §7 could be rebranded to any Flow-based collectible-with-fan-content platform with minimal changes. The genuinely LoreVault-specific content lives in §5 (contraband mechanic) and the §1 framing references to the doctrine. The document's central claim is that it solves "the participation question for LoreVault," but it largely solves the generic question for any fan-content-collectible platform with a Pane-shaped substrate.

The multi-pantheon Pane structure is named in the prompt and referenced as the cosmological substrate in §5, but it does not produce specific design decisions in governance: no Pane-specific sub-Councils, no Pane-Steward role, no inter-Pane contraband-flow rules, no distinction between Pane-internal and Pane-crossing contributions in the curation rubric. The doctrine-as-cosmology informs the submission UI but does not inform the editorial structure.

V3 fix: explicit treatment of multi-pantheon governance — what is shared across Panes, what is Pane-specific, how Panes interact, and how the doctrine's "border between worlds" framing produces structural rules (not just submission-form metaphors).

---

## Honest summary

V2 is a substantive improvement on V1 and a real architectural document, not a rebranded ecosystem survey. The Scribe Path, the Seeded Hub, the Adversarial Reading Pass, the Resident Author track, the AI-disclosure policy, the tiered staking, and the retcon protocol are all genuine product decisions with specific commitments. The document protects the passive collector seriously and designs for cold-start and crypto-refusenik writers in ways V1 did not.

But it is not yet an implementation spec. The token economy lacks numbers, the curation state machine is gestured at rather than specified, the anti-capture story has one soft spot under sustained adversarial pressure, and the document's claim of LoreVault-specificity is partially true at best. A V3 pass that supplies tokenomics calibration, curation-flow state-machine specification, multi-pantheon governance treatment, and an honest acknowledgment of the $500K-adversary cost-curve would push this to a clean PASS.

Recommend: dispatch for V3 with the three specific patches above. Do not dispatch for full rewrite — the foundation is sound.
