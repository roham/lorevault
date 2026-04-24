'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CrowdReactionType } from '@/lib/baseball/stadium-themes';
import { getCrowdReaction } from '@/lib/baseball/stadium-themes';

interface CrowdReactionProps {
  type: CrowdReactionType | null;
  accentColor?: string;
  onDismiss: () => void;
}

/**
 * Full-width crowd reaction overlay that appears during dramatic moments.
 * Shows emoji + text flash with themed accent color.
 * Auto-dismisses after the reaction's duration.
 */
export function CrowdReaction({ type, accentColor = '#f59e0b', onDismiss }: CrowdReactionProps) {
  const [visible, setVisible] = useState(false);
  const [reaction, setReaction] = useState<ReturnType<typeof getCrowdReaction> | null>(null);

  useEffect(() => {
    if (!type) {
      setVisible(false);
      return;
    }
    const r = getCrowdReaction(type);
    setReaction(r);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, r.duration);

    return () => clearTimeout(timer);
  }, [type, onDismiss]);

  return (
    <AnimatePresence>
      {visible && reaction && (
        <motion.div
          className="fixed inset-x-0 bottom-20 z-40 pointer-events-none flex items-center justify-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="relative">
            {/* Glow ring behind text */}
            {(reaction.intensity === 'epic' || reaction.intensity === 'high') && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            )}

            {/* Main reaction badge */}
            <motion.div
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
                borderColor: `${accentColor}30`,
              }}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.05 }}
            >
              {/* Sound wave icon — visual cue for audio */}
              <span className="text-[10px] opacity-30" aria-label="Sound cue">
                {'\u266B'}
              </span>

              {/* Emoji */}
              <motion.span
                className="text-2xl"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 12, delay: 0.1 }}
              >
                {reaction.emoji}
              </motion.span>

              {/* Text */}
              <motion.span
                className="text-sm font-black uppercase tracking-wider"
                style={{ color: accentColor }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                {reaction.text}
              </motion.span>

              {/* Sound wave icon — visual cue for audio */}
              <span className="text-[10px] opacity-30" aria-label="Sound cue">
                {'\u266B'}
              </span>
            </motion.div>

            {/* Secondary emoji burst for epic moments */}
            {reaction.intensity === 'epic' && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-lg pointer-events-none"
                    style={{ left: '50%', top: '50%' }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                    animate={{
                      x: Math.cos((i / 6) * Math.PI * 2) * 60,
                      y: Math.sin((i / 6) * Math.PI * 2) * 40 - 10,
                      opacity: 0,
                      scale: 1,
                    }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
                  >
                    {reaction.emoji}
                  </motion.span>
                ))}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
