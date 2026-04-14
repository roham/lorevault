'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { Card, SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';
import { getCardMeta, getAgingTiers, getOriginBadge, getPopulationData, type AgingTiers, type OriginBadge, type PopulationData } from '@/lib/store';
import { generateCardDNA, type CardDNA } from '@/lib/card-dna';
import { getSeasonalCardIds } from '@/data/seasonal-cards';
import { isSeasonActive } from '@/lib/seasonal-vault';

function getCardArtPath(card: Card): string {
  const base = `${card.setSlug}-${card.character}-${card.moment}`.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  // Non-base variants get scarcity+parallel suffix for differentiated art
  const id = (card.parallel === 'base' && card.scarcity === 'common') ? base : `${base}-${card.scarcity}-${card.parallel}`;
  return `/cards/${id}.webp`;
}

function CardArt({ card, borderColor, size: s }: { card: Card; borderColor: string; size: typeof SIZE_MAP[keyof typeof SIZE_MAP] }) {
  const [imgSrc, setImgSrc] = useState(() => getCardArtPath(card));
  const [hasArt, setHasArt] = useState(true);
  // Fallback chain: variant-specific path → base path → monogram
  const basePath = `/cards/${card.setSlug}-${card.character}-${card.moment}`.toLowerCase().replace(/[^a-z0-9\/]/g, '-').replace(/-+/g, '-') + '.webp';
  return (
    <>
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
            className={`${s.initial} font-bold leading-none`}
            style={{
              color: `${borderColor}20`,
              textShadow: `0 0 40px ${borderColor}10`,
              fontFamily: 'Georgia, serif',
            }}
          >
            {card.character[0]}
          </span>
          <span className={`${s.symbol} -mt-2 drop-shadow-lg relative z-10`} style={{ opacity: 0.9 }}>
            {card.symbol}
          </span>
        </div>
      )}
    </>
  );
}

interface CardItemProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: (card: Card) => void;
  showPrice?: boolean;
  showAddButton?: boolean;
  onAdd?: (card: Card) => void;
  interactive?: boolean;
  forceRevealed?: boolean;
}

const SIZE_MAP = {
  sm: { w: 140, h: 196, symbol: 'text-3xl', name: 'text-[10px]', moment: 'text-[8px]', serial: 'text-[7px]', initial: 'text-[36px]' },
  md: { w: 180, h: 252, symbol: 'text-4xl', name: 'text-xs', moment: 'text-[10px]', serial: 'text-[9px]', initial: 'text-[50px]' },
  lg: { w: 260, h: 364, symbol: 'text-6xl', name: 'text-sm', moment: 'text-xs', serial: 'text-[10px]', initial: 'text-[72px]' },
  xl: { w: 320, h: 448, symbol: 'text-7xl', name: 'text-base', moment: 'text-sm', serial: 'text-xs', initial: 'text-[90px]' },
};

function getAgingFilter(tiers: AgingTiers | null): string | undefined {
  if (!tiers) return undefined;
  const f: string[] = [];
  switch (tiers.battle) {
    case 'pristine': f.push('brightness(1.06)', 'contrast(1.02)'); break;
    case 'seasoned': f.push('sepia(0.04)', 'brightness(1.01)'); break;
    case 'battle-worn': f.push('sepia(0.06)', 'contrast(1.04)', 'brightness(0.97)'); break;
    case 'veteran': f.push('sepia(0.10)', 'contrast(1.06)', 'brightness(0.94)'); break;
  }
  switch (tiers.time) {
    case 'bonded': f.push('saturate(1.08)'); break;
    case 'ancient': f.push('saturate(1.12)'); break;
  }
  return f.length > 0 ? f.join(' ') : undefined;
}

