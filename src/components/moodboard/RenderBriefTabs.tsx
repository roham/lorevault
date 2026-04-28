'use client';

import { useState } from 'react';

interface RenderBriefs {
  silhouette: string;
  hero: string;
  gesture_detail: string;
}

interface RenderBriefTabsProps {
  briefs: RenderBriefs;
  pane?: string;
  cardId?: string;
}

type Tab = 'silhouette' | 'hero' | 'gesture_detail';

const TABS: { key: Tab; label: string }[] = [
  { key: 'silhouette',     label: 'Silhouette' },
  { key: 'hero',           label: 'Hero' },
  { key: 'gesture_detail', label: 'Gesture Detail' },
];

const FILE_BY_TAB: Record<Tab, string> = {
  silhouette: 'silhouette.png',
  hero: 'hero.png',
  gesture_detail: 'gesture.png',
};

export function RenderBriefTabs({ briefs, pane, cardId }: RenderBriefTabsProps) {
  const [active, setActive] = useState<Tab>('silhouette');
  const [imgOk, setImgOk] = useState<Record<Tab, boolean>>({
    silhouette: true,
    hero: true,
    gesture_detail: true,
  });

  const imgPath =
    pane && cardId
      ? `/v3/cards/${pane}/${cardId}/${FILE_BY_TAB[active]}`
      : null;

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

      {/* Image */}
      {imgPath && imgOk[active] && (
        <div
          className="bg-black flex items-center justify-center"
          style={{ aspectRatio: active === 'hero' ? '16 / 9' : '1 / 1' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgPath}
            alt={`${active} render of ${cardId}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgOk((s) => ({ ...s, [active]: false }))}
          />
        </div>
      )}

      {/* Tab content */}
      <div className="p-4 bg-zinc-900/40" role="tabpanel">
        <p className="text-zinc-300 text-sm leading-relaxed">
          {briefs[active]}
        </p>
        {imgPath && !imgOk[active] && (
          <p className="text-zinc-500 text-xs mt-3 italic">
            Render queued — pipeline still rendering this variant.
          </p>
        )}
      </div>
    </div>
  );
}
