'use client';

import { useState } from 'react';
import type { CouncilLayers, V2Card, Shell } from '@/lib/v2/cards';

interface CouncilToggleProps {
  council: CouncilLayers;
  shell: V2Card['shell'];
}

const SHELL_RULE: Record<Shell, string> = {
  PRIME: 'var(--color-shell-prime)',
  CYBER: 'var(--color-shell-cyber)',
  MODERN: 'var(--color-shell-modern)',
  AETHER: 'var(--color-shell-aether)',
  HOLLOW: 'var(--color-shell-hollow)',
  MIRROR: 'var(--color-shell-mirror)',
  DREAM: 'var(--color-shell-dream)',
  SAINT: 'var(--color-shell-saint)',
};

export function CouncilToggle({ council, shell }: CouncilToggleProps) {
  const [open, setOpen] = useState(false);
  const rule = SHELL_RULE[shell];
  const layers: Array<{ key: keyof CouncilLayers; label: string }> = [
    { key: 'silhouette', label: 'Silhouette' },
    { key: 'props', label: 'Props' },
    { key: 'gesture', label: 'Gesture' },
    { key: 'spine', label: 'Spine' },
  ];
  return (
    <section className="border-t border-[var(--color-v2-rule)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full h-10 px-4 text-left text-[13px] uppercase tracking-[0.12em] text-[var(--color-v2-text-dim)] hover:text-[var(--color-v2-text)] transition-colors [font-family:var(--font-v2-ui)] flex items-center justify-between"
      >
        <span>{open ? 'Hide' : 'Show'} the 4-Layer Council</span>
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open ? (
        <div className="pb-2">
          {layers.map((l) => (
            <div
              key={l.key}
              className="px-4 py-3"
              style={{ borderLeft: `3px solid ${rule}` }}
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-v2-text-muted)] [font-family:var(--font-v2-ui)]">
                {l.label}
              </p>
              <p className="mt-1 text-[14px] leading-[20px] text-[var(--color-v2-text)] [font-family:var(--font-body)]">
                {council[l.key]}
              </p>
            </div>
          ))}
          <p className="mt-1 px-4 text-[11px] tracking-[0.1em] text-[var(--color-v2-text-muted)] [font-family:var(--font-v2-ui)]">
            View full Council ↗ (post-auth — reserved)
          </p>
        </div>
      ) : null}
    </section>
  );
}
