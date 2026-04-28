import { notFound } from 'next/navigation';
import Link from 'next/link';
import manifest from '../../_manifest.json';
import { IcebergBlock } from '@/components/moodboard/IcebergBlock';
import { LampblackDisplay } from '@/components/moodboard/LampblackDisplay';
import { RenderBriefTabs } from '@/components/moodboard/RenderBriefTabs';
import { ContrabandBadge } from '@/components/moodboard/ContrabandBadge';
import { PierreMenardBadge } from '@/components/moodboard/PierreMenardBadge';

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
  const foundCard = manifest.find((c) => c.id === cardId && c.pane === pane) as ManifestCard | undefined;
  if (!foundCard) notFound();
  const card = foundCard as ManifestCard;

  // Find prev / next within the pane
  const paneCards = manifest.filter((c) => c.pane === pane);
  const currentIndex = paneCards.findIndex((c) => c.id === cardId);
  const prevCard = currentIndex > 0 ? paneCards[currentIndex - 1] : null;
  const nextCard = currentIndex < paneCards.length - 1 ? paneCards[currentIndex + 1] : null;

  const paneName = PANE_NAMES[pane] ?? pane;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-5 py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8 flex-wrap">
          <Link href="/v3/moodboard" className="hover:text-zinc-300 transition-colors no-underline">
            Moodboard
          </Link>
          <span>›</span>
          <Link href={`/v3/moodboard/${pane}`} className="hover:text-zinc-300 transition-colors no-underline text-amber-400">
            {paneName}
          </Link>
          <span>›</span>
          <span className="text-zinc-300">{card.name}</span>
        </nav>

        {/* Hero image — the rendered visual */}
        <div
          className="bg-black border border-zinc-800 rounded overflow-hidden mb-8"
          style={{ aspectRatio: '16 / 9' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/v3/cards/${pane}/${cardId}/hero.png`}
            alt={`Hero render of ${card.name}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card header */}
        <header className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <ContrabandBadge
                relation={card.contraband_relation as ContrabandRelation}
                compact
              />
              {card.pierre_menard && (
                <PierreMenardBadge
                  setId={card.pierre_menard.set_id}
                  variantLabel={card.pierre_menard.variant_label}
                />
              )}
            </div>
          </div>

          <h1 className="text-4xl font-medium italic text-zinc-100 mb-5 leading-tight">
            {card.name}
          </h1>

          {/* Axiom */}
          <blockquote className="border-l-2 border-amber-500 pl-5 my-6">
            <p className="text-zinc-200 text-lg leading-relaxed italic">
              {card.axiom}
            </p>
          </blockquote>

          {/* Flavor line */}
          <p className="text-zinc-400 text-base italic">
            {card.flavor_line}
          </p>
        </header>

        {/* Contraband relation detail */}
        <section className="mb-10">
          <h2 className="text-zinc-500 uppercase tracking-widest text-xs mb-4">
            Contraband relation
          </h2>
          <ContrabandBadge
            relation={card.contraband_relation as ContrabandRelation}
            note={card.contraband_relation_note}
          />
        </section>

        {/* Pierre-Menard block */}
        {card.pierre_menard && (
          <section className="mb-10 border border-amber-500/30 rounded p-5 bg-amber-500/5">
            <h2 className="text-amber-400 uppercase tracking-widest text-xs mb-3">
              Pierre-Menard set · {card.pierre_menard.set_id}
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Variant: <span className="text-amber-300">{card.pierre_menard.variant_label}</span>
            </p>
            <blockquote className="italic text-zinc-200 text-base border-l-2 border-amber-500 pl-4 mb-4">
              "{card.pierre_menard.shared_axiom}"
            </blockquote>
            <p className="text-zinc-400 text-sm mb-3">
              This card shares an identical axiom with three other cards across different Panes.
              Each Pane attributes a different cosmological meaning to the same words.
            </p>
            <Link
              href="/v3/moodboard/pierre-menard"
              className="text-amber-400 text-sm hover:text-amber-300 transition-colors no-underline"
            >
              View the full Pierre-Menard triptych →
            </Link>
          </section>
        )}

        {/* Iceberg */}
        <section className="mb-10">
          <h2 className="text-zinc-500 uppercase tracking-widest text-xs mb-5">
            Iceberg structure
          </h2>
          <IcebergBlock
            surface={card.iceberg.surface}
            echo={card.iceberg.echo}
            deep={card.iceberg.deep}
          />
        </section>

        {/* Lampblack */}
        <section className="mb-10">
          <h2 className="text-zinc-500 uppercase tracking-widest text-xs mb-5">
            Lampblack residue
          </h2>
          <LampblackDisplay lampblack={card.lampblack} />
        </section>

        {/* Render briefs */}
        <section className="mb-12">
          <h2 className="text-zinc-500 uppercase tracking-widest text-xs mb-5">
            Render briefs
          </h2>
          <RenderBriefTabs briefs={card.render_briefs} pane={pane} cardId={cardId} />
        </section>

        {/* Prev / Next navigation */}
        <nav className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-8">
          {prevCard ? (
            <Link
              href={`/v3/moodboard/${pane}/${prevCard.id}`}
              className="text-zinc-400 hover:text-zinc-200 transition-colors no-underline text-sm"
            >
              ← {prevCard.name}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href={`/v3/moodboard/${pane}`}
            className="text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm"
          >
            ↑ {paneName}
          </Link>
          {nextCard ? (
            <Link
              href={`/v3/moodboard/${pane}/${nextCard.id}`}
              className="text-zinc-400 hover:text-zinc-200 transition-colors no-underline text-sm text-right"
            >
              {nextCard.name} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

      </div>
    </div>
  );
}
