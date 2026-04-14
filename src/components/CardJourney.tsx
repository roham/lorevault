'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardEvent } from '@/data/types';

const EVENT_CONFIG: Record<CardEvent['type'], { icon: string; label: string; color: string }> = {
  pulled: { icon: '⭐', label: 'Pulled from Pack', color: '#f59e0b' },
  revealed: { icon: '👁', label: 'Revealed', color: '#3b82f6' },
  battle_win: { icon: '⚔', label: 'Battle Victory', color: '#22c55e' },
  battle_loss: { icon: '🛡', label: 'Battle Defeat', color: '#ef4444' },
  showcased: { icon: '🏆', label: 'Added to Showcase', color: '#a855f7' },
  traded: { icon: '🔄', label: 'Traded', color: '#f97316' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function CardJourney({ history, acquiredAt }: { history: CardEvent[]; acquiredAt: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!history || history.length === 0) return null;

  const ageDays = Math.floor((Date.now() - new Date(acquiredAt).getTime()) / 86400000);
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const visible = expanded ? sorted : sorted.slice(0, 5);
  const hasMore = sorted.length > 5;

  return (
    <div className="p-4 rounded-2xl bg-surface border border-border mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] text-muted uppercase tracking-wider">Card Journey</div>
        <div className="text-[10px] text-muted">
          {history.length} events · {ageDays}d held
        </div>
      </div>

      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-[9px] top-1 bottom-1 w-px bg-border" />

        {visible.map((event, i) => {
          const config = EVENT_CONFIG[event.type];
          return (
            <motion.div
              key={`${event.type}-${event.date}-${i}`}
              className="relative flex items-start gap-3 mb-3 last:mb-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {/* Node */}
              <div
                className="absolute -left-6 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] border-2 bg-background z-10"
                style={{ borderColor: config.color }}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: config.color }}>
                    {config.label}
                  </span>
                  <span className="text-[9px] text-muted ml-2 shrink-0">
                    {timeAgo(event.date)}
                  </span>
                </div>
                {event.detail && (
                  <div className="text-[10px] text-muted mt-0.5">{event.detail}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {hasMore && !expanded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(true)}
            className="mt-3 w-full text-center text-[10px] text-accent font-medium hover:underline"
          >
            Show all {sorted.length} events
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
