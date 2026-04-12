'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { shouldShowWelcome, updateOnboarding } from '@/lib/onboarding';

export default function WelcomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If user has already opened their first pack, redirect to home
    if (!shouldShowWelcome()) {
      router.replace('/');
    }
  }, [router]);

  const handleStart = () => {
    updateOnboarding({ hasVisited: true });
    router.push('/packs?first=true');
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${50 + Math.random() * 50}%`, `${Math.random() * 50}%`],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Central glow */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129,140,248,0.2), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Pack */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-10"
      >
        <motion.div
          animate={{
            rotate: [0, -1.5, 1.5, -1, 1, 0],
            y: [0, -4, 0, -2, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-44 h-60 rounded-2xl border-2 border-accent/40 flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a103a 0%, #2d1b69 50%, #16213e 100%)',
            boxShadow: '0 0 60px rgba(129,140,248,0.15), 0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 card-shimmer opacity-30" />

          {/* Pack seal */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent/60" />

          <span className="text-5xl mb-2 relative z-10">📜</span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium relative z-10">LoreVault</span>
          <span className="text-[9px] text-accent/60 uppercase tracking-wider mt-1 relative z-10">Starter Pack</span>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center mb-10 px-8"
      >
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Every legend begins with a single card.
        </h1>
        <p className="text-sm text-muted max-w-xs mx-auto">
          Sherlock Holmes. Dracula. Zeus. The greatest characters ever written — now yours to collect.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleStart}
        className="px-10 py-4 rounded-2xl bg-accent text-white font-bold text-base shadow-xl shadow-accent/25 hover:shadow-accent/35 transition-shadow"
      >
        Open Your First Pack
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-[11px] text-muted/40 mt-6"
      >
        3 free packs included
      </motion.p>
    </div>
  );
}
