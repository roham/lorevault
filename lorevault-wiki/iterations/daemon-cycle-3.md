# Daemon Cycle 3 — Home Page Research

**Sources studied:** Steam Library UI, Epic Games Store Launcher, FanDuel home screen patterns

## Key Findings

### Layout Asymmetry
- **Steam**: Large hero image (960x430px safe area) dominates the top. Logo overlaid on left or center. Content below is secondary — playtime, achievements, friends.
- **Epic**: 2026 rebuild prioritizes "responsive, fast load" over dense content. Current store uses featured game hero taking 60%+ of viewport height. Sidebar carousels for secondary content.
- **Pattern**: Hero occupies disproportionate screen real estate (40-60% of initial viewport). Nothing centered-and-balanced. One dominant visual element with supporting info beside or below.

### Type Hierarchy
- **Steam**: Game title as logo (not text), so visual rather than typographic. Metadata below in small, muted type.
- **Epic**: Section headers are small caps, muted. Game titles are large and bold. Prices use distinct weight/color.
- **Pattern**: Three-tier type scale. Section labels small + uppercase + muted. Content titles bold + large. Data/numbers monospace + compact.

### Content Density
- **Steam**: Library page is NOT dense. One hero per page. Drill-down model. Home page has ~3-4 large featured items, then categories.
- **FanDuel**: Dense but structured. Live games as horizontal scroll cards. Odds in monospace. Clear visual separation between browsing (above fold) and discovery (below).
- **Pattern**: Above fold = 1-2 large items max. Below fold = denser rows. Never >4 things fighting for attention simultaneously.

### CTA Placement
- **Epic**: "Get" / "Buy" button is prominent, high contrast, bottom-right of hero card. Single primary action.
- **FanDuel**: "Bet" CTAs embedded within each card. Primary CTA (most popular bet) is highlighted, others muted.
- **Pattern**: One obvious primary CTA per viewport. Secondary actions visible but visually subdued. Never two competing primary CTAs.

## Design Rules Applied to LoreVault Home

1. Hero = asymmetric. Featured card left (angled), level/streak/CTA right
2. Section headers = 11px uppercase muted, never bold
3. Numbers = monospace
4. One primary CTA above fold: "Open Packs"
5. Below fold: featured cards (large), daily challenge, season preview, trending
6. Remove: Quick Links grid, Active Missions list, Discover sets
