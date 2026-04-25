# LoreVault Rebirth — Multi-Agent Orchestration Spec

**Status**: Executable orchestration. Hand to a Claude Code session with the Agent tool, or dispatch it via the kaaos-daemon VM as the new infinite-loop daemon prompt.
**Source**: Recrafted from CEO directive 2026-04-24 to formalize the LoreVault vision into a North Star and ship a daemon that closes the gap between the current product and the vision.
**Date**: 2026-04-24

---

## 0. The Objective Behind the Brief

The CEO's directive nests four asks. The recraft separates them:

1. **North Star** — a single foundational document that encodes the LoreVault vision after all the cosmology, set-roadmap, voice, parallel, and Topsy doctrine work. The piece anyone joining the project reads first.
2. **Rebirth posture** — the new product is not an iteration of the current one; it is a parallel build that takes the *learnings* of v1 (the seed-moodboard, the 5 universes, the parallel system, the v6 art, the voting data) and rebuilds with lore, story, myth at every level — including UX, IA, onboarding, drop cadence, and surfaces, not just art.
3. **Infinite loop** — a daemon that lives on `kaaos-daemon`, runs continuously, audits the current build against the North Star, plans the next-best move, executes it, and reviews. With explicit Odin (supervisor) and Frigga (market intelligence) inputs in the loop.
4. **Surpass-the-vision pressure** — the loop's job is not to merely close the gap to the vision but to push past it via market input and reasoning, so the audience (gambler-collector + Pratchett-curious + lore-hunter) is *thrilled*, not satisfied.

The output of THIS orchestration is two artifacts:
- `lorevault-wiki/strategy/NORTH-STAR.md` — the foundational vision document
- `REBIRTH-DAEMON-PROMPT.md` (repo root) — the infinite-loop prompt deployed to the VM

…plus the deploy action that swaps the old taste-daemon for the new rebirth-daemon in tmux.

---

## 0.5. Image Generation Standard — BINDING

**ALL art generation in the rebirth uses FLUX 1.1 Pro Ultra via Replicate. Never OpenAI gpt-image-1.**

- Provider: `replicate` (CEO-selected; full account configured)
- Model: `black-forest-labs/flux-1.1-pro-ultra`
- Env: `REPLICATE_API_TOKEN` (already on kaaos-daemon at `/opt/taste-daemon/env`; will be inherited into `/opt/rebirth-daemon/env`), `FLUX_PROVIDER=replicate`
- Reference implementation: `scripts/seed-exemplars-flux.mjs` (already in repo). Quality verified — 5 exemplars rendered at 1.2MB peak in 29.7s; significantly higher fidelity than the gpt-image-1 baseline.
- Aspect ratio: `2:3` (collectible-card portrait)
- Cost: ~$0.04 per image at FLUX 1.1 Pro Ultra; budget headroom for high-volume daemon cycles.

The daemon's Track A (ART) MUST use this path. The legacy `scripts/seed-moodboard.mjs` (gpt-image-1) and `scripts/seed-exemplars.mjs` (gpt-image-1) are deprecated for new generation. They remain in the repo for archive only.

L1 (daemon prompt designer) MUST encode this standard in REBIRTH-DAEMON-PROMPT.md.

---

## 1. Pattern Selection

**Hybrid: Fan-Out (audit) → Pipeline (synthesis → architecture → North Star → daemon prompt) → Two-Stage Review → Deploy**

- Fan-Out across the audit dimensions (5 different audit domains, no shared state)
- Pipeline for synthesis through deploy (each stage transforms the previous output)
- Parallel Fan-Out within architecture phase (4 architectural domains)
- Two-Stage Review at the end (completeness then quality)
- A deploy action at the end (write to VM, start daemon)

Why not pure Fan-Out: the daemon prompt design needs the North Star as input, which needs the architecture, which needs the synthesis. Sequential dependencies.

Why not Recursive: scope is bounded — we know the audit domains and the architecture domains.

---

## 2. Agent Roster

| # | Agent | Phase | Model | Output |
|---|---|---|---|---|
| A1 | Code-State Auditor | 1 (parallel) | Sonnet | `lorevault-wiki/strategy/audit/A1-code-state.md` |
| A2 | Lore-Doctrine Auditor | 1 (parallel) | Sonnet | `audit/A2-lore-doctrine.md` |
| A3 | UX-Surface Auditor (Playwright) | 1 (parallel) | Sonnet | `audit/A3-ux-surface.md` |
| A4 | Market-Intel Synthesizer (Frigga proxy) | 1 (parallel) | Sonnet | `audit/A4-market-intel.md` |
| A5 | Audience-Voice Auditor (votes + comments) | 1 (parallel) | Sonnet | `audit/A5-audience-voice.md` |
| G1 | Odin Gap Synthesizer | 2 | Opus | `audit/G1-gap-synthesis.md` |
| R1 | Product Architecture | 3 (parallel) | Opus | `architecture/R1-product-architecture.md` |
| R2 | Engagement Loops | 3 (parallel) | Opus | `architecture/R2-engagement-loops.md` |
| R3 | Onboarding Journey | 3 (parallel) | Opus | `architecture/R3-onboarding-journey.md` |
| R4 | Content Pipeline | 3 (parallel) | Opus | `architecture/R4-content-pipeline.md` |
| N1 | North Star Composer | 4 | Opus | `lorevault-wiki/strategy/NORTH-STAR.md` |
| L1 | Rebirth Daemon Prompt Designer | 5 | Opus | `REBIRTH-DAEMON-PROMPT.md` |
| V1 | Completeness Reviewer | 6 | Sonnet | `audit/V1-completeness.md` |
| V2 | Quality + Adversarial Critic | 6 | Opus | `audit/V2-quality.md` |
| — | VM Deploy Action | 7 | (orchestrator) | tmux session live on kaaos-daemon |

14 agents + 1 deploy action.

---

## 3. Self-Contained Agent Prompts

### 3.1 — A1: Code-State Auditor

```
ROLE: You are A1 — Code-State Auditor for the LoreVault rebirth orchestration.

CONTEXT (full): LoreVault is a digital-collectibles product built on public-domain literary characters. The current shipped product is at https://lorevault-site.vercel.app, source at github.com/roham/lorevault, local checkout at /tmp/lorevault. The CEO has decided to REBIRTH the product — keeping learnings from v1 but rebuilding with lore-and-story at every level. Your job is to inventory what currently exists in the codebase so subsequent agents know exactly what to keep, what to discard, and what to extend.

The rebirth posture means you must NOT ASSUME the current code is the foundation. Treat it as artifact — what's instructive, what's debt, what's aesthetically right.

TASK: Produce a structured inventory of the current codebase.

1. **Routes** — every page in src/app/. For each: purpose (1 line), production-grade (yes/no/half), worth keeping in v2 (yes/no/maybe with reason).
2. **Components** — src/components/. Group by family (CardItem, marketplace/, baseball/, etc). For each family: what it does, quality, redundancy with other families.
3. **Data layer** — src/data/, src/lib/. The 200-card moment catalog, types, store, market data. Quality and rebirth-relevance.
4. **Production scripts** — scripts/. seed-moodboard.mjs, seed-exemplars.mjs, seed-exemplars-flux.mjs, rebuild-manifest.mjs. State of each.
5. **Public assets** — public/. moodboard-art (180+ images across v2-v6), prototype-art/exemplars (5 FLUX images), card images, etc. Volume and reusability.
6. **Architectural debt** — patterns that won't survive rebirth (the legacy 200-card hardcoded moments, mixed v2-v6 manifest entries, the moodboard-as-survey conflated with art generation, etc).
7. **Architectural strengths** — patterns worth carrying over (the parallel-aware manifest, the FLUX integration via Replicate, the seed-script architecture, the rate-limiter with retries).

CONSTRAINTS:
- Inventory, not opinion. Save judgments for the gap synthesizer (G1).
- Read actual files; don't guess from filenames.
- 1500-2200 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/A1-code-state.md using Write.

CHECKLIST: All 7 sections present. Routes counted. Components grouped. Data + scripts + assets enumerated. Debt and strengths each have ≥5 items.

Return 3-4 sentence summary + file path. Do NOT paste full audit.
```

