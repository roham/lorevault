'use client';

import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrototype = pathname.startsWith('/prototype');

  // Prototype routes manage their own padding via the prototype layout
  return (
    <main className={isPrototype ? '' : 'pt-12 pb-[112px]'}>
      {children}
    </main>
  );
}
