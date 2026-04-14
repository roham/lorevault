import type { Metadata } from 'next';
import { ALL_CARDS, GHOST_CARDS } from '@/data/cards';
import { SCARCITY_CONFIG } from '@/data/types';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = ALL_CARDS.find(c => c.id === id) || GHOST_CARDS.find(c => c.id === id);

  if (!card) {
    return { title: 'Card Not Found — LoreVault' };
  }

  const scarcity = SCARCITY_CONFIG[card.scarcity];
  const title = `${card.character} — ${scarcity.label} #${card.serialNumber} | LoreVault`;
  const description = `${scarcity.label} ${card.character}: "${card.moment}" from the ${card.set} collection. Serial #${card.serialNumber}/${card.maxSerial}. Collect the legends.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'LoreVault',
      type: 'website',
      images: [{
        url: `/cards/${card.id}.webp`,
        width: 400,
        height: 560,
        alt: `${card.character} — ${card.moment}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${card.character} — ${scarcity.label} | LoreVault`,
      description: `"${card.moment}" — ${scarcity.label} #${card.serialNumber}/${card.maxSerial}`,
      images: [`/cards/${card.id}.webp`],
    },
  };
}

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
