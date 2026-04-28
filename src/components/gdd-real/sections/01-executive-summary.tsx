import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionExecutiveSummary() {
  return (
    <section id="section-1">
      <SectionHeader num="§ 1" title="Executive Summary" />

      <PQ>
        LoreVault is a digital collectibles game built on the Lore Doctrine — a literary
        engine in collectible-card clothing.
      </PQ>

      <P>
        The product is a Dapper-platform-native collectibles game whose distinguishing claim
        is that the cards are not pictures of things; they are positions in a cosmology. Every
        card carries a Pane attribution — the cosmological variant under whose pressure the
        card was made — and every Pane carries a structural contraband, a buried weight, and
        a three-to-five-element rule-grammar that determines what its cards can mean. The
        cards are NFTs on Flow, custodially held, paid for in fiat through Apple Pay, traded
        on the Atlas marketplace at a 5% take rate. The literary surface is what makes the
        product worth building; the platform substrate is what makes it possible to ship
        without rebuilding the entire stack.
      </P>

      <H3El>Who it is for</H3El>

      <P>
        Four primary archetypes. The gambler-completionist who already owns Top Shot Moments
        and will spend a thousand dollars in a single drop if the scarcity is credible. The
        Pratchett-discoverer, eighteen to twenty-eight, who arrived at Discworld through the
        2026 Puffin graphic novels and stays for sentences before they stay for cards. The
        taste-collector, designer or gallerist or architecture-Twitter, who is post-PFP and
        wants lore without jpeg-shame. The lore-hunter, BookTok-and-Tumblr native, who joined
        Dracula Daily for the memes and stayed for the community, and who will read every
        flavor line, post theories on the Canon Theory Wall, and notice that the cane in
        Baker-Street-One is the same cane in Greek-Myth-Three a month before the Footnoter
        confirms it. These four are reached through four different first-encounter doors and
        funneled into the same collecting loop.
      </P>

      <H3El>What is load-bearing</H3El>

      <P>
        Five primitives. Panes — cosmological variants, three to five active per Series, each
        carrying its own contraband and buried weight, defended by the Pane Grammar JSON
        spec. Cards with iceberg 2:1:8 depth — surface over-weighted for the 0.4-second
        silhouette-glance, one Echo unit, eight units of buried weight that compounds across
        the wiki, the secondary media, and the fan-canon ladder. The contraband economy —
        the structural primitive that gives high-rarity cards their semantic premium beyond
        scarcity-numeric. Pierre-Menard high-rarity duplicates — the same card text shipped
        across Panes with different cosmological pressure, where Borges's argument that the
        same words mean different things in different times becomes a card-design rule. The
        participation tier ladder — Tier 0 passive collector through Tier 4 canon
        contributor, with Series 1 shipping participation-disabled but the ladder visible.
      </P>

      <H3El>The hook</H3El>

      <P>
        A first-time visitor lands on a tile grid of three Panes, each with one painted card
        bled to the edge and one axiom in restrained small caps. They pick a Pane. A pack
        opens. Five cards reveal, the Legendary slowing to a Mirrlees-iceberg pause before
        it flips. The first card has a buried weight under it that the visitor will not see
        for another six visits, and an Echo line that they will see in five seconds, and a
        surface that lands at silhouette-glance. They go from landing page to opened pack in
        five screens. They have not used the word <I>NFT</I>. They have not signed a
        seed-phrase. They have one card in hand and a Pane to come back to.
      </P>
    </section>
  );
}
