import Link from 'next/link';

interface PaneCardProps {
  paneSlug: string;
  paneName: string;
  cardCount: number;
  doctrineNote: string;
}

export function PaneCard({ paneSlug, paneName, cardCount, doctrineNote }: PaneCardProps) {
  return (
    <Link
      href={`/v3/moodboard/${paneSlug}`}
      className="group block border border-zinc-800 rounded p-5 bg-zinc-900/40 hover:border-amber-500/40 hover:bg-zinc-900/70 transition-all no-underline"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 className="text-amber-400 text-lg font-medium leading-snug group-hover:text-amber-300 transition-colors">
          {paneName}
        </h2>
        <span className="flex-shrink-0 text-zinc-500 text-sm border border-zinc-700 rounded px-2 py-0.5">
          {cardCount} cards
        </span>
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed">
        {doctrineNote}
      </p>
      <span className="mt-4 block text-amber-500/70 text-xs uppercase tracking-widest group-hover:text-amber-400 transition-colors">
        View pane →
      </span>
    </Link>
  );
}
