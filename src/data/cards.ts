import { Card, Scarcity, Parallel } from './types';

// Characters per set with their moments and lore
const SET_CHARACTERS = {
  'baker-street': [
    { character: 'Sherlock Holmes', moment: 'At 221B Baker Street', loreText: '"When you have eliminated the impossible, whatever remains, however improbable, must be the truth."', symbol: '🔍', gradientFrom: '#1a1a2e', gradientTo: '#16213e' },
    { character: 'Sherlock Holmes', moment: 'The Reichenbach Falls', loreText: '"It is with a heavy heart that I take up my pen to write these the last words in which I shall ever record the singular gifts by which my friend Mr. Sherlock Holmes was distinguished."', symbol: '⛰️', gradientFrom: '#1e293b', gradientTo: '#0f172a' },
    { character: 'Sherlock Holmes', moment: 'In Disguise at the Docks', loreText: '"You see, but you do not observe. The distinction is clear."', symbol: '🎭', gradientFrom: '#172038', gradientTo: '#0c1425' },
    { character: 'Dr. Watson', moment: 'The Faithful Companion', loreText: '"I am lost without my Boswell."', symbol: '📝', gradientFrom: '#1a2332', gradientTo: '#0d1520' },
    { character: 'Professor Moriarty', moment: 'The Napoleon of Crime', loreText: '"He is the Napoleon of crime, Watson. He is the organizer of half that is evil and of nearly all that is undetected in this great city."', symbol: '🕷️', gradientFrom: '#1a0f2e', gradientTo: '#0d0720' },
    { character: 'Irene Adler', moment: 'The Woman', loreText: '"To Sherlock Holmes she is always THE woman. In his eyes she eclipses and predominates the whole of her sex."', symbol: '💎', gradientFrom: '#2e1a2a', gradientTo: '#1a0d18' },
    { character: 'Mrs. Hudson', moment: 'The Landlady of Baker Street', loreText: '"Mrs. Hudson, the landlady of Sherlock Holmes, was a long-suffering woman."', symbol: '🏠', gradientFrom: '#1f1a15', gradientTo: '#14100c' },
    { character: 'Inspector Lestrade', moment: 'Scotland Yard\'s Finest', loreText: '"We know that he did not come through the door, the window, or the chimney. We also know that he could not have been concealed in the room."', symbol: '🏛️', gradientFrom: '#15202e', gradientTo: '#0c1520' },
    { character: 'The Hound', moment: 'On the Moor', loreText: '"A hound it was, an enormous coal-black hound, but not such a hound as mortal eyes have ever seen."', symbol: '🐕', gradientFrom: '#1a1a1a', gradientTo: '#0d0d0d' },
    { character: 'Sherlock Holmes', moment: 'The Violin at Midnight', loreText: '"My mind rebels at stagnation. Give me problems, give me work."', symbol: '🎻', gradientFrom: '#1a1428', gradientTo: '#0d0a18' },
    { character: 'Sherlock Holmes', moment: 'The Seven-Per-Cent Solution', loreText: '"My mind is like a racing engine, tearing itself to pieces because it is not connected up with the work for which it was built."', symbol: '💉', gradientFrom: '#28141a', gradientTo: '#180a0d' },
    { character: 'Mycroft Holmes', moment: 'The Diogenes Club', loreText: '"All other men are specialists, but his specialism is omniscience."', symbol: '🎩', gradientFrom: '#1a1e2e', gradientTo: '#0d1020' },
    { character: 'Dr. Watson', moment: 'Return from Afghanistan', loreText: '"I have been in Afghanistan, I perceived."', symbol: '⚔️', gradientFrom: '#2e2a1a', gradientTo: '#201c0d' },
    { character: 'Sherlock Holmes', moment: 'The Pipe and the Problem', loreText: '"It is quite a three-pipe problem, and I beg that you won\'t speak to me for fifty minutes."', symbol: '🪈', gradientFrom: '#1a2028', gradientTo: '#0d1418' },
    { character: 'Sebastian Moran', moment: 'The Second Most Dangerous Man', loreText: '"The second most dangerous man in London."', symbol: '🎯', gradientFrom: '#2e1a1a', gradientTo: '#200d0d' },
    { character: 'The Red-Headed League', moment: 'The Curious Advertisement', loreText: '"It is a curious collection of commonplaces that I have gathered together."', symbol: '🔴', gradientFrom: '#2e1414', gradientTo: '#200c0c' },
    { character: 'Sherlock Holmes', moment: 'The Magnifying Glass', loreText: '"Data! Data! Data! I can\'t make bricks without clay."', symbol: '🔎', gradientFrom: '#1a1e24', gradientTo: '#0d1015' },
    { character: 'The Dancing Men', moment: 'The Cipher', loreText: '"What one man can invent, another can discover."', symbol: '💃', gradientFrom: '#1e1a2e', gradientTo: '#100d20' },
    { character: 'Dr. Watson', moment: 'The Revolver Ready', loreText: '"I should be happy to go, Holmes — and I am sure that my friend would be equally pleased."', symbol: '🔫', gradientFrom: '#1a2020', gradientTo: '#0d1414' },
    { character: 'The Baker Street Irregulars', moment: 'Street Urchin Intelligence', loreText: '"There\'s more work to be got out of one of those little beggars than out of a dozen of the force."', symbol: '👦', gradientFrom: '#201a1a', gradientTo: '#140d0d' },
  ],
  'enchanted-kingdom': [
    { character: 'Snow White', moment: 'The Poisoned Apple', loreText: '"Mirror, mirror on the wall, who in this land is fairest of all?"', symbol: '🍎', gradientFrom: '#2e0a1a', gradientTo: '#1a0610' },
    { character: 'The Evil Queen', moment: 'Before the Magic Mirror', loreText: '"She was a beautiful woman, but proud and haughty, and she could not bear that anyone else should surpass her in beauty."', symbol: '👿', gradientFrom: '#1a0a2e', gradientTo: '#100620' },
    { character: 'Snow White', moment: 'Asleep in the Glass Coffin', loreText: '"They laid her upon a bier, and all seven of them sat round it and wept for her, and wept three days long."', symbol: '⚰️', gradientFrom: '#2e1a2e', gradientTo: '#1a101a' },
    { character: 'The Huntsman', moment: 'The Impossible Choice', loreText: '"It was a wild boar\'s heart which the Queen ate, believing it to be Snow White\'s."', symbol: '🗡️', gradientFrom: '#0a2e14', gradientTo: '#061a0c' },
    { character: 'Rapunzel', moment: 'The Tower Window', loreText: '"Rapunzel, Rapunzel, let down your hair, so that I may climb the golden stair."', symbol: '🗼', gradientFrom: '#2e2e0a', gradientTo: '#1a1a06' },
    { character: 'Cinderella', moment: 'The Glass Slipper', loreText: '"No sooner had she touched her than the maiden was changed into the most beautiful princess."', symbol: '👠', gradientFrom: '#1a2e2e', gradientTo: '#101a1a' },
    { character: 'Red Riding Hood', moment: 'The Dark Forest Path', loreText: '"All the better to see you with, my dear!"', symbol: '🐺', gradientFrom: '#2e0a0a', gradientTo: '#1a0606' },
    { character: 'Hansel', moment: 'The Trail of Breadcrumbs', loreText: '"Be quiet, Gretel, do not distress thyself, I will soon find a way to help us."', symbol: '🍞', gradientFrom: '#2e2a14', gradientTo: '#1a180c' },
    { character: 'Gretel', moment: 'Pushing the Witch', loreText: '"Then Gretel gave her a push that drove her far into it, and shut the iron door, and fastened the bolt."', symbol: '🔥', gradientFrom: '#2e1a0a', gradientTo: '#1a1006' },
    { character: 'The Frog Prince', moment: 'The Golden Ball', loreText: '"In olden times when wishing still helped, there lived a king whose daughters were all beautiful."', symbol: '🐸', gradientFrom: '#0a2e0a', gradientTo: '#061a06' },
    { character: 'Rumpelstiltskin', moment: 'Spinning Gold', loreText: '"Today I bake, tomorrow brew, the next I\'ll have the young queen\'s child. Ha! Glad am I that no one knew that Rumpelstiltskin I am styled!"', symbol: '🧵', gradientFrom: '#2e2e0a', gradientTo: '#1a1a06' },
    { character: 'Sleeping Beauty', moment: 'The Spindle\'s Prick', loreText: '"The King ordered every spindle in the whole kingdom to be burnt."', symbol: '💤', gradientFrom: '#1a0a2e', gradientTo: '#100620' },
    { character: 'The Evil Queen', moment: 'The Poisoned Comb', loreText: '"Now I will contrive something that shall put an end to thee."', symbol: '💀', gradientFrom: '#2e0a2e', gradientTo: '#1a061a' },
    { character: 'The Seven Dwarfs', moment: 'Marching Home', loreText: '"Heigh-ho, heigh-ho, it\'s home from work we go."', symbol: '⛏️', gradientFrom: '#14201a', gradientTo: '#0c1410' },
    { character: 'The Pied Piper', moment: 'Leading the Children', loreText: '"A wondrous portal opened wide, as if a cavern was suddenly hollowed."', symbol: '🎵', gradientFrom: '#1a142e', gradientTo: '#100c1a' },
    { character: 'Beauty', moment: 'The Enchanted Rose', loreText: '"She found the Beast stretched on the grass, and she thought he was dead."', symbol: '🌹', gradientFrom: '#2e0a14', gradientTo: '#1a060c' },
    { character: 'The Beast', moment: 'In the Cursed Castle', loreText: '"You must not look at the surface of things. My heart is good, though my appearance is frightful."', symbol: '🏰', gradientFrom: '#1a1428', gradientTo: '#0d0a18' },
    { character: 'Jack', moment: 'The Beanstalk', loreText: '"Fee-fi-fo-fum, I smell the blood of an Englishman."', symbol: '🌱', gradientFrom: '#0a2e14', gradientTo: '#061a0c' },
    { character: 'Puss in Boots', moment: 'The Clever Cat', loreText: '"My master, the Marquis of Carabas, has sent me to present you with this rabbit."', symbol: '🐱', gradientFrom: '#2e1a0a', gradientTo: '#1a1006' },
    { character: 'Bluebeard', moment: 'The Forbidden Chamber', loreText: '"You may open everything, go everywhere, except into that little room, which I forbid you."', symbol: '🔑', gradientFrom: '#0a1a2e', gradientTo: '#06101a' },
  ],
  'wonderland': [
    { character: 'Alice', moment: 'Falling Down the Rabbit Hole', loreText: '"Down, down, down. Would the fall never come to an end?"', symbol: '🕳️', gradientFrom: '#0a2e1a', gradientTo: '#061a10' },
    { character: 'The Cheshire Cat', moment: 'Fading to a Grin', loreText: '"We\'re all mad here. I\'m mad. You\'re mad."', symbol: '😸', gradientFrom: '#2e0a2e', gradientTo: '#1a061a' },
    { character: 'The Mad Hatter', moment: 'The Eternal Tea Party', loreText: '"Why is a raven like a writing-desk?"', symbol: '🎩', gradientFrom: '#0a2e2e', gradientTo: '#061a1a' },
    { character: 'The Queen of Hearts', moment: 'Off With Their Heads!', loreText: '"Sentence first — verdict afterwards."', symbol: '♥️', gradientFrom: '#2e0a0a', gradientTo: '#1a0606' },
    { character: 'The White Rabbit', moment: 'Late for an Important Date', loreText: '"Oh dear! Oh dear! I shall be too late!"', symbol: '🐇', gradientFrom: '#2e2e2e', gradientTo: '#1a1a1a' },
    { character: 'The Caterpillar', moment: 'On the Mushroom', loreText: '"Who are you?" said the Caterpillar. This was not an encouraging opening for a conversation.', symbol: '🍄', gradientFrom: '#0a0a2e', gradientTo: '#06061a' },
    { character: 'Tweedledee & Tweedledum', moment: 'The Battle of the Rattle', loreText: '"Contrariwise, if it was so, it might be; and if it were so, it would be; but as it isn\'t, it ain\'t."', symbol: '👯', gradientFrom: '#1a2e0a', gradientTo: '#101a06' },
    { character: 'The March Hare', moment: 'Have Some Wine', loreText: '"Then you should say what you mean," the March Hare went on.', symbol: '🐰', gradientFrom: '#2e1a0a', gradientTo: '#1a1006' },
    { character: 'The Dormouse', moment: 'Asleep in the Teapot', loreText: '"Once upon a time there were three little sisters, and their names were Elsie, Lacie, and Tillie."', symbol: '🫖', gradientFrom: '#1a1a0a', gradientTo: '#101006' },
    { character: 'Alice', moment: 'Drink Me', loreText: '"It was all very well to say Drink me, but the wise little Alice was not going to do that in a hurry."', symbol: '🧪', gradientFrom: '#0a2e14', gradientTo: '#061a0c' },
    { character: 'Alice', moment: 'Eat Me', loreText: '"Curiouser and curiouser!" cried Alice.', symbol: '🍰', gradientFrom: '#2e2e14', gradientTo: '#1a1a0c' },
    { character: 'The Jabberwock', moment: 'The Vorpal Blade', loreText: '"Beware the Jabberwock, my son! The jaws that bite, the claws that catch!"', symbol: '🐉', gradientFrom: '#0a1a2e', gradientTo: '#06101a' },
    { character: 'The Knave of Hearts', moment: 'The Stolen Tarts', loreText: '"The Queen of Hearts, she made some tarts, all on a summer day."', symbol: '🥧', gradientFrom: '#2e0a14', gradientTo: '#1a060c' },
    { character: 'Alice', moment: 'The Croquet Game', loreText: '"Alice thought she had never seen such a curious croquet-ground in all her life."', symbol: '🦩', gradientFrom: '#2e1a1a', gradientTo: '#1a1010' },
    { character: 'The Mock Turtle', moment: 'The Lobster Quadrille', loreText: '"Will you walk a little faster?" said a whiting to a snail.', symbol: '🐢', gradientFrom: '#0a2e2e', gradientTo: '#061a1a' },
    { character: 'The Duchess', moment: 'Pepper and Pigs', loreText: '"If everybody minded their own business, the world would go round a deal faster than it does."', symbol: '🌶️', gradientFrom: '#2e140a', gradientTo: '#1a0c06' },
    { character: 'The King of Hearts', moment: 'The Trial', loreText: '"Begin at the beginning," the King said gravely, "and go on till you come to the end: then stop."', symbol: '♠️', gradientFrom: '#1a1a2e', gradientTo: '#10101a' },
    { character: 'Alice', moment: 'Growing Enormous', loreText: '"I almost wish I hadn\'t gone down that rabbit-hole — and yet — it\'s rather curious, you know, this sort of life!"', symbol: '📏', gradientFrom: '#1a2e1a', gradientTo: '#101a10' },
    { character: 'The Cheshire Cat', moment: 'Which Way to Go?', loreText: '"Would you tell me, please, which way I ought to go from here?" "That depends a good deal on where you want to get to."', symbol: '🔀', gradientFrom: '#2e1a2e', gradientTo: '#1a101a' },
    { character: 'Alice', moment: 'Waking Up', loreText: '"You\'re nothing but a pack of cards!"', symbol: '🃏', gradientFrom: '#2e2e0a', gradientTo: '#1a1a06' },
  ],
  'gothic-horror': [
    { character: 'Count Dracula', moment: 'The Castle at Night', loreText: '"Listen to them, the children of the night. What music they make!"', symbol: '🧛', gradientFrom: '#2e0a0a', gradientTo: '#1a0606' },
    { character: 'Count Dracula', moment: 'The Three Brides', loreText: '"I am Dracula, and I bid you welcome, Mr. Harker, to my house."', symbol: '🦇', gradientFrom: '#2e0a14', gradientTo: '#1a060c' },
    { character: 'Frankenstein\'s Monster', moment: 'Birth in the Laboratory', loreText: '"It was on a dreary night of November that I beheld the accomplishment of my toils."', symbol: '⚡', gradientFrom: '#0a2e0a', gradientTo: '#061a06' },
    { character: 'Frankenstein\'s Monster', moment: 'The Creature Reads', loreText: '"Of what a strange nature is knowledge! It clings to the mind, when it has once seized on it, like a lichen on the rock."', symbol: '📖', gradientFrom: '#142e14', gradientTo: '#0c1a0c' },
    { character: 'Dr. Jekyll', moment: 'The Transformation', loreText: '"I learned to recognise the thorough and primitive duality of man."', symbol: '🧪', gradientFrom: '#1a1a2e', gradientTo: '#10101a' },
    { character: 'Mr. Hyde', moment: 'The Night Prowl', loreText: '"He had in his hand a heavy cane, with which he was trifling; but he answered never a word."', symbol: '🌑', gradientFrom: '#0a0a0a', gradientTo: '#1a1a1a' },
    { character: 'The Phantom', moment: 'Behind the Mask', loreText: '"I am the Opera Ghost! I exist!"', symbol: '🎭', gradientFrom: '#2e2e2e', gradientTo: '#0a0a0a' },
    { character: 'The Phantom', moment: 'The Underground Lake', loreText: '"Your hand is cold, like the hand of death itself."', symbol: '🚣', gradientFrom: '#0a1a2e', gradientTo: '#06101a' },
    { character: 'Dorian Gray', moment: 'The Portrait Ages', loreText: '"The only way to get rid of temptation is to yield to it."', symbol: '🖼️', gradientFrom: '#2e1a0a', gradientTo: '#1a1006' },
    { character: 'The Invisible Man', moment: 'Unwrapping the Bandages', loreText: '"I went over the heads of the things a man reckons desirable. No doubt invisibility made it possible to get them, but it made it impossible to enjoy them when they are got."', symbol: '👻', gradientFrom: '#1a2e2e', gradientTo: '#101a1a' },
    { character: 'Victor Frankenstein', moment: 'Playing God', loreText: '"Beware; for I am fearless, and therefore powerful."', symbol: '🔬', gradientFrom: '#142e1a', gradientTo: '#0c1a10' },
    { character: 'Mina Harker', moment: 'The Bite Marks', loreText: '"I felt my strength fading away, and a numbness creeping over me."', symbol: '🩸', gradientFrom: '#2e0a1a', gradientTo: '#1a0610' },
    { character: 'Van Helsing', moment: 'The Vampire Hunter', loreText: '"We must be wise and we must be brave. There is a terrible task before us."', symbol: '✝️', gradientFrom: '#2e2e1a', gradientTo: '#1a1a10' },
    { character: 'The Headless Horseman', moment: 'The Midnight Ride', loreText: '"The dominant spirit that haunts this enchanted region is the apparition of a figure on horseback, without a head."', symbol: '🐴', gradientFrom: '#2e1a0a', gradientTo: '#1a1006' },
    { character: 'Dr. Moreau', moment: 'The Island of Beasts', loreText: '"Not to go on all-fours; that is the Law. Are we not Men?"', symbol: '🏝️', gradientFrom: '#0a2e1a', gradientTo: '#061a10' },
    { character: 'The Time Traveller', moment: 'The Machine Activates', loreText: '"We should strive to welcome change and challenges, because they are what help us grow."', symbol: '⏰', gradientFrom: '#0a1a2e', gradientTo: '#06101a' },
    { character: 'Captain Nemo', moment: 'The Nautilus Descends', loreText: '"The sea is everything. Its breath is pure and healthy. It is an immense desert, where man is never lonely."', symbol: '🐙', gradientFrom: '#0a142e', gradientTo: '#060c1a' },
    { character: 'Quasimodo', moment: 'The Bell Tower', loreText: '"He perceived that the world looked upon him with horror, and fled."', symbol: '🔔', gradientFrom: '#2e2a1a', gradientTo: '#1a180d' },
    { character: 'Renfield', moment: 'The Fly Eater', loreText: '"The blood is the life! The blood is the life!"', symbol: '🪰', gradientFrom: '#1a2e0a', gradientTo: '#101a06' },
    { character: 'Lucy Westenra', moment: 'The Sleepwalker', loreText: '"There was something about them that made me uneasy, some longing and at the same time some deadly fear."', symbol: '🌙', gradientFrom: '#1a0a2e', gradientTo: '#10061a' },
  ],
  'olympus': [
    { character: 'Odysseus', moment: 'Resisting the Sirens', loreText: '"Tell me, O Muse, of that ingenious hero who travelled far and wide."', symbol: '🚢', gradientFrom: '#0a1a2e', gradientTo: '#06101a' },
    { character: 'Achilles', moment: 'At the Gates of Troy', loreText: '"Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans."', symbol: '🛡️', gradientFrom: '#2e2a0a', gradientTo: '#1a180d' },
    { character: 'Medusa', moment: 'The Petrifying Gaze', loreText: '"Beyond all others she was famed for beauty, and the envious hope of many suitors."', symbol: '🐍', gradientFrom: '#0a2e14', gradientTo: '#061a0c' },
    { character: 'Perseus', moment: 'With the Head of Medusa', loreText: '"He swooped down upon them from the sky, for he was wearing the cap of Hades and neither gods nor mortals could see him."', symbol: '⚔️', gradientFrom: '#2e1a2e', gradientTo: '#1a101a' },
    { character: 'Athena', moment: 'In Battle Armor', loreText: '"Of Pallas Athena, guardian of the city, I begin to sing. Dread is she."', symbol: '🦉', gradientFrom: '#1a1a2e', gradientTo: '#10101a' },
    { character: 'Zeus', moment: 'Wielding the Thunderbolt', loreText: '"I am the mightiest of all. Make trial that ye may know."', symbol: '⚡', gradientFrom: '#2e2e0a', gradientTo: '#1a1a06' },
    { character: 'Poseidon', moment: 'Ruling the Deep', loreText: '"I received the grey sea to be my domain when the lots were shaken."', symbol: '🔱', gradientFrom: '#0a2e2e', gradientTo: '#061a1a' },
    { character: 'Hades', moment: 'On the Throne of the Underworld', loreText: '"He was lord of the dead — not death itself, not the Grim Reaper. He was the host."', symbol: '💀', gradientFrom: '#0a0a1a', gradientTo: '#060610' },
    { character: 'Hercules', moment: 'The Twelve Labors', loreText: '"He performed twelve labors, though he could have refused and still been a god among men."', symbol: '💪', gradientFrom: '#2e1a1a', gradientTo: '#1a1010' },
    { character: 'Odysseus', moment: 'The Cyclops Cave', loreText: '"My name is Nobody: mother and father call me Nobody, as do all the others who are my companions."', symbol: '👁️', gradientFrom: '#2e2e2e', gradientTo: '#1a1a1a' },
    { character: 'Helen of Troy', moment: 'The Face That Launched a Thousand Ships', loreText: '"Was this the face that launch\'d a thousand ships, and burnt the topless towers of Ilium?"', symbol: '🏛️', gradientFrom: '#2e0a2e', gradientTo: '#1a061a' },
    { character: 'Icarus', moment: 'Flying Too Close to the Sun', loreText: '"And Icarus, his son, stood by and watched him, not knowing that he was handling his own doom."', symbol: '☀️', gradientFrom: '#2e2a14', gradientTo: '#1a180c' },
    { character: 'Prometheus', moment: 'Stealing Fire', loreText: '"He stole from heaven the fire of the gods and brought it to earth."', symbol: '🔥', gradientFrom: '#2e140a', gradientTo: '#1a0c06' },
    { character: 'Orpheus', moment: 'In the Underworld', loreText: '"He sang, and all the shadows wept."', symbol: '🎵', gradientFrom: '#1a0a2e', gradientTo: '#10061a' },
    { character: 'Circe', moment: 'The Enchantress', loreText: '"Come to my house and share my meat and wine."', symbol: '✨', gradientFrom: '#2e1a2e', gradientTo: '#1a101a' },
    { character: 'The Minotaur', moment: 'In the Labyrinth', loreText: '"He devoured seven youths and seven maidens, sent as tribute from Athens."', symbol: '🐂', gradientFrom: '#2e0a0a', gradientTo: '#1a0606' },
    { character: 'Ares', moment: 'The God of War', loreText: '"Ares, exceeding in strength, chariot-rider, golden-helmed, doughty in heart."', symbol: '⚔️', gradientFrom: '#2e1414', gradientTo: '#1a0c0c' },
    { character: 'Apollo', moment: 'The Sun Chariot', loreText: '"Far-shooting Apollo — let me sing of you."', symbol: '🏹', gradientFrom: '#2e2e14', gradientTo: '#1a1a0c' },
    { character: 'Pandora', moment: 'Opening the Box', loreText: '"Only Hope remained there in an unbreakable home within, under the rim of the great jar."', symbol: '📦', gradientFrom: '#0a0a2e', gradientTo: '#06061a' },
    { character: 'Odysseus', moment: 'The Bow of Odysseus', loreText: '"And Odysseus of many wiles stripped him of his rags and sprang to the great threshold with his bow and his quiver full of arrows."', symbol: '🏹', gradientFrom: '#1a2e14', gradientTo: '#101a0c' },
  ],
};

