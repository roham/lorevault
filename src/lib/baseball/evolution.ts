// Public Domain Baseball — Card Evolution System
// XP-driven progression that modifies hit charts.
// Each tier upgrades 1 row on the d20 chart (5% probability shift).
// Max 3 rows modified at Legend tier = 15% chart redistribution.

import { HitChart, AtBatOutcome } from './types';

// ===== Evolution Tiers =====

export interface EvolutionTierDef {
  tier: number;
  name: string;
  xpRequired: number;
  label: string;        // short badge text
  borderColor: string;  // CSS color for card border
  glowColor: string;    // CSS color for glow effect
}

export const EVOLUTION_TIERS: EvolutionTierDef[] = [
  { tier: 0, name: 'Base',     xpRequired: 0,    label: '',        borderColor: 'transparent', glowColor: 'transparent' },
  { tier: 1, name: 'Seasoned', xpRequired: 250,  label: 'SEASONED', borderColor: '#cd7f32',     glowColor: 'rgba(205,127,50,0.3)' },
  { tier: 2, name: 'Veteran',  xpRequired: 750,  label: 'VETERAN',  borderColor: '#c0c0c0',     glowColor: 'rgba(192,192,192,0.3)' },
  { tier: 3, name: 'Legend',   xpRequired: 1800, label: 'LEGEND',   borderColor: '#ffd700',     glowColor: 'rgba(255,215,0,0.4)' },
];

// ===== Tier Lookup =====

/** Get the evolution tier number (0-3) for a given XP total. */
export function getEvolutionTier(totalXP: number): number {
  for (let i = EVOLUTION_TIERS.length - 1; i >= 0; i--) {
    if (totalXP >= EVOLUTION_TIERS[i].xpRequired) return i;
  }
  return 0;
}

/** Get full tier info for a given XP total. */
export function getEvolutionInfo(totalXP: number): EvolutionTierDef & {
  nextTier: EvolutionTierDef | null;
  xpToNext: number;
  progress: number; // 0-1 progress toward next tier
} {
  const tier = getEvolutionTier(totalXP);
  const def = EVOLUTION_TIERS[tier];
  const next = tier < 3 ? EVOLUTION_TIERS[tier + 1] : null;

  const xpToNext = next ? next.xpRequired - totalXP : 0;
  const rangeStart = def.xpRequired;
  const rangeEnd = next ? next.xpRequired : def.xpRequired;
  const progress = next
    ? Math.min(1, (totalXP - rangeStart) / (rangeEnd - rangeStart))
    : 1;

  return { ...def, nextTier: next, xpToNext, progress };
}

// ===== Chart Evolution =====

const OUT_TYPES: AtBatOutcome[] = ['strikeout', 'groundout', 'flyout', 'groundout_dp'];

/**
 * Apply evolution modifications to a base hitter chart.
 * Returns a new chart — does not mutate the input.
 *
 * Modifications per tier (cumulative):
 * - Tier 1 (Seasoned): Convert 1 out → single (+5% OBP)
 * - Tier 2 (Veteran):  Convert 1 groundout → walk (+5% OBP)
 * - Tier 3 (Legend):   Convert 1 out → single AND upgrade 1 single → double (+5% OBP, +5% XBH)
 *
 * Guard rails:
 * - Never remove the last strikeout row (minimum 1 strikeout)
 * - Maximum 3 total modifications regardless of tier
 * - Modifications target the highest-index out slots (closest to the hit boundary)
 *   for maximum narrative tension (the "almost got out" becoming a hit)
 */
export function evolveHitterChart(chart: HitChart, tier: number): HitChart {
  if (tier <= 0) return chart;

  const results = [...chart.results];

  // Tier 1: Convert 1 out → single
  if (tier >= 1) {
    const idx = findHighestOut(results, ['groundout', 'flyout', 'groundout_dp']);
    if (idx !== -1) results[idx] = 'single';
  }

  // Tier 2: Convert 1 groundout → walk
  if (tier >= 2) {
    const idx = findHighestOut(results, ['groundout', 'groundout_dp']);
    if (idx !== -1) results[idx] = 'walk';
  }

  // Tier 3: Convert 1 out → single AND upgrade 1 single → double
  if (tier >= 3) {
    const outIdx = findHighestOut(results, ['groundout', 'flyout', 'groundout_dp', 'strikeout'], 1);
    if (outIdx !== -1) results[outIdx] = 'single';

    // Upgrade lowest single to double (the one closest to the out boundary)
    const singleIdx = findLowestOfType(results, 'single');
    if (singleIdx !== -1) results[singleIdx] = 'double';
  }

  return { results };
}

/**
 * Find the highest-index slot matching one of the given out types.
 * Skips strikeout slots if that would leave 0 strikeouts (guard rail).
 * `minStrikeouts` = minimum strikeout slots to preserve.
 */
function findHighestOut(
  results: AtBatOutcome[],
  types: AtBatOutcome[],
  minStrikeouts: number = 1,
): number {
  // Count current strikeouts
  const strikeoutCount = results.filter(r => r === 'strikeout').length;

  for (let i = results.length - 1; i >= 0; i--) {
    if (!types.includes(results[i])) continue;
    // Guard: don't remove last strikeout
    if (results[i] === 'strikeout' && strikeoutCount <= minStrikeouts) continue;
    return i;
  }
  return -1;
}

/** Find the lowest-index slot of a given type. */
function findLowestOfType(results: AtBatOutcome[], type: AtBatOutcome): number {
  for (let i = 0; i < results.length; i++) {
    if (results[i] === type) return i;
  }
  return -1;
}

// ===== Pitcher Evolution =====
// Pitchers don't accumulate XP in the current system (only player hitters do).
// Placeholder for future expansion.

/**
 * Apply evolution to a pitcher chart. Currently a no-op since
 * pitchers don't earn XP, but structured for future use.
 */
export function evolvePitcherChart(chart: HitChart, tier: number): HitChart {
  if (tier <= 0) return chart;

  const results = [...chart.results];

  // Mirror hitter logic: each tier converts a hit row to an out
  // Tier 1: Convert 1 single → groundout
  if (tier >= 1) {
    const idx = findLowestOfType(results, 'single');
    if (idx !== -1) results[idx] = 'groundout';
  }

  // Tier 2: Convert 1 walk → strikeout
  if (tier >= 2) {
    // Find a walk that isn't slot 0 (roll 1 = walk override)
    for (let i = results.length - 1; i > 0; i--) {
      if (results[i] === 'walk') { results[i] = 'strikeout'; break; }
    }
  }

  // Tier 3: Convert 1 single → strikeout AND upgrade 1 groundout → strikeout
  if (tier >= 3) {
    const sIdx = findLowestOfType(results, 'single');
    if (sIdx !== -1) results[sIdx] = 'strikeout';

    // Find highest groundout, upgrade to strikeout
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i] === 'groundout') { results[i] = 'strikeout'; break; }
    }
  }

  return { results };
}
