'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardItem from '@/components/CardItem';
import { SeasonTrackPreview } from '@/components/SeasonTrack';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { CHALLENGES } from '@/data/challenges';
import { Card, getTierForLevel } from '@/data/types';
import { getOwnedCards, getPackCredits, getXP, getStreak, getShowcaseIds, getOwnedCardIds, getCollectorLevel, getDailyMissions, getLoginCalendar, claimLoginDay, LOGIN_REWARDS, recordVisit, getCollectorPass, COLLECTOR_PASS_TIERS, getWeeklyChallenges, getFeaturedSetEvent, getChallengeChain, getMonthlyLeaderboard, getMonthEndBonus, getSmartCTA, getPendingActions, decodeCollectionFlex, getCollectionFlex, type LoginCalendarState, type CollectorPassState, type WeeklyChallenge, type FeaturedSetEvent, type ChallengeChainState, type LeaderboardEntry, type SmartCTA, type CollectionFlex } from '@/lib/store';
import { shouldShowWelcome } from '@/lib/onboarding';
import { useRouter } from 'next/navigation';
import { getVipState } from '@/lib/vip';
import { FEED_CONTENT } from '@/data/feed-content';
import FeedCard from '@/components/FeedCard';
import SocialFeed from '@/components/SocialFeed';
import { getFomoCount } from '@/lib/pulse';
import { useSearchParams } from 'next/navigation';

const TIER_COLORS: Record<string, string> = {
  Newcomer: '#6b7094',
  Collector: '#22c55e',
  Enthusiast: '#3b82f6',
  Connoisseur: '#a855f7',
  Elite: '#f59e0b',
  Legendary: '#ef4444',
};

