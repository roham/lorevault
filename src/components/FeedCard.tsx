'use client';

import Link from 'next/link';
import { type FeedEntry, FEED_TYPE_CONFIG } from '@/data/feed-content';

interface FeedCardProps {
  entry: FeedEntry;
  variant: 'hero' | 'compact';
}

export default function FeedCard({ entry, variant }: FeedCardProps) {
  const typeConfig = FEED_TYPE_CONFIG[entry.type];

  if (variant === 'hero') {
    return (
      <Link href={`/discover/${entry.slug}`} className="block">
        <div className="relative w-full h-[220px] rounded-2xl overflow-hidden group">
          {/* Card art background */}
          {entry.artPath && (
            <img
              src={entry.artPath}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {/* Gradient fallback + overlay for legibility */}
          <div
            className="absolute inset-0"
            style={{
              background: entry.artPath
                ? 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)'
                : `linear-gradient(135deg, ${entry.gradientFrom}, ${entry.gradientTo})`,
            }}
          />
          {/* Type badge */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className="text-[9px] uppercase tracking-[0.1em] font-bold px-2.5 py-1 rounded-full backdrop-blur-md"
              style={{ backgroundColor: `${typeConfig.color}40`, color: typeConfig.color, border: `1px solid ${typeConfig.color}30` }}
            >
              {typeConfig.label}
            </span>
          </div>
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="type-heading text-white leading-tight mb-1 drop-shadow-lg">{entry.title}</h3>
            <p className="text-xs text-white/70 drop-shadow-md">{entry.subtitle}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-white/40">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm"
                style={{ backgroundColor: `${typeConfig.color}30`, color: typeConfig.color }}
              >
                {entry.ctaLabel} &rarr;
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant
  return (
    <Link href={`/discover/${entry.slug}`} className="block">
      <div className="relative h-[180px] rounded-xl overflow-hidden group">
        {/* Card art background */}
        {entry.artPath && (
          <img
            src={entry.artPath}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: entry.artPath
              ? 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)'
              : `linear-gradient(150deg, ${entry.gradientFrom}cc, ${entry.gradientTo}80)`,
          }}
        />
        {/* Type badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className="text-[8px] uppercase tracking-[0.1em] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${typeConfig.color}40`, color: typeConfig.color }}
          >
            {typeConfig.label}
          </span>
        </div>
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h4 className="text-sm font-bold text-white leading-tight mb-0.5 line-clamp-2 drop-shadow-lg">{entry.title}</h4>
          <p className="text-[10px] text-white/60 line-clamp-1 drop-shadow-md">{entry.subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
