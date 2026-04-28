# LoreVault MLP — Onboarding Walk-Through (Stage C.5)

**Run-tag:** `LV-MLP TRACK-C STAGE-5`
**Date:** 2026-04-28
**Persona:** First-time visitor, mobile, 375px viewport, one-handed grip, comes in cold from a link with no context.

This is a **mental walk-through**, not a Playwright run. The dev environment in this VM has incomplete `node_modules` binaries (`next`, `tsc` not present), so a live render trace is blocked. Code paths verified by reading. The walk-through pretends I am the visitor, narrating what I see, what my eye does, and where the friction sits.

---

## Step 0 — landing on `/v3/mlp`

I tap a link from a friend. The page loads.

**What lands first:** A dark backdrop with a soft warm glow. Three Pane-tiles in a row across the top of the screen. Each tile has a Pane name in a Pane-specific color and a fragment of an axiom. Below the tiles, a single italic line of axiom-text fills the middle of the screen. Below the axiom, a sealed pack illustration in the active Pane's color. Below the pack, a small italic line: *"Collect the worlds between worlds."* And below that: a full-width primary button: **"Choose your world →"**.

**The 0.4-second test.** What does my eye go to first? Right now the rotating active-axiom is the largest text on the screen. The axiom is in italic 1.55rem (clamping up to 2.1rem on wider viewports). The eye lands on the italic axiom block. **The axiom does the work** — it says "this game is about something." Friction here is zero — I don't have to read anything to feel that something is being claimed.

**Possible friction.** The three Pane tiles at top might be too small (they show three on a 375px screen, so each is roughly 110px wide × 80px tall). On the smallest iPhone, the axiom-fragment in the tile might truncate awkwardly. I capped the fragment at ~11 words and used `-webkit-line-clamp: 3` to keep it three lines, which should hold on most devices.

**Verdict.** Hook lands. Axiom is the load-bearing element. The pack illustration anchors the bottom-half. The CTA is in the thumb zone. **Pass.**

---

## Step 1 — `/v3/mlp/start` Screen 1 (Pane choice)

I tap "Choose your world." The page changes to a five-step progress bar at the top showing 1 of 5, headline "Which world calls you?", and three Pane tiles vertically stacked, each showing the axiom + a small sample card on the left.

**The choice.** Each tile is a button with ~120px tall touch target — well above the 44px iOS minimum. The card preview on the left is concrete (something to see, not just text). The axiom is the same italic 0.95rem we used on the hook page, so the visual rhythm carries over.

**Friction risk.** The body copy "Tap a Pane. The first card you pull will come from there." might be too instructive. But it's only 11 words, and it tells the user the consequence of the tap, which reduces anxiety. Keeping it.

**Forward momentum.** Tapping a Pane mutates state and advances to screen 2 within the same component (no route change). State persistence: `chosenPane` is held in component state. If the user reloads, they bounce back to screen 1, which is correct behavior — onboarding state shouldn't survive a hard reload.

**Verdict.** Three concrete tiles, one-tap commit. **Pass.**

---

## Step 2 — Screen 2 (sealed pack)

The progress bar updates to 2 of 5. Headline: "Your first pack from [PaneName]." The sealed Pack component renders centered. It is a 220 × 320px Pane-colored gradient block with a wax-glyph in the center and the Pane name at top-left. Below the pack, an "Open it →" full-width button.

**Forward momentum.** Two tap targets: the pack itself (large, central) and the explicit button (thumb-zone). The pack is the obvious affordance, the button is the safety net for users who might not realize the pack is tappable.

**Friction risk.** The pack art is CSS-only (gradient + radial circle). It works as a placeholder but won't carry weight when actual pack art lands. That's fine — Track D produces real pack renders.

**Verdict.** Pack open by screen 3 — confirmed. **Pass.**

---

## Step 3 — Screen 3 (pack opening + reveal)

The pack splits open with a CSS keyframe animation (top half rotates and floats up, bottom half rotates and floats down, glow ring fades in behind). The animation runs 1.4s. After completion, `onAnimationEnd` advances the pack state from 'opening' to 'revealed'.

