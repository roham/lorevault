import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CardDetailPage } from '@/components/v2/card-detail/CardDetailPage';
import { getCard, listCards } from '@/lib/v2/cards';
import { getLatticeCardAsV2, listLatticeCardsAsV2 } from '@/lib/v2/bs1-adapter';

export async function generateStaticParams() {
  const v2Ids = listCards().map((c) => ({ id: c.cardId }));
  const bs1Ids = listLatticeCardsAsV2().map((c) => ({ id: c.cardId }));
  // Deduplicate in case any IDs overlap in the future.
  const seen = new Set<string>();
  return [...v2Ids, ...bs1Ids].filter(({ id }) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = getCard(id) ?? getLatticeCardAsV2(id);
  if (!card) return { title: 'LoreVault' };
  return {
    title: `${card.figureName} — ${card.universeLabel} · LoreVault`,
    description: card.pullquote,
    openGraph: {
      title: `${card.figureName} — ${card.universeLabel}`,
      description: card.pullquote,
      images: [{ url: card.heroArtUrl }],
    },
  };
}

export default async function CardPage({ params }: PageProps) {
  const { id } = await params;
  const card = getCard(id) ?? getLatticeCardAsV2(id);
  if (!card) notFound();
  return <CardDetailPage card={card} />;
}