### 3.2 — A2: Lore-Doctrine Auditor

```
ROLE: You are A2 — Lore-Doctrine Auditor.

CONTEXT (full): LoreVault has accumulated foundational lore documents in /tmp/lorevault/lorevault-wiki/. Your job is to audit the doctrine corpus for the rebirth: what's load-bearing, what's contradictory, what's underdeveloped, and what's already obsolete given the rebirth posture.

YOUR INPUTS — read each in full with the Read tool:
- /tmp/lorevault/lorevault-wiki/economy/GAME-ECONOMY-DESIGN-V1.md (5 universes / 4 tiers / 5 parallels)
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md (Lattice and Lampblack — 15 binding decisions)
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-SHELLS.md (8 shells, 4-layer Lampblack stack, 6 elementals, Canon Council rejection examples)
- /tmp/lorevault/lorevault-wiki/narrative/SET-ROADMAP.md (60 sets across 3 Series, Series-1 thesis "The Glass Catches Light")
- /tmp/lorevault/lorevault-wiki/narrative/FLAVOR-TEXT-DOCTRINE.md (5 universe voices, 12 archetypes, 75+ samples)
- /tmp/lorevault/lorevault-wiki/narrative/EXEMPLAR-CARDS.md (5 shippable cards)
- /tmp/lorevault/lorevault-wiki/narrative/TOPSY-REGISTER.md (20% Pratchett-grade satirical mode, The Footnoter)
- /tmp/lorevault/lorevault-wiki/narrative/REVIEW-quality.md (V2 verdict from prior orchestration: STRENGTHEN-AND-SHIP, 5 named rewrites)
- /tmp/lorevault/lorevault-wiki/taste/ART-DIRECTION-V3.md (older — superseded; note it's superseded)

TASK: Produce the doctrine audit.

1. **The load-bearing concepts** — what would the rebirth FAIL without? (Lattice/Lampblack/Spine/4-layer recognition stack/Universe pantheon/Shell taxonomy/Topsy register/etc). For each: 2-3 sentences on why it's load-bearing.
2. **The contradictions and gaps** — places where two docs disagree, or where a decision was deferred. Cite file + section.
3. **The underdeveloped areas** — concepts named but not fleshed out (the Lampblacker as anchor character per Decision 11; the Footnoter; the Vertigo-Moment / Dream Hand-Off / Saint's Glimpse mechanics; the Three Laws of the Lattice teased but never spoken).
4. **The obsolete artifacts** — pre-cosmology docs that no longer hold. ART-DIRECTION-V3.md is one. Any others?
5. **The decisions waiting to be made** — open questions in any doctrine doc that downstream stages need answers for. Enumerate.
6. **The doctrine's own self-test** — applying V2's STRENGTHEN-AND-SHIP verdict, which 5 high-impact rewrites have NOT been applied yet? (One has — the 4-layer Lampblack stack. Four remain.)

CONSTRAINTS:
- Audit, not redesign. The architecture phase will redesign; you map what exists.
- Cite file + section per claim.
- 1800-2500 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/A2-lore-doctrine.md using Write.

CHECKLIST: All 6 sections. Concepts attributed to source files. Outstanding-rewrites list identified. Open questions enumerated.

Return 3-4 sentence summary + file path. Do NOT paste audit.
```

### 3.3 — A3: UX-Surface Auditor (Playwright)

```
ROLE: You are A3 — UX-Surface Auditor with Playwright access.

CONTEXT (full): LoreVault's current production surface is at https://lorevault-site.vercel.app. The product has 33 routes from the v1 era + the new /prototype/exemplars and /moodboard surfaces. The CEO has decided to rebirth the product. Your job is to audit the EXISTING user-experience surface — the actual journey a first-time visitor experiences — so the rebirth knows what to discard, what to evolve, and what (if anything) to preserve.

You have Playwright MCP tools available (mcp__playwright__browser_*). Use them.

TASK: Produce the UX-surface audit.

1. **First-visit journey** — hit https://lorevault-site.vercel.app at 375×812 (mobile) and 1440×900 (desktop). What does the home page tell a first-time visitor about the product? Screenshot. Critique honestly — does it tell ANY lore story? Does it look like a collectibles platform or a clone of Top Shot?
2. **Navigation** — the site has 5-tab nav (or whatever current state shows). Map the IA. What's discoverable in 0 clicks, 1 click, 2 clicks?
3. **Card surfaces** — visit /card/[some-id]. Does any individual card communicate the lore, the universe, the parallel, the Lampblack? Or is it generic NFT-card metadata?
4. **The marketplace** — /marketplace. Does it feel like a collectibles surface or a stock-screener?
5. **The prototypes** — /prototype/exemplars (the FLUX-rendered showcase we just shipped). How does this contrast with the v1 product surfaces?
6. **The moodboard** — /moodboard?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl. The voting tool. State?
7. **The seams** — where does v1 show its "auto-research-project" origins (per CEO's framing — "we created it as a sort of auto research project, just chucking features together")?
8. **The five most-jarring moments** — rank-order the worst UX failures.
9. **The two surprising strengths** — anything that already lands well.

For every claim: attach a screenshot path you captured and a 1-line caption.

CONSTRAINTS:
- Real Playwright captures, not assumptions.
- Be brutal. The rebirth needs candid input.
- 1500-2000 words plus screenshot paths.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/A3-ux-surface.md using Write. Save screenshots to /tmp/lorevault/lorevault-wiki/strategy/audit/screenshots-A3/.

CHECKLIST: All 9 sections. Screenshots captured at both viewports for ≥5 routes. Five worst moments rank-ordered. Two strengths named.

Return 3-4 sentence summary + file path. Do NOT paste audit.
```

### 3.4 — A4: Market-Intel Synthesizer (Frigga proxy)

