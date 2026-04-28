import { SectionHeader, P, PQ, H3El, CardExample, I } from '../shared';

export function SectionPierreMenard() {
  return (
    <section id="section-11">
      <SectionHeader
        num="§ 11"
        title="Pierre Menard at Industrial Scale — Identical Text, Different Worlds"
      />

      <PQ>
        At high rarity, ship literally identical card text varying only by Pane attribution
        and art. Let the cosmology do the work of differentiation. This will horrify a normal
        CCG designer. It is correct.
      </PQ>

      <P>
        Borges&rsquo;s <I>Pierre Menard, Author of the Quixote</I> argues, straight-faced,
        that Pierre Menard&rsquo;s twentieth-century reproduction of <I>Don Quixote</I> —
        word for word, comma for comma — is a richer text than Cervantes&rsquo;s seventeenth-
        century original, because the same words mean different things in a different time.
        Cervantes&rsquo;s &ldquo;truth, whose mother is history&rdquo; is a rhetorical
        commonplace. Menard&rsquo;s &ldquo;truth, whose mother is history,&rdquo; written
        after pragmatism, after William James, after the wreck of nineteenth-century
        certainty, is a philosophical bombshell. Same words. Different cosmology. Different
        text.
      </P>

      <H3El>The card-design rule</H3El>

      <P>
        At high rarity — Legendary and above — ship identical card text across two or more
        Panes. Vary only the art and the Pane attribution. Let the cosmology do the
        differentiation. A flavor line that reads as moral comedy under Sinterklaas-Reigns
        reads as cosmic horror under Old-Ones-Persist and as administrative tragedy under
        Lud-Border. The text has not changed. The Pane has changed under it. The card has
        changed.
      </P>

      <P>
        This violates the central reflex of card-game design, which is that every card must
        have a unique text string. The reflex exists because mechanical-text uniqueness has
        been confused with literary uniqueness. Mechanical text — the rules-text — must of
        course be unique per card. Flavor text — the cosmology-bearing layer — operates
        under different rules. Identical flavor across Panes is a feature, not a bug, when
        the cosmology produces incommensurable readings.
      </P>

      <H3El>The Refusal — three Panes, one text</H3El>

      <P>
        Take the gesture of refusal. The figure who refuses to know. Three legendaries, three
        Panes, identical flavor text, three different cards.
      </P>

      <CardExample
        name="The Refusal — Holmes-Canonical Variant"
        pane="Holmes-Canonical-London"
        rarity="Legendary"
        flavor="He told the witness that he did not know whether the witness had taken the coin. The witness wrote down that he had refused to know. That entry was the one that mattered."
        buriedWeight="In a world where deduction is the engine, refusing to know is the move that keeps the case alive for one more page. The detective is heroic."
      />

      <CardExample
        name="The Refusal — Old-Ones-Persist Variant"
        pane="Old-Ones-Persist"
        rarity="Legendary"
        flavor="He told the witness that he did not know whether the witness had taken the coin. The witness wrote down that he had refused to know. That entry was the one that mattered."
        buriedWeight="In a world where the Pre-Causal Observer is awake, refusing to know is a leak. The Geological Survey will be in touch about the matter shortly."
      />

      <CardExample
        name="The Refusal — Sinterklaas-Reigns Variant"
        pane="Sinterklaas-Reigns"
        rarity="Legendary"
        flavor="He told the witness that he did not know whether the witness had taken the coin. The witness wrote down that he had refused to know. That entry was the one that mattered."
        buriedWeight="In a Pane where time is administered, refusing to know is perjury against the calendar. He will be reckoned at year's end."
      />

      <P>
        The flavor lines are byte-identical. The buried-weight notes — which appear in
        editorial documentation, not on the card — make the cosmologies&rsquo; readings
        explicit for production review. To the collector, the three cards are three
        completely different cards. The Holmes-Canonical reader smiles at the procedural wit.
        The Old-Ones-Persist reader feels the floor shift. The Sinterklaas-Reigns reader
        hears the scribe&rsquo;s pen scratch in the next room. The same words. Three
        cosmologies. Three cards.
      </P>

      <H3El>Crowley&rsquo;s confirmation</H3El>

      <P>
        John Crowley&rsquo;s <I>Little, Big</I> is the working novel of this rule. Smoky&rsquo;s
        relationship to the Tale at thirty is the same gesture as Auberon&rsquo;s at forty
        and Lilac&rsquo;s at six. The gesture has not changed. The world&rsquo;s relationship
        to Faerie has changed underneath. The reader does not need to be told that the
        gestures rhyme. The reader feels the gestures rhyme. That is the resonance the
        Pierre Menard variants are after.
      </P>

      <H3El>Where the variants live</H3El>

      <P>
        Pierre Menard variants are reserved for cross-Pane Series moments — narratively
        load-bearing events that touch a Tentpole and a Foil simultaneously. They are not
        the default. They are the rarest production move the product makes. A Series moment
        that ships three identical-text Legendaries is the cosmological proof of the
        Series&rsquo;s thesis. It is also expensive: each variant requires a full art
        commission and a complete six-test gate run. Pierre Menard variants are quarterly
        events, not weekly drops.
      </P>

      <H3El>What it teaches the wiki</H3El>

      <P>
        The five percent — the wiki readers, the lore-podcasters, the fanfic writers — will
        notice the Pierre Menard variants the day they ship and will produce essays about
        them within a week. Those essays are the social proof that lets the ninety-five
        percent feel they have bought into a cosmology rather than a card pack. The Pierre
        Menard program is a piece of marketing infrastructure as much as a piece of design.
        The cards do not advertise themselves. The variants advertise the cosmology.
      </P>
    </section>
  );
}
