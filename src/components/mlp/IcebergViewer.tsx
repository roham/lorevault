'use client';

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { SURFACE, TEXT, TYPE, PANEL } from './tokens';

interface IcebergViewerProps {
  surface: string[];
  echo: string;
  deep: string[];
}

type Stage = 'surface' | 'echo' | 'deep';

export function IcebergViewer({ surface, echo, deep }: IcebergViewerProps) {
  const [stage, setStage] = useState<Stage>('surface');
  const [deepRevealed, setDeepRevealed] = useState(0);

  const advance = () => {
    if (stage === 'surface') {
      setStage('echo');
      return;
    }
    if (stage === 'echo') {
      setStage('deep');
      setDeepRevealed(1);
      return;
    }
    if (stage === 'deep' && deepRevealed < deep.length) {
      setDeepRevealed((n) => n + 1);
    }
  };

  const promptLabel = (() => {
    if (stage === 'surface') return 'Reach deeper';
    if (stage === 'echo') return 'Find the weight';
    if (stage === 'deep' && deepRevealed < deep.length) return 'Another facet';
    return 'You have read all there is.';
  })();

  const promptDisabled = stage === 'deep' && deepRevealed >= deep.length;

  const wrapper: CSSProperties = {
    ...PANEL,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
  };

  const layerLabel: CSSProperties = {
    ...TYPE.meta,
    color: '#C9A26B',
    fontSize: '0.6rem',
  };

  const surfaceP: CSSProperties = {
    ...TYPE.body,
    color: TEXT.primary,
    fontSize: '1.02rem',
    margin: 0,
  };

  const echoP: CSSProperties = {
    ...TYPE.italic,
    color: '#C9A26B',
    fontSize: '1.05rem',
    margin: 0,
    paddingLeft: '0.9rem',
    borderLeft: `2px solid #C9A26B66`,
  };

  const deepBlock: CSSProperties = {
    background: 'rgba(244,239,227,0.025)',
    border: `1px solid ${SURFACE.rule}`,
    borderRadius: 3,
    padding: '0.85rem 1rem',
  };

  const deepFacet: CSSProperties = {
    ...TYPE.bodySmall,
    color: TEXT.body,
    fontSize: '0.88rem',
    margin: 0,
    marginBottom: '0.55rem',
  };

  const counter: CSSProperties = {
    ...TYPE.meta,
    color: TEXT.muted,
    fontSize: '0.6rem',
  };

  const advanceButton: CSSProperties = {
    background: 'transparent',
    color: promptDisabled ? TEXT.muted : '#C9A26B',
    border: `1px solid ${promptDisabled ? TEXT.muted + '44' : '#C9A26B66'}`,
    borderRadius: 2,
    padding: '0.65rem 1rem',
    fontFamily: 'var(--font-baker-street, "EB Garamond"), serif',
    fontSize: '0.65rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    cursor: promptDisabled ? 'default' : 'pointer',
    width: '100%',
    minHeight: 44,
  };

  return (
    <div style={wrapper}>
      {/* Surface — always visible */}
      <div>
        <span style={layerLabel}>Surface</span>
        <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {surface.map((line, i) => (
            <p key={i} style={surfaceP}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Echo — revealed at stage 'echo' */}
      {(stage === 'echo' || stage === 'deep') && (
        <div>
          <span style={layerLabel}>Echo</span>
          <div style={{ marginTop: '0.4rem' }}>
            <p style={echoP}>{echo}</p>
          </div>
        </div>
      )}

      {/* Deep — revealed progressively at stage 'deep' */}
      {stage === 'deep' && deepRevealed > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={layerLabel}>Deep · the buried weight</span>
            <span style={counter}>
              {deepRevealed} of {deep.length} facets
            </span>
          </div>
          <div style={deepBlock}>
            {deep.slice(0, deepRevealed).map((facet, i) => (
              <p key={i} style={deepFacet}>
                — {facet}
              </p>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={advance}
        disabled={promptDisabled}
        style={advanceButton}
        aria-label={promptLabel}
      >
        {promptLabel}
      </button>
    </div>
  );
}
