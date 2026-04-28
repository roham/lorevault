import Link from 'next/link';
import manifest from '../_manifest.json';

export const metadata = {
  title: 'Pierre-Menard Triptych — LoreVault Moodboard',
  description:
    'Four cards. One axiom. Four cosmological meanings. The Pierre-Menard mechanic demonstrated.',
};

const PM_IDS = [
  'lud-border-001',
  'old-ones-persist-001',
  'sinterklaas-reigns-001',
  'holmes-canonical-london-001',
];

const PANE_NAMES: Record<string, string> = {
  'lud-border':              'Lud-Border',
  'old-ones-persist':        'Old-Ones-Persist',
  'sinterklaas-reigns':      'Sinterklaas-Reigns',
  'holmes-canonical-london': 'Holmes-Canonical-London',
};

const PANE_READING: Record<string, { summary: string; lampblackReading: string; icebergReading: string }> = {
  'lud-border': {
    summary:
      'In Lud-Border, refusing ignorance is a civic act with consequences that the law is designed to absorb. The customs officer knows. The form does not ask. Refusing ignorance means maintaining the knowledge the form cannot hold — and choosing, every day, to complete the form anyway. The refusal is the law\'s mercy toward itself.',
    lampblackReading:
      'The gesture is the hand hovering over the third line. The cosmological relation is border-made-human: the figure where civic law and fairy law meet without resolving. To refuse ignorance here is to hold both simultaneously.',
    icebergReading:
      'The form is the border. The form is the only border. What cannot be written on the form crosses freely. The refusal of ignorance is the only thing keeping the form functional as a border — the officer\'s knowledge is the law\'s load-bearing secret.',
  },
  'old-ones-persist': {
    summary:
      'In Old-Ones-Persist, refusing ignorance is a cosmological trigger. The act of insisting on knowing what is already known is the act that draws the Old Ones\' attention. The cataloguer who refuses to be ignorant of what the catalogue already contains becomes, in that refusal, the sentence the Old Ones were waiting to hear said. Knowledge is not safe here — it is invocation.',
    lampblackReading:
      'The gesture is writing — the continuous forward motion that cannot be interrupted without losing the sentence. The cosmological relation is hinge: inscription is simultaneously civic documentation and cosmological invocation. The refusal of ignorance is the act of completing the sentence.',
    icebergReading:
      'To refuse ignorance in this Pane is to become the sentence the Old Ones were waiting to hear said. The cataloguer does not discover — they complete. The catalogue is the Old Ones\' primary sense organ. Every new entry extends them.',
  },
  'sinterklaas-reigns': {
    summary:
      'In Sinterklaas-Reigns, refusing ignorance is the ontological responsibility of the recorder. The Good Book already contained last Tuesday before last Tuesday occurred. The record-keeper who refuses to be ignorant is the Pane\'s anchor: without the witness-figure, moral events cannot achieve cosmological permanence. The refusal of ignorance makes the world\'s acts real in the only register that counts.',
    lampblackReading:
      'The gesture is one finger resting on the open page — not pointing, just present, maintaining contact with the record. The cosmological relation is anchor: without the witness-figure, the year\'s moral events cannot achieve permanence. Refusing ignorance is fulfilling the witness-function.',
    icebergReading:
      'The record is not a description of events. The record is what makes events cosmological. To be written is to have happened in the only way that counts. The refusal of ignorance is the refusal to let an act go unwitnessed — the worst sin in this Pane is not cruelty but non-witnessing.',
  },
  'holmes-canonical-london': {
    summary:
      'In Holmes-Canonical-London, refusing ignorance is the burden Watson carries. Watson refused to be ignorant of what Holmes deduced. He understood the correct inference. He chose, with full knowledge, not to publish it. The refusal of ignorance here is the precondition for the most demanding editorial act: knowing the thing that must not be said and holding it correctly, for years, until it can be destroyed safely.',
    lampblackReading:
      'The gesture is a hand on a notebook that faces inward — touching but not turning. The cosmological relation is archivist-protector: the figure who holds the complete deductive record and decides what the world can bear to know. Refusing ignorance is the precondition for that decision.',
    icebergReading:
      'The unpublished cases are not failures Watson was ashamed of. They are cases where Holmes deduced something that Watson understood, immediately, could not be made public. The refusal of ignorance is the knowledge Watson holds for eight years before burning the notebook. He could not be ignorant. He chose what to do with what he knew.',
  },
};

