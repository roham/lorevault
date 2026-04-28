import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionAtlasIntegration() {
  return (
    <section id="section-14">
      <SectionHeader num="§ 14" title="Atlas Integration Story" />

      <PQ>
        LoreVault inherits commerce. LoreVault builds literature.
      </PQ>

      <P>
        Atlas is the Dapper-platform substrate that powers Top Shot, NFL ALL DAY, UFC
        Strike, and Disney Pinnacle. It provides a custodial wallet, fiat on-ramps, the
        Flow blockchain with Cadence smart contracts, a pack-mechanics service, a
        secondary marketplace, identity and KYC, a CDN, a quest engine, a leaderboard
        service, and a Showcase primitive. LoreVault inherits roughly seventy-five
        percent of that stack directly, negotiates custom hooks for fifteen percent, and
        builds the remaining ten percent on top. The boundary between inherited and built
        is the boundary between the commercial layer and the literary layer; the
        commercial layer is solved at the platform, the literary layer is what makes the
        product worth attaching to the platform.
      </P>

      <H3El>What LoreVault inherits</H3El>

      <P>
        The Dapper Wallet is inherited directly. The visitor never sees a seed phrase,
        never installs a browser extension, never pays gas. Email plus password creates an
        account; the wallet is provisioned silently behind that. This is what makes
        LoreVault a literary product instead of a niche crypto product — two-thirds of the
        target audience has no crypto-literacy, and the custodial wallet is the difference
        between losing them at the door and onboarding them to their first pack. Apple Pay
        and credit-card on-ramps are inherited directly. The friction between <I>I want
        this card</I> and <I>I own this card</I> collapses to a single tap on iOS; on web,
        the credit-card flow is full-PCI and stored payment methods carry across sessions.
        Flow blockchain and Cadence smart contracts are inherited directly. Every
        LoreVault card is a Cadence resource; the provenance ledger that § 11 surfaces as
        narrative is a Cadence query, not a database lookup; the Pierre-Menard variant
        economy depends on Cadence&rsquo;s native support for shared-collection contracts
        with per-edition metadata fields. KYC is inherited directly, triggered only at the
        Travel-Rule threshold or at Tier-3 contributor onboarding (whichever comes first).
        The CDN is inherited directly. The asset pipeline (FLUX render, manifest, CDN
        upload) is Track-D&rsquo;s job; delivery and edge-caching are Atlas&rsquo;s.
      </P>

      <H3El>What LoreVault builds</H3El>

      <P>
        The Lore Doctrine content layer is built fresh and fully owned by LoreVault. The
        Pane attribution rendered in card frames; the Lampblack hierarchy ordered
        gesture-first in card art briefs; the iceberg 2:1:8 reveal UI in the pack-rip
        ritual and the card detail page; the Pierre-Menard cross-Pane variant display in
        the marketplace triptych; the contraband economy with the structural-contraband
        badging on listing thumbnails; the participation tier ladder with the Tier 0
        through Tier 4 progression; the taste-onboarding surface with the three-Pane tile
        grid and the Netflix-shape single-signal personalization. None of this is an
        Atlas primitive. All of it is what makes LoreVault a literary engine. The build
        cost is small relative to the platform stack — a focused frontend team plus the
        editorial layer (Footnoter, Council, contractor prose stylists) — and the doctrine
        is what protects the build from drifting into Top-Shot-reskin shape under live-ops
        pressure.
      </P>

      <H3El>What LoreVault negotiates with the Atlas team</H3El>

      <P>
        Six items on the negotiation list. <I>Per-pack reveal pacing hook</I>: the reveal
        animation timeline must be configurable per-rarity. Top Shot&rsquo;s default is a
        uniform fast reveal; LoreVault needs Legendary and Contraband-Rare to slow and
        pause. Estimated incremental cost on the Atlas side: a single config field in the
        drop spec. <I>Silhouette-precedence asset pipeline</I>: the 0.4-second
        silhouette-glance is a load-bearing surface. The asset manifest must carry both a
        silhouette URL and a hero URL; the reveal client must honor the staging.
        Estimated cost: a manifest extension and a reveal client update. <I>Pane
        attribution as a first-class marketplace facet</I>: not a tooltip, a persistent
        left-rail filter and a card-frame badge. <I>Translation-scar rendering</I>: when
        two cards share gesture but differ in Pane, the marketplace card frame visibly
        diffs them — a small overlay marker, a subtle palette shift in the chrome, a
        translation-cost badge below the rarity. The marketplace API must expose the
        cross-Pane sibling-card relationship to render this. <I>Contraband badging</I>:
        the cards that hold the structural-contraband role of a Pane carry a small visual
        marker. The marketplace must render the badge alongside the rarity, and the
        floor-price discovery must treat contraband as its own filter axis. <I>Custom
        leaderboard semantics support</I>: the Atlas leaderboard service must accept a
        custom scoring formula at the product level; LoreVault&rsquo;s formula is not
        portfolio-dollar-weighted, it is Pane-mastery + contraband-hunt + contributor-rank
        weighted.
      </P>

      <H3El>The negotiation list is small. The doctrine cost of not getting it is large.</H3El>

      <P>
        None of the six items on the negotiation list is architecturally novel for the
        Atlas team. All of them are doctrine-bound for LoreVault. The Atlas team&rsquo;s
        incremental cost is in the low single-digit engineer-weeks per item; the
        cumulative cost is roughly a single quarter of one engineer&rsquo;s time. The
        LoreVault doctrine&rsquo;s cost of <I>not</I> getting these is the difference
        between a literary engine and a Top-Shot reskin with literary names painted on,
        which is precisely the V1 trap the V2 doctrine was built to escape. The Atlas
        negotiation list is the leverage point: small platform-side investment, large
        product-side payoff.
      </P>

      <H3El>The inheritance ratio</H3El>

      <P>
        Roughly seventy-five percent of the platform stack is direct inheritance; fifteen
        percent is inheritance with negotiated custom hooks; ten percent is full LoreVault
        build. This ratio is the correct one. A LoreVault that built more of the stack
        would be a smaller, slower, more brittle product, and would burn the engineering
        budget on infrastructure that Dapper has already built. A LoreVault that built
        less would be a Top Shot reskin with literary names painted on, which fails the
        doctrine&rsquo;s entire premise. The ratio is not a compromise; it is the
        doctrine&rsquo;s correct architectural calibration.
      </P>
    </section>
  );
}