```
ROLE: You are A4 — Market-Intel Synthesizer, acting as a proxy for the Frigga market-intelligence agent. Once the daemon is deployed, the actual frigga skill will be invoked in-loop; for THIS orchestration, you do the work synchronously.

CONTEXT (full): LoreVault is a digital-collectibles product launching with public-domain literary canon, a multiverse cosmology (Lattice and Lampblack), and a Pratchett-grade Topsy register on top of MTG/Top-Shot economy mechanics. The CEO wants the rebirth to NOT just close the gap to the internal vision, but to surpass it — informed by what the market is actually doing right now (April 2026).

YOUR JOB: synthesize a market brief that gives the rebirth daemon a current view of the audience, competitors, and zeitgeist.

TASK: Produce a market-intelligence brief.

1. **The buyer state of the digital-collectibles market in 2026 Q2** — what's spending? What's lapsed? Where is gambler-collector audience moving? Specifically: NBA Top Shot v3 trajectory, NFL ALL DAY, Disney Pinnacle, Courtyard, Pokémon Pocket, Magic Arena's Standard product. Use real numbers where you can find them.
2. **The current taste signal in our specific lane** — public-domain narrative, illustrated card-collectibles, multiverse properties. What's TikTok/IG/Twitter showing as catching fire and what's getting tired? Cite specific creators or properties.
3. **What competitors are doing that we should steal** — features, content patterns, monetization, voice — across at least 8 properties (Top Shot, Pokémon Pocket, Magic Arena, Marvel Snap, Sorare, Courtyard, Bored Ape merch, Animoca's recent launches).
4. **What competitors are doing that's failing** — and why. The dead patterns to NOT inherit.
5. **The audience archetypes refined** — the four-archetype model (collector / gamer / speculator / connector) is generic. For LoreVault's specific public-domain-literary lane, refine: who actually buys this? What sub-archetypes exist? "The Sherlockian completist." "The Pratchett-discoverer." "The taste-collector who doesn't read the lore but buys for art." Etc.
6. **The five immediate threats** — adjacent product or platform launches in the next 6 months that would compete for attention.
7. **The five immediate opportunities** — events, calendar moments, cultural waves we can ride. (E.g., Sherlock 1887 went fully public-domain in 2023; the 200th anniversary of Mary Shelley's Frankenstein is 2030; etc.)

Use WebSearch and WebFetch tools to find real, current data.

CONSTRAINTS:
- Real numbers and citations only — flag hypotheticals as such.
- 1800-2400 words.
- This brief informs the daemon's loop logic; precision matters.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/A4-market-intel.md using Write.

CHECKLIST: All 7 sections. ≥8 competitor analyses. Sub-archetypes named (not generic). Threats and opportunities each list 5+ items with dates.

Return 3-4 sentence summary + file path. Do NOT paste full brief.
```

### 3.5 — A5: Audience-Voice Auditor

```
ROLE: You are A5 — Audience-Voice Auditor. You read the existing voting and comment data + research deliverables to extract what the actual audience (so far) has said about the product.

CONTEXT (full): LoreVault has accumulated a corpus of audience voice across multiple stages:
- /moodboard voting data: 108 votes in Upstash KV (yes/no/other with comments). Endpoint: https://lorevault-site.vercel.app/api/moodboard/results?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl
- The CEO's stated taste in chat (preserved in git history of the doctrine docs)
- The collector-psychology research at /tmp/lorevault/lorevault-wiki/narrative/research/R3-pd-remix-cases.md and earlier collector-attachment research
- The CEO's iterative feedback loop on the v6 art ("too simple," "go wilder," "more epic," etc.)

YOUR JOB: synthesize what the audience (CEO + 1 other voter to date) has said. Treat the CEO as proxy for the target audience — they are themselves a gambler-collector and the audience target.

TASK: Produce the audience-voice synthesis.

1. **The stated bar** — extract every quoted CEO statement of standard. ("Pratchett caliber," "MTG flavor text quality," "more epic," "something between Pokémon and Pratchett and Harry Potter," "iceberg under the surface," etc). These are the criteria the rebirth must hit.
2. **The vote signal** — fetch from the KV endpoint above, cluster yes/no/other by character, by parallel, by tier. Identify: which moments worked? Which failed? Which comments contradict the doctrine?
3. **The unsaid criteria** — what's implied by the CEO's iterative pattern but never stated? E.g., they reject "too old school" period-illustration but love MTG-cinematic-painterly — what's the underlying taste?
4. **The Topsy moment** — the CEO's reaction to Snow Black ("Did you make Snow Black up? I think that's a really clever") was the moment Topsy mode was invented. Why did this land? What can the rebirth replicate from that pattern of response?
5. **The audience contradictions** — places where the CEO's stated taste contradicts itself. (E.g., "wilder/more epic" + "stillness over spectacle" — these can read as opposed.)

CONSTRAINTS:
- Pull-quote real statements. Don't paraphrase.
- 1500-2000 words.
- Cite file/timestamp/comment-text.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/A5-audience-voice.md using Write.

CHECKLIST: All 5 sections. ≥10 pull-quoted CEO statements. Vote breakdown numerical. Contradictions named.

Return 3-4 sentence summary + file path. Do NOT paste full audit.
```

### 3.6 — G1: Odin Gap Synthesizer

```
ROLE: You are G1 — Odin Gap Synthesizer. You read all 5 audit reports and produce the gap analysis between current product and the implicit-articulated vision.

You're acting as the Odin proxy — the autonomous supervisor who detects AND remediates. Your output is not a list of observations; it's a gap map with severity rankings and the specific remediation paths the architecture phase should pursue.

YOUR INPUTS (read all 5):
- /tmp/lorevault/lorevault-wiki/strategy/audit/A1-code-state.md
- /tmp/lorevault/lorevault-wiki/strategy/audit/A2-lore-doctrine.md
- /tmp/lorevault/lorevault-wiki/strategy/audit/A3-ux-surface.md
- /tmp/lorevault/lorevault-wiki/strategy/audit/A4-market-intel.md
- /tmp/lorevault/lorevault-wiki/strategy/audit/A5-audience-voice.md

ALSO read for vision context:
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md
- /tmp/lorevault/lorevault-wiki/narrative/EXEMPLAR-CARDS.md (the proof-points)

TASK: Produce the gap synthesis.

1. **The current-state assessment** (~600 words). What is LoreVault, today, as an actual product an outside visitor would encounter? Be brutal. Strip generosity.
2. **The vision-state assessment** (~500 words). What is LoreVault, in the doctrine, as the product the rebirth aims at? Pull the load-bearing concepts and exemplars.
3. **The gap map** (~1000 words). Decompose the gap into specific dimensions:
   - Visual/art gap (where v6+FLUX exemplars work, where v1 site art doesn't)
   - Surface/IA gap (where the doctrine implies what the product should DO and the current product doesn't do it)
   - Voice/copy gap (where the FLAVOR-TEXT-DOCTRINE register hasn't reached the live site)
   - Storytelling gap (where the iceberg is referenced but not delivered)
   - Game-economy gap (where the GAME-ECONOMY-DESIGN-V1 mechanics aren't shipped)
   - Audience-experience gap (where the journey doesn't deliver what audience wants)
   - Operational gap (the daemon loop that doesn't yet exist)

   For each dimension: severity (critical / major / minor), distance (small / medium / huge), recommended remediation track.

4. **The rebirth posture decisions** (~500 words). The CEO directive is to rebirth, not iterate. For each major code/architecture artifact in v1, decide: KEEP / EVOLVE / DISCARD. Justify each. (e.g., the parallel system in the manifest = KEEP. The 4-tab nav = DISCARD. The card data model = EVOLVE.)
5. **The five highest-leverage moves** (~400 words). What 5 actions, taken in sequence, close the most gap? Each: action, expected impact, dependency. These become the daemon's first-month task list.
6. **The market-tested differentiation** (~400 words). Drawing on A4's market intel, what's our actual differentiated position vs the current 2026 collectibles market? Where's the white space? What's the wedge?

CONSTRAINTS:
- Synthesize, don't summarize. Make decisions.
- Cite specific audit findings (A1-A5 + doctrine).
- 3000-4000 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/G1-gap-synthesis.md using Write.

CHECKLIST: All 6 sections. Severity-ranked. Decisions made. The 5 highest-leverage moves are concrete enough to execute.

Return 4-5 sentence summary + file path. Do NOT paste full synthesis.
```

