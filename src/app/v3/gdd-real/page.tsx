import type { Metadata } from 'next';
import { GDDRealContent } from '@/components/gdd-real/GDDRealContent';
import { GDCTOC } from '@/components/gdd/GDCTOC';

export const metadata: Metadata = {
  title:
    'LoreVault Real GDD — Game Design Document (Core Loop, Economy, Atlas Integration, MLP Boundary)',
  description:
    'The actual Game Design Document for LoreVault — the operational answer to the Lore Doctrine. Seventeen sections covering core loop, economy, rarity, packs, marketplace, progression, challenges, games-with-collectibles, social surface, onboarding, retention, Atlas integration, MLP boundary, glossary, and the doctrine cross-reference.',
};

const LAST_UPDATED = '2026-04-28';

const SECTIONS = [
  { id: 'section-1', label: '§ 1 — Executive Summary' },
  { id: 'section-2', label: '§ 2 — Core Loop' },
  { id: 'section-3', label: '§ 3 — Economy & Monetization' },
  { id: 'section-4', label: '§ 4 — Rarity & Supply' },
  { id: 'section-5', label: '§ 5 — Sets, Series, Panes' },
  { id: 'section-6', label: '§ 6 — Pack Mechanics' },
  { id: 'section-7', label: '§ 7 — Marketplace' },
  { id: 'section-8', label: '§ 8 — Progression Systems' },
  { id: 'section-9', label: '§ 9 — Challenges & Events' },
  { id: 'section-10', label: '§ 10 — Games with Collectibles' },
  { id: 'section-11', label: '§ 11 — Social Surface' },
  { id: 'section-12', label: '§ 12 — Onboarding' },
  { id: 'section-13', label: '§ 13 — Retention Loops' },
  { id: 'section-14', label: '§ 14 — Atlas Integration' },
  { id: 'section-15', label: '§ 15 — Roadmap & MLP Boundary' },
  { id: 'section-16', label: '§ 16 — Glossary' },
  { id: 'section-17', label: '§ 17 — Cross-Reference to the Doctrine' },
];

export default function GDDRealPage() {
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
            LoreVault · Real GDD
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
            <a
              href="/v3/gdd-v2"
              style={{
                fontFamily: 'var(--font-baker-street), serif',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#C9A26B',
                textDecoration: 'none',
                opacity: 0.85,
              }}
            >
              Doctrine →
            </a>
          </nav>
        </div>
      </header>

      {/* ─── Companion-document banner ──────────────────────────────────── */}
      <div
        style={{
          background: 'rgba(107,143,168,0.06)',
          borderBottom: '1px solid rgba(107,143,168,0.18)',
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
            color: '#6B8FA8',
            lineHeight: 1.55,
            textAlign: 'center',
            opacity: 0.95,
          }}
        >
          The Real GDD — companion to the{' '}
          <a
            href="/v3/gdd-v2"
            style={{ color: '#e8e0d0', textDecoration: 'underline', textUnderlineOffset: '2px' }}
          >
            Lore Doctrine V2
          </a>
          . The doctrine is the <em>what</em>; this is the <em>how</em>. Cross-reference
          index in § 17.
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
          Game Design Document · Real · 2026-04-28
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
          The Real GDD
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
          &ldquo;LoreVault inherits commerce. LoreVault builds literature.&rdquo;
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
          Seventeen sections. The operational answer to the Lore Doctrine V2. Core loop,
          economy, rarity, pack mechanics, marketplace, progression, challenges, the
          games-with-collectibles MLP pick (Predictions), social surface, onboarding,
          retention, Atlas integration with inheritance/build/negotiate matrix, MLP
          boundary with V1/V2/research-only cut list, glossary, and the cross-reference
          to every doctrinal commitment that produced this design.
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
          <GDDRealContent />
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
          Last Updated: {LAST_UPDATED} · Decisions, not options. ·{' '}
          <a
            href="/v3/gdd-v2"
            style={{ color: '#C9A26B', textDecoration: 'none' }}
          >
            Companion: Lore Doctrine V2
          </a>
        </p>
      </footer>
    </div>
  );
}
