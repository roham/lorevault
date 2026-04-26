import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LATTICE_CARDS } from '@/lib/lattice-cards';

const SETS: Record<
  string,
  {
    setKey: string;
    name: string;
    universe: string;
    seriesLabel: string;
    dropDate: string;
    tagline: string;
  }
> = {
  bs1: {
    setKey: 'Baker Street · BS-1',
    name: 'The Argument Pane',
    universe: 'Baker Street',
    seriesLabel: 'Series 1 · BS-1',
    dropDate: '2 May 2026 — 1pm ET',
    tagline:
      'Twenty Moments from the rooms where the argument lives. Watson narrated. Lampblack-residue in every frame.',
  },
};

const TIER_ORDER = ['Ultimate', 'Legendary', 'Rare', 'Common'] as const;

const TIER_COLOR_VAR: Record<string, string> = {
  Ultimate: 'var(--color-tier-ultimate)',
  Legendary: 'var(--color-tier-legendary)',
  Rare: 'var(--color-tier-rare)',
  Common: 'var(--color-tier-common)',
};

const TIER_FRAME_CLASS: Record<string, string> = {
  Ultimate: 'tier-frame-ultimate',
  Legendary: 'tier-frame-legendary',
  Rare: 'tier-frame-rare',
  Common: 'tier-frame-common',
};