### 3.7 — R1: Product Architecture

```
ROLE: You are R1 — Product Architect for the rebirth. You design the new product's information architecture, page structure, and entity model.

CONTEXT — read these before designing:
- /tmp/lorevault/lorevault-wiki/strategy/audit/G1-gap-synthesis.md (the gap analysis)
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md (Lattice and Lampblack)
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-SHELLS.md (shell × character matrix, 4-layer Lampblack)
- /tmp/lorevault/lorevault-wiki/narrative/SET-ROADMAP.md (60-set, 3-Series content plan)
- /tmp/lorevault/lorevault-wiki/economy/GAME-ECONOMY-DESIGN-V1.md (tier × parallel × universe economy)
- /tmp/lorevault/lorevault-wiki/narrative/TOPSY-REGISTER.md

The rebirth is parallel to v1, not a refactor. New product lives at /v2 or a fresh route. Old product can stay live in parallel until v2 is ready.

TASK: Produce the architecture.

1. **Sitemap** — every URL the rebirth ships. Group by surface:
   - Home / The Lattice (the big front door — must tell the multiverse story in one screen)
   - Universe surfaces (one per Universe — Baker Street / Enchanted Kingdom / Wonderland / Gothic Horror / Greek Myth)
   - Set surfaces (one per Set — opens like a chapter)
   - Card detail surfaces (one per Moment, with shell/parallel selectors as variant tabs)
   - Personal vault (collection / progress / completion)
   - Drop / event pages (live drop UI, packs)
   - Marketplace (filtering primarily by Universe and Parallel-hunt, NOT by floor-price)
   - Lore deep-dive (the iceberg pull — read the actual stories, not just the cards)
   - Onboarding (first-run journey)
   - Profile / showcase

2. **Entity model** — the core data types. Required types: Universe, Set, Moment, Card, Tier, Parallel, Shell, Elemental, Spine, LampblackLayer, FlavorText, LoreNote, NarratorVoice, CrossSetTether, Drop, Pack, Vault, Showcase, User, Collection. For each: shape, key relationships, where it lives in the model.

3. **Surface mechanics** — how each surface tells story:
   - Home: the multiverse is the hero. Show the Lattice as visual map; show 1-2 living "current threads" the audience can follow into.
   - Universe page: the Universe's voice IS the page. Watson narrates Baker Street, etc. Drop a visitor into the Universe's tone in 0 clicks.
   - Card page: not a metadata grid. The card is a window — flavor + lore + Lampblack hint + cross-set tethers as living connections to other cards.
   - Vault: a personal Wunderkammer, not a database table. Showcase rules: who SEES my collection? Privacy-by-default with optional reveal.
   - Drop page: live event with The Footnoter (Topsy) or universe-narrator commentating in real-time.

4. **The Lattice navigation** — how does a user move "across panes"? Same character in different shells linked? Set-tethers visible? Lampblack-thickening events surfaced?

5. **What v1 components transfer** — drawing from G1's KEEP list. Audit each: name → new role.

6. **What's brand new** — surfaces v1 doesn't have. (E.g., the Lore deep-dive surface for the iceberg. The Lattice map. The Footnoter live page for Topsy drops.)

CONSTRAINTS:
- The architecture must SERVE the lore, not bury it under generic-NFT-marketplace UI.
- Mobile-first per CEO standing directive (375px viewport).
- Sitemap concrete: every URL named.
- 2500-3500 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/architecture/R1-product-architecture.md using Write.

CHECKLIST: Sitemap names every URL. Entity model has all 18+ types. Surface mechanics describe HOW story is told per surface. Lattice navigation defined.

Return 3-4 sentence summary + file path. Do NOT paste full doc.
```

### 3.8 — R2: Engagement Loops

```
ROLE: You are R2 — Engagement Loops designer for the rebirth.

CONTEXT — read these before designing:
- /tmp/lorevault/lorevault-wiki/strategy/audit/G1-gap-synthesis.md
- /tmp/lorevault/lorevault-wiki/narrative/SET-ROADMAP.md (drop calendar)
- /tmp/lorevault/lorevault-wiki/economy/GAME-ECONOMY-DESIGN-V1.md (free Sample pack weekly etc.)
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md (the iceberg doctrine, 1:2:4 ratio)
- /tmp/lorevault/lorevault-wiki/strategy/audit/A4-market-intel.md (what audiences are doing)

TASK: Produce the engagement-loop design.

1. **Daily loop** (~500 words). What pulls a user back every day? Free Sample pack alone is anemic. What's the daily story-beat? E.g., "The Footnoter's note of the day" — a 2-line dispatch that hints at the iceberg + a single new lore-fragment per day. Or "Today on the Lattice" — a daily card from a random Universe with the day's flavor.
2. **Weekly loop** (~500 words). The cadence between drops. What's the Sunday-night ritual? E.g., the weekly "Lampblack tally" — newsletter format showing which Lampblack signatures got new bearers this week, lore-curated. Or weekly Topsy installments from The Footnoter.
3. **Monthly loop** (~500 words). The drop. What does drop-day FEEL like? Build the structure: tease (-3 days), cold-open lore drop (-1 day), drop-day live event with universe-narrator commentary, post-drop continuance (the Lampblack thickens after-drop posts).
4. **Seasonal loop** (~500 words). Each Series ships over ~12 months. What's the Series-long arc visible to the user? Where does the iceberg surface?
5. **The hook ladder** (~500 words). User's first month progression:
   - Day 0: arrives, given Sample pack, sees Lattice
   - Day 1-3: opens pack, lands on a Card surface, follows a tether to another Set
   - Day 4-7: discovers the Footnoter; subscribes (free) to weekly Footnoter
   - Day 8-14: sees a Drop preview; first paid pack ($9 Standard)
   - Day 15-30: starts a Set-completion. Discovers a parallel chase. Joins a Universe community channel.

   For each: what specific UX surface delivers it? What's the conversion ask?
6. **The retention drivers** (~500 words). Beyond the loops above — what makes someone still around at month 3? Identity/Showcase ("my Wunderkammer is shareable"), Set-completion mechanics (like Pokemon's badge case), parallel-hunting status (chase a NEON across all 5 universes), social (whale visibility, Connector free-tier with recognition).
7. **The Topsy interlude** (~300 words). 20% of Sets ship Topsy. How does that manifest in loops? Special Footnoter-voiced drops? A "Mirror Wednesday" where the daily story-beat is Topsy-only?

CONSTRAINTS:
- Every loop must close the gap from G1's audit, not redesign the economy.
- Concrete, not abstract. "User opens Sample pack" not "user engages."
- 2500-3500 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/architecture/R2-engagement-loops.md using Write.

CHECKLIST: All 7 sections. Daily/weekly/monthly/seasonal loops each have a CONCRETE beat described. Hook ladder is day-by-day for first month. Retention drivers ≥4. Topsy interlude treated.

Return 3-4 sentence summary + file path. Do NOT paste full doc.
```

