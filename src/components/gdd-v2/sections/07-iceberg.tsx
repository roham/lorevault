import {
  SectionHeader,
  P,
  PQ,
  H3El,
  CardExample,
  IllustrationPlaceholder,
  I,
} from '../shared';

export function SectionIceberg() {
  return (
    <section id="section-7">
      <SectionHeader num="§ 7" title="Iceberg 2:1:8 — The Single Buried Weight" />

      <PQ>
        Almost everything is surface. Almost nothing is echo. One enormous unspoken weight sits
        underneath every Pane. Faerie in Lud. The Unmade in Earthsea. Idealism in Tl&ouml;n.
      </PQ>

      <IllustrationPlaceholder
        id="hero-07-iceberg"
        caption="A schematic of the 2:1:8 ratio rendered as a thin gold rule above a thinner blue rule above an enormous unmarked dark mass. The mass has no contour; it is a felt presence."
        aspectRatio="3 / 2"
      />

      <P>
        The V1 doctrine inherited a 1:2:4 iceberg from novelistic worldbuilding. That ratio is
        wrong for cards by an order of magnitude. A novel reader is in the middle of a
        six-hundred-page narrative arc; a card reader is in a seven-second encounter with a
        single object that may be the only thing they ever see from that Pane. Surface must be
        over-weighted. Echo must be small and precise. Deep must be enormous and singular.
      </P>

      <H3El>The corrected ratio</H3El>

      <P>
        The right ratio is two parts surface, one part echo, eight parts deep, with one buried
        weight per Pane. Two parts surface is the legibility-on-first-encounter layer: the
        flavor line, the figure&rsquo;s gesture, the silhouette read at half a second, the
        rarity badge that telegraphs through composition. One part echo is the precise hook
        that a collector who owns two cards from the Pane feels as a connection — a recurring
        proper noun, a cycle, a refused gesture, a banned color repeated. Eight parts deep is
        the pressure underneath, never directly shown, metabolized over time by the wiki, by
        secondary media, by the Mirrleesian leak.
      </P>

      <P>
        Tolkien&rsquo;s <I>Silmarillion</I> runs roughly one part surface to five parts echo
        to thirty parts deep. Le Guin&rsquo;s Earthsea runs roughly one to one-point-five to
        three. Mirrlees&rsquo;s <I>Lud-in-the-Mist</I> runs roughly one to one to eight, with
        one enormous unspoken weight underneath — Faerie itself, never directly described.
        The card-collectible product is structurally closest to Mirrlees, except surface must
        be doubled because cards travel alone. Hence two-to-one-to-eight.
      </P>

      <H3El>One weight per Pane</H3El>

      <P>
        The error V1 inherited from generic worldbuilding is multiplying mysteries. Cards that
        introduce new unexplained factions, contradictory captions, and offscreen
        place-name-stacks read as deep. They are not deep. They are a disease GPT-grade
        worldbuilding produces in volume — fake mystery, where the absence of explanation is
        substituted for the presence of weight. The cure is Le Guin and Mirrlees: imply one
        enormous thing under each Pane, and let everything else clarify it. Lud has Faerie.
        Earthsea has the Unmade. Tl&ouml;n has idealism. Old-Ones-Persist has the Pre-Causal
        Observer. Sinterklaas-Reigns has the cosmological function the Pane personifies as a
        saint. One weight, named in the grammar, defended in production.
      </P>

      <P>
        The eight parts deep are not eight separate mysteries. They are eight facets of one
        weight. A card that adds a new mystery without metabolizing or referencing the
        existing weight is rejected by the six-test gate, regardless of the card&rsquo;s art
        quality or flavor polish. Cards that violate the rule get cut, even if they are
        pretty. Especially if they are pretty, because pretty cards survive longer in
        production review and do more damage to the cosmology if they ship.
      </P>

      <H3El>Tracking the weight</H3El>

      <P>
        The weight is a tracked artifact, not a vibe. Every Pane in active live-ops has a
        single document — the Weight Ledger — that lists the buried weight, every card
        currently shipped that references it, and the form of the reference. New card
        proposals are checked against the ledger. A proposal that strengthens the weight
        passes. A proposal that adds a parallel mystery is sent back to the writer with a
        note: metabolize the existing weight or change the Pane.
      </P>

      <H3El>The card example</H3El>

      <CardExample
        name="The Geological Survey's Polite Cover Note"
        pane="Old-Ones-Persist"
        rarity="Common"
        flavor="The Survey thanks you for your most recent report and offers its assurance that the matter has been entered into the appropriate file. No further action will be required from you. We trust this finds you well."
        buriedWeight="The Pre-Causal Observer is being managed by an institution. The institution does not know it is being managed."
      />

      <P>
        The card is a Common — surface-weighted, no figure, no proper name, no cosmological
        proper-noun stack. The two parts surface read instantly: a polite letter, the
        bureaucratic register, the final sentence that disclaims the very correspondence the
        letter consists of. The one part echo lands on a re-read: <I>no further action will
        be required from you</I> is a sentence the Survey writes to people who have written
        too many reports. The eight parts deep belong to the Pane&rsquo;s buried weight, never
        stated on the card. Across forty Old-Ones-Persist cards, the Geological Survey letters
        recur. The reader assembles the weight without ever being told what the weight is.
      </P>

      <H3El>Earthsea&rsquo;s Unmade as production model</H3El>

      <P>
        Le Guin never directly describes the Unmade. The Unmade is a region in the cosmology
        where balance has failed and names have come apart. <I>The Tombs of Atuan</I> takes
        place inside the Unmade and refuses to describe it; <I>The Farthest Shore</I> takes
        place because the Unmade is leaking, and refuses to describe the source of the leak.
        The Unmade is what every Earthsea card would refer to without ever showing. That is
        the production discipline. The buried weight is heard, not seen. A Pane that shows its
        buried weight on the card has burned the weight for one card&rsquo;s worth of vibe.
        That is the most expensive trade the product can make and it is almost never worth it.
      </P>
    </section>
  );
}
