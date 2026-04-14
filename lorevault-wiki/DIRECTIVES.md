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
- **Status**: IN_PROGRESS

### DIRECTIVE-005: Achievement badge system + collector profile
- **Priority**: P1
- **Source**: Strategy Loop S1 — Social Proof (4/10) + Utility Loop (6/10)
- **What to build**: (A) Badge manifest of 25-30 achievements across 5 categories: Collection (own X cards, complete set), Battle (win streaks, defeat legendary), Discovery (open X packs, find legendary), Market (buy/sell milestones), Dedication (login days, daily missions). Static JSON definition with conditions. (B) Badge evaluator that checks conditions against localStorage state on pack open, battle complete, and app launch. (C) Collector Profile page: name, "Collecting since" date, total cards, sets completed, battle record, pinned badge strip (3 badges). Badge grid with earned (full color + date) and unearned (grey silhouette + progress hint). (D) Badge unlock celebration modal with particle animation.
- **Why**: Badges create purpose beyond acquisition. The implied hierarchy ("Master Collector" presupposes a collector population) generates social proof even in single-player. Unearned grey badges drive completion behavior via Zeigarnik effect. Projects Social Proof 4→6, Utility Loop 6→7.
- **Acceptance criteria**: 25+ badges defined across 5 categories. Badge evaluator fires on relevant actions. Profile page shows badge grid with earned/unearned states. New badge triggers celebration modal. Pinned badge strip (3 chosen badges) visible on profile header.
- **Status**: PENDING

### DIRECTIVE-006: Population counters + serial number enhancement
- **Priority**: P1
- **Source**: Strategy Loop S1 — Social Proof (4/10) + Scarcity Legibility (8/10)
- **What to build**: (A) Deterministic population generator: `totalMinted` per card derived from rarity tier (Legendary 15-49, Epic 100-499, Rare 500-1999, Common 2000-9999) via seeded hash of card ID. `currentOwners` as percentage of `totalMinted` with daily noise. (B) Population counter on card detail page: "47 minted · 38 collectors own this." For legendaries <50 minted, dot visualization. (C) Enhanced serial badge on card tile: #1 = "Genesis" holographic, #2-10 = "Low Serial" gold, #11-100 = silver. (D) Rarity labels enhanced: "Legendary · 47 Exist" everywhere rarity appears.
- **Why**: Population counters anchor scarcity with concrete numbers. "1 of 47" is psychologically processed through real scarcity circuits regardless of simulation. Trivial effort, broad surface area. Projects Social Proof +1, Scarcity Legibility 8→9.
- **Acceptance criteria**: Every card has a deterministic `totalMinted` and `currentOwners` count. Card detail page shows population counter. Card tiles show serial number badge with tier-appropriate styling. Rarity labels include population count. All computed from card ID seed — no new localStorage.
- **Status**: PENDING

---

## Completed Directives

- **DIRECTIVE-001**: Complete sealed/reveal UX — DONE (v8.21, 2026-04-14). Score: 33→43 (+10).
- **DIRECTIVE-002**: Build Norse Mythology set (Asgard Unleashed) — DONE (v8.22, 2026-04-14). Score: 43→46 (+3).
- **DIRECTIVE-003**: Add card aging visual effects — DONE (v8.23, 2026-04-14). Score: 46→60 (+14).