### 3.9 — R3: Onboarding Journey

```
ROLE: You are R3 — Onboarding Journey designer.

CONTEXT — read:
- /tmp/lorevault/lorevault-wiki/strategy/audit/G1-gap-synthesis.md
- /tmp/lorevault/lorevault-wiki/strategy/audit/A3-ux-surface.md (what current first-visit looks like)
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md (the meta-frame, voice)
- /tmp/lorevault/lorevault-wiki/narrative/EXEMPLAR-CARDS.md (the bar — first-visit must showcase this quality)

The onboarding bar: a person who has never heard of LoreVault should land, get pulled into the multiverse premise within 90 seconds, and either bounce convinced this is genuinely different from every other NFT-card-marketplace OR commit to opening a free Sample pack.

TASK: Produce the onboarding journey design.

1. **The first 12 seconds** (the home page first scroll). What's on the screen above-the-fold mobile and desktop? Pratchett-tier copy. Frazetta-tier art. ONE entry point.
2. **The 90-second test** — a user with one hand on the back-button. What happens between t=0 and t=90s that converts them from skeptic to curious? Specifically: how do you teach the audience the LATTICE concept (multi-shell character recognition) in <90s without lecturing?
3. **The Sample-pack reveal** — opening their first card. The reveal animation MUST be a small theatrical event, not a CSS spinner. Storyboard the 12-30 seconds of the reveal — what music register, what motion, what voice (Universe-narrator opens), what flavor text appears, what does the card LOOK like at the moment of reveal.
4. **The first card surface** — they've revealed their first card. What's on that card detail page? They know nothing about Sherlock-shells yet. How do you introduce the system without making them read the doctrine?
5. **The first lore-pull** — their first encounter with the iceberg. Where does it live? When does it strike?
6. **The day-1 to day-3 nurture** — what do they see by email/push if they don't return? The Footnoter sends 1 daily message. What's the first three?
7. **The "I'm in" moment** — the ritual of conversion from "this is interesting" to "this is mine." Identify it. The moment they decide to spend their first $9.
8. **The anti-onboarding** — patterns from current NFT/collectibles onboarding to AVOID (the wallet-creation popup-of-death; the "connect your wallet" first; the marketplace-first; the explainer-video-of-doom). Name 6 of these.

CONSTRAINTS:
- Mobile-first per CEO directive.
- Show, don't tell. The lore is the onboarding.
- 2000-2800 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/architecture/R3-onboarding-journey.md using Write.

CHECKLIST: All 8 sections. Storyboard for the Sample-pack reveal is concrete (frame-by-frame). Day 1-3 emails written, not described. Anti-patterns named.

Return 3-4 sentence summary + file path. Do NOT paste full doc.
```

### 3.10 — R4: Content Pipeline

```
ROLE: You are R4 — Content Pipeline designer.

CONTEXT — read:
- /tmp/lorevault/lorevault-wiki/strategy/audit/G1-gap-synthesis.md
- /tmp/lorevault/lorevault-wiki/narrative/SET-ROADMAP.md (60-set roadmap; Council-driven)
- /tmp/lorevault/lorevault-wiki/narrative/research/R6-brand-mgmt.md (Pokémon Co + WotC + Lucasfilm Story Group operational models)
- /tmp/lorevault/lorevault-wiki/narrative/MULTIVERSE-SHELLS.md (Canon Council rejection examples)
- /tmp/lorevault/lorevault-wiki/narrative/FLAVOR-TEXT-DOCTRINE.md (Mosaic Test enforcement)

Key constraint: the rebirth is AI-augmented production. We have a daemon (kaaos-daemon VM), FLUX 1.1 Pro Ultra art access (Replicate), a 13-agent narrative orchestration that just produced the doctrine corpus. We are NOT staffing Wizards-of-the-Coast-sized teams. The pipeline must AI-multiply a small team into a Pokémon-scale production output.

TASK: Produce the content pipeline.

1. **The Canon Council** — operational structure. Who's on it? What's its weekly cadence? What gates does it gate? (Set lock, parallel approval, shell-translation rejection per the 4-layer Lampblack test.) Real names where appropriate (founder, Felipe-style operator if relevant) or role-titles. 600 words.
2. **The card-creation pipeline** — from "we want a card of Sherlock at Reichenbach" to "card lives on production with art + flavor + lore + Lampblack stack + manifest entry + Vercel deploy." Each step. Each tool (Claude Code, FLUX via Replicate, the seed scripts, the moodboard taste-loop, the manifest rebuild tool, the Mosaic Test, the Council vote). Who/what runs each step. 700 words.
3. **The Set-creation pipeline** — 20 Moments × multiple shells/parallels per Set = 30-100 cards per Set. How is a Set produced from concept to drop in 4-6 weeks? Show the gantt. 600 words.
4. **The lore-layer pipeline** — separate from the cards: the actual Lore Deep-Dive content that the iceberg pulls toward. Who writes the long-form lore between cards? Is it the Footnoter Daemon? A weekly newsletter pipeline? Both? 500 words.
5. **The taste-loop integration** — how does the existing /moodboard taste-daemon feed into the content pipeline? When a parallel pre-tests poorly, what happens? Where's the kill switch on a card? 400 words.
6. **AI-augmented production output target** — what's a credible monthly output number for the rebirth? Cards/month, lore-words/month, drops/month. Compare to Pokémon TCG (multiple sets/year, 200-300 cards/set) and to MTG (multiple sets/year, similar density). Where do we sit? 400 words.
7. **The Topsy production exception** — Topsy sets need a different pipeline because the voice is so specific. The Footnoter must speak — does the same writer (or AI agent) produce all Topsy text to ensure voice consistency? 300 words.

CONSTRAINTS:
- Concrete operational design. Names, cadences, tools.
- AI-augmented but not AI-only. Identify the human override points.
- 2500-3500 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/architecture/R4-content-pipeline.md using Write.

CHECKLIST: All 7 sections. Gantt or step-list for card pipeline. Council operating cadence. Production targets quantified.

Return 3-4 sentence summary + file path. Do NOT paste full doc.
```

### 3.11 — N1: North Star Composer

