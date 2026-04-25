import { NextRequest, NextResponse } from 'next/server';

const TOKEN = process.env.MOODBOARD_TOKEN?.trim();
const KV_URL = process.env.KV_REST_API_URL?.trim();
const KV_TOKEN = process.env.KV_REST_API_TOKEN?.trim();
const LIST_KEY = 'lorevault:art-pool:votes';

type Vote = {
  itemId: string;
  vote: 'yes' | 'no' | 'other';
  comment?: string;
  timestamp: number;
  voterHash: string;
};

const devMemory: Vote[] = [];

async function kvCall(body: unknown[]) {
  if (!KV_URL || !KV_TOKEN) return null;
  const res = await fetch(KV_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`kv ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function POST(request: NextRequest) {
  const tok = request.nextUrl.searchParams.get('k');
  if (TOKEN && tok !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  let body: Partial<Vote>;
  try { body = (await request.json()) as Partial<Vote>; }
  catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  if (!body.itemId || !['yes', 'no', 'other'].includes(body.vote ?? '')) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  // "other" requires a non-empty comment
  if (body.vote === 'other' && !body.comment?.trim()) {
    return NextResponse.json({ error: 'other requires comment' }, { status: 400 });
  }
  const vote: Vote = {
    itemId: String(body.itemId),
    vote: body.vote as Vote['vote'],
    comment: body.comment ? String(body.comment).slice(0, 2000) : undefined,
    timestamp: Date.now(),
    voterHash: String(body.voterHash ?? 'anon').slice(0, 32),
  };
  try {
    if (KV_URL && KV_TOKEN) await kvCall(['LPUSH', LIST_KEY, JSON.stringify(vote)]);
    else devMemory.unshift(vote);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'write failed', detail: String(err) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const tok = request.nextUrl.searchParams.get('k');
  if (TOKEN && tok !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ ok: true, kvConfigured: false, voteCount: devMemory.length, votes: devMemory });
  }
  try {
    const res = await kvCall(['LRANGE', LIST_KEY, 0, -1]);
    const arr = ((res as { result?: unknown })?.result ?? []) as string[];
    const votes = arr.map((s) => JSON.parse(s));
    return NextResponse.json({ ok: true, kvConfigured: true, voteCount: votes.length, votes });
  } catch (err) {
    return NextResponse.json({ error: 'read failed', detail: String(err) }, { status: 500 });
  }
}
