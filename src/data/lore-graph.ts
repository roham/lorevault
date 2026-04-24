// Lore Codex: directed graph of unlockable lore nodes
// Nodes unlock when the player owns cards matching requiredCharacters
// Secret nodes require cross-set combinations

export interface LoreNode {
  id: string;
  title: string;
  text: string;
  set: string;           // setSlug or 'secret' for cross-set
  icon: string;
  requiredCharacters: string[];  // character names — owning any card with that character counts
  connections: string[];         // ids of connected nodes
  secret?: boolean;
}

export const LORE_GRAPH: LoreNode[] = [
  // ═══════════════════════════════════════════
  // BAKER STREET FILES (7 nodes)
  // ═══════════════════════════════════════════
  {
    id: 'bs-great-detective',
    title: 'The Great Detective',
    text: 'At 221B Baker Street, the world\'s only consulting detective sits amid tobacco smoke and chemical apparatus. Holmes does not merely observe — he dismantles reality into its component truths. Every scratch on a watch-case, every callus on a hand, tells a story to those who know how to read it. The science of deduction is not a gift; it is a discipline honed through relentless practice and a mind that refuses to be cluttered with the unnecessary.',
    set: 'baker-street',
    icon: '🔍',
    requiredCharacters: ['Sherlock Holmes'],
    connections: ['bs-final-problem', 'bs-network', 'bs-hound'],
  },
  {
    id: 'bs-napoleon',
    title: 'The Napoleon of Crime',
    text: 'Professor James Moriarty sits at the center of a web that spans all of London\'s criminal underworld. He never dirties his own hands. He is the consulting criminal — the dark mirror of Holmes himself. Every unsolved case, every perfect crime, every whispered rumor in the fog-choked alleys traces back to this quiet mathematics professor. The spider feels every vibration in his web.',
    set: 'baker-street',
    icon: '🕷️',
    requiredCharacters: ['Professor Moriarty'],
    connections: ['bs-final-problem', 'bs-moran'],
  },
  {
    id: 'bs-final-problem',
    title: 'The Final Problem',
    text: 'At the edge of the Reichenbach Falls, two titans meet for the last time. Holmes and Moriarty — order and chaos, deduction and destruction — locked in a struggle that can end only one way. The roaring water swallows their words. Watson finds only a letter and a walking stick. But the greatest minds do not die so easily. The Fall is not an ending — it is a transformation.',
    set: 'baker-street',
    icon: '⛰️',
    requiredCharacters: ['Sherlock Holmes', 'Professor Moriarty'],
    connections: ['bs-great-detective', 'bs-napoleon'],
  },
  {
    id: 'bs-network',
    title: 'The Baker Street Network',
    text: 'No detective works alone. Watson provides the steady hand and the revolver; Mrs. Hudson provides sanctuary (and discretion); Lestrade provides the authority of Scotland Yard, however grudgingly. And below them all, the Irregulars — street children who see everything and are seen by no one. Together they form a web of intelligence that rivals Moriarty\'s own.',
    set: 'baker-street',
    icon: '🏠',
    requiredCharacters: ['Dr. Watson', 'Mrs. Hudson', 'Inspector Lestrade'],
    connections: ['bs-great-detective', 'bs-woman'],
  },
  {
    id: 'bs-woman',
    title: 'The Woman Who Beat Him',
    text: 'Irene Adler is not a love interest — she is the only adversary who ever outmaneuvered Sherlock Holmes and walked away clean. A mind as sharp as his, combined with an understanding of human emotion that Holmes lacks entirely. She did not defeat him with violence or deception; she defeated him by being better. To Holmes, she will always be THE woman.',
    set: 'baker-street',
    icon: '💎',
    requiredCharacters: ['Irene Adler'],
    connections: ['bs-network', 'bs-great-detective'],
  },
  {
    id: 'bs-hound',
    title: 'The Hound\'s True Nature',
    text: 'On the fog-drenched moor, a spectral hound prowls — glowing, enormous, seemingly supernatural. The Baskerville case is Holmes at his most dangerous: the rational mind confronting what appears to be the irrational. The hound is real, of course. The phosphorus trick is clever but crude. What makes the case legendary is not the solution but the question it forces: in a world of logic, what do we do with fear?',
    set: 'baker-street',
    icon: '🐕',
    requiredCharacters: ['The Hound'],
    connections: ['bs-great-detective'],
  },
  {
    id: 'bs-moran',
    title: 'The Brother\'s Shadow',
    text: 'Mycroft Holmes is the British Government — not a title, but a literal description. Where Sherlock deduces from details, Mycroft processes the entire machine of state. He is lazier, fatter, and smarter than his brother. He could solve every case Sherlock takes without leaving his armchair at the Diogenes Club. He simply cannot be bothered. Power without ambition is the most dangerous force of all.',
    set: 'baker-street',
    icon: '🎩',
    requiredCharacters: ['Mycroft Holmes'],
    connections: ['bs-napoleon', 'bs-network'],
  },

  // ═══════════════════════════════════════════
  // THE ENCHANTED KINGDOM (7 nodes)
  // ═══════════════════════════════════════════
  {
    id: 'ek-mirror',
    title: 'The Mirror\'s Truth',
    text: 'The Magic Mirror does not lie — that is its curse. The Evil Queen asks "who is fairest?" not seeking truth but seeking validation. When the mirror speaks Snow White\'s name, it shatters not glass but the Queen\'s entire identity. The original Grimm tale is far darker than Disney remembered: the Queen dances to death in iron shoes heated red-hot. Vanity, the tale warns, is a poison that kills the poisoner.',
    set: 'enchanted-kingdom',
    icon: '🪞',
    requiredCharacters: ['Snow White', 'The Evil Queen'],
    connections: ['ek-sleeping', 'ek-dark-side'],
  },
  {
    id: 'ek-forest',
    title: 'Trials of the Forest',
    text: 'In every Grimm tale, the forest is the same forest. Red Riding Hood\'s dark path, Hansel and Gretel\'s breadcrumb trail — the forest is not a place but a threshold. It is where civilization ends and transformation begins. The children who enter are naive; the children who emerge (if they emerge) have learned the world\'s true nature. The forest does not care about innocence.',
    set: 'enchanted-kingdom',
    icon: '🌲',
    requiredCharacters: ['Red Riding Hood', 'Hansel', 'Gretel'],
    connections: ['ek-mirror', 'ek-guardians'],
  },
  {
    id: 'ek-curses',
    title: 'Curses and Transformations',
    text: 'The Frog Prince and the Beast share a secret: the curse is not the transformation — the curse is the truth it reveals. The Beast is monstrous not because of the enchantment but because he was a monster before it. The Frog is noble not because he was a prince but because he remained kind while enchanted. In fairy tales, the outer form always reflects the inner reality. Eventually.',
    set: 'enchanted-kingdom',
    icon: '🐸',
    requiredCharacters: ['The Frog Prince', 'The Beast'],
    connections: ['ek-spinner', 'ek-mirror'],
  },
  {
    id: 'ek-spinner',
    title: 'The Spinner\'s Bargain',
    text: 'Rumpelstiltskin offers an impossible deal: gold from straw, but the price is a firstborn child. This is the economics of fairy tales — nothing is free, and the cost is always higher than it appears. His name is his vulnerability, his secret self. When the Queen discovers it, she doesn\'t just break a deal; she strips away his power by naming the unnamed. In stories, knowing a thing\'s true name gives you power over it.',
    set: 'enchanted-kingdom',
    icon: '🧵',
    requiredCharacters: ['Rumpelstiltskin'],
    connections: ['ek-curses', 'ek-dark-side'],
  },
  {
    id: 'ek-sleeping',
    title: 'Sleeping Enchantments',
    text: 'Snow White in her glass coffin. Sleeping Beauty behind her wall of thorns. Two princesses suspended in deathlike sleep, preserved in perfect beauty, waiting. The original tales are not about rescue — they are about time. The sleeper misses the world changing around her. When she wakes, nothing is the same. Sleep is not rest; it is exile from the flow of life.',
    set: 'enchanted-kingdom',
    icon: '💤',
    requiredCharacters: ['Sleeping Beauty', 'Snow White'],
    connections: ['ek-mirror', 'ek-guardians'],
  },
  {
    id: 'ek-dark-side',
    title: 'The Dark Side of Fairy Tales',
    text: 'Bluebeard\'s forbidden chamber holds the bodies of his previous wives. The Evil Queen orders a child\'s heart cut out. These are not children\'s stories — they never were. The Brothers Grimm collected folk tales that served as survival warnings: do not trust strangers, do not be vain, do not open doors you were told to keep shut. The darkness is the lesson.',
    set: 'enchanted-kingdom',
    icon: '🔑',
    requiredCharacters: ['Bluebeard', 'The Evil Queen'],
    connections: ['ek-spinner', 'ek-forest'],
  },
  {
    id: 'ek-guardians',
    title: 'Seven Protectors',
    text: 'The Seven Dwarfs take Snow White in because she is useful — she cooks and cleans. The Huntsman spares her because his conscience outweighs his fear. Protection in fairy tales is never unconditional. It comes with bargains, expectations, and always a test. The Huntsman chose mercy once and it cost him everything. The Dwarfs chose compassion and it brought death to their doorstep.',
    set: 'enchanted-kingdom',
    icon: '⛏️',
    requiredCharacters: ['The Seven Dwarfs', 'The Huntsman'],
    connections: ['ek-sleeping', 'ek-forest'],
  },

  // ═══════════════════════════════════════════
  // WONDERLAND DESCENDING (7 nodes)
  // ═══════════════════════════════════════════
  {
    id: 'wl-rabbit-hole',
    title: 'Down the Rabbit Hole',
    text: 'Alice follows the White Rabbit not because she is brave but because she is bored. This is Carroll\'s first and most devastating insight: curiosity and recklessness look identical from the outside. The fall is long — long enough for Alice to wonder if she\'ll fall right through the earth. Wonderland doesn\'t begin with a door or a spell. It begins with a choice made without thinking.',
    set: 'wonderland',
    icon: '🕳️',
    requiredCharacters: ['Alice', 'The White Rabbit'],
    connections: ['wl-tea-party', 'wl-size', 'wl-cheshire'],
  },
  {
    id: 'wl-tea-party',
    title: 'The Mad Tea Party',
    text: 'The Hatter, the Hare, and the Dormouse are trapped at 6 o\'clock — tea time forever. Time himself (for Time is a "him" in Wonderland) stopped the clock as punishment for the Hatter\'s bad singing. This is Carroll\'s meditation on eternity: an endless party with no new guests, no new conversation, just the same seats shuffling round and round. Madness is not chaos — it is pattern without purpose.',
    set: 'wonderland',
    icon: '🫖',
    requiredCharacters: ['The Mad Hatter', 'The March Hare', 'The Dormouse'],
    connections: ['wl-rabbit-hole', 'wl-trial'],
  },
  {
    id: 'wl-tyranny',
    title: 'Tyranny in Wonderland',
    text: 'The Queen of Hearts rules through terror — "Off with their heads!" — but no one is ever actually beheaded. The King quietly pardons everyone. This is Carroll\'s perfect satire of power: the tyrant is theatrical, the bureaucracy is toothless, and the subjects perform fear because the performance is the system. Wonderland\'s government is absurd because all government, to a mathematician, is absurd.',
    set: 'wonderland',
    icon: '♥️',
    requiredCharacters: ['The Queen of Hearts', 'The King of Hearts'],
    connections: ['wl-trial', 'wl-jabberwock'],
  },
  {
    id: 'wl-cheshire',
    title: 'Cheshire\'s Riddles',
    text: '"We\'re all mad here." The Cheshire Cat is the only honest character in Wonderland — and therefore the most dangerous. He tells Alice that every direction leads somewhere, which is true and useless in equal measure. He can appear and disappear at will, leaving only his grin. He is meaning itself: present, then absent, then just the smile of meaning where meaning used to be.',
    set: 'wonderland',
    icon: '😸',
    requiredCharacters: ['The Cheshire Cat'],
    connections: ['wl-rabbit-hole', 'wl-tyranny'],
  },
  {
    id: 'wl-size',
    title: 'Size Matters Not',
    text: '"Who are YOU?" asks the Caterpillar. Alice can\'t answer — she\'s been so many sizes today she doesn\'t know who she is anymore. Carroll\'s children understand what adults forget: identity is not fixed. You are not the same person you were this morning. The mushroom that makes you grow and the mushroom that makes you shrink are the same mushroom — it depends on which side you eat.',
    set: 'wonderland',
    icon: '🍄',
    requiredCharacters: ['Alice', 'The Caterpillar'],
    connections: ['wl-rabbit-hole', 'wl-trial'],
  },
  {
    id: 'wl-jabberwock',
    title: 'The Jabberwock\'s Shadow',
    text: 'The Jabberwock is the one genuinely dangerous thing in Wonderland — not absurd, not satirical, but monstrous. "The jaws that bite, the claws that catch!" It exists in a poem within the world, a story within the story. Carroll knew that even in a land of pure nonsense, there must be something that is not funny. The Jabberwock is the darkness that gives the nonsense its shape.',
    set: 'wonderland',
    icon: '🐉',
    requiredCharacters: ['The Jabberwock'],
    connections: ['wl-tyranny', 'wl-cheshire'],
  },
  {
    id: 'wl-trial',
    title: 'The Trial of Nonsense',
    text: '"Sentence first — verdict afterwards!" The trial of the Knave of Hearts is Carroll\'s masterpiece of absurdist logic. Evidence is meaningless, witnesses are hostile, the judge is the prosecution. Alice finally realizes the truth: "You\'re nothing but a pack of cards!" The moment you see through the system, it collapses. Wonderland doesn\'t end because Alice escapes. It ends because she stops believing.',
    set: 'wonderland',
    icon: '⚖️',
    requiredCharacters: ['The Knave of Hearts', 'Alice'],
    connections: ['wl-tea-party', 'wl-tyranny', 'wl-size'],
  },

  // ═══════════════════════════════════════════
  // THE CASTLE OF OTRANTO (7 nodes)
  // ═══════════════════════════════════════════
  {
    id: 'gh-undead',
    title: 'The Undead Lords',
    text: 'Count Dracula is not merely a vampire — he is aristocracy distilled to its purest horror. He consumes the life of others to sustain his own immortality. Lucy Westenra, once innocent, becomes his mirror: proof that the monster\'s gift is contagious. The vampire myth endures because it tells the truth about power: it feeds on the living and creates copies of itself.',
    set: 'gothic-horror',
    icon: '🧛',
    requiredCharacters: ['Count Dracula', 'Lucy Westenra'],
    connections: ['gh-hunters', 'gh-masks'],
  },
  {
    id: 'gh-playing-god',
    title: 'Playing God',
    text: 'Victor Frankenstein does not create life — he abandons it. The Creature is born innocent, learns language from Milton, and becomes monstrous only after its creator rejects it. Shelley\'s genius is making both creator and creation sympathetic and guilty. The Creature is not the villain; neither is Victor. The villain is the act of creation without responsibility.',
    set: 'gothic-horror',
    icon: '⚡',
    requiredCharacters: ['Victor Frankenstein', 'Frankenstein\'s Monster'],
    connections: ['gh-science', 'gh-duality'],
  },
  {
    id: 'gh-duality',
    title: 'Duality of Man',
    text: 'Dr. Jekyll believed he could separate good from evil like a chemist separates elements. He was right — and it destroyed him. Mr. Hyde is not Jekyll\'s opposite; he is Jekyll\'s truth, the self that exists when conscience sleeps. Stevenson\'s novella is the foundational text of modern psychology: we are not one self but many, and the worst of them is the one we pretend doesn\'t exist.',
    set: 'gothic-horror',
    icon: '🧪',
    requiredCharacters: ['Dr. Jekyll', 'Mr. Hyde'],
    connections: ['gh-playing-god', 'gh-masks'],
  },
  {
    id: 'gh-masks',
    title: 'The Masks We Wear',
    text: 'The Phantom hides deformity behind a mask; Dorian Gray hides corruption behind eternal beauty. Both are stories about surfaces: what happens when the outside no longer matches the inside? The Phantom\'s mask comes off to reveal horror. Dorian\'s portrait absorbs horror so his face stays perfect. In Gothic literature, the truth always finds a surface — if not the face, then the mirror.',
    set: 'gothic-horror',
    icon: '🎭',
    requiredCharacters: ['The Phantom', 'Dorian Gray'],
    connections: ['gh-undead', 'gh-duality'],
  },
  {
    id: 'gh-hunters',
    title: 'The Hunters',
    text: 'Van Helsing arrives with garlic, crucifixes, and an unshakeable conviction that evil is real. Mina Harker brings something more dangerous: intelligence, compassion, and a connection to the enemy (Dracula\'s bite links their minds). The hunters succeed not through violence but through knowledge — Stoker\'s novel is structured as letters, diaries, and telegrams. Information defeats the monster.',
    set: 'gothic-horror',
    icon: '✝️',
    requiredCharacters: ['Van Helsing', 'Mina Harker'],
    connections: ['gh-undead', 'gh-legends'],
  },
  {
    id: 'gh-science',
    title: 'The Invisible Terror',
    text: 'Griffin makes himself invisible and immediately turns to crime. Moreau reshapes animals into human parodies. Wells and his contemporaries asked the question the 20th century would answer: what happens when science outpaces ethics? The Invisible Man cannot be seen but can still be caught — because invisibility doesn\'t grant wisdom, only impunity. And impunity always ends.',
    set: 'gothic-horror',
    icon: '👻',
    requiredCharacters: ['The Invisible Man', 'Dr. Moreau'],
    connections: ['gh-playing-god', 'gh-legends'],
  },
  {
    id: 'gh-legends',
    title: 'Gothic Legends',
    text: 'The Headless Horseman rides because revenge doesn\'t die with the body. Captain Nemo descends because civilization above has failed. Quasimodo rings his bells because beauty, to him, is sound, not sight. Each figure represents a different mode of Gothic exile — from life, from society, from the body itself. They haunt the margins because the center has no place for them.',
    set: 'gothic-horror',
    icon: '🐴',
    requiredCharacters: ['The Headless Horseman', 'Captain Nemo'],
    connections: ['gh-science', 'gh-hunters'],
  },

  // ═══════════════════════════════════════════
  // OLYMPUS RISING (7 nodes)
  // ═══════════════════════════════════════════
  {
    id: 'ol-trojan-war',
    title: 'The Trojan War',
    text: 'Helen\'s face launched a thousand ships, but the war was never about Helen. It was about pride — Agamemnon\'s, Achilles\', Paris\'s. Ten years of siege, the greatest heroes of Greece dead in the dust, all because men could not swallow their pride. Achilles chose a short, glorious life over a long, forgotten one. He got exactly what he asked for. Glory is a beautiful corpse.',
    set: 'olympus',
    icon: '🏛️',
    requiredCharacters: ['Achilles', 'Helen of Troy'],
    connections: ['ol-wanderer', 'ol-warriors'],
  },
  {
    id: 'ol-wanderer',
    title: 'The Wanderer\'s Return',
    text: 'Odysseus is the cleverest of the Greeks — and cleverness is its own punishment. His journey home takes ten years not because the sea is vast but because his cunning keeps creating new problems. He tricks the Cyclops but earns Poseidon\'s wrath. He resists the Sirens but only by binding himself. The Odyssey is the original lesson: intelligence without humility is just a longer road to the same place.',
    set: 'olympus',
    icon: '🚢',
    requiredCharacters: ['Odysseus'],
    connections: ['ol-trojan-war', 'ol-monsters', 'ol-love'],
  },
  {
    id: 'ol-three-brothers',
    title: 'The Power of the Gods',
    text: 'Zeus took the sky, Poseidon the sea, Hades the underworld. Three brothers who divided creation like a business deal. Zeus is thunder and authority; Poseidon is depths and rage; Hades is silence and inevitability. They don\'t fight often — they don\'t need to. Each rules absolutely within his domain. The Greeks understood what modern politics forgets: power shared is power balanced.',
    set: 'olympus',
    icon: '⚡',
    requiredCharacters: ['Zeus', 'Poseidon', 'Hades'],
    connections: ['ol-defiance', 'ol-warriors'],
  },
  {
    id: 'ol-monsters',
    title: 'Monsters of Myth',
    text: 'Medusa was beautiful once — Athena cursed her for being assaulted in Athena\'s temple. The Minotaur was born from divine punishment on King Minos. In Greek mythology, monsters are never random. They are consequences. Every creature with too many heads or too many eyes exists because a god was angry or a mortal was arrogant. The labyrinth doesn\'t contain the Minotaur — it contains the king\'s shame.',
    set: 'olympus',
    icon: '🐍',
    requiredCharacters: ['Medusa', 'The Minotaur'],
    connections: ['ol-wanderer', 'ol-warriors'],
  },
  {
    id: 'ol-defiance',
    title: 'Defying the Gods',
    text: 'Prometheus stole fire because humans were cold and the gods were indifferent. Icarus flew too high because his father made him wings and freedom is intoxicating. Both paid the price: Prometheus chained to a rock, his liver eaten daily; Icarus drowned, forgotten except as a warning. The Greeks admired defiance even as they punished it. To reach beyond your station is divine. To fall is human.',
    set: 'olympus',
    icon: '🔥',
    requiredCharacters: ['Prometheus', 'Icarus'],
    connections: ['ol-three-brothers', 'ol-love'],
  },
  {
    id: 'ol-love',
    title: 'Love and the Underworld',
    text: 'Orpheus descends to Hades for love and almost succeeds — one backward glance destroys everything. Circe enchants men into pigs, not from cruelty but from contempt: she shows them what they already are. Love in Greek myth is never safe. It is a force as dangerous as any monster, as unpredictable as any god. Aphrodite herself was born from violence. Love is not gentle; it is transformative.',
    set: 'olympus',
    icon: '🎵',
    requiredCharacters: ['Orpheus', 'Circe'],
    connections: ['ol-wanderer', 'ol-defiance'],
  },
  {
    id: 'ol-warriors',
    title: 'The Warrior\'s Path',
    text: 'Perseus had Athena\'s shield. Hercules had divine blood. Ares had immortality. Yet the warrior\'s path destroys them all in different ways. Perseus becomes a king but loses his humanity. Hercules completes twelve labors but murders his own family. Ares is feared but never respected. Greek heroism is not triumph — it is endurance in the face of guaranteed suffering.',
    set: 'olympus',
    icon: '⚔️',
    requiredCharacters: ['Perseus', 'Athena', 'Hercules'],
    connections: ['ol-trojan-war', 'ol-three-brothers', 'ol-monsters'],
  },

  // ═══════════════════════════════════════════
  // ASGARD UNLEASHED (7 nodes)
  // ═══════════════════════════════════════════
  {
    id: 'as-allfather',
    title: 'The All-Father\'s Price',
    text: 'Odin hung himself from Yggdrasil for nine nights, pierced by his own spear, sacrificed to himself. He gave an eye to Mimir\'s well for a single drink of wisdom. Every power Odin possesses was purchased with pain. This is the Norse understanding of knowledge: it is never given, only traded. The wise man is not the one who knows the most — he is the one who has paid the most to know it.',
    set: 'asgard',
    icon: '👁️',
    requiredCharacters: ['Odin'],
    connections: ['as-fate', 'as-binding', 'as-ragnarok'],
  },
  {
    id: 'as-trickster',
    title: 'The Trickster\'s Chain',
    text: 'Loki is not evil — he is inevitable. He is the force of change in a universe that resists it. He cuts Sif\'s hair for mischief, fathers Fenrir the world-devouring wolf, and will one day lead the armies of the dead against the gods. But the Aesir need him: without Loki, there would be no Mjolnir, no walls of Asgard, no golden apples. Chaos is not the enemy of order. It is the price.',
    set: 'asgard',
    icon: '🐍',
    requiredCharacters: ['Loki', 'Fenrir'],
    connections: ['as-allfather', 'as-ragnarok', 'as-binding'],
  },
  {
    id: 'as-ragnarok',
    title: 'Ragnarok Approaches',
    text: 'Thor will kill the Midgard Serpent and die of its venom. Odin will be swallowed by Fenrir. Surtr will burn the nine worlds to ash. The Norse knew their gods would die — and worshipped them anyway. Ragnarok is not a threat; it is a certainty. What makes the Norse myths unique is this acceptance: courage is not fighting to win. Courage is fighting when you know you will lose.',
    set: 'asgard',
    icon: '🔥',
    requiredCharacters: ['Thor', 'Jormungandr', 'Surtr'],
    connections: ['as-trickster', 'as-allfather', 'as-dragon'],
  },
  {
    id: 'as-shieldmaidens',
    title: 'The Shield-Maidens',
    text: 'Brynhildr sleeps in a ring of fire, waiting for a hero brave enough to cross it. Freya weeps golden tears for her lost husband and rides to battle in a chariot pulled by cats. Skadi chose a husband by his feet and got the wrong god. Norse women are not passive — they choose, they fight, they grieve with the same ferocity as any warrior. The Valkyries choose who lives and dies. Power in the Norse world knows no gender.',
    set: 'asgard',
    icon: '🛡️',
    requiredCharacters: ['Brynhildr', 'Freya', 'Skadi'],
    connections: ['as-allfather', 'as-dragon'],
  },
  {
    id: 'as-binding',
    title: 'The Binding',
    text: 'When the gods bound Fenrir with Gleipnir — a chain made of impossible things: the sound of a cat\'s footfall, the beard of a woman, the roots of a mountain — only Tyr was brave enough to place his hand in the wolf\'s mouth as a pledge of good faith. When the wolf realized the deception, it bit off Tyr\'s hand. Honor in Norse mythology is not about being right. It is about paying the price when you are wrong.',
    set: 'asgard',
    icon: '⚔️',
    requiredCharacters: ['Tyr', 'Fenrir'],
    connections: ['as-trickster', 'as-allfather'],
  },
  {
    id: 'as-fate',
    title: 'Fate\'s Weavers',
    text: 'The Norns sit at the root of Yggdrasil, weaving the fates of gods and men. Even Odin cannot change what they decree. Huginn and Muninn — Thought and Memory — fly the world each day and return to whisper in Odin\'s ear. He fears for Thought, but fears more for Memory. Without memory, wisdom is meaningless. Without thought, memory is just pain. The All-Father needs both and trusts neither.',
    set: 'asgard',
    icon: '🧵',
    requiredCharacters: ['The Norns', 'Huginn & Muninn'],
    connections: ['as-allfather', 'as-shieldmaidens'],
  },
  {
    id: 'as-dragon',
    title: 'The Dragon Slayer',
    text: 'Sigurd kills Fafnir not with strength but with a trench and a blade thrust upward — cunning over force. He tastes the dragon\'s blood and suddenly understands the speech of birds. Ragnar Lothbrok faces death in a pit of serpents and laughs, knowing his sons will avenge him. The Norse mortal heroes are defined not by their victories but by their manner of death. A good death is the only true immortality.',
    set: 'asgard',
    icon: '🗡️',
    requiredCharacters: ['Sigurd', 'Ragnar'],
    connections: ['as-ragnarok', 'as-shieldmaidens'],
  },

  // ═══════════════════════════════════════════
  // SECRET NODES (6 cross-set combinations)
  // ═══════════════════════════════════════════
  {
    id: 'secret-detectives-vs-monsters',
    title: 'The Great Detective vs The Monster',
    text: 'What if Sherlock Holmes had faced Count Dracula? Holmes would catalogue the evidence — the bite marks, the missing mirrors, the nocturnal habits — and deduce the impossible: that the vampire is real. But Holmes\'s method requires a rational universe. Dracula exists outside that framework. The detective who trusts only evidence would need Van Helsing\'s faith to survive. Logic alone cannot defeat what logic cannot explain.',
    set: 'secret',
    icon: '🔍🧛',
    requiredCharacters: ['Sherlock Holmes', 'Count Dracula', 'Van Helsing'],
    connections: ['bs-great-detective', 'gh-undead', 'gh-hunters'],
    secret: true,
  },
  {
    id: 'secret-mirrors',
    title: 'Mirrors Between Worlds',
    text: 'The Evil Queen\'s Magic Mirror shows truth. Alice\'s Looking Glass shows nonsense. The Cheshire Cat grins from both sides. All three reveal the same secret: mirrors don\'t reflect reality — they reflect the viewer\'s expectations. The Queen sees threats because she is threatened. Alice sees madness because she is rational. The Cat sees everything because he expects nothing. Every portal between worlds is ultimately a mirror.',
    set: 'secret',
    icon: '🪞😸',
    requiredCharacters: ['The Evil Queen', 'Alice', 'The Cheshire Cat'],
    connections: ['ek-mirror', 'wl-cheshire', 'wl-rabbit-hole'],
    secret: true,
  },
  {
    id: 'secret-serpents',
    title: 'Serpents Across Mythology',
    text: 'Jormungandr encircles the world. Medusa wears serpents as hair. The Hound of the Baskervilles glows with phosphorescent hellfire. Across every mythology, the serpent represents the same thing: the boundary between known and unknown. To face the serpent is to face the edge of the map, the place where "here be dragons" was written. Every hero who defeats a serpent is really conquering the limits of human understanding.',
    set: 'secret',
    icon: '🐍🌊',
    requiredCharacters: ['Jormungandr', 'Medusa', 'The Hound'],
    connections: ['as-ragnarok', 'ol-monsters', 'bs-hound'],
    secret: true,
  },
  {
    id: 'secret-immortality',
    title: 'The Price of Immortality',
    text: 'Dorian Gray stays young while his portrait rots. Dracula persists through centuries by drinking the living. Odin traded an eye for the wisdom to survive Ragnarok — which he knows he won\'t survive anyway. Immortality in literature is never a gift; it is a transaction with increasingly brutal terms. The immortal does not escape death — they merely extend the invoice. The longer you live, the more you owe.',
    set: 'secret',
    icon: '♾️',
    requiredCharacters: ['Dorian Gray', 'Count Dracula', 'Odin'],
    connections: ['gh-masks', 'gh-undead', 'as-allfather'],
    secret: true,
  },
  {
    id: 'secret-tricksters',
    title: 'Tricksters United',
    text: 'Loki, Rumpelstiltskin, and the Cheshire Cat walk into a bar — and reality bends around them. The Trickster archetype exists in every mythology because every system needs a pressure valve. Loki breaks divine law. Rumpelstiltskin breaks mortal bargains. The Cat breaks logic itself. They are agents of chaos, yes, but also agents of change. Without tricksters, stories would be sermons and gods would be tyrants.',
    set: 'secret',
    icon: '🃏',
    requiredCharacters: ['Loki', 'Rumpelstiltskin', 'The Cheshire Cat'],
    connections: ['as-trickster', 'ek-spinner', 'wl-cheshire'],
    secret: true,
  },
  {
    id: 'secret-last-battle',
    title: 'The Last Battle',
    text: 'Four champions from four worlds: Thor, who fights knowing he will die. Achilles, who chose glory over life. Sherlock Holmes, who trusts only his mind. Alice, who trusts only her wonder. If they met on a single battlefield, what would they fight for? Thor would fight for honor. Achilles for fame. Holmes for truth. Alice would ask why they\'re fighting at all — and she would be the only one who wins.',
    set: 'secret',
    icon: '⚔️👑',
    requiredCharacters: ['Thor', 'Achilles', 'Sherlock Holmes', 'Alice'],
    connections: ['as-ragnarok', 'ol-trojan-war', 'bs-great-detective', 'wl-rabbit-hole'],
    secret: true,
  },
];

// Helpers
export function getLoreNodeById(id: string): LoreNode | undefined {
  return LORE_GRAPH.find(n => n.id === id);
}

export function getLoreNodesBySet(setSlug: string): LoreNode[] {
  return LORE_GRAPH.filter(n => n.set === setSlug);
}

export function getSecretNodes(): LoreNode[] {
  return LORE_GRAPH.filter(n => n.secret);
}

export function getTotalNodeCount(): number {
  return LORE_GRAPH.length;
}
