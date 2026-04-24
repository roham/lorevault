'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Only count once per session, show after 2nd session
    const alreadyCounted = sessionStorage.getItem('lorevault_visited');
    let visits = parseInt(localStorage.getItem('lorevault_visit_count') || '0', 10);
    if (!alreadyCounted) {
      visits += 1;
      localStorage.setItem('lorevault_visit_count', String(visits));
      sessionStorage.setItem('lorevault_visited', '1');
    }
    const dismissed = localStorage.getItem('lorevault_pwa_dismissed');

    if (visits < 2 || dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('lorevault_pwa_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[60] p-4 rounded-2xl bg-surface border border-accent/20 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">📱</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-foreground">Add to Home Screen</div>
              <div className="text-[10px] text-muted">Quick access to your vault</div>
            </div>
            <button
              onClick={handleInstall}
              className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-2 py-2 text-muted text-xs"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
