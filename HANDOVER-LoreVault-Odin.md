# LoreVault Odin — Session Handover

**Date**: April 13-14, 2026
**Session**: Initial build sprint + strategy design
**Branch**: `daemon-v8` on `roham/lorevault`
**Production URL**: https://lorevault-site.vercel.app
**Repo**: `/Users/roham/claude-conversations/lorevault-site`

---

## I. What Was Built This Session

### Product Cycles Shipped (v8.7 → v8.20)

| Tag | Cycle | What Shipped | Key Files |
|-----|-------|-------------|-----------|
| v8.7 | 7 | 5-tab bottom nav (Home, Market, Open, Collection, Games). Profile → top bar avatar. Floating Play pill killed. Search bar in header. | `Navigation.tsx`, `layout.tsx` |
| v8.8 | 8 | Collector's Guide / Codex — 7 sections with real data, sticky pill nav, IntersectionObserver | `app/guide/page.tsx`, `components/guide/*`, `data/guide-content.ts` |
| v8.9 | 9 | VIP tier display — profile card, nav avatar glow, home page pill. Canonical `lib/vip.ts` | `lib/vip.ts`, `app/profile/page.tsx`, `Navigation.tsx` |
| v8.10 | 10 | Global search — `/search` page, tiered results (cards + sets + guide), debounced, recent searches | `lib/globalSearch.ts`, `app/search/page.tsx` |
| v8.11 | 11 | Discovery Feed — 7 editorial entries with FLUX art, detail pages at `/discover/[slug]` | `data/feed-content.ts`, `components/FeedCard.tsx`, `app/discover/[slug]/page.tsx` |
| v8.12 | 12 | Card craft — physical depth (multi-layer shadow), corner accents (rare+), upgraded parallel effects (silver sweep, gold glow, holo shift, obsidian void) | `components/CardItem.tsx`, `globals.css` |
| v8.13 | 13 | Typography — 6-level type scale (display/heading/subheading/body/caption/micro) as CSS utilities | `globals.css`, 10 page files |
| v8.14-16 | 14-16 | Card art pipeline — fal.ai FLUX integration. 196 differentiated images (scarcity + parallel affect prompt). Emoji fallback fixed. Art fallback chain (variant → base → monogram). | `scripts/generate-card-art.mjs`, `CardItem.tsx`, `public/cards/*` |
| v8.17 | 16 | Profile UX overhaul — lazy sections (IntersectionObserver), removed entrance animations, horizontal scroll achievements, compact set completion rows, dev-only testing controls | `app/profile/page.tsx` |
| v8.17-18 | 17-18 | Performance — killed Nav 1s interval polling, progressive marketplace rendering (24 cards initially, load more on scroll), CardItem split into Static/Interactive variants, content-visibility CSS | `Navigation.tsx`, `marketplace/page.tsx`, `CardItem.tsx`, `globals.css` |
| v8.20 | 20 | Collectibility foundation — sealed/reveal mechanic, card provenance (history array), aging fields (acquiredAt, battleCount, tradeCount). Cards arrive sealed from packs. | `data/types.ts`, `lib/store.ts`, `CardItem.tsx` |
| — | — | Discover Feed visual overhaul — story carousel (260x340 tall cards with FLUX art backgrounds, snap scroll), social proof live feed (pull alerts, market movers, milestones, whale activity) | `FeedCard.tsx`, `SocialFeed.tsx`, `data/social-feed.ts` |

### Research Documents Produced

| File | Content |
|------|---------|
| `lorevault-wiki/research/COLLECTIBILITY-MANIFESTO.md` | 10-dimension Collectibility Score rubric. LoreVault scores 32/100 today, target 83/100. Grounded in Belk, Kahneman, variable reinforcement theory. 6 paradigm shifts defined. |
| `lorevault-wiki/research/STRATEGIC-PLAYBOOK.md` | IP expansion (top 15 public domain IPs ranked), GTM playbook (5 proven viral tactics), revenue model ($3-5 packs, 5% marketplace, battle pass), competitive positioning, 5 named campaigns. |
| `LOREVAULT-MASTERPLAN.md` | 75 levers across 10 domains. 5 growth phases. 30-cycle research sequence. Agent architecture + permission model. |
| `STRATEGY-DAEMON-PROMPT.md` | LoreVault Odin daemon prompt — the infinite research loop protocol. |
| `lorevault-wiki/DIRECTIVES.md` | Bridge file between strategy daemon and product daemon. 3 initial directives queued. |
| `lorevault-wiki/scoring/daemon-cycle-7.md` through `daemon-cycle-10.md` | Per-cycle scoring logs with Frigga research summaries, Odin pre/post scores, build details, critiques. |

