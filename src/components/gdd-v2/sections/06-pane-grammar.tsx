import { SectionHeader, P, PQ, H3El, CodeBlock, I } from '../shared';

const SINTERKLAAS_GRAMMAR = `{
  "pane_id": "sinterklaas-reigns",
  "axiom": "Time is administered, not experienced. Every act is recorded; every record is reckoned; the reckoning is the year.",
  "heresy_sentence": "In this Pane, the calendar is moral and the moral is calendrical. Children are not punished for what they do; they are reckoned for what was witnessed.",
  "grammar_elements": [
    "moral-ledger",
    "gift-as-trap",
    "witnessing",
    "reckoning",
    "surveillance"
  ],
  "contraband": {
    "what": "the Unwritten Promise — an oath spoken aloud and kept off the ledger",
    "who_forbids": "the Reckoning-Year scribes and the Order of the Black Book",
    "who_eats": "the household servants, the unemployed magistrates, the lovers, the children",
    "card_economy_role": "Rare cards depict figures whose ledger entries cannot be located; legendary cards depict the consequences of an Unwritten Promise that comes due in a year that does not officially exist."
  },
  "sentence_rhythm": "Mirrlees-civic",
  "verb_for_to_die": "to be reckoned",
  "third_hour_fear": "the sound of a quill stopping mid-line in a room one corridor over",
  "smallest_currency": "the half-witnessing — a glance one party will deny was a glance",
  "commonest_crime": "ledger-tampering by erasure (additions are easier to catch)",
  "tedium_marker": "the slowness of the year-end audit, page seven of an itemized accounting",
  "buried_weight": "Sinterklaas is not a saint. Sinterklaas is the cosmological function the Pane personifies as a saint so the children can sleep.",
  "pantheons": [
    {
      "name": "the Order of the Black Book",
      "sentence_rhythm_override": "ecclesiastical-Mirrlees, with sentences that pause at every comma the way a scribe pauses",
      "translation_cost_flavor": "When an Order figure interacts with a household figure, the household figure loses one of its half-witnessings to the Order's ledger; the loss is rendered as a thinning of the figure's color in the art and a missing clause in the flavor line."
    },
    {
      "name": "the Hearth-Pantheon",
      "sentence_rhythm_override": "domestic paratactic — and-then, and-then, and-then — children-and-fires-and-debts",
      "translation_cost_flavor": "When a Hearth figure crosses into Order space, the warmth on the card cools by one tier of palette; the flavor line loses a comma."
    },
    {
      "name": "the Unreckoned (the contraband pantheon)",
      "sentence_rhythm_override": "fragmentary, Lud-in-the-Mist register, sentences trailing off mid-clause",
      "translation_cost_flavor": "An Unreckoned figure cannot meet an Order figure on the card. The Order figure's name is replaced with a black bar; the Unreckoned figure's flavor line is rendered as a half-erased line of older script underneath the current text."
    }
  ]
}`;

export function SectionPaneGrammar() {
  return (
    <section id="section-6">
      <SectionHeader
        num="§ 6"
        title="Pane Rule-Grammar — The Spec That Runs in Production"
      />

      <PQ>
        Three to five elements, recitable from memory, non-negotiable. Cards within the Pane
        are different sentences in the same grammar.
      </PQ>

      <P>
        Ursula K. Le Guin&rsquo;s <I>Earthsea</I> runs on a three-element rule-grammar: true
        names, balance, and the unmade. Three elements, no more, no fewer. Each book in the
        cycle leans on one element more than the others — <I>A Wizard of Earthsea</I> is
        true-names, <I>The Tombs of Atuan</I> is the unmade, <I>The Farthest Shore</I> is
        balance — but the grammar holds across all of them. A reader who has finished the
        cycle can recite the three elements without looking. So can the writer. That is what
        a rule-grammar is.
      </P>

      <P>
        The V1 doctrine asked for one verb per Pane. One verb is the wrong unit. A verb is too
        narrow for a cosmology and too loose for a card. The Pane&rsquo;s mechanical thesis
        and the Pane&rsquo;s worldbuilding spine are not the same level of abstraction. The
        spine is a grammar. Sinterklaas-Reigns&rsquo;s spine is not <I>reckon</I>; it is
        moral-ledger plus gift-as-trap plus witnessing plus reckoning plus surveillance — five
        elements forming a ledger of social pressure. A card within the Pane is a sentence in
        that grammar. Cards across a Series are paragraphs. The grammar holds.
      </P>

      <H3El>The Pratchett amendment</H3El>

      <P>
        Pratchett&rsquo;s Witches books are the second-cleanest model. The grammar of the
        Witches is headology, borders, names, and what you can and cannot afford to take
        seriously. Four elements. Each book pulls on one or two of them more than the others,
        but no Witches book is missing any element. The four-element grammar is what makes
        Granny Weatherwax recognizable from <I>Equal Rites</I> through <I>Wintersmith</I>:
        the spine does not change; the cosmology around it deepens. That is the model.
      </P>

      <H3El>The grammar as system prompt</H3El>

      <P>
        In a 2027-vintage live-ops production environment, the Pane&rsquo;s grammar is not an
        editorial guide. It is the system prompt for the generation pipeline. A
        machine-readable grammar that an AI ops layer can extend faithfully for years without
        drift is the actual moat. A grammar that lives only in editor heads and design briefs
        decays under live-ops pressure within six months. The schema below is therefore not
        documentation. It is operational infrastructure. Each Pane in production must have a
        completed instance of this schema before any card in the Pane goes through the
        eight-stage pipeline. The schema is the grammar; the grammar is the spec; the spec
        runs in production.
      </P>

      <H3El>The example</H3El>

      <P>
        Below is a complete pane-grammar instance for Sinterklaas-Reigns, a Tier-A Pane
        scheduled for Series 1 as the Foil. Every required field is populated. Note the
        sentence-rhythm enum, which constrains the prose register the live-ops generation
        pipeline is allowed to write in for this Pane. Note the three pantheons, each with a
        sentence-rhythm override and a specified translation-cost flavor. The pantheons are
        not jurisdictional. They are incommensurable. A card that places an Order figure
        beside an Unreckoned figure is required by the grammar to render that incommensurability
        visibly — a black bar over the Order figure&rsquo;s name, a half-erased line under
        the Unreckoned figure&rsquo;s flavor.
      </P>

      <CodeBlock label="pane_grammar.sinterklaas-reigns.json" code={SINTERKLAAS_GRAMMAR} />

      <H3El>What this enforces</H3El>

      <P>
        A flavor line generated for a Sinterklaas-Reigns card is now constrained to use
        Mirrlees-civic register. The verb for &ldquo;to die&rdquo; is locked to <I>to be
        reckoned</I>; any draft that uses <I>to perish</I> or <I>to fall</I> is a grammar
        violation that the six-test gate will refuse. A figure that appears beside an Order
        scribe is required to surface translation cost in either palette or punctuation. The
        buried weight is locked: Sinterklaas is the cosmological function the Pane
        personifies as a saint. A card that contradicts the buried weight is not a tweak; it
        is a separate Pane wearing this Pane&rsquo;s name. The grammar refuses it.
      </P>
    </section>
  );
}
