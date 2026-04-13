'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, SCARCITY_CONFIG } from '@/data/types';
import { StatKey, STAT_LABELS, STAT_ICONS, STAT_COLORS, getCharacterStats, getEffectiveStat } from '@/data/stats';

interface BattleCardProps {
  card: Card;
  selectedStat?: StatKey | null;
  revealedStat?: StatKey | null;
  isPlayer?: boolean;
  isActive?: boolean;
  showStats?: boolean;
  result?: 'win' | 'lose' | 'pending' | null;
  onSelectStat?: (stat: StatKey) => void;
}

export default function BattleCard({
  card,
  selectedStat = null,
  revealedStat = null,
  isPlayer = true,
  isActive = false,
  showStats = false,
  result = null,
  onSelectStat,
}: BattleCardProps) {
  const scarcityConfig = SCARCITY_CONFIG[card.scarcity];
  const baseStats = getCharacterStats(card.character);

  const stats: StatKey[] = ['power', 'intelligence', 'mystery', 'legend', 'charm'];

  const getStatValue = (stat: StatKey) => getEffectiveStat(baseStats, stat, card.scarcity, card.parallel);

  const resultColor = result === 'win' ? '#22c55e' : result === 'lose' ? '#ef4444' : 'transparent';

  return (
    <motion.div
      className="relative flex-shrink-0"
      style={{ width: 200, minHeight: showStats ? 340 : 260 }}
      // Card entrance animation
      initial={{ scale: 0.6, rotateY: 90, opacity: 0 }}
      animate={{
        scale: isActive ? 1.05 : 1,
        rotateY: 0,
        opacity: 1,
        y: isActive ? -8 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Result glow + pulse */}
      {result && result !== 'pending' && (
        <motion.div
          className="absolute -inset-2 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3, 0.5, 0.3],
            scale: [1, 1.02, 1, 1.01, 1],
          }}
          transition={{ duration: 1.2 }}
          style={{
            background: `radial-gradient(ellipse, ${resultColor}30 0%, transparent 70%)`,
            boxShadow: `0 0 40px ${resultColor}40`,
          }}
        />
      )}

      {/* Active breathing glow */}
      {isActive && !result && (
        <motion.div
          className="absolute -inset-1 rounded-2xl pointer-events-none"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            boxShadow: `0 0 20px ${scarcityConfig.color}40`,
          }}
        />
      )}

      {/* Card face */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          border: `2px solid ${scarcityConfig.color}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)${isActive ? `, 0 0 20px ${scarcityConfig.color}40` : ''}`,
        }}
      >
        {/* Card art area */}
        <div
          className="relative h-40 flex flex-col items-center justify-center"
          style={{ background: `linear-gradient(145deg, ${card.gradientFrom}, ${card.gradientTo})` }}
        >
          {/* Character initial */}
          <span
            className="text-5xl font-bold leading-none font-serif"
            style={{ color: `${scarcityConfig.color}20`, textShadow: `0 0 40px ${scarcityConfig.color}10` }}
          >
            {card.character[0]}
          </span>
          <motion.span
            className="text-3xl -mt-1 drop-shadow-lg"
            animate={isActive ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {card.symbol}
          </motion.span>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />

          {/* Name + scarcity label */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
            <div className="text-xs font-semibold text-white truncate">{card.character}</div>
            <div className="text-[9px] text-white/50 truncate">{card.moment}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[8px] font-mono font-bold uppercase" style={{ color: scarcityConfig.color }}>
                {scarcityConfig.label}
              </span>
              {card.parallel !== 'base' && (
                <span className="text-[8px] text-white/30">{card.parallel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats area */}
        {showStats && (
          <div className="bg-surface p-2 space-y-1">
            {stats.map((stat, statIdx) => {
              const value = getStatValue(stat);
              const isSelected = selectedStat === stat;
              const isRevealed = revealedStat === stat;
              const canSelect = isPlayer && isActive && onSelectStat && !selectedStat;

              return (
                <motion.button
                  key={stat}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${
                    canSelect ? 'hover:bg-white/10 cursor-pointer active:scale-[0.97]' : 'cursor-default'
                  } ${isSelected || isRevealed ? 'bg-white/10 ring-1' : ''}`}
                  style={{
                    ['--tw-ring-color' as string]: isSelected || isRevealed ? STAT_COLORS[stat] : 'transparent',
                  }}
                  onClick={() => canSelect && onSelectStat?.(stat)}
                  disabled={!canSelect}
                  whileTap={canSelect ? { scale: 0.97 } : undefined}
                  // Staggered entrance for stat bars
                  initial={{ opacity: 0, x: isPlayer ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + statIdx * 0.06 }}
                >
                  <span className="text-sm w-5">{STAT_ICONS[stat]}</span>
                  <span className="text-[10px] font-medium text-muted w-16">{STAT_LABELS[stat]}</span>
                  <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: STAT_COLORS[stat] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{
                        delay: isRevealed ? 0.3 : 0.1 + statIdx * 0.08,
                        duration: isRevealed ? 0.8 : 0.5,
                        // "Race" effect on reveal
                        type: isRevealed ? 'spring' : 'tween',
                        stiffness: isRevealed ? 100 : undefined,
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {(isSelected || isRevealed || showStats) && (
                      <motion.span
                        className="text-xs font-mono font-bold w-6 text-right"
                        style={{ color: STAT_COLORS[stat] }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {value}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Win/Lose badge with enhanced animation */}
      <AnimatePresence>
        {result && result !== 'pending' && (
          <motion.div
            className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-xl z-10"
            style={{
              background: result === 'win' ? '#22c55e' : '#ef4444',
              boxShadow: `0 0 20px ${resultColor}60`,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1.3, 1],
              rotate: [180, -10, 0],
            }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.3 }}
          >
            {result === 'win' ? '✓' : '✗'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Winner highlight glow line */}
      {result === 'win' && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] rounded-full"
          style={{ backgroundColor: '#22c55e' }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '75%', opacity: [0, 1, 0.5] }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      )}
    </motion.div>
  );
}