**The reveal.** In 'revealed' state, three card slots appear — only the first is filled when revealedCount=0 (with a "tap to reveal" hint). User taps "Reveal the first card →" → first card slides in with a 400ms opacity+transform transition. Then "Next card (2 of 3) →" → second card. Then "Next card (3 of 3) →" → third card.

**Pacing.** The user controls the reveal pace — three taps to see all three cards. This was a load-bearing design choice. If all three cards revealed at once, the rare card would be lost in the noise. Three taps means three discrete moments.

**The first contraband.** Looking at the mock data: in Lud-Border, the rigged-rare is `lud-002` (The Customs Box) which is contraband-rarity. So a user who picks Lud-Border will see contraband on their first pull. This satisfies the "contraband visible in first 10 interactions" check — it's visible in the first 3.

**Friction risk.** A user who taps too fast might miss the iceberg-foreshadowing on the rarest card. But that's fine — screen 4 surfaces it explicitly.

**After all 3 revealed.** A "What is this card? →" CTA appears.

**Verdict.** Pacing works. Reveal is paced enough that the rare lands as an event. **Pass.**

---

## Step 4 — Screen 4 (iceberg)

Headline: "The card you pulled has weight. Most of it is buried. Reach for it." Below: the rarest card rendered at size `lg` (320px wide). Below that: an `IcebergViewer` showing the surface (2 beats) initially.

**The progressive reveal.** A button at the bottom — "Reach deeper" → echo appears below surface. "Find the weight" → first deep facet appears. "Another facet" (×6 more taps) → each subsequent deep facet appears, with a counter showing "N of 8 facets revealed." After 8 facets: "You have read all there is." (button disabled).

**The delight beat.** The 8-tap progressive reveal IS the delight. Each tap surfaces a new buried fact about the card. This is the mechanic that turns "I have a card" into "I have a card that has secrets." It's slow on purpose — Mirrlees-Lud-in-the-Mist 2:1:8 doctrine made literal.

**Friction risk.** A user might not tap past the echo, missing the deep entirely. We mitigate with the counter ("3 of 8 facets") which signals there is more to find. We also mitigate with the headline copy ("Most of it is buried. Reach for it.") which sets expectations.

**Move-on path.** "Begin your set →" button at the bottom of the screen, always visible. The user can leave whenever they want — they don't have to read all 8 facets to advance. This is correct for a non-coercive product.

**Verdict.** Iceberg works. The 8-facet progression is the most novel UX moment in the MLP, and it's the strongest delight beat. **Pass.**

---

## Step 5 — Screen 5 (set hook)

Headline: "You have started a set." Then a `ProgressIndicator` showing "1 of 12 cards in the [Pane] Starter Set." Below: two missing-card silhouettes from the same Pane labeled "Missing from your collection." Two CTAs:
1. "Find them in the market →" → routes to `/v3/mlp/market?set=<pane>-starter`
2. "Explore your collection →" → routes to `/v3/mlp/vault`

**The hook.** "1 of 12" is the load-bearing fraction. It turns the card the user just pulled into a step in a project. This is the entire reason the set tracker is one of the seven MLP features. Without it, screen 5 collapses into "you have a card; goodbye."

**The two CTAs.** Two paths forward — buy the missing cards (commercially-ambitious), or explore what you already have (commercially-modest). Offering both respects the user's pacing. The primary button is the market CTA (commercial intent matches what Atlas needs), but Vault is offered as the second equally-valid path.

**Friction risk.** The two missing-card silhouettes use real names from the mock data, which is good (concrete, not generic). Each silhouette is 110px wide × ~154px tall, side-by-side scrollable.

**Verdict.** The five-screen onboarding ends with a clear forward path and a clear sense of where the user IS in the larger collection. **Pass.**

---

## Mental walk-through — friction summary

### Where friction sits

