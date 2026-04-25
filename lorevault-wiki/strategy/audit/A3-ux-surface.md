# A3 — UX-Surface Audit: LoreVault v1 (lorevault-site.vercel.app)

**Auditor:** A3 — UX-Surface Auditor (Playwright direct capture)
**Date:** 2026-04-24
**Viewports:** 375×812 (mobile) and 1440×900 (desktop)
**Screenshots:** `/tmp/lorevault/lorevault-wiki/strategy/audit/screenshots-A3/`

Every claim below ties to a live Playwright capture.

---

## 1. First-visit journey — does it tell a lore story?

The root URL does not load a home page. `/` immediately redirects to `/welcome`, a three-step funnel: splash → world picker → starter-pack grant. Only then does the bottom nav appear.

- **Mobile splash — `01-welcome-mobile.png`:** Cartoon scroll emoji, headline "Every legend begins with a single card," three name-drop sentences (Sherlock Holmes, Dracula, Zeus). No image, no world, no voice — indistinguishable from any CCG template.
- **World picker — `02-welcome-step2-mobile.png`:** Three emoji-fronted buttons (🔍 / 👑 / 🐇) with 2–3 descriptive lines each. The set descriptions are the only lore artifact in the entire funnel.
- **Starter-pack grant — `03-welcome-step3-mobile.png`:** Gift-box emoji and three stat tiles: **3 Free Packs / 15 Cards Total / 1+ Rare Guaranteed.** The first substantive message the product delivers is economic: pull probability, not world.
- **Desktop welcome — `13-welcome-desktop.png`:** Mobile mock centered on 1440. No hero, no world art, no use of the canvas.

**Verdict Q1:** The home tells a first-time visitor exactly one thing — "this is a pack-opening game with three IP buckets and a login reward." Lore as a promise is absent. No quote, no scene, no character voice, no Lampblack lens, no parallel. This is a Top Shot clone with public-domain authors swapped for athletes.

---

## 2. Navigation — what's discoverable in 0/1/2 clicks?

IA (captured on every screenshot): bottom nav **Home / Market / Open / Collection / Games**; top bar LoreVault wordmark, Search, book/guide, profile; persistent **Live ticker** pill above the nav.

