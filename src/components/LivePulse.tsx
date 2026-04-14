'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generatePulseEvents,
  getPlayerActivityEvents,
  REACTION_TYPES,
  getUserReactions,
  toggleUserReaction,
  getFomoCount,
  type PulseEvent,
  type ReactionId,
} from '@/lib/pulse';
import { SOCIAL_FEED_CONFIG } from '@/data/social-feed';
import { usePathname } from 'next/navigation';
import { shouldShowWelcome } from '@/lib/onboarding';

// ===== Reaction Bar =====
function ReactionBar({
  event,
  userReactions,
  onReact,
}: {
  event: PulseEvent;
  userReactions: ReactionId[];
  onReact: (eventId: string, reactionId: ReactionId) => void;
}) {
  const [burstId, setBurstId] = useState<string | null>(null);

  const handleReact = (reactionId: ReactionId) => {
    onReact(event.id, reactionId);
    setBurstId(reactionId);
    setTimeout(() => setBurstId(null), 400);
  };

  return (
    <div className="flex gap-1.5 mt-2">
      {REACTION_TYPES.map((r) => {
        const count = event.reactions[r.id] + (userReactions.includes(r.id) ? 1 : 0);
        const isActive = userReactions.includes(r.id);

        return (
          <button
            key={r.id}
            onClick={() => handleReact(r.id)}
            className={`relative flex items-center gap-1 px-2 py-1 rounded-full text-[10px] transition-all ${
              isActive
                ? 'bg-accent/20 border border-accent/30'
                : 'bg-surface/60 border border-border/30 hover:bg-surface/80'
            }`}
          >
            <span className="text-xs">{r.emoji}</span>
            <span className={`font-mono ${isActive ? 'text-accent font-bold' : 'text-muted'}`}>
              {count}
            </span>
            {/* Micro-burst animation */}
            <AnimatePresence>
              {burstId === r.id && (
                <motion.span
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center text-lg pointer-events-none"
                >
                  {r.emoji}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}

// ===== Pulse Detail Drawer =====
function PulseDrawer({
  events,
  onClose,
  userReactions,
  onReact,
}: {
  events: PulseEvent[];
  onClose: () => void;
  userReactions: Record<string, ReactionId[]>;
  onReact: (eventId: string, reactionId: ReactionId) => void;
}) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-[72px] z-[55] max-h-[60vh] bg-background/95 backdrop-blur-xl border-t border-border/40 rounded-t-2xl overflow-hidden"
    >
      {/* Drawer handle + header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 px-4 pt-3 pb-2 border-b border-border/20">
        <div className="w-10 h-1 rounded-full bg-border/50 mx-auto mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h3 className="text-sm font-bold text-foreground">Live Activity</h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-muted hover:text-foreground px-2 py-1 rounded-lg hover:bg-surface/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Event list */}
      <div className="overflow-y-auto max-h-[calc(60vh-60px)] px-4 py-2 space-y-3">
        {events.map((event) => {
          const config = SOCIAL_FEED_CONFIG[event.type];
          return (
            <div key={event.id} className="p-3 rounded-xl bg-surface/40 border border-border/20">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                  style={{ backgroundColor: `${event.accent}15` }}
                >
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[8px] uppercase tracking-[0.1em] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${config.color}20`, color: config.color }}
                    >
                      {config.label}
                    </span>
                    <span className="text-[10px] text-muted/50">{event.timestamp}</span>
                    {event.isPlayerEvent && (
                      <span className="text-[8px] text-accent bg-accent/10 px-1 py-0.5 rounded font-bold">YOU</span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-foreground/90 leading-snug">{event.text}</div>
                  {event.subtext && (
                    <div className="text-[10px] text-muted mt-0.5">{event.subtext}</div>
                  )}
                  <ReactionBar
                    event={event}
                    userReactions={userReactions[event.id] || []}
                    onReact={onReact}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ===== LivePulse Ticker =====
export default function LivePulse() {
  const pathname = usePathname();
  const [events, setEvents] = useState<PulseEvent[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, ReactionId[]>>({});
  const [hidden, setHidden] = useState(true);
  const [fomoCount, setFomoCount] = useState({ legendaries: 0, epics: 0, packs: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHidden(shouldShowWelcome() || pathname === '/welcome');
  }, [pathname]);

  useEffect(() => {
    const pulseEvents = generatePulseEvents(20);
    const playerEvents = getPlayerActivityEvents();
    // Interleave player events into the feed
    const merged = [...pulseEvents];
    playerEvents.slice(0, 5).forEach((pe, i) => {
      merged.splice(Math.min(i * 3 + 1, merged.length), 0, pe);
    });
    setEvents(merged);
    setUserReactions(getUserReactions());
    setFomoCount(getFomoCount());
  }, []);

  // Auto-rotate ticker
  useEffect(() => {
    if (events.length === 0 || drawerOpen) return;

    timerRef.current = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % events.length);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [events.length, drawerOpen]);

  const handleReact = useCallback((eventId: string, reactionId: ReactionId) => {
    const updated = toggleUserReaction(eventId, reactionId);
    setUserReactions(prev => ({ ...prev, [eventId]: updated }));
  }, []);

  if (hidden || events.length === 0) return null;

  const currentEvent = events[currentIdx];
  const config = SOCIAL_FEED_CONFIG[currentEvent.type];

  return (
    <>
      {/* Ticker bar — fixed above bottom nav */}
      <div className="fixed bottom-[72px] left-0 right-0 z-[52]">
        <div
          className="bg-background/90 backdrop-blur-xl border-t border-border/30 cursor-pointer"
          onClick={() => setDrawerOpen(prev => !prev)}
        >
          <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">Live</span>
            </div>

            {/* Rotating event */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.id + currentIdx}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs shrink-0">{currentEvent.icon}</span>
                  <span className="text-[11px] text-foreground/80 truncate">{currentEvent.text}</span>
                  <span className="text-[9px] text-muted/50 shrink-0">{currentEvent.timestamp}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FOMO counter chip */}
            <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <span className="text-[9px]">🔥</span>
              <span className="text-[9px] font-bold font-mono text-orange-400">{fomoCount.legendaries}</span>
            </div>

            {/* Expand chevron */}
            <motion.span
              animate={{ rotate: drawerOpen ? 180 : 0 }}
              className="text-muted text-xs shrink-0"
            >
              ▲
            </motion.span>
          </div>
        </div>
      </div>

      {/* Backdrop when drawer is open */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-[53] bg-black/40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <PulseDrawer
            events={events}
            onClose={() => setDrawerOpen(false)}
            userReactions={userReactions}
            onReact={handleReact}
          />
        )}
      </AnimatePresence>
    </>
  );
}
