import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionGlossary() {
  return (
    <section id="section-16">
      <SectionHeader num="§ 16" title="Glossary" />

      <PQ>
        The glossary is the compression layer of the doctrine. Without it, the doctrine
        drifts under live-ops pressure within six months.
      </PQ>

      <P>
        Every team that joins the project, every contractor who writes a flavor line, every
        external auditor, and every fan-canon contributor needs a single canonical source
        for what each term means. The glossary below covers every product-specific term
        that appears in the prior fifteen sections, plus the literary-doctrine terms that
        the GDD inherits from the V2 doctrine document.
      </P>

      <H3El>Pane</H3El>

      <P>
        A cosmological variant. Not an IP bucket. A single underlying world experienced
        under a different metaphysical pressure, with an axiom (one-sentence heresy), a
        contraband (the structural forbidden thing), a three-to-five-element rule-grammar,
        a buried weight, a sentence rhythm, and seven civic details (verb for to die, the
        third-hour fear, smallest currency, commonest crime, tedium marker, name for the
        smallest unit of the buried weight, names of the cohabiting pantheons). Three to
        five Panes are active per Series.
      </P>

      <H3El>Pack</H3El>

      <P>
        The purchase unit. Five card types in MLP — Starter, Standard, Pane, Premium,
        Case. Each pack draws cards from the active card pool with a rarity distribution
        deterministic by pack type.
      </P>

      <H3El>Drop</H3El>

      <P>
        A scheduled release of a pack at a precise UTC timestamp. Drops run through four
        states: Mystery, Revealed, Live, Ripped.
      </P>

      <H3El>Series</H3El>

      <P>
        A six-month publishing arc. Two Series ship per year. Each Series carries a
        Tentpole Pane, two Adjacent Panes, a Foil Pane, and optionally a Wildcard Pane.
      </P>

      <H3El>Set</H3El>

      <P>
        A complete card list within a Pane. A Pane has three to five Sets across its life,
        drip-fed over twelve to twenty-four months. A Set is a thematic angle on the
        Pane&rsquo;s grammar, not a topic-cluster.
      </P>

      <H3El>Run</H3El>

      <P>
        The supply-band bucket within a Set: Common Run, Rare Run, Legendary Run,
        Contraband-Rare Run.
      </P>

      <H3El>Serial</H3El>

      <P>
        The publicly-visible edition number of an individual card. #1 of a 199-edition
        Legendary is a different object from #150, even though the cards are otherwise
        identical.
      </P>

      <H3El>Low-Mint</H3El>

      <P>
        A card whose serial is in the top one half of one percent of its edition. Low-mint
        cards carry a parallel-economy premium independent of the card itself.
      </P>

      <H3El>Smashable Floor</H3El>

      <P>
        The marketplace mechanic by which a buyer hits the lowest current ask to instantly
        own a card. The floor card is liquid because it is the unambiguously cheapest path
        to set completion.
      </P>

      <H3El>Lampblack</H3El>

      <P>
        The residue burned off when one Pane brushes against another. Operationally, the
        cross-Pane recognition primitive expressed through visible features that survive
        translation: gesture, cosmological-relation, wound, forbidden-act, role,
        silhouette, prop. The hierarchy is gesture-first, prop-last.
      </P>

      <H3El>Iceberg 2:1:8</H3El>

      <P>
        The ratio of surface to echo to deep buried weight in a card&rsquo;s lore depth.
        Two units of surface (legible at silhouette-glance), one unit of echo (the second
        line), eight units of deep buried weight (gestured at, never directly stated).
      </P>

      <H3El>Contraband</H3El>

      <P>
        The structural forbidden thing of a Pane. The thing the world&rsquo;s law forbids
        that is nevertheless eaten, said, pulled across the border. Every Pane has one
        Contraband. The Contraband-Rare cards of each Pane carry a structural premium on
        the secondary market.
      </P>

      <H3El>Translation-Cost</H3El>

      <P>
        The visible scar at cross-Pane card interaction. When a card from one cosmological
        register interacts with a card from another, the cost is rendered as a flavor scar
        — palette diff, punctuation change, redaction mark — not as a balance number.
      </P>

      <H3El>Apocrypha</H3El>

      <P>
        The card whose existence is in dispute within the Pane&rsquo;s implicit corpus. A
        Pane-Pane interaction may produce an Apocryphal variant that is not officially
        canon but is tradeable; this is V2 scope.
      </P>

      <H3El>Tier 0-4</H3El>

      <P>
        The participation tier ladder. Tier 0 (day-one passive), Tier 1 (active set
        collector), Tier 2 (challenge completer with deeper iceberg unlock), Tier 3
        (contributor), Tier 4 (canon contributor). Tier unlocks are progression-gated; in
        Series 1, only Tiers 0 through 2 are unlockable.
      </P>

      <H3El>Pierre-Menard</H3El>

      <P>
        The variant primitive — same card text shipped across multiple Panes, varying only
        in Pane attribution and art. The Borgesian argument that the same words mean
        different things in different times, applied as a card-design and market mechanic.
      </P>

      <H3El>Tentpole Pane</H3El>

      <P>
        The Series&rsquo;s gravitational center. Receives 50-60% of art, prose, and
        marketing budget. The Pane the Series is named for in collector memory.
      </P>

      <H3El>Adjacent Pane</H3El>

      <P>
        Cosmologically related to the Tentpole — sharing an edge, a contraband, or a
        refused god — but with its own grammar.
      </P>

      <H3El>Foil Pane</H3El>

      <P>
        Tonally and metaphysically opposite to the Tentpole. Exists to make the Tentpole
        legible by contrast.
      </P>

      <H3El>Wildcard Pane</H3El>

      <P>
        Optional. A Pane that breaks the grammar of the Series intentionally. Used in
        roughly one of three Series for refresh.
      </P>

      <H3El>Prediction</H3El>

      <P>
        The MLP play surface. A weekly cross-Pane axiom-conflict in which collectors stake
        their Pane&rsquo;s cards on the outcome. Winning-Pane cards gain a permanent
        narrative-scar overlay.
      </P>

      <H3El>Footnoter</H3El>

      <P>
        The editorial persona who publishes the weekly Letter announcing the Prediction
        conflict and elevating one card per week. Pratchett-grade narrator,
        Discworld-bibliography register.
      </P>

      <H3El>Mosaic Test</H3El>

      <P>
        The test that asks whether eighteen of twenty cards in a Pane&rsquo;s Set can be
        identified by Pane attribution from the prose alone, by a non-staff blind panel.
      </P>

      <H3El>Footnote Test</H3El>

      <P>
        The Clarke-derived test from the V2 doctrine&rsquo;s six-test gate. Asks whether
        a competent worldbuilder could write a plausible 80-word in-world scholarly
        footnote about the card. If not, the card is a typo wearing a moustache.
      </P>

      <H3El>Prose-Signature Test</H3El>

      <P>
        The Valente-derived test from the V2 doctrine&rsquo;s six-test gate. Asks whether
        the flavor line scans as belonging only to its Pane and could not be lifted into
        another Pane and pass.
      </P>

      <H3El>Contributor Pool</H3El>

      <P>
        The ringfenced fund — one and a half percent of every secondary sale plus five
        percent of every primary sale on original Panes — that pays Tier-3+ canon
        contributors when their flavor lines or contraband proposals are accepted into
        canon.
      </P>

      <H3El>Narrative-Scar</H3El>

      <P>
        The permanent overlay added to a card&rsquo;s frame when the card was staked on the
        winning Pane in a Prediction conflict. A small thin line in lampblack-pigment along
        the lower edge of the card. Cumulative — a card that has survived three conflicts
        carries three scars.
      </P>
    </section>
  );
}