export async function generateStaticParams() {
  return Object.keys(SETS).map((id) => ({ id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const set = SETS[id];
  if (!set) return { title: 'LoreVault' };
  return {
    title: `${set.name} — ${set.universe} · LoreVault`,
    description: set.tagline,
  };
}

export default async function SetPage({ params }: PageProps) {
  const { id } = await params;
  const set = SETS[id];
  if (!set) notFound();

  const cards = LATTICE_CARDS.filter((c) => c.set === set.setKey);

  const byTier = TIER_ORDER.reduce<Record<string, typeof LATTICE_CARDS>>((acc, tier) => {
    const matching = cards.filter((c) => c.tier === tier);
    if (matching.length) acc[tier] = matching;
    return acc;
  }, {});

  const tierCounts = TIER_ORDER.filter((t) => byTier[t]).map((t) => ({
    tier: t,
    count: byTier[t].length,
  }));

  const PACKS = [
    { tier: 'Sample', price: '$0', desc: '1 Common — earned by 7 reading days', href: '/v2/open' },
    { tier: 'Standard', price: '$9', desc: '3 Moments · sequential reveal · Lampblack-residue trails', href: null },
    { tier: 'Curated', price: '$49', desc: '5 Moments · ≥1 Rare · Lampblacker-Spine speaks', href: null },
    { tier: 'Premium', price: '$199', desc: '6 Moments · ≥1 Legendary · Council seat confirmation', href: null },
    {
      tier: 'Apex',
      price: '$999',
      desc: '≥1 Legendary + 1 Parallel · 10% Ultimate chance · caps 100 per Series',
      href: null,
    },
  ];

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{
        backgroundColor: 'var(--color-v2-ground)',
        color: 'var(--color-v2-text)',
      }}
    >
      <header
        className="px-5 pt-8 pb-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--color-v2-rule)' }}
      >
        <Link
          href="/v2"
          className="text-xs tracking-[0.2em] uppercase hover:opacity-100 transition-opacity"
          style={{
            fontFamily: 'var(--font-v2-mono)',
            color: 'var(--color-v2-text-dim)',
            opacity: 0.7,
          }}
        >
          ← LoreVault
        </Link>
        <Link
          href="/v2/lattice"
          className="text-[10px] tracking-[0.15em] uppercase transition-opacity hover:opacity-100"
          style={{
            fontFamily: 'var(--font-v2-mono)',
            color: 'var(--color-v2-text-muted)',
            opacity: 0.6,
          }}
        >
          Lattice
        </Link>
      </header>

      <main className="flex-1 px-5 pb-16">
        <div className="max-w-[380px] mx-auto w-full mt-6">

          {/* Set identity */}
          <div className="mb-8">
            <p
              className="text-[9px] tracking-[0.3em] uppercase mb-2"
              style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)' }}
            >
              {set.universe} · {set.seriesLabel}
            </p>
            <h1
              className="text-[28px] leading-tight"
              style={{ fontFamily: 'var(--font-pullquote)', color: 'var(--color-v2-text)' }}
            >
              {set.name}
            </h1>
            <p
              className="mt-3 text-[11px] leading-relaxed max-w-[300px]"
              style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-dim)' }}
            >
              {set.tagline}
            </p>
            <p
              className="mt-3 text-[9px] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-tier-ultimate)' }}
            >
              {set.dropDate}
            </p>
          </div>

          {/* Rarity distribution */}
          <div className="flex flex-wrap gap-2 mb-10">
            {tierCounts.map(({ tier, count }) => (
              <span
                key={tier}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] tracking-[0.12em] uppercase"
                style={{
                  fontFamily: 'var(--font-v2-mono)',
                  border: '1px solid var(--color-v2-rule)',
                }}
              >
                <span style={{ color: TIER_COLOR_VAR[tier] }}>{tier}</span>
                <span style={{ color: 'var(--color-v2-text-muted)' }}>× {count}</span>
              </span>
            ))}
          </div>

          {/* Card grid, grouped by tier */}
          {TIER_ORDER.filter((t) => byTier[t]).map((tier) => (
            <section key={tier} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[9px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'var(--font-v2-mono)', color: TIER_COLOR_VAR[tier] }}
                >
                  {tier}
                </span>
                <div className="flex-1" style={{ borderTop: '1px solid var(--color-v2-rule)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {byTier[tier].map((card) => (
                  <Link key={card.id} href={`/v2/card/${card.id}`} className="group block">
                    <div
                      className={`relative aspect-[2/3] overflow-hidden ${TIER_FRAME_CLASS[tier]}`}
                    >
                      <Image
                        src={card.imagePath}
                        alt={card.imageAlt}
                        fill
                        className="object-cover transition-opacity group-hover:opacity-90"
                        sizes="(max-width: 420px) 44vw, 170px"
                      />
                    </div>
                    <p
                      className="mt-1.5 text-[10px] leading-tight line-clamp-2 transition-colors group-hover:opacity-100"
                      style={{
                        fontFamily: 'var(--font-v2-mono)',
                        color: 'var(--color-v2-text-dim)',
                        opacity: 0.85,
                      }}
                    >
                      {card.name}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* Pack pricing */}
          <div
            className="mt-2 pt-8"
            style={{ borderTop: '1px solid var(--color-v2-rule)' }}
          >
            <p
              className="text-[9px] tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)' }}
            >
              Open a Pack
            </p>
            <div className="flex flex-col">
              {PACKS.map(({ tier, price, desc, href }) => {
                const isLive = !!href;
                const inner = (
                  <>
                    <div>
                      <p
                        className="text-[12px]"
                        style={{
                          fontFamily: 'var(--font-v2-mono)',
                          color: isLive ? 'var(--color-v2-text)' : 'var(--color-v2-text-dim)',
                        }}
                      >
                        {tier}
                      </p>
                      <p
                        className="text-[9px] mt-0.5 leading-relaxed"
                        style={{
                          fontFamily: 'var(--font-v2-mono)',
                          color: isLive ? 'var(--color-v2-text-dim)' : 'var(--color-v2-text-muted)',
                        }}
                      >
                        {desc}
                      </p>
                    </div>
                    <p
                      className="text-[12px] shrink-0"
                      style={{
                        fontFamily: 'var(--font-v2-mono)',
                        color: isLive ? 'var(--color-tier-ultimate)' : 'var(--color-v2-text-muted)',
                      }}
                    >
                      {price}
                    </p>
                  </>
                );

                return (
                  <div
                    key={tier}
                    className="py-3"
                    style={{ borderBottom: '1px solid var(--color-v2-rule)' }}
                  >
                    {href ? (
                      <Link href={href} className="flex items-start justify-between gap-3">
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-start justify-between gap-3">{inner}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <p
              className="mt-4 text-[9px] leading-relaxed"
              style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.5 }}
            >
              Purchase flow live at Series 1 launch · 2 May 2026
            </p>
          </div>

        </div>
      </main>

      <footer className="px-5 py-6" style={{ borderTop: '1px solid var(--color-v2-rule)' }}>
        <p
          className="text-[9px] tracking-[0.15em] uppercase text-center"
          style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.4 }}
        >
          Series 1 · The Glass Catches Light · v2
        </p>
      </footer>
    </div>
  );
}
