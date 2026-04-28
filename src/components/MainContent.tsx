'use client';

import { usePathname } from 'next/navigation';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrototype = pathname.startsWith('/prototype');
  const isMoodboard = pathname.startsWith('/moodboard');
  const isV2 = pathname.startsWith("/v2");
  const isGDD = pathname.startsWith("/v3/gdd");
  const isMLP = pathname.startsWith("/v3/mlp");
  const isV3Moodboard = pathname.startsWith("/v3/moodboard");

  // Prototype + moodboard + v2 + mlp routes manage their own padding
  const skipChrome = isPrototype || isMoodboard || isV2 || isGDD || isMLP || isV3Moodboard;
  return (
    <main className={skipChrome ? '' : 'pt-12 pb-[112px]'}>
      {children}
    </main>
  );
}
