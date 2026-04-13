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
      {/* Ambient particles — slow, ethereal */}
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
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${50 + Math.random() * 50}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${50 + Math.random() * 50}%`, `${Math.random() * 40}%`],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Ambient glow behind pack */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          opacity: [0.12, 0.22, 0.12],
          scale: [0.95, 1.08, 0.95],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129,140,248,0.25), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* The sealed pack — floating, glowing */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-12"
      >
        <motion.div
          animate={{
            rotate: [0, -1, 1.5, -1, 0.5, 0],
            y: [0, -5, 0, -3, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-48 h-64 rounded-2xl border-2 border-accent/30 flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a103a 0%, #2d1b69 40%, #16213e 100%)',
            boxShadow: '0 0 80px rgba(129,140,248,0.12), 0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 card-shimmer opacity-40" />

          {/* Seal line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent/50" />

          {/* Pack content */}
          <motion.span
            className="text-6xl mb-3 relative z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            📜
          </motion.span>
          <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium relative z-10">
            LoreVault
          </span>
          <span className="text-[9px] text-accent/50 uppercase tracking-wider mt-1 relative z-10">
            Starter Pack
          </span>

          {/* Inner glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(129,140,248,0.08) 0%, transparent 70%)',
          }} />
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center mb-10 px-8"
      >
        <h1 className="text-[22px] font-bold tracking-tight mb-2.5 text-white">
          Every legend begins with a single card.
        </h1>
        <p className="text-sm text-muted max-w-[280px] mx-auto leading-relaxed">
          Sherlock Holmes. Dracula. Zeus. The greatest characters ever written — now yours to collect.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleStart}
        className="px-12 py-4 rounded-2xl bg-accent text-white font-bold text-[15px] shadow-xl shadow-accent/25 hover:shadow-accent/40 transition-shadow"
      >
        Open Your First Pack
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-[11px] text-muted/30 mt-6"
      >
        3 free packs included
      </motion.p>
    </div>
  );
}
