'use client';

import type { CSSProperties } from 'react';
import { use } from 'react';
import {
  Card,
  MLPShell,
  TierBadge,
  MOCK_PROFILE,
  MOCK_CARDS,
  PANE_COLORS,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
  type Card as CardType,
} from '@/components/mlp';

interface ProfilePageProps {
  params: Promise<{ handle: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = use(params);
  // For MLP, every profile resolves to the mock collector. In production, this
  // is an Atlas user-lookup by handle.
  const profile = MOCK_PROFILE;
  const showcase: CardType[] = profile.showcaseCardIds
    .map((id) => MOCK_CARDS.find((c) => c.id === id))
    .filter((c): c is CardType => Boolean(c));

  const joined = new Date(profile.joinedAt);
  const joinedLabel = `Joined ${joined.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;

  // Avatar — silhouette of most-staked pane (highest mastery for MLP fallback)
  const dominantMastery = [...profile.paneMastery].sort((a, b) => b.owned - a.owned)[0];
  const avatarColor = dominantMastery ? PANE_COLORS[dominantMastery.pane.id].accent : '#C9A26B';

  return (
    <MLPShell title={`@${handle}`}>
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${avatarColor}66 0%, ${SURFACE.card} 80%)`,
              border: `1px solid ${avatarColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-hidden
          >
            <span style={{ ...TYPE.italic, fontSize: '1.4rem', color: TEXT.primary }}>
              {handle.charAt(0).toUpperCase()}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.4rem', margin: 0, lineHeight: 1.2 }}>
              @{handle}
            </h1>
            <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginTop: '0.2rem', display: 'block' }}>
              {joinedLabel}
            </span>
          </div>
          <TierBadge tier={profile.tier.num} active size="sm" />
        </header>

        {/* Pane mastery badges row */}
        <section style={{ marginBottom: '1.5rem' }}>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginBottom: '0.55rem' }}>
            Pane mastery
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
            {profile.paneMastery.map((m) => {
              const color = PANE_COLORS[m.pane.id];
              const pct = m.total > 0 ? Math.round((m.owned / m.total) * 100) : 0;
              return (
                <div
                  key={m.pane.id}
                  style={{
                    flexShrink: 0,
                    background: SURFACE.card,
                    border: `1px solid ${color.accent}55`,
                    borderRadius: 4,
                    padding: '0.65rem 0.85rem',
                    minWidth: 140,
                  }}
                >
                  <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.55rem' }}>
                    {m.pane.displayName}
                  </span>
                  <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.05rem', margin: '0.3rem 0 0' }}>
                    {pct}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Showcase row */}
        <section style={{ marginBottom: '1.5rem' }}>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginBottom: '0.55rem' }}>
            Showcase
          </p>
          {showcase.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
              {showcase.map((card) => (
                <div key={card.id} style={{ flexShrink: 0 }}>
                  <Card card={card} size="md" showLampblackOnHover={false} />
                </div>
              ))}
            </div>
          ) : (
            <p style={{ ...TYPE.bodySmall, color: TEXT.muted, fontSize: '0.85rem' }}>
              This collector has not yet picked their showcase.
            </p>
          )}
        </section>

        {/* Stat block 2x2 */}
        <section style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <Stat label="Cards owned" value={profile.stats.cardsOwned} />
            <Stat label="Sets completed" value={profile.stats.setsCompleted} />
            <Stat label="Conflicts staked" value={profile.stats.conflictsStaked} />
            <Stat label="Contraband held" value={profile.stats.contrabandHeld} />
          </div>
        </section>

        {/* Public ledger */}
        <section>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginBottom: '0.55rem' }}>
            Public ledger
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {profile.recentLedger.map((entry) => {
              const ts = new Date(entry.timestamp);
              const tsLabel = ts.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              return (
                <div
                  key={entry.txHash}
                  style={{
                    ...PANEL,
                    padding: '0.6rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.5rem' }}>
                      {entry.kind.replace('-', ' ')}
                    </span>
                    <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.5rem' }}>{tsLabel}</span>
                  </div>
                  <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.85rem', margin: 0, lineHeight: 1.45 }}>
                    {entry.note}
                  </p>
                  <code style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.5rem', fontFamily: 'monospace' }}>
                    {entry.txHash}
                  </code>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </MLPShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  const wrapper: CSSProperties = {
    ...PANEL,
    padding: '0.85rem 0.95rem',
  };
  return (
    <div style={wrapper}>
      <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>{label}</span>
      <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.55rem', margin: '0.3rem 0 0' }}>{value}</p>
    </div>
  );
}
