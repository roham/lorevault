# A1 — Code-State Auditor

**Repo root:** `/tmp/lorevault`
**Posture:** Inventory only. The rebirth treats this tree as artifact, not foundation.
**Date of audit:** 2026-04-24

---

## 1. Routes (`src/app/`)

Next.js App Router, all pages client components. **32 route files** (22 user-facing pages + 6 prototype + 4 API + 2 layouts). Line-count spans 82 L (prototype shell) to 1,155 L (prototype/chase). Every page imports from `@/data/cards` and `@/lib/store`.

| Route (L) | Purpose | Grade | Keep in v2 |
|---|---|---|---|
| `/` (798) | Home: owned cards, daily mission, login calendar, VIP, pass, FOMO pulse, feed, leaderboard, smart-CTA | half | no — rebirth home leads with lore, not retention telemetry |
| `/welcome` (252) | Onboarding splash | half | maybe — structure yes, copy must be rewritten |
| `/card/[id]` (664) | Card detail: art, DNA, market chart, legacy, population, whispers | half | maybe — strip market dashboard, keep lore + provenance |
| `/collection` (739) + sub `/analytics` `/sets` `/showcase` `/smart` | Binder + 4 views | half | no — assumes the 200-card hardcoded catalog |
| `/marketplace` (783) | Floor prices, market stats, activity, filters | half | no — no market in v2 until catalog and auth rebuilt |
| `/packs` (765) | Pack-opening flow | half | maybe — ritual animation reusable |
| `/games/*` — overview (321), `/battle` (848), `/trivia` (600), `/baseball/{page,draft,lineup,play,tournament}` | Battle, trivia, dice-baseball sim | baseball yes (most production-ready surface); battle/trivia half | no — orthogonal to lore-first rebirth |
| `/profile` (817) | Level, tier, badges, achievements | half | maybe — keep level shape |
| `/chronicle` (346) | Collection timeline | half | maybe |
| `/codex` (425) | Lore graph viewer (reads `lore-graph.ts`) | half | yes — already speaks rebirth language |
| `/forge` (600) | Burn/combine ritual | half | maybe — concept survives, art doesn't |
| `/hall` (243) | Hall of fame | half | no |
| `/discover/[slug]` (95) | Character spotlight | thin | maybe — needs lore retrofit |
| `/challenges` (209) | Daily/weekly/seasonal | half | no |
| `/guide` (91) | Static help sections | yes (thin) | maybe |
| `/search` (220) | Global text search | yes | yes |
| `/moodboard` (413) + `/results` (195) | Art-voting survey UI, KV-backed | yes (functional end-to-end) | no — conflates survey with generation harness |
| `/prototype/*` — `chase` (1,155), `play` (1,067), `story` (703), `exemplars` (426), shell (82) | Binder/pack ritual, battle play, story-map, exemplar gallery | half | **yes for `/exemplars`** — 5-card FLUX showcase is the visual north star |

API routes (`src/app/api/`): `ebay/account-deletion` (eBay compliance — keep), `moodboard/{items,results,vote}` (manifest serve with promptVersion filter, KV read, KV write).

---

## 2. Components (`src/components/`)

26 top-level components + 6 subfamilies, ~6,161 total lines. Grouped:

- **Card rendering — `CardItem.tsx` (34 KB god-component), `BinderCard.tsx`, `CardJourney.tsx`, `LoreFragment.tsx`.** `CardItem` owns tilt, scarcity glow, parallel effect, sealed-reveal, DNA, mutation, origin badge, population decay, aging, seasonal state, ghost handling — eight unrelated concerns in one file. `BinderCard` duplicates ~40% of `CardItem` art logic. `LoreFragment` is the only component already reading as pure lore.
- **Marketplace — `components/marketplace/` (11 files: CardQuickView, FilterChips, FloorPriceTable, MarketMovers 396 L, MarketStats, MarketplaceFAB, PriceAlertModal, PriceChart, RecentActivity, SalesTicker, SetProgress).** Uniformly polished, fully wired to fabricated `marketData.ts`. Speculation-forward: price before story.
- **Baseball — `components/baseball/` (7 files: BaseballShareCard, CrowdReaction, DiceRoller, OutcomeReveal, ParticleBurst, ScreenShake, StealReveal).** Production-grade SFX primitives. `ParticleBurst` / `ScreenShake` are rebirth-agnostic.
- **Games — `BattleCard` (224 L), `StatReveal`.** Thin; redundant with `CardItem`.
- **Guide — `GuideNav`, `GuideSection` + 7 section renderers** (Battle, Collecting, Marketplace, Parallels, Rewards, Sets, VIP). Tightly coupled to v1 mechanics.
- **Social — `ShareCard.tsx` (235 L).** Canvas-composed share image generator. High reusability.
- **System chrome — `Navigation` (229 L), `MainChrome`, `MainContent`, `PWAInstall`, `Tooltip`, `FeatureGate`.** Tooltip/FeatureGate survive; Navigation needs a full IA rewrite.
- **Celebration family — `AchievementCelebration`, `AchievementToast`, `LevelUpCelebration`, `PrestigeCelebration`, `UnlockCelebration`.** Five near-identical confetti siblings — collapse to one primitive.
- **Live/social surfaces — `LivePulse` (287 L), `FeedCard`, `SocialFeed`, `SeasonTrack` (262 L).** Home-page "pulse" chrome tightly bound to fabricated activity data.
- **Collection — `CollectionPills`.** Trivial; not worth carrying.

