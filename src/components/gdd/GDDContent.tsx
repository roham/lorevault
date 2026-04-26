import { HeroIllustration } from '@/components/gdd/HeroIllustration';
import { ScreenshotSlot } from '@/components/gdd/ScreenshotSlot';

// ─── Shared style helpers ────────────────────────────────────────────────────

const SECTION_NUM = {
  fontFamily: 'var(--font-baker-street), serif',
  color: '#6B8FA8',
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: '0.4rem',
  opacity: 0.8,
};

const SECTION_H2 = {
  fontFamily: 'var(--font-pullquote), Georgia, serif',
  fontStyle: 'italic',
  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
  color: '#e8e0d0',
  lineHeight: 1.15,
  marginBottom: '0.5rem',
  marginTop: '0',
};

const SECTION_UNDERLINE = {
  height: '2px',
  background: 'linear-gradient(90deg, #C9A26B 0%, transparent 100%)',
  marginBottom: '2rem',
  width: '8rem',
  opacity: 0.7,
};

const H3 = {
  fontFamily: 'var(--font-pullquote), Georgia, serif',
  fontStyle: 'italic',
  fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
  color: '#C9A26B',
  lineHeight: 1.25,
  marginTop: '2.5rem',
  marginBottom: '0.75rem',
};

const BODY_P = {
  fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
  fontSize: '1rem',
  lineHeight: 1.72,
  color: '#d8cfc0',
  marginBottom: '1.25rem',
  maxWidth: '65ch',
};

const PULLQUOTE = {
  fontFamily: 'var(--font-pullquote), Georgia, serif',
  fontStyle: 'italic',
  fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
  color: '#C9A26B',
  lineHeight: 1.5,
  borderLeft: '3px solid #C9A26B',
  paddingLeft: '1.5rem',
  margin: '2rem 0',
  opacity: 0.95,
};

const SIDENOTE = {
  fontFamily: 'var(--font-baker-street), serif',
  fontSize: '0.78rem',
  color: '#6B8FA8',
  lineHeight: 1.55,
  fontStyle: 'italic',
};

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-6 mt-16">
      <span style={SECTION_NUM}>{num}</span>
      <h2 style={SECTION_H2}>{title}</h2>
      <div style={SECTION_UNDERLINE} />
    </div>
  );
}

function H3El({ children }: { children: React.ReactNode }) {
  return <h3 style={H3}>{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={BODY_P}>{children}</p>;
}

function PQ({ children }: { children: React.ReactNode }) {
  return <blockquote style={PULLQUOTE}>{children}</blockquote>;
}

// Palette chip helper
function Chip({ label, hex }: { label: string; hex: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(201,162,107,0.2)',
        borderRadius: '2px',
        padding: '0.1rem 0.5rem',
        fontSize: '0.78rem',
        fontFamily: 'monospace',
        color: '#C9A26B',
        marginRight: '0.5rem',
        marginBottom: '0.3rem',
        whiteSpace: 'nowrap' as const,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '2px',
          background: hex,
          border: '1px solid rgba(255,255,255,0.15)',
          flexShrink: 0,
        }}
      />
      <strong style={{ color: '#e8e0d0', fontWeight: 600 }}>{label}</strong>{' '}
      <span style={{ opacity: 0.7 }}>{hex}</span>
    </span>
  );
}

