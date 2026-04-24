import { NextRequest, NextResponse } from 'next/server';
import { appendVote, type Vote } from '@/lib/moodboard-kv';

const TOKEN = process.env.MOODBOARD_TOKEN?.trim();

export async function POST(request: NextRequest) {
  const tok = request.nextUrl.searchParams.get('k');
  if (TOKEN && tok !== TOKEN) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  let body: Partial<Vote>;
  try {
    body = (await request.json()) as Partial<Vote>;
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }
  if (!body.itemId || !['yes', 'no', 'other'].includes(body.vote ?? '')) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  const vote: Vote = {
    itemId: String(body.itemId),
    vote: body.vote as 'yes' | 'no' | 'other',
    comment: body.comment ? String(body.comment).slice(0, 2000) : undefined,
    timestamp: Date.now(),
    voterHash: String(body.voterHash ?? 'anon').slice(0, 32),
  };
  try {
    await appendVote(vote);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'write failed', detail: String(err) },
      { status: 500 },
    );
  }
}
