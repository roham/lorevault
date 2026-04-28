import { SectionHeader, P, I } from '../shared';
import type { CSSProperties, ReactNode } from 'react';

const TERM_STYLE: CSSProperties = {
  fontFamily: 'var(--font-pullquote), Georgia, serif',
  fontStyle: 'italic',
  color: '#C9A26B',
  fontSize: '1.05rem',
  marginRight: '0.4rem',
};

function Term({ name, children }: { name: string; children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
        fontSize: '0.95rem',
        lineHeight: 1.65,
        color: '#d8cfc0',
        marginBottom: '1rem',
        maxWidth: '65ch',
      }}
    >
      <span style={TERM_STYLE}>{name}.</span>
      {children}
    </p>
  );
}

export function SectionGlossary() {
  return (
    <section id="section-15">
      <SectionHeader num="§ 15" title="Glossary" />

      <P>
        Doctrine-consistent definitions for the terms used across this document. Where a V1
        term has been redefined, the V1 sense is noted as deprecated.
      </P>

      <Term name="Pane">
        A cosmological variant — a single underlying world experienced under a different
        metaphysical pressure. Not an IP bucket. Not a license. Not a shelf. Cards carry
        Pane attribution. Three to five Panes are active per Series; thirty to fifty Panes
        accumulate in the substrate over the product&rsquo;s first five years.
      </Term>

      <Term name="Contraband">
        The specific civic forbidden thing — a fruit, a verb, a color, a name — that the
        world&rsquo;s law prohibits and that is nevertheless eaten, said, mixed, pronounced,
        or pulled across the border. The correlative of the heresy. Bottom-up cosmological
        primitive. Every Pane has exactly one contraband; the rare card economy rides on it.
      </Term>

      <Term name="Lampblack">
        The darkening of a gesture&rsquo;s meaning each time the gesture is repeated under a
        new cosmology. Not soot on a prop. The hierarchy is Gesture, Cosmological-relation,
        Wound, Forbidden-act, Role, Silhouette, Prop. Two of the top three appear in every
        cross-Pane variant of a recurring figure.
      </Term>

      <Term name="Lattice">
        The shared substrate of cards, figures, and grammars across all Panes. Retained
        from V1 with clarified role: the Lattice is the substrate the Panes warp; it is
        not a list of canonical figures. The Lattice is what makes Pierre Menard variants
        possible — the same gesture exists at the Lattice layer; the Pane gives it meaning.
      </Term>

      <Term name="Tentpole">
        The Series&rsquo;s gravitational center. A Tier-A Pane that receives fifty-to-sixty
        percent of the Series&rsquo;s art, prose, and marketing budget. The Pane the Series
        is named for in collector memory.
      </Term>

      <Term name="Adjacent">
        A Tier-A or Tier-B Pane cosmologically related to the Tentpole through a shared edge
        — a contraband, a refused god, a buried weight. Adjacents cross-pollinate cards and
        lore with the Tentpole. Two Adjacents per Series.
      </Term>

      <Term name="Foil">
        A Pane tonally and metaphysically opposite the Tentpole. The Foil exists to make
        the Tentpole legible by contrast. One Foil per Series.
      </Term>

      <Term name="Wildcard">
        A Pane that breaks the Series&rsquo;s grammar intentionally, used in at most one of
        every three Series. Auditions a Tier-C concept. May or may not return.
      </Term>

      <Term name="Iceberg 2:1:8">
        The card-collectible product&rsquo;s recalibrated worldbuilding ratio: two parts
        surface, one part echo, eight parts deep. Surface over-weighted for legibility on
        first encounter. One buried weight per Pane underneath all eight deep parts. Replaces
        the V1 ratio of 1:2:4 (deprecated).
      </Term>

      <Term name="Buried Weight">
        The single enormous unspoken weight under every Pane — Faerie under Lud, the Unmade
        under Earthsea, idealism under Tl&ouml;n, the Pre-Causal Observer under Old-Ones-
        Persist. Never directly described. Tracked in the Pane&rsquo;s Weight Ledger;
        defended at stage seven of the eight-stage pipeline.
      </Term>

      <Term name="Pane Grammar">
        The three-to-five-element rule-grammar that constitutes a Pane&rsquo;s
        worldbuilding spine. Recitable from memory by every designer working on the Pane.
        Stated in pane-grammar JSON form as the system prompt for the live-ops generation
        pipeline.
      </Term>

      <Term name="Rule-Grammar">
        The general term for a small set of operations the Pane treats as morally or
        metaphysically real. Le Guin&rsquo;s Earthsea: true names, balance, the unmade.
        Pratchett&rsquo;s Witches: headology, borders, names, what you can and cannot
        afford to take seriously. The Pane&rsquo;s rule-grammar is its instance of the
        rule-grammar form.
      </Term>

      <Term name="Footnote Test">
        The fifth gate test, after Susanna Clarke. A card passes if a competent worldbuilder
        can write a plausible eighty-word in-world scholarly footnote about it. A card that
        fails is a typo wearing a moustache.
      </Term>

      <Term name="Prose-Signature Test">
        The sixth gate test, after Catherynne M. Valente. A card passes if its flavor line
        scans as belonging only to its Pane. A flavor line that could be lifted into another
        Pane and pass has not earned its Pane attribution.
      </Term>

      <Term name="Incommensurable Cohabitation">
        The V2 model of multi-pantheon coexistence within a Pane. Different mythic systems
        share the same ground while operating on incompatible logics. Replaces the V1
        jurisdictional model (deprecated). The friction is the meaning.
      </Term>

      <Term name="Translation Cost">
        The visible flavor scar produced when a card from one mythic register interacts with
        one from another. Rendered as palette change, punctuation loss, name redaction, or
        underlying older script. Not a balance number.
      </Term>

      <Term name="Pierre Menard Variant">
        A high-rarity card whose flavor text is byte-identical to a card in another Pane, and
        whose meaning is generated entirely by Pane attribution and art. After Borges&rsquo;s{' '}
        <I>Pierre Menard, Author of the Quixote</I>. Reserved for cross-Pane Series moments;
        produced at most quarterly.
      </Term>

      <Term name="Participation Architecture">
        The five-tier ladder that governs fan contribution to the Pane canon. Tier 0 passive
        through Tier 4 canon-promoted. Series 1 ships participation-disabled with the ladder
        visible.
      </Term>

      <Term name="Tier 0">
        The reader at the window. Day-1 passive. Buys, opens, reads, owns. Roughly seventy-
        five percent of the audience. The architecture serves the floor as carefully as it
        serves the ceiling.
      </Term>

      <Term name="Tier 1">
        The interpreter. Writes paragraph-length analyses in community channels. Posts
        theories about the buried weight. No canon claims. Rewarded with curated visibility.
      </Term>

      <Term name="Tier 2">
        The apocrypha-maker. Produces derivative work — fan art, fan fiction, fan-made cards
        — explicitly non-canon. Receives an Apocrypha badge and a wiki link under the
        Apocrypha section. Opens at Series 2.
      </Term>

      <Term name="Tier 3">
        The candidate scribe. Submits lore expansions through the editorial gate. Successful
        submissions enter Pane supplementary lore; the submitter&rsquo;s handle is recorded
        in the contributor ledger. Opens at Series 3.
      </Term>

      <Term name="Tier 4">
        The named contributor. A Tier-3 contribution is promoted to the official Pane record
        by the Canon Council. Contributor&rsquo;s legal name (or verifiable byline) is added
        to the Pane&rsquo;s real ledger; downstream secondary revenue is shared by formula.
        Opens post-Series 4.
      </Term>
    </section>
  );
}
