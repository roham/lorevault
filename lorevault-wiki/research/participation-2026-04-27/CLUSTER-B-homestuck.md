# Cluster B: Homestuck + Andrew Hussie Ecosystem — Fan-Canon Research
**Prepared for:** LoreVault Token-Economy + Participation Architecture  
**Date:** 2026-04-27  
**Analyst:** Research Agent B  

---

## Table of Contents
1. [Ecosystem Overview](#1-ecosystem-overview)
2. [Participation Architecture](#2-participation-architecture)
3. [Quality Control Mechanisms](#3-quality-control-mechanisms)
4. [Reward / Motivation Structure](#4-reward--motivation-structure)
5. [Failure Modes](#5-failure-modes)
6. [Original-vs-Derivative Tension](#6-original-vs-derivative-tension)
7. [Token / Monetization Layer](#7-token--monetization-layer)
8. [Gate-vs-Onboarding Posture](#8-gate-vs-onboarding-posture)
9. [LoreVault Design Lessons](#9-lorevault-design-lessons)

---

## 1. Ecosystem Overview

### What Homestuck Is

[Homestuck](https://www.homestuck.com/) is a multimedia webcomic created by Andrew Hussie, published on [MS Paint Adventures](https://www.mspaintadventures.com/) from April 13, 2009 to April 13, 2016. At over 8,000 pages and approximately 800,000 words of primary text, it stands as one of the longest works of English-language fiction ever published in any medium. It is also one of the most formally experimental: the comic integrated animated Flash shorts, browser-based games, interactive segments, original music albums, and reader-submitted commands into a single continuous narrative.

The work is not primarily a story in the conventional sense. It is a living event. Fans who read it during its active run experienced something closer to a serialized broadcast with real-time community participation than to a novel. Reading a static archive today is categorically different from having been present during updates — a fact the community discusses extensively and that shaped nearly every design choice Hussie made.

### Historical Scale

At its 2011 peak, Homestuck received an average of 600,000 unique visitors per day. By 2015, that figure exceeded 1 million unique visitors daily, placing it among the most-visited literary properties on the internet by any measure. The Homestuck Kickstarter campaign launched in September 2012 was funded by 24,346 backers, raising $2,485,506 — at the time the 6th most-funded Kickstarter campaign of all time — for a game adaptation called [Hiveswap](https://en.wikipedia.org/wiki/Hiveswap).

Fan output during the peak years was extraordinary in volume. By 2020, the [Archive of Our Own](https://archiveofourown.org/) alone hosted over 54,000 public fanworks tagged Homestuck or MS Paint Adventures, placing it consistently in the top 20 fandoms by work count on the platform. DeviantArt, Tumblr, and independent fan sites hosted additional hundreds of thousands of fanart pieces, fan theories, and derivative comics.

### Current Scale (2025–2026)

The [Homestuck Community Census 2025](https://homestuck.net/meta/homestuck-community-census-2025/), conducted in March 2025 with 7,279 usable responses, gives the clearest snapshot of the active community today. Key data points:

- **Demographics**: 50.9% of respondents identified as transgender; 38.8% as bisexual or pansexual; 64.8% from the United States. The fandom skews ages 18–25, with a secondary cluster in the late 20s.
- **Engagement**: 20.4% rated their fandom investment at 7/10; 10.9% at maximum (10/10). The median fell between 6–8.
- **Content creation vs. passive consumption**: 35.6% had created fanart "many times"; 63.4% had created fanart at least once. But 69.9% consumed fan music without ever creating any. Fanfiction creation rates were lower: only 11.5% wrote frequently.
- **Reading platforms**: 37.6% used the community-built [Unofficial Homestuck Collection](https://homestuck.net/), a third-party offline reader, rather than the official site, demonstrating that fan infrastructure routinely outperforms official infrastructure in long-running communities.
- **Discovery**: 23% found the census through the Homestuck Discord, and 17% through Tumblr — confirming a dual-platform community with Discord now dominant for active engagement.

The [SAHCon](https://sahcon.com/) community convention, the [Homestuck.XYZ](https://forum.homestuck.xyz/) fan forum, and [Homestuck: Beyond Canon](https://beyondcanon.com/) (the ongoing official continuation as of 2023) demonstrate a fandom that has shrunk dramatically from its 2012–2015 peak but remains organized and self-sustaining.

---

## 2. Participation Architecture

### Phase 1: Open Submission (2006–2010)

Homestuck began as a genuine reader-collaborative work. The MSPA Forums (which themselves originated from Penny Arcade forum offshoots in 2007, tracing back further to forums for Hussie's earlier webcomic Team Special Olympics) were the primary submission channel. Readers submitted commands — directives for characters to perform — through shoutboxes, then blog comments, then traditional forum posts. Hussie selected which commands to use and illustrated the resulting pages.

A supplementary monetization mechanism existed in parallel: the [Tip Flask](https://mspaintadventures.fandom.com/wiki/Tip_Flask), a donation link through which readers could pay for guaranteed command insertions. An entire sequence of storyline commands was "donation funded" through this mechanism, including the creation of characters who became central to subsequent arcs. This is the earliest documented example of a pay-for-canon-placement model in Homestuck's history.

### Phase 2: Hussie Takes Full Control (2010 onward)

The scale of Homestuck's audience destroyed the viability of open submission. By Act 4 (approximately mid-2010), the volume of reader traffic made soliciting commands logistically impossible. Hussie stopped accepting submitted commands entirely, retaining full narrative authority while acknowledging that he continued to draw inspiration from fan speculation, headcanons, and fanart posted to the forums and later to Tumblr.

This transition is critical: Homestuck's community *felt* participatory long after actual direct participation had been closed. Hussie was extremely visible — writing blog posts, appearing on Tumblr, occasionally acknowledging fan theories — which sustained a sense of co-authorship even without formal mechanisms for it.

### Phase 3: Selective Recruitment from Fandom (2009–2016)

Rather than open contribution, Hussie built a closed production team almost entirely from fandom members. The [Homestuck Music Team](https://en.wikipedia.org/wiki/Music_of_Homestuck) was assembled through an open call posted to the MSPA Forums in 2009. Clark Powell (composer of the Homestuck Anthem) and Toby Fox (who would later create *Undertale*) both entered through this channel. Toby Fox initially submitted piano covers to the forums without being recruited; Hussie noticed them and eventually appointed Fox as production coordinator for the entire soundtrack.

Crucially, once the Music Team was assembled, it was **closed to new members**, even as the music grew to encompass 25+ official albums released through What Pumpkin Records on Bandcamp. This created a two-tier dynamic: a closed inner circle of fan-origin contributors with official authority, and a vast outer community of fans who could only contribute through unofficial parallel projects.

Flash animators, visual artists, and later writers were recruited through similar informal observation — Hussie or existing team members would notice high-quality fan work and extend an invitation. This pattern repeated consistently through the life of the comic. Angela Sham, for example, attracted Hussie's notice through her Homestuck-inspired animation work and was brought on as an animator for the final chapter in 2016.

### Phase 4: Collaborative Extension Projects (2014–2024)

[Paradox Space](http://hs.hiveswap.com/paradoxspace/archive.php), launched April 13, 2014 (Homestuck's fifth anniversary), represented the first attempt at a structured open contribution format. Fan artists and writers could pitch short comics set in the Homestuck universe. These were curated by Hussie and the What Pumpkin team, published on weekdays, and assigned canonicity status of either "Possibly Canon" or "Definitely Not Canon" — never "Definitely Canon." The series ran until approximately 2016, published two physical book collections, and was cancelled when What Pumpkin shifted focus to Hiveswap development.

[Homestuck: Beyond Canon](https://beyondcanon.com/) (originally launched as *Homestuck^2* on October 25, 2019) extended this model to an ongoing official sequel, staffed almost entirely by fans recruited from the fandom. The writing team, art team, and music contributors were all community members who became paid or contracted contributors.

---

## 3. Quality Control Mechanisms

### The Autocratic Core (Active Run: 2009–2016)

During Homestuck's primary run, quality control was simple: Hussie was the sole creative authority. Everything published on MSPA was Hussie's decision. The Music Team worked collaboratively but Hussie retained final say over what appeared in the comic. Flash animators submitted work that Hussie approved or requested revisions on. This is the cleanest possible quality control mechanism — benevolent dictatorship — and it produced an extraordinarily coherent 8,000-page narrative despite involving dozens of contributors.

### The "Ruse of Authorial Homogeneity"

From 2017 onward, as post-canon projects involved larger teams without Hussie's direct control, a deliberate strategy was implemented that the critic Giovanni Hessert termed the "[ruse of authorial homogeneity](https://blog.giovanh.com/blog/2021/09/03/homestucks-ruse-of-authorial-homogeneity/)." All team contributions were presented as unified, undifferentiated output — no individual authorship was credited on individual pages. The `homestuckteam` CuriousCat account operated with deliberate ambiguity about which team member was speaking.

The stated rationale was coherent: if individual contributions were attributed, fans would form factions — accepting some authors' contributions as "true canon" while rejecting others'. Hussie himself endorsed this approach precisely to prevent the fragmentation of his audience.

In practice, this strategy failed. When the CuriousCat account answered questions in ways that implied specific individuals had been consulted — without confirming they had been — the community detected the inconsistency. The account shut down, the strategy's architecture became visible, and it became a scandal rather than a transparent governance feature.

**Key lesson**: quality control by concealment backfires when communities are large enough to notice the seams.

### The MSPA Wiki's Canonicity Framework

The fan-run [MS Paint Adventures Wiki](https://mspaintadventures.fandom.com/wiki/MS_Paint_Adventures_Wiki) developed an independent canonicity taxonomy to manage the proliferating layers of official and semi-official content:

- **Canon**: The webcomic itself and Hiveswap.
- **Dubiously Canon / Dubcanon**: Works sanctioned by Hussie but not confirmed by the main text, including the Epilogues and Homestuck: Beyond Canon.
- **Possibly Canon**: Paradox Space stories that could plausibly fit the timeline.
- **Definitely Not Canon**: Alternate-universe or comedy Paradox Space stories.
- **Non-Canon**: Unauthorized fan content.

This taxonomy was created without official input and is maintained purely by volunteer editors. Overwriting canonical information with unsupported material is treated as vandalism and results in administrative action. The wiki has a dedicated Discord for editorial coordination.

---

## 4. Reward / Motivation Structure

### For Unofficial Fan Contributors

The Homestuck fandom's reward structure for the overwhelming majority of contributors was entirely non-monetary and informal:

- **Social capital on Tumblr**: During 2012–2015, Homestuck dominated Tumblr to the extent that popular fan artists accumulated tens of thousands of followers — significant influence on a platform where follower counts translated directly to audience reach.
- **Attribution through reblog chains**: Tumblr's reblog architecture automatically propagated attribution. A fanart piece could circulate through 50,000 reblogs while still displaying the original poster's name.
- **Community recognition**: Being known as a skilled theorist, artist, or musician within the fandom carried genuine social status. Notable fan musicians whose work was recognized in the community later appeared in the [Land of Fans and Music](https://homestuck-and-mspa-music.fandom.com/wiki/Land_of_Fans_and_Music) collaborative albums — the largest of which (LOFAM4) selected 105 tracks from over 250 submissions across 3 discs.
- **Pathway to official work**: Fan excellence was the primary pipeline into What Pumpkin's paid production. This gave fan contribution real material stakes — visible excellence could become employment.

### For Official Fan-Origin Contributors

Contributors recruited into the What Pumpkin production team received:

- **Credit** (with significant caveats — see Section 5)
- **Payment**: initially low, but What Pumpkin publicly acknowledged [rate increases following the Homestuck Patreon's success](https://www.patreon.com/posts/freelance-rates-31821833)
- **Creative authority**: team members had genuine influence over narrative decisions, particularly on Homestuck^2 and Hiveswap Friendsim

### Kickstarter Canon-Placement Tier

The Hiveswap Kickstarter's reward structure included one of the most remarkable fan-participation monetization experiments documented in fandom history. At the $10,000 tier — the maximum Kickstarter allowed — backers had their original fan troll characters ("fantrolls") canonized in Homestuck itself. Two backers purchased this tier. Their characters, Mierfa Durgas and Nektan Whelan, appeared on [page 5966](https://www.homestuck.com/story/5966), within Act 6 Intermission 5. They were destroyed by Caliborn in the very next panel, because the $100,000 stretch goal that would have guaranteed their survival was never reached. This is simultaneously a stunning demonstration of fandom investment and a wry commentary on the value of bought canonicity.

---

## 5. Failure Modes

### The Multiple Hiatuses and Community Fragmentation

Homestuck's run was interrupted by a series of increasingly long hiatuses, each of which caused measurable community attrition:

- **Year 4 Megapause**: April–June 2013 (two months)
- **Gigapause**: October 16, 2013 to October 16, 2014 (exactly one year, Hussie focused on Hiveswap development)
- **Omegapause**: July 2015 to March 2016 (eight months)

Each hiatus produced a documented pattern: fans who could not consume official content migrated to fan fiction, headcanons, and alternative community narratives. After the Gigapause, a notable fandom complaint emerged that characters felt "out of character" when updates resumed — because a year of alternative fan readings had become normalized in readers' mental models of the characters. The official text then felt like a deviation from "fanon."

The Gigapause also coincided with Tumblr's peak Homestuck penetration, meaning the pause was filled with community-generated content that shaped expectations in ways the official narrative could not fully satisfy.

### The Omegapause and MSPA Forum Collapse

When the Omegapause ended in March 2016, the MSPA Forums — the original community hub — went offline simultaneously, with a message claiming passwords had been compromised. The forums never recovered. This collapsed the primary venue for structured community participation precisely at the moment it might have sustained a post-ending community.

### The Post-Ending Silence (2016–2019)

Homestuck concluded on April 13, 2016 with the animated short [S] ACT 7. What followed was approximately two and a half years of complete authorial silence — no blog posts, no Tumblr activity, no public updates on Hiveswap development. The community called this period the "Hellapause." During this time:

- The fandom dispersed. Tumblr's 2018 adult content ban accelerated this by disrupting the primary platform.
- No official communication explained delays in Hiveswap (which had been funded in 2012 and would not release Act 1 until September 2017).
- What Pumpkin's New York City development office was dissolved in December 2015, with staff fired with minimal warning, an incident that fueled significant distrust of Hussie's management practices.

The silence demonstrated a structural fragility: a community built around a charismatic central author has no redundancy mechanism when that author withdraws.

### The Epilogues Controversy (2019)

The [Homestuck Epilogues](https://mspaintadventures.fandom.com/wiki/The_Homestuck_Epilogues), released April 13–20, 2019, co-written by Hussie with Cephied_Variable (Jennifer Giesbrecht), ctset (V), Lalo Hunt, and Aysha U. Farah, constitute the most damaging single event in Homestuck's post-completion ecosystem. The 190,000-word prose work was labeled "Tales of dubious authenticity" and presented through a dual-path structure ("Meat" and "Candy" timelines) that readers navigated simultaneously.

Specific controversies:

- **Character assassination**: Jane Crocker, previously characterized as warm and grounded, became a fascist espousing demographic replacement rhetoric with no narrative preparation.
- **Representation failures**: Roxy's trans-feminine coding from Homestuck proper was effectively erased; Dirk was written deadnaming her despite earlier approval.
- **Content handling**: Dirk's suicide received graphic depiction with clinical detail; a sexual scene implied between characters with a major age gap caused sustained outrage.
- **The "Definitely Not Canon" evasion**: Authors invited fans to treat the Epilogues as optional and "not their canon" — but simultaneously made the Epilogues a prerequisite for engaging with Homestuck^2, making the disclaimer functionally meaningless.

The community split permanently. A segment of the fandom refused to recognize the Epilogues as any form of canon; another segment engaged intensely with the thematic content; a third segment used the controversy as reason to disengage from Homestuck entirely. Goodreads ratings for the Epilogues cluster heavily at 1 and 5 stars with minimal middle ground.

### Homestuck^2 / Beyond Canon (2019–2023): A Case Study in Governance Collapse

Launched October 25, 2019, alongside a Patreon, Homestuck^2: Beyond Canon began with immediate controversy as a sequel to the polarizing Epilogues. The project's failure mode was not creative but structural:

1. **The Sarah Z incident** (April 2021): YouTube documentarian Sarah Z published a [history of Homestuck](https://www.youtube.com/watch?v=gsM9bQvpt_c) video. What Pumpkin sent a legal threat alleging false and speculative claims — without (by their own subsequent admission) having watched the video. The legal letter was legally meritless. What followed was catastrophic: former What Pumpkin employees contacted Sarah Z with evidence of labor abuses, including staff fired without warning, contributors denied credit for assets they created, and Hussie's confirmation that he had intentionally withheld credit from a former employee who had publicly criticized the company. Multiple contributors were able to point to specific visual assets in released Homestuck games that they had designed without receiving any acknowledgment.

2. **The 1016-day pause**: On December 26, 2020, Homestuck^2 updates ceased. On February 11, 2021, What Pumpkin announced the comic would be completed privately and released as a block. No further updates on progress were made public for the next two and a half years. The Patreon stopped charging. This silence — 1,016 days — surpassed even the Hellapause as the longest pause in Homestuck history.

3. **Hussie's withdrawal as director**: During this pause, Andrew Hussie formally stepped down from directing Homestuck^2. The project continued without its creator.

4. **2023 relaunch**: On October 8, 2023, musician and longtime Homestuck collaborator James Roach announced that he had been handed creative control, assembled a new team (including co-directors Miles and Kim Quach and production manager Annie "Chumi" Lee), and resumed updates under the renamed title *Homestuck: Beyond Canon*. A new website launched in March 2024 at [beyondcanon.com](https://beyondcanon.com/). Reception was cautiously positive.

### Authorial Homogeneity Collapse

The "ruse of authorial homogeneity" (described in Section 3) failed specifically when the CuriousCat community Q&A account began answering questions that implied individual consultations had occurred without confirming them. Fans who held grievances against specific team members used this ambiguity to attribute disliked story decisions to specific writers and praised story decisions to others — exactly the factional dynamic the strategy was designed to prevent. The account shut down. The experiment's failure was total.

---

## 6. Original-vs-Derivative Tension

### The "Dubiously Canon" Architecture

Homestuck's approach to the fan-canon boundary is philosophically interesting and practically messy. Hussie introduced the term "dubiously canon" (often abbreviated "dubcanon") to describe works that are official but not confirmed by the main text. This category includes:

- The Homestuck Epilogues (190,000 words, co-written by Hussie)
- Homestuck: Beyond Canon (ongoing official continuation)
- Paradox Space (officially curated fan comics)
- The Snap Stories (Snapchat-published micro-comics)

The framework was intended to free official expansion content from the constraints of "true canon" while still giving it institutional legitimacy. In practice, it created a canonicity spectrum that fans argued about constantly, because the spectrum's edges were never clearly defined. The MSPA Wiki's volunteer editors had to create their own taxonomy (see Section 3) precisely because the official "dubcanon" designation was insufficient.

### Fan Content That Became Official

Several documented mechanisms existed for fan content crossing into official status:

- **Recruitment**: Fan musicians (Toby Fox, Clark Powell, et al.) and fan animators were recruited into the official team, making their future work official by virtue of employment rather than content review. Their *past* fan work retained unofficial status but demonstrated the career pathway.
- **Kickstarter canonization**: The $10,000 Kickstarter tier explicitly sold canon placement for fan characters. Two backers paid; their fantrolls appeared on page 5966 and were destroyed panels later.
- **Paradox Space**: Fan-created scripts and art pitches were accepted, curated, and published as "Possibly Canon" material — the clearest example of a structured fan-to-official pipeline.
- **Hussie's inspirational absorption**: Hussie publicly acknowledged reading fan theories and fanart, and there is strong circumstantial evidence that fan speculation about character identity (particularly LGBTQ+ headcanons for characters like Dave Strider) influenced later canon decisions. The canonization of Davekat (Dave/Karkat as a couple) in 2015 was widely experienced as confirmation of years of fan shipping — and drove an overnight surge in that ship's fandom popularity.

### The "Official Fanonization" Problem

Homestuck^2 was described by some critics as "official fanonization" — the use of official institutional authority to make fan-style speculation canonical, without the craft discipline that characterized Hussie's solo work. Because the team was recruited from fandom, it carried fandom's interpretive preferences (particularly around character identity and shipping) into officially sanctioned content. Fans who disagreed with those preferences experienced this as capture of official canon by a particular fan sub-community.

This is arguably the most important failure mode for any platform that attempts to bridge fan participation and official canon: the transition from contribution to authority is not neutral. Contributors bring their communities' values with them.

---

## 7. Token / Monetization Layer

### No Crypto Layer — But Significant Monetization Experiments

No crypto, NFT, or Web3 layer has been formally integrated into any Homestuck project. A single [OpenSea listing for a "Homestuck #8" NFT](https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/51515914461192586379640806961808404274302561782955359816017739158307601383425) exists as a third-party artifact with no What Pumpkin involvement. A 2022 social media post observed that "no one in Web3 has ever heard of Homestuck apparently" — confirming the absence of any meaningful crypto fandom crossover.

What Homestuck *did* implement was a sequence of monetization experiments that map instructively onto the design space Web3 projects later attempted to occupy:

### The Tip Flask (2007–2010): Micropayment-for-Canon-Influence

The Tip Flask allowed readers to make donations in exchange for guaranteed command insertions into the story — the earliest implementation of what would now be called a "pay-to-participate" or "token-gated contribution" mechanism. The feature was discontinued because Hussie could not fulfill the large queue of purchased commands. **Lesson**: micropayment participation gates only scale if the redemption mechanism scales with them.

### The Kickstarter (2012): Community Pre-Investment

The $2,485,506 Hiveswap Kickstarter was structured as a community pre-investment in a defined deliverable, with tiered rewards including physical merchandise, early access, cameo appearances, and (at the extreme end) canon character placement. The campaign succeeded dramatically.

The subsequent Hiveswap development, however, took five years (Act 1 released September 2017 vs. the projected 2013 delivery). The original development studio was replaced by What Pumpkin's own team, the NYC office was dissolved, and the game's scope was significantly reduced. Backers received no refunds and limited communication. This represents a canonical case of community investment followed by institutional opacity — the exact scenario that motivated the "why blockchain for accountability" argument in Web3 crowdfunding.

### The Patreon (2019–2021): Subscription Fan Funding

The Homestuck^2 Patreon launched alongside the comic in October 2019, promising monthly free updates plus patron-exclusive bonus pages. The initial response was described as "overwhelming." Specific revenue figures were not made public. When updates halted in February 2021, the Patreon stopped charging, and a retrospective Patreon post announced that freelance rates had been increased across all What Pumpkin projects following the Patreon's success — the most transparent public accounting of how fan subscription revenue was distributed to contributors.

The Patreon model worked financially but collapsed under the weight of the creative and reputational crises surrounding Homestuck^2. **Lesson**: subscription fan funding is highly sensitive to trust maintenance; a single reputation event can terminate a functional revenue stream.

### The Fanworks Monetization Policy

What Pumpkin's fan content policy explicitly forbade monetization of unofficial Homestuck works. When the Homestuck music team released an early album with a suggested donation, it was subsequently made free when the policy clarified that even contributors with official connections could not monetize unofficial fan releases. The policy remained restrictive throughout the comic's active run. **Lesson**: restrictive fan monetization policies suppress the creator economy that sustains fandom health during hiatuses.

---

## 8. Gate-vs-Onboarding Posture

### Homestuck Proper: Zero Participation Gate

Homestuck's primary content was always completely free to read with no account requirement, no participation requirement, and no paywall. The MSPA website required no registration. All 8,000+ pages, all music (through [Homestuck's Bandcamp](https://homestuck.bandcamp.com/)), and all game elements were accessible to any visitor.

Participation mechanisms (submitting reader commands, donating to the Tip Flask) were optional additions layered over consumption, not requirements for access. This was structural, not incidental — the reader command system collapsed under the weight of too many participants, not too few.

### Post-Canon Projects: Partial Gates

- **Paradox Space** (2014–2016): Free to read. No participation mechanism at all — fans consumed curated fan-origin content passively. Contribution required submitting a pitch to What Pumpkin; the process was never publicly documented.
- **Homestuck^2 / Beyond Canon** (2019–present): Free to read on the website. The Patreon offered bonus pages behind a paywall, but core updates were always free. The contribution mechanism (joining the creative team) required hiring by What Pumpkin.
- **Fan music** (ongoing): All [Land of Fans and Music](https://unofficialmspafans.bandcamp.com/) albums are free to download on Bandcamp. Contributing required submitting tracks to open calls; LOFAM4 received 250+ submissions and accepted 105.

### The Tumblr Era (2012–2017): Participation-Optional Social Infrastructure

During the Tumblr-dominant years, fandom participation was driven by the platform's reblog mechanism. Tumblr's design made fan creation and curation feel like natural extensions of consumption — you read a post, you reblogged it, you added commentary, you created a response. The barrier between consumption and participation was low enough to feel invisible. This drove extraordinary creative output from people who would not have self-identified as "fan creators."

The 2025 census finding that 69.9% of respondents only consume fan music (never create it) shows that even in a highly creative fandom, the participation pyramid is steep. The ratio likely held during peak years too — millions of Tumblr users encountered Homestuck content while a much smaller number created it.

### The Discord Era (2017–present): Platform Shapes Community

After Tumblr's 2018 adult content ban and the general Tumblr diaspora, Discord became the dominant active-community platform for Homestuck fandom. Discord's architecture differs fundamentally from Tumblr's:

- **Discord**: server-based, conversation-first, ephemeral unless deliberately archived, requires joining to participate
- **Tumblr**: feed-based, artifact-first, persistent and indexable, followable without account creation

The migration to Discord narrowed the community's effective access surface. Discord servers require an action to join; Tumblr's public posts were indexable by search engines and visible to non-logged-in visitors. The census finding that 23% of 2025 respondents discovered the survey through Discord (vs. 17% through Tumblr) reflects the shift — but Discord's participation threshold, while low, is non-zero in a way that public Tumblr tags were not.

The Homestuck fandom's Discord era is also associated with increased moderation controversies, including accusations against the r/homestuck subreddit-linked server of harboring predatory users and reactionary communities — problems that existing Tumblr moderation infrastructure (banning, blocking, public callout culture) had partially contained through different mechanisms.

---

## 9. LoreVault Design Lessons

### Patterns to Implement

**Pattern 1: The Canonicity Spectrum as a Design Primitive**

Homestuck's most durable governance innovation is the canonicity spectrum: a layered system that assigns different degrees of narrative authority to different content types without requiring a binary canon/non-canon judgment. For LoreVault, this translates directly to a multi-tier collectible authenticity system. Items could be classified as: Core Canon (Pantheon-authored), Endorsed Apocrypha (community-vetted expansions), Contextual Lore (community-created, platform-indexed), and Unlicensed Derivative (fan-created, not indexed). Each tier carries different display treatment, rarity signals, and resale behavior — but all tiers are accessible to passive collectors on day one. Critically, Homestuck shows this needs explicit, published rules; the MSPA Wiki had to build the taxonomy themselves because Hussie's "dubcanon" label was insufficient.

**Pattern 2: Excellence Pipeline, Not Open Gate**

Homestuck's contributor recruitment model — observe quality in the wild, extend private invitations — produced an extraordinarily talented production team without a public application process that could be gamed or overwhelmed. For LoreVault, this means tracking which wallet addresses generate the most community engagement, which pieces of contributed lore get the most referencing citations, which independent creators build the largest passive audiences for their work — and extending structured contributor opportunities based on demonstrated merit. Open calls (like Paradox Space pitches or LOFAM submissions) are appropriate for lower-stakes contribution; curated invitations for canon-weight contributions protect coherence.

**Pattern 3: Consumption-First Infrastructure Must Outperform Official Infrastructure**

The 2025 census finding that 37.6% of readers use the community-built Unofficial Homestuck Collection rather than the official website is a direct indictment of institutional infrastructure neglect. What Pumpkin's own site became less reliable than a fan project. LoreVault must treat its read-only collection interface — the thing passive holders use — as the highest-priority surface in the product. Fan-built tools will emerge; if they outperform the official experience, institutional authority migrates to wherever the better experience lives, regardless of who published what.

**Pattern 4: Participation Must Have Accountable Attribution**

The Sarah Z / What Pumpkin credit-denial scandal is a master class in what happens when attribution is treated as optional. Multiple contributors had assets appear in shipped products with zero credit. The "ruse of authorial homogeneity" — designed to prevent canon fragmentation — simultaneously destroyed the attribution record that contributors deserved. LoreVault's on-chain provenance is the solution to this exact problem: contribution records are immutable, attribution cannot be revoked retroactively, and the chain of custody for any piece of lore is permanently visible. This is not a secondary feature — it is the ethical infrastructure that makes community collaboration safe for contributors to trust.

**Pattern 5: Subscription Fan Funding Works, But Trust Is the Only Collateral**

The Homestuck Patreon launched with overwhelming support and collapsed not because the model was wrong but because the product it funded became associated with reputational catastrophe (the Sarah Z incident) and then went silent for nearly three years. LoreVault's revenue model should include passive income streams that do not depend on active participation gates (secondary sales royalties, collection display licensing) precisely because active funding models like Patreon are highly sensitive to trust events that the organization cannot fully control. Treat recurring subscriber revenue as a bonus on top of a passive-consumption revenue base, not as the base itself.

**Pattern 6: Hiatuses Are Existential; Design for Author Absence**

Hussie's disappearances — the Hellapause, the Gigapause, the Omegapause, the post-ending silence — each caused measurable community attrition. The post-ending silence (2016–2019) was the most damaging because it had no defined endpoint. Homestuck's community survived Hussie's absence only because the lore was dense enough to sustain fan theorizing and the social infrastructure (Tumblr, later Discord) was not What Pumpkin property. LoreVault must architect its lore ecosystem to survive its founders' absence: smart contracts that execute autonomously, governance rules encoded on-chain, and a collector community that holds genuine tokens (with genuine value) regardless of whether the founding team is active. The value anchor cannot be authorial presence.

**Pattern 7: Platform Architecture Shapes Participation Rates Structurally**

Tumblr made participation feel like a natural extension of consumption. Discord made it feel like joining a club. The Homestuck fandom's creative output was highest during Tumblr years, when the friction between reading and contributing was close to zero. LoreVault should examine every interaction in its collector interface for friction between passive consumption (viewing, holding) and the lightest tier of participation (curating, tagging, annotating). The participation pyramid is always steep; lower the first step as much as possible. The 2025 census finding that 70% of an active fandom never create anything for it means that for every 7 passive holders, you might get 3 light participants and 1 serious contributor — build the product for all three groups, not just the contributor.

---

### Failure Modes to Pre-Empt

**Failure Mode 1: The Authorial Homogeneity Trap**

If LoreVault assembles a canon-committee from community contributors, resist the temptation to present their decisions as a unified, authorless voice. The Homestuck team's attempt to suppress individual attribution to prevent fan factionalism instead created an opacity crisis that imploded when the ambiguity became detectable. Transparent committee structures — named members, documented vote records, public rationale for canonical decisions — are more resilient than anonymous collective voices. Faction formation is a solvable moderation problem; opacity is an architectural bomb.

**Failure Mode 2: Kickstarter-Style Investment Without Delivery Infrastructure**

The Hiveswap Kickstarter collected $2.5 million from 24,000+ backers, failed to deliver on its original timeline by four years, dissolved its primary development team without refunds or explanation, and triggered an ongoing trust deficit that made every subsequent Homestuck initiative harder to sustain. If LoreVault raises community capital for defined deliverables (expansions, new pantheons, events), it must build delivery accountability into the fundraising structure itself — milestone-locked smart contracts, public burn/delivery addresses, and escrow mechanisms that do not require trusting the founding team's goodwill.

**Failure Mode 3: Letting Fan Sub-Communities Capture Canon Authority**

When Homestuck^2's writing team was assembled primarily from fandom, it imported specific fandom sub-community preferences — particular ships, particular character identity readings, particular narrative preoccupations — into officially sanctioned canon. Fans who held different interpretations experienced this not as creative expansion but as institutional endorsement of one fan faction's headcanons over another's. LoreVault's canon-expansion governance must have structural safeguards against sub-community capture: diversity requirements in contributor pools, community-wide ratification for high-canon expansions, and clear separation between what the canon says and what any community interpretation says.

**Failure Mode 4: The Credit Debt Problem**

What Pumpkin's crediting failures (assets appearing in shipped products without attribution, intentional credit denial as retaliation for public criticism) destroyed institutional trust at a critical moment and directly amplified the Sarah Z video's impact from a minor YouTube incident to a public scandal. For LoreVault, on-chain provenance is the technical solution — but the more important principle is never letting contributor attribution become discretionary. Build a culture where credit is generous, automatic, and irrevocable. The cost of over-crediting is zero. The cost of under-crediting is demonstrated above.

**Failure Mode 5: Participatory Optics Without Participatory Substance**

The most insidious Homestuck pattern was the sustained illusion of participation after direct participation was closed. Hussie remained visible, acknowledged fan theories, and created a sense of co-authorship that persisted for years after reader commands had ended. When the gap between the participation optics and the actual participation architecture became visible — particularly post-2016, when the community had no mechanism to affect anything — the perceived betrayal was disproportionate to the structural change because the structural change had never been communicated. LoreVault must be explicit about what participation actually means at each tier. If a given action does not affect canon, say so. If a vote is advisory rather than binding, say so. Participation theater, discovered late, converts enthusiastic communities into hostile ones.

---

## Sources and References

- [Andrew Hussie — Wikipedia](https://en.wikipedia.org/wiki/Andrew_Hussie)
- [Homestuck — Wikipedia](https://en.wikipedia.org/wiki/Homestuck)
- [Hiveswap — Wikipedia](https://en.wikipedia.org/wiki/Hiveswap)
- [Music of Homestuck — Wikipedia](https://en.wikipedia.org/wiki/Music_of_Homestuck)
- [MS Paint Adventures Wiki — Fandom](https://mspaintadventures.fandom.com/wiki/MS_Paint_Adventures_Wiki)
- [MSPA Wiki: Canonicity](https://mspaintadventures.fandom.com/wiki/MSPA_Wiki:Canonicity)
- [Homestuck: Beyond Canon Wiki Entry](https://mspaintadventures.fandom.com/wiki/Homestuck:_Beyond_Canon)
- [What Pumpkin Studios — Fanlore](https://fanlore.org/wiki/What_Pumpkin_Studios)
- [Homestuck's Ruse of Authorial Homogeneity — GioCities](https://blog.giovanh.com/blog/2021/09/03/homestucks-ruse-of-authorial-homogeneity/)
- [The Sarah Z Video Fallout — GioCities](https://blog.giovanh.com/blog/2021/06/30/the-sarah-z-video-fallout/)
- [Homestuck Sent Me A Legal Threat, And Then It Got Worse — YouTube](https://www.youtube.com/watch?v=gsM9bQvpt_c)
- [Homestuck Developer What Pumpkin Tries to Legally Threaten YouTuber — ResetEra](https://www.resetera.com/threads/homestuck-developer-what-pumpkin-tries-to-legally-threaten-youtuber-and-then-wps-dirty-laundry-of-awful-management-lack-of-crediting-gets-revealed.450442/)
- [The Homestuck Epilogues — MS Paint Adventures Wiki](https://mspaintadventures.fandom.com/wiki/The_Homestuck_Epilogues)
- [The Homestuck Epilogues — TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/Literature/TheHomestuckEpilogues)
- [YMMV: The Homestuck Epilogues — TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/YMMV/TheHomestuckEpilogues)
- [Revisiting the Homestuck Epilogues — enter the spider zone](https://spider.zone/blog/epilogues)
- [Homestuck Community Census 2025 Results — HOMESTUCK.NET](https://homestuck.net/meta/homestuck-community-census-2025/)
- [Paradox Space — MS Paint Adventures Wiki](https://mspaintadventures.fandom.com/wiki/Paradox_Space)
- [Paradox Space Archive](http://hs.hiveswap.com/paradoxspace/archive.php)
- [Hiveswap Kickstarter — MS Paint Adventures Wiki](https://mspaintadventures.fandom.com/wiki/Kickstarter)
- [The Hiveswap Fiasco 2012–2015 — GioCities](https://blog.giovanh.com/blog/2020/10/03/the-hiveswap-fiasco/)
- [Freelance Rates Increase After Patreon Success — Patreon Post](https://www.patreon.com/posts/freelance-rates-31821833)
- [Homestuck Patreon Archive — HOMESTUCK.NET](https://homestuck.net/official/patreon/)
- [Land of Fans and Music — Homestuck and MSPA Music Wiki](https://homestuck-and-mspa-music.fandom.com/wiki/Land_of_Fans_and_Music)
- [Unofficialmspafans Bandcamp](https://unofficialmspafans.bandcamp.com/)
- [History of Homestuck Fan Music — Homestuck and MSPA Music Wiki](https://homestuck-and-mspa-music.fandom.com/wiki/History_of_Homestuck_fan_music)
- [MSPA Reader / Participation — MS Paint Adventures Wiki](https://mspaintadventures.fandom.com/wiki/MSPA_reader)
- [MSPA Forums — MS Paint Adventures Wiki](https://mspaintadventures.fandom.com/wiki/MSPA_Forums)
- [Tip Flask — MS Paint Adventures Wiki](https://mspaintadventures.fandom.com/wiki/Tip_Flask)
- [Toby Fox — Wikipedia](https://en.wikipedia.org/wiki/Toby_Fox)
- [Homestuck: Beyond Canon — beyondcanon.com](https://beyondcanon.com/)
- [Homestuck: Beyond Canon Credits](https://mspaintadventures.fandom.com/wiki/Homestuck:_Beyond_Canon/Credits)
- [A Brief History of Homestuck — Fanlore](https://fanlore.org/wiki/A_Brief_History_of_Homestuck)
- [You Are Now the Other Guy — NYU Confluence](https://confluence.gallatin.nyu.edu/context/independent-project/you-are-now-the-other-guy)
- [Andrew Hussie Declaration of Canon Fan Trolls — DeviantArt](https://www.deviantart.com/homestuck-ocs/journal/Andrew-Hussie-s-Declaration-Of-Canon-Fan-Trolls-268664555)
- [Homestuck Survey and Census Archive — HOMESTUCK.NET](https://homestuck.net/meta/surveys.html)
- [Homestuck Fan Albums — HOMESTUCK.NET](https://homestuck.net/music/albums.html)
- [What's a Homestuck Fandom After the Epilogues? — Women Write About Comics](https://womenwriteaboutcomics.com/2019/12/whats-a-homestuck-fandom/)
- [SAHCon — Online Homestuck Fan Convention](https://sahcon.com/)
- [Homestuck.XYZ Fan Forum](https://forum.homestuck.xyz/)
- [The Absolute State of Homestuck Fandom — Slashedout Neocities](https://slashedout.neocities.org/articles/hsf)
- [The Homestuck Resurgence — Colin Magazine](https://colinmagazine.com/blogs/news/the-homestuck-resurgence-what-how-and-what-does-this-mean)
- [Fandom Statistics — Fanlore](https://fanlore.org/wiki/Fandom_Statistics)
