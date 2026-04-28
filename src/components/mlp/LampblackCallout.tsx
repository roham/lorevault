'use client';

import type { CSSProperties } from 'react';
import type { LampblackHierarchy } from './types';
import { SURFACE, TEXT, TYPE } from './tokens';

interface LampblackCalloutProps {
  lampblack: LampblackHierarchy;
}

const HIERARCHY: { key: keyof LampblackHierarchy; label: string }[] = [
  { key: 'gesture', label: 'Gesture' },
  { key: 'cosmologicalRelation', label: 'Cosmological Relation' },
  { key: 'wound', label: 'Wound' },
  { key: 'forbiddenAct', label: 'Forbidden Act' },
  { key: 'role', label: 'Role' },
  { key: 'silhouette', label: 'Silhouette' },
  { key: 'prop', label: 'Prop' },
];

export function LampblackCallout({ lampblack }: LampblackCalloutProps) {
  const wrapper: CSSProperties = {
    background: SURFACE.card,
    border: `1px solid ${SURFACE.rule}`,
    borderRadius: 4,
    padding: '1.25rem 1.1rem',
    width: '100%',
  };

  const sectionLabel: CSSProperties = {
    ...TYPE.meta,
    color: '#C9A26B',
    fontSize: '0.62rem',
    marginBottom: '0.85rem',
    display: 'block',
  };

  const gestureLabel: CSSProperties = {
    ...TYPE.meta,
    color: '#C9A26B',
    fontSize: '0.6rem',
    marginBottom: '0.3rem',
    display: 'block',
  };

  const gestureText: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: '1.2rem',
    lineHeight: 1.3,
    margin: 0,
    marginBottom: '1rem',
    paddingLeft: '0.85rem',
    borderLeft: '2px solid #C9A26B',
  };

  const rowsWrapper: CSSProperties = {
    borderTop: `1px solid ${SURFACE.rule}`,
    paddingTop: '0.8rem',
  };

  const row: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(8rem, 30%) 1fr',
    gap: '0.85rem',
    padding: '0.45rem 0',
    borderBottom: `1px solid ${SURFACE.rule}`,
    alignItems: 'baseline',
  };

  const rowLabel: CSSProperties = {
    ...TYPE.meta,
    color: TEXT.muted,
    fontSize: '0.55rem',
  };

  const rowValue: CSSProperties = {
    ...TYPE.bodySmall,
    color: TEXT.body,
    fontSize: '0.88rem',
    margin: 0,
  };

  // Decreasing visual weight per hierarchy step.
  // Index 0 (gesture) treated separately above. Then index 1..6 fade.
  const opacityByIndex = (i: number): number => {
    if (i === 0) return 1;
    return Math.max(0.45, 1 - i * 0.08);
  };

  return (
    <div style={wrapper}>
      <span style={sectionLabel}>Lampblack residue · gesture-first hierarchy</span>

      {/* Gesture is rendered as a featured pull-quote */}
      <div>
        <span style={gestureLabel}>Gesture</span>
        <p style={gestureText}>{lampblack.gesture}</p>
      </div>

      <div style={rowsWrapper}>
        {HIERARCHY.slice(1).map((entry, i) => {
          const realIndex = i + 1;
          return (
            <div key={entry.key} style={{ ...row, opacity: opacityByIndex(realIndex) }}>
              <span style={rowLabel}>{entry.label}</span>
              <p style={rowValue}>{lampblack[entry.key]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
