'use client'

import { useActionState } from 'react'
import { subscribeToJournal, type SubscribeState } from './actions'

export function SubscribeForm() {
  const [state, action, pending] = useActionState<SubscribeState, FormData>(
    subscribeToJournal,
    null
  )

  if (state?.ok) {
    return (
      <p className="text-[12px] text-[#b0a090] font-mono leading-relaxed">
        You are on the list. The first entry arrives 3 May 2026.
      </p>
    )
  }

  return (
    <form action={action}>
      <div className="flex gap-2 flex-wrap">
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className="flex-1 min-w-[180px] bg-transparent border border-[#2a2420] px-3 py-2 text-[11px] font-mono text-[#e8e0d0] placeholder-[#3a3028] focus:outline-none focus:border-[#6a5e50]"
        />
        <button
          type="submit"
          disabled={pending}
          className="border border-[#4a3e30] px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-mono text-[#b0a090] hover:border-[#8a7e6e] hover:text-[#e8e0d0] transition-colors disabled:opacity-40"
        >
          {pending ? '...' : 'Subscribe'}
        </button>
      </div>
      {state?.error && (
        <p className="mt-2 text-[10px] text-[#8a5050] font-mono">{state.error}</p>
      )}
    </form>
  )
}
