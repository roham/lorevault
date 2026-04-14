# Daemon Cycle 29 — DIRECTIVE-020: Onboarding Funnel + Conversion Optimization

- **Commit**: 1099dd1
- **Version**: v8.40
- **Date**: 2026-04-14

## Collectibility Score

**Before**: 100/100 → **After**: 100/100 (maintained)

## Growth Score

| Dimension | Before | After | Delta | Justification |
|---|---|---|---|---|
| D1 Retention | 8 | 9 | +1 | Welcome-back modal re-engages lapsed users on return visit with free pack reward, converting return visits into active sessions |
| D7 Retention | 8 | 8 | 0 | No new weekly mechanics beyond D019 |
| D30 Retention | 8 | 8 | 0 | No new monthly mechanics beyond D019 |
| Viral Coefficient | 8 | 8 | 0 | Referral landing stores code but no new sharing surfaces |
| Conversion | 7 | 9 | +2 | 3-step interactive tutorial replaces flat welcome screen — set choice creates ownership before first pack. Referral landing with social proof ("A friend invited you") converts shared link traffic. Set collection progress strip on home page shows completion gaps driving re-engagement with packs. Discovery personalization anchors new users in familiar sets. |
| **Growth Total** | **39/50** | **42/50** | **+3** | |

## What shipped

1. **Interactive Welcome Tutorial** — 3-step onboarding flow: intro (floating pack visual + "Begin Your Journey" CTA), choose-your-world (pick from 3 starter sets), ready (stats summary + "Open Your First Pack" gradient CTA). Grants 3 starter pack credits. AnimatePresence transitions between steps.
2. **Welcome Back Modal** — Full-screen modal appears after 3+ day absence, session-gated via sessionStorage. Offers 1 free pack credit on claim. Dismissible via backdrop tap or "Later" button.
3. **Referral Landing** — `?ref=` URL parameter stores referrer code in localStorage (`lorevault_referred_by`). Shows "A friend invited you" banner on home page. Welcome page shows "A friend sent you here — 3 free packs included" for referred users.
4. **Set Collection Progress Strip** — Horizontal scroll of all 6 sets on home page showing per-set icon, name, unique character count (e.g., "12/20 chars"), and progress bar. Links to /collection/sets.
5. **D019 Fixes** — Wired `addPassXP()` into `addCollectorXP()` (pass XP was permanently 0). Fixed UTC→local time for monthly pass and weekly challenge keys. Fixed ISO 8601 week calculation. Fixed `currentTier` persistence on non-reset path.

Score: 100/100 (collectibility maintained). Growth Score: 39→42/50. Conversion jumped from 7 to 9 — interactive tutorial + referral landing are the primary conversion drivers.

## Remaining Growth Gaps

- **D1 Retention (9)**: Push to 10 with push notifications or reminder system
- **D7 Retention (8)**: Need 7-day exclusive content drops or limited-time events
- **D30 Retention (8)**: Monthly pass is strong but needs more aspirational tier 25-30 rewards
- **Viral Coefficient (8)**: Challenge/battle sharing, in-app invite prompts
- **Conversion (9)**: A/B test welcome flow, optimize CTA copy, add loading-state skeletons
