interface OwnerTrailProps {
  owner: { displayName: string; avatarUrl?: string } | null;
}

/**
 * OwnerTrail — minted-only. For the v2 slice all sample cards are unminted,
 * so this renders a "Reserved on mint" placeholder rather than the full trail.
 *
 * Per Phase 4 §1.8: when unminted, the component is OMITTED entirely. We render
 * a neutral placeholder instead so the chassis is visible without faking
 * ownership data the spec forbids (no wallet addresses on customer surfaces).
 */
export function OwnerTrail({ owner }: OwnerTrailProps) {
  if (!owner) {
    return (
      <div className="px-4 py-4 border-t border-[var(--color-v2-rule)]">
        <p className="text-[12px] uppercase tracking-[0.15em] text-[var(--color-v2-text-muted)] [font-family:var(--font-v2-ui)]">
          Held by — reserved on mint
        </p>
      </div>
    );
  }
  return (
    <div className="px-4 py-4 border-t border-[var(--color-v2-rule)] flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-[var(--color-v2-ink)] border border-[var(--color-v2-rule)]" />
      <p className="text-[14px] text-[var(--color-v2-text)] [font-family:var(--font-v2-ui)]">
        {owner.displayName}
      </p>
    </div>
  );
}
