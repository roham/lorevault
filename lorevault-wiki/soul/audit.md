# LoreVault Soul Audit — Phase 0 Cycle 1

**Date**: 2026-04-14
**Auditor**: Soul Daemon v8
**Verdict**: 50+ features, zero opinions. The swiss army knife diagnosis is correct.

---

## Home Page Sections: 19

| # | Section | Purpose | Serves Any Vision? |
|---|---------|---------|-------------------|
| 1 | Morning Toast | "N things waiting for you" nudge | No — noise |
| 2 | Collection Comparison | Side-by-side flex via URL param | No — social vanity |
| 3 | Month-End FOMO Banner | "2x XP, N days left" | No — manufactured urgency |
| 4 | Hero (Level + Stats + Smart CTA) | Collector level, VIP, streak, cards count, smart CTA | Partially — CTA is useful, stats are noise |
| 5 | Login Calendar | 7-day daily reward claim | No — retention hack, not soul |
| 6 | Daily Challenge | Progress bar mission | No — engagement loop, not soul |
| 7 | Featured Set Event | Weekly 2x XP event | No — manufactured urgency |
| 8 | 7-Day Challenge Chain | Sequential daily challenges | No — retention hack |
| 9 | Collector Pass | 30-tier battle pass preview | No — meta-progression noise |
| 10 | Weekly Challenges | 3 weekly progress bars | No — engagement loop |
| 11 | Season 2 Tease | "Coming soon" silhouettes | No — FOMO tease |
| 12 | Featured Cards | Horizontal legendary scroll | Maybe — for Vision B (chase) |
| 13 | Referral Banner | "A friend invited you" | No — growth hack |
| 14 | Set Collection Progress | Per-set completion bars | Yes — Vision B core mechanic |
| 15 | Discovery Feed | Story carousel | Yes — Vision A core mechanic |
| 16 | Live Feed (FOMO + Social) | Legendaries pulled today + social feed | No — FOMO/social noise |
| 17 | Season Progress | Season track preview | No — meta-progression |
| 18 | Monthly Leaderboard | Top 5 XP + player rank | No — competitive noise |
| 19 | Collection Snapshot | Last 6 cards horizontal scroll | Maybe — lightweight |

**Sections serving a vision**: 2-3 out of 19
**Sections that are pure engagement noise**: 16-17 out of 19

---

## Routes: 27

| Route | Purpose | Serves Vision A? | Vision B? | Vision C? |
|-------|---------|:-:|:-:|:-:|
| `/` | Home (19 sections) | Rebuild | Rebuild | Rebuild |
| `/welcome` | Onboarding | Rebuild | Rebuild | Rebuild |
| `/packs` | Pack opening | Yes | Yes | Yes (as reward) |
| `/card/[id]` | Card detail | Yes (lore) | Yes (stats) | Yes (stats) |
| `/collection` | Collection grid | No | Yes | No |
| `/collection/sets` | Set-based view | No | Yes (core) | No |
| `/collection/showcase` | Curated display | No | No | No |
| `/collection/smart` | Auto-sorted collections | No | No | No |
| `/collection/analytics` | Stats/charts | No | No | No |
| `/marketplace` | Buy/sell cards | No | Yes (gap-fill) | No |
| `/discover/[slug]` | Articles/lore | Yes (maybe) | No | No |
| `/challenges` | Challenge page | No | No | No |
| `/guide` | How-to guide | No | No | No |
| `/hall` | Hall of Fame | No | No | No |
| `/forge` | Transmute/burn | No | No | No |
| `/codex` | Lore encyclopedia | No | No | No |
| `/chronicle` | Timeline | No | No | No |
| `/search` | Global search | No | No | No |
| `/profile` | Player profile | No | No | No |
| `/games` | Games hub | No | No | No |
| `/games/battle` | Card battle | No | No | Yes (core) |
| `/games/trivia` | Trivia game | No | No | No |
| `/games/baseball` | Baseball hub | No | No | No |
| `/games/baseball/play` | Baseball game | No | No | No |
| `/games/baseball/draft` | Baseball draft | No | No | No |
| `/games/baseball/lineup` | Baseball lineup | No | No | No |
| `/games/baseball/tournament` | Baseball tournament | No | No | No |

**Routes needed by any vision**: 4-6 out of 27
**Routes that should be deleted or hidden**: 21-23

---

## Components: 49

