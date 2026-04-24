// Public Domain Baseball — Hit Chart Generation
// Deterministic chart generation from player stats.
// No randomness here — charts are pure functions of stats.

import {
  HitterStats,
  PitcherStats,
  HitChart,
  AtBatOutcome,
  SpeedRating,
  getSpeedRating,
} from './types';

/**
 * Generate a hitter's hit chart from their stats.
 *
 * Logic:
 * - OB determines total "good outcome" slots (OB - 5, clamped to 1-14)
 * - Power determines distribution of extra-base hits within good slots
 * - Speed affects triple eligibility
 * - Remaining slots are outs (strikeout, groundout, flyout)
 *
 * Chart design principles (from MLB Showdown):
 * - Roll 20 always = best possible outcome for the card type
 * - Roll 1 always = worst outcome (strikeout for hitters)
 * - Adjacent slots create near-miss tension
 */
export function generateHitterChart(stats: HitterStats): HitChart {
  const results: AtBatOutcome[] = new Array(20);
  const speed = getSpeedRating(stats.speed);

  // Calculate good outcome count: OB - 5, clamped to 1-14
  const goodSlots = Math.max(1, Math.min(14, stats.onBase - 5));

  // Distribute good outcomes based on Power
  // Power 0-5: mostly singles/walks
  // Power 6-12: mix of singles, doubles, some HR
  // Power 13-20: heavy extra-base, guaranteed HR

  // Home runs: Power / 7, at least 0, max 4
  const hrSlots = Math.min(4, Math.max(0, Math.floor(stats.power / 7)));

  // Triples: only if Speed A, max 1-2
  const tripleSlots = speed === 'A' ? Math.min(2, Math.max(0, Math.floor((stats.power - 5) / 8))) : 0;

  // Doubles: Power / 5 - hrSlots, at least 0, max 4
  const doubleSlots = Math.min(4, Math.max(0, Math.floor(stats.power / 5) - hrSlots));

  // Walks: 1-2 based on OB (high OB = more patient hitter)
  const walkSlots = stats.onBase >= 13 ? 2 : 1;

  // Singles: remaining good slots
  const singleSlots = Math.max(0, goodSlots - hrSlots - tripleSlots - doubleSlots - walkSlots);

  // Out slots: 20 - goodSlots
  const outSlots = 20 - goodSlots;

  // Distribute outs: mix of strikeouts, groundouts, flyouts
  const strikeoutSlots = Math.max(1, Math.floor(outSlots * 0.3));
  const groundoutSlots = Math.max(1, Math.floor(outSlots * 0.4));
  const flyoutSlots = Math.max(0, outSlots - strikeoutSlots - groundoutSlots);

  // Fill chart from roll 1 (worst) to roll 20 (best)
  let idx = 0;

  // Worst outcomes first (low rolls)
  for (let i = 0; i < strikeoutSlots && idx < 20; i++) results[idx++] = 'strikeout';
  for (let i = 0; i < groundoutSlots && idx < 20; i++) {
    results[idx++] = i === 0 ? 'groundout_dp' : 'groundout'; // first groundout has DP potential
  }
  for (let i = 0; i < flyoutSlots && idx < 20; i++) results[idx++] = 'flyout';

  // Good outcomes (high rolls)
  for (let i = 0; i < walkSlots && idx < 20; i++) results[idx++] = 'walk';
  for (let i = 0; i < singleSlots && idx < 20; i++) results[idx++] = 'single';
  for (let i = 0; i < doubleSlots && idx < 20; i++) results[idx++] = 'double';
  for (let i = 0; i < tripleSlots && idx < 20; i++) results[idx++] = 'triple';
  for (let i = 0; i < hrSlots && idx < 20; i++) results[idx++] = 'homerun';

  // Fill any remaining slots (rounding errors)
  while (idx < 20) results[idx++] = 'flyout';

  // Override: roll 20 is always the best outcome available
  if (hrSlots > 0) results[19] = 'homerun';
  else if (tripleSlots > 0) results[19] = 'triple';
  else if (doubleSlots > 0) results[19] = 'double';
  else results[19] = 'single';

  // Override: roll 1 is always strikeout for hitters
  results[0] = 'strikeout';

  return { results };
}

/**
 * Generate a pitcher's chart.
 *
 * Pitcher charts are heavily out-weighted.
 * Better pitchers have fewer hit outcomes on their chart.
 * When the pitcher controls the at-bat, the hitter is using the pitcher's chart.
 */
export function generatePitcherChart(stats: PitcherStats): HitChart {
  const results: AtBatOutcome[] = new Array(20);

  // Pitcher charts are mostly outs
  // Control determines how often this chart is used, not what's on it
  // But high-control pitchers get marginally better charts

  // Good outcomes for the batter (on pitcher's chart): 3-5 slots
  const batterGoodSlots = Math.max(3, Math.min(5, 7 - stats.control));

  // Distribute: 1 walk, rest singles, maybe 1 double on bad pitchers
  const walkSlots = 1;
  const doubleSlots = stats.control <= 2 ? 1 : 0;
  const singleSlots = Math.max(0, batterGoodSlots - walkSlots - doubleSlots);

  // Out distribution
  const outSlots = 20 - batterGoodSlots;
  const strikeoutSlots = Math.max(2, Math.floor(outSlots * 0.35));
  const groundoutDPSlots = Math.max(1, Math.floor(outSlots * 0.15));
  const groundoutSlots = Math.max(1, Math.floor(outSlots * 0.25));
  const flyoutSlots = Math.max(0, outSlots - strikeoutSlots - groundoutDPSlots - groundoutSlots);

  // Fill chart
  let idx = 0;
  for (let i = 0; i < strikeoutSlots && idx < 20; i++) results[idx++] = 'strikeout';
  for (let i = 0; i < groundoutDPSlots && idx < 20; i++) results[idx++] = 'groundout_dp';
  for (let i = 0; i < groundoutSlots && idx < 20; i++) results[idx++] = 'groundout';
  for (let i = 0; i < flyoutSlots && idx < 20; i++) results[idx++] = 'flyout';
  for (let i = 0; i < walkSlots && idx < 20; i++) results[idx++] = 'walk';
  for (let i = 0; i < singleSlots && idx < 20; i++) results[idx++] = 'single';
  for (let i = 0; i < doubleSlots && idx < 20; i++) results[idx++] = 'double';

  // Fill remaining
  while (idx < 20) results[idx++] = 'flyout';

  // Override: roll 20 on pitcher chart = strikeout (dominant moment)
  results[19] = 'strikeout';
  // Override: roll 1 on pitcher chart = walk (worst for pitcher)
  results[0] = 'walk';

  return { results };
}

/**
 * Look up the outcome for a given roll on a chart.
 * Roll is 1-20, chart indices are 0-19.
 */
export function resolveChart(chart: HitChart, roll: number): AtBatOutcome {
  const idx = Math.max(0, Math.min(19, roll - 1));
  return chart.results[idx];
}
