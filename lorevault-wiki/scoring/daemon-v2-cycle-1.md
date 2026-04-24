# Daemon v2 — Cycle 1
Phase: 1
Date: 2026-04-14
Version: v8.44

## What Was Built
- `src/components/BinderCard.tsx` — new stripped-down card for binder/collection grid
  - Renders ONLY: card art, name, scarcity border, parallel effect, vignette, top accent line
  - NO: aging overlays, DNA overlay, origin badge, sealed overlay, vault overlay, ghost overlay, mutation halo, population data, corner accents
  - Uses `contain: layout style paint` + `will-change: transform` for CSS containment
- `DragGhostCard` export — ultra-minimal card for DragOverlay
  - Art + scarcity border only, no text overlays
  - Uses `contain: strict` (floating element, fixed size)
  - `dropAnimation={null}` eliminates drop-return animation overhead
- `src/app/collection/page.tsx` — replaced CardItem with BinderCard in SortableBinderCard, replaced full CardItem in DragOverlay with DragGhostCard

## Frigga Research Summary
- Confirmed `layout` prop on motion.div conflicts with @dnd-kit's transform system — fix coming in Cycle 2
- `contain: layout style paint` (not `strict`) for grid cards — strict breaks absolutely-positioned overlays
- `contain: strict` safe for DragOverlay ghost since it's a floating fixed-size element
- `dropAnimation={null}` eliminates second compositing transform
- Priority order: fix layout conflict → simplify DragOverlay (done) → CSS containment (partial) → TouchSensor → page transition

## Scores (Odin baseline — pre-optimization)
- Drag initiation: 3/10 (200ms delay + layout competing with dnd-kit)
- Drag smoothness: 4/10 (full CardItem in DragOverlay, no containment)
- Page swipe: 5/10 (x+opacity+scale, AnimatePresence mode="wait" blocks)
- Drop feedback: 5/10 (no snap visual, perceptible gap between overlay vanish and card appear)
- Mobile feel: 3/10 (200ms touch delay, no haptics, gesture conflicts)
- **Average: 4.0/10**

## Key Decisions
- BinderCard keeps parallel effects (silver/gold/holo/obsidian) — they're CSS-only and visually important for rarity at-a-glance
- Removed obsidian border pulse animation from BinderCard (was `animation: obsidian-pulse 4s`) — saves compositor work
- Added name bar to BinderCard (bottom gradient + name + character) — without it, cards lose identity in the binder
- DragGhostCard has 0.85 opacity and drop shadows for visual lift — these are cheap compositor operations

## Next Target
Cycle 2: Fix drag system — remove Framer Motion layout/whileHover/whileTap from SortableBinderCard, reduce TouchSensor delay, debounce localStorage writes

## Deploy URL
https://lorevault-site-46s5dcjxw-ros-projects-9a9bb0c9.vercel.app
