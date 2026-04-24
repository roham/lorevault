'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { popNextCelebration, FEATURE_THRESHOLDS } from '@/lib/activation';

const FEATURE_ROUTES: Record<string, string> = {
  marketplace: '/marketplace',
  'set-completion': '/collection/sets',
  challenges: '/challenges',
  battle: '/games',
  'smart-collections': '/collection/smart',
  trivia: '/games',
  analytics: '/collection/analytics',
  showcase: '/collection/showcase',
  'battle-pass': '/profile',
};

export default function UnlockCelebration() {
  const [current, setCurrent] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check for pending celebrations on mount and periodically
    const check = () => {
      const next = popNextCelebration();
      if (next) {
        setCurrent(next);
        setShow(true);
      }
    };
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(t);
  }, [show]);

  const dismiss = useCallback(() => setShow(false), []);

  const feature = current ? FEATURE_THRESHOLDS[current] : null;
  const route = current ? FEATURE_ROUTES[current] : null;

  return (
    <AnimatePresence>
      {show && feature && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-[70] flex justify-center pointer-events-none"
        >
          <div className="pointer-events-auto mt-4 mx-4 max-w-md w-full">
            <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface/95 backdrop-blur-xl shadow-2xl shadow-accent/10">
              {/* Accent glow bar at top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-accent/20 blur-xl" />

              <div className="relative px-5 py-4 flex items-center gap-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
                  className="text-3xl flex-shrink-0"
                >
                  {feature.icon}
                </motion.div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-accent text-xs font-bold uppercase tracking-wider">Unlocked</span>
                  </div>
                  <div className="text-foreground font-bold text-sm mt-0.5">{feature.label}</div>
                  <div className="text-muted text-[11px] truncate">{feature.description}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {route && (
                    <Link
                      href={route}
                      onClick={dismiss}
                      className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-medium hover:bg-accent/30 transition-colors"
                    >
                      Go
                    </Link>
                  )}
                  <button
                    onClick={dismiss}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-white/10 transition-colors text-sm"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
