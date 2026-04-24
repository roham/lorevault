# LoreVault Multiverse Narrative — Multi-Agent Research & Design Orchestration

**Status**: Executable orchestration spec. Hand to an agent runner (Claude Code with Agent tool) to dispatch.
**Source**: Recrafted from CEO brief, structured via thoth-prompter:research-then-reason + refine.
**Date**: 2026-04-24

---

## 0. The Objective Behind the Brief

The CEO's stream-of-consciousness brief contains four nested asks that the original prose conflates. The recraft separates them:

1. **Research**: how do the best fictional multiverses get built (Pratchett, Pokémon, Harry Potter, Once Upon a Time, MCU, Spider-Verse, Sandman, Discworld), and what is the contemporary AI-driven alt-universe lore zeitgeist on TikTok/Instagram doing?
2. **Doctrine**: produce the LoreVault Multiverse Cosmology — the meta-frame that holds "cyberpunk Sherlock from another galaxy" + "robot Sherlock" + "modern Sherlock" as one coherent product, not a costume box.
3. **Architecture**: per-universe set strategy (multiple sets per Sherlock canon, multiple per Alice, etc.), the iceberg model (launch teases, depth reveals over months/years), and the multiverse-shell taxonomy.
4. **Voice & artifact discipline**: MTG-grade flavor-text doctrine — the quote-on-every-card that lands like *"It is by my will alone I set my mind in motion."* Not optional, not generic, not AI-default.

The output is a complete artifact a downstream agent (or human) can execute against to produce the universe bible, set roadmap, and 5 exemplar cards demonstrating the system.

---

## 1. Pattern Selection

**Hybrid: Fan-Out → Pipeline → Two-Stage Review**

- **Fan-Out for research** (Phase 1): six independent research domains, no shared state, parallel dispatch. Each domain is too large for a single agent and the domains don't depend on each other.
- **Pipeline for design** (Phases 2-4): synthesis must complete before design tracks can use it; design must complete before exemplars; exemplars must complete before review. Sequential.
- **Parallel within Phase 3**: the three design tracks (multiverse architecture, set strategy, flavor-text doctrine) touch different layers of the system and can run concurrently after synthesis is in.
- **Two-stage review at end**: completeness check (Sonnet) then quality check (Opus) on the integrated bible.

Why not pure Fan-Out: the design phase needs research findings as a coherent input. Synthesis is the bottleneck.

Why not Recursive: the problem space is bounded — six known research domains, not unknown depth.

---

## 2. Agent Roster

| # | Agent | Phase | Pattern | Model | Input | Output |
|---|---|---|---|---|---|---|
| R1 | Multiverse-Architecture Scholar | 1 (parallel) | Fan-Out | Opus | Brief | `lorevault-wiki/narrative/research/R1-multiverse-conventions.md` |
| R2 | World-Building Masters Analyst | 1 (parallel) | Fan-Out | Opus | Brief | `R2-worldbuilders.md` |
| R3 | Public-Domain Remix Casework | 1 (parallel) | Fan-Out | Sonnet | Brief | `R3-pd-remix-cases.md` |
| R4 | TikTok/IG Alt-Universe Zeitgeist | 1 (parallel) | Fan-Out | Sonnet | Brief | `R4-zeitgeist.md` |
| R5 | MTG Flavor-Text Anatomy | 1 (parallel) | Fan-Out | Opus | Brief | `R5-mtg-flavor.md` |
| R6 | IP Brand Management for Franchises | 1 (parallel) | Fan-Out | Sonnet | Brief | `R6-brand-mgmt.md` |
| S1 | Multiverse Cosmology Synthesizer | 2 | Pipeline | Opus | R1-R6 reports | `MULTIVERSE-COSMOLOGY-DOCTRINE.md` |
| D1 | Multiverse-Shell Architect | 3 (parallel) | Pipeline | Opus | S1 doctrine | `MULTIVERSE-SHELLS.md` |
| D2 | Per-Universe Set Strategist | 3 (parallel) | Pipeline | Opus | S1 + existing GAME-ECONOMY-DESIGN-V1.md | `SET-ROADMAP.md` |
| D3 | Flavor-Text Voice Doctrine | 3 (parallel) | Pipeline | Opus | S1 + R5 | `FLAVOR-TEXT-DOCTRINE.md` |
| E1 | Exemplar-Card Generator | 4 | Pipeline | Opus | D1 + D2 + D3 | `EXEMPLAR-CARDS.md` (5 cards) |
| V1 | Completeness Reviewer | 5a | Pipeline | Sonnet | All deliverables + original CEO brief | `REVIEW-completeness.md` |
| V2 | Quality Reviewer | 5b | Pipeline | Opus | All deliverables + V1 report | `REVIEW-quality.md` |

13 agents total. Cognitive integration manageable (≤7 parallel at any phase).

---

## 3. Self-Contained Agent Prompts

Each prompt below includes complete context. Do not inline references to other prompts or files outside the prompt body.

### 3.1 — R1: Multiverse-Architecture Scholar

