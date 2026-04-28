'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Card as CardType } from './types';
import { PANE_COLORS, RARITY, TEXT, TYPE, CARD_ASPECT } from './tokens';
import { ContrabandBadge } from './ContrabandBadge';

interface CardProps {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (card: CardType) => void;
  showLampblackOnHover?: boolean;
}

const SIZE_WIDTH: Record<NonNullable<CardProps['size']>, string> = {
  sm: '120px',
  md: '180px',
  lg: '320px',
};

export function Card({
  card,
  size = 'md',
  onClick,
  showLampblackOnHover = true,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const paneColor = PANE_COLORS[card.pane];
  const rarity = RARITY[card.rarity];

  const containerStyle: CSSProperties = {
    width: SIZE_WIDTH[size],
    aspectRatio: CARD_ASPECT,
    background: paneColor.gradient,
    border: `1px solid ${rarity.color}`,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    transition: 'transform 200ms ease, box-shadow 200ms ease',
    boxShadow: hovered
      ? `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${rarity.color}`
      : '0 1px 4px rgba(0,0,0,0.4)',
  };

  const silhouetteStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: card.silhouetteUrl
      ? `url(${card.silhouetteUrl}) center / cover no-repeat`
      : `radial-gradient(ellipse at center, ${paneColor.accent}22 0%, transparent 70%)`,
    opacity: card.silhouetteUrl ? 1 : 0.6,
  };

  // Pane attribution pill — top-right
  const paneAttribution: CSSProperties = {
    position: 'absolute',
    top: 8,
    right: 8,
    ...TYPE.meta,
    color: paneColor.on,
    background: 'rgba(0,0,0,0.5)',
    padding: '0.18rem 0.45rem',
    borderRadius: 2,
    fontSize: size === 'sm' ? '0.55rem' : '0.62rem',
  };

  const serialBadge: CSSProperties = {
    position: 'absolute',
    top: 8,
    left: 8,
    ...TYPE.meta,
    color: TEXT.body,
    background: 'rgba(0,0,0,0.5)',
    padding: '0.18rem 0.4rem',
    borderRadius: 2,
    fontSize: size === 'sm' ? '0.5rem' : '0.55rem',
  };

  const rarityBand: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    background: rarity.color,
  };

  const nameBlock: CSSProperties = {
    position: 'absolute',
    bottom: size === 'sm' ? 8 : 14,
    left: size === 'sm' ? 8 : 12,
    right: size === 'sm' ? 8 : 12,
  };

  const nameText: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: size === 'sm' ? '0.78rem' : size === 'md' ? '0.95rem' : '1.2rem',
    lineHeight: 1.2,
    margin: 0,
    textShadow: '0 1px 4px rgba(0,0,0,0.85)',
  };

  const lampblackOverlay: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: size === 'sm' ? '0.6rem' : '0.9rem',
    opacity: hovered && showLampblackOnHover && size !== 'sm' ? 1 : 0,
    transition: 'opacity 250ms ease',
    pointerEvents: 'none',
  };

  const gestureLabel: CSSProperties = {
    ...TYPE.meta,
    color: paneColor.accent,
    fontSize: '0.55rem',
    marginBottom: '0.25rem',
  };

  const gestureText: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: '0.78rem',
    lineHeight: 1.4,
    margin: 0,
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.(card)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${card.name} — ${card.paneDisplayName}`}
    >
      <div style={silhouetteStyle} />

      <span style={paneAttribution}>{card.paneDisplayName}</span>
      <span style={serialBadge}>
        #{card.serial} / {card.editionSize}
      </span>

      {card.contrabandRelation ? (
        <div style={{ position: 'absolute', top: size === 'sm' ? 28 : 36, right: 8 }}>
          <ContrabandBadge
            relation={card.contrabandRelation}
            pane={card.paneDisplayName}
            compact
          />
        </div>
      ) : null}

      {card.scars.length > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: size === 'sm' ? 50 : 62,
            right: 8,
            ...TYPE.meta,
            color: '#8B1A1A',
            background: 'rgba(0,0,0,0.65)',
            padding: '0.18rem 0.4rem',
            borderRadius: 2,
            fontSize: '0.55rem',
            letterSpacing: '0.16em',
          }}
          title={card.scars.map((s) => s.conflictName).join(' · ')}
        >
          ✦ Scarred
        </div>
      ) : null}

      <div style={nameBlock}>
        <p style={nameText}>{card.name}</p>
      </div>

      <div style={lampblackOverlay} aria-hidden>
        <span style={gestureLabel}>Lampblack · Gesture</span>
        <p style={gestureText}>{card.lampblack.gesture}</p>
      </div>

      <div style={rarityBand} />
    </div>
  );
}