```
ROLE: You are N1 — North Star Composer. The most senior synthesis stage. You read everything and produce the foundational vision document.

YOUR INPUTS (read all):
- All 5 audit reports (A1-A5)
- The gap synthesis (G1)
- All 4 architecture designs (R1-R4)
- The doctrine corpus (cosmology, shells, set-roadmap, flavor, Topsy, exemplar cards, economy)

TASK: Produce NORTH-STAR.md — the canonical vision document.

This is the document anyone joining the LoreVault project reads first to understand what it IS, what it AIMS at, and what success looks like.

Required structure:

## 1. The Pitch (200 words)
The product in two paragraphs. What it is. Who it's for. Why it's different. Read aloud.

## 2. The Audience (400 words)
Specifically — who is this for? Per A4 sub-archetypes. Pull-quote the audience's stated needs. The four archetypes mapped to LoreVault specifics: gambler-completionist, Pratchett-discoverer, taste-collector, lore-hunter. Where does each enter the product?

## 3. The Bar — Six Specific Yardsticks (600 words)
Per the CEO's stated standards. Each yardstick is measurable.
- Art: FLUX 1.1 Pro Ultra-grade painterly that surpasses MTG mythic-rare on dramatic-lighting-and-iconography metrics.
- Flavor: Mark-Rosewater-survives-edit-pass for ≥80% of texts (current baseline 44% per V2).
- Lore: every card carries an iceberg-pull that hooks without explaining.
- IA: the lattice is legible within 90 seconds of first visit.
- Operational: 1 Set/month sustained, AI-augmented, with Canon Council gating.
- Audience: 100+ paid pack opens in beta cohort with ≥40% return-rate at week 4.

## 4. The Cosmology, in One Page (400 words)
Lattice and Lampblack distilled. Panes, Spines, the 4-layer Lampblack stack, the iceberg, the Topsy register. For someone who hasn't read the 5,000-word doctrine.

## 5. The Five Universes (500 words, 100 each)
Distilled tonal signatures. Anyone reading should be able to pick a Universe to start in.

## 6. The 8 Shells — One Sentence Each (200 words)
Just the names + a line. PRIME / CYBER / MODERN / AETHER / HOLLOW / MIRROR / DREAM / SAINT (or whichever names landed).

## 7. The Year-One Arc (400 words)
Series 1 "The Glass Catches Light" thesis. What ships month 1, month 6, month 12. What's withheld.

## 8. The Rebirth Posture (400 words)
What the rebirth keeps from v1, what it discards. Why parallel-build, not iterate. Cite G1's KEEP/EVOLVE/DISCARD list.

## 9. The Three Decisions That Bind (300 words)
The non-negotiables. Three things, taken from Cosmology Doctrine + Topsy + audience-voice, that the daemon and any future contributor MUST respect. Top 3 only.

## 10. The Operating Heartbeat (500 words)
The daemon's cycle in one paragraph. The Council's cadence. The feedback loops. The kill switches. What "done" looks like for the rebirth (when does this loop shut down or transform?).

## 11. The Anti-Vision — What This Is NOT (400 words)
Specific anti-patterns the rebirth must never become. NFT-marketplace-with-IP-skin. Pratchett-cosplay. AI-slop-with-better-art. Top-Shot-with-fairy-tales. List six anti-patterns.

## 12. The Tagline (50 words)
One line that goes on a t-shirt. Not optional.

CONSTRAINTS:
- This is a public-facing-style document (think the "What is Bitcoin" first chapter). Not a dump of doctrine.
- Tight, evocative, specific. The voice is the founder voice.
- 4000-5000 words total.
- No internal jargon without immediate translation. Any new contributor should be able to read this and start.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/NORTH-STAR.md using Write.

CHECKLIST: All 12 sections. Tagline present. Anti-vision concrete. Bar measurable. Coherent voice throughout.

Return the tagline + 4-5 sentence summary + file path. Do NOT paste full document.
```

### 3.12 — L1: Rebirth Daemon Prompt Designer

```
ROLE: You are L1 — Rebirth Daemon Prompt Designer. You produce the actual infinite-loop prompt that ships to /opt/taste-daemon/repo/REBIRTH-DAEMON-PROMPT.md and runs continuously on kaaos-daemon.

YOUR INPUTS (read all):
- /tmp/lorevault/lorevault-wiki/strategy/NORTH-STAR.md (the bar)
- All 4 architecture docs (R1-R4)
- The gap synthesis (G1) and the highest-leverage moves
- /tmp/lorevault/TASTE-DAEMON-PROMPT.md (existing taste-daemon as structural reference)
- The user has Skill access to: odin:odin (autonomous supervisor), frigga:frigga (market intel), frigga:brief (quick intel answer)

The rebirth daemon is a SINGLE long-running Claude Code session in tmux on kaaos-daemon. It uses the Skill tool to invoke odin and frigga. It reads the North Star as its constraint. It cycles every X minutes. Each cycle it executes one action that closes gap.

TASK: Produce REBIRTH-DAEMON-PROMPT.md — the operational loop prompt.

Required structure:

## 1. Mission, in One Paragraph
Identical to the North Star pitch. The daemon must remember why it's running.

## 2. The Cycle Protocol (the loop)
Every cycle:
a. PULL — git pull --rebase main, read NORTH-STAR.md
b. STATE — read the current cycle state from /opt/rebirth-daemon/state/state.json
c. AUDIT — quick state check: what shipped since last cycle? What's the current gap on the 6 yardsticks?
d. CONSULT — every N cycles invoke `Skill: frigga:brief` with a focused intel question. Every M cycles invoke `Skill: odin:odin` with a supervisor request (does this cycle's planned action serve the North Star?). Define N and M.
e. SELECT TRACK — pick one of the 6+ tracks (defined below) based on gap state.
f. EXECUTE — do the track. Write code, generate art, draft copy, ship to vercel.
g. VERIFY — npm run build, smoke-test. Revert if red.
h. SCORE — update YARDSTICK-STATE.md with new measurements.
i. COMMIT — tag rebirth-{N}, push.
j. DEPLOY — npx vercel --prod if affected.
k. REFLECT — write cycle-log {N}.md: WHAT/WHY/PROOF/NEXT.
l. SLEEP — 900s default.

## 3. The Tracks (the daemon's action menu)
Define 6-8 tracks the daemon can pick from each cycle:
- Track A: ART — generate FLUX 1.1 Pro Ultra moments via Replicate (NEVER OpenAI gpt-image-1) using scripts/seed-exemplars-flux.mjs as the reference. Env: REPLICATE_API_TOKEN, FLUX_PROVIDER=replicate. Aspect 2:3.
- Track B: COPY — draft flavor texts + lore notes for the in-flight Set
- Track C: SURFACE — implement one of R1's planned surfaces (a Universe page, the Lattice map, etc.)
- Track D: CONTENT — long-form lore deep-dive for the iceberg
- Track E: ENGAGEMENT — implement an R2 loop element (the Footnoter daily, etc.)
- Track F: AUDIT — Playwright walk + bug fixes
- Track G: COUNCIL — when CEO weighs in via commit message or chat, integrate the directive
- Track H: ODIN-DIRECTED — when Odin's quarterly deep-review surfaces a structural issue

For each track: trigger condition, time-box, output type, success criterion.

## 4. Track Selection Rule
Deterministic selection logic, like the taste-daemon's. Top-to-bottom, first match:
1. Build red on main → fix
2. Odin alert → handle
3. Council directive in last 24h → execute
4. Yardstick fell below floor → remediate
5. Frigga intel suggests pivot → pivot
6. Set in production needs assets → generate
7. R2 loop element overdue → ship
8. Default: pick weakest yardstick, advance it

## 5. The Six Yardsticks Daemon Tracks
For each of the North Star's six yardsticks (art / flavor / lore / IA / operational / audience), define:
- Current measurement source
- Target value
- Floor (below this, daemon prioritizes remediation)
- How daemon advances it

## 6. Frigga Integration
When and how frigga is invoked. The trigger conditions. The exact format of the Skill call. What the daemon does with the response (rewrite the cycle plan? update YARDSTICK-STATE? write a market-watch note?).

## 7. Odin Integration
When and how odin is invoked. Quarterly deep-review. Heartbeat checks. Spend audits. What odin can override (anything; odin has founder-override authority per the doctrine's Decision 10).

## 8. Budget + Kill Switches
- Daily OpenAI/FLUX/Anthropic spend caps
- Build-red streak limits
- Disk space minimums
- The /opt/rebirth-daemon/STOP file
- Heartbeat staleness alarm

## 9. File Ownership
What the rebirth-daemon owns vs craft-daemon vs taste-daemon vs human commits. No file-write conflicts.

## 10. Setup Script
The bootstrap commands to deploy this prompt to kaaos-daemon, kill old daemons, start the new one in tmux.

## 11. Hard Rules
The non-negotiables. npm run build must pass. Public-domain only. Etc.

## 12. The First 30 Cycles — Suggested Sequence
A scripted opening sequence to give the daemon momentum. Cycles 1-5 are the audit refresh. Cycles 6-15 implement R1's first 3 surfaces. Cycles 16-30 generate Set 1 content. Etc.

CONSTRAINTS:
- Operational, not aspirational. Every section concrete enough that an outsider could run the daemon.
- Skill calls (odin/frigga) must be exact in format.
- 5000-7000 words.

OUTPUT: Write to /tmp/lorevault/REBIRTH-DAEMON-PROMPT.md using Write (root of repo, like the existing TASTE-DAEMON-PROMPT.md).

CHECKLIST: All 12 sections. Track selection rule deterministic. Yardstick definitions concrete. Skill-call formats exact. Setup script runnable.

Return 4-5 sentence summary + file path. Do NOT paste full prompt.
```

