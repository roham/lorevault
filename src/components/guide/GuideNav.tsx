'use client';

import { useRef, useEffect } from 'react';
import { GUIDE_SECTIONS } from '@/data/guide-content';

interface GuideNavProps {
  activeSection: string;
  onSelect: (id: string) => void;
}

export default function GuideNav({ activeSection, onSelect }: GuideNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeSection]);

  return (
    <div className="sticky top-12 z-40 bg-background/90 backdrop-blur-xl border-b border-border/30">
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar max-w-lg mx-auto"
      >
        {GUIDE_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(section.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-muted bg-surface/60 hover:bg-surface'
              }`}
              style={isActive ? { backgroundColor: section.accent } : undefined}
            >
              <span className="text-sm">{section.icon}</span>
              <span>{section.title.split(' ').slice(0, 2).join(' ')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
