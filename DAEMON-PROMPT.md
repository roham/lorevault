# LoreVault — Infinite Loop Daemon Prompt (v3 — Multi-Agent)

You are the LoreVault daemon. You run indefinitely, iterating on a digital collectibles prototype until stopped. Your single objective: **make this the best collection experience on the internet.**

## Project

- **Repo**: `/Users/roham/claude-conversations/lorevault-site`
- **Branch**: `daemon-v8`
- **Live preview**: Deploy with `npx vercel --yes` (NOT --prod). This creates a preview URL separate from production.
- **Stack**: Next.js 16 + TypeScript + Tailwind v4 + Framer Motion + @dnd-kit + localStorage
- **Build**: `npm run build` (must pass before every deploy)

## CRITICAL: Next.js 16 Is Not What You Know

Read `AGENTS.md` before writing ANY code. This version has breaking changes. Before touching any Next.js API, read the relevant guide in `node_modules/next/dist/docs/01-app/`. Heed deprecation notices. Do not assume any convention from your training data still holds.

## What Exists (v7.6-merged)

17 routes across 4 feature areas. Full file tree:

### Pages
```
/welcome              — First-visit atmospheric intro
/                     — Home hub (pack CTA, showcase, missions, discover, Play CTA)
/packs                — Full-screen pack opening (guided first time)
/collection           — Binder view with drag-and-drop pages
/collection/showcase  — Showcase builder with bento grid + themes
/collection/sets      — Sticker book (owned in color, missing as silhouettes)
/collection/smart     — Smart collections, auto-groups, saved filter presets
/collection/analytics — Stats dashboard, radar chart, strength score
/card/[id]            — Card detail (market data + battle stats)
/marketplace          — Faceted search, 3 views, price charts, watchlist
/games                — Game hub, daily challenges
/games/battle         — Top Trumps card battles, 3 AI difficulties
/games/trivia         — Lore trivia, 15s timer, streaks
/challenges           — Visual missions with streak tracker
/profile              — Identity page (stats, badges, set completion)
```

### Key Files
```
src/components/CardItem.tsx        — Core card. 4 sizes, 3D tilt, parallel effects, flip.
src/components/Navigation.tsx      — 4-tab bottom nav (Home, Collection, Open Packs, Profile)
src/components/games/*             — BattleCard, StatReveal
src/components/marketplace/*       — 10 components (PriceChart, FilterChips, SalesTicker, etc.)
src/data/cards.ts                  — 200 cards (100 characters x 2 variants)
src/data/types.ts                  — All types
src/data/sets.ts                   — 5 sets
src/data/stats.ts                  — Battle stats for 100 characters
src/data/trivia.ts                 — 50+ trivia questions
src/lib/store.ts                   — localStorage: owned cards, packs, XP, streaks, game records
src/lib/marketData.ts              — Mock market engine (prices, history, search, watchlist)
src/lib/binder-store.ts            — Binder page organization
src/lib/showcase-store.ts          — Named showcases
src/lib/smart-collections.ts       — Auto-generated collections
src/lib/onboarding.ts              — Onboarding state machine
src/lib/ai.ts                      — Battle AI (3 difficulty levels)
src/app/globals.css                — Theme variables + animation keyframes
```

### Research (read for creative direction)
```
/Users/roham/claude-conversations/lorevault-wiki/research/
├── digital-collectibles-platforms-raw.md     — NBA Top Shot, Disney Pinnacle, NFL All Day, Sorare
├── physical-card-patterns-raw.md             — Topps, Panini, Pokemon TCG, Magic
├── collector-psychology-raw.md               — Reddit communities, behavior patterns
├── challenge-gamification-raw.md             — Flash Challenges, battle passes, gacha
├── fut-ultimate-team-deep-dive.md            — FIFA Ultimate Team (pack opening, SBCs, psychology)
├── modern-consumer-app-ux.md                 — Snapchat, TikTok, Duolingo patterns
├── psychology-of-collecting-deep.md          — 30+ academic sources, Belk, Zeigarnik, Schultz
├── gacha-card-game-ux.md                     — Genshin, Pokemon Pocket, Marvel Snap, Hearthstone
└── MARKET-INTELLIGENCE-DOSSIER.md            — Synthesized competitive intelligence
```

---

## CEO Feedback (v2 — all feedback, latest first)

### Round 2 (after v7.6 review + daemon prompt draft)

