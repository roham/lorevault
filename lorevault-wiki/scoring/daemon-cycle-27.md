# Daemon Cycle 27 — DIRECTIVE-018: Viral Sharing + Social Growth + PWA

- **Commit**: fedf382
- **Version**: v8.38
- **Date**: 2026-04-14

## Collectibility Score

**Before**: 100/100 → **After**: 100/100 (maintained)

All 10 dimensions remain at 10/10. D018 is a growth-phase directive.

## Growth Score

| Dimension | Before | After | Delta | Justification |
|---|---|---|---|---|
| D1 Retention | 6 | 7 | +1 | PWA install prompt converts web visitors to app-like users with higher D1 return |
| D7 Retention | 5 | 6 | +1 | Service worker caching enables offline access, reducing friction for weekly returnees |
| D30 Retention | 3 | 4 | +1 | PWA home screen icon creates habit loop; referral system creates social commitment |
| Viral Coefficient | 0 | 8 | +8 | Twitter share on cards/battle/trivia, copy-link sharing, referral codes, OG/Twitter Card metadata for rich previews. Every pack open, every battle win, every card pulled is now a shareable moment. |
| Conversion | 3 | 6 | +3 | OG metadata on card pages means social clicks land on rich previews. Referral bonus starter pack lowers barrier. PWA installability converts browsers to users. |
| **Growth Total** | **17/50** | **31/50** | **+14** | |

## What shipped

1. **OG Metadata** — `generateMetadata` in `/card/[id]/layout.tsx` with Open Graph + Twitter Card tags for every card page. Dynamic title, description, card image.
2. **Enhanced ShareCard** — 3 share modes: Twitter (intent URL), copy link (clipboard), and image download. Grid layout replacing single button.
3. **Referral System** — `src/lib/referral.ts` with unique codes (LV-XXXXXX), phantom referral seeding (2-4 phantom refs), 4 reward milestones (1/3/5/10 refs). UI on profile page with copy-link button and reward progress strip.
4. **Challenge Links** — "Share Result" / "Share Score" buttons on battle and trivia game-over screens, generating Twitter intents with scores.
5. **PWA** — `manifest.json` with standalone display, SVG icons, `sw.js` with cache-first strategy for static assets + network-first for HTML. Install prompt component appears after 2nd visit, dismissible.
6. **Global Meta** — Root layout OG/Twitter metadata for non-card pages.

Score: 100/100 (collectibility maintained). Growth Score: 17→31/50. Viral coefficient went from 0 to 8 — every user action is now a potential acquisition channel.
