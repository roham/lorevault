# Odin → Product Daemon: Build Directives

This file is the bridge between the strategy daemon (Odin) and the product daemon (builder). Odin writes directives. The product daemon reads and executes them.

**Contract**: Odin appends new directives. Product daemon updates status to IN_PROGRESS when starting, DONE (with commit hash) when complete. Neither daemon deletes the other's entries.

---

## Active Directives

### DIRECTIVE-001: Complete sealed/reveal UX
- **Priority**: P0
- **Source**: Collectibility Manifesto — Discovery Surprise dimension
- **What to build**: Dramatic reveal animation when user taps a sealed card. Particle burst, card flip with art reveal, sound-ready (visual cue where sound would go). Update pack opening flow to deliver all cards sealed by default.
- **Why**: Sealed/reveal is the #1 highest-impact collectibility mechanic. Every pack opening becomes a TikTok moment.
- **Acceptance criteria**: Cards arrive sealed from pack opening. Tapping a sealed card triggers a reveal animation. Character art appears after reveal. Sealed state persists in localStorage.
- **Status**: DONE — commit 5a8a658, v8.21

### DIRECTIVE-002: Build Norse Mythology set (Asgard Unleashed)
- **Priority**: P1
- **Source**: Strategic Playbook — Wave 2a IP expansion
- **What to build**: 20 characters in `cards.ts` (Odin, Thor, Loki, Freya, Fenrir, Valkyries, Heimdall, Baldur, Hel, Jormungandr, Tyr, Sigurd, Brynhildr, Ragnar, Norns, Huginn/Muninn, Sif, Idun, Skadi, Surtr). New set entry in `sets.ts`. Generate all art via `scripts/generate-card-art.mjs` with Norse aesthetic. Add Discovery Feed entries.
- **Why**: Norse scores 56/60 on IP potential. Marvel/God of War primed massive fandom. Zero trademark risk.
- **Acceptance criteria**: 20 characters × 2 cards = 40 new cards. All with FLUX art. Set appears in collection, marketplace, guide. Discovery Feed has Norse spotlight entry.
- **Status**: DONE — commit 303c49c, v8.22

### DIRECTIVE-003: Add card aging visual effects
- **Priority**: P1
- **Source**: Collectibility Manifesto — Temporal Weight dimension (currently 1/10)
- **What to build**: CSS filter layers on CardItem that change based on `battleCount` and `acquiredAt`. Battle-worn (50+ battles): subtle edge wear. Bonded (30+ days): warm glow. Pristine (0 battles, 0 trades): factory sheen. Read from card meta in localStorage.
- **Why**: Makes every card unique through use. Triggers endowment effect. Temporal Weight: 1→7.
- **Acceptance criteria**: Two copies of the same card look visually different after different usage patterns. Effect visible on card detail and in collection view.
- **Status**: DONE — commit 6fce5fe, v8.23

### DIRECTIVE-004: Card provenance — Journey Timeline + Origin Badges
- **Priority**: P0
- **Source**: Strategy Loop S1 — Provenance is weakest dimension (2/10)
- **What to build**: (A) Card Journey Timeline component on card detail page. Vertical timeline rendering existing `CardMeta.history` array: pulled, revealed, battle_win/loss, showcased, traded events with icons, colors, dates. Header with summary stats ("N events over D days"). (B) Origin Badge overlay on CardItem at all sizes. Badges: "Genesis" (first pack opening), "OG" (first 10 cards acquired), "Pristine" (aging tier pristine), "Veteran" (aging tier veteran). Priority system shows highest-qualifying badge. New `getOriginBadge(cardId)` function in store.ts.
- **Why**: Provenance is 2/10. The `history[]` data exists but is invisible. Surfacing it as a timeline + badge system makes every card's life story visible. Journey Timeline alone moves Provenance to 5-6; Origin Badges push to 7. Combined, this is the highest-impact single directive for the weakest dimension.
- **Acceptance criteria**: Card detail page shows chronological event timeline with distinct icons/colors per event type. Origin badges appear on card art at sm/md/lg sizes. Owned cards display "Genesis" or "OG" badges when applicable. All data sourced from existing `CardMeta.history` and `acquiredAt` — no new localStorage schema.
- **Status**: DONE — commit 6e14ac8, v8.24