export default function PierreMenardPage() {
  const cards = PM_IDS.map((id) => manifest.find((c) => c.id === id)!);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-5 py-16">

        {/* Back */}
        <Link
          href="/v3/moodboard"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors no-underline mb-8 block"
        >
          ← The Moodboard
        </Link>

        {/* Header */}
        <header className="mb-14">
          <p className="text-amber-400 uppercase tracking-widest text-xs mb-4">
            The Pierre-Menard mechanic
          </p>
          <h1 className="text-4xl font-medium italic text-zinc-100 mb-6 leading-tight">
            Four Cards, One Axiom
          </h1>
          <div className="max-w-2xl space-y-4 text-zinc-300 leading-relaxed">
            <p>
              Borges wrote "Pierre Menard, Author of the Quixote" — a story about a man who
              reproduces <em>Don Quixote</em> word for word, centuries later, in a different
              context, and produces a different work. The words are identical. The meaning is not.
            </p>
            <p>
              The LoreVault Pierre-Menard set works the same way. Four cards across four Panes
              share an identical axiom. Not a paraphrase — the same words in the same order.
              But each Pane's cosmological grammar attributes a different meaning to them. The
              iceberg echo differs. The lampblack differs. The contraband relation differs.
              The doctrine demonstration is the difference.
            </p>
            <p>
              Reading all four cards in sequence is the fastest way to understand how Pane
              cosmologies work: not as settings, but as grammars that transform the meaning
              of identical statements.
            </p>
          </div>
        </header>

        {/* Shared axiom */}
        <section className="mb-14 border border-amber-500/30 rounded p-6 bg-amber-500/5">
          <p className="text-amber-400 uppercase tracking-widest text-xs mb-4">
            The shared axiom — identical across all four cards
          </p>
          <blockquote className="text-zinc-100 text-2xl italic leading-relaxed font-medium">
            "I refused to be ignorant of what was already known."
          </blockquote>
        </section>

        {/* Four cards side by side */}
        <section className="mb-16">
          <h2 className="text-zinc-500 uppercase tracking-widest text-xs mb-6">
            Four readings of the same axiom
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => {
              const reading = PANE_READING[card.pane];
              const paneName = PANE_NAMES[card.pane] ?? card.pane;

              return (
                <div
                  key={card.id}
                  className="border border-zinc-800 rounded p-5 bg-zinc-900/40 flex flex-col gap-4"
                >
                  {/* Pane + card name */}
                  <div>
                    <p className="text-amber-400 uppercase tracking-widest text-xs mb-1">
                      {paneName}
                    </p>
                    <h3 className="text-zinc-100 text-lg font-medium">
                      {card.name}
                    </h3>
                  </div>

                  {/* Same axiom — shown prominently */}
                  <blockquote className="italic text-zinc-300 text-sm border-l-2 border-amber-500/40 pl-3">
                    "I refused to be ignorant of what was already known."
                  </blockquote>

                  {/* Pane-specific reading */}
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {reading.summary}
                  </p>

                  {/* Iceberg echo difference */}
                  <div>
                    <p className="text-amber-400 uppercase tracking-widest text-[0.6rem] mb-1">
                      Iceberg echo
                    </p>
                    <p className="text-zinc-400 text-sm italic leading-relaxed">
                      {reading.icebergReading}
                    </p>
                  </div>

                  {/* Lampblack difference */}
                  <div>
                    <p className="text-amber-400 uppercase tracking-widest text-[0.6rem] mb-1">
                      Lampblack · gesture + cosmological relation
                    </p>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {reading.lampblackReading}
                    </p>
                  </div>

                  {/* Link to full card */}
                  <Link
                    href={`/v3/moodboard/${card.pane}/${card.id}`}
                    className="mt-auto text-amber-500/70 text-xs uppercase tracking-widest hover:text-amber-400 transition-colors no-underline"
                  >
                    Read full card →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why it matters */}
        <section className="mb-12 border-t border-zinc-800 pt-10">
          <h2 className="text-zinc-100 text-2xl italic font-medium mb-5">
            Why this is the doctrine demonstration
          </h2>
          <div className="max-w-2xl space-y-4 text-zinc-300 leading-relaxed">
            <p>
              A setting approach to worldbuilding would produce four cards with four different
              axioms, each describing what its world is like. The Pierre-Menard set does the
              opposite: it fixes the axiom and varies the world. The words are the constant.
              The grammar that transforms them is what differs.
            </p>
            <p>
              In Lud-Border, refusing ignorance is civic mercy. In Old-Ones-Persist, it is
              cosmological appetite. In Sinterklaas-Reigns, it is witnessing-responsibility.
              In Holmes-Canonical-London, it is the precondition for holding the unspeakable
              correctly for years. Same axiom. Four grammars. Four meanings.
            </p>
            <p>
              This is what Panes are. Not different places with different aesthetics. Different
              grammars that transform the meaning of identical acts. The Pierre-Menard set
              is the fastest demonstration of that principle.
            </p>
          </div>
        </section>

        {/* Doctrine cross-link */}
        <div className="flex gap-6 flex-wrap border-t border-zinc-800 pt-8">
          <Link
            href="/v3/gdd-real"
            className="text-amber-400 hover:text-amber-300 transition-colors no-underline text-sm"
          >
            Doctrine: GDD — Pierre-Menard section →
          </Link>
          <Link
            href="/v3/moodboard"
            className="text-zinc-500 hover:text-zinc-300 transition-colors no-underline text-sm"
          >
            ← Back to Moodboard
          </Link>
        </div>

      </div>
    </div>
  );
}
