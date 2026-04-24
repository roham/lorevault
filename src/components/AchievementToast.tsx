'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/data/types';
import { getAchievementRarityColor } from '@/lib/achievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  visible: boolean;
  onDone: () => void;
}

export default function AchievementToast({ achievement, visible, onDone }: AchievementToastProps) {
  if (!achievement) return null;

  const color = getAchievementRarityColor(achievement.rarity);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onAnimationComplete={(definition) => {
            if (definition === 'exit') return;
            // Auto-dismiss after 3s
            setTimeout(onDone, 3000);
          }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%]"
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, rgba(18,20,31,0.95), rgba(18,20,31,0.9))`,
              border: `1px solid ${color}40`,
              boxShadow: `0 0 30px ${color}15, 0 8px 32px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: `${color}20`,
                color,
                border: `1px solid ${color}30`,
              }}
            >
              {achievement.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.08em] font-semibold" style={{ color }}>
                Achievement Unlocked
              </div>
              <div className="text-sm font-bold text-foreground truncate">{achievement.name}</div>
              <div className="text-[10px] text-muted truncate">{achievement.description}</div>
            </div>

            {/* Rarity badge */}
            <div
              className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase flex-shrink-0"
              style={{
                background: `${color}15`,
                color,
                border: `1px solid ${color}20`,
              }}
            >
              {achievement.rarity}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