const scarcities: Scarcity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const parallels: Parallel[] = ['base', 'silver', 'gold', 'holographic', 'obsidian'];

function getMaxSerial(scarcity: Scarcity): number {
  const maxSerials: Record<Scarcity, number> = {
    common: 9999,
    uncommon: 1000,
    rare: 250,
    epic: 50,
    legendary: 10,
  };
  return maxSerials[scarcity];
}

function generatePrice(scarcity: Scarcity, parallel: Parallel): number {
  const basePrice: Record<Scarcity, number> = {
    common: 1, uncommon: 5, rare: 25, epic: 100, legendary: 500,
  };
  const multiplier: Record<Parallel, number> = {
    base: 1, silver: 1.5, gold: 3, holographic: 5, obsidian: 20,
  };
  const base = basePrice[scarcity] * multiplier[parallel];
  return Math.round(base * (0.8 + Math.random() * 0.4) * 100) / 100;
}

// Generate a curated subset of cards (100 cards for MVP)
export function generateCards(): Card[] {
  const cards: Card[] = [];
  let idCounter = 1;

  for (const [setSlug, characters] of Object.entries(SET_CHARACTERS)) {
    const setName = {
      'baker-street': 'Baker Street Files',
      'enchanted-kingdom': 'The Enchanted Kingdom',
      'wonderland': 'Wonderland Descending',
      'gothic-horror': 'The Castle of Otranto',
      'olympus': 'Olympus Rising',
    }[setSlug]!;

    // For each character in the set, generate 1 card with random scarcity/parallel
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      // Distribute scarcities: first few are common, last few are legendary
      const scarcityIndex = Math.min(Math.floor(i / 4), 4);
      const scarcity = scarcities[scarcityIndex];
      // Distribute parallels
      const parallel = parallels[i % 5];
      const maxSerial = getMaxSerial(scarcity);
      const serialNumber = Math.floor(Math.random() * maxSerial) + 1;

      cards.push({
        id: `card-${idCounter++}`,
        name: `${char.character} — ${char.moment}`,
        character: char.character,
        set: setName,
        setSlug,
        moment: char.moment,
        scarcity,
        parallel,
        serialNumber,
        maxSerial,
        loreText: char.loreText,
        price: generatePrice(scarcity, parallel),
        listed: Math.random() > 0.6,
        owned: Math.random() > 0.3,
        gradientFrom: char.gradientFrom,
        gradientTo: char.gradientTo,
        symbol: char.symbol,
      });
    }
  }

  return cards;
}

// Pre-generate for SSR
export const ALL_CARDS = generateCards();
export const OWNED_CARDS = ALL_CARDS.filter(c => c.owned);
export const LISTED_CARDS = ALL_CARDS.filter(c => c.listed);
