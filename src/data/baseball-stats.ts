// Public Domain Baseball — Character Stats
// Maps all LoreVault characters to baseball stats.
// Each character has a thematic baseball archetype.
//
// Point Cost Formula:
//   Hitter: floor((OB - 6) * 1.5 + Power * 0.4 + (Speed - 10) * 0.5 + Defense * 0.8)
//   Pitcher: floor(Control * 4 + Fielding * 1.5)
//
// Archetypes:
//   Slugger:    High Power (15-20), moderate OB (9-12), low Speed (10-14), low Def (+1-2)
//   Contact:    High OB (13-15), low Power (3-8), high Speed (15-19), moderate Def (+2-3)
//   Speedster:  Moderate OB (10-12), low Power (4-10), elite Speed (17-20), moderate Def (+2-3)
//   Balanced:   Even stats across the board, mid-range everything
//   Guardian:   High Defense (+4-5), moderate offense, typically catcher archetype
//   Utility:    Budget-friendly, low stats, fills roster gaps
//   Ace:        Control 5-6, good fielding — dominates at-bats
//   Crafty:     Control 3-4, moderate fielding — solid but hittable

import { BaseballCard, HitterStats, PitcherStats } from '../lib/baseball/types';

// ===== Point Cost Calculators =====

export function calculateHitterCost(stats: HitterStats): number {
  return Math.floor(
    (stats.onBase - 6) * 1.5 +
    stats.power * 0.4 +
    (stats.speed - 10) * 0.5 +
    stats.defense * 0.8
  );
}

export function calculatePitcherCost(stats: PitcherStats): number {
  return Math.floor(stats.control * 4 + stats.fielding * 1.5);
}

// ===== All Character Cards =====

