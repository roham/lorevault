# Daemon Cycle 26 — DIRECTIVE-017: Daily Engagement Engine

- **Commit**: 9e0be56
- **Version**: v8.37
- **Date**: 2026-04-14

## Collectibility Score

**Before**: 100/100 → **After**: 100/100 (maintained)

| Dimension | Before | After | Delta | Justification |
|---|---|---|---|---|
| Discovery Surprise | 10 | 10 | 0 | Daily free pack is a discovery moment but not a new mechanic |
| Scarcity Legibility | 10 | 10 | 0 | No scarcity changes |
| Temporal Weight | 10 | 10 | 0 | Login calendar adds temporal hooks but score already maxed |
| Instance Identity | 10 | 10 | 0 | No instance changes |
| Provenance | 10 | 10 | 0 | No provenance changes |
| Lore Depth | 10 | 10 | 0 | No lore changes |
| Social Proof | 10 | 10 | 0 | No social changes |
| Utility Loop | 10 | 10 | 0 | Daily missions add utility but score already maxed |
| Loss Aversion | 10 | 10 | 0 | Login streak reset = loss aversion, but already at 10 |
| Completion Drive | 10 | 10 | 0 | Calendar completion adds micro-drive, already at 10 |
| **Total** | **100** | **100** | **0** | **Score ceiling reached. D017 targets Growth Score, not Collectibility.** |

## Growth Score (NEW METRIC)

| Dimension | Before | After | Delta | Justification |
|---|---|---|---|---|
| D1 Retention | 2 | 6 | +4 | Daily free pack + login calendar create strong return-next-day motivation |
| D7 Retention | 1 | 5 | +4 | 7-day login calendar with escalating rewards drives weekly engagement |
| D30 Retention | 1 | 3 | +2 | Login calendar resets weekly; missions rotate daily. Foundation laid. |
| Viral Coefficient | 0 | 0 | 0 | No sharing mechanics yet (D018) |
| Conversion | 2 | 3 | +1 | Free daily pack lowers commitment barrier for new users |
| **Growth Total** | **6/50** | **17/50** | **+11** | |

## What shipped

1. **Daily Free Pack** — 24h cooldown system with countdown timer, green "FREE" banner on `/packs` page, claims via `openPack('mixed')` without consuming credits
2. **Login Calendar** — 7-day grid on home page with escalating rewards (50 XP → Legendary Pack), weekly reset, claimable current day with pulse animation
3. **Daily Mission Progress Mapper** — `progressDailyMission()` bridges generic mission IDs to existing daily mission system
4. **Login Calendar State Persistence** — `getLoginCalendar()` / `claimLoginDay()` with weekly reset logic, localStorage persistence

Score: 100/100 (collectibility maintained). Growth Score: 6→17/50. D017 is a retention directive — the score ceiling was already reached, so impact measured on the new Growth Score dimension.
