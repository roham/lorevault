'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CardItem from '@/components/CardItem';
import { globalSearch } from '@/lib/globalSearch';
import { getRecentSearches, addRecentSearch } from '@/lib/marketData';
import { getTrendingCards } from '@/lib/marketData';

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    // Auto-focus on mount
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim().length > 1) {
        addRecentSearch(query.trim());
      }
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const results = useMemo(() => globalSearch(debouncedQuery), [debouncedQuery]);
  const trending = useMemo(() => getTrendingCards(6), []);
  const hasResults = results.cards.length > 0 || results.sets.length > 0 || results.guide.length > 0;
  const isSearching = debouncedQuery.trim().length > 0;

  return (
    <div className="min-h-screen max-w-lg mx-auto">
      {/* Search input */}
      <div className="sticky top-12 z-40 bg-background/95 backdrop-blur-xl px-4 py-3 border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards, sets, guides..."
              className="w-full h-10 pl-9 pr-8 rounded-xl bg-surface border border-border/40 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-accent/50 transition-colors"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs"
              >
                &times;
              </button>
            )}
          </div>
          <Link href="/" className="text-xs text-muted hover:text-foreground transition-colors shrink-0">
            Cancel
          </Link>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24">
        {/* Empty state — before typing */}
        {!isSearching && (
          <>
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <section className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Recent</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('lorevault_recent_searches');
                      setRecentSearches([]);
                    }}
                    className="text-[10px] text-muted hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 8).map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-3 py-1.5 rounded-full bg-surface border border-border/40 text-xs text-foreground/70 hover:bg-surface-hover transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Trending */}
            <section>
              <span className="text-[11px] uppercase tracking-[0.08em] text-muted block mb-3">Trending</span>
              <div className="grid grid-cols-3 gap-3">
                {trending.map((card) => (
                  <Link key={card.id} href={`/card/${card.id}`}>
                    <CardItem card={card} size="sm" />
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Results */}
        {isSearching && !hasResults && (
          <div className="text-center py-16">
            <p className="text-sm text-muted">No results for &ldquo;{debouncedQuery}&rdquo;</p>
            <p className="text-xs text-muted/50 mt-1">Try a character name, set, or topic</p>
          </div>
        )}

        {isSearching && hasResults && (
          <div className="space-y-8">
            {/* Card Results */}
            {results.cards.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted">
                    Cards ({results.cards.length})
                  </span>
                  <Link
                    href={`/marketplace?q=${encodeURIComponent(debouncedQuery)}`}
                    className="text-[10px] text-accent hover:text-accent/80"
                  >
                    See all in Marketplace &rarr;
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {results.cards.slice(0, 12).map((r) => (
                    <Link key={r.id} href={`/card/${r.id}`} className="shrink-0">
                      <CardItem card={r.card} size="sm" />
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Set Results */}
            {results.sets.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                <span className="text-[11px] uppercase tracking-[0.08em] text-muted block mb-3">
                  Sets ({results.sets.length})
                </span>
                <div className="space-y-2">
                  {results.sets.map((r) => (
                    <Link
                      key={r.id}
                      href={`/collection/sets`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface/60 transition-colors"
                      style={{
                        background: `linear-gradient(135deg, ${r.set.gradientFrom}40, ${r.set.gradientTo}20)`,
                      }}
                    >
                      <span className="text-lg">{r.set.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{r.title}</div>
                        <div className="text-xs text-muted">{r.subtitle}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Guide Results */}
            {results.guide.length > 0 && (
              <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <span className="text-[11px] uppercase tracking-[0.08em] text-muted block mb-3">
                  Collector&apos;s Guide ({results.guide.length})
                </span>
                <div className="space-y-2">
                  {results.guide.map((r) => (
                    <Link
                      key={r.id}
                      href={`/guide#${r.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface/40 hover:bg-surface/60 transition-colors"
                    >
                      <span className="text-lg">{r.section.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{r.title}</div>
                        <div className="text-xs text-muted">{r.subtitle}</div>
                      </div>
                      <span className="text-muted text-xs">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