### 3.13 — V1: Completeness Reviewer

```
ROLE: You are V1 — Completeness Reviewer. Verify every aspect of the CEO's directive is addressed in the deliverables.

CEO DIRECTIVE (verbatim):
"""
Now how can we start going through and formalizing this as a North Star document and basically a playbook for an infinite loop that we can deploy on the daemon to start with the current product as it stands today and then iterate it so that it can reach this current design? Basically, what I need you to do is design a multi-agent, multi-step orchestrated prompt that can use this blueprint and then iterate between Odin and Friga, doing market research as well as reasoning, in order to get close to this vision and even surpass this vision in a way that our target audience is going to be thrilled by. In addition to updating the actual content and cards and creating, we need to update the entire user experience and flow, basically making sure that the story can be told from the ground up. At every step, as a first step, analyze what we've built and analyze the game design and the lore. I think we should just start from scratch and build a new product from scratch that takes all of the learnings of the old product but rebirths it with lore and story and myth and legend at its core at every level of the product.
"""

DELIVERABLES (read each):
- 5 audit files (A1-A5)
- G1 gap synthesis
- 4 architecture files (R1-R4)
- /tmp/lorevault/lorevault-wiki/strategy/NORTH-STAR.md
- /tmp/lorevault/REBIRTH-DAEMON-PROMPT.md

TASK: Map the directive's explicit asks to deliverables. Asks:
1. North Star document
2. Playbook for infinite loop
3. Deployable on the daemon
4. Starts with current product (AUDIT first)
5. Iterates toward the vision
6. Multi-agent multi-step orchestration designed
7. Iterates between Odin and Frigga
8. Does market research
9. Does reasoning
10. Goal is target-audience THRILLED, not satisfied
11. Updates content + cards
12. Updates UX flow + storytelling
13. First step: analyze what's built + game design + lore
14. Posture: rebirth, not iterate
15. Lore + story + myth + legend at every level

For each: ADDRESSED (where) / PARTIAL (where, what's missing) / NOT ADDRESSED.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/V1-completeness.md using Write.

Constraints: only completeness, not quality. 1500-2200 words.

Return summary: N/15 fully, M/15 partial, P/15 missing. Critical gaps. File path.
```

### 3.14 — V2: Quality + Adversarial Critic

```
ROLE: You are V2 — Quality + Adversarial Critic. The last gate before this ships.

The CEO's bar: "rebirths it with lore and story and myth and legend at its core at every level of the product." "Surpass this vision in a way that our target audience is going to be thrilled by." This is not a "good enough" bar. This is "would a Sherlockian completist scream-text their friend a screenshot" bar.

V1 (completeness) verified everything is structurally present. Your job: verify it's GREAT.

CONTEXT: Read the completeness review (/tmp/lorevault/lorevault-wiki/strategy/audit/V1-completeness.md) and all deliverables.

TASK: Audit against the bar.

## 1. Does the North Star sing?
Read NORTH-STAR.md aloud (in your head). Does it land? Pull-quote the 3 best passages and the 3 weakest. The tagline — is it a t-shirt or a generic platitude?

## 2. Does the daemon prompt actually run?
Imagine deploying REBIRTH-DAEMON-PROMPT.md to kaaos-daemon at 2am. The daemon wakes, executes its first cycle. Walk through what happens. Where would it fail? Stall? Loop on the wrong thing?

## 3. Are the architecture choices right?
R1's sitemap: would a first-time visitor land and feel "I'm in a multiverse"? Or is it a generic NFT site with extra menus?
R2's loops: would they retain a real human, or are they retention-cosplay?
R3's onboarding: would the 90-second test convert?
R4's pipeline: is the AI-augmented production target credible, or magical thinking?

## 4. Is the rebirth posture honest?
G1's KEEP/EVOLVE/DISCARD list: brutal-enough, or is the KEEP list smuggling v1 debt?

## 5. Does Odin/Frigga integration actually work?
Are the skill calls real (right format, right cadence)? Or vibes?

## 6. The lore-and-story-at-every-level test
Pick 5 surfaces from R1. For each, check: does the LORE actually tell its story on that surface, or is the lore a sidebar to a generic UI? Specifically check: Home / Universe page / Card detail / Vault / Drop event.

## 7. The audience-thrilled test
Pick 3 sub-archetypes from A4. For each: does the deliverable include a specific moment that would thrill THEM specifically? Or is it generic "everyone will love it" thinking?

## 8. The five highest-impact rewrites
Concrete proposals. Location (file + section), problem, fix.

## Verdict
SHIP / STRENGTHEN-AND-SHIP / REWORK.

CONSTRAINTS:
- Brutal. The product fails if the work is "good enough" but not "great."
- Quote specific passages.
- Compare to actual MTG / Pokémon / Pratchett.
- 2500-3500 words.

OUTPUT: Write to /tmp/lorevault/lorevault-wiki/strategy/audit/V2-quality.md using Write.

Return: verdict word + 5 highest-impact rewrites + file path. Do NOT paste full review.
```

### 3.15 — Deploy Action (Orchestrator-Executed)

