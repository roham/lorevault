'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Card as CardType } from './types';
import { PANE_COLORS, SURFACE, TEXT, TYPE } from './tokens';

interface PierreMenardTriptychProps {
  cards: [CardType, CardType, CardType];
}

export function PierreMenardTriptych({ cards }: PierreMenardTriptychProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const wrapper: CSSProperties = {
    width: '100%',
  };

  const headline: CSSProperties = {
    ...TYPE.meta,
    color: '#C9A26B',
    fontSize: '0.62rem',
    marginBottom: '0.5rem',
    display: 'block',
  };

  const subheadline: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.body,
    fontSize: '0.95rem',
    margin: 0,
    marginBottom: '1.25rem',
    lineHeight: 1.4,
  };

  const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
    gap: '0.85rem',
  };

  return (
    <div style={wrapper}>
      <span style={headline}>Pierre-Menard variants</span>
      <p style={subheadline}>
        The same words. Three Panes. Three meanings. Tap a column to read the interpretation.
      </p>

      <div style={grid}>
        {cards.map((card, i) => {
          const paneColor = PANE_COLORS[card.pane];
          const isActive = activeIndex === i;
          const columnStyle: CSSProperties = {
            background: paneColor.gradient,
            border: `1px solid ${isActive ? paneColor.accent : SURFACE.rule}`,
            borderTop: `3px solid ${paneColor.accent}`,
            borderRadius: 4,
            padding: '1.1rem 1rem',
            cursor: 'pointer',
            transition: 'border-color 200ms ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            minHeight: 240,
          };

          const paneLabel: CSSProperties = {
            ...TYPE.meta,
            color: paneColor.accent,
            fontSize: '0.6rem',
          };

          const sharedTextStyle: CSSProperties = {
            ...TYPE.italic,
            color: TEXT.primary,
            fontSize: '0.98rem',
            lineHeight: 1.45,
            margin: 0,
          };

          const interpretationStyle: CSSProperties = {
            ...TYPE.bodySmall,
            color: TEXT.body,
            fontSize: '0.85rem',
            margin: 0,
            paddingTop: '0.6rem',
            borderTop: `1px solid ${SURFACE.rule}`,
          };

          return (
            <button
              key={card.id}
              type="button"
              style={columnStyle}
              onClick={() => setActiveIndex((cur) => (cur === i ? null : i))}
              aria-pressed={isActive}
              aria-label={`${card.paneDisplayName} interpretation`}
            >
              <span style={paneLabel}>{card.paneDisplayName}</span>
              <p style={sharedTextStyle}>"{card.flavorLine}"</p>
              {isActive ? (
                <p style={interpretationStyle}>
                  <strong style={{ color: paneColor.accent, fontWeight: 600 }}>Reading:</strong>{' '}
                  {card.lampblack.cosmologicalRelation}.{' '}
                  <em style={{ color: TEXT.muted }}>{card.iceberg.echo}</em>
                </p>
              ) : (
                <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginTop: 'auto' }}>
                  Tap to read this Pane's interpretation
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
