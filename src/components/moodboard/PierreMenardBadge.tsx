import Link from 'next/link';

interface PierreMenardBadgeProps {
  setId: string;
  variantLabel: string;
}

export function PierreMenardBadge({ variantLabel }: PierreMenardBadgeProps) {
  return (
    <Link
      href="/v3/moodboard/pierre-menard"
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-amber-500/60 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors no-underline"
      title={`Pierre-Menard set — ${variantLabel} variant`}
    >
      <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" aria-hidden />
      <span className="uppercase tracking-widest text-[0.6rem] font-medium">Pierre-Menard · {variantLabel}</span>
    </Link>
  );
}
