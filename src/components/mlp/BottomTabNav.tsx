'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SURFACE, TEXT, TYPE } from './tokens';

const TABS: { href: string; label: string; match: (p: string) => boolean }[] = [
  { href: '/v3/mlp/vault', label: 'Vault', match: (p) => p.startsWith('/v3/mlp/vault') },
  { href: '/v3/mlp/sets', label: 'Sets', match: (p) => p.startsWith('/v3/mlp/sets') },
  { href: '/v3/mlp/drops', label: 'Drops', match: (p) => p.startsWith('/v3/mlp/drops') },
  { href: '/v3/mlp/market', label: 'Market', match: (p) => p.startsWith('/v3/mlp/market') },
  { href: '/v3/mlp/play', label: 'Play', match: (p) => p.startsWith('/v3/mlp/play') },
];

export function BottomTabNav() {
  const pathname = usePathname() ?? '';
  // Hide on hook + onboarding
  if (pathname === '/v3/mlp' || pathname.startsWith('/v3/mlp/start')) return null;

  const wrapper: CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    background: 'rgba(10,9,7,0.92)',
    backdropFilter: 'blur(8px)',
    borderTop: `1px solid ${SURFACE.rule}`,
    padding: '0.4rem 0.4rem calc(0.4rem + env(safe-area-inset-bottom, 0px))',
    display: 'grid',
    gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
    gap: '0.2rem',
  };

  const tabBase: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    textDecoration: 'none',
    borderRadius: 2,
    transition: 'background 200ms ease',
  };

  return (
    <nav style={wrapper} aria-label="Primary navigation">
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        const styled: CSSProperties = {
          ...tabBase,
          background: active ? 'rgba(244,239,227,0.06)' : 'transparent',
        };
        const labelStyle: CSSProperties = {
          ...TYPE.meta,
          color: active ? TEXT.primary : TEXT.muted,
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
        };
        return (
          <Link key={tab.href} href={tab.href} style={styled}>
            <span style={labelStyle}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
