import type { Metadata } from 'next';
import { GDDContent } from '@/components/gdd/GDDContent';
import { GDCTOC } from '@/components/gdd/GDCTOC';

export const metadata: Metadata = {
  title: 'LoreVault GDD V1 — The Lattice and the Lampblack',
  description:
    'The canonical Game Design Document for LoreVault v3 — the Lattice and the Lampblack, five Panes, eight Shells, five Parallels, four Tiers, five packs, the iceberg, the voice, the Spines, the tethers, the calendar, the Council, the differentiator, and the anti-vision.',
};

const LAST_UPDATED = '2026-04-26';

const SECTIONS = [
  { id: 'section-1', label: '§ 1 — The Two Nouns' },
  { id: 'section-2', label: '§ 2 — The Five Panes' },
  { id: 'section-3', label: '§ 3 — The Eight Shells' },
  { id: 'section-4', label: '§ 4 — The Five Parallels' },
  { id: 'section-5', label: '§ 5 — The Four Tiers' },
  { id: 'section-6', label: '§ 6 — The Pack Ladder' },
  { id: 'section-7', label: '§ 7 — The Iceberg Doctrine' },
  { id: 'section-8', label: '§ 8 — The Voice' },
  { id: 'section-9', label: '§ 9 — The Lampblacker-Spines' },
  { id: 'section-10', label: '§ 10 — The Cross-Tether Map' },
  { id: 'section-11', label: '§ 11 — The Live-Ops Calendar' },
  { id: 'section-12', label: '§ 12 — Series-1 Roadmap' },
  { id: 'section-13', label: '§ 13 — The Council' },
  { id: 'section-14', label: '§ 14 — The Differentiator' },
  { id: 'section-15', label: '§ 15 — The Anti-Vision' },
];

export default function GDDPage() {
  return (
    <div
      style={{
        background: '#0a0907',
        minHeight: '100vh',
        color: '#e8e0d0',
      }}
    >
      {/* ─── Sticky top nav ──────────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(10,9,7,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(201,162,107,0.15)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '3rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-baker-street), serif',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#C9A26B',
              opacity: 0.8,
            }}
          >
            LoreVault · GDD V1
          </span>
          {/* Mobile menu indicator */}
          <nav
            aria-label="Table of contents (desktop)"
            className="hidden lg:flex"
            style={{ gap: '1.25rem', alignItems: 'center' }}
          >
            {SECTIONS.slice(0, 5).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontFamily: 'var(--font-baker-street), serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#6B8FA8',
                  textDecoration: 'none',
                  opacity: 0.75,
                  transition: 'opacity 0.15s',
                }}
              >
                {s.label.split(' — ')[0]}
              </a>
            ))}
            <span style={{ color: 'rgba(201,162,107,0.3)', fontSize: '0.6rem' }}>···</span>
          </nav>
        </div>
      </header>

      {/* ─── Hero section ─────────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
          borderBottom: '1px solid rgba(201,162,107,0.12)',
          background:
            'linear-gradient(180deg, rgba(27,24,20,0.6) 0%, rgba(10,9,7,0) 100%)',
        }}
      >
        {/* Decorative top rule */}
        <div
          style={{
            width: '3rem',
            height: '1px',
            background: '#C9A26B',
            margin: '0 auto 2rem',
            opacity: 0.5,
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-baker-street), serif',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#6B8FA8',
            marginBottom: '1.25rem',
            opacity: 0.8,
          }}
        >
          Game Design Document · Version 1 · 2026-04-26
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-pullquote), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            color: '#e8e0d0',
            lineHeight: 1.08,
            marginBottom: '1.25rem',
            maxWidth: '18ch',
            margin: '0 auto 1.25rem',
          }}
        >
          The Lattice and the Lampblack
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            color: '#C9A26B',
            maxWidth: '52ch',
            margin: '1.25rem auto',
            lineHeight: 1.6,
            opacity: 0.85,
          }}
        >
          Five Panes. Eight Shells. Five Parallels. Four Tiers. Five packs. One ratio. One Council.
          Everything else descends.
        </p>
        <div
          style={{
            width: '3rem',
            height: '1px',
            background: '#C9A26B',
            margin: '2rem auto 0',
            opacity: 0.5,
          }}
        />
      </section>

      {/* ─── Main layout: content + sticky TOC ─────────────────────────── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          alignItems: 'start',
        }}
        className="lg:grid-cols-[1fr_14rem] xl:grid-cols-[1fr_16rem]"
      >
        {/* Content column */}
        <main
          id="main-content"
          style={{
            paddingTop: '2.5rem',
            paddingBottom: '6rem',
            minWidth: 0,
          }}
        >
          <GDDContent />
        </main>

        {/* Sticky TOC sidebar — desktop only */}
        <aside
          aria-label="Table of contents"
          style={{
            position: 'sticky',
            top: '3.5rem',
            maxHeight: 'calc(100vh - 4rem)',
            overflowY: 'auto',
            paddingTop: '2.5rem',
            paddingBottom: '2rem',
            display: 'none',
          }}
          className="lg:block"
        >
          <GDCTOC sections={SECTIONS} />
        </aside>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(201,162,107,0.12)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-baker-street), serif',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#6B8FA8',
            opacity: 0.6,
          }}
        >
          Last Updated: {LAST_UPDATED} · Decisions, not options.
        </p>
      </footer>
    </div>
  );
}
