# Cycle 7 — 5-Tab Nav Rebuild (Multi-Agent)

## Frigga Research Summary
- iOS tab bar: 49pt + 34pt safe area. Android M3: 80dp. Current 72px is in spec.
- 5-tab at 375px: ~72px per tab with px-2 padding. Labels must be single words.
- Center FAB: 52-56dp circular, brand color, elevated 12dp above bar. No label needed.
- Active state: M3 pill indicator or filled icon + tint. Upgraded from dot to 3px bar.
- Profile avatar: 32-40dp circle, top-right. Level number as fallback for no photo.
- Pack badge on brand-colored FAB: white pill with dark text (not red-on-purple clash).
- DraftKings reference: 5-tab (Home | Live | Search | My Bets | Rewards), profile in top-right avatar.
- Pokemon TCG Pocket: pack opening as first-class tab, not buried in submenu.

## Odin Pre-Build Scores
| # | Dimension | Score |
|---|-----------|-------|
| 1 | Visual Craft | 6 |
| 2 | Navigation & IA | 3 |
| 3 | Activation Path | 5 |
| 4 | Progression & Status | 5 |
| 5 | In-Product Content | 4 |
| 6 | Analytics Depth | 3 |
| 7 | Marketplace | 4 |
| 8 | Collection Feel | 5 |
| 9 | Game Polish | 5 |
| 10 | Card Presentation | 6 |
| 11 | Typography & Layout | 6 |
| 12 | Mobile Experience | 4 |
| 13 | VIP & Rewards | 4 |
| 14 | Delight & Surprise | 5 |

## What Was Built
- **Navigation.tsx**: 4-tab → 5-tab (Home, Market, Open, Collection, Games)
- Removed: ProfileIcon, PlayIcon, AnimatePresence, floating Play pill
- Added: MarketIcon ($), GamesIcon (gamepad controller)
- Top bar: brand left, "Search cards..." tappable bar + profile avatar circle (level #) right
- Bottom nav: px-6 → px-2, h-68 → h-72, rounded-2xl → rounded-full (circular FAB)
- Active indicator: 1px dot → 8px wide x 3px tall accent bar
- Pack badge: red → white (contrast on brand FAB)
- Icons: 22px → 24px (M3 standard)
- **Layout.tsx**: pb-20 → pb-[76px]
- **DAEMON-PROMPT.md**: v2 → v3 (multi-agent Frigga+Odin iteration protocol)

## Odin Post-Build Scores
| # | Dimension | Was | Now | Delta |
|---|-----------|-----|-----|-------|
| 2 | Navigation & IA | 3 | 5 | +2 |
| 7 | Marketplace | 4 | 5 | +1 |
| 12 | Mobile Experience | 4 | 5 | +1 |
| 14 | Delight & Surprise | 5 | 5 | 0 |

**Composite: ~4.6 → ~4.9**

## Odin Critique
1. Search bar is a navigation shortcut, not real search. Users expecting inline results will bounce.
2. 5 tabs at 375px with px-2 is tight — needs real-device QA on SE-sized screens.
3. Profile avatar level number at 32px may be unreadable at double digits (10+).
4. No transition choreography for returning users who remember the old 4-tab layout.

## Next Cycle Target
Analytics Depth (3) is the coldest score. But daemon priority says cycle 8 = Collector's Guide / Codex.

## Preview URL
https://lorevault-site-3ypjtr24w-ros-projects-9a9bb0c9.vercel.app
