'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Card as CardType, Pane, Rarity } from './types';
import { PANE_COLORS, RARITY, SURFACE, TEXT, TYPE, BUTTON_PRIMARY } from './tokens';
import { Card } from './Card';

export type PackState = 'sealed' | 'opening' | 'revealed';

interface PackProps {
  pane: Pane;
  rarity?: Rarity;
  cards: CardType[];
  state: PackState;
  /** Called when sealed pack tapped — parent should advance state to 'opening'. */
  onTapSealed?: () => void;
  /** Called when opening completes — parent should advance state to 'revealed'. */
  onOpened?: () => void;
  /** Called when user reveals each card in turn (1-indexed). */
  onRevealCard?: (index: number) => void;
  /** Called when last card is revealed. */
  onAllRevealed?: () => void;
}

export function Pack({
  pane,
  rarity = 'rare',
  cards,
  state,
  onTapSealed,
  onOpened,
  onRevealCard,
  onAllRevealed,
}: PackProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const paneColor = PANE_COLORS[pane.id];
  const rarityMeta = RARITY[rarity];

  // ─── Sealed state ──────────────────────────────────────────────────────────
  if (state === 'sealed') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={onTapSealed}
          aria-label={`Open the ${pane.displayName} pack`}
          style={{
            position: 'relative',
            width: 220,
            height: 320,
            background: paneColor.gradient,
            border: `2px solid ${paneColor.accent}`,
            borderRadius: 6,
            cursor: 'pointer',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 16,
              border: `1px dashed ${paneColor.accent}55`,
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.25rem',
            }}
          >
            <span style={{ ...TYPE.meta, color: paneColor.accent }}>
              {pane.displayName}
            </span>
            <div style={{ textAlign: 'center' }}>
              <div
                aria-hidden
                style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 1rem',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${paneColor.accent} 0%, transparent 70%)`,
                  border: `1px solid ${paneColor.accent}`,
                }}
              />
              <p
                style={{
                  ...TYPE.italic,
                  color: TEXT.primary,
                  fontSize: '1rem',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Sealed pack
              </p>
            </div>
            <span style={{ ...TYPE.meta, color: TEXT.muted, textAlign: 'right' }}>
              Tap to break the seal
            </span>
          </div>
        </button>
      </div>
    );
  }

  // ─── Opening state ─────────────────────────────────────────────────────────
  if (state === 'opening') {
    // Show splitting animation, then auto-advance to revealed
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 220,
            height: 320,
          }}
          onAnimationEnd={onOpened}
        >
          <style>{`
            @keyframes packCrackTop { from { transform: translateY(0) rotate(0); } to { transform: translateY(-40px) rotate(-3deg); opacity: 0; } }
            @keyframes packCrackBot { from { transform: translateY(0) rotate(0); } to { transform: translateY(40px) rotate(3deg); opacity: 0; } }
            @keyframes packGlow { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(ellipse at center, ${rarityMeta.color}88 0%, transparent 70%)`,
              animation: 'packGlow 1.4s ease forwards',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: paneColor.gradient,
              border: `2px solid ${paneColor.accent}`,
              borderBottom: 'none',
              borderRadius: '6px 6px 0 0',
              animation: 'packCrackTop 1.4s ease forwards',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              bottom: 0,
              background: paneColor.gradient,
              border: `2px solid ${paneColor.accent}`,
              borderTop: 'none',
              borderRadius: '0 0 6px 6px',
              animation: 'packCrackBot 1.4s ease forwards',
            }}
          />
        </div>
        <p style={{ ...TYPE.italic, color: TEXT.body, fontSize: '0.95rem' }}>
          The wax cracks.
        </p>
      </div>
    );
  }

  // ─── Revealed state ────────────────────────────────────────────────────────
  // Cards revealed one by one as user taps "Next card."
  const handleReveal = () => {
    const next = revealedCount + 1;
    setRevealedCount(next);
    onRevealCard?.(next);
    if (next === cards.length) onAllRevealed?.();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          minHeight: 280,
        }}
      >
        {cards.slice(0, Math.max(revealedCount, 1)).map((c, i) => (
          <div
            key={c.id}
            style={{
              opacity: i < revealedCount ? 1 : 0,
              transform: i < revealedCount ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 400ms ease, transform 400ms ease',
            }}
          >
            <Card card={c} size="md" showLampblackOnHover={false} />
          </div>
        ))}
        {revealedCount === 0 ? (
          <div
            style={{
              width: 180,
              aspectRatio: '5 / 7',
              background: paneColor.gradient,
              border: `1px dashed ${paneColor.accent}55`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ ...TYPE.italic, color: TEXT.muted, fontSize: '0.9rem' }}>
              Tap to reveal
            </span>
          </div>
        ) : null}
      </div>

      {revealedCount < cards.length ? (
        <button
          type="button"
          onClick={handleReveal}
          style={{ ...BUTTON_PRIMARY, maxWidth: 320 }}
        >
          {revealedCount === 0
            ? 'Reveal the first card →'
            : `Next card (${revealedCount + 1} of ${cards.length}) →`}
        </button>
      ) : (
        <p style={{ ...TYPE.italic, color: TEXT.body, fontSize: '0.95rem' }}>
          {cards.length} cards yours.
        </p>
      )}
    </div>
  );
}
