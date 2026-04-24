# Soul Cycle 11 — Vision A — Mobile Polish

Phase: 2
Version: v8.81

## What Changed
### Modified
- `src/app/prototype/story/page.tsx` — Mobile polish:
  - Safe area bottom padding on story map (`env(safe-area-inset-bottom)`)
  - Card silhouettes row now `flex-wrap` to prevent overflow on narrow screens
  - "Choose your path" button padded to 44px+ touch target (`py-3 px-6`)

- `src/app/prototype/story/chapter/[id]/page.tsx` — Mobile polish:
  - Safe area bottom padding on chapter reveal
  - Reduced horizontal padding from `px-8` to `px-6` for more text width on 375px
  - Reduced top padding from `pt-20` to `pt-16` — still atmospheric but less wasted space

- `src/app/prototype/story/pack/page.tsx` — Mobile polish:
  - Safe area bottom padding on summary phase
  - Reduced horizontal padding from `px-8` to `px-6` on summary
  - "Back to story map" link gets `py-2` for better touch target

### Design Decisions
- **env(safe-area-inset-bottom)**: All scrollable/bottom-content pages now respect the home indicator area on notched phones. Uses CSS env() with 0px fallback for non-notched devices.
- **flex-wrap on silhouettes**: While current data (max 3 characters per chapter) fits comfortably, wrapping prevents future breakage without visual cost.
- **44px minimum touch targets**: All interactive elements (buttons, links, back arrows) now meet iOS Human Interface Guidelines minimum of 44pt. The intro "Choose your path" was bare text — now has proper padding.
- **px-6 over px-8**: On 375px, px-8 = 64px total horizontal padding = 311px content. px-6 = 48px = 327px. The extra 16px is meaningful for text readability.

## Frigga Insight Applied
From mobile UX audit patterns:
- **Safe area violations are the #1 notched-phone complaint**: Content hidden behind the home indicator is perceived as "broken" not "stylistic". Always pad.
- **Touch target minimums are non-negotiable on mobile**: Sub-44px targets cause frustration and accidental taps. Text links without padding are the most common offender.
- **Horizontal padding sweet spot on 375px is 20-28px per side**: Under 20px feels cramped against the edge. Over 32px wastes too much of the precious width.

## The One Question
Does this polish serve the ONE emotion? **Yes, by not breaking it.** Mobile polish is invisible when done right — it removes friction that would interrupt the emotional flow. A clipped CTA behind the home indicator, a too-small "Choose your path" link, text squeezed into too-narrow columns — each is a micro-interruption to the curiosity → revelation loop.

## What's Missing
- Touch gesture support (swipe between worlds, swipe through card reveal)
- Scroll snap on story map for chapter-by-chapter browsing
- Reduced motion support for accessibility

## Next
Cycle 12: Score Vision A — dispatch Odin-Soul to evaluate all 7 soul dimensions.