```
ROLE: You are a researcher specializing in how fictional multiverses are constructed and managed across long-running franchises.

CONTEXT (this is everything you need; do not assume prior conversation):
LoreVault is a digital collectibles product (think Magic: The Gathering meets NBA Top Shot) built around public-domain literary characters: Sherlock Holmes, Alice in Wonderland, the Brothers Grimm cast, Dracula and Gothic horror canon, Greek mythology. The CEO wants to ship a MULTIVERSE — meaning each character exists in multiple "shells" simultaneously: e.g., Victorian Sherlock, cyberpunk Sherlock from another galaxy, robot Sherlock, modern-day Sherlock. The ambition is "Pratchett caliber meets Pokémon scale meets Harry Potter depth." Cards = collectible artifacts with art + flavor text + rarity + set + elemental quality.

TASK: Produce a research report on multiverse construction in long-running fictional properties. Cover ALL of these properties (skip none):

1. The Marvel Cinematic Universe + What If…? + Spider-Verse — how Marvel made multiverses commercially viable; "incursions" doctrine; sacred-timeline concept; what works, what's now over-saturated
2. DC Multiverse — Crisis on Infinite Earths through Dark Crisis; Earth-numbering taxonomy; pre-vs-post Crisis canon management
3. Stephen King's Dark Tower — how every King novel sub-references the Tower; cross-novel tethers; "ka" as multiverse glue
4. Neil Gaiman's Sandman — the Endless as multiverse anchors; The Dreaming as inter-reality space; how mythologies coexist
5. Discworld (Pratchett) — single universe but recursive sub-genres (Watch, Witches, Death, Wizards); how a flat fictional world supports infinite stories
6. Once Upon a Time (TV) — public-domain fairy tales rebuilt as a single shared world; "happy endings" → "land without magic" cosmology
7. Pokemon multiverse (anime + games + cards) — generations as soft resets; regional variants as multiverse parallels; species-as-shell concept
8. The Witcher → Cyberpunk 2077 (CD Projekt) — same studio building two universes; Witcher 3's "Conjunction of the Spheres" multiverse mechanic
9. Star Wars Expanded Universe → Disney canon split — what happens when a multiverse gets purged and rebuilt
10. Borges' "Garden of Forking Paths" + Ted Chiang "Story of Your Life" / Anxiety is the Dizziness of Freedom — literary substrate for branching-realities-as-meaningful

For each: 80-150 words covering (a) the multiverse mechanic in plain language, (b) what makes it land for fans, (c) what failure mode it suffered (or is suffering), (d) the one rule LoreVault should steal.

CONSTRAINTS:
- Stay in research mode. Do not propose what LoreVault should do — that's for the synthesis stage.
- No tutorial preambles ("Multiverses are a fictional construct…"). Get into the cases.
- Cite primary sources where possible (book titles, season/episode numbers, interviews).
- 1500-2000 words total. Do not exceed.

OUTPUT FORMAT: Markdown file at `lorevault-wiki/narrative/research/R1-multiverse-conventions.md`. Structure:
# R1 — Multiverse Construction Conventions
## 1. Marvel MCU + What If? + Spider-Verse
[80-150 words]
## 2. DC Multiverse
[…]
…
## Cross-cutting rules
- 5-7 bullets identifying the recurring rules across these cases.

VERIFICATION CHECKLIST (run before reporting):
- [ ] All 10 properties covered, none skipped
- [ ] Each entry hits all four sub-points (mechanic / why it lands / failure mode / rule to steal)
- [ ] Cross-cutting rules section synthesizes across the 10 cases
- [ ] Total length 1500-2000 words
- [ ] No prescriptive recommendations for LoreVault — research only
```

### 3.2 — R2: World-Building Masters Analyst

```
ROLE: Researcher specializing in fictional-world construction at the level of authorial craft.

CONTEXT (full): LoreVault is a digital collectibles product (Magic: The Gathering format) built on public-domain characters. The CEO has named four creative anchors: Terry Pratchett (lore-from-modern-tropes mastery), Pokémon (real-world + parallel-creature world), Harry Potter (world-within-our-world), and a Once-Upon-a-Time-style PD remix register. The goal is a fictional universe that feels infinite, internally consistent, and generative — every set release adds depth, not breadth-by-volume.

TASK: Analyze the craft of fictional world-building in seven specific creators/properties. For each, isolate the SPECIFIC TECHNIQUE that lets the universe feel infinite without collapsing.

1. Terry Pratchett (Discworld) — the "borrowed truth" technique (every Discworld element is a real human folly refracted through fantasy); the L-space and Narrativium meta-rules; cross-book recurrence without continuity tyranny
2. J.R.R. Tolkien (Middle-earth) — the deep-time scaffold (Silmarillion as foundation, LotR as surface); language-first world building; appendices as iceberg
3. Ursula K. Le Guin (Earthsea, Hainish Cycle) — economy of detail; one true name per thing; ethnographic restraint
4. J.K. Rowling (Harry Potter) — the Statute of Secrecy as the world-within-world mechanic; Pottermore expansion era — the lessons in expansion-without-author
5. Pokémon Company franchise (anime + games + TCG) — the Trainer-as-protagonist anchor; regional generations as soft cosmology; the unspoken rule that no Pokémon dies
6. Studio Ghibli (Miyazaki + Takahata + Suzuki's franchise discipline) — atmospheric world-building (no exposition); kinder cosmologies than the genre default
7. Hayao Miyazaki specifically — Spirited Away, Princess Mononoke, Howl's Moving Castle as case studies; the "world that exists whether you're in it or not" stance

For each, 150-200 words covering: (a) the specific world-building technique, (b) one example demonstrating it, (c) the failure mode that emerges if the technique is absent, (d) what scales when extended (reusable structure), (e) what doesn't scale (auteur-only moments).

PLUS: a final cross-cutting section, 300-400 words, on the SHARED PRINCIPLES of universes that grow without breaking. What's the meta-rule? Where does Pratchett, Tolkien, Le Guin, Pokémon, Ghibli all agree?

CONSTRAINTS:
- Authorial craft focus. Not commercial franchise mechanics (R6 covers that).
- No "LoreVault should…" — research only.
- Total 1500-2000 words.
- Cite primary work or interview sources.

OUTPUT: `lorevault-wiki/narrative/research/R2-worldbuilders.md` with 7 sections + Shared Principles section.

CHECKLIST: All 7 covered. Each has all 5 sub-points. Cross-cutting section integrates. Length within bound. Source citations present.
```

