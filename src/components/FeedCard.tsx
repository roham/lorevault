'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type FeedEntry, FEED_TYPE_CONFIG } from '@/data/feed-content';

interface FeedCardProps {
  entry: FeedEntry;
  variant: 'hero' | 'compact';
}

export default function FeedCard({ entry, variant }: FeedCardProps) {
  const typeConfig = FEED_TYPE_CONFIG[entry.type];

  if (variant === 'hero') {
    return (
      <Link href={`/discover/${entry.slug}`}>
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="relative w-full h-[200px] rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${entry.gradientFrom}, ${entry.gradientTo})`,
          }}
        >
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }} />
          {/* Bottom gradient for text legibility */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.6) 100%)',
          }} />
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-[9px] uppercase tracking-[0.1em] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${typeConfig.color}30`, color: typeConfig.color }}
            >
              {typeConfig.label}
            </span>
          </div>
          {/* Icon */}
          <div className="absolute top-3 right-3 text-2xl opacity-60">{entry.icon}</div>
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white leading-tight mb-1">{entry.title}</h3>
            <p className="text-xs text-white/60">{entry.subtitle}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-white/40">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="text-[10px] font-semibold" style={{ color: typeConfig.color }}>{entry.ctaLabel} &rarr;</span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Compact variant
  return (
    <Link href={`/discover/${entry.slug}`}>
      <motion.div
        whileTap={{ scale: 0.96 }}
        className="relative h-[160px] rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${entry.gradientFrom}cc, ${entry.gradientTo}80)`,
        }}
      >
        {/* Bottom gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.5) 100%)',
        }} />
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className="text-[8px] uppercase tracking-[0.1em] font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${typeConfig.color}30`, color: typeConfig.color }}
          >
            {typeConfig.label}
          </span>
        </div>
        {/* Icon */}
        <div className="absolute top-2 right-2 text-lg opacity-40">{entry.icon}</div>
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h4 className="text-sm font-bold text-white leading-tight mb-0.5 line-clamp-2">{entry.title}</h4>
          <p className="text-[10px] text-white/50 line-clamp-1">{entry.subtitle}</p>
        </div>
      </motion.div>
    </Link>
  );
}
