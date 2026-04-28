import Link from 'next/link';
import { PaneCard } from '@/components/moodboard/PaneCard';

export const metadata = {
  title: 'The Moodboard — LoreVault v3',
  description:
    'Five panes. Fifty cards. The doctrine made visible.',
};

const PANES = [
  {
    slug: 'lud-border',
    name: 'Lud-Border',
    doctrineNote:
      'The civic-Mirrlees pane. Honey-amber light. Bureaucracy as the last defense against the cosmological. The form that cannot ask about the actual contents.',
  },
  {
    slug: 'old-ones-persist',
    name: 'Old-Ones-Persist',
    doctrineNote:
      'The Borges-warped institutional archive. To name is to be named. The catalogue that catalogues its own cataloguing. Infinite stair, cold fluorescent light.',
  },
  {
    slug: 'sinterklaas-reigns',
    name: 'Sinterklaas-Reigns',
    doctrineNote:
      'The Northern-pagan witnessing apparatus. The Good Book, the annual accounting, the unjust gift. December light and load-bearing chimneys.',
  },
  {
    slug: 'true-names-persist',
    name: 'True-Names-Persist',
    doctrineNote:
      'The naming-network pane. True names as cosmological tethers. The last speaker, the stolen name, the translation that held.',
  },
  {
    slug: 'holmes-canonical-london',
    name: 'Holmes-Canonical-London',
    doctrineNote:
      'The deduction-and-consequence pane. Holmes deduces; Watson decides what the world can bear. The unspeakable correct inference and the archive that holds it.',
  },
];

export default function MoodboardIndex() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-5 py-16">

        {/* Hero */}
        <header className="mb-16">
          <p className="text-amber-400 uppercase tracking-widest text-xs mb-4">
            LoreVault · Track B
          </p>
          <h1 className="text-5xl font-medium italic text-zinc-100 mb-6 leading-tight">
            The Moodboard
          </h1>
          <p className="text-zinc-300 text-xl leading-relaxed max-w-2xl mb-6">
            Five Panes. Ten cards each. Every card carries a full lampblack residue,
            an iceberg structure, and a contraband relation. This is the doctrine made visible.
          </p>
          <p className="text-zinc-400 leading-relaxed max-w-2xl">
            The fifty cards here are not illustrations of a setting. They are the setting
            — the minimum sufficient representation of five cosmological worlds, each
            with its own grammar for what counts as forbidden, what counts as knowledge,
            and what the law cannot ask about without ceasing to be law. You read them
            in any order. You will notice the structure after three or four cards. That
            noticing is the point.
          </p>
        </header>

        {/* Pane grid */}
        <section className="mb-16">
          <h2 className="text-zinc-500 uppercase tracking-widest text-xs mb-6">
            Five Panes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PANES.map(({ slug, name, doctrineNote }) => (
              <PaneCard
                key={slug}
                paneSlug={slug}
                paneName={name}
                cardCount={10}
                doctrineNote={doctrineNote}
              />
            ))}
          </div>
        </section>

        {/* Footer links */}
        <footer className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/v3/moodboard/pierre-menard"
            className="text-amber-400 hover:text-amber-300 transition-colors no-underline"
          >
            Pierre-Menard Triptych →
          </Link>
          <Link
            href="/v3/moodboard/voice-warping"
            className="text-amber-400 hover:text-amber-300 transition-colors no-underline"
          >
            Voice-Warping Demo →
          </Link>
        </footer>
      </div>
    </div>
  );
}
