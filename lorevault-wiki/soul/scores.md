# Soul Scoring Harness

## The 7 Dimensions

Each scored 1-10. Threshold: any dimension below 5 = do not ship. Overall below 35/70 = no face found.

---

### 1. Single-Verb Clarity
*Can a stranger describe what this app does in one verb?*

| Score | Behavioral Anchor |
|-------|-------------------|
| 1-2 | User says "it does a bunch of stuff" or can't describe it at all |
| 3-4 | User needs two sentences and mentions multiple features |
| 5-6 | User can say it in one sentence but includes qualifiers ("it's like X but also Y") |
| 7-8 | User says "you [one verb] [one object]" — e.g., "you open packs" |
| 9-10 | The verb IS the brand. "It's the app where you [verb]." Instant recall |

### 2. First-Minute Emotion
*What does the user FEEL in the first 60 seconds? Is it one emotion or scattered?*

| Score | Behavioral Anchor |
|-------|-------------------|
| 1-2 | User feels confusion, overwhelm, or nothing. Sees a dashboard of options |
| 3-4 | User feels mild interest but is distracted by multiple competing elements |
| 5-6 | User feels one primary emotion but other elements dilute it |
| 7-8 | User feels one clear emotion amplified by the UI. Other emotions are suppressed |
| 9-10 | The emotion is visceral and immediate — anticipation, desire, fun. Like the Duolingo streak anxiety or Pokemon pack crinkle |

### 3. Progressive Disclosure
*How much is visible to a first-time user vs. earned through behavior?*

| Score | Behavioral Anchor |
|-------|-------------------|
| 1-2 | Everything visible on first load. 10+ actions, all equal weight |
| 3-4 | Some gating but still 7+ visible elements on first screen |
| 5-6 | 4-5 visible elements, some features gated behind progression |
| 7-8 | Max 3 visible actions on first load. New features reveal as behavior earns them |
| 9-10 | One action visible. Everything else locked behind the first interaction loop. Pokemon TCG Pocket: "open pack" → then options appear |

### 4. Attention Hierarchy
*Is there ONE dominant action on each screen, or a democracy of equal-weight elements?*

| Score | Behavioral Anchor |
|-------|-------------------|
| 1-2 | Screen is a grid of equal-sized cards/buttons with no focal point |
| 3-4 | 5+ CTAs competing, some larger than others but no clear winner |
| 5-6 | One primary CTA exists but is undermined by surrounding elements |
| 7-8 | One dominant action (60%+ visual weight), 1-2 supporting elements, rest recessive |
| 9-10 | The primary action IS the screen. Everything else is background. Like Wordle's letter grid |

### 5. Aha-Moment Velocity
*How fast does the user "get it"? When do they understand the value proposition?*

| Score | Behavioral Anchor |
|-------|-------------------|
| 1-2 | User still doesn't "get it" after 5+ pages. Needs explanation |
| 3-4 | User understands after 3-5 minutes of exploration |
| 5-6 | User gets it in 2-3 interactions |
| 7-8 | User gets it in the first interaction loop — under 90 seconds |
| 9-10 | User gets it BEFORE their first action. The value is obvious from the first screen. Wordle: one glance tells you everything |

### 6. Feature-to-Emotion Ratio
*Do all visible features serve the same core emotion, or do they scatter attention?*

| Score | Behavioral Anchor |
|-------|-------------------|
| 1-2 | 50+ features, 5+ different emotional registers (fun, anxiety, pride, competition, learning) |
| 3-4 | 20+ features, 2-3 emotions competing |
| 5-6 | 10-15 features, one dominant emotion but outliers exist |
| 7-8 | 5-8 features all clearly serving one emotional arc |
| 9-10 | Every visible element — color, animation, copy, layout — amplifies one emotion. Nothing is neutral. Nothing contradicts |

### 7. Mobile-First Coherence
*Does this work on a 375px viewport with thumb navigation?*

| Score | Behavioral Anchor |
|-------|-------------------|
| 1-2 | Broken layout, horizontal overflow, tiny tap targets, unreadable text |
| 3-4 | Functional but cramped. Needs pinch-zoom or landscape mode |
| 5-6 | Works but feels like a shrunk desktop app. Scrolling-heavy, not thumb-optimized |
| 7-8 | Designed for mobile. Thumb-reachable primary actions, comfortable spacing |
| 9-10 | Feels native. Swipe gestures, perfect spacing, nothing overflows. Could ship as an iOS app tomorrow |

---

## Score Tracking

### Vision A: "Discover the Story" (Story-First)

| Cycle | Single-Verb | First-Minute | Progressive Disclosure | Attention Hierarchy | Aha-Moment | Feature:Emotion | Mobile | Total |
|-------|:-----------:|:------------:|:---------------------:|:-------------------:|:----------:|:---------------:|:------:|:-----:|
| 12 | 5 | 6 | 7 | 5 | 4 | 6 | 7 | 40/70 |

### Vision B: "Chase the Set" (Set-Collector)

| Cycle | Single-Verb | First-Minute | Progressive Disclosure | Attention Hierarchy | Aha-Moment | Feature:Emotion | Mobile | Total |
|-------|:-----------:|:------------:|:---------------------:|:-------------------:|:----------:|:---------------:|:------:|:-----:|
| 17 | 6 | 5 | 5 | 6 | 4 | 7 | 6 | 39/70 |

### Vision C: "Play to Collect" (Game-First)

| Cycle | Single-Verb | First-Minute | Progressive Disclosure | Attention Hierarchy | Aha-Moment | Feature:Emotion | Mobile | Total |
|-------|:-----------:|:------------:|:---------------------:|:-------------------:|:----------:|:---------------:|:------:|:-----:|
| 21 | 7 | 6 | 8 | 6 | 7 | 5 | 7 | 46/70 |
| 27 (C+B) | 7 | 7 | 8 | 7 | 8 | 7 | 7 | 51/70 |

---

## Scoring Protocol

1. **Scorer**: Odin-Soul (dispatched as background agent on scoring cycles)
2. **Input**: All source files for the prototype route being scored
3. **Output**: 7 scores with evidence and one recommended fix per dimension
4. **Anti-inflation rule**: Score what IS, not what COULD BE. A 5/10 means "adequate but unremarkable." Most early prototypes should score 3-5 on most dimensions. A 7+ means it genuinely works. **Self-scoring inflates ~2 points — budget for that correction.**
5. **Weakest dimension focus**: After each scoring, the next build cycle targets the single weakest dimension. Don't spread effort — concentrate.
6. **Score history**: Never delete old scores. The trajectory matters — are we improving?

## Key Behavioral Anchors (from research)

- **8/10 First-Minute Emotion** = unsolicited narration. If a user doesn't tell someone about their first minute, it's not an 8.
- **3/10 First-Minute Emotion** = user scans for a skip button and reaches home screen without knowing what to feel.
- **5/10 First-Minute Emotion** = one moment of genuine curiosity that passes quickly.
- **Apple editorial "10/10"** = "Would we be embarrassed showing this on stage?" Cultural specificity > feature completeness.
- **Pack satisfaction proxy** (Pokemon TCG Pocket) = post-reveal dwell time > 4 seconds = positive affect.
- **Core scoring question** = "Strip the branding — does the experience still feel intentional?"
