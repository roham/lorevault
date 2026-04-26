'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const UTC_MS_PER_DAY = 86_400_000
const STORAGE_KEY = 'lv:ticket'
const TOTAL = 7

type TicketData = { count: number; lastDay: number }

export function TicketProgress() {
  const [data, setData] = useState<TicketData | null>(null)

  useEffect(() => {
    const today = Math.floor(Date.now() / UTC_MS_PER_DAY)
    const raw = localStorage.getItem(STORAGE_KEY)
    let d: TicketData = raw ? (JSON.parse(raw) as TicketData) : { count: 0, lastDay: -1 }

    if (d.lastDay < today) {
      d = { count: Math.min(d.count + 1, TOTAL), lastDay: today }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
    }

    setData(d)
  }, [])

  if (data === null) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} className="w-6 h-6 border border-[#1a1815] rounded-sm" />
        ))}
      </div>
    )
  }

  const { count } = data
  const packReady = count >= TOTAL

  return (
    <div className="flex flex-col gap-6">
      {/* Ticket slots */}
      <div>
        <div className="flex gap-2 mb-3">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-sm border transition-colors ${
                i < count
                  ? 'bg-[#4a3e30] border-[#6a5e50]'
                  : 'border-[#1a1815]'
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] tracking-[0.15em] uppercase font-mono text-[#6a5e50]">
          {count} of {TOTAL} reading days
        </p>
      </div>

      {packReady ? (
        /* Pack ready state */
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-[180px] aspect-[2/3] bg-[#0f0e0c] border border-[#2a2420] rounded-sm flex flex-col items-center justify-center gap-3">
            <p className="text-[9px] tracking-[0.3em] uppercase font-mono text-[#4a3e30]">
              Sample
            </p>
            <div className="w-8 h-[1px] bg-[#2a2420]" />
            <p className="text-[20px] font-serif text-[#6a5e50]">◆</p>
            <div className="w-8 h-[1px] bg-[#2a2420]" />
            <p className="text-[9px] tracking-[0.2em] uppercase font-mono text-[#3a3028]">
              LoreVault
            </p>
          </div>
          <div>
            <p className="text-[13px] font-serif text-[#b0a090] mb-3">
              Your Sample pack is ready.
            </p>
            <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed mb-4">
              Seven reading days. The pack contains one Common Moment from
              Baker Street · BS-1 · 221B.
            </p>
            <Link
              href="/v2/pack/reveal"
              className="inline-block text-[10px] tracking-[0.15em] uppercase font-mono border border-[#6a5e50] px-4 py-2 text-[#b0a090] hover:border-[#b0a090] hover:text-[#e8e0d0] transition-colors"
            >
              Reveal your card →
            </Link>
            <p className="mt-2 text-[9px] text-[#3a3028] font-mono">
              Binder and ownership live 2 May 2026.
            </p>
          </div>
        </div>
      ) : (
        /* Collecting state */
        <div>
          <p className="text-[11px] text-[#6a5e50] font-mono leading-relaxed mb-4">
            {count === 0
              ? 'Return each day after reading the Journal to collect your reading days. Seven days unlock your first Sample pack.'
              : count < 3
              ? `${TOTAL - count} more reading days to unlock your Sample pack. Come back tomorrow.`
              : `${TOTAL - count} more reading ${TOTAL - count === 1 ? 'day' : 'days'}. Your pack is taking shape.`}
          </p>

          {count >= 3 && (
            /* Partial pack preview */
            <div className="relative w-full max-w-[180px] aspect-[2/3] bg-[#0f0e0c] border border-[#1a1815] rounded-sm flex flex-col items-center justify-center gap-3 mb-4">
              <p className="text-[9px] tracking-[0.3em] uppercase font-mono text-[#2a2420]">
                Sample
              </p>
              <div className="flex gap-1">
                {Array.from({ length: count }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-[#3a3028] rounded-sm" />
                ))}
                {Array.from({ length: TOTAL - count }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 border border-[#1a1815] rounded-sm" />
                ))}
              </div>
              <p className="text-[9px] tracking-[0.2em] uppercase font-mono text-[#1a1815]">
                LoreVault
              </p>
            </div>
          )}

          <Link
            href="/v2/today"
            className="inline-block text-[10px] tracking-[0.15em] uppercase font-mono text-[#6a5e50] border border-[#2a2420] px-4 py-2 hover:border-[#4a3e30] hover:text-[#b0a090] transition-colors"
          >
            Today on the Lattice →
          </Link>
        </div>
      )}
    </div>
  )
}
