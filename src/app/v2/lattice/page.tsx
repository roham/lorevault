import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Lattice — LoreVault',
  description:
    'Five Panes. Eight Shells. The geometry that holds every figure across every possible world.',
};

const PANES = [
  {
    slug: 'baker-street',
    name: 'Baker Street',
    subtitle: 'The Pane of Argument',
    voice: 'Watson narrates. Gaslight. Forensic-confessional.',
    register: 'Blue-and-white. Cold deduction, warmth at the hearth.',
    href: '/v2/universe/baker-street',
  },
  {
    slug: 'enchanted-kingdom',
    name: 'Enchanted Kingdom',
    subtitle: 'The Pane of Inheritance',
    voice: 'The Wolf narrates in imperatives. Bone-rhyme.',
    register: 'Black-and-green. Forest at dusk, iron-bound chests, stepmothers.',
    href: '/v2/universe/enchanted-kingdom',
  },
  {
    slug: 'wonderland',
    name: 'Wonderland',
    subtitle: 'The Pane of Categorical Failure',
    voice: 'The Cheshire narrates in rhetorical questions. Liddell-logic.',
    register: 'Pure-blue. Vivid impossible color. Sentences that loop.',
    href: '/v2/universe/wonderland',
  },
  {
    slug: 'gothic-horror',
    name: 'Gothic Horror',
    subtitle: 'The Pane of Transformation',
    voice: 'Dracula narrates in centuries. Operatic-exhaustion.',
    register: 'Black with red-borderline. Wet stone, candle-wax, the body as betrayer.',
    href: '/v2/universe/gothic-horror',
  },
  {
    slug: 'greek-myth',
    name: 'Greek Myth',
    subtitle: 'The Pane of Fate',
    voice: 'Bronze-tongue chorus. Figures speak as if quoted by Hesiod.',
    register: 'White-and-red. Bronze, wine-dark sea, the weight of inevitability.',
    href: '/v2/universe/greek-myth',
  },
] as const;

const SHELLS = [
  { name: 'PRIME', line: 'The figure in their canonical period. Spine fully present.' },
  { name: 'CYBER', line: 'Cyberpunk relocation. The figure in a high-tech low-life chassis.' },
  { name: 'MODERN', line: "Today's urban world. Phones, Ubers, jetlag — only where the Spine holds." },
  { name: 'AETHER', line: 'Mythic-cosmic register. The figure raised to god-tier scale.' },
  { name: 'HOLLOW', line: 'Post-apocalyptic. The figure after catastrophe.' },
  { name: 'MIRROR', line: 'Identity-inverted. Only legal when answered by a Spine event.' },
  { name: 'DREAM', line: 'Psychedelic-spiritual. Waking-dream register.' },
  { name: 'SAINT', line: 'The figure mythologised to god-tier within their own canon.' },
] as const;

