'use client';

type ContrabandRelation = 'carries' | 'refuses' | 'mediates' | 'exposes';

interface ContrabandBadgeProps {
  relation: ContrabandRelation;
  note?: string;
  compact?: boolean;
}

const CONFIG: Record<ContrabandRelation, { label: string; bg: string; border: string; dot: string }> = {
  carries:  { label: 'Carries',  bg: 'bg-red-700/20',  border: 'border-red-700',  dot: 'bg-red-700'  },
  refuses:  { label: 'Refuses',  bg: 'bg-zinc-600/20', border: 'border-zinc-500', dot: 'bg-zinc-500' },
  mediates: { label: 'Mediates', bg: 'bg-amber-700/20', border: 'border-amber-600', dot: 'bg-amber-600' },
  exposes:  { label: 'Exposes',  bg: 'bg-blue-700/20', border: 'border-blue-700',  dot: 'bg-blue-700'  },
};

export function ContrabandBadge({ relation, note, compact = false }: ContrabandBadgeProps) {
  const cfg = CONFIG[relation];
  return (
    <div className={compact ? 'inline-flex items-center gap-1.5' : 'flex flex-col gap-2'}>
      <span
        className={[
          'inline-flex items-center gap-1.5 px-2 py-1 rounded text-zinc-100 border',
          cfg.bg,
          cfg.border,
          compact ? 'text-xs' : 'text-sm',
        ].join(' ')}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} aria-hidden />
        <span className="uppercase tracking-widest text-[0.6rem] font-medium">
          {cfg.label}
        </span>
      </span>
      {!compact && note && (
        <p className="text-zinc-400 text-sm leading-relaxed">{note}</p>
      )}
    </div>
  );
}
