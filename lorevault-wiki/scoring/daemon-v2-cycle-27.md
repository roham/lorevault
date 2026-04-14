# Daemon v2 — Cycle 27
Phase: 2
Date: 2026-04-14
Version: v8.70

## What Was Built

### Draft Engine (`src/lib/baseball/draft.ts`)
- Complete snake-draft state machine with 20-pick sequence
- Snake order: Player 1, AI 2-3, Player 4-5, AI 6-7... Player 20
- 150-point budget cap enforced independently per team
- AI draft intelligence by difficulty:
  - **Rookie**: random picks from valid pool
  - **Veteran**: value-score based (OB*2 + Power*0.8 + Speed*0.5 + Def*0.6) with +/- 2 noise
  - **Legend**: counter-drafts by targeting high-value cards from top 3 available
- Pitcher designation: last pick (pick 10) for each team is their pitcher
- `buildRosterFromDraft()`: auto-assigns defensive positions by defense rating, batting order by OB

### Draft UI Page (`src/app/games/baseball/draft/page.tsx`)
- Difficulty selection screen (Rookie/Veteran/Legend)
- 20-slot progress bar: gold pills = player picks, red = AI picks, current pick pulses
- Card pool: 2-column grid of all characters, sorted by OB/PWR/SPD/DEF/Cost
- Taken cards remain in grid at 30% opacity with "YOURS" or "AI" badge (preserves mental map)
- Pitcher pick phase: auto-filters pool to show only pitcher-capable characters
- AI pick animation: 500ms delay + card highlight before adding to AI roster
- Toggle view: card pool ↔ roster preview (player + AI picks side by side)
- Budget display: remaining points out of 150
- Bottom bar: pick counts + abandon draft link
- Draft complete: spinner + "building rosters" → auto-route to play page

### Play Page Integration
- Added `useSearchParams` hook with Suspense boundary
- `?drafted=true` query param loads rosters from localStorage keys
- Skips pregame difficulty selection when drafted
- Wrapped in `<Suspense>` for Next.js streaming compatibility

### Baseball Hub
- "Snake Draft" card with purple theme in game mode list
- "Take turns picking from the full pool. Build your team pick by pick."

Files changed:
- `src/lib/baseball/draft.ts` — New (260 lines)
- `src/app/games/baseball/draft/page.tsx` — New (380 lines)
- `src/app/games/baseball/page.tsx` — Added draft link
- `src/app/games/baseball/play/page.tsx` — Draft roster loading + Suspense

## Frigga Research Summary
- 2-column mobile grid with dimmed-in-place picked cards (not removed) preserves mental map
- AI pick animation should be slightly dramatic (600-800ms) to make loss register emotionally
- Pitcher pick: filter enforcement (not error state) via auto-lock to pitchers
- 30s optional timer for competitive feel (deferred to future cycle)

## Scores (post-Cycle-27 estimate)
- Engine completeness: 9/10 (draft mode adds significant pre-game depth)
- UI quality: 8/10
- Strategic depth: 8/10 (up from 6 — draft is pure strategy)
- Visual polish: 7/10
- Fun factor: 9/10 (draft = tension before the game even starts)
- Game modes: 5 (quick, full, tournament, lineup builder, draft)

## Key Decisions
1. Snake draft (not straight draft) — the reversal creates interesting strategic tension
2. Last pick = pitcher — creates a natural "save your pitcher pick" endgame
3. AI picks from top 3 on Legend (not strictly best) — adds unpredictability
4. Taken cards dimmed in-place (Frigga research) — preserving mental map is critical
5. Draft rosters passed via localStorage + query param (not URL state) — avoids URL bloat
6. Suspense boundary required for useSearchParams — Next.js streaming compatibility

## Next Target
Cycle 28: Custom hit charts for special/evolved cards

## Deploy URL
https://lorevault-site-bssiht1b1-ros-projects-9a9bb0c9.vercel.app
