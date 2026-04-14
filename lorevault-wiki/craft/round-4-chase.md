# Craft Round 4 — Chase (Set-Collector)
Date: 2026-04-14
Version: v8.99

## Frigga Research Applied
### Visual: Pokemon TCG Pocket binder patterns
- Full-bleed hero banner with set art (PTCGP Genetic Apex pattern: art fills top 40%, set name overlaid)
- Segmented pip progress replacing generic bar (each pip = one card, visually communicates gaps)
- 3-column grid at ~30% viewport width per card (PTCGP uses 3 columns for premium feel)
- Empty slots with chromatic inner glow (violet/set-colored, not generic gray)

### UX: Collection binder focal point patterns
- Anti-pattern avoided: flat equal-weight grids with no hierarchy
- Hero banner + chase card create visual hierarchy before grid
- Card position numbers (#1, #2) in empty slots add specificity (PTCGP pattern)
- Back arrow with "Sets" label replacing text link (clearer navigation)

### Emotion: Collector desire psychology
- "YOUR CHASE" section implements the "one specific named obsession" pattern
- Ghost silhouette at 18% opacity = high-recognizability + low-resolution (near-miss psychology)
- Scarcity-colored glow + traveling shimmer = "this card exists, it's beautiful, you don't have it"
- Lock icon reinforces "present but unreachable" vs "absent"
- Segmented pips exploit Zeigarnik Effect (each empty pip = incomplete task)

## Odin-Critic Scores (pre-build)
| Dimension | Score |
|-----------|-------|
| Visual Craft (3x) | 7 |
| Emotional Hook (3x) | 7 |
| Clarity (2x) | 5 |
| Conversion (2x) | 5 |
| Mobile Experience (2x) | 5 |
| Delight (1x) | 6 |
| Narrative Coherence (1x) | 4 |
Composite: 58.6/100

## What Was Built
Single focused change: **Hero-led binder entry with chase card focal point**

Files modified: `src/app/prototype/chase/page.tsx` (+127 lines, -34 lines)

1. **Hero Banner (150px)**: Blurred set hero art background, large set name, 3xl/base asymmetric completion numerals, animated segmented progress pips
2. **Chase Card Section**: Rarest missing character displayed with ghost silhouette (18% opacity), scarcity-colored inner glow + traveling shimmer, lock icon, card name/moment/scarcity label
3. **Grid: 4→3 columns**: Larger cards, 3px gaps, more premium
4. **Empty Slot Treatment**: Chromatic inner glow (set-colored), 12% opacity ghosts (up from 8%), card position numbers

## Odin-Gate Scores (post-build)
| Dimension | Before | After | Delta |
|-----------|--------|-------|-------|
| Visual Craft (3x) | 7 | 8 | +1 |
| Emotional Hook (3x) | 7 | 8 | +1 |
| Clarity (2x) | 5 | 6 | +1 |
| Conversion (2x) | 5 | 6 | +1 |
| Mobile Experience (2x) | 5 | 5 | 0 |
| Delight (1x) | 6 | 7 | +1 |
| Narrative Coherence (1x) | 4 | 6 | +2 |
Composite: 58.6 → 67.9 (+9.3)

## Verdict: PASS

Odin-Gate notes:
- Hero banner genuine upgrade, blurred art + gradient scrim creates depth
- Chase card section is "textbook desire engineering" — ghost silhouette + scarcity glow
- Narrative coherence biggest relative gain: hero (context) → chase card (desire) → grid (progress) → pack (action)
- Mobile unchanged: 260px header before grid content is a concern for next round
- Chase card vanishes in finishing mode — missed opportunity for last 1-2 cards
