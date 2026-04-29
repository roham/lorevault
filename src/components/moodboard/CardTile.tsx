'use client';

import Link from 'next/link';
import { useState } from 'react';

type ContrabandRelation = 'carries' | 'refuses' | 'mediates' | 'exposes';

interface CardTileProps {
  paneSlug: string;
  cardSlug: string;
  name: string;
  contrabandRelation: ContrabandRelation;
  isPierreMenard: boolean;
}

const CONTRABAND_GLYPH: Record<ContrabandRelation, string> = {
  carries:  '◆',
  refuses:  '◇',
  mediates: '◈',
  exposes:  '◉',
};

export function CardTile({
  paneSlug,
  cardSlug,
  name,
  contrabandRelation,
  isPierreMenard,
}: CardTileProps) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link
      href={`/v3/moodboard/${paneSlug}/${cardSlug}`}
      className="group relative block overflow-hidden rounded bg-black no-underline"
      style={{ aspectRatio: '1 / 1' }}
    >
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/v3/cards/${paneSlug}/${cardSlug}/silhouette.png`}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-70"
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-700 text-xs uppercase tracking-widest">
          rendering
        </div>
      )}

      {/* Top-right badges */}
      <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
        {isPierreMenard && (
          <span className="rounded border border-amber-400/60 bg-black/70 px-1.5 py-0.5 text-[0.5rem] uppercase tracking-widest text-amber-300 backdrop-blur-sm">
            PM
          </span>
        )}
        <span
          title={`Contraband: ${contrabandRelation}`}
          className="rounded border border-zinc-700 bg-black/70 px-1.5 py-0.5 text-[0.7rem] text-zinc-300 backdrop-blur-sm"
        >
          {CONTRABAND_GLYPH[contrabandRelation]}
        </span>
      </div>

      {/* Bottom name overlay — only on hover/focus */}
      <div className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black via-black/85 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
        <p className="text-sm leading-snug text-zinc-100">{name}</p>
      </div>
    </Link>
  );
}
