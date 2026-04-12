'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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

  const getParallelStyle = (): React.CSSProperties => {
    switch (card.parallel) {
      case 'silver':
        return { boxShadow: `0 0 15px rgba(192,192,192,0.3), inset 0 0 15px rgba(192,192,192,0.1)` };
      case 'gold':
        return { boxShadow: `0 0 20px rgba(255,215,0,0.3), inset 0 0 20px rgba(255,215,0,0.1)` };
      case 'holographic':
        return { boxShadow: `0 0 25px rgba(255,110,199,0.3), inset 0 0 25px rgba(255,110,199,0.1)` };
      case 'obsidian':
        return { boxShadow: `0 0 30px rgba(100,100,255,0.2), inset 0 0 30px rgba(0,0,0,0.5)` };
      default:
        return {};
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative cursor-pointer select-none flex-shrink-0`}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (onClick) onClick(card);
        else setIsFlipped(!isFlipped);
      }}
      style={{ perspective: '1000px' }}
      layout
      draggable={draggable}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden ${card.parallel === 'holographic' ? 'card-holographic' : ''} ${card.parallel === 'silver' ? 'card-shimmer' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            border: `2px solid ${borderColor}`,
            ...getParallelStyle(),
          }}
        >
          {/* Card background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
            }}
          />

          {/* Scarcity indicator strip */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: borderColor }}
          />

          {/* Parallel badge */}
          {card.parallel !== 'base' && (
            <div
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
              style={{
                background: card.parallel === 'obsidian' ? '#1a1a2e' : `${borderColor}22`,
                color: card.parallel === 'gold' ? '#ffd700' : card.parallel === 'silver' ? '#c0c0c0' : card.parallel === 'holographic' ? '#ff6ec7' : '#6366f1',
                border: `1px solid ${card.parallel === 'gold' ? '#ffd70044' : card.parallel === 'silver' ? '#c0c0c044' : card.parallel === 'holographic' ? '#ff6ec744' : '#6366f144'}`,
              }}
            >
              {parallelConfig.label}
            </div>
          )}

          {/* Character symbol (placeholder for art) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${textSizes[size].symbol} opacity-80`}>
              {card.symbol}
            </span>
          </div>

          {/* Bottom info section */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div className={`${textSizes[size].name} font-semibold text-white truncate`}>
              {card.character}
            </div>
            <div className={`${textSizes[size].moment} text-white/60 truncate`}>
              {card.moment}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span
                className={`${textSizes[size].serial} font-mono font-bold`}
                style={{ color: borderColor }}
              >
                {scarcityConfig.label}
              </span>
              {card.scarcity !== 'common' && (
                <span className={`${textSizes[size].serial} font-mono text-white/50`}>
                  #{card.serialNumber}/{card.maxSerial}
                </span>
              )}
            </div>
          </div>

          {/* Price tag */}
          {showPrice && card.listed && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
              <span className={`${textSizes[size].serial} font-mono text-green-400 font-bold`}>
                ${card.price.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden p-3 flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: `2px solid ${borderColor}`,
            background: `linear-gradient(135deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
          }}
        >
          <div className={`${textSizes[size].name} font-semibold text-white mb-1`}>{card.name}</div>
          <div className={`${textSizes[size].moment} text-white/50 mb-2`}>{card.set}</div>
          <div className={`${textSizes[size].serial} text-white/70 italic leading-relaxed flex-1 overflow-hidden`}>
            {card.loreText}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
            <span className={`${textSizes[size].serial} font-mono`} style={{ color: borderColor }}>
              {scarcityConfig.label} {parallelConfig.label !== 'Base' ? `• ${parallelConfig.label}` : ''}
            </span>
            {card.scarcity !== 'common' && (
              <span className={`${textSizes[size].serial} font-mono text-white/50`}>
                #{card.serialNumber}/{card.maxSerial}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
