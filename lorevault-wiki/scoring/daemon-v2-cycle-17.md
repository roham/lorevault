# Daemon v2 — Cycle 17
Phase: 2
Date: 2026-04-14
Version: v8.60

## What Was Built
- **Pregame difficulty selector** — fullscreen overlay with 3 difficulty cards (Rookie/Veteran/Legend), each with distinct color gradient and flavor text. Player must choose before game starts.
- **10 themed AI team templates** — 3 per difficulty tier + 1 extra veteran. Each has a name, tagline, preferred pitcher, and preferred hitter list from a specific set:
  - Rookie: Wonderland Wanderers, Fairy Tale Misfits, Minor Monsters
  - Veteran: Enchanted Nine, Gothic Horrors, Baker Street Nine, Mad Court
  - Legend: The Olympians, Asgard's Chosen, The Mythic All-Stars
- **AI steal decision engine** — `getAIStealDecision()` evaluates runner speed, outs, inning, score differential, and difficulty to determine if AI should attempt a steal. Rookie rarely steals (25% with speed 16+), Veteran is situational (30-50%), Legend is aggressive (40-55% with out-based multipliers).
- **AI taunts** — `getAITaunt()` injects trash talk into the play log when AI hits HRs or strikes out the player. Rookie never taunts. Veteran is dry. Legend is sharp.
- **Difficulty badge** in scoreboard (color-coded: green/amber/red).
- **Optimized batting order** for Legend AI (best OB+speed at top), decent for Veteran (with noise), random for Rookie.
- **Optimal position assignment** for Legend AI (best defenders at premium positions: C, SS, 2B).

Files changed:
- `src/lib/baseball/ai.ts` — complete rewrite: templates, steal logic, taunts, optimized position/batting order
- `src/app/games/baseball/play/page.tsx` — pregame phase, difficulty state, AI auto-steal effect, taunt injection
- `src/app/games/baseball/page.tsx` — updated play description to mention difficulty

## Frigga Research Summary
- Steal probability thresholds: Rookie 35% base (we went 25%), Veteran 55% (we went 30-50% situational), Legend 65% with multipliers (we went 40-55% with out-based multipliers)
- Themed teams should encode win conditions, not just flavor — we implemented playstyle tags (power/speed/balanced/contact)
- AI difficulty = error injection rate, not stat inflation — Rookie uses random batting order + random positions, Legend optimizes both
- Taunts triggered 40% of the time to avoid annoyance

## Scores (Odin evaluation of pre-Cycle-17 state)
- Engine completeness: 7/10
- UI quality: 8/10
- Strategic depth: 5/10 (key gap — now improved with difficulty choice + AI steals)
- Visual polish: 7/10
- Fun factor: 6/10

## Post-Cycle-17 Estimated Scores
- Engine completeness: 7.5/10 (AI steal logic adds depth)
- UI quality: 8.5/10 (pregame screen, difficulty badge)
- Strategic depth: 7/10 (difficulty choice + AI personality + steal threat changes game feel)
- Visual polish: 7.5/10 (themed team names, difficulty colors)
- Fun factor: 7.5/10 (opponent has personality now, taunts add drama)

## Key Decisions
1. Used template-based AI instead of pure algorithmic generation — templates give themed personality while still respecting the 150-point budget constraint
2. AI steals trigger via useEffect watching for idle state during AI batting turns, with dedup key to prevent double-triggers
3. Taunts fire at 40% rate to avoid being annoying — less is more
4. Legend AI optimizes both batting order AND defensive positioning, making it meaningfully harder than Veteran without inflating stats
5. Kept the `generateAILineup()` API stable — callers just pass difficulty and get a themed roster back

## Next Target
Cycle 18: Visual polish — make it gorgeous. Diamond visualization, card art integration, ESPN-style scoreboard, dark luxury aesthetic.

## Deploy URL
https://lorevault-site-fpzwhq10r-ros-projects-9a9bb0c9.vercel.app
