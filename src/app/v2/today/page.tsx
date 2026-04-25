import { connection } from 'next/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LoreVault — Today on the Lattice',
  description: 'One card. One Echo element. Each day a different residue surfaces.',
};

type LatticeCard = {
  id: string;
  name: string;
  set: string;
  tier: string;
  shell: string;
  imagePath: string;
  imageAlt: string;
  flavor: string;
  flavorAttrib: string;
  echo: string;
};

const LATTICE_CARDS: LatticeCard[] = [
  {
    id: 'bs1-c01',
    name: "Watson's Arrival",
    set: 'Baker Street · BS-1',
    tier: 'Common',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-c01/v1.webp',
    imageAlt: 'Watson on the threshold of 221B Baker Street, 1881',
    flavor:
      'Name: Watson, J.H. Condition: serviceable. Time: 11.23. Comment: looked at the deerstalker first.',
    flavorAttrib: "Mrs H.'s visitor book, 1881",
    echo: 'The deerstalker in the hall was not dry. Someone had been out in the rain that morning and returned before Watson arrived.',
  },
  {
    id: 'bs1-c02',
    name: 'The Thinking Pose',
    set: 'Baker Street · BS-1',
    tier: 'Common',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-c02/v1.webp',
    imageAlt: 'Holmes at the mantelpiece, fingertips at temple, mid-deduction',
    flavor:
      'When he was silent like that, it was not that he had nothing to say. It was that whatever he was about to say would close the case.',
    flavorAttrib: 'Watson, casebook',
    echo: 'The pipe in his hand had been unlit for an hour. He smoked before a case and after. During, he needed his hands clear.',
  },
  {
    id: 'bs1-c03',
    name: "Watson's Notebook",
    set: 'Baker Street · BS-1',
    tier: 'Common',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-c03/v1.webp',
    imageAlt: "Watson at his writing desk, pen to notebook page, midnight",
    flavor:
      'To whoever finds this: do not read volume IV without reading III first. The explanation is in the margin of page 91.',
    flavorAttrib: 'J.H.W.',
    echo: "Page 91 of volume III contains a single line: 'He survived. The notation is sealed per his request.'",
  },
  {
    id: 'bs1-c06',
    name: 'The Persian Slipper',
    set: 'Baker Street · BS-1',
    tier: 'Common',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-c06/v1.webp',
    imageAlt: 'The Persian slipper on the 221B mantelpiece, tobacco-heavy and worn',
    flavor:
      'The slipper was the only object in 221B that was never moved. It outlasted three tenants, two attempted arson, and one particularly eventful Tuesday.',
    flavorAttrib: '',
    echo: "The third tenant whose departure the slipper outlasted was never identified in Watson's published accounts. The inventory of 1887 lists him only as 'the August occupant.'",
  },
  {
    id: 'bs1-l01',
    name: 'The Violin at Midnight',
    set: 'Baker Street · BS-1',
    tier: 'Legendary',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-l01/v1.webp',
    imageAlt: 'Holmes alone at 2am with the violin, Baker Street fog beyond the window',
    flavor:
      '2.15 AM. Violin. Not bored — the boredom-music is different. This is the other kind. I will not ask which case.',
    flavorAttrib: 'Watson',
    echo: "Watson owned three of Holmes's violin compositions. He never had them transcribed. He said the notation would not capture what made them what they were.",
  },
  {
    id: 'bs1-r01',
    name: 'V.R. in the Plaster',
    set: 'Baker Street · BS-1',
    tier: 'Rare',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-r01/v1.webp',
    imageAlt: "Holmes having shot 'V.R.' into the sitting-room wall, revolver still at his side",
    flavor:
      'Mr Watson — the plaster again. Fourth time this year. He has spelled Victoria correctly on this occasion.',
    flavorAttrib: 'Mrs H., note, undated',
    echo: "Of the three earlier 'V.R.' engravings, two were solved cases. The third was never discussed.",
  },
  {
    id: 'bs1-r02',
    name: 'The Street Deduction',
    set: 'Baker Street · BS-1',
    tier: 'Rare',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-r02/v1.webp',
    imageAlt: 'Holmes at the 221B first-floor window, observing a figure in the street below',
    flavor:
      'He described the man in the brown coat in eleven sentences before the man had reached the corner. He was right about ten of them. The eleventh surprised him.',
    flavorAttrib: 'Watson, casebook, 1887',
    echo: 'The man in the brown coat was never identified. Holmes kept the window for a week after, which Watson understood to mean he had not yet closed the case.',
  },
  {
    id: 'bs1-u01',
    name: 'You Have Been in Afghanistan, I Perceive',
    set: 'Baker Street · BS-1',
    tier: 'Ultimate',
    shell: 'PRIME',
    imagePath: '/prototype-art/bs-1-221b/bs1-u01/v1.webp',
    imageAlt: "Holmes and Watson at the moment of first meeting, St Bartholomew's Hospital, 1881",
    flavor:
      'He looked at me for perhaps four seconds. Then he told me things about myself I had not told him. The handshake was still warm.',
    flavorAttrib: 'Watson, casebook, 1881',
    echo: 'The mud on Watson\'s boot was the wrong Kandahar mud — the kind from the eastern outskirts. Holmes noted it but did not include it in the deduction he spoke aloud.',
  },
];

const UTC_MS_PER_DAY = 86_400_000;

export default async function TodayOnTheLattice() {
  await connection();

  const dayIndex = Math.floor(Date.now() / UTC_MS_PER_DAY);
  const card = LATTICE_CARDS[dayIndex % LATTICE_CARDS.length];

  const dateLabel = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <div className="min-h-dvh bg-[#0d0c0a] text-[#e8e0d0] flex flex-col">
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/v2"
          className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] font-mono hover:text-[#e8e0d0] transition-colors"
        >
          ← LoreVault
        </Link>
        <p className="text-[10px] tracking-[0.1em] text-[#4a3e30] font-mono">{dateLabel}</p>
      </header>

      <main className="flex-1 flex flex-col px-5 pb-12">
        <div className="max-w-[340px] mx-auto w-full mt-2">
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#6a5e50] font-mono mb-5">
            Today on the Lattice
          </p>

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

          <div className="mt-4">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a7e6e] font-mono">
              {card.set} · {card.tier} · {card.shell}
            </p>
            <p className="mt-1 text-base font-serif text-[#e8e0d0]">{card.name}</p>
          </div>

          <div className="mt-6 border-l border-[#2a2420] pl-4">
            <p className="text-[12px] text-[#b0a090] font-mono leading-relaxed italic">
              &ldquo;{card.flavor}&rdquo;
            </p>
            {card.flavorAttrib && (
              <p className="mt-1 text-[10px] text-[#6a5e50] font-mono">— {card.flavorAttrib}</p>
            )}
          </div>

          <div className="mt-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono mb-2">
              Lampblack Detail
            </p>
            <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">{card.echo}</p>
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
