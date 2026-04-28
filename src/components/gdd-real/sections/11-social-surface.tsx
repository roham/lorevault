import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionSocialSurface() {
  return (
    <section id="section-11">
      <SectionHeader num="§ 11" title="Social Surface" />

      <PQ>
        A collectible without a social surface is a private inventory. With one, it is a
        public statement.
      </PQ>

      <P>
        Top Shot&rsquo;s Showcase pages drive more shareable content than any other surface
        on the platform. The mechanic is well-understood: collectors curate a public
        portrait built from their cards, and other collectors follow, comment, and
        emulate. LoreVault adopts the Showcase primitive directly and adapts the
        layout and metadata to surface the literary doctrine — Pane organization,
        contributor-credit rows, provenance ledger as narrative, and the Footnoter&rsquo;s
        editorial layer in place of the algorithmic Spotlight.
      </P>

      <H3El>Profile</H3El>

      <P>
        Every collector has a Profile page at <code style={{ color: '#C9A26B' }}>/p/[handle]</code>.
        The profile renders the collector&rsquo;s handle, tier badge (Tier 0 through 4), the
        Showcase grid (a player-curated selection of five featured cards), the Pane-mastery
        badges earned (one badge per Pane the collector has reached at least twenty-five
        percent on), the contributor-credit row (for Tier 3+ collectors with accepted
        flavor lines), and a public ledger of recent transactions. The profile is the
        collector&rsquo;s identity within the literary engine; it is what they share when
        they share a card screenshot, and it is what other collectors see when they follow.
      </P>

      <H3El>Showcase</H3El>

      <P>
        The Showcase is the wall — a draggable grid of cards organized by the collector
        themselves. Two organizational modes ship in MLP. The <I>Pane-organization</I> mode
        groups cards by Pane attribution, with each Pane forming a column of the grid; this
        is the default for a literary collector and reads as a Pane-by-Pane portrait. The
        <I> free-form</I> mode lets the collector arrange cards in any layout they choose,
        which is the mode the taste-collector archetype prefers. The Showcase is shareable
        as a single image (rendered server-side at the moment of the share, with the
        collector&rsquo;s handle and tier visible as a small marker in the corner). The
        share-a-screenshot primitive is one of the doctrine&rsquo;s yardstick-seven
        retention metrics; the Showcase is the surface that makes screenshots worth
        screenshotting.
      </P>

      <H3El>Fan-canon ladder (Tier 2+)</H3El>

      <P>
        The fan-canon ladder is the participation surface. At Tier 2, a collector can
        propose a challenge to the community-vote queue — a custom challenge title, target
        condition, and reward proposal that the community votes on. Accepted challenges
        ship to the daily / weekly cycle for the next two weeks. At Tier 3, a collector
        can submit a flavor line for an upcoming card; the Council reviews the submission
        through the six-test gate (Recognition, Necessity, Consequence, Voice-Inevitability,
        Footnote, Prose-Signature), and accepted submissions are published with the
        contributor&rsquo;s handle in the card&rsquo;s permanent metadata. At Tier 4, a
        collector can propose a new Adjacent or Foil Pane for a future Series; the Council
        reviews proposals at quarterly cadence. The fan-canon ladder is the doctrine&rsquo;s
        answer to the participation-cosmology question that the SCP-Foundation /
        Homestuck / RWBY ecosystems have been answering for fifteen years; LoreVault
        formalizes the ladder as a structural commitment, not a fan-tolerated afterthought.
      </P>

      <H3El>Contributor credit</H3El>

      <P>
        Tier 3+ contributors whose flavor submissions get accepted into canon receive
        credit on the card permanently. The credit appears on the card detail page (a small
        line below the flavor text: <I>flavor by [handle]</I>) and on the
        contributor&rsquo;s Showcase (a row listing all cards their lines appear on). The
        credit is the public marker of literary contribution; it is visible to every
        collector who hovers the card detail, which means a Tier-3 contributor&rsquo;s name
        is encountered by every future buyer of every card they wrote on. This is the
        long-tail social proof that the participation-cosmology doctrine compounds on.
      </P>

      <H3El>The provenance ledger as narrative</H3El>

      <P>
        Every card carries a public provenance ledger — the chain of collectors it has
        passed through. The ledger is rendered not as a transaction log (block-explorer
        style) but as narrative: <I>this card passed through seven collectors before
        arriving here. The first owner kept it for fourteen minutes. The fourth owner held
        it for nine months and listed it three times before selling. The previous owner
        held it for eleven days and traded it for a Pane-Lud-Border Rare.</I> The
        narrative-rendering of provenance is what converts the chain-of-custody data from
        a record-keeping primitive into a literary primitive. A collector who buys a card
        with a long provenance is buying into a story that has been told by a sequence of
        prior collectors; the doctrine treats this as part of the card&rsquo;s buried
        weight, and the marketplace surface makes the ledger visible at trade time.
      </P>

      <H3El>The Footnoter&rsquo;s Letter — editorial Spotlight</H3El>

      <P>
        Where Top Shot ships an algorithmic Spotlight surface that surfaces newly-traded
        and newly-listed Moments by volume, LoreVault ships the Footnoter&rsquo;s Letter
        — a weekly editorial publication in which the Footnoter persona elevates one card
        per week with a roughly two-hundred-word write-up. The card is chosen because it
        metabolizes a buried-weight thread, not because it is rare or expensive. A
        Footnoter Letter card may be a Common from an inactive Pane; the editorial layer
        is what makes the literary register legible. The Footnoter Letter is published
        every Tuesday at noon UTC and is the single most-read editorial surface in the
        product. It is also the announcement vehicle for the weekly Prediction conflict
        described in § 10. One letter, two functions: literary spotlight and Prediction
        announcement.
      </P>
    </section>
  );
}
