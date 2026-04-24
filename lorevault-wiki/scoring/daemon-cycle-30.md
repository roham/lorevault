# Daemon Cycle 30 — DIRECTIVE-021: Weekly Events + D7 Engagement Depth

- **Commit**: 0fe77da
- **Version**: v8.41
- **Date**: 2026-04-14

## Collectibility Score

**Before**: 100/100 → **After**: 100/100 (maintained)

## Growth Score

| Dimension | Before | After | Delta | Justification |
|---|---|---|---|---|
| D1 Retention | 9 | 9 | 0 | No new daily mechanics; existing daily hooks are strong |
| D7 Retention | 8 | 10 | +2 | 7-day challenge chain creates a sequential week-long commitment — missing a day breaks the chain. Featured set event with 2x XP creates weekly urgency with countdown timer. Combined with D019 weekly challenges, three independent 7-day engagement loops now exist. |
| D30 Retention | 8 | 8 | 0 | No new monthly mechanics |
| Viral Coefficient | 8 | 9 | +1 | Post-achievement invite prompts surface referral links at peak emotional moments (battle win, high trivia score). Enhanced visual share formatting with emojis and stats makes shares more compelling on Twitter. |
| Conversion | 9 | 9 | 0 | No new conversion mechanics |
| **Growth Total** | **42/50** | **45/50** | **+3** | |

## What shipped

1. **Featured Set Event** — Weekly rotating set spotlight with 2x XP multiplier. Deterministic hash-based rotation through all 6 sets on a 6-week cycle. Countdown timer showing days/hours until next Monday reset. Event badge system for completing the featured set during its event week.
2. **7-Day Challenge Chain** — Sequential daily challenges building across the week: Day 1 (open packs) → Day 2 (win battle) → Day 3 (collect cards) → Day 4 (forge) → Day 5 (trivia) → Day 6 (earn XP) → Day 7 (claim all daily rewards). Each day requires the previous day to be completed. Completing all 7 grants a rare card + 500 XP + "Weekly Warrior" badge. Weekly reset with ISO 8601 week key.
3. **Enhanced Game Result Sharing** — Battle results now show emoji-formatted result cards (🏆 VICTORY, ⭐ star rating, difficulty icon). Trivia results show point total with streak info and star rating.
4. **Post-Achievement Invite Prompts** — After battle victories and trivia scores >2000, a subtle "Invite a friend to LoreVault" prompt appears with clipboard referral link. Surfaced at moments of peak engagement, not forced.

Score: 100/100 (collectibility maintained). Growth Score: 42→45/50. D7 retention hit 10 — three independent 7-day engagement loops (weekly challenges, challenge chain, featured set event).

## Remaining Growth Gaps

- **D1 Retention (9→10)**: Morning notification toast, smart adaptive CTA
- **D30 Retention (8→10)**: Monthly leaderboard, month-end FOMO, final sprint XP multiplier
- **Conversion (9→10)**: Smart CTA, A/B test welcome flow
- **Viral Coefficient (9→10)**: Collection comparison, social challenges
