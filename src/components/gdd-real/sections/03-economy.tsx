import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionEconomy() {
  return (
    <section id="section-3">
      <SectionHeader num="§ 3" title="Economy & Monetization" />

      <PQ>
        Top Shot is the right substrate for the commercial layer. The literary layer is
        what makes the substrate worth attaching to.
      </PQ>

      <P>
        A digital collectibles game lives or dies by its economy. The numbers in this
        section are the contract LoreVault makes with its collectors and with the Dapper
        platform that funds it. Edition sizes, take rates, treasury splits, and contributor
        payouts are not vibes; they are commitments that determine whether the product
        compounds into a five-year economy or evaporates after the launch spike. Top Shot
        spent the first eighteen months of its life calibrating these numbers under live
        load; LoreVault inherits that calibration and adapts where the literary register
        demands a departure.
      </P>

      <H3El>Primary sales — pack drops and revenue split</H3El>

      <P>
        Primary sales are the pack-drop revenue. A Standard Pack at nine dollars contains
        five cards. A Pane Pack at fifteen dollars contains five cards drawn only from one
        Pane, with elevated Rare odds. A Premium Pack at thirty-nine dollars guarantees one
        Legendary. A Case at three hundred and ninety-nine dollars guarantees one
        Contraband-Rare and contains fifty cards across rarities. The price ladder mirrors
        Top Shot&rsquo;s ladder, scaled down because LoreVault&rsquo;s collection is younger
        and the whale tier is undeveloped. The split: Dapper platform takes thirty percent
        for hosting, payment processing, custodial wallet, marketplace infrastructure, and
        chain operations. The remaining seventy percent goes to LoreVault treasury, which
        funds production (art, prose, engineering) and a five percent ringfence to the
        Contributor Pool. There is no third-party IP holder for original Panes; for any
        late-Series Pane that licenses third-party content, the IP licensor takes ten
        percent off the top with the rest of the math unchanged.
      </P>

      <H3El>Secondary sales — royalties and the take-rate stack</H3El>

      <P>
        Secondary sales — collector-to-collector — carry a five percent total take rate, the
        Top Shot calibration. The split inside that five percent: two and a half percent to
        Dapper as the platform fee, two and a half percent to the LoreVault &ldquo;creator
        royalty,&rdquo; of which one percent is held by LoreVault treasury and one and a
        half percent flows to the Contributor Pool. This routing is doctrine-load-bearing.
        Top Shot&rsquo;s royalty flows to the IP-rights-holder (the NBA + Players
        Association); LoreVault has no third-party rights-holder for original Panes, so the
        equivalent slice is rerouted to the contributors who write the flavor lines and
        propose the contraband. The Contributor Pool is what makes Tier 3 of the
        participation architecture an economic relationship, not an unpaid emotional labor
        relationship. Without the pool, the participation ladder is a fan-canon system; with
        the pool, it is a revenue-share system that compounds the product&rsquo;s literary
        substrate.
      </P>

      <H3El>Pierre-Menard high-rarity — why the same text earns a premium</H3El>

      <P>
        The most counterintuitive economic claim in this document is that two cards with
        identical text but different Pane attribution should command different secondary
        prices, and that the premium on the rarer-Pane variant is real economic value, not
        speculation. The argument is Borges&rsquo;s. In <I>Pierre Menard, Author of the
        Quixote</I>, Menard rewrites <I>Don Quixote</I> word-for-word in the twentieth
        century, and Borges argues — straight-faced — that Menard&rsquo;s text is richer than
        Cervantes&rsquo;s, because the same words mean different things in a different time.
        LoreVault ships this argument as a market mechanic. At Legendary and above, the
        product ships literally identical card text across two or three Panes, varying only
        the art and the Pane attribution, and the market is allowed to discover the price of
        the cosmological pressure. A Holmes &ldquo;refusal to admit ignorance&rdquo; line on
        a Baker-Street Pane card is heroic. The same line on an Old-Ones-Persist Pane card
        is monstrous. The same line on a Sinterklaas-Reigns Pane card is sinful. The text is
        the same. The cards are different. The collector who pays the premium for the
        Old-Ones-Persist variant is paying for the cosmological inversion the variant carries.
        The market routes signal through pricing the way it does for any semantically-loaded
        scarce object. The Top-Shot-shaped collector who walks past this and asks &ldquo;why
        does the same text cost more&rdquo; is asking a question the literary product is
        designed to answer.
      </P>

      <H3El>Contraband-rare market structure</H3El>

      <P>
        The contraband-rare cards of each Pane carry a structural premium that is independent
        of edition size. A Common contraband card with a five thousand edition can clear above
        a Rare non-contraband card with a five hundred edition because the contraband is the
        cosmological leak — Mirrlees&rsquo;s Lud-in-the-Mist primitive — and collectors who
        understand the doctrine assign semantic weight to the leak. The marketplace must
        render the contraband badge prominently, and the floor price discovery surface must
        treat contraband as its own filter axis. This is Atlas-side negotiation work
        documented in the Atlas spec; without the badge, the market cannot see the signal,
        and the contraband-rare premium evaporates into noise.
      </P>

      <H3El>Treasury management</H3El>

      <P>
        The LoreVault treasury holds operating reserve, pre-funded contributor payouts for
        the next two quarters, and a strategic reserve sized at twelve months of run-rate.
        Operating reserve covers art (FLUX-1.1-Pro renders at thirty cents per card across
        roughly three thousand assets per Series), prose (Pratchett-grade contractor rates,
        roughly twenty Sets per Series at five hundred per Set), platform engineering (a
        small dedicated team), and the Atlas-side custom hooks (low single-digit
        engineer-weeks per quarter). The strategic reserve protects the product from a
        single-Series shortfall — if Series 2 underperforms the Series 1 conversion math,
        the reserve covers Series 3 production while the doctrine retunes.
      </P>

      <H3El>Sustainability math</H3El>

      <P>
        The unit economics close on a base case where: a Series of twelve to fifteen Sets
        ships across six months, with roughly one hundred and twenty cards live at any
        moment; primary pack revenue averages two hundred thousand dollars per month at
        steady state (a tenth of Top Shot&rsquo;s monthly primary in 2022, calibrated to
        LoreVault&rsquo;s smaller audience); secondary volume scales to roughly five times
        primary on month four (Top Shot&rsquo;s ratio is six to seven, LoreVault is more
        conservative); treasury take after platform fees is approximately one hundred and
        forty thousand per month from primary plus thirty-five thousand from secondary;
        production cost runs roughly eighty thousand per month at one Series per six months
        with two FTE on production and one on engineering. The base case clears margin at a
        modest run-rate; the upside case (Series 2 hits Top Shot-comparable scale per active
        collector) clears margin at twice that. The downside case (Series 1 underperforms
        the median Top Shot Series-1 launch by half) clears break-even with the Strategic
        Reserve providing twelve months of runway to retune. None of this is a forecast; it
        is a stress-test of the structural commitments made in this section against the
        production cost commitments made in § 14 (Atlas Integration) and § 15 (Roadmap).
      </P>
    </section>
  );
}
