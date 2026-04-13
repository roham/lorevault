'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MarketplaceFAB() {
  const pathname = usePathname();

  // Don't show on marketplace itself, welcome, or packs
  if (pathname === '/marketplace' || pathname === '/welcome' || pathname === '/packs') return null;

  return (
    <Link href="/marketplace">
      <motion.div
        className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-2xl bg-gradient-to-br from-accent via-purple-500 to-indigo-600 shadow-xl shadow-accent/25 flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 300, damping: 20 }}
      >
        <span className="text-lg">🏪</span>
      </motion.div>
    </Link>
  );
}
