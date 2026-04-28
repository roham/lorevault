'use client';

import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import {
  MLPShell,
  MOCK_DROPS,
  PANE_COLORS,
  RARITY,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
  BUTTON_PRIMARY,
  BUTTON_SECONDARY,
  type Drop,
} from '@/components/mlp';

function useCountdown(target: string) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = new Date(target).getTime() - now;
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds, expired: false };
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function DropsPage() {
  const upcoming = MOCK_DROPS.filter((d) => d.status === 'upcoming');
  const recent = MOCK_DROPS.filter((d) => d.status === 'sold-out');
  const next = upcoming[0];

  return (
    <MLPShell title="Drops">
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        {next ? <NextDropHero drop={next} /> : null}

        {upcoming.length > 1 ? (
          <section style={{ marginTop: '2rem' }}>
            <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem', marginBottom: '0.75rem' }}>
              Also coming
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {upcoming.slice(1).map((d) => <UpcomingRow key={d.id} drop={d} />)}
            </div>
          </section>
        ) : null}

        {recent.length > 0 ? (
          <section style={{ marginTop: '2rem' }}>
            <p style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.6rem', marginBottom: '0.75rem' }}>
              Recent drops
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recent.map((d) => <RecentRow key={d.id} drop={d} />)}
            </div>
          </section>
        ) : null}
      </div>
    </MLPShell>
  );
}

function NextDropHero({ drop }: { drop: Drop }) {
  const color = PANE_COLORS[drop.pane.id];
  const c = useCountdown(drop.scheduledAt);
  const [reminded, setReminded] = useState(false);

  const wrapper: CSSProperties = {
    background: color.gradient,
    border: `1px solid ${color.accent}`,
    borderRadius: 6,
    padding: '1.5rem 1.25rem',
  };
  const paneLabel: CSSProperties = { ...TYPE.meta, color: color.accent, fontSize: '0.62rem' };
  const heading: CSSProperties = {
    ...TYPE.italic,
    color: TEXT.primary,
    fontSize: 'clamp(1.4rem, 4.5vw, 1.85rem)',
    margin: '0.55rem 0 1.1rem',
    lineHeight: 1.2,
  };
  const clockWrap: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.4rem',
    margin: '0.6rem 0 1.25rem',
  };
  const cell: CSSProperties = {
    background: 'rgba(0,0,0,0.45)',
    border: `1px solid ${color.accent}55`,
    borderRadius: 3,
    padding: '0.65rem 0.4rem',
    textAlign: 'center',
  };
  const cellNum: CSSProperties = {
    fontFamily: 'monospace',
    fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
    fontWeight: 600,
    color: TEXT.primary,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  };
  const cellLabel: CSSProperties = {
    ...TYPE.meta,
    color: TEXT.muted,
    fontSize: '0.5rem',
    marginTop: '0.3rem',
  };

  return (
    <div style={wrapper}>
      <span style={paneLabel}>{drop.pane.displayName} · upcoming</span>
      <h2 style={heading}>{drop.name}</h2>

      <div style={clockWrap}>
        {[
          { n: c.days, l: 'days' },
          { n: c.hours, l: 'hours' },
          { n: c.minutes, l: 'min' },
          { n: c.seconds, l: 'sec' },
        ].map((seg) => (
          <div key={seg.l} style={cell}>
            <p style={cellNum}>{pad(seg.n)}</p>
            <p style={cellLabel}>{seg.l}</p>
          </div>
        ))}
      </div>

      <DropMeta drop={drop} />

      <button
        type="button"
        style={reminded ? BUTTON_SECONDARY : BUTTON_PRIMARY}
        onClick={() => setReminded((r) => !r)}
      >
        {reminded ? '✓ We will tell you when it opens' : 'Tell me when it opens'}
      </button>
    </div>
  );
}

function DropMeta({ drop }: { drop: Drop }) {
  const wrap: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem 1rem',
    marginBottom: '1.1rem',
  };
  const row: CSSProperties = { display: 'flex', flexDirection: 'column' };
  const label: CSSProperties = { ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' };
  const value: CSSProperties = { ...TYPE.bodySmall, color: TEXT.primary, fontSize: '0.95rem', marginTop: '0.2rem' };

  return (
    <div style={wrap}>
      <div style={row}>
        <span style={label}>Pack count</span>
        <span style={value}>{drop.packCount.toLocaleString()}</span>
      </div>
      <div style={row}>
        <span style={label}>Per pack</span>
        <span style={value}>${drop.pricePerPack}</span>
      </div>
      <div style={{ ...row, gridColumn: '1 / -1' }}>
        <span style={label}>Rarity bands</span>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
          {drop.rarityBands.map((b) => (
            <span
              key={b.rarity}
              style={{
                ...TYPE.meta,
                fontSize: '0.55rem',
                color: RARITY[b.rarity].color,
                border: `1px solid ${RARITY[b.rarity].color}66`,
                borderRadius: 999,
                padding: '0.25rem 0.55rem',
              }}
            >
              {RARITY[b.rarity].label} · {b.pct}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function UpcomingRow({ drop }: { drop: Drop }) {
  const color = PANE_COLORS[drop.pane.id];
  const c = useCountdown(drop.scheduledAt);
  return (
    <div style={{ ...PANEL, borderLeft: `3px solid ${color.accent}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.55rem' }}>{drop.pane.displayName}</span>
        <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', fontVariantNumeric: 'tabular-nums' }}>
          in {c.days}d {pad(c.hours)}h
        </span>
      </div>
      <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1rem', margin: '0.3rem 0 0' }}>{drop.name}</p>
    </div>
  );
}

function RecentRow({ drop }: { drop: Drop }) {
  const color = PANE_COLORS[drop.pane.id];
  const trending = drop.trendingPct ?? 0;
  return (
    <div style={{ ...PANEL, borderLeft: `3px solid ${color.accent}88` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
        <span style={{ ...TYPE.meta, color: color.accent, fontSize: '0.55rem' }}>{drop.pane.displayName}</span>
        <span
          style={{
            ...TYPE.meta,
            color: '#8B1A1A',
            fontSize: '0.5rem',
            background: 'rgba(139,26,26,0.18)',
            borderRadius: 999,
            padding: '0.2rem 0.45rem',
          }}
        >
          Sold out
        </span>
      </div>
      <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1rem', margin: '0 0 0.5rem 0' }}>{drop.name}</p>
      {drop.floorPriceAfterDrop ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.7rem' }}>
          <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>Floor</span>
          <span style={{ ...TYPE.bodySmall, color: TEXT.primary, fontVariantNumeric: 'tabular-nums' }}>
            ${drop.floorPriceAfterDrop}
          </span>
          <span
            style={{
              ...TYPE.meta,
              fontSize: '0.55rem',
              color: trending >= 0 ? '#7A8FA0' : '#8B1A1A',
            }}
          >
            {trending >= 0 ? '↗' : '↘'} {Math.abs(trending)}%
          </span>
        </div>
      ) : null}
    </div>
  );
}
