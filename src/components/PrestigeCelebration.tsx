'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrestigeCelebration() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener('prestige-unlock', handler);
    return () => window.removeEventListener('prestige-unlock', handler);
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setShow(false)}
        >
          {/* Dim backdrop */}
          <div className="absolute inset-0 bg-black/80" />

          {/* Golden crown + text */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="text-7xl mb-6"
            >
              👑
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2
                className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffd700, #ffaa00, #ffd700)',
                }}
              >
                Collector Prestige Unlocked
              </h2>
              <p className="text-white/50 text-sm">
                You have mastered every dimension of collecting.
              </p>
              <p className="text-amber-400/60 text-xs mt-2">
                New challenges await...
              </p>
            </motion.div>

            {/* Radiating glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
