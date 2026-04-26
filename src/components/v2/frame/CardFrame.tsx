'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { Tier, Parallel, BaseArtVariant } from '@/lib/v2/parallels-eligibility';
import { checkParallelEligible } from '@/lib/v2/parallels-eligibility';

interface CardFrameProps {
  heroArtUrl: string;
  alt: string;
  tier: Tier;
  parallel: Parallel;
  baseArtVariant: BaseArtVariant;
}

/**
 * <CardFrame> — Phase 4 §2 + §3 composition root.
 *
 * Tier-frame is the BASE layer; Parallel overlay is on top.
 * 1/1 ONE-OFF collapses both — the asset is the frame (§3.5).
 *
 * Runtime guard: assertParallelEligible() called dev-side via
 * checkParallelEligible (logs to console.error when invalid; no-throw in prod).
 * This is the third defense-in-depth call site per §3.6.
 */
export function CardFrame({
  heroArtUrl,
  alt,
  tier,
  parallel,
  baseArtVariant,
}: CardFrameProps) {
  // Defense-in-depth #3: runtime guard at render path.
  useEffect(() => {
    const reason = checkParallelEligible(parallel, tier, baseArtVariant);
    if (reason) {
      // eslint-disable-next-line no-console
      console.error('[CardFrame] parallel-eligibility violation:', reason, {
        tier,
        parallel,
        baseArtVariant,
        heroArtUrl,
      });
    }
  }, [tier, parallel, baseArtVariant, heroArtUrl]);

  const tierClass = `tier-frame-${tier}`;
  const parallelClass = `parallel-${parallel}`;

  return (
    <div
      className={`relative w-full aspect-[2/3] overflow-hidden lampblack-haze ${tierClass} ${parallelClass}`}
    >
      <Image
        src={heroArtUrl}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 540px"
        className="object-cover"
      />
    </div>
  );
}
