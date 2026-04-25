'use client';

import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrototype = pathname.startsWith('/prototype');
  const isMoodboard = pathname.startsWith('/moodboard');
  const isV2 = pathname.startsWith('/v2');

  // Prototype + moodboard + v2 routes manage their own padding
  return (
    <main className={isPrototype || isMoodboard || isV2 ? '' : 'pt-12 pb-[112px]'}>
      {children}
    </main>
  );
}