const feedEntries = [...FEED_CONTENT].sort((a, b) => {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [packs, setPacks] = useState(0);
  const [streak, setStreak] = useState(0);
  const [ready, setReady] = useState(false);
  const [collectorLevel, setCollectorLevel] = useState({ level: 1, tier: 'Newcomer' as string, progressPercent: 0, currentXP: 0, xpForNextLevel: 100, xpForCurrentLevel: 0 });
  const [dailyMission, setDailyMission] = useState<{ description: string; progress: number; target: number; reward: string } | null>(null);
  const [vipTier, setVipTier] = useState<{ name: string; color: string }>({ name: 'Bronze', color: '#CD7F32' });
  const [fomo, setFomo] = useState({ legendaries: 0, epics: 0, packs: 0 });
  const [loginCalendar, setLoginCalendar] = useState<LoginCalendarState | null>(null);
  const [loginRewardClaimed, setLoginRewardClaimed] = useState<string | null>(null);
  const [collectorPass, setCollectorPass] = useState<CollectorPassState | null>(null);
  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>([]);
  const [setProgress, setSetProgress] = useState<Map<string, { owned: number; total: number }>>(new Map());
  const [showReferralBanner, setShowReferralBanner] = useState(false);
  const [featuredEvent, setFeaturedEvent] = useState<FeaturedSetEvent | null>(null);
  const [challengeChain, setChallengeChain] = useState<ChallengeChainState | null>(null);
  const [eventCountdown, setEventCountdown] = useState('');
  const [leaderboard, setLeaderboard] = useState<{ entries: LeaderboardEntry[]; playerRank: number; daysLeft: number } | null>(null);
  const [monthEndBonus, setMonthEndBonus] = useState<{ active: boolean; multiplier: number; daysLeft: number; label: string }>({ active: false, multiplier: 1, daysLeft: 0, label: '' });
  const [smartCta, setSmartCta] = useState<SmartCTA | null>(null);
  const [morningToast, setMorningToast] = useState<string[]>([]);
  const [flexComparison, setFlexComparison] = useState<{ theirs: Partial<CollectionFlex>; mine: Partial<CollectionFlex> } | null>(null);

  useEffect(() => {
    // Capture referral code before any redirect — new users get forwarded to /welcome
    const refCode = searchParams.get('ref');
    if (refCode && !localStorage.getItem('lorevault_referred_by')) {
      localStorage.setItem('lorevault_referred_by', refCode);
      setShowReferralBanner(true);
      setTimeout(() => setShowReferralBanner(false), 5000);
    }

    if (shouldShowWelcome()) {
      router.replace('/welcome');
      return;
    }

    // Handle ?flex= collection comparison landing
    const flexParam = searchParams.get('flex');
    if (flexParam) {
      const theirs = decodeCollectionFlex(flexParam);
      const mine = getCollectionFlex();
      if (theirs.totalCards !== undefined) {
        setFlexComparison({ theirs, mine });
      }
    }

    recordVisit(); // Update streak before reading it
    const owned = getOwnedCards();
    setOwnedCards(owned);
    setPacks(getPackCredits());
    setStreak(getStreak());
    setCollectorLevel(getCollectorLevel());

    // Compute set collection progress — unique characters owned vs total unique in set
    const progress = new Map<string, { owned: number; total: number }>();
    for (const set of SETS) {
      const allSetChars = new Set(ALL_CARDS.filter(c => c.setSlug === set.slug).map(c => c.character));
      const ownedSetChars = new Set(owned.filter(c => c.setSlug === set.slug).map(c => c.character));
      progress.set(set.slug, { owned: ownedSetChars.size, total: allSetChars.size });
    }
    setSetProgress(progress);

    const vs = getVipState();
    setVipTier({ name: vs.tier.name, color: vs.tier.color });
    setFomo(getFomoCount());
    setLoginCalendar(getLoginCalendar());
    setCollectorPass(getCollectorPass());
    setWeeklyChallenges(getWeeklyChallenges());
    setFeaturedEvent(getFeaturedSetEvent());
    setChallengeChain(getChallengeChain());
    const lb = getMonthlyLeaderboard();
    setLeaderboard({ entries: lb.entries, playerRank: lb.playerRank, daysLeft: lb.daysLeft });
    setMonthEndBonus(getMonthEndBonus());
    setSmartCta(getSmartCTA());
    const pending = getPendingActions();
    if (pending.length > 0 && !sessionStorage.getItem('lorevault_toast_shown')) {
      setMorningToast(pending);
      sessionStorage.setItem('lorevault_toast_shown', '1');
      setTimeout(() => setMorningToast([]), 5000);
    }
    const missions = getDailyMissions();
    const incomplete = missions.find(m => !m.completed);
    if (incomplete) setDailyMission(incomplete);
    else if (missions.length > 0) setDailyMission(missions[0]);

    setReady(true);
  }, [router, searchParams]);

  // Event countdown timer
  useEffect(() => {
    if (!featuredEvent) return;
    const tick = () => {
      const ms = new Date(featuredEvent.endsAt).getTime() - Date.now();
      if (ms <= 0) { setEventCountdown('Event ended'); return; }
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      setEventCountdown(d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [featuredEvent]);

  const tierColor = TIER_COLORS[collectorLevel.tier] || '#818cf8';

  // Featured card: pick the best card from a random set
  const featuredCard = ALL_CARDS.find(c => c.scarcity === 'legendary' && c.setSlug === 'olympus')
    || ALL_CARDS.find(c => c.scarcity === 'legendary')
    || ALL_CARDS[0];

  // Featured horizontal scroll — one standout card per set
  const featuredCards = SETS.map(set => {
    const setCards = ALL_CARDS.filter(c => c.setSlug === set.slug);
    return setCards.find(c => c.scarcity === 'legendary') || setCards.find(c => c.scarcity === 'epic') || setCards[0];
  }).filter(Boolean);

  if (!ready) return null;

  return (
    <div className="min-h-screen">
      {/* ========== MORNING TOAST ========== */}
      {morningToast.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-4 mb-3 p-3 rounded-xl bg-accent/8 border border-accent/20"
        >
          <div className="text-xs font-semibold text-accent mb-1">{morningToast.length} thing{morningToast.length > 1 ? 's' : ''} waiting for you today</div>
          {morningToast.map((action, i) => (
            <div key={i} className="text-[10px] text-muted flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-accent" />
              {action}
            </div>
          ))}
        </motion.div>
      )}

      {/* ========== COLLECTION COMPARISON ========== */}
      {flexComparison && (
        <section className="px-4 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/8 to-accent/8 border border-purple-500/20"
          >
            <div className="text-[10px] uppercase tracking-[0.1em] text-muted mb-3 text-center">Collection Comparison</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[9px] text-muted mb-1">Their Vault</div>
                <div className="text-lg font-bold text-purple-400">{flexComparison.theirs.totalCards || 0}</div>
                <div className="text-[8px] text-muted">cards</div>
                <div className="text-xs font-semibold text-purple-400 mt-1">L{flexComparison.theirs.collectorLevel || 1}</div>
              </div>
              <div className="flex items-center justify-center text-lg text-muted">vs</div>
              <div>
                <div className="text-[9px] text-muted mb-1">Your Vault</div>
                <div className="text-lg font-bold text-accent">{flexComparison.mine.totalCards || 0}</div>
                <div className="text-[8px] text-muted">cards</div>
                <div className="text-xs font-semibold text-accent mt-1">L{flexComparison.mine.collectorLevel || 1}</div>
              </div>
            </div>
            {(flexComparison.mine.totalCards || 0) < (flexComparison.theirs.totalCards || 0) && (
              <Link href="/packs">
                <div className="mt-3 text-center text-[10px] text-accent font-bold">Catch up — Open packs →</div>
              </Link>
            )}
          </motion.div>
        </section>
      )}

      {/* ========== MONTH-END FOMO BANNER ========== */}
      {monthEndBonus.active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-4 mb-3 p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-center"
        >
          <div className="text-xs font-bold text-orange-400">{monthEndBonus.label}</div>
          <div className="text-[10px] text-muted">{monthEndBonus.daysLeft === 0 ? 'Last day!' : `${monthEndBonus.daysLeft} day${monthEndBonus.daysLeft > 1 ? 's' : ''} left this month`}</div>
        </motion.div>
      )}

      {/* ========== HERO — Asymmetric Layout ========== */}
      <section className="relative px-4 pt-4 pb-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `linear-gradient(135deg, ${tierColor}08 0%, transparent 40%, rgba(129,140,248,0.03) 100%)`,
        }} />

        <div className="relative flex gap-4 items-start max-w-lg mx-auto">
          {/* Left: Featured card — large, angled */}
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -3 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            className="flex-shrink-0 relative"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <div className="relative">
              <CardItem card={featuredCard!} size="lg" interactive={false} />
              {/* Glow behind card */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20" style={{
                background: `linear-gradient(135deg, ${featuredCard!.gradientFrom}, ${featuredCard!.gradientTo})`,
                transform: 'scale(1.3)',
              }} />
            </div>
          </motion.div>

          {/* Right: Level + Stats + CTA stack */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-1 pt-2 min-w-0"
          >
            {/* Collector Level */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold font-mono"
                  style={{
                    background: `${tierColor}15`,
                    border: `1.5px solid ${tierColor}40`,
                    color: tierColor,
                  }}
                >
                  {collectorLevel.level}
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">{collectorLevel.tier}</div>
                  <div className="text-[10px] text-muted font-mono">{collectorLevel.currentXP.toLocaleString()} XP</div>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: tierColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${collectorLevel.progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
            </div>

            {/* Streak + Cards + VIP */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                style={{ backgroundColor: `${vipTier.color}10`, border: `1px solid ${vipTier.color}25` }}
              >
                <span className="text-[10px] font-bold font-mono" style={{ color: vipTier.color }}>{vipTier.name}</span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[10px] font-bold font-mono text-orange-400">{streak}d streak</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface border border-border">
                <span className="text-[10px] font-mono text-muted">{ownedCards.length} cards</span>
              </div>
            </div>

            {/* Smart CTA — context-aware primary action */}
            <Link href={smartCta?.link || '/packs'}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden rounded-xl p-4 mb-3"
                style={{
                  background: 'linear-gradient(135deg, #1a103a 0%, #2d1b69 50%, #16213e 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 card-shimmer" />
                </div>
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.08em] text-accent/70 mb-0.5">
                    {smartCta?.icon || '📦'} {smartCta?.sublabel || 'Pull cards. Chase rarities.'}
                  </div>
                  <div className="type-display text-white">{smartCta?.label || 'Open Packs'}</div>
                </div>
              </motion.div>
            </Link>

            {/* Season progress mini */}
            <div className="text-[10px] text-muted font-mono">
              Season 1 &middot; Age of Myths
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== LOGIN CALENDAR ========== */}
      {loginCalendar && (
        <section className="px-4 mb-6">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2 block">Daily Login Rewards</span>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-3 rounded-xl bg-surface border border-border"
          >
            <div className="grid grid-cols-7 gap-1.5">
              {LOGIN_REWARDS.map((reward, idx) => {
                const claimed = loginCalendar.days[idx];
                const isCurrent = idx === loginCalendar.currentDay && !loginCalendar.claimedToday;

                return (
                  <button
                    key={idx}
                    disabled={!isCurrent}
                    onClick={() => {
                      if (isCurrent) {
                        const result = claimLoginDay();
                        if (result) {
                          setLoginCalendar(result.newState);
                          setLoginRewardClaimed(`${result.reward.icon} ${result.reward.label}`);
                          setTimeout(() => setLoginRewardClaimed(null), 3000);
                        }
                      }
                    }}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-center transition-all ${
                      claimed
                        ? 'bg-accent/15 border border-accent/30'
                        : isCurrent
                          ? 'bg-emerald-500/15 border-2 border-emerald-500/40 animate-pulse'
                          : 'bg-surface/40 border border-border/20 opacity-50'
                    }`}
                  >
                    <span className="text-sm">{claimed ? '✅' : reward.icon}</span>
                    <span className="text-[8px] text-muted font-mono">D{idx + 1}</span>
                  </button>
                );
              })}
            </div>
            {loginRewardClaimed && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-center text-xs text-emerald-400 font-semibold"
              >
                {loginRewardClaimed} claimed!
              </motion.div>
            )}
            {!loginCalendar.claimedToday && loginCalendar.currentDay < 7 && (
              <div className="mt-2 text-center text-[10px] text-emerald-400/70">
                Tap Day {loginCalendar.currentDay + 1} to claim today&apos;s reward
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ========== DAILY CHALLENGE ========== */}
      {dailyMission && (
        <section className="px-4 mb-6">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2 block">Daily Challenge</span>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-surface border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">{dailyMission.description}</div>
              <span className="text-[10px] font-mono text-accent">{dailyMission.reward}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(dailyMission.progress / dailyMission.target) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
              <span className="text-xs font-mono text-muted">{dailyMission.progress}/{dailyMission.target}</span>
            </div>
          </motion.div>
        </section>
      )}

      {/* ========== FEATURED SET EVENT ========== */}
      {featuredEvent && (
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Weekly Event</span>
            <span className="text-[10px] text-yellow-400 font-mono">{eventCountdown} left</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/8 to-orange-500/8 border border-yellow-500/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{featuredEvent.setIcon}</span>
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground">{featuredEvent.setName}</div>
                <div className="text-[10px] text-yellow-400 font-semibold">{featuredEvent.xpMultiplier}x XP on all packs from this set</div>
              </div>
              <div className="px-2 py-1 rounded-lg bg-yellow-500/15 border border-yellow-500/30">
                <span className="text-[10px] font-bold text-yellow-400">2x XP</span>
              </div>
            </div>
            <Link href="/packs">
              <div className="text-[10px] text-muted mt-1">Open packs from <span className="text-yellow-400 font-semibold">{featuredEvent.setName}</span> for double XP this week →</div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ========== 7-DAY CHALLENGE CHAIN ========== */}
      {challengeChain && challengeChain.days.length > 0 && (
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Weekly Chain</span>
            <span className="text-[10px] text-accent font-mono">{challengeChain.days.filter(d => d.completed).length}/7 days</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-xl bg-surface border border-border"
          >
            <div className="flex gap-1 mb-2">
              {challengeChain.days.map((d) => {
                const isCurrent = !d.completed && (d.day === 1 || challengeChain.days[d.day - 2]?.completed);
                return (
                  <div
                    key={d.day}
                    className={`flex-1 text-center p-1.5 rounded-lg transition-all ${
                      d.completed
                        ? 'bg-emerald-500/15 border border-emerald-500/30'
                        : isCurrent
                          ? 'bg-accent/10 border-2 border-accent/40 animate-pulse'
                          : 'bg-surface/40 border border-border/20 opacity-40'
                    }`}
                  >
                    <span className="text-xs">{d.completed ? '✅' : d.icon}</span>
                    <div className="text-[7px] text-muted mt-0.5">D{d.day}</div>
                  </div>
                );
              })}
            </div>
            {(() => {
              const current = challengeChain.days.find(d => !d.completed && (d.day === 1 || challengeChain.days[d.day - 2]?.completed));
              if (challengeChain.allComplete) {
                return <div className="text-center text-[10px] text-emerald-400 font-semibold">Chain complete! Pack + 500 XP + Weekly Warrior badge earned</div>;
              }
              if (current) {
                return <div className="text-center text-[10px] text-muted">Today: <span className="text-accent font-semibold">{current.description}</span></div>;
              }
              return null;
            })()}
          </motion.div>
        </section>
      )}

      {/* ========== COLLECTOR PASS PREVIEW ========== */}
      {collectorPass && (
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Collector Pass</span>
            <span className="text-[10px] text-accent font-mono">Tier {collectorPass.currentTier}/30</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-3 rounded-xl bg-gradient-to-r from-violet-500/5 to-indigo-500/5 border border-violet-500/15"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(collectorPass.currentTier / 30) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
              <span className="text-xs font-mono text-muted">{collectorPass.xpEarned} XP</span>
            </div>
            <div className="flex gap-1 overflow-hidden">
              {COLLECTOR_PASS_TIERS.slice(Math.max(0, collectorPass.currentTier - 1), collectorPass.currentTier + 4).map(t => (
                <div
                  key={t.tier}
                  className={`flex-1 text-center p-1 rounded-md text-[9px] ${
                    t.tier <= collectorPass.currentTier ? 'bg-violet-500/15 text-violet-400' : 'bg-surface/30 text-muted/50'
                  }`}
                >
                  <div>{t.freeReward.icon}</div>
                  <div>T{t.tier}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ========== WEEKLY CHALLENGES ========== */}
      {weeklyChallenges.length > 0 && (
        <section className="px-4 mb-6">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2 block">Weekly Challenges</span>
          <div className="space-y-2">
            {weeklyChallenges.map((ch, i) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={`p-3 rounded-xl border ${ch.completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-surface border-border'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{ch.icon}</span>
                    <span className="text-xs font-semibold">{ch.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-accent">{ch.reward}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${ch.completed ? 'bg-emerald-500' : 'bg-accent'}`}
                      style={{ width: `${Math.min(100, (ch.progress / ch.target) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted">{ch.progress}/{ch.target}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ========== SEASON 2 TEASE ========== */}
      <section className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-red-900/10 via-orange-900/10 to-yellow-900/10 border border-red-500/10 text-center"
        >
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-xs font-bold text-foreground mb-0.5">Season 2: The Underworld</div>
          <div className="text-[10px] text-muted">New characters. New lore. Coming soon.</div>
          <div className="flex justify-center gap-3 mt-2">
            {['👤', '👤', '👤', '👤', '👤'].map((_, i) => (
              <div key={i} className="w-6 h-8 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[10px] text-red-500/40">?</div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ========== FEATURED CARDS — Large horizontal scroll ========== */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Featured</span>
          <Link href="/marketplace" className="text-[11px] text-accent hover:text-accent/80 transition-colors">
            Marketplace
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4">
          {featuredCards.slice(0, 4).map((card, i) => (
            <motion.div
              key={card!.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex-shrink-0"
            >
              <Link href={`/card/${card!.id}`}>
                <CardItem card={card!} size="lg" showPrice />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== REFERRAL LANDING BANNER ========== */}
      {showReferralBanner && (
        <section className="px-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-accent/10 border border-emerald-500/20 text-center"
          >
            <span className="text-xs font-semibold text-emerald-400">A friend invited you to LoreVault!</span>
            <span className="text-[10px] text-muted block mt-0.5">Open packs and build your collection together</span>
          </motion.div>
        </section>
      )}

      {/* ========== SET COLLECTION PROGRESS ========== */}
      {ownedCards.length > 0 && (
        <section className="px-4 mb-6">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2 block">Your Sets</span>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {SETS.map(set => {
              const prog = setProgress.get(set.slug);
              if (!prog) return null;
              const pct = Math.round((prog.owned / prog.total) * 100);
              return (
                <Link key={set.slug} href="/collection/sets" className="shrink-0">
                  <div className="w-[120px] p-2.5 rounded-xl bg-surface border border-border text-center">
                    <span className="text-lg">{set.icon}</span>
                    <div className="text-[10px] font-semibold text-foreground mt-1 truncate">{set.name}</div>
                    <div className="text-[9px] text-muted">{prog.owned}/{prog.total} chars</div>
                    <div className="w-full h-1 rounded-full bg-border/30 mt-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ========== DISCOVERY FEED — horizontal story carousel ========== */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 px-4">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Discover</span>
          <Link href="/discover/olympus-rising-full-set-guide" className="text-[11px] text-accent">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar px-4 snap-x snap-mandatory">
          {feedEntries.slice(0, 7).map((entry) => (
            <FeedCard key={entry.id} entry={entry} variant="story" />
          ))}
        </div>
      </section>

      {/* ========== LIVE FEED — social proof, FOMO, competition ========== */}
      <section className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Live</span>
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Active now
          </span>
        </div>

        {/* FOMO Counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-3"
        >
          <div className="flex-1 p-2.5 rounded-xl bg-gradient-to-r from-orange-500/5 to-red-500/5 border border-orange-500/15">
            <div className="text-lg font-bold font-mono text-orange-400">{fomo.legendaries}</div>
            <div className="text-[9px] text-muted">Legendaries pulled today</div>
          </div>
          <div className="flex-1 p-2.5 rounded-xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/15">
            <div className="text-lg font-bold font-mono text-purple-400">{fomo.epics}</div>
            <div className="text-[9px] text-muted">Epics pulled today</div>
          </div>
          <div className="flex-1 p-2.5 rounded-xl bg-gradient-to-r from-accent/5 to-cyan-500/5 border border-accent/15">
            <div className="text-lg font-bold font-mono text-accent">{fomo.packs.toLocaleString()}</div>
            <div className="text-[9px] text-muted">Packs opened today</div>
          </div>
        </motion.div>

        <SocialFeed />
      </section>

      {/* ========== SEASON TRACK PREVIEW ========== */}
      <section className="px-4 mb-6">
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted mb-2 block">Season Progress</span>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/profile">
            <SeasonTrackPreview />
          </Link>
        </motion.div>
      </section>

      {/* ========== MONTHLY LEADERBOARD ========== */}
      {leaderboard && leaderboard.entries.length > 0 && (
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Monthly Leaderboard</span>
            <span className="text-[10px] text-muted font-mono">{leaderboard.daysLeft}d left</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-surface border border-border overflow-hidden"
          >
            {leaderboard.entries.slice(0, 5).map((entry, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 ${entry.isPlayer ? 'bg-accent/8 border-l-2 border-accent' : ''} ${i > 0 ? 'border-t border-border/30' : ''}`}
              >
                <span className={`text-xs font-bold font-mono w-5 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-muted'}`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-semibold truncate ${entry.isPlayer ? 'text-accent' : 'text-foreground'}`}>{entry.name}</span>
                </div>
                <span className="text-[10px] text-muted font-mono">{entry.xp.toLocaleString()} XP</span>
              </div>
            ))}
            {leaderboard.playerRank > 5 && (
              <div className="flex items-center gap-3 px-3 py-2 bg-accent/8 border-l-2 border-accent border-t border-border/30">
                <span className="text-xs font-bold font-mono w-5 text-accent">#{leaderboard.playerRank}</span>
                <span className="text-xs font-semibold text-accent flex-1">You</span>
                <span className="text-[10px] text-muted font-mono">{leaderboard.entries.find(e => e.isPlayer)?.xp.toLocaleString() || 0} XP</span>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ========== COLLECTION SNAPSHOT ========== */}
      {ownedCards.length > 0 && (
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Your Collection</span>
            <Link href="/collection" className="text-[11px] text-accent hover:text-accent/80 transition-colors">
              View All
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {ownedCards.slice(-6).reverse().map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex-shrink-0"
              >
                <Link href={`/card/${card.id}`}>
                  <CardItem card={card} size="md" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  );
}
