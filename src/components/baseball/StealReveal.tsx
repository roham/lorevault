'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StealRevealProps {
  visible: boolean;
  runnerName: string;
  fromBase: 'first' | 'second';
  roll: number;
  threshold: number;
  runnerSpeed: number;
  catcherDefense: number;
  success: boolean;
}

function StealRevealInner({
  visible,
  runnerName,
  fromBase,
  roll,
  threshold,
  runnerSpeed,
  catcherDefense,
  success,
}: StealRevealProps) {
  const toBase = fromBase === 'first' ? '2nd' : '3rd';

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={`steal-${runnerName}-${roll}`}
          className={`w-full px-4 py-3 rounded-2xl border backdrop-blur-sm ${
            success
              ? 'bg-gradient-to-b from-purple-500/15 via-purple-500/5 to-transparent border-purple-500/30'
              : 'bg-gradient-to-b from-red-500/15 via-red-500/5 to-transparent border-red-500/30'
          }`}
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        >
          <div className="flex items-center gap-3">
            {/* Glyph */}
            <motion.div
              className={`flex items-center justify-center w-12 h-12 rounded-xl font-black text-lg bg-white/5 border border-white/10 ${
                success ? 'text-purple-400' : 'text-red-400'
              }`}
              initial={{ rotate: -10, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.05 }}
            >
              {success ? 'SB' : 'CS'}
            </motion.div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <motion.p
                className={`text-sm font-black tracking-wider ${success ? 'text-purple-300' : 'text-red-400'}`}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.08 }}
              >
                {success ? `STOLEN ${toBase.toUpperCase()}` : 'CAUGHT STEALING'}
              </motion.p>

              {/* Speed vs Defense breakdown */}
              <motion.div
                className="flex items-center gap-1.5 mt-1 text-[10px] text-muted/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <span>{runnerName}</span>
                <span className="text-muted/30">|</span>
                <span>SPD {runnerSpeed}</span>
                <span className="text-muted/30">-</span>
                <span>DEF {catcherDefense}</span>
                <span className="text-muted/30">=</span>
                <span>need ≤{threshold}</span>
                <span className="text-muted/30">|</span>
                <span className={`font-bold ${success ? 'text-purple-400' : 'text-red-400'}`}>
                  rolled {roll}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const StealReveal = memo(StealRevealInner);
