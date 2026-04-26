'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LATTICE_CARDS } from '@/lib/lattice-cards';

const BS1_COMMONS = LATTICE_CARDS.filter(
  (c) => c.set === 'Baker Street · BS-1' && c.tier === 'Common'
);
const UTC_MS_PER_DAY = 86_400_000;

export default function RevealPage() {
  const [phase, setPhase] = useState<'back' | 'flipping' | 'front'>('back');

  const dayIndex = Math.floor(Date.now() / UTC_MS_PER_DAY);
  const card = BS1_COMMONS[dayIndex % BS1_COMMONS.length];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('flipping'), 800);
    const t2 = setTimeout(() => setPhase('front'), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const isFlipped = phase === 'flipping' || phase === 'front';
  const showContent = phase === 'front';

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ backgroundColor: 'var(--color-v2-ground)', color: 'var(--color-v2-text)' }}
    >
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/v2/open"
          className="text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-100"
          style={{
            fontFamily: 'var(--font-v2-mono)',
            color: 'var(--color-v2-text-dim)',
            opacity: 0.7,
          }}
        >
          ← Back
        </Link>
        <p
          className="text-[10px] tracking-[0.15em] uppercase"
          style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.5 }}
        >
          Sample Pack
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center px-5 pb-16">
        <div className="w-full max-w-[320px] mt-6">

          {/* Pre-launch note */}
          <p
            className="text-[9px] tracking-[0.2em] uppercase text-center mb-6"
            style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-tier-ultimate)', opacity: 0.6 }}
          >
            Preview · Full mechanics live 2 May 2026
          </p>

          {/* Card flip container */}
          <div
            style={{ perspective: '1200px' }}
            className="relative w-full max-w-[220px] mx-auto"
          >
            <div
              className="relative aspect-[2/3]"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* BACK face */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: '#0f0e0c',
                  border: '1px solid var(--color-v2-rule)',
                }}
              >
                <p
                  className="text-[9px] tracking-[0.3em] uppercase"
                  style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.4 }}
                >
                  Sample
                </p>
                <div
                  className="w-8"
                  style={{ height: '1px', backgroundColor: 'var(--color-v2-rule)' }}
                />
                <p
                  className="text-[28px]"
                  style={{ fontFamily: 'var(--font-pullquote)', color: 'var(--color-v2-text-muted)', opacity: 0.25 }}
                >
                  ◆
                </p>
                <div
                  className="w-8"
                  style={{ height: '1px', backgroundColor: 'var(--color-v2-rule)' }}
                />
                <p
                  className="text-[8px] tracking-[0.25em] uppercase"
                  style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.2 }}
                >
                  LoreVault
                </p>
              </div>

              {/* FRONT face */}
              <div
                className="absolute inset-0 tier-frame-common overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src={card.imagePath}
                  alt={card.imageAlt}
                  fill
                  className="object-cover"
                  sizes="220px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Card info — fades in after reveal */}
          <div
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <div className="mt-5 text-center">
              <p
                className="text-[9px] tracking-[0.15em] uppercase mb-1"
                style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-tier-common)' }}
              >
                {card.tier} · {card.shell} · Baker Street · BS-1
              </p>
              <h2
                className="text-[18px] leading-tight"
                style={{ fontFamily: 'var(--font-pullquote)', color: 'var(--color-v2-text)' }}
              >
                {card.name}
              </h2>
            </div>

            <div
              className="mt-5 pl-4"
              style={{ borderLeft: '2px solid var(--color-v2-rule)' }}
            >
              <p
                className="text-[11px] italic leading-relaxed"
                style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-dim)' }}
              >
                &ldquo;{card.flavor}&rdquo;
              </p>
              {card.flavorAttrib && (
                <p
                  className="mt-1 text-[9px]"
                  style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)' }}
                >
                  — {card.flavorAttrib}
                </p>
              )}
            </div>

            <div className="mt-6">
              <p
                className="text-[9px] tracking-[0.2em] uppercase mb-2"
                style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.5 }}
              >
                Lampblack Detail
              </p>
              <p
                className="text-[10px] leading-relaxed"
                style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)' }}
              >
                {card.echo}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={`/v2/card/${card.id}`}
                className="block text-center text-[10px] tracking-[0.15em] uppercase py-2.5 transition-colors"
                style={{
                  fontFamily: 'var(--font-v2-mono)',
                  color: 'var(--color-v2-text)',
                  border: '1px solid var(--color-tier-common)',
                }}
              >
                Full iceberg →
              </Link>
              <Link
                href="/v2/set/bs1"
                className="block text-center text-[10px] tracking-[0.15em] uppercase py-2.5 transition-colors"
                style={{
                  fontFamily: 'var(--font-v2-mono)',
                  color: 'var(--color-v2-text-dim)',
                  border: '1px solid var(--color-v2-rule)',
                }}
              >
                See all 20 Moments →
              </Link>
            </div>

            <p
              className="mt-6 text-center text-[9px] leading-relaxed"
              style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.4 }}
            >
              Binder and ownership live at Series 1 launch · 2 May 2026
            </p>
          </div>

        </div>
      </main>

      <footer className="px-5 py-6" style={{ borderTop: '1px solid var(--color-v2-rule)' }}>
        <p
          className="text-[9px] tracking-[0.15em] uppercase text-center"
          style={{ fontFamily: 'var(--font-v2-mono)', color: 'var(--color-v2-text-muted)', opacity: 0.3 }}
        >
          Series 1 · The Glass Catches Light · v2
        </p>
      </footer>
    </div>
  );
}
