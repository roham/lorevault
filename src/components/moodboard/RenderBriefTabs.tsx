'use client';

import { useState } from 'react';

interface RenderBriefs {
  silhouette: string;
  hero: string;
  gesture_detail: string;
}

interface RenderBriefTabsProps {
  briefs: RenderBriefs;
}

type Tab = 'silhouette' | 'hero' | 'gesture_detail';

const TABS: { key: Tab; label: string }[] = [
  { key: 'silhouette',     label: 'Silhouette' },
  { key: 'hero',           label: 'Hero' },
  { key: 'gesture_detail', label: 'Gesture Detail' },
];

export function RenderBriefTabs({ briefs }: RenderBriefTabsProps) {
  const [active, setActive] = useState<Tab>('silhouette');

  return (
    <div className="border border-zinc-800 rounded overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-zinc-800">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={[
              'flex-1 px-3 py-2.5 text-xs uppercase tracking-widest transition-colors',
              active === key
                ? 'bg-zinc-800 text-amber-400 border-b-2 border-amber-500'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
            ].join(' ')}
            aria-selected={active === key}
            role="tab"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 bg-zinc-900/40" role="tabpanel">
        <p className="text-zinc-300 text-sm leading-relaxed">
          {briefs[active]}
        </p>
      </div>
    </div>
  );
}