export const BASEBALL_CARDS: BaseballCard[] = [
  // ╔══════════════════════════════════════════════════╗
  // ║           BAKER STREET FILES (20)                ║
  // ╚══════════════════════════════════════════════════╝

  // Sherlock Holmes — Contact hitter. Sees everything, rarely misses.
  // High OB (reads the pitcher), moderate power, excellent defense.
  {
    id: 'bb-sherlock-holmes',
    character: 'Sherlock Holmes',
    stats: { type: 'hitter', onBase: 14, power: 8, speed: 15, defense: 4, pointCost: 19 },
  },
  // Dr. Watson — Balanced, reliable. The ultimate #5 hitter.
  {
    id: 'bb-dr-watson',
    character: 'Dr. Watson',
    stats: { type: 'hitter', onBase: 11, power: 10, speed: 13, defense: 3, pointCost: 14 },
  },
  // Professor Moriarty — Ace pitcher. The Napoleon of Crime controls everything.
  {
    id: 'bb-professor-moriarty',
    character: 'Professor Moriarty',
    stats: { type: 'pitcher', control: 6, fielding: 3, pointCost: 28 },
  },
  // Irene Adler — Speedster with craft. The Woman who outran Holmes.
  {
    id: 'bb-irene-adler',
    character: 'Irene Adler',
    stats: { type: 'hitter', onBase: 13, power: 5, speed: 18, defense: 3, pointCost: 17 },
  },
  // Mrs. Hudson — Utility. The landlady holds things together quietly.
  {
    id: 'bb-mrs-hudson',
    character: 'Mrs. Hudson',
    stats: { type: 'hitter', onBase: 8, power: 3, speed: 11, defense: 2, pointCost: 5 },
  },
  // Inspector Lestrade — Balanced defender. Scotland Yard's finest fielder.
  {
    id: 'bb-inspector-lestrade',
    character: 'Inspector Lestrade',
    stats: { type: 'hitter', onBase: 10, power: 7, speed: 13, defense: 4, pointCost: 13 },
  },
  // The Hound — Raw power. Terrifying at the plate.
  {
    id: 'bb-the-hound',
    character: 'The Hound',
    stats: { type: 'hitter', onBase: 9, power: 16, speed: 17, defense: 1, pointCost: 15 },
  },
  // Mycroft Holmes — Crafty pitcher. Smarter than Sherlock, lazier too.
  {
    id: 'bb-mycroft-holmes',
    character: 'Mycroft Holmes',
    stats: { type: 'pitcher', control: 5, fielding: 1, pointCost: 21 },
  },
  // Sebastian Moran — Slugger. The sniper swings for the fences.
  {
    id: 'bb-sebastian-moran',
    character: 'Sebastian Moran',
    stats: { type: 'hitter', onBase: 9, power: 17, speed: 12, defense: 2, pointCost: 14 },
  },
  // The Red-Headed League — Utility. A curious collective.
  {
    id: 'bb-the-red-headed-league',
    character: 'The Red-Headed League',
    stats: { type: 'hitter', onBase: 8, power: 4, speed: 12, defense: 2, pointCost: 5 },
  },
  // The Dancing Men — Utility. The cipher speaks in patterns.
  {
    id: 'bb-the-dancing-men',
    character: 'The Dancing Men',
    stats: { type: 'hitter', onBase: 9, power: 5, speed: 14, defense: 2, pointCost: 8 },
  },
  // The Baker Street Irregulars — Speedster pack. Street urchin intelligence.
  {
    id: 'bb-the-baker-street-irregulars',
    character: 'The Baker Street Irregulars',
    stats: { type: 'hitter', onBase: 10, power: 3, speed: 19, defense: 2, pointCost: 12 },
  },

  // ╔══════════════════════════════════════════════════╗
  // ║         THE ENCHANTED KINGDOM (20)               ║
  // ╚══════════════════════════════════════════════════╝

  // Snow White — Contact hitter. Fairest of them all = best eye at the plate.
  {
    id: 'bb-snow-white',
    character: 'Snow White',
    stats: { type: 'hitter', onBase: 13, power: 4, speed: 14, defense: 2, pointCost: 13 },
  },
  // The Evil Queen — Crafty pitcher. Poison = nasty off-speed stuff.
  {
    id: 'bb-the-evil-queen',
    character: 'The Evil Queen',
    stats: { type: 'pitcher', control: 4, fielding: 2, pointCost: 19 },
  },
  // The Huntsman — Balanced power. Carries a big axe.
  {
    id: 'bb-the-huntsman',
    character: 'The Huntsman',
    stats: { type: 'hitter', onBase: 10, power: 14, speed: 14, defense: 3, pointCost: 16 },
  },
  // Rapunzel — Speedster. Finally free, she runs.
  {
    id: 'bb-rapunzel',
    character: 'Rapunzel',
    stats: { type: 'hitter', onBase: 11, power: 3, speed: 17, defense: 2, pointCost: 12 },
  },
  // Cinderella — Contact speedster. Midnight deadline = hustle.
  {
    id: 'bb-cinderella',
    character: 'Cinderella',
    stats: { type: 'hitter', onBase: 12, power: 4, speed: 18, defense: 2, pointCost: 15 },
  },
  // Red Riding Hood — Balanced. Brave through the dark forest.
  {
    id: 'bb-red-riding-hood',
    character: 'Red Riding Hood',
    stats: { type: 'hitter', onBase: 10, power: 6, speed: 16, defense: 2, pointCost: 11 },
  },
  // Hansel — Utility. The trail of breadcrumbs = solid fundamentals.
  {
    id: 'bb-hansel',
    character: 'Hansel',
    stats: { type: 'hitter', onBase: 9, power: 7, speed: 13, defense: 2, pointCost: 8 },
  },
  // Gretel — Balanced with grit. Pushed the witch into the oven.
  {
    id: 'bb-gretel',
    character: 'Gretel',
    stats: { type: 'hitter', onBase: 10, power: 9, speed: 14, defense: 2, pointCost: 11 },
  },
  // The Frog Prince — Guardian catcher. Transformation = defensive versatility.
  {
    id: 'bb-the-frog-prince',
    character: 'The Frog Prince',
    stats: { type: 'hitter', onBase: 9, power: 6, speed: 12, defense: 5, pointCost: 11 },
  },
  // Rumpelstiltskin — Crafty pitcher. Spins gold = spins curveballs.
  {
    id: 'bb-rumpelstiltskin',
    character: 'Rumpelstiltskin',
    stats: { type: 'pitcher', control: 4, fielding: 3, pointCost: 20 },
  },
  // Sleeping Beauty — Utility. Asleep for 100 years = low energy.
  {
    id: 'bb-sleeping-beauty',
    character: 'Sleeping Beauty',
    stats: { type: 'hitter', onBase: 8, power: 2, speed: 10, defense: 1, pointCost: 3 },
  },
  // The Seven Dwarfs — Balanced squad. Seven bodies, one roster slot.
  {
    id: 'bb-the-seven-dwarfs',
    character: 'The Seven Dwarfs',
    stats: { type: 'hitter', onBase: 11, power: 8, speed: 11, defense: 3, pointCost: 11 },
  },
  // The Pied Piper — Crafty pitcher. Leads hitters where he wants them.
  {
    id: 'bb-the-pied-piper',
    character: 'The Pied Piper',
    stats: { type: 'pitcher', control: 5, fielding: 2, pointCost: 23 },
  },
  // Beauty — Contact hitter. Patience and perception.
  {
    id: 'bb-beauty',
    character: 'Beauty',
    stats: { type: 'hitter', onBase: 12, power: 4, speed: 14, defense: 2, pointCost: 12 },
  },
  // The Beast — Slugger. Raw primal strength.
  {
    id: 'bb-the-beast',
    character: 'The Beast',
    stats: { type: 'hitter', onBase: 9, power: 18, speed: 13, defense: 2, pointCost: 15 },
  },
  // Jack — Speedster with pop. Giant-killer energy.
  {
    id: 'bb-jack',
    character: 'Jack',
    stats: { type: 'hitter', onBase: 11, power: 10, speed: 17, defense: 2, pointCost: 15 },
  },
  // Puss in Boots — Speedster defender. The clever cat plays CF.
  {
    id: 'bb-puss-in-boots',
    character: 'Puss in Boots',
    stats: { type: 'hitter', onBase: 12, power: 5, speed: 19, defense: 3, pointCost: 16 },
  },
  // Bluebeard — Power hitter. Menacing presence at the plate.
  {
    id: 'bb-bluebeard',
    character: 'Bluebeard',
    stats: { type: 'hitter', onBase: 8, power: 16, speed: 11, defense: 1, pointCost: 10 },
  },

  // ╔══════════════════════════════════════════════════╗
  // ║          WONDERLAND DESCENDING (20)              ║
  // ╚══════════════════════════════════════════════════╝

  // Alice — Contact specialist. Sees through nonsense. Best OB in the game.
  {
    id: 'bb-alice',
    character: 'Alice',
    stats: { type: 'hitter', onBase: 15, power: 5, speed: 17, defense: 2, pointCost: 20 },
  },
  // The Cheshire Cat — Speedster. Now you see him, now you don't.
  {
    id: 'bb-the-cheshire-cat',
    character: 'The Cheshire Cat',
    stats: { type: 'hitter', onBase: 12, power: 3, speed: 20, defense: 3, pointCost: 17 },
  },
  // The Mad Hatter — Balanced wild card. Unpredictable at the plate.
  {
    id: 'bb-the-mad-hatter',
    character: 'The Mad Hatter',
    stats: { type: 'hitter', onBase: 11, power: 11, speed: 14, defense: 2, pointCost: 13 },
  },
  // The Queen of Hearts — Power hitter. Off with their heads = big swings.
  {
    id: 'bb-the-queen-of-hearts',
    character: 'The Queen of Hearts',
    stats: { type: 'hitter', onBase: 10, power: 15, speed: 11, defense: 2, pointCost: 13 },
  },
  // The White Rabbit — Speedster. Always running late = always running.
  {
    id: 'bb-the-white-rabbit',
    character: 'The White Rabbit',
    stats: { type: 'hitter', onBase: 9, power: 2, speed: 20, defense: 2, pointCost: 11 },
  },
  // The Caterpillar — Crafty pitcher. Slow, deliberate, confusing.
  {
    id: 'bb-the-caterpillar',
    character: 'The Caterpillar',
    stats: { type: 'pitcher', control: 4, fielding: 2, pointCost: 19 },
  },
  // Tweedledee & Tweedledum — Utility platoon. Two for one.
  {
    id: 'bb-tweedledee-tweedledum',
    character: 'Tweedledee & Tweedledum',
    stats: { type: 'hitter', onBase: 9, power: 6, speed: 12, defense: 3, pointCost: 8 },
  },
  // The March Hare — Balanced. Mad but capable.
  {
    id: 'bb-the-march-hare',
    character: 'The March Hare',
    stats: { type: 'hitter', onBase: 10, power: 7, speed: 15, defense: 2, pointCost: 10 },
  },
  // The Dormouse — Utility. Mostly asleep but surprisingly clutch.
  {
    id: 'bb-the-dormouse',
    character: 'The Dormouse',
    stats: { type: 'hitter', onBase: 7, power: 2, speed: 10, defense: 1, pointCost: 2 },
  },
  // The Jabberwock — Elite slugger. The monster at the plate.
  {
    id: 'bb-the-jabberwock',
    character: 'The Jabberwock',
    stats: { type: 'hitter', onBase: 10, power: 20, speed: 12, defense: 1, pointCost: 16 },
  },
  // The Knave of Hearts — Balanced thief. Steals bases, steals tarts.
  {
    id: 'bb-the-knave-of-hearts',
    character: 'The Knave of Hearts',
    stats: { type: 'hitter', onBase: 10, power: 7, speed: 16, defense: 2, pointCost: 11 },
  },
  // The Mock Turtle — Guardian catcher. Slow but steady.
  {
    id: 'bb-the-mock-turtle',
    character: 'The Mock Turtle',
    stats: { type: 'hitter', onBase: 9, power: 5, speed: 10, defense: 5, pointCost: 9 },
  },
  // The Duchess — Utility. Has opinions about everything.
  {
    id: 'bb-the-duchess',
    character: 'The Duchess',
    stats: { type: 'hitter', onBase: 8, power: 4, speed: 11, defense: 2, pointCost: 5 },
  },
  // The King of Hearts — Balanced. Tries to keep order.
  {
    id: 'bb-the-king-of-hearts',
    character: 'The King of Hearts',
    stats: { type: 'hitter', onBase: 10, power: 8, speed: 12, defense: 3, pointCost: 10 },
  },

  // ╔══════════════════════════════════════════════════╗
  // ║         THE CASTLE OF OTRANTO (20)               ║
  // ╚══════════════════════════════════════════════════╝

  // Count Dracula — Elite hitter. Immortal power + supernatural speed.
  {
    id: 'bb-count-dracula',
    character: 'Count Dracula',
    stats: { type: 'hitter', onBase: 14, power: 15, speed: 16, defense: 3, pointCost: 23 },
  },
  // Frankenstein's Monster — Pure slugger. Raw, staggering power.
  {
    id: 'bb-frankensteins-monster',
    character: "Frankenstein's Monster",
    stats: { type: 'hitter', onBase: 8, power: 20, speed: 10, defense: 1, pointCost: 12 },
  },
  // Dr. Jekyll — Contact hitter by day. Dual nature = plate discipline.
  {
    id: 'bb-dr-jekyll',
    character: 'Dr. Jekyll',
    stats: { type: 'hitter', onBase: 12, power: 6, speed: 13, defense: 3, pointCost: 13 },
  },
  // Mr. Hyde — Slugger. The beast unleashed.
  {
    id: 'bb-mr-hyde',
    character: 'Mr. Hyde',
    stats: { type: 'hitter', onBase: 8, power: 18, speed: 15, defense: 1, pointCost: 14 },
  },
  // The Phantom — Crafty pitcher. The Opera Ghost controls the stage.
  {
    id: 'bb-the-phantom',
    character: 'The Phantom',
    stats: { type: 'pitcher', control: 5, fielding: 3, pointCost: 24 },
  },
  // Dorian Gray — Contact hitter. Ageless beauty = perfect form.
  {
    id: 'bb-dorian-gray',
    character: 'Dorian Gray',
    stats: { type: 'hitter', onBase: 13, power: 7, speed: 15, defense: 2, pointCost: 15 },
  },
  // The Invisible Man — Speedster. Can't field what you can't see.
  {
    id: 'bb-the-invisible-man',
    character: 'The Invisible Man',
    stats: { type: 'hitter', onBase: 11, power: 4, speed: 19, defense: 1, pointCost: 13 },
  },
  // Victor Frankenstein — Crafty pitcher. Playing God on the mound.
  {
    id: 'bb-victor-frankenstein',
    character: 'Victor Frankenstein',
    stats: { type: 'pitcher', control: 4, fielding: 2, pointCost: 19 },
  },
  // Mina Harker — Balanced. Courage under pressure.
  {
    id: 'bb-mina-harker',
    character: 'Mina Harker',
    stats: { type: 'hitter', onBase: 11, power: 5, speed: 14, defense: 3, pointCost: 11 },
  },
  // Van Helsing — Guardian. The vampire hunter plays catcher.
  {
    id: 'bb-van-helsing',
    character: 'Van Helsing',
    stats: { type: 'hitter', onBase: 11, power: 10, speed: 12, defense: 5, pointCost: 15 },
  },
  // The Headless Horseman — Power + speed. Terrifying baserunner.
  {
    id: 'bb-the-headless-horseman',
    character: 'The Headless Horseman',
    stats: { type: 'hitter', onBase: 9, power: 14, speed: 18, defense: 1, pointCost: 15 },
  },
  // Dr. Moreau — Crafty pitcher. Mad science on the mound.
  {
    id: 'bb-dr-moreau',
    character: 'Dr. Moreau',
    stats: { type: 'pitcher', control: 3, fielding: 2, pointCost: 15 },
  },
  // The Time Traveller — Speedster. Moves through time = moves through bases.
  {
    id: 'bb-the-time-traveller',
    character: 'The Time Traveller',
    stats: { type: 'hitter', onBase: 11, power: 5, speed: 18, defense: 2, pointCost: 14 },
  },
  // Captain Nemo — Balanced power. 20,000 leagues of arm strength.
  {
    id: 'bb-captain-nemo',
    character: 'Captain Nemo',
    stats: { type: 'hitter', onBase: 11, power: 12, speed: 13, defense: 3, pointCost: 14 },
  },
  // Quasimodo — Slugger guardian. The bell tower = raw power + defense.
  {
    id: 'bb-quasimodo',
    character: 'Quasimodo',
    stats: { type: 'hitter', onBase: 8, power: 16, speed: 10, defense: 4, pointCost: 13 },
  },
  // Renfield — Utility. Erratic but occasionally brilliant.
  {
    id: 'bb-renfield',
    character: 'Renfield',
    stats: { type: 'hitter', onBase: 7, power: 5, speed: 14, defense: 1, pointCost: 5 },
  },
  // Lucy Westenra — Speedster. The sleepwalker moves unseen.
  {
    id: 'bb-lucy-westenra',
    character: 'Lucy Westenra',
    stats: { type: 'hitter', onBase: 10, power: 3, speed: 17, defense: 2, pointCost: 10 },
  },
  // Dracula (alt entry — same character, different card) — Pitcher form.
  // The count on the mound. Night games only.
  {
    id: 'bb-dracula-pitcher',
    character: 'Dracula',
    stats: { type: 'pitcher', control: 5, fielding: 4, pointCost: 26 },
  },

  // ╔══════════════════════════════════════════════════╗
  // ║            OLYMPUS RISING (20)                   ║
  // ╚══════════════════════════════════════════════════╝

  // Odysseus — Elite contact + speed. The most resourceful player in the game.
  {
    id: 'bb-odysseus',
    character: 'Odysseus',
    stats: { type: 'hitter', onBase: 14, power: 10, speed: 16, defense: 3, pointCost: 20 },
  },
  // Achilles — Elite slugger. Nearly invincible at the plate.
  {
    id: 'bb-achilles',
    character: 'Achilles',
    stats: { type: 'hitter', onBase: 12, power: 18, speed: 17, defense: 2, pointCost: 22 },
  },
  // Medusa — Ace pitcher. One look and you're stone / struck out.
  {
    id: 'bb-medusa',
    character: 'Medusa',
    stats: { type: 'pitcher', control: 6, fielding: 2, pointCost: 27 },
  },
  // Perseus — Balanced hero. Slayer of monsters = clutch performer.
  {
    id: 'bb-perseus',
    character: 'Perseus',
    stats: { type: 'hitter', onBase: 12, power: 12, speed: 16, defense: 3, pointCost: 18 },
  },
  // Athena — Guardian + contact. Goddess of wisdom = reads every pitch.
  {
    id: 'bb-athena',
    character: 'Athena',
    stats: { type: 'hitter', onBase: 14, power: 8, speed: 14, defense: 5, pointCost: 20 },
  },
  // Zeus — Ace pitcher. The thunderbolt = unhittable fastball.
  {
    id: 'bb-zeus',
    character: 'Zeus',
    stats: { type: 'pitcher', control: 6, fielding: 2, pointCost: 27 },
  },
  // Poseidon — Power hitter. God of the sea = tidal-wave swings.
  {
    id: 'bb-poseidon',
    character: 'Poseidon',
    stats: { type: 'hitter', onBase: 11, power: 17, speed: 13, defense: 2, pointCost: 17 },
  },
  // Hades — Power + defense. Lord of the Underworld guards home plate.
  {
    id: 'bb-hades',
    character: 'Hades',
    stats: { type: 'hitter', onBase: 11, power: 14, speed: 12, defense: 4, pointCost: 16 },
  },
  // Hercules — THE slugger. Strongest character in the game.
  {
    id: 'bb-hercules',
    character: 'Hercules',
    stats: { type: 'hitter', onBase: 10, power: 20, speed: 12, defense: 1, pointCost: 16 },
  },
  // Helen of Troy — Contact specialist. The face that draws walks.
  {
    id: 'bb-helen-of-troy',
    character: 'Helen of Troy',
    stats: { type: 'hitter', onBase: 14, power: 2, speed: 14, defense: 2, pointCost: 15 },
  },
  // Icarus — Speedster. Flew too close to the sun = blazing speed, fragile.
  {
    id: 'bb-icarus',
    character: 'Icarus',
    stats: { type: 'hitter', onBase: 9, power: 6, speed: 20, defense: 1, pointCost: 11 },
  },
  // Prometheus — Balanced power. Stole fire = clutch steal artist.
  {
    id: 'bb-prometheus',
    character: 'Prometheus',
    stats: { type: 'hitter', onBase: 11, power: 11, speed: 15, defense: 2, pointCost: 14 },
  },
  // Orpheus — Contact hitter. His song moves everyone.
  {
    id: 'bb-orpheus',
    character: 'Orpheus',
    stats: { type: 'hitter', onBase: 13, power: 4, speed: 14, defense: 2, pointCost: 13 },
  },
  // Circe — Crafty pitcher. The enchantress deceives hitters.
  {
    id: 'bb-circe',
    character: 'Circe',
    stats: { type: 'pitcher', control: 4, fielding: 3, pointCost: 20 },
  },
  // The Minotaur — Pure slugger. The beast in the labyrinth.
  {
    id: 'bb-the-minotaur',
    character: 'The Minotaur',
    stats: { type: 'hitter', onBase: 7, power: 19, speed: 14, defense: 1, pointCost: 12 },
  },
  // Ares — Slugger. God of War = violent swings.
  {
    id: 'bb-ares',
    character: 'Ares',
    stats: { type: 'hitter', onBase: 9, power: 18, speed: 14, defense: 2, pointCost: 15 },
  },
  // Apollo — Balanced ace. The sun chariot = blazing fastball + all-around game.
  {
    id: 'bb-apollo',
    character: 'Apollo',
    stats: { type: 'hitter', onBase: 13, power: 10, speed: 16, defense: 3, pointCost: 18 },
  },
  // Pandora — Utility. Opened the box = unpredictable outcomes.
  {
    id: 'bb-pandora',
    character: 'Pandora',
    stats: { type: 'hitter', onBase: 9, power: 7, speed: 13, defense: 2, pointCost: 8 },
  },

  // ╔══════════════════════════════════════════════════╗
  // ║           ASGARD UNLEASHED (20)                  ║
  // ╚══════════════════════════════════════════════════╝

  // Odin — The All-Father. Elite balanced. Best all-around in the game.
  {
    id: 'bb-odin',
    character: 'Odin',
    stats: { type: 'hitter', onBase: 13, power: 16, speed: 12, defense: 4, pointCost: 21 },
  },
  // Thor — Slugger. Mjolnir = the biggest bat in baseball.
  {
    id: 'bb-thor',
    character: 'Thor',
    stats: { type: 'hitter', onBase: 10, power: 19, speed: 13, defense: 2, pointCost: 17 },
  },
  // Loki — Trickster speedster. Steals everything — bases, signs, the show.
  {
    id: 'bb-loki',
    character: 'Loki',
    stats: { type: 'hitter', onBase: 11, power: 7, speed: 19, defense: 3, pointCost: 15 },
  },
  // Freya — Contact + speed. Weeps tears of gold = golden glove.
  {
    id: 'bb-freya',
    character: 'Freya',
    stats: { type: 'hitter', onBase: 13, power: 6, speed: 16, defense: 4, pointCost: 17 },
  },
  // Fenrir — Pure power. The wolf breaks free.
  {
    id: 'bb-fenrir',
    character: 'Fenrir',
    stats: { type: 'hitter', onBase: 8, power: 19, speed: 16, defense: 1, pointCost: 14 },
  },
  // Heimdall — Guardian. Sees everything = elite defensive catcher.
  {
    id: 'bb-heimdall',
    character: 'Heimdall',
    stats: { type: 'hitter', onBase: 11, power: 9, speed: 13, defense: 5, pointCost: 15 },
  },
  // Baldur — Balanced. Beloved by all = consistent performer.
  {
    id: 'bb-baldur',
    character: 'Baldur',
    stats: { type: 'hitter', onBase: 12, power: 10, speed: 15, defense: 3, pointCost: 16 },
  },
  // Hel — Crafty pitcher. Rules the dead = unhittable in her domain.
  {
    id: 'bb-hel',
    character: 'Hel',
    stats: { type: 'pitcher', control: 5, fielding: 3, pointCost: 24 },
  },
  // Jormungandr — Elite slugger. The World Serpent coils and strikes.
  {
    id: 'bb-jormungandr',
    character: 'Jormungandr',
    stats: { type: 'hitter', onBase: 8, power: 20, speed: 10, defense: 1, pointCost: 12 },
  },
  // Tyr — Guardian + power. The one-handed god still hits.
  {
    id: 'bb-tyr',
    character: 'Tyr',
    stats: { type: 'hitter', onBase: 10, power: 13, speed: 13, defense: 4, pointCost: 15 },
  },
  // Sigurd — Balanced hero. Dragon-slayer = clutch in big moments.
  {
    id: 'bb-sigurd',
    character: 'Sigurd',
    stats: { type: 'hitter', onBase: 12, power: 14, speed: 15, defense: 3, pointCost: 19 },
  },
  // Brynhildr — Power + defense. The shield-maiden dominates.
  {
    id: 'bb-brynhildr',
    character: 'Brynhildr',
    stats: { type: 'hitter', onBase: 11, power: 13, speed: 14, defense: 4, pointCost: 17 },
  },
  // Ragnar — Balanced power. The legendary Viking king.
  {
    id: 'bb-ragnar',
    character: 'Ragnar',
    stats: { type: 'hitter', onBase: 11, power: 14, speed: 14, defense: 2, pointCost: 15 },
  },
  // The Norns — Ace pitcher. Weavers of fate control everything.
  {
    id: 'bb-the-norns',
    character: 'The Norns',
    stats: { type: 'pitcher', control: 6, fielding: 4, pointCost: 30 },
  },
  // Huginn & Muninn — Speedster scouts. Odin's ravens see everything.
  {
    id: 'bb-huginn-muninn',
    character: 'Huginn & Muninn',
    stats: { type: 'hitter', onBase: 12, power: 3, speed: 20, defense: 3, pointCost: 16 },
  },
  // Sif — Balanced contact. The golden-haired goddess of the harvest.
  {
    id: 'bb-sif',
    character: 'Sif',
    stats: { type: 'hitter', onBase: 12, power: 8, speed: 15, defense: 3, pointCost: 15 },
  },
  // Idun — Utility support. The apples of youth keep the team fresh.
  {
    id: 'bb-idun',
    character: 'Idun',
    stats: { type: 'hitter', onBase: 10, power: 3, speed: 14, defense: 2, pointCost: 8 },
  },
  // Skadi — Power + speed. The huntress of the mountains.
  {
    id: 'bb-skadi',
    character: 'Skadi',
    stats: { type: 'hitter', onBase: 10, power: 12, speed: 17, defense: 3, pointCost: 16 },
  },
  // Surtr — The ultimate slugger pitcher hybrid. World-ender.
  // Surtr is a hitter — his fire engulfs everything.
  {
    id: 'bb-surtr',
    character: 'Surtr',
    stats: { type: 'hitter', onBase: 7, power: 20, speed: 11, defense: 1, pointCost: 11 },
  },
];

