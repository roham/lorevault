import { notFound } from 'next/navigation';
import Link from 'next/link';
import manifest from '../../_manifest.json';
import { CardDeepDetail } from '@/components/moodboard/CardDeepDetail';

type ContrabandRelation = 'carries' | 'refuses' | 'mediates' | 'exposes';

const PANE_NAMES: Record<string, string> = {
  'lud-border':              'Lud-Border',
  'old-ones-persist':        'Old-Ones-Persist',
  'sinterklaas-reigns':      'Sinterklaas-Reigns',
  'true-names-persist':      'True-Names-Persist',
  'holmes-canonical-london': 'Holmes-Canonical-London',
};

interface Props {
  params: Promise<{ pane: string; card: string }>;
}

export async function generateStaticParams() {
  return manifest.map((c) => ({ pane: c.pane, card: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { card: cardId } = await params;
  const card = manifest.find((c) => c.id === cardId);
  if (!card) return {};
  return {
    title: `${card.name} — ${PANE_NAMES[card.pane] ?? card.pane} · LoreVault Moodboard`,
    description: card.axiom.slice(0, 160),
  };
}

type ManifestCard = (typeof manifest)[number];

export default async function CardPage({ params }: Props) {
  const { pane, card: cardId } = await params;
  const found = manifest.find((c) => c.id === cardId && c.pane === pane) as ManifestCard | undefined;
  if (!found) notFound();
  const card = found;

  const paneCards = manifest.filter((c) => c.pane === pane);
  const currentIndex = paneCards.findIndex((c) => c.id === cardId);
  const prevCard = currentIndex > 0 ? paneCards[currentIndex - 1] : null;
  const nextCard = currentIndex < paneCards.length - 1 ? paneCards[currentIndex + 1] : null;

  const paneName = PANE_NAMES[pane] ?? pane;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero — full-bleed, immersive */}
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: '16 / 9', maxHeight: '70vh' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/v3/cards/${pane}/${cardId}/hero.png`}
          alt={card.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent pt-32 pb-8">
          <div className="mx-auto max-w-3xl px-5">
            <Link
              href={`/v3/moodboard/${pane}`}
              className="text-xs uppercase tracking-widest text-amber-400 no-underline transition-colors hover:text-amber-300"
            >
              {paneName}
            </Link>
            <h1 className="mt-3 text-4xl font-medium italic leading-tight text-zinc-100 sm:text-5xl">
              {card.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12">
        {/* The axiom — single soft-lit blockquote */}
        <blockquote className="mb-8 border-l-2 border-amber-500 pl-6">
          <p className="text-xl leading-relaxed italic text-zinc-200">
            {card.axiom}
          </p>
        </blockquote>

        {/* The flavor line — collector voice */}
        <p className="mb-12 text-base leading-relaxed text-zinc-400 italic">
          {card.flavor_line}
        </p>

        {/* Progressive disclosure — everything structural lives here */}
        <CardDeepDetail
          iceberg={card.iceberg}
          lampblack={card.lampblack}
          contrabandRelation={card.contraband_relation as ContrabandRelation}
          contrabandNote={card.contraband_relation_note}
          pierreMenard={card.pierre_menard}
        />

        {/* Prev / Next */}
        <nav className="mt-16 flex items-center justify-between gap-4 border-t border-zinc-800 pt-6 text-sm">
          {prevCard ? (
            <Link
              href={`/v3/moodboard/${pane}/${prevCard.id}`}
              className="text-zinc-400 no-underline transition-colors hover:text-zinc-200"
            >
              ← {prevCard.name}
            </Link>
          ) : <span />}
          <Link
            href={`/v3/moodboard/${pane}`}
            className="text-zinc-500 no-underline transition-colors hover:text-zinc-300"
          >
            ↑ {paneName}
          </Link>
          {nextCard ? (
            <Link
              href={`/v3/moodboard/${pane}/${nextCard.id}`}
              className="text-right text-zinc-400 no-underline transition-colors hover:text-zinc-200"
            >
              {nextCard.name} →
            </Link>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
}
