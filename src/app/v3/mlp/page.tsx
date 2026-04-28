'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PANE_LIST,
  PANE_COLORS,
  SURFACE,
  TEXT,
  TYPE,
  BUTTON_PRIMARY,
} from '@/components/mlp';

// The Hook. One screen. Lands in 0.4 seconds.
//
// Spec: three Pane tiles, one large axiom from the active Pane, a sealed pack
// silhouette, one line of pull-copy, one CTA.
//
// Active Pane rotates every 8 seconds — the visitor sees the game IS about
// something before reading any explanation.

export default function MLPHookPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % PANE_LIST.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const activePane = PANE_LIST[activeIndex];
  const activeColor = PANE_COLORS[activePane.id];

  const root: CSSProperties = {
    background: SURFACE.void,
    minHeight: '100vh',
    color: TEXT.primary,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  };

  // Rotating gradient backdrop, very subtle
  const backdrop: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: `radial-gradient(ellipse at 50% 30%, ${activeColor.accent}22 0%, transparent 60%), ${SURFACE.void}`,
    transition: 'background 1500ms ease',
    zIndex: 0,
  };

  const content: CSSProperties = {
    position: 'relative',
    zIndex: 1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1.1rem',
    paddingBottom: 'calc(1.1rem + env(safe-area-inset-bottom, 0px))',
    maxWidth: 720,
    margin: '0 auto',
    width: '100%',
  };

  const brand: CSSProperties = {
    ...TYPE.meta,
    color: '#C9A26B',
    fontSize: '0.65rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
  };

  // Three Pane tiles row — horizontally scrollable on mobile
  const tilesRow: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.5rem',
    marginBottom: '2.25rem',
  };

  const axiomBlock: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 0.4rem',
  };

  const axiomLabel: CSSProperties = {
    ...TYPE.meta,
    color: activeColor.accent,
    fontSize: '0.6rem',
    transition: 'color 1500ms ease',
    marginBottom: '0.75rem',
  };

  const axiomText: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: 'clamp(1.55rem, 5vw, 2.1rem)',
    lineHeight: 1.2,
    margin: 0,
    marginBottom: '2rem',
  };

  const packArt: CSSProperties = {
    width: 140,
    height: 200,
    margin: '0 auto 2rem',
    background: activeColor.gradient,
    border: `2px solid ${activeColor.accent}`,
    borderRadius: 5,
    position: 'relative',
    transition: 'background 1500ms ease, border-color 1500ms ease',
  };

  const packCenter: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const packGlyph: CSSProperties = {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${activeColor.accent} 0%, transparent 70%)`,
    border: `1px solid ${activeColor.accent}`,
    transition: 'background 1500ms ease',
  };

  const ctaWrapper: CSSProperties = {
    paddingTop: '1rem',
  };

  const ctaPullCopy: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.body,
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '0.85rem',
    margin: 0,
    marginTop: 0,
    paddingBottom: '0.85rem',
  };

  return (
    <div style={root}>
      <div style={backdrop} />
      <div style={content}>
        <p style={brand}>LoreVault</p>

        {/* Three Pane tiles */}
        <div style={tilesRow} role="list">
          {PANE_LIST.map((pane, i) => {
            const color = PANE_COLORS[pane.id];
            const isActive = i === activeIndex;
            const tileStyle: CSSProperties = {
              background: color.gradient,
              border: `1px solid ${isActive ? color.accent : SURFACE.rule}`,
              borderTop: `3px solid ${color.accent}`,
              borderRadius: 4,
              padding: '0.7rem 0.5rem',
              minHeight: 86,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              transition: 'border-color 200ms ease, transform 200ms ease',
              transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
            };
            const tileLabel: CSSProperties = {
              ...TYPE.meta,
              color: color.accent,
              fontSize: '0.55rem',
              letterSpacing: '0.16em',
            };
            const tileFragment: CSSProperties = {
              ...TYPE.italic,
              color: TEXT.body,
              fontSize: '0.72rem',
              lineHeight: 1.3,
              margin: 0,
              flex: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            };
            // Take the first ~12 words of the axiom as a fragment
            const fragment = pane.axiom.split(' ').slice(0, 11).join(' ') + '…';
            return (
              <Link
                key={pane.id}
                href={`/v3/mlp/start?pane=${pane.id}`}
                style={tileStyle}
                role="listitem"
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
              >
                <span style={tileLabel}>{pane.displayName}</span>
                <p style={tileFragment}>{fragment}</p>
              </Link>
            );
          })}
        </div>

        {/* Active axiom — the 0.4-second hook */}
        <div style={axiomBlock}>
          <span style={axiomLabel}>{activePane.displayName} · {activePane.register}</span>
          <p style={axiomText}>"{activePane.axiom}"</p>

          {/* Sealed pack art */}
          <div style={packArt} aria-hidden>
            <div style={packCenter}>
              <div style={packGlyph} />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={ctaWrapper}>
          <p style={ctaPullCopy}>Collect the worlds between worlds.</p>
          <Link
            href="/v3/mlp/start"
            style={{ ...BUTTON_PRIMARY, textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            Choose your world →
          </Link>
        </div>
      </div>
    </div>
  );
}
