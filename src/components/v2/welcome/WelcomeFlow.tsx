'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { listCards } from '@/lib/v2/cards';

/**
 * Phase 5 §1 — 90-second onboarding.
 *
 * Time map:
 *   0–12s  pull-line typed in, three Pane-shifts (Watson → Persephone → Cheshire)
 *  12–30s  4-figure rotation (+ Anubis as the cross-Pane judge); user picks a door
 *  30–60s  Sample-pack reveal (rigged Rare+ pull) — animation only for the slice
 *  60–90s  Lattice-map reveal + Journal CTA
 *
 * Plain HTML/CSS animations — no Framer Motion required for first iteration.
 */

const PANES = [
  { universe: 'baker-street', label: 'Baker Street', glyph: '221' },
  { universe: 'enchanted-kingdom', label: 'Enchanted Kingdom', glyph: '⚘' },
  { universe: 'wonderland', label: 'Wonderland', glyph: '♛' },
  { universe: 'gothic-horror', label: 'Gothic Horror', glyph: '⚓' },
  { universe: 'greek-myth', label: 'Greek Myth', glyph: 'Ω' },
];

type Stage = 'opening' | 'choose' | 'pack' | 'lattice';

export function WelcomeFlow() {
  const [stage, setStage] = useState<Stage>('opening');
  const [chosenUniverse, setChosenUniverse] = useState<string | null>(null);

  // 0–12s opening, then auto-advance to "choose"
  useEffect(() => {
    if (stage !== 'opening') return;
    const t = setTimeout(() => setStage('choose'), 12_000);
    return () => clearTimeout(t);
  }, [stage]);

  // 30–60s pack auto-advances to lattice after 8s
  useEffect(() => {
    if (stage !== 'pack') return;
    const t = setTimeout(() => setStage('lattice'), 8_000);
    return () => clearTimeout(t);
  }, [stage]);

  return (
    <div className="min-h-dvh bg-[var(--color-v2-ground)] text-[var(--color-v2-text)] flex flex-col">
      <header className="px-5 pt-6 pb-3 flex items-center justify-between">
        <Link
          href="/v2"
          className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-v2-text-dim)] hover:text-[var(--color-v2-text)] transition-colors [font-family:var(--font-v2-mono)]"
        >
          ← skip
        </Link>
        <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-mono)]">
          90 seconds
        </p>
      </header>

      <main className="flex-1 flex flex-col px-5 pb-16">
        {stage === 'opening' && <OpeningStage onAdvance={() => setStage('choose')} />}
        {stage === 'choose' && (
          <ChooseStage
            onChoose={(u) => {
              setChosenUniverse(u);
              setStage('pack');
            }}
          />
        )}
        {stage === 'pack' && <PackStage universe={chosenUniverse} />}
        {stage === 'lattice' && <LatticeStage chosen={chosenUniverse} />}
      </main>
    </div>
  );
}

function OpeningStage({ onAdvance }: { onAdvance: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="max-w-[340px] mx-auto text-center">
        <p
          className="text-[24px] leading-[34px] italic text-[var(--color-v2-text)] [font-family:var(--font-pullquote)] welcome-typing"
        >
          One of five Panes. Somewhere else, he is saying it again.
        </p>
        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-[var(--color-v2-text-muted)] [font-family:var(--font-v2-mono)]">
          watson · persephone · cheshire — same shape, different doors
        </p>
        <button
          type="button"
          onClick={onAdvance}
          className="mt-10 text-[11px] uppercase tracking-[0.2em] text-[var(--color-v2-text-dim)] hover:text-[var(--color-v2-text)] transition-colors [font-family:var(--font-v2-mono)]"
        >
          tap to continue ↓
        </button>
      </div>

      <style>{`
        @keyframes welcome-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .welcome-typing {
          animation: welcome-fade-in 1.2s ease-out;
        }
      `}</style>
    </div>
  );
}

function ChooseStage({ onChoose }: { onChoose: (u: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <p className="text-[14px] leading-[22px] text-[var(--color-v2-text-dim)] text-center max-w-[300px] mx-auto [font-family:var(--font-body)]">
        Four figures. Four Panes. One door. You will not learn their names yet.
        You will recognize one of them. That is the door.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 max-w-[360px] w-full">
        {PANES.slice(0, 4).map((p) => (
          <button
            key={p.universe}
            type="button"
            onClick={() => onChoose(p.universe)}
            className="aspect-square flex flex-col items-center justify-center border border-[var(--color-v2-rule)] hover:border-[var(--color-tier-ultimate)] transition-colors bg-[var(--color-v2-ink)]"
          >
            <span className="text-[28px] text-[var(--color-tier-ultimate)] [font-family:var(--font-v2-mono)]">
              {p.glyph}
            </span>
            <span className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-ui)]">
              {p.label}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChoose('greek-myth')}
        className="mt-3 max-w-[360px] w-full aspect-[5/2] flex items-center justify-center gap-3 border border-[var(--color-v2-rule)] hover:border-[var(--color-tier-ultimate)] transition-colors bg-[var(--color-v2-ink)]"
      >
        <span className="text-[24px] text-[var(--color-tier-ultimate)] [font-family:var(--font-v2-mono)]">
          {PANES[4].glyph}
        </span>
        <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-ui)]">
          {PANES[4].label} — fate
        </span>
      </button>
    </div>
  );
}

