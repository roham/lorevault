# LoreVault V8 — Multi-Agent Orchestration Prompt

**Purpose**: One prompt → four parallel specialist agents → an interactive mood-board on the live site → the CEO taps Yes/No/Other on hundreds of art+style options → their feedback compiles into the definitive V8 build prompt.

**Input**: v7.6-merged (current live site). Art is emoji + CSS gradient. UI reads "AI-generated." IA buries Marketplace + Games. Features were chucked in without coherence during an auto-research build.

**End state**: A polished, coherent, surprise-and-delight-filled collectibles product with real AI-generated art that the CEO personally approved style-by-style.

---

## How To Run This

```bash
cd /path/to/lorevault       # repo: https://github.com/roham/lorevault
claude --dangerously-skip-permissions
# Paste this entire file as the first message.
```

Required environment:
- `OPENAI_API_KEY` — for gpt-image-1 art generation (use the latest OpenAI image model available; gpt-image-1 supports 1024×1024, 1024×1536, 1536×1024)
- `VERCEL_TOKEN` + `npx vercel` logged in — for mood-board deploy
- Playwright MCP available in the session (the `mcp__playwright__*` tools)
- `git` + `gh` authenticated to push to `roham/lorevault`

Context files to read before anything else:
- `AGENTS.md` — Next.js 16 caveats
- `DAEMON-PROMPT.md` — the v7 daemon prompt (context for what was already tried)
- `lorevault-wiki/research/MARKET-INTELLIGENCE-DOSSIER.md` — strategic context
- `lorevault-wiki/scoring/v7.5-marketplace.md` — last scoring snapshot
- `src/data/cards.ts` + `src/data/types.ts` — the 200-card data model (no `imageUrl` field exists yet; art today = `symbol` emoji + `gradientFrom/To`)

**CEO's four goals for this cycle:**
1. **Audit** current experience via Playwright + code-read. Expose incoherence, surface surprise-and-delight gaps, flag fandom affordances missing, list best-practice violations.
2. **Deep design pass.** The current UI is off-the-shelf Tailwind. Do better.
3. **Regenerate card art** using the latest OpenAI image model (not the low-quality text-to-image that produced the emoji/gradient placeholders). Hundreds of style variants per character.
4. **Interactive mood-board landing page** at `/moodboard` on the live site. Each screen shows one art+style variant. Three buttons: ✓ Yes (approved) / ✗ No (disapproved) / 💬 Other (free-text feedback). CEO clicks through; feedback compiles into the V8 build prompt.

---

## Execution Model

Spawn **4 parallel specialist agents** in Phase 1 (use the `Agent` / Task tool — send in a single message with 4 content blocks so they run concurrently). Each writes to its own output path. Phase 2 is sequential (build the mood-board on top of their artifacts). Phase 3 waits for CEO feedback. Phase 4 synthesizes the V8 build prompt.

Do **not** ask permission between phases. Proceed until Phase 4 completes or a hard rule is violated. If any agent hits a hard blocker (missing API key, git push denied), escalate once in one sentence, then stop gracefully.

---

## PHASE 1 — Parallel Intelligence (4 agents, concurrent)

### Agent A — Playwright Experience Audit

**Mission**: Walk the live site as a first-time user AND as a power user. Screenshot every state. Catalog every interaction. Find every seam where features feel disconnected. Note every moment where fandom/lore could surface but doesn't.

**Inputs you can trust**:
- Live URL: `https://lorevault-site.vercel.app`
- Local dev: `npm install && npm run dev` → `http://localhost:3000`
- 17 routes listed in `DAEMON-PROMPT.md` (pages section)

**What to do**:
1. Use `mcp__playwright__browser_navigate` to visit the live site at viewport 375×812 (iPhone) AND 1440×900 (desktop). Do BOTH viewports.
2. For each of the 17 routes, capture:
   - `browser_snapshot` for the default state
   - `browser_take_screenshot` for every distinct visual state (default, hover-on-card, modal-open, drawer-open, filter-active, first-visit onboarding, pack-opening sequence frame-by-frame)
   - `browser_console_messages` for errors/warnings
   - `browser_network_requests` for failed requests, slow loads, oversized bundles
