import type { Metadata, Viewport } from 'next';
import { ALL_FONT_VARS } from '@/lib/v2/fonts';
import '@/components/v2/v2-tokens.css';

export const metadata: Metadata = {
  title: 'LoreVault v3 — Game Design Document',
  description:
    'The canonical Game Design Document for LoreVault v3 — the Lattice and the Lampblack.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0907',
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <div className={ALL_FONT_VARS}>{children}</div>;
}
