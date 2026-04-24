'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Vote = {
  itemId: string;
  vote: 'yes' | 'no' | 'other';
  comment?: string;
  timestamp: number;
  voterHash: string;
};

type Item = {
  id: string;
  character: string;
  characterSlug: string;
  set?: string;
  style: string;
  styleSlug: string;
  variant: number;
  path: string;
};

function Body() {
  const params = useSearchParams();
  const token = params?.get('k') ?? '';
  const [votes, setVotes] = useState<Vote[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [kvOn, setKvOn] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const q = token ? `?k=${encodeURIComponent(token)}` : '';
    Promise.all([
      fetch(`/api/moodboard/results${q}`, { cache: 'no-store' }).then((r) => r.json()),
      fetch(`/api/moodboard/items${q}`, { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([res, manifest]) => {
        if (res.error) throw new Error(res.error);
        setVotes(res.votes ?? []);
        setKvOn(!!res.kvConfigured);
        setItems(manifest.items ?? []);
      })
      .catch((e) => setErr(String(e)));
  }, [token]);

  const byItem = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const styleBoard = useMemo(() => {
    const agg = new Map<string, { yes: number; no: number; other: number; label: string }>();
    for (const v of votes) {
      const it = byItem.get(v.itemId);
      if (!it) continue;
      const key = it.styleSlug;
      const row = agg.get(key) ?? { yes: 0, no: 0, other: 0, label: it.style };
      row[v.vote] += 1;
      agg.set(key, row);
    }
    return [...agg.entries()]
      .map(([k, r]) => {
        const total = r.yes + r.no + r.other;
        return { key: k, label: r.label, yes: r.yes, no: r.no, other: r.other, total, approval: total ? r.yes / total : 0 };
      })
      .sort((a, b) => b.approval - a.approval);
  }, [votes, byItem]);

  const charBoard = useMemo(() => {
    const agg = new Map<string, { yes: number; no: number; other: number; label: string }>();
    for (const v of votes) {
      const it = byItem.get(v.itemId);
      if (!it) continue;
      const key = it.characterSlug;
      const row = agg.get(key) ?? { yes: 0, no: 0, other: 0, label: it.character };
      row[v.vote] += 1;
      agg.set(key, row);
    }
    return [...agg.entries()]
      .map(([k, r]) => {
        const total = r.yes + r.no + r.other;
        return { key: k, label: r.label, yes: r.yes, no: r.no, other: r.other, total, approval: total ? r.yes / total : 0 };
      })
      .sort((a, b) => b.approval - a.approval);
  }, [votes, byItem]);

  const comments = useMemo(
    () =>
      votes
        .filter((v) => v.vote === 'other' && v.comment)
        .sort((a, b) => b.timestamp - a.timestamp),
    [votes],
  );

  const approvedIds = useMemo(() => {
    const lastByVoter = new Map<string, Vote>();
    for (const v of votes) {
      const key = `${v.itemId}::${v.voterHash}`;
      const prev = lastByVoter.get(key);
      if (!prev || prev.timestamp < v.timestamp) lastByVoter.set(key, v);
    }
    return [...lastByVoter.values()]
      .filter((v) => v.vote === 'yes')
      .map((v) => v.itemId);
  }, [votes]);

  return (
    <div className="min-h-screen bg-[#0a0b14] text-[#f0f0e8] px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
          <h1 className="text-2xl font-semibold">Mood-board results</h1>
          <div className="text-sm text-white/50 mt-1">
            {votes.length} vote{votes.length === 1 ? '' : 's'} · {items.length} items in rotation ·{' '}
            {kvOn ? 'KV ✓' : <span className="text-yellow-400">in-memory (set KV_REST_API_URL to persist)</span>}
          </div>
          {err && <div className="text-red-400 text-sm mt-2">Error: {err}</div>}
        </header>

        <section>
          <h2 className="text-xs uppercase tracking-[0.22em] text-white/40 mb-3">Styles — approval rate</h2>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            {styleBoard.length === 0 && <div className="p-4 text-white/40 text-sm">No votes yet.</div>}
            {styleBoard.map((r) => (
              <div key={r.key} className="flex items-center gap-3 px-4 py-3 border-t border-white/5 first:border-t-0">
                <div className="flex-1 truncate">{r.label}</div>
                <div className="w-36 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#f0f0e8]/80" style={{ width: `${Math.round(r.approval * 100)}%` }} />
                </div>
                <div className="w-12 text-right text-sm tabular-nums">{Math.round(r.approval * 100)}%</div>
                <div className="w-10 text-right text-xs text-white/40 tabular-nums">{r.total}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.22em] text-white/40 mb-3">Characters — approval rate</h2>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            {charBoard.length === 0 && <div className="p-4 text-white/40 text-sm">No votes yet.</div>}
            {charBoard.map((r) => (
              <div key={r.key} className="flex items-center gap-3 px-4 py-3 border-t border-white/5 first:border-t-0">
                <div className="flex-1 truncate">{r.label}</div>
                <div className="w-36 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#f0f0e8]/80" style={{ width: `${Math.round(r.approval * 100)}%` }} />
                </div>
                <div className="w-12 text-right text-sm tabular-nums">{Math.round(r.approval * 100)}%</div>
                <div className="w-10 text-right text-xs text-white/40 tabular-nums">{r.total}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-[0.22em] text-white/40 mb-3">
            Comments ({comments.length})
          </h2>
          <div className="space-y-3">
            {comments.length === 0 && <div className="text-white/40 text-sm">No comments yet.</div>}
            {comments.map((v, i) => {
              const it = byItem.get(v.itemId);
              return (
                <div key={i} className="rounded-xl border border-white/10 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                    {it ? `${it.character} · ${it.style}` : v.itemId}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{v.comment}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="pt-4 border-t border-white/10">
          <h2 className="text-xs uppercase tracking-[0.22em] text-white/40 mb-3">Approved set</h2>
          <div className="text-sm text-white/60 mb-2">
            {approvedIds.length} item{approvedIds.length === 1 ? '' : 's'} voted ✓ by latest vote.
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer text-white/60 hover:text-white">Show JSON</summary>
            <pre className="mt-3 text-xs bg-black/40 rounded-xl p-4 overflow-auto max-h-80">
              {JSON.stringify({ approvedIds }, null, 2)}
            </pre>
          </details>
        </section>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0b14] text-[#f0f0e8]/60 p-10">Loading…</div>}>
      <Body />
    </Suspense>
  );
}
