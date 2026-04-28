import { SectionHeader, P, PQ, H3El, CardExample, I } from '../shared';

export function SectionSixTestGate() {
  return (
    <section id="section-10">
      <SectionHeader num="§ 10" title="The Six-Test Tweak Gate" />

      <PQ>
        Four tests can refuse a bad tweak. They cannot produce a good one. The two added tests
        — Footnote and Prose-Signature — are generative, not gating.
      </PQ>

      <P>
        The V1 doctrine ran a four-test gate on every tweaked figure: Recognition (does the
        figure read as the canonical figure at silhouette glance?), Necessity (is the
        difference doing real cosmological work?), Consequence (does the difference cost the
        figure something?), and Voice-Inevitability (could this figure be written in any
        other voice?). The four tests are good. They are also entirely defensive — they
        check for the absence of failure rather than the presence of life. A figure can pass
        all four and still feel manufactured. V2 adds two generative tests: Footnote, after
        Susanna Clarke; and Prose-Signature, after Catherynne M. Valente.
      </P>

      <H3El>Tests one through four</H3El>

      <P>
        Recognition. Does the figure read as the canonical figure within half a second of
        silhouette glance? If a player who has never read Doyle cannot identify Holmes from
        the gesture and the cosmological-relation alone, the tweak has lost its anchor. The
        canonical figure is what the difference is differencing from; if the canonical figure
        is gone, there is no difference, only a new figure with a borrowed name.
      </P>

      <P>
        Necessity. Does the difference do real cosmological work? A tweak that exists for
        novelty is decoration. A tweak that exists because the Pane&rsquo;s axiom requires
        the figure to be different from the canon is necessary. If you can imagine the
        figure without the tweak and the cosmology survives, the tweak is decorative. Cut
        it.
      </P>

      <P>
        Consequence. Does the difference cost the figure something visible? Tweaks without
        cost are wish fulfillment. The figure must lose access to a canonical move, gain a
        canonical wound, or be barred from a canonical victory. The cost is what makes the
        difference legible to the reader.
      </P>

      <P>
        Voice-Inevitability. Could this figure be written in any other voice? If the answer
        is yes, the voice is not yet a voice. The figure&rsquo;s prose register must scan as
        belonging only to this figure under this Pane. Half the V1-era cards failed Voice-
        Inevitability silently — the prose was generic mythic-purple and the writers did not
        notice because mythic-purple is the default voice the production pipeline drifts
        toward when nothing pushes against it.
      </P>

      <H3El>Test five — the Footnote Test</H3El>

      <P>
        Susanna Clarke&rsquo;s <I>Jonathan Strange &amp; Mr Norrell</I> and{' '}
        <I>Piranesi</I> operate by a method the V1 doctrine did not name: pseudo-scholarly
        voice as worldbuilding tool. Clarke&rsquo;s footnotes do not explain her world. They
        perform a scholarly culture&rsquo;s relationship to her world. The reader learns more
        about English magic from the tone of a footnote — its hedges, its deference to a
        non-existent authority, its quibble with a non-existent rival — than from any direct
        statement.
      </P>

      <P>
        The Footnote Test asks: can a competent worldbuilder write a plausible eighty-word
        in-world scholarly footnote about this card? If the footnote can be written, the
        figure has implied a commentary tradition; the figure is real enough to be argued
        about; the figure is real. If the footnote cannot be written, the tweak is a typo
        wearing a moustache.
      </P>

      <P>
        A worked example. Take The Third Detective from Section 4. The Footnote Test
        produces:
      </P>

      <PQ>
        <span style={{ fontFamily: 'var(--font-v2-ui), Inter, sans-serif', fontSize: '0.95rem', fontStyle: 'normal' }}>
          On the question of the Third Detective&rsquo;s arrival prior to the crime, the
          standard view (after Penrhyn, 1908) is that her presence was a leak from the
          Pre-Causal register; this is consistent with the Survey&rsquo;s file-marking on
          Case 47-B. A revisionist tradition (Yelland, 1923; cf. Hartshorne&rsquo;s
          unpublished marginalia, Bodleian MS Eng. misc. d. 91) holds that the Detective
          was always already present and that the &ldquo;arrival&rdquo; is a courtesy of
          conventional narrative. The Survey has declined to comment on the matter and the
          file remains open in the form prescribed for matters that cannot remain open.
        </span>
      </PQ>

      <P>
        The footnote took two minutes to write because the figure implied it. A figure that
        does not imply this kind of footnote is a tweak without a world.
      </P>

      <H3El>Test six — the Prose-Signature Test</H3El>

      <P>
        Catherynne M. Valente&rsquo;s <I>Deathless</I>, <I>In the Night Garden</I>, and{' '}
        <I>Palimpsest</I> build worlds via sentence rhythm rather than via revealed lore. A
        sentence in <I>Deathless</I> tells you Soviet-Russian-folktale physics by how it
        pivots between fairy-tale paratactic (and then, and then, and then) and modernist
        hypotactic in the same paragraph. The grammar carries the cosmology.
      </P>

      <P>
        The Prose-Signature Test asks: does this flavor line scan as belonging only to this
        Pane? Could it be lifted into another Pane and pass? If yes, the line is generic and
        must be rewritten. The Pane&rsquo;s sentence-rhythm enum (Borgesian-formal, Mirrlees-
        civic, Marlon-James-warping, Le-Guin-spare, Clarke-footnoted, Valente-paratactic) is
        the constraint. A flavor line that does not register the constraint has not earned
        its Pane attribution.
      </P>

      <H3El>The hire</H3El>

      <P>
        Hire prose stylists, not lore writers. Pay them more than the artists. Flavor text is
        the most load-bearing substrate in the product after the art. A card&rsquo;s flavor
        line is where the Pane&rsquo;s axiom is felt at the smallest possible scale. If the
        flavor reads like every other card game&rsquo;s flavor — generic Lovecraft pastiche,
        generic Norse stoicism, generic mythic-purple — the Pane has no voice no matter how
        good the axiom is. This is heresy in card-game production economics. Live with it.
      </P>

      <H3El>The example</H3El>

      <CardExample
        name="The Penrhyn Marginalia"
        pane="Old-Ones-Persist"
        rarity="Legendary"
        flavor="In the margin of his 1908 monograph, Penrhyn wrote one word and then crossed it out. The Survey purchased the marginalia at auction in 1934. The crossed-out word has been the matter of three Royal Commissions and is, at the time of writing, the matter of a fourth."
        buriedWeight="The Pre-Causal Observer leaves traces that institutions can purchase. Whether the institutions can read the traces is a matter no Royal Commission has resolved."
      />

      <P>
        The card passes Recognition (Penrhyn is a recognizable scholar-figure type),
        Necessity (the marginalia is doing the cosmology&rsquo;s work — the leak through the
        scholarly archive), Consequence (Penrhyn is dead and the word is unrecoverable), and
        Voice-Inevitability (no other Pane writes this sentence). It passes Footnote (a
        scholar can write a plausible eighty-word footnote about the 1908 monograph) and
        Prose-Signature (the flavor line is unmistakably Clarke-footnoted register, which is
        the enum-locked rhythm for Old-Ones-Persist scholarly cards). Six tests, six passes.
        Card ships.
      </P>
    </section>
  );
}
