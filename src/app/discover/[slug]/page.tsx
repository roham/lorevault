'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FEED_CONTENT, FEED_TYPE_CONFIG } from '@/data/feed-content';

export default function DiscoverDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const entry = FEED_CONTENT.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-muted">Article not found</p>
        <Link href="/" className="text-accent text-sm mt-4 block">Back to Home</Link>
      </div>
    );
  }

  const typeConfig = FEED_TYPE_CONFIG[entry.type];
  const paragraphs = entry.body.split('\n\n');

  return (
    <div className="min-h-screen max-w-lg mx-auto">
      {/* Hero header */}
      <div
        className="relative h-[220px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${entry.gradientFrom}, ${entry.gradientTo})`,
        }}
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Back button */}
        <Link href="/" className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </Link>

        {/* Icon */}
        <div className="absolute top-4 right-4 text-3xl opacity-40">{entry.icon}</div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span
            className="text-[9px] uppercase tracking-[0.1em] font-bold px-2 py-0.5 rounded-full inline-block mb-2"
            style={{ backgroundColor: `${typeConfig.color}30`, color: typeConfig.color }}
          >
            {typeConfig.label}
          </span>
          <h1 className="type-heading text-white mb-1">{entry.title}</h1>
          <p className="text-xs text-white/60">{entry.subtitle}</p>
          <p className="text-[10px] text-white/30 mt-1">
            {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Body content */}
      <div className="px-4 py-6 space-y-4">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="text-sm text-foreground/80 leading-relaxed"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 pb-8">
        <Link href={entry.ctaLink}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white"
            style={{ backgroundColor: typeConfig.color }}
          >
            {entry.ctaLabel}
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
