'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type Item = {
  id: string;
  character: string;
  characterSlug: string;
  set?: string;
  moment?: string;
  style: string;
  styleSlug: string;
  variant: number;
  path: string;
};

type Manifest = {
  version: number;
  generatedAt: string | null;
  totalImages: number;
  items: Item[];
};

type LocalVote = { vote: 'yes' | 'no' | 'other'; comment?: string; at: number };

const LS_KEY = 'lorevault_moodboard_votes_v1';
const LS_VOTER = 'lorevault_moodboard_voter_v1';

function readLocalVotes(): Record<string, LocalVote> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
  } catch {
    return {};
  }
}
function writeLocalVotes(v: Record<string, LocalVote>) {
  localStorage.setItem(LS_KEY, JSON.stringify(v));
}
function getVoterHash(): string {
  const existing = localStorage.getItem(LS_VOTER);
  if (existing) return existing;
  const h = Math.random().toString(36).slice(2, 14);
  localStorage.setItem(LS_VOTER, h);
  return h;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function MoodboardBody() {
  const params = useSearchParams();
  const token = params?.get('k') ?? '';
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, LocalVote>>({});
  const [commentMode, setCommentMode] = useState(false);
  const [comment, setComment] = useState('');
  const voterHashRef = useRef<string>('');

  // Init voter hash + restore local votes
  useEffect(() => {
    voterHashRef.current = getVoterHash();
    const v = readLocalVotes();
    setVotes(v);
  }, []);

  // Load manifest
  useEffect(() => {
    const url = `/api/moodboard/items${token ? `?k=${encodeURIComponent(token)}` : ''}`;
    fetch(url, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(`items ${r.status}`);
        return r.json();
      })
      .then((m: Manifest) => setManifest(m))
      .catch((e) => setLoadError(String(e)));
  }, [token]);

  const shuffled = useMemo(() => {
    if (!manifest) return [] as Item[];
    return seededShuffle(manifest.items, 42);
  }, [manifest]);

  // Jump past already-voted items on first load
  useEffect(() => {
    if (!shuffled.length) return;
    let i = 0;
    while (i < shuffled.length && votes[shuffled[i].id]) i++;
    setIndex(i);
    // only once per shuffled list refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffled.length]);

  const current = shuffled[index];
  const voted = Object.keys(votes).length;
  const total = shuffled.length;
  const pct = total > 0 ? Math.round((voted / total) * 100) : 0;

  const submit = useCallback(
    async (v: 'yes' | 'no' | 'other', commentText?: string) => {
      if (!current) return;
      const next: Record<string, LocalVote> = {
        ...votes,
        [current.id]: { vote: v, comment: commentText, at: Date.now() },
      };
      setVotes(next);
      writeLocalVotes(next);
      setCommentMode(false);
      setComment('');
      setIndex((i) => i + 1);
      const url = `/api/moodboard/vote${token ? `?k=${encodeURIComponent(token)}` : ''}`;
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: current.id,
            vote: v,
            comment: commentText,
            voterHash: voterHashRef.current,
          }),
        });
      } catch {
        // Non-fatal: local state still has the vote; daemon will re-try sync if needed.
      }
    },
    [current, votes, token],
  );

  const onYes = useCallback(() => submit('yes'), [submit]);
  const onNo = useCallback(() => submit('no'), [submit]);
  const onOther = useCallback(() => setCommentMode(true), []);
  const onSendComment = useCallback(() => submit('other', comment.trim() || '(no comment)'), [submit, comment]);
  const onUndo = useCallback(() => {
    if (index <= 0) return;
    const prev = shuffled[index - 1];
    if (!prev) return;
    const next = { ...votes };
    delete next[prev.id];
    setVotes(next);
    writeLocalVotes(next);
    setIndex(index - 1);
  }, [index, shuffled, votes]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (commentMode) return;
      if (e.key === 'y' || e.key === 'Y') { e.preventDefault(); onYes(); }
      else if (e.key === 'n' || e.key === 'N') { e.preventDefault(); onNo(); }
      else if (e.key === 'o' || e.key === 'O') { e.preventDefault(); onOther(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); onUndo(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setIndex((i) => Math.min(i + 1, shuffled.length)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commentMode, onYes, onNo, onOther, onUndo, shuffled.length]);

  if (loadError) {
    return <Shell>Couldn&apos;t load manifest: {loadError}</Shell>;
  }
  if (!manifest) {
    return <Shell>Loading…</Shell>;
  }
  if (manifest.items.length === 0) {
    return (
      <Shell>
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">🌱</div>
          <h1 className="text-2xl font-semibold mb-3">Seeding the mood-board</h1>
          <p className="text-white/60 leading-relaxed">
            The taste daemon is generating the first batch of character&nbsp;×&nbsp;style variants.
            Refresh in 10–15 minutes.
          </p>
        </div>
      </Shell>
    );
  }
  if (index >= shuffled.length) {
    return (
      <Shell>
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">✓</div>
          <h1 className="text-2xl font-semibold mb-3">All done — thank you.</h1>
          <p className="text-white/60 leading-relaxed mb-8">
            {voted} votes recorded. The daemon reads these before the next art batch
            and will prioritize styles you approved.
          </p>
          <a
            className="inline-block rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/5 transition"
            href={`/moodboard/results${token ? `?k=${encodeURIComponent(token)}` : ''}`}
          >
            View results →
          </a>
        </div>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div
          className="h-full bg-white/80 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <header className="flex items-center justify-between px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-white/40">
        <span>LoreVault · Taste Survey</span>
        <span>
          {voted} / {total} · {pct}%
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <figure className="flex flex-col items-center gap-4 w-full max-w-[520px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.path}
            alt={`${current.character} in ${current.style}`}
            className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10"
            loading="eager"
          />
          <figcaption className="text-center">
            <div className="text-lg font-medium">{current.character}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40 mt-1">
              {current.style}
              {current.set ? ` · ${current.set}` : ''}
            </div>
            {current.moment && (
              <div className="text-[11px] text-white/30 mt-1 italic">{current.moment}</div>
            )}
          </figcaption>
        </figure>
      </div>

      <div className="sticky bottom-0 w-full pb-[max(env(safe-area-inset-bottom),16px)] px-4 pt-4 bg-gradient-to-t from-[#0a0b14] via-[#0a0b14] to-transparent">
        {!commentMode ? (
          <div className="max-w-[520px] mx-auto flex gap-3">
            <button
              onClick={onNo}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 font-medium hover:bg-white/10 active:scale-[0.98] transition"
              aria-label="Disapprove"
            >
              ✗ <span className="opacity-60 text-xs ml-1">(N)</span>
            </button>
            <button
              onClick={onOther}
              className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 font-medium hover:bg-white/10 active:scale-[0.98] transition"
              aria-label="Comment"
            >
              💬 <span className="opacity-60 text-xs ml-1">(O)</span>
            </button>
            <button
              onClick={onYes}
              className="flex-1 rounded-2xl bg-white text-black py-4 font-semibold hover:bg-white/90 active:scale-[0.98] transition"
              aria-label="Approve"
            >
              ✓ <span className="opacity-60 text-xs ml-1">(Y)</span>
            </button>
          </div>
        ) : (
          <div className="max-w-[520px] mx-auto space-y-3">
            <textarea
              autoFocus
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What&apos;s off? (optional)"
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm resize-none focus:outline-none focus:border-white/30"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCommentMode(false);
                  setComment('');
                }}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={onSendComment}
                className="flex-1 rounded-2xl bg-white text-black py-3 font-semibold text-sm hover:bg-white/90"
              >
                Send
              </button>
            </div>
          </div>
        )}
        <div className="max-w-[520px] mx-auto mt-3 flex justify-between text-[11px] uppercase tracking-[0.18em] text-white/30">
          <button onClick={onUndo} className="hover:text-white/60" aria-label="Undo previous">
            ← undo
          </button>
          <span>Y · N · O · ← → arrows</span>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-white flex items-center justify-center px-6">
      {children}
    </div>
  );
}

export default function MoodboardPage() {
  return (
    <Suspense fallback={<Shell>Loading…</Shell>}>
      <MoodboardBody />
    </Suspense>
  );
}