function AgingOverlays({ tiers }: { tiers: AgingTiers | null }) {
  if (!tiers) return null;
  return (
    <>
      {tiers.battle === 'pristine' && (
        <div className="absolute inset-0 pointer-events-none z-[15] aging-pristine-sheen" />
      )}
      {tiers.battle === 'battle-worn' && (
        <div className="absolute inset-0 pointer-events-none z-[15]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.18) 100%)', mixBlendMode: 'multiply' }} />
      )}
      {tiers.battle === 'veteran' && (
        <>
          <div className="absolute inset-0 pointer-events-none z-[15]"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.25) 100%)', mixBlendMode: 'multiply' }} />
          <div className="absolute inset-[3px] pointer-events-none z-[15] rounded-[10px]"
            style={{ border: '1px solid rgba(180,140,80,0.12)', boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)' }} />
        </>
      )}
      {tiers.time === 'bonded' && (
        <div className="absolute inset-0 pointer-events-none z-[14] aging-bonded-glow" />
      )}
      {tiers.time === 'ancient' && (
        <div className="absolute inset-0 pointer-events-none z-[14] aging-ancient-glow" />
      )}
    </>
  );
}

function DNAOverlay({ dna, size }: { dna: CardDNA | null; size: string }) {
  if (!dna || size === 'sm') return null; // Skip DNA on sm cards for performance
  return (
    <>
      {/* Background pattern SVG at low opacity */}
      <div className="absolute inset-0 pointer-events-none z-[13] overflow-hidden" style={{ opacity: 0.04 }}>
        <svg
          className="w-full h-full"
          viewBox="0 0 16 16"
          preserveAspectRatio="none"
          style={{ filter: `hue-rotate(${dna.hueShift}deg)` }}
        >
          <pattern id={`dna-bg-${dna.background.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d={dna.background.svg} fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#dna-bg-${dna.background.id})`} />
        </svg>
      </div>
      {/* Hue shift filter on card */}
      <div
        className="absolute inset-0 pointer-events-none z-[12]"
        style={{ filter: `hue-rotate(${dna.hueShift}deg)`, mixBlendMode: 'color', opacity: 0.15 }}
      />
      {/* Border motif gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[14] rounded-xl"
        style={{ background: `linear-gradient(${dna.border.gradient})`, opacity: 0.6 }}
      />
      {/* Watermark glyph */}
      {(size === 'lg' || size === 'xl') && (
        <div className="absolute bottom-8 right-2 pointer-events-none z-[13] text-white/[0.03] text-4xl">
          {dna.watermark}
        </div>
      )}
    </>
  );
}

function getSerialColor(tier: PopulationData['serialTier']): string {
  switch (tier) {
    case 'genesis': return '#ffd700';
    case 'low': return '#f59e0b';
    case 'mid': return '#c0c0c0';
    default: return 'rgba(255,255,255,0.4)';
  }
}

export default function CardItem(props: CardItemProps) {
  if (props.interactive === false) return <CardItemStatic {...props} />;
  return <CardItemInteractive {...props} />;
}

