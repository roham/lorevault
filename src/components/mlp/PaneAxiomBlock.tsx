'use client';

import type { CSSProperties } from 'react';
import type { PaneId } from './types';
import { PANE_COLORS, SURFACE, TEXT, TYPE } from './tokens';

interface PaneAxiomBlockProps {
  paneId: PaneId;
  paneName: string;
  axiom: string;
  register: string;
  emphasis?: 'default' | 'hero';
}

export function PaneAxiomBlock({
  paneId,
  paneName,
  axiom,
  register,
  emphasis = 'default',
}: PaneAxiomBlockProps) {
  const paneColor = PANE_COLORS[paneId];
  const isHero = emphasis === 'hero';

  const wrapper: CSSProperties = {
    background: isHero ? paneColor.gradient : SURFACE.card,
    border: `1px solid ${SURFACE.rule}`,
    borderLeft: `3px solid ${paneColor.accent}`,
    borderRadius: 4,
    padding: isHero ? '1.5rem 1.4rem' : '1rem 1.1rem',
    width: '100%',
  };

  const paneLabel: CSSProperties = {
    ...TYPE.meta,
    color: paneColor.accent,
    fontSize: isHero ? '0.7rem' : '0.62rem',
    display: 'block',
    marginBottom: '0.55rem',
  };

  const axiomText: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: isHero ? 'clamp(1.15rem, 3.4vw, 1.55rem)' : '1.02rem',
    lineHeight: 1.35,
    margin: 0,
    marginBottom: '0.7rem',
  };

  const registerLabel: CSSProperties = {
    ...TYPE.meta,
    color: TEXT.muted,
    fontSize: '0.55rem',
  };

  return (
    <div style={wrapper}>
      <span style={paneLabel}>{paneName}</span>
      <p style={axiomText}>{axiom}</p>
      <span style={registerLabel}>Register · {register}</span>
    </div>
  );
}
