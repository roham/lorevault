# Daemon v2 — Cycle 9
Phase: 2
Date: 2026-04-14
Version: v8.52

## What Was Built
- `src/lib/baseball/types.ts` — Complete type system:
  - PlayerStats (HitterStats + PitcherStats)
  - GameState with full inning/bases/score tracking
  - HitChart: d20 roll → AtBatOutcome mapping
  - Roster, LineupSlot, FieldPosition
  - PlayLogEntry for play-by-play
  - StealAttempt, GameSummary
  - SpeedRating utility function

- `src/lib/baseball/charts.ts` — Deterministic hit chart generation:
  - generateHitterChart: OB-based good outcome allocation (OB-5 clamped 1-14)
  - Power distribution: HR slots = Power/7, doubles = Power/5 - HRs
  - Speed A enables triples
  - Roll 20 = best outcome, Roll 1 = strikeout (MLB Showdown pattern)
  - generatePitcherChart: heavily out-weighted (15-17 out slots)
  - Roll 20 on pitcher chart = strikeout, Roll 1 = walk

- `src/lib/baseball/engine.ts` — Core game mechanics:
  - rollD20, resolveControlRoll, resolveAtBat (full at-bat resolution)
  - advanceRunners: handles all 8 outcomes with runner logic
  - resolveSteal: speed vs catcher defense
  - applySacFly, resolveDoublePlay
  - createGame, checkGameOver, advanceInning
  - getCurrentBatter, getCurrentPitcher, advanceBattingOrder
  - generateGameSummary with MVP calculation

## Frigga Research Summary
- MLB Showdown: OB ÷ 5 = good outcome slots on chart (applied)
- Dramatic tension: two-roll reveal (control then outcome) creates "two heartbeats"
- Chart adjacency: outs next to hits creates near-miss tension
- Roll 1/20 rules: always dramatic (worst/best guaranteed outcomes)
- Sac fly: flyout + runner on 3rd + < 2 outs → auto-score

## Key Decisions
- Engine is 100% pure functions — no UI, no state management, no side effects
- Randomness passed as arguments (not using Math.random internally in resolution)
- rollD20() uses Math.random for convenience but all resolution functions are deterministic
- Hit chart slot 1 for groundout_dp enables double play mechanic
- Pitcher chart Roll 1 = walk (not strikeout) because worst pitcher outcome = walk

## Next Target
Cycle 10: Inning state machine + game loop — wire the at-bat engine into a full game flow

## Deploy URL
https://lorevault-site-ljpv67c23-ros-projects-9a9bb0c9.vercel.app
