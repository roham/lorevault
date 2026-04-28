'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  MLPShell,
  ProgressIndicator,
  MOCK_SET_PROGRESS,
  PANE_COLORS,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
  type SetProgress,
} from '@/components/mlp';

type Sort = 'most-complete' | 'cheapest-to-complete' | 'newest';

export default function SetsPage() {
  const [sort, setSort] = useState<Sort>('most-complete');

  const sorted: SetProgress[] = [...MOCK_SET_PROGRESS].sort((a, b) => {
    if (sort === 'most-complete') return b.owned / b.total - a.owned / a.total;
    if (sort === 'cheapest-to-complete') {
      const ac = a.missingCards.reduce((s, c) => s + (c.floorPrice ?? 0), 0);
      const bc = b.missingCards.reduce((s, c) => s + (c.floorPrice ?? 0), 0);
      return ac - bc;
    }
    return 0;
  });

  return (
    <MLPShell title="Sets">
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.95rem', marginTop: 0, marginBottom: '0.85rem' }}>
            A set is what makes a card a step. Each row shows where you stand
            and what it would cost to finish.
          </p>
          <SortControl sort={sort} setSort={setSort} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sorted.map((set) => (
            <SetCard key={set.setId} set={set} />
          ))}
        </div>
      </div>
    </MLPShell>
  );
}

function SortControl({ sort, setSort }: { sort: Sort; setSort: (s: Sort) => void }) {
  const wrapper: CSSProperties = {
    display: 'flex',
    gap: '0.4rem',
    overflowX: 'auto',
    paddingBottom: '0.3rem',
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
  const opts: { v: Sort; label: string }[] = [
    { v: 'most-complete', label: 'Most complete' },
    { v: 'cheapest-to-complete', label: 'Cheapest to complete' },
    { v: 'newest', label: 'Newest' },
  ];

  return (
    <div style={wrapper}>
      {opts.map((o) => (
        <button key={o.v} type="button" style={pill(sort === o.v)} onClick={() => setSort(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SetCard({ set }: { set: SetProgress }) {
  const color = PANE_COLORS[set.pane.id];
  const cheapest = set.missingCards
    .filter((c) => c.floorPrice !== null)
    .sort((a, b) => (a.floorPrice ?? 0) - (b.floorPrice ?? 0))[0];

  return (
    <div
      style={{
        ...PANEL,
        padding: 0,
        borderLeft: `3px solid ${color.accent}`,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '0' }}>
        <ProgressIndicator pane={set.pane} setName={set.setName} owned={set.owned} total={set.total} />
      </div>

      <div style={{ padding: '0.85rem 1.1rem 1.1rem', borderTop: `1px solid ${SURFACE.rule}` }}>
        <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', marginBottom: '0.6rem' }}>
          Missing — {set.missingCards.length} card{set.missingCards.length === 1 ? '' : 's'}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
          {set.missingCards.slice(0, 6).map((mc) => (
            <div
              key={mc.id}
              style={{
                width: 90,
                aspectRatio: '5 / 7',
                background: color.gradient,
                border: `1px dashed ${color.accent}55`,
                borderRadius: 4,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0.4rem',
              }}
            >
              <span style={{ ...TYPE.italic, color: TEXT.muted, fontSize: '0.65rem', lineHeight: 1.2 }}>
                {mc.name}
              </span>
              <span
                style={{
                  ...TYPE.meta,
                  color: mc.floorPrice ? color.accent : TEXT.muted,
                  fontSize: '0.55rem',
                }}
              >
                {mc.floorPrice ? `$${mc.floorPrice}` : 'No floor'}
              </span>
            </div>
          ))}
          {set.missingCards.length > 6 ? (
            <div
              style={{
                width: 90,
                aspectRatio: '5 / 7',
                border: `1px solid ${SURFACE.rule}`,
                borderRadius: 4,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem' }}>
                +{set.missingCards.length - 6}
              </span>
            </div>
          ) : null}
        </div>

        {cheapest ? (
          <Link
            href={`/v3/mlp/market?set=${set.setId}&card=${cheapest.id}`}
            style={{
              marginTop: '0.85rem',
              display: 'block',
              padding: '0.7rem 0.9rem',
              background: 'rgba(244,239,227,0.04)',
              border: `1px solid ${SURFACE.rule}`,
              borderRadius: 2,
              textDecoration: 'none',
              color: TEXT.primary,
            }}
          >
            <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', display: 'block' }}>
              Cheapest missing
            </span>
            <span style={{ ...TYPE.italic, fontSize: '0.95rem' }}>
              {cheapest.name} — ${cheapest.floorPrice} →
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
