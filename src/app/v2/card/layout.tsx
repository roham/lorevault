import { UNIVERSE_FONT_VARS } from '@/lib/v2/fonts';

/**
 * Card-detail subtree layout — loads the 5 per-Universe faces only when the
 * user enters a card route. Phase 4 §6.2 needs all 5 simultaneously available
 * because the LoreNote per-Universe override is rendered server-side via CSS
 * variables.
 */
export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <div className={UNIVERSE_FONT_VARS}>{children}</div>;
}
