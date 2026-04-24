# Design Direction — LoreVault

_Last updated: 2026-04-24T20:10:00Z (cycle 7)_
_Status: IN PROGRESS — moodboard and card grid aligned; nav compliance pending._

## Chosen Direction

**Dark Collectible Card Game — Literary Edition**

A high-contrast, deep-dark aesthetic that foregrounds illustrated art and lore text. Inspired by premium TCG (trading card game) design: dark card faces, metallic accents, rich typography. Each set has its own tonal palette derived from its source mythology/genre.

## Per-Set Palette

| Set | Primary Dark | Accent | Mood |
|---|---|---|---|
| Baker Street Files | `#1a1a2e` → `#16213e` | Amber/sepia | Victorian gaslight |
| The Enchanted Kingdom | `#1a0a2e` → `#0a0618` | Rose/gold | Fairy-tale twilight |
| Wonderland Descending | `#0a2e1a` → `#061a10` | Teal/violet | Absurdist dream |
| The Castle of Otranto | `#1a0606` → `#0d0404` | Crimson/bone | Gothic horror |
| Olympus Rising | `#0a1a2e` → `#06101a` | Gold/marble | Classical epic |
| Asgard Unleashed | `#0d1a2e` → `#060d1a` | Steel/rune-gold | Norse mythic |

## Typography Direction
- Headings: serif (existing), high contrast on dark ground
- Body: tight tracking, subdued luminance
- Lore text: italic, slightly muted — atmosphere over legibility

## Approved Motion
- Card hover: subtle lift + glow edge (set-accent color)
- Page transitions: none — instant, clean

## NOT-List (from design audits)
- No pure white `#ffffff` on dark backgrounds (too harsh — prefer `#f0f0e8`)
- No generic gradients as primary art — always secondary to imageUrl when available
- No rounded-rect cards with stock shadows — use the existing gradient-face approach

## Compliance Check (cycle 7)
- [x] Moodboard surface matches direction — set-accent glow on card image (border+shadow per set), accent-colored style label, off-white #f0f0e8 text + CTAs (cycle 7)
- [x] Card surfaces match per-set palettes — per-set accent hover glow applied to BinderCard grid (cycle 6); gradient backgrounds already aligned with palettes from cycle 1
- [ ] Nav is within 2-tap reach for all main features
- [x] No pure-white text on dark bg — moodboard + results pages use #f0f0e8 (cycle 7)
