# LoreVault Game Loop & Progression Spec v1

**Date:** 2026-04-25
**Status:** Decisions, not options. Production-binding.
**Companion to:** Synthesis Part 3 (§5 Production Doctrine Hooks), Dossier 21 (Cross-Universe Patterns), R2-engagement-loops (existing), R3-onboarding-journey (existing), NORTH-STAR (yardsticks 1-7), GAME-ECONOMY-DESIGN-V1 (pack tiers), G1-gap-synthesis (banned-chrome list).

This spec resolves V2 Rewrites 1-5 (mobile-first, Lattice-painting, Day-1 stepped target, Footnoter bottleneck, Y7 measurement) into shippable production doctrine. Every decision below is binding for the May 3, 2026 Series 1 launch and the 12-month Series 1 arc that closes February 2027.

---

# 1. The 90-Second Onboarding Journey (refined)

**Inheritance:** R3 90-second test + V2 Rewrite 3 (stepped Day-1 conversion 15% → 25% → 35% over Series 1 quarters).

**End-state:** 90 seconds after first tap, the user has (a) felt the Lampblack idea before hearing the word, (b) opened a rigged Sample-pack and pulled a Rare+ guaranteed Moment, (c) seen the Lattice geometry rendered as canonical art, and (d) hit a Journal subscription CTA that converts at the stepped target. No Universe-encyclopedia, no taxonomy lecture, no FAQ. The product *demonstrates* itself.

## 1.1 Second-by-second specification

**0–3s: Black screen. One pull-line, served as text-on-canvas (no UI chrome):**

> ONE OF FIVE PANES. SOMEWHERE ELSE, HE IS SAYING IT AGAIN.

The line types in at ~22 chars/sec — feels handwritten, not loaded. Kerning is tight. Font is the Series-1 manuscript serif (Newgrange, our commissioned face). No logo. No "Welcome." No "Tap to begin."

**3–6s: First image fade-in.** A single painted figure — Watson — silhouetted against the doorway of 221B, holding a journal. Painted in the Strand-1893 register (Sidney Paget mid-tone). The pull-line dissolves; "He" is now visibly Watson.

**6–9s: Pane-shift.** Without warning, the same compositional silhouette dissolves to a *different* figure in the same frame-position: Persephone holding a pomegranate at a doorway-arch in dim umber. The user's eye doesn't move; the image swaps under it. This is the Lampblack principle made visual *before it has a name*.

**9–12s: Third Pane-shift.** Cheshire Cat at the threshold of a hedgerow archway, grinning, partly dissolved. Same composition. Same doorway. Three figures, three Panes, one shape.

**Music cue 0–12s:** Single sustained low cello note (Bb, 55Hz) under a barely-audible field recording of distant rain. No melody. The cello holds; the figures change. The audio doesn't acknowledge the cuts — that mismatch is the Lampblack feeling. Particle system: faint dust-mote drift over each frame, same drift-vector across all three Panes (so the *air* is shared even if the figures aren't).

**12–30s: 4-figure rotation introduces the cross-Pane judge.**
Three figures plus the cross-Pane meta-figure recommended by Synthesis Part 3 §5: **Anubis** (chosen over Auguste Dupin because Anubis is instantly visually legible across cultures — jackal-headed silhouette reads in 0.4 seconds; Dupin requires literary recognition). Anubis appears as the *fourth* doorway-figure: same compositional silhouette, jackal-head, scales of judgment held low.

The narrator (single line, voiced by the Voice Lead — see §4 below):

> "Four figures. Four Panes. One door. You will not learn their names yet. You will recognize one of them. That is the door."

User taps any of the four figures. The chosen figure becomes the *Pane of entry* — Series 1 onboarding personalizes from this tap (NOT from a quiz, NOT from a "what kind of collector are you" funnel — from a single recognition).

**30–60s: First Sample-pack reveal — RIGGED.**

Per the April-12 handover learning ("the best thing you've built"), the first Sample-pack is *not* odds-honest. Every first-time user pulls a guaranteed Rare+ Moment from the Pane they tapped. The pack ritual:

