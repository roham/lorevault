'use client';

import { useEffect, useState } from 'react';

type Card = {
  n: number;
  art: string;
  universe: string;
  set: string;
  series: number;
  drop: string;
  moment: string;
  tier: 'Common' | 'Rare' | 'Legendary' | 'Ultimate';
  shell: string;
  parallel: string;
  mint: number;
  elemental: string;
  archetype: string;
  flavor: string;
  attribution?: string;
  lore: string;
  lampblack: { silhouette: string; props: string; gesture: string; spine: string };
  tether?: string;
  accent: string; // CSS color for universe accent
  parallelGlow: string; // CSS for parallel signature
};

const CARDS: Card[] = [
  {
    n: 1,
    art: '/prototype-art/exemplars/1-watson-deduction.webp',
    universe: 'Baker Street',
    set: 'BS-1 "221B"',
    series: 1,
    drop: 'Month 1 — launch',
    moment: 'The Wound on the Mantelpiece',
    tier: 'Common',
    shell: 'PRIME',
    parallel: 'base',
    mint: 15000,
    elemental: 'REASON',
    archetype: 'A1 — The Deduction',
    flavor: 'You have been in Afghanistan, I perceive.',
    attribution: 'Holmes, quoted by Watson, casebook',
    lore: 'The cane in the corner of the frame is not the one Watson carried home. The first one was lost on the train from Portsmouth, and the man who found it has not, to date, returned it.',
    lampblack: {
      silhouette: 'Watson three-quarter to camera; Holmes hawkish profile',
      props: 'Briar pipe at rest beside service revolver; deerstalker on the hat-stand',
      gesture: 'Holmes\' temple-fingertip pause; Watson\'s hand on the Afghanistan thigh',
      spine: 'Holmes deduces a man\'s past from a single object; Watson chronicles',
    },
    accent: 'rgb(210, 140, 50)',
    parallelGlow: 'transparent',
  },
  {
    n: 2,
    art: '/prototype-art/exemplars/2-snow-black-neon.webp',
    universe: 'Enchanted Kingdom',
    set: 'EK-6 "Snow Black"',
    series: 2,
    drop: 'Month 16',
    moment: 'The Apple Offered the Other Way',
    tier: 'Rare',
    shell: 'MIRROR',
    parallel: 'NEON',
    mint: 50,
    elemental: 'FATE',
    archetype: 'A4 — The Curse',
    flavor: 'Skin of dusk and lip of fire. The glass holds what the heart held higher.',
    attribution: 'marginalia, found in a borrowed book',
    lore: 'The apothecary in the background trades in three apples, not one. The other two have been bitten before, in a different orchard, by hands that did not survive the bite.',
    lampblack: {
      silhouette: 'Young human form with the Snow-tricolor inverted (dusk skin, white hair, blood lips)',
      props: 'The half-bitten apple — same bite-edge as EK-4',
      gesture: 'Receiving-the-offered-apple, the moment of the choice held',
      spine: 'A poisoned offering accepted from a familiar hand; transformation by ingestion',
    },
    tether: 'Echoes EK-4 "The Apple and the Mirror" via shared apple geometry',
    accent: 'rgb(210, 100, 140)',
    parallelGlow: 'linear-gradient(135deg, rgba(255,30,200,0.5), rgba(0,200,255,0.5))',
  },
  {
    n: 3,
    art: '/prototype-art/exemplars/3-cheshire-arcana.webp',
    universe: 'Wonderland',
    set: 'WL-5 "The Cheshire Question"',
    series: 2,
    drop: 'Month 15',
    moment: 'The Grin That Arrived First',
    tier: 'Rare',
    shell: 'DREAM',
    parallel: 'ARCANA',
    mint: 500,
    elemental: 'WONDER',
    archetype: 'A9 — The Wisecrack-That-Lands',
    flavor: 'I asked the cat where the door was. The cat answered, "Where it isn\'t is also a door, but a less convenient one."',
    attribution: 'court recorder of the Cheshire estate, undated',
    lore: 'There is a parlour in London, currently empty, that has reported a grin where no cat is. The Cheshire estate has not commented; the grin has not, to date, been removed.',
    lampblack: {
      silhouette: 'A grin in the air; a body that may or may not commit to being one',
      props: 'Violet-pink stripe; the tail as compositional period',
      gesture: 'Grin-arrives-first / body-leaves-after',
      spine: 'A liminal commentator answers the wrong question correctly',
    },
    accent: 'rgb(40, 180, 155)',
    parallelGlow: 'radial-gradient(circle at 50% 30%, rgba(220,180,80,0.55), transparent 65%)',
  },
  {
    n: 4,
    art: '/prototype-art/exemplars/4-dracula-witness.webp',
    universe: 'Gothic Horror',
    set: 'GH-5 "Dracula\'s Long Night"',
    series: 2,
    drop: 'Month 14',
    moment: 'The Census Resumes Without Witnesses',
    tier: 'Legendary',
    shell: 'HOLLOW',
    parallel: 'WITNESS',
    mint: 10,
    elemental: 'SHADOW',
    archetype: 'A6 — The Logbook',
    flavor: 'Day 5,847 since the lamps. He has counted all of them himself; the only voice that argued the count is now part of the count. The Lampblack thickens at the throat.',
    attribution: 'field notes, attributed the Lampblacker, undated',
    lore: 'The fingernail Dracula uses to keep the tally is not his own. The original wore through somewhere between the first thousand and the second, and he has been less than careful, since, about whose hand he borrows from.',
    lampblack: {
      silhouette: 'Tall, evening-dressed, alone in ruin',
      props: 'The wall-tally past 5,847; the worn collar catching last light',
      gesture: 'Adding a vertical scratch with a fingernail, head-down concentration',
      spine: 'The count of nights kept against time itself; loneliness as census-taking',
    },
    accent: 'rgb(190, 40, 50)',
    parallelGlow: 'linear-gradient(180deg, rgba(255,255,255,0.04), transparent)',
  },
  {
    n: 5,
    art: '/prototype-art/exemplars/5-persephone-saint-aether.webp',
    universe: 'Greek Myth',
    set: 'GM-10 "The Saint of Return"',
    series: 3,
    drop: 'Month 28',
    moment: 'The Patron of Return, Glimpsed in Two Seasons',
    tier: 'Ultimate',
    shell: 'SAINT',
    parallel: 'AETHER',
    mint: 3,
    elemental: 'FATE',
    archetype: 'A12 — The Echo',
    flavor: '…and so the third spring. She ate the seeds because she was hungry, and was hungry because she had eaten the seeds. The libation was poured before she asked. The Lampblack thickens, and she returns.',
    attribution: 'chorus, after the older fragment',
    lore: 'The threshold-stone underfoot is the same stone the wellhead at the back of Cinderella\'s cottage is cut from — a fact not yet known to either Pane, though the stone has been counting. Six seeds have been recorded; the seventh has not been spoken of, and will not be, this Series.',
    lampblack: {
      silhouette: 'Frontal hieratic icon, vertical winter/spring division at the sternum',
      props: 'Six pomegranate seeds — three eaten, three offered',
      gesture: 'Hand-extended-with-seeds; the threshold-stone underfoot',
      spine: 'Descent and return as ritual; the patron-of-cycles',
    },
    tether: 'Echoes GM-1 "The Descent" (the older fragment); threshold-stone tether to EK-12',
    accent: 'rgb(200, 165, 50)',
    parallelGlow: 'radial-gradient(ellipse at 50% 35%, rgba(120,200,255,0.45), rgba(170,120,220,0.25), transparent 70%)',
  },
];