3. For every interactive element on every page, click/tap/drag it and record the result. If it's broken or feels disconnected, flag it.
4. Write `lorevault-wiki/audit/EXPERIENCE-AUDIT.md` with:
   - **Coherence map**: which features feel integrated, which feel "chucked in"
   - **Surprise & delight inventory**: every micro-moment that delighted, every moment that should have
   - **Fandom affordance gaps**: places where lore/character depth could surface but the UI stays generic (e.g. no character-page deep-dive, no lore quote rotations on hover, no set-theming on detail pages)
   - **Interaction bugs**: dead clicks, broken transitions, layout breaks, accessibility failures
   - **Route-by-route table**: route, mobile verdict (1-5), desktop verdict (1-5), top 3 fixes
   - **Best-practice violations**: Web Vitals / Lighthouse notes, a11y (keyboard nav, focus states, contrast), SEO (sitemap, metadata)
   - Screenshot paths inline. Store images under `lorevault-wiki/audit/screenshots/`.
5. Produce a single **"the five things that hurt most"** list at the top — rank-ordered.

### Agent B — Code Coherence Audit

**Mission**: Read every source file. Find the incoherence from "chucking features together."

**What to do**:
1. Read everything in `src/` (pages, components, lib, data).
2. Produce `lorevault-wiki/audit/CODE-AUDIT.md` with:
   - **Dead code**: unused exports, orphaned components, unreachable branches
   - **Duplicate patterns**: three different card-rendering paths, five different modal styles, inconsistent state hooks
   - **State sprawl**: every localStorage key in use, which component owns what, collisions/leaks
   - **Next.js 16 conformance**: `params` Promise usage, server vs client component boundaries, new caching defaults, deprecated APIs still referenced
   - **Accessibility**: missing alt, bad color contrast, keyboard trap risk, non-semantic HTML
   - **Type/lint health**: `npm run build` clean? `npm run lint` clean? any `any` abuse?
   - **Bundle size red flags**: what's dragging in all of Framer Motion on a page that doesn't need it, etc.
   - **Refactor shortlist**: the 10 code changes that would most improve coherence without changing product scope
3. Do NOT refactor yet. Just catalog. The V8 prompt will sequence the fixes.

### Agent C — Deep Design Direction

**Mission**: Produce the design system that kills the "AI-generated" tell.

