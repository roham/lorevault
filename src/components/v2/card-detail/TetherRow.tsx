import Link from 'next/link';

interface Tether {
  cardId: string;
  figureName: string;
  thumbUrl: string;
  tetherKind: 'twin-soul' | 'echo-object' | 'biome' | 'event';
}

interface TetherRowProps {
  tethers: Tether[];
}

export function TetherRow({ tethers }: TetherRowProps) {
  if (tethers.length === 0) return null;
  return (
    <div className="px-4 py-3 border-t border-[var(--color-v2-rule)]">
      <p className="text-[12px] uppercase tracking-[0.15em] text-[var(--color-v2-text-dim)] mb-2 [font-family:var(--font-v2-ui)]">
        Connects to…
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tethers.map((t) => (
          <Link
            key={t.cardId}
            href={`/v2/card/${t.cardId}`}
            className="flex flex-col items-start min-w-[64px] shrink-0"
          >
            <div className="w-12 h-12 bg-[var(--color-v2-ink)] rounded-sm" />
            <p className="mt-1 text-[10px] truncate w-12 text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-mono)]">
              {t.figureName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