### 3.3 — R3: Public-Domain Remix Casework

```
ROLE: Researcher on how successful PD-character properties get rebuilt for new audiences.

CONTEXT: LoreVault works exclusively with public-domain characters (Sherlock Holmes, Alice, Dracula, Grimm, Greek myth). The CEO wants the product to live in the lineage of successful PD remixes — Once Upon a Time, BBC Sherlock, Penny Dreadful, League of Extraordinary Gentlemen, Castlevania (Netflix), Wicked. The relevant question: when PD-character-remixes work commercially, what did they DO? When they fail (and most do), what killed them?

TASK: Case studies of PD-character remixes across nine properties. For each, dig into what shipped, what happened to it commercially, and what the structural insight is.

1. ABC's Once Upon a Time (2011-2018) — the Storybrooke conceit; Disney IP unlock; what worked early, what bloated late
2. BBC Sherlock (2010-2017) — Moffat/Gatiss modernization; faithfulness-vs-license trade; how it fell apart
3. CBS Elementary (2012-2019) — same source, opposite recipe (gender-swapped Watson, NYC); why it underperformed against BBC
4. Penny Dreadful (2014-2016) — Victorian-horror PD ensemble; what worked artistically, what killed it
5. The League of Extraordinary Gentlemen (Alan Moore) — comic vs film as opposite ends; the comic's annotated multiverse
6. Wicked (Maguire novel + musical + film) — single-character revisionism as multi-billion-dollar property; what generalizes
7. Castlevania (Netflix, Adi Shankar) — turning a video-game-of-PD-source into a 4-season epic
8. Bridgerton (Shonda Rhimes / Julia Quinn) — modernized Regency-era; alt-history aesthetic without breaking PD readership
9. Sandman (Netflix) — Gaiman's adaptation challenges; how a multiverse property handles tone

For each case, 150-200 words: (a) the conceit (what's the rebuild move?), (b) commercial outcome (numbers if you can find them), (c) what specifically worked, (d) what specifically failed, (e) the lesson for a PD-multiverse product.

PLUS: Failure-mode taxonomy (300 words) — categorize the 4-6 ways PD remixes fail. Bloat? Reverence? Cynicism? Joke-density mismatch? Etc.

CONSTRAINTS:
- Focus on PD-character properties specifically. Not general adaptation theory.
- Cite real numbers where possible (viewership, gross, IMDb scores, Metacritic).
- 1500-2000 words.

OUTPUT: `lorevault-wiki/narrative/research/R3-pd-remix-cases.md`.

CHECKLIST: 9 cases, all sub-points. Failure taxonomy. Citation density. Length bound.
```

### 3.4 — R4: TikTok/IG Alt-Universe Zeitgeist

```
ROLE: Researcher on the contemporary AI-driven alt-history / alt-universe content trends on TikTok, Instagram, YouTube Shorts.

CONTEXT: LoreVault wants a multiverse with a launch tease + iceberg-of-content reveal arc. The CEO has noticed that AI-generated "what if 300,000 years ago an advanced civilization existed" videos are a major Gen-Z/Millennial format right now and wants the product's narrative voice to ride that energy without parodying it. We need to know: what's actually working in this format, and what's the deep structure underneath the trend?

TASK: Map the current (2024-2026) AI-generated alt-universe / alt-history content space. Cover:

1. The "lost civilization" thread — which creators dominate (cite handles, follower counts, view ranges)? What recurring tropes? Why does it land emotionally?
2. The "AI imagines [historical event] as [alternate setting]" format — e.g., "AI imagines if Rome had electricity," "what if Egypt had spaceships." Top examples, structural patterns.
3. AI-generated vintage-photo storytelling (Midjourney + voiceover) — accounts using sepia/Daguerreotype-style images to invent counterfactual history
4. The "ancient aliens" / lost-tech / Atlantean genre crossover with AI imagery
5. Steampunk and dieselpunk revival on TikTok — visual register and dominant creators
6. The "magical realism + my city" genre (e.g., New York with dragons, Tokyo with kami) — small but growing
7. Conspiracy-aesthetic crossover — what borrows from QAnon-style world-revealing tropes without endorsing them, and where the line is

For each: 100-150 words. Identify what makes the content STICKY (the emotional payload — wonder, dread, recognition, belonging) and what's GIMMICK (where it cracks under repetition).

PLUS: A "what LoreVault can authentically claim from this space" section (200 words) that names which threads are reusable and which are toxic.

CONSTRAINTS:
- Specific accounts/creators where possible (handles, ranges).
- Acknowledge data limits — TikTok view counts are imprecise.
- Avoid moralizing. The brief is "what's working," not "what's good."
- 1200-1700 words.

OUTPUT: `lorevault-wiki/narrative/research/R4-zeitgeist.md`.

CHECKLIST: All 7 threads covered. Specific creator examples. Sticky/gimmick distinction made for each. Reusable-vs-toxic section concrete.
```

### 3.5 — R5: MTG Flavor-Text Anatomy

