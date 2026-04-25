import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LoreVault — The Glass Catches Light',
  description:
    'Every figure exists across many possible worlds. The residue left behind when those worlds brush against each other is called Lampblack.',
};

export default function V2Home() {
  return (
    <div className="min-h-dvh bg-[#0d0c0a] text-[#e8e0d0] flex flex-col">
      <header className="px-5 pt-8 pb-4">
        <p className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] font-mono">
          LoreVault
        </p>
      </header>

      <main className="flex-1 flex flex-col px-5">
        {/* Hero Moment — Watson's Arrival, BS-1 */}
        <div className="relative w-full max-w-[340px] mx-auto mt-4">
          <div className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-2xl">
            <Image
              src="/prototype-art/bs-1-221b/bs1-c01/v1.webp"
              alt="Watson's Arrival — 221B Baker Street, 1881"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 375px) 340px, 340px"
            />
            {/* Lampblack smudge overlay — lower-right corner, as per doctrine */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-black/60 to-transparent" />
          </div>

          {/* Card caption — minimal, serif, below the image */}
          <div className="mt-3 px-1">
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#8a7e6e] font-mono">
              Baker Street · BS-1 · Common · PRIME
            </p>
            <p className="mt-1 text-[11px] text-[#b0a090] font-mono leading-snug italic">
              &ldquo;Name: Watson, J.H. Condition: serviceable. Time: 11.23.
              Comment: looked at the deerstalker first.&rdquo;
            </p>
            <p className="mt-1 text-[9px] text-[#6a5e50] font-mono">
              Mrs H.&rsquo;s visitor book, 1881
            </p>
          </div>
        </div>

        {/* The one line of voice */}
        <div className="mt-10 max-w-[320px] mx-auto text-center">
          <h1 className="text-2xl font-serif text-[#e8e0d0] leading-tight tracking-wide">
            The glass catches light.
          </h1>
          <p className="mt-4 text-sm text-[#8a7e6e] leading-relaxed max-w-[280px] mx-auto">
            Every figure exists across many possible worlds. The residue left
            behind when those worlds brush against each other is called
            Lampblack.
          </p>
        </div>

        {/* The door — one link */}
        <div className="mt-10 mx-auto">
          <Link
            href="/prototype/exemplars"
            className="inline-block border border-[#4a3e30] px-6 py-3 text-xs tracking-[0.2em] uppercase text-[#b0a090] font-mono hover:border-[#8a7e6e] hover:text-[#e8e0d0] transition-colors"
          >
            Enter the Lattice
          </Link>
        </div>

        {/* Today on the Lattice — daily card surface */}
        <div className="mt-12 max-w-[320px] mx-auto w-full border-t border-[#1a1815] pt-8">
          <Link
            href="/v2/today"
            className="flex items-baseline justify-between group"
          >
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#6a5e50] font-mono group-hover:text-[#8a7e6e] transition-colors">
              Today on the Lattice
            </p>
            <p className="text-[9px] tracking-[0.1em] text-[#4a3e30] font-mono group-hover:text-[#6a5e50] transition-colors">
              →
            </p>
          </Link>
          <p className="mt-2 text-[10px] text-[#4a3e30] font-mono leading-relaxed">
            One card. One Echo element. Each day, a different residue surfaces.
          </p>
        </div>
      </main>

      <footer className="px-5 py-8">
        <p className="text-[9px] tracking-[0.15em] uppercase text-[#4a3e30] font-mono text-center">
          Series 1 · The Glass Catches Light · v2
        </p>
      </footer>
    </div>
  );
}
