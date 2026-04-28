'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  IcebergViewer,
  LampblackCallout,
  ContrabandBadge,
  MLPShell,
  MOCK_CARDS,
  PANES,
  PANE_COLORS,
  PANE_LIST,
  RARITY,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
  BUTTON_SECONDARY,
  type Card as CardType,
  type PaneId,
} from '@/components/mlp';

type VaultView = 'pane' | 'set' | 'iceberg';

export default function VaultPage() {
  const [view, setView] = useState<VaultView>('pane');
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const ownedCards = MOCK_CARDS;

  // Empty state — redirect to onboarding
  if (ownedCards.length === 0) {
    return (
      <MLPShell title="Vault">
        <div style={{ padding: '2rem 1.1rem', textAlign: 'center' }}>
          <p style={{ ...TYPE.italic, color: TEXT.body, fontSize: '1.1rem' }}>
            You haven't started a collection yet.
          </p>
          <Link
            href="/v3/mlp/start"
            style={{ ...BUTTON_SECONDARY, textDecoration: 'none', maxWidth: 280, margin: '1rem auto', display: 'block', textAlign: 'center' }}
          >
            Pull your first card →
          </Link>
        </div>
      </MLPShell>
    );
  }

  return (
    <MLPShell title="Vault">
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        <ViewSwitcher view={view} setView={setView} />

        {view === 'pane' && <ByPaneView cards={ownedCards} onCardClick={setSelectedCard} />}
        {view === 'set' && <BySetView cards={ownedCards} />}
        {view === 'iceberg' && <ByIcebergView cards={ownedCards} onCardClick={setSelectedCard} />}

        {selectedCard ? <CardDetailSheet card={selectedCard} onClose={() => setSelectedCard(null)} /> : null}
      </div>
    </MLPShell>
  );
}

function ViewSwitcher({ view, setView }: { view: VaultView; setView: (v: VaultView) => void }) {
  const wrapper: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.3rem',
    background: SURFACE.card,
    border: `1px solid ${SURFACE.rule}`,
    borderRadius: 4,
    padding: '0.3rem',
    marginBottom: '1.5rem',
  };
  const buttonBase: CSSProperties = {
    padding: '0.65rem 0.4rem',
    background: 'transparent',
    border: 'none',
    borderRadius: 2,
    cursor: 'pointer',
    minHeight: 44,
    ...TYPE.meta,
    fontSize: '0.6rem',
    color: TEXT.muted,
  };
  const labels: Record<VaultView, string> = { pane: 'By Pane', set: 'By Set', iceberg: 'By Iceberg' };

  return (
    <div role="tablist" style={wrapper}>
      {(['pane', 'set', 'iceberg'] as VaultView[]).map((v) => {
        const active = v === view;
        return (
          <button
            key={v}
            role="tab"
            aria-selected={active}
            type="button"
            style={{ ...buttonBase, color: active ? TEXT.primary : TEXT.muted, background: active ? 'rgba(244,239,227,0.06)' : 'transparent' }}
            onClick={() => setView(v)}
          >
            {labels[v]}
          </button>
        );
      })}
    </div>
  );
}

