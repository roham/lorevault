'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  MLPShell,
  CURRENT_CONFLICT,
  PAST_CONFLICTS,
  MOCK_CARDS,
  PANE_COLORS,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  type Pane,
} from '@/components/mlp';
import type { Card as CardType } from '@/components/mlp/types';

type StakeStep = 'choose-pane' | 'choose-card' | 'confirm' | 'staked';

function useCountdown(target: string) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = new Date(target).getTime() - now;
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
    expired: false,
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function PlayPage() {
  const conflict = CURRENT_CONFLICT;
  const c = useCountdown(conflict.stakesCloseAt);

  const [step, setStep] = useState<StakeStep>('choose-pane');
  const [chosenPane, setChosenPane] = useState<Pane | null>(null);
  const [chosenCard, setChosenCard] = useState<CardType | null>(null);

  const userCardsForPane = useMemo(() => {
    if (!chosenPane) return [];
    return MOCK_CARDS.filter((card) => card.pane === chosenPane.id);
  }, [chosenPane]);

  const totalStakes = Object.values(conflict.stakeCount).reduce((s, n) => s + n, 0);

  return (
    <MLPShell title="Play">
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        {/* Event headline */}
        <section style={{ marginBottom: '1.5rem' }}>
          <span style={{ ...TYPE.meta, color: '#C9A26B', fontSize: '0.6rem' }}>
            Pane Prediction · weekly conflict
          </span>
          <h1 style={{ ...TYPE.italic, color: TEXT.primary, fontSize: 'clamp(1.55rem, 5vw, 2.2rem)', margin: '0.5rem 0 0.65rem', lineHeight: 1.18 }}>
            {conflict.name}
          </h1>
          <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.95rem', margin: 0, lineHeight: 1.55 }}>
            {conflict.description}
          </p>
        </section>

        {/* Countdown */}
        <section style={{ marginBottom: '1.5rem' }}>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginBottom: '0.5rem' }}>
            Stakes close in
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
            {[
              { n: c.days, l: 'days' },
              { n: c.hours, l: 'hours' },
              { n: c.minutes, l: 'min' },
              { n: c.seconds, l: 'sec' },
            ].map((seg) => (
              <div
                key={seg.l}
                style={{
                  background: SURFACE.card,
                  border: `1px solid ${SURFACE.rule}`,
                  borderRadius: 3,
                  padding: '0.6rem 0.4rem',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'monospace', fontSize: '1.4rem', color: TEXT.primary, fontVariantNumeric: 'tabular-nums', margin: 0 }}>
                  {pad(seg.n)}
                </p>
                <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.5rem', marginTop: '0.2rem' }}>{seg.l}</p>
              </div>
            ))}
          </div>
        </section>

        {step === 'staked' && chosenPane && chosenCard ? (
          <StakedConfirmation pane={chosenPane} card={chosenCard} conflictName={conflict.name} />
        ) : (
          <>
            {/* Two Pane tiles */}
            <section style={{ marginBottom: '1.5rem' }}>
              <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginBottom: '0.65rem' }}>
                Which Pane will hold? Stake one card from that side.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {conflict.panes.map((p) => {
                  const color = PANE_COLORS[p.id];
                  const stakes = conflict.stakeCount[p.id] ?? 0;
                  const sharePct = totalStakes > 0 ? Math.round((stakes / totalStakes) * 100) : 0;
                  const active = chosenPane?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setChosenPane(p);
                        setStep('choose-card');
                      }}
                      style={{
                        background: color.gradient,
                        border: `1px solid ${active ? color.accent : SURFACE.rule}`,
                        borderLeft: `3px solid ${color.accent}`,
                        borderRadius: 4,
                        padding: '1.1rem 1rem',
                        cursor: 'pointer',
                        textAlign: 'left' as const,
                        width: '100%',
                        transition: 'border-color 200ms ease, transform 150ms ease',
                        transform: active ? 'translateY(-2px)' : 'translateY(0)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                        <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.6rem' }}>{p.displayName}</span>
                        <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>
                          {stakes} cards staked · {sharePct}%
                        </span>
                      </div>
                      <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '0.98rem', lineHeight: 1.35, margin: '0 0 0.7rem 0' }}>
                        "{p.axiom}"
                      </p>
                      {/* Stake-share bar */}
                      <div style={{ height: 4, background: 'rgba(244,239,227,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${sharePct}%`, height: '100%', background: color.accent }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Stake explainer */}
            <section
              style={{
                ...PANEL,
                marginBottom: '1.5rem',
                borderLeft: `3px solid #C9A26B`,
              }}
            >
              <p style={{ ...TYPE.meta, color: '#C9A26B', fontSize: '0.55rem', marginBottom: '0.5rem' }}>
                What staking does
              </p>
              <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.88rem', margin: 0, lineHeight: 1.6 }}>
                Stake one card on your prediction. If your Pane wins the
                Conflict, your card earns a narrative scar — a permanent mark
                that this card participated in {conflict.name}. The card
                returns to your vault either way. The scar is the collectible
                artifact of having played.
              </p>
            </section>

            {/* Card selector — shown when a Pane is chosen */}
            {step === 'choose-card' && chosenPane ? (
              <section style={{ marginBottom: '1.5rem' }}>
                <p style={{ ...TYPE.meta, color: PANE_COLORS[chosenPane.id].accent, fontSize: '0.6rem', marginBottom: '0.7rem' }}>
                  Choose your stake from {chosenPane.displayName}
                </p>
                {userCardsForPane.length === 0 ? (
                  <div style={{ ...PANEL }}>
                    <p style={{ ...TYPE.italic, color: TEXT.body, fontSize: '0.95rem', margin: 0 }}>
                      You have no cards from {chosenPane.displayName} yet. Pull a pack to participate in this Conflict.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                    {userCardsForPane.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => {
                          setChosenCard(card);
                          setStep('confirm');
                        }}
                        style={{ flexShrink: 0, cursor: 'pointer' }}
                      >
                        <Card card={card} size="md" showLampblackOnHover={false} onClick={() => {
                          setChosenCard(card);
                          setStep('confirm');
                        }} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : null}

            {/* Confirm modal sheet */}
            {step === 'confirm' && chosenCard && chosenPane ? (
              <ConfirmStakeSheet
                card={chosenCard}
                pane={chosenPane}
                conflictName={conflict.name}
                onCancel={() => {
                  setChosenCard(null);
                  setStep('choose-card');
                }}
                onConfirm={() => setStep('staked')}
              />
            ) : null}
          </>
        )}

        {/* Past conflicts archive */}
        <section style={{ marginTop: '2rem' }}>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem', marginBottom: '0.75rem' }}>
            Past conflicts
          </p>
          {PAST_CONFLICTS.map((past) => (
            <PastConflictRow key={past.id} conflict={past} />
          ))}
        </section>
      </div>
    </MLPShell>
  );
}

function StakedConfirmation({ pane, card, conflictName }: { pane: Pane; card: CardType; conflictName: string }) {
  const color = PANE_COLORS[pane.id];
  return (
    <section
      style={{
        ...PANEL,
        borderLeft: `3px solid ${color.accent}`,
        textAlign: 'center',
        padding: '1.5rem 1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.6rem' }}>Staked</span>
      <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.2rem', margin: '0.7rem 0 1rem', lineHeight: 1.3 }}>
        Your stake is in.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Card card={card} size="md" showLampblackOnHover={false} />
      </div>
      <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.9rem', margin: 0, lineHeight: 1.55 }}>
        <strong style={{ color: TEXT.primary }}>{card.name}</strong> is staked on{' '}
        <strong style={{ color: color.accent }}>{pane.displayName}</strong> for{' '}
        {conflictName}. Return when stakes close to learn the resolution.
      </p>
    </section>
  );
}

function ConfirmStakeSheet({
  card,
  pane,
  conflictName,
  onCancel,
  onConfirm,
}: {
  card: CardType;
  pane: Pane;
  conflictName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const color = PANE_COLORS[pane.id];
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: SURFACE.void,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          width: '100%',
          maxWidth: 560,
          padding: '1.5rem 1.1rem calc(1.1rem + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.6rem', textAlign: 'center' }}>
          Confirm stake
        </span>
        <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.15rem', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>
          Stake <strong>{card.name}</strong> on <strong style={{ color: color.accent }}>{pane.displayName}</strong>?
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Card card={card} size="md" showLampblackOnHover={false} />
        </div>
        <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
          If your Pane wins {conflictName}, this card earns the scar.
          The card returns to your vault either way.
        </p>
        <button type="button" style={BUTTON_PRIMARY} onClick={onConfirm}>
          Stake this card →
        </button>
        <button type="button" style={BUTTON_SECONDARY} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function PastConflictRow({ conflict }: { conflict: typeof PAST_CONFLICTS[number] }) {
  const winner = conflict.outcome?.winner;
  const winnerColor = winner ? PANE_COLORS[winner.id].accent : SURFACE.rule;
  return (
    <div
      style={{
        ...PANEL,
        borderLeft: `3px solid ${winnerColor}`,
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
        <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>Resolved</span>
        <span style={{ ...TYPE.meta, color: '#8B1A1A', fontSize: '0.55rem' }}>
          ✦ {conflict.outcome?.scarsAwarded ?? 0} scars awarded
        </span>
      </div>
      <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1rem', margin: 0, lineHeight: 1.3 }}>
        {conflict.name}
      </p>
      {winner ? (
        <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.85rem', margin: '0.5rem 0 0 0' }}>
          <strong style={{ color: winnerColor }}>{winner.displayName}</strong> claimed the boundary.
        </p>
      ) : null}
    </div>
  );
}
