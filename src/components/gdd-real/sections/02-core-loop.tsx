import { SectionHeader, P, PQ, H3El, I, CodeBlock } from '../shared';

export function SectionCoreLoop() {
  return (
    <section id="section-2">
      <SectionHeader num="§ 2" title="Core Loop" />

      <PQ>
        The visitor-to-collector loop is the product. Every other section is a refinement of
        one or more nodes in this loop.
      </PQ>

      <P>
        A digital collectibles game lives or dies by its core loop. The loop is not a feature
        list; it is a directed graph where every node is a state the user passes through and
        every edge is a transition that requires either a product surface or a behavioral
        nudge. A team without an explicit loop ships features that don&rsquo;t compose because
        each feature optimizes its own local node without knowing how it connects to the
        next. LoreVault&rsquo;s loop has nine nodes and eight transitions, and the
        diagrammatic version below is the spine to which every later section attaches.
      </P>

      <CodeBlock
        code={`Visitor
  │
  ▼ (Hook — tile grid + axiom + silhouette card)
First Pack — sealed, tap to open
  │
  ▼ (Reveal ritual — silhouette-glance, slow Legendary pause)
First Card — Iceberg 2:1:8 depth visible
  │
  ▼ (Set Tracker appears: 1 of 12 in [Pane Name] Starter)
First Set — completion path visible
  │
  ▼ (Daily Challenge: "buy any card from any active Pane")
First Challenge — return-visit hook activated
  │
  ▼ (Contraband badging surfaces in marketplace browse)
First Contraband — semantic-premium card encountered
  │
  ▼ (Floor card listed; offer placed; trade settles)
First Trade — provenance ledger updates
  │
  ▼ (Weekly Prediction event: cross-Pane axiom-conflict)
First Game — narrative-scar earned on winning Pane
  │
  ▼ (Daily push: "a new card dropped in [primary Pane]")
Return Visit
  │
  └─── back to First Pack — the loop compounds`}
        label="Core loop graph"
      />

      <H3El>Visitor → Hook</H3El>

      <P>
        The visitor lands on a Pane tile grid. Three Panes are shown, each with its own axiom
        in restrained small caps and one painted silhouette card bled to the edge of the
        tile. There is no logo in the upper bar, no marketing carousel, no testimonial band,
        no daily-streak strip. The single primary CTA reads <I>Choose a Pane</I>. The grid
        is the entire above-the-fold; the Pratchett-grade pull-quote sits below the third
        tile in small italic grey. This is the silhouette-glance layer of the 95/5 rule
        applied to the first encounter: the median visitor takes the vibe at 0.4 seconds and
        either taps or leaves.
      </P>

      <H3El>Hook → First Pack</H3El>

      <P>
        Choosing a Pane drops the visitor into the Starter Pack flow for that Pane. The
        starter pack is one Rare guaranteed, three Common, one wildcard that may be a
        contraband-rare on the lucky pull. Apple Pay surfaces in a single tap, nine dollars,
        a pack-rip animation begins. There is no email-then-password-then-2FA-then-credit-card
        flow. The Dapper Wallet is provisioned silently behind the visitor&rsquo;s first
        purchase, and they never see a seed phrase.
      </P>

      <H3El>First Pack → First Card → First Set</H3El>

      <P>
        The reveal ritual is the most-replayed surface in a collectibles game; every other
        product touch is replayed less than this one. The cards reveal one by one. Common
        flips fast. Rare slows. Legendary holds the silhouette for two and a half seconds
        before resolving — the Mirrlees-iceberg slow reveal that lets the silhouette do its
        work before the full card lands. Once the pack is open, the first card on top is
        treated specially: a surface line, an Echo line, and an &ldquo;there is more&rdquo;
        prompt that lets the visitor pull on the iceberg if they want. The Set Tracker
        appears below the card: <I>1 of 12 in the [Pane Name] Starter Set</I>. Two of the
        eleven missing cards are shown at floor price in the marketplace, with one-tap
        purchase available if Dapper Balance is loaded.
      </P>

      <H3El>First Set → First Challenge → First Contraband</H3El>

      <P>
        Within the first session, a Daily Challenge widget surfaces in the corner of the
        view: <I>buy any card from any active Pane — 1 pack credit + XP</I>. The visitor has
        just bought a card; the challenge is already half complete. They tap the challenge,
        confirm, the credit lands. This is the return-visit hook activating early. While
        browsing the marketplace for the second missing card in their starter set, they pass
        a card with a small fairy-fruit glyph in the corner — the contraband badge. They tap
        it. The card frame surfaces the contraband&rsquo;s structural meaning in two lines.
        The visitor learns, without being lectured, that some cards in a Pane are
        <I> forbidden</I> as well as rare.
      </P>

      <H3El>First Contraband → First Trade → First Game → Return Visit</H3El>

      <P>
        The visitor lists their unwanted Common at the floor price. Within hours, an offer
        comes in (the Smashable Floor mechanic at work — a completionist on the other side
        is grinding the same starter set). The trade settles. The provenance ledger updates
        on the visitor&rsquo;s profile. Later that week, a notification arrives: <I>the
        Lud-Border vs Sinterklaas-Reigns conflict is live. Your Lud-Border cards can predict
        the outcome.</I> The visitor stakes one card on Lud-Border. The conflict resolves
        seven days later. Their card, on the winning side, gains a translation-scar overlay
        — a small permanent marker indicating the card survived the conflict. The next day,
        a push lands: <I>a new card dropped in Lud-Border</I>. They open the app. The loop
        compounds.
      </P>

      <H3El>Why these eight transitions are the right ones</H3El>

      <P>
        Each transition is a known retention point in the digital-collectibles literature.
        Visitor-to-hook is the conversion battleground; the storefront loop&rsquo;s LEARNINGS
        documented that single-featured-item pages convert at a different multiple than
        choice-of-many. Hook-to-first-pack requires the no-friction custodial wallet
        primitive, without which the loop never starts. First-pack-to-first-card is the
        opening ritual the iceberg-slow reveal serves. First-card-to-first-set is where
        completion-grinding behavior begins. First-set-to-first-challenge is the recurring
        engagement primitive — the storefront loop documented +8.0 score delta from
        challenges, the largest single delta. First-challenge-to-first-contraband is where
        the doctrine teaches itself by being encountered, not by being explained.
        First-contraband-to-first-trade is where the marketplace primitive activates and the
        collector becomes part of the secondary economy. First-trade-to-first-game is where
        the cards do their second job as game tokens, creating narrative stakes that drive
        the next return visit. Eight nodes; eight transitions; one compounding loop.
      </P>
    </section>
  );
}
