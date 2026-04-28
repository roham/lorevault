'use client';

import { useState } from 'react';

interface IcebergBlockProps {
  surface: string[];
  echo: string;
  deep: string[];
}

export function IcebergBlock({ surface, echo, deep }: IcebergBlockProps) {
  const [deepOpen, setDeepOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Surface — always visible */}
      <div>
        <span className="block text-amber-400 uppercase tracking-widest text-xs mb-2">
          Surface
        </span>
        <div className="flex flex-col gap-2">
          {surface.map((line, i) => (
            <p key={i} className="text-zinc-100 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Echo */}
      <div>
        <span className="block text-amber-400 uppercase tracking-widest text-xs mb-2">
          Echo
        </span>
        <p className="italic text-amber-200/80 leading-relaxed border-l-2 border-amber-500/40 pl-4">
          {echo}
        </p>
      </div>

      {/* Deep — collapsed behind toggle */}
      <div>
        <button
          type="button"
          onClick={() => setDeepOpen((v) => !v)}
          className="flex items-center gap-2 text-amber-400 uppercase tracking-widest text-xs hover:text-amber-300 transition-colors mb-3"
          aria-expanded={deepOpen}
        >
          <span
            className="transition-transform duration-200 inline-block"
            style={{ transform: deepOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            ▶
          </span>
          Deep · the buried weight
          {!deepOpen && (
            <span className="text-zinc-500 normal-case tracking-normal text-xs">
              ({deep.length} facets)
            </span>
          )}
        </button>

        {deepOpen && (
          <div className="border border-zinc-800 rounded bg-zinc-900/60 p-4 flex flex-col gap-3">
            {deep.map((facet, i) => (
              <p key={i} className="text-zinc-500 text-sm leading-relaxed">
                — {facet}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
