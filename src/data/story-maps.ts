// Story Maps — 3 mythologies with 8 story nodes each
// Each node requires specific cards (by character name) to unlock
// Nodes are ordered into a narrative arc: prologue → rising → climax → resolution

export interface StoryNode {
  id: string;
  chapter: number; // 1-8
  title: string;
  teaser: string; // shown when locked — one line of mystery
  text: string; // full narrative, shown when unlocked
  icon: string;
  requiredCharacters: string[]; // owning any card with this character unlocks
  connections: string[]; // node IDs this connects to (for the map visualization)
}

export interface StoryWorld {
  id: string;
  name: string;
  tagline: string;
  setSlug: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  chapters: StoryNode[];
}

export const STORY_WORLDS: StoryWorld[] = [
  // ═══════════════════════════════════════════
  // GREEK — Olympus Rising
  // ═══════════════════════════════════════════
  {
    id: 'olympus',
    name: 'Olympus Rising',
    tagline: 'Gods, heroes, and the price of glory',
    setSlug: 'olympus',
    icon: '⚡',
    gradientFrom: '#2e2a0a',
    gradientTo: '#69601b',
    accentColor: '#f59e0b',
    chapters: [
      {
        id: 'ol-prologue',
        chapter: 1,
        title: 'The Age of Gods',
        teaser: 'Before heroes walked the earth, the gods divided the world...',
        text: 'In the beginning, three brothers cast lots for dominion. Zeus took the sky and its thunderbolts. Poseidon claimed the restless sea. Hades descended to rule the dead. The earth they shared — and from that sharing came every war, every betrayal, every act of divine jealousy that would define an age. The gods did not create humans in their image. They created humans to have an audience.',
        icon: '⚡',
        requiredCharacters: ['Zeus', 'Poseidon', 'Hades'],
        connections: ['ol-trojan-war', 'ol-defiance'],
      },
      {
        id: 'ol-trojan-war',
        chapter: 2,
        title: 'The Trojan War',
        teaser: 'A face that launched a thousand ships...',
        text: 'Helen\'s face launched a thousand ships, but the war was never about Helen. It was about pride — Agamemnon\'s, Achilles\', Paris\'s. Ten years of siege, the greatest heroes of Greece dead in the dust, all because men could not swallow their pride. Achilles chose a short, glorious life over a long, forgotten one. He got exactly what he asked for. Glory is a beautiful corpse.',
        icon: '🏛️',
        requiredCharacters: ['Achilles', 'Helen of Troy'],
        connections: ['ol-wanderer', 'ol-warriors'],
      },
      {
        id: 'ol-wanderer',
        chapter: 3,
        title: 'The Wanderer\'s Return',
        teaser: 'Ten years of war. Ten more lost at sea...',
        text: 'Odysseus is the only Greek hero who wins by thinking. While Achilles charges, Odysseus schemes. The Trojan Horse is his masterpiece — the first and greatest con. But the gods punish cleverness as readily as they punish pride. Ten years to win the war, ten more to get home. Every island, every monster, every enchantress is a test: can you remain yourself when the world keeps reshaping you? The answer, for Odysseus, is barely.',
        icon: '🚢',
        requiredCharacters: ['Odysseus'],
        connections: ['ol-trojan-war', 'ol-monsters', 'ol-love'],
      },
      {
        id: 'ol-monsters',
        chapter: 4,
        title: 'Monsters at the Edge',
        teaser: 'In the labyrinth, something waits...',
        text: 'Medusa was not born a monster — she was made one by a god\'s punishment for a crime she didn\'t commit. The Minotaur was locked in a labyrinth because his existence embarrassed a king. The monsters of Greek myth are never simply evil. They are evidence — proof that the gods are capricious and power is cruel. Perseus kills Medusa and becomes a hero. No one asks what she might have become if she\'d been left alone.',
        icon: '🐍',
        requiredCharacters: ['Medusa', 'The Minotaur'],
        connections: ['ol-wanderer', 'ol-warriors'],
      },
      {
        id: 'ol-defiance',
        chapter: 5,
        title: 'Defiance of the Gods',
        teaser: 'Some stole fire. Others flew too close to the sun...',
        text: 'Prometheus stole fire and was chained to a rock while an eagle ate his liver daily — for eternity. Icarus flew too close to the sun on wax wings. Both are punished for the same crime: reaching above their station. The Greek gods did not forbid progress — they forbade ambition. Prometheus gave humanity technology. Icarus gave humanity aspiration. Both paid with their bodies. The lesson the gods intended: stay small. The lesson humans took: the fire was worth it.',
        icon: '🔥',
        requiredCharacters: ['Prometheus', 'Icarus'],
        connections: ['ol-prologue', 'ol-love'],
      },
      {
        id: 'ol-love',
        chapter: 6,
        title: 'Love and the Underworld',
        teaser: 'Orpheus descended for love. Not everyone returns...',
        text: 'Orpheus descended to the underworld to retrieve Eurydice — and nearly succeeded. His music moved even Hades to mercy. But the condition was impossible: walk forward, don\'t look back. He looked. Of course he looked. Love is not patient, not in Greek myth. Circe loved Odysseus and turned his men to pigs to keep him longer. In Greek mythology, love is never a reward. It is a test, and the test is always "can you let go?"',
        icon: '🎵',
        requiredCharacters: ['Orpheus', 'Circe'],
        connections: ['ol-wanderer', 'ol-defiance'],
      },
      {
        id: 'ol-warriors',
        chapter: 7,
        title: 'The Warriors\' Legacy',
        teaser: 'They slew monsters and became legends...',
        text: 'Perseus slew Medusa with a mirrored shield. Athena gave him the plan. Hercules completed twelve impossible labors. Both are called heroes, but their heroism is different: Perseus is clever, Hercules is strong. The Greek world valued both, but differently. Perseus became a king. Hercules became a god. The warriors\' legacy is the foundation of Western narrative: the individual who faces the impossible and reshapes the world through the attempt.',
        icon: '⚔️',
        requiredCharacters: ['Perseus', 'Athena', 'Hercules'],
        connections: ['ol-trojan-war', 'ol-prologue', 'ol-monsters'],
      },
      {
        id: 'ol-finale',
        chapter: 8,
        title: 'Twilight of Olympus',
        teaser: 'Even gods must face their end...',
        text: 'The age of heroes ends not with a battle but with a forgetting. The gods retreat to Olympus. The heroes become constellations — their stories written in stars rather than blood. But the stories survive. Every culture that followed Greece inherited these archetypes: the trickster, the warrior, the lover, the rebel. The gods of Olympus did not die. They became the grammar of every story told since. This is immortality — not of the body, but of the pattern.',
        icon: '🌟',
        requiredCharacters: ['Zeus', 'Athena', 'Odysseus'],
        connections: ['ol-warriors', 'ol-love'],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // FAIRY TALE — The Enchanted Kingdom
  // ═══════════════════════════════════════════
  {
    id: 'enchanted-kingdom',
    name: 'The Enchanted Kingdom',
    tagline: 'Fairy tales are not what you remember',
    setSlug: 'enchanted-kingdom',
    icon: '👑',
    gradientFrom: '#1a0a2e',
    gradientTo: '#2d1b69',
    accentColor: '#a855f7',
    chapters: [
      {
        id: 'ek-prologue',
        chapter: 1,
        title: 'Once Upon a Time',
        teaser: 'Every story begins the same way. But the endings differ...',
        text: 'The Brothers Grimm did not invent these stories — they collected them from peasants, grandmothers, and innkeepers across Germany. The tales were warnings disguised as wonder. "Don\'t go into the forest." "Don\'t trust strangers." "Don\'t open the forbidden door." Every "once upon a time" is a promise: something terrible will happen, and whether you survive depends on what you learned before the story began.',
        icon: '📖',
        requiredCharacters: ['Snow White'],
        connections: ['ek-mirror', 'ek-forest'],
      },
      {
        id: 'ek-mirror',
        chapter: 2,
        title: 'The Mirror\'s Truth',
        teaser: 'The mirror does not lie. That is its curse...',
        text: 'The Magic Mirror does not lie — that is its curse. The Evil Queen asks "who is fairest?" not seeking truth but seeking validation. When the mirror speaks Snow White\'s name, it shatters not glass but the Queen\'s entire identity. The original Grimm tale is far darker than Disney remembered: the Queen dances to death in iron shoes heated red-hot. Vanity, the tale warns, is a poison that kills the poisoner.',
        icon: '🪞',
        requiredCharacters: ['Snow White', 'The Evil Queen'],
        connections: ['ek-sleeping', 'ek-dark-side'],
      },
      {
        id: 'ek-forest',
        chapter: 3,
        title: 'Trials of the Forest',
        teaser: 'Every tale leads through the same dark woods...',
        text: 'In every Grimm tale, the forest is the same forest. Red Riding Hood\'s dark path, Hansel and Gretel\'s breadcrumb trail — the forest is not a place but a threshold. It is where civilization ends and transformation begins. The children who enter are naive; the children who emerge (if they emerge) have learned the world\'s true nature. The forest does not care about innocence.',
        icon: '🌲',
        requiredCharacters: ['Red Riding Hood', 'Hansel', 'Gretel'],
        connections: ['ek-prologue', 'ek-guardians'],
      },
      {
        id: 'ek-curses',
        chapter: 4,
        title: 'Curses and Transformations',
        teaser: 'The curse reveals the truth that was always there...',
        text: 'The Frog Prince and the Beast share a secret: the curse is not the transformation — the curse is the truth it reveals. The Beast is monstrous not because of the enchantment but because he was a monster before it. The Frog is noble not because he was a prince but because he remained kind while enchanted. In fairy tales, the outer form always reflects the inner reality. Eventually.',
        icon: '🐸',
        requiredCharacters: ['The Frog Prince', 'The Beast'],
        connections: ['ek-spinner', 'ek-mirror'],
      },
      {
        id: 'ek-spinner',
        chapter: 5,
        title: 'The Spinner\'s Bargain',
        teaser: 'Gold from straw. But what is the true price?',
        text: 'Rumpelstiltskin offers an impossible deal: gold from straw, but the price is a firstborn child. This is the economics of fairy tales — nothing is free, and the cost is always higher than it appears. His name is his vulnerability, his secret self. When the Queen discovers it, she doesn\'t just break a deal; she strips away his power by naming the unnamed. In stories, knowing a thing\'s true name gives you power over it.',
        icon: '🧵',
        requiredCharacters: ['Rumpelstiltskin'],
        connections: ['ek-curses', 'ek-dark-side'],
      },
      {
        id: 'ek-sleeping',
        chapter: 6,
        title: 'Sleeping Enchantments',
        teaser: 'Sleep is not rest. It is exile from the flow of life...',
        text: 'Snow White in her glass coffin. Sleeping Beauty behind her wall of thorns. Two princesses suspended in deathlike sleep, preserved in perfect beauty, waiting. The original tales are not about rescue — they are about time. The sleeper misses the world changing around her. When she wakes, nothing is the same. Sleep is not rest; it is exile from the flow of life.',
        icon: '💤',
        requiredCharacters: ['Sleeping Beauty', 'Snow White'],
        connections: ['ek-mirror', 'ek-guardians'],
      },
      {
        id: 'ek-dark-side',
        chapter: 7,
        title: 'The Dark Side of Fairy Tales',
        teaser: 'The Brothers Grimm collected warnings, not bedtime stories...',
        text: 'Bluebeard\'s forbidden chamber holds the bodies of his previous wives. The Evil Queen orders a child\'s heart cut out. These are not children\'s stories — they never were. The Brothers Grimm collected folk tales that served as survival warnings: do not trust strangers, do not be vain, do not open doors you were told to keep shut. The darkness is the lesson.',
        icon: '🔑',
        requiredCharacters: ['Bluebeard', 'The Evil Queen'],
        connections: ['ek-spinner', 'ek-forest'],
      },
      {
        id: 'ek-guardians',
        chapter: 8,
        title: 'Seven Protectors',
        teaser: 'Protection in fairy tales is never unconditional...',
        text: 'The Seven Dwarfs take Snow White in because she is useful — she cooks and cleans. The Huntsman spares her because his conscience outweighs his fear. Protection in fairy tales is never unconditional. It comes with bargains, expectations, and always a test. The Huntsman chose mercy once and it cost him everything. The Dwarfs chose compassion and it brought death to their doorstep.',
        icon: '⛏️',
        requiredCharacters: ['The Seven Dwarfs', 'The Huntsman'],
        connections: ['ek-sleeping', 'ek-forest'],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // VICTORIAN — Baker Street Files
  // ═══════════════════════════════════════════
  {
    id: 'baker-street',
    name: 'Baker Street Files',
    tagline: 'The science of deduction begins',
    setSlug: 'baker-street',
    icon: '🔍',
    gradientFrom: '#1a1a2e',
    gradientTo: '#16213e',
    accentColor: '#3b82f6',
    chapters: [
      {
        id: 'bs-prologue',
        chapter: 1,
        title: 'A Study in Scarlet',
        teaser: 'Two strangers meet at 221B. London will never be the same...',
        text: 'Dr. Watson returns from Afghanistan, wounded and searching for affordable lodgings in London. A mutual friend introduces him to the strangest man he\'ll ever meet: a consulting detective who keeps his tobacco in a Persian slipper and his correspondence fixed to the mantelpiece with a jackknife. Their first case together will be Watson\'s initiation into a world where nothing is what it seems and every detail tells a story.',
        icon: '📕',
        requiredCharacters: ['Sherlock Holmes', 'Dr. Watson'],
        connections: ['bs-great-detective', 'bs-network'],
      },
      {
        id: 'bs-great-detective',
        chapter: 2,
        title: 'The Great Detective',
        teaser: 'He does not merely observe. He dismantles reality...',
        text: 'At 221B Baker Street, the world\'s only consulting detective sits amid tobacco smoke and chemical apparatus. Holmes does not merely observe — he dismantles reality into its component truths. Every scratch on a watch-case, every callus on a hand, tells a story to those who know how to read it. The science of deduction is not a gift; it is a discipline honed through relentless practice and a mind that refuses to be cluttered with the unnecessary.',
        icon: '🔍',
        requiredCharacters: ['Sherlock Holmes'],
        connections: ['bs-napoleon', 'bs-network', 'bs-hound'],
      },
      {
        id: 'bs-network',
        chapter: 3,
        title: 'The Baker Street Network',
        teaser: 'No detective works alone...',
        text: 'No detective works alone. Watson provides the steady hand and the revolver; Mrs. Hudson provides sanctuary (and discretion); Lestrade provides the authority of Scotland Yard, however grudgingly. And below them all, the Irregulars — street children who see everything and are seen by no one. Together they form a web of intelligence that rivals Moriarty\'s own.',
        icon: '🏠',
        requiredCharacters: ['Dr. Watson', 'Mrs. Hudson', 'Inspector Lestrade'],
        connections: ['bs-great-detective', 'bs-woman'],
      },
      {
        id: 'bs-woman',
        chapter: 4,
        title: 'The Woman Who Beat Him',
        teaser: 'She defeated him by being better...',
        text: 'Irene Adler is not a love interest — she is the only adversary who ever outmaneuvered Sherlock Holmes and walked away clean. A mind as sharp as his, combined with an understanding of human emotion that Holmes lacks entirely. She did not defeat him with violence or deception; she defeated him by being better. To Holmes, she will always be THE woman.',
        icon: '💎',
        requiredCharacters: ['Irene Adler'],
        connections: ['bs-network', 'bs-great-detective'],
      },
      {
        id: 'bs-hound',
        chapter: 5,
        title: 'The Hound\'s True Nature',
        teaser: 'On the fog-drenched moor, something glows...',
        text: 'On the fog-drenched moor, a spectral hound prowls — glowing, enormous, seemingly supernatural. The Baskerville case is Holmes at his most dangerous: the rational mind confronting what appears to be the irrational. The hound is real, of course. The phosphorus trick is clever but crude. What makes the case legendary is not the solution but the question it forces: in a world of logic, what do we do with fear?',
        icon: '🐕',
        requiredCharacters: ['The Hound'],
        connections: ['bs-great-detective'],
      },
      {
        id: 'bs-napoleon',
        chapter: 6,
        title: 'The Napoleon of Crime',
        teaser: 'At the center of the web sits the spider...',
        text: 'Professor James Moriarty sits at the center of a web that spans all of London\'s criminal underworld. He never dirties his own hands. He is the consulting criminal — the dark mirror of Holmes himself. Every unsolved case, every perfect crime, every whispered rumor in the fog-choked alleys traces back to this quiet mathematics professor. The spider feels every vibration in his web.',
        icon: '🕷️',
        requiredCharacters: ['Professor Moriarty'],
        connections: ['bs-final-problem', 'bs-moran'],
      },
      {
        id: 'bs-moran',
        chapter: 7,
        title: 'The Brother\'s Shadow',
        teaser: 'The smarter Holmes sits in his armchair...',
        text: 'Mycroft Holmes is the British Government — not a title, but a literal description. Where Sherlock deduces from details, Mycroft processes the entire machine of state. He is lazier, fatter, and smarter than his brother. He could solve every case Sherlock takes without leaving his armchair at the Diogenes Club. He simply cannot be bothered. Power without ambition is the most dangerous force of all.',
        icon: '🎩',
        requiredCharacters: ['Mycroft Holmes'],
        connections: ['bs-napoleon', 'bs-network'],
      },
      {
        id: 'bs-final-problem',
        chapter: 8,
        title: 'The Final Problem',
        teaser: 'At Reichenbach Falls, two titans meet for the last time...',
        text: 'At the edge of the Reichenbach Falls, two titans meet for the last time. Holmes and Moriarty — order and chaos, deduction and destruction — locked in a struggle that can end only one way. The roaring water swallows their words. Watson finds only a letter and a walking stick. But the greatest minds do not die so easily. The Fall is not an ending — it is a transformation.',
        icon: '⛰️',
        requiredCharacters: ['Sherlock Holmes', 'Professor Moriarty'],
        connections: ['bs-great-detective', 'bs-napoleon'],
      },
    ],
  },
];

// Helper: get a story world by ID
export function getStoryWorld(worldId: string): StoryWorld | undefined {
  return STORY_WORLDS.find(w => w.id === worldId);
}

// Helper: check which chapters are unlocked based on owned character names
export function getUnlockedChapters(world: StoryWorld, ownedCharacters: Set<string>): Set<string> {
  const unlocked = new Set<string>();
  for (const chapter of world.chapters) {
    if (chapter.requiredCharacters.every(c => ownedCharacters.has(c))) {
      unlocked.add(chapter.id);
    }
  }
  return unlocked;
}

// Helper: get the next locked chapter (lowest chapter number not yet unlocked)
export function getNextLockedChapter(world: StoryWorld, ownedCharacters: Set<string>): StoryNode | null {
  const unlocked = getUnlockedChapters(world, ownedCharacters);
  return world.chapters.find(c => !unlocked.has(c.id)) || null;
}
