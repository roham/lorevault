'use client';

import { motion } from 'framer-motion';
import { StatKey, STAT_LABELS, STAT_ICONS, STAT_COLORS } from '@/data/stats';

interface StatRevealProps {
  stat: StatKey;
  playerValue: number;
  opponentValue: number;
  playerWon: boolean;
}

export default function StatReveal({ stat, playerValue, opponentValue, playerWon }: StatRevealProps) {
  return (
    <motion.div
      className="flex items-center justify-center gap-4 py-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Player value */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-xs text-muted">You</span>
        <motion.span
          className="text-2xl font-bold font-mono"
          style={{ color: playerWon ? '#22c55e' : '#ef4444' }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {playerValue}
        </motion.span>
      </motion.div>

      {/* Center: stat icon + name */}
      <motion.div
        className="flex flex-col items-center gap-0.5 px-3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
      >
        <span className="text-2xl">{STAT_ICONS[stat]}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: STAT_COLORS[stat] }}>
          {STAT_LABELS[stat]}
        </span>
      </motion.div>

      {/* Opponent value */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.span
          className="text-2xl font-bold font-mono"
          style={{ color: !playerWon ? '#22c55e' : '#ef4444' }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {opponentValue}
        </motion.span>
        <span className="text-xs text-muted">AI</span>
      </motion.div>
    </motion.div>
  );
}
