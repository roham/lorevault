'use client';

import type { CSSProperties } from 'react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  PANE_LIST,
  PANES,
  MOCK_CARDS,
  PANE_COLORS,
  SURFACE,
  TEXT,
  TYPE,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  Card,
  Pack,
  PaneAxiomBlock,
  IcebergViewer,
  ProgressIndicator,
  type PackState,
  type PaneId,
} from '@/components/mlp';
import type { Card as CardType } from '@/components/mlp/types';

type ScreenIndex = 1 | 2 | 3 | 4 | 5;

// HARD RULE: 5 screens. Not 6. Not "5 + a loading screen."

function OnboardingInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPane = searchParams?.get('pane') as PaneId | null;
  const validInitial = initialPane && PANES[initialPane] ? initialPane : null;
  // If a Pane was preselected from /mlp tile, jump straight to screen 2.
  const [screen, setScreen] = useState<ScreenIndex>(validInitial ? 2 : 1);
  const [chosenPane, setChosenPane] = useState<PaneId | null>(validInitial);

  // Pack state for screens 2–3
  const [packState, setPackState] = useState<PackState>('sealed');

  // If somehow we land on a pane-dependent screen without a chosen pane,
  // bounce back to screen 1 via effect (state mutation in render is illegal).
  useEffect(() => {
    if (screen > 1 && !chosenPane) setScreen(1);
  }, [screen, chosenPane]);

  // Determine the pulled cards for the chosen Pane (rigged: 2 commons + 1 rare+).
  const pulledCards: CardType[] = useMemo(() => {
    if (!chosenPane) return [];
    const fromPane = MOCK_CARDS.filter((c) => c.pane === chosenPane);
    // Guarantee: 1 rare/legendary, 2 fillers (use any from same pane, falling back to seed)
    const rare = fromPane.find((c) => c.rarity === 'rare' || c.rarity === 'legendary' || c.rarity === 'contraband');
    const others = fromPane.filter((c) => c.id !== rare?.id);
    const set: CardType[] = [];
    if (others[0]) set.push(others[0]);
    if (rare) set.push(rare);
    if (others[1]) set.push(others[1]);
    // If we don't have 3, pad with whatever exists
    while (set.length < 3 && fromPane.length > 0) {
      set.push(fromPane[set.length % fromPane.length]);
    }
    return set.slice(0, 3);
  }, [chosenPane]);

  const rarestCard = useMemo(() => {
    const ranking = ['contraband', 'legendary', 'rare', 'uncommon', 'common'];
    return [...pulledCards].sort(
      (a, b) => ranking.indexOf(a.rarity) - ranking.indexOf(b.rarity),
    )[0];
  }, [pulledCards]);

  const root: CSSProperties = {
    background: SURFACE.void,
    color: TEXT.primary,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const stepBar: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    background: 'rgba(10,9,7,0.92)',
    backdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${SURFACE.rule}`,
    padding: '0.7rem 1.1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const stepDot = (i: ScreenIndex): CSSProperties => ({
    height: 3,
    flex: 1,
    background: i <= screen ? '#C9A26B' : 'rgba(244,239,227,0.08)',
    borderRadius: 999,
    transition: 'background 250ms ease',
  });

  const stepLabel: CSSProperties = {
    ...TYPE.meta,
    color: TEXT.muted,
    fontSize: '0.55rem',
  };

  const screenWrap: CSSProperties = {
    flex: 1,
    padding: '1.5rem 1.1rem',
    paddingBottom: 'calc(1.1rem + env(safe-area-inset-bottom, 0px))',
    maxWidth: 720,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const headline: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
    lineHeight: 1.2,
    margin: 0,
    marginBottom: '0.4rem',
  };

  const dek: CSSProperties = {
    ...TYPE.bodySmall,
    color: TEXT.body,
    fontSize: '0.95rem',
    margin: 0,
    marginBottom: '0.5rem',
  };

  // ─── Screen 1 — Pane choice ──────────────────────────────────────────────
  if (screen === 1) {
    return (
      <div style={root}>
        <div style={stepBar}>
          <span style={stepLabel}>Step 1 of 5</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={stepDot(i as ScreenIndex)} />
          ))}
        </div>
        <div style={screenWrap}>
          <h1 style={headline}>Which world calls you?</h1>
          <p style={dek}>
            Tap a Pane. The first card you pull will come from there.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            {PANE_LIST.map((pane) => {
              const sample = MOCK_CARDS.find((c) => c.pane === pane.id);
              const color = PANE_COLORS[pane.id];
              const tile: CSSProperties = {
                background: color.gradient,
                border: `1px solid ${SURFACE.rule}`,
                borderLeft: `3px solid ${color.accent}`,
                borderRadius: 4,
                padding: '1.1rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                textAlign: 'left' as const,
                width: '100%',
              };
              return (
                <button
                  key={pane.id}
                  type="button"
                  style={tile}
                  onClick={() => {
                    setChosenPane(pane.id);
                    setScreen(2);
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    {sample ? (
                      <Card card={sample} size="sm" showLampblackOnHover={false} />
                    ) : (
                      <div style={{ width: 96, height: 134, background: color.accent + '22', borderRadius: 4 }} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.6rem' }}>
                      {pane.displayName}
                    </span>
                    <p
                      style={{
                        ...TYPE.italic,
                        color: TEXT.primary,
                        fontSize: '0.95rem',
                        lineHeight: 1.35,
                        margin: 0,
                      }}
                    >
                      "{pane.axiom}"
                    </p>
                    <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>
                      Register · {pane.register}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Screen 2 — Sealed pack ──────────────────────────────────────────────
  if (screen === 2) {
    if (!chosenPane) {
      // Defensive — useEffect above will bounce us back to screen 1
      return null;
    }
    const pane = PANES[chosenPane];
    return (
      <div style={root}>
        <div style={stepBar}>
          <span style={stepLabel}>Step 2 of 5</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={stepDot(i as ScreenIndex)} />
          ))}
        </div>
        <div style={screenWrap}>
          <h1 style={headline}>Your first pack from {pane.displayName}.</h1>
          <p style={dek}>It is sealed. Three cards inside. One of them is for you to keep close.</p>
          <Pack
            pane={pane}
            cards={pulledCards}
            state={packState}
            onTapSealed={() => {
              setPackState('opening');
              setScreen(3);
            }}
          />
          <button
            type="button"
            style={BUTTON_PRIMARY}
            onClick={() => {
              setPackState('opening');
              setScreen(3);
            }}
          >
            Open it →
          </button>
        </div>
      </div>
    );
  }

  // ─── Screen 3 — Pack opening + reveal ────────────────────────────────────
  if (screen === 3) {
    if (!chosenPane) {
      return null;
    }
    const pane = PANES[chosenPane];
    return (
      <div style={root}>
        <div style={stepBar}>
          <span style={stepLabel}>Step 3 of 5</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={stepDot(i as ScreenIndex)} />
          ))}
        </div>
        <div style={screenWrap}>
          <h1 style={headline}>The pack opens.</h1>
          <Pack
            pane={pane}
            cards={pulledCards}
            state={packState}
            onOpened={() => setPackState('revealed')}
            onAllRevealed={() => {
              // After all 3 revealed, show the next-step button below
            }}
          />
          {packState === 'revealed' ? (
            <button
              type="button"
              style={BUTTON_PRIMARY}
              onClick={() => setScreen(4)}
            >
              What is this card? →
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // ─── Screen 4 — Card depth (iceberg) ─────────────────────────────────────
  if (screen === 4) {
    if (!rarestCard) {
      return null;
    }
    return (
      <div style={root}>
        <div style={stepBar}>
          <span style={stepLabel}>Step 4 of 5</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={stepDot(i as ScreenIndex)} />
          ))}
        </div>
        <div style={screenWrap}>
          <h1 style={headline}>The card you pulled has weight.</h1>
          <p style={dek}>Most of it is buried. Reach for it.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card card={rarestCard} size="lg" showLampblackOnHover={false} />
          </div>
          <IcebergViewer
            surface={rarestCard.iceberg.surface}
            echo={rarestCard.iceberg.echo}
            deep={rarestCard.iceberg.deep}
          />
          <button
            type="button"
            style={BUTTON_PRIMARY}
            onClick={() => setScreen(5)}
          >
            Begin your set →
          </button>
        </div>
      </div>
    );
  }

  // ─── Screen 5 — Set hook ─────────────────────────────────────────────────
  if (screen === 5) {
    if (!chosenPane) {
      return null;
    }
    const pane = PANES[chosenPane];
    const setName = `${pane.displayName} Starter Set`;
    const total = chosenPane === 'lud-border' ? 12 : chosenPane === 'old-ones-persist' ? 10 : 11;
    const owned = 1; // first card

    // Show two missing-card silhouettes from the same Pane (excluding pulled)
    const otherCards = MOCK_CARDS.filter((c) => c.pane === chosenPane).slice(0, 2);

    return (
      <div style={root}>
        <div style={stepBar}>
          <span style={stepLabel}>Step 5 of 5</span>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={stepDot(i as ScreenIndex)} />
          ))}
        </div>
        <div style={screenWrap}>
          <h1 style={headline}>You have started a set.</h1>
          <p style={dek}>
            One card down. {total - owned} to go. The set is what makes a card a step.
          </p>

          <ProgressIndicator pane={pane} setName={setName} owned={owned} total={total} />

          <div>
            <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem', marginBottom: '0.6rem' }}>
              Missing from your collection
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
              {otherCards.map((c) => (
                <div
                  key={c.id}
                  style={{
                    width: 110,
                    aspectRatio: '5 / 7',
                    background: PANE_COLORS[c.pane].gradient,
                    border: `1px dashed ${PANE_COLORS[c.pane].accent}66`,
                    borderRadius: 4,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '0.55rem',
                  }}
                >
                  <span
                    style={{
                      ...TYPE.italic,
                      color: TEXT.muted,
                      fontSize: '0.7rem',
                      lineHeight: 1.25,
                    }}
                  >
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <Link
              href={`/v3/mlp/market?set=${pane.id}-starter`}
              style={{
                ...BUTTON_PRIMARY,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Find them in the market →
            </Link>
            <Link
              href="/v3/mlp/vault"
              style={{
                ...BUTTON_SECONDARY,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Explore your collection →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div style={{ background: SURFACE.void, minHeight: '100vh' }} />}>
      <OnboardingInner />
    </Suspense>
  );
}
