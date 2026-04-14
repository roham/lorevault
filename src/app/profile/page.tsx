'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import SeasonTrack from '@/components/SeasonTrack';
import { ALL_CARDS } from '@/data/cards';
import { PROFILE } from '@/data/profile';
import { SCARCITY_CONFIG, Scarcity, Card, getTierForLevel } from '@/data/types';
import { SETS } from '@/data/sets';
import { getOwnedCards, getShowcaseIds, getXP, getStreak, getPackCredits, resetAll, addPackCredits, getCollectorLevel, getEarnedAchievements, getPinnedBadges, togglePinnedBadge } from '@/lib/store';
import { getShowcases, getActiveShowcaseId, SHOWCASE_THEMES, ShowcaseTheme } from '@/lib/showcase-store';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, getAchievementRarityColor, getAchievementById } from '@/lib/achievements';
import { AchievementCategory } from '@/data/types';
import { getVipState, type VipState } from '@/lib/vip';
import { getPlayerActivityEvents, REACTION_TYPES, type PulseEvent } from '@/lib/pulse';
import { SOCIAL_FEED_CONFIG } from '@/data/social-feed';

function LazySection({ children, height }: { children: React.ReactNode; height: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: '100px' });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref}>{visible ? children : <div style={{ height }} className="rounded-2xl bg-surface/20 animate-pulse" />}</div>;
}

const TIER_COLORS: Record<string, string> = {
  Newcomer: '#6b7094',
  Collector: '#22c55e',
  Enthusiast: '#3b82f6',
  Connoisseur: '#a855f7',
  Elite: '#f59e0b',
  Legendary: '#ef4444',
};

