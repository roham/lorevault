'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IcebergBlock } from './IcebergBlock';
import { LampblackDisplay } from './LampblackDisplay';
import { ContrabandBadge } from './ContrabandBadge';

type ContrabandRelation = 'carries' | 'refuses' | 'mediates' | 'exposes';

interface PierreMenard {
  set_id: string;
  variant_label: string;
  shared_axiom: string;
}

interface IcebergLayers {
  surface: string[];
  echo: string;
  deep: string[];
}

interface Lampblack {
  gesture: string;
  cosmological_relation: string;
  wound: string;
  forbidden_act: string;
  role: string;
  silhouette: string;
  prop: string;
}

interface CardDeepDetailProps {
  iceberg: IcebergLayers;
  lampblack: Lampblack;
  contrabandRelation: ContrabandRelation;
  contrabandNote: string;
  pierreMenard: PierreMenard | null;
}

type Pane = 'iceberg' | 'lampblack' | 'contraband' | 'pierre-menard';

export function CardDeepDetail({
  iceberg,
  lampblack,
  contrabandRelation,
  contrabandNote,
  pierreMenard,
}: CardDeepDetailProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Pane>('iceberg');

  const allTabs: { key: Pane; label: string; show: boolean }[] = [
    { key: 'iceberg',       label: 'Iceberg',     show: true },
    { key: 'lampblack',     label: 'Lampblack',   show: true },
    { key: 'contraband',    label: 'Contraband',  show: true },
    { key: 'pierre-menard', label: 'Pierre-Menard', show: !!pierreMenard },
  ];
  const tabs = allTabs.filter((t) => t.show);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-12 mb-6 block w-full rounded border border-zinc-800 bg-zinc-900/30 px-5 py-4 text-left transition-colors hover:border-amber-500/40 hover:bg-zinc-900/60"
      >
        <p className="text-xs uppercase tracking-widest text-amber-400">
          Read deeper
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          Iceberg, Lampblack, Contraband{pierreMenard ? ', Pierre-Menard' : ''} —
          the structural layers under the surface.
        </p>
      </button>
    );
  }

  return (
    <div className="mt-12 mb-6 rounded border border-zinc-800 bg-zinc-900/30">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
        <p className="text-xs uppercase tracking-widest text-amber-400">
          Reading deeper
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Close
        </button>
      </div>

      <div className="flex border-b border-zinc-800">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={[
              'flex-1 px-3 py-3 text-[0.65rem] uppercase tracking-widest transition-colors',
              active === key
                ? 'border-b-2 border-amber-500 text-amber-400'
                : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-5 py-6">
        {active === 'iceberg' && (
          <IcebergBlock
            surface={iceberg.surface}
            echo={iceberg.echo}
            deep={iceberg.deep}
          />
        )}
        {active === 'lampblack' && <LampblackDisplay lampblack={lampblack} />}
        {active === 'contraband' && (
          <ContrabandBadge relation={contrabandRelation} note={contrabandNote} />
        )}
        {active === 'pierre-menard' && pierreMenard && (
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
              {pierreMenard.set_id} · {pierreMenard.variant_label}
            </p>
            <blockquote className="my-4 border-l-2 border-amber-500 pl-4 italic text-zinc-200">
              &ldquo;{pierreMenard.shared_axiom}&rdquo;
            </blockquote>
            <p className="mb-4 text-sm text-zinc-400">
              Identical words appear on three other cards across different Panes.
              Each Pane gives the same words a different cosmological consequence.
            </p>
            <Link
              href="/v3/moodboard/pierre-menard"
              className="text-sm text-amber-400 no-underline transition-colors hover:text-amber-300"
            >
              See the triptych →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
