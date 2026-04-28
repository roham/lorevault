import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionMarketplace() {
  return (
    <section id="section-7">
      <SectionHeader num="§ 7" title="Marketplace" />

      <PQ>
        A digital collectible without a marketplace is a digital trinket. The marketplace
        is what makes the collectible <em>behave</em> like one.
      </PQ>

      <P>
        Secondary liquidity is the long-game economic engine. Primary drops are the spike;
        secondary is the sustained heart-rate. Top Shot ships a marketplace with five
        load-bearing primitives — listings, offers, floor-price discovery, the Smashable
        Floor, royalty enforcement — and LoreVault adopts all five. What LoreVault adds on
        top is the visible-doctrine layer: Pane-attribution as a first-class facet,
        translation-scar rendering on cross-Pane Pierre-Menard variants, and contraband
        badging for cards that hold the structural-contraband role of their Pane. Without
        the additions, the marketplace is a Top Shot reskin; with them, the marketplace is
        the surface where a buyer encounters the cosmology while pricing the cards.
      </P>

      <H3El>Listings, offers, floor</H3El>

      <P>
        A listing is a seller-set ask price in US dollars with a default thirty-day expiry.
        Listings show the card, the rarity, the serial number, the Pane attribution, the
        current floor price for the same card, the last-sale price, and the trailing
        twenty-four-hour volume. An offer is a buyer-placed bid; the seller can accept,
        counter, or reject; offers expire after seven days by default. Floor price is the
        lowest current ask for the card and updates in real time as listings come and go;
        floor-price changes are visible on the card detail page with a small arrow showing
        the trailing direction. The floor is the reference price the entire marketplace
        revolves around.
      </P>

      <H3El>The Smashable Floor — what it is, why it matters</H3El>

      <P>
        Hitting the floor is the instant-buy mechanic. A buyer who wants the card without
        negotiating taps the listing at the floor price; the trade settles in a single tap;
        the card lands in the buyer&rsquo;s wallet. This is the mechanic the Top Shot
        community calls the Smashable Floor — the floor is liquid because there is always
        someone willing to take the lowest current ask, and the floor card is the
        unambiguously cheapest path to set completion. Completion-grinders use the floor
        relentlessly; flippers use it to arbitrage; collectors with a few minutes between
        meetings use it to close gaps in their Pane mastery. The Smashable Floor is what
        makes the marketplace fast enough to be a play surface.
      </P>

      <H3El>Pane-attribution at trade time</H3El>

      <P>
        Every card&rsquo;s frame in the marketplace renders the Pane attribution
        prominently. The marketplace browse is filterable by Pane as a primary axis — not a
        tag tooltip, a persistent left-rail filter that lets a buyer drill into &ldquo;all
        Lud-Border cards&rdquo; or &ldquo;all Holmes cards across active Panes&rdquo; with
        one click. The Pane filter is the discovery surface for the cosmological-variant
        model. A collector who clicks &ldquo;Holmes&rdquo; sees the Baker-Street Holmes,
        the Old-Ones-Persist Holmes, and the Sinterklaas-Reigns Holmes side by side, with
        the Pane attribution badge on each, and the translation-scar badge marking the
        cross-Pane sibling relationship.
      </P>

      <H3El>Translation-scar rendering</H3El>

      <P>
        When a card is a Pierre-Menard variant — the same card text in a different Pane
        attribution — the marketplace listing thumbnail carries a translation-scar marker:
        a small overlay in the corner of the card frame that signals &ldquo;this card has
        cross-Pane siblings.&rdquo; Tapping the scar surfaces the sibling cards in a
        triptych; the buyer sees the same text rendered under three different cosmological
        pressures, and the pricing surface lets them compare floor and last-sale across the
        triptych. This is what makes the Pierre-Menard market mechanic legible. Without the
        translation-scar, two identical-text cards in different Panes look like a database
        bug; with the translation-scar, they look like the doctrine.
      </P>

      <H3El>Contraband-rare market behavior</H3El>

      <P>
        Cards that hold the structural-contraband role of their Pane carry a small
        contraband badge in the marketplace listing thumbnail — a fairy-fruit glyph for
        Lud-Border, an unwritten-sentence glyph for Sinterklaas-Reigns, a redacted-sigil
        for Old-Ones-Persist. The badge is rendered in the same visual register as the
        rarity chip, so the buyer sees rarity and contraband-status at the same glance.
        Contraband cards command a structural premium beyond what their edition size would
        suggest, because the secondary market price reflects narrative meaning, not just
        scarcity. A Common-edition contraband card may clear above a Rare-edition
        non-contraband card from the same Pane; the doctrine permits this, and the
        marketplace UI surfaces the two metrics separately so a collector can read the
        signal.
      </P>

      <H3El>Fee structure on display</H3El>

      <P>
        Every listing surfaces the take-rate stack to the seller before they confirm.
        &ldquo;Sale price $25.00. Platform fee 2.5% ($0.63). Creator royalty 2.5% ($0.63).
        You receive $23.74.&rdquo; The contributor-pool routing is implicit in the creator
        royalty (one and a half percent of every sale is ringfenced to the Contributor
        Pool); the seller doesn&rsquo;t need to see the routing detail unless they ask, but
        a collector who clicks &ldquo;where does the royalty go&rdquo; gets the
        explanation. Royalty enforcement is contract-level; there is no royalty-skipping
        path because the cards transfer only through the official marketplace. This is
        Top Shot&rsquo;s deliberate, controversial choice and LoreVault inherits it
        wholesale.
      </P>
    </section>
  );
}
