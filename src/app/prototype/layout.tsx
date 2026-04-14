'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRoot = pathname === '/prototype';

  return (
    <>
      {/* Minimal top bar — recessive, three elements max */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-4"
        style={{
          height: '52px',
          paddingTop: 'env(safe-area-inset-top)',
          background: 'rgba(10, 11, 20, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {!isRoot ? (
          <Link
            href="/prototype"
            className="flex items-center justify-center transition-opacity active:opacity-100"
            style={{ width: '44px', height: '44px', opacity: 0.55 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        ) : (
          <span className="text-xs font-bold tracking-widest" style={{ opacity: 0.4 }}>
            LOREVAULT
          </span>
        )}
      </nav>

      {/* Content — full viewport, no bottom padding (no tab bar) */}
      <motion.main
        className="min-h-screen"
        style={{ paddingTop: 'calc(52px + env(safe-area-inset-top))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </>
  );
}