### DIRECTIVE-005: Achievement badge system + collector profile
- **Priority**: P1
- **Source**: Strategy Loop S1 — Social Proof (4/10) + Utility Loop (6/10)
- **What to build**: (A) Badge manifest of 25-30 achievements across 5 categories: Collection (own X cards, complete set), Battle (win streaks, defeat legendary), Discovery (open X packs, find legendary), Market (buy/sell milestones), Dedication (login days, daily missions). Static JSON definition with conditions. (B) Badge evaluator that checks conditions against localStorage state on pack open, battle complete, and app launch. (C) Collector Profile page: name, "Collecting since" date, total cards, sets completed, battle record, pinned badge strip (3 badges). Badge grid with earned (full color + date) and unearned (grey silhouette + progress hint). (D) Badge unlock celebration modal with particle animation.
- **Why**: Badges create purpose beyond acquisition. The implied hierarchy ("Master Collector" presupposes a collector population) generates social proof even in single-player. Unearned grey badges drive completion behavior via Zeigarnik effect. Projects Social Proof 4→6, Utility Loop 6→7.
- **Acceptance criteria**: 25+ badges defined across 5 categories. Badge evaluator fires on relevant actions. Profile page shows badge grid with earned/unearned states. New badge triggers celebration modal. Pinned badge strip (3 chosen badges) visible on profile header.
- **Status**: DONE — commit d61cfaf, v8.25

### DIRECTIVE-006: Population counters + serial number enhancement
- **Priority**: P1
- **Source**: Strategy Loop S1 — Social Proof (4/10) + Scarcity Legibility (8/10)
- **What to build**: (A) Deterministic population generator: `totalMinted` per card derived from rarity tier (Legendary 15-49, Epic 100-499, Rare 500-1999, Common 2000-9999) via seeded hash of card ID. `currentOwners` as percentage of `totalMinted` with daily noise. (B) Population counter on card detail page: "47 minted · 38 collectors own this." For legendaries <50 minted, dot visualization. (C) Enhanced serial badge on card tile: #1 = "Genesis" holographic, #2-10 = "Low Serial" gold, #11-100 = silver. (D) Rarity labels enhanced: "Legendary · 47 Exist" everywhere rarity appears.
- **Why**: Population counters anchor scarcity with concrete numbers. "1 of 47" is psychologically processed through real scarcity circuits regardless of simulation. Trivial effort, broad surface area. Projects Social Proof +1, Scarcity Legibility 8→9.
- **Acceptance criteria**: Every card has a deterministic `totalMinted` and `currentOwners` count. Card detail page shows population counter. Card tiles show serial number badge with tier-appropriate styling. Rarity labels include population count. All computed from card ID seed — no new localStorage.
- **Status**: DONE — commit dc60a3f, v8.26

### DIRECTIVE-007: Social Showcase & Leaderboards
- **Priority**: P0
- **Source**: Strategy Loop S2 — Social Proof (6→9), Loss Aversion (7→8)
- **What to build**: (A) Hall of Valhalla leaderboard page (`/hall`) with 4 tabs: Top collectors by total cards, rarest cards, oldest aged cards, achievement count. Mix real user data with 30 deterministic phantom collectors from `src/data/leaderboard-seeds.ts`. (B) ShareCard component — generates styled card snapshot with serial, age tier, rarity, owner name. Share intent or download. (C) Collector profile at `/collector/[name]` — public-facing summary: completion %, rarest pull, oldest card, pinned badges. (D) Dynamic RankBadge (Bronze→Silver→Gold→Mythic Collector) based on composite score. (E) Rank decay: 7+ days inactive dims leaderboard rank.
- **Why**: Gambler-collectors need an audience. Leaderboards create positional anxiety. Share cards create flex moments. Rank decay creates return urgency. Social Proof is the biggest gap at 6/10.
- **Acceptance criteria**: Hall page renders 4 leaderboard tabs with mixed real+phantom data. ShareCard produces downloadable image. Collector profile renders at `/collector/[name]`. Rank badge updates as collection changes. 7-day inactivity triggers rank dim.
- **Status**: DONE — commit 23c606c, v8.27

