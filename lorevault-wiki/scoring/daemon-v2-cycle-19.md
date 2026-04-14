# Daemon v2 — Cycle 19
Phase: 2
Date: 2026-04-14
Version: v8.62

## What Was Built
- **Discovery Feed entry**: Pinned "Public Domain Baseball Is Here" feed card on the homepage. Type `feature`, pinned, dated today. Full body copy explaining d20 mechanics, salary cap drafting, difficulty tiers, and AI personality. CTA links to `/games/baseball`.
- **Expanded How to Play guide**: Replaced the 4-step minimal guide on the baseball hub with a 6-step walkthrough covering Draft, Control Roll, Outcome Roll, Runners, Steal, and Win. Added a difficulty tiers reference card showing Rookie/Veteran/Legend differences.
- **Top Characters leaderboard**: New section on the baseball hub showing top 3 characters by XP earned, with Games/Hits/HR/RBI/MVP stats. Only renders if the player has game history.
- **Baseball stats in Games hub**: Baseball W/L record appears in the Games hub records grid (first position) and inline on the Baseball card when games have been played. Import of `getWinLossRecord` from baseball records module.

Files changed:
- `src/data/feed-content.ts` — Added `pdb-launch` entry (pinned, feature type)
- `src/app/games/baseball/page.tsx` — Top Characters section, expanded guide with 6 steps + difficulty tiers reference
- `src/app/games/page.tsx` — Baseball record state, inline W/L on card, records grid integration

## Scores (post-Cycle-19 estimate)
- Engine completeness: 8/10
- UI quality: 8.5/10 (guide, feed entry, stats integration)
- Strategic depth: 7/10
- Visual polish: 7/10
- Fun factor: 7.5/10
- Navigation/discoverability: 9/10 (was 5/10 — now prominent across feed + hub + guide)

## Key Decisions
1. Feed entry uses `feature` type (not `drop`) since it's a game mode launch, not a card release
2. Pinned the feed entry so it stays at top of homepage regardless of date sorting
3. Baseball record card conditionally renders in the records grid only when games exist — prevents empty "0-0" showing for new users
4. Guide steps explain the d20 mechanic in plain language rather than linking to a separate guide page — keeps users in flow
5. Games hub already had Baseball featured with "New" badge from a prior cycle — cycle 19 added the stats layer and feed cross-promotion

## Next Target
Cycle 20: 9-inning mode + enhanced game records + stats tracking per character

## Deploy URL
Pending — Vercel deployment blocked by permission gate
