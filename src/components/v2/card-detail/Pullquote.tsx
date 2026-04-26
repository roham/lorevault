interface PullquoteProps {
  quote: string;
  attribution?: string;
}

export function Pullquote({ quote, attribution }: PullquoteProps) {
  return (
    <blockquote className="px-6 py-6 text-[var(--color-v2-text)] [font-family:var(--font-pullquote)]">
      <p className="text-[22px] leading-[30px] italic">
        &ldquo;{quote}&rdquo;
      </p>
      {attribution ? (
        <footer className="mt-2 text-[14px] uppercase tracking-[0.08em] not-italic text-[var(--color-v2-text-dim)] [font-family:var(--font-v2-ui)]">
          {attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}
