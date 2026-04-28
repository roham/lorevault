import Link from 'next/link';

export const metadata = {
  title: 'Voice Warping Across Panes — LoreVault Moodboard',
  description:
    'How the same narrative content reads differently when written in each Pane\'s voice register. Five examples. One threshold crossing.',
};

interface PaneVoiceExample {
  pane: string;
  paneName: string;
  registerNote: string;
  passage: string;
}

const EXAMPLES: PaneVoiceExample[] = [
  {
    pane: 'lud-border',
    paneName: 'Lud-Border',
    registerNote:
      'Bureaucratic civic register. Honey-amber light. The form as ceremony. Every act described in the language of documentation — not because the narrator is cold, but because this is the language the threshold has authorized for the event being described. Warmth exists, but it is in the gap between what the form asks and what the form knows.',
    passage:
      'A figure approached the threshold. This was noted on the crossing register: time of approach, approximate direction of travel, declared purpose of crossing. The officer at the third window completed lines one and two of the standard form without difficulty. At line three — declared contents — the hand slowed. The form had a category for honey. The form had a category for foodstuffs, general. The form did not have a category for the thing the figure was actually carrying, which was less an object than a quality of attention that had become, over the years, approximately portable. The officer wrote: honey. The form accepted this. The crossing was authorized. What crossed was not on the form. This was the ceremony. The threshold held.',
  },
  {
    pane: 'old-ones-persist',
    paneName: 'Old-Ones-Persist',
    registerNote:
      'Cold institutional prose. The omniscient narrator is the catalogue itself — everything described in terms of what can be filed, cross-referenced, indexed. The threshold-crossing is interesting not as an event but as an entry-creation: the figure\'s approach generates a new node in the system. The prose has the precision of someone who knows they are being catalogued while they write.',
    passage:
      'The figure\'s approach to the threshold was catalogued as Entry 7,491,851, cross-referenced under: threshold-approaches, general; crossings, approached-but-not-completed; figures-of-uncertain-classification. The approach had a structure the Archivist had encountered 7,491,850 times before, which is to say: never in quite this configuration. The threshold was documented in its own series — threshold-as-boundary, threshold-as-membrane, threshold-as-the-thing-that-divides-the-catalogue-from-what-the-catalogue-is-about — and the figure\'s hesitation at it (Entry 7,491,851-A: hesitation, duration approximately six seconds, cause: unclassified) was filed before the crossing occurred. This is normal. The Old Ones attend to thresholds with particular consistency. What the figure was carrying had not been entered. What they were carrying entered them first.',
  },
  {
    pane: 'sinterklaas-reigns',
    paneName: 'Sinterklaas-Reigns',
    registerNote:
      'The witnessing register. Prose that is aware of what is being observed and by whom. The threshold crossing is a moral event — what counts is whether it was witnessed, not whether it was completed. The voice has the quality of a helper\'s report: precise, non-judgmental, aware that what is recorded here will enter the Book. December light and factual observation.',
    passage:
      'The figure was observed approaching the threshold at fourteen minutes past the third hour. This was witnessed by the helper stationed at the address, whose report for that hour noted: figure present, approach steady, no deviation from expected path, one item carried (description: a quality of attention, approximately portable, declared provenance: uncertain). The crossing itself was not witnessed — at the moment of threshold-crossing, the helper was completing the previous hour\'s notation for the district report, a lapse of approximately four seconds during which coverage was interrupted. The Book\'s entry for this address on this date has a gap of four seconds. The figure crossed during those four seconds. This is not unusual. The most important crossings have a tendency to find the gaps. The Book records the gap as a gap. A gap is still a record.',
  },
  {
    pane: 'true-names-persist',
    paneName: 'True-Names-Persist',
    registerNote:
      'The naming-chain register. Prose attentive to language as load-bearing structure. Every noun is a potential true name; the narrator is careful about which ones to use and which to withhold. The threshold is named — has always had a name — and the act of crossing it interacts with that name in ways that have cosmological consequences. Precision and restraint.',
    passage:
      'The threshold had a name. The name was old — older than the current word for threshold, older than the linguistic convention of naming architectural features rather than merely describing them. The name held the threshold in its position in the moral geography of the valley: a boundary between the space where the valley\'s naming-network had full coverage and the space where coverage was partial, maintained by translation-equivalents rather than original phonemic bindings. When the figure approached, the threshold responded to their approach in the way named-things respond to sustained attention — it was more itself, briefly, than it had been before they noticed it. Whether the figure knew the threshold\'s true name was not recorded. What was recorded was the quality of their hesitation: they paused at the precise point where named territory ends, which is not a point anyone who did not know the names could have identified.',
  },
  {
    pane: 'holmes-canonical-london',
    paneName: 'Holmes-Canonical-London',
    registerNote:
      'Watson\'s editorial voice — first person, retrospective, with the specific quality of a narrator who knows more than he is saying. The threshold crossing is described not as an event but as a case: the deductions are noted, the publishable conclusions are given, and the shape of what is withheld is visible in the way the prose slows when it approaches the central fact. Victorian periodical register with a load-bearing silence.',
    passage:
      'I will not name the threshold, nor the figure who approached it, nor the street in which it stood. The reader who recognizes the district from the details I am permitted to include will understand why these omissions are necessary; the reader who does not recognize it will find the case no less complete for the absences. Holmes observed the figure\'s approach from the window above. He did not speak until the approach was within three steps of the threshold. Then he said, without turning: "She has crossed this threshold fourteen times, Watson. This will be the last." I noted his certainty, and the quality of his not-turning, and filed them in the part of my account that will not be published. What I can tell you is this: she crossed. What happened at the threshold, what she was carrying, what Holmes deduced and did not say aloud — these are in the other record. The crossing itself was ordinary. Only the context made it what it was.',
  },
];

