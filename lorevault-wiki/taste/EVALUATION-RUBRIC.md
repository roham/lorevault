# Evaluation Rubric — LoreVault Taste Daemon

_Last scored: 2026-04-24T08:13:07Z (cycle 1, Art-Seed)_

Target by cycle 200: every dimension ≥ 7.

| # | Dimension | Score | Notes | Last Updated |
|---|---|---|---|---|
| 1 | Art system quality | 0/10 | No real art on card surfaces yet; all emoji+gradient | cycle-1 |
| 2 | Taste-model approval | N/A | No votes yet | cycle-1 |
| 3 | Coverage | 1/10 | 57 items in manifest (need ≥ 400; ~14% of target) | cycle-1 |
| 4 | Build health | 9/10 | Green build, lint pending | cycle-1 |
| 5 | Lighthouse mobile | ? | Pending audit | cycle-1 |
| 6 | Route coverage | ? | Pending Playwright walk | cycle-1 |
| 7 | Best-practice hygiene | ? | Pending grep/lint | cycle-1 |
| 8 | IA clarity | ? | Pending manual audit | cycle-1 |
| 9 | Design coherence | ? | Pending DESIGN-DIRECTION.md review | cycle-1 |
| 10 | Cycle efficiency | 8/10 | Cycle 1: green build, 11 new images; 6 moderation blocks noted (Snow White + Evil Queen pixel styles) | cycle-1 |

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
