'use client';

// Card DNA — Procedural visual identity per card instance
// Deterministic: same card always renders identically from seeded hash

function hashCode(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ===== Trait Definitions =====

export const BACKGROUND_PATTERNS = [
  { id: 'runes', label: 'Runes', svg: 'M5,5 L8,2 L11,5 M5,11 L8,14 L11,11 M2,8 L5,5 L5,11 M14,8 L11,5 L11,11' },
  { id: 'circuits', label: 'Circuits', svg: 'M0,8 L4,8 L4,4 L8,4 M8,12 L12,12 L12,8 L16,8 M4,12 L4,16 M12,0 L12,4' },
  { id: 'nebula', label: 'Nebula', svg: 'M8,4 Q12,6 10,10 Q8,14 6,10 Q4,6 8,4 M3,3 Q5,1 7,3 M13,13 Q11,15 9,13' },
  { id: 'scales', label: 'Scales', svg: 'M0,8 Q4,4 8,8 Q12,12 16,8 M0,16 Q4,12 8,16 Q12,20 16,16 M0,0 Q4,-4 8,0 Q12,4 16,0' },
  { id: 'hexgrid', label: 'Hex Grid', svg: 'M4,0 L8,2 L8,6 L4,8 L0,6 L0,2 Z M12,0 L16,2 L16,6 L12,8 L8,6 L8,2 Z' },
  { id: 'vines', label: 'Vines', svg: 'M2,16 Q4,12 3,8 Q2,4 4,2 M4,2 Q6,4 5,6 M8,16 Q10,10 9,6 Q8,2 10,0' },
  { id: 'stardust', label: 'Stardust', svg: 'M3,3 L3.5,2 L4,3 L5,3.5 L4,4 L3.5,5 L3,4 L2,3.5 Z M11,9 L11.5,8 L12,9 L13,9.5 L12,10 L11.5,11 L11,10 L10,9.5 Z' },
  { id: 'waves', label: 'Waves', svg: 'M0,4 Q4,0 8,4 Q12,8 16,4 M0,12 Q4,8 8,12 Q12,16 16,12' },
  { id: 'shards', label: 'Shards', svg: 'M8,0 L12,6 L8,8 L4,6 Z M0,8 L4,10 L2,14 Z M16,8 L12,10 L14,14 Z' },
  { id: 'glyphs', label: 'Glyphs', svg: 'M4,2 L4,6 L8,6 M10,2 L14,2 L14,6 L10,6 M4,10 L4,14 M10,10 L14,14' },
  { id: 'smoke', label: 'Smoke', svg: 'M4,16 Q2,12 4,10 Q6,8 4,4 Q2,0 4,-2 M10,16 Q12,12 10,8 Q8,4 10,0' },
  { id: 'lattice', label: 'Lattice', svg: 'M0,0 L16,16 M16,0 L0,16 M8,0 L8,16 M0,8 L16,8' },
] as const;

export const BORDER_MOTIFS = [
  { id: 'thorned', label: 'Thorned', gradient: '45deg, transparent 40%, currentColor 41%, currentColor 42%, transparent 43%' },
  { id: 'gilded', label: 'Gilded', gradient: '90deg, #ffd70030 0%, transparent 30%, transparent 70%, #ffd70030 100%' },
  { id: 'frost', label: 'Frost', gradient: '135deg, #93c5fd20 0%, transparent 40%, transparent 60%, #93c5fd20 100%' },
  { id: 'ember', label: 'Ember', gradient: '180deg, #f9731620 0%, transparent 40%, transparent 60%, #f9731620 100%' },
  { id: 'void', label: 'Void', gradient: '90deg, #a855f720 0%, transparent 50%, #a855f720 100%' },
  { id: 'crystal', label: 'Crystal', gradient: '45deg, #22d3ee20 0%, transparent 25%, transparent 75%, #22d3ee20 100%' },
  { id: 'shadow', label: 'Shadow', gradient: '180deg, transparent 0%, #00000040 50%, transparent 100%' },
  { id: 'aurora', label: 'Aurora', gradient: '135deg, #34d39920 0%, #818cf820 50%, #a855f720 100%' },
] as const;

export const PARTICLES = [
  { id: 'embers', label: 'Embers', color: '#f97316', char: '●' },
  { id: 'snow', label: 'Snow', color: '#93c5fd', char: '●' },
  { id: 'lightning', label: 'Lightning', color: '#facc15', char: '⚡' },
  { id: 'petals', label: 'Petals', color: '#f472b6', char: '●' },
  { id: 'void-dust', label: 'Void Dust', color: '#a855f7', char: '●' },
  { id: 'starfield', label: 'Starfield', color: '#fde68a', char: '✦' },
] as const;

const WATERMARK_GLYPHS = [
  '⚔', '🛡', '👑', '⚡', '🔥', '❄', '✦', '◆', '☽', '☀',
  '⊕', '∞', '◈', '✧', '⟐', '△', '◇', '⚜', '♦', '⟡',
] as const;

const CARD_BACK_VARIANTS = ['classic', 'ornate', 'minimal', 'runic', 'celestial', 'void'] as const;

// ===== DNA Generator =====

export interface CardDNA {
  background: typeof BACKGROUND_PATTERNS[number];
  hueShift: number;        // -30 to +30 degrees
  border: typeof BORDER_MOTIFS[number];
  particle: typeof PARTICLES[number];
  watermark: string;
  cardBack: typeof CARD_BACK_VARIANTS[number];
}

export function generateCardDNA(cardId: string, serialNumber: number = 0): CardDNA {
  const seed = hashCode(cardId) + serialNumber * 31;
  const rand = seeded(seed);

  const bgIdx = Math.floor(rand() * BACKGROUND_PATTERNS.length);
  const hueShift = Math.floor(rand() * 61) - 30; // -30 to +30
  const borderIdx = Math.floor(rand() * BORDER_MOTIFS.length);
  const particleIdx = Math.floor(rand() * PARTICLES.length);
  const watermarkIdx = Math.floor(rand() * WATERMARK_GLYPHS.length);
  const cardBackIdx = Math.floor(rand() * CARD_BACK_VARIANTS.length);

  return {
    background: BACKGROUND_PATTERNS[bgIdx],
    hueShift,
    border: BORDER_MOTIFS[borderIdx],
    particle: PARTICLES[particleIdx],
    watermark: WATERMARK_GLYPHS[watermarkIdx],
    cardBack: CARD_BACK_VARIANTS[cardBackIdx],
  };
}

// CSS custom properties for a card's DNA
export function getDNACssVars(dna: CardDNA): Record<string, string> {
  return {
    '--dna-hue-shift': `${dna.hueShift}deg`,
    '--dna-particle-color': dna.particle.color,
    '--dna-border-gradient': dna.border.gradient,
  };
}

// Human-readable trait summary
export function getDNATraitString(dna: CardDNA): string {
  return `${dna.background.label} / ${dna.border.label} / ${dna.particle.label}`;
}
