import { SectionHeader, P, PQ, H3El, I, TierRow } from '../shared';

export function SectionProgression() {
  return (
    <section id="section-8">
      <SectionHeader num="§ 8" title="Progression Systems" />

      <PQ>
        The product gets the behavior the leaderboard rewards. Top Shot rewards portfolio
        value. LoreVault rewards Pane mastery.
      </PQ>

      <P>
        Progression is what makes a collectibles game retain a collector beyond the first
        thirty days. Without progression, a collectible product is a one-shot purchase;
        with it, a collector returns daily for the next tier unlock, weekly for the next
        Pane-mastery threshold, monthly for the next leaderboard reset, and seasonally for
        the next contributor accept-cycle. LoreVault&rsquo;s progression layer has four
        components: collector tiers, per-Pane mastery, per-Series mastery, and the
        participation-tier ladder. Each component answers a different temporal question
        the collector is asking; together they form the long retention spine.
      </P>

      <H3El>Collector tiers — what each tier unlocks</H3El>

      <TierRow
        tier="Tier 0"
        title="Day-One Passive"
        body={
          <P>
            The default state of every visitor before they purchase. They see the storefront,
            they see the marketplace, they see public Showcases, but they cannot list, offer,
            or contribute. This is the read-only state and it is intentionally porous — the
            visitor must be able to taste the product before they pay.
          </P>
        }
      />
      <TierRow
        tier="Tier 1"
        title="Active Set Collector"
        body={
          <P>
            Unlocked at first pack purchase. Tier 1 unlocks the marketplace (listings, offers,
            Smashable Floor), the Showcase (the user&rsquo;s public profile), the Daily and
            Weekly Challenge module, and the Pane-mastery leaderboards. This is the standard
            collector state; most users live here for the duration of their relationship with
            the product.
          </P>
        }
      />
      <TierRow
        tier="Tier 2"
        title="Challenge Completer"
        body={
          <P>
            Unlocked at three completed weekly challenges plus one set completion. Tier 2
            unlocks the deeper iceberg layers on owned cards (the buried-weight prompts that
            were locked at Tier 1), challenge-creation rights (the user can propose challenges
            to the community queue), and voting on community-proposed challenges. Tier 2 is
            where the literary-engaged collector starts to participate in the doctrine&rsquo;s
            ongoing definition.
          </P>
        }
      />
      <TierRow
        tier="Tier 3"
        title="Contributor"
        body={
          <P>
            Unlocked at three accepted community-vote challenges plus two cards owned at the
            Contraband-Rare level. Tier 3 unlocks flavor-line submission (the user can propose
            flavor lines for upcoming cards) and contraband-proposal rights (the user can
            propose new contraband for active Panes). Submissions go through the Council
            review gate; accepted submissions are published with the contributor&rsquo;s
            handle in the card&rsquo;s permanent metadata. Tier 3 is the participation-economic
            layer; accepted submissions earn from the Contributor Pool.
          </P>
        }
      />
      <TierRow
        tier="Tier 4"
        title="Canon Contributor"
        body={
          <P>
            Unlocked at five published flavor lines plus one contraband proposal accepted into
            canon. Tier 4 unlocks canon contribution — the user can propose new Adjacent or
            Foil Panes for future Series, with the Council reviewing proposals at quarterly
            cadence. Tier 4 contributors are credited on the Series page when their Pane
            ships, and they receive a structural cut of the Contributor Pool routed through
            the doctrine&rsquo;s revenue-share scheme. This is the doctrine&rsquo;s answer to
            the SCP-Foundation / Homestuck / RWBY participation-cosmology question.
          </P>
        }
      />

      <H3El>Per-Pane mastery</H3El>

      <P>
        Every Pane carries a mastery progression independent of the collector tier. Mastery
        is measured as the percentage of the Pane&rsquo;s card list collected by serial
        ownership; reaching twenty-five percent unlocks the Pane&rsquo;s public mastery
        badge on the Showcase, fifty percent unlocks the deep-iceberg layers across all
        owned cards from that Pane, seventy-five percent unlocks the Pane&rsquo;s archive
        page (a Pane-specific deep-lore surface), and one hundred percent unlocks the
        Pane&rsquo;s contributor-credit row on the Showcase plus a one-of-N completion
        commemorative card. The Pane-mastery badges are the literary equivalent of the Top
        Shot Cadence Score — except they reward what the doctrine wants rewarded, not
        portfolio value.
      </P>

      <H3El>Per-Series mastery</H3El>

      <P>
        Completing a full Series — every card in every Set across every active Pane in that
        Series — unlocks the Series-mastery badge plus an exclusive cross-Pane card minted
        at one-of-one for the completer. Series mastery is rare; in the projected base case,
        five to twenty collectors per Series will reach it. The completion-grinders compete
        publicly for the position; the leaderboard reflects who is closest. This is the
        deepest collecting goal LoreVault offers; the Top Shot equivalent is the Cadence
        completionist tier, and LoreVault adapts the structure but rewrites the rewards in
        Pane-grammatical vocabulary.
      </P>

      <H3El>Series 1 ships participation-disabled</H3El>

      <P>
        The participation tier ladder ships with Series 1 visible but
        participation-<em>disabled</em>. Tier 0 and Tier 1 are functional from launch; Tier
        2 unlocks at Series 1 month four (after enough collectors have completed challenges
        to make the community-vote queue substantive); Tier 3 and Tier 4 do not unlock
        until Series 2. This is the doctrine&rsquo;s deliberate cadence. The product needs
        a critical mass of literary-engaged collectors before opening fan-canon
        contribution; if Tier 3 unlocked at launch, the contribution stream would be
        dominated by speed-runners rather than collectors who have lived in the cosmology
        long enough to write within it. The Series 1 ladder is visible on every collector
        profile so they know what they are growing toward, even though they cannot yet
        unlock the upper rungs.
      </P>
    </section>
  );
}
