'use client';

import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrototype = pathname.startsWith('/prototype');
  const isMoodboard = pathname.startsWith('/moodboard');

  // Prototype + moodboard routes manage their own padding
  return (
    <main className={isPrototype || isMoodboard ? '' : 'pt-12 pb-[112px]'}>
      {children}
    </main>
  );
}