---

## II. Architecture Decisions Made

### Agent Hierarchy (Confirmed by CEO)
```
Master Odin (CEO-only deploy/stop — Roham)
├── LoreVault Odin (team lead can deploy/stop)
│   └── Dispatches Frigga. Writes to lorevault-wiki/ ONLY.
├── Collectibles Odin (CPO scope)
├── Consumer Finance Odin (Delphi scope)
└── Company Odin (existing deployed odin:odin)
```
- Domain Odins are context-isolated. No cross-contamination.
- Cross-product signals noted in cycle output under `## Cross-Product Signal` — Master Odin synthesizes.
- LoreVault Odin is NOT the deployed `odin:odin`. It's a domain-scoped instance with its own prompt, storage, and focus.

### Two Daemons, One Bridge
- **Product Daemon** (`DAEMON-PROMPT.md`): Builds the product. Reads `DIRECTIVES.md` at Phase 0 of every cycle. Executes highest-priority pending directive.
- **Strategy Daemon** (`STRATEGY-DAEMON-PROMPT.md`): LoreVault Odin. Researches, strategizes, writes directives. Does NOT build directly.
- **Bridge**: `lorevault-wiki/DIRECTIVES.md`. Odin writes. Product daemon reads. Format is a contract (priority, spec, acceptance criteria, status).

### Multi-Agent Pattern (Confirmed Working)
Each product cycle dispatches:
1. **Frigga** (research agent, background) — WebSearch for reference products, patterns, data
2. **Odin** (reasoning agent, Opus model, background) — scores current state, produces implementation spec
3. **Builder** (main agent) — implements based on synthesized findings
4. **Odin review** (post-build, background) — re-scores, identifies weakest dimension

This ran successfully for 10+ product cycles. Average cycle: ~5 min research (parallel agents), ~5 min build, ~2 min deploy.

---

## III. Current Product State

### Routes (20 total)
```
/                    — Home (hero, daily challenge, featured cards, discover feed, live feed, season track)
/welcome             — First-visit intro
/packs               — Pack opening (guided first time)
/collection          — Binder view with drag-and-drop
/collection/showcase — Bento grid showcase builder
/collection/sets     — Sticker book (owned vs silhouettes)
/collection/smart    — Smart collections, auto-groups
/collection/analytics — Stats dashboard, radar chart
/card/[id]           — Card detail (market data + battle stats)
/marketplace         — Faceted search, 3 views, price charts, progressive rendering
/games               — Game hub with daily challenges
/games/battle        — Top Trumps card battles, 3 AI difficulties
/games/trivia        — Lore trivia, 15s timer, streaks
/challenges          — Visual missions with streak tracker
/profile             — Level, VIP, season track, showcase, achievements, sets
/guide               — 7-section Collector's Guide with pill nav
/search              — Global search (cards + sets + guide), tiered results
/discover/[slug]     — Feed article detail pages
/api/ebay/account-deletion — eBay webhook endpoint (for CardVault keyset activation)
```

### Card System
- 200 cards: 100 characters × 2 variants (common/base + higher scarcity/parallel)
- 5 sets: Baker Street Files, Enchanted Kingdom, Wonderland Descending, Castle of Otranto, Olympus Rising
- 5 scarcity tiers: common, uncommon, rare, epic, legendary
- 5 parallel variants: base, silver, gold, holographic, obsidian
- 196 FLUX-generated art images in `public/cards/` (differentiated by scarcity + parallel)
- Art pipeline: `scripts/generate-card-art.mjs` using fal.ai FLUX schnell