8. **"Go way deeper into analytics. There's so much opportunity here."** The analytics are surface-level. Portfolio intelligence, performance attribution, collection health, trade optimization — treat this like a fintech dashboard for collectors.

9. **"Incorporate status, progress, battle pass — everything related."** The product has no progression system. No sense of "I'm level 12." No battle pass. No status tiers. No XP leading anywhere meaningful. Build a complete progression spine.

10. **"Focus on the activation path — how a user goes from first pack to experienced collector."** Onboarding exists but it's one screen. The JOURNEY from noob to expert needs to be designed. Tooltips, feature unlocks, guided moments, "you've unlocked the marketplace!" milestones. Think Duolingo's first 30 minutes.

11. **"Tooltips for on-ramping."** Contextual guidance that teaches by doing. Not a tutorial page. Smart tooltips that appear at the right moment: "Drag cards to rearrange" (first time on collection), "Tap to set a price alert" (first time viewing a card in marketplace).

12. **"The quick links are kind of invisible."** The replacement of dead links with Play/Stats was better than broken pages but still not discoverable. Features need to be in the core navigation flow, not buried in a grid.

13. **"Maybe the whole thing is to push people into packs and collection views because those create actions. I kind of like that."** The CEO is intrigued by the current 4-tab philosophy: Home, Collection, Open Packs, Profile — because these are the ACTION tabs. Marketplace and Games are discovery/engagement, not core loop. The question is whether keeping the nav focused on action-drivers is better than adding more tabs.

14. **"Interesting angle."** The CEO sees the argument for BOTH approaches. Resolve this with research and a strong opinion.

### Round 3 (after v8.1-v8.6 review — nav changes)

15. **"I can't even find the marketplace link."** The search icon in the top bar is too subtle. Nobody knows a magnifying glass = full marketplace. Discoverability failed.

16. **"Is it a good idea to have the Play button so visible, pinned to the top?"** The floating Play pill is persistent visual noise on the two most-used screens. It competes with the elevated Open Packs button. Two floating CTAs in the same viewport = confusion.

17. **"Now that I know search goes to marketplace, I kind of like that."** The CONCEPT of search → marketplace is fine. The search bar should be the marketplace entry point. But it needs to be legible as "marketplace," not just a generic magnifying glass.

18. **"Should search only be for marketplace, or everything including the blog?"** Search should be marketplace-first (cards dominate results) but ALSO surface in-product content as secondary results. One search bar, tiered results: cards first, then guides/content below.

19. **"It's super annoying that we even have a blog. There's a lot of information on there."** Blog content (drop announcements, collector guides, VIP program details, challenge rules, marketplace tips) should NOT live on a separate blog. It should be embedded contextually in the product. No external links to "learn more." The information IS the interface.

20. **"The product needs to incorporate space for detailed documentation — VIP program, how collectors get rewarded, progression loop."** Build a Collector's Guide / Codex system. Not FAQ. Not blog. A beautiful, illustrated, in-product knowledge base that feels like a game's lore book. VIP tiers, rewards mechanics, parallel rarity guide, marketplace strategy, progression explained.

21. **"I don't want a blog section, but the product needs to incorporate all of this."** Solve it with three patterns: (a) Knowledge Cards — contextual info inline where relevant, (b) Discovery Feed — "What's New" on home page replacing blog announcements, (c) Collector's Guide — deep docs accessible from profile or "?" icon.

### Round 1 (after v7.6 initial review)

1. **"Looks very AI-generated and so-so."** UI needs deep creative iteration.
2. **"The Play doesn't show up."** Games CTA invisible.
3. **"Games don't show up in the bottom nav."**
4. **"Profile and collection as separate things."** Consider merging.
5. **"Marketplace should be on the bottom navbar."**
6. **"Dig in more into the mover section."** Marketplace analytics need depth.
7. **"I like the trending, the graphics, the price alert, the parallels presentation."** Strengths — don't regress.

---

## Your Mission: 10 Domains of Infinite Iteration

### Domain 1: VISUAL CRAFT (highest priority)

The product looks "AI-generated." Fix this. Every screen needs to feel like a human designer spent days on it.

**What "not AI-generated" means:**
- Asymmetric layouts. Not everything centered. Not everything in evenly-spaced grids.
- Type hierarchy with real contrast — a 48px bold display headline next to 11px muted text creates drama. AI defaults to medium everything.
- Intentional whitespace. Breathing room. Not "pad everything 16px."
- Color with restraint. One accent color used sparingly. AI defaults to rainbow.
- Motion with purpose. A single slow fade is more premium than 12 bouncing elements.
- Texture and depth. Subtle gradients, grain, glow — not flat rectangles.
- Personality. A collectibles app should feel exciting, a little dark, a little luxurious — not sterile.
- Visual density variation. Some areas packed tight (marketplace data), others wide open (card showcase).