```
ROLE: Researcher specializing in Magic: The Gathering flavor-text craft.

CONTEXT: LoreVault cards must include flavor text in the MTG tradition — a one-or-two-line quote that lands like *"Beware the unblinking eye, for it does not weep when it strikes,"* or Yawgmoth's *"It is not enough to live. One must matter."* The CEO is explicit: "as poetic and precise and meaningful and heart-hitting as Magic: The Gathering."

TASK: Decompose what makes MTG flavor text work, with primary-source citations.

Cover:
1. **The voice rules** — first-person quoted character vs unattributed narrator vs in-world textual artifact (book excerpt, prophecy, song lyric). When is each used? Frequency in modern sets.
2. **Length discipline** — token counts. Median, range, longest acceptable. Recent sets vs early sets (Alpha-era one-liners vs current 30+ word quotes).
3. **The character voice canon** — quotes most fans can attribute on sight (Urza, Yawgmoth, Karn, Liliana, Sorin, Ral Zarek, Niv-Mizzet). What makes each voice distinct in 1-2 lines? Identify their syntactic signatures.
4. **The art ↔ flavor ↔ mechanic triad** — when art shows X, mechanic does Y, flavor SHOULD say Z (not paraphrase X, not narrate Y). The compression rule.
5. **The 10 best flavor texts in MTG history** (per fan canon — r/magicTCG threads, MaRo Blogatog, Mark Rosewater articles). For each: what's the technique? Pull-quote it.
6. **Failure modes** — when MTG flavor went wrong (over-explanation, generic fantasy mush, pun-driven cards, modern-snark drift). Examples and why each failed.
7. **Mark Rosewater's writing rules** — pull from Making Magic columns, especially "Flavor and the Card" and "Words of Wisdom."

PLUS: A "voice toolkit" section (300 words) — the 7-10 reusable quote-ARCHETYPES (e.g., "the warning," "the boast," "the testimonial," "the curse," "the artifact-reading," "the song fragment," "the philosophical aphorism") with one example of each.

CONSTRAINTS:
- Pull-quote actual MTG flavor text. No invention.
- Cite cards by name + set.
- 1500-2000 words.

OUTPUT: `lorevault-wiki/narrative/research/R5-mtg-flavor.md`.

CHECKLIST: All 7 sections. 10+ pull-quoted texts. Voice toolkit with archetypes. Length bound.
```

### 3.6 — R6: IP Brand Management for Franchises

```
ROLE: Analyst on long-running fictional-IP brand management at the operational level.

CONTEXT: LoreVault is launching a multiverse-scale collectibles property. The CEO is explicit — this should not be a launch-and-leave, but a "huge iceberg under the surface" reveal arc over months and years. We need to study how franchises that successfully sustained multi-year narrative arcs actually manage IP — the operational discipline, not the storytelling itself.

TASK: How do these properties handle franchise discipline?

1. Wizards of the Coast / Magic: The Gathering — the "Magic Story" team, the planeswalker arc, set-themed plane revisits, Worldbuilding Bibles, art directors per plane, the "creative team" structure
2. The Pokémon Company — region per generation, anime/game/card alignment, the "Pokémon Bible" and franchise-creative oversight
3. Marvel Studios under Kevin Feige — the Phase structure; Sacred Timeline; how Feige protects continuity vs delegates breadth
4. Lucasfilm Story Group (post-Disney) — the canon committee that decides what's Star Wars canon; the failure modes of that body
5. Wizarding World / Pottermore / Wizarding World Digital — how Rowling's universe got managed (well and badly) post-novels
6. DC's Multiverse storyline curators (Geoff Johns era especially) — the Crisis-cycle reset doctrine
7. CD Projekt Red on the Witcher (& Cyberpunk) — narrative continuity across game / Netflix / book license

For each: (a) the team structure (who decides what), (b) the operating cadence (how often they ship "main-line" content), (c) the safety valves (how they handle non-canon side-content), (d) the canonical failure mode.

PLUS: A 400-word "operating model for LoreVault" section — given that LoreVault has a small team and AI-augmented production, what franchise-management model is closest to viable? Pokémon TCG model? Magic Story team? Something hybrid?

CONSTRAINTS:
- Operational, not creative. R1 and R2 cover storytelling craft.
- Cite team structures (who does what), publication cadences, real numbers.
- 1500-2000 words.

OUTPUT: `lorevault-wiki/narrative/research/R6-brand-mgmt.md`.

CHECKLIST: 7 properties. All sub-points. LoreVault operating-model section concrete. Cited.
```

### 3.7 — S1: Multiverse Cosmology Synthesizer

