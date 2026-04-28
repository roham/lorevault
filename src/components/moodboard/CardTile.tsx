'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ContrabandBadge } from './ContrabandBadge';

type ContrabandRelation = 'carries' | 'refuses' | 'mediates' | 'exposes';

interface CardTileProps {
  paneSlug: string;
  cardSlug: string;
  name: string;
  axiom: string;
  flavorLine: string;
  contrabandRelation: ContrabandRelation;
  isPierreMenard: boolean;
}

export function CardTile({
  paneSlug,
  cardSlug,
  name,
  axiom,
  flavorLine,
  contrabandRelation,
  isPierreMenard,
}: CardTileProps) {
  const [imgOk, setImgOk] = useState(true);
  const truncatedAxiom =
    axiom.length > 120 ? axiom.slice(0, 120).trimEnd() + '…' : axiom;

  return (
    <Link
      href={`/v3/moodboard/${paneSlug}/${cardSlug}`}
      className="group block border border-zinc-800 rounded overflow-hidden bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all no-underline"
    >
      {imgOk && (
        <div className="bg-black" style={{ aspectRatio: '1 / 1' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/v3/cards/${paneSlug}/${cardSlug}/silhouette.png`}
            alt={`Silhouette of ${name}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-zinc-100 text-base font-medium leading-snug group-hover:text-amber-400 transition-colors">
            {name}
          </h3>
          {isPierreMenard && (
            <span className="flex-shrink-0 text-[0.55rem] uppercase tracking-widest px-1.5 py-0.5 border border-amber-500/40 rounded text-amber-400 bg-amber-500/10">
              PM
            </span>
          )}
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed mb-3">
          {truncatedAxiom}
        </p>

        <p className="text-zinc-500 text-xs italic leading-relaxed mb-3">
          {flavorLine}
        </p>

        <ContrabandBadge relation={contrabandRelation} compact />
      </div>
    </Link>
  );
}
