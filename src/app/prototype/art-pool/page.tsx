'use client';

import { useEffect, useMemo, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Item = {
  id: string;
  character: string;
  characterSlug: string;
  set?: string;
  moment: string;
  parallel: string;
  parallelSlug: string;
  provider: 'flux' | 'openai';
  providerLabel: string;
  path: string;
};

type Manifest = { items: Item[]; totalImages: number };
type LocalVote = { vote: 'yes' | 'no' | 'other'; comment?: string };

const LS_VOTES = 'lorevault_artpool_votes_v1';
const LS_VOTER = 'lorevault_moodboard_voter_v1';
const LS_TOKEN = 'lorevault_moodboard_token_v1';

function readLocal(): Record<string, LocalVote> {
  try { return JSON.parse(localStorage.getItem(LS_VOTES) ?? '{}'); } catch { return {}; }
}
function writeLocal(v: Record<string, LocalVote>) {
  localStorage.setItem(LS_VOTES, JSON.stringify(v));
}
function getVoter(): string {
  const ex = localStorage.getItem(LS_VOTER);
  if (ex) return ex;
  const h = Math.random().toString(36).slice(2, 14);
  localStorage.setItem(LS_VOTER, h);
  return h;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr]; let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function ProviderBadge({ provider }: { provider: 'flux' | 'openai' }) {
  return (
    <span className={`text-[9px] uppercase tracking-[0.22em] px-2 py-0.5 rounded-full border ${
      provider === 'flux' ? 'border-emerald-400/30 text-emerald-300/90 bg-emerald-400/5' : 'border-sky-400/30 text-sky-300/90 bg-sky-400/5'
    }`}>{provider === 'flux' ? 'FLUX' : 'OpenAI'}</span>
  );
}

function Body() {
  const params = useSearchParams();
  const urlToken = params?.get('k') ?? '';
  const [token, setToken] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, LocalVote>>({});
  const [commentMode, setCommentMode] = useState(false);
  const [comment, setComment] = useState('');
  const voterRef = useRef('');
  const [tally, setTally] = useState({ yes: 0, no: 0, other: 0, fluxYes: 0, openaiYes: 0 });

  useEffect(() => {
    voterRef.current = getVoter();
    setVotes(readLocal());
    if (urlToken) { localStorage.setItem(LS_TOKEN, urlToken); setToken(urlToken); }
    else { const stored = localStorage.getItem(LS_TOKEN); if (stored) setToken(stored); }
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        if (regs.length) Promise.all(regs.map((r) => r.unregister())).catch(() => {});
      }).catch(() => {});
    }
  }, [urlToken]);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/art-pool/items?k=${encodeURIComponent(token)}&_t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((m: Manifest) => setItems(m.items ?? []))
      .catch(() => {});
  }, [token]);

  const shuffled = useMemo(() => seededShuffle(items, 42), [items]);

  useEffect(() => {
    if (!shuffled.length) return;
    let i = 0;
    while (i < shuffled.length && votes[shuffled[i].id]) i++;
    setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffled.length]);

  const refreshTally = useCallback(() => {
    if (!token) return;
    fetch(`/api/art-pool/vote?k=${encodeURIComponent(token)}&_t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { votes?: { itemId: string; vote: 'yes'|'no'|'other' }[] }) => {
        const itemMap = new Map(shuffled.map((it) => [it.id, it]));
        const t = { yes: 0, no: 0, other: 0, fluxYes: 0, openaiYes: 0 };
        for (const v of d.votes ?? []) {
          t[v.vote] += 1;
          if (v.vote === 'yes') {
            const it = itemMap.get(v.itemId);
            if (it?.provider === 'flux') t.fluxYes += 1;
            else if (it?.provider === 'openai') t.openaiYes += 1;
          }
        }
        setTally(t);
      })
      .catch(() => {});
  }, [token, shuffled]);
  useEffect(() => { refreshTally(); const iv = setInterval(refreshTally, 30000); return () => clearInterval(iv); }, [refreshTally]);

  const current = shuffled[index];
  const voted = Object.keys(votes).length;
  const total = shuffled.length;
  const pct = total ? Math.round((voted / total) * 100) : 0;

  const submit = useCallback(async (v: 'yes' | 'no' | 'other', commentText?: string) => {
    if (!current) return;
    if (v === 'other' && !commentText?.trim()) return;
    const next = { ...votes, [current.id]: { vote: v, comment: commentText } };
    setVotes(next); writeLocal(next);
    setCommentMode(false); setComment('');
    setIndex((i) => i + 1);
    await fetch(`/api/art-pool/vote?k=${encodeURIComponent(token)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: current.id, vote: v, comment: commentText, voterHash: voterRef.current }),
    }).catch(() => {});
  }, [current, votes, token]);

  const onYes = useCallback(() => submit('yes'), [submit]);
  const onNo = useCallback(() => submit('no'), [submit]);
  const onOther = useCallback(() => setCommentMode(true), []);
  const onSendComment = useCallback(() => submit('other', comment.trim()), [submit, comment]);
  const onUndo = useCallback(() => {
    if (index <= 0) return;
    const prev = shuffled[index - 1];
    if (!prev) return;
    const next = { ...votes }; delete next[prev.id];
    setVotes(next); writeLocal(next); setIndex(index - 1);
  }, [index, shuffled, votes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (commentMode) return;
      if (e.key === 'y' || e.key === 'Y') { e.preventDefault(); onYes(); }
      else if (e.key === 'n' || e.key === 'N') { e.preventDefault(); onNo(); }
      else if (e.key === 'o' || e.key === 'O') { e.preventDefault(); onOther(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); onUndo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commentMode, onYes, onNo, onOther, onUndo]);

  if (!token) return <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center px-6"><div className="max-w-md text-center"><div className="text-5xl mb-6">🔒</div><h1 className="text-2xl font-semibold mb-3">Access link required</h1><p className="text-white/60">Open with the full invite URL including <code>?k=…</code>.</p></div></div>;
  if (!shuffled.length) return <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center"><div className="text-white/60">Loading the art pool…</div></div>;
  if (index >= shuffled.length) {
    return (
      <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-6">✓</div>
          <h1 className="text-2xl font-semibold mb-3">All voted — thank you.</h1>
          <p className="text-white/60 leading-relaxed">{voted} votes recorded across {total} items.</p>
          <div className="mt-6 flex flex-col gap-1 text-[12px] text-white/50">
            <div>FLUX yeses: {tally.fluxYes} · OpenAI yeses: {tally.openaiYes}</div>
            <div>Total yes: {tally.yes} · no: {tally.no} · other-with-comment: {tally.other}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div className="h-full bg-white/80 transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <header className="flex items-center justify-between px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-white/40">
        <span>LoreVault · Art Pool</span>
        <span>{voted}/{total} · {pct}% · y{tally.yes} n{tally.no} other{tally.other}</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <figure className="flex flex-col items-center gap-3 w-full max-w-[520px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.path} alt={`${current.character} — ${current.parallel}`} className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10" loading="eager" />
          <figcaption className="text-center w-full">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <ProviderBadge provider={current.provider} />
              <span className="text-[9px] uppercase tracking-[0.22em] text-white/35 px-2 py-0.5 rounded-full border border-white/10">{current.parallel.split('—')[0].trim()}</span>
            </div>
            <div className="text-lg font-medium">{current.character}</div>
            <div className="text-[11px] text-white/40 mt-0.5 italic max-w-[440px] mx-auto">{current.moment}</div>
          </figcaption>
        </figure>
      </div>

      <div className="sticky bottom-0 w-full pb-[max(env(safe-area-inset-bottom),16px)] px-4 pt-4 bg-gradient-to-t from-[#0a0b14] via-[#0a0b14] to-transparent">
        {!commentMode ? (
          <div className="max-w-[520px] mx-auto flex gap-3">
            <button onClick={onNo} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 font-medium hover:bg-white/10 active:scale-[0.98] transition" aria-label="No">✗ <span className="opacity-60 text-xs ml-1">(N)</span></button>
            <button onClick={onOther} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 font-medium hover:bg-white/10 active:scale-[0.98] transition" aria-label="Comment required">💬 <span className="opacity-60 text-xs ml-1">(O)</span></button>
            <button onClick={onYes} className="flex-1 rounded-2xl bg-white text-black py-4 font-semibold hover:bg-white/90 active:scale-[0.98] transition" aria-label="Yes">✓ <span className="opacity-60 text-xs ml-1">(Y)</span></button>
          </div>
        ) : (
          <div className="max-w-[520px] mx-auto space-y-3">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/50">Tell the daemon what&apos;s off — required for &ldquo;other&rdquo;</div>
            <textarea autoFocus value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Specific feedback. The daemon reads these next cycle." rows={3} className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm resize-none focus:outline-none focus:border-white/30" />
            <div className="flex gap-3">
              <button onClick={() => { setCommentMode(false); setComment(''); }} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm hover:bg-white/10">Cancel</button>
              <button onClick={onSendComment} disabled={!comment.trim()} className="flex-1 rounded-2xl bg-white text-black py-3 font-semibold text-sm hover:bg-white/90 disabled:opacity-40">Send</button>
            </div>
          </div>
        )}
        <div className="max-w-[520px] mx-auto mt-3 flex justify-between text-[11px] uppercase tracking-[0.18em] text-white/30">
          <button onClick={onUndo} className="hover:text-white/60">← undo</button>
          <span>Y · N · O · ←</span>
        </div>
      </div>
    </div>
  );
}

export default function ArtPoolPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14] text-white/60 p-12">Loading…</div>}>
      <Body />
    </Suspense>
  );
}
