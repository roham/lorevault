import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import fs from 'node:fs/promises';

const TOKEN = process.env.MOODBOARD_TOKEN?.trim();

export async function GET(request: NextRequest) {
  const tok = request.nextUrl.searchParams.get('k');
  if (TOKEN && tok !== TOKEN) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  const manifestPath = path.join(process.cwd(), 'public', 'moodboard-art', 'manifest.json');
  const minPromptVersion = parseInt(request.nextUrl.searchParams.get('minPromptVersion') ?? '5', 10);
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);
    // Only serve items at or above the requested prompt-template version,
    // so viewers don't see stale/weak v1 art while v2 is still filling in.
    const filtered = {
      ...manifest,
      items: (manifest.items ?? []).filter(
        (it: { promptVersion?: number }) => (it.promptVersion ?? 1) >= minPromptVersion,
      ),
    };
    filtered.totalImages = filtered.items.length;
    return NextResponse.json(filtered, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json({ version: 1, items: [], totalImages: 0 });
  }
}