---

## 3. Data layer (`src/data/`, `src/lib/`)

### `src/data/` (15 files)

- **`cards.ts` (432 L) — the 200-card hardcoded catalog.** `SET_CHARACTERS` is a hand-keyed 6-sets × ~20-characters map with moment, lore quote, emoji symbol, gradient. `generateCards()` expands via seeded random (common + 1 higher-scarcity variant per character). Also defines 10 `GHOST_CARDS` + `GHOST_WHISPERS` cross-ghost hint graph. Single largest debt; every downstream file imports from it. Keep lore text as raw material; discard frame.
- **`types.ts` (260 L)** — `Card`, `Scarcity`, `Parallel`, battle/trivia/game types, XP curves, tiers, achievement types. Foundation sound; 5-parallel × 5-scarcity matrix is opinionated.
- **`lore-graph.ts` (499 L)** — directed graph of lore nodes with cross-set "secret" connections. Most rebirth-compatible asset in the data layer.
- **`story-maps.ts` (338 L)** — 3 mythologies × 8 chapters, ownership-gated unlocks. Narrative-spine shaped; rebirth-compatible.
- **`baseball-stats.ts` (28 KB)** — per-character hitter/pitcher stats. Orthogonal.
- **`stats.ts` (9 KB)** — 5-stat system (power/intelligence/mystery/legend/charm) × scarcity × parallel multipliers.
- **`trivia.ts` (20 KB)** — trivia bank. Standalone.
- **`feed-content.ts`, `social-feed.ts`, `leaderboard-seeds.ts`, `challenges.ts`, `profile.ts`, `seasonal-cards.ts`, `guide-content.ts`** — fabricated fixtures + v1 mechanics support. Discard.
- **`sets.ts` (2 KB)** — 6 set descriptors. Concept survives.

### `src/lib/` (20 files + `baseball/` subdir)

- **`store.ts` — 60 KB / 1,780 L monolith.** Owned cards, pack credits, XP, streak, level, achievements, season progress, daily missions, login calendar, collector pass, weekly challenges, featured events, leaderboard, smart-CTA, flex, card meta, aging, origin, population decay. All localStorage. Shape survives; content is v1 retention scaffolding.
- **`marketData.ts` (23 KB, 721 L)** — fabricated marketplace: floor prices, 30-day price history (seeded random), listings, sales, watchlists. Discard.
- **`baseball/` (13 files: ai, audio, charts, draft, engine, evolution, game, index, records, stadium-themes, types).** Full dice-baseball engine, cleanly partitioned. Highest-quality discrete module in the repo.
- **`pulse.ts` (287 L)** — live-pulse activity synthesizer (fabricated).
- **`card-dna.ts`** — deterministic per-card DNA trait generator + mutation.
- **`card-image.ts`** — art-path resolver with fallback chain.
- **`moodboard-kv.ts`** — Upstash KV REST client. Small, reusable pattern.
- **`achievements.ts`, `activation.ts`, `legacy.ts`, `seasonal-vault.ts`, `showcase-store.ts`, `smart-collections.ts`, `vip.ts`, `referral.ts`, `onboarding.ts`, `binder-store.ts`, `globalSearch.ts`, `analytics.ts`, `ai.ts`** — v1 meta-layer support.

---

## 4. Production scripts (`scripts/`)

7 scripts — 1 canonical, 3 deprecated, 1 utility, 2 auxiliary.

