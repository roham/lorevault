/**
 * Per-Universe + shared typography per Phase 4 §6.
 *
 * Strategy: ship the SHARED faces in the v2 layout for fast LCP. Per-Universe
 * faces (IM Fell English SC, UnifrakturMaguntia, Old Standard TT, Cinzel) load
 * only on the card-detail route — they're not above-the-fold on /v2 home.
 *
 * All `font-display: swap` per §6.3 — graceful degradation tested by gate §12 #5.
 */

import {
  IM_Fell_English_SC,
  UnifrakturMaguntia,
  Cormorant_Garamond,
  Old_Standard_TT,
  Cinzel,
  Crimson_Text,
  Source_Serif_4,
  JetBrains_Mono,
  Inter,
} from 'next/font/google';

// Shared / global faces — loaded on every v2 surface.
export const fontPullquote = Cormorant_Garamond({
  weight: ['400'],
  style: ['italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pullquote',
});

export const fontBody = Source_Serif_4({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const fontMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v2-mono',
});

export const fontUI = Inter({
  weight: ['500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v2-ui',
});

// Per-Universe faces — loaded on card-detail route only.
export const fontBakerStreet = IM_Fell_English_SC({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-baker-street',
});

export const fontEnchantedKingdom = UnifrakturMaguntia({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-enchanted-kingdom',
});

export const fontWonderland = Cormorant_Garamond({
  weight: ['400', '500'],
  style: ['italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-wonderland',
});

export const fontGothicHorror = Old_Standard_TT({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gothic-horror',
});

export const fontGreekMyth = Cinzel({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-greek-myth',
});

export const fontEKBody = Crimson_Text({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ek-body',
});

// Shared-only — for the v2 layout / home / welcome.
export const SHARED_FONT_VARS = [
  fontPullquote.variable,
  fontBody.variable,
  fontMono.variable,
  fontUI.variable,
].join(' ');

// Per-Universe — applied only on card-detail route.
export const UNIVERSE_FONT_VARS = [
  fontBakerStreet.variable,
  fontEnchantedKingdom.variable,
  fontWonderland.variable,
  fontGothicHorror.variable,
  fontGreekMyth.variable,
  fontEKBody.variable,
].join(' ');

export const ALL_FONT_VARS = `${SHARED_FONT_VARS} ${UNIVERSE_FONT_VARS}`;
