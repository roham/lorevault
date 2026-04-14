# LoreVault Master Plan: 100 Users to Millions

## Agent Architecture

```
Master Odin (CEO-only deploy/stop — Roham)
│  Reads all domain outputs. Draws cross-product parallels.
│  The ONLY agent that sees across product boundaries.
│
├── LoreVault Odin (team lead can deploy/stop)
│   ├── Dispatches Frigga for research
│   ├── Writes to lorevault-wiki/ ONLY
│   ├── Issues directives to lorevault-wiki/DIRECTIVES.md
│   └── Product daemon reads directives and builds
│
├── Collectibles Odin (Collectibles team lead can deploy/stop)
│   └── Owns Top Shot, All Day, platform strategy
│
├── Consumer Finance Odin (CF team lead can deploy/stop)
│   └── Owns Peak Money, DeFi, Flow token strategy
│
└── Company Odin (CEO-only — existing deployed odin:odin)
    └── Owns ops, process, people, infrastructure
```

**Permission model:**
- Master Odin: CEO deploys, CEO stops. Nobody else.
- Domain Odins: respective team lead deploys/stops. CEO can override.
- Context isolation: each domain Odin writes to its own storage. Cross-product signals noted but not acted on — Master Odin synthesizes.

---

## The Complete Lever Map