### Collectibility Features (Foundation Built, Not Yet Polished)
- **Sealed/Revealed**: Cards arrive sealed. `sealed` field in card meta. Visual overlay with frosted glass + scarcity glow. Reveal function exists but no dramatic animation yet.
- **Provenance**: `history: CardEvent[]` array per card. Events: pulled, revealed, battle_win, battle_loss, showcased, traded. Timeline not yet rendered on card detail page.
- **Aging fields**: `acquiredAt`, `battleCount`, `tradeCount` tracked in localStorage. CSS patina effects NOT yet implemented (directive pending).
- **Collectibility Score**: 32/100 today. Target 83/100. See COLLECTIBILITY-MANIFESTO.md.

### Performance State
- Nav polling killed (was 3 JSON.parse/sec, now event-driven)
- Marketplace progressive rendering (24 cards initially, load more on scroll)
- CardItem split: Static (no motion hooks) vs Interactive (full 3D tilt)
- `content-visibility: auto` on marketplace grid
- Profile: lazy sections, removed entrance animations, compact layout
- **Still janky on mobile** — CEO flagged this. More perf cycles needed.
- next/image migration FAILED (reverted). Images use raw `<img>` with `loading="lazy"`.

---

## IV. Key CEO Feedback & Decisions

| Feedback | Decision | Status |
|----------|----------|--------|
| "Looks very AI-generated" | Card craft overhaul with physical depth, corner accents, parallel effects | Done (v8.12) |
| "I can't find the marketplace" | 5-tab nav with Market as permanent tab | Done (v8.7) |
| "Performance is really degrading UX" | Multi-cycle perf focus (polling, progressive render, CardItem split) | Partially done, more needed |
| "Discover section is not good" | Story carousel with FLUX art + social proof live feed | Done |
| "Parallels need more differentiation" | Art generation prompt includes parallel-specific visual treatment | Done (regenerated all 196 images) |
| "How do we make these the best collectibles possible?" | Collectibility Manifesto research. Sealed/reveal, aging, provenance, lore fragments. | Foundation built, UX polish pending |
| "Think about the collectors themselves in the feed" | Social proof feed: pulls, movers, milestones, whales, leaderboards | Done |
| "Switch to marketing/strategy research" | Strategic Playbook + Master Plan + LoreVault Odin daemon | Done |
| "Domain Odins should be context-isolated" | Explicit hierarchy: Master Odin (CEO), domain Odins (team leads), no cross-contamination | Locked in |
| "Will not can" for directive bridge | DIRECTIVES.md is hardcoded into both daemons. Not optional. | Done |

---

## V. Open Items & Pending Directives

### DIRECTIVES.md (Queued)
1. **P0**: Complete sealed/reveal animation (dramatic reveal, particle burst, pack flow integration)
2. **P1**: Build Norse Mythology set (20 characters, art, lore, feed entries)
3. **P1**: Card aging CSS effects (patina based on battleCount + age)

### Known Bugs / Tech Debt
- next/image migration failed — images use raw `<img>`. Need to revisit with proper testing.
- `recordMonthlyPackOpen()` never called — VIP monthly earnings always show 0.
- BattleSection in guide uses fixed bar widths (deterministic but not real data)
- Some card art paths may mismatch if card generation seed changes
- Profile still has performance issues on mobile — more lazy loading and animation removal needed

### Strategic Research Not Yet Started
The 30-cycle research sequence in LOREVAULT-MASTERPLAN.md. Cycle 1 (pack-opening UX) through Cycle 30 (animated trailers) all pending. LoreVault Odin daemon prompt is ready to execute this.

---

## VI. Credentials & Infrastructure

### fal.ai (Card Art Generation)
- **Key**: In `.env.local` (gitignored). Token shared in chat — MUST ROTATE after this session.
- **Model**: `fal-ai/flux/schnell`
- **Usage**: `node scripts/generate-card-art.mjs --batch N [--set SET_SLUG]`

