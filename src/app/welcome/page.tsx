'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { shouldShowWelcome, updateOnboarding } from '@/lib/onboarding';
import { SETS } from '@/data/sets';
import { addPackCredits } from '@/lib/store';

const STARTER_SETS = SETS.slice(0, 3); // First 3 sets as starter choices

type Step = 'intro' | 'choose-set' | 'ready';

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('intro');
  const [chosenSet, setChosenSet] = useState<string | null>(null);
  const [isReferred, setIsReferred] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!shouldShowWelcome()) {
      router.replace('/');
      return;
    }
    // Store referral code if present (don't overwrite existing attribution)
    const refCode = searchParams.get('ref');
    if (refCode && !localStorage.getItem('lorevault_referred_by')) {
      localStorage.setItem('lorevault_referred_by', refCode);
    }
    if (refCode || localStorage.getItem('lorevault_referred_by')) {
      setIsReferred(true);
    }
  }, [router, searchParams]);

  const handleChooseSet = (setSlug: string) => {
    setChosenSet(setSlug);
  };

  const handleStart = () => {
    updateOnboarding({ hasVisited: true, hasOpenedFirstPack: true });
    // Grant 3 starter packs
    addPackCredits(3);
    router.push(`/packs?first=true${chosenSet ? `&set=${chosenSet}` : ''}`);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              background: `rgba(129, 140, 248, ${0.15 + Math.random() * 0.25})`,
            }}
            initial={{ x: `${Math.random() * 100}%`, y: `${50 + Math.random() * 50}%`, opacity: 0 }}
            animate={{ y: [`${50 + Math.random() * 50}%`, `${Math.random() * 40}%`], opacity: [0, 0.6, 0] }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{ opacity: [0.12, 0.22, 0.12], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.25), transparent 70%)', filter: 'blur(60px)' }}
      />

      {/* Step progress dots */}
      <div className="absolute top-8 flex gap-2">
        {['intro', 'choose-set', 'ready'].map((s, i) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all ${
              step === s ? 'bg-accent w-6' : i < ['intro', 'choose-set', 'ready'].indexOf(step) ? 'bg-accent/50' : 'bg-border/30'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Intro */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-12"
            >
              <motion.div
                animate={{ rotate: [0, -1, 1.5, -1, 0.5, 0], y: [0, -5, 0, -3, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-48 h-64 rounded-2xl border-2 border-accent/30 flex flex-col items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a103a 0%, #2d1b69 40%, #16213e 100%)', boxShadow: '0 0 80px rgba(129,140,248,0.12), 0 20px 60px rgba(0,0,0,0.4)' }}
              >
                <div className="absolute inset-0 card-shimmer opacity-40" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent/50" />
                <motion.span className="text-6xl mb-3 relative z-10" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  📜
                </motion.span>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium relative z-10">LoreVault</span>
                <span className="text-[9px] text-accent/50 uppercase tracking-wider mt-1 relative z-10">Starter Pack</span>
              </motion.div>
            </motion.div>

            <h1 className="text-[22px] font-bold tracking-tight mb-2.5 text-white">
              Every legend begins with a single card.
            </h1>
            <p className="text-sm text-muted max-w-[280px] mx-auto leading-relaxed mb-10">
              Sherlock Holmes. Dracula. Zeus. The greatest characters ever written — now yours to collect.
            </p>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep('choose-set')}
              className="px-12 py-4 rounded-2xl bg-accent text-white font-bold text-[15px] shadow-xl shadow-accent/25"
            >
              Begin Your Journey
            </motion.button>
            <p className="text-[11px] text-muted/30 mt-6">
              {isReferred ? 'A friend sent you here — 3 free packs included' : '3 free packs included'}
            </p>
          </motion.div>
        )}

        {/* STEP 2: Choose starter set */}
        {step === 'choose-set' && (
          <motion.div
            key="choose-set"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-6 max-w-sm w-full"
          >
            <h2 className="text-lg font-bold text-white mb-1">Choose Your World</h2>
            <p className="text-xs text-muted mb-6">Your first pack will feature cards from this collection</p>

            <div className="space-y-3 mb-8">
              {STARTER_SETS.map((set) => (
                <motion.button
                  key={set.slug}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChooseSet(set.slug)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    chosenSet === set.slug
                      ? 'border-2 border-accent bg-accent/10 ring-1 ring-accent/30'
                      : 'border border-border/30 bg-surface/40 hover:border-border/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{set.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-foreground">{set.name}</div>
                      <div className="text-[10px] text-muted">{set.description}</div>
                    </div>
                    {chosenSet === set.slug && <span className="text-accent text-sm">✓</span>}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep('ready')}
              disabled={!chosenSet}
              className={`px-10 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                chosenSet
                  ? 'bg-accent text-white shadow-xl shadow-accent/25'
                  : 'bg-border/20 text-muted cursor-not-allowed'
              }`}
            >
              Continue
            </motion.button>
          </motion.div>
        )}

        {/* STEP 3: Ready to open */}
        {step === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-6 max-w-sm w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-6xl mb-6"
            >
              🎁
            </motion.div>

            <h2 className="text-lg font-bold text-white mb-2">Your Starter Pack Awaits</h2>
            <p className="text-xs text-muted mb-2">
              5 cards from the <span className="text-accent font-semibold">{STARTER_SETS.find(s => s.slug === chosenSet)?.name}</span> collection
            </p>

            <div className="flex justify-center gap-4 mb-8 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">3</div>
                <div className="text-[9px] text-muted uppercase">Free Packs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">15</div>
                <div className="text-[9px] text-muted uppercase">Cards Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">1+</div>
                <div className="text-[9px] text-muted uppercase">Rare Guaranteed</div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleStart}
              className="px-12 py-4 rounded-2xl bg-gradient-to-r from-accent to-purple-500 text-white font-bold text-[15px] shadow-xl shadow-accent/25"
            >
              Open Your First Pack
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
      <WelcomeContent />
    </Suspense>
  );
}
