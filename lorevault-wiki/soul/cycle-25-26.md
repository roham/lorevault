# Soul Cycles 25-26 — Convergence: C→B Hybrid

Phase: 5
Version: v8.89

## Cycle 25: Build the C→B Hybrid

**The architecture**: Battle earns cards → cards fill binder sets. One verb (battle), one scoreboard (the binder).

### What Changed
- **Import SETS data**: Play prototype now has access to set metadata (names, icons, progress counts)
- **Set-aware AI**: `pickAICards()` now prefers cards from sets the player is actively collecting (has 1+ cards in). Wins feel relevant to set progress.
- **Battle-result set progress**: After winning, the reward card shows its set membership with icon + name + animated progress bar. The bar animates from previous count to new count (the "sticker into album" moment).
- **Collection phase → Mini-binder**: The "View your trophies" screen now shows cards grouped by set with progress bars. Each set shows icon, name, owned/total count, progress bar, and thumbnail grid of owned cards.

### Design Decision
Frigga's convergence research was clear: C→B is the cleanest hybrid because set-completion is a *passive scoreboard*, not a second game. The binder fills regardless of acquisition method, and filling a slot is the same emotional register as winning a battle. This is the Pokemon TCG Pocket pattern — pack opening AND wonder pick both feed the same dex.

The key constraint: the binder is visible *after* the battle, never *during*. The game loop stays pure. The set progress on the battle-result screen is a micro-signal (2-3 seconds of visibility), not a navigation destination.

## Cycle 26: Aha-Moment Surgery

**The target**: Card reveal must communicate three things in under 3 seconds: (1) rarity, (2) set membership, (3) gap-fill status.

### What Changed
- **Gap-fill signal**: "New card!" badge with green accent appears when the earned card is unique (not a duplicate). Uses spring animation with 0.8s delay — appears just after the card settles.
- **Three co-occurring signals**: The battle-result reward now shows:
  1. Rarity (scarcity badge on card, always present)
  2. Set membership (set icon + name + progress bar, 0.6s delay)
  3. Gap-fill status ("New card!" badge, 0.8s delay — only for first-time acquisitions)
- **Staggered reveal timing**: Card appears (0.3s) → character name (immediate) → gap-fill badge (0.8s) → set progress bar animates (1.0s). Total reveal: ~1.5 seconds. Under the 3-second target.
- **Duplicate detection**: Checks `earnedCards` array for duplicate IDs. If the card appears more than once, no "New card!" badge — the absence itself communicates "you had this one."

### Design Decision
Frigga research (from Vision B scoring cycle): "The 'sticker going into the album' moment doesn't exist" was the weakest point in Vision B. By embedding the three Aha signals directly into the battle reward screen, we solve the Aha-Moment deficit that plagued both A (4/10) and B (4/10). The player understands immediately: I won → I got a rare card → it's new to my collection → it progresses my Asgard set. Four facts communicated in 1.5 seconds.

## What Cycles 25-26 Target

| Dimension | Before | Target | Fix Applied |
|---|---|---|---|
| Aha-Moment Velocity | 7 | 8+ | 3 signals in 1.5s on reward reveal (Cycle 26) |
| Feature-to-Emotion Ratio | 5→7 (est.) | 7+ | Binder is same emotion as battle (Cycle 25) |
| Single-Verb Clarity | 7 | 7+ | Binder is passive scoreboard, not second verb (Cycle 25) |

## Next
Cycles 27-28: Re-score the hybrid with Odin-Soul. Polish weakest dimension.
Cycles 29-30: Final convergence recommendation.
