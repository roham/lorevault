'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { getXP, getPackCredits, getOwnedCardIds } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/collection', label: 'Collection', icon: '📦' },
  { href: '/marketplace', label: 'Market', icon: '🏪' },
  { href: '/challenges', label: 'Challenges', icon: '🏆' },
  { href: '/packs', label: 'Packs', icon: '🎁' },
  { href: '/trade', label: 'Trade', icon: '🔄' },
  { href: '/sets', label: 'Sets', icon: '📚' },
  { href: '/leaderboard', label: 'Ranks', icon: '📊' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [xp, setXp] = useState(0);
  const [packs, setPacks] = useState(0);
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    setXp(getXP());
    setPacks(getPackCredits());
    setCardCount(getOwnedCardIds().length);
  }, [pathname]); // Refresh on route change

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center px-4 bg-surface/80 backdrop-blur-xl border-b border-border">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <span className="text-lg">📜</span>
          <span className="text-base font-bold text-foreground tracking-tight">LoreVault</span>
        </Link>
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <span className="text-xs">{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted">
            <span>📦</span>
            <span className="font-mono font-bold text-foreground">{cardCount}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <span>🎁</span>
            <span className="font-mono font-bold text-accent">{packs}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <span>⭐</span>
            <span className="font-mono font-bold text-foreground">{xp.toLocaleString()}</span>
            <span className="text-muted/50">XP</span>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around bg-surface/90 backdrop-blur-xl border-t border-border safe-area-bottom">
        {[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[4], NAV_ITEMS[2], NAV_ITEMS[8]].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative ${
                isActive ? 'text-accent' : 'text-muted'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.href === '/packs' && packs > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">
                  {packs}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14" />
    </>
  );
}
