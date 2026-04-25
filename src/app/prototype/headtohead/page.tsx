'use client';

import { useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Pair = {
  id: string;
  label: string;
  prompt: string;
  flux: { path: string; provider: string };
  openai: { path: string; provider: string };
};

type LocalVote = { winner: 'flux' | 'openai' | 'tie' | 'neither'; comment?: string };

const LS_TOKEN = 'lorevault_moodboard_token_v1';
const LS_VOTER = 'lorevault_moodboard_voter_v1';
const LS_H2H = 'lorevault_h2h_votes_v1';

function readLocal(): Record<string, LocalVote> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(LS_H2H) ?? '{}'); }
  catch { return {}; }
}
function writeLocal(v: Record<string, LocalVote>) {
  localStorage.setItem(LS_H2H, JSON.stringify(v));
}
function getVoter(): string {
  const ex = localStorage.getItem(LS_VOTER);
  if (ex) return ex;
  const h = Math.random().toString(36).slice(2, 14);
  localStorage.setItem(LS_VOTER, h);
  return h;
}

function Body() {
  const params = useSearchParams();
  const urlToken = params?.get('k') ?? '';
  const [token, setToken] = useState('');
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [votes, setVotes] = useState<Record<string, LocalVote>>({});
  const [tally, setTally] = useState<{ flux: number; openai: number; tie: number; neither: number }>({ flux: 0, openai: 0, tie: 0, neither: 0 });
  const [aFirst, setAFirst] = useState<Record<string, boolean>>({});
  const [voter, setVoter] = useState('');

  useEffect(() => {
    setVoter(getVoter());
    setVotes(readLocal());
    if (urlToken) {
      localStorage.setItem(LS_TOKEN, urlToken);
      setToken(urlToken);
    } else {
      const stored = localStorage.getItem(LS_TOKEN);
      if (stored) setToken(stored);
    }
    // Service-worker nuke (same as moodboard)
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        if (regs.length) Promise.all(regs.map((r) => r.unregister())).catch(() => {});
      }).catch(() => {});
    }
  }, [urlToken]);

  // Load manifest
  useEffect(() => {
    fetch('/prototype-art/headtohead/manifest.json', { cache: 'no-store' })
      .then((r) => r.json())
      .then((m: { pairs: Pair[] }) => {
        setPairs(m.pairs ?? []);
        // Per-pair randomize which provider shows on the left (blind A/B)
        const map: Record<string, boolean> = {};
        for (const p of m.pairs ?? []) map[p.id] = Math.random() < 0.5;
        setAFirst(map);
      })
      .catch(() => {});
  }, []);

  // Load aggregate tally
  const refreshTally = useCallback(() => {
    if (!token) return;
    fetch(`/api/headtohead/vote?k=${encodeURIComponent(token)}&_t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { votes?: { winner: 'flux' | 'openai' | 'tie' | 'neither' }[] }) => {
        const t = { flux: 0, openai: 0, tie: 0, neither: 0 };
        for (const v of d.votes ?? []) t[v.winner] += 1;
        setTally(t);
      })
      .catch(() => {});
  }, [token]);
  useEffect(() => { refreshTally(); }, [refreshTally]);

  const submit = useCallback(async (pairId: string, winner: 'flux' | 'openai' | 'tie' | 'neither', comment?: string) => {
    const next = { ...votes, [pairId]: { winner, comment } };
    setVotes(next);
    writeLocal(next);
    if (!token) return;
    await fetch(`/api/headtohead/vote?k=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pairId, winner, comment, voterHash: voter }),
    }).catch(() => {});
    refreshTally();
  }, [token, votes, voter, refreshTally]);

  const totalVotes = tally.flux + tally.openai + tally.tie + tally.neither;
  const fluxPct = totalVotes ? Math.round((tally.flux / totalVotes) * 100) : 0;
  const openaiPct = totalVotes ? Math.round((tally.openai / totalVotes) * 100) : 0;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-6">🔒</div>
          <h1 className="text-2xl font-semibold mb-3">Access link required</h1>
          <p className="text-white/60 leading-relaxed">Open with the full invite URL including <code>?k=…</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
            LoreVault · Head-to-Head · FLUX 1.1 Pro Ultra vs OpenAI gpt-image-1
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
            Same prompt. Two providers. You pick.
          </h1>
          <p className="mt-4 text-white/60 max-w-2xl text-[15px] leading-relaxed">
            Each pair is the SAME exemplar prompt rendered on both providers. Position is randomized per
            visit so you can&apos;t game it. Tap the side you prefer, or use Tie / Neither.
          </p>
          {totalVotes > 0 && (
            <div className="mt-6 inline-flex flex-col gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">Live tally · {totalVotes} votes</div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-emerald-300">FLUX {fluxPct}%</span>
                <span className="text-white/30">·</span>
                <span className="text-sky-300">OpenAI {openaiPct}%</span>
                <span className="text-white/30">·</span>
                <span className="text-white/50">Tie {tally.tie} · Neither {tally.neither}</span>
              </div>
            </div>
          )}
        </header>

        <main className="space-y-12">
          {pairs.map((p, idx) => {
            const myVote = votes[p.id];
            const fluxLeft = aFirst[p.id] ?? true;
            const left = fluxLeft ? p.flux : p.openai;
            const right = fluxLeft ? p.openai : p.flux;
            const leftIsFlux = fluxLeft;
            return (
              <article key={p.id} className="rounded-3xl border border-white/10 overflow-hidden bg-[#0d0e16]">
                <header className="px-5 md:px-7 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/40 tabular-nums">{idx + 1}/{pairs.length}</span>
                    <h2 className="text-lg font-semibold">{p.label}</h2>
                  </div>
                  {myVote && (
                    <span className="text-[11px] uppercase tracking-[0.22em] px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      voted: {myVote.winner === 'flux' ? 'FLUX' : myVote.winner === 'openai' ? 'OpenAI' : myVote.winner}
                    </span>
                  )}
                </header>

                <div className="grid md:grid-cols-2 gap-0">
                  {[{side: 'left', img: left, isFlux: leftIsFlux}, {side: 'right', img: right, isFlux: !leftIsFlux}].map(({side, img, isFlux}) => {
                    const provider = isFlux ? 'flux' : 'openai';
                    const isWinner = myVote?.winner === provider;
                    return (
                      <button
                        key={side}
                        onClick={() => submit(p.id, provider as 'flux' | 'openai')}
                        className={`relative bg-black focus:outline-none transition ${isWinner ? 'ring-2 ring-white' : ''}`}
                        style={{ aspectRatio: '2 / 3' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.path} alt={`${p.label} — option ${side}`} className="absolute inset-0 w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-black/70 backdrop-blur border border-white/15 text-white/85">
                          {side === 'left' ? 'A' : 'B'}
                        </span>
                        {isWinner && (
                          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full bg-white text-black">
                            ✓ your pick
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <footer className="px-5 md:px-7 py-3 flex items-center justify-between gap-3 border-t border-white/5">
                  <div className="text-[11px] text-white/40">
                    {myVote ? `Reveal: A=${leftIsFlux ? 'FLUX' : 'OpenAI'} · B=${leftIsFlux ? 'OpenAI' : 'FLUX'}` : 'Blind A/B — randomized per visit'}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => submit(p.id, 'tie')} className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">Tie</button>
                    <button onClick={() => submit(p.id, 'neither')} className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10">Neither</button>
                  </div>
                </footer>
              </article>
            );
          })}
        </main>

        {pairs.length === 0 && (
          <div className="text-center text-white/40 py-20">No pairs loaded yet. Refresh in a moment.</div>
        )}

        <footer className="text-center text-[10px] uppercase tracking-[0.22em] text-white/25 pt-16 pb-12">
          Same prompt · two providers · <a className="hover:text-white/50" href="/prototype/exemplars">return to exemplars</a>
        </footer>
      </div>
    </div>
  );
}

export default function HeadToHeadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14] text-white/60 p-12">Loading…</div>}>
      <Body />
    </Suspense>
  );
}
