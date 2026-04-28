import { SectionHeader, P, PQ, H3El, I } from '../shared';

export function SectionChallenges() {
  return (
    <section id="section-9">
      <SectionHeader num="§ 9" title="Challenges & Events" />

      <PQ>
        Challenges are not gamification glued onto a collecting product. They are how the
        doctrine teaches itself.
      </PQ>

      <P>
        The challenge layer is the primary return-visit mechanic. The storefront-prototype
        loop measured the addition of a challenge module against the prior baseline and
        found the largest single cycle delta in the history of the loop — an eight-point
        score gain from one cycle. The mechanism is well-understood: a collector who knows
        they are four ranks from a Rare Airdrop has a specific reason to come back tomorrow,
        and a specific path to the next purchase. Challenges convert browsing into intent.
        LoreVault adopts the structure (daily, weekly, seasonal, set-completion) and
        rewrites the task vocabulary in the doctrine&rsquo;s grammar. The vocabulary
        matters; a challenge that says &ldquo;buy a Lakers Moment&rdquo; is gamification, a
        challenge that says &ldquo;find the contraband in any active Pane&rdquo; is the
        doctrine narrating itself to the collector.
      </P>

      <H3El>Daily challenges</H3El>

      <P>
        The daily challenge is a single, gentle task that resets at midnight UTC. Examples:
        <I> buy any card from any active Pane</I>, <I>list one Common card on the
        marketplace</I>, <I>open one pack from any tier</I>, <I>complete a trade with another
        collector</I>. Reward: one pack credit (redeemable in the storefront for any
        Standard Pack) plus fifty XP toward the weekly leaderboard reset. Daily challenges
        are intentionally low-friction; they exist to anchor the daily return habit, not to
        gate progression. The Pokémon TCG Pocket experience — a single daily Wonder Pack
        choice rather than a menu of three — informs the LoreVault choice to ship one
        daily challenge, not three.
      </P>

      <H3El>Weekly challenges</H3El>

      <P>
        The weekly challenge is a multi-step task that resets every Wednesday at midnight
        UTC. The Wednesday anchor is doctrine — the Hermès cadence-anchor Frigga primitive
        documented in the storefront loop&rsquo;s cycle 0013, where specific weekday cadence
        beats vague weekly cadence. Examples: <I>complete any Set of three or more cards
        within a single Pane</I>, <I>own at least one card from each of three different
        Panes</I>, <I>list one Rare card and complete the sale within the week</I>.
        Reward: one Rare Pack drawn from a Pane the user has not yet collected from
        (cross-Pane traversal incentive) plus two hundred XP. The cross-Pane reward is
        deliberate; the doctrine wants the collector pulled across Panes rather than
        deepening within a single one.
      </P>

      <H3El>Seasonal challenges</H3El>

      <P>
        The seasonal challenge runs across an entire Series (six months) and pulls the
        collector through the contraband economy. Example: <I>collect the contraband card
        from each active Pane in the current Series</I>. Reward: a limited Legendary
        commemorative card minted at fifty editions, available only to collectors who
        complete the seasonal hunt. Seasonal challenges drive the contraband-rare market —
        once collectors realize that completing the seasonal hunt requires owning each
        Pane&rsquo;s structural-contraband card, the floors on those cards lift across the
        Series, and the secondary volume on contraband-rares grows. The doctrine economy is
        engineered to compound this way.
      </P>

      <H3El>Set-completion challenges</H3El>

      <P>
        The set-completion challenge ships with each Set release. Completing the Set —
        owning every card in the Set&rsquo;s card list — unlocks the Set-completion badge
        on the Showcase plus an exclusive Pane-attributed card minted at edition one
        hundred (a special Run that sits between Rare and Legendary in scarcity). The
        Set-completion challenge is the most transactional of the challenge types; it
        rewards the completion-grinder behavior that the Smashable Floor mechanic enables
        and that the Top Shot collector economy is built on.
      </P>

      <H3El>Cross-Pane challenges — the Pierre-Menard track</H3El>

      <P>
        The cross-Pane challenge is the doctrine-load-bearing challenge. Example: <I>collect
        one Holmes card from three different Pane attributions</I>. The reward is a
        Pierre-Menard recognition badge on the Showcase plus the Pierre-Menard
        variant-walkthrough surface on the user&rsquo;s account — a triptych view that
        renders all three Holmes variants side by side with their Pane axioms, sentence
        rhythms, and translation-cost flavor. This is how the cosmological-variant model
        becomes legible to the collector: not by reading a wiki entry, but by completing a
        challenge that puts the variants in their hand.
      </P>

      <H3El>Contraband-hunt challenge</H3El>

      <P>
        Find the contraband card in every active Pane. The reward is the contraband-hunter
        badge plus a Contraband-Rare card from the Pane the user has spent the least time
        in (the doctrine&rsquo;s nudge toward Pane-coverage rather than Pane-depth). The
        contraband-hunt is the leaderboard primitive for the contraband economy; it is what
        makes the contraband-rare cards command a structural premium in § 7 (Marketplace)
        — collectors who are mid-hunt are the demand side of the contraband market.
      </P>

      <H3El>Lampblack challenge</H3El>

      <P>
        Collect all seven Lampblack-hierarchy positions represented in a single Pane —
        gesture, cosmological-relation, wound, forbidden-act, role, silhouette, prop. The
        reward is the Lampblack-Reader unlock for that Pane, which surfaces the
        deep-iceberg buried-weight layer for every owned card from that Pane permanently.
        The Lampblack challenge is the doctrine-deepest challenge in MLP; it is the surface
        where the Tier-2 collector starts to feel the gesture-first hierarchy that the
        doctrine&rsquo;s § 8 of the changelog is built on.
      </P>

      <H3El>Reward economy across the challenge stack</H3El>

      <P>
        Daily challenges yield pack credits and XP. Weekly challenges yield packs and XP.
        Seasonal challenges yield exclusive commemorative cards. Set-completion yields
        badges and exclusive cards. Cross-Pane and contraband-hunt and Lampblack yield
        permanent unlock states on the user&rsquo;s account that change what they can see
        on owned cards forever. The reward stack is structured so that the daily and
        weekly tiers are economically gentle (the cost of running them is well-covered by
        the storefront margin) and the deeper tiers are emotionally permanent (the
        Lampblack-Reader unlock is not purchasable, only earnable). This is the discipline
        that prevents the challenge stack from devolving into a treadmill.
      </P>
    </section>
  );
}
