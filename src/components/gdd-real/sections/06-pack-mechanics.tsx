import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionPackMechanics() {
  return (
    <section id="section-6">
      <SectionHeader num="§ 6" title="Pack Mechanics" />

      <PQ>
        The pack-rip is the most-replayed surface in a collectibles game. Top Shot lands the
        reveal in sub-one-second. LoreVault slows the Legendary on purpose.
      </PQ>

      <P>
        The pack opening is not a transaction. It is a ritual. It is the moment the
        collector first encounters the cosmology of the Pane they have purchased into, and
        every later product surface — the marketplace, the showcase, the leaderboard, the
        Prediction event — depends on the emotional residue of the first reveal. Top Shot
        ships a fast reveal because basketball Moments are kinetic; the cards want the
        reveal to feel like the play. LoreVault ships a slow reveal on Legendary because
        the iceberg-2:1:8 buried weight requires the collector to look at the silhouette
        before the card resolves. The pacing is the doctrine.
      </P>

      <H3El>Pack types</H3El>

      <P>
        Five pack types ship in MLP. The <I>Starter Pack</I> is the first-pack flow at nine
        dollars: one Rare guaranteed, three Common, one wildcard slot that may be a
        Contraband-Rare on the lucky pull. The starter is shipped only to first-time
        collectors and only in the Pane the collector chose at onboarding. The
        <I> Standard Pack</I> is the daily-and-weekly pack at nine dollars: five cards drawn
        from any active Pane, with the rarity distribution heavily weighted toward Common,
        a five percent chance of Rare, a one percent chance of Legendary. The <I>Pane
        Pack</I> is the Pane-specific pack at fifteen dollars: five cards drawn only from
        one Pane, with elevated Rare odds (fifteen percent) and a Legendary chance (three
        percent). The <I>Premium Pack</I> at thirty-nine dollars guarantees one Legendary
        and is the tentpole purchase point of each Series; it is sold only during the
        Tentpole drop. The <I>Case</I> at three hundred and ninety-nine dollars guarantees
        one Contraband-Rare across fifty cards; it is the whale-tier purchase, surfaced
        only on the Tentpole drop&rsquo;s monthly hero with the Crack-the-Case CTA.
      </P>

      <H3El>The four-state drop machine</H3El>

      <P>
        Every pack drop runs through the four states the storefront loop calibrated. <I>
        Mystery</I> is the announcement window: the drop is named, the art is teased
        through silhouettes, the date is anchored, no purchase is possible. <I>Revealed</I>
        is the warm-up window: the countdown is live in the CTA itself
        (&ldquo;Reserve your spot — opens in 3h 42m&rdquo;), the hero render is visible,
        the queue is open for entry but the purchase has not started. <I>Live</I> is the
        purchase window: the queue allocates serials in entry order, the supply ticker
        counts down in real time, the social-witness count of active viewers is rendered.
        <I> Ripped</I> is the post-drop state: for buyers, the GOT&rsquo;EM pulsing-gold
        confirmation surfaces in their account; for non-buyers, the &ldquo;Sold out · next
        drop in 6d 14h&rdquo; forward-momentum CTA replaces the pack tile. The four states
        are deterministic; the state machine is Atlas-side; the visual language is
        LoreVault-side.
      </P>

      <H3El>Opening ritual — the iceberg-slow reveal</H3El>

      <P>
        The pack ships into the collector&rsquo;s account as a sealed object. Tapping the
        sealed pack opens a full-bleed black overlay; the pack render appears centered, the
        Pane glyph visible on the seal. Tapping the seal cracks it; a single low cello
        pluck plays; warm amber light spills from inside. The first card slides out
        face-down. The face-down card is matte cream with the Pane glyph and a thin gold
        rule.
      </P>

      <P>
        The card flips. The flip animation is a real three-dimensional rotation on the
        horizontal axis, not a dissolve, taking 0.8 seconds with a gentle card-on-wood
        sound. The card settles. If it is a Common, it lands fast — the surface line and
        the rarity badge are visible within a beat. If it is a Rare, the flip slows by
        roughly thirty percent and the surface line lingers. If it is a Legendary, the
        silhouette of the card holds first for roughly 1.5 seconds in lampblack-pigment
        outline against the warm amber, and only then does the full art crossfade in. This
        is the Mirrlees-iceberg moment; the silhouette is the 0.4-second glance the 95/5
        rule asks the architecture to deliver, and the slow crossfade lets the buried weight
        register before the surface arrives.
      </P>

      <P>
        If the revealed card is a Contraband-Rare, the flip is the same as Legendary but the
        contraband badge appears in the corner with a small pulse, and a single line in
        cream serif renders below the card: <I>contraband — the cosmology leaks here</I>.
        If the revealed serial is in the top one half of one percent of the edition (e.g.
        #1 through #10 of a 199-edition Legendary), an additional pulse fires; the serial
        renders in gold rather than cream; a small low-mint badge surfaces above the rarity
        chip.
      </P>

      <H3El>The reveal pace per rarity, rounded</H3El>

      <P>
        Common: 0.8 seconds flip, 0.4 seconds settle, fast tap to next. Rare: 1.0 seconds
        flip, 0.7 seconds settle, deliberate tap to next. Legendary: 1.5 seconds silhouette
        hold, 1.0 seconds crossfade, 1.0 seconds settle, no auto-advance — the collector
        must tap to continue. Contraband-Rare: same as Legendary plus a 0.7 second
        contraband-badge pulse before continue is offered. Pierre-Menard Unique: a separate
        ceremonial reveal (described in § 11, Social Surface, because it is shipped as a
        social moment); but in pack-rip context, identical to Legendary with the addition
        of a Pierre-Menard sibling-card teaser appearing under the card surface.
      </P>

      <H3El>The emotional logic of unboxing</H3El>

      <P>
        The Top Shot pack rip works because the cards are videos and the videos are the
        play; the reveal is kinetic; the emotion is athletic. LoreVault&rsquo;s pack rip
        works on a different axis. The cards are paintings with prose; the reveal is
        contemplative; the emotion is Mirrlees-civic. Possession arrives before
        understanding. The Lampblack gesture is visible immediately at silhouette. The
        iceberg-deep reads are earned over time — the Echo line surfaces in the next
        second, the buried weight is gestured at but not stated, and the card carries those
        deferred meanings forward into every subsequent encounter the collector has with it
        on the showcase, in the marketplace, on the leaderboard. The pack rip is the moment
        the collector starts the long read.
      </P>
    </section>
  );
}
