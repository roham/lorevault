'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isFeatureUnlocked, getCardsNeededForFeature, FEATURE_THRESHOLDS } from '@/lib/activation';
import { getOwnedCardIds } from '@/lib/store';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  /** Fallback shown when locked. If not provided, a default teaser is shown. */
  fallback?: React.ReactNode;
}

export default function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const [unlocked, setUnlocked] = useState(true); // default to true for SSR
  const [cardsNeeded, setCardsNeeded] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const owned = getOwnedCardIds().length;
    setUnlocked(isFeatureUnlocked(feature));
    setCardsNeeded(getCardsNeededForFeature(feature, owned));
    setLoaded(true);
  }, [feature]);

  if (!loaded) return null;
  if (unlocked) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  const threshold = FEATURE_THRESHOLDS[feature];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-border/30 flex items-center justify-center mb-4 opacity-40">
        <span className="text-3xl grayscale">{threshold?.icon || '🔒'}</span>
      </div>
      <h3 className="text-foreground/60 font-bold text-lg mb-1">
        {threshold?.label || 'Feature'} Locked
      </h3>
      <p className="text-muted text-sm max-w-xs">
        Collect {cardsNeeded} more card{cardsNeeded !== 1 ? 's' : ''} to unlock {threshold?.label || 'this feature'}.
      </p>
      <div className="mt-4 w-48 h-1.5 rounded-full bg-border/30 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent/50"
          initial={{ width: 0 }}
          animate={{ width: `${threshold ? Math.max(0, 100 - (cardsNeeded / threshold.cards) * 100) : 0}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
