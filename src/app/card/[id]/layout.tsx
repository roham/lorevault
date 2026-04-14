import type { Metadata } from 'next';
import { ALL_CARDS, GHOST_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG, type Card } from '@/data/types';

function getCardImagePath(card: Card): string {
  const base = `${card.setSlug}-${card.character}-${card.moment}`.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  return `/cards/${base}.webp`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = ALL_CARDS.find(c => c.id === id) || GHOST_CARDS.find(c => c.id === id);

  if (!card) {
    return { title: 'Card Not Found — LoreVault' };
  }

  const scarcity = SCARCITY_CONFIG[card.scarcity];
  const title = `${card.character} — ${scarcity.label} #${card.serialNumber} | LoreVault`;
  const description = `${scarcity.label} ${card.character}: "${card.moment}" from the ${card.set} collection. Serial #${card.serialNumber}/${card.maxSerial}. Collect the legends.`;
  const imagePath = getCardImagePath(card);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'LoreVault',
      type: 'website',
      images: [{
        url: imagePath,
        width: 400,
        height: 560,
        alt: `${card.character} — ${card.moment}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${card.character} — ${scarcity.label} | LoreVault`,
      description: `"${card.moment}" — ${scarcity.label} #${card.serialNumber}/${card.maxSerial}`,
      images: [imagePath],
    },
  };
}

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
