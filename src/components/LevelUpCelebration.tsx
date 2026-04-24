'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getTierForLevel, CollectorTier } from '@/data/types';

interface LevelUpCelebrationProps {
  visible: boolean;
  level: number;
  previousTier: CollectorTier | null;
  newTier: CollectorTier;
  onDone: () => void;
}

const TIER_COLORS: Record<CollectorTier, string> = {
  Newcomer: '#6b7094',
  Collector: '#22c55e',
  Enthusiast: '#3b82f6',
  Connoisseur: '#a855f7',
  Elite: '#f59e0b',
  Legendary: '#ef4444',
};

export default function LevelUpCelebration({ visible, level, previousTier, newTier, onDone }: LevelUpCelebrationProps) {
  const isTierUp = previousTier !== null && previousTier !== newTier;
  const color = TIER_COLORS[newTier];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          onClick={onDone}
        >
          {/* Flash overlay */}
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
            style={{ background: `${color}30` }}
          />

          {/* Dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />

          {/* Particle burst */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: isTierUp ? 30 : 12 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  background: i % 3 === 0 ? color : i % 3 === 1 ? '#818cf8' : '#f59e0b',
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * (isTierUp ? 600 : 300),
                  y: (Math.random() - 0.5) * (isTierUp ? 600 : 300),
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.2 + Math.random() * 0.5,
                  delay: Math.random() * 0.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Level badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Level number */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-28 h-28 rounded-3xl flex items-center justify-center mb-4"
              style={{
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                border: `2px solid ${color}60`,
                boxShadow: `0 0 60px ${color}30, inset 0 0 30px ${color}10`,
              }}
            >
              <span className="text-5xl font-bold font-mono" style={{ color }}>
                {level}
              </span>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-[11px] uppercase tracking-[0.12em] text-muted mb-1">
                Level Up
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                Level {level}
              </div>

              {/* Tier name (bigger if tier changed) */}
              {isTierUp ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                >
                  <div className="text-[10px] uppercase tracking-[0.08em] text-muted mb-1">New Tier</div>
                  <div
                    className="text-xl font-bold px-4 py-1.5 rounded-xl"
                    style={{
                      color,
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {newTier}
                  </div>
                </motion.div>
              ) : (
                <div className="text-sm font-medium" style={{ color }}>
                  {newTier}
                </div>
              )}
            </motion.div>

            {/* Tap to continue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-[10px] text-muted/50 mt-6"
            >
              Tap to continue
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
