import { SectionHeader, P, PQ, H3El, CardExample } from '../shared';

export function SectionSeries1Gates() {
  return (
    <section id="section-14">
      <SectionHeader num="§ 14" title="Series 1 Production Gates — What Ships, What Waits" />

      <PQ>
        Doctrine without a shipping plan is a poster. Series 1 is the smallest possible
        instantiation of the doctrine that proves the architecture works.
      </PQ>

      <P>
        This section turns the doctrine into a production plan. Series 1 is the smallest
        instantiation that proves the architecture; subsequent Series open additional rungs.
        Three categories: what ships, what defers, what V1 walked back.
      </P>

      <H3El>What Series 1 ships</H3El>

      <P>
        Series 1 activates three Panes: one Tentpole, one Adjacent, one Foil. The Tentpole is{' '}
        <strong style={{ color: '#C9A26B' }}>Old-Ones-Persist</strong>, a Tier-A cosmological
        variant whose buried weight is the Pre-Causal Observer and whose contraband is the
        Verb-That-Names. The Adjacent is{' '}
        <strong style={{ color: '#C9A26B' }}>True-Names-Persist</strong>, a Tier-B variant
        sharing an edge with the Tentpole through the question of what naming costs. The
        Foil is <strong style={{ color: '#C9A26B' }}>Sinterklaas-Reigns</strong>, a Tier-A
        moral-comedy variant whose ledger logic stands against the Tentpole&rsquo;s denial.
        No Wildcard ships in Series 1.
      </P>

      <P>
        Each Pane ships with a complete pane-grammar JSON, a named buried weight, a specified
        contraband, and a sentence-rhythm enum. The eight-stage pipeline is operational from
        day one. The six-test gate is operational from day one. The iceberg audit is
        operational from day one. No card ships that does not clear all three. The Weight
        Ledger is maintained per Pane in production tooling.
      </P>

      <P>
        The card volume for Series 1 is calibrated against the live-ops cap. Across the
        three active Panes, Series 1 ships roughly forty unique cards in its first month
        and reaches a hundred-twenty unique cards across its six-month run. The Tentpole
        receives the larger share. The Foil receives the prose-stylist budget; the Foil is
        where the Mirrlees-civic register is most visible and the prose has to carry the
        most weight per card.
      </P>

      <H3El>What Series 1 defers</H3El>

      <P>
        The Wildcard archetype is deferred to Series 2 at earliest. The Wildcard is a
        production move the team should not make until the three-Pane discipline is
        operational under live-ops pressure for at least one full Series.
      </P>

      <P>
        Tier 2 through Tier 4 of the participation architecture are deferred. The ladder
        ships visible and disabled. Tier 2 (Apocrypha submissions) opens at Series 2 if
        Series 1 retention metrics meet target; Tier 3 opens at Series 3; Tier 4 opens
        post-Series 4 after Council weight is established.
      </P>

      <P>
        Pierre Menard variants are architected and not shipped. The eight-stage pipeline can
        produce Pierre Menard variants at stage two by selecting the same figure-text pair
        across two active Panes; the production team is instructed not to use the move
        until Series 2 at earliest. Series 1 establishes the cosmologies; Series 2 begins
        the cross-Pane resonance.
      </P>

      <P>
        Cross-Pane Series moments — the narratively load-bearing events that touch a
        Tentpole and a Foil simultaneously — are deferred to Series 2. Series 1 ships each
        Pane in a self-contained mode. Cross-pollination at the lore layer (shared
        contraband, refused gods, recurring proper nouns) is permitted; cross-pollination at
        the narrative event layer is not.
      </P>

      <H3El>What V1 walks back</H3El>

      <P>
        The five-Universe naming convention is retired. Universes do not exist in V2.
        Cards carry Pane attribution, not Universe attribution. Existing V1 communications
        that reference Universes are in process of revision; the V1 GDD page is preserved
        as a historical record and is no longer the authoritative source.
      </P>

      <P>
        The 1:2:4 iceberg ratio is retired. The 2:1:8 ratio with one buried weight per Pane
        replaces it. Cards in the V1 backlog that were authored against the 1:2:4 ratio are
        being re-audited against the 2:1:8; cards that fail the audit are returned to stage
        seven of the pipeline.
      </P>

      <P>
        The jurisdictional pantheon model is retired. Pantheons in V2 are incommensurably
        cohabiting; the pantheon-as-court framing produced gods-as-superhero-bureaucracy in
        V1 production and is the single largest Lampblack-quality regression the V2 doctrine
        corrects.
      </P>

      <P>
        The one-verb-per-Pane mechanical thesis is retired. Each Pane now ships with a
        three-to-five-element rule-grammar in machine-readable form. Designers who memorized
        a single verb under V1 are being retrained on the grammar.
      </P>

      <P>
        The prop-first Lampblack hierarchy is retired. The corrected hierarchy — Gesture,
        Cosmological-relation, Wound, Forbidden-act, Role, Silhouette, Prop — is now in
        force. Existing cards that ship a Holmes pipe in the silhouette layer are being
        re-audited; cards in production that are not yet committed have their props demoted
        and their gestures elevated.
      </P>

      <H3El>The card example</H3El>

      <CardExample
        name="The Verb-That-Names — Series 1, Tentpole"
        pane="Old-Ones-Persist"
        rarity="Legendary"
        flavor="The conjugation that admits an observer is taught only by tutors who charge in untraceable currencies. There are nine known living tutors. There were eleven last month."
        buriedWeight="The contraband is taught and the teachers disappear. The teaching continues. The Survey takes no position on the matter."
      />

      <P>
        The card is the Tentpole-grade introduction of the Verb-That-Names contraband. It
        ships in the first month of Series 1. The card establishes the Pane&rsquo;s
        cosmology in three sentences, names the contraband, and locks the buried weight.
        The wiki entry for the card is the wiki entry the five percent will write essays
        about. The architecture has not yet asked the fans to write their own; it has
        shown them the door, and Series 1 is the proof that the door is real.
      </P>
    </section>
  );
}