### DIRECTIVE-008: Interactive Lore Engine
- **Priority**: P0
- **Source**: Strategy Loop S2 — Lore Depth (6→9), Utility Loop (7→8)
- **What to build**: (A) Lore Codex page (`/codex`) with node-graph of lore entries. Nodes unlock based on cards owned. Framer Motion animated reveal. (B) `src/data/lore-graph.ts` — directed graph: ~40 nodes across 6 sets, 6 secret nodes requiring cross-set combinations. Each node: id, title, text, requiredCards[], connections[]. (C) LoreFragment component on card detail — "Lore Unlocked" badge when fragment available. (D) Secret threads discovered by cross-set combos → trigger unique achievements. (E) Codex completion % feeds into leaderboard ranking.
- **Why**: Passive lore is wallpaper. A gated graph turns lore into a collectibility driver — cards become keys, not just assets. Lore Depth is tied for biggest gap at 6/10.
- **Acceptance criteria**: Codex page renders node graph with locked/unlocked states. Owning required cards unlocks nodes with animated reveal. 6+ secret nodes require cross-set combos. Secret thread discovery grants achievement. Codex % visible on collector profile.
- **Status**: DONE — commit 0fedc81, v8.28

### DIRECTIVE-009: Provenance Deepening — Lineage & Market History
- **Priority**: P1
- **Source**: Strategy Loop S2 — Provenance (7→9), Loss Aversion (7→8)
- **What to build**: (A) Simulated price sparkline on card detail from deterministic market curves. Rarity base × age multiplier × population scarcity factor. Legendaries trend up, commons fluctuate. (B) LineageStamp in Journey Timeline: pack origin → reveal → battles → achievements → age milestones. Vertical chain of stamped events. (C) Legacy Score: composite number from lineage length + age + battles. Higher legacy = more prominent glow. Displayed on card detail.
- **Why**: Financial gambler-collectors read price charts instinctively. Simulated value history creates paper-gain endowment. Legacy Score makes every action accumulate into visible prestige.
- **Acceptance criteria**: Card detail shows sparkline price history. Lineage chain renders all tracked events. Curves deterministic from card seed. Legacy Score displayed and feeds visual flair. Legendary cards show appreciating curves.
- **Status**: DONE — commit c9e3820, v8.29

### DIRECTIVE-010: Card DNA — Procedural Visual Identity per Instance
- **Priority**: P0
- **Source**: Strategy Loop S3 — Instance Identity (8→9), Scarcity Legibility (9→9+)
- **What to build**: (A) Deterministic `CardDNA` generator in `src/lib/card-dna.ts`. Hash card ID + serial + acquiredAt into a 6-trait genome: background pattern (12 variants: runes, circuits, nebula, scales, etc.), accent hue shift (-30 to +30 degrees off rarity base), border motif (8 variants: thorned, gilded, frost, ember, etc.), signature particle (6 types: embers, snow, lightning, petals, void dust, starfield), watermark glyph (20 character-linked symbols), and card-back art (6 variants per set). All derived from seeded hash — no new localStorage. (B) Apply DNA layers in `CardItem.tsx`: CSS custom properties for hue shift, background pattern as subtle SVG overlay at 4% opacity, border motif as gradient-mask on card edge, signature particle as idle CSS animation (1-3 particles, performant). (C) Card detail page (`/card/[id]`) shows "Card DNA" info strip: lists the 6 trait names, e.g., "Nebula / Frost / Lightning." (D) Two cards of the same character + rarity now look visibly distinct at md size and above.
- **Why**: Instance Identity at 8 means two copies of "Legendary Odin #3" and "Legendary Odin #7" are functionally distinguishable only by serial number. Procedural DNA makes every card visually one-of-one without manual art — the same psychological mechanism that makes PFP traits work in NFTs. The trait combination itself becomes a collector conversation point ("I have the Ember/Thorned Odin"). Pushes Instance Identity 8→9.
- **Acceptance criteria**: Every owned card renders with a unique visual combination derived from its ID seed. Two copies of the same character at the same rarity display visibly different background pattern, hue, and border. Card detail page shows DNA trait strip. No new localStorage writes. Particle animations run at <2% GPU on mobile (CSS-only, no canvas). Card DNA is deterministic — same card always renders identically.
- **Status**: DONE — commit c279330, v8.30

