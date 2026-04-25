'use server'

const KV_KEY = 'lorevault:journal:subscribers'

const devList: string[] = []

function kvEnv() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
}

async function kvPush(value: string): Promise<void> {
  const env = kvEnv()
  if (!env) {
    devList.push(value)
    return
  }
  const res = await fetch(env.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['RPUSH', KV_KEY, value]),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`KV ${res.status}: ${await res.text()}`)
}

export type SubscribeState = { ok: boolean; error?: string } | null

export async function subscribeToJournal(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const raw = formData.get('email')
  const email = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  if (!email || !email.includes('@') || email.split('@')[1]?.includes('.') === false) {
    return { ok: false, error: 'A valid email is required.' }
  }
  try {
    await kvPush(email)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Could not save subscription. Try again shortly.' }
  }
}