**What to do**:
1. Research 5+ world-class product design references (pick from: SSENSE, Grailed, Arc Browser, Linear, Vercel Design, Spotify Wrapped 2024, Gucci Vault, Apple Music, Nothing Phone, Figma Config site, Teenage Engineering, Are.na). For each, extract the ONE thing that makes it feel like a human designer obsessed over it.
2. Produce `lorevault-wiki/design/DESIGN-DIRECTION-V8.md` with:
   - **Four candidate directions** for LoreVault — each with a one-sentence thesis, a mood palette (3–5 reference images described), a type system proposal, a motion language, a composition principle. Examples of the SPACE to explore (pick four distinct ones, don't copy these):
     - "Occult library" — serif display + letterpress texture + candle-warm accent + slow fades
     - "Noir cinema" — film-grain backgrounds + Futura + deep black + sudden hard cuts
     - "Editorial magazine" — asymmetric grids + pull-quote drama + monochrome-with-one-color + print-style page turns
     - "Arcade hyperpop" — max-contrast gradient + heavy display sans + chromatic aberration + spring-heavy physics
     - "Tarot deck baroque" — gold-foil + deep jewel tones + ornamental borders + slow reveal
     - "Wunderkammer" — cabinet-of-curiosities + parchment + handwritten annotations + parallax dioramas
   - **Global design primitives**: type scale (real px values, not "text-xl"), color tokens (hex + contrast ratios), motion curves (cubic-bezier values), spacing scale, shadow system, grain/texture strategy
   - **IA proposal**: fix the 4-tab nav. Pick one of: (a) 5-tab with center-action "Open", (b) 3-tab + contextual, (c) hub-launcher home. Show wireframes as ASCII or drawn in Mermaid. Pick the winner and defend it in 3 bullets.
   - **Map direction → sets**: which direction best serves Sherlock vs Wonderland vs Gothic Horror vs Greek Myth vs Enchanted Kingdom? Can one system flex across all, or do per-set theme layers sit on top?
   - **The four most important "no's"**: what the design must NEVER do (e.g. "no evenly-spaced grids," "no rainbow color," "no bounce physics on primary content")

### Agent D — Collectible Art Style Exploration

**Mission**: Generate hundreds of art+style variants across public-domain characters. Feed the mood-board survey.

**What to do**:
1. Pick a representative cast of 20 characters across the 5 sets. Must include: Sherlock Holmes, Professor Moriarty, Dracula, Frankenstein's Monster, Dr. Jekyll/Mr. Hyde, Alice, The Cheshire Cat, The Mad Hatter, Snow White, The Evil Queen, Little Red Riding Hood, Zeus, Prometheus, Medusa, Winnie-the-Pooh, Peter Pan, Sleeping Beauty, The Phantom of the Opera, Dorian Gray, The White Rabbit. (Winnie-the-Pooh's 1926 Milne text is public domain in the US since 2022 — use the original Shepard-adjacent illustration era, NOT the Disney version.)
2. Define **20 distinct art styles** to explore across those characters. Pick a spread that spans the design space — do not bias toward safe. Suggested (pick 20, rename as you like):
   - Victorian steel engraving
   - 1930s noir film poster
   - Baroque oil painting (Caravaggio lighting)
   - Art Nouveau (Mucha-style ornamental)
   - Tarot card (Pamela Colman Smith lineage)
   - Japanese ink wash (sumi-e)
   - Chiaroscuro woodcut
   - Cel-shaded modern anime
   - 16-bit pixel art
   - Stained glass panel
   - Victorian botanical illustration
   - German expressionist woodblock
   - 1970s French comic (Moebius)
   - Art Deco travel poster
   - Silent-film-still grayscale
   - Golden-age illustration (Rackham / Dulac)
   - Cyberpunk neon-noir
   - Risograph 2-color print
   - Scrimshaw etching
   - Retro sci-fi pulp cover
