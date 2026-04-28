import { notFound } from 'next/navigation';
import Link from 'next/link';
import manifest from '../_manifest.json';
import { CardTile } from '@/components/moodboard/CardTile';

type ContrabandRelation = 'carries' | 'refuses' | 'mediates' | 'exposes';

const PANE_META: Record<string, { displayName: string; doctrineHeader: string }> = {
  'lud-border': {
    displayName: 'Lud-Border',
    doctrineHeader:
      'The civic-Mirrlees pane. Honey-amber light. Bureaucratic ceremony as the last defense against a cosmological order the law cannot name. The form is the border. What cannot be written on the form crosses freely.',
  },
  'old-ones-persist': {
    displayName: 'Old-Ones-Persist',
    doctrineHeader:
      'The Borges-warped archive. To catalogue is to be catalogued. The Old Ones are not entities — they are what remains when everything has been cross-referenced and the catalogue must point to itself. Cold fluorescent light and infinite stairs.',
  },
  'sinterklaas-reigns': {
    displayName: 'Sinterklaas-Reigns',
    doctrineHeader:
      'The witnessing apparatus. The Good Book records not what a child did but what was witnessed. The annual accounting closes on December fifth. The unjust gift carries cosmological debt. Chimneys remember.',
  },
  'true-names-persist': {
    displayName: 'True-Names-Persist',
    doctrineHeader:
      'The naming-network pane. True names are cosmological tethers, not labels. The last speaker is the last load-bearing node. A stolen name does not empower the thief — it untethers the thing that was named.',
  },
  'holmes-canonical-london': {
    displayName: 'Holmes-Canonical-London',
    doctrineHeader:
      'The deduction-and-archive pane. Holmes deduces; Watson decides what the world can bear. The correct inference that cannot be stated remains correct, forever, without consequence. The published cases are the survivable ones.',
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
    description: meta.doctrineHeader.slice(0, 160),
  };
}

export default async function PanePage({ params }: Props) {
  const { pane } = await params;
  const meta = PANE_META[pane];
  if (!meta) notFound();

  const cards = manifest.filter((c) => c.pane === pane);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-5 py-16">

        {/* Back link */}
        <Link
          href="/v3/moodboard"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors no-underline mb-8 block"
        >
          ← The Moodboard
        </Link>

        {/* Header */}
        <header className="mb-12">
          <p className="text-amber-400 uppercase tracking-widest text-xs mb-3">
            Pane
          </p>
          <h1 className="text-4xl font-medium italic text-zinc-100 mb-5 leading-tight">
            {meta.displayName}
          </h1>
          <p className="text-zinc-300 leading-relaxed max-w-2xl border-l-2 border-amber-500/40 pl-4 italic">
            {meta.doctrineHeader}
          </p>
        </header>

        {/* Card grid */}
        <section>
          <p className="text-zinc-500 uppercase tracking-widest text-xs mb-5">
            {cards.length} cards
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <CardTile
                key={card.id}
                paneSlug={pane}
                cardSlug={card.id}
                name={card.name}
                axiom={card.axiom}
                flavorLine={card.flavor_line}
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
