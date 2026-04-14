# Soul Cycle 2 — All Visions — Create the Stripped Shell
Phase: 0
Version: v8.75

## What Changed
### Added
- `src/app/prototype/layout.tsx` — Minimal prototype layout: 52px recessive top bar (opacity 0.55), safe-area-inset support, backdrop blur, no bottom nav, no overlays
- `src/app/prototype/page.tsx` — Vision hub: three cards linking to /prototype/story, /prototype/chase, /prototype/play
- `src/app/prototype/story/page.tsx` — Vision A placeholder
- `src/app/prototype/chase/page.tsx` — Vision B placeholder
- `src/app/prototype/play/page.tsx` — Vision C placeholder
- `src/components/MainChrome.tsx` — Wrapper that hides all global overlays (navigation, celebrations, FOMO, PWA, welcome) on /prototype routes
- `src/components/MainContent.tsx` — Wrapper that removes root padding on /prototype routes

### Modified
- `src/app/layout.tsx` — Replaced direct overlay/nav imports with MainChrome + MainContent wrappers

### Removed (from prototype view)
- Bottom navigation (5 tabs)
- UnlockCelebration overlay
- PrestigeCelebration overlay
- LivePulse ticker
- PWAInstall prompt
- WelcomeBack greeting
- 112px bottom padding
- 48px top padding

## Frigga Insight Applied
Key findings on minimal shells:
- **Pokemon TCG Pocket**: Zero persistent navigation in first 3 minutes. Only a close X button (40x40px) appears once interaction begins.
- **Duolingo**: First-lesson shell is 56px top bar with exactly 3 elements: X (close), progress bar, life count. No title, no app name.
- **Opacity as hierarchy**: Persistent controls at 0.4-0.6 opacity — they exist but don't demand attention. Applied: back button at 0.55 opacity, LOREVAULT wordmark at 0.4.
- **Three elements max in any shell**: exit, progress, one contextual action.

## The One Question
Does this prototype shell get out of the way? **Yes.** The prototype layout has one element (a recessive back arrow) and pure dark canvas. The content owns the viewport.

## Next
Cycle 3: Build the scoring harness (scores.md with 7-dimension matrix, tracking template).
