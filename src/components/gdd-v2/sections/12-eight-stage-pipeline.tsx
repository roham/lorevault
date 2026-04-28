import {
  SectionHeader,
  P,
  PQ,
  H3El,
  IllustrationPlaceholder,
} from '../shared';

export function SectionEightStagePipeline() {
  return (
    <section id="section-12">
      <SectionHeader num="§ 12" title="The Eight-Stage Card Creation Pipeline" />

      <PQ>
        Stochasticity at stages two through five. Determinism at stages one, six, seven, and
        eight. The grammar locks the boundary; the variation lives inside it.
      </PQ>

      <IllustrationPlaceholder
        id="hero-12-pipeline"
        caption="A diagram of the eight stages as a horizontal sequence of nodes, with stages 2-5 marked stochastic in blue and stages 1, 6, 7, 8 marked deterministic in gold. Lines connect each stage to the next; the iceberg-2:1:8 marker hovers above stage seven."
        aspectRatio="16 / 9"
      />

      <P>
        Card creation in V1 was treated as a one-shot — a brief, an art commission, a flavor
        pass, a release. The treatment cannot survive a live-ops production environment
        scaled to two Series per year and three active Panes. V2 specifies eight stages,
        with the boundary between stochastic and deterministic stages drawn explicitly.
      </P>

      <H3El>The eight stages</H3El>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 1 — Pane Grammar Lock.</strong>{' '}
        Deterministic. The card&rsquo;s home Pane is selected. The pane-grammar JSON is
        loaded and locked for the card&rsquo;s lifecycle. No stochastic variation is
        permitted at this stage — the grammar is the constraint that makes the rest of the
        pipeline meaningful. A card whose grammar is unset has no production track. The
        grammar lock is a hard gate.
      </P>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 2 — Figure Variant Selection.</strong>{' '}
        Stochastic. From the figure repertoire (cross-Pane recurring figures, Pane-native
        figures, Pierre Menard candidates), the figure is selected and its variant slot is
        chosen. Stochasticity is bounded by the grammar: a figure incompatible with the
        Pane&rsquo;s axiom is filtered out before the stochastic step. The variation is in
        the choice among compatible figures.
      </P>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 3 — Axiom Derivation.</strong>{' '}
        Stochastic. Given the Pane and the figure, the production layer derives which facet
        of the Pane&rsquo;s axiom this card will instantiate. A Sinterklaas-Reigns card with
        a magistrate figure may instantiate ledger-tampering, gift-as-trap, or surveillance.
        The choice is bounded by the grammar elements but is allowed variation.
      </P>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 4 — Flavor Draft.</strong> Stochastic.
        The prose stylist (or the AI ops layer constrained by the pane-grammar JSON) drafts
        the flavor text. The sentence-rhythm enum is enforced. The verb for &ldquo;to
        die&rdquo; is locked. The contraband&rsquo;s relationship to this card is decided.
        Multiple drafts are produced; the production layer selects among them at stage six.
      </P>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 5 — Art Brief.</strong> Stochastic.
        The art brief is generated against the pane-grammar JSON and the chosen flavor draft.
        The Lampblack hierarchy is applied — gesture first, prop last. The composition
        density and palette commitment are matched to the rarity tier. Multiple briefs are
        produced; the production layer selects.
      </P>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 6 — Six-Test Gate.</strong>{' '}
        Deterministic. Every drafted flavor and brief is run through the six tests:
        Recognition, Necessity, Consequence, Voice-Inevitability, Footnote, Prose-Signature.
        A draft that fails any test is sent back to the appropriate stochastic stage with a
        note. A draft that passes all six advances. The gate is non-negotiable; pretty cards
        that fail the gate are cut.
      </P>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 7 — Iceberg Audit.</strong>{' '}
        Deterministic. The card is checked against the Pane&rsquo;s Weight Ledger. Does this
        card metabolize or strengthen the existing buried weight? Does it add a parallel
        mystery? Does it preserve the 2:1:8 ratio? A card that adds a competing mystery is
        rejected. A card that strengthens the weight passes. A card that uses the weight
        without adding to it passes only if it earns its place in the Pane&rsquo;s rhythm —
        not every card needs to advance the weight, but no card may distract from it.
      </P>

      <P>
        <strong style={{ color: '#C9A26B' }}>Stage 8 — Release Cut.</strong>{' '}
        Deterministic. The card is assigned to a drop slot — daily, weekly, monthly, or
        Series moment — and a release date. Release ordering is calendared so that the
        Pane&rsquo;s grammar elements rotate across the calendar; no week contains two cards
        instantiating the same grammar element. The cut is final; cards that miss the cut
        return to stage seven for re-audit.
      </P>

      <H3El>Why this shape</H3El>

      <P>
        The shape places stochasticity where variation produces life — in figure choice,
        axiom derivation, flavor drafting, and art briefing — and places determinism where
        consistency produces compounding — in grammar, gate, audit, and cut. A pipeline that
        is stochastic everywhere drifts; a pipeline that is deterministic everywhere
        suffocates. The 2/3/4/5 stochastic block is the Pane&rsquo;s creative interior; the
        1/6/7/8 deterministic frame is the Pane&rsquo;s grammar in production.
      </P>

      <H3El>What this enables</H3El>

      <P>
        With this pipeline a 2027-vintage AI ops layer can extend a Pane&rsquo;s grammar
        faithfully for years. The stochastic stages can be partially or fully automated; the
        deterministic stages remain human-run, because the deterministic stages are where
        the cosmology is defended. Hire prose stylists for stage four, gate referees for
        stage six, weight keepers for stage seven, and calendar editors for stage eight.
        The art commission lives at stage five and must remain human-led until the surface
        layer can be guaranteed at silhouette-glance scale by the production layer alone,
        which is not yet.
      </P>

      <H3El>What this refuses</H3El>

      <P>
        The pipeline refuses one-shot card creation. A card cannot be conceived end-to-end
        in a single brief. A card cannot bypass the gate because the schedule is tight. A
        card cannot ship without iceberg audit because the audit is what keeps the Pane
        coherent. The pipeline is the production-layer enforcement of the doctrine; without
        it, the doctrine is a poster.
      </P>
    </section>
  );
}
