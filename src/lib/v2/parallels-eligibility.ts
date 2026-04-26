/**
 * Parallel-eligibility validator per Phase 4 §3.6.
 *
 * Defense-in-depth: called from (1) commissioning admin form, (2) card-mint job,
 * (3) <CardFrame> runtime guard (dev-only).
 */

export type Tier = 'common' | 'rare' | 'legendary' | 'ultimate';
export type Parallel = 'base' | 'arcana' | 'aether' | 'witness' | 'neon' | 'one-off';
export type BaseArtVariant = 'base' | 'parallel'; // FLUX-commissioned a parallel-specific render

export function assertParallelEligible(
  parallel: Parallel,
  tier: Tier,
  baseArtVariant: BaseArtVariant
): true {
  if (parallel === 'base') return true;

  if (parallel === 'one-off') {
    if (tier !== 'ultimate') {
      throw new Error('1/1 ONE-OFF is Ultimate-tier only.');
    }
    return true;
  }

  // ARCANA / AETHER / WITNESS / NEON
  const rarePlus: Tier[] = ['rare', 'legendary', 'ultimate'];
  if (!rarePlus.includes(tier)) {
    throw new Error(
      `${parallel.toUpperCase()} parallels are Rare+ only. Common-base art with ${parallel} treatment is REJECTED at commissioning gate.`
    );
  }

  if (baseArtVariant !== 'parallel') {
    throw new Error(
      `${parallel.toUpperCase()} requires a parallel-specific FLUX commission. baseArtVariant must be 'parallel'.`
    );
  }

  return true;
}

/**
 * Soft variant: returns null when valid, returns the rejection reason as a string when not.
 * Used by the <CardFrame> runtime guard so we can log without throwing in production.
 */
export function checkParallelEligible(
  parallel: Parallel,
  tier: Tier,
  baseArtVariant: BaseArtVariant
): string | null {
  try {
    assertParallelEligible(parallel, tier, baseArtVariant);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}
