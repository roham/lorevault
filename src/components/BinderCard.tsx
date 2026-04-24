'use client';

import { useState } from 'react';
import { Card, SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';

function getCardArtPath(card: Card): string {
  const base = `${card.setSlug}-${card.character}-${card.moment}`.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const id = (card.parallel === 'base' && card.scarcity === 'common') ? base : `${base}-${card.scarcity}-${card.parallel}`;
  return `/cards/${id}.webp`;
}

/**
 * BinderCard — performance-optimized card for binder/collection grid.
 * Renders ONLY: card art, name, scarcity border, parallel effect.
 * NO: aging, DNA, origin badge, sealed, vault, ghost, mutation, population.
 * Uses CSS containment for paint isolation during drag operations.
 */
export default function BinderCard({ card }: { card: Card }) {
  const [imgSrc, setImgSrc] = useState(() => getCardArtPath(card));
  const [hasArt, setHasArt] = useState(true);
  const basePath = `/cards/${card.setSlug}-${card.character}-${card.moment}`.toLowerCase().replace(/[^a-z0-9\/]/g, '-').replace(/-+/g, '-') + '.webp';

  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const borderColor = scarcityConfig.color;
  const borderWidth = card.scarcity === 'legendary' ? 3 : card.scarcity === 'epic' ? 2.5 : 2;

  return (
    <div
      className="binder-card relative select-none flex-shrink-0"
      style={{
        width: 260,
        height: 364,
        contain: 'layout style paint',
        borderRadius: '0.75rem',
      }}
    >
      <div
        className="absolute inset-0 rounded-xl overflow-hidden card-depth card-edge-bottom"
        style={{ border: `${borderWidth}px solid ${borderColor}` }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(145deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)` }}
        />

        {/* Card art */}
        {hasArt && (
          <img
            src={imgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => {
              if (imgSrc !== basePath) { setImgSrc(basePath); }
              else { setHasArt(false); }
            }}
            loading="lazy"
          />
        )}
        {!hasArt && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-[72px] font-bold leading-none"
              style={{ color: `${borderColor}20`, textShadow: `0 0 40px ${borderColor}10`, fontFamily: 'Georgia, serif' }}
            >
              {card.character[0]}
            </span>
            <span className="text-6xl -mt-2 drop-shadow-lg relative z-10" style={{ opacity: 0.9 }}>
              {card.symbol}
            </span>
          </div>
        )}

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.5) 100%)' }}
        />

        {/* Parallel effects — CSS only, no JS animation */}
        {card.parallel === 'silver' && <div className="absolute inset-0 pointer-events-none silver-effect" />}
        {card.parallel === 'gold' && (
          <>
            <div className="absolute inset-0 pointer-events-none gold-ambient" />
            <div className="absolute inset-0 pointer-events-none gold-effect" />
          </>
        )}
        {card.parallel === 'holographic' && (
          <>
            <div className="absolute inset-0 pointer-events-none holo-effect" />
            <div className="absolute inset-0 pointer-events-none holo-lines" />
          </>
        )}
        {card.parallel === 'obsidian' && (
          <>
            <div className="absolute inset-0 pointer-events-none obsidian-depth" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(100,100,255,0.15) 0%, transparent 60%)' }}
            />
          </>
        )}

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: borderColor,
            boxShadow: card.scarcity === 'legendary' ? `0 0 12px ${borderColor}` : card.scarcity === 'epic' ? `0 0 8px ${borderColor}` : 'none',
          }}
        />

        {/* Card name bar */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/70 to-transparent">
          <div className="text-sm font-semibold text-white/90 truncate">{card.name}</div>
          <div className="text-[10px] text-white/40 truncate">{card.character} &middot; {scarcityConfig.label}</div>
        </div>

        {/* Edge highlight */}
        <div className="absolute inset-0 pointer-events-none rounded-xl card-edge-light" />
      </div>
    </div>
  );
}

/**
 * DragGhostCard — ultra-minimal card for DragOverlay.
 * Renders ONLY art + scarcity border. No text, no overlays.
 * Uses contain: strict since it's a floating element with fixed size.
 */
export function DragGhostCard({ card }: { card: Card }) {
  const [imgSrc, setImgSrc] = useState(() => getCardArtPath(card));
  const [hasArt, setHasArt] = useState(true);
  const basePath = `/cards/${card.setSlug}-${card.character}-${card.moment}`.toLowerCase().replace(/[^a-z0-9\/]/g, '-').replace(/-+/g, '-') + '.webp';

  const borderColor = SCARCITY_CONFIG[card.scarcity].color;
  const borderWidth = card.scarcity === 'legendary' ? 3 : card.scarcity === 'epic' ? 2.5 : 2;

  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        width: 260,
        height: 364,
        contain: 'strict',
        willChange: 'transform',
        borderRadius: '0.75rem',
        opacity: 0.85,
        filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 15px rgba(129,140,248,0.15))',
      }}
    >
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{ border: `${borderWidth}px solid ${borderColor}` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(145deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)` }}
        />
        {hasArt && (
          <img
            src={imgSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => {
              if (imgSrc !== basePath) { setImgSrc(basePath); }
              else { setHasArt(false); }
            }}
          />
        )}
        {!hasArt && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl drop-shadow-lg" style={{ opacity: 0.9 }}>{card.symbol}</span>
          </div>
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.4) 100%)' }}
        />
      </div>
    </div>
  );
}