function CardItemStatic({
  card,
  size = 'md',
  onClick,
  showPrice = false,
  showAddButton = false,
  onAdd,
  forceRevealed = false,
}: CardItemProps) {
  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const parallelConfig = PARALLEL_CONFIG[card.parallel];
  // Collectibility: check sealed state and aging
  const [meta] = useState(() => {
    if (typeof window === 'undefined') return null;
    const allMeta = getCardMeta();
    return allMeta[card.id] || null;
  });
  const isSealed = forceRevealed ? false : (meta?.sealed ?? false);
  const [agingTiers] = useState<AgingTiers | null>(() => {
    if (typeof window === 'undefined') return null;
    return getAgingTiers(card.id);
  });
  const [originBadge] = useState<OriginBadge | null>(() => {
    if (typeof window === 'undefined') return null;
    return getOriginBadge(card.id);
  });
  const [popData] = useState<PopulationData | null>(() => {
    if (typeof window === 'undefined') return null;
    return getPopulationData(card);
  });
  const [dna] = useState<CardDNA | null>(() => {
    if (typeof window === 'undefined') return null;
    return generateCardDNA(card.id, card.serialNumber);
  });
  const s = SIZE_MAP[size];
  const borderColor = scarcityConfig.color;
  const borderWidth = card.scarcity === 'legendary' ? 3 : card.scarcity === 'epic' ? 2.5 : 2;
  const noiseOpacity = card.scarcity === 'common' || card.scarcity === 'uncommon' ? 0.07 : 0.04;
  const getGlowClass = () => {
    switch (card.scarcity) {
      case 'legendary': return 'glow-legendary';
      case 'epic': return 'glow-epic';
      case 'rare': return 'glow-rare';
      default: return '';
    }
  };
  const getCornerSize = (): number | null => {
    switch (card.scarcity) { case 'legendary': return 14; case 'epic': return 10; case 'rare': return 8; default: return null; }
  };

  return (
    <div
      className={`relative select-none flex-shrink-0 ${getGlowClass()}`}
      style={{ width: s.w, height: s.h, filter: getAgingFilter(agingTiers) }}
      onClick={() => onClick?.(card)}
    >
      <div className="w-full h-full relative">
        <div
          className="absolute inset-0 rounded-xl overflow-hidden card-depth card-edge-bottom"
          style={{ border: `${borderWidth}px solid ${borderColor}` }}
        >
          <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)` }} />
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: noiseOpacity, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
          <div className="absolute inset-0 pointer-events-none rounded-xl card-edge-light" />
          {card.parallel === 'silver' && <div className="absolute inset-0 pointer-events-none silver-effect" />}
          {card.parallel === 'gold' && <><div className="absolute inset-0 pointer-events-none gold-ambient" /><div className="absolute inset-0 pointer-events-none gold-effect" /></>}
          {card.parallel === 'holographic' && <><div className="absolute inset-0 pointer-events-none holo-effect" /><div className="absolute inset-0 pointer-events-none holo-lines" /></>}
          {card.parallel === 'obsidian' && <><div className="absolute inset-0 pointer-events-none obsidian-depth" /><div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(100,100,255,0.15) 0%, transparent 60%)' }} /><div className="absolute inset-[2px] pointer-events-none rounded-[10px]" style={{ border: '1px solid rgba(99,102,241,0.15)', animation: 'obsidian-pulse 4s ease-in-out infinite' }} /></>}
          {getCornerSize() && ['tl', 'tr', 'bl', 'br'].map((pos) => (
            <span key={pos} className={`corner-accent corner-${pos}`} style={{ '--accent-size': `${getCornerSize()}px`, '--accent-color': `${borderColor}${card.scarcity === 'legendary' ? 'cc' : '80'}` } as React.CSSProperties} />
          ))}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: borderColor, boxShadow: card.scarcity === 'legendary' ? `0 0 12px ${borderColor}` : card.scarcity === 'epic' ? `0 0 8px ${borderColor}` : 'none' }} />
          {/* Card art — always rendered, covered by sealed overlay when sealed */}
          <CardArt card={card} borderColor={borderColor} size={s} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />

          {/* Aging visual effects — behind sealed overlay */}
          <AgingOverlays tiers={agingTiers} />

          {/* Card DNA — procedural visual identity */}
          <DNAOverlay dna={dna} size={size} />

          {/* Origin badge — provenance marker */}
          {!isSealed && originBadge && (
            <div
              className="absolute top-1.5 left-1.5 z-[16] flex items-center gap-1 px-1.5 py-0.5 rounded-full backdrop-blur-sm"
              style={{ background: `${originBadge.color}20`, border: `1px solid ${originBadge.color}40` }}
            >
              <span className="text-[8px]">{originBadge.icon}</span>
              {(size === 'lg' || size === 'xl') && (
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: originBadge.color }}>{originBadge.label}</span>
              )}
            </div>
          )}

          {/* SEALED overlay — frosted glass with scarcity glow */}
          {isSealed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
              <div className="relative z-10 text-center">
                <div className={`${size === 'xl' ? 'w-20 h-20' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'} rounded-full mx-auto mb-2 flex items-center justify-center`}
                  style={{ background: `${borderColor}20`, border: `2px solid ${borderColor}40`, boxShadow: `0 0 ${size === 'lg' || size === 'xl' ? '30' : '20'}px ${borderColor}30` }}>
                  <span className={`${size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-3xl' : 'text-lg'}`} style={{ color: borderColor }}>?</span>
                </div>
                <div className={`${size === 'lg' || size === 'xl' ? 'text-xs' : s.serial} font-mono font-bold uppercase`} style={{ color: borderColor }}>{scarcityConfig.label}</div>
                <div className={`${size === 'lg' || size === 'xl' ? 'text-xs' : s.serial} text-white/30 mt-0.5`}>Sealed</div>
              </div>
            </div>
          )}

          {/* Vault Sealed overlay — seasonal cards after expiry */}
          {!isSealed && typeof window !== 'undefined' && getSeasonalCardIds().includes(card.id) && !isSeasonActive() && (
            <div className="absolute inset-0 z-[18] flex items-center justify-center rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="relative text-center z-10">
                <span className={`${size === 'xl' || size === 'lg' ? 'text-2xl' : 'text-lg'}`}>🔒</span>
                <div className={`${size === 'lg' || size === 'xl' ? 'text-[9px]' : 'text-[7px]'} font-bold text-amber-400 uppercase tracking-wider mt-0.5`}>
                  Vault Sealed
                </div>
              </div>
            </div>
          )}

          {/* Card info — character hidden if sealed */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className={`${s.name} font-semibold text-white truncate leading-tight`}>
              {isSealed ? '???' : card.character}
            </div>
            <div className={`${s.moment} text-white/50 truncate`}>
              {isSealed ? 'Tap to reveal' : card.moment}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className={`${s.serial} font-mono font-bold uppercase tracking-wider`} style={{ color: borderColor }}>
                {scarcityConfig.label}{popData && (size === 'lg' || size === 'xl') ? ` · ${popData.totalMinted.toLocaleString()}` : ''}
              </span>
              {!isSealed && card.scarcity !== 'common' && popData && (
                <span className={`${s.serial} font-mono font-bold`} style={{ color: getSerialColor(popData.serialTier) }}>
                  {popData.serialTier === 'genesis' ? '✦ ' : popData.serialTier === 'low' ? '★ ' : ''}#{card.serialNumber}/{popData.totalMinted}
                </span>
              )}
            </div>
          </div>
          {showPrice && card.listed && (
            <div className="absolute top-2 left-8 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-green-500/20">
              <span className={`${s.serial} font-mono text-green-400 font-bold`}>${card.price.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
      {showAddButton && onAdd && (
        <div role="button" tabIndex={0} onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(card); }}
          className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-accent text-white text-base font-bold flex items-center justify-center z-30 shadow-lg cursor-pointer active:scale-90 transition-transform touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}>+</div>
      )}
    </div>
  );
}

