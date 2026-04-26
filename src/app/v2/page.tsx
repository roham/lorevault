import type { Metadata } from 'next';
import Link from 'next/link';
import { listCards } from '@/lib/v2/cards';

export const metadata: Metadata = {
  title: 'LoreVault — The Glass Catches Light',
  description:
    'Five Panes. Lampblack is what they leave on each other’s pages.',
};

const PANES = [
  {
    universe: 'baker-street',
    glyph: '221',
    label: 'Baker Street',
    role: 'Argument',
    cardId: 'bs-last-bow',
  },
  {
    universe: 'enchanted-kingdom',
    glyph: '⚘',
    label: 'Enchanted Kingdom',
    role: 'Inheritance',
    cardId: 'ek-footnoter-reveals',
  },
  {
    universe: 'wonderland',
    glyph: '♛',
    label: 'Wonderland',
    role: 'Categorical Failure',
    cardId: 'wl-alice-through-glass',
  },
  {
    universe: 'gothic-horror',
    glyph: '⚓',
    label: 'Gothic Horror',
    role: 'Transformation',
    cardId: 'gh-ledger-keeper-opens',
  },
  {
    universe: 'greek-myth',
    glyph: 'Ω',
    label: 'Greek Myth',
    role: 'Fate',
    cardId: 'gm-sixth-seed',
  },
];

export default function V2Home() {
  const cards = listCards();
  return (
    <div className="min-h-dvh bg-[var(--color-v2-ground)] text-[var(--color-v2-text)]">
      <header className="px-5 pt-8 pb-3 flex items-center justify-between">
        <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-mono)]">
          LoreVault
        </p>
        <Link
          href="/v2/welcome"
          className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-v2-text-dim)] hover:text-[var(--color-v2-text)] transition-colors [font-family:var(--font-v2-mono)]"
        >
          90s tour →
        </Link>
      </header>

      <main className="px-4 pb-16">
        {/* Hero — Lattice oil painting (Phase 5 §2.1, V2 audit Rewrite 2 Option C).
            Plain <img> to skip Next/Image optimizer round-trip — the source webp
            is already 118KB at 900w which is the LCP-optimal size for this hero. */}
        <Link
          href="/v2/welcome"
          className="block relative w-full max-w-[420px] mx-auto aspect-[2/3] overflow-hidden"
          aria-label="Enter the Lattice — 90 second tour"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/v2/lattice-painting.webp"
            alt="The Lattice — five Panes connected by faint glowing tethers"
            width={900}
            height={1350}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* faint vignette so the pull-line below stays readable */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-v2-ground)] to-transparent pointer-events-none" />
        </Link>

        {/* Pull-line — earned word "Lampblack" appears below the painting */}
        <div className="mt-6 max-w-[340px] mx-auto text-center">
          <p className="text-[18px] leading-[26px] italic text-[var(--color-v2-text)] [font-family:var(--font-pullquote)]">
            Every figure you half-remember is a figure with a Spine. The
            Lampblack is what proves they are.
          </p>
        </div>

        {/* 5 Pane buttons — one per Universe */}
        <nav
          aria-label="Five Panes"
          className="mt-10 max-w-[420px] mx-auto grid grid-cols-1 gap-2"
        >
          {PANES.map((p) => (
            <Link
              key={p.universe}
              href={`/v2/card/${p.cardId}`}
              className="group flex items-center gap-4 px-4 py-4 border border-[var(--color-v2-rule)] hover:border-[var(--color-tier-ultimate)] transition-colors bg-[var(--color-v2-ink)]"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center text-[18px] text-[var(--color-tier-ultimate)] [font-family:var(--font-v2-mono)] border border-[var(--color-v2-rule)] group-hover:border-[var(--color-tier-ultimate)] transition-colors"
              >
                {p.glyph}
              </span>
              <span className="flex-1">
                <span className="block text-[14px] tracking-[0.05em] uppercase text-[var(--color-v2-text)] [font-family:var(--font-v2-ui)]">
                  {p.label}
                </span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-[var(--color-v2-text-dim)] mt-0.5 [font-family:var(--font-v2-ui)]">
                  Pane of {p.role}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-[var(--color-v2-text-muted)] group-hover:text-[var(--color-v2-text)] transition-colors"
              >
                →
              </span>
            </Link>
          ))}
        </nav>

        {/* Sample-card index — the 5 marquee 1/1 ONE-OFFs */}
        <section className="mt-12 max-w-[420px] mx-auto border-t border-[var(--color-v2-rule)] pt-8">
          <h2 className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-ui)]">
            Series 1 — The Marquees
          </h2>
          <p className="mt-2 text-[13px] text-[var(--color-v2-text-dim)] [font-family:var(--font-body)]">
            Five 1/1 ONE-OFFs. One per Pane. Each is the ceiling of its
            Universe — the card the rest of the Series is written around.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {cards.map((c) => (
              <li key={c.cardId}>
                <Link
                  href={`/v2/card/${c.cardId}`}
                  className="group block aspect-[2/3] relative overflow-hidden border border-[var(--color-v2-rule)] hover:border-[var(--color-tier-ultimate)] transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.heroArtUrl}
                    alt={c.figureName}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-[var(--color-v2-ground)]/80 text-[10px] uppercase tracking-[0.1em] text-[var(--color-v2-text)] [font-family:var(--font-v2-ui)]">
                    {c.figureName}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-16 max-w-[420px] mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-v2-text-muted)] [font-family:var(--font-v2-mono)]">
            Series 1 · May 3 2026 — Feb 2027
          </p>
        </footer>
      </main>
    </div>
  );
}
