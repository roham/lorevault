'use client';

import type { CSSProperties } from 'react';
import { SURFACE, TEXT, TYPE } from './tokens';

interface TierBadgeProps {
  tier: 0 | 1 | 2 | 3 | 4;
  active: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const TIER_NAMES: Record<TierBadgeProps['tier'], string> = {
  0: 'Observer',
  1: 'Collector',
  2: 'Challenger',
  3: 'Contributor',
  4: 'Canon',
};

export function TierBadge({ tier, active, size = 'md' }: TierBadgeProps) {
  const tierName = TIER_NAMES[tier];
  const isLocked = !active;

  const dimensions = {
    sm: { num: '1.4rem', label: '0.55rem', wrap: '0.55rem 0.75rem' },
    md: { num: '2rem', label: '0.62rem', wrap: '0.85rem 1rem' },
    lg: { num: '3.2rem', label: '0.7rem', wrap: '1.4rem 1.6rem' },
  }[size];

  const wrapper: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.2rem',
    background: SURFACE.card,
    border: `1px solid ${isLocked ? SURFACE.rule : '#C9A26B'}`,
    borderRadius: 3,
    padding: dimensions.wrap,
    opacity: isLocked ? 0.55 : 1,
    minWidth: size === 'lg' ? 200 : undefined,
  };

  const tierLabel: CSSProperties = {
    ...TYPE.meta,
    color: isLocked ? TEXT.muted : '#C9A26B',
    fontSize: dimensions.label,
  };

  const numAndName: CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.55rem',
  };

  const numStyle: CSSProperties = {
    ...TYPE.italic,
    color: isLocked ? TEXT.muted : TEXT.primary,
    fontSize: dimensions.num,
    lineHeight: 1,
  };

  const nameStyle: CSSProperties = {
    ...TYPE.italic,
    color: isLocked ? TEXT.muted : TEXT.primary,
    fontSize: size === 'lg' ? '1.1rem' : '0.95rem',
  };

  const lockedHint: CSSProperties = {
    ...TYPE.meta,
    color: TEXT.muted,
    fontSize: '0.5rem',
    letterSpacing: '0.16em',
  };

  return (
    <div style={wrapper}>
      <span style={tierLabel}>Tier · {tier}</span>
      <div style={numAndName}>
        <span style={numStyle}>{tier}</span>
        <span style={nameStyle}>{tierName}</span>
      </div>
      {isLocked ? <span style={lockedHint}>Unlocks in Series 2</span> : null}
    </div>
  );
}