export default function VoiceWarpingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-5 py-16">

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
            Voice registers across Panes
          </p>
          <h1 className="text-4xl font-medium italic text-zinc-100 mb-6 leading-tight">
            Voice Warping
          </h1>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              The same event can be written in five different voice registers, and the register
              is not decoration — it is the event's meaning. A threshold crossing described in
              the bureaucratic civic voice of Lud-Border is a different event, cosmologically,
              from the same crossing described in the archival cold of Old-Ones-Persist.
              Not because the facts differ. Because the grammar that makes sense of the facts
              differs, and the grammar is the world.
            </p>
            <p>
              Below: the same scenario — a figure approaches a threshold, hesitates, crosses —
              written five times, once in each Pane's voice register. The event is identical.
              The prose is entirely different. Reading all five in sequence is a faster
              introduction to the Pane system than any explanation.
            </p>
          </div>
        </header>

        {/* The scenario */}
        <div className="mb-12 border border-zinc-800 rounded p-5 bg-zinc-900/30">
          <p className="text-zinc-500 uppercase tracking-widest text-xs mb-3">
            The scenario — constant across all five
          </p>
          <p className="text-zinc-300 italic">
            A figure approaches a threshold. They are carrying something. They hesitate.
            They cross.
          </p>
        </div>

        {/* Five voice examples */}
        <div className="space-y-14">
          {EXAMPLES.map(({ pane, paneName, registerNote, passage }) => (
            <section key={pane}>
              <div className="mb-4">
                <p className="text-amber-400 uppercase tracking-widest text-xs mb-1">
                  {paneName}
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed italic">
                  {registerNote}
                </p>
              </div>

              <div className="border-l-2 border-zinc-700 pl-5">
                <p className="text-zinc-200 leading-relaxed">
                  {passage}
                </p>
              </div>

              <div className="mt-3">
                <Link
                  href={`/v3/moodboard/${pane}`}
                  className="text-zinc-500 text-xs hover:text-amber-400 transition-colors no-underline uppercase tracking-widest"
                >
                  Explore {paneName} cards →
                </Link>
              </div>
            </section>
          ))}
        </div>

        {/* What voice warping is */}
        <section className="mt-16 border-t border-zinc-800 pt-10">
          <h2 className="text-zinc-100 text-2xl italic font-medium mb-5">
            What this demonstrates
          </h2>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              Voice warping is not style variation. It is the consequence of having genuine
              cosmological difference between Panes rather than aesthetic difference. When a
              Pane has a specific grammar for what counts as an event — what makes an act
              real, what constitutes a crossing, what the law can ask about — that grammar
              shows up in the prose. You cannot write in the lud-border register without
              writing about forms. You cannot write in the sinterklaas-reigns register
              without writing about witnesses.
            </p>
            <p>
              The test for a well-constructed Pane voice is whether you can take a piece of
              prose, strip the Pane attribution, and still identify which Pane it comes from.
              If you can, the voice register is doing real work. If you cannot, the prose is
              generic fantasy writing with Pane names attached.
            </p>
            <p>
              The five passages above all pass this test. The bureaucratic slowing at line three.
              The catalogue-precision with cross-reference numbers. The four-second gap in
              witness coverage. The careful withholding of the true name of the threshold.
              Watson's passive-voice omission. These are not stylistic choices. They are the
              cosmological grammars made visible in prose.
            </p>
          </div>
        </section>

        {/* Doctrine cross-link */}
        <div className="flex gap-6 flex-wrap border-t border-zinc-800 pt-8 mt-10">
          <Link
            href="/v3/gdd-real"
            className="text-amber-400 hover:text-amber-300 transition-colors no-underline text-sm"
          >
            Doctrine: GDD — Pane voice registers →
          </Link>
          <Link
            href="/v3/moodboard/pierre-menard"
            className="text-amber-400 hover:text-amber-300 transition-colors no-underline text-sm"
          >
            Pierre-Menard Triptych →
          </Link>
        </div>

      </div>
    </div>
  );
}
