import type { V2Card } from '@/lib/v2/cards';

interface MetadataChipsProps {
  card: V2Card;
}

const PARALLEL_LABEL: Record<string, string> = {
  base: 'Base',
  arcana: 'ARCANA',
  aether: 'AETHER',
  witness: 'WITNESS',
  neon: 'NEON',
  'one-off': '1/1 ONE-OFF',
};

const TIER_LABEL: Record<string, string> = {
  common: 'Common',
  rare: 'Rare',
  legendary: 'Legendary',
  ultimate: 'Ultimate',
};

export function MetadataChips({ card }: MetadataChipsProps) {
  const chips = [
    { label: card.serial, mono: true, key: 'serial' },
    { label: TIER_LABEL[card.tier], mono: false, key: 'tier' },
    { label: card.shell, mono: false, key: 'shell' },
    { label: PARALLEL_LABEL[card.parallel], mono: false, key: 'parallel' },
    { label: card.setLabel, mono: false, key: 'set' },
  ];
  return (
    <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-[var(--color-v2-rule)]">
      {chips.map((c) => (
        <span
          key={c.key}
          className={`inline-flex items-center h-8 rounded-2xl px-3 text-[12px] border border-[var(--color-v2-rule)] text-[var(--color-v2-text)] bg-[var(--color-v2-ink)] ${c.mono ? '[font-family:var(--font-v2-mono)]' : '[font-family:var(--font-v2-ui)]'}`}
        >
          {c.label}
        </span>
      ))}
    </div>
  );
}
