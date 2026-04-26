'use client';

interface TOCSection {
  id: string;
  label: string;
}

interface GDCTOCProps {
  sections: TOCSection[];
}

export function GDCTOC({ sections }: GDCTOCProps) {
  return (
    <nav aria-label="Table of contents">
      <p
        style={{
          fontFamily: 'var(--font-baker-street), serif',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9A26B',
          opacity: 0.6,
          marginBottom: '1rem',
        }}
      >
        Contents
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
        {sections.map((s) => {
          const [num, label] = s.label.split(' — ');
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'baseline',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                  color: 'inherit',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201,162,107,0.07)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-baker-street), serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    color: '#C9A26B',
                    opacity: 0.6,
                    flexShrink: 0,
                    paddingTop: '0.1rem',
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-baker-street), serif',
                    fontSize: '0.72rem',
                    letterSpacing: '0.03em',
                    color: '#a09080',
                    lineHeight: 1.35,
                  }}
                >
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(201,162,107,0.12)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-baker-street), serif',
            fontSize: '0.62rem',
            letterSpacing: '0.08em',
            color: '#6B8FA8',
            opacity: 0.5,
            lineHeight: 1.5,
          }}
        >
          LoreVault Canon Council
          <br />
          GDD V1 · 2026-04-26
        </p>
      </div>
    </nav>
  );
}
