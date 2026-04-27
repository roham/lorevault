# Cluster E: Tabletop Community / Homebrew Ecosystems — Fan-Canon Research
**Prepared for:** LoreVault Token-Economy + Participation Architecture  
**Date:** 2026-04-27  
**Analyst:** Research Agent E  

---

## Table of Contents

1. [D&D Homebrew (DM's Guild + r/UnearthedArcana)](#1-dd-homebrew-dms-guild--runearthedarcana)
2. [Pathfinder Community Use Policy](#2-pathfinder-community-use-policy)
3. [Critical Role: Homebrew-Becomes-Canon](#3-critical-role-homebrew-becomes-canon)
4. [Magic: The Gathering — Universes Beyond](#4-magic-the-gathering--universes-beyond)
5. [Magic: The Gathering — Custom Card / Fan Set Community](#5-magic-the-gathering--custom-card--fan-set-community)
6. [The One Ring (Free League Publishing)](#6-the-one-ring-free-league-publishing)
7. [Cross-Ecosystem Synthesis: What LoreVault Should Learn and Avoid](#7-cross-ecosystem-synthesis-what-lorevault-should-learn-and-avoid)

---

## 1. D&D Homebrew (DM's Guild + r/UnearthedArcana)

### 1.1 Ecosystem Overview

Dungeons & Dragons homebrew represents arguably the largest single body of community-generated tabletop content in history, split across two very different structural lanes: a commercial marketplace and a free-sharing subreddit.

**DM's Guild** launched in January 2016 as a joint venture between Wizards of the Coast (WotC) and OneBookShelf (operators of DriveThruRPG). It gave third-party creators legal permission to publish 5th Edition D&D content for sale, specifically within WotC's approved campaign settings — Forgotten Realms, Ravenloft, Eberron, Ravnica, Theros, Strixhaven (Arcavios), Spelljammer, and Dragonlance. By 2024 the platform had accumulated an estimated 1.5 million product units sold across its catalog, with DriveThruRPG's broader RPG catalog reaching approximately 8.8 million. A rough corollary of the platform's scale: DriveThruRPG lists 10,719 products that have sold 50–99 copies, versus 1,792 products at the same threshold for DM's Guild — suggesting several tens of thousands of individual DM's Guild titles in existence. Critically, 90% of DM's Guild products have sold fewer than 50 copies, demonstrating that the long tail of hobbyist publishing dominates volume metrics while a small top tier captures most revenue.

**r/UnearthedArcana** (Reddit) operates as the open-access complement: a community subreddit for "complete 5e homebrew" with approximately 317,000 subscribers as of 2024, accepting submissions of monsters, classes, subclasses, spells, magic items, and rules variants. The subreddit has a companion sticky post, "The Arcana Forge," for works-in-progress. Traffic and submission volume spiked sharply after the 2023 OGL controversy (see 1.5 below), as creators lost trust in commercial channels and prioritized open sharing.

**Scale summary (2024):** r/UnearthedArcana ~317k members; DM's Guild tens of thousands of published titles; combined D&D 5e player base estimated at 30–50 million (D&D Beyond registered accounts peaked near 13 million before the 2024 rules edition).

### 1.2 Participation Architecture

DM's Guild operates a **zero-curation open-submission model** with a post-publication community review layer. Any creator can upload a product immediately — there is no editorial pre-approval, no quality gate before publication. The platform relies on:
- **Community ratings and reviews** (star ratings, written feedback) to surface quality
- **Copper/Silver/Gold/Electrum/Platinum seller tiers** based on unit sales to signal track records
- **"Adepts" designation** — a curated cohort of high-quality creators featured in editorial spotlights
- **WotC Staff Picks** — irregular editorial curation of standout community titles

r/UnearthedArcana uses moderator-enforced **completion rules** (no partial drafts in the main feed; WIP content relegated to the Arcana Forge) alongside community upvoting/downvoting as the primary quality signal. Both systems are ultimately market/crowd-curated rather than editorially gated.

A key structural asymmetry: DM's Guild **requires creators to grant WotC and OneBookShelf a permanent, royalty-free license to all content uploaded**. Creators retain copyright but surrender broad exploitation rights. This is a non-negotiable term that many professional creators find unacceptable for original settings.

### 1.3 Quality Control Mechanisms

Quality on DM's Guild is almost entirely crowd-sourced:
- Community ratings and reviews drive discoverability in the Top 100 lists
- "Pay What You Want" (PWYW) titles generate free download volume which boosts review counts, functioning as an informal promotional tier
- The Electrum/Gold/Platinum seller milestones create a credibility ladder visible at a glance
- Formatting community resources (the DM's Guild Creator Resource Pack, community templates using Homebrewery and GMBinder) create informal presentation standards

On r/UnearthedArcana, quality control is handled through:
- Mandatory "complete design" requirement (reduces noise)
- Upvote/downvote sorting that filters visibility
- Comment feedback culture (community members routinely offer balance critiques, typo catches, mechanical analysis)
- Recurring "Community Spotlight" posts aggregating the month's best-received submissions

Neither system has a coherent editorial voice. The DM's Guild has produced work ranging from professional-quality adventures (some of which WotC has promoted in "Best of DM's Guild" compilations) to single-page placeholder files. The subreddit similarly spans rigorous homebrew with detailed playtesting notes to casual single-card submissions. This is an endemic feature of open-submission systems: scale and diversity come at the cost of median quality.

### 1.4 Reward / Motivation Structure

**DM's Guild:**
- **Revenue:** 50% royalty split (creator retains 50%, DM's Guild / WotC splits the remainder). One creator documented earning over $40,000 lifetime as of early 2021; another averaged $2,000/month at peak. However, the majority of titles earn under $500 lifetime. Revenue is real but deeply Pareto-distributed.
- **Attribution:** Creator names are permanently attached to products; the Guild tracks sales history and surfaces top creator names
- **Status:** The seller tier system (Copper → Platinum) creates visible, comparative reputation. Community endorsements and Reddit crossposting generate social capital
- **Access to canon IP:** The key motivator unique to DM's Guild vs. DriveThruRPG — creators get to legally use WotC's trademarked settings, characters, and lore, which is otherwise unavailable to monetized fan content

**r/UnearthedArcana:**
- No monetary compensation exists
- Upvotes, awards, saves, and comment depth are the social currency
- "Community Favorites" Reddit posts and Discord features provide recognition
- High-performing homebrew is sometimes picked up by professional D&D content creators or included in VTT tool sets (Roll20, Foundry) which extends reach
- The subreddit's X/Twitter mirror account ([r/UnearthedArcana on X](https://twitter.com/rUADnDHomebrew)) reshares top posts, amplifying reach beyond Reddit

### 1.5 Failure Modes

**The OGL Crisis (January 2023)** is the defining failure event for this ecosystem and deserves detailed treatment. On January 5, 2023, leaked text of a proposed OGL version 1.1 revealed that WotC intended to:
- De-authorize the original OGL 1.0a (retroactively nullifying licenses under which thousands of third-party products existed)
- Require creators earning over $50,000/year from OGL content to report revenue to WotC
- Require creators earning over $750,000/year to pay royalties to WotC
- Grant WotC irrevocable rights to use any content created under the license

The community response was immediate and severe. Over 66,000 fans signed the [#OpenDnD open letter](https://www.inverse.com/gaming/dnd-dungeons-dragons-ogl-11-homebrew-changes-opendnd) within days. Waves of D&D Beyond subscription cancellations created measurable revenue impact. Major third-party publishers — including Kobold Press, Ghostfire Gaming, and others — announced they would migrate to Pathfinder or develop system-neutral games under a new license.

WotC capitulated on January 27, 2023, releasing SRD 5.1 under an irrevocable Creative Commons license and abandoning OGL 1.1. However, in the same announcement, WotC explicitly prohibited the use of D&D content in NFT or blockchain products — a precedent with direct relevance to LoreVault.

The chilling effect was not fully reversed. Paizo's competing ORC license attracted multiple major publishers. The GRIPNR project — a New Orleans startup that had raised $2.5 million to build a Web3 D&D game where player characters were NFTs stored on-chain — was fatally wounded: the explicit NFT ban in WotC's revised policy, combined with near-zero market traction (only one recorded sale of a Genesis Collection hero as of late 2022), effectively ended the project. Gizmodo characterized the project as "here to ruin D&D"; community reaction was uniformly hostile. See also Section 1.7.

**Moderation capture** represents a second failure mode. Multiple documented incidents describe r/UnearthedArcana and r/dndnext moderators applying uneven standards — removing posts from independent creators while allowing favorited creators to perform identical behaviors, allegedly to protect certain Patreon-driven content relationships. At least one well-documented creator exodus ([DND Unleashed's public post](https://www.dndunleashed.com/home/why-we-no-longer-post-content-on-reddit)) details moderation abuse driving creators off Reddit entirely. This is a commons-governance failure: when volunteer moderators develop partisan relationships with power users, the community's open-access promise erodes.

**Quality drift / "slop inflation":** The absence of an entry gate means that the signal-to-noise ratio on DM's Guild degrades over time. With 90% of titles failing to sell 50 copies, the searchability of genuinely excellent content is increasingly impaired.

### 1.6 Original-vs-Derivative Tension

DM's Guild operates entirely within WotC's derivative space — creators cannot publish original settings or lore. This is a deliberate constraint: the license trade is "use our IP commercially" in exchange for "we can use yours." Creators who want to publish original worlds must use DriveThruRPG under the OGL/Creative Commons SRD, where the tradeoff reverses: no WotC IP usage, but full ownership of original content.

Fan content occasionally achieves semi-canonical status through WotC's "Best of DM's Guild" compilations, but this is editorial spotlighting rather than true canon promotion. The clearest historical example of fan-to-official-canon elevation is Eberron (created by Keith Baker, a fan submission winner from 2002 before DM's Guild existed), but no DM's Guild-era title has been promoted to official WotC canon.

r/UnearthedArcana has no canon pathway. All content remains fan-created. The subreddit's disclaimer is clear: content is community-generated and not affiliated with WotC. Notable homebrew from the subreddit has occasionally been referenced by WotC designers in social media or podcast discussions, but never formally incorporated.

### 1.7 Token / Monetization Layer

The GRIPNR project (2022–2023) is the most fully-realized attempt to overlay a token economy on D&D content. The platform intended players to:
- Own NFT representations of Player Characters (NFT-PCs)
- Have game session records immutably stored on blockchain
- Accumulate NFT-driven value as characters "leveled up" through play

GRIPNR raised $2.5 million and launched a "Genesis Collection." Only one hero sale was recorded in October 2022. The project then faced the dual blow of WotC's NFT ban in January 2023 and near-complete community rejection. The core failure: **community identity rejects financialization**. D&D players do not want to think about the monetary value of their characters during play. The intrinsic, collaborative-narrative value of D&D is actively degraded by introducing speculative asset logic into the play experience.

WotC explicitly responded to this pressure by banning NFTs entirely from its IP ecosystem. Chaosium (Call of Cthulhu) briefly announced an NFT partnership in July 2021 before the market collapsed. DriveThruRPG stated they see no use for NFT technology. The TTRPG industry's signal is clear: **token economics grafted onto play-layer experiences fail completely.**

### 1.8 Gate-vs-Onboarding Posture

DM's Guild is **open-access consumption, gateless publication**. Buyers browse and purchase without account requirements beyond checkout; publication is self-serve with no approval queue. This is near-ideal for passive consumers (download and play) and frictionless for creators.

r/UnearthedArcana is **open-access consumption, moderated publication**. Reading requires no Reddit account; posting requires a Reddit account and adherence to subreddit rules. The Arcana Forge sticky provides a no-stakes space for works-in-progress. Participation is structurally optional and gradational.

Neither platform requires participation to access value. The audience (passive consumers) vastly outnumbers contributors.

---

## 2. Pathfinder Community Use Policy

### 2.1 Ecosystem Overview

Paizo Publishing's Pathfinder system launched in 2009 as a fork of D&D 3.5e's OGL. By positioning itself explicitly as "D&D done right" for fans alienated by 4th Edition, Pathfinder built a community-first brand identity. Pathfinder 2e (2019) and the 2023 Remastered editions extended this approach.

Scale as of 2024: Pathfinder is the clear #2 TTRPG globally by hobby-store sales (ICv2 rankings), trailing only D&D but ahead of Cyberpunk RED, World of Darkness, and Starfinder. The 2023 OGL crisis drove Pathfinder's Core Rulebook to sell eight months' worth of inventory in two weeks, with stock exhausted at Amazon and most major retailers, validating the community goodwill Paizo had built through open licensing.

The **Pathfinder Infinite** community content platform (launched October 13, 2021, on OneBookShelf infrastructure) allows creators to publish paid content using Paizo's IP. The ORC license (released by Paizo and stewarded by Azora Law, a legal firm, rather than Paizo itself — deliberately to prevent future capture by any single publisher) became available in 2023 and attracted Chaosium, Green Ronin, Kobold Press, and dozens of other publishers.

### 2.2 Participation Architecture

Paizo operates a **layered open-license stack** with distinct tiers for different creator needs:

1. **Community Use Policy (CUP):** Allows free, non-commercial fan use of Paizo IP (lore, artwork, terminology) without prior approval. Perfect for wikis, fan sites, YouTube content, convention materials. Automatically applicable; no registration required.
2. **Pathfinder Compatibility License:** Allows commercial third-party products that are "Compatible with Pathfinder" using Paizo trademarks in limited ways.
3. **ORC License:** A system-agnostic, perpetual, irrevocable open gaming license. Not Paizo-owned (owned by Azora Law, transitioning to a nonprofit like the Linux Foundation). This is the long-term successor to OGL 1.0a for the industry.
4. **Pathfinder Infinite Community Content Agreement:** Allows creators to sell paid content using almost all Paizo IP on the Infinite marketplace. Revenue split: 50% creator, 25% platform, 25% Paizo. Content must remain exclusive to the Infinite marketplace and cannot be re-licensed under ORC or Creative Commons.

This layered architecture means a fan wiki, a free adventure, a paid adventure module, and a full commercial third-party rulebook all have a clear, legal, appropriate license path — with no ambiguity about which tier applies.

### 2.3 Quality Control Mechanisms

Pathfinder Infinite uses the same community-rating model as DM's Guild (no editorial pre-approval, post-publication ratings/reviews, seller tiers for discoverability). The Community Use Policy for free content has no quality gate whatsoever — Paizo simply asks that creators display the CUP compliance notice.

The ORC license has no content quality requirements — it governs rights, not standards. Quality control within ORC-licensed products is entirely at the publisher's discretion.

Paizo does maintain its own editorial standards for first-party content: Pathfinder 2e uses an extensive internal playtest and public playtest methodology (open community feedback phases) for core rules and major expansions.

### 2.4 Reward / Motivation Structure

Pathfinder Infinite creators earn 50% revenue on paid products. The ORC license enables creators to build entirely independent commercial enterprises that happen to use Paizo's system, without revenue sharing to Paizo at all. This is a fundamentally more creator-friendly economic structure than DM's Guild:

- DM's Guild: 50% to creator, IP tied to WotC settings, WotC retains broad exploitation rights
- Pathfinder Infinite: 50% to creator, 25% platform, 25% Paizo, IP restricted to Infinite marketplace but Paizo cannot exploit it
- ORC-licensed commercial product: 100% to creator (no royalty to Paizo), full independence, uses Paizo's mechanics under irrevocable license

The CUP provides status and attribution without any monetary exchange. Community recognition, convention presence, and social capital accrue to fan creators under CUP just as they do under Reddit models.

### 2.5 Failure Modes

**The walled garden drift (2023–2024):** Paizo's 2023–2024 license restructuring introduced a tension: Pathfinder Infinite now prohibits releasing content under ORC or other "open licenses." This means the Infinite marketplace is, like DM's Guild, a **closed commercial ecosystem** despite the broader ORC goodwill. Community commentary on EN World described this as Paizo moving "a step closer to WotC's walled garden approach." The CUP remains open for free content, but the commercial pathway now bifurcates: pay into the Infinite ecosystem (closed) or go fully independent (open but requires more infrastructure).

**OGL legacy baggage:** Pathfinder 1e was built on OGL 1.0a. When WotC's 2023 crisis threatened that license, it threatened Pathfinder's entire first-edition content library. Paizo's ORC response solved this prospectively but left historical products in a legally uncertain state if WotC had pursued more aggressive action. The lesson: building on any single licensor's goodwill, even a friendly one, creates systemic fragility.

**Market ceiling:** Despite the 2023 surge, Pathfinder remains firmly #2 in a market where #1 (D&D) commands dramatically disproportionate mindshare. Pathfinder's core rulebook complexity (over 600 pages for 2e) limits its accessible audience.

### 2.6 Original-vs-Derivative Tension

The ORC license draws the cleanest line of any system studied: it is **system rules, not lore/setting, that are licensed**. A publisher can use Pathfinder's rules engine under ORC while building an entirely original world. This allows total lore independence — the "derivative" is mechanical, not narrative. Fan-created Golarion (Pathfinder's official setting) lore is encouraged under CUP for free content but must route through Pathfinder Infinite for commercial content, preserving Paizo's control over monetized use of its world.

Fan content does not become Pathfinder canon. Paizo's Editorial team controls Golarion continuity. The community's role is enrichment and expansion within player groups, not canon contribution.

### 2.7 Token / Monetization Layer

None. Paizo has not explored blockchain or token economies. The Pathfinder community has explicitly rejected WotC's OGL 1.1 in part because it introduced financial reporting requirements — any token layer that creates revenue-reporting obligations to a licensor would face similar backlash.

### 2.8 Gate-vs-Onboarding Posture

The CUP requires no registration or application — any creator can use it by displaying the compliance notice. The Infinite marketplace requires an account but imposes no editorial gate on publication. The ORC requires adoption in product documentation but no application to Paizo. **The entire Pathfinder licensing stack is explicitly designed to minimize friction at every tier.** This is the deliberate philosophical contrast to WotC's historically restrictive approach, and it is a core brand differentiator.

---

## 3. Critical Role: Homebrew-Becomes-Canon

### 3.1 Ecosystem Overview

Critical Role began on March 12, 2015 as a live-streamed D&D campaign by a group of professional voice actors on Geek & Sundry's Twitch channel. The game master, Matthew Mercer, ran the campaign in Exandria — his original homebrew setting, developed across years of personal home games before the stream began. By 2019 Critical Role had spun off into Critical Role Productions, an independent media company. As of 2024, the Twitch channel has 1.47 million followers, the YouTube channel has accumulated over 188 million annual views (125% growth since 2019), and the company generated $9.6 million in direct Twitch payouts during a 24-month period ending September 2021 (per the leaked Twitch data). Critical Role launched its own streaming platform, Beacon, in May 2024.

The fan community has produced an extraordinary volume of secondary content: the Critical Role Wiki (Fandom) and the independent Encyclopedia Exandria (Miraheze, launched June 2022) with over 5,347 articles and 83 new mainspace articles created in March 2024 alone. Fan art, fan fiction, fan-run games set in Exandria, and statistical analysis communities (CritRoleStats, active through January 2024; succeeded by The Omen Archive) all emerged organically.

### 3.2 Participation Architecture

Exandria is a **single-author canon with a licensed derivative tier.** Matthew Mercer is the canonical authority for Exandria. Critical Role Productions holds IP rights. Fan content is welcomed culturally but has no formal participation pathway into canon. The ecosystem is:

- **Core canon:** Critical Role campaigns (Campaigns 1–4 as of 2024), published sourcebooks, and Critical Role Productions' own media (animated series The Legend of Vox Machina on Amazon Prime, comics)
- **Official-adjacent:** Published D&D sourcebooks (Explorer's Guide to Wildemount, Tal'Dorei Campaign Setting Reborn) that codify Exandrian lore into D&D mechanics
- **Fan layer:** Entirely separate, non-canonical, encouraged but not integrated

WotC's Fan Content Policy governs fan use of D&D mechanics. Critical Role Productions has not published a distinct fan content policy; community norms prevail.

### 3.3 Quality Control Mechanisms

Quality control is Mercer's personal editorial authority. The published sourcebooks went through WotC's full playtesting and editorial pipeline (for Explorer's Guide to Wildemount) or Green Ronin's professional editorial process (Tal'Dorei Campaign Setting Reborn). Fan content has no quality gate.

The fan wiki communities (Fandom CR Wiki, Encyclopedia Exandria) have their own citation standards and editorial policies: Encyclopedia Exandria requires episode-timestamp sourced citations for all claims and explicitly does not allow speculation or fan interpretation as article content.

### 3.4 Reward / Motivation Structure

The Critical Role ecosystem does not offer monetary rewards to fan contributors. The reward structure is:

- **For fans:** Belonging, community recognition, social capital within a passionate fandom, and the parasocial satisfaction of deep lore engagement
- **For Mercer/CR Productions:** Fan dedication drives viewership, merchandise revenue, Beacon subscriptions, and Kickstarter/convention success
- **For D&D players who run games in Exandria:** Access to officially published lore (Explorer's Guide, Tal'Dorei Reborn) that their players can reference independently, reducing GM prep burden

The DM's Guild makes setting-neutral Exandria fan content legally awkward (DM's Guild allows WotC settings; Exandria is a CR Productions IP not a WotC IP, so it doesn't qualify). This creates a gap: commercial Exandrian fan content has no clean legal home, which limits the development of a commercial homebrew marketplace around the setting.

### 3.5 Failure Modes

**The "non-official" precursor problem:** The original Tal'Dorei Campaign Setting (2017, Green Ronin) was not official WotC content — it used the OGL but wasn't a WotC publication. This created lore canonicity confusion: players couldn't be certain which elements of 2017 Tal'Dorei were "real Exandria" versus Green Ronin interpretations. Explorer's Guide to Wildemount (2020) resolved this for Wildemount specifically by entering official D&D canon, but Tal'Dorei's status remained mixed until Tal'Dorei Campaign Setting Reborn (2022, Darrington Press, Critical Role's own publishing imprint) superseded the 2017 book with an authoritative CR Productions-owned text.

**Scale vs. intimacy:** Critical Role's growth from home game to global media franchise has created tension in fan communities between long-time "critters" who value the intimate, improvisational origins and newer fans who entered through the animated series. Certain fan community drama around campaign quality perceptions (notably during Campaign 3's divisive reception in some corners of the community) reflects this tension.

**IP complexity at the fan layer:** Because Critical Role sits at the intersection of D&D rules (WotC IP), Exandrian setting (CR Productions IP), and published canon (WotC or Darrington Press IP depending on the book), fan creators face genuinely complex rights questions. A homebrewer wanting to create and sell an Exandrian adventure has no clear legal path.

### 3.6 Original-vs-Derivative Tension

The Critical Role case is the clearest example in the industry of **fan-play becoming professional canon.** The pipeline:

1. Matthew Mercer's home games (private homebrew, early 2000s–2015)
2. Critical Role Twitch stream — homebrew going public but remaining unofficial (2015–2019)
3. Tal'Dorei Campaign Setting (2017) — first publication, OGL-licensed but not WotC official
4. Explorer's Guide to Wildemount (March 17, 2020) — first official WotC publication of Exandrian content, making Exandria the first homebrewed campaign setting to enter official D&D canon since Eberron in 2004
5. Tal'Dorei Campaign Setting Reborn (2022) — CR Productions' own publishing imprint (Darrington Press) issues the authoritative Tal'Dorei sourcebook
6. Critical Role's own animated series and comics extending the canon further

Jeremy Crawford confirmed: Explorer's Guide to Wildemount is "an official Wizards of the Coast product with rules tested by players, developed by the D&D team, and vetted by him." This was not a passive elevation — it required WotC's deliberate editorial decision to adopt Mercer's homebrew as canon, presumably driven by Critical Role's massive audience driving D&D sales.

The academic implication (noted by researcher Emma French) is that actual-play shows have the power "not simply to promote, but also to alter the game product." Viewership scale created the audience leverage that made WotC's canonical adoption commercially rational.

### 3.7 Token / Monetization Layer

None within the Critical Role ecosystem. CR Productions is a private company generating revenue through subscriptions, streaming, merchandise, publishing (Darrington Press), live events, and media deals. The community's parasocial investment is unpaid labor that drives this commercial ecosystem — a model that has not required, and has not attempted, any token intermediation.

### 3.8 Gate-vs-Onboarding Posture

Critical Role content is increasingly behind partial gates: YouTube VODs have historically been free but delayed; live Twitch streams are free; the Beacon platform (2024) gates some content behind a subscription. However, the core product — the actual-play episodes — remains freely accessible at the YouTube level with sufficient patience. Published sourcebooks require purchase. **Participation (fan creation, wiki editing, community forums) has zero gate** and generates the social energy that sustains the ecosystem. The design correctly treats participation as optional enrichment, not a requirement for enjoyment.

---

## 4. Magic: The Gathering — Universes Beyond

### 4.1 Ecosystem Overview

Magic: The Gathering (MtG), created in 1993, is the world's best-selling trading card game with an estimated 40+ million players globally. Universes Beyond (UB) launched officially in 2021 as a sub-brand that crossovers external intellectual property into MtG's card pool. Notable releases include:

- **Warhammer 40,000 Commander decks** (2022)
- **The Walking Dead** Secret Lair (2020, the earliest predecessor)
- **Stranger Things** Secret Lair (2021)
- **The Lord of the Rings: Tales of Middle-earth** (June 2023) — the most commercially successful, reportedly generating over $200 million in sales and becoming the second best-selling MtG set of all time
- **Doctor Who** Commander decks (October 2023)
- **Fallout** Commander decks (2024)
- **Assassin's Creed** booster set (2024)
- **Final Fantasy** (June 2025) — announced as Standard-legal, breaking the previous tournament-format exclusion

Hasbro (MtG's parent company) reported $4.7 billion in revenue for 2025, with MtG explicitly named as the "primary growth engine." UB is central to this growth strategy.

### 4.2 Participation Architecture

Universes Beyond is entirely **publisher-controlled, top-down IP licensing** — the opposite of community participation. Wizards of the Coast negotiates IP licenses with external rights holders (Tolkien Estate, Games Workshop, Bethesda, etc.) and produces the cards internally. No community voting, no fan input, no open-submission pipeline exists.

The companion program **Universes Within** (SLX program) is relevant: for mechanically unique UB cards that players wished to use in settings where non-Magic-IP cards felt aesthetically wrong, WotC created in-universe MtG-flavored reprints approximately six months post-release, available through local game stores. The first SLX cards were distributed in 2022.

### 4.3 Quality Control Mechanisms

Full WotC design, development, and playtesting pipeline. The Lord of the Rings set was praised for thematic coherence — the flavoring of Tolkien's world onto MtG mechanics was widely considered among the most successful set designs in recent history. The quality is high; the controversy is identity, not execution.

### 4.4 Reward / Motivation Structure

None for community. UB is a pure commercial product. The external IP rights holders receive licensing fees (estimated at 15–25% of gross sales based on the observed impact on WotC's operating margins). Royalty costs for LOTR were blamed for a 37–42% decrease in operating margin despite revenue increases, according to Hasbro's own quarterly reporting.

### 4.5 Failure Modes

**The "Fortnitification" problem:** Community critics coined the term "Fortnitification" to describe MtG's perceived drift toward being a platform for IP crossovers rather than a coherent fictional universe. With Hasbro announcing a 3:3 balance (three original-setting sets to three UB sets annually starting 2025), and with UB sets now Standard-legal (a reversal of Mark Rosewater's explicit 2021 promise that UB would never be Standard-legal), community backlash reached "fever pitch" in 2024–2025. MTG fans calling it "the Fortnite of card games" is a brand-degradation signal that should concern any collectible platform designer.

**Profit margin compression:** Despite record revenue, UB's licensing fees compress operating profit significantly. The business model requires ever-larger sales volume to compensate for the margin given to IP licensors.

**Format coherence:** Standard-legal UB means a competitive deck might contain a Tolkien character attacking alongside a Final Fantasy protagonist against a Marvel hero — a narrative incoherence that undermines the card game's worldbuilding investment.

**Non-canon designation as both solution and signal:** In January 2023, Rosewater confirmed UB is "not and never will be canon" to the MtG multiverse. This was meant to reassure fans but instead underscored the ontological problem: UB cards are mechanically real (they have game effects) but narratively nonexistent. For a collectible where lore investment drives emotional value, cards that are "real but not real" create cognitive dissonance.

### 4.6 Original-vs-Derivative Tension

Universes Beyond is not a derivative content issue in the traditional sense — it is **horizontal IP injection** rather than fan creativity. The relevant tension is between the MtG multiverse's internal coherence (Dominaria, Ravnica, Zendikar, Kamigawa etc. as a shared narrative space) and external IPs that do not organically belong to it.

The Universes Within program was the structural solution to this tension: allowing collectors who wanted "canon-feeling" versions of powerful UB cards to obtain them while still enabling UB's commercial reach. It is a genuine design innovation — a parallel-track approach where the same mechanical card exists in two ontological states.

### 4.7 Token / Monetization Layer

Not applicable in the blockchain sense — MtG is itself a collectible with secondary market economics (single card values, booster arbitrage, etc.) that predate crypto by decades. The MtG secondary market (estimated over $1 billion annually) demonstrates that scarcity-based collectible value is viable and durable in tabletop gaming. However, Hasbro has explicitly declined to enter the NFT/blockchain space for MtG, likely understanding that the existing collector economy is the proven mechanism.

### 4.8 Gate-vs-Onboarding Posture

MtG has historically had a complex onboarding posture — the rules are deep, the card pool is enormous (over 27,000 unique cards as of 2024), and the pay-to-compete dynamic of competitive formats is a significant gate. UB lowers a different gate: it uses familiar IP to attract players who might otherwise find MtG's own lore intimidating. But **participation in the creative layer is completely unavailable** — there is no mechanism for community input into card design, set selection, or world-building. Consumption is the only role the community plays.

---

## 5. Magic: The Gathering — Custom Card / Fan Set Community

### 5.1 Ecosystem Overview

Separate from official UB products, MtG has a large and technically sophisticated community of fan designers creating custom cards, custom sets, and even draftable custom booster environments. The primary platforms include:

- **r/custommagic** (Reddit): Hundreds of thousands of members (exact count undisclosed by Reddit's API restrictions post-2023), accepting "every design, from the meme-iest joke cards to the most serious attempts at making something that could be a real Magic card." Posts receive constructive feedback and mechanical critique.
- **Magic Set Editor (MSE):** The foundational desktop tool for card design since the early 2000s. Produces print-quality card images matching official MtG templates. Actively maintained open-source community.
- **MTGCardsmith / MTG.Design:** Web-based card builders for quick mockups; MTGCardsmith has a community forum for sharing and contests.
- **MTGNexus:** A community hub for serious card design, hosting custom set databases and detailed design articles. Runs custom set design communities and design challenges.
- **PlaneSculptors.net:** A platform for hosting draftable custom MtG sets online. Any custom set uploaded here can be drafted by groups with only an invitation link (no account required for players). The platform hosts numerous fully realized sets across genres.
- **Goblin Artisans:** A long-running blog by card design community veterans, several of whom were Great Designer Search (GDS) finalists/winners.

### 5.2 Participation Architecture

The custom MtG card community is **completely open-submission, community-peer-reviewed.** No Wizards involvement, no official recognition pipeline for most work. Participation pathways range from posting a single card on Reddit (seconds of effort) to developing a 300-card fully-balanced draftable set over years on MTGNexus/PlaneSculptors.

The **Great Designer Search** (GDS) is the single official participation pipeline: a multi-stage design competition run by WotC in 2006 (GDS1), 2010 (GDS2), and 2018 (GDS3). Winners and finalists receive internships and eventually full-time employment at WotC. All nine GDS finalists across three competitions were hired; all nine worked on multiple MtG design teams; seven led the design of at least one published set. The GDS is therefore the only proven **fan-to-official-employment** pipeline in the industry — an extreme case study in how community design talent can be formalized into professional roles.

The GDS is not a content contribution pathway (fan designs don't become cards), but a talent identification pipeline. The winner's card designs are not published; their design philosophies and skills are assessed instead.

### 5.3 Quality Control Mechanisms

Custom MtG card design communities have developed sophisticated internal quality standards:

- **Mechanical balance critique:** Comments on r/custommagic and MTGNexus routinely assess mana cost calibration, power-level comparisons to similar official cards, parasitic mechanic design, feel-bad game interactions
- **Templating standards:** The community insists on accurate Oracle text templating (using the precise phrasing conventions WotC uses for mechanics). Cards with incorrect templating are flagged immediately.
- **Set design structure:** MTGNexus and PlaneSculptors require full sets to adhere to design principles: appropriate common/uncommon/rare ratios, thematic coherence, draft environment health
- **Community design challenges:** Regular contests with community judging provide structured feedback

The GDS uses a formal multi-stage assessment: written tests, card design challenges judged by MtG design professionals, elimination rounds with public critique. It is the most rigorous quality filter in the ecosystem.

### 5.4 Reward / Motivation Structure

- **Social capital:** Upvotes, comments, community recognition on subreddits and forums
- **Design skill development:** The discipline of designing to MtG's exacting mechanical standards develops transferable game design skills
- **GDS career pathway:** The only monetary reward in the ecosystem; GDS winners receive WotC employment
- **Community tournaments:** PlaneSculptors enables players to actually draft and play custom sets, providing playtest feedback that is itself a form of recognition for set designers
- **No commercial pathway:** WotC's Fan Content Policy prohibits commercial use of MtG IP. Custom cards cannot be sold. The reward is entirely social and intrinsic.

### 5.5 Failure Modes

**Intellectual property tension:** WotC's Fan Content Policy explicitly prohibits commercial use of MtG IP. Custom card sites (MTGCardsmith, etc.) walk a careful line — they produce card templates that look like MtG but avoid direct trademark infringement. Wizards has historically been tolerant of non-commercial custom card communities but retains the legal right to send cease-and-desist letters. WotC's game designers are also reportedly prohibited from viewing unsolicited card designs (legal protection against "inspired by fan work" claims), creating a formal wall between the community and official design.

**Parasocial exploitation:** The community produces enormous design labor that WotC extracts value from indirectly — design ideas developed in fan communities sometimes appear in official products years later, with no attribution or compensation possible (because WotC designers cannot officially view fan submissions). This is a structural tension that the community tolerates because the alternative (WotC enforcing strict IP against fan tools) is worse.

**Community fragmentation:** The custom MtG design space is split across multiple platforms (Reddit, MTGNexus, PlaneSculptors, MTGCardsmith, MSE forums) with no unified hub. Quality varies dramatically by platform, and there is no cross-platform reputation system.

### 5.6 Original-vs-Derivative Tension

Custom MtG card communities operate in a legally clear but intellectually ambiguous space: the cards use MtG's template, mechanical language, and aesthetic conventions, but the content (mechanics, art, flavor text, world) is original fan creation. The community maintains its own internal canonicity for custom sets (PlaneSculptors hosts dozens of self-contained lore environments) but has no relationship to official MtG canon.

Fan designs becoming canonical cards is not a mechanism that exists. The GDS elevates **people** not **content** — a crucial distinction. The closest fan-to-official content pipeline is the MtG Art Show / Illustration community, where fan artists are occasionally hired for official card illustration commissions, but this is an employment pipeline, not a content-canonization mechanism.

### 5.7 Token / Monetization Layer

None applicable. The community is explicitly non-commercial by necessity (WotC's IP policy). The secondary market for physical MtG cards is a separate phenomenon (official product scarcity driving collector value) that does not interact with custom card creation.

### 5.8 Gate-vs-Onboarding Posture

Completely open access for consumption (browsing custom cards on Reddit or MTGNexus requires no account). Publication requires accounts on respective platforms but no editorial pre-approval. PlaneSculptors explicitly designed its drafting tool so that **players need only an invitation link** — no account, no registration, no gate. The host logs in, generates a link, sends it to players, and draft can begin. This is a model-case for gate-minimal participation architecture.

---

## 6. The One Ring (Free League Publishing)

### 6.1 Ecosystem Overview

The One Ring Roleplaying Game, designed by Francesco Nepitello, is the official licensed TTRPG set in J.R.R. Tolkien's Middle-earth. The game's first edition (2011, Cubicle 7) was succeeded by Free League Publishing's second edition, which launched via Kickstarter on February 11, 2021. The campaign closed March 4, 2021, raising $2,001,783 — at the time, the most successful tabletop RPG core game Kickstarter ever. The campaign hit its $12,000 goal in four minutes and unlocked all 14 stretch goals within 40 minutes of launch.

Free League (Swedish: Fria Ligan) is the same publisher behind Alien RPG, Blade Runner RPG, Twilight: 2000, Dragonbane, and Mörk Borg — a catalog of licensed and original games that has made Free League one of the most respected TTRPG publishers of the 2020s. Free League also published The Lord of the Rings Roleplaying (a 5e-compatible version of the same game world, released May 2023 for groups already fluent in D&D mechanics).

### 6.2 Participation Architecture

The One Ring's participation architecture is **professionally controlled with limited fan contribution channels.** Free League holds the license from Middle-earth Enterprises (MEE) and Tolkien Estate Ltd. The licensing constraints are significantly more restrictive than an OGL/CUP setup:

- Fan content must comply with MEE's and the Tolkien Estate's own IP policies, which have historically been among the most protective of any major fantasy property
- No Pathfinder Infinite-style community content marketplace exists for The One Ring
- No formal community content agreement has been published
- Free League's forum (forum.frialigan.se) hosts an active fan community discussing rules, adventures, and homebrew, but there is no commercial fan-publishing program
- Free League has released free tabletop licenses for its own engine (Year Zero Engine Free Tabletop License, released March 28, 2023), but this covers the mechanical engine only — it explicitly does not grant rights to Tolkien IP

The Year Zero Engine (YZE) FTL is important context: Free League saw the OGL crisis as an opportunity to establish clear, irrevocable licensing for their own system engine. The YZE FTL grants creators "an irrevocable, worldwide, royalty-free right to use the YZE SRD and freely publish their own games based on it." This covers Alien RPG, Blade Runner RPG, Twilight: 2000, Forbidden Lands, etc. — but **explicitly excludes all licensed IP** (Tolkien, Blade Runner, Alien). The mechanical engine is open; the narrative IP is not.

### 6.3 Quality Control Mechanisms

Free League operates with a professional editorial pipeline for all official The One Ring content. The quality of second edition The One Ring is widely praised as a case study in how to design a licensed TTRPG that deeply honors its source material:

- The game's core mechanics (Weariness, Shadow, Fellowship phase, the Hope/Shadow economy) are mechanically novel and specifically designed to evoke the emotional texture of Tolkien's work
- Adventure design emphasizes journey, counsel, and quieter heroism over combat-focused dungeon crawling
- Lore fidelity is maintained through close consultation with the license terms, and the game explicitly sets its timeline in the gap between The Hobbit and The Lord of the Rings, avoiding canonical conflicts with major story events

Fan homebrew exists (Free League's forums have active homebrew threads) but has no editorial oversight. The community self-polices lore accuracy through social norms: Tolkien fandom has unusually deep lore knowledge, and incorrect or anachronistic fan content is quickly corrected by community members.

### 6.4 Reward / Motivation Structure

- **For official contributors:** Professional payment as freelancers or staff; creative prestige of contributing to a beloved IP
- **For fan community:** Social capital within the Tolkien/TTRPG crossover community; Free League's forum is active and welcoming; no monetary reward pathway exists for fan content
- **For players:** The game's design philosophy creates intrinsic narrative satisfaction — the Shadow mechanic makes characters' psychological toll visible, creating emotional investment beyond tactical optimization

### 6.5 Failure Modes

**IP ceiling on community content:** The Tolkien Estate's strict IP management means no commercial fan-publishing ecosystem can develop around The One Ring, even though the game has the audience and enthusiasm to support one. This contrasts sharply with D&D and Pathfinder. Creative fans who might otherwise build a DM's Guild-style economy around Middle-earth content have no legal path.

**Engine vs. IP bifurcation:** The YZE FTL creates an interesting split — designers can build their own games using The One Ring's mechanical DNA (Year Zero Engine) freely, but cannot write commercially for Middle-earth. The community must choose between the mechanics they love and the world they love.

**Tolkien fandom's conservatism:** Tolkien's fan community is unusually lore-conservative. Homebrew that introduces post-LotR content, non-canon races, or worldbuilding inconsistent with the Appendices faces significant pushback. This creates a different quality-control dynamic than D&D's anything-goes homebrewing culture: the community itself enforces canon fidelity more strictly than any editorial body.

### 6.6 Original-vs-Derivative Tension

The One Ring operates in a fully derivative space (Tolkien's world) with no pathway for original content to enter that world's canon. Middle-earth canon is controlled by the Tolkien Estate and the Tolkien Publishing groups; no game or fan contribution has ever been elevated to canonical status. The line is clear and enforced at a legal level that no game publisher can override.

Fan creators who want to publish original content inspired by Tolkien's aesthetic have better luck using the YZE FTL to build an independent game in the vein of The One Ring than attempting to commercially publish Middle-earth content without a license.

### 6.7 Token / Monetization Layer

None. Free League has not explored blockchain or token economics. The Kickstarter crowdfunding model they use is the closest analog — community-pledged capital enabling product development, with reward tiers that echo some token-economy incentive structures (exclusive backer editions, stretch goals, named credits). The Kickstarter for The One Ring 2e is arguably more relevant to LoreVault's design thinking than any blockchain analogy: it demonstrated that an IP with deep fan passion can raise $2 million in a month through pre-commitment mechanics, without any speculative asset layer.

### 6.8 Gate-vs-Onboarding Posture

The One Ring's official content is paid (purchase required). Free League's forum is free to read but requires registration to post. Fan homebrew is shared freely on the forum. There is no participation requirement to play the game or enjoy its content. The Kickstarter model created a **participation-as-investment** incentive (back the campaign to get exclusive content) that is opt-in, not a gate.

Critically, Free League's games are designed to be **complete experiences without community contribution.** The One Ring second edition core rules are a self-contained, fully playable game. Community content is enrichment, not necessity. This is a gold standard for the "passive collectors must work day-1" principle.

---

## 7. Cross-Ecosystem Synthesis: What LoreVault Should Learn and Avoid

### 7.1 Transferable Patterns (5–7 to Adopt)

**Pattern 1: The Layered License Stack (Paizo Model)**
Paizo's multi-tier approach (CUP for free fan use → Compatibility License for commercial use → ORC for system-agnostic publishing → Pathfinder Infinite for marketplace content) demonstrates that a single IP can serve multiple contributor types through a deliberate license hierarchy. Each tier has clear scope, clear obligations, and clear value. LoreVault should design a comparable stack:
- Tier 0: Free fan engagement (no account, no license required for non-commercial creative use)
- Tier 1: On-platform contribution (account required, community content terms)
- Tier 2: Token-eligible content (additional quality gate; attribution minted on-chain)
- Tier 3: Official LoreVault canon consideration (editorial committee review)

The key principle: **every tier must have clear value independently** — creators at Tier 0 shouldn't need Tier 2 to feel validated.

**Pattern 2: Attribute Everything, Exploit Nothing Without Consent (Against DM's Guild's Fatal Clause)**
DM's Guild requires creators to grant WotC unlimited exploitation rights to all uploaded content. This was a significant factor in creator distrust during the OGL crisis. LoreVault must invert this: immutable on-chain attribution means content is permanently associated with its creator, and any secondary use (official canon promotion, LoreVault-produced adaptations) requires explicit consent with defined compensation. Flow blockchain's immutable record layer is uniquely suited to making attribution permanent and trustless.

**Pattern 3: Parallel-Track Ontology for External Contributions (Universes Within Model)**
MtG's "Universes Within" solution — mechanically identical cards that exist in two aesthetic/canonical registers — is directly applicable to LoreVault's multi-pantheon architecture. When content enters from outside the core canon (fan lore, derivative submissions), it can be represented in a "fan layer" and a "canon layer" simultaneously. Players who care about canon coherence engage with the curated layer; expansive fans engage with the wider universe. The layers share mechanical function but have distinct canonical weight. This avoids the "is this real?" cognitive dissonance that plagued UB while still enabling creative range.

**Pattern 4: Consumption-First, Contribution-Optional Architecture (Free League + PlaneSculptors Models)**
The One Ring 2e is a complete game without any community contribution. PlaneSculptors lets players draft custom sets with only an invitation link — zero registration required. Both demonstrate that **the highest-quality passive experience should require nothing from participants**. LoreVault's binding constraint — passive collectors must work day-1 — is validated by every successful ecosystem studied. The moment a platform requires participation to access core value (loot boxes, governance-gated lore, staking requirements for reading), it alienates the majority audience. Participation is the upside; the base product is the product.

**Pattern 5: The GDS Talent Pipeline (Not Just Content Canonization)**
Wizards of the Coast's Great Designer Search didn't canonize fan-designed cards — it hired fan designers. The distinction is crucial. A content canonization pipeline faces quality control challenges (whose content becomes canon?) that a talent pipeline avoids. LoreVault should consider running **design challenges and creative competitions** that identify high-signal contributors for elevated platform roles, editorial committee seats, or paid commissions — rather than trying to canonize raw fan submissions directly. This converts community enthusiasm into institutional capacity without degrading canon coherence.

**Pattern 6: The Irrevocable, Third-Party-Stewarded License (ORC Model)**
Paizo's ORC license is owned by Azora Law, not Paizo, with planned transfer to a nonprofit (Linux Foundation-style). This structure means no single corporate entity can alter the license retroactively. LoreVault's on-chain architecture offers a native equivalent: smart contract governance of contribution terms means the rules governing creator rights are auditable, immutable, and not subject to unilateral revision by LoreVault Productions. The OGL crisis showed what happens when a creative community's entire legal foundation is controlled by one corporation's goodwill. LoreVault should pre-empt this fear by making its creator-rights terms provably immutable.

**Pattern 7: Audience Leverage Creates Canon Gravity (Critical Role Model)**
Exandria became D&D canon because Critical Role's audience was so large that WotC's adoption of Mercer's world was commercially rational. This is a lesson in scale leverage: **community-generated worlds with sufficient audience demand become candidates for official recognition.** LoreVault can build this flywheel deliberately: community lore contributions that attract large reader/collector audiences become natural candidates for LoreVault's editorial committee to evaluate for canon promotion. The platform should track engagement metrics for community contributions as a formal signal in the canonization consideration process, making the elevation path transparent and data-driven rather than opaque.

### 7.2 Failure Modes to Pre-empt (3–5)

**Failure Mode 1: The DM's Guild IP Trap — Don't Require Creators to Sign Over Exploitation Rights**
DM's Guild's requirement that WotC receives a permanent, royalty-free license to all creator-uploaded content is the most corrosive trust-breaker in the ecosystem. It silently taxes every creative act on the platform. During the OGL crisis, this clause became a focal point of community rage. LoreVault must design its content terms so that creators who contribute lore, art, or mechanical content retain meaningful control over secondary exploitation. The on-chain attribution layer should include explicit opt-in consent for any LoreVault use of contributed content beyond display — ideally with smart-contract-enforced revenue sharing if contributed content is licensed or sold.

**Failure Mode 2: The GRIPNR Error — Never Financialize the Play Layer**
GRIPNR raised $2.5 million to put D&D characters on the blockchain and recorded exactly one sale. The lesson is not about blockchain technology — it's about **where the token layer sits**. Financializing the act of play (making game sessions generate NFT-tracked value) destroys the intrinsic narrative investment that makes tabletop experiences meaningful. LoreVault's token layer must sit at the **collector/patronage layer**, not the experience layer. Owning a LoreVault collectible should feel like owning a beautiful physical artifact or a library access pass — not like deploying capital into a game economy. Contributors should be rewarded for creative labor, not for "playing more" in a way that optimizes for token extraction.

**Failure Mode 3: The Universes Beyond Identity Dilution — Protect the Coherent Core**
MtG's community calling it "the Fortnite of card games" is the brand damage that results from allowing external IP injection to outpace original-world investment at a 3:3 ratio. For a multi-pantheon product like LoreVault, the temptation to expand the universe by licensing or incorporating external mythological frameworks is real and commercially attractive. The failure mode is **losing canonical coherence** as the contributor base grows. LoreVault's editorial committee must maintain a documented canon framework that constrains what pantheons, narrative elements, and world-building decisions can be incorporated, regardless of submission volume. Canon coherence is a product feature, not an obstacle to growth.

**Failure Mode 4: The Reddit Moderation Capture — Open Systems Need Governance Accountability**
r/UnearthedArcana's documented pattern of volunteer moderators developing partisan relationships with specific creator-patrons, then using moderator power to suppress competition, is a commons-governance failure that plagues every open community at scale. LoreVault's community layer — whether it's a Discord, a wiki, or an on-platform forum — will eventually face the same dynamic: high-engagement users will seek to capture curatorial power for personal benefit. Pre-empt this by: (a) making moderation decisions logged and auditable; (b) setting term limits for community roles; (c) creating transparent appeal processes; (d) ensuring LoreVault editorial staff retain override authority over any community governance body.

**Failure Mode 5: The Non-Canon Cognitive Dissonance — Resolve the Ontological Status of Fan Content Explicitly and Permanently**
MtG's "non-canon" UB cards that are mechanically real but narratively nonexistent created persistent player confusion and dissatisfaction. DM's Guild has a similar problem: submitted content is "official enough to sell" but not "official enough to matter to WotC's canon." For LoreVault, every piece of content in the ecosystem should have an explicit, visible canonical status — ideally a single clear attribute (e.g., "Community Layer," "Curated Layer," "Core Canon") displayed on all collectibles and lore entries. Ambiguity about whether a piece of lore "counts" erodes both collector confidence and contributor motivation. The answer to "is this real?" should always be unambiguous and discoverable without research.

---

*End of Cluster E Research Dossier*

---

**Sources consulted:**

- [DM's Guild Pay What You Want Analysis — EN World](https://www.enworld.org/threads/pay-what-you-want-on-the-dms-guild-an-analysis-and-explanation.479050/)
- [Wyatt Trull: My DMs Guild Journey, $40,000](https://wyatttrull.com/2021/01/03/my-dms-guild-journey-or-how-ive-made-over-40000-through-dd/)
- [DriveThruRPG / OneBookShelf Overview — Wikipedia](https://en.wikipedia.org/wiki/OneBookShelf)
- [DM's Guild Content Guidelines](https://help.dmsguild.com/hc/en-us/articles/12776909822615-Dungeons-Dragons-Content-Guidelines)
- [DM's Guild Licensing Information](https://help.dmsguild.com/hc/en-us/articles/12776887523479-Dungeon-Masters-Guild-Licensing-Information)
- [Most RPG Products Sell Fewer than 50 Copies — Troy Press](https://troypress.com/most-rpg-products-sell-fewer-than-50-copies/)
- [OGL Controversy Explained — Games Radar](https://www.gamesradar.com/dandds-licensing-controversy-explained-heres-why-you-should-care/)
- [D&D OGL 1.1 Controversy — Inverse](https://www.inverse.com/gaming/dnd-dungeons-dragons-ogl-11-homebrew-changes-opendnd)
- [WotC "We Rolled a 1" — TechCrunch](https://techcrunch.com/2023/01/13/dungeons-dragons-ogl-backlash-wotc/)
- [OGL Controversy — Washington Post](https://www.washingtonpost.com/video-games/2023/01/19/dungeons-and-dragons-open-game-license-wizards-of-the-coast-explained/)
- [Open Game License — Wikipedia](https://en.wikipedia.org/wiki/Open_Game_License)
- [GRIPNR Web3 D&D Game — Decrypt](https://decrypt.co/120084/dungeons-dragons-web3-game-gripnr-nft-ban)
- [NFTs Are Here to Ruin D&D — Gizmodo](https://gizmodo.com/dungeons-dragons-nft-gripnr-blockchain-dnd-ttrpg-1848686984)
- [Gripnr on Web3 Is Going Just Great](https://www.web3isgoinggreat.com/?id=2022-04-08-0)
- [Dungeons & Dragons Wants Nothing to Do With Web3 — Decrypt](https://decrypt.co/119194/dungeons-dragons-web3-nfts)
- [Paizo Licenses Overview](https://paizo.com/licenses)
- [Pathfinder Community Use Policy](https://paizo.com/community/communityuse)
- [Open RPG Creative License — Paizo](https://paizo.com/orclicense)
- [Pathfinder Infinite Community Content](https://www.pathfinderinfinite.com/community_content.php)
- [ORC License — PC Gamer](https://www.pcgamer.com/the-creators-of-pathfinder-have-released-their-own-version-of-dandds-controversial-ogland-it-could-have-a-huge-impact-on-all-tabletop-rpgs/)
- [Key Differences Between D&D and Pathfinder's OGLs — Screen Rant](https://screenrant.com/dnd-ogl-pathfinder-orc-license-differences/)
- [Pathfinder Sales Surge — ComicBook](https://comicbook.com/gaming/news/pathfinder-sales-dungeons-dragons-ogl-1-2/)
- [Pathfinder Sales Boom — Wargamer](https://www.wargamer.com/pathfinder/sales-rise-dnd-ogl)
- [Paizo ORC Despite WotC Retraction — TechRaptor](https://techraptor.net/gaming/news/pathfinder-creators-stay-course-on-orc-license-despite-wotcs-ogl-retraction)
- [Pathfinder Infinite and ORC License — Paizo Blog](https://paizo.com/community/blog/v5748dyo6sig4)
- [Explorer's Guide to Wildemount — Wikipedia](https://en.wikipedia.org/wiki/Explorer's_Guide_to_Wildemount)
- [Critical Role Setting Joins D&D Canon — G33k-HQ](https://www.g33k-hq.com/gaming/critical-role-setting-joins-dungeons-dragons-canon-in-explorers-guide-to-wildemount/)
- [Critical Role — Wikipedia](https://en.wikipedia.org/wiki/Critical_Role)
- [Critical Role Productions — Wikipedia](https://en.wikipedia.org/wiki/Critical_Role_Productions)
- [Critical Role: How a D&D Livestream Became a Media Company — CNBC](https://www.cnbc.com/2025/03/27/critical-role-d-and-d-media-company.html)
- [Universes Beyond — MTG Wiki](https://mtg.fandom.com/wiki/Universes_Beyond)
- [Complete List of MTG Universes Beyond Products — Draftsim](https://draftsim.com/mtg-universes-beyond/)
- [Universes Beyond Standard Legal Change — Game Rant](https://gamerant.com/magic-gatherings-mtg-universes-beyond-sets-standard-legal-good-bad-why/)
- [MTG Players Hate Universes Beyond — The Gamer](https://www.thegamer.com/magic-the-gathering-mtg-players-unhappy-with-universes-beyond-more-crossovers-spongebob-set-releases/)
- [MTG Universes Beyond Fees Blamed for 37% Profit Drop — Wargamer](https://www.wargamer.com/magic-the-gathering/mtg-universes-beyond-profit-drop)
- [Hasbro Quarterly Report: UB Royalties — Commander's Herald](https://commandersherald.com/hasbro-quarterly-report-universes-beyond-royalties-negatively-affecting-growth/)
- [Universes Within — MTG Wiki](https://mtg.wiki/page/Universes_Within)
- [MTG Fans Slam Marvel: "Fortnite of Card Games" — Dexerto](https://www.dexerto.com/magic-the-gathering/mtg-fans-slam-marvel-universes-beyond-collab-the-fortnite-of-card-games-2349103/)
- [Record MtG Success 2025 Hasbro Revenue — Board Game Wire](https://boardgamewire.com/index.php/2026/02/11/record-magic-the-gathering-success-powered-hasbro-to-4-7bn-revenue-for-2025-remains-its-primary-growth-engine/)
- [Great Designer Search — MTG Wiki](https://mtg.fandom.com/wiki/The_Great_Designer_Search)
- [Great Designer Search 2 — MTG Wiki](https://mtg.fandom.com/wiki/The_Great_Designer_Search_2)
- [Great Designer Search 3 — MTG Wiki](https://mtg.fandom.com/wiki/The_Great_Designer_Search_3)
- [How WotC Hired Top Designers via Competition — Popverse](https://www.thepopverse.com/gaming-magic-the-gathering-game-designer-search-mark-rosewater)
- [PlaneSculptors.net](https://www.planesculptors.net/)
- [MTG Set Editor (MSE) Home](https://magicseteditor.boards.net/page/home)
- [MTGNexus Custom Cards](https://www.mtgnexus.com/customcards/)
- [WotC Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy)
- [The One Ring — Free League Publishing](https://freeleaguepublishing.com/games/the-one-ring/)
- [The One Ring Roleplaying Game — Wikipedia](https://en.wikipedia.org/wiki/The_One_Ring_Roleplaying_Game)
- [The One Ring 2e Kickstarter — Kickstarter](https://www.kickstarter.com/projects/1192053011/the-one-ring-roleplaying-game-second-edition)
- [The One Ring 2e Raises Over $2 Million — Tenkar's Tavern](https://www.tenkarstavern.com/2021/03/kickstarter-one-ring-second-edition.html)
- [Free League Open Game Licenses](https://freeleaguepublishing.com/community-content/free-tabletop-licenses/)
- [Free League Year Zero Engine License Launch — Bell of Lost Souls](https://www.belloflostsouls.net/2023/03/free-league-releases-two-free-tabletop-licenses-year-zero-engine-and-dragonbane.html)
- [YZE Free Tabletop License PDF](https://freeleaguepublishing.com/wp-content/uploads/2023/11/Year-Zero-Engine-License-Agreement.pdf)
- [DND Unleashed: Why We No Longer Post on Reddit](https://www.dndunleashed.com/home/why-we-no-longer-post-content-on-reddit)
- [TTRPG Market 2024 Analysis — RPGDrop](https://www.rpgdrop.com/worldwide-ttrpg-market-in-2024-industry-analysis/)
- [Axie Infinity Economy Collapse — Reason](https://reason.com/2022/02/01/the-biggest-nft-video-games-economy-is-collapsing-because-nft-games-dont-work/)
- [TTRPGs, Blockchains, and NFTs — EN World](https://www.enworld.org/threads/ttrpgs-blockchains-and-nfts.686028/)
