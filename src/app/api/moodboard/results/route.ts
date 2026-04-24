import { NextRequest, NextResponse } from 'next/server';
import { readAllVotes, hasKv } from '@/lib/moodboard-kv';

const TOKEN = process.env.MOODBOARD_TOKEN?.trim();

export async function GET(request: NextRequest) {
  const tok = request.nextUrl.searchParams.get('k');
  if (TOKEN && tok !== TOKEN) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  try {
    const votes = await readAllVotes();
    return NextResponse.json({
      ok: true,
      kvConfigured: hasKv(),
      voteCount: votes.length,
      votes,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'read failed', detail: String(err) },
      { status: 500 },
    );
  }
}
