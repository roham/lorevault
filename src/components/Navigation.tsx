'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getPackCredits, getCollectorLevel } from '@/lib/store';
import { shouldShowWelcome } from '@/lib/onboarding';

// SVG icon components — no emoji in nav
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      {!active && <polyline points="9 22 9 12 15 12 15 22" />}
    </svg>
  );
}

function CollectionIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function PackIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      {!active && <>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>}
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

const TABS = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/collection', label: 'Collection', Icon: CollectionIcon },
  { href: '/packs', label: 'Open', Icon: PackIcon, primary: true },
  { href: '/profile', label: 'Profile', Icon: ProfileIcon },
];

export default function Navigation() {
  const pathname = usePathname();
  const [packs, setPacks] = useState(0);
  const [hidden, setHidden] = useState(true);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    setPacks(getPackCredits());
    const cl = getCollectorLevel();
    setLevel(cl.level);
    setHidden(shouldShowWelcome() || pathname === '/welcome');
  }, [pathname]);

  useEffect(() => {
    const handleStorage = () => {
      setPacks(getPackCredits());
      setLevel(getCollectorLevel().level);
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  if (hidden) return null;

  const showPlayPill = pathname === '/' || pathname.startsWith('/collection');

  return (
    <>
      {/* Top bar — marketplace search icon */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
        <div className="relative flex items-center justify-between px-4 h-12 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-foreground">LoreVault</span>
            <span className="text-[10px] font-mono text-accent px-1.5 py-0.5 rounded bg-accent/10">Lv.{level}</span>
          </div>
          <Link href="/marketplace" className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-surface transition-all">
            <SearchIcon />
          </Link>
        </div>
      </div>

      {/* Play floating pill */}
      <AnimatePresence>
        {showPlayPill && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-40"
          >
            <Link href="/games">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white text-sm font-semibold shadow-xl shadow-red-500/20 backdrop-blur-sm"
              >
                <PlayIcon />
                <span>Play</span>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl border-t border-border/30" />

        <div className="relative flex items-end justify-around px-6 h-[68px] max-w-lg mx-auto">
          {TABS.map((tab) => {
            const isActive = tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);

            if (tab.primary) {
              return (
                <Link key={tab.href} href={tab.href} className="relative -mt-5 flex flex-col items-center">
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className={`w-[54px] h-[54px] rounded-2xl flex items-center justify-center shadow-xl ${
                      isActive
                        ? 'bg-accent shadow-accent/40'
                        : 'bg-gradient-to-br from-accent via-purple-500 to-accent shadow-accent/25'
                    }`}
                  >
                    <span className="text-white">
                      <tab.Icon active={isActive} />
                    </span>
                    {packs > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold px-1 shadow-sm"
                      >
                        {packs}
                      </motion.span>
                    )}
                  </motion.div>
                  <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-accent' : 'text-muted'}`}>
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center py-2.5 px-4 relative">
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute top-1 w-1 h-1 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <motion.span
                  className={`${isActive ? 'text-foreground' : 'text-muted'}`}
                  animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <tab.Icon active={isActive} />
                </motion.span>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-foreground' : 'text-muted'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
