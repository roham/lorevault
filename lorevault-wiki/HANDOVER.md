# LoreVault — Cross-Session Handover

**Last updated**: 2026-04-25
**Source**: end-of-session checkpoint by the prior assistant; CEO-directed.
**Purpose**: Anyone (a fresh Claude session, a colleague, a returning operator) can import this and continue without context loss.

> **READ THIS FIRST.** The CEO has explicitly directed the next session not to jump back into image generation. Do Section 0 first.

---

## 0. The Next Session's First Task — VERBATIM CEO DIRECTIVE

Quoted, almost word-for-word, so future sessions hear it from the CEO not paraphrased:

> *"While the visual style is getting to be good, we need some creative direction and art direction guidelines, or an art direction review step that takes a given game and economy design when it comes to the rarity of the assets, the need for the parallels, the differentiation between the tiers, the importance of the more expensive tier looking more premium. All of these natural best practices that are known for a product like this, like a collectible card product and a collectible card game — we need to enforce them in the commissioning of the creative.*
>
> *The first task of the next session will be to continue the image generation, but* ***do the work and write a prompt to do research and lock in a full content roadmap and commission the necessary arts accordingly.***
>
> *As an example of the kinds of problems that this review structure needs to prevent: because I had earlier in the session said that I like the ARCANA motif, it is now appearing in many, many of the proposed creative. The ARCANA motif is something that should be reserved only for a given set of high-end parallels, because it looks so distinctive. People are going to get tired of it if it's too prevalent.*
>
> *What I think best practices would tell us is that it will be cheaper, it will be better, for cheaper moments or cheaper assets to also be plainer — and then for there to be a clear design system that translates what assets we actually need."*

### What this means concretely for the first task

1. **Do not generate any new card art** until an Art Direction Review document exists and has gated the commissioning.
2. **Produce an Art Direction & Commissioning Doctrine** that (a) defines per-tier art-density floors and ceilings (Common = plain; Ultimate = maximalist), (b) reserves specific parallels (especially ARCANA) to specific tiers and shells, (c) gives the daemon a deterministic test it must pass before commissioning ANY image.
3. **Lock the Series-1 content roadmap** at card-level: every Moment × Tier × Parallel cell that will ship in Series 1, with its prescribed art-density level and which provider (FLUX or OpenAI) it routes to.
4. **Commission accordingly** — only AFTER the doctrine + roadmap are locked. Daemon Track A reads this gate.

### The orchestration shape for this task (Thoth pattern)

Use the same Fan-Out → Pipeline → Two-Stage Review pattern that's worked for the prior orchestrations.

Suggested phases:
- **Phase 1 (Fan-Out, 3-4 parallel research agents)** — collectible-card design canon (MTG mythic-rare vs common art density patterns), Top Shot tier visual differentiation, Pokémon TCG rarity art conventions, art-density-and-tier psychology research
- **Phase 2 (Synthesis)** — Art Direction Doctrine: a per-tier art-density rubric, per-parallel reservation rules, the Mosaic Test extended to art (not just flavor)
- **Phase 3 (Map-Reduce)** — apply the doctrine to every Moment in SET-ROADMAP.md (60 sets × 20 Moments) → produce a commissioning manifest of (Moment, Tier, Shell, Parallel, density-level, provider, prompt-template-class)
- **Phase 4 (Review)** — V1 completeness, V2 quality (does this prevent the ARCANA-overprevalence failure mode?)
- **Phase 5 (Daemon update)** — extend Track A in REBIRTH-DAEMON-PROMPT.md to consume the commissioning manifest as a hard gate

### The specific failure mode this prevents