- **`seed-moodboard.mjs` (23 KB) — DEPRECATED.** Batched gpt-image-1 seeder: 21 characters × 6 modes (v6: witness-photoreal, mythic-cosmic, modern-reimagined, dream-psychedelic, painterly-epic, ornate-ritual) × N variants. Token-bucket RPM limiter, 429 Retry-After parsing, moderation permanent-skip, force-regen, promptVersion skip-if-current. Not the binding image standard.
- **`seed-exemplars.mjs` (10 KB) — DEPRECATED.** 5-card hardcoded exemplar generator on gpt-image-1. Superseded by FLUX version.
- **`seed-exemplars-flux.mjs` (9 KB) — CANONICAL.** Provider-agnostic FLUX 1.1 Pro Ultra (bfl / fal / Replicate) for the same 5 exemplars with shorter visual-dense prompts tuned to FLUX grammar. Binding image standard for the rebirth.
- **`rebuild-manifest.mjs` (3 KB) — production utility.** Scans `public/moodboard-art/**`, reconstructs `manifest.json`, tags `promptVersion` by file mtime cutoff, preserves existing metadata by ID. Dynamically reads `PROMPT_VERSION` from the seed script. Survives rebirth as-is.
- **`generate-card-art.mjs` (8 KB) — stale.** Older per-card generator, not currently invoked.
- **`audit-walk.mjs` (2 KB), `analyze-votes.py` (3 KB)** — dir-walk helper, ad-hoc Python vote analyzer.

---

## 5. Public assets (`public/`)

- **`public/moodboard-art/` — 268 files across 21 character slugs** (alice, athena, cheshire-cat, dracula, evil-queen, frankenstein-monster, irene-adler, jekyll, mad-hatter, medusa, moriarty, phantom, prometheus, queen-of-hearts, red-riding-hood, rumpelstiltskin, sherlock-holmes, snow-white, the-hound, zeus + `manifest.json`). Per-character counts range 8–18 WebP files. Each named `<styleSlug>-<variant>.webp`. `manifest.json` reports `totalImages: 267`, `model: gpt-image-1`, `totalCostUsd: 45.39`. Items carry `promptVersion` 1–6. **Mixed v1/v2/v3/v4/v5/v6 entries** — the API route filters by `minPromptVersion` (default 6) so only current-version art is served.
- **`public/prototype-art/exemplars/` — 5 WebP files**: `1-watson-deduction`, `2-snow-black-neon`, `3-cheshire-arcana`, `4-dracula-witness`, `5-persephone-saint-aether`. These are the FLUX exemplars — the visual north star for the rebirth.
- **`public/cards/` — 248 files** across per-character directories matching the ALL_CARDS output slugs. Generated by the older `generate-card-art.mjs`; artistic register is v1.
- **`public/icons/`, `public/manifest.json`** — PWA scaffolding.
- **`public/sw.js`** — service worker (1,795 bytes).
- **`public/{next,vercel,file,globe,window}.svg`** — framework boilerplate.

Reusability: the 5 FLUX exemplars are fully reusable. The 268 moodboard pieces are evidence of *what was tested*, not finished art — useful as reference, not product. The 248 `/cards/*.webp` files are v1 and will not survive rebirth.

---

## 6. Architectural debt