function ByPaneView({ cards, onCardClick }: { cards: CardType[]; onCardClick: (c: CardType) => void }) {
  const byPane: Record<PaneId, CardType[]> = {
    'lud-border': [],
    'old-ones-persist': [],
    'sinterklaas-reigns': [],
  };
  cards.forEach((c) => {
    if (byPane[c.pane]) byPane[c.pane].push(c);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {PANE_LIST.map((pane) => {
        const paneCards = byPane[pane.id];
        if (paneCards.length === 0) return null;
        const color = PANE_COLORS[pane.id];
        return (
          <section key={pane.id}>
            <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.65rem' }}>{pane.displayName}</span>
              <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>
                {paneCards.length} card{paneCards.length === 1 ? '' : 's'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.6rem' }}>
              {paneCards.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Card card={c} size="sm" onClick={onCardClick} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function BySetView({ cards }: { cards: CardType[] }) {
  // Group by setId
  const sets = new Map<string, CardType[]>();
  cards.forEach((c) => {
    if (!sets.has(c.setId)) sets.set(c.setId, []);
    sets.get(c.setId)!.push(c);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from(sets.entries()).map(([setId, setCards]) => {
        const pane = PANES[setCards[0].pane];
        const color = PANE_COLORS[pane.id];
        const total = pane.id === 'lud-border' ? 12 : pane.id === 'old-ones-persist' ? 10 : 11;
        const pct = (setCards.length / total) * 100;
        return (
          <Link
            key={setId}
            href={`/v3/mlp/sets`}
            style={{
              ...PANEL,
              borderLeft: `3px solid ${color.accent}`,
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.6rem' }}>{pane.displayName}</span>
              <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>
                {setCards.length} of {total}
              </span>
            </div>
            <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.05rem', margin: 0, marginBottom: '0.6rem' }}>
              {pane.displayName} Starter Set
            </p>
            <div style={{ height: 6, background: 'rgba(244,239,227,0.06)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color.accent }} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ByIcebergView({ cards, onCardClick }: { cards: CardType[]; onCardClick: (c: CardType) => void }) {
  // For each card, "depth" is mocked as serial mod 9 (0-8 facets revealed).
  // Real implementation would track per-card user reveal state.
  const sorted = [...cards].sort((a, b) => (b.serial % 9) - (a.serial % 9));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.88rem', margin: 0 }}>
        How far you have read into each card. Each card has 8 buried facets.
      </p>
      {sorted.map((c) => {
        const depth = c.serial % 9; // 0..8
        const color = PANE_COLORS[c.pane];
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onCardClick(c)}
            style={{
              ...PANEL,
              borderLeft: `3px solid ${color.accent}`,
              textAlign: 'left' as const,
              cursor: 'pointer',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Card card={c} size="sm" showLampblackOnHover={false} />
            <div style={{ flex: 1 }}>
              <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.55rem' }}>
                {c.paneDisplayName}
              </span>
              <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '0.95rem', margin: '0.25rem 0 0.5rem 0' }}>
                {c.name}
              </p>
              <div style={{ height: 4, background: 'rgba(244,239,227,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${(depth / 8) * 100}%`, height: '100%', background: '#C9A26B' }} />
              </div>
              <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginTop: '0.35rem', display: 'block' }}>
                {depth} of 8 facets revealed
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CardDetailSheet({ card, onClose }: { card: CardType; onClose: () => void }) {
  const sheet: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  };
  const inner: CSSProperties = {
    background: SURFACE.void,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '1.5rem 1.1rem calc(1.1rem + env(safe-area-inset-bottom, 0px))',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  };
  const closeBtn: CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: TEXT.muted,
    cursor: 'pointer',
    alignSelf: 'flex-end',
    fontSize: '1.5rem',
    padding: '0.25rem 0.5rem',
  };

  return (
    <div style={sheet} onClick={onClose}>
      <div style={inner} onClick={(e) => e.stopPropagation()}>
        <button type="button" style={closeBtn} onClick={onClose} aria-label="Close">
          ×
        </button>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Card card={card} size="lg" showLampblackOnHover={false} />
        </div>
        {card.contrabandRelation ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContrabandBadge relation={card.contrabandRelation} pane={card.paneDisplayName} />
          </div>
        ) : null}
        <p style={{ ...TYPE.italic, color: TEXT.body, fontSize: '1rem', textAlign: 'center', margin: 0 }}>
          "{card.flavorLine}"
        </p>
        <IcebergViewer surface={card.iceberg.surface} echo={card.iceberg.echo} deep={card.iceberg.deep} />
        <LampblackCallout lampblack={card.lampblack} />
      </div>
    </div>
  );
}
