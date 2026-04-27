# Cluster A: SCP Foundation — Fan-Canon Ecosystem Research
**Prepared for:** LoreVault Token-Economy + Participation Architecture  
**Date:** 2026-04-27  
**Analyst:** Research Agent A  

---

## Table of Contents

1. [Ecosystem Overview](#1-ecosystem-overview)
2. [Participation Architecture](#2-participation-architecture)
3. [Quality Control Mechanisms](#3-quality-control-mechanisms)
4. [Reward and Motivation Structure](#4-reward-and-motivation-structure)
5. [Failure Modes](#5-failure-modes)
6. [Original-vs-Derivative Tension](#6-original-vs-derivative-tension)
7. [Token and Monetization Layer](#7-token-and-monetization-layer)
8. [Gate-vs-Onboarding Posture](#8-gate-vs-onboarding-posture)
9. [What LoreVault Should Learn — and What to Avoid](#9-what-lorevault-should-learn--and-what-to-avoid)

---

## 1. Ecosystem Overview

The SCP Foundation is a collaborative fiction project built around a fictional secret organization that "Secures, Contains, and Protects" humanity from paranormal entities, objects, and phenomena. Each "SCP" is documented in a format imitating a classified government containment dossier. The project originated in 2007 on the 4chan /x/ (paranormal) board, where user "Moto42" posted what became SCP-173 — a concrete sculpture that kills anyone who looks away from it. The format's eerie institutional bureaucratic voice spread rapidly.

In July 2008, the community migrated from the EditThis wiki platform to Wikidot after EditThis moved to a paid model. That migration was the pivot that enabled scale: Wikidot's default configuration applied a [Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)](https://creativecommons.org/licenses/by-sa/3.0/) license — which the SCP community adopted almost by accident, but which proved to be architecturally decisive. As described in [the expanded SCP Universe history on Confic Magazine](https://www.conficmagazine.com/post/this-is-considered-normal-the-expanded-history-of-the-scp-universe-chapter-7-the-power-of-wiki), this licensing choice opened the door to derivative games, videos, and adaptations without a permission bottleneck.

### Scale as of Early 2026

- **Content volume:** Over 9,800 mainline SCP entries organized into nine numbered series (SCP-001 through SCP-9999), plus more than 6,300 Foundation Tales (prose short stories set within the universe). New entries are added weekly; the pace is roughly 2–4 new mainlist SCPs per week in recent years.
- **International footprint:** 15+ official language branches including German, Korean, Japanese, Russian, Spanish, Polish, Italian, French, Ukrainian, Portuguese, Czech, Simplified Chinese, Traditional Chinese, Vietnamese, and Thai, each with their own Wikidot wikis producing original-language content. A [SCP-INT (International Translation Archive)](https://scp-wiki.wikidot.com/scp-international) aggregates English translations.
- **Active contributors:** The English-branch wiki has thousands of registered members; the site has been described in a 2022 [American Journalism academic article](https://www.tandfonline.com/doi/full/10.1080/08821127.2022.2064167) as potentially "the largest collaborative work of fiction in history." The [r/SCP subreddit](https://subredditstats.com/r/SCP) has over 316,000 subscribers. The wiki's Discord server and IRC channels host thousands of concurrent daily users.
- **Cultural footprint:** Hundreds of SCP-adjacent video games (SCP: Containment Breach, Secret Laboratory), YouTube essay channels with millions of subscribers, animated series, and tabletop RPG adaptations. The SCP universe has escaped its wiki origins to become a recognized genre of collaborative horror fiction.

---

## 2. Participation Architecture

The SCP Wiki does not operate on an open-wiki model. It uses a **gated membership + open-rated contribution** model that sits between pure open-edit wikis (Wikipedia) and editor-gated publications (traditional fiction magazines).

### Joining the Site

Reading requires no account. Contributing requires joining. The process is:

1. Create a free [Wikidot](https://www.wikidot.com/) platform account.
2. Apply to the SCP wiki specifically — membership is not automatic on account creation.
3. Submit an application that includes a required acknowledgment sentence: "I will follow site rules and respect community members; I acknowledge that submitting AI-assisted/generated content will result in a permanent ban."
4. Wait 2–3 days for staff review. Applications can be denied for username policy violations, associations with adversarial communities, or failure to meet the 18+ age requirement.

Once accepted, a member can vote on any article immediately. However, **posting a new article requires additional pre-flight steps** — see Section 3.

The site has no editor-in-chief or single editorial authority. There is no Linus Torvalds, no George R. R. Martin. Authority is structural, not personal: it lives in the voting system, the deletion rules, and the elected/appointed staff teams. This is the ecosystem's most important architectural feature: **no one person can canonize or un-canonize anything.**

### Canon Architecture: The "Open Continuity" Model

The SCP Foundation formally operates under "open continuity" — the principle that no single narrative is the definitive truth. This is not a loophole or a design failure; it is an explicit design decision. The [Canon Hub page](https://scp-wiki.wikidot.com/canon-hub) encodes this:

- There is no master continuity. Contradictions between articles are expected and accepted.
- Contributors may create named **canons** — clusters of SCPs and Tales sharing characters, locations, and plot — but these canons are mini-continuities, not elevated above the rest.
- To list on the official Canon Hub, a canon must have: at least 10 articles, at least 5 contributing authors, a site tag, a hub page, and must remain open to new contributions.
- Large canons (60+ articles, marked with a star) include: Aces and Eights (Old West setting), AIAD (virtual beings), Broken Masquerade (post-exposure world), End Of Death (consequences when death stops functioning), and approximately 12 others at that scale.

The [Tales layer](https://scp-wiki.wikidot.com/foundation-tales) is the primary off-canon creative space. Tales are prose stories set in the SCP universe that do not follow the clinical containment-document format. They may be standalone, part of a canon cluster, or loose character studies. Tales are subject to the same voting and deletion rules as SCP entries, but they carry no format requirements beyond narrative coherence and quality.

---

## 3. Quality Control Mechanisms

The SCP Foundation's quality control is three-layered: **structural format templates, pre-publication peer review, and post-publication voting with deletion thresholds.**

### Layer 1: The Containment Procedures Template as Quality Scaffold

The SCP article format is a precision instrument for filtering low-effort content before it ever reaches the community vote. A compliant SCP entry must include, in order:

- **Item #:** The SCP designation (e.g., SCP-XXXX)
- **Object Class:** A containment difficulty category (Safe, Euclid, Keter, Thaumiel, Neutralized, Apollyon, and community-created subclasses). Object class selection forces authors to think about threat modeling.
- **Special Containment Procedures:** The operational instructions for keeping the anomaly contained. Must be internally logical, at least 50 words, and written as if by a Foundation employee — not as a narrative. This section requires the author to demonstrate they understand their own concept's implications.
- **Description:** What the anomaly actually is. The bureaucratic clinical voice must be maintained.
- **Addenda (optional):** Supplementary documents, logs, interview transcripts — often where the real narrative hooks live.

This template does several things simultaneously. First, it sets a baseline production cost: it takes genuine effort to produce a syntactically compliant SCP. Second, it enforces tonal consistency — the clinical detachment that defines SCP's distinctive voice is baked into the format. Third, it teaches new writers how to think about the object before they write about it. The [official How To Write an SCP guide](https://scp-wiki.wikidot.com/how-to-write-an-scp) explicitly states: "Containment Procedures should be logical and reasonable." An SCP whose containment procedures don't actually contain the thing described will fail on reader logic — a form of community quality audit.

A minimum word count of 300 words applies to the full article. Content under that threshold can be flagged as low-effort.

### Layer 2: Pre-Publication Peer Review

New contributors who have not yet successfully posted a mainlist article are now required to complete a multi-step pre-publication process:

1. **Ideas and Brainstorming:** Post the core concept to the Ideas Critique forum or IRC/Discord. The concept must receive a "greenlight" from at least two experienced reviewers before proceeding to a full draft.
2. **Sandbox Draft:** Write the full draft on the [SCP Sandbox](https://scp-sandbox-3.wikidot.com/) (a separate Wikidot site). Post a link to the Drafts Critique forum for detailed feedback.
3. **Revision cycle:** Incorporate critique, revise. Repeat until reviewers indicate readiness.
4. **Post to mainsite:** The author then posts directly to the main wiki — there is no approval gate for the post itself, only the pre-post review expectation.

This is a culturally enforced norm rather than a hard technical gate: an author could skip the sandbox process and post directly. But doing so without community readiness signals typically results in rapid downvotes and deletion. The community response is the enforcement mechanism.

### Layer 3: The Voting and Deletion System

Once an article is live on the main site, community voting determines its fate:

- **Any registered member may upvote or downvote any article at any time** for any content-based reason.
- **Vote brigading** (calling for group up- or downvoting) is explicitly prohibited and can result in a ban.
- **Deletion threshold:** If a page's net rating reaches **-10**, it becomes eligible for deletion. A staff member posts a deletion notice in the article's discussion thread.
- **Deletion vote:** Three staff members must vote for deletion, and the deletion notice must have been active for at least 24 hours before the article is removed.
- **Accelerated deletion:** If a page's rating reaches **-20**, the 24-hour timer is suspended and the page can be removed immediately upon three staff votes.
- **Recovery:** If a page recovers to above -10 before three staff votes are cast, all deletion votes are voided and the process must restart.
- **Summary (expedited) deletion** bypasses the standard process for content involving malicious intent, plagiarism, incomplete articles, or rule violations — requiring only the posting staff member plus two witnesses.

This system is documented in full on the [Deletions Guide](https://scp-wiki.wikidot.com/deletions-guide). It creates a crowdsourced quality floor rather than a quality ceiling: anything the community collectively tolerates stays. The deletions system is the immune system of the wiki.

The full governance structure sits within a staff hierarchy of specialized teams. Operational Staff handle day-to-day deletions and moderation. The Anti-Harassment Team handles member conduct. Technical teams handle infrastructure. There is no single admin autocrat — staff roles are distributed and specialized.

---

## 4. Reward and Motivation Structure

The SCP Foundation has no monetary reward structure for contributors. All compensation is reputational, social, and aesthetic.

### The Rating System as Social Currency

Net vote score is the primary status signal. An SCP rated +800 is a cultural landmark. The highest-rated articles become reference points that new contributors aspire to match. Votes are visible, persistent, and public — they function as the community's continuous evaluation of an author's output.

### Author Pages as Portfolio and Attribution

Once a contributor has published at least three articles with a rating of +10 or higher within 24 hours of posting, they earn the right to create an [Author Page](https://scp-wiki.wikidot.com/authors-pages) — a personal hub listing all their works. Author pages are a badge of credibility and serve as CVs within the community. The [Attribution Metadata system](https://scp-wiki.wikidot.com/attribution-metadata) formally records authorship, coauthorship, rewrite credits, and translator credits for every article on the site. This is not a courtesy — it is a structured data layer that ensures attribution survives article rewrites and platform migrations.

### Contests and Recognition

The wiki runs recurring creative writing contests — annual SCP contests with competitive voting, themed "jams" (Halloween, April Fools), and series contests. Winning or placing in a contest confers significant community status. Contest results are archived permanently. Some SCP numbers are reserved for contest winners — holding SCP-4000, SCP-5000, or a milestone number is considered a mark of distinction.

### The Canon-Builder Identity

Contributing to or founding an officially recognized canon (meeting the Canon Hub listing requirements) is its own status marker. Authors who build large canons become identified with those creative universes. This is a form of authorial brand-building within the platform — analogous to being a showrunner for a collaborative story universe.

### What Contributors Do Not Get

- No monetary payment (despite the wiki generating significant ad revenue through its Wikidot hosting)
- No ownership stake in the collective work
- No formal IP rights — all content is CC BY-SA 3.0, meaning derivative works can be made without permission or payment to the original author
- No formal editorial credential that translates outside the community

---

## 5. Failure Modes

### Failure Mode 1: Author Nukes — The "Fishmonger Problem"

The most structurally dangerous failure mode is the **author nuke**: when a prolific contributor, upon being banned or choosing to leave, demands deletion of all their work. The SCP wiki has experienced four major nukes: Fishmonger (2010), Harmony (date approximate), Kalinin (ongoing as of April 2026), and Djoric.

The Fishmonger incident was the original trauma. After being banned in June 2010, the author demanded removal of all articles under threat of legal action. Staff complied. An entire interconnected narrative cluster called "Wanderlust" was deleted, creating narrative holes that fractured multiple canon connections. The incident was directly responsible for the wiki's move toward an open-continuity model — if no central canon exists, no single author's departure can collapse it.

The **Kalinin nuke** became visible in April 2026, with the author requesting deletion of all their works — a move that reignited the longstanding debate (documented in the [Preservation of Important Works forum thread](https://scp-wiki.wikidot.com/forum/t-17018474/discussion-on-the-preservation-of-important-works)) about whether authors should have permanent veto rights over CC-licensed work. The tension is unresolved: CC BY-SA technically permits the community to preserve forks, but wiki norms have historically honored author deletion requests as a matter of community trust.

### Failure Mode 2: Political Schism and the RPC Fork (2018)

In June 2018, the SCP Wiki's official Tumblr posted a Pride Month rainbow version of the SCP logo. A portion of the existing userbase — primarily conservative members who felt the Foundation's institutional-horror aesthetic was incompatible with explicit social signaling — reacted adversarially. Mass downvote brigades targeted articles deemed "too political." Multiple users were banned. Staff responses were inconsistent.

The result was the creation of the [RPC Authority](http://rpcauthority.wikidot.com/) — a competing collaborative fiction wiki built on similar premises but with an explicit no-politics mandate. The RPC Authority attracted both legitimate creative dissidents and a toxic fringe. One prominent RPC editor later sent death threats to an SCP author and photoshopped a decapitation image. The incident illustrated a failure mode common to large creative communities: **political identity elections inside creative spaces produce permanent tribal cleavage**, and the "pure fiction" countermovement is itself a political act that attracts bad actors under cover of neutrality.

### Failure Mode 3: Staff Misconduct and the Dr. Bright/TheDuckman Scandal (2022)

"AdminBright" (user TheDuckman), one of the wiki's founding administrators, was permanently banned on May 8, 2022, for multiple violations of the site's anti-harassment policy — including requesting nude photos from users, engaging inappropriately with minors, and abusing their administrative authority. TheDuckman had been on the Anti-Harassment Team from its inception. The "Things Dr. Bright Is Not Allowed To Do At The Foundation" list — a beloved in-universe humor article attributed to this user — became a site of contested meaning.

The controversy revealed a structural failure: long-tenured administrators had accumulated social capital that insulated them from accountability. Staff had wanted to act earlier but felt trapped by community inertia. The incident is documented extensively on [Tumblr](https://www.tumblr.com/bondsmagii/683757796089593856/you-probably-havent-heard-yet-but-yesterday-dr-bright) and reflects a universal failure mode: **tenure-as-immunity is a governance trap** in volunteer-run communities.

### Failure Mode 4: Platform Dependency — The 2022 Wikidot Blackout

On May 19, 2022, all Wikidot sites went offline due to a hack attributed to a Belarusian individual. The outage was the longest known Wikidot disruption in history. Wikidot subsequently geoblocked Russia and Belarus — a decision that faced [~60% community disapproval](https://www.containmentfiction.net/wiki/wikidot-blackout-of-2022/) in Twitter polling, particularly because it cut off the large Russian SCP branch (SCP-RU) from the platform they had built on.

The blackout demonstrated that hosting the world's largest collaborative fiction project on a single third-party platform — one run by a small team without meaningful community ownership — is a single point of catastrophic failure. The SCP community had no backup, no mirror, and no contractual recourse. Every article, vote, and comment thread was hostage to Wikidot's operational health.

### Failure Mode 5: Vote Drift and Early-Number Privilege

Early SCP articles (low-numbered, written 2007–2012) have disproportionately high ratings partly due to nostalgia, accumulation time, and the fact that they were read by dramatically more people over a longer period. A 2008 article with 15 years of exposure will outperform a technically superior 2023 article simply by demographics. This creates a **frozen hall of fame** that newer contributors can never penetrate through quality alone. The community is aware of this but has no mechanism to correct for temporal rating bias.

---

## 6. Original-vs-Derivative Tension

### The "No Canon" Solution

The SCP Foundation's primary mechanism for managing the original-vs-derivative tension is radical: there is no canonical original to violate. By design, **no article is definitively canon and no article is definitively not canon**. All content on the mainsite is in-universe material; the question of which universe is left deliberately open. This eliminates entire categories of disputes that plague other collaborative fiction communities.

The open-continuity principle is formalized: "Canons in SCP are not universal, and are not always mutually canon to each other." A canon like Project Paragon (created by author djkaktus) can declare itself isolated — no other canons crossover — and this is an authorial choice respected by the community, not a staff decision. Meanwhile, other canons explicitly invite crossover.

### The Tales Layer as Derivative Space

Tales are the designated space for derivative, character-driven, and experimental work that doesn't fit the containment-document format. A Tale can explore Foundation personnel, advance a canon storyline, or write in a style completely at odds with the clinical main-format aesthetic. Tales are rated and deleted by the same mechanisms as SCP entries, so quality control applies — but the format latitude is much wider.

### When Fan Content Becomes "Canon"

Because the SCP Foundation has no central canon authority, there is no mechanism by which fan content "becomes canonical" in the way a TV showrunner might acknowledge fan theories. What happens instead is **community adoption**: if an article receives high ratings, gets cited in other articles, generates Tales, and becomes part of multiple canons, it is functionally canonical through saturation. SCP-173 (the original) is "canonical" because every branch acknowledges it. SCP-682 (the Hard-to-Destroy Reptile) is "canonical" by consensus. But there is no official decree.

What the wiki does have is **the mainsite/sandbox distinction**: only content posted to the main Wikidot site (and surviving the vote threshold) is considered in-universe material. Content that lives only on the sandbox is draft-space — it exists but carries no community endorsement.

### International Branch Tension

Each of the 15+ international branches creates original-language content, not just translations. The Chinese branch (SCP-CN) has its own extensive cosmology and SCP numbering. The Japanese branch (SCP-JP) has articles that don't exist in English. These branches participate in a shared fictional universe but have sovereign creative spaces. Translations to English are aggregated at [SCP-INT](https://scp-wiki.wikidot.com/scp-international); untranslated minor-language branches are catalogued at SCP-UN (Underrepresented Languages Incubator). Branch content does not require English-branch approval, but significant cross-branch references are typically negotiated informally through the community.

---

## 7. Token and Monetization Layer

### The Official Position: CC BY-SA as Anti-Monetization Architecture

The SCP Foundation has no token economy, no official merchandise revenue-sharing, and no authorized monetization pathway for contributors. The CC BY-SA 3.0 license means anyone — contributors, commercial game studios, novelists — can use and profit from SCP material as long as they share-alike. The community has benefited from high-profile adaptations (games, YouTube, merchandise), but contributors receive nothing from these commercial uses.

This was not a deliberate anti-monetization decision at founding — it was an accidental license adoption that became load-bearing. The wiki generates ad revenue through Wikidot's platform (displayed to non-logged-in readers), but this revenue goes to Wikidot, not contributors or staff.

### Unauthorized NFT and Crypto Attempts

There have been several attempts by third parties to overlay Web3 and NFT monetization on the SCP IP:

- Fan-created Solana NFT collections (888 minimalistic pixel NFTs based on SCP characters) were posted to OpenSea. These were unauthorized, exploited the CC BY-SA license's commercial use permission, and received no official community sanction.
- A game project described on [Medium](https://gtmdevelopment.medium.com/nft-in-the-scp-foundation-world-1eb5699f6bd2) attempted to build an SCP-universe game with NFT mechanics.
- "ScPrime" (ticker: SCP) is a decentralized cloud storage cryptocurrency that shares an acronym — it has no connection to the SCP Foundation fiction community despite causing persistent search confusion.

The SCP Foundation's own response to NFT culture came characteristically: **they wrote an SCP about it.** SCP-1337-EX documents a fictional NFT product line (VKTM NFTs) that was discontinued because "these NFTs were effectively worthless the instant they left VKTM's ledger." This is the wiki's editorial mode: absorb, satirize, contain.

No Web3 attempt has gained traction with the core community. The structural reason is that CC BY-SA renders NFT scarcity claims incoherent — if anyone can legally copy and share all SCP content, the "you own this unique SCP" claim is meaningless. The license killed artificial scarcity before crypto arrived.

### The Revenue Vacuum as Community Frustration

The absence of monetization is a persistent low-grade frustration among prolific contributors who see game studios, merchandise producers, and YouTubers profit substantially from their work. There is no mechanism to change this without a mass license migration — which would require the consent of every contributor ever, an impossibility. The wiki is structurally locked into CC BY-SA and the non-monetization consequences are permanent.

---

## 8. Gate-vs-Onboarding Posture

### Reading: Zero Barrier

The SCP Foundation wiki is entirely publicly readable without an account. Every article, Tale, discussion thread, and forum post is visible to anonymous visitors. There are no paywalls, no preview-only modes, no member-only content sections. The reading experience for a passive consumer is frictionless.

This design choice — possibly accidental, a consequence of Wikidot defaults — is architecturally crucial. The SCP Foundation's massive cultural reach (millions of monthly readers, hundreds of derivative works) was built on **passive consumption being fully free and ungated**. The community of readers vastly outnumbers the community of contributors. Readers become contributors only if they choose to; there is no tax on reading.

### Contributing: Moderate Barrier with Asymmetric Upside

Contributing is meaningfully gated:

1. Account creation (requires age verification, username compliance, application submission, 2–3 day staff review)
2. Application can be denied
3. New contributors are expected (though not technically required) to complete sandbox drafting and peer review before mainsite posting
4. AI-assisted content submission is permanently banned
5. Concept greenlight from two experienced reviewers is required for first-time posters

This is a deliberate friction layer. The community explicitly values the quality signal that comes from contribution difficulty. A wiki where anyone could post anything in seconds would collapse into noise. The gate is calibrated to be **high enough to filter casual vandalism, low enough to not deter genuine creative contributors**.

### The Asymmetry

Passive consumption is costless and fully functional. Participation is optional and requires effort. This asymmetry is the SCP Foundation's most replicable structural achievement: **the audience scales without depending on the contributor community to service it**. Readers do not need to write to enjoy the content. This is identical to LoreVault's binding design constraint.

### The Joining Friction as Historical Artifact

The 2–3 day application review was not always necessary. Early SCP wiki (2007–2010 era) had lower barriers. As the community scaled, the joining process tightened in response to vandalism, sockpuppet accounts, and adversarial intrusions (including RPC-adjacent harassment campaigns). The friction increased reactively rather than proactively. This suggests that LoreVault should design participation barriers prospectively, before scaling forces reactive tightening.

---

## 9. What LoreVault Should Learn — and What to Avoid

### Transferable Patterns (Apply These)

**Pattern 1: Format-as-Quality-Scaffold**
The containment procedures template is a genius quality control mechanism because it does not require human editorial judgment at the entry point — it requires the contributor to demonstrate their own conceptual coherence. LoreVault should design contribution templates (lore entries, artifact descriptions, encounter logs) that force contributors to answer specific structural questions before submission. The template is the first quality filter; it should be non-optional and non-trivial.

**Pattern 2: Voting as the Immune System, Not the Entry Gate**
The SCP model lets anything in (subject to format compliance and pre-review), then uses community voting to cull quality failures after the fact. This is superior to editorial pre-approval because: (a) it scales without a bottleneck, (b) it produces transparent quality signals visible to all, and (c) it distributes editorial judgment across the community rather than concentrating it in gatekeepers. LoreVault's on-chain voting mechanism should be designed as a quality signal that affects display prominence and future curation — not as a binary "in or out" gate. Let content live; let the vote determine its visibility.

**Pattern 3: Open Continuity Prevents Canon Wars**
The SCP Foundation's "no single canon" model is not a cop-out — it is the reason the community has not fragmented over canonical inconsistencies. LoreVault should explicitly design for multi-canon compatibility. Each pantheon cluster (SCP, Lovecraft, Arthurian, etc.) should have internal consistency within its canon hub, but cross-canon crossovers should be legible and acceptable without requiring canonical adjudication. Build a canon-hub system equivalent: named continuities with authorship and tagging, but no hierarchy of authenticity.

**Pattern 4: Attribution as Permanent Infrastructure**
The SCP Foundation's attribution metadata system — tracking authorship, co-authorship, rewrites, and translations in a structured data layer — is underrated. In the CC BY-SA environment, it is the only thing that ties contributors to their work. LoreVault should store attribution on-chain from day one: every contribution should carry an immutable creator record. This is the LoreVault analog of the Author Page system, but with cryptographic permanence that CC BY-SA alone cannot provide.

**Pattern 5: The Sandbox as a Holding Layer**
The sandbox-and-greenlight system creates a credible draft stage that reduces the signal-to-noise ratio on the main site. LoreVault should build a visible "draft/pending" layer for contributions — not just a staging area visible only to contributors, but a publicly browsable space that signals "this is work-in-progress." This allows passive collectors to observe the creative process, giving participation-as-process its own audience value, without polluting the canonical artifact layer.

**Pattern 6: International Branches as Sovereign Creative Spaces**
The SCP international branch model — where each language community creates original work under its own governance, with English translations aggregated separately — is a scalable approach to multi-language creative communities. LoreVault, as a global Web3 platform, should build a similar hub architecture: regional creator communities with their own governance, aggregated at the platform level without homogenization. Branch sovereignty prevents the English-branch-dominance dynamic from suppressing other cultural traditions.

**Pattern 7: Passive Consumption at Zero Cost is the Growth Engine**
The SCP Foundation grew to cultural ubiquity because reading requires nothing. Every barrier to passive consumption is a conversion funnel leak. LoreVault must ensure that passive collectors can hold, view, and enjoy NFT artifacts on day one, with zero participation requirements. Social feeds, lore displays, and collection galleries must work without wallet connection prompts, participation mechanics, or "to view this content, contribute" gates. Participation is upside; passive access is the floor.

---

### What LoreVault Must NOT Do (Failure Modes to Pre-Empt)

**Failure Mode 1: Do Not Give Authors Unilateral Deletion Rights Over Widely-Cited Content**
The SCP Foundation's author nuke problem — where a departing or banned contributor can delete foundational work that dozens of other contributors have built upon — is a structural vulnerability. LoreVault should design contribution terms that, once content is accepted into a canon hub and cross-referenced by other works, transfer at least archival rights to the community/platform. On-chain immutability of core artifacts is one solution. The author retains attribution and credit; the artifact is not erasable. Establish this rule explicitly before contributors build cross-references, not after.

**Failure Mode 2: Do Not Let Social Identity Politics Colonize the Creative Space Without a Clear Moderation Protocol**
The 2018 RPC schism began with a logo change and ended with death threats and a competing wiki. The lesson is not "avoid social signaling" — the lesson is that **signaling without a disciplined moderation protocol for the resulting conflict is an existential risk**. LoreVault should have pre-written moderation policies for identity-adjacent community conflicts before they arise, with clear escalation paths and consistent application. Inconsistent staff responses to the pride logo controversy were the accelerant, not the initial spark.

**Failure Mode 3: Do Not Host Entirely on a Single Third-Party Platform**
The 2022 Wikidot blackout took the entire SCP ecosystem offline without warning and created a geoblocking controversy that cut off an entire language branch (SCP-RU). LoreVault's on-chain architecture naturally distributes some risk, but off-chain metadata, media storage, and community infrastructure must have redundancy baked in from day one. Design for the scenario where any single infrastructure provider disappears or makes unilateral policy decisions. Project Foundation's [Wikijump](https://github.com/scpwiki/wikijump) initiative took years to spin up precisely because the community had not invested in infrastructure sovereignty early.

**Failure Mode 4: Do Not Allow Tenure to Become Immunity**
The Dr. Bright/TheDuckman scandal revealed that founding-member status had become a shield against accountability enforcement. LoreVault's governance should build in explicit review mechanisms for long-tenured community leaders and contributors, regardless of their historical status. Social capital should not insulate from conduct standards. Structurally, this means: anonymous reporting channels, rotating review panels, and a policy that explicitly states founding-member status confers no special immunity.

**Failure Mode 5: Do Not Allow the CC-License Analogy to Trap Contributor Monetization**
The SCP Foundation is permanently locked into a license architecture that prevents contributors from sharing in commercial upside — a slow-burn frustration that is impossible to fix retroactively. LoreVault's on-chain contribution model has an opportunity the SCP wiki never had: to encode royalty flows, resale percentages, and attribution value at the smart contract layer from the beginning. Do not replicate the SCP error of treating monetization as a detail to solve later. On Flow, contributor economics are programmable infrastructure. Treat them as such from day one, even if initial values are small.

---

## Sources and References

- [SCP Foundation Main Wiki](https://scp-wiki.wikidot.com/) — Wikidot-hosted primary site
- [SCP Foundation — Wikipedia](https://en.wikipedia.org/wiki/SCP_Foundation) — Comprehensive overview with history and scale
- [Deletions Guide — SCP Foundation](https://scp-wiki.wikidot.com/deletions-guide) — Definitive rules for voting thresholds and deletion process
- [Canon Hub — SCP Foundation](https://scp-wiki.wikidot.com/canon-hub) — Official list of recognized canons with requirements
- [International Branches Hub](https://scp-wiki.wikidot.com/scp-international) — All official language branches
- [Join the Site Guide](https://scp-wiki.wikidot.com/guide-for-joining) — Membership application requirements
- [How To Write an SCP](https://scp-wiki.wikidot.com/how-to-write-an-scp) — Formal template and quality guidelines
- [Site Rules](https://scp-wiki.wikidot.com/site-rules) — Community conduct rules
- [Attribution Metadata](https://scp-wiki.wikidot.com/attribution-metadata) — Author attribution system
- [Authors' Pages](https://scp-wiki.wikidot.com/authors-pages) — Portfolio system
- [Tales Hub](https://scp-wiki.wikidot.com/foundation-tales) — The off-format creative layer
- [Wikijump GitHub Repository](https://github.com/scpwiki/wikijump) — SCP's Wikidot replacement project
- [Wikijump Blog — October 2025 Updates](https://www.wikijump.org/2025/10/26/wikijump-updates-october-2025/) — Latest migration progress
- [WikiDot Blackout of 2022 — Confic Wiki](https://www.containmentfiction.net/wiki/wikidot-blackout-of-2022/) — Infrastructure failure incident report
- [WikiDot Platform History — Confic Wiki](https://www.containmentfiction.net/wiki/wikidot/) — Platform dependency analysis
- [Expanded SCP History Chapter 7 — Confic Magazine](https://www.conficmagazine.com/post/this-is-considered-normal-the-expanded-history-of-the-scp-universe-chapter-7-the-power-of-wiki) — Wikidot migration and license adoption history
- [On The Preservation of Important Works — Forum](https://scp-wiki.wikidot.com/forum/t-17018474/discussion-on-the-preservation-of-important-works) — Author nuke policy debate
- [Bright's List Deletion Message](https://scp-wiki.wikidot.com/bright-list-deletion-message) — TheDuckman ban aftermath
- [Dr. Bright Ban Discussion — Tumblr](https://www.tumblr.com/bondsmagii/683757796089593856/you-probably-havent-heard-yet-but-yesterday-dr) — Staff misconduct incident
- [RPC Authority Wiki](http://rpcauthority.wikidot.com/) — Political schism fork site
- [BrokenBase / SCP Foundation — TV Tropes](https://tvtropes.org/pmwiki/pmwiki.php/BrokenBase/SCPFoundation) — Community conflict history
- [Fishmonger — Confic Wiki](https://www.containmentfiction.net/wiki/fishmonger/) — First major author nuke incident
- [Canonical Writing and the SCP Foundation — Confic Magazine](https://www.conficmagazine.com/post/canonical-writing-and-the-scp-foundation) — Canon philosophy analysis
- [SCP Foundation — American Journalism Academic Article](https://www.tandfonline.com/doi/full/10.1080/08821127.2022.2064167) — Peer-reviewed study on collaborative fiction scale
- [r/SCP Subreddit Stats](https://subredditstats.com/r/SCP) — Community size metrics
- [Wanderer's Library Hub](https://scp-wiki.wikidot.com/wanderers-library-hub) — Official SCP sister site
- [NFT in the SCP Foundation World — Medium](https://gtmdevelopment.medium.com/nft-in-the-scp-foundation-world-1eb5699f6bd2) — Web3 overlay attempt analysis
- [How To Get Good Feedback — SCP Foundation](https://scp-wiki.wikidot.com/how-to-get-good-feedback) — Pre-publication peer review process
- [Kalinin Twitter/X Reference](https://x.com/YorickEldritch/status/1957483191675072986) — Kalinin nuke event, April 2026
