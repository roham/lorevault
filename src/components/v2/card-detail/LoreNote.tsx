import type { Tier } from '@/lib/v2/parallels-eligibility';
import type { Universe } from '@/lib/v2/cards';

interface LoreNoteProps {
  note: string;
  tier: Tier;
  universe: Universe;
}

const TIER_RULE: Record<Tier, string> = {
  common: 'var(--color-tier-common)',
  rare: 'var(--color-tier-rare)',
  legendary: 'var(--color-tier-legendary)',
  ultimate: 'var(--color-tier-ultimate)',
};

const UNIVERSE_FONT: Record<Universe, string> = {
  'baker-street': 'var(--font-baker-street)',
  'enchanted-kingdom': 'var(--font-ek-body)',
  wonderland: 'var(--font-baker-street)', // body in IM Fell English per §6.2
  'gothic-horror': 'var(--font-gothic-horror)',
  'greek-myth': 'var(--font-pullquote)', // Cormorant Garamond body
};

export function LoreNote({ note, tier, universe }: LoreNoteProps) {
  return (
    <div
      className="px-6 py-4 text-[15px] leading-[22px] text-[var(--color-v2-text)]"
      style={{
        borderLeft: `4px solid ${TIER_RULE[tier]}`,
        fontFamily: UNIVERSE_FONT[universe],
      }}
    >
      {note}
    </div>
  );
}
