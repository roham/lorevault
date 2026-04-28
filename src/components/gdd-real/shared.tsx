// Re-export the gdd-v2 shared atoms so gdd-real uses identical visual language.
// Keeping this as a thin re-export means any palette/typography refinement in
// gdd-v2/shared.tsx automatically lands in gdd-real.
export {
  V2_PALETTE,
  SECTION_NUM,
  SECTION_H2,
  SECTION_UNDERLINE,
  H3,
  BODY_P,
  PULLQUOTE,
  SectionHeader,
  H3El,
  P,
  PQ,
  I,
  CardExample,
  CodeBlock,
  IllustrationPlaceholder,
  TierRow,
} from '../gdd-v2/shared';
