import {
  SectionHeader,
  P,
  PQ,
  H3El,
  CardExample,
  IllustrationPlaceholder,
  I,
} from '../shared';

export function SectionContraband() {
  return (
    <section id="section-5">
      <SectionHeader num="§ 5" title="Contraband — The World Leaks from the Bottom" />

      <PQ>
        Pane-as-pitch-deck is the failure mode, not Pane inflation. Heresy without leak is
        theology. Cards live at the leak.
      </PQ>

      <IllustrationPlaceholder
        id="hero-05-contraband"
        caption="A Lud-of-the-Mist border post at dusk. A cart half-loaded with crates of fairy fruit. The customs officer is writing in a ledger; the carter is staring past him at the hill. The fruit on the top crate has the unmistakable warm-rotten-honey color the Pane is not supposed to admit exists."
        aspectRatio="16 / 9"
      />

      <P>
        Hope Mirrlees published <I>Lud-in-the-Mist</I> in 1926 and almost nobody read it for
        seventy years. The book&rsquo;s lesson is the most under-cited and most relevant for
        this product. Lud is a mundane town — bourgeois, lawful, accountancy-coded — and it
        sits on the border with Faerie. The novel&rsquo;s entire force comes from how the
        cosmology leaks through civic life. There is a forbidden fruit. There is a missing
        word. There is a banned color. There is a magistrate who keeps writing the wrong year
        on his ledgers. The cosmology of Faerie is never directly described, never
        catalogued, never tabled. The cosmology emerges as the leak&rsquo;s source. By the end
        of the book the reader has not read a single sentence about Faerie&rsquo;s gods or
        history or laws, and yet they know what Faerie is, because they have watched the leak
        for two hundred pages.
      </P>

      <H3El>The operative rule</H3El>

      <P>
        Every Pane must have a contraband. A contraband is a specific, named, civic,
        smuggleable thing — a fruit that turns the tongue blue when bitten, a verb the
        magistrates have removed from the legal register, a color that no dyer is licensed to
        mix, a name that priests refuse to pronounce on Thursdays — that the world&rsquo;s law
        forbids and which is nevertheless eaten, said, mixed, pronounced, pulled across the
        border. The contraband is the correlative of the heresy. The heresy is the axiom; the
        contraband is the axiom expressed as a substance you can put in a wagon.
      </P>

      <P>
        This is not metaphor. The contraband must be specifiable in one civic sentence. In
        Lud-in-the-Mist&rsquo;s home Pane the contraband is fairy fruit — the warm-rotten-honey
        flavor, the soporific aftertaste, the way it turns the tongue blue and the dreams
        green. In Sinterklaas-Reigns the contraband is the Unwritten Promise — an oath spoken
        but deliberately kept off the ledger, a debt the moral economy cannot register and
        therefore cannot reckon. In Old-Ones-Persist the contraband is the Verb-That-Names —
        the conjugation that admits an observer. Speakers of the Verb-That-Names disappear
        within the week. The conjugation is nevertheless taught, in private, by tutors who
        charge in untraceable currencies.
      </P>

      <H3El>Why bottom-up</H3El>

      <P>
        Top-down cosmology fails. A Pane stated as &ldquo;the Old Ones persist&rdquo; gives a
        designer a slogan to stand under and gives a player nothing to feel. A Pane that has a
        contraband — a specific blue-tongue-staining fruit, a specific banned verb, a specific
        Reckoning-Year-12 magistrate — gives a designer a place where the cosmology is
        already touching daily life. The card economy then rides on the contraband. The rare
        cards are about people who handle the contraband: smugglers, magistrates, addicts,
        translators, customs officers, priests-in-relapse. The legendary cards are about the
        contraband&rsquo;s consequences. The wiki is about the contraband&rsquo;s history. The
        leak is the product.
      </P>

      <H3El>The civic specification</H3El>

      <P>
        A contraband that has not been specified at the civic layer is a slogan in disguise.
        For each Pane, the spec must answer four questions in plain prose. What exactly is the
        forbidden thing — the fruit&rsquo;s color, the verb&rsquo;s tense, the
        oath&rsquo;s cadence? Who forbids it — which authority, which institution, which
        ledger? Who eats or speaks or pronounces it anyway — the named guild, the named
        family, the named profession? And what role does the contraband play in the rare card
        economy — does it appear as a held object, a residue on the figure, a stain in the
        prose, a refusal in the gesture? The next section&rsquo;s pane-grammar JSON makes this
        machine-readable. This section establishes that the spec must clear this bar in
        natural language before any code is written.
      </P>

      <H3El>The card example</H3El>

      <CardExample
        name="Tella, Who Carries Fruit Past the Bridge"
        pane="Lud-Border"
        rarity="Rare"
        flavor="Her wagon was searched at the customs post and nothing was found. Her wagon was searched at the bridge and nothing was found. Her granddaughter was tested twenty years later, and her dreams were green."
        buriedWeight="Faerie does not need to cross the border. It needs to be eaten on this side."
      />

      <P>
        Tella is a smuggler card and the contraband is fairy fruit, and yet Tella never
        appears with fruit visible on the card. The leak is in the cadence — three
        searches-and-no-findings, a twenty-year gap, a granddaughter, a dream. That is the
        Mirrleesian register. The reader does not learn what Faerie is. The reader watches
        Faerie arrive in a granddaughter&rsquo;s sleep two decades after the wagon crossed,
        and the buried weight of the Pane lands without being stated. The cosmology has been
        delivered through the leak.
      </P>
    </section>
  );
}