// Parallel eligibility table
function ParallelTable() {
  const rows = [
    { label: 'base (PRIME-art)', common: true, rare: true, legendary: true, ultimate: true },
    { label: 'ARCANA', common: false, rare: true, legendary: true, ultimate: true },
    { label: 'AETHER', common: false, rare: true, legendary: true, ultimate: true },
    { label: 'WITNESS', common: false, rare: true, legendary: true, ultimate: true },
    { label: 'NEON', common: false, rare: true, legendary: true, ultimate: true },
    { label: '1/1 ONE-OFF', common: false, rare: false, legendary: false, ultimate: true },
  ];
  const tdStyle = {
    padding: '0.5rem 1rem',
    borderBottom: '1px solid rgba(201,162,107,0.1)',
    color: '#d8cfc0',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
    textAlign: 'center' as const,
  };
  const thStyle = {
    ...tdStyle,
    color: '#C9A26B',
    fontWeight: 600,
    textAlign: 'left' as const,
  };
  return (
    <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(201,162,107,0.3)' }}>
            <th style={{ ...thStyle, textAlign: 'left' }}>Parallel</th>
            <th style={thStyle}>Common</th>
            <th style={thStyle}>Rare</th>
            <th style={thStyle}>Legendary</th>
            <th style={thStyle}>Ultimate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 600, color: '#C9A26B' }}>
                {r.label}
              </td>
              <td style={tdStyle}>{r.common ? '✓' : '✗'}</td>
              <td style={tdStyle}>{r.rare ? '✓' : '✗'}</td>
              <td style={tdStyle}>{r.legendary ? '✓' : '✗'}</td>
              <td style={tdStyle}>{r.ultimate ? '✓' : '✗'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main GDDContent component ───────────────────────────────────────────────

export function GDDContent() {
  return (
    <>
      {/* ─── Section 1: The Two Nouns ─────────────────────────────────────── */}
      <section id="section-1">
        <SectionHeader num="§ 1" title="The Two Nouns" />

        <PQ>
          Every figure you half-remember is a figure with a Spine. The Lampblack is what proves they are.
        </PQ>

        <P>
          LoreVault is an illustrated trading-card multiverse built from public-domain literature.
          Sherlock Holmes deduces; Persephone descends; the Wolf comes to the door; Alice falls;
          Dracula is found out. These are not characters borrowed from somewhere else. They are figures
          held in common, returned to circulation, painted at MTG-mythic density and written at Pratchett
          caliber. The product is built on one cosmological premise, two proper nouns, and three
          load-bearing laws — and everything else that ships descends from them.
        </P>

        <P>
          The first noun is <strong style={{ color: '#C9A26B' }}>the Lattice</strong>. The Lattice is
          the geometry of the multiverse. Every story humans have ever told that survived into the public
          domain is a single, fragile, finite reality cut from older glass — what we call a{' '}
          <em>Pane</em>. The character you know is a figure caught mid-gesture inside one Pane. The same
          figure exists in other Panes, frozen in different gestures, wearing different chassis (different{' '}
          <em>Shells</em>), but always recognisably itself. There is no Earth-Prime. There is no canonical
          Sherlock. Each shell is equally real. The Lattice is the architecture inside which Holmes-PRIME
          and Holmes-CYBER and Holmes-SAINT all exist as siblings rather than as adaptations of a master
          copy.
        </P>

        <P>
          The second noun is <strong style={{ color: '#C9A26B' }}>Lampblack</strong>. Lampblack is the
          residue burned off when one Pane brushes against another. A drop of Lampblack on a Pane is what
          lets a Victorian Sherlock recognise a robot Sherlock as kin and not as costume. It is the
          Lattice&rsquo;s only physics. We will not invent a second. Lampblack is what the gold-cased
          pocket-watch carries when it appears in three Sets across two Universes. It is what the
          deerstalker silhouette carries when it surfaces, hatless-and-faceless, in the Black Forest at
          dusk. It is what the half-tooth carries when the Wolf returns in HOLLOW shell after the burn.
          Lampblack is residue in origin but force in effect — a pressure one Pane exerts on its nearest
          counterparts through accumulated contact.
        </P>

        <P>
          Three laws govern. The first, <strong style={{ color: '#C9A26B' }}>the Spine</strong> — every
          figure has a non-negotiable beat-list they must enact, in every shell, or they stop being that
          figure. Sherlock&rsquo;s Spine: <em>deduces, falls, returns, refuses domesticity.</em>{' '}
          Alice&rsquo;s Spine: <em>crosses a threshold, distrusts size, accepts nonsense as law, walks
          back unchanged in form but changed in seeing.</em> Dracula&rsquo;s Spine:{' '}
          <em>is found out.</em> The second,{' '}
          <strong style={{ color: '#C9A26B' }}>the Lampblack</strong> — cross-Pane recognition is
          communicated through visible residue: a recurring symbol, prop, line, or scar that survives
          translation. The third,{' '}
          <strong style={{ color: '#C9A26B' }}>Panes Touch, They Do Not Merge</strong> — there is no
          canonical universe and no Crisis-style collapse.
        </P>

        <P>
          The cosmology reveals on a fixed ratio — the Iceberg, 1:2:4 (see §7) — and is enforced by a
          Canon Council that overrides the founder. The Three Laws are <em>felt</em>, never{' '}
          <em>stated</em>, until at least Year 3. The Lattice&rsquo;s first principle is that every fact
          named narrows the multiverse, and every visible-edge-of-the-unsaid enlarges it.
        </P>

        <P>
          Two nouns hold the geometry. Three laws hold the physics. Everything below — the Shells,
          the Parallels, the Tiers, the packs, the ratio, the Council — descends from those five facts
          and adds nothing the cosmology did not already imply.
        </P>

        <HeroIllustration prompt="A vertical 2:3 oil-painted illustration in the late-19th-century academic-realist register, Bouguereau and Alma-Tadema mid-tones with Caspar David Friedrich atmospheric depth, William Blake's mystical line under Mary Blair compositional poise. Five interlocking stone doorway-arches arranged in a pentagram with no center, each arch containing a different threshold: gas-lit Baker Street fog, a Black Forest at dusk, an impossible-perspective hedge-maze, a Carpathian storm above ruined battlements, an asphodel-meadow under wine-dark sky. Soft ink-soot residue drifts between the arches in the same drift-vector across all five — the Lampblack visibly traveling. The empty center implies a sixth Pane that does not exist. No figures, no text, no central focal point — the eye must move between arches. Jewel-tone palette: gaslight-sepia, forest-green, pinafore-blue, ship-tar-black, bronze-on-cream. Mucha decorative restraint at the corners; Burne-Jones hush throughout." />

        <ScreenshotSlot route="/v3/home" />
      </section>

      {/* ─── Section 2: The Five Panes ────────────────────────────────────── */}
      <section id="section-2">
        <SectionHeader num="§ 2" title="The Five Panes" />

        <P>
          Series 1 ships five permanent Universes, locked, and they are deliberately the five
          most-recognisable Panes in the public-domain canon. Recognition is the point. Lampblack only
          resonates against figures the audience already knew before they got here. The first job of a
          multiverse property is to be legible at the threshold; the second is to deepen on return. The
          five Panes share a common chassis (eight Shells, five Parallels, four Tiers) but each speaks a
          different literature, holds a different cosmological role, and renders in a palette no other Pane
          is allowed to use.
        </P>

        <H3El>2.1 Baker Street — the Pane of Argument</H3El>

        <P>
          Baker Street is the Lattice&rsquo;s prosecuting attorney. Its cosmological role is to test
          reality against logic and force it to confess. Every other Pane has gods, monsters, fairies, or
          fates; this one has a man with a magnifying lens, a friend with a service revolver, and a method
          that pretends the universe is solvable. Holmes is the Lattice&rsquo;s epistemologist — the
          figure who arrives at every other Pane to ask, <em>How do you know?</em>
        </P>

        <P>
          The palette is locked to seven anchor colors:{' '}
          <Chip label="Gaslight Sepia" hex="#C9A26B" />{' '}
          <Chip label="Persian-Slipper Amber" hex="#B5651D" />{' '}
          <Chip label="Fog-Blue" hex="#6B8FA8" />{' '}
          <Chip label="Deduction-Sharp White" hex="#F4F0E6" />{' '}
          <Chip label="Reichenbach Black" hex="#1B1814" />{' '}
          <Chip label="Tobacco-Stain Brown" hex="#5C3A1E" />{' '}
          <Chip label="Blood-Pearl" hex="#8B1A1A" />
          {' '}(used sparingly — never more than 5% of any composition). The biome library is gas-lamp
          London by way of Sidney Paget&rsquo;s 1891 <em>Strand</em> plates, Frederic Dorr Steele&rsquo;s
          1903 <em>Collier&rsquo;s</em> covers, and Frank Wiles&rsquo;s 1914 cinematic framing. The voice
          register is forensic-confessional, Watson chronicling:{' '}
          <em>&ldquo;It was the November of &lsquo;94. I had not understood him at the time.&rdquo;</em>{' '}
          The Lampblacker-Spine for Baker Street is{' '}
          <strong style={{ color: '#C9A26B' }}>Hester Quill</strong>, the female clerk whose
          Spencerian-cipher initials appear in the margins of every Holmes case.
        </P>

        <HeroIllustration prompt="A single Baker Street card in editorial-illustration jewel-tone register — Sidney Paget cross-hatched ink-line as substrate, Frederic Dorr Steele 1903 gas-amber-and-fog-blue color over the top, Frank Wiles 1914-15 cinematic framing. Holmes silhouette under a single gaslamp at the corner of Marylebone Road, Persian-slipper amber on wet cobble, fog-blue diffuse beyond. The deerstalker is in shadow; the lens at his hip catches one point of deduction-sharp-white light. A faint ink-blot Spencerian cipher 'HQ' nests at the lower right of the frame as Lampblack residue from Hester Quill, Baker Street's Lampblacker-Spine. Reichenbach-black void to the figure's left. Painterly-not-photographic, William Blake mystic line meeting Mary Blair compositional clarity. No text on card." />

        <H3El>2.2 Enchanted Kingdom — the Pane of Inheritance</H3El>

        <P>
          The Enchanted Kingdom is the Pane through which generational consequence flows. It is where the
          Lattice keeps its bloodlines, its curses, and its unpaid debts. Stepmothers, wolves, and witches
          in this Pane carry full Spines because every act here is <em>justified by its own logic</em> —
          survival logic, hunger logic, the morality of what gets eaten. The wolf is right to be hungry;
          the stepmother is right to be jealous; the cards are not asking you to forgive either of them,
          only to recognise them.
        </P>

        <P>
          The register is <strong style={{ color: '#C9A26B' }}>Black/Green</strong> — black for the iron,
          the soot, the closed eye behind glass; green for the moss, the foxglove, the pine-needle floor
          of the Schwarzwald, the witch&rsquo;s herb-rope. The palette anchors on{' '}
          <Chip label="Forest-green" hex="#2C3A23" />{' '}
          <Chip label="Apple-red oxblood" hex="#7A1F1F" />{' '}
          <Chip label="Iron-black" hex="#0F1112" />{' '}
          <Chip label="Ash-grey" hex="#9C9388" />{' '}
          <Chip label="Candle-amber" hex="#D9A648" />{' '}
          <Chip label="Glass-blue" hex="#7FA9C4" />{' '}
          <Chip label="Foxglove-violet" hex="#553A6B" />
          . Pre-Disney darkness is mandatory; the 1812 Grimm is the textual seam. The Lampblacker-Spine is{' '}
          <strong style={{ color: '#C9A26B' }}>The Charcoal-Burner&rsquo;s Daughter</strong>, the woman
          who gathers lampblack soot from the kiln-walls and grinds it into the ink with which she draws
          the Forest&rsquo;s maps.
        </P>

        <HeroIllustration prompt="A single Enchanted Kingdom card in tipped-in-plate jewel-tone register, Arthur Rackham 1909 cross-hatched ink under sepia + Kay Nielsen 1925 Aubrey-Beardsley-Japanese-woodblock geometry + Franz Jüttner 1905 oil-paint depth + Hermann Vogel 1894 Schwarzwald atmosphere. The Charcoal-Burner's Daughter at her kiln in the deep Black Forest at dusk: weathered mid-thirties woman, ink-stained hands, leather satchel of folded vellum at her hip, a single eagle-feather quill behind her ear. She is unrolling a map showing the Wolf's path through the wood. Iron-black + ash-grey + candle-amber palette; oxblood-red bramble in the foreground; a Lampblack-twig set-glyph in the lower right corner. Vogel cross-hatched Black Forest rises behind her; a bitten apple and a single white feather rest at her feet as residue. William Blake mystic restraint, Mary Blair flat compositional grace, Mucha border ornament. Painterly-not-photographic. No Disney chromatic anywhere." />

        <H3El>2.3 Wonderland — the Pane of Categorical Failure</H3El>

        <P>
          Wonderland is the Lattice&rsquo;s fault zone. The categories that hold every other Universe
          together — <em>size</em>, <em>time</em>, <em>cause</em>, <em>identity</em> — stop holding here.
          Other Panes obey local canonical physics; Wonderland obeys nothing. Its only law is that every
          law is suspect, and the suspicion is dispatched in courtroom register, by figures who use
          jurisprudence to certify that nothing can be certified. The Pane is rendered Discworld-adjacent
          in its self-awareness but never Pratchett-cosplay; it is wit, not joke, and the difference is
          load-bearing.
        </P>

        <P>
          The primary triad is locked:{' '}
          <Chip label="Pinafore-blue" hex="#1F3A6B" />{' '}
          <Chip label="Apron-white" hex="#F4EFE3" />{' '}
          <Chip label="Rose-red" hex="#B8252A" />
          . Secondaries include{' '}
          <Chip label="Tea-stain amber" hex="#9E6A2C" />{' '}
          <Chip label="Cheshire-pink" hex="#D77A8E" />{' '}
          <Chip label="Looking-Glass silver" hex="#9DA4A8" />
          . The Lampblacker-Spine is{' '}
          <strong style={{ color: '#C9A26B' }}>The Glass-Polisher</strong>, voiced as the{' '}
          <strong style={{ color: '#C9A26B' }}>Court Recorder of Hearts</strong> — the figure who cleans
          the Looking-Glass and is the only one who knows it&rsquo;s two-way.
        </P>

        <HeroIllustration prompt="A single Wonderland card in Tenniel 1865 wood-engraved linework over impossible-color saturation, with Arthur Rackham 1907 sepia-art-nouveau watercolor as middle layer and Charles Robinson 1907 cream-and-vermilion accent. Alice mid-fall past the bookshelves of the Rabbit-Hole, pinafore-blue against apron-white cream-rag substrate, rose-red of a falling jam-tart inside the frame. The descent's horizon is the page-margin; light source is the diminishing daylight overhead. A pocket-watch with too many hands tumbles past her, Hatter's '10/6' card adjacent. The Glass-Polisher's hand reaches in from the bottom margin holding a polishing-cloth, half-implied — Lampblack residue from the Court Recorder of Hearts. Italics on the falling jar's labels marking categorical words as suspect. Victorian wood-engraver display typography in the corners. No Disney magenta-fuchsia anywhere. William Blake mysticism meets Mary Blair compositional flatness, Mucha frame restraint." />

        <H3El>2.4 Gothic Horror — the Pane of Transformation</H3El>

        <P>
          Gothic Horror holds the Lattice&rsquo;s body-horror archive. Every figure here has a body that
          has stopped being theirs — Dracula&rsquo;s no longer ages and no longer reflects; the
          Creature&rsquo;s was never one body to begin with; Mina&rsquo;s carries the wafer-burn at the
          forehead; Jekyll&rsquo;s becomes Hyde&rsquo;s at the cost of a salt; Erik&rsquo;s has the
          death&rsquo;s-head face beneath the mask. The single doctrinal line is:{' '}
          <em>the body as betrayer; the mirror that fails; the ledger that survives the wreck</em>.
        </P>

        <P>
          The palette is the Lattice&rsquo;s only true chiaroscuro Pane:{' '}
          <Chip label="Ship-tar Black" hex="#0A0908" />{' '}
          <Chip label="Whitby-cliff Grey" hex="#4A4E51" />{' '}
          <Chip label="Geneva-glacier Blue" hex="#6E8FA3" />{' '}
          <Chip label="Carfax Bronze-tarnish" hex="#6F4F1F" />{' '}
          <Chip label="Candle-Amber" hex="#D9A24E" />{' '}
          <Chip label="Demeter Crimson" hex="#7B1E1E" />{' '}
          <Chip label="Sulphur-Yellow" hex="#C9B43A" />
          {' '}(reserved for the Creature&rsquo;s eye and the elixir phial only). The Lampblacker-Spine is{' '}
          <strong style={{ color: '#C9A26B' }}>Asha Caedmon</strong>, the Ledger-Keeper of Whitby —
          pulled from the <em>Demeter</em> wreck as a child in 1897, raised in the Whitby Abbey ruin.
        </P>

        <HeroIllustration prompt="A single Gothic Horror card in editorial-illustration register: Theodor von Holst 1831 Frankenstein frontispiece moonlight + Caspar David Friedrich Wanderer Above the Sea of Fog atmosphere + Harry Clarke 1919 stained-glass linework + Sidney Sime ink-and-wash + Beardsley black-line decadence at the corners + Doré Inferno chiaroscuro depth. Asha Caedmon at her desk in the Whitby Abbey ruin: mid-thirties, ink-stained fingertips, candle-amber light from a single brass lamp, a leather-bound ledger with brass-clasp open before her. Geneva-glacier-blue rain on the cliff-glass at her shoulder. Whitby-cliff-grey stone wall behind. The broken-mirror-shard Pane-anchor glyph reflects no figure in a small frame on the wall. Ship-tar-black field; Demeter-crimson sealing-wax on a folded letter. A faint widow's-peak silhouette and a flat-skull silhouette are visible inside the silvering of the broken mirror as 2027 Liberation Drop foreshadow. William Blake mystic restraint; Mary Blair flat compositional poise; Mucha cornering." />

        <H3El>2.5 Greek Myth — the Pane of Fate</H3El>

        <P>
          Greek Myth is the Pane where the gods themselves carry the debt. Here, Zeus owes Demeter a
          daughter; Hades owes Persephone six months; Prometheus owes the eagle a liver every dawn;
          Sisyphus owes the stone the slope, in perpetuity. Every Greek Myth Moment must read as the
          inside of a ledger that began before the figure was born and continues after. The register splits{' '}
          <strong style={{ color: '#C9A26B' }}>White and Red</strong> — White for the marble-and-libation
          register; Red for the pottery-and-blood register.
        </P>

        <P>
          The palette anchors on{' '}
          <Chip label="Bronze (Riace patina)" hex="#7A6A3F" />{' '}
          <Chip label="Wine-dark sea" hex="#3B2A4A" />{' '}
          <Chip label="Pottery red ground" hex="#A14B2C" />{' '}
          <Chip label="Persephone-pomegranate-red" hex="#7E0F1B" />{' '}
          <Chip label="Chiton-white" hex="#F1ECE0" />{' '}
          <Chip label="Mediterranean sun-gold" hex="#E6C26E" />{' '}
          <Chip label="Tyrian purple" hex="#3E1C46" />
          . The voice is bronze-tongue, dactylic-hexameter Hesiod-cadence. The banned word is{' '}
          <em>destiny</em> — we use <em>moira</em>. The Lampblacker-Spine is{' '}
          <strong style={{ color: '#C9A26B' }}>Melaina</strong>, the Pythia&rsquo;s Apprentice.
        </P>

        <HeroIllustration prompt="A single Greek Myth card in full register-stack: Bouguereau 1879 Birth of Venus warmth + Waterhouse atmospheric single-figure + Bernini Apollo-and-Daphne marble photo-real + Caravaggio 1597 Medusa shield chiaroscuro + Burne-Jones Perseus-cycle Symbolist density + classical Riace-bronze tactile-marble + Athenian red-figure pottery line at the corners + Byzantine gold-leaf ground-field accent. Melaina at the Delphi tripod, stoichedon-grid all-capitals inscription rendered into chiton-white pentelic stone behind her. The Pythia (older, veiled) in profile breathing the smoke from the chasm. Melaina (younger, attentive, ink-stained from a wax tablet) at the Pythia's right hand, listening, ready to carry. Bronze-Riace-patina + wine-dark-sea + persephone-pomegranate-red + chiton-white palette. Olive-branch crossed over fluted Doric column glyph in the lower right. The smoke is faintly Lampblack-residue-textured. William Blake mystic line; Mary Blair flat poise; Mucha border restraint. No Lore Olympus webtoon-flat anywhere. Painterly-not-photographic." />
      </section>

      {/* ─── Section 2.6: Navigation Architecture ────────────────────────── */}
      <section id="section-2-6">
        <P>
          The sections immediately below — Navigation Architecture and the 375px Constraint — are
          specification nodes, not cosmological ones. They belong in the editorial arc because the
          implementer and the designer must read them before building, and the GDD is the document
          both read first. Skip ahead to §3 if you are a collector, not a builder.
        </P>

        <H3El>2.6 Navigation Architecture — The Bottom-Tab Floor Plan</H3El>

        <P>
          The product navigates on four tabs. No more. The tab-bar is a floor plan, not a menu — it names
          the four things a collector does here, in the order they do them, without burying any of them
          behind a hamburger or a secondary drawer.
        </P>

        <P>
          The four tabs are <strong style={{ color: '#C9A26B' }}>Home</strong> (house icon),{' '}
          <strong style={{ color: '#C9A26B' }}>Collection</strong> (grid/binder icon),{' '}
          <strong style={{ color: '#C9A26B' }}>Open</strong> (pack icon), and{' '}
          <strong style={{ color: '#C9A26B' }}>Profile</strong> (person icon). There is no Market tab in
          the tab-bar. The marketplace is secondary navigation, reachable from a tap on any greyed-out gap
          slot in the sticker-book (see §2.7 for the gap-tap flow). Putting Market in the tab-bar would
          make the product feel like a trading desk the moment a new collector lands.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Home</strong> carries the hero drop card — the active
          Set&rsquo;s marquee Moment, displayed full-art — plus a countdown to the next storefront refresh
          and a scrollable feed of recently activated collectors: who pulled what, without dollar amounts,
          without P&L. It is the product&rsquo;s front window, not its dashboard.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Collection</strong> opens the sticker-book view by default,
          set to the current active Series. Progress reads as a fraction — &ldquo;12 of 20&rdquo; — above
          the grid. Cards the collector owns render full-art; cards they don&rsquo;t own render as grey
          silhouettes, present enough to register as shapes but absent enough to pull. Tapping a grey
          silhouette enters the buy flow for that Moment. This is the Zeigarnik mechanism — the gap does
          the work.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Open</strong> is the pack-picker landing. It is the ritual
          entry point: choose your Series, choose your Pane, choose your tier, confirm, rip. The full
          pack-rip ritual plays here, full-screen at every breakpoint, no modal, no sidebar (see §7.5 for
          the mobile-first constraint and §6.6 for the picker flow detail).
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Profile</strong> holds the collector&rsquo;s showcase —
          their highest-rarity pulls arranged as a gallery — plus their parallel-completion progress across
          all active Sets and any serial-number-set pursuits they have flagged.
        </P>

        <P>
          The bottom-tab bar respects iOS safe-area-inset-bottom on all devices. Active state renders in
          the Universe-accent color with a filled icon and a visible label. Inactive tabs render in muted
          grey with a visible label — never icon-only. On desktop the tab-bar collapses to a left-sidebar
          nav carrying the same four items in the same order. The following are banned from the tab-bar for
          the duration of Series 1: Market, Explore, Discover, Search.
        </P>

        <ScreenshotSlot route="/v3/open" />
      </section>

      {/* ─── Section 3: The Eight Shells ─────────────────────────────────── */}
      <section id="section-3">
        <SectionHeader num="§ 3" title="The Eight Shells" />

        <P>
          Eight Shells are locked across Series 1 through Series 6. Each is a chassis for the figure —{' '}
          <em>who they are</em>, not <em>how the painting reads</em>. Shells and Parallels (§4) are
          orthogonal axes. New Shells require unanimous Canon Council approval and a shipped justification
          doc — including for the founder.
        </P>

        <PQ>
          An octopus with a blue ribbon is not Alice. A hat-rack with a deerstalker is not Sherlock. A
          still-life of an apple on a plinth is not Snow White.
        </PQ>

        <P>
          <strong style={{ color: '#C9A26B' }}>PRIME</strong> is the figure in their canonical period,
          faithfully rendered, Spine fully present, no relocation. Victorian Sherlock; medieval Wolf; Bram
          Stoker&rsquo;s 1897 Dracula. PRIME is mandatory baseline — every figure ships PRIME first.
          Series 1 ships PRIME-only across all five Universes. The art density at PRIME is the
          canonical-illustrator inheritance.
        </P>

        <P>
          Eight Shells answer the question <em>who is the figure</em>. Four Tiers answer{' '}
          <em>how rare is the artifact</em>. The two axes are orthogonal and must not be conflated —
          a PRIME Holmes can ship at any Tier; an APEX pull is a Tier outcome, not a Shell. What
          follows is the eight-Shell roster; the Tier rubric is §5.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>LEGENDARY</strong> is the figure-in-defining-moment. Two
          per Set, 250 minted, ~3.5% of Set supply. Density is full jewel-tone plate, gold-leaf accents
          permitted, scale-contrast and chiaroscuro all stacked. The collector hangs the Legendary in their
          gallery; it is the canvas-print they want enlarged.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>APEX</strong> is the 1/1 ONE-OFF — one per Set, no
          exceptions, mint of one, the Pane&rsquo;s marquee. Bespoke per commission; no template; the
          doctrine: <em>this card has no frame; it is the frame</em>. The collector who pulls the ONE-OFF
          doesn&rsquo;t tweet about it — they screenshot it, then they sit with it.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>SAINT</strong> is the eighth proper Shell — the figure
          mythologised to god-tier within their own canon. Holmes-SAINT is Holmes-the-mythologized-detective-god,
          with halo as magnifying lens, calabash as crozier, gold-leaf-on-tobacco-brown panel.
          Alice-SAINT is the patron saint of those who fell down holes. Pre-Raphaelite reverence-pose,
          gold-leaf nimbus, name-banner above the head.
        </P>

        <P>
          The remaining four Shells — <strong style={{ color: '#C9A26B' }}>CYBER</strong> (cyberpunk
          relocation; rust-and-amber not neon-cyan, Series 2+),{' '}
          <strong style={{ color: '#C9A26B' }}>MODERN</strong> (today&rsquo;s urban world,{' '}
          <em>Veep</em>-grey realism, Series 2+),{' '}
          <strong style={{ color: '#C9A26B' }}>HOLLOW</strong> (post-apocalyptic, Gothic Horror&rsquo;s
          native, structurally banned for Wonderland),{' '}
          <strong style={{ color: '#C9A26B' }}>MIRROR</strong> (identity-inverted, only when the inversion
          is answered by a Spine-event, never just costume),{' '}
          <strong style={{ color: '#C9A26B' }}>DREAM</strong> (psychedelic-spiritual, Wonderland&rsquo;s
          home, structurally banned for Holmes by Spine) — round out the eight. Drop a Spine layer, drop
          the figure.
        </P>

        <HeroIllustration prompt="A horizontal compositional sweep in editorial-illustration jewel-tone register: eight cards in a row, each rendered at 2:3, each showing the same figure (Sherlock Holmes) across the eight Shells, William Blake mysticism meeting Mary Blair compositional restraint and Mucha decorative cornering. PRIME: 1881 Holmes at 221B fireplace, Paget cross-hatch + Steele gas-amber. CYBER: cyberdeck-running consultant Holmes in rust-and-amber server-room, Persian-slipper-shaped cooling-vent. MODERN: 2026 Holmes in Veep-grey realism, never blue-Belstaff, phone in hand. AETHER: Holmes-as-Reason-itself at constellation-vantage, aurora-cosmic palette over PRIME register, restrained. HOLLOW: 221B in ruin, deerstalker-shadow in ash, Holmes in greatcoat against a grey horizon. MIRROR: female-Sherlock register, Spine canon events preserved (the lens, the violin, the pocket-watch). DREAM: forbidden — rendered as a black void with the words 'Holmes refuses dream-logic' in Tenniel italic. SAINT: hagiographic icon, gold-leaf-on-tobacco-brown panel, magnifying-lens halo, calabash crozier, name-banner above head. The Spine-residues hold across all eight. Painterly-not-photographic." />

        <H3El>3.2 The Six Mid-Shells — Collector Registers</H3El>

        <P>
          <strong style={{ color: '#C9A26B' }}>CYBER</strong> is the near-future high-tech low-life
          chassis — rust-and-amber server-rooms, cyberdeck consoles, cooling-vents cast in the shape of
          recognisable props from the figure&rsquo;s PRIME period. The Spine-residue requirement: the
          deduction beat, the descent, the refusal of domesticity must survive translation into the silicon
          chassis — a Holmes who cannot deduce is not Holmes-CYBER, he is a costume. The collector who
          pulls a CYBER feels like finding out the detective still solves crimes in the rubble.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>MODERN</strong> is today&rsquo;s urban world in Veep-grey
          realism — no blue Belstaff, no glamorised contemporary styling, the figure rendered in the
          register of a 2026 Sunday supplement photograph. The Spine-residue requirement: the figure&rsquo;s
          foundational tension must read in a single glance, with no period costume to carry it. The
          collector who pulls a MODERN feels the figure arrive uninvited into the present tense.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>AETHER</strong> is the mythic-cosmic register, the
          Olympians&rsquo; native home — aurora-cosmic particulate, nebula-bleed at the corners, the figure
          at its furthest remove from the biographical and closest to the archetypal. The Spine-residue
          requirement: at least one canonical Spine-beat must be implied in the cosmic register, or the
          figure dissolves into decoration. The collector who pulls an AETHER feels the scale of the
          figure&rsquo;s debt — how long the debt has been running before any human story began.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>HOLLOW</strong> is the post-apocalyptic shell, Gothic
          Horror&rsquo;s native register — ruined biomes, ash-grey skies, the figure in survival posture
          with PRIME-era props eroded but recognisable. The Spine-residue requirement: the defining wound,
          the defining tool, or the defining relationship of the PRIME-period must be visible in some
          degraded form. The collector who pulls a HOLLOW feels the version of the story where the wrong
          person survived.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>MIRROR</strong> is the identity-inverted shell —
          gender- or role-flipped, but only when the inversion is answered by a Spine-event, never as
          costume. The Spine-residue requirement is the strictest of the six: every Spine-beat from the
          PRIME must be present in the inversion, or the card fails the commissioning check. A female
          Sherlock who does not deduce, fall, and refuse domesticity is not Holmes-MIRROR. The collector
          who pulls a MIRROR feels recognition without comfort.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>DREAM</strong> is the psychedelic-spiritual shell,
          Wonderland&rsquo;s home register — dissolution of category, impossible geometry, the figure
          operating in the logic of its own sleep. The Spine-residue requirement: at least one Spine-beat
          must survive the categorical dissolution, anchoring the figure&rsquo;s identity against the
          register&rsquo;s tendency to absorb everything into pattern. Dream is structurally banned for
          Holmes by Spine — Holmes&rsquo;s Spine requires deduction, and deduction requires stable
          categories. The collector who pulls a DREAM feels the figure unguarded, which is the rarest
          pull of the six.
        </P>
      </section>

      {/* ─── Section 4: The Five Parallels + ARCANA ──────────────────────── */}
      <section id="section-4">
        <SectionHeader num="§ 4" title="The Five Parallels + ARCANA Discipline" />

        <P>
          Parallels are the orthogonal artistic registers that cut across all Sets and all Universes. A
          Parallel is <em>how the painting reads</em>, not <em>who the figure is</em>. Five exist, one of
          which doubles as a discipline:{' '}
          <strong style={{ color: '#C9A26B' }}>ARCANA</strong>,{' '}
          <strong style={{ color: '#C9A26B' }}>AETHER</strong>,{' '}
          <strong style={{ color: '#C9A26B' }}>WITNESS</strong>,{' '}
          <strong style={{ color: '#C9A26B' }}>NEON</strong>, and{' '}
          <strong style={{ color: '#C9A26B' }}>1/1 ONE-OFF</strong> — with ARCANA additionally functioning
          as the lead-Parallel discipline for Series 1.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>ARCANA</strong> is sacred-geometry-as-frame. Four corner
          mandalas; alchemical-sigil margin overlay; cosmic aurora halo behind the figure&rsquo;s head.
          ARCANA is reserved for Rare+ Moments where the <em>binding</em> is the frame — the curse takes
          effect, the Witch&rsquo;s contract is signed.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>AETHER</strong> is aurora-cosmic register. Aurora-cosmic-particulate
          frame edge with 4-second drift, nebula-bleed at four corners. AETHER is reserved for Legendary+
          figures operating at cosmic scale. Native register for the Olympian dozen. The collector who
          pulls an AETHER feels the Pane&rsquo;s god-scale come up under their hand.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>WITNESS</strong> is photoreal time-travel — documentary
          cinema realism of the historical setting, Deakins/Lubezki register. Card-front rendered AS a
          log-page, journal-spread, telegram, phonograph-cylinder-transcript, sepia-aged paper with
          scanned-photo grain. The collector who pulls a WITNESS feels the figure was real, briefly,
          somewhere.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>NEON</strong> is the synthwave cyber reimagining. Paired
          with CYBER shell only — Series 2+ for most Universes. The collector who pulls a NEON feels the
          figure pulled forward into a register their canonical period never got to occupy.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>1/1 ONE-OFF</strong> is the bespoke, mint-one-of-one
          Parallel — Ultimate-tier only, four total per Universe per Series. The doctrine reads:{' '}
          <em>this card has no frame; it is the frame.</em>
        </P>

        <ParallelTable />

        <div style={{ ...SIDENOTE, borderLeft: '2px solid rgba(107,143,168,0.3)', padding: '0.75rem 1rem', margin: '1rem 0' }}>
          <em>
            Pack odds for Parallels: roughly 1 in every 40 packs contains one Parallel card. Distribution
            within that is weighted ARCANA 50% / AETHER 25% / WITNESS 15% / NEON 10%. ONE-OFFs are not in
            packs — they drop as separate curated offerings.
          </em>
        </div>

        <ScreenshotSlot route="/v3/collection/parallels" />
      </section>

      {/* ─── Section 5: The Four Tiers ───────────────────────────────────── */}
      <section id="section-5">
        <SectionHeader num="§ 5" title="The Four Tiers + Art-Density Rubric" />

        <P>
          Four Tiers, locked:{' '}
          <strong style={{ color: '#C9A26B' }}>I (Common)</strong>,{' '}
          <strong style={{ color: '#C9A26B' }}>II (Rare)</strong>,{' '}
          <strong style={{ color: '#C9A26B' }}>III (Legendary)</strong>,{' '}
          <strong style={{ color: '#C9A26B' }}>VOID (Ultimate)</strong>. Every Set ships 12 Common + 5
          Rare + 2 Legendary + 1 Ultimate = 20 Moments. Mint counts: Common 15,000; Rare 2,500; Legendary
          250; Ultimate 25. Total base supply per Set: 193,025 cards. With Parallels layered on top of
          Rare+ Moments, the catalog grows to 1,200 distinct entries for Series 1.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Tier I — Common</strong> is the breadcrumbs of the Pane.
          Density rubric: single-figure-or-prop, plain composition, low atmosphere, ≤4 cinematic
          techniques. Background fill ≤30%; figure count 1. The Common is the floor. Nothing below it
          ships.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Tier II — Rare</strong> is the named scenes. Density
          rubric: figure-with-environment OR figure-with-prop, three-tone palette including one full anchor
          color, ≤8 cinematic techniques. Background fill 50–60%; figure count 1–2. The Rare is where the
          Pane&rsquo;s relational geometry first appears — the dyad cards, the antagonist-shadow cards.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Tier III — Legendary</strong> is the plates the fans frame.
          Density rubric: full jewel-tone plate; full palette deployed; gold-leaf accents permitted; ≤14
          cinematic techniques. Background fill 70–85%; figure count 2–4. The Legendary is the
          canvas-print the collector hangs.
        </P>

        <PQ>
          Tier VOID — the Ultimate — is the founding plate of the Set. One per Set; 0.5% of supply. Density
          rubric: full cinematic deployment — Drew Struzan compositional gravity + Caspar David Friedrich
          Rückenfigur + Jeremy Jarvis card-art finish ceiling. Background fill 90%+; figure count 3–6.
          Always-on Lampblack-cosmic-cascade glow.
        </PQ>

        <ScreenshotSlot route="/v3/collection" />
      </section>

      {/* ─── Section 6: The Pack Ladder ──────────────────────────────────── */}
      <section id="section-6">
        <SectionHeader num="§ 6" title="The Pack Ladder" />

        <P>
          Five pack tiers stratify depth-of-spend from $0 to $999. Each pack is a ritual, not a
          transaction. Each carries a length, a card-count, a shell-weight guarantee, a visual treatment,
          and a buyer.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>$0 Sample — 4 seconds, 1 Common.</strong> Free. Issued
          weekly to active users; consumed by the reading-pact ticket. The wax-seal cracks at 0.5s; the
          card slides face-up into the binder slot at 1s; the Lampblack-glow plus flavor-text fade-in
          completes at 4s. No narrator voice-over. The Sample buyer is the lapsed-reactivation user, the
          Day-1 visitor, the BookTok refugee who came for the screenshot. The Sample is the door.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>$9 Standard — 8 seconds, 3 Moments.</strong> Weighted-random
          Common-heavy: typically 2 Common + 1 Rare. The final Rare gets the 8-second Lampblack-settle
          ritual: full Pane-environment ambience drops in, residue particle drift across the full screen,
          narrator&rsquo;s single-word murmur at 4s (<em>&ldquo;there&rdquo;</em>,{' '}
          <em>&ldquo;so&rdquo;</em>, <em>&ldquo;again&rdquo;</em>), card-glow lift at 6s.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>$49 Curated — 12 seconds, 5 Moments, ≥1 Rare guarantee.</strong>{' '}
          The Curator commentary unlocks here — the Pane&rsquo;s Lampblacker-Spine appears as a 2-line
          text overlay above the highest-rarity card. This is the only pack-tier where the Spine speaks.
          Live-stream eligible.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>$199 Premium — 18 seconds, 6 Moments, ≥1 Legendary guarantee.</strong>{' '}
          The 18-second Lampblack-settle on the Legendary. Council seat 1 appears as text-overlay
          confirmation moment: <em>&ldquo;This is the [name] from [Set]. It carries the Lampblack of
          [tether]. It is the first of 100 minted at this rarity.&rdquo;</em> Pre-loaded share-pack with
          auto-generated screenshot designed for social emission.
        </P>

        <PQ>
          $999 Apex — 30 seconds, 7 Moments, ≥1 Legendary + 1 guaranteed Parallel + 10% Ultimate shot +
          1% Mythic/ONE-OFF chase. Apex packs cap at 100 per Series — 1,000 buyers compete to be in the
          first 100. The Apex buyer is buying not the card but the moment they pulled it.
        </PQ>

        <HeroIllustration prompt="An editorial-illustration jewel-tone painting of the pack-ritual moment: a five-step ladder rendered as a single composition. At the bottom, a wax-sealed envelope (Sample, $0) glows softly amber, just starting to crack. Above it, three cards mid-reveal under cello-drone (Standard, $9), Lampblack-residue trailing between them. Above that, five cards arranged in fan with the Lampblacker-Spine's hand entering the frame from the bottom margin holding a curator's note (Curated, $49). Above that, six cards with one Legendary central, glowing white-pulse, Council-seat text-overlay caption appearing in 12px small-caps margin (Premium, $199). At the top, seven cards with one Ultimate at center, Lampblack-cosmic-cascade radiating, the broken-mirror-shard glyph reflecting all five Panes inside the silvering, a narrator-voiced caption '...there...' visible (Apex, $999). The whole composition reads as a 19th-century Salon-painting altarpiece: gilt-framed corners, Whistler-velvet backdrop, Mucha decorative borders, William Blake mystical light. The five tiers stack vertically. The viewer's eye climbs. Painterly-not-photographic." />

        <ScreenshotSlot route="/v3/storefront" />

        <H3El>6.6 The Pack-Picker Landing Flow</H3El>

        <P>
          The pack-picker is the user&rsquo;s first meaningful decision after account creation. Everything
          before it — signup, onboarding prompt, Pane-selection question — is orientation. The picker is
          the first moment the product asks the collector to commit to something, and it is designed to feel
          like a choice made by instinct, not by analysis.
        </P>

        <P>
          The flow moves through six states: Landing state, Active-Series selector, Pane-picker, Pack-tier
          selector, Confirmation screen, and Ritual entry. The Landing state presents the picker with the
          question unprompted — &ldquo;Pick the pack that calls to you&rdquo; — above a row of five packs.
          Each pack shows a character thumbnail, the Universe color behind it, and one line of lore tease.
          Nothing else. No odds. No pull rates. No &ldquo;most popular&rdquo; badge.
        </P>

        <P>
          The five lore teases that greet the new collector are written in the Lampblacker-Spine&rsquo;s
          voice — one line per Pane.{' '}
          <strong style={{ color: '#C9A26B' }}>Hester Quill</strong> for Baker Street, the{' '}
          <strong style={{ color: '#C9A26B' }}>Charcoal-Burner&rsquo;s Daughter</strong> for Enchanted
          Kingdom, the{' '}
          <strong style={{ color: '#C9A26B' }}>Glass-Polisher / Court Recorder of Hearts</strong> for
          Wonderland, <strong style={{ color: '#C9A26B' }}>Asha Caedmon</strong> for Gothic Horror,{' '}
          <strong style={{ color: '#C9A26B' }}>Melaina</strong> for Greek Myth. The lines are the
          Spine&rsquo;s native register — forensic, bone-rhyme, Liddell-logic, clinical, bronze-tongue.
        </P>

        <P>
          The onboarding pack is Standard tier at $9 and it is rigged in one specific way: it guarantees
          one Rare from the collector&rsquo;s chosen Pane. The guarantee is not disclosed before the rip.
          It is disclosed after — as a brief text overlay, signed by the Pane&rsquo;s Lampblacker-Spine,
          after the Rare card settles. The disclosure after is the gift; the disclosure before would make
          it a transaction.
        </P>

        <P>
          After the first pack rip, the cards land in Collection with an &ldquo;added to your binder&rdquo;
          toast. The collector&rsquo;s sticker-book renders immediately with 1 of 20 filled and 19 grey
          silhouettes waiting. The picker flow is activation, not education. The Lattice doctrine is
          deferred to the first Sunday Lampblack Tally email, which arrives three days after signup. The
          product earns the doctrine by making the first rip feel right. Doctrine earned is doctrine held.
        </P>

        <ScreenshotSlot route="/v3/welcome/pick" />
      </section>

      {/* ─── Section 7: The Iceberg Doctrine ─────────────────────────────── */}
      <section id="section-7">
        <SectionHeader num="§ 7" title="The Iceberg Doctrine" />

        <PQ>
          For every unit of Surface, ship two units of Echo and gesture toward four units of Deep.{' '}
          <strong>1:2:4.</strong> This is the doctrine; this is the audit.
        </PQ>

        <P>
          The Iceberg is the rate-limiter that prevents the Lattice from collapsing into soup. At any
          moment in LoreVault&rsquo;s life, the audience can perceive three layers of the cosmology —
          the <strong style={{ color: '#C9A26B' }}>Surface</strong> (what is shipped and explained), the{' '}
          <strong style={{ color: '#C9A26B' }}>Echo</strong> (what is shipped and unexplained), and the{' '}
          <strong style={{ color: '#C9A26B' }}>Deep</strong> (what is referenced but never shown). The
          ratio is fixed: <strong style={{ color: '#C9A26B' }}>1:2:4</strong>. The Council enforces it
          quarterly. Any quarter that breaches is failed; Sets hold until correction. Series 1 caps at 12
          Echo + 24 Deep across 12 Sets.
        </P>

        <P>
          The 1:2:4 ratio is not a marketing flourish. It is the mechanism by which the Lattice stays
          bigger than what we have shown. Tolkien&rsquo;s appendices (vast unwritten history glimpsed
          through footnotes), Le Guin&rsquo;s anthropological reticence (the Hainish are not explained),
          Miyazaki&rsquo;s no-exposition entry (Totoro is never explained, and the absence is the asset)
          — these are the lineages we descend from. The opposite lineage — Pottermore-style
          expansion-by-decree, &ldquo;actually, Sherlock has always been left-handed&rdquo; press
          releases, the Wiki-as-truth — is what we structurally refuse.
        </P>

        <P>
          The Surface gives the new collector a footing. The Echo gives the returning collector a chord.
          The Deep gives the completist a forever. The 1:2:4 ratio is what makes the multiverse legible at
          thumbnail and inexhaustible at gallery.
        </P>

        <HeroIllustration prompt="An editorial-illustration jewel-tone diagram in the register of a 19th-century scientific plate: an iceberg seen in cross-section, the waterline horizontal across the middle of the composition. Above the waterline (Surface), 1 small white card-tip showing a clear figure — Holmes with his lens. Just below the waterline (Echo), 2 medium-sized card-shapes visible through translucent water — both showing related residues: an albumen-print, the same lens cracked at 8 o'clock. Deep below (Deep), 4 larger card-shapes barely visible in dark water — each is a different Universe's tether (a Cheshire-grin in EK fog, a smudge of soot in the Greek pottery, a ledger-page, a Reichenbach mist). Faint Lampblack-residue particles drift between all seven cards, connecting them. William Blake mystical line; Mary Blair compositional flatness; Mucha decorative cornering. Caspar David Friedrich seascape atmosphere. Painterly-not-photographic, jewel-tone palette of fog-blue and tobacco-brown and gold-leaf accents. No text on the diagram itself; the scale of submersion does the explaining." />
      </section>

      {/* ─── Section 7.5: The 375px Constraint ───────────────────────────── */}
      <section id="section-7-5">
        <P>The specification continues below for implementers.</P>

        <H3El>7.5 The 375px Constraint — Mobile-First Without Apology</H3El>

        <P>
          The primary viewport is 375px. Every surface in LoreVault is designed at 375px first — iPhone SE,
          iPhone 14 Mini, mid-range Android — then scaled up to tablet and desktop. There is no
          desktop-first fallback. There is no &ldquo;we&rsquo;ll fix it on mobile later.&rdquo; The 375px
          grid is the design authority. Desktop is a consequence of that authority, not its origin.
        </P>

        <P>
          Card detail renders the full-width image at 2:3 aspect ratio, flush to the screen edges. Flavor
          text appears below the image in a single-column reading column. Metadata chips — serial, tier,
          shell, parallel, set — appear in a single scrollable horizontal row beneath the lore-note. No
          metadata chip wraps to a second line. If the chip row overflows, it scrolls.
        </P>

        <P>
          Collection / sticker-book renders a 2-column grid at 375px. At 768px it expands to 3 columns.
          No 1-column mobile fallback — the sticker-book&rsquo;s visual logic requires at least 2 columns
          to register as a grid, and the grid is the product&rsquo;s primary retention surface.
        </P>

        <P>
          Pack ritual plays full-screen at every breakpoint. No modal. No sidebar. No card-in-modal. The
          ritual takes the screen because the ritual is the moment. Storefront renders a single-column card
          list at 375px — one card per row, full-width — and expands to a 2-column grid at 640px.
        </P>

        <P>
          Bottom-tab nav is fixed to the bottom of the viewport, 44px touch targets per Apple HIG minimum,
          safe-area-inset-bottom respected on all iOS devices. The bar does not overlap content. Content
          scrolls above it.
        </P>

        <P>
          No horizontal scroll anywhere in the product. If a surface requires horizontal scroll to function,
          the surface is redesigned before it ships. Text sizing: body copy minimum 16px, no exceptions.
          Headings scale from 24px at 375px to 48px at desktop using fluid typography (<code style={{ color: '#6B8FA8', background: 'rgba(107,143,168,0.1)', padding: '0 0.3rem', borderRadius: '2px' }}>clamp</code>).
          No type below 14px ships. Images: WebP only, lazy-loaded on all non-critical surfaces, with{' '}
          <code style={{ color: '#6B8FA8', background: 'rgba(107,143,168,0.1)', padding: '0 0.3rem', borderRadius: '2px' }}>sizes</code>{' '}
          attributes tuned to the 375px primary viewport.
        </P>

        <H3El>7.5.1 Design-System Token Reference</H3El>

        <P>Every per-Pane palette name maps to a CSS custom-property token. The full table:</P>

        <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,162,107,0.3)' }}>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#C9A26B', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'monospace' }}>Token</th>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#C9A26B', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'monospace' }}>Value</th>
                <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#C9A26B', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-v2-ui), Inter, sans-serif' }}>Pane / Use</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['--bs-gaslight-sepia', '#C9A26B', 'Baker Street — primary warm'],
                ['--bs-persian-slipper', '#B5651D', 'Baker Street — amber accent'],
                ['--bs-fog-blue', '#6B8FA8', 'Baker Street — cool secondary'],
                ['--bs-reichenbach-black', '#1B1814', 'Baker Street — deep background'],
                ['--bs-blood-pearl', '#8B1A1A', 'Baker Street — danger accent'],
                ['--ek-forest-green', '#2C3A23', 'Enchanted Kingdom — primary'],
                ['--ek-apple-oxblood', '#7A1F1F', 'Enchanted Kingdom — danger'],
                ['--ek-iron-black', '#0F1112', 'Enchanted Kingdom — background'],
                ['--ek-foxglove-violet', '#553A6B', 'Enchanted Kingdom — magic'],
                ['--wl-pinafore-blue', '#1F3A6B', 'Wonderland — Alice only'],
                ['--wl-rose-red', '#B8252A', 'Wonderland — heart suit'],
                ['--wl-cheshire-pink', '#D77A8E', 'Wonderland — cat accent'],
                ['--wl-tea-amber', '#9E6A2C', 'Wonderland — tea warm'],
                ['--gh-ship-tar', '#0A0908', 'Gothic Horror — void'],
                ['--gh-coffin-mahogany', '#4A1C12', 'Gothic Horror — warm dark'],
                ['--gh-stake-ivory', '#E8DEC8', 'Gothic Horror — ivory'],
                ['--gm-olympian-gold', '#C8922A', 'Greek Myth — divine'],
                ['--gm-wine-dark', '#3B1F4B', 'Greek Myth — sea/chthonic'],
                ['--gm-pomegranate-red', '#9B2335', 'Greek Myth — Persephone'],
                ['--surface-void', '#0a0907', 'Global — page background'],
                ['--surface-card', '#12110F', 'Global — card background'],
                ['--text-primary', '#F4EFE3', 'Global — body text'],
                ['--text-muted', '#9C9388', 'Global — secondary text'],
              ].map(([token, value, use]) => (
                <tr key={token} style={{ borderBottom: '1px solid rgba(201,162,107,0.08)' }}>
                  <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'monospace', fontSize: '0.78rem', color: '#6B8FA8' }}>{token}</td>
                  <td style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: value, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                    <code style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#d8cfc0' }}>{value}</code>
                  </td>
                  <td style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', color: '#d8cfc0', fontFamily: 'var(--font-v2-ui), Inter, sans-serif' }}>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ScreenshotSlot route="/v3/profile" />
      </section>

      {/* ─── Section 8: The Voice ─────────────────────────────────────────── */}
      <section id="section-8">
        <SectionHeader num="§ 8" title="The Voice" />

        <P>
          Voice is the second floor of the property; only art ranks above it on the Yardsticks. The bar
          is unambiguous: <em>Mark-Rosewater-survives-edit-pass for ≥80% of texts</em>. Each line must
          sit alongside the best Magic: The Gathering quotes and not flinch. Five registers, one per
          Universe. Twelve archetypes across all five. The Mosaic Test, applied at every Set lock.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>1. Bone-rhyme</strong> (Enchanted Kingdom). Two-stress
          alternating lines, end-rhymed on closed syllables — bone-words, iron-words, blood-words. Wolves
          speak in imperatives. Witches speak in conditionals. Stepmothers speak in third-person passive.
          The grammatical recession is the Spine.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>2. Dry Wit</strong> (Wonderland). Liddell-logic — every
          flavor line is a syllogism whose premises don&rsquo;t hold but whose form is impeccable.
          Three-beat structure: statement, restatement, snap. Italics on categorical words — <em>time</em>,{' '}
          <em>size</em>, <em>court</em>, <em>rule</em>, <em>name</em>, <em>self</em>, <em>place</em> — to
          mark them as suspect. No exclamation marks. No puns. Ever.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>3. Elegy</strong> (Baker Street, on the Watson axis).
          Forensic-confessional, retrospective-recognition, written-after-the-fact. The em-dash for the
          turn — never the colon. Watson does not exclaim; Watson observes. Emotion implied by the omission
          of the obvious.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>4. Menace</strong> (Gothic Horror). Operatic-exhaustion,
          Sorin-Markov-adjacent clinical detachment. Time markers in centuries. The Creature speaks in
          negations. Hyde speaks in present-tense imperatives. Mina writes — never speaks.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>5. Wonder</strong> (Greek Myth). Bronze-tongue,
          dactylic-hexameter Hesiod-cadence, chorus-narrator dominant. Capitalised abstract nouns when gods
          are doing the noun&rsquo;s work. Ordinal time markers. The banned word is{' '}
          <em>destiny</em> — we use <em>moira</em>.
        </P>

        <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <PQ>
            <em>Bone-rhyme:</em> &ldquo;He had seven and a half teeth. The half was the one that mattered.&rdquo;
          </PQ>
          <PQ>
            <em>Dry Wit:</em> &ldquo;The verdict came first. The trial took longer, because the verdict had to be defended.&rdquo;
          </PQ>
          <PQ>
            <em>Elegy:</em> &ldquo;Holmes had not slept. He had only become more accurate. — Watson, casebook, March 1895&rdquo;
          </PQ>
          <PQ>
            <em>Menace:</em> &ldquo;3.14 AM. The lamp went down twice and I did not light it the second time. — Mina H., journal, fragment&rdquo;
          </PQ>
          <PQ>
            <em>Wonder:</em> &ldquo;He chose glory over length. The choice had been made for him in the cradle; he discovered it on the field. — chorus, on Achilles&rdquo;
          </PQ>
        </div>

        <P>
          <strong style={{ color: '#C9A26B' }}>The Mosaic Test.</strong> At every Set lock, the Voice Lead
          reads all 20 cards&rsquo; flavor in sequence, blind to art. Six checks: (1) Could a fan reading
          these twenty quotes blind name the Universe? Pass at ≥18 of 20. (2) Are at least four archetypes
          represented? (3) Does any quote paraphrase its own mechanic? Cut. (4) Does any quote violate the
          Forbidden Register? Rewrite. (5) Does at least one quote in the Set Echo a prior Set (A12)? (6)
          Read the twenty quotes aloud — do any two sound identical in rhythm? The Set is a{' '}
          <em>mosaic</em>, not a <em>wallpaper</em>.
        </P>

        <ScreenshotSlot route="/v3/card/holmes-001" />
      </section>

      {/* ─── Section 9: The Five Lampblacker-Spines ──────────────────────── */}
      <section id="section-9">
        <SectionHeader num="§ 9" title="The Five Lampblacker-Spines" />

        <P>
          Public-domain figures alone don&rsquo;t sustain emotional gravity. Each Universe needs an
          original load-bearing center. Decision: commission all five simultaneously for Series 2 — no
          staggering. Staggered Spines create uneven Universe gravity. The five names are locked, and they
          are the keystone of LoreVault&rsquo;s IP-original moat.
        </P>

        <H3El>Hester Quill (Baker Street)</H3El>
        <P>
          A female clerk-archivist whose Spencerian-cipher initials appear in the margins of every Holmes
          case. Watson is the witness; Hester is the archive. She survives Reichenbach. She edits
          Watson&rsquo;s casebook into the <em>Strand</em> layout, files Moriarty&rsquo;s posthumous
          letters (one of which is addressed to her by Spencerian-cipher initials <em>HQ</em>), and is
          the in-world reason the Pane is retrievable.
        </P>
        <PQ>
          &ldquo;Every case has a margin. I am what is written there.&rdquo;
        </PQ>

        <H3El>The Charcoal-Burner&rsquo;s Daughter (Enchanted Kingdom)</H3El>
        <P>
          A second-generation child of a forest charcoal-burner, she gathers lampblack soot from the
          kiln-walls and grinds it into ink, with which she draws the Forest&rsquo;s maps. She is the only
          mapmaker the Pane has, and the literal reason maps don&rsquo;t survive in canon fairy tales.
        </P>
        <PQ>
          &ldquo;The wolf walked past me. I had already drawn his shadow.&rdquo;
        </PQ>

        <H3El>The Glass-Polisher / Court Recorder of Hearts (Wonderland)</H3El>
        <P>
          She has no name in canon. In Wonderland she is the Glass-Polisher — the figure who cleans the
          Looking-Glass and is the only one who knows it&rsquo;s two-way — and signs as the Court Recorder
          of Hearts. The sleight is that the Recorder is the Polisher seeing her work from the other side.
          She appears partially in seven Moments across the four Sets, never as figure, always as byline.
        </P>
        <PQ>
          &ldquo;I keep the surface clear. What looks back is not my doing.&rdquo;
        </PQ>

        <H3El>Asha Caedmon (Gothic Horror)</H3El>
        <P>
          The Ledger-Keeper of Whitby. Pulled from the <em>Demeter</em> wreck at Whitby Pier (1897) as a
          child; raised in the Whitby Abbey ruin; trained in classics and stenography (a Mina-lineage). She
          runs a private archive of the supernatural across the Stoker / Shelley / Stevenson / Leroux / Le
          Fanu canon. Her bound ledger is kept in a Carfax-bronze-tarnish lock-box.
        </P>
        <PQ>
          &ldquo;I came up from the wreck of the Demeter. I have been writing it down ever since.&rdquo;
        </PQ>

        <H3El>Melaina (Greek Myth)</H3El>
        <P>
          The Pythia&rsquo;s Apprentice. <em>Melaina</em> is Greek for{' '}
          <em>the dark one</em>, literally encoding the Lampblack-residue function in the name. She breathes
          the smoke-room with the Pythia, learns what to carry from the chamber to the supplicant. She is
          never the answer — only the route the answer takes. The only first-person-singular voice on the
          Pane.
        </P>
        <PQ>
          &ldquo;She breathes the smoke. I learn what to carry. The supplicant hears her; is also hearing me.&rdquo;
        </PQ>

        <HeroIllustration prompt="A horizontal frieze of five portrait panels in editorial-illustration jewel-tone register, William Blake mystic line meeting Mary Blair compositional flatness and Mucha border ornament. Each panel is a single Lampblacker-Spine in their working biome. Panel 1: Hester Quill at her clerk's-desk in the Strand archive, mid-thirties, ink-stained fingertips, Spencerian cipher 'HQ' watermarked in margin, gaslight-sepia palette, red-leather casebook open. Panel 2: The Charcoal-Burner's Daughter at her kiln in the Black Forest, mid-thirties, ink-stained hands, leather satchel of folded vellum, eagle-feather quill, iron-black + ash-grey + candle-amber palette, Vogel Schwarzwald cross-hatch. Panel 3: The Glass-Polisher at the Looking-Glass in the WL-4 Parlor, polishing-cloth tucked into the mirror frame, the Court Recorder's byline visible at bottom margin, Tenniel ink-line + pinafore-blue accent. Panel 4: Asha Caedmon at her desk in the Whitby Abbey ruin, leather-bound ledger open, broken-mirror-shard glyph reflecting no figure, Friedrich-Holst chiaroscuro, Demeter-crimson and Carfax-bronze-tarnish palette. Panel 5: Melaina at the Delphi tripod beside the Pythia, wax tablet in hand, smoke from the chasm rendered as Lampblack-residue-textured, chiton-white + bronze-Riace + persephone-pomegranate-red palette, Bouguereau-Bernini register. Painterly-not-photographic, no text in panels. Each woman wears her function." />
      </section>

      {/* ─── Section 10: The Cross-Tether Map ────────────────────────────── */}
      <section id="section-10">
        <SectionHeader num="§ 10" title="The Cross-Tether Map" />

        <P>
          A tether is a cross-Universe Lampblack residue trail — a recurring symbol, prop, line, or scar
          that surfaces across Panes. Tethers are the proof of the Lattice. They are how the completist
          knows two cards are siblings without being told. Series 1 ships near-zero crossover (1–2 Echoes
          maximum across the entire Series). The marquee tether — held to Series 2/3 — is{' '}
          <strong style={{ color: '#C9A26B' }}>Auguste Dupin ↔ Sherlock Holmes: the Method-Lineage.</strong>{' '}
          Poe wrote Dupin in 1841; Doyle wrote Holmes in 1887; in <em>A Study in Scarlet</em> Holmes
          dismisses Dupin.
        </P>

        <P>
          How a tether appears across cards: the same object, line, or gesture surfaces in two Sets in two
          Universes, usually a season apart, with no explanation. The first appearance is canonical (the
          lens, the cane, the gold-cased pocket-watch). The second is the Echo (the same lens, in a
          different Pane, with a hairline crack at the same eight-o&rsquo;clock position). The collector
          who owns both reads them as a chord.
        </P>

        <PQ>
          A Reichenbach Ultimate is one card; a Reichenbach Ultimate held alongside a Greek Myth card in
          which Achilles dies on a parallel cliff is two cards that read as a paired death-on-cliff, two
          Panes&rsquo; worth of Lampblack converging on a single canonical gesture.
        </PQ>

        <P>
          <strong style={{ color: '#C9A26B' }}>Persephone ↔ Snow White: the bitten-fruit tether.</strong>{' '}
          The pomegranate seed (Greek) and the bitten apple (Enchanted Kingdom) are the same fruit-of-binding
          refracted. Both are eaten by a girl who descends; both bind her to a cycle; both are the hinge of
          the year.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>The Mirror.</strong> Four Panes carry mirror-residue: EK&rsquo;s
          Magic Mirror, Wonderland&rsquo;s Looking-Glass, Greek Perseus&rsquo;s polished shield, Gothic
          Dracula&rsquo;s mirror that fails to reflect. The most-recurring Echo-Object in the Lattice.
          Series 3 will ship a four-Pane Convergence-Cathedral card.
        </P>

        <P>
          The <strong style={{ color: '#C9A26B' }}>Cheshire-grin</strong> is the marquee Pattern-9 / Deep
          / Lampblack-Trade residue. No figure crosses; only residue. The grin-as-fog-shape,
          grin-as-canopy-gap, grin-as-bed-shadow-curl surface at Cheshire without rendering Cheshire-as-figure
          on any cross-Pane card.
        </P>

        <HeroIllustration prompt="An editorial-illustration jewel-tone diagram in the register of a 19th-century cosmographic plate. Five Panes arranged in pentagram with no center, each rendered as a circular medallion: Baker Street (gaslight-sepia + Reichenbach black), Enchanted Kingdom (forest-green + apple-oxblood), Wonderland (pinafore-blue + apron-white + rose-red), Gothic Horror (ship-tar-black + candle-amber), Greek Myth (chiton-white + bronze-Riace + pomegranate-red). Lampblack-residue threads — soot-and-smoke painted lines — connect medallions in tether-pairs: a thread between Holmes's medallion and an Auguste Dupin silhouette in the implied American Gothic position (Method-Lineage); a thread between Persephone in Greek and Snow White in EK (the bitten fruit, rendered as a single fruit half-pomegranate half-apple at the thread's midpoint); four mirror-shards arranged in a smaller inner pattern connecting all four mirror-bearing Panes; a faint Cheshire-grin smile-shape visible in the negative space of each non-Wonderland Pane. The deerstalker silhouette appears at the Lampblack-residue thread crossing Greek and Gothic. William Blake mystical cosmography meeting Mary Blair flat compositional poise and Mucha border ornament. Painterly-not-photographic." />
      </section>

      {/* ─── Section 11: The Live-Ops Calendar ───────────────────────────── */}
      <section id="section-11">
        <SectionHeader num="§ 11" title="The Live-Ops Calendar" />

        <P>
          LoreVault&rsquo;s heartbeat is the calendar. Every drop, refresh, and ritual is timed to either
          an internal cadence or an external cultural pre-load. Six anchors govern.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Daily noon ET refresh.</strong> Each day, the home-page
          Lattice-painting has one of its five arches gently glowing — Mon=BS, Tue=Gothic, Wed=Wonderland,
          Thu=Greek, Fri=EK, Sat=cross-Pane day, Sun=rest. The card is <em>displayed</em>, not given.{' '}
          <strong style={{ color: '#C9A26B' }}>No daily-streak chrome. No flame-emoji. No &ldquo;DON&rsquo;T
          BREAK YOUR STREAK.&rdquo;</strong> That is gambler-collector chrome — banned outright. The
          reading-pact ticket is a <em>reader&rsquo;s reward</em>, not a <em>gambler&rsquo;s daily-quota</em>.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>The reading-pact ticket</strong> fires off three actions:
          opening the Journal email and scrolling to bottom; tapping the Lattice arch and reading the
          card-of-the-day; or visiting any Pane-home and reading 200 words of any wiki article. Tickets
          accumulate up to 5 max in a wallet. They do not expire. They cap. The user can do nothing for 4
          days, then on day 5 do all three actions and they&rsquo;re back at the cap.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>First-Saturday monthly mega-drop.</strong> 1pm ET, every
          first Saturday. One Set per month, 12 Sets per Series 1 year. Drop-day is a 60-minute live event,
          narrator-voiced. Council seat 1 appears mid-stream for ~2 minutes to confirm a Lampblack-tether
          moment. Wake page persists post-close: when the live event ends, the Pane home-page transitions
          to a Wake state.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>The 2027 Liberation Drop — January 1, 2027, 00:01 GMT.</strong>{' '}
          Universal <em>Dracula</em> (1931) and Universal <em>Frankenstein</em> (1931) enter US public
          domain. A 15-card expansion drop — small enough to read as a curated press moment, large enough
          to anchor a marketing wave. Asha Caedmon&rsquo;s hand visible at frame-edge of the Mythic 1/1{' '}
          <em>The Cliff Turns</em>, sealing the new entry into her ledger.
        </P>

        <ScreenshotSlot route="/v3/drops" />
      </section>

      {/* ─── Section 12: The Series-1 Roadmap ────────────────────────────── */}
      <section id="section-12">
        <SectionHeader num="§ 12" title="The Series-1 Roadmap + Cultural Pre-Loads" />

        <P>
          Twelve months. One Set per month. Twenty Moments per Set. May 2026 → April 2027. The five
          Universes share twelve Sets unevenly: 3 Baker Street + 3 Gothic Horror + 2 Enchanted Kingdom +
          2 Wonderland + 2 Greek Myth. The cadence is cultural-tailwind-weighted and Lampblack-density-weighted.
        </P>

        <P>
          The Series-1 cultural alignment strategy ships every Set into a window where the audience is
          already thinking about the canon.
        </P>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {[
            ['May 3 2026', 'Dracula Daily annual season opens. GH-1 The Demeter launches same day.'],
            ['2026 ongoing', 'Young Sherlock Season 2 (Amazon). Baker Street "Argument Pane" Set timed to lead-up press.'],
            ['July 2026', 'Christopher Nolan\'s Odyssey (theatrical). GM-1 The Third Spring timed to release window.'],
            ['Sept–Oct 2026', 'Gothic "Whitby Ledger" Set ships in spooky-season window.'],
            ['Nov 21 2026', 'Wicked: For Good (Universal Pictures, Part 2). EK defends differentiation — NOT shipping Oz yet.'],
            ['December 2026', 'A Christmas Carol annual cycle. Dickensian teaser for Series 2.'],
            ['Dec 18 2026', 'Marvel Avengers: Doomsday. Position LoreVault Lattice as the literary multiverse.'],
            ['Jan 1 2027', 'Universal Monsters PD-cliff press wave. Liberation Drop.'],
          ].map(([date, desc]) => (
            <li
              key={date}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                fontFamily: 'var(--font-v2-ui), Inter, sans-serif',
                fontSize: '0.9rem',
                color: '#d8cfc0',
                lineHeight: 1.55,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-baker-street), serif',
                  color: '#C9A26B',
                  fontSize: '0.72rem',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  paddingTop: '0.15rem',
                  minWidth: '9rem',
                }}
              >
                {date}
              </span>
              <span>{desc}</span>
            </li>
          ))}
        </ul>

        <P>
          The 2027 Liberation Drop sits between GH-3 and GH-4, at the calendar-flip. The 12-month Series 1
          closes February 2027. The Series 2 teaser appears on the Lattice center-node — the 6th node,
          previously empty — gaining a faint silhouette for the first time.
        </P>

        <ScreenshotSlot route="/v3/drops" />
      </section>

      {/* ─── Section 13: The Council ─────────────────────────────────────── */}
      <section id="section-13">
        <SectionHeader num="§ 13" title="The Council" />

        <P>
          Four voting seats, structurally empowered to override the founder on canon questions, in writing,
          from drop one. The single highest-leverage operational decision in the property is decoupling the
          IP from the founder. Pokémon Company structure transplanted at one-tenth scale.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Seat 1 — Lattice Architect / Canon Lead.</strong> Gates
          the Spines, the eight-shell taxonomy, the 1:2:4 Iceberg ratio. Author of every Spine-document.
          Final voice on cross-Pane tether placement.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Seat 2a — Voice Lead, four Universes.</strong> Authors
          Journal entries, weekly newsletters, Set-level voice direction across BS, EK, Wonderland, Greek
          (Series 1). AI-draft permitted for structural draft; human-edit mandatory.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Seat 2b — Footnoter, Topsy-only.</strong> Hand-writes every
          word of every Topsy Set&rsquo;s marginalia, every Mirror Wednesday editorial, every
          Pratchett-grade satirical Footnoter line. Volume: ~1500 words/week.{' '}
          <strong style={{ color: '#C9A26B' }}>Never AI-drafted. Ever.</strong>
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Seat 3 — Compliance + Cultural Reviewer.</strong> Handling
          all ODIN-flagged escalations: the Romanian cultural advisor for Stoker&rsquo;s Eastern-European
          stereotypes; the Roma + Jewish reviewer for Grimm&rsquo;s antisemitic asides; the Shelley scholar
          for the Creature&rsquo;s articulacy; the queer-horror scholar for Carmilla.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>Seat 4 — Iceberg Auditor.</strong> Enforces the 1:2:4
          Surface:Echo:Deep ratio at card-level. 12 Echo + 24 Deep per Series 1; 7% crossover ceiling per
          Set. Quarterly compliance audit; any quarter that breaches is failed; Sets hold until correction.
        </P>

        <PQ>
          The Council&rsquo;s only continuous job is gatekeeping. The founder is a non-voting fifth seat
          who can be overridden by unanimous Seats 1, 2a, 2b, and 3.
        </PQ>

        <P>
          <strong style={{ color: '#C9A26B' }}>The Apex Smudge confirmation ceremony.</strong> When an
          Apex pack ($999) is opened during a Live event, Council seat 1 or seat 4 voices a confirmation
          of <em>why</em> a particular pull is significant.{' '}
          <em>&ldquo;Yes, that smudge on card #7 is what you think it is.&rdquo;</em> The Council does
          not name the residue. It confirms the recognition. It is the bar-setter. It is the Day-0
          emission Y7 lives or dies on.
        </P>

        <ScreenshotSlot route="/v3/drop/liberation-2027" />
        <ScreenshotSlot route="/v3/drops" />
      </section>

      {/* ─── Section 14: The Differentiator ──────────────────────────────── */}
      <section id="section-14">
        <SectionHeader num="§ 14" title="The Differentiator" />

        <PQ>
          Public-domain is our moat, not our compromise. Every figure on every card in every Set across
          every Series is in the public domain at point of ship.
        </PQ>

        <P>
          LoreVault has no Universes Beyond. Wizards of the Coast&rsquo;s <em>Universes Beyond</em> was a
          $200M+ success precisely because it didn&rsquo;t pretend to be canon. We do not need a Beyond.
          Every figure on every card in every Set across every Series is in the public domain at point of
          ship. We do not pay licensing. We do not litigate use. We do not negotiate appearances.
        </P>

        <P>
          The combinatorics are infinite. Twenty Moments per Set times five Universes per Series times
          eight Shells times five Parallels times four Tiers times the Lampblacker-Spine cross-Pane cameos
          — the catalog is structurally unboundable. We will ship at one Set per month for ten years and
          not run out of canonical figures.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>The negative space — what we are NOT.</strong> No battle
          stats on literary figures. No burn-for-XP destructive CTA. No &ldquo;Estimated Value History
          −69.6%&rdquo; red-trend price chart. No Comfy / Bulk / Movers / Smart-money chrome. No
          daily-streak gambler chrome. No FOMO countdown timer on the card itself. No &ldquo;log in 7 days
          for X.&rdquo; No prestige-grind ribbon.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>The positive affirmation — Object, not asset.</strong>{' '}
          Every card on <code style={{ color: '#6B8FA8', background: 'rgba(107,143,168,0.1)', padding: '0 0.3rem', borderRadius: '2px' }}>/v3/card/:cardId</code> reads as an object first — the painted FLUX render at
          2:3, the serif pullquote, the lore-note, the Lampblack smudge in the corner — and only after the
          object has been seen does the metadata-chip-row appear. The word <em>floor</em> never appears on
          a card detail page. The phrase <em>Smart money</em> never appears anywhere.
        </P>

        <HeroIllustration prompt="An editorial-illustration jewel-tone composition in the register of a 19th-century library frontispiece. A vast Wunderkammer-library interior at evening, gaslight-amber and Reichenbach-black chiaroscuro, William Blake mystical line meeting Mary Blair compositional flatness and Mucha decorative cornering. In the foreground, a single mahogany reading-desk with a LoreVault card laid flat: Holmes-PRIME, Paget cross-hatch, the lens at his hip catching a single point of light. Behind the desk, the library shelves recede into infinite perspective, each shelf-row labelled in small-caps with a public-domain author: DOYLE · STOKER · CARROLL · GRIMM · HESIOD · POE · SHELLEY · STEVENSON · LEROUX · LE FANU · HOMER · OVID · ANDERSEN · PERRAULT. No licensing brands visible anywhere. No Disney, no Marvel, no Universal silhouette in any frame. The infinite-shelves vanishing point dissolves into Lampblack-residue mist. A small banner above the reading-desk in Trajan inscriptional caps reads simply OBJECT, NOT ASSET. Painterly-not-photographic. The library is the moat." />

        <H3El>14.2 The Phase-2 Marketplace — Trading Without the Stock Screen</H3El>

        <P>
          The marketplace ships in Phase 2. It is not in Series 1 launch. The decision is doctrinal, not
          logistical: a marketplace on Day 1 signals that the product expects cards to be traded before they
          have been read. Series 1 is for reading. The marketplace opens when the binder has had time to fill.
        </P>

        <P>
          The listing flow is four steps: seller sets an ask price, reviews the listing preview, confirms,
          and the listing goes live. The listing shows six things, in this order: the card thumbnail at 1:1
          crop, the serial number, the seller&rsquo;s display name, the listing age, a scarcity reminder
          stating how many of this Moment are currently listed (&ldquo;4 of 25 listed&rdquo;), and the
          lore-note — one flavor line from the card, in the card&rsquo;s native register.
        </P>

        <P>
          The lore-note appears above the price. The object appears before the asset. The seller is selling
          a thing that has a voice; the buyer is buying a thing that has a voice; the price is the third
          fact, not the first. Each card shows its owner trail — the chain of prior owners as display names,
          scrollable, with no wallet addresses visible. The platform facilitates P2P trades; there are no
          gas fees and no wallet connection required.
        </P>

        <P>
          The following are banned on every marketplace surface: P&amp;L charts, &ldquo;Estimated
          Value&rdquo; trend lines, &ldquo;Smart money&rdquo; pills, red-number change indicators, Comfy /
          Bulk / Movers / Need strips, Top Shot sub-tab vocabulary, 7-day volume, market cap, and
          average-sale aggregation. What is permitted on a listing: the ask price, the listing date, the
          seller&rsquo;s display name, and the scarcity reminder. That is sufficient information to make a
          decision. Anything added beyond it is trader-vernacular, and trader-vernacular is banned.
        </P>

        <ScreenshotSlot route="/v3/marketplace" />
      </section>

      {/* ─── Section 15: The Anti-Vision ─────────────────────────────────── */}
      <section id="section-15">
        <SectionHeader num="§ 15" title="The Anti-Vision" />

        <P>
          Six anti-patterns, banned from the rebirth. Specific. Enumerated. Their absence is the
          product&rsquo;s identity as much as their absence is the product&rsquo;s discipline.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>1. Charm-60 / battle stats on literary figures.</strong>{' '}
          The canonical specimen of v1&rsquo;s failure: Holmes given a stat-block with Power 45 /
          Intelligence 59 / Mystery 85 / Legend 95 / Charm 60. The literary reader closes the tab the
          moment they see Charm-60 on Holmes. The alternative is the{' '}
          <strong style={{ color: '#C9A26B' }}>4-Layer Council</strong>: Silhouette · Props · Gesture ·
          Spine — collapsed by default on the card detail page, expandable by user toggle, never auto-shown.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>2. Burn-for-XP destructive CTA.</strong> v1 carried a
          &ldquo;burn this card for XP&rdquo; path on Common cards. The reader-harm is that it converts a
          card from an object to a disposable resource. The alternative is the future{' '}
          <strong style={{ color: '#C9A26B' }}>Lampblack-Tether Discovery</strong> mechanic (Series 2+)
          — collectors who hold both halves of a tether earn an unlock, but the cards themselves remain.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>3. &ldquo;Estimated Value −69.6%&rdquo; / red-trend price chart.</strong>{' '}
          v1 carried a 30/90-day price chart on every card detail page, complete with red-trend lines and
          percentage-loss callouts. The reader-harm is that it converts a card from an object to a position.
          The alternative is <strong style={{ color: '#C9A26B' }}>no price on card-detail.</strong>
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>4. Comfy / Bulk / Movers / Smart-money chrome.</strong>{' '}
          Every word in that interface is trader-vernacular pulled from poker-table and stock-screener
          language; none of it is the language a literature reader uses. The alternative is the{' '}
          <strong style={{ color: '#C9A26B' }}>vault facets</strong>: by Universe, Shell, Parallel,
          Elemental, Narrator.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>5. Daily-streak gambler chrome.</strong> All of it is built
          to manufacture anxiety in the user; the moment the user misses a day, the streak resets and the
          user is punished. The alternative is the reading-pact ticket (§11) — three actions, any one earns
          a ticket, tickets accumulate up to 5 max in a wallet, do not expire, cap.
        </P>

        <P>
          <strong style={{ color: '#C9A26B' }}>6. Top-Shot trader-vernacular sub-tabs.</strong> Sub-tabs
          labelled <em>Listings / 7D Volume / Market Cap / Avg Sale</em>, plus portfolio P&L tiles. The
          reader-harm is total: the entire interface organizes itself around the question{' '}
          <em>what is the asset doing?</em> rather than <em>what is the object?</em> The card-detail
          page&rsquo;s identity is built as much by what it refuses to be as by what it ships.
        </P>

        <PQ>
          A useful test for any proposed feature, line, or shipped artifact: <em>does this read as one of
          the six?</em> If yes, hold it. If unclear, hold it.
        </PQ>

        <HeroIllustration prompt="A diptych composition in editorial-illustration jewel-tone register, William Blake mystical line meeting Mary Blair compositional restraint and Mucha decorative cornering. Left panel: a v1-style trader-screen rendered as a grim Victorian-newspaper engraving — Holmes's portrait above a stat-block reading 'CHARM 60 / INTELLIGENCE 59 / MYSTERY 85', a red-trend price chart titled 'Estimated Value −69.6%', a 'BURN FOR XP' button, sub-tabs reading 'Comfy / Bulk / Movers / Smart Money', a daily-streak counter with a flame emoji rendered as a pyre. The whole panel is in sepia-bilious yellow with red-bilious accents; the figure of Holmes looks pained. Right panel: the LoreVault chrome — a single Holmes card at 2:3, a single serif pullquote ('It was the November of '94…'), a single lore-note with tier-color left-rule, a tether-row with three mini-cards, five metadata-chips (serial · tier · shell · parallel · set), the 4-Layer Council collapsed under 'Show the 4-Layer Council ▾'. The whole panel is in gaslight-sepia, Persian-slipper-amber, Reichenbach-black, with one accent of blood-pearl. Holmes looks present. A vertical line of Lampblack-residue divides the two panels; on the right side the residue resolves into the Hester-Quill cipher 'HQ'. The viewer reads left-to-right: from asset to object. Painterly-not-photographic." />
      </section>

      {/* ─── Colophon ─────────────────────────────────────────────────────── */}
      <div
        className="mt-20 pt-8"
        style={{ borderTop: '1px solid rgba(201,162,107,0.2)' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-pullquote), Georgia, serif',
            fontStyle: 'italic',
            color: '#6B8FA8',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}
        >
          Decisions, not options. — LoreVault Canon Council, GDD V1, 2026-04-26.
        </p>
      </div>
    </>
  );
}
