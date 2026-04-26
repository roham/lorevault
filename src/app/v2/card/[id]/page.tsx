import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCardById, LATTICE_CARDS } from '@/lib/lattice-cards';
import { SubscribeForm } from '@/app/v2/journal/SubscribeForm';

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return LATTICE_CARDS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = getCardById(id);
  if (!card) return {};
  return {
    title: `${card.name} — LoreVault`,
    description: card.flavor,
  };
}

const TIER_LABEL: Record<string, string> = {
  Common: 'Common',
  Rare: 'Rare ◆',
  Legendary: 'Legendary ◆◆',
  Ultimate: 'Ultimate ◆◆◆',
};

export default async function CardDetailPage({ params }: Props) {
  const { id } = await params;
  const card = getCardById(id);
  if (!card) notFound();

  return (
    <div className="min-h-dvh bg-[#0d0c0a] text-[#e8e0d0] flex flex-col">
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/v2/lattice"
          className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] font-mono hover:text-[#e8e0d0] transition-colors"
        >
          ← The Lattice
        </Link>
        <Link
          href="/v2"
          className="text-[10px] tracking-[0.15em] uppercase text-[#4a3e30] font-mono hover:text-[#6a5e50] transition-colors"
        >
          LoreVault
        </Link>
      </header>

      <main className="flex-1 flex flex-col px-5 pb-16">
        <div className="max-w-[360px] mx-auto w-full mt-2">

          {/* Card image */}
          <div className="relative w-full max-w-[260px] mx-auto">
            <div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-2xl">
              <Image
                src={card.imagePath}
                alt={card.imageAlt}
                fill
                className="object-cover"
                priority
                sizes="260px"
              />
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-black/60 to-transparent" />
            </div>
          </div>

          {/* Card identity */}
          <div className="mt-5">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#6a5e50] font-mono">
              {card.set}
            </p>
            <h1 className="mt-1 text-lg font-serif text-[#e8e0d0] leading-snug">{card.name}</h1>
            <p className="mt-1 text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono">
              {TIER_LABEL[card.tier] ?? card.tier} · {card.shell}
            </p>
          </div>

          {/* Flavor text */}
          <div className="mt-6 border-l border-[#2a2420] pl-4">
            <p className="text-[12px] text-[#b0a090] font-mono leading-relaxed italic">
              &ldquo;{card.flavor}&rdquo;
            </p>
            {card.flavorAttrib && (
              <p className="mt-1 text-[10px] text-[#6a5e50] font-mono">— {card.flavorAttrib}</p>
            )}
          </div>

          {/* Echo element (Lampblack / iceberg detail) */}
          <div className="mt-8 border border-[#1a1815] rounded-sm p-4 bg-[#0f0e0c]">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#6a5e50] font-mono mb-3">
              Echo Element
            </p>
            <p className="text-[12px] text-[#8a7e6e] font-mono leading-relaxed">{card.echo}</p>
            <p className="mt-3 text-[9px] text-[#3a3028] font-mono leading-relaxed">
              You are reading iceberg lore that has never been publicly confirmed.
            </p>
          </div>

          {/* Journal subscription CTA */}
          <div className="mt-10 border-t border-[#1a1815] pt-8">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#4a3e30] font-mono mb-2">
              Jonathan&apos;s Journal
            </p>
            <p className="text-[13px] font-serif text-[#b0a090] leading-snug mb-1">
              Every echo has a deeper residue.
            </p>
            <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed mb-5">
              Jonathan&apos;s Journal re-emits the Dracula story in real time — one entry per day,
              free, starting 3 May 2026. Each entry surfaces one more layer of the iceberg.
            </p>
            <SubscribeForm />
          </div>

          {/* Navigation */}
          <div className="mt-10 flex gap-4">
            <Link
              href="/v2/today"
              className="text-[10px] tracking-[0.15em] uppercase font-mono text-[#6a5e50] hover:text-[#b0a090] transition-colors"
            >
              Today on the Lattice →
            </Link>
          </div>

        </div>
      </main>

      <footer className="px-5 py-6">
        <p className="text-[9px] tracking-[0.15em] uppercase text-[#4a3e30] font-mono text-center">
          Series 1 · The Glass Catches Light · v2
        </p>
      </footer>
    </div>
  );
}
