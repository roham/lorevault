'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiceRollerProps {
  value: number;          // final roll value (1-20)
  isRolling: boolean;     // trigger rolling state
  label?: string;         // "Pitcher" or "Hitter"
  accentColor?: string;   // tailwind color class for glow
  size?: 'sm' | 'md' | 'lg';
  onLandComplete?: () => void;
}

const CYCLE_COUNT = 14;
const BASE_INTERVAL = 55; // ms — fastest spin speed
const SLOWDOWN_FACTOR = 12; // ms added per tick

function DiceRollerInner({
  value,
  isRolling,
  label,
  accentColor = 'text-amber-400',
  size = 'md',
  onLandComplete,
}: DiceRollerProps) {
  const [display, setDisplay] = useState<number>(value || 20);
  const [landed, setLanded] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'landed'>('idle');

  useEffect(() => {
    if (!isRolling) {
      setPhase('idle');
      setLanded(false);
      return;
    }

    setPhase('spinning');
    setLanded(false);

    let tick = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function nextTick() {
      if (tick >= CYCLE_COUNT) {
        // Land on final value
        setDisplay(value);
        setPhase('landed');
        setLanded(true);
        setTimeout(() => {
          onLandComplete?.();
        }, 300);
        return;
      }

      // Show random number (avoid showing the real value during spin)
      let rand: number;
      do {
        rand = Math.floor(Math.random() * 20) + 1;
      } while (rand === value && tick < CYCLE_COUNT - 2);
      setDisplay(rand);
      tick++;

      // Exponential slowdown
      const delay = BASE_INTERVAL + tick * SLOWDOWN_FACTOR;
      timeoutId = setTimeout(nextTick, delay);
    }

    nextTick();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isRolling, value, onLandComplete]);

  const sizeClasses = {
    sm: 'w-14 h-16 text-xl',
    md: 'w-20 h-24 text-4xl',
    lg: 'w-28 h-32 text-5xl',
  };

  // Color the number based on value when landed
  const getValueColor = () => {
    if (!landed) return 'text-white/80';
    if (value >= 16) return 'text-amber-400';
    if (value >= 11) return 'text-green-400';
    if (value >= 6) return 'text-white';
    return 'text-red-400';
  };

  // Glow intensity based on value
  const getGlow = () => {
    if (!landed) return '';
    if (value >= 18) return 'shadow-[0_0_30px_rgba(251,191,36,0.4)]';
    if (value >= 14) return 'shadow-[0_0_20px_rgba(251,191,36,0.2)]';
    return '';
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <span className={`text-[10px] uppercase tracking-widest ${
          landed ? accentColor : 'text-muted/50'
        } transition-colors`}>
          {label}
        </span>
      )}
      <motion.div
        className={`
          ${sizeClasses[size]}
          relative flex items-center justify-center
          rounded-lg border-2
          ${landed
            ? `border-white/30 bg-surface ${getGlow()}`
            : phase === 'spinning'
            ? 'border-white/10 bg-surface/80'
            : 'border-border/30 bg-surface/50'
          }
          transition-shadow duration-300
        `}
        style={{ willChange: phase === 'spinning' ? 'transform' : 'auto' }}
        animate={
          phase === 'spinning'
            ? {
                rotateY: [0, -12, 12, -8, 8, 0],
                rotateX: [0, 8, -8, 4, -4, 0],
                scale: [1, 1.05, 0.97, 1.03, 0.99, 1],
              }
            : phase === 'landed'
            ? { scale: [1.2, 0.92, 1.05, 1], rotateY: 0, rotateX: 0 }
            : { scale: 1, rotateY: 0, rotateX: 0 }
        }
        transition={
          phase === 'spinning'
            ? { duration: 0.3, repeat: Infinity, ease: 'easeInOut' }
            : phase === 'landed'
            ? { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }
            : { duration: 0.2 }
        }
      >
        {/* D20 shape hint — subtle polygon clip */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
            background: 'linear-gradient(135deg, white 0%, transparent 60%)',
          }}
        />

        {/* Number display */}
        <span
          className={`
            font-black tabular-nums font-mono relative z-10
            ${getValueColor()}
            ${phase === 'spinning' ? 'blur-[0.5px]' : ''}
            transition-colors duration-150
          `}
        >
          {display}
        </span>

        {/* Landing flash */}
        <AnimatePresence>
          {landed && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: value >= 16
                  ? 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)'
                  : value <= 5
                  ? 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export const DiceRoller = memo(DiceRollerInner);