export default function ProfilePage() {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [showcaseCards, setShowcaseCards] = useState<Card[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [packs, setPacks] = useState(0);
  const [activeShowcaseTheme, setActiveShowcaseTheme] = useState<ShowcaseTheme>('dark-glass');
  const [collectorLevel, setCollectorLevel] = useState({ level: 1, tier: 'Newcomer' as string, progressPercent: 0, currentXP: 0, xpForNextLevel: 100, xpForCurrentLevel: 0 });
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [pinnedBadgeIds, setPinnedBadgeIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [vip, setVip] = useState<VipState | null>(null);
  const [activityEvents, setActivityEvents] = useState<PulseEvent[]>([]);

  useEffect(() => {
    const owned = getOwnedCards();
    setOwnedCards(owned);

    const showcases = getShowcases();
    const activeId = getActiveShowcaseId();
    const activeShowcase = showcases.find(s => s.id === activeId) || showcases[0];
    if (activeShowcase) {
      setShowcaseCards(
        activeShowcase.slots
          .map(s => owned.find(c => c.id === s.cardId))
          .filter(Boolean) as Card[]
      );
      setActiveShowcaseTheme(activeShowcase.theme);
    } else {
      const sIds = getShowcaseIds();
      setShowcaseCards(sIds.map(id => owned.find(c => c.id === id)).filter(Boolean) as Card[]);
    }

    setXp(getXP());
    setStreak(getStreak());
    setPacks(getPackCredits());
    setCollectorLevel(getCollectorLevel());
    setEarnedIds(new Set(getEarnedAchievements().map(a => a.achievementId)));
    setPinnedBadgeIds(getPinnedBadges());
    setVip(getVipState());
    setActivityEvents(getPlayerActivityEvents().slice(0, 10));
  }, []);

  const tierColor = TIER_COLORS[collectorLevel.tier] || '#818cf8';

  const setStats = SETS.map(set => {
    const owned = new Set(ownedCards.filter(c => c.setSlug === set.slug).map(c => c.character)).size;
    return { ...set, owned, total: set.cardCount };
  });

  const scarcityDist = ownedCards.reduce((acc, c) => {
    acc[c.scarcity] = (acc[c.scarcity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = ownedCards.reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Collector Level Hero — no entrance animation for instant render */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{
          background: `linear-gradient(135deg, rgba(18,20,31,0.95), ${tierColor}08)`,
          border: `1px solid ${tierColor}20`,
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          {/* Level badge */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-mono flex-shrink-0"
            style={{
              background: `${tierColor}15`,
              border: `2px solid ${tierColor}40`,
              color: tierColor,
              boxShadow: `0 0 20px ${tierColor}10`,
            }}
          >
            {collectorLevel.level}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="type-heading">{PROFILE.username}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{ color: tierColor, background: `${tierColor}15`, border: `1px solid ${tierColor}20` }}
              >
                {collectorLevel.tier}
              </span>
              <span className="text-xs text-muted">Since {new Date(PROFILE.joinedDate).toLocaleDateString()}</span>
            </div>
            {/* Pinned Badge Strip */}
            {pinnedBadgeIds.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                {pinnedBadgeIds.map(id => {
                  const a = getAchievementById(id);
                  if (!a) return null;
                  const color = getAchievementRarityColor(a.rarity);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${color}15`, border: `1px solid ${color}25`, color }}
                      title={a.description}
                    >
                      <span>{a.icon}</span>
                      <span>{a.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted font-mono">
              {collectorLevel.currentXP.toLocaleString()} XP
            </span>
            <span className="text-[10px] text-muted font-mono">
              {collectorLevel.xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-border/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${tierColor}, ${tierColor}cc)` }}
              initial={{ width: 0 }}
              animate={{ width: `${collectorLevel.progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-2 mt-4">
          {[
            { label: 'Cards', value: ownedCards.length },
            { label: 'Value', value: `$${totalValue.toFixed(0)}` },
            { label: 'Streak', value: `${streak}d` },
            { label: 'Packs', value: packs },
            { label: 'Badges', value: earnedIds.size },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-xl bg-background/40">
              <div className="text-base font-bold font-mono">{stat.value}</div>
              <div className="text-[9px] text-muted uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* VIP Status Card — no entrance animation */}
      {vip && (
        <div
          className="mb-6 rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${vip.tier.color}25` }}
        >
          {/* VIP Header */}
          <div
            className="p-4"
            style={{ background: `linear-gradient(135deg, ${vip.tier.color}08, ${vip.tier.color}15)` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: `${vip.tier.color}20`, color: vip.tier.color, border: `1.5px solid ${vip.tier.color}40` }}
              >
                VIP
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: vip.tier.color }}>{vip.tier.name}</span>
                  <span className="text-[10px] text-muted">Member</span>
                </div>
                {vip.nextTierName && (
                  <div className="text-[10px] text-muted">
                    <span className="font-mono" style={{ color: vip.tier.color }}>{vip.xpToNextTier.toLocaleString()}</span> XP to {vip.nextTierName}
                  </div>
                )}
              </div>
              <Link href="/guide#vip" className="text-[10px] text-muted hover:text-foreground transition-colors">
                Details &rarr;
              </Link>
            </div>

            {/* Progress to next tier */}
            {vip.nextTierName && (
              <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: vip.tier.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${vip.progressToNextTier}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            )}

            {/* Maintain warning */}
            {vip.maintainWarning && (
              <div className="mt-2 text-[10px] text-amber-400 font-medium">
                {vip.maintainWarning}
              </div>
            )}
          </div>

          {/* Benefits row */}
          <div className="grid grid-cols-3 divide-x divide-border/20 bg-surface/30">
            <div className="p-3 text-center">
              <div className="text-xs font-bold font-mono">{vip.packsPerWeek}/wk</div>
              <div className="text-[9px] text-muted uppercase tracking-wider">Free Packs</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs font-bold font-mono" style={{ color: vip.rebatePercent > 0 ? vip.tier.color : undefined }}>
                {vip.rebatePercent > 0 ? `${vip.rebatePercent}%` : '—'}
              </div>
              <div className="text-[9px] text-muted uppercase tracking-wider">Rebate</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-xs font-bold font-mono">
                {vip.earlyAccessMinutes > 0 ? `${vip.earlyAccessMinutes}m` : '—'}
              </div>
              <div className="text-[9px] text-muted uppercase tracking-wider">Early Access</div>
            </div>
          </div>
        </div>
      )}

      {/* Hall of Valhalla link */}
      <Link
        href="/hall"
        className="block mb-6 p-3 rounded-xl bg-gradient-to-r from-amber-500/5 to-purple-500/5 border border-amber-500/15 hover:border-amber-500/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🏛</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-foreground">Hall of Valhalla</div>
            <div className="text-[10px] text-muted">Compete with the greatest collectors</div>
          </div>
          <span className="text-muted text-xs">→</span>
        </div>
      </Link>

      {/* Lore Codex link */}
      <Link
        href="/codex"
        className="block mb-6 p-3 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/15 hover:border-indigo-500/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📖</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-foreground">Lore Codex</div>
            <div className="text-[10px] text-muted">Unlock hidden stories between the cards</div>
          </div>
          <span className="text-muted text-xs">→</span>
        </div>
      </Link>

      {/* Forge link */}
      <Link
        href="/forge"
        className="block mb-6 p-3 rounded-xl bg-gradient-to-r from-orange-500/5 to-red-500/5 border border-orange-500/15 hover:border-orange-500/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🔨</span>
          <div className="flex-1">
            <div className="text-xs font-bold text-foreground">Forge</div>
            <div className="text-[10px] text-muted">Combine cards to forge higher rarities</div>
          </div>
          <span className="text-muted text-xs">→</span>
        </div>
      </Link>

      {/* Your Activity */}
      {activityEvents.length > 0 && (
        <section className="mb-8">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3 block">Your Activity</span>
          <div className="space-y-2">
            {activityEvents.map((event) => {
              const config = SOCIAL_FEED_CONFIG[event.type];
              const totalReactions = Object.values(event.reactions).reduce((a, b) => a + b, 0);
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface/40 border border-border/20">
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
                    </div>
                    <div className="text-xs font-medium text-foreground/90 leading-snug">{event.text}</div>
                    {event.subtext && (
                      <div className="text-[10px] text-muted mt-0.5">{event.subtext}</div>
                    )}
                    {totalReactions > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {REACTION_TYPES.filter(r => event.reactions[r.id] > 0).map(r => (
                          <span key={r.id} className="flex items-center gap-0.5 text-[10px] text-muted">
                            {r.emoji} <span className="font-mono">{event.reactions[r.id]}</span>
                          </span>
                        ))}
                        <span className="text-[9px] text-muted/40 ml-1">{totalReactions} reactions</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Season Track — no entrance animation */}
      <section className="mb-8">
        <SeasonTrack />
      </section>

      {/* Showcase */}
      {showcaseCards.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Showcase</span>
            <Link href="/collection/showcase" className="text-xs text-accent hover:text-accent/80 transition-colors">
              Edit
            </Link>
          </div>
          <div
            className="p-6 rounded-2xl overflow-hidden relative"
            style={{
              background: SHOWCASE_THEMES[activeShowcaseTheme].bg,
              border: `1px solid ${SHOWCASE_THEMES[activeShowcaseTheme].border}`,
            }}
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }} />
            <div className="flex gap-4 overflow-x-auto pb-2 relative z-10 no-scrollbar">
              {showcaseCards.map((card) => (
                <div key={card.id} className="flex-shrink-0">
                  <CardItem card={card} size="lg" interactive={false} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements — lazy loaded, category tabs + pin controls */}
      <LazySection height={200}>
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Achievements</span>
          <span className="text-xs text-muted">{earnedIds.size}/{ACHIEVEMENTS.length}</span>
        </div>

        {/* Category tabs */}
        <div className="flex overflow-x-auto gap-1.5 pb-3 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
              activeCategory === 'all' ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-surface/40 text-muted border border-border/30 hover:text-foreground'
            }`}
          >
            All
          </button>
          {ACHIEVEMENT_CATEGORIES.map(cat => {
            const count = ACHIEVEMENTS.filter(a => a.category === cat.id && earnedIds.has(a.id)).length;
            const total = ACHIEVEMENTS.filter(a => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
                  activeCategory === cat.id ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-surface/40 text-muted border border-border/30 hover:text-foreground'
                }`}
              >
                {cat.icon} {cat.label} <span className="opacity-60">{count}/{total}</span>
              </button>
            );
          })}
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...ACHIEVEMENTS]
            .filter(a => activeCategory === 'all' || a.category === activeCategory)
            .sort((a, b) => {
              const ae = earnedIds.has(a.id) ? 0 : 1;
              const be = earnedIds.has(b.id) ? 0 : 1;
              return ae - be;
            })
            .map((achievement) => {
              const isEarned = earnedIds.has(achievement.id);
              const isPinned = pinnedBadgeIds.includes(achievement.id);
              const color = getAchievementRarityColor(achievement.rarity);
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl text-center relative group ${
                    isEarned ? 'bg-surface border border-border' : 'bg-surface/30 border border-border/30 opacity-40'
                  }`}
                >
                  {/* Pin button — only for earned badges */}
                  {isEarned && (
                    <button
                      onClick={() => {
                        const updated = togglePinnedBadge(achievement.id);
                        setPinnedBadgeIds(updated);
                      }}
                      className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[8px] transition-all ${
                        isPinned
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-surface/60 text-muted border border-border/30 opacity-0 group-hover:opacity-100'
                      }`}
                      title={isPinned ? 'Unpin badge' : pinnedBadgeIds.length >= 3 ? 'Max 3 pinned' : 'Pin to profile'}
                    >
                      {isPinned ? '★' : '☆'}
                    </button>
                  )}

                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold"
                    style={{
                      background: isEarned ? `${color}20` : 'rgba(31,34,55,0.3)',
                      color: isEarned ? color : '#3a3d5c',
                      border: `1px solid ${isEarned ? color + '30' : 'rgba(31,34,55,0.2)'}`,
                    }}
                  >
                    {isEarned ? achievement.icon : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )}
                  </div>
                  <div className="text-xs font-semibold truncate">{achievement.hidden && !isEarned ? '???' : achievement.name}</div>
                  <div className="text-[9px] text-muted mt-0.5 truncate">{achievement.hidden && !isEarned ? 'Hidden achievement' : achievement.description}</div>
                  {isEarned && (
                    <div
                      className="text-[8px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded inline-block"
                      style={{ color, background: `${color}10` }}
                    >
                      {achievement.mockPercent}% earned
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>
      </LazySection>

      {/* Set Completion — lazy loaded, compact rows */}
      <LazySection height={220}>
      <section className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3 block">Set Completion</span>
        <div className="rounded-xl bg-surface border border-border divide-y divide-border/30 overflow-hidden">
          {setStats.map((set) => {
            const pct = set.total > 0 ? Math.round((set.owned / set.total) * 100) : 0;
            return (
              <div key={set.slug} className="flex items-center gap-3 px-3 py-2.5">
                <span className="text-sm shrink-0">{set.icon}</span>
                <span className="text-xs font-semibold flex-1 truncate">{set.name}</span>
                <div className="w-20 h-1.5 rounded-full bg-border/30 overflow-hidden shrink-0">
                  <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-muted font-mono w-10 text-right">{set.owned}/{set.total}</span>
              </div>
            );
          })}
        </div>
      </section>
      </LazySection>

      {/* Scarcity Distribution — lazy loaded */}
      <LazySection height={80}>
      <section className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-3 block">Scarcity Distribution</span>
        <div className="grid grid-cols-5 gap-2">
          {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as Scarcity[]).map((scarcity) => (
            <div
              key={scarcity}
              className="p-2 rounded-lg text-center"
              style={{
                background: `${SCARCITY_CONFIG[scarcity].color}10`,
                border: `1px solid ${SCARCITY_CONFIG[scarcity].color}20`,
              }}
            >
              <div className="text-base font-bold font-mono" style={{ color: SCARCITY_CONFIG[scarcity].color }}>
                {scarcityDist[scarcity] || 0}
              </div>
              <div className="text-[9px] text-muted capitalize">{scarcity}</div>
            </div>
          ))}
        </div>
      </section>
      </LazySection>

      {/* Testing Controls — dev only */}
      {process.env.NODE_ENV === 'development' && (
      <section className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted/30 mb-4 block">Testing Controls</span>
        <div className="flex gap-3">
          <button
            onClick={() => { addPackCredits(5); window.location.reload(); }}
            className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 hover:bg-green-500/20"
          >
            +5 Pack Credits
          </button>
          <button
            onClick={() => { resetAll(); window.location.reload(); }}
            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20"
          >
            Reset Everything
          </button>
        </div>
      </section>
      )}
    </div>
  );
}
