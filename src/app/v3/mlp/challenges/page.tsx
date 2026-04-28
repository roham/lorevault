'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import {
  MLPShell,
  MOCK_CHALLENGES,
  SURFACE,
  TEXT,
  TYPE,
  PANEL,
  type Challenge,
} from '@/components/mlp';

export default function ChallengesPage() {
  const daily = MOCK_CHALLENGES.filter((c) => c.cadence === 'daily');
  const weekly = MOCK_CHALLENGES.filter((c) => c.cadence === 'weekly');
  const seasonal = MOCK_CHALLENGES.filter((c) => c.cadence === 'seasonal');

  return (
    <MLPShell title="Challenges">
      <div style={{ padding: '1rem 1.1rem 2rem', maxWidth: 720, margin: '0 auto' }}>
        <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.95rem', marginTop: 0, marginBottom: '1.5rem' }}>
          Three rhythms. The day. The week. The Series.
        </p>

        <CadenceSection title="Today" challenges={daily} cadenceLabel="Daily · resets at 00:00 UTC" />
        <CadenceSection title="This Week" challenges={weekly} cadenceLabel="Weekly · resets Monday 00:00 UTC" />
        <CadenceSection title="The Season" challenges={seasonal} cadenceLabel="Seasonal · Series 1" />
      </div>
    </MLPShell>
  );
}

function CadenceSection({
  title,
  challenges,
  cadenceLabel,
}: {
  title: string;
  challenges: Challenge[];
  cadenceLabel: string;
}) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h2 style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.4rem', margin: 0 }}>{title}</h2>
        <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem' }}>{cadenceLabel}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {challenges.map((c) => <ChallengeCard key={c.id} challenge={c} />)}
      </div>
    </section>
  );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const [expanded, setExpanded] = useState(false);
  const pct = challenge.progress.total > 0 ? challenge.progress.current / challenge.progress.total : 0;
  const complete = pct >= 1;

  const rewardColor = complete ? '#C9A26B' : '#7A8FA0';

  return (
    <div
      style={{
        ...PANEL,
        borderLeft: `3px solid ${complete ? '#C9A26B' : 'rgba(122,143,160,0.5)'}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.7rem' }}>
        <p style={{ ...TYPE.italic, color: TEXT.primary, fontSize: '1.05rem', margin: 0, lineHeight: 1.3 }}>
          {challenge.title}
        </p>
        <span
          style={{
            ...TYPE.meta,
            color: rewardColor,
            fontSize: '0.55rem',
            background: 'rgba(244,239,227,0.04)',
            border: `1px solid ${rewardColor}55`,
            borderRadius: 999,
            padding: '0.25rem 0.55rem',
            flexShrink: 0,
          }}
        >
          {challenge.reward}
        </span>
      </div>

      <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.88rem', margin: '0.45rem 0 0.7rem 0' }}>
        {challenge.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <div style={{ flex: 1, height: 4, background: 'rgba(244,239,227,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${pct * 100}%`, height: '100%', background: complete ? '#C9A26B' : '#7A8FA0', transition: 'width 600ms ease' }} />
        </div>
        <span style={{ ...TYPE.meta, color: TEXT.muted, fontSize: '0.55rem', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
          {challenge.progress.current} of {challenge.progress.total}
        </span>
      </div>

      {challenge.rewardDetail ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          style={{
            marginTop: '0.85rem',
            background: 'transparent',
            border: 'none',
            color: TEXT.muted,
            cursor: 'pointer',
            padding: 0,
            ...TYPE.meta,
            fontSize: '0.55rem',
            display: 'block',
          }}
        >
          {expanded ? '▲ Hide reward detail' : '▼ What does this give me?'}
        </button>
      ) : null}

      {expanded && challenge.rewardDetail ? (
        <div
          style={{
            marginTop: '0.7rem',
            padding: '0.75rem 0.9rem',
            background: 'rgba(244,239,227,0.025)',
            border: `1px solid ${SURFACE.rule}`,
            borderRadius: 3,
          }}
        >
          <p style={{ ...TYPE.bodySmall, color: TEXT.body, fontSize: '0.85rem', margin: 0, lineHeight: 1.55 }}>
            {challenge.rewardDetail}
          </p>
        </div>
      ) : null}
    </div>
  );
}
