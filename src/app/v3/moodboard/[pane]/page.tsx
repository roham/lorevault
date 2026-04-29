import { notFound } from 'next/navigation';
import Link from 'next/link';
import manifest from '../_manifest.json';
import { CardTile } from '@/components/moodboard/CardTile';

type ContrabandRelation = 'carries' | 'refuses' | 'mediates' | 'exposes';

const PANE_META: Record<string, { displayName: string; axiom: string }> = {
  'lud-border': {
    displayName: 'Lud-Border',
    axiom:
      'The form is the border. What cannot be written on the form crosses freely.',
  },
  'old-ones-persist': {
    displayName: 'Old-Ones-Persist',
    axiom:
      'To catalogue is to be catalogued.',
  },
  'sinterklaas-reigns': {
    displayName: 'Sinterklaas-Reigns',
    axiom:
      'The record is what makes events cosmological.',
  },
  'true-names-persist': {
    displayName: 'True-Names-Persist',
    axiom:
      'A stolen name does not empower the thief — it untethers the thing that was named.',
  },
  'holmes-canonical-london': {
    displayName: 'Holmes-Canonical-London',
    axiom:
      'The published cases are the survivable ones.',
  },
};

interface Props {
  params: Promise<{ pane: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PANE_META).map((pane) => ({ pane }));
}

export async function generateMetadata({ params }: Props) {
  const { pane } = await params;
  const meta = PANE_META[pane];
  if (!meta) return {};
  return {
    title: `${meta.displayName} — Moodboard · LoreVault`,
    description: meta.axiom,
  };
}

export default async function PanePage({ params }: Props) {
  const { pane } = await params;
  const meta = PANE_META[pane];
  if (!meta) notFound();

  const cards = manifest.filter((c) => c.pane === pane);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <Link
          href="/v3/moodboard"
          className="mb-10 inline-block text-xs uppercase tracking-widest text-zinc-500 no-underline transition-colors hover:text-zinc-300"
        >
          ← All Panes
        </Link>

        {/* Header — Pane name + one-line axiom only */}
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-amber-400">Pane</p>
          <h1 className="mb-5 text-4xl font-medium italic leading-tight text-zinc-100 sm:text-5xl">
            {meta.displayName}
          </h1>
          <p className="border-l-2 border-amber-500/50 pl-4 text-lg italic leading-relaxed text-zinc-300">
            {meta.axiom}
          </p>
        </header>

        {/* Silhouette mosaic — 3 col mobile, 4 sm, 5 lg */}
        <section>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
            {cards.map((card) => (
              <CardTile
                key={card.id}
                paneSlug={pane}
                cardSlug={card.id}
                name={card.name}
                contrabandRelation={card.contraband_relation as ContrabandRelation}
                isPierreMenard={card.pierre_menard !== null}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
