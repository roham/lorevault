# Daemon Build Cycle 18 — Interactive Lore Engine
Date: 2026-04-14
Directive: DIRECTIVE-008
Commit: 0fedc81

## What Was Built
**DIRECTIVE-008: Interactive Lore Engine**

Files added/changed:
- `src/data/lore-graph.ts` — 48 lore nodes (42 regular + 6 secret cross-set), typed graph with connections
- `src/app/codex/page.tsx` — Lore Codex page with node-graph visualization, tab filtering, completion bar
- `src/components/LoreFragment.tsx` — Card-level lore thread display for card detail pages
- `src/lib/achievements.ts` — 5 new lore achievements (Lore Seeker, Lore Scholar, Lore Master, Secret Thread, Grand Archivist). Total achievements now 33.
- `src/lib/store.ts` — 4 new store functions: `getUnlockedLoreNodes()`, `getCodexCompletionPercent()`, `getLoreNodesForCard()`, `isLoreNodeUnlocked()`
- `src/app/hall/page.tsx` — "Lore Codex" tab added to Hall of Valhalla leaderboard
- `src/data/leaderboard-seeds.ts` — `codexPercent` field added to phantom collectors
- `src/app/profile/page.tsx` — Codex link on profile page

Key features:
- **Lore Codex** (`/codex`): Node-graph visualization with staggered spring animations. 8 tabs (All, 6 sets, Secrets). Completion bar with animated fill. Locked/unlocked states with lock icons. Connection lines between nodes (solid active, dashed inactive). Click to reveal full lore text with connected-node navigation. Legend.
- **48 lore nodes**: 7 per set across 6 sets (42 regular), plus 6 secret cross-set nodes. Each node has ~100-200 words of original narrative text, icon, requiredCharacters[], and connections[]. Nodes unlock when the player owns ALL required characters.
- **Secret cross-set threads**: "The Great Detective vs The Monster" (Holmes+Dracula+Van Helsing), "Mirrors Between Worlds" (Evil Queen+Alice+Cheshire Cat), "Serpents Across Mythology" (Jormungandr+Medusa+The Hound), "The Price of Immortality" (Dorian Gray+Dracula+Odin), "Tricksters United" (Loki+Rumpelstiltskin+Cheshire Cat), "The Last Battle" (Thor+Achilles+Holmes+Alice). These require owning characters from 2-4 different sets.
- **LoreFragment component**: On card detail pages, shows which lore threads a character contributes to. Unlocked threads link to codex with preview text; locked threads show as opaque locked blocks with "Collect more characters to unlock."
- **5 new achievements**: Lore Seeker (1 node, common), Lore Scholar (10 nodes, uncommon), Lore Master (30 nodes, epic), Secret Thread (any secret, rare), Grand Archivist (all 48, legendary at 1%).
- **Hall integration**: New "Lore Codex" tab in leaderboard showing codex % alongside phantom collectors' randomized `codexPercent` (10-79%).

## Odin Post-Build Scores
| Dimension | Before | After | Delta | Rationale |
|-----------|--------|-------|-------|-----------|
| Scarcity Legibility | 9 | 9 | 0 | No new scarcity surfaces. The codex completion percentage creates a new legibility layer but it measures progress, not scarcity per se. Holds. |
| Instance Identity | 8 | 8 | 0 | Lore nodes are not per-instance features — they gate on character ownership, not specific card instances. No new identity differentiation at the card level. Holds. |
| Chase Tension | 8 | 9 | +1 | Secret cross-set threads create a new meta-chase: players need characters from 2-4 different sets to unlock them. "The Last Battle" requires Thor+Achilles+Holmes+Alice — four distinct sets. This creates cross-set purchasing motivation and makes pack selection strategic ("I need an Asgard character for the Serpents thread"). The LoreFragment on card detail pages shows locked threads, teasing what you're close to unlocking. The codex completion bar itself creates a chase-to-100% drive. |
| Discovery Surprise | 8 | 9 | +1 | The secret Codex tab and its 6 hidden cross-set nodes are genuine surprises. Players who accumulate characters across sets will suddenly see secret threads appear — a reward they didn't know they were working toward. The "???" labels on locked secret nodes create mystery. The narrative content itself is a discovery reward: clicking an unlocked node reveals 100-200 words of well-written, thematically rich text that recontextualizes the characters. |
| Social Proof | 8 | 8 | 0 | The Hall of Valhalla codex tab adds a competitive codex-completion leaderboard, but this is incremental on the existing leaderboard infrastructure. No new social mechanics. Holds. |
| Lore Depth | 6 | 9 | +3 | This was the primary target and it delivers massively. 48 nodes of original narrative content (~6,000+ words total), organized into a directed graph with connections between related threads. Each set has 7 thematically coherent nodes exploring different facets of its literary source material (e.g., Baker Street has "The Final Problem" requiring Holmes+Moriarty, Gothic Horror has "Duality of Man" requiring Jekyll+Hyde). The 6 secret cross-set threads draw thematic connections between mythologies — "Serpents Across Mythology" linking Jormungandr, Medusa, and the Hound of the Baskervilles through the universal serpent archetype. The writing quality is consistently high: thoughtful literary analysis that adds genuine intellectual value to the collection. The graph structure means lore is not just content but a system — nodes connect to each other, creating a web of meaning. The gating mechanic (own the right characters to unlock) ties lore directly to collection behavior. LoreFragment on card pages means every character is now also a key to narrative content. This transforms cards from collectible images into fragments of a larger story. The achievement progression (1/10/30/secret/all-48) provides a structured lore journey. A full +4 is withheld only because the lore is static (no evolving narratives, no player-contributed content, no seasonal lore expansions). |
| Temporal Weight | 8 | 8 | 0 | No new temporal mechanics in the lore system. Nodes unlock immediately when requirements are met — no time-gating, no seasonal lore. Holds. |
| Provenance | 7 | 7 | 0 | Lore is character-level, not instance-level. No new provenance depth. |
| Utility Loop | 7 | 8 | +1 | Cards now have a dual purpose: collectible items AND keys to lore content. Every card detail page now shows which lore threads that character contributes to via LoreFragment, creating a reason to revisit owned cards. The locked lore threads on cards create a "what do I still need?" loop that drives collection behavior. The codex itself is a browseable destination that adds a new engagement activity. The achievement chain (5 lore achievements) creates milestone rewards for codex exploration. This isn't a full utility system (cards don't DO anything mechanically different) but the lore-key function meaningfully expands what owning a card means. |
| Loss Aversion | 8 | 8 | 0 | No new loss mechanics. Lore nodes, once unlocked, stay unlocked. No decay or expiration. Holds. |

