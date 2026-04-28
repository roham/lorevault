import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionRaritySupply() {
  return (
    <section id="section-4">
      <SectionHeader num="§ 4" title="Rarity & Supply" />

      <PQ>
        Rarity is the structural commitment of the product to its collectors. Edition sizes
        are the contract.
      </PQ>

      <P>
        Every successful collectibles product owes its longevity to a rarity discipline that
        was committed early and never broken. Pokémon TCG&rsquo;s secondary market exists
        because rarity is fixed — no print run is unlimited. MTG&rsquo;s reserved-list
        controversy was about a rarity commitment broken decades after the fact, and the
        wound persists. Top Shot&rsquo;s edition-size discipline is what protects Legendary
        scarcity even as monthly drops continue. LoreVault&rsquo;s rarity commitments are
        below; they are the contract with the collector that the product will not later
        rewrite.
      </P>

      <H3El>Rarity bands and edition sizes</H3El>

      <P>
        <I>Common</I> editions run from five thousand to fifteen thousand per card. The
        upper bound is below Top Shot&rsquo;s sixty-thousand-edition Commons because the
        LoreVault collection&rsquo;s literary register cannot support that scale — a card
        whose flavor line is read by sixty thousand collectors is a card whose buried weight
        gets diluted. <I>Rare</I> editions run from five hundred to two thousand per card.
        These are the workhorse cards of set completion; the floor for Rares is where the
        Smashable Floor mechanic does most of its work. <I>Legendary</I> editions run from
        fifty to one hundred and ninety-nine per card. These are the prestige cards, the
        ones that get the iceberg-slow reveal in the pack-rip ritual. <I>Contraband-Rare</I>
        editions run from one to twenty-five per card. These are the structural-contraband
        cards of each Pane — the fairy-fruit, the unwritten promise, the verb-that-names —
        and they carry the semantic premium that drives the contraband economy in § 3.
        <I> Pierre-Menard Unique</I> editions are 1-of-1 per Pane variant; the same card
        text ships across N Panes, one of each, making N total unique editions, each its
        own one-of-one in its own Pane. These are the Borgesian rarity primitive, the
        market test of the doctrine.
      </P>

      <H3El>Serial structure and low-mint prestige</H3El>

      <P>
        Every card&rsquo;s serial is publicly visible the way Top Shot serials are public.
        The low-mint market is a parallel economy operating on top of the rarity-tier
        economy. A #1 of any Rare carries a premium independent of the card. A #7 of a
        Lud-Border card carries a Pane-significant premium because seven is the count of
        the Lampblack-hierarchy positions, and the Lud-Border collector reads #7 as a card
        that holds the full hierarchy. A #N where N matches a Pane-significant number is
        flagged in the marketplace with a small badge. The product does not invent these
        numbers; it lets the doctrine and the collectors discover them, and surfaces them
        once they stabilize.
      </P>

      <H3El>Drop cadence per rarity</H3El>

      <P>
        Common cards drop weekly within an active Pane&rsquo;s active Set. Rare cards drop
        every other week. Legendary cards drop monthly, anchored to the Tentpole drop of
        the Series. Contraband-Rare cards drop at the close of each Set — one or two
        Contraband-Rares per Set, surfaced as the final pull of the Set&rsquo;s release
        arc. Pierre-Menard Unique cards drop only at cross-Pane narrative events (the
        Prediction event in § 10) and only at most once per quarter. The cadence is a
        rhythm a collector can internalize without consulting a calendar; daily and weekly
        and monthly and seasonal beats are visible from any product surface.
      </P>

      <H3El>Pane archetype mix per Series</H3El>

      <P>
        A Series ships with three to five active Panes in a specific shape. The
        <I> Tentpole Pane</I> is the Series&rsquo;s gravitational center; it carries roughly
        thirty to forty cards across two Sets and receives the largest art, prose, and
        marketing budget. The <I>Adjacent Panes</I> (two of them) carry fifteen to
        twenty-five cards each across one or two Sets; they share an edge, a contraband, or
        a refused god with the Tentpole and cross-pollinate cards and lore. The <I>Foil
        Pane</I> is tonally and metaphysically opposite to the Tentpole — if the Tentpole
        is Old-Ones-Persist (cosmic horror, denial), the Foil is Sinterklaas-Reigns (moral
        comedy, ledger) — carrying ten to fifteen cards. The <I>Wildcard Pane</I> is
        optional, used in roughly one of three Series, and intentionally breaks the
        Series&rsquo;s grammar; it carries five to ten cards. The total card count per
        Series sits in the seventy-to-one-hundred-and-twenty range, depending on
        Wildcard and the Tentpole&rsquo;s scope.
      </P>

      <H3El>Retirement and rotation</H3El>

      <P>
        A Pane becomes <I>inactive</I> at the end of its second Series (twelve months from
        first appearance) — no new cards drop, but existing cards remain tradeable on the
        secondary forever. A Pane becomes <I>retired</I> at the end of its third Series — at
        which point the Cadence contract for that Pane is locked, no new mints can be
        produced under any future amendment, and the collector economy is frozen at the
        edition sizes shipped. Retirement is the long-game commitment; it is what protects a
        ten-year-old card from a five-years-from-now reissue. The doctrine&rsquo;s
        substrate-not-anthology argument requires this; without retirement, the substrate
        becomes a printer.
      </P>
    </section>
  );
}