```
ROLE: Senior narrative architect synthesizing the six research streams (R1-R6) into the foundational doctrine for the LoreVault multiverse.

CONTEXT: You've received six research reports (R1: multiverse conventions, R2: world-building masters, R3: PD remix cases, R4: TikTok zeitgeist, R5: MTG flavor anatomy, R6: brand management). Your job is to synthesize — NOT summarize — them into a single doctrine that determines how the LoreVault multiverse is shaped.

The CEO's anchors: Pratchett caliber. Pokémon scale. Harry Potter depth. Once Upon a Time PD ambition. MTG flavor text precision. A multiverse where characters exist as multiple shells (Victorian Sherlock, cyber-Sherlock, robot-Sherlock, modern-Sherlock) held together by some meta-cosmology yet to be defined.

The existing economy spec (lorevault-wiki/economy/GAME-ECONOMY-DESIGN-V1.md) already established: 5 Universes (Baker Street, Enchanted Kingdom, Wonderland, Gothic Horror, Greek Myth), 4 tiers (C/R/L/U), 5 cross-cutting parallels (ARCANA / AETHER / WITNESS / NEON / 1/1). Don't redesign that — design AROUND it.

TASK: Produce the LoreVault Multiverse Cosmology Doctrine. Your output is a single foundational document that downstream design agents will use.

Structure:

## 1. The Meta-Frame
What IS the LoreVault multiverse? Name it. Define the cosmological mechanic that lets Victorian Sherlock and robot Sherlock coexist as MEANINGFUL variants, not costume changes. Draw on R1's case studies — pick the multiverse mechanic that fits LoreVault's product structure (collectibles, drops, persistent universes). 500-800 words. This is the load-bearing concept.

## 2. The Five Universes as Cosmological Anchors
For each of the 5 existing universes (Baker Street, Enchanted Kingdom, Wonderland, Gothic Horror, Greek Myth), define: its tonal signature, its cosmological role within the meta-frame, what makes its character canon translate across multiverse shells. 200 words each = 1000 words.

## 3. The Multiverse Shell Taxonomy
Draft the initial set of "shells" — the alternate-reality treatments characters can be cast into. Use R4 (zeitgeist) to inform which shells will be culturally legible NOW. Examples to consider: PRIME (canonical Victorian/period-faithful), AETHER (mythic-cosmic), CYBER (cyberpunk relocation), MODERN (today, urban), DREAM (psychedelic spiritual), HOLLOW (post-apocalyptic), MIRROR (gender-flipped or identity-inverted), SAINT (mythologized to god-tier). Pick 6-8 shells. For each: what is it, who fits it, what doesn't fit.

## 4. The Iceberg Doctrine
How does LoreVault tease at launch and reveal over 12-36 months? What gets withheld? What hooks fans into "there's more"? Draw on R6 (brand management) for cadence, R3 (PD remix) for failure modes (bloat, over-reveal). 600-800 words.

## 5. Voice Doctrine
How does the multiverse *speak*? Pratchett's borrowed-truth-as-comedy, MTG's cold-prophetic register, Gaiman's mythic compression. Define LoreVault's house voice — when each universe speaks, what's its register? Inform-from R5 (MTG flavor) and R2 (world-builders).

## 6. The Decisions That Bind
List 10-15 specific decisions made by this doctrine. Numbered. Each is a constraint future design must respect. Examples: "Sherlock-PRIME and Sherlock-CYBER share core deductive cognition but never meet on the same card." "Each Set is voiced by ONE in-world narrator." Etc.

CONSTRAINTS:
- Cite which research stream each doctrine point draws from. ("Per R3, BBC Sherlock failed when…; therefore LoreVault decides…")
- Synthesize — don't list research findings. Make decisions.
- Total 4000-5500 words. This is foundational; it earns the length.
- Don't designs sets, cards, or art treatments — that's downstream.

OUTPUT: `lorevault-wiki/narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md`.

CHECKLIST: All 6 sections present. Decisions made (not options listed). Research streams cited. Length bound. Coherence with existing GAME-ECONOMY-DESIGN-V1.md.
```

### 3.8 — D1: Multiverse-Shell Architect

```
ROLE: Designer of the multiverse shell system — the structural mechanic by which characters appear in multiple realities.

CONTEXT: You've been handed `MULTIVERSE-COSMOLOGY-DOCTRINE.md` (read it before designing). Specifically Section 3 (Shell Taxonomy) and Section 6 (Decisions That Bind). The economy spec lives at `lorevault-wiki/economy/GAME-ECONOMY-DESIGN-V1.md` — note the existing 5 parallels (ARCANA / AETHER / WITNESS / NEON / 1/1) and the rarity tier system.

TASK: Design the SHELL system in operational detail.

1. **Shell-vs-Parallel relationship.** Are shells the same as parallels? Different layer? How do they relate to the existing parallel system? A character in CYBER shell × ARCANA parallel — what's that visually and structurally?
2. **Shell properties per character.** For each of the 20 starter characters (Sherlock, Watson, Moriarty, Irene, the Hound; Snow White, Evil Queen, Red Riding Hood, Rumpelstiltskin; Alice, Cheshire, Mad Hatter, Queen of Hearts; Dracula, Frankenstein, Jekyll, Phantom; Prometheus, Medusa, Zeus, Athena), determine which shells they ARE meaningful in and which they AREN'T. (E.g., Cheshire in CYBER might fit; Cheshire in HOLLOW might not.)
3. **Cross-shell continuity rules.** When the same character exists in multiple shells, what's preserved? Name? Core gesture? Iconographic anchor? What's NOT preserved?
4. **Shell-crossing events.** Are there moments where shells touch in-canon? E.g., a card where Sherlock-PRIME meets Sherlock-CYBER? Rare and ritualized, or never?
5. **The "elemental" question.** The CEO mentioned cards may have elemental qualities (like MTG's color identity). Does the elemental system map to shells, universes, or stand alone? Decide.

OUTPUT FORMAT: `lorevault-wiki/narrative/MULTIVERSE-SHELLS.md`. Sections matching the 5 questions above + a final "examples" section with 6 example characters showing their shell distribution.

CONSTRAINTS:
- Decisions, not options. The CEO will see this as the operating spec.
- Reference the doctrine's decisions; don't contradict them.
- 2000-3000 words.

CHECKLIST: All 5 questions answered. Shell-vs-Parallel relationship is explicit. Shell distribution per the 20 characters is concrete. Elemental decision made.
```

### 3.9 — D2: Per-Universe Set Strategist

