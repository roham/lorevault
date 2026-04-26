import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CardDetailPage } from '@/components/v2/card-detail/CardDetailPage';
import { getCard, listCards } from '@/lib/v2/cards';

/**
 * /v2/card/[id] — Phase 4 chassis. Replaces the prior lattice-cards detail
 * route. The route key is `id` to preserve the existing URL contract from the
 * v2 today page; internally the new chassis treats it as cardId.
 */

export async function generateStaticParams() {
  return listCards().map((c) => ({ id: c.cardId }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = getCard(id);
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
  const card = getCard(id);
  if (!card) notFound();
  return <CardDetailPage card={card} />;
}