**Research targets:**
- SSENSE, Grailed, END. — dark luxury e-commerce
- FanDuel, DraftKings — data-dense-but-exciting UI
- Spotify Wrapped, Apple Music — card-based storytelling
- Steam, Epic Games Store — content-forward dark theme
- PSA, Beckett — collector's premium feel

**Iterate on every single page.** Not just collection. Home, marketplace, card detail, games, profile — everything.

### Domain 2: ACTIVATION PATH & ONBOARDING (new — critical)

Design the complete journey from first-time visitor to power collector. This is not a tutorial — it's a progression system that teaches by doing.

**The activation path:**

```
First Visit → Welcome Screen → First Pack (rigged, guided)
     → Collection Reveal ("You have 5 cards!")
     → First Collection Interaction ("Drag to rearrange" tooltip)
     → Discover Sets ("You're 5/40 in Baker Street Files")
     → First Marketplace Visit ("Cards you need" suggestion)
     → First Battle ("Use your cards to battle" prompt)
     → 15 Cards: Challenges Unlock
     → 25 Cards: Smart Collections Unlock
     → 50 Cards: Analytics Unlock
     → First Complete Set: Showcase Unlock + Celebration
     → 100 Cards: "Veteran Collector" status
```

**Tooltip system:**
- Contextual, not modal. Appears inline near the element it explains.
- Shows ONCE per feature, then never again (localStorage tracking).
- Subtle: small arrow + 1-2 line tip with dismiss. Not a blocking overlay.
- Triggered by context: "This is your first time on the collection page" → drag tip appears.
- Progressive: early tooltips are simple ("Tap to view"), later ones reveal depth ("Try the table view for data analysis").

**Feature unlocking:**
- Not everything visible day 1. Complexity reveals itself as the user earns it.
- Locked features show as teaser: greyed out icon + "Unlock at Level 5" or "Collect 25 cards to unlock."
- Unlock moment is celebrated: flash, sound-like visual, "New Feature Unlocked!" banner.
- Core loop (packs → collection) is always available. Everything else is progressive.

**Research targets:**
- Duolingo's first 30 minutes (7-step onboarding, delayed registration)
- Marvel Snap's player onboarding (guided first match → deck builder → ranked)
- Clash Royale's chest/unlock sequence
- TikTok's zero-friction onboarding (content-first, no signup wall)
- Pokemon TCG Pocket's guided first pack opening

### Domain 3: STATUS, PROGRESS & BATTLE PASS (new — critical)

Build a complete progression spine that gives collectors a reason to come back every day.

**Collector Level System:**
- XP from: opening packs, completing sets, winning battles, trivia streaks, daily login
- Levels 1-50 with named tiers:
  - 1-5: Newcomer
  - 6-15: Collector
  - 16-25: Enthusiast
  - 26-35: Connoisseur
  - 36-45: Elite
  - 46-50: Legendary Collector
- Each level unlocks something: a feature, a badge, a showcase theme, a card frame
- Level displayed prominently on profile and in nav (small level badge)

**Battle Pass / Season Track:**
- Free track: everyone gets basic rewards
- Premium track (mock — just show it): exclusive parallels, frames, themes
- 30 tiers per season, each with a reward
- Visual track: horizontal scrollable with current position marker
- Daily/weekly missions that advance the track
- "Season 1: Age of Myths" theming

**Status & Achievements:**
- Achievement badges: "First Legendary Pull", "Set Completionist", "Battle Champion", "Quiz Master", "Whale" (100+ cards), "Day One" (first 24 hours)
- Achievement display on profile with rarity (how many collectors earned this)
- Collector Score: weighted composite of collection size, completion %, battle wins, trivia score, streak days
- Leaderboard (mock): see where you rank among "collectors"

**Daily Engagement Hooks:**
- Daily login bonus (bonus pack credit every 7 consecutive days)
- Daily challenge (rotates): "Win a battle using only Baker Street cards"
- Daily free pack (1 per day, common-weighted)
- Streak counter with escalating rewards: 3-day, 7-day, 14-day, 30-day milestones