3. For each character × style, generate **2–4 variants** via OpenAI's image API (model `gpt-image-1`; fall back to `dall-e-3` only if gpt-image-1 is unavailable on the account). Portrait orientation, 1024×1536.
4. Budget cap: **$40 total**. `gpt-image-1` at 1024×1536 high-fidelity is roughly $0.17 per image. Plan for ~200–240 images. If you hit $35 spent, stop generating.
5. Prompt template (tune per character+style, don't send it raw):
   ```
   Editorial illustration of {CHARACTER} in {SPECIFIC_MOMENT_FROM_cards.ts},
   {STYLE_DESCRIPTION}, portrait composition, single figure focus,
   no text or letters, no watermark, no frame, rich tonal depth,
   collectible card artwork aesthetic.
   ```
   For public-domain characters only — never use Disney trade dress, studio-specific character designs, or living celebrity likenesses. If OpenAI's safety system refuses a character (e.g. Winnie-the-Pooh when prompts drift Disney-adjacent), reword to emphasize the Milne/Shepard 1926 origin and adjust until it passes.
6. Save each image to `public/moodboard-art/{character-slug}/{style-slug}-{variant-N}.webp`. Convert to WebP (quality 85) before commit — keeps the repo from bloating.
7. Write `public/moodboard-art/manifest.json`:
   ```json
   {
     "generatedAt": "<ISO>",
     "model": "gpt-image-1",
     "totalImages": 234,
     "totalCostUsd": 39.78,
     "items": [
       { "id": "sh-001", "character": "Sherlock Holmes", "characterSlug": "sherlock-holmes",
         "set": "baker-street", "moment": "At 221B Baker Street",
         "style": "Victorian steel engraving", "styleSlug": "victorian-engraving",
         "variant": 1, "path": "/moodboard-art/sherlock-holmes/victorian-engraving-1.webp",
         "prompt": "<exact prompt sent>" }
     ]
   }
   ```
8. If any generation fails (content filter, rate limit, network), log it to `lorevault-wiki/design/art-generation-log.md` and continue.

Do not block on each other. All four agents read-only until they write their own outputs. No file ownership collisions.

---

## PHASE 2 — Build the Mood-Board Survey Page

Sequential — needs Agent D's manifest.

**Deploy target**: `/moodboard` route on the main LoreVault site (same Vercel project). Guarded by a simple query-string token `?k=<random>` so it's not publicly advertised, but CEO can share with anyone.

**Build**:

1. `src/app/moodboard/page.tsx` — client component:
   - Loads `manifest.json` (import at build time is fine — no runtime fetch needed).
   - Shuffles the items with a seeded RNG so the CEO sees a varied, non-clustered order.
   - Shows **one item at a time**, full-bleed on mobile, centered card on desktop. The image is the hero — 80%+ of the viewport. Image, character name (small caption), style label (smaller caption), set (tiny). Nothing else until the CEO votes.
   - Three sticky buttons at the bottom:
     - `✓ Yes` — approved (big green, primary)
     - `✗ No` — disapproved (muted, secondary)
     - `💬 Other` — opens an inline textarea + "Send" button
   - Keyboard shortcuts: `Y` / `N` / `O`. `←` undo last vote. `→` skip.
   - Progress bar: "132 of 234 • 56% • est 8 min left"
   - Persists local state in localStorage so a refresh doesn't lose progress.
   - POSTs every vote to `/api/moodboard-feedback` with `{ itemId, vote, comment, timestamp }`.
   - On last item: "Done. Thank you." + a link to `/moodboard/results`.

2. `src/app/api/moodboard-feedback/route.ts` — POST handler:
   - Writes to Vercel KV if `KV_REST_API_URL` is set, else appends to a GitHub Gist via PAT, else falls back to writing to an in-memory Map and logs a warning. The simplest reliable path: use **Vercel KV** (`@vercel/kv`) with a `moodboard:<itemId>` key storing an array of votes. Provision via `npx vercel link` + `npx vercel env add KV_REST_API_URL` at the end of Phase 2. If Vercel KV is unavailable, use a single-table Vercel Postgres or an Upstash Redis free tier.
   - No auth — rely on the query-string token. Rate-limit at 60 writes/min by IP via Edge middleware.

3. `src/app/moodboard/results/page.tsx` — admin view (same token):
   - Fetches from KV. Shows:
     - Progress: X/Y voted
     - Style leaderboard: each style's approval rate, sorted
     - Character leaderboard: which characters got strongest consensus
     - Rejected-with-reason: every "Other" comment grouped by style
     - "Approved set" download button → JSON of every ✓ item
     - "Compile V8 Prompt" button → triggers Phase 4 (or: the CEO runs it manually from Claude Code after admin view shows done)

4. Styling: apply Agent C's design direction to the mood-board itself. This is the first surface that lives the new design. Don't regress to Tailwind defaults.

5. `npm run build` must pass. Deploy: `git add -A && git commit -m "v7.7(moodboard): interactive art+style survey — phase 2" && git tag v7.7 && git push origin main --tags && npx vercel --yes --prod`.

6. Verify live: Playwright-visit the deployed URL with the token, vote once, confirm KV row exists, visit `/moodboard/results` and confirm the vote appears.

7. Drop the shareable URL at the top of `lorevault-wiki/feedback/MOODBOARD-LINK.md` with the token so the CEO can grab it from one place.

---

## PHASE 3 — CEO Feedback Collection

This phase has no agent work. Output to the user:

> **Mood-board is live at `<URL>?k=<TOKEN>`. 234 images across 20 characters × 20 styles. Tap Yes / No / Other on each. Est 15–25 minutes. Results compile into the V8 build prompt when you're done — run `/lorevault:compile-v8` or say "compile the mood-board" in this session.**

Stop and wait for an explicit user signal to proceed to Phase 4. Do not poll the results endpoint. The CEO tells you when they're done.

---

## PHASE 4 — Synthesize V8 Build Prompt

**Trigger**: user says "compile" / "done" / "ready for v8" / pastes the results JSON.

**What to do**:
1. `curl` the results endpoint (with token) or read the exported JSON.
2. Cluster the data:
   - **Per-style approval rate**. Keep any style at ≥70% approval. Drop any ≤30%. Mid-range: keep if the "Other" comments lean positive.
   - **Per-set style match**: for each of the 5 sets, pick the 2–3 styles with the highest approval rate among that set's characters. A set may inherit a different art direction than another — that's fine and in fact likely good.
   - **Character-specific wins**: any character × style combo that scored 100% wins a pin — that's a must-include in v8 regardless of style-level score.
   - **Negative signals**: read every "Other" comment. Extract the NOT-rules (things the CEO explicitly said they didn't want).
3. Write `V8-BUILD-PROMPT.md` at the repo root. Structure:
   - **Context** — reference audit + design docs
   - **Approved art direction per set** — styles chosen, with sample image paths from the approved pool
   - **Approved global design primitives** — pulled from Agent C's chosen direction
   - **Required refactors** — Agent B's shortlist, ranked by impact
   - **Required IA changes** — Agent A + Agent C consensus
   - **Art pipeline** — the `gpt-image-1` prompt template that worked best, with per-set variants
   - **Full V8 → V8.x build phase plan** — same format as DAEMON-PROMPT.md but grounded in the approved direction
   - **Hard "no" list** — compiled from Other comments
   - **Success metrics** — the same 10-dimension matrix from DAEMON-PROMPT.md, with targets for v8.0
4. Commit + push: `git add V8-BUILD-PROMPT.md lorevault-wiki/ && git commit -m "v8.0-prompt: synthesize CEO mood-board feedback" && git push`.
5. Output to user: a one-paragraph summary of what got approved, what got rejected, and the path to `V8-BUILD-PROMPT.md`. Then stop.

---

## Hard Rules

1. `npm run build` must pass before every commit. No exceptions.
2. Read `AGENTS.md` + `node_modules/next/dist/docs/` before using any Next.js 16 API you're unsure about.
3. Never break `https://lorevault-site.vercel.app/` (the home route and existing 17 routes must keep working).
4. Mobile-first 375×812 + desktop 1440×900. Every new surface tested at both.
5. No Lorem Ipsum, no placeholder text, no filler emoji. Real character names from `src/data/cards.ts`.
6. Public-domain characters only for art. No Disney/studio designs, no living celebrities.
7. Stay under $40 on OpenAI image generation. Log spend per batch.
8. No npm packages added without justification in the commit message.
9. Tag every deploy (`v7.7` for mood-board deploy; v8.0 comes AFTER the CEO-approved build prompt is executed — don't jump the gun).
10. If a hard blocker hits (missing API key, auth fail, Vercel limit), state it in one sentence and stop. Do not retry-spin forever.

---

## Output Artifacts (index)

| Path | Producer | Purpose |
|---|---|---|
| `lorevault-wiki/audit/EXPERIENCE-AUDIT.md` | Agent A | Live-site UX audit + screenshots |
| `lorevault-wiki/audit/screenshots/` | Agent A | All captured states |
| `lorevault-wiki/audit/CODE-AUDIT.md` | Agent B | Coherence + refactor shortlist |
| `lorevault-wiki/design/DESIGN-DIRECTION-V8.md` | Agent C | Design system + IA proposal |
| `lorevault-wiki/design/art-generation-log.md` | Agent D | Image-gen errors / retries / cost |
| `public/moodboard-art/**/*.webp` | Agent D | All generated art |
| `public/moodboard-art/manifest.json` | Agent D | Canonical list |
| `src/app/moodboard/page.tsx` | Phase 2 | Survey UI |
| `src/app/moodboard/results/page.tsx` | Phase 2 | Admin view |
| `src/app/api/moodboard-feedback/route.ts` | Phase 2 | Write endpoint |
| `lorevault-wiki/feedback/MOODBOARD-LINK.md` | Phase 2 | Shareable URL + token |
| `V8-BUILD-PROMPT.md` | Phase 4 | The real v8 prompt |

---

*Start with Phase 1. Spawn four agents in parallel. Do not wait between phases unless the protocol explicitly says to. Build the whole loop to completion.*
