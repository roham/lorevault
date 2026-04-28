'use client';

import type { CSSProperties } from 'react';
import {
  MLPShell,
  TierBadge,
  TIER_LADDER,
  CURRENT_TIER,
  MOCK_PROFILE,
  PANE_COLORS,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
} from '@/components/mlp';

export default function ProgressPage() {
  // Series 1 totals (mock — would come from an Atlas catalog query)
  const seriesOwned = MOCK_PROFILE.paneMastery.reduce((s, p) => s + p.owned, 0);
  const seriesTotal = MOCK_PROFILE.paneMastery.reduce((s, p) => s + p.total, 0);
  const seriesPct = seriesTotal > 0 ? seriesOwned / seriesTotal : 0;

  return (
    <MLPShell title="Progress">
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        {/* Current tier hero */}
        <section style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <TierBadge tier={CURRENT_TIER.num} active size="lg" />
        </section>

        {/* Tier ladder */}
        <section style={{ marginBottom: '2rem' }}>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem', marginBottom: '0.85rem' }}>
            Participation ladder
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {TIER_LADDER.map((tier) => {
              const isCurrent = tier.num === CURRENT_TIER.num;
              const isLocked = tier.locked;
              return (
                <div
                  key={tier.num}
                  style={{
                    ...PANEL,
                    borderLeft: `3px solid ${isCurrent ? '#C9A26B' : isLocked ? 'rgba(244,239,227,0.1)' : '#7A8FA0'}`,
                    opacity: isLocked ? 0.55 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <span
                    style={{
                      ...TYPE.italic,
                      color: isCurrent ? '#C9A26B' : isLocked ? TEXT.muted : TEXT.primary,
                      fontSize: '1.4rem',
                      width: 40,
                      textAlign: 'center',
                    }}
                  >
                    {tier.num}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1rem', margin: 0 }}>
                      {tier.name}
                    </p>
                    <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginTop: '0.2rem', display: 'block' }}>
                      {isCurrent
                        ? 'You are here.'
                        : tier.unlockHint ?? (isLocked ? 'Locked' : 'Available')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pane mastery */}
        <section style={{ marginBottom: '2rem' }}>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem', marginBottom: '0.85rem' }}>
            Pane mastery
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {MOCK_PROFILE.paneMastery.map((m) => {
              const color = PANE_COLORS[m.pane.id];
              const pct = m.total > 0 ? m.owned / m.total : 0;
              return (
                <div key={m.pane.id} style={{ ...PANEL, borderLeft: `3px solid ${color.accent}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <span style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1rem' }}>
                      {m.pane.displayName}
                    </span>
                    <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', fontVariantNumeric: 'tabular-nums' }}>
                      {m.owned} of {m.total}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(244,239,227,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${pct * 100}%`, height: '100%', background: color.accent }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Series mastery */}
        <section>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem', marginBottom: '0.85rem' }}>
            Series mastery
          </p>
          <div style={{ ...PANEL, borderLeft: `3px solid #C9A26B` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.05rem' }}>Series 1</span>
              <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>
                {seriesOwned} of {seriesTotal} cards · {Math.round(seriesPct * 100)}%
              </span>
            </div>
            <div style={{ height: 8, background: 'rgba(244,239,227,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${seriesPct * 100}%`, height: '100%', background: '#C9A26B' }} />
            </div>
            <p style={{ ...TYPE.bodySmall, color: TEXT.muted, fontSize: '0.78rem', marginTop: '0.7rem', margin: 0 }}>
              Series 1 closes February 2027. The contraband-relic card is awarded to collectors who hold all four contrabands in any single Pane by close.
            </p>
          </div>
        </section>
      </div>
    </MLPShell>
  );
}
