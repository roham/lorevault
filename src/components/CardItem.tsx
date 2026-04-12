'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';
import { Card, SCARCITY_CONFIG, PARALLEL_CONFIG } from '@/data/types';

interface CardItemProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (card: Card) => void;
  showPrice?: boolean;
  draggable?: boolean;
}

export default function CardItem({ card, size = 'md', onClick, showPrice = false, draggable = false }: CardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const parallelConfig = PARALLEL_CONFIG[card.parallel];
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  // Holographic gradient position
  const holoX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const holoY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sizeClasses = {
    sm: 'w-[140px] h-[196px]',
    md: 'w-[200px] h-[280px]',
    lg: 'w-[280px] h-[392px]',
  };

  const textSizes = {
    sm: { name: 'text-[10px]', moment: 'text-[8px]', serial: 'text-[8px]', symbol: 'text-3xl' },
    md: { name: 'text-xs', moment: 'text-[10px]', serial: 'text-[10px]', symbol: 'text-5xl' },
    lg: { name: 'text-sm', moment: 'text-xs', serial: 'text-xs', symbol: 'text-7xl' },
  };

  const borderColor = scarcityConfig.color;

  const getParallelOverlayClass = () => {
    switch (card.parallel) {
      case 'silver': return 'silver-effect';
      case 'gold': return 'gold-effect';
      case 'holographic': return 'holo-effect';
      default: return '';
    }
  };

  const getBoxShadow = () => {
    const base = `0 4px 20px rgba(0,0,0,0.3)`;
    switch (card.parallel) {
      case 'silver': return `${base}, 0 0 15px rgba(192,192,192,0.2)`;
      case 'gold': return `${base}, 0 0 20px rgba(255,215,0,0.25), 0 0 40px rgba(255,215,0,0.1)`;
      case 'holographic': return `${base}, 0 0 25px rgba(255,110,199,0.2), 0 0 50px rgba(128,0,255,0.1)`;
      case 'obsidian': return `${base}, 0 0 30px rgba(100,100,255,0.15), inset 0 0 30px rgba(0,0,0,0.3)`;
      default: return base;
    }
  };

  // Scarcity-specific border width
  const borderWidth = card.scarcity === 'legendary' ? 3 : card.scarcity === 'epic' ? 2.5 : 2;

  return (
    <motion.div
      ref={cardRef}
      className={`${sizeClasses[size]} relative cursor-pointer select-none flex-shrink-0`}
      whileHover={{ scale: 1.05, y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        if (onClick) onClick(card);
        else setIsFlipped(!isFlipped);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
      layout
      draggable={draggable}
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
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            border: `${borderWidth}px solid ${borderColor}`,
            boxShadow: getBoxShadow(),
          }}
        >
          {/* Card background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
            }}
          />

          {/* Noise texture overlay for premium feel */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Parallel overlay effect */}
          {card.parallel !== 'base' && card.parallel !== 'obsidian' && (
            <div className={`absolute inset-0 pointer-events-none rounded-xl ${getParallelOverlayClass()}`} />
          )}
          {card.parallel === 'obsidian' && (
            <>
              <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(100,100,255,0.15) 0%, transparent 60%)' }} />
              <div className="absolute inset-[2px] pointer-events-none rounded-[10px] border border-indigo-500/20" />
            </>
          )}

          {/* Scarcity indicator strip with glow */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: borderColor,
              boxShadow: card.scarcity === 'legendary' ? `0 0 10px ${borderColor}` : card.scarcity === 'epic' ? `0 0 6px ${borderColor}` : 'none',
            }}
          />

          {/* Set icon */}
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[8px]">
              {card.setSlug === 'baker-street' ? '🔍' : card.setSlug === 'enchanted-kingdom' ? '👑' : card.setSlug === 'wonderland' ? '🐇' : card.setSlug === 'gothic-horror' ? '🦇' : '⚡'}
            </span>
          </div>

          {/* Parallel badge */}
          {card.parallel !== 'base' && (
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider backdrop-blur-sm"
              style={{
                background: card.parallel === 'obsidian' ? 'rgba(26,26,46,0.9)' : 'rgba(0,0,0,0.5)',
                color: card.parallel === 'gold' ? '#ffd700' : card.parallel === 'silver' ? '#c0c0c0' : card.parallel === 'holographic' ? '#ff6ec7' : '#818cf8',
                border: `1px solid ${card.parallel === 'gold' ? 'rgba(255,215,0,0.3)' : card.parallel === 'silver' ? 'rgba(192,192,192,0.3)' : card.parallel === 'holographic' ? 'rgba(255,110,199,0.3)' : 'rgba(99,102,241,0.3)'}`,
              }}
            >
              {parallelConfig.label}
            </div>
          )}

          {/* Card art placeholder — monogram + symbol */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Large monogram initial */}
            <span
              className={`${size === 'lg' ? 'text-[80px]' : size === 'md' ? 'text-[56px]' : 'text-[36px]'} font-bold leading-none`}
              style={{
                color: `${borderColor}20`,
                textShadow: `0 0 40px ${borderColor}15`,
                fontFamily: 'Georgia, serif',
              }}
            >
              {card.character[0]}
            </span>
            {/* Emoji accent */}
            <span className={`${textSizes[size].symbol} -mt-2 drop-shadow-lg relative z-10`} style={{ opacity: 0.9 }}>
              {card.symbol}
            </span>
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none rounded-xl" style={{
            background: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }} />

          {/* Bottom info section */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <div className={`${textSizes[size].name} font-semibold text-white truncate leading-tight`}>
              {card.character}
            </div>
            <div className={`${textSizes[size].moment} text-white/50 truncate`}>
              {card.moment}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span
                className={`${textSizes[size].serial} font-mono font-bold uppercase tracking-wider`}
                style={{ color: borderColor }}
              >
                {scarcityConfig.label}
              </span>
              {card.scarcity !== 'common' && (
                <span className={`${textSizes[size].serial} font-mono text-white/40`}>
                  #{card.serialNumber.toString().padStart(card.maxSerial.toString().length, '0')}/{card.maxSerial}
                </span>
              )}
            </div>
          </div>

          {/* Price tag */}
          {showPrice && card.listed && (
            <div className="absolute top-2 left-8 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-green-500/20">
              <span className={`${textSizes[size].serial} font-mono text-green-400 font-bold`}>
                ${card.price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `${borderWidth}px solid ${borderColor}`,
            background: `linear-gradient(135deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
            boxShadow: getBoxShadow(),
          }}
        >
          {/* Decorative top bar */}
          <div className="h-1" style={{ background: borderColor }} />

          <div className="p-3 flex flex-col flex-1">
            <div className={`${textSizes[size].name} font-bold text-white mb-0.5 leading-tight`}>{card.character}</div>
            <div className={`${textSizes[size].moment} text-accent mb-1`}>{card.moment}</div>
            <div className={`${textSizes[size].serial} text-white/40 mb-2`}>{card.set}</div>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-2" />

            <div className={`${textSizes[size].serial} text-white/60 italic leading-relaxed flex-1 overflow-hidden`}>
              {card.loreText}
            </div>

            <div className="h-px bg-white/10 mt-2 mb-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className={`${textSizes[size].serial} font-mono font-bold uppercase`}
                  style={{ color: borderColor }}
                >
                  {scarcityConfig.label}
                </span>
                {card.parallel !== 'base' && (
                  <span className={`${textSizes[size].serial} text-white/30`}>
                    {parallelConfig.label}
                  </span>
                )}
              </div>
              {card.scarcity !== 'common' && (
                <span className={`${textSizes[size].serial} font-mono text-white/40`}>
                  #{card.serialNumber}/{card.maxSerial}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
