# Cycle 5 Scoring: Deep Analytics Dashboard

**Tag:** v8.5
**Commit:** daemon(analytics): deep portfolio analytics — attribution, heatmap, trade optimizer

## What Shipped

### Analytics Data Layer (src/lib/analytics.ts)
- Portfolio snapshot: total value, 24h/7d/30d changes (absolute + percentage)
- Performance attribution: value change by set over 7d, top mover per set
- Diversification analysis: value % and card % per set
- Completion velocity: estimated days to complete each set, cost to finish, cheapest missing card
- Price heatmap: 7d change color-coded, volatility scoring (HIGH/STABLE/LOW based on coefficient of variation), below-30d-average flagging
- Duplicate analysis: detects multiple cards of same character, marks extras as tradeable
- Trade optimizer: matches duplicate sell revenue against cheapest missing cards for near-complete sets
- Portfolio time series: reconstructs historical portfolio value from individual card price histories

### Analytics Page (src/app/collection/analytics/page.tsx) — Complete Rewrite

**Panel 1: Portfolio Value Hero**
- Large monospace value with 24h change (green/red)
- Time range toggle (7d/30d/90d)
- Full-width area chart with grid lines, gradient fill
- Quick stats row: cards, avg value, 30d change

**Panel 2: Performance Attribution**
- Horizontal bar chart per set (green positive, red negative)
- Dollar amounts with +/- signs
- Top movers by set section below

**Panel 3: Diversification + Completion Velocity (side-by-side)**
- Radar chart with 5-axis set distribution
- Value % breakdown per set
- Progress bars per set with estimated days to complete
- Cost to finish + cheapest missing card with link

**Panel 4: Market Intelligence — Price Heatmap**
- Grid of owned cards, background color-coded by 7d change intensity
- Volatility badges (HIGH/STABLE/LOW)
- "Below 30d avg" flags for buy signals
- Sortable by change/value/volatility

**Panel 5: Trade Optimizer**
- Tradeable duplicates list with scarcity badges and prices
- Smart trade recommendations: "Sell X duplicates -> Buy Y missing card = complete Z set"
- Net profit calculation per trade

### Visual Treatment
- Monospace font for all numbers
- Green-400/red-400 for positive/negative
- Thin gridlines at 4% opacity
- Section separators (title + line, not cards-in-cards)
- Bloomberg terminal feel: dense data, small text, thin borders

## Scoring

| Criterion | Score | Notes |
|-----------|-------|-------|
| Completeness | 10/10 | All 5 panels built. Exceeds spec with trade optimizer and portfolio time series. |
| Code Quality | 9/10 | Clean data layer separation. All computations memoized. SSR-safe. |
| Dark Premium Aesthetic | 9/10 | Bloomberg-grade density. Color-coded heatmap. Radar chart. |
| Build | PASS | npm run build clean |
