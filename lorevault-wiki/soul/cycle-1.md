# Soul Cycle 1 — All Visions — Audit the Bloat
Phase: 0
Version: v8.74

## What Changed
- No code changes — this is the inventory cycle
- Full audit written to `lorevault-wiki/soul/audit.md`

## The Numbers
| Metric | Count | Needed for Soul |
|--------|-------|----------------|
| Home sections | 19 | 1-3 |
| Routes | 27 | 3-5 per vision |
| Components | 49 | ~10 per vision |
| Store engagement loops | 36+ | 3-5 per vision |
| Lib modules | 17 | 2-3 per vision |
| Layout overlays | 5 | 0 |
| Bottom nav tabs | 5 | 0-1 |

## Frigga Insight Applied
Key finding: The optimal number of actions visible to a first-time user in the first 60 seconds is **1, maximum 2**. Pokemon TCG Pocket hid deck-building behind Day 3, removed trading entirely, and surfaced only pack-opening in the first session — reaching 30M downloads in 72 hours. Duolingo's retention jumped from 15% to 26% at Day 7 after collapsing onboarding to a single question + one lesson before showing any navigation. Google+ died with 500M accounts and <1% DAU because it launched with 6 features competing for attention on the first screen.

The pattern: **strip to the first dopamine hit. Lock everything behind a gate that requires the user to have already felt something.**

## The One Question
Does this prototype make someone feel [any emotion]? **No — the current product makes someone feel overwhelmed.** 19 sections, 8 progress bars, and no single verb. A first-time user sees a feature museum, not a product.

## Next
Cycle 2: Create the stripped prototype shell — minimal layout, 3 routes, shared components. The subtraction begins.
