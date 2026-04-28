import type { Metadata } from 'next';
import { GDDv2Content } from '@/components/gdd-v2/GDDv2Content';
import { GDCTOC } from '@/components/gdd/GDCTOC';

export const metadata: Metadata = {
  title:
    'LoreVault GDD V2 — Cosmological-Variant Panes, Contraband, Participation Architecture',
  description:
    'The Game Design Document V2 for LoreVault — supersedes the April 26 V1. Cosmological-variant Panes; bottom-up contraband; iceberg 2:1:8; gesture-first Lampblack hierarchy; incommensurable pantheon cohabitation; six-test gate; eight-stage pipeline; five-tier participation architecture.',
};

const LAST_UPDATED = '2026-04-27';

const SECTIONS = [
  { id: 'section-1', label: '§ 1 — The Doctrine of Difference' },
  { id: 'section-2', label: '§ 2 — The 95/5 Rule' },
  { id: 'section-3', label: '§ 3 — Infinite Substrate' },
  { id: 'section-4', label: '§ 4 — Cosmological-Variant Panes' },
  { id: 'section-5', label: '§ 5 — Contraband' },
  { id: 'section-6', label: '§ 6 — Pane Rule-Grammar' },
  { id: 'section-7', label: '§ 7 — Iceberg 2:1:8' },
  { id: 'section-8', label: '§ 8 — The Lampblack Hierarchy' },
  { id: 'section-9', label: '§ 9 — Incommensurable Cohabitation' },
  { id: 'section-10', label: '§ 10 — The Six-Test Tweak Gate' },
  { id: 'section-11', label: '§ 11 — Pierre Menard at Industrial Scale' },
  { id: 'section-12', label: '§ 12 — The Eight-Stage Pipeline' },
  { id: 'section-13', label: '§ 13 — Participation Architecture' },
  { id: 'section-14', label: '§ 14 — Series 1 Production Gates' },
  { id: 'section-15', label: '§ 15 — Glossary' },
];

export default function GDDV2Page() {
  return (
    <div
      style={{
        background: '#0a0907',
        minHeight: '100vh',
        color: '#e8e0d0',
      }}
    >
      {/* ─── Sticky top nav ─────────────────────────────────────────────── */}
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
              opacity: 0.85,
            }}
          >
            LoreVault · GDD V2
          </span>
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

      {/* ─── V2 supersession banner ─────────────────────────────────────── */}
      <div
        style={{
          background: 'rgba(201,162,107,0.06)',
          borderBottom: '1px solid rgba(201,162,107,0.18)',
          padding: '0.75rem 1.5rem',
        }}
      >
        <p
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            fontFamily: 'var(--font-baker-street), serif',
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            color: '#C9A26B',
            lineHeight: 1.55,
            textAlign: 'center',
            opacity: 0.95,
          }}
        >
          GDD V2 — supersedes the April 26 V1. The doctrine has moved past the 5-Universe
          model. See the changelog at{' '}
          <a
            href="#changelog"
            style={{ color: '#e8e0d0', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            the bottom of this document
          </a>{' '}
          for V1 → V2 deltas.
        </p>
      </div>

      {/* ─── Hero section ───────────────────────────────────────────────── */}
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
            opacity: 0.85,
          }}
        >
          Game Design Document · Version 2 · 2026-04-27
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-pullquote), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            color: '#e8e0d0',
            lineHeight: 1.08,
            marginBottom: '1.25rem',
            maxWidth: '20ch',
            margin: '0 auto 1.25rem',
          }}
        >
          GDD V2 — The Doctrine Has Moved
        </h1>
        <blockquote
          style={{
            fontFamily: 'var(--font-pullquote), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem, 2.4vw, 1.4rem)',
            color: '#C9A26B',
            maxWidth: '54ch',
            margin: '1.75rem auto',
            lineHeight: 1.5,
            opacity: 0.95,
            borderLeft: 'none',
            paddingLeft: 0,
          }}
        >
          &ldquo;The rule is not &lsquo;make it different.&rsquo; The rule is: make the
          difference reveal the world.&rdquo;
        </blockquote>
        <p
          style={{
            fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: '#a09080',
            maxWidth: '62ch',
            margin: '1.25rem auto',
            lineHeight: 1.7,
            opacity: 0.9,
          }}
        >
          Cosmological-variant Panes. Contraband. Iceberg 2:1:8. Gesture-first Lampblack.
          Incommensurable pantheon cohabitation. Six-test gate. Eight-stage pipeline.
          Five-tier participation architecture. Fifteen sections, doctrine first, production
          last.
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

      {/* ─── Main layout: content + sticky TOC ──────────────────────────── */}
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
        <main
          id="main-content"
          style={{
            paddingTop: '2.5rem',
            paddingBottom: '6rem',
            minWidth: 0,
          }}
        >
          <GDDv2Content />

          {/* Changelog anchor */}
          <section id="changelog" style={{ marginTop: '5rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-baker-street), serif',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6B8FA8',
                opacity: 0.85,
                marginBottom: '0.75rem',
              }}
            >
              Changelog
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-pullquote), Georgia, serif',
                fontStyle: 'italic',
                fontSize: '1.7rem',
                color: '#e8e0d0',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
                marginTop: 0,
              }}
            >
              V1 → V2 Changelog
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
                fontSize: '0.95rem',
                color: '#d8cfc0',
                lineHeight: 1.7,
                maxWidth: '65ch',
              }}
            >
              The full changelog is maintained alongside this document at{' '}
              <code style={{ color: '#C9A26B', fontSize: '0.85em' }}>
                src/app/v3/gdd-v2/_changelog.md
              </code>
              . Ten architectural diffs and three new sections are tracked there. Section 14
              (Series 1 Production Gates) summarizes the walked-back V1 positions in
              narrative form.
            </p>
          </section>
        </main>

        <aside
          aria-label="Table of contents"
          style={{
            position: 'sticky',
            top: '6rem',
            maxHeight: 'calc(100vh - 7rem)',
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

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
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
            opacity: 0.65,
          }}
        >
          Last Updated: {LAST_UPDATED} · Decisions, not options. · GDD V2 supersedes V1.
        </p>
      </footer>
    </div>
  );
}
