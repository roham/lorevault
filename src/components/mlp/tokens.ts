// LoreVault MLP — design tokens
// Mobile-first. 375px primary viewport. Pane colors derive from doctrine.

import type { CSSProperties } from 'react';
import type { PaneId, Rarity, ContrabandRelation } from './types';

// ─── Surface palette ─────────────────────────────────────────────────────────

export const SURFACE = {
  void: '#0a0907',
  card: '#12110F',
  elevated: '#1A1814',
  rule: 'rgba(201,162,107,0.15)',
} as const;

export const TEXT = {
  primary: '#F4EFE3',
  body: '#d8cfc0',
  muted: '#9C9388',
  whisper: '#6e655a',
} as const;

// ─── Pane colors ─────────────────────────────────────────────────────────────
// Each Pane gets a distinct accent. Used in tiles, progress bars, badges.
// Lud-Border: civic-Mirrlees — soft late-fog blue
// Old-Ones-Persist: Lovecraft-warped — bruised ocean-deep
// Sinterklaas-Reigns: Northern-pagan-feast — bone-white winter

export const PANE_COLORS: Record<PaneId, { accent: string; gradient: string; on: string }> = {
  'lud-border': {
    accent: '#7A8FA0',
    gradient: 'linear-gradient(135deg, #1c2429 0%, #0a0907 100%)',
    on: '#F4EFE3',
  },
  'old-ones-persist': {
    accent: '#3B5862',
    gradient: 'linear-gradient(135deg, #14222a 0%, #050708 100%)',
    on: '#E8DEC8',
  },
  'sinterklaas-reigns': {
    accent: '#C7B89E',
    gradient: 'linear-gradient(135deg, #2a261d 0%, #0a0907 100%)',
    on: '#F4EFE3',
  },
};

// ─── Rarity bands ────────────────────────────────────────────────────────────

export const RARITY: Record<Rarity, { label: string; color: string; textOn: string }> = {
  common: { label: 'Common', color: '#9C7B3A', textOn: '#0a0907' },
  uncommon: { label: 'Uncommon', color: '#7A8FA0', textOn: '#0a0907' },
  rare: { label: 'Rare', color: '#6B8FA8', textOn: '#0a0907' },
  legendary: { label: 'Legendary', color: '#C9A26B', textOn: '#0a0907' },
  contraband: { label: 'Contraband', color: '#8B1A1A', textOn: '#F4EFE3' },
};

// ─── Contraband relation colors ──────────────────────────────────────────────

export const CONTRABAND_RELATION: Record<
  ContrabandRelation,
  { label: string; color: string }
> = {
  carries: { label: 'Carries', color: '#8B1A1A' },
  refuses: { label: 'Refuses', color: '#7A8FA0' },
  mediates: { label: 'Mediates', color: '#C9A26B' },
  exposes: { label: 'Exposes', color: '#B5651D' },
};

// ─── Type scale ──────────────────────────────────────────────────────────────

export const TYPE = {
  meta: {
    fontFamily: 'var(--font-baker-street, "EB Garamond"), serif',
    fontSize: '0.65rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
  },
  bodySmall: {
    fontFamily: 'var(--font-v2-ui, "Inter"), system-ui, sans-serif',
    fontSize: '0.85rem',
    lineHeight: 1.55,
  },
  body: {
    fontFamily: 'var(--font-v2-ui, "Inter"), system-ui, sans-serif',
    fontSize: '1rem',
    lineHeight: 1.65,
  },
  italic: {
    fontFamily: 'var(--font-pullquote, Georgia), serif',
    fontStyle: 'italic' as const,
  },
  h3: {
    fontFamily: 'var(--font-pullquote, Georgia), serif',
    fontStyle: 'italic' as const,
    fontSize: '1.2rem',
    lineHeight: 1.3,
  },
  h2: {
    fontFamily: 'var(--font-pullquote, Georgia), serif',
    fontStyle: 'italic' as const,
    fontSize: 'clamp(1.55rem, 4vw, 2.1rem)',
    lineHeight: 1.15,
  },
  h1: {
    fontFamily: 'var(--font-pullquote, Georgia), serif',
    fontStyle: 'italic' as const,
    fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
    lineHeight: 1.1,
  },
} as const;

// ─── Common style helpers ────────────────────────────────────────────────────

export const PANEL: CSSProperties = {
  background: SURFACE.card,
  border: `1px solid ${SURFACE.rule}`,
  borderRadius: 4,
  padding: '1rem 1.1rem',
};

export const BUTTON_PRIMARY: CSSProperties = {
  background: TEXT.primary,
  color: SURFACE.void,
  border: 'none',
  borderRadius: 2,
  padding: '0.95rem 1.5rem',
  fontFamily: 'var(--font-v2-ui, "Inter"), system-ui, sans-serif',
  fontSize: '1rem',
  fontWeight: 500,
  letterSpacing: '0.03em',
  cursor: 'pointer',
  width: '100%',
  minHeight: 52,
};

export const BUTTON_SECONDARY: CSSProperties = {
  background: 'transparent',
  color: TEXT.primary,
  border: `1px solid ${TEXT.primary}`,
  borderRadius: 2,
  padding: '0.85rem 1.4rem',
  fontFamily: 'var(--font-v2-ui, "Inter"), system-ui, sans-serif',
  fontSize: '0.95rem',
  fontWeight: 500,
  letterSpacing: '0.03em',
  cursor: 'pointer',
  width: '100%',
  minHeight: 48,
};

export const PILL: CSSProperties = {
  background: 'rgba(244,239,227,0.08)',
  color: TEXT.body,
  border: `1px solid ${SURFACE.rule}`,
  borderRadius: 999,
  padding: '0.32rem 0.7rem',
  fontFamily: 'var(--font-baker-street, "EB Garamond"), serif',
  fontSize: '0.65rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
};

// Card aspect ratio (standard collectible card)
export const CARD_ASPECT = '5 / 7';
