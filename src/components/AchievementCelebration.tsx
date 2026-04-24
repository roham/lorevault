'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, AchievementRarity } from '@/data/types';
import { getAchievementRarityColor } from '@/lib/achievements';

interface AchievementCelebrationProps {
  visible: boolean;
  achievement: Achievement | null;
  onDone: () => void;
}

const RARITY_PARTICLES: Record<AchievementRarity, number> = {
  common: 8,
  uncommon: 12,
  rare: 18,
  epic: 24,
  legendary: 32,
};

export default function AchievementCelebration({ visible, achievement, onDone }: AchievementCelebrationProps) {
  if (!achievement) return null;

  const color = getAchievementRarityColor(achievement.rarity);
  const particleCount = RARITY_PARTICLES[achievement.rarity];

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
          {/* Flash */}
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{ background: `${color}25` }}
          />

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          />

          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: particleCount }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  width: i % 4 === 0 ? 6 : 3,
                  height: i % 4 === 0 ? 6 : 3,
                  background: i % 3 === 0 ? color : i % 3 === 1 ? '#ffd700' : '#818cf8',
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 1 + Math.random() * 0.8,
                  delay: Math.random() * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Badge reveal */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Badge icon */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 text-3xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                border: `2px solid ${color}50`,
                boxShadow: `0 0 50px ${color}30, inset 0 0 25px ${color}10`,
                color,
              }}
            >
              {achievement.icon}
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-[10px] uppercase tracking-[0.12em] text-muted mb-1">
                Achievement Unlocked
              </div>
              <div className="text-xl font-bold text-foreground mb-1">
                {achievement.name}
              </div>
              <div className="text-sm text-muted mb-3">
                {achievement.description}
              </div>

              {/* Rarity pill */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              >
                <span
                  className="text-[10px] font-bold uppercase px-3 py-1 rounded-full"
                  style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  {achievement.rarity} — {achievement.mockPercent}% of collectors
                </span>
              </motion.div>
            </motion.div>

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
