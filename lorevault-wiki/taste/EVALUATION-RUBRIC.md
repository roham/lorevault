# Evaluation Rubric — LoreVault Taste Daemon

_Last scored: 2026-04-24T14:30:00Z (cycle 3, Audit-Hot)_

Target by cycle 200: every dimension ≥ 7.

| # | Dimension | Score | Notes | Last Updated |
|---|---|---|---|---|
| 1 | Art system quality | 4/10 | Real art visible in /collection for several characters; no imageUrl in cards.ts yet | cycle-3 |
| 2 | Taste-model approval | N/A | 54 votes in KV; taste model update pending (< 20 new votes threshold) | cycle-3 |
| 3 | Coverage | 2/10 | 88 items in manifest (need ≥ 400; ~22% of target) | cycle-3 |
| 4 | Build health | 9/10 | Green build; lint pending full run | cycle-3 |
| 5 | Lighthouse mobile | ? | Pending Lighthouse run | cycle-3 |
| 6 | Route coverage | 8/10 | /, /moodboard, /collection all 200 + zero console errors; Marketplace/Games not yet walked | cycle-3 |
| 7 | Best-practice hygiene | ? | Pending grep/lint | cycle-3 |
| 8 | IA clarity | 6/10 | All key routes reachable; home is pre-auth landing (no nav by design); Marketplace visible in app | cycle-3 |
| 9 | Design coherence | ? | Pending DESIGN-DIRECTION.md review | cycle-3 |
| 10 | Cycle efficiency | 8/10 | 3 cycles, all green builds; trademark label fixed; audit established | cycle-3 |

## Dimension Definitions

| # | What 10/10 Looks Like | How Measured |
|---|---|---|
| 1 | Real illustrated art on every card surface; consistent style per set | % of real card surfaces with `imageUrl` set; visual consistency spot-check |
| 2 | 7-day rolling ✓-rate on mood-board ≥ 55% | Pull from KV |
| 3 | ≥ 400 distinct character × style cells in rotation | Manifest length |
| 4 | Green build, zero TS errors, zero lint errors | `npm run build` + `npm run lint` exit codes |
| 5 | ≥ 85 performance, ≥ 95 a11y | CI run or local `lighthouse` against deployed URL |
| 6 | Every route returns 200 in Playwright walk, zero console errors | Walk + log |
| 7 | `any` count, dead-code count, duplicate-pattern count trending down weekly | grep + ast-grep |
| 8 | Every feature within 2 taps; Marketplace + Games visible in nav | Manual audit, logged every Audit-Hot cycle |
| 9 | One directional language across all non-prototype surfaces | DESIGN-DIRECTION.md compliance check |
| 10 | ≥ 1 meaningful improvement per cycle, ≥ 80% of cycles green build | Cycle-log tally |