const TIER_RING: Record<Card['tier'], string> = {
  Common: 'rgb(180, 175, 165)',
  Rare: 'rgb(110, 175, 230)',
  Legendary: 'rgb(220, 165, 80)',
  Ultimate: 'rgb(245, 215, 130)',
};

function CardView({ card }: { card: Card }) {
  return (
    <article
      className="relative w-full max-w-[1100px] mx-auto rounded-3xl overflow-hidden border bg-[#0d0e16]"
      style={{
        borderColor: `${card.accent.replace('rgb', 'rgba').replace(')', ',0.35)')}`,
      }}
    >
      {/* parallel glow on top edge */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: card.parallelGlow }}
      />

      <div className="grid md:grid-cols-[minmax(0,520px)_1fr] gap-0">
        {/* Art */}
        <div className="relative bg-black" style={{ aspectRatio: '2 / 3' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.art}
            alt={`${card.moment} — ${card.universe}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* parallel signature: subtle parallel-specific overlay */}
          {card.parallel !== 'base' && (
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ background: card.parallelGlow }} />
          )}
          {/* corner badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            <span
              className="px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] rounded-full bg-black/60 backdrop-blur border"
              style={{ borderColor: TIER_RING[card.tier], color: TIER_RING[card.tier] }}
            >
              {card.tier}
            </span>
            {card.parallel !== 'base' && (
              <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] rounded-full bg-black/70 backdrop-blur border border-white/15 text-white/85">
                {card.parallel}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <div
              className="text-[10px] uppercase tracking-[0.18em] rounded-full px-2.5 py-1 bg-black/60 backdrop-blur border border-white/10 tabular-nums"
              style={{ color: TIER_RING[card.tier] }}
            >
              ◊ /{card.mint.toLocaleString()}
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end gap-2 text-[10px] uppercase tracking-[0.18em]">
            <span className="text-white/60 px-2 py-1 rounded bg-black/50 backdrop-blur">{card.shell}</span>
            <span className="text-white/60 px-2 py-1 rounded bg-black/50 backdrop-blur">{card.elemental}</span>
          </div>
        </div>

        {/* Detail panel */}
        <div className="p-7 md:p-8 flex flex-col gap-5">
          <header className="flex flex-col gap-1.5">
            <div
              className="text-[10px] uppercase tracking-[0.25em] font-medium"
              style={{ color: card.accent }}
            >
              {card.universe} · {card.set} · Series {card.series}
            </div>
            <h2 className="text-2xl md:text-[28px] font-semibold leading-tight text-white">
              {card.moment}
            </h2>
            <div className="text-xs text-white/40">{card.drop}</div>
          </header>

          {/* Flavor — the hero quote */}
          <blockquote className="relative pl-5 border-l-2" style={{ borderColor: card.accent }}>
            <p className="text-white/90 italic text-[17px] leading-[1.55] font-serif" style={{ fontFamily: 'Georgia, serif' }}>
              &ldquo;{card.flavor}&rdquo;
            </p>
            {card.attribution && (
              <cite className="not-italic block mt-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                — {card.attribution}
              </cite>
            )}
          </blockquote>

          {/* Lore — the iceberg */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/35 mb-1.5">
              the iceberg
            </div>
            <p className="text-sm text-white/65 leading-relaxed">{card.lore}</p>
          </div>

          {/* Lampblack 4-layer stack */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/35 mb-2">
              Lampblack — 4-layer recognition stack
            </div>
            <dl className="grid grid-cols-2 gap-2.5 text-[12px]">
              {(['silhouette', 'props', 'gesture', 'spine'] as const).map((k) => (
                <div key={k} className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
                  <dt className="text-[9px] uppercase tracking-[0.22em] text-white/35 mb-1">
                    {k}
                  </dt>
                  <dd className="text-white/75 leading-snug">{card.lampblack[k]}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Tether */}
          {card.tether && (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-[11px] text-white/55">
              <span className="uppercase tracking-[0.22em] text-white/35 mr-2">tether</span>
              {card.tether}
            </div>
          )}

          {/* Foot meta */}
          <footer className="mt-auto pt-3 border-t border-white/5 flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] uppercase tracking-[0.18em] text-white/35">
            <span>{card.archetype}</span>
            <span>·</span>
            <span>shell {card.shell}</span>
            <span>·</span>
            <span>{card.elemental} elemental</span>
          </footer>
        </div>
      </div>
    </article>
  );
}

function CollectorCardView({ card }: { card: Card }) {
  return (
    <article
      className="relative w-full max-w-[460px] mx-auto rounded-3xl overflow-hidden border bg-[#0d0e16]"
      style={{
        borderColor: `${card.accent.replace('rgb', 'rgba').replace(')', ',0.4)')}`,
        boxShadow: `0 30px 80px -30px ${card.accent.replace('rgb', 'rgba').replace(')', ',0.35)')}`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: card.parallelGlow }}
      />
      <div className="relative bg-black" style={{ aspectRatio: '2 / 3' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.art} alt={`${card.moment} — ${card.universe}`} className="absolute inset-0 w-full h-full object-cover" />
        {card.parallel !== 'base' && (
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{ background: card.parallelGlow }} />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          <span
            className="px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] rounded-full bg-black/60 backdrop-blur border"
            style={{ borderColor: TIER_RING[card.tier], color: TIER_RING[card.tier] }}
          >
            {card.tier}
          </span>
          {card.parallel !== 'base' && (
            <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] rounded-full bg-black/70 backdrop-blur border border-white/15 text-white/85">
              {card.parallel}
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <div
            className="text-[10px] uppercase tracking-[0.18em] rounded-full px-2.5 py-1 bg-black/60 backdrop-blur border border-white/10 tabular-nums"
            style={{ color: TIER_RING[card.tier] }}
          >
            ◊ #{Math.ceil(card.mint / 7).toLocaleString()}/{card.mint.toLocaleString()}
          </div>
        </div>
        <div className="absolute bottom-3 right-3">
          <div className="text-[9px] uppercase tracking-[0.22em] rounded-full px-2 py-1 bg-black/55 backdrop-blur border border-white/10 text-white/60">
            ◇ {card.elemental}
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <header>
          <div
            className="text-[9px] uppercase tracking-[0.28em] font-medium mb-1"
            style={{ color: card.accent }}
          >
            {card.universe} · {card.set.replace(/^[A-Z]+-\d+\s+/, '')}
          </div>
          <h2 className="text-xl md:text-[22px] font-semibold leading-tight text-white">
            {card.moment}
          </h2>
        </header>
        <blockquote className="relative pl-4 border-l-2" style={{ borderColor: card.accent }}>
          <p className="text-white/90 italic text-[15px] leading-[1.5]" style={{ fontFamily: 'Georgia, serif' }}>
            &ldquo;{card.flavor}&rdquo;
          </p>
          {card.attribution && (
            <cite className="not-italic block mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white/40">
              — {card.attribution}
            </cite>
          )}
        </blockquote>
        <p className="text-[12px] text-white/50 leading-relaxed">{card.lore.split('.')[0]}.</p>
      </div>
    </article>
  );
}

export default function ExemplarsPage() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'collector' | 'canon'>('collector');
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <header className="max-w-[1100px] mx-auto px-6 pt-12 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
          LoreVault · Exemplar Cards v1.0
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Five cards. Five Universes. Five lenses.
        </h1>
        <p className="mt-4 text-white/60 max-w-2xl text-[15px] leading-relaxed">
          The system end-to-end. Toggle below to switch between what the collector sees on the
          card surface and the full Canon-Council audit view (shell, elemental, 4-layer Lampblack stack, tether, archetype).
        </p>
        <div className="mt-6 inline-flex p-1 rounded-full bg-white/5 border border-white/10">
          <button
            onClick={() => setView('collector')}
            className={`px-5 py-2 text-[11px] uppercase tracking-[0.22em] rounded-full transition ${
              view === 'collector' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Collector View
          </button>
          <button
            onClick={() => setView('canon')}
            className={`px-5 py-2 text-[11px] uppercase tracking-[0.22em] rounded-full transition ${
              view === 'canon' ? 'bg-white text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            Canon Council View
          </button>
        </div>
        <div className="mt-3 text-[11px] text-white/40">
          {view === 'collector'
            ? 'What the customer sees: art, name, tier, parallel, mint serial, elemental, the quote, one line of public lore.'
            : 'What the writing room and Council see: full system metadata including the 4-layer Lampblack recognition stack and cross-set tethers.'}
        </div>
      </header>

      <main className={`px-4 pb-24 ${view === 'collector' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1500px] mx-auto' : 'space-y-8'}`}>
        {mounted && CARDS.map((c) => view === 'collector' ? <CollectorCardView key={c.n} card={c} /> : <CardView key={c.n} card={c} />)}
        {!mounted && <div className="text-white/40 text-center py-20 col-span-full">Loading…</div>}
      </main>

      <footer className="text-center text-[10px] uppercase tracking-[0.22em] text-white/25 pb-12">
        Lattice and Lampblack · LoreVault Canon · 2026
      </footer>
    </div>
  );
}
