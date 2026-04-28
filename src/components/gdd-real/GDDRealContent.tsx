import { SectionExecutiveSummary } from './sections/01-executive-summary';
import { SectionCoreLoop } from './sections/02-core-loop';
import { SectionEconomy } from './sections/03-economy';
import { SectionRaritySupply } from './sections/04-rarity-supply';
import { SectionSetsSeriesPanes } from './sections/05-sets-series-panes';
import { SectionPackMechanics } from './sections/06-pack-mechanics';
import { SectionMarketplace } from './sections/07-marketplace';
import { SectionProgression } from './sections/08-progression';
import { SectionChallenges } from './sections/09-challenges';
import { SectionGames } from './sections/10-games';
import { SectionSocialSurface } from './sections/11-social-surface';
import { SectionOnboarding } from './sections/12-onboarding';
import { SectionRetention } from './sections/13-retention';
import { SectionAtlasIntegration } from './sections/14-atlas-integration';
import { SectionRoadmap } from './sections/15-roadmap';
import { SectionGlossary } from './sections/16-glossary';
import { SectionCrossReference } from './sections/17-cross-reference';

export function GDDRealContent() {
  return (
    <>
      <SectionExecutiveSummary />
      <SectionCoreLoop />
      <SectionEconomy />
      <SectionRaritySupply />
      <SectionSetsSeriesPanes />
      <SectionPackMechanics />
      <SectionMarketplace />
      <SectionProgression />
      <SectionChallenges />
      <SectionGames />
      <SectionSocialSurface />
      <SectionOnboarding />
      <SectionRetention />
      <SectionAtlasIntegration />
      <SectionRoadmap />
      <SectionGlossary />
      <SectionCrossReference />
    </>
  );
}
