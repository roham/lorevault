import {
  SectionHeader,
  P,
  PQ,
  H3El,
  TierRow,
  IllustrationPlaceholder,
  I,
} from '../shared';

export function SectionParticipationArchitecture() {
  return (
    <section id="section-13">
      <SectionHeader
        num="§ 13"
        title="Participation Architecture — Will Fans Bring Their Own Contraband?"
      />

      <PQ>
        The actual competitor is not other card games. It is the SCP Foundation, Homestuck,
        RWBY, and Worm — participatory cosmologies whose fans contribute, retcon, archive,
        and re-perform the world.
      </PQ>

      <IllustrationPlaceholder
        id="hero-13-ladder"
        caption="A vertical ladder, five rungs from bottom to top labelled Tier 0 through Tier 4. The bottom rung is in shadow; the top rung carries a small gold plaque labelled Pane Record. Between Tier 2 and Tier 3 is a gate marked editorial; between Tier 3 and Tier 4 is a second gate marked council."
        aspectRatio="3 / 4"
      />

      <P>
        The V1 doctrine had no participation architecture. It treated the product as an
        authored object — the team writes, the player collects. That treatment is the
        slow-decay path. An authored object compounds for two years and decays for ten. A
        participatory cosmology compounds indefinitely because the fans are doing the
        compounding.
      </P>

      <P>
        The SCP Foundation is the largest single accidental cosmology in the
        twenty-first century. Five thousand authored entries, ten thousand crosslinked
        articles, a community-enforced quality-rating system, and a metaphysics that has
        survived seventeen years of fan churn. SCP did not start as a product. It became one
        because the participation architecture was correct from a very early stage.
        Homestuck did similar work in webcomic form. RWBY runs on the same logic at smaller
        scale. Wildbow&rsquo;s <I>Worm</I> seeded a fanfic ecosystem that has outproduced
        the original. These are the actual competitors. The question is not whether
        LoreVault is a good cosmology; it is whether fans will bring their own contraband
        across the border.
      </P>

      <H3El>The five tiers</H3El>

      <TierRow
        tier="Tier 0"
        title="The reader at the window"
        body={
          <P>
            Day-1 passive engagement. Buys cards, opens packs, reads the cards, owns a
            collection. Does not write fan analysis. Does not produce derivative work. The
            tier is not a deficiency — it is the floor, and the architecture must serve
            the floor as carefully as it serves the ceiling. A Tier-0 collector who feels
            the Pane through the silhouette-glance is the architecture working as
            intended. Roughly seventy-five percent of the audience lives here.
          </P>
        }
      />

      <TierRow
        tier="Tier 1"
        title="The interpreter"
        body={
          <P>
            Writes paragraph-length analyses of single cards in community channels. Posts
            theories about the buried weight. Maps connections between cards across a
            single Pane. Produces no canon claims and no derivative artifacts. Tier 1
            behaviour is rewarded with curated visibility — the team highlights notable
            interpretive posts in a weekly community digest. No badge, no formal status,
            no canon implication. The reward is being read.
          </P>
        }
      />

      <TierRow
        tier="Tier 2"
        title="The apocrypha-maker"
        body={
          <P>
            Produces derivative work — fan art, fan fiction, fan-made cards — explicitly
            marked non-canon. The product issues an Apocrypha badge for submitted Tier-2
            work that meets minimum quality and grammar-compliance bars. The badge does
            not confer canon status. It confirms that the work has been reviewed and is
            consistent enough with the Pane&rsquo;s grammar to be linked from the
            official Pane wiki under the Apocrypha section. The work&rsquo;s author keeps
            ownership of the derivative; the product retains ownership of the Pane.
          </P>
        }
      />

      <TierRow
        tier="Tier 3"
        title="The candidate scribe"
        body={
          <P>
            Submits a lore expansion — a footnote, a minor figure&rsquo;s biography, an
            unwritten scene of a known event — to the editorial team for review. The
            community votes on submissions; the editorial team takes the top-voted
            candidates through the six-test gate as if they were internal drafts.
            Submissions that pass enter the Pane&rsquo;s supplementary lore. The
            submitter&rsquo;s handle is recorded in the Pane&rsquo;s contributor ledger.
            Tier 3 is the first tier where fan work touches the canon edge; the gate is
            real.
          </P>
        }
      />

      <TierRow
        tier="Tier 4"
        title="The named contributor"
        body={
          <P>
            A Tier-3 contribution is promoted to the official Pane record by the Canon
            Council&rsquo;s vote. The contribution becomes part of the Pane&rsquo;s
            permanent grammar-compliant lore. The contributor&rsquo;s legal name (or
            chosen byline, with a verifiable identity record) is added to the Pane&rsquo;s
            real ledger as a credited contributor. Tier 4 is rare — fewer than a handful
            of contributions per Series, and only after a sustained Tier-3 track record.
            The compensation is reputational and economic; promoted contributions earn a
            share of the Pane&rsquo;s downstream secondary revenue, by formula.
          </P>
        }
      />

      <H3El>What Series 1 ships</H3El>

      <P>
        Series 1 ships participation-disabled. No Apocrypha submissions, no community vote,
        no contributor ledger. The ladder is visible in the wiki and in this document, but
        no rungs are climbable. The architecture is published; the doors are locked.
      </P>

      <P>
        Disabled is not deferred. The point of shipping with the ladder visible is to set the
        expectation that the product is a substrate, not an authored object. Tier-0 and
        Tier-1 fans see the ladder, understand that the product intends to open it, and
        adjust their relationship to the canon accordingly. Series 1 is the trust
        deposit. Series 2 unlocks Tier 2. Series 3 evaluates Tier 3 readiness. Tier 4 is a
        post-Series-4 question, after the Council has institutional weight.
      </P>

      <H3El>The actual question</H3El>

      <P>
        Will fans bring their own contraband across the border? The answer depends on the
        Pane axiom&rsquo;s generativity and on the architecture&rsquo;s legibility. A Pane
        whose grammar is recitable from memory — three to five elements, contraband
        specified, buried weight named — is a Pane fans can write inside. A Pane that is a
        slogan with art is not. The participation architecture is the test of the doctrine,
        and the doctrine has to clear the bar before the architecture can open.
      </P>

      <P>
        If the answer is yes, the product is a substrate that compounds. If the answer is
        no, the product is an authored object that decays. Every other architectural
        decision in this document is in service of making the answer yes.
      </P>
    </section>
  );
}
