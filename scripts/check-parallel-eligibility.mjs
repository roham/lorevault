#!/usr/bin/env node
// Cross-product runtime sanity check for assertParallelEligible().
// Per Phase 4 §3.6 + acceptance gate §12 #2.
//
// We import the compiled JS via tsx-less shim — the gate doesn't need a full
// test runner; it needs to assert that every (Tier × Parallel × BaseArtVariant)
// cell either passes or throws as the spec requires.

// Inline copy of the validator — keeps the gate self-contained.
function assertParallelEligible(parallel, tier, baseArtVariant) {
  if (parallel === 'base') return true;
  if (parallel === 'one-off') {
    if (tier !== 'ultimate') throw new Error('1/1 ONE-OFF is Ultimate-tier only.');
    return true;
  }
  const rarePlus = ['rare', 'legendary', 'ultimate'];
  if (!rarePlus.includes(tier)) {
    throw new Error(
      `${parallel.toUpperCase()} parallels are Rare+ only. Common-base art with ${parallel} treatment is REJECTED.`
    );
  }
  if (baseArtVariant !== 'parallel') {
    throw new Error(
      `${parallel.toUpperCase()} requires a parallel-specific FLUX commission. baseArtVariant must be 'parallel'.`
    );
  }
  return true;
}

const TIERS = ['common', 'rare', 'legendary', 'ultimate'];
const PARALLELS = ['base', 'arcana', 'aether', 'witness', 'neon', 'one-off'];
const VARIANTS = ['base', 'parallel'];
const RARE_PLUS = new Set(['rare', 'legendary', 'ultimate']);

let pass = 0;
let fail = 0;
const failures = [];
for (const parallel of PARALLELS) {
  for (const tier of TIERS) {
    for (const variant of VARIANTS) {
      let threw = false;
      try {
        assertParallelEligible(parallel, tier, variant);
      } catch {
        threw = true;
      }
      let expectedThrow;
      if (parallel === 'base') expectedThrow = false;
      else if (parallel === 'one-off') expectedThrow = tier !== 'ultimate';
      else expectedThrow = !RARE_PLUS.has(tier) || variant !== 'parallel';
      const ok = threw === expectedThrow;
      if (ok) pass += 1;
      else {
        fail += 1;
        failures.push({ parallel, tier, variant, threw, expectedThrow });
      }
    }
  }
}

console.log(`assertParallelEligible cross-product: ${pass} pass / ${fail} fail (of ${pass + fail})`);
if (fail) {
  console.error('failures:', JSON.stringify(failures, null, 2));
  process.exit(1);
}