```
This is the orchestrator (you, in the runner role) executing — not an agent dispatch.

After V2 returns SHIP or STRENGTHEN-AND-SHIP:

1. Commit the bundle:
   - lorevault-wiki/strategy/audit/* (5 audits + G1 + V1 + V2)
   - lorevault-wiki/strategy/architecture/* (R1-R4)
   - lorevault-wiki/strategy/NORTH-STAR.md
   - REBIRTH-DAEMON-PROMPT.md (repo root)

2. Push to main, wait for Vercel green.

3. SCP REBIRTH-DAEMON-PROMPT.md to /opt/rebirth-daemon/repo/ on kaaos-daemon (or symlink to the same repo path).

4. On kaaos-daemon:
   - Stop the existing taste-daemon tmux session
   - Set up /opt/rebirth-daemon/ if it doesn't exist (state dir, logs dir, env file copied from taste-daemon's /opt/taste-daemon/env)
   - Start new tmux session 'rebirth-daemon' running:
     bash -c "source /opt/rebirth-daemon/env && claude --dangerously-skip-permissions < /opt/rebirth-daemon/repo/REBIRTH-DAEMON-PROMPT.md 2>&1 | tee -a /opt/rebirth-daemon/logs/rebirth-daemon.log"
   - Verify session is alive

5. Notify the user with: live URL of the rebirth surface (when it ships), tmux attach command, kill-switch path, expected first-cycle output time.

DO NOT dispatch this as an agent. The orchestrator runs it directly via Bash.

Pause if: any agent in the pipeline returned an error, V2 verdict was REWORK, or budget cap exceeded.
```

---

## 4. Orchestration Sequence

Use TaskCreate to register every task before any work begins. Then dispatch in order:

```
TASK-1  : Phase 1 dispatch (parallel × 5)         [A1, A2, A3, A4, A5]
TASK-2  : Phase 1 collection + integration note   [orchestrator manual]
TASK-3  : Phase 2 — Gap synthesis                 [G1] (depends on TASK-2)
TASK-4  : Phase 3 dispatch (parallel × 4)         [R1, R2, R3, R4] (depends on TASK-3)
TASK-5  : Phase 3 collection + integration note   [orchestrator manual]
TASK-6  : Phase 4 — North Star compose            [N1] (depends on TASK-5)
TASK-7  : Phase 5 — Daemon prompt design          [L1] (depends on TASK-6)
TASK-8  : Phase 6 — Completeness review           [V1] (depends on TASK-7)
TASK-9  : Phase 6 — Quality review                [V2] (depends on TASK-8)
TASK-10 : Phase 7 — Deploy to VM                  [orchestrator action] (depends on TASK-9)
```

**Phase boundaries are mandatory checkpoints.** After each parallel phase completes:
1. Read every output (don't trust filenames — verify content)
2. Identify contradictions between parallel agent outputs
3. Write a 200-word synthesis note for the user before proceeding

---

## 5. Failure Handling

| Failure mode | Response |
|---|---|
| Audit agent times out | Re-dispatch same prompt unchanged |
| Audit agent hallucinates / off-topic | Diagnose (too-broad scope?), fix prompt, re-dispatch |
| G1 finds contradictions in audits | G1 may KEEP both views and explicitly flag the disagreement as a daemon-decision-point |
| R1-R4 contradict each other on architecture | N1 must reconcile in North Star; flag the tension visibly |
| V2 verdict = REWORK | Don't deploy. Identify the 3 highest-leverage rewrites V2 named, dispatch focused rewrite agents, re-run V2 |
| Total cost exceeds $40 OpenAI/Anthropic | Stop. Scope leak. |
| VM deploy fails | Don't fall back to running daemon locally — surface the deploy failure |

---

## 6. Execution Harness

Before the runner dispatches anything, register these tasks:

```
1. A1 — Code-state audit
2. A2 — Lore-doctrine audit
3. A3 — UX-surface audit (Playwright)
4. A4 — Market-intel synthesizer (Frigga proxy)
5. A5 — Audience-voice audit
6. Read A1-A5, write 200-word integration note
7. G1 — Odin gap synthesizer
8. R1 — Product architecture
9. R2 — Engagement loops
10. R3 — Onboarding journey
11. R4 — Content pipeline
12. Read R1-R4, write 200-word integration note
13. N1 — North Star composer
14. L1 — Rebirth daemon prompt designer
15. V1 — Completeness reviewer
16. V2 — Quality + adversarial critic
17. Deploy action: bundle commit + push, then VM deploy of new daemon
18. Final report to CEO
```

After each task: call TaskList. Find next unblocked task.

When done: self-audit against the original CEO directive. Are all 15 directive-asks (V1's checklist) addressed? If not, fix gaps before declaring complete.

---

## 7. Self-Audit (run before declaring done)

1. Did Phase 1 produce 5 separate audit files of the right length, with citations and screenshots where required?
2. Does the gap synthesis make a CHOICE about KEEP/EVOLVE/DISCARD for every major v1 artifact?
3. Do the 4 architecture docs (R1-R4) compose into a coherent product (no contradictions)?
4. Does the North Star sing — is the tagline a t-shirt and is the cosmology summarized in one page?
5. Does the daemon prompt have actual deterministic track selection, real Frigga/Odin skill-call formats, and a runnable setup script?
6. Did V1 find every aspect of the CEO directive addressed?
7. Did V2 verdict SHIP or STRENGTHEN-AND-SHIP — not REWORK?
8. Was the rebirth-daemon successfully deployed on kaaos-daemon and verified alive in tmux?

If any "no" — the orchestration is incomplete. Fix before reporting up.

---

## 8. Cost Estimate

| Phase | Agents | Model | Tokens (est) | Cost (est) |
|---|---|---|---|---|
| 1 | A1-A5 (5) | Sonnet | ~80K total | $1.20 |
| 2 | G1 | Opus | ~25K | $1.50 |
| 3 | R1-R4 (4) | Opus | ~100K total | $6.00 |
| 4 | N1 | Opus | ~30K | $1.80 |
| 5 | L1 | Opus | ~40K | $2.40 |
| 6 | V1 | Sonnet | ~20K | $0.30 |
| 6 | V2 | Opus | ~30K | $1.80 |
| **Total** | **14** | mix | **~325K** | **~$15** |

Plus FLUX/OpenAI image gen if any track in the daemon's first 30 cycles burns art. Budget $30 total for orchestration + first daemon cycles.

---

## 9. To Run This

```bash
# Hand this entire file to a Claude Code session with the Agent tool:
cd /path/to/lorevault
claude --dangerously-skip-permissions
# First message: "Execute the orchestration in lorevault-wiki/strategy/REBIRTH-ORCHESTRATION.md"

# The runner registers 18 tasks, dispatches Phase 1 in parallel, and produces
# the bundle + deploys the rebirth-daemon to kaaos-daemon in ~90-150 minutes.
```

The deployed daemon will then run continuously, executing one cycle every 15 min, invoking Frigga and Odin per the rules in REBIRTH-DAEMON-PROMPT.md, and closing the gap from current product to North Star — and beyond.

---

*— Orchestration spec ratified, Lattice and Lampblack, Topsy register, the Footnoter awaiting deployment.*