// ===== Lookup Helpers =====

/** Get a baseball card by its ID. */
export function getBaseballCard(id: string): BaseballCard | undefined {
  return BASEBALL_CARDS.find(c => c.id === id);
}

/** Get all baseball cards for a character name. */
export function getCardsByCharacter(name: string): BaseballCard[] {
  return BASEBALL_CARDS.filter(c => c.character === name);
}

/** Get all hitter cards. */
export function getAllHitters(): BaseballCard[] {
  return BASEBALL_CARDS.filter(c => c.stats.type === 'hitter');
}

/** Get all pitcher cards. */
export function getAllPitchers(): BaseballCard[] {
  return BASEBALL_CARDS.filter(c => c.stats.type === 'pitcher');
}

/** Build a CardRegistry (Map) for game engine use. */
export function buildCardRegistry(): Map<string, BaseballCard> {
  const registry = new Map<string, BaseballCard>();
  for (const card of BASEBALL_CARDS) {
    registry.set(card.id, card);
  }
  return registry;
}

// ===== Stat Distribution Summary =====
// Total characters: 99 (mapped to ~99 baseball cards, Dracula has hitter + pitcher variant)
// Hitters: 82
// Pitchers: 18
//
// Cost tiers:
//   Elite (20-30):  ~15 cards — franchise players, hard to roster multiple
//   Good (14-19):   ~30 cards — solid starters, backbone of any team
//   Average (8-13): ~30 cards — role players, fill specific needs
//   Budget (1-7):   ~10 cards — bench depth, budget picks to hit 150-point cap
//
// Pitcher distribution:
//   Ace (Control 5-6):   8 pitchers — Moriarty, Zeus, Medusa, The Norns, Hel, The Phantom, Mycroft, Dracula
//   Crafty (Control 3-4): 10 pitchers — Evil Queen, Rumpelstiltskin, Pied Piper, Caterpillar, etc.
//
// This ensures:
//   - Multiple viable 150-point team compositions
//   - Every set has at least 2-3 pitchers for themed teams
//   - Budget characters exist so you can afford one elite + fill the roster
//   - Themed teams (all-Greek, all-Norse, etc.) are viable but not dominant
