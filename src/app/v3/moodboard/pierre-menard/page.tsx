'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import manifest from '../_manifest.json';

const PM_IDS = [
  'lud-border-001',
  'old-ones-persist-001',
  'sinterklaas-reigns-001',
  'holmes-canonical-london-001',
];

const PANE_NAMES: Record<string, string> = {
  'lud-border':              'Lud-Border',
  'old-ones-persist':        'Old-Ones-Persist',
  'sinterklaas-reigns':      'Sinterklaas-Reigns',
  'holmes-canonical-london': 'Holmes-Canonical-London',
};

const READING: Record<string, string> = {
  'lud-border':
    'Civic mercy. The customs officer knows. The form does not ask. Refusing ignorance maintains the knowledge the form cannot hold.',
  'old-ones-persist':
    'Cosmological appetite. The cataloguer who refuses to be ignorant of what the catalogue already contains becomes the sentence the Old Ones were waiting to hear said.',
  'sinterklaas-reigns':
    'Witnessing-responsibility. Without the witness-figure, moral events cannot achieve cosmological permanence. The refusal is the act that makes the world’s acts real.',
  'holmes-canonical-london':
    'The unpublished case. Watson refused to be ignorant of what Holmes deduced. He chose, with full knowledge, not to publish it.',
};

const cardsForIds = PM_IDS.map((id) => manifest.find((c) => c.id === id)!);

export default function PierreMenardPage() {
  const [active, setActive] = useState(0);

  // Auto-advance every 5s; pause on hover via stop on a wrapper later
  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => (v + 1) % cardsForIds.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const card = cardsForIds[active];
  const paneName = PANE_NAMES[card.pane];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero — full-bleed image swap */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-black">
        {cardsForIds.map((c, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={c.id}
            src={`/v3/cards/${c.pane}/${c.id}/hero.png`}
            alt={`${PANE_NAMES[c.pane]} — ${c.name}`}
            className={[
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
              i === active ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent pt-32 pb-10">
          <div className="mx-auto max-w-3xl px-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-amber-400">
              Pierre-Menard · same words, four worlds
            </p>
            <blockquote className="text-2xl font-medium italic leading-snug text-zinc-100 sm:text-3xl">
              &ldquo;I refused to be ignorant of what was already known.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12">
        <Link
          href="/v3/moodboard"
          className="mb-10 inline-block text-xs uppercase tracking-widest text-zinc-500 no-underline transition-colors hover:text-zinc-300"
        >
          ← The Moodboard
        </Link>

        {/* Active reading — fades with the image */}
        <div key={card.id} className="mb-12 animate-fade">
          <p className="mb-2 text-xs uppercase tracking-widest text-amber-400">
            {paneName}
          </p>
          <h2 className="mb-4 text-3xl font-medium italic leading-tight text-zinc-100">
            {card.name}
          </h2>
          <p className="border-l-2 border-amber-500/50 pl-4 text-lg leading-relaxed text-zinc-300">
            {READING[card.pane]}
          </p>
        </div>

        {/* Pane chips — manual select */}
        <div className="mb-16 flex flex-wrap gap-2">
          {cardsForIds.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(i)}
              className={[
                'rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors',
                i === active
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200',
              ].join(' ')}
            >
              {PANE_NAMES[c.pane]}
            </button>
          ))}
        </div>

        {/* Why this is the doctrine */}
        <section className="border-t border-zinc-800 pt-10">
          <h2 className="mb-4 text-2xl font-medium italic text-zinc-100">
            Same words. Four grammars. Four meanings.
          </h2>
          <p className="mb-4 leading-relaxed text-zinc-300">
            A setting approach to worldbuilding produces four cards with four different
            axioms, each describing what its world is like. The Pierre-Menard set does
            the opposite: it fixes the axiom and varies the world.
          </p>
          <p className="leading-relaxed text-zinc-400">
            This is what Panes are. Not different places with different aesthetics.
            Different grammars that transform the meaning of identical acts.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-6 border-t border-zinc-800 pt-8 text-sm">
          <Link
            href={`/v3/moodboard/${card.pane}/${card.id}`}
            className="text-amber-400 no-underline transition-colors hover:text-amber-300"
          >
            Read the full card &rarr;
          </Link>
          <Link
            href="/v3/gdd-v2"
            className="text-zinc-400 no-underline transition-colors hover:text-zinc-200"
          >
            The doctrine &rarr;
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fadeIn 600ms ease-out;
        }
      `}</style>
    </div>
  );
}
