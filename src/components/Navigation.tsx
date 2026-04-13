'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPackCredits, getCollectorLevel } from '@/lib/store';
import { shouldShowWelcome } from '@/lib/onboarding';

// SVG icon components — 24px standard, filled active / stroke inactive
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      {!active && <polyline points="9 22 9 12 15 12 15 22" />}
    </svg>
  );
}

function MarketIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CollectionIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function PackIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      {!active && <>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>}
    </svg>
  );
}

function GamesIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="11" x2="10" y2="11" />
      <line x1="8" y1="9" x2="8" y2="13" />
      <line x1="15" y1="12" x2="15.01" y2="12" />
      <line x1="18" y1="10" x2="18.01" y2="10" />
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

const TABS = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/marketplace', label: 'Market', Icon: MarketIcon },
  { href: '/packs', label: 'Open', Icon: PackIcon, primary: true },
  { href: '/collection', label: 'Collection', Icon: CollectionIcon },
  { href: '/games', label: 'Games', Icon: GamesIcon },
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

  return (
    <>
      {/* Top bar — brand + search bar + profile avatar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
        <div className="relative flex items-center justify-between px-4 h-12 max-w-lg mx-auto">
          <span className="text-sm font-bold tracking-tight text-foreground">LoreVault</span>
          <div className="flex items-center gap-2">
            <Link
              href="/marketplace"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-surface/80 border border-border/40 text-muted hover:text-foreground transition-all"
            >
              <SearchIcon />
              <span className="text-xs text-muted/70">Search cards...</span>
            </Link>
            <Link
              href="/guide"
              className="w-8 h-8 rounded-lg bg-surface/80 border border-border/40 flex items-center justify-center text-muted hover:text-foreground transition-all shrink-0"
            >
              <GuideIcon />
            </Link>
            <Link
              href="/profile"
              className="relative w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-[11px] font-bold shrink-0"
            >
              {level}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom tab bar — 5 tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl border-t border-border/30" />

        <div className="relative flex items-end justify-around px-2 h-[72px] max-w-lg mx-auto">
          {TABS.map((tab) => {
            const isActive = tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);

            if (tab.primary) {
              return (
                <Link key={tab.href} href={tab.href} className="relative -mt-4 flex flex-col items-center">
                  <motion.div
                    whileTap={{ scale: 0.88 }}
                    className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-xl ${
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
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-white text-background text-[10px] flex items-center justify-center font-bold px-1 shadow-sm"
                      >
                        {packs}
                      </motion.span>
                    )}
                  </motion.div>
                  <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'text-accent' : 'text-muted'}`}>
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={tab.href} href={tab.href} className="flex flex-col items-center py-2.5 relative min-w-[56px]">
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <motion.span
                  className={isActive ? 'text-foreground' : 'text-muted'}
                  animate={{ y: isActive ? -1 : 0 }}
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
