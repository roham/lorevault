# Craft Daemon State
Round: 2
Current prototype: all (all above 60 — ready for deploy)

## Scores (updated after every gate-pass)
| Prototype | Round | V | E | Cl | Co | M | D | N | Composite |
|-----------|-------|---|---|----|----|---|---|---|-----------|
| play      | 0     | 2 | 2 | 4  | 3  | 4 | 1 | 3 | 18        |
| story     | 0     | 2 | 3 | 3  | 3  | 4 | 2 | 4 | 20        |
| chase     | 0     | 2 | 2 | 3  | 2  | 4 | 1 | 3 | 17        |
| play      | 1     | 5 | 4 | 4  | 3  | 4 | 3 | 4 | 56        |
| story     | 1     | 5 | 5 | 4  | 4  | 4 | 4 | 5 | 63        |
| chase     | 1     | 5 | 4 | 4  | 4  | 4 | 4 | 3 | 58        |
| play      | 2     | 6 | 5 | 4  | 4  | 4 | 4 | 4 | 65        |
| story     | 2     | 6 | 5 | 4  | 4  | 4 | 5 | 5 | 67        |
| chase     | 2     | 6 | 5 | 4  | 5  | 4 | 5 | 3 | 67        |

## Round 1 Synopsis
- All three prototypes: emoji symbols replaced with actual card art images
- Shared `card-image.ts` utility with fallback chain (variant → base → hidden)
- Play: intro hero cards, battle card art, VS divider, scarcity labels, collection art
- Story: world selection hero triptychs, chapter thumbnails, locked card silhouettes
- Chase: set selection hero backgrounds, binder art, fanned pack art, opening burst, reveal art

## Round 2 Synopsis
- All three prototypes: atmospheric dark radial gradient backgrounds on every phase
- Play: victory glow burst, reward card flip+shimmer animation, larger reward display (w-48)
- Story: floating ambient card art on intro, world-colored gradient on story map
- Chase: ambient intro cards, set-colored pack phases, shimmer on reveal, spring "NEW" badge, celebration burst on summary
- All three crossed 60 threshold: play=65, story=67, chase=67

## Persona Validation (every 5 rounds)
| Prototype | Discoverer | Completionist | Competitor | Casual |
|-----------|-----------|---------------|-----------|--------|
| play      | N         | N             | N         | N      |
| story     | N         | N             | N         | N      |
| chase     | N         | N             | N         | N      |
