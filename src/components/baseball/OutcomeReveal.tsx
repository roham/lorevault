'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtBatOutcome } from '@/lib/baseball/types';

interface OutcomeRevealProps {
  outcome: AtBatOutcome | null;
  batterName: string;
  runsScored: number;
  description: string;
  visible: boolean;
}

// Outcome display config
const OUTCOME_CONFIG: Record<AtBatOutcome, {
  glyph: string;
  label: string;
  color: string;    // text color
  bg: string;       // background gradient
  border: string;   // border color
  intensity: 'subtle' | 'medium' | 'big' | 'epic';
}> = {
  homerun: {
    glyph: 'HR',
    label: 'HOME RUN',
    color: 'text-amber-300',
    bg: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'border-amber-500/40',
    intensity: 'epic',
  },
  triple: {
    glyph: '3B',
    label: 'TRIPLE',
    color: 'text-emerald-300',
    bg: 'from-emerald-500/15 via-green-500/5 to-transparent',
    border: 'border-emerald-500/30',
    intensity: 'big',
  },
  double: {
    glyph: '2B',
    label: 'DOUBLE',
    color: 'text-green-400',
    bg: 'from-green-500/15 via-green-500/5 to-transparent',
    border: 'border-green-500/30',
    intensity: 'medium',
  },
  single: {
    glyph: '1B',
    label: 'SINGLE',
    color: 'text-green-400',
    bg: 'from-green-500/10 to-transparent',
    border: 'border-green-500/20',
    intensity: 'medium',
  },
  walk: {
    glyph: 'BB',
    label: 'WALK',
    color: 'text-blue-400',
    bg: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20',
    intensity: 'subtle',
  },
  strikeout: {
    glyph: 'K',
    label: 'STRIKEOUT',
    color: 'text-red-400',
    bg: 'from-red-500/15 via-red-500/5 to-transparent',
    border: 'border-red-400/30',
    intensity: 'big',
  },
  groundout: {
    glyph: 'GO',
    label: 'GROUNDOUT',
    color: 'text-red-400/70',
    bg: 'from-red-500/5 to-transparent',
    border: 'border-red-400/15',
    intensity: 'subtle',
  },
  flyout: {
    glyph: 'FO',
    label: 'FLY OUT',
    color: 'text-red-400/70',
    bg: 'from-red-500/5 to-transparent',
    border: 'border-red-400/15',
    intensity: 'subtle',
  },
  groundout_dp: {
    glyph: 'DP',
    label: 'DOUBLE PLAY',
    color: 'text-red-500',
    bg: 'from-red-500/15 via-red-500/5 to-transparent',
    border: 'border-red-500/30',
    intensity: 'big',
  },
};

// Spring configs per intensity
const SPRING_CONFIG = {
  subtle: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 0.8 },
  medium: { type: 'spring' as const, stiffness: 280, damping: 22, mass: 0.9 },
  big: { type: 'spring' as const, stiffness: 350, damping: 20, mass: 1.0 },
  epic: { type: 'spring' as const, stiffness: 400, damping: 18, mass: 1.1 },
};

function OutcomeRevealInner({ outcome, batterName, runsScored, description, visible }: OutcomeRevealProps) {
  if (!outcome) return null;

  const config = OUTCOME_CONFIG[outcome];
  const spring = SPRING_CONFIG[config.intensity];

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={outcome + batterName}
          className={`
            w-full px-4 py-3 rounded-2xl border
            bg-gradient-to-b ${config.bg} ${config.border}
            backdrop-blur-sm
          `}
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={spring}
        >
          <div className="flex items-center gap-3">
            {/* Glyph */}
            <motion.div
              className={`
                flex items-center justify-center
                w-12 h-12 rounded-xl
                ${config.color} font-black text-lg
                bg-white/5 border border-white/10
              `}
              initial={{ rotate: -10, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ ...spring, delay: 0.05 }}
            >
              {config.glyph}
            </motion.div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <motion.p
                className={`text-sm font-black tracking-wider ${config.color}`}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ...spring, delay: 0.08 }}
              >
                {config.label}
                {runsScored > 0 && (
                  <motion.span
                    className="ml-2 text-xs font-bold text-white/60"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...spring, delay: 0.2 }}
                  >
                    +{runsScored} run{runsScored > 1 ? 's' : ''}
                  </motion.span>
                )}
              </motion.p>
              <motion.p
                className="text-[11px] text-muted/60 truncate mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {description}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const OutcomeReveal = memo(OutcomeRevealInner);
