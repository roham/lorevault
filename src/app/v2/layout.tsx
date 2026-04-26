import type { Metadata, Viewport } from 'next';
import { SHARED_FONT_VARS } from '@/lib/v2/fonts';
import '@/components/v2/v2-tokens.css';

export const metadata: Metadata = {
  title: 'LoreVault — The Glass Catches Light',
  description:
    'Five Panes. Five doors. Lampblack is what they leave on each other’s pages.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0907',
};

/**
 * V2 layout ships only the SHARED faces (Inter, JetBrains Mono, Cormorant
 * Garamond Italic, Source Serif 4) for fast LCP on the home + welcome surfaces.
 *
 * The 5 Universe-specific faces (IM Fell English SC, UnifrakturMaguntia,
 * Old Standard TT, Cinzel, Crimson Text) load only on the card-detail route
 * via `UNIVERSE_FONT_VARS` in the card-detail layout below.
 */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={SHARED_FONT_VARS}>{children}</div>;
}