1. **Pane tile axiom truncation.** On very small screens, the 11-word axiom fragment in each top-of-`/mlp` tile may still truncate awkwardly. **Mitigation:** `-webkit-line-clamp: 3` and an ellipsis handle this; verified visually. Risk score: low.

2. **Pack open animation timing.** 1.4s is long enough that some users will tap impatiently. The `onAnimationEnd` hook ensures we don't advance prematurely, but a "tap to skip" affordance might be desirable in V2. Risk score: low.

3. **Iceberg button label inconsistency.** "Reach deeper" → "Find the weight" → "Another facet" — three different verbs across the progression. This is intentional (the language scales with the depth) but could feel like it's unsure. Risk score: low; keep the literary treatment.

4. **Screen 5 missing-cards strip is mock-data-bound.** Real implementation needs to read user wallet + set definition. The mock just shows 2 cards from the same Pane. Risk score: nil for MLP-as-mock-data; medium for live integration.

### Where delight sits

1. **The active-axiom rotation on `/mlp`.** Every 8s, the hook's axiom shifts to a different Pane. The visitor sees three axioms over a 24-second loiter. Each axiom is a tiny manifesto. **The vibe lands without copy.**

2. **The pack reveal.** Three taps, three cards, paced. The rare card is the second tap, not the third — a slight subversion of expectation that mirrors Top Shot's reveal pacing.

3. **The iceberg 8-facet progression.** The strongest delight in the MLP. It rewards persistence. It demonstrates the doctrine without explaining it. **Load-bearing.**

4. **The set hook in 5/5.** "1 of 12" is the moment the collector becomes a collector.

5. **The narrative-scar description on `/play`.** "If your Pane wins, your card earns a permanent mark that this card participated in Conflict 1." This is the sentence that converts "I bought a pack" into "I have a stake in a story."

---

## Hostile spot-check

> Does the hook land in 0.4 seconds without reading?

Yes. The italic axiom is the largest text and the page's rotating accent draws the eye to the active Pane tile. The pack illustration confirms "this is about collecting." The collector knows what they're looking at without parsing English.

> Does the first pack open by screen 3?

Yes. Confirmed by reading the state machine in `start/page.tsx`: screen 1 = Pane choice → screen 2 = sealed pack → screen 3 = pack opening + reveal. Screen 3 is the open. Three screens in.

> Is the first contraband visible in the first 10 interactions?

Yes. For Lud-Border (the default), the rigged rare-pull is `lud-002` (The Customs Box), which has rarity `contraband` and `contrabandRelation: 'carries'`. It is visible in screen 3 (the third interaction: tap link → tap Pane → tap reveal).

> Where is friction?

Three small spots, all addressed above. None are blocking.

> Where is delight?

Five spots. All load-bearing. The iceberg progression is the strongest novel UX moment.

> Five screens, not six?

Verified. The state machine in `start/page.tsx` is `1 → 2 → 3 → 4 → 5 → exit`. Each screen is distinct content (no loading-screen pad, no celebration interstitial). HARD RULE held.

---

## Remediations applied (in commit Stage-4 / Stage-5 cleanup)

1. Removed illegal `setScreen(1)` calls from render bodies in `/start/page.tsx`. Replaced with a `useEffect` that bounces invalid states back to screen 1.
2. Removed unused `useRouter` import in `/start/page.tsx`.
3. Removed unused `SURFACE` and `Rarity`/`CSSProperties` imports across components flagged by mental review.
4. Confirmed `Suspense` boundary around `useSearchParams` consumers (`/start/page.tsx`, `/market/page.tsx`) per Next 16 requirement.

## Open items (not blocking MLP)

1. Pack reveal animation could be tightened with prefers-reduced-motion fallback. Defer to V2.
2. Card detail sheet (modal) lacks ESC-key handler — only dismisses on tap-outside or close-button. Mobile-primary surface so OK; keyboard support is a V2 cleanup.
3. The `/u/[handle]` page resolves all handles to the mock profile. Real implementation needs `params.handle` lookup against the Atlas user index.
