'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MarketFilters, DEFAULT_FILTERS } from '@/lib/marketData';
import { SCARCITY_CONFIG, PARALLEL_CONFIG, Scarcity, Parallel } from '@/data/types';
import { SETS } from '@/data/sets';

interface FilterChipsProps {
  filters: MarketFilters;
  onChange: (filters: MarketFilters) => void;
}

export default function FilterChips({ filters, onChange }: FilterChipsProps) {
  const activeChips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  // Set chips
  for (const slug of filters.sets) {
    const set = SETS.find(s => s.slug === slug);
    if (set) {
      activeChips.push({
        key: `set:${slug}`,
        label: `${set.icon} ${set.name}`,
        onRemove: () => onChange({ ...filters, sets: filters.sets.filter(s => s !== slug) }),
      });
    }
  }

  // Scarcity chips
  for (const scarcity of filters.scarcities) {
    activeChips.push({
      key: `scarcity:${scarcity}`,
      label: SCARCITY_CONFIG[scarcity].label,
      onRemove: () => onChange({ ...filters, scarcities: filters.scarcities.filter(s => s !== scarcity) }),
    });
  }

  // Parallel chips
  for (const parallel of filters.parallels) {
    activeChips.push({
      key: `parallel:${parallel}`,
      label: PARALLEL_CONFIG[parallel].label,
      onRemove: () => onChange({ ...filters, parallels: filters.parallels.filter(p => p !== parallel) }),
    });
  }

  // Price range
  if (filters.priceMin !== null || filters.priceMax !== null) {
    const label = filters.priceMin !== null && filters.priceMax !== null
      ? `$${filters.priceMin} – $${filters.priceMax}`
      : filters.priceMin !== null
        ? `$${filters.priceMin}+`
        : `Up to $${filters.priceMax}`;
    activeChips.push({
      key: 'price',
      label,
      onRemove: () => onChange({ ...filters, priceMin: null, priceMax: null }),
    });
  }

  // Serial range
  if (filters.serialMin !== null || filters.serialMax !== null) {
    const label = filters.serialMin !== null && filters.serialMax !== null
      ? `#${filters.serialMin} – #${filters.serialMax}`
      : filters.serialMin !== null
        ? `#${filters.serialMin}+`
        : `Up to #${filters.serialMax}`;
    activeChips.push({
      key: 'serial',
      label,
      onRemove: () => onChange({ ...filters, serialMin: null, serialMax: null }),
    });
  }

  // Status
  if (filters.status !== 'all') {
    activeChips.push({
      key: 'status',
      label: filters.status === 'listed' ? 'Listed' : 'Sold',
      onRemove: () => onChange({ ...filters, status: 'all' }),
    });
  }

  if (activeChips.length === 0) return null;

  const clearAll = () => onChange({
    ...DEFAULT_FILTERS,
    query: filters.query,
    sortBy: filters.sortBy,
  });

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <AnimatePresence mode="popLayout">
        {activeChips.map(chip => (
          <motion.button
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={chip.onRemove}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium hover:bg-accent/20 transition-colors group"
          >
            <span>{chip.label}</span>
            <span className="text-accent/50 group-hover:text-accent ml-0.5">x</span>
          </motion.button>
        ))}
      </AnimatePresence>
      {activeChips.length > 1 && (
        <button
          onClick={clearAll}
          className="text-[10px] text-muted hover:text-foreground transition-colors ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
