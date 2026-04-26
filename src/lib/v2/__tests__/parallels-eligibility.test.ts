/**
 * Cross-product unit tests for assertParallelEligible() per Phase 4 §3.6.
 * Run with: node --test src/lib/v2/__tests__/parallels-eligibility.test.ts
 *
 * Note: The repo doesn't ship a test runner; this file is hand-runnable via
 * `node --test --experimental-strip-types ...` or by `npx tsx`. The CI gate
 * for the slice runs `node -e ...` via scripts/check-parallel-eligibility.mjs.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertParallelEligible,
  type Tier,
  type Parallel,
  type BaseArtVariant,
} from '../parallels-eligibility';

const TIERS: Tier[] = ['common', 'rare', 'legendary', 'ultimate'];
const PARALLELS: Parallel[] = [
  'base',
  'arcana',
  'aether',
  'witness',
  'neon',
  'one-off',
];
const VARIANTS: BaseArtVariant[] = ['base', 'parallel'];

const RARE_PLUS: Tier[] = ['rare', 'legendary', 'ultimate'];

test('base parallel always passes', () => {
  for (const tier of TIERS) {
    for (const variant of VARIANTS) {
      assert.equal(assertParallelEligible('base', tier, variant), true);
    }
  }
});

test('one-off requires Ultimate tier', () => {
  for (const tier of TIERS) {
    for (const variant of VARIANTS) {
      if (tier === 'ultimate') {
        assert.equal(assertParallelEligible('one-off', tier, variant), true);
      } else {
        assert.throws(() => assertParallelEligible('one-off', tier, variant));
      }
    }
  }
});

test('ARCANA / AETHER / WITNESS / NEON require Rare+ AND parallel variant', () => {
  const restricted: Parallel[] = ['arcana', 'aether', 'witness', 'neon'];
  for (const parallel of restricted) {
    for (const tier of TIERS) {
      for (const variant of VARIANTS) {
        const isRarePlus = RARE_PLUS.includes(tier);
        const isParallelVariant = variant === 'parallel';
        if (isRarePlus && isParallelVariant) {
          assert.equal(
            assertParallelEligible(parallel, tier, variant),
            true,
            `${parallel}+${tier}+${variant} should pass`
          );
        } else {
          assert.throws(
            () => assertParallelEligible(parallel, tier, variant),
            `${parallel}+${tier}+${variant} should throw`
          );
        }
      }
    }
  }
});
