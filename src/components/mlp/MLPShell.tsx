'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SURFACE, TEXT, TYPE } from './tokens';
import { BottomTabNav } from './BottomTabNav';

interface MLPShellProps {
  children: ReactNode;
  /** Set true on /mlp and /mlp/start to hide top header + bottom nav (those routes own the viewport). */
  immersive?: boolean;
  /** Title shown in the top bar. */
  title?: string;
}

export function MLPShell({ children, immersive = false, title }: MLPShellProps) {
  const pathname = usePathname() ?? '';
  const showHeader = !immersive;
  const showNav = !immersive;

  const root: CSSProperties = {
    background: SURFACE.void,
    color: TEXT.primary,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const header: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    background: 'rgba(10,9,7,0.92)',
    backdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${SURFACE.rule}`,
    padding: '0 0.9rem',
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const brand: CSSProperties = {
    ...TYPE.meta,
    color: '#C9A26B',
    fontSize: '0.62rem',
    textDecoration: 'none',
  };

  const titleStyle: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: '0.95rem',
    margin: 0,
  };

  const userMenuBtn: CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: SURFACE.card,
    border: `1px solid ${SURFACE.rule}`,
    color: TEXT.primary,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const main: CSSProperties = {
    flex: 1,
    paddingBottom: showNav ? 'calc(72px + env(safe-area-inset-bottom, 0px))' : 0,
  };

  const userMenuActive = pathname.startsWith('/v3/mlp/u/') || pathname === '/v3/mlp/progress' || pathname === '/v3/mlp/challenges';

  return (
    <div style={root}>
      {showHeader ? (
        <header style={header}>
          <Link href="/v3/mlp" style={brand}>
            LoreVault · MLP
          </Link>
          {title ? <p style={titleStyle}>{title}</p> : <span aria-hidden />}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/v3/mlp/challenges"
              style={{ ...userMenuBtn, width: 'auto', padding: '0 0.65rem', borderRadius: 16 }}
              aria-label="Challenges"
              title="Challenges"
            >
              <span style={{ ...TYPE.meta, fontSize: '0.55rem', color: pathname === '/v3/mlp/challenges' ? '#C9A26B' : TEXT.body }}>
                Tasks
              </span>
            </Link>
            <Link
              href="/v3/mlp/progress"
              style={{ ...userMenuBtn, width: 'auto', padding: '0 0.65rem', borderRadius: 16 }}
              aria-label="Progress"
              title="Progress"
            >
              <span style={{ ...TYPE.meta, fontSize: '0.55rem', color: pathname === '/v3/mlp/progress' ? '#C9A26B' : TEXT.body }}>
                Tier
              </span>
            </Link>
            <Link
              href="/v3/mlp/u/orchard-keeper"
              style={userMenuBtn}
              aria-label="Profile"
              title="Profile"
            >
              <span style={{ color: userMenuActive ? '#C9A26B' : TEXT.body, fontSize: '0.85rem' }}>
                ◐
              </span>
            </Link>
          </div>
        </header>
      ) : null}

      <main style={main}>{children}</main>

      {showNav ? <BottomTabNav /> : null}
    </div>
  );
}