- **0 clicks** (post-welcome home, `05-home-mobile.png`, `19-home-desktop-full.png`): 13+ modules stacked — daily login reward strip, daily challenge, weekly event, weekly chain, collector pass tier bar, 3 weekly challenges, Season 2 teaser, featured market cards, your sets, discover feed, live stats row, season progress, monthly leaderboard, your collection. It is a dashboard, not a front door.
- **1 click:** Market, Open, Collection, Games, Guide, Profile — all mechanical.
- **2 clicks:** Card detail, set page, discover article, filter views, game mode.
- **NOT reachable from the UI:** `/prototype/exemplars` (the system's best work) and `/moodboard` (magic-link only). The best surfaces are off-IA.

**Verdict Q2:** IA is a gambling-game dashboard optimized for re-engagement (streaks, claims, leaderboard). A visitor asking "what is this world?" has no path — there is no About, no Worlds index, no lore entry.

---

## 3. Card surfaces — lore or NFT metadata?

Card audited: `/card/card-1` Sherlock Holmes, Common, #4 of 9,667 minted. See `06-card-mobile.png`, `15-card-desktop.png`.

Stack order of modules on the page:
1. Art (AI render, Sherlock in a teal alley) 2. Name + "COMMON · 9,667" 3. Set chip 4. Cryptic "DNA" chips (Hex Grid, Ember, Lightning — never explained) 5. **9,667 MINTED / 7,443 COLLECTORS** 6. Six-tile financial dashboard: **$0.94 FLOOR / $1.82 7D AVG / 169 7D VOLUME / 8 LISTED** + 24H/7D/30D deltas 7. 30/90D price chart with red trend 8. **List for Sale / Offer Trade** CTAs 9. **Burn for XP** destructive CTA 10. **BATTLE STATS — Power 45 / Intelligence 59 / Mystery 85 / Legend 95 / Charm 60** with "Take to Battle" 11. Second red chart: **Estimated Value History −69.6%** 12. **Legacy Score: Pristine 2** 13. "From the Source" — one italic quote 14. **Lore Threads** with three locked gray threads 15. Other Sherlock cards row.

The lore quote is the 13th module, rendered in smaller type than the price chart.

**Verdict Q3:** This is generic NFT metadata with a quote bolted to the bottom. No Lampblack layer, no parallel, no tether, no archetype. "Battle Stats · Charm 60" on Sherlock Holmes dismisses the entire lore premise. The "−69.6%" chart tells the collector their object has lost 70% of its value. This is a CoinMarketCap row with a picture of a detective.

---

## 4. Marketplace — collectibles or stock screener?

See `07-marketplace-mobile.png`, `07b-marketplace-mobile-viewport.png`, `14-marketplace-desktop.png`.

Above-the-fold elements: title + live recent-sale ticker ("Alice $0.80 COMMON 10m ago"), tabs **All / Need / Own / Comfy / Bulk**, typeahead search ("Sherlock Holmes Legendary Gold…"), four primary stat tiles **LISTINGS 124 / 7D VOLUME 41,267 / MARKET CAP $30.9K / AVG SALE $13.17**, a MOVERS strip (+10.3% / −11.6%), **YOUR PORTFOLIO $5.24 −0.2%** with a set breakdown, sub-tabs **Browse 240 / Movers / Watchlist / Floors**, then a 🔥 TRENDING NOW grid where each card is stamped with its 24h % delta in a red/green pill.

**Verdict Q4:** Not a collectibles surface. A stock screener with a novelty skin. The hierarchy is volumes, movers, deltas. Tabs labeled "Need / Own / Comfy / Bulk" are direct Top-Shot trader vernacular. Zero room for a lore-driven browse — no "Walk Baker Street," no "This Week in Wonderland," no curated narrative entry. This is the app a hedge-fund analyst would build if asked to ship Pokémon cards.

---

## 5. Prototypes — `/prototype/exemplars`

See `08-prototype-exemplars-mobile.png`, `08b-exemplar-card-detail.png`, `16-exemplars-desktop.png`.

Page headline: "**Five cards. Five Universes. Five lenses.**" Each card is a 2:3 portrait with depicted scenes — Watson and Holmes in 221B, a neon figure offering a poisoned apple, the Cheshire Cat as arcana, a Roman tribunal, a Marian icon. Every card has: a serif pullquote ("You have been in Afghanistan, I perceive."), a source attribution, a lens/elemental label (REASON, NEON, ARCANA, CENSUS, PATRON), a serial (#2,143/15,000), a sub-text cue ("The cane in the corner of the frame is not the one Watson carried home."). A "Collector View / Canon Council View" toggle reveals a 4-layer Lampblack stack with shell/elemental/tether/archetype.

**Contrast with v1:** Night and day. The v1 card has 14+ modules; the exemplar has a frame, a scene, a quote, a whisper. The exemplar art depicts moments; v1 art is a single figure on a generic gradient. The exemplar uses restrained gold + serif; v1 uses emoji + purple-pink gradients + bar charts. Exemplars look like an object. V1 looks like a dashboard row.

**Verdict Q5:** The prototype proves the team knows how to build the actual product. It has never been routed into the user experience.

---

## 6. Moodboard — `/moodboard?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl`

See `09-moodboard-mobile.png`, `17-moodboard-desktop.png`.

**State captured:** Card 1 of 87. Single ornate Prometheus portrait (illuminated-manuscript border, torch, flame, tiered figures beneath). Subhead "**The Ornate — sacred density ritual · greek-myth**," tagline "bearing the flame to humanity." Three circular buttons: ✕ (N) / 💬 (O) / ✓ (Y). Counter: **0 / 87 · 0%**. Keyboard hint line: "Y · N · O · ← ARROWS · undo."

**Verdict Q6:** A focused, single-job Tinder-style taste survey. Works as intended. Unreachable from the user IA — a research instrument, not a product surface. Desktop view wastes 80% of the canvas. Useful artifact: it reveals the art library contains far better material than anything shipped to `/card/:id`.

---

## 7. The seams — origins showing through

Concrete seams, each captured in a screenshot:

- **Home has 13+ modules** (`05`, `19`) — each reads like a shipped ticket.
- **Desktop = scaled-up mobile** (`13`, `15`, `18`, `19`) — no responsive grid. `/packs` desktop is 30% content / 70% empty gutter.
- **Emoji as iconography** (`02`, `04`, `05`) — worlds are 🔍🦇🐇👑⚡❄️; daily rewards step through ✨⭐💫🃏🔥🏆👑.
- **Two card design systems running at once** — `/card/:id` (`06`) and `/prototype/exemplars` (`08b`) share no visual DNA.
- **Three overlapping live feeds** — the "Live" pill, the home "Live · Active Now" stats row, the Discover feed. All show overlapping pulls and market moves.
- **Vestigial "DNA" chips** (`06`) — never introduced, never filterable.
- **"Legacy Score: Pristine 2"** on a 9,667-mint Common — made-up prestige meeting mass-mint reality.
- **Battle Stats on literary characters** (`06`) and a whole `/games` tab (`12`) — Public Domain Baseball (d20 with 99 legends), Card Battle, Lore Trivia. Three unrelated game metaphors.
- **Contradictory Season 1** — home says "Season 1 · Age of Myths" (`05`); packs shows "Season 1: Twilight of the Gods · 29d 23h 59m 59s" (`04`). Two storylines inside one shell.
- **Monetization leaks every surface** — Burn for XP, "Forge at seasonal discount," "+80 XP Legend Challenge."
- **Three voice registers in one session** — "Daily free pack!" (mobile game), "The Patron of Return, Glimpsed in Two Seasons" (editorial), "Smart money is accumulating" (CT trader pill). No brand voice.
- **Dead "?" placeholders** — Season 2 teaser shows five literal "?" pills.

**Verdict Q7:** Code shipped before editorial did. Features were built as a list, not a world.

---

## 8. The five most-jarring moments, rank-ordered

1. **Battle Stats on Sherlock Holmes** (`06-card-mobile.png`) — Power 45 / Intelligence 59 / Mystery 85 / Legend 95 / Charm 60. Single most concrete "we did not mean this" moment. Screenshot this to a literary fan and they close the tab.
2. **"Estimated Value History −69.6%"** on the same card (`06`). A massive red crash chart is the second-biggest element on a Common Sherlock. The product tells its own customer their cards have lost 70% of value.
3. **"Season 1: Twilight of the Gods · 29d 23h 59m 59s"** countdown + daily login strip (`04`, `05`). FOMO MMO cadence, not collector cadence. Counter ticks down by the second.
4. **Marketplace tabs Need / Own / Comfy / Bulk + YOUR PORTFOLIO $5.24 −0.2%** (`14`). Transactional Discord vernacular as primary IA. "Comfy" on a marketplace tab is a tell — it's trader slang, not brand voice.
5. **"Sherlock Holmes. Dracula. Zeus."** (`01`). First sentence a user ever reads is a roll-call of cliché public-domain IP. No atmosphere, no voice, no universe — the one moment to seduce a visitor, spent on a Fiverr pitch deck.

---

## 9. The two surprising strengths

1. **`/prototype/exemplars` is the product** (`08`, `08b`, `16`). Five cards, five lenses (Reason, Neon, Arcana, Census, Patron), depicted scenes, serif pullquotes, elemental chips, 4-layer Canon Council toggle. Restrained, editorial, distinctive. The underlying system works — it just isn't wired into the user-reachable routes. Rename this `/card/:id` and the rebirth inherits aesthetic DNA wholesale.
2. **The moodboard taste survey** (`09`, `17`). 87-card Tinder-style aesthetic capture with Y/N/O + arrow undo. Cleanest single-purpose surface in the property. The Prometheus illuminated-manuscript frame it surfaces also reveals the raw art library is far stronger than anything shipped to v1 — a better starting inventory than the product implies.

Honorable mention: the **world descriptions on the picker** (`02`) — "fog-shrouded London, criminal masterminds, and the sharpest mind in fiction" — carry more lore than the entire v1 card page. There is a writer on this team. The product has buried them.

---

## Rebirth recommendations

- **Discard:** home dashboard, Battle Stats, portfolio bar, Need/Own/Comfy/Bulk taxonomy, Movers/Floors/Market Cap framing, Burn for XP, Legacy Score, contradictory Season 1, "?" placeholders, emoji world iconography, three-modes `/games` tab.
- **Evolve:** set/world descriptions (voice exists — expand), `/moodboard` mechanic (continuous preference capture), live ticker (keep, re-scope to narrative events not market events).
- **Preserve and promote:** the `/prototype/exemplars` card design system. This is the actual product. Elevate it from prototype route to canonical `/card/:id`. The 4-layer Lampblack/shell/elemental/tether/archetype stack is the differentiator v1 is actively obscuring.

The v1 product is a Top Shot clone with a lore coat of paint. The prototype hiding inside it is a better, different product. The rebirth's job is to make the prototype the product, and the v1 shell a memory.

---

**Screenshot manifest — all at `/tmp/lorevault/lorevault-wiki/strategy/audit/screenshots-A3/`:**

Mobile (375×812): `01-welcome-mobile.png`, `02-welcome-step2-mobile.png`, `03-welcome-step3-mobile.png`, `04-packs-mobile.png`, `05-home-mobile.png`, `06-card-mobile.png`, `07-marketplace-mobile.png`, `07b-marketplace-mobile-viewport.png`, `08-prototype-exemplars-mobile.png`, `08b-exemplar-card-detail.png`, `09-moodboard-mobile.png`, `10-guide-mobile.png`, `11-collection-mobile.png`, `12-games-mobile.png`.

Desktop (1440×900): `13-welcome-desktop.png`, `14-marketplace-desktop.png`, `15-card-desktop.png`, `16-exemplars-desktop.png`, `17-moodboard-desktop.png`, `18-packs-desktop.png`, `19-home-desktop-full.png`.
