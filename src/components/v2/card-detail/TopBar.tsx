'use client';

import Link from 'next/link';
import type { V2Card } from '@/lib/v2/cards';
import { UNIVERSE_GLYPH } from '@/lib/v2/cards';

interface TopBarProps {
  card: V2Card;
}

const TIER_LABEL: Record<string, string> = {
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
  ultimate: 'Ultimate',
};

export function TopBar({ card }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center bg-[var(--color-v2-ground)]/95 backdrop-blur-sm border-b border-[var(--color-v2-rule)] px-4">
      <Link
        href="/v2"
        aria-label="Back to LoreVault"
        className="flex h-6 w-6 items-center justify-center text-[var(--color-v2-text-dim)] hover:text-[var(--color-v2-text)] transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <div className="flex-1 truncate px-3 text-sm font-medium text-[var(--color-v2-text)] [font-family:var(--font-v2-ui)]">
        {card.figureName}
      </div>
      <span
        aria-label={`Universe: ${card.universeLabel}`}
        title={card.universeLabel}
        className="mr-3 flex h-6 w-6 items-center justify-center text-base text-[var(--color-v2-text)] [font-family:var(--font-v2-mono)]"
      >
        {UNIVERSE_GLYPH[card.universe]}
      </span>
      <span
        aria-label={`Tier: ${TIER_LABEL[card.tier]}`}
        className="rounded-full border border-[var(--color-tier-ultimate)] px-2 py-0.5 text-[11px] uppercase tracking-wider text-[var(--color-tier-ultimate)] [font-family:var(--font-v2-ui)]"
      >
        {TIER_LABEL[card.tier]}
      </span>
    </header>
  );
}
