# Moodboard — Share URL

**URL**: https://lorevault-site.vercel.app/moodboard?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl

**Admin / results**: https://lorevault-site.vercel.app/moodboard/results?k=km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl

**Token**: `km8xjrr-njRgfk9XOfnEvSvBB7wP4iYl`
- Rotate by running `npx vercel env add MOODBOARD_TOKEN` (set for `production`, `preview`, `development`); bounce the deployment.

**Keyboard shortcuts**
- `Y` — approve
- `N` — disapprove
- `O` — open comment box
- `←` — undo last vote
- `→` — skip without voting

**State**
- Progress is saved in `localStorage` per-device (keyed by a random voter hash) — refresh doesn't lose you.
- Votes also POST to Vercel KV for durable aggregation (see `/moodboard/results?k=…`).
- The Taste Daemon reads KV votes at the top of every cycle to update the taste model and narrow art generation.

**First-night experience**
- Before the daemon has seeded any art, the page shows a "Seeding the mood-board" screen. Refresh in 10–15 minutes after the daemon boots.