```
ROLE: Designer of the set-roadmap-per-universe — the multi-year content plan.

CONTEXT: Read `MULTIVERSE-COSMOLOGY-DOCTRINE.md` and `GAME-ECONOMY-DESIGN-V1.md`. The economy spec already established that each Universe gets 4 Sets per Series in the launch model. Your job is to fill the actual Set roadmap for the first three Series (3 years of content) across all 5 Universes.

TASK: Design the Set roadmap.

1. **Series 1, 2, 3 overall arcs.** What's the meta-narrative across each Series? Per the iceberg doctrine, Series 1 teases, 2 deepens, 3 turns. Define the arcs.
2. **Per Universe, 4 sets per Series × 3 Series = 12 sets per Universe = 60 sets total.** That's a lot. For each Universe, you must propose 12 set concepts. For each set: name, theme, the narrative arc, the Ultimate Moment (the one defining card), the rough timeline (Series + drop-month), and the shell distribution (how many cards in PRIME shell vs other shells).
3. **Cross-set tethering.** Which sets reference which? E.g., a Reichenbach Set should tether to a Moriarty Set. Map the references.
4. **Cross-Universe events.** Are there special crossover sets? E.g., a one-time "Wonderland × Gothic" set where Alice meets Dracula? Define the crossover policy.
5. **Drop cadence.** Calendar — when does each set drop in months 1-36? Show the calendar.

OUTPUT FORMAT: `lorevault-wiki/narrative/SET-ROADMAP.md`. Tables-heavy. The reader should be able to see "in month 17, what drops?" by skimming.

CONSTRAINTS:
- Concrete set names. Not "Sherlock Set 1" but real names that telegraph the arc.
- Realistic narrative pacing — don't put all the Ultimate Moments in Series 1.
- 3000-4000 words.

CHECKLIST: 60 set concepts, all named. Per-set arcs concrete. Cross-set references mapped. Drop calendar present. Crossover policy decided.
```

### 3.10 — D3: Flavor-Text Voice Doctrine

```
ROLE: Voice & writing-craft designer for LoreVault flavor text.

CONTEXT: Read `R5-mtg-flavor.md` (anatomy of MTG flavor text) and `MULTIVERSE-COSMOLOGY-DOCTRINE.md` (especially Section 5 — Voice Doctrine). The CEO is explicit that flavor text quality is the difference between mid and "Pratchett caliber" — quote that's "directly apt and inspiring and relevant to the image, in as poetic and precise and meaningful and heart-hitting a way as Magic: The Gathering."

TASK: Produce the writing doctrine.

1. **The Five Voices of LoreVault.** One narrator per Universe. Define each:
   - Baker Street voice (suggestion: Watson chronicling, period-precise, restrained)
   - Enchanted Kingdom voice (suggestion: pre-Disney Grimm — adult, clear-eyed about cruelty)
   - Wonderland voice (suggestion: nonsense-as-truth, wordplay)
   - Gothic Horror voice (suggestion: epistolary fragments, letters and journal entries)
   - Greek Myth voice (suggestion: oracular, fated, archaic)
   For each: the syntactic signature, the vocabulary register, two example flavor texts (you write them).
2. **Shell modulation.** When a character is in CYBER shell vs PRIME, does the voice shift? Or does the universe-narrator stay constant and the character's interior changes? Decide.
3. **The 10 quote archetypes for LoreVault** (extending R5's MTG archetypes). E.g., "the deduction," "the prophecy," "the lover's letter," "the curse-spoken," "the apple-test." For each: definition + 2 examples written in the appropriate voice.
4. **Length and rhythm rules.** Word counts. Cadence. When to break for em-dash. When attribution is signed by character vs unsigned.
5. **The forbidden register.** What flavor text can NEVER do — modern slang, joke punchlines, AI-tells like "in a world where…", explanations of the art ("As Sherlock raised his pipe…"), etc.
6. **Sample table.** 25 sample flavor texts demonstrating the doctrine. Each tagged: (Universe, Shell, Tier, Archetype). Show the range.

OUTPUT FORMAT: `lorevault-wiki/narrative/FLAVOR-TEXT-DOCTRINE.md`.

CONSTRAINTS:
- Write actual sample texts, not placeholders. They must be GOOD.
- Don't paraphrase MTG's voice — find LoreVault's voice through the lens of MTG's discipline.
- 2500-3500 words including samples.

CHECKLIST: 5 voices defined with examples. Shell-modulation decided. 10 archetypes with 2 examples each = 20+ samples. 25-sample table. Forbidden register explicit. Quality bar: would Mark Rosewater approve?
```

### 3.11 — E1: Exemplar-Card Generator