function CardItemInteractive({
  card,
  size = 'md',
  onClick,
  showPrice = false,
  showAddButton = false,
  onAdd,
  interactive = true,
}: CardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const parallelConfig = PARALLEL_CONFIG[card.parallel];
  const cardRef = useRef<HTMLDivElement>(null);
  const [agingTiers] = useState<AgingTiers | null>(() => {
    if (typeof window === 'undefined') return null;
    return getAgingTiers(card.id);
  });
  const [originBadge] = useState<OriginBadge | null>(() => {
    if (typeof window === 'undefined') return null;
    return getOriginBadge(card.id);
  });
  const [popData] = useState<PopulationData | null>(() => {
    if (typeof window === 'undefined') return null;
    return getPopulationData(card);
  });
  const [dna] = useState<CardDNA | null>(() => {
    if (typeof window === 'undefined') return null;
    return generateCardDNA(card.id, card.serialNumber);
  });
  const s = SIZE_MAP[size];

  // 3D tilt — only created for interactive cards
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mx, my]);

  const handlePointerLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const borderColor = scarcityConfig.color;
  const borderWidth = card.scarcity === 'legendary' ? 3 : card.scarcity === 'epic' ? 2.5 : 2;

  const getParallelClass = () => {
    switch (card.parallel) {
      case 'silver': return 'silver-effect';
      case 'gold': return 'gold-effect';
      case 'holographic': return 'holo-effect';
      default: return '';
    }
  };

  const getGlowClass = () => {
    switch (card.scarcity) {
      case 'legendary': return 'glow-legendary';
      case 'epic': return 'glow-epic';
      case 'rare': return 'glow-rare';
      default: return '';
    }
  };

  // Corner accent size by scarcity
  const getCornerSize = (): number | null => {
    switch (card.scarcity) {
      case 'legendary': return 14;
      case 'epic': return 10;
      case 'rare': return 8;
      default: return null;
    }
  };

  const noiseOpacity = card.scarcity === 'common' || card.scarcity === 'uncommon' ? 0.07 : 0.04;

  return (
    <motion.div
      ref={cardRef}
      className={`relative cursor-pointer select-none flex-shrink-0 ${getGlowClass()}`}
      style={{ width: s.w, height: s.h, perspective: 800, filter: getAgingFilter(agingTiers) }}
      whileHover={interactive ? { scale: 1.04, y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      onClick={() => {
        if (onClick) onClick(card);
        else if (interactive) setIsFlipped(!isFlipped);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          transformStyle: 'preserve-3d',
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden card-depth card-edge-bottom"
          style={{
            backfaceVisibility: 'hidden',
            border: `${borderWidth}px solid ${borderColor}`,
          }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(145deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)` }}
          />

          {/* Noise texture — louder for common/uncommon */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: noiseOpacity,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Edge highlight */}
          <div className="absolute inset-0 pointer-events-none rounded-xl card-edge-light" />

          {/* Parallel overlay */}
          {card.parallel === 'silver' && (
            <div className="absolute inset-0 pointer-events-none silver-effect" />
          )}
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
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(100,100,255,0.15) 0%, transparent 60%)' }} />
              <div
                className="absolute inset-[2px] pointer-events-none rounded-[10px]"
                style={{ border: '1px solid rgba(99,102,241,0.15)', animation: 'obsidian-pulse 4s ease-in-out infinite' }}
              />
            </>
          )}

          {/* Corner accents for rare+ */}
          {getCornerSize() && (
            <>
              {['tl', 'tr', 'bl', 'br'].map((pos) => (
                <span
                  key={pos}
                  className={`corner-accent corner-${pos}`}
                  style={{
                    '--accent-size': `${getCornerSize()}px`,
                    '--accent-color': `${borderColor}${card.scarcity === 'legendary' ? 'cc' : '80'}`,
                  } as React.CSSProperties}
                />
              ))}
            </>
          )}

          {/* Scarcity top strip */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: borderColor,
              boxShadow: card.scarcity === 'legendary' ? `0 0 12px ${borderColor}` : card.scarcity === 'epic' ? `0 0 8px ${borderColor}` : 'none',
            }}
          />

          {/* Set badge */}
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[8px]">
              {card.setSlug === 'baker-street' ? '🔍' : card.setSlug === 'enchanted-kingdom' ? '👑' : card.setSlug === 'wonderland' ? '🐇' : card.setSlug === 'gothic-horror' ? '🦇' : card.setSlug === 'olympus' ? '⚡' : '❄️'}
            </span>
          </div>

          {/* Parallel badge */}
          {card.parallel !== 'base' && (
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider backdrop-blur-sm"
              style={{
                background: card.parallel === 'obsidian' ? 'rgba(26,26,46,0.9)' : 'rgba(0,0,0,0.6)',
                color: card.parallel === 'gold' ? '#ffd700' : card.parallel === 'silver' ? '#c0c0c0' : card.parallel === 'holographic' ? '#ff6ec7' : '#818cf8',
                border: `1px solid ${card.parallel === 'gold' ? 'rgba(255,215,0,0.3)' : card.parallel === 'silver' ? 'rgba(192,192,192,0.3)' : card.parallel === 'holographic' ? 'rgba(255,110,199,0.3)' : 'rgba(99,102,241,0.3)'}`,
              }}
            >
              {parallelConfig.label}
            </div>
          )}

          {/* Card art: real image with fallback */}
          <CardArt card={card} borderColor={borderColor} size={s} />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.5) 100%)',
          }} />

          {/* Aging visual effects */}
          <AgingOverlays tiers={agingTiers} />

          {/* Card DNA — procedural visual identity */}
          <DNAOverlay dna={dna} size={size} />

          {/* Origin badge — provenance marker */}
          {originBadge && (
            <div
              className="absolute top-1.5 left-1.5 z-[16] flex items-center gap-1 px-1.5 py-0.5 rounded-full backdrop-blur-sm"
              style={{ background: `${originBadge.color}20`, border: `1px solid ${originBadge.color}40` }}
            >
              <span className="text-[8px]">{originBadge.icon}</span>
              {(size === 'lg' || size === 'xl') && (
                <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: originBadge.color }}>{originBadge.label}</span>
              )}
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className={`${s.name} font-semibold text-white truncate leading-tight`}>
              {card.character}
            </div>
            <div className={`${s.moment} text-white/50 truncate`}>
              {card.moment}
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className={`${s.serial} font-mono font-bold uppercase tracking-wider`} style={{ color: borderColor }}>
                {scarcityConfig.label}{popData && (size === 'lg' || size === 'xl') ? ` · ${popData.totalMinted.toLocaleString()}` : ''}
              </span>
              {card.scarcity !== 'common' && popData && (
                <span className={`${s.serial} font-mono font-bold`} style={{ color: getSerialColor(popData.serialTier) }}>
                  {popData.serialTier === 'genesis' ? '✦ ' : popData.serialTier === 'low' ? '★ ' : ''}#{card.serialNumber}/{popData.totalMinted}
                </span>
              )}
            </div>
          </div>

          {/* Price tag */}
          {showPrice && card.listed && (
            <div className="absolute top-2 left-8 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-green-500/20">
              <span className={`${s.serial} font-mono text-green-400 font-bold`}>
                ${card.price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `${borderWidth}px solid ${borderColor}`,
            background: `linear-gradient(145deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.35), 0 12px 40px rgba(0,0,0,0.25)',
          }}
        >
          <div className="h-1" style={{ background: borderColor }} />
          <div className="p-3 flex flex-col flex-1">
            <div className={`${s.name} font-bold text-white mb-0.5 leading-tight`}>{card.character}</div>
            <div className={`${s.moment} text-accent mb-1`}>{card.moment}</div>
            <div className={`${s.serial} text-white/40 mb-2`}>{card.set}</div>
            <div className="h-px bg-white/10 mb-2" />
            <div className={`${s.serial} text-white/60 italic leading-relaxed flex-1 overflow-hidden`}>
              {card.loreText}
            </div>
            <div className="h-px bg-white/10 mt-2 mb-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`${s.serial} font-mono font-bold uppercase`} style={{ color: borderColor }}>
                  {scarcityConfig.label}
                </span>
                {card.parallel !== 'base' && (
                  <span className={`${s.serial} text-white/30`}>{parallelConfig.label}</span>
                )}
              </div>
              {card.scarcity !== 'common' && (
                <span className={`${s.serial} font-mono text-white/40`}>
                  #{card.serialNumber}/{card.maxSerial}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add to showcase button — ALWAYS VISIBLE */}
      {showAddButton && onAdd && (
        <div
          role="button"
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAdd(card);
          }}
          className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-accent text-white text-base font-bold flex items-center justify-center z-30 shadow-lg cursor-pointer active:scale-90 transition-transform touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          +
        </div>
      )}
    </motion.div>
  );
}