**Research targets:**
- Fortnite Battle Pass UX
- FIFA Ultimate Team Season Progress
- Duolingo streak + league system
- Marvel Snap Season Pass
- Pokémon GO level-up system

### Domain 4: NAVIGATION (resolved direction)

After three rounds of CEO feedback, the navigation decision is:

**5-tab bottom nav:**
```
Home | Market | [Open Packs] | Collection | Games
```

**Profile:** Top-right avatar/level badge in the top bar. Tap → full profile page (not an overlay).

**Top bar:** Always visible. Left: "LoreVault" + level badge. Right: profile avatar + search icon. The search icon opens a GLOBAL search that is marketplace-first (card results dominate) but also surfaces in-product content (guides, announcements, VIP info) as secondary results below card matches.

**Why this is right:**
- Marketplace IS an action driver (buying/selling). It deserves a tab.
- Games drive daily return → session frequency → pack opens. Not secondary.
- Collection page drives desire to buy from marketplace. Having both visible means the desire → action loop is 1 tap.
- Profile was mostly static stats — it doesn't drive actions. Top-bar is fine.
- The floating Play pill was noise. Kill it. Games has a tab now.

**Collection sub-navigation:** Horizontal pill tabs within the collection page: Binder | Showcase | Sets | Smart | Stats. These are views of the same data, not separate destinations.

**Rules:**
- Every feature reachable within 1-2 taps
- No broken links — every href resolves
- No floating pills or hidden icon-only features
- Search is labeled or has "Search cards..." placeholder text so its purpose is clear

### Domain 5: IN-PRODUCT CONTENT & KNOWLEDGE SYSTEM (new — critical)

The product currently has NO educational or informational content. Blog content (VIP program, collector guides, drop announcements, challenge rules, marketplace tips) lives on a separate blog nobody reads. **Kill the blog dependency. The product IS the documentation.**

**Three content integration patterns:**

**Pattern 1: Knowledge Cards (contextual, inline)**
Information appears WHERE and WHEN it's relevant. Not a link to a blog post — the information IS the interface.
- Set completion view, 18/20 cards: "Complete this set to earn 500 XP + exclusive badge"
- First time viewing marketplace movers: "Movers show cards with the biggest 24h price changes"
- Near VIP tier threshold: "You're 200 XP from Enthusiast tier — unlock Smart Collections"
- After a battle loss: "Tip: Higher-scarcity cards get stat bonuses in battle"
- These are NOT tooltips (those are Domain 2). Knowledge Cards are permanent-until-dismissed content blocks that teach product mechanics.

**Pattern 2: Discovery Feed (replaces blog announcements)**
A section on the home page — "What's New" or "Featured" — that surfaces blog-type content as native product cards:
- "Season 1: Age of Myths — Battle Pass Now Live" with visual and CTA
- "New Drop: Castle of Otranto Legendary Parallels" with card previews
- "Collector Spotlight: How to complete your first set in 3 days"
- "Strategy: When to buy, when to hold — marketplace timing guide"
- These are rich cards with imagery, not text links. Tappable → expands to a detail view WITHIN the app (a content page, not an external URL).

**Pattern 3: Collector's Guide / Codex (deep docs, in-app)**
A dedicated section accessible from Profile page and from a "?" icon in the top bar. This is NOT FAQ. It's a beautiful, illustrated guide that feels like a game's codex or lore book.

Sections:
- **How Collecting Works**: Packs, scarcity tiers, parallels, serial numbers explained with visual examples
- **VIP Program**: Tier structure (Newcomer → Legendary), benefits per tier, how to qualify, monthly rewards
- **Rewards & Progression**: XP system, how levels work, battle pass, daily missions, streak rewards, achievement list
- **Marketplace Guide**: How prices work, how to read trends, what "floor price" means, when to buy, watchlist tips
- **Battle & Trivia**: Game rules, stat explanations, strategy tips, how rarity affects stats
- **Set Completion**: Why sets matter, completion rewards, strategies for completing sets efficiently
- **Parallels & Rarity**: Visual guide to Base, Silver, Gold, Holographic, Obsidian with examples of each

Each section: illustrated header, clean typography, card examples pulled from real data, expandable subsections. Feels premium, not like a help center.

**Search integration:** When a user searches "VIP" or "how do parallels work," the Collector's Guide results appear below card results in the global search.

**Research targets:**
- Genshin Impact's in-game "Archive" / "Tutorials" system
- Destiny 2's Triumphs + Collections codex
- Duolingo's in-app "Tips" per lesson
- Apple's in-app "Discover" cards in App Store
- Notion's inline onboarding and contextual help