### Serve NO vision (delete candidates): 33
- **Baseball** (7): DiceRoller, OutcomeReveal, ParticleBurst, ScreenShake, StealReveal, BaseballShareCard, CrowdReaction
- **Guide** (9): GuideNav, GuideSection, RewardsSection, MarketplaceSection, SetsSection, ParallelsSection, BattleSection, CollectingSection, VIPSection
- **Marketplace bloat** (6): CardQuickView, FilterChips, FloorPriceTable, MarketStats, PriceAlertModal, PriceChart
- **Engagement noise** (11): AchievementToast, AchievementCelebration, LevelUpCelebration, PrestigeCelebration, LivePulse, SeasonTrack, SocialFeed, WelcomeBack, CollectionPills, PWAInstall, CardJourney

### Potentially useful for prototypes: 16
- **Core**: CardItem, BinderCard, Navigation (stripped)
- **Vision A**: LoreFragment, FeedCard
- **Vision B**: SetProgress, MarketplaceFAB, SalesTicker, RecentActivity, MarketMovers
- **Vision C**: BattleCard, StatReveal
- **Shared**: UnlockCelebration (rethemed), FeatureGate, Tooltip, ShareCard

---

## Store Engagement Loops: 36+

Counted by independent system in `src/lib/store.ts`:

1. Card ownership
2. Showcase IDs
3. Pack credits
4. XP system
5. Streak tracking
6. Collector level / tier
7. Achievements
8. Season tier
9. Daily missions
10. Battle records
11. Trivia records
12. Saved decks
13. Population data (card census)
14. Pinned badges
15. Lore nodes / codex
16. Prestige system
17. Transmutation (forge)
18. Card burning
19. Population decay / aging
20. Daily pack claim
21. Login calendar (7-day)
22. Collector pass (30-tier)
23. Weekly challenges
24. Collector milestones
25. Active title prefix
26. Featured set event
27. Event badges
28. Challenge chain (7-day)
29. Monthly leaderboard
30. Month-end bonus
31. Smart CTA engine
32. Pending actions (morning toast)
33. Collection flex (comparison)
34. Social challenge encoding
35. Card meta / aging tiers
36. Origin badges

### Additional lib modules (17):
- `vip.ts` — VIP tier system
- `seasonal-vault.ts` — Seasonal vault
- `card-dna.ts` — Card DNA
- `pulse.ts` — FOMO/live pulse  
- `referral.ts` — Referral system
- `binder-store.ts` — Binder view
- `smart-collections.ts` — Smart collections
- `showcase-store.ts` — Showcase store
- `activation.ts` — Activation tracking
- `analytics.ts` — Analytics
- `marketData.ts` — Market data
- `globalSearch.ts` — Global search
- `legacy.ts` — Legacy compat
- `onboarding.ts` — Onboarding
- `ai.ts` — AI features
- `achievements.ts` — Achievement definitions
- `store.ts` — Main store (1700+ lines)

**Loops serving any vision's first-10-interactions**: ~5 (card ownership, packs, lore nodes, set progress, battle records)
**Loops that are pure engagement infrastructure**: ~31

---

## Layout Bloat

Global `layout.tsx` renders 5 always-on overlays:
1. `<UnlockCelebration />` — celebration animation
2. `<PrestigeCelebration />` — prestige animation  
3. `<LivePulse />` — "X pulled a legendary!" ticker
4. `<PWAInstall />` — install prompt
5. `<WelcomeBack />` — return-user greeting

Plus `<Navigation />` — 5-tab bottom bar (Home, Market, Packs, Collection, Games)

**For prototypes**: Layout needs to be completely replaced with minimal chrome.

---

## The Diagnosis

| Metric | Count | Needed for Soul |
|--------|-------|----------------|
| Home sections | 19 | 1-3 |
| Routes | 27 | 3-5 per vision |
| Components | 49 | ~10 per vision |
| Store loops | 36+ | 3-5 per vision |
| Lib modules | 17 | 2-3 per vision |
| Layout overlays | 5 | 0 |
| Bottom nav tabs | 5 | 0-1 |

**The app is a feature museum.** Every individual feature is well-built. But together they create a 19-section home page where a first-time user has no idea what to DO. There is no single dominant verb. There are at least 8 different "progress bar" systems competing for attention on the home page alone.

**The path forward**: Three prototype routes (`/prototype/story`, `/prototype/chase`, `/prototype/play`) with a shared stripped layout. Each prototype picks 1 emotion and 3-5 screens max. Everything else is hidden.