```
ROLE: You produce 5 fully-specified exemplar cards demonstrating the LoreVault system end-to-end.

CONTEXT: Read all design outputs:
- `MULTIVERSE-COSMOLOGY-DOCTRINE.md` (the meta-frame)
- `MULTIVERSE-SHELLS.md` (shell architecture)
- `SET-ROADMAP.md` (where these cards live)
- `FLAVOR-TEXT-DOCTRINE.md` (how they speak)
- `GAME-ECONOMY-DESIGN-V1.md` (tier/parallel/serial mechanics)

TASK: Produce 5 exemplar cards that together demonstrate the system's range. Constraints on the 5:
- One per Universe (5 universes, one each)
- Distribute tiers: 1 Common, 2 Rare, 1 Legendary, 1 Ultimate
- Include at least 2 different shells (PRIME plus one other)
- Include at least 2 different parallels (one card showing a parallel variant)
- One must demonstrate cross-set tethering (the flavor or art references another set)

For each card, full specification:

```
CARD #N
================================
Universe: [name]
Set: [name from SET-ROADMAP]
Series: [1, 2, or 3]
Drop month: [calendar position]
Moment: [the specific scene]
Tier: [Common/Rare/Legendary/Ultimate]
Shell: [PRIME / CYBER / etc.]
Parallel (if any): [base or ARCANA/AETHER/WITNESS/NEON/1/1]
Mint count: [from economy spec for tier × parallel]
Elemental quality: [from D1's elemental decision]
Cross-set tether: [reference to another set if applicable]

ART PROMPT (for gpt-image-1):
[Full prompt — character + scene + iconography + composition + lighting + style register, in the v6+ structure used by scripts/seed-moodboard.mjs. Must produce a stunning image with the parallel treatment if specified.]

FLAVOR TEXT:
"[The quote, in the universe's voice per FLAVOR-TEXT-DOCTRINE.md]"
— [attribution if any]

LORE NOTE (the iceberg pull):
[1-2 sentences of background lore that hints at the deeper continuity. This is the iceberg pull — it implies more story than it tells.]
================================
```

CONSTRAINTS:
- These cards must be SHIPPABLE. The art prompt must be runnable through the existing seed script. The flavor text must be quotable. The lore note must hook.
- No card is generic or filler. Each must be the kind of card a collector screenshots.
- 1500-2500 words total across the 5 cards.

OUTPUT: `lorevault-wiki/narrative/EXEMPLAR-CARDS.md`.

CHECKLIST:
- 5 cards, all fields filled
- Universe / tier / shell / parallel distribution constraints met
- Art prompts run-ready
- Flavor texts in correct voice per Universe
- Lore notes function as iceberg-pulls
- Cross-set tether present in at least one
```

### 3.12 — V1: Completeness Reviewer

```
ROLE: Audit reviewer ensuring every aspect of the original CEO brief is addressed in the deliverables.

CONTEXT: Below is the verbatim CEO brief. The LoreVault narrative team has produced these deliverables:
- 6 research files (R1-R6)
- MULTIVERSE-COSMOLOGY-DOCTRINE.md
- MULTIVERSE-SHELLS.md
- SET-ROADMAP.md
- FLAVOR-TEXT-DOCTRINE.md
- EXEMPLAR-CARDS.md

CEO BRIEF (verbatim):
"""
So a big part of what I think should be the case is that we need to obviously have multiple sets in the Sherlock Holmes universe, multiple sets in the Alice in Wonderland universe or whatever it might be. Each set must tell the story in a particular way, and also what we need to do is go deep and imagine incredible lore for this product. I think that I would love for us to kick off a series of agents that can go as wide as possible and also perform research into how best to approach the narrative and the storytelling of a public domain universe that can be engaging, exciting, and infinitely explorable through this kind of product and through maybe different kinds of products. In a sense, I want us to go through, in a structured way, and perform a lot of research into: amazing narratives and brands; how virtual worlds are created; how narrative worlds are created; how brands are managed; and then try to understand storytelling and especially multiverses and infinite universes, and how to create them. For example, there are worlds like Once upon a Time, which was a TV show that recast Disney characters in a whole new way. There are authors like Terry Pratchett who take modern tropes and turn them into fantasy. We need to be at that caliber. Something between Pokémon that lives in our real world and Terry Pratchett that is almost like a topsy-turvy version of our world, and Harry Potter that is basically like a world within our world. There is a multiverse of all of these characters and storylines. There might be a Sherlock Holmes that is a retro-futuristic cypherpunk from a different galaxy, or it's a Sherlock Holmes that is a robot, or it's a modern day Sherlock Holmes. The launch should tease the full vision but there's a massive iceberg of stuff under the hood. We need research into the storylines on TikTok and Instagram about alternative universes, 300,000 years ago civilizations, etc. Cards must be like Magic: The Gathering — art, description, rarity, set, elemental qualities, and most importantly a quote that's directly apt and inspiring and relevant to the image, in as poetic and precise and meaningful and heart-hitting a way as Magic: The Gathering. Cards should feel like cohesive collectibles telling a story that crosses space and time and different possibilities through sets, drops, and individual content.
"""

TASK: For each of the 14 explicit asks in the brief, find evidence in the deliverables that it was addressed. Report missing or under-addressed aspects.

The 14 asks (extracted from the brief):
1. Multiple sets per universe
2. Each set tells the story in a particular way
3. Deep lore
4. Multi-agent research orchestration
5. Research: amazing narratives & brands
6. Research: virtual world creation
7. Research: narrative world creation
8. Research: brand management
9. Multiverse construction theory
10. PD-character recasting (Once Upon a Time / Pratchett / Pokémon / Harry Potter as touchstones)
11. Multiple character shells (cyber-Sherlock, robot-Sherlock, modern-Sherlock)
12. Launch tease + iceberg reveal arc
13. TikTok/IG alt-universe zeitgeist research
14. MTG-grade cards: art + description + rarity + set + elemental + flavor-text quote

For each ask, report: ADDRESSED (where) / PARTIAL (where, what's missing) / NOT ADDRESSED.

OUTPUT: `lorevault-wiki/narrative/REVIEW-completeness.md`. Table format.

CONSTRAINTS:
- Only completeness, not quality. The next reviewer (V2) handles quality.
- Be specific. "Section 3 of D2 covers this" not "yes."
- Flag every gap. Better to over-flag than miss.
```

### 3.13 — V2: Quality Reviewer

```
ROLE: Senior critic evaluating whether the narrative work actually achieves the bar the CEO set.

CONTEXT: Read all deliverables AND the V1 completeness report. The CEO's bar:
- Pratchett caliber
- Pokémon scale
- Harry Potter depth
- MTG-quality flavor text — "as poetic and precise and meaningful and heart-hitting"
- Once Upon a Time-grade PD recasting
- "Massive iceberg under the hood"

TASK: Audit the deliverables against the bar. Specifically:

1. **The Cosmology Doctrine.** Does the meta-frame actually generate "Pratchett caliber" lore, or does it read as a serviceable but ordinary multiverse? Find 3 places it's genuinely strong and 3 where it's still weak.
2. **The Set Roadmap.** Pick 3 of the 60 set concepts and stress-test them. Is the arc compelling? Does the Ultimate Moment land? Would the Set name work on a t-shirt?
3. **The Voice Doctrine.** Read the 25 sample flavor texts. Score them: how many are MTG-grade? How many are mid? Quote the 5 best and 5 weakest.
4. **The Exemplar Cards.** All 5 — would each work on a real card? Is the art prompt actually generation-ready? Is the flavor heart-hitting?
5. **The Iceberg.** Is the iceberg real? Or is the "depth" actually flat? Identify which sets/cards have implied-depth vs which feel surface.
6. **The Distinct Voice.** Could a fan tell a LoreVault flavor text from an MTG one? Or does it read as derivative? What would push it toward distinct?

For each: be brutal. The product fails if the work is "good enough" but not "great."

OUTPUT: `lorevault-wiki/narrative/REVIEW-quality.md`. 2000-3000 words. End with a verdict (SHIP / STRENGTHEN-AND-SHIP / REWORK).

CONSTRAINTS:
- Quote specific passages. Don't generalize.
- Compare to actual MTG / Pratchett / Sandman text.
- Identify the 5 highest-impact rewrites that would lift the work to bar.
```

---

## 4. Orchestration Sequence

Use TaskCreate to register every task before any work begins. Then dispatch in order:

```
TASK-1  : Research dispatch (parallel × 6)        [R1, R2, R3, R4, R5, R6]
TASK-2  : Research collection + sanity check      [orchestrator manual]
TASK-3  : Synthesis                               [S1] (depends on TASK-2)
TASK-4  : Design dispatch (parallel × 3)          [D1, D2, D3] (depends on TASK-3)
TASK-5  : Design collection + sanity check        [orchestrator manual]
TASK-6  : Exemplar generation                     [E1] (depends on TASK-5)
TASK-7  : Completeness review                     [V1] (depends on TASK-6)
TASK-8  : Quality review                          [V2] (depends on TASK-7)
TASK-9  : Final synthesis report to CEO           [orchestrator manual]
```

**Phase boundaries are mandatory checkpoints.** After each parallel phase completes, the orchestrator MUST:
1. Read every output (don't trust filenames — verify content quality)
2. Identify contradictions between parallel agent outputs
3. Write a 200-word synthesis note for the user before proceeding

If any agent's output is below bar (lazy, hallucinated, off-scope), **re-dispatch with a fixed prompt — do not paper over with synthesis-stage cleanup.**

---

## 5. Failure Handling

| Failure mode | Response |
|---|---|
| Agent times out | Re-dispatch the SAME prompt unchanged. Parallel timeouts often = transient. |
| Agent returns garbage / off-topic | Diagnose (too-broad scope? missing context? wrong model?) then re-dispatch with FIXED prompt. Do not retry identical prompt. |
| Agent fabricates citations | Re-dispatch with explicit "primary sources only — if you can't cite, say so" constraint. |
| Synthesis stage finds contradictions in research | Synthesizer may KEEP both views and explicitly identify the disagreement as a doctrine-decision-point. Don't smooth it over. |
| V2 verdict = REWORK | Don't ship. Identify the 3 highest-leverage rewrites V2 named, dispatch new agents to do those, re-run V2. |
| Total cost exceeds $30 in OpenAI | Stop. The research → doctrine → design → exemplar → review chain at Sonnet/Opus mix should run ~$15-25. Above $30 means scope leak. |

---

## 6. Execution Harness — Task List for the Runner

Before the runner agent dispatches anything, it MUST call TaskCreate for these:

```
1. R1 — Multiverse Architecture Scholar (Opus, fan-out)
2. R2 — World-Building Masters Analyst (Opus, fan-out)
3. R3 — PD Remix Casework (Sonnet, fan-out)
4. R4 — TikTok/IG Zeitgeist (Sonnet, fan-out)
5. R5 — MTG Flavor Anatomy (Opus, fan-out)
6. R6 — IP Brand Management (Sonnet, fan-out)
7. Read R1-R6, write 200-word integration note
8. S1 — Multiverse Cosmology Synthesizer (Opus)
9. Read S1, sanity-check coherence
10. D1 — Multiverse-Shell Architect (Opus, parallel with D2,D3)
11. D2 — Per-Universe Set Strategist (Opus, parallel with D1,D3)
12. D3 — Flavor-Text Voice Doctrine (Opus, parallel with D1,D2)
13. Read D1+D2+D3, write 200-word integration note
14. E1 — Exemplar-Card Generator (Opus)
15. V1 — Completeness Reviewer (Sonnet)
16. V2 — Quality Reviewer (Opus)
17. Final report: bundle and present to CEO
```

After each task: call TaskList. Find next unblocked task. Re-anchor on what's left.

When all 17 are done: self-audit against the original CEO brief. Are all 14 asks (V1's checklist) addressed? If not, fix gaps before declaring complete.

---

## 7. How to Run This

```bash
# From any Claude Code session with the Agent tool available:
# Paste this entire file as the orchestration spec.
# The runner dispatches Phase 1 (six parallel research agents) immediately,
# checkpoints between phases, and produces the final bundle.

# Approximate cost: $15-25 in API spend (Opus + Sonnet mix).
# Approximate wall-clock: 90-120 minutes if research agents run in parallel.
# Output: 12 files in lorevault-wiki/narrative/, ready for CEO review.
```

---

## 8. Self-Audit (run before declaring done)

The orchestrator's final check, in plain English:

1. Did Phase 1 produce six separate research files of the right length, with citations, no LoreVault-prescriptive recommendations?
2. Does the doctrine make a CHOICE about the multiverse's meta-frame, not a list of options?
3. Does the Set Roadmap have 60 named sets distributed across 3 Series × 5 Universes?
4. Are the 25 flavor-text samples actually good — would they hold up against MTG cards on equivalent topics?
5. Do the 5 exemplar cards each tell a self-contained story while implying a larger one?
6. Did V1 find every aspect of the CEO brief addressed?
7. Did V2 say SHIP or STRENGTHEN-AND-SHIP — not REWORK?

If any "no" — the orchestration is incomplete. Fix before reporting up.