Every lever a digital collectibles startup can pull, organized by domain. The infinite research loop cycles through these — going wide first (what are all the levers?), then deep (what's the best play for each?), then creative (what has nobody tried?).

---

## ALL THE LEVERS

### A. PRODUCT (The Thing Itself)
1. Core collecting experience — pack opening, card presentation, collection management
2. Card identity — sealed/reveal, aging/patina, provenance, contextual minting
3. Games — battle (Top Trumps), trivia, puzzle, draft, tournament, PvP
4. Mini-games — daily spin, scratch cards, prediction markets, card crafting/fusion
5. Social features — profiles, showcases, trading, gifting, following, activity feed
6. Progression — XP, levels, battle pass, achievements, VIP tiers, streaks
7. Marketplace — buy/sell, floor prices, watchlist, price alerts, portfolio tracking
8. Search & discovery — global search, recommendations, "cards you need"
9. In-product content — Collector's Guide, Discovery Feed, knowledge cards
10. Onboarding — first-time experience, activation path, feature unlocking
11. Accessibility — mobile performance, offline mode, low-bandwidth support
12. Personalization — custom card backs, showcase themes, profile badges

### B. CONTENT & IP (The Universe)
13. Public domain IP research — fandom size, visual richness, trademark risks
14. Character design & art pipeline — AI-generated (fal.ai FLUX), artist commissions, style guides
15. Set design — themes, aesthetics, card count, scarcity distribution
16. Lore & world-building — character backstories, hidden chapters, cross-set connections
17. Editorial content — strategy guides, market analysis, character spotlights
18. Dynamic content — seasonal events, limited drops, holiday specials
19. UGC — user-submitted lore, custom collections, community-voted cards

### C. GROWTH & DISTRIBUTION (Getting Users)
20. Viral mechanics — sealed unboxing as content, share-to-unlock, referral rewards
21. Social media — TikTok/BookTok, YouTube Shorts, X/Twitter, Instagram
22. Influencer strategy — BookTok creators, TCG YouTubers, mythology podcasters
23. Community platforms — Discord server, Reddit community, Telegram
24. SEO & content marketing — mythology blog, "did you know" educational content
25. Paid acquisition — social ads, search ads, app install campaigns
26. PR & media — gaming press, culture press, tech press
27. Cross-promotion — partnerships with other Dapper products, Flow ecosystem
28. App store optimization — if native mobile app, ASO keywords, screenshots, ratings
29. Email/push — lifecycle marketing, drop alerts, streak reminders

### D. RETENTION & ENGAGEMENT (Keeping Users)
30. Daily hooks — free daily pack, daily challenge, login calendar
31. Streaks — consecutive day rewards, streak freeze, milestone bonuses
32. FOMO mechanics — time-limited drops, expiring challenges, seasonal exclusives
33. Social pressure — activity feed, leaderboards, "your friend just pulled..."
34. Collection pressure — set completion %, "you need 3 more", completion rewards
35. Economic engagement — portfolio tracking, price alerts, trade signals
36. Competitive engagement — ranked battles, tournaments, faction wars
37. Creative engagement — showcase building, lore writing, community voting

### E. MONETIZATION (Making Money)
38. Pack sales — standard ($3-5), premium ($10-25), event-specific
39. Marketplace fees — 5% transaction fee on secondary sales
40. Battle pass — $5-10/season, premium rewards track
41. Cosmetics — card backs, showcase themes, profile frames, sound packs
42. Convenience — extra pack slots, auto-complete sets, instant reveal
43. VIP subscriptions — monthly fee for rebates, early access, exclusive content
44. Physical merchandise — printed cards, art books, apparel
45. Licensing out — if LoreVault characters become culturally significant

### F. COMMUNITY & CULTURE (The Tribe)
46. Discord architecture — channels, roles, bots, events, voice chats
47. Creator program — tools and rewards for content creators
48. Tournaments & events — weekly, monthly, seasonal, championship
49. Lore community — fan fiction, fan art, theory discussions
50. Governance — community votes on new sets, card designs, feature priorities
51. Real-world events — conventions, meetups, card shows
52. Charity / education — mythology education partnerships, library programs

### G. TECHNOLOGY & INFRASTRUCTURE
53. Blockchain deployment — Flow NFTs, smart contracts, on-chain provenance
54. Dapper Wallet integration — custodial, fiat on-ramp, no-crypto UX
55. Backend services — pack minting, marketplace, progression, matchmaking
56. Mobile app — native iOS/Android vs PWA vs hybrid
57. Analytics — user tracking, funnel analysis, retention cohorts, A/B testing
58. API platform — third-party tools, bots, analytics dashboards
59. Performance — CDN, image optimization, edge computing

### H. PARTNERSHIPS & ECOSYSTEM
60. Publisher partnerships — mythology books, film/TV adaptations
61. Educational partnerships — schools, museums, libraries
62. Platform partnerships — Apple, Google, Steam, Epic
63. Brand collaborations — mythology-adjacent brands
64. Flow ecosystem — cross-promotion with other Flow apps
65. Media partnerships — BookTok creators, mythology podcasts, YouTube channels

### I. MEDIA & ENTERTAINMENT (The Franchise)
66. Animated trailers — 30-60 second character reveal trailers per set
67. Podcast — mythology storytelling, collector interviews, market analysis
68. Web series — short animated episodes featuring card characters
69. Graphic novels — digital comics expanding card lore
70. Movie/TV development — if characters become culturally significant

### J. LEGAL & OPERATIONS
71. Public domain verification — per-character copyright/trademark audit
72. Consumer protection — gambling-adjacent mechanics compliance (loot boxes)
73. International regulations — different rules per market
74. Age gating — COPPA compliance for under-13
75. Moderation — UGC moderation, marketplace fraud prevention

---

## GROWTH PHASES

### Phase 0: Foundation (Pre-Launch → 100 Users)
**Goal**: Product that creates "holy shit" moments. Core loop proven.
**Focus levers**: Product (1-12), Content (13-16), Art pipeline (14)
**Key metric**: "Would you show this to a friend?" rate

### Phase 1: Ignition (100 → 10,000 Users)
**Goal**: Find product-market fit. Identify which community adopts first.
**Focus levers**: Viral mechanics (20), Social media (21), Influencer (22), Community (23), Daily hooks (30-31)
**Key metric**: Day 7 retention, organic share rate

### Phase 2: Growth (10,000 → 100,000 Users)
**Goal**: Scalable acquisition channels. Revenue model validated.
**Focus levers**: Paid acquisition (25), PR (26), Monetization (38-43), Marketplace (7), Tournaments (48)
**Key metric**: CAC/LTV ratio, monthly revenue, marketplace volume

### Phase 3: Scale (100,000 → 1,000,000 Users)
**Goal**: Platform status. Multiple content verticals. International.
**Focus levers**: Mobile app (56), New IP waves (13), Partnerships (60-65), Physical merch (44), Localization
**Key metric**: Monthly active users, revenue per user, international %

### Phase 4: Franchise (1,000,000+ Users)
**Goal**: Cultural significance. The brand means something.
**Focus levers**: Media (66-70), Licensing (45), Real-world events (51), Governance (50), Education (52)
**Key metric**: Brand recognition, media mentions, cultural impact

---

## THE INFINITE RESEARCH LOOP

Each cycle picks ONE lever from the map above and goes deep:

```
CYCLE N:
  1. FRIGGA (Research): Deep-dive the lever
     - What have the best companies done?
     - What worked? What failed? Why?
     - What data exists? What numbers matter?
     - What's the state of the art in 2026?

  2. ODIN (Strategy): Synthesize into a LoreVault plan
     - How does this lever apply to OUR product?
     - What's the specific play?
     - What would we build/change/launch?
     - What's the expected impact?
     - What's the cost/effort?

  3. FRIGGA (Creative): Go wild
     - What has NOBODY tried in this space?
     - What would blow minds?
     - What's the 10x version of the conventional play?
     - What adjacent industries can we steal from?

  4. ODIN (Prioritize): Score and rank
     - Impact (1-10)
     - Feasibility (1-10)
     - Urgency (1-10)
     - Write specific next actions

  5. BUILD (if applicable): Make product changes
     - If the research suggests product changes, implement them
     - Generate new art for new sets
     - Update the daemon prompt with new priorities

  6. DOCUMENT: Write findings to lorevault-wiki/research/
     - Save every cycle's output
     - Build a growing knowledge base

  7. LOOP → Next lever (pick the highest-urgency unresearched lever)
```

---

## CYCLE SEQUENCING (First 30 Cycles)

| Cycle | Phase | Lever | Question |
|-------|-------|-------|----------|
| 1 | 0 | Core UX (1) | What makes the pack-opening moment world-class? |
| 2 | 0 | Card Identity (2) | How do sealed/reveal + aging create obsession? |
| 3 | 0 | Norse Mythology Set (13) | Full character design, art, lore for Asgard Unleashed |
| 4 | 0 | Arthurian Legend Set (13) | Full character design for Knights of the Round Table |
| 5 | 1 | TikTok/BookTok Strategy (21) | Exact playbook for 100K views in 30 days |
| 6 | 1 | Discord Community (23) | Server architecture, bot setup, launch sequence |
| 7 | 1 | Influencer Playbook (22) | Who are the 50 creators? What's the pitch? |
| 8 | 1 | Referral Mechanics (20) | What referral loop drives k-factor > 1? |
| 9 | 0 | Battle System 2.0 (3) | New game modes that drive daily return |
| 10 | 0 | Mini-Games (4) | What quick-session games work? Card puzzle? Prediction? |
| 11 | 1 | Daily Engagement (30) | Login calendar, daily spin, streak design |
| 12 | 1 | FOMO Mechanics (32) | Time-limited drops, expiring rewards, seasonal content |
| 13 | 2 | Monetization Modeling (38-43) | Price sensitivity, conversion rates, LTV modeling |
| 14 | 2 | Marketplace Design (7) | What makes a secondary market liquid and exciting? |
| 15 | 1 | Launch Campaign (26) | "The Sealed Vault" campaign — full execution plan |
| 16 | 0 | Journey to the West Set (13) | Character design, art, lore for Celestial Rebellion |
| 17 | 0 | Lovecraft Set (13) | Character design for Eldritch Archives |
| 18 | 2 | Paid Acquisition (25) | What channels, what creative, what CPA target? |
| 19 | 2 | PR Strategy (26) | Which press, what angle, what timing? |
| 20 | 1 | Reddit Community (23) | Subreddit strategy, content calendar, mod structure |
| 21 | 0 | Sound Design (1) | Pack opening sounds, card reveal, battle effects |
| 22 | 0 | Physical Cards (44) | Print-on-demand cards, art prints, collectors editions |
| 23 | 2 | Tournament System (48) | Weekly/monthly tournaments, prizes, rankings |
| 24 | 2 | Creator Program (47) | Tools, rev share, featured creators |
| 25 | 3 | Mobile App (56) | Native vs PWA, platform strategy |
| 26 | 3 | International Expansion | Which markets first? Localization strategy? |
| 27 | 3 | Dapper/Flow Deployment (53-54) | Technical architecture for production |
| 28 | 2 | Email/Push Strategy (29) | Lifecycle automation, trigger events |
| 29 | 3 | Brand Identity (culture) | Voice, visual language, brand guidelines |
| 30 | 4 | Animated Trailers (66) | Character reveal trailers for each set |

---

## SUCCESS METRICS BY PHASE

| Phase | Users | Revenue | Retention (D7) | Marketplace Vol |
|-------|-------|---------|-----------------|-----------------|
| 0 | 100 | $0 | 60%+ | N/A |
| 1 | 10K | $10K/mo | 40%+ | $50K/mo |
| 2 | 100K | $200K/mo | 35%+ | $2M/mo |
| 3 | 1M | $2M/mo | 30%+ | $20M/mo |
| 4 | 5M+ | $10M+/mo | 28%+ | $100M+/mo |
