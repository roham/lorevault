import { Card, CardSet } from '@/data/types';
import { ALL_CARDS } from '@/data/cards';
import { SETS } from '@/data/sets';
import { GUIDE_SECTIONS, type GuideSection } from '@/data/guide-content';
import { scoreCard } from '@/lib/marketData';

export type SearchResultType = 'card' | 'set' | 'guide';

export interface CardResult {
  type: 'card';
  id: string;
  title: string;
  subtitle: string;
  score: number;
  card: Card;
}

export interface SetResult {
  type: 'set';
  id: string;
  title: string;
  subtitle: string;
  score: number;
  set: CardSet;
}

export interface GuideResult {
  type: 'guide';
  id: string;
  title: string;
  subtitle: string;
  score: number;
  section: GuideSection;
}

export type SearchResult = CardResult | SetResult | GuideResult;

function scoreText(text: string, query: string, weight: number): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower === q) return weight * 3;
  if (lower.startsWith(q)) return weight * 2;
  if (lower.includes(q)) return weight;
  return 0;
}

export function globalSearch(query: string): {
  cards: CardResult[];
  sets: SetResult[];
  guide: GuideResult[];
} {
  const q = query.trim();
  if (!q) return { cards: [], sets: [], guide: [] };

  const terms = q.toLowerCase().split(/\s+/);

  // Search cards using existing scorer
  const cardResults: CardResult[] = ALL_CARDS
    .map((card) => {
      const score = scoreCard(card, terms);
      return score > 0 ? {
        type: 'card' as const,
        id: card.id,
        title: card.character,
        subtitle: `${card.set} \u00B7 ${card.scarcity}`,
        score,
        card,
      } : null;
    })
    .filter((r): r is CardResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  // Search sets
  const setResults: SetResult[] = SETS
    .map((set) => {
      const score = scoreText(set.name, q, 2) + scoreText(set.description, q, 1);
      return score > 0 ? {
        type: 'set' as const,
        id: set.slug,
        title: set.name,
        subtitle: `${set.cardCount} cards`,
        score,
        set,
      } : null;
    })
    .filter((r): r is SetResult => r !== null)
    .sort((a, b) => b.score - a.score);

  // Search guide sections
  const guideResults: GuideResult[] = GUIDE_SECTIONS
    .map((section) => {
      const score = scoreText(section.title, q, 2) + scoreText(section.subtitle, q, 1);
      return score > 0 ? {
        type: 'guide' as const,
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        score,
        section,
      } : null;
    })
    .filter((r): r is GuideResult => r !== null)
    .sort((a, b) => b.score - a.score);

  return { cards: cardResults, sets: setResults, guide: guideResults };
}
