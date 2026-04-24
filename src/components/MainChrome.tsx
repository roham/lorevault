'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';
import UnlockCelebration from '@/components/UnlockCelebration';
import LivePulse from '@/components/LivePulse';
import PrestigeCelebration from '@/components/PrestigeCelebration';
import PWAInstall from '@/components/PWAInstall';

export default function MainChrome() {
  const pathname = usePathname();

  // Prototype + moodboard routes use their own minimal shell — no main chrome
  if (pathname.startsWith('/prototype')) return null;
  if (pathname.startsWith('/moodboard')) return null;

  return (
    <>
      <UnlockCelebration />
      <PrestigeCelebration />
      <LivePulse />
      <PWAInstall />
      <Navigation />
    </>
  );
}
