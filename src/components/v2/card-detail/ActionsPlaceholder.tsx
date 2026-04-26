/**
 * Phase 4 section 1.9: actions are DEFERRED to Phase 6+. Reserved 60px slot,
 * hidden behind the `actionsEnabled=false` feature flag. We render a discreet
 * placeholder so the chassis math holds; no destructive-CTA / share / list
 * strings ever appear in the rendered DOM.
 *
 * Banned-chrome check (Phase 4 section 10) runs against the rendered output;
 * keeping this comment free of the forbidden tokens too.
 */

interface ActionsPlaceholderProps {
  actionsEnabled?: boolean;
}

export function ActionsPlaceholder({ actionsEnabled = false }: ActionsPlaceholderProps) {
  if (!actionsEnabled) {
    // Reserve the slot height with a neutral hairline; emit no banned strings.
    return <div className="h-[60px] border-t border-[var(--color-v2-rule)]" aria-hidden="true" />;
  }
  return null;
}