**Total: 80/100 -> 86/100 (+6)**

## Score Movement Summary
- **Lore Depth: 6 -> 9 (+3)** — Primary target hit. 48-node directed graph with ~6,000 words of original narrative, cross-set secret threads, character gating, and achievement progression. Largest single-dimension gain in the project so far.
- **Chase Tension: 8 -> 9 (+1)** — Secret cross-set threads create strategic cross-set acquisition motivation. LoreFragment on card pages teases locked content.
- **Discovery Surprise: 8 -> 9 (+1)** — Secret tab nodes that unlock unexpectedly when cross-set conditions are met. Original narrative content as a discovery reward.
- **Utility Loop: 7 -> 8 (+1)** — Cards now serve as lore keys. LoreFragment creates reason to revisit card pages. Codex adds a new engagement destination.

## Bugs & Issues Found

### Bug: Locked Node Hint Panel Is Dead Code (Codex Page)
**Severity: Medium (feature gap)**
In `codex/page.tsx`, `handleNodeClick` (line 87-95) only calls `setSelectedNode(node)` when `isUnlocked` is true. However, the "Locked Node Hint" panel at lines 324-347 conditionally renders on `selectedNode && !unlockedIds.has(selectedNode.id)` — a condition that can never be true because `selectedNode` is never set for locked nodes. The `getMissingCharacters()` function (lines 98-102) is also dead code as a result.

**Impact**: Clicking a locked node in the graph does nothing. The player never sees the "Collect these characters to unlock" hint with the specific missing character names highlighted in red. This removes a significant engagement touchpoint — knowing exactly which characters you need is what drives targeted pack purchasing. This was clearly intended functionality that's broken due to the early-return guard.

**Fix**: Remove the `if (isUnlocked)` guard from `handleNodeClick`, or add an `else` branch: `else { setSelectedNode(node); setRevealedNode(null); }`.

### Issue: Secret Nodes Have No Back-Connections From Regular Nodes
**Severity: Low (design choice, not a bug)**
Secret nodes connect to regular nodes (e.g., `secret-tricksters` connects to `as-trickster`, `ek-spinner`, `wl-cheshire`), but those regular nodes do not connect back to the secret node. This means when browsing the "Connected to" section of a regular unlocked node, you will never see a reference to secret threads. Discovery of secrets is limited to the dedicated "Secrets" tab or the "All" view.

This is likely intentional (secrets should be discovered, not signposted) but it means a player who never clicks the Secrets tab may never know secret threads exist — even if they have all the required characters unlocked.

### Issue: Phantom Collector codexPercent Range
**Severity: Low (balance)**
In `leaderboard-seeds.ts`, phantom collector `codexPercent` is `Math.floor(rand() * 70) + 10` — range 10-79%. Since the player starts at 0% codex and 48 nodes require significant collection investment, the player will rank last on the Codex tab until they've made substantial progress. Early-game this could feel discouraging rather than motivating. Consider seeding a few low-codex phantoms (2-8%) so new players don't always rank dead last.

### Issue: LoreFragment Links to /codex Without Node Focus
**Severity: Low (UX polish)**
When a player clicks an unlocked lore thread in LoreFragment (card detail page), it navigates to `/codex` via a plain Link. It does not scroll to or focus the relevant node. The player arrives at the Codex page but must manually find the node they clicked. A query parameter (e.g., `/codex?node=bs-great-detective`) with auto-selection would improve the flow.

### Issue: Connection Lines Duplicated
**Severity: Low (performance, cosmetic)**
Each connection line is drawn once from each end. If node A connects to node B AND node B connects to node A, the line is rendered twice (overlapping SVG lines). For 48 nodes with 2-3 connections each, this means roughly double the SVG elements needed. Not a performance issue at this scale but architecturally wasteful.

## Weakest Dimensions After D008
- **Provenance (7/10)**: No new depth in 8 directives. Journey timeline and origin badges exist but no trade history, no previous-owner tracking, no provenance storytelling.
- **Utility Loop (8/10)**: Improved but still passive — cards don't mechanically interact with systems beyond gating lore. No crafting, no staking, no burn mechanics.
- **Social Proof (8/10)**: Leaderboard and share card exist but no real-time social signals, no public profiles, no "recently unlocked" feed.

## Deploy Status
Pending verification.
