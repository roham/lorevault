import type { CSSProperties, ReactNode } from 'react';

// ─── Palette + typography (mirrors V1 surfaces) ──────────────────────────────

export const V2_PALETTE = {
  bg: '#0a0907',
  text: '#e8e0d0',
  bodyDim: '#d8cfc0',
  gold: '#C9A26B',
  blue: '#6B8FA8',
  rule: 'rgba(201,162,107,0.15)',
};

export const SECTION_NUM: CSSProperties = {
  fontFamily: 'var(--font-baker-street), serif',
  color: V2_PALETTE.blue,
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '0.4rem',
  opacity: 0.8,
};

export const SECTION_H2: CSSProperties = {
  fontFamily: 'var(--font-pullquote), Georgia, serif',
  fontStyle: 'italic',
  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
  color: V2_PALETTE.text,
  lineHeight: 1.15,
  marginBottom: '0.5rem',
  marginTop: '0',
};

export const SECTION_UNDERLINE: CSSProperties = {
  height: '2px',
  background: 'linear-gradient(90deg, #C9A26B 0%, transparent 100%)',
  marginBottom: '2rem',
  width: '8rem',
  opacity: 0.7,
};

export const H3: CSSProperties = {
  fontFamily: 'var(--font-pullquote), Georgia, serif',
  fontStyle: 'italic',
  fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
  color: V2_PALETTE.gold,
  lineHeight: 1.25,
  marginTop: '2.5rem',
  marginBottom: '0.75rem',
};

export const BODY_P: CSSProperties = {
  fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
  fontSize: '1rem',
  lineHeight: 1.72,
  color: V2_PALETTE.bodyDim,
  marginBottom: '1.25rem',
  maxWidth: '65ch',
};

export const PULLQUOTE: CSSProperties = {
  fontFamily: 'var(--font-pullquote), Georgia, serif',
  fontStyle: 'italic',
  fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
  color: V2_PALETTE.gold,
  lineHeight: 1.5,
  borderLeft: `3px solid ${V2_PALETTE.gold}`,
  paddingLeft: '1.5rem',
  margin: '2rem 0',
  opacity: 0.95,
};

// ─── Reusable atoms ──────────────────────────────────────────────────────────

export function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginTop: '4rem', marginBottom: '1.5rem' }}>
      <span style={SECTION_NUM}>{num}</span>
      <h2 style={SECTION_H2}>{title}</h2>
      <div style={SECTION_UNDERLINE} />
    </div>
  );
}

export function H3El({ children }: { children: ReactNode }) {
  return <h3 style={H3}>{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p style={BODY_P}>{children}</p>;
}

export function PQ({ children }: { children: ReactNode }) {
  return <blockquote style={PULLQUOTE}>{children}</blockquote>;
}

// Italic emphasis helper for inline literary titles
export function I({ children }: { children: ReactNode }) {
  return <em style={{ fontStyle: 'italic', color: V2_PALETTE.text }}>{children}</em>;
}

// ─── CardExample ─────────────────────────────────────────────────────────────

interface CardExampleProps {
  name: string;
  pane: string;
  rarity: string;
  flavor: string;
  buriedWeight: string;
}

export function CardExample({ name, pane, rarity, flavor, buriedWeight }: CardExampleProps) {
  return (
    <figure
      style={{
        margin: '2rem 0',
        padding: '1.5rem 1.75rem',
        border: '1px solid rgba(201,162,107,0.25)',
        borderLeft: `3px solid ${V2_PALETTE.gold}`,
        background: 'rgba(255,255,255,0.02)',
        maxWidth: '60ch',
      }}
    >
      <figcaption
        style={{
          fontFamily: 'var(--font-baker-street), serif',
          fontSize: '0.65rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: V2_PALETTE.blue,
          opacity: 0.85,
          marginBottom: '0.5rem',
        }}
      >
        Card Example · {pane} · {rarity}
      </figcaption>
      <p
        style={{
          fontFamily: 'var(--font-pullquote), Georgia, serif',
          fontStyle: 'italic',
          fontSize: '1.15rem',
          color: V2_PALETTE.text,
          lineHeight: 1.3,
          marginTop: 0,
          marginBottom: '0.85rem',
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: V2_PALETTE.bodyDim,
          marginBottom: '1rem',
        }}
      >
        {flavor}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-baker-street), serif',
          fontSize: '0.78rem',
          letterSpacing: '0.04em',
          color: V2_PALETTE.gold,
          lineHeight: 1.55,
          opacity: 0.8,
          margin: 0,
        }}
      >
        Buried weight: <span style={{ color: V2_PALETTE.bodyDim }}>{buriedWeight}</span>
      </p>
    </figure>
  );
}

// ─── CodeBlock ───────────────────────────────────────────────────────────────

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div style={{ margin: '1.75rem 0', maxWidth: '70ch' }}>
      {label ? (
        <p
          style={{
            fontFamily: 'var(--font-baker-street), serif',
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: V2_PALETTE.blue,
            opacity: 0.8,
            marginBottom: '0.4rem',
          }}
        >
          {label}
        </p>
      ) : null}
      <pre
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(201,162,107,0.18)',
          borderRadius: '2px',
          padding: '1rem 1.25rem',
          fontFamily: 'monospace',
          fontSize: '0.78rem',
          lineHeight: 1.55,
          color: '#cdb992',
          overflowX: 'auto',
          margin: 0,
          whiteSpace: 'pre',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── IllustrationPlaceholder ─────────────────────────────────────────────────

export function IllustrationPlaceholder({
  id,
  caption,
  aspectRatio = '16 / 9',
}: {
  id: string;
  caption: string;
  aspectRatio?: string;
}) {
  return (
    <figure style={{ margin: '2rem 0', maxWidth: '70ch' }}>
      <div
        style={{
          aspectRatio,
          width: '100%',
          background:
            'repeating-linear-gradient(45deg, rgba(201,162,107,0.05) 0px, rgba(201,162,107,0.05) 8px, rgba(107,143,168,0.05) 8px, rgba(107,143,168,0.05) 16px)',
          border: '1px dashed rgba(201,162,107,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-baker-street), serif',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: V2_PALETTE.gold,
            opacity: 0.85,
            marginBottom: '0.6rem',
          }}
        >
          Illustration · {id} · pending pipeline
        </span>
        <p
          style={{
            fontFamily: 'var(--font-pullquote), Georgia, serif',
            fontStyle: 'italic',
            fontSize: '0.95rem',
            color: V2_PALETTE.bodyDim,
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '52ch',
            margin: 0,
          }}
        >
          {caption}
        </p>
      </div>
    </figure>
  );
}

// ─── BulletRow (used sparingly — only where the spec calls for it) ───────────

export function TierRow({
  tier,
  title,
  body,
}: {
  tier: string;
  title: string;
  body: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '6rem 1fr',
        gap: '1rem',
        padding: '1rem 0',
        borderTop: '1px solid rgba(201,162,107,0.12)',
        maxWidth: '70ch',
      }}
    >
      <div>
        <span
          style={{
            fontFamily: 'var(--font-baker-street), serif',
            fontSize: '0.65rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: V2_PALETTE.gold,
            display: 'block',
          }}
        >
          {tier}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-pullquote), Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: V2_PALETTE.text,
            lineHeight: 1.2,
            display: 'block',
            marginTop: '0.3rem',
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
          fontSize: '0.95rem',
          lineHeight: 1.65,
          color: V2_PALETTE.bodyDim,
        }}
      >
        {body}
      </div>
    </div>
  );
}
