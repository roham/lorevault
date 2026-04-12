'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPackCredits, getOwnedCardIds } from '@/lib/store';

const TABS = [
  { href: '/', label: 'Home', icon: '🏠', activeIcon: '🏠' },
  { href: '/collection', label: 'Collection', icon: '📦', activeIcon: '📦' },
  { href: '/packs', label: 'Open', icon: '🎁', activeIcon: '🎁', primary: true },
  { href: '/challenges', label: 'Quests', icon: '🏆', activeIcon: '🏆' },
  { href: '/profile', label: 'Profile', icon: '👤', activeIcon: '👤' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [packs, setPacks] = useState(0);

  useEffect(() => {
    setPacks(getPackCredits());
  }, [pathname]);

  // Hide nav during onboarding
  if (pathname === '/welcome') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl border-t border-border/50" />

      <div className="relative flex items-end justify-around px-2 h-16">
        {TABS.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);

          if (tab.primary) {
            // Center "Open Pack" button — elevated, larger
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative -mt-4 flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    isActive
                      ? 'bg-accent shadow-accent/30'
                      : 'bg-gradient-to-br from-accent to-purple-600 shadow-accent/20'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  {packs > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                      {packs}
                    </span>
                  )}
                </motion.div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-accent' : 'text-muted'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center py-2 px-3 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                {isActive ? tab.activeIcon : tab.icon}
              </span>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-accent' : 'text-muted'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