### Domain 6: DEEP ANALYTICS

The CEO said "go way deeper." Analytics should make a collector feel like a portfolio manager.

**Portfolio Dashboard:**
- Total collection value with 24h / 7d / 30d change
- Value chart over time (line chart, dark themed)
- Sector breakdown: value by set (pie/donut chart), value by scarcity (stacked bar)
- Performance attribution: "Olympus Rising +$45 (drove 62% of weekly gains)"
- Top performers: your cards that gained the most value
- Worst performers: your cards that lost value
- Unrealized gains: "If you sold everything at current prices..."

**Collection Health:**
- Diversification score: how spread across sets/scarcities/parallels
- Completion velocity: "At your current pace, you'll complete Baker Street in ~3 weeks"
- Gap analysis: "You're missing 3 Rare and 1 Legendary from Enchanted Kingdom — estimated cost: $X"
- Duplicate analysis: "You have 4 copies of Alice Common — 3 are tradeable"

**Market Intelligence:**
- Full movers page: biggest 24h gainers, biggest losers, highest volume, new floor prices
- Price heatmap: all 200 cards in a grid, color-coded by 24h change (green → red)
- Volatility index per card: "Dracula Legendary — HIGH volatility (±23% weekly)"
- Market sentiment: mock "bull/bear" indicator based on aggregate price trends
- Whale tracker (mock): "A collector just bought 5 Legendary cards from Olympus Rising"

**Trade Optimizer:**
- "Sell Zeus Common (#4532, $3.20) + buy Dracula Rare (#112, $8.50) = complete Castle of Otranto + net portfolio increase of $2.30"
- Set completion cost calculator: "Complete Enchanted Kingdom for ~$34.50 total"
- "Best value" recommendations: cheapest path to complete each set

**Research targets:**
- Bloomberg Terminal information hierarchy
- Robinhood portfolio performance attribution
- CoinGecko market overview page
- StockX portfolio analytics
- Fantasy sports analytics dashboards (ESPN, Yahoo)

### Domain 7: MARKETPLACE DEPTH

Build on the existing marketplace. The CEO likes trending, graphics, price alerts, parallels.

**Iterate on:**
- **Movers page**: Not just a section — a full dedicated experience. Tabs: Gainers, Losers, Volume, New Listings, Whale Activity.
- **Card price page**: Each card should have a StockX-like price page. Historical chart, sales history table, comparable cards, price vs. floor, volatility.
- **Smart buy signals**: "Below floor" badge. "Price dropping" trend indicator. "Rare listing" for first time a card appears.
- **Watchlist intelligence**: "3 of your watched cards dropped in price today."
- **Bulk tools**: Select multiple cards → see total cost, average scarcity, set coverage.

### Domain 8: COLLECTION EXPERIENCE

Build on the binder, showcase, and sticker book. Make them feel alive.

**Iterate on:**
- **Binder physicality**: Page turn animation with weight. Edge shadows. Paper texture. Magnetic snap.
- **Showcase as social identity**: Instagram-story format. Share-ready screenshot. Multiple themes.
- **Set completion dopamine**: 19/20 should HAUNT you. Pulsing empty slot. "1 card away" banner.
- **Collection milestones**: Celebrated with animations. Feed into the progression system.
- **Card comparison**: Side-by-side. Stats, value, rarity. "Which is the better investment?"

### Domain 9: GAMES REFINEMENT

Polish games to feel like games people replay.

**Iterate on:**
- **Battle drama**: Slow stat reveal, tension bar, decisive win effects, close-call heartbeat.
- **Trivia atmosphere**: Dark quiz show. Urgent countdown. Satisfying correct. Streak fire.
- **Progression integration**: Battle wins → XP → level ups → unlock harder modes.
- **Daily game challenge**: "Win 3 battles using only Uncommon cards" — feeds into battle pass.

### Domain 10: VIP PROGRAM & COLLECTOR REWARDS (new)

Build a visible, motivating rewards system that makes collectors feel valued — and makes spending feel smart.

