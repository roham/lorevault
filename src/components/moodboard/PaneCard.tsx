'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PaneCardProps {
  paneSlug: string;
  paneName: string;
  /** Card id whose hero render is the Pane's hero image. */
  heroCardId: string;
}

export function PaneCard({ paneSlug, paneName, heroCardId }: PaneCardProps) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link
      href={`/v3/moodboard/${paneSlug}`}
      className="group relative block overflow-hidden rounded bg-black no-underline"
      style={{ aspectRatio: '4 / 5' }}
    >
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/v3/cards/${paneSlug}/${heroCardId}/hero.png`}
          alt={paneName}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-700 text-xs uppercase tracking-widest">
          rendering
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5">
        <p className="mb-1 text-xs uppercase tracking-widest text-amber-400">Pane</p>
        <h2 className="text-2xl font-medium italic leading-tight text-zinc-100">
          {paneName}
        </h2>
        <p className="mt-2 text-xs uppercase tracking-widest text-zinc-400 transition-colors group-hover:text-amber-300">
          Enter →
        </p>
      </div>
    </Link>
  );
}
