'use client';

import type { CSSProperties } from 'react';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  ContrabandBadge,
  MLPShell,
  MOCK_LISTINGS,
  PANE_COLORS,
  PANE_LIST,
  RARITY,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  type Listing,
  type PaneId,
} from '@/components/mlp';

type FilterKey = 'all' | 'owned' | 'need-for-set' | 'contraband' | 'pierre-menard';

function MarketInner() {
  const sp = useSearchParams();
  const setFilter = sp?.get('set');
  const cardFilter = sp?.get('card');

  const [filter, setFilter] = useState<FilterKey>('all');
  const [paneFilter, setPaneFilter] = useState<PaneId | 'all'>('all');
  const [selected, setSelected] = useState<Listing | null>(null);

  const filtered = useMemo(() => {
    let list = MOCK_LISTINGS;
    if (paneFilter !== 'all') list = list.filter((l) => l.card.pane === paneFilter);
    if (filter === 'contraband') list = list.filter((l) => l.card.rarity === 'contraband' || l.card.contrabandRelation !== null);
    if (filter === 'need-for-set') list = list.filter((l) => l.card.setId.endsWith('-starter'));
    if (filter === 'pierre-menard') list = list.filter((l) => l.card.setId === 'pm-cycle');
    if (cardFilter) list = list.filter((l) => l.card.id === cardFilter);
    if (setFilter) list = list.filter((l) => l.card.setId === setFilter);
    return list;
  }, [filter, paneFilter, setFilter, cardFilter]);

  const contrabandFeatured = MOCK_LISTINGS.filter((l) => l.card.rarity === 'contraband');

  return (
    <MLPShell title="Market">
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        <FilterRow filter={filter} setFilter={setFilter} />
        <PaneFilterRow paneFilter={paneFilter} setPaneFilter={setPaneFilter} />

        {/* Contraband featured row */}
        {filter === 'all' && paneFilter === 'all' && contrabandFeatured.length > 0 ? (
          <section style={{ marginTop: '1.5rem' }}>
            <p
              style={{
                ...TYPE.meta,
                color: '#8B1A1A',
                fontSize: '0.6rem',
                marginBottom: '0.7rem',
                letterSpacing: '0.18em',
              }}
            >
              The Forbidden
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
              {contrabandFeatured.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelected(l)}
                  style={{
                    flexShrink: 0,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                >
                  <Card card={l.card} size="md" showLampblackOnHover={false} />
                  <p style={{ ...TYPE.meta, color: '#8B1A1A', fontSize: '0.55rem', marginTop: '0.4rem', textAlign: 'center' }}>
                    ${l.askingPrice}
                  </p>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {/* Listings */}
        <section style={{ marginTop: '1.5rem' }}>
          <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginBottom: '0.7rem' }}>
            {filtered.length} listing{filtered.length === 1 ? '' : 's'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {filtered.map((l) => (
              <ListingRow key={l.id} listing={l} onClick={() => setSelected(l)} />
            ))}
          </div>
        </section>

        {selected ? <ListingDetailSheet listing={selected} onClose={() => setSelected(null)} /> : null}
      </div>
    </MLPShell>
  );
}

function FilterRow({ filter, setFilter }: { filter: FilterKey; setFilter: (f: FilterKey) => void }) {
  const opts: { v: FilterKey; label: string }[] = [
    { v: 'all', label: 'All' },
    { v: 'owned', label: 'Owned' },
    { v: 'need-for-set', label: 'Need for set' },
    { v: 'contraband', label: 'Contraband' },
    { v: 'pierre-menard', label: 'Pierre-Menard variants' },
  ];

  const wrapper: CSSProperties = {
    display: 'flex',
    gap: '0.4rem',
    overflowX: 'auto',
    paddingBottom: '0.3rem',
    marginBottom: '0.5rem',
  };
  const pill = (active: boolean): CSSProperties => ({
    ...TYPE.meta,
    fontSize: '0.55rem',
    color: active ? TEXT.primary : TEXT.muted,
    background: active ? 'rgba(244,239,227,0.08)' : SURFACE.card,
    border: `1px solid ${active ? '#C9A26B' : SURFACE.rule}`,
    borderRadius: 999,
    padding: '0.45rem 0.85rem',
    cursor: 'pointer',
    flexShrink: 0,
  });

  return (
    <div style={wrapper}>
      {opts.map((o) => (
        <button key={o.v} type="button" style={pill(filter === o.v)} onClick={() => setFilter(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PaneFilterRow({ paneFilter, setPaneFilter }: { paneFilter: PaneId | 'all'; setPaneFilter: (p: PaneId | 'all') => void }) {
  const wrapper: CSSProperties = {
    display: 'flex',
    gap: '0.4rem',
    overflowX: 'auto',
    paddingBottom: '0.3rem',
  };
  const pill = (active: boolean, accent?: string): CSSProperties => ({
    ...TYPE.meta,
    fontSize: '0.55rem',
    color: active ? TEXT.primary : TEXT.muted,
    background: active ? 'rgba(244,239,227,0.08)' : SURFACE.card,
    border: `1px solid ${active ? accent ?? '#C9A26B' : SURFACE.rule}`,
    borderRadius: 999,
    padding: '0.45rem 0.85rem',
    cursor: 'pointer',
    flexShrink: 0,
  });

  return (
    <div style={wrapper}>
      <button type="button" style={pill(paneFilter === 'all')} onClick={() => setPaneFilter('all')}>
        All Panes
      </button>
      {PANE_LIST.map((p) => (
        <button
          key={p.id}
          type="button"
          style={pill(paneFilter === p.id, PANE_COLORS[p.id].accent)}
          onClick={() => setPaneFilter(p.id)}
        >
          {p.displayName}
        </button>
      ))}
    </div>
  );
}

function ListingRow({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  const color = PANE_COLORS[listing.card.pane];
  const rarity = RARITY[listing.card.rarity];
  const diff = listing.askingPrice - listing.floorPrice;
  const floorChip =
    diff === 0
      ? { label: 'At floor', color: '#7A8FA0' }
      : diff > 0
        ? { label: `+$${diff} above`, color: '#8B1A1A' }
        : { label: `$${Math.abs(diff)} below`, color: '#7A9A6A' };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...PANEL,
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'center',
        textAlign: 'left' as const,
        cursor: 'pointer',
        width: '100%',
        borderLeft: `3px solid ${color.accent}`,
      }}
    >
      <Card card={listing.card} size="sm" showLampblackOnHover={false} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.55rem' }}>{listing.card.paneDisplayName}</span>
        <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '0.95rem', margin: '0.25rem 0 0.4rem 0', lineHeight: 1.25 }}>
          {listing.card.name}
        </p>
        <span style={{ ...TYPE.meta, color: rarity.color, fontSize: '0.55rem' }}>
          {rarity.label} · #{listing.card.serial}
        </span>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: TEXT.primary, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
          ${listing.askingPrice}
        </p>
        <span style={{ ...TYPE.meta, fontSize: '0.5rem', color: floorChip.color, marginTop: '0.2rem', display: 'inline-block' }}>
          {floorChip.label}
        </span>
      </div>
    </button>
  );
}

function ListingDetailSheet({ listing, onClose }: { listing: Listing; onClose: () => void }) {
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
    gap: '1.1rem',
  };

  return (
    <div style={sheet} onClick={onClose}>
      <div style={inner} onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ alignSelf: 'flex-end', background: 'transparent', border: 'none', color: TEXT.muted, fontSize: '1.5rem', cursor: 'pointer' }}>
          ×
        </button>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Card card={listing.card} size="lg" showLampblackOnHover={false} />
        </div>
        {listing.card.contrabandRelation ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContrabandBadge relation={listing.card.contrabandRelation} pane={listing.card.paneDisplayName} />
          </div>
        ) : null}
        <p style={{ ...TYPE.italic, color: TEXT.body, fontSize: '0.98rem', textAlign: 'center', margin: 0 }}>
          "{listing.card.flavorLine}"
        </p>
        <div style={{ ...PANEL, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Row label="Asking" value={`$${listing.askingPrice}`} />
          <Row label="Floor" value={`$${listing.floorPrice}`} />
          <Row label="Seller" value={listing.seller} />
          <Row label="Edition" value={`#${listing.card.serial} of ${listing.card.editionSize}`} />
        </div>
        <button type="button" style={BUTTON_PRIMARY}>
          Buy at ${listing.askingPrice} →
        </button>
        <button type="button" style={{ ...BUTTON_SECONDARY, opacity: 0.5 }} disabled aria-disabled="true">
          Make an offer (coming in Series 2)
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>{label}</span>
      <span style={{ ...TYPE.bodySmall, color: TEXT.primary, fontFamily: 'monospace', fontSize: '0.9rem' }}>{value}</span>
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={<div style={{ background: SURFACE.void, minHeight: '100vh' }} />}>
      <MarketInner />
    </Suspense>
  );
}