- 30s: pack appears center-screen, painted-paper aesthetic, wax-seal glyph of the chosen Pane (deerstalker / pomegranate / chess-piece / wedjat / Anubis-scales depending on tap)
- 32s: user taps; wax seal cracks audibly (single sharp wet-snap)
- 34s: pack opens; one Common (low-glow), one Common (low-glow), one **Rare** (Lampblack-settle 8-second sequence — soft mid-glow, ink-residue particle drift, slow pan across card face, narrator's single-word murmur "*there*")
- 50s: card lands face-up in a *binder slot* (gallery-hung — see §10) — the binder page already exists, with 11 empty slots around the new card. The empty slots glow softly; the user *sees* the shape of the Set without being told to fill it.

**60–90s: Lattice-map reveal + Journal CTA.**

At 60s, the camera pulls back from the binder. The binder is one slot in a larger structure: the **Lattice-painting** (see §2). The painting renders in three passes — first the geometry (a single 2:3 oil-painted illustration of five interlocking Pane-doorways arranged in a pentagram-with-no-center), then the four figures the user has just seen anchored at four nodes, then a fifth empty node *waiting*.

The narrator returns:

> "Five Panes. Five doors. The fifth one is for you to find. We send a journal — one chapter a day from somewhere across the Lattice. You'll know when you've found the fifth door."

A single CTA button: **"Send me the Journal."** Email field below. Subscribe button. Single line of micro-copy beneath: *"This is how Lampblack moves between the Panes."* The word **Lampblack** has now been earned — at 87 seconds, *after* the user has seen residue-drift in three different Panes. **The word is never used before this moment.**

Inline expansion ("Why these three?") appears as a small ✦ icon next to the binder; if tapped, opens a 4-line poem:

> *Watson writes what others see.*
> *Persephone returns what others lose.*
> *Cheshire vanishes what others insist is solid.*
> *Anubis weighs what others have done.*
> *Lampblack is what they leave on each other's pages.*

That is the entire pedagogy.

## 1.2 Stepped Day-1 conversion targets (V2 Rewrite 3)

| Series-1 quarter | Day-1 Journal subscribe rate | Pull-line tested |
|---|---|---|
| Q1 May–Jul 2026 | ≥15% | "ONE OF FIVE PANES. SOMEWHERE ELSE, HE IS SAYING IT AGAIN." |
| Q2 Aug–Oct 2026 | ≥25% | A/B-tested variant from Q1 winners |
| Q3 Nov 2026–Jan 2027 | ≥35% | A/B-tested variant from Q2 winners |
| Q4 Feb 2027 | ≥35% (sustained) | Series 1 close — locked variant |

If Q1 < 15%, ship the Q2 variant early. If Q1 ≥ 25%, *do not* relax the test — measure Y7 (§13) instead.

---

# 2. The Lattice-Map Surface (mobile-first per V2 Rewrite 2)

**V2 audit said it cleanly:** *"A vertical column of five named cards is not a Lattice; it's a list."* That is the failure mode. The Lattice must *look* like a Lattice — geometry, not a sidebar.

## 2.1 Decision: the Lattice is a painting (V2 Rewrite 2 Option C)

A single 2:3 oil-painted illustration of the Lattice geometry, commissioned as canonical art (NOT a UI widget). Five doorway-arches arranged in an interlocking pentagram with no central node — the geometry implies a sixth space at the center that does not exist (the Underworld-river per Synthesis Part 3 §1.3). User taps a doorway to enter a Pane.

**The Lattice-painting itself is a Series-1 cross-Pane Moment.** It ships as the **home-page hero** on the LoreVault landing surface (lorevault.com / app home / Journal email header). It is also the artwork on the user's "binder cover" in the gallery view. It is *not* in any single Universe's set — it lives in the **interstitial Series-1 metaset**, named **"The Lattice Itself"** (a 4-card metaset: Lattice-painting, Lampblack-Index card, Convergence-Lock card, and the Onboarding-Anubis card).

## 2.2 FLUX commission template

```
PROMPT: Painted illustration in oil-on-board register, late 19th-century
academic-realist palette (Bouguereau / Alma-Tadema mid-tones, NOT Pre-
Raphaelite). Five interlocking stone doorway-arches arranged in pentagram
geometry, each arch containing a different threshold-environment: gas-lit
London street (Pane 1), umber pomegranate-orchard at dusk (Pane 2),
hedge-maze at impossible perspective (Pane 3), Carpathian peaks at storm
(Pane 4), Egyptian columned hall in jackal-shadow (Pane 5). Center of
pentagram is empty dark space — a sixth Pane implied but unseen. Soft
ink-soot residue drifting between arches, same drift-vector across all five.
No figures. No text. No central focal point — eye must move between
arches. 2:3 vertical aspect, mobile-portrait readable.

NEGATIVE: digital-painting render, Disney-style, MCU-style, Marvel-1602
register, video-game UI, fantasy-illustration mass-market, Frazetta,
Vallejo, Larry Elmore, generic-pulp-paperback. No center figure. No
visible logo or text. No CGI gloss.
```

Commission goes to one of the three Series-1 commissioned Voice-Lead-approved illustrators (Penny-Dreadful-tier portfolio gates per V2 Rewrite 5). Final art is reviewed by the Council before mint.

## 2.3 Mobile-first interaction spec

- 375px viewport renders the painting at full screen-width, 2:3 aspect (so it dominates the fold).
- Tap any of the 5 arches → 250ms zoom-into that Pane (camera pushes through the doorway), then transitions to the Pane home-page.
- Long-press any arch → reveals the Pane's name in a thin ribbon at the bottom edge (no hover state — mobile has no hover).
- Pinch-zoom is disabled on the Lattice (it's a painting, not a map; zooming reveals nothing; zoom-prevention preserves the integrity of the metaphor).
- The drift-residue between arches is animated at 0.5fps (almost imperceptible — feels like a still painting that is slightly alive).
- On desktop (superset), the painting renders centered at 480px wide with the same 2:3 aspect. Desktop is never the primary design surface.

---

# 3. Daily Loop (per R2 §1 inheritance)

Three-beat daily structure. Each beat is independently rewarding; doing all three earns the Sample-pack ticket. Missing all three for a day = no penalty (no streak chrome).

## 3.1 Beat A — Jonathan's Journal (Dracula-Daily playbook, May 3 2026 launch)

**The mechanism:** Daily email + push (user picks one or both at signup). Each day surfaces a single Journal entry — Watson on Mondays, Mina on Tuesdays, Carroll on Wednesdays, Persephone on Thursdays, Anubis on Fridays, the Footnoter on Saturdays, the Lampblacker on Sundays. Each entry is 200–600 words of prose-in-character. Entries are dated to mirror the source canon (Dracula Daily anchored Stoker's epistolary calendar — May 3 to November 6; LoreVault inherits this for Pane 4 Mondays; other Panes follow their own canonical calendars).

**Voice-Lead capacity:** ~100 words/day × 5 voices × 365 days = ~180K words/year. This is the V2 Rewrite 4 bottleneck. Resolved in §4 by 4-seat Council split (Voice Lead 4 universes uses AI-draft + human-edit; Footnoter Topsy-only hand-writes every word).

**Format:** Plain text email, no images, no chrome, no "Click here." A single hairline at the top reads: *Day [N] of the Lattice — [date].* That is the only meta-text. The body is the Journal entry. At the bottom: a single small painted illustration (1/8th page) of the day's pull-line image, and a tiny link: *open the Lattice →*. No "Subscribe to Premium" CTA in the daily email, ever.

**Push notification version:** 280-character excerpt, one line, no emoji. Example:

> "Mina's letter today: 'I have the strangest fancy that I will see Lucy in the morning, despite the Captain's letters from Whitby.' — Day 184 of the Lattice"

## 3.2 Beat B — Today on the Lattice (one Pane "active" today)

**The mechanism:** The home-page Lattice-painting has one of its five arches gently glowing on any given day (rotating: Mon=BS, Tue=Gothic, Wed=Wonderland, Thu=Greek, Fri=EK, Sat=cross-Pane day, Sun=rest). The active Pane shows a *single* card-of-the-day in its arch — a real Moment from that Pane's published Set, displayed full-art. Users can open that card, read its flavor text, see its Lampblack-tethers (cards in the user's binder that touch this card via Lampblack residue).

**No "claim today's card."** The card-of-the-day is *displayed*, not given. If the user owns it, the binder reflects ownership. If not, they can wishlist it (and at the next Sample-pack open, wishlist Moments are softly weighted — never displayed).

**Cross-Pane day (Saturday):** the active arch is the Lattice itself (the central empty node). Saturday's card is one of the Series-1 cross-Pane Moments (per Synthesis Part 3 §1.1 / §2 — the 1–2 Echoes max for Series 1). This is how Series 1 surfaces cross-Pane content without forcing it.

## 3.3 Beat C — Earned Sample-pack ticket (reading-pact, NOT streak)

**The critical distinction:** Traditional daily-streak chrome (the red-pulsing daily-login strip; the calendar-grid with 7-day flame; the "DON'T BREAK YOUR STREAK 🔥" push) is gambler-collector chrome. **Banned outright (§12).**

Replaced by: **reading-pact ticket.** Any *one* of the following actions earns a Sample-pack ticket for the day:

- Open the Journal email AND scroll to the bottom (reading verification: scroll-depth + 30-second time-on-mail)
- Tap the Lattice arch of the day's active Pane AND open the card-of-the-day (read verification: 15-second time-on-card)
- Visit any Pane-home page and read at least 200 words of any wiki article (reading verification: 30-second time + scroll-depth)

Tickets accumulate up to **5 max** in a wallet. They do not expire, but they cap. This kills the "I missed yesterday so I broke my streak so I'll quit" failure mode — the user can do nothing for 4 days, then on day 5 do all three actions and they're back at the cap.

**Sample-pack opens** (§7 below) consume one ticket. A Sample-pack contains 1 Common from a randomly-selected Pane (with subtle reading-pact pull-weighting — see §11). No Sample-pack contains a Rare unless it's the user's *first* pack (the rigged onboarding pack per §1.1).

The reading-pact ticket is a *reader's reward*, not a *gambler's daily-quota*. It says: *we noticed you read; here's a small free thing.* It does not say: *you'll lose your progress if you don't come back tomorrow.*

---

# 4. Weekly Loop (Sunday Lampblack Tally + Mirror Wednesday)

## 4.1 Sunday Lampblack Tally

**Format:** Long-form newsletter (1500–2500 words), Sunday 8am ET, opt-in default for all subscribers. Includes:

- **3 Echo-tier reveals** from the past week's drops — Moments that contain a hidden cross-Pane reference revealed only here (the *Echo* of Iceberg's 1:2:4 ratio, surfaced)
- **Cross-tether residue map** — a small painted illustration showing which Panes had the most Lampblack-bleed this week (e.g., "The fog from Baker Street thickened in the Forest this week"). Lives at the top of the newsletter as a visual anchor.
- **Binder summary** — how many Moments the user collected this week, which Set they're closest to completing, what cross-Universe Lampblack-tethers exist between their cards. Qualitative copy, never P&L. Example: *"You added three Holmes to your binder this week. The Cottingley pull on Thursday means your Watson and your Cottingley fairy now share an Echo — the only such pair in this week's Tally."*
- **Council preview** — single paragraph from one Council seat (rotating) on what's shipping next week.

**Author:** Voice Lead (with AI-draft for binder-summary boilerplate per V2 Rewrite 4; Voice Lead hand-finishes the Echo-reveals and Cross-tether map).

## 4.2 Mirror Wednesday — Topsy-mode publication

**Format:** Single-page publication, Wednesday 8am ET, ~1500 words/week. Two pieces:

- **The Footnoter editorial** (~1000 words) — in EK voice, the Footnoter (Lampblacker-Spine of Baker Street, per Synthesis Part 3 §3) writes a Pratchett-grade footnoted essay about something that happened in the Lattice this week. Hand-written. Every word. The Footnoter is Council seat 2b.
- **Topsy character commentary** (~500 words) — Topsy is the meta-narrator for cross-Pane events. This is where Mirror Wednesday earns its name: Topsy reflects events back at the reader, often pointing out things they might have missed.

**Voice Lead bottleneck resolution (V2 Rewrite 4 — DECISION):**

The 4-seat Council:
- **Seat 1: Lattice Architect** — geometry/cosmology decisions (Decision 7 Iceberg ratio enforcement)
- **Seat 2a: Voice Lead — 4 Universes** (BS, EK, Wonderland, Greek for Series 1 + Gothic, Norse, Egyptian, American Gothic adding for Series 2). Allowed AI-draft + human-edit for Journal entries. ~150 words/day human-touched output, AI does the structural draft.
- **Seat 2b: Footnoter — Topsy-only** (1 voice). Hand-writes every word. ~1500 words/week. This is the Pratchett-grade voice the V2 audit said *"is the single best prose in the wiki."* It does not get AI-drafted. Ever.
- **Seat 3: Compliance + Cultural Reviewer** — single seat (Laura Abreu universal across products per memory) handling all ODIN-flagged escalations (per Synthesis Part 3 §4)
- **Seat 4: Iceberg Auditor** — the Council seat enforces 1:2:4 Surface:Echo:Deep ratio at card-level (see §6 — V2 Rewrite 4 outstanding requirement). 12 Echo + 24 Deep per Series. Also enforces 7% crossover ceiling per Set (§14).

This is 4 seats, not 3. The seat-2 split is the V2 Rewrite 4 fix. The Topsy-cap-at-10% alternative is rejected (it would reduce Topsy from 60 sets to 6, which is too few to establish the voice).

## 4.3 Reading Pact (deep dive in §11)

Reading Pact opt-in surfaces in the Sunday Tally as a single inline CTA: *"Take a pact this week."* Three options (chapter / story / dossier — see §11). User picks one or none. Pact reward: subtle pull-weighting toward the Pane the pact is in. Never displayed quantitatively. Never penalized for failure.

---

# 5. Monthly Loop (Set Drop + Council Q&A)

## 5.1 Set Drop cadence

**Sustained:** 1 Set per month (Yardstick 5 floor — *"a Set ships every month or the Lattice is dying"*). 12 Sets per Series 1 year (May 2026 → April 2027).

**Drop time:** First Saturday of each month, 1pm ET. (Top Shot drop-time inheritance — fans know this as collector-time.)

**Pre-roll (T-24h):** Friday afternoon, narrator commentary appears on the Pane's home page — a 2-minute audio file (or transcribed text) where the Lampblacker-Spine of that Pane introduces the Set. Per Synthesis Part 3 §5: *"narrator-voiced; ledger-keeper-confirmation moments per Synthesis Part 3 §5."* Example: the Whitby Ledger-Keeper introduces the Gothic Set 2 with a single pre-roll statement: *"This Set has the rope. The rope from the Demeter. I have it in the archive. You will see it Saturday."*

**Drop-day (Saturday 1pm ET):** 60-minute live event. Hosted on the LoreVault Pane-home-page. Narrator voice (Voice Lead 2a or Footnoter 2b depending on Pane). Council seat 1 (Lattice Architect) appears mid-stream for ~2 minutes to confirm a Lampblack-tether moment ("Yes, that smudge on card #7 is the same residue we saw on card #14 of Series 1 Set 2 — that is a deliberate Echo across 3 months of release"). Per V2 §7 audience-thrilled finding: these Council-confirmation moments are the **single highest screenshot-emission moment** on the platform.

**Wake page persists post-close:** When the live event ends (2pm ET Saturday), the Pane home-page transitions to a "Wake" state — the new Set is up, the live-stream replay is embedded, and the comments thread that ran during the live remains as the *first archive of the Set*. Wake page persists for the full month until the next Set drops.

## 5.2 Council Q&A — monthly office-hours forum

**Format:** Last Wednesday of each month, 1pm ET. 60-minute moderated forum where one Council seat (rotating: Architect / Voice / Footnoter / Compliance / Auditor across 5 months) takes questions from the community. Held on Discord with simultaneous text + voice.

**Output:** A monthly Q&A digest is published the following Sunday in the Lampblack Tally newsletter. The digest is a permanent archive — the LoreVault wiki gets a *"Council Decisions"* page that grows month-by-month.

**Why this matters:** The Council is the load-bearing trust mechanism. Per Decision 40 ("No retcons. Ever."), the Council's monthly Q&A is the public record of *why* decisions get made. Collectors who buy Series 1 Set 1 in May 2026 can read the Council's reasoning in November 2026 about why a Series 2 decision was made — this is the *anti-DC-reboot* discipline, made public.

---

# 6. Seasonal Loop (Series progression)

## 6.1 Series 1 spans 12 months (May 2026 → April 2027)

Single Series, 12 monthly Set drops, 5 Universes (BS / EK / Wonderland / Gothic / Greek). Each Universe gets either 2 or 3 Sets in Series 1 (10–15 Sets across 5 Universes; we ship 12 — 3 BS + 3 Gothic + 2 EK + 2 Wonderland + 2 Greek).

## 6.2 Quarterly milestones

| Date | Milestone | Format |
|---|---|---|
| **May 2 2026 (Saturday)** | **Series 1 Launch** | First Set drops; 90-second onboarding live; Lattice-painting hero on home-page; 90-day Council sprint; Founder's-Edition Premium pack ($199) opens for first 1,000 buyers (Apex pack $999 caps at 100) |
| **August 2026** | **Mid-Series Council Audit** | First quarterly 1:2:4 Iceberg ratio audit. Council seat 4 (Auditor) publishes ratio compliance per Set. If any Set is over-density (>7% crossover, or >12 Echo or >24 Deep cumulative), the next Set rebalances. Public audit doc on wiki. |
| **November 2026** | **Iceberg-Doctrine Quarterly** | Second quarterly audit; addition: published *Lampblack Tether Map* updating the Series-1 cross-Universe residue catalog (per Synthesis Part 3 §1). Becomes a one-page wiki artifact. Q3 Day-1 stepped target check (≥35%). |
| **February 2027** | **Series Close** | Final Set drops; Series 1 binder closes; "Series Patron" badges issued to users completing ≥3 of 5 Universes; Series 2 teaser appears on the Lattice center-node (the 6th node — previously empty — gains a faint silhouette for the first time). |

## 6.3 Council Audit enforcement (Decision 7 — V2 Rewrite 4 outstanding)

The 1:2:4 ratio at *card-level* per Series:
- **Surface (1):** 1 explained Surface card per Set × 12 Sets = 12 Surface cards/Series
- **Echo (2):** 2 unexplained Echoes per Set × 12 Sets = 24 Echoes/Series. Reduced to **12 Echoes/Series** for Series 1 (V2 Rewrite 4 cap — Series 1 is establishment, not crossover-density yet)
- **Deep (4):** 4 gestured-at Deeps per Set × 12 Sets = 48 Deeps/Series. Reduced to **24 Deeps/Series** for Series 1 (same Rewrite 4 logic)

**Series 1 cross-Pane reduction (per Decision 30 in Synthesis Part 3):** Series 1 ships 1–2 cross-Universe Echoes total, no Surface, no Convergence. Most Sets ship intra-Pane only. The Iceberg ratio applies *within* a Pane (e.g., a Set's 12 Echo can all be intra-Universe Lampblack tethers between cards in the same Pane).

Series 2 returns to full 1:2:4 with cross-Pane Surfaces unlocked. Series 3 unlocks the first Convergence-Cathedral.

---

# 7. Pack-Open Ritual (full spec)

Inherits from Phase 4 §9 (Lampblack-settle 8s for Rare; Ultimate 12s; Convergence 30s). Extends per pack-tier per GAME-ECONOMY-DESIGN-V1 ($0/$9/$49/$199/$999):

## 7.1 Per-tier spec

**Sample ($0) — 4-second open:**
- 1 Common
- Wax-seal crack (0.5s)
- Card slides face-up into binder slot (1s)
- Card-Lampblack-glow + flavor-text fade-in (2.5s)
- No narrator voice-over
- Reading-pact ticket consumed

**Standard ($9) — 8-second open:**
- 3 Moments (typical: 2 Common + 1 Rare; rare: 3 Commons; very rare: 2 Common + 1 Legendary at <2% of Standards)
- Wax-seal crack (1s)
- Three cards reveal sequentially with brief Lampblack-residue trails between each (2s each)
- Final Rare (or upgrade) gets the 8-second Lampblack-settle: full Pane-environment ambience drops in, residue particle drift across the full screen, narrator murmur of one word ("*there*" / "*so*" / "*again*") at 4s, then card glow lift at 6s, fade at 8s.
- No live-stream eligible

**Curated ($49) — 12-second open w/ ≥1 Rare guarantee:**
- 5 Moments (typical: 3 Common + 2 Rare; ≥1 Rare guaranteed by tier-floor; Legendary upgrade at ~10%)
- 12-second Lampblack-settle on the highest-rarity card pulled
- Curator commentary unlocked: when the Curated pack is opened, the Pane's Lampblacker-Spine (Footnote / Cartographer / Glass-Polisher / Whitby Ledger-Keeper / Oracle's Translator) appears as a 2-line text overlay above the highest-rarity card. This is the *only* pack-tier where the Spine speaks. Example: *"The Cottingley plate — I copied this from Doyle's letter, before the Estate's lawyers came. — The Footnote, December 1923."*
- Live-stream eligible (collector can record + share)

**Premium ($199) — 18-second open w/ ≥1 Legendary guarantee:**
- 6 Moments (typical: 3 Common + 2 Rare + 1 Legendary; Ultimate upgrade at ~5%; Parallel guaranteed at ~30%)
- 18-second Lampblack-settle on Legendary
- Council seat 1 (Lattice Architect) appears as text-overlay confirmation moment on the Legendary: *"This is the [name] from [Set]. It carries the Lampblack of [tether]. It is the first of 100 minted at this rarity."* — surfaces tether-data the user can verify on the wiki.
- Pre-loaded share-pack: at 18s, a "Share this pull" CTA appears with auto-generated screenshot (square-aspect, watermark: LoreVault.com / pull-line). Designed for Y7 social emission (§13).

**Apex ($999) — 30-second narrator-voiced live-stream-able open w/ ≥1 Legendary + 1 guaranteed Parallel + 10% Ultimate shot:**
- 7 Moments (3 Common + 2 Rare + 1 Legendary minimum; 1 guaranteed Parallel of any rarity; 10% chance one of the 7 is Ultimate; 1% chance of Mythic/ONE-OFF chase per §9)
- **30-second narrator-voiced sequence** — the Pane's Lampblacker-Spine narrates each card's Lampblack-residue connection. Voice Lead (or Footnoter for Topsy-anchored Apex packs) records a custom narration *per Apex pack tier* per Pane.
- **Live-event integration:** Apex packs are streamable. When opened during a Live event (Saturday drop-day or pre-scheduled), Council member confirmation moments mid-stream — Council seat 1 or seat 4 voices a confirmation of *why* a particular pull is significant. Per V2 §7 audience-thrilled finding: *"Yes, that smudge on card #7 is what you think it is."* This is the **single highest social-emission Y7 trigger.**
- Apex packs cap at **100 per Series** (1,000 buyers competed to be in the first 100 — V2 Rewrite 5 acceptance criterion: scarcity is enforced, not promised).

## 7.2 Universal pack-open principles

- **No "5-4-3-2-1" countdown.** Banned (§12). Replaced by silent build (the Lampblack-settle does the building).
- **No "rarity reveal" sound-bumper.** Sound design is *quieter* the rarer the card — the rarest cards have the *least* sound. Lampblack is silence, not fanfare.
- **No "value estimate" overlay.** Banned (§12). Cards do not have prices on them.
- **Mobile-first 375px:** every pack-open ritual renders at full screen-width on portrait mobile. Desktop scales but never increases card size beyond 480px wide.
- **Haptic feedback:** wax-seal crack triggers a single iOS/Android haptic tap. Lampblack-settle triggers a sustained 0.5s haptic on Legendary+. No haptic on Common.

---

# 8. Set-Completion Meta (the binder progression)

## 8.1 Per-Set badges

Per Set (each Set has 20 Moments — 12 Common, 5 Rare, 2 Legendary, 1 Ultimate):

| Badge | Requirement | Visual |
|---|---|---|
| **Common Reader** | All 12 Commons | Painted bookmark slipped into binder spine |
| **Rare Reader** | All 5 Rares | Embossed seal on binder cover (Pane-glyph) |
| **Legendary Reader** | Both Legendaries | Gold-leaf ribbon across binder edge |
| **Apex Reader** | The 1 Ultimate | Wax-seal in Pane color on binder cover |
| **Set Master** | All 20 Moments | Full painted illumination on binder cover (custom art per Set) |

**Visual register:** All badges are painted in the same register as the cards themselves — they look like *parts of the binder*, never like UI achievement chips. No XP-bar, no progress-percent ring, no "you are X% to Set Master." The user sees what they have; the binder reveals what they don't.

## 8.2 Per-Universe badges

- **"Universe Patron"** badge: own ≥1 Ultimate from every Set within a Universe. Issued automatically. Visual: a Pane-glyph wax-seal in foil, rendered once per Universe.

## 8.3 Per-Series badges

- **"Series Patron"** badge: complete ≥3 of 5 Universes (i.e., own all 20 Moments of every Set within at least 3 Universes). Issued at Series close (Feb 2027). Visual: the full Lattice-painting embossed on the binder cover with the user's 3+ Pane-glyphs in foil.

**Pokémon-Trainer-Badge metaphor (V2 §6 audit):** The binder is a **gallery-hung binder**, not a database table. Each Set has a *page* in the binder, which is a 2D illustrated page (not a card-grid view) — empty slots are *outlined paintings* of where the Moment would go. Visual register: think *physical card binder photographed open on a wood table*, never *crypto wallet inventory list*.

---

# 9. Parallel-Completion Meta (the cross-Universe chase)

Parallels are the cross-Universe substrate per the Multiverse-Shells doctrine — same Spine, different shell. Series 1 ships 4 Parallel shells: ARCANA / AETHER / WITNESS / NEON. Each Parallel-completion creates a meta-badge:

| Meta-badge | Requirement | Reward |
|---|---|---|
| **ARCANA Master** | Collect ARCANA Parallel of any 12 Rare+ Moments across Series 1 (out of total ~145 ARCANA renderings) | Foil-stamped binder spine in ARCANA blue; access to ARCANA-tier Curated drops in Series 2 |
| **AETHER Initiate** | Collect AETHER Parallel of any 6 Legendary+ Moments | Smoke-residue binder cover treatment; AETHER-pack pre-access in Series 2 |
| **WITNESS Archivist** | Collect WITNESS Parallel of any 15 Rare+ Moments | Footnoter custom-letter mailed (physical) + WITNESS-tier wiki annotation rights |
| **NEON Pioneer** | Collect NEON Parallel of any 6 CYBER-shell Moments | NEON-coded binder UI; first-look at Series 3 NEON Set |
| **Lampblacker** (highest meta) | Own 1 ONE-OFF (4 ONE-OFFs commissioned in Series 1) — the 1/1 chase | Council Q&A direct-question privilege; Apex-pack pre-access for life; physical 1/1 print delivered |

**Critical:** Parallel-completion badges are *per Series*. ARCANA Master in Series 1 does not auto-renew in Series 2 — the chase resets. This is intentional: each Series has its own completion arc. Reset preserves replay-value across Series boundaries.

---

# 10. Showcase / Vault / Binder UI Spec (mobile-first)

Per V2 §6 audit + R2 §6 Driver-2 (Pokémon-Badge metaphor). The binder is the central UI primitive of the entire post-onboarding experience. Mobile-first.

## 10.1 The metaphor (V2 §6 audit anchored)

**"Gallery-hung binder, not a database table."**

The binder is rendered as a **9-card grid per page** (3×3), swipe-able horizontally between Sets. Each Set is one binder-page-spread (left page: cards 1-9; right page: cards 10-20 — actually 11 slots on the right page: 9 grid + 2 inset-Legendary). Empty slots show painted outlines of where the Moment would go (silhouette of the figure painted in faintest umber; user *sees* what they don't have).

**Set-cover view** (zoom-out from binder pages): a single illustrated cover page per Set, rendered as a painted book-cover. The user can scroll a vertical column of Set-covers (like flipping through binders on a shelf). Tap a cover → open that binder.

**Series view** (further zoom-out): the Lattice-painting from §2 with each of the 5 Pane arches showing the user's per-Universe completion-state. Glow intensity per arch maps to completion %, but the % number is never shown — the *glow* is the metric.

## 10.2 Empty-state copy

Per V2 §6 audit (*"single best empty-state copy I've ever read"*):

When a binder page is fully empty:
> *"Enchanted Kingdom — letter is drafting"*

When a binder page has 1-9 of 20:
> *"Enchanted Kingdom — 4 pages bound, 16 yet to write"*

When Set Master is achieved:
> *"Enchanted Kingdom Set 1 — bound and shelved"*

The copy treats the binder as an *unfinished book* the user is helping to bind, not a database the user is filling.

## 10.3 BANNED in binder UI

- **P&L** (current-portfolio-value, total-spent, gain/loss)
- **Rare+ count** (numeric tally of "5 Rares, 2 Legendaries" etc — replaced by qualitative copy)
- **Completion %** (replaced by qualitative *"4 pages bound, 16 yet to write"*)
- **Value-history chart** (no chart at all on binder surface)
- **"Estimated Value −69.6%" red-trend pill** (banned outright per G1 §4 DISCARD)
- **"Need / Own / Comfy / Bulk" sub-tabs** (banned)
- **"Smart money is accumulating" pill** (banned)
- **"Movers strip"** (banned)

## 10.4 ALLOWED in binder UI

- **Cards-collected count** as qualitative copy: *"12 of 20 in Set 1"* (qualitative phrasing, not a percent)
- **Lampblack-tether visualization:** when a card is tapped, soft glowing lines connect it to other cards in the user's binder that share Lampblack-residue. These are the *Echo-tags* visualized. Tap a tether-line → see why these two cards touch.
- **Reading-pact ticket count** (1-5 in wallet) — small painted illustration of folded paper tickets, rendered in the binder's spine area
- **Set-cover painted illustration** — the Set's commissioned cover art, full-bleed
- **Council Q&A archive link** — small *"Council notes →"* link at binder foot, opens that Set's Q&A
- **Wishlist** — user-created list of Moments they want; influences pack pull-weighting subtly (never visibly)

## 10.5 Mobile-first interaction

- 375px viewport: binder renders at full screen-width, 9-card grid is roughly 3 × 110px cards with 5px gutters
- Swipe horizontally between Sets within a Universe
- Swipe vertically between Universes
- Pinch-zoom on a card opens full-art Moment view
- Long-press on a card → Lampblack-tether reveal (soft lines glow to connected cards)
- Pull-to-refresh disabled (binder is not a feed)

---

# 11. The "Reading Pact" Mechanic (deep dive)

Per R2 §6 Driver-3 finding (*"strongest mechanic in R2 — self-selected commitment with odds bump that ports Snap's tension primitive into reading register"*). This is the single most important retention mechanic in v1.

## 11.1 Pact taxonomy

**Chapter-pact:** *"I will read 1+ chapter this week from a named source text."*
- Source-text examples: a chapter of Stoker's *Dracula*, a chapter of Carroll's *Alice*, a chapter of Doyle's *Adventures*, a chapter of *Theogony* (Hesiod), a chapter of any Pane-canonical PD source
- LoreVault provides Project-Gutenberg-linked chapter excerpts inline in the pact-creation flow (so the user doesn't need to find the text; we surface it)
- Pact duration: 1 calendar week (Sun-Sat)

**Story-pact:** *"I will read 1 short story complete from a named source."*
- Source examples: a Holmes story (Doyle), a Poe tale, a Grimm Märchen, an Aesop fable, an Egyptian funerary text fragment
- Story-pact has a higher pull-weighting than chapter-pact (rewards completeness)

**Dossier-pact:** *"I will read 1 LoreVault iceberg-pull deep-dive doc."*
- Source: LoreVault wiki's per-Pane *deep-dive* dossiers (the long-form scholarly documents that anchor each Universe — see the 21 dossier docs as published examples)
- Dossier-pact has the highest pull-weighting (rewards engagement with our own content)

## 11.2 Reward mechanics

- **Subtle pull-weighting:** the user's next pack pull is weighted +5% toward the Pane the pact was in. NEVER quantified to user. NEVER displayed on card pull. The pack opens normally; the pull just happens to come from the pacted Pane more often than chance. This is *exactly* Marvel Snap's hidden-tension primitive ported into reading register.
- **Stacking:** completing 4 consecutive weeks of pacts in the same Pane increases the weight to +10%. Cap at +10% — preserves randomness as the dominant factor.
- **No streak chrome:** broken pact does NOT reset progress; user just doesn't get next-pack weight that week. No shame, no penalty, no notification of failure.

## 11.3 Verification

- **Trust-based default.** User self-reports reading. We do not proctor.
- **Optional comprehension micro-quiz** (opt-in): a 3-question quiz on the read material, available *after* the pact week ends. Quiz is for the user's pleasure (and as Council-eligible pact-completion mark) — not gated. Passing the quiz adds *one* additional Sample-pack ticket to the wallet (above the 5-cap). This is the only mechanism that exceeds the 5-ticket cap.

## 11.4 Why this works

The pact reads as: *I am committing to a reading I would do anyway, and the platform notices.* It does NOT read as: *I am completing a quest for XP.*

The difference is everything. Quest-completion chrome is gambler-collector signal (banned §12). Reading-pact is reader-signal — *the same primitive at structural level, with the surface-register inverted.*

---

# 12. Banned Retention Chrome (the explicit DO-NOT list)

Per G1 §4 DISCARD list — every retention-cosplay element from v1 that does NOT return:

| BANNED chrome | Replacement |
|---|---|
| Daily-login strip with red-pulse | Reading-pact ticket (§3.3) — earned by reading actions, not by tapping app |
| Daily challenge with weekly +80 XP Legend chrome | Beat A/B/C daily structure (§3) — Journal-read or Lattice-tap or Pane-visit |
| Weekly chain | Sunday Lampblack Tally (§4.1) — pull-driven content, not chain-pressure |
| Collector pass tier bar | Per-Set badges + per-Series Patron badges (§8) — qualitative milestones, no bar |
| Three weekly challenges | Reading Pact (§11) — single self-selected commitment |
| Season teaser countdown | Quarterly milestone calendar (§6.2) — published once, no countdown chrome |
| Featured market cards | NO REPLACEMENT — secondary market does not get featured surfaces in v1 |
| Discover feed | Lattice-painting home-page (§2) + Today's Pane (§3.2) — geometry as discovery, not scroll feed |
| Live stats row | NO REPLACEMENT — banned outright |
| Season progress bar | "Series Patron" badge (§8.3) — earned at completion, no progress bar |
| Monthly leaderboard | NO REPLACEMENT — leaderboards are gambler-chrome |
| Battle stats on cards | NO REPLACEMENT — cards have no combat mechanics in v1 |
| Burn-for-XP CTA | NO REPLACEMENT — cards are not consumable |
| Forge seasonal discount on packs | NO REPLACEMENT — pack-tier prices are fixed |
| Estimated value charts | NO REPLACEMENT — banned outright |
| "Need / Own / Comfy / Bulk" sub-tabs | Single binder view (§10) with qualitative completion |
| "Smart money is accumulating" pill | NO REPLACEMENT — banned outright |
| Movers strip | NO REPLACEMENT — banned outright |
| Charm-60 on Sherlock Holmes | NO REPLACEMENT — figures have no stat blocks |
| 30/90-day price chart on card-detail page | Lampblack-tether visualization (§10.4) — connections, not charts |
| Power / Intelligence / Mystery / Legend stats on literary figures | Lampblack-tether tags (§10.4) — qualitative connections, not RPG stats |
| Showcase drag-and-drop with empty slots | Binder (§10) — gallery-hung painted page, not drag-target grid |

**Discipline statement:** The banned list is enforced by the Council seat 4 (Iceberg Auditor) at every Set commission. Any production asset that re-introduces banned chrome is rejected pre-mint. No exceptions, no "we'll just do this one for the launch" carve-outs.

---

# 13. Yardstick 7 ("Thrilled") Operationalization

Per V2 Rewrite 5 — Y7 was added to the NORTH-STAR but measurement methodology was rough. Here is the binding spec.

## 13.1 Definition

**Yardstick 7 — Thrilled:** % of activated users who, in any 7-day window during their first 30 days, post a card image, a quote-screenshot, or a Lampblack-thread theory to a public channel without referral incentive.

**Activated user:** completed onboarding (§1) AND opened ≥1 pack (Sample or above).

**Public channel:** Tumblr / X / Reddit / Discord / Bluesky / Threads / Mastodon / TikTok. Private DMs and closed Discord servers do NOT count.

## 13.2 Targets (Series 1)

- **Q1 May–Jul 2026:** ≥10% of activated users emit at least one Y7 event in their first 30 days
- **Q2 Aug–Oct 2026:** ≥15%
- **Q3 Nov 2026–Jan 2027:** ≥20%
- **Q4 Feb 2027:** ≥15% sustained (we accept that Series-close emission may dip — Series 2 launch in May 2027 should restore)
- **Floor (any quarter):** 5%. Below floor → Track A (art) and Track B (copy) get re-commissioned for higher screenshot-emission optimization.

## 13.3 Measurement methodology

**Daemon-side (automated weekly):**
- Brand24 / Tagboard search for `LoreVault` mentions (daily)
- Manual filter for: card-image-share / quote-screenshot / Lampblack-thread / theory-post / pack-pull-share (the 5 emission types)
- Unique-poster ID dedupe per 7-day window
- Output: weekly Y7 dashboard published to Council seat 4 (Iceberg Auditor) Slack

**Pre-analytics proxy (until Mixpanel-Y7-event ships):**
- Vercel logs grep for `og:image` referers from social sites (Twitter, Reddit, Tumblr, Discord)
- Unique-IP-by-day aggregation
- Cross-reference with auth'd-user share-links (the share-CTA in the Premium pack-open §7.1 generates a watermarked image; we track that watermark in logs)

**Cohort follow-up (manual quarterly):**
- Quarterly survey to a sample of 100 activated users: *"Have you posted a LoreVault card or quote to a public channel in the last 30 days? Where?"*
- Survey is voluntary; ~30% response rate expected
- Calibrates daemon-side measurement against ground truth

## 13.4 Track A / Track B optimization

Per the prompt scope: *"the thrilled-screenshot-able moments are TRACK A (art) + TRACK B (copy) feeds — daemon optimizes both for Y7."*

- **Track A (Art):** every Moment commissioned must pass a screenshot-square-aspect-test — does the painted card image, cropped to 1:1, work standalone on social? Council seat 1 (Architect) reviews 1:1 crop pre-mint.
- **Track B (Copy):** every Moment's flavor text must pass a quote-screenshot-test — does a 1-3 sentence excerpt, on a transparent background with the LoreVault watermark, work as a standalone Tumblr/Bluesky post? Council seat 2a/2b reviews pre-mint.

Both tracks have a "social-emission-fitness" score logged per Moment. Council seat 4 audits monthly against Y7 actual-emission rates per Moment.

---

# 14. Crossover Density Discipline (per cross-Universe doctrine)

Inherits Synthesis Part 3 §4.3 Decisions 30/31/32/33. Operationalized:

## 14.1 Series 1 (May 2026 – April 2027)

- **Cross-Pane Surfaces:** 0 (zero)
- **Cross-Pane Echoes:** 1–2 across the entire Series (not per Set — per Series)
- **Cross-Pane Deeps:** 0–4 (these are environment-only Lampblack-trade cards per Pattern 9; allowed since they have no figure-crossing)
- **Convergence-Cathedral:** 0 (first Convergence is Series 3 finale)

Series 1 is establishment. Each Universe's Lampblacker-Spine is being introduced; cross-Pane crossover would dilute the Spine establishment.

## 14.2 Series 2 onward (May 2027+)

- **Per-Set:** 7% crossover density ceiling (≤1 crossover per 14-Moment Set; LoreVault Sets are 20-Moment so ≤1.4 crossovers per Set ≈ 0–1 per Set)
- **Per-Series:** 1 Convergence-Cathedral max — first one is Series 3 finale (do NOT ship in Series 1 or 2)
- **Iceberg ratio at Set-level:** 1 Surface : 2 Echo : 4 Deep (the full ratio activates in Series 2)
- **Per-Legendary-figure crossover cap:** 2 cross-Universe Moments per Legendary figure per Series (Decision 39, Synthesis Part 3 §4.3 — prevents Hercules-Xena drift)

## 14.3 Marketing positioning (Decision 33)

**Home-page hero copy (live on lorevault.com from May 2 2026):**

> **LoreVault has no Universes Beyond. All canon IS the world.**

Inline expansion (revealed on tap):
> *Magic: The Gathering created Lord-of-the-Rings cards in the Universes Beyond product line. Final Fantasy cards. Doctor Who cards. Beneath those licenses, the original Magic universe (Dominaria, Zendikar, Ravnica) is being eclipsed.*
>
> *LoreVault cannot dilute its world this way. Public-domain canon — Sherlock Holmes, the Brothers Grimm, Wonderland, Dracula, the Greek myths — IS the world. There is no separate "primary canon" to protect. The Lattice is everything.*
>
> *This is a structural moat MTG cannot replicate.*

This positioning is locked. Every press release, every Council Q&A, every wiki "About LoreVault" page repeats this exact framing. It is the differentiator and the discipline simultaneously.

## 14.4 Wiki-only crossovers (Pattern 14)

The LoreVault wiki contains crossovers that *never* appear as cards. Per Decision (Synthesis Part 3 §4.3 implicit + Dossier 21 §2 Pattern 14): *the wiki itself can be a cross-Pane artifact.*

This means:
- Wiki articles may name cross-Pane Lampblack-tethers that exist only as commentary
- Wiki articles may reference Sets that have NOT shipped yet (forward-references to Series 2+)
- Wiki articles may catalog cross-Pane figures that will never become cards

This is **free narrative density** — collectors pay for cards, but the wiki is infinite. Per Synthesis Part 3 §4.3 Decision 33 marketing positioning: *the wiki is the world; the cards are the wake the world leaves on the page.*

---

# 15. Acceptance Criteria

The spec ships when ALL the following are true:

1. **Onboarding 90-second test converts ≥15% Day-1** (V2 Rewrite 3 stepped target Q1 floor). Measured by: % of first-tap visitors who hit the "Send me the Journal" CTA and confirm email within 24 hours of first tap.

2. **Pack-open ritual passes the "would the Sherlockian completist scream-text screenshot" test.** Measured by: 5-user qualitative test on Sherlockian.com Discord cohort; 4 of 5 must spontaneously offer to share a screenshot from the Curated $49 pack-open without prompt.

3. **Vault empty-state passes "single best empty-state copy" V2 audit bar.** Measured by: V2 audit reviewer (David Wang slot per memory) sign-off on the empty-state copy register; specifically, *"Enchanted Kingdom — letter is drafting"* and equivalents must read as voice-native, not as UI placeholder.

4. **Binder reads as gallery-hung not database.** Measured by: 5-user qualitative test on physical-collector cohort (Pokémon-binder owners, vintage-card collectors); 4 of 5 must use the word *"binder"* or *"album"* unprompted when describing the surface; zero must use *"inventory"* or *"wallet"* or *"portfolio."*

5. **No banned-chrome present in any surface.** Measured by: Council seat 4 (Iceberg Auditor) full-surface audit pre-launch; signed declaration that none of the 24 G1 §4 DISCARD elements appear anywhere in the v1 product.

6. **Yardstick 7 ≥15% activated-user social-emission rate within 30 days** (Q2 target). Measured by daemon-side methodology in §13.3.

7. **Council 4-seat structure live and operational** by May 1 2026 (T-1 to launch). Voice Lead 2a + Footnoter 2b split confirmed; Iceberg Auditor seat 4 staffed; Compliance seat 3 (Laura Abreu) confirmed available.

8. **Lattice-painting commissioned and approved** by Council seat 1 by April 25 2026 (T-7 to launch). FLUX prompt run 3-5 candidates; Council selects final.

9. **First 12 monthly Sets locked in production calendar** with commissioning windows (T-90 to ship per Set). Per Yardstick 5 floor: Set 1 ships May 2026, Set 12 ships April 2027, no slips.

10. **Reading Pact mechanic live in onboarding by Q2 2026.** Sample-pack pull-weighting infrastructure tested with synthetic users; pact-creation flow live; Project-Gutenberg-linked chapter excerpts surfaced inline.

---

**Decisions, not options. — LoreVault Game Loop & Progression Spec v1, 2026-04-26.**