The CEO mentioned offhand at one point that ARCANA (sacred-geometry mandala behind character's head) was visually striking. The agents read that as a directive and applied ARCANA-style backgrounds to many proposed images across all tiers. Result: the distinctive look becomes wallpaper. The prevention rule the new doctrine must enforce: **ARCANA appears ONLY on the ARCANA parallel of Rare+ Moments. It MUST NOT appear on Common base art, Common-tier parallels, or as background flourish on non-ARCANA parallels.** Same logic to other parallels: AETHER reserved to AETHER parallel; sacred geometry, occult sigils, divine particulate are PARALLEL signals, not house style.

---

## 1. What LoreVault Is — One Paragraph

LoreVault is a digital collectibles product (Magic: The Gathering meets NBA Top Shot) built on public-domain literary characters: Sherlock Holmes, Alice in Wonderland, the Brothers Grimm cast, Dracula and Gothic horror canon, Greek mythology. The cosmological frame is **the Lattice and Lampblack** — every character exists in multiple "Panes" (universe-shells: Victorian, cyber, modern, mythic, etc.), held together by their **Lampblack** — a 4-layer recognition stack (Silhouette / Props / Gesture / Spine) that survives every shell-translation. Cards = collectible artifacts with FLUX-grade art + MTG-grade flavor text + iceberg lore-pulls + tier-weighted rarity + cross-cutting parallels. The North Star tagline: **"Every figure you half-remember is a figure with a Spine. The Lampblack is what proves they are."**

Full vision: [`lorevault-wiki/strategy/NORTH-STAR.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/strategy/NORTH-STAR.md)

---

## 2. Locations + URLs + Access

### Repos / paths
| | |
|---|---|
| GitHub repo | `github.com/roham/lorevault` (public) |
| Local checkout | `/tmp/lorevault` (cloned via `gh repo clone roham/lorevault`) |
| VM repo (daemon) | `/opt/rebirth-daemon/repo` on `kaaos-daemon` VM |
| Live site | `https://lorevault-site.vercel.app` |

### Live URLs
| Surface | URL |
|---|---|
| Home (v1) | `https://lorevault-site.vercel.app/` |
| /v2 shell (rebirth) | `https://lorevault-site.vercel.app/v2` (just shipped in cycle 6, minimal) |
| Mood-board (v6 art voting) | `https://lorevault-site.vercel.app/moodboard?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl` |
| Moodboard results admin | `https://lorevault-site.vercel.app/moodboard/results?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl` |
| Exemplar showcase (5 hero cards) | `https://lorevault-site.vercel.app/prototype/exemplars?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl` |
| Head-to-head FLUX vs OpenAI | `https://lorevault-site.vercel.app/prototype/headtohead?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl` |
| Art pool (89 mixed images) | `https://lorevault-site.vercel.app/prototype/art-pool?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl` |

### Auth + secrets
The single shared **`MOODBOARD_TOKEN`**: `km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl` — gates all `?k=` URLs and all `/api/{moodboard,art-pool,headtohead}/*` endpoints.

Secrets ALREADY persisted (do not re-paste):
- **Laptop** `~/.zshenv`: `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `FLUX_PROVIDER=replicate`
- **VM** `/opt/taste-daemon/env` AND `/opt/rebirth-daemon/env` (cloned from taste-daemon's env): `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `FLUX_PROVIDER=replicate`, `MOODBOARD_TOKEN`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `ANTHROPIC_API_KEY`
- **Vercel production env**: `MOODBOARD_TOKEN`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`

### Daemon VM
```bash
gcloud compute ssh --tunnel-through-iap kaaos-daemon \
  --project dl-kaaos --zone us-central1-a
```

Watch the rebirth-daemon: `tmux attach -t rebirth-daemon`
Soft-stop: `touch /opt/rebirth-daemon/STOP`
Hard-stop: `tmux kill-session -t rebirth-daemon`

---

## 3. The Doctrine Corpus

All foundational documents live under `lorevault-wiki/`. In dependency order:

| Document | What it establishes |
|---|---|
| [`economy/GAME-ECONOMY-DESIGN-V1.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/economy/GAME-ECONOMY-DESIGN-V1.md) | 5 universes / 4 tiers (Common 15K mint / Rare 2.5K / Legendary 250 / Ultimate 25) / 5 parallels (ARCANA / AETHER / WITNESS / NEON / 1/1 ONE-OFF) / pack tiers |
| [`narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/narrative/MULTIVERSE-COSMOLOGY-DOCTRINE.md) | Lattice + Lampblack meta-frame, 8 shells, 1:2:4 iceberg ratio, 15 binding decisions |
| [`narrative/MULTIVERSE-SHELLS.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/narrative/MULTIVERSE-SHELLS.md) | Shell × character matrix (8×20), the 4-layer Lampblack stack (Silhouette / Props / Gesture / Spine), 6 elementals (REASON / WONDER / SHADOW / RAPTURE / FATE / WILD), Canon Council rejection examples |
| [`narrative/SET-ROADMAP.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/narrative/SET-ROADMAP.md) | 60 named sets across 3 Series × 5 Universes × 4 sets-per-Series. 36-month drop calendar. Series 1 thesis: *"The Glass Catches Light"* |
| [`narrative/FLAVOR-TEXT-DOCTRINE.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/narrative/FLAVOR-TEXT-DOCTRINE.md) | 5 universe voices (Watson chronicling, Grimm bone-rhyme, Liddell logic, epistolary fragments, bronze-tongue Hesiod), 12 archetypes, 75+ samples, "Mosaic Test" enforcement |
| [`narrative/EXEMPLAR-CARDS.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/narrative/EXEMPLAR-CARDS.md) | 5 fully-spec'd shippable cards demonstrating the system end-to-end |
| [`narrative/TOPSY-REGISTER.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/narrative/TOPSY-REGISTER.md) | 20% of Sets ship Pratchett-grade satirical voice via **The Footnoter** narrator; MIRROR/DREAM-shell only; one-axis-inversion rule; Snow Black is the seed |
| [`strategy/NORTH-STAR.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/strategy/NORTH-STAR.md) | 12-section foundational vision (pitch / audience / 7 yardsticks / cosmology one-pager / 5 universes / 8 shells / Year-1 arc / rebirth posture / 3 binding decisions / operating heartbeat / anti-vision / tagline) |
| [`strategy/REBIRTH-ORCHESTRATION.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/strategy/REBIRTH-ORCHESTRATION.md) | The 14-agent orchestration spec that produced the strategy bundle |
| [`strategy/architecture/R1-product-architecture.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/strategy/architecture/R1-product-architecture.md) | 37 URLs across 12 surfaces; `/v2` is the parallel-build root |
| [`strategy/architecture/R2-engagement-loops.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/strategy/architecture/R2-engagement-loops.md) | Daily/weekly/monthly/seasonal loops; Jonathan's Journal seeded May 3 2026 (Dracula Daily playbook) |
| [`strategy/architecture/R3-onboarding-journey.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/strategy/architecture/R3-onboarding-journey.md) | 90-second test, sample-pack reveal storyboard, Day 1-3 emails written |
| [`strategy/architecture/R4-content-pipeline.md`](https://github.com/roham/lorevault/blob/main/lorevault-wiki/strategy/architecture/R4-content-pipeline.md) | 4-seat Canon Council (Canon Lead / Voice Lead / Footnoter Voice Lead / Art Director); 9-step card pipeline; output target 40-60 Moments/month |
| [`strategy/audit/`](https://github.com/roham/lorevault/tree/main/lorevault-wiki/strategy/audit) | A1-A5 + G1 (gap synthesis) + V1 (completeness) + V2 (quality) — the rebirth's audit foundation |
| [`narrative/research/`](https://github.com/roham/lorevault/tree/main/lorevault-wiki/narrative/research) | R1-R6 from the prior narrative orchestration: multiverse conventions, world-builders, PD remix cases, TikTok zeitgeist, MTG flavor anatomy, IP brand mgmt |
| [`REBIRTH-DAEMON-PROMPT.md`](https://github.com/roham/lorevault/blob/main/REBIRTH-DAEMON-PROMPT.md) (repo root) | The infinite-loop prompt deployed on the daemon |

---

## 4. The Orchestration Pattern (How We Work)

When the user says "design a multi-agent prompt to do X," reach for **Thoth's Fan-Out → Pipeline → Two-Stage Review** pattern:

1. **Fan-Out research** (3-6 parallel agents, each owning one independent domain) → write to `research/` files
2. **Synthesis** (1 Opus agent) → reads all research, makes DECISIONS not options, writes the foundation doc
3. **Architecture / design** (3-4 parallel agents) → produce the operational artifacts
4. **North-Star or final compose** (1 Opus agent) → reads architecture, produces the public-facing canonical doc
5. **Two-Stage Review** — V1 completeness (Sonnet, against the original brief), V2 quality (Opus, brutal, returns SHIP / STRENGTHEN-AND-SHIP / REWORK with named rewrites)
6. **Apply rewrites** (1 focused-edit agent for STRENGTHEN-AND-SHIP)
7. **Deploy** if applicable

Two orchestrations have shipped this way:
- **Narrative orchestration** (13 agents) → produced cosmology/shells/sets/flavor/Topsy/exemplars
- **Rebirth orchestration** (14 agents) → produced strategy bundle + REBIRTH-DAEMON-PROMPT

The next major orchestration (Art Direction & Commissioning Doctrine — see Section 0) follows the same pattern.

**Critical orchestration rule**: each Agent dispatch is SELF-CONTAINED (no shared state, no "read another agent's output"). Phase boundaries are checkpoints — the orchestrator reads outputs and writes a 200-word integration note before dispatching the next phase. Models: Sonnet for research / completeness review; Opus for synthesis / quality / architecture.

---

## 5. The Daemon

### Where it lives
- VM: `kaaos-daemon` (GCP, project `dl-kaaos`, zone `us-central1-a`)
- Path: `/opt/rebirth-daemon/`
- Tmux session: `rebirth-daemon`
- Loop wrapper: `/opt/rebirth-daemon/loop.sh` (bash `while true` re-invoking claude per cycle — IMPORTANT: `claude < prompt` is single-turn; the bash loop is what makes it infinite)
- Prompt: `/opt/rebirth-daemon/repo/REBIRTH-DAEMON-PROMPT.md` (rebuilt from `git pull` each cycle)
- State: `/opt/rebirth-daemon/state/state.json` + `/opt/rebirth-daemon/state/heartbeat.txt`
- Logs: `/opt/rebirth-daemon/logs/rebirth-daemon.log`

### Cycle protocol (12 steps)
PULL → STATE → AUDIT → CONSULT (Frigga every 8, Odin every 24) → SELECT TRACK → EXECUTE → VERIFY (`npm run build`) → SCORE → COMMIT (tag `rebirth-{N}`) → PUSH → DEPLOY (Vercel auto-deploys from main) → REFLECT (`cycle-logs/cycle-{N}.md`) → SLEEP 900s

### 8 tracks (deterministic selection — first match top-to-bottom)
1. Build red → fix
2. Odin alert → handle
3. Council directive in last 24h → execute
4. Yardstick below floor → remediate
5. Frigga intel suggests pivot → pivot
6. Set in production needs assets → generate (Track A)
7. R2 loop element overdue → ship (Track E)
8. Default → weakest yardstick

Tracks: A (ART, FLUX-only), B (COPY), C (SURFACE), D (CONTENT — long-form lore), E (ENGAGEMENT — R2 loop elements), F (AUDIT — Playwright), G (COUNCIL — CEO directives), H (ODIN-DIRECTED).

### Frigga + Odin in-loop
- Frigga: every 8 cycles, `Skill: frigga:brief` with focused intel question
- Odin: every 24 cycles standard + every 96 cycles `odin:deep-review`. Founder-override authority.

### Daemon progress so far (as of 2026-04-25)
- Cycle 1 (`rebirth-1`): baseline Playwright audit, YARDSTICK-STATE init, `scripts/rebirth-audit-walk.mjs`
- Cycle 2-4 (`rebirth-2..4`): 12/20 BS-1 FLUX renders
- Cycle 5 (`rebirth-5`): 8 BS-1 flavor texts + lore notes
- Cycle 6 (`rebirth-6`): **/v2 route shell live** (was the critical /v2 → 404 gap)
- Cycle 7 in flight at last check
- Spend: $0.48 daemon Anthropic + $5-6 daemon FLUX

### Known launcher gotcha (FIXED, but worth knowing)
The original launch used `claude --dangerously-skip-permissions < REBIRTH-DAEMON-PROMPT.md` which is single-turn. Cycle 1 ran, claude exited, tmux died. Fixed via `loop.sh` bash wrapper. **Any future daemon you deploy must use the `loop.sh` pattern, not stdin redirect.**

### Known git gotcha (FIXED)
Multiple writers to main (daemon + craft-daemon + human + my session) caused merge conflicts. The loop.sh now does `git stash drop && git fetch && git reset --hard origin/main` at the top of every cycle. Daemon cycles always commit before sleep so this is safe.

---

## 6. Image Generation — BINDING STANDARD

**FLUX 1.1 Pro Ultra via Replicate is canonical for daemon use.** OpenAI gpt-image-1 is for **comparison only** (head-to-head pages, art-pool research).

### Why
- FLUX accepts darker/mythic content (OpenAI moderation blocks ~10-15% of LoreVault prompts)
- FLUX is concurrent-friendly (Replicate scales freely; no rate limits hit yet)
- FLUX is ~4× cheaper ($0.04 vs $0.17)
- Quality verified: head-to-head comparison surface live; both have interesting dynamics — exactly why the high-volume art-pool exists, to learn per-archetype routing

### Scripts
| Script | Purpose |
|---|---|
| `scripts/seed-exemplars-flux.mjs` | The 5 hero exemplar cards (run once; canonical reference) |
| `scripts/seed-exemplars.mjs` | Old gpt-image-1 version — DEPRECATED, kept for archive |
| `scripts/seed-moodboard.mjs` | Old v2-v6 mood-board generator (gpt-image-1) — DEPRECATED |
| `scripts/seed-headtohead.mjs` | Same prompt → both providers in parallel for blind A/B comparison |
| `scripts/seed-art-pool.mjs` | High-volume mixed-provider generator (default 70% FLUX / 30% OpenAI; seeded RNG; tags each manifest item with provider field) |
| `scripts/rebuild-manifest.mjs` | Recovery tool: reconstructs manifest.json from on-disk webp files |

### Current art inventory on disk
- `public/moodboard-art/` — 268 images across promptVersions 1-6 (history; user already voted; mostly v6 is what's served)
- `public/prototype-art/exemplars/` — 5 FLUX hero cards
- `public/prototype-art/headtohead/` — 10 images (5 pairs, FLUX + OpenAI)
- `public/prototype-art/pool/` — **89 images** (70 FLUX + 19 OpenAI) ← latest seed; the next session may want to regenerate this against the Art Direction Doctrine
- BS-1 daemon-generated cards — 12 FLUX renders in the daemon's working directory

### KV stores (votes data)
- `lorevault:moodboard:votes` — old moodboard, ~160 votes
- `lorevault:headtohead:votes` — head-to-head A/B
- `lorevault:art-pool:votes` — high-volume y/n/other

---

## 7. The Seven Yardsticks

The daemon optimizes against these. Each has a current measurement source, target, and floor.

| # | Yardstick | Target | Floor | Track |
|---|---|---|---|---|
| 1 | Art quality | FLUX-grade painterly surpassing MTG mythic-rare | 60% / via art-pool yes-rate | A |
| 2 | Flavor quality | ≥80% Mark-Rosewater-survives-edit-pass | 50% | B |
| 3 | Lore depth | Every card carries iceberg-pull | manual audit | D |
| 4 | IA legibility | Lattice legible in 90 seconds first-visit | manual + Playwright | C, F |
| 5 | Operational | 1 Set/month sustained, AI-augmented, Council-gated | quarterly Council audit | C/D mix |
| 6 | Audience conversion | Stepped: 15% Series-1 month-1 → 25% month-6 → 35% Series-2 (email-subscription proxy) | 10% | E |
| 7 | **Thrilled** (new) | ≥15% of beta-cohort post unprompted within 30d | 5% | A + B |

State file: `lorevault-wiki/strategy/YARDSTICK-STATE.md` (cold-start at cycle 1; daemon updates each cycle).

---

## 8. Conventions + How the User Works

- **Auto mode** is the user's default. Execute autonomously, minimize interruptions, prefer action over planning.
- **Mobile-first 375px** for any UI work. Desktop is the superset.
- **Public-domain only.** Pooh = Milne 1926 / Shepard era, NEVER Disney. No living-celebrity likenesses.
- **Push discipline**: tail every `git push`. Multiple writers to main; rebase before push; conflicts are expected.
- **Commit author**: `Roham <1077905+roham@users.noreply.github.com>` — GitHub blocks `r@dapperlabs.com` as private email. Always include `-c user.email=...` and `-c commit.gpgsign=false` in git commits.
- **Recap appreciation** (per memory): user likes session recaps; write them at session start/end.
- **Don't ask permission for things already greenlit.** "Build X and deploy it" means execute the entire pipeline.
- **Frustration markers**: F-words / cursing in user messages = failure beacon. Diagnose, don't argue.
- **Checkpoint every substantive answer** to `kaaos-knowledge/answers/<topic>/YYYY-MM-DD-HHMM-slug.md` per memory.
- **Memory location**: `/Users/ro/.claude/projects/-Users-ro-Library-CloudStorage-GoogleDrive-r-axiomzen-co-Other-computers-My-Mac--1--claude-conversations/memory/`
- **No blockquote for copy-paste output** (per memory). Plain text or code block.
- **Holistic doc review**: when editing contracts/frameworks, do a full coherence pass before delivering.
- **Stop stopping mid-pipeline**: once a multi-step plan is greenlit, execute to completion.

---

## 9. Open V2 Rewrites Status (still pending)

V2 of the narrative orchestration named 5 high-impact rewrites. Status:

1. ✅ **4-layer Lampblack stack** — applied (`MULTIVERSE-SHELLS.md` §3 rewritten)
2. ⏳ **Lampblack as force, not residue** — NOT YET APPLIED. Need 1 paragraph in cosmology §1 showing Lampblack ACTING on a figure (e.g., "Sherlock-PRIME dreams of a visor he cannot remember reaching for").
3. ⏳ **First flavor-text sample replacement** — NOT YET APPLIED. Replace the watch-deduction sample with a Watson-Afghanistan-Lampblack deduction.
4. ⏳ **The Lampblacker's Spine** — NOT YET APPLIED. GH-7 commits to the anchor character; no Spine published. Load-bearing risk per A2 audit.
5. ⏳ **Iceberg quarterly Council audit (Decision 16)** — NOT YET APPLIED. Need ≥12 Echo + ≥24 Deep elements per Series with screenshot proof.
6. ⏳ **Wonderland mode-2 philosophical register** — INTERSECTS WITH TOPSY. The Topsy doctrine assigned The Footnoter as the Pratchett-grade voice; this Wonderland-specific carve-out is now ambiguous. Decide.

V2 of the rebirth orchestration named 5 different rewrites — ALL APPLIED:
1. ✅ NORTH-STAR §1 ¶2 experiential paragraph
2. ✅ R1 §4.1 Lattice mobile rendering (column → 2:3 painted illustration)
3. ✅ R3 §5 stepped Y6 conversion target (15→25→35%)
4. ✅ R4 §7 split Voice Lead from Footnoter (4-seat Council)
5. ✅ Yardstick 7 "Thrilled" added

---

## 10. Spend Snapshot

| Category | Approx cumulative | Notes |
|---|---|---|
| Anthropic (orchestration agents) | ~$30 | 13+14 agent dispatches across 2 orchestrations |
| Anthropic (daemon cycles) | ~$0.50 | 6 cycles at ~$0.08 each (estimate) |
| Replicate FLUX | ~$15 | Hero exemplars + head-to-head + art-pool seed + daemon BS-1 renders |
| OpenAI gpt-image-1 | ~$25 | Earlier moodboard generations + head-to-head + art-pool 19 OpenAI |
| **Total to date** | **~$70** | |

User mentioned in earlier session: "I already added $100" (OpenAI). Replicate has a separate billing surface.

---

## 11. Skills + Tools the User Has

These are invokable via the Skill tool from any session:

- `odin:odin` — autonomous supervisor with founder-override authority
- `frigga:frigga` — full market intelligence agent
- `frigga:brief` — quick intel answer (used by daemon)
- `thoth-prompter:agent` — multi-agent orchestration design (used to design the 2 prior orchestrations)
- `kaaos:*` — KAAOS knowledge / GTD system
- Many others — see system reminder when session starts

The daemon prompt explicitly invokes `frigga:brief` and `odin:odin` via the Skill tool from inside Claude Code sessions on the VM.

---

## 12. To-Do Queue (priority-ordered)

1. **[NEXT SESSION FIRST TASK]** Art Direction & Commissioning Doctrine — Section 0 above. Multi-agent prompt; lock content roadmap; gate daemon Track A.
2. Apply 5 still-pending V2 rewrites from Section 9
3. Publish the Lampblacker's Spine (load-bearing per A2)
4. Wire daemon Track A to read art-pool votes (`lorevault:art-pool:votes` KV) + comments before each art generation cycle
5. Decide head-to-head: per-archetype routing (FLUX for X, OpenAI for Y) once vote signal accumulates
6. Build out R1 surfaces beyond the /v2 shell — Universe pages, Card detail, Lattice map
7. Jonathan's Journal launch (May 3, 2026) — daily epistolary Stoker re-emission per R2 doctrine
8. Set up watcher cron on VM that pings if heartbeat is stale > 30 min

---

## 13. Useful One-Liners for the Next Session

```bash
# Pull daemon state
gcloud compute ssh --tunnel-through-iap kaaos-daemon --project dl-kaaos --zone us-central1-a \
  --command="cat /opt/rebirth-daemon/state/state.json && tail -30 /opt/rebirth-daemon/logs/rebirth-daemon.log"

# Check rebirth tags (daemon progress)
git ls-remote --tags origin | grep rebirth-

# Pull all current vote tallies
curl -s "https://lorevault-site.vercel.app/api/art-pool/vote?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl" | jq '.voteCount, (.votes | group_by(.vote) | map({vote: .[0].vote, n: length}))'
curl -s "https://lorevault-site.vercel.app/api/headtohead/vote?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl" | jq '.votes | group_by(.winner) | map({winner: .[0].winner, n: length})'

# Stop daemon (graceful)
gcloud compute ssh --tunnel-through-iap kaaos-daemon --project dl-kaaos --zone us-central1-a \
  --command="touch /opt/rebirth-daemon/STOP"

# Watch daemon live
gcloud compute ssh --tunnel-through-iap kaaos-daemon --project dl-kaaos --zone us-central1-a \
  -- tmux attach -t rebirth-daemon
```

---

## 14. The Mood (For Tone Continuity)

The CEO is direct, fast, opinionated, in auto mode. They want execution, not deliberation. They give terse course corrections ("don't use openai use flux / replicate" / "go wilder" / "more epic" / "neither + feedback at scale"). They appreciate concise recaps and clickable file links.

They have a strong taste — they will know when art is wrong before they can articulate why. The art-pool yes/no/other-with-required-comment is the discipline that surfaces signal from that taste.

They asked for the rebirth daemon expecting it to keep iterating overnight. The daemon delivered cycles 1-6 since deploy; trust it to continue.

---

*End of handover. Read Section 0 first. Execute the Art Direction & Commissioning Doctrine task before any further image generation.*
