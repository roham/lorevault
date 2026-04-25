import type { Metadata } from 'next'
import Link from 'next/link'
import { SubscribeForm } from './SubscribeForm'

export const metadata: Metadata = {
  title: "LoreVault — Jonathan's Journal",
  description:
    "Bram Stoker's Dracula, re-emitted on the days Jonathan Harker wrote it. One entry. One Lampblack detail. Begins 3 May 2026.",
}

export default function JournalPage() {
  return (
    <div className="min-h-dvh bg-[#0d0c0a] text-[#e8e0d0] flex flex-col">
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/v2"
          className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] font-mono hover:text-[#e8e0d0] transition-colors"
        >
          ← LoreVault
        </Link>
        <p className="text-[10px] tracking-[0.1em] text-[#4a3e30] font-mono">Gothic Horror</p>
      </header>

      <main className="flex-1 flex flex-col px-5 pb-16">
        <div className="max-w-[340px] mx-auto w-full mt-2">

          {/* Serial label */}
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#6a5e50] font-mono mb-5">
            Jonathan&rsquo;s Journal · Serial
          </p>

          {/* Title block */}
          <h1 className="text-2xl font-serif text-[#e8e0d0] leading-tight">
            Jonathan&rsquo;s Journal
          </h1>
          <p className="mt-2 text-[11px] tracking-[0.1em] text-[#8a7e6e] font-mono">
            3 May 2026 &mdash; 7 November 2026
          </p>

          {/* Description */}
          <p className="mt-5 text-[13px] text-[#b0a090] font-mono leading-relaxed">
            Bram Stoker&rsquo;s <em>Dracula</em> re-emitted on the days Jonathan Harker wrote it.
            One journal entry. One Lampblack detail the original text does not contain.
            One marginalia line from the Footnoter.
          </p>
          <p className="mt-3 text-[12px] text-[#8a7e6e] font-mono leading-relaxed">
            Free. No account required. Begins 3 May.
          </p>

          {/* Subscribe */}
          <div className="mt-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono mb-3">
              Receive each entry by email
            </p>
            <SubscribeForm />
          </div>

          {/* Divider */}
          <div className="mt-10 border-t border-[#1a1815] pt-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono mb-4">
              First entry — 3 May 1897
            </p>

            {/* Entry preview */}
            <div className="border-l border-[#2a2420] pl-4">
              <p className="text-[12px] text-[#b0a090] font-mono leading-relaxed italic">
                &ldquo;3 May. Bistritz. Left Munich at 8:35 P.M. on 1st May&hellip;
                The impression I had was that we were leaving the West and entering the East.&rdquo;
              </p>
              <p className="mt-1 text-[10px] text-[#6a5e50] font-mono">
                Bram Stoker, <em>Dracula</em> (1897)
              </p>
            </div>
          </div>

          {/* Lampblack detail — partial reveal */}
          <div className="mt-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono mb-2">
              Lampblack Detail
            </p>
            <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">
              The night before he left for Bistritz, Jonathan wrote Mina a letter and asked
              the hotel&rsquo;s night porter to send it. The porter did not. The letter was found,
              in an envelope addressed to Exeter but never sealed, in the hotel records of 1903.
              The date on the letter was two days later than the date in the journal.
              He had already started forgetting.
            </p>
          </div>

          {/* What this is */}
          <div className="mt-10 border-t border-[#1a1815] pt-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono mb-3">
              What this is
            </p>
            <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">
              The Gothic Horror universe of LoreVault runs through
              Stoker&rsquo;s calendar. Every entry Jonathan Harker wrote
              in 1897 arrives in your inbox on the same date in 2026 —
              illustrated, annotated, and trailing a detail the original
              text left unsaid. When the journal closes on 7 November,
              the Lattice will have shifted in ways no single reader will
              have caught alone.
            </p>
          </div>

          {/* Lattice link */}
          <div className="mt-10">
            <Link
              href="/v2/lattice"
              className="text-[10px] tracking-[0.15em] uppercase font-mono text-[#6a5e50] hover:text-[#b0a090] transition-colors"
            >
              Learn what the Lattice is →
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-5 py-8">
        <p className="text-[9px] tracking-[0.15em] uppercase text-[#4a3e30] font-mono text-center">
          Series 1 · The Glass Catches Light · v2
        </p>
      </footer>
    </div>
  )
}
