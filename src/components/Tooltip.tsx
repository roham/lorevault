'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shouldShowTooltip, markTooltipShown } from '@/lib/activation';

interface TooltipProps {
  id: string;
  text: string;
  /** Position relative to the target element */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing (ms) */
  delay?: number;
  /** Auto-dismiss after this many ms (default 8000) */
  autoDismiss?: number;
  /** Whether to show — external trigger control */
  active?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export default function Tooltip({
  id,
  text,
  position = 'bottom',
  delay = 600,
  autoDismiss = 8000,
  active = true,
  onDismiss,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (!shouldShowTooltip(id)) return;

    const showTimer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(showTimer);
  }, [id, active, delay]);

  useEffect(() => {
    if (!visible) return;
    const dismissTimer = setTimeout(() => {
      dismiss();
    }, autoDismiss);
    return () => clearTimeout(dismissTimer);
  }, [visible, autoDismiss]);

  const dismiss = useCallback(() => {
    setVisible(false);
    markTooltipShown(id);
    onDismiss?.();
  }, [id, onDismiss]);

  const arrowClasses: Record<string, string> = {
    top: 'bottom-[-5px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-[rgba(20,22,35,0.95)]',
    bottom: 'top-[-5px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-[rgba(20,22,35,0.95)]',
    left: 'right-[-5px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-[rgba(20,22,35,0.95)]',
    right: 'left-[-5px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-[rgba(20,22,35,0.95)]',
  };

  const positionClasses: Record<string, string> = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const enterDirection: Record<string, { y?: number; x?: number }> = {
    top: { y: 8 },
    bottom: { y: -8 },
    left: { x: 8 },
    right: { x: -8 },
  };

  return (
    <div className="relative inline-flex">
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className={`absolute z-[60] ${positionClasses[position]}`}
            initial={{ opacity: 0, scale: 0.9, ...enterDirection[position] }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, ...enterDirection[position] }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="relative bg-[rgba(20,22,35,0.95)] backdrop-blur-lg border border-accent/20 rounded-xl px-3 py-2 shadow-xl shadow-black/40 max-w-[220px]">
              {/* Arrow */}
              <div className={`absolute w-0 h-0 border-[5px] ${arrowClasses[position]}`} />

              <div className="flex items-start gap-2">
                <span className="text-xs text-foreground/90 leading-tight">{text}</span>
                <button
                  onClick={dismiss}
                  className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-white/10 transition-colors text-[10px]"
                >
                  &times;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Standalone Tooltip (not wrapping children) =====
// Used when you want to float a tooltip near an element without wrapping it.

export function FloatingTooltip({
  id,
  text,
  active = true,
  autoDismiss = 8000,
  delay = 800,
}: {
  id: string;
  text: string;
  active?: boolean;
  autoDismiss?: number;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (!shouldShowTooltip(id)) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [id, active, delay]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setVisible(false);
      markTooltipShown(id);
    }, autoDismiss);
    return () => clearTimeout(t);
  }, [visible, autoDismiss, id]);

  const dismiss = () => {
    setVisible(false);
    markTooltipShown(id);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-[rgba(20,22,35,0.95)] backdrop-blur-lg border border-accent/20 rounded-xl px-3 py-2 shadow-xl shadow-black/40 max-w-[240px] flex items-start gap-2"
        >
          <span className="text-[11px] text-foreground/90 leading-tight">{text}</span>
          <button
            onClick={dismiss}
            className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-white/10 transition-colors text-[10px]"
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
