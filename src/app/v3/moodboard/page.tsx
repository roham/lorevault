import Link from 'next/link';
import { PaneCard } from '@/components/moodboard/PaneCard';

export const metadata = {
  title: 'The Moodboard — LoreVault v3',
  description:
    'Five Panes. Fifty cards. The doctrine made visible.',
};

const PANES = [
  { slug: 'lud-border',              name: 'Lud-Border',              heroCardId: 'lud-border-001' },
  { slug: 'old-ones-persist',        name: 'Old-Ones-Persist',        heroCardId: 'old-ones-persist-001' },
  { slug: 'sinterklaas-reigns',      name: 'Sinterklaas-Reigns',      heroCardId: 'sinterklaas-reigns-001' },
  { slug: 'true-names-persist',      name: 'True-Names-Persist',      heroCardId: 'true-names-persist-001' },
  { slug: 'holmes-canonical-london', name: 'Holmes-Canonical-London', heroCardId: 'holmes-canonical-london-001' },
];

export default function MoodboardIndex() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-5 py-16">
        {/* Eyebrow + title — sparse */}
        <header className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-amber-400">
            LoreVault Moodboard
          </p>
          <h1 className="text-4xl font-medium italic leading-tight text-zinc-100 sm:text-5xl">
            Five Panes. Five doors.
          </h1>
        </header>

        {/* Pane gallery — image-first, no prose */}
        <section className="mb-16">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PANES.map(({ slug, name, heroCardId }) => (
              <PaneCard
                key={slug}
                paneSlug={slug}
                paneName={name}
                heroCardId={heroCardId}
              />
            ))}
          </div>
        </section>

        {/* Demonstrative pages — secondary surface */}
        <footer className="border-t border-zinc-800 pt-8">
          <p className="mb-4 text-xs uppercase tracking-widest text-zinc-500">
            Doctrine demonstrations
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
            <Link
              href="/v3/moodboard/pierre-menard"
              className="text-amber-400 no-underline transition-colors hover:text-amber-300"
            >
              Pierre-Menard triptych →
            </Link>
            <Link
              href="/v3/moodboard/voice-warping"
              className="text-amber-400 no-underline transition-colors hover:text-amber-300"
            >
              Voice-warping demo →
            </Link>
            <Link
              href="/v3/gdd-v2"
              className="text-zinc-400 no-underline transition-colors hover:text-zinc-200"
            >
              The doctrine →
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