1. **`gpt-image-1` is baked into every image path but FLUX/Replicate is the binding rebirth standard.** `seed-moodboard.mjs`, `seed-exemplars.mjs`, `rebuild-manifest.mjs` (hard-codes `model: 'gpt-image-1'` in the manifest), and every `manifest.json` item carry the gpt-image-1 provenance. Rebirth must either re-seed everything through `seed-exemplars-flux.mjs` (expanded to full coverage) or schema-migrate the manifest to FLUX and purge gpt-image-1 entries.
2. **The 200-card hardcoded catalog (`cards.ts` `SET_CHARACTERS`)** is the backbone every other file depends on. It bakes in 6 sets, 20 characters-per-set, fixed moments, fixed emoji symbols, fixed gradient colors, fixed lore quotes. Rebirth-incompatible at structural level; the data itself is raw material only.
3. **Moodboard conflates two concerns.** `/moodboard` is simultaneously (a) an art-voting survey UI with KV persistence and token gate, and (b) the rendering surface for `seed-moodboard.mjs` output. The "which image wins" research loop and the "image generation harness" should be separated — conflation means retiring gpt-image-1 also retires the survey infrastructure.
4. **Manifest entries at `promptVersion` 1 through 6 all coexist.** `/api/moodboard/items` filters by minPromptVersion=6; older entries linger in the manifest but serve no purpose and inflate cost totals.
5. **`store.ts` is a 60 KB single-file monolith.** 20+ unrelated feature concerns (login calendar, VIP, pass, missions, leaderboard, challenges, aging, population decay, origin badges, burn ritual) share one namespace. Any partial rebirth that touches one concern risks all of them.
6. **`CardItem.tsx` is 34 KB and owns eight feature concerns** (tilt, scarcity, parallel, sealed-reveal, DNA, mutation, origin, population, aging, seasonal). Rebirth-hostile: any change to card visual language requires touching everything.
7. **Five near-identical celebration components.** Achievement/AchievementToast/LevelUp/Prestige/Unlock celebrations are copy-paste siblings. Collapses to one primitive under a rebirth pass.
8. **Market data is fabricated at read time** (`marketData.ts` uses seeded random over `ALL_CARDS`). There is no real marketplace backend, no listings database, no transaction ledger. Anything that reads price in v1 is reading theatre.
9. **Battle/trivia/baseball share no card contract with the collection layer.** The games work off `ALL_CARDS` directly but their stat systems (`stats.ts` for battle, `baseball-stats.ts` for baseball) are bolted on rather than integrated. Rebirth decision: do games survive at all, and if so as what?
10. **Every user-state persistence is localStorage.** No account, no server, no sync across devices. `moodboard-kv.ts` is the only server-state client in the tree — and it stores votes, not users.
11. **Route proliferation without IA.** 22 user-facing pages with overlapping purposes (`/collection` + `/collection/analytics` + `/collection/sets` + `/collection/showcase` + `/collection/smart` + `/chronicle` + `/hall` + `/profile` all render variations on "the player's stuff").

---

## 7. Architectural strengths

1. **Parallel-aware manifest with promptVersion gating.** `manifest.json` tracks every generated image with `promptVersion`, `model`, `costUsd`, `generatedAt`, `bytes`. The API route filters by `minPromptVersion` so viewers never see stale weak art while a new version is filling in. This pattern carries directly to FLUX.
2. **FLUX/Replicate integration already exists** (`seed-exemplars-flux.mjs`). Provider-agnostic (bfl / fal / Replicate) with a clean `GEN[PROVIDER]` dispatcher and separate prompt set tuned for FLUX's visual-dense grammar. Ready to scale to full character coverage.
3. **Rate-limited, retry-aware, concurrency-parallel seed architecture.** Token-bucket `RateLimiter` class, 429 Retry-After parsing, permanent-skip on moderation-blocked, force-regen flag, promptVersion skip-if-current, seeded shuffle for breadth-first coverage. All of this is reusable for any batched provider call.
4. **Recovery-tool pattern (`rebuild-manifest.mjs`).** Manifest can be reconstructed from the filesystem after any crash or partial run; dynamically reads the current `PROMPT_VERSION` from the seed script to stay in sync. Survives rebirth as-is.
5. **Fallback chain for card art** (`card-image.ts` + inline `onError` cascades in `CardItem.tsx`, `BinderCard.tsx`, `ChaseCardArt`, `StoryCardArt`). Variant path → base path → monogram. Resilient to partial art coverage — critical during rebirth's staged rollout.
6. **`lore-graph.ts` and `story-maps.ts`.** Lore-first data structures that already speak the rebirth's language. Graph of lore nodes with cross-set "secret" unlocks + narrative chapter arcs per mythology. These are the first files a lore-first rebirth should extend rather than replace.
7. **Moodboard KV pattern** (`moodboard-kv.ts` + `/api/moodboard/*` routes). Minimal REST-over-Upstash with dev in-memory fallback, token-gated endpoints, LPUSH/LRANGE vote log. Template for any lightweight server-state the rebirth needs.
8. **Baseball engine modularity** (`src/lib/baseball/` — 13 files cleanly split into types, engine, game loop, AI, records, charts, evolution, stadium themes). Proof the team can build a disciplined module when given a clear scope.
9. **Seeded-random determinism.** `generateCards()`, `marketData`, `card-dna` all use seeded PRNGs so SSR and client render identically and the "market" is stable across page loads. Pattern survives rebirth wherever deterministic-fake-data stays appropriate.
10. **PWA scaffolding is complete.** `manifest.json`, `sw.js`, `PWAInstall.tsx`, icons in place. Rebirth ships as a PWA from day one without rebuild cost.

---

**Inventory complete. All 7 sections present. Routes counted (32). Components grouped into 9 families. Data layer (15 files + 20 lib files) enumerated. 7 scripts stated. Public assets quantified (268 moodboard + 5 exemplars + 248 card images). Debt: 11 items. Strengths: 10 items.**