### eBay (CardVault Project — Separate)
- **Credentials**: In eBay developer portal under "cardvault" keyset (Sandbox). ROTATE after this session — were shared in chat.
- **Webhook endpoint**: `https://lorevault-site.vercel.app/api/ebay/account-deletion` (deployed, challenge-verified)
- **Verification token**: `lorevault-cardvault-verification-2026`
- **Status**: Keyset still DISABLED. User needs to go to eBay developer portal → Notifications → paste endpoint URL + verification token. The webhook is live and verified — just needs the portal config.

### Vercel
- **Project**: `ros-projects-9a9bb0c9/lorevault-site`
- **Production URL**: `https://lorevault-site.vercel.app`
- **Deploy command**: `npx vercel --prod --yes`
- **Env vars set**: `EBAY_VERIFICATION_TOKEN`, `EBAY_ENDPOINT_URL`

### Git
- **Branch**: `daemon-v8`
- **Tags**: v8.7 through v8.20 (not all sequential — some patches between)
- **Latest commit**: See `git log --oneline -5`

---

## VII. File Inventory

### New Files Created This Session

```
# Product
src/app/guide/page.tsx                    — Collector's Guide main page
src/app/search/page.tsx                   — Global search page
src/app/discover/[slug]/page.tsx          — Feed article detail page
src/app/api/ebay/account-deletion/route.ts — eBay webhook
src/components/guide/GuideNav.tsx         — Sticky pill nav for guide
src/components/guide/GuideSection.tsx     — Section wrapper component
src/components/guide/sections/*.tsx       — 7 guide section components
src/components/FeedCard.tsx               — Story/hero/compact feed cards
src/components/SocialFeed.tsx             — Social proof live feed
src/data/guide-content.ts                 — Guide section metadata
src/data/feed-content.ts                  — 7 editorial feed entries
src/data/social-feed.ts                   — Mock social feed events
src/lib/globalSearch.ts                   — Unified search across all content
src/lib/vip.ts                            — VIP tier system, monthly tracking
scripts/generate-card-art.mjs             — fal.ai FLUX art generation script

# Art
public/cards/*.webp                       — 196 card art images

# Research & Strategy
lorevault-wiki/research/COLLECTIBILITY-MANIFESTO.md
lorevault-wiki/research/STRATEGIC-PLAYBOOK.md
lorevault-wiki/research/odin-cycle-*.md   — (not yet started)
lorevault-wiki/scoring/daemon-cycle-7.md through daemon-cycle-10.md
lorevault-wiki/DIRECTIVES.md              — Bridge file (3 directives queued)
LOREVAULT-MASTERPLAN.md                   — 75 levers, 5 phases, 30-cycle sequence
STRATEGY-DAEMON-PROMPT.md                 — LoreVault Odin daemon prompt
DAEMON-PROMPT.md                          — Product daemon prompt (v4, multi-agent)
```

### Key Modified Files
```
src/components/CardItem.tsx    — Split Static/Interactive, sealed overlay, art fallback chain, corner accents, parallel effects
src/components/Navigation.tsx  — 5-tab nav, search→/search, guide icon, VIP glow, killed polling
src/app/page.tsx               — Home: discover carousel, social feed, VIP pill, type-display
src/app/profile/page.tsx       — VIP card, lazy sections, compact layout, removed animations
src/app/marketplace/page.tsx   — Progressive rendering (24 → load more), content-visibility
src/app/globals.css            — Type scale, card depth/edge CSS, parallel effects, corner accents
src/data/types.ts              — CardEvent, sealed/acquiredAt/battleCount/tradeCount/history fields
src/lib/store.ts               — Card meta (sealed, provenance), VIP monthly tracking wired
src/lib/marketData.ts          — Exported scoreCard() for global search
```

---

## VIII. Session Statistics

- **Cycles shipped**: ~14 product cycles (v8.7 → v8.20)
- **Lines of code added**: ~3,000+
- **Card art generated**: 196 images via fal.ai FLUX (~$0.60 total)
- **Routes added**: 5 new routes (guide, search, discover/[slug], api/ebay, search)
- **Research documents**: 2 major (Manifesto, Playbook), 4 scoring logs, 2 strategy docs
- **Sub-agents dispatched**: ~40+ (Frigga research, Odin reasoning, Odin review)
- **Deploys to production**: ~15+
