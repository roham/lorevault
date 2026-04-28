import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionRetention() {
  return (
    <section id="section-13">
      <SectionHeader num="§ 13" title="Retention Loops" />

      <PQ>
        Acquisition is expensive. Retention is what makes the LTV math work. The retention
        section is where the unit economics close.
      </PQ>

      <P>
        A digital collectibles product&rsquo;s long-game success is determined by how many
        return-visit beats the architecture supports and how distinct each beat feels. A
        product with only a daily login is a slot machine; a product with a daily, weekly,
        seasonal, and annual loop is a literary engine. LoreVault ships four retention
        cadences in MLP. Each one answers a different question the collector is asking
        when they wake up; each one converts that question into a return visit; each one
        compounds the others.
      </P>

      <H3El>Daily — the new card and the daily challenge</H3El>

      <P>
        Every morning, a new card drops in at least one active Pane. The push notification
        arrives at the collector&rsquo;s preferred time (configurable, default 9am local)
        with a silhouette render — enough to see, not enough to own — and a single line:
        <I> &ldquo;a new card dropped in [Pane Name] — open to see&rdquo;</I>. Tapping the
        notification deep-links to the new card&rsquo;s storefront tile, where the
        collector can purchase a Standard Pack to chase the new card or visit the
        marketplace to buy it directly if it has already been listed. The daily challenge
        widget resets at midnight UTC and is visible on the home screen every morning;
        completing the daily challenge yields a pack credit and fifty XP. The combination
        — a new card surfacing daily, a gentle daily task — is what builds the daily
        return-habit. The Disney Pin Rotating Storefront experience documented in the
        storefront loop&rsquo;s LEARNINGS file demonstrates that without the daily new-card
        signal, the daily return rate collapses to single digits within eighteen months;
        with the signal, it stabilizes in the thirty-to-forty percent range.
      </P>

      <H3El>Weekly — the Prediction conflict and the Wednesday refresh</H3El>

      <P>
        Every week, the Prediction event resolves. The Footnoter&rsquo;s Letter publishes
        Tuesday at noon UTC announcing the next conflict; the staking window opens
        immediately and runs through Sunday midnight UTC; the conflict resolves Monday
        morning with the narrative-scar overlay landing on the winning Pane&rsquo;s staked
        cards. The weekly cycle is the heart-rate of the literary engine — every week,
        the collector is invited to take a position on which Pane&rsquo;s cosmology
        survives the eclipse, and the answer materially changes the cards in their wallet.
        On Wednesday at midnight UTC, the weekly storefront refresh fires: new packs in
        the rotating storefront tier, new weekly challenges, the TOTW (Top Of The Week)
        flagship pack receives its gold crown badge. Wednesday is a deliberate cadence
        anchor — the Hermès Frigga primitive — because specific weekday cadence beats
        vague weekly cadence in collector calendar-booking behavior.
      </P>

      <H3El>Seasonal — Series rotation and the closing-window urgency</H3El>

      <P>
        Every six months, a Series closes. The Tentpole Pane of Series N becomes inactive;
        new cards stop minting; the contraband-rare cards of that Pane become the last
        chance to buy at primary supply. Thirty days before close, a notification cascade
        begins: <I>&ldquo;the [Pane Name] Pane retires in 30 days. Three cards are still
        below floor.&rdquo;</I> The seasonal cadence is what drives the contraband-rare
        market into its peak; collectors who have been hunting the contraband across the
        Series race to complete the Pane before close. The day after close, the next
        Series&rsquo;s Tentpole Pane launches with its first Set live; the new Tentpole
        becomes the gravitational center of the next six months. The hand-off between
        Series is the most economically significant event in the product calendar; it is
        engineered to be felt rather than announced.
      </P>

      <H3El>Annual — canon reveal and the contributor accept-cycle</H3El>

      <P>
        Once a year, the deepest retention loop fires. Tier 3+ contributors whose flavor
        submissions have been queued for canon review during the year receive their
        accept-or-revise notifications. The Council&rsquo;s annual canon-decision is
        published as a Series-anchor event; new Adjacent or Foil Panes proposed at Tier 4
        are committed or rejected. The contributor accept-cycle is the
        participation-cosmology&rsquo;s deepest loop and the longest-cadence retention
        primitive in the product. A Tier-3 collector who has been writing flavor lines
        for nine months waits for this moment the way a fan-canon contributor waits for
        the SCP Foundation&rsquo;s annual canonization vote. The doctrine treats this as
        the cathedral-scale retention beat, slow and rare and load-bearing.
      </P>

      <H3El>The retention cadence as a single architecture</H3El>

      <P>
        Daily, weekly, seasonal, annual. Each cadence answers a different question. Daily:
        <I> what changed since I checked yesterday?</I> Weekly: <I>which Pane&rsquo;s
        cosmology held under the conflict?</I> Seasonal: <I>which Pane&rsquo;s closing
        window am I racing?</I> Annual: <I>which of my contributions made it to canon?</I>
        Four temporal questions; four return-visit beats; one compounding architecture.
        The product gets the retention behavior the cadence rewards; the cadence is
        engineered to reward the doctrine, which is why the retention section&rsquo;s
        success is measured in screenshot-emission rate (Yardstick 7) rather than in
        daily-active-user count.
      </P>
    </section>
  );
}
