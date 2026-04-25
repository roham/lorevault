import { NextRequest, NextResponse } from 'next/server';

const TOKEN = process.env.MOODBOARD_TOKEN?.trim();
const KV_URL = process.env.KV_REST_API_URL?.trim();
const KV_TOKEN = process.env.KV_REST_API_TOKEN?.trim();

const LIST_KEY = 'lorevault:headtohead:votes';

type Vote = {
  pairId: string;
  winner: 'flux' | 'openai' | 'tie' | 'neither';
  comment?: string;
  timestamp: number;
  voterHash: string;
};

const devMemory: Vote[] = [];

async function kvLPush(value: string) {
  if (!KV_URL || !KV_TOKEN) {
    devMemory.unshift(JSON.parse(value));
    return;
  }
  const res = await fetch(KV_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['LPUSH', LIST_KEY, value]),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`kv ${res.status}: ${await res.text()}`);
}

export async function POST(request: NextRequest) {
  const tok = request.nextUrl.searchParams.get('k');
  if (TOKEN && tok !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  let body: Partial<Vote>;
  try { body = (await request.json()) as Partial<Vote>; }
  catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }); }
  if (!body.pairId || !['flux', 'openai', 'tie', 'neither'].includes(body.winner ?? '')) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  const vote: Vote = {
    pairId: String(body.pairId),
    winner: body.winner as Vote['winner'],
    comment: body.comment ? String(body.comment).slice(0, 2000) : undefined,
    timestamp: Date.now(),
    voterHash: String(body.voterHash ?? 'anon').slice(0, 32),
  };
  try { await kvLPush(JSON.stringify(vote)); return NextResponse.json({ ok: true }); }
  catch (err) { return NextResponse.json({ error: 'write failed', detail: String(err) }, { status: 500 }); }
}

export async function GET(request: NextRequest) {
  const tok = request.nextUrl.searchParams.get('k');
  if (TOKEN && tok !== TOKEN) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ ok: true, kvConfigured: false, votes: devMemory });
  }
  try {
    const res = await fetch(KV_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['LRANGE', LIST_KEY, 0, -1]),
      cache: 'no-store',
    });
    const data = await res.json();
    const arr = (data?.result ?? []) as string[];
    const votes = arr.map((s) => JSON.parse(s));
    return NextResponse.json({ ok: true, kvConfigured: true, voteCount: votes.length, votes });
  } catch (err) {
    return NextResponse.json({ error: 'read failed', detail: String(err) }, { status: 500 });
  }
}
