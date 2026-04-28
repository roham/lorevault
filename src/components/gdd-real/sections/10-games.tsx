import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionGames() {
  return (
    <section id="section-10">
      <SectionHeader num="§ 10" title="Games with Collectibles" />

      <PQ>
        A collectible without a play surface is a static portfolio. The chosen game gives
        collected cards a second use and creates narrative stakes around the collection.
      </PQ>

      <P>
        Every successful collectibles product has at least one play surface where the cards
        do work beyond sitting in a vault. Top Shot has Predictions and Picks. Sorare has
        the fantasy-game integration. MTG Arena has the full game engine with deck building
        and ladder play. Pokémon TCG Live ships the same. The MLP question is not <I>should
        LoreVault have a play surface</I> — that&rsquo;s settled, the answer is yes — but
        <I> which play surface, at what build cost, with what doctrine fit</I>. The
        candidate set was five options, and the analysis below walks the candidates and
        commits to one for MLP, defers the others to V2 or research-only.
      </P>

      <H3El>Candidate 1 — Sorare-style fantasy. Defer to V2.</H3El>

      <P>
        Sorare ships fantasy soccer (and other sports) where the collected player cards
        become roster slots in a weekly fantasy league; the cards earn points based on the
        real-world athlete&rsquo;s actual game performance. The fit for LoreVault is poor
        in MLP. The mechanic requires either a sport-integration (which LoreVault
        doesn&rsquo;t have, the cards aren&rsquo;t athletes) or an in-house competitive
        engine where cards earn points based on Pane-attributed metrics (which would
        require a full game engine). The build cost is high; the doctrine fit is forced
        because fantasy leagues are stat-driven, and LoreVault&rsquo;s cards are
        gesture-driven. Defer.
      </P>

      <H3El>Candidate 2 — Top Shot Predictions. The MLP pick.</H3El>

      <P>
        Top Shot Predictions is a feature where collectors stake Moments on real-world
        outcomes; correct predictions yield XP and overlays, incorrect ones yield nothing
        or a small XP debit. The mechanic converts collectibles into game tokens at the
        lowest possible build cost — the engine is the same stake-resolve loop the pack
        machinery already runs. For LoreVault, the adaptation is a perfect doctrine fit:
        the &ldquo;real-world outcome&rdquo; becomes a <I>cross-Pane axiom-conflict</I>, a
        narrative event in which two Panes are placed in cosmological opposition for one
        week, and the collectors stake their Pane&rsquo;s cards on the outcome.
      </P>

      <P>
        The conflict mechanic, in detail. Once per week during a Series, the editorial
        layer stages a conflict between two active Panes. Example, week three of the
        Tentpole-Old-Ones-Persist Series, with Adjacent-Sinterklaas-Reigns as the foil:
        <I> &ldquo;does cosmic horror or moral ledger survive the eclipse?&rdquo;</I> The
        Footnoter publishes the conflict announcement in a weekly letter. Collectors visit
        the Prediction surface, choose a Pane to back, and stake one card from that Pane.
        Staking does not transfer the card; the card is locked from sale or trade for the
        seven-day conflict window but remains in the staker&rsquo;s wallet.
      </P>

      <P>
        The resolution. At the end of the week, the Footnoter publishes the resolution
        narrative — a roughly three-hundred-word piece of in-world prose in the
        winning-Pane&rsquo;s sentence rhythm — and the system marks the winning Pane.
        Cards staked on the winning Pane gain a permanent <I>narrative-scar</I> overlay in
        the card frame: a small thin line in lampblack-pigment along the lower edge of the
        card, marking that the card survived this conflict. The narrative-scar is
        cumulative; a card that has survived three conflicts carries three scars. Cards
        staked on the losing Pane are unmarked; the doctrinal claim is that no Pane is
        destroyed by another, they cohabitate incommensurably, and a losing card is
        unchanged but unmarked.
      </P>

      <P>
        The market behavior. Narrative-scarred cards command a premium on the secondary —
        not because they are mechanically stronger (the Prediction event has no mechanical
        consequence beyond the scar) but because they carry a provenance: <I>this card was
        present at the conflict and survived</I>. The secondary market discovers the
        scar premium the same way it discovers the contraband premium: through pricing
        signal. The Prediction event is therefore a primary-economic-engine for
        narrative-scarred secondary cards, with the bonus that it engages the
        editorial-layer (Footnoter) in regular weekly publication, which is a retention
        primitive in itself.
      </P>

      <P>
        Why this is the MLP pick. Lowest build complexity (the engine is the existing
        pack-stake-resolve loop, plus a per-card overlay flag in the Cadence contract).
        Direct integration with collecting behavior (you already have the cards). Creates
        narrative stakes around Pane identity (winning the conflict means your Pane&rsquo;s
        cosmology held under the pressure). Drives a secondary market for narrative-scarred
        cards. Engages the Footnoter editorial layer weekly. Four properties, all aligned
        with the literary-engine doctrine.
      </P>

      <H3El>Candidate 3 — MTG Arena-style draft. Defer to V2.</H3El>

      <P>
        Draft is a game where players take turns selecting cards from a shared pool, then
        play decks built from their selections. The fit for LoreVault is interesting at the
        doctrinal level — the doctrine&rsquo;s § 4 of the changelog is about a
        three-to-five-element rule-grammar that constrains card design, and a draft format
        could exercise that grammar — but the build cost is high (a full game engine), the
        balance work is enormous (Hearthstone&rsquo;s GDC postmortem documents a multi-year
        balance investment), and the literary register of LoreVault is contemplative
        rather than competitive. Defer to V2 with the explicit V2 caveat that any draft
        implementation must preserve the iceberg-2:1:8 register and not collapse to
        damage-and-toughness.
      </P>

      <H3El>Candidate 4 — Pokémon TCG-style battle. Defer to V2.</H3El>

      <P>
        Battle is the deepest game category — full deck construction, turn-based combat,
        ladder ranking, tournament play. The doctrine fit is the worst of the four
        candidates because the gesture-first Lampblack hierarchy doesn&rsquo;t naturally
        cash out as combat numbers, and forcing it would betray the literary commitment
        the entire doctrine is built around. Defer permanently or research-only.
      </P>

      <H3El>Candidate 5 — Tarot-narrative draws. V2 candidate.</H3El>

      <P>
        Tarot-narrative is the LoreVault-original candidate. The collector uses their
        cards as a reading deck — randomized draw of three or seven cards across the
        owned-card set, with the system generating a narrative reading by pulling the
        sentence-rhythms and Pane axioms of the drawn cards into a coherent story. The
        doctrine fit is excellent (the Footnoter-grade narrative voice the doctrine
        already invests in is the engine of the reading). The build cost is medium (a
        narrative-generation surface, a card-draw mechanic, the Pane-attribution-aware
        prose stitcher). V2 candidate; not in MLP scope, but documented here as the
        natural second play surface to ship after Predictions has been validated.
      </P>

      <H3El>The MLP commitment</H3El>

      <P>
        Predictions ship in V1 as the cross-Pane axiom-conflict event, on a weekly
        cadence, anchored by the Footnoter&rsquo;s editorial letter, with the
        narrative-scar overlay on the winning-Pane cards. Sorare-style fantasy and
        MTG-style draft and Pokémon-style battle are deferred. Tarot-narrative is the V2
        candidate.
      </P>
    </section>
  );
}