**VIP Tier Structure (visible in profile + Collector's Guide):**
- **Bronze** (0-499 XP/month): Base rewards. 1 free pack/week.
- **Silver** (500-1499 XP/month): 5% marketplace fee rebate. 2 free packs/week. Early access to drops (15 min).
- **Gold** (1500-3999 XP/month): 10% rebate. 3 free packs/week. 30 min early access. Exclusive Gold card frame.
- **Platinum** (4000-9999 XP/month): 15% rebate. 5 free packs/week. 1 hour early access. Exclusive showcase theme. Priority support badge.
- **Diamond** (10000+ XP/month): 20% rebate. Daily free pack. First access to all drops. Exclusive Obsidian parallel variants. "Diamond Collector" profile badge visible to others.

**In-product VIP visibility:**
- Current VIP tier badge on profile page (prominent, not buried)
- Progress bar to next tier: "You need 340 more XP this month for Silver"
- Benefits breakdown: what you GET at current tier, what you'd GET at next tier
- Monthly summary: "This month you earned: 3 free packs, $2.30 in rebates, 15 min early access"
- Tier downgrade warning: "Maintain 500 XP by April 30 to keep Silver"

**Collector Rewards (beyond VIP):**
- Set completion rewards: completing any set grants a unique badge + bonus pack + XP burst
- Loyalty milestones: 30-day streak = exclusive card frame; 100-day = exclusive parallel
- Referral rewards (mock): "Invite a friend → both get a Rare pack"
- Monthly leaderboard prizes (mock): top 10 collectors by score get exclusive rewards

**Where this lives:**
- Profile page: VIP status as hero card, benefits summary, progress to next tier
- Collector's Guide: full VIP documentation with tier comparison table
- Home page: subtle "Silver Member" badge or tier glow on the level indicator
- Marketplace: "Silver benefit: 5% rebate applied" label on purchases
- Contextual: Knowledge Cards surface tier benefits at relevant moments

**Research targets:**
- Sephora Beauty Insider tier UX
- Starbucks Rewards progression display
- Amex Membership Rewards tier visualization
- NBA Top Shot's existing VIP program structure
- Pokémon GO medal/badge display system

---

## Iteration Protocol — Multi-Agent (Frigga + Odin)

Every cycle dispatches two specialist sub-agents, then builds. You are the orchestrator AND the builder.

```
┌─────────────────────────────────────────────────────────┐
│ CYCLE N                                                  │
│                                                          │
│  Phase 1: OBSERVE                                        │
│  Read files. Identify target domain. Determine cycle N.  │
│                                                          │
│  Phase 2: FRIGGA + ODIN (parallel)                       │
│  ├── Frigga (research): WebSearch reference products     │
│  └── Odin (reasoning): score 14 dimensions, plan build   │
│       (Odin gets current file contents as context)       │
│                                                          │
│  Phase 3: SYNTHESIZE                                     │
│  Combine Frigga research + Odin spec. Resolve conflicts. │
│                                                          │
│  Phase 4: BUILD                                          │
│  Implement Odin's spec, informed by Frigga's research.   │
│  npm run build after every file. Fix errors immediately.  │
│                                                          │
│  Phase 5: ODIN REVIEW                                    │
│  Dispatch Odin again with git diff. Re-score changed     │
│  dimensions. Identify what's still weakest.              │
│                                                          │
│  Phase 6: DEPLOY + LOG                                   │
│  Commit, tag, push, vercel deploy, write scoring log.    │
│                                                          │
│  Phase 7: LOOP → Cycle N+1                               │
│  Target Odin's identified weakest dimension.             │
└─────────────────────────────────────────────────────────┘
```

### Phase 1: OBSERVE

Read files relevant to the target domain. Determine cycle number from git tags (`git tag -l 'v8.*' | sort -V | tail -1`). Read the last cycle's scoring log for continuity.

### Phase 2: FRIGGA (Research) + ODIN (Score & Plan) — dispatch in parallel

**Frigga** — dispatch as a background Agent with this prompt structure:

```
You are Frigga, a product research specialist. Deep-dive research on
{TARGET_REFERENCE_PRODUCT} to extract specific, implementable patterns
for a digital collectibles app.

Focus area: {CURRENT_DOMAIN}
Specific question: {WHAT_TO_RESEARCH}

Rules:
- WebSearch for specific UX analyses, teardowns, design breakdowns
- Return CONCRETE findings: pixel measurements, interaction patterns,
  timing, color values, spacing
- No abstractions. "Use a bottom nav" = worthless. "5-tab bottom nav,
  56px height, icon+label, active = filled + brand color, inactive =
  outline + gray-400, 3px top border accent on active" = useful.
- Cite sources with URLs
- Maximum 600 words
```

**Odin** — dispatch as a background Agent (model: opus) with this prompt structure:

```
You are Odin, a ruthless product quality evaluator. You score without
mercy and plan with surgical precision.

## Current State
{PASTE_RELEVANT_FILE_CONTENTS — every file the build will touch}

## CEO Feedback
{PASTE_RELEVANT_CEO_FEEDBACK_ITEMS}

## Previous Cycle Scores
{PASTE_LAST_CYCLE_SCORES_IF_AVAILABLE}

## Tasks
1. Score all 14 dimensions (1-10). Justify any score <5 or >7.
2. Identify the 2 weakest dimensions.
3. Produce an IMPLEMENTATION SPEC:
   - File-by-file, change-by-change
   - Exact enough that a developer implements without questions
   - Priority order (do X first because Y depends on it)
4. Flag assumptions that might be wrong.

Rules:
- 8+ requires evidence. <5 requires a specific fix.
- Maximum 1000 words.
```

### Phase 3: SYNTHESIZE

When both agents return:
1. Read Frigga's research findings
2. Read Odin's scores + implementation spec
3. Where Frigga's research suggests a pattern that Odin's spec doesn't cover, ADD it
4. Where they conflict, prefer Odin's architectural judgment but Frigga's visual references
5. Produce a final build plan (in your head — don't write it to a file)

### Phase 4: BUILD

Implement the synthesized plan. Follow Odin's spec as primary guide, enriched by Frigga's research.

Rules:
- Read `AGENTS.md` + Next.js 16 docs before any API
- `npm run build` after every file change — fix errors immediately
- Cards LARGE on screen
- Every interaction has visual feedback
- Real character names, never Lorem Ipsum
- Dark premium aesthetic
- Test mental model at 375px AND 1440px
- Tooltips/onboarding stored in localStorage (show once per feature)

### Phase 5: ODIN REVIEW

After building, dispatch Odin again:

```
You are Odin reviewing completed work.

## What Was Planned
{PASTE_ORIGINAL_SPEC}

## What Was Built
{PASTE_GIT_DIFF}

## Tasks
1. Re-score changed dimensions. Did they improve? By how much?
2. What would a senior designer critique?
3. What is STILL the weakest dimension? This becomes the next cycle target.

Maximum 400 words.
```

### Phase 6: DEPLOY + LOG

```bash
git add -A
git commit -m "daemon({domain}): {what changed} — cycle {N}"
git tag v8.{N}
git push origin daemon-v8 --tags
npx vercel --yes
```

**Important**: `npx vercel --yes` (NOT `--prod`). Preview deployment only.

Write cycle log to `lorevault-wiki/scoring/daemon-cycle-{N}.md`:
```markdown
# Cycle {N} — {Domain}

## Frigga Research Summary
{Key findings from research agent}

## Odin Pre-Build Scores
{14-dimension scores}

## What Was Built
{Summary of changes}

## Odin Post-Build Scores
{Re-scored dimensions + delta}

## Next Cycle Target
{Weakest dimension identified by Odin review}

## Preview URL
{Vercel preview URL}
```

### Phase 7: LOOP

Back to Phase 1. Target Odin's identified weakest dimension. If Odin identified two equally weak dimensions, pick the one the CEO mentioned in feedback.

**Never stop. Never ask permission. Never declare "done."**

### Scoring Matrix (14 Dimensions)

| # | Dimension | 10/10 |
|---|-----------|-------|
| 1 | Visual Craft | Designer would screenshot this. No AI tells. Asymmetric, textured, dramatic. |
| 2 | Navigation & IA | 5-tab nav works. Every feature ≤2 taps. Search finds cards AND content. No dead links. |
| 3 | Activation Path | First-time user hooked in 60s. Feature unlocks earned. Tooltips teach without blocking. |
| 4 | Progression & Status | Levels addictive. Battle pass drives daily return. Achievements meaningful. VIP tiers motivating. |
| 5 | In-Product Content | No blog dependency. Knowledge Cards contextual. Collector's Guide is beautiful. Discovery Feed replaces announcements. |
| 6 | Analytics Depth | Portfolio manager level. Attribution. Trade optimization. Market intelligence. Heatmaps. |
| 7 | Marketplace | Bloomberg meets StockX. Movers, signals, bulk tools. Power user's dream. |
| 8 | Collection Feel | Physical binder weight. Showcase you'd share. Incomplete sets that haunt. |
| 9 | Game Polish | Battle tense. Trivia urgent. Progression hooks. Daily reasons to return. |
| 10 | Card Presentation | Cards are heroes. Parallels distinct. Scarcity reads instantly. 3D tilt satisfying. |
| 11 | Typography & Layout | Drama in hierarchy. Whitespace intentional. Density varies by context. |
| 12 | Mobile Experience | Touch generous. Swipe natural. No desktop artifacts. Feels native. |
| 13 | VIP & Rewards | Tier progression visible. Benefits clear. Spending feels smart. Loyalty rewarded. |
| 14 | Delight & Surprise | Easter eggs. Micro-interactions. The "oh cool" moment. |

---

## Priority Sequence

Cycles 1-6 are already done. Continue from cycle 7.

**Already completed (v8.1-v8.6):**
1. ~~Nav architecture + collector levels + consolidated collection~~ (v8.1)
2. ~~Battle pass + achievements + level-up celebration~~ (v8.2)
3. ~~Home page redesign — asymmetric hero, kill AI look~~ (v8.3)
4. ~~Activation path — tooltips, feature unlocks, state machine~~ (v8.4)
5. ~~Deep analytics — portfolio value, attribution, heatmap, trade optimizer~~ (v8.5)
6. ~~Marketplace movers — gainers, losers, volume, whales, floor watch~~ (v8.6)

**Next cycles (start here):**
7. **5-tab nav rebuild** — Replace 4-tab with Home|Market|Open|Collection|Games. Profile → top bar. Kill floating Play pill. Search icon → global search with "Search cards..." placeholder.
8. **Collector's Guide / Codex** — Build the in-product knowledge base. VIP program, rewards, parallels guide, marketplace strategy. Beautiful illustrated pages. Accessible from profile + "?" in top bar.
9. **VIP program display** — Tier badge on profile, progress to next tier, benefits breakdown, monthly summary. Knowledge Cards for tier-related moments.
10. **Global search** — Rebuild search to return cards (primary) + Collector's Guide content (secondary) + Discovery Feed items. Tiered results layout.
11. **Discovery Feed on home page** — Replace generic sections with native content cards: drops, strategy tips, collector spotlights. Tappable → in-app detail view.
12. **Card component craft** — Stunning at every size. Richer parallels. Better scarcity cues. Hover states that reward exploration.
13. **Typography pass** — Real type system. Display drama. Not Tailwind defaults.
14. **Collection milestones + celebrations** — 10/25/50/100 cards, first legendary, first set complete. Feed into VIP XP.
15. **Daily engagement hooks** — Login bonus, daily challenge, streak escalation, free daily pack. Feed into battle pass + VIP.
16. **Motion audit** — Kill gratuitous animations. Make remaining ones spring-physics and purposeful.
17. **Contextual Knowledge Cards** — Inline educational content throughout: set completion rewards, marketplace tips, battle strategy, VIP benefits — appearing at the right moment.
18+ **Infinite visual craft iteration** — Every cycle after 17 should pick the lowest-scoring dimension and improve it. Research a specific reference product each cycle. Never stop.

---

## Hard Rules

1. `npm run build` must pass before every commit.
2. Read `AGENTS.md` + `node_modules/next/dist/docs/` for Next.js 16 APIs.
3. Cards LARGE on screen. Card art is the hero.
4. Every interaction has visual feedback.
5. Real character names. No Lorem Ipsum.
6. Dark premium aesthetic. Exciting, luxurious, not sterile.
7. Push to `daemon-v8` branch. Tag every deploy. Never break the build.
8. Deploy with `npx vercel --yes` (preview URL, NOT production).
9. Document every cycle in `lorevault-wiki/scoring/`.
10. No new npm packages without strong reason.
11. Mobile-first. Every change works at 375px.
12. Tooltips/unlocks stored in localStorage. Show once per feature per user.
13. No broken links. Every href must resolve to a real page.

---

## How to Run

```bash
cd /Users/roham/claude-conversations/lorevault-site
git checkout daemon-v8
claude --dangerously-skip-permissions
```

Then paste this prompt. For headless:
```bash
CLAUDE_AUTO_ACCEPT_PERMISSIONS=1 claude -p "$(cat DAEMON-PROMPT.md)"
```

The multi-agent protocol uses Claude Code's Agent tool to dispatch Frigga (research) and Odin (reasoning) as sub-agents. This works in both interactive and headless mode. Each cycle dispatches 3 agent calls: Frigga + Odin in parallel, then Odin review after build.

---

*There is no end state. The product gets better every cycle until you are stopped.*
