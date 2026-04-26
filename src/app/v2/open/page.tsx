import type { Metadata } from 'next';
import Link from 'next/link';
import { TicketProgress } from './TicketProgress';

export const metadata: Metadata = {
  title: 'Sample Pack — LoreVault',
  description: 'Seven reading days unlock your first Sample pack.',
};

export default function OpenPage() {
  return (
    <div className="min-h-dvh bg-[#0d0c0a] text-[#e8e0d0] flex flex-col">
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/v2"
          className="text-xs tracking-[0.2em] uppercase text-[#8a7e6e] font-mono hover:text-[#e8e0d0] transition-colors"
        >
          ← LoreVault
        </Link>
      </header>

      <main className="flex-1 flex flex-col px-5 pb-16">
        <div className="max-w-[360px] mx-auto w-full mt-2">

          <div className="mb-8">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#6a5e50] font-mono mb-3">
              Reading Days
            </p>
            <h1 className="text-2xl font-serif text-[#e8e0d0] leading-tight">
              The Sample Pack
            </h1>
            <p className="mt-4 text-[11px] text-[#8a7e6e] font-mono leading-relaxed max-w-[300px]">
              Read the Journal. Collect a reading day. Seven days become one
              Sample pack — a single Common Moment from Baker Street · BS-1.
            </p>
          </div>

          <TicketProgress />

          <div className="mt-12 border-t border-[#1a1815] pt-8">
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono mb-3">
              How it works
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <span className="text-[10px] font-mono text-[#4a3e30] w-4 flex-shrink-0 pt-[2px]">1</span>
                <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">
                  Open Jonathan&apos;s Journal each day. Your reading day is
                  collected automatically when you visit this page.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[10px] font-mono text-[#4a3e30] w-4 flex-shrink-0 pt-[2px]">2</span>
                <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">
                  Seven consecutive reading days fill the counter. The pack
                  does not expire once earned.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[10px] font-mono text-[#4a3e30] w-4 flex-shrink-0 pt-[2px]">3</span>
                <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">
                  Miss a day and the count resets. A Reading Pact lets you
                  restore one missed day per month.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-[10px] font-mono text-[#4a3e30] w-4 flex-shrink-0 pt-[2px]">4</span>
                <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">
                  Pack reveal mechanics launch with Series 1 Drop 1.
                  Reading days accumulated before launch are counted.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/v2/journal"
              className="inline-block text-[10px] tracking-[0.15em] uppercase font-mono text-[#6a5e50] border border-[#2a2420] px-4 py-2 hover:border-[#4a3e30] hover:text-[#b0a090] transition-colors"
            >
              Subscribe to Jonathan&apos;s Journal →
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
