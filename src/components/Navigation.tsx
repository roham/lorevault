'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPackCredits } from '@/lib/store';
import { shouldShowWelcome } from '@/lib/onboarding';

const TABS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/collection', label: 'Collection', icon: '📦' },
  { href: '/packs', label: 'Open', icon: '🎁', primary: true },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [packs, setPacks] = useState(0);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setPacks(getPackCredits());
    // Hide nav during onboarding welcome and during full-screen pack opening
    setHidden(shouldShowWelcome() || pathname === '/welcome');
  }, [pathname]);

  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-t border-border/40" />

      <div className="relative flex items-end justify-around px-4 h-[72px] max-w-lg mx-auto">
        {TABS.map((tab) => {
          const isActive = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);

          if (tab.primary) {
            return (
              <Link key={tab.href} href={tab.href} className="relative -mt-5 flex flex-col items-center">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className={`w-[56px] h-[56px] rounded-2xl flex items-center justify-center shadow-xl ${
                    isActive
                      ? 'bg-accent shadow-accent/40'
                      : 'bg-gradient-to-br from-accent via-purple-500 to-accent shadow-accent/25'
                  }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  {packs > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold px-1 shadow-sm"
                    >
                      {packs}
                    </motion.span>
                  )}
                </motion.div>
                <span className={`text-[10px] mt-1.5 font-semibold ${isActive ? 'text-accent' : 'text-muted'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center py-2.5 px-4 relative">
              {isActive && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute top-1 w-1 h-1 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <motion.span
                className="text-[22px]"
                animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -1 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {tab.icon}
              </motion.span>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-foreground' : 'text-muted'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
