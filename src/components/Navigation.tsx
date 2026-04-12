'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/collection', label: 'My Collection', icon: '📦' },
  { href: '/marketplace', label: 'Marketplace', icon: '🏪' },
  { href: '/challenges', label: 'Challenges', icon: '🏆' },
  { href: '/packs', label: 'Open Packs', icon: '🎁' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center px-6 bg-surface/80 backdrop-blur-xl border-b border-border">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <span className="text-xl">📜</span>
          <span className="text-lg font-bold text-foreground tracking-tight">LoreVault</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-sm text-muted">
            <span className="text-accent font-bold">2,847</span> Collector Score
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around bg-surface/90 backdrop-blur-xl border-t border-border safe-area-bottom">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                isActive ? 'text-accent' : 'text-muted'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16" />
    </>
  );
}