function PackStage({ universe }: { universe: string | null }) {
  const cards = listCards();
  // Rigged: pull the marquee from the chosen Universe.
  const pulled = cards.find((c) => c.universe === universe) ?? cards[0];
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <p className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-mono)]">
        Sample pack — Rare+ guaranteed
      </p>
      <div className="mt-6 w-full max-w-[280px] aspect-[2/3] relative overflow-hidden border border-[var(--color-tier-ultimate)] tier-frame-ultimate pack-reveal">
        <Image
          src={pulled.heroArtUrl}
          alt={pulled.figureName}
          fill
          priority
          sizes="280px"
          className="object-cover"
        />
      </div>
      <p className="mt-6 text-[18px] italic text-[var(--color-v2-text)] [font-family:var(--font-pullquote)]">
        there.
      </p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-v2-text-muted)] [font-family:var(--font-v2-mono)]">
        added to your binder
      </p>
      <style>{`
        @keyframes pack-reveal {
          0% { opacity: 0; transform: scale(0.94); }
          100% { opacity: 1; transform: scale(1); }
        }
        .pack-reveal { animation: pack-reveal 1.6s ease-out; }
        @media (prefers-reduced-motion: reduce) { .pack-reveal { animation: none; } }
      `}</style>
    </div>
  );
}

function LatticeStage({ chosen }: { chosen: string | null }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="relative w-full max-w-[340px] aspect-[2/3] overflow-hidden">
        <Image
          src="/v2/lattice-painting.webp"
          alt="The Lattice"
          fill
          sizes="(max-width: 340px) 100vw, 340px"
          className="object-cover lattice-fade"
        />
      </div>
      <div className="mt-6 max-w-[320px] mx-auto text-center">
        <p className="text-[16px] leading-[24px] italic text-[var(--color-v2-text)] [font-family:var(--font-pullquote)]">
          Five Panes. Five doors. The fifth one is for you to find.
        </p>
        <p className="mt-3 text-[13px] leading-[20px] text-[var(--color-v2-text-dim)] [font-family:var(--font-body)]">
          We send a journal — one chapter a day from somewhere across the
          Lattice. You’ll know when you’ve found the fifth door.
        </p>

        <form
          action="/api/v2-journal-subscribe"
          method="post"
          className="mt-6 flex flex-col gap-3"
        >
          <input
            type="email"
            name="email"
            placeholder="your.email@anywhere.com"
            required
            className="w-full px-3 py-3 bg-[var(--color-v2-ink)] border border-[var(--color-v2-rule)] focus:border-[var(--color-tier-ultimate)] outline-none text-[14px] text-[var(--color-v2-text)] [font-family:var(--font-v2-ui)]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[var(--color-tier-ultimate)] text-[var(--color-v2-ground)] uppercase tracking-[0.18em] text-[12px] [font-family:var(--font-v2-ui)] hover:opacity-90 transition-opacity"
          >
            Send me the Journal
          </button>
        </form>

        <p className="mt-4 text-[11px] italic text-[var(--color-v2-text-muted)] [font-family:var(--font-pullquote)]">
          This is how Lampblack moves between the Panes.
        </p>

        <Link
          href={`/v2/card/${marqueeFor(chosen)}`}
          className="mt-8 inline-block text-[11px] uppercase tracking-[0.2em] text-[var(--color-v2-text-dim)] hover:text-[var(--color-v2-text)] transition-colors [font-family:var(--font-v2-mono)]"
        >
          → see your pull
        </Link>
      </div>
      <style>{`
        @keyframes lattice-fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .lattice-fade { animation: lattice-fade 2s ease-out; }
        @media (prefers-reduced-motion: reduce) { .lattice-fade { animation: none; } }
      `}</style>
    </div>
  );
}

function marqueeFor(universe: string | null): string {
  switch (universe) {
    case 'baker-street':
      return 'bs-last-bow';
    case 'enchanted-kingdom':
      return 'ek-footnoter-reveals';
    case 'wonderland':
      return 'wl-alice-through-glass';
    case 'gothic-horror':
      return 'gh-ledger-keeper-opens';
    case 'greek-myth':
    default:
      return 'gm-sixth-seed';
  }
}
