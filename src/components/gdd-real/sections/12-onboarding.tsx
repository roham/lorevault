import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionOnboarding() {
  return (
    <section id="section-12">
      <SectionHeader num="§ 12" title="Onboarding" />

      <PQ>
        Five screens from landing to first pack opened. The screens are the doctrine&rsquo;s
        first-encounter surface; the doctrine teaches itself there.
      </PQ>

      <P>
        Onboarding is where the conversion math lives. The product loses sixty to ninety
        percent of first-time visitors before the first paid action; the onboarding section
        is the spec for the surface that fights that drop-off. LoreVault commits to a
        five-screen ceiling from landing to opened pack — the visitor goes from never
        having heard of the product to holding their first card in the time it takes to
        read this paragraph. No tutorial overlay. No pop-up. No wallet prompt. No
        seed-phrase. The lore is the onboarding; every screen either leaves Lampblack on
        the visitor or the visitor leaves.
      </P>

      <H3El>Screen 1 — Hook (the 0.4-second silhouette glance)</H3El>

      <P>
        The visitor lands on a Pane tile grid. Three Panes are shown, each with one painted
        silhouette card bled to the edge of the tile and one axiom in restrained small caps
        below it. The Lud-Border tile shows a Mirrlees-warm-rotten-honey-glow with the
        axiom <I>&ldquo;there is a fruit that nobody is supposed to eat&rdquo;</I>. The
        Old-Ones-Persist tile shows a redacted-sigil silhouette with the axiom
        <I> &ldquo;deduction is denial of cosmic horror&rdquo;</I>. The Sinterklaas-Reigns
        tile shows a moral-ledger-line silhouette with the axiom <I>&ldquo;the year is
        always Reckoning-Year-12&rdquo;</I>. There is no logo in the upper bar, no
        marketing carousel, no testimonial band, no daily-streak strip. The single primary
        CTA reads <I>Choose a Pane</I>, pinned to the bottom of the viewport. A small
        Pratchett-grade pull-quote in italic grey sits below the third tile: <I>&ldquo;the
        cane in the corner of the frame is not the one Watson carried home.&rdquo;</I> The
        visitor takes the vibe at silhouette-glance and either taps or leaves. This is the
        95/5 rule applied to first encounter: the median visitor does not read; they look
        and decide.
      </P>

      <H3El>Screen 2 — Taste (Pane selection)</H3El>

      <P>
        The visitor taps a Pane tile. The tile expands to a full-screen Pane page: the
        Pane&rsquo;s axiom in large serif, two further cards rendered at full art with
        their flavor lines visible, the Pane&rsquo;s sentence-rhythm rendered in the
        chrome of the page (Mirrlees-civic for Lud-Border means a bourgeois-bureaucratic
        type treatment in the chrome; Borgesian-formal for Old-Ones-Persist means a
        scholarly-citation type treatment), and a single CTA: <I>Open the [Pane Name]
        Starter Pack — \$9 with Apple Pay</I>. The visitor either taps to purchase or taps
        the small back arrow to return to the Pane grid and pick a different Pane. The
        Pane selection is the Netflix-shape personalization from a single signal — one
        choice, three candidates, the rest of the product calibrates to the choice.
      </P>

      <H3El>Screen 3 — First Pack (the reveal ritual)</H3El>

      <P>
        Apple Pay surfaces in a single tap; nine dollars; the pack-rip flow begins.
        Behind the scenes the Dapper Wallet is provisioned for the visitor based on their
        Apple-ID-derived email; they never see a seed phrase. The pack-rip animation runs
        as described in § 6: full-bleed black, sealed pack centered, tap to crack the
        seal, cello pluck, warm amber light, first card slides out face-down, tap to flip,
        the card lands. The first card is always Rare or better — a deliberate choice for
        first-time collectors, calibrated to make the first card a meaningful object
        rather than a Common dilution. The remaining four cards reveal in sequence; if any
        are Legendary, the iceberg-slow reveal pause is held. By the end of the screen,
        the visitor has five cards in hand.
      </P>

      <H3El>Screen 4 — Iceberg (the depth invitation)</H3El>

      <P>
        After the pack-rip is complete, the screen settles on the first card. The card
        sits at full size with its surface line visible — for example, on a Lud-Border
        Customs House Set Rare: <I>&ldquo;the magistrate had been writing
        Reckoning-Year-Twelve for nine years.&rdquo;</I> A small prompt appears below the
        card: <I>there is more</I>. The visitor taps the prompt; the Echo line fades in:
        <I> &ldquo;his ledgers had begun to dream.&rdquo;</I> Another tap surfaces the
        first deep-iceberg facet — a single line gestured at the buried weight of
        Lud-Border, the Faerie that leaks through civic life. A third tap is not yet
        offered; the deeper iceberg layers are gated to Tier 2 and above. <I>The rest of
        the weight is earned</I> appears in small italic at the bottom of the card frame.
        This is the iceberg 2:1:8 commitment expressed at first encounter: the surface is
        legible, the Echo is one line, the deep is gestured at and not yet readable.
      </P>

      <H3El>Screen 5 — Set (the collection hook)</H3El>

      <P>
        The visitor taps continue. The screen transitions to the Set Tracker view. <I>You
        have 1 of 12 in the Lud-Border Customs House Starter Set. Here&rsquo;s what you
        need.</I> The eleven missing cards render as silhouette tiles with their floor
        prices visible. Two of them are listed at floor with a one-tap purchase CTA. Below
        the Set Tracker, a smaller widget surfaces the Daily Challenge: <I>buy any card
        from any active Pane — 1 pack credit + XP. You&rsquo;re half-way there.</I> The
        challenge is half-completed because the visitor has just bought their first pack.
        A single tap completes it; the credit lands; the visitor is now in the daily
        cadence loop. The screen closes with a soft prompt: <I>your collection is at
        /collection. The next pack drops in 6d 14h. The Footnoter&rsquo;s Letter arrives
        Tuesday.</I> Five screens. From landing to opened pack to first-set-visible. No
        tutorial. No pop-up. No wallet seed phrase. No KYC. The cosmology has been taught
        by being encountered.
      </P>
    </section>
  );
}