### DIRECTIVE-011: Live Pulse Feed + Collector Reactions
- **Priority**: P0
- **Source**: Strategy Loop S3 — Social Proof (8→9), Loss Aversion (8→9)
- **What to build**: (A) `LivePulse` component — persistent bottom ticker on Home page showing auto-rotating social events. Pulls from existing `SOCIAL_FEED` data plus new dynamically generated events from user actions (pack opens, achievements earned, lore unlocked, leaderboard rank changes). Each event fades in with typewriter effect, pauses 4s, slides out. Accent color per event type from `SOCIAL_FEED_CONFIG`. (B) `PulseDetail` expandable drawer — tapping a pulse event opens a half-sheet showing the event card/achievement with a reaction bar. (C) Reaction system: 5 reactions (Fire, Jealous, Respect, Want, GG) stored in localStorage per event. Deterministic phantom reactions (3-12 per event from seeded hash) create baseline social proof. User reactions animate with micro-burst. (D) "Your Activity" section on Profile page — timeline of the collector's own pulse events, showing which got the most reactions. (E) FOMO counter on Home: "47 legendaries pulled today" — deterministic daily count from date seed, increments by 1 when user pulls a legendary.
- **Why**: Social Proof at 8 has leaderboards and share cards but lacks the ambient social presence that makes a platform feel alive. A persistent feed of "NeonPhoenix just pulled Legendary Fenrir" with visible jealousy reactions triggers competitive acquisition. The reactions themselves are a micro-engagement loop — collectors return to see if their pull got reactions. Phantom reactions ensure the feed never feels dead. FOMO counter creates urgency via social comparison. Pushes Social Proof 8→9 and Loss Aversion 8→9 (seeing others pull while you don't).
- **Acceptance criteria**: Home page shows auto-rotating LivePulse ticker at bottom. Events sourced from existing `SOCIAL_FEED` plus user action events. Tapping event opens drawer with reaction bar. 5 reaction types with animated micro-burst. Phantom reactions render for all events. Profile page shows "Your Activity" timeline. FOMO counter visible on Home page. All data localStorage — no backend.
- **Status**: DONE — commit 31ad47a, v8.31

### DIRECTIVE-012: Seasonal Vault + Countdown Forge
- **Priority**: P1
- **Source**: Strategy Loop S3 — Temporal Weight (8→9), Utility Loop (8→9)
- **What to build**: (A) Seasonal Vault system in `src/lib/seasonal-vault.ts`. Define "Ragnarok Season" as current active season (start: now, end: 30 days from first visit). Season config: 3 exclusive cards (Ragnarok Odin, Fenrir Unbound, Twilight Valkyrie) only pullable during the season window. Countdown timer on `/packs` page showing days/hours/minutes until vault seals. After expiry, cards marked "Vault Sealed" with lock icon overlay — still visible in collection but with exclusive patina. (B) Forge page (`/forge`): combine 3 cards of the same rarity to forge 1 card of next rarity tier (3 Common→1 Uncommon, 3 Uncommon→1 Rare, etc.). Forged card inherits highest Legacy Score of inputs + "Forged" origin badge. Input cards are consumed (removed from collection, added to history as "sacrificed_for_forge" event). Forge animation: cards spiral inward, flash, single card emerges with enhanced glow. (C) Seasonal Forge bonus: during active season, forging costs 2 cards instead of 3. Countdown on Forge page shows bonus window. (D) `src/data/seasonal-cards.ts` — 3 season-exclusive cards with unique gradients and "Season 1: Ragnarok" set tag. Added to card pool only during active season window.
- **Why**: Temporal Weight at 8 has aging effects but nothing that expires — no urgency to act NOW. Countdown timers are the most reliable urgency mechanism in gaming and commerce (auction psychology). Vault-sealed exclusives become status symbols precisely because late collectors cannot obtain them. The Forge creates a genuine utility sink — cards have purpose beyond display, and sacrifice creates real loss aversion. The seasonal forge discount forces a decision: forge now at a discount and lose cards, or wait and pay more. Every mechanic here is a deadline. Pushes Temporal Weight 8→9 and Utility Loop 8→9.
- **Acceptance criteria**: `/packs` page shows countdown timer for active season. 3 season-exclusive cards pullable only during season window. After expiry, cards display "Vault Sealed" overlay. `/forge` page allows combining 3 same-rarity cards into 1 higher-rarity card. Consumed cards removed from collection with "sacrificed_for_forge" history event. Forged cards receive "Forged" origin badge and inherit max Legacy Score. Seasonal discount (2 instead of 3) shown with countdown. Season state persisted in localStorage with start date on first visit.
- **Status**: DONE — commit c8f0a08, v8.32

### DIRECTIVE-013: Ghost Cards + Hidden Pull Mechanics
- **Priority**: P0
- **Source**: Strategy Loop S4 — Discovery Thrill (9→10)
- **What to build**: (A) 6 "ghost" card variants in `src/data/cards.ts` with `ghost-` ID prefix — visually distinct alternate Legendaries with inverted gradients and unique lore. Not shown in collection grid, marketplace, or guide. (B) Hidden pull conditions in `generatePack()` in `src/lib/store.ts`: (1) 13th pack opened, (2) owning exactly 5 Legendaries, (3) pulling Epic on matching day-of-week hash, (4) 7-day login streak, (5) owning all 20 chars from one set, (6) 3rd forge completed. Each condition met + 15% chance = ghost card replaces one pull. Add `lorevault_packs_opened` counter. (C) Ghost card sealed state: pure black overlay with white border pulse (`@keyframes ghost-pulse`). Reveal adds 400ms color-invert flash (`filter: invert(1)`) before settling. (D) Mutation overlay in `src/lib/card-dna.ts`: `getMutationState(cardId)` checks 60+ days owned AND 50+ battles AND Legacy Score >= 70. Returns tier from DNA particle (embers→ember, snow→frost, void-dust→void). Active mutation renders slow-breathing halo (box-shadow pulse, 4s, 0.3 opacity) in CardItem at md+ sizes. No label. (E) Hidden achievement `ghost-finder`: displays as `???` until earned, unlocks on first ghost card reveal, real name: "Void Walker".
- **Why**: Discovery at 9 is fully documented. A 10 requires mechanics that collectors stumble upon and share externally. Ghost cards are the digital equivalent of error variants — value from unexpected existence. Mutation rewards long-term ownership with an unlabeled visual distinction. The hidden achievement creates genuine shock.
- **Acceptance criteria**: 6 ghost cards exist with `ghost-` prefix, not in browse/marketplace. `generatePack()` silently evaluates 6 conditions with 15% trigger. Ghost sealed state has black overlay + white pulse. Reveal includes invert flash. `getMutationState()` returns correct tier. Mutated cards show breathing halo. `ghost-finder` achievement shows `???` until earned. No UI text references ghost cards anywhere.
- **Status**: DONE — commit 1957c96, v8.33

### DIRECTIVE-014: Collector Prestige — Meta-Completion Layer
- **Priority**: P0
- **Source**: Strategy Loop S4 — Completion Drive (9→10)
- **What to build**: (A) `getPrestigeState()` in `src/lib/store.ts` returning `{ unlocked, level, unlockedAt, prestigeChallengesCompleted }`. localStorage key: `lorevault_prestige`. Unlocks when: all 33 achievements earned + codex 100% (48/48) + 4+ sets complete. Checked on every `checkAchievements()`. Fires `CustomEvent('prestige-unlock')` on first unlock. (B) `PrestigeCelebration` component in `src/components/PrestigeCelebration.tsx`: full-screen overlay — screen dims, golden crown scales in (spring), "Collector Prestige Unlocked" text fades in, auto-dismiss 5s. Mounted in layout.tsx. (C) 6 Prestige Challenges (separate from ACHIEVEMENTS, hidden until prestige): forge-legendary, all-parallels, ancient-legendary (60+ day Legendary), codex-reactions (react to 20 nodes), ghost-collector (3+ ghosts), hall-apex (top 3 leaderboard). Add `lorevault_codex_reactions` localStorage. (D) Profile visual: golden crown prefix, "Prestige I" badge, animated gradient border (conic-gradient rotation). Hall: crown glyph on prestige collectors, 6th "prestige" leaderboard tab. (E) Visible achievement `collector-prestige` in standard grid from day one (greyed silhouette) — the distant lighthouse.
- **Why**: Completion at 9 has a visible ceiling. Prestige converts the endpoint into a gateway. Visual distinctions create aspiration in lower-tier collectors. Prestige Challenges require cross-system mastery. The visible achievement serves as a lighthouse pulling collectors through the entire achievement tree.
- **Acceptance criteria**: `getPrestigeState()` reads/writes `lorevault_prestige`. Prestige unlocks at all-achievements + codex-100% + 4-set-complete. `prestige-unlock` CustomEvent fires. PrestigeCelebration renders full-screen ceremony. 6 Prestige Challenges hidden until prestige. Profile shows crown + badge + animated border. Hall shows prestige tab. `collector-prestige` achievement visible from day one.
- **Status**: PENDING

---

## Completed Directives

- **DIRECTIVE-001**: Complete sealed/reveal UX — DONE (v8.21, 2026-04-14). Score: 33→43 (+10).
- **DIRECTIVE-002**: Build Norse Mythology set (Asgard Unleashed) — DONE (v8.22, 2026-04-14). Score: 43→46 (+3).
- **DIRECTIVE-003**: Add card aging visual effects — DONE (v8.23, 2026-04-14). Score: 46→60 (+14).
- **DIRECTIVE-004**: Card provenance — Journey Timeline + Origin Badges — DONE (v8.24, 2026-04-14). Score: 60→71 (+11).
- **DIRECTIVE-005**: Achievement badge system + collector profile — DONE (v8.25, 2026-04-14). Score: 71→74 (+3).
- **DIRECTIVE-006**: Population counters + serial number enhancement — DONE (v8.26, 2026-04-14). Score: 74→77 (+3).
- **DIRECTIVE-007**: Social Showcase & Leaderboards — DONE (v8.27, 2026-04-14). Score: 77→80 (+3).
- **DIRECTIVE-008**: Interactive Lore Engine — DONE (v8.28, 2026-04-14). Score: 80→86 (+6).
- **DIRECTIVE-009**: Provenance Deepening — DONE (v8.29, 2026-04-14). Score: 86→90 (+4).
- **DIRECTIVE-010**: Card DNA — Procedural Visual Identity — DONE (v8.30, 2026-04-14). Score: 90→91 (+1).
- **DIRECTIVE-011**: Live Pulse Feed + Collector Reactions — DONE (v8.31, 2026-04-14). Score: 91→93 (+2).
- **DIRECTIVE-012**: Seasonal Vault + Countdown Forge — DONE (v8.32, 2026-04-14). Score: 93→95 (+2).
- **DIRECTIVE-013**: Ghost Cards + Hidden Pull Mechanics — DONE (v8.33, 2026-04-14). Score: 95→97 (+2).
