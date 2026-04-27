# GAP: The Cold-Start Problem

**Gap statement:** V1 assumes participation will emerge from the design and provides metrics for measuring it (Hub volume, read-to-write ratio, cross-references), but does not specify how the platform behaves when participation is at or near zero — Series 1 by definition, Series 2 by likelihood, and Series 3 in the failure case. The synthesis treats Hub silence as a "diagnose and adjust" problem rather than as the default state for which the product must be designed. A participation architecture that only works when participation is already present is not an architecture; it is a hope.

## Why this matters

Three reasons make cold-start the most under-specified scenario in V1:

1. **Cold-start is the actually-likely state.** Series 1 explicitly does not enable submissions. Series 2 enables only Margin Notes. Series 3 is the first cycle where submissions exist at all, and the V1 metric for "working" is 500+ submissions in that cycle. The V1 metric for "failing" is fewer than 200. Both numbers are guesses. The base rate for new fan-content platforms — Disney's Fan Forge clones, DC's various fan portals, the post-Discord-Quest cohort of brand fan-platforms — is closer to 50 quality submissions in a debut cycle, not 500. LoreVault's Series 3 is overwhelmingly likely to under-perform V1's "working" threshold, and the architecture must be robust to that.

2. **Empty-platform failure cascades.** When a fan-canon Hub launches and is sparse, two things happen in sequence: (a) the few contributors who do submit see no audience and disengage; (b) the audience that does arrive sees an empty Hub and concludes nothing is happening here. The Wikipedia AfD literature on stub-pages and the [Fandom wiki graveyard](https://community.fandom.com/) — tens of thousands of abandoned wikis with under 50 articles — is the empirical record of this cascade. SCP's first 18 months had this exact problem and survived only because the seed-content was strong enough to anchor return-readers. LoreVault must plan for the same.

3. **The collector experience must not degrade in cold-start.** This is the binding constraint of V1 — passive collectors must be first-class. But V1's S3 design implicitly assumes the Hub is alive when the LORE token launches. If the Hub is empty in S3, the LORE airdrop arrives in a context where there is nothing to spend it on, no submissions to upvote, no Featured Shelf to populate. The token launches into a desert. This is the GRIPNR failure mode dressed in different clothes.

## Analysis

The cold-start problem decomposes into three subproblems:

**(a) Seeding the substrate.** SCP's anchor was the original SCP-173, written before the wiki existed, plus the first ~50 articles by the founding cohort. Homestuck's anchor was Hussie's pre-existing fanbase from Problem Sleuth. RWBY's Fan Forge anchor was the existing show. LoreVault's anchor must be: the staff-produced lore for the 3-5 Panes of S1 and S2, plus a deliberate seeded-contribution layer in S3. The seeded layer is the gap.

**(b) Audience presence.** A participation surface needs an audience before it has contributors. SCP took years to build that audience organically. LoreVault has the Top Shot/Pinnacle template — a collector audience is built first, and that audience becomes the Hub's reader-base. But V1 does not specify how the collector audience is *moved* to the Hub. Tier-0 holders by definition do not visit the Hub. Tier-1 readers might, but only if there is something to read.

**(c) The first 90 days of S3.** When the Hub opens, the first 30 days will have ~10-50 submissions if base rates hold. The next 60 will have 100-300. The "active community" feeling will not exist until day 120 at earliest. The platform must survive — feel alive — during those first 120 days.

## Design recommendations

Five concrete additions to the V1 architecture, all backward-compatible with V1's tier model and token design:

### 1. The Seeded Hub (replace empty-launch with full-launch)

The Fan-Canon Hub must launch in S3 with 200-500 staff-and-commissioned-contributor entries already published, dated to look like they accumulated naturally over the prior cycles. This is the "lived-in world" launch pattern, used by every successful MMO launch since EverQuest. The seeded entries are written by:

- **The founding lore team** (4-5 staff): each contributes 20-30 entries across the existing Panes — short fictions, axiom-extensions, theory-essays. These are clearly attributed as staff but are submitted through the same Contraband interface and earn Authorship NFTs like any contribution.
- **A commissioned cohort of 10-20 fan-writers**, recruited from SCP, Homestuck-survivor, and post-RWBY communities, paid in fiat and LORE for 5-10 entries each. They are real contributors with real Authorship NFTs and become the seeded Tier-3 cohort. Their commissioning is publicly disclosed.
- **A backlog migration from the official Discord/forum theory-channels** in S1 and S2: high-quality theory posts from S2's Tier-2 layer are invited to be ported to the Hub as formal submissions. This produces 50-150 entries at S3 launch with retroactive attribution.

The seeded Hub is not deceptive. It is disclosed, dated honestly, and labeled. But it solves the "empty room" problem on day one of S3.

### 2. The Lore Curator role (paid editorial scout)

A new staff role: a Lore Curator whose job is to read the Hub daily and surface promising submissions to the Featured Shelf during the first 18 months. This is the [Sundance programmer model](https://en.wikipedia.org/wiki/Sundance_Film_Festival) — a human filter that elevates work the algorithmic upvote system would miss in low-volume conditions. The Curator role becomes vestigial as upvote volume grows; in cold-start it is essential.

### 3. Tier-0-to-Hub bridges

V1 says Tier-0 collectors never visit the Hub. This is correct as a non-coercion principle but wrong as a discovery design. Specific bridges that respect the principle:

- **A "read the lore behind your card" link in the gallery.** Each owned card has a one-click navigation to the Hub entries that reference its Pane. This is opt-in pull (Tier-0 user clicks), not push.
- **A monthly "Hub Highlights" email** to all account-holders, opt-in at signup, featuring 3-5 staff-curated entries. Off by default would be ideal; on-by-default with one-click unsubscribe is acceptable.
- **Card flavor-text that plants questions.** Each card's flavor-text, written by staff, can deliberately contain ambiguities or open threads that the Hub answers. This is the [Dark Souls item-description](https://en.wikipedia.org/wiki/Dark_Souls) pattern — the card hints, the Hub answers. Tier-0 collectors who never visit lose nothing; Tier-1 readers who follow the thread find a Hub already populated with answers (because of the seeded layer).

### 4. The "Tier 0.5" silent-engagement layer

Add an instrumentation tier between Tier-0 and Tier-1: users who read Hub pages but do not vote, post, or submit. They do not need a UI tier — but the metric matters. Read-only Hub traffic is the leading indicator of cold-start health. A Hub with 10 submissions and 500 daily readers will eventually grow contributors. A Hub with 100 submissions and 10 daily readers is dying. The metrics dashboard must track Tier-0.5 traffic explicitly and gate S4 advancement on it.

### 5. The Series-3 "warm-up canon promotion" exception

V1 says no canon promotions in S3. This is too conservative for cold-start. Recommend: the Council may promote 1-3 contributions in S3, drawn exclusively from the seeded fan-writer cohort (not staff, not anonymous Tier-3 contributors). This produces 1-3 Canon Marks visible to the entire community as evidence that the promotion path works. The first organic Tier-3 contributors of S4 then submit into a system where they have seen the path actually executed, not described. The risk of premature promotion is far smaller than the risk of an unproven promotion path causing S4 contributors to disengage.

## Adjusted S3 metrics

V1's "500 submissions in S3 = working" threshold should be split:

- **Organic submissions** (non-seeded, non-commissioned): target 100+, fail-threshold 25. This is the real participation signal.
- **Seeded entries**: 200-500 at launch, declining to zero by end of S3. The seeded layer is a launch booster, not a permanent crutch.
- **Hub daily-active readers**: 1,000+ by S3 month 3, 5,000+ by S3 month 6. This is the audience-presence signal.
- **Cross-references**: average 0.5 per organic entry by end of S3 (V1's 2.0 target is correct for S4-5, too aggressive for S3).

The architecture must not pretend cold-start is impossible. It is the default. Designing for it is what separates LoreVault from the Fandom wiki graveyard.
