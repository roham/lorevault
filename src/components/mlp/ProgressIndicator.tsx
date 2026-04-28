'use client';

import type { CSSProperties } from 'react';
import type { Pane } from './types';
import { PANE_COLORS, SURFACE, TEXT, TYPE } from './tokens';

interface ProgressIndicatorProps {
  pane: Pane;
  setName: string;
  owned: number;
  total: number;
  showCelebration?: boolean;
}

export function ProgressIndicator({
  pane,
  setName,
  owned,
  total,
  showCelebration = true,
}: ProgressIndicatorProps) {
  const pct = total > 0 ? owned / total : 0;
  const paneColor = PANE_COLORS[pane.id];
  const nearComplete = pct >= 0.8 && pct < 1;
  const complete = pct >= 1;

  const wrapper: CSSProperties = {
    background: SURFACE.card,
    border: `1px solid ${SURFACE.rule}`,
    borderRadius: 4,
    padding: '1rem 1.1rem',
    width: '100%',
  };

  const setLabel: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: '1.05rem',
    margin: 0,
    marginBottom: '0.4rem',
    lineHeight: 1.3,
  };

  const paneLabel: CSSProperties = {
    ...TYPE.meta,
    color: paneColor.accent,
    fontSize: '0.6rem',
    marginBottom: '0.35rem',
    display: 'block',
  };

  const barTrack: CSSProperties = {
    width: '100%',
    height: 8,
    background: 'rgba(244,239,227,0.06)',
    borderRadius: 999,
    overflow: 'hidden',
    margin: '0.6rem 0 0.4rem',
    position: 'relative',
  };

  const barFill: CSSProperties = {
    width: `${Math.min(pct * 100, 100)}%`,
    height: '100%',
    background: paneColor.accent,
    transition: 'width 600ms ease',
    boxShadow: nearComplete ? `0 0 12px ${paneColor.accent}88` : 'none',
  };

  const fractionRow: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '0.5rem',
  };

  const fraction: CSSProperties = {
    ...TYPE.bodySmall,
    color: TEXT.body,
    fontVariantNumeric: 'tabular-nums',
  };

  const cue: CSSProperties = {
    ...TYPE.italic,
    color: complete ? '#C9A26B' : nearComplete ? paneColor.accent : TEXT.muted,
    fontSize: '0.78rem',
  };

  return (
    <div style={wrapper}>
      <span style={paneLabel}>{pane.displayName}</span>
      <p style={setLabel}>{setName}</p>
      <div style={barTrack} role="progressbar" aria-valuenow={owned} aria-valuemax={total}>
        <div style={barFill} />
      </div>
      <div style={fractionRow}>
        <span style={fraction}>
          {owned} of {total}
        </span>
        {showCelebration && complete ? (
          <span style={cue}>Set complete · the binder closes.</span>
        ) : showCelebration && nearComplete ? (
          <span style={cue}>Almost there.</span>
        ) : (
          <span style={cue}>{Math.round(pct * 100)}%</span>
        )}
      </div>
    </div>
  );
}
