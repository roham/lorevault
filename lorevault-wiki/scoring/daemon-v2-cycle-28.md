# Daemon v2 — Cycle 28
Phase: 2
Date: 2026-04-14
Version: v8.71

## What Was Built

### Evolution System (`src/lib/baseball/evolution.ts`)
- 3 evolution tiers beyond Base: Seasoned (250 XP), Veteran (750 XP), Legend (1800 XP)
- `getEvolutionTier(totalXP)`: returns tier 0-3 from cumulative XP
- `getEvolutionInfo(totalXP)`: full tier data including next threshold, progress %, colors
- `evolveHitterChart(chart, tier)`: post-processes base chart with tier-specific upgrades
  - Tier 1: Convert 1 out → single (+5% OBP)
  - Tier 2: Convert 1 groundout → walk (+5% OBP)
  - Tier 3: Convert 1 out → single AND upgrade 1 single → double (+5% OBP, +5% XBH)
- Guard rails: max 3 rows modified (15% chart redistribution), minimum 1 strikeout preserved
- `evolvePitcherChart()` implemented for future use (pitchers don't earn XP yet)
- `EVOLUTION_TIERS` config with visual properties: borderColor, glowColor, label per tier

### Engine Integration (`src/lib/baseball/engine.ts`)
- `resolveAtBat()` accepts optional `hitterEvolutionTier` parameter
- When hitter controls and has evolution tier > 0, chart is post-processed through `evolveHitterChart`
- Zero change to pitcher chart resolution (pitcher charts unaffected)
- Backward-compatible: omitting the tier parameter preserves base behavior

### Game Loop Integration (`src/lib/baseball/game.ts`)
- `playAtBat()` accepts optional `cardEvolutions: Map<string, number>`
- Looks up batter's evolution tier and passes to `resolveAtBat`

### Play Page UI (`src/app/games/baseball/play/page.tsx`)
- `buildEvolutionMap(roster)`: reads character XP from localStorage, computes tier per card
- Evolution map computed once on game init (SELECT_DIFFICULTY), stored in BoardState
- Ref-based access (`cardEvolutionsRef`) for stale callback closures
- PlayerCard component: evolution tier badge (SEASONED/VETERAN/LEGEND) with themed border glow
- Game-over XP breakdown: shows evolution tier badge next to each character name

### Baseball Hub (`src/app/games/baseball/page.tsx`)
- Top Characters section: evolution tier badges next to character names
- XP progress bars showing distance to next evolution tier
- Progress bar color matches the target tier's border color

Files changed:
- `src/lib/baseball/evolution.ts` — New (145 lines)
- `src/lib/baseball/engine.ts` — Modified (import + resolveAtBat param)
- `src/lib/baseball/game.ts` — Modified (playAtBat param + tier lookup)
- `src/lib/baseball/index.ts` — Added evolution export
- `src/app/games/baseball/play/page.tsx` — Modified (evolution map, PlayerCard badges, XP display)
- `src/app/games/baseball/page.tsx` — Modified (evolution badges + progress bars in Top Characters)

## Frigga Research Summary
- 3 tiers beyond base is the sweet spot — enough progression to feel meaningful, not crushing
- XP thresholds calibrated to 20-80 XP/game range: ~5, ~15, ~36 games to reach tiers 1-3
- Each tier modifies exactly 1-2 rows on the d20 chart (5% probability per row)
- Legend hitter: 3 rows modified total = base .280 becomes ~.330-.340 (Hall-of-Fame ceiling)
- Power creep is a UI problem masquerading as math — visibility of evolution makes it feel earned
- Branching at Tier 2 creates metagame diversity (deferred to future cycle)
- Visual: bronze→silver→gold border progression, progress bar below name

## Scores (post-Cycle-28 estimate)
- Engine completeness: 9.5/10 (evolution adds long-term progression layer)
- UI quality: 8/10
- Strategic depth: 9/10 (up from 8 — evolved cards create meaningful roster decisions)
- Visual polish: 7.5/10 (tier badges, glow borders, progress bars)
- Fun factor: 9/10 (progression hooks + "just one more game" loop)
- Game modes: 5 (quick, full, tournament, lineup builder, draft)

## Key Decisions
1. Post-processing approach — evolution modifies generated charts, not base stats, keeping generation pure
2. Ref-based evolution map — stale useCallback closures safely access evolution data
3. Deterministic upgrades per tier (not branching) — Frigga's Tier 2 branching deferred to reduce scope
4. Guard rails strict: max 3 rows, min 1 strikeout — prevents degenerate evolved charts
5. Targets highest-index out slots for upgrades — creates "almost got out → hit" tension
6. Pitcher evolution implemented but inactive — pitchers don't earn XP in current system

## Next Target
Cycle 29: Sound design hooks + audio feedback system

## Deploy URL
https://lorevault-site-myd6bnd9x-ros-projects-9a9bb0c9.vercel.app