export default function LatticePage() {
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

      <main className="flex-1 flex flex-col px-5 pb-16 max-w-[600px] mx-auto w-full">

        {/* Title */}
        <div className="mt-4 mb-10">
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#6a5e50] font-mono mb-3">
            The Geometry
          </p>
          <h1 className="text-3xl font-serif text-[#e8e0d0] leading-tight">
            The Lattice
          </h1>
          <p className="mt-4 text-sm text-[#8a7e6e] font-mono leading-relaxed max-w-[480px]">
            Every story that survived into the public domain is a single Pane in the Lattice.
            The same figure exists across many Panes — different chassis, different gestures —
            but always recognisably itself. The thing that links them is Lampblack.
          </p>
        </div>

        {/* Five Panes */}
        <section className="mb-12">
          <p className="text-[9px] tracking-[0.25em] uppercase text-[#4a3e30] font-mono mb-6">
            Five Panes
          </p>

          <div className="flex flex-col gap-0">
            {PANES.map((pane, i) => (
              <div key={pane.slug}>
                {i > 0 && (
                  <div className="border-t border-[#1a1815]" />
                )}
                <Link
                  href={pane.href}
                  className="group block py-6 hover:bg-[#0f0e0c] transition-colors px-2 -mx-2 rounded-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono mb-1 group-hover:text-[#6a5e50] transition-colors">
                        {pane.subtitle}
                      </p>
                      <h2 className="text-lg font-serif text-[#e8e0d0] group-hover:text-white transition-colors">
                        {pane.name}
                      </h2>
                      <p className="mt-2 text-[11px] text-[#6a5e50] font-mono leading-relaxed">
                        {pane.voice}
                      </p>
                      <p className="mt-1 text-[11px] text-[#4a3e30] font-mono leading-relaxed">
                        {pane.register}
                      </p>
                    </div>
                    <span className="text-[#4a3e30] font-mono text-sm group-hover:text-[#8a7e6e] transition-colors flex-shrink-0 mt-1">
                      →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Eight Shells */}
        <section className="mb-12">
          <div className="border-t border-[#1a1815] pt-8">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#4a3e30] font-mono mb-6">
              Eight Shells
            </p>
            <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed mb-6 max-w-[440px]">
              Each Shell is a chassis — a mode of existence the figure inhabits without
              ceasing to be itself. The Spine holds across every Shell. The Lampblack
              holds across every Shell.
            </p>

            <div className="flex flex-col gap-4">
              {SHELLS.map((shell) => (
                <div key={shell.name} className="flex gap-4 items-start">
                  <p className="text-[10px] tracking-[0.15em] font-mono text-[#8a7e6e] w-16 flex-shrink-0 pt-[2px]">
                    {shell.name}
                  </p>
                  <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed">
                    {shell.line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lampblack — the residue */}
        <section className="mb-12">
          <div className="border-t border-[#1a1815] pt-8">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#4a3e30] font-mono mb-4">
              The Residue
            </p>
            <Link
              href="/v2/lampblack"
              className="group block"
            >
              <p className="text-base font-serif text-[#e8e0d0] group-hover:text-white transition-colors">
                Lampblack
              </p>
              <p className="mt-2 text-[11px] text-[#6a5e50] font-mono leading-relaxed max-w-[440px]">
                When one Pane brushes against another, something burns off.
                That residue — that Lampblack — is what lets a Victorian detective
                recognise a machine-age detective as kin and not as costume.
                It is the Lattice&rsquo;s only physics.
              </p>
              <p className="mt-3 text-[9px] tracking-[0.2em] uppercase text-[#4a3e30] font-mono group-hover:text-[#8a7e6e] transition-colors">
                What the residue looks like →
              </p>
            </Link>
          </div>
        </section>

        {/* Visible residue threads */}
        <section>
          <div className="border-t border-[#1a1815] pt-8">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#4a3e30] font-mono mb-4">
              Visible Residue Threads
            </p>
            <p className="text-[11px] text-[#4a3e30] font-mono leading-relaxed italic">
              No threads named yet. The Lattice has not been brushed against itself
              long enough to leave a mark you could photograph.
            </p>
            <p className="mt-2 text-[11px] text-[#4a3e30] font-mono leading-relaxed italic">
              Look again after Series 1 Month 6.
            </p>
          </div>
        </section>

      </main>

      <footer className="px-5 py-8 max-w-[600px] mx-auto w-full">
        <div className="border-t border-[#1a1815] pt-6 flex items-center justify-between">
          <p className="text-[9px] tracking-[0.15em] uppercase text-[#4a3e30] font-mono">
            Series 1 · The Glass Catches Light · v2
          </p>
          <Link
            href="/v2/today"
            className="text-[9px] tracking-[0.15em] uppercase text-[#4a3e30] font-mono hover:text-[#8a7e6e] transition-colors"
          >
            Today on the Lattice →
          </Link>
        </div>
      </footer>
    </div>
  );
}
