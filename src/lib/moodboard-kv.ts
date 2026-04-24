// Minimal Upstash/Vercel-KV REST client. No dependency — uses fetch.
// Env required in production:
//   KV_REST_API_URL       (e.g. https://<your>.upstash.io)
//   KV_REST_API_TOKEN     (read-write token)
// Dev fallback: an in-memory array (resets on cold start; dev only).

export type Vote = {
  itemId: string;
  vote: 'yes' | 'no' | 'other';
  comment?: string;
  timestamp: number;
  voterHash: string;
};

const LIST_KEY = 'lorevault:moodboard:votes';

const devMemory: Vote[] = [];

function kvEnv() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function kvFetch(body: unknown[]) {
  const env = kvEnv();
  if (!env) return null;
  const res = await fetch(env.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV ${res.status}: ${await res.text()}`);
  return res.json() as Promise<{ result: unknown }>;
}

export async function appendVote(vote: Vote): Promise<void> {
  const env = kvEnv();
  if (!env) {
    devMemory.unshift(vote);
    return;
  }
  await kvFetch(['LPUSH', LIST_KEY, JSON.stringify(vote)]);
}

export async function readAllVotes(): Promise<Vote[]> {
  const env = kvEnv();
  if (!env) return [...devMemory];
  const res = await kvFetch(['LRANGE', LIST_KEY, 0, -1]);
  const arr = (res?.result ?? []) as string[];
  return arr.map((s) => JSON.parse(s) as Vote);
}

export function hasKv(): boolean {
  return kvEnv() !== null;
}
