'use client';

import { motion } from 'framer-motion';

export type CollectionTab = 'binder' | 'showcase' | 'sets' | 'smart' | 'analytics';

const PILLS: { id: CollectionTab; label: string }[] = [
  { id: 'binder', label: 'Binder' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'sets', label: 'Sets' },
  { id: 'smart', label: 'Smart' },
  { id: 'analytics', label: 'Analytics' },
];

export default function CollectionPills({
  active,
  onChange,
}: {
  active: CollectionTab;
  onChange: (tab: CollectionTab) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
      {PILLS.map((pill) => (
        <button
          key={pill.id}
          onClick={() => onChange(pill.id)}
          className={`relative px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            active === pill.id
              ? 'text-white'
              : 'text-muted hover:text-foreground'
          }`}
        >
          {active === pill.id && (
            <motion.div
              layoutId="collection-pill"
              className="absolute inset-0 rounded-full bg-accent"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{pill.label}</span>
        </button>
      ))}
    </div>
  );
}
