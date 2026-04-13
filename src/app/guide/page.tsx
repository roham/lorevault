'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { GUIDE_SECTIONS } from '@/data/guide-content';
import GuideNav from '@/components/guide/GuideNav';
import GuideSection from '@/components/guide/GuideSection';
import CollectingSection from '@/components/guide/sections/CollectingSection';
import VIPSection from '@/components/guide/sections/VIPSection';
import RewardsSection from '@/components/guide/sections/RewardsSection';
import MarketplaceSection from '@/components/guide/sections/MarketplaceSection';
import BattleSection from '@/components/guide/sections/BattleSection';
import SetsSection from '@/components/guide/sections/SetsSection';
import ParallelsSection from '@/components/guide/sections/ParallelsSection';

const SECTION_COMPONENTS: Record<string, React.ComponentType> = {
  collecting: CollectingSection,
  vip: VIPSection,
  rewards: RewardsSection,
  marketplace: MarketplaceSection,
  battle: BattleSection,
  sets: SetsSection,
  parallels: ParallelsSection,
};

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState(GUIDE_SECTIONS[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top
          const topEntry = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveSection(topEntry.target.id);
        }
      },
      {
        rootMargin: '-120px 0px -60% 0px',
        threshold: 0,
      }
    );

    GUIDE_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const handleNavSelect = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="px-4 pt-2 pb-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <Link href="/profile" className="text-muted hover:text-foreground transition-colors text-sm">&larr;</Link>
          <h1 className="text-lg font-bold text-foreground">Collector&apos;s Guide</h1>
        </div>
        <p className="text-xs text-muted">Everything you need to know about collecting, trading, and competing.</p>
      </div>

      {/* Sticky section nav */}
      <GuideNav activeSection={activeSection} onSelect={handleNavSelect} />

      {/* Sections */}
      <div className="px-4 pt-6 max-w-lg mx-auto">
        {GUIDE_SECTIONS.map((section) => {
          const Component = SECTION_COMPONENTS[section.id];
          return (
            <GuideSection key={section.id} section={section}>
              <Component />
            </GuideSection>
          );
        })}
      </div>
    </div>
  );
}
