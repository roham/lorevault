'use client';

import type { CSSProperties } from 'react';
import type { ContrabandRelation } from './types';
import { CONTRABAND_RELATION, TEXT, TYPE } from './tokens';

interface ContrabandBadgeProps {
  relation: ContrabandRelation;
  pane: string;
  compact?: boolean;
}

export function ContrabandBadge({ relation, pane, compact = false }: ContrabandBadgeProps) {
  const meta = CONTRABAND_RELATION[relation];

  const style: CSSProperties = {
    ...TYPE.meta,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    color: TEXT.primary,
    background: 'rgba(0,0,0,0.65)',
    border: `1px solid ${meta.color}`,
    borderRadius: 2,
    padding: compact ? '0.18rem 0.4rem' : '0.32rem 0.6rem',
    fontSize: compact ? '0.55rem' : '0.62rem',
    letterSpacing: '0.14em',
  };

  const dot: CSSProperties = {
    width: compact ? 4 : 6,
    height: compact ? 4 : 6,
    borderRadius: '50%',
    background: meta.color,
    display: 'inline-block',
  };

  return (
    <span
      style={style}
      title={`This card ${relation} the contraband of ${pane}`}
      aria-label={`Contraband: ${meta.label} (${pane})`}
    >
      <span style={dot} aria-hidden />
      {compact ? meta.label : `${meta.label} · ${pane}`}
    </span>
  );
}
