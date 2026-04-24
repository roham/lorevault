# Cycle 6 — Design-Pass

**Track:** Design-Pass  
**Why selected:** D1=4/10, D2=4/10, D3=3/10 — three dimensions below the 6/10 threshold. D9 (Design coherence) is pending/"?". Applying the approved design direction to the card surface to close D9 and improve D1.  
**OpenAI cost this cycle:** $0  
**Cycle started:** 2026-04-24T16:53:52Z

## What to do

1. Add per-set accent hover glow to `BinderCard.tsx` — the approved DESIGN-DIRECTION.md calls for "Card hover: subtle lift + glow edge (set-accent color)" but current implementation only has scarcity-based glow. The six sets each have a defined accent in DESIGN-DIRECTION.md.
2. Wire via CSS custom property `--sa` (set-accent RGBA) set on `.binder-card[data-set="..."]`, consumed by a new `.set-accent-ring` overlay div using inset box-shadow.
3. Change is purely additive — does not touch scarcity glow, does not touch CardItem.tsx for now.
4. Verify build passes, update EVALUATION-RUBRIC.md, deploy.

## Execution log

- Added `data-set={card.setSlug}` attribute to `.binder-card` outer wrapper in `BinderCard.tsx`
- Added `.set-accent-ring` overlay div with CSS inset box-shadow driven by `--sa` CSS custom property
- Added per-set `--sa` rules in `globals.css` for all 6 sets (amber/rose/teal/crimson/gold/steel)
- Added `.binder-card:hover .set-accent-ring { opacity: 1 }` for smooth 0.28s transition
- `npm run build` → green, all routes static/dynamic as expected
- Updated EVALUATION-RUBRIC.md D9: ? → 6/10
- Updated DESIGN-DIRECTION.md compliance: card palette ✓

**Build:** green  
**OpenAI spend this cycle:** $0  
**Cumulative today:** $9.69

---

WHAT: Per-set accent hover glow added to card grid — Baker Street glows amber, Wonderland teal, Gothic crimson, Olympus gold, Asgard steel on hover.  
WHY: DESIGN-DIRECTION.md mandates set-accent card hover color; was unimplemented; D9 scored pending/?.  
PROOF: `src/components/BinderCard.tsx` line 28 (`data-set` attr) + `src/app/globals.css` (`.set-accent-ring` + per-set `--sa` rules)  
NEXT: D3 (Coverage=3/10) is the weakest confirmed score — if no new votes arrive, Art-Explore will generate 8 new epic/wild variants in untried cells to push toward 400 manifest items.
