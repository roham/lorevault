'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getOwnedCards, getCardMeta, getEarnedAchievements, getStreak, getCodexCompletionPercent, getPrestigeState } from '@/lib/store';
import { getForgeHistory } from '@/lib/seasonal-vault';
import { getBurnHistory } from '@/lib/store';
import { getTransmuteHistory } from '@/lib/store';
import { SCARCITY_CONFIG } from '@/data/types';
import { isGhostCard } from '@/data/cards';
import { getAchievementById } from '@/lib/achievements';

interface ChronicleEvent {
  id: string;
  date: string;
  type: 'first-pack' | 'first-legendary' | 'first-epic' | 'first-forge' | 'first-burn' | 'first-transmute' | 'first-ghost' | 'achievement' | 'codex-milestone' | 'prestige' | 'collection-milestone';
  title: string;
  description: string;
  icon: string;
  color: string;
  loreCallback?: string; // thematic lore tie-in
}

function buildChronicle(): ChronicleEvent[] {
  if (typeof window === 'undefined') return [];

  const events: ChronicleEvent[] = [];
  const meta = getCardMeta();
  const owned = getOwnedCards();
  const earned = getEarnedAchievements();
  const forgeHistory = getForgeHistory();
  const burnHistory = getBurnHistory();
  const transmuteHistory = getTransmuteHistory();
  const prestige = getPrestigeState();

  // Collect all card events with dates
  const cardEvents: { cardId: string; character: string; scarcity: string; type: string; date: string; detail?: string }[] = [];
  for (const card of owned) {
    const m = meta[card.id];
    if (!m) continue;
    for (const ev of m.history) {
      cardEvents.push({ cardId: card.id, character: card.character, scarcity: card.scarcity, type: ev.type, date: ev.date, detail: ev.detail });
    }
  }
  cardEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // First pack opened
  const firstPull = cardEvents.find(e => e.type === 'pulled');
  if (firstPull) {
    events.push({
      id: 'first-pack',
      date: firstPull.date,
      type: 'first-pack',
      title: 'The Journey Begins',
      description: `You opened your first pack and pulled ${firstPull.character}. Every great collection starts with a single card.`,
      icon: '📦',
      color: '#818cf8',
      loreCallback: 'Like Alice following the White Rabbit, you chose curiosity over comfort.',
    });
  }

  // First Epic
  const firstEpic = cardEvents.find(e => e.type === 'pulled' && e.scarcity === 'epic');
  if (firstEpic) {
    events.push({
      id: 'first-epic',
      date: firstEpic.date,
      type: 'first-epic',
      title: 'A Glimpse of Power',
      description: `${firstEpic.character} arrived — your first Epic. The collection was no longer just cards.`,
      icon: '💜',
      color: SCARCITY_CONFIG.epic.color,
      loreCallback: 'The moment a collector realizes the hunt is more than a game.',
    });
  }

  // First Legendary
  const firstLegendary = cardEvents.find(e => e.type === 'pulled' && e.scarcity === 'legendary');
  if (firstLegendary) {
    events.push({
      id: 'first-legendary',
      date: firstLegendary.date,
      type: 'first-legendary',
      title: 'Lightning Strikes',
      description: `Legendary ${firstLegendary.character} appeared. A card that fewer than 50 will ever hold.`,
      icon: '⚡',
      color: SCARCITY_CONFIG.legendary.color,
      loreCallback: 'Prometheus stole fire. You found yours in a pack.',
    });
  }

  // First Ghost Card
  const firstGhost = cardEvents.find(e => e.type === 'pulled' && isGhostCard(e.cardId));
  if (firstGhost) {
    events.push({
      id: 'first-ghost',
      date: firstGhost.date,
      type: 'first-ghost',
      title: 'The Void Speaks',
      description: `A ghost card materialized — ${firstGhost.character} from the space between worlds. You saw what was never meant to be seen.`,
      icon: '👻',
      color: '#a855f7',
      loreCallback: 'There are doors that should not be opened. You opened one.',
    });
  }

  // First Forge
  if (forgeHistory.length > 0) {
    const first = forgeHistory[0]; // oldest is at index 0 (push-appended)
    events.push({
      id: 'first-forge',
      date: first.date,
      type: 'first-forge',
      title: 'The Forge Awakens',
      description: `You sacrificed ${first.inputCardIds.length} cards to forge something greater. Creation through destruction.`,
      icon: '🔨',
      color: '#f97316',
      loreCallback: 'Odin gave his eye for wisdom. You gave cards for power.',
    });
  }

  // First Burn
  if (burnHistory.length > 0) {
    const first = burnHistory[burnHistory.length - 1];
    events.push({
      id: 'first-burn',
      date: first.date,
      type: 'first-burn',
      title: 'Ashes to Experience',
      description: `You permanently sacrificed ${first.character} for ${first.xpGained} XP. Some things must be destroyed to fuel growth.`,
      icon: '🔥',
      color: '#ef4444',
      loreCallback: 'The phoenix does not mourn the flames. It becomes them.',
    });
  }

  // First Transmute
  if (transmuteHistory.length > 0) {
    const first = transmuteHistory[transmuteHistory.length - 1];
    events.push({
      id: 'first-transmute',
      date: first.date,
      type: 'first-transmute',
      title: 'Parallel Ascension',
      description: `Three ${first.fromParallel} cards became one ${first.toParallel}. The transmutation circle is complete.`,
      icon: '◈',
      color: '#818cf8',
      loreCallback: 'Lead into gold. Base into obsidian. The alchemist\'s dream made real.',
    });
  }

  // Key achievements
  const keyAchievements = ['set-complete', 'lore-master', 'codex-complete', 'secret-thread', 'ghost-finder', 'collector-prestige'];
  for (const ea of earned) {
    if (keyAchievements.includes(ea.achievementId)) {
      const ach = getAchievementById(ea.achievementId);
      if (ach) {
        events.push({
          id: `achievement-${ea.achievementId}`,
          date: ea.earnedAt,
          type: 'achievement',
          title: ach.name,
          description: ach.description,
          icon: ach.icon,
          color: '#fbbf24',
        });
      }
    }
  }

  // Collection milestones
  const milestones = [10, 25, 50, 100, 150, 200];
  for (const m of milestones) {
    if (owned.length >= m) {
      // Estimate date from the m-th card pulled
      const pulls = cardEvents.filter(e => e.type === 'pulled');
      const milestone = pulls[m - 1];
      if (milestone) {
        events.push({
          id: `collection-${m}`,
          date: milestone.date,
          type: 'collection-milestone',
          title: `${m} Cards Collected`,
          description: `Your collection reached ${m} cards. The vault grows deeper.`,
          icon: m >= 100 ? '🏛️' : m >= 50 ? '📚' : '📦',
          color: '#22c55e',
        });
      }
    }
  }

  // Prestige unlock
  if (prestige.unlocked && prestige.unlockedAt) {
    events.push({
      id: 'prestige-unlock',
      date: prestige.unlockedAt,
      type: 'prestige',
      title: 'Collector Prestige',
      description: 'You achieved what few dare to attempt. Every achievement earned, every lore node unlocked, every set completed. You are the collector supreme.',
      icon: '👑',
      color: '#fbbf24',
      loreCallback: 'The crown is not given. It is forged from every card you ever held.',
    });
  }

  // Sort chronologically
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return events;
}

function formatChronicleDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
}

export default function ChroniclePage() {
  const [events, setEvents] = useState<ChronicleEvent[]>([]);
  const [ready, setReady] = useState(false);
  const [totalCards, setTotalCards] = useState(0);
  const [codexPct, setCodexPct] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const chronicle = buildChronicle();
    setEvents(chronicle);
    setTotalCards(getOwnedCards().length);
    setCodexPct(getCodexCompletionPercent());
    setStreak(getStreak());
    setReady(true);
  }, []);

  if (!ready) return null;

  const totalDays = events.length >= 2
    ? daysBetween(events[0].date, events[events.length - 1].date) + 1
    : 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="type-heading">Chronicle</h1>
          <p className="text-xs text-muted">The story of your collecting journey</p>
        </div>
        <Link href="/profile" className="text-xs text-muted hover:text-foreground">
          ← Profile
        </Link>
      </div>

      {/* Journey stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="p-3 rounded-xl bg-surface/60 border border-border/30 text-center">
          <div className="text-lg font-bold font-mono text-accent">{totalDays}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider">Days</div>
        </div>
        <div className="p-3 rounded-xl bg-surface/60 border border-border/30 text-center">
          <div className="text-lg font-bold font-mono text-foreground">{events.length}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider">Chapters</div>
        </div>
        <div className="p-3 rounded-xl bg-surface/60 border border-border/30 text-center">
          <div className="text-lg font-bold font-mono text-foreground">{totalCards}</div>
          <div className="text-[9px] text-muted uppercase tracking-wider">Cards</div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="p-8 rounded-xl bg-surface/30 border border-border/20 text-center">
          <span className="text-3xl block mb-2">📜</span>
          <p className="text-sm text-muted">Your chronicle is empty</p>
          <p className="text-xs text-muted/60 mt-1">Open packs to begin your story</p>
          <Link href="/packs" className="mt-4 inline-block px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold">
            Open First Pack
          </Link>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline spine */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border/30" />

          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative pl-14 pb-8"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-10"
                style={{
                  background: `${event.color}20`,
                  border: `2px solid ${event.color}60`,
                }}
              >
                <span>{event.icon}</span>
              </div>

              {/* Event card */}
              <div
                className="p-4 rounded-xl border transition-all hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${event.color}05, ${event.color}10)`,
                  borderColor: `${event.color}20`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-muted">{formatChronicleDate(event.date)}</span>
                  {idx > 0 && (
                    <span className="text-[9px] text-muted/50">
                      +{daysBetween(events[idx - 1].date, event.date)}d
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{event.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{event.description}</p>
                {event.loreCallback && (
                  <p className="text-[10px] text-accent/60 italic mt-2 pl-2 border-l-2 border-accent/20">
                    {event.loreCallback}
                  </p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Journey continues marker */}
          <div className="relative pl-14 pb-4">
            <div className="absolute left-4 w-5 h-5 rounded-full flex items-center justify-center text-[10px] z-10 bg-surface border-2 border-border/40">
              <span className="text-muted">...</span>
            </div>
            <div className="p-3 rounded-xl bg-surface/30 border border-border/20">
              <p className="text-xs text-muted italic">The chronicle continues. Every pack, every forge, every discovery writes the next chapter.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
