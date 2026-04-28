import { SectionHeader, P, PQ, H3El, CardExample } from '../shared';

export function SectionNinetyFiveFive() {
  return (
    <section id="section-2">
      <SectionHeader num="§ 2" title="The 95/5 Rule — What the Silhouette Must Say" />

      <PQ>
        Architecture must deliver mythic-invariant satisfaction at zero-point-four-second
        silhouette-glance for ninety-five percent of collectors, and reward the interpretive
        five percent with the buried weight underneath.
      </PQ>

      <P>
        The dominant failure mode of literary card-collectible products is that the people who
        write them are literary readers. The team reads, they internalize cosmology in long
        arcs, they think the median collector will too. The median collector will not. The
        median collector engages with a card the way you engage with a poster on a co-worker&rsquo;s
        wall: they look at it for less than a second, they form a vibe, they move on. If the
        vibe is wrong they never look again. If the vibe is right they keep the card on a
        digital shelf and feel good about owning it for a year. They will never read the wiki.
        They will never connect a card from one Pane to a card from another. They will never
        notice the Pierre Menard variants. The architecture has to deliver to them anyway.
      </P>

      <P>
        This is not a concession to casual taste. It is a structural fact about how
        seven-second encounters work. A card that does not communicate its cosmology in the
        zero-point-four seconds before the reader makes a vibe judgment is a card that has lost
        its only encounter. The literary depth underneath only matters if the surface earns the
        right to be looked at twice.
      </P>

      <H3El>What the silhouette has to do</H3El>

      <P>
        The silhouette layer is doing four jobs at once and most product teams can&rsquo;t name
        any of them. First, the silhouette has to identify the Pane in less than half a second.
        Not the figure — the Pane. A reader who has never heard of Sinterklaas-Reigns should
        feel administrative-comedy-with-a-knife-underneath before they read a single word of
        the card. Second, the silhouette has to identify the rarity tier without reading the
        rarity badge. Premium rarity has to telegraph through composition density, palette
        commitment, and the felt weight of the figure&rsquo;s posture. Third, the silhouette
        has to telegraph the figure&rsquo;s cosmological role — the one-line answer to
        &ldquo;what does this figure do under this Pane&rsquo;s axiom?&rdquo; Fourth, and
        hardest, the silhouette has to leave a recognizable visual fingerprint that holds when
        the card is shrunk to a phone-thumbnail in a drop notification.
      </P>

      <P>
        The four jobs are why the Lampblack hierarchy in V2 starts with gesture, not prop.
        Props are silhouette-illegible at thumbnail scale. A pipe is a brown smudge at
        forty-pixel width. A figure&rsquo;s gesture — a hand raised in refusal, a back turned
        toward an open ledger, a head tilted toward something the viewer cannot see — survives
        compression. Gesture is the load-bearing element of silhouette. The hierarchy is built
        for that fact.
      </P>

      <H3El>What the buried weight rewards</H3El>

      <P>
        The five percent of collectors who read the wiki are the audience that produces the
        product&rsquo;s social proof. They are forum culture, lore-podcasters, fanfic writers,
        and the people who post detailed reads of single cards to communities that the
        ninety-five percent encounter as ambient signal. The five percent is what tells the
        ninety-five percent that the thing they bought into is a real thing. If the product
        does not feed the five percent, the ninety-five percent will eventually feel the
        thinness and leave.
      </P>

      <P>
        Feeding the five percent is what the iceberg&rsquo;s deep layer is for. One buried
        weight per Pane, never directly stated, referenced by accumulation. The wiki is where
        that weight is metabolized. The buried weight is what makes a re-read possible — the
        reason a collector who owns thirty cards from a Pane re-encounters the first card and
        sees something they missed. The card has not changed. The reader has acquired the
        cosmology that the card was always implying.
      </P>

      <H3El>The card example</H3El>

      <CardExample
        name="The Magistrate Who Kept Writing Last Year's Date"
        pane="Sinterklaas-Reigns"
        rarity="Legendary"
        flavor="He dated every judgment Reckoning-Year 12 for nine years. When they finally looked in his ledger, they found he had been right."
        buriedWeight="The Pane's axiom implies time is administered, not experienced."
      />

      <P>
        At the silhouette layer, the magistrate is a man hunched over a ledger with a pen in
        his right hand and his left hand flat on a closed book. The vibe is bureaucratic,
        slightly comic, slightly menacing — Sinterklaas-Reigns identified within a half-second.
        At the surface flavor layer, the joke lands: he wrote the wrong date for nine years. At
        the echo layer, the second sentence pivots — the joke is not a joke. He was right. At
        the deep layer, the buried weight metabolizes: in a Pane where time is administered
        rather than experienced, a magistrate&rsquo;s ledger is not a record of when things
        happened. It is a determination of when things happened. The five percent will arrive
        at that reading. The ninety-five percent will feel its weight without articulating it,
        and that is exactly what the architecture is for.
      </P>
    </section>
  );
}
