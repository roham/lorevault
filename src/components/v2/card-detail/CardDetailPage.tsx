import type { V2Card } from '@/lib/v2/cards';
import { CardFrame } from '@/components/v2/frame/CardFrame';
import { TopBar } from './TopBar';
import { Pullquote } from './Pullquote';
import { LoreNote } from './LoreNote';
import { TetherRow } from './TetherRow';
import { MetadataChips } from './MetadataChips';
import { CouncilToggle } from './CouncilToggle';
import { OwnerTrail } from './OwnerTrail';
import { ActionsPlaceholder } from './ActionsPlaceholder';
// Defense-in-depth #1: validate at server-render boundary too.
import { assertParallelEligible } from '@/lib/v2/parallels-eligibility';

interface CardDetailPageProps {
  card: V2Card;
}

/**
 * CardDetailPage — composition root for /v2/card/[cardId] per Phase 4 §1.
 *
 * Element stack top-to-bottom: TopBar · HeroArt · Pullquote · LoreNote · TetherRow ·
 * MetadataChips · CouncilToggle · OwnerTrail · ActionsPlaceholder.
 */
export function CardDetailPage({ card }: CardDetailPageProps) {
  // Defense-in-depth: the gate fires here too. If a malformed card slips into
  // the route, this throws at server-render and the build fails fast.
  assertParallelEligible(card.parallel, card.tier, card.baseArtVariant);

  return (
    <div className="min-h-dvh bg-[var(--color-v2-ground)] text-[var(--color-v2-text)]">
      <TopBar card={card} />
      <main>
        {/* Hero art-block — 2:3 full-bleed, 375 wide on mobile */}
        <CardFrame
          heroArtUrl={card.heroArtUrl}
          alt={`${card.figureName} — ${card.universeLabel}`}
          tier={card.tier}
          parallel={card.parallel}
          baseArtVariant={card.baseArtVariant}
        />
        <Pullquote quote={card.pullquote} attribution={card.pullquoteAttribution} />
        <LoreNote note={card.loreNote} tier={card.tier} universe={card.universe} />
        <TetherRow tethers={card.tethers} />
        <MetadataChips card={card} />
        <CouncilToggle council={card.council} shell={card.shell} />
        <OwnerTrail owner={card.owner} />
        <ActionsPlaceholder actionsEnabled={false} />
      </main>
    </div>
  );
}
